# INFORME TÉCNICO DE IMPLEMENTACIÓN — HISTORIA DE USUARIO HU-005
## Explorar Capacitaciones Públicas en CGB Academy
**Curso:** Ingeniería de Software I — IF614  
**Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
**Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica**  
**Escuela Profesional de Ingeniería de Sistemas e Informática**  
**Desarrollador Responsable:** Quispe Mamani, Domingo de Guzman *(Dev 2 — Full-Stack)*  
**Rama de Trabajo:** `domingo-quispe`  
**Fecha de Entrega:** 01 de octubre de 2026  

---

## 1. Identificación y Alcance de la Historia de Usuario

| Parámetro | Detalle de Ingeniería |
|---|---|
| **Código HU** | **HU-005** |
| **Título** | Explorar capacitaciones públicas |
| **Responsable** | Quispe Mamani, Domingo de Guzman (Dev 2) |
| **Sprint** | Sprint 1 (Núcleo de Capacitación y Acceso Público) |
| **Estimación** | 3 Story Points (Planning Poker) |
| **Claves Jira** | `CGB-22` (T1), `CGB-23` (T2), `CGB-24` (T3), `CGB-25` (T4) |
| **Estado** | Completado / Listo para Revisión por Pares (Peer Review) |

### 1.1 Redacción Formal de la Historia de Usuario (ISO/IEC/IEEE 29148:2018)
> **Como** usuario público (estudiante, docente o postulante externo de CGB Academy),  
> **Quiero** explorar las capacitaciones e inducciones disponibles sin iniciar sesión,  
> **Para** encontrar orientación clara sobre los procesos, plataformas y servicios que necesito dentro del ecosistema de CIIP, GEOMINA y BIOMEDIC.

---

## 2. Matriz de Criterios de Aceptación y Verificación BDD

| ID | Criterio de Aceptación (Formato BDD) | Resultado de Validación | Estado |
|---|---|---|:---:|
| **CA-01** | **Dado que** una persona accede al Centro de Capacitación CGB Academy,<br>**Cuando** visita su sección pública,<br>**Entonces** debe visualizar únicamente las capacitaciones publicadas para acceso abierto (`ambito = "PUBLICO"` y `estado = "PUBLICADA"`). | Verificado mediante pruebas unitarias en `tests/catalogo-publico.test.mjs` y consulta estricta a MongoDB Atlas. | ✅ Cumplido |
| **CA-02** | **Dado que** existen contenidos destinados a diferentes públicos,<br>**Cuando** el usuario navega por el centro,<br>**Entonces** debe poder distinguir contenidos orientados a estudiantes, docentes u otras categorías y unidades (`CIIP`, `GEOMINA`, `BIOMEDIC`, `GENERAL`). | Verificado con selectores de chips y buscador reactivo en `/capacitaciones`. | ✅ Cumplido |
| **CA-03** | **Dado que** un colaborador ya inició sesión,<br>**Cuando** accede al contenido público,<br>**Entonces** debe poder consultarlo igualmente sin que ese consumo altere su progreso de onboarding obligatorio. | Verificado con endpoints desacoplados de progreso y consultas públicas sin token. | ✅ Cumplido |

---

## 3. Arquitectura Técnica y Componentes Desarrollados

```
[ Cliente Web / Navegador ]
            │
            ├──> GET /capacitaciones ──> [ React 19 Client Component (Filtros + Buscador) ]
            │                                           │
            └──> GET /api/public/capacitaciones ────────┘
                            │
                  (Prisma ORM 6.19.3)
                            │
               [ MongoDB Atlas Cluster0 ]
          { ambito: "PUBLICO", estado: "PUBLICADA" }
```

### 3.1 Módulos Implementados
1. **Contratos y Dominio:** [`src/lib/catalogo-publico.ts`](file:///c:/Users/wtfcl/Desktop/ING%20DE%20SOFTWARE/proyecto-ing-software/src/lib/catalogo-publico.ts)
   - Funciones puras `filtrarCapacitacionesPublicas()`, `buscarEnCatalogoPublico()` y `validarConsultaPublica()`.
2. **Endpoint API REST:** [`src/app/api/public/capacitaciones/route.ts`](file:///c:/Users/wtfcl/Desktop/ING%20DE%20SOFTWARE/proyecto-ing-software/src/app/api/public/capacitaciones/route.ts)
   - `GET /api/public/capacitaciones` con soporte para query params `?unidad=`, `?categoria=`, `?q=`.
3. **Página de Catálogo Público:** [`src/app/capacitaciones/page.tsx`](file:///c:/Users/wtfcl/Desktop/ING%20DE%20SOFTWARE/proyecto-ing-software/src/app/capacitaciones/page.tsx)
   - Interfaz con filtros en tiempo real, chips temáticos por unidad, diseño responsivo y estado vacío.
4. **Navegación en Página Principal:** [`src/app/page.tsx`](file:///c:/Users/wtfcl/Desktop/ING%20DE%20SOFTWARE/proyecto-ing-software/src/app/page.tsx)
   - Botón *"Explorar Capacitaciones"* y tarjetas de unidades conectadas directamente al catálogo.

---

## 4. Trazabilidad del Ciclo TDD y Subtareas en Jira

| Subtarea Jira | Fase TDD | Commit Asociado | Descripción de la Entrega |
|---|:---:|---|---|
| **CGB-22** | **T1: RED** | `e1f6c84` | Suite de pruebas automatizadas BDD en `tests/catalogo-publico.test.mjs`. |
| **CGB-23** | **T2: GREEN** | `71ef200` | Implementación del endpoint API público y página del catálogo en Next.js. |
| **CGB-24** | **T3: REFACTOR** | `79ed962` | Optimización de código, limpieza de tipados y conexión de navegación desde la portada. |
| **CGB-25** | **T4: VALIDACIÓN** | *(En preparación)* | Validación integral de criterios BDD, 0 errores en ESLint y documentación de entrega. |

---

## 5. Resultados de Pruebas Automatizadas

```text
▶ HU-005: T1 - Criterio CA-01: Filtro de Visibilidad y Acceso Público Abierto
  ✔ CA-01: Debe retornar únicamente capacitaciones en estado PUBLICADA y ámbito PUBLICO
  ✔ CA-01: Debe excluir estrictamente capacitaciones en BORRADOR o de ámbito INTERNO
▶ HU-005: T1 - Criterio CA-02: Segmentación por Unidad Institucional y Categorías
  ✔ CA-02: Debe filtrar por unidad institucional (CIIP, GEOMINA, BIOMEDIC)
  ✔ CA-02: Debe filtrar por categoría destinataria (Estudiantes vs Docentes)
  ✔ CA-02: Búsqueda dinámica por texto coincidente en título o descripción
▶ HU-005: T1 - Criterio CA-03: Consulta Pública e Independencia de Onboarding
  ✔ CA-03: No requiere parámetros de autenticación ni altera sesiones de colaboradores
▶ HU-005: T1 - Escenarios BDD Formato Dado/Cuando/Entonces
  ✔ Escenario BDD 1: Visitante anónimo accede al catálogo público abierto
  ✔ Escenario BDD 2: Usuario filtra capacitaciones públicas de GEOMINA para Estudiantes

Total de pruebas del sistema: 22 aprobadas / 0 fallidas (100% PASS)
Calidad de código (ESLint): 0 errores / 0 advertencias
```

---

## 6. Verificación de la Definición de Hecho (Definition of Done — DoD)

- [x] **Criterios de Aceptación:** CA-01, CA-02 y CA-03 verificados al 100%.
- [x] **Pruebas Automatizadas:** 22/22 tests pasando exitosamente en Node.js.
- [x] **Análisis Estático:** 0 errores y 0 advertencias en ESLint.
- [x] **Persistencia y Base de Datos:** Validada sobre MongoDB Atlas Cluster0.
- [x] **Manual de Marca y Sistema de Diseño:** Cumplimiento de paleta oficial (Navy `#092A60`, Blue `#146287`, Cyan `#4DC4D3`), lienzo `#F9FAFB` y cero emojis.
- [x] **Control de Versiones:** Commits semánticos y sincronización de rama `domingo-quispe`.
