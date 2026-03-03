---
phase: 07-private-access-pat-safety
plan: 01
subsystem: widget-auth
tags: [figma-widget, private-access, pat, security, redaction]
requires:
  - phase: 06-end-to-end-widget-rendering
    provides: runtime pipeline create/refresh in-place + widget snapshot persistence
provides:
  - Flujo privado con PAT por fichero y reintento manual inline
  - Persistencia local cifrada del PAT por sourceKey (fuera de synced state)
  - Endurecimiento anti-fuga de secretos en errores/detalles visibles
affects: [phase-08-sync-uat]
tech-stack:
  added: [none]
  patterns: [pat-session-store, auth-state-bridge, secret-redaction]
key-files:
  created:
    - src/widget/runtime/patSessionStore.ts
    - src/widget/runtime/redactSensitive.ts
    - src/widget/__tests__/securityRedaction.test.ts
    - src/widget/__tests__/patAccessFlow.test.ts
  modified:
    - src/widget/runtime/createOrRefreshEmbedFromUrl.ts
    - src/widget/bridge/messages.ts
    - src/widget/bridge/parseUiCommand.ts
    - src/widget/code.ts
    - src/widget/ui.html
    - src/widget/__tests__/bridge.test.ts
    - src/widget/__tests__/runtimePipeline.test.ts
    - src/widget/code.js
key-decisions:
  - "El PAT se gestiona fuera de `useSyncedState` en un store de sesion con persistencia local cifrada por `sourceKey`."
  - "El bridge UI/runtime se amplia con `submit-pat` y `forget-pat` para reintento manual sin recrear instancia."
  - "Errores de auth y detalles visibles pasan por redaccion para evitar filtrado de credenciales."
patterns-established:
  - "`loadPatSessionStore` inicializa cache privada y sincroniza persistencia async con `figma.clientStorage`."
  - "`createOrRefreshEmbedFromUrl` devuelve `auth` normalizado para que UI decida prompt de PAT."
requirements-completed: [SEC-01, SEC-02, SEC-03]
duration: 39min
completed: 2026-03-03
---

# Phase 7 Plan 01: Private Access & PAT Safety Summary

**Flujo privado del widget completado: deteccion de auth privada, captura de PAT por fichero, reintento manual y proteccion de secretos en estado/canvas/UI.**

## Performance

- **Duration:** 39 min
- **Started:** 2026-03-03T13:15:00+01:00
- **Completed:** 2026-03-03T13:54:00+01:00
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- Se implemento `patSessionStore` para PAT por `sourceKey`, con cache en memoria y persistencia cifrada en storage local.
- Se agrego `redactSensitive` para redaccion de tokens en strings/objetos antes de exponer errores y detalles.
- Se extendio el bridge con comandos `submit-pat` y `forget-pat`.
- Se actualizo runtime widget para inicializar store privado, manejar errores auth diferenciados y permitir reintento manual sin reinicio.
- Se amplio la UI con panel inline de PAT (guardar + reintentar, olvidar token) condicionado por estado auth.
- Se endurecio `createOrRefreshEmbedFromUrl` para redaccion de detalles sensibles en rutas de error.
- Se añadieron tests de seguridad y flujo privado end-to-end a nivel runtime.

## Task Commits

Each task was committed atomically:

1. **Task 1: store PAT seguro + redaccion** - `a6235fd` (feat)
2. **Task 2: bridge/runtime auth + comandos PAT** - `6ba1745` (feat)
3. **Task 3: UX inline PAT + no filtrado + bundle** - `e2a087d` (feat)

## Files Created/Modified

- `src/widget/runtime/patSessionStore.ts` - store de PAT por fichero con persistencia cifrada.
- `src/widget/runtime/redactSensitive.ts` - redaccion reusable de secretos.
- `src/widget/runtime/createOrRefreshEmbedFromUrl.ts` - salida `auth` normalizada y redaccion en errores.
- `src/widget/bridge/messages.ts` - nuevos comandos `submit-pat`/`forget-pat`.
- `src/widget/bridge/parseUiCommand.ts` - validacion de comandos PAT.
- `src/widget/code.ts` - flujo auth-needed, submit/forget PAT, retry manual y status sanitizado.
- `src/widget/ui.html` - panel inline PAT con CTA de guardar/reintentar y olvidar.
- `src/widget/__tests__/securityRedaction.test.ts` - pruebas de redaccion y persistencia cifrada.
- `src/widget/__tests__/patAccessFlow.test.ts` - flujo privado missing->submit->retry + no filtrado.
- `src/widget/code.js` - bundle runtime actualizado.

## Decisions Made

- Se mantuvo politica de reintento manual (sin auto-retry) para mayor control UX.
- El PAT no se incluye en `embedBlock`, `embed-snapshot` ni eventos visuales de estado.
- Se conserva instancia existente en errores auth y se habilita recuperacion desde UI inline.

## Deviations from Plan

- No se modifico `src/core/github/authUxMessages.ts`; los textos finales de auth se aplican en capa widget runtime/UI para no afectar contratos previos del core.

## Issues Encountered

- El helper `state record-session` no aplica sobre este `STATE.md` por formato de secciones; estado se actualizo manualmente como en fases anteriores.

## User Setup Required

None

## Next Phase Readiness

- Base lista para fase 8 (sync manual/auto + UAT + docs) con flujo privado ya estable.
- Seguridad de PAT ya encapsulada para reutilizar en refresh auto y validaciones UAT.

---
*Phase: 07-private-access-pat-safety*
*Completed: 2026-03-03*
