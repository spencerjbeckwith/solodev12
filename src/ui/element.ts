import { Engine } from "../engine";

export class UIElement {
    engine: Engine;
    x: number;
    y: number;
    visible: boolean;
    children: UIElement[];

    constructor(engine: Engine, x: number, y: number, visible = true) {
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.visible = visible;
        this.children = [];
    }

    frame(): void {
        for (const c of this.children) {
            if (c.visible) {
                c.frame();
            }
        }
    }
    render(): void {
        for (const c of this.children) {
            if (c.visible) {
                c.render();
            }
        }
    }
}
