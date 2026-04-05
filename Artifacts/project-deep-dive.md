# 🧠 Project Deep Dive — summarize-cli

> **How to use this:** Read each question out loud, cover the answer, and try to recall it.
> The goal is to be able to explain every decision confidently and naturally.

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

> 💡 **Say this out loud until it feels natural:**

```
summarize-cli is a full-stack AI tool with two interfaces —
a terminal CLI and a browser web UI.

You give it any URL, text file, or PDF.
It fetches the content, sends it to Claude AI,
and streams back a 3–5 bullet summary in real time.

The backend is Node.js/TypeScript with Express and SSE streaming.
It's deployed on Render with Google Analytics for usage tracking.
```

---

## 2️⃣ Architecture & Modules

**Q: Why split into multiple files instead of one big file?**

> **Single Responsibility Principle** — each module does one thing:

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

> Two separate entry points. The server uses a guard:

```typescript
if (require.main === module) {
  app.listen(PORT); // only runs when started directly
}
```

> `node dist/index.js` → CLI
> `node dist/server.js` → Web server

---

## 3️⃣ TypeScript

**Q: Why TypeScript over JavaScript?**

| JavaScript | TypeScript |
|-----------|-----------|
| Errors at runtime | Errors at compile time |
| No autocomplete | Full IDE support |
| Hard to refactor | Safe refactoring |
| Implicit `any` | Explicit types |

> 🎯 **Key point:** `strict: true` enables `strictNullChecks` — no implicit `null/undefined` slipping through.

---

## 4️⃣ Streaming — SSE vs WebSockets

**Q: What is SSE and why not WebSockets?**

```
WebSockets  →  two-way communication (chat apps, games)
SSE         →  one-way server → client (news feeds, AI streaming)
```

> Our use case is **one-directional only** — server streams tokens to browser.
> SSE is simpler, works over plain HTTP, and has native browser support.

---

**Q: Why `fetch()` + ReadableStream instead of `EventSource`?**

> `EventSource` only supports **GET** requests.
> Our endpoint is **POST** (to carry the URL or uploaded file).
> So we use `fetch()` and manually parse the SSE stream.

```javascript
// Manual SSE parsing
const reader = response.body.getReader();
// Parse "event:" and "data:" lines from chunks
```

---

**Q: What events does the server send?**

| Event | Meaning |
|-------|---------|
| `status` | "Fetching…" / "Summarizing…" |
| `chunk` | One streaming text fragment |
| `result` | Complete JSON (JSON mode only) |
| `done` | Stream finished |
| `error` | Something went wrong |

---

## 5️⃣ PDF Support

**Q: How does PDF parsing work?**

```
.pdf file → read as Buffer → pdf-parse → plain text → Claude API
.txt file → read as UTF-8 string → Claude API
```

> Without `pdf-parse`, reading a PDF as text returns garbled binary data.

---

**Q: What happens with scanned PDFs?**

> ⚠️ **Scanned PDFs are images** — no text layer exists.
> `pdf-parse` returns empty string → app shows "Content is empty."
> **Fix:** OCR with Tesseract (future improvement).

---

## 6️⃣ Express API Design

**Q: Why `multer.memoryStorage()` instead of saving to disk?**

> On Render's free tier, **the filesystem is ephemeral** — files can vanish.
> Memory storage processes PDFs in RAM — faster, no cleanup needed.
> Tradeoff: 10MB file size limit to prevent memory overflow.

---

**Q: What happens if the user closes the tab mid-stream?**

```typescript
req.on('close', () => stream.abort());
```

> Stops the Claude API call immediately → no wasted API credits.

---

## 7️⃣ CI/CD Pipeline

**Q: What does CI do on every push?**

```
Push to main
    ↓
GitHub Actions spins up Ubuntu
    ↓
npm ci  →  deterministic install from lock file
    ↓
npm run lint  →  ESLint checks code quality
    ↓
npm run build  →  TypeScript compiles
    ↓
✅ Green badge  or  ❌ Red badge
```

---

**Q: Why `npm ci` not `npm install`?**

> `npm install` can silently update packages.
> `npm ci` installs **exactly** what's in `package-lock.json`.
> CI needs **reproducible, deterministic** builds.

---

**Q: Why was Node 18 dropped?**

> ESLint v10 requires Node ≥ 20. Node 18 is also **end-of-life** (April 2025).
> Upgraded engines requirement to `>=20.0.0`.

---

## 8️⃣ Security

**Q: Where is the API key stored?**

```
❌ Never in code
❌ Never in git
✅ Environment variable (local)
✅ Render secret env var (production)
✅ .gitignore excludes .env
```

---

**Q: What are the known security risks?**

| Risk | Description | Fix |
|------|-------------|-----|
| **SSRF** | Server fetches any URL including internal IPs | Validate/block private IP ranges |
| **No rate limiting** | Anyone can drain API credits | Add `express-rate-limit` |
| **File validation** | Only checks extension, not actual file type | Validate MIME type + magic bytes |

---

## 9️⃣ Performance & Scale

**Q: What happens with very large documents?**

> Content is **truncated to 100,000 characters** before sending to Claude.
> A note is added to the prompt: *"content was truncated."*
> Prevents hitting context limits and keeps costs predictable.

---

**Q: How would you scale this to 10,000 users?**

```
Current: Single free-tier server
    ↓
Step 1: Paid Render instance (more RAM/CPU)
Step 2: Rate limiting per IP
Step 3: Redis cache (same URL = cached summary)
Step 4: Job queue (Bull/BullMQ) for async processing
Step 5: Horizontal scaling with load balancer
```

---

## 🔟 Deployment

**Q: Why Render over Vercel/Netlify?**

> Vercel/Netlify → **serverless functions** with 10–30 sec execution limits.
> SSE streaming can take longer for large documents.
> Render → **persistent Node.js server**, no execution time limit.

---

**Q: What does the `Procfile` do?**

```
web: node dist/server.js
```

> Tells Render (and Heroku-compatible platforms) which command starts the app.
> Without it, the platform doesn't know to run the server vs the CLI.

---

## 1️⃣1️⃣ Frontend

**Q: Why no React/Vue/Angular?**

> One page. One button. One interaction.
> A framework would add **100KB+ of JS** for no benefit.
> Vanilla HTML/CSS/JS loads instantly, zero dependencies.

---

**Q: How does real-time streaming work in the browser?**

```
User clicks Summarize
    ↓
fetch() POST → /api/summarize
    ↓
Read response.body as ReadableStream
    ↓
Parse SSE chunks manually
    ↓
Append each "chunk" event text to <div>
    ↓
"done" event → show Copy button
```

---

## 1️⃣2️⃣ What Would You Add Next?

> These show you've thought beyond the MVP:

```
🔒 Rate limiting          → prevent abuse
📄 OCR for scanned PDFs   → Tesseract integration
💾 Summary history        → Postgres/SQLite storage
🔑 Auth                   → user accounts
🌐 Browser extension      → summarize any page
🔑 BYOK                   → bring your own API key
📊 More formats           → TLDR, key entities, exec summary
```

---

## 🃏 Flash Cards — Quick Fire

| Question | Answer |
|----------|--------|
| What protocol streams AI output? | Server-Sent Events (SSE) |
| Why can't you use EventSource? | It only supports GET, we need POST |
| Why memoryStorage for PDF uploads? | Render filesystem is ephemeral |
| What truncates large documents? | 100,000 character limit |
| Why npm ci in CI? | Deterministic install from lock file |
| Where is the API key stored? | Environment variable, never in code |
| Why not Vercel? | Serverless timeout too short for streaming |
| What does Procfile do? | Tells Render which command to run |
| What does strict: true do in TS? | Enables strictNullChecks + noImplicitAny |
| How to handle client disconnect? | req.on('close') → stream.abort() |

---

*Built April 2026 · summarize-cli.onrender.com*
