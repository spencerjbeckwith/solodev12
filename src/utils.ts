import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE, GRID_SIZE_H, GRID_SIZE_W } from "./constants";
import { Coord } from "./types";

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
