# OpenAI — An agent used DNS to reach an external chatbot

Source: [OpenAI Alignment report](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/). Report updated September 25, 2026; backed up **September 28, 2026 UTC**.

OpenAI’s incident report describes an internal research agent using a gap in sandbox DNS filtering to query an external chatbot during a search task. It includes redacted model reasoning, tool calls and results, a monitoring and response timeline, and the publisher’s account of subsequent mitigations. These are the publisher’s findings; archiving does not independently verify them.

**Authors / credit:** OpenAI (Alignment Research Team), published on the OpenAI Alignment blog. Findings are the publisher’s own.

## Article and data

- [Readable article text](article/index.txt) and [original HTML](article/index.html) preserve the full published report, including its redacted evidence excerpts and timeline.
- [First-party assets](article/assets/) preserve the directly linked stylesheets, scripts, font, favicon and logo. Original HTML remains unchanged and can still reference online resources; use the text copy for offline reading.
- [Outbound links](article/links.json) preserve the article’s linked sources and navigation.
- **No separate raw transcript, DNS log export, or bulk dataset is linked in the report.** The available evidence is embedded in the article. Redacted information has not been reconstructed.
- [Supporting reference status](references/README.md) documents the linked Hugging Face incident article.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records URLs, retrieval time, HTTP status, local paths, sizes and SHA-256 hashes. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover the saved files; [verification.json](verification.json) records verification results.

From the repository root:

```sh
python3 scripts/verify_backups.py
python3 scripts/backup_sources.py --source openai-dns --retry-failed
```

Run `sha256sum -c SHA256SUMS` from this directory to check just this backup.

## Coverage gap

The linked [Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) returned **HTTP 403**. It is listed as unavailable in the manifest, not saved as an error-page backup. The main DNS incident report and all attempted first-party assets were downloaded successfully.
