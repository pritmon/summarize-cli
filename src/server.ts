import "dotenv/config";
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { fetchUrl } from "./fetcher";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const PORT = process.env.PORT || 3000;
const MODEL = "claude-opus-4-20250514";
const MAX_CONTENT_CHARS = 100_000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/api/summarize", upload.single("file"), async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event: string, data: string) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const jsonOutput = req.body.json === "true" || req.body.json === true;
  let content: string;
  let source: string;

  try {
    if (req.file) {
      source = req.file.originalname;
      const parsed = await pdfParse(req.file.buffer);
      content = parsed.text;
    } else {
      const url: string = req.body.url;
      if (!url) {
        send("error", "No URL or file provided.");
        res.end();
        return;
      }
      source = url;
      send("status", `Fetching ${url}…`);
      content = await fetchUrl(url);
    }
  } catch (err) {
    send("error", err instanceof Error ? err.message : String(err));
    res.end();
    return;
  }

  if (!content.trim()) {
    send("error", "Content is empty — nothing to summarize.");
    res.end();
    return;
  }

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
    (wasTruncated ? ` (Note: content was truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters)` : "") +
    `\n\n${truncated}`;

  send("status", `Summarizing with ${MODEL}…`);

  const client = new Anthropic();

  try {
    if (jsonOutput) {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const text = message.content.find((b) => b.type === "text")?.text.trim() ?? "";
      let bullets: string[];
      try {
        const parsed = JSON.parse(text) as { bullets?: unknown };
        bullets = Array.isArray(parsed.bullets) ? (parsed.bullets as unknown[]).map(String) : [text];
      } catch {
        bullets = [text];
      }

      send("result", JSON.stringify({ bullets, source }));
    } else {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      req.on("close", () => stream.abort());
      stream.on("text", (chunk) => send("chunk", chunk));
      await stream.finalMessage();
      send("done", source);
    }
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      send("error", "Invalid API key — check your ANTHROPIC_API_KEY.");
    } else if (err instanceof Anthropic.RateLimitError) {
      send("error", "Rate limit exceeded. Wait a moment and try again.");
    } else {
      send("error", err instanceof Error ? err.message : String(err));
    }
  }

  res.end();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\x1b[32m✓\x1b[0m Server running at http://localhost:${PORT}`);
  });
}

export default app;
