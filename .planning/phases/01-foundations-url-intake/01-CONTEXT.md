# Phase 1: Foundations & URL Intake - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase define la ingestión de URLs de archivos GitHub y su validación/detección de tipo. El objetivo es aceptar solo URLs de fichero válidas, normalizarlas a un formato interno consistente y devolver errores claros cuando no cumplan el contrato.

</domain>

<decisions>
## Implementation Decisions

### URL contract de entrada
- v1 acepta únicamente URLs a **fichero concreto** de GitHub.
- Patrones soportados:
  - `https://github.com/{owner}/{repo}/blob/{ref}/{path}`
  - `https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{path}`
- URLs de repositorio raíz, carpeta, issues, pull requests u otras rutas no se consideran válidas en esta fase.

### Normalización
- Toda URL válida se normaliza a una estructura interna común: `owner`, `repo`, `ref`, `path`.
- El sistema debe tratar `blob` y `raw` como entradas equivalentes cuando apuntan al mismo archivo.
- El resultado normalizado se usa como base para fases posteriores (fetch y render), evitando duplicidad de lógica.

### Errores de validación
- Si la URL no apunta a un archivo compatible, el plugin muestra error explícito y accionable.
- Los mensajes deben indicar claramente por qué falla (formato inválido, ruta no soportada, no es fichero) y qué formato sí se admite.
- El flujo de error debe ser inmediato (sin crear bloque embebido inválido en canvas).

### Detección de tipo de fichero
- Extensiones v1 base para enrutar preview: `.md`, `.txt`, `.json`, `.js`, `.ts`.
- La detección es por ruta/extensión de archivo extraída de la URL normalizada.

### Claude's Discretion
- Formato exacto de objetos internos y utilidades de parsing.
- Copy exacto de mensajes de error (manteniendo claridad y accionabilidad).
- Estrategia concreta de tests unitarios para parser/validador.

</decisions>

<specifics>
## Specific Ideas

- El usuario quiere que el plugin se comporte como embebido “nativo” de Figma; desde esta fase se prioriza una base de entrada robusta para evitar errores en fases visuales posteriores.
- Decisión explícita del usuario: en v1 se soportan URLs `blob` y `raw` de GitHub.

</specifics>

<deferred>
## Deferred Ideas

- Buscador/navegador de archivos dentro del repositorio desde el plugin (sin pegar URL) — capacidad nueva para fase futura.

</deferred>

---
*Phase: 01-foundations-url-intake*
*Context gathered: 2026-03-02*
