const { readdirSync, statSync } = require("node:fs");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");

function listTestFiles(rootDir) {
  const out = [];

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const absolutePath = join(dir, entry);
      const stats = statSync(absolutePath);
      if (stats.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (absolutePath.endsWith(".test.ts")) {
        out.push(absolutePath);
      }
    }
  }

  walk(rootDir);
  out.sort();
  return out;
}

const testFiles = listTestFiles(join(__dirname, "..", "src"));
if (testFiles.length === 0) {
  console.error("No test files found under src/**/*.test.ts");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

console.error(result.error ? result.error.message : "Test runner failed.");
process.exit(1);
