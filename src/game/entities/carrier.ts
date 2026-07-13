import { Colors, Draw, Sprite, Transform } from "supersprite";
import { Coord } from "../../types";
import spr from "../../sprites.json";
import { getCoordKey, gridToPixelX, gridToPixelY, vectorToHeading } from "../../utils";
import { CARRIER_STEPS_PER_TICK, GRID_SIZE, TICK_FRAMES } from "../../constants";
import { RunState } from "../state";
import { Entity, EntityInit } from "./entity";
import { Parcel } from "./parcel";
import { Engine } from "../../engine";
import { Destination } from "./destination";
import { RuleNames, rules } from "../rules";

type CarrierSprite = { spr: Sprite; mirror: boolean };
const carrierSprites: CarrierSprite[] = [
    { spr: spr.carrier_right, mirror: false },
    { spr: spr.carrier_up_right, mirror: false },
    { spr: spr.carrier_up, mirror: false },
    { spr: spr.carrier_up_right, mirror: true },
    { spr: spr.carrier_right, mirror: true },
    { spr: spr.carrier_down_right, mirror: true },
    { spr: spr.carrier_down, mirror: false },
    { spr: spr.carrier_down_right, mirror: false },
];
const mirrorTransform = new Transform().translate(0.5, 0).scale(-1, 1).translate(-0.5, 0);

/** Definition for the type/starting details of a Carrier */
export interface CarrierInit extends EntityInit {
    heading: number;
    ruleName: RuleNames;
}

/** Actual Carrier instance, active during run mode */
export class Carrier extends Entity {
    heading: number;
    parcels: Parcel[];
    ruleName: RuleNames;

    // The node this Carrier started the current tick on, before it moved.
    // Used to detect two Carriers crossing paths on the same edge.
    tickOriginGx: number;
    tickOriginGy: number;

    // Animation and movement
    mirror: boolean;
    vector: Coord | null;

    constructor(init: CarrierInit) {
        super(init);
        this.heading = init.heading;
        this.parcels = [];
        this.tickOriginGx = this.gx;
        this.tickOriginGy = this.gy;
        this.ruleName = init.ruleName;

        this.sprite = carrierSprites[this.heading].spr;
        this.mirror = carrierSprites[this.heading].mirror;
        this.vector = null;
        this.px = this.gridToPixelX(this.gx);
        this.py = this.gridToPixelY(this.gy);
    }

    get depth(): number {
        return this.py + this.sprite.height - 4;
    }

    tick(e: Engine, s: RunState) {
        const coordKey = getCoordKey(this.gx, this.gy);

        // Remember where we started this tick to resolve handoffs
        this.tickOriginGx = this.gx;
        this.tickOriginGy = this.gy;

        // Use the rule to decide where to go
        let vector: Coord = { x: 0, y: 0 };
        let rule = rules.get(this.ruleName);
        if (rule) {
            // Some rules must go straight on the first tick.
            if (s.tick === 1 && rule.firstTickStraight) {
                rule = rules.get("Marcher")!;
            }
            vector = rule.decision(this, s);
        }

        // We can only move if there's a path on our desired vector
        const adj = s.adjacency;
        const vectorKey = getCoordKey(vector);
        if (adj.available(coordKey, vectorKey)) {
            this.move(vector);
        }
    }

    endTick(e: Engine, s: RunState) {
        // Snap to place, unset vector and animation
        this.px = this.gridToPixelX(this.gx);
        this.py = this.gridToPixelY(this.gy);
        this.vector = null;
        this.spriteImage = 0;
    }

    /** Starts a movement for this Carrier for a tick */
    move(vector: Coord) {
        this.heading = vectorToHeading(vector.x, vector.y);
        this.vector = {
            x: (vector.x * GRID_SIZE) / TICK_FRAMES,
            y: (vector.y * GRID_SIZE) / TICK_FRAMES,
        };

        // Update sprite for our new heading
        this.sprite = carrierSprites[this.heading].spr;
        this.mirror = carrierSprites[this.heading].mirror;
        this.spriteImage = 0;

        // Update our grid coordinates as soon as we decide to move
        // The sprite will move over the course of the tick to "catch up"
        this.gx += vector.x;
        this.gy += vector.y;
    }

    /** Execute a pickup of a Parcel */
    pickup(e: Engine, s: RunState, parcel: Parcel) {
        parcel.carrier = this;
        this.parcels.push(parcel);
        s.parcels.delete(getCoordKey(parcel.gx, parcel.gy));
        e.snd.pickup.play();

        // Snap the parcel onto us immediately, in case we don't move again.
        parcel.px = this.px;
        parcel.py = this.py;
        parcel.updateOffset();
    }

    /** Execute a delivery of our most recent Parcel */
    deliver(e: Engine, s: RunState, destination: Destination) {
        const parcel = this.parcels.pop()!;
        parcel.active = false;
        destination.delivery(e, s);
    }

    /** Handoff a parcel to another Carrier */
    handoff(e: Engine, s: RunState, to: Carrier) {
        if (this.parcels.length > 0) {
            e.snd.pickup.play();
            const parcel = this.parcels.pop()!;
            parcel.px = to.px;
            parcel.py = to.py;
            parcel.carrier = to;
            to.parcels.push(parcel);
            parcel.updateOffset();
        }
    }

    frame(e: Engine, frame: number) {
        // Move by our vector amount each frame
        if (this.vector) {
            this.px += this.vector.x;
            this.py += this.vector.y;

            // We're moving, so animate our steps
            // Offset by 1 so movement begins with a step
            const progress = frame / TICK_FRAMES;
            this.spriteImage = (Math.floor(progress * CARRIER_STEPS_PER_TICK * 4) + 1) % 4;

            // Carry our Parcels along with us
            for (const parcel of this.parcels) {
                parcel.px = this.px;
                parcel.py = this.py;
                // No need to update parcel gx/gy anymore
            }
        }
    }

    render(e: Engine) {
        e.core.draw.sprite(
            this.sprite,
            this.spriteImage,
            this.px,
            this.py,
            this.mirror ? mirrorTransform : undefined,
        );
    }

    gridToPixelX(gx: number): number {
        return gridToPixelX(gx) - this.sprite.width / 2;
    }

    gridToPixelY(gy: number): number {
        return gridToPixelY(gy) - this.sprite.height + 4;
    }
}

export function renderCarrierInit(
    draw: Draw,
    gx: number,
    gy: number,
    heading: number,
    highlighted: boolean,
) {
    const s = carrierSprites[heading];
    const px = gridToPixelX(gx);
    const py = gridToPixelY(gy);
    const x = px - s.spr.width / 2;
    const y = py - s.spr.height + 4;
    const t = s.mirror ? mirrorTransform : undefined;
    if (highlighted) {
        draw.circle(px, py - 2, 9, 8, Colors.white);
    }
    draw.sprite(s.spr, 0, x, y, t);
}
