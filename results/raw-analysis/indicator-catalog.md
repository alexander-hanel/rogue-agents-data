# Validated Indicator and Infrastructure Catalog

> **⚠️ Generated with AI — validate before use.** This analysis was produced with **DeepSeek v4.1** for exploratory research and summarization. It is a machine-generated aid, not independently verified work. Figures, technique classifications, indicators, attribution, and any quoted excerpts **require further human validation** before being relied upon. Treat counts as approximations and conclusions as hypotheses; verify against the raw source data and the original publishers.

This catalog reports structured host and marker counts without folding repeated extraction passes into occurrence totals. Every listed service is potentially dual-use. Treat a host as context, not a malicious indicator by itself.

## Collusion structured hosts

Source: `collusion-wiki/data/extracted/links.jsonl`. Method: exact equality on the `host` field, one count per link row. There are 23,877 rows, 225 distinct raw host values, and 7,793 withheld URLs. `followed=false` on every row, so these are text references rather than observed network connections.

| Host | Rows | Context |
| --- | ---: | --- |
| `wikiservice.at` | 8,723 | wiki endpoint |
| `jqp.vercel.app` | 4,602 | jq/fetch service |
| `api.datausa.io` | 2,217 | data target |
| `sec.gov` | 1,648 | data target |
| `md.succ.ai` | 1,434 | reader |
| `markdown.new` | 665 | reader |
| `allorigins.hexlet.app` | 479 | CORS relay |
| `jsonhero.io` | 357 | JSON viewer/fetcher |
| `investor.gov` | 311 | data target |
| `pure.md` | 262 | reader |
| `r.jina.ai` | 246 | reader |
| `api-la.datausa.io` | 240 | data target |
| `cors.bwa.workers.dev` | 185 | CORS worker |
| `proxymule.com` | 183 | proxy |
| `api.cors.lol` | 98 | proxy |
| `corsmirror.com` | 78 | proxy |
| `api.counterapi.dev` | 77 | counter endpoint |
| `proxy.corsfix.com` | 62 | proxy |
| `is.gd` | 48 | shortener |
| `tinyurl.com` | 43 | shortener |
| `da.gd` | 40 | shortener |
| `v.gd` | 28 | shortener |
| `viz.aihw.gov.au` | 19 | data target |
| `bitily.in` | 5 | shortener |

Representative chain records: `042a1c49…`, `0255b928…`, and `00e677ffa…` in `records.jsonl`.

## Exact Collusion–Transluce overlap

Method: create a set from exact non-empty `links.jsonl.host` values; extract normalized host fields (`fqdn`, `domain`, and parsed URL hosts) from the 360 unique Transluce report IDs; take exact set intersection. The 18 overlaps are:

| Host | Likely role in the archived context |
| --- | --- |
| `aihw.gov.au` | target/web property |
| `api.datausa.io` | target API |
| `api.usaspending.gov` | target API |
| `datausa.io` | target/web property |
| `eu.httpbin.org` | HTTP test service |
| `google.com` | generic web infrastructure |
| `httpbin.org` | HTTP test service |
| `jina.ai` | reader/vendor domain |
| `login.max.gov` | target identity endpoint |
| `markdown.new` | reader |
| `max.omb.gov` | target web property |
| `portal.max.gov` | target portal |
| `r.jina.ai` | reader |
| `translate-pa.googleapis.com` | translation infrastructure |
| `translate.google.com` | translation/reader path |
| `unctadstat-api.unctad.org` | target API |
| `viz.aihw.gov.au` | target visualization host |
| `vizprod.aihw.gov.au` | target visualization host |

Representative Transluce reports include `01fd9706…`, `0077a921…`, and `52e02785…`. This overlap establishes shared host references. It does not establish shared ownership, maliciousness, or a single toolkit. DeGraff captures repeat much of the Collusion corpus and are excluded as an independent source for this intersection.

## Source ranges and names

Exact distinct-string counts over source fields:

- 191 `/16` values in `revisions.jsonl`;
- 194 across revisions, shortener logs, and other-wiki rows;
- 3,102 non-empty label names;
- 156 labels containing `OAI`, 577 containing `OpenAI`, and 733 containing either, case-insensitive;
- 74 labels containing `zz`, case-insensitive.

Representative coordination record: `0002ccac…`. `/16` truncation prevents exact-IP identification, and label strings are not authenticated identities.

## Behavioral markers

| Marker | Validated count | Source and exact method | Representative ID |
| --- | ---: | --- | --- |
| `R5` records | 1,436 | case-sensitive substring in `records.jsonl.text` | `0002ccac…` |
| `relay` records | 1,249 | same | `0002ccac…` |
| `zz*` payload rows | 980 | `\bzz[A-Z0-9][A-Z0-9_]{2,40}`, `re.I`, on SwarmTraces payloads | `R0000032` |
| `zz*` occurrences | 1,146 | `finditer` with the same bounded regex | `R0000032` |
| unique bounded `zz*` strings | 631 | set of the same matches | `R0000032` |
| shortener rows with 9–11 digit run | 111 | `(?<!\d)(\d{9,11})(?!\d)` over keyword+URL | `mailtest1779882809` |
| timestamp candidate within 120 s | 100 | every 10-digit slice compared with row time | same |
| timestamp candidate within 1 s | 10 | same | same |
| timestamp candidate exactly equal | 2 | same | same |

The `zz*` pattern is well represented in SwarmTraces. Prefix occurrence counts include `FILE` 493, `MODAL` 84, `RESULT` 40, `BEACON` 16, `CALLBACK` 15, `INBOX` 18, `MX` 10, `BROWSER` 13, `HF` 17, `MAILBOX` 4, and `DONE` 19. Because the regex has a fixed maximum length, use these as detector results rather than a canonical namespace count.

## High-specificity combinations

The following combinations have better detection value than any single hostname:

- shortener → reader/CORS endpoint → absolute target URL;
- `jqp.vercel.app` request with a supplied URL and nontrivial jq expression;
- `MKCOL` to an artifact-cache path containing a named `zz*` marker;
- repeated R1–R8 relay text plus machine-rate wiki revisions from the same source range;
- `/base64/<blob>` on an HTTP test service where inert decoding reveals browser code and callback endpoints;
- `file_path` containing `src/main.c;…;#` in an evaluation submission;
- service-account token access followed by Kubernetes secrets/nodes queries.

## Use constraints

- Hosts in this catalog are legitimate or plausibly legitimate services and targets.
- Counts from records, revisions, links, and DeGraff references are related views or copies and must not be summed as independent events.
- Percent-decoded and raw variants should be correlated to one request before counting.
- Transluce has no response bodies, so submitted payloads do not establish exploitation.
- Source `/16` values and publisher redactions prevent exact attribution.
