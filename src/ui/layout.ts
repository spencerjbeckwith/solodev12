import { VIEW_HEIGHT, VIEW_WIDTH } from "../constants";
import { Engine } from "../engine";
import { GameStates } from "../game/state";
import { CarrierButton } from "./buttons/toggles/CarrierButton";
import { DestinationButton } from "./buttons/toggles/DestinationButton";
import { DoneButton } from "./buttons/DoneButton";
import { EditButton } from "./buttons/EditButton";
import { ParcelButton } from "./buttons/toggles/ParcelButton";
import { RunButton } from "./buttons/RunButton";
import { StopButton } from "./buttons/StopButton";
import { EdgeGrid } from "./edgegrid";
import { UIElement } from "./element";
import { NodeGrid } from "./nodegrid";
import { TextElement } from "./text/text";
import { WinText } from "./text/WinText";
import { NextButton } from "./buttons/NextButton";
import { SaveButton } from "./buttons/SaveButton";
import { LoadButton } from "./buttons/LoadButton";
import { TrashButton } from "./buttons/TrashButton";
import { BudgetUpButton } from "./buttons/BudgetUpButton";
import { BudgetDownButton } from "./buttons/BudgetDownButton";
import { NoteButton } from "./buttons/NoteButton";
import { NoteText } from "./text/NoteText";

export class Layout {
    engine: Engine;
    ui: Record<GameStates, UIElement[]>;
    canvas?: HTMLCanvasElement;

    constructor(engine: Engine) {
        this.engine = engine;
        const canvas = engine.core.presenter.ctx?.canvas;
        this.canvas = canvas;

        // Declarative map of each element present in any given game state
        this.ui = {
            edit: [
                new DoneButton(engine, canvas),
                new CarrierButton(engine, canvas),
                new ParcelButton(engine, canvas),
                new DestinationButton(engine, canvas),
                new NodeGrid(engine, canvas),
                new EdgeGrid(engine, canvas),
                new SaveButton(engine, canvas),
                new LoadButton(engine, canvas),
                new TrashButton(engine, canvas),
                new TextElement(engine, VIEW_WIDTH - 16, 15, (state) => `${state.level.budget}`, {
                    hAlign: "right",
                    vAlign: "middle",
                }),
                new BudgetUpButton(engine, canvas),
                new BudgetDownButton(engine, canvas),
                new NoteButton(engine, canvas),
                new NoteText(engine),
            ],
            solve: [
                new RunButton(engine, canvas),
                new EditButton(engine, canvas),
                new TextElement(
                    engine,
                    VIEW_WIDTH - 4,
                    4,
                    (state) => `Paths: ${state.solveState!.remaining}`,
                    { hAlign: "right", vAlign: "top" },
                ),
                new EdgeGrid(engine, canvas),
                new NoteText(engine),
            ],
            run: [
                new StopButton(engine, canvas),
                new WinText(engine),
                new NextButton(engine, canvas),
                new NoteText(engine),
            ],
        };
    }

    frame() {
        if (this.canvas) {
            this.canvas.style.cursor = "default";
        }
        const current = this.ui[this.engine.state.state].filter((e) => e.visible);
        for (const element of current) {
            element.frame();
        }
    }

    render() {
        const current = this.ui[this.engine.state.state].filter((e) => e.visible);
        for (const element of current) {
            element.render();
        }
    }
}
