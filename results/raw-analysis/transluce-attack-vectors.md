# Transluce URLQuery — Validated Raw-Report Analysis

> **⚠️ Generated with AI — validate before use.** This analysis was produced with **DeepSeek v4.1** for exploratory research and summarization. It is a machine-generated aid, not independently verified work. Figures, technique classifications, indicators, attribution, and any quoted excerpts **require further human validation** before being relied upon. Treat counts as approximations and conclusions as hypotheses; verify against the raw source data and the original publishers.

## Scope and deduplication

Sources: 63 files in `transluce/data/cited-reports/`, 299 in `example-reports/`, and metadata under `transluce/data/catalog/`. The 362 JSON files contain 360 unique report IDs because `e04cbe39…` and `60647f2c…` occur in both directories. Per-file iteration yields 17,476 HTTP entries. Deduplicating by report ID and preferring the cited copy yields 17,354.

All 17,476 file-level HTTP entries contain non-empty `request.raw`. All have `response.data.data=null`, and `response.raw` has no content after the header terminator. Status codes show how a server classified a request, not whether a submitted string executed. Files, artifacts, and sensors may contain metadata and are not treated as response bodies.

No URL was contacted and no submitted program was run. Base64 content was decoded only as inert text.

## Reviewed submitted probes

Counts below are distinct report IDs after decoding request targets where needed. Broad regex candidates were manually reduced to exact submitted grammar so analytics parameters and ordinary challenge scripts do not inflate the totals.

| Submitted grammar | Reports | Exact test | Representative report | Evidence boundary |
| --- | ---: | --- | --- | --- |
| SQL `UNION SELECT` | 2 | case-insensitive `union[ +%20]+select` in decoded/raw request | `01fd9706-d9d0-42e4-b813-448a541a2571`; also `82593154…` | Attempted SQL grammar; no result body. |
| traversal to `/etc/passwd` | 2 | decoded `../../../../etc/passwd` | `af2a84a9-6a5a-4a37-9bdd-9151719a2053`; also `f9f7bb80…` | Attempted traversal; response effect unknown. |
| command parameter | 2 | decoded `cmd=wget…` or `cmd=cat…` | `68379c29-56b9-4e72-8c3c-c70c0a4dc153`; also `e993dc0e…` | Submitted shell-like value; execution unknown. |
| XSS/HTML program | 4 | submitted script, SVG/onload, image canary, or auto-submitting form | `6e0c2574-9d8d-4d7e-a485-f71f336f5f44` | Two are classic XSS probes; two are broader HTML submissions. |
| template `{{7*7}}` | 1 | decoded/raw `{{7*7}}` | `cebda566-5b4f-433d-bf59-300e30abc764` | Submitted SSTI grammar; evaluation unknown. |

The representative SQL request targets `api.datausa.io`; the second targets `nmdigital.unm.edu`. The traversal and command pairs use the same two target families. The classic XSS examples are a Data USA `<script>` value and an AIHW Tableau SVG/onload value. HTTP 200 or 403 alone does not validate exploitation.

## Reader paths and URL-carried programs

Raw request targets include an absolute target URL embedded in a reader path, for example:

```text
GET /http://dataapi.oncb.go.th/suppress/case_per/2557 HTTP/1.1
Host: r.jina.ai
```

Representative report: `c9721695-9456-4c4b-bff2-3652f646f16e`. Other representative reports are `209375ce…`, `6fd6d3cb…`, and `0077a921…` (`markdown.new/https://nmdigital.unm.edu/...`). This is third-party retrieval of a supplied target URL. It does not prove an SSRF vulnerability because these services may intentionally provide reader/proxy behavior.

Twenty-six reports contain `/base64/<blob>` requests to HTTP test services. Representative report `328fc5f4…` decodes to an HTML/JavaScript program that submits Quidax API requests; `1ee69d3e…` contains a Tableau/webhook workflow. The request corpus shows submitted programs and callback endpoints. It does not show that the remote browser completed them or that hard-coded identifiers came from prior transactions.

### Quidax endpoint workflows

Reports `328fc5f4-0ef9-441d-bb3c-e11dcb1167fa`, `595ea88a-07a4-445b-8a5e-288c5f9b8453`, and `7cf8f5a2-6788-4c78-b7c7-f8e96d1f7533` contain URL-carried programs that call endpoints under `ramp.quidax.io/api/ramp-proxy`. The static programs reference `auth/send_otp`, `auth/verify_otp`, `kyc/smile_ids/qa_reset`, `on_ramp_transactions/add_wallet_address`, `off_ramp_transactions/assign_address`, and transaction-read paths. Related reports include `f825e84d…` and `fa7c2f4c…`.

The archive supports endpoint enumeration and submitted OTP/KYC/wallet operations. It does not establish that the supplied OTP, transaction identifiers, or wallet changes were accepted.

### AIHW Tableau and callback workflow

Report `1ee69d3e-6629-4ccf-8da5-b8f1f544b3cc` contains an HTML program loading the Tableau JavaScript API for `vizprod.aihw.gov.au`, iterating workbook sheets and filters, and submitting collected values to a `webhook.site` endpoint. The report records the program and its network-resource context. Missing response bodies prevent a complete reconstruction of data returned or delivered.

### Account, disposable-mail, and remote-browser endpoints

Reports `3b3e1e9d-1a5f-4a3b-81a4-a4f8b99f2f86`, `3d4b0181-3d32-413a-853d-b2a7a40604c0`, `75f8ba63-db57-4837-80e5-efc03719cd12`, and `f3e0ef3c-a8a4-48d2-993d-f83363282c94` reference Browserless authentication, `api.mail.gw`, account creation, OTP, or token endpoints. These requests support a workflow involving disposable mail and remote-browser services. They do not prove that an account was successfully provisioned.

## Challenge-related traffic

A narrow scan over deduplicated HTTP entries for:

```regex
cdn-cgi/challenge-platform|turnstile/v0|challenges\.cloudflare\.com
```

finds 589 entries in 114 reports when applied to each serialized HTTP entry. Representative report `52d1c0b4-e30c-4daf-ba93-4d4db542f0f6` requests Cloudflare challenge and Turnstile resources. These are challenge-related browser requests. They can occur during ordinary automated or interactive browsing and do not establish challenge bypass.

Partial-content status codes and byte ranges likewise show HTTP transfer behavior; without request-sequence and response-body evidence they do not establish allow-list evasion.

## Catalog statistics

`transluce/data/catalog/all-reports.csv` contains 38,160 rows. Exact field counts are:

- disposition: 37,649 `included`, 432 `review_required`, 79 `background`;
- confidence: 31,182 `suggestive`, 6,467 `significant`, 511 blank;
- broad class: 27,128 `source_request`, 6,464 `custom_program`, 4,568 `indirection`.

The full catalog ranges from 2023-09-22 through 2026-09-20. The included set is concentrated in April–June 2026. Representative catalog row: `b0921af8-4f6a-4557-b9d8-604ee8b6e87c`. Catalog rows are metadata candidates selected by the publisher; they are not 38,160 confirmed incidents or authenticated agents.

## Host overlap and source boundaries

The 360-report host set has 18 exact overlaps with the Collusion structured link-host set: `aihw.gov.au`, `api.datausa.io`, `api.usaspending.gov`, `datausa.io`, `eu.httpbin.org`, `google.com`, `httpbin.org`, `jina.ai`, `login.max.gov`, `markdown.new`, `max.omb.gov`, `portal.max.gov`, `r.jina.ai`, `translate-pa.googleapis.com`, `translate.google.com`, `unctadstat-api.unctad.org`, `viz.aihw.gov.au`, and `vizprod.aihw.gov.au`.

Some are targets, some are reader or HTTP-test services, and some are generic web infrastructure. Exact overlap is evidence of shared references only.

## Detection use

- Decode and inspect `/base64/<blob>` paths in a non-executing pipeline.
- Inspect absolute URLs embedded after reader-host paths.
- Anchor injection alerts to the target host and parameter; ignore lone `%27`, `onload`, `;cat=`, or `;src=` tokens in analytics/challenge traffic.
- Treat Cloudflare and Turnstile resource loads as session context, then look for token replay or a protected action.
- Do not infer success from a 2xx status when response content is absent.
