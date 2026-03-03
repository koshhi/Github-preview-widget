const __html__ = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>GitHub Preview Widget</title>\n    <style>\n      body {\n        margin: 0;\n        font-family: Inter, sans-serif;\n        background: #f7f7f8;\n        color: #1e1e1f;\n      }\n\n      .root {\n        padding: 14px;\n        display: grid;\n        gap: 10px;\n      }\n\n      .label {\n        font-size: 12px;\n        font-weight: 600;\n      }\n\n      input {\n        width: 100%;\n        box-sizing: border-box;\n        padding: 10px;\n        border-radius: 8px;\n        border: 1px solid #d4d4d8;\n        background: #fff;\n        font-size: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 8px;\n        background: #111827;\n        color: #fff;\n        font-size: 12px;\n        font-weight: 600;\n        padding: 10px;\n        cursor: pointer;\n      }\n\n      .secondary {\n        background: #e4e4e7;\n        color: #111827;\n      }\n    </style>\n  </head>\n  <body>\n    <form class=\"root\" id=\"url-form\">\n      <label class=\"label\" for=\"url-input\">GitHub file URL</label>\n      <input id=\"url-input\" placeholder=\"https://github.com/org/repo/blob/main/README.md\" required />\n      <button type=\"submit\">Create preview</button>\n      <button class=\"secondary\" id=\"refresh-button\" type=\"button\">Refresh preview</button>\n    </form>\n\n    <script>\n      const form = document.getElementById(\"url-form\");\n      const input = document.getElementById(\"url-input\");\n      const refreshButton = document.getElementById(\"refresh-button\");\n      let activeWidgetId = \"active-widget\";\n\n      form.addEventListener(\"submit\", (event) => {\n        event.preventDefault();\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"create-preview\",\n              url: input.value,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      refreshButton.addEventListener(\"click\", () => {\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"refresh-preview\",\n              widgetId: activeWidgetId,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      window.onmessage = (event) => {\n        const payload = event.data && event.data.pluginMessage;\n        if (!payload || payload.type !== \"widget-context\") {\n          return;\n        }\n\n        if (typeof payload.lastUrl === \"string\" && payload.lastUrl.length > 0) {\n          input.value = payload.lastUrl;\n        }\n\n        if (typeof payload.widgetId === \"string\" && payload.widgetId.length > 0) {\n          activeWidgetId = payload.widgetId;\n        }\n      };\n    </script>\n  </body>\n</html>\n";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/widget/bridge/messages.ts
  var require_messages = __commonJS({
    "src/widget/bridge/messages.ts"(exports, module) {
      var UI_COMMAND2 = Object.freeze({
        CREATE_PREVIEW: "create-preview",
        REFRESH_PREVIEW: "refresh-preview"
      });
      var UI_EVENT2 = Object.freeze({
        WIDGET_CONTEXT: "widget-context",
        RUNTIME_STATUS: "runtime-status"
      });
      function createCreatePreviewCommand(url) {
        return {
          type: UI_COMMAND2.CREATE_PREVIEW,
          url: String(url || "").trim()
        };
      }
      function createRefreshPreviewCommand(widgetId) {
        return {
          type: UI_COMMAND2.REFRESH_PREVIEW,
          widgetId: String(widgetId || "").trim()
        };
      }
      module.exports = {
        UI_COMMAND: UI_COMMAND2,
        UI_EVENT: UI_EVENT2,
        createCreatePreviewCommand,
        createRefreshPreviewCommand
      };
    }
  });

  // src/widget/bridge/parseUiCommand.ts
  var require_parseUiCommand = __commonJS({
    "src/widget/bridge/parseUiCommand.ts"(exports, module) {
      var { UI_COMMAND: UI_COMMAND2 } = require_messages();
      function fail(code, message) {
        return {
          ok: false,
          error: {
            code,
            message
          }
        };
      }
      function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
      }
      function parseUiCommand2(payload) {
        if (!isPlainObject(payload)) {
          return fail("INVALID_PAYLOAD", "Expected an object command payload.");
        }
        if (typeof payload.type !== "string") {
          return fail("INVALID_TYPE", "Command payload must include a string 'type'.");
        }
        if (payload.type === UI_COMMAND2.CREATE_PREVIEW) {
          if (typeof payload.url !== "string" || payload.url.trim().length === 0) {
            return fail("INVALID_URL", "create-preview requires a non-empty URL.");
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.CREATE_PREVIEW,
              url: payload.url.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.REFRESH_PREVIEW) {
          if (typeof payload.widgetId !== "string" || payload.widgetId.trim().length === 0) {
            return fail(
              "INVALID_WIDGET_ID",
              "refresh-preview requires a non-empty widgetId."
            );
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.REFRESH_PREVIEW,
              widgetId: payload.widgetId.trim()
            }
          };
        }
        return fail("UNSUPPORTED_COMMAND", `Unsupported command type: ${payload.type}`);
      }
      module.exports = {
        parseUiCommand: parseUiCommand2
      };
    }
  });

  // src/widget/code.ts
  var { parseUiCommand } = require_parseUiCommand();
  var { UI_COMMAND, UI_EVENT } = require_messages();
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
    const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
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
          figma.ui.postMessage({
            type: UI_EVENT.WIDGET_CONTEXT,
            widgetId: "active-widget",
            lastUrl
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
      h(Text, { fontSize: 11, fill: "#5C5C5C" }, status),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        lastUrl ? `Last URL: ${lastUrl}` : "No URL captured yet"
      )
    );
  }
  widget.register(GitHubPreviewWidget);
})();
