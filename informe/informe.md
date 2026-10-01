# INFORME DEL PROYECTO DE INGENIERÍA DE SOFTWARE
**Curso:** Ingeniería de Software I — IF614  
**Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
**Semestre:** 2026-I  

---

## PORTADA Y DATOS GENERALES DEL PROYECTO

- **Nombre del Proyecto:** [Nombre del Sistema / Proyecto]
- **Equipo de Trabajo:**
  - Saire Bustamante, Edmil Jampier (174449) — *Desarrollador Full-Stack / Product Owner*
  - Pumaccahua Cusihuaman, Christian (204805) — *Desarrollador Full-Stack / Scrum Master*
  - Quispe Quispe, Celia (221950) — *Desarrolladora Full-Stack*
  - Lozano Llacctahuaman, Medaly (195050) — *Desarrolladora Full-Stack*
- **Docente:** [Nombre del Docente]
- **Fecha:** [Fecha de Entrega]

---

## 1. Datos Generales del Proyecto

| Parámetro | Detalle |
|---|---|
| **Denominación** | [Nombre formal del software a desarrollar] |
| **Organización / Cliente** | [Institución o beneficiario objetivo] |
| **Repositorio Oficial** | `https://github.com/milith0kun/proyecto-ing-software` |
| **Rama de Integración** | `develop` |
| **Rama de Producción** | `main` |

---

## 2. Objetivo General y Específicos

### 2.1 Objetivo General
- [Describir el objetivo principal del sistema: qué problema resuelve, a quién beneficia y el resultado medible esperado].

### 2.2 Objetivos Específicos
1. [Objetivo específico 1: Requerimientos y modelado conceptual].
2. [Objetivo específico 2: Diseño de arquitectura, componentes y persistencia de datos].
3. [Objetivo específico 3: Implementación modular bajo el método híbrido adoptado].
4. [Objetivo específico 4: Verificación, validación y control de calidad mediante pruebas continuas].

---

## 3. Alcance del Sistema

### 3.1 Módulos y Funcionalidades Incluidas (In-Scope)
- **Módulo 1:** [Descripción del módulo y sus capacidades operativas].
- **Módulo 2:** [Descripción del módulo y sus capacidades operativas].
- **Módulo 3:** [Descripción del módulo y sus capacidades operativas].

### 3.2 Exclusiones y Límites del Sistema (Out-of-Scope)
- [Listar aspectos que no forman parte del entregable para delimitar expectativas claras].

---

## 4. Justificación del Proyecto

- **Justificación Práctica / Operativa:** [Explicar la necesidad real, dolores actuales del usuario y valor agregado del software].
- **Justificación Académica / Técnica:** [Aplicación de principios de ingeniería de software, patrones de arquitectura y buenas prácticas ágiles].

---

## 5. Contexto del Proyecto y Restricciones

### 5.1 Contexto Operativo
[Descripción del entorno donde operará la solución, tipo de usuarios finales y condiciones de acceso].

### 5.2 Restricciones
- **Tecnológicas:** [Ej. Despliegue en VPS, soporte web responsive, compatibilidad con navegadores modernos].
- **Temporales:** [Duración de los sprints de 2 semanas y fechas de corte del semestre académico].
- **De Datos y Privacidad:** [Seguridad de autenticación, hash de contraseñas, minimización de datos personales].

---

## 6. Tecnologías Utilizadas

| Categoría | Tecnología / Herramienta | Justificación de Selección |
|---|---|---|
| **Lenguaje Frontend** | TypeScript / JavaScript | Tipado estático, robustez y amplio ecosistema. |
| **Framework Frontend** | [Ej. React / Next.js] | Componentización reactiva y alto rendimiento. |
| **Lenguaje Backend** | [Ej. Node.js / Python] | Facilidad de integración, velocidad de desarrollo y escalabilidad. |
| **Base de Datos** | [Ej. PostgreSQL / SQLite] | Integridad relacional, soporte transaccional y consultas complejas. |
| **Control de Versiones** | Git & GitHub | Ramificación GitFlow (`main`, `develop`, `feature/*`) y CI/CD. |
| **Gestión Ágil** | Jira / Trello | Seguimiento de backlog, tableros Kanban y cálculo de métricas. |
| **Diseño UI/UX** | Figma | Creación de wireframes y prototipos interactivos. |

---

## 7. Stakeholders (Partes Interesadas)

| Actor / Stakeholder | Tipo | Nivel de Influencia | Interés / Expectativa Principal |
|---|---|---|---|
| **Usuario Final Primario** | Directo | Alto | Facilidad de uso, navegación intuitiva y rapidez. |
| **Administrador del Sistema** | Directo | Alto | Control total de configuraciones, usuarios y reportes. |
| **Equipo de Desarrollo** | Interno | Alto | Código mantenible, arquitectura limpia y entregas a tiempo. |
| **Docente Evaluador** | Académico | Crítico | Rigor metodológico, trazabilidad y software funcional. |

---

## 8. Enfoque de Desarrollo Seleccionado y Justificación

Se ha adoptado un **Enfoque Híbrido Ágil**, fundamentado en la teoría de procesos de software (referencia a *1. Introducción a la IS* y *2. Procesos de Software*).

### 8.1 Comparación de Modelos de Proceso
- **Modelo en Cascada:** Descartado por su rigidez, secuencialidad estricta y riesgo elevado de discrepancias al final del proyecto.
- **Scrum Puro:** Proporciona un marco temporal excelente mediante sprints, pero por sí solo no prescribe prácticas técnicas directas de ingeniería.
- **Kanban:** Provee visibilidad en tiempo real y limitación del trabajo en proceso (WIP), pero carece de compromisos de entrega de ciclo cerrado.
- **XP (Extreme Programming):** Aporta las disciplinas de ingeniería esenciales (TDD, refactorización, integración continua, estándares de código).

### 8.2 Justificación de la Combinación Híbrida
El equipo combina la estructura de cadencia temporal de Scrum (sprints de 2 semanas) con el control visual y límites WIP de Kanban, y la excelencia técnica de XP.

---

## 9. Prácticas Adoptadas del Proceso

### 9.1 Aportes de Scrum
- Sprints de duración fija (2 semanas).
- Ceremonias estructuradas: Sprint Planning, Daily Scrum (15 min), Sprint Review y Retrospectiva.
- Unidad de trabajo basada en Historias de Usuario priorizadas en el Backlog.

### 9.2 Aportes de Kanban
- Tablero visual por fases de desarrollo.
- Políticas explícitas para cada transición de estado.
- Límites de trabajo en progreso (WIP = 1 HU activa por integrante).

### 9.3 Aportes de XP (Extreme Programming)
- Integración Continua (validación automática en cada push/PR).
- Propiedad colectiva del código y revisión por pares (*Peer Review*).
- Diseño simple y refactorización continua.
- Pruebas automatizadas sobre criterios de aceptación.

### 9.4 Uso de IA en el Proceso
- Asistencia en la generación de pruebas unitarias y esquemas de base de datos.
- Apoyo en la redacción estructurada de historias de usuario y criterios BDD (`Dado/Cuando/Entonces`).
- Validación humana obligatoria previa a la integración en código fuente.

---

## 10. Roles, Responsabilidades y Forma de Coordinación

### 10.1 Matriz de Roles
| Integrante | Rol Ágil Principal | Responsabilidades |
|---|---|---|
| **Saire Bustamante, Edmil Jampier** | Product Owner / Dev Full-Stack | Priorización del backlog, aceptación de HU y desarrollo de historias asignadas. |
| **Pumaccahua Cusihuaman, Christian** | Scrum Master / Dev Full-Stack | Facilitación de ceremonias, eliminación de impedimentos y desarrollo full-stack. |
| **Quispe Quispe, Celia** | Desarrolladora Full-Stack | Diseño UI/UX, frontend, backend y pruebas de historias asignadas. |
| **Lozano Llacctahuaman, Medaly** | Desarrolladora Full-Stack | Diseño UI/UX, frontend, backend y pruebas de historias asignadas. |

### 10.2 Acuerdos de Coordinación
- **Daily Scrum:** 15 minutos diarios para sincronización de estado y reporte de bloqueos.
- **Canal de Comunicación:** Discord / WhatsApp para comunicación asíncrona inmediata.
- **Repositorio:** Todo cambio pasa por Pull Request a `develop` con aprobación requerida.

---

## 11. Flujo de Trabajo del Equipo

Cada Historia de Usuario avanza obligatoriamente por un ciclo de **5 Fases**:

```
[ Backlog ] -> [ 1. Plan ] -> [ 2. Diseño UI/UX ] -> [ 3. Frontend ] -> [ 4. Backend ] -> [ 5. Test ] -> [ Done ]
                      |
              [ ⚠️ Bloqueado ]
```

### 11.1 Estados del Tablero
1. **Backlog:** Historias priorizadas pendientes de entrar al sprint.
2. **Plan:** Análisis detallado, definición de criterios de aceptación y Planning Poker.
3. **Diseño UI/UX:** Prototipos en Figma y flujos de pantalla validados.
4. **Frontend:** Construcción de vistas e interfaces de usuario reactivas.
5. **Backend:** Endpoints, servicios de negocio, modelos de BD y seguridad.
6. **Test:** Ejecución de pruebas unitarias, integración y verificación de criterios de aceptación.
7. **Done:** Incremento verificado y listo para producción.
8. **Bloqueado:** Estado transversal para visibilizar impedimentos técnicos o de dependencia.

### 11.2 Límites WIP (Work in Progress)
- **Regla:** Cada desarrollador solo puede tener **1 Historia de Usuario activa** en desarrollo a la vez. No se inicia una nueva HU hasta cerrar la actual.

### 11.3 Política de Bloqueo
- Si una HU no puede avanzar por dependencias externas o fallos técnicos mayores a 24 horas, se traslada a la columna `Bloqueado` y se alerta inmediatamente al Scrum Master en la Daily.

### 11.4 Definición de Hecho (Definition of Done - DoD)
Una Historia de Usuario se considera **Done** únicamente cuando:
- [x] Cumple al 100% los Criterios de Aceptación especificados.
- [x] El código respeta los estándares de estilo del proyecto.
- [x] Cuenta con pruebas unitarias/integración aprobadas.
- [x] Ha pasado la revisión de código por otro integrante (*Peer Review*).
- [x] Ha sido fusionada en la rama `develop` sin conflictos.

---

## 12. Incrementos Presentados del Proyecto

### 12.1 Incremento 1 (Sprint 1)
- **Funcionalidad Desarrollada:** [Describir las funcionalidades construidas durante el primer incremento].
- **Evidencia de Funcionamiento:** [Adjuntar capturas de pantalla, diagramas y URLs funcionales].
- **Pruebas o Validaciones Realizadas:** [Resumen de casos de prueba ejecutados y resultados].
- **Cambios Realizados Respecto al Avance Anterior:** [Ajustes derivados del feedback inicial].

---

## 13. Métricas y Seguimiento del Proceso

- **Historias de Usuario Planificadas vs. Completadas:** [Gráfico o tabla de cumplimiento].
- **Velocidad del Equipo:** [Puntos de historia completados en el sprint].
- **Lead Time y Cycle Time:** [Tiempo medio desde que se inicia una HU hasta su pase a Done].

---

## 14. Acuerdos de Mejora para el Siguiente Incremento

- **Qué funcionó bien:** [Aspectos positivos del sprint].
- **Qué dificultades se encontraron:** [Obstáculos técnicos u organizacionales].
- **Acciones correctivas concretas:** [Compromisos aplicables para el siguiente sprint].

---

## 15. Política de Uso de IA y Registro de Uso

### 15.1 Política Ética
La Inteligencia Artificial se utiliza como herramienta de asistencia técnica, productividad y validación, bajo los siguientes principios:
1. **Comprensión Total:** Ningún miembro del equipo incorpora código generado por IA sin comprender su lógica y arquitectura.
2. **Validación Rigurosa:** Todo fragmento asistido por IA debe ser probado y verificado manualmente.
3. **Transparencia:** Registro documentado de las áreas y propósitos donde se utilizó IA.

### 15.2 Registro de Uso
| Fecha | Herramienta | Propósito / Tarea | Validación Humana Realizada |
|---|---|---|---|
| [Fecha] | Claude / ChatGPT / Gemini | Generación de plantillas de informe y esqueletos de código | Revisión y adaptación a los requerimientos de UNSAAC |

---

## 16. Conclusiones

1. [Conclusión sobre la efectividad del método híbrido adoptado].
2. [Conclusión sobre los resultados técnicos alcanzados en el software].
3. [Conclusión sobre la colaboración y dinámica del equipo de desarrollo].

---

## 17. Referencias Bibliográficas

- Sommerville, I. (2011). *Ingeniería del Software* (9na ed.). Pearson Educación.
- Pressman, R. S. (2010). *Ingeniería del Software: Un enfoque práctico* (7ma ed.). McGraw-Hill.
- Schwaber, K., & Sutherland, J. (2020). *La Guía Scrum: Las reglas del juego*. Scrum.org.
- Anderson, D. J. (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
- Beck, K. (2000). *Extreme Programming Explained: Embrace Change*. Addison-Wesley.
