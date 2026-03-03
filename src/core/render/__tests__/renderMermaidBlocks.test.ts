const test = require("node:test");
const assert = require("node:assert/strict");

const { renderMermaidBlocks } = require("../renderMermaidBlocks.ts");

test("renders valid mermaid block with toggle metadata", () => {
  const inputBlocks = [
    { type: "code", language: "mermaid", content: "graph TD\nA-->B" },
  ];

  const result = renderMermaidBlocks(inputBlocks);
  assert.equal(result.warnings.length, 0);
  assert.equal(result.blocks[0].type, "mermaid");
  assert.deepEqual(result.blocks[0].meta.views, ["diagram", "code"]);
  assert.equal(result.blocks[0].meta.toggleEnabled, true);
});

test("falls back to code for invalid mermaid syntax", () => {
  const inputBlocks = [
    { type: "code", language: "mermaid", content: "not mermaid at all" },
  ];

  const result = renderMermaidBlocks(inputBlocks);
  assert.equal(result.blocks[0].type, "code");
  assert.equal(result.blocks[0].meta.fallback, true);
  assert.equal(result.warnings.length, 1);
});

test("keeps non-mermaid blocks untouched", () => {
  const inputBlocks = [
    { type: "paragraph", content: "Hello" },
    { type: "code", language: "js", content: "const x = 1;" },
  ];

  const result = renderMermaidBlocks(inputBlocks);
  assert.equal(result.blocks[0].type, "paragraph");
  assert.equal(result.blocks[1].language, "js");
  assert.equal(result.warnings.length, 0);
});
