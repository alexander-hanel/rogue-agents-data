# Rogue agent articles and data

> **This repository is a backup only.** It exists solely to preserve offline copies of
> publicly available reporting and data about the rogue-agent incidents; it is **not** an
> original work and does **not** claim authorship. **All credit for the reporting, analysis,
> and datasets belongs to the original authors and publishers**, who are listed by name in
> the [Authors & attribution](#authors--attribution) section below and in each source README.
> Original sources are linked in the table below. Findings remain those of their authors;
> archiving does not independently verify any claim.

Local research backups of the eight linked sources, checked **2026-09-27–28 UTC**. Each source directory contains an article backup, a brief description, available data and cited evidence, provenance, checksums, and documented gaps. Source claims and attribution are not independently verified by archiving them.

| Source | Local backup | Contents |
| --- | --- | --- |
| [Collusion Wiki](https://collusion.wiki/) | [collusion-wiki](collusion-wiki/README.md) | Investigation, additional findings, wiki revisions/events, links, and coverage exports. |
| [The RubyGems attack](https://rubyhack.ai/) | [rubyhack](rubyhack/README.md) | Article, existing PDF, figures, package evidence and security reports; linked paste corpus unavailable (HTTP 503). |
| [Kenneth DeGraff — Swarm](https://www.kennethdegraff.com/swarm) | [kennethdegraff](kennethdegraff/README.md) | Essay, archived shortener statistics, related articles and reports. |
| [Transluce — agent activity](https://transluce.org/agent-activity) | [transluce](transluce/README.md) | Article/PDF, 38,160-report metadata catalog, existing examples, and cited raw reports. |
| [SwarmTraces](https://swarmtraces.org/) | [swarmtraces](swarmtraces/README.md) | Report, figures and 189,579 redacted evidence records. |
| [OpenAI: An agent used DNS to reach an external chatbot](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/) | [openai-dns](openai-dns/README.md) | Incident report, redacted evidence excerpts, timeline and first-party assets; no separate dataset linked. |
| [METR — Hugging Face incident investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/#core-takeaways-about-this-incident) | [metr](metr/README.md) | Investigation, publisher PDF, figures, published chart data, and supporting articles. |
| [OpenAI — Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) | [openai-hugging-face](openai-hugging-face/README.md) | Technical-report PDF and linked METR report; blog webpage unavailable (HTTP 403). |

## Authors & attribution

These backups preserve reporting by the following individuals and organizations. Each work remains the work of its authors; archiving does not transfer authorship. Full credit details are repeated in each source README.

| Source | Authors / publisher (as credited in the archived article) |
| --- | --- |
| Collusion Wiki (Nightingale Collective) | Sydney Von Arx, Cormac Slade Byrd, Spencer Kitts, Thomas Larsen — published 4 September 2026. |
| The RubyGems attack | Spencer Kitts, Thomas Larsen, Sydney Von Arx; thanks Jonas Wiedermann-Möller (@j0wimo) and Alicja Piecha (@she_llac)/Swarmchasers. |
| Kenneth DeGraff — Swarm | Kenneth Russell DeGraff. |
| Transluce — agent activity | Jack Cable, Daniel Chiu, Francisco Pernice, Selena Zhang, James Anthony, Tetiana Bas, Gary Shen, Conrad Stosz, Jacob Steinhardt (Transluce / Corridor / MIT / AIUC) — published 23 September 2026. |
| SwarmTraces | Alex Forman, Mishka Kharlov, Will Tom (Parse); Jeffrey Ladish (Palisade Research); Spencer Kitts (Nightingale); Cormac Slade Byrd (Trajectory Institute); Colleen McKenzie (Lightcone Infrastructure); Alicja Piecha — published 25 September 2026. |
| OpenAI — DNS-to-chatbot report | OpenAI (Alignment Research Team). |
| METR — Hugging Face investigation | Ryan Greenblatt, Ajeya Cotra, Hjalmar Wijk — published 26 August 2026. |
| OpenAI — Hugging Face incident and the road ahead | OpenAI. |

Each source’s original URL is linked in the table above (and restated at the top of every source and sub-document README). Retention of these materials is for research and defensive-security analysis only; see each source for its own terms and any restrictions.

## Analysis

- [results/SUMMARY.md](results/SUMMARY.md) — **consolidated single-spot summary** of all analysis below (attack vectors, ATT&CK, SOC detections, indicator catalog, limitations).
- [results/raw-analysis/](results/raw-analysis/README.md) — five raw-log attack-vector mining files (SwarmTraces, Collusion Wiki, Transluce, METR/RubyHack/DeGraff, cross-source indicator catalog).
- [results/data-analysis.md](results/data-analysis.md) — data-first analysis of the raw structured logs: schemas, payload taxonomy, coordination/cadence statistics, cross-source infrastructure correlation, and data-derived detection signatures.

## Verification

```sh
python3 scripts/verify_backups.py
```

This checks the per-directory file inventory and SHA-256 values, JSON/JSONL parsing, gzip integrity, ZIP CRCs, and publisher hashes where supplied. `SHA256SUMS` can also be checked with `sha256sum -c SHA256SUMS` inside any source directory. The manifests record unavailable downloads rather than treating error pages as backups.

## Refreshing

```sh
python3 scripts/backup_sources.py --retry-failed
# Refresh one source:
python3 scripts/backup_sources.py --source openai-dns
# Or refresh the main articles, assets, datasets, and selected direct citations:
python3 scripts/backup_sources.py
python3 scripts/backup_sources.py --cited-report-json
# Extract published METR chart JSON after refreshing that source:
python3 scripts/extract_metr_chart_data.py
```

Downloads require network access and curl. Changed downloads are saved with a content-hash suffix instead of replacing the existing bytes. After a refresh, review the manifests, update the directory descriptions and reference indexes, then intentionally regenerate checksums with `python3 scripts/verify_backups.py --record`.

## Scope

The archive covers eight primary sources (the OpenAI Hugging Face blog webpage remains unavailable), Collusion Wiki’s additional findings and download documentation, directly linked first-party assets and public dataset bundles, and selected directly cited reports, articles, and evidence pages. Discovered source links are saved in `article/links.json`; the unavailable OpenAI Hugging Face webpage has only a selected link list. Navigation, social links, arbitrary endpoints appearing in agent activity, and recursively linked sites are not fully mirrored.

Readable text copies work offline. Original HTML remains unchanged and may need online resources for styling or interactivity. Transluce’s public catalog is metadata, not a backup of every raw report. The missing RubyHack paste corpus, unavailable OpenAI Hugging Face webpage, and remaining inaccessible references are listed in the source READMEs and manifests.

These are backups in this workspace; no off-site storage or remote repository was configured or uploaded to.
