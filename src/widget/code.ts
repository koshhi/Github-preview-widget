const { parseUiCommand } = require("./bridge/parseUiCommand.ts");
const { UI_COMMAND, UI_EVENT } = require("./bridge/messages.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("./runtime/createOrRefreshEmbedFromUrl.ts");
const {
  createPatSessionStore,
  loadPatSessionStore,
} = require("./runtime/patSessionStore.ts");
const { redactSensitive } = require("./runtime/redactSensitive.ts");
const {
  createSyncCoordinator,
  shouldRunAutoRefresh,
} = require("./runtime/syncCoordinator.ts");
const { SYNC_MODE } = require("../core/canvas/types.ts");

const { widget } = figma;
const { AutoLayout, Text, useEffect, usePropertyMenu, useSyncedState, h } = widget;

const AUTH_ERROR_CODES = Object.freeze({
  MISSING_PAT: "MISSING_PAT",
  EXPIRED_PAT: "EXPIRED_PAT",
  CURRENT_PAT: "CURRENT_PAT",
});

const AUTH_MESSAGES = Object.freeze({
  [AUTH_ERROR_CODES.MISSING_PAT]:
    "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.",
  [AUTH_ERROR_CODES.EXPIRED_PAT]:
    "Tu personal access token es invalido o ha expirado.",
  [AUTH_ERROR_CODES.CURRENT_PAT]:
    "Tu personal access token no tiene permisos/scope suficiente.",
});

const syncCoordinator = createSyncCoordinator({ cooldownMs: 60_000 });

let runtimePatStorePromise = null;
let autoRefreshBootstrapped = false;

function getRuntimePatStore() {
  if (!runtimePatStorePromise) {
    runtimePatStorePromise = loadPatSessionStore({
      storage: figma.clientStorage,
      cipherKey: "github-preview-widget/phase-7",
    }).catch(() => createPatSessionStore());
  }
  return runtimePatStorePromise;
}

function openWidgetUi() {
  figma.showUI(__html__, {
    width: 420,
    height: 420,
    title: "GitHub Preview Widget",
  });
}

function deriveSourceKey(url, embedBlock, embedSnapshot, authContext) {
  if (typeof embedBlock?.sourceKey === "string" && embedBlock.sourceKey) {
    return embedBlock.sourceKey;
  }
  if (typeof embedSnapshot?.sourceKey === "string" && embedSnapshot.sourceKey) {
    return embedSnapshot.sourceKey;
  }
  if (typeof authContext?.sourceKey === "string" && authContext.sourceKey) {
    return authContext.sourceKey;
  }
  if (typeof url === "string") {
    return url.trim();
  }
  return "";
}

function buildLastResult(snapshot, embedBlock) {
  const snapshotLast = snapshot?.lastResult;
  if (snapshotLast && typeof snapshotLast === "object") {
    return {
      status: snapshotLast.status || "idle",
      mode: snapshotLast.mode || "manual",
      message: snapshotLast.message || "",
      details: snapshotLast.details || "",
      at: snapshotLast.at || snapshot?.updatedAt || new Date().toISOString(),
    };
  }

  const sync = embedBlock?.sync || {};
  return {
    status: sync.status || "idle",
    mode: sync.mode || "manual",
    message: sync.message || "",
    details: sync.details || "",
    at: sync.lastUpdatedAt || new Date().toISOString(),
  };
}

function resolveRuntimeError(pipelineError, auth) {
  const code =
    typeof pipelineError?.code === "string" && pipelineError.code
      ? pipelineError.code
      : "UNKNOWN";
  const authMessage = AUTH_MESSAGES[code];
  const message =
    authMessage ||
    (typeof pipelineError?.message === "string" && pipelineError.message) ||
    "Could not create preview from this URL.";
  const details =
    typeof pipelineError?.details === "string" && pipelineError.details
      ? redactSensitive(pipelineError.details)
      : "";
  const sourceKey =
    typeof auth?.sourceKey === "string" && auth.sourceKey ? auth.sourceKey : null;

  return {
    code,
    message: redactSensitive(message),
    details,
    sourceKey,
    authRequired: Boolean(authMessage),
  };
}

function GitHubPreviewWidget() {
  const [status, setStatus] = useSyncedState(
    "runtime-status",
    "Ready: open URL input"
  );
  const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
  const [embedBlock, setEmbedBlock] = useSyncedState("embed-block", null);
  const [embedSnapshot, setEmbedSnapshot] = useSyncedState("embed-snapshot", null);
  const [authContext, setAuthContext] = useSyncedState("auth-context", null);
  const [autoRefreshMap, setAutoRefreshMap] = useSyncedState(
    "auto-refresh-map",
    {}
  );

  function postRuntimeStatus(level, message, details = "", extras = {}) {
    figma.ui.postMessage({
      type: UI_EVENT.RUNTIME_STATUS,
      level,
      message,
      details,
      ...extras,
    });
  }

  async function runPreviewPipeline(url, trigger, options = {}) {
    const mode = options.mode === SYNC_MODE.AUTO ? SYNC_MODE.AUTO : SYNC_MODE.MANUAL;
    const normalizedUrl = typeof url === "string" ? url.trim() : "";
    if (!normalizedUrl) {
      setStatus("Sync error: MISSING_URL");
      postRuntimeStatus("error", "A GitHub file URL is required.");
      return { ok: false, skipped: true };
    }

    const sourceKeyForRun =
      typeof options.sourceKey === "string" && options.sourceKey
        ? options.sourceKey
        : deriveSourceKey(normalizedUrl, embedBlock, embedSnapshot, authContext);

    let lockAcquired = false;
    if (!options.skipManualLock) {
      const lock = syncCoordinator.beginManual({
        sourceKey: sourceKeyForRun,
        syncStatus: embedBlock?.sync?.status,
      });

      if (!lock.ok) {
        setStatus("Syncing...");
        postRuntimeStatus("loading", "Syncing...", "", {
          reason: lock.reason,
        });
        return { ok: false, skipped: true, reason: lock.reason };
      }

      lockAcquired = true;
    }

    try {
      setStatus(mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...");
      postRuntimeStatus("loading", mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...");
      if (mode === SYNC_MODE.MANUAL) {
        figma.notify("Syncing...");
      }

      const patStore = await getRuntimePatStore();
      const pipeline = await createOrRefreshEmbedFromUrl({
        url: normalizedUrl,
        currentEmbedBlock: embedBlock,
        currentSnapshot: embedSnapshot,
        patStore,
        mode,
      });

      if (!pipeline.ok) {
        if (pipeline.value?.embedBlock) {
          setEmbedBlock(pipeline.value.embedBlock);
        }
        if (pipeline.value?.snapshot) {
          setEmbedSnapshot(pipeline.value.snapshot);
        }

        const runtimeError = resolveRuntimeError(pipeline.error, pipeline.auth);
        const nextAuthContext =
          runtimeError.authRequired && runtimeError.sourceKey
            ? {
                sourceKey: runtimeError.sourceKey,
                code: runtimeError.code,
                url: normalizedUrl,
              }
            : null;
        setAuthContext(nextAuthContext);

        const lastResult = buildLastResult(
          pipeline.value?.snapshot,
          pipeline.value?.embedBlock
        );

        setStatus(`Sync error: ${runtimeError.code}`);
        postRuntimeStatus("error", runtimeError.message, runtimeError.details, {
          code: runtimeError.code,
          sourceKey: runtimeError.sourceKey,
          authRequired: runtimeError.authRequired,
          syncState: pipeline.value?.embedBlock?.sync?.status || "error",
          lastResult,
        });

        if (mode === SYNC_MODE.MANUAL) {
          figma.notify(runtimeError.message, { error: true });
        }
        return pipeline;
      }

      setLastUrl(normalizedUrl);
      setEmbedBlock(pipeline.value.embedBlock);
      setEmbedSnapshot(pipeline.value.snapshot);
      setAuthContext(null);

      const lastResult = buildLastResult(pipeline.value.snapshot, pipeline.value.embedBlock);
      const successMessage =
        mode === SYNC_MODE.AUTO ? "Auto-sync completed." : "Preview created.";

      setStatus(mode === SYNC_MODE.AUTO ? `Auto-sync ready (${trigger})` : `Preview ready (${trigger})`);
      postRuntimeStatus("success", successMessage, "", {
        syncState: pipeline.value.embedBlock?.sync?.status || "success",
        lastResult,
      });

      if (mode === SYNC_MODE.MANUAL) {
        figma.notify("Preview created.");
      }

      return pipeline;
    } finally {
      if (lockAcquired) {
        syncCoordinator.endManual(sourceKeyForRun);
      }
    }
  }

  function maybeRunAutoRefresh(origin) {
    if (typeof lastUrl !== "string" || !lastUrl.trim()) {
      return false;
    }

    const sourceKey = deriveSourceKey(lastUrl, embedBlock, embedSnapshot, authContext);
    const lastAutoRefreshAtMs = Number(autoRefreshMap?.[sourceKey] || 0);
    const decision = shouldRunAutoRefresh(
      {
        sourceKey,
        sourceUrl: lastUrl,
        syncStatus: embedBlock?.sync?.status,
        lastAutoRefreshAtMs,
        nowMs: Date.now(),
      },
      {
        cooldownMs: syncCoordinator.cooldownMs,
      }
    );

    if (!decision.ok) {
      return false;
    }

    setAutoRefreshMap({
      ...(autoRefreshMap || {}),
      [sourceKey]: decision.nowMs,
    });

    void runPreviewPipeline(lastUrl, `auto-${origin}`, {
      mode: SYNC_MODE.AUTO,
      skipManualLock: true,
      sourceKey,
    });

    return true;
  }

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Set GitHub URL",
        propertyName: "open-url",
      },
      {
        itemType: "action",
        tooltip: "Refresh preview",
        propertyName: "refresh-now",
      },
    ],
    (event) => {
      if (event.propertyName === "open-url") {
        openWidgetUi();
        figma.ui.postMessage({
          type: UI_EVENT.WIDGET_CONTEXT,
          widgetId: "active-widget",
          lastUrl,
          status,
          authContext,
          lastResult: buildLastResult(embedSnapshot, embedBlock),
          syncState: embedBlock?.sync?.status || "idle",
        });

        void maybeRunAutoRefresh("open-url");
        return;
      }

      if (event.propertyName === "refresh-now") {
        if (!lastUrl) {
          setStatus("Refresh blocked: no URL set");
          postRuntimeStatus("error", "No URL available for refresh.");
          figma.notify("No URL available for refresh.", { error: true });
          return;
        }

        void runPreviewPipeline(lastUrl, "property-menu-refresh", {
          mode: SYNC_MODE.MANUAL,
        });
      }
    }
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      const parsed = parseUiCommand(message);
      if (!parsed.ok) {
        setStatus(`Bridge error: ${parsed.error.code}`);
        postRuntimeStatus("error", parsed.error.message);
        figma.notify(parsed.error.message, { error: true });
        return;
      }

      const command = parsed.value;
      if (command.type === UI_COMMAND.CREATE_PREVIEW) {
        void runPreviewPipeline(command.url, "create", {
          mode: SYNC_MODE.MANUAL,
        });
        return;
      }

      if (command.type === UI_COMMAND.REFRESH_PREVIEW) {
        const refreshUrl = lastUrl;
        if (!refreshUrl) {
          setStatus("Refresh blocked: no URL set");
          postRuntimeStatus("error", "No URL available for refresh.");
          figma.notify("No URL available for refresh.", { error: true });
          return;
        }

        void runPreviewPipeline(refreshUrl, "refresh", {
          mode: SYNC_MODE.MANUAL,
        });
        return;
      }

      if (command.type === UI_COMMAND.SUBMIT_PAT) {
        void (async () => {
          const patStore = await getRuntimePatStore();
          patStore.set(command.sourceKey, command.token);
          await patStore.flush();

          const retryUrl =
            (authContext &&
            typeof authContext === "object" &&
            authContext.sourceKey === command.sourceKey &&
            typeof authContext.url === "string"
              ? authContext.url
              : "") || lastUrl;

          if (!retryUrl) {
            setStatus("PAT saved, waiting for URL");
            postRuntimeStatus("success", "PAT guardado para este fichero.", "", {
              sourceKey: command.sourceKey,
            });
            figma.notify("PAT guardado para este fichero.");
            return;
          }

          setStatus("PAT actualizado. Reintentando...");
          postRuntimeStatus("loading", "Reintentando con PAT actualizado...", "", {
            sourceKey: command.sourceKey,
          });
          figma.notify("Reintentando con PAT actualizado...");
          await runPreviewPipeline(retryUrl, "pat-retry", {
            mode: SYNC_MODE.MANUAL,
            sourceKey: command.sourceKey,
          });
        })();
        return;
      }

      if (command.type === UI_COMMAND.FORGET_PAT) {
        void (async () => {
          const patStore = await getRuntimePatStore();
          patStore.remove(command.sourceKey);
          await patStore.flush();

          if (
            authContext &&
            typeof authContext === "object" &&
            authContext.sourceKey === command.sourceKey
          ) {
            setAuthContext(null);
          }

          setStatus("PAT olvidado para este fichero");
          postRuntimeStatus("success", "PAT olvidado para este fichero.", "", {
            sourceKey: command.sourceKey,
          });
          figma.notify("PAT olvidado para este fichero.");
        })();
      }
    };

    if (!autoRefreshBootstrapped && lastUrl) {
      autoRefreshBootstrapped = true;
      void maybeRunAutoRefresh("resume");
    }

    return () => {
      figma.ui.onmessage = undefined;
    };
  });

  const lastResult = buildLastResult(embedSnapshot, embedBlock);

  return h(
    AutoLayout,
    {
      direction: "vertical",
      width: 420,
      spacing: 8,
      padding: 12,
      fill: "#FFFFFF",
      stroke: "#D9D9D9",
      cornerRadius: 8,
    },
    h(Text, { fontSize: 12, fontWeight: 600 }, "GitHub Preview Widget"),
    h(Text, { fontSize: 11, fill: "#5C5C5C" }, status),
    h(
      Text,
      { fontSize: 10, fill: "#7A7A7A" },
      lastUrl ? `Last URL: ${lastUrl}` : "No URL captured yet"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#7A7A7A" },
      embedBlock
        ? `Embed: ${embedBlock.sections.header.ownerRepo} · ${embedBlock.sections.header.path}`
        : "Embed: pending"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#7A7A7A" },
      embedBlock
        ? `Sync: ${embedBlock.sections.header.statusBadge.label} · ${embedBlock.sections.header.lastSync}`
        : "Sync: idle"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#8B8B8B" },
      embedSnapshot
        ? `Warnings: ${embedSnapshot.warningCount || 0} · Progressive: ${embedSnapshot.render?.progressive ? "yes" : "no"}`
        : "Warnings: 0 · Progressive: no"
    ),
    h(
      Text,
      { fontSize: 10, fill: "#8B8B8B" },
      `Last result: ${lastResult.status || "idle"} (${lastResult.mode || "manual"})`
    )
  );
}

widget.register(GitHubPreviewWidget);
