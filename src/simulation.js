import * as Text from "./text.js";
import { HomesickParticle } from "./particle.js";
import * as PIXI from 'pixi.js';

export class Simulation {
    constructor() {
        this.texture = PIXI.Texture.from("./assets/particle.png");
        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };

        document.addEventListener("pointermove", this.pointerMove.bind(this), false);
        document.addEventListener("touchstart", this.touchStart.bind(this), false);
        document.addEventListener("touchend", this.touchEnd.bind(this), false);
    }

    initialize(text, stageWidth, stageHeight, stage) {
        if (this.container)
            stage.removeChild(this.container);

        const points = Text.TextToPoints(text, 6, stageWidth, stageHeight);

        this.container = new PIXI.ParticleContainer(
            points.length,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: true
            }
        );

        stage.addChild(this.container);

        this.particles = [];
        // points.forEach(point => {
        //     const particle = new HomesickParticle(point, this.texture);
        //     this.container.addChild(particle.sprite);
        //     this.particles.push(particle);
        // });

        const particle = new HomesickParticle(points[1], this.texture);
        this.container.addChild(particle.sprite);
        this.particles.push(particle);
    }

    animate(deltaTimeFactor) {
        this.particles[0].update(this.mouse, deltaTimeFactor);
        //this.particles.forEach(particle => particle.update(this.mouse, deltaTimeFactor));
    }

    pointerMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    touchStart(e) {
        if (e.touches?.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }

    touchEnd() {
        this.mouse.x = -1;
        this.mouse.y = -1;
    }
}