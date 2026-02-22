import { promises as fs } from 'fs';
import path from 'path';

export type BenchmarkSegment = 'retail' | 'pyme' | 'empresa' | 'cib';

export interface BenchmarkProject {
  id: string;
  name: string;
  clientBankId: string;
  market: string;
  competitorBankIds: string[];
  segments: BenchmarkSegment[];
  status: 'draft' | 'active' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkProjectsData {
  version: number;
  projects: BenchmarkProject[];
  lastSync: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'benchmark-projects.json');

const defaultData: BenchmarkProjectsData = {
  version: 1,
  lastSync: new Date().toISOString(),
  projects: [
    {
      id: 'cl-santander-full-2026',
      name: 'Chile · Santander · Benchmark Full',
      clientBankId: 'santander',
      market: 'Chile',
      competitorBankIds: ['bchile', 'bci', 'scotiabank', 'itau', 'bEstado', 'bice', 'security', 'falabella', 'consorcio'],
      segments: ['retail', 'pyme', 'empresa', 'cib'],
      status: 'active',
      notes: 'Proyecto base de handoff benchmark-chile',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export async function readBenchmarkProjects(): Promise<BenchmarkProjectsData> {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      version: parsed.version || 1,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
      lastSync: parsed.lastSync || new Date().toISOString(),
    };
  } catch {
    return defaultData;
  }
}

export async function writeBenchmarkProjects(data: BenchmarkProjectsData): Promise<void> {
  const normalized = {
    ...data,
    version: 1,
    lastSync: new Date().toISOString(),
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');
}

export async function upsertBenchmarkProject(project: Partial<BenchmarkProject> & { id: string; name: string; clientBankId: string; market: string }): Promise<BenchmarkProject> {
  const data = await readBenchmarkProjects();
  const now = new Date().toISOString();
  const existing = data.projects.find((p) => p.id === project.id);

  const merged: BenchmarkProject = {
    id: project.id,
    name: project.name,
    clientBankId: project.clientBankId,
    market: project.market,
    competitorBankIds: project.competitorBankIds || existing?.competitorBankIds || [],
    segments: (project.segments as BenchmarkSegment[]) || existing?.segments || ['retail'],
    status: project.status || existing?.status || 'draft',
    notes: project.notes ?? existing?.notes,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  const idx = data.projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) data.projects[idx] = merged;
  else data.projects.push(merged);

  await writeBenchmarkProjects(data);
  return merged;
}

export async function deleteBenchmarkProject(id: string): Promise<boolean> {
  const data = await readBenchmarkProjects();
  const before = data.projects.length;
  data.projects = data.projects.filter((p) => p.id !== id);
  if (data.projects.length === before) return false;
  await writeBenchmarkProjects(data);
  return true;
}
