'use client';

import React, { useState, useEffect } from 'react';

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
  ris_number?: string;
  ris_subtitle?: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:    { label: 'Activo',      color: '#3AAD6E', bg: '#3AAD6E12', border: '#3AAD6E33' },
  progress:  { label: 'En Progreso', color: '#E88C1E', bg: '#E88C1E12', border: '#E88C1E33' },
  research:  { label: 'Research',    color: '#0080B0', bg: '#0080B012', border: '#0080B033' },
  completed: { label: 'Completado',  color: '#8A95A0', bg: '#8A95A012', border: '#8A95A033' },
  concept:   { label: 'Concepto',    color: '#7B68EE', bg: '#7B68EE12', border: '#7B68EE33' },
};

const categoryMap: Record<string, { label: string }> = {
  ris:       { label: 'RIS' },
  tech:      { label: 'Tech' },
  content:   { label: 'Contenido' },
  product:   { label: 'Producto' },
  strategy:  { label: 'Estrategia' },
  ai:        { label: 'AI' },
  personal:  { label: 'Personal' },
};

/* Monocolor flat SVG icons — 28px, single color (#8A95A0) */
const icons: Record<string, JSX.Element> = {
  'ris-historical-performance': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  'ris-revenue-playbook': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  'am-benchmark': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  ),
  'ris-pre-implementation': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  'ris-smart-framework': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  'am-elasticity-sim': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  'ris-complex-sim': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  'ris-new-revenue': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  'default': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  'sierra-nevada': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l6-9 4 5 5-7 3 11" />
    </svg>
  ),
  'boatcheckpro': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0021 12l-9-9-9 9c0 3 .84 5.89 2.38 8" /><path d="M12 3v6" />
    </svg>
  ),
  'toros-morante': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  'paper-trading-bot': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  'libros': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  'linkedin-content': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  'disneyland-paris': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A95A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" />
    </svg>
  ),
};

const getIcon = (id: string) => icons[id] || icons['default'];

/* Discrete bullet component */
const Bullet = () => (
  <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: '#3D5060', marginRight: 8, flexShrink: 0, marginTop: 7 }} />
);

const ProjectCard = ({ project }: { project: Project }) => {
  const st = statusMap[project.status] || statusMap.research;
  const cat = categoryMap[project.category] || categoryMap.tech;
  const hasLinks = project.links?.landing?.length || project.links?.repo?.length || project.links?.docs?.length;

  return (
    <div style={{
      background: '#003B5C',
      borderRadius: 4,
      border: '1px solid #1B3A4D',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4A84366')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1B3A4D')}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 14, flex: 1 }}>
          <div style={{ flexShrink: 0, marginTop: 2, opacity: 0.8 }}>
            {getIcon(project.id)}
          </div>
          <div style={{ flex: 1 }}>
            {project.ris_number && (
              <div style={{ fontSize: 11, color: '#D4A843', letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 4 }}>
                {project.ris_number}
              </div>
            )}
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
              {project.name}
            </h3>
            {project.ris_subtitle && (
              <div style={{ fontSize: 13, color: '#8A95A0', marginTop: 4, lineHeight: 1.4 }}>
                {project.ris_subtitle}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0, marginLeft: 14 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 3,
            color: st.color, background: st.bg, border: `1px solid ${st.border}`,
          }}>
            {st.label}
          </span>
          <span style={{ fontSize: 11, color: '#5A6570', fontWeight: 500 }}>
            {cat.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#C5CCD3', margin: 0, lineHeight: 1.65 }}>
        {project.description}
      </p>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#8A95A0' }}>Progreso</span>
          <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 4, background: '#00263A', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width 0.5s',
            width: `${project.progress}%`,
            background: project.progress >= 70 ? '#3AAD6E' : project.progress >= 30 ? '#D4A843' : '#0080B0',
          }} />
        </div>
      </div>

      {/* Links */}
      {hasLinks ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.links.landing?.map((link, i) => (
            <a key={`l-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 3, border: '1px solid #D4A84344', background: '#D4A84310', color: '#D4A843', textDecoration: 'none', fontWeight: 600 }}>
              ↗ {link.title}
            </a>
          ))}
          {project.links.repo?.map((link, i) => (
            <a key={`r-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 3, border: '1px solid #1B3A4D', background: 'transparent', color: '#8A95A0', textDecoration: 'none', fontWeight: 500 }}>
              ◆ {link.title}
            </a>
          ))}
          {project.links.docs?.map((link, i) => (
            <a key={`d-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 3, border: '1px solid #1B3A4D', background: 'transparent', color: '#8A95A0', textDecoration: 'none', fontWeight: 500 }}>
              ◇ {link.title}
            </a>
          ))}
        </div>
      ) : null}

      {/* Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: '#8A95A0', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>
            Tareas Sebastián
          </div>
          {project.tasks_sebastian.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {project.tasks_sebastian.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: 13, color: '#C5CCD3', lineHeight: 1.5 }}>
                  <Bullet />{t}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: '#3D4750' }}>—</span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#C0392B', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>
            Pendiente Álvaro
          </div>
          {project.tasks_alvaro.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {project.tasks_alvaro.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: 13, color: '#E74C3C', lineHeight: 1.5 }}>
                  <Bullet />{t}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: '#3D4750' }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/projects-data.json')
      .then(r => r.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects
    .filter(p => activeFilter === 'all' || p.status === activeFilter)
    .filter(p => activeCat === 'all' || p.category === activeCat);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    progress: projects.filter(p => p.status === 'progress').length,
    ris: projects.filter(p => p.category === 'ris').length,
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#00263A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#D4A843', fontSize: 14, letterSpacing: 2 }}>CARGANDO...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#00263A', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 28px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Proyectos', value: stats.total, color: '#FFFFFF' },
            { label: 'Módulos RIS', value: stats.ris, color: '#D4A843' },
            { label: 'Activos', value: stats.active, color: '#3AAD6E' },
            { label: 'En Progreso', value: stats.progress, color: '#E88C1E' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#003B5C', borderRadius: 4, padding: '14px 18px', border: '1px solid #1B3A4D' }}>
              <div style={{ fontSize: 12, color: '#8A95A0', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'ris', label: 'RIS' },
              { key: 'tech', label: 'Tech' },
              { key: 'content', label: 'Contenido' },
              { key: 'product', label: 'Producto' },
              { key: 'personal', label: 'Personal' },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveCat(f.key)}
                style={{
                  padding: '7px 16px', borderRadius: 4, border: `1px solid ${activeCat === f.key ? '#D4A843' : '#1B3A4D'}`,
                  background: activeCat === f.key ? '#D4A84312' : 'transparent',
                  color: activeCat === f.key ? '#D4A843' : '#5A6570',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeCat === f.key ? 600 : 400,
                }}>
                {f.label}
              </button>
            ))}
          </div>
          <span style={{ width: 1, height: 18, background: '#1B3A4D', display: 'inline-block' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'active', label: 'Activo' },
              { key: 'progress', label: 'En Progreso' },
              { key: 'research', label: 'Research' },
              { key: 'concept', label: 'Concepto' },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '7px 16px', borderRadius: 4, border: `1px solid ${activeFilter === f.key ? '#0080B0' : '#1B3A4D'}`,
                  background: activeFilter === f.key ? '#0080B012' : 'transparent',
                  color: activeFilter === f.key ? '#0080B0' : '#5A6570',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeFilter === f.key ? 600 : 400,
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 14 }}>
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0 14px', fontSize: 11, color: '#3D4750', borderTop: '1px solid #1B3A4D', marginTop: 24 }}>
          Dashboard de Proyectos · Feb 2026
        </div>
      </div>
    </div>
  );
}
