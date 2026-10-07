# Documentación del Estado y Control de Ramas Git

**Fecha de consolidación:** 7 de Octubre de 2026  
**Repositorio Remoto (`origin`):** `https://github.com/milith0kun/proyecto-ing-software.git`  
**Rama por Defecto (`origin/HEAD`):** `origin/edmil-saire`  
**Ramas Principales Sincronizadas:** `main`, `desarrollo`, `edmil-saire`

---

## 1. Arquitectura y Consolidación de Ramas

Todas las ramas de trabajo de los integrantes del equipo han sido integradas y consolidadas exitosamente en la base:

```
[origin/main] == [origin/desarrollo] == [origin/edmil-saire]
       │
       ├─► alex-carpio (HU-004: Publicación, catálogo y vista previa) [Integrada ✔]
       ├─► ronaldo-ticona (HU-003/HU-006: Editor unificado y visor de slides) [Integrada ✔]
       ├─► domingo-quispe (HU-002/HU-005: CRUD y Exploración pública) [Integrada ✔]
       ├─► edmil-saire (HU-001/Auth/Despliegue/Middleware) [Integrada ✔]
       └─► hector-barazorda (Assets y logos de marca CGB) [Integrada ✔]
```

---

## 2. Matriz de Integración de Historias de Usuario

| Historia de Usuario | Responsable | Estado | Cobertura / Pruebas |
| :--- | :--- | :---: | :--- |
| **HU-001: Autenticación y Acceso Interno** | Edmil Saire | **Integrada ✔** | 11 tests BDD/TDD (JWT, cookies HTTPS, bcrypt, roles) |
| **HU-002: Gestión y Creación CRUD** | Domingo Quispe | **Integrada ✔** | 9 tests BDD/TDD (CRUD capacitaciones, validación campos) |
| **HU-003: Editor Visual de Slides** | Ronaldo Ticona | **Integrada ✔** | 6 tests BDD/TDD (reordenamiento, multimedia, listas) |
| **HU-004: Publicación y Vista Previa** | Alex Carpio | **Integrada ✔** | 15 tests BDD/TDD (publicación, confirmación, índice Atlas) |
| **HU-005: Exploración Pública** | Domingo Quispe | **Integrada ✔** | 7 tests BDD/TDD (catálogo público, filtros, búsqueda) |
| **HU-006: Visor Público Interactivo** | Ronaldo Ticona | **Integrada ✔** | 10 tests BDD/TDD (swipe, navegación teclado, botones acción) |
| **Recursos y Marca Institucional** | Héctor Barazorda | **Integrada ✔** | Logos CGB, CIIP, GEOMINA, BIOMEDIC |

---

## 3. Verificación de Calidad y Construcción

* **Pruebas Automatizadas:** 68 de 68 tests unitarios y de integración ejecutados con éxito (`npm test`).
* **Compilación de Producción:** `npm run build` (Turbopack + Prisma Client + TypeScript) compilado al 100% sin advertencias ni errores.
* **Rutas generadas:**
  * Públicas: `/`, `/capacitaciones`, `/capacitaciones/[id]`, `/login`
  * Administrativas: `/admin/capacitaciones`, `/admin/capacitaciones/[id]/contenido`, `/admin/capacitaciones/[id]/vista-previa`, `/colaborador`
  * API Routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/sesion`, `/api/capacitaciones`, `/api/capacitaciones/[id]`, `/api/capacitaciones/[id]/publicar`, `/api/capacitaciones/[id]/slides`, `/api/public/capacitaciones`, `/api/health`
