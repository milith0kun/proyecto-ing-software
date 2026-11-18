# HU-010 — Historia, diseño y trazabilidad (`CGB-46`)

Complementa `docs/HU010-VALIDACION.md` siguiendo la estructura de diseño, arquitectura, requisitos y trazabilidad del equipo (`GUIA_DE_REVISION.md` §11.0).

## 1. Historia, 3 C y Requisitos No Funcionales (diapositiva 4)

**Historia:** Como Nuevo Colaborador, quiero activar mi cuenta por primera vez mediante el enlace enviado a mi correo para establecer una contraseña segura e iniciar automáticamente mi ruta de onboarding.

- **3 C (Tarjeta + Conversación + Confirmación):**
  - **Tarjeta:** `CGB-46` en Jira (subtareas `CGB-47` a `CGB-50`), vinculada mediante `is blocked by CGB-41` para consolidar modelo y propietario único.
  - **Conversación (decisiones aprobadas por el PO en Jira `CGB-41` y `CGB-46`):** la necesidad proviene de `informe/registro_conversatorios.md` y `docs/REQUISITOS_APLICADOS.md` §4–§5. El Product Owner (PO) confirmó oficialmente en Jira:
    1. **La activación es propiedad exclusiva de `CGB-46`:** vigencia de `48 horas` y contraseña de mínimo `8 caracteres` con número y símbolo (`/api/auth/activar` y `/activar-cuenta`). `CGB-41` solo registra, asigna ruta y envía invitación.
    2. **No se captura el DNI (`RNF-007`):** prevalece la minimización de datos (solo nombre, correo y rol); se eliminó el campo `dni` de `Colaborador` en `prisma/schema.prisma`.
    3. **No se crea el rol `ESPECIALISTA_RRHH`:** registra el `ADMINISTRADOR`, igual que en `HU-007` y `HU-008`.
    4. **La ruta apunta al puesto:** como ya está definido en `main`.
    5. **`CGB-41` es dueña del modelo `Colaborador`:** entra primero el PR #18 y `CGB-46` (PR #11) adopta el modelo idéntico.
  - **Confirmación:** criterios `CA-01` a `CA-04` cubiertos por 6 pruebas automatizadas en `tests/activacion-token.test.mjs` y 3 capturas reales en `docs/evidencias-hu010/`.
- **Criterios de aceptación ≠ DoD:** `CA-01..CA-04` validan los requisitos funcionales de HU-010; la `Definition of Done` común (`docs/definition-of-done.md`) incorpora los Requisitos No Funcionales (RNF) aplicables según `docs/REQUISITOS_APLICADOS.md` §3.

### Requisitos No Funcionales comprobados por ID

| ID RNF | Requisito (matriz §3) | Cómo se implementó y comprobó en HU-010 |
|---|---|---|
| **RNF-001** | Interfaz *responsive* | Layout centrado adaptativo en `FormularioActivarCuenta.tsx` con `CabeceraCgb` y `PieCgb`; verificado en build de producción (`npx next build --webpack`) y capturas reales en `docs/evidencias-hu010/`. |
| **RNF-002** | Interfaz y mensajes en español | Textos visibles, etiquetas ARIA, barras de fortaleza (`DÉBIL`/`MEDIA`/`FUERTE`), alertas y respuestas JSON de error (`ErrorActivacionCuenta`) redactados íntegramente en español. |
| **RNF-005** | Acceso interno (parcial en activación) | `/activar-cuenta` y `GET/PUT /api/auth/activar` son públicos únicamente mediante token criptográfico válido; las mutaciones (`POST`, `PUT`) validan `esSolicitudMismoOrigen`, emiten cookie `cgb_sesion` (`HttpOnly`, `SameSite`) respaldada por `Sesion` persistida y redirigen al área protegida `/colaborador` (`tests/activacion-token.test.mjs`). |
| **RNF-006** | Seguridad de credenciales | Contraseña hasheada con `bcryptjs` (coste `12`) y política mínima (`≥ 8` caracteres, número y símbolo); token almacenado **únicamente** como hash `SHA-256` con vigencia de `48 h` y consumo atómico de uso único (`tests/activacion-token.test.mjs`, commit `1bc4eba`). |
| **RNF-007** | Minimización y privacidad de datos | `GET /api/auth/activar` devuelve solo `nombre`, `email`, `puesto` y `ruta` (sin `passwordHash` ni token); se eliminó `enlaceActivacion` en claro de MongoDB (`1bc4eba`) y el campo `dni` de `Colaborador` según decisión del PO; `PUT /api/auth/activar` devuelve siempre respuesta neutra. |
| **RNF-008** | Consistencia visual institucional | Reutiliza `CabeceraCgb`, `PieCgb`, tipografía y paleta oficial CGB Academy (`#146287`, `#4DC4D3`, `#002855`), comprobado visualmente en `docs/evidencias-hu010/`. |

## 2. Arquitectura en 4 capas y justificación (diapositiva 6)

Cada capa $n$ consume únicamente a la capa inmediatamente inferior $n - 1$:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| **1. Presentación (UI)** | `src/app/activar-cuenta/page.tsx`, `src/app/activar-cuenta/FormularioActivarCuenta.tsx`, `src/lib/activacion-cliente.ts` | `page.tsx` resuelve `searchParams` en Next.js 16; `FormularioActivarCuenta.tsx` gestiona estados accesibles (ARIA), datos pre-cargados, medidor de fortaleza y pantalla de bienvenida; `activacion-cliente.ts` encapsula las llamadas `fetch`. |
| **2. Controlador (API)** | `src/app/api/auth/activar/route.ts`, `src/lib/activacion-http.ts` | `route.ts` solo reexporta `GET`, `POST` y `PUT` (`force-dynamic`); `activacion-http.ts` instancia el servicio con `crearRepositorioActivacionPrisma()`, verifica `esSolicitudMismoOrigen`, emite cookie JWT + `Sesion` y traduce `ErrorActivacionCuenta` o fallos inesperados (`503`). |
| **3. Lógica de negocio** | `src/lib/activacion-cuenta.ts`, `src/lib/politica-contrasena.ts` | Reglas puras sin dependencias de Next.js ni Prisma: `politica-contrasena.ts` (compartida con el cliente sin `node:crypto`), hash `SHA-256`, vigencia de `48 h`, uso único y servicio `crearServicioActivacionCuenta` desacoplado por interfaz. |
| **4. Acceso a datos (Adapter)** | `src/lib/activacion-cuenta-prisma.ts`, `prisma/schema.prisma` | Único módulo del flujo acoplado a `@/lib/prisma`. `consumirTokenYActivar` ejecuta `prisma.$transaction` atómica para validar vigencia/hash, activar `Colaborador` y `User`, limpiar el token y crear `Sesion`. |

### Por qué monolito modular frente a microservicios (ARQ-13)

Se mantiene el **monolito modular en capas sobre Next.js** en lugar de extraer un microservicio de activación/identidad porque:
1. El equipo, el volumen de usuarios y la infraestructura objetivo (`RNF-003`: VPS único de 2 vCPU y 8 GB RAM) no justifican latencia de red entre servicios, despliegue separado ni coordinación de transacciones distribuidas entre `Colaborador`, `User` y `Sesion`.
2. Las fronteras modulares (`activacion-cuenta`, `politica-contrasena`, `activacion-http`, `activacion-cuenta-prisma`) permiten probar toda la lógica de dominio en milisegundos sin base de datos y conservar la opción de extraer módulos si el tráfico creciera en el futuro.
3. Con **MongoDB Atlas + Prisma ORM**, `prisma.$transaction` garantiza consistencia entre colecciones (`colaboradores`, `users`, `sesiones`) usando índices únicos y tipado estático.

### Dependencias externas, fallo único y observabilidad (ARQ-10, ARQ-11)

- **Proveedores externos:**
  - **MongoDB Atlas** (vía Prisma ORM) es la dependencia crítica para verificar tokens y activar cuentas.
  - **Servicio de envío de correos** (implementado en `CGB-41`): `CGB-46` genera el enlace al solicitar reenvío (`solicitarNuevoEnlace`) sin persistir el token plano en BD, quedando listo para integrarse con el adaptador de correo de `CGB-41`.
- **Riesgo de punto único de fallo y respuesta controlada:** si MongoDB Atlas falla o ocurre una excepción no controlada durante `GET/POST/PUT /api/auth/activar`, la transacción no deja activaciones parciales (atomicidad en `consumirTokenYActivar`) y `responderErrorActivacion` en `src/lib/activacion-http.ts` devuelve siempre un estado `503` genérico en español sin filtrar trazas internas ni datos personales. El registro de auditoría persistente/telemetría centralizada queda abierto como mejora futura compartida con el módulo de autenticación.

## 3. Principios de diseño aplicados (diapositiva 5)

- **SRP y alta cohesión:** `politica-contrasena.ts` agrupa validación y fortaleza pura; `activacion-cuenta.ts` el ciclo de token/activación; `activacion-http.ts` la traducción HTTP; `activacion-cliente.ts` el cliente `fetch`.
- **DIP, OCP e ISP:** `crearServicioActivacionCuenta(repositorio, hashearClave)` depende de `RepositorioActivacionCuenta` (interfaz específica de 5 métodos: `buscarPorTokenHash`, `buscarPorEmail`, `consumirTokenYActivar`, `actualizarTokenReenvio`, `crearSesion?`) y del hasher inyectado. Las pruebas usan un repositorio en memoria sin tocar MongoDB.
- **Encapsulación:** ni el cliente ni el cuerpo `POST` pueden enviar `userId`, `colaboradorId` o `role`; la identidad se resuelve exclusivamente desde el hash `SHA-256` del token vigente en BD.
- **Integridad de datos (`prisma/schema.prisma`):** `Colaborador` relaciona `PuestoTrabajo`, `RutaOnboarding` y `User` con `onDelete: SetNull`, evitando cascadas destructivas sobre usuarios o estructura organizacional.
- **Proceso de diseño y refactors:** tras identificar `node:crypto` en bundle cliente se extrajo `politica-contrasena.ts` (`a640f0e`); tras detectar persistencia en claro de `enlaceActivacion` y acoplamiento de `prisma` en `route.ts` se corrigieron en `1bc4eba`; y finalmente se separó `activacion-http.ts` para dejar `route.ts` como adaptador delgado.

## 4. Trazabilidad y configuración (diapositiva 3)

| Paso / Tarea | Commit | Ítem de configuración |
|---|---|---|
| `CGB-47` (T1 RED) | `a481c10` | `tests/activacion-token.test.mjs` |
| `CGB-48` / `CGB-49` (T2 GREEN) | `79f27e4` | `prisma/schema.prisma`, `src/lib/activacion-cuenta*.ts`, `src/app/api/auth/activar/route.ts`, `src/app/activar-cuenta/**` |
| `CGB-49` (T3 REFACTOR) | `c7564de` | `src/lib/activacion-cuenta.ts`, `src/app/activar-cuenta/FormularioActivarCuenta.tsx`, `tests/activacion-token.test.mjs` |
| T4 Build Fix | `a640f0e` | `src/lib/politica-contrasena.ts` |
| Merge `main` (`CGB-31` + `CGB-36`) | `85695d7` | `prisma/schema.prisma`, `src/lib/activacion-cuenta-prisma.ts` |
| Corrección de seguridad y capas | `1bc4eba` | `prisma/schema.prisma`, `src/lib/activacion-cuenta*.ts`, `src/lib/activacion-cliente.ts`, `route.ts`, `tests/activacion-token.test.mjs` |
| Validación y capturas | `c83872c`, `a6ba816` | `docs/HU010-VALIDACION.md`, `docs/evidencias-hu010/*.png` |
| Merge `main` (`HU-012`), `ARQ-03` y trazabilidad | `841a34f`, `866f96f`, `3e1f7f7` | `prisma/schema.prisma`, `src/lib/activacion-http.ts`, `src/app/api/auth/activar/route.ts`, `docs/HU010-DISENO-Y-TRAZABILIDAD.md` |
| Merge `main` (`6b77d33` — CI, fuentes, `HU-013`) y retiro de `dni` | *(actual)* | `prisma/schema.prisma` (sin `dni`), `docs/HU010-DISENO-Y-TRAZABILIDAD.md`, `docs/HU010-VALIDACION.md` |

## 5. Pendientes externos a la rama

- **Integración previa de `CGB-41` (PR #18):** el PO ya confirmó las 5 decisiones en Jira y `Colaborador` quedó sin `dni`. Solo resta que se fusione el PR #18 para traer `main` y aprobar el PR #11.
