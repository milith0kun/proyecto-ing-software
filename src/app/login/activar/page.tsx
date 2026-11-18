import ActivarCuentaForm from './ActivarCuentaForm';

export default async function PaginaActivarCuenta({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const parametros = await searchParams;
  const token = Array.isArray(parametros.token) ? parametros.token[0] : parametros.token;

  return <ActivarCuentaForm token={token || ''} />;
}