const __html__ = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>GitHub Preview Widget</title>\n    <style>\n      body {\n        margin: 0;\n        font-family: Inter, sans-serif;\n        background: #f7f7f8;\n        color: #1e1e1f;\n      }\n\n      .root {\n        padding: 14px;\n        display: grid;\n        gap: 10px;\n      }\n\n      .label {\n        font-size: 12px;\n        font-weight: 600;\n      }\n\n      input {\n        width: 100%;\n        box-sizing: border-box;\n        padding: 10px;\n        border-radius: 8px;\n        border: 1px solid #d4d4d8;\n        background: #fff;\n        font-size: 12px;\n      }\n\n      button {\n        border: 0;\n        border-radius: 8px;\n        background: #111827;\n        color: #fff;\n        font-size: 12px;\n        font-weight: 600;\n        padding: 10px;\n        cursor: pointer;\n      }\n\n      .secondary {\n        background: #e4e4e7;\n        color: #111827;\n      }\n    </style>\n  </head>\n  <body>\n    <form class=\"root\" id=\"url-form\">\n      <label class=\"label\" for=\"url-input\">GitHub file URL</label>\n      <input id=\"url-input\" placeholder=\"https://github.com/org/repo/blob/main/README.md\" required />\n      <button type=\"submit\">Create preview</button>\n      <button class=\"secondary\" id=\"refresh-button\" type=\"button\">Refresh preview</button>\n    </form>\n\n    <script>\n      const form = document.getElementById(\"url-form\");\n      const input = document.getElementById(\"url-input\");\n      const refreshButton = document.getElementById(\"refresh-button\");\n      let activeWidgetId = \"active-widget\";\n\n      form.addEventListener(\"submit\", (event) => {\n        event.preventDefault();\n\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"create-preview\",\n              url: input.value,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      refreshButton.addEventListener(\"click\", () => {\n        parent.postMessage(\n          {\n            pluginMessage: {\n              type: \"refresh-preview\",\n              widgetId: activeWidgetId,\n            },\n          },\n          \"*\"\n        );\n      });\n\n      window.onmessage = (event) => {\n        const payload = event.data && event.data.pluginMessage;\n        if (!payload || payload.type !== \"widget-context\") {\n          return;\n        }\n\n        if (typeof payload.lastUrl === \"string\" && payload.lastUrl.length > 0) {\n          input.value = payload.lastUrl;\n        }\n\n        if (typeof payload.widgetId === \"string\" && payload.widgetId.length > 0) {\n          activeWidgetId = payload.widgetId;\n        }\n      };\n    </script>\n  </body>\n</html>\n";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/widget/bridge/messages.ts
  var require_messages = __commonJS({
    "src/widget/bridge/messages.ts"(exports, module) {
      var UI_COMMAND2 = Object.freeze({
        CREATE_PREVIEW: "create-preview",
        REFRESH_PREVIEW: "refresh-preview"
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
      module.exports = {
        UI_COMMAND: UI_COMMAND2,
        UI_EVENT: UI_EVENT2,
        createCreatePreviewCommand,
        createRefreshPreviewCommand
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
          value: {
            ...parsedUrl,
            extension: kindResult.value.extension,
            fileKind: kindResult.value.fileKind,
            canonicalBlobUrl: `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`
          }
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
      var SYNC_MODE = Object.freeze({
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
        SYNC_MODE,
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
        SYNC_MODE
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
          mode: typeof (sync == null ? void 0 : sync.mode) === "string" ? sync.mode : SYNC_MODE.MANUAL,
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
        return {
          ...model,
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
        };
      }
      module.exports = {
        composeEmbedBlock
      };
    }
  });

  // src/widget/bootstrap/widgetMetadata.ts
  var require_widgetMetadata = __commonJS({
    "src/widget/bootstrap/widgetMetadata.ts"(exports, module) {
      var { SYNC_MODE, SYNC_STATUS } = require_types2();
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
          syncMode: SYNC_MODE.MANUAL,
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
      var { SYNC_MODE, SYNC_STATUS } = require_types2();
      var { createSeedMetadata } = require_widgetMetadata();
      function createSeedEmbed2(input = {}) {
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
            mode: SYNC_MODE.MANUAL,
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
            embedBlock: {
              ...block,
              metadata: {
                ...block.metadata,
                ...metadata,
                sourceUrl: url
              }
            }
          }
        };
      }
      module.exports = {
        createSeedEmbed: createSeedEmbed2
      };
    }
  });

  // src/widget/code.ts
  var { parseUiCommand } = require_parseUiCommand();
  var { UI_COMMAND, UI_EVENT } = require_messages();
  var { createSeedEmbed } = require_createSeedEmbed();
  var { widget } = figma;
  var { AutoLayout, Text, useEffect, usePropertyMenu, useSyncedState, h } = widget;
  function openWidgetUi() {
    figma.showUI(__html__, {
      width: 420,
      height: 220,
      title: "GitHub Preview Widget"
    });
  }
  function GitHubPreviewWidget() {
    const [status, setStatus] = useSyncedState(
      "runtime-status",
      "Ready: open URL input"
    );
    const [lastUrl, setLastUrl] = useSyncedState("last-url", "");
    const [embedBlock, setEmbedBlock] = useSyncedState("embed-block", null);
    usePropertyMenu(
      [
        {
          itemType: "action",
          tooltip: "Set GitHub URL",
          propertyName: "open-url"
        }
      ],
      (event) => {
        if (event.propertyName === "open-url") {
          openWidgetUi();
          figma.ui.postMessage({
            type: UI_EVENT.WIDGET_CONTEXT,
            widgetId: "active-widget",
            lastUrl
          });
        }
      }
    );
    useEffect(() => {
      figma.ui.onmessage = (message) => {
        const parsed = parseUiCommand(message);
        if (!parsed.ok) {
          setStatus(`Bridge error: ${parsed.error.code}`);
          return;
        }
        const command = parsed.value;
        if (command.type === UI_COMMAND.CREATE_PREVIEW) {
          setLastUrl(command.url);
          const seed = createSeedEmbed({ url: command.url });
          if (!seed.ok) {
            setStatus(`Seed failed: ${seed.error.code}`);
            figma.notify(seed.error.message, { error: true });
            return;
          }
          setEmbedBlock(seed.value.embedBlock);
          setStatus(`Seed ready: ${seed.value.source.sourceKey}`);
          figma.notify("Seed preview created.");
          return;
        }
        if (command.type === UI_COMMAND.REFRESH_PREVIEW) {
          setStatus("Refresh command received (placeholder in phase 5).");
        }
      };
      return () => {
        figma.ui.onmessage = void 0;
      };
    });
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
      )
    );
  }
  widget.register(GitHubPreviewWidget);
})();
