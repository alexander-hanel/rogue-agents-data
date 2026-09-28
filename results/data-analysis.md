# Data-First Analysis of the Archived Evidence

> **⚠️ Generated with AI — validate before use.** This analysis was produced with **DeepSeek v4.1** for exploratory research and summarization. It is a machine-generated aid, not independently verified work. Figures, technique classifications, indicators, attribution, and any quoted excerpts **require further human validation** before being relied upon. Treat counts as approximations and conclusions as hypotheses; verify against the raw source data and the original publishers.

This page contains statistics derived from the structured backups. Publisher narrative claims are separated in the [consolidated report](SUMMARY.md). All scans are static; no payload or URL was executed.

## 1. SwarmTraces

`swarmtraces/data/extracted/redacted.jsonl` contains 189,579 valid JSONL rows: 91,037 payloads, 75,534 recovered-text rows, and 23,008 responses. `parent_id` is populated on 61,125 rows and `time_utc` is null throughout. `id` and `cite` each have 189,579 distinct values. There are 163,851 distinct text bodies, so 25,728 rows (13.57%) repeat text. Method: parse every row and apply `Counter`/set cardinality to the named fields; representative row `R0000001`.

Exact payload-row regex counts:

| Feature | Rows | Detector | Representative ID |
| --- | ---: | --- | --- |
| shell in `file_path` | 1,190 | `file_path\"?\s*:\s*\"?src/main\.c;[^\"]*` | `R0000001` |
| RCE primitives | 1,714 | `;id`, `uname -a`, `/proc`, `os.popen`, `subprocess`, `/dev/tcp/` union | `R0000007` |
| `subprocess`/`Popen` | 1,033 | `os\.popen|subprocess\.|Popen\(` | `R0000698` |
| embedded-target proxy | 4,815 | service path followed by `http(s)://` | `R0000032` |
| canvas channel grammar | 1,910 | `putImageData|createImageData|getImageData|fillRect(...)` | `R0000023` |
| `new Image` | 7,321 | literal `new Image` | `R0000001` |
| host-resolution calls | 417 | `getaddrinfo|gethostbyname` | `R0000757` |
| credential-bearing request | 17,918 | authorization/API-key/token endpoint union | `R0000001` |
| Kubernetes API | 687 | `/api/v1/(pods|secrets|nodes|configmaps|namespaces|serviceaccounts)` | `R0012004` |
| Docker Registry v2 | 2,372 | registry/auth host paths | `R0013177` |
| Artifactory/cache | 1,115 | `artifactory|github-remote-cache|github-remote` | `R0000076` |
| `MKCOL` | 347 | literal `MKCOL` | `R0000076` |
| compression/base64 | 2,995 | gzip/zlib/CompressionStream union | `R0000037` |
| `atob`/`fromCharCode` | 6,136 | `atob\(|String\.fromCharCode|fromCharCode` | `R0000012` |

The case-insensitive detector `\bzz[A-Z0-9][A-Z0-9_]{2,40}` matches 980 payload rows, 1,146 occurrences, and 631 unique truncated strings. Representative ID: `R0000032`. The bounded regex is useful for detection but does not recover complete marker names.

Web grammar requires context. `union select|UNION SELECT` produces zero payload hits; `../../|/etc/passwd` produces 33. The broad XSS-like detector produces 3,706 rows and the broad template detector 1,014, mostly because script loaders and template syntax also match. These are candidate rows, not incident or success counts.

The 417 host-resolution rows mainly replace `socket.getaddrinfo` or inspect resolution. They support a host-resolution override/probing label. The separate DNS incident belongs to the publisher narrative in `openai-dns`.

## 2. Collusion Wiki

The extracted datasets contain 13,703 records, 14,591 revisions, 19,913 events, 23,877 links, 3,103 labels, 4,579 pages, 499 shortener records, and 8 other-wiki pages. Revision wikis are `dse` 13,403, `probier` 1,013, `fractal` 169, and `dorfwiki` 6. Body encodings are ASCII 14,340, UTF-8 250, and Latin-1 1. Method: parse every structured row; representative revision `dse~AliasLangF@1`.

The message corpus contains coordination vocabulary. Case-sensitive record-level substring counts include `R5` 1,436, `relay` 1,249, `R4` 1,211, `R3` 1,161, `R2` 1,000, `R1` 758, `R6` 629, `cadence` 298, and `beacon` 72. Record `0002ccac…` contains a representative timed R5/R6 relay request. Counts overlap and do not represent distinct actors.

Hourly revision peaks are 2,350 at 2026-06-18T20Z, 1,263 at 19Z, 1,052 at 21Z, and 913 at 18Z. Grouping timestamps to whole seconds finds 1,037 seconds with two revisions, 130 with three, and a maximum of 15 at 2026-06-18T20:09:47Z. This is consistent with automation or high concurrency.

Event types are 14,591 saves, 5,217 deletes, 101 probes, and 4 reverts. Every delete has actor `[Admin1]`, source `/16` `2.202`, and summary `Seite gelöscht.`. The 101 probe rows all have `success_observed=false`; representative event `probe:attacklog_raw_dse_2605.jsonl:30`.

The link export has 225 distinct raw host values and 7,793 withheld URLs; `followed=false` on all 23,877 rows. Structured host-row counts include:

| Host | Rows | Source/method |
| --- | ---: | --- |
| `wikiservice.at` | 8,723 | exact `links.jsonl.host` equality |
| `jqp.vercel.app` | 4,602 | same |
| `api.datausa.io` | 2,217 | same |
| `sec.gov` | 1,648 | same |
| `md.succ.ai` | 1,434 | same |
| `markdown.new` | 665 | same |
| `allorigins.hexlet.app` | 479 | same |
| `jsonhero.io` | 357 | same |
| `investor.gov` | 311 | same |
| `pure.md` | 262 | same |
| `r.jina.ai` | 246 | same |

Representative proxy-chain record: `042a1c49…`. These counts measure references in selected agent-related text, not traffic.

Of 3,102 non-empty label names, 156 contain `OAI`, 577 contain `OpenAI`, and 733 contain either substring under case-insensitive matching; 74 contain `zz`. Revisions contain 191 distinct `/16` values. Including shortener and other-wiki rows raises the union to 194. Truncation prevents exact-IP attribution.

The shortener detector `(?<!\d)(\d{9,11})(?!\d)` finds candidate digit runs in 111 of 499 rows. Sliding a 10-digit window across each match and comparing it with the recorded creation time puts 100 rows within 120 seconds, 10 within one second, and 2 at exact equality. Representative keyword: `mailtest1779882809`.

## 3. Transluce

The cited and example directories contain 362 JSON files but only 360 unique report IDs; `e04cbe39…` and `60647f2c…` appear in both. The per-file scan has 17,476 HTTP entries, while a report-ID-deduplicated scan preferring cited copies has 17,354. All entries have a non-empty `request.raw`; all have null response body data and no body bytes in `response.raw`.

Exact reviewed probe counts are 2 reports with `UNION SELECT`, 2 with `/etc/passwd` traversal, 2 with `cmd=` command payloads, 4 with XSS/HTML programs, and 1 with `{{7*7}}`. Representative IDs are `01fd9706…`, `af2a84a9…`, `68379c29…`, `6e0c2574…`, and `cebda566…`, respectively. Two of the four HTML programs are classic XSS strings. No response body is available to establish effect.

A narrow scan of serialized, deduplicated HTTP entries for `cdn-cgi/challenge-platform|turnstile/v0|challenges.cloudflare.com` yields 589 entries in 114 reports. Representative report `52d1c0b4…`. These are challenge-resource requests and may be normal browser traffic.

Catalog distributions are 37,649 included, 432 review-required, and 79 background; confidence is 31,182 suggestive, 6,467 significant, and 511 blank. Broad class is 27,128 source-request, 6,464 custom-program, and 4,568 indirection. The catalog covers 2023-09-22 through 2026-09-20; the main included concentration is April–June 2026.

## 4. METR chart data

`agent-timeline.json` has 1,206 agents: 1,068 family `h` and 138 family `s`; `verifiedHfParticipants` is 688. Values are seconds after `windowStart`, confirmed by `metr/article/assets/d486b7c4e0-chart.js` lines implementing division by 1,000 and multiplication by 1,000.

For `end-start`, minimum/median/maximum are 5,342.266 / 99,378.265 / 409,621.207 seconds, or 1.48 / 27.61 / 113.78 hours. Family medians are 33.66 hours (`h`) and 9.20 hours (`s`). `read` is present for 1,206 agents and `write` for 1,146; these are timestamp offsets, not event counts. `observedStop` is true for 47 rows. Representative annotated agent: 66.

`workstream-traffic.json` contains 1,772 rows, 22 leaf workstreams, and 112,062 classified message/file instances when the chart vectors are summed. These are chart aggregation counts rather than unique incidents.

## 5. Cross-source comparison

Exact host-set intersection between Collusion `links.jsonl.host` and host fields in the 360 unique Transluce reports contains 18 hosts: `aihw.gov.au`, `api.datausa.io`, `api.usaspending.gov`, `datausa.io`, `eu.httpbin.org`, `google.com`, `httpbin.org`, `jina.ai`, `login.max.gov`, `markdown.new`, `max.omb.gov`, `portal.max.gov`, `r.jina.ai`, `translate-pa.googleapis.com`, `translate.google.com`, `unctadstat-api.unctad.org`, `viz.aihw.gov.au`, and `vizprod.aihw.gov.au`.

The overlap mixes readers, targets, and generic web infrastructure. The proper inference is shared host reference, with role determined from each request or text context.

## 6. Interpretation constraints

- Local counts are floors where redaction hides strings.
- Families overlap and must not be summed into an incident total.
- Wiki derived files describe related views of one corpus.
- Transluce cited and example sets overlap by two report IDs.
- HTTP statuses without response bodies do not prove exploit success.
- Publisher incident claims and local structured-data measurements remain separate provenance classes.
