// Todo: try to implement in ts
import { Simulation } from "./simulation.js";
import { GameTime } from "./gametime.js";
import * as PIXI from 'pixi.js';

window.onload = () => {
    new App();
}

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.stage = new PIXI.Container();
        this.renderer = this.createPixiRenderer();
        document.body.appendChild(this.renderer.view);

        this.initializeShaders(this.stage, this.renderer);

        this.simulation = new Simulation();
        this.gameTime = new GameTime();

        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();

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

    initializeShaders(stage, renderer) {
        // Blur images to smear out particles, 
        // then sharpen image using the threshold filter.
        // This will make particles appear as a liquid surface instead of individual particles/circles
        // Note: Filter order matters here.
        const blurFilter = this.createBlurFilter();
        const thresholdFilter = this.createThresholdFilter();
        stage.filters = [blurFilter, thresholdFilter];
        stage.filterArea = renderer.screen;
    }

    createBlurFilter() {
        const filter = new PIXI.filters.BlurFilter();
        filter.blur = 10;
        filter.autoFit = true;

        return filter;
    }

    createThresholdFilter() {
        // pixel shader used to sharpen image (after getting blurred).
        const fragSource = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float threshold;
            uniform float mr;
            uniform float mg;
            uniform float mb;
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                vec3 mcolor = vec3(mr, mg, mb);
                if (color.a > threshold) {
                    gl_FragColor = vec4(mcolor, 1.0);
                    //gl_FragColor = color;
                } else {
                    // transparent
                    gl_FragColor = vec4(vec3(0.0), 0);
                }
            }
        `;

        // Create custom data top be passed to the shader
        const uniformsData = {
            threshold: 0.5,
            mr: 255.0 / 255.0,
            mg: 0.0 / 255.0,
            mb: 0.0 / 255.0
        }

        const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
        return thresholdFilter;
    }

    resize() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.renderer.resize(width, height);
        this.initializeSimulation(width, height);
    }

    initializeSimulation(width, height) {
        this.stage.removeChild(this.simulation.container);
        this.simulation.initialize("J♥H", width, height);
        this.stage.addChild(this.simulation.container);
    }

    animate() {
        this.gameTime.update();
        this.simulation.animate(this.gameTime.deltaTimeFactor);
        this.renderer.render(this.stage);

        requestAnimationFrame(this.animate.bind(this));
    }
}