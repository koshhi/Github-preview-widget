const __widget_ui_html__ = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>GitHub Preview Widget</title>\n    <style>\n      :root {\n        color-scheme: light dark;\n        --gh-fg-default: #1f2328;\n        --gh-fg-muted: #59636e;\n        --gh-fg-subtle: #656d76;\n        --gh-bg-canvas: #ffffff;\n        --gh-bg-subtle: #f6f8fa;\n        --gh-bg-code-inline: rgba(175, 184, 193, 0.2);\n        --gh-border-default: #d0d7de;\n        --gh-border-muted: #d8dee4;\n        --gh-accent-fg: #0969da;\n        --gh-danger-fg: #cf222e;\n      }\n\n      @media (prefers-color-scheme: dark) {\n        :root {\n          --gh-fg-default: #e6edf3;\n          --gh-fg-muted: #9da7b3;\n          --gh-fg-subtle: #7d8590;\n          --gh-bg-canvas: #0d1117;\n          --gh-bg-subtle: #151b23;\n          --gh-bg-code-inline: rgba(110, 118, 129, 0.4);\n          --gh-border-default: #30363d;\n          --gh-border-muted: #21262d;\n          --gh-accent-fg: #2f81f7;\n          --gh-danger-fg: #ff7b72;\n        }\n      }\n\n      body {\n        margin: 0;\n        font-family:\n          -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif;\n        background: var(--gh-bg-subtle);\n        color: var(--gh-fg-default);\n      }\n\n      .root {\n        padding: 14px;\n        display: grid;\n        gap: 10px;\n      }\n\n      .label {\n        font-size: 12px;\n        font-weight: 600;\n      }\n\n      input {\n        width: 100%;\n        box-sizing: border-box;\n        padding: 10px;\n        border-radius: 8px;\n        border: 1px solid var(--gh-border-default);\n        background: var(--gh-bg-canvas);\n        color: var(--gh-fg-default);\n        font-size: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 8px;\n        background: #1f2328;\n        color: #ffffff;\n        font-size: 12px;\n        font-weight: 600;\n        padding: 10px;\n        cursor: pointer;\n      }\n\n      .secondary {\n        background: var(--gh-bg-canvas);\n        color: var(--gh-fg-default);\n        border: 1px solid var(--gh-border-default);\n      }\n\n      .danger {\n        background: rgba(207, 34, 46, 0.12);\n        color: var(--gh-danger-fg);\n        border: 1px solid rgba(207, 34, 46, 0.38);\n      }\n\n      .status {\n        font-size: 11px;\n        color: var(--gh-fg-default);\n      }\n\n      .status.error {\n        color: var(--gh-danger-fg);\n      }\n\n      .status.loading {\n        color: var(--gh-accent-fg);\n      }\n\n      .status.success {\n        color: #1a7f37;\n      }\n\n      .details {\n        font-size: 10px;\n        color: var(--gh-fg-subtle);\n        word-break: break-word;\n        display: none;\n      }\n\n      .details[data-open=\"true\"] {\n        display: block;\n      }\n\n      .actions {\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 8px;\n      }\n\n      .auth-panel {\n        display: none;\n        border: 1px solid rgba(207, 34, 46, 0.5);\n        border-radius: 8px;\n        background: rgba(207, 34, 46, 0.08);\n        padding: 10px;\n        gap: 8px;\n      }\n\n      .auth-panel[data-open=\"true\"] {\n        display: grid;\n      }\n\n      .auth-title {\n        font-size: 11px;\n        font-weight: 700;\n        color: var(--gh-danger-fg);\n      }\n\n      .auth-copy {\n        font-size: 11px;\n        color: var(--gh-danger-fg);\n      }\n\n      .auth-meta {\n        font-size: 10px;\n        color: var(--gh-fg-subtle);\n        word-break: break-word;\n      }\n\n      .link-button {\n        border: 0;\n        background: transparent;\n        padding: 0;\n        font-size: 11px;\n        text-decoration: underline;\n        color: var(--gh-accent-fg);\n        cursor: pointer;\n        text-align: left;\n      }\n\n      .result-meta {\n        font-size: 10px;\n        color: var(--gh-fg-subtle);\n      }\n\n      .progress-line {\n        font-size: 10px;\n        color: var(--gh-fg-subtle);\n      }\n\n      .progress-track {\n        width: 100%;\n        height: 6px;\n        border-radius: 999px;\n        background: var(--gh-border-muted);\n        overflow: hidden;\n      }\n\n      .progress-fill {\n        height: 100%;\n        width: 0%;\n        background: var(--gh-accent-fg);\n        transition: width 160ms linear;\n      }\n\n      .preview-panel {\n        display: grid;\n        gap: 6px;\n      }\n\n      .preview-text {\n        margin: 0;\n        padding: 16px;\n        border: 1px solid var(--gh-border-default);\n        border-radius: 6px;\n        background: var(--gh-bg-canvas);\n        color: var(--gh-fg-default);\n        max-height: 360px;\n        min-height: 180px;\n        overflow: auto;\n        resize: vertical;\n      }\n\n      .preview-empty {\n        color: var(--gh-fg-subtle);\n        white-space: pre-wrap;\n        margin: 0;\n      }\n\n      .markdown-body {\n        font-size: 16px;\n        line-height: 1.5;\n        word-wrap: break-word;\n      }\n\n      .markdown-body h1,\n      .markdown-body h2,\n      .markdown-body h3,\n      .markdown-body h4,\n      .markdown-body h5,\n      .markdown-body h6 {\n        margin-top: 24px;\n        margin-bottom: 16px;\n        font-weight: 600;\n        line-height: 1.25;\n      }\n\n      .markdown-body h1,\n      .markdown-body h2 {\n        padding-bottom: 0.3em;\n        border-bottom: 1px solid var(--gh-border-muted);\n      }\n\n      .markdown-body h1 {\n        font-size: 2em;\n      }\n\n      .markdown-body h2 {\n        font-size: 1.5em;\n      }\n\n      .markdown-body h3 {\n        font-size: 1.25em;\n      }\n\n      .markdown-body h4 {\n        font-size: 1em;\n      }\n\n      .markdown-body h5 {\n        font-size: 0.875em;\n      }\n\n      .markdown-body h6 {\n        font-size: 0.85em;\n        color: var(--gh-fg-muted);\n      }\n\n      .markdown-body p,\n      .markdown-body ul,\n      .markdown-body ol,\n      .markdown-body blockquote,\n      .markdown-body pre,\n      .markdown-body table,\n      .markdown-body details {\n        margin-top: 0;\n        margin-bottom: 16px;\n      }\n\n      .markdown-body ul,\n      .markdown-body ol {\n        padding-left: 2em;\n      }\n\n      .markdown-body li {\n        margin-top: 0.25em;\n      }\n\n      .markdown-body hr {\n        height: 0.25em;\n        padding: 0;\n        margin: 24px 0;\n        background-color: var(--gh-border-muted);\n        border: 0;\n      }\n\n      .markdown-body a {\n        color: var(--gh-accent-fg);\n        text-decoration: none;\n      }\n\n      .markdown-body a:hover {\n        text-decoration: underline;\n      }\n\n      .markdown-body blockquote {\n        padding: 0 1em;\n        color: var(--gh-fg-muted);\n        border-left: 0.25em solid var(--gh-border-default);\n      }\n\n      .markdown-body code {\n        padding: 0.2em 0.4em;\n        margin: 0;\n        font-size: 85%;\n        white-space: break-spaces;\n        background-color: var(--gh-bg-code-inline);\n        border-radius: 6px;\n        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n      }\n\n      .markdown-body pre {\n        padding: 16px;\n        overflow: auto;\n        font-size: 85%;\n        line-height: 1.45;\n        border-radius: 6px;\n        border: 1px solid var(--gh-border-default);\n        background: var(--gh-bg-subtle);\n      }\n\n      .markdown-body pre code {\n        padding: 0;\n        border-radius: 0;\n        background: transparent;\n        white-space: pre;\n      }\n\n      .preview-md-heading {\n        margin-top: 24px;\n        margin-bottom: 16px;\n      }\n\n      .preview-md-paragraph {\n        margin: 0 0 16px 0;\n        white-space: pre-line;\n      }\n\n      .preview-md-list {\n        margin: 0 0 16px 0;\n      }\n\n      .preview-md-blockquote {\n        margin: 0 0 16px 0;\n      }\n\n      .preview-md-task-item {\n        list-style: none;\n        margin-left: -24px;\n        display: flex;\n        gap: 8px;\n        align-items: flex-start;\n      }\n\n      .preview-md-task-box {\n        width: 16px;\n        height: 16px;\n        margin-top: 2px;\n        accent-color: var(--gh-accent-fg);\n      }\n\n      .preview-md-task-label {\n        display: block;\n        flex: 1;\n      }\n\n      .preview-md-code {\n        margin: 0 0 16px 0;\n      }\n\n      .preview-inline-code {\n        font-size: 85%;\n      }\n\n      .preview-md-link {\n        color: var(--gh-accent-fg);\n      }\n\n      .preview-md-table-wrap {\n        margin: 0 0 16px 0;\n        overflow-x: auto;\n      }\n\n      .preview-md-table {\n        width: 100%;\n        border-collapse: collapse;\n      }\n\n      .preview-md-table th,\n      .preview-md-table td {\n        border: 1px solid var(--gh-border-default);\n        padding: 6px 13px;\n        text-align: left;\n        vertical-align: top;\n      }\n\n      .preview-md-table th {\n        background: var(--gh-bg-subtle);\n        font-weight: 700;\n      }\n\n      .preview-md-divider {\n        margin: 24px 0;\n      }\n    </style>\n  </head>\n  <body>\n    <form class=\"root\" id=\"url-form\">\n      <label class=\"label\" for=\"url-input\">GitHub file URL</label>\n      <input id=\"url-input\" placeholder=\"https://github.com/org/repo/blob/main/README.md\" required />\n      <div class=\"actions\">\n        <button type=\"submit\">Create preview</button>\n        <button class=\"secondary\" id=\"refresh-button\" type=\"button\">Refresh preview</button>\n      </div>\n      <div class=\"status\" id=\"status-line\">Ready</div>\n      <div class=\"result-meta\" id=\"result-line\">State: idle</div>\n      <div class=\"progress-line\" id=\"progress-line\">Sync progress: 0%</div>\n      <div class=\"progress-track\"><div class=\"progress-fill\" id=\"progress-fill\"></div></div>\n      <div class=\"preview-panel\">\n        <div class=\"label\">Preview</div>\n        <div class=\"preview-text markdown-body\" id=\"preview-text\"></div>\n      </div>\n      <button class=\"link-button\" id=\"toggle-details-button\" type=\"button\">Show details</button>\n      <div class=\"details\" id=\"details-line\" data-open=\"false\"></div>\n      <div class=\"auth-panel\" id=\"auth-panel\" data-open=\"false\">\n        <div class=\"auth-title\">Private file requires PAT</div>\n        <div class=\"auth-copy\" id=\"auth-copy\"></div>\n        <div class=\"auth-meta\" id=\"auth-meta\"></div>\n        <label class=\"label\" for=\"pat-input\">Personal access token</label>\n        <input id=\"pat-input\" type=\"password\" placeholder=\"ghp_xxx or github_pat_xxx\" />\n        <div class=\"actions\">\n          <button class=\"secondary\" id=\"save-pat-button\" type=\"button\">Guardar PAT y reintentar</button>\n          <button class=\"danger\" id=\"forget-pat-button\" type=\"button\">Olvidar PAT fichero</button>\n        </div>\n      </div>\n    </form>\n\n    <script>\n      parent.postMessage(\n        {\n          pluginMessage: {\n            type: \"ui-ready\",\n          },\n        },\n        \"*\"\n      );\n\n      window.addEventListener(\"beforeunload\", () => {\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"ui-closed\",\n            },\n          },\n          \"*\"\n        );\n      });\n\n      const form = document.getElementById(\"url-form\");\n      const input = document.getElementById(\"url-input\");\n      const patInput = document.getElementById(\"pat-input\");\n      const submitButton = form.querySelector(\"button[type='submit']\");\n      const refreshButton = document.getElementById(\"refresh-button\");\n      const savePatButton = document.getElementById(\"save-pat-button\");\n      const forgetPatButton = document.getElementById(\"forget-pat-button\");\n      const statusLine = document.getElementById(\"status-line\");\n      const resultLine = document.getElementById(\"result-line\");\n      const toggleDetailsButton = document.getElementById(\"toggle-details-button\");\n      const detailsLine = document.getElementById(\"details-line\");\n      const authPanel = document.getElementById(\"auth-panel\");\n      const authCopy = document.getElementById(\"auth-copy\");\n      const authMeta = document.getElementById(\"auth-meta\");\n      const previewText = document.getElementById(\"preview-text\");\n      const progressLine = document.getElementById(\"progress-line\");\n      const progressFill = document.getElementById(\"progress-fill\");\n      let activeWidgetId = \"active-widget\";\n      let activeAuthContext = null;\n      let detailsOpen = false;\n      let syncProgress = 0;\n\n      const AUTH_MESSAGES = {\n        MISSING_PAT:\n          \"El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.\",\n        EXPIRED_PAT: \"Tu personal access token es invalido o ha expirado.\",\n        CURRENT_PAT: \"Tu personal access token no tiene permisos/scope suficiente.\",\n      };\n\n      function updateDetailsVisibility() {\n        detailsLine.dataset.open = detailsOpen ? \"true\" : \"false\";\n        toggleDetailsButton.textContent = detailsOpen ? \"Hide details\" : \"Show details\";\n      }\n\n      function setStatus(level, message, details = \"\") {\n        statusLine.textContent = message || \"Ready\";\n        statusLine.className = `status ${level || \"\"}`.trim();\n        detailsLine.textContent = details || \"\";\n        if (!details) {\n          detailsOpen = false;\n        }\n        updateDetailsVisibility();\n\n        const isLoading = level === \"loading\";\n        submitButton.disabled = isLoading;\n        refreshButton.disabled = isLoading;\n      }\n\n      function setLastResult(lastResult, syncState) {\n        const safe = lastResult && typeof lastResult === \"object\" ? lastResult : {};\n        const status = safe.status || syncState || \"idle\";\n        const mode = safe.mode || \"manual\";\n        const message = safe.message ? ` · ${safe.message}` : \"\";\n        resultLine.textContent = `State: ${status} (${mode})${message}`;\n      }\n\n      function setSyncProgress(rawPercent) {\n        const percent = Number.isFinite(Number(rawPercent))\n          ? Math.max(0, Math.min(100, Math.round(Number(rawPercent))))\n          : 0;\n        syncProgress = percent;\n        progressLine.textContent = `Sync progress: ${percent}%`;\n        progressFill.style.width = `${percent}%`;\n      }\n\n      function clearNodeChildren(node) {\n        while (node.firstChild) {\n          node.removeChild(node.firstChild);\n        }\n      }\n\n      function appendPreviewNode(tagName, className, text) {\n        const node = document.createElement(tagName);\n        if (className) node.className = className;\n        node.textContent = typeof text === \"string\" ? text : \"\";\n        return node;\n      }\n\n      function escapeHtml(value) {\n        return String(value || \"\")\n          .replace(/&/g, \"&amp;\")\n          .replace(/</g, \"&lt;\")\n          .replace(/>/g, \"&gt;\")\n          .replace(/\"/g, \"&quot;\")\n          .replace(/'/g, \"&#39;\");\n      }\n\n      function renderInlineLink(label, href) {\n        const safeLabel = String(label || \"\");\n        const safeHref = String(href || \"\").replace(/&amp;/g, \"&\");\n        const isExternal =\n          /^(https?:)?\\/\\//i.test(safeHref) || /^mailto:/i.test(safeHref);\n        const attrs = isExternal ? ' target=\"_blank\" rel=\"noreferrer\"' : \"\";\n        return `<a class=\"preview-md-link\" href=\"${safeHref}\"${attrs}>${safeLabel}</a>`;\n      }\n\n      function formatInlineMarkdownToHtml(value) {\n        let html = escapeHtml(value);\n        html = html.replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)(?:\\s+&quot;[^&]+&quot;)?\\)/g, (_m, label, href) =>\n          renderInlineLink(label, href)\n        );\n        html = html.replace(\n          /&lt;((?:https?:\\/\\/|mailto:)[^&<>]+)&gt;/g,\n          (_m, href) => renderInlineLink(href, href)\n        );\n        html = html.replace(\n          /(^|[\\s(>])((https?:\\/\\/[^\\s<)]+))/g,\n          (_m, prefix, href) => `${prefix}${renderInlineLink(href, href)}`\n        );\n        html = html.replace(/`([^`]+)`/g, '<code class=\"preview-inline-code\">$1</code>');\n        html = html.replace(/\\*\\*([^*]+)\\*\\*/g, \"<strong>$1</strong>\");\n        html = html.replace(/__([^_]+)__/g, \"<strong>$1</strong>\");\n        html = html.replace(/~~([^~]+)~~/g, \"<del>$1</del>\");\n        html = html.replace(/(^|[^\\*])\\*([^*\\n]+)\\*/g, \"$1<em>$2</em>\");\n        html = html.replace(/(^|[^_])_([^_\\n]+)_/g, \"$1<em>$2</em>\");\n        html = html.replace(/\\n/g, \"<br/>\");\n        return html;\n      }\n\n      function appendMarkdownNode(tagName, className, text) {\n        const node = document.createElement(tagName);\n        if (className) node.className = className;\n        node.innerHTML = formatInlineMarkdownToHtml(text);\n        return node;\n      }\n\n      function parseMarkdownTableRow(line) {\n        const normalized = String(line || \"\").trim().replace(/^\\|/, \"\").replace(/\\|$/, \"\");\n        return normalized.split(\"|\").map((cell) => cell.trim());\n      }\n\n      function buildTableNode(content) {\n        const rawLines = String(content || \"\")\n          .split(/\\r?\\n/)\n          .map((line) => line.trim())\n          .filter(Boolean);\n        if (rawLines.length < 2) {\n          return appendPreviewNode(\"pre\", \"preview-md-code\", String(content || \"\"));\n        }\n\n        const header = parseMarkdownTableRow(rawLines[0]);\n        const rows = rawLines.slice(2).map(parseMarkdownTableRow);\n        const colCount = Math.max(1, header.length);\n\n        const wrapper = document.createElement(\"div\");\n        wrapper.className = \"preview-md-table-wrap\";\n        const table = document.createElement(\"table\");\n        table.className = \"preview-md-table\";\n        const thead = document.createElement(\"thead\");\n        const headRow = document.createElement(\"tr\");\n        for (let i = 0; i < colCount; i += 1) {\n          const th = document.createElement(\"th\");\n          th.innerHTML = formatInlineMarkdownToHtml(header[i] || \"\");\n          headRow.appendChild(th);\n        }\n        thead.appendChild(headRow);\n        table.appendChild(thead);\n\n        const tbody = document.createElement(\"tbody\");\n        for (const rowCells of rows) {\n          const tr = document.createElement(\"tr\");\n          for (let i = 0; i < colCount; i += 1) {\n            const td = document.createElement(\"td\");\n            td.innerHTML = formatInlineMarkdownToHtml(rowCells[i] || \"\");\n            tr.appendChild(td);\n          }\n          tbody.appendChild(tr);\n        }\n        table.appendChild(tbody);\n        wrapper.appendChild(table);\n        return wrapper;\n      }\n\n      function normalizeListItem(item) {\n        if (item && typeof item === \"object\") {\n          return {\n            content: String(item.content || \"\"),\n            depth: Math.max(1, Number(item.depth || 1)),\n            task:\n              item.task && typeof item.task === \"object\"\n                ? { checked: Boolean(item.task.checked) }\n                : null,\n          };\n        }\n        return {\n          content: String(item || \"\"),\n          depth: 1,\n          task: null,\n        };\n      }\n\n      function buildListItemNode(item) {\n        if (!item.task) {\n          return appendMarkdownNode(\"li\", \"\", item.content);\n        }\n\n        const li = document.createElement(\"li\");\n        li.className = \"preview-md-task-item\";\n\n        const box = document.createElement(\"input\");\n        box.className = \"preview-md-task-box\";\n        box.type = \"checkbox\";\n        box.checked = Boolean(item.task.checked);\n        box.disabled = true;\n        li.appendChild(box);\n\n        const label = document.createElement(\"span\");\n        label.className = \"preview-md-task-label\";\n        label.innerHTML = formatInlineMarkdownToHtml(item.content);\n        li.appendChild(label);\n\n        return li;\n      }\n\n      function buildNestedListNode(items, ordered, start) {\n        const listTag = ordered ? \"ol\" : \"ul\";\n        const root = document.createElement(listTag);\n        root.className = \"preview-md-list\";\n        if (ordered) {\n          const safeStart =\n            Number.isFinite(Number(start)) && Number(start) > 0 ? Number(start) : 1;\n          if (safeStart > 1) {\n            root.start = safeStart;\n          }\n        }\n        const stack = [{ depth: 1, list: root }];\n\n        for (const rawItem of items) {\n          const current = normalizeListItem(rawItem);\n          let targetDepth = Math.max(1, current.depth);\n\n          while (stack.length > targetDepth) {\n            stack.pop();\n          }\n\n          while (stack.length < targetDepth) {\n            const parent = stack[stack.length - 1].list;\n            let parentLi = parent.lastElementChild;\n            if (!parentLi) {\n              parentLi = document.createElement(\"li\");\n              parent.appendChild(parentLi);\n            }\n\n            const nested = document.createElement(listTag);\n            nested.className = \"preview-md-list\";\n            parentLi.appendChild(nested);\n            stack.push({ depth: stack.length + 1, list: nested });\n          }\n\n          stack[stack.length - 1].list.appendChild(buildListItemNode(current));\n        }\n\n        return root;\n      }\n\n      function setPreviewContent(payload) {\n        const summary =\n          typeof payload?.previewSummary === \"string\" ? payload.previewSummary.trim() : \"\";\n        const previewKind =\n          typeof payload?.previewKind === \"string\" ? payload.previewKind : \"text\";\n        const previewBlocks = Array.isArray(payload?.previewBlocks) ? payload.previewBlocks : [];\n\n        clearNodeChildren(previewText);\n\n        if (previewKind === \"markdown\" && previewBlocks.length > 0) {\n          const fragment = document.createDocumentFragment();\n\n          for (const block of previewBlocks) {\n            const type = typeof block?.type === \"string\" ? block.type : \"text\";\n\n            if (type === \"heading\") {\n              const depth = Math.max(1, Math.min(6, Number(block?.depth || 1)));\n              const tag = `h${depth}`;\n              fragment.appendChild(\n                appendMarkdownNode(\n                  tag,\n                  `preview-md-heading preview-md-h${depth}`,\n                  String(block?.content || \"\")\n                )\n              );\n              continue;\n            }\n\n            if (type === \"paragraph\") {\n              fragment.appendChild(\n                appendMarkdownNode(\n                  \"p\",\n                  \"preview-md-paragraph\",\n                  String(block?.content || \"\")\n                )\n              );\n              continue;\n            }\n\n            if (type === \"blockquote\") {\n              fragment.appendChild(\n                appendMarkdownNode(\n                  \"blockquote\",\n                  \"preview-md-blockquote\",\n                  String(block?.content || \"\")\n                )\n              );\n              continue;\n            }\n\n            if (type === \"list\" && Array.isArray(block?.items)) {\n              fragment.appendChild(\n                buildNestedListNode(block.items, Boolean(block.ordered), block?.start)\n              );\n              continue;\n            }\n\n            if (type === \"divider\") {\n              const hr = document.createElement(\"hr\");\n              hr.className = \"preview-md-divider\";\n              fragment.appendChild(hr);\n              continue;\n            }\n\n            if (type === \"table\") {\n              fragment.appendChild(buildTableNode(block?.content || \"\"));\n              continue;\n            }\n\n            if (type === \"code\" || type === \"text\" || type === \"mermaid\") {\n              fragment.appendChild(\n                appendPreviewNode(\"pre\", \"preview-md-code\", String(block?.content || \"\"))\n              );\n              continue;\n            }\n\n            fragment.appendChild(\n              appendPreviewNode(\n                \"p\",\n                \"preview-md-paragraph\",\n                String(block?.content || \"\")\n              )\n            );\n          }\n\n          previewText.appendChild(fragment);\n          return;\n        }\n\n        previewText.appendChild(\n          appendPreviewNode(\"pre\", \"preview-empty\", summary || \"No preview yet.\")\n        );\n      }\n\n      function setAuthPanel(open, payload = null) {\n        if (!open || !payload || typeof payload.sourceKey !== \"string\") {\n          activeAuthContext = null;\n          authPanel.dataset.open = \"false\";\n          authCopy.textContent = \"\";\n          authMeta.textContent = \"\";\n          patInput.value = \"\";\n          savePatButton.disabled = false;\n          forgetPatButton.disabled = false;\n          return;\n        }\n\n        activeAuthContext = payload;\n        authPanel.dataset.open = \"true\";\n        authCopy.textContent =\n          payload.message || AUTH_MESSAGES[payload.code] || AUTH_MESSAGES.MISSING_PAT;\n        authMeta.textContent = `sourceKey: ${payload.sourceKey}`;\n      }\n\n      form.addEventListener(\"submit\", (event) => {\n        event.preventDefault();\n        setStatus(\"loading\", \"Syncing...\");\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"create-preview\",\n              url: input.value,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      refreshButton.addEventListener(\"click\", () => {\n        setStatus(\"loading\", \"Syncing...\");\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"refresh-preview\",\n              widgetId: activeWidgetId,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      toggleDetailsButton.addEventListener(\"click\", () => {\n        detailsOpen = !detailsOpen;\n        updateDetailsVisibility();\n      });\n\n      savePatButton.addEventListener(\"click\", () => {\n        if (!activeAuthContext || typeof activeAuthContext.sourceKey !== \"string\") {\n          setStatus(\"error\", \"No hay sourceKey para guardar PAT.\");\n          return;\n        }\n\n        const token = patInput.value.trim();\n        if (!token) {\n          setStatus(\"error\", \"Introduce un PAT valido para continuar.\");\n          return;\n        }\n\n        setStatus(\"loading\", \"Reintentando con PAT...\");\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"submit-pat\",\n              sourceKey: activeAuthContext.sourceKey,\n              token,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      forgetPatButton.addEventListener(\"click\", () => {\n        if (!activeAuthContext || typeof activeAuthContext.sourceKey !== \"string\") {\n          setStatus(\"error\", \"No hay sourceKey para olvidar PAT.\");\n          return;\n        }\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"forget-pat\",\n              sourceKey: activeAuthContext.sourceKey,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      window.onmessage = (event) => {\n        const payload = event.data && event.data.pluginMessage;\n        if (!payload || typeof payload.type !== \"string\") {\n          return;\n        }\n\n        if (payload.type === \"widget-context\") {\n          if (typeof payload.lastUrl === \"string\" && payload.lastUrl.length > 0) {\n            input.value = payload.lastUrl;\n          }\n\n          if (typeof payload.widgetId === \"string\" && payload.widgetId.length > 0) {\n            activeWidgetId = payload.widgetId;\n          }\n\n          if (typeof payload.status === \"string\" && payload.status.length > 0) {\n            setStatus(\"\", payload.status);\n          }\n          setLastResult(payload.lastResult, payload.syncState);\n          setSyncProgress(payload.progressPercent);\n          setPreviewContent(payload);\n\n          if (payload.authContext && typeof payload.authContext === \"object\") {\n            setAuthPanel(true, payload.authContext);\n          } else {\n            setAuthPanel(false);\n          }\n          return;\n        }\n\n        if (payload.type === \"runtime-status\") {\n          setStatus(payload.level, payload.message, payload.details);\n          setLastResult(payload.lastResult, payload.syncState);\n          if (payload.level === \"success\" && payload.progressPercent == null) {\n            setSyncProgress(100);\n          } else if (payload.level === \"error\" && payload.progressPercent == null) {\n            setSyncProgress(100);\n          } else {\n            setSyncProgress(payload.progressPercent);\n          }\n          setPreviewContent(payload);\n          if (payload.authRequired && typeof payload.sourceKey === \"string\") {\n            setAuthPanel(true, payload);\n          } else if (payload.level === \"success\") {\n            setAuthPanel(false);\n          }\n        }\n      };\n\n      setPreviewContent({});\n      updateDetailsVisibility();\n    </script>\n  </body>\n</html>\n";
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

  // node_modules/marked/lib/marked.cjs
  var require_marked = __commonJS({
    "node_modules/marked/lib/marked.cjs"(exports) {
      "use strict";
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
          writable: false
        });
        return Constructor;
      }
      function _extends() {
        _extends = Object.assign ? Object.assign.bind() : function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends.apply(this, arguments);
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
      }
      function _createForOfIteratorHelperLoose(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (it) return (it = it.call(o)).next.bind(it);
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
      }
      function getDefaults() {
        return {
          async: false,
          baseUrl: null,
          breaks: false,
          extensions: null,
          gfm: true,
          headerIds: true,
          headerPrefix: "",
          highlight: null,
          hooks: null,
          langPrefix: "language-",
          mangle: true,
          pedantic: false,
          renderer: null,
          sanitize: false,
          sanitizer: null,
          silent: false,
          smartypants: false,
          tokenizer: null,
          walkTokens: null,
          xhtml: false
        };
      }
      exports.defaults = getDefaults();
      function changeDefaults(newDefaults) {
        exports.defaults = newDefaults;
      }
      var escapeTest = /[&<>"']/;
      var escapeReplace = new RegExp(escapeTest.source, "g");
      var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
      var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
      var escapeReplacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var getEscapeReplacement = function getEscapeReplacement2(ch) {
        return escapeReplacements[ch];
      };
      function escape(html, encode) {
        if (encode) {
          if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement);
          }
        } else {
          if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
          }
        }
        return html;
      }
      var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
      function unescape(html) {
        return html.replace(unescapeTest, function(_, n) {
          n = n.toLowerCase();
          if (n === "colon") return ":";
          if (n.charAt(0) === "#") {
            return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
          }
          return "";
        });
      }
      var caret = /(^|[^\[])\^/g;
      function edit(regex, opt) {
        regex = typeof regex === "string" ? regex : regex.source;
        opt = opt || "";
        var obj = {
          replace: function replace(name, val) {
            val = val.source || val;
            val = val.replace(caret, "$1");
            regex = regex.replace(name, val);
            return obj;
          },
          getRegex: function getRegex() {
            return new RegExp(regex, opt);
          }
        };
        return obj;
      }
      var nonWordAndColonTest = /[^\w:]/g;
      var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
      function cleanUrl(sanitize, base, href) {
        if (sanitize) {
          var prot;
          try {
            prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
          } catch (e) {
            return null;
          }
          if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
            return null;
          }
        }
        if (base && !originIndependentUrl.test(href)) {
          href = resolveUrl(base, href);
        }
        try {
          href = encodeURI(href).replace(/%25/g, "%");
        } catch (e) {
          return null;
        }
        return href;
      }
      var baseUrls = {};
      var justDomain = /^[^:]+:\/*[^/]*$/;
      var protocol = /^([^:]+:)[\s\S]*$/;
      var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
      function resolveUrl(base, href) {
        if (!baseUrls[" " + base]) {
          if (justDomain.test(base)) {
            baseUrls[" " + base] = base + "/";
          } else {
            baseUrls[" " + base] = rtrim(base, "/", true);
          }
        }
        base = baseUrls[" " + base];
        var relativeBase = base.indexOf(":") === -1;
        if (href.substring(0, 2) === "//") {
          if (relativeBase) {
            return href;
          }
          return base.replace(protocol, "$1") + href;
        } else if (href.charAt(0) === "/") {
          if (relativeBase) {
            return href;
          }
          return base.replace(domain, "$1") + href;
        } else {
          return base + href;
        }
      }
      var noopTest = {
        exec: function noopTest2() {
        }
      };
      function splitCells(tableRow, count) {
        var row = tableRow.replace(/\|/g, function(match, offset, str) {
          var escaped = false, curr = offset;
          while (--curr >= 0 && str[curr] === "\\") {
            escaped = !escaped;
          }
          if (escaped) {
            return "|";
          } else {
            return " |";
          }
        }), cells = row.split(/ \|/);
        var i = 0;
        if (!cells[0].trim()) {
          cells.shift();
        }
        if (cells.length > 0 && !cells[cells.length - 1].trim()) {
          cells.pop();
        }
        if (cells.length > count) {
          cells.splice(count);
        } else {
          while (cells.length < count) {
            cells.push("");
          }
        }
        for (; i < cells.length; i++) {
          cells[i] = cells[i].trim().replace(/\\\|/g, "|");
        }
        return cells;
      }
      function rtrim(str, c, invert) {
        var l = str.length;
        if (l === 0) {
          return "";
        }
        var suffLen = 0;
        while (suffLen < l) {
          var currChar = str.charAt(l - suffLen - 1);
          if (currChar === c && !invert) {
            suffLen++;
          } else if (currChar !== c && invert) {
            suffLen++;
          } else {
            break;
          }
        }
        return str.slice(0, l - suffLen);
      }
      function findClosingBracket(str, b) {
        if (str.indexOf(b[1]) === -1) {
          return -1;
        }
        var l = str.length;
        var level = 0, i = 0;
        for (; i < l; i++) {
          if (str[i] === "\\") {
            i++;
          } else if (str[i] === b[0]) {
            level++;
          } else if (str[i] === b[1]) {
            level--;
            if (level < 0) {
              return i;
            }
          }
        }
        return -1;
      }
      function checkSanitizeDeprecation(opt) {
        if (opt && opt.sanitize && !opt.silent) {
          console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
        }
      }
      function repeatString(pattern, count) {
        if (count < 1) {
          return "";
        }
        var result = "";
        while (count > 1) {
          if (count & 1) {
            result += pattern;
          }
          count >>= 1;
          pattern += pattern;
        }
        return result + pattern;
      }
      function outputLink(cap, link, raw, lexer2) {
        var href = link.href;
        var title = link.title ? escape(link.title) : null;
        var text = cap[1].replace(/\\([\[\]])/g, "$1");
        if (cap[0].charAt(0) !== "!") {
          lexer2.state.inLink = true;
          var token = {
            type: "link",
            raw,
            href,
            title,
            text,
            tokens: lexer2.inlineTokens(text)
          };
          lexer2.state.inLink = false;
          return token;
        }
        return {
          type: "image",
          raw,
          href,
          title,
          text: escape(text)
        };
      }
      function indentCodeCompensation(raw, text) {
        var matchIndentToCode = raw.match(/^(\s+)(?:```)/);
        if (matchIndentToCode === null) {
          return text;
        }
        var indentToCode = matchIndentToCode[1];
        return text.split("\n").map(function(node) {
          var matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }
          var indentInNode = matchIndentInNode[0];
          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }
          return node;
        }).join("\n");
      }
      var Tokenizer = /* @__PURE__ */ (function() {
        function Tokenizer2(options2) {
          this.options = options2 || exports.defaults;
        }
        var _proto = Tokenizer2.prototype;
        _proto.space = function space(src) {
          var cap = this.rules.block.newline.exec(src);
          if (cap && cap[0].length > 0) {
            return {
              type: "space",
              raw: cap[0]
            };
          }
        };
        _proto.code = function code(src) {
          var cap = this.rules.block.code.exec(src);
          if (cap) {
            var text = cap[0].replace(/^ {1,4}/gm, "");
            return {
              type: "code",
              raw: cap[0],
              codeBlockStyle: "indented",
              text: !this.options.pedantic ? rtrim(text, "\n") : text
            };
          }
        };
        _proto.fences = function fences(src) {
          var cap = this.rules.block.fences.exec(src);
          if (cap) {
            var raw = cap[0];
            var text = indentCodeCompensation(raw, cap[3] || "");
            return {
              type: "code",
              raw,
              lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, "$1") : cap[2],
              text
            };
          }
        };
        _proto.heading = function heading(src) {
          var cap = this.rules.block.heading.exec(src);
          if (cap) {
            var text = cap[2].trim();
            if (/#$/.test(text)) {
              var trimmed = rtrim(text, "#");
              if (this.options.pedantic) {
                text = trimmed.trim();
              } else if (!trimmed || / $/.test(trimmed)) {
                text = trimmed.trim();
              }
            }
            return {
              type: "heading",
              raw: cap[0],
              depth: cap[1].length,
              text,
              tokens: this.lexer.inline(text)
            };
          }
        };
        _proto.hr = function hr(src) {
          var cap = this.rules.block.hr.exec(src);
          if (cap) {
            return {
              type: "hr",
              raw: cap[0]
            };
          }
        };
        _proto.blockquote = function blockquote(src) {
          var cap = this.rules.block.blockquote.exec(src);
          if (cap) {
            var text = cap[0].replace(/^ *>[ \t]?/gm, "");
            var top = this.lexer.state.top;
            this.lexer.state.top = true;
            var tokens = this.lexer.blockTokens(text);
            this.lexer.state.top = top;
            return {
              type: "blockquote",
              raw: cap[0],
              tokens,
              text
            };
          }
        };
        _proto.list = function list(src) {
          var cap = this.rules.block.list.exec(src);
          if (cap) {
            var raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine, line, nextLine, rawLine, itemContents, endEarly;
            var bull = cap[1].trim();
            var isordered = bull.length > 1;
            var list2 = {
              type: "list",
              raw: "",
              ordered: isordered,
              start: isordered ? +bull.slice(0, -1) : "",
              loose: false,
              items: []
            };
            bull = isordered ? "\\d{1,9}\\" + bull.slice(-1) : "\\" + bull;
            if (this.options.pedantic) {
              bull = isordered ? bull : "[*+-]";
            }
            var itemRegex = new RegExp("^( {0,3}" + bull + ")((?:[	 ][^\\n]*)?(?:\\n|$))");
            while (src) {
              endEarly = false;
              if (!(cap = itemRegex.exec(src))) {
                break;
              }
              if (this.rules.block.hr.test(src)) {
                break;
              }
              raw = cap[0];
              src = src.substring(raw.length);
              line = cap[2].split("\n", 1)[0].replace(/^\t+/, function(t) {
                return " ".repeat(3 * t.length);
              });
              nextLine = src.split("\n", 1)[0];
              if (this.options.pedantic) {
                indent = 2;
                itemContents = line.trimLeft();
              } else {
                indent = cap[2].search(/[^ ]/);
                indent = indent > 4 ? 1 : indent;
                itemContents = line.slice(indent);
                indent += cap[1].length;
              }
              blankLine = false;
              if (!line && /^ *$/.test(nextLine)) {
                raw += nextLine + "\n";
                src = src.substring(nextLine.length + 1);
                endEarly = true;
              }
              if (!endEarly) {
                var nextBulletRegex = new RegExp("^ {0," + Math.min(3, indent - 1) + "}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))");
                var hrRegex = new RegExp("^ {0," + Math.min(3, indent - 1) + "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)");
                var fencesBeginRegex = new RegExp("^ {0," + Math.min(3, indent - 1) + "}(?:```|~~~)");
                var headingBeginRegex = new RegExp("^ {0," + Math.min(3, indent - 1) + "}#");
                while (src) {
                  rawLine = src.split("\n", 1)[0];
                  nextLine = rawLine;
                  if (this.options.pedantic) {
                    nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
                  }
                  if (fencesBeginRegex.test(nextLine)) {
                    break;
                  }
                  if (headingBeginRegex.test(nextLine)) {
                    break;
                  }
                  if (nextBulletRegex.test(nextLine)) {
                    break;
                  }
                  if (hrRegex.test(src)) {
                    break;
                  }
                  if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
                    itemContents += "\n" + nextLine.slice(indent);
                  } else {
                    if (blankLine) {
                      break;
                    }
                    if (line.search(/[^ ]/) >= 4) {
                      break;
                    }
                    if (fencesBeginRegex.test(line)) {
                      break;
                    }
                    if (headingBeginRegex.test(line)) {
                      break;
                    }
                    if (hrRegex.test(line)) {
                      break;
                    }
                    itemContents += "\n" + nextLine;
                  }
                  if (!blankLine && !nextLine.trim()) {
                    blankLine = true;
                  }
                  raw += rawLine + "\n";
                  src = src.substring(rawLine.length + 1);
                  line = nextLine.slice(indent);
                }
              }
              if (!list2.loose) {
                if (endsWithBlankLine) {
                  list2.loose = true;
                } else if (/\n *\n *$/.test(raw)) {
                  endsWithBlankLine = true;
                }
              }
              if (this.options.gfm) {
                istask = /^\[[ xX]\] /.exec(itemContents);
                if (istask) {
                  ischecked = istask[0] !== "[ ] ";
                  itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
                }
              }
              list2.items.push({
                type: "list_item",
                raw,
                task: !!istask,
                checked: ischecked,
                loose: false,
                text: itemContents
              });
              list2.raw += raw;
            }
            list2.items[list2.items.length - 1].raw = raw.trimRight();
            list2.items[list2.items.length - 1].text = itemContents.trimRight();
            list2.raw = list2.raw.trimRight();
            var l = list2.items.length;
            for (i = 0; i < l; i++) {
              this.lexer.state.top = false;
              list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
              if (!list2.loose) {
                var spacers = list2.items[i].tokens.filter(function(t) {
                  return t.type === "space";
                });
                var hasMultipleLineBreaks = spacers.length > 0 && spacers.some(function(t) {
                  return /\n.*\n/.test(t.raw);
                });
                list2.loose = hasMultipleLineBreaks;
              }
            }
            if (list2.loose) {
              for (i = 0; i < l; i++) {
                list2.items[i].loose = true;
              }
            }
            return list2;
          }
        };
        _proto.html = function html(src) {
          var cap = this.rules.block.html.exec(src);
          if (cap) {
            var token = {
              type: "html",
              raw: cap[0],
              pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
              text: cap[0]
            };
            if (this.options.sanitize) {
              var text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
              token.type = "paragraph";
              token.text = text;
              token.tokens = this.lexer.inline(text);
            }
            return token;
          }
        };
        _proto.def = function def(src) {
          var cap = this.rules.block.def.exec(src);
          if (cap) {
            var tag = cap[1].toLowerCase().replace(/\s+/g, " ");
            var href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "";
            var title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, "$1") : cap[3];
            return {
              type: "def",
              tag,
              raw: cap[0],
              href,
              title
            };
          }
        };
        _proto.table = function table(src) {
          var cap = this.rules.block.table.exec(src);
          if (cap) {
            var item = {
              type: "table",
              header: splitCells(cap[1]).map(function(c) {
                return {
                  text: c
                };
              }),
              align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
              rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : []
            };
            if (item.header.length === item.align.length) {
              item.raw = cap[0];
              var l = item.align.length;
              var i, j, k, row;
              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = "right";
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = "center";
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = "left";
                } else {
                  item.align[i] = null;
                }
              }
              l = item.rows.length;
              for (i = 0; i < l; i++) {
                item.rows[i] = splitCells(item.rows[i], item.header.length).map(function(c) {
                  return {
                    text: c
                  };
                });
              }
              l = item.header.length;
              for (j = 0; j < l; j++) {
                item.header[j].tokens = this.lexer.inline(item.header[j].text);
              }
              l = item.rows.length;
              for (j = 0; j < l; j++) {
                row = item.rows[j];
                for (k = 0; k < row.length; k++) {
                  row[k].tokens = this.lexer.inline(row[k].text);
                }
              }
              return item;
            }
          }
        };
        _proto.lheading = function lheading(src) {
          var cap = this.rules.block.lheading.exec(src);
          if (cap) {
            return {
              type: "heading",
              raw: cap[0],
              depth: cap[2].charAt(0) === "=" ? 1 : 2,
              text: cap[1],
              tokens: this.lexer.inline(cap[1])
            };
          }
        };
        _proto.paragraph = function paragraph(src) {
          var cap = this.rules.block.paragraph.exec(src);
          if (cap) {
            var text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
            return {
              type: "paragraph",
              raw: cap[0],
              text,
              tokens: this.lexer.inline(text)
            };
          }
        };
        _proto.text = function text(src) {
          var cap = this.rules.block.text.exec(src);
          if (cap) {
            return {
              type: "text",
              raw: cap[0],
              text: cap[0],
              tokens: this.lexer.inline(cap[0])
            };
          }
        };
        _proto.escape = function escape$1(src) {
          var cap = this.rules.inline.escape.exec(src);
          if (cap) {
            return {
              type: "escape",
              raw: cap[0],
              text: escape(cap[1])
            };
          }
        };
        _proto.tag = function tag(src) {
          var cap = this.rules.inline.tag.exec(src);
          if (cap) {
            if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
              this.lexer.state.inLink = true;
            } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
              this.lexer.state.inLink = false;
            }
            if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.lexer.state.inRawBlock = true;
            } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.lexer.state.inRawBlock = false;
            }
            return {
              type: this.options.sanitize ? "text" : "html",
              raw: cap[0],
              inLink: this.lexer.state.inLink,
              inRawBlock: this.lexer.state.inRawBlock,
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
            };
          }
        };
        _proto.link = function link(src) {
          var cap = this.rules.inline.link.exec(src);
          if (cap) {
            var trimmedUrl = cap[2].trim();
            if (!this.options.pedantic && /^</.test(trimmedUrl)) {
              if (!/>$/.test(trimmedUrl)) {
                return;
              }
              var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
              if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                return;
              }
            } else {
              var lastParenIndex = findClosingBracket(cap[2], "()");
              if (lastParenIndex > -1) {
                var start = cap[0].indexOf("!") === 0 ? 5 : 4;
                var linkLen = start + cap[1].length + lastParenIndex;
                cap[2] = cap[2].substring(0, lastParenIndex);
                cap[0] = cap[0].substring(0, linkLen).trim();
                cap[3] = "";
              }
            }
            var href = cap[2];
            var title = "";
            if (this.options.pedantic) {
              var link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
              if (link2) {
                href = link2[1];
                title = link2[3];
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : "";
            }
            href = href.trim();
            if (/^</.test(href)) {
              if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
                href = href.slice(1);
              } else {
                href = href.slice(1, -1);
              }
            }
            return outputLink(cap, {
              href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
              title: title ? title.replace(this.rules.inline._escapes, "$1") : title
            }, cap[0], this.lexer);
          }
        };
        _proto.reflink = function reflink(src, links) {
          var cap;
          if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
            var link = (cap[2] || cap[1]).replace(/\s+/g, " ");
            link = links[link.toLowerCase()];
            if (!link) {
              var text = cap[0].charAt(0);
              return {
                type: "text",
                raw: text,
                text
              };
            }
            return outputLink(cap, link, cap[0], this.lexer);
          }
        };
        _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
          if (prevChar === void 0) {
            prevChar = "";
          }
          var match = this.rules.inline.emStrong.lDelim.exec(src);
          if (!match) return;
          if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/)) return;
          var nextChar = match[1] || match[2] || "";
          if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
            var lLength = match[0].length - 1;
            var rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
            var endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
            endReg.lastIndex = 0;
            maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
            while ((match = endReg.exec(maskedSrc)) != null) {
              rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
              if (!rDelim) continue;
              rLength = rDelim.length;
              if (match[3] || match[4]) {
                delimTotal += rLength;
                continue;
              } else if (match[5] || match[6]) {
                if (lLength % 3 && !((lLength + rLength) % 3)) {
                  midDelimTotal += rLength;
                  continue;
                }
              }
              delimTotal -= rLength;
              if (delimTotal > 0) continue;
              rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
              var raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);
              if (Math.min(lLength, rLength) % 2) {
                var _text = raw.slice(1, -1);
                return {
                  type: "em",
                  raw,
                  text: _text,
                  tokens: this.lexer.inlineTokens(_text)
                };
              }
              var text = raw.slice(2, -2);
              return {
                type: "strong",
                raw,
                text,
                tokens: this.lexer.inlineTokens(text)
              };
            }
          }
        };
        _proto.codespan = function codespan(src) {
          var cap = this.rules.inline.code.exec(src);
          if (cap) {
            var text = cap[2].replace(/\n/g, " ");
            var hasNonSpaceChars = /[^ ]/.test(text);
            var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
              text = text.substring(1, text.length - 1);
            }
            text = escape(text, true);
            return {
              type: "codespan",
              raw: cap[0],
              text
            };
          }
        };
        _proto.br = function br(src) {
          var cap = this.rules.inline.br.exec(src);
          if (cap) {
            return {
              type: "br",
              raw: cap[0]
            };
          }
        };
        _proto.del = function del(src) {
          var cap = this.rules.inline.del.exec(src);
          if (cap) {
            return {
              type: "del",
              raw: cap[0],
              text: cap[2],
              tokens: this.lexer.inlineTokens(cap[2])
            };
          }
        };
        _proto.autolink = function autolink(src, mangle2) {
          var cap = this.rules.inline.autolink.exec(src);
          if (cap) {
            var text, href;
            if (cap[2] === "@") {
              text = escape(this.options.mangle ? mangle2(cap[1]) : cap[1]);
              href = "mailto:" + text;
            } else {
              text = escape(cap[1]);
              href = text;
            }
            return {
              type: "link",
              raw: cap[0],
              text,
              href,
              tokens: [{
                type: "text",
                raw: text,
                text
              }]
            };
          }
        };
        _proto.url = function url(src, mangle2) {
          var cap;
          if (cap = this.rules.inline.url.exec(src)) {
            var text, href;
            if (cap[2] === "@") {
              text = escape(this.options.mangle ? mangle2(cap[0]) : cap[0]);
              href = "mailto:" + text;
            } else {
              var prevCapZero;
              do {
                prevCapZero = cap[0];
                cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);
              text = escape(cap[0]);
              if (cap[1] === "www.") {
                href = "http://" + cap[0];
              } else {
                href = cap[0];
              }
            }
            return {
              type: "link",
              raw: cap[0],
              text,
              href,
              tokens: [{
                type: "text",
                raw: text,
                text
              }]
            };
          }
        };
        _proto.inlineText = function inlineText(src, smartypants2) {
          var cap = this.rules.inline.text.exec(src);
          if (cap) {
            var text;
            if (this.lexer.state.inRawBlock) {
              text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
            } else {
              text = escape(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
            }
            return {
              type: "text",
              raw: cap[0],
              text
            };
          }
        };
        return Tokenizer2;
      })();
      var block = {
        newline: /^(?: *(?:\n|$))+/,
        code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
        list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
        html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
        def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
        table: noopTest,
        lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        // regex template, placeholders will be replaced according to different paragraph
        // interruption rules of commonmark and the original markdown spec:
        _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
        text: /^[^\n]+/
      };
      block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
      block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
      block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
      block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
      block.listItemStart = edit(/^( *)(bull) */).replace("bull", block.bullet).getRegex();
      block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
      block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
      block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
      block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
      block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
      block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
      block.normal = _extends({}, block);
      block.gfm = _extends({}, block.normal, {
        table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
        // Cells
      });
      block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
      block.gfm.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", block.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
      block.pedantic = _extends({}, block.normal, {
        html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: noopTest,
        // fences not supported
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
      });
      var inline = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: noopTest,
        tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
        // CDATA section
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(ref)\]/,
        nolink: /^!?\[(ref)\](?:\[\])?/,
        reflinkSearch: "reflink|nolink(?!\\()",
        emStrong: {
          lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
          //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
          //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
          rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
          rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
          // ^- Not allowed for _
        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: noopTest,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/
      };
      inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
      inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
      inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
      inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;
      inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
      inline.emStrong.lDelim = edit(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
      inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, "g").replace(/punct/g, inline._punctuation).getRegex();
      inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, "g").replace(/punct/g, inline._punctuation).getRegex();
      inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
      inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
      inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
      inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
      inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
      inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
      inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
      inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
      inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
      inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
      inline.reflink = edit(inline.reflink).replace("label", inline._label).replace("ref", block._label).getRegex();
      inline.nolink = edit(inline.nolink).replace("ref", block._label).getRegex();
      inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
      inline.normal = _extends({}, inline);
      inline.pedantic = _extends({}, inline.normal, {
        strong: {
          start: /^__|\*\*/,
          middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          endAst: /\*\*(?!\*)/g,
          endUnd: /__(?!_)/g
        },
        em: {
          start: /^_|\*/,
          middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
          endAst: /\*(?!\*)/g,
          endUnd: /_(?!_)/g
        },
        link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
        reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
      });
      inline.gfm = _extends({}, inline.normal, {
        escape: edit(inline.escape).replace("])", "~|])").getRegex(),
        _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
        url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
      });
      inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
      inline.breaks = _extends({}, inline.gfm, {
        br: edit(inline.br).replace("{2,}", "*").getRegex(),
        text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
      });
      function smartypants(text) {
        return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
      }
      function mangle(text) {
        var out = "", i, ch;
        var l = text.length;
        for (i = 0; i < l; i++) {
          ch = text.charCodeAt(i);
          if (Math.random() > 0.5) {
            ch = "x" + ch.toString(16);
          }
          out += "&#" + ch + ";";
        }
        return out;
      }
      var Lexer = /* @__PURE__ */ (function() {
        function Lexer2(options2) {
          this.tokens = [];
          this.tokens.links = /* @__PURE__ */ Object.create(null);
          this.options = options2 || exports.defaults;
          this.options.tokenizer = this.options.tokenizer || new Tokenizer();
          this.tokenizer = this.options.tokenizer;
          this.tokenizer.options = this.options;
          this.tokenizer.lexer = this;
          this.inlineQueue = [];
          this.state = {
            inLink: false,
            inRawBlock: false,
            top: true
          };
          var rules = {
            block: block.normal,
            inline: inline.normal
          };
          if (this.options.pedantic) {
            rules.block = block.pedantic;
            rules.inline = inline.pedantic;
          } else if (this.options.gfm) {
            rules.block = block.gfm;
            if (this.options.breaks) {
              rules.inline = inline.breaks;
            } else {
              rules.inline = inline.gfm;
            }
          }
          this.tokenizer.rules = rules;
        }
        Lexer2.lex = function lex(src, options2) {
          var lexer2 = new Lexer2(options2);
          return lexer2.lex(src);
        };
        Lexer2.lexInline = function lexInline(src, options2) {
          var lexer2 = new Lexer2(options2);
          return lexer2.inlineTokens(src);
        };
        var _proto = Lexer2.prototype;
        _proto.lex = function lex(src) {
          src = src.replace(/\r\n|\r/g, "\n");
          this.blockTokens(src, this.tokens);
          var next;
          while (next = this.inlineQueue.shift()) {
            this.inlineTokens(next.src, next.tokens);
          }
          return this.tokens;
        };
        _proto.blockTokens = function blockTokens(src, tokens) {
          var _this = this;
          if (tokens === void 0) {
            tokens = [];
          }
          if (this.options.pedantic) {
            src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
          } else {
            src = src.replace(/^( *)(\t+)/gm, function(_, leading, tabs) {
              return leading + "    ".repeat(tabs.length);
            });
          }
          var token, lastToken, cutSrc, lastParagraphClipped;
          while (src) {
            if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some(function(extTokenizer) {
              if (token = extTokenizer.call({
                lexer: _this
              }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
              continue;
            }
            if (token = this.tokenizer.space(src)) {
              src = src.substring(token.raw.length);
              if (token.raw.length === 1 && tokens.length > 0) {
                tokens[tokens.length - 1].raw += "\n";
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (token = this.tokenizer.code(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];
              if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
                lastToken.raw += "\n" + token.raw;
                lastToken.text += "\n" + token.text;
                this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (token = this.tokenizer.fences(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.heading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.hr(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.blockquote(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.list(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.html(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.def(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];
              if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
                lastToken.raw += "\n" + token.raw;
                lastToken.text += "\n" + token.raw;
                this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
              } else if (!this.tokens.links[token.tag]) {
                this.tokens.links[token.tag] = {
                  href: token.href,
                  title: token.title
                };
              }
              continue;
            }
            if (token = this.tokenizer.table(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.lheading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            cutSrc = src;
            if (this.options.extensions && this.options.extensions.startBlock) {
              (function() {
                var startIndex = Infinity;
                var tempSrc = src.slice(1);
                var tempStart = void 0;
                _this.options.extensions.startBlock.forEach(function(getStartIndex) {
                  tempStart = getStartIndex.call({
                    lexer: this
                  }, tempSrc);
                  if (typeof tempStart === "number" && tempStart >= 0) {
                    startIndex = Math.min(startIndex, tempStart);
                  }
                });
                if (startIndex < Infinity && startIndex >= 0) {
                  cutSrc = src.substring(0, startIndex + 1);
                }
              })();
            }
            if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
              lastToken = tokens[tokens.length - 1];
              if (lastParagraphClipped && lastToken.type === "paragraph") {
                lastToken.raw += "\n" + token.raw;
                lastToken.text += "\n" + token.text;
                this.inlineQueue.pop();
                this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
              } else {
                tokens.push(token);
              }
              lastParagraphClipped = cutSrc.length !== src.length;
              src = src.substring(token.raw.length);
              continue;
            }
            if (token = this.tokenizer.text(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];
              if (lastToken && lastToken.type === "text") {
                lastToken.raw += "\n" + token.raw;
                lastToken.text += "\n" + token.text;
                this.inlineQueue.pop();
                this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (src) {
              var errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }
          this.state.top = true;
          return tokens;
        };
        _proto.inline = function inline2(src, tokens) {
          if (tokens === void 0) {
            tokens = [];
          }
          this.inlineQueue.push({
            src,
            tokens
          });
          return tokens;
        };
        _proto.inlineTokens = function inlineTokens(src, tokens) {
          var _this2 = this;
          if (tokens === void 0) {
            tokens = [];
          }
          var token, lastToken, cutSrc;
          var maskedSrc = src;
          var match;
          var keepPrevChar, prevChar;
          if (this.tokens.links) {
            var links = Object.keys(this.tokens.links);
            if (links.length > 0) {
              while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
                  maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                }
              }
            }
          }
          while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
          }
          while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
            this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
          }
          while (src) {
            if (!keepPrevChar) {
              prevChar = "";
            }
            keepPrevChar = false;
            if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some(function(extTokenizer) {
              if (token = extTokenizer.call({
                lexer: _this2
              }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
              continue;
            }
            if (token = this.tokenizer.escape(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.tag(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];
              if (lastToken && token.type === "text" && lastToken.type === "text") {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (token = this.tokenizer.link(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.reflink(src, this.tokens.links)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];
              if (lastToken && token.type === "text" && lastToken.type === "text") {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.codespan(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.br(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.del(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (token = this.tokenizer.autolink(src, mangle)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            }
            cutSrc = src;
            if (this.options.extensions && this.options.extensions.startInline) {
              (function() {
                var startIndex = Infinity;
                var tempSrc = src.slice(1);
                var tempStart = void 0;
                _this2.options.extensions.startInline.forEach(function(getStartIndex) {
                  tempStart = getStartIndex.call({
                    lexer: this
                  }, tempSrc);
                  if (typeof tempStart === "number" && tempStart >= 0) {
                    startIndex = Math.min(startIndex, tempStart);
                  }
                });
                if (startIndex < Infinity && startIndex >= 0) {
                  cutSrc = src.substring(0, startIndex + 1);
                }
              })();
            }
            if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
              src = src.substring(token.raw.length);
              if (token.raw.slice(-1) !== "_") {
                prevChar = token.raw.slice(-1);
              }
              keepPrevChar = true;
              lastToken = tokens[tokens.length - 1];
              if (lastToken && lastToken.type === "text") {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }
              continue;
            }
            if (src) {
              var errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }
          return tokens;
        };
        _createClass(Lexer2, null, [{
          key: "rules",
          get: function get() {
            return {
              block,
              inline
            };
          }
        }]);
        return Lexer2;
      })();
      var Renderer = /* @__PURE__ */ (function() {
        function Renderer2(options2) {
          this.options = options2 || exports.defaults;
        }
        var _proto = Renderer2.prototype;
        _proto.code = function code(_code, infostring, escaped) {
          var lang = (infostring || "").match(/\S*/)[0];
          if (this.options.highlight) {
            var out = this.options.highlight(_code, lang);
            if (out != null && out !== _code) {
              escaped = true;
              _code = out;
            }
          }
          _code = _code.replace(/\n$/, "") + "\n";
          if (!lang) {
            return "<pre><code>" + (escaped ? _code : escape(_code, true)) + "</code></pre>\n";
          }
          return '<pre><code class="' + this.options.langPrefix + escape(lang) + '">' + (escaped ? _code : escape(_code, true)) + "</code></pre>\n";
        };
        _proto.blockquote = function blockquote(quote) {
          return "<blockquote>\n" + quote + "</blockquote>\n";
        };
        _proto.html = function html(_html) {
          return _html;
        };
        _proto.heading = function heading(text, level, raw, slugger) {
          if (this.options.headerIds) {
            var id = this.options.headerPrefix + slugger.slug(raw);
            return "<h" + level + ' id="' + id + '">' + text + "</h" + level + ">\n";
          }
          return "<h" + level + ">" + text + "</h" + level + ">\n";
        };
        _proto.hr = function hr() {
          return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
        };
        _proto.list = function list(body, ordered, start) {
          var type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
          return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
        };
        _proto.listitem = function listitem(text) {
          return "<li>" + text + "</li>\n";
        };
        _proto.checkbox = function checkbox(checked) {
          return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
        };
        _proto.paragraph = function paragraph(text) {
          return "<p>" + text + "</p>\n";
        };
        _proto.table = function table(header, body) {
          if (body) body = "<tbody>" + body + "</tbody>";
          return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
        };
        _proto.tablerow = function tablerow(content) {
          return "<tr>\n" + content + "</tr>\n";
        };
        _proto.tablecell = function tablecell(content, flags) {
          var type = flags.header ? "th" : "td";
          var tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
          return tag + content + ("</" + type + ">\n");
        };
        _proto.strong = function strong(text) {
          return "<strong>" + text + "</strong>";
        };
        _proto.em = function em(text) {
          return "<em>" + text + "</em>";
        };
        _proto.codespan = function codespan(text) {
          return "<code>" + text + "</code>";
        };
        _proto.br = function br() {
          return this.options.xhtml ? "<br/>" : "<br>";
        };
        _proto.del = function del(text) {
          return "<del>" + text + "</del>";
        };
        _proto.link = function link(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
          if (href === null) {
            return text;
          }
          var out = '<a href="' + href + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += ">" + text + "</a>";
          return out;
        };
        _proto.image = function image(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
          if (href === null) {
            return text;
          }
          var out = '<img src="' + href + '" alt="' + text + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += this.options.xhtml ? "/>" : ">";
          return out;
        };
        _proto.text = function text(_text) {
          return _text;
        };
        return Renderer2;
      })();
      var TextRenderer = /* @__PURE__ */ (function() {
        function TextRenderer2() {
        }
        var _proto = TextRenderer2.prototype;
        _proto.strong = function strong(text) {
          return text;
        };
        _proto.em = function em(text) {
          return text;
        };
        _proto.codespan = function codespan(text) {
          return text;
        };
        _proto.del = function del(text) {
          return text;
        };
        _proto.html = function html(text) {
          return text;
        };
        _proto.text = function text(_text) {
          return _text;
        };
        _proto.link = function link(href, title, text) {
          return "" + text;
        };
        _proto.image = function image(href, title, text) {
          return "" + text;
        };
        _proto.br = function br() {
          return "";
        };
        return TextRenderer2;
      })();
      var Slugger = /* @__PURE__ */ (function() {
        function Slugger2() {
          this.seen = {};
        }
        var _proto = Slugger2.prototype;
        _proto.serialize = function serialize(value) {
          return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
        };
        _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
          var slug = originalSlug;
          var occurenceAccumulator = 0;
          if (this.seen.hasOwnProperty(slug)) {
            occurenceAccumulator = this.seen[originalSlug];
            do {
              occurenceAccumulator++;
              slug = originalSlug + "-" + occurenceAccumulator;
            } while (this.seen.hasOwnProperty(slug));
          }
          if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
          }
          return slug;
        };
        _proto.slug = function slug(value, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          var slug2 = this.serialize(value);
          return this.getNextSafeSlug(slug2, options2.dryrun);
        };
        return Slugger2;
      })();
      var Parser = /* @__PURE__ */ (function() {
        function Parser2(options2) {
          this.options = options2 || exports.defaults;
          this.options.renderer = this.options.renderer || new Renderer();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
          this.textRenderer = new TextRenderer();
          this.slugger = new Slugger();
        }
        Parser2.parse = function parse2(tokens, options2) {
          var parser2 = new Parser2(options2);
          return parser2.parse(tokens);
        };
        Parser2.parseInline = function parseInline2(tokens, options2) {
          var parser2 = new Parser2(options2);
          return parser2.parseInline(tokens);
        };
        var _proto = Parser2.prototype;
        _proto.parse = function parse2(tokens, top) {
          if (top === void 0) {
            top = true;
          }
          var out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
          var l = tokens.length;
          for (i = 0; i < l; i++) {
            token = tokens[i];
            if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
              ret = this.options.extensions.renderers[token.type].call({
                parser: this
              }, token);
              if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
                out += ret || "";
                continue;
              }
            }
            switch (token.type) {
              case "space": {
                continue;
              }
              case "hr": {
                out += this.renderer.hr();
                continue;
              }
              case "heading": {
                out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
                continue;
              }
              case "code": {
                out += this.renderer.code(token.text, token.lang, token.escaped);
                continue;
              }
              case "table": {
                header = "";
                cell = "";
                l2 = token.header.length;
                for (j = 0; j < l2; j++) {
                  cell += this.renderer.tablecell(this.parseInline(token.header[j].tokens), {
                    header: true,
                    align: token.align[j]
                  });
                }
                header += this.renderer.tablerow(cell);
                body = "";
                l2 = token.rows.length;
                for (j = 0; j < l2; j++) {
                  row = token.rows[j];
                  cell = "";
                  l3 = row.length;
                  for (k = 0; k < l3; k++) {
                    cell += this.renderer.tablecell(this.parseInline(row[k].tokens), {
                      header: false,
                      align: token.align[k]
                    });
                  }
                  body += this.renderer.tablerow(cell);
                }
                out += this.renderer.table(header, body);
                continue;
              }
              case "blockquote": {
                body = this.parse(token.tokens);
                out += this.renderer.blockquote(body);
                continue;
              }
              case "list": {
                ordered = token.ordered;
                start = token.start;
                loose = token.loose;
                l2 = token.items.length;
                body = "";
                for (j = 0; j < l2; j++) {
                  item = token.items[j];
                  checked = item.checked;
                  task = item.task;
                  itemBody = "";
                  if (item.task) {
                    checkbox = this.renderer.checkbox(checked);
                    if (loose) {
                      if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                        item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                        if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                          item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                        }
                      } else {
                        item.tokens.unshift({
                          type: "text",
                          text: checkbox
                        });
                      }
                    } else {
                      itemBody += checkbox;
                    }
                  }
                  itemBody += this.parse(item.tokens, loose);
                  body += this.renderer.listitem(itemBody, task, checked);
                }
                out += this.renderer.list(body, ordered, start);
                continue;
              }
              case "html": {
                out += this.renderer.html(token.text);
                continue;
              }
              case "paragraph": {
                out += this.renderer.paragraph(this.parseInline(token.tokens));
                continue;
              }
              case "text": {
                body = token.tokens ? this.parseInline(token.tokens) : token.text;
                while (i + 1 < l && tokens[i + 1].type === "text") {
                  token = tokens[++i];
                  body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
                }
                out += top ? this.renderer.paragraph(body) : body;
                continue;
              }
              default: {
                var errMsg = 'Token with "' + token.type + '" type was not found.';
                if (this.options.silent) {
                  console.error(errMsg);
                  return;
                } else {
                  throw new Error(errMsg);
                }
              }
            }
          }
          return out;
        };
        _proto.parseInline = function parseInline2(tokens, renderer) {
          renderer = renderer || this.renderer;
          var out = "", i, token, ret;
          var l = tokens.length;
          for (i = 0; i < l; i++) {
            token = tokens[i];
            if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
              ret = this.options.extensions.renderers[token.type].call({
                parser: this
              }, token);
              if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
                out += ret || "";
                continue;
              }
            }
            switch (token.type) {
              case "escape": {
                out += renderer.text(token.text);
                break;
              }
              case "html": {
                out += renderer.html(token.text);
                break;
              }
              case "link": {
                out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
                break;
              }
              case "image": {
                out += renderer.image(token.href, token.title, token.text);
                break;
              }
              case "strong": {
                out += renderer.strong(this.parseInline(token.tokens, renderer));
                break;
              }
              case "em": {
                out += renderer.em(this.parseInline(token.tokens, renderer));
                break;
              }
              case "codespan": {
                out += renderer.codespan(token.text);
                break;
              }
              case "br": {
                out += renderer.br();
                break;
              }
              case "del": {
                out += renderer.del(this.parseInline(token.tokens, renderer));
                break;
              }
              case "text": {
                out += renderer.text(token.text);
                break;
              }
              default: {
                var errMsg = 'Token with "' + token.type + '" type was not found.';
                if (this.options.silent) {
                  console.error(errMsg);
                  return;
                } else {
                  throw new Error(errMsg);
                }
              }
            }
          }
          return out;
        };
        return Parser2;
      })();
      var Hooks = /* @__PURE__ */ (function() {
        function Hooks2(options2) {
          this.options = options2 || exports.defaults;
        }
        var _proto = Hooks2.prototype;
        _proto.preprocess = function preprocess(markdown) {
          return markdown;
        };
        _proto.postprocess = function postprocess(html) {
          return html;
        };
        return Hooks2;
      })();
      Hooks.passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess"]);
      function onError(silent, async, callback) {
        return function(e) {
          e.message += "\nPlease report this to https://github.com/markedjs/marked.";
          if (silent) {
            var msg = "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
            if (async) {
              return Promise.resolve(msg);
            }
            if (callback) {
              callback(null, msg);
              return;
            }
            return msg;
          }
          if (async) {
            return Promise.reject(e);
          }
          if (callback) {
            callback(e);
            return;
          }
          throw e;
        };
      }
      function parseMarkdown(lexer2, parser2) {
        return function(src, opt, callback) {
          if (typeof opt === "function") {
            callback = opt;
            opt = null;
          }
          var origOpt = _extends({}, opt);
          opt = _extends({}, marked.defaults, origOpt);
          var throwError = onError(opt.silent, opt.async, callback);
          if (typeof src === "undefined" || src === null) {
            return throwError(new Error("marked(): input parameter is undefined or null"));
          }
          if (typeof src !== "string") {
            return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
          }
          checkSanitizeDeprecation(opt);
          if (opt.hooks) {
            opt.hooks.options = opt;
          }
          if (callback) {
            var highlight = opt.highlight;
            var tokens;
            try {
              if (opt.hooks) {
                src = opt.hooks.preprocess(src);
              }
              tokens = lexer2(src, opt);
            } catch (e) {
              return throwError(e);
            }
            var done = function done2(err) {
              var out;
              if (!err) {
                try {
                  if (opt.walkTokens) {
                    marked.walkTokens(tokens, opt.walkTokens);
                  }
                  out = parser2(tokens, opt);
                  if (opt.hooks) {
                    out = opt.hooks.postprocess(out);
                  }
                } catch (e) {
                  err = e;
                }
              }
              opt.highlight = highlight;
              return err ? throwError(err) : callback(null, out);
            };
            if (!highlight || highlight.length < 3) {
              return done();
            }
            delete opt.highlight;
            if (!tokens.length) return done();
            var pending = 0;
            marked.walkTokens(tokens, function(token) {
              if (token.type === "code") {
                pending++;
                setTimeout(function() {
                  highlight(token.text, token.lang, function(err, code) {
                    if (err) {
                      return done(err);
                    }
                    if (code != null && code !== token.text) {
                      token.text = code;
                      token.escaped = true;
                    }
                    pending--;
                    if (pending === 0) {
                      done();
                    }
                  });
                }, 0);
              }
            });
            if (pending === 0) {
              done();
            }
            return;
          }
          if (opt.async) {
            return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then(function(src2) {
              return lexer2(src2, opt);
            }).then(function(tokens2) {
              return opt.walkTokens ? Promise.all(marked.walkTokens(tokens2, opt.walkTokens)).then(function() {
                return tokens2;
              }) : tokens2;
            }).then(function(tokens2) {
              return parser2(tokens2, opt);
            }).then(function(html2) {
              return opt.hooks ? opt.hooks.postprocess(html2) : html2;
            })["catch"](throwError);
          }
          try {
            if (opt.hooks) {
              src = opt.hooks.preprocess(src);
            }
            var _tokens = lexer2(src, opt);
            if (opt.walkTokens) {
              marked.walkTokens(_tokens, opt.walkTokens);
            }
            var html = parser2(_tokens, opt);
            if (opt.hooks) {
              html = opt.hooks.postprocess(html);
            }
            return html;
          } catch (e) {
            return throwError(e);
          }
        };
      }
      function marked(src, opt, callback) {
        return parseMarkdown(Lexer.lex, Parser.parse)(src, opt, callback);
      }
      marked.options = marked.setOptions = function(opt) {
        marked.defaults = _extends({}, marked.defaults, opt);
        changeDefaults(marked.defaults);
        return marked;
      };
      marked.getDefaults = getDefaults;
      marked.defaults = exports.defaults;
      marked.use = function() {
        var extensions = marked.defaults.extensions || {
          renderers: {},
          childTokens: {}
        };
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        args.forEach(function(pack) {
          var opts = _extends({}, pack);
          opts.async = marked.defaults.async || opts.async || false;
          if (pack.extensions) {
            pack.extensions.forEach(function(ext) {
              if (!ext.name) {
                throw new Error("extension name required");
              }
              if (ext.renderer) {
                var prevRenderer = extensions.renderers[ext.name];
                if (prevRenderer) {
                  extensions.renderers[ext.name] = function() {
                    for (var _len2 = arguments.length, args2 = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                      args2[_key2] = arguments[_key2];
                    }
                    var ret = ext.renderer.apply(this, args2);
                    if (ret === false) {
                      ret = prevRenderer.apply(this, args2);
                    }
                    return ret;
                  };
                } else {
                  extensions.renderers[ext.name] = ext.renderer;
                }
              }
              if (ext.tokenizer) {
                if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                  throw new Error("extension level must be 'block' or 'inline'");
                }
                if (extensions[ext.level]) {
                  extensions[ext.level].unshift(ext.tokenizer);
                } else {
                  extensions[ext.level] = [ext.tokenizer];
                }
                if (ext.start) {
                  if (ext.level === "block") {
                    if (extensions.startBlock) {
                      extensions.startBlock.push(ext.start);
                    } else {
                      extensions.startBlock = [ext.start];
                    }
                  } else if (ext.level === "inline") {
                    if (extensions.startInline) {
                      extensions.startInline.push(ext.start);
                    } else {
                      extensions.startInline = [ext.start];
                    }
                  }
                }
              }
              if (ext.childTokens) {
                extensions.childTokens[ext.name] = ext.childTokens;
              }
            });
            opts.extensions = extensions;
          }
          if (pack.renderer) {
            (function() {
              var renderer = marked.defaults.renderer || new Renderer();
              var _loop = function _loop2(prop2) {
                var prevRenderer = renderer[prop2];
                renderer[prop2] = function() {
                  for (var _len3 = arguments.length, args2 = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args2[_key3] = arguments[_key3];
                  }
                  var ret = pack.renderer[prop2].apply(renderer, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(renderer, args2);
                  }
                  return ret;
                };
              };
              for (var prop in pack.renderer) {
                _loop(prop);
              }
              opts.renderer = renderer;
            })();
          }
          if (pack.tokenizer) {
            (function() {
              var tokenizer = marked.defaults.tokenizer || new Tokenizer();
              var _loop2 = function _loop22(prop2) {
                var prevTokenizer = tokenizer[prop2];
                tokenizer[prop2] = function() {
                  for (var _len4 = arguments.length, args2 = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args2[_key4] = arguments[_key4];
                  }
                  var ret = pack.tokenizer[prop2].apply(tokenizer, args2);
                  if (ret === false) {
                    ret = prevTokenizer.apply(tokenizer, args2);
                  }
                  return ret;
                };
              };
              for (var prop in pack.tokenizer) {
                _loop2(prop);
              }
              opts.tokenizer = tokenizer;
            })();
          }
          if (pack.hooks) {
            (function() {
              var hooks = marked.defaults.hooks || new Hooks();
              var _loop3 = function _loop32(prop2) {
                var prevHook = hooks[prop2];
                if (Hooks.passThroughHooks.has(prop2)) {
                  hooks[prop2] = function(arg) {
                    if (marked.defaults.async) {
                      return Promise.resolve(pack.hooks[prop2].call(hooks, arg)).then(function(ret2) {
                        return prevHook.call(hooks, ret2);
                      });
                    }
                    var ret = pack.hooks[prop2].call(hooks, arg);
                    return prevHook.call(hooks, ret);
                  };
                } else {
                  hooks[prop2] = function() {
                    for (var _len5 = arguments.length, args2 = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                      args2[_key5] = arguments[_key5];
                    }
                    var ret = pack.hooks[prop2].apply(hooks, args2);
                    if (ret === false) {
                      ret = prevHook.apply(hooks, args2);
                    }
                    return ret;
                  };
                }
              };
              for (var prop in pack.hooks) {
                _loop3(prop);
              }
              opts.hooks = hooks;
            })();
          }
          if (pack.walkTokens) {
            var _walkTokens = marked.defaults.walkTokens;
            opts.walkTokens = function(token) {
              var values = [];
              values.push(pack.walkTokens.call(this, token));
              if (_walkTokens) {
                values = values.concat(_walkTokens.call(this, token));
              }
              return values;
            };
          }
          marked.setOptions(opts);
        });
      };
      marked.walkTokens = function(tokens, callback) {
        var values = [];
        var _loop4 = function _loop42() {
          var token = _step.value;
          values = values.concat(callback.call(marked, token));
          switch (token.type) {
            case "table": {
              for (var _iterator2 = _createForOfIteratorHelperLoose(token.header), _step2; !(_step2 = _iterator2()).done; ) {
                var cell = _step2.value;
                values = values.concat(marked.walkTokens(cell.tokens, callback));
              }
              for (var _iterator3 = _createForOfIteratorHelperLoose(token.rows), _step3; !(_step3 = _iterator3()).done; ) {
                var row = _step3.value;
                for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done; ) {
                  var _cell = _step4.value;
                  values = values.concat(marked.walkTokens(_cell.tokens, callback));
                }
              }
              break;
            }
            case "list": {
              values = values.concat(marked.walkTokens(token.items, callback));
              break;
            }
            default: {
              if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
                marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                  values = values.concat(marked.walkTokens(token[childTokens], callback));
                });
              } else if (token.tokens) {
                values = values.concat(marked.walkTokens(token.tokens, callback));
              }
            }
          }
        };
        for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done; ) {
          _loop4();
        }
        return values;
      };
      marked.parseInline = parseMarkdown(Lexer.lexInline, Parser.parseInline);
      marked.Parser = Parser;
      marked.parser = Parser.parse;
      marked.Renderer = Renderer;
      marked.TextRenderer = TextRenderer;
      marked.Lexer = Lexer;
      marked.lexer = Lexer.lex;
      marked.Tokenizer = Tokenizer;
      marked.Slugger = Slugger;
      marked.Hooks = Hooks;
      marked.parse = marked;
      var options = marked.options;
      var setOptions = marked.setOptions;
      var use = marked.use;
      var walkTokens = marked.walkTokens;
      var parseInline = marked.parseInline;
      var parse = marked;
      var parser = Parser.parse;
      var lexer = Lexer.lex;
      exports.Hooks = Hooks;
      exports.Lexer = Lexer;
      exports.Parser = Parser;
      exports.Renderer = Renderer;
      exports.Slugger = Slugger;
      exports.TextRenderer = TextRenderer;
      exports.Tokenizer = Tokenizer;
      exports.getDefaults = getDefaults;
      exports.lexer = lexer;
      exports.marked = marked;
      exports.options = options;
      exports.parse = parse;
      exports.parseInline = parseInline;
      exports.parser = parser;
      exports.setOptions = setOptions;
      exports.use = use;
      exports.walkTokens = walkTokens;
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
      var { marked } = require_marked();
      var { RENDER_KIND } = require_types5();
      var { renderMermaidBlocks } = require_renderMermaidBlocks();
      marked.setOptions({
        gfm: true,
        breaks: false,
        mangle: false,
        headerIds: false,
        smartypants: false
      });
      function isHtmlLike(line) {
        return /<[^>]+>/.test(line);
      }
      function serializeInlineTokens(tokens) {
        if (!Array.isArray(tokens) || tokens.length === 0) {
          return "";
        }
        const out = [];
        for (const token of tokens) {
          const type = typeof (token == null ? void 0 : token.type) === "string" ? token.type : "";
          if (type === "text" || type === "escape") {
            out.push(String(token.text || ""));
            continue;
          }
          if (type === "codespan") {
            out.push(`\`${String(token.text || "")}\``);
            continue;
          }
          if (type === "strong") {
            out.push(`**${serializeInlineTokens(token.tokens)}**`);
            continue;
          }
          if (type === "em") {
            out.push(`*${serializeInlineTokens(token.tokens)}*`);
            continue;
          }
          if (type === "del") {
            out.push(`~~${serializeInlineTokens(token.tokens)}~~`);
            continue;
          }
          if (type === "br") {
            out.push("\n");
            continue;
          }
          if (type === "link") {
            const href = String(token.href || "").trim();
            const text = serializeInlineTokens(token.tokens) || String(token.text || href);
            if (href) {
              out.push(`[${text}](${href})`);
            } else {
              out.push(text);
            }
            continue;
          }
          if (type === "image") {
            const alt = String(token.text || "").trim();
            const href = String(token.href || "").trim();
            if (href) {
              out.push(`![${alt}](${href})`);
            }
            continue;
          }
          if (type === "html") {
            out.push(String(token.raw || token.text || ""));
            continue;
          }
          if (Array.isArray(token == null ? void 0 : token.tokens) && token.tokens.length > 0) {
            out.push(serializeInlineTokens(token.tokens));
            continue;
          }
          if (typeof (token == null ? void 0 : token.text) === "string") {
            out.push(token.text);
            continue;
          }
          if (typeof (token == null ? void 0 : token.raw) === "string") {
            out.push(token.raw);
          }
        }
        return out.join("");
      }
      function renderTableDividerCell(align) {
        if (align === "left") return ":---";
        if (align === "right") return "---:";
        if (align === "center") return ":---:";
        return "---";
      }
      function toMarkdownTable(token) {
        const header = Array.isArray(token == null ? void 0 : token.header) ? token.header : [];
        const rows = Array.isArray(token == null ? void 0 : token.rows) ? token.rows : [];
        if (header.length === 0) {
          return "";
        }
        const headerCells = header.map(
          (cell) => serializeInlineTokens((cell == null ? void 0 : cell.tokens) || []).trim() || String((cell == null ? void 0 : cell.text) || "").trim()
        );
        const align = Array.isArray(token == null ? void 0 : token.align) ? token.align : [];
        const dividerCells = headerCells.map((_, index) => renderTableDividerCell(align[index]));
        const lineRows = rows.map((row) => {
          const cells = Array.isArray(row) ? row : [];
          const out = [];
          for (let index = 0; index < headerCells.length; index += 1) {
            const cell = cells[index];
            const text = serializeInlineTokens((cell == null ? void 0 : cell.tokens) || []).trim() || String((cell == null ? void 0 : cell.text) || "").trim();
            out.push(text);
          }
          return out;
        });
        const lines = [
          `| ${headerCells.join(" | ")} |`,
          `| ${dividerCells.join(" | ")} |`,
          ...lineRows.map((cells) => `| ${cells.join(" | ")} |`)
        ];
        return lines.join("\n");
      }
      function normalizeListItemContent(item) {
        const tokenText = serializeInlineTokens((item == null ? void 0 : item.tokens) || []).trim();
        const rawText = String((item == null ? void 0 : item.text) || "").trim();
        const content = tokenText || rawText;
        return content.replace(/\r?\n+/g, "\n").trim();
      }
      function collectListItems(token, depth, out) {
        const items = Array.isArray(token == null ? void 0 : token.items) ? token.items : [];
        for (const item of items) {
          const content = normalizeListItemContent(item);
          if (content) {
            const normalizedItem = {
              content,
              depth,
              ordered: typeof (token == null ? void 0 : token.ordered) === "boolean" ? token.ordered : false
            };
            if ((item == null ? void 0 : item.task) === true) {
              normalizedItem.task = { checked: Boolean(item.checked) };
            }
            out.push(normalizedItem);
          }
          for (const child of Array.isArray(item == null ? void 0 : item.tokens) ? item.tokens : []) {
            if ((child == null ? void 0 : child.type) === "list") {
              collectListItems(child, depth + 1, out);
            }
          }
        }
      }
      function parseMarkdownBlocks(markdown) {
        const source = String(markdown || "");
        const blocks = [];
        const warnings = [];
        try {
          const tokens = marked.lexer(source, { gfm: true });
          for (const token of tokens) {
            const type = typeof (token == null ? void 0 : token.type) === "string" ? token.type : "";
            if (type === "space") {
              continue;
            }
            if (type === "heading") {
              blocks.push({
                type: "heading",
                depth: Number(token.depth) || 1,
                content: serializeInlineTokens(token.tokens || []).trim() || String(token.text || "").trim()
              });
              continue;
            }
            if (type === "paragraph" || type === "text") {
              const content = serializeInlineTokens(token.tokens || []).trim() || String(token.text || "").trim();
              if (content) {
                blocks.push({
                  type: "paragraph",
                  content,
                  meta: {
                    htmlEscaped: isHtmlLike(content)
                  }
                });
              }
              continue;
            }
            if (type === "blockquote") {
              const content = String(token.text || "").trim();
              if (content) {
                blocks.push({
                  type: "blockquote",
                  content
                });
              }
              continue;
            }
            if (type === "list") {
              const items = [];
              collectListItems(token, 1, items);
              if (items.length > 0) {
                blocks.push({
                  type: "list",
                  ordered: Boolean(token.ordered),
                  start: Number.isFinite(Number(token.start)) && Number(token.start) > 0 ? Number(token.start) : 1,
                  items
                });
              }
              continue;
            }
            if (type === "table") {
              const tableMarkdown = toMarkdownTable(token);
              if (tableMarkdown) {
                blocks.push({
                  type: "table",
                  content: tableMarkdown
                });
              }
              continue;
            }
            if (type === "hr") {
              blocks.push({
                type: "divider"
              });
              continue;
            }
            if (type === "code") {
              blocks.push({
                type: "code",
                language: String(token.lang || "").toLowerCase() || "text",
                content: String(token.text || "")
              });
              continue;
            }
            if (type === "html") {
              const content = String(token.raw || token.text || "").trim();
              if (content) {
                blocks.push({
                  type: "paragraph",
                  content,
                  meta: {
                    htmlEscaped: true
                  }
                });
              }
              continue;
            }
            const fallback = String((token == null ? void 0 : token.raw) || (token == null ? void 0 : token.text) || "").trim();
            if (fallback) {
              blocks.push({
                type: "paragraph",
                content: fallback,
                meta: {
                  htmlEscaped: isHtmlLike(fallback)
                }
              });
            }
          }
        } catch (error) {
          warnings.push("No se pudo parsear markdown GFM completo; se muestra fallback textual.");
          if (source.trim()) {
            blocks.push({
              type: "paragraph",
              content: source.trim(),
              meta: {
                htmlEscaped: isHtmlLike(source)
              }
            });
          }
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
    WIDTH_INC: "width_inc"
  });
  var syncCoordinator = createSyncCoordinator({ cooldownMs: 6e4 });
  var CANVAS_SIZE_LIMITS = Object.freeze({
    minWidth: 360,
    maxWidth: 1800,
    defaultWidth: 672,
    widthStep: 80
  });
  var CANVAS_LAYOUT = Object.freeze({
    root: {
      spacing: 12,
      padding: 12,
      cornerRadius: 8
    },
    header: {
      spacing: 8,
      padding: 0,
      cornerRadius: 0
    },
    previewPanel: {
      spacing: 10,
      padding: 16,
      cornerRadius: 6,
      insetHorizontal: 0,
      renderBudgetHeight: 960,
      emptyStateHeight: 100
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
    const openNonce = ++lastUiOpenNonce;
    setTimeout(() => {
      if (lastUiReadyNonce < openNonce) {
        figma.notify("UI opened but did not initialize.", { error: true });
      }
    }, 900);
    return true;
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
  function splitLines(value, maxLines, maxCharsPerLine) {
    const input = typeof value === "string" ? value : "";
    if (!input) return [];
    return input.split(/\r?\n/).map((line) => clampText(line, maxCharsPerLine)).filter(Boolean).slice(0, maxLines);
  }
  function readListItem(listItem) {
    if (listItem && typeof listItem === "object") {
      return {
        content: String(listItem.content || ""),
        depth: Math.max(1, Number(listItem.depth || 1)),
        ordered: typeof listItem.ordered === "boolean" ? listItem.ordered : void 0,
        task: listItem.task && typeof listItem.task === "object" ? { checked: Boolean(listItem.task.checked) } : null
      };
    }
    return {
      content: String(listItem || ""),
      depth: 1,
      ordered: void 0,
      task: null
    };
  }
  function listBulletForDepth(depth) {
    if (depth <= 1) return "\u2022";
    if (depth === 2) return "\u25E6";
    return "\u25AA";
  }
  function toPreviewLines(blocks, options = {}) {
    const maxLines = Number(options.maxLines || 12);
    const maxCharsPerLine = Number(options.maxCharsPerLine || 92);
    const out = [];
    for (const block of Array.isArray(blocks) ? blocks : []) {
      if (out.length >= maxLines) break;
      const type = typeof (block == null ? void 0 : block.type) === "string" ? block.type : "unknown";
      if (type === "heading") {
        out.push(clampText(`# ${block.content || ""}`, maxCharsPerLine));
        continue;
      }
      if (type === "paragraph") {
        const lines = splitLines(block.content, 2, maxCharsPerLine);
        out.push(...lines);
        continue;
      }
      if (type === "blockquote") {
        const lines = splitLines(String(block.content || ""), 2, maxCharsPerLine - 2);
        out.push(...lines.map((line) => `> ${line}`));
        continue;
      }
      if (type === "list" && Array.isArray(block.items)) {
        const orderedCounters = {};
        for (const item of block.items.slice(0, 3)) {
          if (out.length >= maxLines) break;
          const normalized = readListItem(item);
          const indent = "  ".repeat(Math.max(0, normalized.depth - 1));
          const ordered = typeof normalized.ordered === "boolean" ? normalized.ordered : Boolean(block.ordered);
          let prefix = normalized.task ? normalized.task.checked ? "[x]" : "[ ]" : listBulletForDepth(normalized.depth);
          if (!normalized.task && ordered) {
            orderedCounters[normalized.depth] = (orderedCounters[normalized.depth] || 0) + 1;
            for (const depthKey of Object.keys(orderedCounters)) {
              if (Number(depthKey) > normalized.depth) {
                delete orderedCounters[depthKey];
              }
            }
            prefix = `${orderedCounters[normalized.depth]}.`;
          }
          out.push(
            clampText(
              `${indent}${prefix} ${normalized.content}`,
              maxCharsPerLine
            )
          );
        }
        continue;
      }
      if (type === "divider") {
        out.push(clampText("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", maxCharsPerLine));
        continue;
      }
      if (type === "table") {
        const lines = splitLines(block.content, 2, maxCharsPerLine);
        out.push(...lines);
        continue;
      }
      if (type === "code" || type === "text") {
        const lang = typeof block.language === "string" && block.language ? block.language : "txt";
        out.push(clampText(`\`\`\`${lang}`, maxCharsPerLine));
        const lines = splitLines(block.content, 3, maxCharsPerLine);
        out.push(...lines);
        out.push("```");
        continue;
      }
      const fallback = clampText((block == null ? void 0 : block.content) || "", maxCharsPerLine);
      if (fallback) {
        out.push(fallback);
      }
    }
    return out.slice(0, maxLines);
  }
  function buildPreviewSummaryFromBlock(block, options = {}) {
    var _a;
    const lines = toPreviewLines((_a = block == null ? void 0 : block.preview) == null ? void 0 : _a.blocks, options);
    if (!Array.isArray(lines) || lines.length === 0) {
      return "";
    }
    return lines.join("\n");
  }
  function buildUiPreviewTextFromBlock(block, options = {}) {
    var _a;
    const maxChars = Number.isFinite(Number(options.maxChars)) && Number(options.maxChars) > 0 ? Number(options.maxChars) : 2e5;
    if (typeof (block == null ? void 0 : block.previewSummary) === "string" && block.previewSummary.trim()) {
      const directText = block.previewSummary.trim();
      if (directText.length > maxChars) {
        return `${directText.slice(0, maxChars)}

[preview truncated in UI]`;
      }
      return directText;
    }
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
      if (type === "blockquote") {
        parts.push(`> ${String(item.content || "")}`);
        continue;
      }
      if (type === "list" && Array.isArray(item.items)) {
        const orderedCounters = {};
        for (const entry of item.items) {
          const normalized = readListItem(entry);
          const indent = "  ".repeat(Math.max(0, normalized.depth - 1));
          const ordered = typeof normalized.ordered === "boolean" ? normalized.ordered : Boolean(item.ordered);
          let prefix = normalized.task ? normalized.task.checked ? "[x]" : "[ ]" : listBulletForDepth(normalized.depth);
          if (!normalized.task && ordered) {
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
    return { width };
  }
  function fitPreviewTextForCanvas(inputText, options = {}) {
    const text = typeof inputText === "string" ? inputText : "";
    if (!text) return "";
    const width = Math.max(180, Number(options.width || CANVAS_SIZE_LIMITS.defaultWidth));
    const height = Math.max(120, Number(options.height || CANVAS_LAYOUT.previewPanel.renderBudgetHeight));
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
    const directSummary = typeof (block == null ? void 0 : block.previewSummary) === "string" ? block.previewSummary.trim() : "";
    const directBlocks = directSummary.length > 0 ? [
      {
        type: "text",
        language: "txt",
        content: directSummary
      }
    ] : [];
    const previewBlocks = Array.isArray(preview.blocks) ? preview.blocks : directBlocks;
    return {
      previewKind: typeof preview.kind === "string" && preview.kind ? preview.kind : "text",
      previewBlocks
    };
  }
  function jsonCloneSafe(value, fallback) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return fallback;
    }
  }
  function toSafeString(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value : fallback;
  }
  function parseInlineMarkdownSegments(value) {
    const input = String(value || "");
    if (!input) {
      return [];
    }
    const source = input.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "$1");
    const tokenPattern = /(\*\*\*[^*\n]+?\*\*\*|___[^_\n]+?___|\*\*_[^_\n]+?_\*\*|__\*[^*\n]+?\*__|\*\*[^*\n]+?\*\*|__[^_\n]+?__|\*[^*\n]+?\*|_[^_\n]+?_|`[^`]+`|\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<((?:https?:\/\/|mailto:)[^>\s]+)>|https?:\/\/[^\s<)]+)/g;
    const segments = [];
    let cursor = 0;
    function pushSegment(text, style = {}) {
      const normalized = String(text || "");
      if (!normalized) {
        return;
      }
      const last = segments[segments.length - 1];
      if (last && Boolean(last.bold) === Boolean(style.bold) && Boolean(last.italic) === Boolean(style.italic) && Boolean(last.link) === Boolean(style.link)) {
        last.text += normalized;
        return;
      }
      segments.push({
        text: normalized,
        bold: Boolean(style.bold),
        italic: Boolean(style.italic),
        link: Boolean(style.link)
      });
    }
    let match;
    while ((match = tokenPattern.exec(source)) !== null) {
      if (match.index > cursor) {
        pushSegment(source.slice(cursor, match.index));
      }
      const token = String(match[0] || "");
      if (!token) {
        cursor = match.index + 1;
        continue;
      }
      if (token.startsWith("***") && token.endsWith("***") || token.startsWith("___") && token.endsWith("___")) {
        pushSegment(token.slice(3, -3), { bold: true, italic: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      if (token.startsWith("**_") && token.endsWith("_**") || token.startsWith("__*") && token.endsWith("*__")) {
        pushSegment(token.slice(3, -3), { bold: true, italic: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      if (token.startsWith("**") && token.endsWith("**") || token.startsWith("__") && token.endsWith("__")) {
        pushSegment(token.slice(2, -2), { bold: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      if (token.startsWith("*") && token.endsWith("*") || token.startsWith("_") && token.endsWith("_")) {
        pushSegment(token.slice(1, -1), { italic: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        pushSegment(token.slice(1, -1));
        cursor = tokenPattern.lastIndex;
        continue;
      }
      const markdownLink = token.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
      if (markdownLink) {
        pushSegment(markdownLink[1], { link: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      const autoLink = token.match(/^<((?:https?:\/\/|mailto:)[^>\s]+)>$/);
      if (autoLink) {
        pushSegment(autoLink[1], { link: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      if (/^https?:\/\//.test(token)) {
        pushSegment(token, { link: true });
        cursor = tokenPattern.lastIndex;
        continue;
      }
      pushSegment(token);
      cursor = tokenPattern.lastIndex;
    }
    if (cursor < source.length) {
      pushSegment(source.slice(cursor));
    }
    return segments.map((segment) => __spreadProps(__spreadValues({}, segment), {
      text: segment.text.replace(/<\/?[^>]+>/g, "")
    })).filter((segment) => segment.text.length > 0);
  }
  function wrapInlineSegmentsForCanvas(segments, maxCharsPerLine, maxUnits) {
    const lines = [];
    let currentLine = [];
    let currentLen = 0;
    const isAttachPunctuation = (value) => /^[.,;:!?%)\]]+$/.test(String(value || ""));
    const flushLine = () => {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentLen = 0;
    };
    const appendToken = (tokenText, style) => {
      const text = String(tokenText || "");
      if (!text) return;
      const last = currentLine[currentLine.length - 1];
      if (last && isAttachPunctuation(text)) {
        last.text += text;
        currentLen += text.length;
        return;
      }
      if (last && Boolean(last.bold) === Boolean(style.bold) && Boolean(last.italic) === Boolean(style.italic) && Boolean(last.link) === Boolean(style.link)) {
        last.text += text;
      } else {
        currentLine.push({
          text,
          bold: Boolean(style.bold),
          italic: Boolean(style.italic),
          link: Boolean(style.link)
        });
      }
      currentLen += text.length;
    };
    const normalizedWidth = Math.max(12, Number(maxCharsPerLine || 72));
    const normalizedMaxUnits = Math.max(1, Number(maxUnits || 1));
    for (const segment of Array.isArray(segments) ? segments : []) {
      const tokens = String(segment.text || "").split(/(\s+)/g);
      for (const rawToken of tokens) {
        if (!rawToken) continue;
        const token = String(rawToken);
        if (!token.trim()) {
          const last = currentLine[currentLine.length - 1];
          if (last && !/\s$/.test(last.text)) {
            last.text += " ";
            currentLen += 1;
          }
          continue;
        }
        let remaining = token;
        while (remaining.length > 0) {
          if (lines.length >= normalizedMaxUnits) {
            break;
          }
          const available = Math.max(1, normalizedWidth - currentLen);
          if (remaining.length <= available) {
            appendToken(remaining, segment);
            remaining = "";
            continue;
          }
          if (currentLen > 0) {
            flushLine();
            if (lines.length >= normalizedMaxUnits) {
              break;
            }
            continue;
          }
          appendToken(remaining.slice(0, available), segment);
          remaining = remaining.slice(available);
          flushLine();
        }
      }
    }
    flushLine();
    const clamped = lines.slice(0, normalizedMaxUnits).map((line) => {
      const joined = line.map((segment) => segment.text).join("");
      if (joined.trim().length === 0) {
        return [];
      }
      return line;
    });
    return clamped.filter((line) => line.length > 0);
  }
  function sanitizeCanvasText(value, maxChars = 1800) {
    const text = String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/\r/g, "");
    if (text.length <= maxChars) {
      return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 1))}\u2026`;
  }
  var CANVAS_SAFE_LIMITS = Object.freeze({
    maxBlocks: 24,
    maxListItems: 36,
    maxListDepth: 5,
    headingChars: 220,
    paragraphChars: 900,
    quoteChars: 900,
    listItemChars: 320,
    tableChars: 1600,
    codeChars: 1600,
    genericChars: 900,
    languageChars: 24
  });
  function toCanvasSafeListItems(items, orderedFallback) {
    const out = [];
    const source = Array.isArray(items) ? items.slice(0, CANVAS_SAFE_LIMITS.maxListItems) : [];
    for (const item of source) {
      const normalized = readListItem(item);
      const depth = Math.max(
        1,
        Math.min(CANVAS_SAFE_LIMITS.maxListDepth, Number(normalized.depth || 1))
      );
      const content = sanitizeCanvasText(normalized.content || "", CANVAS_SAFE_LIMITS.listItemChars);
      if (!content) {
        continue;
      }
      out.push({
        content,
        depth,
        ordered: typeof normalized.ordered === "boolean" ? normalized.ordered : Boolean(orderedFallback),
        task: normalized.task && typeof normalized.task === "object" ? { checked: Boolean(normalized.task.checked) } : void 0
      });
    }
    return out;
  }
  function toCanvasSafePreviewBlocks(previewBlocks) {
    const safe = [];
    const source = Array.isArray(previewBlocks) ? previewBlocks : [];
    for (const raw of source.slice(0, CANVAS_SAFE_LIMITS.maxBlocks)) {
      const type = typeof (raw == null ? void 0 : raw.type) === "string" ? raw.type : "paragraph";
      if (type === "divider") {
        safe.push({ type: "divider" });
        continue;
      }
      if (type === "heading") {
        const content = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.headingChars);
        if (content) {
          safe.push({
            type: "heading",
            depth: Math.max(1, Math.min(6, Number((raw == null ? void 0 : raw.depth) || 1))),
            content
          });
        }
        continue;
      }
      if (type === "paragraph") {
        const content = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.paragraphChars);
        if (content) {
          safe.push({ type: "paragraph", content });
        }
        continue;
      }
      if (type === "blockquote") {
        const content = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.quoteChars);
        if (content) {
          safe.push({ type: "blockquote", content });
        }
        continue;
      }
      if (type === "list") {
        const ordered = Boolean(raw == null ? void 0 : raw.ordered);
        const items = toCanvasSafeListItems(raw == null ? void 0 : raw.items, ordered);
        if (items.length > 0) {
          safe.push({
            type: "list",
            ordered,
            start: Number.isFinite(Number(raw == null ? void 0 : raw.start)) && Number(raw.start) > 0 ? Number(raw.start) : 1,
            items
          });
        }
        continue;
      }
      if (type === "table") {
        const content = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.tableChars);
        if (content) {
          safe.push({ type: "table", content });
        }
        continue;
      }
      if (type === "code" || type === "text" || type === "mermaid") {
        const content = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.codeChars);
        if (content) {
          const language = sanitizeCanvasText(
            String((raw == null ? void 0 : raw.language) || (type === "mermaid" ? "mermaid" : "txt")).toLowerCase(),
            CANVAS_SAFE_LIMITS.languageChars
          );
          safe.push({
            type: "code",
            language: language || "txt",
            content
          });
        }
        continue;
      }
      const fallback = sanitizeCanvasText((raw == null ? void 0 : raw.content) || "", CANVAS_SAFE_LIMITS.genericChars);
      if (fallback) {
        safe.push({ type: "paragraph", content: fallback });
      }
    }
    return safe;
  }
  function toCanvasSafeEmbedBlock(block) {
    var _a, _b, _c, _d, _e;
    if (!block || typeof block !== "object") {
      return null;
    }
    const source = block.source && typeof block.source === "object" ? block.source : {};
    const sync = block.sync && typeof block.sync === "object" ? block.sync : {};
    const safePreviewBlocks = toCanvasSafePreviewBlocks((_a = block == null ? void 0 : block.preview) == null ? void 0 : _a.blocks);
    const previewKind = typeof ((_b = block == null ? void 0 : block.preview) == null ? void 0 : _b.kind) === "string" && block.preview.kind ? block.preview.kind : safePreviewBlocks.length > 0 ? "markdown" : "text";
    const fallbackSummary = buildPreviewSummaryFromBlock(block, {
      maxLines: 28,
      maxCharsPerLine: 96
    });
    const summary = sanitizeCanvasText(
      buildUiPreviewTextFromBlock(block, {
        maxChars: 2200
      }),
      1800
    );
    const finalSummary = summary || sanitizeCanvasText(fallbackSummary, 1e3);
    const safeWarnings = Array.isArray((_c = block == null ? void 0 : block.preview) == null ? void 0 : _c.warnings) ? block.preview.warnings.filter((item) => typeof item === "string" && item.trim()).slice(0, 8) : [];
    return jsonCloneSafe({
      sourceKey: toSafeString(block.sourceKey, ""),
      source: {
        owner: toSafeString(source.owner, "unknown"),
        repo: toSafeString(source.repo, "unknown"),
        ref: toSafeString(source.ref, "main"),
        path: toSafeString(source.path, "FileName.md")
      },
      previewSummary: finalSummary,
      preview: {
        kind: previewKind,
        blocks: safePreviewBlocks,
        warnings: safeWarnings,
        truncated: Boolean((_d = block == null ? void 0 : block.preview) == null ? void 0 : _d.truncated),
        progressive: Boolean((_e = block == null ? void 0 : block.preview) == null ? void 0 : _e.progressive)
      },
      sync: {
        status: toSafeString(sync.status, "idle"),
        mode: toSafeString(sync.mode, "manual"),
        lastSyncAt: sync.lastSyncAt || null,
        message: toSafeString(sync.message, ""),
        details: toSafeString(sync.details, ""),
        lastUpdatedAt: toSafeString(sync.lastUpdatedAt, (/* @__PURE__ */ new Date()).toISOString())
      },
      updatedAt: toSafeString(block.updatedAt, (/* @__PURE__ */ new Date()).toISOString())
    }, null);
  }
  function stripInlineMarkdown(value) {
    let text = String(value || "");
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "$1");
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "$1");
    text = text.replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, "$1");
    text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
    text = text.replace(/__([^_]+)__/g, "$1");
    text = text.replace(/\*([^*\n]+)\*/g, "$1");
    text = text.replace(/_([^_\n]+)_/g, "$1");
    text = text.replace(/`([^`]+)`/g, "$1");
    text = text.replace(/~~([^~]+)~~/g, "$1");
    text = text.replace(/<\/?[^>]+>/g, "");
    return text;
  }
  function extractStandaloneMarkdownLink(value) {
    const text = String(value || "").trim();
    const match = text.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
    if (!match) {
      return null;
    }
    const label = String(match[1] || "").trim();
    const href = String(match[2] || "").trim();
    if (!label || !href) {
      return null;
    }
    return { label, href };
  }
  function estimateCanvasPreviewBudgetHeight(blocks) {
    const blockCount = Math.max(1, Array.isArray(blocks) ? blocks.length : 0);
    return Math.max(
      520,
      Math.min(2200, 220 + blockCount * 38)
    );
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
  function clampCanvasTextContent(rawText, charsPerLine, maxUnits) {
    const input = String(rawText || "");
    if (!input || maxUnits <= 0) {
      return { text: "", units: 0 };
    }
    const maxChars = Math.max(16, charsPerLine);
    const sourceLines = input.split(/\r?\n/g);
    const out = [];
    let usedUnits = 0;
    for (const rawLine of sourceLines) {
      if (usedUnits >= maxUnits) {
        break;
      }
      const line = String(rawLine || "");
      if (!line.length) {
        out.push("");
        usedUnits += 1;
        continue;
      }
      let cursor = 0;
      while (cursor < line.length && usedUnits < maxUnits) {
        out.push(line.slice(cursor, cursor + maxChars));
        cursor += maxChars;
        usedUnits += 1;
      }
    }
    const wasTruncated = estimateCanvasUnitsFromText(input, charsPerLine) > usedUnits;
    if (wasTruncated && out.length > 0) {
      const lastIndex = out.length - 1;
      out[lastIndex] = clampText(out[lastIndex], Math.max(1, maxChars - 1));
      out[lastIndex] = `${out[lastIndex]}\u2026`;
    }
    const text = out.join("\n").trimEnd();
    return {
      text,
      units: Math.max(1, out.length || 1)
    };
  }
  function buildCanvasPreviewEntries(blocks, options = {}) {
    const sourceBlocks = Array.isArray(blocks) ? blocks : [];
    if (!sourceBlocks.length) return [];
    const width = Math.max(180, Number(options.width || CANVAS_SIZE_LIMITS.defaultWidth));
    const height = Math.max(120, Number(options.height || CANVAS_LAYOUT.previewPanel.renderBudgetHeight));
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
        const depth = Math.max(1, Math.min(6, Number(block.depth || 1)));
        const text = stripInlineMarkdown(block.content || "");
        const remainingUnits = Math.max(1, maxUnits - usedUnits);
        const clamped2 = clampCanvasTextContent(text, charsPerLine, remainingUnits);
        if (!clamped2.text) {
          break;
        }
        const headingStyles = {
          1: { fontSize: 30, fontWeight: 700 },
          2: { fontSize: 24, fontWeight: 700 },
          3: { fontSize: 20, fontWeight: 700 },
          4: { fontSize: 16, fontWeight: 700 },
          5: { fontSize: 14, fontWeight: 700 },
          6: { fontSize: 12, fontWeight: 600 }
        };
        if (!pushEntry(
          {
            type: "text",
            text: clamped2.text,
            style: __spreadProps(__spreadValues({}, headingStyles[depth] || headingStyles[6]), {
              fill: depth >= 6 ? "#57606A" : "#1F2328"
            })
          },
          clamped2.units
        )) {
          break;
        }
        if (depth <= 2 && usedUnits < maxUnits) {
          if (!pushEntry(
            {
              type: "divider"
            },
            1
          )) {
            break;
          }
        }
        continue;
      }
      if (type === "paragraph") {
        const markdownText = String(block.content || "");
        const standaloneLink = extractStandaloneMarkdownLink(markdownText);
        const segments = parseInlineMarkdownSegments(markdownText);
        const remainingUnits = Math.max(1, maxUnits - usedUnits);
        const richLines = wrapInlineSegmentsForCanvas(
          segments,
          charsPerLine,
          remainingUnits
        );
        if (richLines.length > 0) {
          if (!pushEntry(
            {
              type: "richtext",
              lines: richLines,
              style: {
                fontSize: 11,
                fill: "#1F2328"
              }
            },
            richLines.length
          )) {
            break;
          }
          continue;
        }
        const text = standaloneLink ? standaloneLink.label : stripInlineMarkdown(markdownText);
        const clamped2 = clampCanvasTextContent(text, charsPerLine, remainingUnits);
        if (!clamped2.text) {
          break;
        }
        if (!pushEntry(
          {
            type: "text",
            text: clamped2.text,
            style: {
              fontSize: 11,
              fill: standaloneLink ? "#0969DA" : "#1F2328"
            }
          },
          clamped2.units
        )) {
          break;
        }
        continue;
      }
      if (type === "blockquote") {
        const quote = stripInlineMarkdown(block.content || "");
        const text = quote || "";
        const remainingUnits = Math.max(1, maxUnits - usedUnits);
        const clamped2 = clampCanvasTextContent(text, charsPerLine, remainingUnits);
        if (!clamped2.text) {
          break;
        }
        if (!pushEntry(
          {
            type: "blockquote",
            text: clamped2.text,
            style: { fontSize: 11, fill: "#57606A" }
          },
          clamped2.units
        )) {
          break;
        }
        continue;
      }
      if (type === "list" && Array.isArray(block.items)) {
        const orderedCounters = {};
        const rootStart = Number.isFinite(Number(block.start)) && Number(block.start) > 0 ? Number(block.start) : 1;
        if (block.ordered) {
          orderedCounters[1] = rootStart - 1;
        }
        for (const item of block.items) {
          const normalized = readListItem(item);
          const indent = "  ".repeat(Math.max(0, normalized.depth - 1));
          const ordered = typeof normalized.ordered === "boolean" ? normalized.ordered : Boolean(block.ordered);
          const standaloneLink = extractStandaloneMarkdownLink(normalized.content);
          let prefix = normalized.task ? normalized.task.checked ? "\u2611" : "\u2610" : listBulletForDepth(normalized.depth);
          if (!normalized.task && ordered) {
            if (typeof orderedCounters[normalized.depth] !== "number") {
              orderedCounters[normalized.depth] = normalized.depth === 1 ? rootStart - 1 : 0;
            }
            orderedCounters[normalized.depth] = (orderedCounters[normalized.depth] || 0) + 1;
            for (const depthKey of Object.keys(orderedCounters)) {
              if (Number(depthKey) > normalized.depth) {
                delete orderedCounters[depthKey];
              }
            }
            prefix = `${orderedCounters[normalized.depth]}.`;
          }
          const line = `${indent}${prefix} ${stripInlineMarkdown(
            standaloneLink ? standaloneLink.label : normalized.content
          )}`;
          const remainingUnits = Math.max(1, maxUnits - usedUnits);
          const clamped2 = clampCanvasTextContent(line, charsPerLine, remainingUnits);
          if (!clamped2.text) {
            break;
          }
          if (!pushEntry(
            {
              type: "text",
              text: clamped2.text,
              style: {
                fontSize: 11,
                fill: standaloneLink ? "#0969DA" : "#1F2328"
              }
            },
            clamped2.units
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
        const clamped2 = clampCanvasTextContent(
          fallback2,
          charsPerLine,
          Math.max(1, maxUnits - usedUnits)
        );
        if (!clamped2.text) {
          break;
        }
        if (!pushEntry(
          {
            type: "text",
            text: clamped2.text,
            style: { fontSize: 10, fill: "#57606A" }
          },
          clamped2.units
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
        const clamped2 = clampCanvasTextContent(
          payload,
          charsPerLine,
          Math.max(1, maxUnits - usedUnits)
        );
        if (!clamped2.text) {
          break;
        }
        if (!pushEntry(
          {
            type: "code",
            text: clamped2.text,
            style: { fontSize: 10, fill: "#1F2328" }
          },
          clamped2.units
        )) {
          break;
        }
        continue;
      }
      const fallback = stripInlineMarkdown((block == null ? void 0 : block.content) || "");
      const clamped = clampCanvasTextContent(
        fallback,
        charsPerLine,
        Math.max(1, maxUnits - usedUnits)
      );
      if (!clamped.text) {
        break;
      }
      if (!pushEntry(
        {
          type: "text",
          text: clamped.text,
          style: { fontSize: 11, fill: "#1F2328" }
        },
        clamped.units
      )) {
        break;
      }
    }
    if (usedUnits >= maxUnits && out.length > 0) {
      out.push({
        type: "text",
        text: "\u2026",
        style: { fontSize: 10, fill: "#57606A" }
      });
    }
    return out;
  }
  function renderCanvasPreviewEntry(entry, previewContentWidth) {
    var _a, _b, _c, _d, _e, _f;
    if ((entry == null ? void 0 : entry.type) === "divider") {
      return h(AutoLayout, {
        width: previewContentWidth,
        height: CANVAS_LAYOUT.divider.thickness,
        fill: "#D0D7DE"
      });
    }
    if ((entry == null ? void 0 : entry.type) === "blockquote") {
      return h(
        Text,
        {
          fontSize: ((_a = entry == null ? void 0 : entry.style) == null ? void 0 : _a.fontSize) || 11,
          fill: ((_b = entry == null ? void 0 : entry.style) == null ? void 0 : _b.fill) || "#57606A",
          width: previewContentWidth
        },
        `\u2502 ${String((entry == null ? void 0 : entry.text) || "")}`
      );
    }
    if ((entry == null ? void 0 : entry.type) === "table" && Array.isArray(entry.header)) {
      const colCount = Math.max(1, entry.header.length);
      const tableWidth = previewContentWidth;
      const cellWidth = Math.max(56, Math.floor(tableWidth / colCount));
      const renderRow = (cells, isHeader) => h(
        AutoLayout,
        {
          direction: "horizontal",
          spacing: CANVAS_LAYOUT.table.rowSpacing,
          width: tableWidth,
          fill: isHeader ? "#F6F8FA" : "#FFFFFF"
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
              stroke: "#D0D7DE",
              strokeWidth: CANVAS_LAYOUT.table.borderWidth
            },
            h(
              Text,
              {
                fontSize: isHeader ? 10 : 9,
                fontWeight: isHeader ? 600 : 400,
                fill: "#1F2328",
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
      const codeBlockWidth = previewContentWidth;
      return h(
        AutoLayout,
        {
          direction: "vertical",
          width: codeBlockWidth,
          padding: CANVAS_LAYOUT.code.padding,
          fill: "#F6F8FA",
          stroke: "#D0D7DE",
          strokeWidth: CANVAS_LAYOUT.code.borderWidth,
          cornerRadius: CANVAS_LAYOUT.code.cornerRadius
        },
        h(
          Text,
          {
            fontSize: 10,
            fill: ((_c = entry == null ? void 0 : entry.style) == null ? void 0 : _c.fill) || "#1F2328",
            width: codeBlockWidth - CANVAS_LAYOUT.code.padding * 2
          },
          String((entry == null ? void 0 : entry.text) || "")
        )
      );
    }
    if ((entry == null ? void 0 : entry.type) === "richtext" && Array.isArray(entry == null ? void 0 : entry.lines)) {
      const lineSpacing = 2;
      return h(
        AutoLayout,
        {
          direction: "vertical",
          width: previewContentWidth,
          spacing: lineSpacing
        },
        ...entry.lines.map(
          (line) => h(
            AutoLayout,
            {
              direction: "horizontal",
              width: previewContentWidth,
              spacing: 4,
              wrap: true
            },
            ...line.map(
              (segment) => {
                var _a2, _b2;
                return h(
                  Text,
                  {
                    fontSize: ((_a2 = entry == null ? void 0 : entry.style) == null ? void 0 : _a2.fontSize) || 11,
                    fontWeight: (segment == null ? void 0 : segment.bold) ? 700 : 400,
                    italic: Boolean(segment == null ? void 0 : segment.italic),
                    fill: (segment == null ? void 0 : segment.link) ? "#0969DA" : ((_b2 = entry == null ? void 0 : entry.style) == null ? void 0 : _b2.fill) || "#1F2328"
                  },
                  String((segment == null ? void 0 : segment.text) || "")
                );
              }
            )
          )
        )
      );
    }
    return h(
      Text,
      {
        fontSize: ((_d = entry == null ? void 0 : entry.style) == null ? void 0 : _d.fontSize) || 10,
        fontWeight: ((_e = entry == null ? void 0 : entry.style) == null ? void 0 : _e.fontWeight) || 400,
        fill: ((_f = entry == null ? void 0 : entry.style) == null ? void 0 : _f.fill) || "#1F2328",
        width: previewContentWidth
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
    var _a, _b, _c, _d;
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
      var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m;
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
          currentEmbedBlock: null,
          currentSnapshot: null,
          patStore,
          mode
        });
        if (!pipeline.ok) {
          if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
          }
          if ((_b2 = pipeline.value) == null ? void 0 : _b2.embedBlock) {
            const safeEmbedBlock2 = toCanvasSafeEmbedBlock(pipeline.value.embedBlock);
            if (safeEmbedBlock2) {
              setEmbedBlock(safeEmbedBlock2);
              setEmbedSnapshot(null);
            } else {
              setEmbedBlock(null);
              setEmbedSnapshot(null);
            }
          }
          const runtimeError = resolveRuntimeError(pipeline.error, pipeline.auth);
          const nextAuthContext = runtimeError.authRequired && runtimeError.sourceKey ? {
            sourceKey: runtimeError.sourceKey,
            code: runtimeError.code,
            url: normalizedUrl
          } : null;
          setAuthContext(nextAuthContext);
          const lastResult2 = buildLastResult(
            (_c2 = pipeline.value) == null ? void 0 : _c2.snapshot,
            (_d2 = pipeline.value) == null ? void 0 : _d2.embedBlock
          );
          setStatus(`Sync error: ${runtimeError.code}`);
          postRuntimeStatus("error", runtimeError.message, runtimeError.details, __spreadValues({
            code: runtimeError.code,
            sourceKey: runtimeError.sourceKey,
            authRequired: runtimeError.authRequired,
            syncState: ((_g = (_f = (_e = pipeline.value) == null ? void 0 : _e.embedBlock) == null ? void 0 : _f.sync) == null ? void 0 : _g.status) || "error",
            lastResult: lastResult2,
            progressPercent: 100,
            previewSummary: buildUiPreviewTextFromBlock((_h = pipeline.value) == null ? void 0 : _h.embedBlock, {
              maxChars: 2e5
            })
          }, buildUiPreviewPayload((_i = pipeline.value) == null ? void 0 : _i.embedBlock)));
          if (mode === SYNC_MODE.MANUAL) {
            figma.notify(runtimeError.message, { error: true });
          }
          return pipeline;
        }
        setLastUrl(normalizedUrl);
        const safeEmbedBlock = toCanvasSafeEmbedBlock(pipeline.value.embedBlock);
        if (safeEmbedBlock) {
          setEmbedBlock(safeEmbedBlock);
          setEmbedSnapshot(null);
        } else {
          setEmbedBlock(null);
          setEmbedSnapshot(null);
        }
        setAuthContext(null);
        const lastResult = buildLastResult(pipeline.value.snapshot, pipeline.value.embedBlock);
        const successMessage = mode === SYNC_MODE.AUTO ? "Auto-sync completed." : "Preview created.";
        setStatus(mode === SYNC_MODE.AUTO ? `Auto-sync ready (${trigger})` : `Preview ready (${trigger})`);
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        postRuntimeStatus("success", successMessage, "", __spreadValues({
          syncState: ((_k = (_j = pipeline.value.embedBlock) == null ? void 0 : _j.sync) == null ? void 0 : _k.status) || "success",
          lastResult,
          progressPercent: 100,
          previewSummary: buildUiPreviewTextFromBlock((_l = pipeline.value) == null ? void 0 : _l.embedBlock, {
            maxChars: 2e5
          })
        }, buildUiPreviewPayload((_m = pipeline.value) == null ? void 0 : _m.embedBlock)));
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
        }
      ],
      async (event) => {
        const propertyName = typeof (event == null ? void 0 : event.propertyName) === "string" ? event.propertyName : "";
        if (propertyName === PROPERTY_ACTION.OPEN_URL || propertyName === "open-url") {
          const uiTask = ensureUiSessionTask();
          await (async () => {
            try {
              openWidgetUi();
            } catch (error) {
              const detail = error && typeof error.message === "string" ? error.message : String(error);
              setStatus("Could not open URL input");
              figma.notify(`Could not open URL input: ${detail}`, { error: true });
              endUiSessionTask();
              return;
            }
            await Promise.resolve();
            postWidgetContextToUi();
            void maybeRunAutoRefresh("open-url");
          })();
          return uiTask;
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
        if (propertyName === PROPERTY_ACTION.WIDTH_DEC || propertyName === PROPERTY_ACTION.WIDTH_INC) {
          const baseSize = canvasSize && typeof canvasSize === "object" ? clampCanvasSize(canvasSize) : clampCanvasSize();
          const widthDelta = propertyName === PROPERTY_ACTION.WIDTH_INC ? CANVAS_SIZE_LIMITS.widthStep : propertyName === PROPERTY_ACTION.WIDTH_DEC ? -CANVAS_SIZE_LIMITS.widthStep : 0;
          const nextSize = clampCanvasSize({
            width: baseSize.width + widthDelta
          });
          setCanvasSize(nextSize);
          setStatus(`Canvas width resized: ${nextSize.width}`);
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
    });
    const effectiveCanvasSize = canvasSize && typeof canvasSize === "object" ? clampCanvasSize(canvasSize) : clampCanvasSize();
    const sourceOwner = toSafeString((_a = embedBlock == null ? void 0 : embedBlock.source) == null ? void 0 : _a.owner, "RepoOwner");
    const sourceRepo = toSafeString((_b = embedBlock == null ? void 0 : embedBlock.source) == null ? void 0 : _b.repo, "RepoName");
    const ownerRepo = `${sourceOwner}/${sourceRepo}`;
    const sourcePath = toSafeString((_c = embedBlock == null ? void 0 : embedBlock.source) == null ? void 0 : _c.path, "FileName.md");
    const fileNameParts = String(sourcePath || "").split("/").filter(Boolean);
    const fileName = fileNameParts[fileNameParts.length - 1] || "FileName.md";
    const repoLabel = `${ownerRepo} \xB7 ${sourcePath}`;
    const previewSummary = buildUiPreviewTextFromBlock(embedBlock, {
      maxChars: 2e5
    });
    const hasUrl = typeof lastUrl === "string" && lastUrl.trim().length > 0;
    const panelWidth = Math.max(
      200,
      effectiveCanvasSize.width - CANVAS_LAYOUT.root.padding * 2
    );
    const previewPanelHeight = hasUrl ? null : CANVAS_LAYOUT.previewPanel.emptyStateHeight;
    const previewContentWidth = Math.max(
      120,
      panelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal
    );
    const safeCanvasBlocks = Array.isArray((_d = embedBlock == null ? void 0 : embedBlock.preview) == null ? void 0 : _d.blocks) ? embedBlock.preview.blocks : [];
    const previewBudgetHeight = hasUrl ? estimateCanvasPreviewBudgetHeight(safeCanvasBlocks) : CANVAS_LAYOUT.previewPanel.emptyStateHeight;
    const previewContentHeight = Math.max(
      hasUrl ? 120 : 36,
      previewBudgetHeight - CANVAS_LAYOUT.previewPanel.padding * 2
    );
    const canvasPreviewEntries = hasUrl ? buildCanvasPreviewEntries(safeCanvasBlocks, {
      width: previewContentWidth,
      height: previewContentHeight
    }) : [];
    const hasCanvasPreviewEntries = canvasPreviewEntries.length > 0;
    const canvasPreviewText = fitPreviewTextForCanvas(previewSummary, {
      width: previewContentWidth,
      height: previewContentHeight
    });
    const hasPreviewText = Boolean(canvasPreviewText.trim());
    const fallbackPreviewLabel = !hasUrl ? "Set a GitHub URL to preview the document or file." : hasPreviewText ? canvasPreviewText : "Preview unavailable for this Markdown content.";
    return h(
      AutoLayout,
      {
        direction: "vertical",
        width: effectiveCanvasSize.width,
        spacing: CANVAS_LAYOUT.root.spacing,
        padding: CANVAS_LAYOUT.root.padding,
        fill: "#FFFFFF"
      },
      h(Text, { fontSize: 11, fill: "#57606A" }, repoLabel),
      h(Text, { fontSize: 36, fontWeight: 700, fill: "#1F2328" }, fileName),
      h(
        AutoLayout,
        __spreadProps(__spreadValues({
          direction: "vertical",
          width: panelWidth,
          spacing: CANVAS_LAYOUT.previewPanel.spacing,
          padding: CANVAS_LAYOUT.previewPanel.padding
        }, previewPanelHeight ? { height: previewPanelHeight } : {}), {
          fill: "#FFFFFF",
          cornerRadius: CANVAS_LAYOUT.previewPanel.cornerRadius,
          stroke: "#D0D7DE",
          strokeWidth: 1
        }),
        !hasUrl || !hasCanvasPreviewEntries ? h(
          Text,
          {
            fontSize: 11,
            fill: "#656D76",
            width: previewContentWidth
          },
          sanitizeCanvasText(fallbackPreviewLabel, 2400)
        ) : h(
          AutoLayout,
          {
            direction: "vertical",
            width: previewContentWidth,
            spacing: 8
          },
          ...canvasPreviewEntries.map(
            (entry) => renderCanvasPreviewEntry(entry, previewContentWidth)
          )
        )
      )
    );
  }
  widget.register(GitHubPreviewWidget);
})();
