import { Simulation } from "./simulation";
import { Input } from "./input";
import { GameTime } from "./gametime";
import { Settings } from "./settings";
import * as Shaders from "./shaders";
import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

// Todo: implement reset of simulation when text/density changes

window.onload = () => {
    globalThis.settings = new Settings();
    new App();
}

class App {
    input: Input = new Input();
    gameTime: GameTime = new GameTime();
    stage: PIXI.Container = new PIXI.Container();
    gui: dat.GUI = new dat.GUI();
    renderer: PIXI.Renderer;
    simulation: Simulation;
    stats: HTMLElement;

    constructor() {
        globalThis.settings = new Settings();
        this.stats = document.getElementById("stats") as HTMLElement;

        this.renderer = this.createPixiRenderer();
        this.addCanvasToDocument(this.renderer.view);

        this.simulation = new Simulation(settings.text, document.body.clientWidth, document.body.clientHeight)
        this.stage.addChild(this.simulation.container);

        this.initializeShaders(this.stage, this.renderer);
        this.initializeGuiControls(this.gui, settings);

        window.addEventListener("resize", this.resize.bind(this), false);

        requestAnimationFrame(this.animate.bind(this));
    }

    initializeGuiControls(gui: dat.GUI, settings: Settings) {
        gui.add(settings, 'showDiagnostics');
        gui.add(settings, 'viscosity', 0, 1.0);
        gui.add(settings, 'liveliness', 0, 5.0);
        gui.add(settings, 'pointerRadius', 1, 300);
        gui.add(settings, 'density', 1, 10).onFinishChange(() => this.settingsChanged());;
        gui.add(settings, 'text').onFinishChange(() => this.settingsChanged());
        gui.close();
    }

    settingsChanged() {
        console.log("changed");
    }

    createPixiRenderer() {
        return new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x000
        });
    }

    addCanvasToDocument(canvas: HTMLCanvasElement) {
        document.body.appendChild(canvas);
    }

    initializeShaders(stage: PIXI.Container, renderer: PIXI.Renderer) {
        // Blur images to smear out particles, 
        // then sharpen image using the threshold filter.
        // This will make particles appear as a liquid surface instead of individual particles/circles
        // Note: Filter order matters here.
        const blur = Shaders.createBlurFilter();
        const thresholdColorizer = Shaders.createThresholdColorizerFilter();
        const bloom = Shaders.createBloomFilter();
        stage.filters = [blur, thresholdColorizer, bloom];
        stage.filterArea = renderer.screen;
    }

    resize() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.resizeRenderer(width, height);
        this.resetSimulation(width, height);
    }

    resizeRenderer(width: number, height: number) {
        this.renderer.resize(width, height);
    }

    resetSimulation(width: number, height: number) {
        if (this.simulation)
            this.stage.removeChild(this.simulation.container);

        this.simulation = new Simulation(globalThis.settings.text, width, height);
        this.stage.addChild(this.simulation.container);
    }

    animate() {
        this.gameTime.update();
        this.simulation.animate(this.input, this.gameTime.deltaTimeFactor);
        this.renderer.render(this.stage);

        if (globalThis.settings.showDiagnostics)
            this.drawStats();

        requestAnimationFrame(this.animate.bind(this));
    }

    drawStats() {
        this.stats.innerText = `FPS: ${this.gameTime.fps.toFixed(0)} (${this.simulation.particleCount} particles)`;
    }
}