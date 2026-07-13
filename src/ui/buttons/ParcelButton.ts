import { Engine } from "../../engine";
import { ToggleButton } from "./Button";
import spr from "../../sprites.json";

export class ParcelButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        const toggled = engine.state.editState.parcelToggle;
        super(engine, spr.parcel_button, 0, 64, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.parcelToggle;
    }

    onToggle(toggled: boolean) {
        this.engine.state.editState.parcelToggle = toggled;
        this.engine.state.editState.carrierToggle = false;
        this.engine.state.editState.destinationToggle = false;
    }
}
