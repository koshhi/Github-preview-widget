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

function parseHttpsUrl(inputUrl) {
  const trimmed = String(inputUrl || "").trim();
  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);

  if (schemeMatch && schemeMatch[1].toLowerCase() !== "https") {
    return parseError(URL_ERROR_CODES.UNSUPPORTED_ROUTE, "Only HTTPS URLs are supported.");
  }

  const match = trimmed.match(/^https:\/\/([^/?#]+)(\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i);
  if (!match) {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Invalid URL format.");
  }

  const hostname = String(match[1] || "").toLowerCase();
  const pathname = match[2] && match[2].length > 0 ? match[2] : "/";

  if (!hostname) {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "Invalid URL host.");
  }

  return {
    ok: true,
    value: {
      hostname,
      pathname,
    },
  };
}

function parseGithubFileUrl(inputUrl) {
  if (typeof inputUrl !== "string" || inputUrl.trim() === "") {
    return parseError(URL_ERROR_CODES.INVALID_FORMAT, "URL must be a non-empty string.");
  }

  const parsedUrl = parseHttpsUrl(inputUrl);
  if (!parsedUrl.ok) {
    return parsedUrl;
  }

  if (parsedUrl.value.hostname === "github.com") {
    return parseBlobPath(parsedUrl.value);
  }

  if (parsedUrl.value.hostname === "raw.githubusercontent.com") {
    return parseRawPath(parsedUrl.value);
  }

  return parseError(
    URL_ERROR_CODES.UNSUPPORTED_HOST,
    "Only github.com and raw.githubusercontent.com hosts are supported."
  );
}

module.exports = {
  parseGithubFileUrl,
};
