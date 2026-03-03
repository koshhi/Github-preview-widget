const __html__ = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>GitHub Preview Widget</title>\n    <style>\n      body {\n        margin: 0;\n        font-family: Inter, sans-serif;\n        background: #f7f7f8;\n        color: #1e1e1f;\n      }\n\n      .root {\n        padding: 14px;\n        display: grid;\n        gap: 10px;\n      }\n\n      .label {\n        font-size: 12px;\n        font-weight: 600;\n      }\n\n      input {\n        width: 100%;\n        box-sizing: border-box;\n        padding: 10px;\n        border-radius: 8px;\n        border: 1px solid #d4d4d8;\n        background: #fff;\n        font-size: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 8px;\n        background: #111827;\n        color: #fff;\n        font-size: 12px;\n        font-weight: 600;\n        padding: 10px;\n        cursor: pointer;\n      }\n    </style>\n  </head>\n  <body>\n    <form class=\"root\" id=\"url-form\">\n      <label class=\"label\" for=\"url-input\">GitHub file URL</label>\n      <input id=\"url-input\" placeholder=\"https://github.com/org/repo/blob/main/README.md\" required />\n      <button type=\"submit\">Create preview</button>\n    </form>\n\n    <script>\n      const form = document.getElementById(\"url-form\");\n      const input = document.getElementById(\"url-input\");\n\n      form.addEventListener(\"submit\", (event) => {\n        event.preventDefault();\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"create-preview\",\n              url: input.value,\n            },\n          },\n          \"*\"\n        );\n      });\n    </script>\n  </body>\n</html>\n";
(() => {
  // src/widget/code.ts
  var { widget } = figma;
  var { AutoLayout, Text, useEffect, usePropertyMenu, useSyncedState, h } = widget;
  function openWidgetUi() {
    figma.showUI(__html__, {
      width: 420,
      height: 220,
      title: "GitHub Preview Widget"
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
          propertyName: "open-url"
        }
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
        figma.ui.onmessage = void 0;
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
        cornerRadius: 8
      },
      h(Text, { fontSize: 12, fontWeight: 600 }, "GitHub Preview Widget"),
      h(Text, { fontSize: 11, fill: "#5C5C5C" }, status)
    );
  }
  widget.register(GitHubPreviewWidget);
})();
