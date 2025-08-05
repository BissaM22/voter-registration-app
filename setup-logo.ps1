# Script PowerShell pour configurer le logo
# Utilisation: .\setup-logo.ps1

Write-Host "🎨 Configuration du logo pour l'application de vote" -ForegroundColor Cyan
Write-Host ""

# Chemin du logo de destination
$logoDestination = ".\public\logo.png"

# Vérifier si le logo existe déjà
if (Test-Path $logoDestination) {
    Write-Host "✅ Logo déjà présent à: $logoDestination" -ForegroundColor Green
    
    # Afficher les informations du fichier
    $fileInfo = Get-Item $logoDestination
    $fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    Write-Host "📊 Taille: $fileSizeMB MB" -ForegroundColor Yellow
    Write-Host "📅 Modifié: $($fileInfo.LastWriteTime)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Logo non trouvé à: $logoDestination" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Instructions pour ajouter le logo:" -ForegroundColor Yellow
    Write-Host "   1. Sauvegardez votre logo comme 'logo.png'" -ForegroundColor White
    Write-Host "   2. Placez-le dans le dossier 'public\'" -ForegroundColor White
    Write-Host "   3. Le logo doit être au format PNG pour une meilleure qualité" -ForegroundColor White
    Write-Host "   4. Taille recommandée: 120x120 pixels ou plus" -ForegroundColor White
    Write-Host ""
    
    # Créer le dossier public s'il n'existe pas
    if (!(Test-Path ".\public")) {
        New-Item -ItemType Directory -Path ".\public" -Force | Out-Null
        Write-Host "📁 Dossier 'public' créé" -ForegroundColor Green
    }
    
    Write-Host "💡 Après avoir ajouté le logo, relancez ce script pour vérifier" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🚀 Le logo sera visible sur:" -ForegroundColor Cyan
Write-Host "   - Page d'accueil" -ForegroundColor White
Write-Host "   - En-tête de l'application" -ForegroundColor White
Write-Host ""

# Vérifier si les dépendances sont installées
if (Test-Path ".\node_modules") {
    Write-Host "✅ Dépendances npm installées" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dépendances npm non installées" -ForegroundColor Yellow
    Write-Host "   Exécutez: npm install" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 Configuration terminée!" -ForegroundColor Green
