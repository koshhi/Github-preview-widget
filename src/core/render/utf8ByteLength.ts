function byteLengthUtf8(input) {
  const value = typeof input === "string" ? input : String(input ?? "");

  if (typeof TextEncoder === "function") {
    return new TextEncoder().encode(value).length;
  }

  // Fallback for very old runtimes: percent-encoded byte counting.
  return encodeURIComponent(value).replace(/%[A-F\d]{2}/gi, "x").length;
}

module.exports = {
  byteLengthUtf8,
};
