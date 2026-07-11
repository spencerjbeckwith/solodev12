import { SoundEffect } from "supersound";
import { Sprite } from "supersprite";
import { core, input, snd } from "../../core";
import { UIElement } from "../element";
import { GameState } from "../../game/state";

export class Button extends UIElement {
    // Configurable per button
    sprite: Sprite;
    hover?: SoundEffect;
    click?: SoundEffect;
    padding: number;
    canvas?: HTMLCanvasElement;

    // State of the button
    visible: boolean;
    hovered: boolean;
    clicked: boolean;

    constructor(
        state: GameState,
        sprite: Sprite,
        x: number,
        y: number,
        canvas?: HTMLCanvasElement,
        visible = true,
        padding = 0,
        hover = snd.hover,
        click = snd.click,
    ) {
        super(state, x, y, visible);
        this.sprite = sprite;
        this.hover = hover;
        this.click = click;
        this.canvas = canvas;
        this.padding = padding; // Assuming padding is unidirectional (only square buttons)

        this.visible = true;
        this.hovered = false;
        this.clicked = false;
    }

    frame() {
        if (
            input.mouse.isIn(
                this.x + this.padding,
                this.y + this.padding,
                this.x + this.sprite.width - this.padding,
                this.y + this.sprite.height - this.padding,
            )
        ) {
            if (this.canvas) {
                this.canvas.style.cursor = "pointer";
            }

            if (!this.hovered) {
                if (this.hover) {
                    this.hover.play();
                }
                this.hovered = true;
            }

            if (input.mouse.pressed.mouseLeft) {
                // Input's guard prevents playing the sound a lot at once
                if (this.click) {
                    this.click.play();
                }
            }

            if (input.mouse.held.mouseLeft) {
                this.clicked = true;
            } else {
                this.clicked = false;
            }

            if (input.mouse.released.mouseLeft) {
                this.onClick();
            }
        } else {
            this.hovered = false;
            this.clicked = false;
        }
    }

    render() {
        core.draw.sprite(this.sprite, Number(this.hovered) + Number(this.clicked), this.x, this.y);
    }

    onClick() {}
}
