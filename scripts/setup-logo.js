const fs = require('fs');
const path = require('path');

/**
 * Script pour configurer le logo dans l'application
 * 
 * Instructions:
 * 1. Placez votre fichier logo dans le dossier 'assets' de ce script
 * 2. Renommez-le 'logo.png' ou modifiez le nom dans ce script
 * 3. Exécutez: node scripts/setup-logo.js
 */

const LOGO_SOURCE = path.join(__dirname, 'assets', 'logo.png');
const LOGO_DESTINATION = path.join(__dirname, '..', 'public', 'logo.png');

function setupLogo() {
  try {
    // Vérifier si le fichier source existe
    if (!fs.existsSync(LOGO_SOURCE)) {
      console.log('❌ Fichier logo non trouvé à:', LOGO_SOURCE);
      console.log('📝 Instructions:');
      console.log('   1. Créez le dossier: scripts/assets/');
      console.log('   2. Placez votre logo comme: scripts/assets/logo.png');
      console.log('   3. Relancez ce script');
      return;
    }

    // Créer le dossier public s'il n'existe pas
    const publicDir = path.dirname(LOGO_DESTINATION);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Copier le logo
    fs.copyFileSync(LOGO_SOURCE, LOGO_DESTINATION);
    
    console.log('✅ Logo configuré avec succès!');
    console.log('📍 Emplacement:', LOGO_DESTINATION);
    console.log('🎨 Le logo sera visible dans l\'application');
    
    // Vérifier la taille du fichier
    const stats = fs.statSync(LOGO_DESTINATION);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    console.log(`📊 Taille du fichier: ${fileSizeInMB.toFixed(2)} MB`);
    
    if (fileSizeInMB > 1) {
      console.log('⚠️  Attention: Le fichier est volumineux. Considérez l\'optimiser pour de meilleures performances.');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la configuration du logo:', error.message);
  }
}

// Créer le dossier assets s'il n'existe pas
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('📁 Dossier assets créé:', assetsDir);
}

setupLogo();
