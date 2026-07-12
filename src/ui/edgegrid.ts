import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE, GRID_SIZE_H, GRID_SIZE_W } from "../constants";
import { Engine } from "../engine";
import { Coord } from "../types";
import { UIElement } from "./element";

export type CreateEdgeFunction = (from: Coord, to: Coord) => void;

export class EdgeGrid extends UIElement {
    create: CreateEdgeFunction;
    dragging: boolean;
    from: Coord | null;

    constructor(engine: Engine, create: CreateEdgeFunction) {
        super(engine, 0, 0, true);
        this.create = create;
        this.dragging = false;
        this.from = null;
    }

    frame() {
        // TODO: make sure to put in the budget

        if (!this.dragging) {
            // Listen for clicks within the nodes
            // TODO
        } else {
            // Listen for mouse releases on nearby nodes
            // TODO
            // If mouse leaves the grid area, cancel
            // TODO
        }
    }

    render() {
        if (!this.dragging) {
            // If mouse is within a node's clickable region, show an indicator
            // TODO
        } else {
            // Show drag of the route to target mouse position
            // TODO
        }
        const mx = this.mouseToGridX(8);
        const my = this.mouseToGridY(8);
        this.engine.core.draw.text(`${mx}, ${my}`, 0, 80);
    }

    mouseToGridX(margin = 0): number | null {
        let mx = this.engine.input.mouse.x;
        return this.gridCellDimension(margin, mx, GRID_OFFSET_X, GRID_SIZE_W);
    }

    mouseToGridY(margin = 0): number | null {
        const my = this.engine.input.mouse.y;
        return this.gridCellDimension(margin, my, GRID_OFFSET_Y, GRID_SIZE_H);
    }

    private gridCellDimension(
        margin: number,
        value: number,
        gridOffset: number,
        dimensionSize: number,
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
        value = Math.floor(value / GRID_SIZE);
        return value;
    }
}
