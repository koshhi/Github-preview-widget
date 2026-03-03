# Phase 6: End-to-End Widget Rendering - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase conecta el pipeline core (ingestión URL + lectura GitHub + render) con el runtime real del widget para crear/actualizar una instancia embebida en canvas con layout base (`header/body/footer`). Incluye render de Markdown en bloques base y estrategia de Mermaid con fallback controlado, manteniendo objetivo nominal de primer resultado <2s.

</domain>

<decisions>
## Implementation Decisions

### Flujo de creación UI
- Creación mediante acción explícita con botón `Create preview` (no auto-disparo al pegar URL).
- Durante carga: feedback doble (`Syncing...` inline + `figma.notify`).
- URL inválida: error inline en UI y no se crea ni actualiza instancia.
- En éxito: la UI permanece abierta y muestra confirmación (`Preview created`).

### Presentación de contenido en widget
- Densidad visual compacta en el body.
- El contenido puede crecer, pero con scroll interno habilitado para contenidos largos.
- Para código/JSON largo: mostrar contenido completo con scroll interno (sin truncado por defecto).
- Header siempre visible con metadata completa: `owner/repo`, `path`, `syncState`, `lastSync`.
- La instancia debe mantener capacidad de resize del widget por borde.

### Markdown + Mermaid
- Markdown base completo en fase 6 (títulos, listas, tablas, bloques de código).
- Mermaid en fase 6 se mantiene como bloque de código (sin render de diagrama todavía).
- Si hay fallo en interpretación/render de Mermaid: fallback a bloque code + warning visible.
- Warnings visibles en badge/header y detalle visible en footer.

### Actualización de instancia y metadatos
- Persistir en synced state: `sourceKey`, `sourceUrl`, `syncState`, `lastSync`, `warnings` y snapshot mínimo de render.
- Si falla fetch/render: mantener último contenido válido y marcar estado de error.
- Estrategia de tiempo objetivo: primer resultado parcial rápido + completado progresivo.
- Si cambia la URL en la misma instancia: actualizar in-place (misma instancia, metadata y contenido actualizados).

### Claude's Discretion
- Umbrales exactos para modo progresivo (tamaño/líneas) manteniendo UX consistente.
- Microcopy exacto de warnings y estados, respetando tono técnico directo.
- Detalles de layout fino (espaciado interno, jerarquía tipográfica) dentro de estilo compacto.

</decisions>

<specifics>
## Specific Ideas

- Prioridad explícita a interacción controlada por usuario (botón) para evitar renders accidentales.
- La combinación de contenido completo + scroll interno + resize busca equilibrio entre fidelidad y legibilidad.
- Mantener Mermaid como code en esta fase reduce riesgo y acelera entrega del flujo end-to-end real.

</specifics>

<deferred>
## Deferred Ideas

- Render visual de diagramas Mermaid como diagramas nativos (fase futura, no en fase 6).
- Flujo completo de PAT privado en runtime real (fase 7).
- Política completa de auto-refresh de elegibilidad y comportamiento en reapertura (fase 8).

</deferred>

---

*Phase: 06-end-to-end-widget-rendering*
*Context gathered: 2026-03-03*
