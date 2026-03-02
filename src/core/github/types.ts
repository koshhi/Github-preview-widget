const AUTH_KINDS = Object.freeze({
  MISSING_PAT: "missing_pat",
  EXPIRED_PAT: "expired_pat",
  CURRENT_PAT: "current_pat",
  NON_AUTH_ERROR: "non_auth_error",
});

const AUTH_UI_CODES = Object.freeze({
  MISSING_PAT: "MISSING_PAT",
  EXPIRED_PAT: "EXPIRED_PAT",
  CURRENT_PAT: "CURRENT_PAT",
});

module.exports = {
  AUTH_KINDS,
  AUTH_UI_CODES,
};
