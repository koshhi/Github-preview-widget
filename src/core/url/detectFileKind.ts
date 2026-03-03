const { URL_ERROR_CODES, SUPPORTED_EXTENSIONS } = require("./types.ts");

const EXTENSION_TO_KIND = Object.freeze({
  md: "markdown",
  txt: "text",
  json: "json",
  js: "javascript",
  ts: "typescript",
});

function detectFileKind(path) {
  if (typeof path !== "string" || path.trim() === "") {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.NOT_A_FILE,
        details: "File path is required.",
      },
    };
  }

  const trimmed = path.trim();
  if (trimmed.endsWith("/")) {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.NOT_A_FILE,
        details: "Path points to a directory, not a file.",
      },
    };
  }

  const fileName = trimmed.split("/").pop();
  if (!fileName || !fileName.includes(".")) {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.NOT_A_FILE,
        details: "Path does not contain a valid file name with extension.",
      },
    };
  }

  const extension = fileName.split(".").pop().toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.UNSUPPORTED_EXTENSION,
        details: `Extension .${extension} is not supported in v1.`,
      },
    };
  }

  return {
    ok: true,
    value: {
      extension,
      fileKind: EXTENSION_TO_KIND[extension] || "text",
    },
  };
}

module.exports = {
  detectFileKind,
};
