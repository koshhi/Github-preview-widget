const { createSeedEmbed } = require("../bootstrap/createSeedEmbed.ts");
const { readGithubFileWithAuth } = require("../../core/github/readGithubFileWithAuth.ts");
const { renderFilePreview } = require("../../core/render/renderFilePreview.ts");
const { updateEmbedBlockInPlace } = require("../../core/canvas/updateEmbedBlock.ts");
const { transitionSyncState } = require("../../core/canvas/syncState.ts");
const { SYNC_MODE } = require("../../core/canvas/types.ts");
const { redactSensitive } = require("./redactSensitive.ts");
const {
  buildWidgetSnapshot,
  mergeWidgetSnapshot,
} = require("./persistWidgetSnapshot.ts");
const {
  normalizeRenderForWidget,
} = require("./normalizeRenderForWidget.ts");

function resolveNow(inputNow) {
  if (typeof inputNow === "string" && inputNow) {
    return inputNow;
  }
  return new Date().toISOString();
}

function toRenderInput(readResult) {
  const source = readResult?.source || {};
  const extension =
    source.extension || String(source.path || "").split(".").pop() || "txt";

  return {
    sourceKey: readResult.sourceKey,
    extension,
    content: readResult.content,
  };
}

function buildSeedBlock(url) {
  const seed = createSeedEmbed({ url });
  if (!seed.ok) {
    return seed;
  }

  return {
    ok: true,
    value: seed.value.embedBlock,
  };
}

function normalizeError(errorLike, fallbackCode, fallbackMessage, fallbackDetails) {
  if (!errorLike || typeof errorLike !== "object") {
    return {
      code: fallbackCode,
      message: fallbackMessage,
      details: fallbackDetails,
    };
  }

  return {
    code: errorLike.code || fallbackCode,
    message: redactSensitive(errorLike.message || fallbackMessage),
    details: redactSensitive(errorLike.details || fallbackDetails),
  };
}

function normalizeAuthState(authLike) {
  if (!authLike || typeof authLike !== "object") {
    return null;
  }

  return {
    kind: typeof authLike.kind === "string" ? authLike.kind : null,
    sourceKey:
      typeof authLike.sourceKey === "string" && authLike.sourceKey
        ? authLike.sourceKey
        : null,
    usedPat: Boolean(authLike.usedPat),
    retryCount: Number(authLike.retryCount || 0),
    patStatus:
      typeof authLike.patStatus === "string" && authLike.patStatus
        ? authLike.patStatus
        : null,
  };
}

async function createOrRefreshEmbedFromUrl(input = {}, deps = {}) {
  const url = typeof input.url === "string" ? input.url.trim() : "";
  if (!url) {
    return {
      ok: false,
      error: {
        code: "MISSING_URL",
        message: "A GitHub file URL is required.",
      },
      value: {
        embedBlock: input.currentEmbedBlock || null,
        snapshot: input.currentSnapshot || null,
      },
    };
  }

  const now = resolveNow(input.now);
  const nowOptions = { now };
  const mode =
    input.mode === SYNC_MODE.AUTO ? SYNC_MODE.AUTO : SYNC_MODE.MANUAL;
  const previousSnapshot = input.currentSnapshot || null;

  const baseBlockResult = input.currentEmbedBlock
    ? { ok: true, value: input.currentEmbedBlock }
    : buildSeedBlock(url);

  if (!baseBlockResult.ok) {
    return {
      ok: false,
      error: baseBlockResult.error,
      value: {
        embedBlock: input.currentEmbedBlock || null,
        snapshot: previousSnapshot,
      },
    };
  }

  const baseBlock = baseBlockResult.value;

  const syncingState = transitionSyncState(
    baseBlock.sync,
    {
      type: "start",
      mode,
    },
    nowOptions
  );

  const syncingBlock = updateEmbedBlockInPlace(
    baseBlock,
    {
      sync: syncingState,
    },
    nowOptions
  );

  const readGithub =
    typeof deps.readGithubFileWithAuth === "function"
      ? deps.readGithubFileWithAuth
      : readGithubFileWithAuth;

  const readResult = await readGithub(url, {
    patStore: input.patStore,
    fetchImpl: input.fetchImpl,
  });

  if (!readResult?.ok) {
    const error = normalizeError(
      readResult?.error,
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
        details: error.details,
      },
      nowOptions
    );

    const failedBlock = updateEmbedBlockInPlace(
      syncingBlock,
      {
        sync: failedSync,
      },
      nowOptions
    );

    const snapshot = mergeWidgetSnapshot(
      previousSnapshot,
      buildWidgetSnapshot({
        embedBlock: failedBlock,
        sourceUrl: url,
        warnings: failedBlock.preview?.warnings || [],
        lastResult: {
          status: failedBlock.sync?.status || "error",
          mode: failedBlock.sync?.mode || mode,
          message: failedBlock.sync?.message || error.message,
          details: failedBlock.sync?.details || error.details,
        },
        updatedAt: now,
      })
    );

    return {
      ok: false,
      error,
      auth: normalizeAuthState(readResult?.auth),
      value: {
        embedBlock: failedBlock,
        snapshot,
      },
    };
  }

  const renderPreview =
    typeof deps.renderFilePreview === "function"
      ? deps.renderFilePreview
      : renderFilePreview;

  const renderResult = renderPreview(toRenderInput(readResult.value));
  if (!renderResult?.ok) {
    const error = normalizeError(
      renderResult?.error,
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
        details: error.details,
      },
      nowOptions
    );

    const failedBlock = updateEmbedBlockInPlace(
      syncingBlock,
      {
        sync: failedSync,
      },
      nowOptions
    );

    const snapshot = mergeWidgetSnapshot(
      previousSnapshot,
      buildWidgetSnapshot({
        embedBlock: failedBlock,
        sourceUrl: url,
        warnings: failedBlock.preview?.warnings || [],
        lastResult: {
          status: failedBlock.sync?.status || "error",
          mode: failedBlock.sync?.mode || mode,
          message: failedBlock.sync?.message || error.message,
          details: failedBlock.sync?.details || error.details,
        },
        updatedAt: now,
      })
    );

    return {
      ok: false,
      error,
      value: {
        embedBlock: failedBlock,
        snapshot,
      },
    };
  }

  const normalizePreview =
    typeof deps.normalizePreview === "function"
      ? deps.normalizePreview
      : normalizeRenderForWidget;

  const normalizedPreview = normalizePreview(renderResult.value, {
    url,
    source: readResult.value.source,
    targetFirstPreviewMs: 2000,
  });

  const preview = normalizedPreview?.preview || normalizedPreview;
  const warnings = Array.isArray(normalizedPreview?.warnings)
    ? normalizedPreview.warnings
    : Array.isArray(preview?.warnings)
      ? preview.warnings
      : [];

  const warningDetail =
    typeof normalizedPreview?.warningDetail === "string"
      ? normalizedPreview.warningDetail
      : warnings.length > 0
        ? warnings.join(" | ")
        : "";

  const successSync = transitionSyncState(
    syncingBlock.sync,
    {
      type: "success",
      mode,
      message:
        warnings.length > 0
          ? mode === SYNC_MODE.AUTO
            ? "Auto-sync completado con advertencias"
            : "Preview updated with warnings"
          : mode === SYNC_MODE.AUTO
            ? "Auto-sync completado"
            : "Preview created",
      details: warningDetail,
      syncedAt: now,
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
        sourceUrl: url,
      },
    },
    nowOptions
  );

  const snapshot = mergeWidgetSnapshot(
    previousSnapshot,
    buildWidgetSnapshot({
      embedBlock: updatedBlock,
      sourceUrl: url,
      warnings,
      metrics: preview?.metrics || null,
      lastResult: {
        status: updatedBlock.sync?.status || "success",
        mode: updatedBlock.sync?.mode || mode,
        message: updatedBlock.sync?.message || "Preview created",
        details: updatedBlock.sync?.details || "",
      },
      updatedAt: now,
    })
  );

  return {
    ok: true,
    auth: normalizeAuthState(readResult?.auth),
    value: {
      embedBlock: updatedBlock,
      snapshot,
      source: readResult.value.source,
      render: preview,
    },
  };
}

module.exports = {
  createOrRefreshEmbedFromUrl,
};
