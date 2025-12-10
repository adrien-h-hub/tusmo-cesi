# 💾 Sauvegarde Automatique - Game State Persistence

## ✅ Nouvelle Fonctionnalité

Vos parties sont maintenant **sauvegardées automatiquement**! Vous pouvez changer de mode et revenir sans perdre votre progression!

---

## 🎯 Comment Ça Marche

### Sauvegarde Automatique
- ✅ **Après chaque tentative** validée
- ✅ **Toutes les lettres** et leurs couleurs
- ✅ **État du clavier** (lettres vertes/jaunes/grises)
- ✅ **Nombre de tentatives** restantes
- ✅ **Mot en cours** (pour mode infini)
- ✅ **Temps écoulé** (pour mode quotidien)

### Restauration Automatique
- ✅ **Au retour** sur le mode
- ✅ **Même mot** qu'avant
- ✅ **Mêmes tentatives** affichées
- ✅ **Clavier** dans le même état
- ✅ **Progression** intacte

---

## 📊 Scénarios d'Utilisation

### Scénario 1: Mode Quotidien → Mode Infini → Retour
```
1. Mode Quotidien
   - Faire 3 tentatives: MAISO, MALIN, MAINS
   - Tentatives restantes: 3/6

2. Changer vers Mode Infini
   - Jouer quelques mots
   - Terminer des parties

3. Retour au Mode Quotidien
   ✅ Vos 3 tentatives sont là!
   ✅ Le même mot du jour
   ✅ Le clavier dans le même état
   ✅ 3 tentatives restantes
```

### Scénario 2: Mode Infini avec Pause
```
1. Mode Infini
   - Mot: JARDIN
   - Tentatives: JAUNE, JARRE
   - Tentatives restantes: 4/6

2. Fermer le jeu / Changer de mode
   - Aller sur Mode Quotidien
   - Jouer une partie complète

3. Retour au Mode Infini
   ✅ Même mot: JARDIN
   ✅ Vos 2 tentatives affichées
   ✅ 4 tentatives restantes
   ✅ Continuez où vous étiez!
```

### Scénario 3: Interruption Quotidienne
```
1. Matin (10:00) - Mode Quotidien
   - Mot du jour: FLEUR
   - Tentatives: FAIRE, FILER
   - Tentatives restantes: 4/6

2. Pause Déjeuner (12:30)
   - Changer vers Mode Infini
   - Jouer quelques parties

3. Soir (20:00) - Retour Mode Quotidien
   ✅ Même mot: FLEUR (jusqu'à midi demain)
   ✅ Vos 2 tentatives sauvegardées
   ✅ 4 tentatives pour finir
```

---

## 🎮 Modes Supportés

### ✅ Mode Quotidien (Daily)
- **Sauvegarde**: Oui
- **Durée**: 24 heures
- **Condition**: Même mot du jour
- **Restauration**: Automatique si même mot

### ✅ Mode Infini (Infinite)
- **Sauvegarde**: Oui
- **Durée**: 7 jours
- **Condition**: Aucune
- **Restauration**: Automatique avec le mot sauvegardé

### ❌ Mode 1v1
- **Sauvegarde**: Non
- **Raison**: Partie en temps réel
- **Comportement**: Nouvelle partie à chaque fois

### ❌ Mode Party
- **Sauvegarde**: Non
- **Raison**: Session de 10 mots
- **Comportement**: Nouvelle session à chaque fois

---

## 💾 Ce Qui Est Sauvegardé

### Données de Partie
```javascript
{
    word: "MAISON",              // Le mot en cours
    guesses: [                   // Toutes les tentatives
        {
            letters: ["M","A","I","S","O"],
            states: ["correct","correct","absent","present","correct"]
        },
        {
            letters: ["M","A","L","I","N"],
            states: ["correct","correct","absent","present","absent"]
        }
    ],
    guessesRemaining: 4,         // Tentatives restantes
    keyboardState: {             // État du clavier
        "M": "correct",
        "A": "correct",
        "I": "present",
        "S": "present",
        "O": "correct",
        "L": "absent",
        "N": "absent"
    },
    startTime: 1702380000000,    // Temps de début
    timestamp: 1702380500000     // Moment de sauvegarde
}
```

### Stockage
- **LocalStorage** du navigateur
- **Clé**: `gameState_daily` ou `gameState_infinite`
- **Format**: JSON
- **Taille**: ~2-3 KB par partie

---

## ⏰ Durée de Conservation

### Mode Quotidien
- **Durée**: 24 heures
- **Raison**: Mot change chaque jour à midi
- **Nettoyage**: Automatique après 24h
- **Validation**: Vérifie que c'est le même mot

### Mode Infini
- **Durée**: 7 jours
- **Raison**: Permettre de reprendre après plusieurs jours
- **Nettoyage**: Automatique après 7 jours
- **Validation**: Aucune (mot sauvegardé)

---

## 🔄 Cycle de Vie

### 1. Début de Partie
```
Vérifier si sauvegarde existe
  ↓
Si oui: Vérifier validité
  ↓
Si valide: Restaurer état
  ↓
Sinon: Nouvelle partie
```

### 2. Pendant la Partie
```
Chaque tentative validée
  ↓
Sauvegarder état complet
  ↓
Continuer le jeu
```

### 3. Fin de Partie
```
Victoire ou Défaite
  ↓
Effacer sauvegarde
  ↓
Afficher résultats
```

### 4. Changement de Mode
```
Sauvegarder mode actuel
  ↓
Charger nouveau mode
  ↓
Restaurer si sauvegarde existe
```

---

## 🎨 Expérience Utilisateur

### Transparence
- ✅ **Automatique**: Aucune action requise
- ✅ **Invisible**: Pas de bouton "Sauvegarder"
- ✅ **Instantané**: Sauvegarde immédiate
- ✅ **Fiable**: Toujours disponible

### Feedback Visuel
- **Console**: Message "Game state restored for [mode]"
- **Grille**: Tentatives affichées avec couleurs
- **Clavier**: Lettres colorées correctement
- **Compteur**: Tentatives restantes exactes

---

## 🔧 Détails Techniques

### Fonction de Sauvegarde
```javascript
function saveGameState() {
    // Ne pas sauvegarder party/multiplayer
    if (partyMode.active || multiplayerState.active) return;
    
    // Récupérer toutes les tentatives
    // Récupérer état du clavier
    // Créer objet de sauvegarde
    // Stocker dans localStorage
}
```

### Fonction de Chargement
```javascript
function loadGameState(mode) {
    // Charger depuis localStorage
    // Vérifier validité (âge)
    // Retourner état ou null
}
```

### Fonction de Restauration
```javascript
function restoreGameState(state) {
    // Restaurer le mot
    // Restaurer les tentatives
    // Restaurer le clavier
    // Restaurer le timer
    // Mettre à jour l'affichage
}
```

---

## 📱 Exemples Pratiques

### Exemple 1: Interruption Rapide
```
10:30 - Mode Quotidien
  ├─ Tentative 1: MAISO ❌
  ├─ Tentative 2: MALIN ❌
  └─ [SAUVEGARDE]

10:35 - Mode Infini (5 min)
  └─ Jouer quelques parties

10:40 - Retour Mode Quotidien
  ├─ [RESTAURATION]
  ├─ Tentative 1: MAISO ✅ (affichée)
  ├─ Tentative 2: MALIN ✅ (affichée)
  └─ Continuer avec tentative 3
```

### Exemple 2: Pause Longue
```
Lundi 12:00 - Mode Quotidien
  ├─ Mot: FLEUR
  ├─ Tentatives: 3/6
  └─ [SAUVEGARDE]

Lundi 20:00 - Retour
  ├─ [RESTAURATION]
  ├─ Même mot: FLEUR ✅
  └─ Continuer les 3 tentatives

Mardi 08:00 - Retour
  ├─ [RESTAURATION]
  ├─ Même mot: FLEUR ✅ (jusqu'à midi)
  └─ Finir la partie

Mardi 13:00 - Retour
  ├─ [NOUVEAU MOT] ✨
  └─ Sauvegarde effacée (nouveau jour)
```

### Exemple 3: Mode Infini
```
Lundi - Mode Infini
  ├─ Mot: JARDIN
  ├─ Tentatives: 2/6
  └─ [SAUVEGARDE]

Mercredi - Retour
  ├─ [RESTAURATION] ✅
  ├─ Même mot: JARDIN
  └─ Continuer où vous étiez

Lundi suivant - Retour
  ├─ [RESTAURATION] ✅ (encore valide)
  └─ Même mot: JARDIN

8 jours plus tard
  └─ [NOUVELLE PARTIE] (sauvegarde expirée)
```

---

## 🎯 Avantages

### Pour les Joueurs
- ✅ **Flexibilité**: Changer de mode sans perte
- ✅ **Pause**: Revenir plus tard
- ✅ **Exploration**: Tester tous les modes
- ✅ **Confort**: Pas de stress de perdre

### Pour l'Engagement
- ✅ **Rétention**: Joueurs reviennent
- ✅ **Exploration**: Plus de modes testés
- ✅ **Satisfaction**: Meilleure expérience
- ✅ **Fidélité**: Moins de frustration

---

## 🔒 Sécurité et Confidentialité

### Stockage Local
- **Emplacement**: Navigateur uniquement
- **Accès**: Vous seul
- **Durée**: Temporaire (max 7 jours)
- **Suppression**: Automatique ou manuelle

### Données Stockées
- ✅ Lettres et couleurs
- ✅ État du jeu
- ❌ Pas de données personnelles
- ❌ Pas d'envoi au serveur

---

## 🧹 Nettoyage Automatique

### Quand?
1. **Partie terminée** (victoire/défaite)
2. **Sauvegarde expirée** (24h ou 7j)
3. **Nouveau mot** (mode quotidien)
4. **Cache navigateur** vidé

### Comment?
```javascript
// Effacement manuel
clearGameState('daily');
clearGameState('infinite');

// Effacement automatique
localStorage.removeItem('gameState_daily');
localStorage.removeItem('gameState_infinite');
```

---

## 📊 Statistiques

### Taux de Restauration Attendu
- **Mode Quotidien**: ~60% (interruptions fréquentes)
- **Mode Infini**: ~40% (parties plus courtes)

### Bénéfices Mesurables
- ✅ Moins d'abandons de partie
- ✅ Plus de modes explorés
- ✅ Meilleur taux de complétion
- ✅ Sessions plus longues

---

## ✨ Résumé

✅ **Sauvegarde automatique** après chaque tentative  
✅ **Restauration automatique** au retour  
✅ **Mode Quotidien**: 24h de conservation  
✅ **Mode Infini**: 7 jours de conservation  
✅ **Tentatives + Clavier** sauvegardés  
✅ **Transparent** pour l'utilisateur  
✅ **Fiable** et sécurisé  
✅ **Pas de perte** de progression  

---

**Testez maintenant: Faites 3 tentatives, changez de mode, et revenez! 🎯**

URL: `http://127.0.0.1:5000/game`
