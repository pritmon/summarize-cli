# summarize-cli

A terminal CLI that summarizes any URL or local file in 3–5 bullet points using the Anthropic Claude API.

## Requirements

- Node.js ≥ 18
- An [Anthropic API key](https://console.anthropic.com/)

## Installation

```bash
# Install dependencies and build
npm install
npm run build

# Install globally so the `summarize` command is available everywhere
npm install -g .
```

## Configuration

Export your Anthropic API key before running:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

```
summarize <url-or-filepath> [--json]
```

### Arguments

| Argument         | Description                                      |
|------------------|--------------------------------------------------|
| `url-or-filepath` | An `http`/`https` URL **or** a local file path |

### Options

| Flag     | Description                              |
|----------|------------------------------------------|
| `--json` | Output structured JSON instead of bullets |
| `--help` | Show help                                |

## Examples

**Summarize a web page:**
```bash
summarize https://en.wikipedia.org/wiki/Machine_learning
```

**Summarize a local file:**
```bash
summarize ./report.txt
summarize ~/Documents/notes.md
```

**JSON output (pipe-friendly):**
```bash
summarize https://example.com/article --json
summarize ./data.txt --json | jq '.bullets[]'
```

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

## Error handling

| Situation              | Behaviour                                  |
|------------------------|--------------------------------------------|
| Missing API key        | Prints a clear message and exits with `1`  |
| Invalid/expired API key| Reports authentication error and exits     |
| URL unreachable        | Reports HTTP error or timeout and exits    |
| File not found         | Reports the missing path and exits         |
| Rate limited           | Suggests waiting and exits with `1`        |
| Empty content          | Warns and exits without calling the API    |

## Model

Uses **claude-opus-4-20250514** (Claude Opus 4). Content longer than 100,000 characters is automatically truncated with a note in the prompt.

## Local development

```bash
# Run directly with ts-node (install it separately if needed)
npx ts-node src/index.ts https://example.com

# Or build and run
npm run build
node dist/index.js ./myfile.txt --json
```
