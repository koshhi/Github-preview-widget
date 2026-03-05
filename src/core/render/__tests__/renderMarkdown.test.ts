const test = require("node:test");
const assert = require("node:assert/strict");

const { renderMarkdown } = require("../renderMarkdown.ts");

test("renders markdown subset: heading, list, table and code block", () => {
  const input = [
    "# Title",
    "",
    "- item one",
    "- item two",
    "",
    "| col1 | col2 |",
    "| ---- | ---- |",
    "| a    | b    |",
    "",
    "```js",
    "const x = 1;",
    "```",
  ].join("\n");

  const result = renderMarkdown(input);
  assert.equal(result.ok, true);

  const types = result.value.blocks.map((block) => block.type);
  assert.ok(types.includes("heading"));
  assert.ok(types.includes("list"));
  assert.ok(types.includes("table"));
  assert.ok(types.includes("code"));
});

test("keeps embedded html as text paragraph", () => {
  const result = renderMarkdown("<div>unsafe</div>");
  assert.equal(result.ok, true);
  assert.equal(result.value.blocks[0].type, "paragraph");
  assert.equal(result.value.blocks[0].meta.htmlEscaped, true);
});

test("renders valid mermaid and falls back invalid mermaid without breaking rest", () => {
  const input = [
    "```mermaid",
    "graph TD",
    "A-->B",
    "```",
    "",
    "```mermaid",
    "this is not valid",
    "```",
    "",
    "Normal paragraph",
  ].join("\n");

  const result = renderMarkdown(input, { mermaidDefaultView: "diagram" });
  assert.equal(result.ok, true);

  const hasMermaid = result.value.blocks.some((block) => block.type === "mermaid");
  const hasMermaidFallbackCode = result.value.blocks.some(
    (block) => block.type === "code" && block.language === "mermaid"
  );

  assert.equal(hasMermaid, true);
  assert.equal(hasMermaidFallbackCode, true);
  assert.equal(result.value.warnings.length >= 1, true);
});

test("degrades unsupported markdown structures to paragraph", () => {
  const result = renderMarkdown(":::note custom container");
  assert.equal(result.ok, true);
  assert.equal(result.value.blocks[0].type, "paragraph");
});

test("parses horizontal rules as divider blocks", () => {
  const input = ["before", "", "---", "", "***", "", "after"].join("\n");
  const result = renderMarkdown(input);
  assert.equal(result.ok, true);
  const types = result.value.blocks.map((block) => block.type);
  assert.deepEqual(types, ["paragraph", "divider", "divider", "paragraph"]);
});
