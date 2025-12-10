// Daily Mode Indicator
// Shows if the daily word has been played today

function updateDailyModeIndicator() {
    const dailyCard = document.querySelector('[data-mode="daily"]');
    if (!dailyCard) return;
    
    const hasPlayed = hasPlayedDailyToday();
    
    if (hasPlayed) {
        // Add "Already Played" indicator
        dailyCard.style.opacity = '0.6';
        dailyCard.style.position = 'relative';
        
        // Check if indicator already exists
        if (!dailyCard.querySelector('.daily-played-badge')) {
            const badge = document.createElement('div');
            badge.className = 'daily-played-badge';
            badge.innerHTML = '✅ Joué';
            badge.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            `;
            dailyCard.appendChild(badge);
        }
        
        // Update description
        const description = dailyCard.querySelector('p');
        if (description) {
            description.textContent = 'Revenez demain à midi!';
        }
    } else {
        // Remove indicator if exists
        const badge = dailyCard.querySelector('.daily-played-badge');
        if (badge) {
            badge.remove();
        }
        
        // Reset opacity
        dailyCard.style.opacity = '1';
        
        // Reset description
        const description = dailyCard.querySelector('p');
        if (description) {
            description.textContent = 'Un nouveau mot chaque jour';
        }
    }
}

// Update indicator when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDailyModeIndicator();
    
    // Update every minute to check for midnight reset
    setInterval(updateDailyModeIndicator, 60000);
});

// Export for use in main_game.js
window.updateDailyModeIndicator = updateDailyModeIndicator;
