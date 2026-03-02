# Features Research: Figma GitHub File Preview Plugin

## Table Stakes (Expected in v1)

- Paste GitHub file URL and render content in canvas.
- Support public and private repositories.
- Private access via PAT with clear setup instructions.
- Manual refresh of embedded block.
- Automatic refresh trigger on plugin open/reopen for existing embedded blocks.
- Clear error states (invalid URL, 404, auth failure, rate limit).
- Native-looking embedded card in Figma canvas.

## Differentiators

- Accurate Markdown rendering (headings, lists, links, tables, fenced code blocks).
- Mermaid diagram preview from Markdown code fences.
- Syntax highlighting by file extension.
- Last-sync metadata and fetch status in the block.

## Anti-Features (Explicitly avoid in v1)

- Editing and committing file changes to GitHub.
- Full repo browsing tree.
- Multi-file documents joined in one embed.
- OAuth app setup complexity.

## Complexity Notes

- Mermaid fidelity is medium/high complexity due layout and SVG handling.
- Auto-refresh strategy is medium complexity due plugin lifecycle and rate limits.
- Private repo reliability is medium complexity due PAT scopes and error handling UX.

## Dependencies Between Features

- Private repo support depends on PAT management and request signing.
- Markdown + Mermaid preview depends on parser pipeline and safe rendering layer.
- Auto-refresh depends on persisted block metadata (source URL, branch/ref, last hash).
