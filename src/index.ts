import { Colors } from "supersprite";
import { VIEW_HEIGHT, VIEW_WIDTH } from "./constants";
import { init } from "./engine";

const engine = init();

function main() {
    engine.core.beginRender(Colors.gray);

    // Grid (for dev - remove later)
    for (let x = 48; x <= VIEW_WIDTH - 48; x += 32) {
        engine.core.draw.line(x, 0, x, VIEW_HEIGHT);
    }
    for (let y = 16; y <= VIEW_HEIGHT - 16; y += 32) {
        engine.core.draw.line(32, y, VIEW_WIDTH - 32, y);
    }

    // Frame logic
    engine.layout.frame();

    // Render
    engine.layout.render();

    engine.core.endRender();
    engine.input.update();
    requestAnimationFrame(main);
}

main();
