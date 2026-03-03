# Phase 2: Private Access with PAT - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase habilita el acceso a ficheros privados de GitHub usando PAT, incluyendo almacenamiento por fichero, reintentos controlados y mensajes de error de autenticación claros para usuario final.

</domain>

<decisions>
## Implementation Decisions

### Gestión del PAT
- El PAT se solicita solo cuando se detecta que el fichero objetivo es privado.
- El modelo de credencial en v1 es **PAT por fichero** (no global).
- El usuario puede borrar y reemplazar el PAT desde la UI en cualquier momento.
- Si el fichero es privado y no hay PAT, se muestra advertencia y se permite introducir PAT en el momento.

### Flujo de acceso (público vs privado)
- Primero se intenta acceso sin token.
- Si hay PAT guardado para ese fichero, se usa automáticamente en refresh/intentos posteriores.
- Si el PAT falla, se conserva pero marcado con estado **invalid**.
- Se permite **1 reintento automático** antes de mostrar error final.

### Mensajes UX de autenticación
- PAT ausente:
  - "El fichero que intentas visualiza es privado. Crea un personal access token para acceder a este fichero."
- PAT inválido o expirado:
  - "Tu personal access token es invalido o ha expirado (Expired Pat)"
- PAT sin scope suficiente:
  - "Tu personal access no tiene los permisos/scope suficiente (Current Pat)"

### Scope mínimo requerido (v1)
- Scope mínimo requerido para repos privados: `repo` (lectura en privados).

### Claude's Discretion
- Modelo exacto de estado para PAT por fichero (campos, timestamps, reason code).
- Reglas exactas para clasificar errores API en "invalid", "expired" o "insufficient scope".
- Microcopy complementario de ayuda (ejemplos, CTA secundaria, enlaces).

</decisions>

<specifics>
## Specific Ideas

- El usuario prioriza UX directa: pedir PAT solo cuando hace falta, no bloquear flujo público.
- Se quiere mantener continuidad de uso en refresh (PAT automático por fichero), pero sin ocultar estados inválidos.

</specifics>

<deferred>
## Deferred Ideas

- OAuth GitHub para autenticación en lugar de PAT.
- Gestión multi-credencial por organización/repositorio.
- Navegación de repositorio para seleccionar archivos sin pegar URL.

</deferred>

---
*Phase: 02-private-access-with-pat*
*Context gathered: 2026-03-02*
