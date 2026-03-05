function buildRenderSnapshot(preview = {}) {
  const blocks = Array.isArray(preview.blocks) ? preview.blocks : [];
  return {
    kind: typeof preview.kind === "string" ? preview.kind : "text",
    blockCount: blocks.length,
    truncated: Boolean(preview.truncated),
    progressive: Boolean(preview.progressive),
  };
}

function buildLastResultSnapshot(input = {}) {
  const base = input.lastResult && typeof input.lastResult === "object" ? input.lastResult : {};
  const status =
    typeof base.status === "string" && base.status
      ? base.status
      : typeof input.syncState === "string" && input.syncState
        ? input.syncState
        : "idle";

  return {
    status,
    mode: typeof base.mode === "string" && base.mode ? base.mode : "manual",
    message: typeof base.message === "string" ? base.message : "",
    details: typeof base.details === "string" ? base.details : "",
    at:
      typeof base.at === "string" && base.at
        ? base.at
        : typeof input.updatedAt === "string" && input.updatedAt
          ? input.updatedAt
          : new Date().toISOString(),
  };
}

function buildWidgetSnapshot(input = {}) {
  const block = input.embedBlock || {};
  const warnings = Array.isArray(input.warnings)
    ? input.warnings.filter((warning) => typeof warning === "string" && warning.trim())
    : [];

  const syncState = block.sync?.status || "idle";
  const updatedAt =
    typeof input.updatedAt === "string" && input.updatedAt
      ? input.updatedAt
      : new Date().toISOString();

  return {
    version: 1,
    sourceKey:
      typeof block.sourceKey === "string" && block.sourceKey
        ? block.sourceKey
        : String(input.sourceKey || ""),
    sourceUrl: typeof input.sourceUrl === "string" ? input.sourceUrl : "",
    syncState,
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
    lastResult: buildLastResultSnapshot({
      lastResult:
        input.lastResult || {
          status: block.sync?.status || "idle",
          mode: block.sync?.mode || "manual",
          message: block.sync?.message || "",
          details: block.sync?.details || "",
          at: block.sync?.lastUpdatedAt || updatedAt,
        },
      syncState,
      updatedAt,
    }),
    updatedAt,
  };
}

function mergeWidgetSnapshot(previousSnapshot, patch = {}) {
  const previous =
    previousSnapshot && typeof previousSnapshot === "object" ? previousSnapshot : {};

  const hasField = (name) => Object.prototype.hasOwnProperty.call(patch, name);

  const updatedAt =
    typeof patch.updatedAt === "string" && patch.updatedAt
      ? patch.updatedAt
      : new Date().toISOString();

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
    lastResult: buildLastResultSnapshot({
      lastResult: {
        ...(previous.lastResult || {}),
        ...(patch.lastResult || {}),
      },
      syncState:
        typeof patch.syncState === "string" && patch.syncState
          ? patch.syncState
          : previous.syncState || "idle",
      updatedAt,
    }),
    updatedAt,
  };
}

module.exports = {
  buildWidgetSnapshot,
  mergeWidgetSnapshot,
};
