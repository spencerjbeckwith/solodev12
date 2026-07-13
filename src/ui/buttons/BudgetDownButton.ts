import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { VIEW_WIDTH } from "../../constants";

export class BudgetDownButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.budget_down_button, VIEW_WIDTH - 14, 16, canvas, true, 0);
    }

    onClick() {
        if (this.engine.state.level.budget > 1) {
            this.engine.state.level.budget--;
        }
    }
}
