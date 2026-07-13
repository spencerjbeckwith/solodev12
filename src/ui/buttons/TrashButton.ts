import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { Level } from "../../game/level";

export class TrashButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.trash_button, 0, 192, canvas, true, 7);
    }

    onClick() {
        this.engine.snd.break.play();
        this.engine.state.level = new Level();
    }
}
