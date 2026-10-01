import Image from 'next/image';
import Link from 'next/link';

export default function PaginaInicio() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Encabezado Institucional Fijo */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[rgba(9,42,96,0.08)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-36">
              <Image
                src="/logos/cgb-logo.png"
                alt="CGB Academy"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <span className="hidden sm:inline-block h-6 w-px bg-[rgba(9,42,96,0.12)]"></span>
            <span className="hidden sm:inline-block text-xs font-semibold tracking-wide text-[#092A60]">
              Centro de Capacitación e Inducción
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/api/health"
              target="_blank"
              className="boton-secundario text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>Estado API</span>
            </Link>

            <Link
              href="#unidades"
              className="boton-primario"
            >
              <span>Explorar Capacitaciones</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Acto Principal: Hero Section (Lienzo Claro Canónico #F9FAFB) */}
      <section className="relative pt-16 pb-20 px-6 bg-[var(--bg-primary)] overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(20,98,135,0.08)] mb-6">
            <span className="kicker-cgb">Plataforma Institucional 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#092A60] leading-tight">
            Centro de Capacitación <br className="hidden sm:inline" />
            <span className="text-[#146287]">e Inducción Corporativa</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#434654] max-w-3xl mx-auto leading-relaxed">
            Ecosistema de aprendizaje y orientación estructurado mediante diapositivas interactivas, rutas jerárquicas de onboarding y microevaluaciones continuas para colaboradores y comunidad educativa.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="#unidades" className="boton-primario">
              <span>Iniciar Onboarding</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link href="#arquitectura" className="boton-secundario">
              <span>Especificación Técnica</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Superficie Intermedia: Unidades Institucionales (#F3F6FA) */}
      <section id="unidades" className="py-20 px-6 bg-[var(--bg-surface-alt)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="kicker-cgb mb-2">Unidades Especializadas</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#092A60]">
              Formación Especializada CGB Academy
            </h2>
            <p className="mt-3 text-sm text-[#5F6673]">
              Inducción y capacitación transversal articulada para las tres unidades estratégicas de la organización.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unidad CIIP */}
            <div className="tarjeta-cgb">
              <div className="relative h-14 w-32 mb-6">
                <Image
                  src="/logos/ciip-logo.png"
                  alt="CIIP LATAM"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className="text-xl font-bold text-[#092A60] mb-2">
                CIIP LATAM
              </h3>
              <p className="text-sm text-[#434654] leading-relaxed mb-6 flex-1">
                Centro Internacional de Investigación y Postgrado. Especialización avanzada en ingeniería, gestión de proyectos y desarrollo tecnológico.
              </p>
              <div className="pt-4 border-t border-[rgba(9,42,96,0.06)] mt-auto flex items-center justify-between text-xs text-[#5F6673]">
                <span>Inducción Profesional</span>
                <span className="font-bold text-[#146287]">Activa</span>
              </div>
            </div>

            {/* Unidad GEOMINA */}
            <div className="tarjeta-cgb">
              <div className="relative h-14 w-32 mb-6">
                <Image
                  src="/logos/geomina-logo.png"
                  alt="GEOMINA LATAM"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className="text-xl font-bold text-[#092A60] mb-2">
                GEOMINA LATAM
              </h3>
              <p className="text-sm text-[#434654] leading-relaxed mb-6 flex-1">
                Especialización en geología aplicada, ingeniería de minas, geotecnia y procesamiento minero con enfoque de sostenibilidad ambiental.
              </p>
              <div className="pt-4 border-t border-[rgba(9,42,96,0.06)] mt-auto flex items-center justify-between text-xs text-[#5F6673]">
                <span>Inducción Técnica</span>
                <span className="font-bold text-[#146287]">Activa</span>
              </div>
            </div>

            {/* Unidad BIOMEDIC */}
            <div className="tarjeta-cgb">
              <div className="relative h-14 w-32 mb-6">
                <Image
                  src="/logos/biomedic-logo.png"
                  alt="BIOMEDIC LATAM"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className="text-xl font-bold text-[#092A60] mb-2">
                BIOMEDIC LATAM
              </h3>
              <p className="text-sm text-[#434654] leading-relaxed mb-6 flex-1">
                Capacitación continua en ciencias biomédicas, instrumentación médica, tecnologías para la salud e investigación clínica aplicada.
              </p>
              <div className="pt-4 border-t border-[rgba(9,42,96,0.06)] mt-auto flex items-center justify-between text-xs text-[#5F6673]">
                <span>Inducción en Salud</span>
                <span className="font-bold text-[#146287]">Activa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Acto Oscuro Curvo Institucional (Navy #092A60) */}
      <section id="arquitectura" className="acto-oscuro py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <span className="punto-vivo"></span>
              Estado de Infraestructura
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Arquitectura del Sistema
            </h2>
            <p className="mt-3 text-sm text-[rgba(255,255,255,0.72)]">
              Despliegue ágil en contenedor bajo especificación ISO/IEC 25010 y SWEBOK v4.0.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#4DC4D3] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-white mb-1">Base de Datos</h4>
              <p className="text-xs text-[rgba(255,255,255,0.72)] leading-relaxed mb-4">
                MongoDB Atlas Cluster0 conectado mediante Prisma ORM con patrón Singleton.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4DC4D3] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4DC4D3]"></span>
                <span>Conexión Verificada</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#4DC4D3] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-white mb-1">Desarrollo y CI/CD</h4>
              <p className="text-xs text-[rgba(255,255,255,0.72)] leading-relaxed mb-4">
                Next.js 16 con motor Turbopack, App Router y compilación automatizada en Dokploy.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4DC4D3] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4DC4D3]"></span>
                <span>Node.js 20 LTS</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#4DC4D3] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-white mb-1">Equipo y Método</h4>
              <p className="text-xs text-[rgba(255,255,255,0.72)] leading-relaxed mb-4">
                Scrum + Kanban con límites WIP (Desarrollo: 3, Revisión: 2) y ciclo técnico TDD.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4DC4D3] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4DC4D3]"></span>
                <span>5 Miembros UNSAAC</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/api/health"
              target="_blank"
              className="boton-secundario-claro"
            >
              <span>Consultar Diagnóstico /api/health</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Pie de Página Institucional Navy Profundo (#05183A) */}
      <footer className="acto-oscuro-profundo py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[rgba(255,255,255,0.6)]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">CGB Academy</span>
            <span>—</span>
            <span>Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)</span>
          </div>

          <div>
            Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica | Semestre 2026-I
          </div>
        </div>
      </footer>
    </div>
  );
}
