# Gestión de configuración y control de cambios — CGB Academy

**Propósito:** que el equipo pueda identificar qué versión revisó, reconstruirla y explicar quién aprobó cada cambio.
**Estado inicial:** inventario propuesto para el equipo; una etiqueta Git o un merge no constituyen por sí solos una línea base aprobada.

## Inventario de elementos de configuración

| Elemento | Ubicación canónica | Versión / forma de identificarlo | Responsable de actualización |
|---|---|---|---|
| Código y rutas de la aplicación | `src/`, `prisma/` | Commit de Git en `main` | Persona responsable de la historia; revisor técnico valida el diff |
| Dependencias JavaScript | `package.json`, `package-lock.json` | Versión del manifiesto y lockfile; instalación con `npm ci` | Persona responsable de cambios de dependencias; aprobación técnica en PR |
| Variables de entorno | `.env.example`, `.gitignore` y almacén seguro de cada entorno | Nombres/documentación versionados; valores reales fuera de Git | Responsable técnico del entorno |
| Requisitos y alcance | `informe/informe.md`, `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf`, Jira CGB | Revisión del documento, clave de Jira y commit | Product Owner valida alcance; autor mantiene enlaces |
| Pruebas | `tests/`, scripts de `package.json` | Commit; comando y resultado en PR | Autor de la historia y persona revisora |
| Proceso e instrucciones para agentes | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `skills/`, `docs/` | Commit de Git | Equipo de desarrollo; cambios de política revisados por el equipo |
| Entrega aprobada | Tag/release de GitHub, cuando exista una entrega | Tag ligado a un SHA, notas, checks y aprobación | Responsable de release y Product Owner |

`package-lock.json` es el lockfile versionado y npm es el gestor acordado. No agregar archivos `.env`, tokens, claves ni datos personales reales. `.env.example` debe usar valores ficticios y explicar solo los nombres requeridos.

En la revisión del 19 de octubre de 2026 no se encontraron tags ni releases publicados y el repositorio no contiene workflows de GitHub Actions. Hasta que CI esté configurada, cada PR conserva los comandos y resultados ejecutados manualmente; no se anuncian checks automáticos ni una línea base de release inexistente.

## Aprobación de una línea base

Para declarar una demostración o entrega como línea base, registrar:

1. Identificador de versión o tag y SHA completo de `main`.
2. Alcance incluido y exclusiones conocidas.
3. `package.json` y `package-lock.json` de ese commit, más los pasos de instalación y ejecución.
4. Entorno necesario sin copiar secretos; responsable de facilitar cada variable segura.
5. Comandos de prueba/build ejecutados, fecha, resultado y enlaces de evidencia.
6. Aprobación de alcance del Product Owner y conformidad técnica de la persona integradora/revisora, con fecha.

El equipo crea el tag y las notas de release después de aceptar esos datos. No retaggear ni mover un tag de versión publicado; una corrección genera otra versión identificable. Si aún no hay aprobación, se escribe **“pendiente de aprobación como línea base”**.

## Control de cambios

Cada cambio se registra en una historia/tarea de Jira y sigue esta secuencia:

1. **Proponer:** registrar problema o necesidad, evidencia o hipótesis, prioridad y resultado esperado.
2. **Evaluar impacto:** revisar comportamiento, criterios, interfaces/API, datos, pruebas, documentación, privacidad/seguridad, accesibilidad, alcance, coste y fecha.
3. **Decidir:** Product Owner acepta el cambio de producto o lo rechaza/pospone con razón; responsable técnico define la implementación. No se reemplaza una decisión de producto con una decisión de código.
4. **Aplicar y verificar:** rama con clave Jira, commits claros, pruebas y PR revisado.
5. **Integrar y conservar evidencia:** integrar en `main`; enlazar issue/PR/commit y actualizar documentos, versión o línea base si aplica.

Los cambios urgentes siguen un `hotfix/<CGB-ID>-<resumen>` y requieren el mismo registro, revisión independiente y comprobación. La urgencia no justifica credenciales en Git, force-push ni pérdida de trazabilidad.

## Reconstrucción de una versión

Desde un clon limpio, revisar el SHA/tag solicitado y seguir el README del proyecto. Instalar dependencias con `npm ci`, configurar variables desde `.env.example` con valores propios del entorno y ejecutar los comandos de verificación indicados en la entrega. La URL de base de datos y cualquier secreto se obtienen del almacén seguro; nunca de un issue, commit o documento público.
