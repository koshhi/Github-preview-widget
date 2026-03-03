const { DEFAULT_RENDER_POLICY } = require("./types.ts");

function resolvePerformancePolicy(input = {}) {
  const inputBytes = Number(input.inputBytes || 0);
  const maxFullRenderBytes = Number(input.maxFullRenderBytes || DEFAULT_RENDER_POLICY.maxFullRenderBytes);
  const progressivePreviewBytes = Number(
    input.progressivePreviewBytes || DEFAULT_RENDER_POLICY.progressivePreviewBytes
  );
  const targetFirstPreviewMs = Number(
    input.targetFirstPreviewMs || DEFAULT_RENDER_POLICY.targetFirstPreviewMs
  );

  const mode = inputBytes > maxFullRenderBytes ? "progressive" : "full";
  const previewBytes = mode === "progressive"
    ? Math.min(progressivePreviewBytes, inputBytes)
    : inputBytes;

  return {
    mode,
    maxFullRenderBytes,
    previewBytes,
    targetFirstPreviewMs,
    shouldTruncate: mode === "progressive",
  };
}

module.exports = {
  resolvePerformancePolicy,
};
