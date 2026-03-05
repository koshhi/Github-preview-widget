const test = require("node:test");
const assert = require("node:assert/strict");

const { createSeedEmbed } = require("../bootstrap/createSeedEmbed.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("../runtime/createOrRefreshEmbedFromUrl.ts");

test("runs URL -> read -> render pipeline and returns updated block + snapshot", async () => {
  const url = "https://github.com/octocat/hello-world/blob/main/docs/README.md";

  const readMock = async () => ({
    ok: true,
    value: {
      sourceKey: "octocat/hello-world@main:docs/README.md",
      source: {
        owner: "octocat",
        repo: "hello-world",
        ref: "main",
        path: "docs/README.md",
        extension: "md",
      },
      content: "# Title\n\n```mermaid\ngraph TD\nA-->B\n```",
    },
  });

  const renderMock = () => ({
    ok: true,
    value: {
      kind: "markdown",
      blocks: [
        { type: "heading", content: "Title", depth: 1 },
        { type: "mermaid", content: "graph TD\nA-->B" },
      ],
      warnings: ["Mermaid rendered as code for phase 6"],
      truncated: false,
      progressive: true,
      metrics: {
        firstPreviewMs: 125,
        cacheHit: false,
      },
    },
  });

  const result = await createOrRefreshEmbedFromUrl(
    {
      url,
      now: "2026-03-03T12:40:00.000Z",
    },
    {
      readGithubFileWithAuth: readMock,
      renderFilePreview: renderMock,
      normalizePreview: (preview) => ({
        preview: {
          ...preview,
          blocks: preview.blocks.map((block) =>
            block.type === "mermaid"
              ? { type: "code", language: "mermaid", content: block.content }
              : block
          ),
        },
        warnings: preview.warnings,
      }),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.embedBlock.sync.status, "success");
  assert.equal(result.value.embedBlock.sections.header.ownerRepo, "octocat/hello-world");
  assert.equal(result.value.embedBlock.preview.progressive, true);
  assert.equal(result.value.embedBlock.preview.blocks[1].type, "code");
  assert.equal(result.value.snapshot.sourceKey, "octocat/hello-world@main:docs/README.md");
  assert.equal(result.value.snapshot.syncState, "success");
  assert.equal(result.value.snapshot.warningCount, 1);
});

test("keeps previous content when read fails and marks sync error", async () => {
  const seed = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
  });

  assert.equal(seed.ok, true);
  const previousBlock = seed.value.embedBlock;
  const previousBlocks = JSON.stringify(previousBlock.preview.blocks);

  const result = await createOrRefreshEmbedFromUrl(
    {
      url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
      currentEmbedBlock: previousBlock,
      now: "2026-03-03T12:41:00.000Z",
    },
    {
      readGithubFileWithAuth: async () => ({
        ok: false,
        error: {
          code: "MISSING_PAT",
          message: "Private file requires token",
          details: "No PAT for sourceKey",
        },
        auth: {
          kind: "missing_pat",
          sourceKey: "octocat/hello-world@main:docs/README.md",
          usedPat: false,
          retryCount: 0,
          patStatus: "missing",
        },
      }),
    }
  );

  assert.equal(result.ok, false);
  assert.equal(result.auth.kind, "missing_pat");
  assert.equal(result.auth.sourceKey, "octocat/hello-world@main:docs/README.md");
  assert.equal(result.value.embedBlock.sync.status, "error");
  assert.equal(JSON.stringify(result.value.embedBlock.preview.blocks), previousBlocks);
  assert.match(result.value.embedBlock.sync.details, /PAT|sourceKey/i);
});

test("updates in-place when URL changes on same instance", async () => {
  const seed = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/OLD.md",
  });
  assert.equal(seed.ok, true);

  const initialId = seed.value.embedBlock.id;

  const result = await createOrRefreshEmbedFromUrl(
    {
      url: "https://github.com/octocat/hello-world/blob/main/docs/NEW.md",
      currentEmbedBlock: seed.value.embedBlock,
      now: "2026-03-03T12:42:00.000Z",
    },
    {
      readGithubFileWithAuth: async () => ({
        ok: true,
        value: {
          sourceKey: "octocat/hello-world@main:docs/NEW.md",
          source: {
            owner: "octocat",
            repo: "hello-world",
            ref: "main",
            path: "docs/NEW.md",
            extension: "md",
          },
          content: "# New",
        },
      }),
      renderFilePreview: () => ({
        ok: true,
        value: {
          kind: "markdown",
          blocks: [{ type: "heading", depth: 1, content: "New" }],
          warnings: [],
          truncated: false,
          progressive: false,
          metrics: { firstPreviewMs: 33, cacheHit: false },
        },
      }),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.embedBlock.id, initialId);
  assert.equal(result.value.embedBlock.source.path, "docs/NEW.md");
  assert.equal(result.value.embedBlock.sourceKey, "octocat/hello-world@main:docs/NEW.md");
});
