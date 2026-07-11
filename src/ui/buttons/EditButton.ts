import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";

export class EditButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.edit, 0, 32, canvas, true, 7);
        this.visible = this.engine.state.canEdit;
    }

    onClick() {
        this.engine.state.toState("edit");
    }
}
