import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";

export class LoadButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.load_button, 0, 160, canvas, true, 7);
    }

    onClick() {
        // Open a file selector for JSON
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json,.json";
        input.addEventListener("change", async () => {
            const file = input.files?.[0];
            if (!file) return;
            const json = await file.text();
            this.engine.state.level.load(json);
        });
        input.click();
    }
}
