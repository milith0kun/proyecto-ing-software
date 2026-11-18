# INFORME DE LABORATORIO N° 6
## Gestión del Flujo de Trabajo con Tablero Kanban
**Proyecto Real:** Centro de Capacitación e Inducción — CGB Academy (CIIP LATAM, GEOMINA LATAM, BIOMEDIC)  
**Asignatura:** Ingeniería de Software I (IF614) — UNSAAC  
**Docente:** Ing. Lisha Sabah Diaz Caceres  
**Semestre Académico:** 2026-I  
**Repositorio Oficial:** [https://github.com/milith0kun/proyecto-ing-software](https://github.com/milith0kun/proyecto-ing-software)

---

### Integrantes del Grupo (Sprint 1)
| N° | Apellidos y Nombres | Código Estudiantil | Correo Institucional | Rol en Sprint 1 |
|:---:|:---|:---:|:---|:---|
| 1 | **Barazorda Cuellar, Hector** | 145003 | 145003@unsaac.edu.pe | Scrum Master / Dev Full-Stack |
| 2 | **Carpio Hermoza, Alex** | 164563 | 164563@unsaac.edu.pe | Desarrollador Full-Stack |
| 3 | **Quispe Mamani, Domingo de Guzman** | 191978 | 191978@unsaac.edu.pe | Desarrollador Full-Stack |
| 4 | **Saire Bustamante, Edmil Jampier** | 174449 | 174449@unsaac.edu.pe | Product Owner / Dev Full-Stack |
| 5 | **Ticona Jancco, Ronaldo** | 211816 | 211816@unsaac.edu.pe | Desarrollador Full-Stack |

---

## 1. Objetivo del Laboratorio
Gestionar el flujo de trabajo continuo del equipo de desarrollo para la plataforma web **CGB Academy** mediante un **Tablero Kanban**, identificando estados, transiciones de valor, cuellos de botella en la fase de revisión y calculando métricas ágiles esenciales (WIP, Lead Time, Cycle Time y Throughput).

---

## 2. Fundamento Teórico
* **Kanban y Flujo Continuo:** Sistema visual de gestión pull (*Stop Starting, Start Finishing*).
* **Work In Progress (WIP):** Restricciones cuantitativas para evitar sobrecarga y multitarea ineficiente.
* **Ley de Little:** $\text{WIP} = \text{Throughput} \times \text{Cycle Time}$. Reducir el inventario WIP reduce directamente el tiempo de entrega.
* **Lead Time vs. Cycle Time:**
  - *Lead Time:* Desde la concepción en Backlog hasta Producción (promedio obtenido: **4.2 días**).
  - *Cycle Time:* Desde inicio de codificación en rama Git hasta pase a Terminado (promedio obtenido: **2.1 días**).

---

## 3. Estructura del Tablero Kanban y Políticas
| Columna | Límite WIP | Criterio de Entrada | Criterio de Salida |
|---|:---:|---|---|
| **1. Backlog** | $\infty$ | Historias de Usuario documentadas en Agile Inception. | Priorizadas y refinadas por el Product Owner. |
| **2. Por Hacer (To Do)** | 3 | Tareas listas para ser tomadas por los desarrolladores. | Ingeniero toma la tarjeta e inicia rama de trabajo. |
| **3. En Progreso** | 2 | Código en desarrollo local con commits verificables. | Tests unitarios aprobados y Pull Request abierto. |
| **4. En Revisión (PR)** | 2 | Pull Request solicitando Peer Code Review. | Aprobación de revisor técnico y pruebas superadas. |
| **5. Terminado (Done)** | $\infty$ | Merge a la rama principal `main` y deploy staging. | Verificación funcional en Dokploy VPS. |

---

## 4. Distribución de Historias y Cuello de Botella
* **En Revisión (Cuello de Botella):** HU-002 (Domingo Quispe) y HU-005 (Alex Carpio) alcanzaron el límite WIP de 2. El equipo aplicó *swarming* deteniendo nuevos inicios hasta destrabar las revisiones pendientes.
* **En Progreso:** HU-004 (Edmil Saire) y HU-003 (Hector Barazorda).
* **Terminado:** HU-001 (Autenticación), HU-009 (Sistema de Diseño) y HU-010 (Despliegue Dokploy).

---

## 5. Entregables Generados
1. `capturas/tablero_kanban_cgb.png`: Tablero Kanban completo en alta resolución.
2. `capturas/cfd_sprint1_cgb.png`: Diagrama de Flujo Acumulado (CFD) de 14 días.
3. `capturas/metricas_lead_cycle_cgb.png`: Gráfica comparativa de Lead Time y Cycle Time.
4. `informe_laboratorio_6.pdf`: Documento académico compilado en LaTeX de 7 páginas.
