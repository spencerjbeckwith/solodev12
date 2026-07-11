/** A position of a node or a vector */
export interface Coord {
    x: number;
    y: number;
}

/** Returns a unique key for a Coord */
export function coordKey(c: Coord): string {
    return `${c.x},${c.y}`;
}

/** A connector between two nodes/positions */
export type Edge = [Coord, Coord];

/** Returns a unique key for an Edge, regardless of the order of its defined Coords */
export function edgeKey(edge: Edge): string {
    return edge.map((e) => coordKey(e)).join("|");
}

/** Set of all Edges currently in play between nodes */
export type Edges = Set<string>;

/** Map of a coordKey (string) to the nodes/positions it connects to */
export type Adjacency = Map<string, Coord[]>;

/** Immutable starting state of a playable level */
export interface LevelDefinition {
    nodes: Coord[];
    edges: Edges;
    budget: number;
    // TODO: carrierInit
    // TODO: parcelInit
}
