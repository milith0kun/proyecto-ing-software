# HU-007 — Historia, diseño y trazabilidad (CGB-31)

Complementa `HU007-VALIDACION.md` con lo que piden las diapositivas 3 a 6.

## Historia y requisitos (diapositiva 4)

Como Administrador de RR. HH., quiero crear y gestionar las áreas organizacionales y sus puestos de trabajo asociados, para estructurar la jerarquía de la organización y asignar posteriormente las rutas de aprendizaje correspondientes.

- **3 C (Tarjeta + Conversación + Confirmación):** la tarjeta es `CGB-31` en Jira; la conversación con el PO define qué ocurre ante duplicados y bajas de áreas (desactivar con `PATCH` en lugar de borrar en cascada); la confirmación son los criterios `CA-01` a `CA-04` verificados con pruebas automatizadas.
- **Criterios de aceptación ≠ DoD:** `CA-01` a `CA-04` son requisitos funcionales propios de `HU-007`. La `Definition of Done` es común al equipo e incorpora los **Requisitos No Funcionales (RNF)** aplicables: `RNF-001` (responsive), `RNF-002` (español), `RNF-005` (acceso interno solo Administrador), `RNF-008` (consistencia visual CGB) y `RNF-010` (integridad referencial sin borrado en cascada).
- **INVEST y dependencias:** `CGB-31` es la base sobre la que se apoyan `CGB-36` (rutas de onboarding) y `CGB-41` (registro de colaboradores).

## Arquitectura en capas (diapositiva 6)

El sistema se organiza como un **monolito modular en capas sobre Next.js**, donde cada capa $n$ consume únicamente la capa inmediatamente inferior $n-1$:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/admin/organizacion/page.tsx`, `src/app/admin/organizacion/PanelOrganizacion.tsx`, `src/app/admin/organizacion/ListaAcordeonAreas.tsx`, `src/app/admin/organizacion/ModalesOrganizacion.tsx`, `src/lib/organizacion-cliente.ts` | `page.tsx` consulta `obtenerEstructuraOrganizacional()` del servicio; `PanelOrganizacion.tsx` coordina estado y filtros; `ListaAcordeonAreas.tsx` renderiza el acordeón; `ModalesOrganizacion.tsx` separa los diálogos; `organizacion-cliente.ts` encapsula las llamadas `fetch` del navegador |
| Controlador (API) | `src/app/api/organizacion/areas/route.ts`, `src/app/api/organizacion/areas/[id]/route.ts`, `src/app/api/organizacion/puestos/route.ts`, `src/lib/organizacion-http.ts` | Intermediarios HTTP: verifican rol administrador (`exigirAdministrador`), leen parámetros/JSON (`leerObjetoJson`), invocan al servicio y traducen resultados o `ErrorOrganizacion` a `NextResponse` (`responderErrorOrganizacion`) |
| Lógica de negocio | `src/lib/servicio-organizacion.ts`, `src/lib/organizacion.ts` | `servicio-organizacion.ts` orquesta los casos de uso **sin acoplamiento a HTTP (`NextRequest`/`NextResponse`) ni a Prisma**; `organizacion.ts` contiene las reglas puras (`validarArea`, `validarPuesto`, `existeNombreDuplicado`, `puedeAgregarPuestoAArea`, `puedeEliminarArea`, `armarEstructura`) |
| Acceso a datos | `src/lib/repositorio-organizacion.ts`, `prisma/schema.prisma` | Único módulo del flujo de organización que importa `@/lib/prisma` y detecta errores de unicidad `P2002` (`esErrorUnicidadPrisma`) |

### Justificación arquitectónica y de base de datos (diapositiva 6)

- **Por qué monolito modular en capas (y no microservicios):** según la recomendación de la sesión 6 (comenzar con un monolito modular cuando el equipo y la carga son acotados), desplegar una sola unidad evita latencia de red entre servicios, transacciones distribuidas y sobrecosto operativo en la infraestructura objetivo (`RNF-003`: VPS de 2 vCPU y 8 GB RAM), manteniendo fronteras claras por módulos (`organizacion`, `rutas`, `progreso`, `evaluacion`).
- **Por qué MongoDB Atlas con Prisma ORM:** en CGB Academy coexisten documentos con estructura flexible/polimórfica (diapositivas interactivas con listas, imágenes, botones y cuestionarios embebidos) junto con relaciones jerárquicas (`Area → PuestoTrabajo → RutaOnboarding`). MongoDB Atlas almacena de forma nativa documentos anidados sin `JOIN` costosos al recorrer slides, mientras que Prisma aporta tipado estático, índices compuestos (`@@unique([areaId, nombreClave])`) y reglas de integridad referencial (`onDelete: Restrict`, `RNF-010`).

## Principios de diseño (diapositiva 5)

- **Responsabilidad única (SRP) y alta cohesión:**
  - `src/lib/organizacion.ts` contiene únicamente reglas puras de validación y armado de jerarquía, sin depender de HTTP ni de Prisma.
  - `src/lib/servicio-organizacion.ts` orquesta casos de uso de negocio sin construir respuestas `NextResponse`.
  - `src/lib/organizacion-http.ts` concentra la traducción a respuestas HTTP (`400`, `404`, `409`, `503`), homólogo a `rutas-http.ts` de `CGB-36`.
  - `src/lib/organizacion-cliente.ts` y `ModalesOrganizacion.tsx` descargan a `PanelOrganizacion.tsx` de las llamadas `fetch` y de los formularios modales.
- **Inversión de dependencias (DIP) y separación estricta de capas ($n \to n-1$):** `page.tsx` llama al servicio (`servicio-organizacion.ts`), y el servicio llama al repositorio (`repositorio-organizacion.ts`). Cambiar detalles de persistencia solo afecta al repositorio.
- **Evitar sobreingeniería:** no se crearon clases Strategy o fábricas artificiales donde las reglas de validación de nombres y duplicados son estables y directas.

## Trazabilidad y configuración (diapositiva 3)

| Tarea Jira | Commit | Ítem de configuración |
|---|---|---|
| CGB-32 (T1 RED) | `42eb4a4` | `tests/organizacion.test.mjs`, `src/lib/organizacion.ts`, `prisma/schema.prisma` |
| CGB-33 (T2 GREEN) | `b9086d2` | `prisma/schema.prisma`, `src/app/api/organizacion/**`, `tests/organizacion-api.test.mjs` |
| CGB-34 (T3 REFACTOR) | `3726f0c`, `3546500`, `1580e64` y refactor actual | `src/app/admin/organizacion/**`, `src/lib/organizacion-http.ts`, `src/lib/organizacion-cliente.ts`, `src/lib/servicio-organizacion.ts`, `src/lib/repositorio-organizacion.ts`, `tests/organizacion-ui.test.mjs` |
| CGB-35 (T4 VALIDACIÓN) | `ce84f2b` y actualización actual | `docs/HU007-VALIDACION.md`, `docs/HU007-DISENO-Y-TRAZABILIDAD.md` |
