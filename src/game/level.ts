import { Draw } from "supersprite";
import { Edge, EdgePlacementResult, Edges, Nodes } from "../types";
import { CarrierInit, renderCarrierInit } from "./entities/carrier";
import { ParcelInit, renderParcelInit } from "./entities/parcel";
import spr from "../sprites.json";
import { getCoordKey, getEdgeKey, gridToPixelX, gridToPixelY } from "../utils";
import { DestinationInit, renderDestinationInit } from "./entities/destination";
import { GameStates } from "./state";

/** Immutable starting state of a playable level */
export interface LevelDefinition {
    nodes: Nodes;
    edges: Edges;
    budget: number;
    carriers: CarrierInit[];
    parcels: ParcelInit[];
    destinations: DestinationInit[];
}

/** Loaded LevelDefinition */
export class Level {
    nodes: Nodes;
    edges: Edges;
    budget: number;

    // Indexed by coordKey
    carriers: Map<string, CarrierInit>;
    parcels: Map<string, ParcelInit>;
    destinations: Map<string, DestinationInit>;

    constructor(definition?: LevelDefinition) {
        if (!definition) {
            definition = Level.definition();
        }
        this.nodes = definition.nodes;
        this.edges = definition.edges;
        this.budget = definition.budget;

        // Load resources for each init
        this.carriers = new Map();
        for (const init of definition.carriers) {
            this.carriers.set(getCoordKey(init.gx, init.gy), init);
        }
        this.parcels = new Map();
        for (const init of definition.parcels) {
            this.parcels.set(getCoordKey(init.gx, init.gy), init);
        }
        this.destinations = new Map();
        for (const init of definition.destinations) {
            this.destinations.set(getCoordKey(init.gx, init.gy), init);
        }
    }

    /** Returns if the given grid X and Y coordinates are on a node in the level */
    hasNode(gx: number, gy: number): boolean {
        return this.nodes.has(getCoordKey(gx, gy));
    }

    /** Toggles a node at the given X and Y coordinates */
    toggleNode(gx: number, gy: number): boolean {
        const coordKey = getCoordKey(gx, gy);
        if (this.nodes.has(coordKey)) {
            this.nodes.delete(coordKey);

            // Any edge connected to this node should also be deleted
            for (const [edgeKey, edge] of this.edges) {
                if (edgeKey.includes(coordKey)) {
                    this.edges.delete(edgeKey);
                }
            }

            // Any Carrier starting on this node should be deleted
            if (this.carriers.has(coordKey)) {
                this.carriers.delete(coordKey);
            }

            return false;
        } else {
            this.nodes.set(coordKey, { x: gx, y: gy });
            return true;
        }
    }

    /** Toggles a Carrier at the given X and Y grid coordinates */
    toggleCarrier(gx: number, gy: number): boolean {
        const coordKey = getCoordKey(gx, gy);
        if (this.carriers.has(coordKey)) {
            this.carriers.delete(coordKey);
            return false;
        } else {
            this.carriers.set(coordKey, {
                gx,
                gy,
                heading: 6,
            });

            // If no node at this location, create one
            if (!this.nodes.has(coordKey)) {
                this.nodes.set(coordKey, { x: gx, y: gy });
            }
            return true;
        }
    }

    /** Toggles a Parcel at the given X and Y grid coordinates */
    toggleParcel(gx: number, gy: number): boolean {
        const coordKey = getCoordKey(gx, gy);
        if (this.parcels.has(coordKey)) {
            this.parcels.delete(coordKey);
            return false;
        } else {
            this.parcels.set(coordKey, {
                gx,
                gy,
            });

            // If no node at this location, create one
            if (!this.nodes.has(coordKey)) {
                this.nodes.set(coordKey, { x: gx, y: gy });
            }
            return true;
        }
    }

    /** Toggles a Destination at the given X and Y grid coordinates */
    toggleDestination(gx: number, gy: number): boolean {
        const coordKey = getCoordKey(gx, gy);
        if (this.destinations.has(coordKey)) {
            this.destinations.delete(coordKey);
            return false;
        } else {
            this.destinations.set(coordKey, {
                gx,
                gy,
            });

            // If no node at this location, create one
            if (!this.nodes.has(coordKey)) {
                this.nodes.set(coordKey, { x: gx, y: gy });
            }
            return true;
        }
        // It would be nice to merge these into some toggleEntity function (too bad I'm almost out of time)
    }

    /** Returns a CarrierInit object at a given node, if any */
    getCarrierInit(gx: number, gy: number): CarrierInit | undefined {
        return this.carriers.get(getCoordKey(gx, gy));
    }

    /** Returns a ParcelInit object at a given node, if any */
    getParcelInit(gx: number, gy: number): ParcelInit | undefined {
        return this.parcels.get(getCoordKey(gx, gy));
    }

    /** Returns a DestinationInit object at a given node, if any */
    getDestinationInit(gx: number, gy: number): DestinationInit | undefined {
        return this.destinations.get(getCoordKey(gx, gy));
    }

    /** Returns if an Edge may be added between two Coords */
    isValidEdge(edge: Edge, edges: Edges, requireNodes: boolean): boolean {
        const from = edge[0];
        const to = edge[1];

        // Nodes must be different
        if (from.x === to.x && from.y === to.y) return false;

        // Nodes must be immediate neighbors
        if (Math.abs(from.x - to.x) > 1 || Math.abs(from.y - to.y) > 1) return false;

        // Ensure diagonal nodes are not crossed
        if (this.isDiagonal(edge)) {
            const opposing = this.getOpposingDiagonal(edge);
            if (edges.get(getEdgeKey(opposing))) {
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

    /** True if the diagonal runs top-left to bottom-right (\), i.e. y increases with x */
    slopesDown(edge: Edge): boolean {
        const left = edge[0].x < edge[1].x ? edge[0] : edge[1];
        const right = edge[0].x < edge[1].x ? edge[1] : edge[0];
        return left.y < right.y;
    }

    getOpposingDiagonal(edge: Edge): Edge {
        const minX = Math.min(edge[0].x, edge[1].x);
        const maxX = Math.max(edge[0].x, edge[1].x);
        const minY = Math.min(edge[0].y, edge[1].y);
        const maxY = Math.max(edge[0].y, edge[1].y);
        return this.slopesDown(edge)
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
    toggleEdge(edge: Edge): EdgePlacementResult {
        const edgeKey = getEdgeKey(edge);
        if (this.edges.has(edgeKey)) {
            this.edges.delete(edgeKey);
            return "removed";
        } else {
            this.edges.set(edgeKey, edge);

            // If either node doesn't exist, create it
            for (const coord of edge) {
                const coordKey = getCoordKey(coord);
                if (!this.nodes.has(coordKey)) {
                    this.nodes.set(coordKey, coord);
                }
            }
            return "placed";
        }
    }

    load() {
        // TODO: read from JSON (how does this handle maps?)
    }

    save() {
        // TODO: write to JSON (how does this handle maps?)
    }

    render(draw: Draw, state: GameStates, playerEdges?: Edges) {
        // Render edges (each lands below the node)
        for (const [edgeKey, edge] of this.edges) {
            this.renderEdge(draw, edge, false);
        }
        if (playerEdges) {
            for (const [edgeKey, edge] of playerEdges) {
                this.renderEdge(draw, edge, true);
            }
        }

        // Render nodes
        for (const [coordKey, coord] of this.nodes) {
            const sprite = spr.node;
            const px = gridToPixelX(coord.x) - sprite.width / 2;
            const py = gridToPixelY(coord.y) - sprite.height / 2;
            const image = (coord.x + coord.y) % sprite.images.length;
            draw.sprite(sprite, image, px, py);
        }

        if (state !== "run") {
            // Render init objects
            for (const [coordKey, carrierInit] of this.carriers) {
                renderCarrierInit(draw, carrierInit.gx, carrierInit.gy, carrierInit.heading);
            }
            for (const [coordKey, destinationInit] of this.destinations) {
                renderDestinationInit(
                    draw,
                    destinationInit.gx,
                    destinationInit.gy,
                    state === "edit",
                );
            }
            for (const [coordKey, parcelInit] of this.parcels) {
                renderParcelInit(draw, parcelInit.gx, parcelInit.gy, state === "edit");
            }
        }
    }

    renderEdge(draw: Draw, edge: Edge, playerBuilt: boolean) {
        const sprite = spr.edge;

        // Determine image to render:
        // 0: horizontal
        // 1: vertical
        // 2: sloping down
        // 3: sloping up
        // +4 for player-built
        let image: number;
        if (edge[0].y === edge[1].y) {
            image = 0;
        } else if (edge[0].x === edge[1].x) {
            image = 1;
        } else {
            image = this.slopesDown(edge) ? 2 : 3;
        }

        // Determine X and Y to place the sprite (based on image).
        // The sprite is one grid-gap wide, so its ends bridge adjacent node centers.
        // Anchor from the center of the top-left node the edge touches (min x, min y).
        const minX = Math.min(edge[0].x, edge[1].x);
        const minY = Math.min(edge[0].y, edge[1].y);
        const cx = gridToPixelX(minX);
        const cy = gridToPixelY(minY);

        let x: number;
        let y: number;
        if (image === 0) {
            // Horizontal: run right from the left node's center, centered vertically
            x = cx;
            y = cy - sprite.height / 2;
        } else if (image === 1) {
            // Vertical: run down from the top node's center, centered horizontally
            x = cx - sprite.width / 2;
            y = cy;
        } else {
            // Diagonal (both slopes): sprite fills the cell between the two node centers
            x = cx;
            y = cy;
        }

        if (playerBuilt) {
            image += 4;
        }
        draw.sprite(sprite, image, x, y + 3);
    }

    /** Returns a new, empty LevelDefinition */
    static definition(): LevelDefinition {
        const def: LevelDefinition = {
            nodes: new Map(),
            edges: new Map(),
            budget: 5,
            carriers: [],
            parcels: [],
            destinations: [],
        };
        return def;
    }
}
