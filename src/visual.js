import { Text } from "./text.js";
import { Particle } from "./particle.js";
import * as PIXI from 'pixi.js';

export class Visual {
    constructor() {
        this.text = new Text();
        this.texture = PIXI.Texture.from("./assets/particle.png");
        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };

        document.addEventListener("pointermove", this.onMove.bind(this), false);
    }

    show(text, stageWidth, stageHeight, stage) {
        if (this.container) {
            stage.removeChild(this.container);
        }

        // todo: to local variable?
        this.pos = this.text.setText(text, 3, stageWidth, stageHeight);

        this.container = new PIXI.ParticleContainer(
            this.pos.length,
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

        // Todo: use foreach?
        this.particles = [];
        for (let i = 0; i < this.pos.length; i++) {
            const item = new Particle(this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    animate(deltaTimeFactor) {
        for (let i = 0; i < this.particles.length; i++) {
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;

            // Apply force to particle based on mouse in relation to particle
            if (dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sin(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax;
                item.vy -= ay;
            }

            item.draw(deltaTimeFactor);
        }
    }

    onMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
}