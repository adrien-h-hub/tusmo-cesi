# Script de deploiement simple pour TUSMO CESI

Write-Host "TUSMO CESI - Script de Deploiement" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verifier si Git est installe
try {
    git --version | Out-Null
    Write-Host "Git est installe" -ForegroundColor Green
} catch {
    Write-Host "Git n'est pas installe!" -ForegroundColor Red
    Write-Host "Telechargez Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Start-Process "https://git-scm.com/download/win"
    Read-Host "Appuyez sur Entree pour quitter"
    exit
}

# Verifier si c'est deja un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "Repository initialise" -ForegroundColor Green
} else {
    Write-Host "Repository Git deja initialise" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configuration du repository GitHub" -ForegroundColor Cyan
Write-Host "1. Allez sur https://github.com" -ForegroundColor Yellow
Write-Host "2. Cliquez 'New repository'" -ForegroundColor Yellow
Write-Host "3. Nom: tusmo-cesi" -ForegroundColor Yellow
Write-Host "4. Ne cochez RIEN" -ForegroundColor Yellow
Write-Host "5. Copiez l'URL du repository" -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ou laissez vide)"

if ($repoUrl) {
    $remoteExists = git remote 2>&1 | Select-String "origin"
    if ($remoteExists) {
        Write-Host "Mise a jour du remote origin..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    } else {
        Write-Host "Ajout du remote origin..." -ForegroundColor Yellow
        git remote add origin $repoUrl
    }
    Write-Host "Remote configure" -ForegroundColor Green
}

Write-Host ""
Write-Host "Ajout des fichiers..." -ForegroundColor Yellow
git add .

Write-Host "Creation du commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Message de commit (Entree pour defaut)"
if (-not $commitMessage) {
    $commitMessage = "Deploy TUSMO CESI v2.0"
}
git commit -m $commitMessage

Write-Host "Commit cree" -ForegroundColor Green

if ($repoUrl) {
    Write-Host ""
    Write-Host "Push vers GitHub..." -ForegroundColor Yellow
    $branch = git branch --show-current
    if (-not $branch) {
        git branch -M main
        $branch = "main"
    }
    
    git push -u origin $branch
    Write-Host "Code pousse sur GitHub!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Prochaines etapes pour deployer sur Render:" -ForegroundColor Cyan
Write-Host "1. Allez sur https://render.com" -ForegroundColor White
Write-Host "2. Creez un compte (gratuit)" -ForegroundColor White
Write-Host "3. Cliquez 'New +' -> 'Web Service'" -ForegroundColor White
Write-Host "4. Connectez votre repository GitHub" -ForegroundColor White
Write-Host "5. Selectionnez 'tusmo-cesi'" -ForegroundColor White
Write-Host "6. Configuration:" -ForegroundColor White
Write-Host "   - Name: tusmo-cesi" -ForegroundColor Gray
Write-Host "   - Environment: Python 3" -ForegroundColor Gray
Write-Host "   - Build: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start: gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:`$PORT app:app" -ForegroundColor Gray
Write-Host "   - Plan: Free" -ForegroundColor Gray
Write-Host "7. Cliquez 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "Le deploiement prendra 5-10 minutes" -ForegroundColor Yellow
Write-Host ""
Write-Host "Votre site sera disponible sur: https://tusmo-cesi.onrender.com" -ForegroundColor Green
Write-Host ""

$openRender = Read-Host "Ouvrir Render.com maintenant? (o/n)"
if ($openRender -eq "o") {
    Start-Process "https://render.com"
}

Write-Host ""
Write-Host "Script termine!" -ForegroundColor Green
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer"
