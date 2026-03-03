const test = require("node:test");
const assert = require("node:assert/strict");

const { ingestGithubFileUrl } = require("../ingestGithubFileUrl.ts");

test("ingests blob URL successfully", () => {
  const result = ingestGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/readme.md"
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.sourceType, "blob");
  assert.equal(result.value.extension, "md");
  assert.equal(result.value.fileKind, "markdown");
  assert.match(result.value.sourceKey, /^octocat\/hello-world@main:docs\/readme\.md$/);
});

test("ingests raw URL successfully", () => {
  const result = ingestGithubFileUrl(
    "https://raw.githubusercontent.com/octocat/hello-world/main/docs/spec.ts"
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.sourceType, "raw");
  assert.equal(result.value.extension, "ts");
  assert.equal(result.value.fileKind, "typescript");
});

test("returns actionable error for repo root URL", () => {
  const result = ingestGithubFileUrl("https://github.com/octocat/hello-world");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_ROUTE");
  assert.match(result.error.action, /blob o raw/);
});

test("returns actionable error for folder URL", () => {
  const result = ingestGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/"
  );

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "NOT_A_FILE");
});

test("returns actionable error for unsupported extension", () => {
  const result = ingestGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/config.yaml"
  );

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_EXTENSION");
});

test("returns actionable error for malformed URL", () => {
  const result = ingestGithubFileUrl(":::::");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "INVALID_FORMAT");
});
