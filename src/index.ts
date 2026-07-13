import { Colors } from "supersprite";
import { init } from "./engine";

const engine = init();

function main() {
    engine.core.beginRender(Colors.gray);

    // Frame logic
    engine.layout.frame();
    engine.state.frame(engine);

    // Render
    engine.state.level.render(
        engine.core.draw,
        engine.state.state,
        engine.state.highlightNode,
        engine.state.solveState?.placed,
    );
    engine.layout.render();
    engine.state.render(engine);

    engine.core.endRender();
    engine.input.update();
    requestAnimationFrame(main);
}

main();
