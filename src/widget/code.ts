// @ts-nocheck

const { parseUiCommand } = require("./bridge/parseUiCommand.ts");
const { UI_COMMAND, UI_EVENT } = require("./bridge/messages.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("./runtime/createOrRefreshEmbedFromUrl.ts");
const {
  createPatSessionStore,
  loadPatSessionStore,
} = require("./runtime/patSessionStore.ts");
const { redactSensitive } = require("./runtime/redactSensitive.ts");
const {
  createSyncCoordinator,
  shouldRunAutoRefresh,
} = require("./runtime/syncCoordinator.ts");
const { SYNC_MODE } = require("../core/canvas/types.ts");

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useEffect,
  usePropertyMenu,
  useSyncedState,
  waitForTask,
  h,
} = widget;

const AUTH_ERROR_CODES = Object.freeze({
  MISSING_PAT: "MISSING_PAT",
  EXPIRED_PAT: "EXPIRED_PAT",
  CURRENT_PAT: "CURRENT_PAT",
});

const AUTH_MESSAGES = Object.freeze({
  [AUTH_ERROR_CODES.MISSING_PAT]:
    "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.",
  [AUTH_ERROR_CODES.EXPIRED_PAT]:
    "Tu personal access token es invalido o ha expirado.",
  [AUTH_ERROR_CODES.CURRENT_PAT]:
    "Tu personal access token no tiene permisos/scope suficiente.",
});

const PROPERTY_ACTION = Object.freeze({
  OPEN_URL: "open_url",
  REFRESH_NOW: "refresh_now",
  WIDTH_DEC: "width_dec",
  WIDTH_INC: "width_inc",
  HEIGHT_DEC: "height_dec",
  HEIGHT_INC: "height_inc",
});

const syncCoordinator = createSyncCoordinator({ cooldownMs: 60_000 });

const CANVAS_SIZE_LIMITS = Object.freeze({
  minWidth: 320,
  maxWidth: 1800,
  minHeight: 220,
  maxHeight: 2200,
  defaultWidth: 760,
  defaultHeight: 920,
  widthStep: 120,
  heightStep: 120,
});

const CANVAS_LAYOUT = Object.freeze({
  root: {
    spacing: 8,
    padding: 12,
    cornerRadius: 8,
  },
  previewPanel: {
    spacing: 8,
    padding: 12,
    cornerRadius: 8,
    insetHorizontal: 16,
  },
  divider: {
    thickness: 1,
  },
  table: {
    rowSpacing: 0,
    stackSpacing: 0,
    cellPaddingVertical: 3,
    cellPaddingHorizontal: 4,
    borderWidth: 0.5,
  },
  code: {
    padding: 12,
    cornerRadius: 8,
    borderWidth: 0.5,
  },
});

let runtimePatStorePromise = null;
let autoRefreshBootstrapped = false;
let lastUiOpenNonce = 0;
let lastUiReadyNonce = 0;
let uiSessionPromise = null;
let resolveUiSession = null;

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
      cipherKey: "github-preview-widget/phase-7",
    }).catch(() => createPatSessionStore());
  }
  return runtimePatStorePromise;
}

function openWidgetUi() {
  const bundledHtml =
    typeof __widget_ui_html__ === "string" && __widget_ui_html__.trim().length > 0
      ? __widget_ui_html__
      : "";
  const runtimeHtml =
    typeof __html__ === "string" && __html__.trim().length > 0 ? __html__ : "";
  const html =
    bundledHtml ||
    runtimeHtml ||
    "<!doctype html><html><body><p>UI not available.</p></body></html>";

  figma.showUI(html, {
    width: 420,
    height: 420,
    visible: true,
  });

  const uiVisible =
    figma.ui && typeof figma.ui.visible === "boolean" ? String(figma.ui.visible) : "unknown";
  figma.notify(`UI visible: ${uiVisible}`);

  const openNonce = ++lastUiOpenNonce;
  setTimeout(() => {
    if (lastUiReadyNonce < openNonce) {
      figma.notify("UI opened but did not initialize.", { error: true });
    }
  }, 900);
}

function deriveSourceKey(url, embedBlock, embedSnapshot, authContext) {
  if (typeof embedBlock?.sourceKey === "string" && embedBlock.sourceKey) {
    return embedBlock.sourceKey;
  }
  if (typeof embedSnapshot?.sourceKey === "string" && embedSnapshot.sourceKey) {
    return embedSnapshot.sourceKey;
  }
  if (typeof authContext?.sourceKey === "string" && authContext.sourceKey) {
    return authContext.sourceKey;
  }
  if (typeof url === "string") {
    return url.trim();
  }
  return "";
}

function buildLastResult(snapshot, embedBlock) {
  const snapshotLast = snapshot?.lastResult;
  if (snapshotLast && typeof snapshotLast === "object") {
    return {
      status: snapshotLast.status || "idle",
      mode: snapshotLast.mode || "manual",
      message: snapshotLast.message || "",
      details: snapshotLast.details || "",
      at: snapshotLast.at || snapshot?.updatedAt || new Date().toISOString(),
    };
  }

  const sync = embedBlock?.sync || {};
  return {
    status: sync.status || "idle",
    mode: sync.mode || "manual",
    message: sync.message || "",
    details: sync.details || "",
    at: sync.lastUpdatedAt || new Date().toISOString(),
  };
}

function clampText(value, maxChars) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
}

function splitLines(value, maxLines, maxCharsPerLine) {
  const input = typeof value === "string" ? value : "";
  if (!input) return [];
  return input
    .split(/\r?\n/)
    .map((line) => clampText(line, maxCharsPerLine))
    .filter(Boolean)
    .slice(0, maxLines);
}

function readListItem(listItem) {
  if (listItem && typeof listItem === "object") {
    return {
      content: String(listItem.content || ""),
      depth: Math.max(1, Number(listItem.depth || 1)),
    };
  }

  return {
    content: String(listItem || ""),
    depth: 1,
  };
}

function listBulletForDepth(depth) {
  if (depth <= 1) return "•";
  if (depth === 2) return "◦";
  return "▪";
}

function toPreviewLines(blocks, options = {}) {
  const maxLines = Number(options.maxLines || 12);
  const maxCharsPerLine = Number(options.maxCharsPerLine || 92);
  const out = [];

  for (const block of Array.isArray(blocks) ? blocks : []) {
    if (out.length >= maxLines) break;
    const type = typeof block?.type === "string" ? block.type : "unknown";

    if (type === "heading") {
      out.push(clampText(`# ${block.content || ""}`, maxCharsPerLine));
      continue;
    }

    if (type === "paragraph") {
      const lines = splitLines(block.content, 2, maxCharsPerLine);
      out.push(...lines);
      continue;
    }

    if (type === "list" && Array.isArray(block.items)) {
      const orderedCounters = {};
      for (const item of block.items.slice(0, 3)) {
        if (out.length >= maxLines) break;
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
      out.push(clampText("────────────────────────", maxCharsPerLine));
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

    const fallback = clampText(block?.content || "", maxCharsPerLine);
    if (fallback) {
      out.push(fallback);
    }
  }

  return out.slice(0, maxLines);
}

function buildPreviewSummaryFromBlock(block, options = {}) {
  const lines = toPreviewLines(block?.preview?.blocks, options);
  if (!Array.isArray(lines) || lines.length === 0) {
    return "";
  }
  return lines.join("\n");
}

function buildUiPreviewTextFromBlock(block, options = {}) {
  const maxChars =
    Number.isFinite(Number(options.maxChars)) && Number(options.maxChars) > 0
      ? Number(options.maxChars)
      : 200_000;
  const parts = [];
  const blocks = Array.isArray(block?.preview?.blocks) ? block.preview.blocks : [];

  for (const item of blocks) {
    const type = typeof item?.type === "string" ? item.type : "";

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
      const language =
        typeof item.language === "string" && item.language ? item.language : "txt";
      parts.push(`\`\`\`${language}`);
      parts.push(String(item.content || ""));
      parts.push("```");
      continue;
    }

    if (typeof item?.content === "string" && item.content) {
      parts.push(item.content);
    }
  }

  let text = parts.join("\n\n").trim();
  if (!text) {
    return "";
  }

  if (text.length > maxChars) {
    text = `${text.slice(0, maxChars)}\n\n[preview truncated in UI]`;
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
    out[maxLines - 1] = `${out[maxLines - 1]}…`;
  }

  return out.join("\n");
}

function buildUiPreviewPayload(block) {
  const preview = block?.preview || {};
  return {
    previewKind: typeof preview.kind === "string" && preview.kind ? preview.kind : "text",
    previewBlocks: Array.isArray(preview.blocks) ? preview.blocks : [],
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
  const lines = String(content || "")
    .split(/\r?\n/g)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length < 2) return null;
  const divider = lines[1].replace(/\|/g, "").trim();
  if (!/^[:\-\s]+$/.test(divider)) return null;

  const parseRow = (line) =>
    stripInlineMarkdown(line)
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

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
    rows,
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
    const type = typeof block?.type === "string" ? block.type : "text";

    if (type === "heading") {
      const text = stripInlineMarkdown(block.content || "");
      if (
        !pushEntry(
          {
            type: "text",
            text,
            style: { fontSize: 11, fontWeight: 700, fill: "#111827" },
          },
          estimateCanvasUnitsFromText(text, charsPerLine)
        )
      ) {
        break;
      }
      continue;
    }

    if (type === "paragraph") {
      const text = stripInlineMarkdown(block.content || "");
      if (
        !pushEntry(
          {
            type: "text",
            text,
            style: { fontSize: 10, fill: "#1F2937" },
          },
          estimateCanvasUnitsFromText(text, charsPerLine)
        )
      ) {
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
        if (
          !pushEntry(
            {
              type: "text",
              text: line,
              style: { fontSize: 10, fill: "#1F2937" },
            },
            estimateCanvasUnitsFromText(line, charsPerLine)
          )
        ) {
          break;
        }
      }
      continue;
    }

    if (type === "table") {
      const remainingUnits = Math.max(2, maxUnits - usedUnits);
      const table = parseCanvasTable(block.content, {
        maxCols: Math.max(2, Math.min(6, Math.floor(width / 140))),
        maxRows: Math.max(1, remainingUnits - 1),
      });

      if (table && table.header.length > 0) {
        if (
          !pushEntry(
            {
              type: "table",
              header: table.header,
              rows: table.rows,
            },
            1 + table.rows.length
          )
        ) {
          break;
        }
        continue;
      }

      const fallback = stripInlineMarkdown(block.content || "");
      if (
        !pushEntry(
          {
            type: "text",
            text: fallback,
            style: { fontSize: 9, fill: "#334155" },
          },
          estimateCanvasUnitsFromText(fallback, charsPerLine)
        )
      ) {
        break;
      }
      continue;
    }

    if (type === "divider") {
      if (
        !pushEntry(
          {
            type: "divider",
          },
          1
        )
      ) {
        break;
      }
      continue;
    }

    if (type === "code" || type === "text" || type === "mermaid") {
      const language =
        typeof block.language === "string" && block.language
          ? block.language
          : type === "mermaid"
            ? "mermaid"
            : "txt";
      const content = String(block.content || "");
      const payload = `[${language}]\n${content}`;
      if (
        !pushEntry(
          {
            type: "code",
            text: payload,
            style: { fontSize: 9, fill: "#0F172A" },
          },
          estimateCanvasUnitsFromText(payload, charsPerLine)
        )
      ) {
        break;
      }
      continue;
    }

    const fallback = stripInlineMarkdown(block?.content || "");
    if (
      !pushEntry(
        {
          type: "text",
          text: fallback,
          style: { fontSize: 10, fill: "#1F2937" },
        },
        estimateCanvasUnitsFromText(fallback, charsPerLine)
      )
    ) {
      break;
    }
  }

  if (usedUnits >= maxUnits && out.length > 0) {
    out.push({
      type: "text",
      text: "…",
      style: { fontSize: 10, fill: "#64748B" },
    });
  }

  return out;
}

function renderCanvasPreviewEntry(entry, previewPanelWidth) {
  if (entry?.type === "divider") {
    return h(AutoLayout, {
      width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
      height: CANVAS_LAYOUT.divider.thickness,
      fill: "#CBD5E1",
    });
  }

  if (entry?.type === "table" && Array.isArray(entry.header)) {
    const colCount = Math.max(1, entry.header.length);
    const tableWidth = previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal;
    const cellWidth = Math.max(56, Math.floor(tableWidth / colCount));
    const renderRow = (cells, isHeader) =>
      h(
        AutoLayout,
        {
          direction: "horizontal",
          spacing: CANVAS_LAYOUT.table.rowSpacing,
          width: tableWidth,
          fill: isHeader ? "#F1F5F9" : "#FFFFFF",
        },
        ...cells.map((cell) =>
          h(
            AutoLayout,
            {
              width: cellWidth,
              padding: {
                vertical: CANVAS_LAYOUT.table.cellPaddingVertical,
                horizontal: CANVAS_LAYOUT.table.cellPaddingHorizontal,
              },
              stroke: "#CBD5E1",
              strokeWidth: CANVAS_LAYOUT.table.borderWidth,
            },
            h(
              Text,
              {
                fontSize: isHeader ? 9 : 8,
                fontWeight: isHeader ? 600 : 400,
                fill: "#0F172A",
                width:
                  cellWidth -
                  CANVAS_LAYOUT.table.cellPaddingHorizontal * 2,
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
        width: tableWidth,
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

  if (entry?.type === "code") {
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
        cornerRadius: CANVAS_LAYOUT.code.cornerRadius,
      },
      h(
        Text,
        {
          fontSize: 9,
          fill: entry?.style?.fill || "#0F172A",
          width: codeBlockWidth - CANVAS_LAYOUT.code.padding * 2,
        },
        String(entry?.text || "")
      )
    );
  }

  return h(
    Text,
    {
      fontSize: entry?.style?.fontSize || 10,
      fontWeight: entry?.style?.fontWeight || 400,
      fill: entry?.style?.fill || "#2F2F2F",
      width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
    },
    String(entry?.text || "")
  );
}

function postToUiSafely(payload) {
  try {
    figma.ui.postMessage(payload);
    return true;
  } catch (error) {
    const message =
      error && typeof error.message === "string" ? error.message : String(error);
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
  const code =
    typeof pipelineError?.code === "string" && pipelineError.code
      ? pipelineError.code
      : "UNKNOWN";
  const authMessage = AUTH_MESSAGES[code];
  const message =
    authMessage ||
    (typeof pipelineError?.message === "string" && pipelineError.message) ||
    "Could not create preview from this URL.";
  const details =
    typeof pipelineError?.details === "string" && pipelineError.details
      ? redactSensitive(pipelineError.details)
      : "";
  const sourceKey =
    typeof auth?.sourceKey === "string" && auth.sourceKey ? auth.sourceKey : null;

  return {
    code,
    message: redactSensitive(message),
    details,
    sourceKey,
    authRequired: Boolean(authMessage),
  };
}

function GitHubPreviewWidget() {
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
    const previewSummary = buildUiPreviewTextFromBlock(embedBlock, {
      maxChars: 200_000,
    });
    const previewPayload = buildUiPreviewPayload(embedBlock);
    const syncState = embedBlock?.sync?.status || "idle";
    postToUiSafely({
      type: UI_EVENT.WIDGET_CONTEXT,
      widgetId: "active-widget",
      lastUrl,
      status,
      authContext,
      lastResult: buildLastResult(embedSnapshot, embedBlock),
      syncState,
      progressPercent: deriveProgressPercent(syncState),
      previewSummary,
      ...previewPayload,
    });
  }

  function postRuntimeStatus(level, message, details = "", extras = {}) {
    const hasPreviewSummary = typeof extras?.previewSummary === "string";
    const hasPreviewBlocks = Array.isArray(extras?.previewBlocks);
    const hasPreviewKind = typeof extras?.previewKind === "string";
    const fallbackPreviewPayload = buildUiPreviewPayload(embedBlock);
    postToUiSafely({
      type: UI_EVENT.RUNTIME_STATUS,
      level,
      message,
      details,
      previewSummary: hasPreviewSummary
        ? extras.previewSummary
        : buildUiPreviewTextFromBlock(embedBlock, {
          maxChars: 200_000,
        }),
      previewKind: hasPreviewKind ? extras.previewKind : fallbackPreviewPayload.previewKind,
      previewBlocks: hasPreviewBlocks
        ? extras.previewBlocks
        : fallbackPreviewPayload.previewBlocks,
      ...extras,
    });
  }

  async function runPreviewPipeline(url, trigger, options = {}) {
    const mode = options.mode === SYNC_MODE.AUTO ? SYNC_MODE.AUTO : SYNC_MODE.MANUAL;
    const normalizedUrl = typeof url === "string" ? url.trim() : "";
    if (!normalizedUrl) {
      setStatus("Sync error: MISSING_URL");
      postRuntimeStatus("error", "A GitHub file URL is required.");
      return { ok: false, skipped: true };
    }

    const sourceKeyForRun =
      typeof options.sourceKey === "string" && options.sourceKey
        ? options.sourceKey
        : deriveSourceKey(normalizedUrl, embedBlock, embedSnapshot, authContext);

    let lockAcquired = false;
    const loadingMessage = mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...";
    let progressPercent = mode === SYNC_MODE.AUTO ? 12 : 8;
    let progressTimer = null;
    const pushProgress = () =>
      postRuntimeStatus("loading", loadingMessage, "", {
        progressPercent,
      });

    if (!options.skipManualLock) {
      const lock = syncCoordinator.beginManual({
        sourceKey: sourceKeyForRun,
        syncStatus: embedBlock?.sync?.status,
      });

      if (!lock.ok) {
        setStatus("Syncing...");
        postRuntimeStatus("loading", "Syncing...", "", {
          reason: lock.reason,
          progressPercent: 25,
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
        mode,
      });

      if (!pipeline.ok) {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        if (pipeline.value?.embedBlock) {
          setEmbedBlock(pipeline.value.embedBlock);
        }
        if (pipeline.value?.snapshot) {
          setEmbedSnapshot(pipeline.value.snapshot);
        }

        const runtimeError = resolveRuntimeError(pipeline.error, pipeline.auth);
        const nextAuthContext =
          runtimeError.authRequired && runtimeError.sourceKey
            ? {
              sourceKey: runtimeError.sourceKey,
              code: runtimeError.code,
              url: normalizedUrl,
            }
            : null;
        setAuthContext(nextAuthContext);

        const lastResult = buildLastResult(
          pipeline.value?.snapshot,
          pipeline.value?.embedBlock
        );

        setStatus(`Sync error: ${runtimeError.code}`);
        postRuntimeStatus("error", runtimeError.message, runtimeError.details, {
          code: runtimeError.code,
          sourceKey: runtimeError.sourceKey,
          authRequired: runtimeError.authRequired,
          syncState: pipeline.value?.embedBlock?.sync?.status || "error",
          lastResult,
          progressPercent: 100,
          previewSummary: buildUiPreviewTextFromBlock(pipeline.value?.embedBlock, {
            maxChars: 200_000,
          }),
          ...buildUiPreviewPayload(pipeline.value?.embedBlock),
        });

        if (mode === SYNC_MODE.MANUAL) {
          figma.notify(runtimeError.message, { error: true });
        }
        return pipeline;
      }

      setLastUrl(normalizedUrl);
      setEmbedBlock(pipeline.value.embedBlock);
      setEmbedSnapshot(pipeline.value.snapshot);
      setAuthContext(null);

      const lastResult = buildLastResult(pipeline.value.snapshot, pipeline.value.embedBlock);
      const successMessage =
        mode === SYNC_MODE.AUTO ? "Auto-sync completed." : "Preview created.";

      setStatus(mode === SYNC_MODE.AUTO ? `Auto-sync ready (${trigger})` : `Preview ready (${trigger})`);
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      postRuntimeStatus("success", successMessage, "", {
        syncState: pipeline.value.embedBlock?.sync?.status || "success",
        lastResult,
        progressPercent: 100,
        previewSummary: buildUiPreviewTextFromBlock(pipeline.value?.embedBlock, {
          maxChars: 200_000,
        }),
        ...buildUiPreviewPayload(pipeline.value?.embedBlock),
      });

      if (mode === SYNC_MODE.MANUAL) {
        figma.notify("Preview created.");
      }

      return pipeline;
    } catch (error) {
      const details =
        error && typeof error.message === "string" ? error.message : String(error);
      const message = "Unexpected pipeline failure.";
      setStatus("Sync error: UNEXPECTED");
      postRuntimeStatus("error", message, details, {
        code: "UNEXPECTED",
        syncState: "error",
        progressPercent: 100,
        lastResult: {
          status: "error",
          mode,
          message,
          details,
          at: new Date().toISOString(),
        },
        previewSummary: buildUiPreviewTextFromBlock(embedBlock, {
          maxChars: 200_000,
        }),
        ...buildUiPreviewPayload(embedBlock),
      });
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
    if (typeof lastUrl !== "string" || !lastUrl.trim()) {
      return false;
    }

    const sourceKey = deriveSourceKey(lastUrl, embedBlock, embedSnapshot, authContext);
    const lastAutoRefreshAtMs = Number(autoRefreshMap?.[sourceKey] || 0);
    const decision = shouldRunAutoRefresh(
      {
        sourceKey,
        sourceUrl: lastUrl,
        syncStatus: embedBlock?.sync?.status,
        lastAutoRefreshAtMs,
        nowMs: Date.now(),
      },
      {
        cooldownMs: syncCoordinator.cooldownMs,
      }
    );

    if (!decision.ok) {
      return false;
    }

    setAutoRefreshMap({
      ...(autoRefreshMap || {}),
      [sourceKey]: decision.nowMs,
    });

    void runPreviewPipeline(lastUrl, `auto-${origin}`, {
      mode: SYNC_MODE.AUTO,
      skipManualLock: true,
      sourceKey,
    });

    return true;
  }

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Set GitHub URL",
        propertyName: PROPERTY_ACTION.OPEN_URL,
      },
      {
        itemType: "action",
        tooltip: "Refresh preview",
        propertyName: PROPERTY_ACTION.REFRESH_NOW,
      },
      {
        itemType: "action",
        tooltip: "Width -",
        propertyName: PROPERTY_ACTION.WIDTH_DEC,
      },
      {
        itemType: "action",
        tooltip: "Width +",
        propertyName: PROPERTY_ACTION.WIDTH_INC,
      },
      {
        itemType: "action",
        tooltip: "Height -",
        propertyName: PROPERTY_ACTION.HEIGHT_DEC,
      },
      {
        itemType: "action",
        tooltip: "Height +",
        propertyName: PROPERTY_ACTION.HEIGHT_INC,
      },
    ],
    async (event) => {
      const propertyName = typeof event?.propertyName === "string" ? event.propertyName : "";

      if (propertyName === PROPERTY_ACTION.OPEN_URL || propertyName === "open-url") {
        ensureUiSessionTask();

        await (async () => {
          try {
            openWidgetUi();
          } catch (error) {
            const detail =
              error && typeof error.message === "string" ? error.message : String(error);
            setStatus("Could not open URL input");
            figma.notify(`Could not open URL input: ${detail}`, { error: true });
            return;
          }

          // Give the iframe a tick to bootstrap before first context push.
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
          mode: SYNC_MODE.MANUAL,
        });
        return;
      }

      if (
        propertyName === PROPERTY_ACTION.WIDTH_DEC ||
        propertyName === PROPERTY_ACTION.WIDTH_INC ||
        propertyName === PROPERTY_ACTION.HEIGHT_DEC ||
        propertyName === PROPERTY_ACTION.HEIGHT_INC
      ) {
        const baseSize =
          canvasSize && typeof canvasSize === "object"
            ? clampCanvasSize(canvasSize)
            : clampCanvasSize();
        const widthDelta =
          propertyName === PROPERTY_ACTION.WIDTH_INC
            ? CANVAS_SIZE_LIMITS.widthStep
            : propertyName === PROPERTY_ACTION.WIDTH_DEC
              ? -CANVAS_SIZE_LIMITS.widthStep
              : 0;
        const heightDelta =
          propertyName === PROPERTY_ACTION.HEIGHT_INC
            ? CANVAS_SIZE_LIMITS.heightStep
            : propertyName === PROPERTY_ACTION.HEIGHT_DEC
              ? -CANVAS_SIZE_LIMITS.heightStep
              : 0;
        const nextSize = clampCanvasSize({
          width: baseSize.width + widthDelta,
          height: baseSize.height + heightDelta,
        });
        setCanvasSize(nextSize);
        setStatus(`Canvas resized: ${nextSize.width} × ${nextSize.height}`);
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
          mode: SYNC_MODE.MANUAL,
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
          mode: SYNC_MODE.MANUAL,
        });
        return;
      }

      if (command.type === UI_COMMAND.SUBMIT_PAT) {
        void (async () => {
          const patStore = await getRuntimePatStore();
          patStore.set(command.sourceKey, command.token);
          await patStore.flush();

          const retryUrl =
            (authContext &&
              typeof authContext === "object" &&
              authContext.sourceKey === command.sourceKey &&
              typeof authContext.url === "string"
              ? authContext.url
              : "") || lastUrl;

          if (!retryUrl) {
            setStatus("PAT saved, waiting for URL");
            postRuntimeStatus("success", "PAT guardado para este fichero.", "", {
              sourceKey: command.sourceKey,
            });
            figma.notify("PAT guardado para este fichero.");
            return;
          }

          setStatus("PAT actualizado. Reintentando...");
          postRuntimeStatus("loading", "Reintentando con PAT actualizado...", "", {
            sourceKey: command.sourceKey,
          });
          figma.notify("Reintentando con PAT actualizado...");
          await runPreviewPipeline(retryUrl, "pat-retry", {
            mode: SYNC_MODE.MANUAL,
            sourceKey: command.sourceKey,
          });
        })();
        return;
      }

      if (command.type === UI_COMMAND.FORGET_PAT) {
        void (async () => {
          const patStore = await getRuntimePatStore();
          patStore.remove(command.sourceKey);
          await patStore.flush();

          if (
            authContext &&
            typeof authContext === "object" &&
            authContext.sourceKey === command.sourceKey
          ) {
            setAuthContext(null);
          }

          setStatus("PAT olvidado para este fichero");
          postRuntimeStatus("success", "PAT olvidado para este fichero.", "", {
            sourceKey: command.sourceKey,
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
      figma.ui.onmessage = undefined;
    };
  });

  const effectiveCanvasSize =
    canvasSize && typeof canvasSize === "object" ? clampCanvasSize(canvasSize) : clampCanvasSize();
  const previewSummary = buildUiPreviewTextFromBlock(embedBlock, {
    maxChars: 200_000,
  });
  const previewPanelWidth = Math.max(
    200,
    effectiveCanvasSize.width - CANVAS_LAYOUT.root.padding * 2
  );
  const previewViewportHeight = Math.max(180, effectiveCanvasSize.height - 220);
  const canvasPreviewText = fitPreviewTextForCanvas(previewSummary, {
    width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
    height: previewViewportHeight,
  });
  const canvasPreviewEntries = buildCanvasPreviewEntries(embedBlock?.preview?.blocks, {
    width: previewPanelWidth - CANVAS_LAYOUT.previewPanel.insetHorizontal,
    height: previewViewportHeight,
  });
  const lastResult = buildLastResult(embedSnapshot, embedBlock);
  const previewChildren =
    canvasPreviewEntries.length > 0
      ? [
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
            padding: CANVAS_LAYOUT.previewPanel.padding,
          },
          ...canvasPreviewEntries.map((entry) =>
            renderCanvasPreviewEntry(entry, previewPanelWidth)
          )
        ),
      ]
      : [
        h(
          Text,
          { fontSize: 10, fill: "#8B8B8B" },
          canvasPreviewText.trim().length > 0 ? canvasPreviewText : "Preview: pending"
        ),
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
      embedBlock
        ? `Embed: ${embedBlock.sections.header.ownerRepo} · ${embedBlock.sections.header.path}`
        : "Embed: pending"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#7A7A7A" },
      embedBlock
        ? `Sync: ${embedBlock.sections.header.statusBadge.label} · ${embedBlock.sections.header.lastSync}`
        : "Sync: idle"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#8B8B8B" },
      embedSnapshot
        ? `Warnings: ${embedSnapshot.warningCount || 0} · Progressive: ${embedSnapshot.render?.progressive ? "yes" : "no"}`
        : "Warnings: 0 · Progressive: no"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#8B8B8B" },
      `Last result: ${lastResult.status || "idle"} (${lastResult.mode || "manual"})`
    ),
    h(
      Text,
      { fontSize: 10, fill: "#8B8B8B" },
      `Canvas: ${effectiveCanvasSize.width} × ${effectiveCanvasSize.height}`
    ),
    h(Text, { fontSize: 10, fontWeight: 600, fill: "#1F1F1F" }, "Preview"),
    ...previewChildren,
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
      cornerRadius: CANVAS_LAYOUT.root.cornerRadius,
    },
    ...children
  );
}

widget.register(GitHubPreviewWidget);
