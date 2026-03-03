const { SYNC_STATUS, SYNC_MODE, SYNC_BADGE_TONE } = require("./types.ts");

function normalizeMode(mode) {
  if (mode === SYNC_MODE.AUTO) return SYNC_MODE.AUTO;
  return SYNC_MODE.MANUAL;
}

function resolveNow(options = {}) {
  if (typeof options.now === "string" && options.now) {
    return options.now;
  }
  return new Date().toISOString();
}

function transitionSyncState(currentSync = {}, event = {}, options = {}) {
  const nowIso = resolveNow(options);
  const mode = normalizeMode(event.mode || currentSync.mode);

  if (event.type === "start") {
    return {
      ...currentSync,
      status: SYNC_STATUS.SYNCING,
      mode,
      message: "Syncing...",
      details: "",
      lastUpdatedAt: nowIso,
    };
  }

  if (event.type === "success") {
    const syncedAt =
      typeof event.syncedAt === "string" && event.syncedAt ? event.syncedAt : nowIso;

    return {
      ...currentSync,
      status: SYNC_STATUS.SUCCESS,
      mode,
      lastSyncAt: syncedAt,
      message:
        typeof event.message === "string" && event.message
          ? event.message
          : mode === SYNC_MODE.AUTO
            ? "Auto-sync completado"
            : "Sincronización completada",
      details: "",
      lastUpdatedAt: nowIso,
    };
  }

  if (event.type === "error") {
    return {
      ...currentSync,
      status: SYNC_STATUS.ERROR,
      mode,
      message:
        typeof event.message === "string" && event.message
          ? event.message
          : "Sync error",
      details:
        typeof event.details === "string" && event.details
          ? event.details
          : "No se pudo sincronizar el contenido remoto.",
      lastUpdatedAt: nowIso,
    };
  }

  return {
    ...currentSync,
    status: SYNC_STATUS.IDLE,
    mode,
    message:
      typeof currentSync.message === "string" && currentSync.message
        ? currentSync.message
        : "Sin sincronizar",
    details: typeof currentSync.details === "string" ? currentSync.details : "",
    lastUpdatedAt: nowIso,
  };
}

function buildSyncBadge(sync = {}) {
  const status = sync.status || SYNC_STATUS.IDLE;
  const mode = normalizeMode(sync.mode);

  let label = "Idle";
  if (status === SYNC_STATUS.SYNCING) {
    label = "Syncing...";
  } else if (status === SYNC_STATUS.SUCCESS) {
    label = mode === SYNC_MODE.AUTO ? "Auto-sync" : "Synced";
  } else if (status === SYNC_STATUS.ERROR) {
    label = "Sync error";
  }

  return {
    status,
    mode,
    label,
    tone: SYNC_BADGE_TONE[status] || SYNC_BADGE_TONE[SYNC_STATUS.IDLE],
    lastSyncAt: sync.lastSyncAt || null,
  };
}

module.exports = {
  transitionSyncState,
  buildSyncBadge,
};
