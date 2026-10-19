# INFORME DE LABORATORIO N° 2
## Agile Inception del Sistema de Gestión de Capacitaciones (CIIP Latam)

---

### Datos Generales e Integrantes del Grupo
* **Universidad:** Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)
* **Facultad:** Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica
* **Escuela Profesional:** Ingeniería Informática y de Sistemas
* **Curso:** Ingeniería de Software
* **Docente:** Ing. Lisha Sabah Diaz Caceres
* **Semestre Académico:** 2026-I

#### Integrantes:
| N° | Apellidos y Nombres | Código Estudiantil | Correo Institucional |
| :---: | :--- | :---: | :--- |
| 1 | Barazorda Cuellar, Hector | 145003 | [145003@unsaac.edu.pe](mailto:145003@unsaac.edu.pe) |
| 2 | Carpio Hermoza, Alex | 164563 | [164563@unsaac.edu.pe](mailto:164563@unsaac.edu.pe) |
| 3 | Quispe Mamani, Domingo de Guzman | 191978 | [191978@unsaac.edu.pe](mailto:191978@unsaac.edu.pe) |
| 4 | Saire Bustamante, Edmil Jampier | 174449 | [174449@unsaac.edu.pe](mailto:174449@unsaac.edu.pe) |
| 5 | Ticona Jancco, Ronaldo | 211816 | [211816@unsaac.edu.pe](mailto:211816@unsaac.edu.pe) |

---

## 1. Objetivo
Definir la visión del sistema, los stakeholders departamentales, los objetivos y el alcance inicial del proyecto de **Gestión de Capacitaciones de CIIP Latam** mediante técnicas de **Agile Inception**, articulando de manera integrada las áreas de **Académica**, **Ventas** (asesores comerciales), **Marketing** y **Finanzas**, con el fin de centralizar la información institucional y optimizar el ciclo de vida formativo para estudiantes y docentes.

---

## 2. Fundamento Teórico

### 2.1. Agile Inception
El **Agile Inception** es la fase inicial y colaborativa de un proyecto de software (desarrollada habitualmente en el *Sprint 0*). Su meta no es redactar especificaciones rígidas ni documentos voluminosos que queden obsoletos, sino construir un entendimiento compartido entre los desarrolladores y las diferentes unidades organizacionales sobre:
* **El propósito estratégico:** Comprender la necesidad de transformar procesos manuales y dispersos en un flujo digital unificado.
* **El alcance del MVP (*Minimum Viable Product*):** Priorizar las funciones transversales que brinden valor inmediato a las operaciones de la institución.
* **La alineación interdepartamental:** Eliminar los silos de información que habitualmente separan a las áreas de ventas, gestión académica y finanzas.

### 2.2. Stakeholders
En una organización de formación profesional, los *stakeholders* o partes interesadas involucran a diversos actores internos y externos:
* **Área Académica:** Vela por la calidad de los planes de estudio, la asignación docente y el cumplimiento pedagógico.
* **Área de Ventas (Asesores Comerciales):** Busca agilidad para atender prospectos, registrar matrículas y alcanzar metas comerciales.
* **Área de Marketing:** Requiere datos actualizados de los programas para diseñar campañas y captar nuevos alumnos.
* **Área de Finanzas:** Exige control estricto de cobranzas, validación de comprobantes, facturación y reportes de rentabilidad.
* **Estudiantes y Docentes:** Actores clave que demandan una plataforma clara, accesible y confiable.

### 2.3. Visión del Producto
La visión del sistema sintetiza en una declaración concisa (*Elevator Pitch*) a quién está dirigido el software, qué problemas organizacionales resuelve, cuál es la propuesta de valor integral y en qué supera a la gestión tradicional fragmentada en hojas de cálculo o chats no integrados.

### 2.4. Experiencia de Usuario (UX) y Arquitectura de la Información
La arquitectura de la información organiza los módulos para reducir la carga cognitiva del usuario:
* **Control de Acceso Basado en Roles (RBAC):** Vistas y herramientas adaptadas a las tareas de asesores, coordinadores académicos y analistas financieros.
* **Portal del Estudiante Mobile-First:** Una interfaz pública y privada intuitiva que permita explorar el catálogo de cursos, completar la matrícula en línea y acceder a sus constancias sin barreras técnicas.

---

## 3. Caso Práctico: Sistema de Capacitaciones CIIP Latam
**CIIP Latam** (Centro de Investigación e Innovación Profesional) es una institución dedicada a brindar cursos, diplomados y talleres de actualización a profesionales y estudiantes en diversas disciplinas en América Latina.

### Diagnóstico de la Situación Actual
Actualmente, las operaciones de CIIP Latam se gestionan mediante herramientas independientes y no comunicadas entre sí:
1. **Desarticulación entre Ventas y Académica:** Los asesores de ventas reciben consultas por WhatsApp y matriculan alumnos sin visibilidad directa sobre si el área académica ha completado el aforo del grupo o si el docente está confirmado.
2. **Cuello de botella en Finanzas:** La validación de pagos se realiza revisando comprobantes de transferencias bancarias o Yape en chats individuales, provocando demoras en la emisión de boletas y activación de matrículas.
3. **Falta de sincronización con Marketing:** Las campañas publicitarias promocionan cursos con temarios o fechas que a veces sufren cambios no notificados por la coordinación académica.
4. **Insatisfacción del Alumno:** El estudiante debe esperar confirmaciones manuales por correo o chat para conocer el estado de su matrícula y los enlaces de sus clases.

El sistema web centralizará todas estas áreas en una sola plataforma de gestión integral.

---

## 4. Desarrollo de las Actividades

### Parte 1: Identificación y Caracterización de Stakeholders

Se identificaron y analizaron los actores clave del sistema, divididos en las áreas organizacionales internas de CIIP Latam y los usuarios del servicio:

#### Matriz Detallada de Stakeholders

| Stakeholder / Área | Rol y Responsabilidad | Nivel de Interés | Nivel de Influencia | Necesidades y Expectativas Clave del Sistema |
| :--- | :--- | :---: | :---: | :--- |
| **Área Académica (Coordinación CIIP)** | Responsable del diseño curricular, apertura de programas, asignación de docentes y seguimiento del dictado. | **Alto** | **Alta** | • Crear y actualizar cursos, temarios y fechas de inicio.<br>• Asignar docentes y gestionar aforos máximos por grupo.<br>• Supervisar listas de asistencia y actas de notas.<br>• Generar constancias y certificados modulares. |
| **Área de Ventas (Asesores Comerciales)** | Encargados del contacto con prospectos, resolución de dudas y cierre de matrículas. | **Alto** | **Alta** | • Registro y seguimiento ágil de prospectos (*leads*).<br>• Visualizar en vivo el catálogo oficial y vacantes por curso.<br>• Registrar inscripciones y asociarlas al asesor correspondiente.<br>• Historial de contacto y comunicación con el cliente. |
| **Área de Marketing** | Responsable de la promoción institucional, diseño de campañas y difusión de la oferta académica. | **Medio-Alto** | **Media** | • Catálogo web público sincronizado automáticamente con la oferta académica.<br>• Enlaces de seguimiento para medir efectividad de campañas.<br>• Métricas de interés por programa y perfil de postulantes. |
| **Área de Finanzas** | Encargada del control de ingresos, validación de comprobantes, facturación y liquidación de costos. | **Alto** | **Alta** | • Validación centralizada de pagos (transferencias, Yape/Plin, tarjetas).<br>• Emisión y registro de boletas o facturas electrónicas.<br>• Reporte consolidado de ingresos y saldos pendientes. |
| **Estudiantes y Profesionales** | Clientes finales que buscan capacitarse y obtener certificaciones con respaldo profesional. | **Alto** | **Media** | • Explorar la oferta académica detallada desde cualquier dispositivo.<br>• Registro y matrícula sencilla con carga digital de comprobante de pago.<br>• Panel personal con sus cursos activos, notas y certificados. |
| **Docentes / Instructores** | Especialistas que imparten los cursos y talleres de capacitación. | **Medio-Alto** | **Baja-Media**| • Visualizar la nómina oficial de estudiantes matriculados.<br>• Acceso al cronograma de sesiones y enlaces de clase.<br>• Módulo de registro de asistencia y calificaciones. |

---

### Parte 2: Declaración de la Visión del Producto

Aplicando el formato estándar de *Product Vision Pitch*, se definió la visión global del sistema:

* **Para:** Profesionales, estudiantes y organizaciones que buscan capacitarse y actualizarse continuamente, junto al equipo operativo de CIIP Latam.
* **El sistema:** Sistema Web Integral de Gestión de Capacitaciones de CIIP Latam.
* **Que permite:** Centralizar en tiempo real la administración académica, el seguimiento comercial de ventas, la promoción de marketing y el control financiero de cobranzas en una sola plataforma institucional.
* **A diferencia de:** La administración manual y fragmentada basada en múltiples hojas de cálculo, chats dispersos de WhatsApp y falta de comunicación entre las áreas de académica, ventas y finanzas, lo que provoca demoras, información desfasada y pérdida de alumnos.

---

### Parte 3: Identificación y Gestión de Riesgos

El análisis preventivo de riesgos consideró los puntos de fricción comunes en la gestión de capacitaciones:

#### Matriz de Riesgos y Plan de Mitigación Técnica

| Código | Riesgo Identificado | Probabilidad | Impacto | Consecuencia Organizacional | Estrategia de Mitigación Técnica en el Software |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **R-01** | **Baja adopción del sistema** | Media | Alto | Asesores de ventas o coordinadores prefieren seguir usando sus libretas o Excel personales por resistencia al cambio. | • Diseñar una interfaz limpia con registro rápido de matrículas (menos de 1 minuto).<br>• Vistas segmentadas por rol para no saturar al usuario con herramientas de otras áreas. |
| **R-02** | **Fallas en la concurrencia de inscripciones** | Media | Crítico | Dos asesores matriculan en el último cupo disponible de un grupo al mismo tiempo ocasionando sobreaforo. | • Bloqueo transaccional temporal en la base de datos (*optimistic locking* en PostgreSQL).<br>• Actualización en vivo del aforo disponible por curso. |
| **R-03** | **Desactualización de la información** | Alta | Medio | Se promocionan en redes sociales fechas, docentes o temarios desfasados respecto a lo programado por coordinación. | • Catálogo web público que consume directamente la API del módulo académico centralizado (*Single Source of Truth*). |
| **R-04** | **Inconsistencia en la conciliación de pagos** | Alta | Alto | Comprobantes bancarios duplicados o errores en la verificación manual de transferencias en Finanzas. | • Bandeja de revisión rápida de comprobantes en el módulo de Finanzas.<br>• Validación automática de números de operación bancaria duplicados en la base de datos. |

---

## 5. Entregables del Laboratorio

1. **Documento de Visión del Producto:**  
   Declaración estructurada con alcance, público objetivo y factor diferenciador frente a canales informales.
2. **Lista de Stakeholders:**  
   Matriz de interesados que clasifica a Académica, Ventas, Marketing, Finanzas, Alumnos y Docentes según interés, influencia y necesidades funcionales.
3. **Riesgos Iniciales:**  
   Catálogo de contingencias analizadas con sus respectivas medidas de mitigación técnica en la arquitectura del software.

---

## 6. Reflexión Crítica sobre Control de Versiones

### ¿Por qué Git es crítico en proyectos colaborativos?
En un sistema empresarial que abarca módulos tan diversos como el módulo académico, el embudo comercial de ventas, el catálogo público y el módulo de cobranzas, Git es indispensable porque:
* **Desarrollo modular paralelo:** Permite que distintos desarrolladores programen en paralelo sobre ramas independientes (por ejemplo: `feature/modulo-academico`, `feature/crm-ventas`, `feature/modulo-finanzas`) sin interferir entre sí ni arriesgar el código funcional.
* **Control de versiones distribuido:** Cada programador mantiene una copia íntegra del repositorio localmente, permitiendo probar y depurar su módulo antes de proponer su incorporación a la rama principal (`main`).
* **Trazabilidad y auditoría:** Toda modificación queda registrada con fecha, hora, autor y descripción del cambio, facilitando auditar qué regla de negocio o componente fue alterado y por qué motivo.

### ¿Qué problemas específicos evita el uso de Git?
1. **Sobreescritura accidental entre módulos:** Impide que los cambios del desarrollador del módulo de ventas eliminen accidentalmente las validaciones agregadas por el desarrollador de finanzas.
2. **Reversibilidad inmediata ante fallos:** Si un despliegue introduce un error crítico en el cálculo de pagos o en la asignación de cursos, es posible regresar a la versión estable previa en segundos con `git revert` o `git reset`.
3. **Eliminación del caos de versiones manuales:** Reemplaza definitivamente las carpetas informales como `capacitaciones_v1_finanzas.zip` o `sistema_con_ventas_final.rar` por un historial ordenado y profesional.
4. **Revisión colaborativa previa al despliegue:** A través de *Pull Requests*, el equipo puede revisar y validar el código de otros integrantes para asegurar estándares de calidad y seguridad antes de que llegue a producción.

---

## 7. Trabajo Extra: Investigación de Soluciones Similares

Para enriquecer la etapa de concepción ágil, se analizaron dos enfoques comunes en la gestión de programas educativos y se contrastaron con la solución propuesta para **CIIP Latam**:

### Tabla Comparativa de Soluciones

| Criterio de Análisis | LMS Tradicional (ej. Moodle) | ERP Educativo Genérico | Sistema a Medida CIIP Latam (Next.js + PostgreSQL) |
| :--- | :--- | :--- | :--- |
| **Enfoque Principal** | Gestión del aula virtual, foros, tareas y material didáctico. | Gestión administrativa escolar clásica (colegios o universidades formales). | **Gestión integral orientada a la capacitación continua: ventas, finanzas, académica y alumnos.** |
| **Módulo de Ventas / CRM** | Inexistente; requiere integraciones complejas externas. | Muy rígido y poco adaptado a la venta rápida de cursos cortos y diplomados. | **Diseñado a la medida del embudo comercial de los asesores de CIIP Latam.** |
| **Módulo Financiero Local** | Soporte limitado a pasarelas globales (PayPal/Stripe). | Procesos bancarios tradicionales pesados. | **Soporte ágil para pagos locales (Yape, Plin, transferencias con validación rápida).** |
| **Articulación de Áreas** | Los asesores de ventas y marketing no tienen acceso a la plataforma. | Difícil de personalizar; interfaces sobrecargadas y lentas. | **Paneles diferenciados por rol (Académica, Ventas, Marketing, Finanzas) conectados a una sola base de datos.** |
| **Experiencia del Alumno (UX)** | Interfaz densa, académica tradicional y poco atractiva en móviles. | Poco amigable para el usuario contemporáneo. | **Interfaz moderna, ligera, Mobile-First y de carga rápida.** |

### Recomendaciones Técnicas y de Negocio Adoptadas para CIIP Latam
1. **Arquitectura Modular:** Desacoplar el módulo comercial de ventas del aula virtual, sincronizando las etapas mediante estados de matrícula transparentes.
2. **Bandeja de validación para Finanzas:** Implementar una vista estilo bandeja de entrada donde Finanzas pueda validar pagos con un solo clic, notificando automáticamente a Académica para la activación del alumno.
3. **Stack Tecnológico:** Uso de **Next.js** para la aplicación frontend y API, con base de datos **PostgreSQL** para asegurar la integridad transaccional de los pagos y las matrículas.

---

## 8. Conclusiones
* La ejecución de la sesión de **Agile Inception** permitió conceptualizar con éxito el sistema como una plataforma integral de gestión de capacitaciones, articulando coordinadamente las áreas de Académica, Ventas, Marketing y Finanzas de CIIP Latam.
* Se definió un flujo de valor institucional completo que inicia en la prospección comercial de ventas y concluye en la certificación académica del estudiante.
* La caracterización de los stakeholders y sus puntos de contacto identificó mecanismos de software concretos para erradicar el desorden actual provocado por el uso aislado de hojas de cálculo y WhatsApp.
* El análisis de riesgos y la investigación de soluciones proporcionan una hoja de ruta rigurosa para emprender el desarrollo del MVP con altos estándares de calidad, seguridad y usabilidad.
