import * as Text from "./text.js";
import { HomesickParticle } from "./particle.js";
import * as PIXI from 'pixi.js';

export class Simulation {
    constructor(text, width, height) {
        this.texture = PIXI.Texture.from("./assets/particle.png");
        this.particles = [];
        this.container;

        this.initialize(text, width, height);
    }

    initialize(text, width, height) {
        const points = Text.GeneratePoints(text, 6, width, height);

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

    animate(mouse, deltaTimeFactor) {
        this.particles.forEach(particle => particle.update(mouse, deltaTimeFactor));
    }
}