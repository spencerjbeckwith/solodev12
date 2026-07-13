import { VIEW_HEIGHT, VIEW_WIDTH } from "../../constants";
import { Engine } from "../../engine";
import { TextElement } from "./text";

export class WinText extends TextElement {
    constructor(engine: Engine) {
        super(engine, VIEW_WIDTH / 2, VIEW_HEIGHT - 4, () => "All packages delivered!", {
            hAlign: "center",
            vAlign: "bottom",
            textColor: "#41c502",
        });
    }

    render() {
        const state = this.engine.state.state;
        if (state === "run") {
            const s = this.engine.state.runState!;
            if (s.remainingDeliveries <= 0) {
                super.render();
            }
        }
    }
}
