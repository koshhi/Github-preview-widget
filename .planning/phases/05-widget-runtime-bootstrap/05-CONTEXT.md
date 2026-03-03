# Phase 5: Widget Runtime Bootstrap - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega el bootstrap del runtime de **Widget API real**: widget cargable en Figma Dev Mode, UI mínima para pegar URL y puente de mensajes para iniciar create/refresh. No incluye todavía el render end-to-end completo del embed ni el flujo privado completo (eso queda para fases 6 y 7).

</domain>

<decisions>
## Implementation Decisions

### Runtime Base (Widget API)
- Base técnica: usar `manifest.json` de widget y entrada de runtime enfocada en `widget` (no plugin clásico como objetivo principal).
- Criterio de done de arranque: el widget se puede importar en Dev Mode sin errores y abrir su UI asociada.
- Mantener separación clara entre estado visual del widget y lógica de IO (bridge de mensajes).

### URL Intake UX (Fase Bootstrap)
- UI inicial de una sola tarea: campo URL + acción principal "Create preview".
- Validación en dos pasos: validación básica en UI (no vacío/formato mínimo) y validación fuerte en runtime/core.
- Error UX en esta fase: mensajes accionables y cortos en UI (sin flujo completo de auth todavía).

### Interacción Canvas/Instancia
- Crear una instancia inicial con estructura estable (header/body/footer) y placeholders mínimos.
- Metadatos de widget definidos desde fase 5 (`sourceKey`, `lastSync`, `syncState`) aunque algunos valores queden en estado semilla.
- La experiencia debe sentirse "nativa" de Figma con layout limpio, priorizando legibilidad sobre personalización.

### Developer Experience (Build/Check)
- Añadir scripts de runtime widget sin romper flujos existentes: `npm test` y `npm run typecheck` se mantienen.
- Incluir al menos un script de build/check del widget y uno de ejecución local/documentado.
- Estructura de archivos explícita para runtime (`widget/` o equivalente) para facilitar fases 6-8.

### Claude's Discretion
- Estilo visual exacto del widget base (tipografías, spacing fino) mientras se mantenga limpio y consistente.
- Herramienta concreta de bundling para el runtime del widget, si cumple simplicidad y DX.
- Nombres internos de mensajes del bridge UI/runtime, respetando contrato estable y testeable.

</decisions>

<specifics>
## Specific Ideas

- Acción principal centrada en velocidad de uso: pegar URL y disparar creación de preview en un solo paso.
- Mantener wording técnico directo en UI para equipo dev/design (sin copy marketing).
- Preparar desde bootstrap los puntos de extensión para fase 6 (render real) y fase 7 (PAT privado).

</specifics>

<deferred>
## Deferred Ideas

- Flujo completo de PAT privado en UI (fase 7).
- Render completo Markdown/Mermaid en instancia real (fase 6).
- Auto-refresh en reapertura con políticas de elegibilidad (fase 8).
- OAuth y file browser (fuera de v1.1 actual).

</deferred>

---

*Phase: 05-widget-runtime-bootstrap*
*Context gathered: 2026-03-03*
