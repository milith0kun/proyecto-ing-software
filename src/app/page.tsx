import Image from 'next/image';
import Link from 'next/link';
import { CabeceraCgb } from '@/components/institucional/CabeceraCgb';
import { PieCgb } from '@/components/institucional/PieCgb';

type Escuela = {
  id: 'CIIP' | 'GEOMINA' | 'BIOMEDIC';
  nombre: string;
  area: string;
  logo: string;
  descripcion: string;
  temas: string[];
};

const escuelas: Escuela[] = [
  {
    id: 'CIIP',
    nombre: 'CIIP LATAM',
    area: 'Negocios y gestión pública',
    logo: '/logos/ciip-logo.png',
    descripcion:
      'Programas para fortalecer la gestión pública y empresarial, las finanzas, la investigación y la dirección de proyectos.',
    temas: ['Finanzas', 'Gestión pública', 'Proyectos e investigación'],
  },
  {
    id: 'GEOMINA',
    nombre: 'GEOMINA LATAM',
    area: 'Minería y geociencias',
    logo: '/logos/geomina-logo.png',
    descripcion:
      'Formación especializada para los retos de minería, geología, geomecánica, procesamiento y gestión ambiental.',
    temas: ['Geología', 'Operaciones mineras', 'Ambiente y seguridad'],
  },
  {
    id: 'BIOMEDIC',
    nombre: 'BIOMEDIC LATAM',
    area: 'Salud y biociencias',
    logo: '/logos/biomedic-logo.png',
    descripcion:
      'Actualización profesional en biotecnología, salud digital, auditoría médica y gestión de servicios de salud.',
    temas: ['Biociencias', 'Salud digital', 'Gestión hospitalaria'],
  },
];

const atributos = [
  {
    numero: '01',
    titulo: 'Aprende a tu ritmo',
    descripcion:
      'Encuentra programas en vivo y cursos asincrónicos para avanzar según tu disponibilidad.',
  },
  {
    numero: '02',
    titulo: 'Especialízate con propósito',
    descripcion:
      'Elige una escuela y explora contenidos pensados para los desafíos de tu campo profesional.',
  },
  {
    numero: '03',
    titulo: 'Continúa tu recorrido',
    descripcion:
      'Revisa las capacitaciones disponibles y vuelve al catálogo cuando quieras descubrir nuevos temas.',
  },
];

function TarjetaEscuela({ escuela }: { escuela: Escuela }) {
  return (
    <Link
      href={`/capacitaciones?unidad=${escuela.id}`}
      className="tarjeta-cgb tarjeta-escuela group"
      aria-label={`Explorar capacitaciones de ${escuela.nombre}`}
    >
      <div className="tarjeta-escuela__marca">
        <Image
          src={escuela.logo}
          alt={`Logo de ${escuela.nombre}`}
          fill
          sizes="140px"
          className="object-contain object-left"
        />
      </div>
      <p className="tarjeta-escuela__area">{escuela.area}</p>
      <h3 className="tarjeta-escuela__titulo">{escuela.nombre}</h3>
      <p className="tarjeta-escuela__descripcion">{escuela.descripcion}</p>
      <ul className="tarjeta-escuela__temas" aria-label={`Áreas de ${escuela.nombre}`}>
        {escuela.temas.map((tema) => <li key={tema}>{tema}</li>)}
      </ul>
      <span className="tarjeta-escuela__enlace">
        Ver capacitaciones
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

export default function PaginaInicio() {
  return (
    <div className="flex min-h-screen flex-col">
      <CabeceraCgb />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--bg-primary)] px-6 pb-20 pt-16">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(20,98,135,0.08)] px-4 py-1.5">
              <span className="kicker-cgb">Formación para profesionales de Latinoamérica</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-[#092A60] sm:text-5xl md:text-6xl">
              Aprende. Especialízate. <br className="hidden sm:inline" />
              <span className="text-[#146287]">Avanza con CGB Academy.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[#434654] sm:text-lg">
              Explora programas en vivo y cursos a tu ritmo en gestión, minería y ciencias de la salud. Elige una escuela y encuentra formación conectada con tu campo profesional.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/capacitaciones" className="boton-primario">
                <span>Explorar capacitaciones</span>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="#unidades" className="boton-secundario">
                <span>Conocer las escuelas</span>
              </Link>
            </div>
          </div>
        </section>

        <section id="unidades" className="scroll-mt-20 bg-[var(--bg-surface-alt)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="kicker-cgb mb-2">Tres escuelas, distintas especialidades</p>
              <h2 className="text-2xl font-extrabold text-[#092A60] sm:text-3xl">
                Encuentra tu área de formación
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6673] sm:text-base">
                CGB Academy reúne a CIIP, GEOMINA y BIOMEDIC para acompañar tu desarrollo en sectores profesionales diferentes.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {escuelas.map((escuela) => <TarjetaEscuela key={escuela.id} escuela={escuela} />)}
            </div>
          </div>
        </section>

        <section className="acto-oscuro py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                CGB Academy
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Una formación que se adapta a tu camino
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(255,255,255,0.76)] sm:text-base">
                Conoce las modalidades y áreas de estudio desde un solo lugar, y continúa al catálogo de capacitaciones cuando encuentres tu próximo objetivo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {atributos.map((atributo) => (
                <article key={atributo.numero} className="tarjeta-cgb tarjeta-atributo">
                  <span className="tarjeta-atributo__numero">{atributo.numero}</span>
                  <h3>{atributo.titulo}</h3>
                  <p>{atributo.descripcion}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/capacitaciones" className="boton-secundario-claro">
                Ver catálogo de capacitaciones
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PieCgb />
    </div>
  );
}
