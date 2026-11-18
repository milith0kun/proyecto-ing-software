# Guía de revisión de historias — CGB Academy

**Estado:** estándar del equipo (propuesto el 18/11/2026; vigente al fusionarse en `main`).
**Alcance:** cualquier historia de usuario (HU) o tarea que llegue a revisión. Es **un solo esquema** para todas las HU; no se escribe una guía por historia.
**Fuentes:** los cuatro documentos de clase de Ingeniería de Software I, citados por lámina o sección:

| Sigla | Documento | Qué aporta a la revisión |
|---|---|---|
| **GC** | `Diapos/3.Gestion_de_configuracion.pdf` | Versiones, ramas, PR, revisión, tablero, DoD, IA |
| **REQ** | `Diapos/4. Requisitos.pdf` | Historia = tarjeta + conversación + confirmación; INVEST; RNF en la DoD; MVP |
| **DIS** | `Diapos/5.Diseno_Software.pdf` | Cohesión, acoplamiento, encapsulación, SOLID, patrones sin sobreingeniería |
| **ARQ** | `Diapos/6 Arquitectura.pptx` | Capas, MVC web, monolito frente a microservicios, costo de la decisión |

Esta guía no sustituye a [`FLUJO_DE_TRABAJO.md`](FLUJO_DE_TRABAJO.md), [`definition-of-done.md`](definition-of-done.md) ni [`REQUISITOS_APLICADOS.md`](REQUISITOS_APLICADOS.md); los aplica en el momento de revisar. Si hay contradicción, manda el documento canónico y se corrige esta guía.

## 1. Cómo se usa

Cuando alguien pida «revisa esta HU con la estructura» (o «revisa la rama X»), quien revisa —persona o asistente— hace esto, en orden:

1. **Ubicar la evidencia real** (sección 2). No se afirma nada que no se haya abierto, ejecutado o consultado ese día.
2. **Recorrer las cuatro listas** (secciones 4 a 7) punto por punto y citar la diapositiva de la matriz de la sección 11. Cada punto termina con un estado y un «dónde».
3. **Separar responsables** en cada lista: 👤 *Autor* (lo que debe cumplir o corregir quien hizo la HU) y 🔍 *Revisor* (lo que hace quien revisa e integra).
4. **Emitir el informe con la plantilla de la sección 3** (misma estructura siempre) y el veredicto de la sección 8.
5. **Registrar** el resultado en el PR (plantilla de la sección 9) y, si cambia el estado de la historia, en Jira.

Un asistente de IA puede preparar el informe, pero **no aprueba, fusiona, publica ni mueve estados de Jira** sin una instrucción explícita de la persona responsable de la revisión (GC, lámina 37: «la aprobación es humana»).

## 2. Esquema del flujo: quién hace qué

```text
 NECESIDAD / HU en Jira ─────────────────────────────────────────────────────────────┐
   │  [PO]   conversación y criterios de aceptación, RNF y dependencias (Blocks)     │
   ▼                                                                                  │
 RAMA  <tipo>/<CGB-ID>-<resumen>  creada desde origin/main                           │
   │  [👤 Autor]  TDD/BDD, commits `tipo(ámbito): … (CGB-n)`, capas respetadas        │
   ▼                                                                                  │
 ANTES DEL PR  [👤 Autor]                                                             │
   │  git fetch + git merge origin/main EN SU RAMA (resuelve conflictos él mismo)     │
   │  npm test · npm run lint · tsc · build si aplica · evidencia (capturas/logs)     │
   ▼                                                                                  │
 PULL REQUEST hacia main  [👤 Autor]  plantilla completa + «Uso de IA» + RNF         │
   │  CI en verde: Build, Tests, Lint, Seguridad                                      │
   ▼                                                                                  │
 REVISIÓN  [🔍 Revisor]  listas GC · REQ · DIS · ARQ  →  informe + comentarios        │
   │     ┌── hay bloqueantes ──► CHANGES_REQUESTED ──► [👤] corrige y hace push ──┐   │
   │     │                                                                         │   │
   │     └◄────────────────────────────────────────────────────────────────────────┘   │
   ▼  sin bloqueantes, conversaciones resueltas                                        │
 APROBACIÓN  [🔍 Revisor ≠ autor, DESPUÉS del último push]                            │
   ▼                                                                                  │
 INTEGRACIÓN  [🔍 Integrador]  Squash and merge → main                                │
   ▼                                                                                  │
 DESPUÉS  [👤 Siguientes ramas]  git merge origin/main en SUS ramas                   │
   │  [🔍 Revisor] Jira → Hecho con PR, commit y evidencia (DoD)  ◄───────────────────┘
```

Reglas del esquema:

- **Nadie sube a `main` directamente.** Se integra solo por PR aprobado. `git merge origin/main` significa traer `main` a *la propia rama*, nunca publicar en `main`.
- **Quien hace el último push no puede aprobar.** Si el revisor corrige código en la rama del autor, su aprobación deja de valer; las correcciones las hace el autor.
- **Las ramas dependientes esperan.** Si una HU toca modelos compartidos (por ejemplo `prisma/schema.prisma`), se integra primero la que define el modelo oficial y las demás hacen `merge` de `main` y resuelven sus conflictos.
- **Un bloqueo se explica**: causa, quién lo resuelve y siguiente acción (GC, lámina 30).

## 3. Formato del informe de revisión (plantilla obligatoria)

Todo informe de cualquier HU se genera con **esta estructura exacta**, sin omitir apartados ni cambiar el orden. Los textos entre `<…>` se sustituyen; lo demás se conserva.

````markdown
CGB-<n> (HU-0<nn>) completo: qué cumple, qué falta, estado y dónde (<dd/mm/aaaa>, <SHA corto>)
Leyenda: ✅ Cumple · ⚠️ Cumple en parte · ❌ No cumple · ⏳ Pendiente de otro paso · ⚪ Menor.
Rutas: archivos de la rama <rama>, salvo que diga otra cosa. Autor: <nombre>. <Tiene PR #n | No tiene PR>.

Veredicto: <2-4 frases: qué funciona, qué impide revisarla o aprobarla, qué es lo más valioso>.

Fortaleza y mejora concreta: <una fortaleza> · <una mejora concreta>.

Estado: <conflictos con main y con qué ramas/PR chocan archivos concretos>.

Lo que hice ahora por esta HU
| Qué | Dónde |
|---|---|
| <acción realizada: comentario, Jira, enlace, prueba reproducida> | <PR / commit / Jira> |
<Lo que no puede hacer el revisor y es paso del autor, dicho en una frase.>

## 1. 📘 Gestión de configuración   (fuente: lista GC, sección 4)
### 👤 <Autor>
| # | Punto (diap.) | Estado | Qué cumple y en qué | Qué falta | Dónde |
|---|---|---|---|---|---|
### 🔍 Tú
| # | Punto (diap.) | Estado | Qué cumple | Qué falta | Dónde |
|---|---|---|---|---|---|
Equipo: <decisiones o pasos que no son del autor ni del revisor>.

## 2. 📗 Requisitos   (fuente: lista REQ, sección 5)
### 👤 <Autor>      (misma tabla de 6 columnas)
### 🔍 Tú           (tabla: # | Punto | Estado | Qué falta | Dónde)

## 3. 📙 Diseño de software   (fuente: lista DIS, sección 6)
### 👤 <Autor>      (misma tabla de 6 columnas)
### 🔍 Tú           (tabla: # | Punto | Estado | Qué falta | Dónde)

## 4. 📕 Arquitectura   (fuente: lista ARQ, sección 7)
### 👤 <Autor>      (misma tabla de 6 columnas)
Equipo: <esquema único, convención común, dueño de datos>.

## Resumen del estado
| PDF | ✅ Cumple | ⚠️ En parte | ❌ No cumple | ⏳ Pendiente de otro paso |
|---|---|---|---|---|
| Gestión de configuración | n | n | n | n |
| Requisitos | n | n | n | n |
| Diseño | n | n | n | n |
| Arquitectura | n | n | n | n |

## Qué se puede hacer hoy y qué espera
| Qué | ¿Hoy? |
|---|---|
| <acción> | ✅ Sí, <quién> · ⛔ No, <por qué> · ⏳ Tras <paso> |

Qué separa a <CGB-n> de «revisable»: <lista corta>. Qué la separa de «aprobable»: <lista corta>.

¿Seguimos con <siguiente HU y autor> en este mismo formato?
````

Reglas de relleno:

1. **Encabezado:** fecha y SHA son los de la revisión real; el SHA se confirma con `git rev-parse --short origin/<rama>` ese mismo día.
2. **Una fila por punto de la lista** correspondiente (secciones 4 a 7). Si un punto no aplica, va como ⚪ con la razón; no se omite.
3. **Punto (diap.):** nombre del punto y, entre paréntesis, los números de lámina del documento de clase donde se funda (por ejemplo «Controlador como intermediario (47-50)»). Los números salen de la matriz de la sección 11.
4. **Qué cumple y en qué:** nombra el archivo, prueba, commit o comando que lo demuestra. Una fila ✅ sin evidencia nombrada se baja a ⏳.
5. **Qué falta:** la acción concreta que debe hacer la persona, no un diagnóstico. Si es una decisión de producto, se dice «decisión del PO».
6. **Dónde:** ruta con línea, PR, hilo o clave de Jira. Si el archivo de la rama no está en `main`, se aclara «en la rama».
7. **Tabla 🔍 Tú** lleva lo que hace quien revisa: revisión del diff, verificar correcciones, CI, hilos, aprobación, Squash and merge, DoD y Jira. Los puntos que dependen del autor quedan en ⏳.
8. **Resumen del estado:** cuenta exactamente las filas ✅/⚠️/❌/⏳ de las tablas del **autor** de cada PDF; la fila ⚪ no se cuenta.
9. **Lo que hice ahora:** solo se anotan acciones que se ejecutaron y se pueden verificar (comentarios, enlaces en Jira, pruebas reproducidas). Un asistente no lista como hecha una aprobación, fusión o cambio de Jira que no ocurrió.
10. **Cierre:** siempre las dos frases «revisable» y «aprobable» y la pregunta de la HU siguiente.

Estados: ✅ cumple y hay evidencia · ⚠️ cumple en parte o falta evidencia/decisión · ❌ no cumple · ⏳ pendiente de otro paso o no verificado ese día · ⚪ menor o no aplica (con razón).

**Dónde** es siempre una ruta de archivo con línea, un PR/hilo, una prueba o una clave de Jira. Un punto sin «dónde» no se da por comprobado.

## 4. Lista GC — Gestión de configuración y control de cambios

Fuente: `3.Gestion_de_configuracion.pdf`. Responsables: 👤 autor · 🔍 revisor · PO.

| # | Punto | Qué se comprueba | Cómo / dónde | Resp. | Lámina |
|---|---|---|---|---|---|
| GC-01 | Rama y clave Jira | Nombre `<tipo>/<CGB-ID>-<resumen>`; la clave existe en Jira; una sola historia | `git branch -r`, PR | 👤 | 20, 21 |
| GC-02 | Rama al día | La rama contiene `origin/main` actual; conflictos resueltos entendiendo ambas intenciones y validando el comportamiento | `git merge-base --is-ancestor origin/main <rama>`; `git merge-tree` | 👤 | 14, 15 |
| GC-03 | Commits con intención | `tipo(ámbito): descripción (CGB-n)`; un propósito por commit; el mensaje refleja el diff; se revisó `git status` y `git diff --staged` antes de confirmar | `git log origin/main..<rama>` | 👤 | 13, 27 |
| GC-04 | Solo lo de la tarea | Sin `.env`, secretos, `node_modules`, `.next`, archivos ajenos ni otro lockfile; los datos de prueba, scripts y la configuración de automatización que usa la HU están versionados y ubicados | `git diff --stat origin/main...<rama>` | 👤 | 6 |
| GC-05 | Issue claro | Problema, contexto, criterios de aceptación, responsable y prioridad | Jira | PO / 👤 | 23 |
| GC-06 | PR completo | Plantilla llena: necesidad, cambio, verificación real, RNF, uso de IA | PR | 👤 | 24, 25 |
| GC-07 | Verificación registrada | `npm test`, `npm run lint`, `tsc` y, si toca build/rutas/dependencias, `npm run build`; comando y resultado | PR / documento de validación | 👤 | 25, 32 |
| GC-08 | Verificación reproducida | El revisor ejecutó los comandos sobre el SHA publicado (worktree o clon limpio) | Salida del comando | 🔍 | 26, 43 |
| GC-09 | CI: Tests y lint | El job «Lint y pruebas» (`npm test` y `npm run lint`) está en verde en el PR | PR → Checks | 🔍 | 25 |
| GC-10 | Impacto de datos y config | Cambio en base compartida (`db push`) documentado: entorno, qué se aplicó, quién autorizó; variables en `.env.example` sin valores reales | Documento de la HU | 👤 | 8 |
| GC-11 | Revisión del diff | Correctitud, referencias desactualizadas, evidencia de que funciona | Comentarios con archivo, escenario y consecuencia | 🔍 | 26 |
| GC-12 | Hilos y aprobación | Conversaciones resueltas; aprobación de una persona distinta del autor, después del último push | PR | 🔍 | 25, 40 |
| GC-13 | Integración | Squash and merge con título `tipo(ámbito): … (HU-0nn / CGB-n)` | PR → `main` | 🔍 | 14, 20, 25 |
| GC-14 | Trazabilidad | Necesidad → issue → rama → PR → commit → prueba enlazados; incluye la prueba y la versión (tag o SHA de `main`) que contienen el cambio | Jira + PR | 👤 / 🔍 | 9 |
| GC-15 | Tablero y WIP | Estado coherente con la realidad; límites WIP; bloqueos visibles con causa y responsable; cada tarjeta cumple la condición de su columna: entrada clara → cambio activo → PR y evidencia → DoD cumplida | Jira | 🔍 / PO | 30 |
| GC-16 | DoD | Se cumplen los seis puntos de `definition-of-done.md` antes de pasar a Hecho | PR + Jira | 🔍 | 32 |
| GC-17 | Uso de IA | Herramienta, qué propuso, qué decidió el equipo y cómo se verificó; o «sin uso». La afirmación de la IA se contrasta con archivos y pruebas; decisión trazable: motivo, cambio aplicado y evidencia de validación de cada propuesta aceptada, modificada o rechazada | PR, sección «Uso de IA» | 👤 / 🔍 | 34–38 |
| GC-18 | Línea base | No se declara línea base ni tag sin identificar SHA, alcance, instrucciones y aprobación | `docs/configuracion.md` | PO / 🔍 | 7, 16 |
| GC-19 | Reconstrucción | Otra persona puede clonar, instalar con `npm ci` y reproducir lo que se declaró | README, `docs/configuracion.md` | 👤 | 10, 42 |
| GC-20 | CI: Build | `npm run build` pasa en la CI y no necesita secretos | PR → Checks (job «Build») | 🔍 | 25 |
| GC-21 | CI: Seguridad | `npm audit` sin vulnerabilidades altas ni críticas en producción introducidas por la HU; las ya existentes se tratan en su propia tarea | PR → Checks (job «Seguridad») | 🔍 / 👤 | 25 |
| GC-22 | Evaluación de impacto | Se evaluaron comportamiento, interfaces/API, pruebas, documentación y entrega; si se rechaza o pospone, queda la razón | PR / Jira | PO / 👤 | 8 |
| GC-23 | Despliegue y cierre | Rama eliminada tras fusionar; entorno de destino anotado cuando exista | GitHub, `docs/configuracion.md` | 🔍 | 25 |
| GC-24 | Roles | El autor explica y verifica; el revisor contrasta; el equipo resuelve el impacto en las HU dependientes; el integrador comprueba los acuerdos antes del merge | PR | todos | 40 |
| GC-25 | Fortaleza y mejora | El informe nombra una fortaleza y una mejora concreta | Informe | 🔍 | 42 |

## 5. Lista REQ — Requisitos

Fuente: `4. Requisitos.pdf`. Apóyate en la matriz y los conflictos de [`REQUISITOS_APLICADOS.md`](REQUISITOS_APLICADOS.md).

| # | Punto | Qué se comprueba | Cómo / dónde | Resp. |
|---|---|---|---|---|
| REQ-01 | Tarjeta | Formato «Como [usuario], quiero [acción] para [objetivo]»; la acción es funcionalidad, no solución técnica | Jira | PO / 👤 |
| REQ-02 | Conversación | Qué decidió el PO sobre cada criterio dudoso queda registrado; las dudas abiertas no se «inventan» | Jira / PR | PO |
| REQ-03 | Confirmación | Cada criterio de aceptación es observable (condición → resultado) y tiene su prueba o evidencia | Pruebas BDD, capturas | 👤 |
| REQ-04 | Cobertura de criterios | Todos los criterios de la HU se verificaron en el escenario descrito; el que falla impide cerrar | Documento de validación | 👤 / 🔍 |
| REQ-05 | INVEST | Independiente (dependencias con vínculo *Blocks*), negociable, valiosa, estimable, pequeña, comprobable | Jira | PO / 🔍 |
| REQ-06 | Aceptación frente a DoD | Los criterios de aceptación son de la historia; la DoD es del equipo y no se redefine por HU | PR | 🔍 |
| REQ-07 | RNF aplicables | Se listan por ID (RNF-001…010) y cada uno se comprueba con su métrica o por inspección; un RNF no comprobado se declara pendiente | PR, matriz de `REQUISITOS_APLICADOS.md` | 👤 |
| REQ-08 | Privacidad y seguridad | Sesión exigida, una cuenta no ve datos de otra, el origen se valida, no se persisten secretos en claro | Pruebas y revisión del código | 👤 / 🔍 |
| REQ-09 | Casos de uso cuando aplican | Procesos con varios pasos, flujos alternativos o reglas complejas tienen flujo normal y extensiones (errores) | `REQUISITOS_APLICADOS.md` | 👤 |
| REQ-10 | Alcance mínimo | Nada que no pida un criterio; sin funciones «por si acaso» (*feature bloat*, regla 80/20) | Diff frente a criterios | 🔍 |
| REQ-11 | Conflictos entre HU | Si dos HU deciden lo mismo con reglas distintas, se eleva al PO y se registra la decisión | Hilo del PR + Jira | PO |
| REQ-12 | Hipótesis frente a evidencia | Lo no validado con usuarios se rotula como hipótesis; no se informan entrevistas o pruebas que no ocurrieron | Documentos de la HU | 👤 |
| REQ-13 | Cobertura | La cobertura de pruebas se mide; el umbral (por ejemplo ≥ 80 %) está pendiente de acordar con el PO | Informe de cobertura | 👤 / PO |
| REQ-14 | Aprobación de la interfaz | Si cambia el frontend, la aprobación de quien diseña (PO o diseñador) consta en el PR | PR | PO |
| REQ-15 | RNF como criterio de terminado | Cada RNF declarado tiene su revisión de código centrada en él y, si aplica, una prueba con carga real | PR | 👤 / 🔍 |
| REQ-16 | Épica y experimento | HU pequeña (las épicas se dividen); si es experimento: hipótesis, métrica y decisión posterior (continuar, pivotar o abandonar) | Jira | PO |

## 6. Lista DIS — Diseño de software

Fuente: `5.Diseno_Software.pdf`. Se evalúa el diseño detallado: clases, funciones y módulos.

| # | Punto | Qué se comprueba | Cómo / dónde | Resp. |
|---|---|---|---|---|
| DIS-01 | Abstracción | La lógica depende de un contrato (función o interfaz), no de un proveedor concreto (`new` de una implementación dentro del servicio) | `git grep -n "new "` en `src/lib` | 👤 |
| DIS-02 | Modularidad | Cada archivo tiene un propósito; no hay un bloque «todo mezclado» | Tamaño y responsabilidades del archivo | 👤 |
| DIS-03 | Separación de responsabilidades | Reglas de negocio, persistencia, notificaciones y presentación están en piezas distintas | Estructura de `src/lib` | 👤 |
| DIS-04 | Encapsulación | El estado se cambia por operaciones que validan reglas; no se aceptan campos de identidad o permisos del cuerpo de la petición | Rutas y servicios | 👤 |
| DIS-05 | Alta cohesión | Cada módulo agrupa operaciones relacionadas; sin «Utilidades» que mezclan temas | Lectura del módulo | 👤 |
| DIS-06 | Bajo acoplamiento | Un cambio no obliga a editar muchos archivos; las dependencias entran por parámetro (inyección) | Imports y firmas | 👤 |
| DIS-07 | SRP | Cada unidad tiene una sola razón de cambio (p. ej. un servicio no mezcla HTTP, reglas y datos) | `git grep -n "NextResponse" src/lib` | 👤 / 🔍 |
| DIS-08 | OCP | Agregar una variante no obliga a editar condicionales que crecen | Ramas `if/switch` | 👤 |
| DIS-09 | LSP e ISP | Los reemplazos cumplen el contrato; no se obliga a implementar métodos inútiles | Interfaces | 👤 |
| DIS-10 | DIP | El dominio no conoce detalles tecnológicos (base de datos, framework, correo) | `src/lib/<dominio>.ts` sin imports de infraestructura | 👤 |
| DIS-11 | Code smells | Condicionales que crecen, un cambio que toca muchos archivos, reglas repetidas en varias clases | Lectura del diff | 🔍 |
| DIS-12 | Sin sobreingeniería | Patrón (Strategy, Adapter, fábrica) solo si hay variación real; una regla estable puede ser una función | Justificación en el PR | 👤 / 🔍 |
| DIS-13 | Testabilidad | La regla se prueba sin conectarse a servicios externos; las pruebas cubren casos límite | `tests/` | 👤 |
| DIS-14 | Integridad de datos | Borrados y relaciones protegen el historial (`Restrict` frente a `Cascade` si se pierde información); índices únicos para unicidad | `prisma/schema.prisma` | 👤 / 🔍 |
| DIS-15 | Modelo único | Un mismo concepto no se define dos veces con formas distintas en ramas diferentes | `schema.prisma` entre ramas | 👤 / PO |
| DIS-16 | Documento de diseño | Decisiones y trazabilidad HU → criterios → pruebas → archivos | `docs/HU0nn-DISENO-Y-TRAZABILIDAD.md` | 👤 |
| DIS-17 | Proceso de diseño | Observar → explicar → corregir → probar → comparar → decidir; se conservan solo las mejoras justificadas | PR | 👤 |
| DIS-18 | Refactor seguro | Pruebas verdes antes y después, pasos pequeños y ninguna funcionalidad nueva en los commits `refactor` | `git log`, PR | 👤 |

## 7. Lista ARQ — Arquitectura

Fuente: `6 Arquitectura.pptx`. Estilo del proyecto: **monolito modular en capas con MVC web** (Next.js).

```text
Vista        src/app/**/page.tsx · src/components/**        (qué ve la persona)
Controlador  src/app/api/**/route.ts                         (recibe HTTP, delega; delgado)
Modelo       src/lib/servicio-*.ts  →  src/lib/<dominio>.ts  (reglas, sin HTTP)
                                    →  src/lib/repositorio-*.ts
Datos        Prisma + MongoDB Atlas                          (solo desde repositorios)
```

Regla de capas (ARQ, láminas 21 y 28): **la capa n solo usa la capa n-1**; el cliente no se salta la capa de negocio.

| # | Punto | Qué se comprueba | Cómo / dónde | Resp. |
|---|---|---|---|---|
| ARQ-01 | Capas respetadas | Vista → Controlador/Servicio → Repositorio → Datos; sin saltos | `git grep -nE "prisma\|@prisma/client" -- src/app` debe salir vacío para código nuevo | 👤 / 🔍 |
| ARQ-02 | Vista sin datos | Las páginas llaman al servicio, no al repositorio ni a Prisma | `page.tsx` | 👤 |
| ARQ-03 | Controlador delgado | Cada `route.ts` solo conecta la petición con el servicio | Líneas de cada `route.ts` | 👤 |
| ARQ-04 | Modelo sin HTTP | Servicios, dominio y repositorios no importan `NextRequest`/`NextResponse`; devuelven datos o errores de dominio | `git grep -n "NextResponse" -- src/lib` | 👤 / 🔍 |
| ARQ-05 | Dominio puro | El archivo de reglas no importa framework ni base de datos | Imports del archivo | 👤 |
| ARQ-06 | Dueño de los datos | Cada colección tiene un módulo dueño; otro módulo no escribe en ella ni crea una segunda colección para lo mismo | `schema.prisma` y repositorios | 👤 / PO |
| ARQ-07 | Sesión y permisos | Las rutas privadas usan la verificación de sesión y de rol del proyecto | `src/lib/permisos.ts`, `route.ts` | 👤 |
| ARQ-08 | Un modelo, varias vistas | El estado vive en el modelo; la vista solo lo presenta (MVC) | Componentes | 👤 |
| ARQ-09 | Monolito con módulos claros | No se introducen servicios o procesos nuevos sin justificarlos; la complejidad se defiende con costo y madurez del equipo | PR | 👤 / PO |
| ARQ-10 | Decisión y costo futuro | Las decisiones de estructura se justifican con restricciones reales y se anotan; el costo puede aparecer años después; se anotan observabilidad (registro de errores) y puntos únicos de fallo | `docs/` o PR | 👤 |
| ARQ-11 | Dependencia de proveedor | Si se usa un servicio gestionado (BaaS, Atlas, correo), se anota la dependencia y el costo variable | `docs/configuracion.md` | 👤 / PO |
| ARQ-12 | Interfaz dinámica (SPA/MPA) | Los componentes de cliente piden datos por API; no incrustan reglas de negocio | `*.tsx` con `'use client'` | 👤 |
| ARQ-13 | Arquitectura justificada | El documento de diseño explica por qué monolito modular y qué alternativa se descartó | `docs/HU0nn-DISENO…` | 👤 / PO |
| ARQ-14 | Consistencia entre colecciones | Las escrituras en varias colecciones usan transacción o compensación explícita y probada | Servicio + pruebas | 👤 |
| ARQ-15 | Observabilidad y fallo único | Los errores se registran sin datos personales y el punto único de fallo está reconocido | `docs/`, código | 👤 / PO |

## 8. Veredicto y qué bloquea

| Veredicto | Cuándo |
|---|---|
| **Aprobable** | Ningún ❌ bloqueante; hilos resueltos; verificación reproducida; CI en verde |
| **Cambios solicitados** | Hay al menos un ❌ bloqueante |
| **En espera** | Falta una decisión del PO o que se integre otra HU de la que depende |

**Bloqueante** (impide fusionar): criterio de aceptación sin evidencia o fallido; pruebas, lint, build o CI en rojo, o check de CI ausente una vez que el workflow esté en `main`; dependencia nueva con vulnerabilidad alta o crítica; conflicto sin resolver o rama que no contiene `main`; RNF de privacidad o seguridad sin comprobar; secreto o dato personal en claro; pérdida de datos por borrado en cascada no decidida; salto de capa o HTTP dentro del modelo en **código nuevo**; modelo duplicado que choca con otra HU.

**No bloqueante** (se anota y se programa): tamaño de componentes, refactor de código antiguo, mejoras de cohesión, documentación adicional, evidencia complementaria. Se deja como comentario con propuesta, no como `CHANGES_REQUESTED`.

Cuando la HU toca algo que otra rama ya definió oficialmente, se aplica el modelo oficial de la HU integrada primero.

## 9. Plantilla del comentario o review en el PR

```markdown
**Revisión de <CGB-n / HU-0nn> sobre `<SHA>` (<fecha>)**

Veredicto: <Aprobable | Cambios solicitados | En espera>

Comprobado: <comandos y resultado>, CI <resultado>, hilos abiertos <n>.

Bloqueantes
- [<GC|REQ|DIS|ARQ>-nn] <qué ocurre> — <archivo:línea> — <consecuencia> — <cómo corregirlo>

No bloqueantes
- [<id>] <mejora propuesta>

Decisiones del PO pendientes
- <pregunta concreta>

Siguiente paso: <quién hace qué>
```

Cada observación indica archivo, escenario y consecuencia (GC, lámina 37). No se marca como resuelto un hilo sin que el autor lo haya atendido o el PO lo haya decidido.

## 10. Mantenimiento de esta guía

- Cambia solo mediante PR revisado, como cualquier documento del repositorio.
- Si un documento de clase se actualiza, se actualizan primero los puntos afectados y la columna *Lámina*.
- Si un punto genera discusión repetida, se convierte en regla del PR (plantilla) o en una comprobación automática (lint, CI) y se retira de la revisión manual.

## 11. Matriz de exigencias: qué pide cada PDF y qué debe llevar toda HU

Esta sección es el análisis completo de los cuatro documentos. Cada fila une **lo que pide el PDF** (con su diapositiva o página) con **lo que toda historia debe llevar** y **dónde se comprueba**. La columna *ID* remite a las listas de las secciones 4 a 7; la columna *Diap.* es la que se cita en el informe (sección 3). Numeración: GC y REQ = página del PDF; DIS = página del PDF; ARQ = número de diapositiva del `.pptx`.

### 11.0 Paquete mínimo que toda HU debe llevar

| Artefacto | Contenido obligatorio | Dónde vive | PDF que lo exige |
|---|---|---|---|
| **Tarjeta en Jira** | «Como … quiero … para …»; prioridad; responsable; estimación | Jira CGB-n | REQ, GC |
| **Conversación registrada** | Qué decidió el PO sobre cada criterio dudoso; preguntas abiertas | Comentario Jira | REQ |
| **Criterios de aceptación** | Observables: condición → resultado; uno por escenario | Jira + prueba por criterio | REQ, GC |
| **RNF aplicables** | Lista por ID (RNF-001…010) y cómo se comprobó cada uno | PR + `REQUISITOS_APLICADOS.md` | REQ |
| **Dependencias** | Vínculo *Blocks* con otras HU; decisiones del PO pendientes | Jira | REQ, GC |
| **Subtareas** | Pruebas (RED), implementación (GREEN), refactor, validación | Jira | GC, DIS |
| **Rama y commits** | `<tipo>/<CGB-ID>-<resumen>`; `tipo(ámbito): … (CGB-n)`; contiene `origin/main` | GitHub | GC |
| **Pruebas** | Una por criterio, más casos límite, errores y privacidad; sin red ni servicios externos | `tests/` | REQ, DIS, GC |
| **Código por capas** | Vista → Controlador → Servicio → Repositorio → Datos; dominio puro | `src/` | ARQ, DIS |
| **Documento de validación** | Criterio → prueba → evidencia → estado; comandos y resultados reales; bloqueos | `docs/HU0nn-VALIDACION.md` | GC, REQ |
| **Documento de diseño y trazabilidad** | Capas, decisiones y su razón, HU → criterios → pruebas → archivos | `docs/HU0nn-DISENO-Y-TRAZABILIDAD.md` | DIS, ARQ, GC |
| **Evidencia** | Capturas o logs reproducibles de cada criterio; base de datos real si aplica | `docs/evidencias-hu0nn/` | GC, REQ |
| **PR** | Plantilla completa, CI verde, uso de IA, RNF, enlace al issue | GitHub | GC |
| **Cierre** | DoD de 6 puntos; Squash and merge; Jira → Hecho con PR y commit | PR + Jira | GC |
| **Evaluación de impacto** | Comportamiento, interfaces/API, pruebas, documentación y entrega; razón si se rechaza o pospone | PR o Jira | GC |
| **Trazabilidad completa** | Issue → PR → commit → prueba → versión (tag o SHA de `main`) | Jira + PR | GC |
| **CI en verde** | Build, Tests, Lint y Seguridad (este último informativo hasta actualizar dependencias) | PR → Checks | GC |

### 11.1 GC — Gestión de configuración y control de cambios (46 páginas)

| Diap. | Qué pide el PDF | Qué debe llevar toda HU | Se comprueba en | ID |
|---|---|---|---|---|
| 4, 9 | Un nombre o referencia que queda obsoleto rompe el sistema; seguir el cambio hasta la implementación | Búsqueda de referencias desactualizadas en cada diff; cadena issue → PR → commit → prueba | Diff + PR | GC-11, GC-14 |
| 6 | Cada elemento tiene identidad, versión, ubicación y responsable | Archivos de la HU ubicados en `src/`, `tests/`, `docs/`; sin `.env` ni secretos | `git diff --stat` | GC-04 |
| 7, 16, 17 | Línea base = versión identificada y aprobada; tag no equivale a línea base | No declarar línea base sin SHA, alcance, instrucciones, entorno y aprobación | `docs/configuracion.md` | GC-18 |
| 8 | Control de cambios: proponer → evaluar impacto → decidir → aplicar → registrar; también el rechazo | Impacto evaluado (datos, API, pruebas, docs); decisiones del PO en Jira | Jira + PR | GC-05, GC-10 |
| 9 | Trazabilidad necesidad → issue → PR → commit → prueba → versión | Enlaces Jira ↔ PR ↔ commit en ambas direcciones | Jira + PR | GC-14 |
| 10 | Otro equipo puede reconstruir la demostración | `npm ci` y pasos de ejecución reproducibles | README | GC-19 |
| 11–12 | Repositorio local/remoto; `fetch` y `push` | Rama publicada; revisión del estado antes de editar | GitHub | GC-01 |
| 13 | Un commit = una intención; revisar `git diff --staged` | Commits de un solo propósito y mensaje fiel al diff | `git log` | GC-03 |
| 14, 19, 20 | Estrategia de ramas; GitHub Flow: rama corta → PR → `main` | Rama corta por HU; sin ramas personales ni `develop` | GitHub | GC-01 |
| 15 | Conflicto: leer ambas intenciones, acordar la regla, validar el comportamiento | `merge origin/main` hecho por el autor, con pruebas después | `git merge-base` | GC-02 |
| 21, 28, 33 | Ejercicios: evidencia = URL de commit/PR, comentario y respuesta | Evidencia enlazable de cada paso | PR | GC-06 |
| 23 | Un issue útil: problema, contexto, pasos, esperado, criterios, responsable, prioridad | Tarjeta con los siete elementos | Jira | GC-05 |
| 24–25 | PR explica qué, por qué y cómo probarlo; pruebas automáticas; revisión; aprobación; merge | Plantilla completa, CI en verde, revisores asignados | PR | GC-06, GC-09 |
| 26 | Code review: correctitud, impacto y evidencia | Comentarios con archivo, escenario y consecuencia | PR | GC-11 |
| 27 | `tipo(ámbito): descripción`; el mensaje refleja el diff | Conventional Commits con clave CGB | `git log` | GC-03 |
| 30–31 | Tablero con cuatro estados y condiciones de avance; bloqueo visible con causa y responsable | Estado de Jira coherente; WIP respetado | Jira | GC-15 |
| 32, 33 | DoD distinta de los criterios de aceptación; «Hecho» = evidencia verificable | Seis puntos de `definition-of-done.md` | PR + Jira | GC-16 |
| 34–38 | IA explica y propone; el equipo comprueba; hallazgo = archivo, línea, escenario, consecuencia; decisión registrada (aceptar, modificar o rechazar) o «sin uso» | Sección «Uso de IA» con herramienta, decisión y verificación | PR | GC-17 |
| 39–41 | Entregable: repositorio, tablero, workflow y DoD con un enlace principal | README con enlaces a flujo, DoD y guía de revisión | README | GC-19 |
| 43 | «¿Qué falta para confiar?»: cada afirmación necesita una condición comprobable | Ningún ✅ sin evidencia nombrada | Informe | todos |
| 6 | Ítems: también requisitos, datos de prueba, scripts y configuración de automatización | Datos de prueba (seed), scripts y workflows de la HU versionados y ubicados | `prisma/`, `package.json`, `.github/` | GC-04 |
| 8 | Impacto en comportamiento, interfaces, pruebas, documentación y entrega; si se rechaza o pospone se conserva la razón | Sección «Impacto» en el PR o en Jira con las cinco dimensiones; razón registrada si se pospone | Jira + PR | GC-22 |
| 9 | Trazabilidad: añadir la prueba y la versión que contienen el cambio | Enlace a la prueba y a la versión (tag o SHA de `main`) | Jira | GC-14 |
| 13 | `git status` y `git diff --staged` antes de confirmar | Revisión previa al commit | `git log`, PR | GC-03 |
| 25 (paso 5) | CI/CD ejecuta Build, Tests, Lint y Seguridad sobre el PR | Los cuatro checks en verde | PR → Checks | GC-09, 20, 21 |
| 25 (paso 9) | Despliegue y cierre: entorno de destino y rama eliminada | Rama eliminada tras fusionar; entorno de despliegue anotado cuando exista | GitHub, `docs/configuracion.md` | GC-23 |
| 30 | Condiciones de entrada por columna y bloqueo con causa y persona | Cada tarjeta cumple la condición de su columna | Jira | GC-15 |
| 37 | Hallazgo = archivo + línea + escenario + consecuencia; decisión trazable = motivo, cambio y evidencia | Cada propuesta de IA con su decisión, motivo y evidencia | PR | GC-17 |
| 40 | Roles: autor explica y verifica; revisor contrasta; equipo resuelve el impacto; integrador comprueba acuerdos | Cada rol cumplido y visible en el PR; entrega con versión, línea base y evidencia | PR | GC-24 |
| 42 | Revisión con una fortaleza y una mejora concreta | Informe con ambas | Informe | GC-25 |

### 11.2 REQ — Requisitos (107 páginas)

| Diap. | Qué pide el PDF | Qué debe llevar toda HU | Se comprueba en | ID |
|---|---|---|---|---|
| 3, 21 | Requisito funcional = qué hace; no funcional = bajo qué restricciones | Historias para lo funcional y RNF listados aparte | Jira + PR | REQ-07 |
| 8–9 | El PO colabora y explica; historia = tarjeta + conversación + confirmación (las 3 C) | Las tres partes presentes y enlazadas | Jira | REQ-01..03 |
| 10–11 | Confirmación = criterios o pruebas de aceptación | Criterios con casos concretos (válidos, límite, error) | Jira + `tests/` | REQ-03 |
| 12 | Taller inicial: qué hará y qué **no** hará el producto | Lista de exclusiones de la HU declarada | `HU0nn-VALIDACION.md` | REQ-10 |
| 13 | Formato «Como [usuario], quiero [acción] para [objetivo]» | Tarjeta con ese formato y actor acordado con el PO | Jira | REQ-01 |
| 14–19 | Historias por tipo de usuario | Actor real del sistema, no inventado | Jira | REQ-01 |
| 20 | INVEST: independiente, negociable, valiosa, estimable, pequeña, comprobable | Las seis propiedades revisadas; dependencias con *Blocks* | Jira | REQ-05 |
| 22 | El equipo define los RNF con el PO y los incluye en la DoD | RNF por ID, con métrica y cómo se comprobó | PR | REQ-07 |
| 23–24 | Ejemplos de criterios de terminado: pruebas, linter, revisión por otra persona | `npm test`, `lint`, revisión independiente registrados | PR | GC-07, GC-12 |
| 25, 33 | No confundir criterios de aceptación (propios de la historia) con DoD (del equipo) | La HU no redefine la DoD | PR | REQ-06 |
| 27–32 | Ejercicios: épicas divididas; criterios de aceptación observables (ej.: cerrar formulario) | HU pequeña; cada criterio observable con paso, dato y resultado | Jira | REQ-03, REQ-05 |
| 34–37 | *Dogfooding*: usar el propio producto | Uso real de la función en navegador antes de cerrar | `evidencias-hu0nn/` | REQ-04 |
| 38–42 | Escuchar al usuario es entender su problema, no copiar su solución | Necesidad y evidencia (entrevista u hipótesis) registradas; la solución se justifica | Jira / informe | REQ-12 |
| 43 | Evitar exceso de funcionalidades (80/20) | Cada función del diff responde a un criterio | Diff | REQ-10 |
| 44–48 | Caso de uso: actor, flujo normal y extensiones; no describe la interfaz | Para procesos de varios pasos o con errores: flujo normal y extensiones | `REQUISITOS_APLICADOS.md` | REQ-09 |
| 54–55 | Casos de uso útiles con pasos múltiples, reglas complejas o consecuencias graves | Se aplican a HU-009+010 y similares | idem | REQ-09 |
| 57–65 | Evitar desperdicio: MVP = menor conjunto de funciones que valida la hipótesis | Se declara si la HU es experimento o requisito conocido | Jira | REQ-05 |
| 74–76 | MVP es un experimento; puede omitir prácticas de ingeniería | En este proyecto **no**: la DoD aplica siempre; si se decide lo contrario, lo registra el PO | Jira | REQ-06 |
| 94 | MVP con IA: cuidar seguridad, privacidad y protección de datos | Sin datos personales ni credenciales en prompts o código | PR | REQ-08 |
| 95–103 | Pruebas A/B para experimentos | Solo si la HU declara una hipótesis comparativa: muestra, métrica y duración | Jira | ⚪ |
| 23–24, 33 | Criterios de terminado de ejemplo: cobertura de pruebas ≥ 80 %, linter, aprobación del diseñador UX del frontend, revisión por otro integrante | Cobertura medida (umbral por acordar con el PO) y aprobación de la interfaz cuando cambia el frontend | PR, informe de cobertura | REQ-13, 14 |
| 23 | Un RNF importante entra en la DoD: revisión de código centrada en él y pruebas con carga real | Por cada RNF declarado, la revisión y la prueba que lo comprueban | PR | REQ-15 |
| 27–28 | Una épica se divide en historias pequeñas | HU pequeña; si viene de una épica, la descomposición está en Jira | Jira | REQ-16 |
| 67–69 | Al final de un ciclo de MVP: nuevo ciclo, pivote, abandono o ajuste producto-mercado | Si la HU es experimento: hipótesis, métrica y decisión posterior | Jira | REQ-16 |

### 11.3 DIS — Diseño de software (150 páginas)

| Diap. | Qué pide el PDF | Qué debe llevar toda HU | Se comprueba en | ID |
|---|---|---|---|---|
| 10–11 | Arquitectura (bloques) frente a diseño detallado (clases y contratos) | `HU0nn-DISENO-Y-TRAZABILIDAD.md` con ambos niveles | `docs/` | DIS-16 |
| 13–16 | Abstracción: depender de un contrato, no de un proveedor | Servicios reciben dependencias por parámetro; sin `new` del proveedor dentro | `src/lib` | DIS-01 |
| 17–18 | Modularidad: de un bloque a varios módulos | Un módulo por propósito | `src/lib` | DIS-02 |
| 19 | Separación de responsabilidades: negocio, tecnología y comunicación cambian por razones distintas | Reglas, datos, correo y presentación en piezas distintas | `src/lib` | DIS-03 |
| 20–22 | Ocultamiento y encapsulación: el estado se cambia por operaciones que validan | Identidad y permisos de la sesión, nunca del cuerpo; reglas en funciones del dominio | `route.ts`, dominio | DIS-04 |
| 26–28, 32 | Alta cohesión: agrupar por propósito | Sin módulos «Utilidades» mezclados | Lectura del módulo | DIS-05 |
| 29–31 | Bajo acoplamiento: interfaz en lugar de clase concreta | Dependencias inyectadas; imports de infraestructura solo en repositorios y adaptadores | Imports | DIS-06 |
| 33 | *Code smells*: condicionales que crecen, cambio que toca muchos archivos, reglas repetidas | Revisión explícita de los tres indicios | Diff | DIS-11 |
| 39–49 | SRP: una razón coherente de cambio; no una clase por método | Servicio sin HTTP ni acceso directo a datos mezclado con reglas | `git grep NextResponse -- src/lib` | DIS-07 |
| 50–63 | OCP: extender sin tocar el núcleo; no crear interfaces sin variación real | Variantes por contrato solo si existen; si no, función simple | PR | DIS-08, DIS-12 |
| 64–79 | LSP: la sustitución respeta el contrato | Contratos según capacidades; sin herencia que obligue a operaciones imposibles | Interfaces | DIS-09 |
| 80–91 | ISP: interfaces pequeñas y coherentes; facilitan las pruebas | Clientes dependen solo de lo que usan | Interfaces | DIS-09 |
| 92–106 | DIP: la lógica depende de contratos; los proveedores se inyectan; simulables en pruebas | Dominio sin imports de infraestructura; pruebas con simulaciones | `src/lib/<dominio>.ts`, `tests/` | DIS-10, DIS-13 |
| 107–108 | Aplicar SOLID solo ante un problema real (responsabilidades distintas, cambios frecuentes, variantes, pruebas difíciles) | Justificación cuando se introduce una abstracción | PR | DIS-12 |
| 114 | El buen diseño es el que da software comprensible, verificable y mantenible | Cada abstracción aporta un beneficio nombrado | PR | DIS-12 |
| 116–125 | Strategy: variantes de un algoritmo | Solo si hay variantes reales | Código | DIS-08 |
| 126–132 | Adapter: traducir una API externa a la propia interfaz | Integraciones externas (correo, pagos) detrás de un adaptador | `src/lib` | DIS-01 |
| 133 | Strategy ≠ Adapter; no usarlos con un único cálculo simple o interfaces ya compatibles | No hay patrones sin problema | PR | DIS-12 |
| 134–139 | Un diseño sofisticado no siempre es mejor; evaluar claridad, impacto del cambio y pruebas | Responder: ¿se entiende?, ¿cuántos lugares edito para cambiar una regla?, ¿se prueba sin servicios externos? | PR | DIS-13 |
| 140 | Refactorizar = mejorar estructura conservando la conducta; pruebas antes y después | Commits `refactor` sin funcionalidad nueva; mismas pruebas antes y después | `git log` | DIS-02 |
| 146 | IA como revisora, no autoridad; verificar clases innecesarias, compilación y conducta; no subir credenciales ni datos personales | Registro en «Uso de IA» | PR | GC-17 |
| 148 | Tres ideas para el proyecto: responsabilidades claras, dependencias controladas, pruebas antes que adornos | Las tres, comprobadas en la HU | PR | DIS-03, DIS-06, DIS-13 |
| — | (Del proyecto, no del PDF) Integridad de datos y modelo único | `Restrict` frente a `Cascade` decidido; un solo modelo por concepto | `schema.prisma` | DIS-14, DIS-15 |
| 140 | Refactorizar: pruebas antes, cambios pequeños, mismas pruebas después | Evidencia de pruebas verdes antes y después del `refactor` | PR | DIS-18 |
| 147 | Observar → explicar → corregir → probar → comparar → decidir | El PR cuenta qué se observó, qué se corrigió, cómo se probó y qué mejoras se conservaron | PR | DIS-17 |

### 11.4 ARQ — Arquitectura (116 diapositivas)

| Diap. | Qué pide el PDF | Qué debe llevar toda HU | Se comprueba en | ID |
|---|---|---|---|---|
| 3–5 | Arquitectura = diseño a escala de módulos, capas y servicios; condiciona calidad y evolución | Decisión de estructura anotada en el documento de diseño | `docs/HU0nn-DISENO…` | ARQ-10 |
| 7–19 | El costo de una decisión puede tardar años; decidir con restricciones reales | Razón y costo futuro de cada decisión estructural | PR | ARQ-10 |
| 21–22 | Capas: la capa *n* solo usa la capa *n-1* | Ningún salto de capa en código nuevo | `git grep prisma -- src/app` | ARQ-01 |
| 27–28 | Tres capas: presentación, negocio, datos; el cliente no se salta el negocio | Vista → servicio → repositorio | `page.tsx` | ARQ-02 |
| 31–32 | BaaS: rápido, pero depende del proveedor y tiene costo variable | Dependencias de servicios gestionados (Atlas, correo) declaradas | `docs/configuracion.md` | ARQ-11 |
| 36–38 | MVC: vista presenta; controlador procesa eventos; modelo guarda datos y reglas | Cada archivo en su capa; el modelo no conoce la presentación | `src/` | ARQ-08 |
| 40 | Un modelo, varias vistas | El estado vive en el modelo | Componentes | ARQ-08 |
| 47–50 | MVC web: controlador intermediario; modelo = reglas + acceso a datos; monolito | `route.ts` delgado que delega | `route.ts` | ARQ-03 |
| 52–61 | Ejemplo: controlador llama al servicio; el servicio accede a datos; la vista arma la respuesta | Mismo recorrido en cada ruta de la HU | Rutas | ARQ-03, ARQ-04 |
| 62 | Reglas de negocio complejas viven en el modelo, en pasos ordenados | Reglas en el dominio, no en la ruta ni en el componente | Dominio | ARQ-05 |
| 66–71 | SPA: la interfaz gestiona estado local y pide datos al servidor | Componentes de cliente piden datos por API; sin reglas de negocio | `*.tsx` | ARQ-12 |
| 73–74 | Un monolito puede estar modularizado; un proceso, varios módulos | Módulos claros dentro del mismo proceso | `src/lib` | ARQ-09 |
| 75 | Riesgo de regresiones en un monolito | Pruebas automatizadas que protegen lo existente | `npm test` | GC-07 |
| 86, 89 | Microservicios: procesos aislados; la comunicación es explícita (HTTP, mensajes) | No se agregan servicios o procesos nuevos sin justificarlos | PR | ARQ-09 |
| 93 | La cantidad de servicios no equivale a calidad | Complejidad defendida por necesidad | PR | ARQ-09 |
| 98–103 | Punto único de fallo; escalado vertical y horizontal | Dependencia única (p. ej. una base de datos) reconocida como riesgo | `docs/` | ARQ-10 |
| 104–105 | Ventajas y desventajas de los microservicios | Decisión de no pasar a microservicios con sus razones | PR | ARQ-09 |
| 107 | Cada servicio controla su modelo de datos; no se comparten bases sin límites | Un módulo dueño por colección; sin segunda colección para lo mismo | `schema.prisma` | ARQ-06 |
| 108–110 | Recomendación: empezar con un monolito; migrar gradualmente (*Strangler Fig*) | El monolito modular es la base; migrar solo con motivo | PR | ARQ-09 |
| — | (Del proyecto) Sesión y permisos en rutas privadas | `permisos.ts` aplicado en cada `route.ts` privada | `route.ts` | ARQ-07 |
| 113–115 | Justificar la arquitectura elegida frente a otras en un caso concreto | Párrafo en el documento de diseño: por qué monolito modular y qué se descartó | `docs/HU0nn-DISENO…` | ARQ-13 |
| 105, 107 | Transacciones y consistencia entre servicios o colecciones | Si la HU escribe en varias colecciones: transacción o compensación explícita | Servicio + pruebas | ARQ-14 |
| 99 | Redundancia, recuperación y observabilidad | Registro de errores y recuperación anotados como riesgo o resueltos | `docs/`, código | ARQ-15 |

### 11.5 Cómo se usa esta matriz

1. Al **abrir una HU**, el autor revisa la sección 11.0: son los artefactos que debe llevar.
2. Al **escribir el informe**, la columna *Diap.* sale de aquí y se copia al «Punto (diap.)» de la plantilla de la sección 3.
3. Si un documento de clase cambia, se actualiza **primero** esta matriz y luego las listas 4 a 7.
4. Un punto de la matriz que ninguna HU ha podido cumplir se eleva al equipo: o se corrige el proceso o se retira la exigencia, con la razón en Jira.

### 11.6 Cambios incorporados el 18/11/2026

Tras comparar la guía con las láminas (incluidas las imágenes de GC 7–9, 17, 24–26, 30, 37 y 40 y de REQ 9 y 33) se agregaron:

- **CI completa (GC 25):** Build y Seguridad además de Tests y Lint (GC-20, GC-21); ausencia de CI como bloqueo (§8).
- **Control de cambios (GC 8–9):** evaluación de impacto y trazabilidad con prueba y versión (GC-22, GC-14).
- **Cierre y roles (GC 25, 40, 42):** despliegue y rama eliminada, roles del flujo, fortaleza y mejora (GC-23, GC-24, GC-25).
- **Requisitos (REQ 23, 24, 27–28, 33, 67–69):** cobertura, aprobación de la interfaz, RNF como criterio de terminado, épicas y experimentos (REQ-13 a REQ-16).
- **Diseño (DIS 140, 147):** proceso de diseño y refactor seguro (DIS-17, DIS-18).
- **Arquitectura (ARQ 99, 105, 107, 113–115):** justificación, consistencia entre colecciones y observabilidad (ARQ-13 a ARQ-15).

Pendiente de decisión del equipo y del PO: el umbral de cobertura (REQ-13) y la aprobación de interfaz (REQ-14) no están en `definition-of-done.md`; se revisan como criterios de la guía hasta que se acuerden.
