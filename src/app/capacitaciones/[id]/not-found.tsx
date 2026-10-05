import Link from 'next/link';

export default function CapacitacionNoEncontrada() {
  return (
    <main style={{ display: 'grid', minHeight: '100vh', placeItems: 'center', padding: '24px', backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
      <section style={{ maxWidth: '520px' }}>
        <p style={{ margin: '0 0 10px', color: 'var(--brand-blue)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
          Contenido no disponible
        </p>
        <h1 style={{ margin: '0 0 14px', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', fontSize: '32px' }}>
          Capacitación no encontrada o no disponible
        </h1>
        <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Es posible que el enlace no exista o que el contenido ya no sea público.
        </p>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 20px', borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
