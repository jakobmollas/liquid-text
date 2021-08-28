// Todo: try to implement in ts
import { Simulation } from "./simulation.js";
import { GameTime } from "./gametime.js";
import * as PIXI from 'pixi.js';

window.onload = () => {
    new App();
}

class App {
    constructor() {
        this.setWebgl();
        this.LoadFonts();
    }

    LoadFonts() {
        WebFont.load({
            google: {
                families: ['Hind:700']
            },
            fontactive: () => {
                this.simulation = new Simulation();
                this.gameTime = new GameTime();

                window.addEventListener("resize", this.resize.bind(this), false);
                this.resize();
                requestAnimationFrame(this.animate.bind(this));
            }
        });
    }

    setWebgl() {
        this.renderer = new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            resolution: (window.devicePixelRatio > 1) ? 2 : 1,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x000
        });

        document.body.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 10;
        blur.autoFit = true;

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

        const uniformsData = {
            threshold: 0.5,
            mr: 255.0 / 255.0,
            mg: 0.0 / 255.0,
            mb: 0.0 / 255.0
        }

        // Blur images to smear out particles, 
        // then sharpen image using the threshold filter.
        // This will make particles appear as a liquid surface instead of individual particles/circles
        // Note: Filter order matters here.
        const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
        this.stage.filters = [blurFilter, thresholdFilter];
        this.stage.filterArea = this.renderer.screen;
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.renderer.resize(this.stageWidth, this.stageHeight);
        this.simulation.initialize("J♥H", this.stageWidth, this.stageHeight, this.stage);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.gameTime.update();

        this.simulation.animate(this.gameTime.deltaTimeFactor);
        this.renderer.render(this.stage);
    }
}