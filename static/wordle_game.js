import { FRENCH_WORDS, getWordOfDay, getRandomWord } from './french_words.js';

// Game State
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = '';
let gameMode = 'daily'; // 'daily' or 'infinite'
let gameActive = true;
let startTime = null;
let timerInterval = null;
let currentScore = 0;

// Initialize game
function initGame() {
    // Set word based on mode
    if (gameMode === 'daily') {
        rightGuessString = getWordOfDay();
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('score-container').style.display = 'flex';
        startTimer();
    } else {
        rightGuessString = getRandomWord();
        document.getElementById('timer-container').style.display = 'none';
        document.getElementById('score-container').style.display = 'none';
    }
    
    console.log('Word:', rightGuessString); // For testing
    
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
        
        for (let j = 0; j < 5; j++) {
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
    // Base score: 1000 points
    // Deduct 100 points per attempt used
    // Deduct 1 point per second
    const baseScore = 1000;
    const attemptPenalty = (NUMBER_OF_GUESSES - attempts) * 100;
    const timePenalty = Math.min(timeInSeconds, 300); // Max 5 minutes penalty
    
    return Math.max(0, baseScore + attemptPenalty - timePenalty);
}

function insertLetter(pressedKey) {
    if (!gameActive) return;
    if (nextLetter === 5) return;
    
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
    
    if (guessString.length !== 5) {
        showMessage('Pas assez de lettres!', 'error');
        return;
    }
    
    if (!FRENCH_WORDS.includes(guessString)) {
        showMessage('Mot non valide!', 'error');
        return;
    }
    
    let rightGuess = Array.from(rightGuessString);
    
    // First pass: mark correct positions
    for (let i = 0; i < 5; i++) {
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
    for (let i = 0; i < 5; i++) {
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
            
            if (gameMode === 'daily') {
                saveScore(currentScore, attemptsUsed, timeElapsed);
            }
            
            showResultModal(true, attemptsUsed, timeElapsed, currentScore);
        }, 1500);
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;
        updateAttemptsDisplay();
        
        if (guessesRemaining === 0) {
            setTimeout(() => {
                gameActive = false;
                stopTimer();
                const timeElapsed = getElapsedTime();
                showResultModal(false, NUMBER_OF_GUESSES, timeElapsed, 0);
            }, 1500);
        }
    }
}

function showMessage(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ef4444' : '#6366f1'};
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
        message.textContent = 'Vous avez trouvé le mot!';
    } else {
        title.textContent = '😔 Dommage!';
        message.textContent = 'Vous n\'avez pas trouvé le mot.';
    }
    
    wordDisplay.textContent = rightGuessString;
    attemptsDisplay.textContent = `${attempts}/${NUMBER_OF_GUESSES}`;
    
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    scoreDisplay.textContent = score;
    
    modal.classList.add('active');
}

function saveScore(score, attempts, time) {
    const today = new Date().toDateString();
    const stats = getStats();
    
    // Save today's score
    localStorage.setItem('dailyScore_' + today, JSON.stringify({
        score,
        attempts,
        time,
        timestamp: Date.now()
    }));
    
    // Update stats
    stats.gamesPlayed++;
    if (score > 0) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }
    
    localStorage.setItem('gameStats', JSON.stringify(stats));
    
    // Update leaderboard
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
    // Simulated leaderboard (in real app, this would come from server)
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
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
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
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = btn.dataset.mode;
            stopTimer();
            initGame();
        });
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
