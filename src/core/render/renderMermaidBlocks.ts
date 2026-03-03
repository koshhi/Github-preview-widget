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
    "timeline",
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
          toggleEnabled: true,
        },
      };
    }

    warnings.push("Bloque Mermaid inválido. Se muestra fallback de código.");
    return {
      type: "code",
      language: "mermaid",
      content: source,
      meta: {
        fallback: true,
      },
    };
  });

  return {
    blocks: nextBlocks,
    warnings,
  };
}

module.exports = {
  renderMermaidBlocks,
};
