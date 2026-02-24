'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{ background: '#00263A', borderBottom: '2px solid #D4A84333' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#D4A843', fontWeight: 700 }}>
                Revenue Improvement Solutions
              </span>
            </Link>
            <span style={{ width: 1, height: 20, background: '#2A5068', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', letterSpacing: -0.3 }}>
              Dashboard de Proyectos
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ height: 6, width: 6, background: '#3AAD6E', borderRadius: '50%' }} />
            <span style={{ fontSize: 10, color: '#8A95A0', letterSpacing: 1, textTransform: 'uppercase' as const }}>Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
