# 🧠 Project Deep Dive — summarize-cli

> [!TIP]
> **How to use this:** Read each question out loud, cover the answer, and try to recall it.
> The goal is to explain every decision confidently and naturally.

---

## 📋 Quick Reference Card

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | TypeScript (strict) | Compile-time safety |
| Runtime | Node.js ≥ 20 | Modern, fast, async |
| Web server | Express 5 | Simple, battle-tested |
| Streaming | Server-Sent Events | One-way, no overhead |
| PDF | pdf-parse | Text extraction from binary |
| AI | Anthropic Claude Opus 4 | Best summarization quality |
| Deploy | Render (free tier) | Persistent server, no cold limit |
| CI | GitHub Actions | Auto lint + build on every push |
| Analytics | Google Analytics 4 | Real user tracking |

---

## 1️⃣ The 60-Second Pitch

**Q: Walk me through this project.**

> [!IMPORTANT]
> Practice saying this out loud until it feels natural:

```
summarize-cli is a full-stack AI tool with two interfaces —
a terminal CLI and a browser web UI.

You give it any URL, text file, or PDF.
It fetches the content, sends it to Claude AI,
and streams back a 3–5 bullet summary in real time.

The backend is Node.js/TypeScript with Express and SSE streaming.
Deployed on Render with Google Analytics for usage tracking.
```

---

## 2️⃣ Architecture & Modules

**Q: Why split into multiple files instead of one big file?**

> [!NOTE]
> **Single Responsibility Principle** — each module does exactly one thing.

```
src/
├── index.ts      → CLI entry point
├── cli.ts        → argument parsing & help text
├── fetcher.ts    → HTTP/HTTPS URL fetching
├── reader.ts     → file reading + PDF parsing
├── summarize.ts  → Claude API calls + streaming
└── server.ts     → Express web server + SSE route
```

> ✅ Each piece is independently testable, maintainable, and replaceable.

---

**Q: How do the CLI and web server coexist without conflicting?**

Two separate entry points. The server uses a guard:

```typescript
if (require.main === module) {
  app.listen(PORT); // only runs when started directly
}
```

```diff
+ node dist/index.js   →  CLI (terminal)
+ node dist/server.js  →  Web server (browser)
```

---

## 3️⃣ TypeScript

**Q: Why TypeScript over JavaScript?**

```diff
- JavaScript: errors appear at RUNTIME (user sees them)
+ TypeScript: errors caught at COMPILE TIME (developer sees them)
```

| JavaScript | TypeScript |
|-----------|-----------|
| Errors at runtime | Errors at compile time |
| No autocomplete | Full IDE support |
| Hard to refactor safely | Safe, tracked refactoring |
| Implicit `any` everywhere | Explicit, enforced types |

> [!NOTE]
> `strict: true` in tsconfig enables `strictNullChecks` — null/undefined can never silently slip through.

---

## 4️⃣ Streaming — SSE vs WebSockets

**Q: What is SSE and why not WebSockets?**

```diff
- WebSockets  →  two-way communication (chat apps, games)
+ SSE         →  one-way server → client (AI streaming ✅)
```

> [!TIP]
> Our use case is **one-directional only** — server streams tokens to the browser.
> SSE is simpler, works over plain HTTP, and has native browser reconnect support.

---

**Q: Why `fetch()` + ReadableStream instead of `EventSource`?**

> [!WARNING]
> `EventSource` only supports **GET** requests.
> Our endpoint is **POST** (carries the URL or uploaded PDF).
> We use `fetch()` and manually parse the SSE stream instead.

```javascript
// Manual SSE parsing in the browser
const reader = response.body.getReader();
// Reads "event:" and "data:" lines from streamed chunks
```

---

**Q: What events does the server send?**

| Event | Meaning | Color in UI |
|-------|---------|-------------|
| `status` | "Fetching…" / "Summarizing…" | Grey |
| `chunk` | One streaming text fragment | White |
| `result` | Complete JSON (JSON mode) | White |
| `done` | Stream finished | Green dot stops pulsing |
| `error` | Something went wrong | Red text |

---

## 5️⃣ PDF Support

**Q: How does PDF parsing work?**

```diff
- .pdf → read as UTF-8 → garbled binary garbage ❌
+ .pdf → read as Buffer → pdf-parse → plain text → Claude ✅
+ .txt → read as UTF-8 string → Claude ✅
```

---

**Q: What happens with scanned PDFs?**

> [!CAUTION]
> **Scanned PDFs are images** — they have no text layer.
> `pdf-parse` returns an empty string → app shows "Content is empty."
> **Future fix:** OCR with Tesseract.js.

---

## 6️⃣ Express API Design

**Q: Why `multer.memoryStorage()` instead of saving files to disk?**

> [!WARNING]
> On Render's free tier, **the filesystem is ephemeral** — files written to disk can disappear between requests.

```diff
- Disk storage  →  files can vanish on Render free tier ❌
+ Memory storage →  processed in RAM, no cleanup needed ✅
```

> Tradeoff: 10MB file size limit to prevent memory overflow.

---

**Q: What happens if the user closes the tab mid-stream?**

```typescript
req.on('close', () => stream.abort()); // stops Claude API call instantly
```

> [!TIP]
> This prevents wasted API credits when users close the tab early.

---

## 7️⃣ CI/CD Pipeline

**Q: What does CI do on every push?**

```
Push to main
    ↓
GitHub Actions → fresh Ubuntu environment
    ↓
npm ci          → deterministic install from lock file
    ↓
npm run lint    → ESLint checks code quality
    ↓
npm run build   → TypeScript compiles without errors
    ↓
✅ Green badge   OR   ❌ Red badge
```

---

**Q: Why `npm ci` not `npm install` in CI?**

```diff
- npm install  →  can silently update packages (non-deterministic)
+ npm ci       →  installs EXACTLY what's in package-lock.json ✅
```

> [!NOTE]
> CI needs **reproducible builds** — same result every single time.

---

**Q: Why was Node 18 dropped?**

> [!CAUTION]
> ESLint v10 requires Node ≥ 20. Node 18 also reached **end-of-life in April 2025**.
> Updated engines: `"node": ">=20.0.0"`.

---

## 8️⃣ Security

**Q: Where is the API key stored?**

```diff
- Hardcoded in source code  ❌
- Committed to Git           ❌
+ Environment variable (local .env, gitignored)  ✅
+ Render secret env var (production)             ✅
```

---

**Q: What are the known security risks?**

> [!WARNING]
> These are honest weaknesses — knowing them shows maturity:

| Risk | Description | Fix |
|------|-------------|-----|
| **SSRF** | Server fetches any URL including internal IPs | Validate/block private IP ranges |
| **No rate limiting** | Anyone can drain API credits | Add `express-rate-limit` |
| **Weak file validation** | Only checks extension, not actual file type | Validate MIME type + magic bytes |

---

## 9️⃣ Performance & Scale

**Q: What happens with very large documents?**

> [!NOTE]
> Content is **truncated to 100,000 characters** before sending to Claude.
> A note is added to the prompt: *"content was truncated."*
> Prevents context limit errors and keeps costs predictable.

---

**Q: How would you scale this to 10,000 users?**

```
Current: Single free-tier instance
    ↓
Step 1: Paid Render instance (more RAM/CPU)
Step 2: Rate limiting per IP
Step 3: Redis cache (same URL = reuse cached summary)
Step 4: Job queue (Bull/BullMQ) for async processing
Step 5: Horizontal scaling + load balancer
```

---

## 🔟 Deployment

**Q: Why Render over Vercel or Netlify?**

```diff
- Vercel/Netlify  →  serverless, 10–30 sec execution limit ❌
+ Render          →  persistent Node.js server, no time limit ✅
```

> [!IMPORTANT]
> SSE streaming can take longer than 30 seconds for large documents.
> Serverless platforms would kill the connection mid-stream.

---

**Q: What does the `Procfile` do?**

```
web: node dist/server.js
```

> [!NOTE]
> Tells Render which command starts the app.
> Without it, the platform doesn't know to run the server instead of the CLI.

---

## 1️⃣1️⃣ Frontend

**Q: Why no React/Vue/Angular?**

```diff
- React bundle  →  ~100KB+ for one button on one page ❌
+ Vanilla HTML  →  instant load, zero dependencies      ✅
```

---

**Q: How does real-time streaming work in the browser?**

```
User clicks Summarize
    ↓
fetch() POST → /api/summarize
    ↓
Read response.body as ReadableStream
    ↓
Parse SSE chunks manually (event: / data: lines)
    ↓
Append each "chunk" text to output <div>
    ↓
"done" event → show Copy button, stop pulsing dot
```

---

## 1️⃣2️⃣ What Would You Add Next?

> [!TIP]
> Mentioning future improvements shows you think beyond the MVP:

```diff
+ Rate limiting          → prevent API abuse
+ OCR for scanned PDFs   → Tesseract integration
+ Summary history        → Postgres/SQLite storage
+ Auth                   → user accounts + personal history
+ Browser extension      → summarize any page in one click
+ BYOK                   → users bring their own API key
+ More output formats    → TLDR, key entities, exec summary
```

---

## 1️⃣3️⃣ Temperature Control

**Q: What is temperature in an AI model?**

> Temperature controls **randomness and creativity** of the output.

```diff
- Temperature 0.0  →  fully deterministic, same output every time
+ Temperature 0.3  →  focused, factual, minimal variation ✅ best for summarization
  Temperature 0.6  →  balanced (default in this app)
  Temperature 1.0  →  creative, varied, unpredictable
```

---

**Q: Why did you expose temperature as a UI control instead of hardcoding it?**

> [!IMPORTANT]
> Three reasons:
> 1. **Different use cases need different values** — a doctor summarizing a medical PDF wants precision (0.3), a writer summarizing for inspiration wants creativity (1.0)
> 2. **Shows understanding of AI internals** — not just "call the API", but understand what the parameters do
> 3. **Better user experience** — power users can tune the output without touching code

---

**Q: How does the temperature flow from UI to API?**

```
User moves slider / clicks preset
    ↓
JS reads value → appended to FormData
    ↓
POST /api/summarize (multipart form)
    ↓
Server parses: parseFloat(req.body.temperature)
    ↓
Clamped to 0.0–1.0 range (security)
    ↓
Passed directly to Claude API: { temperature: 0.6 }
```

---

**Q: Why did you clamp the temperature value on the server?**

> [!WARNING]
> Never trust frontend input. A user could manually send `temperature: 999` via API.
> Server-side clamping: `Math.min(1, Math.max(0, value))` ensures it's always valid.

---

**Q: What are the 3 presets and their values?**

| Preset | Value | Best for |
|--------|-------|---------|
| 🎯 Precise | 0.3 | Medical, legal, technical documents |
| ⚖️ Balanced | 0.6 | General articles, news, reports |
| 🎨 Creative | 1.0 | Blogs, creative writing, brainstorming |

---

**Q: Does temperature affect the JSON output mode differently?**

> [!NOTE]
> Yes — in JSON mode, a high temperature (1.0) can cause Claude to return malformed JSON since it becomes less consistent. For JSON mode, **0.3 is strongly recommended**. This is a known tradeoff worth mentioning.

---

## 1️⃣4️⃣ Rate Limiting

**Q: What is API rate limiting?**

> [!NOTE]
> Rate limiting is a restriction set by the API provider on how many requests you can make in a given time window. It protects their servers from overload and controls costs.

```
Too many requests in a short time
    ↓
API returns HTTP 429 (Too Many Requests)
    ↓
App catches it → shows "Rate limit exceeded. Wait a moment."
```

---

**Q: What are Anthropic's free tier rate limits?**

| Limit | Free Tier |
|-------|-----------|
| Requests per minute | ~5 |
| Tokens per minute | ~20,000 |
| Tokens per day | ~300,000 |

> [!WARNING]
> Testing all 3 temperature presets back-to-back (3 requests in <30 seconds) is enough to hit the per-minute limit on free tier.

---

**Q: How does your app handle rate limit errors?**

```typescript
} else if (err instanceof Anthropic.RateLimitError) {
  send("error", "Rate limit exceeded. Wait a moment and try again.");
}
```

> [!TIP]
> The app **catches it gracefully** using Anthropic SDK's typed error classes — no crash, no stack trace shown to user, just a clean message. This is proper production error handling.

---

**Q: What's the difference between a rate limit error and an auth error?**

```diff
- HTTP 401 AuthenticationError  →  wrong or expired API key
- HTTP 429 RateLimitError       →  too many requests, wait and retry
- HTTP 5xx APIError             →  Anthropic server-side issue
```

> Each is caught separately in the code and shows a specific message — not a generic "something went wrong."

---

**Q: How would you fix rate limiting in production?**

> [!IMPORTANT]
> Three strategies:

| Strategy | How | When to use |
|----------|-----|-------------|
| **Retry with backoff** | Wait 1s, 2s, 4s then retry automatically | Low traffic apps |
| **Queue requests** | Line up requests, process one at a time | Medium traffic |
| **Rate limit users** | Limit each IP to N requests/minute | Public apps |

> For this project, the right next step is adding `express-rate-limit` middleware to protect the `/api/summarize` endpoint from abuse.

---

**Q: How would you add rate limiting to this app?**

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 requests per minute per IP
  message: "Too many requests. Please wait a minute."
});

app.use("/api/summarize", limiter);
```

> Install with: `npm install express-rate-limit`

---

## 🃏 Flash Cards — Quick Fire Round

> [!TIP]
> Cover the right column and test yourself:

| Question | Answer |
|----------|--------|
| What protocol streams AI output? | Server-Sent Events (SSE) |
| Why can't you use EventSource? | Only supports GET, we need POST |
| Why memoryStorage for PDFs? | Render filesystem is ephemeral |
| What truncates large documents? | 100,000 character limit |
| Why npm ci in CI? | Deterministic install from lock file |
| Where is the API key stored? | Environment variable, never in code |
| Why not Vercel for streaming? | Serverless execution timeout too short |
| What does Procfile do? | Tells Render which command to run |
| What does strict: true do? | Enables strictNullChecks + noImplicitAny |
| How to handle client disconnect? | req.on('close') → stream.abort() |
| Why no React on the frontend? | One page, one button — overkill |
| What's the SSRF risk? | Server fetches internal IPs if not validated |
| What is temperature in AI? | Controls randomness — 0.0 precise, 1.0 creative |
| Why expose temperature in UI? | Different use cases need different values |
| Why clamp temperature on server? | Never trust frontend input — user can send any value |
| Best temperature for JSON mode? | 0.3 — high temp causes malformed JSON |
| What HTTP code is rate limit? | 429 Too Many Requests |
| How does app handle rate limit? | Catches RateLimitError → clean user message |
| What's the free tier request limit? | ~5 requests per minute |
| How to add rate limiting to app? | express-rate-limit middleware on the route |
| Difference: 401 vs 429? | 401 = wrong API key, 429 = too many requests |

---

*Built April 2026 · [summarize-cli.onrender.com](https://summarize-cli.onrender.com) · [github.com/pritmon/summarize-cli](https://github.com/pritmon/summarize-cli)*
