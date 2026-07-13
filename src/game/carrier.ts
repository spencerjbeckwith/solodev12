import { Draw, Sprite, Transform } from "supersprite";
import { Coord } from "../types";
import spr from "../sprites.json";
import {
    getCoordKey,
    gridToPixelX,
    gridToPixelY,
    headingToVector,
    vectorToHeading,
} from "../utils";
import { CARRIER_STEPS_PER_TICK, GRID_SIZE, TICK_FRAMES } from "../constants";
import { RunState } from "./state";

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
export interface CarrierInit {
    node: Coord;
    heading: number;
    hasParcel: boolean;
    // TODO: rule
}

/** Actual Carrier instance, active during run mode */
export class Carrier {
    gx: number;
    gy: number;
    heading: number;
    hasParcel: boolean;
    // TODO: rule

    // Animation and movement
    px: number;
    py: number;
    sprite: Sprite;
    spriteImage: number;
    mirror: boolean;
    vector: Coord | null;

    constructor(init: CarrierInit) {
        this.gx = init.node.x;
        this.gy = init.node.y;
        this.heading = init.heading;
        this.hasParcel = init.hasParcel;

        this.sprite = carrierSprites[this.heading].spr;
        this.mirror = carrierSprites[this.heading].mirror;
        this.px = this.gridToPixelX(init.node.x);
        this.py = this.gridToPixelY(init.node.y);
        this.spriteImage = 0;
        this.vector = null;
    }

    tick(s: RunState) {
        // Decide where to go, attempt to move
        // TODO

        // For now, just attempt to move in our bearing direction
        const adj = s.adjacency;
        const coordKey = getCoordKey({ x: this.gx, y: this.gy });
        const vector = headingToVector(this.heading);
        const vectorKey = getCoordKey(vector);
        if (adj.available(coordKey, vectorKey)) {
            this.move(vector);
        }
    }

    endTick(s: RunState) {
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

    frame(frame: number) {
        // Move by our vector amount each frame
        if (this.vector) {
            this.px += this.vector.x;
            this.py += this.vector.y;

            // We're moving, so animate our steps
            // Cycle through all four images CARRIER_STEPS_PER_TICK times over the tick
            const progress = frame / TICK_FRAMES;
            this.spriteImage = Math.floor(progress * CARRIER_STEPS_PER_TICK * 4) % 4;
        }
    }

    render(draw: Draw) {
        draw.sprite(
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

export function renderCarrierInit(draw: Draw, node: Coord, heading: number) {
    const s = carrierSprites[heading];
    const x = gridToPixelX(node.x) - s.spr.width / 2;
    const y = gridToPixelY(node.y) - s.spr.height + 4;
    const t = s.mirror ? mirrorTransform : undefined;
    draw.sprite(s.spr, 0, x, y, t);
}
