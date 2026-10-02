'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';

interface Slide {
  id: string;
  orden: number;
  titulo: string;
  contenido: string;
  tipo: string;
}

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  categoria: string | null;
  duracionMin: number | null;
  slides: Slide[];
}

function Icono({ nombre, size = 18 }: { nombre: string; size?: number }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };
  if (nombre === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (nombre === 'arrow') return <svg {...props}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
  if (nombre === 'up') return <svg {...props}><path d="m6 14 6-6 6 6" /></svg>;
  if (nombre === 'down') return <svg {...props}><path d="m6 10 6 6 6-6" /></svg>;
  if (nombre === 'edit') return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (nombre === 'trash') return <svg {...props}><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></svg>;
  if (nombre === 'close') return <svg {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  if (nombre === 'check') return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8m-8 4h8m-8 4h5" /></svg>;
}

function Estado({ estado }: { estado: string }) {
  const publicada = estado === 'PUBLICADA';
  return (
    <span className={'chip-estado ' + (publicada ? 'chip-estado--completado' : 'chip-estado--pendiente')}>
      <span className="chip-estado__punto" />{publicada ? 'Publicada' : 'Borrador'}
    </span>
  );
}

export default function EditorContenido({ inicial }: { inicial: Capacitacion }) {
  const [slides, setSlides] = useState(inicial.slides);
  const [slideActivoId, setSlideActivoId] = useState(inicial.slides[0]?.id ?? '');
  const [tituloNuevo, setTituloNuevo] = useState('');
  const [contenidoNuevo, setContenidoNuevo] = useState('');
  const [editandoId, setEditandoId] = useState('');
  const [tituloEditado, setTituloEditado] = useState('');
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const slideActivo = useMemo(() => slides.find((slide) => slide.id === slideActivoId) ?? slides[0] ?? null, [slideActivoId, slides]);

  function cerrarEdicion() {
    setEditandoId('');
    setError('');
  }

  async function crearSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const respuesta = await fetch('/api/capacitaciones/' + inicial.id + '/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: tituloNuevo, contenido: contenidoNuevo }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        if (resultado.detalles) setError(Object.values(resultado.detalles).join(' '));
        else setError(resultado.error || 'No se pudo crear el slide.');
        return;
      }
      const actualizado = [...slides, resultado.datos as Slide];
      setSlides(actualizado);
      setSlideActivoId(resultado.datos.id);
      setTituloNuevo('');
      setContenidoNuevo('');
      setMensaje('Slide agregado. Puedes continuar editándolo o crear el siguiente.');
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  function iniciarEdicion(slide: Slide) {
    setEditandoId(slide.id);
    setTituloEditado(slide.titulo);
    setContenidoEditado(slide.contenido);
    setError('');
    setMensaje('');
  }

  async function guardarEdicion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editandoId) return;
    setGuardando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/capacitaciones/' + inicial.id + '/slides/' + editandoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: tituloEditado, contenido: contenidoEditado }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        if (resultado.detalles) setError(Object.values(resultado.detalles).join(' '));
        else setError(resultado.error || 'No se pudieron guardar los cambios.');
        return;
      }
      setSlides((actuales) => actuales.map((slide) => slide.id === editandoId ? resultado.datos as Slide : slide));
      setMensaje('Los cambios del slide se guardaron.');
      setEditandoId('');
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarSlide(slide: Slide) {
    if (!window.confirm('¿Eliminar el slide “' + slide.titulo + '”? Esta acción no se puede deshacer.')) return;
    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const respuesta = await fetch('/api/capacitaciones/' + inicial.id + '/slides/' + slide.id, { method: 'DELETE' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo eliminar el slide.');
      const actualizados = slides.filter((item) => item.id !== slide.id);
      setSlides(actualizados);
      if (slideActivoId === slide.id) setSlideActivoId(actualizados[0]?.id ?? '');
      if (editandoId === slide.id) setEditandoId('');
      setMensaje('Slide eliminado.');
    } catch (errorEliminacion) {
      setError(errorEliminacion instanceof Error ? errorEliminacion.message : 'No se pudo eliminar el slide.');
    } finally {
      setGuardando(false);
    }
  }

  async function moverSlide(slideId: string, desplazamiento: -1 | 1) {
    const indice = slides.findIndex((slide) => slide.id === slideId);
    const nuevoIndice = indice + desplazamiento;
    if (indice < 0 || nuevoIndice < 0 || nuevoIndice >= slides.length) return;
    const ordenActualizado = [...slides];
    [ordenActualizado[indice], ordenActualizado[nuevoIndice]] = [ordenActualizado[nuevoIndice], ordenActualizado[indice]];
    setGuardando(true);
    setSlides(ordenActualizado);
    setError('');
    try {
      const respuesta = await fetch('/api/capacitaciones/' + inicial.id + '/slides', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden: ordenActualizado.map((slide) => slide.id) }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo guardar el nuevo orden.');
      setSlides(ordenActualizado.map((slide, index) => ({ ...slide, orden: index + 1 })));
    } catch (errorOrden) {
      setSlides(slides);
      setError(errorOrden instanceof Error ? errorOrden.message : 'No se pudo guardar el nuevo orden.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="admin-shell contenido-shell">
      <header className="admin-header">
        <div className="admin-header__inner">
          <Link href="/admin/capacitaciones" className="contenido-regreso">
            <span className="contenido-regreso__icono"><Icono nombre="arrow" /></span>
            <span><strong>Capacitaciones</strong><small>Volver a la biblioteca</small></span>
          </Link>
          <div className="contenido-header__estado"><Estado estado={inicial.estado} /></div>
        </div>
      </header>

      <main className="admin-main contenido-main">
        <nav className="contenido-migas" aria-label="Ruta de navegación">
          <Link href="/admin/capacitaciones">Biblioteca</Link><span aria-hidden="true">/</span><span>Construir contenido</span>
        </nav>

        <section className="contenido-hero">
          <div>
            <p className="kicker-cgb">{inicial.unidad} · {inicial.ambito === 'INTERNO' ? 'Interna' : 'Pública'}</p>
            <h1>{inicial.titulo}</h1>
            <p>{inicial.descripcion}</p>
          </div>
          <div className="contenido-hero__progreso">
            <span className="contenido-hero__contador cifra-tabular">{slides.length.toString().padStart(2, '0')}</span>
            <span>slides<br />creados</span>
          </div>
        </section>

        {mensaje && <div className="admin-alerta admin-alerta--exito" role="status"><span className="admin-alerta__icono"><Icono nombre="check" /></span>{mensaje}<button type="button" className="admin-alerta__cerrar" onClick={() => setMensaje('')} aria-label="Cerrar mensaje"><Icono nombre="close" size={16} /></button></div>}
        {error && <div className="admin-alerta admin-alerta--error" role="alert"><strong>No se pudo completar la acción.</strong><span>{error}</span></div>}

        <div className="contenido-layout">
          <section className="contenido-columna" aria-labelledby="titulo-estructura">
            <div className="contenido-seccion-heading">
              <div><p className="kicker-cgb">Estructura</p><h2 id="titulo-estructura">Slides de la capacitación</h2></div>
              <span className="admin-panel__count cifra-tabular">{slides.length} {slides.length === 1 ? 'slide' : 'slides'}</span>
            </div>

            {slides.length === 0 ? (
              <div className="admin-vacio contenido-vacio">
                <span className="admin-vacio__icono"><Icono nombre="slides" size={27} /></span>
                <h3>Empieza con el primer slide</h3>
                <p>Organiza el contenido en secciones breves. Puedes cambiar el orden cuando lo necesites.</p>
              </div>
            ) : (
              <ol className="contenido-lista">
                {slides.map((slide, index) => (
                  <li key={slide.id} className={'contenido-slide ' + (slide.id === slideActivo?.id ? 'contenido-slide--activo' : '')}>
                    <button type="button" className="contenido-slide__seleccion" onClick={() => { setSlideActivoId(slide.id); cerrarEdicion(); }} aria-current={slide.id === slideActivo?.id ? 'step' : undefined}>
                      <span className="contenido-slide__numero cifra-tabular">{String(index + 1).padStart(2, '0')}</span>
                      <span className="contenido-slide__texto"><strong>{slide.titulo}</strong><small>{slide.contenido.slice(0, 88)}{slide.contenido.length > 88 ? '…' : ''}</small></span>
                    </button>
                    <div className="contenido-slide__acciones">
                      <button type="button" className="contenido-icono-boton" onClick={() => void moverSlide(slide.id, -1)} disabled={index === 0 || guardando} aria-label={'Mover ' + slide.titulo + ' arriba'} title="Mover arriba"><Icono nombre="up" size={16} /></button>
                      <button type="button" className="contenido-icono-boton" onClick={() => void moverSlide(slide.id, 1)} disabled={index === slides.length - 1 || guardando} aria-label={'Mover ' + slide.titulo + ' abajo'} title="Mover abajo"><Icono nombre="down" size={16} /></button>
                      <button type="button" className="contenido-icono-boton" onClick={() => iniciarEdicion(slide)} aria-label={'Editar ' + slide.titulo} title="Editar"><Icono nombre="edit" size={15} /></button>
                      <button type="button" className="contenido-icono-boton contenido-icono-boton--peligro" onClick={() => void eliminarSlide(slide)} disabled={guardando} aria-label={'Eliminar ' + slide.titulo} title="Eliminar"><Icono nombre="trash" size={15} /></button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <form className="contenido-nuevo tarjeta-cgb" onSubmit={crearSlide}>
              <div className="contenido-nuevo__encabezado"><span className="contenido-nuevo__icono"><Icono nombre="plus" /></span><div><h3>Agregar un slide</h3><p>Comienza con una sección informativa de texto.</p></div></div>
              <div className="admin-campo">
                <label htmlFor="nuevo-slide-titulo">Título del slide</label>
                <input id="nuevo-slide-titulo" className="campo-formulario" value={tituloNuevo} onChange={(event) => setTituloNuevo(event.target.value)} placeholder="Ej. Bienvenida" maxLength={80} required minLength={3} />
              </div>
              <div className="admin-campo">
                <label htmlFor="nuevo-slide-contenido">Contenido</label>
                <textarea id="nuevo-slide-contenido" className="campo-formulario campo-formulario--area" value={contenidoNuevo} onChange={(event) => setContenidoNuevo(event.target.value)} placeholder="Escribe la información que verá la persona que realiza la capacitación…" rows={5} maxLength={10000} required />
              </div>
              <button type="submit" className="boton-primario" disabled={guardando}><Icono nombre="plus" /><span>{guardando ? 'Guardando…' : 'Agregar slide'}</span></button>
            </form>
          </section>

          <section className="contenido-columna contenido-columna--vista" aria-labelledby="titulo-vista">
            <div className="contenido-seccion-heading"><div><p className="kicker-cgb">Vista previa</p><h2 id="titulo-vista">Así se verá el contenido</h2></div></div>

            {editandoId ? (
              <form className="contenido-edicion tarjeta-cgb" onSubmit={guardarEdicion}>
                <div className="contenido-edicion__heading"><div><p className="kicker-cgb">Editar slide</p><h3>Actualiza la información</h3></div><button type="button" className="contenido-icono-boton" onClick={cerrarEdicion} aria-label="Cancelar edición"><Icono nombre="close" /></button></div>
                <div className="admin-campo"><label htmlFor="editar-slide-titulo">Título del slide</label><input id="editar-slide-titulo" className="campo-formulario" value={tituloEditado} onChange={(event) => setTituloEditado(event.target.value)} maxLength={80} required minLength={3} /></div>
                <div className="admin-campo"><label htmlFor="editar-slide-contenido">Contenido</label><textarea id="editar-slide-contenido" className="campo-formulario campo-formulario--area" value={contenidoEditado} onChange={(event) => setContenidoEditado(event.target.value)} rows={10} maxLength={10000} required /></div>
                <div className="admin-formulario__acciones"><button type="button" className="boton-secundario" onClick={cerrarEdicion}>Cancelar</button><button type="submit" className="boton-primario" disabled={guardando}><Icono nombre="check" /><span>Guardar slide</span></button></div>
              </form>
            ) : slideActivo ? (
              <div className="visor-diapositiva contenido-preview">
                <div className="contenido-preview__marco"><span className="contenido-preview__marca">CGB ACADEMY</span><span className="contenido-preview__unidad">{inicial.unidad}</span></div>
                <div className="contenido-preview__cuerpo"><p className="kicker-cgb">{inicial.categoria || 'Inducción'}</p><h3>{slideActivo.titulo}</h3><p>{slideActivo.contenido}</p></div>
                <div className="contenido-preview__pie"><span>Slide {slides.findIndex((slide) => slide.id === slideActivo.id) + 1} de {slides.length}</span><span className="contenido-preview__marca-secundaria">Capacitación CGB</span></div>
              </div>
            ) : (
              <div className="visor-diapositiva contenido-preview contenido-preview--vacio">
                <span className="admin-vacio__icono"><Icono nombre="slides" size={27} /></span>
                <h3>La vista previa aparecerá aquí</h3>
                <p>Agrega el primer slide para ver cómo se presenta la información.</p>
              </div>
            )}

            <div className="contenido-pie-ayuda">
              <span className="indicador-operativo" />
              <p>Los cambios se guardan en la capacitación. Puedes volver a esta pantalla desde la biblioteca.</p>
            </div>
          </section>
        </div>

        <footer className="contenido-footer">
          <Link href="/admin/capacitaciones" className="boton-secundario"><Icono nombre="arrow" /><span>Volver a capacitaciones</span></Link>
          <p>{slides.length} {slides.length === 1 ? 'slide listo' : 'slides listos'} para seguir editando.</p>
        </footer>
      </main>
    </div>
  );
}
