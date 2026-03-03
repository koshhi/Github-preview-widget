const test = require("node:test");
const assert = require("node:assert/strict");

const { parseGithubFileUrl } = require("../parseGithubFileUrl.ts");

test("parses github blob URL into owner/repo/ref/path", () => {
  const result = parseGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/main/docs/spec.md"
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.sourceType, "blob");
  assert.equal(result.value.owner, "octocat");
  assert.equal(result.value.repo, "hello-world");
  assert.equal(result.value.ref, "main");
  assert.equal(result.value.path, "docs/spec.md");
});

test("parses raw URL into owner/repo/ref/path", () => {
  const result = parseGithubFileUrl(
    "https://raw.githubusercontent.com/octocat/hello-world/main/docs/spec.md"
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.sourceType, "raw");
  assert.equal(result.value.owner, "octocat");
  assert.equal(result.value.repo, "hello-world");
  assert.equal(result.value.ref, "main");
  assert.equal(result.value.path, "docs/spec.md");
});

test("supports encoded refs with slash semantics", () => {
  const result = parseGithubFileUrl(
    "https://github.com/octocat/hello-world/blob/feature%2Fui/docs/spec.md"
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.ref, "feature/ui");
  assert.equal(result.value.path, "docs/spec.md");
});

test("returns unsupported host error", () => {
  const result = parseGithubFileUrl("https://gitlab.com/octocat/repo/blob/main/file.md");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_HOST");
});

test("returns unsupported route error for github tree URLs", () => {
  const result = parseGithubFileUrl(
    "https://github.com/octocat/hello-world/tree/main/docs"
  );

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_ROUTE");
});

test("returns invalid format error for malformed url", () => {
  const result = parseGithubFileUrl("not-a-url");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "INVALID_FORMAT");
});
