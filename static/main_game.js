import { WORDS } from "./words_filtered.js";
import { StatsManager } from "./stats.js";
import { showConfetti, shakeElement, animateRowComplete, SoundManager, showStreakBadge } from "./animations.js";
import { initializeEnhancements, validateHardMode } from "./game_enhancements.js";

// Game State
let currentMode = null;
let currentWord = null;
let wordLength = 0;
let guessesRemaining = 6;
let currentGuess = [];
let nextLetter = 0;
let gameActive = false;
let currentWordIndex = 0;
let totalWords = 1;
let startTime = null;
let timerInterval = null;
let foundLetters = []; // Track correctly placed letters (green)
let yellowLetters = []; // Track misplaced letters (yellow) for hard mode
let hardMode = false; // Hard mode toggle
let statsManager = new StatsManager();
let soundManager = new SoundManager();
let allGuesses = []; // Track all guesses for daily mode

// Initialize enhancements after DOM loads
window.addEventListener('DOMContentLoaded', () => {
    initializeEnhancements({ statsManager, soundManager, hardMode });
    // Make managers globally available
    window.statsManager = statsManager;
    window.soundManager = soundManager;
});

// Daily word seed (changes at noon)
function getDailySeed() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    
    // Change at noon (12:00)
    const seed = hour >= 12 
        ? `${year}-${month}-${day}-PM`
        : `${year}-${month}-${day}-AM`;
    
    return seed;
}

// Common French words (most frequently used)
const COMMON_WORDS = [
    "AVOIR", "FAIRE", "DIRE", "ALLER", "VOIR", "SAVOIR", "POUVOIR", "VOULOIR", "VENIR", "DEVOIR",
    "PRENDRE", "DONNER", "PARLER", "AIMER", "PASSER", "METTRE", "CROIRE", "DEMANDER", "RESTER",
    "MAISON", "TEMPS", "JOUR", "HOMME", "CHOSE", "ENFANT", "OEIL", "MAIN", "PLACE", "PAYS",
    "MONDE", "VILLE", "FEMME", "HEURE", "COEUR", "MOMENT", "POINT", "PORTE", "ARBRE", "FLEUR",
    "GRAND", "PETIT", "AUTRE", "JEUNE", "VIEUX", "BEAU", "LONG", "BLANC", "NOIR", "ROUGE"
];

// Check if word is common
function isCommonWord(word) {
    // Word is common if:
    // 1. It's in the common words list
    if (COMMON_WORDS.includes(word.toUpperCase())) return true;
    
    // 2. It's short (5-7 letters are usually more common)
    if (word.length >= 5 && word.length <= 7) return true;
    
    // 3. Otherwise it's uncommon
    return false;
}

// Get number of hint letters based on word difficulty
function getHintLetters(word) {
    const length = word.length;
    const isCommon = isCommonWord(word);
    
    // Common words: no hints
    if (isCommon) return 0;
    
    // Uncommon words based on length
    if (length <= 7) return 0;      // 5-7 letters: no hint
    if (length === 8) return 1;     // 8 letters: 1 hint
    if (length === 9) return 1;     // 9 letters: 1 hint
    if (length === 10) return 1;    // 10 letters: 1 hint
    if (length === 11) return 2;    // 11 letters: 2 hints
    if (length >= 12) return 2;     // 12+ letters: 2 hints
    
    return 0;
}

// Check if player has already played daily mode today
function hasPlayedDailyToday() {
    const today = getDailySeed();
    const savedState = loadDailyState();
    return savedState && savedState.completed && savedState.seed === today;
}

// Save daily game state
function saveDailyState(state) {
    const today = getDailySeed();
    const stateToSave = {
        ...state,
        seed: today
    };
    localStorage.setItem('dailyGameState', JSON.stringify(stateToSave));
}

// Load daily game state
function loadDailyState() {
    const today = getDailySeed();
    const saved = localStorage.getItem('dailyGameState');
    if (!saved) return null;
    
    const state = JSON.parse(saved);
    // Only return if it's for today
    if (state.seed !== today) {
        localStorage.removeItem('dailyGameState');
        return null;
    }
    return state;
}

// Mark daily mode as completed
function markDailyAsCompleted(won, attempts, guesses) {
    saveDailyState({
        completed: true,
        won: won,
        attempts: attempts,
        guesses: guesses,
        word: currentWord.toUpperCase()
    });
}

// Show completed daily game
function showDailyCompleted(state) {
    showScreen("gameScreen");
    document.getElementById("gameTitle").textContent = "Mot du Jour - Terminé";
    
    // Set the word
    currentWord = state.word.toLowerCase();
    wordLength = currentWord.length;
    
    // Recreate the board with saved guesses
    initBoard();
    gameActive = false;
    
    // Restore all guesses
    state.guesses.forEach((guess, rowIndex) => {
        const row = document.getElementById("board").children[rowIndex];
        if (!row) return;
        
        for (let i = 0; i < guess.length; i++) {
            const box = row.children[i];
            if (!box) continue;
            
            const letter = guess[i];
            box.textContent = letter;
            
            // Color the box
            let color = "#787c7e"; // gray
            if (currentWord[i] === letter.toLowerCase()) {
                color = "#e74c3c"; // red (correct position)
            } else if (currentWord.includes(letter.toLowerCase())) {
                color = "#f39c12"; // yellow (wrong position)
            }
            
            box.style.backgroundColor = color;
            box.style.color = 'white';
            box.style.borderColor = color;
        }
    });
    
    // Show result message
    setTimeout(() => {
        if (state.won) {
            toastr.success(`Vous avez trouvé le mot en ${state.attempts} essai${state.attempts > 1 ? 's' : ''}!`);
        } else {
            toastr.info(`Le mot était: ${state.word}`);
        }
        toastr.info("Revenez demain à midi pour un nouveau mot!");
    }, 500);
}

// Restore in-progress daily game
function restoreDailyState(state) {
    // This would restore a game in progress
    // For now, we'll just start fresh if not completed
    initBoard();
    startTimer();
    gameActive = true;
}

// Get word with length preference (favor shorter words)
function getWeightedWord(seed) {
    // Separate words by length
    const shortWords = WORDS.filter(w => w.length <= 7);  // 75% chance
    const longWords = WORDS.filter(w => w.length >= 8);   // 25% chance
    
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
    }
    
    // Use hash to determine if we pick short or long word
    const useShortWord = (Math.abs(hash) % 100) < 75; // 75% chance for short words
    
    if (useShortWord && shortWords.length > 0) {
        const index = Math.abs(hash) % shortWords.length;
        return shortWords[index];
    } else if (longWords.length > 0) {
        const index = Math.abs(hash) % longWords.length;
        return longWords[index];
    } else {
        // Fallback
        const index = Math.abs(hash) % WORDS.length;
        return WORDS[index];
    }
}

// Get daily word
function getDailyWord() {
    const seed = getDailySeed();
    return getWeightedWord(seed);
}

// Get easier words (5-7 letters)
function getEasierWords() {
    const easierWords = WORDS.filter(word => word.length >= 5 && word.length <= 7);
    const seed = getDailySeed();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
    }
    
    const words = [];
    for (let i = 0; i < 4; i++) {
        const index = Math.abs(hash + i * 1000) % easierWords.length;
        words.push(easierWords[index]);
    }
    return words;
}

// Navigation
const screens = document.querySelectorAll(".screen");
const menuCards = document.querySelectorAll(".menu-card");

function showScreen(screenId) {
    screens.forEach(screen => screen.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
}

// Menu cards click handlers
menuCards.forEach(card => {
    card.addEventListener("click", function() {
        const mode = this.getAttribute("data-mode");
        
        // Check if daily mode already played today
        if (mode === "daily" && hasPlayedDailyToday()) {
            toastr.warning("Vous avez déjà joué le mot du jour! Revenez demain à midi.");
            return;
        }
        
        if (mode === "1v1") {
            showScreen("setup1v1Screen");
        } else if (mode === "party") {
            showScreen("setupPartyScreen");
        } else if (mode === "suite") {
            startGame("suite");
        } else {
            startGame(mode);
        }
    });
});

// Back buttons
document.getElementById("btnBack").addEventListener("click", () => {
    showScreen("menuScreen");
    stopTimer();
    resetGame();
});

document.getElementById("btnBack1v1").addEventListener("click", () => {
    showScreen("menuScreen");
});

document.getElementById("btnBackParty").addEventListener("click", () => {
    showScreen("menuScreen");
});

// Start game
function startGame(mode) {
    currentMode = mode;
    
    // Check if daily mode was already completed today
    if (mode === "daily") {
        const savedState = loadDailyState();
        if (savedState && savedState.completed) {
            // Show completed state instead of starting new game
            showDailyCompleted(savedState);
            return;
        }
    }
    
    showScreen("gameScreen");
    
    if (mode === "daily") {
        document.getElementById("gameTitle").textContent = "Mot du Jour";
        currentWord = getDailyWord().toLowerCase();
        totalWords = 1;
        currentWordIndex = 1;
        allGuesses = []; // Reset guesses for new daily game
        
        // Load saved state if exists (in progress)
        const savedState = loadDailyState();
        if (savedState && !savedState.completed) {
            restoreDailyState(savedState);
            return;
        }
    } else if (mode === "infinite") {
        document.getElementById("gameTitle").textContent = "Mode Infini";
        // Use weighted selection for infinite mode too
        const randomSeed = Date.now().toString() + Math.random().toString();
        currentWord = getWeightedWord(randomSeed).toLowerCase();
        totalWords = "∞";
        currentWordIndex = 1;
    } else if (mode === "suite") {
        document.getElementById("gameTitle").textContent = "Suite de 4";
        const words = getEasierWords();
        currentWord = words[0].toLowerCase();
        totalWords = 4;
        currentWordIndex = 1;
    }
    
    wordLength = currentWord.length;
    updateGameProgress();
    initBoard();
    startTimer();
    gameActive = true;
    
    console.log("Mot à deviner:", currentWord, "Longueur:", wordLength);
}

// Update game progress
function updateGameProgress() {
    document.getElementById("gameProgress").textContent = `Mot ${currentWordIndex}/${totalWords}`;
}

// Timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById("gameTimer").textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Init board
function initBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    
    // Get number of hint letters
    const hintCount = getHintLetters(currentWord);
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < wordLength; j++) {
            const box = document.createElement("div");
            box.className = "letter-box";
            
            // Add hint letters to first row
            if (i === 0 && j < hintCount) {
                box.textContent = currentWord[j].toUpperCase();
                box.classList.add("filled-box", "hint-box", "locked");
                box.style.backgroundColor = "rgb(16, 185, 129)"; // green
                box.style.color = "white";
                box.style.borderColor = "rgb(16, 185, 129)";
                box.dataset.locked = "true";
            }
            
            // Add found letters to subsequent rows
            if (i > 0 && foundLetters[j]) {
                box.textContent = foundLetters[j].toUpperCase();
                box.classList.add("filled-box", "locked");
                box.style.backgroundColor = "rgb(16, 185, 129)"; // green
                box.style.color = "white";
                box.style.borderColor = "rgb(16, 185, 129)";
                box.dataset.locked = "true";
            }
            
            row.appendChild(box);
        }
        
        board.appendChild(row);
    }
    
    // If there are hints, pre-fill currentGuess and foundLetters
    if (hintCount > 0) {
        for (let i = 0; i < hintCount; i++) {
            currentGuess.push(currentWord[i].toLowerCase());
            foundLetters[i] = currentWord[i].toLowerCase();
        }
        nextLetter = hintCount;
        
        // Show hint message
        const hintText = hintCount === 1 ? "1 lettre donnée" : `${hintCount} lettres données`;
        toastr.info(`Mot difficile! ${hintText} comme indice 💡`);
    }
}

// Reset game
function resetGame() {
    guessesRemaining = 6;
    currentGuess = [];
    nextLetter = 0;
    gameActive = false;
    foundLetters = []; // Reset found letters
    
    // Reset keyboard colors
    document.querySelectorAll(".keyboard-button").forEach(btn => {
        btn.style.backgroundColor = "#d3d6da";
        btn.style.color = "#000";
    });
}

// Shade keyboard
function shadeKeyBoard(letter, color) {
    const buttons = document.getElementsByClassName("keyboard-button");
    for (const elem of buttons) {
        if (elem.textContent.toLowerCase() === letter) {
            const oldColor = elem.style.backgroundColor;
            // Don't override red (correct position)
            if (oldColor === 'rgb(231, 76, 60)' || oldColor === '#e74c3c') {
                return;
            }
            // Don't override yellow with grey
            if ((oldColor === 'rgb(243, 156, 18)' || oldColor === '#f39c12') && color === 'grey') {
                return;
            }
            elem.style.backgroundColor = color;
            elem.style.color = 'white';
            break;
        }
    }
}

// Delete letter
function deleteLetter() {
    if (nextLetter === 0) return;
    
    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    
    // Find the last non-locked position
    let posToDelete = nextLetter - 1;
    while (posToDelete >= 0 && row.children[posToDelete].dataset.locked === "true") {
        posToDelete--;
    }
    
    if (posToDelete < 0) return; // All letters are locked
    
    const box = row.children[posToDelete];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess[posToDelete] = null;
    
    // Update nextLetter to the position after the deleted letter
    nextLetter = posToDelete;
    
    // Find next available position
    while (nextLetter < wordLength && row.children[nextLetter].dataset.locked === "true") {
        nextLetter++;
    }
}

// Insert letter
function insertLetter(pressedKey) {
    if (nextLetter >= wordLength) return;
    
    pressedKey = pressedKey.toLowerCase();
    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    
    // Skip locked positions
    while (nextLetter < wordLength && row.children[nextLetter].dataset.locked === "true") {
        nextLetter++;
    }
    
    if (nextLetter >= wordLength) return;
    
    const box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess[nextLetter] = pressedKey;
    nextLetter++;
    
    // Play click sound
    soundManager.playClick();
    
    // Skip to next non-locked position
    while (nextLetter < wordLength && row.children[nextLetter].dataset.locked === "true") {
        nextLetter++;
    }
}

// Check guess
function checkGuess() {
    if (!gameActive) return;
    
    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = '';
    const rightGuess = Array.from(currentWord);
    
    // Build guess string, handling null values
    for (let i = 0; i < wordLength; i++) {
        if (currentGuess[i]) {
            guessString += currentGuess[i];
        } else {
            // Missing letter
            toastr.error("Pas assez de lettres!");
            return;
        }
    }
    
    if (guessString.length != wordLength) {
        toastr.error("Pas assez de lettres!");
        return;
    }
    
    const guessUpper = guessString.toUpperCase();
    if (!WORDS.includes(guessUpper)) {
        toastr.error("Mot non valide!");
        shakeElement(row);
        soundManager.playWrong();
        return;
    }
    
    // Hard mode validation
    hardMode = localStorage.getItem('hard_mode') === 'true';
    if (hardMode) {
        const validation = validateHardMode(currentGuess, foundLetters, yellowLetters);
        if (!validation.valid) {
            toastr.error(validation.message);
            shakeElement(row);
            soundManager.playWrong();
            return;
        }
    }
    
    // Save this guess for daily mode
    if (currentMode === "daily") {
        allGuesses.push(guessString.toUpperCase());
    }
    
    // First pass: mark all correct positions (green)
    const letterColors = new Array(wordLength).fill('');
    const targetLetters = Array.from(currentWord);
    const usedPositions = new Array(wordLength).fill(false);
    
    // Pass 1: Find all exact matches (red)
    for (let i = 0; i < wordLength; i++) {
        if (currentGuess[i] === targetLetters[i]) {
            letterColors[i] = '#e74c3c'; // red
            usedPositions[i] = true;
            // Save found letter for next rows
            foundLetters[i] = currentGuess[i];
        }
    }
    
    // Pass 2: Find misplaced letters (yellow) - only if letter exists elsewhere
    yellowLetters = []; // Reset yellow letters for this guess
    for (let i = 0; i < wordLength; i++) {
        if (letterColors[i] === '') { // Not already green
            const letter = currentGuess[i];
            let foundYellow = false;
            
            // Check if this letter exists in target at a different position
            for (let j = 0; j < wordLength; j++) {
                if (!usedPositions[j] && targetLetters[j] === letter) {
                    letterColors[i] = '#f39c12'; // better yellow
                    usedPositions[j] = true;
                    foundYellow = true;
                    // Track yellow letters for hard mode
                    if (!yellowLetters.includes(letter)) {
                        yellowLetters.push(letter);
                    }
                    break;
                }
            }
            
            // If not found, mark as grey
            if (!foundYellow) {
                letterColors[i] = 'grey';
            }
        }
    }
    
    // Apply colors with animation
    for (let i = 0; i < wordLength; i++) {
        const box = row.children[i];
        const letter = currentGuess[i];
        const letterColor = letterColors[i];
        
        const delay = 250 * i;
        setTimeout(() => {
            animateCSS(box, 'flipInX');
            box.style.backgroundColor = letterColor;
            box.style.color = 'white';
            box.style.borderColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }
    
    if (guessString === currentWord) {
        // Animate row completion
        animateRowComplete(row);
        
        setTimeout(() => {
            toastr.success("Bravo! Vous avez trouvé!");
            gameActive = false;
            
            // Play win sound and show confetti
            soundManager.playWin();
            showConfetti();
            
            // Record stats
            const attempts = 7 - guessesRemaining;
            const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
            hardMode = localStorage.getItem('hard_mode') === 'true';
            statsManager.recordWin(attempts, timeElapsed, currentMode, hardMode);
            
            // Mark daily mode as completed with all guesses
            if (currentMode === "daily") {
                markDailyAsCompleted(true, attempts, allGuesses);
            }
            
            // Show streak badge if applicable
            const stats = statsManager.getStats();
            if (stats.currentStreak > 1 && stats.currentStreak % 5 === 0) {
                setTimeout(() => showStreakBadge(stats.currentStreak), 1000);
            }
            
            if (currentMode === "infinite") {
                setTimeout(() => {
                    resetGame();
                    // Use weighted selection for next word
                    const randomSeed = Date.now().toString() + Math.random().toString();
                    currentWord = getWeightedWord(randomSeed).toLowerCase();
                    wordLength = currentWord.length;
                    currentWordIndex++;
                    updateGameProgress();
                    currentGuess = []; // Reset before initBoard
                    nextLetter = 0;
                    initBoard();
                    gameActive = true;
                    console.log("Nouveau mot:", currentWord);
                }, 2000);
            } else if (currentMode === "suite" && currentWordIndex < 4) {
                setTimeout(() => {
                    resetGame();
                    const words = getEasierWords();
                    currentWord = words[currentWordIndex].toLowerCase();
                    wordLength = currentWord.length;
                    currentWordIndex++;
                    updateGameProgress();
                    currentGuess = []; // Reset before initBoard
                    nextLetter = 0;
                    initBoard();
                    gameActive = true;
                    console.log("Mot suivant:", currentWord);
                }, 2000);
            } else if (currentMode === "suite" && currentWordIndex === 4) {
                stopTimer();
                setTimeout(() => {
                    showWinPopup("Suite complétée!");
                }, 1500);
            } else {
                stopTimer();
            }
        }, 1500);
        return;
    } else {
        guessesRemaining -= 1;
        
        // Pre-fill currentGuess with found letters for next row
        currentGuess = new Array(wordLength).fill(null);
        for (let i = 0; i < wordLength; i++) {
            if (foundLetters[i]) {
                currentGuess[i] = foundLetters[i];
            }
        }
        
        // Find first non-locked position
        nextLetter = 0;
        while (nextLetter < wordLength && foundLetters[nextLetter]) {
            nextLetter++;
        }
        
        if (guessesRemaining === 0) {
            gameActive = false;
            
            // Play lose sound
            soundManager.playLose();
            
            // Record loss in stats
            statsManager.recordLoss(currentMode);
            
            // Mark daily mode as completed (lost)
            if (currentMode === "daily") {
                markDailyAsCompleted(false, 6, allGuesses);
            }
            
            setTimeout(() => {
                showWordPopup(currentWord.toUpperCase());
            }, 1500);
        }
    }
}

// Show word popup
function showWordPopup(word) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 40px 60px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <h2 style="color: #ef4444; font-size: 2rem; margin-bottom: 20px;">😔 Perdu!</h2>
        <p style="color: #666; font-size: 1.2rem; margin-bottom: 15px;">Le mot était:</p>
        <p style="color: #333; font-size: 2.5rem; font-weight: 800; letter-spacing: 3px; margin-bottom: 30px;">${word}</p>
        <button id="closePopup" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        ">Retour au Menu</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    document.getElementById('closePopup').addEventListener('click', () => {
        document.body.removeChild(overlay);
        showScreen("menuScreen");
        resetGame();
    });
}

// Show win popup
function showWinPopup(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 40px 60px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <h2 style="color: #10b981; font-size: 2rem; margin-bottom: 20px;">🎉 ${message}</h2>
        <button id="closeWinPopup" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        ">Retour au Menu</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    document.getElementById('closeWinPopup').addEventListener('click', () => {
        document.body.removeChild(overlay);
        showScreen("menuScreen");
        resetGame();
    });
}

// Animate CSS
const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');
        
        node.classList.add(`${prefix}animated`, animationName);
        
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }
        
        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });

// Keyboard events
document.addEventListener("keyup", (e) => {
    if (!gameActive) return;
    
    const pressedKey = String(e.key).toLowerCase();
    
    if (pressedKey === "backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }
    
    if (pressedKey === "enter") {
        checkGuess();
        return;
    }
    
    const found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

// On-screen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    if (!gameActive) return;
    
    const target = e.target;
    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    
    let key = target.textContent;
    
    if (key === "Del") {
        key = "Backspace";
    }
    
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});

// Party mode handlers
document.getElementById("btnCreateParty").addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value.trim();
    if (!playerName) {
        toastr.error("Entrez votre nom!");
        return;
    }
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("codeDisplay").textContent = code;
    document.getElementById("partyCode").classList.remove("hidden");
    toastr.success("Partie créée! Partagez le code avec vos amis.");
});

document.getElementById("btnCopyCode").addEventListener("click", () => {
    const code = document.getElementById("codeDisplay").textContent;
    navigator.clipboard.writeText(code);
    toastr.success("Code copié!");
});

document.getElementById("btnJoinParty").addEventListener("click", () => {
    const code = document.getElementById("joinCode").value.trim().toUpperCase();
    if (!code) {
        toastr.error("Entrez un code!");
        return;
    }
    toastr.info("Connexion à la partie...");
});

// 1v1 mode handlers
document.getElementById("btnCreateRoom").addEventListener("click", () => {
    toastr.info("Création de la salle...");
});

document.getElementById("btnJoinRoom").addEventListener("click", () => {
    toastr.info("Rejoindre une salle...");
});

document.getElementById("btnRandomMatch").addEventListener("click", () => {
    toastr.info("Recherche d'un adversaire...");
});

console.log("TUSMO CESI - Jeu chargé!");
