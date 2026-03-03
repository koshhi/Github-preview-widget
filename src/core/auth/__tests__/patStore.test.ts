const test = require("node:test");
const assert = require("node:assert/strict");

const { createPatStore } = require("../patStore.ts");

const SOURCE_KEY = "octocat/hello-world@main:docs/readme.md";

test("set/get stores PAT by sourceKey", () => {
  const store = createPatStore();
  store.set(SOURCE_KEY, "  ghp_123  ");

  const record = store.get(SOURCE_KEY);
  assert.equal(record.sourceKey, SOURCE_KEY);
  assert.equal(record.token, "ghp_123");
  assert.equal(record.status, "unknown");
});

test("manual PAT replacement resets status and error markers", () => {
  const store = createPatStore();
  store.set(SOURCE_KEY, "ghp_old");
  store.markInvalid(SOURCE_KEY, "expired_pat", "2026-03-02T10:00:00.000Z");

  const updated = store.set(SOURCE_KEY, "ghp_new");
  assert.equal(updated.token, "ghp_new");
  assert.equal(updated.status, "unknown");
  assert.equal(updated.lastErrorCode, undefined);
  assert.equal(updated.lastValidatedAt, undefined);
});

test("markInvalid keeps token and stores invalid state", () => {
  const store = createPatStore();
  store.set(SOURCE_KEY, "ghp_abc");

  const updated = store.markInvalid(
    SOURCE_KEY,
    "current_pat",
    "2026-03-02T10:30:00.000Z"
  );

  assert.equal(updated.token, "ghp_abc");
  assert.equal(updated.status, "invalid");
  assert.equal(updated.lastErrorCode, "current_pat");
  assert.equal(updated.lastValidatedAt, "2026-03-02T10:30:00.000Z");
});

test("remove deletes PAT record", () => {
  const store = createPatStore();
  store.set(SOURCE_KEY, "ghp_delete");

  assert.equal(store.remove(SOURCE_KEY), true);
  assert.equal(store.get(SOURCE_KEY), null);
  assert.equal(store.remove(SOURCE_KEY), false);
});
