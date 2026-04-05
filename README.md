# summarize-cli

> Summarize any URL, text file, or PDF in seconds — powered by Claude AI.

[![CI](https://github.com/pritmon/summarize-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/pritmon/summarize-cli/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/built%20with-TypeScript-blue)](https://www.typescriptlang.org/)

**[Try live demo →](https://summarize-cli.onrender.com)**

---

## What it does

`summarize` is a zero-config terminal tool that takes any URL or local file and returns 3–5 clear bullet points using [Claude](https://anthropic.com). Works with web pages, Markdown, plain text, and PDFs.

```
$ summarize ./report.pdf

• Patient showed post-lunch blood glucose of 279 mg/dL, above the normal range of <140 mg/dL.
• A plasma glucose >200 mg/dL on two or more occasions confirms a diabetes mellitus diagnosis.
• Factors such as medication timing and carbohydrate intake can affect post-prandial levels.
• Report prepared by Dr. G. Deepika, Director & HOD of Biochemistry, AIG Hospitals.
```

---

## Features

- **URLs** — summarize any web page over HTTP/HTTPS
- **PDFs** — extract and summarize PDF documents
- **Text files** — `.txt`, `.md`, and any plain-text format
- **JSON output** — pipe-friendly structured output with `--json`
- **Streaming** — results stream to terminal in real time
- **Auto-truncation** — content over 100,000 characters is trimmed automatically

---

## Requirements

- Node.js ≥ 18
- An [Anthropic API key](https://console.anthropic.com/)

---

## Installation

```bash
# Clone and install
git clone https://github.com/pritmon/summarize-cli.git
cd summarize-cli
npm install
npm run build
sudo npm install -g .
```

---

## Configuration

Export your Anthropic API key before running:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

To make it permanent, add the line above to your `~/.zshrc` or `~/.bashrc`.

---

## Usage

```
summarize <url-or-filepath> [--json] [--help]
```

### Arguments

| Argument           | Description                                          |
|--------------------|------------------------------------------------------|
| `url-or-filepath`  | An `http`/`https` URL **or** a path to a local file  |

### Options

| Flag       | Description                                  |
|------------|----------------------------------------------|
| `--json`   | Output structured JSON instead of bullets    |
| `--help`   | Show help and exit                           |

### Supported file types

| Type          | Extensions                        |
|---------------|-----------------------------------|
| PDF           | `.pdf`                            |
| Plain text    | `.txt`, `.md`, `.csv`, and others |
| Web pages     | Any `http://` or `https://` URL   |

---

## Examples

**Summarize a web page:**
```bash
summarize https://en.wikipedia.org/wiki/Machine_learning
```

**Summarize a PDF:**
```bash
summarize ./report.pdf
summarize ~/Downloads/research-paper.pdf
```

**Summarize a local file:**
```bash
summarize ./notes.md
summarize ~/Documents/report.txt
```

**JSON output (pipe-friendly):**
```bash
summarize ./report.pdf --json
summarize https://example.com/article --json | jq '.bullets[]'
```

---

## Output formats

### Default (bullet points)

```
• Machine learning is a subset of AI that enables systems to learn from data.
• Supervised, unsupervised, and reinforcement learning are the three main paradigms.
• Neural networks and deep learning have driven recent breakthroughs.
• Common applications include image recognition, NLP, and recommendation systems.
• Challenges include data quality, interpretability, and computational cost.
```

### `--json`

```json
{
  "bullets": [
    "Machine learning is a subset of AI that enables systems to learn from data.",
    "Supervised, unsupervised, and reinforcement learning are the three main paradigms.",
    "Neural networks and deep learning have driven recent breakthroughs.",
    "Common applications include image recognition, NLP, and recommendation systems.",
    "Challenges include data quality, interpretability, and computational cost."
  ],
  "source": "https://en.wikipedia.org/wiki/Machine_learning"
}
```

---

## Error handling

| Situation               | Behaviour                                      |
|-------------------------|------------------------------------------------|
| Missing API key         | Prints a clear message and exits with `1`      |
| Invalid / expired key   | Reports authentication error and exits         |
| URL unreachable         | Reports HTTP error or timeout and exits        |
| File not found          | Reports the missing path and exits             |
| Rate limited            | Suggests waiting and exits with `1`            |
| Empty content           | Warns and exits without calling the API        |

---

## Project structure

```
summarize-cli/
├── src/
│   ├── index.ts        # Entry point & CLI wiring
│   ├── cli.ts          # Argument parsing & help text
│   ├── fetcher.ts      # HTTP/HTTPS URL fetching
│   ├── reader.ts       # File reading (text + PDF)
│   └── summarize.ts    # Anthropic API & streaming
├── .github/
│   └── workflows/
│       └── ci.yml      # GitHub Actions CI (Node 18/20/22)
├── dist/               # Compiled output (generated)
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── package.json
└── LICENSE
```

---

## Model

Uses **claude-opus-4-20250514** (Claude Opus 4). Content longer than 100,000 characters is automatically truncated with a note in the prompt.

---

## Local development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run directly without global install
node dist/index.js ./myfile.txt

# Lint
npm run lint

# Format
npm run format
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/pritmon/summarize-cli).

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes
4. Push and open a Pull Request

---

## License

[MIT](LICENSE) © Pritam Mondal
