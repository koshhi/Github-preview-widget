#!/usr/bin/env node
const { readdirSync, statSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

function collectTsFiles(rootDir) {
  const stack = [rootDir];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && fullPath.endsWith(".ts")) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function runNodeSyntaxCheck(filePath) {
  try {
    const source = readFileSync(filePath, "utf8");
    new vm.Script(source, { filename: filePath });
    return { ok: true, stderr: "" };
  } catch (error) {
    return { ok: false, stderr: error?.message || String(error) };
  }
}

function main() {
  const srcStat = statSync("src", { throwIfNoEntry: false });
  if (!srcStat || !srcStat.isDirectory()) {
    console.error("typecheck: src directory not found.");
    process.exit(1);
  }

  const tsFiles = collectTsFiles("src");
  if (tsFiles.length === 0) {
    console.error("typecheck: no .ts files found in src.");
    process.exit(1);
  }

  const failures = [];
  for (const filePath of tsFiles) {
    const result = runNodeSyntaxCheck(filePath);
    if (!result.ok) {
      failures.push({
        filePath,
        stderr: result.stderr.trim(),
      });
    }
  }

  if (failures.length > 0) {
    console.error("typecheck failed:");
    for (const failure of failures) {
      console.error(`- ${failure.filePath}`);
      if (failure.stderr) console.error(`  ${failure.stderr}`);
    }
    process.exit(1);
  }

  console.log(`typecheck passed (${tsFiles.length} files).`);
}

main();
