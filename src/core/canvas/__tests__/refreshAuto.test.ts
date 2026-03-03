const test = require("node:test");
const assert = require("node:assert/strict");

const { composeEmbedBlock } = require("../composeEmbedBlock.ts");
const {
  isAutoRefreshEligible,
  refreshEligibleBlocksOnOpen,
} = require("../refreshAuto.ts");

function blockFromSource(sourceKey, status = "idle") {
  const path = String(sourceKey).split(":")[1] || "docs/README.md";
  return composeEmbedBlock(
    {
      sourceKey,
      source: {
        owner: "octocat",
        repo: "hello-world",
        ref: "main",
        path,
      },
      preview: {
        kind: "text",
        blocks: [{ type: "text", content: `seed:${sourceKey}` }],
      },
      sync: {
        status,
        mode: "manual",
        message: "Sin sincronizar",
      },
    },
    { now: "2026-03-02T19:15:00.000Z" }
  );
}

test("eligibility requires sourceKey and non-syncing status", () => {
  const eligible = blockFromSource("octocat/hello-world@main:docs/README.md", "idle");
  assert.equal(isAutoRefreshEligible(eligible), true);

  const syncing = blockFromSource("octocat/hello-world@main:docs/README.md", "syncing");
  assert.equal(isAutoRefreshEligible(syncing), false);

  assert.equal(isAutoRefreshEligible({ sourceKey: "", sync: { status: "idle" } }), false);
});

test("auto refresh updates only eligible blocks and marks mode auto on success", async () => {
  const eligible = blockFromSource("octocat/hello-world@main:docs/README.md", "idle");
  const notEligible = blockFromSource("octocat/hello-world@main:docs/README.md", "syncing");

  const result = await refreshEligibleBlocksOnOpen([eligible, notEligible], {
    now: "2026-03-02T19:16:00.000Z",
    fetchContent: async () => ({
      ok: true,
      value: {
        extension: "md",
        content: "# Auto updated",
      },
    }),
  });

  assert.equal(result.blocks.length, 2);
  assert.equal(result.results.length, 2);

  assert.equal(result.blocks[0].sync.status, "success");
  assert.equal(result.blocks[0].sync.mode, "auto");
  assert.equal(result.blocks[0].sync.lastSyncAt, "2026-03-02T19:16:00.000Z");

  assert.equal(result.results[1].skipped, true);
  assert.equal(result.blocks[1].sync.status, "syncing");
});

test("auto refresh failure is non-blocking and preserves previous content", async () => {
  const successBlock = blockFromSource("octocat/hello-world@main:docs/ok.md", "idle");
  const failingBlock = blockFromSource("octocat/hello-world@main:docs/fail.md", "idle");

  const result = await refreshEligibleBlocksOnOpen([successBlock, failingBlock], {
    now: "2026-03-02T19:17:00.000Z",
    fetchContent: async (block) => {
      if (block.source.path.endsWith("fail.md")) {
        return {
          ok: false,
          error: {
            code: "FETCH_FAILED",
            message: "Sync error",
            details: "Timeout",
          },
        };
      }

      return {
        ok: true,
        value: {
          extension: "md",
          content: "# ok",
        },
      };
    },
  });

  assert.equal(result.blocks[0].sync.status, "success");
  assert.equal(result.blocks[1].sync.status, "error");
  assert.equal(result.blocks[1].sync.mode, "auto");
  assert.equal(result.blocks[1].sync.details, "Timeout");
  assert.match(result.blocks[1].preview.blocks[0].content, /seed:/);
  assert.equal(result.results[0].ok, true);
  assert.equal(result.results[1].ok, false);
});
