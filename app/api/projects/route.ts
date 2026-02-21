import { NextRequest, NextResponse } from 'next/server';
import { readProjectsData, upsertProject, Project } from '@/lib/projects-store';

// GET /api/projects - obtener todos los proyectos
export async function GET() {
  try {
    const data = await readProjectsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error reading projects' }, { status: 500 });
  }
}

// POST /api/projects - crear o actualizar un proyecto
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.DASHBOARD_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if it's a bulk update (array) or single project
    if (Array.isArray(body)) {
      const results = [];
      for (const project of body) {
        const result = await upsertProject(project as Project);
        results.push(result);
      }
      return NextResponse.json({ success: true, projects: results, count: results.length });
    } else {
      const project = body as Project;
      if (!project.id || !project.name) {
        return NextResponse.json({ error: 'Project must have id and name' }, { status: 400 });
      }
      // Set defaults
      project.lastUpdated = project.lastUpdated || 'hoy';
      project.blockers = project.blockers || [];
      project.links = project.links || {};

      const result = await upsertProject(project);
      return NextResponse.json({ success: true, project: result });
    }
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ error: 'Error saving project' }, { status: 500 });
  }
}

// PUT /api/projects - reemplazar TODOS los proyectos
export async function PUT(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.DASHBOARD_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { writeProjectsData, readProjectsData } = await import('@/lib/projects-store');
    const body = await request.json();
    const currentData = await readProjectsData();

    await writeProjectsData({
      ...currentData,
      projects: body.projects || body,
    });

    return NextResponse.json({ success: true, count: (body.projects || body).length });
  } catch (error) {
    return NextResponse.json({ error: 'Error replacing projects' }, { status: 500 });
  }
}
