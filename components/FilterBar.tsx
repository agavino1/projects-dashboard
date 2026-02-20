'use client';

import { categoryConfig, statusConfig } from '@/data/projects';

interface FilterBarProps {
  selectedStatus: string | null;
  selectedCategory: string | null;
  onStatusChange: (status: string | null) => void;
  onCategoryChange: (category: string | null) => void;
}

export default function FilterBar({ 
  selectedStatus, 
  selectedCategory, 
  onStatusChange, 
  onCategoryChange 
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border shadow-md p-5 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Filtrar por Estado
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedStatus === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
              }`}
            >
              Todos
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => onStatusChange(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedStatus === key 
                    ? config.color 
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Filtrar por Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
              }`}
            >
              Todos
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === key 
                    ? `${config.color} text-gray-900 dark:text-white` 
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
