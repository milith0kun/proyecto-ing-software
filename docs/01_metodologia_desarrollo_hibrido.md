# Diseño de un Método Híbrido de Desarrollo de Software
**Scrum Base con Historias de Usuario, Kanban y Prácticas de XP**

---

## Información del Equipo

- **Institución:** Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)
- **Escuela Profesional:** Ingeniería de Sistemas e Informática
- **Año:** 2026
- **Proyecto:** Centro de Capacitación — CGB Academy

### Integrantes
| Nombre Completo | Código | Rol Principal en Metodología |
|---|---|---|
| **Saire Bustamante, Edmil Jampier** | 174449 | Desarrollador Full-Stack / Product Owner |
| **Pumaccahua Cusihuaman, Christian** | 204805 | Desarrollador Full-Stack / Scrum Master |
| **Quispe Quispe, Celia** | 221950 | Desarrolladora Full-Stack |
| **Lozano Llacctahuaman, Medaly** | 195050 | Desarrolladora Full-Stack |

---

## 1. Introducción

Este documento presenta el diseño de un método híbrido de desarrollo de software para un equipo de cuatro integrantes. El método toma a **Scrum** como estructura base e incorpora prácticas visuales de **Kanban** y disciplinas técnicas de la **Programación Extrema (XP)**.

La unidad central de trabajo es la **Historia de Usuario (HU)**, entendida de forma integral: cada HU cubre desde el diseño UI/UX hasta el backend y las pruebas, garantizando incrementos de software terminados, testeados y desplegables.

---

## 2. Justificación del Método Base

Scrum fue seleccionado porque su estructura de sprints cortos y su backlog priorizado se adaptan perfectamente a equipos pequeños que requieren entregas verificables y capacidad de ajuste continuo. Se descartó el modelo en Cascada por su rigidez ante cambios, y Kanban puro por carecer de una estructura de cadencia temporal definida.

### Comparación de Metodologías
| Criterio | Scrum | Cascada | Kanban | Método Híbrido Propuesto |
|---|---|---|---|---|
| **Flexibilidad** | Alta | Baja | Muy Alta | **Alta y Controlada** |
| **Entregas** | Iterativas | Una al final | Continuas | **Iterativas por Sprint (2 semanas)** |
| **Documentación** | Ligera | Exhaustiva | Mínima | **Pragmática y Verificable** |
| **Equipo pequeño** | Sí | Parcialmente | Sí | **Diseñado para 4 Desarrolladores** |
| **Visibilidad** | Alta | Baja | Alta | **Máxima (Tablero Kanban por fases)** |

---

## 3. Descripción del Método Híbrido

### 3.1 Estructura General
- **Duración del Sprint:** 2 semanas calendario (10 días laborables).
- **Capacidad:** Cada sprint incluye exactamente 4 historias de usuario (1 HU por integrante).
- **Perfil del Equipo:** Los cuatro integrantes son desarrolladores full-stack. Dos de ellos asumen complementariamente los roles de Product Owner y Scrum Master, sin eximirse de su HU asignada.
- **Flujo Visual:** Tablero Kanban con límites de trabajo en progreso (WIP = 1 HU activa por desarrollador).

### 3.2 La Historia de Usuario como Unidad Completa
Cada historia de usuario se descompone obligatoriamente en cinco fases consecutivas que garantizan la definición de terminado (*Definition of Done*):

| Fase | Contenido y Actividades | Criterio de Avance |
|---|---|---|
| **1. Plan** | Definición de la HU, criterios de aceptación (Dado/Cuando/Entonces) y estimación con Planning Poker. | HU aprobada por el PO antes de iniciar desarrollo. |
| **2. Diseño UI/UX** | Wireframes, prototipos y flujo de navegación adaptativo responsive. | Diseño validado y aprobado por el Product Owner. |
| **3. Frontend** | Construcción de interfaces interactivas y consumo de endpoints con datos mock/reales. | Interfaz funcional y conectada. |
| **4. Backend** | Lógica de negocio, controladores, modelos de persistencia, seguridad y endpoints REST. | API responde correctamente y pasa validaciones. |
| **5. Test** | Pruebas unitarias, de integración y verificación rigurosa de los Criterios de Aceptación. | 100% de criterios de aceptación superados. |

> Un desarrollador no puede dar por terminada una HU si alguna de las 5 fases está incompleta. Esto previene entregas a medias al cierre del sprint.

---

## 4. Roles del Equipo

| Rol | Responsabilidad Principal | Dedicación |
|---|---|---|
| **Product Owner** | Prioriza el backlog, valida criterios de aceptación y aprueba entregables de diseño y funcionales. | Función dual: gestión de producto + 1 HU Full-Stack asignada. |
| **Scrum Master** | Facilita ceremonias, remueve bloqueos técnicos y monitorea el flujo en el tablero Kanban. | Función dual: facilitación técnica + 1 HU Full-Stack asignada. |
| **Desarrolladores Full-Stack (x4)** | Ejecutan las 5 fases de su HU de forma autónoma durante el sprint. | 100% comprometidos con el incremento funcional. |

---

## 5. Calendario y Ceremonias del Sprint

| Momento | Ceremonia / Actividad | Objetivo y Dinámica |
|---|---|---|
| **Día 1 (Mañana)** | **Sprint Planning** | Selección de las 4 HU del backlog, estimación mediante Planning Poker y asignación de 1 HU por persona. |
| **Días 1 al 9** | **Daily Scrum (15 min)** | Sincronización diaria: qué se completó ayer, qué se hará hoy y qué impedimentos existen. |
| **Día 9 (Tarde)** | **Revisión Interna de Avance** | Identificación temprana de HU en riesgo y resolución colaborativa de bloqueos. |
| **Día 10 (Mañana)** | **Sprint Review** | Demostración del software funcionando al Product Owner sobre la rama de integración. |
| **Día 10 (Tarde)** | **Retrospectiva** | Análisis del proceso: qué funcionó bien, qué falló y acciones de mejora para el siguiente sprint. |

---

## 6. Prácticas Técnicas Incorporadas (XP y Kanban)

1. **Integración Continua (CI):** Cada pull request a `develop` valida compilación, análisis estático y pruebas automáticas.
2. **Criterios de Aceptación Verificables (BDD):** Uso estricto del formato `Dado que... Cuando... Entonces...` para evitar ambigüedades.
3. **Control de Flujo Kanban:**
   - Columnas: `Backlog` → `Plan` → `Diseño UI/UX` → `Frontend` → `Backend` → `Test` → `Done` (con carril de `Bloqueado`).
4. **Revisión de Código por Pares (Peer Review):** Todo PR requiere al menos una aprobación antes de fusionarse.
