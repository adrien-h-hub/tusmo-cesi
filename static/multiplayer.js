// Multiplayer System for TUSMO CESI
// 100% Free - No Database Required

class MultiplayerManager {
    constructor() {
        this.socket = null;
        this.roomCode = null;
        this.playerName = null;
        this.gameMode = null;
        this.isHost = false;
        this.connected = false;
    }

    connect() {
        if (this.connected) return;
        
        // Connect to Socket.IO
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.connected = false;
        });

        // Room events
        this.socket.on('room_created', (data) => {
            this.handleRoomCreated(data);
        });

        this.socket.on('room_joined', (data) => {
            this.handleRoomJoined(data);
        });

        this.socket.on('player_joined', (data) => {
            this.handlePlayerJoined(data);
        });

        this.socket.on('game_started', (data) => {
            this.handleGameStarted(data);
        });

        this.socket.on('opponent_progress', (data) => {
            this.handleOpponentProgress(data);
        });

        this.socket.on('game_ended', (data) => {
            this.handleGameEnded(data);
        });

        this.socket.on('error', (data) => {
            toastr.error(data.message);
        });
    }

    // Create a private room with code
    createRoom(playerName, mode = '1v1') {
        if (!this.connected) this.connect();
        
        this.playerName = playerName;
        this.gameMode = mode;
        this.isHost = true;
        
        this.socket.emit('create_room', {
            playerName: playerName,
            mode: mode
        });
    }

    // Join a room with code
    joinRoom(roomCode, playerName) {
        if (!this.connected) this.connect();
        
        this.roomCode = roomCode;
        this.playerName = playerName;
        this.isHost = false;
        
        this.socket.emit('join_room', {
            roomCode: roomCode,
            playerName: playerName
        });
    }

    // Start the game (host only)
    startGame() {
        if (!this.isHost) return;
        
        this.socket.emit('start_game', {
            roomCode: this.roomCode
        });
    }

    // Send progress update
    sendProgress(attempts, currentRow, foundWord = false) {
        this.socket.emit('progress_update', {
            roomCode: this.roomCode,
            attempts: attempts,
            currentRow: currentRow,
            foundWord: foundWord
        });
    }

    // Send game completion
    sendCompletion(won, attempts, time) {
        this.socket.emit('game_complete', {
            roomCode: this.roomCode,
            won: won,
            attempts: attempts,
            time: time
        });
    }

    // Event Handlers
    handleRoomCreated(data) {
        this.roomCode = data.roomCode;
        if (typeof showRoomCodeModal === 'function') {
            showRoomCodeModal(data.roomCode);
        }
    }

    handleRoomJoined(data) {
        if (typeof showWaitingScreen === 'function') {
            showWaitingScreen(data.players);
        }
    }

    handlePlayerJoined(data) {
        if (typeof updatePlayerList === 'function') {
            updatePlayerList(data.players);
        }
        toastr.success(`${data.playerName} a rejoint la partie!`);
    }

    handleGameStarted(data) {
        if (typeof hideWaitingScreen === 'function') {
            hideWaitingScreen();
        }
        this.startMultiplayerGame(data.word, data.players);
    }

    handleOpponentProgress(data) {
        this.updateOpponentDisplay(data);
    }

    handleGameEnded(data) {
        this.showGameResults(data);
    }
    
    // Start multiplayer game
    startMultiplayerGame(word, players) {
        // Set global variables
        window.currentWord = word.toLowerCase();
        window.wordLength = word.length;
        window.multiplayerMode = true;
        window.opponents = players.filter(p => p.name !== this.playerName);
        
        // Show game screen
        const screens = document.querySelectorAll(".screen");
        screens.forEach(screen => screen.classList.remove("active"));
        document.getElementById("gameScreen").classList.add("active");
        
        // Initialize game if functions exist
        if (typeof initBoard === 'function') {
            initBoard();
        }
        if (typeof startTimer === 'function') {
            startTimer();
        }
        
        window.gameActive = true;
        
        // Create opponent display
        this.createOpponentDisplay();
    }
    
    // Create opponent display
    createOpponentDisplay() {
        const container = document.querySelector('.game-container');
        if (!container) return;
        
        let opponentDiv = document.getElementById('opponentDisplay');
        if (!opponentDiv) {
            opponentDiv = document.createElement('div');
            opponentDiv.id = 'opponentDisplay';
            opponentDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                min-width: 200px;
                z-index: 100;
            `;
            opponentDiv.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 1.2rem;">⚔️ Adversaires</h3>
                <div id="opponentsList"></div>
            `;
            container.appendChild(opponentDiv);
        }
    }
    
    // Update opponent display
    updateOpponentDisplay(data) {
        const list = document.getElementById('opponentsList');
        if (!list) return;
        
        const opponentData = window.opponentsData || {};
        opponentData[data.playerName] = data;
        window.opponentsData = opponentData;
        
        list.innerHTML = Object.values(opponentData).map(opp => `
            <div style="padding: 10px; background: #f0f0f0; border-radius: 10px; margin: 5px 0;">
                <div style="font-weight: 600;">${opp.playerName}</div>
                <div style="font-size: 0.9rem; color: #666;">
                    Essai ${opp.currentRow}/6
                    ${opp.foundWord ? '✅ Trouvé!' : ''}
                </div>
            </div>
        `).join('');
    }
    
    // Show game results
    showGameResults(data) {
        const winner = data.winner;
        const results = data.results;
        
        const modal = document.createElement('div');
        modal.className = 'stats-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="stats-content" style="text-align: center;">
                <h2>${winner.name === this.playerName ? '🎉 Victoire!' : '😢 Défaite'}</h2>
                <div style="margin: 30px 0;">
                    <h3>🏆 Gagnant: ${winner.name}</h3>
                    <p>Temps: ${Math.floor(winner.time / 60)}:${(winner.time % 60).toString().padStart(2, '0')}</p>
                    <p>Essais: ${winner.attempts}/6</p>
                </div>
                <h3>📊 Classement</h3>
                <div style="margin: 20px 0;">
                    ${results.map((r, i) => `
                        <div style="padding: 15px; background: ${i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f0f0f0'}; border-radius: 10px; margin: 10px 0; color: ${i === 0 ? 'white' : 'black'};">
                            <span style="font-size: 1.5rem; font-weight: 800;">${i + 1}.</span>
                            <span style="font-weight: 600; margin-left: 10px;">${r.name}</span>
                            <span style="float: right;">${r.won ? `${r.attempts} essais` : 'Abandonné'}</span>
                        </div>
                    `).join('')}
                </div>
                <button onclick="location.reload()" style="padding: 15px 30px; background: #667eea; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin-top: 20px; font-size: 1.1rem;">
                    Retour au Menu
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
        }
    }
}


// Initialize
const multiplayerManager = new MultiplayerManager();
window.multiplayerManager = multiplayerManager;
