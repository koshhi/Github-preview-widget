function buildRenderSnapshot(preview = {}) {
  const blocks = Array.isArray(preview.blocks) ? preview.blocks : [];
  return {
    kind: typeof preview.kind === "string" ? preview.kind : "text",
    blockCount: blocks.length,
    truncated: Boolean(preview.truncated),
    progressive: Boolean(preview.progressive),
  };
}

function buildWidgetSnapshot(input = {}) {
  const block = input.embedBlock || {};
  const warnings = Array.isArray(input.warnings)
    ? input.warnings.filter((warning) => typeof warning === "string" && warning.trim())
    : [];

  return {
    version: 1,
    sourceKey:
      typeof block.sourceKey === "string" && block.sourceKey
        ? block.sourceKey
        : String(input.sourceKey || ""),
    sourceUrl: typeof input.sourceUrl === "string" ? input.sourceUrl : "",
    syncState: block.sync?.status || "idle",
    lastSync: block.sync?.lastSyncAt || null,
    warnings,
    warningCount: warnings.length,
    render: buildRenderSnapshot(block.preview),
    metrics: {
      firstPreviewMs:
        typeof input.metrics?.firstPreviewMs === "number"
          ? input.metrics.firstPreviewMs
          : null,
      cacheHit: Boolean(input.metrics?.cacheHit),
    },
    updatedAt:
      typeof input.updatedAt === "string" && input.updatedAt
        ? input.updatedAt
        : new Date().toISOString(),
  };
}

function mergeWidgetSnapshot(previousSnapshot, patch = {}) {
  const previous =
    previousSnapshot && typeof previousSnapshot === "object" ? previousSnapshot : {};

  const hasField = (name) => Object.prototype.hasOwnProperty.call(patch, name);

  return {
    version: 1,
    sourceKey:
      typeof patch.sourceKey === "string" && patch.sourceKey
        ? patch.sourceKey
        : previous.sourceKey || "",
    sourceUrl:
      typeof patch.sourceUrl === "string" ? patch.sourceUrl : previous.sourceUrl || "",
    syncState:
      typeof patch.syncState === "string" && patch.syncState
        ? patch.syncState
        : previous.syncState || "idle",
    lastSync: hasField("lastSync") ? patch.lastSync : previous.lastSync || null,
    warnings: Array.isArray(patch.warnings)
      ? patch.warnings
      : Array.isArray(previous.warnings)
        ? previous.warnings
        : [],
    warningCount:
      typeof patch.warningCount === "number"
        ? patch.warningCount
        : Array.isArray(patch.warnings)
          ? patch.warnings.length
          : typeof previous.warningCount === "number"
            ? previous.warningCount
            : 0,
    render: {
      ...(previous.render || {}),
      ...(patch.render || {}),
    },
    metrics: {
      ...(previous.metrics || {}),
      ...(patch.metrics || {}),
    },
    updatedAt:
      typeof patch.updatedAt === "string" && patch.updatedAt
        ? patch.updatedAt
        : new Date().toISOString(),
  };
}

module.exports = {
  buildWidgetSnapshot,
  mergeWidgetSnapshot,
};
