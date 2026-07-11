/** A position of a node or a vector */
export interface Coord {
    readonly x: number;
    readonly y: number;
}

/** Returns a unique key for a Coord */
export function getCoordKey(c: Coord): string {
    return `${c.x},${c.y}`;
}

/** A connector between two nodes/positions */
export type Edge = [Coord, Coord];

/** Returns a unique key for an Edge, regardless of the order of its defined Coords */
export function getEdgeKey(edge: Edge): string {
    return edge
        .map((e) => getCoordKey(e))
        .sort()
        .join("|");
}

/** Transforms a list of individual Coord objects (nodes) into a Nodes map */
export function toNodes(nodes: Coord[]): Nodes {
    return new Map(nodes.map((n) => [getCoordKey(n), n]));
}

/** Transforms a list of individual Edge objects to an Edges map */
export function toEdges(edges: Edge[]): Edges {
    return new Map(edges.map((e) => [getEdgeKey(e), e]));
}

/** Map of all Nodes in the level, indexed by coordKey */
export type Nodes = Map<string, Coord>;

/** Map of all Edges currently in play between nodes, indexed by edgeKey */
export type Edges = Map<string, Edge>;

/** Map of all nodes/positions a given node connects to, indexed by coordKey */
export type Adjacency = Map<string, Coord[]>;
