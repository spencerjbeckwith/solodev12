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

        // Toggle the appropriate entity per edit state
        switch (this.engine.state.editState.entityToggle) {
            case "carrier":
                result = this.engine.state.level.toggleCarrier(this.gx, this.gy);
                break;
            case "parcel":
                result = this.engine.state.level.toggleParcel(this.gx, this.gy);
                break;
            case "destination":
                result = this.engine.state.level.toggleDestination(this.gx, this.gy);
                break;
            default:
                // No other toggle is on, so toggle nodes
                result = this.engine.state.level.toggleNode(this.gx, this.gy);
                break;
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
