# Registro de conversatorios y análisis documental

**Proyecto:** CGB Academy · **Corte:** 21/10/2026
**Propósito:** registrar qué se puede sustentar por rol con los archivos disponibles y separar esos datos de las respuestas de los participantes.

## Evidencia disponible

El equipo informa que realizó conversatorios con una persona de administración de ventas, una de TI y una de operaciones académicas. Las cuatro fotografías recibidas están fechadas en sus nombres el 21/10/2026 y muestran personas trabajando en estaciones de cómputo. Sirven como evidencia visual contextual de las sesiones; no contienen respuestas, no permiten asignar cada rostro a un rol y no se usan para inferir características personales.

La especificación `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` documenta funciones, restricciones y actores del producto. No atribuye cada requisito a una de las tres personas entrevistadas. El archivo local `Manual_Seguimiento_Comercial_WhatsApp.xlsx` tiene hojas para prospectos calientes, tibios y fríos y describe seguimiento por WhatsApp. Ese manual apoya el análisis del trabajo comercial, pero no es una transcripción de la conversación ni se copia al repositorio porque es material interno y su difusión no está confirmada.

## Síntesis por rol: evidencia documental, no citas de entrevista

| Rol entrevistado (según el equipo) | Lo que documentan las fuentes | Necesidad candidata | Relación con el producto |
|---|---|---|---|
| Administración de ventas | El manual organiza prospectos por estado y pauta el seguimiento mediante WhatsApp. | Tener visibilidad del estado del prospecto y de la siguiente acción de seguimiento. Es una inferencia del proceso documentado, no una respuesta textual. | La especificación de CGB Academy excluye venta de cursos, carrito y pagos. Registrar como necesidad fuera del MVP hasta que el Product Owner decida si corresponde a este producto u otro sistema. |
| Área de TI | La especificación incluye acceso por roles, protección de credenciales, control de sesión, integridad de datos y operación en una VPS de recursos limitados. | Poder operar una plataforma segura dentro de la infraestructura acordada y conocer las reglas de acceso y mantenimiento. La prioridad se estima por responsabilidad técnica; debe confirmarse con TI. | Alineada con requisitos no funcionales y restricciones existentes. No se atribuye al participante ninguna decisión técnica concreta. |
| Operaciones académicas | La especificación permite crear y publicar capacitaciones, organizar slides y rutas por área o puesto, asignar onboarding y consultar avance. | Gestionar contenidos y rutas y saber qué colaboradores completaron el material asignado. Es una necesidad candidata derivada del alcance, pendiente de contrastar con las respuestas del conversatorio. | Alineada con HU-002/HU-003 y HU-007–HU-015. Puede ayudar a validar CGB-51/CGB-56, aunque esas historias representan directamente al colaborador. |

## Persona anonimizada

**Tipo de usuario:** participante real de operaciones académicas, identificado por el rol que indicó el equipo.
**Objetivo documentado:** gestionar capacitaciones, rutas y seguimiento de onboarding.
**Frustraciones, contexto, dispositivo y frase textual:** no constan en las fuentes disponibles; no se completan con supuestos.
**Datos personales:** nombre, edad, ciudad, rostro y otros identificadores omitidos.

Este registro conserva el carácter real del conversatorio informado por el equipo. La descripción del objetivo proviene de la especificación del producto; no se presenta como una respuesta literal del participante.

## Preguntas de seguimiento para operaciones académicas

Estas preguntas sirven para completar la trazabilidad de la conversación y validar la necesidad. No se afirma que hayan sido formuladas durante el conversatorio ya realizado.

1. Cuéntame el proceso más reciente para crear y asignar una capacitación. ¿Qué pasos seguiste?
2. ¿Cómo decides qué ruta corresponde a cada área o puesto y en qué orden se presenta?
3. ¿Qué parte del proceso requiere más trabajo manual o se resuelve fuera del sistema?
4. ¿Cómo verificas que un colaborador completó la versión correcta del contenido?
5. ¿Quién debe consultar el avance y qué información debería mantenerse privada?

## Decisiones para cerrar la evidencia

- Registrar por separado las respuestas o notas ya recogidas en cada conversatorio, sin nombres ni datos de contacto.
- Mantener las fotografías fuera del repositorio público; si el equipo desea compartir una, confirmar consentimiento y anonimizarla primero.
- No cambiar CGB-51/CGB-56 solo por esta síntesis documental. Vincular cada cambio a la necesidad que el participante confirmó y actualizar Jira después de verificar las respuestas.
- Solicitar una decisión del Product Owner antes de incluir seguimiento de ventas en el MVP, porque contradice las exclusiones de alcance actuales.
