import { GRID_SIZE_H, GRID_SIZE_W } from "../constants";
import { Engine } from "../engine";
import { Coord } from "../types";
import { NodeButton } from "./buttons/NodeButton";
import { UIElement } from "./element";

export class NodeGrid extends UIElement {
    canvas?: HTMLCanvasElement;

    constructor(engine: Engine, canvas?: HTMLCanvasElement) {
        super(engine, 0, 0);
        this.canvas = canvas;
        this.initGrid();
    }

    initGrid() {
        const gridCells: Coord[] = [];
        for (let gx = 0; gx < GRID_SIZE_W; gx++) {
            for (let gy = 0; gy < GRID_SIZE_H; gy++) {
                gridCells.push({
                    x: gx,
                    y: gy,
                });
            }
        }

        for (const coord of gridCells) {
            this.children.push(new NodeButton(this.engine, coord.x, coord.y, this.canvas));
        }
    }
}
