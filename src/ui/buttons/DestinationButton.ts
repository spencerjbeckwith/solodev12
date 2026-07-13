import { Engine } from "../../engine";
import { ToggleButton } from "./Button";
import spr from "../../sprites.json";

export class DestinationButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        const toggled = engine.state.editState.destinationToggle;
        super(engine, spr.destination_button, 0, 96, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.destinationToggle;
    }

    onToggle(toggled: boolean) {
        this.engine.state.editState.destinationToggle = toggled;
        this.engine.state.editState.parcelToggle = false;
        this.engine.state.editState.carrierToggle = false;
    }
}
