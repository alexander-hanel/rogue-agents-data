# SwarmTraces — data

Source: [https://swarmtraces.org/](https://swarmtraces.org/) · [Source overview](../README.md). Split-off documentation for this backup; the primary description, provenance and gaps are in the [source README](../README.md).

- [redacted.jsonl.gz](redacted.jsonl.gz): **189,579 valid JSON records** from the publisher’s public, redacted evidence release.
- [extracted/redacted.jsonl](extracted/redacted.jsonl): the same dataset decompressed for direct reading; it reproduces the gzip stream byte for byte (189,579 records). The original `.gz` is preserved unchanged.
- The existing dataset was downloaded again for comparison and matched byte for byte. Its gzip stream and every JSON record were validated.
- The report, figure, and first-party article JavaScript and CSS are archived. Embedded viewer links remain in the source HTML and outbound-link inventory; the interactive viewer itself is not mirrored.

See the [source README](../README.md), [download manifest](../backup-manifest.json), and [verification results](../verification.json) for scope and provenance.
