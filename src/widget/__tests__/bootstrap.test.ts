const test = require("node:test");
const assert = require("node:assert/strict");

const { createSeedMetadata } = require("../bootstrap/widgetMetadata.ts");
const { createSeedEmbed } = require("../bootstrap/createSeedEmbed.ts");

test("creates seed metadata with default sync state", () => {
  const metadata = createSeedMetadata("octocat/hello-world@main:README.md", {
    now: "2026-03-03T10:00:00.000Z",
  });

  assert.equal(metadata.sourceKey, "octocat/hello-world@main:README.md");
  assert.equal(metadata.syncState, "idle");
  assert.equal(metadata.syncMode, "manual");
  assert.equal(metadata.lastSync, null);
  assert.equal(metadata.source.owner, "octocat");
  assert.equal(metadata.createdAt, "2026-03-03T10:00:00.000Z");
});

test("creates seed embed block from valid GitHub file URL", () => {
  const result = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
    now: "2026-03-03T10:01:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.source.sourceKey, "octocat/hello-world@main:docs/README.md");
  assert.equal(result.value.embedBlock.kind, "github_file_embed");
  assert.ok(result.value.embedBlock.sections.header.ownerRepo.includes("octocat/hello-world"));
  assert.equal(result.value.embedBlock.metadata.syncState, "idle");
});

test("returns actionable error for invalid URL", () => {
  const result = createSeedEmbed({ url: "https://github.com/octocat/hello-world" });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_ROUTE");
});
