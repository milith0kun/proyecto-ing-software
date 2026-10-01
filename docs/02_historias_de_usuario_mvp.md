# HISTORIAS DE USUARIO FUNCIONALES — MVP

## Sprint 1 — Núcleo de capacitación y acceso público

### HU-001 — Acceder al área interna
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **usuario interno autorizado**, quiero **iniciar sesión en el Centro de Capacitación CGB Academy**, para **acceder únicamente a las funciones y contenidos correspondientes a mi rol**.

**CA-01**  
**Dado que** el usuario interno tiene una cuenta activa,  
**cuando** ingresa correctamente sus credenciales,  
**entonces** el sistema debe permitirle acceder a su área privada.

**CA-02**  
**Dado que** las credenciales ingresadas no son válidas,  
**cuando** el usuario intenta iniciar sesión,  
**entonces** el sistema debe impedir el acceso e informarle que no pudo autenticarse.

**CA-03**  
**Dado que** el usuario autenticado tiene rol Administrador o Colaborador,  
**cuando** inicia sesión,  
**entonces** el sistema debe dirigirlo al espacio correspondiente a su rol.

---

### HU-002 — Crear una capacitación
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **crear una nueva capacitación**, para **incorporar contenido de inducción u orientación sin depender de cambios realizados por desarrollo**.

**CA-01**  
**Dado que** el Administrador se encuentra en la gestión de capacitaciones,  
**cuando** registra la información básica de una nueva capacitación,  
**entonces** el sistema debe crearla y permitir continuar con la construcción de su contenido.

**CA-02**  
**Dado que** existe una capacitación previamente creada,  
**cuando** el Administrador modifica su información general,  
**entonces** el sistema debe conservar los cambios sobre la misma capacitación sin generar una copia.

---

### HU-003 — Construir contenido mediante slides
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **crear y organizar slides dentro de una capacitación**, para **presentar la información de forma clara, progresiva e interactiva**.

**CA-01**  
**Dado que** existe una capacitación,  
**cuando** el Administrador agrega un slide,  
**entonces** debe poder incorporar contenido mediante los componentes habilitados, como texto, imágenes, listas, indicaciones, enlaces y botones de acción.

**CA-02**  
**Dado que** una capacitación contiene varios slides,  
**cuando** el Administrador modifica su orden,  
**entonces** el sistema debe presentar los slides al usuario en el nuevo orden establecido.

**CA-03**  
**Dado que** existe un slide creado,  
**cuando** el Administrador lo edita o elimina,  
**entonces** la estructura de la capacitación debe actualizarse con el cambio realizado.

---

### HU-004 — Previsualizar y publicar una capacitación
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **previsualizar y publicar una capacitación**, para **verificar su presentación antes de ponerla a disposición de sus destinatarios**.

**CA-01**  
**Dado que** el Administrador está editando una capacitación,  
**cuando** solicita su previsualización,  
**entonces** el sistema debe mostrar cómo será presentada al usuario final.

**CA-02**  
**Dado que** la capacitación aún no reúne la información mínima necesaria para publicarse,  
**cuando** el Administrador la guarda,  
**entonces** debe permanecer en estado **Borrador**.

**CA-03**  
**Dado que** la capacitación cuenta con la información requerida y al menos un slide válido,  
**cuando** el Administrador completa su configuración,  
**entonces** podrá quedar en estado **Publicada** y estar disponible según la visibilidad configurada.

**CA-04**  
**Dado que** la capacitación es pública o interna,  
**cuando** se publica,  
**entonces** únicamente debe mostrarse en el ámbito para el cual fue configurada.

---

### HU-005 — Explorar capacitaciones públicas
**Prioridad:** Alta · **MVP**

**Historia de usuario:**  
Como **usuario público**, quiero **explorar las capacitaciones disponibles sin iniciar sesión**, para **encontrar orientación sobre los procesos que necesito realizar dentro del ecosistema CGB Academy**.

**CA-01**  
**Dado que** una persona accede al Centro de Capacitación CGB Academy,  
**cuando** visita su sección pública,  
**entonces** debe visualizar las capacitaciones publicadas para acceso abierto.

**CA-02**  
**Dado que** existen contenidos destinados a diferentes públicos,  
**cuando** el usuario navega por el centro,  
**entonces** debe poder distinguir contenidos orientados a estudiantes, docentes u otras categorías públicas disponibles.

**CA-03**  
**Dado que** un colaborador ya inició sesión,  
**cuando** accede al contenido público,  
**entonces** debe poder consultarlo igualmente sin que ese consumo altere su progreso de onboarding.

---

### HU-006 — Consultar una capacitación pública
**Prioridad:** Alta · **MVP**

**Historia de usuario:**  
Como **usuario público**, quiero **recorrer los slides de una capacitación**, para **aprender cómo realizar correctamente un proceso o utilizar los servicios y plataformas de CGB Academy**.

**CA-01**  
**Dado que** el usuario selecciona una capacitación pública,  
**cuando** ingresa a ella,  
**entonces** el sistema debe mostrar los slides en el orden configurado por el Administrador.

**CA-02**  
**Dado que** un slide contiene un enlace o botón de acción,  
**cuando** el usuario lo selecciona,  
**entonces** el sistema debe ejecutar o dirigir a la acción configurada.

**CA-03**  
**Dado que** el usuario público no requiere autenticación,  
**cuando** recorre el contenido,  
**entonces** el sistema no debe exigirle una cuenta ni registrar progreso individual.

---

# Sprint 2 — Onboarding interno

### HU-007 — Administrar áreas y puestos
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **mantener las áreas y puestos utilizados por CGB Academy**, para **clasificar correctamente a los colaboradores y determinar qué onboarding les corresponde**.

**CA-01**  
**Dado que** el Administrador necesita incorporar una nueva estructura organizacional,  
**cuando** crea un área o puesto,  
**entonces** este debe quedar disponible para futuras asignaciones.

**CA-02**  
**Dado que** existe un área o puesto,  
**cuando** el Administrador modifica su información,  
**entonces** el cambio debe conservar sus relaciones existentes.

**CA-03**  
**Dado que** un área o puesto mantiene relaciones que impedirían una eliminación segura,  
**cuando** se intenta eliminar,  
**entonces** el sistema debe impedir la operación hasta que dichas relaciones sean resueltas.

---

### HU-008 — Crear rutas de onboarding
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **crear rutas de onboarding y relacionarlas con áreas o puestos**, para **definir qué conjunto de capacitaciones debe recibir cada tipo de colaborador**.

**CA-01**  
**Dado que** existen capacitaciones internas publicadas,  
**cuando** el Administrador construye una ruta,  
**entonces** debe poder incorporar las capacitaciones necesarias.

**CA-02**  
**Dado que** una ruta contiene varias capacitaciones,  
**cuando** el Administrador modifica su orden,  
**entonces** el sistema debe conservar ese orden como secuencia recomendada sin bloquear el acceso a las demás.

**CA-03**  
**Dado que** una capacitación ya existe,  
**cuando** el Administrador la incorpora a más de una ruta,  
**entonces** debe reutilizarse el mismo contenido sin necesidad de duplicarla.

**CA-04**  
**Dado que** una ruta corresponde a determinados colaboradores,  
**cuando** el Administrador la asocia a un área o puesto,  
**entonces** debe quedar disponible para quienes tengan dicha asignación.

---

### HU-009 — Registrar un colaborador
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **registrar un colaborador con sus datos mínimos y asignaciones organizacionales**, para **habilitarle el acceso al onboarding que corresponde a sus funciones**.

**CA-01**  
**Dado que** el Administrador registra un colaborador,  
**cuando** proporciona su nombre, correo y las áreas o puestos correspondientes,  
**entonces** el sistema debe crear su cuenta como Colaborador.

**CA-02**  
**Dado que** un colaborador puede cumplir más de una función,  
**cuando** el Administrador le asigna varias áreas o puestos,  
**entonces** el sistema debe considerar todas las rutas relacionadas.

**CA-03**  
**Dado que** la cuenta fue creada correctamente,  
**cuando** finaliza el registro,  
**entonces** el sistema debe enviar al correo registrado un enlace para activar su acceso.

---

### HU-010 — Activar cuenta de colaborador
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Colaborador**, quiero **activar mi cuenta mediante el enlace recibido por correo**, para **configurar mi acceso personal al Centro de Capacitación**.

**CA-01**  
**Dado que** el Administrador registró al colaborador,  
**cuando** este utiliza un enlace de activación válido,  
**entonces** el sistema debe permitirle completar la configuración de su acceso.

**CA-02**  
**Dado que** la activación se completó correctamente,  
**cuando** el colaborador vuelva a utilizar el sistema,  
**entonces** podrá autenticarse mediante su cuenta registrada.

**CA-03**  
**Dado que** el enlace utilizado ya no es válido,  
**cuando** se intenta activar una cuenta con él,  
**entonces** el sistema no debe permitir la activación.

---

### HU-011 — Consultar “Mi onboarding”
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Colaborador**, quiero **visualizar todas las capacitaciones que me corresponden**, para **conocer qué debo aprender para desarrollar correctamente mis funciones dentro de CGB Academy**.

**CA-01**  
**Dado que** el colaborador inicia sesión,  
**cuando** accede a “Mi onboarding”,  
**entonces** debe visualizar las rutas correspondientes a sus áreas y puestos asignados.

**CA-02**  
**Dado que** existen varias capacitaciones dentro de una ruta,  
**cuando** se muestra el onboarding,  
**entonces** el colaborador debe poder ingresar a cualquiera de ellas sin bloqueos secuenciales.

**CA-03**  
**Dado que** el colaborador ha avanzado en sus capacitaciones,  
**cuando** consulta su onboarding,  
**entonces** debe visualizar el progreso general y el estado de cada capacitación.

---

### HU-012 — Completar una capacitación interna
**Prioridad:** Crítica · **MVP**

**Historia de usuario:**  
Como **Colaborador**, quiero **recorrer una capacitación y conservar automáticamente mi avance**, para **continuar mi inducción sin perder lo que ya he realizado**.

**CA-01**  
**Dado que** el colaborador inicia una capacitación asignada,  
**cuando** recorre sus slides,  
**entonces** el sistema debe registrar su avance.

**CA-02**  
**Dado que** el colaborador abandona una capacitación antes de terminarla,  
**cuando** vuelve posteriormente,  
**entonces** debe conservarse el avance alcanzado.

**CA-03**  
**Dado que** una capacitación no contiene microtest,  
**cuando** el colaborador completa todo su contenido requerido,  
**entonces** el sistema debe marcarla automáticamente como **Completada**.

**CA-04**  
**Dado que** todas las capacitaciones asignadas al colaborador están completadas,  
**cuando** el sistema recalcula su progreso,  
**entonces** debe marcar su onboarding como completado y mostrarle un aviso de finalización.

---

# Sprint 3 — Refuerzo y seguimiento

### HU-013 — Configurar un microtest
**Prioridad:** Alta · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **añadir opcionalmente preguntas de refuerzo a una capacitación**, para **ayudar al colaborador a comprobar y reforzar lo aprendido**.

**CA-01**  
**Dado que** el Administrador edita una capacitación,  
**cuando** activa el microtest,  
**entonces** debe poder registrar varias preguntas con sus alternativas y respuesta correcta.

**CA-02**  
**Dado que** el microtest es opcional,  
**cuando** el Administrador no lo activa,  
**entonces** la capacitación debe funcionar y poder completarse únicamente mediante su contenido.

**CA-03**  
**Dado que** una pregunta tiene información adicional de aprendizaje,  
**cuando** el Administrador la configura,  
**entonces** podrá registrar una explicación asociada a su respuesta.

---

### HU-014 — Realizar un microtest de refuerzo
**Prioridad:** Alta · **MVP**

**Historia de usuario:**  
Como **Colaborador**, quiero **responder preguntas y conocer inmediatamente la respuesta correcta**, para **reforzar lo aprendido sin que el test se convierta en una evaluación académica rígida**.

**CA-01**  
**Dado que** la capacitación tiene un microtest habilitado,  
**cuando** el colaborador responde una pregunta,  
**entonces** el sistema debe indicarle cuál es la respuesta correcta.

**CA-02**  
**Dado que** existe una explicación configurada,  
**cuando** se muestra el resultado de la pregunta,  
**entonces** el sistema debe presentar también dicha explicación.

**CA-03**  
**Dado que** el microtest tiene finalidad formativa,  
**cuando** el colaborador responde sus preguntas,  
**entonces** el sistema no debe exigir una nota o porcentaje mínimo de aprobación.

**CA-04**  
**Dado que** el colaborador respondió todas las preguntas requeridas,  
**cuando** finaliza el microtest,  
**entonces** esa condición debe contar para completar la capacitación.

---

### HU-015 — Consultar avance de colaboradores
**Prioridad:** Alta · **MVP**

**Historia de usuario:**  
Como **Administrador**, quiero **consultar el avance de los colaboradores**, para **conocer de manera simple quién terminó su onboarding y quién aún se encuentra en proceso**.

**CA-01**  
**Dado que** existen colaboradores con actividad registrada,  
**cuando** el Administrador abre el seguimiento,  
**entonces** debe visualizar un resumen simple de colaboradores completados y en progreso.

**CA-02**  
**Dado que** se presenta el listado de colaboradores,  
**cuando** el Administrador lo consulta,  
**entonces** debe visualizar como mínimo su identificación, área/puesto y estado de avance.

**CA-03**  
**Dado que** el Administrador selecciona un colaborador,  
**cuando** consulta su detalle,  
**entonces** debe poder revisar sus rutas, capacitaciones y estados registrados.

---

# HISTORIAS FUNCIONALES POSTERIORES AL MVP

### HU-016 — Buscar capacitaciones públicas
**Prioridad:** Media · **Sprint posterior**

**Historia de usuario:**  
Como **usuario público**, quiero **buscar capacitaciones mediante texto**, para **encontrar rápidamente la orientación que necesito sin recorrer manualmente todo el contenido**.

**CA-01**  
**Dado que** existen capacitaciones públicas,  
**cuando** el usuario ingresa un término de búsqueda,  
**entonces** el sistema debe mostrar contenidos públicos relacionados.

**CA-02**  
**Dado que** no existen coincidencias,  
**cuando** se realiza la búsqueda,  
**entonces** el sistema debe informar que no encontró contenido relacionado.

---

### HU-017 — Actualizar áreas o puestos de un colaborador
**Prioridad:** Media

**Historia de usuario:**  
Como **Administrador**, quiero **modificar las áreas o puestos asignados a un colaborador**, para **adaptar su capacitación cuando sus funciones dentro de la organización cambien**.

**CA-01**  
**Dado que** un colaborador cambia de función,  
**cuando** el Administrador modifica sus áreas o puestos,  
**entonces** el sistema debe actualizar las rutas activas que le corresponden.

**CA-02**  
**Dado que** el colaborador ya realizó capacitaciones anteriormente,  
**cuando** cambia su asignación,  
**entonces** el sistema debe conservar el progreso histórico ya obtenido.

---

### HU-018 — Propagar cambios de una ruta
**Prioridad:** Media

**Historia de usuario:**  
Como **Administrador**, quiero **que los cambios realizados en una ruta se apliquen automáticamente a sus colaboradores**, para **mantener actualizado el onboarding sin realizar asignaciones manuales usuario por usuario**.

**CA-01**  
**Dado que** el Administrador agrega una nueva capacitación a una ruta,  
**cuando** guarda el cambio,  
**entonces** esta debe aparecer automáticamente en los colaboradores que tengan esa ruta.

**CA-02**  
**Dado que** la incorporación modifica la cantidad total de contenido requerido,  
**cuando** se actualiza la ruta,  
**entonces** el porcentaje general de avance de los colaboradores afectados debe recalcularse.

**CA-03**  
**Dado que** una misma capacitación pertenece a dos rutas del mismo colaborador,  
**cuando** este ya la completó,  
**entonces** debe contabilizarse una sola vez y conservar su estado completado.

---

### HU-019 — Solicitar nueva revisión de contenido actualizado
**Prioridad:** Media

**Historia de usuario:**  
Como **Administrador**, quiero **indicar cuándo una actualización importante requiere revisar nuevamente una capacitación**, para **asegurar que los colaboradores conozcan los cambios relevantes**.

**CA-01**  
**Dado que** el Administrador realiza únicamente una modificación menor,  
**cuando** guarda el cambio sin solicitar nueva revisión,  
**entonces** los colaboradores que ya terminaron la capacitación deben conservar su estado completado.

**CA-02**  
**Dado que** el cambio realizado es relevante,  
**cuando** el Administrador marca que requiere nueva revisión,  
**entonces** la capacitación debe aparecer nuevamente como pendiente para los colaboradores afectados.

---

### HU-020 — Eliminar definitivamente un colaborador
**Prioridad:** Media

**Historia de usuario:**  
Como **Administrador**, quiero **eliminar definitivamente la cuenta de un colaborador**, para **retirar del sistema a las personas que ya no forman parte de la organización**.

**CA-01**  
**Dado que** el Administrador selecciona un colaborador,  
**cuando** solicita eliminarlo,  
**entonces** el sistema debe requerir confirmación antes de ejecutar la acción irreversible.

**CA-02**  
**Dado que** la eliminación ha sido confirmada,  
**cuando** el sistema procesa la operación,  
**entonces** el usuario no debe poder volver a iniciar sesión con dicha cuenta.

---

### HU-021 — Eliminar una capacitación
**Prioridad:** Media

**Historia de usuario:**  
Como **Administrador**, quiero **eliminar definitivamente una capacitación que ya no se utilizará**, para **mantener vigente el contenido disponible en el Centro de Capacitación**.

**CA-01**  
**Dado que** el Administrador decide eliminar una capacitación,  
**cuando** confirma la operación,  
**entonces** su contenido debe dejar de estar disponible para nuevos accesos.

**CA-02**  
**Dado que** existen colaboradores que completaron esa capacitación antes de eliminarla,  
**cuando** el contenido es eliminado,  
**entonces** su registro histórico de realización debe mantenerse visible.

---

### HU-022 — Notificar nuevo contenido por correo
**Prioridad:** Baja

**Historia de usuario:**  
Como **Colaborador**, quiero **recibir un aviso cuando se me incorpore nuevo contenido de onboarding**, para **conocer que tengo información adicional disponible para revisar**.

**CA-01**  
**Dado que** una nueva capacitación queda asignada al colaborador,  
**cuando** el sistema actualiza su onboarding,  
**entonces** podrá enviar una notificación al correo registrado.

**CA-02**  
**Dado que** el envío del correo presenta un error,  
**cuando** la capacitación ya fue asignada correctamente,  
**entonces** el fallo del correo no debe impedir que el contenido aparezca en “Mi onboarding”.

---

### HU-023 — Consultar una ruta pública recomendada
**Prioridad:** Baja

**Historia de usuario:**  
Como **usuario público nuevo**, quiero **seguir una ruta recomendada de contenidos**, para **saber por dónde empezar sin tener que conocer previamente la estructura del centro de capacitación**.

**CA-01**  
**Dado que** existe una ruta pública tipo “Empieza aquí”,  
**cuando** el usuario accede a ella,  
**entonces** debe visualizar los contenidos recomendados en un orden comprensible.

**CA-02**  
**Dado que** la navegación pública es libre,  
**cuando** el usuario se encuentra dentro de una ruta recomendada,  
**entonces** debe poder abandonar ese recorrido y consultar cualquier otro contenido público.

---

