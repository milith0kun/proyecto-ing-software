# Flujo de trabajo de CGB Academy

**Estado:** estándar del repositorio. Revisar este documento antes de iniciar una tarea.
**Responsable de mantenerlo:** equipo de desarrollo; los cambios de alcance los valida el Product Owner.

## 1. Herramientas y fuentes oficiales

- **Jira, proyecto CGB:** historias, prioridad, responsables, sprint, criterios de aceptación, bloqueos y decisión de producto.
- **GitHub, repositorio `proyecto-ing-software`:** código, documentación, Pull Requests, revisiones y commits.
- **`main`:** única rama permanente de integración y rama de referencia para nuevas tareas.
- **`README.md`:** punto de entrada; esta guía contiene el proceso detallado.
- **npm:** administrador de paquetes del repositorio. `package.json` y `package-lock.json` son la definición versionada. No introducir un segundo lockfile sin una decisión del equipo.

No se mantienen ramas permanentes `develop`, `desarrollo` o ramas con nombres de integrantes. Las ramas existentes con esos nombres son legado: conservarlas hasta comprobar su historia y cualquier trabajo pendiente.

## 2. Método de trabajo: Scrum y Kanban

El equipo planifica el trabajo por sprint y visualiza el flujo en Jira. La historia pasa por estos estados, aunque Jira puede mostrar nombres equivalentes:

| Estado | Para pasar a este estado |
|---|---|
| Backlog | La necesidad está registrada, pero falta priorización o preparación. |
| Por hacer | La historia cumple la Definition of Ready y fue seleccionada para el sprint. |
| En desarrollo | Una persona tomó la historia y trabaja en su rama de Jira. |
| En revisión | Hay un Pull Request abierto hacia `main`; se revisan diff, pruebas y criterios. |
| Hecho | El PR se integró en `main`, cumple la Definition of Done y Jira conserva la evidencia. |

Límites WIP actuales: **máximo 3 historias en desarrollo y 2 en revisión**. Si revisión llega a 2/2, se detiene la toma de trabajo nuevo y el equipo ayuda a resolver revisiones. Una persona mantiene como máximo una historia activa. Un bloqueo permanece visible en Jira con causa, responsable de resolverlo y siguiente acción.

El ciclo Scrum incluye refinamiento, planificación, sincronización diaria, revisión y retrospectiva. En las historias con cambios de comportamiento se aplica TDD cuando sea viable: prueba que falla, implementación mínima, refactorización y verificación de criterios BDD. No se crean subtareas TDD vacías para tareas solo documentales.

### Definition of Ready para iniciar una historia

Antes de mover una historia a **Por hacer**, Jira debe incluir:

1. La necesidad y el tipo de evidencia: entrevista, observación, documento o hipótesis pendiente.
2. Una historia con usuario, acción y propósito, o una descripción clara del defecto/tarea técnica.
3. Criterios de aceptación observables, con condiciones y resultado esperado.
4. Prioridad acordada, responsable o equipo, dependencias y alcance del sprint.
5. Riesgos de privacidad, seguridad, accesibilidad e impacto AG-C01 cuando correspondan.

Si falta una decisión de usuario o producto, se mantiene en el backlog y se registra la pregunta pendiente; no se inventa una respuesta para iniciar desarrollo.

## 3. Ramas y actualización del trabajo

### Estrategia

`main` contiene la integración revisada. Cada tarea se trabaja en una rama corta creada desde la versión actual de `origin/main`, con una sola historia o cambio acotado. Las ramas personales permanentes y `develop`/`desarrollo` no se usan para trabajo nuevo.

Formato: `<tipo>/<clave-jira>-<resumen-corto>`.

| Tipo | Uso | Ejemplo |
|---|---|---|
| `feature` | Funcionalidad | `feature/CGB-51-mi-onboarding` |
| `fix` | Corrección | `fix/CGB-16-publicar-capacitacion` |
| `docs` | Documentación | `docs/CGB-123-flujo-git` |
| `chore` | Mantenimiento técnico | `chore/CGB-124-actualizar-dependencias` |
| `hotfix` | Incidente urgente en una entrega | `hotfix/CGB-130-error-acceso` |

El identificador debe existir en Jira. No inventar claves. Si una tarea no tiene issue, crear o pedir que se registre antes de abrir el PR. Usar un slug corto, minúsculo y sin nombres de integrantes.

### Antes de empezar

Inspeccionar siempre el estado local antes de cambiar de rama o actualizar archivos:

```bash
git status --short --branch
git diff
git diff --cached
```

Si hay archivos modificados o sin seguimiento que no pertenecen a la tarea, conservarlos. No ejecutar `git clean`, `git reset --hard`, `git checkout -- .`, `git restore .` ni borrar ramas para “limpiar” el repositorio sin autorización explícita y revisión de su contenido. No usar `git stash` como rutina para ocultar cambios cuyo origen no se conoce.

Para empezar una historia nueva:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/CGB-123-resumen-corto
```

Reemplazar tipo, clave y resumen por los de Jira. En una rama propia ya iniciada, actualizar antes del PR con `git fetch origin` y `git rebase origin/main`. No reescribir una rama compartida o que otra persona ya esté usando; no resolver conflictos eligiendo un lado sin entender ambas intenciones.

### Limpieza segura de archivos

- Agregar solo archivos de la tarea: `git add ruta/al/archivo` o `git add -p`.
- No usar `git add .` ni `git add -A` sin revisar cada archivo con `git status` y `git diff`.
- Antes del commit, inspeccionar `git diff --cached` y `git diff --check`.
- Nunca subir `.env`, credenciales, tokens, bases de datos locales, `node_modules/`, `.next/`, `dist/`, `build/` ni archivos de caché. Los secretos se configuran localmente o en el almacén seguro del entorno; `.env.example` solo contiene nombres y valores ficticios.
- `package-lock.json` es el lockfile del proyecto. No borrar ni adoptar archivos `pnpm` u otros archivos sin seguimiento sin confirmar su origen con quien los creó.
- GitHub elimina la rama remota del PR después de fusionar. Para retirar la rama local: cambiar a `main`, actualizarlo y confirmar en GitHub que el PR está fusionado. Probar `git branch -d <rama>`; si Squash and merge impide reconocerla como ancestro, no forzar el borrado hasta verificar que no tenga commits locales únicos y que su responsable ya no necesite el trabajo. Las ramas antiguas del equipo se revisan una por una; no se borran en bloque.

## 4. Commits

Usar Conventional Commits, en minúsculas, con un solo propósito por commit:

```text
<tipo>(<ámbito>): <descripción breve> (CGB-123)
```

Tipos permitidos: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `perf`, `chore`, `build`, `ci`, `revert`.

Ejemplos:

```text
feat(onboarding): guardar el avance de la capacitación (CGB-56)
fix(catalogo): ocultar cursos internos a visitantes (CGB-26)
test(auth): cubrir el cierre de sesión (CGB-6)
docs(workflow): definir ramas y revisión (CGB-123)
```

La descripción dice qué intención cumple el cambio; evitar `cambios`, `avance`, `final`, `arreglos` o mensajes que no expliquen el resultado. No mezclar refactorizaciones ajenas con una historia. Un commit debe corresponder al diff que presenta.

## 5. Verificación antes del Pull Request

Para cambios de comportamiento, ejecutar las pruebas relacionadas y las comprobaciones disponibles:

```bash
npm test
npm run lint
```

Ejecutar `npm run build` cuando el cambio afecte compilación, configuración, rutas o dependencias y el entorno local lo permita. No afirmar que una comprobación pasó si no se ejecutó; registrar el comando, resultado o motivo por el que no pudo correr. No usar credenciales de producción para pruebas o compilación.

Antes de publicar la rama, revisar:

```bash
git status --short --branch
git diff --check
git diff --cached
```

Hacer push solo de la rama de la tarea y abrir el PR hacia `main`. El PR debe vincular la historia Jira y explicar el problema, la solución, las decisiones de alcance y cómo se verificó. Usar `.github/PULL_REQUEST_TEMPLATE.md`.

## 6. Pull Request y revisión

1. El autor abre un PR hacia `main`, enlaza la historia Jira y completa la plantilla.
2. Otra persona revisa el diff, criterios de aceptación, pruebas, datos/seguridad, documentación e impacto en interfaces dependientes.
3. La persona revisora deja comentarios concretos con archivo, escenario y consecuencia. El autor responde y actualiza la rama; no se marca como resuelto un comentario sin atenderlo.
4. Una persona distinta del autor aprueba cuando las observaciones están resueltas y hay evidencia suficiente.
5. Se integra mediante **Squash and merge** para dejar un commit claro por historia en `main`. No se hace merge directo desde una cuenta local ni se fuerza el push a `main`.
6. El issue de Jira pasa a **Hecho** solo después de cumplir `docs/definition-of-done.md`; se enlazan PR y commit y se registra cualquier evidencia de aceptación.

La configuración de GitHub usa `main` como rama predeterminada, requiere un PR y una aprobación, impide force-push y eliminación de `main`, permite **Squash and merge** y elimina automáticamente la rama de una tarea después de fusionar. No hay workflows de CI todavía; los checks manuales se registran en el PR y los checks obligatorios se añaden cuando exista automatización configurada.

## 7. Cambios, trazabilidad y versiones aprobadas

Todo cambio sigue esta cadena:

```text
necesidad/evidencia → issue Jira → evaluación de impacto → aprobación de alcance
→ rama → commits → PR y pruebas → revisión → integración en main → aceptación/versión
```

Los cambios que afecten alcance, privacidad, reglas de negocio, datos, APIs, pruebas o despliegue registran su impacto en Jira o en el PR. El Product Owner decide cambios de alcance; la revisión técnica no sustituye esa decisión. Registrar también por qué se rechaza o pospone una propuesta.

Una integración en `main` no crea por sí sola una línea base de entrega. Una línea base requiere el commit identificado, instrucciones para reconstruirla, dependencias bloqueadas, resultados de verificación, alcance y aprobación; consultar `docs/configuracion.md`. Crear un tag o release solo para una versión que el equipo haya aceptado presentar o desplegar.

## 8. Uso de asistentes de IA

Los asistentes leen `AGENTS.md` y esta guía antes de cambiar el repositorio; para requisitos y Jira aplican además `skills/cgb-academy-requirements/SKILL.md`. Pueden explicar, proponer y resumir, pero no inventan evidencia de usuarios, resultados de prueba, revisiones ni aprobaciones. Antes de entregar un cambio, el agente informa los archivos modificados, comandos ejecutados y comprobaciones pendientes. Conserva los cambios ajenos y nunca elimina archivos o ramas para limpiar sin autorización explícita.
