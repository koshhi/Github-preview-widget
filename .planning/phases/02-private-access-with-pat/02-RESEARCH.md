# Phase 2: Private Access with PAT - Research

**Researched:** 2026-03-02
**Domain:** GitHub private file access with per-file PAT handling and auth UX
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- El PAT se solicita solo cuando se detecta que el fichero objetivo es privado.
- El modelo de credencial en v1 es PAT por fichero (no global).
- El usuario puede borrar y reemplazar el PAT desde la UI en cualquier momento.
- Si el fichero es privado y no hay PAT, se muestra advertencia y se permite introducir PAT en el momento.
- Primero se intenta acceso sin token.
- Si hay PAT guardado para ese fichero, se usa automáticamente en refresh/intentos posteriores.
- Si el PAT falla, se conserva pero marcado con estado invalid.
- Se permite 1 reintento automático antes de mostrar error final.
- Scope mínimo requerido para repos privados: repo.

### Claude's Discretion
- Modelo exacto de estado para PAT por fichero (campos, timestamps, reason code).
- Reglas exactas para clasificar errores API en invalid, expired o insufficient scope.
- Microcopy complementario de ayuda (ejemplos, CTA secundaria, enlaces).

### Deferred Ideas (OUT OF SCOPE)
- OAuth GitHub para autenticación en lugar de PAT.
- Gestión multi-credencial por organización/repositorio.
- Navegación de repositorio para seleccionar archivos sin pegar URL.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Usuario puede configurar PAT para acceso privado | Diseño de token store por fichero + operaciones set/get/remove |
| AUTH-02 | Plugin lee archivo privado con PAT válido | Cliente GitHub con cabecera Authorization condicional + fallback público/privado |
| AUTH-03 | Plugin muestra error claro por PAT ausente/inválido/sin permisos | Clasificador de errores auth + mapeo UX con códigos estables |
</phase_requirements>

## Summary

La fase debe introducir una capa de autenticación aislada del parser de URL ya construido en fase 1. El patrón recomendado es separar: almacenamiento de credenciales por fichero, cliente de fetch con contexto de auth y clasificador de errores para UX.

Para mantener trazabilidad y depuración, conviene usar un estado de token por fichero (`valid`, `invalid`, `unknown`) con `lastValidatedAt` y `lastErrorCode`. Esto permite reintentos controlados y evita pedir token de nuevo cuando ya existe uno utilizable.

**Primary recommendation:** implementar `tokenStore` per-file + `fetchGithubFile` con fallback público/privado y clasificador de auth explícito.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript/Node runtime actual | repo-default | Capas de dominio para auth y errores | Consistencia con fase 1 |
| Native fetch | runtime-native | Llamadas a API de GitHub con/ sin token | Menos dependencias |
| Node test runner | runtime-native | Cobertura de flujo auth y clasificación de errores | Ya usado en fase 1 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Ninguna adicional en v1 | - | Mantener superficie mínima | Este scope no requiere SDK externo |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── core/auth/
│   ├── patStore.ts
│   └── patState.ts
├── core/github/
│   ├── fetchGithubFile.ts
│   ├── classifyAuthError.ts
│   └── authUxMessages.ts
└── core/github/__tests__/
    └── privateAccessFlow.test.ts
```

### Pattern 1: Token Store Decoupled
**What:** Store por fichero separado del cliente HTTP.
**When to use:** Cuando el estado de token afecta UX (invalidación, reintento, reemplazo manual).

### Pattern 2: Error Classifier First, Message Mapper After
**What:** Clasificar causa (`missing_pat`, `invalid_or_expired`, `insufficient_scope`) antes de renderizar copy.
**When to use:** Evitar que condiciones HTTP se mezclen directamente con texto de UI.

### Anti-Patterns to Avoid
- Guardar PAT global cuando el requisito bloqueado pide PAT por fichero.
- Borrar automáticamente token fallido (rompe decisión de mantener como invalid).
- Mezclar fetch, clasificación de error y copy de UI en una sola función.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reintentos complejos | Motor genérico de retry | Reintento controlado simple (1 intento) | Requisito acotado y explícito |
| Estado de auth implícito | Flags dispersos en UI | Modelo de estado de token por fichero | Reduce ambigüedad y bugs de flujo |

## Common Pitfalls

### Pitfall 1: Confundir 404 público con privado sin permiso
**What goes wrong:** Se muestra mensaje incorrecto para token cuando el path es realmente inexistente.
**How to avoid:** Clasificar con contexto: intento sin token + intento con token + respuesta final.

### Pitfall 2: Pedir token aunque el acceso público ya funciona
**What goes wrong:** UX intrusiva en ficheros públicos.
**How to avoid:** Intento público primero siempre.

### Pitfall 3: No persistir estado invalid
**What goes wrong:** Usuario no entiende por qué falla el refresh repetidamente.
**How to avoid:** Guardar estado `invalid` con motivo y CTA de reemplazo.

## Code Examples

### Token state shape (reference)
```ts
type PatRecord = {
  sourceKey: string; // owner/repo@ref:path
  token: string;
  status: "valid" | "invalid" | "unknown";
  lastValidatedAt?: string;
  lastErrorCode?: "expired_pat" | "current_pat" | "missing_pat";
};
```

### Auth classification output (reference)
```ts
type AuthResult =
  | { kind: "missing_pat"; recoverable: true }
  | { kind: "expired_pat"; recoverable: true }
  | { kind: "current_pat"; recoverable: true }
  | { kind: "non_auth_error"; recoverable: false };
```

## Open Questions

1. ¿Se cifra el PAT en almacenamiento local de plugin en v1?
   - Recomendación: usar almacenamiento nativo del entorno plugin; no serializar en nodos/canvas.
2. ¿Mostrar detalles HTTP en UI?
   - Recomendación: mensaje amigable primario + detalle técnico opcional en sección expandible.

## Metadata

**Confidence breakdown:**
- Flujo per-file PAT y reintentos: HIGH (decisiones bloqueadas explícitas)
- Clasificación exacta de respuestas GitHub en todos los edge cases: MEDIUM
- Estrategia de storage seguro en runtime real de plugin: MEDIUM

**Research date:** 2026-03-02
**Valid until:** 2026-04-01
