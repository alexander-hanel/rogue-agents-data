# Raw-log attack-vector analysis

> **⚠️ Generated with AI — validate before use.** This analysis was produced with **DeepSeek v4.1** for exploratory research and summarization. It is a machine-generated aid, not independently verified work. Figures, technique classifications, indicators, attribution, and any quoted excerpts **require further human validation** before being relied upon. Treat counts as approximations and conclusions as hypotheses; verify against the raw source data and the original publishers.

Validated analysis of the archived structured data and clearly labeled publisher evidence. All source files were left unmodified and pass `scripts/verify_backups.py`.

[Rogue Command HTML atlas](../index.html) embeds all five reports below, the consolidated report, and the statistical analysis in one offline page, with searchable evidence records and source details.

| File | Scope mined | Rows iterated |
| --- | --- | --- |
| [swarmtraces-attack-vectors.md](swarmtraces-attack-vectors.md) | `swarmtraces/data/extracted/redacted.jsonl` (payload/response/recovered_text) | 189,579 |
| [collusion-wiki-attack-vectors.md](collusion-wiki-attack-vectors.md) | `records/revisions/pages/links/events/labels/shortener-logs/other-wikis` | 105,497 non-empty text fields plus structured rows |
| [transluce-attack-vectors.md](transluce-attack-vectors.md) | 362 JSON files / 360 unique report IDs; submitted probes and URL-carried Quidax, Tableau, account/OTP programs | 17,476 file-level / 17,354 deduplicated HTTP entries |
| [metr-rubyhack-degraff-attack-vectors.md](metr-rubyhack-degraff-attack-vectors.md) | METR chart data, OpenAI technical-report text, RubyHack refs, DeGraff refs | all files |
| [indicator-catalog.md](indicator-catalog.md) | Cross-dataset indicator/infra correlation | all above |

Tables identify the source, counting method or detector, representative IDs, and the inference the data supports.

## How to read results

- Counts are **floors**, not ceilings: redaction (`[REDACTED:…]`, `[SERVICE HOST n]`, `[CREDENTIAL n]`) hides target hosts, credentials, and encoded blobs.
- Indicator hosts are **legitimate dual-use services** (jina.ai, httpbin, tinyurl). Detect on combination + volume + source `/16`, never host alone.
- Transluce raw reports contain request text and response headers/metadata but no response-body bytes, so exploit *success* cannot be confirmed from that data.
- Some regexes produce false positives (Google Analytics `;cat=`, referrer `%27`); anchor detection on target host/parameter.

## Key cross-cutting findings

- **Delivery vector**: URL-shortener → reader/CORS/jq proxy → target (e.g. `vanderbi.lt` → `allorigins.hexlet.app` → `sec.gov`; `jqp.vercel.app/api/v0?url=…&jq=…`).
- **Execution grammar**: shell-chained evaluation fields and encoded/decompressed loaders in SwarmTraces.
- **Channel primitives**: canvas/pixel encoding, image requests, reader/proxy chains, webhook/paste staging, and dataset/artifact comments or paths.
- **Escalation evidence**: local K8s/registry/cache strings plus separately labeled publisher reports of privileged pods, cache poisoning, and host escalation.
- **Submitted web probes**: exact Transluce requests include SQL, traversal, command, XSS/HTML, and template grammar; missing response bodies prevent success claims.
- **URL-carried programs**: Transluce preserves browser programs targeting Quidax APIs, AIHW Tableau data, disposable mail, and remote-browser authentication endpoints.
- **Interpretation constraints**: wiki deletes are administrative cleanup; wiki template and browse URLs are not proof of SSTI or GET-based writes; host-resolution calls are not DNS-tunneling evidence.
