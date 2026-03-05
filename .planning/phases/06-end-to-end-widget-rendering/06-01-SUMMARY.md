---
phase: 06-end-to-end-widget-rendering
plan: 01
subsystem: widget-runtime
tags: [figma-widget, runtime-pipeline, markdown, mermaid, in-place-update]
requires:
  - phase: 05-widget-runtime-bootstrap
    provides: runtime base de widget + bridge de comandos + seed embed inicial
provides:
  - Pipeline real URL -> GitHub read -> render -> actualización in-place
  - Normalización de Markdown/Mermaid para política UX de fase 6
  - Persistencia de snapshot mínimo y recuperación en error sin perder contenido
affects: [phase-07-private-access, phase-08-sync-uat]
tech-stack:
  added: [none]
  patterns: [runtime-orchestrator, render-normalization, snapshot-persistence]
key-files:
  created:
    - src/widget/runtime/createOrRefreshEmbedFromUrl.ts
    - src/widget/runtime/persistWidgetSnapshot.ts
    - src/widget/runtime/normalizeRenderForWidget.ts
    - src/widget/__tests__/runtimePipeline.test.ts
    - src/widget/__tests__/widgetStatePersistence.test.ts
    - src/widget/__tests__/renderNormalization.test.ts
  modified:
    - src/widget/code.ts
    - src/widget/ui.html
    - src/widget/code.js
key-decisions:
  - "Orquestar read/render/update en una función pura inyectable para testear sin depender de Figma runtime."
  - "En fase 6, Mermaid se forza a code-view y warnings se reflejan en estado visible del widget."
  - "Ante fetch/render error se mantiene el preview previo y solo se muta syncState + detalles."
patterns-established:
  - "createOrRefreshEmbedFromUrl encapsula flujo end-to-end con update in-place."
  - "normalizeRenderForWidget aplica política UX de contenido sin duplicar motor de render core."
requirements-completed: [WDG-03, INT-04, INT-05]
duration: 31min
completed: 2026-03-03
---

# Phase 6 Plan 01: End-to-End Widget Rendering Summary

**Pipeline real del widget completado: URL válida -> lectura remota -> render -> actualización in-place con metadata y fallback controlado de Markdown/Mermaid.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-03-03T12:36:00Z
- **Completed:** 2026-03-03T13:07:00Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- Se implementó orquestador runtime para encadenar `readGithubFileWithAuth`, `renderFilePreview` y `updateEmbedBlockInPlace`.
- Se añadió persistencia de snapshot mínimo (`sourceKey`, `sourceUrl`, `syncState`, `lastSync`, `warnings`, resumen render).
- Se integró el pipeline en `code.ts` con estados inline y `figma.notify` para loading/error/success.
- Se reforzó UI para mostrar estado inline y detalle de error sin cerrar el panel.
- Se añadió capa de normalización para política fase 6: Mermaid mostrado como código y fallback warning visible.
- Se validó actualización in-place al cambiar URL sobre la misma instancia.

## Task Commits

Each task was committed atomically:

1. **Task 1: Orquestador runtime + snapshot** - `ee04c7d` (feat)
2. **Task 2: Integración code.ts/ui + persistencia de estado** - `c46151a` (feat)
3. **Task 3: Normalización Markdown/Mermaid + warnings** - `766c08d` (feat)

Additional build artifact commit:
- **Bundle refresh** - `91cee65` (chore)

## Files Created/Modified

- `src/widget/runtime/createOrRefreshEmbedFromUrl.ts` - orquestación completa de create/update.
- `src/widget/runtime/persistWidgetSnapshot.ts` - construcción/merge de snapshot mínimo.
- `src/widget/runtime/normalizeRenderForWidget.ts` - política Mermaid-as-code y warnings.
- `src/widget/code.ts` - conexión de comandos UI al pipeline real y estado visible.
- `src/widget/ui.html` - feedback inline (`loading/error/success`) + detalles.
- `src/widget/__tests__/runtimePipeline.test.ts` - cobertura de nominal, error y update in-place.
- `src/widget/__tests__/widgetStatePersistence.test.ts` - cobertura de snapshot create/update.
- `src/widget/__tests__/renderNormalization.test.ts` - cobertura Mermaid normal/fallback.
- `src/widget/code.js` - bundle actualizado del runtime.

## Decisions Made

- Se mantuvo `create-preview` con botón explícito (sin auto-run al pegar URL).
- Estado de error preserva contenido previo para continuidad de lectura.
- Mermaid se mantiene como code-view en esta fase para minimizar riesgo de runtime visual.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None

## User Setup Required

None

## Next Phase Readiness

- Base lista para flujo privado/PAT en runtime real (fase 7).
- Snapshot y estado ya preparados para auto-refresh y UAT (fase 8).

---
*Phase: 06-end-to-end-widget-rendering*
*Completed: 2026-03-03*
