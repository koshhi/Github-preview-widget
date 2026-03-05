const { SYNC_STATUS } = require("../../core/canvas/types.ts");

const DEFAULT_AUTO_REFRESH_COOLDOWN_MS = 60_000;

function normalizeSourceKey(sourceKey) {
  if (typeof sourceKey !== "string") return "";
  return sourceKey.trim();
}

function resolveNowMs(nowMs) {
  if (typeof nowMs === "number" && Number.isFinite(nowMs) && nowMs >= 0) {
    return nowMs;
  }
  return Date.now();
}

function shouldRunAutoRefresh(input = {}, options = {}) {
  const sourceKey = normalizeSourceKey(input.sourceKey);
  if (!sourceKey) {
    return { ok: false, reason: "missing_source_key" };
  }

  const sourceUrl =
    typeof input.sourceUrl === "string" ? input.sourceUrl.trim() : "";
  if (!sourceUrl) {
    return { ok: false, reason: "missing_source_url" };
  }

  if (input.syncStatus === SYNC_STATUS.SYNCING) {
    return { ok: false, reason: "already_syncing" };
  }

  const nowMs = resolveNowMs(input.nowMs);
  const cooldownMs =
    typeof options.cooldownMs === "number" && options.cooldownMs >= 0
      ? options.cooldownMs
      : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
  const lastAutoRefreshAt =
    typeof input.lastAutoRefreshAtMs === "number" && input.lastAutoRefreshAtMs >= 0
      ? input.lastAutoRefreshAtMs
      : null;

  if (lastAutoRefreshAt !== null && nowMs - lastAutoRefreshAt < cooldownMs) {
    return {
      ok: false,
      reason: "cooldown",
      nextEligibleAtMs: lastAutoRefreshAt + cooldownMs,
    };
  }

  return {
    ok: true,
    reason: "eligible",
    sourceKey,
    nowMs,
  };
}

function createSyncCoordinator(options = {}) {
  const cooldownMs =
    typeof options.cooldownMs === "number" && options.cooldownMs >= 0
      ? options.cooldownMs
      : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
  const activeManualLocks = new Set();

  function beginManual(input = {}) {
    const sourceKey = normalizeSourceKey(input.sourceKey);
    if (!sourceKey) {
      return { ok: false, reason: "missing_source_key" };
    }

    if (input.syncStatus === SYNC_STATUS.SYNCING) {
      return { ok: false, reason: "already_syncing" };
    }

    if (activeManualLocks.has(sourceKey)) {
      return { ok: false, reason: "manual_lock" };
    }

    activeManualLocks.add(sourceKey);
    return { ok: true, sourceKey };
  }

  function endManual(sourceKey) {
    const normalized = normalizeSourceKey(sourceKey);
    if (!normalized) return false;
    return activeManualLocks.delete(normalized);
  }

  function canAutoRefresh(input = {}) {
    return shouldRunAutoRefresh(input, { cooldownMs });
  }

  return {
    cooldownMs,
    beginManual,
    endManual,
    canAutoRefresh,
    shouldRunAutoRefresh: canAutoRefresh,
  };
}

module.exports = {
  DEFAULT_AUTO_REFRESH_COOLDOWN_MS,
  createSyncCoordinator,
  shouldRunAutoRefresh,
};
