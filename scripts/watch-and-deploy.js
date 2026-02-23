#!/usr/bin/env node

/**
 * File watcher para auto-deployment dinámico
 * Observa cambios en archivos de proyectos y dispara deployment automático
 */

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const WORKSPACE = '/home/alvaro/.openclaw/workspace';
const PROJECT_DIR = path.join(__dirname, '..');

// Archivos a observar para cambios
const WATCH_PATTERNS = [
  `${WORKSPACE}/PROJECTS.md`,
  `${WORKSPACE}/NEW_PROJECTS.md`, 
  `${WORKSPACE}/MEMORY.md`,
  `${WORKSPACE}/PROJECT_STATUS.md`,
  `${WORKSPACE}/memory/*.md`,
  `${WORKSPACE}/*/README.md`, // README de proyectos
];

let deploymentInProgress = false;
let pendingChanges = false;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function triggerDeployment(filePath) {
  if (deploymentInProgress) {
    pendingChanges = true;
    console.log('⏳ Deployment en progreso, cambios pendientes...');
    return;
  }

  deploymentInProgress = true;
  console.log(`\n🔄 Cambio detectado en: ${path.relative(WORKSPACE, filePath)}`);
  
  try {
    console.log('🚀 Iniciando auto-deployment...');
    
    // Ejecutar script de auto-deployment
    execSync('bash ./scripts/auto-deploy.sh', {
      cwd: PROJECT_DIR,
      stdio: 'inherit'
    });
    
    console.log('✅ Auto-deployment completado!');
    
    // Si hay cambios pendientes, programar otro deployment
    if (pendingChanges) {
      pendingChanges = false;
      setTimeout(() => {
        deploymentInProgress = false;
        triggerDeployment('(cambios pendientes)');
      }, 5000);
    } else {
      deploymentInProgress = false;
    }
    
  } catch (error) {
    console.error('❌ Error en auto-deployment:', error.message);
    deploymentInProgress = false;
  }
}

// Debounced deployment (espera 30s antes de ejecutar)
const debouncedDeploy = debounce(triggerDeployment, 30000);

console.log('👀 Iniciando watcher dinámico para proyectos...');
console.log('📁 Observando archivos en:', WORKSPACE);

// Configurar watcher
const watcher = chokidar.watch(WATCH_PATTERNS, {
  ignored: /node_modules|\.git/,
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('change', (filePath) => {
    console.log(`📝 Cambio: ${path.relative(WORKSPACE, filePath)}`);
    debouncedDeploy(filePath);
  })
  .on('add', (filePath) => {
    console.log(`➕ Nuevo: ${path.relative(WORKSPACE, filePath)}`);
    debouncedDeploy(filePath);
  })
  .on('error', error => console.error(`❌ Watcher error: ${error}`))
  .on('ready', () => {
    console.log('✅ File watcher listo');
    console.log('🎯 Dashboard dinámico activado en: https://projects.anayalvaro.com/');
    console.log('\n--- Logs en tiempo real ---');
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando file watcher...');
  watcher.close().then(() => {
    console.log('✅ Watcher cerrado');
    process.exit(0);
  });
});

// Deployment manual con Ctrl+D
process.stdin.setRawMode(true);
process.stdin.on('data', (key) => {
  if (key[0] === 4) { // Ctrl+D
    console.log('\n⚡ Deployment manual iniciado...');
    triggerDeployment('(manual)');
  }
});