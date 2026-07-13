import { Entity, EntityInit } from "./entity";
import spr from "../../sprites.json";
import { RunState } from "../state";
import { Draw } from "supersprite";
import { getCoordKey, gridToPixelX, gridToPixelY } from "../../utils";
import { Carrier } from "./carrier";
import { Engine } from "../../engine";

export interface DestinationInit extends EntityInit {}

export class Destination extends Entity {
    delivered: false;

    constructor(init: DestinationInit) {
        super(init);
        this.sprite = spr.destination;
        this.delivered = false;
        this.spriteOffsetX = -spr.destination.width / 2;
        this.spriteOffsetY = -spr.destination.height + 4;
    }

    get depth(): number {
        return super.depth - 1;
    }

    /** Accepts a Parcel from a Carrier */
    delivery(e: Engine, s: RunState) {
        e.snd.deliver.play();
        this.spriteImage = 1;
        s.remainingDeliveries--;
        console.log(`Delivery made. Remaining: ${s.remainingDeliveries}`);
    }
}

export function renderDestinationInit(draw: Draw, gx: number, gy: number, offset: boolean) {
    const s = spr.destination;
    const x = gridToPixelX(gx) - s.width / 2 - Number(offset) * 8;
    const y = gridToPixelY(gy) - s.height + 4;
    draw.sprite(s, 0, x, y);
}
