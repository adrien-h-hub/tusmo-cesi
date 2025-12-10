# 🎯 Limitation du Mode Quotidien

## ✅ Fonctionnalité Implémentée

Le **Mot du Jour** ne peut être joué qu'**une seule fois par jour** jusqu'au reset à midi.

### 🔒 Comment Ça Marche

#### **Vérification Avant de Jouer:**
```javascript
if (mode === "daily" && hasPlayedDailyToday()) {
    toastr.warning("Vous avez déjà joué le mot du jour! Revenez demain à midi.");
    return;
}
```

#### **Marquage Après Victoire ou Défaite:**
```javascript
if (currentMode === "daily") {
    markDailyAsPlayed();
}
```

#### **Stockage Local:**
```javascript
localStorage.setItem('lastDailyPlayed', '2025-12-11-12');
```

### 📊 Système de Seed

Le seed quotidien change à **midi** chaque jour:
```
Format: YYYY-MM-DD-12 ou YYYY-MM-DD-00
Exemple: 2025-12-11-12 (après midi)
         2025-12-11-00 (avant midi)
```

### 🎨 Indicateur Visuel

Quand le mot du jour est déjà joué:
- ✅ Badge "✅ Joué" en haut à droite
- 📝 Texte changé: "Revenez demain à midi!"
- 🔒 Opacité réduite (60%)
- ❌ Clic bloqué avec message d'avertissement

### 🔄 Reset Automatique

Le jeu se réinitialise automatiquement:
- **Avant midi:** Nouveau mot à midi
- **Après midi:** Nouveau mot le lendemain à midi

### 📁 Fichiers Modifiés

```
✅ static/main_game.js
   - hasPlayedDailyToday()
   - markDailyAsPlayed()
   - Vérification au clic
   - Marquage à la victoire/défaite

✅ static/daily_indicator.js (NOUVEAU)
   - Indicateur visuel
   - Badge "Joué"
   - Mise à jour automatique

✅ index_new.html
   - Import du script daily_indicator.js
```

### 🎮 Comportement Utilisateur

#### **Scénario 1: Première Fois Aujourd'hui**
1. Joueur clique "Mot du Jour"
2. Jeu démarre normalement
3. Joueur gagne ou perd
4. Mode marqué comme joué
5. Badge "✅ Joué" apparaît

#### **Scénario 2: Déjà Joué**
1. Joueur clique "Mot du Jour"
2. Message: "Vous avez déjà joué le mot du jour!"
3. Jeu ne démarre pas
4. Badge visible sur la carte

#### **Scénario 3: Nouveau Jour (après midi)**
1. Seed change automatiquement
2. Badge disparaît
3. Joueur peut rejouer
4. Nouveau mot généré

### 💾 Données Stockées

```javascript
localStorage:
  - lastDailyPlayed: "2025-12-11-12"
```

**Pas de serveur nécessaire = 100% Gratuit!**

### 🔧 Avantages

- ✅ **Engagement** - Retour quotidien
- ✅ **Fair Play** - Un essai par jour
- ✅ **Statistiques** - Séries cohérentes
- ✅ **Simple** - Pas de compte requis
- ✅ **Local** - Fonctionne hors ligne

### ⚠️ Limitations

**LocalStorage:**
- Effacer le cache = Reset
- Navigation privée = Pas de sauvegarde
- Différents navigateurs = Différents compteurs

**Mais c'est acceptable pour un jeu gratuit!**

### 🎯 Autres Modes

Les autres modes restent **illimités:**
- ✅ Mode Infini - Jouez autant que vous voulez
- ✅ Suite de 4 - Rejouable à volonté
- ✅ 1v1 - Illimité
- ✅ Mode Partie - Illimité

**Seul le Mot du Jour est limité à 1x/jour!**

### 🚀 Pour Déployer

```powershell
cd C:\Users\Dardq\CascadeProjects\MotMystere

git add .

git commit -m "Add daily mode limit - one play per day"

git push origin main
```

### 🧪 Pour Tester

1. Jouez le mot du jour
2. Gagnez ou perdez
3. Retournez au menu
4. Essayez de rejouer → Bloqué!
5. Badge "✅ Joué" visible

**Pour tester le reset:**
```javascript
// Dans la console du navigateur
localStorage.removeItem('lastDailyPlayed');
location.reload();
```

### 🎉 C'est Prêt!

Le mode quotidien est maintenant limité à une partie par jour avec indicateur visuel!

**Poussez sur GitHub pour déployer!** 🚀
