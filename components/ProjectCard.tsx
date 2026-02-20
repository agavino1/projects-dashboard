'use client';

import { useState } from 'react';
import { Project, statusConfig } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[project.status];

  const daysAgo = parseInt(project.lastUpdated.split(' ')[0]);
  const timeColor = daysAgo === 0 ? 'text-green-600 dark:text-green-400' : 
                     daysAgo <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 
                     'text-gray-500 dark:text-gray-400';

  return (
    <div 
      className={`transform transition-all duration-300 ${expanded ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="h-full bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        
        {/* Header - Always visible */}
        <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-surface dark:to-dark-bg border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{project.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h3>
              </div>
            </div>
            <span className={`text-lg ${expanded ? '✕' : '+'}`}>
              {expanded ? '✕' : '+'}
            </span>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progreso</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  project.progress < 33 ? 'bg-red-500' :
                  project.progress < 66 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Blockers Summary */}
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bloqueos:</p>
            {project.blockers.length === 0 ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Sin bloqueos</span>
            ) : (
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                {project.blockers.slice(0, 2).map((blocker, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-red-500">⚠</span> {blocker}
                  </li>
                ))}
                {project.blockers.length > 2 && (
                  <li className="text-gray-500 dark:text-gray-400 italic">+{project.blockers.length - 2} más</li>
                )}
              </ul>
            )}
          </div>

          {/* Last Updated */}
          <p className={`text-xs font-medium ${timeColor}`}>
            Última actualización: {project.lastUpdated}
          </p>
        </div>

        {/* Links - Always visible, condensed */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
          <div className="flex flex-wrap gap-2">
            {project.links.github && (
              <a 
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-semibold bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                🐙 GitHub
              </a>
            )}
            {project.links.landing && (
              <a 
                href={project.links.landing}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                🌐 Landing
              </a>
            )}
            {project.links.docs && (
              <a 
                href={project.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-semibold bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                📄 Docs
              </a>
            )}
            {project.links.nextStep && (
              <button
                className="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(true);
                }}
              >
                ➜ Next
              </button>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="p-5 bg-white dark:bg-dark-surface space-y-4 border-t border-gray-200 dark:border-dark-border animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Descripción Completa</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.blockers.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Todos los Bloqueos</h4>
                <ul className="space-y-1">
                  {project.blockers.map((blocker, idx) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      <span>{blocker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Próximo Paso</h4>
              {project.links.nextStep && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  → {project.links.nextStep}
                </p>
              )}
            </div>

            {(project.links.github || project.links.landing || project.links.docs) && (
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Enlaces Completos</h4>
                <div className="flex flex-wrap gap-2">
                  {project.links.github && (
                    <a 
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🐙 Ver en GitHub
                    </a>
                  )}
                  {project.links.landing && (
                    <a 
                      href={project.links.landing}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🌐 Ver Landing
                    </a>
                  )}
                  {project.links.docs && (
                    <a 
                      href={project.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📄 Ver Documentación
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
