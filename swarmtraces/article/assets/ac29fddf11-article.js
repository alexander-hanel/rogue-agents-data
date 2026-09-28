/* Article page (served at the site root): fetch /article/annotations.json once (written at build time from the release database), then
   attach hover/tap cards and embed cards to the spans the build wrapped, prefixing each
   with a small kind icon (the margin dates are left out); play the explainer figures inline from the scene renderers (data.js, scenes.js,
   story.js loaded before this one) once they scroll into view. A port of the research viewer's article.js: same
   functions, same card DOM (card / embed-card / dim / ext / details); the time rail is left out. Cards speak plain
   English; the technical basis sits behind a "details" line. Captured text is shown as text only
   (textContent / createTextNode); nothing is evaluated or fetched beyond the one JSON file. */
(function () {
  'use strict';
  const status = document.getElementById('ann-status');
  const card = document.getElementById('hover-card');
  const SVG = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k !== null && k !== undefined) e.append(k.nodeType ? k : document.createTextNode(String(k)));
    return e;
  }
  const fmtN = n => (n === null || n === undefined) ? '?' : Number(n).toLocaleString('en-US');
  const iso = s => s ? s.replace('T', ' ').replace(/Z$/, 'Z') : null;
  const clipS = (s, n) => (s && s.length > n) ? s.slice(0, n - 1) + '…' : s;
  const row = (cls, ...kids) => el('span', {class: 'row ' + (cls || '')}, ...kids);
  const lab = t => el('span', {class: 'lab'}, t + ' ');
  const plural = (n, w) => fmtN(n) + ' ' + w + (n === 1 ? '' : 's');
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function dt(s) { const d = s ? new Date(s) : null; return d && !isNaN(d) ? d : null; }
  const dayOf = s => { const d = dt(s); return d ? d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear() : null; };
  const hmOf = s => { const d = dt(s); return d ? String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0') + ' UTC' : null; };
  let firstDay = null;

  // release labels inside any text: shown as quiet marks, never as HTML
  const LABEL_RX = /\[(?:SERVICE|SHORTENER|PROXY|WEBHOOK|ENCODED|CREDENTIAL|HF|USER|IP|INTERNAL|WORKLOAD|INFRA|ENV|REDIRECT|EMAIL|CONNECTION|CLOUD|HOSTNAME|REDACTED|SECRET)(?:[ _-][A-Z0-9]+)*\]/g;
  function textWithLabels(s) {
    const frag = document.createDocumentFragment();
    let pos = 0, m;
    LABEL_RX.lastIndex = 0;
    while ((m = LABEL_RX.exec(s))) {
      if (m.index > pos) frag.append(document.createTextNode(s.slice(pos, m.index)));
      frag.append(el('span', {class: 'redact', title: 'redacted in the released dataset', text: m[0]}));
      pos = m.index + m[0].length;
    }
    if (pos < s.length) frag.append(document.createTextNode(s.slice(pos)));
    return frag;
  }
  document.querySelectorAll('.rt').forEach(n => { const t = n.textContent; n.textContent = ''; n.append(textWithLabels(t)); });

  // ---------------------------------------------------------------------------
  // icons: tiny 16x16 line drawings built from primitives in currentColor; one per kind of thing
  // ---------------------------------------------------------------------------
  const SHAPES = {
    robot: [['r', 3, 5.5, 10, 8, 1.5], ['c', 6.2, 9.5, 0.9, 1], ['c', 9.8, 9.5, 0.9, 1], ['l', 8, 5.5, 8, 3], ['c', 8, 2.2, 0.9, 0], ['l', 1.5, 9, 1.5, 11], ['l', 14.5, 9, 14.5, 11]],
    pinboard: [['r', 2, 3, 12, 11, 1], ['c', 8, 3, 1.2, 1], ['l', 5, 8, 11, 8], ['l', 5, 11, 9, 11]],
    link: [['r', 1.5, 6, 7, 4, 2], ['r', 7.5, 6, 7, 4, 2], ['l', 6, 8, 10, 8]],
    globe: [['c', 8, 8, 6, 0], ['e', 8, 8, 2.5, 6], ['l', 2, 8, 14, 8]],
    key: [['c', 5, 8, 2.5, 0], ['l', 7.5, 8, 14, 8], ['l', 12, 8, 12, 10.5], ['l', 14, 8, 14, 10]],
    terminal: [['r', 1.5, 3, 13, 10, 1], ['p', 4, 6.5, 6.5, 8.5, 4, 10.5], ['l', 8, 10.5, 11, 10.5]],
    clock: [['c', 8, 8, 6, 0], ['p', 8, 4.5, 8, 8, 10.5, 9.5]],
    file: [['p', 4, 1.5, 9, 1.5, 12.5, 5, 12.5, 14.5, 4, 14.5, 4, 1.5], ['p', 9, 1.5, 9, 5, 12.5, 5]],
    mask: [['r', 1.5, 4, 13, 8, 1.5], ['l', 4, 8, 12, 8]],
  };
  function icon(name) {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'ico ico-' + name); svg.setAttribute('viewBox', '0 0 16 16'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.4');
    svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
    for (const s of SHAPES[name] || SHAPES.file) {
      let n;
      if (s[0] === 'r') { n = document.createElementNS(SVG, 'rect'); n.setAttribute('x', s[1]); n.setAttribute('y', s[2]); n.setAttribute('width', s[3]); n.setAttribute('height', s[4]); n.setAttribute('rx', s[5]); }
      else if (s[0] === 'c') { n = document.createElementNS(SVG, 'circle'); n.setAttribute('cx', s[1]); n.setAttribute('cy', s[2]); n.setAttribute('r', s[3]); if (s[4]) { n.setAttribute('fill', 'currentColor'); n.setAttribute('stroke', 'none'); } }
      else if (s[0] === 'e') { n = document.createElementNS(SVG, 'ellipse'); n.setAttribute('cx', s[1]); n.setAttribute('cy', s[2]); n.setAttribute('rx', s[3]); n.setAttribute('ry', s[4]); }
      else if (s[0] === 'l') { n = document.createElementNS(SVG, 'line'); n.setAttribute('x1', s[1]); n.setAttribute('y1', s[2]); n.setAttribute('x2', s[3]); n.setAttribute('y2', s[4]); }
      else { n = document.createElementNS(SVG, 'polyline'); const pts = []; for (let i = 1; i < s.length; i += 2) pts.push(s[i] + ',' + s[i + 1]); n.setAttribute('points', pts.join(' ')); }
      svg.append(n);
    }
    return svg;
  }
  function iconFor(a) {
    if (a.kind === 'agent') return 'robot';
    if (a.kind === 'board') return 'pinboard';
    if (a.kind === 'host') return 'globe';
    if (a.kind === 'hf_token') return 'key';
    if (a.kind === 'time') return 'clock';
    if (a.kind === 'label') return 'mask';
    if (a.kind === 'shortener' || a.kind === 'chain') return 'link';
    if (a.kind === 'quote' || a.kind === 'code') return 'terminal';
    return 'link';
  }

  // ---------------------------------------------------------------------------
  // plain-English pieces
  // ---------------------------------------------------------------------------
  function whatIs(a) {
    if (a.kind === 'agent') return 'a name one of the agents gave itself';
    if (a.kind === 'board') return "a folder the agents used as a message board on OpenAI's package server";
    if (a.kind === 'shortener') return 'a short link in one of the chains';
    if (a.kind === 'host') return 'a website the agents reached';
    if (a.kind === 'hf_token') return 'a Hugging Face access token (only its start is shown)';
    if (a.kind === 'time') return 'a time mentioned in the text';
    if (a.kind === 'code') return 'a command quoted from the retained data';
    if (a.kind === 'quote') return 'a phrase quoted from the retained data';
    if (a.kind === 'chain') return 'a recovered program the authors link to';
    if (a.kind === 'label') return 'a value redacted in the released dataset';
    return 'a name from the retained data';
  }
  function tol(c) {
    const s = c.resid_p90_s;
    if (s === null || s === undefined || s < 60) return '';
    const m = Math.round(s / 60);
    return m >= 120 ? ' (±' + Math.round(m / 60) + ' h)' : ' (±' + m + ' min)';
  }
  const firstHours = s => { const d = dt(s), f = dt(firstDay); return d && f && d.getUTCDate() === f.getUTCDate() && d.getUTCMonth() === f.getUTCMonth() ? ', in the first hours of the attack' : ''; };
  function whenSentence(c, verb) {
    verb = verb || 'Seen';
    if (!c) return '';
    if (c.exact_utc) return verb + ' on ' + dayOf(c.exact_utc) + ' at ' + hmOf(c.exact_utc) + firstHours(c.exact_utc) + '.';
    if (c.est_utc) return verb + ' on ' + dayOf(c.est_utc) + ', about ' + hmOf(c.est_utc) + tol(c) + firstHours(c.est_utc) + '.';
    const prev = c.prev_anchor_utc, next = c.next_anchor_utc;
    if (!prev && next) return verb + ' on or before ' + dayOf(next) + firstHours(next) + ', before our earliest datable message (about ' + hmOf(next) + ').';
    if (prev && next) return verb + ' between about ' + hmOf(prev) + ' on ' + dayOf(prev) + ' and ' + hmOf(next) + ' on ' + dayOf(next) + '.';
    if (prev) return verb + ' after about ' + hmOf(prev) + ' on ' + dayOf(prev) + '.';
    if (c.lo_utc) return verb + ' after ' + hmOf(c.lo_utc) + ' on ' + dayOf(c.lo_utc) + '.';
    return '';
  }
  function replyText(r) {
    if (!r) return null;
    if (r.status !== undefined && r.status !== null) return 'A reply came back: HTTP ' + r.status + (r.body_bytes ? ', ' + fmtN(r.body_bytes) + ' bytes' : '') + '.';
    if (r.state === 'retained') return 'A reply was recorded, without a status code.';
    return null;
  }
  const headLink = c => el('a', {class: 'head', href: c.link || '#'}, c.head);

  function techDetails(a, c) {
    const bits = [];
    if (a.entity) bits.push('value ' + a.entity.value + ' (' + a.entity.kind + '): ' + fmtN(a.entity.n_chains) + ' programs, ' + fmtN(a.entity.n_mentions) + ' rows');
    if (c) {
      bits.push('row ' + c.head + (c.in_scope === false ? ' (outside the preset)' : ''));
      if (c.est_utc) bits.push('est ' + iso(c.est_utc) + ', basis ' + (c.basis_label || 'none') + (c.resid_p90_s ? ', band ±' + fmtN(c.resid_p90_s) + ' s' : ''));
      else bits.push('no calendar estimate (' + (c.basis || 'undated') + ')');
      if (c.layer_id) bits.push('layer ' + c.layer_id);
      const d = c.detail || {};
      if (d.story && d.story.technique) bits.push('technique ' + d.story.technique);
      if (d.agents && d.agents.length) bits.push('names ' + d.agents.join(', '));
      if (d.boards && d.boards.length) bits.push('boards ' + d.boards.join(', '));
      if (d.response && d.response.relation) bits.push('response ' + d.response.relation);
    }
    const ed = a.entity && a.entity.detail;
    if (ed && ed.cooccurring && ed.cooccurring.length) bits.push('co-occurring ' + ed.cooccurring.map(x => x.kind + ' ' + x.value + ' (' + fmtN(x.n_chains) + ')').join(', '));
    if (a.n_chains !== undefined && !a.entity) bits.push(fmtN(a.n_chains) + ' programs carry this text');
    if (a.match && a.match.method) bits.push('matched via ' + a.match.method + (a.match.reason ? '; ' + a.match.reason : ''));
    if (a.tried && a.tried.length > 1) bits.push('tried ' + a.tried.length + ' spellings');
    if (a.masked) bits.push('shown as a prefix / label only');
    const links = [];
    if (c && c.link) links.push(el('a', {href: c.link}, 'the row →'));
    if (a.entity && a.link) links.push(el('a', {href: a.link}, 'all rows →'));
    if (!bits.length && !links.length) return null;
    const div = el('div', null, textWithLabels(bits.join(' · ') + (links.length ? ' · ' : '')));
    links.forEach((l, i) => { if (i) div.append(' · '); div.append(l); });
    return el('details', {class: 'tech'}, el('summary', null, 'details'), div);
  }
  function header(a, tail) {
    return el('div', {class: 'title'}, icon(iconFor(a)), ' ', el('b', null, textWithLabels(clipS(a.display || a.text, 70))), ' — ', tail);
  }
  function seeLink(a) {
    if (a.entity && a.link) return row('links', el('a', {class: 'go', href: a.link}, 'See its ' + plural(a.entity.n_mentions, 'row') + ' →'));
    if (a.first && a.first.link) return row('links', el('a', {class: 'go', href: a.first.link}, 'See this program →'));
    return null;
  }
  function contextRows(a) {
    const ctx = a.context;
    if (!ctx || !ctx.line) return [];
    const box = el('div', {class: 'ctx'});
    if (ctx.before) box.append(el('div', {class: 'ctx-line', text: ctx.before}));
    box.append(el('div', {class: 'ctx-line hit'}, textWithLabels(ctx.line)));
    if (ctx.after) box.append(el('div', {class: 'ctx-line', text: ctx.after}));
    return [box];
  }

  // ---------------------------------------------------------------------------
  // cards: source description, matching context, evidence links, then details
  // ---------------------------------------------------------------------------
  function cardBody(a) {
    const rows = [];
    if (a.status === 'error') { rows.push(header(a, 'the lookup failed.'), row('dim', a.match && a.match.method)); return rows; }
    if (a.kind === 'time') {
      const t = a.time || {}, b = (a.before || [])[0], f = (a.after || [])[0];
      rows.push(header(a, whatIs(a) + (t.assumed_utc ? ', read as ' + hmOf(t.assumed_utc) + ' on ' + dayOf(t.assumed_utc) + '.' : '; the text gives no date for it.')));
      if (b || f) {
        rows.push(row('', lab('Nearest dated programs:'), b ? ['before it, ', headLink(b), ' (about ' + hmOf(b.est_utc) + ')'] : 'none before it', f ? ['; after it, ', headLink(f), ' (about ' + hmOf(f.est_utc) + ')'] : '; none after it', '.'));
        if (a.nearest_gap_s > 3600) rows.push(row('miss', 'The closest dated program is ' + Math.round(a.nearest_gap_s / 3600) + ' hours away, so nothing datable happened at this exact time.'));
      } else rows.push(row('miss', 'No dated program is near this time.'));
      if (f || b) rows.push(row('links', el('a', {class: 'go', href: (f || b).link}, 'See the nearest program →')));
      rows.push(el('details', {class: 'tech'}, el('summary', null, 'details'), el('div', null, [t.date_source ? 'date from ' + t.date_source : 'no date in prose', t.zone, t.note, a.dated_span ? 'dated rows span ' + iso(a.dated_span.lo) + ' → ' + iso(a.dated_span.hi) : null, a.match && a.match.method].filter(Boolean).join(' · '))));
      return rows;
    }
    if (a.status === 'not_found' || a.kind === 'identifier') return [];
    const c = a.first, d = c && c.detail || {};
    rows.push(header(a, whatIs(a) + '.'));
    if (a.status === 'partial') rows.push(row('miss', 'Only part of it matches the data.'));
    if (a.match && a.match.reason) rows.push(row('dim', a.match.reason));
    if (!a.entity) {
      rows.push(...contextRows(a));
      const rp = replyText(d.response); if (rp) rows.push(row('', rp));
    }
    rows.push(seeLink(a), techDetails(a, c));
    return rows;
  }

  function whenShort(c) {
    if (!c) return 'time uncertain';
    if (c.exact_utc) return dayOf(c.exact_utc) + ' at ' + hmOf(c.exact_utc);
    if (c.est_utc) return dayOf(c.est_utc) + ', about ' + hmOf(c.est_utc) + tol(c);
    if (c.next_anchor_utc) return 'on or before ' + dayOf(c.next_anchor_utc);
    return 'time uncertain';
  }

  // ---------------------------------------------------------------------------
  // code blocks: a small tokenizer for Python and shell; output is text nodes inside spans, never markup
  // ---------------------------------------------------------------------------
  const KW = new Set(('and as assert async await break class continue def del elif else except finally for from global if import ' +
    'in is lambda nonlocal not or pass raise return try while with yield None True False self print ' +
    'echo then fi do done case esac function local export set unset if elif else for while in return exit').split(' '));
  const TOKEN = /(\[(?:SERVICE|SHORTENER|PROXY|WEBHOOK|ENCODED|CREDENTIAL|HF|USER|IP|INTERNAL|WORKLOAD|INFRA|ENV|REDIRECT|EMAIL|CONNECTION|CLOUD|HOSTNAME|REDACTED|SECRET)(?:[ _-][A-Z0-9]+)*\])|(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(https?:\/\/[^\s"'`)<>]+)|(-?\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
  function tokenizeLine(line, out) {
    let last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(line))) {
      if (m.index > last) out.append(document.createTextNode(line.slice(last, m.index)));
      let cls = null;
      if (m[1]) cls = 'redact'; else if (m[2]) cls = 'tk-cm'; else if (m[3]) cls = 'tk-str'; else if (m[4]) cls = 'tk-url'; else if (m[5]) cls = 'tk-num';
      else if (m[6]) { if (KW.has(m[6])) cls = 'tk-kw'; else if (/^\s*\(/.test(line.slice(m.index + m[6].length))) cls = 'tk-fn'; }
      if (cls === 'tk-str' || cls === 'tk-url' || cls === 'tk-cm') { const sp = el('span', {class: cls}); sp.append(textWithLabels(m[0])); out.append(sp); }
      else out.append(cls ? el('span', {class: cls, text: m[0]}) : document.createTextNode(m[0]));
      last = m.index + m[0].length;
    }
    if (last < line.length) out.append(document.createTextNode(line.slice(last)));
  }
  function hitLines(a) {
    const set = [];
    if (a.context && a.context.line) set.push(a.context.line.trim());
    if (a.lines) for (const l of a.lines) if (l.n_chains > 0) set.push(l.line.trim());
    return set;
  }
  function colorizeCode(pre, a) {
    const text = pre.textContent, lines = text.split('\n'), hits = a.status === 'not_found' ? [] : hitLines(a);
    pre.replaceChildren();
    lines.forEach(ln => {
      const t = ln.trim();
      const hit = t.length >= 6 && hits.some(h => h && (h.indexOf(t) >= 0 || t.indexOf(h) >= 0));
      const span = el('span', {class: 'code-line' + (hit ? ' hit' : '')});
      tokenizeLine(ln, span);
      pre.append(span);
    });
  }
  function embedCard(a) {
    if (a.status === 'not_found') return [];
    const c = a.first, lead = a.status === 'partial' ? 'Partial match in program ' : 'Recovered program ';
    const line = row('', lead, headLink(c), ' · ', whenShort(c), ' · ', el('a', {class: 'go', href: c.link}, 'See this program →'));
    const td = techDetails(a, c);
    if (td && a.lines) td.append(el('ul', null, a.lines.map(l => el('li', null, fmtN(l.n_chains) + ' programs: ', textWithLabels(clipS(l.line, 90))))));
    return [line, a.match && a.match.reason ? row('dim', a.match.reason) : null, td];
  }

  // hover / tap card placement
  let hideTimer = null, current = null, openedAt = 0;
  // a tap fires a synthetic hover just before its click; the click must not close what that hover just opened
  const justOpened = () => performance.now() - openedAt < 500;
  function showCard(span, a) { showCardWith(span, cardBody(a).filter(Boolean)); card.classList.remove('fn-card'); }
  function showCardWith(span, nodes) {
    clearTimeout(hideTimer);
    if (current !== span || card.hidden) openedAt = performance.now();
    current = span;
    card.replaceChildren(...nodes);
    card.hidden = false;
    const r = span.getBoundingClientRect();
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let left = window.scrollX + r.left, top = window.scrollY + r.bottom + 6;
    if (left + cw > window.scrollX + document.documentElement.clientWidth - 8) left = Math.max(8, window.scrollX + document.documentElement.clientWidth - cw - 8);
    if (r.bottom + ch + 6 > window.innerHeight && r.top - ch - 6 > 0) top = window.scrollY + r.top - ch - 6;
    card.style.left = left + 'px'; card.style.top = top + 'px';
  }
  function hideCardSoon() { hideTimer = setTimeout(() => { card.hidden = true; current = null; }, 180); }
  card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  card.addEventListener('mouseleave', hideCardSoon);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { card.hidden = true; current = null; } });

  function attach(data) {
    const anns = data.annotations || {};
    firstDay = data.dated_span && data.dated_span.lo;
    document.querySelectorAll('.ann[data-ann]').forEach(node => {
      let span = node;
      const a = anns[span.dataset.ann];
      if (!a || (a.status === 'not_found' && span.tagName !== 'PRE')) {
        span.classList.add('plain');
        span.removeAttribute('tabindex');
        return;
      }
      // Only link annotations with an actual retained row; captured URLs stay inert.
      if (span.tagName === 'SPAN') {
        const href = a.first && a.first.link;
        if (typeof href !== 'string' || !/^\/viewer\/#\/row\/R\d{7}$/.test(href)) {
          span.classList.add('plain');
          span.removeAttribute('tabindex');
          return;
        }
        const link = document.createElement('a');
        for (const attr of span.attributes) link.setAttribute(attr.name, attr.value);
        link.setAttribute('href', href);
        while (span.firstChild) link.appendChild(span.firstChild);
        span.replaceWith(link);
        span = link;
      }
      if (a.status === 'not_found') span.classList.add('plain');
      span.classList.add(a.status);
      if (span.tagName === 'PRE') {
        colorizeCode(span, a);
        const box = span.parentElement.querySelector('.embed-card');
        if (box) {
          const rows = embedCard(a).filter(Boolean);
          box.replaceChildren(...rows);
          box.hidden = !rows.length;
        }
      } else {
        span.prepend(icon(iconFor(a)));
        // Identifier links already lead to the retained row; they need no generic card.
        if (a.kind === 'identifier') return;
        span.addEventListener('mouseenter', () => showCard(span, a));
        span.addEventListener('focus', () => showCard(span, a));
        span.addEventListener('mouseleave', hideCardSoon);
        span.addEventListener('blur', hideCardSoon);
        span.addEventListener('click', ev => { if (span.tagName === 'A') return; if (current === span && !card.hidden && !justOpened()) { card.hidden = true; current = null; } else showCard(span, a); ev.stopPropagation(); });
      }
    });
    document.addEventListener('click', ev => { if (!card.contains(ev.target)) { card.hidden = true; current = null; } });
    // footnotes: the reference shows its note (the p.fn at the end, minus the back-link) as a card
    const footnoteNodes = ref => {
      const def = document.getElementById((ref.getAttribute('href') || '').slice(1));
      if (!def) return null;
      const nodes = [el('span', {class: 'fn-num'}, ref.textContent + '.')];
      for (const n of def.childNodes) if (!(n.nodeType === 1 && n.classList.contains('fn-back'))) nodes.push(n.cloneNode(true));
      return nodes;
    };
    const showFootnote = ref => { const nodes = footnoteNodes(ref); if (nodes) { showCardWith(ref, nodes); card.classList.add('fn-card'); } };
    document.querySelectorAll('sup.fnref a').forEach(ref => {
      ref.addEventListener('mouseenter', () => showFootnote(ref));
      ref.addEventListener('focus', () => showFootnote(ref));
      ref.addEventListener('mouseleave', hideCardSoon);
      ref.addEventListener('blur', hideCardSoon);
      ref.addEventListener('click', ev => { ev.preventDefault(); if (current === ref && !card.hidden && !justOpened()) { card.hidden = true; current = null; } else showFootnote(ref); ev.stopPropagation(); });
    });
    // debug affordance: #card=<kind> opens the first card of that kind, pinned top-left (used for screenshots)
    const fm = (location.hash || '').match(/^#card=fn-(\d+)$/);
    if (fm) { const ref = document.getElementById('fnref-' + fm[1]); if (ref) { showFootnote(ref); card.style.position = 'fixed'; card.style.left = '32px'; card.style.top = '32px'; card.style.zIndex = 99; } }
    const hm = (location.hash || '').match(/^#card=([a-z_]+)$/);
    if (hm) {
      const span = document.querySelector('.ann-' + hm[1] + ':not(.plain)');
      const a = span && anns[span.dataset.ann];
      if (a && a.kind !== 'identifier') { card.replaceChildren(...cardBody(a).filter(Boolean)); card.hidden = false; card.style.position = 'fixed'; card.style.left = '32px'; card.style.top = '32px'; card.style.zIndex = 99; }
    }
    if (status) {
      const c = data.counts || {};
      const tot = k => Object.values(c).reduce((s, v) => s + (v[k] || 0), 0);
      status.textContent = 'We checked ' + data.n_candidates + ' underlined terms against the retained data: ' + tot('resolved') + ' matched, ' + tot('partial') + ' matched in part, and ' +
        tot('not_found') + ' could not be found. Hover for context or select a linked term to inspect its retained row.';
      status.className = 'ok';
    }
  }

  // folded sections: a link that points into a closed fold (the contents rail, a footnote, the address bar) opens it
  // first, so the browser has something to scroll to; a resize lets the figures inside refit once they are visible
  const folds = [...document.querySelectorAll('article#draft details.fold')];
  if (folds.length) {
    folds.forEach(d => d.addEventListener('toggle', () => window.dispatchEvent(new Event('resize'))));
    const openFor = hash => {
      if (!hash || hash.length < 2) return;
      let target = null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return; }
      let opened = false;
      for (let d = target && target.closest('details.fold'); d; d = d.parentElement && d.parentElement.closest('details.fold')) {
        if (!d.open) { d.open = true; opened = true; }       // a subsection's fold and the section's around it
      }
      if (opened) setTimeout(() => target.scrollIntoView({block: 'start'}), 0);
    };
    window.addEventListener('hashchange', () => openFor(location.hash));
    document.addEventListener('click', ev => { const a = ev.target.closest('a[href^="#"]'); if (a) openFor(a.getAttribute('href')); });
    openFor(location.hash);
  }

  // contents: a left side rail on wide screens (open, current section highlighted), a collapsed block on narrow ones
  const toc = document.querySelector('#toc details');
  if (toc) {
    const narrow = window.matchMedia('(max-width: 1099px)');   // the same breakpoint as article.css's side rail
    const set = () => { toc.open = !narrow.matches; };
    set(); narrow.addEventListener('change', set);
    // on narrow screens the list is a drop-down panel: a tap on a link or outside it closes it
    toc.addEventListener('click', ev => { if (narrow.matches && ev.target.closest('a[href^="#"]')) toc.open = false; });
    document.addEventListener('click', ev => { if (narrow.matches && toc.open && !toc.contains(ev.target)) toc.open = false; });
    const links = new Map();
    document.querySelectorAll('#toc a[href^="#"]').forEach(a => links.set(a.getAttribute('href').slice(1), a));
    const heads = [...document.querySelectorAll('article#draft h2[id], article#draft h3[id], article#draft h4[id]')];
    if (heads.length) {
      let current = null;
      const mark = id => {
        if (id === current) return;
        current = id;
        links.forEach((a, key) => {
          a.classList.toggle('here', key === id);
          if (key === id) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      };
      // Anchor navigation puts the heading at the viewport's top. An intersection
      // band below that point misses the destination and leaves the old link bold.
      const update = () => {
        const visible = heads.filter(h => h.getClientRects().length);
        let active = visible[0];
        for (const h of visible) {
          if (h.getBoundingClientRect().top > 1) break;
          active = h;
        }
        if (active) mark(active.id);
      };
      let pending = false;
      const schedule = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; update(); });
      };
      toc.addEventListener('click', ev => {
        const a = ev.target.closest('a[href^="#"]');
        if (a && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey && !ev.altKey) {
          mark(a.getAttribute('href').slice(1));
        }
      });
      window.addEventListener('scroll', schedule, {passive: true});
      window.addEventListener('resize', schedule);
      window.addEventListener('hashchange', schedule);
      window.addEventListener('load', schedule);
      update();
    }
  }

  // figures: the scene renderers (SCENES from scenes.js/story.js) play once scrolled into view, pause when out of view
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const figs = [];
  document.querySelectorAll('figure.fig-video').forEach(fig => {
    const video = fig.querySelector('video');
    const replay = fig.querySelector('.fig-replay');
    const bar = fig.querySelector('.fig-progress i');
    let resumeWhenVisible = !reduced;
    const play = () => video.play().catch(() => { replay.textContent = 'Play'; });
    video.addEventListener('play', () => { replay.textContent = 'Pause'; });
    video.addEventListener('pause', () => { replay.textContent = video.currentTime ? 'Play' : 'Replay'; });
    video.addEventListener('timeupdate', () => {
      if (video.duration) bar.style.width = (100 * video.currentTime / video.duration).toFixed(1) + '%';
    });
    replay.addEventListener('click', () => {
      if (video.paused) { resumeWhenVisible = true; play(); }
      else { resumeWhenVisible = false; video.pause(); }
    });
    // Reduced motion suppresses autoplay, while the explicit button still works.
    // Pausing manually also prevents a later scroll from restarting the clip.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            if (resumeWhenVisible) play();
          } else video.pause();
        }
      }, {threshold: [0, 0.25]});
      io.observe(video);
    } else if (!reduced) play();
  });
  document.querySelectorAll('figure.fig:not(.fig-video)').forEach(fig => {
    let scenes;
    try { scenes = JSON.parse(fig.dataset.scenes || '[]'); } catch (e) { scenes = []; }
    const stage = fig.querySelector('.fig-stage'), chapter = fig.querySelector('.fig-chapter'), bar = fig.querySelector('.fig-progress i');
    const replay = fig.querySelector('.fig-replay');
    if (typeof SCENES === 'undefined' || !scenes.length || !scenes.every(s => typeof SCENES[s[0]] === 'function')) {
      chapter.textContent = 'the figure scripts did not load';
      fig.classList.add('static');
      return;
    }
    const total = scenes.reduce((a, s) => a + s[1], 0), isStatic = fig.classList.contains('static');
    const f = {fig, stage, chapter, bar, scenes, total, isStatic, lastKey: '', p: 0, playing: false, done: false, t0: 0, raf: 0};
    f.render = p => {
      f.p = p;
      let acc = 0, idx = 0, prog = 0;
      for (let i = 0; i < scenes.length; i++) {
        const d = scenes[i][1];
        if (p * total < acc + d || i === scenes.length - 1) { idx = i; prog = Math.max(0, Math.min(1, (p * total - acc) / d)); break; }
        acc += d;
      }
      const key = idx + '|' + Math.round(prog * 400);
      if (key === f.lastKey) return;
      f.lastKey = key;
      const out = SCENES[scenes[idx][0]](prog);
      stage.innerHTML = out.svg;                // renderer-built SVG from local constants only
      chapter.textContent = (scenes.length > 1 ? (idx + 1) + ' / ' + scenes.length + ' · ' : '') + (out.cap || '');
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    };
    const step = now => {
      if (!f.playing) return;
      const p = Math.min(1, (now - f.t0) / (f.total * 1000));
      f.render(p);
      if (p < 1) f.raf = requestAnimationFrame(step);
      else { f.playing = false; f.done = true; if (replay) replay.textContent = 'Replay'; }
    };
    f.play = (from = f.p) => {
      if (isStatic) { f.render(1); return; }
      f.playing = true; f.done = false; f.t0 = performance.now() - from * f.total * 1000;
      if (replay) replay.textContent = 'Pause';
      cancelAnimationFrame(f.raf); f.raf = requestAnimationFrame(step);
    };
    f.pause = () => { if (!f.playing) return; f.playing = false; cancelAnimationFrame(f.raf); if (replay) replay.textContent = f.done ? 'Replay' : 'Play'; };
    if (replay) replay.addEventListener('click', () => { if (f.playing) f.pause(); else f.play(f.done || f.p >= 1 ? 0 : f.p); });
    figs.push(f);
    f.render(isStatic || reduced ? 1 : 0);
  });
  if (figs.length && !reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const f = figs.find(x => x.fig === e.target);
        if (!f || f.isStatic) continue;
        if (e.isIntersecting) { if (!f.playing && !f.done) f.play(f.p); }
        else f.pause();
      }
    }, {threshold: 0.35});
    for (const f of figs) io.observe(f.fig);
  }

  // author affiliations: CSS opens a popup on hover or focus; a tap toggles it (touch screens have no hover), a tap
  // elsewhere or Escape closes it, and an open popup is nudged left if it would run off the right edge of the screen
  const affs = [...document.querySelectorAll('.title-block .has-aff')];
  const fitPop = a => {
    const pop = a.querySelector('.aff-pop');
    if (!pop) return;
    pop.style.left = '0px';
    requestAnimationFrame(() => {
      const r = pop.getBoundingClientRect(), over = r.right - (document.documentElement.clientWidth - 8);
      if (over > 0) pop.style.left = -Math.min(over, a.getBoundingClientRect().left - 8) + 'px';
    });
  };
  affs.forEach(a => {
    a.addEventListener('mouseenter', () => fitPop(a));
    a.addEventListener('focusin', () => fitPop(a));
    a.addEventListener('click', e => {
      if (e.target.closest('a')) return;          // the link itself just opens
      const open = !a.classList.contains('open');
      affs.forEach(x => x.classList.remove('open'));
      if (open) { a.classList.add('open'); fitPop(a); } else a.blur();
    });
  });
  document.addEventListener('click', e => { if (!e.target.closest('.has-aff')) affs.forEach(x => x.classList.remove('open')); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') affs.forEach(x => { x.classList.remove('open'); x.blur(); }); });

  fetch('/article/annotations.json', {credentials: 'same-origin'})
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.statusText)))
    .then(attach)
    .catch(e => { if (status) { status.textContent = 'The annotations could not be loaded (' + e.message + '); the underlined terms are shown plain.'; status.className = 'err'; } document.querySelectorAll('.ann[data-ann]').forEach(s => s.classList.add('plain')); });
})();
