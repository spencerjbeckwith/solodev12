import { Button } from "./Button";
import spr from "../../sprites.json";
import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE } from "../../constants";
import { Engine } from "../../engine";

export class NodeButton extends Button {
    gx: number;
    gy: number;

    constructor(engine: Engine, gx: number, gy: number, canvas?: HTMLCanvasElement) {
        const realX = GRID_OFFSET_X + gx * GRID_SIZE + GRID_SIZE / 2 - spr.actions.width / 2;
        const realY = GRID_OFFSET_Y + gy * GRID_SIZE + GRID_SIZE / 2 - spr.actions.height / 2;
        super(engine, spr.actions, realX, realY, canvas, true, 1);
        this.gx = gx;
        this.gy = gy;
    }

    onClick() {
        if (this.engine.state.level.toggleNode(this.gx, this.gy)) {
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
