// Todo: try to implement in ts
import { Simulation } from "./simulation";
import { Input } from "./input";
import { GameTime } from "./gametime";
import * as Shaders from "./shaders";
import * as PIXI from 'pixi.js';

window.onload = () => {
    new App();
}

class App {
    message: string = "YUM";
    input: Input = new Input();
    gameTime: GameTime = new GameTime();
    stage: PIXI.Container = new PIXI.Container();
    renderer: PIXI.Renderer;
    simulation: Simulation;

    constructor() {
        this.renderer = this.createPixiRenderer();
        this.addCanvasToDocument(this.renderer.view);

        this.simulation = new Simulation(this.message, document.body.clientWidth, document.body.clientHeight)
        this.stage.addChild(this.simulation.container);

        this.initializeShaders(this.stage, this.renderer);

        window.addEventListener("resize", this.resize.bind(this), false);

        // Start event loop
        requestAnimationFrame(this.animate.bind(this));
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

        this.simulation = new Simulation(this.message, width, height);
        this.stage.addChild(this.simulation.container);
    }

    animate() {
        this.gameTime.update();
        this.simulation?.animate(this.input.data, this.gameTime.deltaTimeFactor);
        this.renderer.render(this.stage);

        requestAnimationFrame(this.animate.bind(this));
    }
}