# Arquitectura de CGB Academy

**Estado:** convención del equipo, extraída de las historias ya integradas en `main` (CGB-31, CGB-36 y CGB-56) y de las diapositivas de Arquitectura (`Diapos/6 Arquitectura.pptx`). Se revisa por Pull Request como cualquier documento.
**Cómo se usa:** quien escribe una historia la sigue; quien revisa la comprueba con las listas ARQ y DIS de [`GUIA_DE_REVISION.md`](GUIA_DE_REVISION.md).

## 1. Estilo elegido

**Monolito modular en capas con MVC web**, sobre Next.js (App Router) y MongoDB Atlas mediante Prisma. Un solo proceso, módulos claros y la regla de capas: **la capa *n* solo usa la capa *n-1*** (ARQ 21–22, 27–28, 47–50).

Se descartan por ahora los microservicios. Las diapositivas recomiendan comenzar con un monolito y migrar solo si retrasa las versiones o tiene problemas de rendimiento (ARQ 108). Los costos de una decisión de arquitectura pueden tardar años en verse (ARQ 19), por eso cada historia anota por qué sigue este estilo (ARQ-13).

## 2. Mapa de capas

```text
Vista        src/app/**/page.tsx · src/components/** · src/app/**/*.tsx   qué ve la persona
   │  llama a
Controlador  src/app/api/**/route.ts                                       delgado: delega
   │  usa un adaptador HTTP:  src/lib/<x>-http.ts  o  controlador-<x>.ts
Servicio     src/lib/servicio-<x>.ts                                       casos de uso, sin HTTP
   │  usa
Dominio      src/lib/<dominio>.ts                                          reglas puras, sin imports de infraestructura
Repositorio  src/lib/repositorio-<x>.ts  o  <x>-prisma.ts                  único lugar con Prisma
   │
Datos        prisma/schema.prisma · MongoDB Atlas
```

Las páginas (`page.tsx`) son Server Components y consumen el **servicio**, no el repositorio ni Prisma. El navegador llega a la API mediante `src/lib/<x>-cliente.ts` (cliente HTTP), no con `fetch` suelto dentro de los componentes.

## 3. Qué va en cada pieza

| Pieza | Ejemplo en `main` | Puede importar | No puede importar |
|---|---|---|---|
| `route.ts` | `src/app/api/organizacion/areas/route.ts` | Servicio, adaptador HTTP, `permisos` | Prisma, repositorio |
| Adaptador HTTP | `organizacion-http.ts`, `rutas-http.ts`, `controlador-progreso.ts` | `NextResponse`, servicio, errores de dominio | Prisma |
| Servicio | `servicio-organizacion.ts`, `servicio-progreso.ts` | Dominio, repositorio (por parámetro o importado) | `NextRequest`, `NextResponse`, `@prisma/client` |
| Dominio | `organizacion.ts`, `progreso-capacitacion.ts`, `rutas-onboarding.ts` | Solo tipos propios | Framework, Prisma, `node:fs`, red |
| Repositorio | `repositorio-organizacion.ts`, `repositorio-progreso.ts`, `rutas-onboarding-prisma.ts` | `@/lib/prisma`, tipos del dominio | HTTP |
| Cliente | `organizacion-cliente.ts`, `rutas-cliente.ts` | `fetch` | Reglas de negocio |

Reglas de nombres:
- El servicio **lanza un error de dominio** (`ErrorOrganizacion`, `ErrorProgreso`, `ErrorRutaOnboarding`) y el adaptador HTTP lo traduce a un código de estado. El servicio nunca devuelve una respuesta HTTP.
- El adaptador HTTP vive hoy en `src/lib` junto a los demás módulos de su HU; no se mueve a `src/app` para no cambiar rutas de importación. Las rutas (`route.ts`) solo lo reexportan o lo invocan.
- La identidad y los permisos salen de la **sesión** (`permisos.ts`), nunca del cuerpo de la petición.

## 4. Cómo se comprueba

Para código nuevo, el primer comando no debe listar nada fuera de la deuda conocida de abajo (12 archivos) y los otros dos deben salir **vacíos** (desde la raíz, con la rama revisada):

```bash
git grep -l "lib/prisma" -- src/app          # Prisma solo en repositorios
git grep -lE "NextResponse|NextRequest" -- src/lib/servicio-*.ts src/lib/repositorio-*.ts
git grep -lE "^import .* from '(next|@prisma/client)" -- src/lib/organizacion.ts src/lib/progreso-capacitacion.ts src/lib/rutas-onboarding.ts
```

**Deuda conocida (código anterior a esta convención).** Hoy 12 archivos de `src/app` importan Prisma directamente: las rutas de `api/auth/*`, `api/capacitaciones/**`, `api/public/capacitaciones`, `api/health`, y las páginas `admin/capacitaciones/[id]/contenido`, `admin/capacitaciones/[id]/vista-previa` y `capacitaciones/[id]`. No se reescriben en bloque: se migran a servicio y repositorio cuando una historia los modifique, y la historia lo anota. Una HU nueva no puede añadir archivos a esa lista.

## 5. Propiedad de los datos

Cada colección tiene **un módulo dueño**; los demás la leen a través de su servicio, no la escriben (ARQ 107).

| Colección | Dueño | Estado |
|---|---|---|
| `areas`, `puestos_trabajo` | CGB-31 (HU-007) | En `main` |
| `rutas_onboarding`, `pasos_ruta` | CGB-36 (HU-008) | En `main` |
| `progreso_capacitaciones` | CGB-56 (HU-012) | En `main` |
| `colaboradores` | CGB-41 (HU-009) | Propuesto; PR #18 |
| `evaluaciones`, `intentos_evaluacion` | CGB-61 (HU-013) | Propuesto; PR #17 |

Una historia que necesita datos de otro módulo llama a su servicio. No define una segunda colección para el mismo concepto ni escribe en la ajena.

**Integridad.** Por defecto `onDelete: Restrict`, para no borrar el historial en silencio (decisión del PO en CGB-31 y CGB-56, RNF-010). `Cascade` solo para partes que pertenecen por completo a su padre (por ejemplo `PasoRuta` respecto de su ruta) y nunca hacia un usuario ni hacia calificaciones o avances. Unicidad en la base de datos con índices únicos y manejo de `P2002`.

**Consistencia entre colecciones** (ARQ 105, 107). Si una operación escribe en varias colecciones se usa una transacción o una compensación explícita y probada. Con concurrencia, control optimista y reintentos (como `repositorio-progreso.ts`).

## 6. Dependencias externas y riesgos

| Dependencia | Riesgo | Qué se hace |
|---|---|---|
| MongoDB Atlas | Punto único de fallo y costo variable (ARQ 32, 98–99) | Registrar el riesgo en `docs/configuracion.md`; `db push` solo con autorización del administrador y registro |
| Correo (Resend, previsto en CGB-41) | Fallo del proveedor | Aislarlo detrás de un adaptador y revertir la operación si falla el envío |
| Paquetes npm | Vulnerabilidades | CI con `npm audit` (job «Seguridad»); `next` y `zod` se actualizan en CGB-79 |

## 7. Cómo cambia este documento

- Una decisión de estructura nueva (un servicio aparte, otro proveedor, una nueva carpeta de capa) se anota aquí con su motivo y su costo, por Pull Request.
- Cada historia explica en su `HU0nn-DISENO-Y-TRAZABILIDAD.md` cómo aplica esta convención y por qué se desvía, si se desvía.
- Si una regla genera discusión repetida, se convierte en comprobación automática (lint o CI) y se retira de la revisión manual.
