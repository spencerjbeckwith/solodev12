import { Draw, Sprite } from "supersprite";
import { gridToPixelX, gridToPixelY } from "../../utils";
import { RunState } from "../state";

export interface EntityInit {
    gx: number;
    gy: number;
}

export abstract class Entity {
    gx: number;
    gy: number;
    px: number;
    py: number;

    sprite!: Sprite; // Must be set in the constructor in child classes
    spriteImage: number;
    visible: boolean;
    active: boolean;

    constructor(init: EntityInit) {
        this.gx = init.gx;
        this.gy = init.gy;
        this.px = gridToPixelX(this.gx);
        this.py = gridToPixelY(this.gy);
        this.spriteImage = 0;
        this.visible = true;
        this.active = true;
    }

    tick(s: RunState): void {}

    endTick(s: RunState): void {}

    frame(elapsed: number): void {}

    render(draw: Draw): void {
        //draw.sprite(this.sprite, this.spriteImage, this.px, this.py);
    }
}
