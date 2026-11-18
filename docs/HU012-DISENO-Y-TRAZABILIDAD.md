# HU-012 — Historia, diseño y trazabilidad

Complementa `HU012-VALIDACION.md` con lo que piden las diapositivas 3 a 6.

## Historia (diapositiva 4)

Como colaborador, quiero completar una capacitación interna y que se registre mi avance, para retomarla donde la dejé y acreditar que la terminé.

- Los criterios de aceptación CA1–CA5 son propios de la historia y están en `HU012-VALIDACION.md`.
- La DoD es común a todas las historias y es la del equipo (`docs/definition-of-done.md`, PR #12). Esta rama no la define.
- Los requisitos no funcionales (privacidad, integridad ante concurrencia, estados accesibles) se comprueban con pruebas y se incluyen en la DoD.

## Arquitectura en capas (diapositiva 6)

Cada capa solo usa a la inmediatamente inferior:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/colaborador/capacitaciones/[id]/page.tsx`, `VisorCapacitacionInterna.tsx`, `src/app/capacitaciones/[id]/SlideViewer.tsx` | Mostrar slides, estado de guardado y reintento |
| Controlador (API) | `src/app/api/colaborador/capacitaciones/[id]/progreso/**/route.ts` | Reexportar `consultarProgreso`, `guardarProgreso` y `finalizarProgreso` |
| Lógica de negocio | `src/lib/servicio-progreso.ts`, `src/lib/progreso-capacitacion.ts` | Orquestar la solicitud (servicio) y reglas puras: avance, reanudación, no saltar slides, finalización |
| Acceso a datos | `src/lib/repositorio-progreso.ts` (también lo usa la página del visor), `prisma/schema.prisma` | Único módulo del flujo que conoce Prisma/MongoDB |

## Principios de diseño (diapositiva 5)

- **Responsabilidad única y cohesión:** las reglas puras no dependen de HTTP ni de la base de datos y se prueban sin ellas.
- **Inversión de dependencias:** el servicio llama al repositorio y no a Prisma. Cambiar la persistencia afecta a un solo archivo.
- **Bajo acoplamiento:** las rutas no contienen lógica, solo delegan.

## Trazabilidad y configuración (diapositiva 3)

| Tarea Jira | Commit | Ítem de configuración |
|---|---|---|
| CGB-57 (RED) | `c498ea8` | `tests/progreso-capacitacion.test.mjs` |
| CGB-58 / CGB-59 | `85521e8` | `prisma/schema.prisma`, `src/lib/*progreso*`, rutas de API |
| CGB-56 (interfaz) | `9594db6` | `src/app/colaborador/**`, `SlideViewer.tsx`, `tests/visor-progreso.test.mjs` |
| CGB-60 (validación) | `7188481` | `docs/HU012-VALIDACION.md` |
| Refactor de capas | ver historial de la rama | `src/lib/repositorio-progreso.ts` |

Los commits siguen `tipo(CGB-n): descripción`.

## Pendiente (no se puede cerrar desde el código)

- Abrir el Pull Request enlazado a CGB-56 y obtener una revisión independiente (diapositivas 3 y 4).
- Validar la DoD con el equipo y con Jira.
- Etiquetar la versión y registrar la aprobación de la línea base una vez integrado.
