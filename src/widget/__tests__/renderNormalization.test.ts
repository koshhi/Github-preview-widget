const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeRenderForWidget,
} = require("../runtime/normalizeRenderForWidget.ts");

test("converts mermaid blocks to code view and emits warning", () => {
  const result = normalizeRenderForWidget({
    kind: "markdown",
    blocks: [
      { type: "heading", depth: 1, content: "Architecture" },
      { type: "mermaid", content: "graph TD\nA-->B" },
    ],
    warnings: [],
    progressive: false,
    metrics: { firstPreviewMs: 140 },
  });

  assert.equal(result.preview.blocks[1].type, "code");
  assert.equal(result.preview.blocks[1].language, "mermaid");
  assert.match(result.warnings.join(" "), /Mermaid shown as code/i);
  assert.match(result.warningDetail, /Mermaid shown as code/i);
});

test("keeps fallback mermaid code and exposes fallback warning", () => {
  const result = normalizeRenderForWidget({
    kind: "markdown",
    blocks: [
      {
        type: "code",
        language: "mermaid",
        content: "invalid-diagram",
        meta: { fallback: true },
      },
    ],
    warnings: ["Original warning"],
    progressive: true,
    metrics: { firstPreviewMs: 200 },
  });

  assert.equal(result.preview.blocks[0].type, "code");
  assert.equal(result.preview.blocks[0].language, "mermaid");
  assert.ok(result.warnings.includes("Original warning"));
  assert.ok(result.warnings.some((warning) => /fallback/i.test(warning)));
  assert.equal(result.policy.mode, "progressive");
});

test("does not alter non-mermaid markdown blocks", () => {
  const result = normalizeRenderForWidget({
    kind: "markdown",
    blocks: [
      { type: "heading", depth: 2, content: "Title" },
      { type: "paragraph", content: "Body" },
      { type: "table", content: "|A|B|" },
    ],
    warnings: [],
    progressive: false,
    metrics: { firstPreviewMs: 88 },
  });

  assert.equal(result.preview.blocks[0].type, "heading");
  assert.equal(result.preview.blocks[1].type, "paragraph");
  assert.equal(result.preview.blocks[2].type, "table");
  assert.equal(result.warnings.length, 0);
  assert.equal(result.warningDetail, "");
});
