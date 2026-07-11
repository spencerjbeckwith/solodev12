import { Core } from "supersprite";
import { UnifiedInput } from "supercontroller";
import { AudioEngine, SoundEffect } from "supersound";
import { VIEW_HEIGHT, VIEW_WIDTH } from "./constants";

export const core = new Core({
    atlas: {
        url: "dist/atlas.png",
    },
    presenter: {
        baseWidth: VIEW_WIDTH,
        baseHeight: VIEW_HEIGHT,
    },
});

export const input = new UnifiedInput({
    referenceFrame: core.presenter.ctx?.canvas,
});

function syncReferenceFrameScale() {
    input.mouse.referenceFrameScale.x = core.presenter.scaleX;
    input.mouse.referenceFrameScale.y = core.presenter.scaleY;
}
syncReferenceFrameScale();
window.addEventListener("resize", syncReferenceFrameScale);
window.addEventListener("orientationchange", syncReferenceFrameScale);

const ae = new AudioEngine();
const hover = new SoundEffect(ae.context, "assets/sounds/hover.wav", 4);
const click = new SoundEffect(ae.context, "assets/sounds/click.wav", 2);
ae.register(hover);
ae.register(click);
export const snd = {
    hover,
    click,
};
