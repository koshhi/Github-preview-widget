# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-03
**Phases:** 4 | **Plans:** 4 | **Sessions:** 1 major implementation cycle

### What Was Built
- Pipeline completo de ingestión URL GitHub con validación y detección de tipo de fichero.
- Soporte de acceso a repos privados con PAT por fichero y mensajes UX de autenticación.
- Render engine técnico para código, Markdown y Mermaid con política orientada a first preview rápido.
- Bloque embebido nativo de canvas con sync manual/auto in-place y estado visible de resultado.

### What Worked
- División por fases pequeñas y trazables (`src/core/*`) permitió avanzar sin re-trabajo de arquitectura.
- Tests unitarios por fase (`node:test`) dieron señal rápida para cerrar criterios de aceptación.

### What Was Inefficient
- Corrupción intermitente de metadata Git (`master 2`, `index.lock`) interrumpió flujo y consumió tiempo operativo.
- Algunas herramientas CLI de GSD devolvieron metadata incompleta en milestone (`tasks/accomplishments`) y requirieron ajuste manual.

### Patterns Established
- Diseño por contratos modulares (URL/Auth/Render/Canvas) con puntos de integración explícitos.
- Refresh no destructivo: actualizar estado y body preservando contenido previo en error.

### Key Lessons
1. Conviene validar estabilidad de git (`HEAD`, refs e index) antes de cada bloque de commits largos en flujos GSD.
2. Al cerrar milestones, combinar salida de CLI con revisión manual evita inconsistencias en archivos de planificación.

### Cost Observations
- Model mix: balanced profile (predominio de Sonnet en ejecución)
- Sessions: 1 milestone cycle principal + ajustes de recuperación
- Notable: El coste mayor vino de recuperación de entorno (git), no de la implementación funcional.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 4 | Se estableció flujo GSD completo de punta a punta con verificación por fase |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 12 tests (fase 4) + suites previas | Cobertura funcional por requisito v1 | Sí (sin nuevas dependencias runtime) |

### Top Lessons (Verified Across Milestones)

1. Mantener fases con alcance pequeño mejora velocidad de validación y reduce riesgo de regresiones.
2. Cerrar cada fase con summary + verification facilita auditoría y cierre de milestone.
