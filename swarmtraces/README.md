# SwarmTraces

Source: [https://swarmtraces.org/](https://swarmtraces.org/). Backup checked **2026-09-27 UTC**.

SwarmTraces reconstructs the reported July Hugging Face incident from publicly observable agent activity. Its report covers proxy chains, credential handling, external model use, communication infrastructure, and traces of attempted exploitation; the public traces are not complete internal agent trajectories.

**Authors / credit:** Alex Forman, Mishka Kharlov, and Will Tom (Parse); Jeffrey Ladish (Palisade Research); Spencer Kitts (contracting for Nightingale); Cormac Slade Byrd (Trajectory Institute); Colleen McKenzie (Lightcone Infrastructure); and Alicja Piecha. Published 25 September 2026. Findings are the authors’ own.

## Article backup

[Readable article text](article/index.txt) · [Original HTML](article/index.html) · [All source links](article/links.json) · [Cited articles and evidence](references/README.md)

The text copy is readable without a network connection. Original HTML is preserved unchanged; it can still reference online assets. Downloaded first-party assets are in `article/assets/` and mapped to their URLs in the manifest. A full interactive site mirror is not claimed.

## Data and supporting material

- [redacted.jsonl.gz](data/redacted.jsonl.gz): **189,579 valid JSON records** from the publisher’s public, redacted evidence release.
- The existing dataset was downloaded again for comparison and matched byte for byte. Its gzip stream and every JSON record were validated.
- The report, figure, and first-party article JavaScript and CSS are archived. Embedded viewer links remain in the source HTML and outbound-link inventory; the interactive viewer itself is not mirrored.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records attempted URLs, final URLs, HTTP status, retrieval/check time, local paths, sizes, hashes, and any retries. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover retained PDFs, existing data, downloaded files, extracted files, and documentation. [verification.json](verification.json) records format checks. Existing files were preserved; no original retrieval date is inferred for them.

From the repository root, run `python3 scripts/verify_backups.py` to verify all configured backups, or run `sha256sum -c SHA256SUMS` from this directory.

## Coverage gaps

All attempted resources for this source were retrieved.
