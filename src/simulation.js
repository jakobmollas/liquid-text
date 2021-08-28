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

    show(text, stageWidth, stageHeight, stage) {
        if (this.container) {
            stage.removeChild(this.container);
        }

        // todo: to local variable?
        // Todo: pass in from caller
        const canvas = document.createElement("canvas");
        this.pos = Text.TextToPoints(canvas, text, 6, stageWidth, stageHeight);

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
            const item = new HomesickParticle(this.pos[i], this.texture);
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
                item.velocityX -= ax;
                item.velocityY -= ay;
            }

            item.draw(deltaTimeFactor);
        }
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