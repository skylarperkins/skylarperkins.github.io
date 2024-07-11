const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
let playerPosition = 180;
let score = 0;
let gameInterval;
let fallingInterval;
let fallingSpeed = 2000;
let moveInterval;
let moveTimeout;

document.addEventListener('keydown', (event) => {
    movePlayer(event.key.replace('Arrow', '').toLowerCase());
});

function movePlayer(direction) {
    if (direction === 'left' && playerPosition > 0) {
        playerPosition -= 20;
    } else if (direction === 'right' && playerPosition < 360) {
        playerPosition += 20;
    }
    player.style.left = playerPosition + 'px';
}

function startMoving(direction) {
    movePlayer(direction);
    moveTimeout = setTimeout(() => {
        moveInterval = setInterval(() => movePlayer(direction), 100);
    }, 300);
}

function stopMoving() {
    clearTimeout(moveTimeout);
    clearInterval(moveInterval);
}

leftButton.addEventListener('mousedown', () => startMoving('left'));
leftButton.addEventListener('mouseup', stopMoving);
leftButton.addEventListener('mouseleave', stopMoving);
leftButton.addEventListener('touchstart', () => startMoving('left'));
leftButton.addEventListener('touchend', stopMoving);

rightButton.addEventListener('mousedown', () => startMoving('right'));
rightButton.addEventListener('mouseup', stopMoving);
rightButton.addEventListener('mouseleave', stopMoving);
rightButton.addEventListener('touchstart', () => startMoving('right'));
rightButton.addEventListener('touchend', stopMoving);

function createFallingObject(xPosition) {
    const object = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    object.setAttribute("width", "20");
    object.setAttribute("height", "20");
    object.classList.add('fallingObject');
    object.style.left = xPosition + 'px';
    object.style.top = '0px';

    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.setAttribute("points", "10,0 20,20 0,20");
    triangle.setAttribute("fill", "#992e2e");

    object.appendChild(triangle);
    gameContainer.appendChild(object);
    moveFallingObject(object);
}

function createFallingObjects() {
    const xPosition1 = playerPosition + Math.random() * 40 - 20;
    const xPosition2 = playerPosition + Math.random() * 40 - 20;
    createFallingObject(xPosition1);
    createFallingObject(xPosition2);
}

function moveFallingObject(object) {
    let objectTop = 0;
    const interval = setInterval(() => {
        if (objectTop < 580) {
            objectTop += 5;
            object.style.top = objectTop + 'px';
            if (checkCollision(player, object)) {
                endGame();
            }
        } else {
            clearInterval(interval);
            gameContainer.removeChild(object);
            increaseScore();
        }
    },
        20);
}

function checkCollision(player, object) {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    return !(
        playerRect.top > objectRect.bottom ||
        playerRect.bottom < objectRect.top ||
        playerRect.right < objectRect.left ||
        playerRect.left > objectRect.right
    );
}

function increaseScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(fallingInterval);
    gameOverDisplay.classList.remove('hidden');
}

function restartGame() {
    playerPosition = 180;
    player.style.left = playerPosition + 'px';
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.classList.add('hidden');
    fallingSpeed = 2000;
    startGame();
}

function increaseDifficulty() {
    if (fallingSpeed > 500) {
        fallingSpeed -= 100;
    }
}

function startGame() {
    fallingInterval = setInterval(createFallingObjects, fallingSpeed);
    setInterval(increaseDifficulty, 10000);
}

startGame();