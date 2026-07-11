import { describe, it } from "mocha";
import expect from "expect";
import { GameState } from "./state";
import { Level } from "./level";
import { toEdges } from "../types";

describe("GameState", () => {
    it("can initialize in edit mode", () => {
        const gs = new GameState(new Level(), "edit", true);
        expect(gs.state).toBe("edit");
        expect(gs.solveState).toBeNull();
        expect(gs.runState).toBeNull();
    });

    it("can initialize in solve mode", () => {
        const gs = new GameState(new Level(), "solve", true);
        expect(gs.state).toBe("solve");
        expect(gs.solveState).not.toBeNull();
        expect(gs.runState).toBeNull();
    });

    it("runs state transitions", () => {
        const gs = new GameState(new Level(), "edit", true);
        gs.toState("solve");
        expect(gs.state).toBe("solve");
        expect(gs.solveState).not.toBeNull();
        gs.toState("run");
        expect(gs.state).toBe("run");
        expect(gs.runState).not.toBeNull();
        gs.toState("solve");
        expect(gs.state).toBe("solve");
        expect(gs.solveState).not.toBeNull();
        expect(gs.runState).toBeNull();
        gs.toState("edit");
        expect(gs.state).toBe("edit");
        expect(gs.solveState).toBeNull();
    });

    it("does nothing on invalid state transitions", () => {
        const gs = new GameState(new Level(), "edit", true);
        gs.toState("run");
        expect(gs.state).toBe("edit");

        // Transition to run
        gs.toState("solve");
        gs.toState("run");

        // Attempt to go back
        gs.toState("edit");
        expect(gs.state).toBe("run");
    });

    it("builds adjacency between nodes", () => {
        const gs = new GameState(new Level(), "edit", true);
        const adj = gs.buildAdjacency(
            toEdges([
                [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                ],
                [
                    { x: 0, y: 2 },
                    { x: 1, y: 1 },
                ],
                [
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                ],
                [
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                ],
            ]),
            new Map(),
        );
        expect(adj.get("0,0")!.length).toBe(1);
        expect(adj.get("1,1")!.length).toBe(4);
        expect(adj.get("2,1")!.length).toBe(2);
        expect(adj.get("0,2")!.length).toBe(1);
        expect(adj.get("1,2")!.length).toBe(2);
    });

    it("combines level-defined and player-placed edges", () => {
        const gs = new GameState(new Level(), "edit", true);
        const adj = gs.buildAdjacency(
            toEdges([
                [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                ],
                [
                    { x: 0, y: 2 },
                    { x: 1, y: 1 },
                ],
            ]),
            toEdges([
                [
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                ],
                [
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                ],
            ]),
        );
        expect(adj.get("0,0")!.length).toBe(1);
        expect(adj.get("1,1")!.length).toBe(4);
        expect(adj.get("2,1")!.length).toBe(2);
        expect(adj.get("0,2")!.length).toBe(1);
        expect(adj.get("1,2")!.length).toBe(2);
    });

    it("deduplicates edges defined in opposite directions", () => {
        const gs = new GameState(new Level(), "edit", true);
        const adj = gs.buildAdjacency(
            toEdges([
                [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
            ]),
            toEdges([
                [
                    { x: 1, y: 1 },
                    { x: 0, y: 0 },
                ],
            ]),
        );
        expect(adj.get("0,0")!.length).toBe(1);
        expect(adj.get("0,0")![0].x).toBe(1);
        expect(adj.get("0,0")![0].y).toBe(1);
        expect(adj.get("1,1")!.length).toBe(1);
        expect(adj.get("1,1")![0].x).toBe(0);
        expect(adj.get("1,1")![0].y).toBe(0);
    });
});
