// Multiplayer UI Event Handlers
// Connects the UI buttons to the multiplayer system

document.addEventListener('DOMContentLoaded', function() {
    // 1v1 Setup Buttons
    const btnCreateRoom = document.getElementById('btnCreateRoom');
    const btnJoinRoom = document.getElementById('btnJoinRoom');
    const btnRandomMatch = document.getElementById('btnRandomMatch');
    
    // Party Setup Buttons
    const btnCreateParty = document.getElementById('btnCreateParty');
    const btnJoinParty = document.getElementById('btnJoinParty');
    
    // Create 1v1 Room
    if (btnCreateRoom) {
        btnCreateRoom.addEventListener('click', function() {
            const playerName = prompt('Entrez votre nom:', 'Joueur');
            if (!playerName) return;
            
            multiplayerManager.connect();
            multiplayerManager.createRoom(playerName, '1v1');
        });
    }
    
    // Join 1v1 Room
    if (btnJoinRoom) {
        btnJoinRoom.addEventListener('click', function() {
            const roomCode = prompt('Entrez le code de la partie:');
            if (!roomCode || roomCode.length !== 6) {
                toastr.error('Code invalide! Le code doit contenir 6 chiffres.');
                return;
            }
            
            const playerName = prompt('Entrez votre nom:', 'Joueur');
            if (!playerName) return;
            
            multiplayerManager.connect();
            multiplayerManager.joinRoom(roomCode, playerName);
        });
    }
    
    // Random Match (disabled for now)
    if (btnRandomMatch) {
        btnRandomMatch.addEventListener('click', function() {
            toastr.info('Matchmaking aléatoire bientôt disponible!');
        });
    }
    
    // Create Party
    if (btnCreateParty) {
        btnCreateParty.addEventListener('click', function() {
            const playerName = document.getElementById('playerName').value.trim();
            if (!playerName) {
                toastr.error('Entrez votre nom!');
                return;
            }
            
            const wordCount = parseInt(document.getElementById('wordCount').value) || 5;
            
            multiplayerManager.connect();
            multiplayerManager.createRoom(playerName, 'party', wordCount);
        });
    }
    
    // Join Party
    if (btnJoinParty) {
        btnJoinParty.addEventListener('click', function() {
            const roomCode = document.getElementById('joinCode').value.trim();
            if (!roomCode || roomCode.length !== 6) {
                toastr.error('Code invalide! Le code doit contenir 6 chiffres.');
                return;
            }
            
            const playerName = document.getElementById('playerName').value.trim();
            if (!playerName) {
                toastr.error('Entrez votre nom!');
                return;
            }
            
            multiplayerManager.connect();
            multiplayerManager.joinRoom(roomCode, playerName);
        });
    }
});

// Helper function to show room code modal (called from multiplayer.js)
function showRoomCodeModal(roomCode) {
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="stats-content" style="text-align: center; max-width: 500px;">
            <h2>🎮 Salle Créée!</h2>
            <p style="margin: 20px 0; font-size: 1.1rem;">Partagez ce code avec votre ami:</p>
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 20px; border-radius: 15px; font-size: 3.5rem; font-weight: 800; letter-spacing: 15px; margin: 30px 0; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
                ${roomCode}
            </div>
            <button onclick="copyRoomCode('${roomCode}')" style="margin: 10px; padding: 15px 40px; background: #10b981; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                📋 Copier le Code
            </button>
            <p style="margin: 30px 0 10px 0; color: #666; font-size: 1rem;">En attente de l'adversaire...</p>
            <div id="playersList" style="margin-top: 20px;"></div>
        </div>
    `;
    document.body.appendChild(modal);
    window.currentRoomModal = modal;
}

// Copy room code to clipboard
function copyRoomCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            toastr.success('Code copié dans le presse-papier!');
        }).catch(() => {
            // Fallback
            const input = document.createElement('input');
            input.value = code;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            toastr.success('Code copié!');
        });
    } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = code;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        toastr.success('Code copié!');
    }
}

// Update player list in waiting room
function updatePlayerList(players) {
    const list = document.getElementById('playersList');
    if (!list) return;
    
    list.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${players.map((p, i) => `
                <div style="padding: 15px; background: ${i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f0f0f0'}; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; color: ${i === 0 ? 'white' : 'black'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">${i === 0 ? '👑' : '👤'}</span>
                        <span style="font-weight: 600;">${p.name}</span>
                        ${p.host ? '<span style="font-size: 0.8rem; opacity: 0.8;">(Hôte)</span>' : ''}
                    </div>
                    <span style="font-size: 1.2rem;">${p.ready ? '✅' : '⏳'}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Hide waiting screen
function hideWaitingScreen() {
    if (window.currentRoomModal) {
        document.body.removeChild(window.currentRoomModal);
        window.currentRoomModal = null;
    }
}

// Show waiting screen (when joining)
function showWaitingScreen(players) {
    showRoomCodeModal('En attente...');
    updatePlayerList(players);
}

// Make functions globally available
window.showRoomCodeModal = showRoomCodeModal;
window.copyRoomCode = copyRoomCode;
window.updatePlayerList = updatePlayerList;
window.hideWaitingScreen = hideWaitingScreen;
window.showWaitingScreen = showWaitingScreen;
