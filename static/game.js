// Game State
let currentScreen = 'main-menu';
let gameState = {
    gameId: null,
    playerId: null,
    mode: null,
    word: null,
    wordLength: 0,
    maxAttempts: 6,
    currentAttempt: 0,
    attempts: [],
    letterStates: {}
};

// Socket.IO connection
const socket = io();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeKeyboard();
    setupEventListeners();
});

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function showMainMenu() {
    showScreen('main-menu');
    resetGameState();
}

function showMultiplayerMenu() {
    showScreen('multiplayer-menu');
}

function showRules() {
    showScreen('rules-screen');
}

function showPrivateGameMenu() {
    showScreen('private-game-menu');
}

// Solo Game
async function startSoloGame() {
    try {
        const response = await fetch('/api/new_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode: 'solo' })
        });
        
        const data = await response.json();
        
        gameState.gameId = data.game_id;
        gameState.playerId = data.player_id;
        gameState.mode = 'solo';
        gameState.wordLength = data.word_length;
        gameState.maxAttempts = data.max_attempts;
        gameState.currentAttempt = 0;
        gameState.attempts = [];
        gameState.letterStates = {};
        
        document.getElementById('game-mode-title').textContent = 'TUSMO CESI - Solo';
        document.getElementById('game-mode-desc').textContent = 'Trouvez le mot mystère!';
        document.getElementById('guess-input').maxLength = data.word_length;
        
        initializeGameBoard();
        showScreen('game-screen');
        updateAttemptsDisplay();
        
    } catch (error) {
        console.error('Erreur lors du démarrage du jeu:', error);
        alert('Erreur lors du démarrage du jeu');
    }
}

// Multiplayer
function joinMatchmaking(mode) {
    const playerName = document.getElementById('player-name').value.trim();
    
    if (!playerName) {
        alert('Veuillez entrer votre pseudo');
        return;
    }
    
    gameState.mode = mode;
    socket.emit('join_matchmaking', { mode: mode, player_name: playerName });
    showScreen('waiting-screen');
    
    const modeText = mode === '1v1' ? '1 vs 1' : '2 vs 2';
    document.getElementById('waiting-message').textContent = `Recherche d'adversaires (${modeText})...`;
}

function cancelMatchmaking() {
    socket.disconnect();
    socket.connect();
    showMultiplayerMenu();
}

// Socket Events
socket.on('connected', (data) => {
    console.log('Connected to server:', data.session_id);
});

socket.on('waiting', (data) => {
    document.getElementById('waiting-message').textContent = data.message;
});

socket.on('game_start', (data) => {
    gameState.gameId = data.game_id;
    gameState.playerId = socket.id;
    gameState.wordLength = data.word_length;
    gameState.maxAttempts = data.max_attempts;
    gameState.currentAttempt = 0;
    gameState.attempts = [];
    gameState.letterStates = {};
    
    const modeText = data.mode === '1v1' ? '1 vs 1' : '2 vs 2';
    document.getElementById('game-mode-title').textContent = `TUSMO CESI - ${modeText}`;
    
    if (data.opponent) {
        document.getElementById('game-mode-desc').textContent = `Contre: ${data.opponent}`;
    } else if (data.team) {
        document.getElementById('game-mode-desc').textContent = data.team;
    }
    
    document.getElementById('guess-input').maxLength = data.word_length;
    
    initializeGameBoard();
    showScreen('game-screen');
    updateAttemptsDisplay();
});

socket.on('guess_result', (data) => {
    if (data.player_id === socket.id) {
        displayGuessResult(data.result);
    }
});

socket.on('game_over', (data) => {
    const isWinner = data.winner === socket.id;
    showGameOver(isWinner, data.word);
});

// Game Logic
function initializeGameBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    for (let i = 0; i < gameState.maxAttempts; i++) {
        const row = document.createElement('div');
        row.className = 'attempt-row';
        row.id = `attempt-${i}`;
        
        for (let j = 0; j < gameState.wordLength; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        
        board.appendChild(row);
    }
}

async function submitGuess() {
    const input = document.getElementById('guess-input');
    const guess = input.value.toUpperCase().trim();
    
    if (guess.length !== gameState.wordLength) {
        alert(`Le mot doit contenir ${gameState.wordLength} lettres`);
        return;
    }
    
    input.disabled = true;
    
    try {
        if (gameState.mode === 'solo') {
            const response = await fetch('/api/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    game_id: gameState.gameId,
                    player_id: gameState.playerId,
                    guess: guess
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
                input.disabled = false;
                return;
            }
            
            displayGuessResult(data);
            
            if (data.won || gameState.currentAttempt >= gameState.maxAttempts) {
                setTimeout(() => {
                    showGameOver(data.won, data.word);
                }, 1500);
            }
        } else {
            socket.emit('submit_guess', {
                game_id: gameState.gameId,
                guess: guess
            });
        }
        
        input.value = '';
        
    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        alert('Erreur lors de la soumission');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function displayGuessResult(data) {
    const result = data.result;
    const row = document.getElementById(`attempt-${gameState.currentAttempt}`);
    const boxes = row.querySelectorAll('.letter-box');
    
    result.forEach((letterData, index) => {
        setTimeout(() => {
            boxes[index].textContent = letterData.letter;
            boxes[index].classList.add(letterData.status);
            
            // Update keyboard
            updateKeyboardKey(letterData.letter, letterData.status);
        }, index * 100);
    });
    
    gameState.currentAttempt++;
    updateAttemptsDisplay();
}

function updateAttemptsDisplay() {
    const attemptsLeft = gameState.maxAttempts - gameState.currentAttempt;
    document.getElementById('attempts-left').textContent = `Essais: ${attemptsLeft}/${gameState.maxAttempts}`;
}

function showGameOver(won, word) {
    const title = document.getElementById('game-over-title');
    const message = document.getElementById('game-over-message');
    const revealedWord = document.getElementById('revealed-word');
    
    if (won) {
        title.textContent = '🎉 Bravo!';
        message.textContent = 'Vous avez trouvé le mot!';
    } else {
        title.textContent = '😔 Dommage!';
        message.textContent = 'Vous n\'avez pas trouvé le mot.';
    }
    
    revealedWord.textContent = word;
    showScreen('game-over-screen');
}

function playAgain() {
    if (gameState.mode === 'solo') {
        startSoloGame();
    } else {
        showMultiplayerMenu();
    }
}

function quitGame() {
    if (confirm('Voulez-vous vraiment quitter la partie?')) {
        showMainMenu();
    }
}

function resetGameState() {
    gameState = {
        gameId: null,
        playerId: null,
        mode: null,
        word: null,
        wordLength: 0,
        maxAttempts: 6,
        currentAttempt: 0,
        attempts: [],
        letterStates: {}
    };
}

// Keyboard
function initializeKeyboard() {
    const keyboard = document.getElementById('virtual-keyboard');
    const azertyLayout = [
        ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['W', 'X', 'C', 'V', 'B', 'N', '⌫']
    ];
    
    keyboard.innerHTML = '';
    
    azertyLayout.forEach(row => {
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.className = 'key';
            keyButton.textContent = key;
            keyButton.dataset.key = key;
            
            if (key === '⌫') {
                keyButton.style.gridColumn = 'span 3';
                keyButton.onclick = () => {
                    const input = document.getElementById('guess-input');
                    input.value = input.value.slice(0, -1);
                };
            } else {
                keyButton.onclick = () => {
                    const input = document.getElementById('guess-input');
                    if (input.value.length < gameState.wordLength) {
                        input.value += key;
                    }
                };
            }
            
            keyboard.appendChild(keyButton);
        });
    });
}

function updateKeyboardKey(letter, status) {
    const key = document.querySelector(`.key[data-key="${letter}"]`);
    if (key) {
        // Only update if new status is better
        if (!key.classList.contains('correct')) {
            key.classList.remove('present', 'absent');
            key.classList.add(status);
        }
    }
}

// Event Listeners
function setupEventListeners() {
    const input = document.getElementById('guess-input');
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
    
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}
