const test = require("node:test");
const assert = require("node:assert/strict");

const { composeEmbedBlock } = require("../composeEmbedBlock.ts");
const { refreshBlockManual } = require("../refreshManual.ts");

function createBlock() {
  return composeEmbedBlock(
    {
      sourceKey: "octocat/hello-world@main:docs/README.md",
      source: {
        owner: "octocat",
        repo: "hello-world",
        ref: "main",
        path: "docs/README.md",
      },
      preview: {
        kind: "text",
        blocks: [{ type: "text", content: "old preview" }],
      },
      sync: {
        status: "idle",
        mode: "manual",
        message: "Sin sincronizar",
      },
    },
    { now: "2026-03-02T19:10:00.000Z" }
  );
}

test("manual refresh from header updates preview and sync state", async () => {
  const initial = createBlock();

  const result = await refreshBlockManual(
    {
      block: initial,
      trigger: "header_button",
    },
    {
      now: "2026-03-02T19:11:00.000Z",
      fetchContent: async () => ({
        ok: true,
        value: {
          extension: "md",
          content: "# New content",
        },
      }),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.meta.trigger, "header_button");
  assert.equal(result.value.sync.status, "success");
  assert.equal(result.value.sync.mode, "manual");
  assert.equal(result.value.sync.lastSyncAt, "2026-03-02T19:11:00.000Z");
  assert.notEqual(result.value.preview.blocks[0].content, "old preview");
});

test("manual refresh from context menu preserves previous content on fetch error", async () => {
  const initial = createBlock();

  const result = await refreshBlockManual(
    {
      block: initial,
      trigger: "context_menu",
    },
    {
      now: "2026-03-02T19:12:00.000Z",
      fetchContent: async () => ({
        ok: false,
        error: {
          code: "FETCH_FAILED",
          message: "Sync error",
          details: "403 Forbidden",
        },
      }),
    }
  );

  assert.equal(result.ok, false);
  assert.equal(result.meta.trigger, "context_menu");
  assert.equal(result.value.sync.status, "error");
  assert.equal(result.value.sync.details, "403 Forbidden");
  assert.equal(result.value.preview.blocks[0].content, "old preview");
});
