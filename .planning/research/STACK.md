# Stack Research: Figma GitHub File Preview Plugin

## Recommended Stack (2026)

- **Runtime**: Figma Plugin API (main thread + UI iframe)
- **Language**: TypeScript (strict mode)
- **Build**: Vite + esbuild pipeline for plugin UI and main bundle
- **UI**: React + lightweight component system aligned with Figma native spacing/typography
- **State**: Zustand or minimal event-based store (UI-only)
- **Markdown parsing**: `remark` + `rehype` pipeline
- **Mermaid rendering**: `mermaid` (render SVG in plugin UI, then map to canvas representation)
- **Syntax highlight**: `shiki` or `prismjs` for `.js/.ts/.json/.md` code blocks
- **GitHub API access**: GitHub REST contents endpoint (`/repos/{owner}/{repo}/contents/{path}`)
- **HTTP client**: native `fetch` with typed wrappers
- **Validation**: `zod` for URL parsing and response guards
- **Testing**: Vitest (unit) + Playwright (UI flow smoke tests)

## Why This Stack

- Strong TypeScript typing reduces plugin/runtime integration errors.
- Figma plugin architecture naturally separates network/render logic from canvas operations.
- remark/rehype and Mermaid are battle-tested for docs-oriented workflows.
- Native fetch + typed guards keeps dependencies low while preserving robustness.

## What Not To Use (v1)

- Full backend service for token proxying: adds ops complexity, not needed for PAT-first v1.
- Monolithic web framework in plugin UI: overkill for constrained plugin surface.
- Heavy WYSIWYG editor packages: v1 is preview-only, not editing.

## Confidence

- **High**: TypeScript + Figma Plugin API, GitHub REST, PAT auth
- **Medium**: Shiki performance in plugin UI for large files
- **Medium**: Mermaid rendering fidelity for complex diagrams
