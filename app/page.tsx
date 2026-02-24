'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ExternalLink, 
  Github, 
  Globe, 
  FileText, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  Zap,
  Target,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Updated Project interface
interface Project {
  id: string;
  name: string;
  emoji: string;
  category: string;
  status: string;
  progress: number;
  description: string;
  links: {
    landing?: { url: string; title: string }[];
    repo?: { url: string; title: string }[];
    docs?: { url: string; title: string }[];
  };
  tasks_sebastian: string[];
  tasks_alvaro: string[];
}

interface ProjectStats {
  active: number;
  progress: number;
  completed: number;
  research: number;
}

// ProjectCard component with expand/collapse functionality
const ProjectCard = ({ project }: { project: Project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-300';
      case 'progress': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'completed': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'research': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'progress': return '🟡';
      case 'completed': return '✅';
      case 'research': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{project.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)} {project.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
            <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 space-y-6">
          {/* Links */}
          {(project.links?.landing?.length || project.links?.repo?.length || project.links?.docs?.length) ? (
            <div>
              <h4 className="font-bold text-sm mb-2 text-gray-800">Enlaces</h4>
              <div className="flex flex-wrap gap-2">
                {project.links.landing?.map((link, i) => (
                  <a key={`landing-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                    <Globe size={14} /> {link.title || 'Landing'}
                  </a>
                ))}
                {project.links.repo?.map((link, i) => (
                  <a key={`repo-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors">
                    <Github size={14} /> {link.title || 'Repo'}
                  </a>
                ))}
                {project.links.docs?.map((link, i) => (
                  <a key={`docs-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                    <FileText size={14} /> {link.title || 'Docs'}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {/* Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-sm mb-2 text-gray-800">Tareas (Sebastián)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {project.tasks_sebastian.map((task, i) => <li key={i}>{task}</li>)}
                {project.tasks_sebastian.length === 0 && <li className="text-gray-400">No hay tareas pendientes.</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-2 text-red-700">Pendiente (Álvaro)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                {project.tasks_alvaro.map((task, i) => <li key={i}>{task}</li>)}
                 {project.tasks_alvaro.length === 0 && <li className="text-gray-400">Sin bloqueos.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({ active: 0, progress: 0, completed: 0, research: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/projects-data.json');
      const data = await response.json();
      const fetchedProjects = data.projects || [];
      setProjects(fetchedProjects);

      // Calculate stats
      const newStats = {
        active: fetchedProjects.filter((p: Project) => p.status === 'active').length,
        progress: fetchedProjects.filter((p: Project) => p.status === 'progress').length,
        completed: fetchedProjects.filter((p: Project) => p.status === 'completed').length,
        research: fetchedProjects.filter((p: Project) => p.status === 'research').length,
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-green-600 text-sm font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-yellow-600 text-sm font-medium">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{stats.progress}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-purple-600 text-sm font-medium">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-blue-600 text-sm font-medium">Research</p>
              <p className="text-2xl font-bold text-gray-900">{stats.research}</p>
          </div>
        </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'all', label: 'Todos', color: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' },
          { key: 'active', label: '🟢 Activos', color: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100' },
          { key: 'progress', label: '🟡 En Progreso', color: 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100' },
          { key: 'research', label: '🔵 Research', color: 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' },
          { key: 'completed', label: '✅ Completados', color: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeFilter === filter.key
                ? 'ring-2 ring-offset-1 ring-blue-500 shadow-md ' + filter.color
                : filter.color + ' opacity-70'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter(p => activeFilter === 'all' || p.status === activeFilter)
          .map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}