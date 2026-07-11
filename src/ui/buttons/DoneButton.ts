import { Button } from "./Button";
import spr from "../../sprites.json";
import { GameState } from "../../game/state";

export class DoneButton extends Button {
    constructor(state: GameState, canvas?: HTMLCanvasElement) {
        super(state, spr.done, 0, 0, canvas, true, 2);
    }

    onClick() {
        this.state.toState("solve");
    }
}
