---
phase: 05-widget-runtime-bootstrap
plan: 01
subsystem: widget-runtime
tags: [figma-widget, runtime, bridge, bootstrap, manifest]
requires:
  - phase: 04-canvas-ux-sync
    provides: modelo de bloque embed y sync state reutilizado para seed preview
provides:
  - Runtime base de Widget API con manifest cargable en Dev Mode
  - Bridge tipado UI/runtime para comandos create-preview y refresh-preview
  - Flujo de seed embed con metadata mínima para enlazar fase 6
affects: [phase-06-end-to-end-widget-rendering, phase-07-private-access]
tech-stack:
  added: [esbuild]
  patterns: [typed-bridge, seed-embed, manifest-driven-runtime]
key-files:
  created:
    - manifest.json
    - scripts/widget-build.cjs
    - scripts/widget-check.cjs
    - src/widget/code.ts
    - src/widget/code.js
    - src/widget/ui.html
    - src/widget/bridge/messages.ts
    - src/widget/bridge/parseUiCommand.ts
    - src/widget/bootstrap/widgetMetadata.ts
    - src/widget/bootstrap/createSeedEmbed.ts
    - src/widget/__tests__/bridge.test.ts
    - src/widget/__tests__/bootstrap.test.ts
  modified:
    - package.json
    - package-lock.json
key-decisions:
  - "Build de widget con esbuild para generar `src/widget/code.js` bundle sin dependencias runtime en Figma."
  - "UI bridge tipado con parser defensivo para evitar comandos inválidos entre iframe y widget runtime."
  - "Seed embed usa intake core existente y compone bloque semilla con metadatos persistentes mínimos."
patterns-established:
  - "Contrato de comandos centralizado en `src/widget/bridge/messages.ts` + parseo en `parseUiCommand.ts`."
  - "Bootstrap incremental: fase 5 crea seed preview; fase 6 conecta render completo."
requirements-completed: [WDG-01, WDG-02, QLT-04]
duration: 23min
completed: 2026-03-03
---

# Phase 5 Plan 01: Widget Runtime Bootstrap Summary

**Runtime real de widget con scaffold operativo, bridge UI/runtime y creación de embed semilla conectado al core existente.**

## Performance

- **Duration:** 23 min
- **Started:** 2026-03-03T10:58:00Z
- **Completed:** 2026-03-03T11:21:00Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments

- Se añadió manifest de widget y runtime shell ejecutable con `widget.register(...)` para Dev Mode.
- Se incorporó pipeline de build/check del widget (`widget:build`, `widget:check`) manteniendo `npm test` y `npm run typecheck` intactos.
- Se implementó bridge tipado UI/runtime con parser defensivo y tests de payload válido/inválido.
- Se conectó `create-preview` a creación de embed semilla usando `ingestGithubFileUrl` + `composeEmbedBlock` del core.
- Se añadieron tests de bootstrap para metadata semilla y construcción de embed desde URL válida.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold de runtime Widget API y scripts de desarrollo** - `f5b75c8` (feat)
2. **Task 2: Implementar bridge tipado UI ↔ runtime para create-preview** - `197a063` (feat)
3. **Task 3: Crear instancia semilla y metadata mínima del embed** - `602de4f` (feat)

## Files Created/Modified

- `manifest.json` - configuración de widget (`containsWidget`, `widgetApi`, `main`, `ui`).
- `package.json`, `package-lock.json` - scripts `widget:build`, `widget:check` y dependencia `esbuild`.
- `scripts/widget-build.cjs` - bundle de runtime con inyección de `__html__`.
- `scripts/widget-check.cjs` - validaciones de manifest/output y registro de widget.
- `src/widget/code.ts` - runtime widget, property menu, bridge handler y seed bootstrap.
- `src/widget/ui.html` - UI mínima de intake URL + refresh placeholder.
- `src/widget/bridge/messages.ts` - contratos de comandos/eventos.
- `src/widget/bridge/parseUiCommand.ts` - parser/guard de bridge.
- `src/widget/bootstrap/widgetMetadata.ts` - metadata semilla (`sourceKey`, `syncState`, `lastSync`).
- `src/widget/bootstrap/createSeedEmbed.ts` - intake URL + composición de embed semilla.
- `src/widget/__tests__/bridge.test.ts` - cobertura de contrato bridge.
- `src/widget/__tests__/bootstrap.test.ts` - cobertura de bootstrap y metadata.

## Decisions Made

- Se eligió bundling explícito con esbuild para evitar `require` runtime en entorno Figma.
- Se separó el parseo de comandos de la lógica de runtime para facilitar pruebas y extensibilidad.
- El embed semilla conserva metadatos mínimos para habilitar refresh/render en fases siguientes sin migración de formato.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Build/check ejecutados inicialmente en paralelo durante verificación local**
- **Found during:** verificación de Task 1
- **Issue:** `widget:check` puede correr antes de `widget:build` y fallar por orden de ejecución.
- **Fix:** se normalizó la verificación en secuencia (`widget:build && widget:check`).
- **Files modified:** none
- **Verification:** ejecución secuencial en verde.
- **Committed in:** N/A

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** sin impacto en entregables; solo ajuste de orden en validación local.

## Issues Encountered

None

## User Setup Required

None — no external account setup required for bootstrap phase.

## Next Phase Readiness

- El runtime de widget está preparado para conectar render end-to-end real (fase 6).
- El bridge soporta extensión para payloads de auth y refresh avanzado (fase 7/8).
- El modelo semilla ya persiste `sourceKey` y estado básico para sincronización posterior.

---
*Phase: 05-widget-runtime-bootstrap*
*Completed: 2026-03-03*
