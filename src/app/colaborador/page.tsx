import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sesionActual } from '@/lib/sesion';
import { CerrarSesion } from '@/components/cerrar-sesion';
import { MarcaCgb } from '@/components/institucional/MarcaCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { UnidadesCgb } from '@/components/institucional/UnidadesCgb';

export default async function PaginaColaborador() {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');

  const nombre = usuario.name || usuario.email;

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__inner">
          <MarcaCgb />
          <CerrarSesion />
        </div>
      </header>

      <main className="colaborador-main">
        <section className="colaborador-hero" aria-labelledby="titulo-colaborador">
          <p className="kicker-cgb">CGB Academy · Área interna</p>
          <h1 id="titulo-colaborador">Bienvenido, {nombre}</h1>
          <p className="colaborador-hero__texto">
            Has accedido a tu espacio de colaborador. Desde aquí podrás seguir tus rutas de inducción
            y capacitaciones internas a medida que se habiliten.
          </p>
          <dl className="colaborador-datos">
            <div><dt>Cuenta</dt><dd>{usuario.email}</dd></div>
            <div><dt>Rol</dt><dd>Colaborador</dd></div>
            <div><dt>Estado</dt><dd>Sesión activa</dd></div>
          </dl>
        </section>

        <section className="colaborador-tarjetas" aria-label="Accesos disponibles">
          <article className="tarjeta-cgb">
            <h2>Catálogo público</h2>
            <p>Explora las capacitaciones abiertas de CIIP, GEOMINA y BIOMEDIC.</p>
            <Link href="/capacitaciones" className="boton-primario">Explorar capacitaciones</Link>
          </article>
          <article className="tarjeta-cgb">
            <h2>Mi inducción</h2>
            <p>Las rutas de onboarding y capacitaciones internas se incorporarán en el siguiente incremento.</p>
            <span className="colaborador-proximamente">Próximamente</span>
          </article>
        </section>

        <section className="colaborador-unidades" aria-label="Unidades institucionales">
          <p className="kicker-cgb">Unidades institucionales</p>
          <UnidadesCgb />
        </section>
      </main>

      <PieCgb />
    </>
  );
}
