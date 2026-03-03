const { createPatStore } = require("../../core/auth/patStore.ts");

const DEFAULT_STORAGE_KEY = "github-preview-widget/pat-session/v1";
const DEFAULT_CIPHER_KEY = "github-preview-widget::pat-session";

function toBase64(bytes) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }
  return globalThis.btoa(binary);
}

function fromBase64(input) {
  if (typeof input !== "string" || input.length === 0) {
    return new Uint8Array(0);
  }

  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(input, "base64"));
  }

  const binary = globalThis.atob(input);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function xorBytes(payloadBytes, keyBytes) {
  if (!(keyBytes instanceof Uint8Array) || keyBytes.length === 0) {
    throw new TypeError("Cipher key must not be empty.");
  }

  const out = new Uint8Array(payloadBytes.length);
  for (let i = 0; i < payloadBytes.length; i += 1) {
    out[i] = payloadBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
}

function encodePersistedRecords(records, cipherKey) {
  const encoder = new TextEncoder();
  const payload = JSON.stringify({
    version: 1,
    records: Array.isArray(records) ? records : [],
  });

  const payloadBytes = encoder.encode(payload);
  const keyBytes = encoder.encode(String(cipherKey || DEFAULT_CIPHER_KEY));
  return toBase64(xorBytes(payloadBytes, keyBytes));
}

function decodePersistedRecords(input, cipherKey) {
  if (typeof input !== "string" || input.trim() === "") {
    return [];
  }

  try {
    const bytes = fromBase64(input);
    const decoder = new TextDecoder();
    const keyBytes = new TextEncoder().encode(String(cipherKey || DEFAULT_CIPHER_KEY));
    const plain = decoder.decode(xorBytes(bytes, keyBytes));
    const parsed = JSON.parse(plain);
    if (!Array.isArray(parsed?.records)) {
      return [];
    }
    return parsed.records;
  } catch (_error) {
    return [];
  }
}

function normalizeRecord(record) {
  const sourceKey = String(record?.sourceKey || "").trim();
  const token = String(record?.token || "").trim();
  if (!sourceKey || !token) return null;

  return {
    sourceKey,
    token,
    status: typeof record?.status === "string" ? record.status : "unknown",
    lastValidatedAt:
      typeof record?.lastValidatedAt === "string" ? record.lastValidatedAt : undefined,
    lastErrorCode:
      typeof record?.lastErrorCode === "string" ? record.lastErrorCode : undefined,
  };
}

function isStorageLike(storage) {
  return Boolean(
    storage &&
      typeof storage.getAsync === "function" &&
      typeof storage.setAsync === "function"
  );
}

function createPatSessionStore(options = {}) {
  const storage = options.storage;
  const storageKey =
    typeof options.storageKey === "string" && options.storageKey
      ? options.storageKey
      : DEFAULT_STORAGE_KEY;
  const cipherKey =
    typeof options.cipherKey === "string" && options.cipherKey
      ? options.cipherKey
      : DEFAULT_CIPHER_KEY;
  const initialRecords = Array.isArray(options.initialRecords)
    ? options.initialRecords
        .map((record) => normalizeRecord(record))
        .filter(Boolean)
    : [];

  const recordMap = new Map(initialRecords.map((record) => [record.sourceKey, record]));
  const delegate = createPatStore(initialRecords);

  let persistQueue = Promise.resolve();

  function cloneRecords() {
    return Array.from(recordMap.values()).map((entry) => ({ ...entry }));
  }

  function schedulePersist() {
    if (!isStorageLike(storage)) {
      return Promise.resolve(false);
    }

    const payload = encodePersistedRecords(cloneRecords(), cipherKey);
    persistQueue = persistQueue
      .catch(() => {})
      .then(() => storage.setAsync(storageKey, payload))
      .then(() => true)
      .catch(() => false);

    return persistQueue;
  }

  return {
    get(sourceKey) {
      return delegate.get(sourceKey);
    },

    set(sourceKey, token) {
      const next = delegate.set(sourceKey, token);
      if (next) {
        recordMap.set(next.sourceKey, { ...next });
        void schedulePersist();
      }
      return next;
    },

    markValid(sourceKey, validatedAt) {
      const next = delegate.markValid(sourceKey, validatedAt);
      if (next) {
        recordMap.set(next.sourceKey, { ...next });
        void schedulePersist();
      }
      return next;
    },

    markInvalid(sourceKey, errorCode, validatedAt) {
      const next = delegate.markInvalid(sourceKey, errorCode, validatedAt);
      if (next) {
        recordMap.set(next.sourceKey, { ...next });
        void schedulePersist();
      }
      return next;
    },

    remove(sourceKey) {
      const removed = delegate.remove(sourceKey);
      if (removed) {
        recordMap.delete(String(sourceKey).trim());
        if (isStorageLike(storage)) {
          if (recordMap.size === 0 && typeof storage.deleteAsync === "function") {
            persistQueue = persistQueue
              .catch(() => {})
              .then(() => storage.deleteAsync(storageKey))
              .catch(() => false);
          } else {
            void schedulePersist();
          }
        }
      }
      return removed;
    },

    flush() {
      return persistQueue.catch(() => false);
    },

    dump() {
      return cloneRecords();
    },
  };
}

async function loadPatSessionStore(options = {}) {
  const storage = options.storage;
  if (!isStorageLike(storage)) {
    return createPatSessionStore(options);
  }

  const storageKey =
    typeof options.storageKey === "string" && options.storageKey
      ? options.storageKey
      : DEFAULT_STORAGE_KEY;
  const cipherKey =
    typeof options.cipherKey === "string" && options.cipherKey
      ? options.cipherKey
      : DEFAULT_CIPHER_KEY;

  let initialRecords = [];
  try {
    const payload = await storage.getAsync(storageKey);
    initialRecords = decodePersistedRecords(payload, cipherKey);
  } catch (_error) {
    initialRecords = [];
  }

  return createPatSessionStore({
    ...options,
    storage,
    storageKey,
    cipherKey,
    initialRecords,
  });
}

module.exports = {
  DEFAULT_STORAGE_KEY,
  DEFAULT_CIPHER_KEY,
  encodePersistedRecords,
  decodePersistedRecords,
  createPatSessionStore,
  loadPatSessionStore,
};
