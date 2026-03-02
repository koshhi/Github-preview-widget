const PAT_STATUS = Object.freeze({
  UNKNOWN: "unknown",
  VALID: "valid",
  INVALID: "invalid",
});

const PAT_ERROR_CODES = Object.freeze({
  MISSING_PAT: "missing_pat",
  EXPIRED_PAT: "expired_pat",
  CURRENT_PAT: "current_pat",
});

module.exports = {
  PAT_STATUS,
  PAT_ERROR_CODES,
};
