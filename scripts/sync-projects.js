#!/usr/bin/env node

/**
 * Script de sincronización automática de proyectos
 * Lee archivos MD del workspace y actualiza projects-data.json
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/home/alvaro/.openclaw/workspace';
const DATA_FILE = path.join(__dirname, '../data/projects-data.json');

// Mapeo de archivos a proyectos
const PROJECT_SOURCES = {
  'PROJECTS.md': ['sierra-nevada', 'auto-income', 'boatcheckpro', 'rapid-cooling'],
  'NEW_PROJECTS.md': ['wikipedia', 'toros-morante', 'linkedin-beco-ia', 'libros'],
  'MEMORY.md': ['phone-language-bot', 'paella-burner'], 
  'memory/2026-02-22.md': ['instagram-motivation', 'disneyland-paris']
};

function extractProjectStatus(content, projectId) {
  // Detectar status basado en contenido
  const progressPatterns = {
    completed: /✅|completado|Done|finalizado/i,
    active: /🟢|activo|funcionando|production/i,
    progress: /🟡|en progreso|MVP|desarrollo/i,
    research: /🔵|investigación|research|análisis/i
  };

  for (const [status, pattern] of Object.entries(progressPatterns)) {
    if (pattern.test(content)) {
      return status;
    }
  }
  return 'progress'; // default
}

function extractProgress(content, projectId) {
  // Buscar porcentajes explícitos
  const percentMatch = content.match(new RegExp(`${projectId}.*?(\d+)%`, 'is'));
  if (percentMatch) return parseInt(percentMatch[1]);

  // Detectar progreso por keywords
  if (/completado|finalizado|done/i.test(content)) return 100;
  if (/MVP|beta|testing/i.test(content)) return 70;
  if (/desarrollo|progreso/i.test(content)) return 50;
  if (/iniciando|planning/i.test(content)) return 20;
  
  return 50; // default medio
}

function syncProjects() {
  console.log('🔄 Sincronizando proyectos...');
  
  try {
    // Leer datos actuales
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // Crear mapa de proyectos por ID para fácil actualización
    const projectsMap = {};
    currentData.projects.forEach(p => {
      projectsMap[p.id] = p;
    });

    // Leer archivos fuente y actualizar
    for (const [file, projectIds] of Object.entries(PROJECT_SOURCES)) {
      const filePath = path.join(WORKSPACE, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        projectIds.forEach(projectId => {
          if (projectsMap[projectId]) {
            // Actualizar datos dinámicos
            projectsMap[projectId].status = extractProjectStatus(content, projectId);
            projectsMap[projectId].progress = extractProgress(content, projectId);
            projectsMap[projectId].lastUpdated = '0 días'; // Recién actualizado
            
            console.log(`✅ Actualizado ${projectId}: ${projectsMap[projectId].status} (${projectsMap[projectId].progress}%)`);
          }
        });
      }
    }

    // Guardar datos actualizados
    currentData.projects = Object.values(projectsMap);
    currentData.lastSync = new Date().toISOString();
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
    console.log('💾 Datos sincronizados exitosamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando proyectos:', error);
    return false;
  }
}

// Auto-ejecutar si se llama directamente
if (require.main === module) {
  syncProjects();
}

module.exports = { syncProjects };