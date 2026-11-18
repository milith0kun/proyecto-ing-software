# HU-007 — Crear área y puestos de trabajo (CGB-31)

- **Historia Jira:** `CGB-31` (`https://cgb-academy.atlassian.net/browse/CGB-31`)
- **Subtareas asociadas:** `CGB-32` (T1 RED), `CGB-33` (T2 GREEN), `CGB-34` (T3 REFACTOR), `CGB-35` (T4 VALIDACIÓN)
- **Responsable:** Alex Carpio (`feature/CGB-31-areas-y-puestos`, base `42eb4a4`, PR #15)

---

## 1. Decisiones técnicas, acuerdo del PO y compatibilidad del equipo

1. **Unicidad real en base de datos sin tildes ni mayúsculas (punto 5 de revisión):**
   - `Area` y `PuestoTrabajo` en `prisma/schema.prisma` incorporan el campo `nombreClave` normalizado mediante `claveNombre` (sin tildes, minúsculas y espacios colapsados): `@unique` en `Area.nombreClave` y `@@unique([areaId, nombreClave])` en `PuestoTrabajo`.
   - Además de la validación previa en el servicio, el repositorio detecta errores `P2002` de Prisma (`esErrorUnicidadPrisma`) para responder HTTP `409` con `El área o puesto ya existe en la organización` incluso ante solicitudes concurrentes.
2. **Protección contra borrado en cascada — Decisión del PO (punto 6 de revisión / `RNF-010`):**
   - Por definición acordada con el Product Owner (registrada también en Jira `CGB-31`), dar de baja un área organizacional **no borra en cascada** sus puestos, rutas ni colaboradores: la relación `PuestoTrabajo.area` usa `onDelete: Restrict`.
   - `DELETE /api/organizacion/areas/[id]` bloquea la eliminación con HTTP `409` (`puedeEliminarArea`) si el área tiene puestos asociados, y `PATCH /api/organizacion/areas/[id]` permite desactivar o reactivar el área (`activa: false` / `true`) conservando el historial.
3. **Acuerdo de modelos oficiales con las HU dependientes (`CGB-36` y `CGB-41`, punto 13):**
   - **Acuerdo registrado con Domingo Quispe (`CGB-36`, HU-008) y Ronaldo Ticona (`CGB-41`, HU-009):** `Area` (`@@map("areas")`) y `PuestoTrabajo` (`@@map("puestos_trabajo")`) definidos en esta rama son los modelos oficiales del esquema compartido. Ambos exigen `nombreClave` generado con `claveNombre()` de `src/lib/organizacion.ts`.
   - `obtenerEstructuraOrganizacional()` en `src/lib/servicio-organizacion.ts` invoca `armarEstructura` dejando preparado el mapa `conteoPorPuesto` (actualmente `0` hasta integrar la relación `Colaborador.puestoId -> PuestoTrabajo.id` de `CGB-41`).
4. **Arquitectura y diseño en 4 capas estrictas:**
   - El detalle de capas (`Presentación → Controlador → Lógica de negocio → Acceso a datos`), donde cada capa consume únicamente la capa inmediata inferior (`page.tsx` consume `servicio-organizacion.ts`, los controladores usan `organizacion-http.ts`, el servicio no importa `NextResponse` y el panel usa `organizacion-cliente.ts`), se documenta sin duplicación en [`HU007-DISENO-Y-TRAZABILIDAD.md`](./HU007-DISENO-Y-TRAZABILIDAD.md).

---

## 2. Criterios de aceptación (BDD) y trazabilidad

| Criterio Jira | Implementación | Verificación |
|---|---|---|
| **CA-01: Creación de nueva área organizacional** | `POST /api/organizacion/areas`, `registrarAreaOrganizacion`, `validarArea`, `ModalNuevaArea` en `/admin/organizacion`. | `tests/organizacion.test.mjs` y `tests/organizacion-api.test.mjs` (HTTP 201, `activa: true`, `nombreClave` normalizado). |
| **CA-02: Asociación de puestos de trabajo a un área** | `POST /api/organizacion/puestos`, `registrarPuestoOrganizacion`, `validarPuesto`, `puedeAgregarPuestoAArea`, `ModalNuevoPuesto`. | `tests/organizacion.test.mjs` y `tests/organizacion-api.test.mjs` (HTTP 201 con `areaId`, 404 si no existe, 409 si área inactiva). |
| **CA-03: Restricción de duplicados** | `existeNombreDuplicado`, índices únicos `nombreClave` y manejo `P2002`. | `tests/organizacion.test.mjs`, `tests/organizacion-api.test.mjs` y `tests/organizacion-ui.test.mjs` (mensaje exacto `"El área o puesto ya existe en la organización"`). |
| **CA-04: Consulta jerárquica de áreas y puestos** | `GET /api/organizacion/areas`, `obtenerEstructuraOrganizacional`, `armarEstructura` y vista en acordeón en `/admin/organizacion`. | `tests/organizacion-api.test.mjs` y `tests/organizacion-ui.test.mjs` (despliegue/contracción de acordeón y conteos por puesto y área). |

---

## 3. Verificaciones ejecutadas

- `npx tsc --noEmit`: sin errores de TypeScript (`0` errores).
- `npm test` (`tsx --test tests/*.test.mjs`): **89 pruebas aprobadas, 0 fallidas** (incluye `organizacion.test.mjs`, `organizacion-api.test.mjs` con dobles de Prisma y `organizacion-ui.test.mjs` con `happy-dom`).
- `npm run lint -- --max-warnings=0`: `0` errores y `0` advertencias.
- `npm run build` (`prisma generate && next build`): compilación de producción exitosa, generando `/admin/organizacion`, `/api/organizacion/areas`, `/api/organizacion/areas/[id]` y `/api/organizacion/puestos`.

---

## 4. Nota de migración en MongoDB Atlas y evidencias visuales

### 4.1 Registro de cambio en base de datos compartida (`prisma db push`)
- **Riesgo controlado:** `nombreClave` es único y obligatorio en `Area` (`@unique`) y `PuestoTrabajo` (`@@unique([areaId, nombreClave])`). Si las colecciones `areas` o `puestos_trabajo` en Atlas contienen documentos previos sin `nombreClave`, antes de ejecutar `npx prisma db push` se debe rellenar `nombreClave` con `claveNombre(nombre)` o limpiar documentos de prueba sin dicho campo.
- **Bitácora de aplicación en Atlas:**
  - **Entorno:** Clúster compartido de desarrollo `cgb_academy` (MongoDB Atlas).
  - **Cambio de esquema a aplicar:** Índices únicos `areas.nombreClave_1` y `puestos_trabajo.areaId_1_nombreClave_1`, más política referencial `onDelete: Restrict`.
  - **Autorización y ejecución:** Autorizado en revisión técnica por el coordinador/revisor del repositorio (Edmil Saire) al integrar PR #15; pendiente de ejecución con `.env` conectado a Atlas.

### 4.2 Evidencia en navegador (`/admin/organizacion`)
- La subtarea `CGB-35` (T4 Validación) se mantiene **En curso** hasta adjuntar en `docs/evidencias-hu007/` las capturas del flujo en navegador conectado a MongoDB Atlas (creación de área, asociación de puesto, bloqueo de duplicado insensible a tildes/mayúsculas, acordeón desplegado y desactivación lógica), requisito previo para mover `CGB-31` a **Hecho**.
