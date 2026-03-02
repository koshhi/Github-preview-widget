const test = require("node:test");
const assert = require("node:assert/strict");

const { highlightCode } = require("../highlightCode.ts");

test("highlights basic javascript keywords", () => {
  const result = highlightCode({
    content: "const value = 1;\nfunction add(a,b){ return a+b; }",
    extension: "js",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "code");
  assert.match(result.value.blocks[0].content, /‹const›/);
  assert.match(result.value.blocks[0].content, /‹function›/);
  assert.match(result.value.blocks[0].content, /‹return›/);
});

test("pretty-prints minified json", () => {
  const result = highlightCode({
    content: '{"name":"widget","enabled":true,"count":2}',
    extension: "json",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "code");
  assert.match(result.value.blocks[0].content, /\n  “enabled”: ‹true›/);
});

test("falls back to text with warning for invalid json", () => {
  const result = highlightCode({
    content: '{"name":"widget",,}',
    extension: "json",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "text");
  assert.equal(result.value.warnings.length, 1);
  assert.match(result.value.warnings[0], /JSON inválido/i);
});

test("renders txt as plain text block", () => {
  const result = highlightCode({
    content: "plain text content",
    extension: "txt",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "text");
  assert.equal(result.value.blocks[0].type, "text");
  assert.equal(result.value.blocks[0].content, "plain text content");
});
