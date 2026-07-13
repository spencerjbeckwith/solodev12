import { Coord } from "../types";
import { getCoordKey, headingToVector } from "../utils";
import { Carrier } from "./entities/carrier";
import { RunState } from "./state";

/** Decision function returns a vector (Coord) the Carrier should attempt to move on */
export type DecisionFunction = (carrier: Carrier, s: RunState) => Coord;

export interface Rule {
    help: string;
    firstTickStraight: boolean;
    decision: DecisionFunction;
}

export const ruleNames = [
    "Marcher",
    "Pacer",
    "Right-Handed",
    "Left-Handed",
    "Focused",
    "Chatterbox",
    "Coward",
    "Klepto",
    "Medium",
] as const;
export type RuleNames = (typeof ruleNames)[number];

export const rules: Map<RuleNames, Rule> = new Map(); // Indexed by ruleName
// CarrierInit stores the rule *name*, so it serializes easily to/from JSON,
// at the expense of looking it up every tick.

rules.set("Marcher", {
    help: "never changes direction",
    firstTickStraight: true,
    decision: (carrier: Carrier, s: RunState) => {
        return headingToVector(carrier.heading);
    },
});

rules.set("Pacer", {
    help: "turns around if he can't keep going straight",
    firstTickStraight: true,
    decision: (carrier: Carrier, s: RunState) => {
        let vector = headingToVector(carrier.heading);
        if (!s.adjacency.available(getCoordKey(carrier.gx, carrier.gy), getCoordKey(vector))) {
            // Reverse the vector
            vector = {
                x: vector.x * -1,
                y: vector.y * -1,
            };
        }
        return vector;
    },
});

rules.set("Right-Handed", {
    help: "turns right if he can",
    firstTickStraight: true,
    decision: (carrier: Carrier, s: RunState) => {
        // Prefer the sharpest available right turn: 45, then 90, then 135 degrees
        return firstAvailableTurn(carrier, s, [-1, -2, -3]);
    },
});

rules.set("Left-Handed", {
    help: "turns left if he can",
    firstTickStraight: true,
    decision: (carrier: Carrier, s: RunState) => {
        // Prefer the sharpest available left turn: 45, then 90, then 135 degrees
        return firstAvailableTurn(carrier, s, [1, 2, 3]);
    },
});

rules.set("Focused", {
    help: "always goes to the nearest mailbox",
    firstTickStraight: false,
    decision: (carrier: Carrier, s: RunState) => {
        // Undelivered destinations only (spriteImage 0 = not yet delivered)
        const mailboxes: Coord[] = [];
        for (const d of s.destinations.values()) {
            if (d.spriteImage === 0) {
                mailboxes.push({ x: d.gx, y: d.gy });
            }
        }
        return moveByField(carrier, s, distanceField(s, mailboxes), true);
    },
});

rules.set("Chatterbox", {
    help: "follows people",
    firstTickStraight: false,
    decision: (carrier: Carrier, s: RunState) => {
        return moveByField(carrier, s, distanceField(s, otherCarriers(carrier, s)), true);
    },
});

rules.set("Coward", {
    help: "runs away from people",
    firstTickStraight: false,
    decision: (carrier: Carrier, s: RunState) => {
        return moveByField(carrier, s, distanceField(s, otherCarriers(carrier, s)), false);
    },
});

rules.set("Klepto", {
    help: "goes straight to any package",
    firstTickStraight: false,
    decision: (carrier: Carrier, s: RunState) => {
        return moveByField(carrier, s, distanceField(s, parcels(carrier, s)), true);
    },
});

rules.set("Medium", {
    help: "afraid of boxes on the ground",
    firstTickStraight: false,
    decision: (carrier: Carrier, s: RunState) => {
        return moveByField(carrier, s, distanceField(s, parcels(carrier, s)), false);
    },
});

/** Every Carrier in the run except the one deciding */
function otherCarriers(carrier: Carrier, s: RunState): Coord[] {
    const others: Coord[] = [];
    for (const c of s.carriers.values()) {
        for (const other of c) {
            if (other !== carrier && other.active) {
                others.push({ x: other.gx, y: other.gy });
            }
        }
    }
    return others;
}

/** Any Parcel that isn't being carried */
function parcels(carrier: Carrier, s: RunState): Coord[] {
    const parcels: Coord[] = [];
    for (const p of s.parcels.values()) {
        if (p.active && p.carrier === null) {
            parcels.push({ x: p.gx, y: p.gy });
        }
    }
    return parcels;
}

/**
 * Multi-source breadth-first search across the level graph. Returns a map from
 * each reachable node's coordKey to its step-distance from the nearest source;
 * source nodes have distance 0. Unreachable nodes are simply absent.
 */
function distanceField(s: RunState, sources: Coord[]): Map<string, number> {
    const dist = new Map<string, number>();
    const queue: Coord[] = [];
    for (const src of sources) {
        const key = getCoordKey(src);
        if (!dist.has(key)) {
            dist.set(key, 0);
            queue.push(src);
        }
    }
    // Index-based queue to avoid O(n) shifts
    for (let head = 0; head < queue.length; head++) {
        const node = queue[head];
        const nodeKey = getCoordKey(node);
        const d = dist.get(nodeKey)!;
        for (const vector of s.adjacency.atNode(nodeKey).values()) {
            const next = { x: node.x + vector.x, y: node.y + vector.y };
            const nextKey = getCoordKey(next);
            if (!dist.has(nextKey)) {
                dist.set(nextKey, d + 1);
                queue.push(next);
            }
        }
    }
    return dist;
}

/**
 * Picks the available move from the Carrier's node that best optimizes `field`:
 * when `toward` is true, steps to the neighbor with the smallest distance (chasing
 * the nearest source), otherwise the largest (fleeing it). Falls back to continuing
 * straight ahead when there is nothing to chase or flee.
 */
function moveByField(
    carrier: Carrier,
    s: RunState,
    field: Map<string, number>,
    toward: boolean,
): Coord {
    const coordKey = getCoordKey(carrier.gx, carrier.gy);
    // Seed with the Carrier's *current* node
    // If nowhere is better, best stays null and he doesn't move
    let best: Coord | null = null;
    let bestDist = field.get(coordKey) ?? Infinity;
    for (const vector of s.adjacency.atNode(coordKey).values()) {
        const neighborKey = getCoordKey(carrier.gx + vector.x, carrier.gy + vector.y);
        const d = field.get(neighborKey) ?? Infinity;
        if (toward ? d < bestDist : d > bestDist) {
            bestDist = d;
            best = vector;
        }
    }
    // Already at the best reachable node - stay still
    return best ?? { x: 0, y: 0 };
}

function firstAvailableTurn(carrier: Carrier, s: RunState, offsets: number[]): Coord {
    const coordKey = getCoordKey(carrier.gx, carrier.gy);
    for (const offset of offsets) {
        // Wrap into 0-7, handling negative offsets
        const heading = (((carrier.heading + offset) % 8) + 8) % 8;
        const vector = headingToVector(heading);
        if (s.adjacency.available(coordKey, getCoordKey(vector))) {
            return vector;
        }
    }
    // No turn available - continue straight ahead
    return headingToVector(carrier.heading);
}
