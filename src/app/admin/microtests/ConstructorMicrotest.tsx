'use client';

import React, { useState } from 'react';
import {
  MAX_INTENTOS_DEFECTO,
  MAX_OPCIONES,
  MENSAJE_MICROTEST_CON_INTENTOS,
  MIN_OPCIONES,
  NOTA_MINIMA_DEFECTO,
  PreguntaConfigurada,
  calcularPesoPorPregunta,
  puedeModificarMicrotest,
  validarConfiguracionMicrotest,
} from '@/lib/configuracion-microtest';
import {
  eliminarMicrotestCliente,
  guardarMicrotestCliente,
} from '@/lib/microtests-cliente';
import type {
  CapacitacionConMicrotestUI,
  EvaluacionResumenUI,
} from '@/lib/servicio-configuracion-microtest';
import { TarjetaPreguntaMicrotest } from './TarjetaPreguntaMicrotest';

export type { CapacitacionConMicrotestUI, EvaluacionResumenUI };

interface PropsConstructorMicrotest {
  capacitacionesIniciales: CapacitacionConMicrotestUI[];
  capacitacionInicialId?: string;
}

function preguntaVacia(indice: number): PreguntaConfigurada {
  return {
    id: `p-${indice + 1}`,
    enunciado: '',
    opciones: ['', ''],
    correcta: 0,
    retroalimentacion: '',
  };
}

export function ConstructorMicrotest({
  capacitacionesIniciales,
  capacitacionInicialId,
}: PropsConstructorMicrotest) {
  const [capacitaciones, setCapacitaciones] = useState<CapacitacionConMicrotestUI[]>(
    capacitacionesIniciales
  );

  const idInicial =
    capacitacionInicialId || capacitacionesIniciales[0]?.id || '';
  const capInicial = capacitacionesIniciales.find((c) => c.id === idInicial);
  const evInicial = capInicial?.evaluacion ?? null;

  const [capacitacionId, setCapacitacionId] = useState<string>(idInicial);
  const [titulo, setTitulo] = useState<string>(
    evInicial?.titulo ?? 'Microtest Formativo'
  );
  const [notaMinima, setNotaMinima] = useState<number>(
    evInicial?.notaMinima ?? NOTA_MINIMA_DEFECTO
  );
  const [maxIntentos, setMaxIntentos] = useState<number>(
    evInicial?.maxIntentos ?? MAX_INTENTOS_DEFECTO
  );
  const [tiempoLimiteSeg, setTiempoLimiteSeg] = useState<string>(
    evInicial?.tiempoLimiteSeg ? String(evInicial.tiempoLimiteSeg) : ''
  );
  const [preguntas, setPreguntas] = useState<PreguntaConfigurada[]>(
    evInicial?.preguntas && evInicial.preguntas.length > 0
      ? evInicial.preguntas.map((p) => ({
          ...p,
          retroalimentacion: p.retroalimentacion ?? '',
        }))
      : [preguntaVacia(0)]
  );

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [erroresCampo, setErroresCampo] = useState<Record<string, string>>({});

  const capacitacionActual = capacitaciones.find((c) => c.id === capacitacionId);
  const evaluacionActual = capacitacionActual?.evaluacion ?? null;
  const totalIntentos = evaluacionActual?._count?.intentos ?? 0;
  const permisoEdicion = puedeModificarMicrotest(totalIntentos);
  const bloqueadoPorIntentos = !permisoEdicion.permitido;
  const pesoPregunta = calcularPesoPorPregunta(preguntas.length);

  function cargarCapacitacion(nuevoId: string, lista = capacitaciones) {
    setCapacitacionId(nuevoId);
    setMensajeExito(null);
    setErrorGeneral(null);
    setErroresCampo({});

    const encontrada = lista.find((c) => c.id === nuevoId);
    const ev = encontrada?.evaluacion ?? null;
    if (ev) {
      setTitulo(ev.titulo);
      setNotaMinima(ev.notaMinima);
      setMaxIntentos(ev.maxIntentos);
      setTiempoLimiteSeg(ev.tiempoLimiteSeg ? String(ev.tiempoLimiteSeg) : '');
      setPreguntas(
        ev.preguntas.map((p) => ({
          ...p,
          retroalimentacion: p.retroalimentacion ?? '',
        }))
      );
    } else {
      setTitulo('Microtest Formativo');
      setNotaMinima(NOTA_MINIMA_DEFECTO);
      setMaxIntentos(MAX_INTENTOS_DEFECTO);
      setTiempoLimiteSeg('');
      setPreguntas([preguntaVacia(0)]);
    }
  }

  function agregarPregunta() {
    if (bloqueadoPorIntentos) return;
    setPreguntas((prev) => [...prev, preguntaVacia(prev.length)]);
  }

  function eliminarPregunta(indice: number) {
    if (bloqueadoPorIntentos || preguntas.length <= 1) return;
    setPreguntas((prev) =>
      prev
        .filter((_, idx) => idx !== indice)
        .map((p, idx) => ({ ...p, id: `p-${idx + 1}` }))
    );
  }

  function actualizarPregunta(
    indice: number,
    cambios: Partial<PreguntaConfigurada>
  ) {
    if (bloqueadoPorIntentos) return;
    setPreguntas((prev) =>
      prev.map((p, idx) => (idx === indice ? { ...p, ...cambios } : p))
    );
  }

  function agregarOpcion(indicePregunta: number) {
    if (bloqueadoPorIntentos) return;
    setPreguntas((prev) =>
      prev.map((p, idx) => {
        if (idx !== indicePregunta || p.opciones.length >= MAX_OPCIONES) return p;
        return { ...p, opciones: [...p.opciones, ''] };
      })
    );
  }

  function eliminarOpcion(indicePregunta: number, indiceOpcion: number) {
    if (bloqueadoPorIntentos) return;
    setPreguntas((prev) =>
      prev.map((p, idx) => {
        if (idx !== indicePregunta || p.opciones.length <= MIN_OPCIONES) return p;
        const nuevasOpciones = p.opciones.filter((_, i) => i !== indiceOpcion);
        const nuevaCorrecta =
          p.correcta >= nuevasOpciones.length
            ? nuevasOpciones.length - 1
            : p.correcta;
        return { ...p, opciones: nuevasOpciones, correcta: nuevaCorrecta };
      })
    );
  }

  function actualizarOpcion(
    indicePregunta: number,
    indiceOpcion: number,
    valor: string
  ) {
    if (bloqueadoPorIntentos) return;
    setPreguntas((prev) =>
      prev.map((p, idx) => {
        if (idx !== indicePregunta) return p;
        const nuevasOpciones = p.opciones.map((op, i) =>
          i === indiceOpcion ? valor : op
        );
        return { ...p, opciones: nuevasOpciones };
      })
    );
  }

  async function guardarMicrotest(e: React.FormEvent) {
    e.preventDefault();
    if (bloqueadoPorIntentos) return;

    setMensajeExito(null);
    setErrorGeneral(null);
    setErroresCampo({});

    const payload = {
      capacitacionId,
      titulo,
      notaMinima: Number(notaMinima),
      maxIntentos: Number(maxIntentos),
      tiempoLimiteSeg:
        tiempoLimiteSeg.trim() === '' ? null : Number(tiempoLimiteSeg),
      preguntas,
    };

    const validacion = validarConfiguracionMicrotest(payload);
    if (!validacion.valido || !validacion.datos) {
      setErroresCampo(validacion.errores);
      setErrorGeneral('Revisa los campos marcados antes de guardar el microtest.');
      return;
    }

    setGuardando(true);
    try {
      const esEdicion = Boolean(evaluacionActual?.id);
      const resultado = await guardarMicrotestCliente(
        validacion.datos,
        evaluacionActual?.id
      );

      if (!resultado.ok || !resultado.datos) {
        setErrorGeneral(resultado.error || 'No se pudo guardar el microtest.');
        if (resultado.detalles) setErroresCampo(resultado.detalles);
        return;
      }

      const evaluacionGuardada: EvaluacionResumenUI = resultado.datos;
      const nuevasCapacitaciones = capacitaciones.map((c) =>
        c.id === capacitacionId ? { ...c, evaluacion: evaluacionGuardada } : c
      );
      setCapacitaciones(nuevasCapacitaciones);
      setMensajeExito(
        esEdicion
          ? 'Microtest actualizado correctamente.'
          : 'Microtest creado y vinculado a la capacitación.'
      );
    } catch {
      setErrorGeneral('Error de red al guardar el microtest.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarMicrotestActual() {
    if (!evaluacionActual || bloqueadoPorIntentos) return;
    setGuardando(true);
    setMensajeExito(null);
    setErrorGeneral(null);

    try {
      const resultado = await eliminarMicrotestCliente(evaluacionActual.id);
      if (!resultado.ok) {
        setErrorGeneral(resultado.error || 'No se pudo eliminar el microtest.');
        return;
      }

      const nuevasCapacitaciones = capacitaciones.map((c) =>
        c.id === capacitacionId ? { ...c, evaluacion: null } : c
      );
      setCapacitaciones(nuevasCapacitaciones);
      cargarCapacitacion(capacitacionId, nuevasCapacitaciones);
      setMensajeExito('Microtest eliminado correctamente.');
    } catch {
      setErrorGeneral('Error de red al eliminar el microtest.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* CA-03: Selector de capacitación y estado de vinculación */}
      <section className="publicacion-panel">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="kicker-cgb">Vinculación (CA-03)</p>
            <h2 className="text-xl font-bold text-[#092A60]">
              Capacitación Asociada al Microtest
            </h2>
          </div>
          {capacitacionActual && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Estado: {capacitacionActual.estado}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#092A60]">
                Unidad: {capacitacionActual.unidad}
              </span>
              <span
                className={`px-3 py-1 rounded-full ${
                  evaluacionActual
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {evaluacionActual ? 'Microtest vinculado' : 'Sin microtest'}
              </span>
            </div>
          )}
        </div>

        <label
          htmlFor="selector-capacitacion-microtest"
          className="block text-sm font-semibold text-[#092A60] mb-2"
        >
          Seleccionar capacitación
        </label>
        <select
          id="selector-capacitacion-microtest"
          aria-label="Seleccionar capacitación"
          value={capacitacionId}
          onChange={(e) => cargarCapacitacion(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
        >
          {capacitaciones.map((cap) => (
            <option key={cap.id} value={cap.id}>
              {cap.titulo} ({cap.estado} - {cap.unidad})
              {cap.evaluacion ? ' · [Con microtest]' : ' · [Sin microtest]'}
            </option>
          ))}
        </select>
        {erroresCampo.capacitacionId && (
          <p className="mt-1 text-xs font-medium text-red-600">
            {erroresCampo.capacitacionId}
          </p>
        )}
      </section>

      {/* CA-04: Aviso de bloqueo si ya existen intentos respondidos */}
      {bloqueadoPorIntentos && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p className="font-bold">Edición y eliminación bloqueadas (CA-04)</p>
          <p className="mt-1">
            {MENSAJE_MICROTEST_CON_INTENTOS} ({totalIntentos}{' '}
            {totalIntentos === 1 ? 'intento registrado' : 'intentos registrados'}).
          </p>
        </div>
      )}

      {mensajeExito && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-medium text-emerald-900"
        >
          {mensajeExito}
        </div>
      )}

      {errorGeneral && (
        <div
          role="alert"
          className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800"
        >
          {errorGeneral}
        </div>
      )}

      <form onSubmit={guardarMicrotest} className="space-y-6">
        {/* CA-02: Configuración de nota mínima, intentos y temporizador */}
        <section className="publicacion-panel">
          <p className="kicker-cgb">Reglas de Aprobación (CA-02)</p>
          <h2 className="text-xl font-bold text-[#092A60] mb-4">
            Parámetros de Evaluación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="titulo-microtest"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1"
              >
                Título del microtest
              </label>
              <input
                id="titulo-microtest"
                type="text"
                value={titulo}
                disabled={bloqueadoPorIntentos}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              {erroresCampo.titulo && (
                <p className="mt-1 text-xs text-red-600">{erroresCampo.titulo}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="nota-minima-microtest"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1"
              >
                Nota mínima (%)
              </label>
              <input
                id="nota-minima-microtest"
                type="number"
                min={1}
                max={100}
                value={notaMinima}
                disabled={bloqueadoPorIntentos}
                onChange={(e) => setNotaMinima(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              {erroresCampo.notaMinima && (
                <p className="mt-1 text-xs text-red-600">
                  {erroresCampo.notaMinima}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="max-intentos-microtest"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1"
              >
                Máximo de intentos
              </label>
              <input
                id="max-intentos-microtest"
                type="number"
                min={1}
                max={10}
                value={maxIntentos}
                disabled={bloqueadoPorIntentos}
                onChange={(e) => setMaxIntentos(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              {erroresCampo.maxIntentos && (
                <p className="mt-1 text-xs text-red-600">
                  {erroresCampo.maxIntentos}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tiempo-limite-microtest"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1"
              >
                Tiempo límite (seg, opcional)
              </label>
              <input
                id="tiempo-limite-microtest"
                type="number"
                min={30}
                max={7200}
                placeholder="Sin límite"
                value={tiempoLimiteSeg}
                disabled={bloqueadoPorIntentos}
                onChange={(e) => setTiempoLimiteSeg(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              {erroresCampo.tiempoLimiteSeg && (
                <p className="mt-1 text-xs text-red-600">
                  {erroresCampo.tiempoLimiteSeg}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CA-01: Constructor dinámico de preguntas y alternativas */}
        <section className="publicacion-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="kicker-cgb">Banco de Preguntas (CA-01)</p>
              <h2 className="text-xl font-bold text-[#092A60]">
                Preguntas de Opción Múltiple ({preguntas.length})
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Puntaje asignado por pregunta:{' '}
                <strong>{pesoPregunta} pts (%)</strong> de 100%.
              </p>
            </div>

            <button
              type="button"
              disabled={bloqueadoPorIntentos}
              onClick={agregarPregunta}
              className="boton-secundario text-sm"
            >
              + Añadir pregunta
            </button>
          </div>

          <div className="space-y-6">
            {preguntas.map((pregunta, idxP) => (
              <TarjetaPreguntaMicrotest
                key={pregunta.id || idxP}
                pregunta={pregunta}
                idxP={idxP}
                totalPreguntas={preguntas.length}
                pesoPregunta={pesoPregunta}
                bloqueadoPorIntentos={bloqueadoPorIntentos}
                erroresCampo={erroresCampo}
                onEliminarPregunta={eliminarPregunta}
                onActualizarPregunta={actualizarPregunta}
                onAgregarOpcion={agregarOpcion}
                onEliminarOpcion={eliminarOpcion}
                onActualizarOpcion={actualizarOpcion}
              />
            ))}
          </div>
        </section>

        {/* Acciones de guardado y eliminación */}
        <div className="publicacion-acciones">
          <button
            type="submit"
            disabled={guardando || bloqueadoPorIntentos}
            className="boton-primario"
          >
            {guardando
              ? 'Guardando...'
              : evaluacionActual
                ? 'Actualizar microtest'
                : 'Guardar microtest'}
          </button>

          {evaluacionActual && (
            <button
              type="button"
              disabled={guardando || bloqueadoPorIntentos}
              onClick={eliminarMicrotestActual}
              className="boton-secundario text-red-700 border-red-300"
            >
              Eliminar microtest
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
