import { Adjacency, Coord, getCoordKey } from "./types";
import { Edges, LevelDefinition } from "./types";
import { Carrier } from "./carrier";
import { Parcel } from "./parcel";

export interface SolveState {
    placed: Edges;
    remaining: number;
}

export interface RunState {
    tick: number;
    nodes: Coord[];
    adjacency: Adjacency; // Tracks what nodes are accessible from other nodes
    carriers: Carrier[];
    parcel: Parcel;
}

export type GameStates = "edit" | "solve" | "run";

export class GameState {
    state: GameStates;
    level: LevelDefinition;
    solveState: SolveState | null;
    runState: RunState | null;

    constructor(level: LevelDefinition, startState: Exclude<GameStates, "run">) {
        this.state = startState;
        this.level = level;
        this.solveState = startState === "solve" ? this.newSolveState() : null;
        this.runState = null;
    }

    // Edit <---> Solve <---> Run
    // When in "edit" state, GameState will mutate the LevelDefinition

    toState(newState: GameStates) {
        const stateTransition = `${this.state}->${newState}`;
        switch (stateTransition) {
            case "edit->solve":
                // Start solving the level from edit mode
                this.state = newState;
                this.solveState = this.newSolveState();
                break;
            case "solve->run":
                // Start running the simulation
                if (!this.solveState) return;
                this.state = newState;
                this.runState = this.newRunState();
                break;
            case "run->solve":
                // Stop running the simulation
                this.state = newState;
                this.runState = null;
                break;
            case "solve->edit":
                // Unset solve state, back to level edit mode
                this.state = newState;
                this.solveState = null;
                break;
            default:
                // Do nothing on an undefined state transition
                break;
        }
    }

    tick(runState: RunState): RunState {
        // TODO
        return runState;
    }

    newSolveState(): SolveState {
        return {
            placed: new Map(),
            remaining: this.level.budget,
        };
    }

    newRunState(): RunState {
        return {
            tick: 0,
            nodes: this.level.nodes,
            adjacency: this.buildAdjacency(this.level.edges, this.solveState!.placed),
            carriers: this.level.carriers.map((init) => new Carrier(init)),
            parcel: new Parcel(this.level.parcel),
        };
    }

    buildAdjacency(levelEdges: Edges, placedEdges: Edges): Adjacency {
        const allEdges = new Map([...levelEdges, ...placedEdges]);
        const adj: Adjacency = new Map();
        allEdges.forEach((edge) => {
            for (const coord of edge) {
                const coordKey = getCoordKey(coord);
                const otherCoord = getCoordKey(edge[0]) === coordKey ? edge[1] : edge[0];
                const coordList = adj.get(coordKey);
                if (coordList) {
                    // Node is already on the map, append to it
                    coordList.push(otherCoord);
                } else {
                    // First time we're adding this node to the map
                    adj.set(coordKey, [otherCoord]);
                }
            }
        });
        return adj;
    }
}
