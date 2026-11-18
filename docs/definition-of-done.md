# Definition of Done (DoD)

Criterios internos del equipo para pasar una historia a «Hecho». Son distintos de los criterios de aceptación, que son propios de cada historia (`Diapos/4. Requisitos.pdf`, pp. 24–25; `Diapos/3.Gestion_de_configuracion.md`, p. 32).

> Propuesta basada en las diapositivas 3 y 4. Falta validarla con el equipo y contrastarla con la DoD de Jira.

1. Las pruebas pertinentes pasan: `npm test`, `npx tsc --noEmit` y `npx eslint src tests` sin errores.
2. Otra persona del equipo revisó el código en un Pull Request y resolvió sus comentarios.
3. Los criterios de aceptación de la historia tienen una prueba que los demuestra.
4. La documentación está actualizada (`docs/HUxxx-VALIDACION.md`).
5. Issue (Jira), commits, Pull Request y pruebas están enlazados.
6. Se integró en la rama acordada.
7. Requisitos no funcionales aplicables: la interfaz informa del estado (guardando, error, reintento); las rutas autentican por sesión y validan el origen; los datos de una cuenta no se muestran a otra.
