import { redirect } from 'next/navigation';
import { sesionActual } from '@/lib/sesion';
import { CerrarSesion } from '@/components/cerrar-sesion';

export default async function LayoutAdministracion({ children }: { children: React.ReactNode }) {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  if (usuario.role !== 'ADMINISTRADOR') redirect('/colaborador');

  return (
    <>
      <header className="barra-sesion">
        <div className="barra-sesion-info">
          <span className="barra-sesion-badge">Administración CGB</span>
          <span className="barra-sesion-usuario">{usuario.name || usuario.email}</span>
        </div>
        <CerrarSesion />
      </header>
      {children}
    </>
  );
}
