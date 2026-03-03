# Phase 6: End-to-End Widget Rendering - Research

**Researched:** 2026-03-03
**Domain:** Widget runtime orchestration for URL -> GitHub read -> render -> in-place embed update
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Flujo de creación por botón explícito `Create preview`.
- Feedback durante carga en dos canales: inline + `figma.notify`.
- URL inválida: error inline y sin crear/actualizar instancia.
- UI permanece abierta tras éxito.
- Body compacto, contenido completo para code/json con scroll interno.
- Header siempre visible con `owner/repo`, `path`, `syncState`, `lastSync`.
- Widget redimensionable por borde.
- Markdown base completo en fase 6.
- Mermaid en fase 6 como bloque de código (sin diagrama).
- Mermaid inválido: fallback a code + warning visible.
- Persistir synced state mínimo (`sourceKey`, `sourceUrl`, `syncState`, `lastSync`, `warnings`, snapshot).
- En error de fetch/render mantener último contenido válido y marcar estado error.
- Objetivo de UX: primer resultado parcial rápido y completado progresivo.
- Cambio de URL en la misma instancia: update in-place.

### Claude's Discretion
- Umbrales de modo progresivo.
- Microcopy exacto de estados/warnings.
- Ajustes visuales finos manteniendo layout compacto.

### Deferred Ideas (OUT OF SCOPE)
- Render visual Mermaid como diagrama nativo.
- Flujo completo privado PAT runtime (fase 7).
- Auto-refresh de reapertura (fase 8).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WDG-03 | Instancia embebida real con estructura limpia y metadatos | Adaptador de estado widget + update in-place de embedBlock |
| INT-04 | Pipeline completo desde URL válida a render y composición | Runtime orchestrator que encadena `readGithubFileWithAuth` + `renderFilePreview` + `updateEmbedBlockInPlace` |
| INT-05 | Markdown + Mermaid con fallback controlado | Normalizador de bloques para forzar Mermaid code-view en fase 6 y warning tracking |
</phase_requirements>

## Summary

Phase 6 debe convertir el seed bootstrap de fase 5 en un flujo real de preview y actualización sobre la misma instancia del widget.

Recomendación principal:
1. Crear un **runtime orchestrator** puro (testeable fuera de Figma API) que haga URL intake -> read -> render -> normalize -> compose/update.
2. Mantener `code.ts` como capa de coordinación UI/synced-state.
3. Añadir normalizador de salida render para cumplir decisión de Mermaid-as-code en esta fase.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| módulos core existentes (`url/github/render/canvas`) | repo-default | Reuso del pipeline validado en v1.0 | Minimiza riesgo funcional |
| `node:test` | runtime-native | Tests de orquestación y normalización | Consistencia con repo |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `esbuild` | already added | Rebuild rápido del runtime tras cambios en `code.ts` | cada iteración del widget |

## Architecture Patterns

### Recommended Project Structure
```text
src/widget/
  runtime/
    createOrRefreshEmbedFromUrl.ts
    normalizeRenderForWidget.ts
    persistWidgetSnapshot.ts
  code.ts
  ui.html
  __tests__/
    runtimePipeline.test.ts
    renderNormalization.test.ts
```

### Pattern 1: Pure Orchestrator + Thin UI Runtime
**What:** lógica de negocio en función pura con dependencias inyectables.
**When to use:** cubrir INT-04 con tests sin depender de Figma global.

### Pattern 2: In-Place Embed Mutation
**What:** siempre actualizar la misma instancia con `updateEmbedBlockInPlace`.
**When to use:** cumplir WDG-03 y mantener continuidad visual.

### Pattern 3: Render Normalization Layer
**What:** transformar salida render (`mermaid` -> `code` en fase 6) antes de persistir.
**When to use:** cumplir decisión de contexto sin tocar motor core global.

### Anti-Patterns to Avoid
- Llamar fetch/render directamente desde handlers UI sin capa de orquestación.
- Persistir payload completo bruto en synced state.
- Limpiar body al fallar render/fetch (rompe continuidad de lectura).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Nuevo parser de URL para widget | duplicación de lógica | `ingestGithubFileUrl`/`readGithubFileWithAuth` | ya probado y cubierto |
| Nuevo motor markdown/mermaid | renderer paralelo | `renderFilePreview` + normalización post-render | evita divergencia funcional |

## Common Pitfalls

### Pitfall 1: Estado synced demasiado grande
**What goes wrong:** serializar preview completo sin límites degrada rendimiento.
**How to avoid:** snapshot mínimo persistente + body render derivable.

### Pitfall 2: Mermaid mostrado como diagrama por defecto
**What goes wrong:** contradice decisión fase 6 y complica UX.
**How to avoid:** normalizador explícito para convertir bloques `mermaid` a `code` en fase 6.

### Pitfall 3: Error de fetch sobreescribe contenido válido
**What goes wrong:** usuario pierde contexto en errores transitorios.
**How to avoid:** conservar último `embedBlock` válido y actualizar solo `syncState` + warnings.

## Code Examples

### Runtime orchestration contract (reference)
```ts
async function createOrRefreshEmbedFromUrl(input, deps) {
  // 1) readGithubFileWithAuth
  // 2) renderFilePreview
  // 3) normalizeRenderForWidget
  // 4) updateEmbedBlockInPlace
}
```

### Mermaid normalization (reference)
```ts
if (block.type === "mermaid") {
  return { type: "code", language: "mermaid", content: block.content };
}
```

## Open Questions

1. ¿El snapshot persistente debe guardar todos los bloques o solo resumen + hash?
   - Recomendación: mantener snapshot mínimo + `sourceKey` y métricas, no payload redundante completo.
2. ¿Mostrar warnings como lista completa o primer warning + contador?
   - Recomendación: primer warning visible + detalle expandible para mantener compacidad.

## Metadata

**Confidence breakdown:**
- Encadenamiento runtime con core existente: HIGH
- Persistencia synced state adecuada: MEDIUM-HIGH
- Ajuste visual de bloques complejos dentro de widget: MEDIUM

**Research date:** 2026-03-03
**Valid until:** 2026-04-03
