# Centro de Capacitación e Inducción — CGB Academy
**Proyecto de Ingeniería de Software — Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
*Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica | Semestre 2026-I*

---

## 👥 Equipo de Trabajo y Roles (Sprint 1)

El equipo aplica una política de **roles rotativos por sprint** para alternar responsabilidades de liderazgo y gestión:

| N° | Integrante | Rol en Sprint 1 | Rama de Trabajo Personal |
|---|---|---|---|
| 1 | **Saire Bustamante, Edmil Jampier** | **Product Owner** (Sprint 1) / Dev Full-Stack | `edmil-saire` (Rama Principal / Main) |
| 2 | **Barazorda Cuellar, Hector** | **Scrum Master** (Sprint 1) / Dev Full-Stack | `hector-barazorda` |
| 3 | **Carpio Hermoza, Alex** | **Desarrollador Full-Stack** | `alex-carpio` |
| 4 | **Quispe Mamani, Domingo de Guzman** | **Desarrollador Full-Stack** | `domingo-quispe` |
| 5 | **Ticona Jancco, Ronaldo** | **Desarrollador Full-Stack** | `ronaldo-ticona` |

> [!NOTE]
> Al concluir el Sprint 1 (en la sesión de Retrospectiva), se evalúa el desempeño de la dinámica de trabajo y se acuerda la rotación de los roles de Product Owner y Scrum Master hacia los demás integrantes para los siguientes sprints.

---

## 🛠️ Pila Tecnológica (Stack de Arquitectura)

De acuerdo a la arquitectura técnica del sistema:

```
[ Base de Datos: MongoDB Atlas ] 
               ▲
               │  (Conector MongoDB)
     [ ORM: Prisma ] 
               ▲
               │  (Acceso tipado en TypeScript)
[ Framework Full-Stack: Next.js (App Router) ]
         ├── Backend: Route Handlers (/app/api/...)
         └── Frontend: React Components (SSR / Client)
               ▲
               │
     [ App Web Next.js ]
```

- **Base de Datos:** MongoDB Atlas (Cloud NoSQL DB documental).
- **ORM / Mapeo de Datos:** Prisma ORM (`provider = "mongodb"` en `schema.prisma`).
- **Arquitectura Full-Stack:** Next.js con App Router unificando Backend (APIs y lógica) y Frontend (vistas responsivas e interactivas).
- **Estilos:** TailwindCSS / CSS Moderno adaptativo.
- **Plataforma:** Aplicación Web Next.js.

---

## 🌿 Arquitectura y Flujo de Ramas en Git

El repositorio opera bajo un esquema colaborativo diseñado para testear los avances antes de pasar a la rama principal:

```
[ edmil-saire ] (MAIN / PRODUCCIÓN - Siempre estable y sin errores)
       ▲
       │  (Merge tras validación completa del equipo)
[ desarrollo ]  (DESARROLLO - Testeo conjunto y unión de todos los devs)
       ▲
       ├── [ hector-barazorda ]  (Pull Request individual con cuenta de GitHub)
       ├── [ alex-carpio ]       (Pull Request individual con cuenta de GitHub)
       ├── [ domingo-quispe ]    (Pull Request individual con cuenta de GitHub)
       ├── [ edmil-saire ]       (Desarrollo de historias individuales)
       └── [ ronaldo-ticona ]    (Pull Request individual con cuenta de GitHub)
```

### 📋 Guía Rápida para cada Desarrollador:

1. **Situarse en su rama y traer lo último de desarrollo:**
   ```bash
   git checkout <tu-nombre-de-rama>
   git pull origin desarrollo
   ```
2. **Desarrollar y subir cambios con su cuenta de GitHub:**
   ```bash
   git add .
   git commit -m "feat(modulo): avance de la funcionalidad HU-xxx"
   git push origin <tu-nombre-de-rama>
   ```
3. **Crear Pull Request en GitHub:**
   - **Base:** `desarrollo` $\leftarrow$ **Compare:** `<tu-nombre-de-rama>`
4. **Testeo en `desarrollo`:**
   El equipo prueba conjuntamente que la unión de componentes y endpoints funcione sin fallos.
5. **Pase a la rama principal (`edmil-saire`):**
   Una vez probado y libre de errores en `desarrollo`, el Scrum Master / Product Owner realiza la integración final a `edmil-saire`.

---

## 📁 Estructura del Repositorio

```
Proyecto Doctores Ing de Sotfware/
├── README.md                           # Documentación principal, stack y flujo Git
├── .gitignore                          # Exclusión de archivos temporales
├── CGB_Academy_Requerimientos_...pdf   # Documento oficial de 18 páginas de requisitos
├── Estructura del informe (1).docx     # Guía oficial del informe (Word)
└── informe/
    ├── informe.md                      # Informe completo en Markdown
    ├── informe.tex                     # Plantilla oficial en LaTeX (UNSAAC)
    ├── informe.pdf                     # PDF compilado y verificado (11 páginas)
    ├── referencias.bib                 # Bibliografía académica en BibTeX
    └── Estructura del informe.docx     # Documento base de referencia
```