---
phase: 02-private-access-with-pat
plan: 01
subsystem: auth
tags: [github, pat, figma-plugin, auth-errors, private-repos]
requires:
  - phase: 01-foundations-url-intake
    provides: contrato de ingestión URL con sourceKey estable
provides:
  - Flujo de lectura público/privado con PAT por fichero y retry automático único
  - Clasificación de errores auth en missing/expired/current con copy UX estable
  - Estado de PAT por fichero con valid/invalid/unknown y marcas de validación
affects: [phase-03-render, phase-04-sync]
tech-stack:
  added: [none]
  patterns: [public-first-auth-fallback, per-file-pat-state, error-classifier-to-copy]
key-files:
  created:
    - src/core/auth/types.ts
    - src/core/auth/patStore.ts
    - src/core/auth/__tests__/patStore.test.ts
    - src/core/github/types.ts
    - src/core/github/classifyAuthError.ts
    - src/core/github/authUxMessages.ts
    - src/core/github/fetchGithubFile.ts
    - src/core/github/readGithubFileWithAuth.ts
    - src/core/github/__tests__/classifyAuthError.test.ts
    - src/core/github/__tests__/readGithubFileWithAuth.test.ts
  modified: []
key-decisions:
  - "El flujo intenta siempre acceso público primero y solo pide PAT cuando aplica."
  - "El PAT se guarda por sourceKey de fichero y un fallo lo marca como invalid, no se borra automáticamente."
  - "Clasificación de auth (kind) y copy UX se mantienen desacopladas para estabilidad."
patterns-established:
  - "Orquestación readGithubFileWithAuth: ingest -> public fetch -> PAT fallback -> classify -> UX."
  - "Reintento automático único con PAT antes de error final."
requirements-completed: [AUTH-01, AUTH-02, AUTH-03]
duration: 12min
completed: 2026-03-02
---

# Phase 2 Plan 01: Private Access with PAT Summary

**Lectura robusta de archivos privados de GitHub con PAT por fichero, retry controlado y mensajes de auth claros para usuario final**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-02T17:47:32+01:00
- **Completed:** 2026-03-02T17:59:00+01:00
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Se implementó un store de PAT por fichero con estado (`unknown`, `valid`, `invalid`) y metadatos de validación.
- Se añadió cliente de fetch GitHub con cabecera `Authorization` condicional, clasificador de errores auth y mensajes UX bloqueados por contexto.
- Se creó `readGithubFileWithAuth` como entrypoint de acceso público/privado con `retry=1`, invalidación de token fallido y salida estable para UI.

## Task Commits

Each task was committed atomically:

1. **Task 1: Definir modelo y store PAT por fichero** - `f36bbb3` (feat)
2. **Task 2: Implementar fetch GitHub y clasificación de errores auth** - `f5ad529` (feat)
3. **Task 3: Orquestar lectura público/privado con un reintento automático** - `aee5df8` (feat)

## Files Created/Modified
- `src/core/auth/patStore.ts` - Store per-file para set/get/remove/markValid/markInvalid.
- `src/core/github/fetchGithubFile.ts` - Cliente GitHub con auth condicional y respuesta tipada.
- `src/core/github/classifyAuthError.ts` - Clasificación `missing_pat`/`expired_pat`/`current_pat`.
- `src/core/github/authUxMessages.ts` - Mapping de copy UX estable para auth.
- `src/core/github/readGithubFileWithAuth.ts` - Orquestación principal de acceso y retry.
- `src/core/github/__tests__/*.test.ts` - Cobertura unitaria y de flujo para auth.

## Decisions Made
- Se mantuvo PAT por fichero (no global) alineado con decisiones bloqueadas de fase.
- Se aplicó estrategia `public-first` para evitar pedir PAT en archivos realmente públicos.
- Se conserva PAT fallido como `invalid` para no perder contexto de error ni bloquear reemplazo manual.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrupción de índice/ref durante commit de Task 2**
- **Found during:** Task 2
- **Issue:** El commit de Task 2 arrastró borrado masivo accidental de archivos tracked por estado inconsistente de refs/index.
- **Fix:** Restauración completa de baseline desde commit previo y validación de refs para reanudar ejecución.
- **Files modified:** `.planning/*`, `package.json`, `scripts/typecheck.cjs`, `src/core/auth/*`, `src/core/url/*`
- **Verification:** `git status` limpio + test suites de fase en verde tras restauración.
- **Committed in:** `225b1f1`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Sin recorte funcional; se añadió un commit de recuperación para preservar integridad del repositorio y continuar la fase.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Queda disponible una API estable para que fase 3 consuma contenido ya autenticado sin reimplementar auth.
- El estado de PAT y clasificación de errores está listo para integrarse con render y refresh de canvas.

## Self-Check: PASSED

---
*Phase: 02-private-access-with-pat*
*Completed: 2026-03-02*
