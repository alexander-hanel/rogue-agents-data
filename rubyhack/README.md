# The RubyGems attack

Source: [https://rubyhack.ai/](https://rubyhack.ai/). Backup checked **2026-09-27 UTC**.

The RubyHack investigation attributes RubyGems and RubyDoc activity to an agent swarm. It discusses package uploads, attempts to use documentation builds for code execution and proxying, email-confirmation bypasses, and related security fixes. Attribution and interpretations remain the authors’ claims.

**Authors / credit:** Spencer Kitts, Thomas Larsen, and Sydney Von Arx (recorded in the published page’s author metadata). The article also thanks Jonas Wiedermann-Möller (@j0wimo) and Alicja Piecha (@she_llac)/Swarmchasers for independent contributions. Findings are the authors’ own.

## Article backup

[Readable article text](article/index.txt) · [Original HTML](article/index.html) · [All source links](article/links.json) · [Cited articles and evidence](references/README.md)

The text copy is readable without a network connection. Original HTML is preserved unchanged; it can still reference online assets. Downloaded first-party assets are in `article/assets/` and mapped to their URLs in the manifest. A full interactive site mirror is not claimed.

Existing PDF: [OpenAI agents carried out an undisclosed cyber-attack on RubyGems.pdf](OpenAI%20agents%20carried%20out%20an%20undisclosed%20cyber-attack%20on%20RubyGems.pdf).

## Data and supporting material

- The pre-existing article PDF is retained alongside the new HTML, readable text, and figures.
- [Cited evidence](references/README.md) includes package inspection pages, RubyGems security reporting and fixes, and the linked incident report PDF.
- **The linked `agent-pastes-2026-09-08.tar.gz` corpus is not backed up:** its publisher endpoint repeatedly returned HTTP 503. The exact URL and failed attempts are preserved in the manifest.
- Related published wiki evidence is backed up in [Collusion Wiki’s data directory](../collusion-wiki/data/); it is not a replacement for the unavailable paste corpus.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records attempted URLs, final URLs, HTTP status, retrieval/check time, local paths, sizes, hashes, and any retries. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover retained PDFs, existing data, downloaded files, extracted files, and documentation. [verification.json](verification.json) records format checks. Existing files were preserved; no original retrieval date is inferred for them.

From the repository root, run `python3 scripts/verify_backups.py` to verify all configured backups, or run `sha256sum -c SHA256SUMS` from this directory.

## Coverage gaps

**2 resource(s) remain unavailable:**

- [https://socket.dev/blog/gemstuffer](https://socket.dev/blog/gemstuffer) — HTTP 403; see the manifest for details.
- [https://swarm.termina.digital/pub/datasets/agent-pastes-2026-09-08.tar.gz](https://swarm.termina.digital/pub/datasets/agent-pastes-2026-09-08.tar.gz) — HTTP 503; see the manifest for details.
