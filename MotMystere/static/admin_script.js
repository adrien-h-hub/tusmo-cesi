// Admin Dashboard JavaScript

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDashboardData();
    initEventListeners();
    populateTables();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Update header title
            const titles = {
                'dashboard': 'Dashboard',
                'users': 'Gestion des Utilisateurs',
                'games': 'Historique des Parties',
                'words': 'Gestion des Mots',
                'leaderboard': 'Classement',
                'analytics': 'Analytiques',
                'settings': 'Paramètres'
            };
            document.getElementById('section-title').textContent = titles[sectionId];
        });
    });
}

function loadDashboardData() {
    // Simulate loading dashboard stats
    updateStats({
        totalUsers: 1234,
        totalGames: 45678,
        activeUsers: 342,
        avgScore: 856
    });
    
    loadRecentActivity();
}

function updateStats(data) {
    document.getElementById('total-users').textContent = data.totalUsers.toLocaleString();
    document.getElementById('total-games').textContent = data.totalGames.toLocaleString();
    document.getElementById('active-users').textContent = data.activeUsers.toLocaleString();
    document.getElementById('avg-score').textContent = data.avgScore.toLocaleString();
}

function loadRecentActivity() {
    const activities = [
        { icon: '🎮', text: 'Nouveau record établi par Champion', time: 'Il y a 2 minutes' },
        { icon: '👤', text: '5 nouveaux utilisateurs inscrits', time: 'Il y a 15 minutes' },
        { icon: '🏆', text: 'Party Mode complété en 8:45', time: 'Il y a 30 minutes' },
        { icon: '⚔️', text: 'Match 1v1: Player1 vs Player2', time: 'Il y a 1 heure' },
        { icon: '📊', text: '1000 parties jouées aujourd\'hui', time: 'Il y a 2 heures' }
    ];
    
    const activityList = document.getElementById('recent-activity');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        </div>
    `).join('');
}

function populateTables() {
    populateUsersTable();
    populateGamesTable();
    populateWordsTable();
    populateLeaderboardTable();
}

function populateUsersTable() {
    const users = [
        { id: 1, name: 'Champion', email: 'champion@example.com', games: 234, score: 45678, date: '2024-01-15', status: 'active' },
        { id: 2, name: 'Player2', email: 'player2@example.com', games: 189, score: 38920, date: '2024-02-03', status: 'active' },
        { id: 3, name: 'Player3', email: 'player3@example.com', games: 156, score: 32450, date: '2024-02-10', status: 'inactive' },
        { id: 4, name: 'Player4', email: 'player4@example.com', games: 142, score: 29870, date: '2024-02-15', status: 'active' },
        { id: 5, name: 'Player5', email: 'player5@example.com', games: 128, score: 26540, date: '2024-03-01', status: 'active' }
    ];
    
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.games}</td>
            <td>${user.score.toLocaleString()}</td>
            <td>${user.date}</td>
            <td><span class="status-badge status-${user.status}">${user.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
            <td>
                <button class="action-btn" onclick="editUser(${user.id})">✏️</button>
                <button class="action-btn" onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function populateGamesTable() {
    const games = [
        { id: 'G001', mode: 'Daily', player: 'Champion', word: 'MAISON', score: 1420, attempts: 2, time: '00:45', date: '2024-12-10 14:30' },
        { id: 'G002', mode: '1v1', player: 'Player2 vs Player3', word: 'JARDIN', score: 1180, attempts: 3, time: '01:12', date: '2024-12-10 14:25' },
        { id: 'G003', mode: 'Party', player: 'Player4', word: 'Multiple', score: 8450, attempts: '-', time: '12:34', date: '2024-12-10 14:20' },
        { id: 'G004', mode: 'Infinite', player: 'Player5', word: 'SOLEIL', score: 980, attempts: 4, time: '01:45', date: '2024-12-10 14:15' },
        { id: 'G005', mode: 'Daily', player: 'Player1', word: 'MAISON', score: 1350, attempts: 2, time: '00:52', date: '2024-12-10 14:10' }
    ];
    
    const tbody = document.getElementById('games-table-body');
    tbody.innerHTML = games.map(game => `
        <tr>
            <td>${game.id}</td>
            <td><span class="status-badge">${game.mode}</span></td>
            <td>${game.player}</td>
            <td>${game.word}</td>
            <td>${game.score.toLocaleString()}</td>
            <td>${game.attempts}</td>
            <td>${game.time}</td>
            <td>${game.date}</td>
        </tr>
    `).join('');
}

function populateWordsTable() {
    const words = [
        { word: 'MAISON', length: 6, used: 1234, success: 67, difficulty: 'Facile' },
        { word: 'JARDIN', length: 6, used: 987, success: 54, difficulty: 'Moyen' },
        { word: 'SOLEIL', length: 6, used: 856, success: 48, difficulty: 'Moyen' },
        { word: 'PYTHON', length: 6, used: 723, success: 42, difficulty: 'Difficile' },
        { word: 'FLEURS', length: 6, used: 645, success: 71, difficulty: 'Facile' }
    ];
    
    const tbody = document.getElementById('words-table-body');
    tbody.innerHTML = words.map(word => `
        <tr>
            <td><strong>${word.word}</strong></td>
            <td>${word.length}</td>
            <td>${word.used.toLocaleString()}</td>
            <td>${word.success}%</td>
            <td><span class="status-badge">${word.difficulty}</span></td>
            <td>
                <button class="action-btn" onclick="editWord('${word.word}')">✏️</button>
                <button class="action-btn" onclick="deleteWord('${word.word}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function populateLeaderboardTable() {
    const players = [
        { rank: 4, name: 'Player4', games: 142, wins: 98, score: 29870, avg: 210, streak: 5 },
        { rank: 5, name: 'Player5', games: 128, wins: 87, score: 26540, avg: 207, streak: 3 },
        { rank: 6, name: 'Player6', games: 115, wins: 76, score: 23450, avg: 204, streak: 2 },
        { rank: 7, name: 'Player7', games: 98, wins: 65, score: 20120, avg: 205, streak: 1 },
        { rank: 8, name: 'Player8', games: 87, wins: 54, score: 18760, avg: 216, streak: 4 }
    ];
    
    const tbody = document.getElementById('leaderboard-table-body');
    tbody.innerHTML = players.map(player => `
        <tr>
            <td><strong>#${player.rank}</strong></td>
            <td>${player.name}</td>
            <td>${player.games}</td>
            <td>${player.wins}</td>
            <td>${player.score.toLocaleString()}</td>
            <td>${player.avg}</td>
            <td>🔥 ${player.streak}</td>
        </tr>
    `).join('');
}

function initEventListeners() {
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        showToast('Données actualisées', 'success');
        loadDashboardData();
        populateTables();
    });
    
    // Add user button
    document.getElementById('add-user-btn').addEventListener('click', () => {
        document.getElementById('user-modal').classList.add('active');
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            window.location.href = '/game';
        }
    });
    
    // Search functionality
    document.getElementById('user-search').addEventListener('input', (e) => {
        filterTable('users-table-body', e.target.value);
    });
    
    document.getElementById('word-search').addEventListener('input', (e) => {
        filterTable('words-table-body', e.target.value);
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast(`Affichage du classement ${btn.textContent}`, 'info');
        });
    });
    
    // Export buttons
    document.getElementById('export-users-btn').addEventListener('click', () => {
        exportToCSV('users');
    });
    
    document.getElementById('export-games-btn').addEventListener('click', () => {
        exportToCSV('games');
    });
}

function filterTable(tableId, searchTerm) {
    const tbody = document.getElementById(tableId);
    const rows = tbody.getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    }
}

function editUser(id) {
    showToast(`Édition de l'utilisateur #${id}`, 'info');
    document.getElementById('user-modal').classList.add('active');
}

function deleteUser(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
        showToast(`Utilisateur #${id} supprimé`, 'success');
        populateUsersTable();
    }
}

function editWord(word) {
    showToast(`Édition du mot "${word}"`, 'info');
}

function deleteWord(word) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le mot "${word}"?`)) {
        showToast(`Mot "${word}" supprimé`, 'success');
        populateWordsTable();
    }
}

function exportToCSV(type) {
    showToast(`Export ${type} en cours...`, 'info');
    setTimeout(() => {
        showToast(`Export ${type} terminé!`, 'success');
    }, 1000);
}

function showToast(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
