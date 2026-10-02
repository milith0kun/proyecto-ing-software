import { redirect } from 'next/navigation';
import { sesionActual } from '@/lib/sesion';
import { CerrarSesion } from '@/components/cerrar-sesion';

export default async function LayoutAdministracion({ children }: { children: React.ReactNode }) {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  if (usuario.role !== 'ADMINISTRADOR') redirect('/colaborador');
  return <><div className="barra-sesion"><span>Administración · {usuario.name || usuario.email}</span><CerrarSesion /></div>{children}</>;
}
