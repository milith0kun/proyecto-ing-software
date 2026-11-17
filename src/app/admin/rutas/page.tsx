import { redirect } from 'next/navigation';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { sesionActual } from '@/lib/sesion';
import PanelAsignacionRutas from './PanelAsignacionRutas';

export const dynamic = 'force-dynamic';

export default async function PaginaRutas() {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  if (usuario.role !== 'ADMINISTRADOR') redirect('/admin/colaboradores');

  return (
    <div className="admin-shell">
      <CabeceraAdminCgb>
        <div className="admin-header__context">
          <span className="indicador-operativo" />
          <span>Asignación de rutas y capacitaciones</span>
        </div>
      </CabeceraAdminCgb>
      <main className="panel-admin panel-admin--compact">
        <PanelAsignacionRutas />
      </main>
      <PieCgb />
    </div>
  );
}
