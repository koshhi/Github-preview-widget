const { parseUiCommand } = require("./bridge/parseUiCommand.ts");
const { UI_COMMAND, UI_EVENT } = require("./bridge/messages.ts");

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
        setStatus("URL received. Seed preview requested.");
        figma.notify("URL received. Runtime bootstrap OK.");
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
    )
  );
}

widget.register(GitHubPreviewWidget);
