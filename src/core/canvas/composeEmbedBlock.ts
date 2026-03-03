const {
  REFRESH_TRIGGER,
  SYNC_STATUS,
  SYNC_BADGE_TONE,
  EMBED_BLOCK_KIND,
} = require("./types.ts");
const {
  createEmbedBlockModel,
  formatSyncTimestamp,
} = require("./embedBlockModel.ts");

function getStatusLabel(status) {
  if (status === SYNC_STATUS.SYNCING) return "Syncing...";
  if (status === SYNC_STATUS.SUCCESS) return "Synced";
  if (status === SYNC_STATUS.ERROR) return "Sync error";
  return "Idle";
}

function composeEmbedBlock(input, options = {}) {
  const model =
    input?.kind === EMBED_BLOCK_KIND
      ? input
      : createEmbedBlockModel(input, options);

  const ownerRepo = `${model.source.owner}/${model.source.repo}`;
  const statusLabel = getStatusLabel(model.sync.status);

  return {
    ...model,
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
          mode: model.sync.mode,
        },
        refreshActions: [REFRESH_TRIGGER.HEADER_BUTTON, REFRESH_TRIGGER.CONTEXT_MENU],
      },
      body: {
        kind: model.preview.kind,
        blocks: model.preview.blocks,
        warnings: model.preview.warnings,
        truncated: model.preview.truncated,
        progressive: model.preview.progressive,
      },
      footer: {
        summary: model.sync.message || statusLabel,
        detail: model.sync.details || "",
        mode: model.sync.mode,
        updatedAt: model.sync.lastUpdatedAt,
      },
    },
  };
}

module.exports = {
  composeEmbedBlock,
};
