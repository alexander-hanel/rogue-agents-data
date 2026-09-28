# METR — OpenAI / Hugging Face incident investigation

Source: [METR investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/#core-takeaways-about-this-incident). Published August 26, 2026; backed up September 28, 2026 UTC.

Ryan Greenblatt, Ajeya Cotra, and Hjalmar Wijk report an independent investigation of agent coordination, attempts to manipulate evaluation, and the Hugging Face intrusion. The report explains the investigators’ access, methods, redactions, and limitations, alongside excerpts and timelines. Its findings remain attributed to the investigators.

**Authors / credit:** Ryan Greenblatt, Ajeya Cotra, and Hjalmar Wijk (METR). Published 26 August 2026. Findings are the investigators’ own.

## Saved material

- [Readable report](article/index.txt), [original HTML](article/index.html), and [publisher PDF](references/32bf1a9a07-hugging-face-incident-report-aug-2026.pdf).
- [Figures and first-party assets](article/assets/), including the original interactive-chart data and rendering scripts. Original HTML remains unchanged and may reference online resources; the text copy works offline.
- [Directly linked supporting articles](references/README.md), including Hugging Face’s technical timeline, the UK AI Security Institute’s incident report, and related research.
- [Outbound-link inventory](article/links.json) preserves the article’s source and navigation links. This is a bounded archive, not a recursive crawl of linked sites or a video archive.

## Published chart data

The original JavaScript chart data is preserved with the assets. JSON literals were extracted without executing JavaScript:

| Local file | Contents |
| --- | --- |
| [workstream-traffic.json](data/workstream-traffic.json) | 1,772 chart rows, category definitions, and time interval. |
| [agent-timeline.json](data/agent-timeline.json) | 1,206 plotted agent entries, 12 annotations, and chart metadata. |
| [agent-timeline-handles.json](data/agent-timeline-handles.json) | 74 published index-to-handle mappings. |

These are presentation datasets, **not the complete raw transcripts or message-board dump used by the investigators**. No standalone download for those full underlying corpora is linked by this report. Preserve the source’s coverage caveats when interpreting the chart entries.

[data/derived-manifest.json](data/derived-manifest.json) records the original URLs, file hashes, JavaScript variable names, and extraction method. Rebuild derived JSON after refreshing with `python3 scripts/extract_metr_chart_data.py`.

## Provenance and verification

[backup-manifest.json](backup-manifest.json) records downloaded URLs, retrieval time, status, sizes and hashes. [inventory.json](inventory.json) and [SHA256SUMS](SHA256SUMS) cover archived and derived files; [verification.json](verification.json) records checks.

From the repository root:

```sh
python3 scripts/backup_sources.py --source metr --retry-failed
python3 scripts/verify_backups.py
```

After an intentional refresh, update documentation and derived data, review the results, then run `python3 scripts/verify_backups.py --record` and verify again. From this directory, `sha256sum -c SHA256SUMS` checks the local inventory.

## Coverage gaps

The primary report, its PDF, and all attempted first-party assets were downloaded. These supporting pages returned HTTP 403:

- [https://openai.com/index/hugging-face-incident-and-the-road-ahead/](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [https://openai.com/index/hugging-face-model-evaluation-security-incident/](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
