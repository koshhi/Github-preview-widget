const REDACTED = "[REDACTED_TOKEN]";

const TOKEN_PATTERNS = [
  /\bgh[pousr]_[A-Za-z0-9_]{8,}\b/gi,
  /\bgithub_pat_[A-Za-z0-9_]{16,}\b/gi,
  /\bBearer\s+[A-Za-z0-9._\-+/=]{8,}\b/gi,
  /\btoken\s+[A-Za-z0-9._\-+/=]{8,}\b/gi,
];

function redactString(input) {
  if (typeof input !== "string" || input.length === 0) {
    return "";
  }

  let output = input;
  for (const pattern of TOKEN_PATTERNS) {
    output = output.replace(pattern, REDACTED);
  }

  return output;
}

function redactSensitive(value) {
  if (typeof value === "string") {
    return redactString(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => redactSensitive(entry));
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, entry] of Object.entries(value)) {
      next[key] = redactSensitive(entry);
    }
    return next;
  }

  return value;
}

module.exports = {
  REDACTED,
  redactSensitive,
};
