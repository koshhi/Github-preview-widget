function encodePath(pathValue) {
  return pathValue
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function buildGithubContentsApiUrl(source) {
  const encodedPath = encodePath(source.path);
  const encodedRef = encodeURIComponent(source.ref);
  return `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${encodedPath}?ref=${encodedRef}`;
}

async function fetchGithubFile(source, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new TypeError("fetch implementation is required.");
  }

  const token = options.token;
  const apiUrl = buildGithubContentsApiUrl(source);
  const headers = {
    accept: "application/vnd.github.raw+json",
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetchImpl(apiUrl, {
      method: "GET",
      headers,
    });

    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      content: response.ok ? body : null,
      body,
      headers: {
        wwwAuthenticate: response.headers?.get?.("www-authenticate") || "",
      },
      request: {
        url: apiUrl,
        tokenUsed: Boolean(token),
      },
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      content: null,
      body: error?.message || String(error),
      headers: {
        wwwAuthenticate: "",
      },
      request: {
        url: apiUrl,
        tokenUsed: Boolean(token),
      },
    };
  }
}

module.exports = {
  fetchGithubFile,
};
