# 🎯 TUSMO CESI

Un jeu de devinettes de mots en français inspiré de Tusmo et Wordle, avec des fonctionnalités multijoueur en ligne!

## 🎮 Fonctionnalités

- **Mode Solo** - Jouez à l'infini avec des mots aléatoires
- **Mode 1v1** - Affrontez un adversaire en ligne en temps réel
- **Mode 2v2** - Jouez en équipe de 2 contre 2
- **Interface moderne** - Design responsive et animations fluides
- **Clavier virtuel AZERTY** - Adapté pour le français
- **Gratuit et en ligne** - Accessible 24/7

## 🚀 Installation

### Prérequis
- Python 3.8 ou supérieur

### Installation des dépendances

```bash
pip install -r requirements.txt
```

## 🎯 Lancement du jeu

```bash
python app.py
```

Le jeu sera accessible sur `http://localhost:5000`

## 📖 Règles du jeu

1. **Objectif**: Devinez le mot mystère en français en 6 essais maximum
2. **Code couleur**:
   - 🟩 **Vert** - Lettre correcte au bon endroit
   - 🟧 **Orange** - Lettre présente mais mal placée
   - ⬜ **Gris** - Lettre absente du mot

## 🎮 Modes de jeu

### Mode Solo
- Jouez autant de parties que vous voulez
- Un nouveau mot à chaque partie
- Parfait pour s'entraîner

### Mode 1v1
- Affrontez un adversaire en ligne
- Le premier à trouver le mot gagne
- Matchmaking automatique

### Mode 2v2
- Jouez en équipe de 2
- Collaboration en temps réel
- Matchmaking automatique pour 4 joueurs

## 🛠️ Technologies utilisées

- **Backend**: Flask + Flask-SocketIO
- **Frontend**: HTML5, CSS3, JavaScript
- **Communication temps réel**: Socket.IO
- **Design**: CSS moderne avec animations

## 📝 Structure du projet

```
MotMystere/
├── app.py                 # Serveur Flask principal
├── requirements.txt       # Dépendances Python
├── templates/
│   └── index.html        # Interface principale
├── static/
│   ├── style.css         # Styles CSS
│   └── game.js           # Logique du jeu
└── README.md             # Documentation
```

## 🌐 Déploiement

Pour déployer sur un serveur de production, vous pouvez utiliser:
- **Heroku** - Plateforme cloud gratuite
- **PythonAnywhere** - Hébergement Python
- **DigitalOcean** - VPS

### Exemple de déploiement Heroku

1. Créez un fichier `Procfile`:
```
web: python app.py
```

2. Déployez:
```bash
git init
heroku create tusmo-cesi
git add .
git commit -m "Initial commit"
git push heroku main
```

## 🎨 Personnalisation

Vous pouvez facilement personnaliser:
- La liste de mots dans `app.py` (variable `FRENCH_WORDS`)
- Les couleurs dans `static/style.css` (variables CSS)
- Le nombre d'essais maximum (variable `max_attempts`)

## 📱 Responsive Design

Le jeu est entièrement responsive et fonctionne sur:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablette

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est libre d'utilisation pour des fins éducatives.

## 👨‍💻 Auteur

Créé avec ❤️ pour CESI

## 🎯 Améliorations futures

- [ ] Système de classement
- [ ] Statistiques de jeu
- [ ] Plus de mots dans la base de données
- [ ] Thèmes personnalisables
- [ ] Mode tournoi
- [ ] Chat en jeu
- [ ] Replay des parties

---

**Amusez-vous bien! 🎮**
