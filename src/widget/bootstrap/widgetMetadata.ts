const { SYNC_MODE, SYNC_STATUS } = require("../../core/canvas/types.ts");

function parseSourceKey(sourceKey) {
  const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2],
    ref: match[3],
    path: match[4],
  };
}

function createSeedMetadata(sourceKey, options = {}) {
  const now =
    typeof options.now === "string" && options.now
      ? options.now
      : new Date().toISOString();
  const parsed = parseSourceKey(sourceKey);

  return {
    sourceKey,
    source: parsed,
    lastSync: null,
    syncState: SYNC_STATUS.IDLE,
    syncMode: SYNC_MODE.MANUAL,
    createdAt: now,
    updatedAt: now,
  };
}

module.exports = {
  parseSourceKey,
  createSeedMetadata,
};
