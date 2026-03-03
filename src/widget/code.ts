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
      }
    }
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      if (!message || typeof message !== "object") {
        return;
      }

      if (message.type === "create-preview") {
        setStatus("URL received. Preview bootstrap enabled.");
        figma.notify("URL received. Runtime bootstrap OK.");
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
    h(Text, { fontSize: 11, fill: "#5C5C5C" }, status)
  );
}

widget.register(GitHubPreviewWidget);
