# Phase 7: Private Access & PAT Safety - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementar un flujo fiable de acceso a ficheros privados en GitHub usando PAT por fichero, con manejo claro de errores de autenticación y garantías explícitas de no exposición del token en canvas, metadata o logs.

</domain>

<decisions>
## Implementation Decisions

### Disparo del flujo privado
- Pedir PAT solo después de detectar acceso no autorizado/privado en un primer intento sin PAT.
- Errores ambiguos (red, 5xx, rate limit) se tratan como errores técnicos con opción de reintento, sin pedir PAT por defecto.
- Tras PAT válido, recordar token por `sourceKey` para continuar el flujo en la sesión.
- UX inicial en privado sin PAT: aviso inline + input de PAT + acción explícita de reintento.

### Ciclo de vida del PAT
- Persistencia del PAT por `sourceKey` en `clientStorage` cifrado.
- Si PAT expira o es inválido, marcar estado inválido y pedir reemplazo en el siguiente intento.
- Si PAT tiene scope insuficiente, marcar estado inválido con motivo `insufficient_scope` y pedir reemplazo.
- Exponer acción explícita para olvidar PAT del fichero actual.

### Mensajes y reintentos UX
- Mensaje de privado sin PAT: "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar."
- Mensaje de PAT inválido/expirado: "Tu personal access token es inválido o ha expirado." con CTA de actualización.
- Mensaje de scope insuficiente: "Tu personal access token no tiene permisos/scope suficiente." con ayuda de permisos requeridos.
- Política de reintento: manual con botón `Reintentar`; sin auto-retry.

### Límites de seguridad
- Nunca mostrar PAT ni fragmentos del token en contenido visible del canvas.
- Prohibido serializar PAT en metadata persistida, snapshot de sincronización o estado visual del embed.
- Sanitizar tokens en logs/errores (`[REDACTED_TOKEN]`).
- Minimizar tránsito UI-runtime y no reenviar PAT en payloads de estado o eventos no necesarios.

### Claude's Discretion
- Scopes exactos a mostrar en documentación de ayuda (classic/fine-grained) mientras cumplan lectura de contenido privado.
- Regla de precedencia final si coexistieran múltiples PAT válidos (p. ej., por fichero y por repo).
- Definir si la invalidez se basa solo en resultado de auth o también en TTL adicional de expiración local.

</decisions>

<specifics>
## Specific Ideas

- Prioridad en mensajes claros para usuario final y recuperación guiada en el mismo flujo.
- Evitar cualquier filtrado accidental de secretos en nodos de canvas, snapshots y telemetría/logs.

</specifics>

<deferred>
## Deferred Ideas

- OAuth con GitHub y gestión de sesión avanzada (fase futura).

</deferred>

---

*Phase: 07-private-access-pat-safety*
*Context gathered: 2026-03-03*
