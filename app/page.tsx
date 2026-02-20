'use client';

import { useState, useMemo } from 'react';
import { projects, statusConfig } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const statusMatch = !selectedStatus || project.status === selectedStatus;
      const categoryMatch = !selectedCategory || project.category === selectedCategory;
      return statusMatch && categoryMatch;
    });
  }, [selectedStatus, selectedCategory]);

  // Calculate stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    progress: projects.filter(p => p.status === 'progress').length,
    research: projects.filter(p => p.status === 'research').length,
    completed: projects.filter(p => p.status === 'completed').length,
    avgProgress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length),
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-bg dark:to-dark-surface">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-dark-surface shadow-lg border-b border-gray-200 dark:border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1">
                  🎯 Proyectos de Álvaro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dashboard interactivo de estado - {stats.total} proyectos activos
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                <p className="text-xs text-green-700 dark:text-green-300 font-semibold">Activos</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.progress}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold">En Progreso</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.research}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Research</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completed}</p>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Completados</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.avgProgress}%</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">Promedio</p>
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
            {' '}proyectos mostrados {filteredProjects.length !== stats.total && '(filtrados)'}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
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
              <p>🚀 Dashboard de Proyectos de Álvaro Gaviño González</p>
              <p className="mt-1">Última sincronización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
