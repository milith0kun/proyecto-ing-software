# HU-010 — Activar cuenta de colaborador mediante token (`CGB-46`)

Responsable: Domingo Quispe (`Dev 2`). Rama: `feature/CGB-46-activar-cuenta-token` (PR #11).

## Problema y resultado

Los nuevos colaboradores registrados en estado pendiente necesitan activar su cuenta por primera vez mediante un enlace con token criptográfico de uso único y vigencia de 48 horas, definir una contraseña que cumpla la política de seguridad y acceder automáticamente a su portal de onboarding.

## Diseño por capas (Arquitectura en 4 capas)

Siguiendo la arquitectura monolítica modular en capas (donde la capa `n` solo invoca a `n - 1` y se aplica **DIP** + **Adapter**):

1. **Capa 1 — Presentación (UI):**
   - `src/app/activar-cuenta/page.tsx` (Server Component que lee `searchParams` en Next.js 16).
   - `src/app/activar-cuenta/FormularioActivarCuenta.tsx` (formulario accesible ARIA con datos pre-cargados, medidor de fortaleza, opción de solicitar nuevo enlace y pantalla de bienvenida).
   - `src/lib/activacion-cliente.ts` (cliente HTTP `fetch` desacoplado de la vista).
2. **Capa 2 — Aplicación / Controlador HTTP:**
   - `src/app/api/auth/activar/route.ts` (`GET` validación de token, `POST` activación + emisión de cookie JWT `cgb_sesion`, `PUT` solicitud de nuevo enlace por 48h). No importa `prisma` directamente; delega la creación de sesión persistida al servicio.
3. **Capa 3 — Dominio / Negocio:**
   - `src/lib/politica-contrasena.ts` (reglas puras cliente/servidor sin `node:crypto`: `validarPoliticaContrasena` y `evaluarFortalezaContrasena`).
   - `src/lib/activacion-cuenta.ts` (hash SHA-256 del token, vigencia de 48h, consumo de uso único, respuesta neutra de reenvío y servicio `crearServicioActivacionCuenta` con `DIP` + `ISP`).
4. **Capa 4 — Persistencia / Datos (Adapter):**
   - `src/lib/activacion-cuenta-prisma.ts` (`crearRepositorioActivacionPrisma`): transacción atómica (`prisma.$transaction`) que verifica `tokenActivacion` + `tokenExpiraEn > ahora`, activa `User` y `Colaborador`, limpia el token y registra `Sesion`.
   - `prisma/schema.prisma`: `Colaborador` integrado con `User`, `PuestoTrabajo` (`CGB-31`) y `RutaOnboarding` (`CGB-36`).

## Criterios de Aceptación y Trazabilidad de Pruebas

| Criterio Jira | Implementación y evidencia | Prueba en `tests/activacion-token.test.mjs` |
|---|---|---|
| **CA-01:** Validación de token válido con datos pre-cargados | `GET /api/auth/activar?token=XYZ`, `validarToken`, `/activar-cuenta` | `HU-010 CA-01: valida token vigente y devuelve datos pre-cargados del colaborador sin exponer secretos` |
| **CA-02:** Definición segura de contraseña (≥8 chars, número, símbolo) y token de uso único | `validarPoliticaContrasena`, `POST /api/auth/activar`, `consumirTokenYActivar` | `HU-010 CA-02: exige política segura...` y `HU-010 CA-02 & CA-04: activa la cuenta, consume el token (uso único)...` |
| **CA-03:** Rechazo de tokens vencidos (>48h) o alterados y reenvío | `calcularExpiracion48h`, `PUT /api/auth/activar`, `solicitarNuevoEnlace` | `HU-010 CA-03: rechaza tokens expirados (>48h) o alterados y permite solicitar nuevo enlace` |
| **CA-04:** Inicio de sesión automático (JWT) y redirección a `/colaborador` | `registrarSesion`, `crearToken`, `opcionesCookie`, `router.push('/colaborador')` | `HU-010 CA-02 & CA-04: ... y retorna destino al onboarding` + `HU-010: registra sesión persistida...` |
| **Refactor T3:** Medidor visual de fortaleza | `evaluarFortalezaContrasena` + barra/checklist en `FormularioActivarCuenta.tsx` | `HU-010 T3 REFACTOR: evalúa fortaleza visual de contraseña (débil, media y fuerte)` |

## Seguridad, Base de Datos y Coordinación Pendiente

- **Seguridad del token (corrección de revisión):** la base de datos almacena **únicamente** el hash `SHA-256` en `Colaborador.tokenActivacion` y su fecha de expiración `tokenExpiraEn` (`48h`). El enlace con token plano **nunca** se persiste en MongoDB (se eliminó `enlaceActivacion` tanto del esquema como de `actualizarTokenReenvio`).
- **Base de datos compartida (Atlas):** no se ejecutó `prisma db push` (solo `npx prisma generate` local tras integrar `origin/main`). Para las capturas en navegador se crearon registros temporales de demostración y se eliminaron inmediatamente después dejando las colecciones limpias.
- **Coordinación pendiente con PO y `CGB-41` (`HU-009`):** `CGB-41` también define `Colaborador` y una versión inicial de `src/app/api/auth/activar/route.ts`. Queda registrada al PO la decisión de consolidar en `CGB-46` la activación oficial (`/api/auth/activar` + `/activar-cuenta`) conservando de `CGB-41` el registro de colaboradores (`POST /api/colaboradores`).

## Evidencia en el navegador (`/activar-cuenta` y `/colaborador`)

Verificación visual ejecutada contra el servidor local conectado a MongoDB Atlas (y limpieza posterior de todos los registros temporales de prueba):

1. **Token vencido y solicitud de nuevo enlace (CA-03):** [01-token-vencido-reenvio.png](evidencias-hu010/01-token-vencido-reenvio.png) — rechazo del token expirado y confirmación neutra de generación por 48 horas.
2. **Formulario válido, datos pre-cargados y fortaleza (CA-01, CA-02, T3):** [02-formulario-activacion-valido.png](evidencias-hu010/02-formulario-activacion-valido.png) — muestra nombre, correo, puesto (`Analista de Sistemas`), ruta (`Inducción de Recursos Humanos`) y medidor en nivel `FUERTE`.
3. **Activación exitosa e ingreso automático al portal (CA-04):** [03-portal-colaborador-activado.png](evidencias-hu010/03-portal-colaborador-activado.png) — redirección autenticada a `/colaborador` con sesión activa.

## Evidencia TDD, Validaciones y Uso de IA

- **RED (`a481c10`):** pruebas de seguridad y BDD antes de `src/lib/activacion-cuenta.ts` (`ERR_MODULE_NOT_FOUND`).
- **GREEN (`79f27e4`):** dominio, adaptador Prisma, `/api/auth/activar` y `/activar-cuenta`.
- **REFACTOR (`c7564de`):** helper DRY `responderErrorActivacion`, medidor de fortaleza y pantalla de bienvenida.
- **T4 Build Fix (`a640f0e`):** separación cliente/servidor en `src/lib/politica-contrasena.ts`.
- **Merge con `main` (`85695d7`) y corrección de seguridad:** alineación con `CGB-31`/`CGB-36`, eliminación de `enlaceActivacion` persistido, desacoplamiento de `prisma` en `route.ts` y cliente `src/lib/activacion-cliente.ts`.
- **Declaración de uso de IA (diapositivas 37–38):** Se utilizó asistente de IA (Antigravity / Gemini) como apoyo para pruebas TDD, refactorización por capas y revisión de seguridad, con verificación humana y ejecución local de `npm test`, `npm run lint` y `npx next build --webpack`.
