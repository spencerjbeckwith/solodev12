import { Engine } from "../../engine";
import { ToggleButton } from "./Button";
import spr from "../../sprites.json";

export class CarrierButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        const toggled = engine.state.editState.carrierToggle;
        super(engine, spr.carrier_button, 0, 32, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.carrierToggle;
    }

    onToggle(toggled: boolean) {
        this.engine.state.editState.carrierToggle = toggled;
        this.engine.state.editState.parcelToggle = false;
        this.engine.state.editState.destinationToggle = false;
    }
}
