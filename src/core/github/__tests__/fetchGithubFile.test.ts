const test = require("node:test");
const assert = require("node:assert/strict");

const { fetchGithubFile } = require("../fetchGithubFile.ts");

const SOURCE = {
  owner: "octocat",
  repo: "hello-world",
  ref: "main",
  path: "README.md",
};

test("returns structured error when fetch implementation is missing", async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = undefined;
  let result;
  try {
    result = await fetchGithubFile(SOURCE, { fetchImpl: undefined });
  } finally {
    globalThis.fetch = previousFetch;
  }

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.match(result.body, /fetch implementation is required/i);
});

test("returns timeout error when request exceeds timeout", async () => {
  const neverResolvingFetch = () => new Promise(() => {});

  const result = await fetchGithubFile(SOURCE, {
    fetchImpl: neverResolvingFetch,
    timeoutMs: 25,
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.match(result.body, /timeout/i);
});
