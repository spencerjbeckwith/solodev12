import { TICK_FRAMES, WAIT_FRAMES } from "../constants";
import { Edges, Nodes, Edge, EdgePlacementResult, Coord } from "../types";
import { getCoordKey, getEdgeKey } from "../utils";
import { Adjacency } from "./adjacency";
import { Carrier } from "./entities/carrier";
import { Level } from "./level";
import { Parcel } from "./entities/parcel";
import { Destination } from "./entities/destination";
import { Entity } from "./entities/entity";
import { Engine } from "../engine";
import { staticLevels } from "./staticlevels";

export interface EditState {
    entityToggle: "carrier" | "destination" | "parcel" | null;
}

export interface SolveState {
    placed: Edges;
    remaining: number;
}

export interface RunState {
    tick: number;
    framesLeft: number;
    nodes: Nodes;
    adjacency: Adjacency;
    entities: Entity[];
    remainingDeliveries: number;
    carriers: Map<string, Carrier[]>; // Indexed by coordKey
    parcels: Map<string, Parcel>; // Indexed by coordKey, keys deleted when Parcels are picked up
    destinations: Map<string, Destination>; // Indexed by coordKey
}

export type GameStates = "title" | "edit" | "solve" | "run" | "win";

export class GameState {
    state: GameStates;
    level: Level;
    editState: EditState;
    solveState: SolveState | null;
    runState: RunState | null;
    canEdit: boolean;
    highlightNode: Coord | null;
    levelNumber: number;

    constructor(level: Level, startState: Exclude<GameStates, "run">, canEdit: boolean) {
        this.state = startState;
        this.level = level;
        this.editState = this.newEditState();
        this.solveState = startState === "solve" || !canEdit ? this.newSolveState() : null;
        this.runState = null;
        this.canEdit = canEdit;
        this.highlightNode = null;
        this.levelNumber = 0;
    }

    // Edit <---> Solve <---> Run
    // When in "edit" state, GameState will mutate the LevelDefinition

    toState(newState: GameStates) {
        const stateTransition = `${this.state}->${newState}`;
        switch (stateTransition) {
            case "title->solve":
            case "edit->solve":
                // Start solving the level from edit mode
                this.state = newState;
                this.solveState = this.newSolveState();
                break;
            case "solve->run":
                // Start running the simulation
                if (!this.solveState) return;
                this.state = newState;
                this.runState = this.newRunState();
                break;
            case "run->solve":
                // Stop running the simulation
                this.state = newState;
                this.runState = null;
                break;
            case "title->edit":
            case "solve->edit":
                // Unset solve state, back to level edit mode
                if (!this.canEdit) return;
                this.state = newState;
                this.solveState = null;
                this.editState = this.newEditState();
                break;
            case "run->win": {
                this.state = newState;
                this.solveState = null;
                this.runState = null;
                break;
            }
            case "win->edit": {
                this.state = newState;
                break;
            }
            default:
                // Do nothing on an undefined state transition
                break;
        }
    }

    frame(e: Engine) {
        if (this.state === "run") {
            const s = this.runState!;
            const elapsed = Math.min(TICK_FRAMES, TICK_FRAMES - s.framesLeft);
            s.framesLeft--;

            // Call frame on all Entities
            for (const entity of s.entities) {
                if (entity.active) {
                    entity.frame(e, elapsed);
                }
            }

            if (s.framesLeft === Math.floor(TICK_FRAMES / 2)) {
                // Halfway through the tick - moving Carriers are mid-edge
                this.midTick(e, s);
            }

            if (s.framesLeft === 0) {
                // Tick is over
                this.endTick(e, s);
            }

            if (s.framesLeft === -WAIT_FRAMES) {
                // Start new tick after waiting
                this.tick(e, s);
            }
        }
    }

    tick(e: Engine, s: RunState) {
        s.tick++;
        s.framesLeft = TICK_FRAMES;

        // Resolve pickups/deliveries at each Carrier's start node, before moving
        const atStart = this.groupCarriers(s);
        this.resolvePickups(e, s, atStart);
        this.resolveDeliveries(e, s, atStart);

        for (const entity of s.entities) {
            if (entity.active) {
                entity.tick(e, s);
            }
        }

        // Rebuild the lookup map from post-move positions
        s.carriers = this.groupCarriers(s);
        return s;
    }

    /** Groups all Carriers by the node they currently occupy */
    groupCarriers(s: RunState): Map<string, Carrier[]> {
        const groups: Map<string, Carrier[]> = new Map();
        for (const c of s.entities) {
            if (c instanceof Carrier) {
                const key = getCoordKey(c.gx, c.gy);
                const list = groups.get(key);
                if (list) {
                    list.push(c);
                } else {
                    groups.set(key, [c]);
                }
            }
        }
        return groups;
    }

    /** The Carrier with the fewest Parcels picks up any co-located Parcel; ties wait */
    resolvePickups(e: Engine, s: RunState, groups: Map<string, Carrier[]>) {
        for (const [coordKey, parcel] of s.parcels) {
            const carriers = groups.get(coordKey);
            if (!carriers) continue;
            const taker = this.fewestParcels(carriers);
            if (taker) {
                taker.pickup(e, s, parcel);
            }
        }
    }

    /** The Carrier with the most Parcels delivers to a co-located Destination; ties wait */
    resolveDeliveries(e: Engine, s: RunState, groups: Map<string, Carrier[]>) {
        for (const [coordKey, destination] of s.destinations) {
            if (destination.spriteImage !== 0) continue; // Already delivered
            const carriers = groups.get(coordKey);
            if (!carriers) continue;
            const deliverer = this.mostParcels(carriers.filter((c) => c.parcels.length > 0));
            if (deliverer) {
                deliverer.deliver(e, s, destination);
            }
        }
    }

    midTick(e: Engine, s: RunState) {
        for (const entity of s.entities) {
            if (entity.active) {
                entity.midTick(e, s);
            }
        }

        // Handoffs between Carriers crossing paths on the same edge
        const crossings: Map<string, Carrier[]> = new Map();
        for (const c of s.entities) {
            if (c instanceof Carrier) {
                if (c.tickOriginGx === c.gx && c.tickOriginGy === c.gy) {
                    continue; // Didn't move this tick
                }
                const key = getEdgeKey([
                    { x: c.tickOriginGx, y: c.tickOriginGy },
                    { x: c.gx, y: c.gy },
                ]);
                const list = crossings.get(key);
                if (list) {
                    list.push(c);
                } else {
                    crossings.set(key, [c]);
                }
            }
        }
        for (const [, carriers] of crossings) {
            const pair = this.resolveHandoff(carriers);
            if (pair) {
                pair[0].handoff(e, s, pair[1]);
            }
        }

        return s;
    }

    endTick(e: Engine, s: RunState) {
        for (const entity of s.entities) {
            if (entity.active) {
                entity.endTick(e, s);
            }
        }

        // Carriers have arrived; resolve pickups/deliveries then node handoffs
        this.resolvePickups(e, s, s.carriers);
        this.resolveDeliveries(e, s, s.carriers);

        for (const [, carriers] of s.carriers) {
            const pair = this.resolveHandoff(carriers);
            if (pair) {
                pair[0].handoff(e, s, pair[1]);
            }
        }

        if (s.remainingDeliveries === 0) {
            console.log("Level complete!");
        }

        return s;
    }

    /**
     * Given co-located Carriers, returns the [giver, receiver] pair for a handoff:
     * the Carrier with the most Parcels gives to the one with the fewest. Returns
     * null when either end is tied (nothing happens).
     */
    resolveHandoff(carriers: Carrier[]): [Carrier, Carrier] | null {
        const most = this.mostParcels(carriers);
        const fewest = this.fewestParcels(carriers);
        if (!most || !fewest || most === fewest) {
            return null;
        }
        return [most, fewest];
    }

    /** The single Carrier holding the most Parcels, or null if tied (or empty) */
    mostParcels(carriers: Carrier[]): Carrier | null {
        let most: Carrier | null = null;
        let tied = false;
        for (const c of carriers) {
            if (!most || c.parcels.length > most.parcels.length) {
                most = c;
                tied = false;
            } else if (c.parcels.length === most.parcels.length) {
                tied = true;
            }
        }
        return tied ? null : most;
    }

    /** The single Carrier holding the fewest Parcels, or null if tied (or empty) */
    fewestParcels(carriers: Carrier[]): Carrier | null {
        let fewest: Carrier | null = null;
        let tied = false;
        for (const c of carriers) {
            if (!fewest || c.parcels.length < fewest.parcels.length) {
                fewest = c;
                tied = false;
            } else if (c.parcels.length === fewest.parcels.length) {
                tied = true;
            }
        }
        return tied ? null : fewest;
    }

    render(e: Engine) {
        if (this.state === "run") {
            // Render in depth order
            const ordered = this.runState!.entities.filter(
                (entity) => entity.active && entity.visible,
            ).sort((a, b) => a.depth - b.depth);
            for (const entity of ordered) {
                entity.render(e);
            }
        }
    }

    newEditState(): EditState {
        return {
            entityToggle: null,
        };
    }

    newSolveState(): SolveState {
        return {
            placed: new Map(),
            remaining: this.level.budget,
        };
    }

    newRunState(): RunState {
        let remainingDeliveries = 0;

        // Initialie entities into lists from their maps
        const entities: Entity[] = [];
        const carriers: Map<string, Carrier[]> = new Map();
        this.level.carriers.forEach((init) => {
            const c = new Carrier(init);
            entities.push(c);
            carriers.set(getCoordKey(c.gx, c.gy), [c]);
            // Only one carrier can start on a node, so list can always start empty
        });

        const parcels: Map<string, Parcel> = new Map();
        this.level.parcels.forEach((init) => {
            const p = new Parcel(init);
            entities.push(p);
            parcels.set(getCoordKey(p.gx, p.gy), p);
            // All parcels start sitting on the ground - Carriers may pick them up on their first tick
        });

        const destinations: Map<string, Destination> = new Map();
        this.level.destinations.forEach((init) => {
            const d = new Destination(init);
            entities.push(d);
            remainingDeliveries++;
            destinations.set(getCoordKey(d.gx, d.gy), d);
            // Destinations don't move (thank god)
        });

        // Create adjacency
        const allEdges = new Map([...this.level.edges, ...this.solveState!.placed]);
        const adj = new Adjacency(allEdges);

        console.log(`Level start: ${remainingDeliveries} remaining deliveries.`);
        return {
            tick: 0,
            framesLeft: 0, // Wait until first tick() call to start
            nodes: this.level.nodes,
            adjacency: adj,
            entities,
            remainingDeliveries,
            carriers,
            parcels,
            destinations,
        };
    }

    isValidEdge(edge: Edge): boolean {
        if (this.state === "solve" && this.solveState) {
            // Not allowed to change edges in the level when solving
            const edgeKey = getEdgeKey(edge);
            if (this.level.edges.has(edgeKey)) {
                return false;
            }

            const allEdges = new Map([...this.level.edges, ...this.solveState.placed]);
            return this.level.isValidEdge(edge, allEdges, true);
        }
        return this.level.isValidEdge(edge, this.level.edges, false);
    }

    toggleEdge(edge: Edge): EdgePlacementResult {
        if (this.state === "edit") {
            return this.level.toggleEdge(edge);
        }
        if (this.state === "solve") {
            return this.toggleSolveEdge(edge);
        }
        return "blocked";
    }

    toggleSolveEdge(edge: Edge): EdgePlacementResult {
        const solve = this.solveState;
        if (solve) {
            const edgeKey = getEdgeKey(edge);
            if (solve.placed.has(edgeKey)) {
                solve.placed.delete(edgeKey);
                solve.remaining++;
                return "removed";
            } else {
                if (solve.remaining > 0) {
                    solve.placed.set(edgeKey, edge);
                    solve.remaining--;
                    return "placed";
                } else {
                    return "blocked";
                }
            }
        }
        return "blocked";
    }

    advanceLevel() {
        this.levelNumber++;
        if (this.levelNumber >= staticLevels.length) {
            // Beat the game!
            this.toState("win");
        } else {
            // Load the next level
            console.log(`Loading level ${this.levelNumber}`);
            this.level.load(staticLevels[this.levelNumber]);

            // Manual reset of state for next level
            this.state = "solve";
            this.runState = null;
            this.solveState = this.newSolveState();
        }
    }
}
