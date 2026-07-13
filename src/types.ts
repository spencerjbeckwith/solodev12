/** A position of a node or a vector */
export interface Coord {
    readonly x: number;
    readonly y: number;
}

/** A connector between two nodes/positions */
export type Edge = [Coord, Coord];

/** Map of all Nodes in the level, indexed by coordKey */
export type Nodes = Map<string, Coord>;

/** Map of all Edges currently in play between nodes, indexed by edgeKey */
export type Edges = Map<string, Edge>;

export type EdgePlacementResult = "placed" | "removed" | "blocked";
