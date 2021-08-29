import * as Sampler from "./sampler";
import { HomesickParticle } from "./particle";
import * as PIXI from 'pixi.js';
import { PointerInput } from "./input";

export class Simulation {
    texture: PIXI.Texture<PIXI.Resource>;
    particles: HomesickParticle[];
    container: any;

    constructor(text: string, width: number, height: number) {
        this.texture = PIXI.Texture.from("./assets/particle.png");
        this.particles = [];
        this.container;

        this.initialize(text, width, height);
    }

    initialize(text: string, width: number, height: number) {
        const points = Sampler.GeneratePoints(text, 3, width, height);

        this.container = this.createParticleContainer(points.length);

        this.particles = [];
        points.forEach(point => {
            const particle = new HomesickParticle(point, this.texture);
            this.container.addChild(particle.sprite);
            this.particles.push(particle);
        });
    }

    private createParticleContainer(size: number): PIXI.ParticleContainer {
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

    animate(input: PointerInput, deltaTimeFactor: number): void {
        this.particles.forEach(particle => particle.update(input, deltaTimeFactor));
    }
}