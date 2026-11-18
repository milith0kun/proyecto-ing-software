# Definition of Done — CGB Academy

Una historia o tarea puede pasar a **Hecho** cuando cumple los seis puntos. Los criterios de aceptación de cada historia siguen siendo específicos; esta lista común no los reemplaza.

1. **Aceptación comprobada:** cada criterio de aceptación se verificó en el escenario descrito. El PR o Jira indica evidencia reproducible; si un criterio falla, la historia no está terminada.
2. **Calidad técnica comprobada:** para cambios de comportamiento se ejecutaron las pruebas pertinentes y `npm test`; se ejecutó `npm run lint`. Compilación se ejecutó cuando el cambio afecta build/configuración/rutas/dependencias. Cada resultado se registra con comando y resultado; si un comando no pudo ejecutarse, la causa y el riesgo quedan visibles y el equipo decide antes de aceptar.
3. **Revisión por otra persona:** al menos un compañero aprobó el PR; no hay comentarios pendientes ni conflictos sin resolver. El autor no se aprueba a sí mismo.
4. **Cambio completo y seguro:** documentación y configuración se actualizaron cuando corresponde; no se incluyeron secretos, artefactos generados ni archivos ajenos; se evaluaron privacidad, seguridad, accesibilidad e impacto AG-C01 cuando aplican.
5. **Integrado y trazable:** el PR fue integrado en `main`; Jira enlaza necesidad, issue, PR y commit; prioridad/estado reflejan la aceptación y se identifica responsable o versión cuando corresponde.
6. **Requisitos no funcionales comprobados:** los RNF que la historia declara (RNF-001 a RNF-010 de `informe/informe.md` §5.3; matriz en [`REQUISITOS_APLICADOS.md`](REQUISITOS_APLICADOS.md)) se verificaron con su métrica o por inspección y el resultado queda en el PR. Por ejemplo: las rutas privadas exigen sesión y origen válido, una cuenta no ve datos de otra, y la interfaz informa el estado (guardando, error, reintento). Un RNF que no se pudo comprobar se declara como pendiente, no como cumplido.

## Evidencia mínima en Jira y Pull Request

- Clave y enlace de Jira.
- Criterios de aceptación verificados y resultado.
- RNF aplicables y cómo se comprobó cada uno.
- Comandos ejecutados y su resultado real.
- Aprobación de una persona revisora y resolución de comentarios.
- Enlaces a PR y commit integrado.
- Riesgos, excepciones o decisiones pendientes, si existen.

## Excepciones

Una tarea documental no requiere pruebas de comportamiento que no aplican, pero sí revisión del contenido, enlaces y consistencia con el repositorio. Una comprobación que no pueda ejecutarse no se reporta como aprobada: se documenta y se resuelve antes de declarar la historia terminada, salvo decisión explícita del Product Owner y del responsable técnico registrada en Jira.
