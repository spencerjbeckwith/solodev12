import { Engine } from "../../../engine";
import { ToggleButton } from "../Button";
import spr from "../../../sprites.json";

export class DestinationButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.destination_button, 0, 96, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.entityToggle === "destination";
    }

    onToggle(toggled: boolean) {
        if (this.engine.state.editState.entityToggle !== "destination") {
            this.engine.state.editState.entityToggle = "destination";
        } else {
            this.engine.state.editState.entityToggle = null;
        }
    }
}
