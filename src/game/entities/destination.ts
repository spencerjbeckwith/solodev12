import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { RunState } from "../state";

export interface DestinationInit extends EntityInit {}

export class Destination extends Entity {
    delivered: false;

    constructor(init: DestinationInit) {
        super(init);
        this.sprite = spr.destination;
        this.delivered = false;
    }

    endTick(s: RunState): void {
        // If a Carrier is here with a Parcel, deliver it
        // TODO
    }
}
