# Centro de Capacitación — CGB Academy
**Proyecto de Ingeniería de Software — Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**

[![CI Pipeline](https://github.com/milith0kun/proyecto-ing-software/actions/workflows/ci.yml/badge.svg)](https://github.com/milith0kun/proyecto-ing-software/actions/workflows/ci.yml)
[![Branch - develop](https://img.shields.io/badge/branch-develop-blue.svg)](https://github.com/milith0kun/proyecto-ing-software/tree/develop)
[![Branch - main](https://img.shields.io/badge/branch-main-brightgreen.svg)](https://github.com/milith0kun/proyecto-ing-software/tree/main)

---

## 👥 Equipo de Desarrollo

| Integrante | Código UNSAAC | Rol en Metodología |
|---|---|---|
| **Saire Bustamante, Edmil Jampier** | 174449 | Desarrollador Full-Stack / Product Owner |
| **Pumaccahua Cusihuaman, Christian** | 204805 | Desarrollador Full-Stack / Scrum Master |
| **Quispe Quispe, Celia** | 221950 | Desarrolladora Full-Stack |
| **Lozano Llacctahuaman, Medaly** | 195050 | Desarrolladora Full-Stack |

---

## 📖 Descripción del Proyecto

El **Centro de Capacitación CGB Academy** es una plataforma integral de gestión del aprendizaje y orientación institucional. Permite la creación y publicación dinámica de contenidos de capacitación mediante diapositivas interactivas (*slides*), gestión de rutas de aprendizaje personalizadas para colaboradores según área y puesto, evaluación mediante microtests con retroalimentación inmediata, y acceso público libre a contenidos orientativos sin necesidad de autenticación.

---

## 📑 Índice de Documentación Oficial

Toda la documentación técnica y de gestión del proyecto se encuentra estructurada en la carpeta [`docs/`](./docs/):

1. **[01. Metodología Híbrida de Desarrollo (Scrum + Kanban + XP)](./docs/01_metodologia_desarrollo_hibrido.md)**  
   Detalla el ciclo de trabajo de 2 semanas, el flujo en 5 fases por HU (Plan, Diseño UI/UX, Frontend, Backend y Test), roles, límites WIP y ceremonias.

2. **[02. Especificación de Historias de Usuario (HU-001 a HU-023)](./docs/02_historias_de_usuario_mvp.md)**  
   Catálogo completo de requerimientos funcionales en formato estándar (*Como/Quiero/Para*) y Criterios de Aceptación verificables (*Dado/Cuando/Entonces*).

3. **[03. Requerimientos No Funcionales (RNF-001 a RNF-010)](./docs/03_requerimientos_no_funcionales.md)**  
   Restricciones de diseño responsive, idioma, infraestructura VPS (2 vCPU / 8 GB RAM), seguridad, minimización de datos y consistencia visual.

4. **[04. Planificación de Sprints y Alcance del MVP](./docs/04_plan_de_sprints.md)**  
   Desglose del MVP en 3 sprints funcionales (15 historias) y fase de mejoras posteriores.

5. **[05. Guía de Flujo de Trabajo en Git y Colaboración](./docs/05_guia_de_flujo_git.md)**  
   Protocolo de desarrollo colaborativo, ramificación (`feature/*` → `develop` → `main`), convenciones de commits y pull requests.

---

## 🚀 Resumen del Plan de Sprints (MVP: 15 HUs)

| Sprint | Historias | Enfoque y Entregable Funcional |
|---|---:|---|
| **Sprint 1** | HU-001 a HU-006 | **Motor de capacitación + Experiencia pública funcional:** Login interno, creación de capacitaciones, editor de slides, previsualización, publicación y módulo público. |
| **Sprint 2** | HU-007 a HU-012 | **Onboarding interno funcional:** Áreas y puestos, rutas de onboarding, registro de colaboradores, asignación, activación de cuenta y dashboard "Mi Onboarding". |
| **Sprint 3** | HU-013 a HU-015 | **Microtests + Seguimiento administrativo:** Creación de microtests, resolución de evaluaciones con feedback y panel de supervisión de avances. |
| **Posterior al MVP** | HU-016 a HU-023 | Mejoras analíticas, exportación, automatización de recordatorios y rutas recomendadas. |

---

## 🌿 Estrategia de Ramas en Git

El repositorio opera bajo un modelo **GitFlow simplificado**:

```
[ main ]        <=== Producción / Entregas estables
   ^
   | (PR de integración final tras Sprint Review)
[ develop ]     <=== Rama principal de desarrollo y testing colaborativo
   ^
   | (Pull Requests individuales)
[ feature/HU-xxx-nombre ]
```

### Reglas para los Desarrolladores:
1. **Rama Base de Trabajo:** Todos los desarrolladores parten de `develop`.
2. **Nombre de Ramas:** `feature/HU-001-nombre-breve` o `fix/HU-xxx-nombre`.
3. **Integración:** Las pruebas conjuntas se realizan en `develop`. Ningún desarrollador sube cambios directos a `main`.
4. **Validación:** Todo Pull Request hacia `develop` debe pasar las pruebas automáticas del pipeline de CI.

---

## 🧪 Pruebas Automatizadas

Para ejecutar la suite de pruebas locales de estructura y verificación de requerimientos:

```bash
python tests/test_docs_and_structure.py
```