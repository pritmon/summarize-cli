import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-4-20250514";
const MAX_CONTENT_CHARS = 100_000;

export interface SummaryResult {
  bullets: string[];
  source: string;
}

function printStatus(msg: string): void {
  process.stderr.write(`\x1b[2m${msg}\x1b[0m\n`);
}

export async function summarise(
  content: string,
  source: string,
  jsonOutput: boolean
): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    process.stderr.write(
      `\x1b[31mError:\x1b[0m ANTHROPIC_API_KEY environment variable is not set.\nExport it before running: export ANTHROPIC_API_KEY=sk-ant-...\n`
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
        bullets = [text];
      }

      const result: SummaryResult = { bullets, source };
      console.log(JSON.stringify(result, null, 2));
    } else {
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
      process.stderr.write(
        `\x1b[31mError:\x1b[0m Invalid API key — check your ANTHROPIC_API_KEY.\n`
      );
    } else if (err instanceof Anthropic.RateLimitError) {
      process.stderr.write(
        `\x1b[31mError:\x1b[0m Rate limit exceeded. Wait a moment and try again.\n`
      );
    } else if (err instanceof Anthropic.APIError) {
      process.stderr.write(
        `\x1b[31mError:\x1b[0m Anthropic API error (HTTP ${err.status}): ${err.message}\n`
      );
    } else {
      process.stderr.write(
        `\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : String(err)}\n`
      );
    }
    process.exit(1);
  }
}
