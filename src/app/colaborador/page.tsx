import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sesionActual } from '@/lib/sesion';
import { CerrarSesion } from '@/components/cerrar-sesion';

export default async function PaginaColaborador() {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  return <main className="acceso-contenedor"><section className="acceso-tarjeta"><p className="acceso-etiqueta">CGB Academy · Área interna</p><h1>Bienvenido, {usuario.name || usuario.email}</h1><p>Has accedido a tu espacio de colaborador. Las rutas de onboarding se incorporarán en el siguiente incremento.</p><Link href="/">Consultar contenido público</Link><CerrarSesion /></section></main>;
}
