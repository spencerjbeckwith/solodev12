import { Coord } from "../types";

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

    constructor(init: CarrierInit) {
        this.gx = init.node.x;
        this.gy = init.node.y;
        this.heading = init.heading;
        this.hasParcel = init.hasParcel;
    }

    render() {
        // TODO
    }
}
