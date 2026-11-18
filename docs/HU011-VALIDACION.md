# HU-011: evidencia de validación

Fecha de validación: 2026-11-18
Rama: `feature/CGB-51-mi-onboarding`

## Estado final

- HU-011 integrada con el esquema consolidado de `main`.
- Mi Onboarding resuelve la ruta asignada al usuario autenticado mediante `RutaOnboarding.pasos`.
- El avance usa `ProgresoCapacitacion` identificado por `usuarioId` y `capacitacionId`.
- Se conservaron las entidades compatibles necesarias para CGB-41 sin romper las rutas nuevas de CGB-36.

## Resultados

- Pruebas específicas HU-011: 7 aprobadas, 0 fallidas.
- `npx tsc --noEmit`: correcto.
- `npm run lint`: correcto, sin advertencias ni errores.
- `npm run build`: correcto; rutas `/colaborador`, `/api/colaborador/mi-onboarding` y `/api/colaborador/progreso` generadas.
- `npx prisma validate`: esquema válido.

## Integración con MongoDB

- Verificada el 2026-11-18 contra MongoDB Atlas Cluster0 mediante Prisma y `/api/health`.
- Estado: conexión exitosa; endpoint de salud respondió `connected: true`.
- Datos observados sin modificar: 2 usuarios, 4 rutas activas, 0 pasos configurados, 0 usuarios con ruta asignada y 0 registros de progreso.
- El recorrido completo no puede demostrarse todavía con datos reales porque CGB-41 aún no asignó una ruta al usuario colaborador y las rutas existentes no tienen pasos.

## Pendiente externo

- Integración en base MongoDB de staging: aún requiere credenciales y ejecución manual.
- Revisión y aprobación independiente: pendiente.
- Publicación del PR: pendiente hasta autorización del responsable.
- Ejecución end-to-end con un colaborador asignado a una ruta con pasos configurados.

## Prueba end-to-end real — 2026-11-18

- MongoDB Atlas: conexión confirmada.
- Se asignó temporalmente al colaborador activo la ruta «Inducción de Tecnología».
- Se configuraron dos pasos internos publicados y se realizó el recorrido completo.
- Inicio: ruta con 0/2 completadas y 0 %.
- Reanudación: tras confirmar el primer slide, Mi Onboarding mostró la capacitación En progreso y Continuar en la posición guardada.
- Continuidad: al completar la primera capacitación, el porcentaje llegó a 50 % y Continuar abrió la segunda.
- Cierre: ambas capacitaciones quedaron COMPLETADA y el panel mostró 2/2, 100 %, `completada=true` y `continuar=null`.
- Limpieza: se eliminaron la sesión temporal y los registros de progreso de prueba; se conservaron la ruta y sus pasos como configuración útil.
