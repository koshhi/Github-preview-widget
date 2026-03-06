# Phase 9: GFM Canvas Preview Fidelity - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Actualizar el widget para que el preview en canvas del fichero Markdown respete GitHub Flavoured Markdown (GFM) y el estilo visual objetivo definido en Figma, manteniendo estabilidad del runtime (sin crash `undefined`) y UX consistente entre modal y canvas.

</domain>

<decisions>
## Implementation Decisions

### Fidelidad GFM y diseño
- El parsing de Markdown debe usar GFM como fuente de verdad para headings, listas, task lists, blockquotes, tablas, code fences, autolinks, strikethrough y divisores.
- El canvas debe mostrar una versión visual que matchee el diseño de Figma y preserve la semántica GFM del contenido.
- El modal de preview puede mostrar contenido completo; el canvas puede aplicar truncado controlado siempre que no rompa la semántica de los bloques visibles.

### Estabilidad runtime en canvas
- Prioridad alta: eliminar el error de runtime `An error occurred while running this widget` al sincronizar preview.
- Reducir payload sincronizado a estructuras seguras para widgets de Figma (sin objetos complejos innecesarios).
- Mantener `figma.ui.onmessage` estable durante la sesión para evitar pérdida de mensajes UI->runtime.

### UX y layout acordados
- Si no hay URL: texto en canvas debe ser `Set a GitHub URL to preview the document or file.`
- Si no hay URL: bloque preview de canvas debe usar altura de 100px.
- El widget completo (título + preview) debe respetar comportamiento de alto por contenido (`hug content`).

### Seguridad y ruido de consola
- Los warnings de permissions policy del host de Figma no se consideran fallo funcional del plugin si no afectan render ni flujo de usuario.
- No introducir permisos adicionales ni iframes en canvas runtime.

### Claude's Discretion
- Ajuste fino de tipografía/spacing para maximizar match visual con Figma dentro de límites de API de widget.
- Definir estrategia de fallback cuando un bloque GFM no sea renderizable 1:1 en canvas.

</decisions>

<specifics>
## Specific Ideas

- Reutilizar un modelo normalizado de bloques GFM para alimentar tanto modal como canvas.
- Añadir pruebas específicas para task lists, blockquotes, tablas y truncado seguro en canvas.
- Verificar manualmente en Figma dos casos: archivo pequeño y README largo.

</specifics>

<deferred>
## Deferred Ideas

- Render HTML inline avanzado y elementos GFM no soportados por el runtime de widgets como 1:1 estricto.

</deferred>

---

*Phase: 09-actualizar-el-canvas-preview-del-fichero-markdown-usando-github-flavoured-markdown-o-un-estilo-matcheado-al-100*
*Context gathered: 2026-03-06*
