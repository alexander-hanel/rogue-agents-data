'use strict';
// lay-reader story scenes for the inline players: pseudo-code, no real service names
const PSEUDO = ['job   = name_from_url()', 'reply = ask_server("result for " + job)', 'pixels = draw_as_squares(reply)', 'show(pixels)'];
const IDS = ['k7Qx','p2Lm','z9Ta','d4Wn'], END_ID = 'e0Nd';
const ENC = PSEUDO.map(l => btoa(l));
const SHORT = id => 'short.link/' + id;

// a little white web page with a title bar
const site = (x,y,w,h,url,inner,o={}) => G(R(x,y,w,h,{fill:COL.page,stroke:o.stroke||COL.gray,sw:1.5,rx:6}) + R(x,y,w,22,{fill:COL.chrome,rx:6}) + T(x+10,y+15,url,{size:10,mono:true,fill:COL.mute}) + inner,{op:o.op});
// a returned photo: same page, with a camera frame around it
const photo = (x,y,w,h,inner,o={}) => G(R(x-6,y-6,w+12,h+12,{fill:'none',stroke:COL.green,sw:2,rx:8,dash:'6 4'}) + R(x,y,w,h,{fill:COL.page,stroke:'none',rx:4}) + inner,{op:o.op});

// PART 1, row A: normal use
function diagramRowA() {
  let s = T(40,40,'NORMAL USE  ·  the agent asks for a photo of a web page',{size:13,bold:true,fill:COL.mute});
  s += actorAgent(110,150,{hl:true});
  s += ARROW(165,135,275,135) + T(220,120,'"photograph',{anchor:'middle',size:11,fill:COL.mute}) + T(220,152,'news-site.com"',{anchor:'middle',size:11,fill:COL.mute});
  s += actorService(370,150,{hl:true});
  s += ARROW(435,135,520,135) + T(478,120,'opens it',{anchor:'middle',size:11,fill:COL.mute});
  const page = T(560,140,'Headline',{size:14,bold:true,fill:COL.pageInk}) + L(560,152,680,152,{stroke:COL.pageRule,sw:3}) + L(560,164,660,164,{stroke:COL.pageRule2,sw:3});
  s += site(530,95,180,95,'news-site.com',page);
  s += ARROW(720,150,790,150,{stroke:COL.green}) + T(755,138,'photo',{anchor:'middle',size:11,fill:COL.mute});
  s += photo(805,100,120,75,T(825,130,'Headline',{size:9,bold:true,fill:COL.pageInk}) + L(825,140,905,140,{stroke:COL.pageRule,sw:2}));
  s += T(865,200,'back to the agent',{anchor:'middle',size:11,fill:COL.mute});
  return s;
}

// PART 1, row B: the trick
function diagramRowB() {
  let s = L(40,240,920,240,{stroke:COL.line,sw:1});
  s += T(40,275,'THE TRICK  ·  the link carries a tiny program instead of a page address',{size:13,bold:true,fill:COL.yellow});
  s += actorAgent(110,400,{hl:true});
  s += ARROW(165,385,275,385,{stroke:COL.yellow}) + T(220,370,'"photograph',{anchor:'middle',size:11,fill:COL.mute}) + T(220,402,'this link"',{anchor:'middle',size:11,fill:COL.mute});
  s += R(40,470,175,34,{fill:COL.box,stroke:COL.yellow,rx:6}) + T(127,491,'the link = show("test")',{anchor:'middle',size:12,mono:true,fill:COL.yellow}) + L(200,470,220,400,{stroke:COL.yellow,sw:1,dash:'3 3'});
  s += actorService(370,400,{hl:true,sub:'its browser runs the program'});
  s += ARROW(435,385,520,385,{stroke:COL.yellow}) + T(478,370,'opens it',{anchor:'middle',size:11,fill:COL.mute});
  s += site(530,345,180,95,'(the link)',T(620,405,'test',{anchor:'middle',size:30,mono:true,bold:true,fill:COL.pageInk}),{stroke:COL.yellow});
  s += ARROW(720,400,790,400,{stroke:COL.green}) + T(755,388,'photo',{anchor:'middle',size:11,fill:COL.mute});
  s += photo(805,350,120,75,T(865,398,'test',{anchor:'middle',size:22,mono:true,bold:true,fill:COL.pageInk}));
  
  return s;
}
SCENES.diagram = () => ({svg: diagramRowA() + diagramRowB(), cap:'A screenshot service will photograph any link. If the link is a program, the photo is its output.'});

SCENES.linkOverview = () => {
  const payloadColor = '#8b1520';
  let s = '';
  [40,325,610].forEach((x,i) => {
    s += site(x,75,210,74,'',T(x+18,91,'URL',{size:14,mono:true,fill:COL.mute}));
    s += L(x+105,97,x+105,149,{stroke:COL.line,sw:1});
    s += T(x+52.5,128,'Content',{size:14,mono:true,anchor:'middle',fill:COL.purple});
    s += T(x+157.5,128,'Next URL',{size:14,mono:true,anchor:'middle',fill:COL.yellow});
    s += ARROW(x+210,123,x+273,123,{stroke:COL.yellow,sw:1.5});
    s += ARROW(x+52.5,149,440+i*40,225,{stroke:COL.purple,sw:1.5});
  });
  s += T(908,134,'…',{size:40,bold:true,anchor:'middle',fill:COL.ink});
  s += T(480,254,'Decode',{size:20,bold:true,anchor:'middle',fill:COL.ink});
  s += ARROW(480,272,480,304,{stroke:payloadColor,sw:1.5});
  s += R(400,316,160,62,{fill:COL.box,stroke:payloadColor,sw:1.5,rx:6});
  s += T(480,359,'</>',{size:32,mono:true,bold:true,anchor:'middle',fill:payloadColor});
  s += T(480,406,'Payload',{size:20,bold:true,anchor:'middle',fill:COL.ink});
  return {svg:G(s,{tf:'translate(0,-50)'}), cap:''};
};

// PART 2a: the program, cut into chunks
SCENES.chunks = p => {
  let s = T(480,40,'the program is too long for one link, so cut it up',{anchor:'middle',size:16,bold:true});
  const a = win(p,0,.3), b = win(p,.35,1);
  s += G(PANEL(230,70,500,130,'THE PROGRAM (pseudo-code)',{tcol:COL.blue}) + CODE(250,105,PSEUDO,{size:14,lh:24,fill:COL.blue}),{op:a});
  PSEUDO.forEach((l,i)=>{ const t = clamp(b*5-i), x = 60+i*220, y = lerp(105+i*24,300,ease(t));
    s += G(R(x,y-22,200,44,{fill:COL.box,stroke:COL.blue,rx:6,op:t}) + T(x+10,y-4,`chunk ${i+1}`,{size:11,fill:COL.mute,op:t}) + T(x+10,y+12,l.slice(0,26),{size:11,mono:true,fill:COL.blue,op:t}),{op:Math.max(a,t)}); });
  s += G(T(480,400,'four pieces, each short enough to fit in one link',{anchor:'middle',size:14,fill:COL.mute}),{op:win(p,.8,1)});
  return {svg:s, cap:'Real chains used dozens or hundreds of chunks. Four is enough to see the idea.'};
};

// PART 2b: encode each chunk, add "then load next", shorten, get an ID (last chunk first)
SCENES.encode = p => {
  let s = T(480,40,'encode each chunk, add a pointer to the next one, shorten it',{anchor:'middle',size:16,bold:true});
  const k = p*5.2;                                  // build rows from the last chunk backwards
  PSEUDO.forEach((l,i)=>{ const order = 3-i, t = clamp(k-order), y = 90+i*105, next = i<3?IDS[i+1]:END_ID;
    s += G(R(40,y,180,70,{fill:COL.box,stroke:COL.blue,rx:6}) + T(50,y+20,`chunk ${i+1}`,{size:11,fill:COL.mute}) + T(50,y+42,l.slice(0,24),{size:11,mono:true,fill:COL.blue}) +
      ARROW(228,y+35,268,y+35,{t:clamp(t*2)}) + T(248,y+22,'encode',{anchor:'middle',size:9,fill:COL.mute}) +
      R(275,y,380,70,{fill:COL.box,stroke:COL.purple,rx:6,op:clamp(t*2-.5)}) + T(285,y+20,'encoded  +  "then load ' + next + '"',{size:11,fill:COL.mute,op:clamp(t*2-.5)}) + T(285,y+42,ENC[i].slice(0,34)+'…',{size:11,mono:true,fill:COL.purple,op:clamp(t*2-.5)}) +
      ARROW(663,y+35,703,y+35,{t:clamp(t*2-1)}) + T(683,y+22,'shorten',{anchor:'middle',size:9,fill:COL.mute}) +
      R(710,y,210,70,{fill:COL.box,stroke:COL.yellow,rx:6,op:clamp(t*2-1.3)}) + T(720,y+20,'short link',{size:11,fill:COL.mute,op:clamp(t*2-1.3)}) + T(720,y+44,SHORT(IDS[i]),{size:14,mono:true,bold:true,fill:COL.yellow,op:clamp(t*2-1.3)}),{op:clamp(t*3)}); });
  s += G(T(480,540,'the last chunk is shortened first, so its ID can be written into the chunk before it',{anchor:'middle',size:13,fill:COL.mute}),{op:win(p,.15,.4)});
  return {svg:s, cap:'Every short link holds one chunk plus the name of the next link. The first link is all the agent needs to send.'};
};

// PART 2c: the browser walks the chain, storing chunks as it goes
SCENES.walk = p => {
  let s = T(480,40,'the browser follows the links and keeps what it finds',{anchor:'middle',size:16,bold:true}) + T(480,62,'each short link redirects the browser to its chunk, which ends with: now load the next one',{anchor:'middle',size:11,fill:COL.mute});
  const k = p*5.5;
  [...IDS, END_ID].forEach((id,i)=>{ const x = 90+i*195, t = clamp(k-i), last = i===4;
    if (i>0) s += ARROW(x-135,110,x-60,110,{t:clamp(k-i+.6),stroke:COL.gray});
    s += G(R(x-60,90,120,40,{fill:COL.box,stroke:last?COL.red:COL.yellow,rx:6}) + T(x,115,SHORT(id),{anchor:'middle',size:12,mono:true,bold:true}),{op:t});
    if (!last) s += T(x,150,`stores chunk ${i+1}`,{anchor:'middle',size:10,fill:COL.mute,op:clamp(t*2-1)}); });
  s += actorService(480,250,{hl:true,sub:'one page, one growing memory'});
  const stored = Math.min(4, Math.floor(k)), buf = ENC.slice(0,stored).join('');
  s += R(80,340,800,150,{fill:COL.memory,stroke:COL.yellow,sw:1.2,rx:8}) + T(96,362,'stored so far',{size:13,fill:COL.yellow,bold:true}) + T(864,362,`${stored} of 4 chunks`,{anchor:'end',size:12,fill:COL.mute});
  s += CODE(96,388,chunk(buf,88),{size:12,lh:18,fill:COL.codeAlt});
  s += G(T(480,530,'last link reached: no more chunks, just an instruction to put it all together',{anchor:'middle',size:13,fill:COL.red}),{op:clamp(k-4)});
  return {svg:s, cap:'Each link adds its chunk to the same page and sends the browser on to the next.'};
};

// PART 2d: join, decode, run
SCENES.assemble = p => {
  let s = T(480,40,'at the end: one huge string, decoded back into the program, and run',{anchor:'middle',size:16,bold:true});
  const a = win(p,0,.3), b = win(p,.3,.6), c = win(p,.6,1), all = ENC.join('');
  s += G(T(80,80,'the huge string',{size:12,fill:COL.yellow}) + CODE(80,102,chunk(all,88),{size:12,lh:18,fill:COL.codeAlt}),{op:a});
  s += G(ARROW(480,165,480,200,{t:b}) + T(500,190,'decode',{size:12,fill:COL.mute}) + PANEL(230,210,500,130,'THE ORIGINAL PROGRAM, IN FULL',{tcol:COL.blue}) + CODE(250,245,PSEUDO,{size:14,lh:24,fill:COL.blue}),{op:b});
  s += G(ARROW(480,345,480,380,{t:c}) + T(500,370,'execute',{size:12,fill:COL.mute}) + actorService(480,440,{hl:true,sub:'the borrowed browser is now running the agent’s program'}),{op:c});
  s += G(T(480,545,'a program that never fit in a single link now runs in full',{anchor:'middle',size:14,bold:true}),{op:win(p,.85,1)});
  return {svg:s, cap:'Nothing was compiled. Text was collected, decoded and handed to the browser.'};
};

// PART 3a: the program runs line by line, talks to the server, gets data back
SCENES.run = p => {
  let s = T(480,40,'the program runs inside the borrowed browser',{anchor:'middle',size:16,bold:true});
  const k = p*4.5, line = Math.min(3, Math.floor(k));
  s += PANEL(40,70,420,140,'RUNNING',{tcol:COL.blue});
  PSEUDO.forEach((l,i)=>{ const on = i===line; s += (on?R(52,96+i*24,396,22,{fill:COL.hlRow,rx:4}):'') + T(60,112+i*24,l,{size:13,mono:true,fill:on?COL.ink:COL.mute}); });
  s += actorService(200,330,{hl:true}) + actorServer(760,330,{hl:k>1.2,sub:'has the answers'});
  s += G(T(200,420,'job = demo-17',{anchor:'middle',size:13,mono:true,fill:COL.yellow}),{op:clamp(k-0.5)});
  s += ARROW(265,310,715,310,{t:clamp(k-1.2),stroke:COL.blue}) + T(490,296,'"result for demo-17?"',{anchor:'middle',size:12,fill:COL.blue,op:clamp(k-1.2)});
  s += ARROW(715,345,265,345,{t:clamp(k-1.9),stroke:COL.green}) + T(490,372,SAMPLE,{anchor:'middle',size:13,mono:true,fill:COL.green,op:clamp(k-1.9)});
  s += G(T(480,480,'the reply is text inside the browser. Only a photo can leave. So: draw it.',{anchor:'middle',size:15,bold:true}),{op:clamp(k-3)});
  return {svg:s, cap:'The reply is illustrative. The request path is what the recovered programs do.'};
};

// ===== PART 2, one continuous scene: cut → encode → hop → store → decode → run =====
const CARD_Y = i => 62 + i*46;               // snippet cards, right column
const LINE_Y = i => 88 + i*26;               // program lines, left panel
const STORE = {x:40, y:470, w:880, h:95};
const BROWSER = {x:400, y:250, w:520, h:170};
function c2Program(op) {
  return G(PANEL(40,50,300,140,'THE PROGRAM (pseudo-code)',{tcol:COL.blue}) + PSEUDO.map((l,i)=>T(56,LINE_Y(i),l,{size:11.5,mono:true,fill:COL.blue})).join(''),{op});
}
// one snippet card: plain text that crossfades into its encoded form, plus its short-link label
function c2Card(i, appear, enc, hl) {
  const y = CARD_Y(i), next = i<3 ? SHORT(IDS[i+1]) : SHORT(END_ID);
  return G(R(400,y,520,38,{fill:hl?COL.hlBox:COL.box,stroke:hl?COL.yellow:COL.blue,sw:hl?2:1.5,rx:6}) +
    T(412,y+24,PSEUDO[i],{size:11.5,mono:true,fill:COL.blue,op:1-enc}) +
    T(412,y+24,ENC[i].slice(0,30)+'…',{size:11.5,mono:true,fill:COL.purple,op:enc}) +
    T(700,y+16,'saved as '+SHORT(IDS[i]),{size:10,mono:true,fill:COL.yellow,op:enc}) +
    T(700,y+30,'then load '+next,{size:10,mono:true,fill:COL.mute,op:enc}),{op:appear});
}

// the borrowed browser window and the memory store
function c2Browser(url, body, op=1) {
  const b = BROWSER;
  return G(R(b.x,b.y,b.w,b.h,{fill:COL.well,stroke:COL.blue,sw:2,rx:8}) + R(b.x,b.y,b.w,26,{fill:COL.chrome,rx:8}) +
    C(b.x+14,b.y+13,4,{fill:COL.red}) + C(b.x+28,b.y+13,4,{fill:COL.yellow}) + C(b.x+42,b.y+13,4,{fill:COL.green}) +
    T(b.x+60,b.y+17,url,{size:11,mono:true,fill:COL.mute}) + T(b.x+b.w/2,b.y-8,"the screenshot service's browser",{anchor:'middle',size:11,fill:COL.mute}) + body,{op});
}
function c2Store(count, hl) {
  const s = STORE, txt = ENC.slice(0,count).join('');
  return R(s.x,s.y,s.w,s.h,{fill:COL.memory,stroke:COL.yellow,sw:hl?2.5:1.2,rx:8,dash:hl?'':'5 4'}) +
    T(s.x+14,s.y+20,'MEMORY  ·  snippets the browser holds on to between hops',{size:11,bold:true,fill:COL.yellow}) +
    T(s.x+s.w-14,s.y+20,`${count} of 4`,{anchor:'end',size:11,fill:COL.mute}) +
    CODE(s.x+14,s.y+44,chunk(txt,96),{size:11,lh:16,fill:COL.codeAlt});
}
// a flying chip carrying snippet i from (x1,y1) to (x2,y2)
function c2Chip(i,x1,y1,x2,y2,t,op=1) {
  const x = lerp(x1,x2,ease(t)), y = lerp(y1,y2,ease(t));
  return G(R(x,y,250,26,{fill:COL.hlBox,stroke:COL.purple,rx:5}) + T(x+8,y+17,ENC[i].slice(0,30)+'…',{size:11,mono:true,fill:COL.purple}),{op});
}

// hop i, local progress u in 0..1: load link → snippet + next link appear in the browser → snippet drops into memory
function c2Hop(i, u) {
  const b = BROWSER, next = i<3 ? SHORT(IDS[i+1]) : SHORT(END_ID);
  let s = '', body = '';
  const arrive = win(u,0,.3), read = win(u,.3,.5), drop = win(u,.55,.9);
  // chip flies from its card into the browser body
  if (u < .3) s += c2Chip(i, 412, CARD_Y(i)+6, b.x+20, b.y+50, arrive);
  else if (u < .55) body += c2Chip(i, b.x+20, b.y+50, b.x+20, b.y+50, 1);
  else s += c2Chip(i, b.x+20, b.y+50, STORE.x+14+Math.min(i*210,620), STORE.y+34, drop, 1-win(u,.85,1));
  body += T(b.x+20,b.y+110,'this page says:  keep that snippet, then load '+next,{size:12,mono:true,fill:COL.ink,op:read});
  body += T(b.x+20,b.y+140,i<3?'→ the browser follows the link, but the snippet stays in memory':'→ last snippet. The next link is the finisher.',{size:11,fill:COL.mute,op:win(u,.5,.7)});
  return {svg:s, body, url:'loading '+SHORT(IDS[i])+(u>.9&&i<3?'  →  '+next:'')};
}

const HOP0 = .40, HOPW = .11;                    // hops occupy p in [0.40, 0.84]
SCENES.chain2 = p => {
  const b = BROWSER;
  let s = c2Program(win(p,0,.06)), over = '', body = '', url = 'about:blank';
  const hopIdx = Math.floor((p-HOP0)/HOPW), inHops = p>=HOP0 && p<HOP0+4*HOPW;
  for (let i=0;i<4;i++) { const t = win(p,.06+i*.045,.10+i*.045);
    s += ARROW(342,LINE_Y(i)-4,396,CARD_Y(i)+19,{t,stroke:COL.blue,sw:1.5});
    s += c2Card(i, t, win(p,.26+i*.02,.32+i*.02), inHops && hopIdx===i); }
  s += G(wrapWords('Each snippet is encoded and saved behind its own short link. The name of the next link is written inside it, so one link leads to the next.',46).map((l,i)=>T(40,225+i*17,l,{size:11.5,fill:COL.mute})).join(''),{op:win(p,.30,.38)});
  let stored = 0;
  if (inHops) { const h = c2Hop(hopIdx, (p-HOP0-hopIdx*HOPW)/HOPW); over += h.svg; body += h.body; url = h.url; stored = hopIdx + ((p-HOP0-hopIdx*HOPW)/HOPW > .9 ? 1 : 0); }
  if (p >= HOP0+4*HOPW) { stored = 4; const e = win(p,.84,.92), r = win(p,.92,1); url = 'loading '+SHORT(END_ID);
    body += T(b.x+20,b.y+50,'this page says:  join everything in memory, decode it, run it',{size:12,mono:true,fill:COL.red,op:e});
    over += G(ARROW(480,STORE.y-4,480,b.y+b.h+4,{t:e,stroke:COL.yellow,sw:2}) + T(495,STORE.y-20,'decode',{size:11,fill:COL.yellow}),{op:e});
    body += G(R(b.x+20,b.y+70,300,90,{fill:COL.tint,stroke:COL.blue,rx:6}) + PSEUDO.map((l,i)=>T(b.x+30,b.y+90+i*20,l,{size:10.5,mono:true,fill:COL.blue})).join('') + T(b.x+340,b.y+115,'the whole program,',{size:13,bold:true}) + T(b.x+340,b.y+135,'now running here',{size:13,bold:true,fill:COL.green}),{op:r}); }
  s += c2Browser(url, body, win(p,.36,.42)) + G(c2Store(stored, p>=HOP0+4*HOPW), win(p,.36,.42)) + over;
  return {svg:s, cap:'Cut, encode, shorten, then hop: every link hands over one snippet and the name of the next. Memory survives the hops.'};
};

// ===== PART 3a: joined snippets → program → request → reply (no code panel) =====
SCENES.run2 = p => {
  const a = win(p,0,.2), b = win(p,.2,.4), c = win(p,.4,.6), d = win(p,.6,.8), e = win(p,.8,1);
  let s = '';
  s += G(R(60,60,840,40,{fill:COL.memory,stroke:COL.yellow,rx:6}) + T(72,85,ENC.join('').slice(0,100)+'…',{size:11,mono:true,fill:COL.codeAlt}),{op:a});
  s += G(ARROW(480,104,480,134,{t:b,stroke:COL.yellow}) + T(500,124,'decode',{size:11,fill:COL.mute}),{op:b});
  s += G(R(300,140,360,44,{fill:COL.tint,stroke:COL.blue,rx:6}) + T(480,167,'the program, running in the borrowed browser',{anchor:'middle',size:12,fill:COL.blue}),{op:b});
  s += actorService(200,330,{hl:true}) + actorServer(760,330,{hl:c>0.5,sub:'has the answers'});
  s += ARROW(265,310,715,310,{t:c,stroke:COL.blue}) + T(490,296,'"what is the result for job demo-17?"',{anchor:'middle',size:12,fill:COL.blue,op:c});
  s += ARROW(715,345,265,345,{t:d,stroke:COL.green}) + T(490,372,SAMPLE,{anchor:'middle',size:13,mono:true,fill:COL.green,op:d});
  
  return {svg:s, cap:'The reply is illustrative. The request is what the recovered programs do.'};
};

// ===== PART 3b: byte → bits → four gray squares, looping over the first characters =====
const LOOP_N = 10;
const paced = (p, n, slow=3, share=.6) => p < share ? p/share*slow : slow + (p-share)/(1-share)*(n-slow);
SCENES.bytes = p => {
  let s = '';
  const k = paced(win(p,0,.92), LOOP_N, 3, .6), i = Math.min(LOOP_N-1, Math.floor(k)), u = clamp(k-i);
  const ch = SAMPLE[i], byte = ch.charCodeAt(0), bits = byte.toString(2).padStart(8,'0');
  const pairs = [0,1,2,3].map(j=>bits.slice(j*2,j*2+2)), grays = pairs.map(pr=>parseInt(pr,2)*64+32);
  s += T(480,90,SAMPLE,{anchor:'middle',size:22,mono:true,fill:COL.mute}) + R(480-SAMPLE.length*6.6+i*13.2-1,70,14,28,{fill:'none',stroke:COL.green,sw:2,rx:3});
  s += G(T(480,150,`'${ch}'   →   byte ${byte}   →   ${bits.slice(0,2)} ${bits.slice(2,4)} ${bits.slice(4,6)} ${bits.slice(6,8)}`,{anchor:'middle',size:20,mono:true}),{op:win(u,0,.25)});
  pairs.forEach((pr,j)=>{ const x = 330+j*100, t = win(u,.25+j*.1,.45+j*.1);
    s += G(ARROW(x+40,165,x+40,195,{t}) + T(x+40,222,pr,{anchor:'middle',size:18,mono:true}) + R(x+10,235,60,60,{fill:grayHex(grays[j]),stroke:COL.line,rx:4}) + T(x+40,315,`gray ${grays[j]}`,{anchor:'middle',size:11,fill:COL.mute}),{op:t}); });
  // the growing strip of squares at the bottom, 4 per finished character
  const done = i + (u>.9?1:0);
  s += T(60,380,'the picture so far',{size:12,fill:COL.mute}) + T(900,380,`${done*4} squares from ${done} characters`,{anchor:'end',size:11,fill:COL.mute});
  for (let c=0;c<done;c++){ const bb = SAMPLE.charCodeAt(c); for (let j=0;j<4;j++){ const g = ((bb>>(6-j*2))&3)*64+32; s += R(60+(c*4+j)*22,395,20,20,{fill:grayHex(g),stroke:COL.edge,sw:1,rx:2}); } }
  
  return {svg:s, cap:'The four gray levels and the bit-pair rule come straight from the recovered encoder.'};
};

// ===== PART 2 v3: three arrow stages at once, then mechanical hops =====
const ROW = i => 62 + i*40;
const BR = {x:60, y:250, w:500, h:150};                  // browser
const MEM = {x:60, y:440, w:860, h:120};                 // memory store
const CH = {x:640, y:250};                               // hop chain diagram
function c3Intro(p) {
  const a = win(p,0,.06), b = win(p,.04,.11), c = win(p,.08,.15), d = win(p,.12,.19);
  let s = G(PANEL(40,40,270,190,'PROGRAM',{tcol:COL.blue}) + PSEUDO.map((l,i)=>T(52,ROW(i)+20,l,{size:10.5,mono:true,fill:COL.blue})).join(''),{op:a});
  s += T(340,52,'CUT',{size:10,bold:true,fill:COL.mute,op:b}) + T(600,52,'ENCODE',{size:10,bold:true,fill:COL.mute,op:c}) + T(820,52,'SHORTEN',{size:10,bold:true,fill:COL.mute,op:d});
  for (let i=0;i<4;i++) { const y = ROW(i);
    s += ARROW(312,y+15,336,y+15,{t:b,stroke:COL.blue}) + G(R(340,y,215,30,{fill:COL.box,stroke:COL.blue,rx:5}) + T(348,y+19,PSEUDO[i].slice(0,27),{size:10.5,mono:true,fill:COL.blue}),{op:b});
    s += ARROW(560,y+15,596,y+15,{t:c,stroke:COL.purple}) + G(R(600,y,190,30,{fill:COL.box,stroke:COL.purple,rx:5}) + T(608,y+19,ENC[i].slice(0,24)+'…',{size:10.5,mono:true,fill:COL.purple}),{op:c});
    s += ARROW(795,y+15,816,y+15,{t:d,stroke:COL.yellow}) + G(R(820,y,100,30,{fill:COL.box,stroke:COL.yellow,rx:5}) + T(870,y+19,IDS[i],{anchor:'middle',size:12,mono:true,bold:true,fill:COL.yellow}),{op:d}); }
  return s;
}

// browser with an address bar; body is caller-supplied
function c3Browser(url, body, flash, op) {
  const b = BR;
  return G(R(b.x,b.y,b.w,b.h,{fill:COL.well,stroke:COL.blue,sw:2,rx:8}) + R(b.x,b.y,b.w,28,{fill:COL.chrome,rx:8}) +
    R(b.x+50,b.y+6,b.w-60,16,{fill:flash>0?`rgba(247,217,76,${0.35*flash})`:COL.well,stroke:COL.line,rx:4}) + T(b.x+58,b.y+18,url,{size:11,mono:true,fill:COL.ink}) +
    T(b.x+b.w/2,b.y-8,'borrowed browser',{anchor:'middle',size:11,fill:COL.mute}) + body,{op});
}
// the hop chain on the right: IDs joined by arrows, current one lit
function c3Chain(cur, op) {
  const ids = [...IDS, END_ID];
  return G(T(CH.x,CH.y-8,'hops',{size:11,fill:COL.mute}) + ids.map((id,i)=>{ const y = CH.y+8+i*30, on = i===cur, done = i<cur;
    return (i>0?ARROW(CH.x+60,y-14,CH.x+60,y-2,{stroke:done||on?COL.yellow:COL.gray,sw:1.5}):'') +
      R(CH.x+15,y,90,22,{fill:on?COL.yellowTint:COL.box,stroke:on?COL.yellow:(done?COL.yellow:COL.gray),sw:on?2:1,rx:4}) + T(CH.x+60,y+15,id,{anchor:'middle',size:11,mono:true,bold:on,fill:on||done?COL.yellow:COL.mute}); }).join('') +
    T(CH.x+130,CH.y+44,'each page: one snippet',{size:10.5,fill:COL.mute}) + T(CH.x+130,CH.y+60,'+ goto next link',{size:10.5,fill:COL.mute}),{op});
}
function c3Store(count, hl, op) {
  const m = MEM, txt = ENC.slice(0,count).join('');
  return G(R(m.x,m.y,m.w,m.h,{fill:COL.memory,stroke:COL.yellow,sw:hl?2.5:1.2,rx:8,dash:hl?'':'5 4'}) + T(m.x+14,m.y+20,'MEMORY',{size:11,bold:true,fill:COL.yellow}) +
    T(m.x+m.w-14,m.y+20,`${count} of 4 snippets`,{anchor:'end',size:11,fill:COL.mute}) + CODE(m.x+14,m.y+44,chunk(txt,100),{size:11,lh:16,fill:COL.codeAlt}),{op});
}

// one hop, u in 0..1: page shows [snippet] [goto next]; snippet drops to memory; ID jumps to the address bar; refresh
function c3Hop(i, u) {
  const b = BR, next = i<3 ? IDS[i+1] : END_ID, show = win(u,0,.15);
  const drop = win(u,.2,.5), jump = win(u,.55,.8), flash = u>.8 ? 1-win(u,.8,1) : 0;
  const sx = b.x+20, sy = b.y+50, gx = b.x+20, gy = b.y+95;
  let body = '', over = '';
  // snippet chip: sits in the page, highlights, then drops into memory
  const x1 = lerp(sx, MEM.x+14, ease(drop)), y1 = lerp(sy, MEM.y+30+Math.min(i,3)*0, ease(drop)), sop = 1 - win(u,.45,.5);
  over += G(R(x1,y1,300,26,{fill:drop>0?COL.purpleTint:COL.box,stroke:COL.purple,sw:u>.15&&drop<1?2:1,rx:5}) + T(x1+8,y1+17,ENC[i].slice(0,36)+'…',{size:11,mono:true,fill:COL.purple}),{op:show*sop});
  // goto chip: sits in the page, highlights, then jumps into the address bar
  const x2 = lerp(gx, b.x+50, ease(jump)), y2 = lerp(gy, b.y+6, ease(jump)), gop = 1 - win(u,.78,.82);
  over += G(R(x2,y2,150,26,{fill:jump>0?COL.yellowTint:COL.box,stroke:COL.yellow,sw:u>.5&&jump<1?2:1,rx:5}) + T(x2+8,y2+17,'goto '+next,{size:11,mono:true,fill:COL.yellow}),{op:show*gop});
  body += T(b.x+20,b.y+135,i<3?'':'',{size:10,fill:COL.mute});
  return {over, body, url:'short.link/'+(u>.8?next:IDS[i]), flash, stored:i+(u>.5?1:0)};
}

const H0 = .22, HW = .14;                                 // four hops in p ∈ [0.22, 0.78]
SCENES.chain3 = p => {
  const b = BR;
  let s = c3Intro(p), over = '', body = '', url = '', flash = 0, stored = 0, cur = -1;
  const ui = win(p,.17,.22);
  const hi = Math.floor((p-H0)/HW), inHops = p>=H0 && p<H0+4*HW;
  if (inHops) { const h = c3Hop(hi, (p-H0-hi*HW)/HW); over = h.over; body = h.body; url = h.url; flash = h.flash; stored = h.stored; cur = hi; }
  else if (p >= H0+4*HW) { stored = 4; cur = 4; url = 'short.link/'+END_ID; const e = win(p,.78,.88), r = win(p,.88,1);
    body += G(R(b.x+20,b.y+45,200,26,{fill:COL.redTint,stroke:COL.red,rx:5}) + T(b.x+28,b.y+62,'decode memory, run it',{size:11,mono:true,fill:COL.red}),{op:e});
    over += G(ARROW(300,MEM.y-4,300,b.y+b.h+4,{t:e,stroke:COL.yellow,sw:2.5}),{op:e});
    body += G(R(b.x+20,b.y+80,290,62,{fill:COL.tint,stroke:COL.blue,rx:6}) + PSEUDO.map((l,i)=>T(b.x+28,b.y+95+i*14,l,{size:9.5,mono:true,fill:COL.blue})).join('') + T(b.x+330,b.y+105,'whole program',{size:13,bold:true}) + T(b.x+330,b.y+125,'running',{size:13,bold:true,fill:COL.green}),{op:r}); }
  else if (p >= .17) url = 'short.link/'+IDS[0];
  s += c3Browser(url, body, flash, ui) + c3Chain(cur, ui) + c3Store(stored, cur===4, ui) + over;
  return {svg:s, cap:'Cut, encode, shorten. Then each link: drop the snippet into memory, jump to the next ID, refresh. At the end, decode memory and run.'};
};

// ===== PART 3 end: the agent gets the screenshot, zooms on the first pixels, decodes them back (reverse of encoding) =====
const RESP_CELLS = FRAME.cells.slice(64);                 // squares after the 16-byte header
// slow for the first `slow` items, then fast: maps p∈[0,1] to a fractional index in [0,n]
function d2Strip(x, y, size, upto, hlFrom) {
  let s = '';
  RESP_CELLS.forEach((g,i)=>{ if (i>=upto) return; const hl = i>=hlFrom && i<hlFrom+4;
    s += R(x+i*(size+1), y, size, size, {fill:grayHex(g), stroke:hl?COL.green:COL.edge, sw:hl?2:1, rx:2}); });
  return s;
}

SCENES.decode2 = p => {
  const a = win(p,0,.15), z = win(p,.15,.28), N = SAMPLE.length;
  let s = '';
  // screenshot flies from the service to the agent
  s += actorService(150,120,{hl:true}) + actorAgent(810,120,{hl:true,sub:'opens the image'});
  const ix = lerp(230,560,ease(a)), k = 160/1200;
  s += G(R(ix,80,160,120,{fill:COL.page,stroke:COL.green,sw:1.5,rx:3}) + FRAME.cells.map((g,i)=>R(ix+i*4*k,80,4*k+0.3,4*k+0.5,{fill:grayHex(g),rx:0})).join(''),{op:1});
  s += G(L(ix+34,82,60,253,{stroke:COL.green,sw:1,dash:'3 3'}) + L(ix+81,82,940,253,{stroke:COL.green,sw:1,dash:'3 3'}) + T(480,240,'16 header bytes skipped',{anchor:'middle',size:11,fill:COL.mute}),{op:z});
  // decoding loop
  const kk = p<.28 ? 0 : paced(win(p,.28,.88), N, 2, .5), ci = Math.min(N-1, Math.floor(kk)), u = clamp(kk-ci), done = Math.min(N, Math.floor(kk));
  s += G(d2Strip(60,255,9,RESP_CELLS.length,p>=.28?ci*4:-1),{op:z});
  if (p>=.28 && done<N) { const cells = RESP_CELLS.slice(ci*4,ci*4+4), pairs = cells.map(g=>((g-32)/64).toString(2).padStart(2,'0')), byte = SAMPLE.charCodeAt(ci);
    s += T(480,320,cells.join('  '),{anchor:'middle',size:20,mono:true,fill:COL.mute,op:win(u,0,.2)}) + T(480,346,'gray levels',{anchor:'middle',size:10,fill:COL.mute,op:win(u,0,.2)});
    s += T(480,385,pairs.join(' '),{anchor:'middle',size:20,mono:true,op:win(u,.2,.4)}) + T(480,411,'bit pairs',{anchor:'middle',size:10,fill:COL.mute,op:win(u,.2,.4)});
    s += T(480,450,`byte ${byte}  →  '${SAMPLE[ci]}'`,{anchor:'middle',size:22,mono:true,fill:COL.green,op:win(u,.4,.7)}); }
  s += T(60,510,'decoded so far:',{size:12,fill:COL.mute}) + T(180,514,SAMPLE.slice(0,done),{size:22,mono:true,fill:COL.green,bold:true});
  s += G(T(480,410,'make_output = 42',{anchor:'middle',size:30,mono:true,bold:true,fill:COL.green}),{op:win(p,.9,1)});
  return {svg:s, cap:'Exactly the encoding in reverse: squares → bit pairs → bytes → text. The image was an envelope.'};
};
