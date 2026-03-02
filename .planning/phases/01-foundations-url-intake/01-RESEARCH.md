# Phase 1: Foundations & URL Intake - Research

**Researched:** 2026-03-02
**Domain:** GitHub file URL parsing, normalization, and validation contract for plugin ingestion
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- v1 acepta únicamente URLs a **fichero concreto** de GitHub.
- Patrones soportados:
  - `https://github.com/{owner}/{repo}/blob/{ref}/{path}`
  - `https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{path}`
- URLs de repositorio raíz, carpeta, issues, pull requests u otras rutas no se consideran válidas en esta fase.
- Toda URL válida se normaliza a una estructura interna común: `owner`, `repo`, `ref`, `path`.
- El sistema debe tratar `blob` y `raw` como entradas equivalentes cuando apuntan al mismo archivo.
- Si la URL no apunta a un archivo compatible, el plugin muestra error explícito y accionable.
- Extensiones v1 base para enrutar preview: `.md`, `.txt`, `.json`, `.js`, `.ts`.

### Claude's Discretion
- Formato exacto de objetos internos y utilidades de parsing.
- Copy exacto de mensajes de error (manteniendo claridad y accionabilidad).
- Estrategia concreta de tests unitarios para parser/validador.

### Deferred Ideas (OUT OF SCOPE)
- Buscador/navegador de archivos dentro del repositorio desde el plugin (sin pegar URL).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SRC-01 | Usuario puede pegar una URL `blob` o `raw` y crear bloque embebido | Contrato explícito de URL + parser determinista para ambos formatos |
| SRC-02 | Validación de formato y errores accionables | Taxonomía de errores + mensajes orientados a corrección |
| SRC-03 | Soporte mínimo de extensiones v1 | Detector de extensión normalizado + allowlist de tipos |
</phase_requirements>

## Summary

La fase debe producir un contrato de ingestión estricto y predecible. La estrategia recomendada es separar el flujo en dos pasos: `parse` (extraer owner/repo/ref/path) y `validate` (comprobar que el resultado cumple reglas de fichero y extensión soportada).  
Esto evita acoplar validaciones de negocio con lógica de parsing y hace más estable la expansión en fases posteriores (auth, fetch real, render).

Para minimizar errores de usuario, conviene usar códigos de error estables (`INVALID_FORMAT`, `UNSUPPORTED_ROUTE`, `NOT_A_FILE`, `UNSUPPORTED_EXTENSION`) y mensajes accionables. El parser no debe intentar “adivinar” rutas ambiguas; debe fallar de forma explícita.

**Primary recommendation:** Implementar un parser puro con salida tipada + validador de contrato y tests de casos límite desde esta fase.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | Project default | Modelar contrato de URL y errores tipados | Reduce ambiguedad y facilita tests deterministas |
| URL (Web API) | Native | Parse de hostname/pathname/search sin regex frágiles | Robusto para entradas reales con query/hash |
| Vitest/Jest (según setup posterior) | TBD | Tests de parser/validator | Feedback rápido en casos límite |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod (optional) | TBD | Validación estructural de salida normalizada | Útil si el contrato crece en siguientes fases |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Parse manual por regex única | Estado por segmentos de path | Más código, pero menos errores con ramas/rutas complejas |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── core/url/
│   ├── parseGithubFileUrl.ts
│   ├── validateGithubFileUrl.ts
│   ├── detectFileKind.ts
│   └── types.ts
└── core/url/__tests__/
    ├── parseGithubFileUrl.test.ts
    ├── validateGithubFileUrl.test.ts
    └── detectFileKind.test.ts
```

### Pattern 1: Parse → Normalize → Validate
**What:** Tres pasos explícitos y testeables.  
**When to use:** Ingestión de URLs con contratos cerrados y expansión futura.

### Pattern 2: Error Codes First
**What:** Errores internos con código + metadatos; UI decide copy final.  
**When to use:** Cuando habrá múltiples superficies (plugin UI, logs, soporte).

### Anti-Patterns to Avoid
- Mezclar parseo y UI copy en la misma función.
- Regex monolítica para soportar todos los casos.
- Aceptar rutas no fichero “por conveniencia” y corregir después.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Parse de URL completa | Parser string ad-hoc | `new URL(...)` + path segment parser | Menos edge cases ocultos |
| Clasificación de errores | Strings sueltos | Enum/type con códigos estables | Permite pruebas y manejo consistente |

## Common Pitfalls

### Pitfall 1: Branches with slashes
**What goes wrong:** Se corta `ref` incorrectamente cuando contiene `/`.  
**How to avoid:** Parsear por prefijo fijo y reconstruir `ref/path` con estrategia consistente.

### Pitfall 2: Accepting non-file GitHub routes
**What goes wrong:** Se aceptan URLs de repo/carpeta/PR y fallan en fases posteriores.  
**How to avoid:** Validar explícitamente patrones admitidos y rechazar el resto.

### Pitfall 3: Extension detection from query string
**What goes wrong:** Se usa `?raw=1` o hash para inferir extensión.  
**How to avoid:** Detectar extensión solo desde `path` normalizado del archivo.

## Code Examples

### Normalized URL shape (reference)
```ts
export type GithubFileUrl = {
  sourceType: "blob" | "raw";
  owner: string;
  repo: string;
  ref: string;
  path: string;
  extension: "md" | "txt" | "json" | "js" | "ts";
};
```

### Error model (reference)
```ts
export type UrlValidationErrorCode =
  | "INVALID_FORMAT"
  | "UNSUPPORTED_HOST"
  | "UNSUPPORTED_ROUTE"
  | "NOT_A_FILE"
  | "UNSUPPORTED_EXTENSION";
```

## Open Questions

1. ¿Se aceptan URLs con query/hash para fichero válido?
   - Recomendación: ignorar query/hash para parse, pero preservar URL original para metadatos.
2. ¿Límite de longitud de path/ref en v1?
   - Recomendación: no bloquear por longitud en esta fase; registrar validación defensiva simple.

## Metadata

**Confidence breakdown:**
- URL contract + validation split: HIGH (alineado con decisiones de contexto)
- Edge cases exactos de rutas GitHub complejas: MEDIUM (se debe reforzar con tests)
- Test framework exacto en repo: LOW (aún no hay código/base de tests)

**Research date:** 2026-03-02
**Valid until:** 2026-04-01
