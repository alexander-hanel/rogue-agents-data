#!/usr/bin/env python3
"""Archive source articles, first-party assets, datasets and cited evidence.

Run from any directory. Existing files are retained; downloaded dataset changes are
saved beside them. No downloaded code is executed. Network access requires curl.
"""
import concurrent.futures as futures
import argparse
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import tempfile
from urllib.parse import urljoin, urlsplit, urldefrag, unquote

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {'collusion-wiki':'https://collusion.wiki/', 'rubyhack':'https://rubyhack.ai/',
 'kennethdegraff':'https://www.kennethdegraff.com/swarm',
 'transluce':'https://transluce.org/agent-activity','swarmtraces':'https://swarmtraces.org/',
 'openai-dns':'https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/',
 'metr':'https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/',
 'openai-hugging-face':'https://openai.com/index/hugging-face-incident-and-the-road-ahead/'}
# Direct links verified through the publisher page in the web reader. Keep these
# available even when the article itself cannot be downloaded with curl.
SUPPORTING_LINKS = {
 'openai-hugging-face': [
  'https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf',
  'https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/',
  'https://www.youtube.com/watch?v=87DyyMV0kCY',
 ]
}
NOW = dt.datetime.now(dt.timezone.utc).isoformat()

def digest(b): return hashlib.sha256(b).hexdigest()
class Page(HTMLParser):
 def __init__(self, base):
  super().__init__(); self.base=base; self.links=[]; self.assets=[]; self.text=[]; self.hidden=0
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag in ('script','style'): self.hidden+=1
  if tag=='a' and a.get('href') and not a['href'].startswith('#'):
   u=urljoin(self.base,a['href'])
   if u.startswith(('https://','http://')): self.links.append(urldefrag(u)[0])
  v=a.get('src') if tag in ('img','script','source') else a.get('href') if tag=='link' and any(x in a.get('rel','') for x in ('stylesheet','icon','preload')) else None
  if v and not v.startswith('data:'):
   u=urljoin(self.base,v)
   if urlsplit(u).netloc==urlsplit(self.base).netloc and not any(x in u for x in ('/insights/','ga.js')): self.assets.append(u)
  if tag in ('p','div','section','article','h1','h2','h3','h4','li','br','tr','pre'): self.text.append('\n')
 def handle_endtag(self,tag):
  if tag in ('script','style'): self.hidden=max(0,self.hidden-1)
  if tag in ('p','div','section','article','h1','h2','h3','h4','li','tr','pre'): self.text.append('\n')
 def handle_data(self,data):
  if not self.hidden: self.text.append(data)
 def readable(self): return re.sub(r'\n\s*\n+', '\n\n', ''.join(self.text)).strip()+'\n'

def parse(path,url):
 p=Page(url); p.feed(path.read_text(errors='replace')); return p

def filename(url):
 s=urlsplit(url); leaf=unquote(s.path.rstrip('/').split('/')[-1]) or 'index'
 leaf=re.sub(r'[^\w.-]+','-',leaf)[:110]
 if not Path(leaf).suffix: leaf += '.html'
 return digest(url.encode())[:10]+'-'+leaf

def fetch(task):
 directory,url,rel,kind=task; dest=ROOT/directory/rel; dest.parent.mkdir(parents=True,exist_ok=True)
 r={'url':url,'path':rel,'kind':kind,'checked_at':NOW}
 with tempfile.TemporaryDirectory() as tmp:
  out=Path(tmp)/'body'; headers=Path(tmp)/'headers'
  proc=subprocess.run(['curl','-sS','-L','--fail','--retry','1','--connect-timeout','15','--max-time','90','--max-filesize','536870912','-D',str(headers),'-o',str(out),'-w','%{http_code}\n%{url_effective}\n%{content_type}',url],capture_output=True,text=True)
  meta=proc.stdout.splitlines(); r.update(http_status=meta[0] if meta else None,final_url=meta[1] if len(meta)>1 else url,content_type=meta[2] if len(meta)>2 else '')
  if proc.returncode:
   r.update(status='unavailable',error=proc.stderr.strip()); return directory,r
  b=out.read_bytes()
  # Do not silently archive challenge pages as evidence or HTML as a dataset.
  is_html='text/html' in r['content_type'] or b.lstrip().lower().startswith((b'<!doctype html',b'<html'))
  if (kind=='dataset' and is_html) or (is_html and (b'Just a moment...' in b[:10000] or b'<title>Access Denied' in b[:10000])):
   r.update(status='unavailable',error='Server returned HTML/challenge instead of the requested resource'); return directory,r
  if rel.endswith('.json'):
   try: json.loads(b)
   except (ValueError, UnicodeDecodeError):
    r.update(status='unavailable',error='Response is not valid JSON'); return directory,r
  r.update(bytes=len(b),sha256=digest(b),status='downloaded')
  if dest.exists():
   if digest(dest.read_bytes())==r['sha256']: r['status']='verified-existing'
   else:
    dest=dest.with_name(dest.stem+'.'+r['sha256'][:12]+dest.suffix);r['path']=str(dest.relative_to(ROOT/directory));r['status']='downloaded-new-version'
  if not dest.exists(): dest.write_bytes(b)
  if 'text/html' in r['content_type'] and kind in ('article','reference','evidence'):
   page=parse(dest,url); txt=dest.with_suffix('.txt');txt.write_text('Source: '+url+'\nRetrieved: '+NOW+'\n\n'+page.readable())
  return directory,r

def run(tasks,results):
 tasks=list(dict.fromkeys(tasks))
 with futures.ThreadPoolExecutor(max_workers=8) as pool:
  for d,r in pool.map(fetch,tasks):
   results[d].append(r)
   print(r['status'],d,r['path'],flush=True)

def relevant(u):
 host=urlsplit(u).netloc; path=urlsplit(u).path
 return (host in ('socket.dev','thehackernews.com','blog.rubygems.org','fi-le.net','helppeer.app','cdn.openai.com','casar.house.gov')
  or host=='metr.org' and (path.startswith('/blog/') or path.endswith('.pdf'))
  or u in ('https://arxiv.org/abs/2605.11086',
   'https://huggingface.co/blog/agent-intrusion-technical-timeline',
   'https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing',
   'https://www.anthropic.com/research/multiagent-systems',
   'https://abstatisticalconsulting.substack.com/p/brief-notes-on-the-openaihugging',
   'https://www.lesswrong.com/posts/ChDH335ckdvpxXaXX/model-organisms-of-misalignment-the-case-for-a-new-pillar-of-1')
  or host in ('openai.com','deploymentsafety.openai.com') and path not in ('/','/policies/terms-of-use/','/policies/privacy-policy/','/chatgpt-user.json',)
  or host=='web.archive.org'
  or host=='my.diffend.io' and path.startswith('/gems/')
  or host.endswith('urlquery.net') and '/report/' in path
  or host=='collusion.wiki' and path.startswith('/explorer/page/')
  or host=='raw.githubusercontent.com' and 'fbi-cde/crime-data-frontend/' in path
  or host=='github.com' and 'rubygems/rubygems.org/' in path)

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--source',choices=SOURCES,help='Download or retry only this source')
 parser.add_argument('--retry-failed',action='store_true',help='Retry only unavailable downloads and retain previous results')
 parser.add_argument('--cited-report-json',action='store_true',help='Back up raw JSON for the URLQuery reports cited in the Transluce article')
 args=parser.parse_args()
 selected={d:u for d,u in SOURCES.items() if not args.source or d==args.source}
 if args.cited_report_json:
  d='transluce';path=ROOT/d/'backup-manifest.json';manifest=json.loads(path.read_text())
  urls={r['url'] for r in manifest['downloads'] if r['status']!='unavailable' and urlsplit(r['url']).netloc=='urlquery.net' and re.fullmatch('/report/[0-9a-f-]+',urlsplit(r['url']).path)}
  results={d:[]}
  run([(d,u+'/json','data/cited-reports/'+u.rsplit('/',1)[1]+'.json','dataset') for u in sorted(urls)],results)
  replaced={r['url'] for r in results[d]}
  manifest['downloads']=[r for r in manifest['downloads'] if r['url'] not in replaced]+results[d]
  path.write_text(json.dumps(manifest,indent=2)+'\n')
  return
 if args.retry_failed:
  for d in selected:
   path=ROOT/d/'backup-manifest.json'; manifest=json.loads(path.read_text())
   for i,row in enumerate(manifest['downloads']):
    if row['status']!='unavailable': continue
    url=row['url']
    if 'huggingface.co/datasets/' in url: url=url.replace('/blob/','/resolve/')
    if urlsplit(url).netloc in ('1.urlquery.net','search.urlquery.net'):
     url='https://urlquery.net'+urlsplit(url).path
    _,new=fetch((d,url,row['path'],row['kind']))
    new['previous_attempts']=row.get('previous_attempts',[])+[{k:v for k,v in row.items() if k!='previous_attempts'}]
    manifest['downloads'][i]=new
    print(new['status'],d,url,flush=True)
   path.write_text(json.dumps(manifest,indent=2)+'\n')
  return
 results={d:[] for d in selected}
 extra=[
  ('collusion-wiki','https://collusion.wiki/additional-findings','article/additional-findings.html','article'),
  ('collusion-wiki','https://collusion.wiki/explorer/download','article/download.html','article')]
 run([(d,u,'article/index.html','article') for d,u in selected.items()]+[t for t in extra if t[0] in selected],results)
 tasks=[]
 for d,rows in results.items():
  links=list(SUPPORTING_LINKS.get(d, []))
  for row in list(rows):
   if row['status']=='unavailable': continue
   p=parse(ROOT/d/row['path'],row['url']);links+=p.links
   tasks += [(d,u,'article/assets/'+filename(u),'asset') for u in p.assets]
  (ROOT/d/'article/links.json').write_text(json.dumps(sorted(set(links)),indent=2)+'\n')
  for u in sorted(set(links)):
   if relevant(u) and u.rstrip('/')!=SOURCES[d].rstrip('/'): tasks.append((d,u,'references/'+filename(u),'reference'))
   if u.endswith(('.zip','.jsonl.gz','.json.gz','.csv','.tar.gz')):
    tasks.append((d,u,'data/'+unquote(urlsplit(u).path.split('/')[-1]),'dataset'))
 # Public paste corpus cited by RubyHack; no separate bulk dataset on the Swarm essay.
 run(tasks,results)
 for d,rows in results.items():
  manifest={'source_url':SOURCES[d],'checked_at':NOW,'scope':'Source articles, their directly linked first-party assets, public download bundles, and selected directly cited articles/evidence. No recursive crawl of citations or operational endpoints.','downloads':rows}
  (ROOT/d/'backup-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print('Completed',sum(len(r) for r in results.values()),'requests;',sum(r['status']=='unavailable' for rows in results.values() for r in rows),'unavailable',flush=True)
if __name__=='__main__':main()
