# Transluce — Early rogue AI agent activity — data

Source: [https://transluce.org/agent-activity](https://transluce.org/agent-activity) · [Source overview](../README.md). Split-off documentation for this backup; the primary description, provenance and gaps are in the [source README](../README.md).

- [Publisher ZIP](urlquery-agent-activity-2026-09-23.zip) and an [extracted catalog](catalog/README.md): **38,160 distinct reports**, including 37,649 included reports, 79 background controls, and 432 rows requiring review.
- The catalog contains report links, classifications, provenance, methods, and aggregate counts. **It does not contain the full raw JSON, response bodies, or screenshots for all 38,160 reports.** Upstream private-archive counts in its metadata do not describe this backup.
- **299 pre-existing raw JSON examples** are retained in [data/example-reports/](example-reports/). Their original download time and method were not recorded; this backup validates and hashes them without claiming fresh retrieval.
- Raw JSON for all **63 reports directly cited in the article** is saved separately in [data/cited-reports/](cited-reports/), with retrieval provenance in the manifest. This set may overlap the existing examples.
- The linked DeepSearchQA CSV is saved as [DSQA-full.csv](DSQA-full.csv); it is a comparison dataset, not additional URLQuery reports.
- The existing article PDF is retained. ZIP CRCs and all **15 publisher file hashes** were verified.

See the [source README](../README.md), [download manifest](../backup-manifest.json), and [verification results](../verification.json) for scope and provenance.
