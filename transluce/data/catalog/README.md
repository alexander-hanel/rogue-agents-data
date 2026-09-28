# URLQuery agent-activity dataset — v5 with reviewed confidence

This package updates `urlquery-agent-activity-2026-09-22` with all report IDs and supplemental decisions from `agent-attacks-urlquery-links-v5`. It retains the activity source breakdown and applies the explicit confidence changes listed below. It contains public report links and research metadata, with no full report JSON, response bodies, screenshots, submitted code, credentials, or private documents.

## Coverage and counts

- **38,160 distinct reports**: 38,078 main catalog rows and 82 supplemental rows. This adds 71 reports over the original activity package and removes none.
- **37,649 included reports**: 6,467 significant and 31,182 suggestive. There are also 79 background controls and 432 review-required rows, whose confidence remains blank.
- The chart retains **325 UTC date bins**, November 1, 2025 through September 21, 2026, covering **37,638 included reports**: 6,467 significant and 31,171 suggestive. Eleven included reports predate the chart window.
- V5 supplies 70 included additions and one background control. Confidence changes affect the confidence split, not inclusion, dates, or primary method classes.

## Files

- `reports.csv` and `additional-cited-reports.csv`: disjoint main and supplemental report catalogs, preserving the original nine-column schema. Main catalog confidence is updated only for the explicitly listed reviewed cases.
- `all-reports.csv`: deduplicated union of those two CSVs. Use this file **or** the two component files to avoid counting reports twice. `all-report-links.txt` contains the same report URLs.
- `report-sources.csv`: exactly one assignment for each of the 37,649 included reports. Background and review-required reports have no source-table row.
- `daily-counts.csv`: included report counts by UTC date, confidence, and method. `newly_classified` counts included reports from the complete 82-row supplement, preserving v5 semantics.
- `daily-source-counts.csv`: 330 nonempty date/source combinations. Source counts sum to the daily total on every date.
- `selection-provenance.csv`: v5's original selection provenance for the 71 additions.
- `supplement-classifications.json`: v5's original 82 supplemental classification decisions.
- `classification-overrides.json`: exact prior and revised confidence values and the review basis for 2 main-catalog reports.
- `methods.json`: v5 collection definitions plus the explicit reviewed-case override. `search-coverage.json` preserves the original search audit; adding selected IDs does not constitute a new search census.
- `collection-summary.json` and `supplement-summary.json`: reconciled totals. Raw-preservation counts are inherited upstream private-archive metadata, not raw files included here.
- `manifest.json`: byte lengths and SHA-256 hashes for every other file in this package.

## Source assignments

All existing activity source assignments are preserved. The 70 included v5 additions use their `selection-provenance.csv` source labels with `source_basis=selection_provenance`. Two synonymous names are normalized to the existing display buckets: `Clark University economics newsletter` to `Clark economics newsletter`, and `GBBC / eBird` to `GBBC`. The broader new `Iowa public health / CDC` label is retained rather than assuming all five reports concern thyroid statistics. Original source labels remain available in selection provenance.

Other source bases remain `source_method`, `external_source_tag`, `supplement_review`, and `unidentified`. `matched_sources` records source matches; `Multiple data sources` and `Source not identified` are display buckets. The breakdown counts reports, not unique tasks, contacted-domain inventories, or successful accesses.

## Reviewed confidence changes

Only the following two Base64-encoded answer-table submissions through `httpbin.org/base64/` are changed from `suggestive` to `significant` by explicit case review: the March 11 Roi Et table and the March 15 metals-price table. Other source requests, file-hosting pickups, and the metals URL with plaintext query parameters retain their v5 confidence. Report IDs, timestamps, inclusion, primary method class, descriptive evidence, and caveats are preserved. These overrides are distinct from the original static detector and do not assert successful exploitation or authenticated AI authorship.

| UTC timestamp | Report | Confidence change |
|---|---|---|
| 2026-03-11T12:05:59Z | [d6669745-83d2-4628-82fa-87420ae6a5d7 ](https://urlquery.net/report/d6669745-83d2-4628-82fa-87420ae6a5d7) | suggestive → significant |
| 2026-03-15T13:53:35Z | [4c62b534-a8e2-44d1-bddf-db92d4bf20a6 ](https://urlquery.net/report/4c62b534-a8e2-44d1-bddf-db92d4bf20a6) | suggestive → significant |

All other v5 row values are preserved. The raw values `significant` and `suggestive` denote higher and moderate qualitative confidence in agent-like activity; they are not calibrated probabilities or verified actors. Source selection, confidence, and evidence of success remain separate.

Public URLQuery coverage and this selected collection are incomplete. Links may later become unavailable. A zero date bin means no included report in this collection for that day. The chart’s time window and source assignments are preserved except for the documented additions.
