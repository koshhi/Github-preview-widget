# Architecture Research: Figma GitHub File Preview Plugin

## Core Components

- **Plugin UI (iframe)**:
  - Input URL + PAT settings
  - Preview rendering (text/markdown/mermaid/code)
  - Manual refresh controls and status
- **Plugin Main Thread**:
  - Create/update canvas nodes
  - Persist source metadata in plugin data
  - Coordinate refresh actions and node selection
- **GitHub Client Layer**:
  - URL parsing and normalization
  - Auth header injection for private repos
  - Contents API fetch + error classification
- **Render Pipeline**:
  - Raw file -> typed content model
  - Markdown transform -> HTML/SVG preview model
  - Code highlight stage by extension
- **Sync Layer**:
  - Manual refresh command
  - Auto-refresh trigger on plugin open for selected embeds
  - Last-sync timestamp and result

## Data Flow

1. User pastes URL in UI.
2. UI validates and requests content fetch.
3. GitHub client fetches file (with PAT when configured).
4. Render pipeline transforms content based on file type.
5. Main thread creates or updates embed block in canvas.
6. Metadata (url, ref, file type, last sync) persists on node.
7. Refresh re-runs fetch + transform + node update.

## Suggested Build Order

1. URL parser + GitHub fetch client (public first, then PAT).
2. Canvas block creation and metadata persistence.
3. Text and code rendering with highlighting.
4. Markdown rendering correctness.
5. Mermaid rendering and fallback handling.
6. Manual refresh.
7. Auto-refresh behavior and status UX.

## Integration Boundaries

- UI never stores PAT in visible node content.
- Main thread handles only canvas-safe payloads.
- Rendering should isolate untrusted markdown HTML.
