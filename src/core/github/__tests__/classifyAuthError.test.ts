const test = require("node:test");
const assert = require("node:assert/strict");

const { classifyAuthError } = require("../classifyAuthError.ts");

test("classifies missing PAT when public attempt returns 404", () => {
  const result = classifyAuthError({
    status: 404,
    tokenProvided: false,
  });

  assert.equal(result.kind, "missing_pat");
  assert.equal(result.recoverable, true);
});

test("classifies expired PAT on 401 with token", () => {
  const result = classifyAuthError({
    status: 401,
    tokenProvided: true,
    responseBody: "Bad credentials",
  });

  assert.equal(result.kind, "expired_pat");
});

test("classifies insufficient scope on 403 scope message", () => {
  const result = classifyAuthError({
    status: 403,
    tokenProvided: true,
    responseBody: "Resource not accessible by personal access token",
  });

  assert.equal(result.kind, "current_pat");
});

test("classifies non-auth errors as non_auth_error", () => {
  const result = classifyAuthError({
    status: 500,
    tokenProvided: true,
    responseBody: "Internal server error",
  });

  assert.equal(result.kind, "non_auth_error");
  assert.equal(result.recoverable, false);
});
