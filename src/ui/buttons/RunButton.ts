import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";

export class RunButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.run, 0, 0, canvas, true, 2);
    }

    onClick() {
        this.engine.snd.start.play();
        this.engine.state.toState("run");
    }
}
