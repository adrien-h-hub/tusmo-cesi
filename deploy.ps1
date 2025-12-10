# Script de déploiement automatique pour TUSMO CESI
# PowerShell Script

Write-Host "🚀 TUSMO CESI - Script de Déploiement" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé!" -ForegroundColor Red
    Write-Host "📥 Téléchargez Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour ouvrir le site de téléchargement"
    Start-Process "https://git-scm.com/download/win"
    exit
}

Write-Host "✅ Git est installé" -ForegroundColor Green

# Vérifier si c'est déjà un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# Demander l'URL du repository GitHub
Write-Host ""
Write-Host "🔗 Configuration du repository GitHub" -ForegroundColor Cyan
Write-Host "Si vous n'avez pas encore créé de repository:" -ForegroundColor Yellow
Write-Host "1. Allez sur https://github.com" -ForegroundColor Yellow
Write-Host "2. Cliquez 'New repository'" -ForegroundColor Yellow
Write-Host "3. Nom: tusmo-cesi" -ForegroundColor Yellow
Write-Host "4. Ne cochez RIEN" -ForegroundColor Yellow
Write-Host "5. Copiez l'URL du repository" -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ou laissez vide pour skip)"

if ($repoUrl) {
    # Vérifier si le remote existe déjà
    $remoteExists = git remote | Select-String "origin"
    if ($remoteExists) {
        Write-Host "🔄 Mise à jour du remote origin..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    } else {
        Write-Host "➕ Ajout du remote origin..." -ForegroundColor Yellow
        git remote add origin $repoUrl
    }
    Write-Host "✅ Remote configuré" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host ""
Write-Host "📝 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Message de commit (ou Entrée pour message par défaut)"
if (-not $commitMessage) {
    $commitMessage = "Deploy TUSMO CESI - Stats, Animations, Hard Mode"
}
git commit -m $commitMessage

Write-Host "✅ Commit créé" -ForegroundColor Green

# Push vers GitHub
if ($repoUrl) {
    Write-Host ""
    Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
    $branch = git branch --show-current
    if (-not $branch) {
        git branch -M main
        $branch = "main"
    }
    
    try {
        git push -u origin $branch
        Write-Host "✅ Code poussé sur GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Erreur lors du push. Essayez manuellement:" -ForegroundColor Yellow
        Write-Host "git push -u origin $branch" -ForegroundColor Cyan
    }
}

# Instructions pour Render
Write-Host ""
Write-Host "🎯 Prochaines étapes pour déployer sur Render:" -ForegroundColor Cyan
Write-Host "1. Allez sur https://render.com" -ForegroundColor White
Write-Host "2. Créez un compte (gratuit)" -ForegroundColor White
Write-Host "3. Cliquez 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "4. Connectez votre repository GitHub" -ForegroundColor White
Write-Host "5. Sélectionnez 'tusmo-cesi'" -ForegroundColor White
Write-Host "6. Configuration:" -ForegroundColor White
Write-Host "   - Name: tusmo-cesi" -ForegroundColor Gray
Write-Host "   - Environment: Python 3" -ForegroundColor Gray
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start Command: gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:`$PORT app:app" -ForegroundColor Gray
Write-Host "   - Plan: Free" -ForegroundColor Gray
Write-Host "7. Cliquez 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Le déploiement prendra 5-10 minutes" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Votre site sera disponible sur: https://tusmo-cesi.onrender.com" -ForegroundColor Green
Write-Host ""

$openRender = Read-Host "Voulez-vous ouvrir Render.com maintenant? (o/n)"
if ($openRender -eq "o" -or $openRender -eq "O") {
    Start-Process "https://render.com"
}

Write-Host ""
Write-Host "✅ Script terminé!" -ForegroundColor Green
Write-Host "📖 Consultez DEPLOY_NOW.md pour plus de détails" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuyez sur Entrée pour fermer"
