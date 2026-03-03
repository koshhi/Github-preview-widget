const { UI_COMMAND } = require("./messages.ts");

function fail(code, message) {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseUiCommand(payload) {
  if (!isPlainObject(payload)) {
    return fail("INVALID_PAYLOAD", "Expected an object command payload.");
  }

  if (typeof payload.type !== "string") {
    return fail("INVALID_TYPE", "Command payload must include a string 'type'.");
  }

  if (payload.type === UI_COMMAND.CREATE_PREVIEW) {
    if (typeof payload.url !== "string" || payload.url.trim().length === 0) {
      return fail("INVALID_URL", "create-preview requires a non-empty URL.");
    }

    return {
      ok: true,
      value: {
        type: UI_COMMAND.CREATE_PREVIEW,
        url: payload.url.trim(),
      },
    };
  }

  if (payload.type === UI_COMMAND.REFRESH_PREVIEW) {
    if (typeof payload.widgetId !== "string" || payload.widgetId.trim().length === 0) {
      return fail(
        "INVALID_WIDGET_ID",
        "refresh-preview requires a non-empty widgetId."
      );
    }

    return {
      ok: true,
      value: {
        type: UI_COMMAND.REFRESH_PREVIEW,
        widgetId: payload.widgetId.trim(),
      },
    };
  }

  return fail("UNSUPPORTED_COMMAND", `Unsupported command type: ${payload.type}`);
}

module.exports = {
  parseUiCommand,
};
