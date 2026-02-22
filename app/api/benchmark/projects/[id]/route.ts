import { NextRequest, NextResponse } from 'next/server';
import { deleteBenchmarkProject, readBenchmarkProjects } from '@/lib/benchmark-store';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await readBenchmarkProjects();
  const project = data.projects.find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const ok = await deleteBenchmarkProject(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
