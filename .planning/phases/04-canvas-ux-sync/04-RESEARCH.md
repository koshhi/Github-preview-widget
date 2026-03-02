# Phase 4: Canvas UX & Sync - Research

**Researched:** 2026-03-02
**Domain:** Canvas embed composition and synchronization flow for Figma-like blocks
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Bloque embebido con estructura `header + body + footer de estado`.
- Densidad compacta, estilo neutro/minimal y apariencia nativa de Figma.
- Bloque redimensionable (alto flexible, ancho configurable) con resize por arrastre de borde.
- Metadatos siempre visibles en header: `owner/repo`, `path`, `último sync`.
- Estado de sync con badge textual y color semántico discreto.
- En error, mensaje corto visible y detalle técnico expandible.
- Refresh manual disponible en header y menú contextual.
- Refresh manual muestra `Syncing...` + spinner discreto.
- Refresh fallido mantiene contenido previo y actualiza estado de error.
- Refresh exitoso actualiza contenido/estado in-place (sin recrear nodo).
- Auto-refresh al abrir/reentrar plugin para bloques compatibles.
- Compatibilidad de auto-refresh: `sourceKey` válido + estado no bloqueante.
- Fallo en auto-refresh no bloquea UI; mantiene contenido previo con estado visible.
- Debe distinguirse `Auto-sync` en estado/historial con timestamp.

### Claude's Discretion
- Campos exactos del footer de estado y jerarquía final.
- Regla exacta de “estado no bloqueante”.
- Microcopy final y tokens visuales del badge/estado.

### Deferred Ideas (OUT OF SCOPE)
- Ninguna diferida durante la discusión.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CVS-01 | Bloque embebido nativo/limpio en canvas | Compositor de bloque con layout consistente e in-place update |
| CVS-02 | Metadatos mínimos visibles | Modelo de metadata + header estable |
| SNC-01 | Refresh manual | Action handlers para header/context menu + estado syncing |
| SNC-02 | Refresh automático en apertura/reentrada | Scheduler/trigger de auto-sync con elegibilidad por bloque |
| SNC-03 | Resultado de refresh visible | Máquina de estado `idle/syncing/success/error` con timestamp y detalle |
</phase_requirements>

## Summary

La fase debe convertir el resultado del render engine en un bloque de canvas estable, editable in-place y sincronizable. El patrón recomendado separa:

1. **Modelo de bloque** (datos + estado de sync + metadata),
2. **Compositor visual** (header/body/footer en layout compacto),
3. **Controladores de sync** (manual y auto con reglas de elegibilidad).

**Primary recommendation:** crear un módulo `embedBlock` con API `createBlock`, `updateBlock`, `refreshBlock`, `refreshEligibleBlocksOnOpen` y un estado explícito de sincronización.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript/CommonJS actual del repo | repo-default | Lógica de composición/sync desacoplada y testeable | Consistencia con fases previas |
| `node:test` | runtime-native | Verificación de reglas de sync y estado visible | Ya adoptado |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Sin dependencias extra v1 | - | Mantener superficie mínima | Este alcance puede cubrirse con utilidades internas |

## Architecture Patterns

### Recommended Project Structure
```
src/
└── core/canvas/
    ├── types.ts
    ├── embedBlockModel.ts
    ├── composeEmbedBlock.ts
    ├── updateEmbedBlock.ts
    ├── syncState.ts
    ├── refreshManual.ts
    ├── refreshAuto.ts
    └── __tests__/
        ├── composeEmbedBlock.test.ts
        ├── refreshManual.test.ts
        ├── refreshAuto.test.ts
        └── syncState.test.ts
```

### Pattern 1: In-Place Node Update
**What:** Nunca recrear bloque para refresh; actualizar solo nodos afectados.
**When to use:** Cumplir SNC-01/SNC-03 y evitar “saltos” visuales en canvas.

### Pattern 2: Sync State Machine
**What:** Estado explícito `idle -> syncing -> success|error`.
**When to use:** Mostrar estado claro y consistente en manual/auto refresh.

### Pattern 3: Eligibility Gate for Auto-Sync
**What:** `canAutoRefresh(block)` centralizado (sourceKey válido + no estado bloqueante).
**When to use:** Evitar refresh automáticos inválidos y ruido en UX.

### Anti-Patterns to Avoid
- Reemplazar nodo completo en cada refresh (pierde estabilidad visual).
- Mezclar composición visual y lógica de sync en una sola función gigante.
- Auto-refresh sin trazabilidad de origen (`manual` vs `auto`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Motor complejo de layout | Sistema ad hoc hiper-flexible | Plantilla de layout fija con parámetros mínimos | Requisito v1 acotado |
| Scheduler complejo de auto-sync | Cron/intervalos genéricos permanentes | Trigger por apertura/reentrada + filtro de elegibilidad | Alineado con alcance SNC-02 |

## Common Pitfalls

### Pitfall 1: Estado visual inconsistente tras error
**What goes wrong:** el badge dice error pero timestamp/metadata no se actualizan.
**How to avoid:** transición de estado atómica que actualice badge + timestamp + detalle.

### Pitfall 2: Refresh manual “destruye” formato del bloque
**What goes wrong:** reemplazo completo rompe tamaño o posición.
**How to avoid:** update in-place por secciones (header/body/footer) preservando geometría.

### Pitfall 3: Auto-refresh compite con manual
**What goes wrong:** doble refresh simultáneo genera race conditions de estado.
**How to avoid:** lock por bloque durante `syncing` y cola simple por trigger.

## Code Examples

### Sync state shape (reference)
```ts
type SyncState = {
  status: "idle" | "syncing" | "success" | "error";
  mode: "manual" | "auto";
  lastSyncAt?: string;
  lastErrorMessage?: string;
  lastErrorDetails?: string;
};
```

### Auto-refresh eligibility (reference)
```ts
function canAutoRefresh(block) {
  return Boolean(block.sourceKey) && block.sync.status !== "syncing" && block.sync.status !== "blocked";
}
```

## Open Questions

1. ¿Se guarda historial de más de un evento de sync en v1?
   - Recomendación: v1 solo último evento + modo (`manual/auto`).
2. ¿Context menu debe exponer acciones extra además de refresh?
   - Recomendación: mantenerlo mínimo en v1 (refresh + estado).

## Metadata

**Confidence breakdown:**
- Composición de bloque + metadatos visibles: HIGH
- Flujo manual/auto con estado trazable: HIGH
- Integración exacta con API de nodos del runtime final: MEDIUM

**Research date:** 2026-03-02
**Valid until:** 2026-04-01
