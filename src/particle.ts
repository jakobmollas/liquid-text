import * as PIXI from "pixi.js";
import { Point } from "pixi.js";
import { PointerInput } from "./input";

const FRICTION = 0.9; // 0 - inert, 1 no damping at all
const LIVELINESS = 0.5;

// Particle striving to return to its original position
export class HomesickParticle {
    private home: Point;
    private velocity: Point;
    private radius: number;
    private _sprite: PIXI.Sprite;

    constructor(position: Point, texture: PIXI.Texture) {
        this.home = position.clone();

        this.velocity = new Point();
        this.radius = 10;

        this._sprite = new PIXI.Sprite(texture);
        this._sprite.scale.set(0.2);
        this._sprite.x = position.x;
        this._sprite.y = position.y;
    }

    get x(): number { return this._sprite.x; }
    get y(): number { return this._sprite.y; }
    get sprite(): PIXI.Sprite { return this._sprite; }

    update(input: PointerInput, deltaTimeFactor: number): void {
        const dx = input.x - this.x;
        const dy = input.y - this.y;
        const mouseToSpriteDistance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = this.radius + input.radius;

        // Apply force to particle based on mouse in relation 
        // to particle as long as mouse is close enough.
        // Closer = more force
        if (mouseToSpriteDistance < maxDistance) {
            // Calculate angle from mouse -> sprite
            // Force is per axis; 
            //     0 (distance = maxDistance) -> 
            //     max force (sprite and mouse at the same position)
            const mouseToSpriteAngle = Math.atan2(-dy, -dx);
            const xForce = Math.cos(mouseToSpriteAngle) * maxDistance + dx;
            const yForce = Math.sin(mouseToSpriteAngle) * maxDistance + dy;
            this.velocity.x += xForce;
            this.velocity.y += yForce;
        }

        // the longer it is from home -> more pull
        this.velocity.x += (this.home.x - this._sprite.x) * LIVELINESS * deltaTimeFactor;
        this.velocity.y += (this.home.y - this._sprite.y) * LIVELINESS * deltaTimeFactor;

        // Gradually slow down to avoid infinite reverberation effects
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;

        this._sprite.x += this.velocity.x;
        this._sprite.y += this.velocity.y;
    }
}