'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { statusConfig as defaultStatusConfig, categoryConfig as defaultCategoryConfig } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import FilterBar from '@/components/FilterBar';

interface Project {
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
  tasks?: Array<{
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    notes?: string;
  }>;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setProjects(data.projects || data);
      setLastSync(data.lastSync || new Date().toISOString());
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const statusMatch = !selectedStatus || project.status === selectedStatus;
      const categoryMatch = !selectedCategory || project.category === selectedCategory;
      return statusMatch && categoryMatch;
    });
  }, [projects, selectedStatus, selectedCategory]);

  // Calculate stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    progress: projects.filter(p => p.status === 'progress').length,
    research: projects.filter(p => p.status === 'research').length,
    completed: projects.filter(p => p.status === 'completed').length,
    avgProgress: projects.length
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
      : 0,
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🚀 Projects Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Álvaro Gaviño González · Open Claw
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Stats */}
                <div className="hidden sm:flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">{stats.active} activos</span>
                  <span className="text-yellow-600 font-medium">{stats.progress} en progreso</span>
                  <span className="text-purple-600 font-medium">{stats.completed} completados</span>
                  <span className="text-gray-500 font-medium">~{stats.avgProgress}% avg</span>
                </div>
                {/* Refresh button */}
                <button
                  onClick={fetchProjects}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm px-3 py-1 rounded border border-gray-200 dark:border-gray-600 hover:border-gray-400 transition-colors"
                  title="Refrescar datos"
                >
                  🔄
                </button>
                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Filters */}
          <FilterBar
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            onStatusChange={setSelectedStatus}
            onCategoryChange={setSelectedCategory}
          />

          {/* Results Counter */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredProjects.length}</span>
            {' '}proyectos mostrados {filteredProjects.length !== stats.total && `(filtrados)`}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Cargando proyectos...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay proyectos que coincidan con los filtros seleccionados
              </p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-300 dark:border-dark-border">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>🦞 Dashboard de Proyectos de Álvaro Gaviño González</p>
              <p className="mt-1">
                Última sincronización:{' '}
                {lastSync
                  ? new Date(lastSync).toLocaleString('es-ES')
                  : new Date().toLocaleString('es-ES')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Se actualiza automáticamente cada 30 segundos
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
