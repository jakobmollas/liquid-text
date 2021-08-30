import * as Sampler from "./sampler";
import { HomesickParticle } from "./particle";
import * as PIXI from 'pixi.js';
import { Input } from "./input";

export class Simulation {
    particles: HomesickParticle[];
    container: PIXI.ParticleContainer;

    constructor(text: string, width: number, height: number) {
        this.particles = this.createParticles(text, width, height);
        this.container = this.createParticleContainer(this.particles,);
    }

    private createParticles(text: string, width: number, height: number): HomesickParticle[] {
        const points = Sampler.GeneratePoints(text, 3, width, height);
        const texture = PIXI.Texture.from("./assets/particle.png");

        const particles = new Array<HomesickParticle>();
        points.forEach(point => {
            const particle = new HomesickParticle(point, texture);
            particles.push(particle);
        });

        return particles;
    }

    private createParticleContainer(particles: any[]): PIXI.ParticleContainer {
        const container = new PIXI.ParticleContainer(
            particles.length,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: true
            }
        );

        particles.forEach(particle => {
            container.addChild(particle.sprite);
        });

        return container;
    }

    animate(input: Input, deltaTimeFactor: number): void {
        this.particles.forEach(particle => particle.update(input, deltaTimeFactor));
    }
}