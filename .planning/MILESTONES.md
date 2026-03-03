# Project Milestones: GitHub Preview Widget for Figma

## v1.0 MVP (Shipped: 2026-03-03)

**Delivered:** Plugin de Figma que embebe ficheros de GitHub en canvas con acceso público/privado por PAT, render de código/Markdown/Mermaid y sincronización manual/automática in-place.

**Phases completed:** 1-4 (4 plans total)

**Key accomplishments:**
- Ingesta robusta de URLs GitHub (`blob/raw`) con validación accionable y `sourceKey` estable.
- Lectura de ficheros públicos/privados con PAT por fichero y clasificación UX de errores de auth.
- Motor de render para `.js/.ts/.json/.txt/.md` con Mermaid y estrategia de first preview orientada a `<2s`.
- Bloque nativo de canvas (`header/body/footer`) con estado sync visible y refresh manual/auto sin recreación de nodo.

**Stats:**
- 43 files modified (sum de fases)
- 3,049 lines of TypeScript
- 4 phases, 4 plans, 12 tasks
- 1 day from start to ship (2026-03-02 → 2026-03-03)

**Git range:** `feat(01-01)` (`e163124`) → `feat(04-01)` (`596146f`)

**What's next:** Definir v1.1 (OAuth opcional, navegación de repo y soporte para archivos grandes).

---
