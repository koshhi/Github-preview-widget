const __widget_ui_html__ = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>GitHub Preview Widget</title>\n    <style>\n      body {\n        margin: 0;\n        font-family: Inter, sans-serif;\n        background: #f7f7f8;\n        color: #1e1e1f;\n      }\n\n      .root {\n        padding: 14px;\n        display: grid;\n        gap: 10px;\n      }\n\n      .label {\n        font-size: 12px;\n        font-weight: 600;\n      }\n\n      input {\n        width: 100%;\n        box-sizing: border-box;\n        padding: 10px;\n        border-radius: 8px;\n        border: 1px solid #d4d4d8;\n        background: #fff;\n        font-size: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 8px;\n        background: #111827;\n        color: #fff;\n        font-size: 12px;\n        font-weight: 600;\n        padding: 10px;\n        cursor: pointer;\n      }\n\n      .secondary {\n        background: #e4e4e7;\n        color: #111827;\n      }\n\n      .danger {\n        background: #fee2e2;\n        color: #991b1b;\n      }\n\n      .status {\n        font-size: 11px;\n        color: #0f172a;\n      }\n\n      .status.error {\n        color: #b91c1c;\n      }\n\n      .status.loading {\n        color: #0c4a6e;\n      }\n\n      .status.success {\n        color: #166534;\n      }\n\n      .details {\n        font-size: 10px;\n        color: #7c2d12;\n        word-break: break-word;\n        display: none;\n      }\n\n      .details[data-open=\"true\"] {\n        display: block;\n      }\n\n      .actions {\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 8px;\n      }\n\n      .auth-panel {\n        display: none;\n        border: 1px solid #fca5a5;\n        border-radius: 8px;\n        background: #fff1f2;\n        padding: 10px;\n        gap: 8px;\n      }\n\n      .auth-panel[data-open=\"true\"] {\n        display: grid;\n      }\n\n      .auth-title {\n        font-size: 11px;\n        font-weight: 700;\n        color: #9f1239;\n      }\n\n      .auth-copy {\n        font-size: 11px;\n        color: #7f1d1d;\n      }\n\n      .auth-meta {\n        font-size: 10px;\n        color: #9a3412;\n        word-break: break-word;\n      }\n\n      .link-button {\n        border: 0;\n        background: transparent;\n        padding: 0;\n        font-size: 11px;\n        text-decoration: underline;\n        color: #0f172a;\n        cursor: pointer;\n        text-align: left;\n      }\n\n      .result-meta {\n        font-size: 10px;\n        color: #475569;\n      }\n\n      .progress-line {\n        font-size: 10px;\n        color: #334155;\n      }\n\n      .progress-track {\n        width: 100%;\n        height: 6px;\n        border-radius: 999px;\n        background: #e2e8f0;\n        overflow: hidden;\n      }\n\n      .progress-fill {\n        height: 100%;\n        width: 0%;\n        background: #0f766e;\n        transition: width 160ms linear;\n      }\n\n      .preview-panel {\n        display: grid;\n        gap: 6px;\n      }\n\n      .preview-text {\n        margin: 0;\n        padding: 8px;\n        border: 1px solid #d4d4d8;\n        border-radius: 8px;\n        background: #ffffff;\n        font-size: 10px;\n        color: #0f172a;\n        max-height: 360px;\n        min-height: 180px;\n        overflow: auto;\n        resize: vertical;\n      }\n\n      .preview-empty {\n        color: #64748b;\n        white-space: pre-wrap;\n      }\n\n      .preview-md-heading {\n        margin: 0 0 8px 0;\n        font-size: 13px;\n        font-weight: 700;\n        color: #0f172a;\n      }\n\n      .preview-md-paragraph {\n        margin: 0 0 8px 0;\n        font-size: 11px;\n        line-height: 1.4;\n        white-space: pre-wrap;\n      }\n\n      .preview-md-list {\n        margin: 0 0 8px 16px;\n        padding: 0;\n        font-size: 11px;\n        line-height: 1.4;\n      }\n\n      .preview-md-code {\n        margin: 0 0 8px 0;\n        padding: 8px;\n        border-radius: 6px;\n        border: 1px solid #d4d4d8;\n        background: #f8fafc;\n        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n        font-size: 10px;\n        white-space: pre-wrap;\n      }\n\n      .preview-inline-code {\n        padding: 1px 4px;\n        border-radius: 4px;\n        border: 1px solid #d4d4d8;\n        background: #f1f5f9;\n        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n        font-size: 10px;\n      }\n\n      .preview-md-link {\n        color: #1d4ed8;\n        text-decoration: underline;\n      }\n\n      .preview-md-table-wrap {\n        margin: 0 0 8px 0;\n        overflow-x: auto;\n      }\n\n      .preview-md-table {\n        width: 100%;\n        border-collapse: collapse;\n        font-size: 10px;\n        line-height: 1.4;\n      }\n\n      .preview-md-table th,\n      .preview-md-table td {\n        border: 0.5px solid #cbd5e1;\n        padding: 4px 6px;\n        text-align: left;\n        vertical-align: top;\n      }\n\n      .preview-md-table th {\n        background: #f1f5f9;\n        font-weight: 700;\n      }\n\n      .preview-md-divider {\n        border: 0;\n        border-top: 0.5px solid #cbd5e1;\n        margin: 10px 0;\n      }\n    </style>\n  </head>\n  <body>\n    <form class=\"root\" id=\"url-form\">\n      <label class=\"label\" for=\"url-input\">GitHub file URL</label>\n      <input id=\"url-input\" placeholder=\"https://github.com/org/repo/blob/main/README.md\" required />\n      <div class=\"actions\">\n        <button type=\"submit\">Create preview</button>\n        <button class=\"secondary\" id=\"refresh-button\" type=\"button\">Refresh preview</button>\n      </div>\n      <div class=\"status\" id=\"status-line\">Ready</div>\n      <div class=\"result-meta\" id=\"result-line\">State: idle</div>\n      <div class=\"progress-line\" id=\"progress-line\">Sync progress: 0%</div>\n      <div class=\"progress-track\"><div class=\"progress-fill\" id=\"progress-fill\"></div></div>\n      <div class=\"preview-panel\">\n        <div class=\"label\">Preview</div>\n        <div class=\"preview-text\" id=\"preview-text\"></div>\n      </div>\n      <button class=\"link-button\" id=\"toggle-details-button\" type=\"button\">Show details</button>\n      <div class=\"details\" id=\"details-line\" data-open=\"false\"></div>\n      <div class=\"auth-panel\" id=\"auth-panel\" data-open=\"false\">\n        <div class=\"auth-title\">Private file requires PAT</div>\n        <div class=\"auth-copy\" id=\"auth-copy\"></div>\n        <div class=\"auth-meta\" id=\"auth-meta\"></div>\n        <label class=\"label\" for=\"pat-input\">Personal access token</label>\n        <input id=\"pat-input\" type=\"password\" placeholder=\"ghp_xxx or github_pat_xxx\" />\n        <div class=\"actions\">\n          <button class=\"secondary\" id=\"save-pat-button\" type=\"button\">Guardar PAT y reintentar</button>\n          <button class=\"danger\" id=\"forget-pat-button\" type=\"button\">Olvidar PAT fichero</button>\n        </div>\n      </div>\n    </form>\n\n    <script>\n      parent.postMessage(\n        {\n          pluginMessage: {\n            type: \"ui-ready\",\n          },\n        },\n        \"*\"\n      );\n\n      window.addEventListener(\"beforeunload\", () => {\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"ui-closed\",\n            },\n          },\n          \"*\"\n        );\n      });\n\n      const form = document.getElementById(\"url-form\");\n      const input = document.getElementById(\"url-input\");\n      const patInput = document.getElementById(\"pat-input\");\n      const submitButton = form.querySelector(\"button[type='submit']\");\n      const refreshButton = document.getElementById(\"refresh-button\");\n      const savePatButton = document.getElementById(\"save-pat-button\");\n      const forgetPatButton = document.getElementById(\"forget-pat-button\");\n      const statusLine = document.getElementById(\"status-line\");\n      const resultLine = document.getElementById(\"result-line\");\n      const toggleDetailsButton = document.getElementById(\"toggle-details-button\");\n      const detailsLine = document.getElementById(\"details-line\");\n      const authPanel = document.getElementById(\"auth-panel\");\n      const authCopy = document.getElementById(\"auth-copy\");\n      const authMeta = document.getElementById(\"auth-meta\");\n      const previewText = document.getElementById(\"preview-text\");\n      const progressLine = document.getElementById(\"progress-line\");\n      const progressFill = document.getElementById(\"progress-fill\");\n      let activeWidgetId = \"active-widget\";\n      let activeAuthContext = null;\n      let detailsOpen = false;\n      let syncProgress = 0;\n\n      const AUTH_MESSAGES = {\n        MISSING_PAT:\n          \"El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.\",\n        EXPIRED_PAT: \"Tu personal access token es invalido o ha expirado.\",\n        CURRENT_PAT: \"Tu personal access token no tiene permisos/scope suficiente.\",\n      };\n\n      function updateDetailsVisibility() {\n        detailsLine.dataset.open = detailsOpen ? \"true\" : \"false\";\n        toggleDetailsButton.textContent = detailsOpen ? \"Hide details\" : \"Show details\";\n      }\n\n      function setStatus(level, message, details = \"\") {\n        statusLine.textContent = message || \"Ready\";\n        statusLine.className = `status ${level || \"\"}`.trim();\n        detailsLine.textContent = details || \"\";\n        if (!details) {\n          detailsOpen = false;\n        }\n        updateDetailsVisibility();\n\n        const isLoading = level === \"loading\";\n        submitButton.disabled = isLoading;\n        refreshButton.disabled = isLoading;\n      }\n\n      function setLastResult(lastResult, syncState) {\n        const safe = lastResult && typeof lastResult === \"object\" ? lastResult : {};\n        const status = safe.status || syncState || \"idle\";\n        const mode = safe.mode || \"manual\";\n        const message = safe.message ? ` · ${safe.message}` : \"\";\n        resultLine.textContent = `State: ${status} (${mode})${message}`;\n      }\n\n      function setSyncProgress(rawPercent) {\n        const percent = Number.isFinite(Number(rawPercent))\n          ? Math.max(0, Math.min(100, Math.round(Number(rawPercent))))\n          : 0;\n        syncProgress = percent;\n        progressLine.textContent = `Sync progress: ${percent}%`;\n        progressFill.style.width = `${percent}%`;\n      }\n\n      function clearNodeChildren(node) {\n        while (node.firstChild) {\n          node.removeChild(node.firstChild);\n        }\n      }\n\n      function appendPreviewNode(tagName, className, text) {\n        const node = document.createElement(tagName);\n        if (className) node.className = className;\n        node.textContent = typeof text === \"string\" ? text : \"\";\n        return node;\n      }\n\n      function escapeHtml(value) {\n        return String(value || \"\")\n          .replace(/&/g, \"&amp;\")\n          .replace(/</g, \"&lt;\")\n          .replace(/>/g, \"&gt;\")\n          .replace(/\"/g, \"&quot;\")\n          .replace(/'/g, \"&#39;\");\n      }\n\n      function formatInlineMarkdownToHtml(value) {\n        let html = escapeHtml(value);\n        html = html.replace(\n          /\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)/g,\n          '<a class=\"preview-md-link\" href=\"$2\" target=\"_blank\" rel=\"noreferrer\">$1</a>'\n        );\n        html = html.replace(/`([^`]+)`/g, '<code class=\"preview-inline-code\">$1</code>');\n        html = html.replace(/\\*\\*([^*]+)\\*\\*/g, \"<strong>$1</strong>\");\n        html = html.replace(/__([^_]+)__/g, \"<strong>$1</strong>\");\n        html = html.replace(/(^|[^\\*])\\*([^*\\n]+)\\*/g, \"$1<em>$2</em>\");\n        html = html.replace(/(^|[^_])_([^_\\n]+)_/g, \"$1<em>$2</em>\");\n        html = html.replace(/\\n/g, \"<br/>\");\n        return html;\n      }\n\n      function appendMarkdownNode(tagName, className, text) {\n        const node = document.createElement(tagName);\n        if (className) node.className = className;\n        node.innerHTML = formatInlineMarkdownToHtml(text);\n        return node;\n      }\n\n      function parseMarkdownTableRow(line) {\n        const normalized = String(line || \"\").trim().replace(/^\\|/, \"\").replace(/\\|$/, \"\");\n        return normalized.split(\"|\").map((cell) => cell.trim());\n      }\n\n      function buildTableNode(content) {\n        const rawLines = String(content || \"\")\n          .split(/\\r?\\n/)\n          .map((line) => line.trim())\n          .filter(Boolean);\n        if (rawLines.length < 2) {\n          return appendPreviewNode(\"pre\", \"preview-md-code\", String(content || \"\"));\n        }\n\n        const header = parseMarkdownTableRow(rawLines[0]);\n        const rows = rawLines.slice(2).map(parseMarkdownTableRow);\n        const colCount = Math.max(1, header.length);\n\n        const wrapper = document.createElement(\"div\");\n        wrapper.className = \"preview-md-table-wrap\";\n        const table = document.createElement(\"table\");\n        table.className = \"preview-md-table\";\n        const thead = document.createElement(\"thead\");\n        const headRow = document.createElement(\"tr\");\n        for (let i = 0; i < colCount; i += 1) {\n          const th = document.createElement(\"th\");\n          th.innerHTML = formatInlineMarkdownToHtml(header[i] || \"\");\n          headRow.appendChild(th);\n        }\n        thead.appendChild(headRow);\n        table.appendChild(thead);\n\n        const tbody = document.createElement(\"tbody\");\n        for (const rowCells of rows) {\n          const tr = document.createElement(\"tr\");\n          for (let i = 0; i < colCount; i += 1) {\n            const td = document.createElement(\"td\");\n            td.innerHTML = formatInlineMarkdownToHtml(rowCells[i] || \"\");\n            tr.appendChild(td);\n          }\n          tbody.appendChild(tr);\n        }\n        table.appendChild(tbody);\n        wrapper.appendChild(table);\n        return wrapper;\n      }\n\n      function normalizeListItem(item) {\n        if (item && typeof item === \"object\") {\n          return {\n            content: String(item.content || \"\"),\n            depth: Math.max(1, Number(item.depth || 1)),\n          };\n        }\n        return {\n          content: String(item || \"\"),\n          depth: 1,\n        };\n      }\n\n      function buildNestedListNode(items, ordered) {\n        const listTag = ordered ? \"ol\" : \"ul\";\n        const root = document.createElement(listTag);\n        root.className = \"preview-md-list\";\n        const stack = [{ depth: 1, list: root }];\n\n        for (const rawItem of items) {\n          const current = normalizeListItem(rawItem);\n          let targetDepth = Math.max(1, current.depth);\n\n          while (stack.length > targetDepth) {\n            stack.pop();\n          }\n\n          while (stack.length < targetDepth) {\n            const parent = stack[stack.length - 1].list;\n            let parentLi = parent.lastElementChild;\n            if (!parentLi) {\n              parentLi = document.createElement(\"li\");\n              parent.appendChild(parentLi);\n            }\n\n            const nested = document.createElement(listTag);\n            nested.className = \"preview-md-list\";\n            parentLi.appendChild(nested);\n            stack.push({ depth: stack.length + 1, list: nested });\n          }\n\n          stack[stack.length - 1].list.appendChild(\n            appendMarkdownNode(\"li\", \"\", current.content)\n          );\n        }\n\n        return root;\n      }\n\n      function setPreviewContent(payload) {\n        const summary =\n          typeof payload?.previewSummary === \"string\" ? payload.previewSummary.trim() : \"\";\n        const previewKind =\n          typeof payload?.previewKind === \"string\" ? payload.previewKind : \"text\";\n        const previewBlocks = Array.isArray(payload?.previewBlocks) ? payload.previewBlocks : [];\n\n        clearNodeChildren(previewText);\n\n        if (previewKind === \"markdown\" && previewBlocks.length > 0) {\n          const fragment = document.createDocumentFragment();\n\n          for (const block of previewBlocks) {\n            const type = typeof block?.type === \"string\" ? block.type : \"text\";\n\n            if (type === \"heading\") {\n              fragment.appendChild(\n                appendMarkdownNode(\n                  \"p\",\n                  \"preview-md-heading\",\n                  String(block?.content || \"\")\n                )\n              );\n              continue;\n            }\n\n            if (type === \"paragraph\") {\n              fragment.appendChild(\n                appendMarkdownNode(\n                  \"p\",\n                  \"preview-md-paragraph\",\n                  String(block?.content || \"\")\n                )\n              );\n              continue;\n            }\n\n            if (type === \"list\" && Array.isArray(block?.items)) {\n              fragment.appendChild(buildNestedListNode(block.items, Boolean(block.ordered)));\n              continue;\n            }\n\n            if (type === \"divider\") {\n              const hr = document.createElement(\"hr\");\n              hr.className = \"preview-md-divider\";\n              fragment.appendChild(hr);\n              continue;\n            }\n\n            if (type === \"table\") {\n              fragment.appendChild(buildTableNode(block?.content || \"\"));\n              continue;\n            }\n\n            if (type === \"code\" || type === \"text\" || type === \"mermaid\") {\n              fragment.appendChild(\n                appendPreviewNode(\"pre\", \"preview-md-code\", String(block?.content || \"\"))\n              );\n              continue;\n            }\n\n            fragment.appendChild(\n              appendPreviewNode(\n                \"p\",\n                \"preview-md-paragraph\",\n                String(block?.content || \"\")\n              )\n            );\n          }\n\n          previewText.appendChild(fragment);\n          return;\n        }\n\n        previewText.appendChild(\n          appendPreviewNode(\"pre\", \"preview-empty\", summary || \"No preview yet.\")\n        );\n      }\n\n      function setAuthPanel(open, payload = null) {\n        if (!open || !payload || typeof payload.sourceKey !== \"string\") {\n          activeAuthContext = null;\n          authPanel.dataset.open = \"false\";\n          authCopy.textContent = \"\";\n          authMeta.textContent = \"\";\n          patInput.value = \"\";\n          savePatButton.disabled = false;\n          forgetPatButton.disabled = false;\n          return;\n        }\n\n        activeAuthContext = payload;\n        authPanel.dataset.open = \"true\";\n        authCopy.textContent =\n          payload.message || AUTH_MESSAGES[payload.code] || AUTH_MESSAGES.MISSING_PAT;\n        authMeta.textContent = `sourceKey: ${payload.sourceKey}`;\n      }\n\n      form.addEventListener(\"submit\", (event) => {\n        event.preventDefault();\n        setStatus(\"loading\", \"Syncing...\");\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"create-preview\",\n              url: input.value,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      refreshButton.addEventListener(\"click\", () => {\n        setStatus(\"loading\", \"Syncing...\");\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"refresh-preview\",\n              widgetId: activeWidgetId,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      toggleDetailsButton.addEventListener(\"click\", () => {\n        detailsOpen = !detailsOpen;\n        updateDetailsVisibility();\n      });\n\n      savePatButton.addEventListener(\"click\", () => {\n        if (!activeAuthContext || typeof activeAuthContext.sourceKey !== \"string\") {\n          setStatus(\"error\", \"No hay sourceKey para guardar PAT.\");\n          return;\n        }\n\n        const token = patInput.value.trim();\n        if (!token) {\n          setStatus(\"error\", \"Introduce un PAT valido para continuar.\");\n          return;\n        }\n\n        setStatus(\"loading\", \"Reintentando con PAT...\");\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"submit-pat\",\n              sourceKey: activeAuthContext.sourceKey,\n              token,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      forgetPatButton.addEventListener(\"click\", () => {\n        if (!activeAuthContext || typeof activeAuthContext.sourceKey !== \"string\") {\n          setStatus(\"error\", \"No hay sourceKey para olvidar PAT.\");\n          return;\n        }\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"forget-pat\",\n              sourceKey: activeAuthContext.sourceKey,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      window.onmessage = (event) => {\n        const payload = event.data && event.data.pluginMessage;\n        if (!payload || typeof payload.type !== \"string\") {\n          return;\n        }\n\n        if (payload.type === \"widget-context\") {\n          if (typeof payload.lastUrl === \"string\" && payload.lastUrl.length > 0) {\n            input.value = payload.lastUrl;\n          }\n\n          if (typeof payload.widgetId === \"string\" && payload.widgetId.length > 0) {\n            activeWidgetId = payload.widgetId;\n          }\n\n          if (typeof payload.status === \"string\" && payload.status.length > 0) {\n            setStatus(\"\", payload.status);\n          }\n          setLastResult(payload.lastResult, payload.syncState);\n          setSyncProgress(payload.progressPercent);\n          setPreviewContent(payload);\n\n          if (payload.authContext && typeof payload.authContext === \"object\") {\n            setAuthPanel(true, payload.authContext);\n          } else {\n            setAuthPanel(false);\n          }\n          return;\n        }\n\n        if (payload.type === \"runtime-status\") {\n          setStatus(payload.level, payload.message, payload.details);\n          setLastResult(payload.lastResult, payload.syncState);\n          if (payload.level === \"success\" && payload.progressPercent == null) {\n            setSyncProgress(100);\n          } else if (payload.level === \"error\" && payload.progressPercent == null) {\n            setSyncProgress(100);\n          } else {\n            setSyncProgress(payload.progressPercent);\n          }\n          setPreviewContent(payload);\n          if (payload.authRequired && typeof payload.sourceKey === \"string\") {\n            setAuthPanel(true, payload);\n          } else if (payload.level === \"success\") {\n            setAuthPanel(false);\n          }\n        }\n      };\n\n      setPreviewContent({});\n      updateDetailsVisibility();\n    </script>\n  </body>\n</html>\n";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/widget/bridge/messages.ts
  var require_messages = __commonJS({
    "src/widget/bridge/messages.ts"(exports, module) {
      var UI_COMMAND2 = Object.freeze({
        CREATE_PREVIEW: "create-preview",
        REFRESH_PREVIEW: "refresh-preview",
        SUBMIT_PAT: "submit-pat",
        FORGET_PAT: "forget-pat"
      });
      var UI_EVENT2 = Object.freeze({
        WIDGET_CONTEXT: "widget-context",
        RUNTIME_STATUS: "runtime-status"
      });
      function createCreatePreviewCommand(url) {
        return {
          type: UI_COMMAND2.CREATE_PREVIEW,
          url: String(url || "").trim()
        };
      }
      function createRefreshPreviewCommand(widgetId) {
        return {
          type: UI_COMMAND2.REFRESH_PREVIEW,
          widgetId: String(widgetId || "").trim()
        };
      }
      function createSubmitPatCommand(sourceKey, token) {
        return {
          type: UI_COMMAND2.SUBMIT_PAT,
          sourceKey: String(sourceKey || "").trim(),
          token: String(token || "").trim()
        };
      }
      function createForgetPatCommand(sourceKey) {
        return {
          type: UI_COMMAND2.FORGET_PAT,
          sourceKey: String(sourceKey || "").trim()
        };
      }
      module.exports = {
        UI_COMMAND: UI_COMMAND2,
        UI_EVENT: UI_EVENT2,
        createCreatePreviewCommand,
        createRefreshPreviewCommand,
        createSubmitPatCommand,
        createForgetPatCommand
      };
    }
  });

  // src/widget/bridge/parseUiCommand.ts
  var require_parseUiCommand = __commonJS({
    "src/widget/bridge/parseUiCommand.ts"(exports, module) {
      var { UI_COMMAND: UI_COMMAND2 } = require_messages();
      function fail(code, message) {
        return {
          ok: false,
          error: {
            code,
            message
          }
        };
      }
      function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
      }
      function parseUiCommand2(payload) {
        if (!isPlainObject(payload)) {
          return fail("INVALID_PAYLOAD", "Expected an object command payload.");
        }
        if (typeof payload.type !== "string") {
          return fail("INVALID_TYPE", "Command payload must include a string 'type'.");
        }
        if (payload.type === UI_COMMAND2.CREATE_PREVIEW) {
          if (typeof payload.url !== "string" || payload.url.trim().length === 0) {
            return fail("INVALID_URL", "create-preview requires a non-empty URL.");
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.CREATE_PREVIEW,
              url: payload.url.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.REFRESH_PREVIEW) {
          if (typeof payload.widgetId !== "string" || payload.widgetId.trim().length === 0) {
            return fail(
              "INVALID_WIDGET_ID",
              "refresh-preview requires a non-empty widgetId."
            );
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.REFRESH_PREVIEW,
              widgetId: payload.widgetId.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.SUBMIT_PAT) {
          if (typeof payload.sourceKey !== "string" || payload.sourceKey.trim().length === 0) {
            return fail(
              "INVALID_SOURCE_KEY",
              "submit-pat requires a non-empty sourceKey."
            );
          }
          if (typeof payload.token !== "string" || payload.token.trim().length === 0) {
            return fail("INVALID_PAT", "submit-pat requires a non-empty token.");
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.SUBMIT_PAT,
              sourceKey: payload.sourceKey.trim(),
              token: payload.token.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.FORGET_PAT) {
          if (typeof payload.sourceKey !== "string" || payload.sourceKey.trim().length === 0) {
            return fail(
              "INVALID_SOURCE_KEY",
              "forget-pat requires a non-empty sourceKey."
            );
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.FORGET_PAT,
              sourceKey: payload.sourceKey.trim()
            }
          };
        }
        return fail("UNSUPPORTED_COMMAND", `Unsupported command type: ${payload.type}`);
      }
      module.exports = {
        parseUiCommand: parseUiCommand2
      };
    }
  });

  // src/core/url/types.ts
  var require_types = __commonJS({
    "src/core/url/types.ts"(exports, module) {
      var URL_ERROR_CODES = Object.freeze({
        INVALID_FORMAT: "INVALID_FORMAT",
        UNSUPPORTED_HOST: "UNSUPPORTED_HOST",
        UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
        NOT_A_FILE: "NOT_A_FILE",
        UNSUPPORTED_EXTENSION: "UNSUPPORTED_EXTENSION"
      });
      var SUPPORTED_EXTENSIONS = Object.freeze(["md", "txt", "json", "js", "ts"]);
      module.exports = {
        URL_ERROR_CODES,
        SUPPORTED_EXTENSIONS
      };
    }
  });

  // src/core/url/parseGithubFileUrl.ts
  var require_parseGithubFileUrl = __commonJS({
    "src/core/url/parseGithubFileUrl.ts"(exports, module) {
      var { URL_ERROR_CODES } = require_types();
      function parseError(code, details) {
        return {
          ok: false,
          error: {
            code,
            details
          }
        };
      }
      function parseBlobPath(urlObj) {
        const segments = urlObj.pathname.split("/").filter(Boolean);
        if (segments.length < 5) {
          return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Blob URL path is too short.");
        }
        const [owner, repo, routeMarker, ...rest] = segments;
        if (routeMarker !== "blob") {
          return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Only /blob/ routes are supported for github.com URLs.");
        }
        if (rest.length < 2) {
          return parseError(URL_ERROR_CODES.NOT_A_FILE, "The URL must point to a file path after /blob/{ref}/.");
        }
        const ref = decodeURIComponent(rest[0]);
        const path = rest.slice(1).map(decodeURIComponent).join("/");
        if (!owner || !repo || !ref || !path) {
          return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Could not extract owner/repo/ref/path from blob URL.");
        }
        return {
          ok: true,
          value: {
            sourceType: "blob",
            owner,
            repo,
            ref,
            path
          }
        };
      }
      function parseRawPath(urlObj) {
        const segments = urlObj.pathname.split("/").filter(Boolean);
        if (segments.length < 4) {
          return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "raw.githubusercontent.com URL path is too short.");
        }
        const [owner, repo, ref, ...pathSegments] = segments;
        if (pathSegments.length < 1) {
          return parseError(URL_ERROR_CODES.NOT_A_FILE, "The URL must include a file path after /{ref}/.");
        }
        const path = pathSegments.map(decodeURIComponent).join("/");
        const decodedRef = decodeURIComponent(ref);
        if (!owner || !repo || !decodedRef || !path) {
          return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Could not extract owner/repo/ref/path from raw URL.");
        }
        return {
          ok: true,
          value: {
            sourceType: "raw",
            owner,
            repo,
            ref: decodedRef,
            path
          }
        };
      }
      function parseHttpsUrl(inputUrl) {
        const trimmed = String(inputUrl || "").trim();
        const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);
        if (schemeMatch && schemeMatch[1].toLowerCase() !== "https") {
          return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Only HTTPS URLs are supported.");
        }
        const match = trimmed.match(/^https:\/\/([^/?#]+)(\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i);
        if (!match) {
          return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Invalid URL format.");
        }
        const hostname = String(match[1] || "").toLowerCase();
        const pathname = match[2] && match[2].length > 0 ? match[2] : "/";
        if (!hostname) {
          return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Invalid URL host.");
        }
        return {
          ok: true,
          value: {
            hostname,
            pathname
          }
        };
      }
      function parseGithubFileUrl(inputUrl) {
        if (typeof inputUrl !== "string" || inputUrl.trim() === "") {
          return parseError(URL_ERROR_CODES.INVALID_FORMAT, "URL must be a non-empty string.");
        }
        const parsedUrl = parseHttpsUrl(inputUrl);
        if (!parsedUrl.ok) {
          return parsedUrl;
        }
        if (parsedUrl.value.hostname === "github.com") {
          return parseBlobPath(parsedUrl.value);
        }
        if (parsedUrl.value.hostname === "raw.githubusercontent.com") {
          return parseRawPath(parsedUrl.value);
        }
        return parseError(
          URL_ERROR_CODES.UNSUPPORTED_HOST,
          "Only github.com and raw.githubusercontent.com hosts are supported."
        );
      }
      module.exports = {
        parseGithubFileUrl
      };
    }
  });

  // src/core/url/detectFileKind.ts
  var require_detectFileKind = __commonJS({
    "src/core/url/detectFileKind.ts"(exports, module) {
      var { URL_ERROR_CODES, SUPPORTED_EXTENSIONS } = require_types();
      var EXTENSION_TO_KIND = Object.freeze({
        md: "markdown",
        txt: "text",
        json: "json",
        js: "javascript",
        ts: "typescript"
      });
      function detectFileKind(path) {
        if (typeof path !== "string" || path.trim() === "") {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "File path is required."
            }
          };
        }
        const trimmed = path.trim();
        if (trimmed.endsWith("/")) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "Path points to a directory, not a file."
            }
          };
        }
        const fileName = trimmed.split("/").pop();
        if (!fileName || !fileName.includes(".")) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "Path does not contain a valid file name with extension."
            }
          };
        }
        const extension = fileName.split(".").pop().toLowerCase();
        if (!SUPPORTED_EXTENSIONS.includes(extension)) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.UNSUPPORTED_EXTENSION,
              details: `Extension .${extension} is not supported in v1.`
            }
          };
        }
        return {
          ok: true,
          value: {
            extension,
            fileKind: EXTENSION_TO_KIND[extension] || "text"
          }
        };
      }
      module.exports = {
        detectFileKind
      };
    }
  });

  // src/core/url/validateGithubFileUrl.ts
  var require_validateGithubFileUrl = __commonJS({
    "src/core/url/validateGithubFileUrl.ts"(exports, module) {
      var { URL_ERROR_CODES } = require_types();
      var { detectFileKind } = require_detectFileKind();
      function validateGithubFileUrl(parsedUrl) {
        if (!parsedUrl || typeof parsedUrl !== "object") {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.INVALID_FORMAT,
              details: "Parsed URL object is required."
            }
          };
        }
        const { owner, repo, ref, path, sourceType } = parsedUrl;
        if (!owner || !repo || !ref || !path || !sourceType) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.INVALID_FORMAT,
              details: "Parsed URL must include owner, repo, ref, path and sourceType."
            }
          };
        }
        const kindResult = detectFileKind(path);
        if (!kindResult.ok) {
          return kindResult;
        }
        return {
          ok: true,
          value: __spreadProps(__spreadValues({}, parsedUrl), {
            extension: kindResult.value.extension,
            fileKind: kindResult.value.fileKind,
            canonicalBlobUrl: `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`
          })
        };
      }
      module.exports = {
        validateGithubFileUrl
      };
    }
  });

  // src/core/url/errors.ts
  var require_errors = __commonJS({
    "src/core/url/errors.ts"(exports, module) {
      var ERROR_COPY = Object.freeze({
        INVALID_FORMAT: {
          message: "La URL no tiene un formato v\xE1lido.",
          action: "Pega una URL HTTPS completa de GitHub."
        },
        UNSUPPORTED_HOST: {
          message: "El host no est\xE1 soportado.",
          action: "Usa github.com o raw.githubusercontent.com."
        },
        UNSUPPORTED_ROUTE: {
          message: "La ruta de GitHub no est\xE1 soportada.",
          action: "Usa una URL de fichero en formato blob o raw."
        },
        NOT_A_FILE: {
          message: "La URL no apunta a un fichero.",
          action: "Selecciona una URL que termine en un archivo concreto."
        },
        UNSUPPORTED_EXTENSION: {
          message: "La extensi\xF3n del fichero no est\xE1 soportada en v1.",
          action: "Usa .md, .txt, .json, .js o .ts."
        }
      });
      function toUserFacingUrlError(error) {
        const fallback = ERROR_COPY.INVALID_FORMAT;
        const copy = ERROR_COPY[error == null ? void 0 : error.code] || fallback;
        return {
          code: (error == null ? void 0 : error.code) || "INVALID_FORMAT",
          message: copy.message,
          action: copy.action,
          details: (error == null ? void 0 : error.details) || ""
        };
      }
      module.exports = {
        toUserFacingUrlError
      };
    }
  });

  // src/core/url/ingestGithubFileUrl.ts
  var require_ingestGithubFileUrl = __commonJS({
    "src/core/url/ingestGithubFileUrl.ts"(exports, module) {
      var { parseGithubFileUrl } = require_parseGithubFileUrl();
      var { validateGithubFileUrl } = require_validateGithubFileUrl();
      var { toUserFacingUrlError } = require_errors();
      function ingestGithubFileUrl(inputUrl) {
        const parsed = parseGithubFileUrl(inputUrl);
        if (!parsed.ok) {
          return {
            ok: false,
            error: toUserFacingUrlError(parsed.error)
          };
        }
        const validated = validateGithubFileUrl(parsed.value);
        if (!validated.ok) {
          return {
            ok: false,
            error: toUserFacingUrlError(validated.error)
          };
        }
        const normalized = validated.value;
        return {
          ok: true,
          value: {
            sourceType: normalized.sourceType,
            owner: normalized.owner,
            repo: normalized.repo,
            ref: normalized.ref,
            path: normalized.path,
            extension: normalized.extension,
            fileKind: normalized.fileKind,
            canonicalBlobUrl: normalized.canonicalBlobUrl,
            sourceKey: `${normalized.owner}/${normalized.repo}@${normalized.ref}:${normalized.path}`
          }
        };
      }
      module.exports = {
        ingestGithubFileUrl
      };
    }
  });

  // src/core/canvas/types.ts
  var require_types2 = __commonJS({
    "src/core/canvas/types.ts"(exports, module) {
      var EMBED_BLOCK_KIND = "github_file_embed";
      var SYNC_STATUS = Object.freeze({
        IDLE: "idle",
        SYNCING: "syncing",
        SUCCESS: "success",
        ERROR: "error"
      });
      var SYNC_MODE2 = Object.freeze({
        MANUAL: "manual",
        AUTO: "auto"
      });
      var SYNC_BADGE_TONE = Object.freeze({
        [SYNC_STATUS.IDLE]: "neutral",
        [SYNC_STATUS.SYNCING]: "info",
        [SYNC_STATUS.SUCCESS]: "success",
        [SYNC_STATUS.ERROR]: "danger"
      });
      var REFRESH_TRIGGER = Object.freeze({
        HEADER_BUTTON: "header_button",
        CONTEXT_MENU: "context_menu",
        AUTO_OPEN: "auto_open"
      });
      var BLOCK_LIMITS = Object.freeze({
        DEFAULT_WIDTH: 640,
        MIN_WIDTH: 320,
        MAX_WIDTH: 1200,
        MIN_HEIGHT: 180
      });
      module.exports = {
        EMBED_BLOCK_KIND,
        SYNC_STATUS,
        SYNC_MODE: SYNC_MODE2,
        SYNC_BADGE_TONE,
        REFRESH_TRIGGER,
        BLOCK_LIMITS
      };
    }
  });

  // src/core/canvas/embedBlockModel.ts
  var require_embedBlockModel = __commonJS({
    "src/core/canvas/embedBlockModel.ts"(exports, module) {
      var {
        EMBED_BLOCK_KIND,
        BLOCK_LIMITS,
        SYNC_STATUS,
        SYNC_MODE: SYNC_MODE2
      } = require_types2();
      function sanitizeText(value, fallback) {
        if (typeof value === "string" && value.trim()) {
          return value.trim();
        }
        return fallback;
      }
      function clampWidth(width) {
        if (typeof width !== "number" || Number.isNaN(width)) {
          return BLOCK_LIMITS.DEFAULT_WIDTH;
        }
        return Math.max(BLOCK_LIMITS.MIN_WIDTH, Math.min(BLOCK_LIMITS.MAX_WIDTH, width));
      }
      function parseSourceKey(sourceKey) {
        const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
        if (!match) return null;
        return {
          owner: match[1],
          repo: match[2],
          ref: match[3],
          path: match[4]
        };
      }
      function normalizeSource(source, sourceKey) {
        const parsed = parseSourceKey(sourceKey);
        const owner = sanitizeText(source == null ? void 0 : source.owner, (parsed == null ? void 0 : parsed.owner) || "unknown");
        const repo = sanitizeText(source == null ? void 0 : source.repo, (parsed == null ? void 0 : parsed.repo) || "unknown");
        const ref = sanitizeText(source == null ? void 0 : source.ref, (parsed == null ? void 0 : parsed.ref) || "main");
        const path = sanitizeText(source == null ? void 0 : source.path, (parsed == null ? void 0 : parsed.path) || "unknown.txt");
        const normalizedSourceKey = sanitizeText(sourceKey, `${owner}/${repo}@${ref}:${path}`);
        return {
          owner,
          repo,
          ref,
          path,
          sourceKey: normalizedSourceKey
        };
      }
      function normalizePreview(preview) {
        return {
          kind: typeof (preview == null ? void 0 : preview.kind) === "string" ? preview.kind : "text",
          blocks: Array.isArray(preview == null ? void 0 : preview.blocks) ? preview.blocks : [],
          warnings: Array.isArray(preview == null ? void 0 : preview.warnings) ? preview.warnings : [],
          truncated: Boolean(preview == null ? void 0 : preview.truncated),
          progressive: Boolean(preview == null ? void 0 : preview.progressive)
        };
      }
      function createInitialSyncState(sync, nowIso) {
        return {
          status: typeof (sync == null ? void 0 : sync.status) === "string" ? sync.status : SYNC_STATUS.IDLE,
          mode: typeof (sync == null ? void 0 : sync.mode) === "string" ? sync.mode : SYNC_MODE2.MANUAL,
          lastSyncAt: typeof (sync == null ? void 0 : sync.lastSyncAt) === "string" && sync.lastSyncAt ? sync.lastSyncAt : null,
          message: typeof (sync == null ? void 0 : sync.message) === "string" && sync.message ? sync.message : "Sin sincronizar",
          details: typeof (sync == null ? void 0 : sync.details) === "string" ? sync.details : "",
          lastUpdatedAt: typeof (sync == null ? void 0 : sync.lastUpdatedAt) === "string" && sync.lastUpdatedAt ? sync.lastUpdatedAt : nowIso
        };
      }
      function formatSyncTimestamp(lastSyncAt) {
        if (!lastSyncAt) {
          return "Nunca";
        }
        return String(lastSyncAt);
      }
      function createEmbedBlockModel(input = {}, options = {}) {
        var _a;
        const nowIso = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const source = normalizeSource(input.source, input.sourceKey);
        return {
          kind: EMBED_BLOCK_KIND,
          id: sanitizeText(input.id, `embed:${source.sourceKey}`),
          sourceKey: source.sourceKey,
          source,
          preview: normalizePreview(input.preview),
          sync: createInitialSyncState(input.sync, nowIso),
          layout: {
            width: clampWidth((_a = input == null ? void 0 : input.layout) == null ? void 0 : _a.width),
            heightMode: "auto",
            resizable: {
              edgeDrag: true,
              minWidth: BLOCK_LIMITS.MIN_WIDTH,
              maxWidth: BLOCK_LIMITS.MAX_WIDTH,
              minHeight: BLOCK_LIMITS.MIN_HEIGHT
            }
          },
          createdAt: typeof input.createdAt === "string" && input.createdAt ? input.createdAt : nowIso,
          updatedAt: typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : nowIso,
          metadata: {
            version: 1
          }
        };
      }
      module.exports = {
        createEmbedBlockModel,
        createInitialSyncState,
        formatSyncTimestamp
      };
    }
  });

  // src/core/canvas/composeEmbedBlock.ts
  var require_composeEmbedBlock = __commonJS({
    "src/core/canvas/composeEmbedBlock.ts"(exports, module) {
      var {
        REFRESH_TRIGGER,
        SYNC_STATUS,
        SYNC_BADGE_TONE,
        EMBED_BLOCK_KIND
      } = require_types2();
      var {
        createEmbedBlockModel,
        formatSyncTimestamp
      } = require_embedBlockModel();
      function getStatusLabel(status) {
        if (status === SYNC_STATUS.SYNCING) return "Syncing...";
        if (status === SYNC_STATUS.SUCCESS) return "Synced";
        if (status === SYNC_STATUS.ERROR) return "Sync error";
        return "Idle";
      }
      function composeEmbedBlock(input, options = {}) {
        const model = (input == null ? void 0 : input.kind) === EMBED_BLOCK_KIND ? input : createEmbedBlockModel(input, options);
        const ownerRepo = `${model.source.owner}/${model.source.repo}`;
        const statusLabel = getStatusLabel(model.sync.status);
        return __spreadProps(__spreadValues({}, model), {
          sections: {
            header: {
              ownerRepo,
              path: model.source.path,
              ref: model.source.ref,
              sourceKey: model.sourceKey,
              lastSync: formatSyncTimestamp(model.sync.lastSyncAt),
              statusBadge: {
                status: model.sync.status,
                label: statusLabel,
                tone: SYNC_BADGE_TONE[model.sync.status] || SYNC_BADGE_TONE[SYNC_STATUS.IDLE],
                mode: model.sync.mode
              },
              refreshActions: [REFRESH_TRIGGER.HEADER_BUTTON, REFRESH_TRIGGER.CONTEXT_MENU]
            },
            body: {
              kind: model.preview.kind,
              blocks: model.preview.blocks,
              warnings: model.preview.warnings,
              truncated: model.preview.truncated,
              progressive: model.preview.progressive
            },
            footer: {
              summary: model.sync.message || statusLabel,
              detail: model.sync.details || "",
              mode: model.sync.mode,
              updatedAt: model.sync.lastUpdatedAt
            }
          }
        });
      }
      module.exports = {
        composeEmbedBlock
      };
    }
  });

  // src/widget/bootstrap/widgetMetadata.ts
  var require_widgetMetadata = __commonJS({
    "src/widget/bootstrap/widgetMetadata.ts"(exports, module) {
      var { SYNC_MODE: SYNC_MODE2, SYNC_STATUS } = require_types2();
      function parseSourceKey(sourceKey) {
        const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
        if (!match) {
          return null;
        }
        return {
          owner: match[1],
          repo: match[2],
          ref: match[3],
          path: match[4]
        };
      }
      function createSeedMetadata(sourceKey, options = {}) {
        const now = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const parsed = parseSourceKey(sourceKey);
        return {
          sourceKey,
          source: parsed,
          lastSync: null,
          syncState: SYNC_STATUS.IDLE,
          syncMode: SYNC_MODE2.MANUAL,
          createdAt: now,
          updatedAt: now
        };
      }
      module.exports = {
        parseSourceKey,
        createSeedMetadata
      };
    }
  });

  // src/widget/bootstrap/createSeedEmbed.ts
  var require_createSeedEmbed = __commonJS({
    "src/widget/bootstrap/createSeedEmbed.ts"(exports, module) {
      var { ingestGithubFileUrl } = require_ingestGithubFileUrl();
      var { composeEmbedBlock } = require_composeEmbedBlock();
      var { SYNC_MODE: SYNC_MODE2, SYNC_STATUS } = require_types2();
      var { createSeedMetadata } = require_widgetMetadata();
      function createSeedEmbed(input = {}) {
        const url = typeof input.url === "string" ? input.url.trim() : "";
        if (!url) {
          return {
            ok: false,
            error: {
              code: "MISSING_URL",
              message: "A GitHub file URL is required."
            }
          };
        }
        const ingested = ingestGithubFileUrl(url);
        if (!ingested.ok) {
          return {
            ok: false,
            error: ingested.error
          };
        }
        const source = ingested.value;
        const metadata = createSeedMetadata(source.sourceKey, {
          now: input.now
        });
        const block = composeEmbedBlock({
          sourceKey: source.sourceKey,
          source: {
            owner: source.owner,
            repo: source.repo,
            ref: source.ref,
            path: source.path
          },
          preview: {
            kind: "text",
            blocks: [
              {
                type: "text",
                content: `Seed preview ready for ${source.path}`
              },
              {
                type: "text",
                content: "Bootstrap complete. Full render pipeline will run in phase 6."
              }
            ],
            warnings: [],
            truncated: false,
            progressive: false
          },
          sync: {
            status: SYNC_STATUS.IDLE,
            mode: SYNC_MODE2.MANUAL,
            message: "Seed preview ready",
            details: "",
            lastSyncAt: null
          }
        });
        return {
          ok: true,
          value: {
            source,
            metadata,
            embedBlock: __spreadProps(__spreadValues({}, block), {
              metadata: __spreadProps(__spreadValues(__spreadValues({}, block.metadata), metadata), {
                sourceUrl: url
              })
            })
          }
        };
      }
      module.exports = {
        createSeedEmbed
      };
    }
  });

  // src/core/auth/types.ts
  var require_types3 = __commonJS({
    "src/core/auth/types.ts"(exports, module) {
      var PAT_STATUS = Object.freeze({
        UNKNOWN: "unknown",
        VALID: "valid",
        INVALID: "invalid"
      });
      var PAT_ERROR_CODES = Object.freeze({
        MISSING_PAT: "missing_pat",
        EXPIRED_PAT: "expired_pat",
        CURRENT_PAT: "current_pat"
      });
      module.exports = {
        PAT_STATUS,
        PAT_ERROR_CODES
      };
    }
  });

  // src/core/auth/patStore.ts
  var require_patStore = __commonJS({
    "src/core/auth/patStore.ts"(exports, module) {
      var { PAT_STATUS, PAT_ERROR_CODES } = require_types3();
      function assertSourceKey(sourceKey) {
        if (typeof sourceKey !== "string" || sourceKey.trim() === "") {
          throw new TypeError("sourceKey must be a non-empty string.");
        }
      }
      function normalizeToken(token) {
        if (typeof token !== "string" || token.trim() === "") {
          throw new TypeError("PAT token must be a non-empty string.");
        }
        return token.trim();
      }
      function assertPatErrorCode(errorCode) {
        if (!Object.values(PAT_ERROR_CODES).includes(errorCode)) {
          throw new TypeError(`Unsupported PAT error code: ${errorCode}`);
        }
      }
      function cloneRecord(record) {
        if (!record) return null;
        return __spreadValues({}, record);
      }
      function createPatStore(initialRecords = []) {
        const records = /* @__PURE__ */ new Map();
        for (const record of initialRecords) {
          if (!record) continue;
          const sourceKey = String(record.sourceKey || "").trim();
          const token = String(record.token || "").trim();
          if (!sourceKey || !token) continue;
          records.set(sourceKey, {
            sourceKey,
            token,
            status: record.status || PAT_STATUS.UNKNOWN,
            lastValidatedAt: record.lastValidatedAt,
            lastErrorCode: record.lastErrorCode
          });
        }
        return {
          get(sourceKey) {
            assertSourceKey(sourceKey);
            return cloneRecord(records.get(sourceKey.trim()));
          },
          set(sourceKey, token) {
            assertSourceKey(sourceKey);
            const key = sourceKey.trim();
            const normalizedToken = normalizeToken(token);
            const next = {
              sourceKey: key,
              token: normalizedToken,
              status: PAT_STATUS.UNKNOWN,
              lastValidatedAt: void 0,
              lastErrorCode: void 0
            };
            records.set(key, next);
            return cloneRecord(next);
          },
          markValid(sourceKey, validatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
            assertSourceKey(sourceKey);
            const key = sourceKey.trim();
            const existing = records.get(key);
            if (!existing) return null;
            const next = __spreadProps(__spreadValues({}, existing), {
              status: PAT_STATUS.VALID,
              lastValidatedAt: validatedAt,
              lastErrorCode: void 0
            });
            records.set(key, next);
            return cloneRecord(next);
          },
          markInvalid(sourceKey, errorCode, validatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
            assertSourceKey(sourceKey);
            assertPatErrorCode(errorCode);
            const key = sourceKey.trim();
            const existing = records.get(key);
            if (!existing) return null;
            const next = __spreadProps(__spreadValues({}, existing), {
              status: PAT_STATUS.INVALID,
              lastValidatedAt: validatedAt,
              lastErrorCode: errorCode
            });
            records.set(key, next);
            return cloneRecord(next);
          },
          remove(sourceKey) {
            assertSourceKey(sourceKey);
            return records.delete(sourceKey.trim());
          }
        };
      }
      module.exports = {
        createPatStore
      };
    }
  });

  // src/core/github/types.ts
  var require_types4 = __commonJS({
    "src/core/github/types.ts"(exports, module) {
      var AUTH_KINDS = Object.freeze({
        MISSING_PAT: "missing_pat",
        EXPIRED_PAT: "expired_pat",
        CURRENT_PAT: "current_pat",
        NON_AUTH_ERROR: "non_auth_error"
      });
      var AUTH_UI_CODES = Object.freeze({
        MISSING_PAT: "MISSING_PAT",
        EXPIRED_PAT: "EXPIRED_PAT",
        CURRENT_PAT: "CURRENT_PAT"
      });
      module.exports = {
        AUTH_KINDS,
        AUTH_UI_CODES
      };
    }
  });

  // src/core/github/fetchGithubFile.ts
  var require_fetchGithubFile = __commonJS({
    "src/core/github/fetchGithubFile.ts"(exports, module) {
      function encodePath(pathValue) {
        return pathValue.split("/").map((part) => encodeURIComponent(part)).join("/");
      }
      function buildGithubContentsApiUrl(source) {
        const encodedPath = encodePath(source.path);
        const encodedRef = encodeURIComponent(source.ref);
        return `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${encodedPath}?ref=${encodedRef}`;
      }
      async function fetchGithubFile(source, options = {}) {
        var _a, _b;
        const fetchImpl = options.fetchImpl || globalThis.fetch;
        if (typeof fetchImpl !== "function") {
          return {
            ok: false,
            status: 0,
            content: null,
            body: "fetch implementation is required.",
            headers: {
              wwwAuthenticate: ""
            },
            request: {
              url: buildGithubContentsApiUrl(source),
              tokenUsed: Boolean(options.token)
            }
          };
        }
        const token = options.token;
        const apiUrl = buildGithubContentsApiUrl(source);
        const timeoutMs = Number.isFinite(options.timeoutMs) && Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 12e3;
        const headers = {
          accept: "application/vnd.github.raw+json"
        };
        if (token) {
          headers.authorization = `Bearer ${token}`;
        }
        try {
          let timeoutId = null;
          const timeoutPromise = new Promise((resolve) => {
            timeoutId = setTimeout(() => resolve({ __timedOut: true }), timeoutMs);
          });
          const responseOrTimeout = await Promise.race([
            fetchImpl(apiUrl, {
              method: "GET",
              headers
            }),
            timeoutPromise
          ]);
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
          if (responseOrTimeout && responseOrTimeout.__timedOut) {
            return {
              ok: false,
              status: 0,
              content: null,
              body: `Request timeout after ${timeoutMs}ms`,
              headers: {
                wwwAuthenticate: ""
              },
              request: {
                url: apiUrl,
                tokenUsed: Boolean(token)
              }
            };
          }
          const response = responseOrTimeout;
          const body = await response.text();
          return {
            ok: response.ok,
            status: response.status,
            content: response.ok ? body : null,
            body,
            headers: {
              wwwAuthenticate: ((_b = (_a = response.headers) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, "www-authenticate")) || ""
            },
            request: {
              url: apiUrl,
              tokenUsed: Boolean(token)
            }
          };
        } catch (error) {
          return {
            ok: false,
            status: 0,
            content: null,
            body: (error == null ? void 0 : error.message) || String(error),
            headers: {
              wwwAuthenticate: ""
            },
            request: {
              url: apiUrl,
              tokenUsed: Boolean(token)
            }
          };
        }
      }
      module.exports = {
        fetchGithubFile
      };
    }
  });

  // src/core/github/classifyAuthError.ts
  var require_classifyAuthError = __commonJS({
    "src/core/github/classifyAuthError.ts"(exports, module) {
      var { AUTH_KINDS } = require_types4();
      function normalizeText(value) {
        return typeof value === "string" ? value.toLowerCase() : "";
      }
      function classifyAuthError(input) {
        const status = Number((input == null ? void 0 : input.status) || 0);
        const tokenProvided = Boolean(input == null ? void 0 : input.tokenProvided);
        const body = normalizeText(input == null ? void 0 : input.responseBody);
        const wwwAuthenticate = normalizeText(input == null ? void 0 : input.wwwAuthenticate);
        const diagnostic = `${body} ${wwwAuthenticate}`.trim();
        if (!tokenProvided) {
          if (status === 401 || status === 403 || status === 404) {
            return { kind: AUTH_KINDS.MISSING_PAT, recoverable: true };
          }
          return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
        }
        if (status === 401) {
          return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
        }
        if (status === 404) {
          return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
        }
        if (status === 403) {
          if (diagnostic.includes("insufficient") || diagnostic.includes("scope") || diagnostic.includes("resource not accessible by personal access token") || diagnostic.includes("permission")) {
            return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
          }
          if (diagnostic.includes("expired") || diagnostic.includes("revoked") || diagnostic.includes("bad credentials") || diagnostic.includes("invalid")) {
            return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
          }
          return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
        }
        return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
      }
      module.exports = {
        classifyAuthError
      };
    }
  });

  // src/core/github/authUxMessages.ts
  var require_authUxMessages = __commonJS({
    "src/core/github/authUxMessages.ts"(exports, module) {
      var { AUTH_KINDS, AUTH_UI_CODES } = require_types4();
      var AUTH_COPY = Object.freeze({
        [AUTH_KINDS.MISSING_PAT]: {
          code: AUTH_UI_CODES.MISSING_PAT,
          message: "El fichero que intentas visualiza es privado. Crea un personal access token para acceder a este fichero."
        },
        [AUTH_KINDS.EXPIRED_PAT]: {
          code: AUTH_UI_CODES.EXPIRED_PAT,
          message: "Tu personal access token es invalido o ha expirado (Expired Pat)"
        },
        [AUTH_KINDS.CURRENT_PAT]: {
          code: AUTH_UI_CODES.CURRENT_PAT,
          message: "Tu personal access no tiene los permisos/scope suficiente (Current Pat)"
        }
      });
      function getAuthUxMessage(kind) {
        const fallback = AUTH_COPY[AUTH_KINDS.MISSING_PAT];
        const selected = AUTH_COPY[kind] || fallback;
        return {
          code: selected.code,
          message: selected.message,
          action: "Actualiza o reemplaza tu PAT para este fichero."
        };
      }
      module.exports = {
        getAuthUxMessage
      };
    }
  });

  // src/core/github/readGithubFileWithAuth.ts
  var require_readGithubFileWithAuth = __commonJS({
    "src/core/github/readGithubFileWithAuth.ts"(exports, module) {
      var { ingestGithubFileUrl } = require_ingestGithubFileUrl();
      var { createPatStore } = require_patStore();
      var { PAT_ERROR_CODES } = require_types3();
      var { AUTH_KINDS } = require_types4();
      var { fetchGithubFile } = require_fetchGithubFile();
      var { classifyAuthError } = require_classifyAuthError();
      var { getAuthUxMessage } = require_authUxMessages();
      function toPatErrorCode(kind) {
        if (kind === AUTH_KINDS.EXPIRED_PAT) return PAT_ERROR_CODES.EXPIRED_PAT;
        if (kind === AUTH_KINDS.CURRENT_PAT) return PAT_ERROR_CODES.CURRENT_PAT;
        return PAT_ERROR_CODES.MISSING_PAT;
      }
      function buildAuthError(kind, details) {
        const ux = getAuthUxMessage(kind);
        return {
          code: ux.code,
          message: ux.message,
          action: ux.action,
          details: details || ""
        };
      }
      async function readGithubFileWithAuth(inputUrl, options = {}) {
        var _a, _b;
        const ingestResult = ingestGithubFileUrl(inputUrl);
        if (!ingestResult.ok) {
          return ingestResult;
        }
        const source = ingestResult.value;
        const sourceKey = source.sourceKey;
        const patStore = options.patStore || createPatStore();
        const fetchImpl = options.fetchImpl;
        const publicAttempt = await fetchGithubFile(source, { fetchImpl });
        if (publicAttempt.ok) {
          return {
            ok: true,
            value: {
              source,
              sourceKey,
              content: publicAttempt.content
            },
            auth: {
              kind: null,
              sourceKey,
              usedPat: false,
              retryCount: 0
            }
          };
        }
        const storedPat = patStore.get(sourceKey);
        if (!(storedPat == null ? void 0 : storedPat.token)) {
          const authResult = classifyAuthError({
            status: publicAttempt.status,
            tokenProvided: false,
            responseBody: publicAttempt.body,
            wwwAuthenticate: (_a = publicAttempt.headers) == null ? void 0 : _a.wwwAuthenticate
          });
          if (authResult.kind === AUTH_KINDS.MISSING_PAT) {
            return {
              ok: false,
              error: buildAuthError(AUTH_KINDS.MISSING_PAT, publicAttempt.body),
              auth: {
                kind: AUTH_KINDS.MISSING_PAT,
                sourceKey,
                usedPat: false,
                retryCount: 0,
                patStatus: "missing"
              }
            };
          }
          return {
            ok: false,
            error: {
              code: "FETCH_FAILED",
              message: "No se pudo leer el fichero remoto.",
              action: "Reintenta m\xE1s tarde.",
              details: publicAttempt.body || `HTTP ${publicAttempt.status}`
            },
            auth: {
              kind: AUTH_KINDS.NON_AUTH_ERROR,
              sourceKey,
              usedPat: false,
              retryCount: 0
            }
          };
        }
        let lastTokenAttempt = null;
        for (let attempt = 0; attempt < 2; attempt += 1) {
          lastTokenAttempt = await fetchGithubFile(source, {
            token: storedPat.token,
            fetchImpl
          });
          if (lastTokenAttempt.ok) {
            patStore.markValid(sourceKey);
            return {
              ok: true,
              value: {
                source,
                sourceKey,
                content: lastTokenAttempt.content
              },
              auth: {
                kind: null,
                sourceKey,
                usedPat: true,
                retryCount: attempt
              }
            };
          }
        }
        const classified = classifyAuthError({
          status: lastTokenAttempt.status,
          tokenProvided: true,
          responseBody: lastTokenAttempt.body,
          wwwAuthenticate: (_b = lastTokenAttempt.headers) == null ? void 0 : _b.wwwAuthenticate
        });
        if (classified.kind === AUTH_KINDS.EXPIRED_PAT || classified.kind === AUTH_KINDS.CURRENT_PAT) {
          patStore.markInvalid(sourceKey, toPatErrorCode(classified.kind));
          return {
            ok: false,
            error: buildAuthError(classified.kind, lastTokenAttempt.body),
            auth: {
              kind: classified.kind,
              sourceKey,
              usedPat: true,
              retryCount: 1,
              patStatus: "invalid"
            }
          };
        }
        return {
          ok: false,
          error: {
            code: "FETCH_FAILED",
            message: "No se pudo leer el fichero remoto.",
            action: "Reintenta m\xE1s tarde.",
            details: lastTokenAttempt.body || `HTTP ${lastTokenAttempt.status}`
          },
          auth: {
            kind: AUTH_KINDS.NON_AUTH_ERROR,
            sourceKey,
            usedPat: true,
            retryCount: 1,
            patStatus: "unknown"
          }
        };
      }
      module.exports = {
        readGithubFileWithAuth
      };
    }
  });

  // src/core/render/utf8ByteLength.ts
  var require_utf8ByteLength = __commonJS({
    "src/core/render/utf8ByteLength.ts"(exports, module) {
      function byteLengthUtf8(input) {
        const value = typeof input === "string" ? input : String(input != null ? input : "");
        if (typeof TextEncoder === "function") {
          return new TextEncoder().encode(value).length;
        }
        return encodeURIComponent(value).replace(/%[A-F\d]{2}/gi, "x").length;
      }
      module.exports = {
        byteLengthUtf8
      };
    }
  });

  // src/core/render/detectMinifiedJson.ts
  var require_detectMinifiedJson = __commonJS({
    "src/core/render/detectMinifiedJson.ts"(exports, module) {
      var { byteLengthUtf8 } = require_utf8ByteLength();
      function detectMinifiedJson(content, options = {}) {
        if (typeof content !== "string") {
          return { isMinified: false, reason: "not_string" };
        }
        const trimmed = content.trim();
        if (!trimmed) {
          return { isMinified: false, reason: "empty" };
        }
        if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
          return { isMinified: false, reason: "not_json_shape" };
        }
        const maxBytesForPrettyPrint = Number(options.maxBytesForPrettyPrint || 250 * 1024);
        const bytes = byteLengthUtf8(trimmed);
        if (bytes > maxBytesForPrettyPrint) {
          return { isMinified: false, reason: "too_large_for_pretty_print" };
        }
        try {
          JSON.parse(trimmed);
        } catch (e) {
          return { isMinified: false, reason: "invalid_json" };
        }
        const hasNewLine = /[\r\n]/.test(trimmed);
        if (hasNewLine) {
          return { isMinified: false, reason: "already_multiline" };
        }
        const compact = trimmed.length >= 20;
        const whitespaceCount = (trimmed.match(/\s/g) || []).length;
        const whitespaceRatio = whitespaceCount / Math.max(trimmed.length, 1);
        const punctuationDensity = (trimmed.match(/[,:{}\[\]]/g) || []).length / Math.max(trimmed.length, 1) > 0.15;
        if (compact && whitespaceRatio < 0.02 && punctuationDensity) {
          return { isMinified: true, reason: "single_line_compact_json" };
        }
        return { isMinified: false, reason: "not_compact_enough" };
      }
      module.exports = {
        detectMinifiedJson
      };
    }
  });

  // src/core/render/types.ts
  var require_types5 = __commonJS({
    "src/core/render/types.ts"(exports, module) {
      var RENDER_KIND = Object.freeze({
        CODE: "code",
        TEXT: "text",
        MARKDOWN: "markdown"
      });
      var DEFAULT_RENDER_POLICY = Object.freeze({
        maxFullRenderBytes: 300 * 1024,
        progressivePreviewBytes: 120 * 1024,
        targetFirstPreviewMs: 2e3
      });
      var EXTENSION_TO_LANGUAGE = Object.freeze({
        js: "javascript",
        ts: "typescript",
        json: "json",
        txt: "text",
        md: "markdown"
      });
      module.exports = {
        RENDER_KIND,
        DEFAULT_RENDER_POLICY,
        EXTENSION_TO_LANGUAGE
      };
    }
  });

  // src/core/render/highlightCode.ts
  var require_highlightCode = __commonJS({
    "src/core/render/highlightCode.ts"(exports, module) {
      var { detectMinifiedJson } = require_detectMinifiedJson();
      var { EXTENSION_TO_LANGUAGE, RENDER_KIND } = require_types5();
      var JS_TS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|await|async|import|from|export|class|new|try|catch)\b/g;
      function normalizeExtension(extension) {
        if (typeof extension !== "string") return "txt";
        return extension.replace(/^\./, "").toLowerCase();
      }
      function basicHighlight(source, language) {
        if (language === "javascript" || language === "typescript") {
          return source.replace(JS_TS_KEYWORDS, "\u2039$1\u203A");
        }
        if (language === "json") {
          return source.replace(/"([^"]+)":/g, "\u201C$1\u201D:").replace(/\b(true|false|null)\b/g, "\u2039$1\u203A");
        }
        return source;
      }
      function highlightCode(input) {
        const content = typeof (input == null ? void 0 : input.content) === "string" ? input.content : "";
        const extension = normalizeExtension(input == null ? void 0 : input.extension);
        const language = EXTENSION_TO_LANGUAGE[extension] || "text";
        const warnings = [];
        let renderContent = content;
        let kind = language === "text" ? RENDER_KIND.TEXT : RENDER_KIND.CODE;
        if (extension === "json") {
          const minified = detectMinifiedJson(content);
          if (minified.isMinified) {
            try {
              renderContent = JSON.stringify(JSON.parse(content), null, 2);
            } catch (e) {
              warnings.push("JSON inv\xE1lido. Se muestra contenido como texto plano.");
              kind = RENDER_KIND.TEXT;
            }
          } else if (minified.reason === "invalid_json") {
            warnings.push("JSON inv\xE1lido. Se muestra contenido como texto plano.");
            kind = RENDER_KIND.TEXT;
          }
        }
        const highlightedContent = kind === RENDER_KIND.TEXT ? renderContent : basicHighlight(renderContent, language);
        return {
          ok: true,
          value: {
            kind,
            language,
            blocks: [
              {
                type: kind === RENDER_KIND.TEXT ? "text" : "code",
                language,
                content: highlightedContent,
                meta: {
                  highlighted: kind === RENDER_KIND.CODE
                }
              }
            ],
            warnings
          }
        };
      }
      module.exports = {
        highlightCode
      };
    }
  });

  // src/core/render/renderMermaidBlocks.ts
  var require_renderMermaidBlocks = __commonJS({
    "src/core/render/renderMermaidBlocks.ts"(exports, module) {
      function getFirstNonEmptyLine(source) {
        const lines = source.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) return trimmed;
        }
        return "";
      }
      function isValidMermaidSyntax(source) {
        const firstLine = getFirstNonEmptyLine(source);
        if (!firstLine) return false;
        const validStarters = [
          "graph ",
          "flowchart ",
          "sequenceDiagram",
          "stateDiagram",
          "stateDiagram-v2",
          "classDiagram",
          "erDiagram",
          "gantt",
          "journey",
          "pie ",
          "mindmap",
          "timeline"
        ];
        return validStarters.some((entry) => firstLine.startsWith(entry));
      }
      function renderMermaidBlocks(blocks, options = {}) {
        const defaultView = options.defaultView || "diagram";
        const warnings = [];
        const nextBlocks = blocks.map((block) => {
          if (!(block.type === "code" && block.language === "mermaid")) {
            return block;
          }
          const source = String(block.content || "");
          if (isValidMermaidSyntax(source)) {
            return {
              type: "mermaid",
              content: source,
              meta: {
                views: ["diagram", "code"],
                defaultView,
                toggleEnabled: true
              }
            };
          }
          warnings.push("Bloque Mermaid inv\xE1lido. Se muestra fallback de c\xF3digo.");
          return {
            type: "code",
            language: "mermaid",
            content: source,
            meta: {
              fallback: true
            }
          };
        });
        return {
          blocks: nextBlocks,
          warnings
        };
      }
      module.exports = {
        renderMermaidBlocks
      };
    }
  });

  // src/core/render/renderMarkdown.ts
  var require_renderMarkdown = __commonJS({
    "src/core/render/renderMarkdown.ts"(exports, module) {
      var { RENDER_KIND } = require_types5();
      var { renderMermaidBlocks } = require_renderMermaidBlocks();
      function isHtmlLike(line) {
        return /<[^>]+>/.test(line);
      }
      function isTableDivider(line) {
        return /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
      }
      function isListLine(line) {
        return /^\s*(?:[-*+]|\d+\.)\s+/.test(String(line || ""));
      }
      function getListDepth(rawLine) {
        var _a, _b;
        const leading = ((_b = (_a = String(rawLine || "").match(/^\s*/)) == null ? void 0 : _a[0]) == null ? void 0 : _b.replace(/\t/g, "  ").length) || 0;
        return Math.max(1, Math.floor(leading / 2) + 1);
      }
      function stripListMarker(rawLine) {
        return String(rawLine || "").replace(/^\s*(?:[-*+]|\d+\.)\s+/, "").trim();
      }
      function isHorizontalRuleLine(line) {
        const trimmed = String(line || "").trim();
        return /^([-*_])(?:\s*\1){2,}$/.test(trimmed);
      }
      function parseMarkdownBlocks(markdown) {
        const lines = String(markdown || "").split(/\r?\n/);
        const blocks = [];
        const warnings = [];
        let index = 0;
        while (index < lines.length) {
          const line = lines[index];
          const trimmed = line.trim();
          if (!trimmed) {
            index += 1;
            continue;
          }
          if (trimmed.startsWith("```")) {
            const language = trimmed.slice(3).trim().toLowerCase() || "text";
            index += 1;
            const codeLines = [];
            while (index < lines.length && !lines[index].trim().startsWith("```")) {
              codeLines.push(lines[index]);
              index += 1;
            }
            if (index < lines.length && lines[index].trim().startsWith("```")) {
              index += 1;
            } else {
              warnings.push("Bloque de c\xF3digo sin cierre detectado. Se degrad\xF3 al final del documento.");
            }
            blocks.push({
              type: "code",
              language,
              content: codeLines.join("\n")
            });
            continue;
          }
          if (/^#{1,6}\s+/.test(trimmed)) {
            const depth = trimmed.match(/^#{1,6}/)[0].length;
            blocks.push({
              type: "heading",
              depth,
              content: trimmed.slice(depth).trim()
            });
            index += 1;
            continue;
          }
          if (isHorizontalRuleLine(trimmed)) {
            blocks.push({
              type: "divider"
            });
            index += 1;
            continue;
          }
          if (isListLine(line)) {
            const ordered = /^\s*\d+\.\s+/.test(line);
            const items = [];
            while (index < lines.length && isListLine(lines[index])) {
              items.push({
                content: stripListMarker(lines[index]),
                depth: getListDepth(lines[index])
              });
              index += 1;
            }
            blocks.push({
              type: "list",
              ordered,
              items
            });
            continue;
          }
          const nextLine = lines[index + 1] || "";
          if (line.includes("|") && isTableDivider(nextLine)) {
            const tableLines = [line, nextLine];
            index += 2;
            while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
              tableLines.push(lines[index]);
              index += 1;
            }
            blocks.push({
              type: "table",
              content: tableLines.join("\n")
            });
            continue;
          }
          const paragraphLines = [line];
          index += 1;
          while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith("```") && !/^#{1,6}\s+/.test(lines[index].trim()) && !isListLine(lines[index]) && !(lines[index].includes("|") && isTableDivider(lines[index + 1] || ""))) {
            paragraphLines.push(lines[index]);
            index += 1;
          }
          const paragraph = paragraphLines.join("\n").trim();
          blocks.push({
            type: "paragraph",
            content: paragraph,
            meta: {
              htmlEscaped: isHtmlLike(paragraph)
            }
          });
        }
        return { blocks, warnings };
      }
      function renderMarkdown(markdown, options = {}) {
        const parsed = parseMarkdownBlocks(markdown);
        const mermaidResult = renderMermaidBlocks(parsed.blocks, {
          defaultView: options.mermaidDefaultView || "diagram"
        });
        return {
          ok: true,
          value: {
            kind: RENDER_KIND.MARKDOWN,
            blocks: mermaidResult.blocks,
            warnings: [...parsed.warnings, ...mermaidResult.warnings]
          }
        };
      }
      module.exports = {
        renderMarkdown
      };
    }
  });

  // src/core/render/performancePolicy.ts
  var require_performancePolicy = __commonJS({
    "src/core/render/performancePolicy.ts"(exports, module) {
      var { DEFAULT_RENDER_POLICY } = require_types5();
      function resolvePerformancePolicy(input = {}) {
        const inputBytes = Number(input.inputBytes || 0);
        const maxFullRenderBytes = Number(input.maxFullRenderBytes || DEFAULT_RENDER_POLICY.maxFullRenderBytes);
        const progressivePreviewBytes = Number(
          input.progressivePreviewBytes || DEFAULT_RENDER_POLICY.progressivePreviewBytes
        );
        const targetFirstPreviewMs = Number(
          input.targetFirstPreviewMs || DEFAULT_RENDER_POLICY.targetFirstPreviewMs
        );
        const mode = inputBytes > maxFullRenderBytes ? "progressive" : "full";
        const previewBytes = mode === "progressive" ? Math.min(progressivePreviewBytes, inputBytes) : inputBytes;
        return {
          mode,
          maxFullRenderBytes,
          previewBytes,
          targetFirstPreviewMs,
          shouldTruncate: mode === "progressive"
        };
      }
      module.exports = {
        resolvePerformancePolicy
      };
    }
  });

  // src/core/render/renderFilePreview.ts
  var require_renderFilePreview = __commonJS({
    "src/core/render/renderFilePreview.ts"(exports, module) {
      var { highlightCode } = require_highlightCode();
      var { renderMarkdown } = require_renderMarkdown();
      var { resolvePerformancePolicy } = require_performancePolicy();
      var { byteLengthUtf8 } = require_utf8ByteLength();
      var previewCache = /* @__PURE__ */ new Map();
      function normalizeExtension(extension) {
        if (typeof extension !== "string") return "txt";
        return extension.replace(/^\./, "").toLowerCase();
      }
      function truncateToBytes(content, maxBytes) {
        if (byteLengthUtf8(content) <= maxBytes) {
          return content;
        }
        let end = content.length;
        let start = 0;
        let best = "";
        while (start <= end) {
          const mid = Math.floor((start + end) / 2);
          const candidate = content.slice(0, mid);
          const bytes = byteLengthUtf8(candidate);
          if (bytes <= maxBytes) {
            best = candidate;
            start = mid + 1;
          } else {
            end = mid - 1;
          }
        }
        return best;
      }
      function fastHash(content) {
        const probe = content.slice(0, 1024);
        let hash = 0;
        for (let i = 0; i < probe.length; i += 1) {
          hash = hash * 31 + probe.charCodeAt(i) >>> 0;
        }
        return `${content.length}:${hash}`;
      }
      function renderByExtension(extension, content) {
        if (extension === "md") {
          return renderMarkdown(content);
        }
        return highlightCode({ extension, content });
      }
      function renderFilePreview(input, options = {}) {
        const startedAt = Date.now();
        const content = typeof (input == null ? void 0 : input.content) === "string" ? input.content : "";
        const sourceKey = String((input == null ? void 0 : input.sourceKey) || "");
        const extension = normalizeExtension(input == null ? void 0 : input.extension);
        const inputBytes = byteLengthUtf8(content);
        const cacheKey = `${sourceKey}:${extension}:${fastHash(content)}`;
        const cached = previewCache.get(cacheKey);
        if (cached) {
          return {
            ok: true,
            value: __spreadProps(__spreadValues({}, cached), {
              metrics: __spreadProps(__spreadValues({}, cached.metrics), {
                cacheHit: true,
                firstPreviewMs: 0
              })
            })
          };
        }
        const optionPolicy = options && typeof options.policy === "object" && options.policy ? options.policy : {};
        const policy = resolvePerformancePolicy(__spreadValues({
          inputBytes
        }, optionPolicy));
        const warnings = [];
        const contentToRender = policy.shouldTruncate ? truncateToBytes(content, policy.previewBytes) : content;
        if (policy.shouldTruncate) {
          warnings.push("Contenido grande: se muestra preview parcial inicial.");
        }
        const rendered = renderByExtension(extension, contentToRender);
        if (!rendered.ok) {
          return rendered;
        }
        const resultValue = {
          sourceKey,
          extension,
          kind: rendered.value.kind,
          blocks: rendered.value.blocks,
          warnings: [...warnings, ...rendered.value.warnings || []],
          truncated: policy.shouldTruncate,
          progressive: policy.mode === "progressive",
          metrics: {
            inputBytes,
            renderBytes: byteLengthUtf8(contentToRender),
            firstPreviewMs: Date.now() - startedAt,
            targetFirstPreviewMs: policy.targetFirstPreviewMs,
            cacheHit: false
          }
        };
        previewCache.set(cacheKey, resultValue);
        return {
          ok: true,
          value: resultValue
        };
      }
      module.exports = {
        renderFilePreview
      };
    }
  });

  // src/core/canvas/updateEmbedBlock.ts
  var require_updateEmbedBlock = __commonJS({
    "src/core/canvas/updateEmbedBlock.ts"(exports, module) {
      var { EMBED_BLOCK_KIND } = require_types2();
      var { createEmbedBlockModel } = require_embedBlockModel();
      var { composeEmbedBlock } = require_composeEmbedBlock();
      function updateEmbedBlockInPlace(block, patch = {}, options = {}) {
        var _a;
        const nowIso = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const base = (block == null ? void 0 : block.kind) === EMBED_BLOCK_KIND ? block : createEmbedBlockModel(block || {}, { now: nowIso });
        const nextModel = __spreadProps(__spreadValues({}, base), {
          sourceKey: typeof patch.sourceKey === "string" && patch.sourceKey ? patch.sourceKey : base.sourceKey,
          source: patch.source ? __spreadValues(__spreadValues({}, base.source), patch.source) : base.source,
          preview: patch.preview ? __spreadValues(__spreadValues({}, base.preview), patch.preview) : base.preview,
          sync: patch.sync ? __spreadValues(__spreadValues({}, base.sync), patch.sync) : base.sync,
          layout: patch.layout ? __spreadValues(__spreadValues({}, base.layout), patch.layout) : base.layout,
          updatedAt: nowIso,
          metadata: __spreadProps(__spreadValues({}, base.metadata), {
            updatedInPlace: true
          })
        });
        const composed = composeEmbedBlock(nextModel, { now: nowIso });
        return __spreadProps(__spreadValues({}, composed), {
          id: base.id,
          kind: base.kind,
          sourceKey: nextModel.sourceKey,
          source: nextModel.source,
          preview: nextModel.preview,
          sync: nextModel.sync,
          layout: nextModel.layout,
          createdAt: base.createdAt,
          updatedAt: nowIso,
          metadata: __spreadProps(__spreadValues({}, nextModel.metadata), {
            version: ((_a = base.metadata) == null ? void 0 : _a.version) || 1
          })
        });
      }
      module.exports = {
        updateEmbedBlockInPlace
      };
    }
  });

  // src/core/canvas/syncState.ts
  var require_syncState = __commonJS({
    "src/core/canvas/syncState.ts"(exports, module) {
      var { SYNC_STATUS, SYNC_MODE: SYNC_MODE2, SYNC_BADGE_TONE } = require_types2();
      function normalizeMode(mode) {
        if (mode === SYNC_MODE2.AUTO) return SYNC_MODE2.AUTO;
        return SYNC_MODE2.MANUAL;
      }
      function resolveNow(options = {}) {
        if (typeof options.now === "string" && options.now) {
          return options.now;
        }
        return (/* @__PURE__ */ new Date()).toISOString();
      }
      function transitionSyncState(currentSync = {}, event = {}, options = {}) {
        const nowIso = resolveNow(options);
        const mode = normalizeMode(event.mode || currentSync.mode);
        if (event.type === "start") {
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.SYNCING,
            mode,
            message: "Syncing...",
            details: "",
            lastUpdatedAt: nowIso
          });
        }
        if (event.type === "success") {
          const syncedAt = typeof event.syncedAt === "string" && event.syncedAt ? event.syncedAt : nowIso;
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.SUCCESS,
            mode,
            lastSyncAt: syncedAt,
            message: typeof event.message === "string" && event.message ? event.message : mode === SYNC_MODE2.AUTO ? "Auto-sync completado" : "Sincronizaci\xF3n completada",
            details: "",
            lastUpdatedAt: nowIso
          });
        }
        if (event.type === "error") {
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.ERROR,
            mode,
            message: typeof event.message === "string" && event.message ? event.message : "Sync error",
            details: typeof event.details === "string" && event.details ? event.details : "No se pudo sincronizar el contenido remoto.",
            lastUpdatedAt: nowIso
          });
        }
        return __spreadProps(__spreadValues({}, currentSync), {
          status: SYNC_STATUS.IDLE,
          mode,
          message: typeof currentSync.message === "string" && currentSync.message ? currentSync.message : "Sin sincronizar",
          details: typeof currentSync.details === "string" ? currentSync.details : "",
          lastUpdatedAt: nowIso
        });
      }
      function buildSyncBadge(sync = {}) {
        const status = sync.status || SYNC_STATUS.IDLE;
        const mode = normalizeMode(sync.mode);
        let label = "Idle";
        if (status === SYNC_STATUS.SYNCING) {
          label = "Syncing...";
        } else if (status === SYNC_STATUS.SUCCESS) {
          label = mode === SYNC_MODE2.AUTO ? "Auto-sync" : "Synced";
        } else if (status === SYNC_STATUS.ERROR) {
          label = "Sync error";
        }
        return {
          status,
          mode,
          label,
          tone: SYNC_BADGE_TONE[status] || SYNC_BADGE_TONE[SYNC_STATUS.IDLE],
          lastSyncAt: sync.lastSyncAt || null
        };
      }
      module.exports = {
        transitionSyncState,
        buildSyncBadge
      };
    }
  });

  // src/widget/runtime/redactSensitive.ts
  var require_redactSensitive = __commonJS({
    "src/widget/runtime/redactSensitive.ts"(exports, module) {
      var REDACTED = "[REDACTED_TOKEN]";
      var TOKEN_PATTERNS = [
        /\bgh[pousr]_[A-Za-z0-9_]{8,}\b/gi,
        /\bgithub_pat_[A-Za-z0-9_]{16,}\b/gi,
        /\bBearer\s+[A-Za-z0-9._\-+/=]{8,}\b/gi,
        /\btoken\s+[A-Za-z0-9._\-+/=]{8,}\b/gi
      ];
      function redactString(input) {
        if (typeof input !== "string" || input.length === 0) {
          return "";
        }
        let output = input;
        for (const pattern of TOKEN_PATTERNS) {
          output = output.replace(pattern, REDACTED);
        }
        return output;
      }
      function redactSensitive2(value) {
        if (typeof value === "string") {
          return redactString(value);
        }
        if (Array.isArray(value)) {
          return value.map((entry) => redactSensitive2(entry));
        }
        if (value && typeof value === "object") {
          const next = {};
          for (const [key, entry] of Object.entries(value)) {
            next[key] = redactSensitive2(entry);
          }
          return next;
        }
        return value;
      }
      module.exports = {
        REDACTED,
        redactSensitive: redactSensitive2
      };
    }
  });

  // src/widget/runtime/persistWidgetSnapshot.ts
  var require_persistWidgetSnapshot = __commonJS({
    "src/widget/runtime/persistWidgetSnapshot.ts"(exports, module) {
      function buildRenderSnapshot(preview = {}) {
        const blocks = Array.isArray(preview.blocks) ? preview.blocks : [];
        return {
          kind: typeof preview.kind === "string" ? preview.kind : "text",
          blockCount: blocks.length,
          truncated: Boolean(preview.truncated),
          progressive: Boolean(preview.progressive)
        };
      }
      function buildLastResultSnapshot(input = {}) {
        const base = input.lastResult && typeof input.lastResult === "object" ? input.lastResult : {};
        const status = typeof base.status === "string" && base.status ? base.status : typeof input.syncState === "string" && input.syncState ? input.syncState : "idle";
        return {
          status,
          mode: typeof base.mode === "string" && base.mode ? base.mode : "manual",
          message: typeof base.message === "string" ? base.message : "",
          details: typeof base.details === "string" ? base.details : "",
          at: typeof base.at === "string" && base.at ? base.at : typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      function buildWidgetSnapshot(input = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const block = input.embedBlock || {};
        const warnings = Array.isArray(input.warnings) ? input.warnings.filter((warning) => typeof warning === "string" && warning.trim()) : [];
        const syncState = ((_a = block.sync) == null ? void 0 : _a.status) || "idle";
        const updatedAt = typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : (/* @__PURE__ */ new Date()).toISOString();
        return {
          version: 1,
          sourceKey: typeof block.sourceKey === "string" && block.sourceKey ? block.sourceKey : String(input.sourceKey || ""),
          sourceUrl: typeof input.sourceUrl === "string" ? input.sourceUrl : "",
          syncState,
          lastSync: ((_b = block.sync) == null ? void 0 : _b.lastSyncAt) || null,
          warnings,
          warningCount: warnings.length,
          render: buildRenderSnapshot(block.preview),
          metrics: {
            firstPreviewMs: typeof ((_c = input.metrics) == null ? void 0 : _c.firstPreviewMs) === "number" ? input.metrics.firstPreviewMs : null,
            cacheHit: Boolean((_d = input.metrics) == null ? void 0 : _d.cacheHit)
          },
          lastResult: buildLastResultSnapshot({
            lastResult: input.lastResult || {
              status: ((_e = block.sync) == null ? void 0 : _e.status) || "idle",
              mode: ((_f = block.sync) == null ? void 0 : _f.mode) || "manual",
              message: ((_g = block.sync) == null ? void 0 : _g.message) || "",
              details: ((_h = block.sync) == null ? void 0 : _h.details) || "",
              at: ((_i = block.sync) == null ? void 0 : _i.lastUpdatedAt) || updatedAt
            },
            syncState,
            updatedAt
          }),
          updatedAt
        };
      }
      function mergeWidgetSnapshot(previousSnapshot, patch = {}) {
        const previous = previousSnapshot && typeof previousSnapshot === "object" ? previousSnapshot : {};
        const hasField = (name) => Object.prototype.hasOwnProperty.call(patch, name);
        const updatedAt = typeof patch.updatedAt === "string" && patch.updatedAt ? patch.updatedAt : (/* @__PURE__ */ new Date()).toISOString();
        return {
          version: 1,
          sourceKey: typeof patch.sourceKey === "string" && patch.sourceKey ? patch.sourceKey : previous.sourceKey || "",
          sourceUrl: typeof patch.sourceUrl === "string" ? patch.sourceUrl : previous.sourceUrl || "",
          syncState: typeof patch.syncState === "string" && patch.syncState ? patch.syncState : previous.syncState || "idle",
          lastSync: hasField("lastSync") ? patch.lastSync : previous.lastSync || null,
          warnings: Array.isArray(patch.warnings) ? patch.warnings : Array.isArray(previous.warnings) ? previous.warnings : [],
          warningCount: typeof patch.warningCount === "number" ? patch.warningCount : Array.isArray(patch.warnings) ? patch.warnings.length : typeof previous.warningCount === "number" ? previous.warningCount : 0,
          render: __spreadValues(__spreadValues({}, previous.render || {}), patch.render || {}),
          metrics: __spreadValues(__spreadValues({}, previous.metrics || {}), patch.metrics || {}),
          lastResult: buildLastResultSnapshot({
            lastResult: __spreadValues(__spreadValues({}, previous.lastResult || {}), patch.lastResult || {}),
            syncState: typeof patch.syncState === "string" && patch.syncState ? patch.syncState : previous.syncState || "idle",
            updatedAt
          }),
          updatedAt
        };
      }
      module.exports = {
        buildWidgetSnapshot,
        mergeWidgetSnapshot
      };
    }
  });

  // src/widget/runtime/normalizeRenderForWidget.ts
  var require_normalizeRenderForWidget = __commonJS({
    "src/widget/runtime/normalizeRenderForWidget.ts"(exports, module) {
      function asArray(value) {
        return Array.isArray(value) ? value : [];
      }
      function normalizeWarningList(list) {
        const seen = /* @__PURE__ */ new Set();
        const normalized = [];
        for (const item of asArray(list)) {
          if (typeof item !== "string") {
            continue;
          }
          const next = item.trim();
          if (!next || seen.has(next)) {
            continue;
          }
          seen.add(next);
          normalized.push(next);
        }
        return normalized;
      }
      function normalizeRenderForWidget(preview = {}, options = {}) {
        var _a, _b;
        const sourceBlocks = asArray(preview.blocks);
        const normalizedBlocks = [];
        const warnings = normalizeWarningList(preview.warnings);
        for (const block of sourceBlocks) {
          if ((block == null ? void 0 : block.type) === "mermaid") {
            normalizedBlocks.push({
              type: "code",
              language: "mermaid",
              content: String(block.content || ""),
              meta: {
                fromMermaidDiagram: true,
                phasePolicy: "code_view_only"
              }
            });
            warnings.push("Mermaid shown as code in phase 6.");
            continue;
          }
          if ((block == null ? void 0 : block.type) === "code" && (block == null ? void 0 : block.language) === "mermaid" && ((_a = block == null ? void 0 : block.meta) == null ? void 0 : _a.fallback)) {
            warnings.push("Mermaid fallback active: showing code block.");
            normalizedBlocks.push(block);
            continue;
          }
          normalizedBlocks.push(block);
        }
        const dedupedWarnings = normalizeWarningList(warnings);
        const warningDetail = dedupedWarnings.length > 0 ? `${dedupedWarnings[0]}${dedupedWarnings.length > 1 ? ` (+${dedupedWarnings.length - 1} more)` : ""}` : "";
        return {
          preview: __spreadProps(__spreadValues({}, preview), {
            blocks: normalizedBlocks,
            warnings: dedupedWarnings
          }),
          warnings: dedupedWarnings,
          warningDetail,
          policy: {
            mode: preview.progressive ? "progressive" : "full",
            firstPreviewMs: ((_b = preview == null ? void 0 : preview.metrics) == null ? void 0 : _b.firstPreviewMs) || null,
            targetMs: typeof options.targetFirstPreviewMs === "number" ? options.targetFirstPreviewMs : 2e3
          }
        };
      }
      module.exports = {
        normalizeRenderForWidget
      };
    }
  });

  // src/widget/runtime/createOrRefreshEmbedFromUrl.ts
  var require_createOrRefreshEmbedFromUrl = __commonJS({
    "src/widget/runtime/createOrRefreshEmbedFromUrl.ts"(exports, module) {
      var { createSeedEmbed } = require_createSeedEmbed();
      var { readGithubFileWithAuth } = require_readGithubFileWithAuth();
      var { renderFilePreview } = require_renderFilePreview();
      var { updateEmbedBlockInPlace } = require_updateEmbedBlock();
      var { transitionSyncState } = require_syncState();
      var { SYNC_MODE: SYNC_MODE2 } = require_types2();
      var { redactSensitive: redactSensitive2 } = require_redactSensitive();
      var {
        buildWidgetSnapshot,
        mergeWidgetSnapshot
      } = require_persistWidgetSnapshot();
      var {
        normalizeRenderForWidget
      } = require_normalizeRenderForWidget();
      function resolveNow(inputNow) {
        if (typeof inputNow === "string" && inputNow) {
          return inputNow;
        }
        return (/* @__PURE__ */ new Date()).toISOString();
      }
      function toRenderInput(readResult) {
        const source = (readResult == null ? void 0 : readResult.source) || {};
        const extension = source.extension || String(source.path || "").split(".").pop() || "txt";
        return {
          sourceKey: readResult.sourceKey,
          extension,
          content: readResult.content
        };
      }
      function buildSeedBlock(url) {
        const seed = createSeedEmbed({ url });
        if (!seed.ok) {
          return seed;
        }
        return {
          ok: true,
          value: seed.value.embedBlock
        };
      }
      function normalizeError(errorLike, fallbackCode, fallbackMessage, fallbackDetails) {
        if (!errorLike || typeof errorLike !== "object") {
          return {
            code: fallbackCode,
            message: fallbackMessage,
            details: fallbackDetails
          };
        }
        return {
          code: errorLike.code || fallbackCode,
          message: redactSensitive2(errorLike.message || fallbackMessage),
          details: redactSensitive2(errorLike.details || fallbackDetails)
        };
      }
      function normalizeAuthState(authLike) {
        if (!authLike || typeof authLike !== "object") {
          return null;
        }
        return {
          kind: typeof authLike.kind === "string" ? authLike.kind : null,
          sourceKey: typeof authLike.sourceKey === "string" && authLike.sourceKey ? authLike.sourceKey : null,
          usedPat: Boolean(authLike.usedPat),
          retryCount: Number(authLike.retryCount || 0),
          patStatus: typeof authLike.patStatus === "string" && authLike.patStatus ? authLike.patStatus : null
        };
      }
      async function createOrRefreshEmbedFromUrl2(input = {}, deps = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        const url = typeof input.url === "string" ? input.url.trim() : "";
        if (!url) {
          return {
            ok: false,
            error: {
              code: "MISSING_URL",
              message: "A GitHub file URL is required."
            },
            value: {
              embedBlock: input.currentEmbedBlock || null,
              snapshot: input.currentSnapshot || null
            }
          };
        }
        const now = resolveNow(input.now);
        const nowOptions = { now };
        const mode = input.mode === SYNC_MODE2.AUTO ? SYNC_MODE2.AUTO : SYNC_MODE2.MANUAL;
        const previousSnapshot = input.currentSnapshot || null;
        const baseBlockResult = input.currentEmbedBlock ? { ok: true, value: input.currentEmbedBlock } : buildSeedBlock(url);
        if (!baseBlockResult.ok) {
          return {
            ok: false,
            error: baseBlockResult.error,
            value: {
              embedBlock: input.currentEmbedBlock || null,
              snapshot: previousSnapshot
            }
          };
        }
        const baseBlock = baseBlockResult.value;
        const syncingState = transitionSyncState(
          baseBlock.sync,
          {
            type: "start",
            mode
          },
          nowOptions
        );
        const syncingBlock = updateEmbedBlockInPlace(
          baseBlock,
          {
            sync: syncingState
          },
          nowOptions
        );
        const readGithub = typeof deps.readGithubFileWithAuth === "function" ? deps.readGithubFileWithAuth : readGithubFileWithAuth;
        const readResult = await readGithub(url, {
          patStore: input.patStore,
          fetchImpl: input.fetchImpl
        });
        if (!(readResult == null ? void 0 : readResult.ok)) {
          const error = normalizeError(
            readResult == null ? void 0 : readResult.error,
            "READ_FAILED",
            "Could not read remote file.",
            "No details provided."
          );
          const failedSync = transitionSyncState(
            syncingBlock.sync,
            {
              type: "error",
              mode,
              message: error.message,
              details: error.details
            },
            nowOptions
          );
          const failedBlock = updateEmbedBlockInPlace(
            syncingBlock,
            {
              sync: failedSync
            },
            nowOptions
          );
          const snapshot2 = mergeWidgetSnapshot(
            previousSnapshot,
            buildWidgetSnapshot({
              embedBlock: failedBlock,
              sourceUrl: url,
              warnings: ((_a = failedBlock.preview) == null ? void 0 : _a.warnings) || [],
              lastResult: {
                status: ((_b = failedBlock.sync) == null ? void 0 : _b.status) || "error",
                mode: ((_c = failedBlock.sync) == null ? void 0 : _c.mode) || mode,
                message: ((_d = failedBlock.sync) == null ? void 0 : _d.message) || error.message,
                details: ((_e = failedBlock.sync) == null ? void 0 : _e.details) || error.details
              },
              updatedAt: now
            })
          );
          return {
            ok: false,
            error,
            auth: normalizeAuthState(readResult == null ? void 0 : readResult.auth),
            value: {
              embedBlock: failedBlock,
              snapshot: snapshot2
            }
          };
        }
        const renderPreview = typeof deps.renderFilePreview === "function" ? deps.renderFilePreview : renderFilePreview;
        const renderResult = renderPreview(toRenderInput(readResult.value));
        if (!(renderResult == null ? void 0 : renderResult.ok)) {
          const error = normalizeError(
            renderResult == null ? void 0 : renderResult.error,
            "RENDER_FAILED",
            "Could not render file preview.",
            "No details provided."
          );
          const failedSync = transitionSyncState(
            syncingBlock.sync,
            {
              type: "error",
              mode,
              message: error.message,
              details: error.details
            },
            nowOptions
          );
          const failedBlock = updateEmbedBlockInPlace(
            syncingBlock,
            {
              sync: failedSync
            },
            nowOptions
          );
          const snapshot2 = mergeWidgetSnapshot(
            previousSnapshot,
            buildWidgetSnapshot({
              embedBlock: failedBlock,
              sourceUrl: url,
              warnings: ((_f = failedBlock.preview) == null ? void 0 : _f.warnings) || [],
              lastResult: {
                status: ((_g = failedBlock.sync) == null ? void 0 : _g.status) || "error",
                mode: ((_h = failedBlock.sync) == null ? void 0 : _h.mode) || mode,
                message: ((_i = failedBlock.sync) == null ? void 0 : _i.message) || error.message,
                details: ((_j = failedBlock.sync) == null ? void 0 : _j.details) || error.details
              },
              updatedAt: now
            })
          );
          return {
            ok: false,
            error,
            value: {
              embedBlock: failedBlock,
              snapshot: snapshot2
            }
          };
        }
        const normalizePreview = typeof deps.normalizePreview === "function" ? deps.normalizePreview : normalizeRenderForWidget;
        const normalizedPreview = normalizePreview(renderResult.value, {
          url,
          source: readResult.value.source,
          targetFirstPreviewMs: 2e3
        });
        const preview = (normalizedPreview == null ? void 0 : normalizedPreview.preview) || normalizedPreview;
        const warnings = Array.isArray(normalizedPreview == null ? void 0 : normalizedPreview.warnings) ? normalizedPreview.warnings : Array.isArray(preview == null ? void 0 : preview.warnings) ? preview.warnings : [];
        const warningDetail = typeof (normalizedPreview == null ? void 0 : normalizedPreview.warningDetail) === "string" ? normalizedPreview.warningDetail : warnings.length > 0 ? warnings.join(" | ") : "";
        const successSync = transitionSyncState(
          syncingBlock.sync,
          {
            type: "success",
            mode,
            message: warnings.length > 0 ? mode === SYNC_MODE2.AUTO ? "Auto-sync completado con advertencias" : "Preview updated with warnings" : mode === SYNC_MODE2.AUTO ? "Auto-sync completado" : "Preview created",
            details: warningDetail,
            syncedAt: now
          },
          nowOptions
        );
        const updatedBlock = updateEmbedBlockInPlace(
          syncingBlock,
          {
            sourceKey: readResult.value.sourceKey,
            source: readResult.value.source,
            preview,
            sync: successSync,
            metadata: {
              sourceUrl: url
            }
          },
          nowOptions
        );
        const snapshot = mergeWidgetSnapshot(
          previousSnapshot,
          buildWidgetSnapshot({
            embedBlock: updatedBlock,
            sourceUrl: url,
            warnings,
            metrics: (preview == null ? void 0 : preview.metrics) || null,
            lastResult: {
              status: ((_k = updatedBlock.sync) == null ? void 0 : _k.status) || "success",
              mode: ((_l = updatedBlock.sync) == null ? void 0 : _l.mode) || mode,
              message: ((_m = updatedBlock.sync) == null ? void 0 : _m.message) || "Preview created",
              details: ((_n = updatedBlock.sync) == null ? void 0 : _n.details) || ""
            },
            updatedAt: now
          })
        );
        return {
          ok: true,
          auth: normalizeAuthState(readResult == null ? void 0 : readResult.auth),
          value: {
            embedBlock: updatedBlock,
            snapshot,
            source: readResult.value.source,
            render: preview
          }
        };
      }
      module.exports = {
        createOrRefreshEmbedFromUrl: createOrRefreshEmbedFromUrl2
      };
    }
  });

  // src/widget/runtime/patSessionStore.ts
  var require_patSessionStore = __commonJS({
    "src/widget/runtime/patSessionStore.ts"(exports, module) {
      var { createPatStore } = require_patStore();
      var DEFAULT_STORAGE_KEY = "github-preview-widget/pat-session/v1";
      var DEFAULT_CIPHER_KEY = "github-preview-widget::pat-session";
      function toBase64(bytes) {
        if (typeof Buffer !== "undefined") {
          return Buffer.from(bytes).toString("base64");
        }
        let binary = "";
        for (const value of bytes) {
          binary += String.fromCharCode(value);
        }
        return globalThis.btoa(binary);
      }
      function fromBase64(input) {
        if (typeof input !== "string" || input.length === 0) {
          return new Uint8Array(0);
        }
        if (typeof Buffer !== "undefined") {
          return Uint8Array.from(Buffer.from(input, "base64"));
        }
        const binary = globalThis.atob(input);
        const out = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
          out[i] = binary.charCodeAt(i);
        }
        return out;
      }
      function xorBytes(payloadBytes, keyBytes) {
        if (!(keyBytes instanceof Uint8Array) || keyBytes.length === 0) {
          throw new TypeError("Cipher key must not be empty.");
        }
        const out = new Uint8Array(payloadBytes.length);
        for (let i = 0; i < payloadBytes.length; i += 1) {
          out[i] = payloadBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        return out;
      }
      function encodePersistedRecords(records, cipherKey) {
        const encoder = new TextEncoder();
        const payload = JSON.stringify({
          version: 1,
          records: Array.isArray(records) ? records : []
        });
        const payloadBytes = encoder.encode(payload);
        const keyBytes = encoder.encode(String(cipherKey || DEFAULT_CIPHER_KEY));
        return toBase64(xorBytes(payloadBytes, keyBytes));
      }
      function decodePersistedRecords(input, cipherKey) {
        if (typeof input !== "string" || input.trim() === "") {
          return [];
        }
        try {
          const bytes = fromBase64(input);
          const decoder = new TextDecoder();
          const keyBytes = new TextEncoder().encode(String(cipherKey || DEFAULT_CIPHER_KEY));
          const plain = decoder.decode(xorBytes(bytes, keyBytes));
          const parsed = JSON.parse(plain);
          if (!Array.isArray(parsed == null ? void 0 : parsed.records)) {
            return [];
          }
          return parsed.records;
        } catch (_error) {
          return [];
        }
      }
      function normalizeRecord(record) {
        const sourceKey = String((record == null ? void 0 : record.sourceKey) || "").trim();
        const token = String((record == null ? void 0 : record.token) || "").trim();
        if (!sourceKey || !token) return null;
        return {
          sourceKey,
          token,
          status: typeof (record == null ? void 0 : record.status) === "string" ? record.status : "unknown",
          lastValidatedAt: typeof (record == null ? void 0 : record.lastValidatedAt) === "string" ? record.lastValidatedAt : void 0,
          lastErrorCode: typeof (record == null ? void 0 : record.lastErrorCode) === "string" ? record.lastErrorCode : void 0
        };
      }
      function isStorageLike(storage) {
        return Boolean(
          storage && typeof storage.getAsync === "function" && typeof storage.setAsync === "function"
        );
      }
      function createPatSessionStore2(options = {}) {
        const storage = options.storage;
        const storageKey = typeof options.storageKey === "string" && options.storageKey ? options.storageKey : DEFAULT_STORAGE_KEY;
        const cipherKey = typeof options.cipherKey === "string" && options.cipherKey ? options.cipherKey : DEFAULT_CIPHER_KEY;
        const initialRecords = Array.isArray(options.initialRecords) ? options.initialRecords.map((record) => normalizeRecord(record)).filter(Boolean) : [];
        const recordMap = new Map(initialRecords.map((record) => [record.sourceKey, record]));
        const delegate = createPatStore(initialRecords);
        let persistQueue = Promise.resolve();
        function cloneRecords() {
          return Array.from(recordMap.values()).map((entry) => __spreadValues({}, entry));
        }
        function schedulePersist() {
          if (!isStorageLike(storage)) {
            return Promise.resolve(false);
          }
          const payload = encodePersistedRecords(cloneRecords(), cipherKey);
          persistQueue = persistQueue.catch(() => {
          }).then(() => storage.setAsync(storageKey, payload)).then(() => true).catch(() => false);
          return persistQueue;
        }
        return {
          get(sourceKey) {
            return delegate.get(sourceKey);
          },
          set(sourceKey, token) {
            const next = delegate.set(sourceKey, token);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
              void schedulePersist();
            }
            return next;
          },
          markValid(sourceKey, validatedAt) {
            const next = delegate.markValid(sourceKey, validatedAt);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
              void schedulePersist();
            }
            return next;
          },
          markInvalid(sourceKey, errorCode, validatedAt) {
            const next = delegate.markInvalid(sourceKey, errorCode, validatedAt);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
              void schedulePersist();
            }
            return next;
          },
          remove(sourceKey) {
            const removed = delegate.remove(sourceKey);
            if (removed) {
              recordMap.delete(String(sourceKey).trim());
              if (isStorageLike(storage)) {
                if (recordMap.size === 0 && typeof storage.deleteAsync === "function") {
                  persistQueue = persistQueue.catch(() => {
                  }).then(() => storage.deleteAsync(storageKey)).catch(() => false);
                } else {
                  void schedulePersist();
                }
              }
            }
            return removed;
          },
          flush() {
            return persistQueue.catch(() => false);
          },
          dump() {
            return cloneRecords();
          }
        };
      }
      async function loadPatSessionStore2(options = {}) {
        const storage = options.storage;
        if (!isStorageLike(storage)) {
          return createPatSessionStore2(options);
        }
        const storageKey = typeof options.storageKey === "string" && options.storageKey ? options.storageKey : DEFAULT_STORAGE_KEY;
        const cipherKey = typeof options.cipherKey === "string" && options.cipherKey ? options.cipherKey : DEFAULT_CIPHER_KEY;
        let initialRecords = [];
        try {
          const payload = await storage.getAsync(storageKey);
          initialRecords = decodePersistedRecords(payload, cipherKey);
        } catch (_error) {
          initialRecords = [];
        }
        return createPatSessionStore2(__spreadProps(__spreadValues({}, options), {
          storage,
          storageKey,
          cipherKey,
          initialRecords
        }));
      }
      module.exports = {
        DEFAULT_STORAGE_KEY,
        DEFAULT_CIPHER_KEY,
        encodePersistedRecords,
        decodePersistedRecords,
        createPatSessionStore: createPatSessionStore2,
        loadPatSessionStore: loadPatSessionStore2
      };
    }
  });

  // src/widget/runtime/syncCoordinator.ts
  var require_syncCoordinator = __commonJS({
    "src/widget/runtime/syncCoordinator.ts"(exports, module) {
      var { SYNC_STATUS } = require_types2();
      var DEFAULT_AUTO_REFRESH_COOLDOWN_MS = 6e4;
      function normalizeSourceKey(sourceKey) {
        if (typeof sourceKey !== "string") return "";
        return sourceKey.trim();
      }
      function resolveNowMs(nowMs) {
        if (typeof nowMs === "number" && Number.isFinite(nowMs) && nowMs >= 0) {
          return nowMs;
        }
        return Date.now();
      }
      function shouldRunAutoRefresh2(input = {}, options = {}) {
        const sourceKey = normalizeSourceKey(input.sourceKey);
        if (!sourceKey) {
          return { ok: false, reason: "missing_source_key" };
        }
        const sourceUrl = typeof input.sourceUrl === "string" ? input.sourceUrl.trim() : "";
        if (!sourceUrl) {
          return { ok: false, reason: "missing_source_url" };
        }
        if (input.syncStatus === SYNC_STATUS.SYNCING) {
          return { ok: false, reason: "already_syncing" };
        }
        const nowMs = resolveNowMs(input.nowMs);
        const cooldownMs = typeof options.cooldownMs === "number" && options.cooldownMs >= 0 ? options.cooldownMs : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
        const lastAutoRefreshAt = typeof input.lastAutoRefreshAtMs === "number" && input.lastAutoRefreshAtMs >= 0 ? input.lastAutoRefreshAtMs : null;
        if (lastAutoRefreshAt !== null && nowMs - lastAutoRefreshAt < cooldownMs) {
          return {
            ok: false,
            reason: "cooldown",
            nextEligibleAtMs: lastAutoRefreshAt + cooldownMs
          };
        }
        return {
          ok: true,
          reason: "eligible",
          sourceKey,
          nowMs
        };
      }
      function createSyncCoordinator2(options = {}) {
        const cooldownMs = typeof options.cooldownMs === "number" && options.cooldownMs >= 0 ? options.cooldownMs : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
        const activeManualLocks = /* @__PURE__ */ new Set();
        function beginManual(input = {}) {
          const sourceKey = normalizeSourceKey(input.sourceKey);
          if (!sourceKey) {
            return { ok: false, reason: "missing_source_key" };
          }
          if (input.syncStatus === SYNC_STATUS.SYNCING) {
            return { ok: false, reason: "already_syncing" };
          }
          if (activeManualLocks.has(sourceKey)) {
            return { ok: false, reason: "manual_lock" };
          }
          activeManualLocks.add(sourceKey);
          return { ok: true, sourceKey };
        }
        function endManual(sourceKey) {
          const normalized = normalizeSourceKey(sourceKey);
          if (!normalized) return false;
          return activeManualLocks.delete(normalized);
        }
        function canAutoRefresh(input = {}) {
          return shouldRunAutoRefresh2(input, { cooldownMs });
        }
        return {
          cooldownMs,
          beginManual,
          endManual,
          canAutoRefresh,
          shouldRunAutoRefresh: canAutoRefresh
        };
      }
      module.exports = {
        DEFAULT_AUTO_REFRESH_COOLDOWN_MS,
        createSyncCoordinator: createSyncCoordinator2,
        shouldRunAutoRefresh: shouldRunAutoRefresh2
      };
    }
  });

  // src/widget/code.ts
  var { parseUiCommand } = require_parseUiCommand();
  var { UI_COMMAND, UI_EVENT } = require_messages();
  var {
    createOrRefreshEmbedFromUrl
  } = require_createOrRefreshEmbedFromUrl();
  var {
    createPatSessionStore,
    loadPatSessionStore
  } = require_patSessionStore();
  var { redactSensitive } = require_redactSensitive();
  var {
    createSyncCoordinator,
    shouldRunAutoRefresh
  } = require_syncCoordinator();
  var { SYNC_MODE } = require_types2();
  var { widget } = figma;
  var {
    AutoLayout,
    Text,
    useEffect,
    usePropertyMenu,
    useSyncedState,
    waitForTask,
    h
  } = widget;
  var AUTH_ERROR_CODES = Object.freeze({
    MISSING_PAT: "MISSING_PAT",
    EXPIRED_PAT: "EXPIRED_PAT",
    CURRENT_PAT: "CURRENT_PAT"
  });
  var AUTH_MESSAGES = Object.freeze({
    [AUTH_ERROR_CODES.MISSING_PAT]: "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.",
    [AUTH_ERROR_CODES.EXPIRED_PAT]: "Tu personal access token es invalido o ha expirado.",
    [AUTH_ERROR_CODES.CURRENT_PAT]: "Tu personal access token no tiene permisos/scope suficiente."
  });
  var PROPERTY_ACTION = Object.freeze({
    OPEN_URL: "open_url",
    REFRESH_NOW: "refresh_now",
    WIDTH_DEC: "width_dec",
    WIDTH_INC: "width_inc",
    HEIGHT_DEC: "height_dec",
    HEIGHT_INC: "height_inc"
  });
  var syncCoordinator = createSyncCoordinator({ cooldownMs: 6e4 });
  var CANVAS_SIZE_LIMITS = Object.freeze({
    minWidth: 320,
    maxWidth: 1800,
    minHeight: 220,
    maxHeight: 2200,
    defaultWidth: 760,
    defaultHeight: 920,
    widthStep: 120,
    heightStep: 120
  });
  var CANVAS_LAYOUT = Object.freeze({
    root: {
      spacing: 8,
      padding: 12,
      cornerRadius: 8
    },
    previewPanel: {
      spacing: 8,
      padding: 12,
      cornerRadius: 8,
      insetHorizontal: 16
    },
    divider: {
      thickness: 1
    },
    table: {
      rowSpacing: 0,
      stackSpacing: 0,
      cellPaddingVertical: 3,
      cellPaddingHorizontal: 4,
      borderWidth: 0.5
    },
    code: {
      padding: 12,
      cornerRadius: 8,
      borderWidth: 0.5
    }
  });
  var runtimePatStorePromise = null;
  var autoRefreshBootstrapped = false;
  var lastUiOpenNonce = 0;
  var lastUiReadyNonce = 0;
  var uiSessionPromise = null;
  var resolveUiSession = null;
  function ensureUiSessionTask() {
    if (uiSessionPromise) {
      return uiSessionPromise;
    }
    uiSessionPromise = new Promise((resolve) => {
      resolveUiSession = resolve;
    });
    if (typeof waitForTask === "function") {
      waitForTask(uiSessionPromise);
    }
    return uiSessionPromise;
  }
  function endUiSessionTask() {
    if (typeof resolveUiSession === "function") {
      resolveUiSession();
    }
    resolveUiSession = null;
    uiSessionPromise = null;
  }
  function getRuntimePatStore() {
    if (!runtimePatStorePromise) {
      runtimePatStorePromise = loadPatSessionStore({
        storage: figma.clientStorage,
        cipherKey: "github-preview-widget/phase-7"
      }).catch(() => createPatSessionStore());
    }
    return runtimePatStorePromise;
  }
  function openWidgetUi() {
    const bundledHtml = typeof __widget_ui_html__ === "string" && __widget_ui_html__.trim().length > 0 ? __widget_ui_html__ : "";
    const runtimeHtml = typeof __html__ === "string" && __html__.trim().length > 0 ? __html__ : "";
    const html = bundledHtml || runtimeHtml || "<!doctype html><html><body><p>UI not available.</p></body></html>";
    figma.showUI(html, {
      width: 420,
      height: 420,
      visible: true
    });
    const uiVisible = figma.ui && typeof figma.ui.visible === "boolean" ? String(figma.ui.visible) : "unknown";
    figma.notify(`UI visible: ${uiVisible}`);
    const openNonce = ++lastUiOpenNonce;
    setTimeout(() => {
      if (lastUiReadyNonce < openNonce) {
        figma.notify("UI opened but did not initialize.", { error: true });
      }
    }, 900);
  }
  function deriveSourceKey(url, embedBlock, embedSnapshot, authContext) {
    if (typeof (embedBlock == null ? void 0 : embedBlock.sourceKey) === "string" && embedBlock.sourceKey) {
      return embedBlock.sourceKey;
    }
    if (typeof (embedSnapshot == null ? void 0 : embedSnapshot.sourceKey) === "string" && embedSnapshot.sourceKey) {
      return embedSnapshot.sourceKey;
    }
    if (typeof (authContext == null ? void 0 : authContext.sourceKey) === "string" && authContext.sourceKey) {
      return authContext.sourceKey;
    }
    if (typeof url === "string") {
      return url.trim();
    }
    return "";
  }
  function buildLastResult(snapshot, embedBlock) {
    const snapshotLast = snapshot == null ? void 0 : snapshot.lastResult;
    if (snapshotLast && typeof snapshotLast === "object") {
      return {
        status: snapshotLast.status || "idle",
        mode: snapshotLast.mode || "manual",
        message: snapshotLast.message || "",
        details: snapshotLast.details || "",
        at: snapshotLast.at || (snapshot == null ? void 0 : snapshot.updatedAt) || (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const sync = (embedBlock == null ? void 0 : embedBlock.sync) || {};
    return {
      status: sync.status || "idle",
      mode: sync.mode || "manual",
      message: sync.message || "",
      details: sync.details || "",
      at: sync.lastUpdatedAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function clampText(value, maxChars) {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) return "";
    if (text.length <= maxChars) return text;
    return `${text.slice(0, Math.max(0, maxChars - 1))}\u2026`;
  }
  function readListItem(listItem) {
    if (listItem && typeof listItem === "object") {
      return {
        content: String(listItem.content || ""),
        depth: Math.max(1, Number(listItem.depth || 1))
      };
    }
    return {
      content: String(listItem || ""),
      depth: 1
    };
  }
  function listBulletForDepth(depth) {
    if (depth <= 1) return "\u2022";
    if (depth === 2) return "\u25E6";
    return "\u25AA";
  }
  function buildUiPreviewTextFromBlock(block, options = {}) {
    var _a;
    const maxChars = Number.isFinite(Number(options.maxChars)) && Number(options.maxChars) > 0 ? Number(options.maxChars) : 2e5;
    const parts = [];
    const blocks = Array.isArray((_a = block == null ? void 0 : block.preview) == null ? void 0 : _a.blocks) ? block.preview.blocks : [];
    for (const item of blocks) {
      const type = typeof (item == null ? void 0 : item.type) === "string" ? item.type : "";
      if (type === "heading") {
        parts.push(`# ${String(item.content || "").trim()}`);
        continue;
      }
      if (type === "paragraph") {
        parts.push(String(item.content || ""));
        continue;
      }
      if (type === "list" && Array.isArray(item.items)) {
        const orderedCounters = {};
        for (const entry of item.items) {
          const normalized = readListItem(entry);
          const indent = "  ".repeat(Math.max(0, normalized.depth - 1));
          let prefix = listBulletForDepth(normalized.depth);
          if (item.ordered) {
            orderedCounters[normalized.depth] = (orderedCounters[normalized.depth] || 0) + 1;
            for (const depthKey of Object.keys(orderedCounters)) {
              if (Number(depthKey) > normalized.depth) {
                delete orderedCounters[depthKey];
              }
            }
            prefix = `${orderedCounters[normalized.depth]}.`;
          }
          parts.push(`${indent}${prefix} ${normalized.content}`);
        }
        continue;
      }
      if (type === "divider") {
        parts.push("---");
        continue;
      }
      if (type === "table") {
        parts.push(String(item.content || ""));
        continue;
      }
      if (type === "code" || type === "text") {
        const language = typeof item.language === "string" && item.language ? item.language : "txt";
        parts.push(`\`\`\`${language}`);
        parts.push(String(item.content || ""));
        parts.push("```");
        continue;
      }
      if (typeof (item == null ? void 0 : item.content) === "string" && item.content) {
        parts.push(item.content);
      }
    }
    let text = parts.join("\n\n").trim();
    if (!text) {
      return "";
    }
    if (text.length > maxChars) {
      text = `${text.slice(0, maxChars)}

[preview truncated in UI]`;
    }
    return text;
  }
  function toNumberOrFallback(value, fallback) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return num;
  }
  function clampCanvasSize(input = {}) {
    const width = Math.round(
      Math.max(
        CANVAS_SIZE_LIMITS.minWidth,
        Math.min(CANVAS_SIZE_LIMITS.maxWidth, toNumberOrFallback(input.width, CANVAS_SIZE_LIMITS.defaultWidth))
      )
    );
    const height = Math.round(
      Math.max(
        CANVAS_SIZE_LIMITS.minHeight,
        Math.min(
          CANVAS_SIZE_LIMITS.maxHeight,
          toNumberOrFallback(input.height, CANVAS_SIZE_LIMITS.defaultHeight)
        )
      )
    );
    return { width, height };
  }
  function fitPreviewTextForCanvas(inputText, options = {}) {
    const text = typeof inputText === "string" ? inputText : "";
    if (!text) return "";
    const width = Math.max(180, Number(options.width || CANVAS_SIZE_LIMITS.defaultWidth));
    const height = Math.max(120, Number(options.height || CANVAS_SIZE_LIMITS.defaultHeight));
    const charsPerLine = Math.max(28, Math.floor((width - 48) / 6.2));
    const maxLines = Math.max(8, Math.floor((height - 24) / 14));
    const sourceLines = text.split(/\r?\n/);
    const out = [];
    for (const rawLine of sourceLines) {
      if (out.length >= maxLines) break;
      const line = String(rawLine || "");
      if (!line) {
        out.push("");
        continue;
      }
      let cursor = 0;
      while (cursor < line.length && out.length < maxLines) {
        out.push(line.slice(cursor, cursor + charsPerLine));
        cursor += charsPerLine;
      }
    }
    if (out.length >= maxLines && sourceLines.length > 0) {
      const last = out[maxLines - 1] || "";
      out[maxLines - 1] = clampText(last, Math.max(1, charsPerLine - 1));
      out[maxLines - 1] = `${out[maxLines - 1]}\u2026`;
    }
    return out.join("\n");
  }
  function buildUiPreviewPayload(block) {
    const preview = (block == null ? void 0 : block.preview) || {};
    return {
      previewKind: typeof preview.kind === "string" && preview.kind ? preview.kind : "text",
      previewBlocks: Array.isArray(preview.blocks) ? preview.blocks : []
    };
  }
  function stripInlineMarkdown(value) {
    let text = String(value || "");
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1");
    text = text.replace(/`([^`]+)`/g, "$1");
    text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
    text = text.replace(/__([^_]+)__/g, "$1");
    text = text.replace(/\*([^*\n]+)\*/g, "$1");
    text = text.replace(/_([^_\n]+)_/g, "$1");
    return text;
  }
  function parseCanvasTable(content, options = {}) {
    const maxCols = Math.max(2, Number(options.maxCols || 4));
    const maxRows = Math.max(1, Number(options.maxRows || 6));
    const lines = String(content || "").split(/\r?\n/g).map((line) => line.trimEnd()).filter(Boolean);
    if (lines.length < 2) return null;
    const divider = lines[1].replace(/\|/g, "").trim();
    if (!/^[:\-\s]+$/.test(divider)) return null;
    const parseRow = (line) => stripInlineMarkdown(line).replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    const header = parseRow(lines[0]).slice(0, maxCols);
    if (!header.length) return null;
    const rows = [];
    for (const line of lines.slice(2)) {
      if (rows.length >= maxRows) break;
      const row = parseRow(line).slice(0, maxCols);
      while (row.length < header.length) {
        row.push("");
      }
      rows.push(row);
    }
    return {
      header,
      rows
    };
  }
  function estimateCanvasUnitsFromText(text, charsPerLine) {
    const lines = String(text || "").split(/\r?\n/g);
    let units = 0;
    for (const line of lines) {
      const length = Math.max(1, String(line || "").length);
      units += Math.max(1, Math.ceil(length / Math.max(12, charsPerLine)));
    }
    return Math.max(1, units);
  }
  function buildCanvasPreviewEntries(blocks, options = {}) {
    const sourceBlocks = Array.isArray(blocks) ? blocks : [];
    if (!sourceBlocks.length) return [];
    const width = Math.max(180, Number(options.width || CANVAS_SIZE_LIMITS.defaultWidth));
    const height = Math.max(120, Number(options.height || CANVAS_SIZE_LIMITS.defaultHeight));
    const charsPerLine = Math.max(24, Math.floor((width - 20) / 6.2));
    const maxUnits = Math.max(24, Math.floor(height / 14) * 2);
    const out = [];
    let usedUnits = 0;
    const pushEntry = (entry, estimatedUnits) => {
      const units = Math.max(1, Number(estimatedUnits || 1));
      if (usedUnits + units > maxUnits && out.length > 0) {
        return false;
      }
      out.push(entry);
      usedUnits += units;
      return true;
    };
    for (const block of sourceBlocks) {
      if (usedUnits >= maxUnits) break;
      const type = typeof (block == null ? void 0 : block.type) === "string" ? block.type : "text";
      if (type === "heading") {
        const text = stripInlineMarkdown(block.content || "");
        if (!pushEntry(
          {
            type: "text",
            text,
            style: { fontSize: 11, fontWeight: 700, fill: "#111827" }
          },
          estimateCanvasUnitsFromText(text, charsPerLine)
        )) {
          break;
        }
        continue;
      }
      if (type === "paragraph") {
        const text = stripInlineMarkdown(block.content || "");
        if (!pushEntry(
          {
            type: "text",
            text,
            style: { fontSize: 10, fill: "#1F2937" }
          },
          estimateCanvasUnitsFromText(text, charsPerLine)
        )) {
          break;
        }
        continue;
      }
      if (type === "list" && Array.isArray(block.items)) {
        const orderedCounters = {};
        for (const item of block.items) {
          const normalized = readListItem(item);
          const indent = "  ".repeat(Math.max(0, normalized.depth - 1));
          let prefix = listBulletForDepth(normalized.depth);
          if (block.ordered) {
            orderedCounters[normalized.depth] = (orderedCounters[normalized.depth] || 0) + 1;
            for (const depthKey of Object.keys(orderedCounters)) {
              if (Number(depthKey) > normalized.depth) {
                delete orderedCounters[depthKey];
              }
            }
            prefix = `${orderedCounters[normalized.depth]}.`;
          }
          const line = `${indent}${prefix} ${stripInlineMarkdown(normalized.content)}`;
          if (!pushEntry(
            {
              type: "text",
              text: line,
              style: { fontSize: 10, fill: "#1F2937" }
            },
            estimateCanvasUnitsFromText(line, charsPerLine)
          )) {
            break;
          }
        }
        continue;
      }
      if (type === "table") {
        const remainingUnits = Math.max(2, maxUnits - usedUnits);
        const table = parseCanvasTable(block.content, {
          maxCols: Math.max(2, Math.min(6, Math.floor(width / 140))),
          maxRows: Math.max(1, remainingUnits - 1)
        });
        if (table && table.header.length > 0) {
          if (!pushEntry(
            {
              type: "table",
              header: table.header,
              rows: table.rows
            },
            1 + table.rows.length
          )) {
            break;
          }
          continue;
        }
        const fallback2 = stripInlineMarkdown(block.content || "");
        if (!pushEntry(
          {
            type: "text",
            text: fallback2,
            style: { fontSize: 9, fill: "#334155" }
          },
          estimateCanvasUnitsFromText(fallback2, charsPerLine)
        )) {
          break;
        }
        continue;
      }
      if (type === "divider") {
        if (!pushEntry(
          {
            type: "divider"
          },
          1
        )) {
          break;
        }
        continue;
      }
      if (type === "code" || type === "text" || type === "mermaid") {
        const language = typeof block.language === "string" && block.language ? block.language : type === "mermaid" ? "mermaid" : "txt";
        const content = String(block.content || "");
        const payload = `[${language}]
${content}`;
        if (!pushEntry(
          {
            type: "code",
            text: payload,
            style: { fontSize: 9, fill: "#0F172A" }
          },
          estimateCanvasUnitsFromText(payload, charsPerLine)
        )) {
          break;
        }
        continue;
      }
      const fallback = stripInlineMarkdown((block == null ? void 0 : block.content) || "");
      if (!pushEntry(
        {
          type: "text",
          text: fallback,
          style: { fontSize: 10, fill: "#1F2937" }
        },
        estimateCanvasUnitsFromText(fallback, charsPerLine)
      )) {
        break;
      }
    }
    if (usedUnits >= maxUnits && out.length > 0) {
      out.push({
        type: "text",
        text: "\u2026",
        style: { fontSize: 10, fill: "#64748B" }
      });
    }
    return out;
  }
  function renderCanvasPreviewEntry(entry, previewPanelWidth) {
    var _a, _b, _c, _d;
    if ((entry == null ? void 0 : entry.type) === "divider") {
      return h(AutoLayout, {
        width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
        height: CANVAS_LAYOUT.divider.thickness,
        fill: "#CBD5E1"
      });
    }
    if ((entry == null ? void 0 : entry.type) === "table" && Array.isArray(entry.header)) {
      const colCount = Math.max(1, entry.header.length);
      const tableWidth = previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal;
      const cellWidth = Math.max(56, Math.floor(tableWidth / colCount));
      const renderRow = (cells, isHeader) => h(
        AutoLayout,
        {
          direction: "horizontal",
          spacing: CANVAS_LAYOUT.table.rowSpacing,
          width: tableWidth,
          fill: isHeader ? "#F1F5F9" : "#FFFFFF"
        },
        ...cells.map(
          (cell) => h(
            AutoLayout,
            {
              width: cellWidth,
              padding: {
                vertical: CANVAS_LAYOUT.table.cellPaddingVertical,
                horizontal: CANVAS_LAYOUT.table.cellPaddingHorizontal
              },
              stroke: "#CBD5E1",
              strokeWidth: CANVAS_LAYOUT.table.borderWidth
            },
            h(
              Text,
              {
                fontSize: isHeader ? 9 : 8,
                fontWeight: isHeader ? 600 : 400,
                fill: "#0F172A",
                width: cellWidth - CANVAS_LAYOUT.table.cellPaddingHorizontal * 2
              },
              String(cell || "")
            )
          )
        )
      );
      const rows = Array.isArray(entry.rows) ? entry.rows : [];
      return h(
        AutoLayout,
        {
          direction: "vertical",
          spacing: CANVAS_LAYOUT.table.stackSpacing,
          width: tableWidth
        },
        renderRow(entry.header, true),
        ...rows.map((row) => {
          const normalized = Array.isArray(row) ? row : [];
          while (normalized.length < colCount) {
            normalized.push("");
          }
          return renderRow(normalized.slice(0, colCount), false);
        })
      );
    }
    if ((entry == null ? void 0 : entry.type) === "code") {
      const codeBlockWidth = previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal;
      return h(
        AutoLayout,
        {
          direction: "vertical",
          width: codeBlockWidth,
          padding: CANVAS_LAYOUT.code.padding,
          fill: "#F8FAFC",
          stroke: "#CBD5E1",
          strokeWidth: CANVAS_LAYOUT.code.borderWidth,
          cornerRadius: CANVAS_LAYOUT.code.cornerRadius
        },
        h(
          Text,
          {
            fontSize: 9,
            fill: ((_a = entry == null ? void 0 : entry.style) == null ? void 0 : _a.fill) || "#0F172A",
            width: codeBlockWidth - CANVAS_LAYOUT.code.padding * 2
          },
          String((entry == null ? void 0 : entry.text) || "")
        )
      );
    }
    return h(
      Text,
      {
        fontSize: ((_b = entry == null ? void 0 : entry.style) == null ? void 0 : _b.fontSize) || 10,
        fontWeight: ((_c = entry == null ? void 0 : entry.style) == null ? void 0 : _c.fontWeight) || 400,
        fill: ((_d = entry == null ? void 0 : entry.style) == null ? void 0 : _d.fill) || "#2F2F2F",
        width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal
      },
      String((entry == null ? void 0 : entry.text) || "")
    );
  }
  function postToUiSafely(payload) {
    try {
      figma.ui.postMessage(payload);
      return true;
    } catch (error) {
      const message = error && typeof error.message === "string" ? error.message : String(error);
      if (/No UI to send a message to/i.test(message)) {
        return false;
      }
      throw error;
    }
  }
  function deriveProgressPercent(syncStatus) {
    if (syncStatus === "success") return 100;
    if (syncStatus === "error") return 100;
    if (syncStatus === "syncing") return 25;
    return 0;
  }
  function resolveRuntimeError(pipelineError, auth) {
    const code = typeof (pipelineError == null ? void 0 : pipelineError.code) === "string" && pipelineError.code ? pipelineError.code : "UNKNOWN";
    const authMessage = AUTH_MESSAGES[code];
    const message = authMessage || typeof (pipelineError == null ? void 0 : pipelineError.message) === "string" && pipelineError.message || "Could not create preview from this URL.";
    const details = typeof (pipelineError == null ? void 0 : pipelineError.details) === "string" && pipelineError.details ? redactSensitive(pipelineError.details) : "";
    const sourceKey = typeof (auth == null ? void 0 : auth.sourceKey) === "string" && auth.sourceKey ? auth.sourceKey : null;
    return {
      code,
      message: redactSensitive(message),
      details,
      sourceKey,
      authRequired: Boolean(authMessage)
    };
  }
  function GitHubPreviewWidget() {
    var _a, _b;
    const [status, setStatus] = useSyncedState(
      "runtime-status",
      "Ready: open URL input"
    );
    const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
    const [embedBlock, setEmbedBlock] = useSyncedState("embed-block", null);
    const [embedSnapshot, setEmbedSnapshot] = useSyncedState("embed-snapshot", null);
    const [authContext, setAuthContext] = useSyncedState("auth-context", null);
    const [autoRefreshMap, setAutoRefreshMap] = useSyncedState(
      "auto-refresh-map",
      {}
    );
    const [canvasSize, setCanvasSize] = useSyncedState(
      "canvas-size",
      clampCanvasSize()
    );
    function postWidgetContextToUi() {
      var _a2;
      const previewSummary2 = buildUiPreviewTextFromBlock(embedBlock, {
        maxChars: 2e5
      });
      const previewPayload = buildUiPreviewPayload(embedBlock);
      const syncState = ((_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status) || "idle";
      postToUiSafely(__spreadValues({
        type: UI_EVENT.WIDGET_CONTEXT,
        widgetId: "active-widget",
        lastUrl,
        status,
        authContext,
        lastResult: buildLastResult(embedSnapshot, embedBlock),
        syncState,
        progressPercent: deriveProgressPercent(syncState),
        previewSummary: previewSummary2
      }, previewPayload));
    }
    function postRuntimeStatus(level, message, details = "", extras = {}) {
      const hasPreviewSummary = typeof (extras == null ? void 0 : extras.previewSummary) === "string";
      const hasPreviewBlocks = Array.isArray(extras == null ? void 0 : extras.previewBlocks);
      const hasPreviewKind = typeof (extras == null ? void 0 : extras.previewKind) === "string";
      const fallbackPreviewPayload = buildUiPreviewPayload(embedBlock);
      postToUiSafely(__spreadValues({
        type: UI_EVENT.RUNTIME_STATUS,
        level,
        message,
        details,
        previewSummary: hasPreviewSummary ? extras.previewSummary : buildUiPreviewTextFromBlock(embedBlock, {
          maxChars: 2e5
        }),
        previewKind: hasPreviewKind ? extras.previewKind : fallbackPreviewPayload.previewKind,
        previewBlocks: hasPreviewBlocks ? extras.previewBlocks : fallbackPreviewPayload.previewBlocks
      }, extras));
    }
    async function runPreviewPipeline(url, trigger, options = {}) {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      const mode = options.mode === SYNC_MODE.AUTO ? SYNC_MODE.AUTO : SYNC_MODE.MANUAL;
      const normalizedUrl = typeof url === "string" ? url.trim() : "";
      if (!normalizedUrl) {
        setStatus("Sync error: MISSING_URL");
        postRuntimeStatus("error", "A GitHub file URL is required.");
        return { ok: false, skipped: true };
      }
      const sourceKeyForRun = typeof options.sourceKey === "string" && options.sourceKey ? options.sourceKey : deriveSourceKey(normalizedUrl, embedBlock, embedSnapshot, authContext);
      let lockAcquired = false;
      const loadingMessage = mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...";
      let progressPercent = mode === SYNC_MODE.AUTO ? 12 : 8;
      let progressTimer = null;
      const pushProgress = () => postRuntimeStatus("loading", loadingMessage, "", {
        progressPercent
      });
      if (!options.skipManualLock) {
        const lock = syncCoordinator.beginManual({
          sourceKey: sourceKeyForRun,
          syncStatus: (_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status
        });
        if (!lock.ok) {
          setStatus("Syncing...");
          postRuntimeStatus("loading", "Syncing...", "", {
            reason: lock.reason,
            progressPercent: 25
          });
          return { ok: false, skipped: true, reason: lock.reason };
        }
        lockAcquired = true;
      }
      try {
        setStatus(loadingMessage);
        pushProgress();
        progressTimer = setInterval(() => {
          if (progressPercent < 45) {
            progressPercent += 7;
          } else if (progressPercent < 70) {
            progressPercent += 4;
          } else if (progressPercent < 92) {
            progressPercent += 2;
          }
          progressPercent = Math.min(92, progressPercent);
          pushProgress();
        }, 320);
        if (mode === SYNC_MODE.MANUAL) {
          figma.notify("Syncing...");
        }
        const patStore = await getRuntimePatStore();
        const pipeline = await createOrRefreshEmbedFromUrl({
          url: normalizedUrl,
          currentEmbedBlock: embedBlock,
          currentSnapshot: embedSnapshot,
          patStore,
          mode
        });
        if (!pipeline.ok) {
          if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
          }
          if ((_b2 = pipeline.value) == null ? void 0 : _b2.embedBlock) {
            setEmbedBlock(pipeline.value.embedBlock);
          }
          if ((_c = pipeline.value) == null ? void 0 : _c.snapshot) {
            setEmbedSnapshot(pipeline.value.snapshot);
          }
          const runtimeError = resolveRuntimeError(pipeline.error, pipeline.auth);
          const nextAuthContext = runtimeError.authRequired && runtimeError.sourceKey ? {
            sourceKey: runtimeError.sourceKey,
            code: runtimeError.code,
            url: normalizedUrl
          } : null;
          setAuthContext(nextAuthContext);
          const lastResult3 = buildLastResult(
            (_d = pipeline.value) == null ? void 0 : _d.snapshot,
            (_e = pipeline.value) == null ? void 0 : _e.embedBlock
          );
          setStatus(`Sync error: ${runtimeError.code}`);
          postRuntimeStatus("error", runtimeError.message, runtimeError.details, __spreadValues({
            code: runtimeError.code,
            sourceKey: runtimeError.sourceKey,
            authRequired: runtimeError.authRequired,
            syncState: ((_h = (_g = (_f = pipeline.value) == null ? void 0 : _f.embedBlock) == null ? void 0 : _g.sync) == null ? void 0 : _h.status) || "error",
            lastResult: lastResult3,
            progressPercent: 100,
            previewSummary: buildUiPreviewTextFromBlock((_i = pipeline.value) == null ? void 0 : _i.embedBlock, {
              maxChars: 2e5
            })
          }, buildUiPreviewPayload((_j = pipeline.value) == null ? void 0 : _j.embedBlock)));
          if (mode === SYNC_MODE.MANUAL) {
            figma.notify(runtimeError.message, { error: true });
          }
          return pipeline;
        }
        setLastUrl(normalizedUrl);
        setEmbedBlock(pipeline.value.embedBlock);
        setEmbedSnapshot(pipeline.value.snapshot);
        setAuthContext(null);
        const lastResult2 = buildLastResult(pipeline.value.snapshot, pipeline.value.embedBlock);
        const successMessage = mode === SYNC_MODE.AUTO ? "Auto-sync completed." : "Preview created.";
        setStatus(mode === SYNC_MODE.AUTO ? `Auto-sync ready (${trigger})` : `Preview ready (${trigger})`);
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        postRuntimeStatus("success", successMessage, "", __spreadValues({
          syncState: ((_l = (_k = pipeline.value.embedBlock) == null ? void 0 : _k.sync) == null ? void 0 : _l.status) || "success",
          lastResult: lastResult2,
          progressPercent: 100,
          previewSummary: buildUiPreviewTextFromBlock((_m = pipeline.value) == null ? void 0 : _m.embedBlock, {
            maxChars: 2e5
          })
        }, buildUiPreviewPayload((_n = pipeline.value) == null ? void 0 : _n.embedBlock)));
        if (mode === SYNC_MODE.MANUAL) {
          figma.notify("Preview created.");
        }
        return pipeline;
      } catch (error) {
        const details = error && typeof error.message === "string" ? error.message : String(error);
        const message = "Unexpected pipeline failure.";
        setStatus("Sync error: UNEXPECTED");
        postRuntimeStatus("error", message, details, __spreadValues({
          code: "UNEXPECTED",
          syncState: "error",
          progressPercent: 100,
          lastResult: {
            status: "error",
            mode,
            message,
            details,
            at: (/* @__PURE__ */ new Date()).toISOString()
          },
          previewSummary: buildUiPreviewTextFromBlock(embedBlock, {
            maxChars: 2e5
          })
        }, buildUiPreviewPayload(embedBlock)));
        if (mode === SYNC_MODE.MANUAL) {
          figma.notify(message, { error: true });
        }
        return { ok: false, skipped: true, error: { code: "UNEXPECTED", details } };
      } finally {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        if (lockAcquired) {
          syncCoordinator.endManual(sourceKeyForRun);
        }
      }
    }
    function maybeRunAutoRefresh(origin) {
      var _a2;
      if (typeof lastUrl !== "string" || !lastUrl.trim()) {
        return false;
      }
      const sourceKey = deriveSourceKey(lastUrl, embedBlock, embedSnapshot, authContext);
      const lastAutoRefreshAtMs = Number((autoRefreshMap == null ? void 0 : autoRefreshMap[sourceKey]) || 0);
      const decision = shouldRunAutoRefresh(
        {
          sourceKey,
          sourceUrl: lastUrl,
          syncStatus: (_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status,
          lastAutoRefreshAtMs,
          nowMs: Date.now()
        },
        {
          cooldownMs: syncCoordinator.cooldownMs
        }
      );
      if (!decision.ok) {
        return false;
      }
      setAutoRefreshMap(__spreadProps(__spreadValues({}, autoRefreshMap || {}), {
        [sourceKey]: decision.nowMs
      }));
      void runPreviewPipeline(lastUrl, `auto-${origin}`, {
        mode: SYNC_MODE.AUTO,
        skipManualLock: true,
        sourceKey
      });
      return true;
    }
    usePropertyMenu(
      [
        {
          itemType: "action",
          tooltip: "Set GitHub URL",
          propertyName: PROPERTY_ACTION.OPEN_URL
        },
        {
          itemType: "action",
          tooltip: "Refresh preview",
          propertyName: PROPERTY_ACTION.REFRESH_NOW
        },
        {
          itemType: "action",
          tooltip: "Width -",
          propertyName: PROPERTY_ACTION.WIDTH_DEC
        },
        {
          itemType: "action",
          tooltip: "Width +",
          propertyName: PROPERTY_ACTION.WIDTH_INC
        },
        {
          itemType: "action",
          tooltip: "Height -",
          propertyName: PROPERTY_ACTION.HEIGHT_DEC
        },
        {
          itemType: "action",
          tooltip: "Height +",
          propertyName: PROPERTY_ACTION.HEIGHT_INC
        }
      ],
      async (event) => {
        const propertyName = typeof (event == null ? void 0 : event.propertyName) === "string" ? event.propertyName : "";
        if (propertyName === PROPERTY_ACTION.OPEN_URL || propertyName === "open-url") {
          ensureUiSessionTask();
          await (async () => {
            try {
              openWidgetUi();
            } catch (error) {
              const detail = error && typeof error.message === "string" ? error.message : String(error);
              setStatus("Could not open URL input");
              figma.notify(`Could not open URL input: ${detail}`, { error: true });
              return;
            }
            await Promise.resolve();
            postWidgetContextToUi();
            figma.notify("URL input opened.");
            void maybeRunAutoRefresh("open-url");
          })();
          return uiSessionPromise || Promise.resolve();
        }
        if (propertyName === PROPERTY_ACTION.REFRESH_NOW || propertyName === "refresh-now") {
          if (!lastUrl) {
            setStatus("Refresh blocked: no URL set");
            postRuntimeStatus("error", "No URL available for refresh.");
            figma.notify("No URL available for refresh.", { error: true });
            return;
          }
          await runPreviewPipeline(lastUrl, "property-menu-refresh", {
            mode: SYNC_MODE.MANUAL
          });
          return;
        }
        if (propertyName === PROPERTY_ACTION.WIDTH_DEC || propertyName === PROPERTY_ACTION.WIDTH_INC || propertyName === PROPERTY_ACTION.HEIGHT_DEC || propertyName === PROPERTY_ACTION.HEIGHT_INC) {
          const baseSize = canvasSize && typeof canvasSize === "object" ? clampCanvasSize(canvasSize) : clampCanvasSize();
          const widthDelta = propertyName === PROPERTY_ACTION.WIDTH_INC ? CANVAS_SIZE_LIMITS.widthStep : propertyName === PROPERTY_ACTION.WIDTH_DEC ? -CANVAS_SIZE_LIMITS.widthStep : 0;
          const heightDelta = propertyName === PROPERTY_ACTION.HEIGHT_INC ? CANVAS_SIZE_LIMITS.heightStep : propertyName === PROPERTY_ACTION.HEIGHT_DEC ? -CANVAS_SIZE_LIMITS.heightStep : 0;
          const nextSize = clampCanvasSize({
            width: baseSize.width + widthDelta,
            height: baseSize.height + heightDelta
          });
          setCanvasSize(nextSize);
          setStatus(`Canvas resized: ${nextSize.width} \xD7 ${nextSize.height}`);
          return;
        }
      }
    );
    useEffect(() => {
      figma.ui.onmessage = (message) => {
        if (message && message.type === "ui-closed") {
          endUiSessionTask();
          setStatus("UI closed");
          return;
        }
        if (message && message.type === "ui-ready") {
          lastUiReadyNonce = lastUiOpenNonce;
          setStatus("UI ready");
          postWidgetContextToUi();
          figma.notify("UI initialized.");
          return;
        }
        const parsed = parseUiCommand(message);
        if (!parsed.ok) {
          setStatus(`Bridge error: ${parsed.error.code}`);
          postRuntimeStatus("error", parsed.error.message);
          figma.notify(parsed.error.message, { error: true });
          return;
        }
        const command = parsed.value;
        if (command.type === UI_COMMAND.CREATE_PREVIEW) {
          void runPreviewPipeline(command.url, "create", {
            mode: SYNC_MODE.MANUAL
          });
          return;
        }
        if (command.type === UI_COMMAND.REFRESH_PREVIEW) {
          const refreshUrl = lastUrl;
          if (!refreshUrl) {
            setStatus("Refresh blocked: no URL set");
            postRuntimeStatus("error", "No URL available for refresh.");
            figma.notify("No URL available for refresh.", { error: true });
            return;
          }
          void runPreviewPipeline(refreshUrl, "refresh", {
            mode: SYNC_MODE.MANUAL
          });
          return;
        }
        if (command.type === UI_COMMAND.SUBMIT_PAT) {
          void (async () => {
            const patStore = await getRuntimePatStore();
            patStore.set(command.sourceKey, command.token);
            await patStore.flush();
            const retryUrl = (authContext && typeof authContext === "object" && authContext.sourceKey === command.sourceKey && typeof authContext.url === "string" ? authContext.url : "") || lastUrl;
            if (!retryUrl) {
              setStatus("PAT saved, waiting for URL");
              postRuntimeStatus("success", "PAT guardado para este fichero.", "", {
                sourceKey: command.sourceKey
              });
              figma.notify("PAT guardado para este fichero.");
              return;
            }
            setStatus("PAT actualizado. Reintentando...");
            postRuntimeStatus("loading", "Reintentando con PAT actualizado...", "", {
              sourceKey: command.sourceKey
            });
            figma.notify("Reintentando con PAT actualizado...");
            await runPreviewPipeline(retryUrl, "pat-retry", {
              mode: SYNC_MODE.MANUAL,
              sourceKey: command.sourceKey
            });
          })();
          return;
        }
        if (command.type === UI_COMMAND.FORGET_PAT) {
          void (async () => {
            const patStore = await getRuntimePatStore();
            patStore.remove(command.sourceKey);
            await patStore.flush();
            if (authContext && typeof authContext === "object" && authContext.sourceKey === command.sourceKey) {
              setAuthContext(null);
            }
            setStatus("PAT olvidado para este fichero");
            postRuntimeStatus("success", "PAT olvidado para este fichero.", "", {
              sourceKey: command.sourceKey
            });
            figma.notify("PAT olvidado para este fichero.");
          })();
        }
      };
      if (!autoRefreshBootstrapped && lastUrl) {
        autoRefreshBootstrapped = true;
        void maybeRunAutoRefresh("resume");
      }
      return () => {
        figma.ui.onmessage = void 0;
      };
    });
    const effectiveCanvasSize = canvasSize && typeof canvasSize === "object" ? clampCanvasSize(canvasSize) : clampCanvasSize();
    const previewSummary = buildUiPreviewTextFromBlock(embedBlock, {
      maxChars: 2e5
    });
    const previewPanelWidth = Math.max(
      200,
      effectiveCanvasSize.width - CANVAS_LAYOUT.root.padding * 2
    );
    const previewViewportHeight = Math.max(180, effectiveCanvasSize.height - 220);
    const canvasPreviewText = fitPreviewTextForCanvas(previewSummary, {
      width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
      height: previewViewportHeight
    });
    const canvasPreviewEntries = buildCanvasPreviewEntries((_a = embedBlock == null ? void 0 : embedBlock.preview) == null ? void 0 : _a.blocks, {
      width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
      height: previewViewportHeight
    });
    const lastResult = buildLastResult(embedSnapshot, embedBlock);
    const previewChildren = canvasPreviewEntries.length > 0 ? [
      h(
        AutoLayout,
        {
          direction: "vertical",
          spacing: CANVAS_LAYOUT.previewPanel.spacing,
          width: previewPanelWidth,
          height: previewViewportHeight,
          fill: "#FAFAFA",
          stroke: "#E6E6E6",
          cornerRadius: CANVAS_LAYOUT.previewPanel.cornerRadius,
          padding: CANVAS_LAYOUT.previewPanel.padding
        },
        ...canvasPreviewEntries.map(
          (entry) => renderCanvasPreviewEntry(entry, previewPanelWidth)
        )
      )
    ] : [
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        canvasPreviewText.trim().length > 0 ? canvasPreviewText : "Preview: pending"
      )
    ];
    const children = [
      h(Text, { fontSize: 12, fontWeight: 600 }, "GitHub Preview Widget"),
      h(Text, { fontSize: 11, fill: "#5C5C5C" }, status),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        lastUrl ? `Last URL: ${lastUrl}` : "No URL captured yet"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        embedBlock ? `Embed: ${embedBlock.sections.header.ownerRepo} \xB7 ${embedBlock.sections.header.path}` : "Embed: pending"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        embedBlock ? `Sync: ${embedBlock.sections.header.statusBadge.label} \xB7 ${embedBlock.sections.header.lastSync}` : "Sync: idle"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        embedSnapshot ? `Warnings: ${embedSnapshot.warningCount || 0} \xB7 Progressive: ${((_b = embedSnapshot.render) == null ? void 0 : _b.progressive) ? "yes" : "no"}` : "Warnings: 0 \xB7 Progressive: no"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        `Last result: ${lastResult.status || "idle"} (${lastResult.mode || "manual"})`
      ),
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        `Canvas: ${effectiveCanvasSize.width} \xD7 ${effectiveCanvasSize.height}`
      ),
      h(Text, { fontSize: 10, fontWeight: 600, fill: "#1F1F1F" }, "Preview"),
      ...previewChildren
    ];
    return h(
      AutoLayout,
      {
        direction: "vertical",
        width: effectiveCanvasSize.width,
        height: effectiveCanvasSize.height,
        spacing: CANVAS_LAYOUT.root.spacing,
        padding: CANVAS_LAYOUT.root.padding,
        fill: "#FFFFFF",
        stroke: "#D9D9D9",
        cornerRadius: CANVAS_LAYOUT.root.cornerRadius
      },
      ...children
    );
  }
  widget.register(GitHubPreviewWidget);
})();
