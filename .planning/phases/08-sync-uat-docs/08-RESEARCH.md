# Phase 8: Sync, UAT & Docs - Research

**Researched:** 2026-03-03
**Domain:** Final sync UX hardening in widget runtime + reproducible UAT/documentation handoff
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Refresh manual disponible en boton UI y property menu.
- Si hay `syncing`, se ignora trigger duplicado (sin encolar ni cancelar en caliente).
- Mantener contenido previo visible durante refresh y tambien en error.
- Auto-refresh al abrir/reanudar (no por foco), solo en instancias elegibles.
- Auto-refresh no bloquea UI cuando falla; deja `error` visible y conserva contenido.
- Cooldown por instancia para auto-refresh (>=60s recomendado).
- Estado visible en embed header + UI, con detalle expandible opcional.
- Persistencia por instancia de `syncState`, `lastSync`, `lastResult`.
- UAT en checklist reproducible paso a paso con expected result.
- README operativo: setup Figma + manifest + flujo publico + privado + troubleshooting.
- Cierre de fase condicionado a UAT completo + README + evidencias.

### Claude's Discretion
- Microcopy final de mensajes de sync (fuera de auth).
- Formato exacto de evidencias UAT.
- Valor final de cooldown por instancia conservador.

### Deferred Ideas (OUT OF SCOPE)
- Benchmark automatizado y telemetria avanzada de latencia.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SNC-07 | Refresh manual in-place en misma instancia | Integrar trigger manual UI + property menu reutilizando `createOrRefreshEmbedFromUrl` y lock `syncing` |
| SNC-08 | Auto-refresh al abrir/reanudar para instancias elegibles | Reusar reglas de elegibilidad + cooldown por instancia y ejecucion no bloqueante |
| SNC-09 | Estado sync visible `idle/syncing/success/error` y ultimo resultado | Expandir snapshot/estado widget y payload UI con detalle legible |
| QLT-05 | README con pasos reales end-to-end | Actualizar README/README.es y añadir UAT checklist versionado en fase 8 |
</phase_requirements>

## Summary

La base tecnica ya existe en core (`refreshManual`, `refreshAuto`, `syncState`) y en widget runtime (`createOrRefreshEmbedFromUrl`). El gap de fase 8 no es de motor, sino de **integracion final de UX + gobernanza de refresco + documentación verificable**.

Recomendacion principal:
1. Implementar un **coordinador de sync de widget** que centralice locks (`syncing`) + cooldown + policy manual/auto.
2. Exponer en UI/estado un modelo consistente de ultimo resultado (`lastResult.message/details/mode/time`).
3. Cerrar fase con artefactos de validacion humana (`08-UAT.md`) + README operativa para equipo.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `src/core/canvas/*` | repo-default | Reusar transiciones sync + update in-place | Evita reimplementar comportamiento ya testeado |
| `node:test` | runtime-native | Cobertura de reglas de sync manual/auto y estado UX | Consistencia con suites existentes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `figma.timer` o timestamp local | runtime API | cooldown por instancia al abrir/reanudar | evitar rafagas auto-sync |
| docs markdown | n/a | checklist UAT + guía reproducible | cierre QLT-05 |

## Architecture Patterns

### Recommended Project Structure
```text
src/widget/
  runtime/
    syncCoordinator.ts
    createOrRefreshEmbedFromUrl.ts
    persistWidgetSnapshot.ts
  code.ts
  ui.html
  __tests__/
    syncCoordinator.test.ts
    syncVisibility.test.ts
planning/phases/08-sync-uat-docs/
  08-UAT.md
README.md
README.es.md
```

### Pattern 1: Single Sync Orchestrator for Widget
**What:** unificar trigger manual/auto y reglas de lock/cooldown.
**When to use:** cumplir SNC-07/08 sin duplicar ramas de estado en `code.ts`.

### Pattern 2: Sticky Last-Result Surface
**What:** estado corto siempre visible + detalle bajo demanda.
**When to use:** cumplir SNC-09 sin saturar UI.

### Pattern 3: Reproducible Validation-by-Checklist
**What:** UAT declarativo + pasos README que otra persona puede seguir.
**When to use:** cerrar QLT-05 con evidencia trazable.

### Anti-Patterns to Avoid
- Ejecutar auto-refresh en cada foco o evento UI menor.
- Borrar preview durante syncing/error (rompe continuidad de lectura).
- Documentación solo técnica sin flujo de prueba real en Figma.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Nueva maquina de estados en widget | estado ad-hoc en strings sueltos | `transitionSyncState` + `buildSyncBadge` | consistencia visual/semantica |
| Auto-refresh sin control de frecuencia | loop por cada mount/evento | cooldown por instancia | evita spam de red y ruido UX |
| UAT implícito en commits | "tested locally" sin pasos | `08-UAT.md` + sección README | reproducibilidad en equipo |

## Common Pitfalls

### Pitfall 1: doble refresh compitiendo sobre la misma instancia
**What goes wrong:** se pisan estados y detalles de resultado.
**How to avoid:** lock explícito cuando status es `syncing`.

### Pitfall 2: auto-refresh sobre instancias no elegibles
**What goes wrong:** errores innecesarios y ruido visual.
**How to avoid:** gate por `sourceKey`, `lastUrl`, no `syncing`, cooldown.

### Pitfall 3: criterio `<2s` ambiguo sin guía
**What goes wrong:** UAT no repetible entre personas.
**How to avoid:** definir caso nominal acotado y expected outcome perceptivo común.

## Code Examples

### Lock de refresh manual (reference)
```ts
if (embedBlock?.sync?.status === "syncing") {
  postRuntimeStatus("loading", "Syncing...");
  return;
}
```

### Cooldown de auto-refresh por instancia (reference)
```ts
const elapsed = nowMs - lastAutoRefreshAtMs;
if (elapsed < AUTO_REFRESH_COOLDOWN_MS) return { skipped: true, reason: "cooldown" };
```

## Open Questions

1. ¿El auto-refresh se dispara una sola vez por apertura de UI o tambien al reactivar documento?
   - Recomendación: una vez por apertura/reanudacion de runtime, con cooldown por instancia.
2. ¿Dónde ubicar detalle expandible de `lastResult`?
   - Recomendación: panel UI (detallado) + footer/header en embed (resumen).

## Metadata

**Confidence breakdown:**
- Integración manual/auto con base existente: HIGH
- Modelo final de visibilidad estado en widget UI: MEDIUM-HIGH
- Cierre documental UAT+README reproducible: HIGH

**Research date:** 2026-03-03
**Valid until:** 2026-04-03
