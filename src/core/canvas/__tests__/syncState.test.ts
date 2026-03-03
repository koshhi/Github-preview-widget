const test = require("node:test");
const assert = require("node:assert/strict");

const { transitionSyncState, buildSyncBadge } = require("../syncState.ts");

test("transitions idle -> syncing with manual mode", () => {
  const next = transitionSyncState(
    {
      status: "idle",
      mode: "manual",
      message: "Sin sincronizar",
    },
    {
      type: "start",
      mode: "manual",
    },
    {
      now: "2026-03-02T19:00:00.000Z",
    }
  );

  assert.equal(next.status, "syncing");
  assert.equal(next.mode, "manual");
  assert.equal(next.message, "Syncing...");
  assert.equal(next.lastUpdatedAt, "2026-03-02T19:00:00.000Z");
});

test("transitions syncing -> success and writes sync timestamp", () => {
  const next = transitionSyncState(
    {
      status: "syncing",
      mode: "manual",
      message: "Syncing...",
    },
    {
      type: "success",
      mode: "manual",
      message: "Sincronización completada",
      syncedAt: "2026-03-02T19:02:00.000Z",
    },
    {
      now: "2026-03-02T19:02:00.000Z",
    }
  );

  assert.equal(next.status, "success");
  assert.equal(next.mode, "manual");
  assert.equal(next.lastSyncAt, "2026-03-02T19:02:00.000Z");
  assert.equal(next.message, "Sincronización completada");
});

test("transitions syncing -> error keeping details visible", () => {
  const next = transitionSyncState(
    {
      status: "syncing",
      mode: "auto",
      message: "Syncing...",
      lastSyncAt: "2026-03-02T18:30:00.000Z",
    },
    {
      type: "error",
      mode: "auto",
      message: "Sync error",
      details: "403 Resource not accessible",
    },
    {
      now: "2026-03-02T19:04:00.000Z",
    }
  );

  assert.equal(next.status, "error");
  assert.equal(next.mode, "auto");
  assert.equal(next.lastSyncAt, "2026-03-02T18:30:00.000Z");
  assert.equal(next.details, "403 Resource not accessible");
});

test("buildSyncBadge maps status and mode to semantic label", () => {
  const autoSuccess = buildSyncBadge({
    status: "success",
    mode: "auto",
    lastSyncAt: "2026-03-02T19:05:00.000Z",
  });

  assert.equal(autoSuccess.label, "Auto-sync");
  assert.equal(autoSuccess.tone, "success");
  assert.equal(autoSuccess.lastSyncAt, "2026-03-02T19:05:00.000Z");

  const failed = buildSyncBadge({
    status: "error",
    mode: "manual",
  });
  assert.equal(failed.label, "Sync error");
  assert.equal(failed.tone, "danger");
});
