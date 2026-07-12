import { Draw } from "supersprite";
import { Edges, getCoordKey, Nodes } from "../types";
import { CarrierInit } from "./carrier";
import { ParcelInit } from "./parcel";
import spr from "../sprites.json";
import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE } from "../constants";

/** Immutable starting state of a playable level */
export interface LevelDefinition {
    nodes: Nodes;
    edges: Edges;
    budget: number;
    carriers: CarrierInit[];
    parcel: ParcelInit;
}

/** Loaded LevelDefinition */
export class Level {
    nodes: Nodes;
    edges: Edges;
    budget: number;
    carriers: CarrierInit[];
    parcel: ParcelInit;

    constructor(definition?: LevelDefinition) {
        if (!definition) {
            definition = Level.definition();
        }
        this.nodes = definition.nodes;
        this.edges = definition.edges;
        this.budget = definition.budget;
        this.carriers = definition.carriers;
        this.parcel = definition.parcel;
    }

    /** Returns if the given grid X and Y coordinates are on a node in the level */
    hasNode(gx: number, gy: number): boolean {
        return this.nodes.has(getCoordKey({ x: gx, y: gy }));
    }

    /** Toggles a node at the given X and Y coordinates */
    toggleNode(gx: number, gy: number) {
        const coord = { x: gx, y: gy };
        const coordKey = getCoordKey(coord);
        if (this.nodes.has(coordKey)) {
            this.nodes.delete(coordKey);
        } else {
            this.nodes.set(coordKey, coord);
        }
    }

    load() {
        // TODO: read from JSON (how does this handle maps?)
    }

    save() {
        // TODO: write to JSON (how does this handle maps?)
    }

    render(draw: Draw) {
        // Render edges (each lands below the node)
        // TODO

        // Render nodes
        for (const [coordKey, coord] of this.nodes) {
            const sprite = spr.node;
            const px = GRID_OFFSET_X + coord.x * GRID_SIZE + GRID_SIZE / 2 - sprite.width / 2;
            const py = GRID_OFFSET_Y + coord.y * GRID_SIZE + GRID_SIZE / 2 - sprite.height / 2;
            const image = (coord.x + coord.y) % sprite.images.length;
            draw.sprite(sprite, image, px, py);
        }
    }

    /** Returns a new, empty LevelDefinition */
    static definition(): LevelDefinition {
        const def: LevelDefinition = {
            nodes: new Map(),
            edges: new Map(),
            budget: 0,
            carriers: [],
            // @ts-ignore
            parcel: null, // TODO: define parcel
        };
        return def;
    }
}
