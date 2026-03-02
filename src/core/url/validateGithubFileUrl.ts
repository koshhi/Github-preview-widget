const { URL_ERROR_CODES } = require("./types.ts");
const { detectFileKind } = require("./detectFileKind.ts");

function validateGithubFileUrl(parsedUrl) {
  if (!parsedUrl || typeof parsedUrl !== "object") {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.INVALID_FORMAT,
        details: "Parsed URL object is required.",
      },
    };
  }

  const { owner, repo, ref, path, sourceType } = parsedUrl;
  if (!owner || !repo || !ref || !path || !sourceType) {
    return {
      ok: false,
      error: {
        code: URL_ERROR_CODES.INVALID_FORMAT,
        details: "Parsed URL must include owner, repo, ref, path and sourceType.",
      },
    };
  }

  const kindResult = detectFileKind(path);
  if (!kindResult.ok) {
    return kindResult;
  }

  return {
    ok: true,
    value: {
      ...parsedUrl,
      extension: kindResult.value.extension,
      fileKind: kindResult.value.fileKind,
      canonicalBlobUrl: `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`,
    },
  };
}

module.exports = {
  validateGithubFileUrl,
};
