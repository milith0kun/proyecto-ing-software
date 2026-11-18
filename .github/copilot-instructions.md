# Instrucciones para GitHub Copilot

Antes de editar este repositorio, sigue [`AGENTS.md`](../AGENTS.md), [`skills/cgb-academy-development-workflow/SKILL.md`](../skills/cgb-academy-development-workflow/SKILL.md) y [`docs/FLUJO_DE_TRABAJO.md`](../docs/FLUJO_DE_TRABAJO.md). Trabaja desde una rama corta ligada a Jira y abre un PR hacia `main`; revisa el estado local y conserva archivos ajenos o no seguidos. Agrega rutas específicas, no uses `git add .`, y no ejecutes borrados/restauraciones masivas para limpiar.

Aplica [`docs/definition-of-done.md`](../docs/definition-of-done.md) al declarar trabajo terminado y [`docs/configuracion.md`](../docs/configuracion.md) para líneas base o cambios de configuración. Usa npm con `package-lock.json` como fuente versionada; no crees o borres lockfiles de otros gestores sin decisión del equipo.

Para stakeholders, necesidades, requisitos, criterios de aceptación, backlog Jira y la actividad de Ingeniería de Software I, sigue [`skills/cgb-academy-requirements/SKILL.md`](../skills/cgb-academy-requirements/SKILL.md) y consulta el análisis fechado solo como antecedente. Verifica Jira antes de reportar su estado actual. No inventes evidencia de usuarios ni resultados de pruebas.

Antes de cambiar código de Next.js, conserva la regla de [`AGENTS.md`](../AGENTS.md): leer la documentación de Next.js instalada en `node_modules/next/dist/docs/` y atender sus avisos de deprecación.
