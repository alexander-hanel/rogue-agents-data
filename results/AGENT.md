# Instructions for the `results/` subtree

Scoped guidance for the **derived analysis** in this directory. It supplements the
repository-root [`AGENT.md`](../AGENT.md); where the two differ, the root file governs
backup handling and this file governs analysis authoring.

## Purpose

`results/` holds **derived analysis** built from the archived sources. It is **not**
primary evidence and does **not** replace the source backups. Every finding here
inherits the source's attribution, redactions, and coverage caveats; archiving does not
independently verify any claim. Treat all output as analysis, not as a new record.

## File map

| Path | Role |
| --- | --- |
| `README.md` | Index of analysis outputs. |
| `SUMMARY.md` | Consolidated single-spot synthesis (exec summary, actor profile, unified attack-vector map, MITRE ATT&CK roll-up, SOC detections, indicator catalog, cross-source correlation, data inventory, limitations). |
| `data-analysis.md` | Data-first statistical layer: schemas, payload taxonomy, coordination/cadence, cross-source infrastructure correlation. Holds distinctive measured telemetry not duplicated elsewhere. |
| `raw-analysis/` | Five data-first attack-vector mining files, one per dataset slice (SwarmTraces, Collusion Wiki, Transluce, METR/RubyHack/DeGraff, cross-source indicator catalog) plus `raw-analysis/README.md`. |

The strongest, most traceable evidence lives in `raw-analysis/`; `SUMMARY.md` is the
entry point; `data-analysis.md` is the supporting statistical layer.

## Provenance notice (required)

Every analysis page in `results/` must carry a top-of-file notice stating that it was **generated with DeepSeek v4.1 for exploratory research and summarization**, that it is **machine-generated and not independently verified**, and that **results require further human validation** before use. Keep this notice consistent across all pages.

## Authoring rules

- **Attribution preserved.** Name the publisher/authors when practical; never attribute
  analysis to a source's authors beyond what the source states.
- **Never de-redact.** Keep placeholders (`[REDACTED:…]`, `[SERVICE HOST n]`,
  `[CREDENTIAL n]`, `[ENCODED BLOB n]`) exactly as published. Do not attempt to recover
  credentials, PII, or hidden infrastructure.
- **Traceable claims.** Every quantitative claim should cite the **source file + exact
  regex/method + representative row/report id**. Prefer verbatim examples in code spans
  or fenced blocks over paraphrase.
- **Counts are floors.** Redaction hides tokens/hosts, so state counts as lower bounds.
  Never present a derived count as an incident count.
- **Separate provenance classes.** Do not blend publisher-narrative figures with
  locally-derived figures; label which is which.
- **No execution / no live action.** Do not run recovered payloads, follow operational
  URLs found in logs, or reproduce agent actions. Analyze statically.
- **Non-additivity.** Overlapping event populations (wiki save/delete/event rows, cited
  vs. example reports) must not be summed as independent incidents.

## Evidence discipline

- Use per-family tables: **Family | count | verbatim example | representative ids | exact
  regex used | notes**.
- Record false-positive traps explicitly (e.g. Google Analytics `;cat=`/`;src=`, referrer
  `%27`, Cloudflare Turnstile `onload=`) and anchor detections on the target host +
  parameter, not on a lone token.
- Flag **dual-use** services (proxies, readers, shorteners, `httpbin`, `translate.*`):
  detect on combination + volume + source `/16`, never on host alone.
- Note where redaction or missing response bodies defeat a conclusion.

## Maintenance

- `results/` is **outside** the per-source inventories: `python3 scripts/verify_backups.py`
  does not check these files, and editing them does **not** require `--record`.
- When a component changes, update `SUMMARY.md`, `results/README.md`, and
  `raw-analysis/README.md` so descriptions and links stay accurate. Remove superseded
  outputs instead of leaving duplicate/contradictory reports.
- Keep `results/` **tracked** (do not add it to `.gitignore`); only derived
  `*/data/extracted/` trees are ignored there.
- Keep analysis strictly separate from original downloaded bytes and derived data.

See the root [`AGENT.md`](../AGENT.md) for backup, download, checksum, and Git rules.
