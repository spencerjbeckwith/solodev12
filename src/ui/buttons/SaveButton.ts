import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";

export class SaveButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.save_button, 0, 128, canvas, true, 7);
    }

    onClick() {
        // Serialize the level, then trigger a download of the JSON
        const json = this.engine.state.level.save();
        if (json === null) return;
        const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "level.json";
        a.click();
        URL.revokeObjectURL(url);
    }
}
