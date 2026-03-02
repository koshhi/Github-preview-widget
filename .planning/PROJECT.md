# GitHub Preview Widget for Figma

## What This Is

Plugin de Figma para embeber en el canvas el contenido de un fichero alojado en GitHub, con apariencia limpia y nativa de Figma. Permite pegar una URL de archivo y generar un bloque visual que muestra el contenido como preview dentro del diseño. Está pensado para equipos de diseño y desarrollo que necesitan consultar documentación y archivos técnicos sin salir de Figma.

## Core Value

Pegar una URL de fichero en GitHub y verlo correctamente en el canvas de Figma en menos de 2 segundos.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] El usuario puede pegar una URL de archivo de GitHub y crear un bloque embebido en canvas.
- [ ] El plugin soporta repositorios públicos y privados mediante PAT.
- [ ] El bloque embebido permite preview de texto, Markdown y Mermaid.
- [ ] El bloque mantiene sincronización mediante refresh manual y automático.

### Out of Scope

- Edición del archivo remoto desde Figma — v1 es solo lectura y preview.
- Flujo OAuth de GitHub — se prioriza PAT por simplicidad de implementación inicial.
- Soporte de carpetas/repos completos — v1 se centra en archivos individuales.

## Context

El caso de uso principal es diseño + desarrollo colaborando sobre documentación viva dentro del canvas. El plugin debe poder mostrar README, specs técnicas, contratos, copy y configuraciones sin romper el flujo de trabajo de diseño. La experiencia debe sentirse nativa de Figma y no como un iframe externo sin estilo. El acceso a repos privados es requisito explícito para habilitar documentación interna de equipos.

## Constraints

- **Platform**: Plugin de Figma con UI y main thread separados — la arquitectura debe respetar APIs de plugin/runtime de Figma.
- **Performance**: Render inicial <2s para uso real en sesiones de diseño — la experiencia debe ser inmediata.
- **Auth**: GitHub PAT almacenado localmente en el contexto del plugin — evita OAuth en v1.
- **Security**: No exponer token en nodos del canvas ni en contenido serializado — minimizar riesgo de filtrado.
- **Scope**: v1 optimizado para visualización correcta, no para edición ni gestión avanzada de repositorios.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Soporte público + privado desde v1 | Equipo necesita consultar documentación interna | — Pending |
| Autenticación con PAT en v1 | Menor complejidad que OAuth y entrega más rápida | — Pending |
| Preview de Markdown y Mermaid en v1 | Valor directo para specs y documentación técnica | — Pending |
| Refresh manual + automático en v1 | Requisito explícito del flujo de trabajo | — Pending |

---
*Last updated: 2026-03-02 after initialization*
