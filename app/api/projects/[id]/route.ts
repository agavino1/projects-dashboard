import { NextRequest, NextResponse } from 'next/server';
import { readProjectsData, upsertProject, deleteProject, upsertTask, Task } from '@/lib/projects-store';

// GET /api/projects/[id] - obtener un proyecto específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await readProjectsData();
    const project = data.projects.find(p => p.id === id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Error reading project' }, { status: 500 });
  }
}

// PATCH /api/projects/[id] - actualizar campos específicos de un proyecto
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.DASHBOARD_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await readProjectsData();
    const project = data.projects.find(p => p.id === id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates = await request.json();

    // Handle task upsert if "task" key present
    if (updates.task) {
      const task = await upsertTask(id, updates.task as Task);
      return NextResponse.json({ success: true, task });
    }

    // Merge updates into project
    const updated = { ...project, ...updates, id };
    const result = await upsertProject(updated);
    return NextResponse.json({ success: true, project: result });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - borrar un proyecto
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.DASHBOARD_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
