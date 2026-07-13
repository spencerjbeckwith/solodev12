import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { VIEW_WIDTH } from "../../constants";

export class NoteButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.note_button, VIEW_WIDTH - 32, 32, canvas, true, 7);
    }

    onClick() {
        const currentNote = this.engine.state.level.note;
        this.engine.state.level.note =
            window.prompt("Level Note", currentNote ?? "") ?? currentNote;
    }
}
