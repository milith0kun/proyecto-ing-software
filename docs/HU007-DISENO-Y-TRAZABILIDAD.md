# HU-007 — Historia, diseño y trazabilidad (CGB-31)

Complementa `HU007-VALIDACION.md` con lo que piden las diapositivas 3 a 6.

## Historia y requisitos (diapositiva 4)

Como Administrador, quiero crear y gestionar las áreas organizacionales y sus puestos de trabajo asociados, para estructurar la jerarquía de la organización y asignar posteriormente las rutas de aprendizaje correspondientes.

- **3 C (Tarjeta + Conversación + Confirmación):** la tarjeta es `CGB-31` en Jira; la conversación con el PO define qué ocurre ante duplicados y bajas de áreas; la confirmación son los criterios `CA-01` a `CA-04` verificados con pruebas automatizadas.
- **Criterios de aceptación ≠ DoD:** `CA-01` a `CA-04` son requisitos funcionales propios de `HU-007`. La `Definition of Done` es común al equipo e incorpora los **Requisitos No Funcionales (RNF)** aplicables: `RNF-001` (responsive), `RNF-002` (español), `RNF-005` (acceso interno solo Administrador), `RNF-008` (consistencia visual CGB) y `RNF-010` (integridad referencial sin borrado en cascada).
- **INVEST y dependencias:** `CGB-31` es la base sobre la que se apoyan `CGB-36` (rutas de onboarding) y `CGB-41` (registro de colaboradores).

## Arquitectura en capas (diapositiva 6)

El sistema se organiza como un **monolito modular en capas sobre Next.js**, donde cada capa solo consume la inmediatamente inferior:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/admin/organizacion/page.tsx`, `src/app/admin/organizacion/PanelOrganizacion.tsx` | Mostrar la jerarquía en acordeón (`Área → Puestos → Colaboradores`), buscador, filtros y modales |
| Controlador (API) | `src/app/api/organizacion/areas/route.ts`, `src/app/api/organizacion/areas/[id]/route.ts`, `src/app/api/organizacion/puestos/route.ts` | Reexportar `listarAreasOrganizacion`, `crearAreaOrganizacion`, `actualizarAreaOrganizacion`, `eliminarAreaOrganizacion`, `listarPuestosOrganizacion` y `crearPuestoOrganizacion` |
| Lógica de negocio | `src/lib/servicio-organizacion.ts`, `src/lib/organizacion.ts` | Orquestar la solicitud en el servicio y aplicar reglas puras: normalización, unicidad insensible a tildes/mayúsculas (`claveNombre`) y armado jerárquico (`armarEstructura`) |
| Acceso a datos | `src/lib/repositorio-organizacion.ts` (usado también por `page.tsx`), `prisma/schema.prisma` | Único módulo del flujo de organización que conoce Prisma/MongoDB |

### Justificación arquitectónica y de base de datos (diapositiva 6)

- **Por qué monolito modular en capas (y no microservicios):** según la recomendación de la sesión 6 (comenzar con un monolito modular cuando el equipo y la carga son acotados), desplegar una sola unidad evita latencia de red entre servicios, transacciones distribuidas y sobrecosto operativo en la infraestructura objetivo (`RNF-003`: VPS de 2 vCPU y 8 GB RAM), manteniendo fronteras claras por módulos (`organizacion`, `rutas`, `progreso`, `evaluacion`).
- **Por qué MongoDB Atlas con Prisma ORM:** en CGB Academy coexisten documentos con estructura flexible/polimórfica (diapositivas interactivas con listas, imágenes, botones y cuestionarios embebidos) junto con relaciones jerárquicas (`Area → PuestoTrabajo → RutaOnboarding`). MongoDB Atlas almacena de forma nativa documentos anidados sin `JOIN` costosos al recorrer slides, mientras que Prisma aporta tipado estático, índices compuestos (`@@unique([areaId, nombreClave])`) y reglas de integridad referencial (`onDelete: Restrict`, `RNF-010`).

## Principios de diseño (diapositiva 5)

- **Responsabilidad única (SRP) y alta cohesión:** `src/lib/organizacion.ts` contiene únicamente reglas puras de validación y armado de jerarquía, sin depender de HTTP (`NextRequest`) ni de Prisma; se prueba de forma aislada en `tests/organizacion.test.mjs`.
- **Inversión de dependencias (DIP):** `src/lib/servicio-organizacion.ts` delega las lecturas y escrituras a `src/lib/repositorio-organizacion.ts` en lugar de invocar a Prisma directamente. Cambiar detalles de persistencia solo afecta al repositorio.
- **Bajo acoplamiento:** los controladores `route.ts` no contienen condicionales de negocio ni consultas a base de datos; solo delegan al servicio.
- **Evitar sobreingeniería:** no se crearon clases Strategy o fábricas artificiales donde las reglas de validación de nombres y duplicados son estables y directas.

## Trazabilidad y configuración (diapositiva 3)

| Tarea Jira | Commit | Ítem de configuración |
|---|---|---|
| CGB-32 (T1 RED) | `42eb4a4` | `tests/organizacion.test.mjs`, `src/lib/organizacion.ts`, `prisma/schema.prisma` |
| CGB-33 (T2 GREEN) | `b9086d2` | `prisma/schema.prisma`, `src/app/api/organizacion/**`, `tests/organizacion-api.test.mjs` |
| CGB-34 (T3 REFACTOR) | `3726f0c` | `src/app/admin/organizacion/**`, `src/app/globals.css`, `tests/organizacion-ui.test.mjs` |
| CGB-35 (T4 VALIDACIÓN) | `ce84f2b` | `docs/HU007-VALIDACION.md` |
| Alineación de capas (diaps. 4–6) | ver historial de la rama | `src/lib/repositorio-organizacion.ts`, `src/lib/servicio-organizacion.ts`, `docs/HU007-DISENO-Y-TRAZABILIDAD.md` |
