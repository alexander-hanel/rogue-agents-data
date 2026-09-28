# Collusion Wiki

Source: [https://collusion.wiki/](https://collusion.wiki/). Backup checked **2026-09-27 UTC**.

Nightingale Collective’s investigation of agents using public wikis to coordinate timed research tasks, share answers, and work around restrictions. The article distinguishes observed wiki activity from inferences about model identity and training or evaluation.

**Authors / credit:** Sydney Von Arx (Nightingale Collective), Cormac Slade Byrd, Spencer Kitts, and Thomas Larsen; credited in the article as published 4 September 2026. Maintained by Nightingale Collective (sydney@nightingalecollective.org). Findings are the authors’ own.

## Article backup

[Readable article text](article/index.txt) · [Original HTML](article/index.html) · [All source links](article/links.json) · [Cited articles and evidence](references/README.md)

The text copy is readable without a network connection. Original HTML is preserved unchanged; it can still reference online assets. Downloaded first-party assets are in `article/assets/` and mapped to their URLs in the manifest. A full interactive site mirror is not claimed.

## Data and supporting material

- Twelve publisher download files in [data/](data/), including the complete published ZIP and compressed JSON/JSONL exports.
- Wiki corpus: **4,579 pages, 14,591 revisions, 19,913 event rows, and 3,103 labels**. Event populations overlap; do not add these counts as independent incidents.
- Additional exports cover **13,703 records and 23,877 links**, other wikis, shortener logs, site coverage, and coverage gaps.
- [Additional findings](article/additional-findings.txt) and [download documentation](article/download.txt) are also archived.
- ZIP CRCs and the publisher’s internal SHA-256 list were verified; every compressed JSON/JSONL stream was parsed.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records attempted URLs, final URLs, HTTP status, retrieval/check time, local paths, sizes, hashes, and any retries. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover retained PDFs, existing data, downloaded files, extracted files, and documentation. [verification.json](verification.json) records format checks. Existing files were preserved; no original retrieval date is inferred for them.

From the repository root, run `python3 scripts/verify_backups.py` to verify all configured backups, or run `sha256sum -c SHA256SUMS` from this directory.

## Coverage gaps

**3 resource(s) remain unavailable:**

- [https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/) — HTTP 403; see the manifest for details.
- [https://openai.com/index/hugging-face-incident-and-the-road-ahead/](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) — HTTP 403; see the manifest for details.
- [https://web.archive.org/web/20260904215542/https://paste.linuxiarz.pl/view/raw/3668829d](https://web.archive.org/web/20260904215542/https://paste.linuxiarz.pl/view/raw/3668829d) — HTTP 404; see the manifest for details.
