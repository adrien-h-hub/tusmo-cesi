# 🌐 Configuration Multi-Domaines - TUSMO

## Vos Domaines Configurés

✅ **tusmo.online** - Domaine principal
✅ **tusmo.site** - Domaine secondaire (redirige vers tusmo.online)

---

## ✅ Configuration Appliquée

### Dans app.py

La redirection automatique a été ajoutée:

```python
@app.before_request
def redirect_to_main_domain():
    """Redirect tusmo.site to tusmo.online"""
    if request.host in ['tusmo.site', 'www.tusmo.site']:
        return redirect(f'https://tusmo.online{request.path}', code=301)
```

**Comportement:**
- Visiteur va sur `tusmo.site` → Redirigé vers `tusmo.online`
- Visiteur va sur `www.tusmo.site` → Redirigé vers `tusmo.online`
- Visiteur va sur `tusmo.online` → Reste sur `tusmo.online`

---

## 📋 Étapes de Déploiement

### 1. Configuration DNS

Pour **tusmo.online**:
```
Type: A
Nom: @
Valeur: [IP de votre serveur]

Type: A
Nom: www
Valeur: [IP de votre serveur]
```

Pour **tusmo.site**:
```
Type: A
Nom: @
Valeur: [IP de votre serveur]

Type: A
Nom: www
Valeur: [IP de votre serveur]
```

### 2. Certificats SSL (Let's Encrypt)

```bash
# Installer Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat pour tusmo.online
sudo certbot --nginx -d tusmo.online -d www.tusmo.online

# Obtenir certificat pour tusmo.site
sudo certbot --nginx -d tusmo.site -d www.tusmo.site

# Vérifier renouvellement automatique
sudo certbot renew --dry-run
```

### 3. Configuration Nginx

Créer `/etc/nginx/sites-available/tusmo`:

```nginx
# tusmo.online - Domaine principal
server {
    listen 80;
    server_name tusmo.online www.tusmo.online;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tusmo.online www.tusmo.online;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/tusmo.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tusmo.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Proxy vers Flask
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket support pour Socket.IO
    location /socket.io {
        proxy_pass http://127.0.0.1:5000/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

# tusmo.site - Redirection vers tusmo.online
server {
    listen 80;
    server_name tusmo.site www.tusmo.site;
    return 301 https://tusmo.online$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tusmo.site www.tusmo.site;
    
    ssl_certificate /etc/letsencrypt/live/tusmo.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tusmo.site/privkey.pem;
    
    return 301 https://tusmo.online$request_uri;
}
```

Activer la configuration:
```bash
sudo ln -s /etc/nginx/sites-available/tusmo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Déploiement sur Render.com

### render.yaml

```yaml
services:
  - type: web
    name: tusmo-game
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn -k eventlet -w 1 -b 0.0.0.0:5000 app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: SECRET_KEY
        generateValue: true
```

### Ajouter Domaines Personnalisés

1. Aller sur Render Dashboard
2. Sélectionner votre service
3. Settings → Custom Domains
4. Ajouter:
   - `tusmo.online`
   - `www.tusmo.online`
   - `tusmo.site`
   - `www.tusmo.site`

5. Configurer DNS selon les instructions Render

---

## 🔧 Déploiement sur Heroku

### Procfile
```
web: gunicorn -k eventlet -w 1 app:app
```

### Ajouter Domaines
```bash
heroku domains:add tusmo.online
heroku domains:add www.tusmo.online
heroku domains:add tusmo.site
heroku domains:add www.tusmo.site
```

### Configuration DNS
Utiliser les DNS targets fournis par Heroku.

---

## 🔧 Déploiement sur VPS (Ubuntu)

### 1. Installer Dépendances
```bash
sudo apt update
sudo apt install python3 python3-pip nginx
```

### 2. Cloner et Installer
```bash
cd /var/www
git clone [votre-repo] tusmo
cd tusmo
pip3 install -r requirements.txt
```

### 3. Service Systemd

Créer `/etc/systemd/system/tusmo.service`:
```ini
[Unit]
Description=TUSMO Game
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/tusmo
Environment="PATH=/usr/bin"
ExecStart=/usr/bin/python3 -m gunicorn -k eventlet -w 1 -b 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Activer:
```bash
sudo systemctl enable tusmo
sudo systemctl start tusmo
sudo systemctl status tusmo
```

---

## ✅ Vérification

### Tester DNS
```bash
nslookup tusmo.online
nslookup tusmo.site
```

### Tester Redirection
```bash
curl -I http://tusmo.site
# Devrait retourner: Location: https://tusmo.online/

curl -I https://tusmo.site
# Devrait retourner: Location: https://tusmo.online/
```

### Tester HTTPS
```bash
curl -I https://tusmo.online
# Devrait retourner: 200 OK

curl -I https://www.tusmo.online
# Devrait retourner: 200 OK
```

---

## 📊 Résumé de la Configuration

### Domaines
```
✅ tusmo.online → Site principal (HTTPS)
✅ www.tusmo.online → Site principal (HTTPS)
✅ tusmo.site → Redirige vers tusmo.online
✅ www.tusmo.site → Redirige vers tusmo.online
```

### Redirections
```
http://tusmo.online → https://tusmo.online
http://www.tusmo.online → https://www.tusmo.online
http://tusmo.site → https://tusmo.online
https://tusmo.site → https://tusmo.online
http://www.tusmo.site → https://tusmo.online
https://www.tusmo.site → https://tusmo.online
```

### Sécurité
```
✅ HTTPS forcé (SSL/TLS)
✅ Certificats Let's Encrypt
✅ Renouvellement automatique
✅ Protocoles modernes (TLS 1.2+)
```

---

## 🎯 Prochaines Étapes

1. **Configurer DNS** pour les deux domaines
2. **Déployer** sur votre plateforme (Render/Heroku/VPS)
3. **Ajouter domaines personnalisés** dans les paramètres
4. **Obtenir certificats SSL** (automatique sur Render/Heroku)
5. **Tester** les redirections et HTTPS

---

**Vos deux domaines sont maintenant configurés! 🎉**

**tusmo.online** = Domaine principal
**tusmo.site** = Redirige automatiquement vers tusmo.online
