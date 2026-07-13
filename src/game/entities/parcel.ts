import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { Carrier } from "./carrier";
import { Draw } from "supersprite";
import { gridToPixelX, gridToPixelY } from "../../utils";

/** Definition of the starting Parcel for a level */
export interface ParcelInit extends EntityInit {
    // TODO
}

/** Actual Parcel instance, active during run mode */
export class Parcel extends Entity {
    carrier: Carrier | null;

    constructor(init: ParcelInit) {
        super(init);
        this.sprite = spr.parcel;
        this.carrier = null;
    }

    tick() {
        // If we are at the same spot as a Carrier (and aren't being carried) get picked up
        // TODO
    }

    render() {
        // TODO
    }
}

export function renderParcelInit(draw: Draw, gx: number, gy: number, offset: boolean) {
    const s = spr.parcel;
    const x = gridToPixelX(gx) - s.width / 2 + 8 * Number(offset);
    const y = gridToPixelY(gy) - s.height + 4;
    draw.sprite(s, 0, x, y);
}
