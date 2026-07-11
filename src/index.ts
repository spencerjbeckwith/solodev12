import { Color, Core } from 'supersprite';
import { AudioEngine } from 'supersound';
import { UnifiedInput } from 'supercontroller';

const core = new Core({
    atlas: null,
    presenter: {
        baseWidth: 300,
        baseHeight: 200,
    },
});

const ae = new AudioEngine();
// TODO Sounds and ae.register calls go here

const input = new UnifiedInput();

const bg = new Color(0.2, 0.2, 0.2);

function main() {
    core.beginRender(bg);

    // TODO all game logic goes here
    core.draw.text('it works', 150, 100, {
        hAlign: 'center',
    });

    core.endRender();
    input.update();
    requestAnimationFrame(main);
}

main();
