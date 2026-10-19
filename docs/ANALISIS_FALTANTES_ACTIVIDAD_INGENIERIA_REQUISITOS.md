# Estado de la actividad: necesidades y requisitos de CGB Academy

- **Revisión documental:** 19 de octubre de 2026
- **Proyecto revisado:** CGB Academy
- **Propósito:** comparar el repositorio y Jira con la actividad de Ingeniería de Software I. Este documento es un análisis de trabajo; no es el informe final de dos páginas.

**Proceso reutilizable para asistentes:** [`skills/cgb-academy-requirements/SKILL.md`](../skills/cgb-academy-requirements/SKILL.md).

## Estado general

El proyecto ya tiene una especificación amplia, historias de usuario con criterios BDD y un backlog en Jira. La actividad aún no está completa porque no encontramos evidencia de entrevistas u otra elicitación realizada, persona validada, matriz poder–interés, tabla de cuatro requisitos revisados ni un informe final que enlace las dos historias refinadas. Las historias existentes tienen criterios y tareas técnicas, pero no indican qué necesidad real de stakeholder sustenta el cambio.

El repositorio incluye estas bases:

- `informe/informe.md` presenta seis stakeholders con roles, influencia y expectativas; define 15 historias MVP y 10 RNF.
- `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` contiene historias y criterios BDD y declara exclusiones de alcance.
- `Diapos/3.Gestion_de_configuracion.md` resume el flujo de issue, rama, Pull Request, revisión, pruebas, trazabilidad y Definition of Done.
- El árbol del repositorio contiene código de autenticación, gestión y visualización de capacitaciones, slides, catálogo público y previsualización. En el esquema actual aparecen `User`, `Sesion`, `Capacitacion` y `Slide`; no se observan modelos o rutas de Área/Puesto, rutas de onboarding, progreso, microtests ni reportes.

## Comparación con lo solicitado

| Entregable | Estado encontrado | Qué falta |
|---|---|---|
| Al menos cuatro stakeholders | **Parcial.** El informe enumera seis: colaborador, administrador, público, directorio, desarrollo y docente. | Separar poder e interés en la matriz, asignar prioridad y justificarla. Validar las estimaciones con stakeholders; hoy son información documental. |
| Persona arquetipo | **No encontrada** en el informe ni en la documentación revisada. | Entrevistar a un usuario prioritario y completar la plantilla con metas, contexto, frustraciones y una cita real anonimizada. Hasta entonces, cualquier persona será hipótesis. |
| Cinco preguntas y técnica adicional | **No documentadas como elicitación realizada.** El equipo indicó que puede entrevistar usuarios, pero todavía no hay respuestas registradas. | Ejecutar una entrevista y una observación, encuesta, taller o análisis documental; registrar fecha, rol, hallazgos y evidencia sin datos personales innecesarios. |
| Cuatro requisitos revisados | **Parcial.** Existen RF y RNF, pero no la matriz de requisito inicial, problema, reformulación y verificación; no se encontraron los cuatro tipos revisados como pide la actividad. | Revisar al menos uno funcional, uno no funcional, una regla de negocio y una restricción. Comprobar ambigüedad, consistencia, factibilidad y prueba. |
| Validación de dos historias | **Parcial.** Jira ya tiene historias con criterios BDD y tareas técnicas. | Revisar criterios por claridad, consistencia y verificabilidad; enlazar cada cambio con una necesidad evidenciada o marcarla como hipótesis. |
| Dos historias refinadas en Jira | **Parcial.** CGB-51 y CGB-56 tienen prioridad Medium, cuatro criterios, subtareas TDD y DoD; ambas pertenecen al Sprint 2 futuro. | Actualizar tras elicitar: justificar prioridad, ajustar criterios, incluir la necesidad del stakeholder y evidencia/hipótesis, y comprobar el impacto AG-C01 cuando aplique. No se modificó Jira durante esta revisión. |
| Impacto y compromisos AG-C01 | **Parcial o ausente en las historias examinadas.** El informe menciona beneficios organizacionales, pero no están trazados a las historias ni expresados como criterios verificables. | Vincular un impacto social/económico real a la historia pertinente y acordar criterios comprobables de privacidad, acceso, equidad u otro compromiso aplicable. |
| Informe final de máximo dos páginas | **No encontrado** para esta actividad. | Preparar el informe breve con enlace al backlog actualizado y la reflexión final, después de reunir evidencia. Este análisis es más extenso y no reemplaza ese producto. |

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
- CGB-51 (HU-011) y CGB-56 (HU-012) están en el Sprint 2 futuro, ambas con prioridad Medium. Sus descripciones ya tienen criterios BDD, tareas TDD y DoD. **CGB-51 CA-04 propone una insignia y descarga de constancia**, mientras el documento de requisitos excluye los certificados del alcance inicial. Este conflicto debe resolverse con el Product Owner antes de tratarlo como requisito aceptado.
- En las historias examinadas, Jira usa prioridad Medium aunque la especificación del proyecto asigna prioridades diferenciadas a varias historias. Revisar que la prioridad de Jira coincida con la priorización acordada.
- Hay inconsistencia en las referencias de ramas: README e informe mencionan `main`, `edmil-saire`, `desarrollo`/`develop` de formas distintas. En el remoto, el HEAD apunta a `edmil-saire`; `main` y `desarrollo` están actualmente en el mismo commit. El equipo debe confirmar su política de integración. Para esta publicación el usuario pidió `main`.

Enlaces de Jira revisados:

- [CGB-51 — HU-011: panel personal Mi Onboarding](https://cgb-academy.atlassian.net/browse/CGB-51)
- [CGB-56 — HU-012: completar capacitación y registrar avance](https://cgb-academy.atlassian.net/browse/CGB-56)
- [CGB-16 — HU-004: previsualizar y publicar](https://cgb-academy.atlassian.net/browse/CGB-16)
- [CGB-26 — HU-006: consultar capacitación pública](https://cgb-academy.atlassian.net/browse/CGB-26)

## Orden recomendado para completar la actividad

1. Realizar la entrevista al colaborador y la observación; guardar notas anonimizadas y distinguir hechos de hipótesis.
2. Validar la matriz poder–interés y completar el arquetipo persona con evidencia real.
3. Acordar y probar la tabla de cuatro requisitos; resolver la contradicción del alcance de certificados en CGB-51.
4. Elegir dos historias —CGB-51 y CGB-56 son candidatas— y refinar prioridad, criterios, tareas técnicas y traza de necesidad después de la entrevista.
5. Verificar el impacto AG-C01 aplicable y formular compromisos como criterios observables.
6. Actualizar las historias de Jira con autorización de edición y leerlas de nuevo para verificar los cambios.
7. Redactar el informe final de máximo dos páginas con enlace a Jira y responder: qué necesidad se pasó por alto y cómo cambia el próximo sprint.

**Estado de esta revisión:** Jira se consultó en modo lectura; no se editaron historias ni sprints. No se realizaron entrevistas ni pruebas de aceptación nuevas. La actividad y el informe final siguen pendientes de evidencia de usuarios y aprobación del equipo.
