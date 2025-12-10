# 🌐 Configuration Domaines - TUSMO

## Vos Domaines
- **tusmo.online** (principal)
- **tusmo.site** (secondaire)

## Configuration DNS

Pour chaque domaine, configurer:
```
Type A: @ → IP de votre serveur
Type A: www → IP de votre serveur
```

## Nginx Configuration

```nginx
# tusmo.online
server {
    listen 80;
    server_name tusmo.online www.tusmo.online;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tusmo.online www.tusmo.online;
    
    ssl_certificate /etc/letsencrypt/live/tusmo.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tusmo.online/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# tusmo.site (redirect to tusmo.online)
server {
    listen 80;
    server_name tusmo.site www.tusmo.site;
    return 301 https://tusmo.online$request_uri;
}
```

## SSL Certificates

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d tusmo.online -d www.tusmo.online
sudo certbot --nginx -d tusmo.site -d www.tusmo.site
```

## Flask App (app.py)

Ajouter redirection optionnelle:
```python
@app.before_request
def redirect_to_main():
    if 'tusmo.site' in request.host:
        return redirect(f'https://tusmo.online{request.path}', 301)
```

## Déploiement Render.com

Dans render.yaml:
```yaml
services:
  - type: web
    name: tusmo
    domains:
      - tusmo.online
      - www.tusmo.online
      - tusmo.site
      - www.tusmo.site
```

Puis ajouter les domaines dans les paramètres Render.

## Vérification

```bash
# Tester DNS
nslookup tusmo.online
nslookup tusmo.site

# Tester HTTPS
curl -I https://tusmo.online
curl -I https://tusmo.site
```
