const test = require("node:test");
const assert = require("node:assert/strict");

const { createPatStore } = require("../../auth/patStore.ts");
const { readGithubFileWithAuth } = require("../readGithubFileWithAuth.ts");

function createMockResponse(status, body, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
    headers: {
      get(name) {
        return headers[String(name).toLowerCase()] || "";
      },
    },
  };
}

function createSequencedFetch(sequence) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({
      url,
      headers: options?.headers || {},
    });

    if (sequence.length === 0) {
      throw new Error("No mock response left for fetch call.");
    }

    const next = sequence.shift();
    return createMockResponse(next.status, next.body, next.headers);
  };

  fetchImpl.calls = calls;
  return fetchImpl;
}

const PRIVATE_URL =
  "https://github.com/octocat/hello-world/blob/main/docs/private.md";

test("returns content on first public attempt when file is public", async () => {
  const fetchImpl = createSequencedFetch([{ status: 200, body: "# public" }]);
  const result = await readGithubFileWithAuth(PRIVATE_URL, { fetchImpl });

  assert.equal(result.ok, true);
  assert.equal(result.value.content, "# public");
  assert.equal(result.auth.usedPat, false);
  assert.equal(fetchImpl.calls.length, 1);
});

test("returns missing PAT message when private file has no stored token", async () => {
  const fetchImpl = createSequencedFetch([{ status: 404, body: "Not Found" }]);
  const result = await readGithubFileWithAuth(PRIVATE_URL, { fetchImpl });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "MISSING_PAT");
  assert.equal(
    result.error.message,
    "El fichero que intentas visualiza es privado. Crea un personal access token para acceder a este fichero."
  );
  assert.equal(fetchImpl.calls.length, 1);
});

test("uses stored PAT and marks it valid after successful private access", async () => {
  const store = createPatStore();
  const sourceKey = "octocat/hello-world@main:docs/private.md";
  store.set(sourceKey, "ghp_valid");

  const fetchImpl = createSequencedFetch([
    { status: 404, body: "Not Found" },
    { status: 200, body: "# private file" },
  ]);

  const result = await readGithubFileWithAuth(PRIVATE_URL, {
    fetchImpl,
    patStore: store,
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.content, "# private file");
  assert.equal(result.auth.usedPat, true);
  assert.equal(fetchImpl.calls.length, 2);
  assert.equal(fetchImpl.calls[1].headers.authorization, "Bearer ghp_valid");
  assert.equal(store.get(sourceKey).status, "valid");
});

test("marks PAT invalid after one retry when token is expired/invalid", async () => {
  const store = createPatStore();
  const sourceKey = "octocat/hello-world@main:docs/private.md";
  store.set(sourceKey, "ghp_expired");

  const fetchImpl = createSequencedFetch([
    { status: 404, body: "Not Found" },
    { status: 401, body: "Bad credentials" },
    { status: 401, body: "Bad credentials" },
  ]);

  const result = await readGithubFileWithAuth(PRIVATE_URL, {
    fetchImpl,
    patStore: store,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "EXPIRED_PAT");
  assert.equal(
    result.error.message,
    "Tu personal access token es invalido o ha expirado (Expired Pat)"
  );
  assert.equal(result.auth.retryCount, 1);
  assert.equal(fetchImpl.calls.length, 3);
  assert.equal(store.get(sourceKey).status, "invalid");
  assert.equal(store.get(sourceKey).lastErrorCode, "expired_pat");
});

test("returns insufficient scope message and keeps PAT as invalid", async () => {
  const store = createPatStore();
  const sourceKey = "octocat/hello-world@main:docs/private.md";
  store.set(sourceKey, "ghp_scope");

  const fetchImpl = createSequencedFetch([
    { status: 404, body: "Not Found" },
    {
      status: 403,
      body: "Resource not accessible by personal access token",
    },
    {
      status: 403,
      body: "Resource not accessible by personal access token",
    },
  ]);

  const result = await readGithubFileWithAuth(PRIVATE_URL, {
    fetchImpl,
    patStore: store,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CURRENT_PAT");
  assert.equal(
    result.error.message,
    "Tu personal access no tiene los permisos/scope suficiente (Current Pat)"
  );
  assert.equal(result.auth.retryCount, 1);
  assert.equal(fetchImpl.calls.length, 3);
  assert.equal(store.get(sourceKey).status, "invalid");
  assert.equal(store.get(sourceKey).lastErrorCode, "current_pat");
});
