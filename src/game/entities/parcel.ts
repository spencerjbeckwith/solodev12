import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { Carrier } from "./carrier";

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
