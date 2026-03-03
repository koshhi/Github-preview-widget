# GitHub Preview Widget for Figma

## What This Is

Widget real de Figma para embeber en el canvas el contenido de un fichero alojado en GitHub, con apariencia limpia y nativa. Está orientado a equipos de diseño y desarrollo que necesitan consultar documentación técnica y contenido fuente sin salir de Figma.

## Core Value

Pegar una URL de fichero en GitHub y verlo correctamente en el canvas de Figma en menos de 2 segundos.

## Current State

- v1.0 entregado con pipeline core completo: URL intake, auth por PAT, render técnico y modelo de canvas con sync.
- Requisitos v1 completados: 15/15 (SRC, AUTH, RND, CVS, SNC).
- Arquitectura modular por dominios en `src/core/{url,auth,github,render,canvas}` y cobertura de tests de unidad.
- Gap actual: falta runtime de **Widget API** (`manifest` de widget + runtime + UI bridge) para validación end-to-end en canvas real.

## Current Milestone: v1.1 Real Widget Runtime

**Goal:** Entregar un widget real de Figma que conecte el core existente y permita crear/actualizar embeds en canvas.

**Target features:**
- Runtime mínimo de widget cargable en Figma Dev Mode.
- Flujo end-to-end para pegar URL y crear widget embebido en canvas en tiempo nominal (<2s).
- Flujo de acceso privado con PAT por fichero y mensajes de auth claros en runtime real.
- Sincronización manual/automática in-place sobre instancias reales de widget.

## Requirements

### Validated

- ✓ Pegado de URL GitHub de fichero con parse/validate robusto (v1.0)
- ✓ Acceso a repos privados con PAT por fichero y errores de auth claros (v1.0)
- ✓ Preview de texto/código/Markdown/Mermaid con estrategia de performance (v1.0)
- ✓ Sync manual y automático in-place con estado visible de éxito/error (v1.0)

### Active (v1.1)

- [ ] Runtime de widget Figma funcional y cargable en local (`WDG-01`, `WDG-02`, `WDG-03`).
- [ ] Conexión end-to-end Widget API + core (`INT-04`, `INT-05`).
- [ ] Flujo privado con PAT por fichero sin exponer secretos en estado sincronizado (`SEC-01`, `SEC-02`, `SEC-03`).
- [ ] Refresh manual/auto y estado visible por instancia de widget (`SNC-07`, `SNC-08`, `SNC-09`).
- [ ] DX mínima de build/test y guía de ejecución en Figma (`QLT-04`, `QLT-05`).

## Out of Scope

- OAuth de GitHub y gestión avanzada de sesión/token.
- Navegador de árbol de repositorio (selección de archivo sin URL).
- Soporte extendido para archivos enormes/paginación avanzada.
- Edición remota del contenido desde Figma.

## Context

El producto ya cubre el caso crítico a nivel de core. El siguiente salto de valor es convertir ese core en un widget ejecutable para validar el uso final en canvas y habilitar demos/reviews sobre el artefacto real.

## Constraints

- **Platform**: Widget API + UI bridge en Figma.
- **Performance**: mantener percepción de preview inmediato (<2s inicial en casos nominales).
- **Security**: PAT nunca en estado sincronizado del widget ni en contenido del nodo.
- **Scope**: priorizar flujo end-to-end estable (create + refresh + auth) antes de nuevas capacidades funcionales.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| URL de fichero como entrada principal en v1 | Minimiza complejidad de UX inicial | ✓ Good |
| PAT por fichero en v1 | Entrega rápida para repos privados sin OAuth | ✓ Good |
| Render Markdown + Mermaid desde v1 | Alto valor para documentación técnica | ✓ Good |
| Sync manual + auto con actualización in-place | Evita saltos visuales y mejora confianza | ✓ Good |
| v1.1 prioriza **Widget API real** sobre plugin runtime clásico | Alinea implementación con objetivo real del producto | ✓ Approved |

---
*Last updated: 2026-03-03 for v1.1 widget milestone alignment*
