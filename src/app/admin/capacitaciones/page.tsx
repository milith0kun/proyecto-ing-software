import PanelCapacitaciones from './PanelCapacitaciones';
import { redirect } from 'next/navigation';
import { sesionActual } from '@/lib/sesion';

export default async function PaginaCapacitaciones() {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  if (usuario.role !== 'ADMINISTRADOR') redirect('/admin/colaboradores');
  return <PanelCapacitaciones />;
}
