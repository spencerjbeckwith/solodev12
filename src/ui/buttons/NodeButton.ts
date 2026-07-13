import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { gridToPixelX, gridToPixelY } from "../../utils";

export class NodeButton extends Button {
    gx: number;
    gy: number;

    constructor(engine: Engine, gx: number, gy: number, canvas?: HTMLCanvasElement) {
        const realX = gridToPixelX(gx) - spr.actions.width / 2;
        const realY = gridToPixelY(gy) - spr.actions.height / 2;
        super(engine, spr.actions, realX, realY, canvas, true, 1);
        this.gx = gx;
        this.gy = gy;
    }

    onClick() {
        let result: boolean | null = null;
        // If carrierToggle is on, create or destroy a Carrier at this node
        if (this.engine.state.editState.carrierToggle) {
            result = this.engine.state.level.toggleCarrier(this.gx, this.gy);
        } else {
            // No toggle is on, modify nodes
            result = this.engine.state.level.toggleNode(this.gx, this.gy);
        }

        if (result) {
            this.engine.snd.place.play();
        } else {
            this.engine.snd.break.play();
        }
    }

    render() {
        // Set sprite image according to if a node has our position or not
        const hasNode = this.engine.state.level.hasNode(this.gx, this.gy);
        this.engine.core.draw.sprite(
            this.sprite,
            Number(this.hovered) + Number(this.clicked) + Number(hasNode) * 3,
            this.x,
            this.y,
        );
    }
}
