# Laboratorio 7: Sprint Planning y ejecución inicial

**Asignatura:** Ingeniería de Software I (IF614)
**Proyecto:** CGB Academy · Jira `CGB` · GitHub `milith0kun/proyecto-ing-software`
**Sprint planificado:** Sprint 2: Onboarding

> **Estado de la evidencia.** Los datos de Jira se leyeron en vivo (solo lectura) el 09/11/2026 con la API del proyecto `CGB`. Lo marcado como **propuesto** todavía no está en Jira; el reparto de responsables ya se aplicó en Jira (ver sección 4).

## 1. Definición del sprint (Parte 1)

| Elemento | Definición |
|---|---|
| Sprint | Sprint 2: Onboarding (id 2, estado *active* en Jira) |
| Duración | 2 semanas: 09/11/2026 – 23/11/2026 (fechas cargadas en Jira) |
| Product Owner y Scrum Master | Edmil Jampier Saire Bustamante (ambos roles desde el Sprint 2) |
| Desarrolladores (4) | Alex Carpio Hermoza, Domingo Quispe Mamani, Ronaldo Ticona Jancco, Héctor Barazorda Cuellar |

**Objetivo del sprint** (el campo «objetivo» está vacío en Jira; se propone cargarlo)

> “Permitir que el administrador defina áreas, puestos y rutas de onboarding y registre colaboradores; que cada colaborador active su cuenta, consulte *Mi Onboarding* y registre su avance; y dejar configurado y disponible el microtest formativo.”

**Alcance excluido:** constancias, insignias y certificados (fuera del MVP; ver CGB-51). El reporte de avance (CGB-71, HU-015) permanece en el Sprint 3.

## 2. Selección de historias y capacidad (Parte 2)

### Cambio de alcance respecto a la planificación del Laboratorio 5

Dos historias se **adelantaron del Sprint 3 al Sprint 2**: CGB-61 (HU-013) y CGB-66 (HU-014), 10 SP. El Sprint 2 pasa de 22 a **32 SP** y el Sprint 3 queda solo con CGB-71 (5 SP). Esta decisión de alcance debe quedar aprobada por el Product Owner y registrada en Jira.

### Capacidad

- Referencia del Lab 5: 19 SP entregados en el Sprint 1 con 3 desarrolladores ≈ 6,3 SP por desarrollador. Con 4 desarrolladores, la capacidad equivalente es ≈ **25 SP**.
- El Sprint 2 compromete **32 SP**, es decir, 8 SP por desarrollador: ≈ 28 % sobre esa capacidad equivalente y ≈ 66 % sobre los 19,3 SP de velocidad media del Lab 5. Es un compromiso **ambicioso**; si el sprint se retrasa, las candidatas a salir son HU-014 (CGB-66) y HU-012 (CGB-56), las últimas de sus cadenas.
- El Sprint 1 cerró sus 19 SP de historias (CGB-16 y CGB-26 ya están Finalizadas), así que no hay arrastre de historias.
- Límite Kanban corregido en `docs/FLUJO_DE_TRABAJO.md` e `informe/informe.md`: **máximo 4 historias en desarrollo** (una activa por desarrollador, antes 3 con tres desarrolladores) y **2 en revisión** sin cambio. Cada desarrollador puede tener una historia en desarrollo a la vez; el límite de 2 en revisión mantiene la regla de dejar de iniciar trabajo nuevo y ayudar a revisar.

### Sprint Backlog: estado actual en Jira y reparto propuesto

Hoy Jira concentra 15 SP en Domingo, 11 en Alex, 6 en Ronaldo y **0 en Héctor**. El reparto propuesto deja a cada integrante con una historia de 3 SP y una de 5 SP (8 SP), conservando las historias de 3 SP y 5 SP que ya tenían donde fue posible.

| Clave | Historia | SP | Responsable actual (Jira) | Responsable **propuesto** | Depende de |
|---|---|:-:|---|---|---|
| CGB-31 | HU-007: Crear área y puestos de trabajo | 3 | Alex Carpio | Alex Carpio | — |
| CGB-36 | HU-008: Crear y secuenciar ruta de onboarding | 5 | Domingo Quispe | Domingo Quispe | CGB-31 |
| CGB-41 | HU-009: Registrar colaboradores y asignar rutas | 3 | Ronaldo Ticona | Ronaldo Ticona | CGB-31, CGB-36 |
| CGB-46 | HU-010: Activar cuenta de colaborador mediante token | 3 | Alex Carpio | **Domingo Quispe** | CGB-41 |
| CGB-51 | HU-011: Consultar panel personal Mi Onboarding | 5 | Domingo Quispe | **Ronaldo Ticona** | CGB-36, CGB-46 |
| CGB-56 | HU-012: Completar capacitación interna y registrar avance | 3 | Ronaldo Ticona | **Héctor Barazorda** | CGB-51 |
| CGB-61 | HU-013: Configurar microtest formativo | 5 | Alex Carpio | Alex Carpio | HU-003 (slides) |
| CGB-66 | HU-014: Realizar microtest formativo interactivo | 5 | Domingo Quispe | **Héctor Barazorda** | CGB-61 |
| | **Total** | **32** | | 8 SP por persona | |

Cuatro historias cambian de responsable (CGB-46, CGB-51, CGB-56, CGB-66). Los costos de ese reparto: CGB-51 y CGB-56 llevan prioridad *Highest* y `evidence-pending`, y se mueven a personas que no las tenían; y CGB-66 depende de CGB-61, que es de otra persona. El equipo puede preferir otro reparto; lo importante es que cada historia (y sus subtareas T1–T4) tenga responsable y que Héctor tenga carga.

### Riesgos

1. **Carga:** 32 SP, por encima de la capacidad equivalente. Plan de salida acordado de antemano (ver arriba).
2. **Dependencias en cadena** (CGB-31 → 36 → 41 → 46 → 51 → 56 y CGB-61 → 66): un retraso temprano bloquea a varias personas. Mitigación: fijar el esquema Prisma el primer día.
3. **Evidencia pendiente:** CGB-51 y CGB-56 llevan `evidence-pending`; no se han hecho entrevistas ni observación al colaborador. No se inventan hallazgos.
4. **Doble rol:** Edmil concentra Product Owner y Scrum Master. Debe facilitar la Day List y la Retrospectiva (CGB-76 y CGB-77, hoy en *Revisión* sin responsable) y no es revisor del código de otras personas por ser PO; las revisiones de PR las hacen los desarrolladores entre sí.
5. **Privacidad (AG-C01):** el avance de cada colaborador es dato personal; solo debe verlo el propio colaborador y el administrador.

## 3. Descomposición en tareas (Parte 3)

Cada historia ya tiene en Jira cuatro subtareas del ciclo TDD, todas en *Tareas por hacer*, con el mismo responsable que su historia y con **descripción vacía**:

| Historia | Subtareas T1 RED / T2 GREEN / T3 REFACTOR / T4 VALIDACIÓN |
|---|---|
| CGB-31 | CGB-32 / 33 / 34 / 35 |
| CGB-36 | CGB-37 / 38 / 39 / 40 |
| CGB-41 | CGB-42 / 43 / 44 / 45 |
| CGB-46 | CGB-47 / 48 / 49 / 50 |
| CGB-51 | CGB-52 / 53 / 54 / 55 |
| CGB-56 | CGB-57 / 58 / 59 / 60 |
| CGB-61 | CGB-62 / 63 / 64 / 65 |
| CGB-66 | CGB-67 / 68 / 69 / 70 |

Si cambia el responsable de una historia, sus cuatro subtareas deben cambiar con ella. El siguiente desglose técnico es una **propuesta** para completar esas descripciones (T1 = pruebas, T2 = implementación, T3 = refactor, T4 = validación de criterios BDD y `npm test` / `npm run lint`).

**Contrato de datos del día 1** (extiende `prisma/schema.prisma`, que hoy tiene `User`, `Sesion`, `Capacitacion` y `Slide`): `Area`, `Puesto`, `RutaOnboarding` y `PasoRuta` (capacitación interna + orden), token de activación, `Avance` por colaborador y capacitación, y las entidades del microtest (`Microtest`, `Pregunta`, `Intento`).

| Historia | Contenido técnico propuesto |
|---|---|
| CGB-31 | Modelos `Area` y `Puesto`; validación Zod con nombre único (CA-03 de Jira: alerta de duplicado); API protegida por rol admin (`src/lib/permisos.ts`); pantalla `admin/areas`. |
| CGB-36 | Modelos `RutaOnboarding` y `PasoRuta`; solo capacitaciones internas publicadas; API de creación y reordenamiento; editor en `admin/rutas`. |
| CGB-41 | Alta de colaborador inactivo con puesto y ruta; correo duplicado; formulario de alta. |
| CGB-46 | Token de un solo uso con expiración; casos inválido, expirado y reutilizado; pantalla de activación (define contraseña y `activo = true`). |
| CGB-51 | Consulta de la ruta del colaborador y porcentaje de avance; aislamiento entre usuarios; página `colaborador` con botón de continuar. |
| CGB-56 | Modelo `Avance`; registro idempotente; integración con `SlideViewer`. |
| CGB-61 | Modelo de microtest con preguntas y opciones; validación de configuración; pantalla de administración. |
| CGB-66 | Intento del colaborador, calificación y retroalimentación formativa; pantalla interactiva. |

Definition of Done: `docs/definition-of-done.md` (criterios verificados, `npm test` y `npm run lint`, revisión por otra persona, PR integrado en `main`).

## 4. Inicio del desarrollo (Parte 4)

### Estrategia de ramificación: Flujo de GitHub

Se eligió **Flujo de GitHub** y se descartó Git Flow: una sola rama permanente (`main`), una rama `feature` corta por historia creada desde `origin/main`, Pull Request revisado por otra persona y *Squash and merge*. No se usan `develop` ni `release`; el equipo es pequeño, los sprints duran dos semanas y hay una sola versión activa. Las versiones aprobadas se etiquetan desde `main`. La regla está en `docs/FLUJO_DE_TRABAJO.md`, en el README y en la sección 10.2 de `informe/informe.md`.

### Ramas por historia

Formato `<tipo>/<clave-jira>-<resumen>`. Las 8 ramas se crearon desde `origin/main` (commit `af60a3b`) y están **publicadas en GitHub** sin commits propios; cada responsable empieza por la subtarea T1 (RED) de su historia. El límite WIP de 4 se respeta en Jira, no por el número de ramas.

| Rama | Historia | Responsable | Estado |
|---|---|---|---|
| `feature/CGB-31-areas-y-puestos` | CGB-31 | Alex Carpio | publicada en GitHub |
| `feature/CGB-36-ruta-onboarding` | CGB-36 | Domingo Quispe | publicada en GitHub |
| `feature/CGB-41-registrar-colaboradores` | CGB-41 | Ronaldo Ticona | publicada en GitHub |
| `feature/CGB-56-completar-capacitacion` | CGB-56 | Héctor Barazorda | publicada en GitHub |
| `feature/CGB-46-activar-cuenta-token` | CGB-46 | Domingo Quispe | publicada en GitHub |
| `feature/CGB-51-mi-onboarding` | CGB-51 | Ronaldo Ticona | publicada en GitHub |
| `feature/CGB-61-configurar-microtest` | CGB-61 | Alex Carpio | publicada en GitHub |
| `feature/CGB-66-realizar-microtest` | CGB-66 | Héctor Barazorda | publicada en GitHub |

### Estado en Jira (leído y actualizado el 09/11/2026)

- Reparto de responsables aplicado en Jira: 4 historias y 16 subtareas reasignadas; cada desarrollador tiene 8 SP.
- Objetivo del Sprint 2 cargado en Jira; CGB-76 y CGB-77 asignadas a Edmil (Scrum Master).
- Tarea de alineación documental creada: **CGB-78** (README, flujo de trabajo, WIP 4, trazabilidad).
- Enlaces PR y commit añadidos a CGB-1, 6, 11, 16 y 21. CGB-26 no tiene un PR fusionado identificado en GitHub; queda sin enlace hasta confirmarlo.
- Sprint 1 sigue *active*: se cierra cuando se realice la retrospectiva (CGB-77).

### Trazabilidad y línea base

Jira → PR → commit en `main`: CGB-1 → PR #1 → `43d3425`; CGB-21 → #2 → `6380337`; CGB-11 → #3 → `c0016ca`; CGB-6 → #4 → `13c65e5`; CGB-16 → #5 → `47103c0`. **Línea base: pendiente de aprobación**; no hay tags ni releases (regla en `docs/configuracion.md`). Los documentos de flujo, configuración y DoD están en el PR #7, **abierto y sin revisión**.

### Pendiente para la entrega

- [ ] Revisión y fusión del PR #7 por una persona distinta del autor.
- [ ] Ajustar el límite WIP de 4 en la columna *En desarrollo* del tablero de Jira (configuración del tablero).
- [ ] Mover las historias iniciales a **En desarrollo** y capturar el tablero.
- [ ] Capturas de `git branch` y `git push` de cada rama; primer commit y PR por historia (ej. `feat(areas): modelos de área y puesto (CGB-31)`).
- [ ] Retrospectiva (CGB-77) y cierre del Sprint 1.
- [ ] Registrar la decisión sobre IA en un PR (o "sin uso").

## 5. Trabajo extra

Pendiente: avance de implementación. No se registró ninguno al redactar este documento.
