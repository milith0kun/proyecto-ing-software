# HU-011: evidencia de validación

Fecha de validación: 2026-11-16
Rama: `feature/CGB-51-mi-onboarding`

## Criterios de aceptación

| Criterio | Evidencia automatizada | Resultado |
| --- | --- | --- |
| CA-01 Ruta y estados | `tests/mi-onboarding.test.mjs`: orden por ruta, estados Pendiente/En progreso/Completada y ruta vacía. | Verificado con fixtures aislados. |
| CA-02 Porcentaje | `tests/mi-onboarding.test.mjs`: ruta vacía en 0 %, redondeo de 1/3 a 33 % y total coherente con la lista. | Verificado. |
| CA-03 Continuidad | `tests/mi-onboarding.test.mjs`: primer slide sin progreso, último slide guardado, ausencia de continuación al completar y persistencia de slide por endpoint. | Verificado con mocks de Prisma. |
| CA-04 Privacidad | `tests/mi-onboarding.test.mjs`: rechazo sin sesión, filtro de datos por identidad de sesión y rechazo de capacitación ajena. | Verificado con mocks de sesión/Prisma. |
| CA-05 Alcance MVP | Panel presenta estado de ruta completada; no implementa certificados, constancias ni insignias. | Verificado por implementación. |

## Validación técnica

- `npm test`: 90 pruebas aprobadas, 0 fallidas.
- `npx tsc --noEmit`: correcto.
- `npm run lint`: correcto.
- `env DATABASE_URL=mongodb://localhost:27017/cgb_test npx prisma validate`: esquema válido.
- `npm run build`: correcto; Next.js incluye las rutas `/api/colaborador/mi-onboarding`, `/api/colaborador/progreso` y `/colaborador/capacitaciones/[id]`.

## Decisiones de implementación

- El endpoint no acepta identidad de colaborador del cliente; resuelve la cuenta por la sesión autenticada.
- El progreso se guarda por colaborador y capacitación, con último slide y estado completado.
- La ruta vacía produce 0 % y no muestra acción de continuación.
- El avance del colaborador es privado y la interfaz comunica que se guarda para continuar.
- El impacto AG-C01 continúa siendo una hipótesis; no se presenta como resultado medido.

## Pendiente de cierre externo

- Las pruebas de HU-011 usan fixtures y mocks; no se ejecutó una prueba de integración contra una base MongoDB de staging.
- Revisión y aprobación independiente: pendiente.
- PR y enlace Jira: pendientes; no se creó PR.
- Integración en `main`: pendiente.

## Commits por fase

- CGB-52 T1: RED - `8a646d5`.
- CGB-53 T2: GREEN - `9b74cab`.
- CGB-54 T3: REFACTOR - `32432da`.
