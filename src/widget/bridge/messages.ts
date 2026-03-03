const UI_COMMAND = Object.freeze({
  CREATE_PREVIEW: "create-preview",
  REFRESH_PREVIEW: "refresh-preview",
  SUBMIT_PAT: "submit-pat",
  FORGET_PAT: "forget-pat",
});

const UI_EVENT = Object.freeze({
  WIDGET_CONTEXT: "widget-context",
  RUNTIME_STATUS: "runtime-status",
});

function createCreatePreviewCommand(url) {
  return {
    type: UI_COMMAND.CREATE_PREVIEW,
    url: String(url || "").trim(),
  };
}

function createRefreshPreviewCommand(widgetId) {
  return {
    type: UI_COMMAND.REFRESH_PREVIEW,
    widgetId: String(widgetId || "").trim(),
  };
}

function createSubmitPatCommand(sourceKey, token) {
  return {
    type: UI_COMMAND.SUBMIT_PAT,
    sourceKey: String(sourceKey || "").trim(),
    token: String(token || "").trim(),
  };
}

function createForgetPatCommand(sourceKey) {
  return {
    type: UI_COMMAND.FORGET_PAT,
    sourceKey: String(sourceKey || "").trim(),
  };
}

module.exports = {
  UI_COMMAND,
  UI_EVENT,
  createCreatePreviewCommand,
  createRefreshPreviewCommand,
  createSubmitPatCommand,
  createForgetPatCommand,
};
