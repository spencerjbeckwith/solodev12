import { Button } from "./Button";
import spr from "../../sprites.json";
import { GameState } from "../../game/state";

export class StopButton extends Button {
    constructor(state: GameState, canvas: HTMLCanvasElement) {
        super(state, spr.stop, 0, 0, canvas, true, 2);
    }

    onClick() {
        this.state.toState("solve");
    }
}
