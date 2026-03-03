const { EMBED_BLOCK_KIND } = require("./types.ts");
const { createEmbedBlockModel } = require("./embedBlockModel.ts");
const { composeEmbedBlock } = require("./composeEmbedBlock.ts");

function updateEmbedBlockInPlace(block, patch = {}, options = {}) {
  const nowIso =
    typeof options.now === "string" && options.now
      ? options.now
      : new Date().toISOString();

  const base =
    block?.kind === EMBED_BLOCK_KIND
      ? block
      : createEmbedBlockModel(block || {}, { now: nowIso });

  const nextModel = {
    ...base,
    sourceKey:
      typeof patch.sourceKey === "string" && patch.sourceKey
        ? patch.sourceKey
        : base.sourceKey,
    source: patch.source ? { ...base.source, ...patch.source } : base.source,
    preview: patch.preview ? { ...base.preview, ...patch.preview } : base.preview,
    sync: patch.sync ? { ...base.sync, ...patch.sync } : base.sync,
    layout: patch.layout ? { ...base.layout, ...patch.layout } : base.layout,
    updatedAt: nowIso,
    metadata: {
      ...base.metadata,
      updatedInPlace: true,
    },
  };

  const composed = composeEmbedBlock(nextModel, { now: nowIso });
  return {
    ...composed,
    id: base.id,
    kind: base.kind,
    sourceKey: nextModel.sourceKey,
    source: nextModel.source,
    preview: nextModel.preview,
    sync: nextModel.sync,
    layout: nextModel.layout,
    createdAt: base.createdAt,
    updatedAt: nowIso,
    metadata: {
      ...nextModel.metadata,
      version: base.metadata?.version || 1,
    },
  };
}

module.exports = {
  updateEmbedBlockInPlace,
};
