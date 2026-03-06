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

test("parses GFM task lists, blockquotes and autolinks", () => {
  const input = [
    "- [x] done",
    "- [ ] todo",
    "",
    "> quoted line",
    "",
    "Visit https://example.com and ~~archive~~ this.",
    "Jump to [toc](#encabezados).",
  ].join("\n");

  const result = renderMarkdown(input);
  assert.equal(result.ok, true);

  const list = result.value.blocks.find((block) => block.type === "list");
  const quote = result.value.blocks.find((block) => block.type === "blockquote");
  const paragraph = result.value.blocks.find((block) => block.type === "paragraph");

  assert.ok(list);
  assert.equal(list.items[0].task.checked, true);
  assert.equal(list.items[1].task.checked, false);
  assert.ok(quote);
  assert.match(quote.content, /quoted line/i);
  assert.ok(paragraph);
  assert.match(paragraph.content, /\[https:\/\/example\.com\]\(https:\/\/example\.com\)/);
  assert.match(paragraph.content, /\[toc\]\(#encabezados\)/);
  assert.match(paragraph.content, /~~archive~~/);
});

test("preserves ordered list start and nested list depth in GFM", () => {
  const input = [
    "3. third",
    "4. fourth",
    "    - nested bullet",
    "      - deeper nested",
  ].join("\n");

  const result = renderMarkdown(input);
  assert.equal(result.ok, true);

  const orderedList = result.value.blocks.find(
    (block) => block.type === "list" && block.ordered
  );
  assert.ok(orderedList);
  assert.equal(orderedList.start, 3);
  assert.equal(orderedList.items[0].depth, 1);
  assert.equal("task" in orderedList.items[0], false);
  assert.equal("task" in orderedList.items[1], false);
  assert.equal(orderedList.items.every((item) => Number(item.depth) >= 1), true);
});
