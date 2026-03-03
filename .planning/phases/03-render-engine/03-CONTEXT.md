# Phase 3: Render Engine - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase define cómo renderizar correctamente y con rapidez contenido técnico (`.js/.ts/.json/.txt`, Markdown y Mermaid), incluyendo degradaciones controladas y reglas operativas para cumplir objetivo inicial de preview en menos de 2 segundos.

</domain>

<decisions>
## Implementation Decisions

### Estrategia de render por tipo
- Para `.js/.ts/.json/.txt`, usar vista base monoespaciada con resaltado básico.
- En `.json`, aplicar `pretty-print` automático cuando venga minificado.
- Si el contenido es raro/corrupto, hacer fallback a texto plano con aviso suave.
- Mantener un layout base común para todos los tipos con variaciones por tipo.

### Cobertura Markdown v1
- Elementos obligatorios v1: títulos, párrafos, listas, enlaces, tablas y bloques de código.
- HTML embebido en Markdown no se renderiza; se muestra como texto por seguridad.
- Bloques de código Markdown: monoespaciado con resaltado básico por lenguaje.
- Estructuras no soportadas: degradación elegante sin romper la vista.

### Comportamiento Mermaid
- Para Mermaid válido, usar toggle código/diagrama.
- Si Mermaid falla al parsear, mostrar fallback con bloque de código y mensaje claro.
- Si hay varios bloques Mermaid y uno falla, hacer render parcial: válidos como diagrama y fallidos en fallback.
- Mensajes de error Mermaid: mensaje corto para usuario + detalle técnico opcional.

### Reglas objetivo <2s
- Límite v1 de render rápido: hasta ~300 KB en render completo.
- Si supera límite: render parcial inicial + aviso + opción "ver completo".
- Priorizar `time-to-first-preview` <2s, aceptando carga progresiva posterior.
- En refrescos posteriores del mismo archivo, reutilizar cache/artefactos para mantener rapidez percibida.

### Claude's Discretion
- Heurística exacta para detectar JSON “minificado”.
- Diseño final del toggle Mermaid (micro-interacción visual concreta).
- Formato visual del aviso suave y del detalle técnico expandible.

</decisions>

<specifics>
## Specific Ideas

- El comportamiento de Mermaid válido debe permitir alternar entre código fuente y diagrama en la misma preview.
- El fallback ante errores debe ser no bloqueante y mantener visible el contenido original para diagnóstico.
- El objetivo de velocidad se interpreta como “mostrar algo útil en <2s” incluso si el render completo continúa progresivamente.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 03-render-engine*
*Context gathered: 2026-03-02*
