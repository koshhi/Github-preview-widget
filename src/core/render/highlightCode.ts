const { detectMinifiedJson } = require("./detectMinifiedJson.ts");
const { EXTENSION_TO_LANGUAGE, RENDER_KIND } = require("./types.ts");

const JS_TS_KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|await|async|import|from|export|class|new|try|catch)\b/g;

function normalizeExtension(extension) {
  if (typeof extension !== "string") return "txt";
  return extension.replace(/^\./, "").toLowerCase();
}

function basicHighlight(source, language) {
  if (language === "javascript" || language === "typescript") {
    return source.replace(JS_TS_KEYWORDS, "‹$1›");
  }

  if (language === "json") {
    return source
      .replace(/"([^"]+)":/g, "“$1”:")
      .replace(/\b(true|false|null)\b/g, "‹$1›");
  }

  return source;
}

function highlightCode(input) {
  const content = typeof input?.content === "string" ? input.content : "";
  const extension = normalizeExtension(input?.extension);
  const language = EXTENSION_TO_LANGUAGE[extension] || "text";
  const warnings = [];
  let renderContent = content;
  let kind = language === "text" ? RENDER_KIND.TEXT : RENDER_KIND.CODE;

  if (extension === "json") {
    const minified = detectMinifiedJson(content);

    if (minified.isMinified) {
      try {
        renderContent = JSON.stringify(JSON.parse(content), null, 2);
      } catch {
        warnings.push("JSON inválido. Se muestra contenido como texto plano.");
        kind = RENDER_KIND.TEXT;
      }
    } else if (minified.reason === "invalid_json") {
      warnings.push("JSON inválido. Se muestra contenido como texto plano.");
      kind = RENDER_KIND.TEXT;
    }
  }

  const highlightedContent = kind === RENDER_KIND.TEXT
    ? renderContent
    : basicHighlight(renderContent, language);

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
            highlighted: kind === RENDER_KIND.CODE,
          },
        },
      ],
      warnings,
    },
  };
}

module.exports = {
  highlightCode,
};
