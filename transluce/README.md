# Transluce — Early rogue AI agent activity

Source: [https://transluce.org/agent-activity](https://transluce.org/agent-activity). Backup checked **2026-09-27 UTC**.

Transluce’s analysis uses public URLQuery reports to investigate suspected agent browsing, proxy use, coordination, and attempted exploitation. Its confidence labels describe evidence of agent-like activity, not verified actor identities or proof that an attempted exploit succeeded.

**Authors / credit:** Jack Cable, Daniel Chiu, Francisco Pernice, Selena Zhang, James Anthony, Tetiana Bas, Gary Shen, Conrad Stosz, and Jacob Steinhardt (affiliations per the published byline: Transluce, Corridor, MIT, AIUC; *Primary contributors listed alphabetically). Published by Transluce, 23 September 2026. Findings are the authors’ own.

## Article backup

[Readable article text](article/index.txt) · [Original HTML](article/index.html) · [All source links](article/links.json) · [Cited articles and evidence](references/README.md)

The text copy is readable without a network connection. Original HTML is preserved unchanged; it can still reference online assets. Downloaded first-party assets are in `article/assets/` and mapped to their URLs in the manifest. A full interactive site mirror is not claimed.

Existing PDF: [Early rogue AI agent activity and attempts to hack found on urlquery.net _ Transluce AI.pdf](Early%20rogue%20AI%20agent%20activity%20and%20attempts%20to%20hack%20found%20on%20urlquery.net%20_%20Transluce%20AI.pdf).

## Data and supporting material

- [Publisher ZIP](data/urlquery-agent-activity-2026-09-23.zip) and an [extracted catalog](data/catalog/README.md): **38,160 distinct reports**, including 37,649 included reports, 79 background controls, and 432 rows requiring review.
- The catalog contains report links, classifications, provenance, methods, and aggregate counts. **It does not contain the full raw JSON, response bodies, or screenshots for all 38,160 reports.** Upstream private-archive counts in its metadata do not describe this backup.
- **299 pre-existing raw JSON examples** are retained in [data/example-reports/](data/example-reports/). Their original download time and method were not recorded; this backup validates and hashes them without claiming fresh retrieval.
- Raw JSON for all **63 reports directly cited in the article** is saved separately in [data/cited-reports/](data/cited-reports/), with retrieval provenance in the manifest. This set may overlap the existing examples.
- The linked DeepSearchQA CSV is saved as [DSQA-full.csv](data/DSQA-full.csv); it is a comparison dataset, not additional URLQuery reports.
- The existing article PDF is retained. ZIP CRCs and all **15 publisher file hashes** were verified.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records attempted URLs, final URLs, HTTP status, retrieval/check time, local paths, sizes, hashes, and any retries. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover retained PDFs, existing data, downloaded files, extracted files, and documentation. [verification.json](verification.json) records format checks. Existing files were preserved; no original retrieval date is inferred for them.

From the repository root, run `python3 scripts/verify_backups.py` to verify all configured backups, or run `sha256sum -c SHA256SUMS` from this directory.

## Coverage gaps

All attempted resources for this source were retrieved. The complete 38,160-report raw corpus is not part of the public catalog.
