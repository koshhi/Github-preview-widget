const { PAT_STATUS, PAT_ERROR_CODES } = require("./types.ts");

function assertSourceKey(sourceKey) {
  if (typeof sourceKey !== "string" || sourceKey.trim() === "") {
    throw new TypeError("sourceKey must be a non-empty string.");
  }
}

function normalizeToken(token) {
  if (typeof token !== "string" || token.trim() === "") {
    throw new TypeError("PAT token must be a non-empty string.");
  }
  return token.trim();
}

function assertPatErrorCode(errorCode) {
  if (!Object.values(PAT_ERROR_CODES).includes(errorCode)) {
    throw new TypeError(`Unsupported PAT error code: ${errorCode}`);
  }
}

function cloneRecord(record) {
  if (!record) return null;
  return { ...record };
}

function createPatStore(initialRecords = []) {
  const records = new Map();

  for (const record of initialRecords) {
    if (!record) continue;
    const sourceKey = String(record.sourceKey || "").trim();
    const token = String(record.token || "").trim();
    if (!sourceKey || !token) continue;

    records.set(sourceKey, {
      sourceKey,
      token,
      status: record.status || PAT_STATUS.UNKNOWN,
      lastValidatedAt: record.lastValidatedAt,
      lastErrorCode: record.lastErrorCode,
    });
  }

  return {
    get(sourceKey) {
      assertSourceKey(sourceKey);
      return cloneRecord(records.get(sourceKey.trim()));
    },

    set(sourceKey, token) {
      assertSourceKey(sourceKey);
      const key = sourceKey.trim();
      const normalizedToken = normalizeToken(token);

      const next = {
        sourceKey: key,
        token: normalizedToken,
        status: PAT_STATUS.UNKNOWN,
        lastValidatedAt: undefined,
        lastErrorCode: undefined,
      };

      records.set(key, next);
      return cloneRecord(next);
    },

    markValid(sourceKey, validatedAt = new Date().toISOString()) {
      assertSourceKey(sourceKey);
      const key = sourceKey.trim();
      const existing = records.get(key);
      if (!existing) return null;

      const next = {
        ...existing,
        status: PAT_STATUS.VALID,
        lastValidatedAt: validatedAt,
        lastErrorCode: undefined,
      };

      records.set(key, next);
      return cloneRecord(next);
    },

    markInvalid(sourceKey, errorCode, validatedAt = new Date().toISOString()) {
      assertSourceKey(sourceKey);
      assertPatErrorCode(errorCode);
      const key = sourceKey.trim();
      const existing = records.get(key);
      if (!existing) return null;

      const next = {
        ...existing,
        status: PAT_STATUS.INVALID,
        lastValidatedAt: validatedAt,
        lastErrorCode: errorCode,
      };

      records.set(key, next);
      return cloneRecord(next);
    },

    remove(sourceKey) {
      assertSourceKey(sourceKey);
      return records.delete(sourceKey.trim());
    },
  };
}

module.exports = {
  createPatStore,
};
