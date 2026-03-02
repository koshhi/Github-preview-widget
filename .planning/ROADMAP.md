# Roadmap: GitHub Preview Widget for Figma

**Created:** 2026-03-02
**Depth:** quick
**Total phases:** 4
**Total v1 requirements mapped:** 15/15

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundations & URL Intake | Complete (2026-03-02) | SRC-01, SRC-02, SRC-03 | 3 |
| 2 | Private Access with PAT | Complete (2026-03-02) | AUTH-01, AUTH-02, AUTH-03 | 3 |
| 3 | Render Engine | Render correcto de código, Markdown y Mermaid con objetivo <2s | RND-01, RND-02, RND-03, RND-04 | 4 |
| 4 | Canvas UX & Sync | Entrega de bloque nativo en canvas con refresco manual/automático | CVS-01, CVS-02, SNC-01, SNC-02, SNC-03 | 5 |

## Phase 1: Foundations & URL Intake

**Goal:** Establecer la estructura del plugin y garantizar ingestión fiable de URLs de archivo GitHub.

**Requirements:**
- SRC-01
- SRC-02
- SRC-03

**Success criteria:**
1. Usuario pega una URL válida (`blob/raw`) y el plugin reconoce owner/repo/ref/path sin ambigüedad.
2. URLs inválidas producen errores claros con acción sugerida.
3. Tipos de archivo soportados en v1 se detectan correctamente y enrutan al pipeline adecuado.

**Plans:** 1/1 plans complete

Plans:
- [x] `01-01-PLAN.md` — Contrato de ingestión URL (parse + validate + detect) con cobertura SRC-01/02/03

## Phase 2: Private Access with PAT

**Goal:** Habilitar acceso fiable a repos públicos/privados mediante PAT con UX de error clara.

**Requirements:**
- AUTH-01
- AUTH-02
- AUTH-03

**Success criteria:**
1. Usuario puede guardar PAT en configuración del plugin sin exponerlo en canvas.
2. Archivo en repo privado se descarga correctamente con PAT válido.
3. Errores por token inválido/sin permisos se muestran de forma comprensible.

**Plans:** 1/1 plans complete

Plans:
- [x] `02-01-PLAN.md` — Flujo de acceso público/privado con PAT por fichero, retry=1 y UX de errores AUTH-01/02/03

## Phase 3: Render Engine

**Goal:** Entregar render correcto y rápido de contenido técnico (texto/código/markdown/mermaid).

**Requirements:**
- RND-01
- RND-02
- RND-03
- RND-04

**Success criteria:**
1. Archivos `.js/.ts/.json/.txt` muestran contenido con resaltado básico legible.
2. Markdown renderiza correctamente estructuras comunes (incluyendo tablas y bloques de código).
3. Bloques Mermaid se transforman en diagramas visibles o fallback controlado si fallan.
4. Primer render cumple objetivo de <2s bajo límites de tamaño definidos.

**Plans:** 0/1 plans complete

Plans:
- [ ] `03-01-PLAN.md` — Pipeline de render para código/markdown/mermaid con fallback controlado y objetivo <2s

## Phase 4: Canvas UX & Sync

**Goal:** Integrar el embed en canvas con apariencia nativa y sincronización usable por equipos.

**Requirements:**
- CVS-01
- CVS-02
- SNC-01
- SNC-02
- SNC-03

**Success criteria:**
1. Se crea/actualiza un bloque embebido con layout limpio y visualmente nativo de Figma.
2. El bloque muestra metadatos de origen y último estado de sincronización.
3. Refresh manual actualiza contenido y estado sin recrear todo el bloque.
4. Refresh automático se ejecuta en apertura/reentrada del plugin para bloques soportados.
5. Usuario entiende claramente si la última sincronización fue exitosa o falló.

## Traceability Validation

- v1 requirements total: 15
- Requirements mapped to phases: 15
- Unmapped: 0
- Duplicate mapping: 0

---
*Last updated: 2026-03-02 after phase 2 execution*
