# Collusion Wiki — data

Source: [https://collusion.wiki/](https://collusion.wiki/) · [Source overview](../README.md). Split-off documentation for this backup; the primary description, provenance and gaps are in the [source README](../README.md).

- Twelve publisher download files in [data/](), including the complete published ZIP and compressed JSON/JSONL exports.
- Wiki corpus: **4,579 pages, 14,591 revisions, 19,913 event rows, and 3,103 labels**. Event populations overlap; do not add these counts as independent incidents.
- Additional exports cover **13,703 records and 23,877 links**, other wikis, shortener logs, site coverage, and coverage gaps.
- [extracted/](extracted/) holds the publisher ZIP expanded to plain JSON/JSONL plus the decompressed `.gz` exports (`pages`, `revisions`, `events`, `labels`, `manifest`, `records`, `links`, `other-wikis`, `shortener-logs`). Original downloads in [data/]() are preserved unchanged. Every extracted file was validated against the publisher’s SHA-256 list (in `extracted/SHA256SUMS`, mirroring the download page checksums).
- [Additional findings](../article/additional-findings.txt) and [download documentation](../article/download.txt) are also archived.
- ZIP CRCs and the publisher’s internal SHA-256 list were verified; every compressed JSON/JSONL stream was parsed.

See the [source README](../README.md), [download manifest](../backup-manifest.json), and [verification results](../verification.json) for scope and provenance.
