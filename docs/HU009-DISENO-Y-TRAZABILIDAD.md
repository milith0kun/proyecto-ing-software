# HU-009 — Historia, diseño y trazabilidad (CGB-41)

Complementa `HU009-VALIDACION.md` con las decisiones de requisitos, diseño y arquitectura.

## Historia y requisitos

Como Administrador de RR. HH., quiero registrar colaboradores individuales o masivamente y asignarles su ruta activa, para crear su cuenta con el estado de activación correspondiente.

- **Tarjeta + conversación + confirmación:** CGB-41 identifica la historia; la conversación con el PO define registro masivo, vigencia de invitación y permisos; la confirmación son las pruebas de registro, ruta, invitación y reversión.
- **Criterios de aceptación ≠ DoD:** los criterios de `HU-009` son verificables por historia. La DoD es común y también exige revisión, pruebas, seguridad y trazabilidad.
- **INVEST y dependencias:** CGB-41 depende de CGB-31 para puestos y áreas, y de CGB-36 para rutas onboarding.

## Arquitectura en capas

CGB-41 permanece dentro del monolito modular en capas:

| Capa | Módulo | Responsabilidad |
|---|---|---|
| Presentación | `src/app/admin/colaboradores/page.tsx` y cliente HTTP del navegador | Presenta estado y llama a la API; no accede a Prisma ni aplica reglas persistentes. |
| Controlador | `src/app/api/colaboradores/route.ts`, `src/lib/controlador-colaboradores.ts` | Valida sesión y rol, lee parámetros o lote, delega al servicio y traduce a `NextResponse`. |
| Servicio | `src/lib/servicio-colaboradores.ts` | Orquesta consulta, validación de puestos y rutas, persistencia, reversión y envío de invitación sin construir respuestas HTTP. |
| Dominio | `src/lib/colaboradores.ts` | Normalización, validación y asignación pura de rutas. No importa Next.js, Prisma, correo ni criptografía. |
| Adaptador de seguridad | `src/lib/invitacion-colaborador.ts` | Genera UUID, token aleatorio, hash SHA-256, enlace y expiración. |
| Acceso a datos | `src/lib/repositorio-colaboradores.ts`, `prisma/schema.prisma` | Es el único módulo de colaboradores que importa Prisma y administra `Colaborador`, `User` y relaciones. |

## Justificación arquitectónica

Se conserva el monolito modular porque CGB-41 comparte modelo, despliegue, permisos, MongoDB Atlas y la unidad operativa con las historias CGB-31 y CGB-36. Separar el flujo en microservicios introduciría latencia, transacciones distribuidas y otra infraestructura sin una necesidad demostrada por carga o por el equipo actual.

MongoDB Atlas mediante Prisma mantiene las relaciones oficiales entre `PuestoTrabajo`, `RutaOnboarding`, `Colaborador` y `User`. CGB-41 añade invitaciones sin crear una colección paralela ni duplicar la identidad del colaborador.

## Diseño y consistencia

- SRP: reglas puras, orquestación, HTTP y persistencia están separadas.
- DIP: el servicio depende de módulos importables; cambiar Prisma afecta principalmente al repositorio.
- Seguridad: el token completo existe solo en memoria y correo; MongoDB guarda únicamente el hash y la expiración.
- Permisos: únicamente `ADMINISTRADOR` puede registrar colaboradores.
- Consistencia: el registro crea `User` y `Colaborador` junto a la ruta asignada. Ante fallo del correo o creación posterior, `revertirRegistroColaborador` elimina ambos registros temporales como compensación probada por API.
- Resiliencia: el proveedor Resend está aislado en `src/lib/correo-invitacion.ts`; un fallo se devuelve al controlador como error seguro y sin exponer el token.

## Trazabilidad

| Tarea | Ítem de configuración |
|---|---|
| CGB-41 | `src/lib/colaboradores.ts`, `src/lib/invitacion-colaborador.ts`, `src/lib/servicio-colaboradores.ts`, `src/lib/repositorio-colaboradores.ts`, `src/lib/controlador-colaboradores.ts`, `src/app/api/colaboradores/route.ts` |
| Pruebas | `tests/colaboradores-hu009.test.mjs`, `tests/colaboradores-api.test.mjs`, `tests/colaboradores-flujo.test.mjs`, `tests/correo-invitacion.test.mjs` |
| Validación | `docs/HU009-VALIDACION.md`, `docs/evidencias-hu009/` |

Esta decisión evita que el dominio conozca Node.js crypto o detalles de HTTP, y mantiene una única colección responsable por el colaborador.
