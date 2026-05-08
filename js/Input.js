export class InputHandler {
    constructor() {
        this.keys = {
            right: false,
            left: false,
            up: false
        };

        window.addEventListener('keydown', (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight') this.keys.right = true;
            if (e.key === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
            if (e.key === 'w' || e.key === ' ' || e.key === 'ArrowUp') this.keys.up = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight') this.keys.right = false;
            if (e.key === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
            if (e.key === 'w' || e.key === ' ' || e.key === 'ArrowUp') this.keys.up = false;
        });
    }
}
