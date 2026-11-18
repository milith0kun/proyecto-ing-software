# HU-009 / CGB-41 — Registrar colaboradores e invitarlos

## Estado

**Bloqueada para integración hasta cerrar decisiones de modelo, alcance, rol y trazabilidad.**

La implementación disponible tiene pruebas automáticas, pero aún no se completaron las evidencias reales de MongoDB, correo ni navegador ni el acuerdo del equipo sobre los modelos compartidos.

## Criterios

| Criterio | Implementación | Evidencia | Estado |
|---|---|---|---|
| CA-01: registrar colaborador pendiente | Crea cuenta inactiva y colaborador vinculado | `tests/colaboradores-api.test.mjs`, `tests/colaboradores-hu009.test.mjs` | Automático verde |
| CA-02: asignar ruta según puesto | Busca el puesto y asigna su ruta activa | Pruebas de flujo y registro | Automático verde; modelo pendiente |
| CA-03: generar invitación segura | Token aleatorio, hash SHA-256, expiración y correo | `tests/colaboradores-hu009.test.mjs`, `tests/correo-invitacion.test.mjs`, `tests/activacion-colaborador.test.mjs` | Automático verde |
| CA-04: monitorear y filtrar colaboradores | Panel administrativo con estado y ruta | `tests/colaboradores-hu009.test.mjs` | Pendiente validación visual |

## Evidencia automática

- `npm test`: 83 pruebas aprobadas, 0 fallos.
- `npx eslint .`: sin errores.
- `npx tsc --noEmit`: sin errores después de limpiar artefactos `.next`.

Estas pruebas usan dobles de Prisma y correo; no prueban MongoDB Atlas ni Resend reales.

## Evidencia visual pendiente

Capturas requeridas:

1. `/admin/colaboradores`: listado, filtros y registro individual.
2. Bandeja o consola de correo: invitación recibida y enlace sin exponerlo en la respuesta/API.
3. `/login/activar`: contraseña válida, activación correcta y contraseña inválida.

Las capturas deben usar datos ficticios, ocultar DNI/correo completo si no es necesario y evitar mostrar tokens.

## Seguridad

- El token no debe persistirse en texto plano ni como enlace completo.
- MongoDB conserva solo el hash SHA-256 y la expiración.
- El enlace completo existe solo en memoria y en el correo enviado.
- Activación y cambio de cuenta deben consumir el token de forma atómica.
- La API no expone el token ni el enlace de activación.

## Bloqueos

- CGB-31/CGB-36/CGB-41 deben acordar una única estructura de áreas, puestos y rutas.
- CGB-41/CGB-46 deben acordar qué HU implementa la activación.
- El rol `ESPECIALISTA_RRHH` requiere decisión y aprobación registrada del PO.
- Se debe decidir si el DNI aparece en el listado.
- Falta configurar el dominio/remitente de Resend y ejecutar pruebas reales.

## Validación manual pendiente

- [ ] Inicio de sesión con cuenta autorizada.
- [ ] Registro individual.
- [ ] Registro masivo.
- [ ] Corrección de datos inválidos.
- [ ] Recepción real del correo.
- [ ] Activación con contraseña válida.
- [ ] Rechazo de enlace vencido o ya consumido.
- [ ] Persistencia real de hash y expiración en MongoDB.
- [ ] Confirmación de que no existe `enlaceActivacion` con token en MongoDB.