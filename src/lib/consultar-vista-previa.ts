// Consulta de lectura: los borradores e internos sólo se muestran tras autorizar al administrador.
export async function consultarVistaPrevia<T>(id: string, buscar: (id: string) => Promise<T | null>): Promise<T | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return buscar(id);
}
