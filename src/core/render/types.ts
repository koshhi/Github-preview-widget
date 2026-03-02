const RENDER_KIND = Object.freeze({
  CODE: "code",
  TEXT: "text",
  MARKDOWN: "markdown",
});

const DEFAULT_RENDER_POLICY = Object.freeze({
  maxFullRenderBytes: 300 * 1024,
  progressivePreviewBytes: 120 * 1024,
  targetFirstPreviewMs: 2000,
});

const EXTENSION_TO_LANGUAGE = Object.freeze({
  js: "javascript",
  ts: "typescript",
  json: "json",
  txt: "text",
  md: "markdown",
});

module.exports = {
  RENDER_KIND,
  DEFAULT_RENDER_POLICY,
  EXTENSION_TO_LANGUAGE,
};
