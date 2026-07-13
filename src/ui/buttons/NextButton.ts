import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../../constants";

export class NextButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.next_button, VIEW_WIDTH - 32, VIEW_HEIGHT - 28, canvas, true, 7);
    }

    onClick() {
        this.engine.snd.next_level.play();
        this.engine.state.advanceLevel();
    }

    frame() {
        if (this.isWinState()) {
            super.frame();
        }
        this.visible = !this.engine.state.canEdit;
    }

    render() {
        this.visible = !this.engine.state.canEdit;
        if (this.isWinState() && this.visible) {
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
