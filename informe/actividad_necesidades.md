# Informe breve: identificación y validación de necesidades

**Proyecto:** CGB Academy · **Curso:** Ingeniería de Software I · **Corte:** 19/10/2026
**Estado de evidencia:** revisión documental completa; entrevista y observación preparadas, aún pendientes. Las necesidades y la persona se presentan como hipótesis, no como hallazgos de usuarios.

Base consultada: RF-011/RF-012, CGB-51/CGB-56 y `src/app/colaborador/page.tsx`, que indica que las rutas de onboarding llegarán en un incremento posterior. Esto confirma una brecha documental/de producto, no la necesidad del usuario.

## A. Stakeholders y persona

| Stakeholder | Expectativa | Poder | Interés | Prioridad |
|---|---|---:|---:|---|
| Colaborador interno | Completar la inducción y saber qué sigue | Medio | Alto | Alta |
| Administrador | Organizar rutas y contenido; consultar avance autorizado | Alto | Alto | Alta |
| Directorio de CGB Academy | Estandarizar la inducción y reducir orientación repetida | Alto | Alto | Alta |
| Público (estudiantes/docentes) | Encontrar orientación pública sin iniciar sesión | Bajo | Alto | Media |

Estimaciones preliminares basadas en `informe/informe.md` y Jira; falta confirmarlas con los interesados. **Persona hipotética:** colaborador que debe completar una ruta asignada. Necesita conocer el siguiente contenido y retomar donde se quedó; se deben validar sus obstáculos, dispositivo y quién puede ver el avance. No se atribuyen nombre, cita ni conducta observada.

La priorización sigue la matriz poder–interés: alto/alto se gestiona de cerca; bajo/alto se mantiene informado. El colaborador se consulta por su experiencia directa aunque su poder sea medio. Las prioridades son provisionales.

**Elicitación prevista:** entrevista semiestructurada al colaborador, seguida de observación de una tarea. Preguntas: (1) Cuéntame la última vez que completaste una capacitación. (2) ¿Cómo supiste qué te correspondía y en qué orden? (3) ¿Qué hiciste la última vez que te interrumpieron? (4) ¿Cómo comprobaste que el avance quedó guardado? (5) ¿Quién debería ver ese avance y qué debería quedar privado? En la observación se le pedirá encontrar una capacitación, avanzar y retomarla; se anotarán pasos y dudas con consentimiento y sin datos personales innecesarios.

## B. Requisitos revisados

| Tipo y requisito inicial | Problema | Reformulación y verificación |
|---|---|---|
| **Funcional — RF-011:** panel con capacitaciones asignadas y porcentaje “en tiempo real”. | “Tiempo real” y los estados no están definidos. | Para N capacitaciones asignadas y M completadas, Mi Onboarding muestra la ruta ordenada, estado Pendiente/En progreso/Completada y `round(100×M/N)`; si N=0 muestra 0%. **Verificar:** pruebas con ruta vacía y con estados mixtos, comparando lista y porcentaje. |
| **No funcional — RNF-004:** carga inicial `<1,5 s` en 4G. | No fija pantalla, perfil de red ni método de medición. | En build de producción, el contenido principal de Mi Onboarding tendrá LCP p95 `<1,5 s` en 20 mediciones, con dispositivo, perfil 4G y conjunto de datos acordados. **Verificar:** registrar esos parámetros y las 20 medidas; el umbral debe confirmarlo el PO. |
| **Regla de negocio — CGB-56:** la capacitación pasa a Completada al finalizar. | No define si basta llegar al último slide ni cómo se desbloquea el siguiente módulo. | Se marca Completada solo tras recorrer la secuencia y confirmar Finalizar en el último slide; el módulo siguiente se habilita si sus prerrequisitos están completados. **Verificar:** BDD para avance parcial, confirmación final y desbloqueo. Pendiente de aprobar con el PO. |
| **Restricción — alcance MVP:** emisión de certificados excluida. | CGB-51 contenía una constancia descargable contradictoria con el alcance. | El MVP no genera insignias ni certificados; al completar se muestra únicamente el estado de la ruta. **Verificar:** revisar criterios Jira y que la interfaz no ofrezca descarga. |

## C. Backlog refinado y trazabilidad

- [**CGB-56 · HU-012: Completar capacitación y registrar avance**](https://cgb-academy.atlassian.net/browse/CGB-56), prioridad **Highest** (Crítica en la especificación). Como colaborador, quiero guardar y retomar el último slide confirmado, para continuar sin perder avance y reducir repetición de orientación (impacto esperado, hipótesis). Criterios: guardar posición al navegar; reanudar en el último punto; completar tras confirmar todos los slides y pulsar Finalizar en el último; desbloquear el siguiente módulo al cumplir prerrequisitos; impedir acceso entre cuentas; repetir una confirmación no duplica avance. Tareas existentes: CGB-57 pruebas, CGB-58 endpoint/persistencia, CGB-59 idempotencia/UX, CGB-60 BDD y PR a `main`. Necesidad N2: retomar y confiar en el guardado; evidencia pendiente de entrevista/observación.
- [**CGB-51 · HU-011: Consultar panel personal Mi Onboarding**](https://cgb-academy.atlassian.net/browse/CGB-51), prioridad **Highest** (Crítica en la especificación), depende del avance de CGB-56. Como colaborador autenticado, quiero ver mi ruta, estados y avance, para saber qué me falta y reducir consultas manuales (impacto esperado, hipótesis). Criterios: mostrar ruta y estados; calcular porcentaje definido; continuar desde el punto guardado; aislar datos por cuenta y explicar el guardado; no ofrecer certificado fuera del MVP. Tareas existentes: CGB-52 pruebas, CGB-53 API autenticada, CGB-54 panel accesible, CGB-55 BDD y PR a `main`. Necesidad N1: conocer lo asignado y el siguiente paso; evidencia pendiente de entrevista/observación.

**Nota Jira:** el proyecto no ofrece un tipo de issue “Historia”; se conservaron los issues `Tarea` existentes con el formato de historia de usuario. No se modificaron estado, sprint ni responsables. Ambas historias tienen la etiqueta `evidence-pending` hasta realizar la elicitación.

## Reflexión y pendientes

Pasamos por alto que una barra de avance solo sirve si el colaborador confía en que el guardado es correcto y privado. El siguiente sprint debe implementar primero el registro y la reanudación de CGB-56 y luego el panel CGB-51, tras validar la necesidad con la entrevista y observación. Falta realizar ambas actividades, completar la persona con evidencia, confirmar el umbral de rendimiento y obtener aprobación del PO para la regla de visibilidad.
