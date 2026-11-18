# Evidencias HU-009 / CGB-41

## Preparación

Usar exclusivamente datos ficticios y una base/entorno de prueba autorizado. No subir `.env`, tokens, DNI reales, correo personal ni capturas con datos sensibles.

## Capturas requeridas

1. `/admin/colaboradores`: formulario completo y registro individual.
2. `/admin/colaboradores`: registro masivo, filtros y resultado esperado.
3. Bandeja de correo: invitación recibida sin exponer el token en la captura.
4. `/login/activar`: contraseña válida y activación correcta.
5. `/login/activar`: contraseña inválida, enlace vencido o enlace consumido.

## Validación de MongoDB Atlas

Verificar el registro creado:

- Existe el colaborador y la cuenta vinculada.
- `tokenActivacion` contiene el hash SHA-256 y no el token original.
- `tokenExpiraEn` contiene una fecha futura.
- No existe el campo `enlaceActivacion`.
- Tras activar: estado `ACTIVO`, token y expiración quedan en `null`.

## Validación de Resend

- Configurar `RESEND_API_KEY` y `EMAIL_FROM` solo en el entorno privado.
- Verificar el dominio/remitente autorizado.
- Registrar un colaborador con un correo de prueba autorizado.
- Confirmar recepción, nombre escapado, enlace funcional y ausencia de token en la API.

## Limpieza

Eliminar registros temporales de MongoDB, invitaciones de prueba y capturas que incluyan datos personales. Mantener solo imágenes ficticias necesarias para la evidencia.

## Archivos sugeridos

- `admin-colaboradores.png`
- `registro-masivo.png`
- `correo-invitacion.png`
- `activar-cuenta-ok.png`
- `activar-cuenta-error.png`
