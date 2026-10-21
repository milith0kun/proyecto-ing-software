# Registro de conversatorios y análisis documental

**Proyecto:** CGB Academy · **Corte:** 21/10/2026
**Propósito:** registrar qué se puede sustentar por rol con los archivos disponibles y separar esos datos de las respuestas de los participantes.

## Evidencia disponible

El equipo confirma que la captura de requerimientos y los conversatorios ya se realizaron con administración de ventas, TI y operaciones académicas; también se conversó con otros participantes. Las cuatro fotografías compartidas se incluyen en `actividad-necesidades-latex/evidencias/` como evidencia visual contextual. No se asigna una imagen a un rol o persona específica ni se infieren características personales a partir de las fotos.

La captura consolidada es la fuente del levantamiento reportada por el equipo. La especificación `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` documenta funciones, restricciones y actores del producto. El informe sintetiza las necesidades por área desde la captura y la documentación disponible, sin atribuir citas textuales a una foto. El archivo local `Manual_Seguimiento_Comercial_WhatsApp.xlsx` tiene hojas para prospectos calientes, tibios y fríos y describe seguimiento por WhatsApp. Ese manual apoya el análisis del trabajo comercial, pero no se copia al repositorio porque es material interno.

## Síntesis por rol: captura de requerimientos y evidencia documental

| Rol entrevistado (según el equipo) | Lo que documentan las fuentes | Necesidad sintetizada | Relación con el producto |
|---|---|---|---|
| Administración de ventas | El manual organiza prospectos por estado y pauta el seguimiento mediante WhatsApp. | Tener visibilidad del estado del prospecto y de la siguiente acción de seguimiento. Es una síntesis del proceso documentado; no se presenta como cita textual. | La especificación de CGB Academy excluye venta de cursos, carrito y pagos. Mantener esta necesidad fuera del MVP hasta que el Product Owner decida si corresponde a este producto u otro sistema. |
| Área de TI | La captura y la especificación documentan acceso por roles, protección de credenciales, control de sesión, integridad de datos y operación en una VPS de recursos limitados. | Operar una plataforma segura dentro de la infraestructura acordada y conocer las reglas de acceso y mantenimiento. La prioridad en la matriz es una estimación del equipo, no una cita atribuida al participante. | Alineada con requisitos no funcionales y restricciones existentes. No se atribuye al participante ninguna decisión técnica concreta. |
| Operaciones académicas | La captura y la especificación describen creación y publicación de capacitaciones, organización de slides y rutas por área o puesto, asignación de onboarding y consulta del avance. | Gestionar contenidos y rutas y saber qué colaboradores completaron el material asignado. El conversatorio se realizó, según el equipo; aquí se sintetiza la necesidad sin inventar una cita. | Alineada con HU-002/HU-003 y HU-007–HU-015. Puede ayudar a validar CGB-51/CGB-56, aunque esas historias representan directamente al colaborador. |

## Persona anonimizada

**Tipo de usuario:** participante real de operaciones académicas, identificado por el rol que indicó el equipo.
**Objetivo documentado:** gestionar capacitaciones, rutas y seguimiento de onboarding, según la captura y la documentación del proyecto.
**Frustraciones, contexto, dispositivo y frase textual:** no se infieren de las fotografías ni se inventan; solo se incorporan cuando estén registradas en la captura compartida por el equipo.
**Datos personales:** no se registran nombres, edades, ciudades ni datos de contacto. Las fotos se presentan aparte, sin asignarlas a esta persona ni a otro rol.

Este registro conserva el carácter real de los conversatorios y de la captura reportados por el equipo. El arquetipo mantiene anonimizado al participante y diferencia los datos de la captura de las inferencias del equipo.

## Preguntas de seguimiento para operaciones académicas

Estas cinco preguntas documentan el guion preparado para operaciones académicas. La captura de requerimientos es la fuente para sintetizar las necesidades levantadas; las preguntas no se presentan como respuestas ni como citas.

1. Cuéntame el proceso más reciente para crear y asignar una capacitación. ¿Qué pasos seguiste?
2. ¿Cómo decides qué ruta corresponde a cada área o puesto y en qué orden se presenta?
3. ¿Qué parte del proceso requiere más trabajo manual o se resuelve fuera del sistema?
4. ¿Cómo verificas que un colaborador completó la versión correcta del contenido?
5. ¿Quién debe consultar el avance y qué información debería mantenerse privada?

## Decisiones para cerrar la evidencia

- Mantener la trazabilidad de las necesidades N1/N2 con RF-011/RF-012 de la captura en el informe y Jira, sin nombres ni datos de contacto.
- Mantener las fotografías con rótulos neutrales: respaldan el contexto de las sesiones y no identifican a cada participante ni su área.
- Conservar `evidence-pending` en CGB-51/CGB-56 hasta que las referencias RF-011/RF-012 queden enlazadas explícitamente en cada historia; después, revisar criterios y prioridad con el Product Owner.
- Solicitar una decisión del Product Owner antes de incluir seguimiento de ventas en el MVP, porque contradice las exclusiones de alcance actuales.
