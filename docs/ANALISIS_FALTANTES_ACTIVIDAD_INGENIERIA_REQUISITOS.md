# Estado de la actividad: necesidades y requisitos de CGB Academy

- **Revisión documental:** 19 de octubre de 2026
- **Proyecto revisado:** CGB Academy
- **Propósito:** comparar el repositorio y Jira con la actividad de Ingeniería de Software I. Este documento es un análisis de trabajo; no es el informe final de dos páginas.

**Proceso reutilizable para asistentes:** [`skills/cgb-academy-requirements/SKILL.md`](../skills/cgb-academy-requirements/SKILL.md).

## Actualización de evidencia — 21 de octubre de 2026

El equipo aclara que la captura de requerimientos y los conversatorios ya se realizaron con administración de ventas, TI y operaciones académicas; también se conversó con otros participantes. Las cuatro fotos compartidas se incorporaron al proyecto LaTeX como evidencia visual contextual, sin asignar cada imagen a un rol individual. Se revisaron la especificación funcional/no funcional y un manual comercial local de seguimiento por WhatsApp. El análisis por rol, sus fuentes y sus límites están en [`informe/registro_conversatorios.md`](../informe/registro_conversatorios.md). El manual comercial no se incorporó al repositorio.

El informe breve y su PDF fueron actualizados para reflejar que la captura y los conversatorios se realizaron, incluir las cuatro fotografías y señalar que la venta de cursos está fuera del alcance aprobado. Jira se reconsultó y se actualizaron las secciones de evidencia de CGB-51 y CGB-56 el 21/10. Ambos siguen en Sprint 2, Tareas por hacer, prioridad Highest y `evidence-pending`; no cambiaron estado, sprint, prioridad ni responsables. Falta citar en Jira el hallazgo específico de la captura que respalda N1 y N2.

## Estado general al corte del 19/10/2026

El repositorio ya contiene un informe provisional de dos páginas, matriz preliminar, persona hipotética, cinco preguntas, observación propuesta y cuatro requisitos revisados. CGB-51 y CGB-56 fueron refinadas en Jira y enlazadas textualmente a necesidades N1/N2, con criterios verificables, prioridad, tareas técnicas y criterios AG-C01. La actividad sigue pendiente de validación con usuarios: no se han realizado entrevistas ni observaciones, por lo que el informe identifica los hallazgos como hipótesis pendientes.

El repositorio incluye estas bases:

- `informe/informe.md` presenta seis stakeholders con roles, influencia y expectativas; define 15 historias MVP y 10 RNF.
- `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` contiene historias y criterios BDD y declara exclusiones de alcance.
- `Diapos/3.Gestion_de_configuracion.md` resume el flujo de issue, rama, Pull Request, revisión, pruebas, trazabilidad y Definition of Done.
- El árbol del repositorio contiene código de autenticación, gestión y visualización de capacitaciones, slides, catálogo público y previsualización. En el esquema actual aparecen `User`, `Sesion`, `Capacitacion` y `Slide`; no se observan modelos o rutas de Área/Puesto, rutas de onboarding, progreso, microtests ni reportes.

## Comparación con lo solicitado

| Entregable | Estado encontrado | Qué falta |
|---|---|---|
| Al menos cuatro stakeholders | **Preparada de forma preliminar.** La matriz incluye cuatro grupos y separa poder, interés y prioridad a partir de fuentes documentales. | Confirmar expectativas y priorización con el equipo/usuarios. |
| Persona arquetipo | **Hipótesis documentada**, sin nombre ni cita inventada. | Completar metas, frustraciones y contexto con evidencia de entrevista. |
| Cinco preguntas y técnica adicional | **Preparadas.** El informe incluye cinco preguntas y observación guiada. | Realizar la entrevista y observación; guardar notas anonimizadas y fecha. |
| Cuatro requisitos revisados | **Incluidos** en el informe: funcional, no funcional, regla de negocio propuesta y restricción de alcance. | Validar la regla con el PO y confirmar el umbral de rendimiento. |
| Validación de dos historias | **Criterios verificables propuestos** y vinculados a N1/N2; evidencia de necesidad aún hipotética. | Contrastar criterios con el colaborador entrevistado y el PO. |
| Dos historias refinadas en Jira | **Actualizadas el 19/10/2026:** CGB-51 y CGB-56 tienen prioridad Highest (Crítica en la especificación), criterios, subtareas técnicas y etiqueta `evidence-pending`. Se conservaron estados, sprint y responsables. | Confirmar prioridad con el PO tras la entrevista y actualizar el estado de evidencia cuando se realice la elicitación. |
| Impacto y compromisos AG-C01 | **Añadidos** como impacto social/económico esperado y criterios de privacidad/transparencia; los beneficios son hipótesis. | Validar el impacto con usuarios; no afirmar reducción de costos sin medición. |
| Informe de máximo dos páginas | **Preparado** en Markdown, LaTeX y PDF de dos páginas con enlaces a CGB-51 y CGB-56. | Completar la validación con usuarios antes de presentarlo como evidencia confirmada. |

## Stakeholders que ya figuran en el informe

La tabla siguiente es una priorización **preliminar inferida de los roles y expectativas documentados**. No es resultado de entrevistas y debe validarse con el equipo.

| Stakeholder | Expectativa documentada | Poder preliminar | Interés preliminar | Prioridad propuesta |
|---|---|---:|---:|---|
| Colaborador CGB | Entender sus tareas y completar inducción sin fricciones | Medio | Alto | Alta |
| Administrador | Cargar slides, estructurar rutas y consultar avance | Alto | Alto | Alta |
| Estudiante/docente público | Encontrar orientación abierta sin registro | Bajo/medio | Alto | Alta |
| Directorio CGB Academy | Estandarizar procesos, reducir costos y cumplir plazos | Alto | Alto | Alta |
| Equipo de desarrollo | Mantener código y cumplir acuerdos del sprint | Medio | Alto | Media |
| Docente evaluador UNSAAC | Revisar rigor, trazabilidad y producto funcional | Alto para la nota | Alto académico | Alta para la entrega |

Para el flujo de onboarding, se propone entrevistar primero a un **colaborador interno**. Su expectativa aparece en la especificación y CGB-51/CGB-56 describen su panel y progreso. El equipo debe confirmar que es un usuario disponible y prioritario.

## Guion listo para entrevista y observación

Estas preguntas son propuestas; todavía no hay respuestas ni hallazgos.

1. Cuéntame la última vez que tuviste que completar una capacitación o inducción. ¿Qué pasos seguiste?
2. ¿Cómo sabes qué capacitaciones te corresponden y cuál debes completar primero?
3. ¿Qué suele interrumpirte durante una capacitación y qué haces para retomarla?
4. ¿Qué señal necesitas para confiar en que tu avance quedó guardado correctamente?
5. ¿Qué información sobre tu avance debería ver el administrador y qué debería mantenerse privada?

**Técnica adicional propuesta — observación:** pedir al colaborador que encuentre una capacitación asignada, avance algunas diapositivas y explique cómo la retomaría después de una interrupción. Registrar pasos, dudas, errores y resultado con su consentimiento; no sugerir respuestas. Anonimizar las notas.

## Requisitos candidatos para la matriz de revisión

Los siguientes ejemplos parten de requisitos ya documentados. Deben confirmarse con el equipo y los usuarios antes de considerarlos aprobados.

| Requisito inicial y tipo | Problema a revisar | Reformulación propuesta | Verificación propuesta |
|---|---|---|---|
| **RF-006 / funcional:** visor secuencial de slides con navegación por teclado y táctil, progreso y botón de finalización. | No define el comportamiento en los límites ni qué debe mostrar el indicador. | En una capacitación accesible con N slides, cada acción Siguiente/Anterior o flecha de teclado cambia al slide adyacente y actualiza el indicador `n de N`; en el primero y último no se sale de la secuencia. | Pruebas de navegación para el primer, intermedio y último slide; comprobar indicador y límites. |
| **RNF-004 / no funcional:** carga inicial menor a 1,5 s en conexión 4G. | No especifica página, dispositivo, perfil de red, volumen de datos ni estadística de medición. | En una compilación de producción, el catálogo inicial con 10 capacitaciones públicas debe alcanzar LCP p95 < 1,5 s, en un dispositivo y perfil 4G definidos por el equipo, sobre 20 mediciones. | Prueba de rendimiento documentando dispositivo, perfil 4G, dataset, 20 medidas y percentil 95. Confirmar que el umbral original sigue siendo aceptable. |
| **Regla de negocio propuesta:** visibilidad pública/interna, derivada de RF-005 y HU-004. | La regla aparece distribuida entre historias; debe confirmarse la política de acceso exacta para capacitación interna. | El catálogo público solo presenta capacitaciones `PUBLICADA` y `PUBLICO`. Una capacitación `INTERNO` no se entrega a un visitante anónimo, incluso si conoce su URL. | Pruebas de API y navegación directa para capacitación pública publicada, interna publicada, borrador e inexistente; verificar respuesta y ausencia de datos internos. |
| **Restricción propuesta:** infraestructura objetivo de 2 vCPU y 8 GB RAM, documentada en RNF-003. | Falta definir entorno, configuración y carga mínima para demostrar operación dentro de la restricción. | La versión de entrega debe desplegarse en una VPS de hasta 2 vCPU y 8 GiB RAM, usando únicamente las dependencias y servicios aprobados para el MVP. | Despliegue de la versión etiquetada en el entorno acordado y registro de configuración, recursos y resultado de operación. |

## Hallazgos concretos en Jira y alcance

Se revisó el proyecto **CGB — Cgb Academy**, con 77 issues, y su `CGB board` (id 4). También existe otro proyecto llamado **KAN — cgb-academy**, con dos issues; conviene confirmar con el equipo si es una prueba antigua o un segundo backlog.

- El Sprint 1 figura `active`, aunque sus fechas registradas fueron del 1 al 15 de octubre de 2026. Al 19 de octubre, Jira muestra 8 issues: 4 finalizadas, 2 en revisión y 2 tareas sin asignar. CGB-16 (HU-004) y CGB-26 (HU-006) aparecen vencidas y en revisión; CGB-76 y CGB-77 están sin responsable.
- CGB-51 (HU-011) y CGB-56 (HU-012) siguen en Sprint 2 y en estado Por hacer. Se actualizaron con prioridad Highest, necesidades N1/N2, criterios de aceptación, tareas técnicas existentes y compromisos AG-C01. Se retiró de CGB-51 la constancia/insignia, fuera del MVP, y se reemplazó la referencia de integración `desarrollo` por `main`. Las dos historias llevan `evidence-pending` hasta realizar entrevistas/observación.
- En la revisión inicial, CGB-51 y CGB-56 tenían prioridad Medium pese a que la especificación asigna Crítica a HU-011 y HU-012. Se actualizaron a Highest; la prioridad se debe reconfirmar con el PO después de entrevistar al usuario.
- En la revisión del 19 de octubre se encontró que el README usaba `edmil-saire` y `desarrollo` como ramas permanentes, mientras el usuario pidió publicar en `main`; GitHub tenía entonces `edmil-saire` como rama predeterminada. El proceso actualizado y el estado de ramas se registran en [`docs/FLUJO_DE_TRABAJO.md`](FLUJO_DE_TRABAJO.md) y [`docs/ESTADO_RAMAS.md`](ESTADO_RAMAS.md). Esta observación es histórica; consultar las referencias actuales antes de afirmar el estado remoto.

Enlaces de Jira revisados:

- [CGB-51 — HU-011: panel personal Mi Onboarding](https://cgb-academy.atlassian.net/browse/CGB-51)
- [CGB-56 — HU-012: completar capacitación y registrar avance](https://cgb-academy.atlassian.net/browse/CGB-56)
- [CGB-16 — HU-004: previsualizar y publicar](https://cgb-academy.atlassian.net/browse/CGB-16)
- [CGB-26 — HU-006: consultar capacitación pública](https://cgb-academy.atlassian.net/browse/CGB-26)

## Pendientes al corte del 19/10/2026

1. Realizar la entrevista al colaborador y la observación; guardar fecha y notas anonimizadas.
2. Reemplazar hipótesis por hallazgos confirmados; ajustar persona, matriz, prioridades y criterios si hace falta.
3. Confirmar con el PO la regla de visibilidad y el umbral RNF-004.
4. Actualizar CGB-51/CGB-56 con resultados reales y quitar `evidence-pending` solo cuando exista evidencia.
5. Adjuntar evidencia de las entrevistas y pruebas futuras; mantener la reflexión sobre el siguiente sprint.

**Estado al corte del 19/10/2026:** CGB-51/CGB-56 ya fueron editadas y verificadas de vuelta en Jira; no se cambiaron estado, sprint ni responsables. El informe PDF tenía dos páginas. A esa fecha no se habían realizado entrevistas ni pruebas de aceptación; la actualización del 21/10 se registra al inicio de este documento.
