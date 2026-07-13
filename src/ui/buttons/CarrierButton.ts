import { Engine } from "../../engine";
import { ToggleButton } from "./Button";
import spr from "../../sprites.json";

export class CarrierButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        const toggled = engine.state.editState.carrierToggle;
        super(engine, spr.carrier_button, 0, 32, toggled, canvas, true, 7);
    }

    onToggle(toggled: boolean) {
        this.engine.state.editState.carrierToggle = toggled;
    }
}
