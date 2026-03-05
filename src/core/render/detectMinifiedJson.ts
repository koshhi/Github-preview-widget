const { byteLengthUtf8 } = require("./utf8ByteLength.ts");

function detectMinifiedJson(content, options = {}) {
  if (typeof content !== "string") {
    return { isMinified: false, reason: "not_string" };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { isMinified: false, reason: "empty" };
  }

  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
    return { isMinified: false, reason: "not_json_shape" };
  }

  const maxBytesForPrettyPrint = Number(options.maxBytesForPrettyPrint || 250 * 1024);
  const bytes = byteLengthUtf8(trimmed);
  if (bytes > maxBytesForPrettyPrint) {
    return { isMinified: false, reason: "too_large_for_pretty_print" };
  }

  try {
    JSON.parse(trimmed);
  } catch {
    return { isMinified: false, reason: "invalid_json" };
  }

  const hasNewLine = /[\r\n]/.test(trimmed);
  if (hasNewLine) {
    return { isMinified: false, reason: "already_multiline" };
  }

  const compact = trimmed.length >= 20;
  const whitespaceCount = (trimmed.match(/\s/g) || []).length;
  const whitespaceRatio = whitespaceCount / Math.max(trimmed.length, 1);
  const punctuationDensity = ((trimmed.match(/[,:{}\[\]]/g) || []).length / Math.max(trimmed.length, 1)) > 0.15;

  if (compact && whitespaceRatio < 0.02 && punctuationDensity) {
    return { isMinified: true, reason: "single_line_compact_json" };
  }

  return { isMinified: false, reason: "not_compact_enough" };
}

module.exports = {
  detectMinifiedJson,
};
