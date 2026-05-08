import { Sprite } from './Sprite.js';

export class Player extends Sprite {
    constructor(canvasHeight) {
        // Calls the Sprite class to set up the basic shape and color
        super({ position: { x: 100, y: 100 }, color: '#3498db', width: 40, height: 40 });
        this.velocity = { x: 0, y: 0 };
        this.gravity = 0.6;
        this.canvasHeight = canvasHeight;
    }

    update(ctx) {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Gravity check
        if (this.position.y + this.height + this.velocity.y < this.canvasHeight) {
            this.velocity.y += this.gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}
