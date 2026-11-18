import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { obtenerEstructuraOrganizacional } from '@/lib/repositorio-organizacion';
import type { AreaEstructura } from '@/lib/organizacion';
import PanelOrganizacion from './PanelOrganizacion';

export const dynamic = 'force-dynamic';

export default async function PaginaOrganizacion() {
  let areasIniciales: AreaEstructura[] = [];
  let errorInicial = '';

  try {
    areasIniciales = await obtenerEstructuraOrganizacional();
  } catch {
    errorInicial = 'No pudimos conectar con la base de datos para consultar la estructura organizacional.';
  }

  return (
    <div className="admin-shell">
      <CabeceraAdminCgb>
        <div className="org-header-acciones">
          <Link href="/admin/capacitaciones" className="boton-secundario boton-secundario--compacto">
            Capacitaciones
          </Link>
          <div className="admin-header__context">
            <span className="indicador-operativo" />
            <span>Estructura organizacional</span>
          </div>
        </div>
      </CabeceraAdminCgb>
      <PanelOrganizacion areasIniciales={areasIniciales} errorInicial={errorInicial} />
      <PieCgb />
    </div>
  );
}
