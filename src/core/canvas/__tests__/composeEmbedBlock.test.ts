const test = require("node:test");
const assert = require("node:assert/strict");

const { composeEmbedBlock } = require("../composeEmbedBlock.ts");

test("composes embed block with native sections header/body/footer", () => {
  const block = composeEmbedBlock(
    {
      sourceKey: "octocat/hello-world@main:docs/README.md",
      source: {
        owner: "octocat",
        repo: "hello-world",
        ref: "main",
        path: "docs/README.md",
      },
      preview: {
        kind: "markdown",
        blocks: [{ type: "text", content: "# Hello" }],
      },
    },
    { now: "2026-03-02T17:00:00.000Z" }
  );

  assert.equal(block.kind, "github_file_embed");
  assert.equal(typeof block.sections, "object");
  assert.equal(typeof block.sections.header, "object");
  assert.equal(typeof block.sections.body, "object");
  assert.equal(typeof block.sections.footer, "object");
});

test("header always includes owner/repo, path and last sync marker", () => {
  const block = composeEmbedBlock({
    sourceKey: "acme/private@main:specs/api.txt",
    source: {
      owner: "acme",
      repo: "private",
      ref: "main",
      path: "specs/api.txt",
    },
    preview: {
      kind: "text",
      blocks: [{ type: "text", content: "contract" }],
    },
  });

  assert.equal(block.sections.header.ownerRepo, "acme/private");
  assert.equal(block.sections.header.path, "specs/api.txt");
  assert.equal(block.sections.header.lastSync, "Nunca");
  assert.equal(block.sections.header.statusBadge.status, "idle");
});

test("supports configurable width and edge resize for canvas border dragging", () => {
  const fixed = composeEmbedBlock({
    sourceKey: "org/repo@main:file.txt",
    source: {
      owner: "org",
      repo: "repo",
      ref: "main",
      path: "file.txt",
    },
    layout: {
      width: 900,
    },
  });

  assert.equal(fixed.layout.width, 900);
  assert.equal(fixed.layout.heightMode, "auto");
  assert.equal(fixed.layout.resizable.edgeDrag, true);

  const clamped = composeEmbedBlock({
    sourceKey: "org/repo@main:file.txt",
    source: {
      owner: "org",
      repo: "repo",
      ref: "main",
      path: "file.txt",
    },
    layout: {
      width: 120,
    },
  });

  assert.equal(clamped.layout.width, 320);
});
