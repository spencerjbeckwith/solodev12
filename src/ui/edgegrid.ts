import { Color } from "supersprite";
import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE, GRID_SIZE_H, GRID_SIZE_W } from "../constants";
import { Engine } from "../engine";
import { Coord, Edge, getCoordKey } from "../types";
import { UIElement } from "./element";

export class EdgeGrid extends UIElement {
    dragging: boolean;
    from: Coord | null;
    edgeDragMargin: number;
    canvas?: HTMLCanvasElement;

    // UI effects
    n: number;
    dragColor: Color;
    confirmColor: Color;

    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, 0, 0, true);
        this.dragging = false;
        this.from = null;
        this.edgeDragMargin = 7;
        this.canvas = canvas;

        this.n = 0;
        this.dragColor = new Color("#b0b0c0");
        this.confirmColor = new Color("#41c502");
    }

    frame() {
        // TODO: make sure to put in the budget

        const gx = this.mouseToGridX(this.edgeDragMargin);
        const gy = this.mouseToGridY(this.edgeDragMargin);
        if (!this.dragging) {
            // Listen for clicks within the nodes
            if (this.engine.input.mouse.pressed.mouseLeft) {
                if (gx !== null && gy !== null) {
                    // TODO in solve mode, don't allow drag to start without a node!
                    this.setDrag(gx, gy);
                }
            }
        } else {
            // Listen for mouse releases on nearby nodes
            if (this.engine.input.mouse.released.mouseLeft) {
                if (this.from !== null && gx !== null && gy !== null) {
                    const to: Coord = { x: gx, y: gy };
                    if (getCoordKey(this.from) !== getCoordKey(to)) {
                        // Released on another node, see if we can connect to it
                        const edge: Edge = [this.from, to];
                        if (this.engine.state.isValidEdge(edge)) {
                            switch (this.engine.state.toggleEdge(edge)) {
                                case "placed":
                                    this.engine.snd.place.play();
                                    break;
                                case "removed":
                                    this.engine.snd.break.play();
                                    break;
                                case "blocked":
                                    this.engine.snd.no.play();
                                    break;
                            }
                        } else {
                            this.engine.snd.no.play();
                        }
                    }
                }
                this.unsetDrag();
            }

            // If mouse leaves the grid area, cancel
            const mx = this.engine.input.mouse.x;
            const my = this.engine.input.mouse.y;
            if (
                mx < GRID_OFFSET_X ||
                mx > GRID_OFFSET_X + GRID_SIZE_W * GRID_SIZE ||
                my < GRID_OFFSET_Y ||
                my > GRID_OFFSET_Y + GRID_SIZE_H * GRID_SIZE
            ) {
                this.unsetDrag();
            }
        }
    }

    setDrag(gx: number, gy: number) {
        // ^ Grid coordinates, not pixel coords
        this.dragging = true;
        this.from = { x: gx, y: gy };
    }

    unsetDrag() {
        this.dragging = false;
        this.from = null;
    }

    render() {
        const gx = this.mouseToGridX(this.edgeDragMargin);
        const gy = this.mouseToGridY(this.edgeDragMargin);
        if (!this.dragging) {
            if (gx !== null && gy !== null) {
                // Mouse is within a node's clickable region, show an indicator
                if (this.canvas) {
                    this.canvas.style.cursor = "grab";
                }
            }
        } else {
            // Pulse effect when dragging
            this.n += Math.PI / 45;
            if (this.n >= Math.PI * 2) {
                this.n -= Math.PI * 2;
            }
            this.dragColor.alpha = 0.7 + Math.sin(this.n) * 0.3;

            // Show drag of the route to target mouse position
            if (this.from && this.canvas) {
                this.canvas.style.cursor = "grabbing";
                this.engine.core.draw.line(
                    this.gridToMouseX(this.from.x),
                    this.gridToMouseY(this.from.y),
                    this.engine.input.mouse.x,
                    this.engine.input.mouse.y,
                    this.dragColor,
                );
            }
            if (this.from !== null && gx !== null && gy !== null) {
                const e: Edge = [this.from, { x: gx, y: gy }];
                if (this.engine.state.isValidEdge(e)) {
                    this.engine.core.draw.line(
                        this.gridToMouseX(this.from.x),
                        this.gridToMouseY(this.from.y),
                        this.gridToMouseX(gx),
                        this.gridToMouseY(gy),
                        this.confirmColor,
                    );
                }
            }
        }
    }

    mouseToGridX(margin = 0): number | null {
        let mx = this.engine.input.mouse.x;
        return this.gridCellDimension(margin, mx, GRID_OFFSET_X, GRID_SIZE_W);
    }

    mouseToGridY(margin = 0): number | null {
        const my = this.engine.input.mouse.y;
        return this.gridCellDimension(margin, my, GRID_OFFSET_Y, GRID_SIZE_H);
    }

    gridToMouseX(gx: number): number {
        return GRID_OFFSET_X + gx * GRID_SIZE + GRID_SIZE / 2;
    }

    gridToMouseY(gy: number): number {
        return GRID_OFFSET_Y + gy * GRID_SIZE + GRID_SIZE / 2;
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
