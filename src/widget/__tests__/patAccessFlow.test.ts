const test = require("node:test");
const assert = require("node:assert/strict");

const { createSeedEmbed } = require("../bootstrap/createSeedEmbed.ts");
const { createPatSessionStore } = require("../runtime/patSessionStore.ts");
const {
  createOrRefreshEmbedFromUrl,
} = require("../runtime/createOrRefreshEmbedFromUrl.ts");

const PRIVATE_URL =
  "https://github.com/octocat/hello-world/blob/main/docs/private.md";
const PRIVATE_SOURCE_KEY = "octocat/hello-world@main:docs/private.md";

function renderMock() {
  return {
    ok: true,
    value: {
      kind: "markdown",
      blocks: [{ type: "heading", depth: 1, content: "Private file" }],
      warnings: [],
      truncated: false,
      progressive: false,
      metrics: { firstPreviewMs: 55, cacheHit: false },
    },
  };
}

test("private flow supports missing PAT -> submit PAT -> retry success in same instance", async () => {
  const seed = createSeedEmbed({ url: PRIVATE_URL });
  assert.equal(seed.ok, true);

  const patStore = createPatSessionStore();

  const readMock = async (_url, options = {}) => {
    const record = options.patStore?.get(PRIVATE_SOURCE_KEY);
    if (!record?.token) {
      return {
        ok: false,
        error: {
          code: "MISSING_PAT",
          message:
            "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.",
          details: "No PAT for sourceKey",
        },
        auth: {
          kind: "missing_pat",
          sourceKey: PRIVATE_SOURCE_KEY,
          usedPat: false,
          retryCount: 0,
          patStatus: "missing",
        },
      };
    }

    return {
      ok: true,
      value: {
        sourceKey: PRIVATE_SOURCE_KEY,
        source: {
          owner: "octocat",
          repo: "hello-world",
          ref: "main",
          path: "docs/private.md",
          extension: "md",
        },
        content: "# private file",
      },
      auth: {
        kind: null,
        sourceKey: PRIVATE_SOURCE_KEY,
        usedPat: true,
        retryCount: 0,
        patStatus: "valid",
      },
    };
  };

  const firstAttempt = await createOrRefreshEmbedFromUrl(
    {
      url: PRIVATE_URL,
      currentEmbedBlock: seed.value.embedBlock,
      patStore,
      now: "2026-03-03T13:20:00.000Z",
    },
    {
      readGithubFileWithAuth: readMock,
      renderFilePreview: renderMock,
    }
  );

  assert.equal(firstAttempt.ok, false);
  assert.equal(firstAttempt.error.code, "MISSING_PAT");
  assert.equal(firstAttempt.auth.kind, "missing_pat");
  assert.equal(firstAttempt.auth.sourceKey, PRIVATE_SOURCE_KEY);
  assert.equal(firstAttempt.value.embedBlock.sync.status, "error");

  patStore.set(PRIVATE_SOURCE_KEY, "ghp_VALID_1234567890");

  const retryAttempt = await createOrRefreshEmbedFromUrl(
    {
      url: PRIVATE_URL,
      currentEmbedBlock: firstAttempt.value.embedBlock,
      currentSnapshot: firstAttempt.value.snapshot,
      patStore,
      now: "2026-03-03T13:21:00.000Z",
    },
    {
      readGithubFileWithAuth: readMock,
      renderFilePreview: renderMock,
    }
  );

  assert.equal(retryAttempt.ok, true);
  assert.equal(retryAttempt.value.embedBlock.id, seed.value.embedBlock.id);
  assert.equal(retryAttempt.value.embedBlock.sync.status, "success");
  assert.equal(retryAttempt.value.embedBlock.sourceKey, PRIVATE_SOURCE_KEY);
  assert.equal(retryAttempt.value.snapshot.sourceKey, PRIVATE_SOURCE_KEY);
});

test("redacts token-like strings from sync error and snapshot details", async () => {
  const seed = createSeedEmbed({ url: PRIVATE_URL });
  assert.equal(seed.ok, true);

  const result = await createOrRefreshEmbedFromUrl(
    {
      url: PRIVATE_URL,
      currentEmbedBlock: seed.value.embedBlock,
      now: "2026-03-03T13:22:00.000Z",
    },
    {
      readGithubFileWithAuth: async () => ({
        ok: false,
        error: {
          code: "EXPIRED_PAT",
          message: "Bad credentials for ghp_SECRET_TOKEN_ABC12345",
          details: "Authorization failed: Bearer ghp_SECRET_TOKEN_ABC12345",
        },
        auth: {
          kind: "expired_pat",
          sourceKey: PRIVATE_SOURCE_KEY,
          usedPat: true,
          retryCount: 1,
          patStatus: "invalid",
        },
      }),
    }
  );

  assert.equal(result.ok, false);
  assert.equal(result.value.embedBlock.sync.status, "error");
  assert.equal(result.value.embedBlock.sync.details.includes("ghp_SECRET"), false);
  assert.match(result.value.embedBlock.sync.details, /\[REDACTED_TOKEN\]/);
  assert.equal(JSON.stringify(result.value.snapshot).includes("ghp_SECRET"), false);
});
