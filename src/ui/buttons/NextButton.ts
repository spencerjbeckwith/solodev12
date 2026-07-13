import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../../constants";

export class NextButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.next_button, VIEW_WIDTH - 32, VIEW_HEIGHT - 28, canvas, true, 7);
    }

    onClick() {
        // TODO: next button should progress to next level, or win the game
    }

    frame() {
        if (this.isWinState()) {
            super.frame();
        }
    }

    render() {
        if (this.isWinState()) {
            super.render();
        }
    }

    isWinState(): boolean {
        const state = this.engine.state.state;
        if (state === "run") {
            const s = this.engine.state.runState!;
            if (s.remainingDeliveries <= 0) {
                return true;
            }
        }
        return false;
    }
}
