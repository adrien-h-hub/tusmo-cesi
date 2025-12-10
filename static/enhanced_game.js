import { FRENCH_WORDS, getWordOfDay, getRandomWord, getWordStats, validateWord, hasWord, getAllWords } from './french_words_complete_local.js';

// Game State
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = '';
let wordLength = 5; // Dynamic word length (5-10)
let gameMode = 'daily'; // 'daily', 'infinite', '1v1', 'party'
let gameActive = true;
let startTime = null;
let timerInterval = null;
let currentScore = 0;

// Party Mode State
let partyMode = {
    active: false,
    currentWord: 0,
    totalWords: 10,
    totalScore: 0,
    totalTime: 0,
    wordScores: []
};

// Multiplayer State
let multiplayerState = {
    active: false,
    roomCode: null,
    isHost: false,
    opponentName: 'Adversaire',
    yourScore: 0,
    opponentScore: 0,
    searching: false
};

// Initialize game
function initGame() {
    // Try to restore saved game state for this mode
    const savedState = loadGameState(gameMode);
    
    // Set word based on mode
    if (gameMode === 'daily') {
        rightGuessString = getWordOfDay();
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('score-container').style.display = 'flex';
        
        // Check if saved state is for the same word
        if (savedState && savedState.word === rightGuessString) {
            restoreGameState(savedState);
            return;
        }
        startTimer();
    } else if (gameMode === 'party') {
        rightGuessString = getRandomWord();
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('score-container').style.display = 'flex';
        startTimer();
    } else if (gameMode === 'infinite') {
        // For infinite mode, restore if available
        if (savedState && savedState.word) {
            rightGuessString = savedState.word;
            restoreGameState(savedState);
            return;
        }
        rightGuessString = getRandomWord();
        document.getElementById('timer-container').style.display = 'none';
        document.getElementById('score-container').style.display = 'none';
    } else {
        rightGuessString = getRandomWord();
        document.getElementById('timer-container').style.display = 'none';
        document.getElementById('score-container').style.display = 'none';
    }
    
    console.log('Word:', rightGuessString, '(' + rightGuessString.length + ' lettres)'); // For testing
    
    wordLength = rightGuessString.length; // Set dynamic word length
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    gameActive = true;
    currentScore = 0;
    
    initBoard();
    updateAttemptsDisplay();
    resetKeyboard();
}

function initBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'letter-row';
        
        // Create boxes based on word length (5-10)
        for (let j = 0; j < wordLength; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        
        board.appendChild(row);
    }
}

function resetKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
}

function updateAttemptsDisplay() {
    const attemptsLeft = guessesRemaining;
    document.getElementById('attempts').textContent = `${attemptsLeft}/${NUMBER_OF_GUESSES}`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function getElapsedTime() {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
}

function calculateScore(attempts, timeInSeconds) {
    const baseScore = 1000;
    const attemptBonus = (NUMBER_OF_GUESSES - attempts) * 100;
    const timePenalty = Math.min(timeInSeconds, 300);
    
    return Math.max(0, baseScore + attemptBonus - timePenalty);
}

function insertLetter(pressedKey) {
    if (!gameActive) return;
    if (nextLetter === wordLength) return; // Use dynamic word length
    
    pressedKey = pressedKey.toLowerCase();
    
    const row = document.getElementsByClassName('letter-row')[NUMBER_OF_GUESSES - guessesRemaining];
    const box = row.children[nextLetter];
    box.textContent = pressedKey.toUpperCase();
    box.classList.add('filled');
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter() {
    if (!gameActive) return;
    if (nextLetter === 0) return;
    
    const row = document.getElementsByClassName('letter-row')[NUMBER_OF_GUESSES - guessesRemaining];
    const box = row.children[nextLetter - 1];
    box.textContent = '';
    box.classList.remove('filled');
    currentGuess.pop();
    nextLetter -= 1;
}

function shadeKeyboard(letter, color) {
    const keys = document.querySelectorAll('.key');
    for (const key of keys) {
        if (key.dataset.key === letter) {
            const oldColor = key.classList.contains('correct') ? 'correct' :
                           key.classList.contains('present') ? 'present' :
                           key.classList.contains('absent') ? 'absent' : '';
            
            if (oldColor === 'correct') return;
            if (oldColor === 'present' && color !== 'correct') return;
            
            key.classList.remove('correct', 'present', 'absent');
            key.classList.add(color);
            break;
        }
    }
}

function checkGuess() {
    if (!gameActive) return;
    
    const row = document.getElementsByClassName('letter-row')[NUMBER_OF_GUESSES - guessesRemaining];
    let guessString = currentGuess.join('').toUpperCase();
    
    if (guessString.length !== wordLength) { // Use dynamic word length
        showMessage('Pas assez de lettres!', 'error');
        return;
    }
    
    // Validate word using LOCAL database (instant, no API)
    const isValid = validateWord(guessString);
    
    if (!isValid) {
        showMessage('Mot non valide!', 'error');
        return;
    }
    
    let rightGuess = Array.from(rightGuessString);
    
    // First pass: mark correct positions
    for (let i = 0; i < wordLength; i++) { // Use dynamic word length
        const box = row.children[i];
        const letter = currentGuess[i];
        
        if (letter === rightGuess[i].toLowerCase()) {
            setTimeout(() => {
                box.classList.add('correct');
                shadeKeyboard(letter, 'correct');
            }, i * 250);
            rightGuess[i] = '#';
        }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < wordLength; i++) { // Use dynamic word length
        const box = row.children[i];
        const letter = currentGuess[i];
        
        if (box.classList.contains('correct')) continue;
        
        const letterIndex = rightGuess.findIndex(l => l.toLowerCase() === letter);
        
        if (letterIndex !== -1) {
            setTimeout(() => {
                box.classList.add('present');
                shadeKeyboard(letter, 'present');
            }, i * 250);
            rightGuess[letterIndex] = '#';
        } else {
            setTimeout(() => {
                box.classList.add('absent');
                shadeKeyboard(letter, 'absent');
            }, i * 250);
        }
    }
    
    // Check win/loss
    if (guessString === rightGuessString) {
        setTimeout(() => {
            gameActive = false;
            stopTimer();
            const timeElapsed = getElapsedTime();
            const attemptsUsed = NUMBER_OF_GUESSES - guessesRemaining + 1;
            currentScore = calculateScore(guessesRemaining, timeElapsed);
            
            // Clear saved state when game is won
            clearGameState(gameMode);
            
            if (partyMode.active) {
                handlePartyWordComplete(true, attemptsUsed, timeElapsed, currentScore);
            } else if (multiplayerState.active) {
                handleMultiplayerWin(currentScore);
            } else {
                if (gameMode === 'daily') {
                    saveScore(currentScore, attemptsUsed, timeElapsed);
                }
                showResultModal(true, attemptsUsed, timeElapsed, currentScore);
            }
        }, 1500);
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;
        updateAttemptsDisplay();
        
        // Save game state after each guess
        saveGameState();
        
        if (guessesRemaining === 0) {
            setTimeout(() => {
                gameActive = false;
                stopTimer();
                const timeElapsed = getElapsedTime();
                
                // Clear saved state when game ends
                clearGameState(gameMode);
                
                if (partyMode.active) {
                    handlePartyWordComplete(false, NUMBER_OF_GUESSES, timeElapsed, 0);
                } else if (multiplayerState.active) {
                    handleMultiplayerLoss();
                } else {
                    showResultModal(false, NUMBER_OF_GUESSES, timeElapsed, 0);
                }
            }, 1500);
        }
    }
}

// Game State Save/Load Functions
function saveGameState() {
    if (partyMode.active || multiplayerState.active) return; // Don't save for party/multiplayer
    
    const board = document.getElementById('game-board');
    const rows = board.querySelectorAll('.letter-row');
    const guesses = [];
    
    // Save all completed rows
    rows.forEach((row, rowIndex) => {
        const boxes = row.querySelectorAll('.letter-box');
        let rowData = {
            letters: [],
            states: []
        };
        
        let hasContent = false;
        boxes.forEach(box => {
            const letter = box.textContent || '';
            const state = box.classList.contains('correct') ? 'correct' :
                         box.classList.contains('present') ? 'present' :
                         box.classList.contains('absent') ? 'absent' : '';
            
            rowData.letters.push(letter);
            rowData.states.push(state);
            
            if (letter) hasContent = true;
        });
        
        if (hasContent) {
            guesses.push(rowData);
        }
    });
    
    // Save keyboard state
    const keyboardState = {};
    document.querySelectorAll('.key').forEach(key => {
        const letter = key.dataset.key;
        if (letter && letter.length === 1) {
            keyboardState[letter] = key.classList.contains('correct') ? 'correct' :
                                   key.classList.contains('present') ? 'present' :
                                   key.classList.contains('absent') ? 'absent' : '';
        }
    });
    
    const state = {
        word: rightGuessString,
        guesses: guesses,
        guessesRemaining: guessesRemaining,
        keyboardState: keyboardState,
        startTime: startTime,
        timestamp: Date.now()
    };
    
    localStorage.setItem(`gameState_${gameMode}`, JSON.stringify(state));
}

function loadGameState(mode) {
    const saved = localStorage.getItem(`gameState_${mode}`);
    if (!saved) return null;
    
    try {
        const state = JSON.parse(saved);
        // Check if state is not too old (24 hours for daily, 7 days for infinite)
        const maxAge = mode === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - state.timestamp > maxAge) {
            clearGameState(mode);
            return null;
        }
        return state;
    } catch (e) {
        return null;
    }
}

function restoreGameState(state) {
    rightGuessString = state.word;
    guessesRemaining = state.guessesRemaining;
    startTime = state.startTime;
    gameActive = true;
    currentGuess = [];
    nextLetter = 0;
    
    initBoard();
    
    // Restore guesses
    const board = document.getElementById('game-board');
    const rows = board.querySelectorAll('.letter-row');
    
    state.guesses.forEach((guess, rowIndex) => {
        if (rows[rowIndex]) {
            const boxes = rows[rowIndex].querySelectorAll('.letter-box');
            guess.letters.forEach((letter, colIndex) => {
                if (boxes[colIndex] && letter) {
                    boxes[colIndex].textContent = letter;
                    boxes[colIndex].classList.add('filled');
                    if (guess.states[colIndex]) {
                        boxes[colIndex].classList.add(guess.states[colIndex]);
                    }
                }
            });
        }
    });
    
    // Restore keyboard state
    if (state.keyboardState) {
        Object.keys(state.keyboardState).forEach(letter => {
            const keyState = state.keyboardState[letter];
            if (keyState) {
                const key = document.querySelector(`.key[data-key="${letter}"]`);
                if (key) {
                    key.classList.add(keyState);
                }
            }
        });
    }
    
    updateAttemptsDisplay();
    
    // Restart timer if needed
    if (gameMode === 'daily') {
        startTimer();
    }
    
    console.log('Game state restored for', gameMode);
}

function clearGameState(mode) {
    localStorage.removeItem(`gameState_${mode}`);
}

// Party Mode Functions
function startPartyMode(multiplayer = false) {
    partyMode = {
        active: true,
        currentWord: 0,
        totalWords: 10,
        totalScore: 0,
        totalTime: 0,
        wordScores: []
    };
    
    gameMode = 'party';
    document.getElementById('party-modal').classList.remove('active');
    nextPartyWord();
}

function nextPartyWord() {
    if (partyMode.currentWord >= partyMode.totalWords) {
        showPartyResults();
        return;
    }
    
    partyMode.currentWord++;
    updatePartyDisplay();
    
    stopTimer();
    initGame();
}

function handlePartyWordComplete(won, attempts, time, score) {
    partyMode.wordScores.push({ won, attempts, time, score });
    partyMode.totalScore += score;
    partyMode.totalTime += time;
    
    updatePartyDisplay();
    document.getElementById('party-progress-modal').classList.add('active');
}

function updatePartyDisplay() {
    document.getElementById('party-words-count').textContent = `${partyMode.currentWord}/${partyMode.totalWords}`;
    document.getElementById('party-total-score').textContent = partyMode.totalScore;
    
    const totalMinutes = Math.floor(partyMode.totalTime / 60);
    const totalSeconds = partyMode.totalTime % 60;
    document.getElementById('party-total-time').textContent = 
        `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
}

function showPartyResults() {
    partyMode.active = false;
    
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const wordDisplay = document.getElementById('result-word-display');
    const scoreDisplay = document.getElementById('result-score');
    
    title.textContent = '🎉 Party Mode Terminé!';
    message.textContent = `Vous avez complété ${partyMode.totalWords} mots!`;
    wordDisplay.textContent = `Score: ${partyMode.totalScore}`;
    scoreDisplay.textContent = partyMode.totalScore;
    
    modal.classList.add('active');
}

// Multiplayer Functions
function createRoom() {
    const code = generateRoomCode();
    multiplayerState.roomCode = code;
    multiplayerState.isHost = true;
    multiplayerState.active = true;
    
    document.querySelector('.multiplayer-options').style.display = 'none';
    document.getElementById('room-code-display').style.display = 'block';
    document.getElementById('room-code-text').textContent = code;
    
    // Simulate waiting for opponent (in real app, use WebSocket)
    setTimeout(() => {
        showMessage('Adversaire trouvé!', 'success');
        document.getElementById('multiplayer-modal').classList.remove('active');
        startMultiplayerGame();
    }, 5000);
}

function joinRoom() {
    document.querySelector('.multiplayer-options').style.display = 'none';
    document.getElementById('join-code-input').style.display = 'block';
}

function submitJoinCode() {
    const code = document.getElementById('join-code-field').value.toUpperCase();
    
    if (code.length !== 4) {
        showMessage('Code invalide!', 'error');
        return;
    }
    
    multiplayerState.roomCode = code;
    multiplayerState.isHost = false;
    multiplayerState.active = true;
    
    showMessage('Partie rejointe!', 'success');
    document.getElementById('multiplayer-modal').classList.remove('active');
    startMultiplayerGame();
}

function findPlayer() {
    multiplayerState.searching = true;
    document.querySelector('.multiplayer-options').style.display = 'none';
    document.getElementById('searching-player').style.display = 'block';
    
    // Simulate finding player
    setTimeout(() => {
        multiplayerState.searching = false;
        multiplayerState.active = true;
        showMessage('Adversaire trouvé!', 'success');
        document.getElementById('multiplayer-modal').classList.remove('active');
        startMultiplayerGame();
    }, 3000);
}

function startMultiplayerGame() {
    gameMode = '1v1';
    document.getElementById('multiplayer-info').style.display = 'flex';
    multiplayerState.yourScore = 0;
    multiplayerState.opponentScore = 0;
    updateMultiplayerDisplay();
    initGame();
}

function updateMultiplayerDisplay() {
    document.getElementById('your-score').textContent = multiplayerState.yourScore;
    document.getElementById('opponent-score').textContent = multiplayerState.opponentScore;
}

function handleMultiplayerWin(score) {
    multiplayerState.yourScore += score;
    updateMultiplayerDisplay();
    
    // Simulate opponent score
    const opponentScore = Math.floor(Math.random() * 500) + 300;
    multiplayerState.opponentScore += opponentScore;
    updateMultiplayerDisplay();
    
    const won = multiplayerState.yourScore > multiplayerState.opponentScore;
    showMultiplayerResult(won);
}

function handleMultiplayerLoss() {
    // Simulate opponent win
    const opponentScore = Math.floor(Math.random() * 800) + 600;
    multiplayerState.opponentScore += opponentScore;
    updateMultiplayerDisplay();
    
    showMultiplayerResult(false);
}

function showMultiplayerResult(won) {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    
    if (won) {
        title.textContent = '🏆 Victoire!';
        message.textContent = 'Vous avez battu votre adversaire!';
    } else {
        title.textContent = '😔 Défaite!';
        message.textContent = 'Votre adversaire a gagné!';
    }
    
    modal.classList.add('active');
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function cancelRoom() {
    resetMultiplayerModal();
}

function cancelSearch() {
    multiplayerState.searching = false;
    resetMultiplayerModal();
}

function backToOptions() {
    resetMultiplayerModal();
}

function resetMultiplayerModal() {
    document.querySelector('.multiplayer-options').style.display = 'flex';
    document.getElementById('room-code-display').style.display = 'none';
    document.getElementById('join-code-input').style.display = 'none';
    document.getElementById('searching-player').style.display = 'none';
    document.getElementById('join-code-field').value = '';
}

// Existing functions (showMessage, showResultModal, etc.)
function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function showResultModal(won, attempts, time, score) {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const wordDisplay = document.getElementById('result-word-display');
    const attemptsDisplay = document.getElementById('result-attempts');
    const timeDisplay = document.getElementById('result-time');
    const scoreDisplay = document.getElementById('result-score');
    
    if (won) {
        title.textContent = '🎉 Bravo!';
        if (gameMode === 'daily') {
            message.textContent = 'Vous avez trouvé le mot du jour! Revenez demain pour un nouveau défi! 🌟';
        } else {
            message.textContent = 'Vous avez trouvé le mot!';
        }
    } else {
        title.textContent = '😔 Dommage!';
        if (gameMode === 'daily') {
            message.textContent = 'Vous n\'avez pas trouvé le mot du jour. Revenez demain pour un nouveau défi!';
        } else {
            message.textContent = 'Vous n\'avez pas trouvé le mot.';
        }
    }
    
    wordDisplay.textContent = rightGuessString;
    attemptsDisplay.textContent = `${attempts}/${NUMBER_OF_GUESSES}`;
    
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    scoreDisplay.textContent = score;
    
    // Show countdown for daily mode
    if (gameMode === 'daily') {
        document.getElementById('daily-countdown-box').style.display = 'block';
        updateResultCountdown();
        setInterval(updateResultCountdown, 1000);
    } else {
        document.getElementById('daily-countdown-box').style.display = 'none';
    }
    
    modal.classList.add('active');
}

function updateResultCountdown() {
    const now = new Date();
    const nextNoon = new Date(now);
    
    // If it's before noon, next change is today at noon
    // If it's after noon, next change is tomorrow at noon
    if (now.getHours() < 12) {
        nextNoon.setHours(12, 0, 0, 0);
    } else {
        nextNoon.setDate(nextNoon.getDate() + 1);
        nextNoon.setHours(12, 0, 0, 0);
    }
    
    const diff = nextNoon - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const countdownEl = document.getElementById('result-countdown');
    if (countdownEl) {
        countdownEl.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function saveScore(score, attempts, time) {
    const today = new Date().toDateString();
    const stats = getStats();
    
    localStorage.setItem('dailyScore_' + today, JSON.stringify({
        score,
        attempts,
        time,
        timestamp: Date.now()
    }));
    
    stats.gamesPlayed++;
    if (score > 0) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }
    
    localStorage.setItem('gameStats', JSON.stringify(stats));
    updateLeaderboard();
}

function getStats() {
    const defaultStats = {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0
    };
    
    const saved = localStorage.getItem('gameStats');
    return saved ? JSON.parse(saved) : defaultStats;
}

function updateLeaderboard() {
    const leaderboard = [
        { rank: 1, name: 'Vous', score: currentScore },
        { rank: 2, name: 'Player2', score: 850 },
        { rank: 3, name: 'Player3', score: 720 },
        { rank: 4, name: 'Player4', score: 680 },
        { rank: 5, name: 'Player5', score: 650 }
    ];
    
    const leaderboardEl = document.getElementById('leaderboard');
    leaderboardEl.innerHTML = leaderboard.map(item => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank ${item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : item.rank === 3 ? 'bronze' : ''}">
                ${item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
            </div>
            <div class="leaderboard-name">${item.name}</div>
            <div class="leaderboard-score">${item.score}</div>
        </div>
    `).join('');
}

function showStatsModal() {
    const stats = getStats();
    const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
    
    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('win-rate').textContent = winRate + '%';
    document.getElementById('current-streak').textContent = stats.currentStreak;
    document.getElementById('max-streak').textContent = stats.maxStreak;
    
    updateLeaderboard();
    updateCountdown();
    
    document.getElementById('stats-modal').classList.add('active');
}

function updateCountdown() {
    const now = new Date();
    const nextNoon = new Date(now);
    
    // If it's before noon, next change is today at noon
    // If it's after noon, next change is tomorrow at noon
    if (now.getHours() < 12) {
        nextNoon.setHours(12, 0, 0, 0);
    } else {
        nextNoon.setDate(nextNoon.getDate() + 1);
        nextNoon.setHours(12, 0, 0, 0);
    }
    
    const diff = nextNoon - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        const key = e.key;
        
        if (key === 'Backspace') {
            deleteLetter();
        } else if (key === 'Enter') {
            checkGuess();
        } else if (/^[a-z]$/i.test(key)) {
            insertLetter(key);
        }
    });
    
    // Virtual keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.dataset.key;
            
            if (keyValue === 'Backspace') {
                deleteLetter();
            } else if (keyValue === 'Enter') {
                checkGuess();
            } else {
                insertLetter(keyValue);
            }
        });
    });
    
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            if (mode === '1v1') {
                document.getElementById('multiplayer-modal').classList.add('active');
                return;
            }
            
            if (mode === 'party') {
                document.getElementById('party-modal').classList.add('active');
                return;
            }
            
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = mode;
            stopTimer();
            initGame();
        });
    });
    
    // Multiplayer buttons
    document.getElementById('create-room-btn').addEventListener('click', createRoom);
    document.getElementById('join-room-btn').addEventListener('click', joinRoom);
    document.getElementById('find-player-btn').addEventListener('click', findPlayer);
    document.getElementById('submit-code-btn').addEventListener('click', submitJoinCode);
    document.getElementById('cancel-room-btn').addEventListener('click', cancelRoom);
    document.getElementById('cancel-search-btn').addEventListener('click', cancelSearch);
    document.getElementById('back-to-options-btn').addEventListener('click', backToOptions);
    
    // Party mode buttons
    document.getElementById('start-party-solo-btn').addEventListener('click', () => startPartyMode(false));
    document.getElementById('start-party-multi-btn').addEventListener('click', () => startPartyMode(true));
    document.getElementById('next-word-btn').addEventListener('click', () => {
        document.getElementById('party-progress-modal').classList.remove('active');
        nextPartyWord();
    });
    
    // Modal buttons
    document.getElementById('stats-btn').addEventListener('click', showStatsModal);
    
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    document.getElementById('new-game-btn').addEventListener('click', () => {
        document.getElementById('result-modal').classList.remove('active');
        if (gameMode === 'infinite') {
            initGame();
        }
    });
    
    document.getElementById('share-btn').addEventListener('click', () => {
        const text = `TUSMO CESI 🎯\nScore: ${currentScore}\nEssais: ${NUMBER_OF_GUESSES - guessesRemaining + 1}/${NUMBER_OF_GUESSES}`;
        navigator.clipboard.writeText(text).then(() => {
            showMessage('Résultat copié!', 'success');
        });
    });
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
});
