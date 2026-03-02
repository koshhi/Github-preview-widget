# Requirements: GitHub Preview Widget for Figma

**Defined:** 2026-03-02
**Core Value:** Pegar una URL de fichero en GitHub y verlo correctamente en el canvas de Figma en menos de 2 segundos.

## v1 Requirements

### Source URL

- [x] **SRC-01**: Usuario puede pegar una URL de archivo GitHub (`blob` o `raw`) y crear un bloque embebido.
- [x] **SRC-02**: Plugin valida formato de URL y devuelve errores accionables para URLs inválidas.
- [x] **SRC-03**: Plugin soporta al menos `.md`, `.txt`, `.json`, `.js`, `.ts`.

### Access & Auth

- [x] **AUTH-01**: Usuario puede configurar un GitHub PAT para acceso a repos privados.
- [x] **AUTH-02**: Plugin puede leer archivo de repositorio privado con PAT válido sin errores de autenticación.
- [x] **AUTH-03**: Plugin muestra estado de error claro para PAT ausente, inválido o sin permisos.

### Rendering

- [x] **RND-01**: Archivo de texto/código se renderiza con resaltado de sintaxis básico según extensión.
- [x] **RND-02**: Markdown se renderiza correctamente (títulos, listas, tablas, enlaces, bloques de código).
- [x] **RND-03**: Bloques Mermaid en Markdown se renderizan como diagrama en la preview.
- [x] **RND-04**: Primer render de un archivo dentro de límites de tamaño definidos ocurre en menos de 2 segundos.

### Canvas Embed

- [ ] **CVS-01**: Bloque embebido en canvas mantiene estilo limpio y consistente con apariencia nativa de Figma.
- [ ] **CVS-02**: Bloque muestra metadatos mínimos (origen y estado de última sincronización).

### Sync

- [ ] **SNC-01**: Usuario puede refrescar manualmente el bloque embebido.
- [ ] **SNC-02**: Plugin ejecuta refresco automático en apertura/reentrada del plugin para bloques compatibles.
- [ ] **SNC-03**: Resultado de refresco (éxito/error) queda visible para el usuario.

## v2 Requirements

### Access & Collaboration

- **AUTH-04**: Login OAuth con GitHub en lugar de PAT manual.
- **AUTH-05**: Gestión de múltiples credenciales por organización/repositorio.

### Content Capabilities

- **CNT-01**: Soporte de más tipos de fichero (`.yml`, `.yaml`, `.csv`, `.xml`).
- **CNT-02**: Navegación de árbol de repositorio para seleccionar archivos sin pegar URL.
- **CNT-03**: Soporte para archivos muy grandes con paginación o vista parcial.

### Editing

- **EDT-01**: Edición inline del contenido y commit/pull request a GitHub.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Edición del archivo remoto en v1 | El objetivo inicial es visualización fiable y rápida |
| Navegación completa de repositorio | Aumenta mucho complejidad de UI/flujo para primera versión |
| OAuth en v1 | PAT es más simple y acelera time-to-value |
| Soporte multi-file embebido en un solo bloque | No es necesario para validar el caso de uso principal |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SRC-01 | Phase 1 | Complete |
| SRC-02 | Phase 1 | Complete |
| SRC-03 | Phase 1 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| RND-01 | Phase 3 | Complete |
| RND-02 | Phase 3 | Complete |
| RND-03 | Phase 3 | Complete |
| RND-04 | Phase 3 | Complete |
| CVS-01 | Phase 4 | Pending |
| CVS-02 | Phase 4 | Pending |
| SNC-01 | Phase 4 | Pending |
| SNC-02 | Phase 4 | Pending |
| SNC-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after initial de