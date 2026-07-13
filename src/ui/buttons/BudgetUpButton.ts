import { Button } from "./Button";
import spr from "../../sprites.json";
import { Engine } from "../../engine";
import { VIEW_WIDTH } from "../../constants";

export class BudgetUpButton extends Button {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.budget_up_button, VIEW_WIDTH - 14, 2, canvas, true, 0);
    }

    onClick() {
        this.engine.state.level.budget++;
    }
}
