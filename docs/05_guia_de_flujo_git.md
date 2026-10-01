# Guía de Flujo de Trabajo Git (GitFlow Simplificado)

Esta guía establece el protocolo obligatorio de trabajo colaborativo con Git para los desarrolladores de **CGB Academy**.

---

## 1. Arquitectura de Ramas

```
[ main ]        <------------------------------------+ (Versión estable / Releases al final del Sprint)
   ^                                                 |
   | (merge tras validación)                         |
[ develop ]     <-------------+                      |
   ^                          | (PR + code review)   |
   |                          |                      |
[ feature/HU-xxx ]            [ bugfix/xxx ]         [ hotfix/xxx ]
(Cada desarrollador)
```

### Ramas Principales y su Propósito
- **`main`**: Contiene únicamente código estable, probado y listo para producción o entrega de sprint. **Nadie hace push directo a `main`**.
- **`develop`**: Rama base de integración y pruebas continuas. Todos los desarrolladores sincronizan sus avances aquí mediante Pull Requests (PR) para testear la integración de los 5 estadios de cada HU.
- **Ramas de función (`feature/HU-xxx-descripcion`)**: Ramas temporales creadas a partir de `develop` para implementar una historia de usuario específica.

---

## 2. Convención de Nombres de Ramas

| Tipo de Rama | Patrón | Ejemplo |
|---|---|---|
| **Historia de Usuario (Feature)** | `feature/HU-<numero>-<resumen>` | `feature/HU-001-login-interno` |
| **Corrección en Desarrollo** | `fix/HU-<numero>-<resumen>` | `fix/HU-001-validacion-correo` |
| **Pruebas / Integración** | `test/<resumen>` | `test/flujo-onboarding` |
| **Hotfix (Producción)** | `hotfix/<resumen>` | `hotfix/error-sesion` |

---

## 3. Ciclo de Vida del Desarrollo (Paso a Paso)

### Paso 1: Actualizar la rama local de integración
Antes de iniciar cualquier trabajo, asegúrate de tener la última versión de `develop`:
```bash
git checkout develop
git pull origin develop
```

### Paso 2: Crear una nueva rama para tu HU
Crea una rama descriptiva partiendo de `develop`:
```bash
git checkout -b feature/HU-001-login-interno
```

### Paso 3: Trabajar y hacer commits atómicos
Aplica las 5 fases de la metodología híbrida (Plan, UI/UX, Frontend, Backend, Test). Realiza commits descriptivos con la convención Conventional Commits:
```bash
git add .
git commit -m "feat(auth): implementar formulario y validacion de credenciales HU-001"
```

### Paso 4: Ejecutar pruebas locales
Antes de subir código, valida que los tests pasen satisfactoriamente:
```bash
python tests/test_docs_and_structure.py
```

### Paso 5: Subir la rama a GitHub
Publica tu rama en el repositorio remoto:
```bash
git push -u origin feature/HU-001-login-interno
```

### Paso 6: Crear Pull Request (PR) hacia `develop`
1. Entra a GitHub: `https://github.com/milith0kun/proyecto-ing-software`
2. Abre un **Pull Request** apuntando:
   - **Base:** `develop`
   - **Compare:** `feature/HU-001-login-interno`
3. Solicita la revisión de al menos un compañero del equipo.
4. Una vez aprobado y pasadas las pruebas automáticas, se fusiona (*Merge Pull Request*) hacia `develop`.

---

## 4. Promoción a `main` (Cierre de Sprint)

Al concluir el sprint (Día 10) y tras superar la **Sprint Review** con el Product Owner:
1. Se verifica que todos los tests pasen en `develop`.
2. El Scrum Master / Product Owner realiza un PR de `develop` hacia `main`.
3. Se genera un tag de versión:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0-sprint1 -m "Versión Sprint 1 MVP - Núcleo de capacitación"
   git push origin v1.0.0-sprint1
   ```
