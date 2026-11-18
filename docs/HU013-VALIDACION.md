# HU-013 — Configurar microtest formativo (CGB-61)

- **Rama:** `feature/CGB-61-configurar-microtest` (basada en `origin/main` sobre `79e3ec1`)
- **Issue en Jira:** [CGB-61](https://cgb-academy.atlassian.net/browse/CGB-61)
- **Subtareas TDD:** [CGB-62](https://cgb-academy.atlassian.net/browse/CGB-62) (`T1 RED`), [CGB-63](https://cgb-academy.atlassian.net/browse/CGB-63) (`T2 GREEN`), [CGB-64](https://cgb-academy.atlassian.net/browse/CGB-64) (`T3 REFACTOR`), [CGB-65](https://cgb-academy.atlassian.net/browse/CGB-65) (`T4 VALIDACIÓN`)
- **Responsable:** Alex Carpio (`alex164563`, PR #17)

---

## 1. Decisiones técnicas, acuerdo con el PO y compatibilidad con `CGB-66`

1. **Integridad de evaluaciones respondidas — Decisión del PO (`CA-04` / `RNF-010`):**
   - Por definición de negocio, mientras un microtest formativo tiene `0` intentos registrados por colaboradores, el administrador puede editar sus preguntas, alternativas, nota mínima o eliminarlo (`PUT / DELETE /api/microtests/[id]`).
   - En cuanto existe al menos un intento calificado (`totalIntentos > 0`), tanto el dominio (`puedeModificarMicrotest`) como el servicio (`ErrorConfiguracionMicrotest` con HTTP `409 Conflict`) y la interfaz (`ConstructorMicrotest.tsx`) bloquean la edición y la eliminación para preservar la trazabilidad de las calificaciones históricas.
2. **Acuerdo de modelos oficiales con `CGB-66` (`HU-014: Realizar microtest formativo`):**
   - Queda acordado con Héctor Barazorda (`CGB-66`, PR #13) el uso exacto de los modelos `PreguntaEvaluacion` (tipo embebido con `id`, `enunciado`, `opciones`, `correcta` base 0 y `retroalimentacion`), `Evaluacion` (`@@map("evaluaciones")`, `capacitacionId @unique`) e `IntentoEvaluacion` (`@@map("intentos_evaluacion")`, `@@unique([usuarioId, evaluacionId, numero])`), garantizando compatibilidad directa al integrarse en `main`.
3. **Arquitectura en 4 capas estrictas ($n \to n-1$):**
   - El detalle de las 4 capas (`Presentación → Controlador → Lógica de negocio → Acceso a datos`), donde `page.tsx` invoca exclusivamente a `servicio-configuracion-microtest.ts`, los controladores usan `microtests-http.ts`, el servicio no importa `NextResponse` y el constructor usa `microtests-cliente.ts`, se documenta sin duplicación en [`HU013-DISENO-Y-TRAZABILIDAD.md`](./HU013-DISENO-Y-TRAZABILIDAD.md).

---

## 2. Criterios de Aceptación (BDD) y Requisitos No Funcionales (RNF)

### 2.1 Matriz de Criterios de Aceptación (CA-01 a CA-04)

| Criterio | Escenario BDD (Dado / Cuando / Entonces) | Archivo de prueba | Caso verificado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CA-01** | **Creación de banco de preguntas y alternativas:** Dado que el administrador edita un microtest, cuando añade preguntas con opciones indicando la alternativa correcta y su puntaje/retroalimentación, entonces la evaluación se guarda estructurada. | `tests/configuracion-microtest.test.mjs`<br>`tests/configuracion-microtest-api.test.mjs`<br>`tests/configuracion-microtest-ui.test.mjs` | `CA-01: acepta preguntas con opciones múltiples...`<br>`CA-01, CA-02 y CA-03: POST /api/microtests guarda preguntas...`<br>Captura `01-constructor-preguntas.png` | ✅ PASS |
| **CA-02** | **Configuración de puntaje mínimo de aprobación:** Dado que se configura la evaluación, cuando el administrador define la nota mínima (1–100%) y número máximo de intentos (1–10), entonces el sistema impone la regla de validación. | `tests/configuracion-microtest.test.mjs`<br>`tests/configuracion-microtest-api.test.mjs` | `CA-02: valida la nota mínima de aprobación (1-100%)...`<br>Captura `01-constructor-preguntas.png` | ✅ PASS |
| **CA-03** | **Asociación del microtest a la capacitación:** Dado que existe una capacitación en Borrador, cuando se vincula el microtest al final de la unidad, entonces el test queda asociado de forma única (`capacitacionId @unique`). | `tests/configuracion-microtest.test.mjs`<br>`tests/configuracion-microtest-api.test.mjs`<br>`tests/configuracion-microtest-ui.test.mjs` | `CA-03: impide crear un segundo microtest para la misma capacitación (409)...`<br>Captura `02-microtest-vinculado.png` | ✅ PASS |
| **CA-04** | **Edición y eliminación de evaluaciones:** Dado que una evaluación aún no ha sido respondida por alumnos, cuando el administrador modifica o elimina el microtest, entonces se actualiza respetando la integridad; si ya existen intentos, bloquea cambios con `409 Conflict`. | `tests/configuracion-microtest.test.mjs`<br>`tests/configuracion-microtest-api.test.mjs`<br>`tests/configuracion-microtest-ui.test.mjs` | `CA-04: PUT y DELETE permiten editar y eliminar mientras no existan intentos...`<br>Captura `03-bloqueo-con-intentos.png` | ✅ PASS |

### 2.2 Comprobación de Requisitos No Funcionales (RNF por ID)

| ID RNF | Requisito No Funcional | Cómo se comprueba en HU-013 |
|---|---|---|
| **RNF-001** | Diseño adaptable (Responsive Web Design) | Grillas responsivas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) y contenedores adaptables en `ConstructorMicrotest.tsx`. |
| **RNF-002** | Idioma español e interfaz clara | Toda la interfaz, etiquetas `aria-label` y mensajes de error (`MENSAJE_MICROTEST_DUPLICADO`, `MENSAJE_MICROTEST_CON_INTENTOS`) están en español. |
| **RNF-003** | Rendimiento en infraestructura acotada (VPS 2 vCPU / 8 GB RAM) | Preguntas embebidas (`PreguntaEvaluacion[]`) en un solo documento `Evaluacion` sin `JOIN` costosos y cabeceras `Cache-Control: no-store`. |
| **RNF-005** | Control de acceso interno por rol y protección CSRF | `exigirAdministrador` en `/api/microtests` y `/api/microtests/[id]` + validación `Same-Origin` en `POST`, `PUT` y `DELETE` (`tests/configuracion-microtest-api.test.mjs`). |
| **RNF-008** | Consistencia visual e identidad institucional CGB | Uso de `CabeceraAdminCgb`, `PieCgb`, `.publicacion-panel`, `.kicker-cgb`, `.boton-primario` y alertas accesibles (`role="alert"`, `role="status"`). |
| **RNF-010** | Integridad referencial y de calificaciones | Índice único `capacitacionId @unique` en `Evaluacion` y bloqueo `409 Conflict` ante edición o borrado cuando existen intentos registrados (`03-bloqueo-con-intentos.png`). |

---

## 3. Evidencia en navegador conectado a MongoDB Atlas (`CGB-65`, 18/11/2026)

Validación ejecutada en `http://localhost:3000/admin/microtests` conectado al clúster `cgb_academy` de MongoDB Atlas con la sesión `admin@cgb.latam` (`ADMINISTRADOR`). Los registros temporales creados durante la prueba (`Microtest de Seguridad de la Información` y su intento de prueba) se eliminaron al finalizar para conservar intacta la base compartida.

| Criterio | Evidencia en navegador (`/admin/microtests`) |
|---|---|
| **CA-01 y CA-02** Constructor dinámico con preguntas, opciones, alternativa correcta, puntaje por pregunta (`50 pts`) y nota mínima (`80%`) | ![Constructor dinámico de preguntas](evidencias-hu013/01-constructor-preguntas.png) |
| **CA-03** Microtest guardado y vinculado a una capacitación en estado `BORRADOR` | ![Microtest vinculado a capacitación](evidencias-hu013/02-microtest-vinculado.png) |
| **CA-04 y RNF-010** Bloqueo de edición y eliminación cuando existen intentos registrados por colaboradores | ![Bloqueo de edición con intentos registrados](evidencias-hu013/03-bloqueo-con-intentos.png) |

---

## 4. Verificación Técnica y Bitácora en MongoDB Atlas

1. **Cliente Prisma y Tipado:** `npx prisma generate` y `npx tsc --noEmit` (`0` errores).
2. **Linter:** `npm run lint -- --max-warnings=0` (`0` advertencias, `0` errores).
3. **Suite de pruebas:** `npm test` → **128/128 pruebas pasando** (incluyendo las 12 pruebas de HU-013 y las 116 de `main`).
4. **Compilación de producción:** `npm run build` exitoso.
5. **Estado de colecciones en MongoDB Atlas (`cgb_academy`):** Se verificó que las colecciones `evaluaciones` (con índice único `evaluaciones_capacitacionId_key`) e `intentos_evaluacion` (con índice único `intentos_evaluacion_usuarioId_evaluacionId_numero_key`) ya existen y están activas en Atlas.
6. **Declaración de uso de IA:** Se empleó Antigravity / Gemini bajo guía del responsable (Alex Carpio) para estructurar las 4 capas (`configuracion-microtest.ts`, `repositorio-configuracion-microtest.ts`, `servicio-configuracion-microtest.ts`, `microtests-http.ts`, `microtests-cliente.ts`, `ConstructorMicrotest.tsx`), las pruebas automatizadas y la captura de evidencias contra Atlas.
