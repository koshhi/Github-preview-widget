const { REFRESH_TRIGGER, SYNC_MODE } = require("./types.ts");
const { transitionSyncState } = require("./syncState.ts");
const { updateEmbedBlockInPlace } = require("./updateEmbedBlock.ts");
const { renderFilePreview } = require("../render/renderFilePreview.ts");

function normalizeTrigger(trigger) {
  if (trigger === REFRESH_TRIGGER.CONTEXT_MENU) {
    return REFRESH_TRIGGER.CONTEXT_MENU;
  }
  return REFRESH_TRIGGER.HEADER_BUTTON;
}

function normalizeError(errorLike) {
  if (!errorLike) {
    return {
      code: "REFRESH_FAILED",
      message: "Sync error",
      details: "No se pudo sincronizar el contenido remoto.",
    };
  }

  if (typeof errorLike === "string") {
    return {
      code: "REFRESH_FAILED",
      message: "Sync error",
      details: errorLike,
    };
  }

  return {
    code: errorLike.code || "REFRESH_FAILED",
    message: errorLike.message || "Sync error",
    details: errorLike.details || errorLike.message || "No se pudo sincronizar el contenido remoto.",
  };
}

function toRenderInput(block, contentPayload) {
  return {
    sourceKey: block.sourceKey,
    extension: contentPayload.extension || block.source?.path?.split(".").pop() || "txt",
    content: contentPayload.content,
  };
}

async function refreshBlockManual(input, options = {}) {
  const block = input?.block;
  if (!block) {
    throw new TypeError("refreshBlockManual requires input.block");
  }

  const trigger = normalizeTrigger(input.trigger);
  const nowForStart = options.now ? { now: options.now } : {};
  const syncingState = transitionSyncState(
    block.sync,
    { type: "start", mode: SYNC_MODE.MANUAL },
    nowForStart
  );

  const syncingBlock = updateEmbedBlockInPlace(
    block,
    {
      sync: syncingState,
    },
    nowForStart
  );

  const fetchContent = options.fetchContent;
  if (typeof fetchContent !== "function") {
    throw new TypeError("refreshBlockManual requires options.fetchContent function");
  }


  const fetched = await fetchContent(syncingBlock, {
    trigger,
    mode: SYNC_MODE.MANUAL,
  });

  if (!fetched?.ok) {
    const normalizedError = normalizeError(fetched?.error);
    const failedState = transitionSyncState(
      syncingBlock.sync,
      {
        type: "error",
        mode: SYNC_MODE.MANUAL,
        message: normalizedError.message,
        details: normalizedError.details,
      },
      nowForStart
    );

    return {
      ok: false,
      error: normalizedError,
      value: updateEmbedBlockInPlace(syncingBlock, { sync: failedState }, nowForStart),
      meta: {
        trigger,
        mode: SYNC_MODE.MANUAL,
      },
    };
  }

  const renderInput = toRenderInput(syncingBlock, fetched.value || {});
  const rendered =
    typeof options.renderPreview === "function"
      ? options.renderPreview(renderInput)
      : renderFilePreview(renderInput);
  if (!rendered?.ok) {
    const normalizedError = normalizeError(rendered?.error);
    const failedState = transitionSyncState(
      syncingBlock.sync,
      {
        type: "error",
        mode: SYNC_MODE.MANUAL,
        message: normalizedError.message,
        details: normalizedError.details,
      },
      nowForStart
    );

    return {
      ok: false,
      error: normalizedError,
      value: updateEmbedBlockInPlace(syncingBlock, { sync: failedState }, nowForStart),
      meta: {
        trigger,
        mode: SYNC_MODE.MANUAL,
      },
    };
  }

  const successState = transitionSyncState(
    syncingBlock.sync,
    {
      type: "success",
      mode: SYNC_MODE.MANUAL,
      message: "Sincronización completada",
    },
    nowForStart
  );

  return {
    ok: true,
    value: updateEmbedBlockInPlace(
      syncingBlock,
      {
        preview: rendered.value,
        sync: successState,
      },
      nowForStart
    ),
    meta: {
      trigger,
      mode: SYNC_MODE.MANUAL,
    },
  };
}

module.exports = {
  refreshBlockManual,
};
