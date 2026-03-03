const test = require("node:test");
const assert = require("node:assert/strict");

const { renderFilePreview } = require("../renderFilePreview.ts");

test("renders small javascript file in full mode", () => {
  const result = renderFilePreview({
    sourceKey: "octo/repo@main:src/index.js",
    extension: "js",
    content: "const value = 1;\nreturn value;",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.progressive, false);
  assert.equal(result.value.truncated, false);
  assert.equal(result.value.kind, "code");
  assert.match(result.value.blocks[0].content, /‹const›/);
});

test("switches to progressive mode for content above size limit", () => {
  const bigContent = "x".repeat(350 * 1024);
  const result = renderFilePreview({
    sourceKey: "octo/repo@main:docs/big.txt",
    extension: "txt",
    content: bigContent,
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.progressive, true);
  assert.equal(result.value.truncated, true);
  assert.equal(result.value.metrics.renderBytes < result.value.metrics.inputBytes, true);
  assert.equal(result.value.warnings.length >= 1, true);
});

test("renders markdown with mixed mermaid validity in partial fallback mode", () => {
  const content = [
    "```mermaid",
    "graph TD",
    "A-->B",
    "```",
    "",
    "```mermaid",
    "invalid mermaid",
    "```",
  ].join("\n");

  const result = renderFilePreview({
    sourceKey: "octo/repo@main:docs/diagram.md",
    extension: "md",
    content,
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "markdown");
  assert.equal(result.value.blocks.some((block) => block.type === "mermaid"), true);
  assert.equal(
    result.value.blocks.some((block) => block.type === "code" && block.language === "mermaid"),
    true
  );
});

test("reuses cache on subsequent render for same source and content", () => {
  const input = {
    sourceKey: "octo/repo@main:src/cache.js",
    extension: "js",
    content: "const cache = true;",
  };

  const first = renderFilePreview(input);
  const second = renderFilePreview(input);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.value.metrics.cacheHit, false);
  assert.equal(second.value.metrics.cacheHit, true);
  assert.equal(second.value.metrics.firstPreviewMs, 0);
});
