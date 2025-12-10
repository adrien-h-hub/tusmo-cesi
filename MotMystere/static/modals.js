// Modal Functions

export function showStatsModal(stats) {
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
    modal.id = 'statsModal';
    
    const maxCount = Math.max(...Object.values(stats.guessDistribution));
    
    modal.innerHTML = `
        <div class="stats-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">📊 Statistiques</h2>
                <button class="icon-btn" id="closeStats" style="background: #f0f0f0; color: #333;">✕</button>
            </div>
            
            ${stats.currentStreak > 0 ? `
            <div class="streak-display">
                <div class="streak-icon">🔥</div>
                <div class="streak-number">${stats.currentStreak}</div>
                <div>Série Actuelle</div>
                ${stats.maxStreak > stats.currentStreak ? `<div style="font-size: 0.9rem; margin-top: 5px;">Record: ${stats.maxStreak}</div>` : ''}
            </div>
            ` : ''}
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.gamesPlayed}</div>
                    <div class="stat-label">Parties</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.winRate}%</div>
                    <div class="stat-label">Victoires</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.averageAttempts}</div>
                    <div class="stat-label">Moy. Essais</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.floor(stats.averageTime / 60)}:${(stats.averageTime % 60).toString().padStart(2, '0')}</div>
                    <div class="stat-label">Temps Moy.</div>
                </div>
                ${stats.hardModeWins > 0 ? `
                <div class="stat-card">
                    <div class="stat-value">${stats.hardModeWins}</div>
                    <div class="stat-label">Mode Difficile 💪</div>
                </div>
                ` : ''}
            </div>
            
            <div class="distribution-chart">
                <h3 style="margin-bottom: 20px;">Distribution des Tentatives</h3>
                ${[1, 2, 3, 4, 5, 6].map(num => {
                    const count = stats.guessDistribution[num] || 0;
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return `
                        <div class="distribution-row">
                            <div class="distribution-label">${num}</div>
                            <div class="distribution-bar" style="width: ${Math.max(percentage, 5)}%">
                                ${count}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-secondary" id="resetStats" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                    Réinitialiser les Statistiques
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeStats').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.getElementById('resetStats').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques?')) {
            statsManager.reset();
            document.body.removeChild(modal);
            toastr.success('Statistiques réinitialisées!');
        }
    });
}

export function showSettingsModal(hardMode, soundEnabled) {
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
    modal.id = 'settingsModal';
    
    modal.innerHTML = `
        <div class="stats-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="margin: 0;">⚙️ Paramètres</h2>
                <button class="icon-btn" id="closeSettings" style="background: #f0f0f0; color: #333;">✕</button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f0f0f0; border-radius: 15px;">
                    <div>
                        <h3 style="margin: 0; margin-bottom: 5px;">Mode Difficile 💪</h3>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Les lettres vertes/jaunes doivent être réutilisées</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hardModeToggle" ${hardMode ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f0f0f0; border-radius: 15px;">
                    <div>
                        <h3 style="margin: 0; margin-bottom: 5px;">Sons 🔊</h3>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Effets sonores du jeu</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="soundToggle" ${soundEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div style="padding: 20px; background: #e8f4fd; border-radius: 15px; border-left: 4px solid #667eea;">
                    <h3 style="margin: 0; margin-bottom: 10px;">ℹ️ Comment Jouer</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #666;">
                        <li>Devinez le mot en 6 essais</li>
                        <li>🟩 Vert = Lettre correcte à la bonne place</li>
                        <li>🟨 Jaune = Lettre correcte mais mal placée</li>
                        <li>⬜ Gris = Lettre absente du mot</li>
                        <li>Les lettres vertes sont verrouillées dans les lignes suivantes</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Toggle handlers
    document.getElementById('hardModeToggle').addEventListener('change', (e) => {
        window.hardMode = e.target.checked;
        localStorage.setItem('hard_mode', e.target.checked);
        toastr.info(e.target.checked ? 'Mode Difficile activé 💪' : 'Mode Difficile désactivé');
    });
    
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        window.soundManager.enabled = e.target.checked;
        localStorage.setItem('sound_enabled', e.target.checked);
        if (e.target.checked) {
            window.soundManager.playClick();
        }
    });
}
