# 🚀 TUSMO CESI - Deployment Guide

## Quick Deployment Options

### Option 1: Render (Recommended - FREE) ⭐
**Best for: Free hosting with automatic HTTPS**

### Option 2: Heroku (Easy but Paid)
**Best for: Quick deployment with add-ons**

### Option 3: Vercel (Frontend Focus)
**Best for: Fast static hosting**

### Option 4: PythonAnywhere (Simple)
**Best for: Beginners, free tier available**

---

## 🎯 Option 1: Render (RECOMMENDED)

### Why Render?
- ✅ **100% FREE** tier
- ✅ Automatic HTTPS
- ✅ Easy deployment from GitHub
- ✅ WebSocket support
- ✅ Auto-deploy on git push

### Step-by-Step:

#### 1. Prepare Your Project

Create `requirements.txt`:
```txt
Flask==3.0.0
Flask-SocketIO==5.3.5
python-socketio==5.10.0
gunicorn==21.2.0
```

Create `render.yaml`:
```yaml
services:
  - type: web
    name: tusmo-cesi
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### 2. Push to GitHub
```bash
cd c:/Users/Dardq/CascadeProjects/MotMystere
git init
git add .
git commit -m "Initial commit - TUSMO CESI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tusmo-cesi.git
git push -u origin main
```

#### 3. Deploy on Render
1. Go to https://render.com
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select "tusmo-cesi" repo
6. Render auto-detects settings
7. Click "Create Web Service"
8. Wait 2-3 minutes
9. Your app is live! 🎉

**Your URL**: `https://tusmo-cesi.onrender.com`

---

## 🎯 Option 2: Heroku

### Step-by-Step:

#### 1. Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### 2. Create Required Files

**`Procfile`** (no extension):
```
web: gunicorn --worker-class eventlet -w 1 app:app
```

**`runtime.txt`**:
```
python-3.11.7
```

**`requirements.txt`**:
```txt
Flask==3.0.0
Flask-SocketIO==5.3.5
python-socketio==5.10.0
gunicorn==21.2.0
eventlet==0.33.3
```

#### 3. Deploy Commands
```bash
# Login to Heroku
heroku login

# Create app
heroku create tusmo-cesi

# Push code
git init
git add .
git commit -m "Deploy TUSMO CESI"
git push heroku main

# Open app
heroku open
```

**Your URL**: `https://tusmo-cesi.herokuapp.com`

**Cost**: $5-7/month for hobby tier

---

## 🎯 Option 3: Vercel (Frontend + Serverless)

### Step-by-Step:

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ]
}
```

#### 3. Deploy
```bash
cd c:/Users/Dardq/CascadeProjects/MotMystere
vercel
```

Follow prompts and your app is live!

**Note**: WebSocket features may be limited on Vercel

---

## 🎯 Option 4: PythonAnywhere

### Step-by-Step:

#### 1. Sign Up
Go to https://www.pythonanywhere.com (Free tier available)

#### 2. Upload Files
- Go to "Files" tab
- Upload all your project files
- Or use git clone

#### 3. Create Web App
1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Flask"
4. Python 3.10
5. Set path to your app.py

#### 4. Configure WSGI
Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
```python
import sys
path = '/home/yourusername/MotMystere'
if path not in sys.path:
    sys.path.append(path)

from app import app as application
```

#### 5. Install Requirements
Open Bash console:
```bash
pip install --user Flask Flask-SocketIO python-socketio
```

**Your URL**: `https://yourusername.pythonanywhere.com`

---

## 🔧 Pre-Deployment Checklist

### 1. Update `app.py` for Production

```python
import os

# At the top of app.py
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
PORT = int(os.environ.get('PORT', 5000))

# At the bottom
if __name__ == '__main__':
    socketio.run(app, 
                 debug=DEBUG, 
                 host='0.0.0.0', 
                 port=PORT,
                 allow_unsafe_werkzeug=True)
```

### 2. Create `.gitignore`
```
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.venv
*.log
instance/
.DS_Store
```

### 3. Add Environment Variables
For production, set:
- `DEBUG=False`
- `SECRET_KEY=your-secret-key-here`
- `PORT=5000` (or platform default)

### 4. Test Locally First
```bash
# Install gunicorn
pip install gunicorn eventlet

# Test production server
gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:5000 app:app
```

---

## 📦 Complete Deployment Package

### Files You Need:

```
MotMystere/
├── app.py
├── requirements.txt
├── Procfile (for Heroku)
├── runtime.txt (for Heroku)
├── render.yaml (for Render)
├── vercel.json (for Vercel)
├── .gitignore
├── README.md
├── templates/
│   ├── index.html
│   └── game.html
└── static/
    ├── game_style.css
    ├── multiplayer_styles.css
    ├── enhanced_game.js
    ├── french_words.js
    └── (other files)
```

---

## 🚀 Quick Deploy Script

I'll create all necessary files for you:

### For Render (Recommended):
1. Create GitHub repo
2. Push code
3. Connect to Render
4. Deploy automatically

### For Heroku:
```bash
heroku create tusmo-cesi
git push heroku main
heroku open
```

---

## 🌐 Custom Domain (Optional)

### After Deployment:

#### Render:
1. Go to Settings
2. Add custom domain
3. Update DNS records

#### Heroku:
```bash
heroku domains:add www.tusmo-cesi.com
```

#### Vercel:
1. Go to project settings
2. Add domain
3. Configure DNS

---

## 🔒 Security for Production

### 1. Use Environment Variables
```python
import os
from dotenv import load_dotenv

load_dotenv()

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))
```

### 2. Enable CORS Properly
```python
from flask_cors import CORS

CORS(app, resources={
    r"/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 3. Use HTTPS
All platforms provide free HTTPS automatically!

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)
In `templates/game.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Recommended: Render Deployment

**I recommend Render because:**
1. ✅ Completely FREE
2. ✅ Easiest setup
3. ✅ Auto-deploy from GitHub
4. ✅ Built-in HTTPS
5. ✅ WebSocket support
6. ✅ No credit card required

**Next Steps:**
1. I'll create all deployment files
2. You push to GitHub
3. Connect to Render
4. Your game is live in 5 minutes!

---

## 🆘 Troubleshooting

### Port Issues
```python
PORT = int(os.environ.get('PORT', 5000))
```

### WebSocket Issues
Make sure `eventlet` is installed:
```bash
pip install eventlet
```

### Static Files Not Loading
Check paths in templates:
```html
{{ url_for('static', filename='game.js') }}
```

---

## 📞 Need Help?

Common issues:
1. **Port binding**: Use `0.0.0.0` not `localhost`
2. **Dependencies**: Check `requirements.txt`
3. **Python version**: Use 3.10 or 3.11
4. **WebSockets**: Install `eventlet` or `gevent`

---

**Ready to deploy? Let me know which platform you prefer and I'll create all the files!**
