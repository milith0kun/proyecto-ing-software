'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function PublicarCapacitacion({ id, titulo, ambito, estado }: { id: string; titulo: string; ambito: string; estado: string }) {
  const router = useRouter();
  const confirmacion = useRef<HTMLDialogElement>(null);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  const [publicada, establecerPublicada] = useState(false);

  async function publicar() {
    establecerPendiente(true); establecerError('');
    try {
      const respuesta = await fetch(`/api/capacitaciones/${id}/publicar`, { method: 'POST' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No pudimos publicar la capacitación.');
      establecerPublicada(true);
      confirmacion.current?.close();
      router.refresh();
    } catch (fallo) {
      establecerError(fallo instanceof Error ? fallo.message : 'No pudimos conectar. Inténtalo nuevamente.');
    } finally { establecerPendiente(false); }
  }

  const yaPublicada = estado === 'PUBLICADA' || publicada;
  return <div>
    <button className="boton-primario" type="button" disabled={yaPublicada} onClick={() => { establecerError(''); confirmacion.current?.showModal(); }}>
      {yaPublicada ? 'Publicada' : 'Publicar capacitación'}
    </button>
    {publicada && <p role="status">Capacitación publicada correctamente.</p>}
    <dialog className="publicacion-confirmacion" ref={confirmacion} aria-labelledby="titulo-confirmacion-publicar" onCancel={evento => { if (pendiente) evento.preventDefault(); }}>
      <h2 id="titulo-confirmacion-publicar">Publicar capacitación</h2>
      <p>¿Quieres publicar «{titulo}»?</p>
      <p>{ambito === 'PUBLICO' ? 'Será visible en el catálogo público sin iniciar sesión.' : 'Conservará su ámbito interno y no aparecerá en el catálogo público.'}</p>
      {error && <p className="campo-error" role="alert">{error}</p>}
      <div className="publicacion-acciones">
        <button className="boton-secundario" type="button" disabled={pendiente} onClick={() => confirmacion.current?.close()}>Cancelar</button>
        <button className="boton-primario" type="button" disabled={pendiente} onClick={publicar}>{pendiente ? 'Publicando…' : 'Confirmar publicación'}</button>
      </div>
    </dialog>
  </div>;
}
