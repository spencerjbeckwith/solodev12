import { VIEW_HEIGHT, VIEW_WIDTH } from "../../constants";
import { Engine } from "../../engine";
import { TextElement } from "./text";

export class NoteText extends TextElement {
    constructor(engine: Engine) {
        super(engine, VIEW_WIDTH / 2, VIEW_HEIGHT - 4, () => "", {
            hAlign: "center",
            vAlign: "bottom",
        });
        this.text = () => this.engine.state.level.note ?? "";
    }

    render() {
        const state = this.engine.state.state;
        if (state === "run") {
            const s = this.engine.state.runState!;
            // Don't render if we've won the level
            if (s.remainingDeliveries > 0) {
                super.render();
            }
        } else {
            super.render();
        }
    }
}
