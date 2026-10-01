# REQUERIMIENTOS NO FUNCIONALES

Estos **no los convierto artificialmente en historias de usuario**.

### RNF-001 — Diseño responsive
La plataforma debe poder utilizarse adecuadamente desde computadora y dispositivos móviles.

**Criterio verificable:** las vistas públicas, autenticación, onboarding, slides y administración deben adaptar su distribución al tamaño de pantalla sin impedir las funciones principales.

### RNF-002 — Idioma
Toda la primera versión estará disponible únicamente en **español**.

**Criterio verificable:** la interfaz funcional del MVP no requerirá selección de idioma ni administración de traducciones.

### RNF-003 — Infraestructura objetivo
El sistema debe estar preparado para operar inicialmente sobre una VPS aproximada de **2 vCPU y 8 GB de RAM**.

**Criterio verificable:** las funcionalidades del MVP deberán poder desplegarse en esta infraestructura sin depender de servicios de procesamiento pesado.

### RNF-004 — Contenido ligero
El sistema priorizará texto, imágenes optimizadas y componentes interactivos ligeros.

**Criterio verificable:** el editor inicial no almacenará videos ni ofrecerá una biblioteca de archivos descargables.

### RNF-005 — Seguridad de acceso interno
Las funcionalidades internas no deberán estar disponibles para usuarios públicos.

**Criterio verificable:** intentar acceder a una sección interna sin una sesión válida deberá redirigir al proceso de autenticación o impedir el acceso.

### RNF-006 — Protección de credenciales
Las credenciales utilizadas por los usuarios internos deben gestionarse de forma segura.

**Criterio verificable:** las contraseñas no deben almacenarse ni exponerse como texto legible, y los enlaces de activación no deben poder reutilizarse después de completar correctamente la activación.

### RNF-007 — Minimización de datos personales
La plataforma almacenará únicamente la información necesaria para la capacitación.

**Criterio verificable:** para un colaborador no será obligatorio registrar datos como DNI, teléfono, dirección o fecha de nacimiento; el perfil operativo utilizará nombre, correo, rol y asignaciones organizacionales.

### RNF-008 — Consistencia visual
Las interfaces deberán mantener una presentación coherente con la identidad de **CGB Academy**.

**Criterio verificable:** los contenidos creados mediante slides utilizarán componentes visuales definidos por la plataforma y no requerirán que el Administrador diseñe manualmente cada pantalla.

### RNF-009 — Facilidad de administración
La creación de capacitaciones debe poder realizarse sin conocimientos de programación.

**Criterio verificable:** el Administrador podrá crear y ordenar slides mediante formularios y controles de interfaz, sin editar código.

### RNF-010 — Integridad de información
Las operaciones administrativas no deberán dejar relaciones funcionales inconsistentes.

**Criterio verificable:** el sistema deberá impedir eliminaciones de áreas, puestos u otros elementos cuando la operación deje asignaciones activas sin resolver.

