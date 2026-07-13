import { Engine } from "../../../engine";
import { ToggleButton } from "../Button";
import spr from "../../../sprites.json";

export class ParcelButton extends ToggleButton {
    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, spr.parcel_button, 0, 64, canvas, true, 7);
    }

    getToggled() {
        return this.engine.state.editState.entityToggle === "parcel";
    }

    onToggle(toggled: boolean) {
        if (this.engine.state.editState.entityToggle !== "parcel") {
            this.engine.state.editState.entityToggle = "parcel";
        } else {
            this.engine.state.editState.entityToggle = null;
        }
    }
}
