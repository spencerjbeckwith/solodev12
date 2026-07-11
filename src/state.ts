import { Edges, LevelDefinition } from "./types";

export interface SolveState {
    placed: Edges;
    attempts: number;
}

export interface RunState {
    tick: number;
    // TODO
}

export type GameStates = "edit" | "solve" | "run";

export class GameState {
    state: GameStates;
    level: LevelDefinition;

    constructor() {
        this.state = "edit";
    }

    // Edit <---> Solve <---> Run
    // When in "edit" state, GameState will mutate the LevelDefinition

    toState(newState: GameStates) {
        const stateTransition = `${this.state}->${newState}`;
        switch (stateTransition) {
            case "edit->solve":
                // Start solving the level from edit mode
                // TODO
                break;
            case "solve->run":
                // Start running the simulation
                // TODO
                break;
            case "run->solve":
                // Stop running the simulation
                // TODO
                break;
            case "solve->edit":
                // Unset any solution variables, back to level edit mode
                // TODO
                break;
            default:
                // Do nothing on an undefined state transition
                break;
        }
    }

    tick() {
        // TODO
    }
}
