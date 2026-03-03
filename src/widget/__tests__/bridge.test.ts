const test = require("node:test");
const assert = require("node:assert/strict");

const {
  UI_COMMAND,
  createCreatePreviewCommand,
  createRefreshPreviewCommand,
  createSubmitPatCommand,
  createForgetPatCommand,
} = require("../bridge/messages.ts");
const { parseUiCommand } = require("../bridge/parseUiCommand.ts");

test("creates and parses create-preview command", () => {
  const command = createCreatePreviewCommand(
    "https://github.com/octocat/hello-world/blob/main/README.md"
  );
  const parsed = parseUiCommand(command);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.type, UI_COMMAND.CREATE_PREVIEW);
  assert.match(parsed.value.url, /^https:\/\/github\.com\//);
});

test("creates and parses refresh-preview command", () => {
  const command = createRefreshPreviewCommand("widget-123");
  const parsed = parseUiCommand(command);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.type, UI_COMMAND.REFRESH_PREVIEW);
  assert.equal(parsed.value.widgetId, "widget-123");
});

test("rejects invalid create-preview payload", () => {
  const parsed = parseUiCommand({ type: UI_COMMAND.CREATE_PREVIEW, url: "" });

  assert.equal(parsed.ok, false);
  assert.equal(parsed.error.code, "INVALID_URL");
});

test("creates and parses submit-pat command", () => {
  const command = createSubmitPatCommand(
    "octocat/hello-world@main:docs/private.md",
    "ghp_1234567890PAT"
  );
  const parsed = parseUiCommand(command);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.type, UI_COMMAND.SUBMIT_PAT);
  assert.equal(parsed.value.sourceKey, "octocat/hello-world@main:docs/private.md");
  assert.equal(parsed.value.token, "ghp_1234567890PAT");
});

test("creates and parses forget-pat command", () => {
  const command = createForgetPatCommand("octocat/hello-world@main:docs/private.md");
  const parsed = parseUiCommand(command);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.type, UI_COMMAND.FORGET_PAT);
  assert.equal(parsed.value.sourceKey, "octocat/hello-world@main:docs/private.md");
});

test("rejects unsupported command type", () => {
  const parsed = parseUiCommand({ type: "unknown-command" });

  assert.equal(parsed.ok, false);
  assert.equal(parsed.error.code, "UNSUPPORTED_COMMAND");
});
