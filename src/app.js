// Todo: try to implement in ts
import { Simulation } from "./simulation.js";
import { Input } from "./input.js";
import { GameTime } from "./gametime.js";
import * as Shaders from "./shaders.js";
import * as PIXI from 'pixi.js';

window.onload = () => {
    new App();
}

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.input = new Input();
        this.gameTime = new GameTime();

        this.stage = new PIXI.Container();
        this.renderer = this.createPixiRenderer();
        this.initializeShaders(this.stage, this.renderer);
        this.addCanvasToDocument(this.renderer.view);

        this.createSimulation(this.renderer.width, this.renderer.height);

        window.addEventListener("resize", this.resize.bind(this), false);

        // Start event loop
        requestAnimationFrame(this.animate.bind(this));
    }

    createPixiRenderer() {
        return new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            resolution: (window.devicePixelRatio > 1) ? 2 : 1,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x000
        });
    }

    addCanvasToDocument(canvas) {
        document.body.appendChild(canvas);
    }

    initializeShaders(stage, renderer) {
        // Blur images to smear out particles, 
        // then sharpen image using the threshold filter.
        // This will make particles appear as a liquid surface instead of individual particles/circles
        // Note: Filter order matters here.
        const blurFilter = Shaders.createBlurFilter();
        const thresholdFilter = Shaders.createThresholdFilter();
        stage.filters = [blurFilter, thresholdFilter];
        stage.filterArea = renderer.screen;
    }

    resize() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.resizeRenderer(width, height);
        this.createSimulation(width, height);
    }

    resizeRenderer(width, height) {
        this.renderer.resize(width, height);
    }

    createSimulation(width, height) {
        if (this.simulation)
            this.stage.removeChild(this.simulation.container);

        this.simulation = new Simulation("J♥H", width, height);
        this.stage.addChild(this.simulation.container);
    }

    animate() {
        this.gameTime.update();
        this.simulation.animate(this.input.mouse, this.gameTime.deltaTimeFactor);
        this.renderer.render(this.stage);

        requestAnimationFrame(this.animate.bind(this));
    }
}