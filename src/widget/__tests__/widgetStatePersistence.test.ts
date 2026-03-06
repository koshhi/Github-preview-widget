const test = require("node:test");
const assert = require("node:assert/strict");

const { createSeedEmbed } = require("../bootstrap/createSeedEmbed.ts");
const {
  buildWidgetSnapshot,
  mergeWidgetSnapshot,
} = require("../runtime/persistWidgetSnapshot.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("../runtime/createOrRefreshEmbedFromUrl.ts");

test("builds minimal persisted snapshot from embed block", () => {
  const seed = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
    now: "2026-03-03T13:00:00.000Z",
  });
  assert.equal(seed.ok, true);

  const snapshot = buildWidgetSnapshot({
    embedBlock: seed.value.embedBlock,
    sourceUrl: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
    warnings: ["example warning"],
    metrics: { firstPreviewMs: 87, cacheHit: false },
    updatedAt: "2026-03-03T13:00:00.000Z",
  });

  assert.equal(snapshot.sourceKey, "octocat/hello-world@main:docs/README.md");
  assert.equal(snapshot.sourceUrl, "https://github.com/octocat/hello-world/blob/main/docs/README.md");
  assert.equal(snapshot.syncState, "idle");
  assert.equal(snapshot.warningCount, 1);
  assert.equal(snapshot.render.kind, "text");
});

test("merges snapshot updates without losing previous render fields", () => {
  const previous = {
    sourceKey: "old/source",
    sourceUrl: "https://github.com/old",
    syncState: "success",
    lastSync: "2026-03-03T13:05:00.000Z",
    warnings: [],
    warningCount: 0,
    render: {
      kind: "markdown",
      blockCount: 4,
      progressive: true,
      truncated: false,
    },
    metrics: {
      firstPreviewMs: 120,
      cacheHit: false,
    },
  };

  const merged = mergeWidgetSnapshot(previous, {
    sourceKey: "new/source",
    sourceUrl: "https://github.com/new",
    syncState: "error",
    warnings: ["network timeout"],
    warningCount: 1,
  });

  assert.equal(merged.sourceKey, "new/source");
  assert.equal(merged.sourceUrl, "https://github.com/new");
  assert.equal(merged.syncState, "error");
  assert.equal(merged.render.kind, "markdown");
  assert.equal(merged.render.blockCount, 4);
  assert.equal(merged.warningCount, 1);
});

test("updates same widget instance while refreshing snapshot for new URL", async () => {
  const initial = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/OLD.md",
  });
  assert.equal(initial.ok, true);

  const initialSnapshot = buildWidgetSnapshot({
    embedBlock: initial.value.embedBlock,
    sourceUrl: "https://github.com/octocat/hello-world/blob/main/docs/OLD.md",
    warnings: [],
  });

  const updated = await createOrRefreshEmbedFromUrl(
    {
      url: "https://github.com/octocat/hello-world/blob/main/docs/NEW.md",
      currentEmbedBlock: initial.value.embedBlock,
      currentSnapshot: initialSnapshot,
      now: "2026-03-03T13:10:00.000Z",
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
          content: "# Updated",
        },
      }),
      renderFilePreview: () => ({
        ok: true,
        value: {
          kind: "markdown",
          blocks: [{ type: "heading", depth: 1, content: "Updated" }],
          warnings: [],
          truncated: false,
          progressive: false,
          metrics: { firstPreviewMs: 40, cacheHit: false },
        },
      }),
    }
  );

  assert.equal(updated.ok, true);
  assert.equal(updated.value.embedBlock.id, initial.value.embedBlock.id);
  assert.equal(updated.value.snapshot.sourceKey, "octocat/hello-world@main:docs/NEW.md");
  assert.equal(
    updated.value.snapshot.sourceUrl,
    "https://github.com/octocat/hello-world/blob/main/docs/NEW.md"
  );
});

test("snapshot render metadata reflects markdown block count after refresh", async () => {
  const initial = createSeedEmbed({
    url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
  });
  assert.equal(initial.ok, true);

  const updated = await createOrRefreshEmbedFromUrl(
    {
      url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
      currentEmbedBlock: initial.value.embedBlock,
      now: "2026-03-06T14:40:00.000Z",
    },
    {
      readGithubFileWithAuth: async () => ({
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
          content: "# Title",
        },
      }),
      renderFilePreview: () => ({
        ok: true,
        value: {
          kind: "markdown",
          blocks: [
            { type: "heading", depth: 1, content: "Title" },
            {
              type: "list",
              ordered: false,
              items: [{ content: "item", depth: 1 }],
            },
          ],
          warnings: [],
          truncated: false,
          progressive: false,
          metrics: { firstPreviewMs: 45, cacheHit: false },
        },
      }),
    }
  );

  assert.equal(updated.ok, true);
  assert.equal(updated.value.snapshot.render.kind, "markdown");
  assert.equal(updated.value.snapshot.render.blockCount, 2);
});
