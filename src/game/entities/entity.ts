import { Sprite } from "supersprite";
import { gridToPixelX, gridToPixelY } from "../../utils";
import { RunState } from "../state";
import { Engine } from "../../engine";

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
    spriteOffsetX: number;
    spriteOffsetY: number;
    visible: boolean;
    active: boolean;

    constructor(init: EntityInit) {
        this.gx = init.gx;
        this.gy = init.gy;
        this.px = gridToPixelX(this.gx);
        this.py = gridToPixelY(this.gy);
        this.spriteImage = 0;
        this.spriteOffsetX = 0;
        this.spriteOffsetY = 0;
        this.visible = true;
        this.active = true;
    }

    /** Higher depth = drawn later, closer to the front */
    get depth(): number {
        return gridToPixelY(this.gy);
    }

    tick(e: Engine, s: RunState): void {}

    endTick(e: Engine, s: RunState): void {}

    frame(e: Engine, elapsed: number): void {}

    render(e: Engine): void {
        e.core.draw.sprite(
            this.sprite,
            this.spriteImage,
            this.px + this.spriteOffsetX,
            this.py + this.spriteOffsetY,
        );
    }
}
