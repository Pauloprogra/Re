const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
// NOVO: Seleciona o elemento de áudio
const backgroundMusic = document.getElementById('background-music');

let loop;
let score = 0;
let scoreSet = false;

const incrementScore = () => {
    score++;
    scoreElement.textContent = score;
}

const jump = () => {
    const isGameActive = !startScreen.classList.contains('show') && 
                         !gameOverScreen.classList.contains('show') && 
                         !mario.src.includes('game-over.png');

    if (!isGameActive) { return; }
    if (mario.classList.contains('jump')) { return; }

    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500); 
}

const startGame = () => {
    // NOVO: Inicia a música quando o jogo começa
    backgroundMusic.play();

    startScreen.classList.remove('show');
    gameOverScreen.classList.remove('show');
    
    mario.src = 'mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0px';
    score = 0;
    scoreElement.textContent = score;

    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    document.querySelector('.clouds').style.animationPlayState = 'running';

    loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition < 0 && !scoreSet) {
            scoreSet = true;
            incrementScore();
        }
        if (pipePosition > 0 && pipePosition < 700) {
             scoreSet = false; 
        }

        // Condição de Game Over
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            
            // NOVO: Pausa a música no Game Over
            backgroundMusic.pause();
            // Opcional: reiniciar o tempo da música para começar do zero no próximo jogo
            backgroundMusic.currentTime = 0; 
            
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;

            mario.src = 'game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';

            clearInterval(loop);
            
            finalScoreElement.textContent = score;
            gameOverScreen.classList.add('show');
        }

    }, 10);
};

const restartGame = () => {
    window.location.reload(); 
}

// --- Event Listeners ---

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

document.addEventListener('keydown', jump);
document.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON') { 
         jump();
    }
});


