const { highlightCode } = require("./highlightCode.ts");
const { renderMarkdown } = require("./renderMarkdown.ts");
const { resolvePerformancePolicy } = require("./performancePolicy.ts");

const previewCache = new Map();

function normalizeExtension(extension) {
  if (typeof extension !== "string") return "txt";
  return extension.replace(/^\./, "").toLowerCase();
}

function truncateToBytes(content, maxBytes) {
  if (Buffer.byteLength(content, "utf8") <= maxBytes) {
    return content;
  }

  let end = content.length;
  let start = 0;
  let best = "";

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const candidate = content.slice(0, mid);
    const bytes = Buffer.byteLength(candidate, "utf8");
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
    hash = (hash * 31 + probe.charCodeAt(i)) >>> 0;
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
  const content = typeof input?.content === "string" ? input.content : "";
  const sourceKey = String(input?.sourceKey || "");
  const extension = normalizeExtension(input?.extension);
  const inputBytes = Buffer.byteLength(content, "utf8");

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

  const policy = resolvePerformancePolicy({
    inputBytes,
    ...options.policy,
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
      renderBytes: Buffer.byteLength(contentToRender, "utf8"),
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
