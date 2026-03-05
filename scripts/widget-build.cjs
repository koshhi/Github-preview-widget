#!/usr/bin/env node
const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const { dirname, resolve } = require("node:path");
const esbuild = require("esbuild");

async function main() {
  const root = process.cwd();
  const entry = resolve(root, "src/widget/code.ts");
  const uiPath = resolve(root, "src/widget/ui.html");
  const outFile = resolve(root, "src/widget/code.js");
  const uiHtml = readFileSync(uiPath, "utf8");
  mkdirSync(dirname(outFile), { recursive: true });

  await esbuild.build({
    entryPoints: [entry],
    outfile: outFile,
    bundle: true,
    format: "iife",
    platform: "browser",
    // Figma widget runtime rejects some newer syntax (e.g. object spread),
    // so we transpile to a more conservative target.
    target: ["es2017"],
    logLevel: "silent",
    banner: {
      // Do not use "__html__" here because some Figma runtimes define it.
      js: `const __widget_ui_html__ = ${JSON.stringify(uiHtml)};`,
    },
  });

  writeFileSync(outFile, readFileSync(outFile, "utf8"), "utf8");
  console.log("widget:build passed (src/widget/code.js)");
}

main().catch((error) => {
  console.error("widget:build failed");
  console.error(error && error.message ? error.message : String(error));
  process.exit(1);
});
