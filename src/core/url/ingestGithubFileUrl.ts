const { parseGithubFileUrl } = require("./parseGithubFileUrl.ts");
const { validateGithubFileUrl } = require("./validateGithubFileUrl.ts");
const { toUserFacingUrlError } = require("./errors.ts");

function ingestGithubFileUrl(inputUrl) {
  const parsed = parseGithubFileUrl(inputUrl);
  if (!parsed.ok) {
    return {
      ok: false,
      error: toUserFacingUrlError(parsed.error),
    };
  }

  const validated = validateGithubFileUrl(parsed.value);
  if (!validated.ok) {
    return {
      ok: false,
      error: toUserFacingUrlError(validated.error),
    };
  }

  const normalized = validated.value;
  return {
    ok: true,
    value: {
      sourceType: normalized.sourceType,
      owner: normalized.owner,
      repo: normalized.repo,
      ref: normalized.ref,
      path: normalized.path,
      extension: normalized.extension,
      fileKind: normalized.fileKind,
      canonicalBlobUrl: normalized.canonicalBlobUrl,
      sourceKey: `${normalized.owner}/${normalized.repo}@${normalized.ref}:${normalized.path}`,
    },
  };
}

module.exports = {
  ingestGithubFileUrl,
};
