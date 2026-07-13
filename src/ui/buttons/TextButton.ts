import { DrawTextOptions } from "supersprite";
import { Engine } from "../../engine";
import { UIElement } from "../element";

export class TextButton extends UIElement {
    label: string;
    color: string;
    onClick: () => void;
    canvas?: HTMLCanvasElement;
    options?: DrawTextOptions;

    hovered: boolean;
    clicked: boolean;

    constructor(
        engine: Engine,
        label: string,
        x: number,
        y: number,
        color: string,
        onClick: () => void,
        canvas?: HTMLCanvasElement,
        options?: DrawTextOptions,
    ) {
        super(engine, x, y, true);
        this.label = label;
        this.color = color;
        this.onClick = onClick;
        this.canvas = canvas;
        this.options = options;

        this.hovered = false;
        this.clicked = false;
    }

    frame() {
        const x = this.x;
        const y = this.y;
        const w = this.label.length * 7;
        const h = 12;
        if (this.engine.input.mouse.isIn(x - w / 2, y - h / 2, x + w / 2, y + h / 2)) {
            if (!this.hovered) {
                this.hovered = true;
                this.engine.snd.hover.play();
            }
            if (this.canvas) {
                this.canvas.style.cursor = "pointer";
            }

            if (this.engine.input.mouse.pressed.mouseLeft) {
                this.engine.snd.click.play();
                this.clicked = true;
            }
            if (this.engine.input.mouse.released.mouseLeft) {
                this.clicked = false;
                this.onClick();
            }
        } else {
            this.hovered = false;
            this.clicked = false;
        }
    }

    render() {
        const draw = this.engine.core.draw;
        draw.text(this.label, this.x, this.y, {
            ...this.options,
            hAlign: "center",
            vAlign: "middle",
            textColor: this.clicked ? "#fcfcfc" : this.hovered ? this.color : "#808080",
            fontSize: 16,
        });
    }
}
