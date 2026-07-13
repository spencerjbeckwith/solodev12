import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { RunState } from "../state";
import { Draw } from "supersprite";
import { gridToPixelX, gridToPixelY } from "../../utils";

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

export function renderDestinationInit(draw: Draw, gx: number, gy: number, offset: boolean) {
    const s = spr.destination;
    const x = gridToPixelX(gx) - s.width / 2 - Number(offset) * 8;
    const y = gridToPixelY(gy) - s.height + 4;
    draw.sprite(s, 0, x, y);
}
