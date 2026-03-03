# Requirements: GitHub Preview Widget for Figma

**Milestone:** v1.1 Real Widget Runtime
**Defined:** 2026-03-03
**Core Value:** Pegar una URL de fichero en GitHub y verlo correctamente en el canvas de Figma en menos de 2 segundos.

## v1.1 Requirements

### Widget Runtime

- [x] **WDG-01**: Usuario puede cargar el widget en Figma Dev Mode desde un `manifest.json` válido sin errores de inicialización.
- [x] **WDG-02**: Usuario puede abrir la UI del widget y pegar una URL de fichero GitHub para iniciar la creación del embed.
- [ ] **WDG-03**: Widget crea en canvas una instancia embebida con estructura visual limpia y metadatos mínimos (`sourceKey`, `lastSync`, `syncState`).

### Core Integration

- [ ] **INT-04**: Al confirmar una URL válida, el widget conecta intake + lectura GitHub + render + composición end-to-end usando el core de v1.0.
- [ ] **INT-05**: Markdown y Mermaid se renderizan correctamente dentro de la superficie del widget con fallback controlado.

### Private Access & Security

- [ ] **SEC-01**: Si el fichero es privado, el widget muestra advertencia y permite introducir PAT por fichero sin romper el flujo.
- [ ] **SEC-02**: El widget muestra mensajes claros para PAT ausente, PAT expirado/inválido y PAT sin permisos suficientes.
- [ ] **SEC-03**: El PAT nunca se serializa en estado sincronizado del widget ni en contenido de canvas; solo en almacenamiento local de sesión/configuración.

### Sync in Widget

- [ ] **SNC-07**: Usuario puede refrescar manualmente una instancia existente y ver contenido actualizado in-place.
- [ ] **SNC-08**: Al reabrir el widget/plugin host, se ejecuta refresh automático para instancias elegibles.
- [ ] **SNC-09**: La instancia muestra estado legible de sincronización (`idle | syncing | success | error`) y último resultado.

### Quality & DX

- [x] **QLT-04**: Developer puede ejecutar scripts de build/check del runtime del widget además de `npm test` y `npm run typecheck`.
- [ ] **QLT-05**: README documenta pasos reales para cargar y probar el widget en Figma de extremo a extremo.

## Future Requirements

- **AUTH-04**: Login OAuth con GitHub en lugar de PAT manual.
- **CNT-02**: Navegación de árbol de repositorio para seleccionar archivos sin pegar URL.
- **CNT-03**: Soporte para archivos muy grandes con paginación o vista parcial avanzada.
- **CNT-01**: Soporte de más tipos de fichero (`.yml`, `.yaml`, `.csv`, `.xml`).
- **EDT-01**: Edición inline del contenido y commit/pull request a GitHub.

## Out of Scope (v1.1)

| Feature | Reason |
|---------|--------|
| OAuth y gestión de sesión avanzada | Se prioriza runtime real de widget y validación de flujo principal |
| File browser completo de repositorio | Aumenta complejidad de UI sin bloquear validación de valor principal |
| Edición remota de contenido | Objetivo actual es visualización/sync fiable, no autoría |
| Nuevos formatos no críticos | No bloquean validación del widget en `.md/.txt/.json/.js/.ts` |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WDG-01 | Phase 5 | Complete |
| WDG-02 | Phase 5 | Complete |
| WDG-03 | Phase 6 | Planned |
| INT-04 | Phase 6 | Planned |
| INT-05 | Phase 6 | Planned |
| SEC-01 | Phase 7 | Planned |
| SEC-02 | Phase 7 | Planned |
| SEC-03 | Phase 7 | Planned |
| SNC-07 | Phase 8 | Planned |
| SNC-08 | Phase 8 | Planned |
| SNC-09 | Phase 8 | Planned |
| QLT-04 | Phase 5 | Complete |
| QLT-05 | Phase 8 | Planned |

**Coverage:**
- v1.1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0
- Duplicate mapping: 0

---
*Last updated: 2026-03-03 after phase 5 execution*
