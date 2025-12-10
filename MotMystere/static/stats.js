// Statistics Manager
export class StatsManager {
    constructor() {
        this.stats = this.loadStats();
    }

    loadStats() {
        const saved = localStorage.getItem('tusmo_stats');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
            totalTime: 0,
            lastPlayedDate: null,
            hardModeWins: 0,
            dailyCalendar: {}, // {date: {won: true, attempts: 3, time: 120}}
            history: [] // Last 50 games
        };
    }

    saveStats() {
        localStorage.setItem('tusmo_stats', JSON.stringify(this.stats));
    }

    recordWin(attempts, timeInSeconds, mode, isHardMode = false) {
        this.stats.gamesPlayed++;
        this.stats.gamesWon++;
        this.stats.guessDistribution[attempts]++;
        this.stats.totalTime += timeInSeconds;
        
        // Update streak
        const today = new Date().toDateString();
        if (this.stats.lastPlayedDate === today) {
            // Already played today, don't update streak
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.stats.lastPlayedDate === yesterday.toDateString()) {
                this.stats.currentStreak++;
            } else {
                this.stats.currentStreak = 1;
            }
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
        }
        
        this.stats.lastPlayedDate = today;
        
        if (isHardMode) {
            this.stats.hardModeWins++;
        }
        
        // Record in calendar if daily mode
        if (mode === 'daily') {
            const dateKey = new Date().toISOString().split('T')[0];
            this.stats.dailyCalendar[dateKey] = {
                won: true,
                attempts: attempts,
                time: timeInSeconds
            };
        }
        
        // Add to history
        this.stats.history.unshift({
            date: new Date().toISOString(),
            won: true,
            attempts: attempts,
            time: timeInSeconds,
            mode: mode,
            hardMode: isHardMode
        });
        
        // Keep only last 50 games
        if (this.stats.history.length > 50) {
            this.stats.history = this.stats.history.slice(0, 50);
        }
        
        this.saveStats();
    }

    recordLoss(mode) {
        this.stats.gamesPlayed++;
        
        // Break streak
        this.stats.currentStreak = 0;
        
        const today = new Date().toDateString();
        this.stats.lastPlayedDate = today;
        
        // Record in calendar if daily mode
        if (mode === 'daily') {
            const dateKey = new Date().toISOString().split('T')[0];
            this.stats.dailyCalendar[dateKey] = {
                won: false,
                attempts: 6,
                time: 0
            };
        }
        
        // Add to history
        this.stats.history.unshift({
            date: new Date().toISOString(),
            won: false,
            attempts: 6,
            time: 0,
            mode: mode,
            hardMode: false
        });
        
        if (this.stats.history.length > 50) {
            this.stats.history = this.stats.history.slice(0, 50);
        }
        
        this.saveStats();
    }

    getWinRate() {
        if (this.stats.gamesPlayed === 0) return 0;
        return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
    }

    getAverageAttempts() {
        let total = 0;
        let count = 0;
        for (let attempts in this.stats.guessDistribution) {
            total += parseInt(attempts) * this.stats.guessDistribution[attempts];
            count += this.stats.guessDistribution[attempts];
        }
        return count > 0 ? (total / count).toFixed(1) : 0;
    }

    getAverageTime() {
        if (this.stats.gamesWon === 0) return 0;
        return Math.round(this.stats.totalTime / this.stats.gamesWon);
    }

    getStats() {
        return {
            ...this.stats,
            winRate: this.getWinRate(),
            averageAttempts: this.getAverageAttempts(),
            averageTime: this.getAverageTime()
        };
    }

    reset() {
        localStorage.removeItem('tusmo_stats');
        this.stats = this.loadStats();
    }
}
