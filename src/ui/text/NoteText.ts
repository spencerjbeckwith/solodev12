import { VIEW_HEIGHT, VIEW_WIDTH } from "../../constants";
import { Engine } from "../../engine";
import { rules } from "../../game/rules";
import { TextElement } from "./text";

export class NoteText extends TextElement {
    constructor(engine: Engine) {
        super(engine, VIEW_WIDTH / 2, VIEW_HEIGHT - 2, () => "", {
            hAlign: "center",
            vAlign: "bottom",
            lineSeparation: 10,
            fontSize: 12,
        });
        this.width = VIEW_WIDTH - 64;
        this.text = () => {
            // Display carrier rule when highlighted
            const highlightNode = this.engine.state.highlightNode;
            if (highlightNode) {
                const highlightCarrier = this.engine.state.level.getCarrierInit(
                    highlightNode?.x,
                    highlightNode.y,
                );
                if (highlightCarrier) {
                    const rule = rules.get(highlightCarrier.ruleName);
                    if (rule) {
                        //this.options!.textColor = "#3d9ff4";
                        return `${highlightCarrier.ruleName}: ${rule.help}`;
                    }
                }
            }
            this.options!.textColor = "#ffffff";
            return this.engine.state.level.note ?? "";
        };
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
