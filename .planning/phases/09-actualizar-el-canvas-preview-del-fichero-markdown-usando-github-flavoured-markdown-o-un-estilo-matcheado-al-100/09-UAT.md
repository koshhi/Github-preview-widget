# Phase 9 UAT: GFM Canvas Preview Fidelity

**Phase:** 09-actualizar-el-canvas-preview-del-fichero-markdown-usando-github-flavoured-markdown-o-un-estilo-matcheado-al-100  
**Date:** 2026-03-06  
**Goal:** Validar fidelidad GFM en preview (modal + canvas), estabilidad runtime del widget y paridad de estado vacío/layout.

## Scope

- GFM-01: Modelo de bloques GFM consistente entre parser y superficies de preview
- GFM-02: Canvas preview mantiene semántica visible de bloques GFM soportados
- UIF-01: Empty-state y layout del widget alineados al diseño objetivo
- STB-01: Create/refresh sin crash runtime en canvas
- REG-01: Cobertura de regresión para parsing/estado seguro

## Preconditions

1. Figma Desktop con Dev Mode habilitado.
2. Repo clonado y dependencias instaladas (`npm install`).
3. Build widget generado:
   - `npm run widget:build`
   - `npm run widget:check`
4. Typecheck y test en verde:
   - `npm run typecheck`
   - `npm test`
5. `manifest.json` disponible en raíz del repo.

## Test Cases

### TC-01: GFM básico se ve igual en modal y canvas

Steps:
1. Importar y ejecutar el widget desde `manifest.json`.
2. Pegar URL de un `.md` con: headings, párrafos, listas, task lists, blockquotes, tabla y code fences.
3. Pulsar `Create preview`.

Expected result:
- Modal muestra bloques GFM con formato correcto (incluyendo task list y blockquote).
- Canvas muestra preview por bloques (no solo texto plano) manteniendo semántica visible de los mismos elementos.
- No hay pérdida severa de estructura entre modal y canvas.

Evidence:
- Captura modal + captura canvas del mismo documento.

### TC-02: Listas ordenadas con start y listas de tareas

Steps:
1. Usar un markdown con lista ordenada iniciando en número distinto de `1` (ej: `3. ...`) y task list (`- [x]`, `- [ ]`).
2. Generar preview.

Expected result:
- Modal conserva numeración de lista ordenada desde el valor inicial.
- Task list se renderiza visualmente como completada/no completada en modal.
- Canvas mantiene representación semántica de lista ordenada/tareas en el contenido visible.

Evidence:
- Captura de bloque de lista en modal + canvas.

### TC-03: Estado vacío sin URL

Steps:
1. Insertar instancia nueva del widget.
2. No configurar URL.

Expected result:
- El texto visible en preview es exactamente: `Set a GitHub URL to preview the document or file.`
- El bloque preview del canvas mide 100px de alto.
- El widget completo mantiene comportamiento de alto por contenido (`hug content`).

Evidence:
- Captura del widget vacío con panel de propiedades mostrando tamaño.

### TC-04: Estabilidad runtime en create/refresh

Steps:
1. Con URL válida, pulsar `Create preview`.
2. Pulsar `Refresh preview` desde UI.
3. Pulsar `Refresh preview` desde property menu.

Expected result:
- El canvas se actualiza en create y refresh sin error de runtime `undefined`.
- El estado evoluciona `syncing -> success` (o `error` controlado) sin dejar el canvas en blanco.
- No aparece bloqueo del bridge (`Message from UI to plugin dropped...`) durante flujo normal.

Evidence:
- Captura/registro de consola y estado del widget tras create + refresh.

### TC-05: Documento largo (truncado seguro)

Steps:
1. Probar con un README largo (cientos de líneas, tablas/listas/código).
2. Generar preview y refrescar.

Expected result:
- Modal sigue mostrando documento correctamente.
- Canvas mantiene estabilidad (sin crash), aplicando truncado/compactación segura cuando sea necesario.
- La preview sigue siendo legible y semánticamente consistente en el tramo visible.

Evidence:
- Captura canvas + modal en documento largo.

## Acceptance

- [ ] TC-01 passed
- [ ] TC-02 passed
- [ ] TC-03 passed
- [ ] TC-04 passed
- [ ] TC-05 passed

## Notes

- Warnings de `permissions policy` en consola de Figma host no bloquean aceptación si create/refresh y render del widget funcionan correctamente.
- La fidelidad "100%" se valida sobre bloques GFM soportados por runtime de widget y el diseño objetivo acordado.
