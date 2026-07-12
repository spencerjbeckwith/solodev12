import { Draw } from "supersprite";
import { Coord, Edge, Edges, getCoordKey, getEdgeKey, Nodes } from "../types";
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
    toggleNode(gx: number, gy: number): boolean {
        const coord = { x: gx, y: gy };
        const coordKey = getCoordKey(coord);
        if (this.nodes.has(coordKey)) {
            this.nodes.delete(coordKey);
            return false;
        } else {
            this.nodes.set(coordKey, coord);
            return true;
        }
    }

    /** Returns if an Edge may be added between two Coords */
    isValidEdge(edge: Edge, requireNodes: boolean): boolean {
        const from = edge[0];
        const to = edge[1];

        // Nodes must be different
        if (from.x === to.x && from.y === to.y) return false;

        // Nodes must be immediate neighbors
        if (Math.abs(from.x - to.x) > 1 || Math.abs(from.y - to.y) > 1) return false;

        // Ensure diagonal nodes are not crossed
        if (this.isDiagonal(edge)) {
            const opposing = this.getOpposingDiagonal(edge);
            if (this.edges.get(getEdgeKey(opposing))) {
                return false;
            }
        }

        // Ensure nodes are present (if required)
        if (requireNodes) {
            if (!this.nodes.get(getCoordKey(from)) || !this.nodes.get(getCoordKey(to))) {
                return false;
            }
        }

        return true;
    }

    isDiagonal(edge: Edge): boolean {
        return edge[0].x !== edge[1].x && edge[0].y !== edge[1].y;
    }

    getOpposingDiagonal(edge: Edge): Edge {
        const minX = Math.min(edge[0].x, edge[1].x);
        const maxX = Math.max(edge[0].x, edge[1].x);
        const minY = Math.min(edge[0].y, edge[1].y);
        const maxY = Math.max(edge[0].y, edge[1].y);
        const slopeDown =
            (edge[0].x === minX && edge[0].y === minY) ||
            (edge[0].x === maxX && edge[0].y === maxY);
        return slopeDown
            ? [
                  {
                      x: minX,
                      y: maxY,
                  },
                  {
                      x: maxX,
                      y: minY,
                  },
              ]
            : [
                  {
                      x: minX,
                      y: minY,
                  },
                  {
                      x: maxX,
                      y: maxY,
                  },
              ];
    }

    /** Toggles an Edge connecting two Coords */
    // This doesn't check if the edge is valid: call isValidEdge before!
    toggleEdge(edge: Edge): boolean {
        const edgeKey = getEdgeKey(edge);
        if (this.edges.has(edgeKey)) {
            this.edges.delete(edgeKey);
            return false;
        } else {
            this.edges.set(edgeKey, edge);

            // If either node doesn't exist, create it
            for (const coord of edge) {
                const coordKey = getCoordKey(coord);
                if (!this.nodes.has(coordKey)) {
                    this.nodes.set(coordKey, coord);
                }
            }
            return true;
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
