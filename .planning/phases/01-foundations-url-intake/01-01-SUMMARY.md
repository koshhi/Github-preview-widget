---
phase: 01-foundations-url-intake
plan: 01
subsystem: api
tags: [github, url-parsing, validation, testing, figma-plugin]
requires: []
provides:
  - Contrato estable de ingestión de URL GitHub (`blob`/`raw`)
  - Validación de fichero y extensión soportada en v1
  - Punto único de entrada para fases posteriores (`ingestGithubFileUrl`)
affects: [phase-02-auth, phase-03-render]
tech-stack:
  added: [node-test-runner]
  patterns: [parse-normalize-validate, error-code-first]
key-files:
  created:
    - src/core/url/types.ts
    - src/core/url/parseGithubFileUrl.ts
    - src/core/url/validateGithubFileUrl.ts
    - src/core/url/detectFileKind.ts
    - src/core/url/errors.ts
    - src/core/url/ingestGithubFileUrl.ts
    - src/core/url/__tests__/parseGithubFileUrl.test.ts
    - src/core/url/__tests__/validateGithubFileUrl.test.ts
    - src/core/url/__tests__/ingestGithubFileUrl.test.ts
    - scripts/typecheck.cjs
  modified:
    - package.json
key-decisions:
  - "Separar parseo, validación y clasificación de fichero para reducir ambigüedad y facilitar evolución."
  - "Usar códigos de error estables para desacoplar lógica interna del copy de UI."
patterns-established:
  - "Ingestión de URL en tres pasos: parse -> validate -> detect."
  - "Errores accionables mediante mapeo centralizado en errors.ts."
requirements-completed: [SRC-01, SRC-02, SRC-03]
duration: 55min
completed: 2026-03-02
---

# Phase 1 Plan 01: Foundations URL Ingestion Summary

**Pipeline robusto de ingestión para URLs de fichero GitHub con normalización estable, validación accionable y cobertura de regresión.**

## Performance

- **Duration:** 55 min
- **Started:** 2026-03-02T15:12:40+01:00
- **Completed:** 2026-03-02T16:07:59+01:00
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- Se implementó parseo explícito para URLs `github.com/.../blob/...` y `raw.githubusercontent.com/...`.
- Se añadieron validaciones de contrato de fase con detección de fichero y allowlist de extensiones v1.
- Se creó `ingestGithubFileUrl` como entrypoint único para consumo por fases de auth/render/sync.

## Task Commits

Each task was committed atomically:

1. **Task 1: Definir contrato tipado y parser blob/raw** - `dc60fc2` (feat)
2. **Task 2: Implementar validación de contrato y detección de extensión** - `dbbde38` (feat)
3. **Task 3: Unificar ingestión y endurecer pruebas de regresión** - `beaa549` (feat)

## Files Created/Modified
- `src/core/url/parseGithubFileUrl.ts` - Parseo y normalización base de URL GitHub.
- `src/core/url/validateGithubFileUrl.ts` - Reglas de validación del contrato de entrada.
- `src/core/url/detectFileKind.ts` - Detección de extensión/typing para v1.
- `src/core/url/errors.ts` - Mapeo de errores internos a copy accionable.
- `src/core/url/ingestGithubFileUrl.ts` - Punto único de entrada parse+validate.
- `src/core/url/__tests__/*.test.ts` - Cobertura de casos válidos e inválidos.
- `scripts/typecheck.cjs` - Verificación sintáctica de fuentes `.ts` en ausencia de toolchain TS.
- `package.json` - Scripts `test` y `typecheck`.

## Decisions Made
- Se mantuvo scope estricto: solo URLs a fichero (`blob`/`raw`), sin navegación de repositorio.
- Se priorizó contrato determinista sobre heurísticas ambiguas en parsing.
- Se estandarizaron códigos de error para consumo estable por UI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Inicialización de test runner en repositorio vacío**
- **Found during:** Task 1
- **Issue:** El plan asume `npm test` operativo y el proyecto no tenía script de test utilizable.
- **Fix:** Se configuró `package.json` con `node --test`.
- **Files modified:** `package.json`
- **Verification:** `npm test -- src/core/url/__tests__/parseGithubFileUrl.test.ts`
- **Committed in:** `dc60fc2`

**2. [Rule 3 - Blocking] Ajuste del typecheck para `.ts` en Node 20**
- **Found during:** Task 3
- **Issue:** `node --check` falla con extensión `.ts` en Node 20 (`ERR_UNKNOWN_FILE_EXTENSION`).
- **Fix:** Se implementó typecheck sintáctico con `vm.Script` en `scripts/typecheck.cjs`.
- **Files modified:** `scripts/typecheck.cjs`
- **Verification:** `npm run typecheck`
- **Committed in:** `beaa549`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Ninguna expansión de alcance; ajustes mínimos para ejecutar verificaciones del plan en este repositorio.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 1 entrega un contrato de ingestión estable para integrarse con auth/fetch en fase 2.
- Sin bloqueos técnicos abiertos para continuar.

## Self-Check: PASSED

---
*Phase: 01-foundations-url-intake*
*Completed: 2026-03-02*
