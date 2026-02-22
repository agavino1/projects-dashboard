import Link from 'next/link';

export default function BenchmarkManage() {
  return (
    <main style={{ minHeight: '100vh', background: '#00263A', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '40px' }}>
      <h1 style={{ marginTop: 0 }}>Benchmark · Gestión de Proyectos</h1>
      <p>La gestión se centraliza en la vista <strong>Proyectos</strong> dentro de /benchmark.</p>
      <ul>
        <li>Crear proyecto benchmark multi-cliente</li>
        <li>Editar banco cliente y alcance por segmentos</li>
        <li>Persistencia JSON vía /api/benchmark/projects</li>
      </ul>
      <Link href="/benchmark" style={{ color: '#E8C46A' }}>Ir a Benchmark</Link>
    </main>
  );
}
