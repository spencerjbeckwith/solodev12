import { Button } from "./Button";
import spr from "../../sprites.json";
import { GameState } from "../../game/state";

export class EditButton extends Button {
    constructor(state: GameState, canvas: HTMLCanvasElement) {
        super(state, spr.edit, 0, 32, canvas, true, 7);
        this.visible = state.canEdit;
    }

    onClick() {
        this.state.toState("edit");
    }
}
