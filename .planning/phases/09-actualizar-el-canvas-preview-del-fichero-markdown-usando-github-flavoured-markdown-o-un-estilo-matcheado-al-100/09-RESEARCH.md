# Phase 9: GFM Canvas Preview Fidelity - Research

**Researched:** 2026-03-06
**Domain:** Markdown rendering fidelity + canvas runtime stability in Figma widget
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from conversation + CONTEXT.md)

### Locked Decisions
- Match visual design from Figma and preserve GFM semantics in preview.
- Resolve canvas runtime crashes (`undefined`) during preview synchronization.
- Keep empty state copy and sizing rules already agreed (100px without URL, hug-content behavior).
- Modal preview is currently working and must remain functional.

### Claude's Discretion
- Exact split between "full fidelity" in modal and "safe fidelity" in canvas for very large documents.
- Choice of internal rendering helpers to keep code maintainable.

### Deferred Ideas (OUT OF SCOPE)
- Generic WYSIWYG editing or full HTML renderer inside canvas nodes.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GFM-01 | Parse and represent GFM blocks consistently (modal + canvas) | Use one normalized block model from markdown parser output |
| GFM-02 | Canvas preview preserves visible GFM semantics for supported blocks | Build safe canvas projection per block type with truncation budget |
| UIF-01 | Canvas style aligns with target Figma spec (spacing/copy/empty state) | Reuse layout constants + explicit empty-state branches |
| STB-01 | No runtime crash while syncing preview in canvas | Minimize synced payload + stable UI message handler/session |
| REG-01 | Add regression coverage for GFM + runtime-safe state transitions | Extend tests in render + widget runtime paths |
</phase_requirements>

## Summary

The main risk is not markdown parsing quality (already GFM-capable) but the **translation of rendered content into widget-safe synced state and canvas primitives**. Modal rendering can be richer, while canvas must remain stable under Figma widget constraints.

Recommended approach:
1. Keep a canonical GFM block representation as source for both surfaces.
2. Project to a runtime-safe canvas model (sanitized text + bounded payload).
3. Lock UI session/message handling to avoid dropped UI messages and inconsistent sync state.
4. Add regression tests focused on previously failing behavior.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `marked` | repo version | GFM parsing | Primary parser already adopted for markdown in this project |
| Widget API (`useSyncedState`, `usePropertyMenu`, `showUI`) | Figma runtime | canvas + modal orchestration | Required by widget architecture |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `node:test` | runtime-native | Regression tests for parser/runtime behavior | Always for phase acceptance |
| Existing runtime helpers | repo-default | `createOrRefreshEmbedFromUrl`, sync coordinator, sanitize helpers | Reuse instead of introducing parallel flows |

## Architecture Patterns

### Pattern 1: Single Source of Truth for Preview Blocks
**What:** Normalize GFM once; derive modal and canvas payloads from same source.
**Why:** Prevent modal/canvas divergence and simplify debugging.

### Pattern 2: Safe Canvas Projection Layer
**What:** Convert normalized blocks to bounded, sanitized canvas text structure.
**Why:** Avoid widget runtime crashes caused by large/complex synced objects.

### Pattern 3: Stable UI Session Lifecycle
**What:** Keep UI session alive with `waitForTask` + explicit close handling.
**Why:** Prevent UI opening regressions and dropped bridge messages.

### Anti-Patterns to Avoid
- Duplicating markdown normalization logic separately for modal and canvas.
- Persisting large nested render objects directly in synced state.
- Clearing `figma.ui.onmessage` on each render cycle.

## Common Pitfalls

### Pitfall 1: "Preview created" but canvas unchanged
**Cause:** Runtime state write fails silently due incompatible payload shape/size.
**Mitigation:** Strict safe-state adapter and size clamps before `setEmbedBlock`.

### Pitfall 2: UI opens inconsistently
**Cause:** UI task/session not kept alive in property-menu action.
**Mitigation:** Use `waitForTask` session pattern and explicit `ui-closed` termination.

### Pitfall 3: False positives from host console warnings
**Cause:** Figma sandbox permission warnings unrelated to plugin logic.
**Mitigation:** Validate functional outcomes (render + sync) instead of warning count.

## Open Questions

1. Should "100%" matching prioritize typography/spacing over long-document completeness in canvas?
   - Recommendation: prioritize semantic fidelity + stable readability in canvas, full fidelity in modal.
2. Do we need a dedicated UAT checklist for phase 9 visual parity?
   - Recommendation: yes, short checklist with before/after and one long markdown sample.

## Metadata

**Confidence breakdown:**
- GFM parser fidelity path: HIGH
- Canvas runtime stabilization path: MEDIUM-HIGH
- 1:1 visual parity under widget limits: MEDIUM

**Research date:** 2026-03-06
**Valid until:** 2026-04-06
