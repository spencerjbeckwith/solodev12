import { DrawTextOptions } from "supersprite";
import { Engine } from "../engine";
import { UIElement } from "./element";
import { VIEW_WIDTH } from "../constants";

export class WinScreen extends UIElement {
    titleStyle: DrawTextOptions;
    labelStyle: DrawTextOptions;

    constructor(engine: Engine) {
        super(engine, 0, 0, true);
        this.titleStyle = {
            fontSize: 24,
            hAlign: "center",
            vAlign: "middle",
            textColor: "#41c502",
        };
        this.labelStyle = {
            fontSize: 12,
            hAlign: "center",
            vAlign: "top",
            textColor: "#f2f2fc",
        };
    }

    render() {
        const draw = this.engine.core.draw;
        const cx = VIEW_WIDTH / 2;
        draw.text("You did it!", cx, 70, this.titleStyle);

        const lines = [
            "Congratulations, you beat every level!",
            "The Post Office thanks you for your service.",
            "Want to create levels of your own?",
        ];
        const lineHeight = 18;
        lines.forEach((line, i) => {
            draw.text(line, cx, 90 + i * lineHeight, this.labelStyle);
        });
    }
}
