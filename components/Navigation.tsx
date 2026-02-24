'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav style={{ background: '#00263A', borderBottom: '2px solid #D4A84333' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.3 }}>
              Dashboard de Proyectos
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 6, width: 6, background: '#3AAD6E', borderRadius: '50%' }} />
            <span style={{ fontSize: 11, color: '#8A95A0', letterSpacing: 1 }}>Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
