const test = require("node:test");
const assert = require("node:assert/strict");

const { SYNC_MODE } = require("../../core/canvas/types.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("../runtime/createOrRefreshEmbedFromUrl.ts");
const { buildWidgetSnapshot, mergeWidgetSnapshot } = require("../runtime/persistWidgetSnapshot.ts");

test("snapshot persists lastResult with sync status/mode/details", async () => {
  const result = await createOrRefreshEmbedFromUrl(
    {
      url: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
      mode: SYNC_MODE.AUTO,
      now: "2026-03-03T15:00:00.000Z",
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
          content: "# Auto refresh",
        },
      }),
      renderFilePreview: () => ({
        ok: true,
        value: {
          kind: "markdown",
          blocks: [{ type: "heading", depth: 1, content: "Auto refresh" }],
          warnings: [],
          truncated: false,
          progressive: false,
          metrics: { firstPreviewMs: 44, cacheHit: false },
        },
      }),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.embedBlock.sync.mode, "auto");
  assert.equal(result.value.snapshot.syncState, "success");
  assert.equal(result.value.snapshot.lastResult.status, "success");
  assert.equal(result.value.snapshot.lastResult.mode, "auto");
  assert.match(result.value.snapshot.lastResult.message, /Auto-sync|Preview/);
});

test("mergeWidgetSnapshot keeps previous render while updating lastResult", () => {
  const base = buildWidgetSnapshot({
    embedBlock: {
      sourceKey: "octocat/hello-world@main:docs/README.md",
      sync: {
        status: "success",
        mode: "manual",
        message: "Preview created",
        details: "",
        lastUpdatedAt: "2026-03-03T15:01:00.000Z",
      },
      preview: {
        kind: "markdown",
        blocks: [{ type: "text", content: "ok" }],
        warnings: [],
        truncated: false,
        progressive: false,
      },
    },
    sourceUrl: "https://github.com/octocat/hello-world/blob/main/docs/README.md",
    updatedAt: "2026-03-03T15:01:00.000Z",
  });

  const merged = mergeWidgetSnapshot(base, {
    syncState: "error",
    lastResult: {
      status: "error",
      mode: "auto",
      message: "Sync error",
      details: "Timeout",
    },
    updatedAt: "2026-03-03T15:02:00.000Z",
  });

  assert.equal(merged.render.kind, "markdown");
  assert.equal(merged.syncState, "error");
  assert.equal(merged.lastResult.status, "error");
  assert.equal(merged.lastResult.mode, "auto");
  assert.equal(merged.lastResult.details, "Timeout");
});
