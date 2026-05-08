import { Player } from './Player.js';
import { InputHandler } from './Input.js';
import { level1Platforms } from './Level.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

canvas.width = 1024;
canvas.height = 576;

const player = new Player(canvas.height);
const input = new InputHandler();
let scrollOffset = 0; // Tracks the camera

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms and player
    level1Platforms.forEach(platform => platform.draw(ctx));
    player.update(ctx);

    // Horizontal Movement & Camera Scrolling
    if (input.keys.right && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (input.keys.left && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        // Move the world instead of the player
        if (input.keys.right) {
            scrollOffset += 5;
            level1Platforms.forEach(platform => platform.position.x -= 5);
        } else if (input.keys.left && scrollOffset > 0) {
            scrollOffset -= 5;
            level1Platforms.forEach(platform => platform.position.x += 5);
        }
    }

    // Jumping Logic (Prevents double jumps)
    if (input.keys.up && player.velocity.y === 0) {
        player.velocity.y = -15;
    }

    // Platform Collision Detection
    level1Platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    });

    // Win condition check
    if (scrollOffset > 2000) {
        scoreEl.innerHTML = "Winner!";
    }
}

// Start the game loop
animate();
