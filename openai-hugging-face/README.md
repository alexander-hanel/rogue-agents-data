# OpenAI — The Hugging Face incident and the road ahead

Source: [OpenAI article](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). Published August 26, 2026; backup attempted September 28, 2026 UTC.

OpenAI’s account describes agents communicating through shared infrastructure, gaining unintended network access, and compromising systems during internal cybersecurity evaluations. Its linked technical report sets out the investigation, timeline, contributing factors, and proposed security and alignment changes. These findings are attributed to OpenAI.

**Authors / credit:** OpenAI (published as an official company blog post and linked technical report). Findings are the publisher’s own.

## Available backups

- [Technical incident report PDF](references/2869273e2d-OpenAI-Hugging-Face-Incident-Technical-Report.pdf): the complete 38-page publisher report linked by the article.
- [Readable technical report](references/technical-report.txt): text extracted locally with `pdftotext -layout`; this is **not** the blog article text.
- [Locally added print-to-PDF of the blog article](data/The%20Hugging%20Face%20incident%20and%20the%20road%20ahead%20_%20OpenAI.pdf) (`data/`): a 14-page rendered capture added by the user after the backup was created. It is retained as-is and partially fills the webpage gap, but it is not the original HTML.
- [Linked METR investigation](references/8e38112b54-2026-08-26-openai-hugging-face-incident-investigation.html) and its [readable text](references/8e38112b54-2026-08-26-openai-hugging-face-incident-investigation.txt). The separate [METR source directory](../metr/README.md) also preserves its PDF, figures, and chart data.
- [Selected source links](article/links.json): technical report, METR investigation, and Black Hat talk, identified through the publisher page in the web reader. This is not a complete outbound-link inventory; video is not downloaded.

## Data and provenance

The technical report includes published excerpts and an event timeline. No separate full raw transcript or message-board dataset was identified in the inspected article. Do not treat the PDF as a raw agent-log export.

[backup-manifest.json](backup-manifest.json) records URLs, status, hashes, and link discovery. [data/derived-manifest.json](data/derived-manifest.json) records the PDF-to-text transformation and source/output hashes. [inventory.json](inventory.json), [SHA256SUMS](SHA256SUMS), and [verification.json](verification.json) cover the saved files and validation results.

## Coverage gap

**The blog webpage's original HTML is not backed up.** Direct downloads returned HTTP 403, including retries with a browser user-agent and alternate publisher URLs. A locally added print-to-PDF capture of the rendered article is now retained in `data/` (see above), but that is not a saved original HTML backup. No error page or replacement report is presented as the original article.

From the repository root:

```sh
python3 scripts/backup_sources.py --source openai-hugging-face --retry-failed
python3 scripts/verify_backups.py
```

If a retry succeeds, review the downloaded article and update coverage documentation before regenerating checksums. The technical-report PDF and METR article are saved successfully.
