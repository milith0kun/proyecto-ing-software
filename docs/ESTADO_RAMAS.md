# Estado de ramas y configuración de GitHub

**Revisión:** 19 de octubre de 2026.
**Rama permanente:** `main`.
**Proceso vigente:** [`FLUJO_DE_TRABAJO.md`](FLUJO_DE_TRABAJO.md).

## Configuración aplicada

- `main` es la rama predeterminada de GitHub y la referencia `origin/HEAD` apunta a `origin/main`.
- `main` requiere Pull Request y una aprobación de otra persona; la aprobación anterior se invalida si el autor vuelve a subir cambios y la última actualización debe tener aprobación independiente.
- Las conversaciones del Pull Request deben estar resueltas. Force-push y eliminación de `main` están bloqueados; la regla también aplica a administradores.
- GitHub permite **Squash and merge**, desactiva merge commits y rebase merge, y elimina la rama del PR al fusionarlo.
- No hay checks automáticos de CI ni tags/releases publicados. Por ello, no se exige un check de estado inexistente; cada PR registra los comandos ejecutados y sus resultados.
- No había Pull Requests abiertos cuando se aplicó esta configuración.

## Ramas remotas conservadas

Los SHA son una fotografía de las referencias consultadas en la revisión; antes de limpiar una rama hay que volver a consultar GitHub y buscar PRs asociados.

| Referencia remota | SHA observado | Acción |
|---|---|---|
| `origin/main` | `7669c32` antes de integrar esta actualización | Mantener como rama única de integración. |
| `origin/alex-carpio` | `04642c3` | Conservar hasta comprobar commits únicos y consultar a su responsable. |
| `origin/domingo-quispe` | `0d893df` | Conservar hasta comprobar commits únicos y consultar a su responsable. |
| `origin/hector-barazorda` | `6719ed8` | Conservar hasta comprobar commits únicos y consultar a su responsable. |
| `origin/ronaldo-ticona` | `a3c38c1` | Conservar; fue actualizada en GitHub mientras se alineaba el flujo. Revisar su PR/commits antes de archivar. |

## Ramas antiguas retiradas

Se retiraron las referencias remotas y locales `desarrollo` y `edmil-saire` después de verificar que sus commits eran antecesores de `main` y que no había PRs abiertos. La historia continúa en Git; no se borraron commits de `main`. Las ramas personales restantes no se borran en bloque.

## Procedimiento de limpieza para ramas futuras

1. Revisar en GitHub el estado del PR y los commits de la rama.
2. Confirmar que todo el trabajo está en `main` y que no existen commits locales/remotos únicos.
3. Confirmar con la persona responsable si conserva cambios locales no publicados.
4. Dejar que GitHub elimine la rama remota al fusionar el PR. Eliminar una rama local de manera normal; si Squash and merge impide comprobar ancestralidad, no forzar el borrado hasta repetir las verificaciones anteriores.

Los lockfiles locales `pnpm` vistos durante la revisión no se agregaron ni eliminaron; `package-lock.json` y npm siguen siendo el estándar del proyecto.
