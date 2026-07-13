import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE, GRID_SIZE_H, GRID_SIZE_W } from "./constants";
import { Coord, Edge, Edges, Nodes } from "./types";

/** Pixel X of the center of grid column `gx` */
export function gridToPixelX(gx: number): number {
    return GRID_OFFSET_X + gx * GRID_SIZE + GRID_SIZE / 2;
}

/** Pixel Y of the center of grid row `gy` */
export function gridToPixelY(gy: number): number {
    return GRID_OFFSET_Y + gy * GRID_SIZE + GRID_SIZE / 2;
}

/**
 * Grid column for pixel X `px`, or null if outside the grid (or within `margin`
 * pixels of a cell edge).
 */
export function pixelToGridX(px: number, margin = 0): number | null {
    return pixelToGrid(px, GRID_OFFSET_X, GRID_SIZE_W, margin);
}

/**
 * Grid row for pixel Y `py`, or null if outside the grid (or within `margin`
 * pixels of a cell edge).
 */
export function pixelToGridY(py: number, margin = 0): number | null {
    return pixelToGrid(py, GRID_OFFSET_Y, GRID_SIZE_H, margin);
}

function pixelToGrid(
    value: number,
    gridOffset: number,
    dimensionSize: number,
    margin: number,
): number | null {
    // Null if outside grid entirely
    if (value < gridOffset || value > gridOffset + GRID_SIZE * dimensionSize) {
        return null;
    }
    value -= gridOffset;

    // Ensure our value is within the cell by the margin amount
    const within = value % GRID_SIZE;
    if (within < margin || within > GRID_SIZE - margin) {
        return null;
    }

    // Convert to grid coordinate
    return Math.floor(value / GRID_SIZE);
}

export function vectorToHeading(x: number, y: number): number {
    if (x > 0 && y === 0) return 0;
    if (x > 0 && y < 0) return 1;
    if (x === 0 && y < 0) return 2;
    if (x < 0 && y < 0) return 3;
    if (x < 0 && y === 0) return 4;
    if (x < 0 && y > 0) return 5;
    if (x === 0 && y > 0) return 6;
    if (x > 0 && y > 0) return 7;
    return 6; // Down
}

/** Inverse of `vectorToHeading`: the unit vector for a heading (0-7, clockwise from right) */
export function headingToVector(heading: number): Coord {
    switch (heading) {
        case 0:
            return { x: 1, y: 0 };
        case 1:
            return { x: 1, y: -1 };
        case 2:
            return { x: 0, y: -1 };
        case 3:
            return { x: -1, y: -1 };
        case 4:
            return { x: -1, y: 0 };
        case 5:
            return { x: -1, y: 1 };
        case 6:
            return { x: 0, y: 1 };
        case 7:
            return { x: 1, y: 1 };
        default:
            return { x: 0, y: 1 };
    }
}

/** Returns a unique key for a Coord */
function getCoordKey(c: Coord): string;
function getCoordKey(x: number, y: number): string;
function getCoordKey(c: Coord | number, y?: number): string {
    if (typeof c === "object") {
        return `${c.x},${c.y}`;
    }
    return `${c},${y}`;
}

export { getCoordKey };

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

/** Transforms an Edge to a vector (one relative Coord instead of two) */
export function toVector(edge: Edge): Coord {
    return {
        x: edge[1].x - edge[0].x,
        y: edge[1].y - edge[0].y,
    };
}
