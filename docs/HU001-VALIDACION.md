# HU001 — Inicio y cierre de sesión (CGB-6)

Implementación de Alex sobre la base compartida `desarrollo` (17471b3). Entrega propuesta desde `alex-carpio` hacia `desarrollo`.

## Comportamiento

- `/login` valida correo y contraseña; devuelve «Credenciales inválidas» sin distinguir cuenta inexistente, inactiva o contraseña incorrecta.
- Contraseñas verificadas con bcrypt; JWT firmado HS256 con expiración de ocho horas y cookie HttpOnly, SameSite=Lax y Secure en producción.
- Administrador entra a `/admin/capacitaciones`; Colaborador entra a `/colaborador`. Este último es un acceso inicial; el onboarding pertenece a las historias siguientes.
- Proxy de Next.js 16 redirige visitas anónimas a `/admin/*` y `/colaborador/*`. Los layouts y APIs verifican además la sesión persistida y el rol actual, para rechazar tokens revocados.
- Logout elimina la sesión persistida y la cookie y regresa al inicio público.
- Crear, editar y eliminar capacitaciones exige Administrador. Consultas públicas sólo muestran capacitaciones PUBLICO/PUBLICADA; esto cierra el acceso a borradores e información interna existente en la base inicial.
- Se rechazan escrituras desde otros orígenes. Errores del servidor no exponen detalles de Prisma ni configuración.

## Configuración pendiente del equipo

1. Configurar `DATABASE_URL` y un `AUTH_SECRET` aleatorio de al menos 32 bytes en el entorno privado, y `APP_URL` con el origen exacto de la aplicación (HTTPS al desplegar). La aplicación ahora falla de forma segura si falta `AUTH_SECRET` o es demasiado corto; ya no usa una clave fija de respaldo. Nunca guardar secretos en Git.
2. Revisar y aplicar el esquema Prisma en un entorno de pruebas del equipo. Esta entrega **no ejecutó `prisma db push` ni modificó Atlas**.
3. Confirmar dos cuentas de prueba, Administrador y Colaborador. Ambas necesitan `activo: true`, rol `ADMINISTRADOR` o `COLABORADOR` y `passwordHash` bcrypt. El login no crea usuarios ni convierte cuentas antiguas automáticamente. Nuevas cuentas son inactivas por defecto; la activación corresponde a HU010.
4. La creación de usuarios de HU009 debe guardar el correo normalizado en minúsculas y el hash bcrypt, con contraseñas de hasta 72 bytes UTF-8. HU009 pertenece a otro integrante; esta entrega no implementa registro.
5. El dominio institucional permitido todavía debe confirmarse con el equipo. Se valida formato de correo; no se inventa una lista de dominios.

## Evidencia local (02/10/2026)

- Fase RED: cinco pruebas de autenticación fallaron antes de implementar el comportamiento.
- GREEN: `node --test --test-isolation=none tests/*.test.mjs`: 18 pruebas pasan, incluyendo las ocho pruebas existentes de capacitaciones.
- Pruebas nuevas: credenciales válidas/incorrectas, cuentas inactivas y roles inválidos, JWT alterado/expirado, cookies, origen ajeno, sesión revocada y límite de bcrypt. Consultas de cuentas/sesiones usan dobles de prueba; **no son pruebas de integración con MongoDB**.
- `eslint --max-warnings=0`: pasa sin advertencias.
- Compilación de producción con Next.js: pasa, incluyendo comprobación TypeScript. Requiere acceso a Google Fonts que ya usaba el proyecto.
- Auditoría de dependencias de producción: cero vulnerabilidades reportadas en esta revisión.
- Inspección visual de `/login`: logo, campos etiquetados, botón y regreso al centro público visibles.
- Verificación HTTP sobre servidor local de producción: visitas anónimas a panel/área interna redirigen a login (307), login con formato inválido responde 401, escritura anónima responde 401, origen ajeno responde 403 y logout sin sesión responde 200 con cookie eliminada. No hubo accesos a Atlas en estos escenarios.

## Checklist para revisión con cuentas reales

- [ ] Administrador válido entra al panel; Colaborador válido entra a su área.
- [ ] Correo inexistente y contraseña incorrecta muestran el mismo mensaje.
- [ ] Visita anónima directa al panel redirige al login; Colaborador no administra capacitaciones.
- [ ] Cerrar sesión regresa al inicio; reutilizar la cookie previa no permite acceder al panel ni escribir por API.
- [ ] Catálogo público mantiene sólo contenido publicado/público.
- [ ] Un compañero revisa y aprueba el PR; se integra a `desarrollo` según el flujo del equipo.

HU001 permanece en desarrollo hasta validar los puntos pendientes. HU004 (CGB-16) todavía no está implementada en esta entrega.
