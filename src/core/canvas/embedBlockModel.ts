const {
  EMBED_BLOCK_KIND,
  BLOCK_LIMITS,
  SYNC_STATUS,
  SYNC_MODE,
} = require("./types.ts");

function sanitizeText(value, fallback) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function clampWidth(width) {
  if (typeof width !== "number" || Number.isNaN(width)) {
    return BLOCK_LIMITS.DEFAULT_WIDTH;
  }

  return Math.max(BLOCK_LIMITS.MIN_WIDTH, Math.min(BLOCK_LIMITS.MAX_WIDTH, width));
}

function parseSourceKey(sourceKey) {
  const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
    ref: match[3],
    path: match[4],
  };
}

function normalizeSource(source, sourceKey) {
  const parsed = parseSourceKey(sourceKey);
  const owner = sanitizeText(source?.owner, parsed?.owner || "unknown");
  const repo = sanitizeText(source?.repo, parsed?.repo || "unknown");
  const ref = sanitizeText(source?.ref, parsed?.ref || "main");
  const path = sanitizeText(source?.path, parsed?.path || "unknown.txt");
  const normalizedSourceKey = sanitizeText(sourceKey, `${owner}/${repo}@${ref}:${path}`);

  return {
    owner,
    repo,
    ref,
    path,
    sourceKey: normalizedSourceKey,
  };
}

function normalizePreview(preview) {
  return {
    kind: typeof preview?.kind === "string" ? preview.kind : "text",
    blocks: Array.isArray(preview?.blocks) ? preview.blocks : [],
    warnings: Array.isArray(preview?.warnings) ? preview.warnings : [],
    truncated: Boolean(preview?.truncated),
    progressive: Boolean(preview?.progressive),
  };
}

function createInitialSyncState(sync, nowIso) {
  return {
    status:
      typeof sync?.status === "string" ? sync.status : SYNC_STATUS.IDLE,
    mode: typeof sync?.mode === "string" ? sync.mode : SYNC_MODE.MANUAL,
    lastSyncAt:
      typeof sync?.lastSyncAt === "string" && sync.lastSyncAt
        ? sync.lastSyncAt
        : null,
    message:
      typeof sync?.message === "string" && sync.message
        ? sync.message
        : "Sin sincronizar",
    details:
      typeof sync?.details === "string" ? sync.details : "",
    lastUpdatedAt:
      typeof sync?.lastUpdatedAt === "string" && sync.lastUpdatedAt
        ? sync.lastUpdatedAt
        : nowIso,
  };
}

function formatSyncTimestamp(lastSyncAt) {
  if (!lastSyncAt) {
    return "Nunca";
  }

  return String(lastSyncAt);
}

function createEmbedBlockModel(input = {}, options = {}) {
  const nowIso =
    typeof options.now === "string" && options.now
      ? options.now
      : new Date().toISOString();
  const source = normalizeSource(input.source, input.sourceKey);

  return {
    kind: EMBED_BLOCK_KIND,
    id: sanitizeText(input.id, `embed:${source.sourceKey}`),
    sourceKey: source.sourceKey,
    source,
    preview: normalizePreview(input.preview),
    sync: createInitialSyncState(input.sync, nowIso),
    layout: {
      width: clampWidth(input?.layout?.width),
      heightMode: "auto",
      resizable: {
        edgeDrag: true,
        minWidth: BLOCK_LIMITS.MIN_WIDTH,
        maxWidth: BLOCK_LIMITS.MAX_WIDTH,
        minHeight: BLOCK_LIMITS.MIN_HEIGHT,
      },
    },
    createdAt:
      typeof input.createdAt === "string" && input.createdAt
        ? input.createdAt
        : nowIso,
    updatedAt:
      typeof input.updatedAt === "string" && input.updatedAt
        ? input.updatedAt
        : nowIso,
    metadata: {
      version: 1,
    },
  };
}

module.exports = {
  createEmbedBlockModel,
  createInitialSyncState,
  formatSyncTimestamp,
};
