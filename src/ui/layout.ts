import { GameState, GameStates } from "../game/state";
import { DoneButton } from "./buttons/DoneButton";
import { EditButton } from "./buttons/EditButton";
import { RunButton } from "./buttons/RunButton";
import { StopButton } from "./buttons/StopButton";
import { UIElement } from "./element";

export class Layout {
    state: GameState;
    ui: Record<GameStates, UIElement[]>;
    canvas?: HTMLCanvasElement;

    constructor(state: GameState, canvas: HTMLCanvasElement) {
        this.state = state;
        this.ui = {
            edit: [new DoneButton(state, canvas)],
            solve: [new RunButton(state, canvas), new EditButton(state, canvas)],
            run: [new StopButton(state, canvas)],
        };
        this.canvas = canvas;
    }

    frame() {
        if (this.canvas) {
            this.canvas.style.cursor = "default";
        }
        const current = this.ui[this.state.state].filter((e) => e.visible);
        for (const element of current) {
            element.frame();
        }
    }

    render() {
        const current = this.ui[this.state.state].filter((e) => e.visible);
        for (const element of current) {
            element.render();
        }
    }
}
