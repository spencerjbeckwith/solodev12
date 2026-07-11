import { Engine } from "../engine";

export class UIElement {
    engine: Engine;
    x: number;
    y: number;
    visible: boolean;

    constructor(engine: Engine, x: number, y: number, visible = true) {
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.visible = visible;
    }

    frame(): void {}
    render(): void {}
}
