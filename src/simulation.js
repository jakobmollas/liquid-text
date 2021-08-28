import * as Text from "./text.js";
import { HomesickParticle } from "./particle.js";
import * as PIXI from 'pixi.js';

export class Simulation {
    constructor() {
        this.texture = PIXI.Texture.from("./assets/particle.png");
        this.particles = [];
        this.container;

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };

        document.addEventListener("pointermove", this.pointerMove.bind(this), false);
        document.addEventListener("touchstart", this.touchStart.bind(this), false);
        document.addEventListener("touchend", this.touchEnd.bind(this), false);
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

    initialize(text, stageWidth, stageHeight) {
        const points = Text.GeneratePoints(text, 6, stageWidth, stageHeight);

        this.container = this.createParticleContainer(points.length);

        this.particles = [];
        points.forEach(point => {
            const particle = new HomesickParticle(point, this.texture);
            this.container.addChild(particle.sprite);
            this.particles.push(particle);
        });
    }

    createParticleContainer(size) {
        return new PIXI.ParticleContainer(
            size,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: true
            }
        );
    }

    animate(deltaTimeFactor) {
        this.particles.forEach(particle => particle.update(this.mouse, deltaTimeFactor));
    }
}