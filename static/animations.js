// Animation Library

// Confetti animation
export function showConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Create confetti manually
        for (let i = 0; i < particleCount; i++) {
            createConfettiParticle();
        }
    }, 250);
}

function createConfettiParticle() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        z-index: 2000;
        pointer-events: none;
        border-radius: 50%;
    `;
    
    document.body.appendChild(confetti);
    
    const duration = 2000 + Math.random() * 1000;
    const rotation = Math.random() * 360;
    const xMovement = (Math.random() - 0.5) * 200;
    
    confetti.animate([
        { 
            transform: `translateY(0) translateX(0) rotate(0deg)`,
            opacity: 1
        },
        { 
            transform: `translateY(${window.innerHeight + 20}px) translateX(${xMovement}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, duration);
}

// Shake animation for invalid word
export function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Row complete animation (all green)
export function animateRowComplete(row) {
    const boxes = row.children;
    for (let i = 0; i < boxes.length; i++) {
        setTimeout(() => {
            boxes[i].classList.add('bounce');
            setTimeout(() => {
                boxes[i].classList.remove('bounce');
            }, 500);
        }, i * 100);
    }
}

// Sound effects
export class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('sound_enabled') !== 'false';
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        // Create audio contexts for different sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('sound_enabled', this.enabled);
    }

    playClick() {
        if (!this.enabled) return;
        this.playTone(200, 0.05, 'sine');
    }

    playCorrect() {
        if (!this.enabled) return;
        this.playTone(523.25, 0.1, 'sine'); // C5
    }

    playWrong() {
        if (!this.enabled) return;
        this.playTone(196, 0.2, 'sawtooth'); // G3
    }

    playWin() {
        if (!this.enabled) return;
        // Victory melody
        setTimeout(() => this.playTone(523.25, 0.15, 'sine'), 0);    // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 150);  // E5
        setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 300);   // G5
    }

    playLose() {
        if (!this.enabled) return;
        // Sad trombone
        setTimeout(() => this.playTone(392, 0.2, 'sawtooth'), 0);
        setTimeout(() => this.playTone(370, 0.2, 'sawtooth'), 200);
        setTimeout(() => this.playTone(349, 0.4, 'sawtooth'), 400);
    }

    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}

// Streak animation
export function showStreakBadge(streak) {
    const badge = document.createElement('div');
    badge.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 2rem;
        font-weight: 800;
        z-index: 2000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
    `;
    
    badge.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 10px;">🔥</div>
        <div>${streak} Victoires d'affilée!</div>
    `;
    
    document.body.appendChild(badge);
    
    badge.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1, offset: 0.5 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.7 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.9 },
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
    ], {
        duration: 2500,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    setTimeout(() => {
        document.body.removeChild(badge);
    }, 2500);
}
