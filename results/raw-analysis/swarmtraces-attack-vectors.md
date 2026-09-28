# SwarmTraces — Validated Raw-Log Attack-Vector Analysis

> **⚠️ Generated with AI — validate before use.** This analysis was produced with **DeepSeek v4.1** for exploratory research and summarization. It is a machine-generated aid, not independently verified work. Figures, technique classifications, indicators, attribution, and any quoted excerpts **require further human validation** before being relied upon. Treat counts as approximations and conclusions as hypotheses; verify against the raw source data and the original publishers.

## Scope and method

Source: `swarmtraces/data/extracted/redacted.jsonl`. Every one of 189,579 JSONL rows was parsed. Technique counts below apply only to the 91,037 rows with `kind="payload"`, use `re.I` where stated, and count at most one hit per row per detector. Families overlap. No payload was run.

The file contains 91,037 payloads, 75,534 recovered-text rows, and 23,008 responses. All 189,579 `id` values and all 189,579 `cite` values are unique. There are 163,851 distinct `text` bodies, leaving 25,728 repeated-content rows (13.57%). `parent_id` is populated on 61,125 rows and `time_utc` is null throughout. Representative row: `R0000001`.

Redaction placeholders such as `[SERVICE HOST n]`, `[CREDENTIAL n]`, and `[ENCODED BLOB n]` make the counts lower bounds.

## Validated families

| Family | Payload rows | Exact detector | Representative ID | Interpretation |
| --- | ---: | --- | --- | --- |
| Shell-chained submission path | 1,190 | `file_path\"?\s*:\s*\"?src/main\.c;[^\"]*` | `R0000001` | Literal shell grammar in a structured field. |
| RCE/recon primitives | 1,714 | `;id`, `uname -a`, `/proc/*`, `os.popen`, `subprocess`, `Popen`, `/dev/tcp/` union | `R0000007` | Code execution or environment discovery grammar. |
| Python/C subprocess | 1,033 | `os\.popen|subprocess\.|Popen\(` | `R0000698` | Literal process creation. |
| `/dev/tcp` probe | 65 | `/dev/tcp/` | `R0000083` | Bash TCP connection attempt. |
| Embedded-target proxy fetch | 4,815 | service-host path followed by `http://` or `https://` | `R0000032` | Target URL passed through a third-party fetch path. |
| Canvas/pixel channel grammar | 1,910 | `putImageData|createImageData|getImageData|fillRect(...)` | `R0000023` | Pixel encoding/decoding primitive. |
| Image request channel | 7,321 | `new Image` | `R0000001` | Image request primitive; surrounding code determines exfiltration use. |
| Host-resolution override/probe | 417 | `getaddrinfo|gethostbyname` | `R0000757` | Commonly a monkey-patch to resolve a selected host to a fixed IP. |
| Paste/webhook reference | 168 | paste/webhook/request-bin host union | `R0007998` | Upload or callback grammar. |
| Compression/base64 chain | 2,995 | gzip/zlib/CompressionStream union | `R0000037` | Encoded delivery or execution chain. |
| Credential-bearing request | 17,918 | `Authorization|X-API-Key|aws-waf-token|whoami|LOOT|_token|serviceaccount/token` | `R0000001` | Credential use or collection site. |
| Authorization header | 12,755 | `Authorization['\"]?\s*:` | `R0012004` | Bearer/basic request construction. |
| Kubernetes API | 687 | `/api/v1/(pods|secrets|nodes|configmaps|namespaces|serviceaccounts)` | `R0012004` | Cluster API enumeration/access. |
| Service-account token | 57 | `kubernetes\.io/serviceaccount/token` | `R0009849` | In-cluster credential path. |
| Escape primitives | 127 | `chroot|setuid|setgid|nsenter|unshare|capsh|ptrace` union | `R0005999` | Privilege/container manipulation grammar. |
| Tailscale | 285 | `tailscale|pkgs.tailscale.com|controlplane.tailscale` | `R0027922` | VPN discovery/enrollment references. |
| Docker Registry v2 | 2,372 | `registry-1\.docker\.io/v2/|auth\.docker\.io/token` | `R0013177` | Registry authentication/read/write flow. |
| Artifactory/cache | 1,115 | `artifactory|github-remote-cache|github-remote` | `R0000076` | Artifact-cache access. |
| Encoded path variants | 62 | `%252f|%252e|%25252f` | `R0005744` | Normalization-differential probes. |
| HF commit/repository operation | 2,313 | `.huggingface.yaml|README.md.*content|datasets/...commit|api/repos/create` | `R0007951` | Repository/content mutation grammar. |
| `MKCOL` mailbox | 347 | `MKCOL` | `R0000076` | WebDAV collection creation used in named paths. |
| RSA/JWT signing | 1,113 | RSA key headers, `signature`, `verify(`, or `RS256` | `R0000324` | Signed command/token material. |
| Dataset-comment command string | 49 | comment value beginning `OTS92CMD|N1CMD|ddsours` | `R0031312` | Command-like data in a dataset commit comment. |
| Anti-bot/WAF grammar | 76 | Turnstile, challenge platform, WAF-token, CAPTCHA union | `R0002547` | Token/challenge handling; surrounding code includes a claimed solver. |
| `atob`/character decode | 6,136 | `atob\(|String\.fromCharCode|fromCharCode` | `R0000012` | Encoded-stage decoding. |
| Location-hash delivery | 2,457 | `location\.hash\.slice\(1\)` | `R0000012` | Fragment-carried payload. |
| Decode/decompress then evaluate | 1,595 | `then\(eval\)|DecompressionStream` | `R0000037` | Literal dynamic evaluation. |
| Nested base64/zlib/Python | 1,397 | base64 plus gzip/zlib execution union | `R0001608` | Multi-stage code loader. |
| File deletion | 59 | `unlink|os.remove|remove evil|no-card|clean up our pod` union | `R0000943` | Cleanup grammar; some matches can be ordinary temporary-file handling. |
| Expiring content | 1,037 | `expiry_days|expires|ttl=|expire` | `R0007998` | Ephemeral staging; not inherently defense evasion. |

## Marker inventory

The exact case-insensitive regex `\bzz[A-Z0-9][A-Z0-9_]{2,40}` matches 980 payload rows and 1,146 occurrences, producing 631 unique bounded strings. Representative IDs include `R0000032` and `R0000076`.

Prefix occurrence counts are `FILE` 493, `MODAL` 84, `RESULT` 40, `BEACON` 16, `CALLBACK` 15, `INBOX` 18, `MX` 10, `BROWSER` 13, `HF` 17, `MAILBOX` 4, and `DONE` 19. Because the detector stops after 43 characters, these values describe the regex output rather than complete path names.

The `MKCOL` examples combine a named `zz*` directory with base64-encoded command output. Example structure from `R0000076`: `MKCOL .../github-remote-cache/zzC5DFROOT4TEST_${R}/`, where `R` is constructed from `id`, `uname`, and `pwd` output.

## Web-application grammar

| Detector | Payload rows | Exact regex | Assessment |
| --- | ---: | --- | --- |
| XSS/HTML-like | 3,706 | `<script>|onerror\s*=|alert\(1\)|<svg|<img src=x` | Mostly loaders/HTML fragments; candidate grammar only. |
| Template-like | 1,014 | `\{\{7\*7\}\}|\{\{.*\}\}` | Broad and prone to ordinary template matches. |
| SQL `UNION SELECT` | 0 | `union select|UNION SELECT` | No payload-row match. |
| Traversal/LFI-like | 33 | `\.\./\.\./|/etc/passwd` | Candidate path grammar. |

These counts do not show that a target interpreted the submitted strings or that exploitation succeeded.

## Evidence boundaries

- `getaddrinfo` monkey-patching is host-resolution control, not evidence of DNS tunneling.
- Canvas and image requests are channel primitives; intent follows from the complete payload, not the token alone.
- The 76 WAF/challenge rows contain claimed solver behavior, but a regex count does not prove bypass success.
- Literal token values are mostly redacted, so request sites are measurable while credential acquisition is not.
- The publisher narrative contains incident conclusions beyond what the flat payload table independently establishes.

## Detection use

High-specificity combinations include `file_path` followed by shell separators; `MKCOL` plus a named `zz*` cache directory; registry upload initiation followed by digest `PUT`; service-account token reads followed by Kubernetes secret/node enumeration; and fragment/base64 decoding followed by `eval`. Apply context and volume to proxy, image, canvas, expiration, and WAF tokens because they are common in benign code.
