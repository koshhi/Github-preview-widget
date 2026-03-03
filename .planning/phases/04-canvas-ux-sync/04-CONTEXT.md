# Phase 4: Canvas UX & Sync - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase define cómo se materializa el bloque embebido en canvas con apariencia nativa de Figma, cómo muestra metadatos/estado de sincronización, y cómo se comportan los refrescos manual y automático sin recrear nodos innecesariamente.

</domain>

<decisions>
## Implementation Decisions

### Diseño del bloque en canvas
- Estructura visual base: `header + body + footer de estado`.
- Densidad visual compacta, orientada a lectura rápida.
- Estilo nativo Figma: neutro/minimal, bordes suaves y tipografía sobria.
- Resize: alto flexible según contenido y ancho configurable.
- El usuario debe poder redimensionar arrastrando desde el borde del bloque.

### Metadatos y estado de sincronización
- Metadatos mínimos siempre visibles: `owner/repo`, `path`, `último sync`.
- Metadatos ubicados en el header.
- Estado de sync con badge textual + color semántico discreto.
- En error: mensaje corto visible + detalle técnico expandible.

### Refresh manual
- Refresh manual disponible en dos entradas: botón en header y menú contextual del nodo.
- Mientras refresca: estado `Syncing...` + spinner discreto en header.
- Si falla el refresh: mantener contenido previo y actualizar estado a error.
- Si tiene éxito: actualizar contenido/estado sin recrear el nodo.

### Refresh automático
- Auto-refresh al abrir/reentrar el plugin para bloques compatibles.
- Compatibilidad: solo bloques con `sourceKey` válido y estado no bloqueante.
- Si auto-refresh falla: no bloquear UI; mantener contenido previo y exponer estado error.
- Visibilidad: registrar y mostrar que fue `Auto-sync` con timestamp.

### Claude's Discretion
- Definición exacta del contenido del footer de estado (campos secundarios y orden).
- Reglas finales de elegibilidad para “estado no bloqueante” en auto-refresh.
- Microcopy final de etiquetas (`Syncing...`, éxito, error) y formato visual de badge.

</decisions>

<specifics>
## Specific Ideas

- Mantener actualización in-place del bloque para evitar “saltos” visuales en canvas.
- Doble acceso al refresh manual (header + menú contextual) para flujo rápido y descubrible.
- El bloque debe mantener lenguaje visual discreto para convivir con múltiples elementos de diseño.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 04-canvas-ux-sync*
*Context gathered: 2026-03-02*
