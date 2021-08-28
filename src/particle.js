import * as PIXI from "pixi.js";

const FRICTION = 0.75; // 0 - inert, 1 no damping at all
const LIVELINESS = 1.0;

// Particle striving to return to its original position
export class HomesickParticle {
    constructor(position, texture) {
        this.originalX = position.x;
        this.originalY = position.y;

        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 10;

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(0.2);
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    update(mouse, deltaTimeFactor) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const mouseToSpriteDistance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = this.radius + mouse.radius;

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
            console.log(mouseToSpriteAngle, xForce);
            this.velocityX += xForce;
            this.velocityY += yForce;
        }

        // the longer it is from home -> more pull
        this.velocityX += (this.originalX - this.sprite.x) * LIVELINESS * deltaTimeFactor;
        this.velocityY += (this.originalY - this.sprite.y) * LIVELINESS * deltaTimeFactor;

        // Gradually slow down to avoid infinite reverberation effects
        this.velocityX *= FRICTION;
        this.velocityY *= FRICTION;

        this.sprite.x += this.velocityX;
        this.sprite.y += this.velocityY;
    }
}