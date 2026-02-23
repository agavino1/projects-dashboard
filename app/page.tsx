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
  AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  emoji: string;
  category: string;
  status: string;
  progress: number;
  description: string;
  folder_path?: string;
  lastUpdated: string;
  activity_count: number;
  links: {
    landing?: { url: string; title: string }[];
    repo?: { url: string; title: string }[];
    service?: { url: string; title: string }[];
    docs?: { url: string; title: string }[];
  };
  insights: {
    insight_type: string;
    content: string;
    confidence: number;
    timestamp: string;
  }[];
}

interface ProjectStats {
  active: number;
  progress: number;
  completed: number;
  research: number;
}

interface Activity {
  id: number;
  project_name: string;
  project_emoji: string;
  activity_type: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  metadata: any;
}

export default function OmniscientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ProjectStats>({ active: 0, progress: 0, completed: 0, research: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'insights'>('cards');

  useEffect(() => {
    fetchProjects();
    fetchTimeline();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchProjects();
      fetchTimeline();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
      setStats(data.stats || { active: 0, progress: 0, completed: 0, research: 0 });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/timeline');
      const data = await response.json();
      setActivities(data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    }
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/omniscient/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      });
      
      // Wait a bit then refresh data
      setTimeout(() => {
        fetchProjects();
        fetchTimeline();
        setSyncing(false);
      }, 3000);
    } catch (error) {
      console.error('Error syncing:', error);
      setSyncing(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit': return <Github size={16} />;
      case 'deploy': return <Globe size={16} />;
      case 'conversation': return <Lightbulb size={16} />;
      case 'file_change': return <FileText size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const renderProjectCard = (project: Project) => (
    <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
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
            <div className="text-xs text-gray-500">{project.lastUpdated}</div>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>

        {/* Links */}
        {Object.keys(project.links).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.links.landing?.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
                <Globe size={12} className="mr-1" />
                Landing
              </a>
            ))}
            {project.links.repo?.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                <Github size={12} className="mr-1" />
                Repo
              </a>
            ))}
            {project.links.service?.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors">
                <Zap size={12} className="mr-1" />
                Service
              </a>
            ))}
            {project.links.docs?.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors">
                <FileText size={12} className="mr-1" />
                Docs
              </a>
            ))}
          </div>
        )}

        {/* Latest insights */}
        {project.insights.length > 0 && (
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-gray-700 mb-2">💡 Últimos insights</div>
            {project.insights.slice(0, 2).map((insight, idx) => (
              <div key={idx} className="text-xs text-gray-600 mb-1 flex items-start">
                <span className="mr-1">
                  {insight.insight_type === 'decision' && '🎯'}
                  {insight.insight_type === 'idea' && '💡'}
                  {insight.insight_type === 'blocker' && '🚫'}
                  {insight.insight_type === 'next_step' && '➡️'}
                </span>
                <span className="line-clamp-1">{insight.content.substring(0, 60)}...</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-4">
      {activities.slice(0, 20).map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.activity_type)}
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{activity.project_emoji}</span>
              <span className="font-medium text-gray-900">{activity.project_name}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">{activity.timeAgo}</span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {JSON.stringify(activity.metadata, null, 2)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cargando dashboard omnisciente...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Proyectos</h1>
              <p className="text-gray-600 mt-1">Visión centralizada de todas las iniciativas · {projects.length} proyectos activos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={triggerSync}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Sincronizando...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-green-600 text-sm font-medium">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-yellow-600 text-sm font-medium">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.progress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-purple-600 text-sm font-medium">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-blue-600 text-sm font-medium">Research</p>
                <p className="text-2xl font-bold text-gray-900">{stats.research}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Proyectos
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Timeline
            </button>
          </div>

          {viewMode === 'cards' && (
            <div className="flex space-x-2">
              {['all', 'active', 'progress', 'completed', 'research'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {status === 'all' ? 'Todos' : status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(renderProjectCard)}
          </div>
        )}

        {viewMode === 'timeline' && renderTimeline()}
      </div>
    </div>
  );
}