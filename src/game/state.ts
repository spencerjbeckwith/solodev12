import { Draw } from "supersprite";
import { TICK_FRAMES, WAIT_FRAMES } from "../constants";
import { Edges, Nodes, Edge, EdgePlacementResult } from "../types";
import { getCoordKey, getEdgeKey } from "../utils";
import { Adjacency } from "./adjacency";
import { Carrier } from "./entities/carrier";
import { Level } from "./level";
import { Parcel } from "./entities/parcel";
import { Destination } from "./entities/destination";
import { Entity } from "./entities/entity";
import { Engine } from "../engine";

export interface EditState {
    entityToggle: "carrier" | "destination" | "parcel" | null;
}

export interface SolveState {
    placed: Edges;
    remaining: number;
}

export interface RunState {
    tick: number;
    framesLeft: number;
    nodes: Nodes;
    adjacency: Adjacency;
    entities: Entity[];
    remainingDeliveries: number;
    carriers: Map<string, Carrier[]>; // Indexed by coordKey
    parcels: Map<string, Parcel>; // Indexed by coordKey, keys deleted when Parcels are picked up
}

export type GameStates = "edit" | "solve" | "run";

export class GameState {
    state: GameStates;
    level: Level;
    editState: EditState;
    solveState: SolveState | null;
    runState: RunState | null;
    canEdit: boolean;

    constructor(level: Level, startState: Exclude<GameStates, "run">, canEdit: boolean) {
        this.state = startState;
        this.level = level;
        this.editState = this.newEditState();
        this.solveState = startState === "solve" || !canEdit ? this.newSolveState() : null;
        this.runState = null;
        this.canEdit = canEdit;
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
                if (!this.canEdit) return;
                this.state = newState;
                this.solveState = null;
                this.editState = this.newEditState();
                break;
            default:
                // Do nothing on an undefined state transition
                break;
        }
    }

    frame(e: Engine) {
        if (this.state === "run") {
            const s = this.runState!;
            const elapsed = Math.min(TICK_FRAMES, TICK_FRAMES - s.framesLeft);
            s.framesLeft--;

            // Call frame on all Entities
            for (const entity of s.entities) {
                if (entity.active) {
                    entity.frame(e, elapsed);
                }
            }

            if (s.framesLeft === 0) {
                // Tick is over
                this.endTick(e, s);
            }

            if (s.framesLeft === -WAIT_FRAMES) {
                // Start new tick after waiting
                this.tick(e, s);
            }
        }
    }

    tick(e: Engine, s: RunState) {
        s.tick++;
        s.framesLeft = TICK_FRAMES;
        for (const entity of s.entities) {
            if (entity.active) {
                entity.tick(e, s);
            }
        }

        // Update lookup map for Carriers
        s.carriers.clear();
        for (const c of s.entities) {
            if (c instanceof Carrier) {
                const coordKey = getCoordKey(c.gx, c.gy);
                if (s.carriers.has(coordKey)) {
                    // Key already exists, meaning we have multiple Carriers on one node
                    const list = s.carriers.get(coordKey);
                    list!.push(c);
                } else {
                    // Key doesn't exist (yet - there may still be multiple Carriers that wind up here)
                    const list = [c];
                    s.carriers.set(coordKey, list);
                }
            }
        }

        return s;
    }

    endTick(e: Engine, s: RunState) {
        for (const entity of s.entities) {
            if (entity.active) {
                entity.endTick(e, s);
            }
        }

        // TODO check for handoffs here

        // TODO is the level over?

        return s;
    }

    render(e: Engine) {
        if (this.state === "run") {
            // Render in depth order
            const ordered = this.runState!.entities.filter(
                (entity) => entity.active && entity.visible,
            ).sort((a, b) => a.depth - b.depth);
            for (const entity of ordered) {
                entity.render(e);
            }
        }
    }

    newEditState(): EditState {
        return {
            entityToggle: null,
        };
    }

    newSolveState(): SolveState {
        return {
            placed: new Map(),
            remaining: this.level.budget,
        };
    }

    newRunState(): RunState {
        let remainingDeliveries = 0;

        // Initialie entities into lists from their maps
        const entities: Entity[] = [];
        const carriers: Map<string, Carrier[]> = new Map();
        this.level.carriers.forEach((init) => {
            const c = new Carrier(init);
            entities.push(c);
            carriers.set(getCoordKey(c.gx, c.gy), [c]);
            // Only one carrier can start on a node, so list can always start empty
        });
        const parcels: Map<string, Parcel> = new Map();
        this.level.parcels.forEach((init) => {
            const p = new Parcel(init);
            entities.push(p);
            parcels.set(getCoordKey(p.gx, p.gy), p);
            // All parcels start sitting on the ground - Carriers may pick them up on their first tick
        });
        this.level.destinations.forEach((init) => {
            entities.push(new Destination(init));
            remainingDeliveries++;
        });

        // Create adjacency
        const allEdges = new Map([...this.level.edges, ...this.solveState!.placed]);
        const adj = new Adjacency(allEdges);

        return {
            tick: 0,
            framesLeft: 0, // Wait until first tick() call to start
            nodes: this.level.nodes,
            adjacency: adj,
            entities,
            remainingDeliveries,
            carriers,
            parcels,
        };
    }

    isValidEdge(edge: Edge): boolean {
        if (this.state === "solve" && this.solveState) {
            // Not allowed to change edges in the level when solving
            const edgeKey = getEdgeKey(edge);
            if (this.level.edges.has(edgeKey)) {
                return false;
            }

            const allEdges = new Map([...this.level.edges, ...this.solveState.placed]);
            return this.level.isValidEdge(edge, allEdges, true);
        }
        return this.level.isValidEdge(edge, this.level.edges, false);
    }

    toggleEdge(edge: Edge): EdgePlacementResult {
        if (this.state === "edit") {
            return this.level.toggleEdge(edge);
        }
        if (this.state === "solve") {
            return this.toggleSolveEdge(edge);
        }
        return "blocked";
    }

    toggleSolveEdge(edge: Edge): EdgePlacementResult {
        const solve = this.solveState;
        if (solve) {
            const edgeKey = getEdgeKey(edge);
            if (solve.placed.has(edgeKey)) {
                solve.placed.delete(edgeKey);
                solve.remaining++;
                return "removed";
            } else {
                if (solve.remaining > 0) {
                    solve.placed.set(edgeKey, edge);
                    solve.remaining--;
                    return "placed";
                } else {
                    return "blocked";
                }
            }
        }
        return "blocked";
    }
}
