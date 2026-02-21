import { promises as fs } from 'fs';
import path from 'path';

// In Railway, we use a writable path. The data file lives alongside the code.
// For persistence across deploys, Railway needs a volume - but for now we use the runtime filesystem.
const DATA_FILE = path.join(process.cwd(), 'data', 'projects-data.json');

export interface Project {
  id: string;
  emoji: string;
  name: string;
  status: 'active' | 'progress' | 'research' | 'completed';
  category: 'tech' | 'content' | 'research' | 'product';
  progress: number;
  description: string;
  blockers: string[];
  lastUpdated: string;
  links: {
    github?: string;
    docs?: string;
    nextStep?: string;
  };
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ProjectsData {
  projects: Project[];
  statusConfig: Record<string, { label: string; color: string }>;
  categoryConfig: Record<string, { label: string; color: string }>;
  lastSync?: string;
}

export async function readProjectsData(): Promise<ProjectsData> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      projects: [],
      statusConfig: {},
      categoryConfig: {},
    };
  }
}

export async function writeProjectsData(data: ProjectsData): Promise<void> {
  data.lastSync = new Date().toISOString();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function getProjects(): Promise<Project[]> {
  const data = await readProjectsData();
  return data.projects;
}

export async function upsertProject(project: Project): Promise<Project> {
  const data = await readProjectsData();
  const idx = data.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) {
    data.projects[idx] = project;
  } else {
    data.projects.push(project);
  }
  await writeProjectsData(data);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const data = await readProjectsData();
  const before = data.projects.length;
  data.projects = data.projects.filter(p => p.id !== id);
  if (data.projects.length < before) {
    await writeProjectsData(data);
    return true;
  }
  return false;
}

export async function upsertTask(projectId: string, task: Task): Promise<Task | null> {
  const data = await readProjectsData();
  const project = data.projects.find(p => p.id === projectId);
  if (!project) return null;
  if (!project.tasks) project.tasks = [];
  const idx = project.tasks.findIndex(t => t.id === task.id);
  task.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    project.tasks[idx] = task;
  } else {
    task.createdAt = task.createdAt || new Date().toISOString();
    project.tasks.push(task);
  }
  await writeProjectsData(data);
  return task;
}
