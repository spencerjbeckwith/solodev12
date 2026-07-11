import { Colors, DrawTextOptions } from "supersprite";
import { VIEW_HEIGHT, VIEW_WIDTH } from "./constants";
import { core, input } from "./core";
import { GameState } from "./game/state";
import { Layout } from "./ui/layout";

const gs = new GameState(
    {
        budget: 10,
        edges: new Map(),
        nodes: [],
        carriers: [],
        // @ts-ignore
        parcel: null,
    },
    "solve",
    true,
);
const layout = new Layout(gs, core.presenter.ctx!.canvas);

const remainingStyle: DrawTextOptions = {
    hAlign: "right",
    vAlign: "top",
};

function main() {
    core.beginRender(Colors.gray);

    // Grid (for dev - remove later)
    for (let x = 48; x <= VIEW_WIDTH - 48; x += 32) {
        core.draw.line(x, 0, x, VIEW_HEIGHT);
    }
    for (let y = 16; y <= VIEW_HEIGHT - 16; y += 32) {
        core.draw.line(32, y, VIEW_WIDTH - 32, y);
    }

    // Frame logic
    layout.frame();

    // Render
    layout.render();

    if (gs.state === "solve") {
        // TODO: text uielement
        core.draw.text(`Routes: ${gs.solveState!.remaining}`, VIEW_WIDTH - 4, 4, remainingStyle);
    }

    core.endRender();
    input.update();
    requestAnimationFrame(main);
}

main();
