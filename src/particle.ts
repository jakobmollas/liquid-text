import * as PIXI from "pixi.js";
import { Input } from "./input";
import { Point } from "./point";

// Particle striving to return to its original position
export class HomesickParticle {
    private home: Point;
    private velocity: Point;
    private radius: number;
    private _sprite: PIXI.Sprite;

    constructor(position: Point, texture: PIXI.Texture) {
        this.home = new Point(position.x, position.y);

        this.velocity = new Point(0, 0);
        this.radius = 10;

        this._sprite = new PIXI.Sprite(texture);
        this._sprite.scale.set(0.2);
        this._sprite.x = position.x;
        this._sprite.y = position.y;
    }

    get x(): number { return this._sprite.x; }
    get y(): number { return this._sprite.y; }
    get sprite(): PIXI.Sprite { return this._sprite; }

    update(input: Input, deltaTimeFactor: number): void {
        updateVelocityFromInput(input, this._sprite, this.radius, this.velocity);
        updateVelocityFromHomePosition(this.home, this._sprite, this.velocity, deltaTimeFactor);

        this._sprite.x += this.velocity.x;
        this._sprite.y += this.velocity.y;
    }
}

function updateVelocityFromInput(input: Input, currentPos: Point, radius: number, velocity: Point): void {
    if (!input.isActive)
        return;

    const dx = input.x - currentPos.x;
    const dy = input.y - currentPos.y;
    const mouseToSpriteDistance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = radius + settings.pointerRadius;

    // Apply force to particle based on mouse in relation 
    // to particle as long as mouse is close enough.
    // Closer = more force
    if (mouseToSpriteDistance > maxDistance)
        return;

    // Calculate angle from mouse -> sprite
    // Force is per axis; 
    //     0 (distance = maxDistance) -> 
    //     max force (sprite and mouse at the same position)
    const mouseToSpriteAngle = Math.atan2(-dy, -dx);
    const xForce = Math.cos(mouseToSpriteAngle) * maxDistance + dx;
    const yForce = Math.sin(mouseToSpriteAngle) * maxDistance + dy;

    velocity.x += xForce;
    velocity.y += yForce;
}

function updateVelocityFromHomePosition(homePos: Point, currentPos: Point, velocity: Point, deltaTimeFactor: number) {
    // the longer it is from home -> more pull
    velocity.x += (homePos.x - currentPos.x) * settings.liveliness * deltaTimeFactor;
    velocity.y += (homePos.y - currentPos.y) * settings.liveliness * deltaTimeFactor;

    // Gradually slow down to avoid infinite reverberation effects
    velocity.x *= settings.viscosity;
    velocity.y *= settings.viscosity;
}