# GitHub Preview Widget for Figma

One-line: Paste a GitHub file URL and render a clean, Figma-native embed block with sync state.

ES: Pega una URL de fichero de GitHub y renderiza un bloque embebido, limpio y nativo de Figma, con estado de sincronización.

---

## Project Status

**v1.0 shipped**

Implemented in this repository:
- [x] URL intake for GitHub file links (`blob` / `raw`)
- [x] Public/private access via PAT (per file/sourceKey)
- [x] Rendering for code/text/Markdown/Mermaid
- [x] Manual and auto sync with in-place block updates

Current repo scope:
- Core engine modules and tests (`src/core/*`)
- No final Figma plugin runtime packaging here (`manifest`, UI/main thread wiring are not included in this repository snapshot)

ES: El repositorio actual contiene el motor core y tests; no incluye el empaquetado final del runtime completo del plugin de Figma.

---

## Why / Use Cases

- Keep technical docs visible while designing
- Embed README/spec/contracts/config snippets near UI frames
- Review internal private repo docs without leaving design context
- Keep copy/spec changes traceable through sync status
- Share technical context between design and engineering teams

ES: Casos típicos: documentación técnica en canvas, specs cerca del diseño, y contexto compartido diseño+dev.

---

## Feature Matrix

| Area | Requirement IDs | Status |
|---|---|---|
| Source URL intake | SRC-01, SRC-02, SRC-03 | Implemented (v1.0) |
| Access/Auth (PAT) | AUTH-01, AUTH-02, AUTH-03 | Implemented (v1.0) |
| Rendering engine | RND-01, RND-02, RND-03, RND-04 | Implemented (v1.0) |
| Canvas embed | CVS-01, CVS-02 | Implemented (v1.0) |
| Sync flows | SNC-01, SNC-02, SNC-03 | Implemented (v1.0) |
| OAuth login | AUTH-04 | Planned |
| Repository file browser | CNT-02 | Planned |
| Large file pagination/advanced partial previews | CNT-03 | Planned |
| More file types (`yml/yaml/csv/xml`) | CNT-01 | Planned |

ES: v1.0 cubre URL/Auth/Render/Canvas/Sync; OAuth y file-browser quedan para siguiente milestone.

---

## Architecture at a Glance

```text
src/core/
  url/      -> parse + validate + normalize GitHub file URLs
  auth/     -> PAT store and PAT status lifecycle
  github/   -> authenticated file read + auth error UX classification
  render/   -> code/markdown/mermaid preview pipeline + perf policy
  canvas/   -> embed block composition + sync state + manual/auto refresh
```

Data flow (5 steps):

```text
URL intake -> auth read -> render preview -> compose embed block -> sync (manual/auto)
```

ES: Flujo: URL -> lectura autenticada -> render -> composición de bloque -> sincronización.

---

## Quickstart (Developer)

Prerequisites:
- Node.js 18+ (recommended)

Install deps (if needed):

```bash
npm install
```

Run tests:

```bash
npm test
```

Run type/syntax check:

```bash
npm run typecheck
```

Notes:
- Tests use `node:test`
- `typecheck` uses `scripts/typecheck.cjs` (syntax validation over `.ts` files)
- There is currently no build/package script for full Figma plugin runtime in this repo

ES: Para iterar localmente, basta con `npm test` y `npm run typecheck`.

---

## Usage Snippets (Core APIs)

### 1) URL intake (`blob` / `raw`)

```js
const { ingestGithubFileUrl } = require("./src/core/url/ingestGithubFileUrl.ts");

const result = ingestGithubFileUrl(
  "https://github.com/octocat/hello-world/blob/main/docs/README.md"
);

if (!result.ok) {
  console.error(result.error);
} else {
  console.log(result.value.sourceKey); // owner/repo@ref:path
}
```

### 2) Authenticated read (public/private with PAT fallback)

```js
const { createPatStore } = require("./src/core/auth/patStore.ts");
const { readGithubFileWithAuth } = require("./src/core/github/readGithubFileWithAuth.ts");

const patStore = createPatStore();
patStore.set("octocat/hello-world@main:docs/private.md", "ghp_xxx");

const read = await readGithubFileWithAuth(
  "https://github.com/octocat/hello-world/blob/main/docs/private.md",
  { patStore }
);

if (!read.ok) {
  console.error(read.error.code, read.error.message);
} else {
  console.log(read.value.content);
}
```

### 3) Render preview

```js
const { renderFilePreview } = require("./src/core/render/renderFilePreview.ts");

const preview = renderFilePreview({
  sourceKey: "octocat/hello-world@main:docs/README.md",
  extension: "md",
  content: "# Hello\n\n```mermaid\ngraph TD\nA-->B\n```",
});

if (preview.ok) {
  console.log(preview.value.kind);     // markdown | code | text
  console.log(preview.value.metrics);  // includes firstPreviewMs
}
```

### 4) Compose block + sync refresh

```js
const { composeEmbedBlock } = require("./src/core/canvas/composeEmbedBlock.ts");
const { refreshBlockManual } = require("./src/core/canvas/refreshManual.ts");
const { refreshEligibleBlocksOnOpen } = require("./src/core/canvas/refreshAuto.ts");

const block = composeEmbedBlock({
  sourceKey: "octocat/hello-world@main:docs/README.md",
  source: { owner: "octocat", repo: "hello-world", ref: "main", path: "docs/README.md" },
  preview: { kind: "text", blocks: [{ type: "text", content: "seed" }] },
});

const manual = await refreshBlockManual(
  { block, trigger: "header_button" },
  {
    fetchContent: async () => ({ ok: true, value: { extension: "md", content: "# Updated" } }),
  }
);

const auto = await refreshEligibleBlocksOnOpen([manual.value], {
  fetchContent: async () => ({ ok: true, value: { extension: "md", content: "# Auto Updated" } }),
});

console.log(auto.results);
```

ES: Los snippets muestran cómo encadenar intake -> auth -> render -> bloque -> sync.

---

## Auth UX / Error Handling

Expected auth states/messages:
- `MISSING_PAT`: file likely private and no PAT stored for `sourceKey`
- `EXPIRED_PAT`: token invalid or expired
- `CURRENT_PAT`: token lacks required scope/permissions

Current user-facing messages are defined in:
- `src/core/github/authUxMessages.ts`

Security note:
- Never serialize/store PAT inside canvas node content or share it through design artifacts
- PAT is kept in the auth layer (`src/core/auth`) and associated to `sourceKey`

ES: Nunca exponer ni serializar el PAT en nodos de canvas.

---

## Public Interface Contracts

These contracts are stable in v1.0 and should be preserved by integrations:

1. URL input
- Accepts GitHub file URLs in `blob`/`raw` forms

2. Source key format
- `owner/repo@ref:path`

3. Render output shape (`renderFilePreview`)
- Core fields: `blocks`, `warnings`, `metrics`
- Performance flags: `truncated`, `progressive`

4. Sync state model
- Status: `idle | syncing | success | error`
- Mode: `manual | auto`

ES: Estos contratos evitan acoplamientos frágiles entre módulos.

---

## Testing & Quality

Key test suites:
- URL intake/validation: `src/core/url/__tests__/*`
- Auth and PAT flows: `src/core/auth/__tests__/*`, `src/core/github/__tests__/*`
- Rendering behavior: `src/core/render/__tests__/*`
- Canvas composition/sync: `src/core/canvas/__tests__/*`

What they guarantee:
- URL parsing and validation are deterministic and actionable
- PAT handling and auth classification are explicit and recoverable
- Render pipeline supports code/markdown/mermaid with fallback/perf policy
- Manual/auto sync preserve previous content on failure and expose visible sync state

ES: La cobertura está organizada por dominio para aislar regresiones.

---

## Roadmap

- Milestones ledger: [`.planning/MILESTONES.md`](./.planning/MILESTONES.md)
- Current archived milestone: [`.planning/milestones/v1.0-ROADMAP.md`](./.planning/milestones/v1.0-ROADMAP.md)

Next concrete goals:
1. OAuth option for private repository access
2. Repository file browser (no manual URL required)
3. Better handling for large files and additional file extensions

---

## Contributing

Minimum conventions for contributions:
- Add/adjust tests for each touched module (`src/core/*/__tests__`)
- Keep CommonJS compatibility (`require/module.exports`) as used in current codebase
- Do not add runtime dependencies unless clearly justified
- Keep security boundaries explicit (especially around PAT handling)

ES: Si cambias comportamiento, acompáñalo de tests y mantén compatibilidad CommonJS.

---

## License

ISC

(Aligned with `package.json`.)
