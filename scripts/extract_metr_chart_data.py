#!/usr/bin/env python3
"""Extract published METR chart JSON literals without executing JavaScript."""
import hashlib
import json
from pathlib import Path
import re

BASE = Path(__file__).resolve().parents[1] / 'metr'
FIELDS = {
    'WORKSTREAM_TRAFFIC_DATA': 'workstream-traffic.json',
    'AGENT_TIMELINE_DATA': 'agent-timeline.json',
    'AGENT_TIMELINE_HANDLES': 'agent-timeline-handles.json',
}


def main():
    manifest = json.loads((BASE / 'backup-manifest.json').read_text())
    provenance = []
    for row in manifest['downloads']:
        if row['status'] == 'unavailable' or not any(
            row['url'].endswith('/' + part + '/data.js')
            for part in ('workstream_chart', 'agent_timeline')
        ):
            continue
        source = BASE / row['path']
        raw = source.read_bytes()
        assert hashlib.sha256(raw).hexdigest() == row['sha256'], source
        text = raw.decode('utf-8')
        for field, filename in FIELDS.items():
            match = re.search(r'window\.' + field + r'\s*=\s*', text)
            if not match:
                continue
            obj, end = json.JSONDecoder().raw_decode(text[match.end():])
            assert text[match.end() + end:].lstrip().startswith(';'), field
            output = (json.dumps(obj, indent=2, ensure_ascii=False) + '\n').encode()
            target = BASE / 'data' / filename
            target.parent.mkdir(exist_ok=True)
            if target.exists() and target.read_bytes() != output:
                target = target.with_name(target.stem + '.' + hashlib.sha256(output).hexdigest()[:12] + '.json')
            target.write_bytes(output)
            provenance.append({
                'path': str(target.relative_to(BASE)),
                'sha256': hashlib.sha256(output).hexdigest(),
                'source_path': row['path'],
                'source_url': row['url'],
                'source_sha256': row['sha256'],
                'variable': field,
                'transformation': 'Parse the assigned JSON literal and serialize with indentation; no JavaScript execution.',
            })
    assert {r['variable'] for r in provenance} == set(FIELDS), 'Missing chart data'
    (BASE / 'data/derived-manifest.json').write_text(json.dumps(provenance, indent=2) + '\n')
    print('Extracted', len(provenance), 'chart datasets with source hashes.')


if __name__ == '__main__':
    main()
