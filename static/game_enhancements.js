// Game Enhancements - Stats, Animations, Hard Mode
import { showStatsModal, showSettingsModal } from "./modals.js";

export function initializeEnhancements(gameContext) {
    const { statsManager, soundManager } = gameContext;
    
    // Load hard mode setting
    gameContext.hardMode = localStorage.getItem('hard_mode') === 'true';
    
    // Stats button
    document.getElementById('btnStats').addEventListener('click', () => {
        const stats = statsManager.getStats();
        showStatsModal(stats);
    });
    
    // Settings button
    document.getElementById('btnSettings').addEventListener('click', () => {
        showSettingsModal(gameContext.hardMode, soundManager.enabled);
    });
    
    // Sound button
    document.getElementById('btnSound').addEventListener('click', () => {
        soundManager.toggle();
        const icon = soundManager.enabled ? '🔊' : '🔇';
        document.getElementById('btnSound').textContent = icon;
        if (soundManager.enabled) {
            soundManager.playClick();
        }
        toastr.info(soundManager.enabled ? 'Sons activés' : 'Sons désactivés');
    });
    
    // Update sound button icon on load
    document.getElementById('btnSound').textContent = soundManager.enabled ? '🔊' : '🔇';
}

export function validateHardMode(currentGuess, foundLetters, yellowLetters) {
    // In hard mode, must reuse green letters
    for (let i = 0; i < foundLetters.length; i++) {
        if (foundLetters[i] && currentGuess[i] !== foundLetters[i]) {
            return {
                valid: false,
                message: `La lettre ${foundLetters[i].toUpperCase()} doit être en position ${i + 1}`
            };
        }
    }
    
    // Must reuse yellow letters somewhere
    for (const letter of yellowLetters) {
        if (!currentGuess.includes(letter)) {
            return {
                valid: false,
                message: `Vous devez réutiliser la lettre ${letter.toUpperCase()}`
            };
        }
    }
    
    return { valid: true };
}

// Make functions globally available
window.showStatsModal = showStatsModal;
window.showSettingsModal = showSettingsModal;
window.validateHardMode = validateHardMode;
