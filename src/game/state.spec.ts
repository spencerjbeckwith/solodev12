import { describe, it } from "mocha";
import expect from "expect";
import { GameState } from "./state";
import { Level } from "./level";

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
});
