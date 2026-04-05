#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { parseArgs } from "./cli";
import { fetchUrl } from "./fetcher";
import { readFile } from "./reader";
import { summarise } from "./summarize";

async function main(): Promise<void> {
  const { input, jsonOutput } = parseArgs(process.argv) ?? { input: "", jsonOutput: false };

  const isUrl = input.startsWith("http://") || input.startsWith("https://");

  let content: string;
  let source: string;

  try {
    if (isUrl) {
      source = input;
      process.stderr.write(`\x1b[2mFetching ${input}…\x1b[0m\n`);
      content = await fetchUrl(input);
    } else {
      const resolved = path.resolve(input);
      if (!fs.existsSync(resolved)) {
        process.stderr.write(`\x1b[31mError:\x1b[0m File not found: ${input}\n`);
        process.exit(1);
      }
      source = resolved;
      content = await readFile(resolved);
    }
  } catch (err) {
    process.stderr.write(
      `\x1b[31mError:\x1b[0m Failed to read content: ${err instanceof Error ? err.message : String(err)}\n`
    );
    process.exit(1);
  }

  if (!content.trim()) {
    process.stderr.write(`\x1b[31mError:\x1b[0m Content is empty — nothing to summarize.\n`);
    process.exit(1);
  }

  await summarise(content, source, jsonOutput);
}

main().catch((err) => {
  process.stderr.write(`\x1b[31mUnexpected error:\x1b[0m ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
