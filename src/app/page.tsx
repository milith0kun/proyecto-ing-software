import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased">
      <div className="max-w-2xl w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Proyecto Inicializado
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          CGB Academy
        </h1>
        <p className="mt-2 text-slate-400 text-base leading-relaxed">
          Plataforma de Educación Continua — Entorno Next.js 16 con App Router, TypeScript, Tailwind CSS y MongoDB Atlas configurado con Prisma ORM.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-750">
            <h3 className="text-sm font-semibold text-slate-200">Base de Datos</h3>
            <p className="mt-1 text-xs text-slate-400">MongoDB Atlas (Cluster0)</p>
            <span className="inline-block mt-2 text-xs font-medium text-emerald-400">Prisma Conectado</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-750">
            <h3 className="text-sm font-semibold text-slate-200">Arquitectura</h3>
            <p className="mt-1 text-xs text-slate-400">Next.js 16 (Turbopack) & App Router</p>
            <span className="inline-block mt-2 text-xs font-medium text-sky-400">Listo para Desarrollo</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            UNSAAC — Ingeniería de Software
          </div>
          <Link
            href="/api/health"
            target="_blank"
            className="text-xs font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Verificar API Health (/api/health)
          </Link>
        </div>
      </div>
    </main>
  );
}
