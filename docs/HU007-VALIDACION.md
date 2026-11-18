# HU-007 — Crear área y puestos de trabajo (CGB-31)

- **Historia Jira:** `CGB-31` (`https://cgb-academy.atlassian.net/browse/CGB-31`)
- **Subtareas asociadas:** `CGB-32` (T1 RED), `CGB-33` (T2 GREEN), `CGB-34` (T3 REFACTOR), `CGB-35` (T4 VALIDACIÓN)
- **Responsable:** Alex Carpio (`feature/CGB-31-areas-y-puestos`, base `42eb4a4`)

---

## 1. Decisiones técnicas y de alcance

1. **Unicidad real en base de datos sin tildes ni mayúsculas (punto 5 de revisión):**
   - `Area` y `PuestoTrabajo` en `prisma/schema.prisma` incorporan el campo `nombreClave` normalizado mediante `claveNombre` (sin tildes, minúsculas y espacios colapsados): `@unique` en `Area.nombreClave` y `@@unique([areaId, nombreClave])` en `PuestoTrabajo`.
   - Además de la validación previa en los handlers, los endpoints capturan errores `P2002` de Prisma para responder HTTP `409` con `El área o puesto ya existe en la organización` incluso ante solicitudes concurrentes.
2. **Protección contra borrado en cascada (punto 6 de revisión / `RNF-010`):**
   - La relación `PuestoTrabajo.area` cambia de `onDelete: Cascade` a `onDelete: Restrict`.
   - `DELETE /api/organizacion/areas/[id]` bloquea la eliminación con HTTP `409` si el área tiene puestos asociados.
   - En su lugar, la interfaz y `PATCH /api/organizacion/areas/[id]` permiten desactivar y reactivar el área (`activa: false` / `true`) preservando puestos, rutas de onboarding (`CGB-36`) y colaboradores (`CGB-41`).
3. **Compatibilidad con módulos dependientes (`CGB-36` y `CGB-41`, punto 7 de revisión) y arquitectura en capas (diapositivas 5 y 6):**
   - Los modelos oficiales son `Area` (`areas`) y `PuestoTrabajo` (`puestos_trabajo`).
   - `obtenerEstructuraOrganizacional()` en `src/lib/repositorio-organizacion.ts` invoca `armarEstructura` dejando preparado el parámetro `conteoPorPuesto` (actualmente en `0` hasta integrar la relación `Colaborador -> PuestoTrabajo.id` de `CGB-41`).
   - El flujo separa estrictamente las 4 capas documentadas en [`HU007-DISENO-Y-TRAZABILIDAD.md`](./HU007-DISENO-Y-TRAZABILIDAD.md): Presentación (`PanelOrganizacion.tsx`), Controladores delgados (`route.ts`), Lógica de negocio (`servicio-organizacion.ts` y `organizacion.ts`) y Acceso a datos (`repositorio-organizacion.ts`).

---

## 2. Criterios de aceptación (BDD) y trazabilidad

| Criterio Jira | Implementación | Verificación |
|---|---|---|
| **CA-01: Creación de nueva área organizacional** | `POST /api/organizacion/areas`, `validarArea`, modal *Nueva área* en `/admin/organizacion`. | `tests/organizacion.test.mjs` y `tests/organizacion-api.test.mjs` (HTTP 201, `activa: true`, `nombreClave` normalizado). |
| **CA-02: Asociación de puestos de trabajo a un área** | `POST /api/organizacion/puestos`, `validarPuesto`, modal *Nuevo puesto* en `/admin/organizacion`. | `tests/organizacion.test.mjs` y `tests/organizacion-api.test.mjs` (HTTP 201 con `areaId`, 404 si no existe, 409 si área inactiva). |
| **CA-03: Restricción de duplicados** | `existeNombreDuplicado`, índices únicos `nombreClave` y manejo `P2002`. | `tests/organizacion-api.test.mjs` y `tests/organizacion-ui.test.mjs` (mensaje exacto `"El área o puesto ya existe en la organización"`). |
| **CA-04: Consulta jerárquica de áreas y puestos** | `GET /api/organizacion/areas`, `armarEstructura` y vista en acordeón en `/admin/organizacion`. | `tests/organizacion-api.test.mjs` y `tests/organizacion-ui.test.mjs` (despliegue/contracción de acordeón y conteos por puesto y área). |

---

## 3. Verificaciones ejecutadas

- `npx tsc --noEmit`: sin errores de TypeScript.
- `npm test` (`tsx --test tests/*.test.mjs`): **88 pruebas aprobadas, 0 fallidas** (incluye `organizacion.test.mjs`, `organizacion-api.test.mjs` con dobles de Prisma y `organizacion-ui.test.mjs` con `happy-dom`).
- `npm run lint -- --max-warnings=0`: 0 errores, 0 advertencias.
- `npm run build` (`prisma generate && next build`): compilación de producción exitosa, generando `/admin/organizacion`, `/api/organizacion/areas`, `/api/organizacion/areas/[id]` y `/api/organizacion/puestos`.

### Comprobaciones pendientes y nota de migración en Atlas
- **Nota al aplicar el esquema en MongoDB Atlas:** `nombreClave` es único y obligatorio en `Area` y `PuestoTrabajo`. Si `areas` o `puestos_trabajo` tienen documentos previos de prueba creados sin `nombreClave`, antes de ejecutar `npx prisma db push` se deben limpiar esos registros de prueba o rellenar `nombreClave` con `claveNombre(nombre)`.
- Validación visual en navegador conectado a MongoDB Atlas (requiere `.env` local con `DATABASE_URL` y `npx prisma db push` / datos de prueba) para adjuntar capturas de `/admin/organizacion`.
- Acuerdo con los responsables de `CGB-36` (Domingo) y `CGB-41` (Ronaldo) sobre el uso unificado de `Area` y `PuestoTrabajo` y el enlace de `Colaborador.puestoId`.

---

## 4. Diseño por capas

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/admin/organizacion/page.tsx`, `src/app/admin/organizacion/PanelOrganizacion.tsx` | Vista en acordeón (`Área → Puestos → Colaboradores`), buscador, filtros y modales |
| Controlador | `src/app/api/organizacion/areas/route.ts`, `src/app/api/organizacion/areas/[id]/route.ts`, `src/app/api/organizacion/puestos/route.ts` | Reexportar handlers de `servicio-organizacion.ts` |
| Lógica de negocio | `src/lib/servicio-organizacion.ts`, `src/lib/organizacion.ts` | Orquestación HTTP y reglas puras (`validarArea`, `validarPuesto`, `existeNombreDuplicado`, `puedeAgregarPuestoAArea`, `puedeEliminarArea`, `armarEstructura`) |
| Acceso a datos | `src/lib/repositorio-organizacion.ts`, `prisma/schema.prisma` | Consultas Prisma y detección de error de unicidad `P2002` (`esErrorUnicidadPrisma`) |
