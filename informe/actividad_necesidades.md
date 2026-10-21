# Informe breve: identificación y validación de necesidades

**Proyecto:** CGB Academy · **Curso:** Ingeniería de Software I · **Corte:** 21/10/2026
**Estado de evidencia:** el equipo confirma que la captura de requerimientos y los conversatorios ya se realizaron con administración de ventas, TI y operaciones académicas; también se conversó con otros participantes. Las cuatro fotografías compartidas se incorporan como evidencia visual. Las imágenes no se asignan a un rol individual.

Base consultada: captura de requerimientos consolidada reportada por el equipo, especificación funcional y no funcional de CGB Academy, Jira CGB-51/CGB-56, `src/app/colaborador/page.tsx` y el manual local de seguimiento comercial por WhatsApp. Las imágenes están en `actividad-necesidades-latex/evidencias/`. El registro de fuentes y los límites de la evidencia están en [`registro_conversatorios.md`](registro_conversatorios.md).

## A. Stakeholders y persona

| Stakeholder | Expectativa documentada o por validar | Poder | Interés | Prioridad |
|---|---|---:|---:|---|
| Administración de ventas | Dar seguimiento a prospectos por estado y canal | Medio | Alto | Alta para consulta |
| Área de TI | Mantener acceso, credenciales, datos e infraestructura seguros | Alto | Alto | Alta |
| Operaciones académicas | Gestionar capacitaciones, rutas y seguimiento | Alto | Alto | Alta |
| Colaborador interno | Completar la inducción y saber qué sigue | Medio | Alto | Alta |
| Público (estudiantes/docentes) | Encontrar orientación pública sin iniciar sesión | Bajo | Alto | Media |

Se consulta de cerca a TI y operaciones académicas por su poder e interés altos, y a ventas y al colaborador por su interés alto y participación directa. El público se mantiene informado por su interés alto y poder bajo. Aunque ventas es stakeholder prioritario para consulta, la venta de cursos sigue excluida del producto; cualquier cambio requiere decisión del Product Owner. Los niveles son estimaciones del equipo a partir de los roles y la documentación, no respuestas atribuidas a participantes. El perfil de operaciones académicas corresponde a una persona real participante, según el equipo; sus objetivos se sintetizan desde la captura y la especificación, sin inferir atributos personales ni citas.

La matriz poder–interés es provisional: alto/alto se gestiona de cerca; bajo/alto se mantiene informado. Las fotos aportan evidencia contextual de las sesiones, no de las respuestas ni de la asignación de cada participante a una imagen.

**Elicitación y técnica complementaria:** el equipo confirma que la captura de requerimientos y los conversatorios se realizaron con administración de ventas, TI, operaciones académicas y otros participantes. Como técnica adicional se revisaron la especificación del producto y el manual comercial. Se incluyen cinco preguntas guía para operaciones académicas; la captura es la fuente de las necesidades sintetizadas y las preguntas no se presentan como respuestas textuales.

## B. Requisitos revisados

| Tipo y requisito inicial | Problema | Reformulación y verificación |
|---|---|---|
| **Funcional — RF-011:** panel con capacitaciones asignadas y porcentaje “en tiempo real”. | “Tiempo real” y los estados no están definidos. | Para N capacitaciones asignadas y M completadas, Mi Onboarding muestra la ruta ordenada, estado Pendiente/En progreso/Completada y `round(100×M/N)`; si N=0 muestra 0%. **Verificar:** pruebas con ruta vacía y con estados mixtos, comparando lista y porcentaje. |
| **No funcional — RNF-004:** carga inicial `<1,5 s` en 4G. | No fija pantalla, perfil de red ni método de medición. | En build de producción, el contenido principal de Mi Onboarding tendrá LCP p95 `<1,5 s` en 20 mediciones, con dispositivo, perfil 4G y conjunto de datos acordados. **Verificar:** registrar esos parámetros y las 20 medidas; el umbral debe confirmarlo el PO. |
| **Regla de negocio — CGB-56:** la capacitación pasa a Completada al finalizar. | No define si basta llegar al último slide ni cómo se desbloquea el siguiente módulo. | Se marca Completada solo tras recorrer la secuencia y confirmar Finalizar en el último slide; el módulo siguiente se habilita si sus prerrequisitos están completados. **Verificar:** BDD para avance parcial, confirmación final y desbloqueo. Pendiente de aprobar con el PO. |
| **Restricción — alcance MVP:** emisión de certificados excluida. | CGB-51 contenía una constancia descargable contradictoria con el alcance. | El MVP no genera insignias ni certificados; al completar se muestra únicamente el estado de la ruta. **Verificar:** revisar criterios Jira y que la interfaz no ofrezca descarga. |

## C. Backlog refinado y trazabilidad

- [**CGB-56 · HU-012: Completar capacitación y registrar avance**](https://cgb-academy.atlassian.net/browse/CGB-56), prioridad **Highest** (Crítica en la especificación). Como colaborador, quiero guardar y retomar el último slide confirmado, para continuar sin perder avance y reducir repetición de orientación (impacto esperado, no cuantificado). Criterios: guardar posición al navegar; reanudar en el último punto; completar tras confirmar todos los slides y pulsar Finalizar en el último; desbloquear el siguiente módulo al cumplir prerrequisitos; impedir acceso entre cuentas; repetir una confirmación no duplica avance. Tareas existentes: CGB-57 pruebas, CGB-58 endpoint/persistencia, CGB-59 idempotencia/UX, CGB-60 BDD y PR a `main`. Necesidad N2: retomar y confiar en el guardado; trazada a RF-012 de la captura.
- [**CGB-51 · HU-011: Consultar panel personal Mi Onboarding**](https://cgb-academy.atlassian.net/browse/CGB-51), prioridad **Highest** (Crítica en la especificación), depende del avance de CGB-56. Como colaborador autenticado, quiero ver mi ruta, estados y avance, para saber qué me falta y reducir consultas manuales (impacto esperado, no cuantificado). Criterios: mostrar ruta y estados; calcular porcentaje definido; continuar desde el punto guardado; aislar datos por cuenta y explicar el guardado; no ofrecer certificado fuera del MVP. Tareas existentes: CGB-52 pruebas, CGB-53 API autenticada, CGB-54 panel accesible, CGB-55 BDD y PR a `main`. Necesidad N1: conocer lo asignado y el siguiente paso; trazada a RF-011 de la captura.

**Nota Jira (revisado el 21/10):** CGB-51 y CGB-56 siguen en Sprint 2, estado “Tareas por hacer”, prioridad Highest y etiqueta `evidence-pending`. La captura y los conversatorios se realizaron; queda vincular en cada historia el hallazgo concreto que la respalda. No se cambiaron estado, sprint, prioridad ni responsables. CGB no ofrece el tipo `Historia`; se conservan como `Tarea` con formato de historia de usuario.

## Reflexión y pendientes

Pasamos por alto dos cuestiones: el colaborador necesita confiar en el guardado y la privacidad del avance, y ventas ya sigue prospectos con un proceso separado por WhatsApp. La segunda necesidad no debe incorporarse al MVP sin decisión del Product Owner, porque ventas está fuera del alcance aprobado. El siguiente paso es completar en Jira la trazabilidad explícita a RF-011/RF-012 y validar con el Product Owner los criterios que aún dependen de una decisión de producto. También falta confirmar el umbral de rendimiento y aprobar la regla de visibilidad.

## Evidencia fotográfica

Las cuatro imágenes se incluyen en el proyecto LaTeX como evidencia visual de los conversatorios. Se presentan sin nombres ni asignación de una fotografía a una persona o rol específico.

![Registro fotográfico 1](actividad-necesidades-latex/evidencias/conversatorio-01.jpeg)
![Registro fotográfico 2](actividad-necesidades-latex/evidencias/conversatorio-02.jpeg)
![Registro fotográfico 3](actividad-necesidades-latex/evidencias/conversatorio-03.jpeg)
![Registro fotográfico 4](actividad-necesidades-latex/evidencias/conversatorio-04.jpeg)
