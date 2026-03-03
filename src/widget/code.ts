const { parseUiCommand } = require("./bridge/parseUiCommand.ts");
const { UI_COMMAND, UI_EVENT } = require("./bridge/messages.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("./runtime/createOrRefreshEmbedFromUrl.ts");

const { widget } = figma;
const { AutoLayout, Text, useEffect, usePropertyMenu, useSyncedState, h } = widget;

function openWidgetUi() {
  figma.showUI(__html__, {
    width: 420,
    height: 220,
    title: "GitHub Preview Widget",
  });
}

function GitHubPreviewWidget() {
  const [status, setStatus] = useSyncedState(
    "runtime-status",
    "Ready: open URL input"
  );
  const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
  const [embedBlock, setEmbedBlock] = useSyncedState("embed-block", null);
  const [embedSnapshot, setEmbedSnapshot] = useSyncedState("embed-snapshot", null);

  function postRuntimeStatus(level, message, details = "") {
    figma.ui.postMessage({
      type: UI_EVENT.RUNTIME_STATUS,
      level,
      message,
      details,
    });
  }

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Set GitHub URL",
        propertyName: "open-url",
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
        });
      }
    }
  );

  useEffect(() => {
    const runPreviewPipeline = async (url, trigger) => {
      setStatus("Syncing...");
      postRuntimeStatus("loading", "Syncing...");
      figma.notify("Syncing...");

      const pipeline = await createOrRefreshEmbedFromUrl({
        url,
        currentEmbedBlock: embedBlock,
        currentSnapshot: embedSnapshot,
      });

      if (!pipeline.ok) {
        if (pipeline.value?.embedBlock) {
          setEmbedBlock(pipeline.value.embedBlock);
        }
        if (pipeline.value?.snapshot) {
          setEmbedSnapshot(pipeline.value.snapshot);
        }

        const errorMessage =
          pipeline.error?.message || "Could not create preview from this URL.";
        const errorDetails = pipeline.error?.details || "";

        setStatus(`Sync error: ${pipeline.error?.code || "UNKNOWN"}`);
        postRuntimeStatus("error", errorMessage, errorDetails);
        figma.notify(errorMessage, { error: true });
        return;
      }

      setLastUrl(url);
      setEmbedBlock(pipeline.value.embedBlock);
      setEmbedSnapshot(pipeline.value.snapshot);
      setStatus(`Preview ready (${trigger})`);
      postRuntimeStatus("success", "Preview created.");
      figma.notify("Preview created.");
    };

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
        void runPreviewPipeline(command.url, "create");
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

        void runPreviewPipeline(refreshUrl, "refresh");
      }
    };

    return () => {
      figma.ui.onmessage = undefined;
    };
  });

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
    )
  );
}

widget.register(GitHubPreviewWidget);
