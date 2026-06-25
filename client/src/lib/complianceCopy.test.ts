import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { BLOCKED_RESULT_PHRASES } from "@shared/complianceCopy";

const CLIENT_SRC = join(import.meta.dirname, "..");

function walkTsFiles(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (name === "node_modules" || name.startsWith(".") || name === "admin") continue;
    const st = statSync(full);
    if (st.isDirectory()) walkTsFiles(full, files);
    else if (extname(name) === ".ts" || extname(name) === ".tsx") files.push(full);
  }
  return files;
}

describe("BLOCKED_RESULT_PHRASES guardrail", () => {
  it("blocked phrases do not appear in client UI source (case-insensitive)", () => {
    const files = walkTsFiles(CLIENT_SRC).filter((f) => !f.endsWith(".test.ts"));
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8").toLowerCase();
      for (const phrase of BLOCKED_RESULT_PHRASES) {
        if (content.includes(phrase.toLowerCase())) {
          violations.push(`${file}: "${phrase}"`);
        }
      }
    }

    assert.equal(
      violations.length,
      0,
      `Blocked phrases found in UI source:\n${violations.join("\n")}`,
    );
  });
});
