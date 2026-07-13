import { Engine } from "../../../engine";
import { ToggleButton } from "../Button";
import spr from "../../../sprites.json";

export class CarrierButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.carrier_button, 0, 32, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.entityToggle === "carrier";
    }

    onToggle(toggled: boolean) {
        if (this.engine.state.editState.entityToggle !== "carrier") {
            this.engine.state.editState.entityToggle = "carrier";
        } else {
            this.engine.state.editState.entityToggle = null;
        }
    }
}
