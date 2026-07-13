import { Core } from "supersprite";
import { UnifiedInput } from "supercontroller";
import { AudioEngine, SoundEffect } from "supersound";
import { VIEW_HEIGHT, VIEW_WIDTH } from "./constants";
import { GameState } from "./game/state";
import { Layout } from "./ui/layout";
import { Level } from "./game/level";

const soundFiles = [
    "hover",
    "click",
    "place",
    "break",
    "no",
    "start",
    "stop",
    "pickup",
    "deliver",
    "handoff",
    "next_level",
] as const;
type SoundName = (typeof soundFiles)[number];

const soundConfig: Record<SoundName, number> = {
    hover: 4,
    click: 2,
    place: 1,
    break: 1,
    no: 1,
    start: 1,
    stop: 1,
    pickup: 1,
    deliver: 1,
    handoff: 1,
    next_level: 1,
};

export interface Engine {
    core: Core;
    input: UnifiedInput;
    snd: Record<SoundName, SoundEffect>;
    state: GameState;
    layout: Layout;
}

export function init(): Engine {
    const core = new Core({
        atlas: {
            url: "dist/atlas.png",
        },
        presenter: {
            baseWidth: VIEW_WIDTH,
            baseHeight: VIEW_HEIGHT,
        },
        drawDefaults: {
            fontName: '"Jersey 10"', // I spent too long figuring out this needed to be quoted
            fontSize: 16,
            drawShadow: true,
            shadowColor: "#303030",
        },
    });
    const input = new UnifiedInput({
        referenceFrame: core.presenter.ctx?.canvas,
    });

    // Manual fix for issue to fix later: https://github.com/spencerjbeckwith/super/issues/6
    function syncReferenceFrameScale() {
        input.mouse.referenceFrameScale.x = core.presenter.scaleX;
        input.mouse.referenceFrameScale.y = core.presenter.scaleY;
    }
    syncReferenceFrameScale();
    window.addEventListener("resize", syncReferenceFrameScale);
    window.addEventListener("orientationchange", syncReferenceFrameScale);

    const ae = new AudioEngine();
    const snd = Object.fromEntries(
        soundFiles.map((name) => {
            const sfx = new SoundEffect(ae.context, `assets/sounds/${name}.wav`, soundConfig[name]);
            ae.register(sfx);
            return [name, sfx];
        }),
    ) as Record<SoundName, SoundEffect>;

    const state = new GameState(new Level(), "title", true);

    const engine: Engine = {
        core,
        input,
        snd,
        state,
        layout: null!,
    };
    engine.layout = new Layout(engine); // Fun workaround for dependency ordering... Oops.
    return engine;
}
