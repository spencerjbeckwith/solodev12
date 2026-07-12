import { SoundEffect } from "supersound";
import { Sprite } from "supersprite";
import { UIElement } from "../element";
import { Engine } from "../../engine";

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
    pressedOn: boolean;

    constructor(
        engine: Engine,
        sprite: Sprite,
        x: number,
        y: number,
        canvas?: HTMLCanvasElement,
        visible = true,
        padding = 0,
        hover = engine.snd.hover,
        click = engine.snd.click,
    ) {
        super(engine, x, y, visible);
        this.sprite = sprite;
        this.hover = hover;
        this.click = click;
        this.canvas = canvas;
        this.padding = padding; // Assuming padding is unidirectional (only square buttons)

        this.visible = true;
        this.hovered = false;
        this.clicked = false;
        this.pressedOn = false;
    }

    frame() {
        if (
            this.engine.input.mouse.isIn(
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

            if (this.engine.input.mouse.pressed.mouseLeft) {
                this.pressedOn = true;
                // Input's guard prevents playing the sound a lot at once
                if (this.click) {
                    this.click.play();
                }
            }

            this.clicked = this.pressedOn && this.engine.input.mouse.held.mouseLeft;
            if (this.pressedOn && this.engine.input.mouse.released.mouseLeft) {
                this.onClick();
            }
        } else {
            this.hovered = false;
            this.clicked = false;
        }

        if (!this.engine.input.mouse.pressed.mouseLeft && !this.engine.input.mouse.held.mouseLeft) {
            this.pressedOn = false;
        }
    }

    render() {
        this.engine.core.draw.sprite(
            this.sprite,
            Number(this.hovered) + Number(this.clicked),
            this.x,
            this.y,
        );
    }

    onClick() {}
}
