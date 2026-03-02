const { AUTH_KINDS } = require("./types.ts");

function normalizeText(value) {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function classifyAuthError(input) {
  const status = Number(input?.status || 0);
  const tokenProvided = Boolean(input?.tokenProvided);
  const body = normalizeText(input?.responseBody);
  const wwwAuthenticate = normalizeText(input?.wwwAuthenticate);
  const diagnostic = `${body} ${wwwAuthenticate}`.trim();

  if (!tokenProvided) {
    if (status === 401 || status === 403 || status === 404) {
      return { kind: AUTH_KINDS.MISSING_PAT, recoverable: true };
    }
    return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
  }

  if (status === 401) {
    return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
  }

  if (status === 404) {
    return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
  }

  if (status === 403) {
    if (
      diagnostic.includes("insufficient") ||
      diagnostic.includes("scope") ||
      diagnostic.includes("resource not accessible by personal access token") ||
      diagnostic.includes("permission")
    ) {
      return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
    }

    if (
      diagnostic.includes("expired") ||
      diagnostic.includes("revoked") ||
      diagnostic.includes("bad credentials") ||
      diagnostic.includes("invalid")
    ) {
      return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
    }

    return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
  }

  return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
}

module.exports = {
  classifyAuthError,
};
