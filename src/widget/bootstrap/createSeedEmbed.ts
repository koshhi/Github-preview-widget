const { ingestGithubFileUrl } = require("../../core/url/ingestGithubFileUrl.ts");
const { composeEmbedBlock } = require("../../core/canvas/composeEmbedBlock.ts");
const { SYNC_MODE, SYNC_STATUS } = require("../../core/canvas/types.ts");
const { createSeedMetadata } = require("./widgetMetadata.ts");

function createSeedEmbed(input = {}) {
  const url = typeof input.url === "string" ? input.url.trim() : "";
  if (!url) {
    return {
      ok: false,
      error: {
        code: "MISSING_URL",
        message: "A GitHub file URL is required.",
      },
    };
  }

  const ingested = ingestGithubFileUrl(url);
  if (!ingested.ok) {
    return {
      ok: false,
      error: ingested.error,
    };
  }

  const source = ingested.value;
  const metadata = createSeedMetadata(source.sourceKey, {
    now: input.now,
  });

  const block = composeEmbedBlock({
    sourceKey: source.sourceKey,
    source: {
      owner: source.owner,
      repo: source.repo,
      ref: source.ref,
      path: source.path,
    },
    preview: {
      kind: "text",
      blocks: [
        {
          type: "text",
          content: `Seed preview ready for ${source.path}`,
        },
        {
          type: "text",
          content: "Bootstrap complete. Full render pipeline will run in phase 6.",
        },
      ],
      warnings: [],
      truncated: false,
      progressive: false,
    },
    sync: {
      status: SYNC_STATUS.IDLE,
      mode: SYNC_MODE.MANUAL,
      message: "Seed preview ready",
      details: "",
      lastSyncAt: null,
    },
  });

  return {
    ok: true,
    value: {
      source,
      metadata,
      embedBlock: {
        ...block,
        metadata: {
          ...block.metadata,
          ...metadata,
          sourceUrl: url,
        },
      },
    },
  };
}

module.exports = {
  createSeedEmbed,
};
