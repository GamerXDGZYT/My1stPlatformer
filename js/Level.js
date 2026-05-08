import { Sprite } from './Sprite.js';

export class Platform extends Sprite {
    constructor({ x, y, width = 200, color = '#27ae60' }) {
        super({ position: { x, y }, color, width, height: 20 });
    }
}

// Your level design
export const level1Platforms = [
    new Platform({ x: -1, y: 500, width: 600 }), // Ground
    new Platform({ x: 700, y: 400 }),
    new Platform({ x: 1100, y: 300 }),
    new Platform({ x: 1500, y: 450 }),
    new Platform({ x: 2000, y: 300, width: 400, color: 'gold' }) // The Goal
];
