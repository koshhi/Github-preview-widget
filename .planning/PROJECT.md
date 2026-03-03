# GitHub Preview Widget for Figma

## What This Is

Plugin de Figma para embeber en el canvas el contenido de un fichero alojado en GitHub, manteniendo una apariencia limpia y nativa de Figma. Está orientado a equipos de diseño y desarrollo que necesitan consultar documentación técnica y contenido fuente sin salir de Figma.

## Core Value

Pegar una URL de fichero en GitHub y verlo correctamente en el canvas de Figma en menos de 2 segundos.

## Current State (v1.0 Shipped)

- v1.0 entregado con pipeline completo: URL intake, auth por PAT, render técnico y UX de canvas con sync.
- Requisitos v1 completados: 15/15 (SRC, AUTH, RND, CVS, SNC).
- Arquitectura actual modular por dominios en `src/core/{url,auth,github,render,canvas}`.

## Requirements

### Validated

- ✓ Pegado de URL GitHub de fichero con parse/validate robusto (v1.0)
- ✓ Acceso a repos privados con PAT por fichero y errores de auth claros (v1.0)
- ✓ Preview de texto/código/Markdown/Mermaid con estrategia de performance (v1.0)
- ✓ Sync manual y automático in-place con estado visible de éxito/error (v1.0)

### Active (Next Milestone Candidates)

- [ ] OAuth de GitHub como alternativa a PAT manual (`AUTH-04`).
- [ ] Navegación de árbol de repositorio para seleccionar archivos sin pegar URL (`CNT-02`).
- [ ] Manejo de ficheros muy grandes con paginación o preview parcial avanzada (`CNT-03`).
- [ ] Soporte de más extensiones (`.yml/.yaml/.csv/.xml`) (`CNT-01`).

### Out of Scope

- Edición del archivo remoto desde Figma — sigue fuera de alcance en v1.x.
- Gestión multi-repo/multi-org avanzada de credenciales — diferido hasta validar OAuth.
- Soporte de carpetas/repos completos sin selección de fichero — diferido para v2.

## Next Milestone Goals

1. Reducir fricción de acceso en repos privados (evaluar OAuth + fallback PAT).
2. Mejorar descubribilidad de contenido (selector de archivo en repo).
3. Escalar preview para archivos más grandes y más tipos de contenido.

## Context

El producto ya cubre el caso crítico de documentación viva dentro de canvas, incluyendo documentación interna en repos privados. El siguiente salto de valor está en reducir fricción de entrada (menos dependencia de URL manual y PAT) y ampliar cobertura de formatos/tamaño.

## Constraints

- **Platform**: runtime de plugin Figma (main + UI separados).
- **Performance**: mantener percepción de preview inmediato (<2s inicial en casos nominales).
- **Security**: no exponer secretos en canvas ni serialización del nodo.
- **Scope**: priorizar visualización/sync fiable antes de edición remota.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| URL de fichero como entrada principal en v1 | Minimiza complejidad de UX inicial | ✓ Good |
| PAT por fichero en v1 | Entrega rápida para repos privados sin OAuth | ✓ Good |
| Render Markdown + Mermaid desde v1 | Alto valor para documentación técnica | ✓ Good |
| Sync manual + auto con actualización in-place | Evita saltos visuales y mejora confianza | ✓ Good |

---
*Last updated: 2026-03-03 after v1.0 milestone completion*
