const test = require("node:test");
const assert = require("node:assert/strict");

const { PAT_ERROR_CODES } = require("../../core/auth/types.ts");
const { REDACTED, redactSensitive } = require("../runtime/redactSensitive.ts");
const {
  DEFAULT_STORAGE_KEY,
  createPatSessionStore,
  loadPatSessionStore,
} = require("../runtime/patSessionStore.ts");

function createMemoryStorage() {
  const data = new Map();

  return {
    async getAsync(key) {
      return data.get(key);
    },
    async setAsync(key, value) {
      data.set(key, value);
    },
    async deleteAsync(key) {
      data.delete(key);
    },
    dump() {
      return new Map(data);
    },
  };
}

test("redacts known PAT patterns from strings and objects", () => {
  const input = {
    message: "Authorization failed with Bearer ghp_1234567890ABCDE",
    details:
      "Resource not accessible by personal access token github_pat_11AA22BB33CC44DD55EE66FF",
  };

  const redacted = redactSensitive(input);

  assert.equal(redacted.message.includes("ghp_"), false);
  assert.equal(redacted.details.includes("github_pat_"), false);
  assert.match(redacted.message, /\[REDACTED_TOKEN\]/);
  assert.equal(REDACTED, "[REDACTED_TOKEN]");
});

test("persists PAT records encrypted and restores them across store reloads", async () => {
  const storage = createMemoryStorage();
  const sourceKey = "octocat/hello-world@main:docs/private.md";
  const token = "ghp_SUPERSECRET123456789";

  const store = createPatSessionStore({
    storage,
    cipherKey: "phase-7-secret",
  });

  store.set(sourceKey, token);
  store.markInvalid(sourceKey, PAT_ERROR_CODES.EXPIRED_PAT, "2026-03-03T13:15:00.000Z");
  await store.flush();

  const persistedPayload = await storage.getAsync(DEFAULT_STORAGE_KEY);
  assert.equal(typeof persistedPayload, "string");
  assert.equal(persistedPayload.includes(token), false);

  const restored = await loadPatSessionStore({
    storage,
    cipherKey: "phase-7-secret",
  });

  const restoredRecord = restored.get(sourceKey);
  assert.equal(restoredRecord.token, token);
  assert.equal(restoredRecord.status, "invalid");
  assert.equal(restoredRecord.lastErrorCode, PAT_ERROR_CODES.EXPIRED_PAT);
});

test("forgets PAT and clears persisted storage when last record is removed", async () => {
  const storage = createMemoryStorage();
  const sourceKey = "octocat/hello-world@main:docs/private.md";
  const token = "ghp_DELETE_ME_123456789";

  const store = createPatSessionStore({
    storage,
    cipherKey: "phase-7-secret",
  });

  store.set(sourceKey, token);
  await store.flush();

  assert.equal(Boolean(await storage.getAsync(DEFAULT_STORAGE_KEY)), true);

  store.remove(sourceKey);
  await store.flush();

  assert.equal(await storage.getAsync(DEFAULT_STORAGE_KEY), undefined);
  assert.equal(store.get(sourceKey), null);
});
