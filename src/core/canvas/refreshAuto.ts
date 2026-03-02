const { REFRESH_TRIGGER, SYNC_MODE, SYNC_STATUS } = require("./types.ts");
const { transitionSyncState } = require("./syncState.ts");
const { updateEmbedBlockInPlace } = require("./updateEmbedBlock.ts");
const { renderFilePreview } = require("../render/renderFilePreview.ts");

function isAutoRefreshEligible(block) {
  if (!block || typeof block.sourceKey !== "string" || !block.sourceKey.trim()) {
    return false;
  }

  return block.sync?.status !== SYNC_STATUS.SYNCING;
}

function normalizeError(errorLike) {
  if (!errorLike) {
    return {
      code: "AUTO_REFRESH_FAILED",
      message: "Sync error",
      details: "No se pudo sincronizar automáticamente.",
    };
  }

  return {
    code: errorLike.code || "AUTO_REFRESH_FAILED",
    message: errorLike.message || "Sync error",
    details: errorLike.details || errorLike.message || "No se pudo sincronizar automáticamente.",
  };
}

function toRenderInput(block, contentPayload) {
  return {
    sourceKey: block.sourceKey,
    extension: contentPayload.extension || block.source?.path?.split(".").pop() || "txt",
    content: contentPayload.content,
  };
}

async function refreshEligibleBlocksOnOpen(blocks, options = {}) {
  const fetchContent = options.fetchContent;
  if (typeof fetchContent !== "function") {
    throw new TypeError("refreshEligibleBlocksOnOpen requires options.fetchContent function");
  }

  const renderPreview =
    typeof options.renderPreview === "function"
      ? options.renderPreview
      : renderFilePreview;

  const updatedBlocks = [];
  const results = [];

  for (const block of blocks || []) {
    if (!isAutoRefreshEligible(block)) {
      updatedBlocks.push(block);
      results.push({
        sourceKey: block?.sourceKey || "",
        ok: false,
        skipped: true,
        reason: "not_eligible",
      });
      continue;
    }

    const nowForStep = options.now ? { now: options.now } : {};
    const syncingState = transitionSyncState(
      block.sync,
      {
        type: "start",
        mode: SYNC_MODE.AUTO,
      },
      nowForStep
    );

    const syncingBlock = updateEmbedBlockInPlace(
      block,
      {
        sync: syncingState,
      },
      nowForStep
    );

    const fetched = await fetchContent(syncingBlock, {
      trigger: REFRESH_TRIGGER.AUTO_OPEN,
      mode: SYNC_MODE.AUTO,
    });

    if (!fetched?.ok) {
      const normalizedError = normalizeError(fetched?.error);
      const failedState = transitionSyncState(
        syncingBlock.sync,
        {
          type: "error",
          mode: SYNC_MODE.AUTO,
          message: normalizedError.message,
          details: normalizedError.details,
        },
        nowForStep
      );

      updatedBlocks.push(
        updateEmbedBlockInPlace(syncingBlock, { sync: failedState }, nowForStep)
      );
      results.push({
        sourceKey: block.sourceKey,
        ok: false,
        skipped: false,
        reason: "fetch_error",
        error: normalizedError,
      });
      continue;
    }

    const rendered = renderPreview(toRenderInput(syncingBlock, fetched.value || {}));
    if (!rendered?.ok) {
      const normalizedError = normalizeError(rendered?.error);
      const failedState = transitionSyncState(
        syncingBlock.sync,
        {
          type: "error",
          mode: SYNC_MODE.AUTO,
          message: normalizedError.message,
          details: normalizedError.details,
        },
        nowForStep
      );

      updatedBlocks.push(
        updateEmbedBlockInPlace(syncingBlock, { sync: failedState }, nowForStep)
      );
      results.push({
        sourceKey: block.sourceKey,
        ok: false,
        skipped: false,
        reason: "render_error",
        error: normalizedError,
      });
      continue;
    }

    const successState = transitionSyncState(
      syncingBlock.sync,
      {
        type: "success",
        mode: SYNC_MODE.AUTO,
        message: "Auto-sync completado",
      },
      nowForStep
    );

    updatedBlocks.push(
      updateEmbedBlockInPlace(
        syncingBlock,
        {
          preview: rendered.value,
          sync: successState,
        },
        nowForStep
      )
    );
    results.push({
      sourceKey: block.sourceKey,
      ok: true,
      skipped: false,
    });
  }

  return {
    blocks: updatedBlocks,
    results,
  };
}

module.exports = {
  isAutoRefreshEligible,
  refreshEligibleBlocksOnOpen,
};
