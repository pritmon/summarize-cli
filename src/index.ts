#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as https from "https";
import * as http from "http";
import * as path from "path";

const MODEL = "claude-opus-4-20250514";
const MAX_CONTENT_CHARS = 100_000;

// ── Content fetching ──────────────────────────────────────────────────────────

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https://") ? https : http;
    const req = protocol.get(url, (res) => {
      if (
        res.statusCode !== undefined &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        // Follow one redirect
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== undefined && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(15_000, () => {
      req.destroy(new Error("Request timed out after 15 seconds"));
    });
  });
}

async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, "utf-8");
}

// ── Summarisation ─────────────────────────────────────────────────────────────

interface SummaryResult {
  bullets: string[];
  source: string;
}

async function summarise(
  content: string,
  source: string,
  jsonOutput: boolean
): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    printError(
      "ANTHROPIC_API_KEY environment variable is not set.\n" +
        "Export it before running: export ANTHROPIC_API_KEY=sk-ant-..."
    );
    process.exit(1);
  }

  const client = new Anthropic();

  const truncated = content.slice(0, MAX_CONTENT_CHARS);
  const wasTruncated = content.length > MAX_CONTENT_CHARS;

  const systemPrompt = jsonOutput
    ? `You are a concise summarizer. Respond with a JSON object and nothing else.
The object must have a "bullets" key whose value is an array of 3–5 strings,
each string being one key bullet point from the content.
Do not wrap the JSON in markdown code fences.`
    : `You are a concise summarizer. Respond with 3–5 bullet points that capture
the most important information from the content provided.
Use the • character to start each bullet. No preamble, no closing remarks.`;

  const userMessage =
    `Summarize the following content in 3–5 bullet points.` +
    (wasTruncated
      ? ` (Note: content was truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters)`
      : "") +
    `\n\n${truncated}`;

  printStatus(`Summarizing with ${MODEL}…`);

  try {
    if (jsonOutput) {
      // Collect the full response then parse/output JSON
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const text =
        message.content.find((b) => b.type === "text")?.text.trim() ?? "";

      let bullets: string[];
      try {
        const parsed = JSON.parse(text) as { bullets?: unknown };
        if (Array.isArray(parsed.bullets)) {
          bullets = (parsed.bullets as unknown[]).map(String);
        } else {
          throw new Error("Missing 'bullets' array in response");
        }
      } catch {
        // Fallback: treat the raw text as a single bullet
        bullets = [text];
      }

      const result: SummaryResult = { bullets, source };
      console.log(JSON.stringify(result, null, 2));
    } else {
      // Stream text output for a responsive terminal experience
      process.stdout.write("\n");
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      stream.on("text", (text) => process.stdout.write(text));
      await stream.finalMessage();
      process.stdout.write("\n");
    }
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      printError("Invalid API key — check your ANTHROPIC_API_KEY.");
    } else if (err instanceof Anthropic.RateLimitError) {
      printError("Rate limit exceeded. Wait a moment and try again.");
    } else if (err instanceof Anthropic.APIError) {
      printError(`Anthropic API error (HTTP ${err.status}): ${err.message}`);
    } else {
      printError(err instanceof Error ? err.message : String(err));
    }
    process.exit(1);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function printStatus(msg: string): void {
  process.stderr.write(`\x1b[2m${msg}\x1b[0m\n`);
}

function printError(msg: string): void {
  process.stderr.write(`\x1b[31mError:\x1b[0m ${msg}\n`);
}

function printHelp(): void {
  console.log(`
\x1b[1msummarize\x1b[0m — Summarize any URL or file using Claude

\x1b[1mUsage:\x1b[0m
  summarize <url-or-filepath> [--json]

\x1b[1mArguments:\x1b[0m
  <url-or-filepath>   A URL (http/https) or a path to a local file

\x1b[1mOptions:\x1b[0m
  --json              Output structured JSON instead of bullet points
  --help, -h          Show this help message

\x1b[1mEnvironment:\x1b[0m
  ANTHROPIC_API_KEY   Your Anthropic API key (required)

\x1b[1mExamples:\x1b[0m
  summarize https://en.wikipedia.org/wiki/Machine_learning
  summarize ./report.txt
  summarize ./notes.md --json
  summarize https://example.com/article --json
`);
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const jsonOutput = args.includes("--json");
  const input = args.find((a) => !a.startsWith("--"));

  if (!input) {
    printError("No URL or file path provided.");
    process.exit(1);
  }

  let content: string;
  let source: string;

  const isUrl =
    input.startsWith("http://") || input.startsWith("https://");

  try {
    if (isUrl) {
      source = input;
      printStatus(`Fetching ${input}…`);
      content = await fetchUrl(input);
    } else {
      const resolved = path.resolve(input);
      if (!fs.existsSync(resolved)) {
        printError(`File not found: ${input}`);
        process.exit(1);
      }
      source = resolved;
      content = await readFile(resolved);
    }
  } catch (err) {
    printError(
      `Failed to read content: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }

  if (!content.trim()) {
    printError("Content is empty — nothing to summarize.");
    process.exit(1);
  }

  await summarise(content, source, jsonOutput);
}

main();
