const { URL_ERROR_CODES } = require("./types.ts");

function parseError(code, details) {
  return {
    ok: false,
    error: {
      code,
      details,
    },
  };
}

function parseBlobPath(urlObj) {
  const segments = urlObj.pathname.split("/").filter(Boolean);

  if (segments.length < 5) {
    return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Blob URL path is too short.");
  }

  const [owner, repo, routeMarker, ...rest] = segments;
  if (routeMarker !== "blob") {
    return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Only /blob/ routes are supported for github.com URLs.");
  }

  if (rest.length < 2) {
    return parseError(URL_ERROR_CODES.NOT_A_FILE, "The URL must point to a file path after /blob/{ref}/.");
  }

  const ref = decodeURIComponent(rest[0]);
  const path = rest.slice(1).map(decodeURIComponent).join("/");

  if (!owner || !repo || !ref || !path) {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Could not extract owner/repo/ref/path from blob URL.");
  }

  return {
    ok: true,
    value: {
      sourceType: "blob",
      owner,
      repo,
      ref,
      path,
    },
  };
}

function parseRawPath(urlObj) {
  const segments = urlObj.pathname.split("/").filter(Boolean);

  if (segments.length < 4) {
    return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "raw.githubusercontent.com URL path is too short.");
  }

  const [owner, repo, ref, ...pathSegments] = segments;
  if (pathSegments.length < 1) {
    return parseError(URL_ERROR_CODES.NOT_A_FILE, "The URL must include a file path after /{ref}/.");
  }

  const path = pathSegments.map(decodeURIComponent).join("/");
  const decodedRef = decodeURIComponent(ref);

  if (!owner || !repo || !decodedRef || !path) {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Could not extract owner/repo/ref/path from raw URL.");
  }

  return {
    ok: true,
    value: {
      sourceType: "raw",
      owner,
      repo,
      ref: decodedRef,
      path,
    },
  };
}

function parseGithubFileUrl(inputUrl) {
  if (typeof inputUrl !== "string" || inputUrl.trim() === "") {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "URL must be a non-empty string.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch (error) {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, `Invalid URL: ${error.message}`);
  }

  if (parsedUrl.protocol !== "https:") {
    return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Only HTTPS URLs are supported.");
  }

  if (parsedUrl.hostname === "github.com") {
    return parseBlobPath(parsedUrl);
  }

  if (parsedUrl.hostname === "raw.githubusercontent.com") {
    return parseRawPath(parsedUrl);
  }

  return parseError(
    URL_ERROR_CODES.UNSUPPORTED_HOST,
    "Only github.com and raw.githubusercontent.com hosts are supported."
  );
}

module.exports = {
  parseGithubFileUrl,
};
