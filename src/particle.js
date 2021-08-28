import * as PIXI from "pixi.js";

const FRICTION = 0.80;
const MOVE_SPEED = 1.0;

export class Particle {
    sprite;

    constructor(pos, texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(0.2);
        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
    }

    draw(deltaTimeFactor) {
        this.vx += (this.savedX - this.x) * MOVE_SPEED * deltaTimeFactor;
        this.vy += (this.savedY - this.y) * MOVE_SPEED * deltaTimeFactor;

        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
}