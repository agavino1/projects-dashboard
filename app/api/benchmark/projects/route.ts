import { NextRequest, NextResponse } from 'next/server';
import { readBenchmarkProjects, upsertBenchmarkProject, writeBenchmarkProjects } from '@/lib/benchmark-store';

export async function GET() {
  try {
    const data = await readBenchmarkProjects();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Cannot read benchmark projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const saved = [];
      for (const item of body) {
        saved.push(await upsertBenchmarkProject(item));
      }
      return NextResponse.json({ success: true, projects: saved });
    }

    if (!body?.id || !body?.name || !body?.clientBankId || !body?.market) {
      return NextResponse.json({ error: 'id, name, clientBankId and market are required' }, { status: 400 });
    }

    const saved = await upsertBenchmarkProject(body);
    return NextResponse.json({ success: true, project: saved });
  } catch {
    return NextResponse.json({ error: 'Cannot save benchmark project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body?.projects)) {
      return NextResponse.json({ error: 'projects array required' }, { status: 400 });
    }
    await writeBenchmarkProjects({ version: 1, lastSync: new Date().toISOString(), projects: body.projects });
    return NextResponse.json({ success: true, count: body.projects.length });
  } catch {
    return NextResponse.json({ error: 'Cannot replace benchmark projects' }, { status: 500 });
  }
}
