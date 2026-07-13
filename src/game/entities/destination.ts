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
    }

    endTick(e: Engine, s: RunState): void {
        // If a Carrier is here with a Parcel, deliver it
        const carriers = s.carriers.get(getCoordKey(this.gx, this.gy));
        if (carriers) {
            for (const carrier of carriers) {
                if (carrier.parcels.length > 0) {
                    // One of them has at least one parcel!
                    this.delivery(e, s, carrier);
                    break;
                }
            }
        }
    }

    attemptDelivery(e: Engine, s: RunState) {
        // TODO call me on both tick and endTick
    }

    delivery(e: Engine, s: RunState, from: Carrier) {
        if (from.parcels.length > 0) {
            // TODO: what do we do here?
        }
    }
}

export function renderDestinationInit(draw: Draw, gx: number, gy: number, offset: boolean) {
    const s = spr.destination;
    const x = gridToPixelX(gx) - s.width / 2 - Number(offset) * 8;
    const y = gridToPixelY(gy) - s.height + 4;
    draw.sprite(s, 0, x, y);
}
