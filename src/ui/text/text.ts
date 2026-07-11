import { GameState } from "../../game/state";
import { UIElement } from "../element";
import { Engine } from "../../engine";
import { DrawTextOptions } from "supersprite";

export type TextFunction = (state: GameState) => string;

export class TextElement extends UIElement {
    text: TextFunction;
    options?: DrawTextOptions;

    constructor(
        engine: Engine,
        x: number,
        y: number,
        text: TextFunction,
        options?: DrawTextOptions,
    ) {
        super(engine, x, y);
        this.text = text;
        this.options = options;
    }

    frame() {}

    render() {
        this.engine.core.draw.text(this.text(this.engine.state), this.x, this.y, this.options);
    }
}
