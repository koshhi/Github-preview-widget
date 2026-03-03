const { RENDER_KIND } = require("./types.ts");
const { renderMermaidBlocks } = require("./renderMermaidBlocks.ts");

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
        warnings.push("Bloque de código sin cierre detectado. Se degradó al final del documento.");
      }

      blocks.push({
        type: "code",
        language,
        content: codeLines.join("\n"),
      });
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      const depth = trimmed.match(/^#{1,6}/)[0].length;
      blocks.push({
        type: "heading",
        depth,
        content: trimmed.slice(depth).trim(),
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
        items,
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
        content: tableLines.join("\n"),
      });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !/^#{1,6}\s+/.test(lines[index].trim()) &&
      !/^[-*+]\s+/.test(lines[index].trim()) &&
      !(lines[index].includes("|") && isTableDivider(lines[index + 1] || ""))
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    const paragraph = paragraphLines.join(" ").trim();
    blocks.push({
      type: "paragraph",
      content: paragraph,
      meta: {
        htmlEscaped: isHtmlLike(paragraph),
      },
    });
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
