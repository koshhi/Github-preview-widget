#!/usr/bin/env node
const { existsSync, readFileSync } = require("node:fs");

function fail(message) {
  console.error(`widget:check failed: ${message}`);
  process.exit(1);
}

function main() {
  if (!existsSync("manifest.json")) {
    fail("manifest.json is missing");
  }

  const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));

  if (manifest.containsWidget !== true) {
    fail("manifest.containsWidget must be true");
  }

  if (typeof manifest.widgetApi !== "string" || manifest.widgetApi.length === 0) {
    fail("manifest.widgetApi is required");
  }

  if (typeof manifest.main !== "string" || !manifest.main.trim()) {
    fail("manifest.main is required");
  }

  if (typeof manifest.ui !== "string" || !manifest.ui.trim()) {
    fail("manifest.ui is required");
  }

  if (!existsSync(manifest.ui)) {
    fail(`UI file not found: ${manifest.ui}`);
  }

  if (!existsSync(manifest.main)) {
    fail(`Build output not found: ${manifest.main}. Run npm run widget:build`);
  }

  const built = readFileSync(manifest.main, "utf8");
  if (!/widget\.register\(/.test(built)) {
    fail("bundle does not register a widget component");
  }

  console.log("widget:check passed");
}

main();
