# Pitfalls Research: Figma GitHub File Preview Plugin

## 1. Token leakage in canvas metadata

- **Warning signs**: PAT appears in node text, plugin data dumps, logs, or error payloads.
- **Prevention**: Store PAT only in client storage/private plugin settings; never serialize into node/pluginData visible across files.
- **Phase to address**: Phase 2 (Auth + GitHub access).

## 2. Incorrect GitHub URL parsing

- **Warning signs**: valid `blob` URLs fail, branch names with slashes break parsing.
- **Prevention**: support canonical URL patterns and explicit validation errors; add parser unit tests for edge cases.
- **Phase to address**: Phase 1 (foundation parsing).

## 3. Slow preview rendering on large files

- **Warning signs**: first render exceeds 2 seconds or UI freezes.
- **Prevention**: size limits, progressive rendering, and lightweight syntax highlighting defaults.
- **Phase to address**: Phase 3 (rendering pipeline).

## 4. Mermaid rendering instability

- **Warning signs**: blank diagrams, clipped SVG, inconsistent layout after refresh.
- **Prevention**: sandboxed rendering wrapper, timeout/fallback to code block, deterministic theme config.
- **Phase to address**: Phase 3 (markdown/mermaid rendering).

## 5. Auto-refresh causing rate-limit errors

- **Warning signs**: repeated 403/rate limit errors after opening plugin frequently.
- **Prevention**: debounce auto-refresh, ETag caching, manual override controls.
- **Phase to address**: Phase 4 (sync).

## 6. Non-native visual feel in canvas

- **Warning signs**: embed appears like pasted webpage, inconsistent spacing and typography.
- **Prevention**: define design tokens aligned with Figma defaults and use consistent block anatomy.
- **Phase to address**: Phase 4 (canvas UX).
