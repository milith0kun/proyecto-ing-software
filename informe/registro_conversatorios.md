# Registro de conversatorios y análisis documental

**Proyecto:** CGB Academy · **Corte:** 21/10/2026
**Propósito:** registrar qué se puede sustentar por rol con los archivos disponibles y separar esos datos de las respuestas de los participantes.

## Evidencia disponible

El equipo confirma que la captura de requerimientos y los conversatorios ya se realizaron con administración de ventas, TI y operaciones académicas; también se conversó con otros participantes. Las cuatro fotografías compartidas se incluyen en `actividad-necesidades-latex/evidencias/` como evidencia visual contextual. No se asigna una imagen a un rol o persona específica ni se infieren características personales a partir de las fotos.

La captura de requerimientos consolidada y la especificación `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` documentan funciones, restricciones y actores del producto. El informe sintetiza las necesidades por área desde esa captura y la documentación disponible, sin atribuir citas textuales a una foto. El archivo local `Manual_Seguimiento_Comercial_WhatsApp.xlsx` tiene hojas para prospectos calientes, tibios y fríos y describe seguimiento por WhatsApp. Ese manual apoya el análisis del trabajo comercial, pero no se copia al repositorio porque es material interno.

## Síntesis por rol: captura de requerimientos y evidencia documental

| Rol entrevistado (según el equipo) | Lo que documentan las fuentes | Necesidad candidata | Relación con el producto |
|---|---|---|---|
| Administración de ventas | El manual organiza prospectos por estado y pauta el seguimiento mediante WhatsApp. | Tener visibilidad del estado del prospecto y de la siguiente acción de seguimiento. Es una inferencia del proceso documentado, no una respuesta textual. | La especificación de CGB Academy excluye venta de cursos, carrito y pagos. Registrar como necesidad fuera del MVP hasta que el Product Owner decida si corresponde a este producto u otro sistema. |
| Área de TI | La especificación incluye acceso por roles, protección de credenciales, control de sesión, integridad de datos y operación en una VPS de recursos limitados. | Poder operar una plataforma segura dentro de la infraestructura acordada y conocer las reglas de acceso y mantenimiento. La prioridad se estima por responsabilidad técnica; debe confirmarse con TI. | Alineada con requisitos no funcionales y restricciones existentes. No se atribuye al participante ninguna decisión técnica concreta. |
| Operaciones académicas | La especificación permite crear y publicar capacitaciones, organizar slides y rutas por área o puesto, asignar onboarding y consultar avance. | Gestionar contenidos y rutas y saber qué colaboradores completaron el material asignado. Es una necesidad candidata derivada del alcance, pendiente de contrastar con las respuestas del conversatorio. | Alineada con HU-002/HU-003 y HU-007–HU-015. Puede ayudar a validar CGB-51/CGB-56, aunque esas historias representan directamente al colaborador. |

## Persona anonimizada

**Tipo de usuario:** participante real de operaciones académicas, identificado por el rol que indicó el equipo.
**Objetivo documentado:** gestionar capacitaciones, rutas y seguimiento de onboarding, según la captura y la documentación del proyecto.
**Frustraciones, contexto, dispositivo y frase textual:** solo se incorporan si constan en la captura; no se inventan ni se derivan de las fotografías.
**Datos personales:** no se registran nombres, edades, ciudades ni datos de contacto. Las fotos se presentan aparte, sin asignarlas a esta persona ni a otro rol.

Este registro conserva el carácter real de los conversatorios y de la captura reportados por el equipo. El arquetipo mantiene anonimizado al participante y diferencia los datos de la captura de las inferencias del equipo.

## Preguntas de seguimiento para operaciones académicas

Estas cinco preguntas forman el guion de entrevista para operaciones académicas. La captura de requerimientos es la fuente para registrar las necesidades levantadas; las preguntas se mantienen como guía y no se presentan como citas.

1. Cuéntame el proceso más reciente para crear y asignar una capacitación. ¿Qué pasos seguiste?
2. ¿Cómo decides qué ruta corresponde a cada área o puesto y en qué orden se presenta?
3. ¿Qué parte del proceso requiere más trabajo manual o se resuelve fuera del sistema?
4. ¿Cómo verificas que un colaborador completó la versión correcta del contenido?
5. ¿Quién debe consultar el avance y qué información debería mantenerse privada?

## Decisiones para cerrar la evidencia

- Enlazar en el informe y en Jira el apartado de la captura que respalda cada necesidad, sin nombres ni datos de contacto.
- Mantener las fotografías con rótulos neutrales: respaldan el contexto de las sesiones y no identifican a cada participante ni su área.
- Conservar `evidence-pending` en CGB-51/CGB-56 hasta que la captura se vincule explícitamente con N1/N2; después, revisar criterios y prioridad con el Product Owner.
- Solicitar una decisión del Product Owner antes de incluir seguimiento de ventas en el MVP, porque contradice las exclusiones de alcance actuales.
