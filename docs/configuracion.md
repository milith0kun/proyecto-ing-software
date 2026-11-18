# Configuración del entorno

## Variables privadas

Copiar `.env.example` a `.env` y configurar los valores locales. Nunca subir `.env` ni credenciales a Git.

| Variable | Uso | Responsable / obtención |
|---|---|---|
| `DATABASE_URL` | Conexión Prisma a MongoDB Atlas | Responsable de infraestructura o administrador de la base |
| `AUTH_SECRET` | Firma de sesiones; mínimo 32 bytes aleatorios | Responsable de infraestructura |
| `APP_URL` | Origen público usado en enlaces y validación mismo-origen | Responsable de despliegue; debe coincidir exactamente con HTTPS público |
| `RESEND_API_KEY` | API de envío de invitaciones por correo | Responsable autorizado de Resend |
| `EMAIL_FROM` | Remitente institucional verificado en Resend | Responsable de RR. HH. / infraestructura; debe usar dominio verificado |

## Resend

`RESEND_API_KEY` y `EMAIL_FROM` son necesarios para enviar invitaciones reales. El código no registra el enlace de activación en MongoDB; únicamente conserva el hash SHA-256 del token y envía el enlace original por correo.

Antes de activar el servicio:

1. Crear/verificar el dominio institucional en Resend.
2. Registrar el remitente en `EMAIL_FROM`.
3. Crear la clave en el entorno privado, no en el repositorio.
4. Confirmar que las pruebas reciben correo real antes del despliegue.

## Semilla de onboarding

El modelo final de áreas, puestos y rutas está pendiente de decisión entre CGB-31 y CGB-36. Por ello, la semilla actual no se considera aprobada hasta acordar un único modelo Prisma y un único script ejecutable.