# Requisitos aplicados — CGB Academy

**Fuente:** `Diapos/4. Requisitos.pdf` (Ingeniería de Software I, UNSAAC).
**Corte:** 17/11/2026. **Estado:** propuesta del equipo. Lo marcado **«decisión del PO»** no está aprobado y no se debe tratar como requisito vigente. El estado de las historias cambia: verificar Jira antes de citarlo.

## 1. Qué toma el equipo del PDF

| Concepto del PDF | Regla para este repositorio |
|---|---|
| Historia = Tarjeta + Conversación + Confirmación | Tarjeta: la historia en Jira. Conversación: lo acordado con el PO, registrado en Jira. Confirmación: criterios de aceptación en Dado/Cuando/Entonces, cada uno con su prueba. |
| Formato «Como [usuario], quiero [acción], para [objetivo]» | El usuario debe ser un actor real: Administrador, Colaborador o Público. «Sistema» no es un usuario. |
| INVEST | Independiente, negociable, valiosa, estimable, pequeña y comprobable. Una historia que solo se puede comprobar con otra se declara con un vínculo *Blocks* en Jira. |
| Criterios de aceptación ≠ criterios de terminado | Los primeros son de cada historia (requisitos funcionales). La DoD (`docs/definition-of-done.md`) es del equipo e incluye los requisitos no funcionales. |
| Casos de uso | Solo para flujos con varios pasos, extensiones o sistemas externos. No describen interfaz ni algoritmos. |
| MVP | Es un experimento para validar una hipótesis, no la «versión 1». |
| Exceso de funcionalidades | Se evita: lo que no está en el alcance del MVP no se construye (sección 6). |

## 2. Lista común para cada historia

Se aplica además de la Definition of Ready de `docs/FLUJO_DE_TRABAJO.md`.

1. El «Como…» nombra a un actor real.
2. Hay conversación registrada con el PO y la decisión sobre cada criterio dudoso.
3. Los criterios de aceptación son observables y cada uno tiene una prueba.
4. INVEST: dependencias declaradas, tamaño de un sprint y comprobable.
5. Los RNF aplicables están listados en la historia (matriz de la sección 3) y se comprueban en la DoD.
6. Caso de uso solo si el flujo es complejo (sección 5).

## 3. Matriz RNF × HU (propuesta)

RNF de `informe/informe.md` §5.3. ● aplica, ○ aplica en parte. Las filas de HU-013 y HU-014 se confirman al refinarlas: sus criterios no se revisaron para esta tabla.

| RNF | HU-007 CGB-31 | HU-008 CGB-36 | HU-009 CGB-41 | HU-010 CGB-46 | HU-011 CGB-51 | HU-012 CGB-56 | HU-013 CGB-61 | HU-014 CGB-66 |
|---|---|---|---|---|---|---|---|---|
| RNF-001 Responsive | ● | ● | ● | ● | ● | ● | ● | ● |
| RNF-002 Español | ● | ● | ● | ● | ● | ● | ● | ● |
| RNF-003 Infraestructura | Global | Global | Global | Global | Global | Global | Global | Global |
| RNF-004 Contenido ligero (< 1,5 s) |  |  |  |  | ● | ● |  | ● |
| RNF-005 Acceso interno | ● | ● | ● | ○ | ● | ● | ● | ● |
| RNF-006 Credenciales | | | ○ | ● | | | | |
| RNF-007 Minimización de datos | | | ● | ● | ● | ● | | |
| RNF-008 Consistencia visual | ● | ● | ● | ● | ● | ● | ● | ● |
| RNF-009 Administración sin código | | ○ | | | | | ● | |
| RNF-010 Integridad | ● | ○ | | | | ● | | |

Notas: en HU-010 el acceso es público hasta validar el token, por eso RNF-005 es parcial. RNF-003 se verifica una vez por entrega, no por historia.

## 4. Conflictos entre requisitos (decisión del PO)

| # | Conflicto | Fuentes | Pregunta para el PO |
|---|---|---|---|
| 1 | **DNI.** RNF-007 pide descartar datos sensibles como el DNI, pero HU-009 CA-01 lo exige en el registro. | `informe/informe.md` §5.3; Jira CGB-41; rama `feature/CGB-41-registrar-colaboradores` | ¿Se registra el DNI? Si sí, se corrige RNF-007; si no, se corrige HU-009 y el código. |
| 2 | **Borrado de áreas.** RNF-010 pide bloquear el borrado de áreas o puestos con colaboradores activos; el modelo de la rama de CGB-31 usa `onDelete: Cascade`. | `informe/informe.md` §5.3; rama `feature/CGB-31-areas-y-puestos` | ¿Un área se borra o solo se desactiva? |
| 3 | **Caducidad del token.** HU-010 CA-03 habla de más de 48 h; la rama de CGB-41 lo hace caducar a los 7 días. | Jira CGB-46; rama de CGB-41 | ¿Cuántas horas de validez? |
| 4 | **Política de contraseña.** HU-010 CA-02 pide mínimo 8 caracteres con números y símbolos; la rama de CGB-41 exige 12 caracteres. | Jira CGB-46; rama de CGB-41 | ¿Cuál es la política? |
| 5 | **Activación implementada dos veces.** HU-009 (CA-03) y HU-010 la tocan, y las ramas de CGB-41 y CGB-46 crean ambas `/api/auth/activar`. | Ramas de CGB-41 y CGB-46 | ¿Qué historia es dueña de la activación? |
| 6 | **Reordenar una ruta activa.** HU-008 no lo prohíbe y el código lo permite, pero puede alterar el avance de HU-011 y HU-012. | Rama de CGB-36 | ¿Se bloquea? |
| 7 | **Roles.** «Especialista de RR. HH.» (HU-009) y «Gestor de Capacitación» (HU-008) no son actores acordados (Administrador, Colaborador y Público). | Jira CGB-36 y CGB-41; `informe/registro_conversatorios.md` | ¿Son actores del sistema? ¿Con qué permisos? |
| 8 | **Dos reglas de prerrequisito.** `Capacitacion.prerrequisitos` (rama de CGB-56) y el orden de los pasos de la ruta (rama de CGB-36). | Ramas de CGB-36 y CGB-56 | ¿Cuál manda? |

Los puntos 3 a 8 describen las ramas a la fecha de corte; cambian si las ramas cambian.

## 5. Caso de uso propuesto: Incorporar colaborador (HU-009 + HU-010)

Un solo caso de uso para las dos historias, para que no se contradigan. Los pasos marcados **[PO]** dependen de la sección 4.

**Actor:** Administrador (o quien el PO autorice, conflicto 7). **Participantes:** Colaborador, servicio de correo.

**Flujo normal**

1. El administrador informa nombre, correo y puesto del nuevo colaborador **[PO: DNI, conflicto 1]**.
2. El sistema valida los datos y que el correo no esté registrado.
3. El sistema crea la cuenta en estado `PENDIENTE_ACTIVACION` y le asigna la ruta activa del puesto con progreso 0 %.
4. El sistema genera un token de un solo uso con caducidad **[PO: horas, conflicto 3]** y lo conserva solo como hash.
5. El sistema envía por correo el enlace de activación.
6. El colaborador abre el enlace.
7. El sistema comprueba que el token exista, no haya vencido ni se haya usado.
8. El colaborador define su contraseña **[PO: política, conflicto 4]**.
9. El sistema guarda la contraseña con hash, activa la cuenta y consume el token.
10. El sistema lleva al colaborador a Mi Onboarding.

**Extensiones**

- 1a. Datos inválidos: el sistema indica qué campo corregir y no registra nada.
- 2a. Correo ya registrado: el sistema rechaza el registro sin crear cuenta.
- 3a. El puesto no tiene ruta activa: **[PO]** HU-009 CA-02 solo define el caso con ruta.
- 5a. Falla el envío del correo: el sistema informa el error y no deja una cuenta a medias.
- 7a. Token vencido, alterado o ya usado: el sistema muestra un error y ofrece solicitar un nuevo enlace (HU-010 CA-03).
- 8a. La contraseña no cumple la política: el sistema pide otra.

## 6. Fuera del MVP: lo que no se añade

Alcance vigente: `informe/informe.md` §3.2 (exclusiones expresas).

| No añadir | Fuente |
|---|---|
| Venta de cursos, pasarela de pagos y carritos | `informe/informe.md` §3.2 |
| Certificados académicos oficiales | `informe/informe.md` §3.2 |
| Video pesado y biblioteca de descargas masivas | `informe/informe.md` §3.2, RNF-004 |
| Seguimiento de prospectos | `informe/registro_conversatorios.md`: pedir decisión al PO si la captura lo propone |
| Pruebas A/B | Piden muestras muy grandes (el PDF ejemplifica 200 000 usuarios por versión); con la cantidad de usuarios del proyecto no tendrían validez |
| Roles nuevos sin aprobación del PO | Cambian la seguridad de toda la aplicación (conflicto 7) |
| Funciones solo porque un usuario las pidió | Se entiende primero el problema que las origina |

## 7. El MVP como experimento (propuesta a validar con el PO)

Ningún dato de esta tabla está medido; es la plantilla para acordarlo.

| Elemento | Propuesta |
|---|---|
| Hipótesis | Una persona nueva puede completar su onboarding sin consultas manuales a Recursos Humanos. Parte de la hipótesis de impacto de HU-011 en Jira, «por validar». |
| Qué se mide | Porcentaje de colaboradores invitados que activan la cuenta y completan su ruta. |
| Umbral de éxito | **[PO]** |
| Cuándo se decide | **[PO]**, al cierre del sprint de integración. |
| Si no se cumple | Ajustar el alcance o la ruta (cambio pequeño) o replantear el enfoque (cambio grande). |

## 8. Conversaciones (la segunda «C») por historia

`informe/registro_conversatorios.md` (corte 21/10/2026) respalda a nivel de necesidad las historias HU-007 a HU-014. Falta registrar por historia **las decisiones sobre sus criterios de aceptación**.

| HU | Decisiones pendientes de registrar (sección 4) |
|---|---|
| HU-007 CGB-31 | 2 |
| HU-008 CGB-36 | 6, 7, 8 |
| HU-009 CGB-41 | 1, 5, 7 |
| HU-010 CGB-46 | 3, 4, 5 |
| HU-011 CGB-51 | 6 |
| HU-012 CGB-56 | 8 |
| HU-013 / HU-014 | Sin revisar |

## 9. Pendientes

1. El PO responde los conflictos de la sección 4 y la decisión queda en la tarjeta de Jira correspondiente.
2. Cada historia lista en Jira sus RNF aplicables, con la matriz de la sección 3.
3. El PO acuerda la hipótesis y el umbral de la sección 7.
4. Al refinar HU-013 y HU-014, completar sus columnas de la matriz.
