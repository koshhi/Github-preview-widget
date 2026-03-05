# Phase 8: Sync, UAT & Docs - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Cerrar el comportamiento final de sincronizacion del widget (manual + auto), asegurar visibilidad estable del estado de sync por instancia y dejar validacion reproducible del equipo mediante UAT y README operativo.

</domain>

<decisions>
## Implementation Decisions

### Refresh manual in-place
- Trigger manual habilitado desde boton en UI y accion en property menu.
- Si ya hay `syncing`, se ignora segundo trigger y se mantiene feedback de estado.
- Durante refresh se conserva contenido previo visible (sin limpiar body).
- En error manual: mantener instancia, marcar `error`, mostrar detalle y permitir reintento.

### Auto-refresh al abrir/reanudar
- Auto-refresh se ejecuta al abrir/reanudar el widget (no por foco simple).
- Solo aplica a instancias elegibles: `sourceKey` y `lastUrl` validos, y que no esten en `syncing`.
- En fallo de auto-refresh no se bloquea UI; se conserva contenido y se marca error.
- Cooldown por instancia para evitar rafagas de sync (>= 60s recomendado).

### Estado sync visible
- Estado principal visible en header del embed y en linea de estado de UI.
- Mostrar siempre mensaje corto y permitir detalle expandible opcional.
- Persistir por instancia: `syncState`, `lastSync`, `lastResult`.
- Convencion visual: `idle` neutral, `syncing` info, `success` verde, `error` rojo.

### UAT y README reproducible
- UAT en checklist paso a paso con resultado esperado por paso.
- Validacion de objetivo `<2s` por verificacion funcional/perceptiva (sin benchmark estricto automatizado).
- README debe incluir: setup Figma, carga de manifest, flujo publico, flujo privado con PAT y troubleshooting.
- Cierre de fase exige UAT completo + README actualizado + evidencias.

### Claude's Discretion
- Texto exacto de mensajes de sync fuera de auth (microcopy final).
- Formato concreto de evidencias UAT (capturas, logs, checklist firmado) mientras sea reproducible.
- Ajuste fino del cooldown por instancia en funcion de comportamiento real (manteniendo umbral conservador).

</decisions>

<specifics>
## Specific Ideas

- Mantener UX no bloqueante incluso cuando falle auto-sync.
- Priorizar continuidad visual del embed: nunca vaciar contenido en refresh/error.
- Documentacion util para demo y transferencia interna (no solo comandos tecnicos).

</specifics>

<deferred>
## Deferred Ideas

- Benchmark automatizado de latencia y telemetria avanzada de rendimiento como mejora futura.

</deferred>

---

*Phase: 08-sync-uat-docs*
*Context gathered: 2026-03-03*
