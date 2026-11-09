# Definition of Done — CGB Academy

Una historia o tarea puede pasar a **Hecho** cuando cumple los cinco puntos. Los criterios de aceptación de cada historia siguen siendo específicos; esta lista común no los reemplaza.

1. **Aceptación comprobada:** cada criterio de aceptación se verificó en el escenario descrito. El PR o Jira indica evidencia reproducible; si un criterio falla, la historia no está terminada.
2. **Calidad técnica comprobada:** para cambios de comportamiento se ejecutaron las pruebas pertinentes y `npm test`; se ejecutó `npm run lint`. Compilación se ejecutó cuando el cambio afecta build/configuración/rutas/dependencias. Cada resultado se registra con comando y resultado; si un comando no pudo ejecutarse, la causa y el riesgo quedan visibles y el equipo decide antes de aceptar.
3. **Revisión por otra persona:** al menos un compañero aprobó el PR; no hay comentarios pendientes ni conflictos sin resolver. El autor no se aprueba a sí mismo.
4. **Cambio completo y seguro:** documentación y configuración se actualizaron cuando corresponde; no se incluyeron secretos, artefactos generados ni archivos ajenos; se evaluaron privacidad, seguridad, accesibilidad e impacto AG-C01 cuando aplican.
5. **Integrado y trazable:** el PR fue integrado en `main`; Jira enlaza necesidad, issue, PR y commit; prioridad/estado reflejan la aceptación y se identifica responsable o versión cuando corresponde.

## Evidencia mínima en Jira y Pull Request

- Clave y enlace de Jira.
- Criterios de aceptación verificados y resultado.
- Comandos ejecutados y su resultado real.
- Aprobación de una persona revisora y resolución de comentarios.
- Enlaces a PR y commit integrado.
- Riesgos, excepciones o decisiones pendientes, si existen.

## Excepciones

Una tarea documental no requiere pruebas de comportamiento que no aplican, pero sí revisión del contenido, enlaces y consistencia con el repositorio. Una comprobación que no pueda ejecutarse no se reporta como aprobada: se documenta y se resuelve antes de declarar la historia terminada, salvo decisión explícita del Product Owner y del responsable técnico registrada en Jira.
