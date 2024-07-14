// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_SPEED = 2;
const PIPE_SPAWN_INTERVAL = 1500;

// Game state
let bird = { x: 50, y: 200, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

// Load images
const birdImg = new Image();
birdImg.src = 'bird.png';
const pipeImg = new Image();
pipeImg.src = 'pipe.png';
const bgImg = new Image();
bgImg.src = 'background.png';

// Game loop
function gameLoop() {
    update();
    render();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    if (gameOver) return;

    // Update bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Check collisions
    if (bird.y + 24 > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Update pipes
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
        
        // Check collision
        if (
            bird.x + 34 > pipe.x &&
            bird.x < pipe.x + 52 &&
            (bird.y < pipe.top || bird.y + 24 > pipe.bottom)
        ) {
            gameOver = true;
        }

        // Update score
        if (pipe.x + 52 < bird.x && !pipe.passed) {
            score++;
            pipe.passed = true;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x > -52);
}

// Render game
function render() {
    // Draw background
    ctx.drawImage(bgImg, 0, 0);

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, pipe.top - 320);
        ctx.drawImage(pipeImg, pipe.x, pipe.bottom, 52, 320);
    });

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', 50, 256);
    }
}

// Spawn pipes
function spawnPipe() {
    if (gameOver) return;

    const gap = 120;
    const top = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + gap,
        passed: false
    });
}

// Handle user input
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (gameOver) {
            // Reset game
            bird = { x: 50, y: 200, velocity: 0 };
            pipes = [];
            score = 0;
            gameOver = false;
            gameLoop();
        } else {
            bird.velocity = FLAP_STRENGTH;
        }
    }
});

// Start game
setInterval(spawnPipe, PIPE_SPAWN_INTERVAL);
gameLoop();