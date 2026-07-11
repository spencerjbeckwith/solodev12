import { describe, it } from "mocha";
import expect from "expect";
import { Level } from "./level";
import { getCoordKey } from "../types";

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
});
