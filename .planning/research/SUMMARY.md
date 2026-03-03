# Research Summary: Figma GitHub File Preview Plugin

## Stack

TypeScript + Figma Plugin API with split UI/main-thread architecture, GitHub REST contents API, and a Markdown pipeline (`remark/rehype`) with Mermaid + syntax highlighting as render extensions.

## Table Stakes

- Paste URL and render file in canvas quickly.
- Public and private repo support (PAT).
- Manual + automatic refresh.
- Native-looking embed block with clear error feedback.

## Watch Out For

- PAT security and accidental token exposure.
- URL parsing edge cases (blob/raw paths, branches with slashes).
- Markdown/Mermaid render performance and fidelity.
- Auto-refresh rate-limit behavior.

## Recommended v1 Focus

1. Reliability of fetch/auth/sync over feature breadth.
2. Correct Markdown rendering and Mermaid fallback behavior.
3. Native Figma visual integration with fast first paint (<2s).
