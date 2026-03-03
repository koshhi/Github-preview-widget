function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeWarningList(list) {
  const seen = new Set();
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
  const sourceBlocks = asArray(preview.blocks);
  const normalizedBlocks = [];
  const warnings = normalizeWarningList(preview.warnings);

  for (const block of sourceBlocks) {
    if (block?.type === "mermaid") {
      normalizedBlocks.push({
        type: "code",
        language: "mermaid",
        content: String(block.content || ""),
        meta: {
          fromMermaidDiagram: true,
          phasePolicy: "code_view_only",
        },
      });

      warnings.push("Mermaid shown as code in phase 6.");
      continue;
    }

    if (block?.type === "code" && block?.language === "mermaid" && block?.meta?.fallback) {
      warnings.push("Mermaid fallback active: showing code block.");
      normalizedBlocks.push(block);
      continue;
    }

    normalizedBlocks.push(block);
  }

  const dedupedWarnings = normalizeWarningList(warnings);
  const warningDetail =
    dedupedWarnings.length > 0
      ? `${dedupedWarnings[0]}${dedupedWarnings.length > 1 ? ` (+${dedupedWarnings.length - 1} more)` : ""}`
      : "";

  return {
    preview: {
      ...preview,
      blocks: normalizedBlocks,
      warnings: dedupedWarnings,
    },
    warnings: dedupedWarnings,
    warningDetail,
    policy: {
      mode: preview.progressive ? "progressive" : "full",
      firstPreviewMs: preview?.metrics?.firstPreviewMs || null,
      targetMs:
        typeof options.targetFirstPreviewMs === "number" ? options.targetFirstPreviewMs : 2000,
    },
  };
}

module.exports = {
  normalizeRenderForWidget,
};
