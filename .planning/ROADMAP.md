# Roadmap: GitHub Preview Widget for Figma

**Milestone:** v1.1 Real Widget Runtime
**Created:** 2026-03-03
**Depth:** quick
**Total phases:** 4
**Total v1.1 requirements mapped:** 13/13

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 5 | Widget Runtime Bootstrap | Complete (2026-03-03) | WDG-01, WDG-02, QLT-04 | 4 |
| 6 | End-to-End Widget Rendering | Conectar core con Widget API para crear embeds reales | WDG-03, INT-04, INT-05 | 4 |
| 7 | Private Access & PAT Safety | Resolver flujo privado con PAT y restricciones de seguridad | SEC-01, SEC-02, SEC-03 | 4 |
| 8 | Sync, UAT & Docs | Cerrar refresh in-place, estado sync y guía de uso real | SNC-07, SNC-08, SNC-09, QLT-05 | 5 |

## Phase 5: Widget Runtime Bootstrap

**Goal:** Tener widget cargable en Figma con UI inicial para intake de URL y scripts de desarrollo mínimos.

**Requirements:**
- WDG-01
- WDG-02
- QLT-04

**Success criteria:**
1. `manifest.json` de widget válido permite importar y ejecutar en Figma Dev Mode.
2. UI del widget abre correctamente y permite pegar URL de fichero GitHub.
3. Existe canal UI bridge para enviar acciones de create/refresh al runtime del widget.
4. Repositorio incorpora scripts de build/check del widget sin romper `npm test` ni `npm run typecheck`.

## Phase 6: End-to-End Widget Rendering

**Goal:** Convertir el pipeline core en flujo real de creación de instancia embebida en canvas.

**Requirements:**
- WDG-03
- INT-04
- INT-05

**Success criteria:**
1. URL válida dispara ingestión, lectura de contenido y render desde el widget runtime.
2. Se crea instancia embebida real en canvas con layout base (header/body/footer).
3. Markdown y Mermaid se muestran correctamente o caen en fallback controlado.
4. Caso nominal público cumple objetivo de primer resultado visible en <2s para límites definidos.

## Phase 7: Private Access & PAT Safety

**Goal:** Hacer fiable el flujo de repositorio privado con PAT por fichero sin exponer secretos.

**Requirements:**
- SEC-01
- SEC-02
- SEC-03

**Success criteria:**
1. Si archivo es privado y no hay PAT, el widget muestra advertencia y permite introducir token.
2. PAT válido desbloquea lectura/render sin reiniciar flujo de usuario.
3. PAT inválido/expirado y PAT sin scopes muestran mensajes diferenciados.
4. Verificación explícita: el PAT no aparece en estado sincronizado, metadata del nodo ni payload visual del canvas.

## Phase 8: Sync, UAT & Docs

**Goal:** Cerrar comportamiento de sync real en widget y dejar validación reproducible para equipo.

**Requirements:**
- SNC-07
- SNC-08
- SNC-09
- QLT-05

**Success criteria:**
1. Refresh manual actualiza contenido de la misma instancia (sin recrear el widget).
2. Refresh automático al abrir/reanudar aplica solo a instancias elegibles.
3. Estado `idle/syncing/success/error` y último resultado quedan visibles.
4. README incluye pasos reales para probar widget en Figma.
5. UAT valida: pegar URL y ver contenido <2s, refresh manual/auto funcionando, privado con PAT sin errores críticos.

## Traceability Validation

- v1.1 requirements total: 13
- Requirements mapped to phases: 13
- Unmapped: 0
- Duplicate mapping: 0

---
*Last updated: 2026-03-03 after phase 5 execution*
