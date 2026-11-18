# HU-009 / CGB-41 — Registrar colaboradores e invitarlos

## Estado al 18 de noviembre de 2026

**CGB-41 permanece en `DESARROLLO`; PR #18 continúa en revisión.**

La implementación está integrada técnicamente con CGB-31 y CGB-36 en la rama `feature/CGB-41-registrar-colaboradores`. La dependencia con CGB-46 fue confirmada en Jira: CGB-41 bloquea a CGB-46 (HU-010). Por tanto, CGB-41 genera y persiste la invitación; CGB-46 debe ser la responsable de validar y consumir el token para activar la cuenta. Esta separación evita que dos historias dupliquen la activación.

Los siguientes controles de software están verdes:

- 113 pruebas automáticas aprobadas y 0 fallos.
- `npx prisma validate` y `npx prisma generate` correctos.
- `npx tsc --noEmit` correcto.
- `npx eslint .` correcto.
- `git diff --check` correcto.

Las pruebas usan dobles de Prisma y correo. No sustituyen MongoDB Atlas, Resend ni el navegador real.

## Criterios

| Criterio | Implementación | Evidencia | Estado |
|---|---|---|---|
| CA-01: registro individual o masivo | Crea colaborador vinculado y cuenta inactiva | `tests/colaboradores-api.test.mjs`, `tests/colaboradores-flujo.test.mjs` | Automático verde |
| CA-02: asignar ruta activa según puesto | Busca la ruta `ACTIVA` asociada a `PuestoTrabajo.rutas` | Pruebas CGB-41 y CGB-36 | Integrado; falta prueba real |
| CA-03: generar invitación segura | Token aleatorio, hash SHA-256, expiración y correo | `tests/colaboradores-hu009.test.mjs`, `tests/correo-invitacion.test.mjs`, `tests/activacion-colaborador.test.mjs` | Automático verde; falta Resend real |
| CA-04: monitorear colaboradores | Panel administrativo con filtros por estado y ruta | `tests/colaboradores-hu009.test.mjs` | Pendiente validación visual |

## Evidencia automática

- `npm test`: **113 pruebas aprobadas, 0 fallos**.
- `npx prisma validate`: válido.
- `npx prisma generate`: correcto.
- `npx tsc --noEmit`: sin errores.
- `npx eslint .`: sin errores.
- `git diff --check`: sin errores.

Las pruebas usan dobles de Prisma y correo; no sustituyen MongoDB Atlas ni el proveedor Resend real.

## Evidencia visual requerida

- Captura de `/admin/colaboradores` con registro individual y masivo.
- Captura del correo recibido sin mostrar tokens completos.
- Capturas de `/login/activar`: contraseña válida, contraseña inválida y enlace vencido o consumido.
- Guardar archivos ficticios en `docs/evidencias-hu009/` y enlazarlos desde este documento.

## Evidencia real pendiente

- [ ] Registrar datos temporales en MongoDB Atlas y eliminarlos al finalizar.
- [ ] Confirmar persistencia de hash SHA-256 y expiración.
- [ ] Confirmar que no exista `enlaceActivacion` en MongoDB.
- [ ] Enviar una invitación real mediante Resend.
- [ ] Confirmar recepción y activación desde el correo.
- [ ] Verificar vista responsive en `/admin/colaboradores` y `/login/activar`.

## Decisiones externas pendientes

- Aprobar formalmente si se captura/muestra DNI o se elimina del flujo.
- Aprobar formalmente el rol `ESPECIALISTA_RRHH`.
- Definir qué HU posee activación y alinear caducidad/contraseña con CGB-46.
- Obtener aprobación de revisión por pares en el PR #18.
- Resolver las conversaciones abiertas antes del merge.

## Seguridad

- El token no se persiste en texto plano ni como enlace completo.
- MongoDB conserva solo hash SHA-256 y expiración.
- El enlace completo existe solo en memoria y en el correo.
- Activación y cambio de cuenta consumen el token de forma atómica.
- La API no expone el token ni el enlace de activación.

## Uso de IA

- Herramienta utilizada: GitHub Copilot.
- Uso: integración CGB-31/CGB-36, corrección de conflictos, documentación y validaciones.
- Validación humana requerida: decisiones del PO, permisos, DNI, aprobación de revisión y evidencia real.

## Validación real ejecutada el 18 de noviembre de 2026

Se inició la aplicación local con la configuración privada existente y se realizó una revisión desde el navegador sobre MongoDB Atlas.

### Evidencia obtenida

- `/admin/organizacion`: se creó temporalmente el área ficticia `Prueba CGB41` y el puesto ficticio compatible con Prisma.
- `/admin/rutas`: se creó la ruta ficticia `Ruta CGB41 Temporal`, se agregó una capacitación y se activó.
- `/admin/colaboradores`: se abrió el formulario con el puesto activo disponible y se realizaron pruebas de registro con datos ficticios.
- Se comprobaron visualmente filtros, tabla vacía, formulario individual y mensajes de error.

Capturas:

- [Registro sin configuración completa de correo](evidencias-hu009/registro-cgb41-sin-resend.png)
- [Resultado del intento de registro](evidencias-hu009/registro-cgb41-resultados.png)

Las capturas usan nombres, DNI y correos ficticios. No contienen tokens ni credenciales.

### Hallazgos reales

- La aplicación pudo consultar y escribir registros temporales en Atlas.
- Se encontró una incompatibilidad durante la preparación: existía un modelo legado de puestos en la colección `puestos`, mientras el modelo Prisma vigente usa `puestos_trabajo`.
- Al usar un puesto creado por Prisma y una ruta activa, el intento de registro no pudo completar el envío porque `RESEND_API_KEY` no está configurado en el entorno.
- El sistema mostró de forma segura el error `No pudimos registrar al colaborador` o el fallo específico de correo, sin exponer token ni enlace.
- No se confirmó CA-03 con Resend real.
- No se confirmó una activación real desde el correo.

### Limpieza

Se eliminaron los registros temporales creados durante la revisión:

- Área `Prueba CGB41`.
- Puestos temporales asociados.
- Ruta `Ruta CGB41 Temporal` y sus pasos.
- Colaboradores y cuentas temporales.

Comprobación posterior: 0 áreas, 0 puestos, 0 colaboradores temporales y 2 usuarios base originales. Las 4 rutas base no fueron modificadas permanentemente.