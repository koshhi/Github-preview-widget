const test = require("node:test");
const assert = require("node:assert/strict");

const { parseGithubFileUrl } = require("../parseGithubFileUrl.ts");
const { validateGithubFileUrl } = require("../validateGithubFileUrl.ts");
const { toUserFacingUrlError } = require("../errors.ts");

test("validates parsed URL and resolves file kind", () => {
  const parsed = parseGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/spec.md"
  );

  const validated = validateGithubFileUrl(parsed.value);
  assert.equal(validated.ok, true);
  assert.equal(validated.value.extension, "md");
  assert.equal(validated.value.fileKind, "markdown");
});

test("rejects unsupported extension", () => {
  const parsed = parseGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/spec.yaml"
  );

  const validated = validateGithubFileUrl(parsed.value);
  assert.equal(validated.ok, false);
  assert.equal(validated.error.code, "UNSUPPORTED_EXTENSION");
});

test("rejects non-file paths", () => {
  const validated = validateGithubFileUrl({
    sourceType: "blob",
    owner: "octocat",
    repo: "hello-world",
    ref: "main",
    path: "docs/",
  });

  assert.equal(validated.ok, false);
  assert.equal(validated.error.code, "NOT_A_FILE");
});

test("maps internal validation errors to actionable copy", () => {
  const mapped = toUserFacingUrlError({
    code: "UNSUPPORTED_ROUTE",
    details: "Expected blob route.",
  });

  assert.equal(mapped.code, "UNSUPPORTED_ROUTE");
  assert.equal(mapped.message, "La ruta de GitHub no está soportada.");
  assert.match(mapped.action, /blob o raw/);
});
