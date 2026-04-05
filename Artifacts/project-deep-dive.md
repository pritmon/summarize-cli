# Project Deep Dive — summarize-cli

A comprehensive walkthrough of every technical decision made in this project.
Use this to solidify your understanding before any technical discussion.

---

## 1. Project Overview

**Q: Walk me through this project in 60 seconds.**

> summarize-cli is a full-stack AI tool that takes any URL, plain-text file, or PDF and returns a 3–5 bullet point summary powered by Anthropic's Claude API. It has two interfaces — a terminal CLI and a browser-based web UI. The backend is a Node.js/TypeScript Express server with Server-Sent Events for real-time streaming. It's deployed on Render and tracked with Google Analytics.

---

## 2. Architecture & Design

**Q: Why did you split the source into multiple modules instead of keeping everything in one file?**

> Single-responsibility principle. Each module has one job:
> - `cli.ts` — argument parsing
> - `fetcher.ts` — HTTP requests
> - `reader.ts` — file reading and PDF parsing
> - `summarize.ts` — Anthropic API calls
> - `server.ts` — Express web server
> - `index.ts` — CLI entry point
>
> This makes each piece testable in isolation, easier to maintain, and prevents one change from breaking unrelated functionality.

---

**Q: How does the CLI and the web server coexist without conflicting?**

> They are two separate entry points:
> - `dist/index.js` → CLI (via the `summarize` binary)
> - `dist/server.js` → Web server (via `npm start`)
>
> The server uses a `require.main === module` guard so it only starts listening when run directly, not when imported. Shared logic like `fetcher.ts` and `reader.ts` are imported by both without duplication.

---

## 3. TypeScript

**Q: Why TypeScript over plain JavaScript?**

> TypeScript catches bugs at compile time rather than runtime. For example, if I accidentally pass a string where a Buffer is expected in the PDF parser, the compiler rejects it before the code ever runs. It also provides better IDE support and makes the codebase self-documenting through types.

---

**Q: What does `strict: true` in tsconfig do?**

> It enables a set of strict type checks including:
> - `strictNullChecks` — no implicit null/undefined
> - `noImplicitAny` — every variable must have a type
> - `strictFunctionTypes` — stricter function parameter checking
>
> This eliminates an entire class of runtime errors.

---

## 4. Streaming with Server-Sent Events (SSE)

**Q: What is SSE and why did you use it instead of WebSockets?**

> Server-Sent Events (SSE) is a one-way push protocol over HTTP where the server streams data to the browser. I chose it because:
> - Summarization is one-directional (server → client only)
> - SSE works over standard HTTP — no protocol upgrade needed
> - It's simpler than WebSockets for this use case
> - Native browser support with automatic reconnection
>
> WebSockets would be overkill here since we don't need two-way communication.

---

**Q: Why did you use `fetch` with a ReadableStream instead of the native `EventSource` API?**

> `EventSource` only supports GET requests. Since our `/api/summarize` endpoint is a POST (to carry the URL or file upload), we had to use `fetch()` with a `ReadableStream` reader and manually parse the SSE protocol (`event:` and `data:` lines).

---

**Q: What SSE events does your server emit?**

| Event | Payload | Purpose |
|-------|---------|---------|
| `status` | string | Progress message ("Fetching…", "Summarizing…") |
| `chunk` | string | Streaming text fragment |
| `result` | JSON string | Complete JSON result (JSON mode) |
| `done` | source string | Stream complete |
| `error` | string | Error message |

---

## 5. PDF Support

**Q: How did you add PDF support?**

> Using the `pdf-parse` library. When a file with a `.pdf` extension is detected, instead of reading it as UTF-8 text (which would produce garbled binary data), I read it as a raw Buffer and pass it to `pdf-parse`, which extracts the text content. That text is then sent to Claude exactly like any other content.

---

**Q: What happens if someone uploads a scanned PDF (image-based)?**

> `pdf-parse` extracts embedded text only. Scanned PDFs are essentially images — they have no text layer, so `pdf-parse` returns an empty string. The app then shows "Content is empty — nothing to summarize." A proper fix would require OCR (like Tesseract), which is a potential future enhancement.

---

## 6. Express & API Design

**Q: Why did you use `multer.memoryStorage()` instead of saving files to disk?**

> On serverless/free-tier deployments like Render, the filesystem is ephemeral — files written to disk can disappear. Memory storage processes the PDF entirely in RAM, which is faster and avoids any disk I/O or cleanup concerns. The tradeoff is memory usage, which is why I set a 10MB file size limit.

---

**Q: How does the single `/api/summarize` route handle both URL and PDF inputs?**

> Multer middleware processes the request first. If `req.file` exists, it's a PDF upload. If not, the route checks `req.body.url` for a URL input. Both modes use the same downstream summarization logic — the only difference is how the content string is obtained.

---

**Q: What happens if the client disconnects mid-stream?**

> The `req.on('close')` event listener calls `stream.abort()` on the Anthropic stream. This prevents the server from continuing to call the API after the user has already closed the tab, avoiding unnecessary token usage and resource leaks.

---

## 7. CI/CD

**Q: What does your CI pipeline do?**

> On every push to `main`, GitHub Actions:
> 1. Spins up a fresh Ubuntu environment
> 2. Runs on Node.js 20 and 22 in parallel
> 3. Installs dependencies with `npm ci` (clean install from lock file)
> 4. Runs ESLint to check code quality
> 5. Runs TypeScript compiler to verify the build
>
> If any step fails, the push is marked as failing and the badge turns red.

---

**Q: Why `npm ci` instead of `npm install` in CI?**

> `npm ci` installs exactly what's in `package-lock.json` without modifying it. `npm install` can silently update packages. In CI you want deterministic, reproducible builds — `npm ci` guarantees that.

---

**Q: Why did you drop Node 18 from the CI matrix?**

> ESLint v10 dropped support for Node 18 (requires Node >= 20). Node 18 also reached end-of-life in April 2025. Rather than downgrade ESLint, it made more sense to update our requirements to Node 20+ which is the current LTS.

---

## 8. Security

**Q: How do you protect the API key?**

> The `ANTHROPIC_API_KEY` is stored as an environment variable, never hardcoded in source code or committed to Git. The `.gitignore` excludes `.env` files. On Render, it's set as a secret environment variable in the dashboard — it's never visible in logs or the codebase.

---

**Q: What security risks does this app have?**

> 1. **SSRF (Server-Side Request Forgery)** — the URL fetcher will request any URL it's given, including internal network addresses. A fix would be to validate URLs against an allowlist or block private IP ranges.
> 2. **No rate limiting** — anyone can hammer the `/api/summarize` endpoint and exhaust the Anthropic credits. Adding `express-rate-limit` middleware would mitigate this.
> 3. **File type validation** — only the file extension is checked for PDFs, not the MIME type or file magic bytes. A malicious user could rename a non-PDF file to `.pdf`.

---

## 9. Performance & Scalability

**Q: What happens with very large documents?**

> Content is automatically truncated to 100,000 characters before being sent to Claude. A note is added to the prompt informing the model that the content was truncated. This prevents hitting Claude's context window limits and keeps costs predictable.

---

**Q: How would you scale this for 10,000 concurrent users?**

> The current free-tier single instance would not handle that. I would:
> 1. Move to a paid Render instance or AWS
> 2. Add a queue (like Bull/BullMQ with Redis) to process summarization jobs asynchronously
> 3. Add rate limiting per IP
> 4. Cache summaries for identical URLs using Redis
> 5. Add a CDN for the static frontend

---

## 10. Deployment

**Q: Why Render over Vercel or Netlify?**

> Vercel and Netlify are optimized for serverless functions with short execution limits (typically 10–30 seconds). Streaming SSE responses can take longer than that for large documents. Render runs a persistent Node.js server with no execution time limit, making it a better fit for long-running streaming responses.

---

**Q: What does the Procfile do?**

> The Procfile tells Render (and Heroku-compatible platforms) which command to run to start the app: `web: node dist/server.js`. Without it, the platform wouldn't know whether to start the CLI or the web server.

---

## 11. Frontend

**Q: Why no React/Vue/Angular for the frontend?**

> For a single-page tool with one main interaction, a framework would add unnecessary complexity and bundle size. Vanilla HTML/CSS/JS loads instantly, has zero dependencies, and is simpler to maintain. The entire frontend is one self-contained HTML file.

---

**Q: How does the real-time streaming work in the browser?**

> 1. User clicks Summarize → `fetch()` POST request sent
> 2. Response body is read as a `ReadableStream`
> 3. A `TextDecoder` converts binary chunks to strings
> 4. The SSE protocol is parsed manually (looking for `event:` and `data:` lines)
> 5. On each `chunk` event, text is appended directly to the output `<div>`
> 6. On `done`, the copy button appears and the pulsing dot stops

---

## 12. Monitoring & Analytics

**Q: How do you know if someone is using the app?**

> Two layers:
> 1. **Google Analytics (GA4)** — tracks page views, session duration, country, device type, and a custom `summarize_click` event every time the Summarize button is clicked.
> 2. **Render logs** — the server logs every request, visible in the Render dashboard under Logs.

---

## 13. Future Improvements

**Q: What would you add next?**

> - **Rate limiting** — prevent abuse
> - **OCR support** — handle scanned PDFs using Tesseract
> - **Summary history** — store past summaries in a database (Postgres/SQLite)
> - **Auth** — let users log in and track their own usage
> - **More output formats** — TLDR, executive summary, key entities
> - **Browser extension** — summarize any page with one click
> - **API key input** — let users bring their own Anthropic key so they cover costs

---

*Last updated: April 2026*
