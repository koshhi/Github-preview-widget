const { marked } = require("marked");
const { RENDER_KIND } = require("./types.ts");
const { renderMermaidBlocks } = require("./renderMermaidBlocks.ts");

marked.setOptions({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: false,
  smartypants: false,
});

function isHtmlLike(line) {
  return /<[^>]+>/.test(line);
}

function serializeInlineTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return "";
  }

  const out = [];
  for (const token of tokens) {
    const type = typeof token?.type === "string" ? token.type : "";

    if (type === "text" || type === "escape") {
      out.push(String(token.text || ""));
      continue;
    }

    if (type === "codespan") {
      out.push(`\`${String(token.text || "")}\``);
      continue;
    }

    if (type === "strong") {
      out.push(`**${serializeInlineTokens(token.tokens)}**`);
      continue;
    }

    if (type === "em") {
      out.push(`*${serializeInlineTokens(token.tokens)}*`);
      continue;
    }

    if (type === "del") {
      out.push(`~~${serializeInlineTokens(token.tokens)}~~`);
      continue;
    }

    if (type === "br") {
      out.push("\n");
      continue;
    }

    if (type === "link") {
      const href = String(token.href || "").trim();
      const text = serializeInlineTokens(token.tokens) || String(token.text || href);
      if (href) {
        out.push(`[${text}](${href})`);
      } else {
        out.push(text);
      }
      continue;
    }

    if (type === "image") {
      const alt = String(token.text || "").trim();
      const href = String(token.href || "").trim();
      if (href) {
        out.push(`![${alt}](${href})`);
      }
      continue;
    }

    if (type === "html") {
      out.push(String(token.raw || token.text || ""));
      continue;
    }

    if (Array.isArray(token?.tokens) && token.tokens.length > 0) {
      out.push(serializeInlineTokens(token.tokens));
      continue;
    }

    if (typeof token?.text === "string") {
      out.push(token.text);
      continue;
    }

    if (typeof token?.raw === "string") {
      out.push(token.raw);
    }
  }

  return out.join("");
}

function renderTableDividerCell(align) {
  if (align === "left") return ":---";
  if (align === "right") return "---:";
  if (align === "center") return ":---:";
  return "---";
}

function toMarkdownTable(token) {
  const header = Array.isArray(token?.header) ? token.header : [];
  const rows = Array.isArray(token?.rows) ? token.rows : [];
  if (header.length === 0) {
    return "";
  }

  const headerCells = header.map((cell) =>
    serializeInlineTokens(cell?.tokens || []).trim() || String(cell?.text || "").trim()
  );
  const align = Array.isArray(token?.align) ? token.align : [];
  const dividerCells = headerCells.map((_, index) => renderTableDividerCell(align[index]));

  const lineRows = rows.map((row) => {
    const cells = Array.isArray(row) ? row : [];
    const out = [];
    for (let index = 0; index < headerCells.length; index += 1) {
      const cell = cells[index];
      const text =
        serializeInlineTokens(cell?.tokens || []).trim() || String(cell?.text || "").trim();
      out.push(text);
    }
    return out;
  });

  const lines = [
    `| ${headerCells.join(" | ")} |`,
    `| ${dividerCells.join(" | ")} |`,
    ...lineRows.map((cells) => `| ${cells.join(" | ")} |`),
  ];

  return lines.join("\n");
}

function normalizeListItemContent(item) {
  const tokenText = serializeInlineTokens(item?.tokens || []).trim();
  const rawText = String(item?.text || "").trim();
  const content = tokenText || rawText;
  return content.replace(/\r?\n+/g, "\n").trim();
}

function collectListItems(token, depth, out) {
  const items = Array.isArray(token?.items) ? token.items : [];
  for (const item of items) {
    const content = normalizeListItemContent(item);
    if (content) {
      const normalizedItem = {
        content,
        depth,
        ordered:
          typeof token?.ordered === "boolean" ? token.ordered : false,
      };
      if (item?.task === true) {
        normalizedItem.task = { checked: Boolean(item.checked) };
      }
      out.push(normalizedItem);
    }

    for (const child of Array.isArray(item?.tokens) ? item.tokens : []) {
      if (child?.type === "list") {
        collectListItems(child, depth + 1, out);
      }
    }
  }
}

function parseMarkdownBlocks(markdown) {
  const source = String(markdown || "");
  const blocks = [];
  const warnings = [];

  try {
    const tokens = marked.lexer(source, { gfm: true });
    for (const token of tokens) {
      const type = typeof token?.type === "string" ? token.type : "";

      if (type === "space") {
        continue;
      }

      if (type === "heading") {
        blocks.push({
          type: "heading",
          depth: Number(token.depth) || 1,
          content:
            serializeInlineTokens(token.tokens || []).trim() ||
            String(token.text || "").trim(),
        });
        continue;
      }

      if (type === "paragraph" || type === "text") {
        const content =
          serializeInlineTokens(token.tokens || []).trim() ||
          String(token.text || "").trim();
        if (content) {
          blocks.push({
            type: "paragraph",
            content,
            meta: {
              htmlEscaped: isHtmlLike(content),
            },
          });
        }
        continue;
      }

      if (type === "blockquote") {
        const content = String(token.text || "").trim();
        if (content) {
          blocks.push({
            type: "blockquote",
            content,
          });
        }
        continue;
      }

      if (type === "list") {
        const items = [];
        collectListItems(token, 1, items);
        if (items.length > 0) {
          blocks.push({
            type: "list",
            ordered: Boolean(token.ordered),
            start:
              Number.isFinite(Number(token.start)) && Number(token.start) > 0
                ? Number(token.start)
                : 1,
            items,
          });
        }
        continue;
      }

      if (type === "table") {
        const tableMarkdown = toMarkdownTable(token);
        if (tableMarkdown) {
          blocks.push({
            type: "table",
            content: tableMarkdown,
          });
        }
        continue;
      }

      if (type === "hr") {
        blocks.push({
          type: "divider",
        });
        continue;
      }

      if (type === "code") {
        blocks.push({
          type: "code",
          language: String(token.lang || "").toLowerCase() || "text",
          content: String(token.text || ""),
        });
        continue;
      }

      if (type === "html") {
        const content = String(token.raw || token.text || "").trim();
        if (content) {
          blocks.push({
            type: "paragraph",
            content,
            meta: {
              htmlEscaped: true,
            },
          });
        }
        continue;
      }

      const fallback = String(token?.raw || token?.text || "").trim();
      if (fallback) {
        blocks.push({
          type: "paragraph",
          content: fallback,
          meta: {
            htmlEscaped: isHtmlLike(fallback),
          },
        });
      }
    }
  } catch (error) {
    warnings.push("No se pudo parsear markdown GFM completo; se muestra fallback textual.");
    if (source.trim()) {
      blocks.push({
        type: "paragraph",
        content: source.trim(),
        meta: {
          htmlEscaped: isHtmlLike(source),
        },
      });
    }
  }

  return { blocks, warnings };
}

function renderMarkdown(markdown, options = {}) {
  const parsed = parseMarkdownBlocks(markdown);
  const mermaidResult = renderMermaidBlocks(parsed.blocks, {
    defaultView: options.mermaidDefaultView || "diagram",
  });

  return {
    ok: true,
    value: {
      kind: RENDER_KIND.MARKDOWN,
      blocks: mermaidResult.blocks,
      warnings: [...parsed.warnings, ...mermaidResult.warnings],
    },
  };
}

module.exports = {
  renderMarkdown,
};
