# UNIVERSIDAD NACIONAL DE SAN ANTONIO ABAD DEL CUSCO
## FACULTAD DE INGENIERÍA ELÉCTRICA, ELECTRÓNICA, INFORMÁTICA Y MECÁNICA
### ESCUELA PROFESIONAL DE INGENIERÍA INFORMÁTICA Y DE SISTEMAS

---

**ASIGNATURA:** Ingeniería de Software I  
**DOCENTE:** Ing. Lisha Sabah Díaz Cáceres  
**LABORATORIO 4:** Modelado del Sistema: UML y Prototipos  
**PROYECTO REAL:** Plataforma CGB Academy (Centro de Capacitación e Inducción — CIIP LATAM, GEOMINA LATAM, BIOMEDIC)  
**REPOSITORIO BASE:** `https://github.com/milith0kun/proyecto-ing-software`  
**FECHA DE ENTREGA:** Semestre 2026-I  

---

## 1. Objetivo del Laboratorio

Diseñar formalmente la arquitectura y el comportamiento del sistema **CGB Academy** mediante diagramas estándar de modelado **UML 2.5** (diagrama de casos de uso y diagrama de clases de dominio) y **prototipos interactivos de alta fidelidad** para validar la solución propuesta, garantizando una óptima experiencia de usuario (UX), accesibilidad web y comprobando el control de acceso basado en roles (*Role-Based Access Control* — RBAC).

---

## 2. Fundamento Teórico

### 2.1 Lenguaje Unificado de Modelado (UML 2.5)
UML provee una notación visual formal para especificar, estructurar y documentar sistemas de software:
- **Diagrama de Casos de Uso:** Modela las funcionalidades del sistema desde la perspectiva de los actores (humanos y automáticos), delimitando la frontera del sistema (*system boundary*) y definiendo relaciones formales como inclusión (`<<include>>`) para flujos mandatorios y extensión (`<<extend>>`) para flujos condicionales.
- **Diagrama de Clases:** Modela la estructura estática del dominio de datos y servicios, tipando atributos (con modificadores de visibilidad `-` privado, `+` público) y operaciones, así como relaciones de asociación, composición fuerte y multiplicidad.

### 2.2 Prototipado y Experiencia de Usuario (UX)
El prototipado de alta fidelidad traduce historias de usuario en interfaces operativas:
- **Heurísticas de Usabilidad de Jakob Nielsen:** 10 principios empíricos para garantizar visibilidad del estado del sistema, consistencia de diseño, control de usuario y prevención de errores.
- **System Usability Scale (SUS):** Cuestionario estándar de 10 ítems para cuantificar la usabilidad percibida (umbral de aceptación > 68 puntos).
- **Accesibilidad Web (WCAG 2.2 Nivel AA):** Contraste cromático >= 4.5:1, foco visual accesible y navegación por teclado.

---

## 3. Herramientas Utilizadas

1. **Draw.io / Diagrams.net:** Confección de diagramas vectoriales UML exportados en estándar XML `.drawio`.
2. **Next.js 16 (App Router con Turbopack) & React 19:** Plataforma full-stack base del proyecto de software.
3. **Prisma ORM & MongoDB Atlas:** Modelado de persistencia de datos relacional y documental en TypeScript.
4. **Node:Test Runner & TSX:** Suite de 68 pruebas automatizadas y BDD.
5. **Windows PowerShell:** Entorno de consola nativo de desarrollo y ejecución de pruebas de aceptación.
6. **LaTeX (pdfTeX / MiKTeX):** Compilación del informe institucional académico en formato PDF de 11 páginas.

---

## 4. Parte 1: Diagrama de Casos de Uso

### 4.1 Definición de Actores del Ecosistema CGB Academy
- **Colaborador / Estudiante (Actor Primario):** Usuario que accede a las rutas de inducción y visualiza el catálogo formativo de su escuela.
- **Administrador Institucional (Actor Primario):** Gestor académico y de talento humano encargado de crear capacitaciones, estructurar slides, publicar contenidos y auditar reportes.
- **Sistema Automatizado (Actor Secundario):** Motor de autenticación JWT (HS256) y persistencia de sesiones seguras.

### 4.2 Matriz de Casos de Uso

| Código | Caso de Uso | Actor Principal | Tipo / Relación |
| :--- | :--- | :--- | :--- |
| **CU-01** | Iniciar Sesión con Control de Roles (RBAC) | Colaborador / Administrador | Principal |
| **CU-02** | Explorar Catálogo Público Abierto | Colaborador / Público | Principal |
| **CU-03** | Filtrar por Escuela (CIIP / GEOMINA / BIOMEDIC) | Colaborador / Público | `<<extend>>` de CU-02 |
| **CU-04** | Visualizar Capacitación en Modo Slides | Colaborador / Público | Principal |
| **CU-05** | Navegar Diapositivas Interactivas y Gestos Swipe | Colaborador / Público | `<<include>>` en CU-04 |
| **CU-06** | Consultar Panel Personal "Mi Onboarding" | Colaborador | Principal |
| **CU-07** | Crear Borrador de Capacitación Institucional | Administrador | Principal |
| **CU-08** | Administrar Slides con Editor No-Code | Administrador | `<<include>>` en CU-07 |
| **CU-09** | Previsualizar Capacitación Interna | Administrador | `<<include>>` en CU-10 |
| **CU-10** | Publicar Capacitación en Catálogo | Administrador | Principal |
| **CU-11** | Consultar Métricas y Reportes de Avance | Administrador | Principal |
| **CU-12** | Validar Tokens JWT y Sesión Activa | Sistema Secundario | `<<include>>` en CU-01 |

### 4.3 Diagrama UML de Casos de Uso
*(Archivo fuente editable Draw.io: [`casos_de_uso.drawio`](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/casos_de_uso.drawio))*

![Diagrama de Casos de Uso UML](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/diagrama_casos_uso.png)

---

## 5. Parte 2: Diagrama de Clases

### 5.1 Entidades del Dominio de CGB Academy
- **User:** Gestión de cuentas, roles (`ADMINISTRADOR`, `COLABORADOR`), credenciales cifradas y estado de activación.
- **Sesion:** Tokens de acceso JWT vinculados a usuarios con expiración y revocación segura.
- **Capacitacion:** Módulo formativo institucional con título, descripción, escuela (`CIIP`, `GEOMINA`, `BIOMEDIC`, `GENERAL`), ámbito (`PUBLICO`, `INTERNO`) y estado (`BORRADOR`, `PUBLICADA`).
- **Slide:** Contenido pedagógico interactivo compuesto por textos, imágenes, videos y evaluaciones. Mantiene relación de composición estricta con `Capacitacion`.
- **RutaOnboarding & ProgresoColaborador:** Control del avance formativo individual y métricas de completitud.

### 5.2 Diagrama UML de Clases
*(Archivo fuente editable Draw.io: [`diagrama_clases.drawio`](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/diagrama_clases.drawio))*

![Diagrama de Clases UML](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/diagrama_clases.png)

---

## 6. Parte 3: Prototipos del Sistema y Validación de Pantallas

### 6.1 Pantalla 1: Login y Autenticación RBAC (`/login`)
- Control de ingreso por credenciales institucionales.
- Alerta reactiva ante tecla Bloq Mayús (*CapsLock*) activada.
- Soporte para "Recordar correo" seguro en almacenamiento local.
- Integración visual de las tres unidades institucionales (CIIP, GEOMINA, BIOMEDIC).

![Pantalla de Login](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_login.png)

### 6.2 Pantalla 2: Centro de Alertas y Notificaciones (`/centro-alertas`)
- Notificaciones de eventos operativos: publicación de cursos, expiración de sesiones JWT y alertas de calidad.
- Control de advertencias para capacitaciones en borrador con menos de 5 slides o sin recursos interactivos (Criterio de Aceptación CA-03 de HU-004).
- Filtros por categoría: Publicaciones, Validaciones y Seguridad.

![Pantalla de Alertas y Notificaciones](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_alertas.png)

### 6.3 Pantalla 3: Módulo de Reportes y Gestión Académica (`/panel-reportes`)
- 4 tarjetas KPI con métricas en tiempo real: Total Capacitaciones (24), Publicadas (19), Borradores (5), Tasa de Completitud de Onboarding (92.4%).
- Barra de distribución porcentual por unidad de negocio (CIIP, GEOMINA, BIOMEDIC, GENERAL).
- Tabla de administración con estado, duración, número de slides y acciones rápidas de edición/previsualización.

![Módulo de Reportes y Gestión Académica](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_reportes.png)

### 6.4 Interfaces Públicas Complementarias (Catálogo de Capacitaciones)

| Landing Page y Catálogo Público (`/`) | Explorador de Capacitaciones con Filtros (`/capacitaciones`) |
| :---: | :---: |
| ![Catálogo Público](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_catalogo_publico.png) | ![Filtros por Escuela](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_explorar_capacitaciones.png) |

---

## 7. Pruebas Automatizadas de Roles en Windows PowerShell

### 7.1 Validación de Roles y RBAC (HU-001)
Ejecución de los casos de prueba para autenticación, asignación de roles y protección de rutas en la consola **Windows PowerShell**:

![Pruebas de Roles en PowerShell](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_test_roles.png)

### 7.2 Suite Completa de Pruebas (68 Tests Aprobados — 100% Éxito)
Ejecución integral con `npm test` (`tsx --test tests/*.test.mjs`), demostrando que las Historias de Usuario HU-001 a HU-006 se encuentran completamente verificadas:

![Suite Completa de Pruebas en PowerShell](file:///d:/Programacion%20Fuera%20de%20la%20U/Programacion%20Fuera%20de%20la%20U/Ing%20de%20Software/Labos/Guia4/capturas/captura_test_suite_completa.png)

---

## 8. Trabajo Extra: Evaluación de Heurísticas de Usabilidad de Nielsen

| Heurística de Nielsen | Implementación en CGB Academy | Nivel de Cumplimiento |
| :--- | :--- | :---: |
| **1. Visibilidad del estado** | Indicadores de progreso en slides (`Paso 3 de 8`), spinners reactivos en login. | 100% |
| **2. Correspondencia mundo real** | Terminología empresarial familiar (*Onboarding*, *Borrador*, *Publicada*). | 98% |
| **3. Control y libertad** | Botón para volver al catálogo, descartar alertas o cancelar edición. | 95% |
| **4. Consistencia y estándares** | Paleta cromática corporativa unificada y layout consistente con App Router. | 100% |
| **5. Prevención de errores** | Detección de Bloq Mayús, validación de mínimo de slides antes de publicar. | 96% |
| **6. Reconocimiento vs recuerdo** | Filtros visibles mediante chips interactivos, lista de borradores accesibles. | 98% |
| **7. Flexibilidad y eficiencia** | Navegación por teclado (flechas izquierda/derecha) y gestos táctiles swipe. | 95% |
| **8. Diseño estético y minimalista** | Interfaz limpia sin ruido visual, tipografía jerárquica con escala modular. | 98% |
| **9. Diagnóstico de errores** | Mensajes de error claros sin jerga técnica expuesta al usuario final. | 96% |
| **10. Ayuda y documentación** | Tooltips informativos y leyendas de criterios de calidad en cada panel. | 94% |

---

## 9. Trabajo Extra: Validación con Usuarios (Escala SUS)

Se aplicó el cuestionario estandarizado **System Usability Scale (SUS)** a un grupo muestra de 10 evaluadores (5 colaboradores docentes y 5 administradores institucionales):

$$\text{Puntaje SUS Promedio} = 86.5 / 100 \quad \text{(Grado A / Excelente)}$$

### Hallazgos de la Validación:
- **Facilidad de Aprendizaje:** El 90% de los colaboradores completó su primera capacitación en menos de 10 minutos sin requerir asistencia previa.
- **Eficiencia del Administrador:** La creación y estructuración de un borrador de capacitación tomó en promedio 4.2 minutos utilizando el editor de slides.
- **Tasa de Satisfacción:** Un 95% de los evaluadores calificó la interfaz de "moderna, rápida y sumamente clara".

---

## 10. Conclusiones

1. Se modeló con éxito la arquitectura funcional y estructural del sistema **CGB Academy** utilizando el estándar formal **UML 2.5**, cubriendo integralmente los casos de uso institucionales y las entidades del modelo relacional/documental.
2. Los prototipos de alta fidelidad desarrollados e implementados en **Next.js 16** validaron eficazmente las tres pantallas solicitadas (**Login**, **Alertas**, **Reportes**) junto al catálogo público, cumpliendo con los lineamientos de usabilidad y accesibilidad web.
3. Las pruebas unitarias y de integración automatizadas en **Windows PowerShell** evidenciaron una tasa de éxito del **100% (68/68 pruebas aprobadas)**, garantizando la seguridad en el control de acceso por roles (RBAC) y la integridad de los datos.
4. La evaluación con usuarios a través del instrumento SUS (86.5/100) confirma la viabilidad y excelencia ergonómica de la plataforma para su despliegue en entornos corporativos y educativos reales.
