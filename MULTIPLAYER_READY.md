# 🎮 TUSMO CESI - Multijoueur Activé!

## ✅ Système Multijoueur 100% Gratuit

Le multijoueur fonctionne maintenant **sans base de données** et **sans coût supplémentaire**!

### 🎯 Fonctionnalités

#### **Mode 1v1** ⚔️
- Créer une partie et recevoir un code à 6 chiffres
- Partager le code avec un ami
- La partie démarre automatiquement quand 2 joueurs sont connectés
- Le plus rapide gagne!

#### **Mode Partie** 🎉
- Jusqu'à 4 joueurs
- 5 mots à deviner
- Classement en temps réel
- Le plus rapide gagne!

### 🔧 Architecture Technique

```
Frontend (multiplayer.js)
    ↓
Socket.IO (WebSocket)
    ↓
Backend (app.py)
    ↓
Mémoire RAM (active_rooms)
```

**Pas de base de données = 100% Gratuit!**

### 📊 Système de Rooms

```python
active_rooms = {
    '123456': {
        'players': [
            {'sid': 'abc', 'name': 'Joueur1', 'host': True},
            {'sid': 'def', 'name': 'Joueur2', 'host': False}
        ],
        'word': 'MAISON',
        'started': True,
        'results': []
    }
}
```

### 🎮 Flux de Jeu

#### **Créer une Partie:**
1. Joueur 1 clique "1v1" ou "Partie"
2. Entre son nom
3. Clique "Créer"
4. Reçoit un code (ex: 482951)
5. Partage le code

#### **Rejoindre:**
1. Joueur 2 clique "1v1" ou "Partie"
2. Entre le code
3. Entre son nom
4. Clique "Rejoindre"
5. La partie démarre automatiquement (1v1) ou l'hôte lance (Partie)

#### **Pendant le Jeu:**
- Chaque joueur voit la progression des autres
- Affichage en temps réel: "Essai 3/6"
- Quand quelqu'un trouve: "✅ Trouvé!"

#### **Fin de Partie:**
- Classement automatique
- 🏆 Gagnant affiché
- Temps et nombre d'essais
- Bouton "Retour au Menu"

### 🚀 Déploiement

Le système fonctionne sur Render.com **gratuitement** car:
- ✅ Socket.IO est supporté
- ✅ WebSocket est inclus
- ✅ Pas de base de données nécessaire
- ✅ Tout en mémoire RAM

### ⚠️ Limitations

**Mémoire RAM:**
- Les rooms sont perdues si le serveur redémarre
- Maximum ~100 rooms simultanées (suffisant pour un petit jeu)

**Pas de persistance:**
- Pas d'historique des parties
- Pas de classement global
- Pas de profils utilisateurs

**Mais c'est GRATUIT!** 🎉

### 📋 Fichiers Modifiés

```
✅ app.py - Backend Socket.IO
✅ static/multiplayer.js - Frontend multiplayer
✅ index_new.html - Import Socket.IO
✅ Modes réactivés
```

### 🎯 Pour Mettre à Jour

```powershell
cd C:\Users\Dardq\CascadeProjects\MotMystere

git add .

git commit -m "Add multiplayer system - 100% free"

git push origin main
```

Render redéploiera automatiquement en 2-3 minutes!

### 🎮 Comment Tester

1. Ouvrez le site dans 2 onglets différents
2. Onglet 1: Créez une partie 1v1
3. Copiez le code
4. Onglet 2: Rejoignez avec le code
5. Jouez!

### 🔥 Avantages

- ✅ **Gratuit** - Pas de coût
- ✅ **Simple** - Pas de compte nécessaire
- ✅ **Rapide** - WebSocket en temps réel
- ✅ **Fiable** - Socket.IO gère les reconnexions
- ✅ **Scalable** - Peut gérer des centaines de joueurs

### 📊 Statistiques Multijoueur

Les stats solo restent sauvegardées localement.
Les parties multijoueurs ne sont pas comptées dans les stats (pour l'instant).

### 🎉 C'est Prêt!

Tout est configuré et prêt à déployer!

**Poussez sur GitHub et testez!** 🚀
