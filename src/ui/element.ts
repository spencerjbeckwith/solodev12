import { GameState } from "../game/state";

export class UIElement {
    state: GameState;
    x: number;
    y: number;
    visible: boolean;

    constructor(state: GameState, x: number, y: number, visible = true) {
        this.state = state;
        this.x = x;
        this.y = y;
        this.visible = visible;
    }

    frame(): void {}
    render(): void {}
}
