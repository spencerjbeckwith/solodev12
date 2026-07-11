import { Colors, DrawTextOptions } from "supersprite";
import { VIEW_HEIGHT, VIEW_WIDTH } from "./constants";
import { core, input } from "./core";
import { Button } from "./ui/Button";
import spr from "./sprites.json";
import { GameState } from "./state";

// Is there a better place to keep GameState?

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

const run = new Button(
    spr.run,
    0,
    0,
    () => {
        if (gs.state === "solve") {
            run.sprite = spr.stop;
            gs.toState("run");
        } else if (gs.state === "run") {
            run.sprite = spr.run;
            gs.toState("solve");
        }
    },
    2,
);

const edit = new Button(spr.edit, 0, 32, () => {}, 7);

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

    run.frame();
    edit.frame();
    run.render();
    edit.render();

    if (gs.state === "solve") {
        core.draw.text(`Routes: ${gs.solveState!.remaining}`, VIEW_WIDTH - 4, 4, remainingStyle);
    }

    core.endRender();
    input.update();
    requestAnimationFrame(main);
}

main();
