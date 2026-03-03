(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/widget/bridge/messages.ts
  var require_messages = __commonJS({
    "src/widget/bridge/messages.ts"(exports, module) {
      var UI_COMMAND2 = Object.freeze({
        CREATE_PREVIEW: "create-preview",
        REFRESH_PREVIEW: "refresh-preview",
        SUBMIT_PAT: "submit-pat",
        FORGET_PAT: "forget-pat"
      });
      var UI_EVENT2 = Object.freeze({
        WIDGET_CONTEXT: "widget-context",
        RUNTIME_STATUS: "runtime-status"
      });
      function createCreatePreviewCommand(url) {
        return {
          type: UI_COMMAND2.CREATE_PREVIEW,
          url: String(url || "").trim()
        };
      }
      function createRefreshPreviewCommand(widgetId) {
        return {
          type: UI_COMMAND2.REFRESH_PREVIEW,
          widgetId: String(widgetId || "").trim()
        };
      }
      function createSubmitPatCommand(sourceKey, token) {
        return {
          type: UI_COMMAND2.SUBMIT_PAT,
          sourceKey: String(sourceKey || "").trim(),
          token: String(token || "").trim()
        };
      }
      function createForgetPatCommand(sourceKey) {
        return {
          type: UI_COMMAND2.FORGET_PAT,
          sourceKey: String(sourceKey || "").trim()
        };
      }
      module.exports = {
        UI_COMMAND: UI_COMMAND2,
        UI_EVENT: UI_EVENT2,
        createCreatePreviewCommand,
        createRefreshPreviewCommand,
        createSubmitPatCommand,
        createForgetPatCommand
      };
    }
  });

  // src/widget/bridge/parseUiCommand.ts
  var require_parseUiCommand = __commonJS({
    "src/widget/bridge/parseUiCommand.ts"(exports, module) {
      var { UI_COMMAND: UI_COMMAND2 } = require_messages();
      function fail(code, message) {
        return {
          ok: false,
          error: {
            code,
            message
          }
        };
      }
      function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
      }
      function parseUiCommand2(payload) {
        if (!isPlainObject(payload)) {
          return fail("INVALID_PAYLOAD", "Expected an object command payload.");
        }
        if (typeof payload.type !== "string") {
          return fail("INVALID_TYPE", "Command payload must include a string 'type'.");
        }
        if (payload.type === UI_COMMAND2.CREATE_PREVIEW) {
          if (typeof payload.url !== "string" || payload.url.trim().length === 0) {
            return fail("INVALID_URL", "create-preview requires a non-empty URL.");
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.CREATE_PREVIEW,
              url: payload.url.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.REFRESH_PREVIEW) {
          if (typeof payload.widgetId !== "string" || payload.widgetId.trim().length === 0) {
            return fail(
              "INVALID_WIDGET_ID",
              "refresh-preview requires a non-empty widgetId."
            );
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.REFRESH_PREVIEW,
              widgetId: payload.widgetId.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.SUBMIT_PAT) {
          if (typeof payload.sourceKey !== "string" || payload.sourceKey.trim().length === 0) {
            return fail(
              "INVALID_SOURCE_KEY",
              "submit-pat requires a non-empty sourceKey."
            );
          }
          if (typeof payload.token !== "string" || payload.token.trim().length === 0) {
            return fail("INVALID_PAT", "submit-pat requires a non-empty token.");
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.SUBMIT_PAT,
              sourceKey: payload.sourceKey.trim(),
              token: payload.token.trim()
            }
          };
        }
        if (payload.type === UI_COMMAND2.FORGET_PAT) {
          if (typeof payload.sourceKey !== "string" || payload.sourceKey.trim().length === 0) {
            return fail(
              "INVALID_SOURCE_KEY",
              "forget-pat requires a non-empty sourceKey."
            );
          }
          return {
            ok: true,
            value: {
              type: UI_COMMAND2.FORGET_PAT,
              sourceKey: payload.sourceKey.trim()
            }
          };
        }
        return fail("UNSUPPORTED_COMMAND", `Unsupported command type: ${payload.type}`);
      }
      module.exports = {
        parseUiCommand: parseUiCommand2
      };
    }
  });

  // src/core/url/types.ts
  var require_types = __commonJS({
    "src/core/url/types.ts"(exports, module) {
      var URL_ERROR_CODES = Object.freeze({
        INVALID_FORMAT: "INVALID_FORMAT",
        UNSUPPORTED_HOST: "UNSUPPORTED_HOST",
        UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
        NOT_A_FILE: "NOT_A_FILE",
        UNSUPPORTED_EXTENSION: "UNSUPPORTED_EXTENSION"
      });
      var SUPPORTED_EXTENSIONS = Object.freeze(["md", "txt", "json", "js", "ts"]);
      module.exports = {
        URL_ERROR_CODES,
        SUPPORTED_EXTENSIONS
      };
    }
  });

  // src/core/url/parseGithubFileUrl.ts
  var require_parseGithubFileUrl = __commonJS({
    "src/core/url/parseGithubFileUrl.ts"(exports, module) {
      var { URL_ERROR_CODES } = require_types();
      function parseError(code, details) {
        return {
          ok: false,
          error: {
            code,
            details
          }
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
            path
          }
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
            path
          }
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
        parseGithubFileUrl
      };
    }
  });

  // src/core/url/detectFileKind.ts
  var require_detectFileKind = __commonJS({
    "src/core/url/detectFileKind.ts"(exports, module) {
      var { URL_ERROR_CODES, SUPPORTED_EXTENSIONS } = require_types();
      var EXTENSION_TO_KIND = Object.freeze({
        md: "markdown",
        txt: "text",
        json: "json",
        js: "javascript",
        ts: "typescript"
      });
      function detectFileKind(path) {
        if (typeof path !== "string" || path.trim() === "") {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "File path is required."
            }
          };
        }
        const trimmed = path.trim();
        if (trimmed.endsWith("/")) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "Path points to a directory, not a file."
            }
          };
        }
        const fileName = trimmed.split("/").pop();
        if (!fileName || !fileName.includes(".")) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.NOT_A_FILE,
              details: "Path does not contain a valid file name with extension."
            }
          };
        }
        const extension = fileName.split(".").pop().toLowerCase();
        if (!SUPPORTED_EXTENSIONS.includes(extension)) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.UNSUPPORTED_EXTENSION,
              details: `Extension .${extension} is not supported in v1.`
            }
          };
        }
        return {
          ok: true,
          value: {
            extension,
            fileKind: EXTENSION_TO_KIND[extension] || "text"
          }
        };
      }
      module.exports = {
        detectFileKind
      };
    }
  });

  // src/core/url/validateGithubFileUrl.ts
  var require_validateGithubFileUrl = __commonJS({
    "src/core/url/validateGithubFileUrl.ts"(exports, module) {
      var { URL_ERROR_CODES } = require_types();
      var { detectFileKind } = require_detectFileKind();
      function validateGithubFileUrl(parsedUrl) {
        if (!parsedUrl || typeof parsedUrl !== "object") {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.INVALID_FORMAT,
              details: "Parsed URL object is required."
            }
          };
        }
        const { owner, repo, ref, path, sourceType } = parsedUrl;
        if (!owner || !repo || !ref || !path || !sourceType) {
          return {
            ok: false,
            error: {
              code: URL_ERROR_CODES.INVALID_FORMAT,
              details: "Parsed URL must include owner, repo, ref, path and sourceType."
            }
          };
        }
        const kindResult = detectFileKind(path);
        if (!kindResult.ok) {
          return kindResult;
        }
        return {
          ok: true,
          value: __spreadProps(__spreadValues({}, parsedUrl), {
            extension: kindResult.value.extension,
            fileKind: kindResult.value.fileKind,
            canonicalBlobUrl: `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`
          })
        };
      }
      module.exports = {
        validateGithubFileUrl
      };
    }
  });

  // src/core/url/errors.ts
  var require_errors = __commonJS({
    "src/core/url/errors.ts"(exports, module) {
      var ERROR_COPY = Object.freeze({
        INVALID_FORMAT: {
          message: "La URL no tiene un formato v\xE1lido.",
          action: "Pega una URL HTTPS completa de GitHub."
        },
        UNSUPPORTED_HOST: {
          message: "El host no est\xE1 soportado.",
          action: "Usa github.com o raw.githubusercontent.com."
        },
        UNSUPPORTED_ROUTE: {
          message: "La ruta de GitHub no est\xE1 soportada.",
          action: "Usa una URL de fichero en formato blob o raw."
        },
        NOT_A_FILE: {
          message: "La URL no apunta a un fichero.",
          action: "Selecciona una URL que termine en un archivo concreto."
        },
        UNSUPPORTED_EXTENSION: {
          message: "La extensi\xF3n del fichero no est\xE1 soportada en v1.",
          action: "Usa .md, .txt, .json, .js o .ts."
        }
      });
      function toUserFacingUrlError(error) {
        const fallback = ERROR_COPY.INVALID_FORMAT;
        const copy = ERROR_COPY[error == null ? void 0 : error.code] || fallback;
        return {
          code: (error == null ? void 0 : error.code) || "INVALID_FORMAT",
          message: copy.message,
          action: copy.action,
          details: (error == null ? void 0 : error.details) || ""
        };
      }
      module.exports = {
        toUserFacingUrlError
      };
    }
  });

  // src/core/url/ingestGithubFileUrl.ts
  var require_ingestGithubFileUrl = __commonJS({
    "src/core/url/ingestGithubFileUrl.ts"(exports, module) {
      var { parseGithubFileUrl } = require_parseGithubFileUrl();
      var { validateGithubFileUrl } = require_validateGithubFileUrl();
      var { toUserFacingUrlError } = require_errors();
      function ingestGithubFileUrl(inputUrl) {
        const parsed = parseGithubFileUrl(inputUrl);
        if (!parsed.ok) {
          return {
            ok: false,
            error: toUserFacingUrlError(parsed.error)
          };
        }
        const validated = validateGithubFileUrl(parsed.value);
        if (!validated.ok) {
          return {
            ok: false,
            error: toUserFacingUrlError(validated.error)
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
            sourceKey: `${normalized.owner}/${normalized.repo}@${normalized.ref}:${normalized.path}`
          }
        };
      }
      module.exports = {
        ingestGithubFileUrl
      };
    }
  });

  // src/core/canvas/types.ts
  var require_types2 = __commonJS({
    "src/core/canvas/types.ts"(exports, module) {
      var EMBED_BLOCK_KIND = "github_file_embed";
      var SYNC_STATUS = Object.freeze({
        IDLE: "idle",
        SYNCING: "syncing",
        SUCCESS: "success",
        ERROR: "error"
      });
      var SYNC_MODE2 = Object.freeze({
        MANUAL: "manual",
        AUTO: "auto"
      });
      var SYNC_BADGE_TONE = Object.freeze({
        [SYNC_STATUS.IDLE]: "neutral",
        [SYNC_STATUS.SYNCING]: "info",
        [SYNC_STATUS.SUCCESS]: "success",
        [SYNC_STATUS.ERROR]: "danger"
      });
      var REFRESH_TRIGGER = Object.freeze({
        HEADER_BUTTON: "header_button",
        CONTEXT_MENU: "context_menu",
        AUTO_OPEN: "auto_open"
      });
      var BLOCK_LIMITS = Object.freeze({
        DEFAULT_WIDTH: 640,
        MIN_WIDTH: 320,
        MAX_WIDTH: 1200,
        MIN_HEIGHT: 180
      });
      module.exports = {
        EMBED_BLOCK_KIND,
        SYNC_STATUS,
        SYNC_MODE: SYNC_MODE2,
        SYNC_BADGE_TONE,
        REFRESH_TRIGGER,
        BLOCK_LIMITS
      };
    }
  });

  // src/core/canvas/embedBlockModel.ts
  var require_embedBlockModel = __commonJS({
    "src/core/canvas/embedBlockModel.ts"(exports, module) {
      var {
        EMBED_BLOCK_KIND,
        BLOCK_LIMITS,
        SYNC_STATUS,
        SYNC_MODE: SYNC_MODE2
      } = require_types2();
      function sanitizeText(value, fallback) {
        if (typeof value === "string" && value.trim()) {
          return value.trim();
        }
        return fallback;
      }
      function clampWidth(width) {
        if (typeof width !== "number" || Number.isNaN(width)) {
          return BLOCK_LIMITS.DEFAULT_WIDTH;
        }
        return Math.max(BLOCK_LIMITS.MIN_WIDTH, Math.min(BLOCK_LIMITS.MAX_WIDTH, width));
      }
      function parseSourceKey(sourceKey) {
        const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
        if (!match) return null;
        return {
          owner: match[1],
          repo: match[2],
          ref: match[3],
          path: match[4]
        };
      }
      function normalizeSource(source, sourceKey) {
        const parsed = parseSourceKey(sourceKey);
        const owner = sanitizeText(source == null ? void 0 : source.owner, (parsed == null ? void 0 : parsed.owner) || "unknown");
        const repo = sanitizeText(source == null ? void 0 : source.repo, (parsed == null ? void 0 : parsed.repo) || "unknown");
        const ref = sanitizeText(source == null ? void 0 : source.ref, (parsed == null ? void 0 : parsed.ref) || "main");
        const path = sanitizeText(source == null ? void 0 : source.path, (parsed == null ? void 0 : parsed.path) || "unknown.txt");
        const normalizedSourceKey = sanitizeText(sourceKey, `${owner}/${repo}@${ref}:${path}`);
        return {
          owner,
          repo,
          ref,
          path,
          sourceKey: normalizedSourceKey
        };
      }
      function normalizePreview(preview) {
        return {
          kind: typeof (preview == null ? void 0 : preview.kind) === "string" ? preview.kind : "text",
          blocks: Array.isArray(preview == null ? void 0 : preview.blocks) ? preview.blocks : [],
          warnings: Array.isArray(preview == null ? void 0 : preview.warnings) ? preview.warnings : [],
          truncated: Boolean(preview == null ? void 0 : preview.truncated),
          progressive: Boolean(preview == null ? void 0 : preview.progressive)
        };
      }
      function createInitialSyncState(sync, nowIso) {
        return {
          status: typeof (sync == null ? void 0 : sync.status) === "string" ? sync.status : SYNC_STATUS.IDLE,
          mode: typeof (sync == null ? void 0 : sync.mode) === "string" ? sync.mode : SYNC_MODE2.MANUAL,
          lastSyncAt: typeof (sync == null ? void 0 : sync.lastSyncAt) === "string" && sync.lastSyncAt ? sync.lastSyncAt : null,
          message: typeof (sync == null ? void 0 : sync.message) === "string" && sync.message ? sync.message : "Sin sincronizar",
          details: typeof (sync == null ? void 0 : sync.details) === "string" ? sync.details : "",
          lastUpdatedAt: typeof (sync == null ? void 0 : sync.lastUpdatedAt) === "string" && sync.lastUpdatedAt ? sync.lastUpdatedAt : nowIso
        };
      }
      function formatSyncTimestamp(lastSyncAt) {
        if (!lastSyncAt) {
          return "Nunca";
        }
        return String(lastSyncAt);
      }
      function createEmbedBlockModel(input = {}, options = {}) {
        var _a;
        const nowIso = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const source = normalizeSource(input.source, input.sourceKey);
        return {
          kind: EMBED_BLOCK_KIND,
          id: sanitizeText(input.id, `embed:${source.sourceKey}`),
          sourceKey: source.sourceKey,
          source,
          preview: normalizePreview(input.preview),
          sync: createInitialSyncState(input.sync, nowIso),
          layout: {
            width: clampWidth((_a = input == null ? void 0 : input.layout) == null ? void 0 : _a.width),
            heightMode: "auto",
            resizable: {
              edgeDrag: true,
              minWidth: BLOCK_LIMITS.MIN_WIDTH,
              maxWidth: BLOCK_LIMITS.MAX_WIDTH,
              minHeight: BLOCK_LIMITS.MIN_HEIGHT
            }
          },
          createdAt: typeof input.createdAt === "string" && input.createdAt ? input.createdAt : nowIso,
          updatedAt: typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : nowIso,
          metadata: {
            version: 1
          }
        };
      }
      module.exports = {
        createEmbedBlockModel,
        createInitialSyncState,
        formatSyncTimestamp
      };
    }
  });

  // src/core/canvas/composeEmbedBlock.ts
  var require_composeEmbedBlock = __commonJS({
    "src/core/canvas/composeEmbedBlock.ts"(exports, module) {
      var {
        REFRESH_TRIGGER,
        SYNC_STATUS,
        SYNC_BADGE_TONE,
        EMBED_BLOCK_KIND
      } = require_types2();
      var {
        createEmbedBlockModel,
        formatSyncTimestamp
      } = require_embedBlockModel();
      function getStatusLabel(status) {
        if (status === SYNC_STATUS.SYNCING) return "Syncing...";
        if (status === SYNC_STATUS.SUCCESS) return "Synced";
        if (status === SYNC_STATUS.ERROR) return "Sync error";
        return "Idle";
      }
      function composeEmbedBlock(input, options = {}) {
        const model = (input == null ? void 0 : input.kind) === EMBED_BLOCK_KIND ? input : createEmbedBlockModel(input, options);
        const ownerRepo = `${model.source.owner}/${model.source.repo}`;
        const statusLabel = getStatusLabel(model.sync.status);
        return __spreadProps(__spreadValues({}, model), {
          sections: {
            header: {
              ownerRepo,
              path: model.source.path,
              ref: model.source.ref,
              sourceKey: model.sourceKey,
              lastSync: formatSyncTimestamp(model.sync.lastSyncAt),
              statusBadge: {
                status: model.sync.status,
                label: statusLabel,
                tone: SYNC_BADGE_TONE[model.sync.status] || SYNC_BADGE_TONE[SYNC_STATUS.IDLE],
                mode: model.sync.mode
              },
              refreshActions: [REFRESH_TRIGGER.HEADER_BUTTON, REFRESH_TRIGGER.CONTEXT_MENU]
            },
            body: {
              kind: model.preview.kind,
              blocks: model.preview.blocks,
              warnings: model.preview.warnings,
              truncated: model.preview.truncated,
              progressive: model.preview.progressive
            },
            footer: {
              summary: model.sync.message || statusLabel,
              detail: model.sync.details || "",
              mode: model.sync.mode,
              updatedAt: model.sync.lastUpdatedAt
            }
          }
        });
      }
      module.exports = {
        composeEmbedBlock
      };
    }
  });

  // src/widget/bootstrap/widgetMetadata.ts
  var require_widgetMetadata = __commonJS({
    "src/widget/bootstrap/widgetMetadata.ts"(exports, module) {
      var { SYNC_MODE: SYNC_MODE2, SYNC_STATUS } = require_types2();
      function parseSourceKey(sourceKey) {
        const match = String(sourceKey || "").match(/^([^/]+)\/([^@]+)@([^:]+):(.+)$/);
        if (!match) {
          return null;
        }
        return {
          owner: match[1],
          repo: match[2],
          ref: match[3],
          path: match[4]
        };
      }
      function createSeedMetadata(sourceKey, options = {}) {
        const now = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const parsed = parseSourceKey(sourceKey);
        return {
          sourceKey,
          source: parsed,
          lastSync: null,
          syncState: SYNC_STATUS.IDLE,
          syncMode: SYNC_MODE2.MANUAL,
          createdAt: now,
          updatedAt: now
        };
      }
      module.exports = {
        parseSourceKey,
        createSeedMetadata
      };
    }
  });

  // src/widget/bootstrap/createSeedEmbed.ts
  var require_createSeedEmbed = __commonJS({
    "src/widget/bootstrap/createSeedEmbed.ts"(exports, module) {
      var { ingestGithubFileUrl } = require_ingestGithubFileUrl();
      var { composeEmbedBlock } = require_composeEmbedBlock();
      var { SYNC_MODE: SYNC_MODE2, SYNC_STATUS } = require_types2();
      var { createSeedMetadata } = require_widgetMetadata();
      function createSeedEmbed(input = {}) {
        const url = typeof input.url === "string" ? input.url.trim() : "";
        if (!url) {
          return {
            ok: false,
            error: {
              code: "MISSING_URL",
              message: "A GitHub file URL is required."
            }
          };
        }
        const ingested = ingestGithubFileUrl(url);
        if (!ingested.ok) {
          return {
            ok: false,
            error: ingested.error
          };
        }
        const source = ingested.value;
        const metadata = createSeedMetadata(source.sourceKey, {
          now: input.now
        });
        const block = composeEmbedBlock({
          sourceKey: source.sourceKey,
          source: {
            owner: source.owner,
            repo: source.repo,
            ref: source.ref,
            path: source.path
          },
          preview: {
            kind: "text",
            blocks: [
              {
                type: "text",
                content: `Seed preview ready for ${source.path}`
              },
              {
                type: "text",
                content: "Bootstrap complete. Full render pipeline will run in phase 6."
              }
            ],
            warnings: [],
            truncated: false,
            progressive: false
          },
          sync: {
            status: SYNC_STATUS.IDLE,
            mode: SYNC_MODE2.MANUAL,
            message: "Seed preview ready",
            details: "",
            lastSyncAt: null
          }
        });
        return {
          ok: true,
          value: {
            source,
            metadata,
            embedBlock: __spreadProps(__spreadValues({}, block), {
              metadata: __spreadProps(__spreadValues(__spreadValues({}, block.metadata), metadata), {
                sourceUrl: url
              })
            })
          }
        };
      }
      module.exports = {
        createSeedEmbed
      };
    }
  });

  // src/core/auth/types.ts
  var require_types3 = __commonJS({
    "src/core/auth/types.ts"(exports, module) {
      var PAT_STATUS = Object.freeze({
        UNKNOWN: "unknown",
        VALID: "valid",
        INVALID: "invalid"
      });
      var PAT_ERROR_CODES = Object.freeze({
        MISSING_PAT: "missing_pat",
        EXPIRED_PAT: "expired_pat",
        CURRENT_PAT: "current_pat"
      });
      module.exports = {
        PAT_STATUS,
        PAT_ERROR_CODES
      };
    }
  });

  // src/core/auth/patStore.ts
  var require_patStore = __commonJS({
    "src/core/auth/patStore.ts"(exports, module) {
      var { PAT_STATUS, PAT_ERROR_CODES } = require_types3();
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
        return __spreadValues({}, record);
      }
      function createPatStore(initialRecords = []) {
        const records = /* @__PURE__ */ new Map();
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
            lastErrorCode: record.lastErrorCode
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
              lastValidatedAt: void 0,
              lastErrorCode: void 0
            };
            records.set(key, next);
            return cloneRecord(next);
          },
          markValid(sourceKey, validatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
            assertSourceKey(sourceKey);
            const key = sourceKey.trim();
            const existing = records.get(key);
            if (!existing) return null;
            const next = __spreadProps(__spreadValues({}, existing), {
              status: PAT_STATUS.VALID,
              lastValidatedAt: validatedAt,
              lastErrorCode: void 0
            });
            records.set(key, next);
            return cloneRecord(next);
          },
          markInvalid(sourceKey, errorCode, validatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
            assertSourceKey(sourceKey);
            assertPatErrorCode(errorCode);
            const key = sourceKey.trim();
            const existing = records.get(key);
            if (!existing) return null;
            const next = __spreadProps(__spreadValues({}, existing), {
              status: PAT_STATUS.INVALID,
              lastValidatedAt: validatedAt,
              lastErrorCode: errorCode
            });
            records.set(key, next);
            return cloneRecord(next);
          },
          remove(sourceKey) {
            assertSourceKey(sourceKey);
            return records.delete(sourceKey.trim());
          }
        };
      }
      module.exports = {
        createPatStore
      };
    }
  });

  // src/core/github/types.ts
  var require_types4 = __commonJS({
    "src/core/github/types.ts"(exports, module) {
      var AUTH_KINDS = Object.freeze({
        MISSING_PAT: "missing_pat",
        EXPIRED_PAT: "expired_pat",
        CURRENT_PAT: "current_pat",
        NON_AUTH_ERROR: "non_auth_error"
      });
      var AUTH_UI_CODES = Object.freeze({
        MISSING_PAT: "MISSING_PAT",
        EXPIRED_PAT: "EXPIRED_PAT",
        CURRENT_PAT: "CURRENT_PAT"
      });
      module.exports = {
        AUTH_KINDS,
        AUTH_UI_CODES
      };
    }
  });

  // src/core/github/fetchGithubFile.ts
  var require_fetchGithubFile = __commonJS({
    "src/core/github/fetchGithubFile.ts"(exports, module) {
      function encodePath(pathValue) {
        return pathValue.split("/").map((part) => encodeURIComponent(part)).join("/");
      }
      function buildGithubContentsApiUrl(source) {
        const encodedPath = encodePath(source.path);
        const encodedRef = encodeURIComponent(source.ref);
        return `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${encodedPath}?ref=${encodedRef}`;
      }
      async function fetchGithubFile(source, options = {}) {
        var _a, _b;
        const fetchImpl = options.fetchImpl || globalThis.fetch;
        if (typeof fetchImpl !== "function") {
          throw new TypeError("fetch implementation is required.");
        }
        const token = options.token;
        const apiUrl = buildGithubContentsApiUrl(source);
        const headers = {
          accept: "application/vnd.github.raw+json"
        };
        if (token) {
          headers.authorization = `Bearer ${token}`;
        }
        try {
          const response = await fetchImpl(apiUrl, {
            method: "GET",
            headers
          });
          const body = await response.text();
          return {
            ok: response.ok,
            status: response.status,
            content: response.ok ? body : null,
            body,
            headers: {
              wwwAuthenticate: ((_b = (_a = response.headers) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, "www-authenticate")) || ""
            },
            request: {
              url: apiUrl,
              tokenUsed: Boolean(token)
            }
          };
        } catch (error) {
          return {
            ok: false,
            status: 0,
            content: null,
            body: (error == null ? void 0 : error.message) || String(error),
            headers: {
              wwwAuthenticate: ""
            },
            request: {
              url: apiUrl,
              tokenUsed: Boolean(token)
            }
          };
        }
      }
      module.exports = {
        fetchGithubFile
      };
    }
  });

  // src/core/github/classifyAuthError.ts
  var require_classifyAuthError = __commonJS({
    "src/core/github/classifyAuthError.ts"(exports, module) {
      var { AUTH_KINDS } = require_types4();
      function normalizeText(value) {
        return typeof value === "string" ? value.toLowerCase() : "";
      }
      function classifyAuthError(input) {
        const status = Number((input == null ? void 0 : input.status) || 0);
        const tokenProvided = Boolean(input == null ? void 0 : input.tokenProvided);
        const body = normalizeText(input == null ? void 0 : input.responseBody);
        const wwwAuthenticate = normalizeText(input == null ? void 0 : input.wwwAuthenticate);
        const diagnostic = `${body} ${wwwAuthenticate}`.trim();
        if (!tokenProvided) {
          if (status === 401 || status === 403 || status === 404) {
            return { kind: AUTH_KINDS.MISSING_PAT, recoverable: true };
          }
          return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
        }
        if (status === 401) {
          return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
        }
        if (status === 404) {
          return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
        }
        if (status === 403) {
          if (diagnostic.includes("insufficient") || diagnostic.includes("scope") || diagnostic.includes("resource not accessible by personal access token") || diagnostic.includes("permission")) {
            return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
          }
          if (diagnostic.includes("expired") || diagnostic.includes("revoked") || diagnostic.includes("bad credentials") || diagnostic.includes("invalid")) {
            return { kind: AUTH_KINDS.EXPIRED_PAT, recoverable: true };
          }
          return { kind: AUTH_KINDS.CURRENT_PAT, recoverable: true };
        }
        return { kind: AUTH_KINDS.NON_AUTH_ERROR, recoverable: false };
      }
      module.exports = {
        classifyAuthError
      };
    }
  });

  // src/core/github/authUxMessages.ts
  var require_authUxMessages = __commonJS({
    "src/core/github/authUxMessages.ts"(exports, module) {
      var { AUTH_KINDS, AUTH_UI_CODES } = require_types4();
      var AUTH_COPY = Object.freeze({
        [AUTH_KINDS.MISSING_PAT]: {
          code: AUTH_UI_CODES.MISSING_PAT,
          message: "El fichero que intentas visualiza es privado. Crea un personal access token para acceder a este fichero."
        },
        [AUTH_KINDS.EXPIRED_PAT]: {
          code: AUTH_UI_CODES.EXPIRED_PAT,
          message: "Tu personal access token es invalido o ha expirado (Expired Pat)"
        },
        [AUTH_KINDS.CURRENT_PAT]: {
          code: AUTH_UI_CODES.CURRENT_PAT,
          message: "Tu personal access no tiene los permisos/scope suficiente (Current Pat)"
        }
      });
      function getAuthUxMessage(kind) {
        const fallback = AUTH_COPY[AUTH_KINDS.MISSING_PAT];
        const selected = AUTH_COPY[kind] || fallback;
        return {
          code: selected.code,
          message: selected.message,
          action: "Actualiza o reemplaza tu PAT para este fichero."
        };
      }
      module.exports = {
        getAuthUxMessage
      };
    }
  });

  // src/core/github/readGithubFileWithAuth.ts
  var require_readGithubFileWithAuth = __commonJS({
    "src/core/github/readGithubFileWithAuth.ts"(exports, module) {
      var { ingestGithubFileUrl } = require_ingestGithubFileUrl();
      var { createPatStore } = require_patStore();
      var { PAT_ERROR_CODES } = require_types3();
      var { AUTH_KINDS } = require_types4();
      var { fetchGithubFile } = require_fetchGithubFile();
      var { classifyAuthError } = require_classifyAuthError();
      var { getAuthUxMessage } = require_authUxMessages();
      function toPatErrorCode(kind) {
        if (kind === AUTH_KINDS.EXPIRED_PAT) return PAT_ERROR_CODES.EXPIRED_PAT;
        if (kind === AUTH_KINDS.CURRENT_PAT) return PAT_ERROR_CODES.CURRENT_PAT;
        return PAT_ERROR_CODES.MISSING_PAT;
      }
      function buildAuthError(kind, details) {
        const ux = getAuthUxMessage(kind);
        return {
          code: ux.code,
          message: ux.message,
          action: ux.action,
          details: details || ""
        };
      }
      async function readGithubFileWithAuth(inputUrl, options = {}) {
        var _a, _b;
        const ingestResult = ingestGithubFileUrl(inputUrl);
        if (!ingestResult.ok) {
          return ingestResult;
        }
        const source = ingestResult.value;
        const sourceKey = source.sourceKey;
        const patStore = options.patStore || createPatStore();
        const fetchImpl = options.fetchImpl;
        const publicAttempt = await fetchGithubFile(source, { fetchImpl });
        if (publicAttempt.ok) {
          return {
            ok: true,
            value: {
              source,
              sourceKey,
              content: publicAttempt.content
            },
            auth: {
              kind: null,
              sourceKey,
              usedPat: false,
              retryCount: 0
            }
          };
        }
        const storedPat = patStore.get(sourceKey);
        if (!(storedPat == null ? void 0 : storedPat.token)) {
          const authResult = classifyAuthError({
            status: publicAttempt.status,
            tokenProvided: false,
            responseBody: publicAttempt.body,
            wwwAuthenticate: (_a = publicAttempt.headers) == null ? void 0 : _a.wwwAuthenticate
          });
          if (authResult.kind === AUTH_KINDS.MISSING_PAT) {
            return {
              ok: false,
              error: buildAuthError(AUTH_KINDS.MISSING_PAT, publicAttempt.body),
              auth: {
                kind: AUTH_KINDS.MISSING_PAT,
                sourceKey,
                usedPat: false,
                retryCount: 0,
                patStatus: "missing"
              }
            };
          }
          return {
            ok: false,
            error: {
              code: "FETCH_FAILED",
              message: "No se pudo leer el fichero remoto.",
              action: "Reintenta m\xE1s tarde.",
              details: publicAttempt.body || `HTTP ${publicAttempt.status}`
            },
            auth: {
              kind: AUTH_KINDS.NON_AUTH_ERROR,
              sourceKey,
              usedPat: false,
              retryCount: 0
            }
          };
        }
        let lastTokenAttempt = null;
        for (let attempt = 0; attempt < 2; attempt += 1) {
          lastTokenAttempt = await fetchGithubFile(source, {
            token: storedPat.token,
            fetchImpl
          });
          if (lastTokenAttempt.ok) {
            patStore.markValid(sourceKey);
            return {
              ok: true,
              value: {
                source,
                sourceKey,
                content: lastTokenAttempt.content
              },
              auth: {
                kind: null,
                sourceKey,
                usedPat: true,
                retryCount: attempt
              }
            };
          }
        }
        const classified = classifyAuthError({
          status: lastTokenAttempt.status,
          tokenProvided: true,
          responseBody: lastTokenAttempt.body,
          wwwAuthenticate: (_b = lastTokenAttempt.headers) == null ? void 0 : _b.wwwAuthenticate
        });
        if (classified.kind === AUTH_KINDS.EXPIRED_PAT || classified.kind === AUTH_KINDS.CURRENT_PAT) {
          patStore.markInvalid(sourceKey, toPatErrorCode(classified.kind));
          return {
            ok: false,
            error: buildAuthError(classified.kind, lastTokenAttempt.body),
            auth: {
              kind: classified.kind,
              sourceKey,
              usedPat: true,
              retryCount: 1,
              patStatus: "invalid"
            }
          };
        }
        return {
          ok: false,
          error: {
            code: "FETCH_FAILED",
            message: "No se pudo leer el fichero remoto.",
            action: "Reintenta m\xE1s tarde.",
            details: lastTokenAttempt.body || `HTTP ${lastTokenAttempt.status}`
          },
          auth: {
            kind: AUTH_KINDS.NON_AUTH_ERROR,
            sourceKey,
            usedPat: true,
            retryCount: 1,
            patStatus: "unknown"
          }
        };
      }
      module.exports = {
        readGithubFileWithAuth
      };
    }
  });

  // src/core/render/detectMinifiedJson.ts
  var require_detectMinifiedJson = __commonJS({
    "src/core/render/detectMinifiedJson.ts"(exports, module) {
      function detectMinifiedJson(content, options = {}) {
        if (typeof content !== "string") {
          return { isMinified: false, reason: "not_string" };
        }
        const trimmed = content.trim();
        if (!trimmed) {
          return { isMinified: false, reason: "empty" };
        }
        if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
          return { isMinified: false, reason: "not_json_shape" };
        }
        const maxBytesForPrettyPrint = Number(options.maxBytesForPrettyPrint || 250 * 1024);
        const bytes = Buffer.byteLength(trimmed, "utf8");
        if (bytes > maxBytesForPrettyPrint) {
          return { isMinified: false, reason: "too_large_for_pretty_print" };
        }
        try {
          JSON.parse(trimmed);
        } catch (e) {
          return { isMinified: false, reason: "invalid_json" };
        }
        const hasNewLine = /[\r\n]/.test(trimmed);
        if (hasNewLine) {
          return { isMinified: false, reason: "already_multiline" };
        }
        const compact = trimmed.length >= 20;
        const whitespaceCount = (trimmed.match(/\s/g) || []).length;
        const whitespaceRatio = whitespaceCount / Math.max(trimmed.length, 1);
        const punctuationDensity = (trimmed.match(/[,:{}\[\]]/g) || []).length / Math.max(trimmed.length, 1) > 0.15;
        if (compact && whitespaceRatio < 0.02 && punctuationDensity) {
          return { isMinified: true, reason: "single_line_compact_json" };
        }
        return { isMinified: false, reason: "not_compact_enough" };
      }
      module.exports = {
        detectMinifiedJson
      };
    }
  });

  // src/core/render/types.ts
  var require_types5 = __commonJS({
    "src/core/render/types.ts"(exports, module) {
      var RENDER_KIND = Object.freeze({
        CODE: "code",
        TEXT: "text",
        MARKDOWN: "markdown"
      });
      var DEFAULT_RENDER_POLICY = Object.freeze({
        maxFullRenderBytes: 300 * 1024,
        progressivePreviewBytes: 120 * 1024,
        targetFirstPreviewMs: 2e3
      });
      var EXTENSION_TO_LANGUAGE = Object.freeze({
        js: "javascript",
        ts: "typescript",
        json: "json",
        txt: "text",
        md: "markdown"
      });
      module.exports = {
        RENDER_KIND,
        DEFAULT_RENDER_POLICY,
        EXTENSION_TO_LANGUAGE
      };
    }
  });

  // src/core/render/highlightCode.ts
  var require_highlightCode = __commonJS({
    "src/core/render/highlightCode.ts"(exports, module) {
      var { detectMinifiedJson } = require_detectMinifiedJson();
      var { EXTENSION_TO_LANGUAGE, RENDER_KIND } = require_types5();
      var JS_TS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|await|async|import|from|export|class|new|try|catch)\b/g;
      function normalizeExtension(extension) {
        if (typeof extension !== "string") return "txt";
        return extension.replace(/^\./, "").toLowerCase();
      }
      function basicHighlight(source, language) {
        if (language === "javascript" || language === "typescript") {
          return source.replace(JS_TS_KEYWORDS, "\u2039$1\u203A");
        }
        if (language === "json") {
          return source.replace(/"([^"]+)":/g, "\u201C$1\u201D:").replace(/\b(true|false|null)\b/g, "\u2039$1\u203A");
        }
        return source;
      }
      function highlightCode(input) {
        const content = typeof (input == null ? void 0 : input.content) === "string" ? input.content : "";
        const extension = normalizeExtension(input == null ? void 0 : input.extension);
        const language = EXTENSION_TO_LANGUAGE[extension] || "text";
        const warnings = [];
        let renderContent = content;
        let kind = language === "text" ? RENDER_KIND.TEXT : RENDER_KIND.CODE;
        if (extension === "json") {
          const minified = detectMinifiedJson(content);
          if (minified.isMinified) {
            try {
              renderContent = JSON.stringify(JSON.parse(content), null, 2);
            } catch (e) {
              warnings.push("JSON inv\xE1lido. Se muestra contenido como texto plano.");
              kind = RENDER_KIND.TEXT;
            }
          } else if (minified.reason === "invalid_json") {
            warnings.push("JSON inv\xE1lido. Se muestra contenido como texto plano.");
            kind = RENDER_KIND.TEXT;
          }
        }
        const highlightedContent = kind === RENDER_KIND.TEXT ? renderContent : basicHighlight(renderContent, language);
        return {
          ok: true,
          value: {
            kind,
            language,
            blocks: [
              {
                type: kind === RENDER_KIND.TEXT ? "text" : "code",
                language,
                content: highlightedContent,
                meta: {
                  highlighted: kind === RENDER_KIND.CODE
                }
              }
            ],
            warnings
          }
        };
      }
      module.exports = {
        highlightCode
      };
    }
  });

  // src/core/render/renderMermaidBlocks.ts
  var require_renderMermaidBlocks = __commonJS({
    "src/core/render/renderMermaidBlocks.ts"(exports, module) {
      function getFirstNonEmptyLine(source) {
        const lines = source.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) return trimmed;
        }
        return "";
      }
      function isValidMermaidSyntax(source) {
        const firstLine = getFirstNonEmptyLine(source);
        if (!firstLine) return false;
        const validStarters = [
          "graph ",
          "flowchart ",
          "sequenceDiagram",
          "stateDiagram",
          "stateDiagram-v2",
          "classDiagram",
          "erDiagram",
          "gantt",
          "journey",
          "pie ",
          "mindmap",
          "timeline"
        ];
        return validStarters.some((entry) => firstLine.startsWith(entry));
      }
      function renderMermaidBlocks(blocks, options = {}) {
        const defaultView = options.defaultView || "diagram";
        const warnings = [];
        const nextBlocks = blocks.map((block) => {
          if (!(block.type === "code" && block.language === "mermaid")) {
            return block;
          }
          const source = String(block.content || "");
          if (isValidMermaidSyntax(source)) {
            return {
              type: "mermaid",
              content: source,
              meta: {
                views: ["diagram", "code"],
                defaultView,
                toggleEnabled: true
              }
            };
          }
          warnings.push("Bloque Mermaid inv\xE1lido. Se muestra fallback de c\xF3digo.");
          return {
            type: "code",
            language: "mermaid",
            content: source,
            meta: {
              fallback: true
            }
          };
        });
        return {
          blocks: nextBlocks,
          warnings
        };
      }
      module.exports = {
        renderMermaidBlocks
      };
    }
  });

  // src/core/render/renderMarkdown.ts
  var require_renderMarkdown = __commonJS({
    "src/core/render/renderMarkdown.ts"(exports, module) {
      var { RENDER_KIND } = require_types5();
      var { renderMermaidBlocks } = require_renderMermaidBlocks();
      function isHtmlLike(line) {
        return /<[^>]+>/.test(line);
      }
      function isTableDivider(line) {
        return /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
      }
      function parseMarkdownBlocks(markdown) {
        const lines = String(markdown || "").split(/\r?\n/);
        const blocks = [];
        const warnings = [];
        let index = 0;
        while (index < lines.length) {
          const line = lines[index];
          const trimmed = line.trim();
          if (!trimmed) {
            index += 1;
            continue;
          }
          if (trimmed.startsWith("```")) {
            const language = trimmed.slice(3).trim().toLowerCase() || "text";
            index += 1;
            const codeLines = [];
            while (index < lines.length && !lines[index].trim().startsWith("```")) {
              codeLines.push(lines[index]);
              index += 1;
            }
            if (index < lines.length && lines[index].trim().startsWith("```")) {
              index += 1;
            } else {
              warnings.push("Bloque de c\xF3digo sin cierre detectado. Se degrad\xF3 al final del documento.");
            }
            blocks.push({
              type: "code",
              language,
              content: codeLines.join("\n")
            });
            continue;
          }
          if (/^#{1,6}\s+/.test(trimmed)) {
            const depth = trimmed.match(/^#{1,6}/)[0].length;
            blocks.push({
              type: "heading",
              depth,
              content: trimmed.slice(depth).trim()
            });
            index += 1;
            continue;
          }
          if (/^[-*+]\s+/.test(trimmed)) {
            const items = [];
            while (index < lines.length && /^[-*+]\s+/.test(lines[index].trim())) {
              items.push(lines[index].trim().slice(2));
              index += 1;
            }
            blocks.push({
              type: "list",
              ordered: false,
              items
            });
            continue;
          }
          const nextLine = lines[index + 1] || "";
          if (line.includes("|") && isTableDivider(nextLine)) {
            const tableLines = [line, nextLine];
            index += 2;
            while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
              tableLines.push(lines[index]);
              index += 1;
            }
            blocks.push({
              type: "table",
              content: tableLines.join("\n")
            });
            continue;
          }
          const paragraphLines = [line];
          index += 1;
          while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith("```") && !/^#{1,6}\s+/.test(lines[index].trim()) && !/^[-*+]\s+/.test(lines[index].trim()) && !(lines[index].includes("|") && isTableDivider(lines[index + 1] || ""))) {
            paragraphLines.push(lines[index]);
            index += 1;
          }
          const paragraph = paragraphLines.join(" ").trim();
          blocks.push({
            type: "paragraph",
            content: paragraph,
            meta: {
              htmlEscaped: isHtmlLike(paragraph)
            }
          });
        }
        return { blocks, warnings };
      }
      function renderMarkdown(markdown, options = {}) {
        const parsed = parseMarkdownBlocks(markdown);
        const mermaidResult = renderMermaidBlocks(parsed.blocks, {
          defaultView: options.mermaidDefaultView || "diagram"
        });
        return {
          ok: true,
          value: {
            kind: RENDER_KIND.MARKDOWN,
            blocks: mermaidResult.blocks,
            warnings: [...parsed.warnings, ...mermaidResult.warnings]
          }
        };
      }
      module.exports = {
        renderMarkdown
      };
    }
  });

  // src/core/render/performancePolicy.ts
  var require_performancePolicy = __commonJS({
    "src/core/render/performancePolicy.ts"(exports, module) {
      var { DEFAULT_RENDER_POLICY } = require_types5();
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
        const previewBytes = mode === "progressive" ? Math.min(progressivePreviewBytes, inputBytes) : inputBytes;
        return {
          mode,
          maxFullRenderBytes,
          previewBytes,
          targetFirstPreviewMs,
          shouldTruncate: mode === "progressive"
        };
      }
      module.exports = {
        resolvePerformancePolicy
      };
    }
  });

  // src/core/render/renderFilePreview.ts
  var require_renderFilePreview = __commonJS({
    "src/core/render/renderFilePreview.ts"(exports, module) {
      var { highlightCode } = require_highlightCode();
      var { renderMarkdown } = require_renderMarkdown();
      var { resolvePerformancePolicy } = require_performancePolicy();
      var previewCache = /* @__PURE__ */ new Map();
      function normalizeExtension(extension) {
        if (typeof extension !== "string") return "txt";
        return extension.replace(/^\./, "").toLowerCase();
      }
      function truncateToBytes(content, maxBytes) {
        if (Buffer.byteLength(content, "utf8") <= maxBytes) {
          return content;
        }
        let end = content.length;
        let start = 0;
        let best = "";
        while (start <= end) {
          const mid = Math.floor((start + end) / 2);
          const candidate = content.slice(0, mid);
          const bytes = Buffer.byteLength(candidate, "utf8");
          if (bytes <= maxBytes) {
            best = candidate;
            start = mid + 1;
          } else {
            end = mid - 1;
          }
        }
        return best;
      }
      function fastHash(content) {
        const probe = content.slice(0, 1024);
        let hash = 0;
        for (let i = 0; i < probe.length; i += 1) {
          hash = hash * 31 + probe.charCodeAt(i) >>> 0;
        }
        return `${content.length}:${hash}`;
      }
      function renderByExtension(extension, content) {
        if (extension === "md") {
          return renderMarkdown(content);
        }
        return highlightCode({ extension, content });
      }
      function renderFilePreview(input, options = {}) {
        const startedAt = Date.now();
        const content = typeof (input == null ? void 0 : input.content) === "string" ? input.content : "";
        const sourceKey = String((input == null ? void 0 : input.sourceKey) || "");
        const extension = normalizeExtension(input == null ? void 0 : input.extension);
        const inputBytes = Buffer.byteLength(content, "utf8");
        const cacheKey = `${sourceKey}:${extension}:${fastHash(content)}`;
        const cached = previewCache.get(cacheKey);
        if (cached) {
          return {
            ok: true,
            value: __spreadProps(__spreadValues({}, cached), {
              metrics: __spreadProps(__spreadValues({}, cached.metrics), {
                cacheHit: true,
                firstPreviewMs: 0
              })
            })
          };
        }
        const policy = resolvePerformancePolicy(__spreadValues({
          inputBytes
        }, options.policy));
        const warnings = [];
        const contentToRender = policy.shouldTruncate ? truncateToBytes(content, policy.previewBytes) : content;
        if (policy.shouldTruncate) {
          warnings.push("Contenido grande: se muestra preview parcial inicial.");
        }
        const rendered = renderByExtension(extension, contentToRender);
        if (!rendered.ok) {
          return rendered;
        }
        const resultValue = {
          sourceKey,
          extension,
          kind: rendered.value.kind,
          blocks: rendered.value.blocks,
          warnings: [...warnings, ...rendered.value.warnings || []],
          truncated: policy.shouldTruncate,
          progressive: policy.mode === "progressive",
          metrics: {
            inputBytes,
            renderBytes: Buffer.byteLength(contentToRender, "utf8"),
            firstPreviewMs: Date.now() - startedAt,
            targetFirstPreviewMs: policy.targetFirstPreviewMs,
            cacheHit: false
          }
        };
        previewCache.set(cacheKey, resultValue);
        return {
          ok: true,
          value: resultValue
        };
      }
      module.exports = {
        renderFilePreview
      };
    }
  });

  // src/core/canvas/updateEmbedBlock.ts
  var require_updateEmbedBlock = __commonJS({
    "src/core/canvas/updateEmbedBlock.ts"(exports, module) {
      var { EMBED_BLOCK_KIND } = require_types2();
      var { createEmbedBlockModel } = require_embedBlockModel();
      var { composeEmbedBlock } = require_composeEmbedBlock();
      function updateEmbedBlockInPlace(block, patch = {}, options = {}) {
        var _a;
        const nowIso = typeof options.now === "string" && options.now ? options.now : (/* @__PURE__ */ new Date()).toISOString();
        const base = (block == null ? void 0 : block.kind) === EMBED_BLOCK_KIND ? block : createEmbedBlockModel(block || {}, { now: nowIso });
        const nextModel = __spreadProps(__spreadValues({}, base), {
          sourceKey: typeof patch.sourceKey === "string" && patch.sourceKey ? patch.sourceKey : base.sourceKey,
          source: patch.source ? __spreadValues(__spreadValues({}, base.source), patch.source) : base.source,
          preview: patch.preview ? __spreadValues(__spreadValues({}, base.preview), patch.preview) : base.preview,
          sync: patch.sync ? __spreadValues(__spreadValues({}, base.sync), patch.sync) : base.sync,
          layout: patch.layout ? __spreadValues(__spreadValues({}, base.layout), patch.layout) : base.layout,
          updatedAt: nowIso,
          metadata: __spreadProps(__spreadValues({}, base.metadata), {
            updatedInPlace: true
          })
        });
        const composed = composeEmbedBlock(nextModel, { now: nowIso });
        return __spreadProps(__spreadValues({}, composed), {
          id: base.id,
          kind: base.kind,
          sourceKey: nextModel.sourceKey,
          source: nextModel.source,
          preview: nextModel.preview,
          sync: nextModel.sync,
          layout: nextModel.layout,
          createdAt: base.createdAt,
          updatedAt: nowIso,
          metadata: __spreadProps(__spreadValues({}, nextModel.metadata), {
            version: ((_a = base.metadata) == null ? void 0 : _a.version) || 1
          })
        });
      }
      module.exports = {
        updateEmbedBlockInPlace
      };
    }
  });

  // src/core/canvas/syncState.ts
  var require_syncState = __commonJS({
    "src/core/canvas/syncState.ts"(exports, module) {
      var { SYNC_STATUS, SYNC_MODE: SYNC_MODE2, SYNC_BADGE_TONE } = require_types2();
      function normalizeMode(mode) {
        if (mode === SYNC_MODE2.AUTO) return SYNC_MODE2.AUTO;
        return SYNC_MODE2.MANUAL;
      }
      function resolveNow(options = {}) {
        if (typeof options.now === "string" && options.now) {
          return options.now;
        }
        return (/* @__PURE__ */ new Date()).toISOString();
      }
      function transitionSyncState(currentSync = {}, event = {}, options = {}) {
        const nowIso = resolveNow(options);
        const mode = normalizeMode(event.mode || currentSync.mode);
        if (event.type === "start") {
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.SYNCING,
            mode,
            message: "Syncing...",
            details: "",
            lastUpdatedAt: nowIso
          });
        }
        if (event.type === "success") {
          const syncedAt = typeof event.syncedAt === "string" && event.syncedAt ? event.syncedAt : nowIso;
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.SUCCESS,
            mode,
            lastSyncAt: syncedAt,
            message: typeof event.message === "string" && event.message ? event.message : mode === SYNC_MODE2.AUTO ? "Auto-sync completado" : "Sincronizaci\xF3n completada",
            details: "",
            lastUpdatedAt: nowIso
          });
        }
        if (event.type === "error") {
          return __spreadProps(__spreadValues({}, currentSync), {
            status: SYNC_STATUS.ERROR,
            mode,
            message: typeof event.message === "string" && event.message ? event.message : "Sync error",
            details: typeof event.details === "string" && event.details ? event.details : "No se pudo sincronizar el contenido remoto.",
            lastUpdatedAt: nowIso
          });
        }
        return __spreadProps(__spreadValues({}, currentSync), {
          status: SYNC_STATUS.IDLE,
          mode,
          message: typeof currentSync.message === "string" && currentSync.message ? currentSync.message : "Sin sincronizar",
          details: typeof currentSync.details === "string" ? currentSync.details : "",
          lastUpdatedAt: nowIso
        });
      }
      function buildSyncBadge(sync = {}) {
        const status = sync.status || SYNC_STATUS.IDLE;
        const mode = normalizeMode(sync.mode);
        let label = "Idle";
        if (status === SYNC_STATUS.SYNCING) {
          label = "Syncing...";
        } else if (status === SYNC_STATUS.SUCCESS) {
          label = mode === SYNC_MODE2.AUTO ? "Auto-sync" : "Synced";
        } else if (status === SYNC_STATUS.ERROR) {
          label = "Sync error";
        }
        return {
          status,
          mode,
          label,
          tone: SYNC_BADGE_TONE[status] || SYNC_BADGE_TONE[SYNC_STATUS.IDLE],
          lastSyncAt: sync.lastSyncAt || null
        };
      }
      module.exports = {
        transitionSyncState,
        buildSyncBadge
      };
    }
  });

  // src/widget/runtime/redactSensitive.ts
  var require_redactSensitive = __commonJS({
    "src/widget/runtime/redactSensitive.ts"(exports, module) {
      var REDACTED = "[REDACTED_TOKEN]";
      var TOKEN_PATTERNS = [
        /\bgh[pousr]_[A-Za-z0-9_]{8,}\b/gi,
        /\bgithub_pat_[A-Za-z0-9_]{16,}\b/gi,
        /\bBearer\s+[A-Za-z0-9._\-+/=]{8,}\b/gi,
        /\btoken\s+[A-Za-z0-9._\-+/=]{8,}\b/gi
      ];
      function redactString(input) {
        if (typeof input !== "string" || input.length === 0) {
          return "";
        }
        let output = input;
        for (const pattern of TOKEN_PATTERNS) {
          output = output.replace(pattern, REDACTED);
        }
        return output;
      }
      function redactSensitive2(value) {
        if (typeof value === "string") {
          return redactString(value);
        }
        if (Array.isArray(value)) {
          return value.map((entry) => redactSensitive2(entry));
        }
        if (value && typeof value === "object") {
          const next = {};
          for (const [key, entry] of Object.entries(value)) {
            next[key] = redactSensitive2(entry);
          }
          return next;
        }
        return value;
      }
      module.exports = {
        REDACTED,
        redactSensitive: redactSensitive2
      };
    }
  });

  // src/widget/runtime/persistWidgetSnapshot.ts
  var require_persistWidgetSnapshot = __commonJS({
    "src/widget/runtime/persistWidgetSnapshot.ts"(exports, module) {
      function buildRenderSnapshot(preview = {}) {
        const blocks = Array.isArray(preview.blocks) ? preview.blocks : [];
        return {
          kind: typeof preview.kind === "string" ? preview.kind : "text",
          blockCount: blocks.length,
          truncated: Boolean(preview.truncated),
          progressive: Boolean(preview.progressive)
        };
      }
      function buildLastResultSnapshot(input = {}) {
        const base = input.lastResult && typeof input.lastResult === "object" ? input.lastResult : {};
        const status = typeof base.status === "string" && base.status ? base.status : typeof input.syncState === "string" && input.syncState ? input.syncState : "idle";
        return {
          status,
          mode: typeof base.mode === "string" && base.mode ? base.mode : "manual",
          message: typeof base.message === "string" ? base.message : "",
          details: typeof base.details === "string" ? base.details : "",
          at: typeof base.at === "string" && base.at ? base.at : typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      function buildWidgetSnapshot(input = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const block = input.embedBlock || {};
        const warnings = Array.isArray(input.warnings) ? input.warnings.filter((warning) => typeof warning === "string" && warning.trim()) : [];
        const syncState = ((_a = block.sync) == null ? void 0 : _a.status) || "idle";
        const updatedAt = typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : (/* @__PURE__ */ new Date()).toISOString();
        return {
          version: 1,
          sourceKey: typeof block.sourceKey === "string" && block.sourceKey ? block.sourceKey : String(input.sourceKey || ""),
          sourceUrl: typeof input.sourceUrl === "string" ? input.sourceUrl : "",
          syncState,
          lastSync: ((_b = block.sync) == null ? void 0 : _b.lastSyncAt) || null,
          warnings,
          warningCount: warnings.length,
          render: buildRenderSnapshot(block.preview),
          metrics: {
            firstPreviewMs: typeof ((_c = input.metrics) == null ? void 0 : _c.firstPreviewMs) === "number" ? input.metrics.firstPreviewMs : null,
            cacheHit: Boolean((_d = input.metrics) == null ? void 0 : _d.cacheHit)
          },
          lastResult: buildLastResultSnapshot({
            lastResult: input.lastResult || {
              status: ((_e = block.sync) == null ? void 0 : _e.status) || "idle",
              mode: ((_f = block.sync) == null ? void 0 : _f.mode) || "manual",
              message: ((_g = block.sync) == null ? void 0 : _g.message) || "",
              details: ((_h = block.sync) == null ? void 0 : _h.details) || "",
              at: ((_i = block.sync) == null ? void 0 : _i.lastUpdatedAt) || updatedAt
            },
            syncState,
            updatedAt
          }),
          updatedAt
        };
      }
      function mergeWidgetSnapshot(previousSnapshot, patch = {}) {
        const previous = previousSnapshot && typeof previousSnapshot === "object" ? previousSnapshot : {};
        const hasField = (name) => Object.prototype.hasOwnProperty.call(patch, name);
        const updatedAt = typeof patch.updatedAt === "string" && patch.updatedAt ? patch.updatedAt : (/* @__PURE__ */ new Date()).toISOString();
        return {
          version: 1,
          sourceKey: typeof patch.sourceKey === "string" && patch.sourceKey ? patch.sourceKey : previous.sourceKey || "",
          sourceUrl: typeof patch.sourceUrl === "string" ? patch.sourceUrl : previous.sourceUrl || "",
          syncState: typeof patch.syncState === "string" && patch.syncState ? patch.syncState : previous.syncState || "idle",
          lastSync: hasField("lastSync") ? patch.lastSync : previous.lastSync || null,
          warnings: Array.isArray(patch.warnings) ? patch.warnings : Array.isArray(previous.warnings) ? previous.warnings : [],
          warningCount: typeof patch.warningCount === "number" ? patch.warningCount : Array.isArray(patch.warnings) ? patch.warnings.length : typeof previous.warningCount === "number" ? previous.warningCount : 0,
          render: __spreadValues(__spreadValues({}, previous.render || {}), patch.render || {}),
          metrics: __spreadValues(__spreadValues({}, previous.metrics || {}), patch.metrics || {}),
          lastResult: buildLastResultSnapshot({
            lastResult: __spreadValues(__spreadValues({}, previous.lastResult || {}), patch.lastResult || {}),
            syncState: typeof patch.syncState === "string" && patch.syncState ? patch.syncState : previous.syncState || "idle",
            updatedAt
          }),
          updatedAt
        };
      }
      module.exports = {
        buildWidgetSnapshot,
        mergeWidgetSnapshot
      };
    }
  });

  // src/widget/runtime/normalizeRenderForWidget.ts
  var require_normalizeRenderForWidget = __commonJS({
    "src/widget/runtime/normalizeRenderForWidget.ts"(exports, module) {
      function asArray(value) {
        return Array.isArray(value) ? value : [];
      }
      function normalizeWarningList(list) {
        const seen = /* @__PURE__ */ new Set();
        const normalized = [];
        for (const item of asArray(list)) {
          if (typeof item !== "string") {
            continue;
          }
          const next = item.trim();
          if (!next || seen.has(next)) {
            continue;
          }
          seen.add(next);
          normalized.push(next);
        }
        return normalized;
      }
      function normalizeRenderForWidget(preview = {}, options = {}) {
        var _a, _b;
        const sourceBlocks = asArray(preview.blocks);
        const normalizedBlocks = [];
        const warnings = normalizeWarningList(preview.warnings);
        for (const block of sourceBlocks) {
          if ((block == null ? void 0 : block.type) === "mermaid") {
            normalizedBlocks.push({
              type: "code",
              language: "mermaid",
              content: String(block.content || ""),
              meta: {
                fromMermaidDiagram: true,
                phasePolicy: "code_view_only"
              }
            });
            warnings.push("Mermaid shown as code in phase 6.");
            continue;
          }
          if ((block == null ? void 0 : block.type) === "code" && (block == null ? void 0 : block.language) === "mermaid" && ((_a = block == null ? void 0 : block.meta) == null ? void 0 : _a.fallback)) {
            warnings.push("Mermaid fallback active: showing code block.");
            normalizedBlocks.push(block);
            continue;
          }
          normalizedBlocks.push(block);
        }
        const dedupedWarnings = normalizeWarningList(warnings);
        const warningDetail = dedupedWarnings.length > 0 ? `${dedupedWarnings[0]}${dedupedWarnings.length > 1 ? ` (+${dedupedWarnings.length - 1} more)` : ""}` : "";
        return {
          preview: __spreadProps(__spreadValues({}, preview), {
            blocks: normalizedBlocks,
            warnings: dedupedWarnings
          }),
          warnings: dedupedWarnings,
          warningDetail,
          policy: {
            mode: preview.progressive ? "progressive" : "full",
            firstPreviewMs: ((_b = preview == null ? void 0 : preview.metrics) == null ? void 0 : _b.firstPreviewMs) || null,
            targetMs: typeof options.targetFirstPreviewMs === "number" ? options.targetFirstPreviewMs : 2e3
          }
        };
      }
      module.exports = {
        normalizeRenderForWidget
      };
    }
  });

  // src/widget/runtime/createOrRefreshEmbedFromUrl.ts
  var require_createOrRefreshEmbedFromUrl = __commonJS({
    "src/widget/runtime/createOrRefreshEmbedFromUrl.ts"(exports, module) {
      var { createSeedEmbed } = require_createSeedEmbed();
      var { readGithubFileWithAuth } = require_readGithubFileWithAuth();
      var { renderFilePreview } = require_renderFilePreview();
      var { updateEmbedBlockInPlace } = require_updateEmbedBlock();
      var { transitionSyncState } = require_syncState();
      var { SYNC_MODE: SYNC_MODE2 } = require_types2();
      var { redactSensitive: redactSensitive2 } = require_redactSensitive();
      var {
        buildWidgetSnapshot,
        mergeWidgetSnapshot
      } = require_persistWidgetSnapshot();
      var {
        normalizeRenderForWidget
      } = require_normalizeRenderForWidget();
      function resolveNow(inputNow) {
        if (typeof inputNow === "string" && inputNow) {
          return inputNow;
        }
        return (/* @__PURE__ */ new Date()).toISOString();
      }
      function toRenderInput(readResult) {
        const source = (readResult == null ? void 0 : readResult.source) || {};
        const extension = source.extension || String(source.path || "").split(".").pop() || "txt";
        return {
          sourceKey: readResult.sourceKey,
          extension,
          content: readResult.content
        };
      }
      function buildSeedBlock(url) {
        const seed = createSeedEmbed({ url });
        if (!seed.ok) {
          return seed;
        }
        return {
          ok: true,
          value: seed.value.embedBlock
        };
      }
      function normalizeError(errorLike, fallbackCode, fallbackMessage, fallbackDetails) {
        if (!errorLike || typeof errorLike !== "object") {
          return {
            code: fallbackCode,
            message: fallbackMessage,
            details: fallbackDetails
          };
        }
        return {
          code: errorLike.code || fallbackCode,
          message: redactSensitive2(errorLike.message || fallbackMessage),
          details: redactSensitive2(errorLike.details || fallbackDetails)
        };
      }
      function normalizeAuthState(authLike) {
        if (!authLike || typeof authLike !== "object") {
          return null;
        }
        return {
          kind: typeof authLike.kind === "string" ? authLike.kind : null,
          sourceKey: typeof authLike.sourceKey === "string" && authLike.sourceKey ? authLike.sourceKey : null,
          usedPat: Boolean(authLike.usedPat),
          retryCount: Number(authLike.retryCount || 0),
          patStatus: typeof authLike.patStatus === "string" && authLike.patStatus ? authLike.patStatus : null
        };
      }
      async function createOrRefreshEmbedFromUrl2(input = {}, deps = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        const url = typeof input.url === "string" ? input.url.trim() : "";
        if (!url) {
          return {
            ok: false,
            error: {
              code: "MISSING_URL",
              message: "A GitHub file URL is required."
            },
            value: {
              embedBlock: input.currentEmbedBlock || null,
              snapshot: input.currentSnapshot || null
            }
          };
        }
        const now = resolveNow(input.now);
        const nowOptions = { now };
        const mode = input.mode === SYNC_MODE2.AUTO ? SYNC_MODE2.AUTO : SYNC_MODE2.MANUAL;
        const previousSnapshot = input.currentSnapshot || null;
        const baseBlockResult = input.currentEmbedBlock ? { ok: true, value: input.currentEmbedBlock } : buildSeedBlock(url);
        if (!baseBlockResult.ok) {
          return {
            ok: false,
            error: baseBlockResult.error,
            value: {
              embedBlock: input.currentEmbedBlock || null,
              snapshot: previousSnapshot
            }
          };
        }
        const baseBlock = baseBlockResult.value;
        const syncingState = transitionSyncState(
          baseBlock.sync,
          {
            type: "start",
            mode
          },
          nowOptions
        );
        const syncingBlock = updateEmbedBlockInPlace(
          baseBlock,
          {
            sync: syncingState
          },
          nowOptions
        );
        const readGithub = typeof deps.readGithubFileWithAuth === "function" ? deps.readGithubFileWithAuth : readGithubFileWithAuth;
        const readResult = await readGithub(url, {
          patStore: input.patStore,
          fetchImpl: input.fetchImpl
        });
        if (!(readResult == null ? void 0 : readResult.ok)) {
          const error = normalizeError(
            readResult == null ? void 0 : readResult.error,
            "READ_FAILED",
            "Could not read remote file.",
            "No details provided."
          );
          const failedSync = transitionSyncState(
            syncingBlock.sync,
            {
              type: "error",
              mode,
              message: error.message,
              details: error.details
            },
            nowOptions
          );
          const failedBlock = updateEmbedBlockInPlace(
            syncingBlock,
            {
              sync: failedSync
            },
            nowOptions
          );
          const snapshot2 = mergeWidgetSnapshot(
            previousSnapshot,
            buildWidgetSnapshot({
              embedBlock: failedBlock,
              sourceUrl: url,
              warnings: ((_a = failedBlock.preview) == null ? void 0 : _a.warnings) || [],
              lastResult: {
                status: ((_b = failedBlock.sync) == null ? void 0 : _b.status) || "error",
                mode: ((_c = failedBlock.sync) == null ? void 0 : _c.mode) || mode,
                message: ((_d = failedBlock.sync) == null ? void 0 : _d.message) || error.message,
                details: ((_e = failedBlock.sync) == null ? void 0 : _e.details) || error.details
              },
              updatedAt: now
            })
          );
          return {
            ok: false,
            error,
            auth: normalizeAuthState(readResult == null ? void 0 : readResult.auth),
            value: {
              embedBlock: failedBlock,
              snapshot: snapshot2
            }
          };
        }
        const renderPreview = typeof deps.renderFilePreview === "function" ? deps.renderFilePreview : renderFilePreview;
        const renderResult = renderPreview(toRenderInput(readResult.value));
        if (!(renderResult == null ? void 0 : renderResult.ok)) {
          const error = normalizeError(
            renderResult == null ? void 0 : renderResult.error,
            "RENDER_FAILED",
            "Could not render file preview.",
            "No details provided."
          );
          const failedSync = transitionSyncState(
            syncingBlock.sync,
            {
              type: "error",
              mode,
              message: error.message,
              details: error.details
            },
            nowOptions
          );
          const failedBlock = updateEmbedBlockInPlace(
            syncingBlock,
            {
              sync: failedSync
            },
            nowOptions
          );
          const snapshot2 = mergeWidgetSnapshot(
            previousSnapshot,
            buildWidgetSnapshot({
              embedBlock: failedBlock,
              sourceUrl: url,
              warnings: ((_f = failedBlock.preview) == null ? void 0 : _f.warnings) || [],
              lastResult: {
                status: ((_g = failedBlock.sync) == null ? void 0 : _g.status) || "error",
                mode: ((_h = failedBlock.sync) == null ? void 0 : _h.mode) || mode,
                message: ((_i = failedBlock.sync) == null ? void 0 : _i.message) || error.message,
                details: ((_j = failedBlock.sync) == null ? void 0 : _j.details) || error.details
              },
              updatedAt: now
            })
          );
          return {
            ok: false,
            error,
            value: {
              embedBlock: failedBlock,
              snapshot: snapshot2
            }
          };
        }
        const normalizePreview = typeof deps.normalizePreview === "function" ? deps.normalizePreview : normalizeRenderForWidget;
        const normalizedPreview = normalizePreview(renderResult.value, {
          url,
          source: readResult.value.source,
          targetFirstPreviewMs: 2e3
        });
        const preview = (normalizedPreview == null ? void 0 : normalizedPreview.preview) || normalizedPreview;
        const warnings = Array.isArray(normalizedPreview == null ? void 0 : normalizedPreview.warnings) ? normalizedPreview.warnings : Array.isArray(preview == null ? void 0 : preview.warnings) ? preview.warnings : [];
        const warningDetail = typeof (normalizedPreview == null ? void 0 : normalizedPreview.warningDetail) === "string" ? normalizedPreview.warningDetail : warnings.length > 0 ? warnings.join(" | ") : "";
        const successSync = transitionSyncState(
          syncingBlock.sync,
          {
            type: "success",
            mode,
            message: warnings.length > 0 ? mode === SYNC_MODE2.AUTO ? "Auto-sync completado con advertencias" : "Preview updated with warnings" : mode === SYNC_MODE2.AUTO ? "Auto-sync completado" : "Preview created",
            details: warningDetail,
            syncedAt: now
          },
          nowOptions
        );
        const updatedBlock = updateEmbedBlockInPlace(
          syncingBlock,
          {
            sourceKey: readResult.value.sourceKey,
            source: readResult.value.source,
            preview,
            sync: successSync,
            metadata: {
              sourceUrl: url
            }
          },
          nowOptions
        );
        const snapshot = mergeWidgetSnapshot(
          previousSnapshot,
          buildWidgetSnapshot({
            embedBlock: updatedBlock,
            sourceUrl: url,
            warnings,
            metrics: (preview == null ? void 0 : preview.metrics) || null,
            lastResult: {
              status: ((_k = updatedBlock.sync) == null ? void 0 : _k.status) || "success",
              mode: ((_l = updatedBlock.sync) == null ? void 0 : _l.mode) || mode,
              message: ((_m = updatedBlock.sync) == null ? void 0 : _m.message) || "Preview created",
              details: ((_n = updatedBlock.sync) == null ? void 0 : _n.details) || ""
            },
            updatedAt: now
          })
        );
        return {
          ok: true,
          auth: normalizeAuthState(readResult == null ? void 0 : readResult.auth),
          value: {
            embedBlock: updatedBlock,
            snapshot,
            source: readResult.value.source,
            render: preview
          }
        };
      }
      module.exports = {
        createOrRefreshEmbedFromUrl: createOrRefreshEmbedFromUrl2
      };
    }
  });

  // src/widget/runtime/patSessionStore.ts
  var require_patSessionStore = __commonJS({
    "src/widget/runtime/patSessionStore.ts"(exports, module) {
      var { createPatStore } = require_patStore();
      var DEFAULT_STORAGE_KEY = "github-preview-widget/pat-session/v1";
      var DEFAULT_CIPHER_KEY = "github-preview-widget::pat-session";
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
          records: Array.isArray(records) ? records : []
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
          if (!Array.isArray(parsed == null ? void 0 : parsed.records)) {
            return [];
          }
          return parsed.records;
        } catch (_error) {
          return [];
        }
      }
      function normalizeRecord(record) {
        const sourceKey = String((record == null ? void 0 : record.sourceKey) || "").trim();
        const token = String((record == null ? void 0 : record.token) || "").trim();
        if (!sourceKey || !token) return null;
        return {
          sourceKey,
          token,
          status: typeof (record == null ? void 0 : record.status) === "string" ? record.status : "unknown",
          lastValidatedAt: typeof (record == null ? void 0 : record.lastValidatedAt) === "string" ? record.lastValidatedAt : void 0,
          lastErrorCode: typeof (record == null ? void 0 : record.lastErrorCode) === "string" ? record.lastErrorCode : void 0
        };
      }
      function isStorageLike(storage) {
        return Boolean(
          storage && typeof storage.getAsync === "function" && typeof storage.setAsync === "function"
        );
      }
      function createPatSessionStore2(options = {}) {
        const storage = options.storage;
        const storageKey = typeof options.storageKey === "string" && options.storageKey ? options.storageKey : DEFAULT_STORAGE_KEY;
        const cipherKey = typeof options.cipherKey === "string" && options.cipherKey ? options.cipherKey : DEFAULT_CIPHER_KEY;
        const initialRecords = Array.isArray(options.initialRecords) ? options.initialRecords.map((record) => normalizeRecord(record)).filter(Boolean) : [];
        const recordMap = new Map(initialRecords.map((record) => [record.sourceKey, record]));
        const delegate = createPatStore(initialRecords);
        let persistQueue = Promise.resolve();
        function cloneRecords() {
          return Array.from(recordMap.values()).map((entry) => __spreadValues({}, entry));
        }
        function schedulePersist() {
          if (!isStorageLike(storage)) {
            return Promise.resolve(false);
          }
          const payload = encodePersistedRecords(cloneRecords(), cipherKey);
          persistQueue = persistQueue.catch(() => {
          }).then(() => storage.setAsync(storageKey, payload)).then(() => true).catch(() => false);
          return persistQueue;
        }
        return {
          get(sourceKey) {
            return delegate.get(sourceKey);
          },
          set(sourceKey, token) {
            const next = delegate.set(sourceKey, token);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
              void schedulePersist();
            }
            return next;
          },
          markValid(sourceKey, validatedAt) {
            const next = delegate.markValid(sourceKey, validatedAt);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
              void schedulePersist();
            }
            return next;
          },
          markInvalid(sourceKey, errorCode, validatedAt) {
            const next = delegate.markInvalid(sourceKey, errorCode, validatedAt);
            if (next) {
              recordMap.set(next.sourceKey, __spreadValues({}, next));
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
                  persistQueue = persistQueue.catch(() => {
                  }).then(() => storage.deleteAsync(storageKey)).catch(() => false);
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
          }
        };
      }
      async function loadPatSessionStore2(options = {}) {
        const storage = options.storage;
        if (!isStorageLike(storage)) {
          return createPatSessionStore2(options);
        }
        const storageKey = typeof options.storageKey === "string" && options.storageKey ? options.storageKey : DEFAULT_STORAGE_KEY;
        const cipherKey = typeof options.cipherKey === "string" && options.cipherKey ? options.cipherKey : DEFAULT_CIPHER_KEY;
        let initialRecords = [];
        try {
          const payload = await storage.getAsync(storageKey);
          initialRecords = decodePersistedRecords(payload, cipherKey);
        } catch (_error) {
          initialRecords = [];
        }
        return createPatSessionStore2(__spreadProps(__spreadValues({}, options), {
          storage,
          storageKey,
          cipherKey,
          initialRecords
        }));
      }
      module.exports = {
        DEFAULT_STORAGE_KEY,
        DEFAULT_CIPHER_KEY,
        encodePersistedRecords,
        decodePersistedRecords,
        createPatSessionStore: createPatSessionStore2,
        loadPatSessionStore: loadPatSessionStore2
      };
    }
  });

  // src/widget/runtime/syncCoordinator.ts
  var require_syncCoordinator = __commonJS({
    "src/widget/runtime/syncCoordinator.ts"(exports, module) {
      var { SYNC_STATUS } = require_types2();
      var DEFAULT_AUTO_REFRESH_COOLDOWN_MS = 6e4;
      function normalizeSourceKey(sourceKey) {
        if (typeof sourceKey !== "string") return "";
        return sourceKey.trim();
      }
      function resolveNowMs(nowMs) {
        if (typeof nowMs === "number" && Number.isFinite(nowMs) && nowMs >= 0) {
          return nowMs;
        }
        return Date.now();
      }
      function shouldRunAutoRefresh2(input = {}, options = {}) {
        const sourceKey = normalizeSourceKey(input.sourceKey);
        if (!sourceKey) {
          return { ok: false, reason: "missing_source_key" };
        }
        const sourceUrl = typeof input.sourceUrl === "string" ? input.sourceUrl.trim() : "";
        if (!sourceUrl) {
          return { ok: false, reason: "missing_source_url" };
        }
        if (input.syncStatus === SYNC_STATUS.SYNCING) {
          return { ok: false, reason: "already_syncing" };
        }
        const nowMs = resolveNowMs(input.nowMs);
        const cooldownMs = typeof options.cooldownMs === "number" && options.cooldownMs >= 0 ? options.cooldownMs : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
        const lastAutoRefreshAt = typeof input.lastAutoRefreshAtMs === "number" && input.lastAutoRefreshAtMs >= 0 ? input.lastAutoRefreshAtMs : null;
        if (lastAutoRefreshAt !== null && nowMs - lastAutoRefreshAt < cooldownMs) {
          return {
            ok: false,
            reason: "cooldown",
            nextEligibleAtMs: lastAutoRefreshAt + cooldownMs
          };
        }
        return {
          ok: true,
          reason: "eligible",
          sourceKey,
          nowMs
        };
      }
      function createSyncCoordinator2(options = {}) {
        const cooldownMs = typeof options.cooldownMs === "number" && options.cooldownMs >= 0 ? options.cooldownMs : DEFAULT_AUTO_REFRESH_COOLDOWN_MS;
        const activeManualLocks = /* @__PURE__ */ new Set();
        function beginManual(input = {}) {
          const sourceKey = normalizeSourceKey(input.sourceKey);
          if (!sourceKey) {
            return { ok: false, reason: "missing_source_key" };
          }
          if (input.syncStatus === SYNC_STATUS.SYNCING) {
            return { ok: false, reason: "already_syncing" };
          }
          if (activeManualLocks.has(sourceKey)) {
            return { ok: false, reason: "manual_lock" };
          }
          activeManualLocks.add(sourceKey);
          return { ok: true, sourceKey };
        }
        function endManual(sourceKey) {
          const normalized = normalizeSourceKey(sourceKey);
          if (!normalized) return false;
          return activeManualLocks.delete(normalized);
        }
        function canAutoRefresh(input = {}) {
          return shouldRunAutoRefresh2(input, { cooldownMs });
        }
        return {
          cooldownMs,
          beginManual,
          endManual,
          canAutoRefresh,
          shouldRunAutoRefresh: canAutoRefresh
        };
      }
      module.exports = {
        DEFAULT_AUTO_REFRESH_COOLDOWN_MS,
        createSyncCoordinator: createSyncCoordinator2,
        shouldRunAutoRefresh: shouldRunAutoRefresh2
      };
    }
  });

  // src/widget/code.ts
  var { parseUiCommand } = require_parseUiCommand();
  var { UI_COMMAND, UI_EVENT } = require_messages();
  var {
    createOrRefreshEmbedFromUrl
  } = require_createOrRefreshEmbedFromUrl();
  var {
    createPatSessionStore,
    loadPatSessionStore
  } = require_patSessionStore();
  var { redactSensitive } = require_redactSensitive();
  var {
    createSyncCoordinator,
    shouldRunAutoRefresh
  } = require_syncCoordinator();
  var { SYNC_MODE } = require_types2();
  var { widget } = figma;
  var { AutoLayout, Text, useEffect, usePropertyMenu, useSyncedState, h } = widget;
  var AUTH_ERROR_CODES = Object.freeze({
    MISSING_PAT: "MISSING_PAT",
    EXPIRED_PAT: "EXPIRED_PAT",
    CURRENT_PAT: "CURRENT_PAT"
  });
  var AUTH_MESSAGES = Object.freeze({
    [AUTH_ERROR_CODES.MISSING_PAT]: "El fichero que intentas visualizar es privado. Crea o pega un personal access token para continuar.",
    [AUTH_ERROR_CODES.EXPIRED_PAT]: "Tu personal access token es invalido o ha expirado.",
    [AUTH_ERROR_CODES.CURRENT_PAT]: "Tu personal access token no tiene permisos/scope suficiente."
  });
  var syncCoordinator = createSyncCoordinator({ cooldownMs: 6e4 });
  var runtimePatStorePromise = null;
  var autoRefreshBootstrapped = false;
  function getRuntimePatStore() {
    if (!runtimePatStorePromise) {
      runtimePatStorePromise = loadPatSessionStore({
        storage: figma.clientStorage,
        cipherKey: "github-preview-widget/phase-7"
      }).catch(() => createPatSessionStore());
    }
    return runtimePatStorePromise;
  }
  function openWidgetUi() {
    figma.showUI(__html__, {
      width: 420,
      height: 420,
      title: "GitHub Preview Widget"
    });
  }
  function deriveSourceKey(url, embedBlock, embedSnapshot, authContext) {
    if (typeof (embedBlock == null ? void 0 : embedBlock.sourceKey) === "string" && embedBlock.sourceKey) {
      return embedBlock.sourceKey;
    }
    if (typeof (embedSnapshot == null ? void 0 : embedSnapshot.sourceKey) === "string" && embedSnapshot.sourceKey) {
      return embedSnapshot.sourceKey;
    }
    if (typeof (authContext == null ? void 0 : authContext.sourceKey) === "string" && authContext.sourceKey) {
      return authContext.sourceKey;
    }
    if (typeof url === "string") {
      return url.trim();
    }
    return "";
  }
  function buildLastResult(snapshot, embedBlock) {
    const snapshotLast = snapshot == null ? void 0 : snapshot.lastResult;
    if (snapshotLast && typeof snapshotLast === "object") {
      return {
        status: snapshotLast.status || "idle",
        mode: snapshotLast.mode || "manual",
        message: snapshotLast.message || "",
        details: snapshotLast.details || "",
        at: snapshotLast.at || (snapshot == null ? void 0 : snapshot.updatedAt) || (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const sync = (embedBlock == null ? void 0 : embedBlock.sync) || {};
    return {
      status: sync.status || "idle",
      mode: sync.mode || "manual",
      message: sync.message || "",
      details: sync.details || "",
      at: sync.lastUpdatedAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function resolveRuntimeError(pipelineError, auth) {
    const code = typeof (pipelineError == null ? void 0 : pipelineError.code) === "string" && pipelineError.code ? pipelineError.code : "UNKNOWN";
    const authMessage = AUTH_MESSAGES[code];
    const message = authMessage || typeof (pipelineError == null ? void 0 : pipelineError.message) === "string" && pipelineError.message || "Could not create preview from this URL.";
    const details = typeof (pipelineError == null ? void 0 : pipelineError.details) === "string" && pipelineError.details ? redactSensitive(pipelineError.details) : "";
    const sourceKey = typeof (auth == null ? void 0 : auth.sourceKey) === "string" && auth.sourceKey ? auth.sourceKey : null;
    return {
      code,
      message: redactSensitive(message),
      details,
      sourceKey,
      authRequired: Boolean(authMessage)
    };
  }
  function GitHubPreviewWidget() {
    var _a;
    const [status, setStatus] = useSyncedState(
      "runtime-status",
      "Ready: open URL input"
    );
    const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
    const [embedBlock, setEmbedBlock] = useSyncedState("embed-block", null);
    const [embedSnapshot, setEmbedSnapshot] = useSyncedState("embed-snapshot", null);
    const [authContext, setAuthContext] = useSyncedState("auth-context", null);
    const [autoRefreshMap, setAutoRefreshMap] = useSyncedState(
      "auto-refresh-map",
      {}
    );
    function postRuntimeStatus(level, message, details = "", extras = {}) {
      figma.ui.postMessage(__spreadValues({
        type: UI_EVENT.RUNTIME_STATUS,
        level,
        message,
        details
      }, extras));
    }
    async function runPreviewPipeline(url, trigger, options = {}) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const mode = options.mode === SYNC_MODE.AUTO ? SYNC_MODE.AUTO : SYNC_MODE.MANUAL;
      const normalizedUrl = typeof url === "string" ? url.trim() : "";
      if (!normalizedUrl) {
        setStatus("Sync error: MISSING_URL");
        postRuntimeStatus("error", "A GitHub file URL is required.");
        return { ok: false, skipped: true };
      }
      const sourceKeyForRun = typeof options.sourceKey === "string" && options.sourceKey ? options.sourceKey : deriveSourceKey(normalizedUrl, embedBlock, embedSnapshot, authContext);
      let lockAcquired = false;
      if (!options.skipManualLock) {
        const lock = syncCoordinator.beginManual({
          sourceKey: sourceKeyForRun,
          syncStatus: (_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status
        });
        if (!lock.ok) {
          setStatus("Syncing...");
          postRuntimeStatus("loading", "Syncing...", "", {
            reason: lock.reason
          });
          return { ok: false, skipped: true, reason: lock.reason };
        }
        lockAcquired = true;
      }
      try {
        setStatus(mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...");
        postRuntimeStatus("loading", mode === SYNC_MODE.AUTO ? "Auto-syncing..." : "Syncing...");
        if (mode === SYNC_MODE.MANUAL) {
          figma.notify("Syncing...");
        }
        const patStore = await getRuntimePatStore();
        const pipeline = await createOrRefreshEmbedFromUrl({
          url: normalizedUrl,
          currentEmbedBlock: embedBlock,
          currentSnapshot: embedSnapshot,
          patStore,
          mode
        });
        if (!pipeline.ok) {
          if ((_b = pipeline.value) == null ? void 0 : _b.embedBlock) {
            setEmbedBlock(pipeline.value.embedBlock);
          }
          if ((_c = pipeline.value) == null ? void 0 : _c.snapshot) {
            setEmbedSnapshot(pipeline.value.snapshot);
          }
          const runtimeError = resolveRuntimeError(pipeline.error, pipeline.auth);
          const nextAuthContext = runtimeError.authRequired && runtimeError.sourceKey ? {
            sourceKey: runtimeError.sourceKey,
            code: runtimeError.code,
            url: normalizedUrl
          } : null;
          setAuthContext(nextAuthContext);
          const lastResult3 = buildLastResult(
            (_d = pipeline.value) == null ? void 0 : _d.snapshot,
            (_e = pipeline.value) == null ? void 0 : _e.embedBlock
          );
          setStatus(`Sync error: ${runtimeError.code}`);
          postRuntimeStatus("error", runtimeError.message, runtimeError.details, {
            code: runtimeError.code,
            sourceKey: runtimeError.sourceKey,
            authRequired: runtimeError.authRequired,
            syncState: ((_h = (_g = (_f = pipeline.value) == null ? void 0 : _f.embedBlock) == null ? void 0 : _g.sync) == null ? void 0 : _h.status) || "error",
            lastResult: lastResult3
          });
          if (mode === SYNC_MODE.MANUAL) {
            figma.notify(runtimeError.message, { error: true });
          }
          return pipeline;
        }
        setLastUrl(normalizedUrl);
        setEmbedBlock(pipeline.value.embedBlock);
        setEmbedSnapshot(pipeline.value.snapshot);
        setAuthContext(null);
        const lastResult2 = buildLastResult(pipeline.value.snapshot, pipeline.value.embedBlock);
        const successMessage = mode === SYNC_MODE.AUTO ? "Auto-sync completed." : "Preview created.";
        setStatus(mode === SYNC_MODE.AUTO ? `Auto-sync ready (${trigger})` : `Preview ready (${trigger})`);
        postRuntimeStatus("success", successMessage, "", {
          syncState: ((_j = (_i = pipeline.value.embedBlock) == null ? void 0 : _i.sync) == null ? void 0 : _j.status) || "success",
          lastResult: lastResult2
        });
        if (mode === SYNC_MODE.MANUAL) {
          figma.notify("Preview created.");
        }
        return pipeline;
      } finally {
        if (lockAcquired) {
          syncCoordinator.endManual(sourceKeyForRun);
        }
      }
    }
    function maybeRunAutoRefresh(origin) {
      var _a2;
      if (typeof lastUrl !== "string" || !lastUrl.trim()) {
        return false;
      }
      const sourceKey = deriveSourceKey(lastUrl, embedBlock, embedSnapshot, authContext);
      const lastAutoRefreshAtMs = Number((autoRefreshMap == null ? void 0 : autoRefreshMap[sourceKey]) || 0);
      const decision = shouldRunAutoRefresh(
        {
          sourceKey,
          sourceUrl: lastUrl,
          syncStatus: (_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status,
          lastAutoRefreshAtMs,
          nowMs: Date.now()
        },
        {
          cooldownMs: syncCoordinator.cooldownMs
        }
      );
      if (!decision.ok) {
        return false;
      }
      setAutoRefreshMap(__spreadProps(__spreadValues({}, autoRefreshMap || {}), {
        [sourceKey]: decision.nowMs
      }));
      void runPreviewPipeline(lastUrl, `auto-${origin}`, {
        mode: SYNC_MODE.AUTO,
        skipManualLock: true,
        sourceKey
      });
      return true;
    }
    usePropertyMenu(
      [
        {
          itemType: "action",
          tooltip: "Set GitHub URL",
          propertyName: "open-url"
        },
        {
          itemType: "action",
          tooltip: "Refresh preview",
          propertyName: "refresh-now"
        }
      ],
      (event) => {
        var _a2;
        if (event.propertyName === "open-url") {
          openWidgetUi();
          figma.ui.postMessage({
            type: UI_EVENT.WIDGET_CONTEXT,
            widgetId: "active-widget",
            lastUrl,
            status,
            authContext,
            lastResult: buildLastResult(embedSnapshot, embedBlock),
            syncState: ((_a2 = embedBlock == null ? void 0 : embedBlock.sync) == null ? void 0 : _a2.status) || "idle"
          });
          void maybeRunAutoRefresh("open-url");
          return;
        }
        if (event.propertyName === "refresh-now") {
          if (!lastUrl) {
            setStatus("Refresh blocked: no URL set");
            postRuntimeStatus("error", "No URL available for refresh.");
            figma.notify("No URL available for refresh.", { error: true });
            return;
          }
          void runPreviewPipeline(lastUrl, "property-menu-refresh", {
            mode: SYNC_MODE.MANUAL
          });
        }
      }
    );
    useEffect(() => {
      figma.ui.onmessage = (message) => {
        const parsed = parseUiCommand(message);
        if (!parsed.ok) {
          setStatus(`Bridge error: ${parsed.error.code}`);
          postRuntimeStatus("error", parsed.error.message);
          figma.notify(parsed.error.message, { error: true });
          return;
        }
        const command = parsed.value;
        if (command.type === UI_COMMAND.CREATE_PREVIEW) {
          void runPreviewPipeline(command.url, "create", {
            mode: SYNC_MODE.MANUAL
          });
          return;
        }
        if (command.type === UI_COMMAND.REFRESH_PREVIEW) {
          const refreshUrl = lastUrl;
          if (!refreshUrl) {
            setStatus("Refresh blocked: no URL set");
            postRuntimeStatus("error", "No URL available for refresh.");
            figma.notify("No URL available for refresh.", { error: true });
            return;
          }
          void runPreviewPipeline(refreshUrl, "refresh", {
            mode: SYNC_MODE.MANUAL
          });
          return;
        }
        if (command.type === UI_COMMAND.SUBMIT_PAT) {
          void (async () => {
            const patStore = await getRuntimePatStore();
            patStore.set(command.sourceKey, command.token);
            await patStore.flush();
            const retryUrl = (authContext && typeof authContext === "object" && authContext.sourceKey === command.sourceKey && typeof authContext.url === "string" ? authContext.url : "") || lastUrl;
            if (!retryUrl) {
              setStatus("PAT saved, waiting for URL");
              postRuntimeStatus("success", "PAT guardado para este fichero.", "", {
                sourceKey: command.sourceKey
              });
              figma.notify("PAT guardado para este fichero.");
              return;
            }
            setStatus("PAT actualizado. Reintentando...");
            postRuntimeStatus("loading", "Reintentando con PAT actualizado...", "", {
              sourceKey: command.sourceKey
            });
            figma.notify("Reintentando con PAT actualizado...");
            await runPreviewPipeline(retryUrl, "pat-retry", {
              mode: SYNC_MODE.MANUAL,
              sourceKey: command.sourceKey
            });
          })();
          return;
        }
        if (command.type === UI_COMMAND.FORGET_PAT) {
          void (async () => {
            const patStore = await getRuntimePatStore();
            patStore.remove(command.sourceKey);
            await patStore.flush();
            if (authContext && typeof authContext === "object" && authContext.sourceKey === command.sourceKey) {
              setAuthContext(null);
            }
            setStatus("PAT olvidado para este fichero");
            postRuntimeStatus("success", "PAT olvidado para este fichero.", "", {
              sourceKey: command.sourceKey
            });
            figma.notify("PAT olvidado para este fichero.");
          })();
        }
      };
      if (!autoRefreshBootstrapped && lastUrl) {
        autoRefreshBootstrapped = true;
        void maybeRunAutoRefresh("resume");
      }
      return () => {
        figma.ui.onmessage = void 0;
      };
    });
    const lastResult = buildLastResult(embedSnapshot, embedBlock);
    return h(
      AutoLayout,
      {
        direction: "vertical",
        width: 420,
        spacing: 8,
        padding: 12,
        fill: "#FFFFFF",
        stroke: "#D9D9D9",
        cornerRadius: 8
      },
      h(Text, { fontSize: 12, fontWeight: 600 }, "GitHub Preview Widget"),
      h(Text, { fontSize: 11, fill: "#5C5C5C" }, status),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        lastUrl ? `Last URL: ${lastUrl}` : "No URL captured yet"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        embedBlock ? `Embed: ${embedBlock.sections.header.ownerRepo} \xB7 ${embedBlock.sections.header.path}` : "Embed: pending"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#7A7A7A" },
        embedBlock ? `Sync: ${embedBlock.sections.header.statusBadge.label} \xB7 ${embedBlock.sections.header.lastSync}` : "Sync: idle"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        embedSnapshot ? `Warnings: ${embedSnapshot.warningCount || 0} \xB7 Progressive: ${((_a = embedSnapshot.render) == null ? void 0 : _a.progressive) ? "yes" : "no"}` : "Warnings: 0 \xB7 Progressive: no"
      ),
      h(
        Text,
        { fontSize: 10, fill: "#8B8B8B" },
        `Last result: ${lastResult.status || "idle"} (${lastResult.mode || "manual"})`
      )
    );
  }
  widget.register(GitHubPreviewWidget);
})();
