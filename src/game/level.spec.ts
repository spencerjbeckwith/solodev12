import { describe, it } from "mocha";
import expect from "expect";
import { Level } from "./level";
import { getCoordKey, getEdgeKey } from "../types";

describe("Level", () => {
    it("knows its nodes", () => {
        const def = Level.definition();
        def.nodes = new Map();
        const coord = { x: 1, y: 1 };
        def.nodes.set(getCoordKey(coord), coord);
        const level = new Level(def);
        expect(level.hasNode(0, 0)).toBe(false);
        expect(level.hasNode(1, 1)).toBe(true);
    });

    it("can set nodes", () => {
        const level = new Level();
        expect(level.hasNode(2, 3)).toBe(false);
        level.toggleNode(2, 3);
        expect(level.hasNode(2, 3)).toBe(true);
        level.toggleNode(2, 3);
        expect(level.hasNode(2, 3)).toBe(false);
        level.toggleNode(2, 3);
        expect(level.hasNode(2, 3)).toBe(true);
    });

    it("detects diagonal edges", () => {
        const level = new Level();
        let isDiagonal = level.isDiagonal([
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 1,
            },
        ]);
        expect(isDiagonal).toBe(true);
        isDiagonal = level.isDiagonal([
            {
                x: 1,
                y: 0,
            },
            {
                x: 0,
                y: 1,
            },
        ]);
        expect(isDiagonal).toBe(true);
    });

    it("returns correct opposing diagonals", () => {
        const level = new Level();
        let edge = level.getOpposingDiagonal([
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 1,
            },
        ]);
        expect(getEdgeKey(edge)).toBe("0,1|1,0");
        edge = level.getOpposingDiagonal([
            {
                x: 2,
                y: 3,
            },
            {
                x: 3,
                y: 2,
            },
        ]);
        expect(getEdgeKey(edge)).toBe("2,2|3,3");
    });

    it("disallows edges that are too far", () => {
        const level = new Level();
        const valid = level.isValidEdge(
            [
                {
                    x: 0,
                    y: 0,
                },
                {
                    x: 2,
                    y: 0,
                },
            ],
            level.edges,
            false,
        );
        expect(valid).toBe(false);
    });

    it("disallows edges without nodes if requireNodes is true", () => {
        const level = new Level();
        const valid = level.isValidEdge(
            [
                {
                    x: 0,
                    y: 0,
                },
                {
                    x: 1,
                    y: 0,
                },
            ],
            level.edges,
            true,
        );
        expect(valid).toBe(false);
    });

    it("toggles edges", () => {
        const level = new Level();
        level.toggleEdge([
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 0,
            },
        ]);
        expect(level.edges.get("0,0|1,0")).toBeTruthy();
        level.toggleEdge([
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 0,
            },
        ]);
        expect(level.edges.get("0,0|1,0")).toBeFalsy();
    });

    it("creates nodes when toggling edges", () => {
        const level = new Level();
        level.toggleEdge([
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 0,
            },
        ]);
        expect(level.nodes.get("0,0")).toBeTruthy();
        expect(level.nodes.get("1,0")).toBeTruthy();
    });
});
