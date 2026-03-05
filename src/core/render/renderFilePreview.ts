// @ts-nocheck

const { highlightCode } = require("./highlightCode.ts");
const { renderMarkdown } = require("./renderMarkdown.ts");
const { resolvePerformancePolicy } = require("./performancePolicy.ts");
const { byteLengthUtf8 } = require("./utf8ByteLength.ts");

const previewCache = new Map();

/**
 * @param {unknown} extension
 * @returns {string}
 */
function normalizeExtension(extension) {
  if (typeof extension !== "string") return "txt";
  return extension.replace(/^\./, "").toLowerCase();
}

/**
 * @param {string} content
 * @param {number} maxBytes
 * @returns {string}
 */
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

/**
 * @param {string} content
 * @returns {string}
 */
function fastHash(content) {
  const probe = content.slice(0, 1024);
  let hash = 0;
  for (let i = 0; i < probe.length; i += 1) {
    hash = (hash * 31 + probe.charCodeAt(i)) >>> 0;
  }
  return `${content.length}:${hash}`;
}

/**
 * @param {string} extension
 * @param {string} content
 */
function renderByExtension(extension, content) {
  if (extension === "md") {
    return renderMarkdown(content);
  }

  return highlightCode({ extension, content });
}

/**
 * @param {{ content?: unknown; sourceKey?: unknown; extension?: unknown } | null | undefined} input
 * @param {{ policy?: Record<string, unknown> } | null | undefined} [options]
 */
function renderFilePreview(input, options = {}) {
  const startedAt = Date.now();
  const content = typeof input?.content === "string" ? input.content : "";
  const sourceKey = String(input?.sourceKey || "");
  const extension = normalizeExtension(input?.extension);
  const inputBytes = byteLengthUtf8(content);

  const cacheKey = `${sourceKey}:${extension}:${fastHash(content)}`;
  const cached = previewCache.get(cacheKey);
  if (cached) {
    return {
      ok: true,
      value: {
        ...cached,
        metrics: {
          ...cached.metrics,
          cacheHit: true,
          firstPreviewMs: 0,
        },
      },
    };
  }

  const optionPolicy =
    options && typeof options.policy === "object" && options.policy ? options.policy : {};
  const policy = resolvePerformancePolicy({
    inputBytes,
    ...optionPolicy,
  });

  const warnings = [];
  const contentToRender = policy.shouldTruncate
    ? truncateToBytes(content, policy.previewBytes)
    : content;

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
    warnings: [...warnings, ...(rendered.value.warnings || [])],
    truncated: policy.shouldTruncate,
    progressive: policy.mode === "progressive",
    metrics: {
      inputBytes,
      renderBytes: byteLengthUtf8(contentToRender),
      firstPreviewMs: Date.now() - startedAt,
      targetFirstPreviewMs: policy.targetFirstPreviewMs,
      cacheHit: false,
    },
  };

  previewCache.set(cacheKey, resultValue);

  return {
    ok: true,
    value: resultValue,
  };
}

module.exports = {
  renderFilePreview,
};
