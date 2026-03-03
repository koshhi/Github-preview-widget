const { parseUiCommand } = require("./bridge/parseUiCommand.ts");
const { UI_COMMAND, UI_EVENT } = require("./bridge/messages.ts");
const { createSeedEmbed } = require("./bootstrap/createSeedEmbed.ts");

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
        });
      }
    }
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      const parsed = parseUiCommand(message);
      if (!parsed.ok) {
        setStatus(`Bridge error: ${parsed.error.code}`);
        return;
      }

      const command = parsed.value;
      if (command.type === UI_COMMAND.CREATE_PREVIEW) {
        setLastUrl(command.url);
        const seed = createSeedEmbed({ url: command.url });
        if (!seed.ok) {
          setStatus(`Seed failed: ${seed.error.code}`);
          figma.notify(seed.error.message, { error: true });
          return;
        }

        setEmbedBlock(seed.value.embedBlock);
        setStatus(`Seed ready: ${seed.value.source.sourceKey}`);
        figma.notify("Seed preview created.");
        return;
      }

      if (command.type === UI_COMMAND.REFRESH_PREVIEW) {
        setStatus("Refresh command received (placeholder in phase 5).");
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
    )
  );
}

widget.register(GitHubPreviewWidget);
