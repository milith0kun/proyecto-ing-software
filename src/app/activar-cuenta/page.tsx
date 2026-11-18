import FormularioActivarCuenta from './FormularioActivarCuenta';

export const dynamic = 'force-dynamic';

export default async function PaginaActivarCuenta({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;
  return <FormularioActivarCuenta token={token} />;
}
