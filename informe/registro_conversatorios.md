# Registro de conversatorios y análisis documental

**Proyecto:** CGB Academy · **Corte:** 21/10/2026
**Propósito:** registrar qué se puede sustentar por rol con los archivos disponibles y separar esos datos de las respuestas de los participantes.

## Evidencia disponible

El equipo confirma que la captura de requerimientos y los conversatorios ya se realizaron con administración de ventas, TI y operaciones académicas; también se conversó con otros participantes. Las cuatro fotografías compartidas se incluyen en `actividad-necesidades-latex/evidencias/` como evidencia visual contextual. No se asigna una imagen a un rol o persona específica ni se infieren características personales a partir de las fotos.

La captura consolidada es la fuente del levantamiento reportada por el equipo. La especificación [`CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf`](../CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf) documenta funciones, restricciones y actores del producto. El sistema tiene dos recorridos: formación privada de colaboradores (rutas por área/puesto, avance y microtests) y orientación pública para estudiantes/docentes (guías para usar plataformas y resolver casos de CIIP LATAM, GEOMINA LATAM y BIOMEDIC, sin cuenta). Administración de contenidos publica y mantiene ambos tipos. El informe separa estas audiencias de las áreas entrevistadas. El manual local de seguimiento comercial por WhatsApp aporta contexto de ventas, pero esa gestión no es una función del producto y el archivo no se copia al repositorio por ser material interno.

## Áreas entrevistadas y actores del sistema

| Área/actor | Relación con el producto | Necesidad sintetizada desde la captura y el alcance | Trazabilidad |
|---|---|---|---|
| Administración de ventas (área entrevistada) | Stakeholder que aporta procesos, plataformas y casos del área; no implica que el sistema sea una herramienta de ventas. | Identificar qué procesos, plataformas y casos deben convertirse en material de capacitación para empleados y público. No se propone seguimiento de prospectos. | Guías públicas e internas de CGB Academy; el comercio, pagos y gestión de leads están fuera del alcance. |
| TI (área entrevistada) | Stakeholder técnico de los límites público/privado, identidad, seguridad e infraestructura. | Mantener disponibles las guías públicas y proteger datos/rutas privadas del colaborador. | RF-001, RNF-003, RNF-005–RNF-007. |
| Operaciones académicas (área entrevistada) | Corresponde al actor Administrador/gestor de contenidos del modelo del sistema, sujeto al permiso que defina el PO. | Organizar, publicar y actualizar guías de plataformas/casos y gestionar rutas internas por área/puesto y su avance. | HU-002–HU-004, HU-007–HU-008, HU-015. |
| Colaborador/empleado (actor interno) | Usuario autenticado que recibe capacitación asignada. | Completar el onboarding de su puesto, ver qué sigue y retomar el último avance. | HU-009–HU-014, RF-009–RF-014; Jira CGB-51/CGB-56. |
| Estudiante/docente (actor público) | Visitante que consulta orientación sin autenticación. | Encontrar y seguir una guía práctica para usar plataformas o resolver casos de las unidades de la empresa. | HU-005/HU-006, RF-005/RF-006; Jira CGB-21/CGB-26. |

## Persona anonimizada

**Tipo de usuario:** participante real del área de operaciones académicas, según el equipo.
**Arquetipo funcional:** Administrador/gestor de contenidos; la asociación al rol y sus permisos debe corresponder al modelo aprobado por el PO.
**Objetivo sintetizado desde la captura y el alcance:** organizar rutas internas por área/puesto y publicar guías para que estudiantes/docentes usen plataformas y resuelvan casos de CIIP LATAM, GEOMINA LATAM y BIOMEDIC.
**Necesidad:** que cada audiencia encuentre su material; mantener privado el avance del personal.
**Frustraciones, contexto, dispositivo y frase textual:** no constan en el material revisado; no se infieren de las fotos ni se inventan.
**Datos personales:** no se registran nombres, edades, ciudades ni datos de contacto. Las fotos se presentan aparte, sin asignarlas a esta persona ni a otro rol.

Este registro conserva el carácter real de los conversatorios y de la captura reportados por el equipo. El arquetipo mantiene anonimizado al participante y diferencia los datos de la captura de las inferencias del equipo.

## Cinco preguntas para operaciones académicas

La elicitación ya se realizó, según el equipo; este guion organiza las preguntas de la actividad y no presenta respuestas inventadas.

1. ¿Qué plataformas y casos de uso deben poder resolver los estudiantes y docentes con las guías públicas?
2. ¿Qué pasos, ejemplos y enlaces necesita una persona para completar esos casos por su cuenta?
3. ¿Qué capacitación debe recibir un colaborador según su área o puesto?
4. ¿Cómo se preparan, revisan, publican y actualizan los materiales públicos e internos?
5. ¿Quién debe consultar el avance de empleados y qué datos deben mantenerse privados?

## Decisiones para cerrar la evidencia

- Mantener dos trazas distintas: necesidad pública de estudiantes/docentes a RF-005/RF-006 y necesidad interna de colaboradores a RF-011/RF-012, en el informe y Jira.
- Mantener las fotografías con rótulos neutrales: respaldan el contexto de las sesiones y no identifican a cada participante ni su área.
- No confundir a las áreas entrevistadas con permisos del sistema: ventas/TI/operaciones son stakeholders; Administrador, Colaborador y Público son actores funcionales.
- Mantener el seguimiento de prospectos y venta de cursos fuera del MVP; si la captura propone incorporarlos, pedir decisión de alcance al Product Owner.
