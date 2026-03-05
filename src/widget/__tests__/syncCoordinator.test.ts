const test = require("node:test");
const assert = require("node:assert/strict");

const { SYNC_STATUS } = require("../../core/canvas/types.ts");
const {
  createSyncCoordinator,
  shouldRunAutoRefresh,
} = require("../runtime/syncCoordinator.ts");

test("manual coordinator prevents duplicate refresh while syncing/locked", () => {
  const coordinator = createSyncCoordinator({ cooldownMs: 60_000 });
  const sourceKey = "octocat/hello-world@main:docs/README.md";

  const first = coordinator.beginManual({
    sourceKey,
    syncStatus: SYNC_STATUS.IDLE,
  });
  assert.equal(first.ok, true);

  const second = coordinator.beginManual({
    sourceKey,
    syncStatus: SYNC_STATUS.IDLE,
  });
  assert.equal(second.ok, false);
  assert.equal(second.reason, "manual_lock");

  coordinator.endManual(sourceKey);

  const third = coordinator.beginManual({
    sourceKey,
    syncStatus: SYNC_STATUS.SYNCING,
  });
  assert.equal(third.ok, false);
  assert.equal(third.reason, "already_syncing");
});

test("auto refresh eligibility enforces source/url and cooldown", () => {
  const sourceKey = "octocat/hello-world@main:docs/README.md";
  const sourceUrl = "https://github.com/octocat/hello-world/blob/main/docs/README.md";

  const missingSource = shouldRunAutoRefresh({
    sourceKey: "",
    sourceUrl,
    syncStatus: SYNC_STATUS.IDLE,
    nowMs: 1_000,
  });
  assert.equal(missingSource.ok, false);
  assert.equal(missingSource.reason, "missing_source_key");

  const first = shouldRunAutoRefresh(
    {
      sourceKey,
      sourceUrl,
      syncStatus: SYNC_STATUS.IDLE,
      nowMs: 10_000,
    },
    { cooldownMs: 60_000 }
  );
  assert.equal(first.ok, true);

  const cooldown = shouldRunAutoRefresh(
    {
      sourceKey,
      sourceUrl,
      syncStatus: SYNC_STATUS.IDLE,
      lastAutoRefreshAtMs: 10_000,
      nowMs: 20_000,
    },
    { cooldownMs: 60_000 }
  );
  assert.equal(cooldown.ok, false);
  assert.equal(cooldown.reason, "cooldown");

  const eligibleAgain = shouldRunAutoRefresh(
    {
      sourceKey,
      sourceUrl,
      syncStatus: SYNC_STATUS.IDLE,
      lastAutoRefreshAtMs: 10_000,
      nowMs: 71_000,
    },
    { cooldownMs: 60_000 }
  );
  assert.equal(eligibleAgain.ok, true);
});
