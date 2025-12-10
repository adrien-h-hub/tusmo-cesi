from flask import Flask, render_template, request, jsonify, session, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
import random
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)

# Domain redirection - Redirect tusmo.site to tusmo.online
@app.before_request
def redirect_to_main_domain():
    """Redirect tusmo.site to tusmo.online (optional)"""
    if request.host in ['tusmo.site', 'www.tusmo.site']:
        return redirect(f'https://tusmo.online{request.path}', code=301)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24).hex())
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Game state storage
games = {}
waiting_rooms = {'1v1': [], '2v2': []}
player_sessions = {}
private_rooms = {}  # Store private game rooms with codes

# French word list - Comprehensive database (5-10 letters)
# Includes all common French words: LOUER, CRANE, JOUER, CHATS, etc.
FRENCH_WORDS = [
    # 5 letters - Verbs
    "AIDER", "AIMER", "ALLER", "AVOIR", "BOIRE", "CRIER", "DIRE", "FAIRE", "JOUER", "LIRE",
    "LOUER", "MENER", "OSER", "PAYER", "PRIER", "RIRE", "TRIER", "VIVRE", "VENIR", "VOIR",
    "AGIR", "FINIR", "PARTIR", "SORTIR", "COURIR", "TENIR", "SENTIR", "SERVIR", "DORMIR",
    "OUVRIR", "OFFRIR", "COUVRIR", "BATTRE", "METTRE", "PEINDRE", "ECRIRE", "SUIVRE", "PLAIRE",
    
    # 5 letters - Nouns
    "CHATS", "CHIEN", "VACHE", "POULE", "LAPIN", "TIGRE", "LION", "OURS", "AIGLE", "SINGE",
    "ARBRE", "FLEUR", "HERBE", "FRUIT", "FORET", "CHAMP", "VALLEE", "MONT", "ROCHE", "PIERRE",
    "TABLE", "CHAISE", "PORTE", "LAMPE", "LIVRE", "STYLO", "PAPIER", "CAHIER", "VERRE", "TASSE",
    "PAIN", "VIANDE", "FROMAGE", "BEURRE", "SUCRE", "HUILE", "SAUCE", "SOUPE", "POMME", "POIRE",
    "TETE", "CORPS", "BRAS", "JAMBE", "MAIN", "PIED", "DOIGT", "BOUCHE", "DENT", "OREILLE",
    "BLANC", "NOIR", "ROUGE", "BLEU", "VERT", "JAUNE", "ROSE", "GRIS", "BRUN", "DORE",
    "GRAND", "PETIT", "GROS", "LONG", "COURT", "HAUT", "JEUNE", "VIEUX", "NEUF", "BEAU",
    "CRANE", "TEMPS", "ANNEE", "JOUR", "HEURE", "PLACE", "MONDE", "AMOUR", "FORCE", "SOLEIL",
    
    # 6 letters - Common words
    "MAISON", "JARDIN", "ECOLE", "EGLISE", "MUSEE", "CINEMA", "CAFE", "HOTEL", "BANQUE", "MARCHE",
    "VOITURE", "CAMION", "TRAIN", "AVION", "BATEAU", "MONTRE", "LIVRE", "JOURNAL", "MAGAZINE",
    "JOUEUR", "LOUEUR", "PAYEUR", "TRIEUR", "CRIEUR", "VENDEUR", "ACHETEUR", "DONNEUR",
    "MANGER", "PARLER", "DONNER", "PORTER", "TOMBER", "TROUVER", "VENDRE", "ACHETER", "CHANTER",
    "CRANES", "ARBRES", "FLEURS", "FRUITS", "CHAMPS", "MONTS", "PIERRES", "TABLES", "CHAISES",
    
    # 7+ letters
    "ACCEPTER", "ACHETER", "AJOUTER", "ARRIVER", "CHANGER", "CHERCHER", "DANSER", "DEMANDER",
    "ENTRER", "FERMER", "GAGNER", "GARDER", "LAISSER", "MARCHER", "MONTER", "MONTRER",
    "PASSER", "PENSER", "PERDRE", "PLEURER", "PRENDRE", "QUITTER", "REGARDER", "RENTRER",
    "RESTER", "SAUTER", "SUIVRE", "TOUCHER", "TOURNER", "TROUVER", "UTILISER"
]

print(f"Loaded {len(FRENCH_WORDS)} French words")
print(f"Words include: LOUER, CRANE, JOUER, CHATS, PAYER, CRIER")

class Game:
    def __init__(self, game_id, mode, players):
        self.game_id = game_id
        self.mode = mode  # 'solo', '1v1', '2v2'
        self.players = players  # List of player IDs
        self.word = random.choice(FRENCH_WORDS)
        self.attempts = {player: [] for player in players}
        self.max_attempts = 6
        self.status = 'active'
        self.winner = None
        self.created_at = datetime.now()
        
    def check_guess(self, player_id, guess):
        guess = guess.upper()
        if len(guess) != len(self.word):
            return {'error': 'Longueur incorrecte'}
        
        result = []
        word_letters = list(self.word)
        guess_letters = list(guess)
        
        # First pass: mark correct positions
        for i in range(len(guess)):
            if guess_letters[i] == word_letters[i]:
                result.append({'letter': guess_letters[i], 'status': 'correct'})
                word_letters[i] = None
                guess_letters[i] = None
            else:
                result.append({'letter': guess_letters[i], 'status': 'unknown'})
        
        # Second pass: mark present letters
        for i in range(len(guess)):
            if guess_letters[i] is not None:
                if guess_letters[i] in word_letters:
                    result[i]['status'] = 'present'
                    word_letters[word_letters.index(guess_letters[i])] = None
                else:
                    result[i]['status'] = 'absent'
        
        self.attempts[player_id].append(result)
        
        # Check win condition
        if guess == self.word:
            self.status = 'finished'
            self.winner = player_id
            return {'result': result, 'won': True, 'word': self.word}
        
        # Check if out of attempts
        if len(self.attempts[player_id]) >= self.max_attempts:
            self.status = 'finished'
            return {'result': result, 'won': False, 'word': self.word}
        
        return {'result': result, 'won': False}

@app.route('/')
def index():
    with open('index_new.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/api/new_game', methods=['POST'])
def new_game():
    data = request.json
    mode = data.get('mode', 'solo')
    player_id = str(uuid.uuid4())
    
    if mode == 'solo':
        game_id = str(uuid.uuid4())
        game = Game(game_id, mode, [player_id])
        games[game_id] = game
        return jsonify({
            'game_id': game_id,
            'player_id': player_id,
            'word_length': len(game.word),
            'max_attempts': game.max_attempts
        })
    
    return jsonify({'error': 'Mode non supporté'}), 400

@app.route('/api/guess', methods=['POST'])
def make_guess():
    data = request.json
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    guess = data.get('guess')
    
    if game_id not in games:
        return jsonify({'error': 'Partie non trouvée'}), 404
    
    game = games[game_id]
    result = game.check_guess(player_id, guess)
    
    return jsonify(result)

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'session_id': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    # Remove from waiting rooms
    for mode in waiting_rooms:
        if request.sid in waiting_rooms[mode]:
            waiting_rooms[mode].remove(request.sid)
    
    # Remove from private rooms
    rooms_to_delete = []
    for code, room_data in private_rooms.items():
        if request.sid == room_data.get('host') or request.sid == room_data.get('guest'):
            rooms_to_delete.append(code)
    
    for code in rooms_to_delete:
        del private_rooms[code]

@socketio.on('join_matchmaking')
def handle_join_matchmaking(data):
    mode = data.get('mode')  # '1v1' or '2v2'
    player_name = data.get('player_name', 'Joueur')
    
    player_sessions[request.sid] = {'name': player_name, 'mode': mode}
    
    if mode == '1v1':
        waiting_rooms['1v1'].append(request.sid)
        
        if len(waiting_rooms['1v1']) >= 2:
            # Create 1v1 game
            player1 = waiting_rooms['1v1'].pop(0)
            player2 = waiting_rooms['1v1'].pop(0)
            
            game_id = str(uuid.uuid4())
            game = Game(game_id, '1v1', [player1, player2])
            games[game_id] = game
            
            # Create room and notify players
            join_room(game_id, sid=player1)
            join_room(game_id, sid=player2)
            
            socketio.emit('game_start', {
                'game_id': game_id,
                'mode': '1v1',
                'word_length': len(game.word),
                'max_attempts': game.max_attempts,
                'opponent': player_sessions[player2]['name']
            }, room=player1)
            
            socketio.emit('game_start', {
                'game_id': game_id,
                'mode': '1v1',
                'word_length': len(game.word),
                'max_attempts': game.max_attempts,
                'opponent': player_sessions[player1]['name']
            }, room=player2)
        else:
            emit('waiting', {'message': 'En attente d\'un adversaire...'})
    
    elif mode == '2v2':
        waiting_rooms['2v2'].append(request.sid)
        
        if len(waiting_rooms['2v2']) >= 4:
            # Create 2v2 game
            players = [waiting_rooms['2v2'].pop(0) for _ in range(4)]
            
            game_id = str(uuid.uuid4())
            game = Game(game_id, '2v2', players)
            games[game_id] = game
            
            # Create room and notify players
            for player in players:
                join_room(game_id, sid=player)
                socketio.emit('game_start', {
                    'game_id': game_id,
                    'mode': '2v2',
                    'word_length': len(game.word),
                    'max_attempts': game.max_attempts,
                    'team': 'Équipe 1' if players.index(player) < 2 else 'Équipe 2'
                }, room=player)
        else:
            emit('waiting', {'message': f'En attente de joueurs... ({len(waiting_rooms["2v2"])}/4)'})

@socketio.on('create_private_room')
def handle_create_private_room(data):
    player_name = data.get('player_name', 'Joueur')
    
    # Generate unique 6-character code
    import string
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    while code in private_rooms:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    player_sessions[request.sid] = {'name': player_name, 'mode': 'private'}
    
    private_rooms[code] = {
        'host': request.sid,
        'host_name': player_name,
        'guest': None,
        'status': 'waiting'
    }
    
    emit('room_created', {
        'code': code,
        'message': f'Salle créée! Code: {code}'
    })

@socketio.on('join_private_room')
def handle_join_private_room(data):
    code = data.get('code', '').upper().strip()
    player_name = data.get('player_name', 'Joueur')
    
    if code not in private_rooms:
        emit('error', {'message': 'Code invalide ou salle introuvable'})
        return
    
    room = private_rooms[code]
    
    if room['status'] != 'waiting':
        emit('error', {'message': 'Cette salle est déjà pleine'})
        return
    
    if request.sid == room['host']:
        emit('error', {'message': 'Vous ne pouvez pas rejoindre votre propre salle'})
        return
    
    player_sessions[request.sid] = {'name': player_name, 'mode': 'private'}
    
    # Update room
    room['guest'] = request.sid
    room['guest_name'] = player_name
    room['status'] = 'full'
    
    # Create game
    game_id = str(uuid.uuid4())
    game = Game(game_id, 'private', [room['host'], room['guest']])
    games[game_id] = game
    
    # Join both players to the game room
    join_room(game_id, sid=room['host'])
    join_room(game_id, sid=room['guest'])
    
    # Notify both players
    socketio.emit('game_start', {
        'game_id': game_id,
        'mode': 'private',
        'word_length': len(game.word),
        'max_attempts': game.max_attempts,
        'opponent': room['guest_name']
    }, room=room['host'])
    
    socketio.emit('game_start', {
        'game_id': game_id,
        'mode': 'private',
        'word_length': len(game.word),
        'max_attempts': game.max_attempts,
        'opponent': room['host_name']
    }, room=room['guest'])

@socketio.on('submit_guess')
def handle_submit_guess(data):
    game_id = data.get('game_id')
    guess = data.get('guess')
    
    if game_id not in games:
        emit('error', {'message': 'Partie non trouvée'})
        return
    
    game = games[game_id]
    result = game.check_guess(request.sid, guess)
    
    # Broadcast to all players in the room
    socketio.emit('guess_result', {
        'player_id': request.sid,
        'player_name': player_sessions.get(request.sid, {}).get('name', 'Joueur'),
        'result': result
    }, room=game_id)
    
    # Check if game is finished
    if game.status == 'finished':
        socketio.emit('game_over', {
            'winner': game.winner,
            'word': game.word
        }, room=game_id)

# Simple Multiplayer System (No Database)
active_rooms = {}  # {roomCode: {players: [], word: '', started: False, results: []}}

def generate_room_code():
    """Generate a 6-digit room code"""
    return str(random.randint(100000, 999999))

@socketio.on('create_room')
def handle_create_room(data):
    """Create a new multiplayer room"""
    room_code = generate_room_code()
    player_name = data.get('playerName', 'Joueur')
    mode = data.get('mode', '1v1')
    
    # Select a random word
    word = random.choice([w for w in FRENCH_WORDS if 5 <= len(w) <= 8])
    
    active_rooms[room_code] = {
        'players': [{
            'sid': request.sid,
            'name': player_name,
            'ready': True,
            'host': True
        }],
        'word': word,
        'started': False,
        'mode': mode,
        'results': []
    }
    
    join_room(room_code)
    emit('room_created', {'roomCode': room_code})

@socketio.on('join_room')
def handle_join_room(data):
    """Join an existing room"""
    room_code = data.get('roomCode')
    player_name = data.get('playerName', 'Joueur')
    
    if room_code not in active_rooms:
        emit('error', {'message': 'Code invalide!'})
        return
    
    room = active_rooms[room_code]
    
    if room['started']:
        emit('error', {'message': 'Partie déjà commencée!'})
        return
    
    if len(room['players']) >= 4:
        emit('error', {'message': 'Salle pleine!'})
        return
    
    room['players'].append({
        'sid': request.sid,
        'name': player_name,
        'ready': True,
        'host': False
    })
    
    join_room(room_code)
    
    # Notify all players
    emit('player_joined', {
        'playerName': player_name,
        'players': room['players']
    }, room=room_code)
    
    # Auto-start if 2 players in 1v1 mode
    if room['mode'] == '1v1' and len(room['players']) == 2:
        room['started'] = True
        emit('game_started', {
            'word': room['word'],
            'players': room['players']
        }, room=room_code)

@socketio.on('start_game')
def handle_start_game(data):
    """Start the game (host only)"""
    room_code = data.get('roomCode')
    
    if room_code not in active_rooms:
        return
    
    room = active_rooms[room_code]
    
    # Check if sender is host
    is_host = any(p['sid'] == request.sid and p['host'] for p in room['players'])
    if not is_host:
        emit('error', {'message': 'Seul l\'hôte peut démarrer!'})
        return
    
    room['started'] = True
    emit('game_started', {
        'word': room['word'],
        'players': room['players']
    }, room=room_code)

@socketio.on('progress_update')
def handle_progress_update(data):
    """Update player progress"""
    room_code = data.get('roomCode')
    
    if room_code not in active_rooms:
        return
    
    # Find player
    player = next((p for p in active_rooms[room_code]['players'] if p['sid'] == request.sid), None)
    if not player:
        return
    
    # Broadcast to others
    emit('opponent_progress', {
        'playerName': player['name'],
        'currentRow': data.get('currentRow'),
        'attempts': data.get('attempts'),
        'foundWord': data.get('foundWord', False)
    }, room=room_code, include_self=False)

@socketio.on('game_complete')
def handle_game_complete(data):
    """Player finished the game"""
    room_code = data.get('roomCode')
    
    if room_code not in active_rooms:
        return
    
    room = active_rooms[room_code]
    player = next((p for p in room['players'] if p['sid'] == request.sid), None)
    if not player:
        return
    
    # Add result
    room['results'].append({
        'name': player['name'],
        'won': data.get('won'),
        'attempts': data.get('attempts'),
        'time': data.get('time')
    })
    
    # Check if all players finished
    if len(room['results']) == len(room['players']):
        # Sort by time (winners first)
        results = sorted(room['results'], key=lambda x: (not x['won'], x['time']))
        winner = results[0]
        
        emit('game_ended', {
            'winner': winner,
            'results': results
        }, room=room_code)
        
        # Clean up room after 30 seconds
        def cleanup():
            if room_code in active_rooms:
                del active_rooms[room_code]
        socketio.start_background_task(lambda: (socketio.sleep(30), cleanup()))

@socketio.on('disconnect')
def handle_disconnect():
    """Handle player disconnect"""
    # Find and remove player from all rooms
    for room_code, room in list(active_rooms.items()):
        room['players'] = [p for p in room['players'] if p['sid'] != request.sid]
        if len(room['players']) == 0:
            del active_rooms[room_code]
        else:
            emit('player_left', room=room_code)

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    socketio.run(app, debug=DEBUG, host='0.0.0.0', port=PORT, allow_unsafe_werkzeug=True)
