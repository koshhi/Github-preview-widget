# Phase 7: Private Access & PAT Safety - Research

**Researched:** 2026-03-03
**Domain:** Private GitHub access with per-file PAT flow and secret-safe widget runtime
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Pedir PAT solo cuando el acceso sin token clasifica como privado/no autorizado.
- No pedir PAT por defecto para errores ambiguos de red/5xx/rate limit; mostrar error técnico y permitir reintento.
- Recordar PAT por `sourceKey` para continuar flujo sin reinicio.
- Persistir PAT por `sourceKey` en `clientStorage` cifrado.
- Marcar PAT inválido con motivo diferenciado (`expired/invalid` vs `insufficient_scope`).
- Exponer acción explícita para olvidar PAT por fichero.
- UX inline para auth: aviso + input PAT + botón `Reintentar`.
- Mensajes de auth diferenciados y consistentes con copy definido.
- Nunca serializar PAT en canvas, metadata sincronizada ni payloads visuales.
- Logs con redacción de token (`[REDACTED_TOKEN]`).

### Claude's Discretion
- Scopes exactos recomendados en ayuda contextual.
- Regla de precedencia final ante múltiples PAT válidos.
- Política adicional de expiración local (TTL) además de invalidación por respuesta de auth.

### Deferred Ideas (OUT OF SCOPE)
- OAuth con GitHub y sesión avanzada.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-01 | Mostrar advertencia e input PAT para fichero privado | Pipeline devuelve `MISSING_PAT`; falta conectar UI runtime para captura/envío de PAT |
| SEC-02 | Mensajes claros para ausente/expirado/scope insuficiente | `classifyAuthError` + `authUxMessages` ya distinguen estados; falta exponer flujo completo en widget |
| SEC-03 | PAT no se serializa en estado/canvas | Requiere capa de almacenamiento separada + sanitización explícita de estado/logs |
</phase_requirements>

## Summary

El core ya resuelve gran parte de la clasificación de errores de auth (`missing_pat`, `expired_pat`, `current_pat`) y el `patStore` soporta marcación de validez/invalidación por `sourceKey`. El gap de la fase 7 está en la integración de widget runtime/UI y en hardening de seguridad para evitar fugas del token.

Recomendación principal:
1. Introducir un **PAT session store del widget** (persistencia cifrada en `clientStorage` + cache en memoria).
2. Extender el bridge UI/runtime con comandos explícitos para **set/retry/forget PAT** por fichero.
3. Añadir **guardas de no filtrado** (sanitización de errores, snapshot, eventos UI) y tests de regresión.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| módulos `src/core/auth` + `src/core/github` | repo-default | Reusar clasificación auth y contrato de lectura GitHub | Evita duplicación y deriva de mensajes |
| `node:test` | runtime-native | Cobertura de flujo privado y seguridad | Coherencia con suites existentes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `figma.clientStorage` | runtime API | Persistencia local del PAT por `sourceKey` | Solo para capa privada del widget |
| `globalThis.crypto` (si disponible) | runtime API | Cifrado/obfuscación del payload persistido | En persistencia, nunca en canvas |

## Architecture Patterns

### Recommended Project Structure
```text
src/widget/
  runtime/
    patSessionStore.ts
    redactSensitive.ts
    createOrRefreshEmbedFromUrl.ts
  bridge/
    messages.ts
    parseUiCommand.ts
  code.ts
  ui.html
  __tests__/
    patAccessFlow.test.ts
    securityRedaction.test.ts
```

### Pattern 1: Secret-Out-Of-Band Storage
**What:** PAT gestionado fuera de `useSyncedState` y fuera de `embedBlock`.
**When to use:** cumplir SEC-03 (no serialización en canvas/metadata).

### Pattern 2: Auth-Driven UI States
**What:** UI activa panel PAT solo para códigos de auth (`MISSING_PAT`, `EXPIRED_PAT`, `CURRENT_PAT`).
**When to use:** cumplir SEC-01/SEC-02 sin sobrecargar flujo nominal público.

### Pattern 3: Deterministic Retry Contract
**What:** reintento manual explícito tras actualizar PAT, sin auto-retry.
**When to use:** alineación con decisión de UX y trazabilidad de intentos.

### Anti-Patterns to Avoid
- Persistir PAT dentro de snapshot synced (`embed-snapshot`) o metadata del bloque.
- Reusar mensajes técnicos HTTP crudos como UX principal.
- Enviar token en `runtime-status`, `widget-context` o `figma.notify`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Clasificación auth paralela en UI | Switch ad-hoc por HTTP status | `classifyAuthError` + `authUxMessages` | Mantener una única fuente de verdad |
| PAT en synced state por conveniencia | `useSyncedState("pat", ...)` | store privado runtime (`clientStorage` + memoria) | Evitar fugas en canvas |
| Manejo de error sin redacción | logs/payloads directos | util `redactSensitive(...)` | Defender SEC-03 por defecto |

## Common Pitfalls

### Pitfall 1: PAT disponible en memoria pero no en siguiente intento
**What goes wrong:** el runtime recrea store por llamada y pierde token.
**How to avoid:** store singleton por sesión + bootstrap desde `clientStorage`.

### Pitfall 2: PAT filtrado en error details
**What goes wrong:** responses o stack traces pueden incluir fragmentos de credenciales.
**How to avoid:** sanitizar `message/details` antes de postear a UI o persistir snapshot.

### Pitfall 3: Flujo privado bloqueado por falta de contexto de `sourceKey`
**What goes wrong:** UI captura PAT sin asociarlo al fichero correcto.
**How to avoid:** emitir evento de auth-needed con `sourceKey` y vincular input PAT a esa clave.

## Code Examples

### Auth retry handshake (reference)
```ts
if (runtimeStatus.code === "MISSING_PAT") {
  showPatPrompt(sourceKey);
  // user submits token
  store.set(sourceKey, token);
  rerunPipeline(lastUrl);
}
```

### Secret-safe status payload (reference)
```ts
postRuntimeStatus("error", sanitize(error.message), sanitize(error.details));
// never include token or Authorization header values
```

## Open Questions

1. ¿`clientStorage` en el entorno de widget objetivo admite el nivel de cifrado definido?
   - Recomendación: implementar wrapper con fallback seguro a memoria y tests de contrato.
2. ¿Qué scopes exactos se mostrarán en la ayuda contextual?
   - Recomendación: mínimo lectura de contenido privado del repositorio.

## Metadata

**Confidence breakdown:**
- Clasificación auth y mensajes base existentes: HIGH
- Integración bridge/UI para captura PAT por fichero: MEDIUM-HIGH
- Endurecimiento anti-filtrado en runtime/eventos: MEDIUM

**Research date:** 2026-03-03
**Valid until:** 2026-04-03
