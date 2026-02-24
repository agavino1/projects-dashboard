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

const categoryMap: Record<string, { label: string; color: string }> = {
  ris:       { label: 'RIS',        color: '#D4A843' },
  tech:      { label: 'Tech',       color: '#0080B0' },
  content:   { label: 'Contenido',  color: '#E88C1E' },
  product:   { label: 'Producto',   color: '#8CC63F' },
  strategy:  { label: 'Estrategia', color: '#7B68EE' },
  ai:        { label: 'AI',         color: '#EC4899' },
  personal:  { label: 'Personal',   color: '#8A95A0' },
};

const ProjectCard = ({ project }: { project: Project }) => {
  const st = statusMap[project.status] || statusMap.research;
  const cat = categoryMap[project.category] || categoryMap.tech;
  const hasLinks = project.links?.landing?.length || project.links?.repo?.length || project.links?.docs?.length;

  return (
    <div style={{
      background: '#003B5C',
      borderRadius: 4,
      border: '1px solid #1B3A4D',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4A84366')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1B3A4D')}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {project.ris_number && (
            <div style={{ fontSize: 9, color: '#D4A843', letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
              {project.ris_number}
            </div>
          )}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
            {project.name}
          </h3>
          {project.ris_subtitle && (
            <div style={{ fontSize: 10, color: '#8A95A0', marginTop: 3, lineHeight: 1.4 }}>
              {project.ris_subtitle}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 12 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 3,
            color: st.color, background: st.bg, border: `1px solid ${st.border}`,
          }}>
            {st.label}
          </span>
          <span style={{ fontSize: 8, color: cat.color, fontWeight: 600, letterSpacing: 0.5 }}>
            {cat.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 11, color: '#C5CCD3', margin: 0, lineHeight: 1.5 }}>
        {project.description}
      </p>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#8A95A0' }}>Progreso</span>
          <span style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 700 }}>{project.progress}%</span>
        </div>
        <div style={{ height: 3, background: '#00263A', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width 0.5s',
            width: `${project.progress}%`,
            background: project.progress >= 70 ? '#3AAD6E' : project.progress >= 30 ? '#D4A843' : '#0080B0',
          }} />
        </div>
      </div>

      {/* Links */}
      {hasLinks ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {project.links.landing?.map((link, i) => (
            <a key={`l-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 9, padding: '3px 8px', borderRadius: 3, border: '1px solid #D4A84344', background: '#D4A84310', color: '#D4A843', textDecoration: 'none', fontWeight: 600 }}>
              ↗ {link.title}
            </a>
          ))}
          {project.links.repo?.map((link, i) => (
            <a key={`r-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 9, padding: '3px 8px', borderRadius: 3, border: '1px solid #1B3A4D', background: 'transparent', color: '#8A95A0', textDecoration: 'none', fontWeight: 500 }}>
              ◆ {link.title}
            </a>
          ))}
          {project.links.docs?.map((link, i) => (
            <a key={`d-${i}`} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 9, padding: '3px 8px', borderRadius: 3, border: '1px solid #1B3A4D', background: 'transparent', color: '#8A95A0', textDecoration: 'none', fontWeight: 500 }}>
              ◇ {link.title}
            </a>
          ))}
        </div>
      ) : null}

      {/* Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 8, color: '#8A95A0', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>
            Tareas Sebastián
          </div>
          {project.tasks_sebastian.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 12, fontSize: 10, color: '#C5CCD3', lineHeight: 1.6 }}>
              {project.tasks_sebastian.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ) : (
            <span style={{ fontSize: 10, color: '#3D4750' }}>—</span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 8, color: '#C0392B', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>
            Pendiente Álvaro
          </div>
          {project.tasks_alvaro.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 12, fontSize: 10, color: '#E74C3C', lineHeight: 1.6 }}>
              {project.tasks_alvaro.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ) : (
            <span style={{ fontSize: 10, color: '#3D4750' }}>—</span>
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
        <div style={{ color: '#D4A843', fontSize: 12, letterSpacing: 2 }}>CARGANDO...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#00263A', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 28px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total Proyectos', value: stats.total, color: '#FFFFFF' },
            { label: 'RIS Modules', value: stats.ris, color: '#D4A843' },
            { label: 'Activos', value: stats.active, color: '#3AAD6E' },
            { label: 'En Progreso', value: stats.progress, color: '#E88C1E' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#003B5C', borderRadius: 4, padding: '12px 16px', border: '1px solid #1B3A4D' }}>
              <div style={{ fontSize: 9, color: '#8A95A0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 3 }}>
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
                  padding: '5px 12px', borderRadius: 4, border: `1px solid ${activeCat === f.key ? '#D4A843' : '#1B3A4D'}`,
                  background: activeCat === f.key ? '#D4A84312' : 'transparent',
                  color: activeCat === f.key ? '#D4A843' : '#5A6570',
                  cursor: 'pointer', fontSize: 10, fontWeight: activeCat === f.key ? 600 : 400,
                }}>
                {f.label}
              </button>
            ))}
          </div>
          <span style={{ width: 1, height: 16, background: '#1B3A4D', display: 'inline-block' }} />
          <div style={{ display: 'flex', gap: 3 }}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'active', label: 'Activo' },
              { key: 'progress', label: 'En Progreso' },
              { key: 'research', label: 'Research' },
              { key: 'concept', label: 'Concepto' },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '5px 12px', borderRadius: 4, border: `1px solid ${activeFilter === f.key ? '#0080B0' : '#1B3A4D'}`,
                  background: activeFilter === f.key ? '#0080B012' : 'transparent',
                  color: activeFilter === f.key ? '#0080B0' : '#5A6570',
                  cursor: 'pointer', fontSize: 10, fontWeight: activeFilter === f.key ? 600 : 400,
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 12px', fontSize: 8, color: '#3D4750', borderTop: '1px solid #1B3A4D', marginTop: 20 }}>
          <span style={{ color: '#8B7535', fontWeight: 600, letterSpacing: 1.5 }}>CONFIDENCIAL</span>
          {' '} | Revenue Improvement Solutions | Feb 2026
        </div>
      </div>
    </div>
  );
}
