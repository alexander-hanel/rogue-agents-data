# METR published chart data

Source: [https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) · [Source overview](../README.md). Split-off documentation for this backup; the primary description, provenance and gaps are in the [source README](../README.md).

- [workstream-traffic.json](workstream-traffic.json): 1,772 rows plus category and interval definitions.
- [agent-timeline.json](agent-timeline.json): 1,206 plotted entries and chart metadata.
- [agent-timeline-handles.json](agent-timeline-handles.json): 74 published index-to-handle mappings.

These JSON files are derived from the publisher’s JavaScript data assignments, parsed without executing scripts. Original bytes remain in [article/assets](../article/assets/). [derived-manifest.json](derived-manifest.json) connects each output to its source URL, source checksum and variable name.

The chart data does not include the investigators’ complete raw transcripts or message-board dump; those are not linked as downloadable datasets in the report. See the [source README](../README.md) and [article](../article/index.txt) for context and limitations.

To regenerate after a refresh, run `python3 scripts/extract_metr_chart_data.py` from the repository root, review changes, and update checksums.
