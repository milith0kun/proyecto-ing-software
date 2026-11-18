# HU-013 — Historia, diseño y trazabilidad (CGB-61)

Complementa `HU013-VALIDACION.md` con lo que piden las diapositivas 3 a 6.

## Historia y requisitos (diapositiva 4)

Como Administrador o Evaluador, quiero crear y adjuntar evaluaciones cortas (microtests) a una capacitación, para medir la retención de conocimientos del colaborador mediante preguntas de opción múltiple.

- **3 C (Tarjeta + Conversación + Confirmación):** la tarjeta es `CGB-61` en Jira; la conversación con el PO define que un microtest con intentos registrados por alumnos no se modifica ni elimina (`409 Conflict`); la confirmación son los criterios `CA-01` a `CA-04` verificados con pruebas automatizadas.
- **Criterios de aceptación ≠ DoD:** `CA-01` a `CA-04` son requisitos funcionales propios de `HU-013`. La `Definition of Done` es común al equipo e incorpora los **Requisitos No Funcionales (RNF)** aplicables: `RNF-001` (responsive), `RNF-002` (español), `RNF-005` (acceso interno solo Administrador), `RNF-008` (consistencia visual CGB) y `RNF-010` (integridad de calificaciones registradas).
- **INVEST y dependencias:** `CGB-61` define la configuración de evaluaciones que consume `CGB-66` (`HU-014: Realizar microtest formativo`).

## Arquitectura en capas (diapositiva 6)

El sistema se organiza como un **monolito modular en capas sobre Next.js**, donde cada capa $n$ consume únicamente la capa inmediatamente inferior $n-1$:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/admin/microtests/page.tsx`, `src/app/admin/microtests/ConstructorMicrotest.tsx`, `src/app/admin/microtests/TarjetaPreguntaMicrotest.tsx`, `src/lib/microtests-cliente.ts` | `page.tsx` consulta `obtenerCapacitacionesConMicrotestInicial()` del servicio; `ConstructorMicrotest.tsx` coordina el formulario; `TarjetaPreguntaMicrotest.tsx` renderiza cada pregunta y sus opciones; `microtests-cliente.ts` encapsula las llamadas `fetch` del navegador |
| Controlador (API) | `src/app/api/microtests/route.ts`, `src/app/api/microtests/[id]/route.ts`, `src/lib/microtests-http.ts` | Intermediarios HTTP: verifican rol administrador (`exigirAdministrador`), leen parámetros/JSON (`leerObjetoJson`), invocan al servicio y traducen resultados o `ErrorConfiguracionMicrotest` a `NextResponse` (`responderErrorMicrotest`) |
| Lógica de negocio | `src/lib/servicio-configuracion-microtest.ts`, `src/lib/configuracion-microtest.ts` | `servicio-configuracion-microtest.ts` orquesta los casos de uso **sin acoplamiento a HTTP (`NextRequest`/`NextResponse`) ni a Prisma**; `configuracion-microtest.ts` contiene las reglas puras (`validarPreguntaMicrotest`, `validarConfiguracionMicrotest`, `calcularPesoPorPregunta`, `puedeModificarMicrotest`) |
| Acceso a datos | `src/lib/repositorio-configuracion-microtest.ts`, `prisma/schema.prisma` | Único módulo del flujo HU-013 que importa `@/lib/prisma` y detecta errores de unicidad `P2002` (`esErrorUnicidadMicrotestPrisma`) |

### Justificación arquitectónica y de base de datos (diapositiva 6)

- **Por qué monolito modular en capas:** desplegar una sola unidad evita latencia de red entre servicios y sobrecosto operativo en el VPS objetivo (`RNF-003`: 2 vCPU y 8 GB RAM), manteniendo fronteras claras entre la configuración del microtest (`HU-013`) y la resolución del intento (`HU-014`).
- **Por qué tipo embebido `PreguntaEvaluacion[]` en MongoDB Atlas con Prisma:** las preguntas y alternativas de un microtest se consultan y actualizan siempre como una unidad atómica junto con `Evaluacion` (y se bloquean juntas cuando existen intentos en `IntentoEvaluacion`), por lo que embeber `PreguntaEvaluacion[]` evita `JOIN` innecesarios y garantiza atomicidad a nivel de documento en MongoDB.

## Principios de diseño (diapositiva 5)

- **Responsabilidad única (SRP) y alta cohesión:**
  - `src/lib/configuracion-microtest.ts` contiene únicamente reglas puras de validación y cálculo de puntaje por pregunta, sin depender de HTTP ni de Prisma.
  - `src/lib/servicio-configuracion-microtest.ts` orquesta casos de uso de negocio sin construir respuestas `NextResponse`.
  - `src/lib/microtests-http.ts` concentra la traducción a respuestas HTTP (`400`, `404`, `409`, `503`), homólogo a `organizacion-http.ts` (`CGB-31`) y `rutas-http.ts` (`CGB-36`).
  - `src/lib/microtests-cliente.ts` descarga a `ConstructorMicrotest.tsx` de las llamadas `fetch`.
- **Inversión de dependencias (DIP) y separación estricta de capas ($n \to n-1$):** `page.tsx` llama al servicio (`servicio-configuracion-microtest.ts`), y el servicio llama al repositorio (`repositorio-configuracion-microtest.ts`). Cambiar detalles de persistencia solo afecta al repositorio.
- **Evitar sobreingeniería:** no se crearon jerarquías de clases o fábricas innecesarias.

## Trazabilidad y configuración (diapositiva 3)

| Tarea Jira | Commit | Ítem de configuración |
|---|---|---|
| CGB-62 (T1 RED) | `f63bf3b` | `prisma/schema.prisma`, `src/lib/configuracion-microtest.ts`, `tests/configuracion-microtest.test.mjs` |
| CGB-63 (T2 GREEN) | `fd78911` | `src/lib/repositorio-configuracion-microtest.ts`, `src/lib/servicio-configuracion-microtest.ts`, `src/app/api/microtests/**`, `tests/configuracion-microtest-api.test.mjs` |
| CGB-64 (T3 REFACTOR) | `d97795d` y refactor de capas | `src/app/admin/microtests/**`, `src/lib/microtests-http.ts`, `src/lib/microtests-cliente.ts`, `tests/configuracion-microtest-ui.test.mjs` |
| CGB-65 (T4 VALIDACIÓN) | commit actual | `docs/HU013-VALIDACION.md`, `docs/HU013-DISENO-Y-TRAZABILIDAD.md` |
