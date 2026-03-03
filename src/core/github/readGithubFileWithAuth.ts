const { ingestGithubFileUrl } = require("../url/ingestGithubFileUrl.ts");
const { createPatStore } = require("../auth/patStore.ts");
const { PAT_ERROR_CODES } = require("../auth/types.ts");
const { AUTH_KINDS } = require("./types.ts");
const { fetchGithubFile } = require("./fetchGithubFile.ts");
const { classifyAuthError } = require("./classifyAuthError.ts");
const { getAuthUxMessage } = require("./authUxMessages.ts");

function toPatErrorCode(kind) {
  if (kind === AUTH_KINDS.EXPIRED_PAT) return PAT_ERROR_CODES.EXPIRED_PAT;
  if (kind === AUTH_KINDS.CURRENT_PAT) return PAT_ERROR_CODES.CURRENT_PAT;
  return PAT_ERROR_CODES.MISSING_PAT;
}

function buildAuthError(kind, details) {
  const ux = getAuthUxMessage(kind);
  return {
    code: ux.code,
    message: ux.message,
    action: ux.action,
    details: details || "",
  };
}

async function readGithubFileWithAuth(inputUrl, options = {}) {
  const ingestResult = ingestGithubFileUrl(inputUrl);
  if (!ingestResult.ok) {
    return ingestResult;
  }

  const source = ingestResult.value;
  const sourceKey = source.sourceKey;
  const patStore = options.patStore || createPatStore();
  const fetchImpl = options.fetchImpl;

  const publicAttempt = await fetchGithubFile(source, { fetchImpl });
  if (publicAttempt.ok) {
    return {
      ok: true,
      value: {
        source,
        sourceKey,
        content: publicAttempt.content,
      },
      auth: {
        kind: null,
        sourceKey,
        usedPat: false,
        retryCount: 0,
      },
    };
  }

  const storedPat = patStore.get(sourceKey);
  if (!storedPat?.token) {
    const authResult = classifyAuthError({
      status: publicAttempt.status,
      tokenProvided: false,
      responseBody: publicAttempt.body,
      wwwAuthenticate: publicAttempt.headers?.wwwAuthenticate,
    });

    if (authResult.kind === AUTH_KINDS.MISSING_PAT) {
      return {
        ok: false,
        error: buildAuthError(AUTH_KINDS.MISSING_PAT, publicAttempt.body),
        auth: {
          kind: AUTH_KINDS.MISSING_PAT,
          sourceKey,
          usedPat: false,
          retryCount: 0,
          patStatus: "missing",
        },
      };
    }

    return {
      ok: false,
      error: {
        code: "FETCH_FAILED",
        message: "No se pudo leer el fichero remoto.",
        action: "Reintenta más tarde.",
        details: publicAttempt.body || `HTTP ${publicAttempt.status}`,
      },
      auth: {
        kind: AUTH_KINDS.NON_AUTH_ERROR,
        sourceKey,
        usedPat: false,
        retryCount: 0,
      },
    };
  }

  let lastTokenAttempt = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    lastTokenAttempt = await fetchGithubFile(source, {
      token: storedPat.token,
      fetchImpl,
    });

    if (lastTokenAttempt.ok) {
      patStore.markValid(sourceKey);
      return {
        ok: true,
        value: {
          source,
          sourceKey,
          content: lastTokenAttempt.content,
        },
        auth: {
          kind: null,
          sourceKey,
          usedPat: true,
          retryCount: attempt,
        },
      };
    }
  }

  const classified = classifyAuthError({
    status: lastTokenAttempt.status,
    tokenProvided: true,
    responseBody: lastTokenAttempt.body,
    wwwAuthenticate: lastTokenAttempt.headers?.wwwAuthenticate,
  });

  if (
    classified.kind === AUTH_KINDS.EXPIRED_PAT ||
    classified.kind === AUTH_KINDS.CURRENT_PAT
  ) {
    patStore.markInvalid(sourceKey, toPatErrorCode(classified.kind));
    return {
      ok: false,
      error: buildAuthError(classified.kind, lastTokenAttempt.body),
      auth: {
        kind: classified.kind,
        sourceKey,
        usedPat: true,
        retryCount: 1,
        patStatus: "invalid",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "FETCH_FAILED",
      message: "No se pudo leer el fichero remoto.",
      action: "Reintenta más tarde.",
      details: lastTokenAttempt.body || `HTTP ${lastTokenAttempt.status}`,
    },
    auth: {
      kind: AUTH_KINDS.NON_AUTH_ERROR,
      sourceKey,
      usedPat: true,
      retryCount: 1,
      patStatus: "unknown",
    },
  };
}

module.exports = {
  readGithubFileWithAuth,
};
