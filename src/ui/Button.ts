import { SoundEffect } from "supersound";
import { Sprite } from "supersprite";
import { core, input, snd } from "../core";

// The canvas the player interacts with (supersprite stacks the 2D canvas on top).
const canvas = (core.presenter.ctx?.canvas ?? core.presenter.gl.canvas) as HTMLCanvasElement;

// Every button currently under the mouse. Tracking the set (rather than toggling the
// cursor per-button) keeps it correct no matter how many buttons exist or what order
// their frame() runs in: the cursor is a pointer whenever *any* button is hovered.
const hoveredButtons = new Set<Button>();

export class Button {
    // Configurable per button
    sprite: Sprite;
    x: number;
    y: number;
    hover?: SoundEffect;
    click?: SoundEffect;
    onClick?: () => void;
    padding: number;

    // State of the button
    visible: boolean;
    hovered: boolean;
    clicked: boolean;

    constructor(
        sprite: Sprite,
        x: number,
        y: number,
        onClick: () => void = () => {},
        padding = 0,
        hover = snd.hover,
        click = snd.click,
    ) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.hover = hover;
        this.click = click;
        this.onClick = onClick;
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
                if (this.onClick) {
                    this.onClick();
                }
            }

            hoveredButtons.add(this);
        } else {
            this.hovered = false;
            this.clicked = false;
            hoveredButtons.delete(this);
        }

        // Show a pointer whenever the mouse is over any button.
        canvas.style.cursor = hoveredButtons.size > 0 ? "pointer" : "default";
    }

    contains(x: number, y: number): boolean {
        return (
            x > this.x + this.padding &&
            x < this.x + this.sprite.width - this.padding &&
            y > this.y + this.padding &&
            y < this.y + this.sprite.height - this.padding
        );
    }

    render() {
        if (!this.visible) return;
        core.draw.sprite(this.sprite, Number(this.hovered) + Number(this.clicked), this.x, this.y);
    }
}
