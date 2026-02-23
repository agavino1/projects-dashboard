import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Lee y sirve el fichero de datos de proyectos directamente.
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'projects-data.json');
    
    if (fs.existsSync(dataPath)) {
      const fileContents = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(fileContents);
      
      const projects = data.projects || [];

      // Calcula las estadísticas directamente desde los proyectos
      const stats = {
        active: projects.filter((p: any) => p.status === 'active').length,
        progress: projects.filter((p: any) => p.status === 'progress').length,
        completed: projects.filter((p: any) => p.status === 'completed').length,
        research: projects.filter((p: any) => p.status === 'research').length
      };

      return NextResponse.json({
        projects: projects,
        totalProjects: projects.length,
        lastSync: data.lastSync || new Date().toISOString(),
        stats: stats
      });
    } else {
      // Si el fichero no existe, devuelve un array vacío para evitar errores.
      return NextResponse.json({ projects: [], totalProjects: 0, stats: { active: 0, progress: 0, completed: 0, research: 0 } });
    }

  } catch (error) {
    console.error('Error in omniscient API:', error);
    return NextResponse.json({ error: 'Failed to fetch projects data' }, { status: 500 });
  }
}

export async function POST() {
  // La sincronización manual no es necesaria con este enfoque simple.
  return NextResponse.json({ message: 'Sync not required for file-based data source' });
}
