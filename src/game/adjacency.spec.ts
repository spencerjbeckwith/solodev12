import { describe, it } from "mocha";
import expect from "expect";
import { Adjacency } from "./adjacency";
import { toEdges } from "../utils";

describe("Adjacency", () => {
    it("builds adjacency between nodes", () => {
        const adj = new Adjacency(
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
        );
        expect(adj.map.get("0,0")!.size).toBe(1);
        expect(adj.map.get("1,1")!.size).toBe(4);
        expect(adj.map.get("2,1")!.size).toBe(2);
        expect(adj.map.get("0,2")!.size).toBe(1);
        expect(adj.map.get("1,2")!.size).toBe(2);
        // Inner maps are keyed by relative vector: (0,0)'s only neighbor is (1,1)
        expect(adj.map.get("0,0")!.get("1,1")).toEqual({ x: 1, y: 1 });
    });

    it("combines level-defined and player-placed edges", () => {
        const levelEdges = toEdges([
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
        ]);
        const placedEdges = toEdges([
            [
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
        ]);
        const adj = new Adjacency(new Map([...levelEdges, ...placedEdges]));
        expect(adj.map.get("0,0")!.size).toBe(1);
        expect(adj.map.get("1,1")!.size).toBe(4);
        expect(adj.map.get("2,1")!.size).toBe(2);
        expect(adj.map.get("0,2")!.size).toBe(1);
        expect(adj.map.get("1,2")!.size).toBe(2);
    });

    it("deduplicates edges defined in opposite directions", () => {
        const forward = toEdges([
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
        ]);
        const backward = toEdges([
            [
                { x: 1, y: 1 },
                { x: 0, y: 0 },
            ],
        ]);
        const adj = new Adjacency(new Map([...forward, ...backward]));
        // Values are relative vectors from the keyed node to its neighbor
        expect(adj.map.get("0,0")!.size).toBe(1);
        expect(adj.map.get("0,0")!.get("1,1")).toEqual({ x: 1, y: 1 }); // (0,0) -> (1,1)
        expect(adj.map.get("1,1")!.size).toBe(1);
        expect(adj.map.get("1,1")!.get("-1,-1")).toEqual({ x: -1, y: -1 }); // (1,1) -> (0,0)
    });
});