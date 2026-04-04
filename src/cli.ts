export interface CliArgs {
  input: string;
  jsonOutput: boolean;
}

export function parseArgs(argv: string[]): CliArgs | null {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const jsonOutput = args.includes("--json");
  const input = args.find((a) => !a.startsWith("--"));

  if (!input) {
    process.stderr.write(`\x1b[31mError:\x1b[0m No URL or file path provided.\n`);
    process.exit(1);
  }

  return { input, jsonOutput };
}

function printHelp(): void {
  console.log(`
\x1b[1msummarize\x1b[0m — Summarize any URL or file using Claude

\x1b[1mUsage:\x1b[0m
  summarize <url-or-filepath> [--json]

\x1b[1mArguments:\x1b[0m
  <url-or-filepath>   A URL (http/https) or a path to a local file

\x1b[1mSupported file types:\x1b[0m
  .txt  .md  .pdf  and any plain-text format

\x1b[1mOptions:\x1b[0m
  --json              Output structured JSON instead of bullet points
  --help, -h          Show this help message

\x1b[1mEnvironment:\x1b[0m
  ANTHROPIC_API_KEY   Your Anthropic API key (required)

\x1b[1mExamples:\x1b[0m
  summarize https://en.wikipedia.org/wiki/Machine_learning
  summarize ./report.pdf
  summarize ./notes.md --json
  summarize https://example.com/article --json
`);
}
