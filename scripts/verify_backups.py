#!/usr/bin/env python3
"""Verify saved checksums, compressed streams, JSON, ZIP CRCs and publisher hashes."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path
import zipfile

ROOT=Path(__file__).resolve().parents[1]
DIRS=['collusion-wiki','rubyhack','kennethdegraff','transluce','swarmtraces','openai-dns','metr','openai-hugging-face']
def sha(p):
 with p.open('rb') as f: return hashlib.file_digest(f,'sha256').hexdigest()
def inventory(base):
 return {str(p.relative_to(base)):{'bytes':p.stat().st_size,'sha256':sha(p)}
  for p in sorted(base.rglob('*')) if p.is_file() and p.name not in ('SHA256SUMS','inventory.json','.download.lock','verification.json')}
def validate(p):
 if p.name.endswith('.jsonl.gz'):
  with gzip.open(p,'rt') as f: return {'json_records':sum(1 for line in f if line.strip() and json.loads(line) is not None)}
 if p.name.endswith('.json.gz'):
  with gzip.open(p,'rt') as f: json.load(f)
  return {'json':'valid','gzip':'valid'}
 if p.suffix=='.json':
  with p.open() as f: json.load(f)
  return {'json':'valid'}
 if p.suffix=='.zip':
  with zipfile.ZipFile(p) as z:
   assert z.testzip() is None, str(p)+' failed ZIP CRC'
   result={'zip_members':len(z.infolist()),'crc':'valid'}
   for name in z.namelist():
    if name.endswith('/manifest.json'):
     m=json.loads(z.read(name)); prefix=name.rsplit('/',1)[0]+'/'
     if isinstance(m.get('files'),dict):
      for n,e in m['files'].items():
       b=z.read(prefix+n); assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'],name+':'+n
      result['publisher_hashes_verified']=len(m['files'])
   if 'SHA256SUMS' in z.namelist():
    lines=z.read('SHA256SUMS').decode().splitlines()
    for line in lines:
     h,n=line.split(maxsplit=1);assert hashlib.sha256(z.read(n.lstrip('*'))).hexdigest()==h,n
    result['publisher_hashes_verified']=len(lines)
   return result
 if p.suffix=='.pdf':
  assert p.read_bytes().startswith(b'%PDF-'),str(p)+' is not a PDF'
  return {'pdf_header':'valid'}
 return None

def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--record',action='store_true',help='Create/update checksums after an intentional backup update');args=parser.parse_args()
 for d in DIRS:
  base=ROOT/d; current=inventory(base)
  if args.record:
   (base/'inventory.json').write_text(json.dumps({'files':current},indent=2)+'\n')
   (base/'SHA256SUMS').write_text(''.join(v['sha256']+'  '+k+'\n' for k,v in current.items()))
  else:
   expected=json.loads((base/'inventory.json').read_text())['files']
   assert current==expected,d+': files added, removed or changed'
  results={}
  for rel in current:
   result=validate(base/rel)
   if result: results[rel]=result
  manifest=json.loads((base/'backup-manifest.json').read_text())
  for row in manifest['downloads']:
   if row['status']=='unavailable':continue
   p=base/row['path'];assert p.stat().st_size==row['bytes'] and sha(p)==row['sha256'],row['path']
  (base/'verification.json').write_text(json.dumps({'files_checked':len(current),'format_checks':results},indent=2)+'\n')
  print(d+': '+str(len(current))+' files; checksums and format checks passed')
if __name__=='__main__':main()
