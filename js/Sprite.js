export class Sprite {
    constructor({ position, color = 'red', width = 50, height = 50 }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
