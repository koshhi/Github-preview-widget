# Phase 8 UAT: Sync, UAT & Docs

**Phase:** 08-sync-uat-docs  
**Date:** 2026-03-03  
**Goal:** Validar refresh manual/auto, visibilidad de estado sync y guía reproducible de prueba.

## Scope

- SNC-07: Refresh manual in-place (misma instancia, sin recreación)
- SNC-08: Auto-refresh en apertura/reanudación para instancias elegibles
- SNC-09: Estado visible `idle/syncing/success/error` + último resultado
- QLT-05: README operativo con pasos reales de prueba

## Preconditions

1. Figma Desktop con Dev Mode habilitado.
2. Repo clonado y dependencias instaladas (`npm install`).
3. Build widget generado:
   - `npm run widget:build`
   - `npm run widget:check`
4. Manifest disponible en raíz del repo (`manifest.json`).

## Test Cases

### TC-01: URL pública muestra preview rápidamente

Steps:
1. En Figma: `Plugins -> Development -> Import plugin from manifest...` y seleccionar `manifest.json`.
2. Ejecutar el widget y abrir UI.
3. Pegar URL pública válida (ej: README público pequeño) y pulsar `Create preview`.

Expected result:
- Se ve estado `Syncing...` y luego `success`.
- El embed se crea/actualiza in-place con contenido visible.
- Resultado visible de forma rápida (criterio perceptivo `<2s` en caso nominal).

Evidence:
- Captura del estado `success` y contenido renderizado.

### TC-02: Refresh manual in-place

Steps:
1. Con un embed ya creado, pulsar `Refresh preview` en UI.
2. Disparar refresh manual también desde property menu (`Refresh preview`).
3. Durante `syncing`, intentar pulsar refresh repetidamente.

Expected result:
- Refresh usa la misma instancia (sin recrear embed).
- Trigger duplicado durante `syncing` es ignorado.
- Si hay error de lectura/render, contenido previo permanece visible y estado cambia a `error` con detalle.

Evidence:
- Captura/registro de ID de instancia estable antes/después.
- Captura de estado `error` conservando contenido previo (si se fuerza error).

### TC-03: Auto-refresh elegible con cooldown

Steps:
1. Dejar instancia con `lastUrl` y `sourceKey` válidos.
2. Cerrar/reabrir UI o reanudar runtime del widget.
3. Repetir apertura inmediatamente para verificar cooldown.

Expected result:
- Auto-refresh se ejecuta solo en instancias elegibles.
- No bloquea UI si falla; mantiene contenido previo y marca `error`.
- Cooldown por instancia evita ejecuciones seguidas en ventana corta.

Evidence:
- Capturas de estado `auto-sync`/`success` o `error` no bloqueante.
- Registro breve de intentos consecutivos mostrando cooldown.

### TC-04: Flujo privado con PAT (regresión fase 7)

Steps:
1. Usar URL de fichero privado sin PAT.
2. Ver prompt inline de PAT y mensaje correspondiente.
3. Introducir PAT válido y reintentar.
4. Probar caso de PAT inválido o scope insuficiente.

Expected result:
- Mensajes diferenciados para `MISSING_PAT`, `EXPIRED_PAT`, `CURRENT_PAT`.
- Reintento manual exitoso con PAT válido sin reiniciar widget.
- No se expone PAT en canvas, snapshot visible ni mensajes de estado.

Evidence:
- Capturas de mensajes por estado auth.
- Verificación visual de no presencia del token en UI/embed.

### TC-05: Documentación reproducible (README)

Steps:
1. Seguir README.md desde cero para cargar y probar el widget.
2. Repetir con README.es.md.

Expected result:
- Los pasos son suficientes para correr flujo público/privado y troubleshooting básico.
- Se referencia este checklist UAT.

Evidence:
- Confirmación de ejecución de pasos en ambos README.

## Acceptance

- [ ] TC-01 passed
- [ ] TC-02 passed
- [ ] TC-03 passed
- [ ] TC-04 passed
- [ ] TC-05 passed

## Notes

- El criterio `<2s` se valida de forma funcional/perceptiva para caso nominal, sin benchmark automatizado estricto.
- Cierre de fase requiere checklist completo + README actualizado + evidencias adjuntas.
