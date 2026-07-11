import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";

export class DoneButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.done, 0, 0, canvas, true, 2);
    }

    onClick() {
        this.engine.state.toState("solve");
    }
}
