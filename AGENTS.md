<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Flujo de desarrollo requerido para todo agente

Antes de cambiar código, documentación o configuración, lee [`docs/FLUJO_DE_TRABAJO.md`](docs/FLUJO_DE_TRABAJO.md). `main` es la única rama de integración; usa una rama corta por tarea Jira y un Pull Request revisado hacia `main`. No conviertas ramas de integrantes o `desarrollo` en ramas permanentes.

Antes de editar archivos, inspecciona `git status` y los diffs. Conserva cambios locales y archivos sin seguimiento que no pertenecen a la tarea. Agrega rutas explícitas; no ejecutes comandos de limpieza, borrado o sobrescritura para despejar el árbol sin autorización explícita. `npm` y `package-lock.json` son los gestores versionados del repo; no adoptes o borres archivos de otro gestor sin decisión del equipo.

Para cerrar una historia, aplica [`docs/definition-of-done.md`](docs/definition-of-done.md); para cambios de dependencias, configuración, entregas o alcance, consulta [`docs/configuracion.md`](docs/configuracion.md). No informes pruebas, aceptación, entrevistas o revisiones que no ocurrieron.

Para tareas de stakeholders, necesidades de usuarios, requisitos, criterios de aceptación, backlog Jira o la actividad de Ingeniería de Software I, lee y sigue [`skills/cgb-academy-requirements/SKILL.md`](skills/cgb-academy-requirements/SKILL.md). Para trabajo general de repositorio, usa también [`skills/cgb-academy-development-workflow/SKILL.md`](skills/cgb-academy-development-workflow/SKILL.md). El análisis de requisitos es fechado: vuelve a comprobar Jira antes de describir su estado actual.
