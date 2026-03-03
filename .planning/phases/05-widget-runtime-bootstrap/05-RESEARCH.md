# Phase 5: Widget Runtime Bootstrap - Research

**Researched:** 2026-03-03
**Domain:** Figma Widget API runtime bootstrap + URL intake UI bridge
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- El objetivo es **widget real** (Widget API), no plugin clásico como objetivo principal.
- Debe cargar en Figma Dev Mode sin errores.
- UI mínima centrada en una acción: pegar URL + crear preview.
- Validación básica en UI y validación fuerte en core/runtime.
- La instancia inicial debe tener estructura estable (header/body/footer) y metadatos semilla.
- Mantener separación entre lógica visual del widget y lógica de IO/bridge.
- Añadir scripts de build/check del runtime sin romper `npm test` ni `npm run typecheck`.

### Claude's Discretion
- Bundler exacto para runtime de widget.
- Diseño visual fino del widget base.
- Nombres internos de eventos de bridge UI/runtime.

### Deferred Ideas (OUT OF SCOPE)
- PAT privado completo (fase 7).
- Render final markdown/mermaid en widget real (fase 6).
- Auto-refresh en reapertura (fase 8).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WDG-01 | Carga del widget en Dev Mode desde manifest válido | Scaffold de runtime y estructura de build reproducible |
| WDG-02 | UI del widget para pegar URL | UI bridge mínimo con contrato de mensajes versionado |
| QLT-04 | Scripts de build/check para widget | Scripts npm explícitos + checks automatizables |
</phase_requirements>

## Summary

Phase 5 debe cerrar la base ejecutable para las fases de integración. La recomendación es separar el bootstrap en tres capas:

1. **Widget runtime shell**: entrypoint del widget + manifest + render mínimo.
2. **UI bridge**: formulario URL + contrato de mensajes tipado.
3. **Bootstrap services**: capa adaptadora que prepara source metadata y crea instancia semilla.

**Primary recommendation:** crear una arquitectura mínima con `src/widget/` y módulos de bridge desacoplados del core para permitir tests sin entorno Figma completo.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript (estructura actual) | repo-default | Mantener contratos tipados entre UI y runtime | Coherencia con módulos core |
| `node:test` | runtime-native | Tests de contratos de bridge y bootstrap | Ya usado en todo el repo |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `esbuild` (o equivalente ligero) | latest stable | Build rápido de runtime/widget/ui | Recomendado para bootstrap rápido |

## Architecture Patterns

### Recommended Project Structure
```text
manifest.json
src/
  widget/
    code.ts
    ui.html
    bridge/
      messages.ts
      parseUiCommand.ts
    bootstrap/
      createSeedEmbed.ts
      widgetMetadata.ts
    __tests__/
      bridge.test.ts
      bootstrap.test.ts
```

### Pattern 1: Typed Bridge Contract
**What:** Definir tipos de mensajes UI -> runtime y runtime -> UI desde el inicio.
**When to use:** Evitar roturas al conectar fase 6/7.

### Pattern 2: Seed Embed First
**What:** Crear instancia semilla con layout estable y metadata mínima, aunque el render final llegue en fase 6.
**When to use:** Cumplir WDG-03/INT-04 incrementalmente.

### Pattern 3: Runtime-Agnostic Core Adapters
**What:** Adaptadores pequeños entre Widget API y funciones core existentes.
**When to use:** Reusar `src/core/*` sin acoplar tests a APIs globales de Figma.

### Anti-Patterns to Avoid
- Lógica de intake/render incrustada directamente en handlers de UI sin módulos intermedios.
- Scripts de build acoplados a paths implícitos no documentados.
- Estado de metadata incompleto que luego obligue migraciones en fase 6/8.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bridge de mensajes sin contrato | `postMessage` ad hoc con strings libres | Tipos y parser centralizado | Reducir errores entre UI/runtime |
| Pipeline de build complejo en fase bootstrap | Toolchain pesada multi-stage | Build mínimo y rápido | Mantener foco en runtime base |

## Common Pitfalls

### Pitfall 1: Widget carga pero UI no sincroniza
**What goes wrong:** canales de mensaje no alineados entre UI/runtime.
**How to avoid:** contrato único en `bridge/messages.ts` + tests de parser.

### Pitfall 2: Scripts rompen el flujo actual
**What goes wrong:** nuevos scripts sustituyen o invalidan `npm test`/`npm run typecheck`.
**How to avoid:** añadir scripts complementarios (`widget:build`, `widget:check`) sin tocar los existentes.

### Pitfall 3: Metadata inconsistente desde bootstrap
**What goes wrong:** instancias semilla sin `sourceKey/lastSync/syncState` uniformes.
**How to avoid:** helper único `widgetMetadata.ts` con defaults explícitos.

## Code Examples

### Bridge command contract (reference)
```ts
export type UiToWidgetCommand =
  | { type: "create-preview"; url: string }
  | { type: "refresh-preview"; widgetId: string };
```

### Seed metadata initializer (reference)
```ts
export function createSeedMetadata(sourceKey: string) {
  return {
    sourceKey,
    lastSync: null,
    syncState: "idle" as const,
  };
}
```

## Open Questions

1. ¿Se usará almacenamiento local del widget o UI bridge para estado temporal de URL?
   - Recomendación: estado temporal en UI + metadata persistente mínima en widget.
2. ¿Se define ya un wrapper de errores compartido UI/runtime?
   - Recomendación: sí, mínimo en fase 5 para evitar deuda en fase 7.

## Metadata

**Confidence breakdown:**
- Bootstrap de runtime + scripts: HIGH
- Contrato de bridge UI/runtime: HIGH
- Detalles exactos de interacción con Widget API en runtime local: MEDIUM

**Research date:** 2026-03-03
**Valid until:** 2026-04-03
