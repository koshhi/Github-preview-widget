# Phase 3: Render Engine - Research

**Researched:** 2026-03-02
**Domain:** Rendering pipeline for code/text/markdown/mermaid with fast first preview
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- `.js/.ts/.json/.txt` deben usar vista monoespaciada con resaltado básico.
- `.json` aplica pretty-print automático si está minificado.
- Contenido raro/corrupto hace fallback a texto plano con aviso suave.
- Layout base común para tipos renderizados, con variaciones por tipo.
- Markdown v1 debe cubrir: títulos, párrafos, listas, enlaces, tablas y bloques de código.
- HTML embebido en Markdown no se renderiza, se muestra como texto.
- Bloques de código Markdown con resaltado básico.
- Estructuras Markdown no soportadas degradan elegantemente sin romper vista.
- Mermaid válido usa toggle código/diagrama.
- Mermaid inválido hace fallback a código + mensaje claro.
- Si falla un bloque Mermaid entre varios, el render debe ser parcial.
- Errores Mermaid: mensaje corto + detalle técnico opcional.
- Objetivo de tiempo: first preview <2s.
- Límite v1 de render completo: ~300 KB.
- Si supera límite: render parcial inicial + aviso + opción de ver completo.
- Reutilizar cache/artefactos en refrescos para mantener rapidez percibida.

### Claude's Discretion
- Heurística exacta para detectar JSON minificado.
- Diseño concreto del toggle Mermaid.
- Formato exacto del aviso suave y detalle técnico expandible.

### Deferred Ideas (OUT OF SCOPE)
- Ninguna diferida en esta discusión.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RND-01 | Texto/código con resaltado básico | Motor de resaltado mínimo por extensión + fallback seguro |
| RND-02 | Markdown correcto en estructuras comunes | Render Markdown con allowlist explícita y degradación controlada |
| RND-03 | Mermaid visible o fallback | Parser/render Mermaid con manejo de errores por bloque |
| RND-04 | First preview <2s | Presupuesto de tamaño + render progresivo + cache |
</phase_requirements>

## Summary

La fase debe introducir un motor de render desacoplado de auth y de canvas. El patrón recomendado es un pipeline puro:

1. Normalizar entrada (`kind`, tamaño, metadata)
2. Resolver estrategia por tipo (`code/text/markdown`)
3. Ejecutar render con fallback por bloque (especialmente Mermaid)
4. Devolver un modelo de preview estable para que la capa UI/canvas lo pinte en fase 4

**Primary recommendation:** construir un `renderFilePreview` que orqueste subrenderers (`code`, `markdown`, `mermaid`) y aplique política de rendimiento (`maxFullRenderBytes`, `progressive`).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript/CommonJS actual del repo | repo-default | Lógica de render desacoplada y testeable | Consistencia con fases 1-2 |
| `node:test` | runtime-native | Verificación de reglas de render y fallback | Ya adoptado en repo |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Sin dependencia externa en v1 (heurísticas mínimas) | - | Reducir riesgo de integración temprana | Si se prioriza entrega rápida y control de edge cases |

## Architecture Patterns

### Recommended Project Structure
```
src/
└── core/render/
    ├── types.ts
    ├── detectMinifiedJson.ts
    ├── highlightCode.ts
    ├── renderMarkdown.ts
    ├── renderMermaidBlocks.ts
    ├── performancePolicy.ts
    ├── renderFilePreview.ts
    └── __tests__/
        ├── highlightCode.test.ts
        ├── renderMarkdown.test.ts
        ├── renderMermaidBlocks.test.ts
        └── renderFilePreview.test.ts
```

### Pattern 1: Render Model First
**What:** Los renderers no generan UI final; generan un `preview model` estable.
**When to use:** Cuando el canvas/UI final llega en fases posteriores y se quiere minimizar refactors.

### Pattern 2: Progressive-First for Large Inputs
**What:** Para entradas >300 KB, entregar payload parcial + bandera `truncated/progressive`.
**When to use:** Cumplir RND-04 sin bloquear render completo de contenido grande.

### Pattern 3: Mermaid Block Isolation
**What:** Cada bloque Mermaid se procesa aisladamente.
**When to use:** Evitar que un error de bloque rompa todo el markdown (decisión de render parcial).

### Anti-Patterns to Avoid
- Un único renderer monolítico mezclando código, markdown y mermaid.
- Abortar todo el markdown por fallo en un único bloque Mermaid.
- Objetivo <2s basado en “documento completo listo” en lugar de “first preview visible”.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Parser markdown full-spec | Implementación completa CommonMark desde cero | Parser controlado para subset v1 + tests de cobertura | Menor superficie de fallo |
| Highlight avanzado multi-lenguaje | Lexer complejo v1 | resaltado básico por patrón/extensión | Suficiente para RND-01 |
| Cache distribuida compleja | invalidación sofisticada prematura | cache en memoria por `sourceKey` + hash simple | Necesidad real de v1 |

## Common Pitfalls

### Pitfall 1: JSON pretty-print rompe tiempo objetivo
**What goes wrong:** Parse/stringify en entradas grandes bloquea primer render.
**How to avoid:** aplicar pretty-print solo dentro de umbral de bytes y/o en modo progresivo.

### Pitfall 2: Mermaid rompe markdown global
**What goes wrong:** Error en un bloque invalida todo el árbol render.
**How to avoid:** aislación por bloque + fallback local por bloque.

### Pitfall 3: Sanitización inexistente en markdown
**What goes wrong:** HTML embebido se ejecuta/renderiza de forma no deseada.
**How to avoid:** no renderizar HTML en v1 y tratarlo como texto.

## Code Examples

### Render result shape (reference)
```ts
type RenderPreviewResult = {
  ok: boolean;
  preview: {
    kind: "code" | "markdown" | "text";
    blocks: Array<{ type: string; content: string; meta?: Record<string, string> }>;
    truncated: boolean;
    progressive: boolean;
    warnings: string[];
  };
  metrics: {
    inputBytes: number;
    firstPreviewMs: number;
  };
};
```

## Open Questions

1. ¿El parser markdown debe soportar anidaciones complejas de tablas/listas en v1?
   - Recomendación: soportar estructuras comunes primero y degradar casos extremos.
2. ¿Dónde persistir cache de render entre sesiones plugin?
   - Recomendación: cache en memoria en fase 3; persistencia diferida a fase 4 si hace falta.

## Metadata

**Confidence breakdown:**
- Cobertura funcional RND-01/02/03 con pipeline modular: HIGH
- Objetivo RND-04 bajo inputs reales de equipo: MEDIUM (depende del runtime final del plugin/UI)

**Research date:** 2026-03-02
**Valid until:** 2026-04-01
