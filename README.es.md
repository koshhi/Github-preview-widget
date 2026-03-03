# GitHub Preview Widget for Figma (ES)

Este documento es la versión extendida en español. Para la versión principal (EN-first), revisa [README.md](./README.md).

## Qué es este proyecto

Plugin orientado a embebidos de ficheros de GitHub en contexto de diseño. Su objetivo es poder pegar una URL de archivo y ver una preview limpia en un bloque tipo canvas, con trazabilidad del estado de sincronización.

## Estado actual

- **v1.0 completado**
- Implementado en este repo:
  - Ingesta de URL GitHub (`blob/raw`)
  - Acceso público/privado con PAT por fichero (`sourceKey`)
  - Render de código/texto/Markdown/Mermaid
  - Refresh manual/automático in-place con estado visible
- Alcance actual:
  - Motor core y tests
  - No incluye en este snapshot el wiring final de runtime/plugin Figma (manifest/UI/main thread completos)

## Arquitectura resumida

```text
src/core/url      parse + validate + normalización
src/core/auth     almacenamiento/estado de PAT
src/core/github   lectura autenticada y clasificación UX de errores
src/core/render   pipeline de render y política de rendimiento
src/core/canvas   composición de bloque y sincronización
```

Flujo:

```text
URL -> lectura auth -> render -> compose block -> sync
```

## Contratos públicos de uso

1. Entrada de URL: se esperan URLs de archivo GitHub en formato `blob` o `raw`.
2. `sourceKey`: `owner/repo@ref:path`.
3. Salida de render: contiene `blocks`, `warnings`, `metrics` y flags `truncated/progressive`.
4. Sync state: `idle | syncing | success | error` y modo `manual | auto`.

## Desarrollo rápido

```bash
npm install
npm test
npm run typecheck
```

Notas:
- `npm test` usa `node:test`.
- `npm run typecheck` ejecuta `scripts/typecheck.cjs` para validación sintáctica de `.ts`.

## Snippets clave

### Ingesta URL

```js
const { ingestGithubFileUrl } = require("./src/core/url/ingestGithubFileUrl.ts");
```

### Lectura con auth

```js
const { readGithubFileWithAuth } = require("./src/core/github/readGithubFileWithAuth.ts");
```

### Render

```js
const { renderFilePreview } = require("./src/core/render/renderFilePreview.ts");
```

### Canvas + sync

```js
const { composeEmbedBlock } = require("./src/core/canvas/composeEmbedBlock.ts");
const { refreshBlockManual } = require("./src/core/canvas/refreshManual.ts");
const { refreshEligibleBlocksOnOpen } = require("./src/core/canvas/refreshAuto.ts");
```

## Manejo de errores de autenticación

Mensajes/códigos esperados:
- `MISSING_PAT`
- `EXPIRED_PAT`
- `CURRENT_PAT`

Referencia: `src/core/github/authUxMessages.ts`.

## Seguridad

- No serializar PAT en nodos de canvas.
- No exponer secretos en logs o artefactos de diseño.

## Calidad y pruebas

Suites por dominio en `src/core/*/__tests__`:
- URL
- Auth/GitHub
- Render
- Canvas/sync

## Roadmap

- Milestones: [`.planning/MILESTONES.md`](./.planning/MILESTONES.md)
- Archivo de v1.0: [`.planning/milestones/v1.0-ROADMAP.md`](./.planning/milestones/v1.0-ROADMAP.md)

Objetivos siguientes:
1. OAuth opcional
2. Selector de ficheros en repositorio
3. Mejor soporte para ficheros grandes y más extensiones

## Contribuir

- Añadir tests cuando cambie comportamiento.
- Mantener compatibilidad CommonJS actual.
- Evitar nuevas dependencias runtime sin justificación.

## Licencia

ISC
