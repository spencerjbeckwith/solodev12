import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { Carrier } from "./carrier";
import { Draw } from "supersprite";
import { gridToPixelX, gridToPixelY } from "../../utils";

/** Definition of the starting Parcel for a level */
export interface ParcelInit extends EntityInit {}

/** Actual Parcel instance, active during run mode */
export class Parcel extends Entity {
    carrier: Carrier | null;

    constructor(init: ParcelInit) {
        super(init);
        this.sprite = spr.parcel;
        this.carrier = null;
        this.spriteOffsetX = -spr.parcel.width / 2;
        this.spriteOffsetY = -spr.parcel.height + 4;
    }

    get depth(): number {
        if (this.carrier !== null) {
            // Ride just in front of our carrier, ordered by our position in the stack
            // so the whole stack stays grouped and higher parcels draw on top.
            const index = this.carrier.parcels.indexOf(this);
            return this.carrier.depth + 0.1 * (index + 1);
        }
        return super.depth;
    }

    frame() {
        this.updateOffset();
    }

    /** Recomputes sprite offsets based on whether we're being carried and our position in the stack */
    updateOffset() {
        if (this.carrier !== null) {
            // Which number parcel are we?
            const index = this.carrier.parcels.indexOf(this);
            this.spriteOffsetX = spr.parcel.width / 4;
            this.spriteOffsetY = -(index * 6) - 3;
        } else {
            this.spriteOffsetX = -spr.parcel.width / 2;
            this.spriteOffsetY = -spr.parcel.height + 4;
        }
    }
}

export function renderParcelInit(draw: Draw, gx: number, gy: number, offset: boolean) {
    const s = spr.parcel;
    const x = gridToPixelX(gx) - s.width / 2 + 8 * Number(offset);
    const y = gridToPixelY(gy) - s.height + 4;
    draw.sprite(s, 0, x, y);
}
