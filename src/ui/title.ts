import { DrawTextOptions } from "supersprite";
import { Engine } from "../engine";
import { UIElement } from "./element";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../constants";

export class Title extends UIElement {
    titleStyle: DrawTextOptions;
    footerStyle: DrawTextOptions;
    n: number;

    constructor(engine: Engine) {
        super(engine, 0, 0, true);
        this.titleStyle = {
            fontSize: 32,
            hAlign: "center",
            vAlign: "middle",
            textColor: "#941304",
        };
        this.footerStyle = {
            fontSize: 10,
            hAlign: "center",
            vAlign: "bottom",
            textColor: "#606060",
        };
        this.n = 0;
    }

    frame() {
        this.n += Math.PI / 110;
        if (this.n > Math.PI * 2) {
            this.n -= Math.PI * 2;
        }
    }

    render() {
        const draw = this.engine.core.draw;
        const cx = VIEW_WIDTH / 2;

        draw.text("Mailhem", cx, 70 + Math.sin(this.n) * 4, this.titleStyle);
        draw.text("solodev#12 by mcwequiesk, 2026", cx, VIEW_HEIGHT - 2, this.footerStyle);
    }
}
