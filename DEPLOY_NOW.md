# 🚀 Guide de Déploiement TUSMO CESI

## ✅ Fichiers Prêts pour le Déploiement

Tous les fichiers nécessaires sont déjà créés:
- ✅ `app.py` - Application Flask
- ✅ `requirements.txt` - Dépendances Python
- ✅ `Procfile` - Configuration Heroku/Render
- ✅ `runtime.txt` - Version Python
- ✅ `render.yaml` - Configuration Render
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ Tous les fichiers statiques (JS, CSS, HTML)

## 🎯 Option 1: Déploiement sur Render.com (RECOMMANDÉ - GRATUIT)

### Étape 1: Installer Git (si pas déjà fait)
1. Téléchargez Git: https://git-scm.com/download/win
2. Installez avec les options par défaut
3. Redémarrez votre terminal

### Étape 2: Créer un Repository GitHub
1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nom: `tusmo-cesi`
4. Public ou Private (au choix)
5. Ne cochez RIEN (pas de README, pas de .gitignore)
6. Cliquez "Create repository"

### Étape 3: Pousser le Code sur GitHub

Ouvrez PowerShell dans le dossier du projet et exécutez:

```powershell
cd C:\Users\Dardq\CascadeProjects\MotMystere

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - TUSMO CESI avec stats et animations"

# Ajouter le remote (REMPLACEZ par VOTRE URL GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/tusmo-cesi.git

# Pousser sur GitHub
git branch -M main
git push -u origin main
```

### Étape 4: Déployer sur Render

1. Allez sur https://render.com
2. Créez un compte (gratuit)
3. Cliquez "New +" → "Web Service"
4. Connectez votre repository GitHub
5. Sélectionnez `tusmo-cesi`
6. Configuration:
   - **Name:** `tusmo-cesi`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app`
   - **Plan:** Free
7. Cliquez "Create Web Service"

⏳ **Attendez 5-10 minutes** pour le premier déploiement.

### Étape 5: Votre Site est en Ligne! 🎉

Render vous donnera une URL comme:
```
https://tusmo-cesi.onrender.com
```

## 🎯 Option 2: Déploiement sur Heroku

### Prérequis:
1. Compte Heroku: https://heroku.com
2. Heroku CLI installé: https://devcenter.heroku.com/articles/heroku-cli

### Commandes:

```powershell
cd C:\Users\Dardq\CascadeProjects\MotMystere

# Login Heroku
heroku login

# Créer l'app
heroku create tusmo-cesi

# Pousser le code
git push heroku main

# Ouvrir l'app
heroku open
```

## 🎯 Option 3: Déploiement sur Vercel

### Prérequis:
1. Compte Vercel: https://vercel.com
2. Vercel CLI: `npm install -g vercel`

### Commandes:

```powershell
cd C:\Users\Dardq\CascadeProjects\MotMystere

# Déployer
vercel

# Suivre les instructions
# Choisir les options par défaut
```

## 🎯 Option 4: Déploiement sur PythonAnywhere

### Étapes:
1. Créez un compte sur https://www.pythonanywhere.com (gratuit)
2. Allez dans "Web" → "Add a new web app"
3. Choisissez "Flask" et Python 3.10
4. Uploadez tous vos fichiers via "Files"
5. Configurez le WSGI file pour pointer vers `app.py`
6. Rechargez l'application

## 📊 Fonctionnalités Déployées

Votre jeu inclut maintenant:
- ✅ Statistiques complètes avec LocalStorage
- ✅ Série de victoires (Winstreak) 🔥
- ✅ Mode Difficile 💪
- ✅ Animations (confettis, shake, bounce)
- ✅ Sons optionnels 🔊
- ✅ Distribution pondérée des mots (75% courts, 25% longs)
- ✅ Lettres vertes verrouillées
- ✅ Système d'indices pour mots difficiles
- ✅ 174,072 mots français
- ✅ Interface moderne et responsive

## 🔧 Configuration Post-Déploiement

### Domaines Personnalisés:
Si vous avez `tusmo.online` et `tusmo.site`:

**Sur Render:**
1. Settings → Custom Domains
2. Ajoutez vos domaines
3. Configurez les DNS chez votre registrar:
   ```
   Type: CNAME
   Name: @
   Value: tusmo-cesi.onrender.com
   ```

**Sur Heroku:**
```powershell
heroku domains:add tusmo.online
heroku domains:add tusmo.site
```

## 🐛 Dépannage

### Le site ne charge pas:
- Vérifiez les logs: `heroku logs --tail` (Heroku) ou via le dashboard Render
- Assurez-vous que `PORT` est bien utilisé dans `app.py`

### Erreur de dépendances:
- Vérifiez `requirements.txt`
- Assurez-vous que toutes les versions sont compatibles

### Le jeu ne fonctionne pas:
- Vérifiez la console du navigateur (F12)
- Assurez-vous que tous les fichiers JS sont chargés
- Vérifiez que les modules ES6 sont supportés

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs de déploiement
2. Testez localement d'abord
3. Assurez-vous que Git est installé
4. Vérifiez que tous les fichiers sont commités

## 🎉 Félicitations!

Votre jeu TUSMO CESI est maintenant prêt à être déployé!

**URL de test local:** http://127.0.0.1:5000
**URL de production:** (Sera générée après déploiement)

---

**Créé le:** 10 Décembre 2025
**Version:** 2.0 (avec Stats, Animations, Mode Difficile)
