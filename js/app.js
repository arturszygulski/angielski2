/* Angielski codziennie — ekrany i logika sesji (etap 2). */
(function () {
  'use strict';
  const app = document.getElementById('app');
  /* opisy (.desc) schowane pod ikonką „i” w prawym górnym rogu modułu */
  function infoize() {
    app.querySelectorAll('.desc:not([data-i])').forEach(p => {
      p.dataset.i = '1';
      const box = p.closest('.set-card, .panel, .list-card'); if (!box) return;
      p.hidden = true;
      if (box.querySelector(':scope > .info-btn')) return;
      box.classList.add('has-info');
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'info-btn'; btn.title = 'Opis'; btn.setAttribute('aria-label', 'Pokaż opis'); btn.textContent = 'i';
      btn.onclick = () => { const ds = box.querySelectorAll('.desc'), show = ds.length && ds[0].hidden; ds.forEach(x => { x.hidden = !show; }); btn.classList.toggle('on', !!show); };
      box.appendChild(btn);
    });
  }
  new MutationObserver(infoize).observe(app, { childList: true, subtree: true });
  const esc = U.esc;
  const L = WORDS.LEVELS;
  const D = () => Store.data;
  const $ = s => app.querySelector(s);
  const $$ = s => Array.from(app.querySelectorAll(s));

  const sv = (p, size, extra) => '<svg aria-hidden="true" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + p + '</svg>';
  const IC = {
    spark: sv('<path d="M12 3c.6 3.4 2.6 5.4 6 6-3.4.6-5.4 2.6-6 6-.6-3.4-2.6-5.4-6-6 3.4-.6 5.4-2.6 6-6z"></path><path d="M19 16c.3 1.4 1 2.1 2.4 2.4-1.4.3-2.1 1-2.4 2.4-.3-1.4-1-2.1-2.4-2.4 1.4-.3 2.1-1 2.4-2.4z"></path>', 28, ' style="color:var(--pink)"'),
    play: sv('<path d="M7 4l12 8-12 8z"></path>', 20),
    gear: sv('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>', 22),
    back: sv('<path d="M15 18l-6-6 6-6"></path>', 18),
    speaker: sv('<path d="M11 5L6 9H2v6h4l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path>', 18),
    speakerBig: sv('<path d="M11 5L6 9H2v6h4l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path>', 40),
    mic: sv('<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path>', 44),
    check: sv('<path d="M5 12l5 5 9-10"></path>', 24, ' stroke-width="2.4"'),
    alert: sv('<path d="M12 8v5"></path><path d="M12 16.5v.5"></path><circle cx="12" cy="12" r="9"></circle>', 24, ' stroke-width="2.2"'),
    question: sv('<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4"></path><path d="M12 17v.5"></path>', 24, ' stroke-width="2.2"'),
    star: sv('<path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.6 7.1 17.2l.9-5.5-4-3.9 5.5-.8z"></path>', 26, ' stroke-width="1.8"'),
    flame: sv('<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.5 1 2.5 2.5 3-.5-3 0-5.5 0-8z"></path>', 22, ' style="color:#E08A1E"'),
    lock: sv('<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path>', 24, ' stroke-width="1.8"'),
    save: sv('<path d="M12 4v11"></path><path d="M7 10l5 5 5-5"></path><path d="M5 20h14"></path>', 24, ' stroke-width="1.8"'),
    cloud: sv('<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"></path>', 18),
    film: sv('<rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="M10 9l5 3-5 3z"></path>', 18),
    trophy: sv('<path d="M8 4h8v5a4 4 0 0 1-8 0z"></path><path d="M16 6h3a3 3 0 0 1-3 4"></path><path d="M8 6H5a3 3 0 0 0 3 4"></path><path d="M12 13v4"></path><path d="M8 20h8"></path>', 24, ' stroke-width="1.8"'),
    chart: sv('<path d="M4 20V10"></path><path d="M10 20V4"></path><path d="M16 20v-7"></path><path d="M21 20H3"></path>', 24, ' stroke-width="1.8"'),
    book: sv('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"></path><path d="M4 21V5"></path><path d="M9 7h6"></path>', 24, ' stroke-width="1.8"'),
    gamepad: sv('<rect x="2" y="7" width="20" height="11" rx="5"></rect><path d="M7 11v3"></path><path d="M5.5 12.5h3"></path><circle cx="16" cy="11.5" r="1"></circle><circle cx="18" cy="13.5" r="1"></circle>', 24, ' stroke-width="1.8"'),
    list: sv('<path d="M9 6h11"></path><path d="M9 12h11"></path><path d="M9 18h11"></path><path d="M4 6h.01"></path><path d="M4 12h.01"></path><path d="M4 18h.01"></path>', 24, ' stroke-width="2.2"'),
    doc: sv('<path d="M6 3h9l4 4v14H6z"></path><path d="M14 3v5h5"></path><path d="M9 12h7"></path><path d="M9 16h7"></path>', 24, ' stroke-width="1.8"'),
    micSm: sv('<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path>', 18),
    headphones: sv('<path d="M4 15v-3a8 8 0 0 1 16 0v3"></path><rect x="3" y="14" width="5" height="7" rx="2"></rect><rect x="16" y="14" width="5" height="7" rx="2"></rect>', 24, ' stroke-width="1.8"'),
    pause: sv('<rect x="7" y="5" width="3.5" height="14" rx="1"></rect><rect x="13.5" y="5" width="3.5" height="14" rx="1"></rect>', 40),
    clock: sv('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>', 24, ' stroke-width="1.8"'),
    chat: sv('<path d="M4 5h16v11H9l-5 4z"></path><path d="M8 9h8"></path><path d="M8 12h5"></path>', 24, ' stroke-width="1.8"'),
    eye: sv('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle>', 18)
  };

  /* ---------- Rodzaje ćwiczeń ---------- */
  const TYPES = {
    cloze: { title: 'Słowo do zdania', skill: 'vocab', tag: 'SŁOWNICTWO' },
    order: { title: 'Ułóż zdanie', skill: 'grammar', tag: 'SZYK ZDANIA' },
    error: { title: 'Znajdź błąd', skill: 'grammar', tag: 'GRAMATYKA' },
    dictation: { title: 'Dyktando', skill: 'listening', tag: 'SŁUCHANIE' },
    speak: { title: 'Powiedz to', skill: 'speaking', tag: 'MÓWIENIE' },
    translate: { title: 'Przetłumacz', skill: 'grammar', tag: 'TŁUMACZENIE' },
    particle: { title: 'Dobierz partykułę', skill: 'vocab', tag: 'PHRASAL VERBS' },
    choice: { title: 'Wybierz słowo', skill: 'vocab', tag: 'SŁOWNICTWO' },
    pvwrite: { title: 'Phrasal verb z pamięci', skill: 'vocab', tag: 'PHRASAL VERBS' },
    tense_c: { title: 'Wybierz czas', skill: 'grammar', tag: 'CZASY' },
    tense_w: { title: 'Odmień czasownik', skill: 'grammar', tag: 'CZASY' },
    tense_t: { title: 'Przetłumacz — czasy', skill: 'grammar', tag: 'CZASY' }
  };
  const SKILL_NAME = { vocab: 'Słownictwo', grammar: 'Gramatyka', listening: 'Słuchanie', speaking: 'Mówienie' };
  const PREFIX = { ord: 'order', dic: 'dictation', say: 'speak', err: 'error', tord: 'order', tdic: 'dictation', tr: 'translate', ttr: 'translate', pv: 'particle', tnc: 'tense_c', tnw: 'tense_w', tnt: 'tense_t' };
  const PREFIX_OF = { order: 'ord:', dictation: 'dic:', speak: 'say:', translate: 'tr:', particle: 'pv:' };
  /* błędne wersje, które w praktyce też bywają poprawne — nie używamy ich w „Znajdź błąd” */
  const ERR_EXCLUDE = {
    'It is essential that he _ on time.': ['is'],
    'She asked me where I _.': ['live'],
    'You _ have told me earlier!': ['must'],
    'You _ wear a seatbelt in a car.': ["mustn't", "can't"]
  };
  const PROPER = new Set(['Tom', 'Wrocław', 'Mum', 'Dad', 'Japan', 'China', 'Warsaw', 'Kraków', 'Gdańsk']);

  function itemFor(id) {
    const i = id.indexOf(':');
    if (i < 0) { const w = WORDS.byId[id]; return w ? { type: 'cloze', id, w, lvl: w.lvl } : null; }
    const type = PREFIX[id.slice(0, i)], rest = id.slice(i + 1);
    if (id.slice(0, i) === 'simp') return simpleItem(rest);
    if (id.slice(0, i) === 'tp') return topicItem(rest);
    if (id.slice(0, i) === 'stb') return stubItem(rest);
    if (!type) return null;
    if (type === 'error') {
      const [gi, wi] = rest.split('-').map(Number), g = GRAMMAR[gi];
      if (!g || !(wi >= 1) || !g.options[wi]) return null;
      return { type, id, g, wrong: g.options[wi], lvl: g.lvl };
    }
    const pre = id.slice(0, i);
    if (pre === 'tnc' || pre === 'tnw' || pre === 'tnt') { const ts = tenseItems().byId[rest]; return ts ? { type, id, ts, lvl: ts.lvl, pl: ts.pl } : null; }
    if (pre === 'tord' || pre === 'tdic' || pre === 'ttr') {
      const j = rest.lastIndexOf(':'), T = (D().texts || {})[rest.slice(0, j)], sn = T && T.sents[+rest.slice(j + 1)];
      if (!sn) return null;
      return { type, id, w: { answers: [''], pl: '', s: '_' + sn.t }, lvl: levels().vocab, fromText: T.title, textId: T.id, pl: type === 'translate' ? (D().plCache || {})[id] : null };
    }
    const w = WORDS.byId[rest];
    if (type === 'particle' && w && !isPV(w)) return null;
    return w ? { type, id, w, lvl: w.lvl, pl: type === 'translate' ? (D().plCache || {})[id] : null } : null;
  }
  const PV_RE = /^[a-z]+( (up|down|out|off|on|in|over|back|away|around|round|into|with|for|after|through|along|across|by|forward|apart|ahead|to|of|about|together|aside))+$/;
  function isPV(w) { return !!w && PV_RE.test(w.answers[0]); }
  function pvSplit(w) { const a = w.answers[0], i = a.indexOf(' '); return { verb: a.slice(0, i), part: a.slice(i + 1) }; }
  function makePvOpts(w) {
    const { verb, part } = pvSplit(w), n = part.split(' ').length;
    const same = U.shuffle(WORDS.list.filter(x => isPV(x) && pvSplit(x).verb === verb).map(x => pvSplit(x).part).filter(x => x.split(' ').length === n));
    const pool = n > 1 ? ['up with', 'out of', 'on with', 'down on', 'up to', 'forward to', 'out for', 'in on', 'away with', 'down to', 'up on', 'in with', 'out on', 'off with']
      : ['up', 'down', 'out', 'off', 'on', 'in', 'over', 'back', 'away', 'around', 'into', 'for', 'after', 'through', 'with', 'about'];
    const opts = [part], okAlt = altOkList(w);
    same.concat(U.shuffle(pool)).forEach(x => { if (opts.length < 4 && opts.indexOf(x) < 0 && okAlt.indexOf((verb + ' ' + x).toLowerCase()) < 0) opts.push(x); });
    return U.shuffle(opts);
  }
  function fullSentence(it) { const r = it.ts ? it.ts.full : it.type === 'error' ? it.g.s.replace('_', it.g.correct) : it.w.s.replace('_', it.w.answers[0]); return r.charAt(0).toUpperCase() + r.slice(1); }
  function typeEnabled(type) {
    if (type === 'cloze') return true;
    const g = D().settings.games || {};
    if (g[type] === false) return false;
    if (type === 'speak' && !Recog.supported()) return false;
    if (type === 'translate' && !AI.enabled()) return false;
    if (/^tense_/.test(type) && g.tenses === false) return false;
    if (type === 'tense_t' && !AI.enabled()) return false;
    return true;
  }
  /* ================= SKALA ZNAJOMOŚCI SŁOWA 0–5 ================= */
  /* D().wsc[wid] = { lv, day }: punkt tylko za pierwszą odpowiedź dnia; 5/5 = opanowane, sprawdzian co 2–3 miesiące */
  function scaleWid(it) {
    if (!it || it.simple || it.fromText || it.ts || it.type === 'error' || !it.w) return null;
    return WORDS.byId[it.w.id] ? it.w.id : null;
  }
  /* klucz skali: słowo (id), zdanie „Znajdź błąd” (g:nr), zdanie z Czasów (ts:id) */
  function scaleKey(it) {
    if (!it || it.simple) return null;
    if (it.ts) return 'ts:' + it.ts.id;
    if (it.type === 'error' && it.g) return 'g:' + it.id.split(':')[1].split('-')[0];
    if (it.fromText && it.textId) return 'tx:' + it.id.slice(it.id.indexOf(':') + 1);
    return scaleWid(it);
  }
  function scaleFamily(key) {
    if (key.startsWith('ts:')) return ['tnc:', 'tnw:', 'tnt:'].map(p => p + key.slice(3));
    if (key.startsWith('g:')) return [1, 2, 3].map(k => 'err:' + key.slice(2) + '-' + k);
    if (key.startsWith('tx:')) return ['tord:', 'tdic:', 'ttr:'].map(p => p + key.slice(3));
    return WORD_PREFIXES.map(p => p + key);
  }
  function scaleName(key) {
    if (key.startsWith('ts:')) { const t = tenseItems().byId[key.slice(3)]; return t ? 'zdanie „' + t.full + '”' : 'to zdanie'; }
    if (key.startsWith('g:')) { const g = GRAMMAR[+key.slice(2)]; return g ? 'zdanie „' + g.s.replace('_', g.correct) + '”' : 'to zdanie'; }
    if (key.startsWith('tx:')) { const it = itemFor('tord:' + key.slice(3)); return it ? 'zdanie „' + fullSentence(it) + '”' : 'to zdanie'; }
    return '„' + (WORDS.byId[key] ? WORDS.byId[key].answers[0] : key) + '”';
  }
  function wordLv(wid) { const r = (D().wsc || {})[wid]; return r ? r.lv : 0; }
  function dotsHtml(lv, change, small) {
    let h = '<span class="wdots' + (small ? ' sm' : '') + '" title="Znajomość słowa: ' + lv + '/5" aria-label="Znajomość słowa: ' + lv + ' z 5">';
    for (let i = 1; i <= 5; i++) h += '<i class="' + (i <= lv ? 'on' : '') + (change > 0 && i === lv ? ' pop' : '') + (change < 0 && i === lv + 1 ? ' drop' : '') + '"></i>';
    return h + '</span>';
  }
  function wordDots(wid, small) { return wid ? dotsHtml(wordLv(wid), 0, small) : ''; }
  function scheduleCheck(key) {
    const days = 60 + Math.floor(Math.random() * 31), due = U.addDays(U.startOfDay(), days);
    scaleFamily(key).forEach(id => { const k = D().cards[id]; if (k && k.state !== 'known') { k.due = due; k.ivl = days; k.state = 'review'; } });
  }
  /* wywoływane w applyOutcome po zapisaniu karty; zwraca {lv, d} albo null */
  function scaleUpdate(it, kind, correct) {
    const wid = scaleKey(it); if (!wid) return null;
    const ws = D().wsc = D().wsc || {}, r = ws[wid] = ws[wid] || { lv: 0, day: '' }, today = U.dayKey();
    if (r.day === today) return { lv: r.lv, d: 0, same: true, b: r.b || 0 };
    r.day = today;
    const clean = correct && kind === 'ok' && !S.hint && !S.unsure;
    /* koszyki 1–3 (tydzień, miesiąc, znam): jedno sprawdzenie w terminie; dobrze = dalej, źle = koszyk niżej (z tygodnia do nauki na 3/5) (upd239) */
    if (r.b >= 1) {
      let bm = '';
      if (clean) { r.b = Math.min(3, r.b + 1); basketSchedule(wid, r); bm = r.b === 2 ? 'Tydzień zaliczony — koszyk „miesiąc”: wróci za 30 dni.' : 'Miesiąc zaliczony — <b>znasz to</b> ✓ Kontrola za pół roku.'; return { lv: r.lv, d: 1, b: r.b, bm }; }
      if (!correct) {
        if (r.b === 1) { r.b = 0; r.lv = 3; delete r.bd; bm = 'Z koszyka „tydzień” wraca do nauki na 3/5 — 2 dobre dni i znów idzie dalej.'; }
        else { r.b--; basketSchedule(wid, r); bm = 'Wraca do koszyka „' + BASKET_NAME[r.b] + '” — sprawdzenie za ' + (r.b === 1 ? '7' : '30') + ' dni.'; }
        return { lv: r.lv, d: -1, b: r.b, bm };
      }
      r.bd = U.addDays(U.startOfDay(), 3); basketSchedule(wid, r, true); // niepewnie / z podpowiedzią — bez zmiany koszyka, sprawdzenie za 3 dni
      return { lv: r.lv, d: 0, b: r.b, bm: 'Niepewnie — koszyk bez zmian, sprawdzenie za 3 dni.' };
    }
    let d = 0;
    if (clean) { if (r.lv < 5) { r.lv++; d = 1; } }
    else if (!correct && r.lv >= 2) { r.lv--; d = -1; }
    if (d > 0 && r.lv === 5) { r.at5 = Date.now(); r.b = 1; basketSchedule(wid, r); setTimeout(() => celebrate(wid), 350); return { lv: 5, d, b: 1, bm: '5/5 — przechodzi do koszyka „tydzień”: wróci za 7 dni na jedno sprawdzenie.' }; }
    return { lv: r.lv, d, b: 0 };
  }
  const BASKET_NAME = ['nauka', 'tydzień', 'miesiąc', 'znam'], BASKET_DAYS = [0, 7, 30, 180];
  function basketSchedule(key, r, keepBd) {
    if (!keepBd) r.bd = U.addDays(U.startOfDay(), BASKET_DAYS[r.b]);
    scaleFamily(key).forEach(id => { const k = D().cards[id]; if (k && k.state !== 'known') { k.due = r.bd; k.ivl = Math.max(1, Math.round((r.bd - U.startOfDay()) / U.DAY)); k.state = 'review'; } });
  }
  const basketOf = key => { const r = key && (D().wsc || {})[key]; return r && r.b ? r.b : 0; };
  /* ścieżka koszyków przy kropkach: 1 · tydzień · miesiąc · znam */
  function basketHtml(b) { return '<span class="bk-path">' + ['1', 'tydzień', 'miesiąc', 'znam'].map((n, i) => '<span class="' + (i < b ? 'on' : i === b ? 'cur' : '') + '">' + n + '</span>').join('') + '</span>'; }
  /* jednorazowo: słowa/zdania z 5/5 do koszyka „tydzień” albo „miesiąc” (gdy 5/5 dawniej niż tydzień temu) */
  function basketMigrate() {
    if (D().bkV1) return;
    const ws = D().wsc = D().wsc || {}, now = Date.now();
    Object.keys(ws).forEach(k => { const r = ws[k]; if (r.lv !== 5 || r.b) return;
      const at = r.at5 || now - 8 * U.DAY;
      if (now - at > 7 * U.DAY) { r.b = 2; r.bd = Math.max(U.addDays(U.startOfDay(), 1), U.addDays(U.startOfDay(at), 37)); } else { r.b = 1; r.bd = U.addDays(U.startOfDay(at), 7); }
      basketSchedule(k, r, true); });
    D().bkV1 = 1; Store.save();
  }
  function celebrate(key) {
    Sound.play('combo');
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
      const cols = ['#C8607F', '#D3A35C', '#5E9670', '#7E98BE', '#E8708F'];
      for (let i = 0; i < 46; i++) { const p = document.createElement('i'); p.style.left = (Math.random() * 100) + '%'; p.style.background = cols[i % cols.length]; p.style.animationDelay = (Math.random() * 0.35) + 's'; p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg'); box.appendChild(p); }
      document.body.appendChild(box); setTimeout(() => box.remove(), 2200);
    }
    toast('Brawo! ' + scaleName(key) + ' — 5/5. Koszyk „tydzień”: sprawdzenie za 7 dni.');
  }
  /* jednorazowo: skala dla słów ćwiczonych wcześniej, wg dotychczasowych wyników (bez 5/5) */
  function scaleMigrate() {
    if (D().wscV1) return;
    const ws = D().wsc = D().wsc || {}, c = D().cards;
    WORDS.list.forEach(w => {
      const k = c[w.id]; if (!k || k.state === 'known' || ws[w.id]) return;
      const sv = k.s || 0, lv = sv >= 30 ? 4 : sv >= 10 ? 3 : sv >= 4 ? 2 : (k.reps || 0) >= 1 ? 1 : 0;
      if (lv) ws[w.id] = { lv, day: '' };
    });
    D().wscV1 = 1; Store.save();
  }
  function scaleMigrate2() {
    if (D().wscV3) return;
    const ws = D().wsc = D().wsc || {}, c = D().cards, keys = {};
    Object.keys(c).forEach(id => {
      let key = null;
      if (/^tn[cwt]:/.test(id)) key = 'ts:' + id.slice(4);
      else if (/^err:\d+-\d$/.test(id)) key = 'g:' + id.slice(4).split('-')[0];
      else if (/^(tord|tdic|ttr):/.test(id)) key = 'tx:' + id.slice(id.indexOf(':') + 1);
      if (!key || c[id].state === 'known') return;
      keys[key] = Math.max(keys[key] || 0, c[id].s || 0, (c[id].reps || 0) >= 1 ? 0.5 : 0);
    });
    Object.keys(keys).forEach(k => { if (ws[k]) return; const sv = keys[k], lv = sv >= 30 ? 4 : sv >= 10 ? 3 : sv >= 4 ? 2 : sv > 0 ? 1 : 0; if (lv) ws[k] = { lv, day: '' }; });
    D().wscV2 = 1; D().wscV3 = 1; Store.save();
  }
  function itemLabel(id) {
    const it = itemFor(id); if (!it) return esc(id);
    if (it.type === 'cloze') return '<span class="w">' + esc(it.w.answers[0]) + '</span><span class="p"> — ' + esc(it.w.pl) + '</span> ' + wordDots(scaleWid(it), true) + exSentHtml(it.w);
    const s = fullSentence(it);
    return '<span class="p" style="font-size:14px;font-weight:700">' + TYPES[it.type].title + ':</span> <span class="w" style="font-size:17px;font-weight:400">' + esc(s.length > 70 ? s.slice(0, 68) + '…' : s) + '</span>';
  }
  /* przykładowe zdanie pod słowem — słowo pogrubione; gap=true zamiast słowa luka ___ */
  function exSentHtml(w, gap, cls) {
    if (!w || !w.s || w.s.indexOf('_') < 0) return '';
    const i = w.s.indexOf('_'), a = w.s.slice(0, i), b = w.s.slice(i + 1);
    const mid = gap ? '<span class="ex-gap">___</span>' : '<b>' + esc(w.answers[0]) + '</b>';
    const t = (a + '\u0000' + b).replace(/^\s*\S/, m => m.toUpperCase()).split('\u0000');
    return '<div class="' + (cls || 'ex-s') + '" lang="en">' + esc(t[0]) + mid + esc(t[1]) + '</div>';
  }
  function itemShort(id) { const it = itemFor(id); if (!it) return id; return it.type === 'cloze' ? '„' + it.w.answers[0] + '”' : TYPES[it.type].title + ' — to zdanie'; }

  /* ---------- Pomocnicze ---------- */
  const WEEKDAYS = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const MONTHS = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  function levels() {
    const p = D().profile;
    if (!p.levels) p.levels = { vocab: 1, grammar: 1, listening: 1 };
    if (p.levels.speaking == null) p.levels.speaking = p.levels.listening;
    return p.levels;
  }
  function overallLevel() { const l = levels(); return Math.round((l.vocab + l.grammar + l.listening + l.speaking) / 4); }
  function hist() { const p = D().profile; if (!p.hist) p.hist = {}; return p.hist; }
  function pushHist(skill, ok, meta) {
    const h = hist(); (h[skill] = h[skill] || []).push(ok ? 1 : 0); if (h[skill].length > 50) h[skill].splice(0, h[skill].length - 50);
    // szczegóły do panelu „Skąd ten poziom?” — czy odpowiedź była łatwa / powtórką / z podpowiedzią
    const lg = D().skLog = D().skLog || {}, a = lg[skill] = lg[skill] || [];
    const m = meta || {};
    a.push({ at: Date.now(), ok: ok ? 1 : 0, e: m.e ? 1 : 0, r: m.r ? 1 : 0, h: m.h ? 1 : 0, l: m.l != null ? m.l : null });
    if (m.l != null && !m.e && !m.h) { const sl = skLv(skill); const c = sl[m.l] || (sl[m.l] = [0, 0]); c[0]++; if (ok) c[1]++; } // trwałe liczniki per poziom
    if (a.length > 200) a.splice(0, a.length - 200);
  }
  const EASY_TYPES = { choice: 1, particle: 1, tense_c: 1 };
  /* awans: 40 „uczciwych” odpowiedzi (bez łatwych wersji i podpowiedzi, zadania z poziomu lub wyżej) od ostatniej zmiany poziomu,
     ≥85% dobrze, z co najmniej 5 różnych dni, i nie częściej niż co 14 dni */
  const PROMO_N = 40, PROMO_ACC = 0.85, PROMO_DAYS = 5, PROMO_GAP = 14;
  function lastLevelChange(sk) {
    const h = D().levelHist || []; let prev = null, at = 0;
    h.forEach(e => { const v = e.levels ? e.levels[sk] : null; if (v == null) return; if (v !== prev) at = e.at; prev = v; });
    return at;
  }
  function fairLog(sk) {
    const lv = levels()[sk], since = lastLevelChange(sk);
    return ((D().skLog || {})[sk] || []).filter(x => x.at > since && !x.e && !x.h && (x.l == null || x.l >= lv));
  }
  /* odpowiedzi per umiejętność i poziom: [liczba, dobrych] — na start policzone z historii skLog */
  function skLv(sk) {
    const d = D();
    if (!d.skLvInit) {
      const out = {};
      Object.keys(d.skLog || {}).forEach(k => { const o = out[k] = {}; d.skLog[k].forEach(x => { if (x.l == null || x.e || x.h) return; const c = o[x.l] || (o[x.l] = [0, 0]); c[0]++; if (x.ok) c[1]++; }); });
      d.skLv = out; d.skLvInit = 1;
    }
    const all = d.skLv = d.skLv || {};
    return all[sk] || (all[sk] = {});
  }
  const LV_N = 40;
  function skLvPct(sk, i) { const c = skLv(sk)[i]; if (!c || !c[0]) return 0; return Math.round(Math.min(1, c[0] / LV_N) * Math.min(1, (c[1] / c[0]) / PROMO_ACC) * 100); }
  function promoteStatus(sk) {
    const f = fairLog(sk).slice(-PROMO_N), ok = f.filter(x => x.ok).length;
    const days = new Set(f.map(x => U.dayKey(x.at))).size;
    const wait = Math.max(0, Math.ceil((lastLevelChange(sk) + PROMO_GAP * U.DAY - Date.now()) / U.DAY));
    return { n: f.length, acc: f.length ? ok / f.length : null, days, wait };
  }
  function promoteReady(sk) {
    if (levels()[sk] >= 4) return false;
    const s = promoteStatus(sk);
    return s.n >= PROMO_N && s.acc >= PROMO_ACC && s.days >= PROMO_DAYS && s.wait === 0;
  }
  function histMeta(it, c) {
    const lvl = it.w && typeof it.w.lvl === 'number' ? it.w.lvl : typeof it.lvl === 'number' ? it.lvl : null;
    return { e: !!(EASY_TYPES[it.type] || /ŁATWIEJ|PODPOWIEDZ|PRZECZYTAJ|KAFELK/.test(it.stepLabel || '')), r: !c.isNew, h: !!(S.hint || S.unsure), l: lvl };
  }
  function accuracy(skill) { const h = hist()[skill] || []; if (h.length < 5) return null; const r = h.slice(-30); return Math.round(r.reduce((a, b) => a + b, 0) / r.length * 100); }
  function isStudyDay(day) { return !!day && (day.sec >= 300 || day.quick); }
  /* seria z dniami ochrony (upd250): co 10 dni bez przerwy +1 dzień ochrony, co 30 dni +1 dodatkowo, max 5;
     dzień bez nauki zużywa ochronę (seria trwa, ale się nie zwiększa); bez ochrony seria od zera. Liczone na nowo z historii dni. */
  const SHIELD_MAX = 5;
  function streakInfo() {
    const days = D().days, ks = Object.keys(days).filter(k => isStudyDay(days[k])).sort();
    const out = { cur: 0, best: 0, shields: 0, prot: {} };
    if (!ks.length) return out;
    const today = U.startOfDay();
    let run = 0, sh = 0, prot = {};
    for (let t = new Date(ks[0] + 'T00:00:00').getTime(); t <= today; t = U.addDays(t, 1)) {
      const k = U.dayKey(t);
      if (isStudyDay(days[k])) { run++; if (run % 10 === 0) sh = Math.min(SHIELD_MAX, sh + 1); if (run % 30 === 0) sh = Math.min(SHIELD_MAX, sh + 1); }
      else if (t === today) { /* dziś jeszcze można się uczyć */ }
      else if (run > 0 && sh > 0) { sh--; prot[k] = 1; }
      else { run = 0; sh = 0; prot = {}; }
      out.best = Math.max(out.best, run);
    }
    out.cur = run; out.shields = sh; out.prot = prot;
    return out;
  }
  function streak() { return streakInfo().cur; }
  function endOfToday() { return U.addDays(U.startOfDay(), 1); }
  function dueIds() {
    const end = endOfToday(), c = D().cards;
    return Object.keys(c).filter(id => {
      if (c[id].state !== 'review' || c[id].due >= end) return false;
      const it = itemFor(id); return it && typeEnabled(it.type);
    }).sort((a, b) => c[a].due - c[b].due);
  }
  function reviewCap() { return Math.max(0, D().settings.maxReviewsPerDay - Store.today().reviews); }
  function newPool() {
    const lv = levels().vocab, c = D().cards;
    const byLvl = l => WORDS.list.filter(w => w.lvl === l && (!w.custom || w.ai) && !c[w.id]).map(w => w.id);
    const out = WORDS.list.filter(w => w.custom && !w.ai && !c[w.id]).sort((a, b) => (a.added || 0) - (b.added || 0)).map(w => w.id);
    // niższe poziomy (np. A1) przeplatane po jednym z bieżącym — znane słowa wystarczy oznaczyć „Umiem to”
    let lower = []; for (let i = 0; i < lv; i++) lower = lower.concat(byLvl(i));
    roundRobin([byLvl(lv), lower]).forEach(id => out.push(id));
    for (let i = lv + 1; i < L.length; i++) byLvl(i).forEach(id => out.push(id));
    return out;
  }
  function roundRobin(lists) {
    const out = [], ls = lists.map(l => l.slice());
    while (ls.some(l => l.length)) ls.forEach(l => { if (l.length) out.push(l.shift()); });
    return out;
  }
  /* nowe ćwiczenia (inne niż słówka): zdania ze słów poznanych co najmniej dwa razy + „Znajdź błąd” z poziomu gramatyki */
  /* ---------- Statystyki użycia ćwiczeń i modułów (dla urozmaicenia sesji) ---------- */
  const USE_KEY = { tense_c: 'tense', tense_w: 'tense', tense_t: 'tense', choice: 'cloze', pvwrite: 'particle' };
  const useKey = tp => USE_KEY[tp] || tp;
  function bumpUse(key) { const t = Store.today(); t.ty = t.ty || {}; t.ty[key] = (t.ty[key] || 0) + 1; }
  function usage(key, days) {
    let n = 0; const d = D().days;
    for (let i = 0; i < (days || 14); i++) { const x = d[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (x && x.ty && x.ty[key]) n += x.ty[key]; }
    return n;
  }
  function daysSinceUse(key) {
    const d = D().days;
    for (let i = 0; i < 60; i++) { const x = d[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (x && x.ty && x.ty[key]) return i; }
    return null;
  }
  /* listy ćwiczeń: najrzadziej używane pierwsze; dwie najrzadsze dostają po 2 miejsca na rundę */
  function byUsage(named) {
    const arr = named.filter(x => x.list.length).sort((a, b) => usage(a.key) - usage(b.key) || Math.random() - 0.5);
    const out = [], idx = arr.map(() => 0);
    let left = true;
    while (left) {
      left = false;
      arr.forEach((x, k) => { const take = k < 2 ? 2 : 1; for (let j = 0; j < take && idx[k] < x.list.length; j++) { out.push(x.list[idx[k]++]); left = true; } });
    }
    return out;
  }
  const USE_NAME = { cloze: 'Słowo do zdania', order: 'Ułóż zdanie', dictation: 'Dyktando', speak: 'Powiedz to', error: 'Znajdź błąd', translate: 'Przetłumacz', particle: 'Dobierz partykułę', tense: 'Czasy', race: 'Wyścig z czasem', listen: 'Audycja', talk: 'Rozmowa', texts: 'Moje teksty', yg: 'Usłysz w filmie' };
  /* co dawno nie było — do paska na stronie głównej i znaczków „polecane” w Graj */
  function staleList(minDays, withRace) {
    const c = [];
    if (withRace && (D().settings.games || {}).race !== false && learnedWords().length >= 8) c.push('race');
    ['order', 'dictation', 'speak', 'error', 'translate', 'particle'].forEach(k => { if (typeEnabled(k) && !gameNote(k)) c.push(k); });
    if (Object.keys(D().tenseOpen || {}).length) c.push('tense');
    if (AI.enabled()) c.push('listen', 'talk');
    if (Object.keys(D().texts || {}).length) c.push('texts');
    const md = minDays == null ? 4 : minDays;
    return c.map(k => ({ k, d: daysSinceUse(k) })).filter(x => x.d == null || x.d >= md).sort((a, b) => (b.d == null ? 99 : b.d) - (a.d == null ? 99 : a.d) || usage(a.k) - usage(b.k));
  }
  function goStale(k) { if (k === 'tense') go('tenses'); else if (k === 'listen' || k === 'talk' || k === 'texts') go(k); else startPlay(k); }
  /* „Co dalej?” po sesji: 3 rzeczy, których najdawniej nie robiłeś */
  const NEXT_DESC = { race: 'jak najwięcej słów na czas', order: 'gra: kafelki w dobrej kolejności', dictation: 'gra: posłuchaj i zapisz', speak: 'gra: mów do mikrofonu', error: 'gra: wskaż i popraw błąd', translate: 'gra: z polskiego na angielski', particle: 'gra: phrasal verbs', tense: 'lekcje i ćwiczenia czasów', listen: 'minuta słuchania i 4 pytania', talk: 'scenka z AI — mów i dogadaj się', texts: 'czytaj i ucz się z tekstów' };
  function nextIdeasLine() {
    const l = staleList(0, true).slice(0, 3);
    if (!l.length) return '';
    return '<div class="rs-more">Albo spróbuj: ' + l.map((x, i) => '<button class="lnk" data-next="' + x.k + '" title="' + esc(NEXT_DESC[x.k] || '') + ' (' + (i + 1) + ')">' + esc(USE_NAME[x.k]) + '</button>').join(' · ') + ' <span class="small-note">— dawno nie było</span></div>';
  }
  function nextIdeasHtml() {
    const l = staleList(0, true).slice(0, 3);
    if (!l.length) return '';
    const ago = x => x.d == null ? 'dawno albo wcale' : x.d === 0 ? 'dziś już było' : x.d === 1 ? 'ostatnio wczoraj' : 'ostatnio ' + x.d + ' dni temu';
    return '<section class="next-ideas"><h2>Co dalej? <span class="small-note">— to, czego najdawniej nie robiłeś</span></h2><div class="games">' +
      l.map((x, i) => '<button class="btn game raised" data-next="' + x.k + '"><span class="num-key">' + (i + 1) + '</span><b>' + esc(USE_NAME[x.k]) + '</b><small>' + esc(NEXT_DESC[x.k] || '') + '</small><small class="pink">' + ago(x) + '</small></button>').join('') + '</div></section>';
  }
  function newExtraPool() {
    const c = D().cards, lists = { order: [], dictation: [], speak: [], error: [], translate: [], particle: [], tense: [] };
    const learned = WORDS.list.filter(w => c[w.id] && c[w.id].state !== 'known' && (c[w.id].reps || 0) >= 2 && wordLv(w.id) < 5);
    ['order', 'dictation', 'speak', 'translate', 'particle'].filter(typeEnabled).forEach(tp => {
      learned.forEach(w => { if (tp === 'particle' && !isPV(w)) return; const id = PREFIX_OF[tp] + w.id; if (!c[id]) lists[tp].push(id); });
    });
    if (typeEnabled('error')) {
      const gl = levels().grammar;
      [gl, gl - 1, gl + 1].filter(l => l >= 0 && l <= 4).forEach(l => {
        for (let wi = 1; wi <= 3; wi++) GRAMMAR.forEach((g, gi) => {
          if (g.lvl !== l || !g.options[wi] || (ERR_EXCLUDE[g.s] || []).includes(g.options[wi])) return;
          const id = 'err:' + gi + '-' + wi;
          if (!c[id]) lists.error.push(id);
        });
      });
    }
    if (typeEnabled('tense_c')) lists.tense = tensePool(Object.keys(D().tenseOpen || {}).filter(t => TS_BY[t])).filter(id => typeEnabled(itemFor(id).type));
    lists.error = lists.error.filter(id => wordLv('g:' + id.slice(4).split('-')[0]) < 5);
    lists.tense = lists.tense.filter(id => wordLv('ts:' + id.slice(4)) < 5);
    Object.keys(lists).forEach(k => { lists[k] = sortByDiff(lists[k], true); });
    return byUsage(['order', 'tense', 'translate', 'particle', 'error', 'dictation', 'speak'].map(k => ({ key: k, list: lists[k] })));
  }
  function newLeftToday() { return Math.max(0, D().settings.newPerDay - Store.today().newCount); }
  function newExtraLeftToday() { return Math.max(0, (D().settings.newExtraPerDay == null ? 6 : D().settings.newExtraPerDay) - (Store.today().newExtra || 0)); }
  function mastery(lvl) {
    const items = WORDS.list.filter(w => w.lvl === lvl), c = D().cards;
    const m = items.filter(w => c[w.id] && (c[w.id].state === 'known' || (c[w.id].s || 0) >= 10)).length;
    return items.length ? m / items.length : 0;
  }
  function splitSentence(s) { const i = s.indexOf('_'); return [s.slice(0, i), s.slice(i + 1)]; }
  function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); if (el.focus) el.focus(); }
  function progress() {
    try { playerLevelDates(); } catch (e) { } D().progressAt = Date.now(); }

  function matchAnswer(answers, ans) {
    const a = U.norm(ans), acc = answers.map(U.norm);
    if (acc.includes(a)) return 'exact';
    for (const x of acc) if (isTypoOf(a, x)) return 'typo';
    return 'wrong';
  }
  /* słownik słów z bazy — gdy wpisane słowo jest INNYM prawdziwym słowem (was/had, lose/loose), to błąd, nie literówka */
  let VOCAB = null;
  function vocabSet() {
    if (VOCAB) return VOCAB;
    VOCAB = new Set();
    const addTxt = t => String(t || '').toLowerCase().replace(/[’']/g, "'").split(/[^a-z']+/).forEach(x => { if (x) VOCAB.add(x); });
    WORDS.list.forEach(w => { w.answers.forEach(addTxt); addTxt(w.s); });
    (window.GRAMMAR || []).forEach(g => { addTxt(g.s); g.options.forEach(addTxt); });
    (tenseItems().list || []).forEach(t => { addTxt(t.full); t.opts.forEach(addTxt); });
    return VOCAB;
  }
  /* literówka = te same słowa, a w 1–2 z nich drobny błąd pisowni; zamiana całego słowa na inne słowo to błąd */
  function isTypoOf(a, x) {
    if (a === x) return false;
    const A = a.split(' '), X = x.split(' ');
    if (A.length !== X.length) return a.replace(/ /g, '') === x.replace(/ /g, '');
    let diff = 0;
    for (let i = 0; i < X.length; i++) {
      if (A[i] === X[i]) continue;
      diff++;
      const xw = X[i], aw = A[i], d = U.lev(aw, xw);
      if (xw.length < 4 || d > (xw.length >= 6 ? 2 : 1)) return false; // od 6 liter dwie pomyłki to jeszcze literówka (trought → through)
      if (vocabSet().has(aw)) return false;
    }
    return diff >= 1 && diff <= 2;
  }
  const wordsOf = s => U.norm(s).replace(/'/g, '').split(' ').filter(Boolean);
  const wordEq = (x, y) => x === y || (x.length >= 4 && U.lev(x, y) <= 1);
  function listenScore(expected, got) {
    const a = wordsOf(expected), b = wordsOf(got);
    if (!a.length || !b.length) return 0;
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      dp[i][j] = wordEq(a[i - 1], b[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[a.length][b.length] / Math.max(a.length, b.length);
  }
  /* porównanie słowo po słowie do podświetlenia w dyktandzie */
  function wordDiff(expected, got) {
    const A = expected.trim().split(/\s+/), B = got.trim().split(/\s+/).filter(Boolean);
    const nA = A.map(w => U.norm(w).replace(/'/g, '')), nB = B.map(w => U.norm(w).replace(/'/g, ''));
    const dp = Array.from({ length: A.length + 1 }, () => new Array(B.length + 1).fill(0));
    for (let i = 1; i <= A.length; i++) for (let j = 1; j <= B.length; j++)
      dp[i][j] = wordEq(nA[i - 1], nB[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    const aOk = new Array(A.length).fill(false), bOk = new Array(B.length).fill(false);
    const aNear = new Array(A.length).fill(false), bNear = new Array(B.length).fill(false); // literówka w słowie
    let i = A.length, j = B.length;
    while (i > 0 && j > 0) {
      if (wordEq(nA[i - 1], nB[j - 1])) { aOk[i - 1] = bOk[j - 1] = true; if (nA[i - 1] !== nB[j - 1]) aNear[i - 1] = bNear[j - 1] = true; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    return { A, B, aOk, bOk, aNear, bNear };
  }
  function containsTarget(text, answers) {
    const words = wordsOf(text);
    return answers.some(a => {
      const t = wordsOf(a);
      for (let i = 0; i + t.length <= words.length; i++) if (t.every((x, k) => x === words[i + k] || (x.length >= 5 && U.lev(x, words[i + k]) <= 1))) return true;
      return false;
    });
  }

  /* ---------- Klawiatura, komunikaty, okna ---------- */
  let keyHandler = null;
  const K = s => '<span class="kbd">' + s + '</span>';
  /* Lewy Alt + litera (AltGr = Ctrl+Alt zostaje do polskich znaków). e.code nie zależy od układu klawiatury. */
  const altKey = (e, code) => e.altKey && !e.ctrlKey && !e.metaKey && e.code === code;
  const typingInField = () => { const a = document.activeElement; return !!a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName); };
  const plainKey = (e, code) => !e.altKey && !e.ctrlKey && !e.metaKey && e.code === code && !typingInField();
  const onButton = () => !!document.activeElement && document.activeElement.tagName === 'BUTTON';
  document.addEventListener('keydown', e => {
    const ov = document.querySelector('.overlay');
    if (ov) {
      if (e.key === 'Escape') { const c = ov.querySelector('[data-esc]'); if (c) { e.preventDefault(); c.click(); } return; }
      if (e.key === 'Enter' && !onButton()) { const b = ov.querySelector('.btn.primary'); if (b) { e.preventDefault(); b.click(); } }
      return;
    }
    if (e.ctrlKey && !e.altKey && e.code === 'KeyZ') {
      const tb = document.querySelector('.toast button'), a = document.activeElement;
      if (tb && !(a && a.tagName === 'INPUT' && a.value)) { e.preventDefault(); tb.click(); return; }
    }
    if (keyHandler) keyHandler(e);
  });

  let toastTimer = null;
  function toast(msg, action) {
    const ms = typeof action === 'number' ? action : 0; if (ms) action = null;
    const old = document.querySelector('.toast'); if (old) old.remove();
    clearTimeout(toastTimer);
    const el = document.createElement('div');
    el.className = 'toast raised';
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button class="btn small">' + esc(action.label) + ' ' + K('Ctrl+Z') + '</button>' : '');
    document.body.appendChild(el);
    if (action) el.querySelector('button').onclick = () => { el.remove(); action.fn(); };
    toastTimer = setTimeout(() => el.remove(), ms || (action ? 7000 : 3200));
  }
  function modal(html, bind) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = '<div class="modal raised" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(ov);
    const close = () => ov.remove();
    bind(ov, close);
    const f = ov.querySelector('.btn.primary'); if (f) f.focus();
    return close;
  }

  /* ---------- Nawigacja i licznik czasu ---------- */
  let screen = '';
  let S = null;   // bieżąca sesja
  let T = null;   // bieżący test
  let lastInput = Date.now(), ticks = 0;
  ['keydown', 'pointerdown', 'mousemove'].forEach(ev => document.addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true }));
  /* czas nauki: liczy się tylko, gdy okno programu jest aktywne (inny program kliknięty = stop od razu)
     i był ruch myszą / klawiatura w ostatnich 15 s — chyba że mówi lektor, słucha mikrofon albo czekasz na AI */
  const IDLE_SEC = 15, IDLE_SEC_VIDEO = 60;
  const TIME_MOD = { pron: 'ex', talk: 'talk', listen: 'listen', reader: 'texts', trx: 'texts', tense: 'tenses', test: 'test', sweep: 'ex', topic: 'ex' };
  const audioOn = () => { try { return !!(window.speechSynthesis && speechSynthesis.speaking); } catch (e) { return false; } };
  const winActive = () => !document.hidden && (typeof document.hasFocus !== 'function' || document.hasFocus());
  const recentInput = lim => Date.now() - lastInput <= lim * 1000;
  function addSec(mod) { const t = Store.today(); t.sec++; t.secBy = t.secBy || {}; t.secBy[mod] = (t.secBy[mod] || 0) + 1; if (++ticks % 10 === 0) Store.save(); }
  setInterval(() => {
    if (!winActive()) { const el = document.getElementById('rclock'); if (el) el.classList.add('paused'); return; }
    if (TIME_MOD[screen]) {
      if (screen === 'listen' && !(LS && (LS.phase === 'listen' || LS.phase === 'quiz'))) return;
      if (screen === 'talk' && !(TK && TK.phase === 'chat')) return;
      if (recentInput(IDLE_SEC) || audioOn() || (LS && LS.playing) || (TK && (TK.listening || TK.busy))) addSec(TIME_MOD[screen]);
      return;
    }
    if ((screen !== 'exercise' && screen !== 'race' && screen !== 'yg') || !S || S.paused) return;
    const busy = S.listening || S.phase === 'checking' || audioOn() || S.simpBusy;
    if (recentInput(screen === 'yg' ? IDLE_SEC_VIDEO : IDLE_SEC) || busy) { S.activeSec++; addSec('ex'); }
    if (screen === 'race' && S.race) {
      const paused = typingNow() || S.race.phase === 'show';
      if (!paused) S.race.left--;
      const el = document.getElementById('rclock'); if (el) { el.textContent = U.mmss(Math.max(0, S.race.left)); el.classList.toggle('paused', paused); }
      if (S.race.left <= 0) endRace();
    } else updateClock();
  }, 1000);
  window.addEventListener('beforeunload', () => Store.save());
  /* „czas myślenia”: przerwy krótsze niż 2 s między klawiszami w polu odpowiedzi to pisanie — nie liczymy ich */
  const TYPE_GAP = 2000;
  document.addEventListener('keydown', e => {
    if (!S) return;
    const a = document.activeElement;
    if (!a || a.tagName !== 'INPUT' || !(e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete')) return;
    const now = Date.now();
    if (S.lastKeyAt && now - S.lastKeyAt < TYPE_GAP) S.typeMs = (S.typeMs || 0) + (now - S.lastKeyAt);
    S.lastKeyAt = now;
  }, true);
  function thinkElapsed() { return Math.max(0, (Date.now() - S.cardStart - (S.typeMs || 0)) / 1000); }
  function typingNow() { const a = document.activeElement; return !!(S && S.lastKeyAt && Date.now() - S.lastKeyAt < TYPE_GAP && a && a.tagName === 'INPUT' && a.value); }
  function raceSec() { const v = D().settings.raceSec; return [60, 90, 120].indexOf(v) >= 0 ? v : 60; }
  function raceBestFor(sec) { return sec === 60 ? (D().raceBest || 0) : ((D().raceBestBy || {})[sec] || 0); }

  function go(name, arg) {
    keyHandler = null;
    hookClose();
    const tst = document.querySelector('.toast'); if (tst) tst.remove();
    if (screen === 'yg' && name !== 'yg') ygTeardown();
    if (screen === 'reader' && name !== 'reader') stopReading();
    if (screen === 'listen' && name !== 'listen') stopListen();
    if (screen === 'talk' && name !== 'talk') stopTalkAudio();
    if (screen === 'trx' && name !== 'trx' && TR && TR.mic) { Recog.stop(); TR.mic = null; }
    registerCustom();
    screen = name; document.documentElement.dataset.scr = name;
    window.scrollTo(0, 0);
    ({ welcome: renderWelcome, home: renderHome, exercise: renderExercise, race: renderRace, result: renderResult, settings: renderSettings,
       play: renderPlayMenu, yg: renderYG, words: renderWords, trx: renderTrx, mistakes: renderMistakes, stats: renderStats, texts: renderTexts, reader: renderReader, listen: renderListen, report: renderReport, tenses: renderTenses, tense: renderTenseLesson, talk: renderTalk, guide: renderGuide, pron: renderPron, sweep: renderSweep, topic: renderTopic })[name](arg);
    qaFabSync();
  }

  /* ================= EKRAN POWITALNY ================= */
  function renderWelcome() {
    screen = 'welcome';
    app.innerHTML =
      '<div class="welcome"><div class="modal raised">' +
      '<div class="logo raised">' + IC.spark + '</div>' +
      '<h1 style="font-size:36px">Angielski codziennie</h1>' +
      '<p class="muted" style="margin:0;font-size:18px;line-height:1.5">Na początek krótki test (ok. 10 minut): słownictwo, gramatyka i słuchanie. Program dopasuje ćwiczenia do Twojego poziomu.</p>' +
      '<div class="answer-box"><label for="name">Jak masz na imię?</label><input id="name" class="txt" style="height:56px;font-size:18px" value="' + esc(D().profile.name) + '" autocomplete="given-name"></div>' +
      '<button class="btn big primary" id="startTest">' + IC.play + ' Zrób test poziomu</button>' +
      '<button class="btn" id="skip">Pomiń test — wybiorę poziom sam</button>' +
      '<div id="pick" hidden class="col" style="align-items:center">' +
      '<div class="lvl-pills">' + L.map((l, i) => '<button class="btn pill" data-l="' + i + '">' + l + '</button>').join('') + '</div>' +
      '<span class="small-note">A1 — podstawy · B1 — dogadujesz się w codziennych sprawach · C1 — swobodnie</span></div>' +
      (Sync.supported ? '<button class="btn small" id="fromDrive">' + IC.cloud + ' Masz już postępy na Dysku Google? Wczytaj je</button>' : '') +
      (Store.ok ? '' : '<p class="small-note" style="color:var(--bad-ink)">Przeglądarka blokuje zapis danych — postępy nie będą zapamiętane. Otwórz program w Chrome lub Edge.</p>') +
      '</div></div>';
    const saveName = () => { D().profile.name = $('#name').value.trim(); Store.save(); };
    $('#startTest').onclick = () => { saveName(); startTest(); };
    $('#skip').onclick = () => { $('#pick').hidden = false; };
    $$('#pick [data-l]').forEach(b => b.onclick = () => {
      saveName();
      const l = +b.dataset.l;
      D().profile.levels = { vocab: l, grammar: l, listening: l, speaking: l };
      D().profile.placementDone = true;
      (D().levelHist = D().levelHist || []).push({ at: Date.now(), kind: 'start', levels: Object.assign({}, D().profile.levels) });
      Store.save(); go('home');
    });
    if ($('#fromDrive')) $('#fromDrive').onclick = () => pickSyncFolder(true);
  }

  /* ================= TEST POZIOMU ================= */
  function startTest(monthly) {
    T = {
      monthly: !!monthly, section: 0, q: 0, lvl: monthly ? levels().vocab : 2, used: new Set(),
      sections: [{ key: 'vocab', name: 'Słownictwo', n: 10 }, { key: 'grammar', name: 'Gramatyka', n: 8 }, { key: 'listening', name: 'Słuchanie', n: 6 }],
      log: { vocab: [], grammar: [], listening: [] }, current: null
    };
    nextTestQ();
  }
  function pickTestItem(key, lvl) {
    if (key === 'grammar') {
      let pool = GRAMMAR.filter(g => g.lvl === lvl && !T.used.has(g.s));
      if (!pool.length) pool = GRAMMAR.filter(g => !T.used.has(g.s));
      const g = pool[Math.floor(Math.random() * pool.length)];
      T.used.add(g.s);
      return { g, options: U.shuffle(g.options) };
    }
    let pool = WORDS.list.filter(w => w.lvl === lvl && !T.used.has(w.id) && !(T.monthly && D().cards[w.id]));
    if (!pool.length) pool = WORDS.list.filter(w => w.lvl === lvl && !T.used.has(w.id));
    if (!pool.length) pool = WORDS.list.filter(w => !T.used.has(w.id));
    const w = pool[Math.floor(Math.random() * pool.length)];
    T.used.add(w.id);
    return { w };
  }
  function nextTestQ() {
    if (T.q >= T.sections[T.section].n) {
      T.section++; T.q = 0;
      if (T.section >= T.sections.length) return finishTest();
      T.lvl = T.monthly ? levels()[T.sections[T.section].key] : 2;
    }
    T.current = pickTestItem(T.sections[T.section].key, T.lvl);
    renderTest();
  }
  function answerTest(correct) {
    const sec = T.sections[T.section];
    T.log[sec.key].push({ lvl: T.lvl, correct, id: T.current.w ? T.current.w.id : null });
    T.lvl = correct ? Math.min(4, T.lvl + 1) : Math.max(0, T.lvl - 1);
    T.q++;
    nextTestQ();
  }
  function estimate(log) {
    let best = 0;
    for (let l = 0; l < 5; l++) {
      const a = log.filter(x => x.lvl === l), c = a.filter(x => x.correct).length;
      if (c >= 2 && c / a.length >= 0.6) best = l;
    }
    return best;
  }
  function renderTest() {
    screen = 'test'; keyHandler = null;
    const sec = T.sections[T.section], cur = T.current;
    const steps = Array.from({ length: sec.n }, (_, i) => '<div class="' + (i < T.q ? 'done' : i === T.q ? 'now' : '') + '"></div>').join('');
    let body = '';
    if (sec.key === 'vocab') {
      const [a, b] = splitSentence(cur.w.s);
      body =
        '<div><div class="prompt-lbl">Uzupełnij zdanie słowem:</div><div class="prompt-word">' + esc(cur.w.pl) + '</div></div>' +
        '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">______</span><span>' + esc(b) + '</span></div>' +
        '<div class="answer-box"><label for="ans">Twoja odpowiedź po angielsku</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off"></div>' +
        '<div class="row center"><button class="btn" id="idk">Nie wiem ' + K('Alt+W') + '</button><button class="btn primary" id="ok">Dalej ' + K('Enter') + '</button></div>';
    } else if (sec.key === 'grammar') {
      const [a, b] = splitSentence(cur.g.s);
      body =
        '<div class="prompt-lbl">Wybierz poprawną odpowiedź:</div>' +
        '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">______</span><span>' + esc(b) + '</span></div>' +
        '<div class="options">' + cur.options.map((o, i) => '<button class="btn" data-i="' + i + '"><span class="k">' + (i + 1) + '</span>' + esc(o) + '</button>').join('') + '</div>' +
        '<button class="btn" id="idk">Nie wiem ' + K('Alt+W') + '</button>';
    } else {
      body =
        '<div class="prompt-lbl">Posłuchaj i wpisz zdanie, które usłyszysz:</div>' +
        '<button class="btn play-big primary" id="play" aria-label="Odtwórz nagranie (Alt+S)">' + IC.speakerBig + '</button>' +
        '<div class="hint" style="margin-top:-12px">' + K('Alt+S') + ' odtwórz ponownie</div>' +
        '<div class="answer-box" style="max-width:720px"><label for="ans">Co usłyszałeś?</label><input id="ans" class="answer" style="font-size:22px" autocomplete="off" spellcheck="false" autocapitalize="off"></div>' +
        '<div class="row center"><button class="btn" id="idk">Nie wiem ' + K('Alt+W') + '</button><button class="btn primary" id="ok">Dalej ' + K('Enter') + '</button></div>' +
        (Speech.supported ? '' : '<p class="hint">Ta przeglądarka nie odtwarza mowy — użyj Chrome lub Edge.</p>');
    }
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<div class="ex-head"><button class="btn" id="quit">' + IC.back + ' Przerwij ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>' + (T.monthly ? 'Test miesiąca' : 'Test poziomu') + ' · ' + sec.name + '</b><span>Część ' + (T.section + 1) + ' z 3 · pytanie ' + (T.q + 1) + ' z ' + sec.n + '</span></div>' +
      '<div style="width:130px"></div></div>' +
      '<div class="steps inset" style="grid-template-columns:repeat(' + sec.n + ',minmax(0,1fr))">' + steps + '</div>' +
      '<main class="ex-card raised"><div class="tag inset">' + esc(sec.name.toUpperCase()) + '</div>' + body + '</main>' +
      '<p class="small-note" style="text-align:center">W teście nie ma podpowiedzi ani ocen po każdym pytaniu. Jeśli nie wiesz — kliknij „Nie wiem” zamiast zgadywać.</p>' +
      '</div>';
    $('#quit').onclick = () => { T = null; if (D().profile.placementDone) go('home'); else renderWelcome(); };
    $('#idk').onclick = () => answerTest(false);
    const btns = $$('[data-i]');
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#quit').click(); return; }
      if (altKey(e, 'KeyW')) { e.preventDefault(); answerTest(false); return; }
      if (sec.key === 'listening' && altKey(e, 'KeyS')) { e.preventDefault(); $('#play').click(); return; }
      if (sec.key === 'grammar' && !e.altKey && !e.ctrlKey && !e.metaKey) { const n = +e.key; if (n >= 1 && n <= btns.length) btns[n - 1].click(); }
    };
    if (sec.key === 'grammar') {
      btns.forEach(b => b.onclick = () => answerTest(cur.options[+b.dataset.i] === cur.g.correct));
      return;
    }
    const inp = $('#ans');
    let submitT;
    if (sec.key === 'vocab') {
      submitT = () => { if (!inp.value.trim()) return shake(inp); answerTest(matchAnswer(cur.w.answers, inp.value) !== 'wrong'); };
    } else {
      const full = cur.w.s.replace('_', cur.w.answers[0]);
      const play = () => { Speech.speak(full, (D().settings.rate || 0.95) * 0.95); inp.focus(); };
      $('#play').onclick = play;
      setTimeout(play, 350);
      submitT = () => { if (!inp.value.trim()) return shake(inp); answerTest(listenScore(full, inp.value) >= 0.85); };
    }
    $('#ok').onclick = submitT;
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submitT(); } }; // stop: ten sam Enter nie może zamknąć ekranu wyniku
    inp.focus();
  }
  function finishTest() {
    if (T.monthly) return finishMonthly();
    const lv = { vocab: estimate(T.log.vocab), grammar: estimate(T.log.grammar), listening: estimate(T.log.listening) };
    lv.speaking = lv.listening;
    const p = D().profile;
    p.levels = lv; p.placementDone = true; p.hist = {};
    (D().levelHist = D().levelHist || []).push({ at: Date.now(), kind: 'placement', levels: Object.assign({}, lv), test: Object.assign({}, lv) });
    T.log.vocab.filter(x => x.correct && x.id && !D().cards[x.id]).forEach(x => {
      D().cards[x.id] = Object.assign(FSRS.review(null, 3), { added: Date.now() });
    });
    progress(); Store.save();
    T = null;
    screen = 'testResult';
    const tile = (name, l, c) =>
      '<div class="skill raised" style="height:220px"><div class="name">' + name + '</div>' +
      '<div class="fill" style="height:' + Math.round((l + 1) / 5 * 70) + '%;background:' + c + '"></div>' +
      '<div class="val"><b>' + L[l] + '</b></div></div>';
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header style="text-align:center"><h1 style="font-size:40px">Twój poziom</h1>' +
      '<p class="muted" style="font-size:18px;margin:8px 0 0">Słówka zaczniemy od poziomu ' + L[lv.vocab] + '. Program będzie się dalej dopasowywał do Ciebie.</p></header>' +
      '<div class="skills">' + tile('Słownictwo', lv.vocab, '#CFCAC1') + tile('Gramatyka', lv.grammar, '#D6CDCD') + tile('Słuchanie', lv.listening, '#CAD1C8') + '</div>' +
      '<p class="small-note" style="text-align:center">Gry na gramatykę, słuchanie i mówienie odblokowują się, gdy poznasz pierwsze słówka. Poziomy rosną same, gdy dobrze Ci idzie.</p>' +
      '<div class="row center"><button class="btn big primary" id="go">' + IC.play + ' Zacznij naukę ' + K('Enter') + '</button></div>' +
      '</div>';
    $('#go').onclick = () => go('home');
    $('#go').focus();
  }

  /* ================= EKRAN GŁÓWNY ================= */
  /* ---------- Kamienie milowe: trzy ścieżki z uzasadnieniem (upd184) ---------- */
  const MILES = {
    w: { name: 'Słowa', sub: 'ile rozumiesz', tag: 'SŁOWA', unit: n => n === 1 ? 'słowo' : 'słów', steps: [100, 500, 1000, 2000, 3000], cls: 'w',
      title: n => 'Znasz już ' + fmtNum(n) + ' słów!',
      why: {
        100: '100 najczęstszych słów angielskich (the, and, have, it…) to ok. połowa każdego tekstu. Masz już fundament, na którym stoi prawie każde zdanie.',
        500: '500 najczęstszych słów to szkielet prostych rozmów — przedstawisz się, zapytasz o drogę, zamówisz w kawiarni. Pokrywają one ok. 70% słów w zwykłej codziennej rozmowie.',
        1000: '1000 najczęstszych słów to ok. 80–85% słów w zwykłej codziennej rozmowie. Większość tego, co słyszysz na co dzień, składa się już ze słów, które znasz — resztę coraz częściej odgadniesz z kontekstu.',
        2000: '2000 najczęstszych słów to ok. 90% słów w codziennej rozmowie. Nieznane słowo trafia się średnio co kilka zdań i zwykle da się je odgadnąć z kontekstu.',
        3000: '3000 słów to ok. 95% słów w rozmowie — próg, od którego badacze uznają, że rozmowę rozumie się swobodnie, z nielicznymi lukami.'
      },
      src: () => 'Źródło: badania częstości słów (P. Nation, Victoria University of Wellington) — przybliżenie: badania liczą rodziny słów, program liczy słowa i zwroty.',
      next: { 100: 'ok. połowa każdego tekstu', 500: 'ok. 70% codziennej rozmowy', 1000: 'ok. 80–85% codziennej rozmowy', 2000: 'ok. 90% codziennej rozmowy', 3000: 'ok. 95% — swobodne rozumienie rozmowy' } },
    h: { name: 'Godziny', sub: 'droga do poziomu', tag: 'GODZINY NAUKI', unit: () => 'godzin', steps: [50, 100, 200, 400, 600], cls: 'h', suf: ' h',
      title: n => fmtNum(n) + ' godzin nauki',
      why: {
        50: 'Cambridge szacuje, że na poziom A2 potrzeba łącznie ok. 180–200 godzin nauki. 50 godzin to już ćwierć tej drogi.',
        100: 'Cambridge szacuje, że na poziom A2 potrzeba łącznie ok. 180–200 godzin nauki, a na B1 ok. 350–400. Masz za sobą ponad połowę drogi do A2.',
        200: 'Tyle według Cambridge wystarcza na poziom A2 (ok. 180–200 godzin). Na B1 potrzeba łącznie ok. 350–400 godzin — jesteś w połowie drogi.',
        400: 'Tyle według Cambridge potrzeba na poziom B1 (ok. 350–400 godzin). Na B2 — poziom swobodnej rozmowy na większość tematów — ok. 500–600 godzin.',
        600: 'Tyle według Cambridge potrzeba na poziom B2 (ok. 500–600 godzin) — swobodna rozmowa na większość tematów. Na C1: ok. 700–800 godzin.'
      },
      src: () => 'Źródło: Cambridge English — orientacyjny łączny czas nauki („guided learning hours”) dla poziomów CEFR; to punkt odniesienia, nie norma.',
      next: { 50: 'ćwierć drogi do A2 według Cambridge', 100: 'ponad połowa drogi do A2 według Cambridge', 200: 'poziom A2 według Cambridge', 400: 'poziom B1 według Cambridge', 600: 'poziom B2 według Cambridge' } },
    d: { name: 'Dni nauki', sub: 'nawyk', tag: 'DNI NAUKI', unit: () => 'dni', steps: [7, 30, 66, 100, 365], cls: 'd',
      title: n => n === 365 ? 'Rok z angielskim!' : n + ' dni z angielskim',
      why: {
        7: 'Pierwszy tydzień nauki za Tobą. Na początku nauka wymaga jeszcze wysiłku woli — każdy kolejny dzień wzmacnia nawyk.',
        30: 'Miesiąc nauki. Średni czas utrwalenia nawyku to według badań 66 dni — masz za sobą prawie połowę tej drogi.',
        66: 'Według badań to średni czas, po którym codzienna czynność staje się nawykiem — robisz ją już bez wysiłku woli. Nauka przestaje być postanowieniem, a staje się częścią dnia.',
        100: 'Nauka jest już nawykiem, a powtórki w rosnących odstępach pracują na pamięć długotrwałą — słowa sprzed miesięcy wracają coraz rzadziej, bo je pamiętasz.',
        365: 'Regularność daje więcej niż długie, rzadkie sesje — to jedna z najlepiej potwierdzonych zasad nauki (efekt rozłożenia nauki w czasie). Rok takiej pracy to solidny fundament.'
      },
      src: n => n === 365 ? 'Źródło: efekt rozłożenia nauki w czasie (spacing effect), m.in. Cepeda i in., 2006.' : 'Źródło: Lally i in., University College London, 2010 (średnio 66 dni, rozrzut 18–254).',
      next: { 7: 'pierwszy tydzień', 30: 'miesiąc — prawie połowa drogi do nawyku', 66: 'średni czas, po którym nauka staje się nawykiem', 100: 'nauka jako trwały nawyk', 365: 'rok z angielskim' } }
  };
  function milesNow() {
    const days = D().days, ks = Object.keys(days);
    return { w: bkWords().length, h: Math.floor(ks.reduce((a, k) => a + (days[k].sec || 0), 0) / 3600), d: ks.filter(k => isStudyDay(days[k])).length };
  }
  /* daty zdobycia odtworzone z historii (przy pierwszym uruchomieniu) */
  function milesBackfill() {
    const out = { w: {}, h: {}, d: {} }, days = D().days, ks = Object.keys(days).sort();
    let sec = 0, nd = 0;
    ks.forEach(k => {
      const t = new Date(k + 'T12:00:00').getTime(), x = days[k];
      sec += x.sec || 0; if (isStudyDay(x)) nd++;
      MILES.h.steps.forEach(s => { if (!out.h[s] && sec >= s * 3600) out.h[s] = t; });
      MILES.d.steps.forEach(s => { if (!out.d[s] && nd >= s) out.d[s] = t; });
    });
    const c = D().cards, ts = bkWords().map(w => { const x = c[w.id]; return x.added || x.knownAt || x.last || Date.now(); }).sort((a, b) => a - b);
    MILES.w.steps.forEach(s => { if (ts.length >= s) out.w[s] = ts[s - 1]; });
    return out;
  }
  /* sprawdza nowe kamienie; zwraca listę do pokazania */
  function milesTick() {
    const d = D();
    if (!d.miles) { d.miles = milesBackfill(); Store.save(); return []; }
    const now = milesNow(), fresh = [];
    ['w', 'h', 'd'].forEach(k => { const got = d.miles[k] = d.miles[k] || {}; MILES[k].steps.forEach(s => { if (now[k] >= s && !got[s]) { got[s] = Date.now(); fresh.push({ k, s }); } }); });
    if (fresh.length) Store.save();
    return fresh;
  }
  /* cel dzienny zaliczony: raz dziennie, przy pierwszym wejściu na stronę główną po przekroczeniu celu — zielone okienko + fanfara (upd234) */
  /* po wejściu: informacja o zużytych dniach ochrony (raz dla każdego chronionego dnia) (upd251) */
  function shieldShow() {
    const d = D(), SI = streakInfo(), seen = d.shSeen = d.shSeen || {}, fresh = Object.keys(SI.prot).filter(k => !seen[k]).sort();
    if (!fresh.length || document.querySelector('.mi-ov, .gd-ov, .overlay')) return false;
    fresh.forEach(k => { seen[k] = 1; }); Store.save();
    const fd = k => new Date(k + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });
    const SH = '<svg viewBox="0 0 24 24" width="56" height="56" fill="#E8A33D" stroke="none"><path d="M12 2.5l7.5 3.2v5.3c0 4.8-3.2 8.6-7.5 10.6-4.3-2-7.5-5.8-7.5-10.6V5.7z"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
    modal('<div class="sh-mod">' + SH + '<h2>Ochrona uratowała Twoją serię</h2><p>' + (fresh.length === 1 ? 'Zużyty 1 dzień ochrony' : 'Zużyte ' + fresh.length + ' dni ochrony') + ': ' + fresh.map(fd).join(', ') + '.</p>' +
      '<p class="small-note">Seria trwa: <b>' + SI.cur + ' ' + (SI.cur === 1 ? 'dzień' : 'dni') + '</b> · zostało ' + SI.shields + ' ' + (SI.shields === 1 ? 'dzień' : 'dni') + ' ochrony.</p>' +
      '<div class="row" style="justify-content:center;margin-top:14px"><button class="btn primary" id="shOk" data-esc>Dalej ' + K('Enter') + '</button></div></div>', (ov, close) => { ov.querySelector('#shOk').onclick = close; });
    return true;
  }
  function goalShow() {
    const d = D(), t = Store.today(), dk = U.dayKey(Date.now()), goal = d.settings.goalMin;
    if (d.goalShown === dk || (t.sec || 0) < goal * 60 || document.querySelector('.mi-ov, .gd-ov, .overlay')) return;
    d.goalShown = dk; Store.save();
    const gd = goalDays(), ks = Object.keys(d.days).sort().reverse(); let run = 0;
    for (let i = 0; i < 400; i++) { const x = d.days[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (x && (x.sec || 0) >= goal * 60) run++; else if (i > 0) break; else break; }
    const ov = document.createElement('div'); ov.className = 'gd-ov';
    ov.innerHTML = '<div class="gd-card"><div class="gdo-ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h2>Cel dzienny zaliczony</h2>' +
      '<p>Dziś ' + fmtHM(Math.floor(t.sec / 60)) + ' nauki' + (run >= 2 ? ' · ' + run + ' dni z rzędu z celem' : '') + '</p><button class="btn" id="gdOk">Dalej ' + K('Enter') + '</button></div>';
    document.body.appendChild(ov);
    try { Sound.play('fanfare'); } catch (e) { }
    const close = () => { document.removeEventListener('keydown', kh, true); ov.remove(); };
    const kh = e => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); close(); } else e.stopPropagation(); };
    document.addEventListener('keydown', kh, true);
    ov.onclick = e => { if (e.target === ov) close(); };
    ov.querySelector('#gdOk').onclick = close;
  }
  function milesShow(list) {
    if (!list || !list.length || document.querySelector('.mi-ov')) return;
    const { k, s } = list[0], M = MILES[k], now = milesNow()[k];
    const nx = M.steps.find(x => x > s), pct = nx ? Math.max(2, Math.min(100, Math.round((now - s) / (nx - s) * 100))) : 100;
    const ov = document.createElement('div'); ov.className = 'mi-ov';
    ov.innerHTML = '<div class="mi-box"><section class="mi-card mi-' + M.cls + '"><div class="mi-medal">' + fmtNum(s) + '<small>' + (k === 'h' ? 'godzin' : M.unit(s)) + '</small></div>' +
      '<div class="mi-tx"><div class="mi-tag">KAMIEŃ MILOWY · ' + M.tag + '</div><h1>' + esc(M.title(s)) + '</h1><p>' + esc(M.why[s]) + '</p><div class="mi-src">' + esc(M.src(s)) + '</div>' +
      (nx ? '<div class="mi-nx"><span>' + fmtNum(s) + (M.suf || '') + '</span><div class="mi-bar"><div style="width:' + pct + '%"></div></div><span>następny: ' + fmtNum(nx) + (M.suf || ' ' + M.unit(nx)) + '</span></div>' : '<div class="mi-nx"><span>To ostatni kamień na tej ścieżce — gratulacje!</span></div>') + '</div></section>' +
      '<div class="mi-btns"><button class="btn primary" id="miOk">' + (list.length > 1 ? 'Dalej (' + (list.length - 1) + ' więcej) ' : 'Dalej ') + K('Enter') + '</button></div></div>';
    document.body.appendChild(ov);
    try { Sound.play('combo'); } catch (e) { }
    const close = () => { document.removeEventListener('keydown', kh, true); ov.remove(); if (list.length > 1) setTimeout(() => milesShow(list.slice(1)), 250); else if (screen === 'home') setTimeout(() => { if (!shieldShow()) goalShow(); }, 250); };
    const kh = e => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); close(); } else e.stopPropagation(); };
    document.addEventListener('keydown', kh, true);
    ov.querySelector('#miOk').onclick = close;
    ov.querySelector('#miOk').focus();
  }
  function milesHtml() {
    const d = D(); if (!d.miles) milesTick();
    const got = d.miles || { w: {}, h: {}, d: {} }, now = milesNow();
    const fd = t => new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }).replace('.', '');
    let total = 0, have = 0;
    const per14 = k => { let a = 0; for (let i = 0; i < 14; i++) { const x = d.days[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (x) a += k === 'h' ? (x.sec || 0) / 3600 : (x.newCount || 0); } return a / 14; };
    const rows = ['w', 'h', 'd'].map(k => {
      const M = MILES[k], g = got[k] || {}, nx = M.steps.find(s => !g[s]);
      const chain = M.steps.map((s, i) => {
        total++; if (g[s]) have++;
        const cls = g[s] ? 'on' : s === nx ? 'nxt' : 'off';
        const lbl = s + (M.suf || '');
        const sm = g[s] ? fd(g[s]) : s === nx ? Math.min(now[k], s) + ' / ' + s : '';
        return (i ? '<span class="mi-ln' + (g[s] ? ' on' : '') + '"></span>' : '') + '<span class="mi-m mi-' + M.cls + ' ' + cls + '" title="' + esc(M.next[s]) + '">' + lbl + (sm ? '<small>' + sm + '</small>' : '') + '</span>';
      }).join('');
      let eta = '';
      if (nx && k !== 'd') { const p = per14(k); if (p > 0.05) { const t = U.addDays(U.startOfDay(), Math.ceil((nx - now[k]) / p)); eta = ' · przy obecnym tempie ok. ' + new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }); } }
      const note = nx ? 'Następny: ' + fmtNum(nx) + (M.suf || ' ' + M.unit(nx)) + ' — ' + M.next[nx] + eta : 'Wszystkie kamienie na tej ścieżce zdobyte 🏆';
      return '<div class="mi-trk"><div class="mi-t"><b class="mi-c-' + M.cls + '">' + M.name + '</b><span>' + M.sub + '</span></div><div><div class="mi-chain">' + chain + '</div><div class="small-note mi-next">' + esc(note) + '</div></div></div>';
    }).join('');
    return '<div class="row between"><h2>Kamienie milowe</h2><span class="small-note">zdobyte ' + have + ' z ' + total + '</span></div>' + rows;
  }
  function renderHome() {
    guideLoad(); document.documentElement.dataset.scr = 'home';
    if (maybeWeeklyReport()) return;
    const d = D(), t = Store.today(), st = d.settings;
    { const nm = milesTick(); if (nm.length) setTimeout(() => milesShow(nm), 300); else if (!shieldShow()) goalShow(); }
    Store.save();
    const goalSec = st.goalMin * 60;
    const pct = Math.min(100, Math.round(t.sec / goalSec * 100));
    const now = new Date();
    const due = Math.min(dueIds().length, reviewCap());
    const freshW = Math.min(newLeftToday(), newPool().length);
    const freshX = Math.min(newExtraLeftToday(), newExtraPool().length);
    const lv = levels();
    const name = d.profile.name;
    const nothing = due + freshW + freshX === 0;

    const vm = Math.round(mastery(lv.vocab) * 100);
    /* kolumny: pasy A1–C1, wypełnione do poziomu + postęp w bieżącym pasie (słownictwo: część słów poziomu; reszta: postęp do awansu) */
    const promoPct = sk => {
      if (lv[sk] >= L.length - 1) return 100;
      if (promoteReady(sk)) return 100;
      const s = promoteStatus(sk), PD = PROMO_GAP;
      const parts = [Math.min(1, s.n / PROMO_N), s.acc == null ? 0 : Math.min(1, s.acc / PROMO_ACC), Math.min(1, s.days / PROMO_DAYS), Math.min(1, (PD - s.wait) / PD)];
      return Math.round(Math.min.apply(null, parts) * 100); // najsłabszy warunek decyduje (uczciwiej niż średnia)
    };
    const promoTip = sk => { const s = promoteStatus(sk), a = accuracy(sk); return 'Do awansu: odpowiedzi ' + Math.min(s.n, PROMO_N) + '/' + PROMO_N + ' · trafność ' + (s.acc == null ? '—' : Math.round(s.acc * 100) + '%') + ' (min. ' + Math.round(PROMO_ACC * 100) + '%) · dni nauki ' + Math.min(s.days, PROMO_DAYS) + '/' + PROMO_DAYS + (s.wait ? ' · jeszcze ' + s.wait + ' dni od ostatniej zmiany' : '') + (a != null ? '\nTrafność ostatnio: ' + a + '%' : ''); };
    const top = lv => lv >= L.length - 1;
    const skTile = (sk, nm, c, dim) => {
      const p = dim ? 0 : promoPct(sk);
      return { sk, name: nm, lv: lv[sk], p, c, dim, small: dim ? 'wyłączone' : top(lv[sk]) ? 'najwyższy poziom' : 'do ' + L[lv[sk] + 1] + ': ' + p + '%', tip: dim ? '' : promoTip(sk), per: L.map((x, i) => skLvPct(sk, i)) };
    };
    const tiles = [
      { sk: 'vocab', name: 'Słownictwo', lv: lv.vocab, p: vm, c: SK_COLORS.vocab, small: vm + '% słów ' + L[lv.vocab], tip: 'Znasz ' + vm + '% słów poziomu ' + L[lv.vocab] + ' z bazy programu.',
        per: (function () { const rows = vocabMap().rows; return rows.map(r => r.total ? Math.round((r.mast + r.known) / r.total * 100) : 0); })() },
      skTile('grammar', 'Gramatyka', SK_COLORS.grammar, !typeEnabled('order') && !typeEnabled('error')),
      skTile('listening', 'Słuchanie', SK_COLORS.listening, !typeEnabled('dictation')),
      skTile('speaking', 'Mówienie', SK_COLORS.speaking, !typeEnabled('speak'))
    ].map(s => {
      let bands = '';
      for (let i = L.length - 1; i >= 0; i--) {
        const h = s.dim ? 0 : s.per[i] || 0; // każdy poziom osobno: etykieta · cienki pasek · procent (upd229)
        bands += '<div class="sk-r' + (i === s.lv ? ' cur' : '') + '"><b>' + L[i] + '</b><span class="sk-trk"><i style="width:' + h + '%;background:' + s.c + '"></i></span><span>' + (h ? h + '%' : '') + '</span></div>';
      }
      const tip = s.tip + (s.sk === 'vocab' ? '\nPasy: część słów każdego poziomu, które znasz.' : '\nPasy: na każdym poziomie pełny = ' + LV_N + ' odpowiedzi z trafnością min. ' + Math.round(PROMO_ACC * 100) + '%.');
      return '<div class="skill inset v2' + (s.dim ? ' dim' : '') + '" title="' + esc(tip) + '"><div class="hd"><div class="name">' + s.name + '</div><b>' + L[s.lv] + '</b><small>' + s.small + '</small></div><div class="sk-rows">' + bands + '</div></div>';
    }).join('');

    const SI = streakInfo();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1), daysIn = new Date(y, m + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7;
    let cal = '';
    for (let i = 0; i < offset; i++) cal += '<div class="cal-day"></div>';
    for (let dd = 1; dd <= daysIn; dd++) {
      const k = U.dayKey(new Date(y, m, dd));
      const cls = (isStudyDay(d.days[k]) ? ' done' : '') + (SI.prot[k] ? ' prot' : '') + (dd === now.getDate() ? ' is-today' : '');
      cal += SI.prot[k] && dd !== now.getDate() ? '<div class="cal-day prot" title="dzień chroniony — ochrona uratowała serię"><svg viewBox="0 0 24 24" width="30" height="30" fill="#E8A33D" stroke="none"><path d="M12 2.5l7.5 3.2v5.3c0 4.8-3.2 8.6-7.5 10.6-4.3-2-7.5-5.8-7.5-10.6V5.7z"/></svg><span>' + dd + '</span></div>' : '<div class="cal-day' + cls + '">' + dd + '</div>';
    }
    const str = streak();
    const hasSync = !!st.syncFolder;
    const needBackup = !hasSync && Object.keys(d.cards).length >= 20 && Date.now() - (d.lastBackup || 0) > 7 * U.DAY;

    app.innerHTML =
      '<div class="wrap">' +
      '<header class="top">' + wodHtml() +
      '<div class="row top-r" style="gap:18px"><div class="sw-col">' +
      '<span id="syncChipBox">' + syncChipHtml() + '</span>' +
      '<span id="aiChipBox">' + aiChipHtml() + '</span></div>' +
      '<button class="btn round" id="settings" aria-label="Ustawienia (O)" title="Ustawienia (O)">' + IC.gear + '</button></div></header>' +

      '<section class="today2">' +
      weekHtml() +
      '<div class="t2-plan"><h4>Plan na dziś</h4><div><span>Powtórki</span><b>' + due + '</b></div><div><span>Nowe słowa</span><b>' + freshW + '</b></div><div><span>Nowe ćwiczenia</span><b>' + freshX + '</b></div></div>' +
      '<div class="t2-right"><div class="t2-act">' +
      guideHomeBtn() +
      '<div class="t2-main">' +
      (nothing
        ? (function () { const td = Store.today(), mn = Math.round((td.sec || 0) / 60), nw = (td.newCount || 0) + (td.newExtra || 0), parts = [];
            if (mn) parts.push(mn + ' min'); if (td.reviews) parts.push(td.reviews + ' ' + (td.reviews === 1 ? 'powtórka' : td.reviews % 10 >= 2 && td.reviews % 10 <= 4 && (td.reviews % 100 < 12 || td.reviews % 100 > 14) ? 'powtórki' : 'powtórek')); if (nw) parts.push(nw + ' ' + (nw === 1 ? 'nowe słowo' : nw % 10 >= 2 && nw % 10 <= 4 && (nw % 100 < 12 || nw % 100 > 14) ? 'nowe słowa' : 'nowych słów'));
            return '<div class="t2-done"><span class="t2-done-ic">' + IC.check + '</span><div class="t2-done-tx"><b>Plan na dziś zrobiony</b>' + (parts.length ? '<small>' + parts.map(x => '<span>' + x + '</span>').join(' · ') + '</small>' : '') + '</div>' +
              '<button class="btn" id="extra" title="Porcja nowych słów ponad dzienny plan">Więcej słów ' + K('Enter') + '</button></div>'; })()
        : '<button class="btn big primary t2-go" id="start">Zacznij sesję ' + K('Enter') + '</button>' +
          '<button class="btn t2-quick" id="quick">Szybka sesja · ' + st.blockMin + ' min ' + K('S') + '</button>') +
      '</div></div>' +
      '</div>' +
      '<div class="t2-goal"><span>Cel dzienny <b>' + st.goalMin + ' min</b></span><div class="bar thin inset gbar" title="Dziś ' + Math.floor(t.sec / 60) + ' z ' + st.goalMin + ' min (' + pct + '%)"><div style="width:' + pct + '%"></div></div><div class="gcirc' + (t.sec >= st.goalMin * 60 ? ' gok' : ' inset') + '" title="Dzisiaj ' + fmtHM(Math.floor(t.sec / 60)) + ' nauki">' + fmtClock(Math.floor(t.sec / 60)) + '</div></div>' +
      '</section>' +
      '<nav class="nav-tiles" aria-label="Więcej"><span class="nav-sep" aria-hidden="true"></span>' +
      navTile('texts', IC.doc, 'Moje teksty', 'czytaj i tłumacz z AI', 'K') +
      navTile('play', IC.gamepad, 'Graj', 'wybierz grę, bez limitu', 'G') +
      navTile('tenses', IC.clock, 'Czasy', 'oś czasu i ćwiczenia w zdaniach', 'C') +
      navTile('stats', IC.chart, 'Statystyki', 'tydzień, miesiąc, rekordy', 'T', 'tint') +
      navTile('words', IC.book, 'Moje słówka', 'dodaj własne słowa', 'M') +
      navTile('talk', IC.chat, 'Rozmowa', 'scenki z AI — mów i dogadaj się', 'R') +
      navTile('listen', IC.headphones, 'Audycja', 'minuta słuchania i 4 pytania', 'A') +
      navTile('mistakes', IC.list, 'Dziennik błędów', 'co sprawia trudność', 'D', 'tint') +
      '</nav>' +

      '<section class="lower"><div class="skills">' + tiles + '</div>' +
      '<div class="cal cal-flat">' + (function () {
        const rec = SI.cur > 0 && SI.cur >= SI.best, SHI = f => '<svg viewBox="0 0 24 24" width="19" height="19" fill="' + (f ? '#E8A33D' : 'none') + '" stroke="' + (f ? 'none' : '#B5AFA7') + '" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/></svg>';
        return '<div class="srbox" title="Co 10 dni nauki bez przerwy +1 dzień ochrony, co miesiąc +1 dodatkowo (max ' + SHIELD_MAX + '). Dzień bez nauki zużywa ochronę i seria trwa dalej.">' +
          '<div><div class="srn"><b>' + SI.cur + '</b>' + (rec ? '<span class="srstar" title="rekord — Twoja najdłuższa seria">★</span>' : '') + '<span>' + (SI.cur === 1 ? 'dzień' : 'dni') + ' z rzędu</span></div>' +
          '<div class="srsub">' + (rec ? 'Twój najlepszy wynik' : 'rekord: ' + SI.best + ' ' + (SI.best === 1 ? 'dzień' : 'dni')) + '</div></div>' +
          '<div class="srsh"><div class="ic">' + Array.from({ length: SHIELD_MAX }, (_, i) => SHI(i < SI.shields)).join('') + '</div><small>' + SI.shields + ' ' + (SI.shields === 1 ? 'dzień' : 'dni') + ' ochrony</small></div></div>';
      })() +
      '<div class="row between" style="align-items:baseline"><b style="font-family:var(--head);font-size:20px">' + MONTHS[m] + '</b></div>' +
      '<div class="cal-dow"><div>Pn</div><div>Wt</div><div>Śr</div><div>Cz</div><div>Pt</div><div>So</div><div>Nd</div></div>' +
      '<div class="cal-grid">' + cal + '</div></div></section>' +

      '<div class="notes-row">' +
      monthTestNoteHtml() +
      bossNoteHtml() +
      '</div></div>';

    $('#settings').onclick = () => go('settings');
    const bindAi = () => { const b = $('#aiChip'); if (b) b.onclick = () => go('settings'); };
    bindAi();
    window.onAiHealth = () => { const bx = document.getElementById('aiChipBox'); if (bx) { bx.innerHTML = aiChipHtml(); bindAi(); } };
    bindSyncChip();
    if ($('#toSync')) $('#toSync').onclick = () => go('settings', 'sync');
    if ($('#start')) $('#start').onclick = () => startSession(false);
    if ($('#quick')) $('#quick').onclick = () => startSession(true);
    if ($('#extra')) $('#extra').onclick = () => startSession(false, 5);
    if ($('#guide')) $('#guide').onclick = () => (GUIDE && GUIDE.i < GUIDE.steps.length ? go('guide') : startGuide());
    $$('[data-nav]').forEach(b => b.onclick = () => go(b.dataset.nav));
    if ($('#bossGo')) $('#bossGo').onclick = startBoss;
    if ($('#mTest')) $('#mTest').onclick = () => startTest(true);
    $$('[data-stale]').forEach(b => b.onclick = () => goStale(b.dataset.stale));
    if ($('#wodGo')) $('#wodGo').onclick = wodPractice;
    if ($('#wodKnown')) $('#wodKnown').onclick = wodKnown;
    if ($('#wodHook')) $('#wodHook').onclick = e => { e.stopPropagation(); const w = wodWord(); if (w) hookToggle($('#wodHook'), w.id); };
    if ($('#wodSay')) $('#wodSay').onclick = () => { const w = wodWord(); if (w) Speech.speak(fullSentence({ w }), D().settings.rate || 0.95); };
    if ($('#vmHome')) $('#vmHome').onclick = () => go('stats');
    keyHandler = e => {
      if (e.repeat) return;
      if (plainKey(e, 'KeyN') && $('[data-stale]')) { e.preventDefault(); $('[data-stale]').click(); return; }
      if (plainKey(e, 'KeyW') && $('#wodGo')) { e.preventDefault(); wodPractice(); return; }
      if (e.key === 'Enter' && document.activeElement === document.body) { const b = $('#start') || $('#extra'); if (b) { e.preventDefault(); b.click(); } return; }
      if (plainKey(e, 'KeyS') && $('#quick')) { e.preventDefault(); $('#quick').click(); return; }
      if (plainKey(e, 'KeyL')) { e.preventDefault(); if ($('#guide')) $('#guide').click(); return; }
      if (plainKey(e, 'KeyO')) { e.preventDefault(); go('settings'); return; }
      const nav = { KeyG: 'play', KeyT: 'stats', KeyD: 'mistakes', KeyM: 'words', KeyK: 'texts', KeyA: 'listen', KeyC: 'tenses', KeyR: 'talk' };
      if (plainKey(e, 'KeyP') && $('#mTest')) { e.preventDefault(); startTest(true); return; }
      for (const k in nav) if (plainKey(e, k)) { e.preventDefault(); go(nav[k]); return; }
      if (plainKey(e, 'KeyB') && $('#bossGo')) { e.preventDefault(); startBoss(); }
    };
    maybeTopUp(false);
  }

  /* ---------- Słowo dnia: słowo, które sprawia trudność (otwarte błędy, trudne), stałe przez cały dzień ---------- */
  const baseWordId = id => { const it = itemFor(id); if (!it || !it.w || it.fromText) return null; const wid = id.indexOf(':') >= 0 ? id.slice(id.indexOf(':') + 1) : id; return WORDS.byId[wid] ? wid : null; };
  function wodPick() {
    const today = U.dayKey(), cur = D().wod;
    if (cur && cur.day === today && WORDS.byId[cur.id]) return cur;
    const seen = {}, hard = [], c = D().cards;
    const isKnown = id => c[id] && c[id].state === 'known';
    (D().mistakes || []).slice().reverse().forEach(m => { if (!mistakeOpen(m)) return; const id = baseWordId(m.id); if (id && !seen[id] && !isKnown(id)) { seen[id] = 1; hard.push(id); } });
    Object.keys(c).forEach(id => { if (c[id].hard) { const b = baseWordId(id); if (b && !seen[b] && !isKnown(b)) { seen[b] = 1; hard.push(b); } } });
    let pool = hard.slice(0, 15), src = 'hard';
    if (!pool.length) { pool = Object.keys(c).filter(id => WORDS.byId[id] && c[id].state !== 'known').sort((a, b) => (c[a].s || 0) - (c[b].s || 0)).slice(0, 15); src = 'weak'; }
    if (!pool.length) { pool = WORDS.list.filter(w => w.lvl === levels().vocab && !w.custom && !c[w.id]).slice(0, 50).map(w => w.id); src = 'new'; }
    if (!pool.length) return null;
    let h = 0; for (const ch of today) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const pick = { day: today, id: pool[h % pool.length], src };
    D().wod = pick; Store.save();
    return pick;
  }
  function wodWord() { const p = wodPick(); return p ? WORDS.byId[p.id] : null; }
  function wodHtml() {
    const p = wodPick(), w = p && WORDS.byId[p.id];
    if (!w) return '<div class="wod"></div>';
    const [a, b] = splitSentence(w.s);
    return '<div class="wod"><button class="btn raised wod-say" id="wodSay" aria-label="Odsłuchaj zdanie" title="Odsłuchaj zdanie">' + IC.speaker + '</button>' +
      '<div class="wod-tx"><div class="wod-lbl">Słowo dnia' + (p.src === 'hard' ? ' · sprawia Ci trudność' : p.src === 'weak' ? ' · warto utrwalić' : '') + '</div>' +
      '<div><span class="wod-w" lang="en">' + esc(w.answers[0]) + '</span> <span class="wod-pl">— ' + esc(w.pl) + '</span></div>' +
      '<div class="wod-s" lang="en"><i>' + esc(a) + '<b>' + esc(w.answers[0]) + '</b>' + esc(b) + '</i></div></div>' +
      ((hookGet(w.id) && hookGet(w.id).t) || AI.enabled() ? hookBtnHtml('wodHook') : '') +
      '<div class="wod-btns"><button class="btn raised wod-go" id="wodGo" title="Krótka runda z tym słowem: zdanie, dyktando, mówienie, tłumaczenie">Ćwicz ' + K('W') + '</button>' +
      '<button class="btn raised wod-go" id="wodKnown" title="Znam to słowo — trafi do znanych, a słowo dnia zmieni się na inne">Umiem</button></div></div>';
  }
  /* „Umiem” w Słowie dnia: słowo (z rodziną ćwiczeń) do znanych, nowe słowo dnia; z cofnięciem */
  function wodKnown() {
    const w = wodWord(); if (!w) return;
    const d = D(), ids = [w.id].concat(knownFamily(w.id).filter(x => x !== w.id)), prev = {}, prevWod = d.wod;
    ids.forEach(x => { prev[x] = d.cards[x] ? Object.assign({}, d.cards[x]) : null; const c = Object.assign({ reps: 0, lapses: 0, added: Date.now() }, d.cards[x] || {}, { state: 'known', knownAt: Date.now() }); delete c.hard; d.cards[x] = c; });
    d.wod = null; progress(); Store.save(); go('home');
    toast('„' + w.answers[0] + '” — w znanych. Nowe słowo dnia.', { label: 'Cofnij', fn: () => { ids.forEach(x => { if (prev[x]) d.cards[x] = prev[x]; else delete d.cards[x]; }); d.wod = prevWod; progress(); Store.save(); go('home'); } });
  }
  function wodPractice() {
    const w = wodWord(); if (!w) return;
    const ids = ['', 'dic:', 'say:', 'tr:', 'ord:'].map(pr => pr + w.id).filter(id => { const it = itemFor(id); return it && typeEnabled(it.type); });
    if (!ids.length) return;
    newSession({ custom: 'Słowo dnia: ' + w.answers[0], queue: ids.map(id => ({ id, isNew: false })) });
    go('exercise');
  }
  /* ---------- Twój tydzień vs poprzedni: ostatnie 7 dni i 7 dni wcześniej ---------- */
  function weekStats(from, to) {
    let sec = 0, nw = 0;
    for (let t = from; t < to; t = U.addDays(t, 1)) { const x = D().days[U.dayKey(t)]; if (x) { sec += x.sec || 0; nw += (x.newCount || 0) + (x.newExtra || 0); } }
    const ok = D().okAt || {}, ids = {};
    (D().mistakes || []).forEach(m => { const a = ok[m.id]; if (a && a > m.at && U.dayKey(a) !== U.dayKey(m.at) && a >= from && a < to) ids[m.id] = 1; });
    return { min: Math.round(sec / 60), nw, closed: Object.keys(ids).length };
  }
  function weekHtml() {
    const end = U.addDays(U.startOfDay(), 1), mid = U.addDays(end, -7), start = U.addDays(end, -14);
    const a = weekStats(mid, end), b = weekStats(start, mid);
    const row = (lbl, x, y) => { const d = x - y; return '<div><span>' + lbl + '</span><span class="v"><b>' + x + '</b>' + (d > 0 ? '<em class="up">▲ ' + d + '</em>' : d < 0 ? '<em class="dn">▼ ' + (-d) + '</em>' : '<em class="eq">=</em>') + '</span></div>'; };
    return '<div class="t2-plan t2-week" title="Ostatnie 7 dni w porównaniu z 7 dniami wcześniej"><h4>Twój tydzień vs poprzedni</h4>' +
      row('Minuty', a.min, b.min) + row('Nowe słowa', a.nw, b.nw) + row('Zamknięte błędy', a.closed, b.closed) + '</div>';
  }

  /* ================= SESJA ================= */
  function startSession(quick, extraNew) {
    const due = dueIds().slice(0, reviewCap());
    let nNew = quick ? 0 : newLeftToday() + (extraNew || 0);
    let nX = quick ? 0 : newExtraLeftToday() + (extraNew ? 3 : 0);
    if (quick && !due.length) { nNew = 2; nX = 1; }
    const fresh = newPool().slice(0, nNew).map(id => ({ id, isNew: true, newKind: 'vocab' }));
    const freshX = newExtraPool().slice(0, nX).map(id => ({ id, isNew: true, newKind: 'extra' }));
    if (!due.length && !fresh.length && !freshX.length && !(quick ? [] : stubQueue()).length) {
      toast(newPool().length ? 'Na dziś wszystko zrobione!' : 'Przerobiłeś całą bazę słówek — więcej w kolejnych etapach.');
      return;
    }
    // powtórki przemieszane rodzajami, nowe wplecione co 3 elementy
    const groups = {};
    due.forEach(id => { const tp = itemFor(id).type; (groups[tp] = groups[tp] || []).push({ id, isNew: false }); });
    const dueMixed = roundRobin(Object.keys(groups).sort((a, b) => usage(useKey(a)) - usage(useKey(b)) || Math.random() - 0.5).map(k => groups[k]));
    const freshAll = roundRobin([freshX, fresh]);
    const queue = [];
    let r = 0, n = 0;
    while (r < dueMixed.length || n < freshAll.length) {
      for (let k = 0; k < 3 && r < dueMixed.length; k++) queue.push(dueMixed[r++]);
      if (n < freshAll.length) queue.push(freshAll[n++]);
    }
    if (!quick) { const sq = stubQueue(); sq.forEach((q, i) => queue.splice(Math.min(queue.length, 2 + i * 4), 0, q)); }
    S = newSession({ quick: !!quick, queue });
    const learned = WORDS.list.filter(w => D().cards[w.id] && !isKnownWord(w) && (D().cards[w.id].reps || 0) >= 1 && wordLv(w.id) < 5);
    /* rozgrzewka: wyścig, chyba że był już wczoraj i dziś — wtedy na początek 5 zadań najrzadziej ćwiczonego rodzaju */
    const yd = D().days[U.dayKey(U.addDays(U.startOfDay(), -1))], raceTired = (Store.today().ty || {}).race && yd && yd.ty && yd.ty.race;
    if (!quick && raceTired) {
      const keyOf = q => useKey(itemFor(q.id).type), keys = [...new Set(queue.map(keyOf))].filter(k => k !== 'cloze');
      keys.sort((a, b) => usage(a) - usage(b));
      if (keys.length) {
        const k0 = keys[0], front = queue.filter(q => keyOf(q) === k0).slice(0, 5);
        S.queue = front.concat(queue.filter(q => front.indexOf(q) < 0));
        setTimeout(() => toast('Rozgrzewka na dziś: ' + (USE_NAME[k0] || k0) + ' — najdawniej ćwiczone.'), 400);
      }
    }
    if (!quick && !raceTired && (D().settings.games || {}).race !== false && learned.length >= 8) {
      S.race = { left: raceSec(), sec: raceSec(), list: U.shuffle(learned), idx: 0, hits: 0, misses: [], phase: 'q' };
      go('race');
    } else go('exercise');
  }
  function newSession(extra) {
    S = Object.assign({
      quick: false, queue: [], pos: 0, first: {}, combo: 0, maxCombo: 0, xp: 0, correct: 0, total: 0, newCount: 0, newExtra: 0,
      activeSec: 0, blockStart: 0, blockNo: 1, paused: false, struggled: [], raceHits: null, mistakesN: 0,
      play: null, boss: false, custom: null, bossHit: {}, bossClean: true
    }, extra);
    resetCardState();
    return S;
  }
  function resetCardState() {
    Object.assign(S, {
      phase: 'answer', unsure: false, hint: false, emptyPrompt: false, answer: '', fb: null, cardStart: Date.now(),
      tiles: null, order: [], ins: null, errTok: null, errSel: null, errCursor: 0, autoPlayed: false,
      listening: false, spoken: false, interim: '', recogErr: '', heard: '', ygOpen: false, typeMs: 0, lastKeyAt: 0, pvOpts: null, tnOpts: null, exOpen: false, view: null, viewId: null, chOpts: null, chWait: false, plays: 0, premarked: false, rep: null, spPend: null, spTries: 0
    });
  }
  const cur = () => S && S.queue[S.pos];

  /* ---------- Rozgrzewka: wyścig z czasem ---------- */
  function renderRace() {
    const R = S && S.race; if (!R) return go('exercise');
    const w = R.list[R.idx % R.list.length];
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="quit">' + IC.back + (S.play ? ' Zakończ ' : ' Pomiń rozgrzewkę ') + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Wyścig z czasem</b><span>' + (S.play ? 'Graj' : 'Rozgrzewka') + ' · wpisuj po angielsku jak najszybciej</span></div>' +
      '<div class="combo raised">Trafienia: ' + R.hits + '</div></header>' +
      '<main class="ex-card raised">' +
      '<div class="lcd inset deep" style="min-width:200px;padding:18px 36px"><div class="num" id="rclock" style="font-size:60px">' + U.mmss(R.left) + '</div><div class="lbl">' + (R.sec || 60) + ' s · rekord: ' + raceBestFor(R.sec || 60) + ' · czas stoi, gdy piszesz</div></div>' +
      '<div class="prompt-word race-word">' + esc(w.pl) + '</div>' + exSentHtml(w, R.phase !== 'show', 'ex-s race-ex') +
      (function () {
        const note = x => x.same ? 'dziś już liczone' : x.d > 0 ? (x.lv === 5 ? 'opanowane!' : '+1') : x.d < 0 ? '−1' : 'bez zmian';
        const ch = R.wsc && R.wsc.id === w.id ? R.wsc : null, pv = R.wsc && !ch && WORDS.byId[R.wsc.id] ? R.wsc : null;
        return '<div class="wscale">' + (ch ? dotsHtml(ch.lv, ch.d) : wordDots(w.id)) + '<span class="small-note">' + (ch ? ch.lv : wordLv(w.id)) + '/5' + (ch ? ' · ' + note(ch) : '') + '</span></div>';
      })() +
      (R.phase === 'show'
        ? (R.res === 'ok' ? '<div class="fb ok" role="status" style="max-width:560px">' + IC.check + '<span><b>Dobrze!</b> ' + esc(w.answers[0]) + '</span></div>'
          : R.res === 'typo' ? '<div class="fb uns" role="status" style="max-width:560px">' + IC.check + '<span><b>Prawie — literówka.</b> Ty: <s>' + esc(R.ans) + '</s> → <b>' + esc(w.answers[0]) + '</b></span></div>'
          : '<div class="fb bad" role="status" style="max-width:560px">' + IC.alert + '<span>' + (R.ans ? 'Ty: <s>' + esc(R.ans) + '</s> → ' : '') + 'Poprawnie: <b>' + esc(w.answers[0]) + '</b></span></div>')
        : '') +
      '<div class="answer-box"><label for="ans">Po angielsku</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off"' + (R.phase === 'show' ? ' disabled value="' + esc(R.ans || '') + '"' : '') + '></div>' +
      (R.phase === 'show' && R.res !== 'bad' ? '<div class="small-note">&nbsp;</div>'
        : R.phase === 'show'
        ? '<div class="row center"><button class="btn primary" id="rNext">Dalej ' + K('Enter') + '</button></div><div class="small-note">Czas stoi — sprawdź spokojnie, ' + K('Enter') + ' daje następne słowo.</div>'
        : '<div class="row center"><button class="btn small" id="rKnown">Umiem to — nie pokazuj więcej ' + K('Alt+U') + '</button></div>' +
          '<div class="small-note">' + K('Enter') + ' sprawdź · ' + K('Enter') + ' przy pustym polu pomija słowo · literówki są uznawane</div>') +
      '</main></div>';
    $('#quit').onclick = endRace;
    if ($('#rKnown')) $('#rKnown').onclick = raceKnown;
    if ($('#rNext')) { $('#rNext').onclick = raceNext; }
    const inp = $('#ans');
    if (R.phase === 'q') inp.focus();
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); endRace(); return; }
      if (altKey(e, 'KeyU') && R.phase === 'q') { e.preventDefault(); raceKnown(); return; }
      if (e.key === 'Enter' && R.phase === 'q') { e.preventDefault(); raceSubmit(inp.value); return; }
      if (e.key === 'Enter' && R.phase === 'show') { e.preventDefault(); raceNext(); }
    };
  }
  /* „Umiem to” w wyścigu: słowo (cała rodzina ćwiczeń) znane, znika z wyścigu i z nauki */
  function raceKnown() {
    const R = S && S.race; if (!R || R.phase !== 'q' || !R.list.length) return;
    const k = R.idx % R.list.length, w = R.list[k], fam = knownFamily(w.id), prev = {}, now = Date.now();
    fam.forEach(x => { prev[x] = D().cards[x] ? Object.assign({}, D().cards[x]) : null; D().cards[x] = Object.assign({ reps: 0, lapses: 0, added: now }, D().cards[x] || {}, { state: 'known', knownAt: now }); });
    R.list.splice(k, 1);
    R.misses = R.misses.filter(x => x !== w.id);
    if (!R.list.length) R.list = U.shuffle(learnedWords());
    progress(); Store.save(); renderRace();
    toast('„' + w.answers[0] + '” — oznaczone jako znane, nie będzie już wracać.', { label: 'Cofnij', fn: () => {
      Object.keys(prev).forEach(x => { if (prev[x]) D().cards[x] = prev[x]; else delete D().cards[x]; });
      if (S && S.race === R && R.list.indexOf(w) < 0) R.list.splice(R.idx % (R.list.length + 1), 0, w);
      progress(); Store.save(); if (screen === 'race') renderRace();
    } });
  }
  function raceSubmit(ans) {
    const R = S.race; if (!R || R.phase !== 'q') return;
    const w = R.list[R.idx % R.list.length];
    const mm = ans.trim() ? matchAnswer(w.answers, ans) : 'idk';
    const sc = scaleUpdate({ type: 'cloze', w }, mm === 'exact' ? 'ok' : mm === 'typo' ? 'typo' : 'bad', mm !== 'wrong' && mm !== 'idk');
    if (sc) { R.wsc = Object.assign({ id: w.id }, sc); Store.save(); }
    R.ans = ans.trim();
    if (mm !== 'wrong' && mm !== 'idk') { R.hits++; R.res = mm === 'exact' ? 'ok' : 'typo'; Sound.play('ok'); }
    else { if (!R.misses.includes(w.id)) R.misses.push(w.id); R.res = 'bad'; Sound.play(ans.trim() ? 'bad' : 'idk'); }
    R.phase = 'show'; renderRace();
    /* dobra odpowiedź (także z literówką) — krótki błysk i dalej; zatrzymanie tylko przy błędzie */
    if (R.res !== 'bad') { const idx = R.idx; setTimeout(() => { if (S && S.race === R && screen === 'race' && R.phase === 'show' && R.idx === idx) raceNext(); }, R.res === 'ok' ? 700 : 1300); }
  }
  /* czas stoi, gdy widać wynik; po błędzie Enter = następne słowo */
  function raceNext() {
    const R = S && S.race; if (!R || R.phase !== 'show') return;
    R.phase = 'q'; R.idx++; R.wsc = null; R.ans = ''; R.res = '';
    if (R.left <= 0) return endRace();
    renderRace();
  }
  function endRace() {
    const R = S && S.race; if (!R || R.ended) return;
    R.ended = true;
    const t = Store.today(), tomorrow = U.addDays(U.startOfDay(), 1);
    R.misses.forEach(id => { const c = D().cards[id]; if (c && c.state === 'review' && c.due > tomorrow) c.due = tomorrow; });
    const xp = R.hits * 5;
    if (R.hits + R.misses.length) bumpUse('race');
    S.xp += xp; D().xp += xp; t.xp += xp;
    const rs = R.sec || 60, record = R.hits > raceBestFor(rs) && R.hits > 0;
    if (record) { if (rs === 60) { D().raceBest = R.hits; D().raceBestAt = Date.now(); } else { D().raceBestBy = D().raceBestBy || {}; D().raceBestBy[rs] = R.hits; } }
    t.race = Math.max(t.race || 0, R.hits);
    S.raceHits = R.hits;
    progress(); Store.save();
    S.paused = true;
    Sound.play('block');
    S.total += R.hits + R.misses.length; S.correct += R.hits;
    const summary = '<p class="muted" style="margin:0;font-size:18px">' + R.hits + ' trafień · +' + xp + ' XP' + (record ? '<br><b class="pink">Nowy rekord!</b>' : '') +
      (R.misses.length ? '<br>Słowa, które nie weszły, wrócą jutro.' : '') + '</p>';
    if (S.play) {
      modal('<h2>Koniec wyścigu</h2>' + summary +
        '<div class="row center"><button class="btn" id="mEnd" data-esc>Zakończ ' + K('Esc') + '</button><button class="btn primary" id="mAgain">Jeszcze raz ' + K('Enter') + '</button></div>',
        (ov, close) => {
          ov.querySelector('#mAgain').onclick = () => { close(); const keep = S; startRacePlay(keep); };
          ov.querySelector('#mEnd').onclick = () => { close(); S.race = null; finishSession(true); };
        });
      return;
    }
    S.total -= R.hits + R.misses.length; S.correct -= R.hits;
    modal('<h2>Rozgrzewka zakończona</h2>' + summary +
      '<button class="btn big primary" id="mGo">Do ćwiczeń ' + K('Enter') + '</button>',
      (ov, close) => {
        ov.querySelector('#mGo').onclick = () => {
          close(); S.race = null; S.paused = false; S.blockStart = S.activeSec; resetCardState(); go('exercise');
        };
      });
  }

  function updateClock() {
    if ((screen !== 'exercise' && screen !== 'yg') || !S) return;
    if (S.play || S.boss) { const el = document.getElementById('timer'); if (el) el.textContent = S.play ? limTimer() : U.mmss(S.activeSec); if (S.lim) { const bar = document.getElementById('blockbar'); if (bar) bar.style.width = limPct() + '%'; } return; }
    const blockSec = D().settings.blockMin * 60, used = S.activeSec - S.blockStart;
    const el = document.getElementById('timer'); if (el) el.textContent = U.mmss(Math.max(0, blockSec - used));
    const bar = document.getElementById('blockbar'); if (bar) bar.style.width = Math.min(100, used / blockSec * 100) + '%';
  }

  /* ---------- Przygotowanie kafelków i tokenów ---------- */
  /* łączenie słów w kafelki tak, by tworzyły sensowne kawałki zdania (nie „up so you”) */
  const TILE_CLAUSE = new Set(['and', 'but', 'or', 'so', 'because', 'where', 'when', 'while', 'if', 'that', 'which', 'who', 'whom', 'whose', 'although', 'though', 'unless', 'until', 'since', 'before', 'after', 'than', 'as', 'what', 'how', 'why']);
  const TILE_FWD = new Set(['the', 'a', 'an', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'into', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'these', 'those', 'some', 'any', 'no', 'every', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'not', "don't", "doesn't", "didn't", "can't", "won't", "isn't", "aren't", "wasn't", "weren't", 'will', 'would', 'can', 'could', 'should', 'must', 'might', 'may', 'very', 'really', 'too', 'have', 'has', 'had', 'am', 'is', 'are', 'was', 'were', 'be', 'been']);
  const TILE_BACK = new Set(['up', 'down', 'out', 'off', 'away', 'back', 'over', 'on', 'in']);
  function joinCost(a, b) {
    const lw = a[a.length - 1].toLowerCase(), rw = b[0].toLowerCase().replace(/[^a-z']/g, '');
    let c = a.join(' ').length + b.join(' ').length;
    if (/[,;:—–-]$/.test(lw)) c += 100;          // nie łącz przez przecinek
    if (TILE_CLAUSE.has(rw)) c += 60;             // nie doklejaj początku nowej części zdania
    if (TILE_FWD.has(lw.replace(/[^a-z']/g, ''))) c -= 8; // „the show”, „we look”, „to have”
    if (TILE_BACK.has(rw) && b.length === 1) c -= 6; // „look up”
    if (/^[A-Z]/.test(a[a.length - 1]) && /^[A-Z]/.test(b[0]) && a[a.length - 1] !== 'I') c -= 20; // nazwy: „Orbital Notes”
    return c;
  }
  function makeTiles(full) {
    let s = full.trim();
    const m = s.match(/[.!?]+$/), endP = m ? m[0] : '';
    if (endP) s = s.slice(0, -endP.length);
    const toks = s.split(/\s+/);
    const firstClean = toks[0].replace(/[^A-Za-zÀ-ž']/g, '');
    if (!/^I($|')/.test(firstClean) && !PROPER.has(firstClean)) toks[0] = toks[0].charAt(0).toLowerCase() + toks[0].slice(1);
    let chunks = toks.map(t => [t]);
    while (chunks.length > 10) {
      let best = 0, bl = 1e9;
      for (let i = 0; i < chunks.length - 1; i++) { const l = joinCost(chunks[i], chunks[i + 1]); if (l < bl) { bl = l; best = i; } }
      chunks.splice(best, 2, chunks[best].concat(chunks[best + 1]));
    }
    const tiles = chunks.map((c, i) => ({ t: c.join(' '), i }));
    let sh, tries = 0;
    do { sh = U.shuffle(tiles); tries++; } while (tiles.length > 1 && sh.every((x, k) => x.i === k) && tries < 20);
    return { tiles: sh, endP, n: tiles.length, correct: tiles.map(x => x.t) };
  }
  function orderAnswer() { return S.order.map(k => S.tiles.tiles[k].t).join(' ') + S.tiles.endP; }
  function makeErrTokens(it) {
    const s = it.g.s, i = s.indexOf('_');
    const prefix = s.slice(0, i).trim(), suffix = s.slice(i + 1);
    const pre = prefix ? prefix.split(/\s+/) : [];
    const wrong = it.wrong.split(' ');
    const m = suffix.match(/^(\S*)(.*)$/);
    const attach = m[1], rest = m[2].trim();
    const toks = pre.concat(wrong);
    if (attach) toks[toks.length - 1] += attach;
    const post = rest ? rest.split(/\s+/) : [];
    return { tokens: toks.concat(post), span: [pre.length, pre.length + wrong.length - 1], attach };
  }
  function errSentence(it) { return it.g.s.replace('_', it.wrong); }

  /* ---------- Widok ćwiczenia ---------- */
  function renderExercise() {
    if (!S) return go('home');
    const c = cur();
    if (!c) return finishSession(true);
    const raw = itemFor(c.id);
    if (!raw || (!typeEnabled(raw.type) && !(S.play && (raw.type !== 'speak' || Recog.supported())))) { S.queue.splice(S.pos, 1); resetCardState(); return renderExercise(); }
    const it = curView(c);
    if (!it.pl && (it.type === 'translate' || it.fromPl)) it.pl = (D().plCache || {})[c.id] || null;
    const TP = TYPES[it.type], ph = S.phase, st = D().settings;
    const blockSec = st.blockMin * 60, used = S.activeSec - S.blockStart;
    const dfy = itemDiff(it);
    const tag = TP.tag + (it.stub ? ' · <span class="ub-tag">UPARTY BŁĄD</span> · ' + esc(it.stubRight.toUpperCase()) : it.simple ? ' · PROSTSZA WERSJA' : ' · ' + L[it.lvl]) + (dfy && !it.simple ? ' · ZDANIE ' + diffLabel(dfy) : '') + (it.stepLabel ? ' · ' + it.stepLabel : '') + (c.isNew ? ' · NOWE' : '') + (c.relearn ? ' · JESZCZE RAZ' : '');
    if (it.type === 'order' && !S.tiles) {
      S.tiles = makeTiles(fullSentence(it));
      if (it.prefill && !S.order.length) { const T3 = S.tiles, kk = Math.max(1, Math.floor(T3.n / 3)); for (let j = 0; j < kk; j++) { const ix = T3.tiles.findIndex((x, q) => x.t === T3.correct[j] && S.order.indexOf(q) < 0); if (ix >= 0) S.order.push(ix); } }
    }
    if (it.type === 'error' && !S.errTok) S.errTok = makeErrTokens(it);
    if (it.type === 'error' && it.premark && !S.premarked && S.phase === 'answer') { S.premarked = true; S.errSel = S.errTok.span[0]; }
    prefetchPL(S.queue.slice(S.pos, S.pos + 12).map(q => q.id));
    ensureDistr(S.queue.slice(S.pos + 1, S.pos + 15).map(q => q.id));

    let body = '', controls = '';
    const unsureBtn = '<button class="btn unsure' + (S.unsure ? ' pressed' : '') + '" id="unsure" aria-pressed="' + S.unsure + '"><span class="dot"></span><span>Nie jestem pewien — zgaduję</span>' + K('Alt+N') + '</button>';
    const emptyNote = S.emptyPrompt ? '<div class="hint" role="status">Nic nie wpisano — naciśnij <b>Enter</b> jeszcze raz, żeby zobaczyć odpowiedź.</div>' : '';
    const knownBtn = it.stub ? '' : '<button class="btn" id="known">Umiem to ' + K('Alt+Enter') + '</button>';
    const idkBtn = '<button class="btn" id="idk">Nie wiem ' + K('Alt+W') + '</button>';
    const checkBtn = '<button class="btn primary" id="check" style="padding:0 30px;font-size:19px">Sprawdź ' + K('Enter') + '</button>';
    const fbFull = ph === 'feedback';

    if (it.type === 'choice' && !S.chOpts && !fbFull) {
      const dc = (D().distr || {})[c.id], pr = !dc && ensureDistr([c.id]) || DISTR_BUSY[c.id];
      if (pr && !S.chWait) { S.chWait = true; pr.then(() => { if (S && cur() === c && S.phase === 'answer' && !S.chOpts) renderExercise(); }); }
      if (pr) { app.innerHTML = '<div class="wrap narrow"><main class="ex-card raised"><div class="checking"><span class="spinner"></span>Przygotowuję opcje do wyboru…</div></main></div>'; keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); finishSession(false); } }; return; }
    }
    if (it.type === 'choice') {
      if (!S.chOpts) S.chOpts = choiceOpts(it);
      const [a, b] = splitSentence(it.w.s), pick = fbFull ? S.fb.ans : null, ans0 = it.w.answers[0];
      body = '<div><div class="prompt-lbl">Wybierz słowo, które pasuje do zdania:</div><div class="prompt-word">' + esc(it.w.pl) + '</div></div>' +
        '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">' + (fbFull ? esc(ans0) : '______') + '</span><span>' + esc(b) + '</span></div>' +
        '<div class="options tnopts">' + S.chOpts.map((o, i) => { const cls = !fbFull ? '' : o === ans0 || (o === pick && S.fb.m === 'ai-ok') ? ' ok' : o === pick ? ' bad' : ' dim'; return '<button class="btn' + cls + '" data-copt="' + i + '"' + (fbFull ? ' tabindex="-1"' : '') + '><span class="k">' + (i + 1) + '</span>' + esc(o) + '</button>'; }).join('') + '</div>' +
        (fbFull ? '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj zdanie ' + K('S') + '</button>' : '');
      controls = unsureBtn + '<div class="row center" style="gap:14px;margin-top:4px">' + knownBtn + idkBtn + '</div><div class="small-note">' + K('1') + '–' + K('4') + ' wybierz' + (S.hint ? ' · użyłeś podpowiedzi — słowo wróci trochę wcześniej' : '') + '</div>';
    }

    else if (it.type === 'pvwrite') {
      const sp = pvSplit(it.w), [a, b] = splitSentence(it.w.s), whole = !S.hint;
      const tyAns = S.fb && S.fb.full ? S.fb.full : sp.verb + ' ' + (S.fb ? S.fb.ans : '');
      body = '<div><div class="prompt-lbl">' + (whole ? 'Wpisz brakujący phrasal verb — znaczenie:' : 'Wpisz brakującą partykułę — znaczenie:') + '</div><div class="prompt-word">' + esc(it.w.pl) + '</div></div>' +
        (whole
          ? '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">' + (fbFull ? esc(it.w.answers[0]) : '_____ _____') + '</span><span>' + esc(b) + '</span></div>'
          : '<div class="sentence"><span>' + esc(a) + '<b>' + esc(sp.verb) + '</b></span><span class="gap inset deep">' + (fbFull ? esc(sp.part) : '_____') + '</span><span>' + esc(b) + '</span></div>') +
        (fbFull ? (S.fb.ans && S.fb.kind !== 'ok' ? '<div class="hint">Ty: <s>' + esc(tyAns) + '</s></div>' : '') + '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj zdanie ' + K('S') + '</button>'
          : '<div class="answer-box"><label for="ans">' + (whole ? 'Cały zwrot — czasownik i partykuła' : 'Partykuła (np. up, out, off…)') + '</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="' + (whole ? 'np. look after' : esc(sp.verb) + ' …') + '" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '></div>');
      controls = unsureBtn + emptyNote + (S.hint === 1 ? '<div class="hint">Podpowiedź: czasownik to <b>' + esc(sp.verb) + '</b> — dopisz partykułę.</div>' : '') + '<div class="row center" style="gap:14px;margin-top:4px">' + hintBtn('Podpowiedź') + knownBtn + idkBtn + checkBtn + '</div><div class="small-note">Najpierw z pamięci · podpowiedź: 1. czasownik, 2. cztery partykuły</div>';
    }

    else if (it.type === 'cloze') {
      const [a, b] = splitSentence(it.w.s);
      const words = it.w.answers[0].split(' ').length;
      const hintText = (it.noPl ? 'Znaczenie: ' + esc(it.w.pl) + '. ' : '') + 'Zaczyna się na „' + esc(it.w.answers[0][0]) + '”, ' + (words > 1 ? words + ' słowa.' : 'ma ' + it.w.answers[0].length + ' ' + plLit(it.w.answers[0].length) + '.');
      body =
        (it.noPl && !fbFull ? '<div><div class="prompt-lbl">Uzupełnij zdanie — bez polskiej podpowiedzi</div><div class="prompt-word">?</div></div>' : '<div><div class="prompt-lbl">Uzupełnij zdanie słowem:</div><div class="prompt-word">' + esc(it.w.pl) + '</div></div>') +
        '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">' + (fbFull ? esc(S.fb.fill) : '______') + '</span><span>' + esc(b) + '</span></div>' +
        '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj zdanie ' + K(fbFull ? 'S' : 'Alt+S') + '</button>' +
        '<div class="answer-box"><label for="ans">Twoja odpowiedź</label>' +
        '<input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="wpisz brakujące słowo" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '></div>';
      controls = unsureBtn + emptyNote + (S.hint ? '<div class="hint">Podpowiedź: ' + hintText + '</div>' : '') +
        '<div class="row center" style="gap:14px;margin-top:4px">' + hintBtn('Podpowiedź') + knownBtn + idkBtn + checkBtn + '</div>' +
        '<div class="small-note">' + K('Shift+Enter') + ' sprawdź jako „nie jestem pewien” · ' + K('Enter') + ' ' + K('Enter') + ' przy pustym polu = nie wiem</div>';
    }

    else if (it.type === 'order') {
      const T2 = S.tiles;
      /* kursor wstawiania: odstępy między słowami są klikalne, kreska pokazuje, gdzie wskoczy następny kafelek */
      const insAt = S.ins == null ? S.order.length : S.ins;
      const gap = i => S.order.length ? '<span class="ins-gap' + (i === insAt ? ' on' : '') + '" data-ins="' + i + '" title="Wstaw tutaj"></span>' : '';
      const built = S.order.length ? gap(0) + S.order.map((k, pos) => '<button class="btn small chip-w" data-un="' + pos + '">' + esc(T2.tiles[k].t) + '</button>' + gap(pos + 1)).join('') : '';
      body =
        '<div><div class="prompt-lbl">' + (it.plPrompt ? 'Ułóż z kafelków tłumaczenie zdania' : 'Ułóż zdanie w dobrej kolejności') + '</div>' + (it.plPrompt ? '<div class="pl-sent" style="margin-top:6px">' + esc(it.plPrompt) + '</div>' : '') + '<div class="hint" style="margin-top:6px">' + (it.simple ? 'Prostsza wersja zdania' + (it.note ? ' — ' + esc(it.note) : '') : it.topic ? 'Ćwiczenie do tematu: <b>' + esc(it.fromText) + '</b>' : it.fromText ? 'Zdanie z tekstu: <b>' + esc(it.fromText) + '</b>' : 'Słowo z lekcji: <b>' + esc(it.w.answers[0]) + '</b> — ' + esc(it.w.pl)) + '</div></div>' +
        (fbFull
          ? '<div class="sentence">' + esc(fullSentence(it)) + '</div>' +
            (S.fb.kind === 'bad' && S.fb.ans ? '<div class="hint">Twoja wersja: <s>' + esc(S.fb.ans) + '</s></div>' : '')
          : '<div class="built inset deep" id="built" aria-label="Ułożone zdanie">' + (built || '<span class="placeholder">wybierz słowa po kolei — klawisze 1–' + Math.min(9, T2.n) + (T2.n === 10 ? ', 0' : '') + '</span>') + (S.order.length ? '<span class="endp">' + esc(T2.endP) + '</span>' : '') + '</div>' +
            (S.order.length ? '<div class="small-note ord-hint">' + K('←') + ' ' + K('→') + ' wstawiaj w środek · klik w słowo zdejmuje</div>' : '') +
            '<div class="tiles">' + T2.tiles.map((x, k) => '<button class="btn tile' + (S.order.includes(k) ? ' used' : '') + '" data-tile="' + k + '"' + (S.order.includes(k) ? ' tabindex="-1" aria-hidden="true"' : '') + '><span class="n">' + (k === 9 ? 0 : k + 1) + '</span>' + esc(x.t) + '</button>').join('') + '</div>') +
        '<button class="btn pill" id="speak"' + (fbFull ? '' : ' hidden') + '>' + IC.speaker + ' Odsłuchaj zdanie ' + K('S') + '</button>';
      controls = emptyNote + (S.orderIncomplete ? '<div class="hint" role="status">Ułóż wszystkie kafelki, zanim sprawdzisz.</div>' : '') +
        '<div class="ctl-sep"></div><div class="ctl-row">' +
        '<button class="btn unsure' + (S.unsure ? ' pressed' : '') + '" id="unsure" aria-pressed="' + S.unsure + '"><span class="dot"></span><span>Zgaduję</span>' + K('Alt+N') + '</button><span class="vsep"></span>' +
        '<button class="btn" id="undo"' + (S.order.length ? '' : ' disabled') + '>Cofnij ' + K('⌫') + '</button>' +
        '<button class="btn" id="hint">Podpowiedź ' + K('Alt+P') + '</button>' + knownBtn + idkBtn + '<span class="vsep"></span>' +
        '<button class="btn" id="check">Sprawdź ' + K('Enter') + '</button></div>';
    }

    else if (it.type === 'error') {
      const E = S.errTok, [s0, s1] = E.span;
      if (fbFull) {
        const [a, b] = splitSentence(it.g.s);
        body = '<div class="prompt-lbl">Znajdź i popraw błąd</div>' +
          '<div class="sentence sent-mark">' + esc(a) + '<mark>' + esc(it.g.correct) + '</mark>' + esc(b) + '</div>' +
          '<div class="hint">Było: <s>' + esc(errSentence(it)) + '</s></div>' +
          '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj poprawne zdanie ' + K('S') + '</button>';
      } else if (S.errSel == null) {
        body = '<div class="prompt-lbl">W tym zdaniu jest jeden błąd. Kliknij miejsce z błędem.</div>' +
          '<div class="etoks">' + E.tokens.map((tk, k) => '<button class="btn etok' + (k === S.errCursor ? ' cursor' : '') + '" data-tok="' + k + '">' + (k < 10 ? '<span class="n">' + (k === 9 ? 0 : k + 1) + '</span>' : '') + esc(tk) + '</button>').join('') + '</div>' +
          '<div class="small-note">' + K('←') + ' ' + K('→') + ' wybierz · ' + K('Enter') + ' zatwierdź · albo klawisz z numerem</div>';
      } else {
        const toks = E.tokens.map((tk, k) => k >= s0 && k <= s1 ? '<mark>' + esc(tk) + '</mark>' : esc(tk)).join(' ');
        body = '<div class="prompt-lbl">Dobrze, błąd jest tutaj. Jak powinno być?</div>' +
          '<div class="sentence sent-mark">' + toks + '</div>' +
          '<div class="answer-box"><label for="ans">Popraw zaznaczony fragment</label>' +
          '<input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="poprawna forma" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '></div>';
      }
      const eHalf = S.hint === 1 && S.errSel == null && E ? '<div class="hint">Podpowiedź: błąd jest w ' + ((E.span[0] + E.span[1]) / 2 < E.tokens.length / 2 ? 'pierwszej' : 'drugiej') + ' połowie zdania.</div>' : '';
      controls = (S.errSel == null ? eHalf : unsureBtn + emptyNote) +
        '<div class="row center" style="gap:14px;margin-top:4px">' + (S.errSel == null ? hintBtn('Podpowiedź') : '') + knownBtn + idkBtn + (S.errSel == null ? '' : checkBtn) + '</div>';
    }

    else if (it.type === 'dictation') {
      if (fbFull) {
        const dfx = wordDiff(fullSentence(it), S.fb.ans || '');
        body = '<div class="prompt-lbl">Posłuchaj i zapisz całe zdanie</div>' +
          '<div class="sentence wd">' + (S.fb.ans ? dfx.A.map((w, k) => dfx.aNear[k] ? '<mark class="near">' + esc(w) + '</mark>' : dfx.aOk[k] ? esc(w) : '<mark>' + esc(w) + '</mark>').join(' ') : esc(fullSentence(it))) + '</div>' +
          (S.fb.ans ? '<div class="hint wd">Ty: ' + dfx.B.map((w, k) => dfx.bNear[k] ? '<u class="near">' + esc(w) + '</u>' : dfx.bOk[k] ? esc(w) : '<s>' + esc(w) + '</s>').join(' ') + '</div>' : '') +
          '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj jeszcze raz ' + K('S') + '</button>';
      } else {
        body = '<div class="prompt-lbl">Posłuchaj i zapisz całe zdanie</div>' +
          '<div class="row center"><button class="btn play-big primary" id="speak" aria-label="Odtwórz (Alt+S)">' + IC.speakerBig + '</button></div>' +
          (it.fast ? '<div class="small-note">Tryb trudniejszy: lektor szybciej, tylko jedno odsłuchanie.</div>' : '<div class="row center" style="gap:12px"><span class="small-note">' + K('Alt+S') + ' odtwórz</span>' + hintBtn('Wolniej', 'small') + '</div>') +
          (it.hintLetters ? '<div class="dict-hint" aria-label="Podpowiedź: pierwsze litery">' + esc(fullSentence(it).split(' ').map(w => w.replace(/[A-Za-z]+/, m => m[0] + '_'.repeat(m.length - 1))).join('  ')) + '</div>' : '') +
          '<div class="answer-box" style="max-width:760px"><label for="ans">Co słyszysz?</label>' +
          '<input id="ans" class="answer" style="font-size:22px" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="wpisz całe zdanie" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '></div>';
      }
      controls = unsureBtn + emptyNote + '<div class="row center" style="gap:14px;margin-top:4px">' + knownBtn + idkBtn + checkBtn + '</div>';
    }

    else if (it.ts) {
      const r = tenseExerciseBody(it, ph, fbFull, unsureBtn, emptyNote, knownBtn, idkBtn, checkBtn);
      body = r.body; controls = r.controls;
    }

    else if (it.type === 'particle') {
      if (!S.pvOpts) S.pvOpts = makePvOpts(it.w);
      const { verb, part } = pvSplit(it.w), [a, b] = splitSentence(it.w.s);
      const pick = fbFull ? S.fb.ans : null;
      body =
        '<div><div class="prompt-lbl">Dobierz brakującą partykułę — znaczenie:</div><div class="prompt-word">' + esc(it.w.pl) + '</div></div>' +
        '<div class="sentence"><span>' + esc(a) + '<b>' + esc(verb) + '</b></span><span class="gap inset deep">' + (fbFull ? esc(part) : '_____') + '</span><span>' + esc(b) + '</span></div>' +
        '<div class="options pvopts">' + S.pvOpts.map((o, i) => {
          const cls = !fbFull ? '' : o === part || (o === pick && S.fb.m === 'ai-ok') ? ' ok' : o === pick ? ' bad' : ' dim';
          return '<button class="btn' + cls + '" data-popt="' + i + '"' + (fbFull ? ' tabindex="-1"' : '') + '><span class="k">' + (i + 1) + '</span>' + esc(verb) + ' <b>' + esc(o) + '</b></button>';
        }).join('') + '</div>' +
        (fbFull ? '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj zdanie ' + K('S') + '</button>' : '');
      controls = unsureBtn + '<div class="row center" style="gap:14px;margin-top:4px">' + knownBtn + idkBtn + '</div>' +
        '<div class="small-note">' + K('1') + '–' + K('4') + ' wybierz' + (S.hint ? ' · użyłeś podpowiedzi — wróci trochę wcześniej' : ' · ' + K('Alt+N') + ' przed wyborem = nie jestem pewien') + '</div>';
    }

    else if (it.type === 'translate') {
      const hintText = it.fromText ? 'Zaczyna się od: „' + esc(fullSentence(it).split(' ').slice(0, 2).join(' ')) + ' …”' : 'Użyj słowa: <b>' + esc(it.w.answers[0]) + '</b> (' + esc(it.w.pl) + ')';
      if (!it.pl) {
        const err = PL_ERR[it.id];
        body = '<div class="prompt-lbl">Przetłumacz na angielski</div>' + (err
          ? '<div class="fb bad" role="status">' + IC.alert + '<span>Nie udało się przygotować polskiego zdania: ' + esc(err) + '</span></div>'
          : '<div class="checking"><span class="spinner"></span>Przygotowuję polskie zdanie…</div>');
        controls = '<div class="row center" style="gap:14px;margin-top:4px">' + (err ? '<button class="btn" id="plRetry">Spróbuj ponownie</button>' : '') + '<button class="btn" id="skip" title="Nie mogę teraz mówić — pomiń">Pomiń ' + K('Alt+K') + '</button></div>';
        if (!err) ensurePL([it.id]).then(() => { if (S && cur() === c && S.phase === 'answer') renderExercise(); });
      } else {
        body =
          '<div class="prompt-lbl">Przetłumacz na angielski' + (it.fromText ? ' · zdanie z tekstu <b>' + esc(it.fromText) + '</b>' : '') + '</div>' +
          '<div class="pl-sent">' + esc(it.pl) + '</div>' +
          (fbFull
            ? '<div class="sentence" lang="en">' + esc(fullSentence(it)) + '</div>' + (S.fb.ans ? '<div class="hint">Ty: ' + esc(S.fb.ans) + '</div>' : '') +
              '<button class="btn pill" id="speak">' + IC.speaker + ' Odsłuchaj ' + K('S') + '</button>'
            : '<div class="answer-box" style="max-width:820px"><label for="ans">Po angielsku — wpisz albo powiedz</label>' +
              '<div class="ans-row"><input id="ans" class="answer" style="font-size:22px" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="' + (S.listening ? 'słucham…' : 'twoje tłumaczenie') + '" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '>' +
              (Recog.supported() ? '<button class="btn mic-sm' + (S.listening ? ' on primary' : '') + '" id="mic" aria-label="' + (S.listening ? 'Zatrzymaj' : 'Powiedz (Alt+M)') + '">' + IC.micSm + '</button>' : '') + '</div>' +
              (S.recogErr ? '<div class="fb bad" role="status">' + IC.alert + '<span>' + esc(S.recogErr) + '</span></div>' : '') + '</div>');
        controls = unsureBtn + emptyNote + (S.hint ? '<div class="hint">Podpowiedź: ' + hintText + '</div>' : '') +
          '<div class="row center" style="gap:14px;margin-top:4px">' + hintBtn('Podpowiedź') + knownBtn + idkBtn + checkBtn + '</div>' +
          '<div class="small-note">Liczy się, czy Anglik Cię zrozumie — nie musi być słowo w słowo.' + (Recog.supported() ? ' ' + K('Alt+M') + ' mów zamiast pisać.' : '') + '</div>';
      }
    }

    else if (it.type === 'speak') {
      const [a, b] = splitSentence(it.w.s);
      if (it.fromPl && !fbFull) {
        if (!it.pl) ensurePL([it.id]).then(() => { if (S && cur() === c && S.phase === 'answer') { it.pl = (D().plCache || {})[c.id] || null; if (it.pl) renderExercise(); } });
        body = '<div class="prompt-lbl">Powiedz to zdanie po angielsku — z pamięci</div>' + (it.pl ? '<div class="pl-sent">' + esc(it.pl) + '</div><div class="hint">Słowo: <b>' + esc(it.w.answers[0]) + '</b></div>' : '<div class="checking"><span class="spinner"></span>Przygotowuję polskie zdanie…</div>');
      } else if (it.readAloud && !fbFull) {
        body = '<div class="prompt-lbl">Przeczytaj na głos całe zdanie:</div><div class="sentence">' + esc(fullSentence(it)) + '</div>';
      } else body =
        '<div><div class="prompt-lbl">Powiedz na głos całe zdanie, wstawiając słowo:</div><div class="prompt-word">' + esc(it.w.pl) + '</div></div>' +
        '<div class="sentence"><span>' + esc(a) + '</span><span class="gap inset deep">' + (fbFull ? esc(it.w.answers[0]) : '______') + '</span><span>' + esc(b) + '</span></div>';
      if (fbFull) {
        const heard = S.fb.heard2 != null ? S.fb.heard2 : S.fb.heard;
        if (heard) {
          const dfx = wordDiff(fullSentence(it), heard), match = speakMatch(dfx);
          body += '<div class="interim inset deep wd">' + (S.fb.tries ? 'Próba ' + (S.fb.tries + 1) + ' — u' : 'U') + 'słyszałem: „' + dfx.B.map((w, k) => dfx.bNear[k] ? '<u class="near">' + esc(w) + '</u>' : dfx.bOk[k] ? esc(w) : '<s>' + esc(w) + '</s>').join(' ') + '”</div>' +
            (match ? (S.fb.tries ? '<div class="fb ok" role="status" style="max-width:640px">' + IC.check + '<span><b>Teraz się zgadza!</b></span></div>' : '')
              : '<div class="hint wd">Wzór: ' + dfx.A.map((w, k) => dfx.aOk[k] ? esc(w) : '<mark>' + esc(w) + '</mark>').join(' ') + '</div>');
        }
        body += '<div class="row center" style="gap:14px"><button class="btn pill" id="speak">' + IC.speaker + ' Posłuchaj wzoru ' + K('S') + '</button>' +
          (Recog.supported() ? '<button class="btn pill' + (S.reListening ? ' primary' : '') + '" id="reMic">' + IC.mic + ' ' + (S.reListening ? 'Słucham… (kliknij, by skończyć)' : 'Powiedz jeszcze raz') + ' ' + K('M') + '</button>' : '') + '</div>' +
          (S.reListening ? '<div class="interim inset deep" id="interim" aria-live="polite">' + esc(S.interim || '') + '</div>' : '');
      } else {
        body += '<button class="btn mic' + (S.listening ? ' on primary' : '') + '" id="mic" aria-label="' + (S.listening ? 'Zatrzymaj nagrywanie' : 'Mów (Spacja)') + '">' + IC.mic + '</button>' +
          '<div class="small-note">' + (S.listening ? 'Słucham… mów spokojnie po angielsku — skończę po chwili ciszy albo gdy klikniesz jeszcze raz' : S.spPend ? 'Źle zrozumiałem? ' + K('Spacja') + ' — powiedz jeszcze raz, ta próba się nie liczy · ' + K('Enter') + ' — sprawdź' : K('Spacja') + ' albo kliknij, żeby mówić') + '</div>' + micHint() +
          (S.spPend && !S.listening
            ? (function () { const dfx = wordDiff(fullSentence(it), S.spPend.heard); return '<div class="interim inset deep wd" id="interim">Usłyszałem: „' + dfx.B.map((w, k) => dfx.bNear[k] ? '<u class="near">' + esc(w) + '</u>' : dfx.bOk[k] ? esc(w) : '<s>' + esc(w) + '</s>').join(' ') + '”</div>'; })()
            : '<div class="interim inset deep" id="interim" aria-live="polite">' + esc(S.interim || '') + '</div>') +
          (S.recogErr ? '<div class="fb bad" role="status" style="max-width:640px">' + IC.alert + '<span>' + esc(S.recogErr) + '</span></div>' : '');
      }
      const sFirst = S.hint === 1 && !fbFull && !it.readAloud ? '<div class="hint">Podpowiedź: zaczyna się od „' + esc(fullSentence(it).split(' ').slice(0, 2).join(' ')) + ' …”</div>' : '';
      controls = sFirst + '<div class="row center" style="gap:14px;margin-top:4px">' + (!fbFull && !it.readAloud && !S.spPend ? hintBtn('Podpowiedź') : '') + knownBtn + idkBtn +
        '<button class="btn" id="skip" title="Nie mogę teraz mówić — pomiń">Pomiń ' + K('Alt+K') + '</button>' +
        (S.spPend && !S.listening ? '<button class="btn primary" id="check">Sprawdź ' + K('Enter') + '</button>' : '') + '</div>';
    }

    let lower;
    if (ph === 'answer') lower = controls;
    else if (ph === 'checking') lower = '<div class="checking"><span class="spinner"></span>' + (it.type === 'translate' ? 'AI sprawdza, czy Anglik by Cię zrozumiał…' : 'AI sprawdza Twoją odpowiedź…') + '</div>';
    else lower = feedbackHtml(it) +
      '<div id="explain" class="explain inset" hidden></div>' +
      '<div id="report" class="explain report inset" hidden></div>' +
      (S.ygOpen ? ygPanelHtml() : '') +
      '<div class="ctl-sep"></div><div class="ctl-row eq">' +
      (explainEligible(S.fb) ? '<button class="btn" id="exBtn">' + (S.exOpen ? 'Zwiń ' : 'Wyjaśnij ') + K('E') + '</button>' : '') +
      (canSimplify(it, S.fb) ? '<button class="btn" id="simpBtn">' + ((D().sentFails || {})[c.id] >= 3 ? '<span class="rec-dot" title="To zdanie nie wychodzi kilka razy — spróbuj prostszej wersji"></span>' : '') + 'Uprość ' + K('Z') + '</button>' : '') +
      (it.simple ? '' : '<button class="btn' + (D().cards[c.id] && D().cards[c.id].hard ? ' pressed' : '') + '" id="hardBtn" title="Dla mnie trudne — niech wraca częściej (kliknij jeszcze raz, by zdjąć)">Trudne ' + K('T') + '</button>') +
      ((D().cards[c.id] && D().cards[c.id].state === 'known') || it.stub ? '' : '<button class="btn" id="known">Umiem to ' + K('Alt+Enter') + '</button>') +
      '<button class="btn" id="next">Dalej ' + K('Enter') + '</button></div>' +
      (it.w && !it.fromText ? '<button class="btn yg-ic" id="ygBtn" title="Filmy — posłuchaj słowa w filmach (V)" aria-label="Filmy (V)"' + (S.ygOpen ? ' disabled' : '') + '><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4" fill="#C2584A"/><path d="M10 9.2v5.6l4.8-2.8z" fill="#fff"/></svg></button>' : '') +
      (fixInfo(it) ? '<button class="btn rep-ic" id="repBtn" title="Zdanie jest złe? (X)" aria-label="Zdanie jest złe? (X)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg></button>' : '');

    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="quit">' + IC.back + ' Przerwij ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>' + (S.boss ? 'Boss tygodnia' : TP.title) + '</b><span>' + (S.finishing ? 'Poprawka błędów · ' + Math.max(1, S.finN - (S.queue.length - S.pos) + 1) + '/' + S.finN : S.topicId ? esc(S.custom) + ' · ' + (S.pos + 1) + '/' + Math.min(S.queue.length, S.guideMax) : S.guide && GUIDE ? 'Krok po kroku · krok ' + (GUIDE.i + 1) + ' z ' + GUIDE.steps.length + ' · ' + (S.pos + 1) + '/' + Math.min(S.queue.length, S.guideMax) : S.boss ? TP.title + ' · podwójne XP' : S.play ? (S.lim ? 'Graj · ' + limText() : 'Graj · bez limitu') : S.custom ? esc(S.custom) : S.quick ? 'Szybka sesja' : 'Blok ' + S.blockNo) + '</span></div>' +
      '<div class="row" style="gap:12px"><div class="combo raised" id="combo">Combo ×' + S.combo + '</div>' +
      '<div class="timer inset deep" id="timer" title="' + (S.play || S.boss ? 'Czas gry' : 'Czas do końca bloku') + '">' + (S.play || S.boss ? (S.play ? limTimer() : U.mmss(S.activeSec)) : U.mmss(Math.max(0, blockSec - used))) + '</div></div></header>' +
      (S.boss ? bossBarHtml() : S.play ? (S.lim ? '<div class="bar thin inset"><div id="blockbar" style="width:' + limPct() + '%"></div></div>' : '') : '<div class="bar thin inset"><div id="blockbar" style="width:' + Math.min(100, used / blockSec * 100) + '%"></div></div>') +
      '<main class="ex-card raised"><div class="ex-top"><div class="tag">' + tag + '</div>' + (function () {
        if (it.stub) { const x = stubs()[it.stub]; return x ? '<div class="wscale"><span class="ub-dots">' + [0, 1, 2, 3].map(i => '<i' + (i < (x.state === 'done' ? STUB_DAYS : x.days.length) ? ' class="ok"' : '') + '></i>').join('') + '</span><span class="small-note">' + (x.state === 'done' ? 'opanowany' : x.days.length + '/' + STUB_DAYS + ' dni bez błędu') + '</span></div>' : ''; }
        const wid = scaleKey(it); if (!wid) return '';
        const w2 = ph === 'feedback' && S.fb && S.fb.wsc;
        const b = w2 ? (w2.b || 0) : basketOf(wid);
        const note = w2 ? (w2.same ? 'dziś już liczone' : w2.d > 0 ? '+1' : w2.d < 0 ? '−1' : 'bez zmian') : '';
        return '<div class="wscale">' + (w2 ? dotsHtml(w2.lv, b ? 0 : w2.d) : wordDots(wid)) + (b ? basketHtml(b) : '<span class="small-note">' + (w2 ? w2.lv : wordLv(wid)) + '/5' + (note ? ' · ' + note : '') + '</span>') + '</div>';
      })() + '</div>' + body + lower + '</main></div>';

    if (ph === 'answer') unifyControls();
    speakIcon();
    if (ph === 'feedback') hookIcon(it);
    bindExercise(it, c);
  }
  /* który model AI odpowiedział — delikatny dopisek przy znaczku AI */
  function mdlShort(m) { m = String(m || ''); return /sonnet/i.test(m) ? 'Sonnet' : /haiku/i.test(m) ? 'Haiku' : /opus/i.test(m) ? 'Opus' : m; }
  function mdlTag(m) { return m ? '<i class="mdl" title="Odpowiedział model: ' + esc(m) + '"> · ' + esc(mdlShort(m)) + '</i>' : ''; }
  function aiTag(m) { return '<span class="ai-tag">AI' + mdlTag(m) + '</span>'; }
  /* ---------- Haczyk pamięciowy: ikonka żarówki po błędzie przy słowach, okienko po kliknięciu (klawisz H) ---------- */
  const HOOK_TYPES = { cloze: 1, choice: 1, particle: 1, pvwrite: 1 };
  const HOOK_BUSY = {}, HOOK_MSG = {};
  const LIGHTBULB = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
  function hookWordId(it) { if (!it || !it.w || it.fromText || !it.id) return null; const id = it.id.indexOf(':') >= 0 ? it.id.slice(it.id.indexOf(':') + 1) : it.id; return WORDS.byId[id] ? id : null; }
  const c0 = it => (cur() || {}).id || it.id;
  function hookGet(wid) { return ((D().hooks || {})[wid]) || null; }
  function hookFetch(wid, avoid) {
    const w = WORDS.byId[wid]; if (!w || !AI.enabled() || HOOK_BUSY[wid]) return Promise.resolve(hookGet(wid));
    HOOK_BUSY[wid] = true; delete HOOK_MSG[wid];
    return AI.memHook(w.answers[0], w.pl, fullSentence({ w }), L[levels().vocab], avoid || [])
      .then(r => {
        const H = D().hooks = D().hooks || {}, prev = H[wid];
        if (r.ok) H[wid] = { t: r.hook, m: AI.lastModel(), at: Date.now(), tried: ((prev && prev.tried) || []).concat(prev && prev.t && !prev.own ? [prev.t] : []).slice(-5) };
        else if (!prev) H[wid] = { none: 1, at: Date.now() };
        else if (prev.t) HOOK_MSG[wid] = 'AI nie znalazło innego dobrego haczyka — zostaje ten. Spróbuj jeszcze raz albo wpisz własny.';
        const se = AI.smartErr(), st = D().settings; if (se && st.smartOn !== false && AI.lastModel() === (st.model || 'claude-haiku-5-5').trim()) HOOK_MSG[wid] = (HOOK_MSG[wid] ? HOOK_MSG[wid] + ' ' : '') + 'Lepszy model nie zadziałał (' + se + ') — użyto szybkiego. Sprawdź nazwę modelu w Ustawieniach → Sztuczna inteligencja.';
        Store.save(); return H[wid];
      })
      .catch(e => { HOOK_MSG[wid] = 'Nie udało się zapytać AI: ' + AI.humanError(e); return hookGet(wid); })
      .then(x => { delete HOOK_BUSY[wid]; return x; });
  }
  function hookBtnHtml(id) { return '<button class="btn raised hk-btn" id="' + id + '" title="Haczyk — jak zapamiętać (H)" aria-label="Haczyk — jak zapamiętać (H)">' + LIGHTBULB + '</button>'; }
  function hookIcon(it) {
    const fb = S && S.fb; if (!fb || !HOOK_TYPES[it.type]) return;
    const wid = hookWordId(it); if (!wid) return;
    const h = hookGet(wid);
    const weak = fb.kind === 'bad' || fb.kind === 'idk' || fb.kind === 'uns' || S.unsure || (D().cards[c0(it)] || {}).hard; // błąd, „Zgaduję” albo „Trudne” — haczyk przygotowany od razu
    if (h && h.none && !h.t && weak) return;
    if (!h && !AI.enabled()) return;
    const line = document.querySelector('.ex-card .fb > span'); if (!line) return;
    const sm = line.querySelector('small');
    const tmp = document.createElement('span'); tmp.innerHTML = hookBtnHtml('hkBtn'); const btn = tmp.firstChild;
    if (sm) line.insertBefore(btn, sm); else line.appendChild(btn);
    btn.onclick = e => { e.stopPropagation(); hookToggle(btn, wid); };
    if (!h && weak) { const sess = S; hookFetch(wid).then(x => { if (S === sess && S.phase === 'feedback' && x && x.none && !x.t) { const b = document.getElementById('hkBtn'); if (b && !document.querySelector('.hk-pop')) b.remove(); } else { const p = document.querySelector('.hk-pop'); if (p && p.dataset.wid === wid) hookRender(p, wid); } }); }
  }
  function hookClose() { const p = document.querySelector('.hk-pop'); if (p) p.remove(); document.removeEventListener('click', hookOutside, true); }
  function hookOutside(e) { const p = document.querySelector('.hk-pop'); if (p && !p.contains(e.target) && !e.target.closest('.hk-btn')) hookClose(); }
  function hookToggle(btn, wid) {
    if (document.querySelector('.hk-pop')) { hookClose(); return; }
    const box = btn.closest('.ex-card, header.top, .rs-sec') || document.body;
    const pop = document.createElement('div'); pop.className = 'hk-pop'; pop.dataset.wid = wid;
    box.appendChild(pop);
    const r = btn.getBoundingClientRect(), br = box.getBoundingClientRect(), W = Math.min(420, br.width - 24);
    let left = r.right - br.left - W + 30; left = Math.max(12, Math.min(left, br.width - W - 12));
    pop.style.width = W + 'px'; pop.style.left = left + 'px'; pop.style.top = (r.bottom - br.top + 12) + 'px';
    pop.style.setProperty('--ax', Math.max(14, r.left + r.width / 2 - br.left - left - 7) + 'px');
    hookRender(pop, wid);
    if (!hookGet(wid) || (!hookGet(wid).t)) hookFetch(wid).then(() => { if (pop.isConnected) hookRender(pop, wid); });
    setTimeout(() => document.addEventListener('click', hookOutside, true), 0);
  }
  function hookRender(pop, wid, editing) {
    const h = hookGet(wid), busy = !!HOOK_BUSY[wid], w = WORDS.byId[wid];
    const body = editing
      ? '<textarea class="txt hk-in" rows="3" placeholder="Twoje skojarzenie — np. obraz, podobne polskie słowo…">' + esc(h && h.own ? h.t : '') + '</textarea><div class="hb"><button class="btn small" data-hk="cancel">Anuluj</button><button class="btn small primary" data-hk="save">Zapisz</button></div>'
      : (busy && !(h && h.t) ? '<div class="checking"><span class="spinner"></span>AI szuka dobrego haczyka…</div>'
        : h && h.t ? '<div class="hk-t">' + qaFmt(h.t) + '</div>'
        : '<div class="small-note">' + (AI.enabled() ? 'AI nie znalazło dobrego haczyka do tego słowa. Możesz wpisać własny.' : 'Haczyki od AI wymagają klucza API. Możesz wpisać własny.') + '</div>') +
        (HOOK_MSG[wid] && !busy ? '<div class="small-note hk-msg">' + esc(HOOK_MSG[wid]) + '</div>' : '') +
        '<div class="hb">' + (h && h.t ? (h.own ? '<span class="small-note" style="margin-right:auto;align-self:center">Twój haczyk</span>' : '<span style="margin-right:auto;align-self:center">' + aiTag(h.m) + '</span>') : '') +
        (AI.enabled() ? '<button class="btn small raised" data-hk="other"' + (busy ? ' disabled' : '') + '>' + (busy && h && h.t ? 'Szukam…' : 'Inny') + '</button>' : '') +
        '<button class="btn small raised" data-hk="own">Mój</button></div>';
    pop.innerHTML = '<div class="hl"><span>' + LIGHTBULB.replace('width="20" height="20"', 'width="14" height="14"') + ' Haczyk · <span lang="en">' + esc(w ? w.answers[0] : '') + '</span></span><button data-hk="x" aria-label="Zamknij">×</button></div>' + body;
    pop.querySelectorAll('[data-hk]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      const k = b.dataset.hk;
      if (k === 'x') return hookClose();
      if (k === 'own') { hookRender(pop, wid, true); const t = pop.querySelector('.hk-in'); if (t) t.focus(); return; }
      if (k === 'cancel') return hookRender(pop, wid);
      if (k === 'save') { const v = (pop.querySelector('.hk-in').value || '').trim(); const H = D().hooks = D().hooks || {}; if (v) H[wid] = Object.assign({}, H[wid], { t: v, own: 1, none: 0, at: Date.now() }); Store.save(); return hookRender(pop, wid); }
      if (k === 'other') { const cur = hookGet(wid), avoid = ((cur && cur.tried) || []).concat(cur && cur.t ? [cur.t] : []); if (cur && cur.own) { /* własny zostaje jako zapas */ } hookFetch(wid, avoid).then(() => { if (pop.isConnected) hookRender(pop, wid); }); hookRender(pop, wid); }
    });
  }
  /* „Odsłuchaj zdanie” rzadko używane: mała ikonka głośnika na początku zdania (klawisz bez zmian) */
  function speakIcon() {
    const b = document.getElementById('speak'), sent = document.querySelector('.ex-card .sentence');
    if (!b || !sent) return;
    const k = b.querySelector('.kbd'), key = k ? k.textContent.trim() : 'S';
    b.className = 'btn spk-ic'; b.innerHTML = IC.speaker;
    b.title = 'Odsłuchaj zdanie (' + key + ')'; b.setAttribute('aria-label', b.title);
    sent.insertBefore(b, sent.firstChild);
    // Filmy (YouTube) razem z głośnikiem, przed nim
    const y = document.getElementById('ygBtn');
    if (y) { y.className = 'btn spk-ic yg-in'; sent.insertBefore(y, b); }
  }
  /* wspólny dolny rząd przycisków we wszystkich ćwiczeniach: Zgaduję | … | Sprawdź (pod cienką kreską) */
  function unifyControls() {
    const main = document.querySelector('main.ex-card');
    if (!main || main.querySelector('.ctl-row')) return;
    const rows = [...main.children].filter(el => el.classList.contains('row') && el.classList.contains('center') && el.querySelector('#known, #idk, #check, #undo, #skip'));
    const un = main.querySelector(':scope > #unsure');
    if (!rows.length && !un) return;
    const btns = []; rows.forEach(r => [...r.querySelectorAll('button')].forEach(b => btns.push(b)));
    const chk = btns.find(b => b.id === 'check'), rest = btns.filter(b => b !== chk);
    const row = document.createElement('div'); row.className = 'ctl-row';
    const vs = () => { const d = document.createElement('span'); d.className = 'vsep'; return d; };
    if (un) { const t = un.querySelector('span:nth-child(2)'); if (t) t.textContent = 'Zgaduję'; row.append(un); if (rest.length || chk) row.append(vs()); }
    rest.forEach(b => row.append(b));
    if (chk) { chk.removeAttribute('style'); if (rest.length || un) row.append(vs()); row.append(chk); }
    rows.forEach(r => { if (!r.querySelector('button')) r.remove(); });
    const sep = document.createElement('div'); sep.className = 'ctl-sep';
    main.append(sep, row);
  }

  function bindExercise(it, c) {
    const ph = S.phase, inp = $('#ans');
    const full = fullSentence(it);
    const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    on('#quit', () => finishSession(false));
    const speakFn = () => {
      if ((it.type === 'cloze' || it.type === 'choice') && ph !== 'feedback') { const [a, b] = splitSentence(it.w.s); Speech.speak([a, b]); }
      else if (it.type === 'dictation' && it.fast && ph === 'answer') { if (S.plays >= 1) { toast('W tym trybie tylko jedno odsłuchanie.'); return; } S.plays++; Speech.speak(full, (D().settings.rate || 0.95) * 1.15); }
      else Speech.speak(full);
    };
    on('#speak', speakFn);
    on('#reMic', retrySpeak);
    on('#topicBtn', () => openTopic(it));
    on('#hardBtn', () => toggleHard(c));
    const keepAnswer = () => { if (inp && !inp.disabled) S.answer = inp.value; };
    const toggleUnsure = () => { keepAnswer(); S.unsure = !S.unsure; renderExercise(); };
    if (ph === 'answer') {
      if (inp) {
        inp.oninput = () => { S.answer = inp.value; if (S.emptyPrompt) { S.emptyPrompt = false; const h = app.querySelector('.hint[role=status]'); if (h) h.remove(); } autoCheck(it, c); };
        inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);
      }
      on('#unsure', toggleUnsure);
      on('#check', () => submit(false));
      on('#known', markKnown);
      on('#idk', dontKnow);
      on('#hint', () => showHint(it));
      on('#slow', () => Speech.speak(full, (D().settings.rate || 0.95) * 0.7));
      on('#undo', orderBack);
      $$('[data-ins]').forEach(b => b.onclick = () => { const i = +b.dataset.ins; S.ins = i >= S.order.length ? null : i; renderExercise(); });
      on('#skip', skipCard);
      on('#mic', it.type === 'translate' || it.type === 'tense_t' ? toggleDictate : toggleListen);
      $$('[data-topt]').forEach(b => b.onclick = () => pickTenseOpt(it, +b.dataset.topt));
      $$('[data-copt]').forEach(b => b.onclick = () => pickChoice(it, +b.dataset.copt));
      on('#plRetry', () => { delete PL_ERR[it.id]; renderExercise(); });
      $$('[data-popt]').forEach(b => b.onclick = () => pickParticle(it, +b.dataset.popt));
      $$('[data-tile]').forEach(b => b.onclick = () => pickTile(+b.dataset.tile));
      $$('[data-un]').forEach(b => b.onclick = () => { const u = +b.dataset.un; S.order.splice(u, 1); if (S.ins != null) { if (u < S.ins) S.ins--; if (S.ins >= S.order.length) S.ins = null; } renderExercise(); });
      $$('[data-tok]').forEach(b => b.onclick = () => pickToken(it, +b.dataset.tok));
      if (it.type === 'dictation' && !S.autoPlayed) { S.autoPlayed = true; setTimeout(() => { if (cur() === c && S.phase === 'answer') speakFn(); }, 350); }
    } else if (ph === 'feedback') {
      on('#next', next);
      on('#known', markKnown);
      on('#ygBtn', () => openFilms(it.w.answers[0]));
      const exToggle = () => { if (S.exOpen) { S.exOpen = false; renderExplainPanel(it); const b = $('#exBtn'); if (b) b.innerHTML = 'Wyjaśnij ' + K('E'); } else { openExplain(it); const b = $('#exBtn'); if (b) b.innerHTML = 'Zwiń ' + K('E'); } };
      on('#exBtn', exToggle);
      on('#simpBtn', () => simplifyCurrent(it));
      on('#repBtn', () => reportToggle(it));
      if (S.rep) renderReportPanel(it);
      S.exToggle = exToggle;
      if (S.exOpen) renderExplainPanel(it);
      if (S.ygOpen) ygMount(it.w.answers[0]);
    }

    keyHandler = e => {
      if (e.repeat || !S) return;
      const p = S.phase;
      if (e.key === 'Escape') { e.preventDefault(); if (S.listening) Recog.stop(); finishSession(false); return; }
      if (p === 'answer') {
        if (altKey(e, 'KeyU') || (e.key === 'Enter' && e.altKey && !e.ctrlKey && !e.metaKey)) { e.preventDefault(); markKnown(); return; }
        if (altKey(e, 'KeyW')) { e.preventDefault(); dontKnow(); return; }
        if (altKey(e, 'KeyN') && $('#unsure')) { e.preventDefault(); toggleUnsure(); return; }
        if (altKey(e, 'KeyP')) { e.preventDefault(); showHint(it); return; }
        if (altKey(e, 'KeyS') && $('#speak') && !$('#speak').hidden) { e.preventDefault(); speakFn(); return; }
        if (it.type === 'choice' && !e.altKey && !e.ctrlKey && !e.metaKey) {
          if (/^[1-4]$/.test(e.key)) { e.preventDefault(); pickChoice(it, +e.key - 1); }
          return;
        }
        if (it.type === 'tense_c' && !e.altKey && !e.ctrlKey && !e.metaKey) {
          if (/^[1-4]$/.test(e.key)) { e.preventDefault(); pickTenseOpt(it, +e.key - 1); }
          return;
        }
        if (it.type === 'tense_t' && altKey(e, 'KeyM') && $('#mic')) { e.preventDefault(); toggleDictate(); return; }
        if (it.type === 'particle' && !e.altKey && !e.ctrlKey && !e.metaKey) {
          if (/^[1-4]$/.test(e.key)) { e.preventDefault(); pickParticle(it, +e.key - 1); }
          return;
        }
        if (it.type === 'translate') {
          if (altKey(e, 'KeyM') && $('#mic')) { e.preventDefault(); toggleDictate(); return; }
          if (altKey(e, 'KeyK') && $('#skip')) { e.preventDefault(); skipCard(); return; }
        }
        if (it.type === 'speak') {
          if (altKey(e, 'KeyK')) { e.preventDefault(); skipCard(); return; }
          if ((e.code === 'Space' || altKey(e, 'KeyM') || (plainKey(e, 'KeyM') && S.spPend)) && !typingInField()) { e.preventDefault(); toggleListen(); return; }
          if (e.key === 'Enter' && !e.altKey && S.spPend && !S.listening && !onButton()) { e.preventDefault(); confirmSpeak(); return; }
          return;
        }
        if (it.type === 'order' && !typingInField() && !e.altKey && !e.ctrlKey && !e.metaKey) {
          if (/^[0-9]$/.test(e.key)) { e.preventDefault(); const k = e.key === '0' ? 9 : +e.key - 1; if (k < S.tiles.tiles.length) pickTile(k); return; }
          if (e.key === 'Backspace') { e.preventDefault(); orderBack(); return; }
          if (e.key === 'ArrowLeft') { e.preventDefault(); orderMove(-1); return; }
          if (e.key === 'ArrowRight') { e.preventDefault(); orderMove(1); return; }
          if (e.key === 'Home') { e.preventDefault(); S.ins = S.order.length ? 0 : null; renderExercise(); return; }
          if (e.key === 'End') { e.preventDefault(); S.ins = null; renderExercise(); return; }
          if (e.key === 'Enter' && !onButton()) { e.preventDefault(); submit(e.shiftKey); return; }
          return;
        }
        if (it.type === 'error' && S.errSel == null && !e.altKey && !e.ctrlKey && !e.metaKey) {
          const n = S.errTok.tokens.length;
          if (e.key === 'ArrowRight') { e.preventDefault(); S.errCursor = (S.errCursor + 1) % n; renderExercise(); return; }
          if (e.key === 'ArrowLeft') { e.preventDefault(); S.errCursor = (S.errCursor - 1 + n) % n; renderExercise(); return; }
          if ((e.key === 'Enter' || e.code === 'Space') && !onButton()) { e.preventDefault(); pickToken(it, S.errCursor); return; }
          if (/^[0-9]$/.test(e.key)) { const k = e.key === '0' ? 9 : +e.key - 1; if (k < n) { e.preventDefault(); pickToken(it, k); } return; }
          return;
        }
        if (e.key === 'Enter' && !onButton()) { e.preventDefault(); submit(e.shiftKey); }
        return;
      }
      if (p === 'feedback') {
        if (altKey(e, 'KeyS') || plainKey(e, 'KeyS')) { e.preventDefault(); speakFn(); return; }
        if ((plainKey(e, 'KeyM') || altKey(e, 'KeyM')) && $('#reMic')) { e.preventDefault(); retrySpeak(); return; }
        if (plainKey(e, 'KeyR') && !S.ygOpen && AI.enabled() && !it.topic && !S.topicId) { e.preventDefault(); openTopic(it); return; }
        if (plainKey(e, 'KeyT') && $('#hardBtn')) { e.preventDefault(); toggleHard(c); return; }
        if (plainKey(e, 'KeyH') && $('#hkBtn')) { e.preventDefault(); $('#hkBtn').click(); return; }
        if ((altKey(e, 'KeyU') || plainKey(e, 'KeyU') || (e.key === 'Enter' && e.altKey)) && $('#known')) { e.preventDefault(); markKnown(); return; }
        if (plainKey(e, 'KeyE') && $('#exBtn') && S.exToggle) { e.preventDefault(); S.exToggle(); return; }
        if (plainKey(e, 'KeyZ') && $('#simpBtn')) { e.preventDefault(); simplifyCurrent(it); return; }
        if (plainKey(e, 'KeyX') && $('#repBtn')) { e.preventDefault(); reportToggle(it); return; }
        if ((altKey(e, 'KeyV') || plainKey(e, 'KeyV')) && it.w && !it.fromText) { e.preventDefault(); if (S.ygOpen) ygClose(); else openFilms(it.w.answers[0]); return; }
        if (S.ygOpen && plainKey(e, 'ArrowRight')) { e.preventDefault(); ygCmd('next'); return; }
        if (S.ygOpen && plainKey(e, 'ArrowLeft')) { e.preventDefault(); ygCmd('previous'); return; }
        if (S.ygOpen && plainKey(e, 'KeyR')) { e.preventDefault(); ygCmd('replay'); return; }
        if (e.key === 'Enter' && !onButton()) { e.preventDefault(); next(); }
      }
    };
  }

  /* Zatwierdzaj automatycznie: odpowiedź identyczna z wzorcem → od razu „Dobrze”, bez Entera */
  function isExactAnswer(it, ans) {
    if (!ans || !ans.trim()) return false;
    if (it.type === 'cloze') return it.w.answers.map(U.norm).includes(U.norm(ans));
    if (it.type === 'pvwrite') { const sp = pvSplit(it.w); return U.norm(ans).replace(new RegExp('^' + escapeRe(sp.verb) + '\\s+'), '') === sp.part; }
    if (it.type === 'error') return S.errSel != null && U.norm(ans) === U.norm(it.g.correct);
    if (it.type === 'tense_w' && it.ts) return it.ts.correct.some(x => contractions(x) === contractions(ans));
    if (it.type === 'tense_t' && it.ts) return contractions(ans).replace(/[.!?]+$/, '') === contractions(it.ts.full).replace(/[.!?]+$/, '');
    if (it.type === 'translate') return U.norm(ans) === U.norm(fullSentence(it));
    if (it.type === 'dictation') return wordsOf(ans).join(' ') === wordsOf(fullSentence(it)).join(' ');
    return false;
  }
  let autoTimer = 0;
  function autoCheck(it, c) {
    clearTimeout(autoTimer);
    if (D().settings.autoOk === false || !S || S.phase !== 'answer' || !isExactAnswer(it, S.answer)) return;
    const sess = S;
    autoTimer = setTimeout(() => {
      if (S !== sess || cur() !== c || S.phase !== 'answer') return;
      const inp = $('#ans'); if (inp) S.answer = inp.value;
      if (isExactAnswer(it, S.answer)) submit(false);
    }, 300);
  }

  function hintBtn(first, cls) { const lv = S.hint || 0; return '<button class="btn' + (cls ? ' ' + cls : '') + '" id="hint"' + (lv >= 2 ? ' disabled' : '') + '>' + (lv === 0 ? first : 'Więcej pomocy') + ' ' + K('Alt+P') + '</button>'; }
  function showHint(it) {
    if (S.phase !== 'answer') return;
    const lv = S.hint || 0, inp = $('#ans');
    if (inp) S.answer = inp.value;
    const swap = o => { S.view = Object.assign({}, it, o); };
    const LBL2 = 'POMOC · ';
    if (it.type === 'order') {
      const T2 = S.tiles; let p = 0;
      while (p < S.order.length && T2.tiles[S.order[p]].t === T2.correct[p]) p++;
      S.order = S.order.slice(0, p); S.ins = null;
      if (p < T2.correct.length) { const k = T2.tiles.findIndex((x, idx) => x.t === T2.correct[p] && !S.order.includes(idx)); if (k >= 0) S.order.push(k); }
      S.hint = Math.min(2, lv + 1); S.orderIncomplete = false; renderExercise(); return;
    }
    if (lv >= 2) return;
    if (lv === 0) {
      S.hint = 1;
      if (it.type === 'pvwrite') { const vb = pvSplit(it.w).verb; S.answer = U.norm(S.answer || '').replace(new RegExp('^' + escapeRe(vb) + '\\s*'), ''); }
      if (it.type === 'dictation') Speech.speak(fullSentence(it), (D().settings.rate || 0.95) * 0.7);
      renderExercise(); return;
    }
    S.hint = 2;
    if (it.type === 'cloze') { S.chOpts = null; swap({ type: 'choice', stepLabel: LBL2 + '4 PROPOZYCJE' }); }
    else if (it.type === 'pvwrite') { S.pvOpts = null; swap({ type: 'particle', stepLabel: LBL2 + '4 PROPOZYCJE' }); }
    else if (it.type === 'tense_w') { S.tnOpts = null; swap({ type: 'tense_c', stepLabel: LBL2 + '4 FORMY' }); }
    else if (it.type === 'tense_t') { swap({ type: 'tense_w', stepLabel: LBL2 + 'WPISZ FORMĘ' }); S.answer = ''; }
    else if (it.type === 'translate') { S.tiles = null; S.order = []; S.ins = null; swap({ type: 'order', plPrompt: it.pl, stepLabel: LBL2 + 'KAFELKI' }); }
    else if (it.type === 'dictation') swap({ hintLetters: true, stepLabel: LBL2 + 'PIERWSZE LITERY' });
    else if (it.type === 'error') { if (S.errTok) S.errSel = S.errTok.span[0]; }
    else if (it.type === 'speak') swap({ readAloud: true, fromPl: false, stepLabel: LBL2 + 'PRZECZYTAJ' });
    renderExercise();
  }
  function pickParticle(it, i) {
    if (!S || S.phase !== 'answer' || !S.pvOpts || i >= S.pvOpts.length) return;
    const ans = S.pvOpts[i], part = pvSplit(it.w).part, el = (Date.now() - S.cardStart) / 1000;
    if (ans === part) return applyOutcome(cur(), it, 'exact', el, { ans });
    judgeAlt(it, pvSplit(it.w).verb + ' ' + ans, ans, el, ans);
  }
  function pickTile(k) {
    if (S.phase !== 'answer' || S.order.includes(k)) return;
    if (S.ins == null || S.ins >= S.order.length) { S.order.push(k); S.ins = null; }
    else { S.order.splice(S.ins, 0, k); S.ins++; }
    S.emptyPrompt = false; S.orderIncomplete = false;
    renderExercise();
    orderAutoCheck();
  }
  /* wszystkie kafelki ułożone i dobrze → sprawdza samo (jak przy pisaniu; wyłącza „Zatwierdzaj automatycznie” w Ustawieniach) */
  function orderAutoCheck() {
    if (D().settings.autoOk === false || !S || S.phase !== 'answer' || !S.tiles || S.order.length !== S.tiles.tiles.length) return;
    const got = U.norm(S.order.map(k => S.tiles.tiles[k].t).join(' ')), want = U.norm(S.tiles.correct.join(' '));
    if (got !== want) return;
    const sess = S, c = cur();
    setTimeout(() => { if (S === sess && cur() === c && S.phase === 'answer' && S.order.length === S.tiles.tiles.length) submit(false); }, 350);
  }
  /* usuń słowo przed kursorem (Backspace / Cofnij) */
  function orderBack() {
    const at = S.ins == null ? S.order.length : S.ins;
    if (at <= 0) return;
    S.order.splice(at - 1, 1);
    if (S.ins != null) S.ins = at - 1 >= S.order.length ? null : at - 1;
    S.orderIncomplete = false; renderExercise();
  }
  function orderMove(d) {
    const at = S.ins == null ? S.order.length : S.ins, nx = Math.max(0, Math.min(S.order.length, at + d));
    S.ins = nx >= S.order.length ? null : nx; renderExercise();
  }
  function pickToken(it, k) {
    if (S.phase !== 'answer' || S.errSel != null) return;
    const [s0, s1] = S.errTok.span;
    if (k >= s0 && k <= s1) { S.errSel = k; S.answer = ''; renderExercise(); return; }
    applyOutcome(cur(), it, 'wrongplace', (Date.now() - S.cardStart) / 1000, { picked: S.errTok.tokens[k] });
  }
  function skipCard() {
    if (!S || S.phase !== 'answer') return;
    if (S.listening) Recog.stop();
    if (S.boss) S.bossHit[cur().id] = 1;
    S.queue.splice(S.pos, 1);
    resetCardState();
    if (S.boss && Object.keys(S.bossHit).length >= S.bossMax) { S.bossWon = true; return finishSession(true); }
    if (S.pos >= S.queue.length) return finishSession(true);
    renderExercise();
  }
  /* program otwarty jako plik (file://) — Chrome nie zapamiętuje wtedy zgody na mikrofon i pyta za każdym razem */
  const FILE_MODE = location.protocol === 'file:';
  function micHint() { return FILE_MODE ? '<div class="hint mic-hint">Chrome pyta o mikrofon za każdym razem, bo program jest otwarty jako plik. Uruchom go przez <b>Uruchom.bat</b> (adres <b>localhost:8642</b>) i raz kliknij „Zezwalaj” — wtedy zapamięta.</div>' : ''; }
  function recogMsg(err) {
    if (err === 'not-allowed' && FILE_MODE) return 'Brak zgody na mikrofon. Program jest otwarty jako plik — uruchom go przez Uruchom.bat (localhost:8642), wtedy Chrome zapamięta zgodę.';
    return ({
      'not-allowed': 'Brak dostępu do mikrofonu. Kliknij ikonę kłódki/mikrofonu w pasku adresu i ustaw „Mikrofon: Zezwalaj” (nie „tylko tym razem”) — albo pomiń to ćwiczenie.',
      'service-not-allowed': 'Przeglądarka nie pozwala na rozpoznawanie mowy. Spróbuj w Chrome albo Edge.',
      'no-speech': 'Nic nie usłyszałem — naciśnij Spację i spróbuj jeszcze raz.',
      'network': 'Rozpoznawanie mowy wymaga połączenia z internetem.',
      'audio-capture': 'Nie znaleziono mikrofonu.',
      'unsupported': 'Ta przeglądarka nie rozpoznaje mowy — użyj Chrome albo Edge.',
      'start': 'Nie udało się uruchomić mikrofonu — spróbuj jeszcze raz.'
    })[err] || ('Błąd rozpoznawania mowy: ' + err);
  }
  function toggleListen() {
    if (!S || S.phase !== 'answer') return;
    if (S.listening) { Recog.stop(); return; }
    const sess = S, c = cur(), it = curView(c);
    if (window.speechSynthesis) speechSynthesis.cancel();
    S.recogErr = ''; S.interim = ''; S.listening = true;
    renderExercise();
    Recog.listen({
      onInterim: t => { if (S !== sess || cur() !== c) return; S.interim = t; const el = document.getElementById('interim'); if (el) el.textContent = t; },
      onResult: alts => {
        if (S !== sess || cur() !== c) return;
        S.listening = false;
        const full = fullSentence(it);
        /* uczciwa ocena (upd214): liczy się najbardziej prawdopodobne odczytanie; szukane słowo tylko w dalszym odczytaniu = „prawie” */
        const top = alts[0], topT = containsTarget(top, it.w.answers);
        let bs = listenScore(full, top), bt = topT, alt = false;
        if (!topT) { const k = alts.findIndex(a => containsTarget(a, it.w.answers)); if (k > 0) { bs = listenScore(full, alts[k]); bt = true; alt = true; } }
        let m = bt && bs >= 0.9 ? 'exact' : bt && bs >= 0.45 ? 'typo' : 'wrong'; // „Dobrze” tylko gdy prawie całe zdanie się zgadza
        if (alt && m === 'exact') m = 'typo';
        if (!topT) { const pp = pronNoteConfusion(it.w.answers[0], top, full); if (pp) { Store.save(); setTimeout(() => toast('Para „' + pp.a + ' – ' + pp.b + '” trafiła do ćwiczeń Wymowy (Graj → 0).'), 600); } }
        const el = S.spPend ? S.spPend.el : (Date.now() - S.cardStart) / 1000;
        const best = top;
        S.spPend = { m, el, heard: best, score: bs, hasTarget: bt };
        // całe zdanie się zgadza — oceniamy od razu; inaczej najpierw pokazujemy, co usłyszałem (można powtórzyć, zanim program oceni)
        if (speakMatch(wordDiff(full, best)) && m === 'exact') return confirmSpeak();
        renderExercise();
      },
      onError: err => {
        if (S !== sess || cur() !== c) return;
        S.listening = false;
        if (err !== 'aborted') S.recogErr = recogMsg(err);
        renderExercise();
      }
    });
  }

  function confirmSpeak() {
    if (!S || S.phase !== 'answer' || !S.spPend) return;
    if (S.listening) Recog.stop();
    const c = cur(), it = curView(c), P = S.spPend;
    applyOutcome(c, it, P.m, P.el, { heard: P.heard, score: P.score, hasTarget: P.hasTarget });
  }
  /* mówienie: pełna zgodność zdania (literówki rozpoznawania dopuszczalne) */
  function speakMatch(dfx) { return dfx.aOk.every(Boolean) && dfx.bOk.every(Boolean); }
  /* ćwiczenie wymowy po ocenie — kolejne próby nie zmieniają wyniku, tylko pokazują, co się zgadza */
  function retrySpeak() {
    if (!S || S.phase !== 'feedback') return;
    const sess = S, c = cur(), it = curView(c);
    if (it.type !== 'speak') return;
    if (S.reListening) { Recog.stop(); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    S.reListening = true; S.interim = ''; renderExercise();
    Recog.listen({
      onInterim: t => { if (S !== sess || cur() !== c) return; S.interim = t; const el = document.getElementById('interim'); if (el) el.textContent = t; },
      onResult: alts => {
        if (S !== sess || cur() !== c) return;
        S.reListening = false;
        const full = fullSentence(it);
        let best = alts[0], bs = -1; alts.forEach(a => { const sc = listenScore(full, a); if (sc > bs) { bs = sc; best = a; } });
        if (S.fb.heard2 != null || S.fb.heard) S.fb.tries = (S.fb.tries || 0) + 1;
        S.fb.heard2 = best;
        if (speakMatch(wordDiff(full, best))) Sound.play('ok');
        renderExercise();
      },
      onError: err => { if (S !== sess || cur() !== c) return; S.reListening = false; if (err !== 'aborted') toast(recogMsg(err)); renderExercise(); }
    });
  }
  function dontKnow() {
    if (!S || S.phase !== 'answer') return;
    const c = cur();
    if (S.listening) Recog.stop();
    S.emptyPrompt = false;
    applyOutcome(c, curView(c), 'idk', 0, {});
  }
  function emptyEnter() {
    if (S.emptyPrompt) return dontKnow();
    S.emptyPrompt = true;
    renderExercise();
    shake($('#ans') || $('#built'));
  }

  /* kafelki są małymi literami i bez przecinków — AI ma oceniać tylko kolejność słów */
  const ORDER_TASK = 'Ułóż podane słowa (kafelki) w poprawne angielskie zdanie. WAŻNE: kafelki są pisane małymi literami i nie da się dodać ani usunąć przecinków — NIE oceniaj wielkich liter ani interpunkcji, tylko to, czy kolejność słów daje poprawne, naturalne zdanie o tym samym sensie. Inna poprawna kolejność (np. zdanie podrzędne na początku: „although…, …”) jest w porządku.';
  async function submit(asUnsure) {
    if (!S || S.phase !== 'answer') return;
    const c = cur(), it = curView(c), sess = S;
    if (it.type === 'speak') { if (S.spPend && !S.listening) confirmSpeak(); return; }
    const elapsed = thinkElapsed();
    const full = fullSentence(it);
    const guard = () => S === sess && cur() === c;
    const checking = () => { S.phase = 'checking'; renderExercise(); };

    if (it.type === 'order') {
      if (!S.order.length) return emptyEnter();
      if (S.order.length < S.tiles.tiles.length) { S.orderIncomplete = true; renderExercise(); shake($('#built')); return; }
      if (asUnsure) S.unsure = true;
      const ans = orderAnswer();
      let m = U.norm(ans) === U.norm(full) ? 'exact' : 'wrong', expl = '', aiErr = '';
      const altO = D().altOrd = D().altOrd || {};
      if (m === 'wrong' && (altO[c.id] || []).indexOf(U.norm(ans)) >= 0) { m = 'ai-ok'; expl = 'Ta kolejność też jest poprawna (sprawdzone wcześniej).'; }
      /* zamienione miejscami dwie nazwy własne / liczby (np. z Gdańska do Warszawy) — zdanie dalej poprawne */
      if (m === 'wrong') {
        const tok = x => x.replace(/[.,!?;:]+$/g, '').split(/\s+/), A = tok(full), B = tok(ans), dif = [];
        if (A.length === B.length) A.forEach((w, k) => { if (w.toLowerCase() !== B[k].toLowerCase()) dif.push(k); });
        const prop = w => /^[A-ZĄĆĘŁŃÓŚŹŻ0-9]/.test(w);
        if (dif.length === 2 && dif[0] > 0 && A[dif[0]].toLowerCase() === B[dif[1]].toLowerCase() && A[dif[1]].toLowerCase() === B[dif[0]].toLowerCase() && prop(A[dif[0]]) && prop(A[dif[1]])) { m = 'ai-ok'; expl = 'Zamienione miejscami „' + A[dif[0]] + '” i „' + A[dif[1]] + '” — zdanie też jest poprawne, tylko znaczy co innego.'; }
      }
      if (m === 'wrong' && AI.enabled()) {
        checking();
        try { const r = await AI.checkSentence(ORDER_TASK, full, ans); expl = r.explanation; if (r.acceptable) { m = 'ai-ok'; altO[c.id] = (altO[c.id] || []).concat([U.norm(ans)]); } }
        catch (e) { aiErr = AI.humanError(e); m = 'ai-ok'; S.unsure = true; expl = 'Nie mogłem sprawdzić tej kolejności (AI niedostępne) — liczę jako „niepewne”, bez kary.'; }
        if (!guard()) return;
      }
      return applyOutcome(c, it, m, elapsed, { ans, expl, aiErr });
    }

    if (it.type === 'error' && S.errSel == null) return;
    const inp = $('#ans');
    const ans = inp ? inp.value : S.answer;
    S.answer = ans;
    if (!ans.trim()) return emptyEnter();
    if (asUnsure) S.unsure = true;

    if (it.type === 'choice') return;
    if (it.type === 'pvwrite') return submitPvWrite(it, asUnsure);
    if (it.ts) return submitTense(it, c, asUnsure, elapsed, guard, checking);
    if (it.type === 'translate') {
      if (S.listening) Recog.stop();
      let m = U.norm(ans) === U.norm(full) ? 'exact' : 'wrong', expl = '', aiErr = '', better = '';
      if (m === 'wrong') {
        if (AI.enabled()) {
          checking();
          try {
            const r = await AI.judgeTranslation(it.pl, full, ans.trim(), '', !!S.spoken);
            expl = r.explanation; better = r.better;
            m = r.verdict === 'natural' ? 'ai-ok' : r.verdict === 'understandable' ? 'typo' : 'wrong';
          } catch (e) { aiErr = AI.humanError(e); m = listenScore(full, ans) >= 0.8 ? 'typo' : 'wrong'; }
          if (!guard()) return;
        } else m = listenScore(full, ans) >= 0.8 ? 'typo' : 'wrong';
      }
      return applyOutcome(c, it, m, elapsed, { ans, expl, aiErr, better });
    }

    if (it.type === 'dictation') {
      const sc = listenScore(full, ans);
      const exact = wordsOf(ans).join(' ') === wordsOf(full).join(' ');
      const m = exact ? 'exact' : sc >= 0.75 ? 'typo' : 'wrong';
      return applyOutcome(c, it, m, elapsed, { ans, score: sc });
    }

    if (it.type === 'error') {
      let m = matchAnswer([it.g.correct], ans), expl = '', aiErr = '';
      if (m === 'wrong' && AI.enabled()) {
        checking();
        const E = S.errTok;
        const fixed = E.tokens.slice(0, E.span[0]).concat([ans.trim() + E.attach], E.tokens.slice(E.span[1] + 1)).join(' ');
        try { const r = await AI.checkSentence('Popraw jeden błąd w zdaniu: "' + errSentence(it) + '".', full, fixed); expl = r.explanation; if (r.acceptable) m = 'ai-ok'; }
        catch (e) { aiErr = AI.humanError(e); }
        if (!guard()) return;
      }
      return applyOutcome(c, it, m, elapsed, { ans, expl, aiErr });
    }

    // cloze
    let m = matchAnswer(it.w.answers, ans), expl = '', aiErr = '';
    if (m === 'wrong' && AI.enabled()) {
      checking();
      try { const r = await AI.checkAnswer(it.w, ans); expl = r.explanation; if (r.acceptable) m = 'ai-ok'; }
      catch (e) { aiErr = AI.humanError(e); }
      if (!guard()) return;
    } else if (m === 'typo' && AI.enabled()) {
      checking();
      try { const r = await AI.checkTypo(it.w, ans); if (r.realWord) { m = 'wrong'; expl = r.explanation; } }
      catch (e) { /* bez AI zostaje literówka */ }
      if (!guard()) return;
    }
    applyOutcome(c, it, m, elapsed, { ans, expl, aiErr });
  }

  // dłuższe zdania = więcej czasu: +3 s za każde słowo powyżej 5
  const LEN_TYPES = { order: 1, dictation: 1, speak: 1, translate: 1, tense_t: 1 };
  function lenBonus(it) {
    if (!LEN_TYPES[it.type]) return 0;
    let n = 0;
    try { n = fullSentence(it).split(/\s+/).filter(Boolean).length; } catch (e) { return 0; }
    return 3 * Math.max(0, n - 5);
  }

  function applyOutcome(c, it, m, elapsed, extra) {
    const st = D().settings;
    const correct = !['wrong', 'idk', 'wrongplace'].includes(m);
    const slowLimit = st.slowSec * ({ cloze: 1, error: 1.5, order: 2, dictation: 2, speak: 2, translate: 3, particle: 1, tense_c: 1, tense_w: 1.5, tense_t: 3, choice: 1, pvwrite: 1 }[it.type] || 1) + lenBonus(it);
    const slow = elapsed > slowLimit;
    let g, cap = 0, kind;
    if (m === 'idk') { g = 1; kind = 'idk'; }
    else if (!correct) { g = 1; kind = 'bad'; }
    else if (S.unsure) { g = 2; cap = 2; kind = 'uns'; }
    else if (m === 'typo') { g = 2; kind = 'typo'; }
    else if (S.hint || slow) { g = 2; kind = 'ok'; }
    else { g = 3; kind = 'ok'; }

    const isFirst = !(c.id in S.first);
    if (isFirst && it.type === 'translate' && !it.stub && (m === 'typo' || !correct) && m !== 'idk') { const sm = stubDetect(it, extra); if (sm) extra = Object.assign({}, extra, { stubMsg: sm }); }
    if (isFirst && it.stub) extra = Object.assign({}, extra, { stubMsg: stubProgress(it, kind, correct) });
    if (isFirst) { S.snap = S.snap || {}; const pc0 = D().cards[c.id]; const wk0 = scaleKey(it), ws0 = wk0 && (D().wsc || {})[wk0]; S.snap[c.id] = { card: pc0 ? JSON.parse(JSON.stringify(pc0)) : null, mlen: (D().mistakes || []).length, wk: wk0, wsc: ws0 ? JSON.parse(JSON.stringify(ws0)) : null }; }
    S.stepMsg = '';
    if (isFirst && it.ts) pushTenseHist(it.ts.tid, correct);
    if (isFirst && SENT_TYPES[it.type] && !it.simple) pushSentHist(correct);
    if (!correct && SENT_TYPES[it.type] && !it.simple) { const sf = D().sentFails = D().sentFails || {}; sf[c.id] = (sf[c.id] || 0) + 1; }
    const t = Store.today();
    D().typesPlayed = D().typesPlayed || {}; D().typesPlayed[it.type] = 1;
    if (isFirst && !it.simple) bumpUse(useKey(it.baseType || it.type));
    if (!correct || m === 'typo') logMistake(it, m, extra);
    else if (kind === 'ok' && !it.simple) (D().okAt = D().okAt || {})[c.id] = Date.now(); // zamyka wcześniejsze błędy tego elementu (z innych dni)
    if (S.boss && correct && !S.bossHit[c.id]) S.bossHit[c.id] = 1;
    if (S.boss && !correct) S.bossClean = false;
    if (isFirst && (S.play || it.simple)) {
      // granie: dobre odpowiedzi nie zmieniają planu powtórek, błędy wracają w najbliższej sesji
      S.first[c.id] = g;
      if (!correct && !it.simple) playMiss(c.id);
      if (!it.simple && D().cards[c.id] && D().cards[c.id].hard) hardProgress(D().cards[c.id], kind, correct, false);
      if (!it.simple && D().cards[c.id]) { const sr = stepUpdate(D().cards[c.id], it, kind, correct, elapsed, true, slowLimit) || {}; S.stepMsg = sr.msg || ''; }
      t.total++; S.total++;
      if (correct) { t.correct++; S.correct++; }
      pushHist(TYPES[it.type].skill, correct, histMeta(it, c));
      const skn = TYPES[it.type].skill; t.sk = t.sk || {}; const ska = t.sk[skn] || (t.sk[skn] = [0, 0]); ska[1]++; if (correct) ska[0]++;
    } else if (isFirst) {
      S.first[c.id] = g;
      const prev = D().cards[c.id];
      const nc = FSRS.review(prev && prev.state === 'review' ? prev : null, g, { cap });
      nc.added = (prev && prev.added) || Date.now();
      if (prev) ['st', 'sk', 'ft', 'mastered', 'hard', 'hardOk', 'hardDay'].forEach(k => { if (prev[k] != null) nc[k] = prev[k]; });
      if (nc.hard) hardProgress(nc, kind, correct, true);
      const sr = stepUpdate(nc, it, kind, correct, elapsed, true, slowLimit) || {};
      if (sr.master) masterCard(nc);
      S.stepMsg = sr.msg || '';
      D().cards[c.id] = nc;
      if (c.isNew) {
        if (c.newKind === 'extra') { t.newExtra = (t.newExtra || 0) + 1; S.newExtra++; }
        else { t.newCount++; S.newCount++; }
      } else t.reviews++;
      t.total++; S.total++;
      if (correct) { t.correct++; S.correct++; }
      pushHist(TYPES[it.type].skill, correct, histMeta(it, c));
      // dzienna trafność każdej umiejętności — do przyszłych statystyk
      const skn = TYPES[it.type].skill; t.sk = t.sk || {}; const ska = t.sk[skn] || (t.sk[skn] = [0, 0]); ska[1]++; if (correct) ska[0]++;
    }
    if (g <= 2 && !S.struggled.includes(c.id)) S.struggled.push(c.id);

    let xp = 0;
    if (correct) {
      S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo);
      xp = Math.round((xpBase(it) + (S.combo >= 3 ? 5 : 0)) * (S.boss ? 2 : 1) * (S.hint >= 2 ? 0.3 : S.hint ? 0.6 : 1));
      if (S.hint >= 2 && !S.finishing && !S.play) S.queue.splice(Math.min(S.queue.length, S.pos + 6), 0, { id: c.id, isNew: false, relearn: true });
      S.xp += xp; D().xp += xp; t.xp += xp;
      if (S.combo > D().bestCombo) { D().bestCombo = S.combo; D().bestComboAt = Date.now(); }
    } else {
      S.combo = 0;
      if (!S.finishing) S.queue.splice(Math.min(S.queue.length, S.pos + 4), 0, { id: c.id, isNew: false, relearn: true });
    }
    const wsc = isFirst ? scaleUpdate(it, kind, correct) : null;
    if (wsc) extra = Object.assign({}, extra, { wsc }, wsc.d > 0 && wsc.lv === 5 ? { stepMsg: '' } : {});
    progress(); Store.save();
    const fill = it.type === 'cloze' && m === 'ai-ok' ? (extra.ans || '').trim() : (it.type === 'cloze' || it.type === 'choice') ? it.w.answers[0] : '';
    S.reListening = false;
    S.fb = Object.assign({ stepMsg: S.stepMsg, kind, m, xp, isFirst, fill, slow: correct && kind === 'ok' && (S.hint || slow), hinted: S.hint }, extra);
    if (S.fb.expl && !S.fb.mdl && AI.lastAt() >= S.cardStart) S.fb.mdl = AI.lastModel();
    S.phase = 'feedback';
    renderExercise();
    if (correct) { const cb = document.getElementById('combo'); if (cb) { cb.classList.add('bump'); setTimeout(() => cb.classList.remove('bump'), 220); } }
    Sound.play(kind === 'ok' ? (S.combo >= 5 && S.combo % 5 === 0 ? 'combo' : 'ok') : kind === 'bad' ? 'bad' : kind === 'idk' ? 'idk' : 'uns');
    if (st.speakAfter) {
      const say = it.type === 'cloze' ? it.w.s.replace('_', fill) : fullSentence(it);
      setTimeout(() => { if (S && S.phase === 'feedback') Speech.speak(say); }, Sound.on() ? 450 : 0);
    }
  }

  function feedbackHtml(it) {
    const fb = S.fb;
    const xp = fb.xp ? ' · +' + fb.xp + ' XP' : '';
    const ai = t => aiTag(fb.mdl) + qaFmt(t);
    let cls = 'ok', icon = IC.check, title = fb.m === 'ai-ok' ? 'Też dobrze!' : 'Dobrze!', main = '';
    const smalls = [];
    if (fb.kind === 'bad') { cls = 'bad'; icon = IC.alert; title = 'Jeszcze nie.'; }
    else if (fb.kind === 'idk') { cls = 'info'; icon = IC.question; title = it.type === 'cloze' ? 'Nowe dla Ciebie:' : 'Rozwiązanie jest wyżej.'; }
    else if (fb.kind === 'uns') { cls = 'uns'; icon = IC.question; title = 'Trafione, choć na niepewno.'; }
    else if (fb.kind === 'typo') { cls = 'uns'; title = it.type === 'speak' ? 'Prawie.' : it.type === 'dictation' ? 'Prawie — drobne błędy.' : 'Prawie — literówka.'; }

    if (it.type === 'cloze') {
      const w = it.w;
      if (fb.kind === 'bad') main = 'Poprawnie: <b>' + esc(w.answers[0]) + '</b> — ' + esc(w.pl) + '.';
      else if (fb.kind === 'idk') main = esc(w.answers[0]) + ' — ' + esc(w.pl);
      else if (fb.kind === 'typo') {
        const a = U.norm(fb.ans), x = U.norm(w.answers[0]), al = U.align(a, x);
        const marked = (s, mk) => s.split('').map((ch, i) => mk[i] ? '<mark>' + esc(ch) + '</mark>' : esc(ch)).join('');
        main = esc(w.pl) + xp;
        smalls.push('Ty: <span class="diff">' + marked(a, al.aM) + '</span> → poprawnie: <span class="diff">' + marked(x, al.bM) + '</span>');
      } else main = esc(fb.fill || w.answers[0]) + ' — ' + esc(w.pl) + xp;
      if (fb.m === 'ai-ok') smalls.push(ai(fb.expl) + ' Wzorcowa odpowiedź: ' + esc(w.answers[0]) + '.');
    } else if (it.type === 'order') {
      if (fb.kind === 'bad') main = 'Poprawna kolejność jest wyżej.';
      else if (fb.kind !== 'idk') main = xp.replace(' · ', '');
      if (fb.m === 'ai-ok') smalls.push(ai(fb.expl) + ' Wzorcowo: ' + esc(fullSentence(it)));
    } else if (it.type === 'error') {
      const pair = '<b>' + esc(it.wrong) + '</b> → <b>' + esc(it.g.correct) + '</b>';
      if (m(fb) === 'wrongplace') main = 'Błąd był w innym miejscu: ' + pair + '.';
      else if (fb.kind === 'bad') main = 'Poprawnie: ' + pair + '.';
      else if (fb.kind === 'idk') { title = 'Rozwiązanie:'; main = pair; }
      else main = pair + xp;
      if (fb.ans && fb.ans.trim() && fb.kind !== 'idk' && m(fb) !== 'wrongplace' && U.norm(fb.ans) !== U.norm(it.g.correct)) {
        if (fb.kind === 'typo') { const a = U.norm(fb.ans), x = U.norm(it.g.correct), al = U.align(a, x), mk = (s2, mm) => s2.split('').map((ch, i) => mm[i] ? '<mark>' + esc(ch) + '</mark>' : esc(ch)).join(''); smalls.unshift('Ty: <span class="diff">' + mk(a, al.aM) + '</span> → poprawnie: <span class="diff">' + mk(x, al.bM) + '</span>'); }
        else smalls.unshift('Ty: ' + (fb.m === 'ai-ok' ? '<b>' + esc(fb.ans) + '</b>' : '<s>' + esc(fb.ans) + '</s>'));
      }
      if (it.g.expl) smalls.push('Dlaczego: ' + esc(it.g.expl));
      if (fb.m === 'ai-ok') smalls.push(ai(fb.expl));
    } else if (it.type === 'dictation') {
      if (fb.kind === 'bad') main = 'Zaznaczone słowa się nie zgadzają.';
      else if (fb.kind === 'typo') { main = xp.replace(' · ', ''); smalls.push('Zaznaczone słowa mają literówki — liczę jako trafienie, ale wróci wcześniej.'); }
      else if (fb.kind !== 'idk') main = xp.replace(' · ', '');
    } else if (it.type === 'choice') {
      const w = it.w;
      if (fb.kind === 'bad') main = 'Poprawnie: <b>' + esc(w.answers[0]) + '</b> — ' + esc(w.pl) + '.';
      else if (fb.kind === 'idk') main = esc(w.answers[0]) + ' — ' + esc(w.pl);
      else main = esc(w.answers[0]) + ' — ' + esc(w.pl) + xp;
      if (fb.m === 'ai-ok') { main = esc(fb.ans) + xp; smalls.push(ai(fb.expl) + ' Wzorcowo: ' + esc(w.answers[0]) + ' — ' + esc(w.pl) + '.'); }
    } else if (it.type === 'pvwrite') {
      const w = it.w;
      if (fb.kind === 'bad') { main = 'Poprawnie: <b>' + esc(w.answers[0]) + '</b> — ' + esc(w.pl) + '.'; if (fb.verbOk) smalls.push('Czasownik dobry (<b>' + esc(pvSplit(w).verb) + '</b>) — pomyliła się partykuła.'); }
      else if (fb.kind === 'idk') { title = 'Tak to wygląda:'; main = esc(w.answers[0]) + ' — ' + esc(w.pl); }
      else main = esc(w.answers[0]) + ' — ' + esc(w.pl) + xp;
      if (fb.m === 'ai-ok') { main = esc(fb.full || pvSplit(w).verb + ' ' + fb.ans) + xp; smalls.push(ai(fb.expl) + ' Wzorcowo: ' + esc(w.answers[0]) + ' — ' + esc(w.pl) + '.'); }
    } else if (it.ts) {
      main = tenseFeedback(it, fb, xp, smalls, t => { title = t; });
    } else if (it.type === 'particle') {
      const w = it.w;
      if (fb.kind === 'bad') main = 'Poprawnie: <b>' + esc(w.answers[0]) + '</b> — ' + esc(w.pl) + '.' + (fb.ans ? (function () { const ph = pvSplit(w).verb + ' ' + fb.ans, o2 = WORDS.list.find(x => x.answers[0] === ph); return ' <span class="small-note">(' + (o2 ? '„' + esc(ph) + '” znaczy: ' + esc(o2.pl) : '„' + esc(ph) + '” nie ma tego znaczenia') + ')</span>'; })() : '');
      else if (fb.kind === 'idk') { title = 'Tak to wygląda:'; main = esc(w.answers[0]) + ' — ' + esc(w.pl); }
      else main = esc(w.answers[0]) + ' — ' + esc(w.pl) + xp;
      if (fb.m === 'ai-ok') { main = esc(pvSplit(w).verb + ' ' + fb.ans) + xp; smalls.push(ai(fb.expl) + ' Wzorcowo: ' + esc(w.answers[0]) + ' — ' + esc(w.pl) + '.'); }
    } else if (it.type === 'translate') {
      const better = fb.better && U.norm(fb.better) !== U.norm(fb.ans || '') ? fb.better : '';
      if (fb.kind === 'typo') { title = 'Zrozumiałe — da się lepiej.'; main = better ? 'Lepiej: <b lang="en">' + esc(better) + '</b>' + xp : xp.replace(' · ', ''); }
      else if (fb.kind === 'bad') main = better ? 'Poprawiona wersja: <b lang="en">' + esc(better) + '</b>' : 'Przykładowe tłumaczenie jest wyżej.';
      else if (fb.kind === 'idk') { title = 'Tak można to powiedzieć:'; main = ''; }
      else main = xp.replace(' · ', '');
      if (fb.expl && fb.kind !== 'bad') smalls.push(ai(fb.expl));
      if (fb.kind === 'typo' && !fb.expl && fb.aiErr) smalls.push(esc(fb.aiErr) + ' Oceniam po podobieństwie do wzoru.');
      if (fb.m === 'ai-ok' || fb.kind === 'typo') smalls.push('Wzorcowo: ' + esc(fullSentence(it)));
    } else if (it.type === 'speak') {
      if (fb.kind === 'bad') main = fb.hasTarget ? 'Słowo było dobre, ale zdanie niepełne.' : 'Nie usłyszałem słowa <b>' + esc(it.w.answers[0]) + '</b>.';
      else if (fb.kind === 'typo') { main = esc(it.w.answers[0]) + xp; smalls.push('Słowo dobre, ale nie całe zdanie się zgadza — przekreślone usłyszałem inaczej, zaznaczonych brakuje. Powiedz jeszcze raz (M), aż się zgodzi.'); }
      else if (fb.kind !== 'idk') main = esc(it.w.answers[0]) + ' — ' + esc(it.w.pl) + xp;
      else main = esc(it.w.answers[0]) + ' — ' + esc(it.w.pl);
    }
    if (fb.kind === 'bad' && fb.expl && fb.m !== 'ai-ok') smalls.push(ai(fb.expl));
    if (fb.kind === 'bad' && !fb.expl && fb.aiErr) smalls.push(esc(fb.aiErr));
    if (fb.kind === 'bad' || fb.kind === 'idk') smalls.push('Wróci jeszcze w tej sesji.');
    if (fb.wsc && fb.wsc.bm) smalls.push('<span class="bk-msg">' + fb.wsc.bm + '</span>');
    if (fb.stepMsg && !it.stub) smalls.push('<span class="step-msg">' + esc(fb.stepMsg) + '</span>');
    if (fb.stubMsg) smalls.push('<span class="ub-msg">' + fb.stubMsg + '</span>');
    if (fb.kind === 'uns' && fb.isFirst) smalls.push('Wróci za 1–2 dni, żeby się utrwaliło.');
    if (fb.slow) smalls.push((fb.hinted ? 'Z podpowiedzią' : 'Długo to trwało') + ' — wróci trochę wcześniej.');
    if ((it.type === 'cloze' || it.type === 'translate' || it.type === 'tense_w' || it.type === 'tense_t') && fb.kind === 'typo') smalls.push('Liczę jako trafienie, ale wróci trochę wcześniej.');
    return '<div class="fb ' + cls + '" role="status">' + icon + '<span><b>' + title + '</b> ' + main + smalls.map(s => '<small>' + s + '</small>').join('') + '</span></div>';
  }
  function m(fb) { return fb.m; }

  /* „Trudne”: krótsze przerwy (o połowę); znacznik schodzi sam po 3 dobrych odpowiedziach w różne dni (bez podpowiedzi i „Zgaduję”) */
  function hardProgress(card, kind, correct, rescheduled) {
    if (rescheduled && card.due > Date.now() + U.DAY) card.due = Date.now() + Math.round((card.due - Date.now()) / 2);
    if (kind === 'ok' && !S.hint && !S.unsure) {
      const dk = U.dayKey(Date.now());
      if (card.hardDay !== dk) { card.hardOk = (card.hardOk || 0) + 1; card.hardDay = dk; }
      if (card.hardOk >= 3) { delete card.hard; delete card.hardOk; delete card.hardDay; setTimeout(() => toast('Zdjęto znacznik „trudne” — 3 razy dobrze w różne dni.'), 400); }
    } else if (!correct) { card.hardOk = 0; }
  }
  function toggleHard(c) {
    if (!S || S.phase !== 'feedback') return;
    let card = D().cards[c.id];
    if (card && card.hard) { delete card.hard; delete card.hardOk; delete card.hardDay; Store.save(); toast('Zdjęto znacznik „trudne”.'); renderExercise(); return; }
    if (!card) { playMiss(c.id); card = D().cards[c.id]; }
    else if (!S.play && S.first[c.id] === 3 && S.snap && S.snap[c.id]) {
      // było „Dobrze” — przeliczamy jak „Prawie”: wróci szybciej i nie awansuje
      const prev = S.snap[c.id].card;
      const nc = FSRS.review(prev && prev.state === 'review' ? prev : null, 2, { cap: 0 });
      nc.added = (prev && prev.added) || Date.now();
      if (prev) ['st', 'sk', 'ft', 'mastered'].forEach(k => { if (prev[k] != null) nc[k] = prev[k]; });
      D().cards[c.id] = card = nc; S.first[c.id] = 2;
      // cofamy też to, co dała odpowiedź „Dobrze”: kropkę dnia (skala słowa) i komunikat o trudności
      const sn = S.snap[c.id];
      if (sn.wk) {
        const ws = D().wsc = D().wsc || {};
        if (sn.wsc) ws[sn.wk] = Object.assign({}, sn.wsc, { day: U.dayKey() }); else ws[sn.wk] = { lv: 0, day: U.dayKey() };
        if (S.fb) S.fb.wsc = { lv: ws[sn.wk].lv, d: 0 };
      }
      S.stepUps = (S.stepUps || []).filter(x => x !== c.id); S.mastered = (S.mastered || []).filter(x => x !== c.id);
      S.stepMsg = '';
      if (S.fb) S.fb.stepMsg = 'Trudne — nie liczę tego jako pewnej odpowiedzi, wróci szybciej.';
    }
    card.hard = 1; card.hardOk = 0; delete card.hardDay;
    if (card.due > Date.now() + U.DAY) card.due = Date.now() + Math.round((card.due - Date.now()) / 2);
    if (!S.struggled.includes(c.id)) S.struggled.push(c.id);
    Store.save(); toast('Oznaczone jako trudne — będzie wracać częściej.'); renderExercise();
    const wid = hookWordId(curView(c)); if (wid && HOOK_TYPES[curView(c).type] && !hookGet(wid) && AI.enabled()) hookFetch(wid);
  }
  function hardIds() { const cc = D().cards; return Object.keys(cc).filter(id => cc[id].hard && itemFor(id) && typeEnabled(itemFor(id).type)); }
  function next() {
    if (!S) return;
    if (S.listening || S.reListening) { Recog.stop(); S.reListening = false; }
    ygTeardown();
    S.pos++;
    resetCardState();
    if (S.boss && Object.keys(S.bossHit).length >= S.bossMax) { S.bossWon = true; return finishSession(true); }
    if (S.finishing) { if (S.pos >= S.queue.length) return finishSession(true); return renderExercise(); }
    const quickEnd = S.quick && !S.play && !S.boss && !S.guide && S.activeSec - S.blockStart >= D().settings.blockMin * 60;
    if (limitDone() || quickEnd) return startFinishing() ? renderExercise() : finishSession(true);
    if ((S.guide || S.topicId) && S.pos >= S.guideMax) return finishSession(true); // krok nie ciągnie się w nieskończoność przy powtarzanych błędach
    if (S.play && !S.guide && !S.topicId && S.pos >= S.queue.length - 2) S.queue = S.queue.concat(buildPlayQueue(S.play, 12, S.queue.slice(-6).map(q => q.id)));
    if (S.pos >= S.queue.length) return finishSession(true);
    if (!S.play && !S.boss && !S.guide && S.activeSec - S.blockStart >= D().settings.blockMin * 60) {
      if (S.quick) return finishSession(true);
      return blockDone();
    }
    renderExercise();
  }

  /* po limicie: słowa źle wpisane w tej sesji, które jeszcze nie wróciły poprawnie — każde jeszcze raz, do 1 poprawnego */
  function startFinishing() {
    const ids = [];
    S.queue.slice(S.pos).forEach(q => { if (q.relearn && ids.indexOf(q.id) < 0 && itemFor(q.id)) ids.push(q.id); });
    if (!ids.length) return false;
    S.queue = S.queue.slice(0, S.pos).concat(ids.map(id => ({ id, isNew: false, relearn: true })));
    S.finishing = true; S.finN = ids.length;
    toast('Czas minął — jeszcze ' + ids.length + ' ' + (ids.length === 1 ? 'słowo' : ids.length < 5 ? 'słowa' : 'słów') + ' do poprawienia, każde raz.', 4000);
    return true;
  }
  function blockDone() {
    S.paused = true;
    S.blockSound = true;
    Sound.play('block');
    const t = Store.today(), goal = D().settings.goalMin;
    const mins = Math.floor(t.sec / 60);
    renderExercise();
    modal(
      '<h2>Blok ' + S.blockNo + ' ukończony</h2>' +
      '<p class="muted" style="margin:0;font-size:18px">' + (mins >= goal ? 'Cel dzienny zaliczony! ' : '') + 'Dzisiaj: ' + mins + ' z ' + goal + ' minut.</p>' +
      '<div class="row center"><button class="btn" id="mEnd" data-esc>Zakończ sesję ' + K('Esc') + '</button><button class="btn primary" id="mNext">Kolejny blok · ' + D().settings.blockMin + ' min ' + K('Enter') + '</button></div>',
      (ov, close) => {
        ov.querySelector('#mNext').onclick = () => { close(); S.blockSound = false; S.blockNo++; S.blockStart = S.activeSec; S.paused = false; renderExercise(); };
        ov.querySelector('#mEnd').onclick = () => { close(); finishSession(true); };
      });
  }

  /* „Umiem to” dotyczy całego słowa: wszystkich ćwiczeń z nim (zdanie, dyktando, mówienie, tłumaczenie, phrasal verbs) */
  const WORD_PREFIXES = ['', 'ord:', 'dic:', 'say:', 'tr:', 'pv:'];
  function knownFamily(id) {
    const it = itemFor(id);
    if (it && it.ts) return ['tnc:', 'tnw:', 'tnt:'].map(p => p + it.ts.id).filter(x => itemFor(x));
    if (it && it.w && !it.fromText && it.type !== 'error') {
      const wid = WORDS.byId[it.w.id] ? it.w.id : (WORDS.list.find(w => w === it.w) || {}).id;
      if (wid) return WORD_PREFIXES.map(p => p + wid).filter(x => itemFor(x));
    }
    return [id];
  }
  function isKnownWord(w) { const c = D().cards[w.id]; return !!c && c.state === 'known'; }
  function markKnown() {
    if (!S) return;
    const c = cur(), id = c.id;
    if (S.listening) Recog.stop();
    const prevCard = D().cards[id] ? Object.assign({}, D().cards[id]) : null;
    const hadFirst = id in S.first;
    const fam = knownFamily(id).filter(x => x !== id), prevFam = {};
    fam.forEach(x => { prevFam[x] = D().cards[x] ? Object.assign({}, D().cards[x]) : null; D().cards[x] = Object.assign({ reps: 0, lapses: 0, added: Date.now() }, D().cards[x] || {}, { state: 'known', knownAt: Date.now() }); });
    D().cards[id] = Object.assign({ reps: 0, lapses: 0, added: Date.now() }, prevCard || {}, { state: 'known', knownAt: Date.now() });
    const t = Store.today();
    if (!hadFirst) {
      S.first[id] = 'known';
      if (c.isNew) { if (c.newKind === 'extra') { t.newExtra = (t.newExtra || 0) + 1; S.newExtra++; } else { t.newCount++; S.newCount++; } }
    }
    if (S.boss) S.bossHit[id] = 1;
    (S.knownIds = S.knownIds || []).push(id);
    const removed = [];
    for (let i = S.queue.length - 1; i > S.pos; i--) if (S.queue[i].id === id || prevFam.hasOwnProperty(S.queue[i].id)) removed.push(S.queue.splice(i, 1)[0]);
    const wasStruggled = S.struggled.includes(id);
    S.struggled = S.struggled.filter(x => x !== id);
    progress(); Store.save();
    const sess = S;
    next();
    toast(itemShort(id) + ' — oznaczone jako znane' + (fam.length ? ' we wszystkich ćwiczeniach' : '') + ', nie będzie powtarzane.', {
      label: 'Cofnij', fn: () => {
        if (prevCard) D().cards[id] = prevCard; else delete D().cards[id];
        Object.keys(prevFam).forEach(x => { if (prevFam[x]) D().cards[x] = prevFam[x]; else delete D().cards[x]; });
        if (!hadFirst && sess) {
          delete sess.first[id];
          if (c.isNew) { if (c.newKind === 'extra') { t.newExtra = Math.max(0, (t.newExtra || 0) - 1); sess.newExtra--; } else { t.newCount = Math.max(0, t.newCount - 1); sess.newCount--; } }
        }
        if (wasStruggled && sess) sess.struggled.push(id);
        if (sess && sess.knownIds) sess.knownIds = sess.knownIds.filter(x => x !== id);
        Store.save();
        if (S === sess && screen === 'exercise') {
          S.queue.splice(S.pos + 1, 0, Object.assign({}, c, { relearn: false }));
          removed.forEach(q => S.queue.push(q));
          toast('Przywrócone — pojawi się jako następne.');
        } else if (screen === 'home') renderHome();
        else toast('Przywrócone do powtórek.');
      }
    });
  }

  function finishSession(completed) {
    if (!S) return go('home');
    if (S.listening) Recog.stop();
    S.paused = true;
    const t = Store.today();
    if (S.quick && completed && S.total > 0) t.quick = true;
    const promos = [];
    const lv = levels();
    if (lv.vocab < 4 && mastery(lv.vocab) >= 0.8) { lv.vocab++; promos.push('Słownictwo: poziom ' + L[lv.vocab] + ' — nowe słowa będą teraz z tego poziomu.'); }
    ['grammar', 'listening', 'speaking'].forEach(sk => {
      if (promoteReady(sk)) { lv[sk]++; hist()[sk] = []; promos.push(SKILL_NAME[sk] + ': poziom ' + L[lv[sk]] + '.'); }
    });
    if (promos.length) { progress(); recordLevels('promo'); }
    if (S.boss) {
      const wk = weekKey();
      D().boss = D().boss || {};
      const prevB = D().boss[wk] || {};
      D().boss[wk] = { won: !!(S.bossWon || prevB.won), at: Date.now(), clean: !!(S.bossWon && S.bossClean && S.total > 0) || !!prevB.clean, hits: Object.keys(S.bossHit).length, max: S.bossMax };
    }
    if (S.total > 0) { const h = new Date().getHours(); if (h < 8) D().earlySession = 1; if (h >= 23) D().lateSession = 1; }
    const newBadges = checkBadges();
    Store.save();
    const res = Object.assign({}, S, { promos, newBadges });
    S = null;
    if (res.topicId) { const T = (D().topics || {})[res.topicId]; if (T) { T.res = { total: res.total, correct: res.correct, xp: res.xp, at: Date.now() }; Store.save(); } if (res.total) Sound.play('block'); syncAfterSession(); return go('topic'); }
    if (res.guide) { if (completed && res.total) Sound.play('block'); guideStepDone({ total: res.total, correct: res.correct, xp: res.xp, promos }); syncAfterSession(); return; }
    if (res.total === 0 && res.raceHits == null && !res.boss) { if (res.textId) TXO.open = res.textId; return go(res.textId && (D().texts || {})[res.textId] ? 'texts' : res.play && res.play !== 'text' && res.play !== 'tense' ? 'play' : 'home'); }
    if (completed && !res.blockSound) Sound.play('block');
    go('result', res);
    { const nm = milesTick(); if (nm.length) setTimeout(() => milesShow(nm), 600); }
    syncAfterSession();
  }

  /* ================= WYNIK SESJI ================= */
  function renderResult(r) {
    const t = Store.today(), goal = D().settings.goalMin;
    const goalDone = t.sec >= goal * 60;
    const mins = Math.max(1, Math.round(r.activeSec / 60));
    const acc = r.total ? Math.round(r.correct / r.total * 100) : 0;
    const str = streak();
    const prevCards = {};
    const items = r.struggled.filter(id => itemFor(id) && D().cards[id] && D().cards[id].state !== 'known');

    const WORD_T = { cloze: 1, choice: 1, particle: 1, pvwrite: 1 };
    const known = (r.knownIds || []).filter((x, k, a) => a.indexOf(x) === k);
    const newWords = (r.queue || []).filter(q => q.isNew && q.newKind !== 'extra' && r.first && r.first[q.id] != null).map(q => q.id).filter((x, k, a) => a.indexOf(x) === k);
    const label = id => { const it = itemFor(id); if (!it) return esc(id); if (it.w && WORD_T[it.type]) return '<b lang="en">' + esc(it.w.answers[0]) + '</b> — ' + esc(it.w.pl); const f = fullSentence(it); return '<span lang="en">' + esc(f.length > 90 ? f.slice(0, 88) + '…' : f) + '</span>'; };
    const short = id => { const it = itemFor(id); return it && it.w && it.w.answers[0] ? it.w.answers[0] : itemShort(id); };
    let undoMode = false;
    const rowsHtml = () => items.map(id => {
      const it = itemFor(id), kn = D().cards[id] && D().cards[id].state === 'known';
      const wid = it && WORD_T[it.type] ? hookWordId(it) : null;
      return '<div class="rs-row"><span class="rs-tag">' + esc((TYPES[it.type] || {}).tag || '') + '</span><span class="rs-t">' + label(id) + '</span>' +
        (wid && (AI.enabled() || (hookGet(wid) && hookGet(wid).t)) ? '<button class="btn raised hk-btn rs-hk" data-hk-w="' + esc(wid) + '" title="Haczyk — jak zapamiętać" aria-label="Haczyk">' + LIGHTBULB + '</button>' : '<span></span>') +
        '<button class="btn small raised' + (kn ? ' done-state' : '') + '" data-id="' + esc(id) + '">' + (kn ? '✓ Umiem' : 'Umiem to') + '</button></div>';
    }).join('');
    const allKnown = () => known.concat(items.filter(id => D().cards[id] && D().cards[id].state === 'known' && known.indexOf(id) < 0));
    const newHtml = () => {
      const kn = allKnown(), up = (r.stepUps || []), ms = (r.mastered || []);
      if (!newWords.length && !kn.length && !up.length && !ms.length) return '';
      return '<section class="rs-sec"><h2>Dziś nowe</h2>' +
        (newWords.filter(id => kn.indexOf(id) < 0).length ? '<div class="rs-chips">' + newWords.filter(id => kn.indexOf(id) < 0).slice(0, 20).map(id => { const it = itemFor(id); return '<span class="rs-chip"><b lang="en">' + esc(it && it.w ? it.w.answers[0] : short(id)) + '</b>' + (it && it.w ? ' <small>' + esc(it.w.pl) + '</small>' : '') + '</span>'; }).join('') + '</div>' : '') +
        (kn.length ? '<div class="rs-lbl">Oznaczone „Umiem to” — nie będą powtarzane (' + kn.length + ') · <button class="lnk" id="rsUndo">' + (undoMode ? 'gotowe' : 'cofnij') + '</button>' + (undoMode ? ' <span>— kliknij słowo, które ma wrócić do nauki</span>' : '') + '</div><div class="rs-chips">' +
          kn.map(id => undoMode ? '<button class="rs-chip rs-undo" data-undo="' + esc(id) + '" lang="en">' + esc(short(id)) + ' ↺</button>' : '<span class="rs-chip" lang="en">' + esc(short(id)) + '</span>').join('') + '</div>' : '') +
        (up.length ? '<div class="rs-lbl">Następnym razem trudniej (' + up.length + ')</div><div class="rs-chips">' + up.slice(0, 12).map(id => '<span class="rs-chip" lang="en">' + esc(short(id)) + '</span>').join('') + '</div>' : '') +
        (ms.length ? '<div class="rs-lbl">Opanowane — wrócą za ok. 3 tygodnie (' + ms.length + ')</div><div class="rs-chips">' + ms.slice(0, 12).map(id => '<span class="rs-chip ok" lang="en">' + esc(short(id)) + ' ✓</span>').join('') + '</div>' : '') +
        '</section>';
    };
    const goalPct = Math.min(100, Math.round(t.sec / (goal * 60) * 100));
    const kpi = (v, l, cls) => '<div class="rs-k"><b' + (cls ? ' class="' + cls + '"' : '') + '>' + v + '</b><span>' + l + '</span></div>';
    const kpis = [kpi(mins, mins === 1 ? 'minuta' : 'minut'), kpi('+' + r.xp, 'XP', 'pink'), kpi(acc + '%', 'poprawnych'), kpi('×' + r.maxCombo, 'najdłuższe combo'),
      kpi(r.newCount + (r.newExtra ? ' + ' + r.newExtra : ''), r.newExtra ? 'nowe słowa + ćwiczenia' : 'nowe słowa')]
      .concat(allKnown().length ? [kpi(allKnown().length, '„Umiem to”')] : [])
      .concat(r.raceHits != null ? [kpi(r.raceHits, 'trafień w rozgrzewce')] : [])
      .concat([kpi(str + ' ' + (str === 1 ? 'dzień' : 'dni'), 'seria')]);

    app.innerHTML =
      '<div class="wrap narrow rs">' +
      '<header style="text-align:center"><h1 style="font-size:40px">' + (r.lim ? 'Runda zakończona' : 'Sesja zakończona') + '</h1>' +
      '<p class="muted" style="font-size:18px;margin:6px 0 0">' + (goalDone ? 'Świetna robota' + (D().profile.name ? ', ' + esc(D().profile.name) : '') + '. Cel dzienny zaliczony ✓' : 'Dobra robota. Do celu dziennego zostało ' + Math.max(1, Math.ceil((goal * 60 - t.sec) / 60)) + ' min.') + '</p></header>' +
      (r.boss ? (r.bossWon
        ? '<div class="fb ok" style="margin:0 auto">' + IC.star + '<span><b>Boss pokonany!</b> ' + (r.bossClean && r.total > 0 ? 'Bez ani jednego błędu. ' : '') + 'Wszystkie trudne elementy z tego tygodnia zaliczone · podwójne XP.</span></div>'
        : '<div class="fb info" style="margin:0 auto">' + IC.question + '<span><b>Boss jeszcze stoi.</b> Pokonane: ' + Object.keys(r.bossHit).length + ' z ' + r.bossMax + '. Możesz wrócić do walki w tym tygodniu.</span></div>') : '') +
      r.promos.map(p => '<div class="fb ok" style="margin:0 auto">' + IC.star + '<span><b>Awans!</b> ' + esc(p) + '</span></div>').join('') +
      (r.newBadges && r.newBadges.length ? '<section class="rs-sec" style="align-items:center;text-align:center"><h2>Nowa odznaka!</h2><div class="badges">' + r.newBadges.map(b => badgeHtml(b, true)).join('') + '</div></section>' : '') +
      '<section class="rs-sum"><div class="rs-kpis">' + kpis.join('<div class="rs-sep"></div>') + '</div>' +
      '<div class="rs-goal"><span>Cel dzienny <b>' + goal + ' min</b></span><div class="bar thin inset gbar"><div style="width:' + goalPct + '%"></div></div><span class="small-note">' + (goalDone ? '✓ zaliczony' : Math.floor(t.sec / 60) + ' z ' + goal + ' min') + '</span></div></section>' +
      (items.length ? '<section class="rs-sec rs-trouble"><h2>Z czym był kłopot <small>wróci wkrótce · jeśli już umiesz, oznacz</small></h2><div id="rows">' + rowsHtml() + '</div></section>' : '') +
      '<div id="rsNew">' + newHtml() + '</div>' +
      '<div class="row center small-note" id="syncLine">' + syncLineHtml() + '</div>' +
      (r.lim ? '<div class="row center" style="gap:20px"><button class="btn big" id="end">Wróć ' + K('Esc') + '</button><button class="btn big primary" id="more">Kolejna runda ' + K('Enter') + '</button></div>' : '<div class="row center" style="gap:20px"><button class="btn big" id="more">' + (r.tenseTids ? 'Jeszcze raz ' : r.textId ? 'Jeszcze raz z tekstu ' : r.play ? 'Zagraj jeszcze raz ' : 'Jeszcze jeden blok · ' + D().settings.blockMin + ' min ') + K('B') + '</button><button class="btn big primary" id="end">' + (r.tenseTids ? 'Wróć do czasów ' : r.textId ? 'Wróć do Moich tekstów ' : r.play ? 'Wróć ' : 'Zakończ na dziś ') + K('Enter') + '</button></div>') +
      nextIdeasLine() +
      '</div>';
    const bindNew = () => {
      const u = $('#rsUndo'); if (u) u.onclick = () => { undoMode = !undoMode; $('#rsNew').innerHTML = newHtml(); bindNew(); };
      $$('[data-undo]').forEach(b => b.onclick = () => {
        const id = b.dataset.undo;
        knownFamily(id).concat([id]).forEach(x => { const k = D().cards[x]; if (k && k.state === 'known') { k.state = 'review'; delete k.knownAt; k.due = U.addDays(U.startOfDay(), 1); } });
        const ki = known.indexOf(id); if (ki >= 0) known.splice(ki, 1);
        progress(); Store.save(); toast(short(id) + ' — wróci do nauki od jutra.');
        $('#rsNew').innerHTML = newHtml(); bindNew(); if ($('#rows')) { $('#rows').innerHTML = rowsHtml(); bindRows(); }
      });
    };
    const bindHooks = () => $$('[data-hk-w]').forEach(b => b.onclick = e => { e.stopPropagation(); hookToggle(b, b.dataset.hkW); });

    const bindRows = () => $$('#rows [data-id]').forEach(b => b.onclick = () => {
      const id = b.dataset.id, card = D().cards[id];
      const fam = knownFamily(id);
      if (card.state === 'known') { fam.forEach(x => { if (prevCards[x] === null) delete D().cards[x]; else if (prevCards[x]) D().cards[x] = prevCards[x]; }); }
      else fam.forEach(x => { prevCards[x] = D().cards[x] ? Object.assign({}, D().cards[x]) : null; D().cards[x] = Object.assign({ reps: 0, lapses: 0, added: Date.now() }, D().cards[x] || {}, { state: 'known', knownAt: Date.now() }); });
      progress(); Store.save();
      $('#rows').innerHTML = rowsHtml(); bindRows(); bindHooks();
      if ($('#rsNew')) { $('#rsNew').innerHTML = newHtml(); bindNew(); }
    });
    bindRows(); bindNew(); bindHooks();
    const rT = r.textId && (D().texts || {})[r.textId];
    const again = () => r.tenseTids ? startTenseSession(r.tenseTids, r.custom) : rT ? startTextSession(rT) : r.play ? startPlay(r.play) : startSession(false, (dueIds().length || newLeftToday() || newExtraLeftToday()) ? 0 : 5); // gdy plan na dziś zrobiony — blok z 5 dodatkowymi nowymi
    $('#more').onclick = again;
    $('#end').onclick = () => r.tenseTids ? go('tenses') : rT ? (TXO.open = r.textId, go('texts')) : go(r.play ? 'play' : 'home');
    bindSyncLine();
    if (r.newBadges && r.newBadges.length) setTimeout(() => Sound.play('combo'), 500);
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Enter' && document.activeElement === document.body) { e.preventDefault(); if (r.lim) again(); else $('#end').click(); return; }
      if (e.key === 'Escape' && r.lim) { e.preventDefault(); $('#end').click(); return; }
      if (plainKey(e, 'KeyB')) { e.preventDefault(); again(); return; }
      if (!e.altKey && !e.ctrlKey && /^[1-3]$/.test(e.key)) { const b = $$('[data-next]')[+e.key - 1]; if (b) { e.preventDefault(); b.click(); } }
    };
    $$('[data-next]').forEach(b => b.onclick = () => { S = null; goStale(b.dataset.next); });
  }

  /* ================= KOPIA NA DYSKU GOOGLE ================= */
  const syncState = { needsPerm: false, status: '', ok: true, busy: false };
  function fmtTime(ts) { return new Date(ts).toLocaleString('pl-PL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  function syncLineHtml() {
    if (!D().settings.syncFolder) return '';
    if (syncState.busy) return '<span>' + IC.cloud + ' Zapisuję na Dysku Google…</span>';
    if (syncState.status) return '<span class="status ' + (syncState.ok ? 'ok' : 'bad') + '">' + IC.cloud + ' ' + esc(syncState.status) + '</span>' + (syncState.ok ? '' : ' <button class="btn small" id="syncRetry">Zapisz teraz</button>');
    return '';
  }
  /* kropka stanu Dysku Google na stronie głównej: zielona = działa, czerwona = coś nie tak */
  /* AI: zielony = działa, czerwony = nie działa (brak klucza albo ostatnie zapytanie zwróciło błąd klucza/sieci) */
  function aiChipHtml() {
    const bad = AI.bad(), ok = AI.enabled() && !bad;
    const t = !AI.enabled() ? 'AI nie działa — brak klucza API. Kliknij, aby wpisać go w ustawieniach.' : bad ? 'AI nie działa — ' + bad.msg + ' (' + fmtTime(bad.at) + '). Kliknij, aby sprawdzić w ustawieniach.' : 'AI działa — ustawienia AI';
    return '<button class="sw ' + (ok ? 'on' : 'off') + '" id="aiChip" title="' + esc(t) + '"><span class="tr"></span>AI</button>';
  }
  window.addEventListener('ai-health', () => { if (window.onAiHealth && document.getElementById('aiChipBox')) window.onAiHealth(); });
  function syncChipHtml() {
    const dot = c => '<span style="width:9px;height:9px;border-radius:50%;background:' + c + '"></span> ';
    const st = D().settings;
    let ok = false, label, title;
    if (!Sync.supported) { label = 'Dysk — nieobsługiwany'; title = 'Ta przeglądarka nie zapisuje do folderu — użyj Chrome albo Edge.'; }
    else if (!st.syncFolder) { label = 'Dysk niepodłączony'; title = 'Kliknij, aby wybrać folder kopii na Dysku Google.'; }
    else if (syncState.needsPerm) { label = 'Połącz z Dyskiem'; title = 'Przeglądarka potrzebuje Twojej zgody na zapis w folderze kopii.'; }
    else if (syncState.busy) { ok = true; label = 'Dysk — zapisuję…'; title = ''; }
    else if (!syncState.ok) { label = 'Dysk — błąd'; title = syncState.status || 'Ostatni zapis się nie udał.'; }
    else { ok = true; label = 'Dysk Google'; title = 'Synchronizacja działa · folder: ' + st.syncFolder + (D().lastSync ? ' · ostatni zapis: ' + fmtTime(D().lastSync) : ''); }
    return '<button class="sw ' + (ok ? 'on' : 'off') + '" id="syncChip" title="' + esc(label + (title ? ' — ' + title : '')) + '"><span class="tr"></span>Dysk Google</button>';
  }
  function bindSyncChip() { const b = document.getElementById('syncChip'); if (b) b.onclick = () => syncState.needsPerm ? connectSync() : go('settings'); }
  function bindSyncLine() { const b = document.getElementById('syncRetry'); if (b) b.onclick = () => syncNow(true); }
  function refreshSyncUI() {
    const el = document.getElementById('syncLine'); if (el) { el.innerHTML = syncLineHtml(); bindSyncLine(); }
    const st = document.getElementById('syncStatus'); if (st) st.innerHTML = syncStatusHtml();
    const ch = document.getElementById('syncChipBox'); if (ch) { ch.innerHTML = syncChipHtml(); bindSyncChip(); }
  }
  async function syncNow(ask) {
    if (!Sync.supported) return false;
    const h = await Sync.handle(); if (!h) return false;
    syncState.busy = true; refreshSyncUI();
    try {
      const p = await Sync.perm(h, ask);
      if (p !== 'granted') { syncState.ok = false; syncState.status = 'Brak zgody na zapis w folderze kopii.'; syncState.needsPerm = true; return false; }
      await Sync.write(h);
      syncState.ok = true; syncState.needsPerm = false; syncState.status = 'Zapisano na Dysku Google · ' + fmtTime(Date.now());
      return true;
    } catch (e) {
      syncState.ok = false; syncState.status = 'Nie udało się zapisać kopii (' + (e && e.message ? e.message : 'błąd') + ').';
      return false;
    } finally { syncState.busy = false; refreshSyncUI(); }
  }
  function syncAfterSession() { if (D().settings.syncFolder) syncNow(true); }
  async function connectSync() {
    const h = await Sync.handle(); if (!h) return;
    try {
      const p = await Sync.perm(h, true);
      if (p !== 'granted') { toast('Bez zgody program nie zapisze kopii na Dysku.'); return; }
      syncState.needsPerm = false;
      const newer = await checkRemote(h, false);
      if (!newer) { await syncNow(false); toast('Połączono z Dyskiem Google.'); }
      if (screen === 'home') renderHome();
    } catch (e) { toast('Nie udało się połączyć z folderem kopii.'); }
  }
  /* czy na Dysku jest nowsza kopia (np. z innego komputera lub przeglądarki)? */
  async function checkRemote(h, always) {
    let remote;
    try { remote = await Sync.read(h); } catch (e) { if (always) toast('Nie udało się odczytać kopii z folderu „' + (h.name || '') + '” (' + (e && (e.name || e.message) || 'błąd') + '). Jeśli to Dysk Google, sprawdź, czy plik jest dostępny offline.', 9000); return false; }
    if (!remote || !remote.cards) { if (always) toast('W folderze „' + (h.name || '') + '” nie ma pliku angielski-postepy.json. Wybierz folder, w którym leży ten plik (ten sam, który był ustawiony w starej wersji).', 9000); return false; }
    const localEmpty = !D().profile.placementDone;
    const newer = (remote.progressAt || 0) > (D().progressAt || 0) + 2000;
    if (always || newer || (localEmpty && remote.profile && remote.profile.placementDone)) { offerRemote(remote); return true; }
    return false;
  }
  function offerRemote(remote) {
    const when = remote.savedAt ? new Date(remote.savedAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }) : 'nieznana data';
    const localWhen = D().progressAt ? new Date(D().progressAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }) : 'brak';
    modal('<h2>Postępy na Dysku Google</h2>' +
      '<p class="muted" style="margin:0;line-height:1.5">Kopia na Dysku: <b>' + esc(when) + '</b> (' + Object.keys(remote.cards).length + ' elementów w nauce).<br>W tej przeglądarce ostatnia nauka: <b>' + esc(localWhen) + '</b>.<br>Wczytać kopię z Dysku? Obecne dane w tej przeglądarce zostaną zastąpione.</p>' +
      '<div class="row center"><button class="btn" id="mNo" data-esc>Zostaw obecne ' + K('Esc') + '</button><button class="btn primary" id="mYes">Wczytaj z Dysku ' + K('Enter') + '</button></div>',
      (ov, close) => {
        ov.querySelector('#mNo').onclick = close;
        ov.querySelector('#mYes').onclick = () => {
          close();
          const key = D().settings.apiKey, folder = D().settings.syncFolder;
          delete remote.savedAt;
          Store.replace(remote);
          D().settings.apiKey = D().settings.apiKey || key;
          D().settings.syncFolder = folder || D().settings.syncFolder;
          Store.save();
          toast('Wczytano postępy z Dysku Google.');
          go(D().profile.placementDone ? 'home' : 'welcome');
        };
      });
  }
  async function pickSyncFolder(loadOnly) {
    if (!Sync.supported) { toast('Ta przeglądarka nie obsługuje zapisu do folderu — użyj Chrome albo Edge.'); return; }
    let h;
    try { h = await Sync.choose(); }
    catch (e) { if (e && e.name !== 'AbortError') toast('Nie udało się wybrać folderu: ' + e.message); return; }
    syncState.needsPerm = false;
    const offered = await checkRemote(h, !!loadOnly);
    if (!offered && !loadOnly) await syncNow(false);
    if (screen === 'settings') renderSettings();
  }
  async function syncStartup() {
    if (!Sync.supported || !D().settings.syncFolder) return;
    const h = await Sync.handle();
    if (!h) { D().settings.syncFolder = ''; Store.save(); return; }
    let p; try { p = await Sync.perm(h, false); } catch (e) { return; }
    if (p !== 'granted') { syncState.needsPerm = true; syncState.ok = false; if (screen === 'home') renderHome(); return; }
    const offered = await checkRemote(h, false);
    if (!offered) await syncNow(false); // przy starcie: próbny zapis — przełącznik pokaże, czy Dysk naprawdę działa
    refreshSyncUI();
  }
  function syncStatusHtml() {
    const d = D();
    if (!Sync.supported) return '<span class="status bad">Ta przeglądarka tego nie obsługuje — użyj Chrome albo Edge.</span>';
    if (!d.settings.syncFolder) return 'Folder: <b>nie wybrano</b>';
    return 'Folder: <b>' + esc(d.settings.syncFolder) + '</b> · ostatni zapis: <b>' + (d.lastSync ? fmtTime(d.lastSync) : 'jeszcze nie było') + '</b>' +
      (syncState.status && !syncState.ok ? '<br><span class="status bad">' + esc(syncState.status) + '</span>' : '') +
      (syncState.needsPerm ? '<br><span class="status bad">Przeglądarka potrzebuje Twojej zgody — kliknij „Zapisz teraz”.</span>' : '');
  }

  /* ================= USTAWIENIA ================= */
  function renderSettings(focus) {
    const d = D(), st = d.settings, games = st.games || {};
    const known = Object.keys(d.cards).filter(id => d.cards[id].state === 'known' && itemFor(id)).filter(id => { const f = knownFamily(id); return f[0] === id || !(d.cards[f[0]] && d.cards[f[0]].state === 'known'); });
    const knownWords = known.filter(id => baseWordId(id)).length, knownOther = known.filter(id => !baseWordId(id));
    const voiceOpts = Speech.voices.length
      ? Speech.voices.map(v => '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === st.voiceURI ? ' selected' : '') + '>' + esc(v.name + ' (' + v.lang + ')') + '</option>').join('')
      : '<option value="">Domyślny głos angielski</option>';
    const studied = Object.keys(d.cards).length;
    const gameRow = (key, label, note, disabled) =>
      '<label class="check"><input type="checkbox" data-game="' + key + '"' + (games[key] !== false && !disabled ? ' checked' : '') + (disabled ? ' disabled' : '') + '> ' + label + (note ? ' <span class="small-note">' + note + '</span>' : '') + '</label>';

    const SI = d0 => '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d0 + '</svg>';
    const SIC = {
      sound: SI('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'), ok: SI('<path d="M20 6L9 17l-5-5"/>'),
      folder: SI('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
      up: SI('<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8"/><path d="M12 12v8M9 15l3-3 3 3"/>'), down: SI('<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8"/><path d="M12 12v8M9 17l3 3 3-3"/>'),
      unlink: SI('<path d="M9 15l6-6"/><path d="M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1"/>'),
      save: SI('<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>'), load: SI('<path d="M12 20V9M7 14l5-5 5 5"/><path d="M5 4h14"/>'),
      list: SI('<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'), book: SI('<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/>'),
      target: SI('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'), trash: SI('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>'),
      speaker: SI('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>')
    };
    const cb = (id, on, label, extra) => '<label class="check s3-cb"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '> ' + label + '</label>' + (extra || '');
    const row = (lbl, ctl, forId) => '<div class="s3-r"><label' + (forId ? ' for="' + forId + '"' : '') + '>' + lbl + '</label>' + ctl + '</div>';
    const CHV = d => '<svg viewBox="0 0 12 8" width="11" height="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    /* pole liczbowe z własnymi strzałkami (bez systemowych prostokątnych przycisków) (upd247) */
    const numIn = (id, v, min, max) => '<span class="s3-numw"><input id="' + id + '" class="txt num s3-num" type="number" min="' + min + '" max="' + max + '" value="' + v + '"><span class="s3-spin"><button type="button" tabindex="-1" data-spin="' + id + ':1" aria-label="więcej">' + CHV('M2 6l4-4 4 4') + '</button><button type="button" tabindex="-1" data-spin="' + id + ':-1" aria-label="mniej">' + CHV('M2 2l4 4 4-4') + '</button></span></span>';
    const gameCb = (key, label, title, disabled) => '<label class="check s3-cb"' + (title ? ' title="' + esc(title) + '"' : '') + '><input type="checkbox" data-game="' + key + '"' + (games[key] !== false && !disabled ? ' checked' : '') + (disabled ? ' disabled' : '') + '> ' + label + '</label>';
    app.innerHTML =
      '<div class="wrap s3-wrap">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b>Ustawienia</b></div><div style="width:110px"></div></header>' +
      '<div class="s3-grid">' +

      '<section class="set-card s3"><h2>Nauka</h2>' +
      row('Imię', '<input id="name" class="txt s3-txt" value="' + esc(d.profile.name) + '">', 'name') +
      row('Nowe słowa dziennie', numIn('newPerDay', st.newPerDay, 0, 40), 'newPerDay') +
      row('Nowe ćwiczenia dziennie', numIn('newExtraPerDay', st.newExtraPerDay == null ? 6 : st.newExtraPerDay, 0, 30), 'newExtraPerDay') +
      row('Cel dzienny (min)', numIn('goalMin', st.goalMin, 5, 120), 'goalMin') +
      row('Długość bloku (min)', numIn('blockMin', st.blockMin, 2, 20), 'blockMin') +
      row('Długa odpowiedź po (s)', numIn('slowSec', st.slowSec, 5, 120), 'slowSec') +
      row('Poziom słownictwa', '<div class="lvl-pills s3-pills">' + L.map((l, i) => '<button class="btn pill small' + (levels().vocab === i ? ' pressed' : '') + '" data-lv="' + i + '">' + l + '</button>').join('') + '</div>') +
      '<p class="small-note desc" style="margin:0">Nowe ćwiczenia dziennie — oprócz nowych słów. Długa odpowiedź — dłuższe myślenie liczy się jak lekka niepewność. Test poziomu ustawi poziomy wszystkich umiejętności od nowa.</p>' +
      '<div class="s3-foot"><button class="btn small" id="retest">' + SIC.target + 'Test poziomu</button></div>' +
      '</section>' +

      '<section class="set-card s3"><h2>Lektor i dźwięk</h2>' +
      row('Głos', '<select id="voice" class="txt s3-sel">' + voiceOpts + '</select>', 'voice') +
      row('Tempo lektora', '<span class="s3-rng"><input id="rate" type="range" min="0.6" max="1.2" step="0.05" value="' + (st.rate || 0.95) + '" style="accent-color:#5A84BC"><span class="small-note" id="rateVal">' + rateLabel(st.rate || 0.95) + '</span></span>', 'rate') +
      row('Głośność dźwięków', '<span class="s3-rng"><input id="volume" type="range" min="5" max="100" step="5" value="' + (st.volume == null ? 50 : st.volume) + '" aria-label="Głośność dźwięków" style="accent-color:#5A84BC"></span>', 'volume') +
      row('Akcent w filmach (YouGlish)', '<div class="lvl-pills s3-pills">' + [['us', 'US'], ['uk', 'UK'], ['all', 'oba']].map(a => '<button class="btn pill small' + ((st.ygAccent || 'us') === a[0] ? ' pressed' : '') + '" data-acc="' + a[0] + '">' + a[1] + '</button>').join('') + '</div>') +
      '<div class="s3-cbs">' + cb('sounds', st.sounds !== false, 'Dźwięki włączone') + cb('speakAfter', !!st.speakAfter, 'Czytaj zdanie po odpowiedzi') + cb('autoOk', st.autoOk !== false, 'Zatwierdzaj automatycznie') + '</div>' +
      '<p class="small-note desc" style="margin:0" id="voiceNote">' + voiceNote() + '</p>' +
      '<p class="small-note desc" style="margin:0">' + (CAN_EMBED ? 'Filmy YouGlish odtwarzają się w programie.' : 'Program otwarty z pliku — filmy YouGlish otworzą się w nowej karcie. Żeby grały w programie, uruchamiaj go plikiem <b>Uruchom.bat</b>.') + '</p>' +
      '<div class="s3-foot"><button class="btn small" id="testVoice">' + SIC.speaker + 'Test głosu</button><button class="btn small" id="testSound">' + SIC.sound + 'Posłuchaj dźwięków</button></div>' +
      '</section>' +

      '<section class="set-card s3"><h2>Sztuczna inteligencja</h2>' +
      '<p class="small-note desc" style="margin:0">Z kluczem API program wyjaśnia błędy po polsku i uznaje poprawne odpowiedzi napisane inaczej niż wzorzec. Klucz założysz na <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>. Zostaje tylko w tej przeglądarce i nie trafia do kopii. Szybki model: sprawdzanie odpowiedzi, rozmowa, zdania do słówek. Model do wyjaśnień: Wyjaśnij, ocena tłumaczeń, plan „Krok po kroku”.</p>' +
      row('Klucz API', '<span class="s3-key"><input id="key" class="txt s3-txt" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="' + esc(st.apiKey) + '"><button class="btn small" id="showKey" aria-label="Pokaż klucz">' + IC.eye + '</button></span>', 'key') +
      row('Model szybki', '<input id="model" class="txt s3-txt" spellcheck="false" value="' + esc(st.model) + '">', 'model') +
      '<div class="s3-r" id="smartField"' + (st.smartOn === false ? ' hidden' : '') + '><label for="modelSmart">Do wyjaśnień</label><input id="modelSmart" class="txt s3-txt" spellcheck="false" value="' + esc(st.modelSmart == null ? 'claude-sonnet-5-5' : st.modelSmart) + '"></div>' +
      '<div class="s3-cbs">' + cb('smartOn', st.smartOn !== false, 'Lepszy model do wyjaśnień') + '</div>' +
      '<div class="small-note s3-mini">Bez klucza działa wszystko poza Tłumaczem z AI, Rozmową, Audycją i oceną zdań.</div>' +
      '<div class="s3-foot"><span class="status" id="aiStatus"></span><button class="btn small primary" id="testAi">' + SIC.ok + 'Sprawdź połączenie</button></div>' +
      '</section>' +

      '<section class="set-card s3"><h2>Ćwiczenia w sesjach</h2>' +
      '<div class="s3-games">' +
      gameCb('race', 'Rozgrzewka (' + raceSec() + ' s)', 'Na początek sesji — długość zmienisz w Graj') + gameCb('order', 'Ułóż zdanie') +
      gameCb('error', 'Znajdź błąd') + gameCb('dictation', 'Dyktando') +
      gameCb('speak', 'Powiedz to', Recog.supported() ? '' : 'Ta przeglądarka nie rozpoznaje mowy', !Recog.supported()) + gameCb('particle', 'Phrasal verbs') +
      gameCb('tenses', 'Czasy', 'Zdania z otwartych lekcji w codziennych sesjach') + gameCb('translate', 'Przetłumacz' + (AI.enabled() ? '' : ' · AI'), AI.enabled() ? '' : 'Wymaga klucza API', !AI.enabled()) +
      '</div></section>' +

      '<section class="set-card s3" id="syncCard"><h2>Kopie zapasowe</h2>' +
      '<p class="small-note desc" style="margin:0">Dysk Google: wskaż folder na Dysku Google na komputerze (np. <b>G:\\Mój dysk\\Angielski</b>). Po każdej sesji program zapisze tam postępy; w podfolderze „kopie” zostają kopie z 14 ostatnich dni. Kopia w pliku trafia do folderu Pobrane. Klucz API nie jest zapisywany w kopiach.</p>' +
      '<div class="small-note s3-sync" id="syncStatus">' + syncStatusHtml() + '</div>' +
      (Sync.supported ? '<div class="s3-btns"><button class="btn small primary" id="syncPick">' + SIC.folder + (st.syncFolder ? 'Zmień folder' : 'Wybierz folder') + '</button>' +
        (st.syncFolder ? '<button class="btn small" id="syncNow">' + SIC.up + 'Zapisz teraz</button><button class="btn small" id="syncLoad">' + SIC.down + 'Wczytaj z Dysku</button><button class="s3-link" id="syncOff">' + SIC.unlink + 'Odłącz</button>' : '') + '</div>' : '') +
      '<div class="s3-r"><label>Kopia w pliku</label><span class="small-note">' + (d.lastBackup ? new Date(d.lastBackup).toLocaleDateString('pl-PL') : 'jeszcze nie było') + '</span></div>' +
      '<div class="s3-foot"><button class="btn small" id="export">' + SIC.save + 'Zapisz plik</button><button class="btn small" id="import">' + SIC.load + 'Wczytaj plik</button><input type="file" id="file" accept=".json,application/json" hidden></div>' +
      '</section>' +

      '<section class="set-card s3"><h2>Inne</h2>' +
      '<div class="s3-r"><label>W nauce · w bazie</label><b>' + fmtNum(studied) + ' · ' + fmtNum(WORDS.list.length) + '</b></div>' +
      '<div class="s3-r"><label>XP · combo · rozgrzewka</label><b>' + fmtNum(d.xp) + ' · ×' + d.bestCombo + ' · ' + (d.raceBest || 0) + '</b></div>' +
      '<div class="s3-foot"><button class="btn small s3-danger" id="wipe">' + SIC.trash + 'Usuń dane</button>' + (knownOther.length ? '<button class="btn small" id="knownOther">' + SIC.list + 'Znane zdania (' + knownOther.length + ')</button>' : '') + '<button class="btn small" id="toBook" title="Znane słowa (' + knownWords + ') przywrócisz w Moim słowniku">' + SIC.book + 'Otwórz słownik</button></div>' +
      '</section>' +
      '</div></div>';

    const save = () => Store.save();
    const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    on('#back', () => go(d.profile.placementDone ? 'home' : 'welcome'));
    on('#syncPick', () => pickSyncFolder(false));
    on('#syncNow', async () => { const ok = await syncNow(true); toast(ok ? 'Zapisano na Dysku Google.' : 'Nie udało się zapisać — szczegóły w ustawieniach.'); });
    on('#syncLoad', async () => { const h = await Sync.handle(); if (!h) return; if (await Sync.perm(h, true) === 'granted') checkRemote(h, true); });
    on('#syncOff', async () => { await Sync.forget(); syncState.status = ''; syncState.needsPerm = false; renderSettings(); toast('Odłączono folder kopii. Pliki na Dysku zostały.'); });
    $('#key').oninput = e => { st.apiKey = e.target.value.trim(); save(); };
    on('#showKey', () => { const k = $('#key'); k.type = k.type === 'password' ? 'text' : 'password'; });
    $('#model').oninput = e => { st.model = e.target.value.trim() || 'claude-haiku-5-5'; save(); };
    $('#modelSmart').oninput = e => { st.modelSmart = e.target.value.trim(); save(); };
    $('#smartOn').onchange = e => { st.smartOn = e.target.checked; save(); $('#smartField').hidden = !e.target.checked; };
    on('#testAi', async () => {
      const s = $('#aiStatus');
      if (!AI.enabled()) { s.className = 'status bad'; s.textContent = 'Najpierw wklej klucz API.'; return; }
      s.className = 'status'; s.textContent = 'Sprawdzam…';
      try {
        await AI.test();
        if (st.smartOn === false) { s.className = 'status ok'; s.textContent = '✓ Połączenie działa (lepszy model wyłączony).'; return; }
        try { await AI.testSmart(); s.className = 'status ok'; s.textContent = '✓ Połączenie działa (oba modele).'; }
        catch (e2) { s.className = 'status bad'; s.textContent = 'Szybki model działa, model do wyjaśnień nie: ' + AI.humanError(e2); }
      }
      catch (e) { s.className = 'status bad'; s.textContent = AI.humanError(e); }
    });
    $$('[data-acc]').forEach(b => b.onclick = () => { st.ygAccent = b.dataset.acc; save(); renderSettings(); });
    $$('[data-game]').forEach(cb => cb.onchange = () => { st.games = Object.assign({}, st.games, { [cb.dataset.game]: cb.checked }); save(); });
    $('#name').oninput = e => { d.profile.name = e.target.value.trim(); save(); };
    const num = (id, key, min, max) => { $('#' + id).onchange = e => { let v = Math.round(+e.target.value); if (!isFinite(v)) v = st[key]; v = Math.min(max, Math.max(min, v)); st[key] = v; e.target.value = v; save(); }; };
    $$('[data-spin]').forEach(b => b.onclick = () => { const [id, d] = b.dataset.spin.split(':'), inp = $('#' + id); if (!inp) return; d > 0 ? inp.stepUp() : inp.stepDown(); inp.dispatchEvent(new Event('change')); });
    num('newPerDay', 'newPerDay', 0, 40); num('newExtraPerDay', 'newExtraPerDay', 0, 30); num('goalMin', 'goalMin', 5, 120); num('blockMin', 'blockMin', 2, 20); num('slowSec', 'slowSec', 5, 120);
    $('#voice').onchange = e => { st.voiceURI = e.target.value; save(); Speech.speak('Practice a little English every day.'); };
    on('#testVoice', () => Speech.speak('Practice a little English every day.'));
    $('#rate').oninput = e => { st.rate = +e.target.value; $('#rateVal').textContent = rateLabel(st.rate); };
    $('#rate').onchange = () => { save(); Speech.speak('Practice a little English every day.'); };
    $('#sounds').onchange = e => { st.sounds = e.target.checked; save(); if (st.sounds) Sound.play('ok'); };
    $('#volume').onchange = e => { st.volume = +e.target.value; save(); Sound.play('ok'); };
    on('#testSound', () => { ['ok', 'uns', 'bad', 'combo'].forEach((n, i) => setTimeout(() => Sound.play(n), i * 650)); });
    $('#speakAfter').onchange = e => { st.speakAfter = e.target.checked; save(); };
    $('#autoOk').onchange = e => { st.autoOk = e.target.checked; save(); };
    $$('[data-lv]').forEach(b => b.onclick = () => { const lv = levels(); lv.vocab = +b.dataset.lv; save(); renderSettings(); toast('Nowe słowa będą z poziomu ' + L[lv.vocab] + '.'); });
    on('#export', () => { exportBackup(); renderSettings(); });
    on('#import', () => $('#file').click());
    $('#file').onchange = e => { const f = e.target.files[0]; if (f) importBackup(f); };
    on('#knownOther', () => modal('<h2>Zdania i ćwiczenia oznaczone jako znane</h2><div class="known-list" style="max-height:60vh;overflow:auto">' + knownOther.map(id => '<div class="list-item inset"><div>' + itemLabel(id) + '</div><button class="btn small" data-restore="' + esc(id) + '">Przywróć do powtórek</button></div>').join('') + '</div><div class="row center"><button class="btn" id="mNo" data-esc>Zamknij</button></div>',
      (ov, close) => { ov.querySelector('#mNo').onclick = close; ov.querySelectorAll('[data-restore]').forEach(b => b.onclick = () => { close(); restoreKnown(b.dataset.restore); }); }));
    const restoreKnown = id => {
      knownFamily(id).concat([id]).forEach(x => { const c = d.cards[x]; if (!c || c.state !== 'known') return; if (!c.reps) delete d.cards[x]; else d.cards[x] = Object.assign({}, c, { state: 'review', due: Date.now() }); });
      progress(); save(); renderSettings(); toast(itemShort(id) + ' — wróci w najbliższej sesji.');
    };
    $$('[data-restore]').forEach(b => b.onclick = () => {
      const id = b.dataset.restore;
      knownFamily(id).concat([id]).forEach(x => {
        const c = d.cards[x]; if (!c || c.state !== 'known') return;
        if (!c.reps) delete d.cards[x];
        else d.cards[x] = Object.assign({}, c, { state: 'review', due: Date.now() });
      });
      progress(); save(); renderSettings(); toast(itemShort(id) + ' — wróci w najbliższej sesji.');
    });
    on('#retest', () => startTest());
    on('#toBook', () => { wTab = 'dict'; go('words'); });
    on('#wipe', () => {
      modal('<h2>Usunąć wszystkie dane?</h2><p class="muted" style="margin:0">Postępy, statystyki i ustawienia zostaną usunięte z tej przeglądarki. Kopie na Dysku Google zostaną — możesz je potem wczytać.</p>' +
        '<div class="row center"><button class="btn primary" id="mNo" data-esc>Anuluj</button><button class="btn" id="mYes" style="color:var(--bad-ink)">Usuń wszystko</button></div>',
        (ov, close) => {
          ov.querySelector('#mNo').onclick = close;
          ov.querySelector('#mYes').onclick = () => { close(); Store.reset(); go('welcome'); };
        });
    });
    if (focus === 'sync') { const el = $('#syncCard'); if (el) el.scrollIntoView({ block: 'start' }); }
    keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); $('#back').click(); } };
  }
  function voiceNote() {
    const n = Speech.voices.length;
    const natural = Speech.voices.some(v => /Natural|Google/i.test(v.name));
    if (!Speech.supported) return 'Ta przeglądarka nie ma lektora — użyj Chrome lub Edge.';
    if (natural) return 'Dostępne głosy: ' + n + '. Najlepiej brzmią te z „Natural” lub „Google” w nazwie.';
    return 'Dostępne głosy: ' + n + '. Więcej i ładniejszych głosów: otwórz program w <b>Microsoft Edge</b> (naturalne głosy, np. Aria, Jenny, Guy, Sonia) albo w Chrome przy włączonym internecie (głosy Google).';
  }
  function rateLabel(r) { return r < 0.85 ? 'wolno' : r > 1.05 ? 'szybko' : 'normalnie'; }
  Speech.onChange(() => {
    if (screen !== 'settings') return;
    const sel = document.getElementById('voice'); if (!sel) return;
    const uri = Store.data.settings.voiceURI;
    sel.innerHTML = Speech.voices.map(v => '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === uri ? ' selected' : '') + '>' + esc(v.name + ' (' + v.lang + ')') + '</option>').join('') || '<option value="">Domyślny głos angielski</option>';
    const note = document.getElementById('voiceNote'); if (note) note.innerHTML = voiceNote();
  });

  /* ---------- Kopia w pliku ---------- */
  function exportBackup() {
    D().lastBackup = Date.now(); Store.save();
    const copy = JSON.parse(JSON.stringify(D()));
    copy.settings.apiKey = '';
    copy.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(copy)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'angielski-kopia-' + U.dayKey() + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast('Kopia zapisana w folderze Pobrane.');
  }
  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let obj;
      try { obj = JSON.parse(reader.result); if (!obj.cards || !obj.settings) throw 0; }
      catch (e) { toast('To nie jest plik kopii tego programu.'); return; }
      const when = obj.exportedAt || obj.savedAt;
      modal('<h2>Wczytać kopię?</h2><p class="muted" style="margin:0">Kopia z dnia ' + esc(when ? new Date(when).toLocaleDateString('pl-PL') : 'nieznana data') + ' (' + Object.keys(obj.cards).length + ' elementów). Obecne postępy w tej przeglądarce zostaną zastąpione.</p>' +
        '<div class="row center"><button class="btn" id="mNo" data-esc>Anuluj</button><button class="btn primary" id="mYes">Wczytaj</button></div>',
        (ov, close) => {
          ov.querySelector('#mNo').onclick = close;
          ov.querySelector('#mYes').onclick = () => {
            close();
            const key = D().settings.apiKey, folder = D().settings.syncFolder;
            delete obj.exportedAt; delete obj.savedAt;
            Store.replace(obj);
            D().settings.apiKey = D().settings.apiKey || key;
            D().settings.syncFolder = folder;
            progress(); Store.save();
            toast('Kopia wczytana.');
            go(D().profile.placementDone ? 'home' : 'welcome');
          };
        });
    };
    reader.readAsText(file);
  }


  /* ================= ETAP 3 — wspólne ================= */
  const CAN_EMBED = location.protocol === 'http:' || location.protocol === 'https:';
  const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function fmtNum(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  /* ---------- Mapa słownictwa: postęp w całej bazie słów ---------- */
  const VM_COL = { known: '#8CC79A', mon: '#3F6597', week: '#5A84BC', learn: '#A2C0E2', mast: '#5A84BC' };
  function vocabMap() {
    const c = D().cards, lv = WORDS.list.filter(w => !w.custom), rows = L.map(() => ({ mast: 0, known: 0, learn: 0, unseen: 0, total: 0, week: 0, mon: 0 }));
    lv.forEach(w => {
      const r = rows[w.lvl], k = c[w.id], b = basketOf(w.id); r.total++;
      if (!k) r.unseen++;
      else if (k.state === 'known' || b >= 3) r.known++;
      else if (b === 2) { r.mast++; r.mon++; }
      else if (b === 1 || wordLv(w.id) >= 5) { r.mast++; r.week++; }
      else r.learn++;
    });
    const sum = f => rows.reduce((a, r) => a + r[f], 0);
    const tot = { mast: sum('mast'), known: sum('known'), learn: sum('learn'), unseen: sum('unseen'), total: lv.length };
    let n14 = 0; for (let i = 0; i < 14; i++) { const x = D().days[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (x) n14 += x.newCount || 0; }
    const pace = n14 / 14, cur = levels().vocab, cr = rows[cur];
    const eta = left => pace >= 0.3 ? U.addDays(U.startOfDay(), Math.ceil(left / pace)) : null;
    return { rows, tot, pace, cur, custom: WORDS.list.length - lv.length, etaAll: eta(tot.unseen), etaCur: eta(cr.unseen), curPct: cr.total ? Math.round((cr.mast + cr.known) / cr.total * 100) : 0 };
  }
  function vmBar(r, h) {
    const seg = (f, col) => r[f] ? '<div style="width:' + (r[f] / r.total * 100).toFixed(2) + '%;background:' + col + '" title="' + r[f] + '"></div>' : '';
    return '<div class="vm-bar inset"' + (h ? ' style="height:' + h + 'px"' : '') + '>' + seg('known', VM_COL.known) + (r.mon != null ? seg('mon', VM_COL.mon) + seg('week', VM_COL.week) : seg('mast', VM_COL.mast)) + seg('learn', VM_COL.learn) + '</div>';
  }
  const fmtMonth = t => new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/^\d+\s+/, '');
  function vocabMapHtml(view) {
    const v = vocabMap(), t = v.tot, knowN = t.mast + t.known;
    const legend = '<div class="legend"><span><i style="background:' + VM_COL.learn + '"></i>nauka</span><span><i style="background:' + VM_COL.week + '"></i>tydzień</span><span><i style="background:' + VM_COL.mon + '"></i>miesiąc</span><span><i style="background:' + VM_COL.known + '"></i>znam</span><span><i class="vm-empty"></i>jeszcze nie było</span></div>';
    const rows = v.rows.map((r, i) => '<div class="vm-row' + (i === v.cur ? ' cur' : '') + '"><b>' + L[i] + '</b>' + vmBar(r) + '<span class="small-note" title="znam ' + r.known + ' · miesiąc ' + r.mon + ' · tydzień ' + r.week + ' · nauka ' + r.learn + ' · z ' + r.total + '">znasz ' + Math.round(r.known / Math.max(1, r.total) * 100) + '% · w drodze ' + Math.round((r.mast + r.learn) / Math.max(1, r.total) * 100) + '%</span>' + (!view && sweepLeft(i) ? '<button class="btn small vm-sweep" data-sweep="' + i + '" title="Przesiej słowa ' + L[i] + ', które już znasz">Przegląd</button>' : view ? '' : '<span></span>') + '</div>').join('');
    const pvw = WORDS.list.filter(w => isPV(w) && !w.custom), pr = { mast: 0, known: 0, learn: 0, total: pvw.length }, cc = D().cards;
    pr.week = 0; pr.mon = 0;
    pvw.forEach(w => { const k = cc[w.id], b = basketOf(w.id); if (!k) return; if (k.state === 'known' || b >= 3) pr.known++; else if (b === 2) { pr.mast++; pr.mon++; } else if (b === 1 || wordLv(w.id) >= 5) { pr.mast++; pr.week++; } else pr.learn++; });
    const pvRow = pr.total ? '<div class="vm-row vm-pv"><b title="Phrasal verbs">PV</b>' + vmBar(pr) + '<span class="small-note"' + (pr.learn ? ' title="w nauce ' + pr.learn + '"' : '') + '>' + (pr.mast + pr.known) + ' / ' + pr.total + '</span>' +
      (view ? '' : '<span class="vm-btns"><button class="btn small vm-sweep" id="pvPlay" title="Gra: dobierz partykułę">Ćwicz</button>' + (sweepLeft('pv') ? '<button class="btn small vm-sweep" id="pvSweep" title="Przesiej phrasal verbs, które już znasz">Przegląd</button>' : '') + '</span>') + '</div>' : '';
    const eta = v.etaAll ? 'Przy obecnym tempie (ok. ' + (Math.round(v.pace * 10) / 10).toString().replace('.', ',') + ' nowych słów dziennie) poziom ' + L[v.cur] + ' przejdziesz do ok. ' + fmtMonth(v.etaCur) + ', całą bazę do ok. ' + fmtMonth(v.etaAll) + '.' : 'Szacunek końca pojawi się, gdy przez kilka dni będziesz uczyć się nowych słów.';
    return '<div class="row between"><h2>Mapa słownictwa</h2>' + legend + '</div>' +
      '<div class="vm-head"><div class="vm-big">' + fmtNum(knowN) + ' <span>z ' + fmtNum(t.total) + ' słów · ' + Math.round(knowN / t.total * 100) + '%</span></div>' +
      '<div class="small-note">Etap: <b>' + L[v.cur] + '</b> — ' + v.curPct + '% poziomu · nie było jeszcze ' + fmtNum(t.unseen) + ' słów' + (v.custom ? ' · do tego ' + v.custom + ' Twoich słów' : '') + '</div></div>' +
      '<div class="vm-rows">' + rows + (pvRow ? '<div class="vm-sep"></div>' + pvRow : '') + '</div><div class="small-note">' + eta + (view ? ' <a href="#" id="vmGo" style="white-space:nowrap;margin-left:8px">Przejrzyj słowa →</a>' : '') + '</div>';
  }
  function levelInfo(xp) {
    let level = 1, acc = 0, need = 100;
    while (xp >= acc + need) { acc += need; level++; need = 100 + (level - 1) * 50; }
    return { level, into: xp - acc, need };
  }
  /* ---------- Poziom gracza: droga 1→50, rangi co 10 poziomów, daty awansów ---------- */
  const PL_MAX = 50, PL_RANKS = ['Początkujący', 'Regularny', 'Wytrwały', 'Zaprawiony', 'Niezłomny', 'Maratończyk'];
  /* bramki rang: ranga 2+ wymaga poziomu angielskiego (średnia z 4 umiejętności): Wytrwały A2, Zaprawiony B1, Niezłomny B2, Maratończyk C1 */
  function engLevel() { const lv = levels(); return Math.floor(['vocab', 'grammar', 'listening', 'speaking'].reduce((a, k) => a + (lv[k] || 0), 0) / 4 + 1e-9); }
  function plCap() { const e = engLevel(); return e >= 4 ? Infinity : (e + 2) * 10 - 1; }
  function plPoz(n) { const d = n % 10, t = n % 100; return n + ' ' + (n === 1 ? 'poziom' : d >= 2 && d <= 4 && (t < 12 || t > 14) ? 'poziomy' : 'poziomów'); }
  function plLevel() { return Math.min(levelInfo(D().xp).level, plCap()); }
  /* XP za dobrą odpowiedź zależne od poziomu materiału: A1 10 … C1 18; materiał 2 poziomy poniżej Twojego — połowa, niżej — ćwierć */
  function xpBase(it) {
    const m = histMeta(it, { isNew: true }), lv = m.l;
    if (typeof lv !== 'number') return 10;
    const base = 10 + 2 * lv, gap = (levels()[TYPES[it.type].skill] || 0) - lv;
    return Math.round(base * (gap >= 3 ? 0.25 : gap === 2 ? 0.5 : 1));
  }
  const plRank = lv => PL_RANKS[Math.min(5, Math.floor(lv / 10))];
  function xpForLevel(lv) { let acc = 0; for (let l = 1; l < lv; l++) acc += 100 + (l - 1) * 50; return acc; }
  /* daty osiągnięcia poziomów: przy pierwszym uruchomieniu odtworzone z XP zapisanego w dniach nauki, potem zapisywane na bieżąco */
  function playerLevelDates() {
    const d = D(), cur = plLevel();
    let pl = d.plDates;
    if (!pl) {
      pl = {}; const keys = Object.keys(d.days).sort(); let sum = 0;
      const dayXp = keys.map(k => d.days[k].xp || 0), known = dayXp.reduce((a, b) => a + b, 0), extra = Math.max(0, d.xp - known); // XP sprzed zapisywania w dniach → pierwszy dzień
      keys.forEach((k, i) => { sum += dayXp[i] + (i === 0 ? extra : 0); const lv = levelInfo(sum).level; for (let l = 2; l <= lv; l++) if (!pl[l]) pl[l] = new Date(k + 'T12:00:00').getTime(); });
      if (keys.length) pl[1] = new Date(keys[0] + 'T12:00:00').getTime();
      d.plDates = pl;
    }
    for (let l = 2; l <= cur; l++) if (!pl[l]) pl[l] = Date.now();
    return pl;
  }
  function playerLevelHtml() {
    const li = levelInfo(D().xp), lv = plLevel(), gated = li.level > lv, pl = playerLevelDates();
    const fd = t => t ? new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: '2-digit' }) : '';
    /* kropki: jeden rząd na rangę (1–9, 10–19 … 40–49, 50); najechanie pokazuje datę */
    let dots = '';
    [[1, 9], [10, 19], [20, 29], [30, 39], [40, 49], [50, 50]].forEach((rg, i) => {
      let row = '';
      for (let l = rg[0]; l <= rg[1]; l++) {
        const got = l <= lv, tip = got ? 'Poziom ' + l + ' — ' + (pl[l] ? fd(pl[l]) : 'osiągnięty') : 'Poziom ' + l + ' — jeszcze przed Tobą';
        row += '<span class="pl-dot' + (got ? ' on' : '') + (l === lv ? ' me' : '') + '" data-tip="' + esc(tip) + '" tabindex="0" aria-label="' + esc(tip) + '"></span>';
      }
      dots += '<div class="pl-row' + (Math.min(5, Math.floor(lv / 10)) === i ? ' cur' : '') + '"><span class="pl-rn">' + PL_RANKS[i] + '</span><div class="pl-dots">' + row + '</div><small class="pl-rg">poz. ' + rg[0] + (rg[1] > rg[0] ? '–' + rg[1] : '') + '</small></div>';
    });
    const toMax = Math.max(0, xpForLevel(PL_MAX) - D().xp), ri = Math.min(5, Math.floor(lv / 10)), next = ri < 5 ? (ri + 1) * 10 : null;
    const hist = Object.keys(pl).map(Number).filter(l => l <= lv).sort((a, b) => b - a);
    return '<div class="pl-top"><b>' + lv + '</b><div><span class="pink">' + plRank(lv) + '</span><small>' + (pl[lv] ? 'poziom ' + lv + ' od ' + fd(pl[lv]) : '') + (next ? ' · ' + PL_RANKS[ri + 1] + ' od poziomu ' + next + (ri >= 1 && engLevel() < ri ? ' (wymaga ' + L[ri] + ')' : '') : lv >= PL_MAX ? ' · ' + PL_RANKS[5] + ' +' + (lv - PL_MAX) : '') + '</small></div></div>' +
      '<div class="pl-grid">' + dots + '</div>' +
      '<div class="pl-two"><div><span>Za Tobą</span><b>' + fmtNum(D().xp) + ' XP</b> <small>· ' + plPoz(Math.min(lv, PL_MAX)) + '</small></div>' +
      '<div><span>Przed Tobą do rangi ' + PL_RANKS[5] + '</span><b>' + (toMax ? '~' + fmtNum(Math.round(toMax / 100) * 100) + ' XP' : '✓ osiągnięty') + '</b>' + (toMax ? ' <small>· ' + plPoz(PL_MAX - lv) + '</small>' : '') + '</div></div>' +
      (gated ? '<div class="pl-gate">Do rangi <b>' + PL_RANKS[ri + 1] + '</b> potrzebny poziom angielskiego <b>' + L[ri] + '</b> (teraz ' + L[engLevel()] + ') — zrób test miesiąca. XP zbiera się dalej: czeka już ' + plPoz(li.level - lv) + '.</div>'
        : '<div class="pl-near"><span>do poziomu ' + (lv + 1) + '</span><div class="bar thin inset"><div style="width:' + Math.round(li.into / li.need * 100) + '%"></div></div><span>' + fmtNum(li.need - li.into) + ' XP</span></div>') +
'';
  }
  function mondayOf(t) { const d = new Date(U.startOfDay(t)); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
  function weekKey(t) { return U.dayKey(mondayOf(t == null ? Date.now() : t)); }
  function fmtHM(m) { return m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min'; }
  function fmtClock(m) { return m >= 60 ? Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0') : String(m); }
  /* pasek dookoła ikony: każdy dzień bez wejścia = 1/12 okręgu; 1–3 zielony, 4–6 żółty, 7–9 pomarańczowy, 10–12 czerwony (upd233) */
  const GAME_KEYS = ['race', 'cloze', 'order', 'error', 'dictation', 'speak', 'translate', 'particle', 'yg', 'pron'];
  function idleDays(keys) {
    let best = null; (Array.isArray(keys) ? keys : [keys]).forEach(k => { const d = daysSinceUse(k); if (d != null && (best == null || d < best)) best = d; });
    return best == null ? 12 : Math.min(12, best);
  }
  function idleArc(n, size) {
    const r = size / 2 - 2, C = 2 * Math.PI * r, col = n <= 3 ? '#6FAE7E' : n <= 6 ? '#E2C25A' : n <= 9 ? '#E0904A' : '#D96A8C', h = size / 2;
    return '<svg class="idle-arc" width="' + size + '" height="' + size + '" viewBox="' + (-h) + ' ' + (-h) + ' ' + size + ' ' + size + '" aria-hidden="true"><circle r="' + r + '" fill="none" stroke="rgba(120,110,100,.14)" stroke-width="3"/>' +
      (n ? '<circle r="' + r + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + (C * n / 12).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90)"/>' : '') + '</svg>';
  }
  const idleTxt = n => n === 0 ? 'dziś było' : n >= 12 ? '12 dni albo dłużej bez' : n === 1 ? 'wczoraj ostatnio' : n + ' dni bez';
  const NAV_IDLE = { texts: 'texts', play: GAME_KEYS, tenses: 'tense', words: 'words', talk: 'talk', listen: 'listen' };
  function navTile(nav, icon, title, sub, key, cls) {
    const ik = NAV_IDLE[nav], n = ik ? idleDays(ik) : null;
    return '<button class="btn nav-tile raised' + (cls ? ' ' + cls : '') + (ik ? ' has-idle' : '') + '" data-nav="' + nav + '" title="' + esc(sub + (ik ? ' · ' + idleTxt(n) : '')) + '"><span class="ic inset">' + icon + (ik ? idleArc(n, 64) : '') + '</span><span class="tx"><b>' + title + '</b><small>' + sub + '</small></span>' + K(key) + '</button>';
  }
  /* polska typografia: krótkie słowa (z, w, i, do…) nie zostają na końcu linii */
  function nbspPl(s) { return String(s).replace(/(^|[\s(])(z|w|i|a|o|u|do|na|po|we|ze|od|bez)\s+/gi, '$1$2\u00a0'); }
  function backHeader(title, sub) {
    return '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>' + title + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</div><div style="width:110px"></div></header>';
  }

  /* ---------- Własne słówka w bazie ---------- */
  function registerCustom() {
    const cust = D().custom || {};
    for (let i = WORDS.list.length - 1; i >= 0; i--) {
      const w = WORDS.list[i];
      if (w.custom && !cust[w.id]) { WORDS.list.splice(i, 1); delete WORDS.byId[w.id]; }
    }
    Object.keys(cust).forEach(id => {
      const c = cust[id];
      if (WORDS.byId[id]) return;
      const w = { id, answers: c.answers, pl: c.pl, s: c.s, lvl: c.lvl, custom: true, added: c.added, ai: !!c.ai, textId: c.textId };
      WORDS.byId[id] = w; WORDS.list.push(w);
    });
    applyFixes();
  }

  /* ---------- Odznaki ---------- */
  function maxStreak() { return Math.max(streakInfo().best, maxStreakRaw()); }
  function maxStreakRaw() {
    const ks = Object.keys(D().days).filter(k => isStudyDay(D().days[k])).sort();
    let best = 0, run = 0, prev = null;
    ks.forEach(k => {
      const t = new Date(k + 'T00:00:00').getTime();
      run = prev != null && U.dayKey(U.addDays(prev, 1)) === k ? run + 1 : 1;
      best = Math.max(best, run); prev = t;
    });
    return best;
  }
  function goalDays() { const g = D().settings.goalMin * 60; return Object.values(D().days).filter(d => d.sec >= g).length; }
  function wordsLearned() { const c = D().cards; return Object.keys(c).filter(id => id.indexOf(':') < 0 && ((c[id].reps || 0) >= 1 || c[id].state === 'known')).length; }
  const BADGES = [
    { id: 'first', name: 'Pierwszy krok', desc: 'Ukończ pierwszą sesję', test: () => Object.values(D().days).some(d => d.total > 0) },
    { id: 'streak3', name: 'Rozgrzany', desc: '3 dni nauki z rzędu', test: () => maxStreak() >= 3 },
    { id: 'streak7', name: 'Tydzień bez przerwy', desc: '7 dni nauki z rzędu', test: () => maxStreak() >= 7 },
    { id: 'streak30', name: 'Miesiąc nawyku', desc: '30 dni nauki z rzędu', test: () => maxStreak() >= 30 },
    { id: 'goal7', name: 'Systematyczny', desc: 'Cel dzienny zaliczony 7 razy', test: () => goalDays() >= 7 },
    { id: 'words50', name: '50 słów', desc: '50 słów w nauce', test: () => wordsLearned() >= 50 },
    { id: 'words100', name: '100 słów', desc: '100 słów w nauce', test: () => wordsLearned() >= 100 },
    { id: 'words250', name: '250 słów', desc: '250 słów w nauce', test: () => wordsLearned() >= 250 },
    { id: 'combo10', name: 'Seria 10', desc: 'Combo ×10', test: () => D().bestCombo >= 10 },
    { id: 'combo25', name: 'Seria 25', desc: 'Combo ×25', test: () => D().bestCombo >= 25 },
    { id: 'race15', name: 'Szybkie palce', desc: '15 trafień w wyścigu', test: () => (D().raceBest || 0) >= 15 },
    { id: 'race25', name: 'Błyskawica', desc: '25 trafień w wyścigu', test: () => (D().raceBest || 0) >= 25 },
    { id: 'boss1', name: 'Pogromca bossa', desc: 'Pokonaj bossa tygodnia', test: () => Object.values(D().boss || {}).some(b => b.won) },
    { id: 'bossClean', name: 'Czysta walka', desc: 'Pokonaj bossa bez błędu', test: () => Object.values(D().boss || {}).some(b => b.clean) },
    { id: 'allGames', name: 'Wszechstronny', desc: 'Zagraj we wszystkie gry', test: () => ['cloze', 'order', 'error', 'dictation', 'speak'].filter(t => t !== 'speak' || Recog.supported()).every(t => (D().typesPlayed || {})[t]) },
    { id: 'custom5', name: 'Własny słownik', desc: 'Dodaj 5 własnych słów', test: () => Object.keys(D().custom || {}).length >= 5 },
    { id: 'xp1000', name: '1 000 XP', desc: 'Zdobądź 1 000 XP', test: () => D().xp >= 1000 },
    { id: 'xp5000', name: '5 000 XP', desc: 'Zdobądź 5 000 XP', test: () => D().xp >= 5000 },
    { id: 'early', name: 'Ranny ptaszek', desc: 'Sesja przed 8:00', test: () => !!D().earlySession },
    { id: 'late', name: 'Nocny marek', desc: 'Sesja po 23:00', test: () => !!D().lateSession },
    { id: 'listen1', name: 'Uważny słuchacz', desc: 'Audycja bez żadnego błędu', test: () => (D().audio || []).some(x => x.score === x.n) },
    { id: 'listen10', name: 'Stały słuchacz', desc: '10 wysłuchanych audycji', test: () => (D().audio || []).length >= 10 },
    { id: 'monthTest', name: 'Sprawdzian', desc: 'Zrób test miesiąca', test: () => levelHist().some(e => e.kind === 'test') },
    { id: 'talk1', name: 'Pierwsza rozmowa', desc: 'Porozmawiaj z AI w scenkach', test: () => (D().convos || []).length >= 1 },
    { id: 'talkGoal5', name: 'Dogadam się', desc: 'Osiągnij cel w 5 scenkach', test: () => (D().convos || []).filter(c => c.goal).length >= 5 }
  ];
  function checkBadges() {
    const got = D().badges = D().badges || {}, now = Date.now(), fresh = [];
    BADGES.forEach(b => { if (!got[b.id]) { let ok = false; try { ok = b.test(); } catch (e) { } if (ok) { got[b.id] = now; fresh.push(b); } } });
    return fresh;
  }
  function badgeHtml(b, earned) {
    const at = (D().badges || {})[b.id];
    return '<div class="badge' + (earned ? ' on' : '') + '" title="' + esc(b.desc) + '"><span class="medal' + (earned ? ' raised' : ' inset') + '">' + IC.trophy + '</span>' +
      '<b>' + esc(b.name) + '</b><small>' + (earned && at ? new Date(at).toLocaleDateString('pl-PL') : esc(b.desc)) + '</small></div>';
  }

  /* ---------- Boss tygodnia ---------- */
  function bossPool() {
    const c = D().cards, now = Date.now(), cut = now - 21 * U.DAY;
    const recent = new Set((D().mistakes || []).filter(m => m.at > now - 14 * U.DAY).map(m => m.id));
    const ids = Object.keys(c).filter(id => {
      const x = c[id];
      if (x.state !== 'review') return false;
      const it = itemFor(id); if (!it || !typeEnabled(it.type)) return false;
      return !!x.hard || recent.has(id) || ((x.last || 0) > cut && ((x.lapses || 0) > 0 || (x.s || 0) < 4));
    });
    ids.sort((a, b) => ((!!c[b].hard) - (!!c[a].hard)) || (recent.has(b) - recent.has(a)) || ((c[a].s || 0) - (c[b].s || 0)));
    return ids.slice(0, 12);
  }
  function bossNoteHtml() {
    const b = (D().boss || {})[weekKey()];
    if (b && b.won) return '<section class="note raised locked bs-note"><div class="ic inset">' + IC.trophy + '</div><div class="tx"><b>Boss pokonany' + (b.clean ? ' — bez błędu!' : '') + '</b><span>kolejny w poniedziałek</span></div></section>'; // nieaktywny: sama ramka
    const pool = bossPool();
    if (pool.length < 6) return '<section class="note raised locked bs-note"><div class="ic inset">' + IC.lock + '</div><div class="tx" title="Pojawi się, gdy uzbiera się co najmniej 6 trudnych elementów z ostatnich tygodni."><b>Boss tygodnia</b><span>trudnych: ' + pool.length + ' z 6</span></div></section>';
    return '<section class="note bs-note bs-on" id="bossGo" role="button" tabindex="0" title="Najtrudniejsze elementy z ostatnich tygodni · podwójne XP"><div class="ic">' + IC.trophy + '</div><div class="tx"><b>Boss tygodnia</b><span>' + pool.length + ' trudnych · ×2 XP' + (b ? ' · ostatnio ' + b.hits + '/' + b.max : '') + '</span></div>' +
      '<span class="bs-go">Walcz ' + K('B') + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></section>';
  }
  function startBoss() {
    const pool = bossPool();
    if (pool.length < 6) { toast('Boss jeszcze się nie pojawił.'); return; }
    const groups = {};
    pool.forEach(id => { const tp = itemFor(id).type; (groups[tp] = groups[tp] || []).push({ id, isNew: false }); });
    newSession({ boss: true, queue: roundRobin(Object.values(groups)), bossMax: pool.length });
    go('exercise');
  }
  function bossBarHtml() {
    const left = S.bossMax - Object.keys(S.bossHit).length;
    return '<div class="boss-bar"><span class="small-note">Życie bossa</span><div class="bar thin inset" style="flex:1"><div style="width:' + (left / S.bossMax * 100) + '%;background:#B85674"></div></div><b>' + left + ' / ' + S.bossMax + '</b></div>';
  }

  /* ---------- Graj ---------- */
  /* limit rundy w grach: co nastąpi pierwsze — czas albo liczba pytań */
  function playLimits() { const st = D().settings; return { min: st.playMin == null ? 10 : st.playMin, q: st.playQ == null ? 25 : st.playQ }; }
  function limitDone() { const l = S && S.lim; return !!l && ((l.q && S.total >= l.q) || (l.min && S.activeSec >= l.min * 60)); }
  function limPct() { const l = S.lim; return Math.min(100, Math.max(l.q ? S.total / l.q : 0, l.min ? S.activeSec / (l.min * 60) : 0) * 100); }
  function limText() { const l = S.lim; return [l.q ? S.total + '/' + l.q + ' pytań' : '', l.min ? 'max ' + l.min + ' min' : ''].filter(Boolean).join(' · '); }
  function limTimer() { return S.lim && S.lim.min ? U.mmss(Math.max(0, S.lim.min * 60 - S.activeSec)) : U.mmss(S.activeSec); }
  const PLAY_GAMES = [
    { id: 'race', title: 'Wyścig z czasem', desc: 'jak najwięcej słów — czas stoi, gdy piszesz' },
    { id: 'cloze', title: 'Słowo do zdania', desc: 'wpisz brakujące słowo' },
    { id: 'order', title: 'Ułóż zdanie', desc: 'kafelki w dobrej kolejności' },
    { id: 'error', title: 'Znajdź błąd', desc: 'wskaż i popraw błąd' },
    { id: 'dictation', title: 'Dyktando', desc: 'posłuchaj i zapisz' },
    { id: 'speak', title: 'Powiedz to', desc: 'mów do mikrofonu' },
    { id: 'translate', title: 'Przetłumacz', desc: 'z polskiego na angielski' },
    { id: 'particle', title: 'Dobierz partykułę', desc: 'phrasal verbs: up, out, off…' },
    { id: 'yg', title: 'Usłysz w filmie', desc: 'prawdziwe nagrania z YouTube' },
    { id: 'pron', title: 'Wymowa', desc: 'pary dźwięków: tram – Trump, ship – sheep' }
  ];
  function gameNote(id) {
    if (id === 'speak' && !Recog.supported()) return 'ta przeglądarka nie rozpoznaje mowy';
    if (id === 'yg' && !CAN_EMBED) return 'uruchom program przez Uruchom.bat';
    if (id === 'translate' && !AI.enabled()) return 'wymaga klucza API w ustawieniach';
    return '';
  }
  function learnedWords() {
    const c = D().cards;
    let ws = WORDS.list.filter(w => c[w.id] && c[w.id].state !== 'known' && (c[w.id].reps || 0) >= 1 && wordLv(w.id) < 5);
    if (ws.length < 8) { const lv = levels().vocab; ws = ws.concat(WORDS.list.filter(w => w.lvl === lv && !c[w.id] && ws.indexOf(w) < 0)); }
    return ws;
  }
  const GAME_IC = (function () { const sv = d => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; return {
    race: sv('<path d="M12 8v5l3 2"/><circle cx="12" cy="13" r="8"/><path d="M9 2h6"/>'), cloze: sv('<rect x="3" y="9" width="18" height="6" rx="2"/><path d="M8 12h3"/>'),
    order: sv('<rect x="3" y="4" width="8" height="6" rx="1.5"/><rect x="13" y="4" width="8" height="6" rx="1.5"/><rect x="7" y="14" width="10" height="6" rx="1.5"/>'), error: sv('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>'),
    dictation: sv('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'), speak: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    translate: sv('<path d="M4 5h8M8 3v2M6 5c0 4 3 7 6 8M10 5c0 3-2 6-6 8"/><path d="M13 21l4-9 4 9M14.5 18h5"/>'), particle: sv('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    yg: sv('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>'), pron: sv('<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2"/>') }; })();
  function renderPlayMenu() {
    S = null;
    /* „polecane” = dwie gry najrzadziej używane w ostatnich 14 dniach */
    const recG = PLAY_GAMES.filter(g => !gameNote(g.id) && (g.id === 'race' || g.id === 'yg' || g.id === 'pron' || typeEnabled(g.id)))
      .map(g => ({ id: g.id, u: usage(g.id) })).sort((a, b) => a.u - b.u || PLAY_GAMES.findIndex(x => x.id === b.id) - PLAY_GAMES.findIndex(x => x.id === a.id)).slice(0, 2).map(x => x.id);
    app.innerHTML =
      '<div class="wrap narrow pm-wide">' + backHeader('Graj', 'Dobre odpowiedzi nie przesuwają powtórek, błędy wrócą w najbliższej sesji.') +
      (function () {
        const lm = playLimits(), pill = (kind, v, lab) => '<button class="btn pill small' + (lm[kind] === v ? ' pressed' : '') + '" data-lim="' + kind + ':' + v + '">' + lab + '</button>';
        return '<section class="set-card raised limits"><div class="row between"><h2 style="font-size:19px">Limit rundy <span class="small-note">— kończy się to, co nastąpi pierwsze</span></h2><span class="small-note">' + K('L') + ' wł./wył.</span></div>' +
          '<div class="row" style="gap:22px"><div class="row" style="gap:8px"><span class="small-note">Czas:</span>' + [5, 10, 15].map(v => pill('min', v, v + ' min')).join('') + pill('min', 0, 'bez') + '</div>' +
          '<div class="row" style="gap:8px"><span class="small-note">Pytania:</span>' + [15, 25, 40].map(v => pill('q', v, String(v))).join('') + pill('q', 0, 'bez') + '</div>' +
          '<div class="row" style="gap:8px"><span class="small-note">Wyścig:</span>' + [60, 90, 120].map(v => '<button class="btn pill small' + (raceSec() === v ? ' pressed' : '') + '" data-race="' + v + '">' + v + ' s</button>').join('') + '</div></div>' +
          '<div class="small-note">' + (lm.min || lm.q ? 'Runda: ' + [lm.min ? lm.min + ' min' : '', lm.q ? lm.q + ' pytań' : ''].filter(Boolean).join(' albo ') + '. Potem możesz od razu zacząć kolejną.' : 'Bez limitu — grasz, ile chcesz.') + ' Wyścig nie ma limitu rundy. Czas liczy się tylko, gdy myślisz — gdy piszesz, zegar stoi.</div></section>';
      })() +
      '<section class="games">' + PLAY_GAMES.map((g, i) => {
        const note = gameNote(g.id);
        const n = note ? null : idleDays(g.id), tip = (note || g.desc) + (g.id === 'race' ? ' · ' + raceSec() + ' s' + (raceBestFor(raceSec()) ? ' · rekord: ' + raceBestFor(raceSec()) : '') : '') + (n != null ? ' · ' + idleTxt(n) : '');
        return '<button class="btn game raised g2' + (note ? ' off' : '') + '" data-game-go="' + g.id + '" title="' + esc(tip) + '"' + (note ? ' aria-disabled="true"' : '') + '>' +
          '<span class="gi">' + GAME_IC[g.id] + (n != null ? idleArc(n, 48) : '') + '</span><b>' + nbspPl(g.title) + '</b>' + (g.id === 'pron' && pronMine().length ? '<span class="rec-tag pr-tag">' + pronMine().length + ' ' + (pronMine().length === 1 ? 'twoja para' : pronMine().length < 5 ? 'twoje pary' : 'twoich par') + '</span>' : '') +
          '<span class="kbd gk">' + ((i + 1) % 10) + '</span></button>';
      }).join('') + '</section>' +
      '<p class="small-note" style="text-align:center">Wybierz klawiszem ' + K('1') + '–' + K('0') + ' albo kliknij. XP, combo i minuty liczą się normalnie.</p>' +
      (function () { const n = sweepLeft(0); return n ? '<section class="note raised"><div class="tx"><b>Przegląd A1</b><span>szybko przejrzyj łatwe słowa — znane oznaczysz, nieznane pójdą do nauki · zostało ' + n + ' z ' + WORDS.list.filter(w => w.lvl === 0 && !w.custom).length + '</span></div><button class="btn primary" id="sweepGo">Przeglądaj ' + K('P') + '</button></section>' : ''; })() +
      '</div>';
    $('#back').onclick = () => go('home');
    $$('[data-game-go]').forEach(b => b.onclick = () => startPlay(b.dataset.gameGo));
    if ($('#sweepGo')) $('#sweepGo').onclick = () => startSweep(0, 'play');
    const st = D().settings;
    $$('[data-race]').forEach(b => b.onclick = () => { st.raceSec = +b.dataset.race; Store.save(); renderPlayMenu(); });
    $$('[data-lim]').forEach(b => b.onclick = () => { const [k, v] = b.dataset.lim.split(':'); st[k === 'min' ? 'playMin' : 'playQ'] = +v; Store.save(); renderPlayMenu(); });
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('home'); return; }
      if (plainKey(e, 'KeyL')) {
        e.preventDefault();
        const lm = playLimits();
        if (lm.min || lm.q) { st.playLimPrev = lm; st.playMin = 0; st.playQ = 0; } else { const pv = st.playLimPrev || { min: 10, q: 25 }; st.playMin = pv.min; st.playQ = pv.q; }
        Store.save(); renderPlayMenu(); toast(st.playMin || st.playQ ? 'Limit rundy włączony.' : 'Bez limitu.'); return;
      }
      if (plainKey(e, 'KeyP') && $('#sweepGo')) { e.preventDefault(); startSweep(0, 'play'); return; }
      if (!e.altKey && !e.ctrlKey && /^[0-9]$/.test(e.key)) { e.preventDefault(); const g = PLAY_GAMES[(+e.key + 9) % 10]; if (g) startPlay(g.id); }
    };
  }
  /* ================= WYMOWA: pary dźwięków (upd214) =================
     Krok 1 — ucho: lektor mówi jedno słowo z pary, wybierasz które. Krok 2 — usta: mówisz słowo, rozpoznawanie sprawdza, czy usłyszało je, a nie parę.
     Pary: zestawy dźwięków trudnych dla Polaków + Twoje pary zebrane z „Powiedz to” (gdy rozpoznawanie usłyszy podobne słowo zamiast szukanego). */
  const PRON_SETS = [
    { id: 'ae', name: '/æ/ – /ʌ/', ex: 'cat – cut', sa: '/æ/', sb: '/ʌ/', ta: 'szerokie /æ/ jak w cat: opuść szczękę i rozciągnij usta na boki, prawie „e”', tb: 'krótkie, luźne /ʌ/ jak w cut — zwykłe polskie „a”',
      pairs: [['cat', 'cut', 'kot', 'ciąć'], ['bad', 'bud', 'zły', 'pąk'], ['cap', 'cup', 'czapka', 'filiżanka'], ['ran', 'run', 'biegł', 'biegać'], ['hat', 'hut', 'kapelusz', 'chata'], ['match', 'much', 'mecz', 'dużo'], ['bag', 'bug', 'torba', 'robak'], ['tram', 'Trump', 'tramwaj', 'nazwisko']] },
    { id: 'aee', name: '/æ/ – /e/', ex: 'bad – bed', sa: '/æ/', sb: '/e/', ta: 'szerokie /æ/: szczęka nisko, usta rozciągnięte — dłuższe i bardziej otwarte niż „e”', tb: 'zwykłe, krótkie polskie „e”',
      pairs: [['bad', 'bed', 'zły', 'łóżko'], ['man', 'men', 'mężczyzna', 'mężczyźni'], ['sad', 'said', 'smutny', 'powiedział'], ['pan', 'pen', 'patelnia', 'długopis'], ['bat', 'bet', 'nietoperz', 'zakład'], ['land', 'lend', 'ląd', 'pożyczać']] },
    { id: 'ii', name: '/iː/ – /ɪ/', ex: 'sheep – ship', sa: '/iː/', sb: '/ɪ/', ta: 'długie, napięte /iː/ — uśmiechnij się i przeciągnij „ii”', tb: 'krótkie, luźne /ɪ/ — bliżej polskiego „y”',
      pairs: [['sheep', 'ship', 'owca', 'statek'], ['leave', 'live', 'wyjeżdżać', 'mieszkać'], ['feel', 'fill', 'czuć', 'wypełnić'], ['eat', 'it', 'jeść', 'to'], ['seat', 'sit', 'miejsce', 'siedzieć'], ['heat', 'hit', 'upał', 'uderzyć'], ['sleep', 'slip', 'spać', 'poślizgnąć się']] },
    { id: 'th', name: 'th', ex: 'think – sink', sa: '/θ/', sb: 's / f / t', ta: '/θ/ — czubek języka lekko między zębami i dmuchnij', tb: 'bez języka między zębami',
      pairs: [['think', 'sink', 'myśleć', 'tonąć'], ['three', 'free', 'trzy', 'wolny'], ['thank', 'tank', 'dziękować', 'czołg'], ['mouth', 'mouse', 'usta', 'mysz'], ['thick', 'sick', 'gruby', 'chory'], ['path', 'pass', 'ścieżka', 'podać']] },
    { id: 'wv', name: '/w/ – /v/', ex: 'west – vest', sa: '/w/', sb: '/v/', ta: '/w/ — usta w dzióbek jak do „ł”, zęby nie dotykają warg', tb: '/v/ — górne zęby na dolnej wardze, jak polskie „w”',
      pairs: [['west', 'vest', 'zachód', 'kamizelka'], ['wine', 'vine', 'wino', 'winorośl'], ['wet', 'vet', 'mokry', 'weterynarz'], ['wary', 'very', 'ostrożny', 'bardzo'], ['worse', 'verse', 'gorzej', 'wers']] },
    { id: 'end', name: 'końcówki', ex: 'bad – bat', sa: 'dźwięczna', sb: 'bezdźwięczna', ta: 'dźwięczna końcówka — nie ubezdźwięczniaj jej, samogłoska przed nią jest dłuższa', tb: 'bezdźwięczna końcówka — krótko i ostro',
      pairs: [['bad', 'bat', 'zły', 'nietoperz'], ['dog', 'dock', 'pies', 'dok'], ['bag', 'back', 'torba', 'plecy'], ['feed', 'feet', 'karmić', 'stopy'], ['prize', 'price', 'nagroda', 'cena'], ['eyes', 'ice', 'oczy', 'lód']] },
    { id: 'er', name: '/ɜː/ – /ɔː/', ex: 'work – walk', sa: '/ɜː/', sb: '/ɔː/', ta: '/ɜː/ — jak niemieckie ö, usta nie zaokrąglone, bez „r” na końcu', tb: '/ɔː/ — długie, zaokrąglone „o”',
      pairs: [['work', 'walk', 'pracować', 'spacerować'], ['shirt', 'short', 'koszula', 'krótki'], ['bird', 'board', 'ptak', 'deska'], ['firm', 'form', 'firma', 'formularz'], ['word', 'ward', 'słowo', 'oddział']] },
    { id: 'ng', name: '/ŋ/ – /ŋk/', ex: 'sing – sink', sa: '/ŋ/', sb: '/ŋk/', ta: '/ŋ/ — nosowe „ng”, bez „g” ani „k” na końcu', tb: '/ŋk/ — wyraźne „k” na końcu',
      pairs: [['sing', 'sink', 'śpiewać', 'zlew'], ['thing', 'think', 'rzecz', 'myśleć'], ['wing', 'wink', 'skrzydło', 'mrugać'], ['bang', 'bank', 'huk', 'bank']] }
  ];
  /* omówienie różnicy — jak wymówić każdy dźwięk i typowy błąd Polaka */
  const PRON_HOW = {
    ae: { a: 'Szczęka nisko jak u dentysty, usta rozciągnięte na boki, język płasko przy dolnych zębach. Brzmi pomiędzy polskim „a” i „e”.', b: 'Krótkie, luźne, ze środka ust — bardzo bliskie polskiemu „a”. Tu polski odruch jest dobry.', pl: 'Polacy mówią oba jak polskie „a”, więc <i>cat</i> brzmi jak <i>cut</i>, a <i>tram</i> jak <i>Trump</i>. Ćwiczenie: powiedz „e”, a potem opuść szczękę, nie ruszając językiem — to jest /æ/.' },
    aee: { a: 'Szczęka wyraźnie nisko, usta rozciągnięte — szerzej i dłużej niż polskie „e”.', b: 'Zwykłe, krótkie polskie „e”, szczęka wyżej.', pl: 'Gdy /æ/ jest za mało otwarte, <i>man</i> brzmi jak <i>men</i>. Różnicę robi szczęka: przy /æ/ opuść ją, jakbyś ziewał.' },
    ii: { a: 'Długie i napięte. Usta w uśmiechu, język wysoko — jak polskie „i”, ale wyraźnie dłuższe: „szii-p”.', b: 'Krótkie i luźne, między polskim „i” a „y”. Usta rozluźnione, bez uśmiechu: „szyp”.', pl: 'Polacy mówią oba jak krótkie „i”, więc <i>leave</i> i <i>live</i> brzmią tak samo. Klucz to długość i napięcie, nie barwa.' },
    th: { a: 'Czubek języka lekko wysunięty między zęby, dmuchasz powietrze — bez nacisku, język tylko dotyka zębów.', b: 'Język schowany za zębami (s, t) albo górne zęby na wardze (f).', pl: 'Polacy zastępują th przez „s”, „f” albo „t” — <i>think</i> brzmi jak <i>sink</i> albo <i>fink</i>. Sprawdź w lustrze: przy th widać czubek języka.' },
    wv: { a: 'Usta zaokrąglone w dzióbek jak do „u”, zęby nie dotykają warg — jak polskie „ł” w „łoś”.', b: 'Górne zęby lekko na dolnej wardze — jak polskie „w”.', pl: 'Polacy czytają literę <i>w</i> jak polskie „w”, więc <i>west</i> brzmi jak <i>vest</i>. Zapamiętaj: angielskie <i>w</i> = polskie „ł”.' },
    end: { a: 'Końcowe d, g, z, v z głosem (gardło wibruje), a samogłoska przed nimi wyraźnie dłuższa: „baaad”.', b: 'Końcowe t, k, s, f — krótko i ostro, samogłoska krótka: „bat”.', pl: 'Po polsku końcówki się ubezdźwięczniają („chleb” = „chlep”), więc <i>bad</i> brzmi jak <i>bat</i>. Najłatwiej: przeciągnij samogłoskę przed dźwięczną końcówką.' },
    er: { a: 'Usta rozluźnione, NIE zaokrąglone, język w środku — jak niemieckie „ö”. W brytyjskiej wymowie bez „r”.', b: 'Długie „o”, usta zaokrąglone w kółko.', pl: 'Polacy czytają <i>work</i> jak „łork”, więc brzmi jak <i>walk</i>. W <i>work</i> nie ma „o” — usta zostają płaskie.' },
    ng: { a: 'Tył języka przy podniebieniu, dźwięk idzie nosem; słowo kończy się samym „ng”, bez „g” ani „k”.', b: 'To samo nosowe „ng”, a potem wyraźne „k”.', pl: 'Polacy dodają na końcu „k” albo „g”, więc <i>sing</i> brzmi jak <i>sink</i>. Zakończ słowo samym brzmieniem w nosie.' }
  };
  function pronHowHtml(c) {
    const S0 = PRON_SETS.find(s => s.id === c.p.set), H = S0 && PRON_HOW[S0.id];
    if (!H) return '<div class="pr-how"><div class="pr-how-t">Różnica i wymowa</div><p class="small-note">Te słowa różnią się jednym dźwiękiem. Posłuchaj obu (P) kilka razy i powtarzaj za lektorem, zwracając uwagę na samogłoskę.</p></div>';
    const fa = S0.pairs.find(p => p[0].toLowerCase() === c.p.a.toLowerCase()) ? 'a' : 'b'; // c.p.a należy do strony A zestawu?
    const col = (side) => { const isA = (side === 'a') === (fa === 'a'), w = prWord(c, side);
      return '<div class="pr-how-c"><div class="pr-how-h"><b>' + esc(w) + '</b><span>' + (isA ? S0.sa : S0.sb) + '</span></div><p>' + (isA ? H.a : H.b) + '</p></div>'; };
    return '<div class="pr-how"><div class="pr-how-t">Różnica i wymowa · ' + S0.name + '</div><div class="pr-how-g">' + col('a') + col('b') + '</div><div class="pr-how-pl"><b>Typowy błąd Polaka:</b> ' + H.pl + '</div></div>';
  }
  const pronData = () => { const d = D(); d.pron = d.pron || {}; d.pron.sets = d.pron.sets || {}; d.pron.mine = d.pron.mine || {}; return d.pron; };
  const pronMine = () => { const m = pronData().mine; return Object.keys(m).map(k => m[k]).filter(p => (p.st || 0) < 4).sort((x, y) => (y.at || 0) - (x.at || 0)); };
  const pronNorm = s => String(s || '').toLowerCase().replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean);
  function pronSetOf(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    for (const s of PRON_SETS) for (const p of s.pairs) { const x = p[0].toLowerCase(), y = p[1].toLowerCase(); if ((x === a && y === b) || (x === b && y === a)) return { set: s, aIsA: x === a }; }
    return null;
  }
  /* z „Powiedz to”: szukane słowo nie padło, a padło podobne — zapisz parę */
  function pronNoteConfusion(target, heard, full) {
    const tw = pronNorm(target), hw = pronNorm(heard), fw = pronNorm(full);
    let best = null;
    tw.forEach(t => {
      if (t.length < 2 || hw.indexOf(t) >= 0) return;
      hw.forEach(h => { if (h === t || fw.indexOf(h) >= 0 || Math.abs(h.length - t.length) > 2) return; const d = U.lev(t, h); if (d <= 2 && d < t.length && (!best || d < best.d)) best = { t, h, d }; });
    });
    if (!best) return null;
    const m = pronData().mine, k = best.t + '|' + best.h;
    const p = m[k] || (m[k] = { a: best.t, b: best.h, n: 0, ok: 0, st: 0, seen: 0 });
    p.seen++; p.at = Date.now(); p.st = 0;
    return p;
  }
  let PR = null;
  function pronPool() {
    const out = [], ps = pronData();
    pronMine().slice(0, 4).forEach(p => { const f = pronSetOf(p.a, p.b); out.push({ a: p.a, b: p.b, pa: '', pb: '', set: f ? f.set.id : null, mine: p.a + '|' + p.b }); });
    const rate = s => { const a = ps.sets[s.id] || []; return a.length ? a.filter(Boolean).length / a.length : 0.5; };
    PRON_SETS.slice().sort((x, y) => rate(x) - rate(y) || (ps.sets[x.id] || []).length - (ps.sets[y.id] || []).length).slice(0, 2)
      .forEach(s => U.shuffle(s.pairs.slice()).slice(0, 4).forEach(p => out.push({ a: p[0], b: p[1], pa: p[2], pb: p[3], set: s.id })));
    return out;
  }
  function startPron(guide) {
    const pool = U.shuffle(pronPool()), mouth = Recog.supported(), q = [];
    for (let i = 0; i < 12; i++) { const p = pool[i % pool.length]; q.push({ kind: mouth && i >= 6 ? 'mouth' : 'ear', p, t: Math.random() < 0.5 ? 'a' : 'b', res: null, helped: false, tries: 0 }); }
    PR = { q, i: 0, xp: 0, ok: 0, guide: !!guide, done: false, listening: false, heard: '', note: '' };
    bumpUse('pron');
    go('pron');
    pronAuto();
  }
  const prCur = () => PR && PR.q[PR.i];
  const prWord = (c, side) => side === 'a' ? c.p.a : c.p.b;
  const prOther = c => c.t === 'a' ? 'b' : 'a';
  /* „Posłuchaj obu”: lektor mówi oba słowa po kolei (lewe, potem prawe), a słowo, które właśnie mówi, jest podświetlone */
  let PR_SAY = 0;
  function pronSayBoth(c) {
    const id = ++PR_SAY, seq = ['a', 'b'];
    const mark = side => $$('[data-say]').forEach(e => e.classList.toggle('saying', e.dataset.say === side));
    const step = k => {
      if (id !== PR_SAY || prCur() !== c || screen !== 'pron') return;
      if (k >= seq.length) { mark(null); return; }
      mark(seq[k]);
      Speech.speakOne(prWord(c, seq[k]), 0.8, () => setTimeout(() => step(k + 1), 600));
    };
    setTimeout(() => step(0), 150);
  }
  function pronAuto() { const c = prCur(); if (c && c.kind === 'ear' && !c.res) setTimeout(() => { if (prCur() === c && screen === 'pron') Speech.speak(prWord(c, c.t)); }, 250); }
  function pronTip(c) {
    const S0 = PRON_SETS.find(s => s.id === c.p.set), tw = prWord(c, c.t), ow = prWord(c, prOther(c));
    if (!S0) return 'Posłuchaj obu słów (P) i porównaj, czym się różnią.';
    const isA = S0.pairs.some(p => p[0].toLowerCase() === tw.toLowerCase() && p[1].toLowerCase() === ow.toLowerCase());
    return 'W <i>' + esc(tw) + '</i> jest ' + (isA ? S0.ta : S0.tb) + '.';
  }
  function pronResult(c, ok, near) {
    c.res = ok ? 'ok' : near ? 'near' : 'bad';
    const ps = pronData(), t = Store.today();
    if (c.p.set) { const a = ps.sets[c.p.set] || (ps.sets[c.p.set] = []); a.push(ok ? 1 : 0); if (a.length > 20) a.shift(); }
    if (c.p.mine && ps.mine[c.p.mine]) { const m = ps.mine[c.p.mine]; m.n++; if (ok) { m.ok++; m.st = (m.st || 0) + 1; } else m.st = 0; }
    const base = c.kind === 'mouth' ? 10 : 6, xp = ok ? Math.round(base * (c.helped ? 0.6 : 1)) : near ? 4 : 0;
    PR.xp += xp; if (ok) PR.ok++;
    D().xp += xp; t.xp += xp; t.total = (t.total || 0) + 1; t.correct = (t.correct || 0) + (ok ? 1 : 0);
    Sound.play(ok ? 'ok' : near ? 'uns' : 'bad');
    Store.save();
    if (!ok && c.kind === 'ear') setTimeout(() => { if (prCur() === c) pronSayBoth(c); }, 300);
  }
  function pronPick(side) { const c = prCur(); if (!c || c.res || c.kind !== 'ear') return; c.picked = side; pronResult(c, side === c.t); renderPron(); }
  function pronListen() {
    const c = prCur(); if (!c || c.kind !== 'mouth') return;
    if (PR.listening) { Recog.stop(); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    PR.listening = true; PR.heard = ''; PR.note = ''; renderPron();
    const X = PR;
    Recog.listen({
      silenceMs: 1200, firstMs: 6000,
      onInterim: t => { if (PR !== X) return; const el = $('#prHeard'); if (el) el.textContent = t; },
      onResult: alts => {
        if (PR !== X || prCur() !== c) return;
        PR.listening = false;
        const T = prWord(c, c.t).toLowerCase(), O = prWord(c, prOther(c)).toLowerCase(), top = pronNorm(alts[0]);
        PR.heard = alts[0];
        if (c.res) { PR.note = top.indexOf(T) >= 0 ? 'ok' : top.indexOf(O) >= 0 ? 'bad' : 'unclear'; renderPron(); return; } // kolejne próby — tylko ćwiczenie
        if (top.indexOf(T) >= 0) pronResult(c, true);
        else if (top.indexOf(O) >= 0) pronResult(c, false);
        else if (alts.slice(1).some(a => pronNorm(a).indexOf(T) >= 0)) pronResult(c, false, true);
        else { c.tries++; PR.note = 'unclear'; if (c.tries >= 3) pronResult(c, false); }
        renderPron();
      },
      onError: err => { if (PR !== X) return; PR.listening = false; PR.note = err === 'no-speech' ? 'nospeech' : 'err'; PR.err = recogMsg(err); renderPron(); }
    });
  }
  function pronNext() {
    const c = prCur(); if (!c || !c.res) return;
    PR.i++; PR.heard = ''; PR.note = '';
    if (PR.i >= PR.q.length) { PR.done = true; Store.save(); }
    renderPron(); pronAuto();
  }
  function pronIdk() { const c = prCur(); if (!c || c.res) return; pronResult(c, false); renderPron(); }
  function pronBoth() { const c = prCur(); if (!c) return; if (!c.res) c.helped = true; c.showBoth = true; renderPron(); pronSayBoth(c); }
  function pronSlow() { const c = prCur(); if (!c || c.kind !== 'ear') return; if (!c.res) { c.helped = true; renderPron(); } Speech.speak(prWord(c, c.t), 0.6); }
  function pronStatsHtml() {
    const ps = pronData(), mine = Object.keys(ps.mine).map(k => ps.mine[k]).sort((x, y) => (y.at || 0) - (x.at || 0)).slice(0, 6);
    const row = (a, pct, b) => '<div class="pr-r"><b>' + a + '</b><span class="pr-bar"><i style="width:' + pct + '%"></i></span><small>' + b + '</small></div>';
    return '<div class="pr-st"><div><div class="st-lbl">Twoje pary (z „Powiedz to”)</div>' +
      (mine.length ? mine.map(p => row(esc(p.a) + ' – ' + esc(p.b), p.n ? Math.round(p.ok / p.n * 100) : 0, (p.st || 0) >= 4 ? 'opanowane' : p.n ? Math.round(p.ok / p.n * 100) + '%' : 'nowa')).join('') : '<div class="small-note">Pojawią się, gdy w „Powiedz to” rozpoznawanie usłyszy podobne słowo zamiast szukanego (np. Trump zamiast tram).</div>') +
      '</div><div><div class="st-lbl">Dźwięki trudne dla Polaków</div>' +
      PRON_SETS.map(s => { const a = ps.sets[s.id] || []; const pct = a.length ? Math.round(a.filter(Boolean).length / a.length * 100) : 0; return row(s.name, pct, s.ex); }).join('') + '</div></div>';
  }
  function renderPron() {
    if (!PR) return go('play');
    screen = 'pron';
    const X = PR, n = X.q.length, c = prCur();
    const dots = '<span class="pr-dots">' + X.q.map((x, k) => '<i class="' + (x.res === 'ok' ? 'ok' : x.res === 'near' ? 'near' : x.res ? 'no' : k === X.i && !X.done ? 'cur' : '') + '"></i>').join('') + ' ' + Math.min(X.i + (c && c.res ? 1 : 0), n) + '/' + n + '</span>';
    const head = '<header class="ex-head"><button class="btn" id="back">' + IC.back + (X.done ? ' Wróć ' : ' Przerwij ') + K('Esc') + '</button><div class="ex-title"><b>Wymowa: pary dźwięków</b><span>' + (X.guide ? 'Krok po kroku · ' : '') + (X.done ? 'koniec rundy' : (c.kind === 'ear' ? 'ucho' : 'usta') + ' · ' + (X.i + 1) + '/' + n) + '</span></div><div style="width:150px;text-align:right" class="small-note">+' + X.xp + ' XP</div></header>';
    let body;
    if (X.done) {
      body = '<section class="pr-card"><div class="pr-top"><span>Koniec rundy</span>' + dots + '</div>' +
        '<div class="pr-sum"><b>' + X.ok + ' / ' + n + '</b><span>dobrze · +' + X.xp + ' XP</span></div>' + pronStatsHtml() + '</section>' +
        '<div class="pr-btns">' + (X.guide ? '<button class="btn primary" id="prNext">Dalej w planie ' + K('Enter') + '</button>' : '<button class="btn" id="prHome">Wróć do gier ' + K('Esc') + '</button><button class="btn primary" id="prAgain">Jeszcze raz ' + K('Enter') + '</button>') + '</div>';
    } else {
      const S0 = PRON_SETS.find(s => s.id === c.p.set), lab = (c.kind === 'ear' ? 'Słuchanie · ' : 'Mówienie · ') + (c.p.mine ? 'Twoja para' + (S0 ? ' · ' + S0.name : '') : S0.name);
      const T = prWord(c, c.t), O = prWord(c, prOther(c)), gT = c.t === 'a' ? c.p.pa : c.p.pb;
      let mid = '', fb = '', ctl = '';
      if (c.kind === 'ear') {
        const opt = side => { const w = prWord(c, side), g = side === 'a' ? c.p.pa : c.p.pb, st = c.res ? (side === c.t ? ' ok' : side === c.picked ? ' no' : ' dim') : '';
          return '<button class="btn pr-opt' + st + '" data-say="' + side + '" data-pick="' + side + '"' + (c.res ? ' disabled' : '') + '><b>' + esc(w) + '</b>' + (g ? '<small>' + esc(g) + '</small>' : '') + K(side === 'a' ? '1' : '2') + '</button>'; };
        mid = '<div class="pr-q">Posłuchaj i wybierz słowo, które usłyszałeś</div><button class="btn pr-spk" id="prPlay" title="Odtwórz jeszcze raz (Spacja)">' + IC.speakerBig + '</button><div class="pr-pair">' + opt('a') + opt('b') + '</div>';
        if (c.res) fb = c.res === 'ok' ? '<div class="pr-fb ok"><b>Dobrze!</b> To było <i>' + esc(T) + '</i>' + (c.helped ? ' · z podpowiedzią' : '') + '.</div>' : '<div class="pr-fb no"><b>To było <i>' + esc(T) + '</i>.</b> Posłuchaj obu — podświetla się słowo, które właśnie mówi lektor.</div>';
        ctl = c.res ? '<button class="btn" id="prBoth">Posłuchaj obu ' + K('P') + '</button><button class="btn primary" id="prNext">Dalej ' + K('Enter') + '</button>'
          : '<button class="btn" id="prSlow">Powtórz wolniej ' + K('R') + '</button><button class="btn" id="prIdk">Nie słyszę różnicy ' + K('Alt+W') + '</button>';
      } else {
        mid = '<div class="pr-q">Powiedz słowo — nie „' + esc(O) + '”!</div><div class="pr-word">' + esc(T) + '</div><div class="pr-sub">' + (S0 ? (c.t === 'a' ? S0.sa : S0.sb) : '') + (S0 && gT ? ' · ' : '') + esc(gT || '') + '</div>' +
          '<button class="btn pr-mic' + (X.listening ? ' on' : '') + '" id="prMic" title="Mów (M albo Spacja)">' + IC.mic + '</button>' +
          (c.showBoth || c.res ? '<div class="pr-mini">' + ['a', 'b'].map(sd => '<span class="pr-chip' + (sd === c.t ? ' tgt' : '') + '" data-say="' + sd + '">' + esc(prWord(c, sd)) + '</span>').join('') + '</div>' : '') +
          '<div class="pr-heard inset" id="prHeard">' + (X.listening ? 'Słucham…' : X.heard ? 'Usłyszałem: <b>' + esc(X.heard) + '</b>' : 'Kliknij mikrofon i powiedz słowo') + '</div>';
        if (X.note === 'unclear' && !c.res) fb = '<div class="pr-fb">Nie rozpoznałem ani <i>' + esc(T) + '</i>, ani <i>' + esc(O) + '</i> — powiedz jeszcze raz, wyraźnie jedno słowo.</div>';
        else if (X.note === 'nospeech' || X.note === 'err') fb = '<div class="pr-fb">' + (X.note === 'nospeech' ? 'Nic nie usłyszałem — spróbuj jeszcze raz.' : esc(X.err || 'Mikrofon nie działa.')) + '</div>';
        else if (c.res === 'ok') fb = '<div class="pr-fb ok"><b>Dobrze!</b> Usłyszałem <i>' + esc(T) + '</i>' + (c.helped ? ' · z podpowiedzią' : '') + '.' + (X.note === 'bad' ? ' (Ostatnia próba zabrzmiała jak <i>' + esc(O) + '</i>.)' : '') + '</div>';
        else if (c.res === 'near') fb = '<div class="pr-fb mid"><b>Prawie.</b> Najbardziej prawdopodobne było co innego, <i>' + esc(T) + '</i> dopiero w dalszym odczytaniu. ' + pronTip(c) + '</div>';
        else if (c.res === 'bad') fb = '<div class="pr-fb mid"><b>Jeszcze nie.</b> ' + (pronNorm(X.heard).indexOf(O.toLowerCase()) >= 0 ? 'To zabrzmiało jak <i>' + esc(O) + '</i>. ' : '') + pronTip(c) + ' Spróbuj jeszcze raz (M).</div>';
        ctl = c.res ? '<button class="btn" id="prBoth">Posłuchaj obu ' + K('P') + '</button><button class="btn" id="prMic2">Powiedz jeszcze raz ' + K('M') + '</button><button class="btn primary" id="prNext">Dalej ' + K('Enter') + '</button>'
          : '<button class="btn" id="prBoth">Posłuchaj obu ' + K('P') + '</button><button class="btn" id="prIdk">Nie wiem ' + K('Alt+W') + '</button>';
      }
      const how = (c.res && c.res !== 'ok') || c.showHow ? pronHowHtml(c) : '';
      if (!how) ctl = '<button class="btn" id="prHow">Jak wymówić? ' + K('J') + '</button>' + ctl;
      body = '<section class="pr-card"><div class="pr-top"><span>' + lab + '</span>' + dots + '</div>' + mid + fb + how + '<div class="pr-btns in">' + ctl + '</div></section>';
    }
    app.innerHTML = '<div class="wrap narrow pr-wrap">' + head + body + '</div>';
    const finish = () => { const g = X.guide; PR = null; if (g) return guideStepDone({ total: n, correct: X.ok, xp: X.xp }); go('play'); };
    $('#back').onclick = () => { if (X.listening) Recog.stop(); if (X.guide && !X.done) { PR = null; return go('guide'); } finish(); };
    $$('[data-pick]').forEach(b => b.onclick = () => pronPick(b.dataset.pick));
    if ($('#prPlay')) $('#prPlay').onclick = () => Speech.speak(prWord(c, c.t));
    if ($('#prSlow')) $('#prSlow').onclick = pronSlow;
    if ($('#prHow')) $('#prHow').onclick = () => { if (!c.res && c.kind === 'mouth') c.helped = true; c.showHow = true; renderPron(); };
    if ($('#prIdk')) $('#prIdk').onclick = pronIdk;
    if ($('#prBoth')) $('#prBoth').onclick = pronBoth;
    if ($('#prMic')) $('#prMic').onclick = pronListen;
    if ($('#prMic2')) $('#prMic2').onclick = pronListen;
    if ($('#prNext')) $('#prNext').onclick = () => X.done ? finish() : pronNext();
    if ($('#prAgain')) $('#prAgain').onclick = () => startPron(false);
    if ($('#prHome')) $('#prHome').onclick = finish;
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#back').click(); return; }
      if (X.done) { if (e.key === 'Enter') { e.preventDefault(); ($('#prNext') || $('#prAgain')).click(); } return; }
      if (e.altKey && e.code === 'KeyW' && $('#prIdk')) { e.preventDefault(); pronIdk(); return; }
      if (e.key === 'Enter' && c.res && !onButton()) { e.preventDefault(); pronNext(); return; }
      if (c.kind === 'ear') {
        if (!c.res && (e.key === '1' || e.key === '2')) { e.preventDefault(); pronPick(e.key === '1' ? 'a' : 'b'); return; }
        if (plainKey(e, 'Space')) { e.preventDefault(); Speech.speak(prWord(c, c.t)); return; }
        if (plainKey(e, 'KeyR')) { e.preventDefault(); pronSlow(); return; }
      } else if (plainKey(e, 'KeyM') || plainKey(e, 'Space')) { e.preventDefault(); pronListen(); return; }
      if (plainKey(e, 'KeyJ') && $('#prHow')) { e.preventDefault(); $('#prHow').click(); return; }
      if (plainKey(e, 'KeyP')) { e.preventDefault(); pronBoth(); }
    };
  }

  /* ================= PRZEGLĄD POZIOMU (np. A1): wpisz → „Umiem” albo do nauki ================= */
  let SW = null;
  const swIn = lvl => lvl === 'pv' ? (w => isPV(w) && !w.custom) : (w => w.lvl === lvl && !w.custom);
  const swName = lvl => lvl === 'pv' ? 'phrasal verbs' : L[lvl];
  const swLearn = (X, w) => X.lvl === 'pv' ? (!w || w.lvl < levels().vocab) : X.lvl < levels().vocab;
  const sweepWords = lvl => { const sw = D().swept || {}, f = swIn(lvl); return WORDS.list.filter(w => f(w) && !D().cards[w.id] && !sw[w.id]); };
  function sweepLeft(lvl) { return sweepWords(lvl).length; }
  function startSweep(lvl, from) {
    const list = U.shuffle(sweepWords(lvl)).slice(0, 40);
    if (!list.length) { toast('Wszystkie słowa ' + swName(lvl) + ' już przejrzane.'); return; }
    S = null;
    SW = { lvl, from: from || 'play', list, i: 0, phase: 'q', res: '', ans: '', known: 0, learn: 0, total: WORDS.list.filter(swIn(lvl)).length };
    go('sweep');
  }
  function sweepMarkKnown(w) { const now = Date.now(); knownFamily(w.id).forEach(x => { D().cards[x] = Object.assign({ reps: 0, lapses: 0, added: now }, D().cards[x] || {}, { state: 'known', knownAt: now }); }); }
  /* Challenge: AI ocenia, czy odpowiedź uznana za złą też pasuje (jak challenge w tenisie); uznana → zapamiętana jako dobra */
  async function sweepChallenge() {
    const X = SW; if (!X || X.busy || X.res !== 'bad' || !X.ans) return;
    const w = X.list[X.i], i = X.i;
    X.busy = true; renderSweep();
    let ai;
    try { const r = await AI.checkAnswer(w, X.ans); ai = { ok: r.acceptable, expl: r.explanation, m: AI.lastModel() }; }
    catch (e) { ai = { ok: false, expl: 'Nie udało się sprawdzić: ' + AI.humanError(e), m: '' }; }
    if (SW !== X || X.i !== i) return;
    X.busy = false; X.ai = ai;
    if (ai.ok) { X.res = 'ok'; const ao = D().altOk = D().altOk || {}; ao[w.id] = (ao[w.id] || []).concat([X.ans.toLowerCase()]); Store.save(); Sound.play('ok'); }
    renderSweep();
  }
  function sweepDecide(known) {
    const X = SW, w = X.list[X.i];
    if (known) { sweepMarkKnown(w); X.known++; }
    else if (swLearn(X, w)) { playMiss(w.id); X.learn++; }
    else { (D().swept = D().swept || {})[w.id] = 1; X.learn++; } // poziom bieżący i wyższe: nieznane zostają w zwykłej kolejce nowych słów
    const t = Store.today(); if (X.res !== 'bad') { t.total++; t.correct++; } else t.total++;
    progress(); Store.save();
    X.i++; X.phase = 'q'; X.res = ''; X.ans = ''; X.ai = null; X.busy = false;
    renderSweep();
  }
  function renderSweep() {
    screen = 'sweep';
    const X = SW; if (!X) return go('home');
    const done = X.i >= X.list.length, seen = X.total - sweepLeft(X.lvl);
    const head = '<header class="ex-head"><button class="btn" id="swEnd">' + IC.back + ' Zakończ ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Przegląd ' + swName(X.lvl) + '</b><span>przejrzane ' + seen + ' z ' + X.total + ' · ta porcja ' + Math.min(X.i + (done ? 0 : 1), X.list.length) + '/' + X.list.length + '</span></div>' +
      '<div class="combo raised">Znam: ' + X.known + '</div></header>';
    let body;
    if (done) {
      body = '<main class="ex-card raised"><h1 style="font-size:34px">Porcja przejrzana</h1><p class="muted" style="font-size:18px;margin:0">Znasz <b>' + X.known + '</b> · ' + (swLearn(X) ? 'do nauki' : 'zostaje w nowych słowach') + ' <b>' + X.learn + '</b> · zostało ' + sweepLeft(X.lvl) + ' słów ' + swName(X.lvl) + '</p>' +
        '<div class="row center" style="gap:16px">' + (sweepLeft(X.lvl) ? '<button class="btn big primary" id="swMore">Kolejna porcja ' + K('Enter') + '</button>' : '') + '<button class="btn big" id="swBack">Wróć ' + K('Esc') + '</button></div></main>';
    } else {
      const w = X.list[X.i], show = X.phase === 'show';
      const aiLine = X.ai ? '<div class="fb ' + (X.ai.ok ? 'ok' : 'bad') + ' sw-ai" role="status" style="max-width:600px">' + (X.ai.ok ? IC.check : IC.alert) + '<span><b>Challenge: ' + (X.ai.ok ? 'uznane ✓' : 'nie uznane') + '</b> ' + aiTag(X.ai.m) + '<br>' + qaFmt(X.ai.expl) + '</span></div>' : '';
      const fb = !show ? '' : X.busy ? '<div class="checking"><span class="spinner"></span>AI sprawdza Twoją odpowiedź…</div>' : (X.ai && X.ai.ok) ? aiLine : X.res === 'bad'
        ? '<div class="fb bad" role="status" style="max-width:600px">' + IC.alert + '<span>' + (X.ans ? 'Ty: <s>' + esc(X.ans) + '</s> → ' : '') + 'Poprawnie: <b>' + esc(w.answers[0]) + '</b> · ' + (swLearn(X, w) ? 'trafi do nauki' : 'zostaje w kolejce nowych słów') + '</span></div>' + aiLine
        : '<div class="fb ok" role="status" style="max-width:600px">' + IC.check + '<span><b>' + (X.res === 'typo' ? 'Prawie — literówka.' : 'Dobrze!') + '</b> ' + esc(w.answers[0]) + '</span></div>';
      const btns = !show
        ? '<div class="row center" style="gap:14px"><button class="btn" id="swIdk">Nie wiem ' + K('Alt+W') + '</button><button class="btn primary" id="swOk">Sprawdź ' + K('Enter') + '</button></div><div class="small-note">' + K('Enter') + ' przy pustym polu = nie wiem</div>'
        : X.busy ? ''
        : X.res === 'bad'
          ? '<div class="row center" style="gap:14px">' + (X.ans && !X.ai && AI.enabled() ? '<button class="btn chal-btn" id="swChal" title="Challenge — AI sprawdzi (C). Uważasz, że Twoja odpowiedź też jest dobra? AI oceni i wyjaśni." aria-label="Challenge — AI sprawdzi (C)">?!</button>' : '') + '<button class="btn primary" id="swNext">Dalej ' + K('Enter') + '</button></div>'
          : '<div class="row center" style="gap:14px"><button class="btn" id="swLearn">Jeszcze poćwiczę ' + K('N') + '</button><button class="btn primary" id="swKnow">Umiem — nie pokazuj ' + K('Enter') + '</button></div>';
      body = '<main class="ex-card raised"><div class="prompt-word race-word">' + esc(w.pl) + '</div>' + exSentHtml(w, !show, 'ex-s race-ex') + fb +
        '<div class="answer-box"><label for="ans">Po angielsku</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off"' + (show ? ' disabled value="' + esc(X.ans) + '"' : '') + '></div>' + btns + '</main>';
    }
    app.innerHTML = '<div class="wrap narrow">' + head + body + '</div>';
    const back = () => { const f = X.from; SW = null; f === 'words' ? go('words', 'rev') : go(f === 'stats' ? 'stats' : 'play'); };
    $('#swEnd').onclick = back;
    if ($('#swBack')) $('#swBack').onclick = back;
    if ($('#swMore')) $('#swMore').onclick = () => startSweep(X.lvl, X.from);
    const check = idk => {
      const w = X.list[X.i], a = idk ? '' : ($('#ans').value || '').trim();
      if (!a && !idk) idk = true;
      const m = a ? matchAnswer(w.answers, a) : 'wrong';
      const alt = a && altOkList(w).indexOf(a.toLowerCase()) >= 0;
      X.ans = a; X.res = m === 'exact' || alt ? 'ok' : m === 'typo' ? 'typo' : 'bad'; X.phase = 'show'; X.ai = null;
      if (X.res !== 'bad') Sound.play('ok');
      renderSweep();
    };
    if ($('#swOk')) $('#swOk').onclick = () => check(false);
    if ($('#swIdk')) $('#swIdk').onclick = () => check(true);
    if ($('#swNext')) $('#swNext').onclick = () => sweepDecide(false);
    if ($('#swChal')) $('#swChal').onclick = sweepChallenge;
    if ($('#swLearn')) $('#swLearn').onclick = () => sweepDecide(false);
    if ($('#swKnow')) $('#swKnow').onclick = () => sweepDecide(true);
    const inp = $('#ans'); if (inp && !inp.disabled) inp.focus();
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); back(); return; }
      if (done) { if (e.key === 'Enter' && $('#swMore')) { e.preventDefault(); $('#swMore').click(); } return; }
      if (X.phase === 'q') { if (e.altKey && e.code === 'KeyW' && $('#swIdk')) { e.preventDefault(); $('#swIdk').click(); return; } if (e.key === 'Enter') { e.preventDefault(); check(false); } return; }
      if (e.key === 'Enter') { e.preventDefault(); ($('#swKnow') || $('#swNext')).click(); return; }
      if (plainKey(e, 'KeyN') && $('#swLearn')) { e.preventDefault(); $('#swLearn').click(); }
      if (plainKey(e, 'KeyC') && $('#swChal')) { e.preventDefault(); $('#swChal').click(); }
    };
  }
  function startPlay(type) {
    const note = gameNote(type);
    if (note) { toast('Ta gra jest teraz niedostępna: ' + note + '.'); return; }
    if (type === 'race') return startRacePlay();
    if (type === 'pron') return startPron(false);
    const lm = playLimits(), lim = lm.min || lm.q ? lm : null;
    if (type === 'yg') { newSession({ play: 'yg', lim }); return go('yg'); }
    newSession({ play: type, lim, queue: buildPlayQueue(type, 15, []) });
    if (!S.queue.length) { S = null; toast('Za mało materiału do tej gry — poucz się najpierw trochę słówek.'); return; }
    go('exercise');
  }
  function startRacePlay(keep) {
    if (keep) { S = keep; S.paused = false; } else newSession({ play: 'race' });
    S.race = { left: raceSec(), sec: raceSec(), list: U.shuffle(learnedWords()), idx: 0, hits: 0, misses: [], phase: 'q' };
    go('race');
  }
  function buildPlayQueue(type, n, avoid) {
    let ids = [];
    if (type === 'text') {
      const T = (D().texts || {})[S && S.playText];
      ids = T ? textStats(T).ids.concat(textSentenceIds(T)) : [];
    } else if (type === 'error') {
      const gl = levels().grammar;
      GRAMMAR.forEach((g, gi) => {
        if (Math.abs(g.lvl - gl) > 1) return;
        for (let wi = 1; wi < g.options.length; wi++) { if (!(ERR_EXCLUDE[g.s] || []).includes(g.options[wi])) ids.push('err:' + gi + '-' + wi); }
      });
    } else if (type === 'tense') {
      ids = tenseIdsFor((S && S.playTids) || []).map(id => (Math.random() < 0.5 && D().cards['tnc:' + id] ? 'tnw:' : 'tnc:') + id);
    } else if (type === 'particle') {
      const c = D().cards, lv = levels().vocab;
      let ws = WORDS.list.filter(w => isPV(w) && c[w.id] && c[w.id].state !== 'known');
      if (ws.length < 8) ws = ws.concat(WORDS.list.filter(w => isPV(w) && !c[w.id] && w.lvl <= lv + 1));
      ids = ws.map(w => 'pv:' + w.id);
    } else {
      const pre = type === 'cloze' ? '' : PREFIX_OF[type];
      ids = learnedWords().map(w => pre + w.id);
    }
    const av = avoid || [], cc = D().cards;
    const fresh = ids.filter(id => av.indexOf(id) < 0 && !(cc[id] && cc[id].state === 'known') && !basketOf(scaleKey(itemFor(id))));
    const L2 = sentLevel(), fit = fresh.filter(id => { const d = itemDiff(itemFor(id)); return !d || d <= L2 + 1; });
    return U.shuffle(fit.length >= 6 ? fit : fresh.length ? fresh : ids.filter(id => av.indexOf(id) < 0)).slice(0, n).map(id => ({ id, isNew: false }));
  }
  function playMiss(id) {
    const c = D().cards[id], tomorrow = U.addDays(U.startOfDay(), 1);
    if (c) { if (c.state === 'review' && c.due > tomorrow) c.due = tomorrow; }
    else D().cards[id] = Object.assign(FSRS.review(null, 1), { added: Date.now() });
  }

  /* ---------- YouGlish ---------- */
  let ygP = null, ygW = null;
  function ygLoad() {
    if (window.YG && window.YG.Widget) return Promise.resolve();
    if (ygP) return ygP;
    ygP = new Promise((res, rej) => {
      window.onYouglishAPIReady = () => res();
      const sc = document.createElement('script');
      sc.src = 'https://youglish.com/public/emb/widget.js'; sc.async = true;
      sc.onerror = () => { ygP = null; rej(new Error('Nie udało się wczytać YouGlish — sprawdź połączenie z internetem.')); };
      document.head.appendChild(sc);
      setTimeout(() => { if (!(window.YG && window.YG.Widget)) { ygP = null; rej(new Error('YouGlish nie odpowiada — spróbuj później.')); } }, 15000);
    });
    return ygP;
  }
  function ygAccent() { const a = D().settings.ygAccent || 'us'; return a === 'all' ? undefined : a; }
  function openFilms(word) {
    if (!CAN_EMBED) {
      window.open('https://youglish.com/pronounce/' + encodeURIComponent(word) + '/english' + (ygAccent() ? '/' + ygAccent() : ''), '_blank', 'noopener');
      toast('Otworzyłem YouGlish w nowej karcie.');
      return;
    }
    S.ygOpen = true; renderExercise();
  }
  function ygCredits() {
    return '<span>Powered by <a href="https://youglish.com" target="_blank" rel="noopener">YouGlish.com</a> · <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">Warunki YouTube</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Prywatność Google</a></span>';
  }
  function ygPanelHtml() {
    return '<section class="yg-panel inset" aria-label="Filmy z YouGlish"><div class="row between"><b>Prawdziwe nagrania</b>' +
      '<span class="small-note">' + K('←') + ' ' + K('→') + ' inny film · ' + K('R') + ' powtórz · ' + K('V') + ' zamknij</span></div>' +
      '<div id="ygw" class="yg-box"><div class="checking"><span class="spinner"></span>Wczytuję filmy…</div></div>' +
      '<div class="row between small-note"><span id="ygInfo"></span>' + ygCredits() + '</div></section>';
  }
  function ygMount(word, opts) {
    opts = opts || {};
    const hostId = opts.hostId || 'ygw';
    ygLoad().then(() => {
      const host = document.getElementById(hostId); if (!host) return;
      ygTeardown();
      host.innerHTML = '';
      ygW = new window.YG.Widget(hostId, {
        width: Math.max(320, host.clientWidth || 640), components: opts.components || 88, autoStart: 1,
        backgroundColor: '#DAD7D1', textColor: '#3A3835', captionColor: '#3A3835', keywordColor: '#B9456B', markerColor: '#B9456B',
        events: {
          onFetchDone: e => {
            const info = document.getElementById('ygInfo');
            if (info) info.textContent = e.totalResult ? 'Nagrań: ' + e.totalResult : 'Brak nagrań z tym słowem.';
            if (opts.onFetch) opts.onFetch(e);
          },
          onCaptionChange: e => { if (opts.onCaption) opts.onCaption(e.caption); },
          onError: e => { if (opts.onError) opts.onError(e); }
        }
      });
      ygW.fetch(word, 'english', ygAccent());
    }).catch(err => { const host = document.getElementById(hostId); if (host) host.innerHTML = '<div class="small-note" style="padding:20px">' + esc(err.message) + '</div>'; if (opts.onError) opts.onError(err); });
  }
  function ygClose() { if (!S) return; S.ygOpen = false; ygTeardown(); renderExercise(); }
  function ygCmd(c) { if (ygW && typeof ygW[c] === 'function') { try { ygW[c](); } catch (e) { } } }
  function ygTeardown() { if (ygW) { try { ygW.close(); } catch (e) { } ygW = null; } }

  /* Gra: Usłysz w filmie */
  function renderYG() {
    if (!S) return go('play');
    if (!S.yg) bumpUse('yg');
    if (!S.yg) S.yg = { list: U.shuffle(learnedWords()), idx: 0, phase: 'loading', caption: '', skips: 0, hint: false, empty: false };
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="quit">' + IC.back + ' Zakończ ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Usłysz w filmie</b><span>Graj · ' + (S.lim ? limText().replace('pytań', 'klipów') : 'prawdziwe nagrania') + '</span></div>' +
      '<div class="row" style="gap:12px"><div class="combo raised" id="combo">Combo ×' + S.combo + '</div><div class="timer inset deep" id="timer">' + limTimer() + '</div></div></header>' +
      '<main class="ex-card raised"><div class="tag inset">SŁUCHANIE · FILMY</div>' +
      '<div class="prompt-lbl">Posłuchaj fragmentu i wpisz słowo z Twojej nauki, które w nim pada</div>' +
      '<div id="ygGame" class="yg-box"><div class="checking"><span class="spinner"></span>Wczytuję filmy…</div></div>' +
      '<div class="row between small-note" style="width:100%"><span id="ygInfo"></span>' + ygCredits() + '</div>' +
      '<div id="ygArea" class="col" style="align-items:center;width:100%"></div>' +
      '</main></div>';
    $('#quit').onclick = () => { ygTeardown(); finishSession(true); };
    ygLoadWord();
    keyHandler = e => {
      if (e.repeat || !S || !S.yg) return;
      const Y = S.yg;
      if (e.key === 'Escape') { e.preventDefault(); ygTeardown(); finishSession(true); return; }
      if (altKey(e, 'KeyS') || (Y.phase === 'feedback' && plainKey(e, 'KeyS'))) { e.preventDefault(); ygCmd('replay'); return; }
      if (Y.phase === 'answer') {
        if (altKey(e, 'KeyP')) { e.preventDefault(); Y.hint = true; ygArea(); return; }
        if (altKey(e, 'KeyW')) { e.preventDefault(); ygAnswer('', true); return; }
        if (altKey(e, 'KeyK')) { e.preventDefault(); ygCmd('next'); return; }
        if (e.key === 'Enter' && !onButton()) { e.preventDefault(); const inp = $('#ans'); ygAnswer(inp ? inp.value : ''); }
      } else if (Y.phase === 'feedback' && e.key === 'Enter' && !onButton()) { e.preventDefault(); ygNext(); }
    };
  }
  function ygWord() { const Y = S.yg; return Y.list[Y.idx % Y.list.length]; }
  function ygLoadWord() {
    const Y = S.yg, w = ygWord();
    Y.phase = 'loading'; Y.caption = ''; Y.hint = false; Y.empty = false; ygArea();
    ygMount(w.answers[0], {
      hostId: 'ygGame', components: 80,
      onFetch: e => {
        if (!S || S.yg !== Y) return;
        if (!e.totalResult) {
          Y.skips++;
          if (Y.skips > 12) { ygArea('Nie znalazłem nagrań dla Twoich słów. Spróbuj później albo zmień akcent w ustawieniach.'); return; }
          Y.idx++; ygLoadWord(); return;
        }
        Y.skips = 0; Y.phase = 'answer'; S.cardStart = Date.now(); ygArea();
      },
      onCaption: cap => { if (S && S.yg === Y) Y.caption = cap; },
      onError: () => { if (S && S.yg === Y && Y.phase === 'loading') ygArea('Nie udało się wczytać filmu. Sprawdź połączenie z internetem.'); }
    });
  }
  function ygArea(msg) {
    const el = document.getElementById('ygArea'); if (!el || !S || !S.yg) return;
    const Y = S.yg, w = ygWord();
    if (msg) { el.innerHTML = '<div class="fb info">' + IC.alert + '<span>' + esc(msg) + '</span></div>'; return; }
    if (Y.phase === 'loading') { el.innerHTML = ''; return; }
    if (Y.phase === 'answer') {
      el.innerHTML =
        (Y.hint ? '<div class="hint">Podpowiedź: ' + esc(w.pl) + ' · zaczyna się na „' + esc(w.answers[0][0]) + '”</div>' : '') +
        (Y.empty ? '<div class="hint" role="status">Nic nie wpisano — naciśnij <b>Enter</b> jeszcze raz, żeby zobaczyć odpowiedź.</div>' : '') +
        '<div class="answer-box"><label for="ans">Jakie słowo słyszysz?</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off"></div>' +
        '<div class="row center" style="gap:14px">' +
        '<button class="btn" id="ygRe">Powtórz ' + K('Alt+S') + '</button>' +
        '<button class="btn" id="ygHint"' + (Y.hint ? ' disabled' : '') + '>Podpowiedź ' + K('Alt+P') + '</button>' +
        '<button class="btn" id="ygOther">Inny film ' + K('Alt+K') + '</button>' +
        '<button class="btn" id="ygIdk">Nie wiem ' + K('Alt+W') + '</button>' +
        '<button class="btn primary" id="ygCheck">Sprawdź ' + K('Enter') + '</button></div>';
      const inp = el.querySelector('#ans'); inp.focus();
      el.querySelector('#ygRe').onclick = () => ygCmd('replay');
      el.querySelector('#ygHint').onclick = () => { Y.hint = true; ygArea(); };
      el.querySelector('#ygOther').onclick = () => ygCmd('next');
      el.querySelector('#ygIdk').onclick = () => ygAnswer('', true);
      el.querySelector('#ygCheck').onclick = () => ygAnswer(inp.value);
      return;
    }
    const fb = Y.fb;
    const cap = Y.caption ? esc(Y.caption).replace(/\[\[\[(.*?)\]\]\]/g, '<mark>$1</mark>') : '';
    el.innerHTML =
      '<div class="fb ' + fb.cls + '" role="status">' + (fb.cls === 'ok' ? IC.check : fb.cls === 'bad' ? IC.alert : IC.question) + '<span><b>' + fb.title + '</b> ' + esc(w.answers[0]) + ' — ' + esc(w.pl) + (fb.xp ? ' · +' + fb.xp + ' XP' : '') +
      (fb.cls === 'bad' || fb.cls === 'info' ? '<small>Słowo wróci w najbliższej sesji.</small>' : '') + '</span></div>' +
      (cap ? '<div class="interim inset deep sent-mark">„' + cap + '”</div>' : '') +
      '<div class="row center" style="gap:14px"><button class="btn" id="ygRe">Odtwórz jeszcze raz ' + K('S') + '</button><button class="btn primary" id="ygNext">Dalej ' + K('Enter') + '</button></div>';
    el.querySelector('#ygRe').onclick = () => ygCmd('replay');
    el.querySelector('#ygNext').onclick = ygNext;
  }
  function ygAnswer(ans, idk) {
    const Y = S.yg; if (!Y || Y.phase !== 'answer') return;
    if (!ans.trim() && !idk) { if (!Y.empty) { Y.empty = true; ygArea(); return; } idk = true; }
    const w = ygWord(), t = Store.today();
    const m = ans.trim() ? matchAnswer(w.answers, ans) : 'idk';
    const correct = m === 'exact' || m === 'typo';
    t.total++; S.total++;
    pushHist('listening', correct);
    t.sk = t.sk || {}; const a = t.sk.listening || (t.sk.listening = [0, 0]); a[1]++;
    let xp = 0;
    if (correct) {
      a[0]++; t.correct++; S.correct++;
      S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo);
      xp = 10 + (S.combo >= 3 ? 5 : 0); S.xp += xp; D().xp += xp; t.xp += xp;
      if (S.combo > D().bestCombo) { D().bestCombo = S.combo; D().bestComboAt = Date.now(); }
      Sound.play(m === 'typo' ? 'uns' : 'ok');
    } else {
      S.combo = 0; playMiss(w.id);
      if (!S.struggled.includes(w.id)) S.struggled.push(w.id);
      logMistake({ type: 'yg', id: w.id, w }, m, { word: w.answers[0] });
      Sound.play(m === 'idk' ? 'idk' : 'bad');
    }
    progress(); Store.save();
    Y.fb = { cls: correct ? (m === 'typo' ? 'uns' : 'ok') : m === 'idk' ? 'info' : 'bad', title: correct ? (m === 'typo' ? 'Prawie — literówka.' : 'Dobrze!') : m === 'idk' ? 'To było:' : 'Jeszcze nie.', xp };
    Y.phase = 'feedback';
    const cb = document.getElementById('combo'); if (cb) cb.textContent = 'Combo ×' + S.combo;
    ygArea();
  }
  function ygNext() { if (limitDone()) { ygTeardown(); return finishSession(true); } const Y = S.yg; Y.idx++; ygLoadWord(); }

  /* ---------- Dziennik błędów ---------- */
  /* ================= UPARTE BŁĘDY (upd224) =================
     Ten sam błąd w tłumaczeniu 3 razy (np. in school → at school) = karta „Uparty błąd”: codziennie jedno krótkie zdanie z tym zwrotem,
     znika po 4 różnych dniach bez błędu; powrót błędu = od nowa. Wykrywanie: porównanie odpowiedzi z poprawioną wersją (słowo po słowie). */
  const STUB_N = 3, STUB_DAYS = 4;
  const FUNC_W = /^(in|at|on|to|for|of|from|with|by|into|onto|about|the|a|an|is|are|was|were|do|does|did|have|has|had|am|be|been|will|would)$/;
  const stubs = () => (D().stub = D().stub || {});
  const stubTok = s => String(s || '').toLowerCase().replace(/[“”„"]/g, '').replace(/[.,!?;:]+/g, ' ').split(/\s+/).filter(Boolean);
  function stubDiff(ans, ref) {
    const A = stubTok(ans), B = stubTok(ref), n = A.length, m = B.length;
    if (!n || !m || n > 40 || m > 40) return [];
    const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const out = []; let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && A[i] === B[j]) { i++; j++; continue; }
      const i0 = i, j0 = j;
      while ((i < n || j < m) && !(i < n && j < m && A[i] === B[j])) { if (j >= m || (i < n && L[i + 1][j] >= L[i][j + 1])) i++; else j++; }
      const wa = A.slice(i0, i), wb = B.slice(j0, j);
      if (!wa.length || !wb.length || wa.length > 2 || wb.length > 2) continue;
      if (wa.length === 1 && wb.length === 1 && !FUNC_W.test(wb[0]) && wb[0].length >= 4 && U.lev(wa[0], wb[0]) <= 2) { out.push({ wrong: wa[0], right: wb[0], rule: 'pisownia: ' + wb[0] }); continue; }
      if (wa.concat(wb).some(w => FUNC_W.test(w))) {
        const nx = i < n && j < m && A[i] === B[j] ? ' ' + A[i] : '';
        out.push({ wrong: wa.join(' ') + nx, right: wb.join(' ') + nx, rule: '' });
      }
    }
    return out.slice(0, 2);
  }
  function stubCount(c, src) {
    const S0 = stubs(), k = c.wrong + '>' + c.right;
    const x = S0[k] || (S0[k] = { wrong: c.wrong, right: c.right, rule: c.rule || '', n: 0, days: [], src: [], state: 'watch' });
    x.n++; x.at = Date.now(); if (!x.rule && c.rule) x.rule = c.rule;
    if (src && src.en && !x.src.some(s => s.en === src.en)) { x.src.push(src); if (x.src.length > 6) x.src.shift(); }
    return { k, x };
  }
  /* po odpowiedzi w tłumaczeniu — zwraca tekst do oceny, gdy błąd stał się (albo jest) uparty */
  function stubDetect(it, extra) {
    if (!extra || !extra.ans || it.stub) return '';
    const ref = extra.better && U.norm(extra.better) !== U.norm(extra.ans) ? extra.better : fullSentence(it);
    let msg = '';
    stubDiff(extra.ans, ref).forEach(c => {
      const { k, x } = stubCount(c, { pl: it.pl || '', en: fullSentence(it) });
      const pair = '<s>' + esc(x.wrong) + '</s> → <b>' + esc(x.right) + '</b>';
      if (x.state === 'active') { x.days = []; msg = 'Uparty błąd: ' + pair + ' (' + x.n + '. raz) — liczę dni od nowa.'; }
      else if (x.n >= STUB_N) { x.state = 'active'; x.days = []; x.since = Date.now(); delete x.doneAt; msg = 'To już <b>' + x.n + '. raz</b>: ' + pair + '. Zakładam kartę <b>„Uparty błąd”</b> — przez kilka dni dostaniesz krótkie zdania z tym zwrotem.'; stubPrepare(k); }
    });
    Store.save();
    return msg;
  }
  /* karta upartego błędu: dobra odpowiedź w nowy dzień = +1, błąd = od nowa; 4 dni = opanowany */
  function stubProgress(it, kind, correct) {
    const x = stubs()[it.stub]; if (!x) return '';
    const dk = U.dayKey(Date.now()); x.lastDay = dk;
    if (correct && kind === 'ok' && !S.hint && !S.unsure) {
      if (x.days.indexOf(dk) < 0) x.days.push(dk);
      if (x.days.length >= STUB_DAYS) { x.state = 'done'; x.doneAt = Date.now(); Store.save(); return 'Uparty błąd <b>' + esc(x.right) + '</b> opanowany ✓ — ' + STUB_DAYS + ' dni bez błędu.'; }
      Store.save(); return 'Uparty błąd: dobrze — ' + x.days.length + '/' + STUB_DAYS + ' dni bez błędu.';
    }
    x.days = []; Store.save();
    return 'Uparty błąd: jeszcze nie — liczę od nowa (0/' + STUB_DAYS + ').' + (x.rule ? ' <b>Zasada:</b> ' + esc(x.rule) : '');
  }
  /* zdania do ćwiczeń i nazwa zasady od AI; bez AI — zdania, w których błąd się zdarzył */
  const STUB_BUSY = {};
  function stubPrepare(k) {
    const x = stubs()[k]; if (!x || STUB_BUSY[k] || (x.sents && x.sents.length >= 4) || !AI.enabled()) return;
    STUB_BUSY[k] = true;
    AI.stubDrill(x.wrong, x.right, x.src.map(s => s.en)).then(r => {
      if (r.rule) x.rule = r.rule;
      if (r.items.length) x.sents = r.items;
      Store.save();
    }).catch(() => { }).then(() => { delete STUB_BUSY[k]; });
  }
  function stubItem(rest) {
    const j = rest.lastIndexOf(':'), k = rest.slice(0, j), x = stubs()[k]; if (!x) return null;
    const list = (x.sents && x.sents.length ? x.sents : x.src).filter(s => s.en), s = list[+rest.slice(j + 1) % Math.max(1, list.length)];
    if (!s) return null;
    return { type: 'translate', id: 'stb:' + rest, w: { answers: [''], pl: '', s: '_' + s.en }, lvl: levels().grammar || 0, pl: s.pl || null, simple: true, stub: k, stubRight: x.right };
  }
  /* dzisiejsze karty (po jednej na każdy aktywny uparty błąd, jeśli dziś jeszcze nie było) */
  function stubQueue() {
    const dk = U.dayKey(Date.now()), S0 = stubs();
    return Object.keys(S0).filter(k => S0[k].state === 'active' && S0[k].lastDay !== dk).slice(0, 4).map(k => {
      const x = S0[k]; stubPrepare(k);
      const n = (x.sents && x.sents.length ? x.sents : x.src).length || 1;
      return { id: 'stb:' + k + ':' + ((x.n + x.days.length + new Date().getDate()) % n), isNew: false };
    }).filter(q => itemFor(q.id));
  }
  /* jednorazowo: policz uparte błędy z dotychczasowego dziennika (tłumaczenia „odpowiedź → poprawnie”) */
  function stubBackfill() {
    if (D().stubBf) return;
    D().stubBf = 1;
    (D().mistakes || []).forEach(mk => {
      if (mk.cat !== 'Tłumaczenie z polskiego' || !mk.d || mk.d.indexOf(' → ') < 0) return;
      const p = mk.d.lastIndexOf(' → '), ans = mk.d.slice(0, p), ref = mk.d.slice(p + 3);
      stubDiff(ans, ref).forEach(c => stubCount(c, { pl: (D().plCache || {})[mk.id] || '', en: ref }));
    });
    const S0 = stubs();
    Object.keys(S0).forEach(k => { if (S0[k].n >= STUB_N && S0[k].state === 'watch') { S0[k].state = 'active'; S0[k].days = []; S0[k].since = Date.now(); } });
    Store.save();
    Object.keys(S0).forEach(k => { if (S0[k].state === 'active') stubPrepare(k); });
  }
  function stubListHtml() {
    const S0 = stubs(), ks = Object.keys(S0).filter(k => S0[k].state !== 'watch').sort((a, b) => (S0[a].state === 'done') - (S0[b].state === 'done') || S0[b].n - S0[a].n);
    if (!ks.length) return '';
    const dots = x => '<span class="ub-dots">' + [0, 1, 2, 3].map(i => '<i' + (i < (x.state === 'done' ? STUB_DAYS : x.days.length) ? ' class="ok"' : '') + '></i>').join('') + '</span>';
    const act = ks.filter(k => S0[k].state === 'active');
    return '<section class="ub-box"><div class="row between"><h2>Twoje uparte błędy</h2><span class="small-note">znikają po ' + STUB_DAYS + ' dniach bez błędu</span></div>' +
      ks.slice(0, 12).map(k => { const x = S0[k];
        return '<div class="ub-row"><span><s>' + esc(x.wrong) + '</s> → <b>' + esc(x.right) + '</b></span><small>' + esc(x.rule || '') + '</small>' + dots(x) + (x.state === 'done' ? '<span class="ub-ok">opanowany ✓</span>' : '<small>' + x.n + ' razy</small>') + '</div>'; }).join('') +
      (act.length ? '<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn small" id="ubGo">Ćwicz teraz (' + act.length + ')</button></div>' : '') + '</section>';
  }

  function logMistake(it, m, extra) {
    extra = extra || {};
    if (it.simple) return;
    const list = D().mistakes = D().mistakes || [];
    let cat = '', d = '';
    if (m === 'typo') {
      if (it.type === 'dictation' || it.type === 'speak') return;
      if (it.type === 'translate') { cat = 'Tłumaczenie z polskiego'; d = (extra.ans ? extra.ans + ' → ' : '') + (extra.better || fullSentence(it)); }
      else if (it.ts) { cat = 'Czasy: ' + TS_BY[it.ts.tid].name; d = (extra.ans ? extra.ans + ' → ' : '') + it.ts.correct[0]; }
      else { cat = 'Pisownia'; d = it.w ? it.w.answers[0] : it.type === 'error' ? it.g.correct : ''; }
    } else if (it.type === 'cloze' || it.type === 'choice') {
      const ans = U.norm(extra.ans || '');
      const other = ans && WORDS.list.find(w => w.id !== it.w.id && w.answers.some(x => U.norm(x) === ans));
      if (other) { const pair = [it.w.answers[0], other.answers[0]].sort(); cat = 'Mylisz słowa: ' + pair[0] + ' ↔ ' + pair[1]; d = extra.ans + ' → ' + it.w.answers[0] + ' (' + it.w.pl + ')'; }
      else { cat = m === 'idk' ? 'Słowa, których nie pamiętasz' : 'Słownictwo — inne słowo niż trzeba'; d = (m !== 'idk' && extra.ans ? extra.ans + ' → ' : '') + it.w.answers[0] + ' (' + it.w.pl + ')'; }
    } else if (it.type === 'error') { cat = 'Gramatyka: ' + it.g.expl.replace(/\.$/, ''); d = it.wrong + ' → ' + it.g.correct; }
    else if (it.type === 'order') { cat = 'Szyk zdania'; d = fullSentence(it); }
    else if (it.type === 'dictation') {
      cat = 'Dyktando — słuchanie';
      const df = extra.ans ? wordDiff(fullSentence(it), extra.ans) : null;
      d = df ? df.A.filter((w, k) => !df.aOk[k]).join(', ') : fullSentence(it);
    } else if (it.type === 'speak') { cat = 'Mówienie'; d = it.w.answers[0]; }
    else if (it.ts) { cat = 'Czasy: ' + TS_BY[it.ts.tid].name; d = (extra.ans ? extra.ans + ' → ' : '') + (it.type === 'tense_t' ? (extra.better || it.ts.full) : it.ts.correct[0] + ' (' + it.ts.full + ')'); }
    else if (it.type === 'particle' || it.type === 'pvwrite') { cat = 'Phrasal verbs — partykuły'; d = (extra.ans ? pvSplit(it.w).verb + ' ' + extra.ans + ' → ' : '') + it.w.answers[0] + ' (' + it.w.pl + ')'; }
    else if (it.type === 'translate') { cat = 'Tłumaczenie z polskiego'; d = (extra.ans ? extra.ans + ' → ' : '') + fullSentence(it); }
    else if (it.type === 'yg') { cat = 'Filmy — słuchanie'; d = extra.word || ''; }
    if (!cat) return;
    list.push({ at: Date.now(), id: it.id, cat, d });
    if (list.length > 600) list.splice(0, list.length - 600);
    if (S) S.mistakesN = (S.mistakesN || 0) + 1;
  }
  function mistakeGroups(days, offset) {
    const now = Date.now(), from = now - (days + offset) * U.DAY, to = now - offset * U.DAY, g = {};
    (D().mistakes || []).forEach(m => {
      if (m.at < from || m.at >= to) return;
      const x = g[m.cat] || (g[m.cat] = { cat: m.cat, n: 0, ids: [], ex: [] });
      x.n++;
      if (x.ids.indexOf(m.id) < 0) x.ids.push(m.id);
      if (m.d && x.ex.indexOf(m.d) < 0 && x.ex.length < 4) x.ex.push(m.d);
    });
    return Object.values(g).sort((a, b) => b.n - a.n);
  }
  function hardListHtml() {
    const ids = hardIds();
    if (!ids.length) return '';
    return '<section class="list-card raised"><div class="row between"><h2 style="font-size:22px">Oznaczone jako trudne <span class="small-note">(' + ids.length + ')</span></h2><button class="btn small primary" id="hardGo">Ćwicz trudne</button></div>' +
      '<p class="small-note" style="margin:0">Wracają ok. 2× częściej. Znacznik schodzi sam po 3 dobrych odpowiedziach w różne dni.</p><div class="col" style="gap:10px">' +
      ids.slice(0, 40).map(id => '<div class="list-item inset"><div style="min-width:0">' + itemLabel(id) + '</div><button class="btn small" data-unhard="' + esc(id) + '">Zdejmij</button></div>').join('') + '</div></section>';
  }
  function startCustomSession(ids, title) {
    const q = ids.filter(id => { const it = itemFor(id); return it && typeEnabled(it.type); }).slice(0, 20).map(id => ({ id, isNew: false }));
    if (!q.length) { toast('Brak elementów do ćwiczenia.'); return; }
    newSession({ custom: title, queue: U.shuffle(q) });
    go('exercise');
  }
  /* ---------- Dziennik: otwarte / opanowane ---------- */
  /* błąd jest „otwarty”, dopóki element nie dostanie dobrej odpowiedzi innego (późniejszego) dnia */
  function mistakeOpen(m) {
    const ok = (D().okAt || {})[m.id], day = U.dayKey(m.at);
    if (ok) return !(ok > m.at && U.dayKey(ok) !== day);
    const c = D().cards[m.id]; // stare wpisy (sprzed zapamiętywania dobrych odpowiedzi): powtórka innego dnia z odstępem > 1 dzień
    return !(c && c.last > m.at && U.dayKey(c.last) !== day && (c.ivl || 0) > 1 && c.state !== 'known') && !(c && c.state === 'known');
  }
  const MZ_SPECIFIC = /^(Mylisz|Gramatyka|Czasy|Phrasal)/;
  let mzTab = 'pat', mzRange = 30, mzOpenCat = null;
  function mzGroups(days, offset) {
    const now = Date.now(), from = now - (days + offset) * U.DAY, to = now - offset * U.DAY, g = {};
    (D().mistakes || []).forEach(m => {
      if (m.at < from || m.at >= to) return;
      const x = g[m.cat] || (g[m.cat] = { cat: m.cat, n: 0, items: {} });
      x.n++;
      const prev = x.items[m.id];
      if (!prev || m.at > prev.at) x.items[m.id] = m; // najnowszy błąd danego elementu
    });
    return Object.values(g).map(x => {
      const items = Object.values(x.items).sort((a, b) => b.at - a.at);
      const open = items.filter(mistakeOpen);
      return { cat: x.cat, n: x.n, items, open, openIds: open.map(m => m.id), specific: MZ_SPECIFIC.test(x.cat) };
    }).sort((a, b) => b.open.length - a.open.length || b.n - a.n);
  }
  function mzItemHtml(m) {
    const it = itemFor(m.id), typ = it && TYPES[it.type] ? TYPES[it.type].title : '';
    const d = String(m.d || ''), k = d.indexOf(' → ');
    const txt = k > 0 ? '<span class="mz-you">' + esc(d.slice(0, k)) + '</span> → <b>' + esc(d.slice(k + 3)) + '</b>' : esc(d);
    const open = mistakeOpen(m);
    return '<div class="mz-it' + (open ? '' : ' done') + '"><span class="small-note">' + new Date(m.at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) + (typ ? ' · ' + esc(typ) : '') + '</span>' +
      '<span lang="en">' + txt + '</span><span class="mz-st ' + (open ? 'open' : 'ok') + '">' + (open ? 'otwarte' : 'opanowane ✓') + '</span></div>';
  }
  function renderMistakes() {
    S = null;
    screen = 'mistakes';
    const all = mzRange >= 3650;
    const cur = mzGroups(mzRange, 0), prev = all ? [] : mzGroups(mzRange, mzRange);
    const prevMap = {}; prev.forEach(g => { prevMap[g.cat] = g.n; });
    const openIds = []; cur.forEach(g => g.openIds.forEach(id => { if (openIds.indexOf(id) < 0) openIds.push(id); }));
    const closed = cur.reduce((a, g) => a + g.items.length - g.open.length, 0);
    const tips = D().mistakeTips;
    const hardN = hardIds().length;
    const exN = explainList().length, fxN = Object.keys(D().fixes || {}).length, chN = (D().aiChats || []).filter(c => c.msgs && c.msgs.length).length;
    let k = 0;
    const order = cur.filter(g => g.specific).concat(cur.filter(g => !g.specific));
    const rowHtml = g => {
      const p = prevMap[g.cat] || 0, idx = order.indexOf(g), isOpen = mzOpenCat === g.cat;
      const trend = all ? '<span></span>' : !p ? '<span class="trend new">nowe</span>' : g.n > p ? '<span class="trend up">▲ częściej</span>' : g.n < p ? '<span class="trend down">▼ rzadziej</span>' : '<span class="trend eq">bez zmian</span>';
      const keyN = g.open.length ? ++k : 0;
      return '<div class="mz-row' + (isOpen ? ' open' : '') + '" data-mzcat="' + idx + '" role="button" tabindex="0" aria-expanded="' + isOpen + '">' +
        '<b><span class="chev">' + (isOpen ? '▾' : '▸') + '</span>' + esc(g.cat) + '</b>' +
        '<span class="n" title="otwarte / wszystkie elementy">' + g.open.length + ' <small>/ ' + g.items.length + '</small></span>' + trend +
        '<div class="mini inset"><div style="width:' + Math.round(g.open.length / Math.max(1, g.items.length) * 100) + '%"></div></div>' +
        (g.open.length ? '<button class="btn small primary" data-practice="' + idx + '">Ćwicz' + (keyN <= 9 ? ' ' + K(String(keyN)) : '') + '</button>' : '<span class="small-note mz-all">wszystko ✓</span>') + '</div>' +
        (isOpen ? '<div class="mz-items">' + g.items.slice(0, 30).map(mzItemHtml).join('') + (g.items.length > 30 ? '<div class="small-note">…i ' + (g.items.length - 30) + ' więcej</div>' : '') + '</div>' : '');
    };
    const spec = order.filter(g => g.specific), area = order.filter(g => !g.specific);
    const tab = (id, label) => '<button class="btn' + (mzTab === id ? ' on' : '') + '" role="tab" aria-selected="' + (mzTab === id) + '" data-mztab="' + id + '">' + label + '</button>';
    const rng = (d, label) => '<button class="btn' + (mzRange === d ? ' on' : '') + '" data-mzr="' + d + '">' + label + '</button>';
    let body = '';
    if (mzTab === 'pat') {
      body = stubListHtml() + (!cur.length
        ? '<section class="note flatbox"><div class="tx"><b>' + ((D().mistakes || []).length ? 'Brak błędów w tym okresie' : 'Jeszcze pusto') + '</b><span>Błędy z sesji i gier są tu grupowane we wzorce, np. „Mylisz słowa: borrow ↔ lend” albo „Gramatyka: since / for”.</span></div></section>'
        : (spec.length ? '<div class="mz-grp">Konkretne wzorce</div><section class="mz-box">' + spec.map(rowHtml).join('') + '</section>' : '') +
          (area.length ? '<div class="mz-grp">Obszary</div><section class="mz-box">' + area.map(rowHtml).join('') + '</section>' : '') +
          '<section class="list-card raised"><div class="row between"><h2 style="font-size:20px">Wskazówki od AI</h2>' +
          (AI.enabled() ? '<button class="btn small" id="aiTips">' + (tips ? 'Odśwież' : 'Poproś AI o analizę') + ' ' + K('A') + '</button>' : '<span class="small-note">wymaga klucza API w ustawieniach</span>') + '</div>' +
          (tips ? '<div id="tipsBox" class="tips">' + qaFmt(tips.text) + '<div class="small-note" style="margin-top:8px">z dnia ' + new Date(tips.at).toLocaleDateString('pl-PL') + '</div></div>' : '<div id="tipsBox"></div>') + '</section>');
    } else if (mzTab === 'hard') body = hardListHtml() || '<p class="small-note">Nic nie jest oznaczone jako trudne. Oznaczysz przyciskiem „Trudne” (T) po odpowiedzi.</p>';
    else if (mzTab === 'ex') body = explainsHtml() || '<p class="small-note">Brak zapisanych wyjaśnień. Powstają przyciskiem „Wyjaśnij” (E) po odpowiedzi.</p>';
    else if (mzTab === 'chat') body = aiChatsHtml() || '<p class="small-note">Brak rozmów. Przycisk „AI” jest w prawym dolnym rogu ekranu (Alt+Q).</p>';
    else body = fixesHtml() || '<p class="small-note">Brak poprawionych zdań.</p>';
    app.innerHTML =
      '<div class="wrap narrow mz">' + backHeader('Dziennik błędów', '') +
      '<section class="mz-top"><div><div class="big">' + openIds.length + ' ' + (openIds.length === 1 ? 'otwarty' : 'otwartych') + ' <span>· ' + closed + ' opanowanych · ' + (all ? 'od początku' : 'ostatnie ' + mzRange + ' dni') + '</span></div>' +
      '<div class="small-note" style="font-size:15px;margin-top:4px">' + (openIds.length ? 'Najwięcej otwartych: <b>' + esc(cur[0].cat) + '</b><br>' : '') + 'Błąd „zamyka się” po dobrej odpowiedzi innego dnia.</div></div>' +
      (openIds.length ? '<button class="btn primary big-cta" id="mzAll">Powtórz otwarte (' + Math.min(20, openIds.length) + ') ' + K('Enter') + '</button>' : '') + '</section>' +
      '<div class="mz-tabs"><div class="seg inset" role="tablist">' + tab('pat', 'Wzorce') + tab('hard', 'Trudne (' + hardN + ')') + tab('ex', 'Wyjaśnienia (' + exN + ')') + tab('fix', 'Poprawione zdania (' + fxN + ')') + (chN ? tab('chat', 'Rozmowy z AI (' + chN + ')') : '') + '</div>' +
      (mzTab === 'pat' ? '<div class="seg inset">' + rng(7, '7 dni') + rng(30, '30 dni') + rng(3650, 'wszystko') + '</div>' : '') + '</div>' +
      body + '</div>';
    $('#back').onclick = () => go('home');
    bindFixes();
    if ($('#mzAll')) $('#mzAll').onclick = () => startCustomSession(openIds, 'Otwarte błędy');
    if ($('#ubGo')) $('#ubGo').onclick = () => { const S0 = stubs(); startCustomSession(Object.keys(S0).filter(k => S0[k].state === 'active').map(k => 'stb:' + k + ':' + Math.floor(Math.random() * 6)), 'Uparte błędy'); };
    $$('[data-qacont]').forEach(b => b.onclick = () => qaOpen(b.dataset.qacont));
    $$('[data-mztab]').forEach(b => b.onclick = () => { mzTab = b.dataset.mztab; renderMistakes(); });
    $$('[data-mzr]').forEach(b => b.onclick = () => { mzRange = +b.dataset.mzr; mzOpenCat = null; renderMistakes(); });
    $$('[data-mzcat]').forEach(r => { const tog = () => { const g = order[+r.dataset.mzcat]; mzOpenCat = mzOpenCat === g.cat ? null : g.cat; renderMistakes(); }; r.onclick = e => { if (e.target.closest('button')) return; tog(); }; r.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tog(); } }; });
    if ($('#hardGo')) $('#hardGo').onclick = () => startCustomSession(hardIds(), 'Trudne');
    $$('[data-unhard]').forEach(b => b.onclick = () => { const x = D().cards[b.dataset.unhard]; if (x) { delete x.hard; delete x.hardOk; delete x.hardDay; Store.save(); } renderMistakes(); });
    $$('[data-practice]').forEach(b => b.onclick = e => { e.stopPropagation(); const g = order[+b.dataset.practice]; startCustomSession(g.openIds, 'Ćwiczenie: ' + g.cat); });
    const askAI = async () => {
      const box = $('#tipsBox'); if (!box) return;
      box.className = 'tips'; box.innerHTML = '<div class="checking"><span class="spinner"></span>AI analizuje Twoje błędy…</div>';
      try {
        const src = order.filter(g => g.open.length).concat(order.filter(g => !g.open.length));
        const text = await AI.analyzeMistakes(src.slice(0, 8).map(g => ({ cat: g.cat, n: g.open.length || g.n, ex: g.items.slice(0, 3).map(m => m.d) })));
        D().mistakeTips = { at: Date.now(), text }; Store.save();
        if (screen === 'mistakes') renderMistakes();
      } catch (e) { box.innerHTML = '<span class="status bad">' + esc(AI.humanError(e)) + '</span>'; }
    };
    if ($('#aiTips')) $('#aiTips').onclick = askAI;
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('home'); return; }
      if (typingInField()) return;
      if (e.key === 'Enter' && !onButton() && !(document.activeElement && document.activeElement.closest('[data-mzcat]')) && $('#mzAll')) { e.preventDefault(); $('#mzAll').click(); return; }
      if (plainKey(e, 'KeyA') && $('#aiTips')) { e.preventDefault(); askAI(); return; }
      if (!e.altKey && !e.ctrlKey && /^[1-9]$/.test(e.key) && mzTab === 'pat') {
        const btns = $$('[data-practice]'); const b = btns[+e.key - 1]; if (b) { e.preventDefault(); b.click(); }
      }
    };
  }


  /* ================= ZAPYTAJ AI — pytanie w dowolnym momencie ================= */
  const QA = { open: false, chat: null, busy: false, err: '', ctxOn: false, words: null, wsel: {}, wbusy: false, wmsg: '', openedAt: 0, listening: false, draft: '', pending: null };
  function qaAllowed() { return screen !== 'welcome' && screen !== 'test'; }
  function qaFabSync() {
    let b = document.getElementById('qaFab');
    if (!b) {
      b = document.createElement('button'); b.id = 'qaFab'; b.className = 'qa-fab'; b.type = 'button';
      b.title = 'Zapytaj AI (Alt+Q)'; b.setAttribute('aria-label', 'Zapytaj AI (Alt+Q)');
      b.innerHTML = '<svg viewBox="0 0 40 36" aria-hidden="true"><path d="M8 3h24a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H17l-7 6v-6H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><text x="20" y="19.5" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="12" fill="currentColor">AI</text></svg>';
      b.onclick = () => qaOpen();
      document.body.appendChild(b);
    }
    b.hidden = !qaAllowed() || QA.open;
  }
  /* zdanie z bieżącego ćwiczenia — przed odpowiedzią z luką (żeby nie zdradzać odpowiedzi) */
  function qaCtx() {
    try {
      if (screen !== 'exercise' || !S || !cur()) return null;
      const it = curView(cur()); if (!it) return null;
      if (S.phase === 'feedback') { const f = fullSentence(it); return f ? { show: f, send: f } : null; }
      if (it.w && it.w.s && ['cloze', 'choice', 'particle', 'pvwrite'].indexOf(it.type) >= 0) { const m = it.w.s.replace('_', '_____'); return { show: m, send: m + ' (Artur jeszcze nie odpowiedział — nie podawaj brakującego słowa wprost)' }; }
      return null;
    } catch (e) { return null; }
  }
  function qaFmt(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>').replace(/\n/g, '<br>');
  }
  function qaTranscript(chat) { return (chat.msgs || []).map(m => 'ARTUR: ' + m.q + (m.ctx ? ' [zdanie: ' + m.ctx + ']' : '') + '\nNAUCZYCIEL: ' + m.a).join('\n\n'); }
  function qaOpen(chatId) {
    if (!qaAllowed()) return;
    if (chatId) { const c = (D().aiChats || []).find(x => x.id === chatId); if (c) { QA.chat = c; QA.words = null; QA.wmsg = ''; } }
    QA.open = true; QA.openedAt = Date.now(); QA.err = '';
    if (S && S.listening) Recog.stop();
    renderQA(); qaFabSync();
    setTimeout(() => { const i = document.getElementById('qaIn'); if (i) i.focus(); }, 30);
  }
  function qaClose(silent) {
    if (!QA.open) return;
    QA.open = false;
    if (QA.listening) { Recog.stop(); QA.listening = false; }
    if (S && S.phase === 'answer' && S.cardStart) S.cardStart += Date.now() - QA.openedAt; // czas w panelu nie liczy się do czasu odpowiedzi
    const el = document.getElementById('qaPanel'); if (el) el.remove();
    qaFabSync();
    if (!silent && screen === 'exercise' && S) { const a = document.getElementById('ans'); if (a && !a.disabled) a.focus(); }
  }
  function renderQA() {
    if (!QA.open) return;
    let el = document.getElementById('qaPanel');
    const draft = (document.getElementById('qaIn') || {}).value; if (draft != null) QA.draft = draft;
    if (!el) { el = document.createElement('aside'); el.id = 'qaPanel'; el.className = 'qa-panel'; el.setAttribute('aria-label', 'Zapytaj AI'); document.body.appendChild(el); }
    const msgs = QA.chat ? QA.chat.msgs : [];
    const ctx = qaCtx();
    let move = '';
    if (msgs.length) {
      if (QA.words) {
        const n = QA.words.filter((w, i) => QA.wsel[i]).length;
        move = '<div class="qa-words"><div class="small-note">Zaznacz, co dodać do Moich słówek:</div>' +
          QA.words.map((w, i) => '<label class="check qa-w"><input type="checkbox" data-qaw="' + i + '"' + (QA.wsel[i] ? ' checked' : '') + '> <span><b lang="en">' + esc(w.word) + '</b> — ' + esc(w.pl) + '<br><span class="small-note" lang="en">' + esc(w.sentence) + '</span></span></label>').join('') +
          '<div class="row" style="gap:10px;justify-content:flex-end"><button class="btn small" id="qaWCancel">Anuluj</button><button class="btn small primary" id="qaWAdd"' + (n ? '' : ' disabled') + '>Dodaj zaznaczone (' + n + ')</button></div></div>';
      } else move = '<div class="small-note">Przenieś rozmowę do nauki:</div><div class="qa-to"><button class="btn" id="qaWords"' + (QA.wbusy ? ' disabled' : '') + '>' + (QA.wbusy ? '<span class="spinner"></span> Szukam słów…' : 'Dodaj słowa do nauki') + '</button><button class="btn" id="qaTopic">Zrób z tego ćwiczenia</button></div>';
      if (QA.wmsg) move += '<div class="small-note qa-wmsg">' + esc(QA.wmsg) + '</div>';
    }
    el.innerHTML =
      '<div class="qa-head"><b>Zapytaj AI</b><div class="row" style="gap:8px">' + (msgs.length ? '<button class="btn small" id="qaNew">Nowa rozmowa</button>' : '') + '<button class="btn small" id="qaX">Zamknij ' + K('Esc') + '</button></div></div>' +
      '<div class="qa-msgs" id="qaMsgs">' +
      (!msgs.length && !QA.pending ? '<div class="small-note qa-hint">Zapytaj o cokolwiek: różnicę między słowami, jak coś powiedzieć po angielsku, gramatykę… Rozmowę możesz potem zamienić w słówka albo ćwiczenia.' + (AI.enabled() ? '' : '<br><b>Wymaga klucza API w Ustawieniach.</b>') + '</div>' : '') +
      msgs.map(m => '<div class="qa-q">' + (m.ctx ? '<span class="qa-qctx">📎 ' + esc(m.ctx.replace(/ \(Artur jeszcze.*$/, '')) + '</span>' : '') + esc(m.q) + '</div><div class="qa-a">' + qaFmt(m.a) + '<div class="qa-m">' + aiTag(m.m) + '</div></div>').join('') +
      (QA.pending ? '<div class="qa-q">' + esc(QA.pending.q) + '</div><div class="checking"><span class="spinner"></span>AI odpowiada…</div>' : '') + '</div>' +
      (QA.err ? '<div class="status bad">' + esc(QA.err) + '</div>' : '') + move +
      (ctx ? (QA.ctxOn ? '<div class="qa-chip">📎 <span>' + esc(ctx.show) + '</span><button class="btn small" id="qaCtxOff" aria-label="Odłącz zdanie">×</button></div>' : '<button class="btn small qa-ctxbtn" id="qaCtxOn">+ dołącz bieżące zdanie <span class="small-note">„' + esc(ctx.show.length > 40 ? ctx.show.slice(0, 40) + '…' : ctx.show) + '”</span></button>') : '') +
      '<textarea id="qaIn" class="txt qa-input" rows="2" placeholder="Zapytaj o cokolwiek po polsku albo angielsku…"' + (QA.busy ? ' disabled' : '') + '>' + esc(QA.draft || '') + '</textarea>' +
      '<div class="qa-in">' + (Recog.supported() ? '<button class="btn' + (QA.listening ? ' primary' : '') + '" id="qaMic">' + IC.micSm + ' ' + (QA.listening ? 'Słucham…' : 'Mów') + ' ' + K('Alt+M') + '</button>' : '') +
      '<button class="btn primary" id="qaSend"' + (QA.busy ? ' disabled' : '') + '>Wyślij ' + K('Enter') + '</button></div>';
    const on = (id, f) => { const b = document.getElementById(id); if (b) b.onclick = f; };
    on('qaX', () => qaClose());
    on('qaNew', () => { QA.chat = null; QA.words = null; QA.wmsg = ''; QA.err = ''; QA.ctxOn = false; renderQA(); });
    on('qaSend', qaSend);
    on('qaMic', qaMic);
    on('qaCtxOn', () => { QA.ctxOn = true; renderQA(); });
    on('qaCtxOff', () => { QA.ctxOn = false; renderQA(); });
    on('qaWords', qaWords);
    on('qaTopic', qaTopic);
    on('qaWCancel', () => { QA.words = null; renderQA(); });
    on('qaWAdd', qaWordsAdd);
    el.querySelectorAll('[data-qaw]').forEach(cb => cb.onchange = () => { QA.wsel[+cb.dataset.qaw] = cb.checked; renderQA(); });
    const box = document.getElementById('qaMsgs'); if (box) box.scrollTop = box.scrollHeight;
    const inp = document.getElementById('qaIn'); if (inp && !QA.busy && document.activeElement !== inp && !QA.words) inp.focus();
  }
  async function qaSend() {
    const inp = document.getElementById('qaIn'); const q = ((inp && inp.value) || '').trim();
    if (!q || QA.busy) return;
    if (!AI.enabled()) { QA.err = 'Najpierw wpisz klucz API w Ustawieniach.'; renderQA(); return; }
    if (QA.listening) { Recog.stop(); QA.listening = false; }
    if (!QA.chat) {
      QA.chat = { id: Date.now().toString(36), at: Date.now(), msgs: [] };
      const L2 = D().aiChats = D().aiChats || []; L2.push(QA.chat); if (L2.length > 50) L2.splice(0, L2.length - 50);
    }
    const c = QA.ctxOn ? qaCtx() : null, ctx = c ? c.send : '';
    QA.pending = { q }; QA.busy = true; QA.err = ''; QA.draft = ''; QA.wmsg = ''; if (inp) inp.value = '';
    renderQA();
    const chat = QA.chat;
    try {
      const a = await AI.askFree(chat.msgs, q, ctx, L[levels().vocab]);
      chat.msgs.push({ q, a, m: AI.lastModel(), ctx: c ? c.show : '' }); chat.at = Date.now(); Store.save();
      QA.ctxOn = false;
    } catch (e) { QA.err = AI.humanError(e); QA.draft = q; }
    QA.pending = null; QA.busy = false;
    renderQA();
  }
  function qaMic() {
    if (!Recog.supported() || QA.busy) return;
    if (QA.listening) { Recog.stop(); return; }
    QA.listening = true; renderQA();
    Recog.listen({
      silenceMs: 3000, lang: 'pl-PL',
      onInterim: t => { const i = document.getElementById('qaIn'); if (i) i.value = t; },
      onResult: alts => { QA.listening = false; QA.draft = alts[0] || ''; const i = document.getElementById('qaIn'); if (i) i.value = QA.draft; renderQA(); },
      onError: err => { QA.listening = false; if (err !== 'aborted') QA.err = recogMsg(err); renderQA(); }
    });
  }
  async function qaWords() {
    if (!QA.chat || QA.wbusy) return;
    QA.wbusy = true; QA.wmsg = ''; renderQA();
    try {
      const items = await AI.chatWords(qaTranscript(QA.chat), L[levels().vocab]);
      if (!items.length) QA.wmsg = 'AI nie znalazło w tej rozmowie słów do nauki.';
      else { QA.words = items; QA.wsel = {}; items.forEach((x, i) => { QA.wsel[i] = true; }); }
    } catch (e) { QA.wmsg = AI.humanError(e); }
    QA.wbusy = false; renderQA();
  }
  function qaWordsAdd() {
    if (!QA.words) return;
    let ok = 0, base = 0; const errs = [];
    QA.words.forEach((w, i) => {
      if (!QA.wsel[i]) return;
      const low = w.word.trim().toLowerCase(), bw = WORDS.list.find(x => x.answers.some(a => a.toLowerCase() === low));
      if (bw) { const k = D().cards[bw.id]; if (k && k.state === 'known') delete D().cards[bw.id]; playMiss(bw.id); base++; return; } // słowo z bazy — do najbliższej sesji
      const e = addCustom(w.word, w.pl, w.sentence, { extra: { fromChat: 1 } }); if (e) errs.push(e); else ok++;
    });
    Store.save();
    QA.words = null;
    QA.wmsg = (ok || base ? (ok ? 'Dodano do Moich słówek: ' + ok + '. ' : '') + (base ? 'Ze słownika programu do najbliższej sesji: ' + base + '.' : '') : 'Nic nie dodano.') + (errs.length ? ' ' + errs.slice(0, 2).join(' ') : '');
    renderQA();
  }
  function qaTopic() {
    if (!QA.chat || !QA.chat.msgs.length) return;
    if (!AI.enabled()) return;
    const ret = screen === 'exercise' && S ? S : null;
    if (ret) { if (S.listening) Recog.stop(); S.paused = true; }
    const chat = QA.chat;
    qaClose(true);
    D().topics = D().topics || {};
    TPX = { tid: null, base: 'chat:' + chat.id, ret, busy: false, err: '', ctx: { free: qaTranscript(chat), task: 'Rozmowa z AI', correct: '', sentence: '' }, word: '', wordPl: '' };
    TPX.focus = 'Temat: to, o co Artur pytał w tej rozmowie (najważniejsze słowo, zwrot albo konstrukcja). Omów to na przykładach z rozmowy.';
    TPX.tid = topicIdFor(TPX.base + '|' + chat.msgs.length);
    go('topic');
    if (!D().topics[TPX.tid]) loadTopic(TPX.tid, TPX.ctx);
  }
  window.addEventListener('keydown', e => {
    if (document.querySelector('.hk-pop') && !QA.open) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); hookClose(); return; }
      if (document.activeElement && document.activeElement.classList.contains('hk-in')) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const b = document.querySelector('[data-hk="save"]'); if (b) b.click(); } e.stopImmediatePropagation(); return; }
    }
    if (QA.open) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); qaClose(); return; }
      if (e.altKey && e.code === 'KeyM') { e.preventDefault(); e.stopImmediatePropagation(); qaMic(); return; }
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement && document.activeElement.id === 'qaIn') { e.preventDefault(); e.stopImmediatePropagation(); qaSend(); return; }
      e.stopImmediatePropagation(); // skróty programu nie działają, gdy panel jest otwarty
      return;
    }
    const q = (e.key === '?' && !e.ctrlKey && !e.altKey && !typingInField()) || (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyQ');
    if (q && !document.querySelector('.overlay') && qaAllowed()) { e.preventDefault(); e.stopImmediatePropagation(); qaOpen(); }
  }, true);
  function aiChatsHtml() {
    const L2 = (D().aiChats || []).filter(c => c.msgs && c.msgs.length).slice().sort((a, b) => b.at - a.at);
    if (!L2.length) return '';
    return '<section class="list-card raised"><h2 style="font-size:22px">Rozmowy z AI</h2><p class="small-note desc" style="margin:0">Pytania zadane przyciskiem „AI” w rogu ekranu (Alt+Q). Kliknij, żeby rozwinąć; „Kontynuuj” otwiera rozmowę w panelu.</p>' +
      L2.slice(0, 30).map(c => '<details class="exsaved inset"><summary><b>' + esc(c.msgs[0].q.length > 70 ? c.msgs[0].q.slice(0, 70) + '…' : c.msgs[0].q) + '</b> <span class="small-note">· ' + new Date(c.at).toLocaleDateString('pl-PL') + ' · ' + c.msgs.length + ' pyt.</span></summary>' +
        c.msgs.map(m => '<div class="qa-item"><div class="q">' + esc(m.q) + '</div><div class="a">' + qaFmt(m.a) + ' <span class="small-note">' + mdlTag(m.m) + '</span></div></div>').join('') +
        '<div class="row" style="justify-content:flex-end"><button class="btn small" data-qacont="' + esc(c.id) + '">Kontynuuj</button></div></details>').join('') + '</section>';
  }

  /* ---------- Moje słówka ---------- */
  function addCustom(word, pl, sentence, opts) {
    opts = opts || {};
    word = (word || '').trim(); pl = (pl || '').trim(); sentence = (sentence || '').trim().replace(/\s+/g, ' ');
    if (!word) return 'Wpisz angielskie słowo.';
    if (!pl) return 'Wpisz polskie znaczenie słowa „' + word + '”.';
    if (!sentence) return 'Wpisz zdanie ze słowem „' + word + '” albo wymyśl je z AI.';
    if (sentence.indexOf('_') >= 0) return 'Zdanie nie może zawierać znaku „_”.';
    const re = new RegExp('(^|[^A-Za-z\'])(' + escapeRe(word) + ')(?![A-Za-z])', 'i');
    const m = sentence.match(re);
    if (!m) return 'Zdanie musi zawierać „' + word + '” dokładnie w tej formie.';
    const idx = m.index + m[1].length;
    const s = sentence.slice(0, idx) + '_' + sentence.slice(idx + word.length);
    const low = word.toLowerCase();
    if (WORDS.list.some(w => w.answers.some(a => a.toLowerCase() === low))) return '„' + word + '” już jest w bazie — pojawi się w nauce.';
    let id = (opts.prefix || 'c-') + (slugify(word) || Date.now().toString(36));
    if (WORDS.byId[id]) id += '-' + Date.now().toString(36);
    D().custom = D().custom || {};
    D().custom[id] = Object.assign({ answers: [word], pl, s, lvl: opts.lvl != null ? opts.lvl : levels().vocab, added: Date.now() }, opts.extra || {});
    registerCustom(); progress(); Store.save();
    return null;
  }
  function customStatus(id) {
    const c = D().cards[id];
    if (!c) return ['nowe', ''];
    if (c.state === 'known') return ['znane', 'ok'];
    return [(c.s || 0) >= 10 ? 'opanowane' : 'w nauce', (c.s || 0) >= 10 ? 'ok' : ''];
  }
  /* ---------- Mój słownik: książka z zakładkami A–Z (wszystkie poznane słowa) ---------- */
  let wTab = 'dict';
  const BK = { letter: null, page: 0, q: '', open: null };
  const BK_PER = 30;
  function bkHead(w) { return w.answers[0].replace(/^(to|a|an|the)\s+/i, ''); }
  function bkStat(id) { const c = D().cards[id]; return !c ? null : c.state === 'known' ? 'known' : ((c.s || 0) >= 10 || c.mastered || wordLv(id) >= 5) ? 'mast' : 'learn'; }
  function bkWords() { const c = D().cards; return WORDS.list.filter(w => c[w.id]); }
  function bookHtml() {
    const all = bkWords(), by = {}, L2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    all.forEach(w => { const ch = (bkHead(w)[0] || '').toUpperCase(); if (L2.indexOf(ch) >= 0) (by[ch] = by[ch] || []).push(w); });
    if (!BK.letter || !by[BK.letter]) BK.letter = L2.find(x => by[x]) || 'A';
    const q = BK.q.trim().toLowerCase();
    let list = q ? all.filter(w => w.answers.some(a => a.toLowerCase().indexOf(q) >= 0) || (w.pl || '').toLowerCase().indexOf(q) >= 0) : (by[BK.letter] || []);
    list = list.slice().sort((a, b) => bkHead(a).localeCompare(bkHead(b), 'en'));
    const pages = Math.max(1, Math.ceil(list.length / BK_PER)); BK.page = Math.min(BK.page, pages - 1);
    const show = list.slice(BK.page * BK_PER, BK.page * BK_PER + BK_PER), cc = D().cards;
    const COL = { mast: '#5E9670', known: '#7E98BE', learn: '#D3A35C' }, NAME = { mast: 'opanowane', known: 'znane („Umiem to”)', learn: 'w nauce' };
    const fd = t => t ? new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: '2-digit' }) : '';
    const ent = show.map(w => {
      const st = bkStat(w.id), c = cc[w.id], open = BK.open === w.id, hasS = (w.s || '').indexOf('_') >= 0, [a, b2] = hasS ? splitSentence(w.s) : ['', ''];
      const since = st === 'known' ? 'znane od ' + fd(c.knownAt) : st === 'mast' ? 'opanowane' + (c.added ? ' · w nauce od ' + fd(c.added) : '') : 'w nauce' + (c.added ? ' od ' + fd(c.added) : '');
      return '<div class="bk-e' + (open ? ' open' : '') + '"><i style="background:' + COL[st] + '" title="' + NAME[st] + '"></i>' +
        '<button class="bk-spk" data-bksay="' + esc(w.id) + '" title="Posłuchaj" aria-label="Posłuchaj ' + esc(w.answers[0]) + '">' + IC.speaker + '</button>' +
        '<button class="bk-w" data-bkopen="' + esc(w.id) + '"><b lang="en">' + esc(w.answers[0]) + '</b> <span>— ' + esc(w.pl) + '</span></button><small>' + (L[w.lvl] || '') + '</small>' +
        (open ? '<div class="bk-act"><span class="small-note">' + since + (hasS ? ' · <i lang="en">' + esc(a) + '<b>' + esc(w.answers[0]) + '</b>' + esc(b2) + '</i>' : '') + '</span>' +
          (st !== 'learn' ? '<button class="btn raised" data-bkback="' + esc(w.id) + '">Przywróć do nauki</button>' : '<span class="small-note">już w nauce</span>') + '</div>' : '') + '</div>';
    }).join('');
    const tabs = L2.map(x => { const k = (by[x] || []).length; return '<button class="bk-tab' + (!q && x === BK.letter ? ' on' : '') + (k ? '' : ' empty') + '"' + (k ? ' data-bkl="' + x + '"' : ' disabled') + ' title="' + x + ': ' + k + '">' + x + (k ? '<small>' + k + '</small>' : '') + '</button>'; }).join('');
    const pager = pages > 1 ? '<div class="bk-pg"><button class="btn raised" id="bkPrev"' + (BK.page ? '' : ' disabled') + ' aria-label="Poprzednia strona">‹</button><span>strona ' + (BK.page + 1) + ' z ' + pages + '</span><button class="btn raised" id="bkNext"' + (BK.page < pages - 1 ? '' : ' disabled') + ' aria-label="Następna strona">›</button></div>' : '';
    return '<div class="book"><div class="bk-page">' +
      (q ? '<h3 class="bk-q">„' + esc(BK.q.trim()) + '”</h3><div class="bk-sub">' + (list.length ? 'znaleziono ' + list.length : 'nic nie znaleziono — może jeszcze tego słowa nie poznałeś') + '</div>'
        : '<h3>' + BK.letter + '<span>' + BK.letter.toLowerCase() + '</span></h3><div class="bk-sub">' + list.length + ' ' + (list.length === 1 ? 'słowo' : 'słów') + ' na literę ' + BK.letter + ' · kliknij słowo — szczegóły i „Przywróć do nauki”</div>') +
      (all.length ? '<div class="bk-cols">' + ent + '</div>' : '<p class="small-note">Słownik zapełni się, gdy zaczniesz się uczyć — każde poznane słowo trafi tutaj.</p>') + pager + '</div>' +
      '<div class="bk-tabs">' + tabs + '</div></div>';
  }
  function bookTop() {
    const all = bkWords(), mon = mondayOf(Date.now()), cc = D().cards;
    const wk = all.filter(w => (cc[w.id].added || 0) >= mon || (cc[w.id].knownAt || 0) >= mon).length;
    return '<div class="bk-top"><div class="bk-big">' + fmtNum(all.length) + ' <span>' + (all.length === 1 ? 'słowo' : 'słów') + ' w Twoim słowniku' + (wk ? ' · +' + wk + ' w tym tygodniu' : '') + '</span></div>' +
      '<div class="bk-lg"><span><i style="background:#5E9670"></i>opanowane</span><span><i style="background:#7E98BE"></i>znane („Umiem to”)</span><span><i style="background:#D3A35C"></i>w nauce</span></div>' +
      '<input class="bk-search" id="bkQ" placeholder="Szukaj słowa…" autocomplete="off" spellcheck="false" value="' + esc(BK.q) + '"></div>';
  }
  function bindBook() {
    const r = () => { $('#bkBox').innerHTML = bookHtml(); bindBook(); };
    $$('[data-bkl]').forEach(b => b.onclick = () => { BK.letter = b.dataset.bkl; BK.page = 0; BK.open = null; BK.q = ''; const qi = $('#bkQ'); if (qi) qi.value = ''; r(); });
    $$('[data-bkopen]').forEach(b => b.onclick = () => { BK.open = BK.open === b.dataset.bkopen ? null : b.dataset.bkopen; r(); });
    $$('[data-bksay]').forEach(b => b.onclick = () => { const w = WORDS.byId[b.dataset.bksay]; if (w) Speech.speak(w.answers[0], D().settings.rate || 0.95); });
    $$('[data-bkback]').forEach(b => b.onclick = () => {
      const id = b.dataset.bkback, d = D(), w = WORDS.byId[id];
      if (d.cards[id] && d.cards[id].state === 'known') {
        knownFamily(id).concat([id]).forEach(x => { const c = d.cards[x]; if (!c || c.state !== 'known') return; if (!c.reps) delete d.cards[x]; else d.cards[x] = Object.assign({}, c, { state: 'review', due: Date.now() }); });
      } else if (d.cards[id]) d.cards[id] = Object.assign({}, d.cards[id], { due: Date.now() });
      progress(); Store.save(); BK.open = null; r(); toast('„' + (w ? w.answers[0] : id) + '” — wróci w najbliższej sesji.');
    });
    if ($('#bkPrev')) $('#bkPrev').onclick = () => { BK.page--; BK.open = null; r(); };
    if ($('#bkNext')) $('#bkNext').onclick = () => { BK.page++; BK.open = null; r(); };
  }
  let ownPage = 0;
  const OWN_PER = 14;
  function ownListHtml(ids) {
    const cust = D().custom || {}, pages = Math.max(1, Math.ceil(ids.length / OWN_PER)); ownPage = Math.min(ownPage, pages - 1);
    const COL = { 'nowe': '#CFC9C1', 'w nauce': '#D3A35C', 'opanowane': '#5E9670', 'znane': '#7E98BE' };
    const rows = ids.slice(ownPage * OWN_PER, ownPage * OWN_PER + OWN_PER).map(id => {
      const c = cust[id], st2 = customStatus(id);
      const tag = c.textId ? 'z tekstu: ' + esc(c.textTitle || '') : c.ai ? 'od AI' : '';
      return '<div class="bk-e own-e"><i style="background:' + COL[st2[0]] + '" title="' + st2[0] + '"></i>' +
        '<button class="bk-spk" data-ownsay="' + esc(id) + '" title="Posłuchaj">' + IC.speaker + '</button>' +
        '<div class="own-tx"><b lang="en">' + esc(c.answers[0]) + '</b> <span>— ' + esc(c.pl) + '</span>' + (tag ? ' <em class="src-tag">' + tag + '</em>' : '') +
        '<div class="own-s" lang="en">' + esc(c.s.replace('_', c.answers[0])) + '</div></div>' +
        '<span class="own-r"><small>' + (L[c.lvl] || '') + '</small><button class="own-del" data-del="' + esc(id) + '" title="Usuń" aria-label="Usuń ' + esc(c.answers[0]) + '">×</button></span></div>';
    }).join('');
    return '<div class="own-list">' + rows + '</div>' + (pages > 1 ? '<div class="bk-pg"><button class="btn raised" id="owPrev"' + (ownPage ? '' : ' disabled') + '>‹</button><span>strona ' + (ownPage + 1) + ' z ' + pages + '</span><button class="btn raised" id="owNext"' + (ownPage < pages - 1 ? '' : ' disabled') + '>›</button></div>' : '');
  }
  function basketsHtml() {
    const ws = D().wsc || {}, c = D().cards, now = U.startOfDay(), end = endOfToday();
    const words = WORDS.list.filter(w => c[w.id]);
    const grp = [[], [], [], []];
    words.forEach(w => { const b = basketOf(w.id), k = c[w.id]; grp[k.state === 'known' ? 3 : b].push(w); });
    const due = b => grp[b].filter(w => (ws[w.id] || {}).bd && ws[w.id].bd < end).length;
    const soon = b => { const t = grp[b].map(w => (ws[w.id] || {}).bd).filter(Boolean).sort((a, x) => a - x)[0]; return t ? new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) : '—'; };
    const box = (b, h, sm, nx) => '<div class="bk-box bk' + b + '"><h3>' + h + '</h3><small>' + sm + '</small><div class="n">' + fmtNum(grp[b].length) + '</div><div class="nx">' + nx + '</div></div>';
    const nUm = grp[3].filter(w => c[w.id].state === 'known').length;
    const list = grp[1].concat(grp[2]).concat(grp[0].filter(w => wordLv(w.id) > 0)).sort((a, x) => (basketOf(x.id) - basketOf(a.id)) || wordLv(x.id) - wordLv(a.id)).slice(0, 60);
    return '<section class="bk-wrap2"><div class="bk-grid">' +
      box(0, '1 · Nauka', 'zbierasz 5 kropek (max 1 dziennie)', 'w nauce: ' + grp[0].length) +
      box(1, '2 · Tydzień', 'sprawdzenie po 7 dniach', 'dziś wraca: ' + due(1) + ' · najbliższe: ' + soon(1)) +
      box(2, '3 · Miesiąc', 'sprawdzenie po 30 dniach', 'dziś wraca: ' + due(2) + ' · najbliższe: ' + soon(2)) +
      box(3, 'Znam ✓', 'kontrola raz na pół roku', nUm ? 'w tym ' + fmtNum(nUm) + ' z „Umiem to”' : '&nbsp;') + '</div>' +
      '<div class="bk-list">' + list.map(w => { const b = basketOf(w.id), r = ws[w.id] || {};
        return '<div class="bk-row"><b>' + esc(w.answers[0]) + '</b><span class="small-note">' + esc(w.pl) + '</span>' + wordDots(w.id) + '<small>' + (b ? BASKET_NAME[b] + (r.bd ? ' · wraca ' + new Date(r.bd).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) : '') : 'nauka · ' + wordLv(w.id) + '/5') + '</small></div>'; }).join('') + '</div></section>';
  }
  function renderWords(tab) {
    if (!(Store.today().ty || {}).words) { bumpUse('words'); Store.save(); }
    S = null;
    if (tab) wTab = tab;
    const nOwn = Object.keys(D().custom || {}).length;
    if (wTab === 'dict') {
      app.innerHTML = '<div class="wrap bk-wrap">' +
        '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b style="font-size:26px">Moje słówka</b></div>' +
        '<div class="seg inset" role="tablist"><button class="btn on" role="tab" aria-selected="true">Mój słownik (' + fmtNum(bkWords().length) + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="own">Moje własne (' + nOwn + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="rev">Przegląd</button><button class="btn" role="tab" aria-selected="false" data-wtab="bk">Koszyki</button></div></header>' +
        bookTop() + '<div id="bkBox">' + bookHtml() + '</div></div>';
      $('#back').onclick = () => go('home');
      $$('[data-wtab]').forEach(b => b.onclick = () => renderWords(b.dataset.wtab));
      const qi = $('#bkQ'); qi.oninput = () => { BK.q = qi.value; BK.page = 0; BK.open = null; $('#bkBox').innerHTML = bookHtml(); bindBook(); };
      bindBook();
      keyHandler = e => {
        if (e.key === 'Escape') { e.preventDefault(); if (BK.q) { BK.q = ''; qi.value = ''; $('#bkBox').innerHTML = bookHtml(); bindBook(); return; } go('home'); return; }
        if (document.activeElement && document.activeElement.id === 'bkQ') return;
        if (e.key === 'ArrowRight' && $('#bkNext') && !$('#bkNext').disabled) { e.preventDefault(); $('#bkNext').click(); }
        if (e.key === 'ArrowLeft' && $('#bkPrev') && !$('#bkPrev').disabled) { e.preventDefault(); $('#bkPrev').click(); }
      };
      return;
    }
    if (wTab === 'bk') {
      app.innerHTML = '<div class="wrap bk-wrap">' +
        '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b style="font-size:26px">Moje słówka</b></div>' +
        '<div class="seg inset" role="tablist"><button class="btn" role="tab" aria-selected="false" data-wtab="dict">Mój słownik (' + fmtNum(bkWords().length) + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="own">Moje własne (' + nOwn + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="rev">Przegląd</button><button class="btn on" role="tab" aria-selected="true">Koszyki</button></div></header>' +
        basketsHtml() + '</div>';
      $('#back').onclick = () => go('home');
      $$('[data-wtab]').forEach(b => b.onclick = () => renderWords(b.dataset.wtab));
      keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); go('home'); } };
      return;
    }
    if (wTab === 'rev') {
      app.innerHTML = '<div class="wrap bk-wrap">' +
        '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b style="font-size:26px">Moje słówka</b></div>' +
        '<div class="seg inset" role="tablist"><button class="btn" role="tab" aria-selected="false" data-wtab="dict">Mój słownik (' + fmtNum(bkWords().length) + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="own">Moje własne (' + nOwn + ')</button><button class="btn on" role="tab" aria-selected="true">Przegląd</button><button class="btn" role="tab" aria-selected="false" data-wtab="bk">Koszyki</button></div></header>' +
        '<section class="st-f vm">' + vocabMapHtml() + '</section></div>';
      $('#back').onclick = () => go('home');
      $$('[data-wtab]').forEach(b => b.onclick = () => renderWords(b.dataset.wtab));
      $$('[data-sweep]').forEach(b => b.onclick = () => startSweep(+b.dataset.sweep, 'words'));
      if ($('#pvPlay')) $('#pvPlay').onclick = () => startPlay('particle');
      if ($('#pvSweep')) $('#pvSweep').onclick = () => startSweep('pv', 'words');
      keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); go('home'); } };
      return;
    }
    const cust = D().custom || {};
    const ids = Object.keys(cust).sort((a, b) => cust[b].added - cust[a].added);
    const ai = AI.enabled();
    app.innerHTML =
      '<div class="wrap bk-wrap">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b style="font-size:26px">Moje słówka</b></div>' +
      '<div class="seg inset" role="tablist"><button class="btn" role="tab" aria-selected="false" data-wtab="dict">Mój słownik (' + fmtNum(bkWords().length) + ')</button><button class="btn on" role="tab" aria-selected="true">Moje własne (' + nOwn + ')</button><button class="btn" role="tab" aria-selected="false" data-wtab="rev">Przegląd</button><button class="btn" role="tab" aria-selected="false" data-wtab="bk">Koszyki</button></div></header>' +
      '<div class="own-col">' +
      '<section class="set-card raised"><h2>Dodaj słowo</h2>' +
      '<div class="field"><label for="cw">Po angielsku</label><div class="ctl"><input id="cw" class="txt" autocomplete="off" spellcheck="false" placeholder="np. take for granted"></div></div>' +
      '<div class="field"><label for="cp">Po polsku</label><div class="ctl"><input id="cp" class="txt" autocomplete="off" placeholder="' + (ai ? 'opcjonalnie — AI uzupełni' : 'znaczenie') + '"></div></div>' +
      '<div class="field"><label for="cs">Zdanie z tym słowem</label><div class="ctl"><input id="cs" class="txt" autocomplete="off" spellcheck="false" placeholder="' + (ai ? 'opcjonalnie — AI wymyśli' : 'np. We often take clean water for granted.') + '"></div></div>' +
      '<div class="row" style="justify-content:flex-end">' + (ai ? '<button class="btn" id="cAi">Wymyśl zdanie z AI ' + K('Alt+G') + '</button>' : '') + '<button class="btn primary" id="cAdd">Dodaj ' + K('Enter') + '</button></div>' +
      '<div id="cMsg" class="small-note"></div></section>' +
      '<section class="set-card raised"><h2>Dodaj wiele naraz</h2>' +
      (ai
        ? '<p class="small-note desc" style="margin:0">Jedno słowo w linii. Możesz dopisać znaczenie po myślniku, np. <i>deadline - termin</i>. AI doda zdania (do 25 słów naraz).</p>' +
          '<textarea id="bulk" class="txt area" rows="5" spellcheck="false" placeholder="commute&#10;get along with - dogadywać się&#10;awkward"></textarea>' +
          '<div class="row" style="justify-content:flex-end"><button class="btn primary" id="bAdd">Dodaj wszystkie</button></div><div id="bMsg" class="small-note"></div>'
        : '<p class="small-note" style="margin:0">Z kluczem API możesz wkleić całą listę słów, a AI doda do nich znaczenia i zdania.</p>') +
      '</section>' +
      (ai ? '<section class="set-card raised"><h2>Nowe słowa od AI</h2><p class="small-note" style="margin:0">Gdy na Twoim poziomie (' + L[levels().vocab] + ') zostaje mniej niż 30 nieznanych słów, program sam raz dziennie dobiera 30 nowych. Możesz to zrobić też teraz.</p>' +
        '<div class="row between"><span class="small-note">Nieznanych słów na poziomie ' + L[levels().vocab] + ': <b>' + WORDS.list.filter(w => w.lvl === levels().vocab && !D().cards[w.id]).length + '</b></span><button class="btn" id="topUp">Dobierz 30 nowych słów</button></div><div id="tuMsg"></div></section>' : '') +
      '<section class="set-card raised"><h2>Twoje słowa (' + ids.length + ')</h2>' +
      (ids.length
        ? '<p class="small-note desc" style="margin:0">Własne słowa i słowa z tekstów mają pierwszeństwo przed bazą. Słowa od AI wchodzą razem z bazą, według poziomu.</p>' + ownListHtml(ids)
        : '<p class="small-note" style="margin:0">Jeszcze nic. Dodane słowa pojawią się w sesjach i wszystkich grach.</p>') +
      '</section></div></div>';
    const msg = (t, ok) => { const el = $('#cMsg'); el.innerHTML = t ? '<span class="status ' + (ok ? 'ok' : 'bad') + '">' + esc(t) + '</span>' : ''; };
    const genAI = async () => {
      const w = $('#cw').value.trim(); if (!w) { msg('Najpierw wpisz słowo.'); $('#cw').focus(); return null; }
      msg(''); $('#cMsg').innerHTML = '<div class="checking"><span class="spinner"></span>AI wymyśla zdanie…</div>';
      try {
        let r = (await AI.makeExamples([{ word: w, pl: $('#cp').value.trim() }], L[levels().vocab]))[0];
        if (!r) throw new Error('AI nie zwróciło zdania.');
        try { const qc = await qcWordItems([r]); if (!qc.items.length) throw new Error('AI napisało słabe zdanie — kliknij jeszcze raz albo wpisz własne.'); r = qc.items[0]; } catch (e) { if (!e.status) throw e; }
        if (!$('#cp').value.trim() && r.pl) $('#cp').value = r.pl;
        if (r.sentence) $('#cs').value = r.sentence;
        msg('Gotowe — sprawdź i kliknij „Dodaj”.', true);
        return r;
      } catch (e) { msg(e.status ? AI.humanError(e) : e.message); return null; }
    };
    const add = async () => {
      if (ai && (!$('#cp').value.trim() || !$('#cs').value.trim()) && $('#cw').value.trim()) { const r = await genAI(); if (!r) return; }
      const err = addCustom($('#cw').value, $('#cp').value, $('#cs').value);
      if (err) { msg(err); return; }
      const w = $('#cw').value.trim();
      renderWords(); toast('Dodano „' + w + '”.'); const f = $('#cw'); if (f) f.focus();
    };
    $('#back').onclick = () => go('home');
    $$('[data-wtab]').forEach(b => b.onclick = () => renderWords(b.dataset.wtab));
    if ($('#owPrev')) $('#owPrev').onclick = () => { ownPage--; renderWords(); };
    if ($('#owNext')) $('#owNext').onclick = () => { ownPage++; renderWords(); };
    $$('[data-ownsay]').forEach(b => b.onclick = () => { const w = WORDS.byId[b.dataset.ownsay]; if (w) Speech.speak(w.answers[0], D().settings.rate || 0.95); });
    $('#cAdd').onclick = add;
    if ($('#topUp')) $('#topUp').onclick = async () => {
      $('#topUp').disabled = true;
      $('#tuMsg').innerHTML = '<div class="checking"><span class="spinner"></span>AI dobiera nowe słowa na poziomie ' + L[levels().vocab] + '…</div>';
      const n = await maybeTopUp(true);
      if (screen !== 'words') return;
      renderWords();
      if (!n) $('#tuMsg').innerHTML = '<span class="status bad">Nie udało się dodać nowych słów — spróbuj za chwilę.</span>';
    };
    if ($('#cAi')) $('#cAi').onclick = genAI;
    ['#cw', '#cp', '#cs'].forEach(sel => { $(sel).onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }; });
    if ($('#bAdd')) $('#bAdd').onclick = async () => {
      const lines = $('#bulk').value.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 25);
      if (!lines.length) return;
      const items = lines.map(l => { const mm = l.split(/\s+[-–—;:]\s+|\t/); return { word: mm[0].trim(), pl: (mm[1] || '').trim() }; });
      $('#bMsg').innerHTML = '<div class="checking"><span class="spinner"></span>AI przygotowuje ' + items.length + ' słów…</div>';
      try {
        let res = await AI.makeExamples(items, L[levels().vocab]), qcSt = null;
        try { const qc = await qcWordItems(res); res = qc.items; qcSt = qc.st; } catch (e) { }
        let okN = 0; const bad = [];
        items.forEach((it, i) => {
          const r = res[i] && res[i].word && res[i].word.toLowerCase() === it.word.toLowerCase() ? res[i] : res.find(x => x.word && x.word.toLowerCase() === it.word.toLowerCase());
          const err = r ? addCustom(it.word, it.pl || r.pl, r.sentence) : (qcSt ? 'AI nie napisało dobrego zdania — dodaj je ręcznie' : 'brak odpowiedzi AI');
          if (err) bad.push(it.word + ': ' + err); else okN++;
        });
        renderWords();
        toast('Dodano ' + okN + ' z ' + items.length + ' słów.' + (qcSt ? qcNote(qcSt) : ''));
        if (bad.length) { const el = $('#bMsg'); if (el) el.innerHTML = '<span class="status bad">Pominięte:<br>' + bad.map(esc).join('<br>') + '</span>'; }
      } catch (e) { $('#bMsg').innerHTML = '<span class="status bad">' + esc(e.status ? AI.humanError(e) : e.message) + '</span>'; }
    };
    $$('[data-del]').forEach(b => b.onclick = () => {
      const id = b.dataset.del, backup = D().custom[id];
      const cardsBak = {};
      [id, 'ord:' + id, 'dic:' + id, 'say:' + id].forEach(k => { if (D().cards[k]) { cardsBak[k] = D().cards[k]; delete D().cards[k]; } });
      delete D().custom[id];
      registerCustom(); progress(); Store.save(); renderWords();
      toast('Usunięto „' + backup.answers[0] + '”.', { label: 'Cofnij', fn: () => { D().custom[id] = backup; Object.assign(D().cards, cardsBak); registerCustom(); Store.save(); if (screen === 'words') renderWords(); } });
    });
    $('#cw').focus();
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('home'); return; }
      if (altKey(e, 'KeyG') && $('#cAi')) { e.preventDefault(); genAI(); }
    };
  }

  /* ---------- Statystyki ---------- */
  const SK_COLORS = { vocab: '#C8607F', grammar: '#5E7898', listening: '#C39046', speaking: '#789E66' };
  function aggDays(start, n) {
    const a = { sec: 0, xp: 0, correct: 0, total: 0, newCount: 0, days: 0, n };
    let t = start;
    for (let i = 0; i < n; i++) {
      const d = D().days[U.dayKey(t)];
      if (d) { a.sec += d.sec || 0; a.xp += d.xp || 0; a.correct += d.correct || 0; a.total += d.total || 0; a.newCount += d.newCount || 0; if (isStudyDay(d)) a.days++; }
      t = U.addDays(t, 1);
    }
    return a;
  }
  function aggSkill(start, n) {
    const r = { vocab: [0, 0], grammar: [0, 0], listening: [0, 0], speaking: [0, 0] };
    let t = start;
    for (let i = 0; i < n; i++) {
      const d = D().days[U.dayKey(t)];
      if (d && d.sk) Object.keys(d.sk).forEach(k => { if (r[k]) { r[k][0] += d.sk[k][0]; r[k][1] += d.sk[k][1]; } });
      t = U.addDays(t, 1);
    }
    return r;
  }
  function firstDay() {
    const ks = Object.keys(D().days).filter(k => (D().days[k].sec || 0) > 0 || (D().days[k].total || 0) > 0).sort();
    return ks.length ? new Date(ks[0] + 'T00:00:00').getTime() : U.startOfDay();
  }
  function daysBetween(a, b) { return Math.round((U.startOfDay(b) - U.startOfDay(a)) / U.DAY); }
  function pctDelta(cur, prev) { if (!prev) return cur ? null : 0; return Math.round((cur - prev) / prev * 100); }
  function statsData(mode) {
    const today = U.startOfDay(), first = firstDay();
    const metrics = a => ({ min: a.sec / 60, xp: a.xp, acc: a.total ? a.correct / a.total * 100 : null, words: a.newCount, days: a.days });
    let periods = [], cur, prev, curStart, elapsed, labels, curBars, prevBars, goal, vsLabel, rangeWord, prevName, curName;
    if (mode === 'all') {
      curStart = first; elapsed = daysBetween(first, today) + 1;
      cur = aggDays(first, elapsed); prev = null;
      const d0 = new Date(today), f = new Date(first), ms = [];
      for (let y = f.getFullYear(), m = f.getMonth(); new Date(y, m, 1).getTime() <= today; m++) ms.push(new Date(y, m, 1));
      const last = ms.slice(-12);
      labels = last.map(s => MONTHS[s.getMonth()].slice(0, 3).toLowerCase());
      curBars = last.map(s => { const st = Math.max(s.getTime(), first), len = new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(); const end = Math.min(new Date(s.getFullYear(), s.getMonth(), len).getTime(), today); return aggDays(st, daysBetween(st, end) + 1).sec / 60; });
      prevBars = last.map(() => 0);
      goal = D().settings.goalMin * 30; vsLabel = ''; rangeWord = ''; curName = 'Od początku'; prevName = '';
      const C0 = { min: cur.sec / 60, xp: cur.xp, acc: cur.total ? cur.correct / cur.total * 100 : null, words: cur.newCount, days: cur.days };
      const kpis = [
        { label: 'Czas nauki', v: C0.min, key: 'min', unit: ' min', avg: C0.min / elapsed, perDayUnit: ' min dziennie' },
        { label: 'Zdobyte XP', v: C0.xp, key: 'xp', unit: '', avg: C0.xp / elapsed, perDayUnit: ' XP dziennie' },
        { label: 'Trafność', v: C0.acc, key: 'acc', unit: '%', pts: true },
        { label: 'Nowe słowa', v: C0.words, key: 'words', unit: '', avg: C0.words / elapsed, perDayUnit: ' dziennie' }
      ];
      return { mode, cur, prev, C: C0, P: {}, kpis, labels, curBars, prevBars, goal, vsLabel, rangeWord, curName, prevName, elapsed, periods, bestPeriod: null, curStart };
    }
    if (mode === 'week') {
      curStart = mondayOf(today); elapsed = daysBetween(curStart, today) + 1;
      const prevStart = U.addDays(curStart, -7);
      cur = aggDays(curStart, elapsed); prev = aggDays(prevStart, elapsed);
      labels = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
      curBars = labels.map((_, i) => i < elapsed ? aggDays(U.addDays(curStart, i), 1).sec / 60 : null);
      prevBars = labels.map((_, i) => aggDays(U.addDays(prevStart, i), 1).sec / 60);
      goal = D().settings.goalMin; vsLabel = 'vs te same dni poprzedniego tygodnia'; rangeWord = 'tydzień'; curName = 'Ten tydzień'; prevName = 'Poprzedni';
      for (let s = mondayOf(first); s < curStart; s = U.addDays(s, 7)) periods.push({ start: s, a: aggDays(s, 7), n: 7 });
      // średnia wszystkich takich dni tygodnia od początku nauki (dni bez nauki = 0 min), łącznie z dzisiejszym — rośnie na bieżąco
      var avgCnt = [], avgBars = labels.map((_, i) => { let sum = 0, cnt = 0; for (let t = U.addDays(mondayOf(first), i); t <= today; t = U.addDays(t, 7)) { if (t < first) continue; const x = D().days[U.dayKey(t)]; sum += x ? (x.sec || 0) / 60 : 0; cnt++; } avgCnt[i] = cnt; return cnt ? sum / cnt : null; });
    } else {
      const d0 = new Date(today); curStart = new Date(d0.getFullYear(), d0.getMonth(), 1).getTime(); elapsed = d0.getDate();
      const prevStart = new Date(d0.getFullYear(), d0.getMonth() - 1, 1).getTime();
      const prevLen = new Date(d0.getFullYear(), d0.getMonth(), 0).getDate();
      cur = aggDays(curStart, elapsed); prev = aggDays(prevStart, Math.min(elapsed, prevLen));
      const curLen = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
      const buckets = [[1, 7], [8, 14], [15, 21], [22, 28], [29, 31]];
      labels = buckets.map((b, i) => 'Tydz. ' + (i + 1));
      curBars = buckets.map(b => b[0] > elapsed || b[0] > curLen ? null : aggDays(U.addDays(curStart, b[0] - 1), Math.min(b[1], elapsed, curLen) - b[0] + 1).sec / 60);
      prevBars = buckets.map(b => b[0] > prevLen ? 0 : aggDays(U.addDays(prevStart, b[0] - 1), Math.min(b[1], prevLen) - b[0] + 1).sec / 60);
      goal = D().settings.goalMin * 7; vsLabel = 'vs te same dni poprzedniego miesiąca'; rangeWord = 'miesiąc';
      curName = MONTHS[d0.getMonth()]; prevName = MONTHS[(d0.getMonth() + 11) % 12];
      const f = new Date(first);
      for (let y = f.getFullYear(), m = f.getMonth(); new Date(y, m, 1).getTime() < curStart; m++) {
        const s = new Date(y, m, 1).getTime(), len = new Date(y, m + 1, 0).getDate();
        periods.push({ start: s, a: aggDays(s, len), n: len });
      }
    }
    // zakresy: średnie dzienne z pełnych okresów
    const perDay = p => ({ min: p.a.sec / 60 / p.n, xp: p.a.xp / p.n, acc: p.a.total ? p.a.correct / p.a.total * 100 : null, words: p.a.newCount / p.n });
    const pd = periods.map(perDay);
    const curPD = { min: cur.sec / 60 / elapsed, xp: cur.xp / elapsed, acc: cur.total ? cur.correct / cur.total * 100 : null, words: cur.newCount / elapsed };
    const range = key => {
      const vals = pd.map(x => x[key]).filter(v => v != null && (key !== 'acc' || true));
      if (!vals.length) return null;
      return { worst: Math.min.apply(null, vals), best: Math.max.apply(null, vals), avg: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length };
    };
    const C = metrics(cur), P = metrics(prev);
    const kpis = [
      { label: 'Czas nauki', v: C.min, p: P.min, unit: ' min', key: 'min', r: range('min'), cur: curPD.min, perDayUnit: ' min dziennie' },
      { label: 'Zdobyte XP', v: C.xp, p: P.xp, unit: '', key: 'xp', r: range('xp'), cur: curPD.xp, perDayUnit: ' XP dziennie' },
      { label: 'Trafność', v: C.acc, p: P.acc, unit: '%', key: 'acc', r: range('acc'), cur: curPD.acc, pts: true, perDayUnit: '%' },
      { label: 'Nowe słowa', v: C.words, p: P.words, unit: '', key: 'words', r: range('words'), cur: curPD.words, perDayUnit: ' dziennie' }
    ];
    // ranking i rekord okresu
    const allTotals = periods.map(p => ({ start: p.start, min: p.a.sec / 60 }));
    const bestPeriod = allTotals.reduce((b, x) => !b || x.min > b.min ? x : b, null);
    return Object.assign({ avgBars: mode === 'week' && typeof avgBars !== 'undefined' ? avgBars : null, avgCnt: mode === 'week' && typeof avgCnt !== 'undefined' ? avgCnt : null }, { mode, cur, prev, C, P, kpis, labels, curBars, prevBars, goal, vsLabel, rangeWord, curName, prevName, elapsed, periods, bestPeriod, curStart });
  }
  function insightText(sd) {
    const parts = [];
    if (sd.mode === 'all') {
      if (!sd.C.min) return 'Statystyki zapełnią się po pierwszych sesjach. Każdy dzień nauki dokłada tu nowe dane.';
      const nd = sd.cur.days || 0;
      parts.push('Od ' + new Date(sd.curStart).toLocaleDateString('pl-PL') + ' uczyłeś się łącznie ' + fmtDur(sd.C.min * 60) + ' — ' + nd + ' ' + (nd === 1 ? 'dzień' : 'dni') + ' nauki na ' + sd.elapsed + ' ' + (sd.elapsed === 1 ? 'dzień' : 'dni') + ' z programem.');
      const st = streak(); if (st >= 2) parts.push('Seria: ' + st + ' dni.');
      return parts.join(' ');
    }
    const dm = pctDelta(sd.C.min, sd.P.min);
    const unit = sd.mode === 'week' ? 'tygodnia' : 'miesiąca';
    if (!sd.C.min && !sd.P.min) return 'Statystyki zapełnią się po pierwszych sesjach. Każdy dzień nauki dokłada tu nowe dane.';
    if (dm == null) parts.push('Uczysz się w tym ' + (sd.mode === 'week' ? 'tygodniu' : 'miesiącu') + ' więcej niż w tych samych dniach poprzedniego ' + unit + ' — wtedy nie było nauki.');
    else if (dm > 0) parts.push('W tym ' + (sd.mode === 'week' ? 'tygodniu' : 'miesiącu') + ' uczysz się o ' + dm + '% dłużej niż w tych samych dniach poprzedniego ' + unit + '.');
    else if (dm < 0) parts.push('W tym ' + (sd.mode === 'week' ? 'tygodniu' : 'miesiącu') + ' uczysz się o ' + Math.abs(dm) + '% krócej niż w tych samych dniach poprzedniego ' + unit + '.');
    else parts.push('Uczysz się tyle samo co w tych samych dniach poprzedniego ' + unit + '.');
    if (sd.bestPeriod && sd.bestPeriod.min > 0) {
      const curMin = sd.C.min;
      parts.push(curMin >= sd.bestPeriod.min ? 'To już Twój najlepszy ' + sd.rangeWord + '!' : 'Do rekordu (' + Math.round(sd.bestPeriod.min) + ' min) brakuje ' + Math.ceil(sd.bestPeriod.min - curMin) + ' min.');
    }
    const st = streak(); if (st >= 2) parts.push('Seria: ' + st + ' dni.');
    return parts.join(' ');
  }
  /* czas: do 60 min w minutach, potem „5 h 20 min”, od 100 h same godziny */
  function fmtDur(sec) {
    const m = Math.round((sec || 0) / 60);
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return h >= 100 ? fmtNum(h) + ' h' : h + ' h' + (r ? ' ' + r + ' min' : '');
  }
  const TIME_NAME = { ex: 'Ćwiczenia i gry', talk: 'Rozmowa', listen: 'Audycja', texts: 'Moje teksty', tenses: 'Lekcje czasów', test: 'Testy', old: 'Wcześniej (bez podziału)' };
  function timeHtml() {
    const days = D().days, ks = Object.keys(days);
    let all = 0, nDays = 0; ks.forEach(k => { all += days[k].sec || 0; if (isStudyDay(days[k])) nDays++; });
    const sumFrom = t0 => ks.filter(k => new Date(k + 'T00:00:00').getTime() >= t0).reduce((a, k) => a + (days[k].sec || 0), 0);
    const week = sumFrom(mondayOf(Date.now())), now = new Date(), month = sumFrom(new Date(now.getFullYear(), now.getMonth(), 1).getTime());
    const by = {}; let byAll = 0;
    for (let i = 0; i < 30; i++) {
      const x = days[U.dayKey(U.addDays(U.startOfDay(), -i))]; if (!x) continue;
      let known = 0; Object.keys(x.secBy || {}).forEach(m => { by[m] = (by[m] || 0) + x.secBy[m]; known += x.secBy[m]; });
      if ((x.sec || 0) > known) by.old = (by.old || 0) + (x.sec - known);
      byAll += x.sec || 0;
    }
    const h = all / 3600, lvlH = [[180, 'A2'], [350, 'B1'], [500, 'B2'], [700, 'C1']].find(x => h < x[0]) || [800, 'C1'];
    const tiles = [['Razem od początku', fmtDur(all)], ['Ten tydzień', fmtDur(week)], ['Ten miesiąc', fmtDur(month)], ['Średnio na dzień nauki', nDays ? fmtDur(all / nDays) : '—']]
      .map(x => '<div class="tm-tile inset"><span>' + x[0] + '</span><b>' + x[1] + '</b></div>').join('');
    const mods = Object.keys(by).filter(m => by[m] >= 30).sort((a, b) => (a === 'old') - (b === 'old') || by[b] - by[a]);
    const max = mods.filter(m => m !== 'old').reduce((a, m) => Math.max(a, by[m]), 1);
    return '<h2>Czas nauki</h2><div class="tm-tiles">' + tiles + '</div>' +
      '<div class="small-note">Dla porównania: wg Cambridge na poziom ' + lvlH[1] + ' potrzeba łącznie ok. ' + ({ A2: '180–200', B1: '350–400', B2: '500–600', C1: '700–800' })[lvlH[1]] + ' h nauki z nauczycielem — to tylko orientacyjnie.</div>' +
      (mods.length ? '<h3 class="tm-sub">Na co poszedł czas — ostatnie 30 dni</h3><div class="tm-rows">' + mods.map(m => '<div class="tm-row' + (m === 'old' ? ' old' : '') + '"><span>' + TIME_NAME[m] + '</span><div class="tm-bar"><div style="width:' + (m === 'old' ? 100 : by[m] / max * 100).toFixed(1) + '%"></div></div><b>' + fmtDur(by[m]) + '</b></div>').join('') + '</div>' : '');
  }
  function kpiHtml(k, sd) {
    const v = k.v, p = k.p;
    const has = v != null;
    const val = !has ? '—' : k.key === 'acc' ? Math.round(v) + '%' : k.key === 'min' ? fmtDur(v * 60) : fmtNum(v) + k.unit;
    if (sd.mode === 'all') {
      const sub = k.key === 'acc' ? 'ze wszystkich odpowiedzi' : 'średnio ' + (k.avg < 10 ? (k.avg || 0).toFixed(1).replace('.', ',') : fmtNum(Math.round(k.avg))) + k.perDayUnit;
      return '<div class="kpi raised"><div class="small-note" style="font-size:15px">' + k.label + '</div>' +
        '<div class="row" style="gap:10px;align-items:baseline"><span class="kpi-val" style="white-space:nowrap' + (val.length > 7 ? ';font-size:34px' : '') + '">' + val + '</span></div>' +
        '<div class="small-note" style="font-size:13px">od ' + new Date(sd.curStart).toLocaleDateString('pl-PL') + ' · ' + sub + '</div></div>';
    }
    let delta = '';
    if (has && p != null) {
      const diff = k.pts ? Math.round(v - p) : pctDelta(v, p);
      if (diff == null) delta = '<span class="delta up" title="w poprzednim okresie było 0">▲ +' + val + '</span>';
      else delta = '<span class="delta ' + (diff >= 0 ? 'up' : 'down') + '">' + (diff >= 0 ? '▲ ' : '▼ ') + Math.abs(diff) + (k.pts ? ' pkt' : '%') + '</span>';
    }
    const prevTxt = p == null ? '—' : k.key === 'acc' ? Math.round(p) + '%' : k.key === 'min' ? fmtDur(p * 60) : fmtNum(p) + k.unit;
    let rangeHtml;
    if (k.r && k.cur != null && k.r.best > k.r.worst) {
      const pos = x => Math.max(0, Math.min(100, (x - k.r.worst) / (k.r.best - k.r.worst) * 100));
      const f = x => k.key === 'acc' ? Math.round(x) + '%' : (x < 10 ? x.toFixed(1).replace('.', ',') : fmtNum(x));
      rangeHtml = '<div class="range" title="Średnio dziennie teraz: ' + f(k.cur) + ' · średnia: ' + f(k.r.avg) + '"><div class="track inset"></div><div class="avg" style="left:calc(' + pos(k.r.avg) + '% - 1px)"></div><div class="dot" style="left:calc(' + pos(k.cur) + '% - 9px)"></div></div>' +
        '<div class="range-lbl"><span>najgorszy: ' + f(k.r.worst) + '</span><span>najlepszy: ' + f(k.r.best) + '</span></div>' +
        '<div class="small-note" style="font-size:12px">' + (k.key === 'acc' ? 'Trafność teraz: <b>' + f(k.cur) + '</b>' : 'Teraz <b>' + f(k.cur) + '</b>' + k.perDayUnit) + ' · kreska = średnia (' + f(k.r.avg) + ') · na tle Twoich ' + (sd.mode === 'week' ? 'tygodni' : 'miesięcy') + '</div>';
    } else {
      rangeHtml = '<div class="small-note" style="font-size:12px">Porównanie z najlepszym i najgorszym ' + (sd.mode === 'week' ? 'tygodniem' : 'miesiącem') + ' pojawi się po pierwszym pełnym ' + (sd.mode === 'week' ? 'tygodniu' : 'miesiącu') + '.</div>';
    }
    return '<div class="kpi raised"><div class="small-note" style="font-size:15px">' + k.label + '</div>' +
      '<div class="row" style="gap:10px;align-items:baseline"><span class="kpi-val">' + val + '</span>' + delta + '</div>' +
      '<div class="small-note" style="font-size:13px">' + sd.vsLabel + ': ' + prevTxt + '</div>' + rangeHtml + '</div>';
  }
  function barsHtml(sd) {
    const vals = sd.curBars.concat(sd.prevBars, sd.avgBars || []).filter(v => v != null);
    const maxV = Math.max(sd.goal * 1.25, Math.max.apply(null, vals.concat([1])));
    const step = maxV <= 30 ? 10 : maxV <= 60 ? 15 : maxV <= 120 ? 30 : maxV <= 240 ? 60 : 120;
    const top = Math.ceil(maxV / step) * step, H = sd.h || 220;
    let grid = '';
    for (let v = 0; v <= top; v += step) grid += '<div class="gl' + (v === 0 ? ' base' : '') + '" style="top:' + (H - v / top * H) + 'px"><span>' + v + '</span></div>';
    const goalTop = H - sd.goal / top * H;
    const bars = sd.labels.map((lab, i) => {
      const c = sd.curBars[i], p = sd.prevBars[i] || 0;
      const hc = c == null ? 0 : Math.max(c > 0 ? 4 : 0, c / top * H), hp = Math.max(p > 0 ? 4 : 0, p / top * H);
      const tip = lab + ': ' + (c == null ? '—' : fmtDur(c * 60)) + (sd.mode === 'all' ? '' : ' · ' + sd.prevName.toLowerCase() + ': ' + Math.round(p) + ' min');
      const av = sd.avgBars ? sd.avgBars[i] : null, ha = av == null ? 0 : Math.max(av > 0 ? 4 : 0, av / top * H);
      return '<div class="bcol' + (sd.avgBars ? ' b3' : '') + '" tabindex="0" title="' + esc(tip + (av != null ? ' · średnio ' + Math.round(av) + ' min (z ' + sd.avgCnt[i] + ' ' + (sd.avgCnt[i] === 1 ? 'dnia' : 'dni') + ')' : '')) + '"><div class="bp" style="height:' + hp + 'px"></div><div class="bc" style="height:' + hc + 'px;' + (c == null ? 'opacity:0' : '') + '"></div>' + (sd.avgBars ? '<div class="ba" style="height:' + ha + 'px"></div>' : '') + '<div class="btip raised-sm">' + esc(tip) + '</div></div>';
    }).join('');
    return '<div class="chart-bars" style="height:' + H + 'px">' + grid + '<div class="goal" style="top:' + goalTop + 'px"></div><div class="bcols">' + bars + '</div></div>' +
      '<div class="blabels">' + sd.labels.map((l, i) => '<span' + (sd.curBars[i] == null ? ' style="opacity:.55"' : '') + '>' + l + '</span>').join('') + '</div>';
  }
  function linesHtml(mode, compact) {
    const today = U.startOfDay();
    const pts = [];
    if (mode === 'week') { const m0 = mondayOf(today); for (let i = 7; i >= 0; i--) { const s = U.addDays(m0, -7 * i); pts.push({ lab: U.dayKey(s).slice(5).split('-').reverse().join('.'), r: aggSkill(s, 7) }); } }
    else if (mode === 'all') { const f = new Date(firstDay()), ms = []; for (let y = f.getFullYear(), m = f.getMonth(); new Date(y, m, 1).getTime() <= today; m++) ms.push(new Date(y, m, 1)); ms.slice(-12).forEach(s => { const len = new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(); pts.push({ lab: MONTHS[s.getMonth()].slice(0, 3).toLowerCase(), r: aggSkill(s.getTime(), len) }); }); }
    else { const d0 = new Date(today); for (let i = 5; i >= 0; i--) { const s = new Date(d0.getFullYear(), d0.getMonth() - i, 1); const len = new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(); pts.push({ lab: MONTHS[s.getMonth()].slice(0, 3).toLowerCase(), r: aggSkill(s.getTime(), len) }); } }
    const keys = ['vocab', 'grammar', 'listening', 'speaking'];
    const any = pts.some(p => keys.some(k => p.r[k][1] >= 3));
    if (!any) return '<div class="small-note" style="padding:30px 0;text-align:center">Wykres pojawi się, gdy zbierze się trochę odpowiedzi. Trafność każdej umiejętności zapisuje się od dziś.</div>';
    const W = compact ? 420 : 660, X0 = 40, X1 = compact ? 410 : 540, Y = compact ? (v => 206 - v / 100 * 194) : (v => 200 - v / 100 * 180);
    const xs = i => X0 + (pts.length === 1 ? 0 : i / (pts.length - 1) * (X1 - X0));
    let svg = '<svg viewBox="0 0 ' + W + ' ' + (compact ? 230 : 240) + '" role="img" aria-label="Trafność według umiejętności" class="lines">';
    [100, 75, 50, 25, 0].forEach(v => { svg += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + (v === 0 ? '#B5AFA7' : '#CFCAC2') + '"/><text x="' + (X0 - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="12" fill="#5F5B55">' + v + '%</text>'; });
    pts.forEach((p, i) => { if (i === 0 || i === pts.length - 1 || pts.length <= 6) svg += '<text x="' + xs(i) + '" y="' + (compact ? 226 : 224) + '" text-anchor="middle" font-size="12" fill="#5F5B55">' + p.lab + '</text>'; });
    const ends = [];
    keys.forEach(k => {
      let d = '', last = null;
      pts.forEach((p, i) => {
        const r = p.r[k]; if (r[1] < 3) return;
        const v = r[0] / r[1] * 100;
        d += (d ? ' L' : 'M') + xs(i).toFixed(1) + ' ' + Y(v).toFixed(1);
        svg += '<circle cx="' + xs(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4" fill="' + SK_COLORS[k] + '" stroke="#E3E0DC" stroke-width="2"><title>' + SKILL_NAME[k] + ' · ' + p.lab + ': ' + Math.round(r[0] / r[1] * 100) + '% (' + r[1] + ' odp.)</title></circle>';
        last = { x: xs(i), y: Y(v), v: Math.round(r[0] / r[1] * 100) };
      });
      if (d) svg += '<path d="' + d + '" fill="none" stroke="' + SK_COLORS[k] + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
      if (last) ends.push({ k, y: last.y, v: last.v });
    });
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
    if (!compact) ends.forEach(e => { svg += '<text x="' + (X1 + 12) + '" y="' + (e.y + 4) + '" font-size="13" fill="#3A3835">' + SKILL_NAME[e.k] + ' ' + e.v + '%</text>'; });
    svg += '</svg>';
    return svg;
  }
  /* aktywność: od pierwszego tygodnia nauki, narastająco; po roku — ostatnie 12 miesięcy albo wybrany rok */
  let heatYear = null;
  function heatRange() {
    const today = U.startOfDay(), first = mondayOf(firstDay()), last = mondayOf(today);
    if (heatYear) {
      const y0 = new Date(heatYear, 0, 1).getTime(), y1 = new Date(heatYear, 11, 31).getTime();
      return { start: Math.max(first, mondayOf(y0)), end: Math.min(last, mondayOf(y1)) };
    }
    const weeks = Math.round((last - first) / (7 * U.DAY)) + 1;
    return { start: weeks > 53 ? U.addDays(last, -7 * 52) : first, end: last };
  }
  function heatHtml() {
    const ramp = ['transparent', '#D0DFF0', '#A2C0E2', '#6E97CB', '#3F6597'];
    const lvl = m => m <= 0 ? 0 : m < 6 ? 1 : m < 15 ? 2 : m < 30 ? 3 : 4;
    const today = U.startOfDay(), R = heatRange();
    const W = Math.round((R.end - R.start) / (7 * U.DAY)) + 1;
    const cols = '30px repeat(' + W + ', minmax(0, 26px))', gap = W > 30 ? 3 : W > 18 ? 4 : 5;
    let mon = '<div></div>', prevM = -1;
    for (let w = 0; w < W; w++) {
      const d = new Date(U.addDays(R.start, w * 7)), m = d.getMonth();
      mon += '<div class="hm">' + (m !== prevM ? MONTHS[m].slice(0, 3).toLowerCase() : '') + '</div>'; prevM = m;
    }
    let h = '';
    const rows = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', '<b>So</b>', '<b>Nd</b>'];
    for (let r = 0; r < 7; r++) {
      h += '<div class="hl">' + rows[r] + '</div>';
      for (let w = 0; w < W; w++) {
        const t = U.addDays(R.start, w * 7 + r);
        const mo = x => new Date(x).getMonth();
        const wk = (w > 0 && mo(t - 7 * U.DAY) !== mo(t) ? ' ml' : '') + (r > 0 && mo(t - U.DAY) !== mo(t) ? ' mt' : '');
        if (t > today) { h += '<div class="cell fut"></div>'; continue; }
        const d = D().days[U.dayKey(t)], m = d ? Math.round((d.sec || 0) / 60) : 0;
        h += '<div class="cell' + wk + (m ? '' : ' empty') + '" style="background:' + ramp[lvl(m)] + '" title="' + new Date(t).toLocaleDateString('pl-PL') + ': ' + (m ? m + ' min' : 'bez nauki') + '"></div>';
      }
    }
    return '<div class="heat-wrap" style="--hw:' + W + '"><div class="heat heat-m" style="grid-template-columns:' + cols + ';column-gap:' + gap + 'px">' + mon + '</div>' +
      '<div class="heat heat-g" style="grid-template-columns:' + cols + ';gap:' + gap + 'px;--hg:' + gap + 'px">' + h + '</div></div>' +
      '<div class="heat-legend"><span>mniej</span>' + ramp.map((c, i) => '<span class="sw' + (i ? '' : ' empty') + '" style="background:' + c + '"></span>').join('') + '<span>więcej</span></div>';
  }
  /* Aktywność: cały rok kalendarzowy w 2 rzędach (sty–cze, lip–gru), strzałki do zmiany roku (upd210) */
  let actYear = new Date().getFullYear();
  function heatYearTitle() {
    const y0 = new Date(firstDay()).getFullYear(), y1 = new Date().getFullYear();
    actYear = Math.min(y1, Math.max(y0, actYear));
    const CH = d => '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    return '<div class="row between"><h3>Aktywność w roku</h3><div class="hy-nav"><button class="btn" data-hyy="-1" aria-label="Poprzedni rok"' + (actYear <= y0 ? ' disabled' : '') + '>' + CH('M15 5l-7 7 7 7') + '</button><b>' + actYear + '</b><button class="btn" data-hyy="1" aria-label="Następny rok"' + (actYear >= y1 ? ' disabled' : '') + '>' + CH('M9 5l7 7-7 7') + '</button></div></div>';
  }
  function heatYearHtml() {
    const ramp = ['transparent', '#D0DFF0', '#A2C0E2', '#6E97CB', '#3F6597'], lvl = m => m <= 0 ? 0 : m < 6 ? 1 : m < 15 ? 2 : m < 30 ? 3 : 4;
    const Y = actYear, today = U.startOfDay(), MN = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'], LB = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', '<b>So</b>', '<b>Nd</b>'];
    let html = '<div class="hy-wrap">';
    [0, 1].forEach(h => {
      const a = new Date(Y, h * 6, 1).getTime(), z = new Date(Y, h * 6 + 6, 0).getTime(), st = mondayOf(a), W = Math.round((mondayOf(z) - st) / (7 * U.DAY)) + 1;
      let g = '<div></div>';
      for (let w = 0; w < W; w++) { let lab = ''; for (let k = 0; k < 7; k++) { const t = U.addDays(st, w * 7 + k), d = new Date(t); if (t >= a && t <= z && d.getDate() === 1) lab = MN[d.getMonth()]; } g += '<div class="m">' + lab + '</div>'; }
      for (let r = 0; r < 7; r++) {
        g += '<div class="l">' + LB[r] + '</div>';
        for (let w = 0; w < W; w++) {
          const t = U.addDays(st, w * 7 + r);
          if (t < a || t > z) { g += '<i class="x"></i>'; continue; }
          if (t > today) { g += '<i class="f"></i>'; continue; }
          const d = D().days[U.dayKey(t)], m = d ? Math.round((d.sec || 0) / 60) : 0;
          g += '<i style="background:' + ramp[lvl(m)] + '" title="' + new Date(t).toLocaleDateString('pl-PL') + ': ' + (m ? m + ' min' : 'bez nauki') + '"></i>';
        }
      }
      html += '<div class="hy-half" style="--w:' + W + '">' + g + '</div>';
    });
    return html + '<div class="hy-leg"><span>mniej</span>' + ramp.map(c => '<span class="s" style="background:' + c + '"></span>').join('') + '<span>więcej</span></div></div>';
  }
  function heatTitle() {
    const first = firstDay(), y0 = new Date(first).getFullYear(), y1 = new Date().getFullYear();
    const R = heatRange(), W = Math.round((R.end - R.start) / (7 * U.DAY)) + 1;
    const lbl = heatYear ? 'rok ' + heatYear : R.start > mondayOf(first) ? 'ostatnie 12 miesięcy' : 'od ' + new Date(first).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }) + ' (' + W + ' ' + (W === 1 ? 'tydzień' : W < 5 ? 'tygodnie' : 'tygodni') + ')';
    let yrs = '';
    if (y1 > y0 || heatYear) { yrs = '<div class="row" style="gap:6px"><button class="btn pill small' + (!heatYear ? ' pressed' : '') + '" data-hy="">12 mies.</button>'; for (let y = y0; y <= y1; y++) yrs += '<button class="btn pill small' + (heatYear === y ? ' pressed' : '') + '" data-hy="' + y + '">' + y + '</button>'; yrs += '</div>'; }
    return '<div class="row between"><h2>Aktywność — ' + lbl + '</h2>' + yrs + '</div>';
  }
  function recordsHtml() {
    const days = D().days;
    let bestDay = null;
    Object.keys(days).forEach(k => { if (!bestDay || (days[k].sec || 0) > bestDay.sec) bestDay = { k, sec: days[k].sec || 0 }; });
    const ks = Object.keys(days).filter(k => isStudyDay(days[k])).sort();
    let best = { n: 0 }, run = 0, runStart = null, prev = null;
    ks.forEach(k => {
      const t = new Date(k + 'T00:00:00').getTime();
      if (prev != null && U.dayKey(U.addDays(prev, 1)) === k) run++; else { run = 1; runStart = k; }
      if (run > best.n) best = { n: run, from: runStart, to: k };
      prev = t;
    });
    let bw = null;
    for (let s = mondayOf(firstDay()); s <= U.startOfDay(); s = U.addDays(s, 7)) { const a = aggDays(s, 7); if (!bw || a.sec > bw.sec) bw = { s, sec: a.sec }; }
    const dt = k => k ? new Date(k + 'T00:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) : '';
    const ts = t => t ? new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) : '';
    const rec = [
      ['Najlepszy dzień', bestDay && bestDay.sec ? dt(bestDay.k) : '—', bestDay && bestDay.sec ? fmtDur(bestDay.sec) : '—'],
      ['Najdłuższa seria', best.n ? dt(best.from) + '–' + dt(best.to) : '—', best.n ? best.n + ' ' + (best.n === 1 ? 'dzień' : 'dni') : '—'],
      ['Najlepszy tydzień', bw && bw.sec ? 'od ' + ts(bw.s) : '—', bw && bw.sec ? fmtDur(bw.sec) : '—'],
      ['Rekord rozgrzewki', ts(D().raceBestAt), D().raceBest ? D().raceBest + ' trafień' : '—'],
      ['Najlepsze combo', ts(D().bestComboAt), D().bestCombo ? '×' + D().bestCombo : '—']
    ];
    return rec.map(r => '<div class="rec inset"><div><div class="small-note">' + r[0] + '</div><div class="small-note" style="font-size:12px">' + r[1] + '</div></div><b>' + r[2] + '</b></div>').join('');
  }
  function forecastHtml() {
    const c = D().cards, today = U.startOfDay(), n = [0, 0, 0, 0, 0, 0, 0];
    Object.keys(c).forEach(id => {
      const x = c[id]; if (x.state !== 'review') return;
      const it = itemFor(id); if (!it || !typeEnabled(it.type)) return;
      const d = Math.max(0, daysBetween(today, x.due)); if (d < 7) n[d]++;
    });
    const max = Math.max(1, Math.max.apply(null, n));
    const names = ['dziś', 'jutro'];
    for (let i = 2; i < 7; i++) names.push(['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'][new Date(U.addDays(today, i)).getDay()]);
    return '<div class="fc">' + n.map((v, i) => '<div class="fcol" title="' + names[i] + ': ' + v + ' powtórek"><span class="fv">' + v + '</span><div class="fb2" style="height:' + Math.max(v ? 4 : 0, v / max * 110) + 'px"></div><span class="fl">' + names[i] + '</span></div>').join('') + '</div>';
  }
  /* ---------- Statystyki: elementy płaskie (przebudowa 12.11) ---------- */
  let stRepAll = false, stBdAll = false, stAccLines = false;
  function kpiFlat(k, sd) {
    const v = k.v, p = k.p, has = v != null;
    const fv = (x, kk) => kk === 'acc' ? Math.round(x) + '%' : kk === 'min' ? fmtDur(x * 60) : fmtNum(Math.round(x)) + k.unit;
    const val = has ? fv(v, k.key) : '—';
    if (sd.mode === 'all') {
      const sub = k.key === 'acc' ? 'ze wszystkich odpowiedzi' : 'średnio ' + (k.avg < 10 ? (k.avg || 0).toFixed(1).replace('.', ',') : fmtNum(Math.round(k.avg))) + k.perDayUnit;
      return '<div class="sk"><span>' + k.label + '</span><b>' + val + '</b><small>' + sub + '</small></div>';
    }
    let delta = '';
    if (has && p != null) {
      const diff = k.pts ? Math.round(v - p) : pctDelta(v, p);
      if (diff == null) delta = '<em class="up" title="w poprzednim okresie było 0">▲ +' + val + '</em>';
      else if (diff === 0) delta = '<em class="eq">=</em>';
      else delta = '<em class="' + (diff > 0 ? 'up' : 'dn') + '">' + (diff > 0 ? '▲ ' : '▼ ') + Math.abs(diff) + (k.pts ? ' pkt' : '%') + '</em>';
    }
    return '<div class="sk"><span>' + k.label + '</span><b>' + val + delta + '</b><small>poprzednio ' + (p == null ? '—' : fv(p, k.key)) + '</small></div>';
  }
  function kpiTotal(sd) {
    const days = D().days, ks = Object.keys(days);
    let all = 0, nDays = 0; ks.forEach(k => { all += days[k].sec || 0; if (isStudyDay(days[k])) nDays++; });
    if (sd.mode === 'all') return '<div class="sk"><span>Dni nauki</span><b>' + nDays + '</b><small>na ' + sd.elapsed + ' ' + (sd.elapsed === 1 ? 'dzień' : 'dni') + ' z programem</small></div>';
    return '<div class="sk"><span>Razem od początku</span><b>' + fmtDur(all) + '</b><small>' + (nDays ? fmtDur(all / nDays) + ' na dzień nauki' : '—') + '</small></div>';
  }
  function skillAccHtml(sd) {
    const r = aggSkill(sd.curStart, sd.elapsed), keys = ['vocab', 'listening', 'speaking', 'grammar'];
    const f0 = firstDay(), all = aggSkill(f0, daysBetween(f0, U.startOfDay()) + 1), showAvg = sd.mode !== 'all';
    const rows = keys.filter(k => r[k][1] > 0);
    if (!rows.length) return '<h3>Trafność według umiejętności</h3><div class="small-note">Trafność pojawi się po pierwszych odpowiedziach w tym okresie.</div>';
    return '<h3>Trafność według umiejętności</h3><div class="sa-rows">' + rows.map(k => { const pc = Math.round(r[k][0] / r[k][1] * 100);
      return '<div class="sa-row" title="' + esc(SKILL_NAME[k] + ': ' + r[k][0] + ' z ' + r[k][1] + ' poprawnie') + '"><span>' + SKILL_NAME[k] + '</span><div class="sa-bar">' + '<i style="width:' + pc + '%;background:' + SK_COLORS[k] + '"></i>' + (showAvg && all[k][1] ? '<u style="left:' + Math.round(all[k][0] / all[k][1] * 100) + '%" title="średnia od początku ' + Math.round(all[k][0] / all[k][1] * 100) + '%"></u>' : '') + '</div><b>' + pc + '%</b></div>'; }).join('') + '</div>' +
      '<div class="small-note" style="display:flex;gap:14px;flex-wrap:wrap">' + (sd.mode === 'all' ? 'ze wszystkich odpowiedzi' : '<span>' + (sd.mode === 'week' ? 'ten tydzień' : 'ten miesiąc') + '</span><span><i class="sa-leg"></i> średnia od początku</span>') + '</div>';
  }
  function forecastLine() {
    const c = D().cards, today = U.startOfDay(), n = [0, 0, 0, 0, 0, 0, 0];
    Object.keys(c).forEach(id => {
      const x = c[id]; if (x.state !== 'review') return;
      const it = itemFor(id); if (!it || !typeEnabled(it.type)) return;
      const d = Math.max(0, daysBetween(today, x.due)); if (d < 7) n[d]++;
    });
    if (!n.some(Boolean)) return '<span>brak powtórek w najbliższym tygodniu</span>';
    const names = ['dziś', 'jutro'];
    for (let i = 2; i < 7; i++) names.push(['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'][new Date(U.addDays(today, i)).getDay()]);
    return n.map((v, i) => '<span class="fl1">' + names[i] + ' <b>' + v + '</b></span>').join('<span class="fsep">·</span>');
  }
  function recordsFlat() {
    const days = D().days;
    let bestDay = null;
    Object.keys(days).forEach(k => { if (!bestDay || (days[k].sec || 0) > bestDay.sec) bestDay = { k, sec: days[k].sec || 0 }; });
    const ks = Object.keys(days).filter(k => isStudyDay(days[k])).sort();
    let best = { n: 0 }, run = 0, runStart = null, prev = null;
    ks.forEach(k => {
      const t = new Date(k + 'T00:00:00').getTime();
      if (prev != null && U.dayKey(U.addDays(prev, 1)) === k) run++; else { run = 1; runStart = k; }
      if (run > best.n) best = { n: run, from: runStart, to: k };
      prev = t;
    });
    let bw = null;
    for (let s = mondayOf(firstDay()); s <= U.startOfDay(); s = U.addDays(s, 7)) { const a = aggDays(s, 7); if (!bw || a.sec > bw.sec) bw = { s, sec: a.sec }; }
    const dt = k => new Date(k + 'T00:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
    const ts = t => t ? ' · ' + new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) : '';
    const rec = [];
    if (bestDay && bestDay.sec) rec.push(['Najlepszy dzień · ' + dt(bestDay.k), fmtDur(bestDay.sec)]);
    if (best.n > 1) rec.push(['Najdłuższa seria · ' + dt(best.from) + '–' + dt(best.to), best.n + ' dni']);
    if (bw && bw.sec) rec.push(['Najlepszy tydzień · od ' + new Date(bw.s).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }), fmtDur(bw.sec)]);
    if (D().raceBest) rec.push(['Rekord rozgrzewki' + ts(D().raceBestAt), D().raceBest + ' trafień']);
    if (D().bestCombo) rec.push(['Najlepsze combo' + ts(D().bestComboAt), '×' + D().bestCombo]);
    if (!rec.length) return '<div class="small-note">Rekordy pojawią się po pierwszych sesjach.</div>';
    return '<div class="rec2">' + rec.map(r => '<span>' + r[0] + '</span><b>' + r[1] + '</b>').join('') + '</div>';
  }
  function reportsTable() {
    const thisMon = mondayOf(Date.now()), first = mondayOf(firstDay()), rows = [];
    for (let s = thisMon; s >= first && rows.length < 52; s = U.addDays(s, -7)) {
      const a = aggDays(s, 7), p = aggDays(U.addDays(s, -7), 7);
      rows.push({ s, min: a.sec / 60, d: pctDelta(a.sec, p.sec), cur: s === thisMon });
    }
    if (!rows.length) return { html: '<div class="small-note">Raporty pojawią się po pierwszym tygodniu nauki.</div>', n: 0 };
    const show = stRepAll ? rows : rows.slice(0, 4);
    return { n: rows.length, html: '<div class="rep2">' + show.map(r =>
      '<button class="rep2-row" data-rep="' + U.dayKey(r.s) + '" title="Otwórz raport tygodnia"><span>' + weekRangeLabel(r.s) + (r.cur ? ' <small>· w toku</small>' : '') + '</span><b>' + Math.round(r.min) + ' min</b>' +
      (r.d == null || r.cur || r.d === 0 ? '<em></em>' : '<em class="' + (r.d > 0 ? 'up' : 'dn') + '">' + (r.d > 0 ? '▲ ' : '▼ ') + Math.abs(r.d) + '%</em>') + '</button>').join('') + '</div>' };
  }
  function badgeProg(id) {
    const d = D(), m = {
      streak3: [maxStreak(), 3, ' dni'], streak7: [maxStreak(), 7, ' dni'], streak30: [maxStreak(), 30, ' dni'], goal7: [goalDays(), 7, ''],
      words50: [wordsLearned(), 50, ''], words100: [wordsLearned(), 100, ''], words250: [wordsLearned(), 250, ''],
      combo10: [d.bestCombo || 0, 10, ''], combo25: [d.bestCombo || 0, 25, ''], race15: [d.raceBest || 0, 15, ''], race25: [d.raceBest || 0, 25, ''],
      custom5: [Object.keys(d.custom || {}).length, 5, ''], xp1000: [d.xp, 1000, ''], xp5000: [d.xp, 5000, ''],
      listen10: [(d.audio || []).length, 10, ''], talkGoal5: [(d.convos || []).filter(c => c.goal).length, 5, '']
    }[id];
    return m ? { cur: Math.min(m[0], m[1]), max: m[1], txt: fmtNum(Math.min(m[0], m[1])) + ' / ' + fmtNum(m[1]) + m[2] } : null;
  }
  function badgeChip(b, on) {
    const at = (D().badges || {})[b.id], pr = on ? null : badgeProg(b.id);
    const sub = on ? (at ? new Date(at).toLocaleDateString('pl-PL') : '') : pr ? pr.txt : b.desc;
    return '<div class="bd2' + (on ? ' on' : '') + '" title="' + esc(b.desc) + '"><i>' + (on ? '★' : '') + '</i><div><b>' + esc(b.name) + '</b><small>' + esc(sub) + '</small>' +
      (pr ? '<span class="bd2-p"><span style="width:' + Math.round(pr.cur / pr.max * 100) + '%"></span></span>' : '') + '</div></div>';
  }
  function badgesFlat() {
    const got = D().badges || {}, on = BADGES.filter(b => got[b.id]), off = BADGES.filter(b => !got[b.id]);
    const ranked = off.map(b => ({ b, p: badgeProg(b.id) })).sort((x, y) => (y.p ? y.p.cur / y.p.max : -1) - (x.p ? x.p.cur / x.p.max : -1));
    const next = stBdAll ? ranked : ranked.slice(0, 3);
    return '<div class="row between"><h3>Odznaki <span class="small-note">' + on.length + ' z ' + BADGES.length + '</span></h3>' + (off.length > 3 ? '<button class="lnk2" id="bdAll">' + (stBdAll ? 'zwiń' : 'wszystkie') + '</button>' : '') + '</div>' +
      (on.length ? '<div class="bd2-grid">' + on.map(b => badgeChip(b, true)).join('') + '</div>' : '<div class="small-note">Pierwsza odznaka po pierwszej sesji.</div>') +
      (next.length ? '<div class="st-lbl">' + (stBdAll ? 'Do zdobycia' : 'Następne do zdobycia') + '</div><div class="bd2-grid">' + next.map(x => badgeChip(x.b, false)).join('') + '</div>' : '');
  }
  /* Statystyki — zakładki (upd194) */
  function minSideHtml(sd) {
    const st = D().settings, start = sd.curStart, today = U.startOfDay(), n = Math.max(1, daysBetween(start, today) + 1);
    let goalD = 0, best = null;
    for (let i = 0; i < n; i++) { const t = U.addDays(start, i), x = D().days[U.dayKey(t)], m = x ? (x.sec || 0) / 60 : 0; if (m >= st.goalMin) goalD++; if (!best || m > best.m) best = { t, m }; }
    const cur = sd.cur, per = cur.days ? Math.round(cur.sec / 60 / cur.days) : 0;
    const wd = t => new Date(t).toLocaleDateString('pl-PL', sd.mode === 'week' ? { weekday: 'long' } : { day: 'numeric', month: 'numeric' });
    const kv = (a, b) => '<div class="st-kv"><span>' + a + '</span><b>' + b + '</b></div>';
    return kv(sd.mode === 'week' ? 'Razem w tym tygodniu' : sd.mode === 'month' ? 'Razem w tym miesiącu' : 'Razem od początku', fmtDur(cur.sec)) +
      kv('Średnio na dzień nauki', per + ' min') + kv('Dni z zaliczonym celem', goalD + ' z ' + n) +
      (best && best.m ? kv('Najlepszy dzień', wd(best.t) + ' · ' + Math.round(best.m) + ' min') : '');
  }
  function forecastBars() {
    const c = D().cards, today = U.startOfDay(), n = [0, 0, 0, 0, 0, 0, 0];
    Object.keys(c).forEach(id => { const x = c[id]; if (x.state !== 'review') return; const it = itemFor(id); if (!it || !typeEnabled(it.type)) return; const d = Math.max(0, daysBetween(today, x.due)); if (d < 7) n[d]++; });
    if (!n.some(Boolean)) return '<div class="small-note">brak powtórek w najbliższym tygodniu</div>';
    const names = ['dziś', 'jutro']; for (let i = 2; i < 7; i++) names.push(['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'so'][new Date(U.addDays(today, i)).getDay()]);
    const mx = Math.max.apply(null, n);
    return '<div class="st-fc">' + n.map((v, i) => '<div title="' + names[i] + ': ' + v + '"><i style="height:' + Math.round(v / mx * 56) + 'px"></i><span>' + names[i] + '</span><small>' + v + '</small></div>').join('') + '</div>';
  }
  function reportsBars() {
    const thisMon = mondayOf(Date.now()), first = mondayOf(firstDay()), rows = [];
    for (let s = thisMon; s >= first && rows.length < 52; s = U.addDays(s, -7)) { const a = aggDays(s, 7), p = aggDays(U.addDays(s, -7), 7); rows.push({ s, a, min: a.sec / 60, d: pctDelta(a.sec, p.sec), cur: s === thisMon }); }
    if (!rows.length) return '<div class="small-note">Raporty pojawią się po pierwszym tygodniu nauki.</div>';
    const mx = Math.max.apply(null, rows.map(r => r.min).concat([1]));
    return '<div class="st-rep">' + rows.map(r => '<button class="st-rp" data-rep="' + U.dayKey(r.s) + '" title="Otwórz raport tygodnia"><span>' + weekRangeLabel(r.s) + (r.cur ? ' <small>· w toku</small>' : '') + '</span>' +
      '<span class="st-rpb"><i style="width:' + Math.round(r.min / mx * 100) + '%"></i></span><b>' + Math.round(r.min) + ' min</b>' +
      (r.d == null || r.cur || r.d === 0 ? '<em></em>' : '<em class="' + (r.d > 0 ? 'up' : 'dn') + '">' + (r.d > 0 ? '▲ ' : '▼ ') + Math.abs(r.d) + '%</em>') +
      '<span class="st-rpn">' + r.a.newCount + ' nowych' + (r.a.total ? ' · ' + Math.round(r.a.correct / r.a.total * 100) + '%' : '') + '</span></button>').join('') + '</div>';
  }
  /* Statystyki — 8 zakładek w 3 grupach (upd196) */
  function lastPeriodsHtml(mode) {
    const out = [], today = U.startOfDay();
    if (mode === 'week') { const m0 = mondayOf(today); for (let i = 3; i >= 0; i--) { const s = U.addDays(m0, -7 * i); out.push({ l: new Date(s).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }), m: aggDays(s, 7).sec / 60, cur: !i }); } }
    else { const d = new Date(today); for (let i = 3; i >= 0; i--) { const a = new Date(d.getFullYear(), d.getMonth() - i, 1), b = new Date(d.getFullYear(), d.getMonth() - i + 1, 1); out.push({ l: MONTHS[a.getMonth()].slice(0, 3).toLowerCase(), m: aggDays(a.getTime(), Math.round((b - a) / U.DAY)).sec / 60, cur: !i }); } }
    const mx = Math.max.apply(null, out.map(o => o.m).concat([1]));
    return '<div class="st-fbox"><div class="st-lbl">' + (mode === 'week' ? 'Ostatnie 4 tygodnie' : 'Ostatnie 4 miesiące') + '</div><div class="st-fc st-l4">' + out.map(o => '<div title="' + o.l + ': ' + Math.round(o.m) + ' min"><small>' + Math.round(o.m) + '</small><i style="height:' + Math.round(o.m / mx * 56) + 'px;background:' + (o.cur ? 'linear-gradient(180deg,#7BA3D6,#43699C)' : '#B9B2A8') + '"></i><span>' + o.l + '</span></div>').join('') + '</div></div>';
  }
  function recordsKv() {
    const h = recordsFlat(); if (h.indexOf('rec2') < 0) return h;
    const m = h.match(/<span>(.*?)<\/span><b>(.*?)<\/b>/g) || [];
    return m.map(x => x.replace(/<span>(.*?)<\/span><b>(.*?)<\/b>/, '<div class="st-kv"><span>$1</span><b>$2</b></div>')).join('');
  }
  function badgeTiles() {
    const got = D().badges || {}, on = BADGES.filter(b => got[b.id]);
    const off = BADGES.filter(b => !got[b.id]).map(b => ({ b, p: badgeProg(b.id) })).sort((x, y) => (y.p ? y.p.cur / y.p.max : -1) - (x.p ? x.p.cur / x.p.max : -1));
    const tile = (b, isOn, p) => '<div class="st-bt' + (isOn ? ' on' : '') + '" title="' + esc(b.name + ' — ' + b.desc + (p ? ' (' + p.txt + ')' : '')) + '"><i>' + (isOn ? '★' : '') + '</i><b>' + esc(b.name) + '</b><small>' +
      (isOn ? (got[b.id] ? new Date(got[b.id]).toLocaleDateString('pl-PL') : '') : p ? Math.round(p.cur / p.max * 100) + '%' : esc(b.desc)) + '</small>' + (p ? '<span class="bp"><span style="width:' + Math.round(p.cur / p.max * 100) + '%"></span></span>' : '') + '</div>';
    return '<div class="st-bgrid">' + on.map(b => tile(b, true)).join('') + off.map(x => tile(x.b, false, x.p)).join('') + '</div>';
  }
  function renderStats(mode) {
    S = null;
    mode = mode === 'month' || mode === 'all' ? mode : 'week';
    if (checkBadges().length) Store.save();
    const sd = statsData(mode);
    const skLegend = '<div class="legend">' + Object.keys(SK_COLORS).map(k => '<span><i style="background:' + SK_COLORS[k] + ';height:3px"></i>' + SKILL_NAME[k] + '</span>').join('') + '</div>';
    const TABS = [['min', 'Minuty'], ['sk', 'Umiejętności'], ['act', 'Aktywność i rekordy'], null, ['vm', 'Mapa słownictwa'], ['mi', 'Kamienie milowe'], null, ['rep', 'Raporty'], ['pl', 'Poziom gracza'], ['bd', 'Odznaki']];
    const TL = TABS.filter(Boolean);
    let tab = D().settings.stTab; if (tab === 'acc' || tab === 'lvl') tab = 'sk'; if (!TL.some(t => t[0] === tab)) tab = 'min';
    const ph = (h, right) => '<div class="row between st-ph"><h3>' + h + '</h3>' + (right || '') + '</div>';
    const kv = (a, b) => '<div class="st-kv"><span>' + a + '</span><b>' + b + '</b></div>';
    const tabBody = () => {
      if (tab === 'min') {
        const legendHtml = '<div class="legend">' + (mode === 'all' ? '<span><i style="background:#5A84BC"></i>miesiąc</span>' : '<span><i style="background:#5A84BC"></i>' + sd.curName.toLowerCase() + '</span><span><i style="background:rgba(110,100,90,.2)"></i>' + sd.prevName.toLowerCase() + '</span>') + (sd.avgBars ? '<span><i class="avgi"></i>średnia tego dnia</span>' : '') + '<span><i class="dash"></i>cel ' + (mode === 'all' ? fmtDur(sd.goal * 60) : sd.goal + ' min') + '</span></div>';
        return ph(mode === 'all' ? 'Minuty w kolejnych miesiącach' : mode === 'week' ? 'Minuty dzień po dniu' : 'Minuty tydzień po tygodniu', legendHtml) +
          '<div class="st-21 st-min"><div class="st-minchart">' + barsHtml(Object.assign({}, sd, { h: 300 })) + '</div><div class="st-side"><div class="st-fbox st-kvbox">' + minSideHtml(sd) + '</div>' + lastPeriodsHtml(mode) + '<div class="st-fbox"><div class="st-lbl">Powtórki w najbliższych dniach</div>' + forecastBars() + '</div></div></div>';
      }
      if (tab === 'sk') {
        const due = monthTestDue();
        return ph('Umiejętności', skLegend) +
          '<div class="st-11"><div class="st-skl"><div class="st-lbl">Trafność ' + (mode === 'week' ? 'w tym tygodniu' : mode === 'month' ? 'w tym miesiącu' : 'od początku') + '</div>' + skillAccHtml(sd).replace(/^<h3>.*?<\/h3>/, '') +
          '<div class="small-note">poziom rośnie przy trafności ≥ 85% — <button class="lnk2" id="sWhy">skąd ten poziom?</button></div></div>' +
          '<div class="st-side"><div class="st-lbl">Poziom w czasie</div>' + levelsChartHtml() + kv('Poziom zdań', sentLevel() + ' / 5') +
          '<div class="st-kv"><span>' + (due ? 'Test miesiąca czeka na Ciebie' : 'Następny test miesiąca · ' + new Date(nextTestAt()).toLocaleDateString('pl-PL')) + '</span><span class="row" style="gap:8px">' + (lastTestEntry() ? '<button class="btn small" id="sLastTest">Ostatni wynik</button>' : '') + '<button class="btn small' + (due ? ' primary' : '') + '" id="sTest">Zrób test</button></span></div></div></div>';
      }
      if (tab === 'vm') return '<div class="vm vm-view">' + vocabMapHtml(true) + '</div>';
      if (tab === 'mi') return '<div class="mi-st">' + milesHtml() + '</div>';
      if (tab === 'pl') {
        const li = levelInfo(D().xp), lv = plLevel(), gated = li.level > lv, pld = playerLevelDates();
        const full = playerLevelHtml(), left = full.slice(0, full.indexOf('<div class="pl-two">'));
        const aw = Object.keys(pld).map(Number).filter(l => l <= lv && l > 1).sort((x, y) => y - x).slice(0, 3);
        const toMax = Math.max(0, xpForLevel(PL_MAX) - D().xp);
        return ph('Poziom gracza', '<span class="small-note">punkty za pracę — nie poziom angielskiego</span>') +
          '<div class="st-11 st-pl"><div>' + left + '</div><div class="st-side">' +
          (gated ? '<div class="pl-gate">Do rangi <b>' + PL_RANKS[Math.min(5, Math.floor(lv / 10)) + 1] + '</b> potrzebny wyższy poziom angielskiego — zrób test miesiąca. XP zbiera się dalej: czeka już ' + plPoz(li.level - lv) + '.</div>'
            : '<div class="st-lbl">Do poziomu ' + (lv + 1) + '</div><div class="bar thin inset"><div style="width:' + Math.round(li.into / li.need * 100) + '%"></div></div>' + kv('Brakuje', fmtNum(li.need - li.into) + ' XP')) +
          kv('Za Tobą', fmtNum(D().xp) + ' XP · ' + plPoz(Math.min(lv, PL_MAX))) +
          kv('Do rangi ' + PL_RANKS[5], toMax ? '~' + fmtNum(Math.round(toMax / 100) * 100) + ' XP · ' + plPoz(PL_MAX - lv) : '✓ osiągnięty') +
          (aw.length ? '<div class="st-lbl">Ostatnie awanse</div>' + aw.map(l => kv('Poziom ' + l, new Date(pld[l]).toLocaleDateString('pl-PL'))).join('') : '') +
          '<div class="small-note st-foot">Za dobrą odpowiedź 10–18 XP zależnie od poziomu materiału; z podpowiedzią mniej.</div></div></div>';
      }
      if (tab === 'act') {
        const ks = Object.keys(D().days), sd2 = ks.filter(k => isStudyDay(D().days[k])).length, all = Math.max(1, daysBetween(firstDay(), U.startOfDay()) + 1);
        return '<div class="st-ph" id="heatHead">' + heatYearTitle() + '</div><div class="st-21 st-act"><div id="heatBox">' + heatYearHtml() + '</div><div class="st-side"><div class="st-lbl">Rekordy</div>' + recordsKv() +
          kv('Obecna seria', streak() + ' ' + (streak() === 1 ? 'dzień' : 'dni')) + kv('Dni z nauką', sd2 + ' z ' + all) + '</div></div>';
      }
      if (tab === 'rep') return ph('Raporty tygodniowe', '<span class="small-note">kliknij tydzień — otworzy pełny raport</span>') + reportsBars();
      const n = BADGES.filter(b => (D().badges || {})[b.id]).length;
      return ph('Odznaki <span class="small-note">' + n + ' z ' + BADGES.length + '</span>', '<span class="small-note">zdobyte w kolorze · reszta z postępem</span>') + badgeTiles();
    };
    app.innerHTML =
      '<div class="wrap stats-flat st2 st3">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b style="font-size:26px">Statystyki</b></div>' +
      '<div class="seg inset" role="tablist" aria-label="Zakres"><button class="btn' + (mode === 'week' ? ' on' : '') + '" role="tab" aria-selected="' + (mode === 'week') + '" data-mode="week">Tydzień ' + K('1') + '</button><button class="btn' + (mode === 'month' ? ' on' : '') + '" role="tab" aria-selected="' + (mode === 'month') + '" data-mode="month">Miesiąc ' + K('2') + '</button><button class="btn' + (mode === 'all' ? ' on' : '') + '" role="tab" aria-selected="' + (mode === 'all') + '" data-mode="all">Od początku ' + K('3') + '</button></div></header>' +
      '<div class="st-tabs" role="tablist">' + TABS.map(t => t ? '<button class="st-tab' + (t[0] === tab ? ' on' : '') + '" role="tab" aria-selected="' + (t[0] === tab) + '" data-stt="' + t[0] + '">' + t[1] + '</button>' : '<span class="st-gap"></span>').join('') + '</div>' +
      '<section class="st-page st-t-' + tab + '">' + tabBody() + '</section>' +
      '<section class="st-f"><p class="st-ins">' + esc(insightText(sd)) + '</p><div class="st-kp">' + sd.kpis.map(k => kpiFlat(k, sd)).join('') + kpiTotal(sd) + '</div></section>' +
      '</div>';
    $('#back').onclick = () => go('home');
    /* Minuty: wykres dzień po dniu tej samej wysokości co 3 moduły po prawej (upd230) */
    if (tab === 'min') { const side = $('.st-min .st-side'), ch = $('.st-min .st-minchart'); if (side && ch) { const lb = ch.querySelector('.blabels'), lh = lb ? lb.offsetHeight + 26 : 48; ch.innerHTML = barsHtml(Object.assign({}, sd, { h: Math.max(220, side.offsetHeight - lh) })); } }
    $$('[data-mode]').forEach(b => b.onclick = () => renderStats(b.dataset.mode));
    const setTab = t => { D().settings.stTab = t; Store.save(); renderStats(mode); };
    $$('[data-stt]').forEach(b => b.onclick = () => setTab(b.dataset.stt));
    if ($('#sTest')) $('#sTest').onclick = () => startTest(true);
    if ($('#sLastTest')) $('#sLastTest').onclick = showLastTest;
    if ($('#sWhy')) $('#sWhy').onclick = () => {
      lwhyOpen = true;
      modal('<h2 style="margin:0 0 6px">Skąd ten poziom?</h2><div class="st-why">' + levelWhyHtml() + '</div><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn primary" id="whyX" data-esc>Zamknij ' + K('Esc') + '</button></div>', (ov, close) => {
        ov.querySelector('#whyX').onclick = close;
        ov.querySelectorAll('[data-setlv]').forEach(b => b.onclick = () => {
          const [k, v] = b.dataset.setlv.split(':'); const lv = levels();
          if (lv[k] === +v) return;
          lv[k] = +v; hist()[k] = []; recordLevels('manual', { skill: k });
          progress(); Store.save(); close(); renderStats(mode);
          toast(SKILL_NAME[k] + ': ustawiono ' + L[+v] + '.');
        });
      });
    };
    if ($('#vmGo')) $('#vmGo').onclick = e => { e.preventDefault(); go('words', 'rev'); };
    const bindHeat = () => $$('[data-hyy]').forEach(b => b.onclick = () => { actYear += +b.dataset.hyy; $('#heatHead').innerHTML = heatYearTitle(); $('#heatBox').innerHTML = heatYearHtml(); bindHeat(); });
    bindHeat();
    bindHeat();
    $$('[data-rep]').forEach(b => b.onclick = () => go('report', { week: b.dataset.rep, from: 'stats' }));
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('home'); return; }
      if (e.key === '1') renderStats('week'); else if (e.key === '2') renderStats('month'); else if (e.key === '3') renderStats('all');
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const k = TL.findIndex(t => t[0] === tab), nk = (k + (e.key === 'ArrowRight' ? 1 : TL.length - 1)) % TL.length; setTab(TL[nk][0]); }
    };
  }
  function accBoxHtml(mode, sd, skLegend) {
    return '<div class="row between"><h3>Trafność według umiejętności</h3><button class="lnk2" id="accToggle">' + (stAccLines ? 'teraz' : 'w czasie') + '</button></div>' +
      (stAccLines ? skLegend + linesHtml(mode) : skillAccHtml(sd) + '<div class="small-note" style="margin-top:10px">' + (mode === 'all' ? 'ze wszystkich odpowiedzi' : 'w wybranym okresie') + '</div>');
  }


  /* ================= ETAP 4 — MOJE TEKSTY ================= */
  const ABBR = /\b(Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc|e\.g|i\.e|U\.S|U\.K|a\.m|p\.m)\./g;
  function cleanTranscript(raw) {
    const out = cleanLines(raw);
    const paras = []; let cur = [];
    out.forEach(l => { if (!l) { if (cur.length) { paras.push(cur.join(' ')); cur = []; } } else cur.push(l); });
    if (cur.length) paras.push(cur.join(' '));
    return paras.map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }
  function cleanLines(raw) {
    const out = [];
    String(raw || '').replace(/\r/g, '').replace(/_/g, ' ').split('\n').forEach(line => {
      let l = line.trim();
      if (!l) { if (out.length && out[out.length - 1] !== '') out.push(''); return; }
      if (/^WEBVTT/i.test(l) || /^NOTE\b/.test(l) || /^(Kind|Language):/i.test(l)) return;
      if (/^\d+$/.test(l)) return;                                  // numery napisów .srt
      if (/-->/.test(l)) return;                                    // znaczniki czasu .srt/.vtt
      if (/^\(?\d{1,2}:\d{2}(:\d{2})?\)?$/.test(l)) return;         // YouTube: „0:01”
      l = l.replace(/^\(?\d{1,2}:\d{2}(:\d{2})?\)?\s+/, '');        // YouTube: „0:01 tekst”
      l = l.replace(/<[^>]+>/g, '').replace(/\[(music|muzyka|applause|laughter|brawa|śmiech|silence)\]/gi, '').trim();
      if (!l) return;
      if (out.length && out[out.length - 1] === l) return;          // powtórzenia z auto-napisów
      out.push(l);
    });
    return out;
  }
  function splitSentences(paras) {
    const out = [];
    paras.forEach((p, pi) => {
      const prot = p.replace(ABBR, m => m.replace(/\./g, '§'));
      const parts = prot.match(/[^.!?…]+(?:[.!?…]+["'”’)\]]*|$)/g) || [prot];
      parts.map(s => s.replace(/§/g, '.').trim()).filter(Boolean).forEach(s => {
        const w = s.split(' ');
        if (w.length > 40) { for (let i = 0; i < w.length; i += 18) out.push({ t: w.slice(i, i + 18).join(' '), p: pi }); }
        else out.push({ t: s, p: pi });
      });
    });
    return out;
  }
  function needsPunctuation(paras) {
    const all = paras.join(' ');
    const words = all.split(/\s+/).filter(Boolean).length;
    const ends = (all.match(/[.!?…]/g) || []).length;
    return words > 60 && words / Math.max(1, ends) > 35;
  }
  const TOKS = {};
  function tokenize(sentence) {
    const toks = [], re = /[A-Za-z0-9À-ž]+(?:['’\-][A-Za-z0-9À-ž]+)*/g;
    let m;
    while ((m = re.exec(sentence))) toks.push({ w: m[0], a: m.index, b: m.index + m[0].length });
    return toks;
  }
  function textToks(T) { if (!TOKS[T.id] || TOKS[T.id].length !== T.sents.length) TOKS[T.id] = T.sents.map(s => tokenize(s.t)); return TOKS[T.id]; }
  function markStatus(id) {
    const c = D().cards[id];
    if (!c) return 'new';
    return c.state === 'known' || (c.s || 0) >= 10 ? 'done' : 'learn';
  }
  function textStats(T) {
    const ids = [...new Set(Object.values(T.marks || {}).map(m => m.id))].filter(id => WORDS.byId[id]);
    const st = ids.map(markStatus);
    const words = textToks(T).reduce((a, t) => a + t.length, 0);
    return { words, sents: T.sents.length, marked: ids.length, done: st.filter(x => x === 'done').length, learn: st.filter(x => x === 'learn').length, ids };
  }
  function phraseOf(T, sel) { const tk = textToks(T)[sel.s]; return T.sents[sel.s].t.slice(tk[sel.a].a, tk[sel.b].b); }
  function selKey(sel) { return sel.s + ':' + sel.a + '-' + sel.b; }
  function contextOf(T, i) { return [T.sents[i - 1], T.sents[i + 1]].filter(Boolean).map(x => x.t).join(' '); }
  function markAt(T, s, k) { return Object.values(T.marks || {}).find(m => m.s === s && k >= m.a && k <= m.b); }

  /* ================= TŁUMACZ Z AI — tekst zdanie po zdaniu ================= */
  const TR_PART = 30;
  const TR_STOP = new Set('a an the and or but if so as at by for from in into of off on onto out over to up with about after before than then that this these those there here what which who whom whose when where why how all any some no not only own same such too very can could will would shall should may might must do does did done be is am are was were been being have has had having i me my mine you your yours he him his she her hers it its we us our ours they them their theirs myself yourself itself one two three just also more most much many each other again once both few further under until while because through during against between'.split(' '));
  let TR = null;
  function trData(T) { T.tr = T.tr || { pos: 0, part: 0, done: {} }; T.tr.done = T.tr.done || {}; return T.tr; }
  function trNorm(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  /* nieznane słowa: lista AI z wprowadzenia (bez tych, które już masz w nauce/znanych) */
  function trUnknownSet(T) {
    const tr = trData(T), c = D().cards, set = new Set();
    ((tr.intro && tr.intro.unknown) || []).forEach(u => {
      const low = u.toLowerCase().trim(); if (!low) return;
      const base = WORDS.list.find(w => w.answers.some(a => a.toLowerCase() === low));
      if (base && c[base.id]) return;
      if (Object.values(T.marks || {}).some(m => m.phrase.toLowerCase() === low && c[m.id])) return;
      set.add(low);
    });
    return set;
  }
  function trSentUnknown(T, i, set) {
    const t = ' ' + T.sents[i].t.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ') + ' ';
    let n = 0; set.forEach(u => { if (t.indexOf(' ' + u + ' ') >= 0) n++; });
    return n;
  }
  /* kandydaci do wprowadzenia AI: słowa z bazy powyżej Twojego poziomu bez karty + długie słowa spoza bazy */
  function trCandidates(T) {
    const lv = levels().vocab, c = D().cards, out = new Set();
    T.sents.forEach(s => tokenize(s.t).forEach(tk => {
      const low = tk.w.toLowerCase(); if (TR_STOP.has(low) || low.length < 4 || /\d/.test(low)) return;
      const forms = [low, low.replace(/s$/, ''), low.replace(/es$/, ''), low.replace(/ed$/, ''), low.replace(/d$/, ''), low.replace(/ing$/, ''), low.replace(/ing$/, 'e'), low.replace(/ies$/, 'y'), low.replace(/ied$/, 'y'), low.replace(/ly$/, '')];
      const base = WORDS.list.find(w => forms.indexOf(w.answers[0].toLowerCase()) >= 0);
      if (base) { if (!c[base.id] && base.lvl >= lv) out.add(tk.w); }
      else if (low.length >= 7 && tk.w[0] === low[0]) out.add(tk.w);
    }));
    return [...out].slice(0, 80);
  }
  function trPartRange(T, part) { const a = part * TR_PART; return [a, Math.min(T.sents.length, a + TR_PART)]; }
  function trParts(T) { return Math.max(1, Math.ceil(T.sents.length / TR_PART)); }
  function trBuildList(T) {
    const tr = trData(T), [a, b] = trPartRange(T, tr.part || 0), set = trUnknownSet(T), hard = new Set((tr.intro && tr.intro.hard) || []), list = [];
    for (let i = a; i < b; i++) if (tr.mode !== 'hard' || hard.has(i) || trSentUnknown(T, i, set) > 0) list.push(i);
    if (!list.length) for (let i = a; i < b; i++) list.push(i);
    tr.list = list;
  }
  function trBackDue(T) {
    const tr = T.tr; if (!tr) return [];
    const today = U.startOfDay();
    return Object.keys(tr.done).map(Number).filter(i => { const d = tr.done[i]; return d.better && !d.back && d.at < today; }).slice(0, 5);
  }
  function startTrx(id, view) {
    const T = D().texts[id]; if (!T) return;
    stopReading();
    const tr = trData(T);
    TR = { id, view: view || (tr.list && tr.pos < tr.list.length ? 'sent' : tr.list && tr.list.length && tr.pos >= tr.list.length ? 'done' : 'intro'), marks: {}, ans: '', think: '', busy: false, err: '', fb: null, qa: [], banner: false };
    if (view === 'back') { TR.backList = trBackDue(T); TR.bi = 0; TR.bAns = ''; TR.bRes = null; TR.bOk = 0; }
    go('trx', id);
  }
  function renderTrx() {
    screen = 'trx';
    if (!TR) return go('texts');
    const T = D().texts[TR.id]; if (!T) return go('texts');
    const tr = trData(T), ai = AI.enabled();
    const head = (sub, right) => '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button><div class="ex-title"><b>Tłumacz z AI</b><span>' + sub + '</span></div><div class="tr-right">' + (right || '') + '</div></header>';
    let html = '';
    if (!ai) {
      html = head(esc(T.title)) + '<section class="tr-f"><p style="margin:0">Tłumacz z AI potrzebuje klucza API — ustaw go w Ustawieniach.</p></section>';
    } else if (TR.view === 'intro') {
      const it = tr.intro;
      if (!it) {
        html = head(esc(T.title)) + '<section class="tr-f">' + (TR.err ? '<div class="fb bad">' + IC.alert + '<span>' + esc(TR.err) + '</span></div><div class="row"><button class="btn primary" id="trRetry">Spróbuj jeszcze raz</button></div>' : '<div class="checking"><span class="spinner"></span>AI czyta cały tekst i przygotowuje wprowadzenie…</div>') + '</section>';
      } else {
        const set = trUnknownSet(T), [a, b] = trPartRange(T, tr.part || 0), hard = new Set(it.hard || []);
        let nh = 0; for (let i = a; i < b; i++) if (hard.has(i) || trSentUnknown(T, i, set) > 0) nh++;
        const n = b - a, parts = trParts(T);
        html = head(esc(T.title) + (parts > 1 ? ' · część ' + ((tr.part || 0) + 1) + ' z ' + parts : '')) +
          '<section class="tr-f"><div class="row between"><h2>O czym jest ten tekst</h2>' + aiTag(it.m) + '</div><p class="tr-sum">' + qaFmt(it.summary) + '</p>' +
          '<div class="tr-kv"><div><b>' + esc(it.level || '—') + '</b><span>poziom tekstu</span></div><div><b>' + n + '</b><span>' + (parts > 1 ? 'zdań w tej części' : 'zdań') + '</span></div><div><b>' + nh + '</b><span>trudnych dla Ciebie</span></div><div><b>' + set.size + '</b><span>słów spoza Twojego słownika</span></div></div>' +
          (it.keywords && it.keywords.length ? '<div><div class="small-note" style="margin-bottom:6px">Warto znać przed lekturą</div><div class="tr-chips">' + it.keywords.map(k => '<span class="tr-chip"><b lang="en">' + esc(k.w) + '</b> <small>' + esc(k.pl) + '</small></span>').join('') + '</div></div>' : '') + '</section>' +
          '<h2 class="tr-h2">Jak chcesz pracować? <span class="small-note">kliknij, żeby zacząć</span></h2>' +
          '<div class="tr-modes"><button class="btn tr-mode" data-trmode="hard"><b class="pink">Tylko trudne zdania (' + nh + ')</b><span>Łatwe przeczytasz na końcu z lektorem — ok. ' + Math.max(2, Math.round(nh * 1.3)) + ' min</span>' + K('1') + '</button>' +
          '<button class="btn tr-mode" data-trmode="all"><b>Wszystkie zdania (' + n + ')</b><span>Dokładnie, zdanie po zdaniu — ok. ' + Math.max(3, Math.round(n * 1.1)) + ' min</span>' + K('2') + '</button></div>';
      }
    } else if (TR.view === 'sent' || TR.view === 'fb') {
      const si = tr.list[tr.pos], sn = T.sents[si], toks = tokenize(sn.t), set = trUnknownSet(T), hardSet = new Set((tr.intro && tr.intro.hard) || []);
      const okN = Object.values(tr.done).filter(d => d.v === 'ok').length, wN = tr.words || 0;
      const right = '<span class="small-note">dobrze ' + okN + ' · nowe słowa ' + wN + '</span>';
      const [pa, pb] = trPartRange(T, tr.part || 0), inList = new Set(tr.list);
      let prog = ''; for (let i = pa; i < pb; i++) prog += '<i class="' + (i === si ? 'c' : tr.done[i] ? 'd' : !inList.has(i) ? 'e' : (hardSet.has(i) || trSentUnknown(T, i, set)) ? 'h' : '') + '"></i>';
      const isHard = hardSet.has(si) || trSentUnknown(T, si, set) > 0;
      const sub = 'zdanie ' + (si - pa + 1) + ' z ' + (pb - pa) + (isHard ? ' · trudne' : '') + (trParts(T) > 1 ? ' · część ' + ((tr.part || 0) + 1) + '/' + trParts(T) : '');
      const dup = TR.view === 'sent' && (() => { const k = trNorm(sn.t); const j = Object.keys(tr.done).map(Number).find(x => x !== si && tr.done[x].v === 'ok' && trNorm(T.sents[x].t) === k); return j == null ? null : tr.done[j]; })();
      const sentHtml = (clickable) => { let out = '', last = 0; toks.forEach((tk, k) => { out += esc(sn.t.slice(last, tk.a)); const m = TR.marks[k]; out += '<span class="tr-w' + (m === 'r' ? ' r' : m === 'y' ? ' y' : '') + '"' + (clickable ? ' data-trk="' + k + '"' : '') + ' lang="en">' + esc(tk.w) + '</span>'; last = tk.b; }); return out + esc(sn.t.slice(last)); };
      html = head(sub, right) + '<div class="tr-prog">' + prog + '</div>';
      if (dup) {
        html += '<section class="tr-f tr-card"><div class="tr-sent tr-dup" lang="en">' + esc(sn.t) + '</div><div class="small-note" style="text-align:center">To zdanie już było i przetłumaczyłeś je dobrze:</div><div class="tr-dupt">' + esc(dup.ans || dup.better) + '</div></section>' +
          '<div class="tr-under"><button class="btn primary" id="trDupNext">Dalej ' + K('Enter') + '</button></div>';
        TR.dup = true;
      } else if (TR.view === 'sent') {
        TR.dup = false;
        const prev = si > 0 ? T.sents[si - 1].t : '';
        html += '<section class="tr-f tr-card">' + (prev ? '<div class="small-note tr-prev" lang="en">' + esc(prev.length > 140 ? '…' + prev.slice(-140) : prev) + ' <i>(poprzednie zdanie)</i></div>' : '') +
          '<div class="tr-sent">' + sentHtml(true) + '</div>' +
          '<div class="row center"><button class="btn small" id="trSay">' + IC.speaker + ' Posłuchaj ' + K('S') + '</button></div>' +
          '<div class="tr-hint">Kliknij słowo: raz <b class="r">nie znam</b> · drugi raz <b class="y">domyślam się</b> · trzeci raz — znam (domyślnie wszystkie są znane)</div>' +
          '<div class="tr-lbl"><b>Twoje tłumaczenie</b><span>pisz albo dyktuj po polsku · Enter — sprawdź, Shift+Enter — nowa linia</span></div>' +
          '<div class="tr-ta"><textarea id="trAns" rows="2" class="tr-in" placeholder="Jak brzmi to zdanie po polsku?">' + esc(TR.ans) + '</textarea>' + (Recog.supported() ? '<button class="btn tr-mic' + (TR.mic === 'trAns' ? ' on' : '') + '" data-trmic="trAns" title="Dyktuj po polsku" aria-label="Dyktuj tłumaczenie">' + IC.mic + '</button>' : '') + '</div>' +
          '<div class="tr-lbl"><b>Jak to zrozumiałeś? <span>(opcjonalnie — swobodnie, co myślałeś, czego nie byłeś pewien)</span></b></div>' +
          '<div class="tr-ta"><textarea id="trThink" rows="2" class="tr-in" placeholder="np. nie znałem tego słowa, z kontekstu wyszło mi, że…">' + esc(TR.think) + '</textarea>' + (Recog.supported() ? '<button class="btn tr-mic' + (TR.mic === 'trThink' ? ' on' : '') + '" data-trmic="trThink" title="Dyktuj po polsku" aria-label="Dyktuj">' + IC.mic + '</button>' : '') + '</div>' +
          (TR.busy ? '<div class="checking"><span class="spinner"></span>AI czyta Twoje tłumaczenie…</div>' : TR.err ? '<div class="fb bad">' + IC.alert + '<span>' + esc(TR.err) + '</span></div>' : '') +
          '</section>' +
          '<div class="tr-under between"><button class="btn" id="trHead"' + (TR.busy ? ' disabled' : '') + '>Tłumaczę w głowie — pokaż ' + K('Alt+G') + '</button><button class="btn primary" id="trCheck"' + (TR.busy ? ' disabled' : '') + '>Sprawdź ' + K('Enter') + '</button></div>';
      } else {
        const f = TR.fb, d = tr.done[si] || {};
        const vMap = { ok: ['ok', IC.check, 'Dobrze'], almost: ['unsure', IC.alert, 'Prawie'], wrong: ['bad', IC.alert, 'Nie całkiem'], self: ['unsure', IC.check, 'Tłumaczenie'] };
        const v = vMap[f.verdict] || vMap.self;
        const KIC = { grammar: '⏱', word: '📈', usage: '🔗' };
        html += '<section class="tr-f tr-card"><div class="tr-sent tr-small" lang="en">' + sentHtml(false) + '</div>' +
          '<div class="fb ' + v[0] + '" role="status">' + v[1] + '<span><b>' + v[2] + (f.verdict === 'self' ? '' : ' — ') + '</b>' + (f.verdict === 'self' ? '' : qaFmt(f.headline)) + '</span></div>' +
          (f.verdict === 'self' && d.self == null ? '<div class="tr-self">Zrozumiałeś to tak samo? <button class="btn small" data-trself="1">Tak ' + K('1') + '</button><button class="btn small" data-trself="0">Nie całkiem ' + K('2') + '</button></div>' : '') +
          '<div class="tr-cmp">' + (TR.lastAns ? '<span>Twoje</span><div>' + esc(TR.lastAns) + '</div>' : '') + '<span>' + (TR.lastAns ? 'Lepiej' : 'Tłumaczenie') + '</span><div class="tr-better">' + esc(f.better) + '</div></div>' +
          '<div class="row between"><b class="tr-h3">Komentarz</b>' + aiTag(f.m) + '</div><div class="tr-aic">' + qaFmt(f.comment) + '</div>' +
          (f.learn && f.learn.length ? '<div class="tr-learn"><b class="tr-h3">Warto zapamiętać</b>' + f.learn.map(l => '<div><span>' + (KIC[l.kind] || '•') + '</span><span>' + qaFmt(l.text) + '</span></div>').join('') + '</div>' : '') +
          (f.words && f.words.length ? '<div><b class="tr-h3">Słowa z tego zdania</b>' + f.words.map((w, k) => '<div class="tr-wrow"><i class="' + (w.kind === 'red' ? 'r' : w.kind === 'yellow' ? 'y' : 'm') + '"></i><span><b lang="en">' + esc(w.phrase || w.surface) + '</b> — ' + esc(w.pl) + (w.note ? ' <span class="small-note">· ' + qaFmt(w.note) + '</span>' : '') + '</span>' +
            (w.added ? '<span class="small-note">✓ dodane do nauki</span>' : w.known ? '<span class="small-note">znasz</span>' : '<span class="row" style="gap:8px"><button class="btn small" data-trwk="' + k + '">Znam</button><button class="btn small primary" data-trwa="' + k + '">Do nauki</button></span>') + '</div>').join('') + '</div>' : '') +
          (TR.qa.length ? '<div class="tr-qa">' + TR.qa.map(q => '<div class="tr-q">' + esc(q.q) + '</div><div class="tr-a">' + (q.a ? qaFmt(q.a) : '<span class="spinner"></span>') + '</div>').join('') + '</div>' : '') +
          (TR.ask ? '<div class="tr-ta"><input id="trAsk" class="tr-in" placeholder="Zapytaj o to zdanie… (Enter)" autocomplete="off"></div>' : '') +
          '</section>' +
          '<div class="tr-under"><button class="btn" id="trMore">Zapytaj o to zdanie ' + K('Alt+E') + '</button><button class="btn primary" id="trNext">Dalej ' + K('Enter') + '</button></div>';
        if (TR.banner) {
          const rest = tr.list.slice(tr.pos + 1), hs = new Set((tr.intro && tr.intro.hard) || []), hrest = rest.filter(i => hs.has(i));
          html += '<div class="tr-banner"><span><b>Do końca ' + (trParts(T) > 1 ? 'tej części' : 'tekstu') + ' nie ma już słów spoza Twojego słownika.</b> ' + (hrest.length ? 'Zostały ' + hrest.length + ' trudniejsze zdania (gramatyka). ' : '') + 'Resztę możesz przeczytać swobodnie z lektorem.</span><span class="row" style="gap:14px;flex:none">' +
            (hrest.length ? '<button class="btn" id="trOnlyHard">Tylko ' + hrest.length + ' trudne</button>' : '<button class="btn" id="trKeep">Tłumacz dalej</button>') + '<button class="btn" id="trRestRead">Czytaj resztę</button></span></div>';
        }
      }
    } else if (TR.view === 'done') {
      const [pa, pb] = trPartRange(T, tr.part || 0), ds = []; for (let i = pa; i < pb; i++) if (tr.done[i]) ds.push(tr.done[i]);
      const c = v => ds.filter(d => d.v === v).length, learn = [];
      ds.forEach(d => (d.learn || []).forEach(l => { if (l.kind === 'grammar' && learn.length < 5 && learn.indexOf(l.text) < 0) learn.push(l.text); }));
      const parts = trParts(T), more = (tr.part || 0) < parts - 1;
      html = head(esc(T.title) + (parts > 1 ? ' · część ' + ((tr.part || 0) + 1) + ' z ' + parts : '')) +
        '<section class="tr-f"><h2>' + (more ? 'Część zrobiona' : 'Tekst zrobiony') + '</h2>' +
        '<div class="tr-kv"><div><b>' + ds.length + '</b><span>zdań przetłumaczonych</span></div><div><b class="ok2">' + (c('ok') + ds.filter(d => d.v === 'self' && d.self).length) + '</b><span>dobrze</span></div><div><b>' + (c('almost')) + '</b><span>prawie</span></div><div><b>' + (tr.partWords || 0) + '</b><span>nowych słów do nauki</span></div></div>' +
        (learn.length ? '<div class="tr-learn"><b class="tr-h3">Gramatyka, która się pojawiła</b>' + learn.map(t => '<div><span>⏱</span><span>' + qaFmt(t) + '</span></div>').join('') + '</div>' : '') +
        '<div class="small-note">Na koniec dwie krótkie rzeczy, które najbardziej utrwalają: przeczytaj całość płynnie z lektorem i powiedz albo napisz po angielsku, o czym był tekst.</div></section>' +
        '<div class="tr-under"><button class="btn" id="trReadAll">' + IC.speaker + ' Przeczytaj całość z lektorem ' + K('L') + '</button><button class="btn" id="trRetell">Streszczenie po angielsku ' + K('R') + '</button>' +
        (more ? '<button class="btn primary" id="trNextPart">Następna część ' + K('Enter') + '</button>' : '<button class="btn primary" id="trFinish">Zakończ ' + K('Enter') + '</button>') + '</div>';
    } else if (TR.view === 'retell') {
      const r = TR.ret;
      html = head(esc(T.title) + ' · streszczenie') +
        '<section class="tr-f"><h2>O czym był tekst? <span class="small-note">3–5 zdań po angielsku — powiedz albo napisz</span></h2>' +
        '<div class="tr-ta"><textarea id="trRet" rows="5" class="tr-in" placeholder="This text is about…">' + esc(TR.retAns || '') + '</textarea>' + (Recog.supported() ? '<button class="btn tr-mic' + (TR.mic === 'trRet' ? ' on' : '') + '" data-trmic="trRet" data-lang="en-US" title="Mów po angielsku" aria-label="Dyktuj po angielsku">' + IC.mic + '</button>' : '') + '</div>' +
        (TR.busy ? '<div class="checking"><span class="spinner"></span>AI czyta Twoje streszczenie…</div>' : TR.err ? '<div class="fb bad">' + IC.alert + '<span>' + esc(TR.err) + '</span></div>' : '') +
        (r ? '<div class="row between"><b class="tr-h3">Poprawione</b>' + aiTag(r.m) + '</div><div class="tr-better" lang="en">' + esc(r.corrected) + '</div><div class="tr-aic">' + qaFmt(r.comment) + '</div>' +
          (r.phrases && r.phrases.length ? '<div class="tr-learn"><b class="tr-h3">Zwroty z tekstu, których mogłeś użyć</b>' + r.phrases.map(p => '<div><span>🔗</span><span>' + qaFmt(p) + '</span></div>').join('') + '</div>' : '') : '') + '</section>' +
        '<div class="tr-under"><button class="btn" id="trRetBack">Wróć do podsumowania</button>' + (r ? '' : '<button class="btn primary" id="trRetCheck"' + (TR.busy ? ' disabled' : '') + '>Sprawdź ' + K('Enter') + '</button>') + (r ? '<button class="btn primary" id="trFinish">Zakończ ' + K('Enter') + '</button>' : '') + '</div>';
    } else if (TR.view === 'back') {
      const L2 = TR.backList || [], i = L2[TR.bi];
      if (i == null) {
        html = head(esc(T.title) + ' · tłumaczenie wsteczne') + '<section class="tr-f"><h2>Gotowe</h2><p style="margin:0">Przetłumaczyłeś z powrotem ' + L2.length + ' ' + (L2.length === 1 ? 'zdanie' : 'zdań') + ' — dobrze: <b>' + TR.bOk + '</b>.</p></section><div class="tr-under"><button class="btn primary" id="trFinish">Zakończ ' + K('Enter') + '</button></div>';
      } else {
        const d = tr.done[i], r = TR.bRes;
        html = head(esc(T.title) + ' · tłumaczenie wsteczne ' + (TR.bi + 1) + ' z ' + L2.length) +
          '<section class="tr-f tr-card"><div class="small-note" style="text-align:center">Wczoraj tłumaczyłeś to zdanie z angielskiego. Napisz je teraz z powrotem po angielsku:</div><div class="tr-sent tr-small">' + esc(d.better) + '</div>' +
          '<div class="tr-ta"><textarea id="trBack" rows="2" class="tr-in" placeholder="In English…"' + (r ? ' disabled' : '') + '>' + esc(TR.bAns) + '</textarea>' + (Recog.supported() && !r ? '<button class="btn tr-mic' + (TR.mic === 'trBack' ? ' on' : '') + '" data-trmic="trBack" data-lang="en-US" aria-label="Dyktuj po angielsku">' + IC.mic + '</button>' : '') + '</div>' +
          (TR.busy ? '<div class="checking"><span class="spinner"></span>AI porównuje z oryginałem…</div>' : TR.err ? '<div class="fb bad">' + IC.alert + '<span>' + esc(TR.err) + '</span></div>' : '') +
          (r ? '<div class="fb ' + (r.ok ? 'ok' : 'unsure') + '">' + (r.ok ? IC.check : IC.alert) + '<span><b>' + (r.ok ? 'Dobrze' : 'Inaczej niż w oryginale') + '</b></span></div><div class="tr-cmp"><span>Oryginał</span><div class="tr-better" lang="en">' + esc(T.sents[i].t) + '</div></div><div class="tr-aic">' + qaFmt(r.comment) + '</div>' : '') + '</section>' +
          '<div class="tr-under">' + (r ? '<button class="btn primary" id="trBNext">Dalej ' + K('Enter') + '</button>' : '<button class="btn" id="trBSkip">Pomiń</button><button class="btn primary" id="trBCheck"' + (TR.busy ? ' disabled' : '') + '>Sprawdź ' + K('Enter') + '</button>') + '</div>';
      }
    }
    app.innerHTML = '<div class="wrap tr-wrap">' + html + '</div>';
    bindTrx(T);
  }
  async function trLoadIntro(T) {
    const tr = trData(T); if (tr.intro || TR.loading) return;
    TR.loading = true; TR.err = '';
    try {
      const words = []; let n = 0;
      const lines = T.sents.map((s, i) => i + '. ' + s.t).filter(l => { n += l.split(' ').length; return n < 5000; });
      const it = await AI.trIntro(T.title, lines.join('\n'), trCandidates(T), L[levels().vocab]);
      it.m = AI.lastModel(); tr.intro = it; Store.save();
    } catch (e) { TR.err = AI.humanError(e); }
    TR.loading = false;
    if (screen === 'trx' && TR && TR.view === 'intro') renderTrx();
  }
  function trAddWord(T, si, w) {
    const sent = T.sents[si].t, phrase = (w.phrase || w.surface || '').trim(), surface = (w.surface || phrase).trim(); if (!surface) return;
    const lowP = phrase.toLowerCase(), lowS = surface.toLowerCase();
    const base = WORDS.list.find(x => x.answers.some(a => a.toLowerCase() === lowP || a.toLowerCase() === lowS));
    let id;
    if (base) { id = base.id; playMiss(id); }
    else {
      const k = sent.toLowerCase().indexOf(lowS);
      id = 't-' + (slugify(surface) || Date.now().toString(36));
      if (WORDS.byId[id] && !(D().custom || {})[id]) id += '-' + Date.now().toString(36);
      if (!(D().custom || {})[id]) {
        D().custom = D().custom || {};
        const s = k >= 0 ? clozeFromText(sent, k, k + surface.length) : '_ — ' + sent;
        D().custom[id] = { answers: [k >= 0 ? sent.slice(k, k + surface.length) : surface], pl: w.pl + (lowP !== lowS ? ' (' + phrase + ')' : ''), s, lvl: levels().vocab, added: Date.now(), textId: T.id, textTitle: T.title };
        registerCustom();
      }
    }
    const toks = tokenize(sent), parts = lowS.split(/\s+/);
    const a = toks.findIndex((tk, j) => parts.every((p, q) => toks[j + q] && toks[j + q].w.toLowerCase() === p.replace(/[^a-z0-9'’-]/g, '')));
    if (a >= 0) { const sel = { s: si, a, b: a + parts.length - 1 }; T.marks = T.marks || {}; T.marks[selKey(sel)] = { s: si, a: sel.a, b: sel.b, phrase: surface, pl: w.pl, id, at: Date.now() }; }
    const tr = trData(T); tr.words = (tr.words || 0) + 1; tr.partWords = (tr.partWords || 0) + 1;
  }
  async function trCheck(T, inHead) {
    if (TR.busy) return;
    const tr = trData(T), si = tr.list[tr.pos], sn = T.sents[si];
    const ans = inHead ? '' : ($('#trAns').value || '').trim(), think = ($('#trThink').value || '').trim();
    if (!inHead && !ans) { TR.err = 'Wpisz albo powiedz tłumaczenie — albo kliknij „Tłumaczę w głowie”.'; renderTrx(); return; }
    if (TR.mic) Recog.stop();
    TR.ans = ans; TR.think = think; TR.busy = true; TR.err = ''; renderTrx();
    const toks = tokenize(sn.t), red = [], yellow = [];
    Object.keys(TR.marks).forEach(k => { (TR.marks[k] === 'r' ? red : yellow).push(toks[+k].w); });
    try {
      const f = await AI.trJudge({ level: L[levels().vocab], summary: (tr.intro && tr.intro.summary) || T.title, prev: si > 0 ? T.sents[si - 1].t : '', next: T.sents[si + 1] ? T.sents[si + 1].t : '', sentence: sn.t, translation: ans, think, red, yellow });
      f.m = AI.lastModel(); if (inHead) f.verdict = 'self';
      (f.words || []).forEach(w => { if (w.kind === 'red') { trAddWord(T, si, w); w.added = true; } });
      tr.done[si] = { v: f.verdict, ans, think, better: f.better, learn: f.learn || [], at: Date.now(), back: false };
      TR.fb = f; TR.lastAns = ans; TR.view = 'fb'; TR.qa = []; TR.ask = false;
      const set = trUnknownSet(T), rest = tr.list.slice(tr.pos + 1), [pa, pb] = trPartRange(T, tr.part || 0), after = []; for (let i = si + 1; i < pb; i++) after.push(i);
      TR.banner = tr.mode === 'all' && rest.length >= 3 && !tr.bannerSeen && after.every(i => trSentUnknown(T, i, set) === 0);
      Store.save(); Sound.play(f.verdict === 'ok' ? 'ok' : 'uns');
    } catch (e) { TR.err = AI.humanError(e); }
    TR.busy = false; if (screen === 'trx') renderTrx();
  }
  function trNext(T) {
    const tr = trData(T);
    tr.pos++; TR.marks = {}; TR.ans = ''; TR.think = ''; TR.fb = null; TR.err = ''; TR.banner = false; TR.view = tr.pos >= tr.list.length ? 'done' : 'sent';
    Store.save(); renderTrx();
  }
  function trMic(id, lang) {
    if (TR.mic) { Recog.stop(); return; }
    const el = document.getElementById(id); if (!el) return;
    const before = el.value ? el.value.trim() + ' ' : '';
    TR.mic = id; const keep = () => { const e2 = document.getElementById(id); if (e2) { if (id === 'trAns') TR.ans = e2.value; else if (id === 'trThink') TR.think = e2.value; else if (id === 'trRet') TR.retAns = e2.value; else if (id === 'trBack') TR.bAns = e2.value; } };
    keep(); renderTrx();
    Recog.listen({
      silenceMs: 3500, lang: lang || 'pl-PL',
      onInterim: t => { const e2 = document.getElementById(id); if (e2) e2.value = before + t; },
      onResult: alts => { TR.mic = null; const e2 = document.getElementById(id); if (e2) e2.value = before + (alts[0] || ''); keep(); renderTrx(); },
      onError: err => { TR.mic = null; if (err !== 'aborted') TR.err = recogMsg(err); renderTrx(); }
    });
  }
  function bindTrx(T) {
    const tr = trData(T), on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    const leave = () => { if (TR && TR.mic) Recog.stop(); TR = null; go('texts'); };
    on('#back', leave);
    if (TR.view === 'intro' && !tr.intro && !TR.err && AI.enabled()) trLoadIntro(T);
    on('#trRetry', () => { TR.err = ''; renderTrx(); });
    const startMode = m => { tr.mode = m; tr.pos = 0; trBuildList(T); tr.partWords = 0; TR.view = 'sent'; Store.save(); renderTrx(); };
    $$('[data-trmode]').forEach(b => b.onclick = () => startMode(b.dataset.trmode));
    $$('[data-trk]').forEach(b => b.onclick = () => { const k = b.dataset.trk, m = TR.marks[k]; TR.ans = ($('#trAns') || {}).value || TR.ans; TR.think = ($('#trThink') || {}).value || TR.think; if (!m) TR.marks[k] = 'r'; else if (m === 'r') TR.marks[k] = 'y'; else delete TR.marks[k]; b.className = 'tr-w' + (TR.marks[k] === 'r' ? ' r' : TR.marks[k] === 'y' ? ' y' : ''); });
    on('#trSay', () => Speech.speak(T.sents[tr.list[tr.pos]].t, D().settings.rate || 0.95));
    $$('[data-trmic]').forEach(b => b.onclick = () => trMic(b.dataset.trmic, b.dataset.lang));
    ['#trAns', '#trThink'].forEach(sel => { const el = $(sel); if (el) el.oninput = () => { if (sel === '#trAns') TR.ans = el.value; else TR.think = el.value; }; });
    on('#trCheck', () => trCheck(T, false));
    on('#trHead', () => trCheck(T, true));
    on('#trDupNext', () => { const si = tr.list[tr.pos], k = trNorm(T.sents[si].t), j = Object.keys(tr.done).map(Number).find(x => tr.done[x].v === 'ok' && trNorm(T.sents[x].t) === k); if (j != null) tr.done[si] = Object.assign({}, tr.done[j], { at: Date.now(), back: true }); trNext(T); });
    $$('[data-trself]').forEach(b => b.onclick = () => { const d = tr.done[tr.list[tr.pos]]; d.self = b.dataset.trself === '1'; Store.save(); renderTrx(); });
    $$('[data-trwa]').forEach(b => b.onclick = () => { const w = TR.fb.words[+b.dataset.trwa]; trAddWord(T, tr.list[tr.pos], w); w.added = true; progress(); Store.save(); renderTrx(); });
    $$('[data-trwk]').forEach(b => b.onclick = () => { TR.fb.words[+b.dataset.trwk].known = true; renderTrx(); });
    on('#trMore', () => { TR.ask = true; renderTrx(); const i = $('#trAsk'); if (i) i.focus(); });
    const ask = $('#trAsk');
    if (ask) ask.onkeydown = async e => {
      if (e.key !== 'Enter' || !ask.value.trim()) return; e.preventDefault();
      const q = { q: ask.value.trim(), a: '' }; TR.qa.push(q); TR.ask = false; renderTrx();
      const si = tr.list[tr.pos];
      try { q.a = await AI.askAboutText(q.q, '', T.sents[si].t, contextOf(T, si), TR.qa.slice(0, -1).filter(x => x.a)); } catch (er) { q.a = AI.humanError(er); }
      if (screen === 'trx' && TR && TR.view === 'fb') renderTrx();
    };
    on('#trNext', () => trNext(T));
    on('#trKeep', () => { tr.bannerSeen = true; TR.banner = false; renderTrx(); });
    on('#trOnlyHard', () => { const hs = new Set((tr.intro && tr.intro.hard) || []); tr.bannerSeen = true; tr.list = tr.list.slice(0, tr.pos + 1).concat(tr.list.slice(tr.pos + 1).filter(i => hs.has(i))); trNext(T); });
    on('#trRestRead', () => { tr.bannerSeen = true; tr.list = tr.list.slice(0, tr.pos + 1); trNext(T); });
    on('#trReadAll', () => { const id = T.id; TR = null; go('reader', id); setTimeout(() => { const b = document.getElementById('rPlay'); if (b) b.click(); }, 400); });
    on('#trRetell', () => { TR.view = 'retell'; TR.ret = null; TR.err = ''; renderTrx(); const t = $('#trRet'); if (t) t.focus(); });
    on('#trRetBack', () => { TR.view = 'done'; renderTrx(); });
    const ret = $('#trRet'); if (ret) ret.oninput = () => { TR.retAns = ret.value; };
    on('#trRetCheck', async () => {
      const v = ($('#trRet').value || '').trim(); if (!v) { TR.err = 'Napisz albo powiedz kilka zdań po angielsku.'; renderTrx(); return; }
      if (TR.mic) Recog.stop();
      TR.retAns = v; TR.busy = true; TR.err = ''; renderTrx();
      const [pa, pb] = trPartRange(T, tr.part || 0);
      try { const r = await AI.trRetell({ level: L[levels().vocab], text: T.sents.slice(pa, pb).map(s => s.t).join(' '), retell: v }); r.m = AI.lastModel(); TR.ret = r; tr.retell = (tr.retell || 0) + 1; Store.save(); }
      catch (e) { TR.err = AI.humanError(e); }
      TR.busy = false; if (screen === 'trx') renderTrx();
    });
    on('#trNextPart', () => { tr.part = (tr.part || 0) + 1; tr.pos = 0; tr.list = null; tr.bannerSeen = false; TR.view = 'intro'; Store.save(); renderTrx(); });
    on('#trFinish', leave);
    const bk = $('#trBack'); if (bk) bk.oninput = () => { TR.bAns = bk.value; };
    on('#trBSkip', () => { TR.bi++; TR.bAns = ''; TR.bRes = null; TR.err = ''; renderTrx(); });
    on('#trBCheck', async () => {
      const v = ($('#trBack').value || '').trim(); if (!v) { TR.err = 'Napisz zdanie po angielsku.'; renderTrx(); return; }
      if (TR.mic) Recog.stop();
      const i = TR.backList[TR.bi], d = tr.done[i];
      TR.bAns = v; TR.busy = true; TR.err = ''; renderTrx();
      try {
        const same = trNorm(v) === trNorm(T.sents[i].t);
        const r = same ? { ok: true, comment: 'Dokładnie jak w oryginale.' } : await AI.trBack({ pl: d.better, original: T.sents[i].t, answer: v });
        TR.bRes = r; if (r.ok) TR.bOk++; d.back = true; d.backOk = !!r.ok; Store.save(); Sound.play(r.ok ? 'ok' : 'uns');
      } catch (e) { TR.err = AI.humanError(e); }
      TR.busy = false; if (screen === 'trx') renderTrx();
    });
    on('#trBNext', () => { TR.bi++; TR.bAns = ''; TR.bRes = null; renderTrx(); const t = $('#trBack'); if (t) t.focus(); });
    const fa = $('#trAns'); if (fa && TR.view === 'sent' && !TR.busy) fa.focus();
    const fb2 = $('#trBack'); if (fb2 && !fb2.disabled) fb2.focus();
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); if (TR.mic) { Recog.stop(); return; } leave(); return; }
      const inField = typingInField();
      if (TR.view === 'intro' && !inField) { if (e.key === '1' && $('[data-trmode="hard"]')) { e.preventDefault(); startMode('hard'); } if (e.key === '2' && $('[data-trmode="all"]')) { e.preventDefault(); startMode('all'); } return; }
      if (TR.view === 'sent') {
        if (TR.dup && e.key === 'Enter') { e.preventDefault(); $('#trDupNext').click(); return; }
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); trCheck(T, false); return; }
        if (altKey(e, 'KeyG')) { e.preventDefault(); trCheck(T, true); return; }
        if (!inField && plainKey(e, 'KeyS')) { e.preventDefault(); $('#trSay').click(); }
        return;
      }
      if (TR.view === 'fb') {
        if (document.activeElement && document.activeElement.id === 'trAsk') return;
        if (e.key === 'Enter') { e.preventDefault(); trNext(T); return; }
        if (altKey(e, 'KeyE')) { e.preventDefault(); $('#trMore').click(); return; }
        if (!inField && (e.key === '1' || e.key === '2') && $('[data-trself="1"]')) { e.preventDefault(); $('[data-trself="' + (e.key === '1' ? '1' : '0') + '"]').click(); }
        return;
      }
      if (TR.view === 'done' && !inField) {
        if (e.key === 'Enter') { e.preventDefault(); ($('#trNextPart') || $('#trFinish')).click(); }
        if (plainKey(e, 'KeyL')) { e.preventDefault(); $('#trReadAll').click(); }
        if (plainKey(e, 'KeyR')) { e.preventDefault(); $('#trRetell').click(); }
        return;
      }
      if (TR.view === 'retell' && e.key === 'Enter' && !e.shiftKey) { if ($('#trRetCheck')) { e.preventDefault(); $('#trRetCheck').click(); } else if ($('#trFinish') && !inField) { e.preventDefault(); $('#trFinish').click(); } return; }
      if (TR.view === 'back' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ($('#trBCheck') || $('#trBNext') || $('#trFinish')).click(); }
    };
  }

  /* ---------- Lista tekstów i dodawanie ---------- */
  const TXO = { open: null, add: false, edit: null };
  function autoTitle(sents) {
    const t = (sents[0] && sents[0].t || '').replace(/\s+/g, ' ').trim();
    const w = t.split(' '); const out = [];
    for (let i = 0; i < w.length && i < 6; i++) { out.push(w[i]); if (/[.,;:!?…]$/.test(w[i])) break; }
    const cut = out.length < w.length;
    if (cut) while (out.length > 2 && /^(a|an|the|and|or|but|of|to|in|on|at|for|with|is|are|was|were|be|my|your|his|her|its|our|their|this|that)$/i.test(out[out.length - 1])) out.pop();
    let r = out.join(' ').replace(/[.,;:!?…"”]+$/, '');
    return r + (cut ? '…' : '');
  }
  const PEN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>';
  const BIN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>';
  function renderTexts() {
    S = null; stopReading();
    const texts = Object.values(D().texts || {}).sort((a, b) => b.added - a.added);
    const ai = AI.enabled();
    if (!texts.length) TXO.add = true;
    if (TXO.open && !D().texts[TXO.open]) TXO.open = null;
    const trInfo = T => {
      const st = textStats(T), tr = T.tr;
      const trDone = tr ? Object.keys(tr.done || {}).length : 0, trOk = tr ? Object.values(tr.done || {}).filter(d => d.v === 'ok' || d.self).length : 0;
      const pct = trDone ? Math.round(trDone / st.sents * 100) : st.marked ? Math.round(st.done / st.marked * 100) : 0;
      const grad = trDone ? '#5A84BC' : '#5D9A6E';
      return { st, tr, trDone, trOk, pct, grad };
    };
    const rowHtml = (T, i) => {
      const { st, pct, grad } = trInfo(T);
      return '<button class="trow raised" data-topen="' + T.id + '"><span class="t">' + esc(T.title) + '</span><span class="m">' + st.words + ' słów · ' + new Date(T.added).toLocaleDateString('pl-PL') + '</span>' +
        '<span class="mini inset"><span style="width:' + pct + '%;background:' + grad + '"></span></span>' + (i < 9 ? K(String(i + 1)) : '') + '<span class="chev">▼</span></button>';
    };
    const openHtml = (T, i) => {
      const { st, tr, trDone, trOk, pct, grad } = trInfo(T);
      const trIn = tr && tr.list && tr.pos < tr.list.length, back = trBackDue(T).length;
      const trLabel = trIn ? 'Tłumacz z AI — dalej od zdania ' + (tr.list[tr.pos] + 1) : 'Tłumacz z AI';
      const ttl = TXO.edit === T.id
        ? '<input id="tEdit" class="txt tedit" value="' + esc(T.title) + '" maxlength="80" autocomplete="off" aria-label="Tytuł tekstu"><button class="btn small" id="tEditOk">Zapisz ' + K('Enter') + '</button>'
        : '<button class="tt-name" data-topen="' + T.id + '" title="Zwiń">' + esc(T.title) + '</button><button class="pen raised-sm" data-tedit="' + T.id + '" title="Zmień tytuł" aria-label="Zmień tytuł">' + PEN + '</button><button class="chev" data-topen="' + T.id + '" title="Zwiń" aria-label="Zwiń">▲</button>';
      return '<div class="tblock" data-tid="' + T.id + '"><div class="topen"><div class="tt-row">' + ttl + '</div>' +
        '<div class="small-note">' + st.words + ' słów · ' + st.sents + ' zdań · dodano ' + new Date(T.added).toLocaleDateString('pl-PL') + (trDone ? ' · Tłumacz z AI: <b>' + trDone + ' z ' + st.sents + ' zdań</b> (dobrze ' + trOk + ')' : '') + ' · zaznaczone do nauki: <b>' + st.marked + '</b> · w nauce: <b>' + st.learn + '</b> · opanowane: <b>' + st.done + '</b></div>' +
        '<div class="bar thin inset"><div style="width:' + pct + '%;background:' + grad + '"></div></div></div>' +
        '<div class="tbtns">' + (ai ? '<button class="btn small primary" data-ttr="' + T.id + '">' + trLabel + ' ' + K('T') + '</button>' : '') +
        (back ? '<button class="btn small" data-tback="' + T.id + '" title="Wczoraj tłumaczone zdania — napisz je z powrotem po angielsku">Tłumaczenie wsteczne (' + back + ')</button>' : '') +
        '<button class="btn small" data-tread="' + T.id + '">Czytaj ' + K('C') + '</button>' +
        '<button class="btn small tdel" data-tdel="' + T.id + '" title="Usuń tekst" aria-label="Usuń tekst">' + BIN + '</button></div></div>';
    };
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Wróć ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Moje teksty</b><span>czytaj, tłumacz z AI, ucz się z własnych materiałów</span></div>' +
      (TXO.add && texts.length ? '<button class="btn" id="tAddToggle">Anuluj</button>' : TXO.add ? '<div style="width:110px"></div>' : '<button class="btn primary" id="tAddToggle">+ Dodaj tekst ' + K('N') + '</button>') + '</header>' +
      (TXO.add ? '<div class="tblock"><section class="list-card tadd"><h2 style="font-size:20px">Nowy tekst</h2>' +
      '<p class="small-note desc" style="margin:0">Wklej artykuł, fragment książki albo transkrypcję z YouTube. <b>Transkrypcja z YouTube:</b> pod filmem kliknij „…więcej” → „Pokaż transkrypcję”, zaznacz cały tekst, skopiuj i wklej tutaj — znaczniki czasu usunę sam. Możesz też wczytać plik napisów <b>.srt</b>, <b>.vtt</b> albo <b>.txt</b>.</p>' +
      '<textarea id="tBody" class="txt area" rows="8" spellcheck="false" placeholder="Wklej tutaj tekst po angielsku… (tytuł nadam sam — poprawisz go ołówkiem)"></textarea>' +
      '<div id="tPunct" hidden><label class="check"><input type="checkbox" id="tPunctCb"' + (ai ? ' checked' : ' disabled') + '> Tekst nie ma kropek ani przecinków — popraw interpunkcję z AI' + (ai ? '' : ' (wymaga klucza API)') + '</label></div>' +
      '</section><div class="tbtns"><label class="btn small" for="tFile" style="cursor:pointer">Wczytaj plik…</label><input type="file" id="tFile" accept=".txt,.srt,.vtt,text/plain" hidden><span class="small-note" id="tInfo" style="align-self:center"></span>' +
      '<button class="btn small primary" id="tAdd" style="margin-left:auto">Dodaj tekst</button></div><div id="tMsg"></div></div>' : '') +
      (texts.length ? '<div class="tsec">Twoje teksty · ' + texts.length + '</div><section class="col tlist">' + texts.map((T, i) => TXO.open === T.id ? openHtml(T, i) : rowHtml(T, i)).join('') + '</section>' : '') +
      '</div>';
    if (TXO.edit && $('#tEdit')) {
      const inp = $('#tEdit'); inp.focus(); inp.select();
      const save = () => { const v = inp.value.trim(); const T = D().texts[TXO.edit]; if (T && v) { T.title = v; Store.save(); } TXO.edit = null; renderTexts(); };
      $('#tEditOk').onclick = save;
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); save(); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); TXO.edit = null; renderTexts(); } };
    }
    $$('[data-topen]').forEach(b => b.onclick = () => { const id = b.dataset.topen; TXO.open = TXO.open === id ? null : id; TXO.edit = null; renderTexts(); });
    $$('[data-tedit]').forEach(b => b.onclick = () => { TXO.edit = b.dataset.tedit; renderTexts(); });
    if ($('#tAddToggle')) $('#tAddToggle').onclick = () => { TXO.add = !TXO.add; renderTexts(); if (TXO.add && $('#tBody')) $('#tBody').focus(); };
    if (TXO.add) bindTextAdd(ai);
    $$('[data-tread]').forEach(b => b.onclick = () => go('reader', b.dataset.tread));
    $$('[data-ttr]').forEach(b => b.onclick = () => startTrx(b.dataset.ttr));
    $$('[data-tback]').forEach(b => b.onclick = () => startTrx(b.dataset.tback, 'back'));
    $$('[data-tdel]').forEach(b => b.onclick = () => deleteText(b.dataset.tdel));
    $('#back').onclick = () => go('home');
    keyHandler = e => {
      if (typingInField()) { if (e.key === 'Escape') { e.preventDefault(); document.activeElement.blur(); } return; }
      if (e.key === 'Escape') { e.preventDefault(); if (TXO.add && texts.length) { TXO.add = false; renderTexts(); } else if (TXO.open) { TXO.open = null; renderTexts(); } else go('home'); return; }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (/^[1-9]$/.test(e.key) && texts[+e.key - 1]) { e.preventDefault(); const id = texts[+e.key - 1].id; TXO.open = TXO.open === id ? null : id; TXO.edit = null; renderTexts(); return; }
      if (plainKey(e, 'KeyN') && texts.length && !TXO.add) { e.preventDefault(); $('#tAddToggle').click(); return; }
      const O = TXO.open && D().texts[TXO.open]; if (!O) return;
      if (plainKey(e, 'KeyT') && ai) { e.preventDefault(); startTrx(O.id); }
      else if (plainKey(e, 'KeyC')) { e.preventDefault(); go('reader', O.id); }
    };
  }
  function bindTextAdd(ai) {
    let fileTitle = '';
    const body = $('#tBody');
    const updInfo = () => {
      const paras = cleanTranscript(body.value);
      const words = paras.join(' ').split(/\s+/).filter(Boolean).length;
      $('#tInfo').textContent = words ? words + ' słów' : '';
      const ls = cleanLines(body.value).filter(Boolean), lw = ls.join(' ').split(/\s+/).filter(Boolean).length;
      const versyBez = ls.length >= 4 && lw / ls.length <= 14 && ls.filter(l => /[.!?…,;]["'”’)]*$/.test(l)).length < ls.length * 0.3;
      $('#tPunct').hidden = !(needsPunctuation(paras) || versyBez);
    };
    body.oninput = updInfo;
    $('#tFile').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { body.value = rd.result; fileTitle = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '); updInfo(); };
      rd.readAsText(f);
    };
    $('#tAdd').onclick = async () => {
      const btn = $('#tAdd'), msg = $('#tMsg');
      let paras = cleanTranscript(body.value);
      if (!paras.length) { msg.innerHTML = '<span class="status bad">Najpierw wklej tekst albo wczytaj plik.</span>'; body.focus(); return; }
      btn.disabled = true;
      const lns = cleanLines(body.value), txtL = lns.filter(Boolean);
      const versy = txtL.length >= 4 && txtL.join(' ').split(/\s+/).length / txtL.length <= 14;
      if (!$('#tPunct').hidden && $('#tPunctCb').checked && AI.enabled() && versy) {
        // tekst w wersach (piosenka, napisy): AI podaje tylko zakończenie każdej linii — tekstu nie przepisuje
        const idx = []; lns.forEach((l, i) => { if (l) idx.push(i); });
        const parts = []; for (let i = 0; i < idx.length; i += 120) parts.push(idx.slice(i, i + 120));
        let failed = '';
        for (let pi = 0; pi < parts.length; pi++) {
          msg.innerHTML = '<div class="checking"><span class="spinner"></span>AI poprawia interpunkcję' + (parts.length > 1 ? ': część ' + (pi + 1) + ' z ' + parts.length : '') + '…</div>';
          try {
            const r = await AI.punctLines(parts[pi].map(i => lns[i]));
            r.forEach(o => {
              const li = parts[pi][(o.n | 0) - 1]; if (li == null) return;
              let l = lns[li];
              if (o.lower && /^[A-Z][a-z]/.test(l) && !/^I(\b|')/.test(l)) l = l[0].toLowerCase() + l.slice(1);
              if (o.end && !/[.,;:!?…]["'”’)]*$/.test(l)) l += o.end;
              lns[li] = l;
            });
            // wielka litera na początku zdania
            for (let k = 0; k < parts[pi].length; k++) { const li = parts[pi][k], prev = k ? lns[parts[pi][k - 1]] : '.'; if (/[.!?…]["'”’)]*$/.test(prev) && /^[a-z]/.test(lns[li])) lns[li] = lns[li][0].toUpperCase() + lns[li].slice(1); }
          } catch (e) { failed = AI.humanError(e); }
        }
        if (failed) msg.innerHTML = '<span class="status bad">' + esc(failed) + ' — część tekstu bez poprawionej interpunkcji.</span>';
        paras = cleanTranscript(lns.join('\n'));
      } else if (!$('#tPunct').hidden && $('#tPunctCb').checked && AI.enabled()) {
        const chunks = []; let curC = '';
        paras.forEach(p => { if ((curC + ' ' + p).length > 2500 && curC) { chunks.push(curC); curC = p; } else curC = curC ? curC + '\n\n' + p : p; });
        if (curC) chunks.push(curC);
        const fixed = [];
        for (let i = 0; i < chunks.length; i++) {
          msg.innerHTML = '<div class="checking"><span class="spinner"></span>AI poprawia interpunkcję: część ' + (i + 1) + ' z ' + chunks.length + '…</div>';
          try {
            const out = await AI.punctuate(chunks[i]);
            const a = chunks[i].split(/\s+/).length, b = out.split(/\s+/).length;
            if (Math.abs(a - b) / a < 0.12) fixed.push(out); else { fixed.push(chunks[i]); msg.innerHTML = '<span class="status bad">AI nie poprawiło interpunkcji w części ' + (i + 1) + ' — zostawiam ją bez zmian.</span>'; }
          } catch (e) { fixed.push(chunks[i]); msg.innerHTML = '<span class="status bad">' + esc(AI.humanError(e)) + ' — zostawiam tekst bez zmian.</span>'; }
        }
        paras = cleanTranscript(fixed.join('\n\n'));
      }
      const sents = splitSentences(paras);
      const id = 'x' + Date.now().toString(36);
      const title = fileTitle || autoTitle(sents);
      D().texts = D().texts || {};
      D().texts[id] = { id, title, added: Date.now(), sents, marks: {}, cache: {}, qa: [], pos: 0 };
      progress();
      if (!Store.save()) { delete D().texts[id]; btn.disabled = false; msg.innerHTML = '<span class="status bad">Brakuje miejsca w pamięci przeglądarki — usuń jakiś stary tekst i spróbuj ponownie.</span>'; return; }
      TXO.add = false; TXO.open = id; TXO.edit = null;
      renderTexts();
      const blk = document.querySelector('.tblock[data-tid="' + id + '"]'); if (blk) { blk.classList.add('tnew'); blk.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      toast('Dodano „' + title + '”. Tytuł zmienisz ołówkiem.', 4000);
    };
  }
  function deleteText(id) {
    const T = D().texts[id]; if (!T) return;
    const backup = JSON.parse(JSON.stringify(T));
    const cardsBak = {}, custBak = {};
    Object.keys(D().cards).forEach(k => { if (['tord:', 'tdic:', 'ttr:'].some(pre => k.indexOf(pre + id + ':') === 0)) { cardsBak[k] = D().cards[k]; delete D().cards[k]; } });
    Object.keys(D().custom || {}).forEach(k => { const c = D().custom[k]; if (c.textId === id && !D().cards[k]) { custBak[k] = c; delete D().custom[k]; } });
    delete D().texts[id]; delete TOKS[id];
    registerCustom(); progress(); Store.save(); renderTexts();
    toast('Usunięto tekst „' + backup.title + '”. Słowa, których już się uczysz, zostają.', {
      label: 'Cofnij', fn: () => { D().texts[id] = backup; Object.assign(D().cards, cardsBak); Object.assign(D().custom, custBak); registerCustom(); Store.save(); if (screen === 'texts') renderTexts(); }
    });
  }

  /* ---------- Czytnik ---------- */
  let RD = null;
  function stopReading() { if (RD && RD.playing) { RD.playing = false; if (window.speechSynthesis) speechSynthesis.cancel(); const el = app.querySelector('.sent.reading'); if (el) el.classList.remove('reading'); const b = document.getElementById('rPlay'); if (b) b.innerHTML = IC.speaker + ' Czytaj na głos ' + K('Spacja'); } }
  function sentHtml(T, i) {
    const s = T.sents[i].t, tk = textToks(T)[i];
    let h = '', pos = 0;
    tk.forEach((t, k) => {
      h += esc(s.slice(pos, t.a));
      const m = markAt(T, i, k);
      h += '<span class="w' + (m ? ' m-' + markStatus(m.id) : '') + '" data-s="' + i + '" data-k="' + k + '">' + esc(t.w) + '</span>';
      pos = t.b;
    });
    return h + esc(s.slice(pos));
  }
  function textHtml(T) {
    let h = '', curP = -1;
    T.sents.forEach((sn, i) => {
      if (sn.p !== curP) { if (curP >= 0) h += '</p>'; h += '<p>'; curP = sn.p; }
      h += '<span class="sent" data-sent="' + i + '">' + sentHtml(T, i) + '</span> ';
    });
    return h + '</p>';
  }
  function refreshSentence(T, i) { const el = app.querySelector('.sent[data-sent="' + i + '"]'); if (el) el.innerHTML = sentHtml(T, i); paintSel(); }
  function paintSel() {
    app.querySelectorAll('.w.sel, .w.cur').forEach(el => el.classList.remove('sel', 'cur'));
    const r = RD.pending || RD.sel;
    if (r) for (let k = r.a; k <= r.b; k++) { const el = app.querySelector('.w[data-s="' + r.s + '"][data-k="' + k + '"]'); if (el) el.classList.add('sel'); }
    if (RD.cur) { const el = app.querySelector('.w[data-s="' + RD.cur.s + '"][data-k="' + RD.cur.k + '"]'); if (el) el.classList.add('cur'); }
  }
  function renderReader(id) {
    const T = (D().texts || {})[id];
    if (!T) return go('texts');
    S = null;
    if (!RD || RD.id !== id) { bumpUse('texts'); Store.save(); }
    if (!RD || RD.id !== id) RD = { id, cur: { s: Math.min(T.pos || 0, T.sents.length - 1), k: 0 }, sel: null, pending: null, anchor: null, playing: false, busy: {}, err: {} };
    const st = textStats(T);
    app.innerHTML =
      '<div class="wrap reader-wrap">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Teksty ' + K('Esc') + '</button>' +
      '<div class="ex-title" style="min-width:0"><b>' + esc(T.title) + '</b><span id="rSub">' + readerSub(T) + '</span></div>' +
      '<div class="row" style="gap:12px"><button class="btn" id="rPlay">' + IC.speaker + ' Czytaj na głos ' + K('Spacja') + '</button></div></header>' +
      '<div class="legend reader-legend"><span><i class="ul m-new"></i>do nauki</span><span><i class="ul m-learn"></i>w nauce</span><span><i class="ul m-done"></i>opanowane</span>' +
      '<span class="small-note hint-line">Kliknij słowo albo przeciągnij myszą po zwrocie · skróty klawiszowe w panelu obok</span></div>' +
      '<div class="reader"><article class="rtext raised" id="rtext" lang="en">' + textHtml(T) + '</article>' +
      '<aside class="rpanel raised" id="rpanel" aria-live="polite"></aside></div></div>';
    paintSel(); renderPanel();
    const cs = app.querySelector('.sent[data-sent="' + RD.cur.s + '"]');
    if (cs && RD.cur.s > 0) cs.scrollIntoView({ block: 'center' });
    $('#back').onclick = () => go('texts');
    $('#rPlay').onclick = togglePlay;
    const rt = $('#rtext');
    rt.addEventListener('click', e => {
      const w = e.target.closest('.w'); if (!w) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      const s = +w.dataset.s, k = +w.dataset.k;
      if (e.shiftKey && RD.sel && RD.sel.s === s) setSel({ s, a: Math.min(RD.sel.a, k), b: Math.max(RD.sel.b, k) });
      else setSel({ s, a: k, b: k });
    });
    rt.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const spans = Array.from(rt.querySelectorAll('.w')).filter(el => sel.containsNode(el, true));
      sel.removeAllRanges();
      if (!spans.length) return;
      const s = +spans[0].dataset.s;
      const ks = spans.filter(el => +el.dataset.s === s).map(el => +el.dataset.k);
      if (spans.some(el => +el.dataset.s !== s)) toast('Zaznaczam tylko fragment z pierwszego zdania.');
      setSel({ s, a: Math.min.apply(null, ks), b: Math.max.apply(null, ks) });
    });
    keyHandler = readerKeys;
  }
  function readerSub(T) { const st = textStats(T); return st.words + ' słów · do nauki: ' + st.marked + ' · opanowane: ' + st.done; }
  function flatMove(dir) {
    const T = D().texts[RD.id], toks = textToks(T);
    let { s, k } = RD.cur;
    k += dir;
    while (s >= 0 && s < toks.length && (k < 0 || k >= toks[s].length)) {
      s += dir;
      if (s < 0 || s >= toks.length) return RD.cur;
      k = dir > 0 ? 0 : toks[s].length - 1;
    }
    return { s, k };
  }
  function readerKeys(e) {
    if (!RD) return;
    const T = D().texts[RD.id]; if (!T) return;
    if (typingInField()) { if (e.key === 'Escape') { e.preventDefault(); document.activeElement.blur(); } return; }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const scrollToCur = () => { const el = app.querySelector('.w.cur'); if (el) el.scrollIntoView({ block: 'nearest' }); };
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      if (e.shiftKey) {
        if (!RD.anchor) RD.anchor = { s: RD.cur.s, k: RD.cur.k };
        const toks = textToks(T)[RD.anchor.s];
        const nk = Math.max(0, Math.min(toks.length - 1, RD.cur.k + dir));
        RD.cur = { s: RD.anchor.s, k: nk };
        RD.pending = { s: RD.anchor.s, a: Math.min(RD.anchor.k, nk), b: Math.max(RD.anchor.k, nk) };
      } else { RD.anchor = null; RD.pending = null; RD.cur = flatMove(dir); }
      paintSel(); scrollToCur(); return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const ns = Math.max(0, Math.min(T.sents.length - 1, RD.cur.s + (e.key === 'ArrowDown' ? 1 : -1)));
      RD.cur = { s: ns, k: 0 }; RD.anchor = null; RD.pending = null; T.pos = ns;
      paintSel(); scrollToCur(); return;
    }
    if (e.key === 'Enter') { e.preventDefault(); const r = RD.pending || { s: RD.cur.s, a: RD.cur.k, b: RD.cur.k }; RD.pending = null; RD.anchor = null; setSel(r); return; }
    if (e.key === 'Escape') { e.preventDefault(); if (RD.sel || RD.pending) { RD.sel = null; RD.pending = null; RD.anchor = null; paintSel(); renderPanel(); } else go('texts'); return; }
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); return; }
    if (!RD.sel) return;
    if (e.code === 'KeyD') { e.preventDefault(); toggleMark(); return; }
    if (e.code === 'KeyT') { e.preventDefault(); translateSel(); return; }
    if (e.code === 'KeyS') { e.preventDefault(); Speech.speak(phraseOf(T, RD.sel)); return; }
    if (e.code === 'KeyQ' || e.key === '/') { e.preventDefault(); const q = $('#rQ'); if (q) q.focus(); }
  }
  function setSel(sel) {
    const T = D().texts[RD.id];
    RD.sel = sel; RD.pending = null; RD.anchor = null; RD.cur = { s: sel.s, k: sel.b };
    T.pos = sel.s;
    paintSel(); renderPanel();
    if (AI.enabled() && !T.cache[selKey(sel)]) explainSel();
  }
  async function explainSel() {
    const T = D().texts[RD.id], sel = RD.sel; if (!sel) return;
    const key = selKey(sel);
    if (RD.busy[key]) return;
    RD.busy[key] = true; RD.err[key] = ''; renderPanel();
    try { T.cache[key] = await AI.explainPhrase(phraseOf(T, sel), T.sents[sel.s].t, contextOf(T, sel.s)); Store.save(); }
    catch (e) { RD.err[key] = AI.humanError(e); }
    RD.busy[key] = false;
    if (screen === 'reader' && RD.sel && selKey(RD.sel) === key) renderPanel();
  }
  async function translateSel() {
    const T = D().texts[RD.id], sel = RD.sel; if (!sel) return;
    if (!AI.enabled()) { toast('Tłumaczenie wymaga klucza API w ustawieniach.'); return; }
    const key = 't:' + sel.s;
    if (T.cache[key] || RD.busy[key]) return;
    RD.busy[key] = true; renderPanel();
    try { T.cache[key] = { text: await AI.translateSentence(T.sents[sel.s].t, contextOf(T, sel.s)) }; Store.save(); }
    catch (e) { RD.err[key] = AI.humanError(e); }
    RD.busy[key] = false;
    if (screen === 'reader') renderPanel();
  }
  async function askSel(q) {
    const T = D().texts[RD.id], sel = RD.sel; if (!sel || !q.trim()) return;
    if (!AI.enabled()) { toast('Pytania do AI wymagają klucza API w ustawieniach.'); return; }
    const key = 'q:' + sel.s;
    RD.busy[key] = true; renderPanel();
    try {
      const hist = (T.qa || []).filter(x => x.s === sel.s);
      const a = await AI.askAboutText(q.trim(), phraseOf(T, sel), T.sents[sel.s].t, contextOf(T, sel.s), hist);
      T.qa = T.qa || []; T.qa.push({ s: sel.s, phrase: phraseOf(T, sel), q: q.trim(), a, at: Date.now() });
      if (T.qa.length > 150) T.qa.splice(0, T.qa.length - 150);
      Store.save();
    } catch (e) { RD.err[key] = AI.humanError(e); }
    RD.busy[key] = false;
    if (screen === 'reader') { renderPanel(); const pnl = document.getElementById('rpanel'), last = pnl && pnl.querySelector('.qa-item:last-child'); if (last) last.scrollIntoView({ block: 'start', behavior: 'smooth' }); const q2 = document.getElementById('rQ'); if (q2) q2.focus({ preventScroll: true }); }
  }
  function clozeFromText(sentence, a, b) {
    let s = sentence.slice(0, a) + '_' + sentence.slice(b);
    const w = s.split(' ');
    if (w.length > 24) {
      const i = w.findIndex(x => x.indexOf('_') >= 0);
      const from = Math.max(0, i - 10), to = Math.min(w.length, i + 11);
      s = (from > 0 ? '… ' : '') + w.slice(from, to).join(' ') + (to < w.length ? ' …' : '');
    }
    return s;
  }
  function toggleMark() {
    const T = D().texts[RD.id], sel = RD.sel; if (!sel) return;
    const existing = Object.keys(T.marks).find(k => { const m = T.marks[k]; return m.s === sel.s && m.a === sel.a && m.b === sel.b; });
    if (existing) {
      const m = T.marks[existing];
      delete T.marks[existing];
      const c = D().custom && D().custom[m.id];
      const stillUsed = Object.values(D().texts).some(t => Object.values(t.marks || {}).some(x => x.id === m.id));
      if (c && c.textId && !D().cards[m.id] && !stillUsed) { delete D().custom[m.id]; registerCustom(); }
      progress(); Store.save(); refreshSentence(T, sel.s); renderPanel(); { const rs = document.getElementById('rSub'); if (rs) rs.textContent = readerSub(T); }
      toast('Usunięto „' + m.phrase + '” z nauki.');
      return;
    }
    const inp = $('#rPl');
    const pl = (inp && inp.value.trim()) || ((T.cache[selKey(sel)] || {}).pl || '');
    if (!pl) { toast('Wpisz polskie znaczenie, żeby dodać do nauki.'); if (inp) inp.focus(); return; }
    const tk = textToks(T)[sel.s];
    let phrase = phraseOf(T, sel);
    if (sel.a === 0 && /^[A-Z][a-z]/.test(phrase) && !PROPER.has(tk[0].w)) phrase = phrase.charAt(0).toLowerCase() + phrase.slice(1);
    const low = phrase.toLowerCase();
    const base = WORDS.list.find(w => w.answers.some(x => x.toLowerCase() === low));
    let id;
    if (base) id = base.id;
    else {
      id = 't-' + (slugify(phrase) || Date.now().toString(36));
      if (WORDS.byId[id] && !(D().custom || {})[id]) id += '-' + Date.now().toString(36);
      if (!(D().custom || {})[id]) {
        D().custom = D().custom || {};
        D().custom[id] = { answers: [phrase], pl, s: clozeFromText(T.sents[sel.s].t, tk[sel.a].a, tk[sel.b].b), lvl: levels().vocab, added: Date.now(), textId: T.id, textTitle: T.title };
        registerCustom();
      }
    }
    T.marks[selKey(sel)] = { s: sel.s, a: sel.a, b: sel.b, phrase, pl, id, at: Date.now() };
    progress(); Store.save(); refreshSentence(T, sel.s); renderPanel(); { const rs = document.getElementById('rSub'); if (rs) rs.textContent = readerSub(T); }
    Sound.play('ok');
    toast('Dodano „' + phrase + '” do nauki' + (base ? ' (jest w bazie programu)' : '') + '.');
  }
  function renderPanel() {
    const el = document.getElementById('rpanel'); if (!el || !RD) return;
    const T = D().texts[RD.id], ai = AI.enabled();
    if (!RD.sel) {
      const st = textStats(T);
      const marks = Object.values(T.marks || {}).sort((a, b) => a.s - b.s || a.a - b.a);
      el.innerHTML = '<h2>Jak czytać</h2>' +
        '<p class="small-note" style="margin:0">Kliknij słowo, którego nie rozumiesz, albo przeciągnij myszą po całym zwrocie. ' + (ai ? 'AI od razu wyjaśni, co znaczy w tym zdaniu.' : 'Z kluczem API AI wyjaśni znaczenie w kontekście.') + '</p>' +
        '<div class="kbd-help small-note">' + K('←') + K('→') + ' słowo · ' + K('↑') + K('↓') + ' zdanie · ' + K('Shift') + '+' + K('→') + ' zwrot · ' + K('Enter') + ' wybierz · ' + K('D') + ' do nauki · ' + K('T') + ' tłumacz zdanie · ' + K('S') + ' odsłuchaj · ' + K('Q') + ' pytanie · ' + K('Spacja') + ' czytaj</div>' +
        '<div class="rstats"><div><b>' + st.marked + '</b><span>do nauki</span></div><div><b>' + st.learn + '</b><span>w nauce</span></div><div><b>' + st.done + '</b><span>opanowane</span></div></div>' +
        (marks.length ? '<h2 style="font-size:17px">Zaznaczone w tym tekście</h2><div class="chips">' + marks.map(m => '<button class="btn small chipbtn m-' + markStatus(m.id) + '" data-goto="' + m.s + ':' + m.a + ':' + m.b + '">' + esc(m.phrase) + '</button>').join('') + '</div>' : '');
      el.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { const [s, a, bb] = b.dataset.goto.split(':').map(Number); setSel({ s, a, b: bb }); const w = app.querySelector('.w[data-s="' + s + '"][data-k="' + a + '"]'); if (w) w.scrollIntoView({ block: 'center' }); });
      return;
    }
    const sel = RD.sel, key = selKey(sel), phrase = phraseOf(T, sel), tk = textToks(T)[sel.s], sent = T.sents[sel.s].t;
    const ex = T.cache[key], tr = T.cache['t:' + sel.s];
    const marked = Object.values(T.marks).find(m => m.s === sel.s && m.a === sel.a && m.b === sel.b);
    const sentMarked = esc(sent.slice(0, tk[sel.a].a)) + '<mark>' + esc(phrase) + '</mark>' + esc(sent.slice(tk[sel.b].b));
    const qa = (T.qa || []).filter(x => x.s === sel.s);
    el.innerHTML =
      '<div class="row between" style="align-items:flex-start"><div class="phrase" lang="en">' + esc(phrase) + '</div><button class="btn small" id="rClose" aria-label="Zamknij (Esc)">' + K('Esc') + '</button></div>' +
      '<div class="rsent sent-mark" lang="en">' + sentMarked + '</div>' +
      '<div class="row" style="gap:10px">' +
      '<button class="btn small" id="rSay">' + IC.speaker + ' Odsłuchaj ' + K('S') + '</button>' +
      '<button class="btn small" id="rSaySent">Całe zdanie</button>' +
      '<button class="btn small" id="rTr">Tłumacz zdanie ' + K('T') + '</button></div>' +
      (RD.busy['t:' + sel.s] ? '<div class="checking"><span class="spinner"></span>Tłumaczę zdanie…</div>' : tr ? '<div class="ai-box"><span class="ai-tag">AI</span>' + esc(tr.text) + '</div>' : RD.err['t:' + sel.s] ? '<div class="status bad">' + esc(RD.err['t:' + sel.s]) + '</div>' : '') +
      '<div class="ai-box">' +
      (!ai ? '<span class="small-note">Z kluczem API zobaczysz tu znaczenie w tym zdaniu, formę podstawową i przykład.</span>'
        : RD.busy[key] ? '<div class="checking"><span class="spinner"></span>AI sprawdza znaczenie w tym zdaniu…</div>'
        : ex ? '<div class="ex-pl"><span class="ai-tag">AI</span><b>' + esc(ex.pl) + '</b>' + (ex.base && ex.base.toLowerCase() !== phrase.toLowerCase() ? ' <span class="small-note">(forma podstawowa: ' + esc(ex.base) + ')</span>' : '') + '</div>' +
            '<div>' + qaFmt(ex.explanation) + '</div>' + (ex.example ? '<div class="small-note" lang="en">np. ' + esc(ex.example) + '</div>' : '')
        : RD.err[key] ? '<div class="status bad">' + esc(RD.err[key]) + '</div><button class="btn small" id="rRetry">Spróbuj ponownie</button>'
        : '<button class="btn small" id="rRetry">Wyjaśnij z AI</button>') +
      '</div>' +
      (marked
        ? '<div class="fb ok">' + IC.check + '<span><b>W nauce:</b> ' + esc(marked.pl) + '<small>' + ({ new: 'Pojawi się w najbliższej sesji.', learn: 'Powtarzasz to słowo.', done: 'Opanowane!' })[markStatus(marked.id)] + '</small></span></div>' +
          '<button class="btn small" id="rMark">Usuń z nauki ' + K('D') + '</button>'
        : '<div class="field" style="gap:8px"><label for="rPl" style="flex-basis:100%">Znaczenie po polsku</label><div class="ctl"><input id="rPl" class="txt" autocomplete="off" value="' + esc((ex && ex.pl) || '') + '" placeholder="' + (ai ? 'AI uzupełni po chwili' : 'wpisz znaczenie') + '"></div></div>' +
          '<button class="btn primary" id="rMark">Dodaj do nauki ' + K('D') + '</button>') +
      '<div class="qa">' + qa.map(x => '<div class="qa-item"><div class="q">' + esc(x.q) + '</div><div class="a">' + qaFmt(x.a) + '</div></div>').join('') +
      (RD.busy['q:' + sel.s] ? '<div class="checking"><span class="spinner"></span>AI odpowiada…</div>' : '') +
      (RD.err['q:' + sel.s] ? '<div class="status bad">' + esc(RD.err['q:' + sel.s]) + '</div>' : '') + '</div>' +
      '<div class="field" style="gap:8px"><label for="rQ" style="flex-basis:100%">Zapytaj AI o to zdanie ' + K('Q') + '</label><div class="ctl"><input id="rQ" class="txt" autocomplete="off" placeholder="' + (ai ? 'np. dlaczego tu jest „had been”?' : 'wymaga klucza API') + '"' + (ai ? '' : ' disabled') + '><button class="btn small" id="rAsk"' + (ai ? '' : ' disabled') + '>Zapytaj</button></div></div>';
    const on = (id2, fn) => { const b = el.querySelector(id2); if (b) b.onclick = fn; };
    on('#rClose', () => { RD.sel = null; paintSel(); renderPanel(); });
    on('#rSay', () => Speech.speak(phrase));
    on('#rSaySent', () => Speech.speak(sent));
    on('#rTr', translateSel);
    on('#rRetry', explainSel);
    on('#rMark', toggleMark);
    const q = el.querySelector('#rQ');
    on('#rAsk', () => { const v = q.value; q.value = ''; askSel(v); });
    if (q) q.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); const v = q.value; q.value = ''; askSel(v); } };
    const pl = el.querySelector('#rPl');
    if (pl) pl.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); toggleMark(); } };
  }
  function togglePlay() {
    if (!RD) return;
    if (RD.playing) { stopReading(); return; }
    const T = D().texts[RD.id];
    RD.playing = true;
    const b = document.getElementById('rPlay'); if (b) b.innerHTML = IC.speaker + ' Zatrzymaj ' + K('Spacja');
    const play = i => {
      if (!RD || !RD.playing || screen !== 'reader') return;
      if (i >= T.sents.length) { stopReading(); return; }
      app.querySelectorAll('.sent.reading').forEach(x => x.classList.remove('reading'));
      const el = app.querySelector('.sent[data-sent="' + i + '"]');
      if (el) { el.classList.add('reading'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      T.pos = i; RD.cur = { s: i, k: 0 };
      Speech.speakOne(T.sents[i].t, null, () => play(i + 1));
    };
    play(RD.sel ? RD.sel.s : RD.cur.s);
  }

  /* ---------- Nauka z tekstu ---------- */
  function textSentenceIds(T) {
    const toks = textToks(T), out = [];
    const withMarks = new Set(Object.values(T.marks || {}).map(m => m.s));
    const order = T.sents.map((_, i) => i).sort((a, b) => (withMarks.has(b) - withMarks.has(a)) || a - b);
    order.forEach(i => {
      const n = toks[i].length;
      if (n >= 5 && n <= 16) out.push('tord:' + T.id + ':' + i);
      if (n >= 4 && n <= 22) out.push('tdic:' + T.id + ':' + i);
      if (n >= 4 && n <= 14 && AI.enabled()) out.push('ttr:' + T.id + ':' + i);
    });
    return out;
  }
  function startTextSession(T) {
    if (!T) return;
    stopReading();
    const c = D().cards, end = endOfToday();
    const markIds = textStats(T).ids;
    const sentIds = textSentenceIds(T);
    const due = markIds.concat(sentIds.filter(id => c[id])).filter(id => c[id] && c[id].state === 'review' && c[id].due < end);
    const freshM = markIds.filter(id => !c[id]).slice(0, 12).map(id => ({ id, isNew: true, newKind: 'vocab' }));
    const freshS = roundRobin(['tord:', 'ttr:', 'tdic:'].map(pre => sortByDiff(sentIds.filter(id => id.indexOf(pre) === 0 && !c[id]), false))).slice(0, 6).map(id => ({ id, isNew: true, newKind: 'extra' }));
    let queue = roundRobin([due.map(id => ({ id, isNew: false })), freshM, freshS]);
    if (queue.length) {
      newSession({ custom: 'Tekst: ' + T.title, queue, textId: T.id });
      go('exercise');
      return;
    }
    // wszystko na dziś powtórzone → swobodne granie na tym tekście (bez wpływu na plan powtórek)
    const pool = U.shuffle(markIds.concat(sentIds).filter(id => !(c[id] && c[id].state === 'known'))).slice(0, 15).map(id => ({ id, isNew: false }));
    if (!pool.length) { toast('Zaznacz w tekście kilka słów, żeby się z niego uczyć.'); return; }
    toast('Na dziś wszystko z tego tekstu powtórzone — możesz poćwiczyć bez wpływu na powtórki.');
    newSession({ play: 'text', playText: T.id, textId: T.id, custom: 'Tekst: ' + T.title, queue: pool });
    go('exercise');
  }

  /* ---------- Kontrola jakości zdań od AI (drugie sprawdzenie przed dodaniem) ---------- */
  function hasPhrase(sent, word) { return new RegExp('(^|[^A-Za-z])' + escapeRe(String(word).trim()) + '([^A-Za-z]|$)', 'i').test(sent || ''); }
  async function qcWordItems(items) {
    const st = { fixed: 0, dropped: 0 };
    const list = items.filter(x => x && x.word && x.sentence);
    if (!list.length) return { items: [], st };
    const res = await AI.checkSentences(list.map(x => ({ s: x.sentence, word: x.word, pl: x.pl })));
    const out = [];
    list.forEach((x, i) => {
      const r = res[i];
      if (r && r.ok) out.push(x);
      else if (r && r.fixed && hasPhrase(r.fixed, x.word)) { out.push(Object.assign({}, x, { sentence: r.fixed, qcFixed: r.problem })); st.fixed++; }
      else st.dropped++;
    });
    return { items: out, st };
  }
  function qcNote(st) { return st.fixed || st.dropped ? ' Kontrola AI: poprawiono ' + st.fixed + ', odrzucono ' + st.dropped + '.' : ''; }

  /* ---------- Automatyczne dobieranie słów przez AI ---------- */
  let topUpRunning = false;
  async function maybeTopUp(force) {
    if (!AI.enabled() || topUpRunning) return 0;
    const lv = levels().vocab;
    const unseen = WORDS.list.filter(w => w.lvl === lv && !D().cards[w.id]).length;
    if (!force && (unseen >= 30 || D().topUpDay === U.dayKey())) return 0;
    topUpRunning = true;
    D().topUpDay = U.dayKey(); Store.save();
    try {
      const avoid = WORDS.list.filter(w => Math.abs(w.lvl - lv) <= 1).map(w => w.answers[0]).slice(0, 700);
      const raw = await AI.newWords(L[lv], avoid, 30);
      const qc = await qcWordItems(raw);
      let n = 0;
      qc.items.forEach(it => { if (it && it.word && !addCustom(it.word, it.pl, it.sentence, { prefix: 'a-', lvl: lv, extra: { ai: true, qc: 1 } })) n++; });
      if (n) toast('Dobrano ' + n + ' nowych słów na poziomie ' + L[lv] + ' (AI).' + qcNote(qc.st));
      return n;
    } catch (e) { if (force) toast(AI.humanError(e)); return 0; }
    finally { topUpRunning = false; }
  }


  /* ================= ETAP 5 ================= */
  /* ---------- Przetłumacz: polskie wersje zdań (paczkami, zapamiętywane) ---------- */
  const PL_ERR = {}, plBusy = {};
  function plSource(id) { const it = itemFor(id); return it && it.w !== undefined || (it && it.ts) ? fullSentence(it) : null; }
  function ensurePL(ids) {
    const cache = D().plCache = D().plCache || {};
    const need = ids.filter(id => !cache[id] && !plBusy[id] && !PL_ERR[id] && plSource(id));
    const waits = ids.map(id => plBusy[id]).filter(Boolean);
    if (need.length && !AI.enabled()) need.forEach(id => { PL_ERR[id] = 'to ćwiczenie wymaga klucza API.'; });
    else if (need.length) {
      const batch = need.slice(0, 20);
      const pr = AI.translateBatch(batch.map(plSource)).then(out => {
        batch.forEach((id, i) => { if (out[i]) cache[id] = out[i]; else PL_ERR[id] = 'AI nie zwróciło tłumaczenia.'; });
        Store.save();
      }).catch(e => { batch.forEach(id => { PL_ERR[id] = AI.humanError(e); }); })
        .then(() => { batch.forEach(id => { delete plBusy[id]; }); });
      batch.forEach(id => { plBusy[id] = pr; });
      waits.push(pr);
    }
    return Promise.all(waits);
  }
  function prefetchPL(ids) {
    const cache = D().plCache || {};
    const tr = ids.filter(id => /^t?tr:/.test(id) && !cache[id] && !PL_ERR[id] && !plBusy[id]);
    if (tr.length && AI.enabled()) ensurePL(tr);
  }
  function toggleDictate() {
    if (!S || S.phase !== 'answer') return;
    if (S.listening) { Recog.stop(); return; }
    const sess = S, c = cur();
    const inp = $('#ans'); if (inp) S.answer = inp.value;
    if (window.speechSynthesis) speechSynthesis.cancel();
    S.recogErr = ''; S.listening = true;
    renderExercise();
    Recog.listen({
      silenceMs: 3000,
      onInterim: t => { if (S !== sess || cur() !== c) return; const el = $('#ans'); if (el) el.value = t; },
      onResult: alts => { if (S !== sess || cur() !== c) return; S.listening = false; S.answer = alts[0] || ''; S.spoken = true; renderExercise(); },
      onError: err => { if (S !== sess || cur() !== c) return; S.listening = false; if (err !== 'aborted') S.recogErr = recogMsg(err); renderExercise(); }
    });
  }

  /* ---------- Audycja: ok. minuty słuchania + 4 pytania ---------- */
  const LISTEN_TOPICS = [
    { name: 'Technika', prompt: 'technika i nowe technologie (gadżety, komputery, AI, wynalazki)' },
    { name: 'Nauka', prompt: 'nauka i ciekawe odkrycia (fizyka, biologia, chemia, medycyna)' },
    { name: 'Kosmos', prompt: 'kosmos, astronomia i loty kosmiczne' },
    { name: 'Codzienność', prompt: 'codzienne życie: zakupy, podróże, jedzenie, zdrowie, dom' },
    { name: 'Praca', prompt: 'praca, biuro, rozmowy w pracy, kariera' },
    { name: 'Losowy', prompt: null }
  ];
  let LS = null;
  const LISTEN_RATE = [0.8, 0.9, 1, 1.05, 1.1];
  function listenRate(X, slow) { return (D().settings.rate || 0.95) * (LISTEN_RATE[X.lvl] || 1) * (slow ? 0.75 : 1); }
  function stopListen() { if (LS) { LS.playing = false; LS.playId = (LS.playId || 0) + 1; } if (window.speechSynthesis) speechSynthesis.cancel(); }
  /* czas w Audycji liczy wspólny licznik (TIME_MOD) */
  function renderListen() {
    S = null; stopReading();
    if (!LS || LS.phase === 'pick') return renderListenPick();
    if (LS.phase === 'loading') return renderListenLoading();
    if (LS.phase === 'listen' || LS.phase === 'quiz') return renderListenMain();
    return renderListenDone();
  }
  function renderListenPick() {
    const ai = AI.enabled();
    if (!LS) LS = { phase: 'pick', lvl: levels().listening };
    const hist2 = (D().audio || []).slice(-8).reverse();
    const avg = hist2.length ? Math.round(hist2.reduce((a, x) => a + x.score / x.n, 0) / hist2.length * 100) : null;
    app.innerHTML =
      '<div class="wrap narrow">' + backHeader('Audycja', 'posłuchaj ok. minuty i odpowiedz na 4 pytania') +
      (!ai ? '<section class="note raised"><div class="ic inset">' + IC.lock + '</div><div class="tx"><b>Audycja wymaga klucza API</b><span>AI pisze dla Ciebie nowy tekst do słuchania i pytania. Dodaj klucz w ustawieniach.</span></div><button class="btn primary" id="toSet">Ustawienia</button></section>' : '') +
      '<section class="set-card raised"><div class="row between"><h2>Wybierz temat</h2>' +
      '<div class="lvl-pills" role="group" aria-label="Poziom">' + L.map((l, i) => '<button class="btn pill small' + (LS.lvl === i ? ' pressed' : '') + '" data-lv="' + i + '"' + (ai ? '' : ' disabled') + '>' + l + '</button>').join('') + '</div></div>' +
      '<p class="small-note" style="margin:0">Poziom ' + L[LS.lvl] + ' · tempo lektora ' + String(LISTEN_RATE[LS.lvl]).replace('.', ',') + '×' + (LS.lvl === levels().listening ? ' — Twój poziom słuchania.' : ' — wybrany ręcznie (Twój: ' + L[levels().listening] + ').') + ' Pytania ' + (LS.lvl <= 1 ? 'po polsku' : 'po angielsku') + '. Tekst zobaczysz dopiero na końcu.</p>' +
      '<div class="topics">' + LISTEN_TOPICS.map((t, i) => '<button class="btn topic raised" data-topic="' + i + '"' + (ai ? '' : ' disabled') + '><span class="num-key">' + (i + 1) + '</span><b>' + t.name + '</b></button>').join('') + '</div>' +
      '<div class="field"><label for="lTopic">Albo własny temat</label><div class="ctl"><input id="lTopic" class="txt" autocomplete="off" placeholder="np. jak działają baterie litowe"' + (ai ? '' : ' disabled') + '><button class="btn primary" id="lGo"' + (ai ? '' : ' disabled') + '>Słuchaj ' + K('Enter') + '</button></div></div>' +
      (LS.err ? '<div class="status bad">' + esc(LS.err) + '</div>' : '') + '</section>' +
      (hist2.length ? '<section class="set-card raised"><div class="row between"><h2>Ostatnie audycje</h2><span class="small-note">średnio <b>' + avg + '%</b> poprawnych</span></div><div class="col" style="gap:10px">' +
        hist2.map(x => '<div class="list-item inset"><div style="min-width:0"><span class="w" style="font-size:17px">' + esc(x.title) + '</span><div class="small-note">' + new Date(x.at).toLocaleDateString('pl-PL') + ' · ' + esc(x.topic) + ' · ' + L[x.lvl] + '</div></div>' +
          '<div class="row" style="gap:10px"><div class="qdots">' + Array.from({ length: x.n }, (_, k) => '<i class="' + (k < x.score ? 'ok' : '') + '"></i>').join('') + '</div><b>' + x.score + '/' + x.n + '</b></div></div>').join('') + '</div></section>' : '') +
      '</div>';
    $('#back').onclick = () => { LS = null; go('home'); };
    if ($('#toSet')) $('#toSet').onclick = () => go('settings');
    $$('[data-lv]').forEach(b => b.onclick = () => { LS.lvl = +b.dataset.lv; renderListenPick(); });
    $$('[data-topic]').forEach(b => b.onclick = () => startListen(LISTEN_TOPICS[+b.dataset.topic]));
    const custom = () => { const v = $('#lTopic').value.trim(); if (!v) { shake($('#lTopic')); $('#lTopic').focus(); return; } startListen({ name: v, prompt: v }); };
    $('#lGo').onclick = custom;
    $('#lTopic').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); custom(); } };
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); if (typingInField()) document.activeElement.blur(); else { LS = null; go('home'); } return; }
      if (!ai || typingInField() || e.altKey || e.ctrlKey || e.metaKey) return;
      if (/^[1-6]$/.test(e.key)) { e.preventDefault(); startListen(LISTEN_TOPICS[+e.key - 1]); }
      else if (e.key === 'Enter') { e.preventDefault(); $('#lTopic').focus(); }
    };
  }
  async function startListen(topic) {
    if (!AI.enabled()) return;
    const lvl = LS ? LS.lvl : levels().listening;
    let t = topic;
    if (!t.prompt) { const pool = LISTEN_TOPICS.filter(x => x.prompt); t = pool[Math.floor(Math.random() * pool.length)]; }
    const myLS = LS = { phase: 'loading', lvl, topic: t.name };
    renderListenLoading();
    try {
      const avoid = (D().audio || []).slice(-12).map(x => x.title);
      /* ten sam temat w ostatnich 14 dniach — inny podtemat i inne fakty, żeby nie odpowiadać z pamięci (upd240) */
      const same = (D().audio || []).filter(x => x.topic === t.name && Date.now() - x.at < 14 * U.DAY).slice(-4);
      const tp = same.length ? t.prompt + '. WAŻNE: Artur słuchał już audycji na ten temat (' + same.map(x => '„' + x.title + '”' + (x.qs ? ' — pytania: ' + x.qs.join(' / ') : '')).join('; ') + '). Wybierz zupełnie inny podtemat, inne fakty, inne nazwy i liczby; pytania nie mogą dotyczyć tych samych informacji.' : t.prompt;
      const data = await AI.makeListening(L[lvl], tp, avoid, lvl <= 1);
      if (LS !== myLS) return;
      data.questions.forEach(q => {
        const opts = q.options.map((o, i) => ({ o, ok: i === q.answer }));
        const sh = U.shuffle(opts);
        q.options = sh.map(x => x.o); q.answer = sh.findIndex(x => x.ok);
      });
      Object.assign(LS, { phase: 'listen', data, sents: splitSentences(cleanTranscript(data.text)).map(x => x.t), plays: 0, slow: false, qi: 0, picks: [], playing: false, cur: -1, preview: false, playId: 0 });
    } catch (e) {
      if (LS !== myLS) return;
      LS = { phase: 'pick', lvl, err: AI.humanError(e) };
    }
    if (screen === 'listen') renderListen();
  }
  function renderListenLoading() {
    app.innerHTML = '<div class="wrap narrow">' + backHeader('Audycja', LS.topic + ' · ' + L[LS.lvl]) +
      '<main class="ex-card raised"><div class="tag inset">SŁUCHANIE · ' + L[LS.lvl] + '</div><div class="checking"><span class="spinner"></span>AI przygotowuje audycję: ' + esc(LS.topic) + '…</div><p class="small-note">To trwa zwykle kilka–kilkanaście sekund.</p></main></div>';
    $('#back').onclick = () => { LS = { phase: 'pick', lvl: LS.lvl }; renderListen(); };
    keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); $('#back').click(); } };
  }
  function playListen(fromIdx) {
    if (!LS || !LS.sents) return;
    if (LS.playing) { stopListen(); renderListenMain(); return; }
    const id = ++LS.playId;
    LS.playing = true;
    const rate = listenRate(LS, LS.slow);
    const step = i => {
      if (!LS || LS.playId !== id || screen !== 'listen') return;
      if (i >= LS.sents.length) { LS.playing = false; LS.plays++; LS.cur = -1; renderListenMain(); return; }
      LS.cur = i; paintListenDots();
      Speech.speakOne(LS.sents[i], rate, () => setTimeout(() => step(i + 1), 120));
    };
    renderListenMain();
    step(fromIdx || 0);
  }
  function paintListenDots() {
    const el = document.getElementById('ldots'); if (!el || !LS) return;
    el.querySelectorAll('i').forEach((d, k) => { d.className = k < LS.cur ? 'done' : k === LS.cur ? 'now' : ''; });
  }
  function renderListenMain() {
    const X = LS, q = X.phase === 'quiz' ? X.data.questions[X.qi] : null, pick = q ? X.picks[X.qi] : null, answered = pick != null;
    const n = X.data.questions.length;
    const playBtn = '<button class="btn ' + (X.phase === 'listen' ? 'play-big primary' : 'pill') + '" id="lPlay" aria-label="' + (X.playing ? 'Zatrzymaj' : 'Odtwórz') + '">' + (X.phase === 'listen' ? (X.playing ? IC.pause : IC.speakerBig) : IC.speaker + (X.playing ? ' Zatrzymaj ' : ' Odsłuchaj jeszcze raz ') + K('Alt+S')) + '</button>';
    let body;
    if (X.phase === 'listen') {
      body = '<div class="prompt-lbl">Posłuchaj audycji. Tekst zobaczysz na końcu.</div>' + playBtn +
        '<div class="ldots" id="ldots" aria-hidden="true">' + X.sents.map(() => '<i></i>').join('') + '</div>' +
        '<div class="row center" style="gap:12px"><span class="small-note">' + K('Spacja') + (X.playing ? ' zatrzymaj' : ' odtwórz') + ' · odsłuchano: ' + X.plays + '×</span>' +
        '<button class="btn small' + (X.slow ? ' pressed' : '') + '" id="lSlow" aria-pressed="' + X.slow + '">Wolniej ' + K('W') + '</button>' +
        '<button class="btn small' + (X.preview ? ' pressed' : '') + '" id="lPrev" aria-pressed="' + X.preview + '">Pokaż pytania ' + K('P') + '</button></div>' +
        (X.preview ? '<ol class="qprev">' + X.data.questions.map(x => '<li>' + esc(x.q) + '</li>').join('') + '</ol>' : '') +
        '<div class="row center"><button class="btn primary" id="lQuiz"' + (X.plays || X.playing ? '' : ' disabled') + '>Przejdź do pytań ' + K('Enter') + '</button></div>';
    } else {
      body = '<div class="prompt-lbl">Pytanie ' + (X.qi + 1) + ' z ' + n + '</div>' +
        '<div class="qtext">' + esc(q.q) + '</div>' +
        '<div class="options lopts">' + q.options.map((o, i) => {
          const cls = !answered ? '' : i === q.answer ? ' ok' : i === pick ? ' bad' : ' dim';
          return '<button class="btn' + cls + '" data-opt="' + i + '"' + (answered ? ' tabindex="-1"' : '') + '><span class="k">' + (i + 1) + '</span>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        (answered ? '<div class="fb ' + (pick === q.answer ? 'ok' : 'bad') + '" role="status">' + (pick === q.answer ? IC.check : IC.alert) + '<span><b>' + (pick === q.answer ? 'Dobrze!' : pick === -1 ? 'Poprawna odpowiedź jest zaznaczona.' : 'Jeszcze nie.') + '</b>' +
          (q.quote ? '<small lang="en">W nagraniu: „' + esc(q.quote) + '”</small>' : '') + '</span></div>' +
          '<div class="row center"><button class="btn primary" id="lNext">' + (X.qi + 1 < n ? 'Następne pytanie ' : 'Wynik ') + K('Enter') + '</button></div>'
          : '<div class="row center" style="gap:14px">' + playBtn + '<button class="btn" id="lIdk">Nie wiem ' + K('Alt+W') + '</button></div>');
    }
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Przerwij ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Audycja</b><span>' + esc(X.topic) + ' · ' + L[X.lvl] + '</span></div>' +
      '<div class="qdots big">' + X.data.questions.map((x, k) => '<i class="' + (X.picks[k] == null ? (X.phase === 'quiz' && k === X.qi ? 'now' : '') : X.picks[k] === x.answer ? 'ok' : 'bad') + '"></i>').join('') + '</div></header>' +
      '<main class="ex-card raised"><div class="tag inset">SŁUCHANIE · ' + L[X.lvl] + '</div>' + body + '</main></div>';
    paintListenDots();
    const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    on('#back', () => { stopListen(); LS = { phase: 'pick', lvl: X.lvl }; renderListen(); });
    on('#lPlay', () => playListen(0));
    on('#lSlow', () => { X.slow = !X.slow; if (X.playing) { stopListen(); } renderListenMain(); });
    on('#lPrev', () => { X.preview = !X.preview; renderListenMain(); });
    on('#lQuiz', () => { stopListen(); X.phase = 'quiz'; X.qi = 0; renderListenMain(); });
    on('#lIdk', () => answerListen(-1));
    on('#lNext', nextListenQ);
    $$('[data-opt]').forEach(b => b.onclick = () => answerListen(+b.dataset.opt));
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#back').click(); return; }
      if (altKey(e, 'KeyS')) { e.preventDefault(); playListen(0); return; }
      if (altKey(e, 'KeyW') && X.phase === 'quiz' && !answered) { e.preventDefault(); answerListen(-1); return; }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (X.phase === 'listen') {
        if (e.code === 'Space') { e.preventDefault(); playListen(0); return; }
        if (e.code === 'KeyW') { e.preventDefault(); $('#lSlow').click(); return; }
        if (e.code === 'KeyP') { e.preventDefault(); $('#lPrev').click(); return; }
        if (e.key === 'Enter' && !$('#lQuiz').disabled) { e.preventDefault(); $('#lQuiz').click(); }
        return;
      }
      if (!answered && /^[1-4]$/.test(e.key)) { e.preventDefault(); answerListen(+e.key - 1); return; }
      if (!answered && e.code === 'KeyS') { e.preventDefault(); playListen(0); return; }
      if (answered && e.key === 'Enter') { e.preventDefault(); nextListenQ(); }
    };
  }
  function answerListen(i) {
    const X = LS; if (!X || X.phase !== 'quiz' || X.picks[X.qi] != null) return;
    stopListen();
    X.picks[X.qi] = i;
    const ok = i === X.data.questions[X.qi].answer;
    Sound.play(ok ? 'ok' : i === -1 ? 'idk' : 'bad');
    renderListenMain();
  }
  function nextListenQ() {
    const X = LS; if (!X || X.picks[X.qi] == null) return;
    if (X.qi + 1 < X.data.questions.length) { X.qi++; renderListenMain(); return; }
    finishListen();
  }
  function finishListen() {
    const X = LS; stopListen();
    bumpUse('listen');
    const qs = X.data.questions, n = qs.length, score = qs.filter((q, k) => X.picks[k] === q.answer).length;
    const t = Store.today();
    const xp = score * 10 + (score === n ? 10 : 0);
    D().xp += xp; t.xp += xp; t.total += n; t.correct += score;
    t.sk = t.sk || {}; const ska = t.sk.listening || (t.sk.listening = [0, 0]); ska[0] += score; ska[1] += n;
    qs.forEach((q, k) => pushHist('listening', X.picks[k] === q.answer));
    D().audio = D().audio || [];
    D().audio.push({ at: Date.now(), title: X.data.title, topic: X.topic, lvl: X.lvl, score, n, plays: X.plays, qs: qs.map(q => String(q.q || '').slice(0, 90)) });
    if (D().audio.length > 200) D().audio.splice(0, D().audio.length - 200);
    D().typesPlayed = D().typesPlayed || {}; D().typesPlayed.listen = 1;
    // awans słuchania tak jak po sesji
    const lv = levels(), h = hist().listening || [];
    let promo = '';
    if (promoteReady('listening')) { lv.listening++; hist().listening = []; promo = 'Słuchanie: poziom ' + L[lv.listening] + '.'; recordLevels('promo'); }
    progress();
    const nb = checkBadges();
    Store.save(); syncAfterSession();
    Object.assign(X, { phase: 'done', score, xp, promo, newBadges: nb });
    Sound.play(score === n ? 'combo' : 'block');
    renderListenDone();
  }
  function renderListenDone() {
    const X = LS, qs = X.data.questions, n = qs.length;
    // tekst z zaznaczonymi miejscami odpowiedzi
    let html = esc(X.data.text);
    qs.forEach((q, k) => {
      if (!q.quote) return;
      const re = new RegExp(escapeRe(esc(q.quote.trim().replace(/[.,!?]+$/, ''))).replace(/\s+/g, '\\s+'), 'i');
      html = html.replace(re, m => '<mark title="Pytanie ' + (k + 1) + '">' + m + '<sup>' + (k + 1) + '</sup></mark>');
    });
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header style="text-align:center"><h1 style="font-size:38px">' + (X.score === n ? 'Wszystko dobrze!' : X.score >= n - 1 ? 'Bardzo dobrze' : 'Audycja zakończona') + '</h1>' +
      '<p class="muted" style="font-size:18px;margin:6px 0 0"><b>' + X.score + ' z ' + n + '</b> poprawnych · +' + X.xp + ' XP · odsłuchano ' + X.plays + '×<br><span class="small-note">Poziom ' + L[X.lvl] + ' · ' + X.data.text.split(/\s+/).length + ' słów' + (X.data.avgWords ? ' · zdania średnio po ' + Math.round(X.data.avgWords) + ' słów' : '') + '</span>' + (X.promo ? '<br><b class="pink">' + esc(X.promo) + '</b>' : '') + '</p></header>' +
      (X.newBadges && X.newBadges.length ? '<section class="note raised"><div class="ic inset">' + IC.trophy + '</div><div class="tx"><b>Nowa odznaka</b><span>' + X.newBadges.map(b => esc(b.name || b.title || '')).join(', ') + '</span></div></section>' : '') +
      '<section class="set-card raised"><h2>' + esc(X.data.title) + (X.data.titlePl ? ' <span class="small-note">— ' + esc(X.data.titlePl) + '</span>' : '') + '</h2>' +
      '<div class="ltext" lang="en">' + html + '</div>' +
      '<div class="row" style="gap:12px"><button class="btn small" id="lAgain">' + IC.speaker + ' Odsłuchaj z tekstem ' + K('S') + '</button>' +
      '<button class="btn small' + (X.textId ? ' done-state' : '') + '" id="lText">' + (X.textId ? 'Otwórz w Moich tekstach ' : 'Dodaj do Moich tekstów ') + K('T') + '</button></div></section>' +
      '<section class="set-card raised"><h2>Pytania</h2><div class="col" style="gap:12px">' + qs.map((q, k) => {
        const p = X.picks[k], ok = p === q.answer;
        return '<div class="list-item inset lq"><div style="min-width:0"><div><b>' + (k + 1) + '. ' + esc(q.q) + '</b></div>' +
          '<div class="small-note">' + (ok ? 'Twoja odpowiedź: ' + esc(q.options[p]) : (p >= 0 ? 'Ty: <s>' + esc(q.options[p]) + '</s> · ' : 'Nie wiem · ') + 'poprawnie: <b>' + esc(q.options[q.answer]) + '</b>') + '</div></div>' +
          '<span class="chip ' + (ok ? 'okchip' : 'inset') + '">' + (ok ? '✓' : '✗') + '</span></div>';
      }).join('') + '</div></section>' +
      '<div class="row center" style="gap:20px"><button class="btn big" id="lHome">Wróć ' + K('Esc') + '</button><button class="btn big primary" id="lNew">Nowa audycja ' + K('Enter') + '</button></div></div>';
    const addText = () => {
      if (X.textId && D().texts[X.textId]) return go('reader', X.textId);
      const id = 'x' + Date.now().toString(36);
      D().texts = D().texts || {};
      D().texts[id] = { id, title: 'Audycja: ' + X.data.title, added: Date.now(), sents: splitSentences(cleanTranscript(X.data.text)), marks: {}, cache: {}, qa: [], pos: 0 };
      X.textId = id; progress(); Store.save();
      toast('Dodano do Moich tekstów — możesz tam zaznaczać słowa i uczyć się z tego tekstu.');
      renderListenDone();
    };
    $('#lText').onclick = addText;
    $('#lAgain').onclick = () => { if (window.speechSynthesis && speechSynthesis.speaking) { stopListen(); return; } Speech.speak(X.data.text, listenRate(X, false)); };
    $('#lHome').onclick = () => { stopListen(); LS = null; if (guideIn('listen')) return guideStepDone({ total: n, correct: X.score, xp: X.xp }); go('home'); };
    $('#lNew').onclick = () => { stopListen(); if (guideIn('listen')) { LS = null; return guideStepDone({ total: n, correct: X.score, xp: X.xp }); } LS = { phase: 'pick', lvl: X.lvl }; renderListen(); };
    if (guideIn('listen')) $('#lNew').innerHTML = 'Dalej w planie ' + K('Enter');
    keyHandler = e => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#lHome').click(); return; }
      if (e.key === 'Enter' && !onButton()) { e.preventDefault(); $('#lNew').click(); return; }
      if (e.code === 'KeyT') { e.preventDefault(); addText(); return; }
      if (e.code === 'KeyS') { e.preventDefault(); $('#lAgain').click(); }
    };
  }

  /* ================= KROK PO KROKU — program układa plan i prowadzi ================= */
  let GUIDE = null;
  /* plan „Krok po kroku” zapisany na cały dzień (upd197): po zamknięciu programu wracasz do tego samego kroku, nowy plan następnego dnia */
  function guideLoad() {
    const tk = U.dayKey(Date.now());
    if (GUIDE && GUIDE.day !== tk) GUIDE = null;
    if (!GUIDE && D().guide && D().guide.day === tk) { GUIDE = D().guide; GUIDE.aiBusy = false; }
    if (D().guide && D().guide.day !== tk) { delete D().guide; Store.save(); }
    return GUIDE;
  }
  function guideSave() { if (GUIDE) { D().guide = GUIDE; Store.save(); } }
  function guideHomeBtn() {
    const g = GUIDE, n = g ? g.steps.length : 0;
    if (g && g.i >= n) {
      const mins = Math.max(0, Math.round((Store.today().sec - g.sec0) / 60));
      return '<div class="t2-guide gp-done" title="Dzisiejszy plan krok po kroku jest zrobiony">' + '<span class="t2-done-ic">' + IC.check + '</span><b>Plan<br>zrobiony</b><span class="gp-n">' + n + ' z ' + n + ' · ' + mins + ' min</span></div>';
    }
    if (g) return '<button class="btn t2-guide" id="guide" title="Wróć do dzisiejszego planu"><b>Wróć<br>do planu</b><span class="gp-n">krok ' + (g.i + 1) + ' z ' + n + '</span><span class="gp-dots">' + g.steps.map((x, k) => '<i' + (k < g.i ? ' class="on"' : '') + '></i>').join('') + '</span>' + K('L') + '</button>';
    return '<button class="btn t2-guide" id="guide" title="Program układa plan i prowadzi Cię krok po kroku"><b>Krok<br>po kroku</b>' + K('L') + '</button>';
  }
  const GUIDE_TYPES = { grammar: ['error', 'order', 'translate'], listening: ['dictation'], speaking: ['speak'], vocab: ['cloze', 'particle'] };
  const GUIDE_BLOCK = ['order', 'dictation', 'speak', 'error', 'translate', 'particle', 'cloze'];
  function guideIn(mode) { const s = GUIDE && GUIDE.steps[GUIDE.i]; return !!s && s.mode === mode; }
  function guideBlock(type, n) {
    if (!typeEnabled(type) || gameNote(type)) return null;
    const q = buildPlayQueue(type, n, []);
    return q.length >= 3 ? q : null;
  }
  function buildGuide() {
    const st = D().settings, steps = [], used = {};
    const per = 8, maxSteps = Math.max(3, Math.min(6, Math.round(st.goalMin / 3)));
    const add = x => { if (x && steps.length < maxSteps && !used[x.type]) { steps.push(x); used[x.type] = 1; } };
    const sq = stubQueue();
    if (sq.length) add({ type: 'stub', title: 'Uparte błędy', mode: 'srs', why: 'Błędy, które powtarzasz: ' + sq.map(q => itemFor(q.id).stubRight).join(', ') + ' — po jednym krótkim zdaniu.', queue: sq });
    const due = dueIds().slice(0, Math.min(15, reviewCap()));
    if (due.length) add({ type: 'due', title: 'Powtórki', mode: 'srs', why: due.length + ' do powtórki — to dziś najważniejsze dla pamięci.', queue: due.map(id => ({ id, isNew: false })) });
    const nW = newPool().slice(0, Math.min(5, newLeftToday())).map(id => ({ id, isNew: true, newKind: 'vocab' }));
    const nX = newExtraPool().slice(0, Math.min(3, newExtraLeftToday())).map(id => ({ id, isNew: true, newKind: 'extra' }));
    if (nW.length + nX.length) add({ type: 'new', title: 'Nowe słowa', mode: 'srs', why: 'Porcja nowych słów i ćwiczeń na dziś.', queue: U.shuffle(nW.concat(nX)) });
    // najsłabsza umiejętność
    const sks = Object.keys(GUIDE_TYPES).map(sk => ({ sk, a: accuracy(sk), types: GUIDE_TYPES[sk].filter(t => typeEnabled(t) && !gameNote(t)) })).filter(x => x.types.length);
    sks.sort((x, y) => (x.a == null ? 60 : x.a) - (y.a == null ? 60 : y.a));
    for (const w of sks) {
      const t = w.types.slice().sort((a, b) => usage(useKey(a)) - usage(useKey(b)))[0], q = guideBlock(t, per);
      if (q) { add({ type: t, title: USE_NAME[t], mode: 'play', why: 'Najsłabsza teraz umiejętność: ' + SKILL_NAME[w.sk].toLowerCase() + (w.a != null ? ' (trafność ' + w.a + '%)' : '') + '.', queue: q }); break; }
    }
    // oznaczone przez Artura jako trudne
    const hd = hardIds();
    if (hd.length >= 3) add({ type: 'hard', title: 'Trudne', mode: 'play', why: 'Oznaczyłeś je jako trudne (' + hd.length + ') — powtórka.', queue: U.shuffle(hd).slice(0, per).map(id => ({ id, isNew: false })) });
    // najczęstszy błąd
    const okId = id => { const it = itemFor(id); return it && typeEnabled(it.type); };
    const mg = mistakeGroups(14, 0).find(g => g.ids.filter(okId).length >= 3);
    if (mg) add({ type: 'mistakes', title: 'Twoje błędy', mode: 'play', why: 'Najczęściej wraca: ' + mg.cat + '.', queue: U.shuffle(mg.ids.filter(okId)).slice(0, per).map(id => ({ id, isNew: false })) });
    // wymowa — gdy w „Powiedz to” zebrały się pary mylonych słów
    { const pm = pronMine(); if (pm.length >= 2 && Recog.supported()) add({ type: 'pron', title: 'Wymowa', mode: 'pron', why: 'Pary, które mylisz w „Powiedz to”: ' + pm.slice(0, 3).map(p => p.a + ' – ' + p.b).join(', ') + '.' }); }
    // audycja z AI, jeśli nie było jej od 2 dni (temat dobierze AI)
    if (AI.enabled()) { const dl = daysSinceUse('listen'); if (dl == null || dl >= 2) add({ type: 'listen', title: 'Audycja', mode: 'listen', why: 'Słuchanie dłuższego tekstu — ' + (dl == null ? 'dawno albo wcale' : 'ostatnio ' + dl + ' dni temu') + '.' }); }
    // dawno nie było
    staleList(2).forEach(x => {
      const ago = x.d == null ? 'dawno albo wcale' : 'ostatnio ' + x.d + ' dni temu';
      if (x.k === 'listen' && AI.enabled()) add({ type: 'listen', title: 'Audycja', mode: 'listen', why: 'Słuchanie dłuższego tekstu — ' + ago + '.' });
      else if (GUIDE_BLOCK.includes(x.k)) { const q = guideBlock(x.k, per); if (q) add({ type: x.k, title: USE_NAME[x.k], mode: 'play', why: 'Dawno nie było — ' + ago + '.', queue: q }); }
    });
    // codziennie choć trochę słuchania i mówienia
    [['dictation', 'Słuchanie'], ['speak', 'Mówienie']].forEach(([t, nm]) => { if (!used[t]) { const q = guideBlock(t, 6); if (q) add({ type: t, title: USE_NAME[t], mode: 'play', why: nm + ' — choć trochę każdego dnia.', queue: q }); } });
    // dopełnienie najrzadziej używanym
    GUIDE_BLOCK.slice().sort((a, b) => usage(useKey(a)) - usage(useKey(b))).forEach(t => { if (steps.length < 3 && !used[t]) { const q = guideBlock(t, per); if (q) add({ type: t, title: USE_NAME[t], mode: 'play', why: 'Najrzadziej ćwiczone ostatnio.', queue: q }); } });
    // kolejność: powtórki i nowe na początku, audycja na końcu, reszta przemieszana rodzajem
    const head = steps.filter(x => x.mode === 'srs'), tail = steps.filter(x => x.mode === 'listen'), mid = steps.filter(x => x.mode === 'play' || x.mode === 'pron');
    return head.slice(0, 1).concat(mid.slice(0, 1), head.slice(1), mid.slice(1), tail);
  }
  function startGuide() {
    const steps = buildGuide();
    if (!steps.length) { toast('Za mało materiału na plan — poucz się najpierw trochę słówek.'); return; }
    const td = Store.today();
    GUIDE = { steps, i: 0, xp: 0, sec0: td.sec || 0, n0: (td.newCount || 0) + (td.newExtra || 0), r0: td.reviews || 0, day: U.dayKey(Date.now()), at: Date.now() };
    guideSave();
    go('guide');
    if (AI.enabled()) guideAI(GUIDE);
  }
  async function guideAI(g) {
    g.aiBusy = true;
    try {
      const sk = ['vocab', 'grammar', 'listening', 'speaking'].map(k => SKILL_NAME[k] + ' ' + L[levels()[k]] + (accuracy(k) != null ? ' (trafność ' + accuracy(k) + '%)' : '')).join(', ');
      const mg = mistakeGroups(14, 0).slice(0, 3).map(x => x.cat + ' ×' + x.n + (x.ex.length ? ' (np. ' + x.ex.slice(0, 2).join('; ') + ')' : '')).join('\n');
      const words = learnedWords().slice(-12).map(w => w.answers[0]).join(', ');
      const ctx = 'Poziomy: ' + sk + '\nNajczęstsze błędy z 2 tygodni:\n' + (mg || 'brak') + '\nOstatnio ćwiczone słowa: ' + (words || 'brak');
      const r = await AI.guidePlan(g.steps, ctx);
      if (GUIDE !== g) return;
      g.steps.forEach((x, k) => { if (r.why[k]) x.aiWhy = r.why[k]; });
      if (r.topic) { g.topic = r.topic; g.topicName = r.topicName || 'Temat dnia'; }
    } catch (e) { g.aiErr = AI.humanError(e); }
    g.aiBusy = false;
    if (GUIDE === g) guideSave();
    if (GUIDE === g && screen === 'guide') renderGuide();
  }
  function runGuideStep() {
    const g = GUIDE, x = g && g.steps[g.i]; if (!x) return;
    if (x.mode === 'pron') return startPron(true);
    if (x.mode === 'listen') {
      LS = { phase: 'pick', lvl: levels().listening };
      go('listen');
      if (g.topic) startListen({ name: g.topicName, prompt: g.topic });
      return;
    }
    newSession({ guide: true, guideMax: x.queue.length * 2, queue: x.queue.map(q => Object.assign({}, q)), play: x.mode === 'play' ? (x.type === 'mistakes' || x.type === 'hard' ? 'mix' : x.type) : null });
    go('exercise');
  }
  function guideStepDone(r) {
    const g = GUIDE; if (!g) return go('home');
    const x = g.steps[g.i]; if (x) x.res = r;
    g.xp += r.xp || 0; g.i++; guideSave();
    if (r.promos && r.promos.length) setTimeout(() => toast('Awans! ' + r.promos.join(' ')), 300);
    go('guide');
  }
  function guideSummary(g, mins) {
    const td = Store.today(), tot = g.steps.reduce((a, x) => a + (x.res && x.res.total || 0), 0), ok = g.steps.reduce((a, x) => a + (x.res && x.res.correct || 0), 0);
    const nw = Math.max(0, (td.newCount || 0) + (td.newExtra || 0) - (g.n0 || 0)), rv = Math.max(0, (td.reviews || 0) - (g.r0 || 0));
    const kp = (v, l) => '<div><b>' + v + '</b><span>' + l + '</span></div>';
    const rows = g.steps.map(x => { const r = x.res || {}, sk = !x.res || r.skip || !r.total;
      return '<div class="gs-row"><i class="' + (sk ? 'sk' : '') + '">' + (sk ? '–' : '✓') + '</i><span>' + esc(x.title) + '</span><small>' + (sk ? 'pominięte' : r.correct + '/' + r.total + ' dobrze') + '</small><b>' + (r.xp ? '+' + r.xp + ' XP' : '—') + '</b></div>'; }).join('');
    const today = U.startOfDay(); let tm = 0;
    Object.keys(D().cards).forEach(id => { const x = D().cards[id]; if (x.state !== 'review') return; const it = itemFor(id); if (!it || !typeEnabled(it.type)) return; if (daysBetween(today, x.due) <= 1) tm++; });
    const lw = D().days[U.dayKey(U.addDays(today, -7))], lwm = lw ? Math.round((lw.sec || 0) / 60) : 0, tdm = Math.round((td.sec || 0) / 60), wd = new Date(today).toLocaleDateString('pl-PL', { weekday: 'long' });
    const cmp = lwm ? (tdm >= lwm ? ' · więcej niż ' + (wd === 'niedziela' || wd === 'środa' || wd === 'sobota' ? 'zeszła ' : 'zeszły ') + wd + ' (+' + (tdm - lwm) + ' min)' : ' · zeszły tydzień tego dnia: ' + lwm + ' min') : '';
    return '<div class="gs-kp">' + kp(mins + ' min', 'nauki') + kp('+' + fmtNum(g.xp), 'XP') + kp(tot ? Math.round(ok / tot * 100) + '%' : '—', 'trafność') + kp(nw, nw === 1 ? 'nowe słowo' : 'nowych słów') + kp(rv, rv === 1 ? 'powtórka' : 'powtórek') + '</div>' +
      '<div class="gs-list">' + rows + '</div><div class="gs-next">Jutro czeka: <b>' + tm + ' ' + (tm === 1 ? 'powtórka' : tm % 10 >= 2 && tm % 10 <= 4 && (tm % 100 < 12 || tm % 100 > 14) ? 'powtórki' : 'powtórek') + '</b>' + cmp + '</div>';
  }
  function plLit(n) { const d = n % 10, t = n % 100; return n === 1 ? 'literę' : d >= 2 && d <= 4 && (t < 12 || t > 14) ? 'litery' : 'liter'; }
  function plKart(n) { const d = n % 10, t = n % 100; return n === 1 ? 'karta' : d >= 2 && d <= 4 && (t < 12 || t > 14) ? 'karty' : 'kart'; }
  function renderGuide() {
    screen = 'guide';
    const g = GUIDE; if (!g) return go('home');
    const n = g.steps.length, done = g.i >= n, cur = g.steps[g.i];
    const mins = Math.max(0, Math.round((Store.today().sec - g.sec0) / 60));
    const res = x => x.res ? (x.res.total ? x.res.correct + '/' + x.res.total + ' dobrze' : 'pominięte') + (x.res.xp ? ' · +' + x.res.xp + ' XP' : '') : '';
    const RE = '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 4v5h-5"></path></svg>';
    const gIc = x => ({ due: RE, new: IC.book, hard: IC.flame, mistakes: IC.list, listen: IC.headphones, speak: IC.mic, dictation: IC.headphones })[x.type] || (x.mode === 'listen' ? IC.headphones : IC.gamepad);
    const steps = '<section class="gd-steps">' + g.steps.map((x, k) => '<div class="gd-st' + (k === g.i ? ' cur' : '') + (k < g.i ? ' done redo' : '') + '"' + (k < g.i ? ' data-gback="' + k + '" role="button" tabindex="0" title="Kliknij, aby ' + (x.res && x.res.skip ? 'zrobić ten krok teraz' : 'zrobić ten krok jeszcze raz') + '"' : '') + '><span class="gd-dot">' + (k < g.i ? '✓' : k + 1) + '</span><b>' + esc(x.title) + '</b>' + (k < g.i && res(x) ? '<small>' + esc(res(x)) + '</small>' : '') + '</div>').join('') + '</section>';
    const meta = cur && cur.queue && cur.queue.length ? '<div class="gd-meta">' + cur.queue.length + ' ' + plKart(cur.queue.length) + '</div>' : '';
    app.innerHTML =
      '<div class="wrap narrow gd-wrap">' +
      '<header class="ex-head"><button class="btn" id="gEnd" title="' + (done ? '' : 'Plan zostaje zapisany — wrócisz do tego kroku') + '">' + IC.back + ' Wróć ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Krok po kroku</b><span>' + mins + ' min · +' + g.xp + ' XP</span></div><div style="width:150px"></div></header>' +
      (done
        ? '<div class="gd-blk"><section class="gd-frame"><div class="gd-ic inset" style="color:#5E9670">' + IC.check + '</div><div class="gd-tx gs-tx"><div class="gd-now">Gotowe · ' + g.steps.filter(x => x.res && !x.res.skip && x.res.total !== 0).length + ' z ' + n + ' ' + (n === 1 ? 'kroku' : 'kroków') + ' · ' + new Date(g.at).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'numeric' }) + '</div><h1>Plan na dziś zrobiony!</h1>' + guideSummary(g, mins) + '</div></section>' +
          '<div class="gd-btns"><button class="btn primary gd-go" id="gHome">Wróć na stronę główną ' + K('Enter') + '</button></div></div>'
        : '<div class="gd-blk"><section class="gd-frame"><div class="gd-ic inset">' + gIc(cur) + '</div><div class="gd-tx"><div class="gd-now">Teraz · krok ' + (g.i + 1) + ' z ' + n + '</div><h1>' + esc(cur.title) + '</h1><p>' + esc(cur.aiWhy || cur.why) + '</p>' +
          (cur.mode === 'listen' && g.topic ? '<p class="small-note" style="margin:0">Temat audycji od AI: <b>' + esc(g.topicName) + '</b> — ' + esc(g.topic) + '</p>' : '') + meta +
          (g.aiBusy ? '<div class="checking"><span class="spinner"></span>AI dopasowuje plan do Twoich danych…</div>' : g.aiErr ? '<div class="small-note">AI niedostępne (' + esc(g.aiErr) + ') — plan i tak działa.</div>' : '') + '</div></section>' +
          '<div class="gd-btns"><button class="btn" id="gSkip">Pomiń ' + K('P') + '</button><button class="btn primary gd-go" id="gGo">' + IC.play + ' ' + (g.i ? 'Dalej' : 'Zaczynamy') + ' ' + K('Enter') + '</button></div></div>') +
      (done ? '' : steps) + '</div>';
    $('#gEnd').onclick = () => go('home');
    if ($('#gHome')) $('#gHome').onclick = () => go('home');
    if ($('#gGo')) $('#gGo').onclick = runGuideStep;
    if ($('#gSkip')) $('#gSkip').onclick = () => { cur.res = { total: 0, correct: 0, xp: 0, skip: true }; g.i++; guideSave(); renderGuide(); };
    /* pominięty przez pomyłkę krok: wraca jako następny (upd236) */
    /* kliknięcie zrobionego albo pominiętego kroku na osi: od razu go uruchamia (wraca jako bieżący) (upd237) */
    $$('[data-gback]').forEach(b => { const go2 = () => { const k = +b.dataset.gback, x = g.steps.splice(k, 1)[0]; if (x.res && !x.res.skip) g.xp -= 0; delete x.res; g.i--; g.steps.splice(g.i, 0, x); guideSave(); runGuideStep(); }; b.onclick = go2; b.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); go2(); } }; });
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#gEnd').click(); return; }
      if (e.key === 'Enter' && !onButton()) { e.preventDefault(); ($('#gGo') || $('#gHome')).click(); return; }
      if (plainKey(e, 'KeyP') && $('#gSkip')) { e.preventDefault(); $('#gSkip').click(); }
    };
  }

  /* ---------- Historia poziomów i test miesiąca ---------- */
  function levelHist() {
    const h = D().levelHist = D().levelHist || [];
    if (!h.length && D().profile.placementDone && D().profile.levels) h.push({ at: D().profile.createdAt || Date.now(), kind: 'start', levels: Object.assign({}, levels()) });
    return h;
  }
  function recordLevels(kind, extra) {
    const h = levelHist();
    h.push(Object.assign({ at: Date.now(), kind, levels: Object.assign({}, levels()) }, extra || {}));
    if (h.length > 300) h.splice(1, h.length - 300);
  }
  function lastTestAt() {
    const h = levelHist();
    for (let i = h.length - 1; i >= 0; i--) if (h[i].kind === 'test' || h[i].kind === 'placement') return h[i].at;
    return D().profile.createdAt || (h[0] && h[0].at) || Date.now();
  }
  function nextTestAt() { return lastTestAt() + 30 * U.DAY; }
  function monthTestDue() { return !!D().profile.placementDone && Date.now() >= nextTestAt(); }
  function monthTestNoteHtml() {
    if (!monthTestDue()) return '';
    return '<section class="note raised mt-note"><div class="ic inset">' + IC.chart + '</div><div class="tx" title="Sprawdzisz, ile urosłeś — wynik trafi na wykres poziomu w Statystykach."><b>Test miesiąca</b><span>ok. 10 minut</span></div>' +
      '<button class="btn primary" id="mTest">Zrób test ' + K('P') + '</button></section>';
  }
  function finishMonthly() {
    const keys = ['vocab', 'grammar', 'listening'];
    const res = {}, acc = {};
    keys.forEach(k => { res[k] = estimate(T.log[k]); const a = T.log[k]; acc[k] = a.length ? Math.round(a.filter(x => x.correct).length / a.length * 100) : 0; });
    T = null;
    const lv = levels(), before = Object.assign({}, lv), up = [], down = [];
    keys.forEach(k => { if (res[k] > lv[k]) { lv[k] = res[k]; hist()[k] = []; up.push(k); } else if (res[k] < lv[k]) down.push(k); });
    recordLevels('test', { test: res, before, acc });
    progress(); Store.save(); syncAfterSession();
    renderMonthlyResult({ res, before, up, down, acc, lowered: [] });
  }
  function renderMonthlyResult(r) {
    screen = 'testResult';
    const lv = levels();
    const row = k => {
      const st = r.up.includes(k) ? '<span class="chip okchip">podniesiono do ' + L[lv[k]] + '</span>'
        : r.lowered.includes(k) ? '<span class="chip inset">obniżono do ' + L[lv[k]] + '</span>'
        : r.down.includes(k) ? '<button class="btn small" data-down="' + k + '">Obniż do ' + L[r.res[k]] + '</button>'
        : '<span class="chip inset">bez zmian</span>';
      return '<div class="list-item inset"><div><span class="w" style="font-size:18px">' + SKILL_NAME[k] + '</span><div class="small-note">było ' + L[r.before[k]] + ' · w teście ' + L[r.res[k]] + (r.acc && r.acc[k] != null ? ' · ' + r.acc[k] + '% poprawnych' : '') + '</div></div>' + st + '</div>';
    };
    const msg = r.up.length ? 'Brawo — poziom poszedł w górę: ' + r.up.map(k => SKILL_NAME[k].toLowerCase()).join(', ') + '.'
      : r.down.length ? 'Test wypadł niżej niż obecny poziom. To może być gorszy dzień — możesz zostawić poziom bez zmian.' : 'Poziom się potwierdził.';
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header style="text-align:center"><h1 style="font-size:38px">Test miesiąca</h1>' + (r.at ? '<p class="small-note" style="margin:4px 0 0">z dnia ' + new Date(r.at).toLocaleDateString('pl-PL') + '</p>' : '') + '<p class="muted" style="font-size:18px;margin:6px 0 0">' + esc(msg) + '</p></header>' +
      '<section class="set-card raised"><h2>Wynik</h2><div class="col" style="gap:12px">' + ['vocab', 'grammar', 'listening'].map(row).join('') + '</div>' +
      '<p class="small-note" style="margin:0">Test niczego nie kasuje — Twoje powtórki zostają. Mówienie zmienia się samo po dobrych sesjach.</p></section>' +
      '<section class="panel raised"><h2>Poziom w czasie</h2>' + levelsChartHtml() + '</section>' +
      '<div class="row center"><button class="btn big primary" id="go">Gotowe ' + K('Enter') + '</button></div></div>';
    $$('[data-down]').forEach(b => b.onclick = () => {
      const k = b.dataset.down; levels()[k] = r.res[k]; hist()[k] = [];
      const h = levelHist(); h[h.length - 1].levels = Object.assign({}, levels());
      r.down = r.down.filter(x => x !== k); r.lowered.push(k);
      progress(); Store.save(); renderMonthlyResult(r);
    });
    const back = r.from || 'home';
    $('#go').onclick = () => go(back);
    const shownAt = Date.now();
    keyHandler = e => { if (e.repeat || Date.now() - shownAt < 600) return; if ((e.key === 'Enter' && !onButton()) || e.key === 'Escape') { e.preventDefault(); go(back); } };
  }
  /* ponowne pokazanie wyniku ostatniego testu miesiąca (z historii poziomów) */
  function lastTestEntry() { const h = levelHist(); for (let i = h.length - 1; i >= 0; i--) if (h[i].kind === 'test' && h[i].test) return { e: h[i], last: i === h.length - 1 }; return null; }
  function showLastTest() {
    const t = lastTestEntry(); if (!t) return;
    const e = t.e, before = e.before || e.levels, keys = ['vocab', 'grammar', 'listening'], lv = levels();
    renderMonthlyResult({ at: e.at, from: 'stats', res: e.test, before, acc: e.acc || null, lowered: [],
      up: keys.filter(k => (e.levels[k] || 0) > (before[k] || 0)),
      down: t.last ? keys.filter(k => e.test[k] < lv[k]) : [] });
  }
  let lwhyOpen = false;
  /* „Skąd ten poziom?” — tylko pokazuje dane, niczego nie zmienia */
  function levelWhyHtml() {
    const lv = levels(), h = levelHist(), lg = D().skLog || {};
    const dfmt = t => new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: '2-digit' });
    const KN = { start: 'start', placement: 'test startowy', test: 'test miesiąca', promo: 'awans w trakcie nauki', manual: 'ustawione ręcznie' };
    const pct = (a, b) => b ? Math.round(a / b * 100) + '%' : '—';
    const row = k => {
      const ev = []; let prev = null;
      h.forEach((e, i) => {
        const v = e.levels && e.levels[k] != null ? e.levels[k] : (k === 'speaking' && e.levels ? e.levels.listening : null);
        if (v == null) return;
        const tst = e.test && e.test[k] != null ? ' (w teście ' + L[e.test[k]] + ')' : '';
        if (i === 0 || v !== prev || e.kind === 'test') ev.push(dfmt(e.at) + ' ' + (KN[e.kind] || e.kind) + ': <b>' + L[v] + '</b>' + tst);
        prev = v;
      });
      const parts = ['<div class="small-note">' + (ev.length ? ev.join(' → ') : 'brak historii') + '</div>'];
      if (k === 'vocab') {
        const items = WORDS.list.filter(w => w.lvl === lv.vocab), c = D().cards;
        let kn = 0, lr = 0; items.forEach(w => { const x = c[w.id]; if (!x) return; if (x.state === 'known') kn++; else if ((x.s || 0) >= 10) lr++; });
        parts.push('<div class="small-note">Awans przy 80% opanowanych słów poziomu ' + L[lv.vocab] + ': teraz <b>' + pct(kn + lr, items.length) + '</b> (' + (kn + lr) + ' z ' + items.length + ') — w tym <b>' + kn + '</b> z „Umiem to” i <b>' + lr + '</b> wyuczonych w powtórkach.</div>');
      } else {
        const ps = promoteStatus(k);
        parts.push('<div class="small-note">Do awansu: ' + PROMO_N + ' uczciwych odp. z ≥85% dobrze, z ' + PROMO_DAYS + ' różnych dni, min. ' + PROMO_GAP + ' dni od ostatniej zmiany. Teraz: <b>' + ps.n + '/' + PROMO_N + '</b> odp. · <b>' + (ps.acc == null ? '—' : Math.round(ps.acc * 100) + '%') + '</b> · dni: <b>' + Math.min(ps.days, PROMO_DAYS) + '/' + PROMO_DAYS + '</b>' + (ps.wait ? ' · jeszcze ' + ps.wait + ' dni przerwy' : '') + (lv[k] >= 4 ? ' (to już najwyższy poziom)' : '') + '</div>');
      }
      const a = (lg[k] || []).slice(-30);
      if (a.length) {
        const n = a.length, e = a.filter(x => x.e).length, r = a.filter(x => x.r).length, hn = a.filter(x => x.h).length;
        const fair = a.filter(x => !x.e && !x.h), fairOk = fair.filter(x => x.ok).length;
        const lvd = a.filter(x => x.l != null), atLv = lvd.filter(x => x.l >= lv[k]).length;
        parts.push('<div class="small-note">Ostatnie ' + n + ' zapisanych odp.: łatwe wersje <b>' + pct(e, n) + '</b> · powtórki znanych <b>' + pct(r, n) + '</b> · z podpowiedzią/niepewne <b>' + pct(hn, n) + '</b>' +
          (lvd.length ? ' · z poziomu ' + L[lv[k]] + ' lub wyżej <b>' + pct(atLv, lvd.length) + '</b>' : '') +
          '<br>Trafność bez łatwych i bez podpowiedzi: <b>' + (fair.length ? pct(fairOk, fair.length) : '—') + '</b> (' + fair.length + ' odp.)</div>');
      } else parts.push('<div class="small-note">Szczegóły odpowiedzi zbierają się od 03.11 — pojawią się po kolejnych ćwiczeniach.</div>');
      const setBtns = '<div class="row" style="gap:6px;margin-top:8px;align-items:center"><span class="small-note">Ustaw ręcznie:</span>' + L.map((nm, v) => '<button class="btn small' + (v === lv[k] ? ' primary' : '') + '" data-setlv="' + k + ':' + v + '"' + (v === lv[k] ? ' aria-pressed="true"' : '') + '>' + nm + '</button>').join('') + '</div>';
      return '<div class="list-item inset" style="display:block"><div class="row between"><span class="w" style="font-size:18px">' + SKILL_NAME[k] + '</span><b style="font-size:20px">' + L[lv[k]] + '</b></div>' + parts.join('') + setBtns + '</div>';
    };
    return '<details class="lwhy" style="margin-top:14px"' + (lwhyOpen ? ' open' : '') + '><summary style="cursor:pointer"><b style="font-size:18px">Skąd ten poziom?</b> <span class="small-note">— kliknij, żeby zobaczyć, na czym opiera się każdy poziom</span></summary>' +
      '<div class="col" style="gap:12px;margin-top:14px">' + ['vocab', 'grammar', 'listening', 'speaking'].map(row).join('') + '</div></details>';
  }
  function levelsChartHtml() {
    const h = levelHist();
    if (!h.length) return '<div class="small-note" style="padding:20px 0;text-align:center">Wykres pojawi się po teście poziomu.</div>';
    const keys = ['vocab', 'grammar', 'listening', 'speaking'];
    const t0 = h[0].at, t1 = Math.max(Date.now(), t0 + 14 * U.DAY);
    const W = 660, X0 = 44, X1 = 520, Yv = v => 196 - v * 40;
    const x = t => X0 + (t - t0) / (t1 - t0) * (X1 - X0);
    let svg = '<svg viewBox="0 0 ' + W + ' 236" role="img" aria-label="Poziom umiejętności w czasie" class="lines">';
    for (let v = 0; v <= 4; v++) svg += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + Yv(v) + '" y2="' + Yv(v) + '" stroke="' + (v === 0 ? '#B5AFA7' : '#CFCAC2') + '"/><text x="' + (X0 - 8) + '" y="' + (Yv(v) + 4) + '" text-anchor="end" font-size="12" fill="#5F5B55">' + L[v] + '</text>';
    const dfmt = t => new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
    const span = t1 - t0, ticks2 = [t0];
    if (span > 45 * U.DAY) { const d = new Date(t0); for (let m = 1; m < 60; m++) { const s = new Date(d.getFullYear(), d.getMonth() + m, 1).getTime(); if (s >= t1 - 10 * U.DAY) break; ticks2.push(s); } }
    ticks2.push(t1);
    ticks2.forEach((t, i) => { svg += '<text x="' + x(t).toFixed(1) + '" y="226" text-anchor="' + (i === 0 ? 'start' : i === ticks2.length - 1 ? 'end' : 'middle') + '" font-size="12" fill="#5F5B55">' + (i === ticks2.length - 1 && t1 >= Date.now() - U.DAY ? 'dziś' : dfmt(t)) + '</text>'; });
    h.forEach(e => {
      if (e.kind !== 'test' && e.kind !== 'placement') return;
      svg += '<line x1="' + x(e.at).toFixed(1) + '" x2="' + x(e.at).toFixed(1) + '" y1="20" y2="' + Yv(0) + '" stroke="#ADA79F" stroke-dasharray="3 4"/><text x="' + x(e.at).toFixed(1) + '" y="14" text-anchor="middle" font-size="11" fill="#5F5B55">' + (e.kind === 'test' ? 'test' : 'start') + '</text>';
    });
    const ends = [];
    keys.forEach((k, ki) => {
      const off = (ki - 1.5) * 3;
      let v = h[0].levels[k] != null ? h[0].levels[k] : h[0].levels.listening;
      let d = 'M' + x(t0).toFixed(1) + ' ' + (Yv(v) + off).toFixed(1);
      h.slice(1).forEach(e => { const nv = e.levels[k] != null ? e.levels[k] : v; if (nv !== v) { d += ' H' + x(e.at).toFixed(1) + ' V' + (Yv(nv) + off).toFixed(1); v = nv; } });
      d += ' H' + x(t1).toFixed(1);
      svg += '<path d="' + d + '" fill="none" stroke="' + SK_COLORS[k] + '" stroke-width="2.5" stroke-linejoin="round"><title>' + SKILL_NAME[k] + ': teraz ' + L[v] + '</title></path>';
      ends.push({ k, y: Yv(v) + off, v });
    });
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
    ends.forEach(e => { svg += '<text x="' + (X1 + 10) + '" y="' + (e.y + 4) + '" font-size="13" fill="#3A3835">' + SKILL_NAME[e.k] + ' ' + L[e.v] + '</text>'; });
    return svg + '</svg>';
  }

  /* ---------- Raport tygodnia ---------- */
  function maybeWeeklyReport() {
    if (!D().profile.placementDone) return false;
    const wk = weekKey();
    if (D().lastReportWeek === wk) return false;
    D().lastReportWeek = wk; Store.save();
    const prevS = U.addDays(mondayOf(Date.now()), -7);
    if (aggDays(prevS, 7).sec < 60) return false;
    go('report', { week: U.dayKey(prevS), from: 'home' });
    return true;
  }
  function buildReport(ws) {
    const we = U.addDays(ws, 7), ps = U.addDays(ws, -7);
    const a = aggDays(ws, 7), p = aggDays(ps, 7);
    const days = [], pdays = [];
    let reviews = 0;
    for (let i = 0; i < 7; i++) {
      days.push(aggDays(U.addDays(ws, i), 1).sec / 60); pdays.push(aggDays(U.addDays(ps, i), 1).sec / 60);
      const dd = D().days[U.dayKey(U.addDays(ws, i))]; if (dd) reviews += dd.reviews || 0;
    }
    let best = null;
    for (let s = mondayOf(firstDay()); s < ws; s = U.addDays(s, 7)) { const x = aggDays(s, 7); if (!best || x.sec > best.sec) best = { s, sec: x.sec }; }
    const inWeek = t => t >= ws && t < we;
    const mg = {};
    (D().mistakes || []).forEach(m => { if (inWeek(m.at)) mg[m.cat] = (mg[m.cat] || 0) + 1; });
    const hard = Object.keys(mg).map(c => ({ cat: c, n: mg[c] })).sort((x, y) => y.n - x.n).slice(0, 3);
    const audio = (D().audio || []).filter(x => inWeek(x.at));
    const bi = days.indexOf(Math.max.apply(null, days));
    return {
      ws, we, a, p, days, pdays, reviews, best,
      sk: aggSkill(ws, 7), psk: aggSkill(ps, 7),
      bestDay: days[bi] > 0 ? { i: bi, min: days[bi] } : null,
      hard, audio,
      badges: BADGES.filter(b => inWeek((D().badges || {})[b.id] || 0)),
      boss: (D().boss || {})[U.dayKey(ws)],
      promos: levelHist().filter(e => inWeek(e.at) && (e.kind === 'promo' || e.kind === 'test')),
      known: Object.values(D().cards).filter(c => c.knownAt && inWeek(c.knownAt)).length
    };
  }
  function weekRangeLabel(ws) {
    const a = new Date(ws), b = new Date(U.addDays(ws, 6));
    const mn = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    return a.getMonth() === b.getMonth() ? a.getDate() + '–' + b.getDate() + ' ' + mn[b.getMonth()] : a.getDate() + ' ' + mn[a.getMonth()] + ' – ' + b.getDate() + ' ' + mn[b.getMonth()];
  }
  function renderReport(arg) {
    S = null;
    arg = arg || {};
    const thisMon = mondayOf(Date.now());
    let ws = arg.week ? new Date(arg.week + 'T00:00:00').getTime() : U.addDays(thisMon, -7);
    const from = arg.from || 'stats';
    const R = buildReport(ws), cur2 = ws >= thisMon;
    const minC = R.a.sec / 60, minP = R.p.sec / 60, accC = R.a.total ? R.a.correct / R.a.total * 100 : null, accP = R.p.total ? R.p.correct / R.p.total * 100 : null;
    const dm = pctDelta(minC, minP);
    const bestMin = R.best ? R.best.sec / 60 : 0;
    let insight;
    if (!minC) insight = cur2 ? 'Ten tydzień dopiero się zaczyna — raport zapełni się po pierwszych sesjach.' : 'W tym tygodniu nie było nauki.';
    else {
      insight = (cur2 ? 'Do tej pory w tym tygodniu: ' : 'W tym tygodniu: ') + Math.round(minC) + ' min nauki' +
        (dm == null ? ' — w poprzednim nie było nauki.' : dm > 0 ? ' — o ' + dm + '% więcej niż tydzień wcześniej.' : dm < 0 ? ' — o ' + Math.abs(dm) + '% mniej niż tydzień wcześniej.' : ' — tyle samo co tydzień wcześniej.');
      if (bestMin > 0) insight += minC > bestMin ? ' To Twój najlepszy tydzień!' : ' To ' + Math.round(minC / bestMin * 100) + '% Twojego rekordu (' + Math.round(bestMin) + ' min, od ' + new Date(R.best.s).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) + ').';
      else insight += ' To Twój pierwszy pełny tydzień — kolejne będą miały z czym się porównać.';
    }
    const delta = (c, p, pts, unit) => {
      if (c == null || p == null) return '';
      const d = pts ? Math.round(c - p) : pctDelta(c, p);
      if (d == null) return '<span class="delta up" title="tydzień wcześniej było 0">▲ +' + fmtNum(Math.round(c)) + (unit || '') + '</span>';
      return '<span class="delta ' + (d >= 0 ? 'up' : 'down') + '">' + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(d) + (pts ? ' pkt' : '%') + '</span>';
    };
    const kpi = (label, val, d, sub) => '<div class="kpi raised"><div class="small-note" style="font-size:15px">' + label + '</div><div class="row" style="gap:10px;align-items:baseline"><span class="kpi-val">' + val + '</span>' + d + '</div><div class="small-note" style="font-size:13px">' + sub + '</div></div>';
    const bestBar = bestMin > 0 && minC > 0
      ? '<div class="bar thin inset" title="Ten tydzień na tle rekordu"><div style="width:' + Math.min(100, minC / Math.max(bestMin, minC) * 100) + '%"></div></div><div class="small-note" style="font-size:12px">' + (minC > bestMin ? 'nowy rekord tygodnia' : 'rekord: ' + Math.round(bestMin) + ' min') + '</div>' : '';
    const kpis =
      '<div class="kpi raised"><div class="small-note" style="font-size:15px">Minuty nauki</div><div class="row" style="gap:10px;align-items:baseline"><span class="kpi-val">' + Math.round(minC) + ' min</span>' + delta(minC, minP, false, ' min') + '</div><div class="small-note" style="font-size:13px">tydzień wcześniej: ' + Math.round(minP) + ' min</div>' + bestBar + '</div>' +
      kpi('Dni nauki', R.a.days + '/7', delta(R.a.days, R.p.days, true).replace(' pkt', ''), 'tydzień wcześniej: ' + R.p.days + '/7') +
      kpi('Trafność', accC == null ? '—' : Math.round(accC) + '%', delta(accC, accP, true), 'tydzień wcześniej: ' + (accP == null ? '—' : Math.round(accP) + '%')) +
      kpi('Nowe słowa', fmtNum(R.a.newCount), delta(R.a.newCount, R.p.newCount), 'powtórek: ' + fmtNum(R.reviews) + ' · XP: ' + fmtNum(R.a.xp));
    const sd = { labels: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'], curBars: R.days.map((v, i) => cur2 && U.addDays(ws, i) > U.startOfDay() ? null : v), prevBars: R.pdays, goal: D().settings.goalMin, prevName: 'Tydzień wcześniej' };
    const skRows = ['vocab', 'grammar', 'listening', 'speaking'].map(k => {
      const c = R.sk[k], pp = R.psk[k];
      const ca = c[1] ? c[0] / c[1] * 100 : null, pa = pp[1] ? pp[0] / pp[1] * 100 : null;
      return '<div class="skrow"><div class="row between"><span>' + SKILL_NAME[k] + '</span><span>' + (ca == null ? '<span class="small-note">brak odpowiedzi</span>' : '<b>' + Math.round(ca) + '%</b> ' + delta(ca, pa, true)) + '</span></div>' +
        '<div class="bar thin inset"><div style="width:' + (ca || 0) + '%;background:' + SK_COLORS[k] + '"></div></div><div class="small-note" style="font-size:12px">' + (c[1] ? c[1] + ' odpowiedzi' : '') + (pa != null ? (c[1] ? ' · ' : '') + 'tydzień wcześniej ' + Math.round(pa) + '%' : '') + '</div></div>';
    }).join('');
    const hi = [];
    if (R.bestDay) hi.push(['Najlepszy dzień', WEEKDAYS[(R.bestDay.i + 1) % 7] + ' — ' + Math.round(R.bestDay.min) + ' min']);
    if (R.boss) hi.push(['Boss tygodnia', R.boss.won ? (R.boss.clean ? 'pokonany bez błędu' : 'pokonany') : 'nie tym razem (' + (R.boss.hits || 0) + '/' + (R.boss.max || '?') + ')']);
    if (R.audio.length) hi.push(['Audycje', R.audio.length + ' · średnio ' + Math.round(R.audio.reduce((s2, x) => s2 + x.score / x.n, 0) / R.audio.length * 100) + '% poprawnych']);
    if (R.known) hi.push(['Oznaczone „Umiem to”', String(R.known)]);
    R.promos.forEach(e => hi.push([e.kind === 'test' ? 'Test miesiąca' : 'Awans', ['vocab', 'grammar', 'listening', 'speaking'].map(k => SKILL_NAME[k] + ' ' + L[e.levels[k] != null ? e.levels[k] : 0]).join(' · ')]));
    R.badges.forEach(b => hi.push(['Odznaka', b.name || b.title || '']));
    const canNext = U.addDays(ws, 7) <= thisMon, canPrev = U.addDays(ws, -7) >= mondayOf(firstDay()) - 7 * U.DAY;
    app.innerHTML =
      '<div class="wrap">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + (from === 'home' ? ' Dalej ' : ' Wróć ') + K('Esc') + '</button>' +
      '<div class="ex-title"><b style="font-size:26px">Raport tygodnia</b><span>' + weekRangeLabel(ws) + (cur2 ? ' · w toku' : '') + '</span></div>' +
      '<div class="row" style="gap:10px"><button class="btn" id="rPrev"' + (canPrev ? '' : ' disabled') + ' aria-label="Poprzedni tydzień">' + K('←') + '</button><button class="btn" id="rNext"' + (canNext ? '' : ' disabled') + ' aria-label="Następny tydzień">' + K('→') + '</button></div></header>' +
      '<section class="note raised"><div class="ic inset" style="color:#B9456B">' + IC.chart + '</div><div class="tx" style="font-size:18px;line-height:1.45">' + esc(insight) + '</div></section>' +
      '<section class="kpis">' + kpis + '</section>' +
      '<section class="lower"><div class="panel raised grow"><div class="row between"><h2>Minuty dzień po dniu</h2>' +
      '<div class="legend"><span><i style="background:#5A84BC"></i>Ten tydzień</span><span><i style="background:rgba(110,100,90,.2)"></i>Tydzień wcześniej</span><span><i class="dash"></i>Cel ' + sd.goal + ' min</span></div></div>' + barsHtml(sd) + '</div>' +
      '<div class="panel raised side"><h2>Umiejętności</h2>' + skRows + '</div></section>' +
      '<section class="lower"><div class="panel raised grow"><h2>Wyróżnienia</h2>' + (hi.length ? hi.map(x => '<div class="rec inset"><div class="small-note">' + esc(x[0]) + '</div><b>' + esc(x[1]) + '</b></div>').join('') : '<div class="small-note">W tym tygodniu bez wyróżnień — następny będzie lepszy.</div>') + '</div>' +
      '<div class="panel raised side"><h2>Szło najtrudniej</h2>' + (R.hard.length ? R.hard.map(x => '<div class="rec inset"><div class="small-note" style="min-width:0">' + esc(x.cat) + '</div><b>' + x.n + '×</b></div>').join('') + '<button class="btn small" id="toMist">Otwórz dziennik błędów ' + K('D') + '</button>' : '<div class="small-note">Brak zapisanych błędów w tym tygodniu.</div>') + '</div></section>' +
      '</div>';
    const back = () => go(from === 'home' ? 'home' : 'stats');
    $('#back').onclick = back;
    if ($('#toMist')) $('#toMist').onclick = () => go('mistakes');
    $('#rPrev').onclick = () => { if (canPrev) renderReport({ week: U.dayKey(U.addDays(ws, -7)), from }); };
    $('#rNext').onclick = () => { if (canNext) renderReport({ week: U.dayKey(U.addDays(ws, 7)), from }); };
    keyHandler = e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape' || (e.key === 'Enter' && !onButton())) { e.preventDefault(); back(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); $('#rPrev').click(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); $('#rNext').click(); return; }
      if (e.code === 'KeyD' && $('#toMist')) { e.preventDefault(); go('mistakes'); }
    };
  }
  function reportsArchiveHtml() {
    const thisMon = mondayOf(Date.now()), first = mondayOf(firstDay());
    const rows = [];
    for (let s = thisMon; s >= first && rows.length < 12; s = U.addDays(s, -7)) {
      const a = aggDays(s, 7), p = aggDays(U.addDays(s, -7), 7);
      rows.push({ s, min: a.sec / 60, d: pctDelta(a.sec, p.sec), cur: s === thisMon });
    }
    if (!rows.length) return '<div class="small-note">Raporty pojawią się po pierwszym tygodniu nauki.</div>';
    const max = Math.max(1, Math.max.apply(null, rows.map(r => r.min)));
    return '<div class="col" style="gap:8px">' + rows.map(r =>
      '<button class="btn rep-row inset" data-rep="' + U.dayKey(r.s) + '"><span class="rr-l">' + weekRangeLabel(r.s) + (r.cur ? ' <span class="small-note">· w toku</span>' : '') + '</span>' +
      '<span class="rr-bar"><i style="width:' + (r.min / max * 100) + '%"></i></span><b>' + Math.round(r.min) + ' min</b>' +
      (r.d == null || r.cur ? '<span class="delta"></span>' : '<span class="delta ' + (r.d >= 0 ? 'up' : 'down') + '">' + (r.d >= 0 ? '▲ ' : '▼ ') + Math.abs(r.d) + '%</span>') + '</button>').join('') + '</div>';
  }


  /* ================= CZASY ================= */
  const TS_BY = {};
  (window.TENSES || []).forEach(t => { TS_BY[t.id] = t; });
  const TPAIR_BY = {};
  (window.TENSE_PAIRS || []).forEach(p => { TPAIR_BY[p.id] = p; });
  let TS_ITEMS = null;
  function parseTenseLine(tid, n, line) {
    const p = line.split('|');
    const m = line.match(/\[([^\]=]+)=([^\]]+)\]/); if (!m) return null;
    const rest = line.replace(m[0], '\u0000').split('|');
    if (rest.length < 2) return null;
    const sent = rest[0], i = sent.indexOf('\u0000');
    const inner = m[2].split('|');
    const correct = inner[0].split('/').map(x => x.trim());
    return { id: tid + '-' + n, tid, base: m[1].trim(), correct, opts: [correct[0]].concat(inner.slice(1).map(x => x.trim())), before: sent.slice(0, i), after: sent.slice(i + 1), pl: (rest[1] || '').trim(), signal: (rest[2] || '').trim(), why: (rest[3] || '').trim(), lvl: TS_BY[tid] ? TS_BY[tid].lvl : 2 };
  }
  let TS_DATA = null;
  function tenseItems() {
    if (TS_ITEMS && TS_DATA === D()) return TS_ITEMS;
    TS_DATA = D();
    const list = [], byId = {}, byT = {};
    const add = it => { if (!it || byId[it.id]) return; it = tenseFix(it); it.full = it.before + it.correct[0] + it.after; list.push(it); byId[it.id] = it; (byT[it.tid] = byT[it.tid] || []).push(it); };
    (window.TENSES || []).forEach(t => {
      (window.TENSE_RAW[t.id] || '').trim().split('\n').forEach((line, n) => { if (line.trim()) add(parseTenseLine(t.id, n, line.trim())); });
      ((D().tenseExtra || {})[t.id] || []).forEach((x, k) => add({ id: t.id + '-x' + k, tid: t.id, base: x.base, correct: [x.answer], opts: [x.answer].concat(x.wrong.slice(0, 3)), before: x.before.replace(/\s*$/, ' ').replace(/^ $/, ''), after: (/^[\s.,!?;:]/.test(x.after) ? '' : ' ') + x.after, pl: x.pl, signal: x.signal || '', why: x.why, lvl: t.lvl, ai: true }));
    });
    TS_ITEMS = { list, byId, byT };
    return TS_ITEMS;
  }
  function tenseIdsFor(tids) { const T = tenseItems(); return tids.reduce((a, t) => a.concat((T.byT[t] || []).map(x => x.id)), []); }
  /* nowe karty: najpierw „wybierz”, po 2 powtórkach „odmień”, potem (z AI) „przetłumacz” */
  function tensePool(tids) {
    const c = D().cards, out = { c: [], w: [], t: [] };
    tenseIdsFor(tids).forEach(id => {
      const a = c['tnc:' + id], b = c['tnw:' + id];
      if (!a) out.c.push('tnc:' + id);
      else if (!b && ((a.reps || 0) >= 2 || a.state === 'known')) out.w.push('tnw:' + id);
      else if (b && AI.enabled() && !c['tnt:' + id] && ((b.reps || 0) >= 2 || b.state === 'known')) out.t.push('tnt:' + id);
    });
    return roundRobin([out.c, out.w, out.t]);
  }
  function tenseStatus(tid) {
    const c = D().cards, items = (tenseItems().byT[tid] || []);
    let done = 0, learn = 0;
    items.forEach(it => {
      const ks = ['tnc:', 'tnw:', 'tnt:'].map(p => c[p + it.id]).filter(Boolean);
      if (!ks.length) return;
      if (ks.some(k => k.state === 'known' || (k.s || 0) >= 10) || ks.length >= 2 && ks.every(k => (k.reps || 0) >= 3)) done++; else learn++;
    });
    const h = (D().tenseHist || {})[tid] || [];
    const acc = h.length >= 5 ? Math.round(h.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, h.length) * 100) : null;
    return { total: items.length, done, learn, fresh: items.length - done - learn, acc, n: h.length };
  }
  function pushTenseHist(tid, ok) {
    const h = D().tenseHist = D().tenseHist || {};
    (h[tid] = h[tid] || []).push(ok ? 1 : 0);
    if (h[tid].length > 60) h[tid].splice(0, h[tid].length - 60);
  }
  function contractions(s) {
    return U.norm(s).replace(/won't/g, 'will not').replace(/can't/g, 'can not').replace(/n't/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will').replace(/'d\b/g, ' had').replace(/\s+/g, ' ').trim();
  }
  function tenseSentenceHtml(ts, fill, mark) {
    const sig = ts.signal;
    const hi = txt => {
      let h = esc(txt);
      if (mark && sig) { const re = new RegExp('(' + escapeRe(esc(sig)) + ')', 'i'); h = h.replace(re, '<mark class="sig">$1</mark>'); }
      return h;
    };
    return '<div class="sentence tsent"><span>' + hi(ts.before) + '</span><span class="gap inset deep">' + (fill ? esc(fill) : '_____') + '</span>' + (fill ? '' : '<span class="tbase">(' + esc(ts.base) + ')</span>') + '<span>' + hi(ts.after) + '</span></div>';
  }
  function tenseExerciseBody(it, ph, fbFull, unsureBtn, emptyNote, knownBtn, idkBtn, checkBtn) {
    const ts = it.ts, T = TS_BY[ts.tid];
    let body = '', controls = '';
    if (it.type === 'tense_c') {
      if (!S.tnOpts) S.tnOpts = U.shuffle(ts.opts.slice());
      const pick = fbFull ? S.fb.ans : null;
      body = '<div class="prompt-lbl">Wybierz poprawną formę czasownika</div>' +
        tenseSentenceHtml(ts, fbFull ? ts.correct[0] : '', fbFull) +
        '<div class="hint">Po polsku: ' + esc(ts.pl) + '</div>' +
        '<div class="options tnopts">' + S.tnOpts.map((o, i) => {
          const cls = !fbFull ? '' : o === ts.correct[0] ? ' ok' : o === pick ? ' bad' : ' dim';
          return '<button class="btn' + cls + '" data-topt="' + i + '"' + (fbFull ? ' tabindex="-1"' : '') + '><span class="k">' + (i + 1) + '</span>' + esc(o) + '</button>';
        }).join('') + '</div>';
      controls = unsureBtn + '<div class="row center" style="gap:14px;margin-top:4px">' + knownBtn + idkBtn + '</div><div class="small-note">' + K('1') + '–' + K('4') + ' wybierz</div>';
    } else if (it.type === 'tense_w') {
      body = '<div class="prompt-lbl">Wpisz czasownik w odpowiedniej formie</div>' +
        tenseSentenceHtml(ts, fbFull ? ts.correct[0] : '', fbFull) +
        '<div class="hint">Po polsku: ' + esc(ts.pl) + '</div>' +
        (fbFull ? (S.fb.ans && S.fb.kind !== 'ok' ? '<div class="hint">Ty: <s>' + esc(S.fb.ans) + '</s></div>' : '')
          : '<div class="answer-box"><label for="ans">Forma czasownika z nawiasu (' + esc(ts.base) + ')</label><input id="ans" class="answer" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="np. was riding" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '></div>');
      controls = unsureBtn + emptyNote + (S.hint ? '<div class="hint">Podpowiedź: to <b>' + esc(T.name) + '</b> — ' + esc(T.form[0][1]) + '</div>' : '') +
        '<div class="row center" style="gap:14px;margin-top:4px">' + hintBtn('Który czas?') + knownBtn + idkBtn + checkBtn + '</div>';
    } else {
      body = '<div class="prompt-lbl">Przetłumacz na angielski — uważaj na czas</div><div class="pl-sent">' + esc(ts.pl) + '</div>' +
        (fbFull
          ? '<div class="sentence" lang="en">' + esc(ts.full) + '</div>' + (S.fb.ans ? '<div class="hint">Ty: ' + esc(S.fb.ans) + '</div>' : '')
          : '<div class="answer-box" style="max-width:820px"><label for="ans">Po angielsku — wpisz albo powiedz</label><div class="ans-row"><input id="ans" class="answer" style="font-size:22px" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="' + (S.listening ? 'słucham…' : 'twoje tłumaczenie') + '" value="' + esc(S.answer) + '"' + (ph !== 'answer' ? ' disabled' : '') + '>' +
            (Recog.supported() ? '<button class="btn mic-sm' + (S.listening ? ' on primary' : '') + '" id="mic" aria-label="Powiedz (Alt+M)">' + IC.micSm + '</button>' : '') + '</div>' +
            (S.recogErr ? '<div class="fb bad" role="status">' + IC.alert + '<span>' + esc(S.recogErr) + '</span></div>' : '') + '</div>');
      controls = unsureBtn + emptyNote + (S.hint ? '<div class="hint">Podpowiedź: użyj czasu <b>' + esc(T.name) + '</b>.</div>' : '') +
        '<div class="row center" style="gap:14px;margin-top:4px">' + hintBtn('Który czas?') + knownBtn + idkBtn + checkBtn + '</div>';
    }
    return { body, controls };
  }
  function tenseFeedback(it, fb, xp, smalls, setTitle) {
    const ts = it.ts, T = TS_BY[ts.tid];
    const ai = t => aiTag(fb.mdl) + qaFmt(t);
    let main;
    if (it.type === 'tense_t') {
      const better = fb.better && U.norm(fb.better) !== U.norm(fb.ans || '') ? fb.better : '';
      if (fb.kind === 'typo') { setTitle('Zrozumiałe — da się lepiej.'); main = better ? 'Lepiej: <b lang="en">' + esc(better) + '</b>' + xp : xp.replace(' · ', ''); }
      else if (fb.kind === 'bad') main = better ? 'Poprawiona wersja: <b lang="en">' + esc(better) + '</b>' : 'Przykładowe tłumaczenie jest wyżej.';
      else if (fb.kind === 'idk') { setTitle('Tak można to powiedzieć:'); main = ''; }
      else main = xp.replace(' · ', '');
      if (fb.expl && fb.kind !== 'bad') smalls.push(ai(fb.expl));
      if (fb.kind === 'typo' && !fb.expl && fb.aiErr) smalls.push(esc(fb.aiErr));
    } else {
      if (fb.kind === 'bad') main = 'Poprawnie: <b>' + esc(ts.correct[0]) + '</b>.';
      else if (fb.kind === 'idk') { setTitle('Poprawna forma:'); main = '<b>' + esc(ts.correct[0]) + '</b>'; }
      else if (fb.kind === 'typo') main = '<b>' + esc(ts.correct[0]) + '</b>' + xp;
      else main = xp.replace(' · ', '');
    }
    smalls.unshift('<b>' + esc(T.name) + '</b> — ' + esc(ts.why) + (ts.signal ? ' <span class="sig-chip">sygnał: ' + esc(ts.signal) + '</span>' : ''));
    return main;
  }
  async function submitTense(it, c, asUnsure, elapsed, guard, checking) {
    const ts = it.ts, inp = $('#ans');
    const ans = inp ? inp.value : S.answer;
    S.answer = ans;
    if (!ans.trim()) return emptyEnter();
    if (asUnsure) S.unsure = true;
    if (it.type === 'tense_w') {
      const a = contractions(ans);
      let m = ts.correct.some(x => contractions(x) === a) ? 'exact' : 'wrong';
      if (m === 'wrong' && ts.correct.some(x => isTypoOf(a, contractions(x)))) m = 'typo';
      return applyOutcome(c, it, m, elapsed, { ans });
    }
    // tense_t
    if (S.listening) Recog.stop();
    let m = contractions(ans).replace(/[.!?]+$/, '') === contractions(ts.full).replace(/[.!?]+$/, '') ? 'exact' : 'wrong', expl = '', aiErr = '', better = '';
    if (m === 'wrong') {
      if (AI.enabled()) {
        checking();
        try {
          const r = await AI.judgeTranslation(ts.pl, ts.full, ans.trim(), 'To ćwiczenie na czasy. Oczekiwany czas: ' + TS_BY[ts.tid].name + '. Jeśli Artur użył złego czasu, verdict = "wrong" i w explanation wyjaśnij krótko, dlaczego potrzebny jest ten czas.');
          expl = r.explanation; better = r.better;
          m = r.verdict === 'natural' ? 'ai-ok' : r.verdict === 'understandable' ? 'typo' : 'wrong';
        } catch (e) { aiErr = AI.humanError(e); m = listenScore(ts.full, ans) >= 0.85 ? 'typo' : 'wrong'; }
        if (!guard()) return;
      } else m = listenScore(ts.full, ans) >= 0.85 ? 'typo' : 'wrong';
    }
    return applyOutcome(c, it, m, elapsed, { ans, expl, aiErr, better });
  }
  function pickTenseOpt(it, i) {
    if (!S || S.phase !== 'answer' || !S.tnOpts || i >= S.tnOpts.length) return;
    const ans = S.tnOpts[i];
    applyOutcome(cur(), it, ans === it.ts.correct[0] ? 'exact' : 'wrong', (Date.now() - S.cardStart) / 1000, { ans });
  }
  function startTenseSession(tids, title) {
    tids = tids.filter(t => TS_BY[t]);
    if (!tids.length) return;
    tids.forEach(t => { D().tenseOpen[t] = 1; });
    const c = D().cards, end = endOfToday();
    const due = [];
    tenseIdsFor(tids).forEach(id => ['tnc:', 'tnw:', 'tnt:'].forEach(p => { const k = c[p + id]; if (k && k.state === 'review' && k.due < end && typeEnabled(itemFor(p + id).type)) due.push(p + id); }));
    const fresh = sortByDiff(tensePool(tids).filter(id => typeEnabled(itemFor(id).type)), false).slice(0, 8);
    const queue = roundRobin([U.shuffle(due).slice(0, 20).map(id => ({ id, isNew: false })), fresh.map(id => ({ id, isNew: true, newKind: 'extra' }))]);
    Store.save();
    if (queue.length) { newSession({ custom: title || 'Czasy', queue, tenseTids: tids }); go('exercise'); return; }
    newSession({ play: 'tense', playTids: tids, tenseTids: tids, custom: title || 'Czasy', queue: buildPlayQueue('tense', 15, []) });
    if (!S.queue.length) { S = null; toast('Brak zdań do ćwiczenia.'); return; }
    toast('Na dziś wszystko powtórzone — ćwiczysz bez wpływu na powtórki.');
    go('exercise');
  }
  function tenseTimelineSvg(T) {
    const X = x => 30 + x * 5.6, Y = 70, NOW = X(62);
    let s = '<svg viewBox="0 0 620 130" class="timeline" role="img" aria-label="Oś czasu: ' + esc(T.tlNote || '') + '">';
    s += '<line x1="' + X(0) + '" x2="' + X(100) + '" y1="' + Y + '" y2="' + Y + '" stroke="#ADA79F" stroke-width="2"/><path d="M' + (X(100) - 8) + ' ' + (Y - 6) + ' L' + X(100) + ' ' + Y + ' L' + (X(100) - 8) + ' ' + (Y + 6) + '" fill="none" stroke="#ADA79F" stroke-width="2"/>';
    s += '<line x1="' + NOW + '" x2="' + NOW + '" y1="' + (Y - 34) + '" y2="' + (Y + 14) + '" stroke="#B9456B" stroke-width="2"/><text x="' + NOW + '" y="' + (Y - 40) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#B9456B">TERAZ</text>';
    s += '<text x="' + X(4) + '" y="' + (Y + 34) + '" font-size="12" fill="#5F5B55">przeszłość</text><text x="' + X(96) + '" y="' + (Y + 34) + '" text-anchor="end" font-size="12" fill="#5F5B55">przyszłość</text>';
    const C = '#5E7898';
    (T.tl || []).forEach(e => {
      if (e.k === 'dot') s += '<circle cx="' + X(e.x) + '" cy="' + Y + '" r="9" fill="' + (e.hollow ? '#E3E0DC' : C) + '" stroke="' + C + '" stroke-width="3"' + (e.dashed ? ' stroke-dasharray="4 3" fill-opacity=".35"' : '') + '/>' + (e.label ? '<text x="' + X(e.x) + '" y="' + (Y - 16) + '" text-anchor="middle" font-size="14" font-weight="700" fill="' + C + '">' + e.label + '</text>' : '');
      else if (e.k === 'dots') e.xs.forEach(x => { s += '<circle cx="' + X(x) + '" cy="' + Y + '" r="6" fill="' + C + '"/>'; });
      else if (e.k === 'bar') s += '<rect x="' + X(e.x1) + '" y="' + (Y - 9) + '" width="' + (X(e.x2) - X(e.x1)) + '" height="18" rx="9" fill="' + C + '" fill-opacity=".85"/>' + (e.wave ? '<path d="M' + X(e.x1 + 2) + ' ' + Y + ' q 8 -6 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>' : '');
      else if (e.k === 'cross') s += '<g stroke="#C2584A" stroke-width="4" stroke-linecap="round"><line x1="' + (X(e.x) - 9) + '" y1="' + (Y - 20) + '" x2="' + (X(e.x) + 9) + '" y2="' + (Y - 2) + '"/><line x1="' + (X(e.x) + 9) + '" y1="' + (Y - 20) + '" x2="' + (X(e.x) - 9) + '" y2="' + (Y - 2) + '"/></g>';
      else if (e.k === 'arrow') s += '<path d="M' + X(e.x1) + ' ' + (Y - 4) + ' Q ' + ((X(e.x1) + X(e.x2)) / 2) + ' ' + (Y - 40) + ' ' + X(e.x2) + ' ' + (Y - 8) + '" fill="none" stroke="' + C + '" stroke-width="2.5"' + (e.dashed ? ' stroke-dasharray="6 4"' : '') + '/><path d="M' + (X(e.x2) - 10) + ' ' + (Y - 16) + ' L' + X(e.x2) + ' ' + (Y - 8) + ' L' + (X(e.x2) - 12) + ' ' + (Y - 4) + '" fill="none" stroke="' + C + '" stroke-width="2.5"/>';
      else if (e.k === 'tick') s += '<line x1="' + X(e.x) + '" x2="' + X(e.x) + '" y1="' + (Y - 22) + '" y2="' + (Y + 12) + '" stroke="#C39046" stroke-width="3"/>';
      else if (e.k === 'deadline') s += '<line x1="' + X(e.x) + '" x2="' + X(e.x) + '" y1="' + (Y - 26) + '" y2="' + (Y + 16) + '" stroke="#C39046" stroke-width="3"/><text x="' + X(e.x) + '" y="' + (Y - 32) + '" text-anchor="middle" font-size="12" fill="#8A5200">termin</text>';
    });
    return s + '</svg>';
  }
  function tenseMapHtml() {
    return '<div class="tmap">' + (window.TENSES || []).map(T => {
      const st = tenseStatus(T.id), pd = st.total ? st.done / st.total * 100 : 0, pl2 = st.total ? st.learn / st.total * 100 : 0;
      return '<button class="btn tmap-row" data-tense="' + T.id + '" title="' + esc(T.name + ': opanowane ' + st.done + ', w nauce ' + st.learn + ', nowe ' + st.fresh) + '"><span class="tm-name">' + esc(T.name) + ' <small>' + L[T.lvl] + '</small></span>' +
        '<span class="tm-bar inset"><i class="d" style="width:' + pd + '%"></i><i class="l" style="width:' + pl2 + '%"></i></span>' +
        '<span class="tm-acc">' + (st.acc == null ? '<span class="small-note">—</span>' : st.acc + '%') + '</span></button>';
    }).join('') + '</div>';
  }
  function renderTenses() {
    S = null; stopReading();
    const lvl = levels().grammar;
    const open = Object.keys(D().tenseOpen || {}).filter(t => TS_BY[t]);
    const groups = [[0, 1, 'A1–A2'], [2, 2, 'B1'], [3, 4, 'B2–C1']];
    app.innerHTML =
      '<div class="wrap">' + backHeader('Czasy', 'lekcje z osią czasu i ćwiczenia w zdaniach') +
      '<section class="lower"><div class="panel raised grow"><div class="row between"><h2>Mapa czasów</h2><div class="legend"><span><i style="background:#5E7898"></i>opanowane</span><span><i style="background:#AEBBCB"></i>w nauce</span><span><i style="background:var(--bg-in)"></i>nowe</span><span class="small-note">% = trafność</span></div></div>' + tenseMapHtml() + '</div>' +
      '<div class="panel raised side"><h2>Ćwicz</h2><p class="small-note" style="margin:0">' + (open.length ? 'Mieszanka czasów, które już otworzyłeś (' + open.length + '). Ich zdania wchodzą też do codziennych sesji.' : 'Otwórz lekcję, żeby jej zdania pojawiały się w codziennych sesjach.') + '</p>' +
      '<button class="btn primary" id="tMix"' + (open.length ? '' : ' disabled') + '>Ćwicz otwarte czasy ' + K('Enter') + '</button>' +
      '<button class="btn" id="tLevel">Ćwicz czasy z mojego poziomu (' + L[lvl] + ')</button></div></section>' +
      groups.map(g => {
        const ts = (window.TENSES || []).filter(T => T.lvl >= g[0] && T.lvl <= g[1]);
        const ps = (window.TENSE_PAIRS || []).filter(P => P.lvl >= g[0] && P.lvl <= g[1]);
        return '<section class="col" style="gap:14px"><h2 style="font-size:20px">' + g[2] + '</h2><div class="tlessons">' +
          ts.map(T => { const st = tenseStatus(T.id); return '<button class="btn tlesson raised" data-tense="' + T.id + '"><b>' + esc(T.name) + '</b><small>' + esc(T.pl) + '</small><span class="tl-prog"><i style="width:' + (st.total ? (st.done + st.learn * 0.5) / st.total * 100 : 0) + '%"></i></span>' + (D().tenseOpen[T.id] ? '' : '<span class="tl-new">nowa</span>') + '</button>'; }).join('') +
          ps.map(P => '<button class="btn tlesson pair raised" data-pair="' + P.id + '"><b>' + esc(P.name) + '</b><small>porównanie</small></button>').join('') +
          '</div></section>';
      }).join('') + '</div>';
    $('#back').onclick = () => go('home');
    $$('[data-tense]').forEach(b => b.onclick = () => go('tense', b.dataset.tense));
    $$('[data-pair]').forEach(b => b.onclick = () => go('tense', b.dataset.pair));
    $('#tMix').onclick = () => startTenseSession(open, 'Czasy: mieszanka');
    $('#tLevel').onclick = () => startTenseSession((window.TENSES || []).filter(T => T.lvl <= lvl).map(T => T.id), 'Czasy: poziom ' + L[lvl]);
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('home'); return; }
      if (e.key === 'Enter' && !onButton() && open.length) { e.preventDefault(); $('#tMix').click(); }
    };
  }
  function renderTenseLesson(id) {
    S = null;
    const T = TS_BY[id], P = TPAIR_BY[id];
    if (!T && !P) return go('tenses');
    const tids = T ? [T.id] : [P.a, P.b];
    tids.forEach(t => { D().tenseOpen[t] = 1; }); Store.save();
    const exHtml = items => '<div class="col" style="gap:10px">' + items.map(x => '<div class="tex inset"><button class="btn small" data-say="' + esc(x.full) + '" aria-label="Odsłuchaj">' + IC.speaker + '</button><div><div lang="en">' + esc(x.before) + '<b>' + esc(x.correct[0]) + '</b>' + esc(x.after) + '</div><div class="small-note">' + esc(x.pl) + '</div></div></div>').join('') + '</div>';
    const summary = TT => '<div class="col" style="gap:12px"><h3>Kiedy używamy</h3><ul class="twhen">' + TT.when.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul>' +
      '<h3>Budowa</h3><div class="tform">' + TT.form.map(f => '<div><b>' + f[0] + '</b><span lang="en">' + esc(f[1]) + '</span></div>').join('') + '</div>' +
      '<h3>Słowa-sygnały</h3><div class="chips">' + TT.signals.map(sg => '<span class="chip inset">' + esc(sg) + '</span>').join('') + '</div></div>';
    let main;
    if (T) {
      const items = (tenseItems().byT[T.id] || []).slice(0, 3);
      const st = tenseStatus(T.id);
      main = '<section class="lower"><div class="panel raised grow"><h3>Oś czasu</h3>' + tenseTimelineSvg(T) + '<p class="small-note" style="margin:0 0 6px">' + esc(T.tlNote) + '</p>' + summary(T) + '<section class="note inset tip"><div class="tx"><b>Uwaga dla Polaków</b><span>' + esc(T.tip) + '</span></div></section></div>' +
        '<div class="panel raised side"><h2>Przykłady</h2>' + exHtml(items) +
        '<div class="rstats"><div><b>' + st.done + '</b><span>opanowane</span></div><div><b>' + st.learn + '</b><span>w nauce</span></div><div><b>' + st.fresh + '</b><span>nowe</span></div></div>' +
        (st.fresh === 0 && AI.enabled() ? '<button class="btn small" id="tMore">Dobierz 10 nowych zdań z AI</button><div id="tMoreMsg"></div>' : '') + '</div></section>';
    } else {
      const A = TS_BY[P.a], B = TS_BY[P.b];
      main = '<section class="note raised"><div class="tx"><b>Jak odróżnić?</b><span><ul class="twhen" style="margin:6px 0 0">' + P.how.map(h => '<li>' + esc(h) + '</li>').join('') + '</ul></span></div></section>' +
        '<section class="panel raised"><h2>Para przykładów</h2><div class="col" style="gap:10px">' + P.pairs.map(x => '<div class="tex inset"><button class="btn small" data-say="' + esc(x[0]) + '" aria-label="Odsłuchaj">' + IC.speaker + '</button><div><div lang="en"><b>' + esc(x[0]) + '</b></div><div class="small-note">' + esc(x[1]) + '</div></div></div>').join('') + '</div></section>' +
        '<section class="lower">' + [A, B].map(TT => '<div class="panel raised grow"><h2>' + esc(TT.name) + '</h2>' + tenseTimelineSvg(TT) + summary(TT) + '</div>').join('') + '</section>';
    }
    const name = T ? T.name : P.name;
    app.innerHTML =
      '<div class="wrap">' +
      '<header class="ex-head"><button class="btn" id="back">' + IC.back + ' Czasy ' + K('Esc') + '</button>' +
      '<div class="ex-title"><b style="font-size:26px">' + esc(name) + '</b><span>' + (T ? esc(T.pl) + ' · ' + L[T.lvl] : 'porównanie · ' + L[P.lvl]) + '</span></div>' +
      '<button class="btn primary" id="tGo">Ćwicz ' + (T ? 'ten czas' : 'oba czasy') + ' ' + K('Enter') + '</button></header>' + main + '</div>';
    $('#back').onclick = () => go('tenses');
    $('#tGo').onclick = () => startTenseSession(tids, T ? 'Czasy: ' + T.name : P.name);
    $$('[data-say]').forEach(b => b.onclick = () => Speech.speak(b.dataset.say));
    if ($('#tMore')) $('#tMore').onclick = async () => {
      const btn = $('#tMore'), msg = $('#tMoreMsg'); btn.disabled = true;
      msg.innerHTML = '<div class="checking"><span class="spinner"></span>AI pisze nowe zdania…</div>';
      try {
        const raw = await AI.makeTenseItems(T.name, L[Math.max(T.lvl, levels().grammar)], 12, (tenseItems().byT[T.id] || []).map(x => x.full));
        msg.innerHTML = '<div class="checking"><span class="spinner"></span>AI sprawdza zdania (drugi raz, niezależnie)…</div>';
        const full = x => String(x.before).replace(/\s*$/, ' ').replace(/^ $/, '') + x.answer + (/^[\s.,!?;:]/.test(x.after) ? '' : ' ') + x.after;
        const chk = await AI.checkSentences(raw.map(x => ({ s: full(x), word: x.answer, note: 'ćwiczenie na czas ' + T.name + ', luka: „' + x.answer + '”; błędne opcje: ' + x.wrong.slice(0, 3).join(', ') + ' — zdanie jest złe także wtedy, gdy któraś z błędnych opcji też pasuje albo gdy kontekst nie wymusza czasu ' + T.name })));
        const out = raw.filter((x, i) => chk[i] && chk[i].ok).slice(0, 10);
        if (!out.length) throw new Error('żadne z nowych zdań nie przeszło kontroli — spróbuj jeszcze raz.');
        const ex = D().tenseExtra = D().tenseExtra || {};
        ex[T.id] = (ex[T.id] || []).concat(out.map(x => ({ before: String(x.before), after: String(x.after), base: String(x.base), answer: String(x.answer), wrong: x.wrong.slice(0, 3).map(String), pl: String(x.pl), signal: String(x.signal || ''), why: String(x.why) })));
        TS_ITEMS = null; progress(); Store.save();
        if (screen === 'tense') { renderTenseLesson(id); toast('Dodano ' + out.length + ' nowych zdań (odrzucono ' + (raw.length - out.length) + ' słabszych).'); }
      } catch (e) { if (msg) msg.innerHTML = '<span class="status bad">' + esc(AI.humanError(e)) + '</span>'; btn.disabled = false; }
    };
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); go('tenses'); return; }
      if (e.key === 'Enter' && !onButton()) { e.preventDefault(); $('#tGo').click(); }
    };
  }


  /* ================= ROZMOWA Z AI ================= */
  const TALK_SCENES = [
    { id: 'support', title: 'Infolinia: laptop nie działa', role: "You are Sam, a friendly but busy customer support agent at a laptop company's helpline. The customer's laptop won't turn on. Ask for details (model, when it started, warranty, order number) and suggest solutions before agreeing to a repair or replacement.", goal: 'Wyjaśnij problem i załatw naprawę albo wymianę laptopa.' },
    { id: 'interview', title: 'Rozmowa o pracę', role: 'You are Olivia, an HR manager at a tech company, interviewing the candidate. Ask typical interview questions one at a time: experience, strengths, why this company, a problem they solved, questions for you.', goal: 'Przedstaw swoje doświadczenie i odpowiedz na pytania rekrutera.' },
    { id: 'project', title: 'Opowiedz o swojej pracy', role: "You are Tom, a curious British engineer the learner met at a meetup. Ask about the learner's job and what they are working on now, show real interest and ask follow-up questions.", goal: 'Opowiedz, czym się zajmujesz i nad czym teraz pracujesz.' },
    { id: 'hotel', title: 'Hotel: zameldowanie', role: 'You are a receptionist at a hotel in London. The guest is checking in, but there is a mistake with the booking (wrong dates). Be polite, explain and offer options.', goal: 'Zamelduj się i rozwiąż problem z rezerwacją.' },
    { id: 'doctor', title: 'U lekarza', role: 'You are Dr Wilson, a family doctor in the UK. The patient feels unwell. Ask about symptoms, how long, temperature, medicines, then give simple advice.', goal: 'Opisz objawy i dowiedz się, co masz robić.' },
    { id: 'restaurant', title: 'Restauracja', role: "You are a waiter in a busy restaurant. Greet the guest, take the order, answer questions about dishes (ingredients, allergies), recommend today's special.", goal: 'Zamów jedzenie i dopytaj o skład dania.' },
    { id: 'refund', title: 'Sklep: reklamacja', role: 'You are a shop assistant in an electronics store. The customer wants to return headphones that stopped working. Ask for the receipt and what happened; first offer a repair, agree to a refund only if the customer asks politely and clearly.', goal: 'Zwróć wadliwe słuchawki i odzyskaj pieniądze.' },
    { id: 'smalltalk', title: 'Small talk na konferencji', role: 'You are Priya, a software engineer at a tech conference, chatting with the person next to you during the coffee break: talks you liked, where you are from, work, travel.', goal: 'Porozmawiaj swobodnie i wymień się kontaktami.' },
    { id: 'free', title: 'Dowolny temat', role: null, goal: 'Porozmawiaj swobodnie na wybrany temat.' }
  ];
  let TK = null;
  /* czas w Rozmowie liczy wspólny licznik (TIME_MOD) */
  function stopTalkAudio() { if (TK && TK.listening) Recog.stop(); if (window.speechSynthesis) speechSynthesis.cancel(); }
  function talkRate(slow) { return (D().settings.rate || 0.95) * (LISTEN_RATE[TK ? TK.lvl : 2] || 1) * (slow ? 0.75 : 1); }
  function wordsCount(s) { return String(s).trim().split(/\s+/).filter(Boolean).length; }
  function renderTalk() {
    S = null; stopReading();
    if (!TK || TK.phase === 'pick') return renderTalkPick();
    if (TK.phase === 'chat') return renderTalkChat();
    return renderTalkSummary();
  }
  function talkHistChart(list) {
    const xs = list.slice(-12);
    if (xs.length < 2) return '';
    const max = Math.max(4, Math.max.apply(null, xs.map(x => x.avgWords || 0)));
    const W = 560, H = 120, bw = Math.min(36, (W - 40) / xs.length - 8);
    let svg = '<svg viewBox="0 0 ' + W + ' ' + (H + 30) + '" class="lines" role="img" aria-label="Średnia długość wypowiedzi w kolejnych rozmowach">';
    [0, 0.5, 1].forEach(f => { const y = 10 + H - f * H; svg += '<line x1="30" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#CFCAC2"/><text x="24" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#5F5B55">' + Math.round(f * max) + '</text>'; });
    xs.forEach((x, i) => {
      const h = (x.avgWords || 0) / max * H, cx = 40 + i * ((W - 50) / xs.length);
      svg += '<rect x="' + cx.toFixed(1) + '" y="' + (10 + H - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, h).toFixed(1) + '" rx="4" fill="#789E66"><title>' + esc(x.title) + ': średnio ' + (x.avgWords || 0) + ' słów na wypowiedź</title></rect>';
      svg += '<text x="' + (cx + bw / 2).toFixed(1) + '" y="' + (H + 26) + '" text-anchor="middle" font-size="10" fill="#5F5B55">' + new Date(x.at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' }) + '</text>';
    });
    return '<div class="small-note">Średnio słów na wypowiedź — im dłuższe, tym swobodniej mówisz:</div>' + svg + '</svg>';
  }
  function renderTalkPick() {
    const ai = AI.enabled();
    if (!TK) TK = { phase: 'pick', lvl: levels().speaking };
    const list = D().convos || [];
    const recent = list.slice(-6).reverse();
    app.innerHTML =
      '<div class="wrap narrow">' + backHeader('Rozmowa', 'scenki z AI — mów albo pisz, liczy się, żeby się dogadać') +
      (!ai ? '<section class="note raised"><div class="ic inset">' + IC.lock + '</div><div class="tx"><b>Rozmowa wymaga klucza API</b><span>Rozmówcę gra AI. Dodaj klucz w ustawieniach.</span></div><button class="btn primary" id="toSet">Ustawienia</button></section>' : '') +
      (!Recog.supported() ? '<section class="note raised"><div class="ic inset">' + IC.alert + '</div><div class="tx"><b>Mikrofon niedostępny</b><span>Ta przeglądarka nie rozpoznaje mowy — możesz rozmawiać, pisząc. Głosem działa w Chrome i Edge.</span></div></section>' : '') +
      '<section class="set-card raised"><div class="row between"><h2>Wybierz scenkę</h2><div class="lvl-pills" role="group" aria-label="Poziom rozmówcy">' + L.map((l, i) => '<button class="btn pill small' + (TK.lvl === i ? ' pressed' : '') + '" data-lv="' + i + '">' + l + '</button>').join('') + '</div></div>' +
      '<div class="topics">' + TALK_SCENES.map((sc, i) => '<button class="btn topic raised scene" data-scene="' + i + '"' + (ai ? '' : ' disabled') + '><span class="num-key">' + (i + 1) + '</span><b>' + esc(sc.title) + '</b><small>' + esc(sc.goal) + '</small></button>').join('') + '</div>' +
      '<div class="field"><label for="tkTopic">Dowolny temat</label><div class="ctl"><input id="tkTopic" class="txt" autocomplete="off" placeholder="np. przyszłość samochodów elektrycznych"' + (ai ? '' : ' disabled') + '><button class="btn primary" id="tkFree"' + (ai ? '' : ' disabled') + '>Rozmawiaj</button></div></div>' +
      '<label class="check"><input type="checkbox" id="tkAuto"' + (D().talkAutoSend !== false ? ' checked' : '') + '> Wysyłaj od razu po wypowiedzi (bez poprawiania tekstu)</label>' +
      (TK.err ? '<div class="status bad">' + esc(TK.err) + '</div>' : '') + '</section>' +
      (recent.length ? '<section class="set-card raised"><h2>Ostatnie rozmowy</h2>' + talkHistChart(list) + '<div class="col" style="gap:10px">' +
        recent.map(x => '<div class="list-item inset"><div style="min-width:0"><span class="w" style="font-size:17px">' + esc(x.title) + '</span><div class="small-note">' + new Date(x.at).toLocaleDateString('pl-PL') + ' · ' + L[x.lvl] + ' · ' + x.turns + ' wypowiedzi · śr. ' + x.avgWords + ' słów' + (x.goal ? ' · cel ✓' : '') + '</div></div>' +
          (x.score != null ? '<b>' + x.score + '%</b>' : '') + '</div>').join('') + '</div></section>' : '') +
      '</div>';
    $('#back').onclick = () => { TK = null; go('home'); };
    if ($('#toSet')) $('#toSet').onclick = () => go('settings');
    $$('[data-lv]').forEach(b => b.onclick = () => { TK.lvl = +b.dataset.lv; renderTalkPick(); });
    $('#tkAuto').onchange = e => { D().talkAutoSend = e.target.checked; Store.save(); };
    $$('[data-scene]').forEach(b => b.onclick = () => { const sc = TALK_SCENES[+b.dataset.scene]; if (sc.id === 'free') { $('#tkTopic').focus(); return; } startTalk(sc); });
    const free = () => { const v = $('#tkTopic').value.trim(); if (!v) { shake($('#tkTopic')); $('#tkTopic').focus(); return; } startTalk(TALK_SCENES[TALK_SCENES.length - 1], v); };
    $('#tkFree').onclick = free;
    $('#tkTopic').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); free(); } };
    keyHandler = e => {
      if (e.key === 'Escape') { e.preventDefault(); if (typingInField()) document.activeElement.blur(); else { TK = null; go('home'); } return; }
      if (!ai || typingInField() || e.altKey || e.ctrlKey || e.metaKey) return;
      if (/^[1-9]$/.test(e.key)) { e.preventDefault(); const b = $('[data-scene="' + (+e.key - 1) + '"]'); if (b) b.click(); }
    };
  }
  function startTalk(scene, topic) {
    const sc = Object.assign({}, scene);
    if (sc.id === 'free') { sc.role = 'You are Alex, a friendly and curious conversation partner. Talk with the learner about: ' + topic + '. Share interesting facts and your opinions, and ask questions.'; sc.title = 'Temat: ' + topic; sc.goal = 'Porozmawiaj swobodnie: ' + topic + '.'; }
    TK = { phase: 'chat', scene: sc, lvl: TK ? TK.lvl : levels().speaking, msgs: [], busy: false, listening: false, interim: '', hints: null, hintBusy: false, err: '', goalDone: false, hintsUsed: 0, tr: {}, trBusy: false, started: Date.now(), draft: '' };
    renderTalkChat();
    talkAiTurn();
  }
  async function talkAiTurn() {
    const X = TK; if (!X) return;
    X.busy = true; X.err = ''; renderTalkChat();
    try {
      const r = await AI.talkTurn(X.scene, L[X.lvl], X.msgs);
      if (TK !== X) return;
      if (!X.used) { X.used = 1; bumpUse('talk'); }
      const lastMe = X.msgs.length && X.msgs[X.msgs.length - 1].role === 'me' ? X.msgs[X.msgs.length - 1] : null;
      if (lastMe) lastMe.ok = r.understood;
      if (r.goalDone && !X.goalDone) { X.goalDone = true; Sound.play('combo'); }
      X.msgs.push({ role: 'ai', text: r.reply || '…' });
      X.busy = false;
      if (screen === 'talk') { renderTalkChat(); Speech.speakOne(r.reply, talkRate(false)); }
    } catch (e) {
      if (TK !== X) return;
      X.busy = false; X.err = AI.humanError(e);
      if (screen === 'talk') renderTalkChat();
    }
  }
  function talkSend(text) {
    const X = TK; if (!X || X.busy || X.phase !== 'chat') return;
    text = String(text || '').trim();
    if (!text) { shake($('#tkIn')); return; }
    stopTalkAudio();
    X.msgs.push({ role: 'me', text });
    X.hints = null; X.draft = '';
    talkAiTurn();
  }
  function talkMic() {
    const X = TK; if (!X || X.phase !== 'chat' || X.busy) return;
    if (X.listening) { Recog.stop(); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    const inp = $('#tkIn'); if (inp) X.draft = inp.value;
    X.listening = true; X.interim = ''; X.err = ''; renderTalkChat();
    Recog.listen({
      silenceMs: 3000,
      onInterim: t => { if (TK !== X) return; X.interim = t; const el = $('#tkInterim'); if (el) el.textContent = t; },
      onResult: alts => {
        if (TK !== X) return;
        X.listening = false; X.interim = '';
        const t = alts[0] || '';
        if (D().talkAutoSend !== false) talkSend(t);
        else { X.draft = t; renderTalkChat(); const el = $('#tkIn'); if (el) el.focus(); }
      },
      onError: err => { if (TK !== X) return; X.listening = false; X.interim = ''; if (err !== 'aborted') X.err = recogMsg(err); renderTalkChat(); }
    });
  }
  async function talkHintGet() {
    const X = TK; if (!X || X.busy || X.hintBusy || !X.msgs.length) return;
    X.hintBusy = true; X.hintsUsed++; renderTalkChat();
    try { X.hints = await AI.talkHint(X.scene, L[X.lvl], X.msgs); }
    catch (e) { X.err = AI.humanError(e); }
    X.hintBusy = false;
    if (TK === X && screen === 'talk') renderTalkChat();
  }
  async function talkTranslateLast() {
    const X = TK; if (!X) return;
    let idx = -1; for (let i = X.msgs.length - 1; i >= 0; i--) if (X.msgs[i].role === 'ai') { idx = i; break; }
    if (idx < 0 || X.tr[idx] || X.trBusy) return;
    X.trBusy = true; renderTalkChat();
    try { X.tr[idx] = await AI.translateSentence(X.msgs[idx].text, ''); }
    catch (e) { X.err = AI.humanError(e); }
    X.trBusy = false;
    if (TK === X && screen === 'talk') renderTalkChat();
  }
  function talkRepeatSlow() {
    const X = TK; if (!X) return;
    for (let i = X.msgs.length - 1; i >= 0; i--) if (X.msgs[i].role === 'ai') { Speech.speakOne(X.msgs[i].text, talkRate(true)); return; }
  }
  function renderTalkChat() {
    const X = TK;
    const meN = X.msgs.filter(m => m.role === 'me').length;
    const chat = X.msgs.map((m, i) => m.role === 'ai'
      ? '<div class="bub ai"><div class="bt" lang="en">' + esc(m.text) + '</div>' + (X.tr[i] ? '<div class="btr">' + esc(X.tr[i]) + '</div>' : '') + '<button class="btn small bsay" data-say="' + i + '" aria-label="Odsłuchaj">' + IC.speaker + '</button></div>'
      : '<div class="bub me' + (m.ok === false ? ' unclear' : '') + '"><div class="bt" lang="en">' + esc(m.text) + '</div>' + (m.ok === false ? '<div class="btr">rozmówca nie był pewien, o co chodzi</div>' : '') + '</div>').join('') +
      (X.busy ? '<div class="bub ai typing"><span></span><span></span><span></span></div>' : '');
    const draft = X.draft || '';
    app.innerHTML =
      '<div class="wrap narrow talk-wrap">' +
      '<header class="ex-head"><button class="btn" id="tkEnd">' + IC.back + ' Zakończ ' + K('Esc') + '</button>' +
      '<div class="ex-title" style="min-width:0"><b>' + esc(X.scene.title) + '</b><span>rozmówca na poziomie ' + L[X.lvl] + ' · Twoje wypowiedzi: ' + meN + '</span></div>' +
      '<div class="goal-pill ' + (X.goalDone ? 'done' : 'inset') + '">' + (X.goalDone ? IC.check + ' Cel osiągnięty' : 'Cel: ' + esc(X.scene.goal)) + '</div></header>' +
      '<section class="chat raised" id="tkChat" aria-live="polite">' + chat + '</section>' +
      (X.err ? '<div class="fb bad" role="status">' + IC.alert + '<span>' + esc(X.err) + (X.msgs.length && X.msgs[X.msgs.length - 1].role === 'me' ? ' <button class="btn small" id="tkRetry">Spróbuj ponownie</button>' : (!X.msgs.length ? ' <button class="btn small" id="tkRetry">Spróbuj ponownie</button>' : '')) + '</span></div>' : '') +
      (X.hints ? '<section class="hints"><div class="small-note">Możesz powiedzieć na przykład (kliknij, żeby wstawić):</div>' + X.hints.map((h, i) => '<button class="btn hint-opt" data-hint="' + i + '"><span lang="en">' + esc(h.en) + '</span><small>' + esc(h.pl) + '</small></button>').join('') + '</section>' : X.hintBusy ? '<div class="checking"><span class="spinner"></span>Szukam podpowiedzi…</div>' : '') +
      '<section class="composer raised">' +
      (Recog.supported() ? '<button class="btn mic-talk' + (X.listening ? ' on primary' : '') + '" id="tkMic" aria-label="' + (X.listening ? 'Zatrzymaj' : 'Mów (Spacja)') + '"' + (X.busy ? ' disabled' : '') + '>' + IC.micSm + '</button>' : '') +
      '<div class="tk-in">' + (X.listening ? '<div class="interim inset deep" id="tkInterim">' + esc(X.interim || 'Słucham… mów po angielsku') + '</div>'
        : '<input id="tkIn" class="txt" autocomplete="off" spellcheck="true" placeholder="' + (Recog.supported() ? 'Spacja = mów · albo pisz tutaj (polskie słowo też można)' : 'Pisz po angielsku (polskie słowo też można)') + '" value="' + esc(draft) + '"' + (X.busy ? ' disabled' : '') + '>') + '</div>' +
      '<button class="btn primary" id="tkSend"' + (X.busy || X.listening ? ' disabled' : '') + '>Wyślij ' + K('Enter') + '</button></section>' +
      '<div class="row center talk-tools"><button class="btn small" id="tkHint"' + (X.busy || !X.msgs.length ? ' disabled' : '') + '>Podpowiedź ' + K('Alt+P') + '</button>' +
      '<button class="btn small" id="tkSlow">Powtórz wolniej ' + K('Alt+S') + '</button>' +
      '<button class="btn small" id="tkTr"' + (X.trBusy ? ' disabled' : '') + '>Co powiedział? ' + K('Alt+T') + '</button></div>' +
      '</div>';
    const ch = $('#tkChat'); if (ch) ch.scrollTop = ch.scrollHeight;
    const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    on('#tkEnd', endTalk);
    on('#tkMic', talkMic);
    on('#tkSend', () => talkSend($('#tkIn') ? $('#tkIn').value : ''));
    on('#tkHint', talkHintGet);
    on('#tkSlow', talkRepeatSlow);
    on('#tkTr', talkTranslateLast);
    on('#tkRetry', () => { X.err = ''; talkAiTurn(); });
    $$('[data-say]').forEach(b => b.onclick = () => Speech.speakOne(X.msgs[+b.dataset.say].text, talkRate(false)));
    $$('[data-hint]').forEach(b => b.onclick = () => { X.draft = X.hints[+b.dataset.hint].en; renderTalkChat(); const el = $('#tkIn'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } });
    const inp = $('#tkIn');
    if (inp) {
      inp.oninput = () => { X.draft = inp.value; };
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); talkSend(inp.value); } };
      if (X.draft) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); if (typingInField() && document.activeElement.value) { document.activeElement.blur(); return; } if (X.listening) { Recog.stop(); return; } endTalk(); return; }
      if (altKey(e, 'KeyP')) { e.preventDefault(); talkHintGet(); return; }
      if (altKey(e, 'KeyS')) { e.preventDefault(); talkRepeatSlow(); return; }
      if (altKey(e, 'KeyT')) { e.preventDefault(); talkTranslateLast(); return; }
      if ((e.code === 'Space' && !typingInField()) || altKey(e, 'KeyM')) { if (Recog.supported()) { e.preventDefault(); talkMic(); } return; }
      if (!typingInField() && !e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1 && inp) inp.focus();
    };
  }
  async function endTalk() {
    const X = TK; if (!X) return;
    stopTalkAudio();
    const me = X.msgs.filter(m => m.role === 'me');
    if (!me.length) { TK = { phase: 'pick', lvl: X.lvl }; renderTalk(); return; }
    X.phase = 'sumload'; X.sum = null; X.sumErr = '';
    renderTalkSummary();
    try { X.sum = await AI.talkSummary(X.scene, L[X.lvl], X.msgs); X.sum._m = AI.lastModel(); }
    catch (e) { X.sumErr = AI.humanError(e); }
    if (TK !== X) return;
    finishTalkStats(X);
    X.phase = 'summary';
    if (screen === 'talk') renderTalkSummary();
  }
  function finishTalkStats(X) {
    if (X.saved) return;
    X.saved = true;
    const me = X.msgs.filter(m => m.role === 'me');
    const avg = Math.round(me.reduce((a, m) => a + wordsCount(m.text), 0) / me.length * 10) / 10;
    const goal = X.goalDone || !!(X.sum && X.sum.goalDone);
    const t = Store.today();
    const xp = Math.min(100, me.length * 5) + (goal ? 20 : 0);
    D().xp += xp; t.xp += xp;
    t.sk = t.sk || {}; const ska = t.sk.speaking || (t.sk.speaking = [0, 0]);
    me.forEach(m => { const ok = m.ok !== false; pushHist('speaking', ok); ska[1]++; if (ok) ska[0]++; t.total++; if (ok) t.correct++; });
    D().convos = D().convos || [];
    D().convos.push({ at: Date.now(), id: X.scene.id, title: X.scene.title, lvl: X.lvl, turns: me.length, avgWords: avg, hints: X.hintsUsed, goal, score: X.sum ? X.sum.score : null, msgs: X.msgs.map(m => ({ r: m.role, t: m.text })) });
    if (D().convos.length > 100) D().convos.splice(0, D().convos.length - 100);
    D().convos.forEach((c, i, a) => { if (i < a.length - 20) delete c.msgs; });
    D().typesPlayed = D().typesPlayed || {}; D().typesPlayed.talk = 1;
    X.xp = xp; X.avg = avg; X.goalFinal = goal;
    const lv = levels(), h = hist().speaking || [];
    if (promoteReady('speaking')) { lv.speaking++; hist().speaking = []; X.promo = 'Mówienie: poziom ' + L[lv.speaking] + '.'; recordLevels('promo'); }
    progress();
    X.newBadges = checkBadges();
    Store.save(); syncAfterSession();
    Sound.play(goal ? 'combo' : 'block');
  }
  function renderTalkSummary() {
    const X = TK;
    if (X.phase === 'sumload') {
      app.innerHTML = '<div class="wrap narrow"><main class="ex-card raised"><div class="tag inset">ROZMOWA</div><div class="checking"><span class="spinner"></span>AI przygotowuje podsumowanie rozmowy…</div></main></div>';
      keyHandler = null; return;
    }
    const Sm = X.sum, me = X.msgs.filter(m => m.role === 'me');
    const added = X.added = X.added || {};
    app.innerHTML =
      '<div class="wrap narrow">' +
      '<header style="text-align:center"><h1 style="font-size:38px">Rozmowa zakończona</h1>' +
      '<p class="muted" style="font-size:18px;margin:6px 0 0">' + esc(X.scene.title) + ' · ' + (X.goalFinal ? '<b class="ok-ink">cel osiągnięty ✓</b>' : 'cel nieosiągnięty') + ' · +' + X.xp + ' XP' + (X.promo ? '<br><b class="pink">' + esc(X.promo) + '</b>' : '') + '</p></header>' +
      '<section class="kpis talk-kpis">' +
      '<div class="kpi raised"><div class="small-note" style="font-size:15px">Zrozumiałość</div><span class="kpi-val">' + (Sm ? Sm.score + '%' : '—') + '</span><div class="bar thin inset"><div style="width:' + (Sm ? Sm.score : 0) + '%;background:#789E66"></div></div></div>' +
      '<div class="kpi raised"><div class="small-note" style="font-size:15px">Twoje wypowiedzi</div><span class="kpi-val">' + me.length + '</span><div class="small-note">niezrozumiane: ' + me.filter(m => m.ok === false).length + '</div></div>' +
      '<div class="kpi raised"><div class="small-note" style="font-size:15px">Średnio słów</div><span class="kpi-val">' + String(X.avg).replace('.', ',') + '</span><div class="small-note">na jedną wypowiedź</div></div>' +
      '<div class="kpi raised"><div class="small-note" style="font-size:15px">Podpowiedzi</div><span class="kpi-val">' + X.hintsUsed + '</span><div class="small-note">im mniej, tym samodzielniej</div></div></section>' +
      (X.sumErr ? '<section class="note raised"><div class="ic inset">' + IC.alert + '</div><div class="tx"><b>Nie udało się przygotować podsumowania</b><span>' + esc(X.sumErr) + '</span></div><button class="btn" id="tkSumRetry">Spróbuj ponownie</button></section>' : '') +
      (Sm ? '<section class="set-card raised"><h2>Ocena ' + aiTag(Sm._m) + '</h2><p style="margin:0;font-size:17px;line-height:1.55">' + qaFmt(Sm.summary) + '</p></section>' +
        '<section class="set-card raised"><h2>Poprawki</h2>' + (Sm.corrections.length ? '<div class="col" style="gap:12px">' + Sm.corrections.map(c => '<div class="list-item inset corr"><div style="min-width:0"><div class="small-note">Powiedziałeś: <s>' + esc(c.you) + '</s></div><div lang="en"><b>' + esc(c.better) + '</b></div><div class="small-note">' + esc(c.why) + '</div></div><button class="btn small" data-csay="' + esc(c.better) + '" aria-label="Odsłuchaj">' + IC.speaker + '</button></div>').join('') + '</div>' : '<p class="small-note" style="margin:0">Bez istotnych błędów — świetnie!</p>') + '</section>' +
        '<section class="set-card raised"><div class="row between"><h2>Zwroty do nauki</h2>' + (Sm.phrases.length ? '<button class="btn small" id="tkAddAll">Dodaj wszystkie ' + K('D') + '</button>' : '') + '</div><div class="col" style="gap:10px">' +
        Sm.phrases.map((p, i) => '<div class="list-item inset"><div style="min-width:0"><span class="w" style="font-size:18px" lang="en">' + esc(p.phrase) + '</span><span class="p"> — ' + esc(p.pl) + '</span><div class="small-note" lang="en">' + esc(p.sentence) + '</div></div>' +
          '<button class="btn small' + (added[i] ? ' done-state' : '') + '" data-padd="' + i + '"' + (added[i] ? ' disabled' : '') + '>' + (added[i] ? '✓ ' + esc(added[i]) : 'Dodaj do nauki') + '</button></div>').join('') + '</div></section>' : '') +
      '<details class="set-card raised transcript"><summary><b>Zapis rozmowy</b></summary><div class="chat flat">' + X.msgs.map(m => '<div class="bub ' + (m.role === 'ai' ? 'ai' : 'me') + '"><div class="bt" lang="en">' + esc(m.text) + '</div></div>').join('') + '</div></details>' +
      '<div class="row center" style="gap:16px">' + (X.scene.topicId && TPX ? '<button class="btn big primary" id="tkTopic">Wróć do tematu ' + K('T') + '</button>' : '') + '<button class="btn big" id="tkHome">Wróć ' + K('Esc') + '</button><button class="btn big" id="tkAgain">Ta sama scenka ' + K('R') + '</button><button class="btn big primary" id="tkNew">Nowa rozmowa ' + K('Enter') + '</button></div></div>';
    const addOne = i => {
      const p = Sm.phrases[i]; if (!p || added[i]) return false;
      const err = addCustom(p.phrase, p.pl, p.sentence, { extra: { fromTalk: true } });
      added[i] = err ? (/już jest w bazie/.test(err) ? 'jest w bazie' : 'nie dodano') : 'dodano';
      return !err;
    };
    $$('[data-padd]').forEach(b => b.onclick = () => { const ok = addOne(+b.dataset.padd); renderTalkSummary(); if (ok) toast('Dodano do nauki.'); });
    $$('[data-csay]').forEach(b => b.onclick = () => Speech.speakOne(b.dataset.csay, talkRate(false)));
    if ($('#tkAddAll')) $('#tkAddAll').onclick = () => { let n = 0; Sm.phrases.forEach((_, i) => { if (addOne(i)) n++; }); renderTalkSummary(); toast(n ? 'Dodano ' + n + ' zwrotów do nauki.' : 'Nic nowego do dodania.'); };
    if ($('#tkSumRetry')) $('#tkSumRetry').onclick = async () => {
      X.phase = 'sumload'; renderTalkSummary();
      try { X.sum = await AI.talkSummary(X.scene, L[X.lvl], X.msgs); X.sum._m = AI.lastModel(); X.sumErr = ''; const rec = (D().convos || []).slice(-1)[0]; if (rec) { rec.score = X.sum.score; rec.goal = rec.goal || X.sum.goalDone; Store.save(); } }
      catch (e) { X.sumErr = AI.humanError(e); }
      X.phase = 'summary'; if (screen === 'talk') renderTalkSummary();
    };
    $('#tkHome').onclick = () => { TK = null; go('home'); };
    $('#tkNew').onclick = () => { TK = { phase: 'pick', lvl: X.lvl }; renderTalk(); };
    if ($('#tkTopic')) $('#tkTopic').onclick = () => { TK = null; go('topic'); };
    $('#tkAgain').onclick = () => { TK = { phase: 'pick', lvl: X.lvl }; const base = TALK_SCENES.find(s2 => s2.id === X.scene.id); if (base && base.id !== 'free') startTalk(base); else startTalk(TALK_SCENES[TALK_SCENES.length - 1], X.scene.title.replace(/^Temat: /, '')); };
    keyHandler = e => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') { e.preventDefault(); $('#tkHome').click(); return; }
      if (e.key === 'Enter' && !onButton()) { e.preventDefault(); $('#tkNew').click(); return; }
      if (e.code === 'KeyR') { e.preventDefault(); $('#tkAgain').click(); return; }
      if (e.code === 'KeyT' && $('#tkTopic')) { e.preventDefault(); $('#tkTopic').click(); return; }
      if (e.code === 'KeyD' && $('#tkAddAll')) { e.preventDefault(); $('#tkAddAll').click(); }
    };
  }


  /* ================= WYJAŚNIJ DOKŁADNIEJ ================= */
  const EX_BUSY = {}, EX_ERR = {};
  function mistakeCtx(it, fb) {
    fb = fb || {};
    const full = fullSentence(it);
    const ans = fb.ans || fb.heard || fb.picked || '';
    const c = { task: '', sentence: full, correct: full, answer: ans, pl: '', note: fb.expl || '', ok: fb.kind === 'ok' };
    if (it.type === 'tense_c' && S && S.tnOpts) c.options = S.tnOpts.slice();
    else if (it.type === 'choice' && S && S.chOpts) c.options = S.chOpts.slice();
    else if (it.type === 'particle' && S && S.pvOpts) c.options = S.pvOpts.map(o => pvSplit(it.w).verb + ' ' + o);
    if (it.ts) {
      const T = TS_BY[it.ts.tid];
      c.pl = it.ts.pl; c.note = (c.note ? c.note + ' ' : '') + 'Czas: ' + T.name + ' — ' + it.ts.why;
      if (it.type === 'tense_t') { c.task = 'Przetłumacz z polskiego na angielski (ćwiczenie na czasy): "' + it.ts.pl + '"'; if (fb.better) c.note += ' Poprawiona wersja Artura: ' + fb.better; }
      else { c.task = (it.type === 'tense_c' ? 'Wybierz' : 'Wpisz') + ' formę czasownika (' + it.ts.base + ') w zdaniu: "' + it.ts.before + '_____' + it.ts.after + '"'; c.correct = it.ts.correct[0]; }
    } else if (it.type === 'cloze' || it.type === 'choice') { c.task = (it.type === 'choice' ? 'Wybierz z 4 słów' : 'Wpisz') + ' brakujące słowo w zdaniu: "' + it.w.s.replace('_', '_____') + '"'; c.correct = it.w.answers[0]; c.pl = it.w.pl; }
    else if (it.type === 'order') { c.task = ORDER_TASK; }
    else if (it.type === 'error') { c.task = 'Znajdź i popraw błąd w zdaniu: "' + errSentence(it) + '"'; c.correct = it.g.correct; c.note = (c.note ? c.note + ' ' : '') + (it.g.expl || ''); if (fb.m === 'wrongplace' && fb.picked) c.answer = 'wskazał błąd w złym miejscu: „' + fb.picked + '”'; }
    else if (it.type === 'dictation') { c.task = 'Dyktando: zapisz zdanie, które usłyszałeś'; }
    else if (it.type === 'speak') { c.task = 'Powiedz na głos całe zdanie ze słowem „' + it.w.answers[0] + '” (' + it.w.pl + ')'; c.correct = full; }
    else if (it.type === 'translate') { c.task = 'Przetłumacz z polskiego na angielski: "' + it.pl + '"'; c.pl = it.pl; if (fb.better) c.note += ' Poprawiona wersja Artura: ' + fb.better; }
    else if (it.type === 'particle' || it.type === 'pvwrite') { const sp = pvSplit(it.w); c.task = 'Dobierz partykułę do czasownika „' + sp.verb + '” (phrasal verb) w zdaniu: "' + it.w.s.replace('_', sp.verb + ' _____') + '"'; c.correct = it.w.answers[0]; c.pl = it.w.pl; c.answer = ans ? sp.verb + ' ' + ans : ''; }
    return c;
  }
  function explainKey(id, ans) { return id + '|' + U.norm(ans || ''); }
  /* „Wyjaśnij” po każdej odpowiedzi — także dobrej (np. gdy się wahałeś) */
  function explainEligible(fb) { return AI.enabled() && !!fb; }
  function explainLabel(fb) { return fb && fb.kind === 'ok' && fb.m !== 'ai-ok' ? 'Dlaczego tak? Zapytaj AI ' : 'Wyjaśnij dokładniej '; }
  function curExplainKey(it) { const fb = S.fb || {}; return explainKey(it.id, mistakeCtx(it, fb).answer); }
  function trimExplains() {
    const ex = D().explains = D().explains || {}, ks = Object.keys(ex);
    if (ks.length > 150) ks.sort((a, b) => ex[a].at - ex[b].at).slice(0, ks.length - 150).forEach(k => delete ex[k]);
  }
  async function openExplain(it) {
    if (!S || S.phase !== 'feedback' || !explainEligible(S.fb)) return;
    S.exOpen = true;
    const key = curExplainKey(it), ex = D().explains = D().explains || {};
    renderExplainPanel(it);
    const el = document.getElementById('explain'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (ex[key] && ex[key].data) return;
    if (EX_BUSY[key]) return;
    EX_BUSY[key] = true; EX_ERR[key] = ''; renderExplainPanel(it);
    const ctx = mistakeCtx(it, S.fb);
    try {
      const data = await AI.explainMistake(ctx, L[levels().vocab]);
      data._m = AI.lastModel();
      ex[key] = Object.assign(ex[key] || { chat: [] }, { at: Date.now(), title: (ctx.answer ? ctx.answer + ' → ' : '') + ctx.correct, type: TYPES[it.type].title, ctx, data });
      trimExplains(); Store.save();
    } catch (e) { EX_ERR[key] = AI.humanError(e); }
    EX_BUSY[key] = false;
    if (S && cur() && cur().id === it.id && S.phase === 'feedback') renderExplainPanel(it);
  }
  async function askExplain(it, q) {
    q = String(q || '').trim(); if (!q) return;
    const key = curExplainKey(it), ex = D().explains;
    const rec = ex[key]; if (!rec) return;
    if (EX_BUSY[key + '#q']) return;
    rec.pending = q; EX_BUSY[key + '#q'] = true; EX_ERR[key + '#q'] = '';
    renderExplainPanel(it);
    try {
      const a = await AI.discussMistake(rec.ctx, L[levels().vocab], rec.data, rec.chat, q);
      rec.chat.push({ q, a, at: Date.now(), m: AI.lastModel() }); rec.at = Date.now();
      if (rec.chat.length > 20) rec.chat.splice(0, rec.chat.length - 20);
      Store.save();
    } catch (e) { EX_ERR[key + '#q'] = AI.humanError(e); }
    rec.pending = ''; EX_BUSY[key + '#q'] = false;
    if (S && cur() && cur().id === it.id && S.phase === 'feedback') { renderExplainPanel(it); const last = document.querySelector('#explain .qa-item:last-child'); if (last) last.scrollIntoView({ block: 'start', behavior: 'smooth' }); const inp = document.getElementById('exQ'); if (inp) inp.focus({ preventScroll: true }); }
  }
  function explainBodyHtml(rec, opts) {
    const d = rec.data;
    const say = t => opts && opts.say ? '<button class="btn small exsay" data-exsay="' + esc(t) + '" aria-label="Odsłuchaj">' + IC.speaker + '</button>' : '';
    return '<div class="ex-sec"><h3>Dlaczego tak</h3><p>' + qaFmt(d.why) + '</p></div>' +
      (d.examples.length ? '<div class="ex-sec"><h3>Przykłady w kontekście</h3>' + d.examples.map(x => '<div class="ex-row">' + say(x.en) + '<div><div lang="en">' + esc(x.en) + '</div><div class="small-note">' + esc(x.pl) + '</div></div></div>').join('') + '</div>' : '') +
      (d.simpler.length ? '<div class="ex-sec"><h3>Prościej / inaczej</h3>' + d.simpler.map(x => '<div class="ex-row">' + say(x.en) + '<div><div lang="en">' + esc(x.en) + '</div><div class="small-note">' + esc(x.pl) + '</div></div></div>').join('') + '</div>' : '') +
      (d.watch ? '<div class="ex-sec watch"><h3>Uważaj</h3><p>' + qaFmt(d.watch) + '</p></div>' : '') +
      ((rec.chat || []).length ? '<div class="qa">' + rec.chat.map(m => '<div class="qa-item"><div class="q">' + esc(m.q) + '</div><div class="a">' + qaFmt(m.a) + (m.m ? ' <span class="small-note">' + mdlTag(m.m) + '</span>' : '') + '</div></div>').join('') + '</div>' : '');
  }
  function renderExplainPanel(it) {
    const el = document.getElementById('explain'); if (!el) return;
    if (!S || !S.exOpen) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    const key = curExplainKey(it), rec = (D().explains || {})[key];
    const draft = (document.getElementById('exQ') || {}).value || '';
    if (EX_BUSY[key] && !(rec && rec.data)) { el.innerHTML = '<div class="checking"><span class="spinner"></span>AI przygotowuje dokładne wyjaśnienie…</div>'; return; }
    if (!rec || !rec.data) { el.innerHTML = '<div class="status bad">' + esc(EX_ERR[key] || 'Brak wyjaśnienia.') + '</div><button class="btn small" id="exRetry">Spróbuj ponownie</button>'; const r = document.getElementById('exRetry'); if (r) r.onclick = () => openExplain(it); return; }
    el.innerHTML = '<div class="row between"><b class="ex-title">' + aiTag(rec.data._m) + 'Dokładniej</b><button class="btn small" id="exClose" aria-label="Zwiń">Zwiń ' + K('E') + '</button></div>' +
      (rec.data.keyProblem ? '<div class="fb bad" role="status">' + IC.alert + '<span><b>Uwaga — samo ćwiczenie wygląda na błędne.</b> ' + esc(rec.data.keyProblem) + ' <button class="btn small" id="exRep">Popraw zdanie ' + K('X') + '</button></span></div>' : '') +
      explainBodyHtml(rec, { say: true }) +
      (rec.pending ? '<div class="qa"><div class="qa-item"><div class="q">' + esc(rec.pending) + '</div></div></div><div class="checking"><span class="spinner"></span>AI odpowiada…</div>' : '') +
      (EX_ERR[key + '#q'] ? '<div class="status bad">' + esc(EX_ERR[key + '#q']) + '</div>' : '') +
      '<div class="ans-row ex-ask"><input id="exQ" class="txt" autocomplete="off" placeholder="Dopytaj albo napisz, co masz na myśli — np. „a czy mogę powiedzieć…?”" value="' + esc(draft) + '"' + (rec.pending ? ' disabled' : '') + '><button class="btn small primary" id="exSend"' + (rec.pending ? ' disabled' : '') + '>Zapytaj</button></div>' +
      '<div class="small-note">' + K('Enter') + ' w polu wysyła pytanie · ' + K('Esc') + ' wychodzi z pola · rozmowa zapisuje się w Dzienniku błędów</div>' +
      (AI.enabled() && !it.topic && !S.topicId ? '<button class="btn small ex-topic" id="exTopic">Rozszerz temat → przykłady, ćwiczenia, rozmowa ' + K('R') + '</button>' : '');
    if (document.getElementById('exTopic')) document.getElementById('exTopic').onclick = () => openTopic(it);
    el.querySelectorAll('[data-exsay]').forEach(b => b.onclick = () => Speech.speak(b.dataset.exsay));
    document.getElementById('exClose').onclick = () => { S.exOpen = false; renderExplainPanel(it); };
    if (document.getElementById('exRep')) document.getElementById('exRep').onclick = () => reportOpen(it);
    const q = document.getElementById('exQ');
    const send = () => { const v = q.value; q.value = ''; askExplain(it, v); };
    document.getElementById('exSend').onclick = send;
    q.onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); send(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); q.blur(); }
      else e.stopPropagation();
    };
  }
  function explainList() {
    const seen = {};
    return Object.values(D().explains || {}).filter(r => r.data).sort((a, b) => b.at - a.at).filter(r => { const k = r.title + '|' + ((r.ctx && r.ctx.sentence) || ''); if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 30);
  }
  function explainsHtml() {
    const list = explainList();
    if (!list.length) return '';
    return '<section class="list-card raised"><h2 style="font-size:22px">Zapisane wyjaśnienia</h2><p class="small-note" style="margin:0">Kliknij, żeby rozwinąć. Nowe powstają przyciskiem „Wyjaśnij dokładniej” po błędzie.</p>' +
      list.map(r => '<details class="exsaved inset"><summary><b>' + esc(r.title) + '</b> <span class="small-note">· ' + esc(r.type || '') + ' · ' + new Date(r.at).toLocaleDateString('pl-PL') + ((r.chat || []).length ? ' · ' + r.chat.length + ' pyt.' : '') + '</span></summary>' +
        (r.ctx && r.ctx.sentence ? '<div class="small-note" lang="en" style="margin:6px 0">' + esc(r.ctx.sentence) + '</div>' : '') + explainBodyHtml(r, {}) + '</details>').join('') + '</section>';
  }


  /* ================= TRUDNOŚĆ ZDAŃ (adaptacyjna) ================= */
  const SENT_TYPES = { order: 1, dictation: 1, speak: 1, translate: 1, particle: 1, pvwrite: 1, error: 1, tense_c: 1, tense_w: 1, tense_t: 1 };
  const SIMPLIFY_TYPES = { order: 1, dictation: 1, speak: 1, translate: 1, particle: 1, pvwrite: 1, tense_c: 1, tense_w: 1, tense_t: 1 };
  let WORD_LVL = null;
  const DIFF_CACHE = {};
  function wordLevelMap() {
    if (WORD_LVL) return WORD_LVL;
    WORD_LVL = {};
    WORDS.list.forEach(w => w.answers.forEach(a => { const k = a.toLowerCase(); if (k.indexOf(' ') < 0 && (WORD_LVL[k] == null || w.lvl < WORD_LVL[k])) WORD_LVL[k] = w.lvl; }));
    return WORD_LVL;
  }
  const FUNC_WORDS = new Set('a an the and or but so to of in on at for with from by as is are was were be been being am do does did have has had i you he she it we they me him her us them my your his its our their this that these those there here not no yes can could will would shall should may might must if when while than then very too also just only all some any much many more most what who which where why how up down out off over into about after before'.split(' '));
  function sentDifficulty(text) {
    text = String(text || '');
    if (DIFF_CACHE[text]) return DIFF_CACHE[text];
    const toks = (text.match(/[A-Za-z']+/g) || []).map(t => t.toLowerCase());
    const n = toks.length;
    const lenS = n <= 6 ? 1 : n <= 9 ? 2 : n <= 13 ? 3 : n <= 18 ? 4 : 5;
    const map = wordLevelMap();
    const lv = [];
    toks.forEach(t => {
      if (FUNC_WORDS.has(t)) return;
      const base = t.replace(/'s$/, '');
      let v = map[base];
      if (v == null) for (const suf of ['s', 'es', 'ed', 'd', 'ing', 'ly', 'er', 'est']) { if (base.endsWith(suf) && map[base.slice(0, -suf.length)] != null) { v = map[base.slice(0, -suf.length)]; break; } }
      if (v == null && base.length >= 9) v = 3;
      if (v != null) lv.push(v);
    });
    lv.sort((a, b) => a - b);
    const vocS = lv.length ? lv[Math.min(lv.length - 1, Math.floor(lv.length * 0.8))] + 1 : 1;
    const markers = (text.match(/\b(which|who|whom|whose|although|though|whereas|unless|whether|because|since|until|despite|however|therefore)\b/gi) || []).length + (text.match(/,/g) || []).length * 0.5;
    const adv = (text.match(/\b(had been|has been|have been|will have|would have|could have|should have|might have|being)\b/gi) || []).length;
    const d = Math.max(1, Math.min(5, Math.round((lenS + vocS) / 2 + Math.min(1.5, markers * 0.5 + adv * 0.5))));
    DIFF_CACHE[text] = d;
    return d;
  }
  function itemDiff(it) { return it && SENT_TYPES[it.type] ? sentDifficulty(fullSentence(it)) : 0; }
  function sentLevel() {
    if (!D().sentLvl) { D().sentLvl = Math.max(1, Math.min(5, overallLevel())); D().sentLvlHist = [{ at: Date.now(), lvl: D().sentLvl }]; }
    return D().sentLvl;
  }
  /* kolejność nowych zdań: najpierw na poziomie, potem trochę łatwiejsze, potem o stopień trudniejsze; trudniejsze czekają */
  function sortByDiff(ids, strict) {
    const L2 = sentLevel();
    const scored = ids.map((id, i) => { const d = itemDiff(itemFor(id)); return { id, i, d, k: !d ? 0 : d <= L2 ? (L2 - d) * 0.6 : (d - L2) * 1.5 }; });
    const ok = strict ? scored.filter(x => !x.d || x.d <= L2 + 1) : scored;
    return ok.sort((a, b) => a.k - b.k || a.i - b.i).map(x => x.id);
  }
  function diffLabel(d) { return d <= 2 ? 'ŁATWE' : d === 3 ? 'ŚREDNIE' : 'TRUDNE'; }
  function pushSentHist(ok) {
    const h = D().sentHist = D().sentHist || [];
    h.push(ok ? 1 : 0); if (h.length > 40) h.splice(0, h.length - 40);
    const L2 = sentLevel(), acc = k => h.slice(-k).reduce((a, b) => a + b, 0) / k;
    let msg = '';
    if (h.length >= 20 && acc(20) >= 0.85 && L2 < 5) { D().sentLvl = L2 + 1; msg = 'Dobrze Ci idzie — poziom zdań ' + (L2 + 1) + '/5: będą trochę dłuższe i bardziej złożone.'; }
    else if (h.length >= 15 && acc(15) <= 0.55 && L2 > 1) { D().sentLvl = L2 - 1; msg = 'Zdania były za trudne — poziom zdań ' + (L2 - 1) + '/5: przez chwilę dostaniesz prostsze.'; }
    if (msg) { D().sentHist = []; (D().sentLvlHist = D().sentLvlHist || []).push({ at: Date.now(), lvl: D().sentLvl }); if (D().sentLvlHist.length > 200) D().sentLvlHist.splice(0, 50); setTimeout(() => toast(msg), 900); }
  }
  function sentLevelHtml() {
    const L2 = sentLevel(), h = D().sentLvlHist || [], hist2 = D().sentHist || [];
    const acc = hist2.length ? Math.round(hist2.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, hist2.length) * 100) : null;
    let spark = '';
    if (h.length >= 2) {
      const t0 = h[0].at, t1 = Math.max(Date.now(), t0 + U.DAY), W = 260, H = 50, x = t => 4 + (t - t0) / (t1 - t0) * (W - 8), y = v => H - 4 - (v - 1) / 4 * (H - 8);
      let d = 'M' + x(h[0].at).toFixed(1) + ' ' + y(h[0].lvl).toFixed(1);
      h.slice(1).forEach(e => { d += ' H' + x(e.at).toFixed(1) + ' V' + y(e.lvl).toFixed(1); });
      d += ' H' + x(t1).toFixed(1);
      spark = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="spark" role="img" aria-label="Poziom zdań w czasie"><path d="' + d + '" fill="none" stroke="#789E66" stroke-width="2.5"/></svg>';
    }
    return '<div class="sentlvl inset"><div><b>Poziom zdań: ' + L2 + '/5</b><div class="small-note">dobierany do tego, jak Ci idzie' + (acc != null ? ' · ostatnio ' + acc + '% dobrze' : '') + ' (≥85% → trudniejsze, ≤55% → prostsze)</div></div>' + spark + '</div>';
  }
  /* ================= ROZSZERZ TEMAT: omówienie + ćwiczenia poboczne + rozmowa ================= */
  let TPX = null; // { tid, ret: przerwana sesja, busy, err }
  function topicItem(rest) {
    const j = rest.lastIndexOf(':'), T = (D().topics || {})[rest.slice(0, j)], x = T && T.items[+rest.slice(j + 1)];
    if (!x) return null;
    const base = { id: 'tp:' + rest, lvl: levels().vocab, topic: T.id, fromText: T.title };
    if (x.kind === 'cloze') {
      const k = x.en.toLowerCase().indexOf(x.answer.toLowerCase());
      if (k < 0) return null;
      return Object.assign(base, { type: 'cloze', w: { answers: [x.en.substr(k, x.answer.length)], pl: x.answer_pl || '', s: x.en.slice(0, k) + '_' + x.en.slice(k + x.answer.length) } });
    }
    return Object.assign(base, { type: x.kind === 'translate' ? 'translate' : x.kind === 'dictation' ? 'dictation' : 'order', w: { answers: [''], pl: '', s: '_' + x.en }, pl: x.kind === 'translate' ? x.pl : null });
  }
  function topicIdFor(id) { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0; return 't' + (h >>> 0).toString(36); }
  /* R → najpierw wybór, czego ma dotyczyć temat: słowo z ćwiczenia, gramatyka zdania albo własny temat */
  function openTopic(it) {
    if (!S || !AI.enabled()) return;
    const c = cur(), ctx = mistakeCtx(it, S.fb);
    if (S.listening) Recog.stop();
    S.paused = true;
    const word = it.w && it.w.answers && it.w.answers[0] && !it.fromText ? it.w.answers[0] : (it.ts ? it.ts.correct[0] : '');
    TPX = { tid: null, base: c.id, ret: S, busy: false, err: '', ctx, word, wordPl: it.w ? it.w.pl : '' };
    D().topics = D().topics || {};
    go('topic');
  }
  function pickTopicFocus(kind, text) {
    const X = TPX; if (!X) return;
    let focus, key;
    if (kind === 'w') { key = 'w'; focus = 'Temat: słowo/zwrot „' + X.word + '”' + (X.wordPl ? ' (' + X.wordPl + ')' : '') + ' — znaczenie, użycie, z czym się łączy.'; }
    else if (kind === 'g') { key = 'g'; focus = 'Temat: GRAMATYKA zdania z ćwiczenia — użyty czas (albo czasy) i najważniejsza konstrukcja (np. be + przymiotnik + to + czasownik). Wyjaśnij na przykładzie tego zdania: dlaczego taki czas i taka forma. W title podaj nazwę czasu i konstrukcji.'; }
    else { text = String(text || '').trim(); if (!text) return; key = 'c:' + text.toLowerCase(); focus = 'Temat wskazany przez Artura: „' + text + '”. Odnieś go do zdania z ćwiczenia.'; }
    X.tid = topicIdFor(X.base + '|' + key); X.focus = focus;
    if (D().topics[X.tid]) return renderTopic();
    loadTopic(X.tid, X.ctx);
  }
  async function loadTopic(tid, ctx) {
    const X = TPX; if (!X) return;
    X.busy = true; X.err = ''; if (screen === 'topic') renderTopic();
    try {
      const r = await AI.topicPack(ctx, L[levels().vocab], X.focus);
      const mUsed = AI.lastModel();
      // kontrola jakości zdań (jak przy słówkach od AI)
      let items = r.items.map(x => ({ word: x.answer, sentence: x.en, pl: x.answer_pl, x }));
      try { const qc = await qcWordItems(items); items = qc.items; } catch (e) { }
      const T = { id: tid, m: mUsed, title: r.title, at: Date.now(), about: r.about, contrast: r.contrast, examples: r.examples, pitfalls: r.pitfalls,
        items: items.map(q => Object.assign({}, q.x, { en: q.sentence })), talkRole: r.talkRole, talkGoal: r.talkGoal, src: ctx.sentence };
      D().topics[tid] = T;
      const ks = Object.keys(D().topics); if (ks.length > 40) ks.sort((a, b) => D().topics[a].at - D().topics[b].at).slice(0, ks.length - 40).forEach(k => delete D().topics[k]);
      Store.save();
    } catch (e) { X.err = AI.humanError(e); }
    X.busy = false;
    if (TPX === X && screen === 'topic') renderTopic();
  }
  function topicBack() {
    const X = TPX; TPX = null;
    if (X && X.ret) { S = X.ret; S.paused = false; return go('exercise'); }
    go('home');
  }
  function renderTopicPick() {
    screen = 'topic';
    const X = TPX, has = key => !!(D().topics || {})[topicIdFor(X.base + '|' + key)];
    const opt = (n, kind, title, sub, ok) => '<button class="btn game raised tp-opt" data-tpk="' + kind + '"><span class="num-key">' + n + '</span><b>' + title + '</b><small>' + sub + '</small>' + (ok ? '<small class="pink">✓ już przygotowany</small>' : '') + '</button>';
    app.innerHTML = '<div class="wrap narrow">' +
      '<header class="ex-head"><button class="btn" id="tpBack">' + IC.back + ' Wróć do ćwiczenia ' + K('Esc') + '</button><div class="ex-title"><b>Rozszerz temat</b><span>czego ma dotyczyć?</span></div><div style="width:150px"></div></header>' +
      '<p class="muted" style="text-align:center;margin:0;font-size:17px" lang="en">„' + esc(X.ctx.sentence || '') + '”</p>' +
      '<section class="games">' +
      (X.word ? opt(1, 'w', 'Słowo: ' + esc(X.word), X.wordPl ? esc(X.wordPl) + ' — znaczenie, użycie, połączenia' : 'znaczenie, użycie, połączenia', has('w')) : '') +
      opt(X.word ? 2 : 1, 'g', 'Gramatyka tego zdania', 'czas i konstrukcja — wyjaśnione na tym przykładzie', has('g')) +
      '</section>' +
      '<div class="field"><label for="tpOwn">Albo własny temat (' + K(X.word ? '3' : '2') + ')</label><div class="ctl"><input id="tpOwn" class="txt" autocomplete="off" placeholder="np. was vs were, to see czy seeing"><button class="btn primary" id="tpOwnGo">Rozszerz ' + K('Enter') + '</button></div></div>' +
      '</div>';
    $('#tpBack').onclick = topicBack;
    $$('[data-tpk]').forEach(b => b.onclick = () => pickTopicFocus(b.dataset.tpk));
    const own = () => { const v = $('#tpOwn').value.trim(); if (!v) { shake($('#tpOwn')); $('#tpOwn').focus(); return; } pickTopicFocus('c', v); };
    $('#tpOwnGo').onclick = own;
    $('#tpOwn').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); own(); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); $('#tpOwn').blur(); } else e.stopPropagation(); };
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); topicBack(); return; }
      const keys = X.word ? { 1: 'w', 2: 'g' } : { 1: 'g' };
      if (keys[e.key]) { e.preventDefault(); pickTopicFocus(keys[e.key]); return; }
      if (e.key === (X.word ? '3' : '2')) { e.preventDefault(); $('#tpOwn').focus(); }
    };
  }
  function startTopicExercises() {
    const T = TPX && (D().topics || {})[TPX.tid]; if (!T) return;
    const ids = T.items.map((x, k) => 'tp:' + T.id + ':' + k).filter(id => { const it = itemFor(id); return it && typeEnabled(it.type); });
    if (!ids.length) { toast('Brak ćwiczeń do tego tematu.'); return; }
    newSession({ play: 'mix', topicId: T.id, guideMax: ids.length * 2, custom: 'Temat: ' + T.title, queue: U.shuffle(ids).map(id => ({ id, isNew: false })) });
    go('exercise');
  }
  function startTopicTalk() {
    const T = TPX && (D().topics || {})[TPX.tid]; if (!T) return;
    TK = null;
    go('talk');
    startTalk({ id: 'topic', topicId: T.id, title: 'Temat: ' + T.title, role: T.talkRole || ('You are Alex, a friendly conversation partner. Talk with the learner so that they naturally use: ' + T.title + '. Ask questions that make them use it.'), goal: T.talkGoal || ('Użyj w rozmowie: ' + T.title + '.') });
  }
  function renderTopic() {
    screen = 'topic';
    const X = TPX; if (!X) return go('home');
    if (!X.tid) return renderTopicPick();
    const T = (D().topics || {})[X.tid];
    const head = '<header class="ex-head"><button class="btn" id="tpBack">' + IC.back + (X.ret ? ' Wróć do ćwiczenia ' : ' Wróć ') + K('Esc') + '</button>' +
      '<div class="ex-title"><b>Rozszerz temat</b><span>' + (T ? esc(T.title) + (T.m ? ' ' + aiTag(T.m) : '') : 'przygotowuję…') + '</span></div><div style="width:150px"></div></header>';
    let body;
    if (!T) {
      body = X.err
        ? '<section class="note raised"><div class="ic inset">' + IC.alert + '</div><div class="tx"><b>Nie udało się przygotować tematu</b><span>' + esc(X.err) + '</span></div><button class="btn primary" id="tpRetry">Spróbuj ponownie</button></section>'
        : '<section class="set-card raised"><div class="checking"><span class="spinner"></span>AI przygotowuje temat: omówienie, ćwiczenia i rozmowę… (ok. 20–40 s)</div></section>';
    } else {
      const r = T.res;
      body = '<section class="set-card panel raised tp-card"><h2 style="font-size:28px">' + esc(T.title) + '</h2>' +
        '<p class="tp-about">' + qaFmt(T.about) + '</p>' + (T.contrast ? '<p class="tp-about muted">' + qaFmt(T.contrast) + '</p>' : '') +
        '<h3 class="tm-sub">Przykłady</h3><div class="tp-ex">' + T.examples.map((x, k) => '<button class="btn small tp-say" data-tsay="' + k + '" aria-label="Odsłuchaj">' + IC.speaker + '</button><div><div lang="en"><b>' + esc(x.en) + '</b></div><div class="small-note">' + esc(x.pl) + '</div></div>').join('') + '</div>' +
        (T.pitfalls.length ? '<h3 class="tm-sub">Uważaj</h3><ul class="tp-pit">' + T.pitfalls.map(x => '<li>' + qaFmt(x) + '</li>').join('') + '</ul>' : '') + '</section>' +
        '<div class="row center" style="gap:16px;flex-wrap:wrap">' +
        '<button class="btn big primary" id="tpEx">Ćwiczenia (' + T.items.length + ') ' + K('Enter') + '</button>' +
        '<button class="btn big" id="tpTalk">' + IC.chat + ' Pogadaj o tym z AI ' + K('G') + '</button>' +
        (X.base ? '<button class="btn big" id="tpOther">Inny temat z tego zdania ' + K('I') + '</button>' : '') + '</div>' +
        (r ? '<p class="small-note" style="text-align:center;margin:0">Ostatnio ćwiczenia: ' + r.correct + '/' + r.total + ' dobrze · +' + r.xp + ' XP. Błędy wrócą w zwykłych powtórkach.</p>' : '<p class="small-note" style="text-align:center;margin:0">Ćwiczenia nie zmieniają planu powtórek — tylko to, w czym się pomylisz, wróci w najbliższej sesji.</p>');
    }
    app.innerHTML = '<div class="wrap narrow stats-flat">' + head + body + '</div>';
    $('#tpBack').onclick = topicBack;
    if ($('#tpRetry')) $('#tpRetry').onclick = () => loadTopic(X.tid, X.ctx);
    if ($('#tpEx')) $('#tpEx').onclick = startTopicExercises;
    if ($('#tpTalk')) $('#tpTalk').onclick = startTopicTalk;
    if ($('#tpOther')) $('#tpOther').onclick = () => { X.tid = null; renderTopic(); };
    $$('[data-tsay]').forEach(b => b.onclick = () => Speech.speak(T.examples[+b.dataset.tsay].en));
    keyHandler = e => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); topicBack(); return; }
      if (e.key === 'Enter' && !onButton() && $('#tpEx')) { e.preventDefault(); startTopicExercises(); return; }
      if (plainKey(e, 'KeyG') && $('#tpTalk')) { e.preventDefault(); startTopicTalk(); return; }
      if (plainKey(e, 'KeyI') && $('#tpOther')) { e.preventDefault(); $('#tpOther').click(); }
    };
  }

  /* ---------- Uprość zdanie ---------- */
  function simpleItem(rest) {
    const x = (D().simple || {})[rest]; if (!x) return null;
    return { type: x.type, id: 'simp:' + rest, w: { answers: [''], pl: '', s: '_' + x.s }, lvl: 0, fromText: 'uproszczona wersja', pl: x.type === 'translate' ? x.pl : null, simple: true, note: x.note };
  }
  function canSimplify(it, fb) { return AI.enabled() && it && SIMPLIFY_TYPES[it.type] && !it.simple && fb && (fb.kind === 'bad' || fb.kind === 'idk'); }
  async function simplifyCurrent(it) {
    if (!S || S.phase !== 'feedback' || S.simpBusy) return;
    const c = cur(), sess = S;
    S.simpBusy = true; S.simpErr = '';
    const b = $('#simpBtn'); if (b) { b.disabled = true; b.innerHTML = '<span class="spinner"></span> Upraszczam…'; }
    let keep = '', note = '';
    if (it.ts) { keep = it.ts.correct[0]; note = 'zachowaj czas ' + TS_BY[it.ts.tid].name; }
    else if (it.w && it.w.answers[0]) { keep = it.w.answers[0]; note = 'to ćwiczone słowo'; }
    try {
      const r = await AI.simplifySentence(fullSentence(it), keep, L[Math.max(0, sentLevel() - 2)], note);
      if (!r.sentence) throw new Error('AI nie zwróciło zdania.');
      const k = 's' + ((D().simpleN = (D().simpleN || 0) + 1));
      const type = it.type === 'translate' || it.type === 'tense_t' ? 'translate' : it.type === 'dictation' ? 'dictation' : 'order';
      D().simple = D().simple || {};
      D().simple[k] = { type, s: r.sentence, pl: r.pl, note: r.note, from: c.id, at: Date.now() };
      const ks = Object.keys(D().simple); if (ks.length > 60) ks.slice(0, ks.length - 60).forEach(x => delete D().simple[x]);
      if (type === 'translate') (D().plCache = D().plCache || {})['simp:' + k] = r.pl;
      Store.save();
      if (S !== sess) return;
      S.queue.splice(S.pos + 1, 0, { id: 'simp:' + k, isNew: false });
      S.simpBusy = false;
      toast('Następne będzie prostsze zdanie: „' + r.sentence + '”. Oryginał wróci później.');
      next();
    } catch (e) {
      if (S !== sess) return;
      S.simpBusy = false; S.simpErr = AI.humanError(e);
      const b2 = $('#simpBtn'); if (b2) { b2.disabled = false; b2.innerHTML = 'Uprość zdanie ' + K('Z'); }
      toast(S.simpErr);
    }
  }


  /* ================= DRABINKA TRUDNOŚCI ================= */
  /* stopnie dla każdego rodzaju ćwiczenia: -1 łatwiej, 0 normalnie, 1 trudniej */
  const STEPS = { cloze: [0, 1], order: [-1, 0, 1], dictation: [0, 1], speak: [0, 1], error: [0], particle: [1], tense_c: [1], tense_w: [0], tense_t: [0], translate: [0] };
  const STEP_DEFAULT = {};
  const STEP_NEEDS_AI = { order: 1, speak: 1 };
  function stepList(type) {
    let l = STEPS[type] || [0];
    if (STEP_NEEDS_AI[type] && !AI.enabled()) l = l.filter(x => x <= 0);
    return l;
  }
  function cardStep(id, type) {
    const l = stepList(type), c = D().cards[id];
    let v = c && c.st != null ? c.st : (STEP_DEFAULT[type] != null ? STEP_DEFAULT[type] : 0);
    if (l.indexOf(v) < 0) v = l.reduce((b, x) => Math.abs(x - v) < Math.abs(b - v) ? x : b, l[0]);
    return v;
  }
  /* widok ćwiczenia zależny od stopnia — ten sam element, inna forma */
  function viewItem(raw, c) {
    if (!raw || raw.simple || !STEPS[raw.type]) return raw;
    const st = cardStep(c.id, raw.type), v = Object.assign({}, raw, { baseType: raw.type, step: st });
    const pl = (D().plCache || {})[c.id];
    switch (raw.type) {
      case 'cloze': if (st > 0) { v.noPl = true; v.stepLabel = 'BEZ PODPOWIEDZI'; } break;
      case 'order': if (st < 0) { v.prefill = true; v.stepLabel = 'ŁATWIEJ'; } else if (st > 0) { v.type = 'translate'; v.pl = pl || null; v.fromOrder = true; v.stepLabel = 'NAPISZ SAM'; } break;
      case 'dictation': if (st < 0) { v.hintLetters = true; v.stepLabel = 'Z PODPOWIEDZIĄ'; } else if (st > 0) { v.fast = true; v.stepLabel = 'SZYBCIEJ · RAZ'; } break;
      case 'speak': if (st < 0) { v.readAloud = true; v.stepLabel = 'PRZECZYTAJ'; } else if (st > 0) { v.fromPl = true; v.pl = pl || null; v.stepLabel = 'Z PAMIĘCI'; } break;
      case 'error': if (st < 0) { v.premark = true; v.stepLabel = 'ŁATWIEJ'; } break;
      case 'particle': v.type = 'pvwrite'; break;
      case 'tense_c': v.type = 'tense_w'; break;
      case 'tense_w': if (st < 0) { v.type = 'tense_c'; v.stepLabel = 'ŁATWIEJ'; } break;
      case 'tense_t': if (st < 0) { v.type = 'tense_w'; v.stepLabel = 'ŁATWIEJ'; } break;
      case 'translate': if (st < 0) { v.type = 'order'; v.plPrompt = raw.pl; v.stepLabel = 'Z KAFELKÓW'; } break;
    }
    return v;
  }
  function curView(c) {
    if (S.view && S.viewId === c.id) return S.view;
    S.viewId = c.id; S.view = viewItem(itemFor(c.id), c);
    return S.view;
  }
  const STEP_WORDS = {
    cloze: { '-1': 'wybór z 4 słów', 0: 'wpisywanie słowa', 1: 'wpisywanie bez polskiej podpowiedzi' },
    order: { '-1': 'kafelki z częścią ułożoną', 0: 'kafelki', 1: 'piszesz całe zdanie z polskiego' },
    dictation: { '-1': 'dyktando z pierwszymi literami', 0: 'dyktando', 1: 'dyktando szybciej, jedno odsłuchanie' },
    speak: { '-1': 'czytanie zdania na głos', 0: 'mówienie ze słowem', 1: 'mówienie z pamięci, z polskiego' },
    error: { '-1': 'błąd już zaznaczony', 0: 'szukanie błędu' },
    particle: { '-1': '4 propozycje', 1: 'wpisujesz partykułę sam' },
    tense_c: { 0: 'wybór formy', 1: 'wpisywanie formy' },
    tense_w: { '-1': 'wybór z 4 form', 0: 'wpisywanie formy' },
    tense_t: { '-1': 'wpisywanie formy', 0: 'tłumaczenie całego zdania' },
    translate: { '-1': 'układanie z kafelków', 0: 'tłumaczenie' }
  };
  /* aktualizacja stopnia po odpowiedzi; zwraca tekst do pokazania albo '' */
  function stepUpdate(card, it, kind, correct, elapsed, isFirst, slowLimit) {
    if (!card || !it || it.simple || !it.baseType || !STEPS[it.baseType]) return '';
    const type = it.baseType, l = stepList(type);
    let idx = l.indexOf(cardStep(it.id, type)); if (idx < 0) idx = 0;
    card.sk = card.sk || 0; card.ft = card.ft || 0;
    const fast = elapsed <= slowLimit * 0.5;
    let msg = '';
    if (!correct) {
      card.sk = 0; card.ft = 0;
      if (idx > 0) { idx--; msg = 'Następnym razem łatwiej: ' + STEP_WORDS[type][l[idx]] + '.'; }
    } else if (kind === 'ok' && !S.hint && elapsed <= slowLimit) {
      if (isFirst) {
        if (idx < l.length - 1) {
          card.sk++;
          const need = l[idx] < 0 && (type === 'cloze' || type === 'particle') ? 2 : 3;
          if (card.sk >= need) { idx++; card.sk = 0; msg = 'Dobrze Ci idzie — następnym razem trudniej: ' + STEP_WORDS[type][l[idx]] + '.'; S.stepUps = (S.stepUps || []).concat([it.id]); }
          else msg = 'Jeszcze ' + (need - card.sk) + '× dobrze z rzędu, a będzie trudniej.';
        } else if (fast && !S.play) {
          card.ft++;
          if (card.ft >= 2) { card.ft = 0; card.mastered = Date.now(); msg = 'Umiesz to — wróci dopiero za ok. 3 tygodnie.'; S.mastered = (S.mastered || []).concat([it.id]); card.st = l[idx]; return { msg, idx: l[idx], master: true }; }
          msg = 'Szybko i dobrze! Jeszcze raz tak samo, a uznam, że to umiesz.';
        } else if (!S.play) { card.ft = 0; msg = 'Dobrze — odpowiedz następnym razem szybciej, a uznam, że to umiesz.'; }
      }
    } else { card.sk = 0; card.ft = 0; }
    card.st = l[idx];
    return { msg, idx: l[idx] };
  }
  function masterCard(card) {
    const days = 21 + Math.floor(Math.random() * 8);
    card.due = U.addDays(U.startOfDay(), days); card.ivl = days; card.s = Math.max(card.s || 0, days); card.state = 'review';
  }
  /* ---------- widoki: wybór słowa (łatwiej) i wpisanie partykuły (trudniej) ---------- */
  /* ---------- zmyłki do „wybierz z 4” ---------- */
  const DISTR_BUSY = {}, DISTR_ERR = {};
  function needsChoice(id) { const it = itemFor(id); return it && it.type === 'cloze' && it.w && it.w.answers[0].split(' ').length <= 2 && cardStep(id, 'cloze') < 0; }
  function ensureDistr(ids) {
    const dc = D().distr = D().distr || {};
    const need = ids.filter(id => !dc[id] && !DISTR_BUSY[id] && !DISTR_ERR[id] && needsChoice(id)).slice(0, 10);
    if (!need.length || !AI.enabled()) return null;
    const pr = AI.makeDistractors(need.map(id => { const w = itemFor(id).w; return { word: w.answers[0], pl: w.pl, sentence: w.s.replace('_', '_____') }; }))
      .then(out => { need.forEach((id, k) => { const ans = itemFor(id).w.answers[0].toLowerCase(); const l = (out[k] || []).filter(x => x.toLowerCase() !== ans); if (l.length >= 2) dc[id] = l.slice(0, 3); else DISTR_ERR[id] = 1; }); Store.save(); })
      .catch(() => { need.forEach(id => { DISTR_ERR[id] = 1; }); })
      .then(() => { need.forEach(id => { delete DISTR_BUSY[id]; }); });
    need.forEach(id => { DISTR_BUSY[id] = pr; });
    return pr;
  }
  /* zapasowe zmyłki bez AI: słowa z tej samej rodziny (wspólny początek) i z tą samą końcówką (ta sama część mowy) */
  function offlineDistr(w) {
    const ans = w.answers[0].toLowerCase(), stem = ans.slice(0, Math.max(4, ans.length - 3));
    const fam = WORDS.list.filter(x => x.id !== w.id && x.answers[0].toLowerCase() !== ans && x.answers[0].toLowerCase().startsWith(stem.slice(0, 4)) && x.answers[0].indexOf(' ') < 0).map(x => x.answers[0]);
    const suf = (ans.match(/(ied|ed|ing|ly|ful|ous|ive|able|ible|al|ent|ant|ion|ness|ment|er|y)$/) || [])[0];
    const pick = sf => U.shuffle(WORDS.list.filter(x => x.id !== w.id && Math.abs(x.lvl - w.lvl) <= 1 && x.answers[0].indexOf(' ') < 0 && x.answers[0].toLowerCase().endsWith(sf) && x.answers[0].toLowerCase() !== ans)).map(x => x.answers[0]);
    const same = suf ? pick(suf).concat(suf === 'ied' ? pick('ed') : []) : [];
    return U.shuffle(fam).slice(0, 2).concat(same);
  }
  function choiceOpts(it) {
    const ans = it.w.answers[0], words = ans.split(' '), n = words.length, okAlt = altOkList(it.w);
    const opts = [ans], low = () => opts.map(o => o.toLowerCase());
    const add = x => { if (opts.length < 4 && x && low().indexOf(x.toLowerCase()) < 0 && okAlt.indexOf(x.toLowerCase()) < 0) opts.push(x); };
    /* przestawiony szyk tych samych słów — trzeba się zastanowić, która kolejność jest dobra */
    const swapAdj = () => { const a = words.slice(), k = Math.floor(Math.random() * (n - 1)); [a[k], a[k + 1]] = [a[k + 1], a[k]]; return a.join(' '); };
    const scramble = limit => { for (let t = 0; t < 40 && opts.length < limit; t++) add(t % 2 ? U.shuffle(words.slice()).join(' ') : swapAdj()); };
    if (n >= 3) scramble(3);
    else { ((D().distr || {})[it.id] || []).forEach(add); offlineDistr(it.w).forEach(add); }
    const others = d => U.shuffle(WORDS.list.filter(w => w.id !== it.w.id && Math.abs(w.lvl - it.w.lvl) <= d && w.answers[0].split(' ').length === n)).forEach(w => add(w.answers[0]));
    [0, 1, 4].forEach(d => { if (opts.length < 4) others(d); });
    if (opts.length < 4 && n >= 2) scramble(4);
    if (opts.length < 4) U.shuffle(WORDS.list.filter(w => w.id !== it.w.id && Math.abs(w.answers[0].split(' ').length - n) === 1)).forEach(w => add(w.answers[0]));
    return U.shuffle(opts);
  }
  /* wybór/partykuła niezgodne z kluczem: AI sprawdza, czy też pasuje w tym zdaniu (np. „put away your phone” obok „put down”) */
  function altOkList(w) { return ((D().altOk || {})[w.id] || []); }
  async function judgeAlt(it, phrase, ans, elapsed, extraAns, more) {
    const mx = o => Object.assign(o, more || {});
    const c = cur(), sess = S, w = it.w;
    if (altOkList(w).indexOf(phrase.toLowerCase()) >= 0) return applyOutcome(c, it, 'ai-ok', elapsed, mx({ ans: extraAns, expl: 'To też pasuje w tym zdaniu (sprawdzone wcześniej).' }));
    if (!AI.enabled()) return applyOutcome(c, it, 'wrong', elapsed, mx({ ans: extraAns }));
    S.phase = 'checking'; renderExercise();
    let m = 'wrong', expl = '', aiErr = '';
    try { const r = await AI.checkAnswer(w, phrase); expl = r.explanation; if (r.acceptable) m = 'ai-ok'; }
    catch (e) { aiErr = AI.humanError(e); }
    if (S !== sess || cur() !== c) return;
    if (m === 'ai-ok') { const ao = D().altOk = D().altOk || {}; ao[w.id] = (ao[w.id] || []).concat([phrase.toLowerCase()]); }
    applyOutcome(c, it, m, elapsed, mx({ ans: extraAns, expl, aiErr }));
  }
  function pickChoice(it, i) {
    if (!S || S.phase !== 'answer' || !S.chOpts || i >= S.chOpts.length) return;
    const ans = S.chOpts[i], el = (Date.now() - S.cardStart) / 1000;
    if (ans.toLowerCase() === it.w.answers[0].toLowerCase()) return applyOutcome(cur(), it, 'exact', el, { ans });
    judgeAlt(it, ans, ans, el, ans);
  }
  function submitPvWrite(it, asUnsure) {
    const inp = $('#ans'), ans = (inp ? inp.value : S.answer) || '';
    S.answer = ans;
    if (!ans.trim()) return emptyEnter();
    if (asUnsure) S.unsure = true;
    const sp = pvSplit(it.w);
    if (!S.hint) { // cały zwrot z pamięci
      const full = U.norm(ans), m0 = matchAnswer(it.w.answers, ans);
      const words = full.split(' '), rest = words[0] === sp.verb ? words.slice(1).join(' ') : full;
      if (m0 !== 'wrong') return applyOutcome(cur(), it, m0, thinkElapsed(), { ans: rest, full });
      return judgeAlt(it, full, rest, thinkElapsed(), rest, { full, verbOk: words[0] === sp.verb.toLowerCase() });
    }
    const part = sp.part, a = U.norm(ans).replace(new RegExp('^' + escapeRe(sp.verb) + '\\s+'), '');
    const m = a === part ? 'exact' : isTypoOf(a, part) ? 'typo' : 'wrong';
    if (m === 'wrong' && a) return judgeAlt(it, sp.verb + ' ' + a, a, thinkElapsed(), a);
    applyOutcome(cur(), it, m, thinkElapsed(), { ans: a });
  }



  /* ================= ZDANIE JEST ZŁE — zgłoszenia i poprawki ================= */
  /* D().fixes[key] = { status: 'fixed' | 'blocked', s: poprawione pełne zdanie, pl, orig, problem, label, at } */
  const BASE_ORIG = {};
  function fixInfo(it) {
    if (!it || it.topic) return null;
    const full = fullSentence(it);
    if (it.simple) { const k = it.id.slice(5); return { key: 'simp:' + k, kind: 'simp', k, full, word: '', pl: it.pl || '', task: 'Ułóż / zapisz zdanie (uproszczona wersja)', label: full }; }
    if (it.ts) {
      const T = TS_BY[it.ts.tid];
      return { key: 'ts:' + it.ts.id, kind: 'ts', full, word: it.ts.correct[0], pl: it.ts.pl, task: 'Ćwiczenie na czas ' + T.name + ' (forma czasownika ' + it.ts.base + ' w luce)',
        extra: 'Forma w luce: „' + it.ts.correct[0] + '”. Błędne opcje do wyboru: ' + it.ts.opts.slice(1).join(', ') + ' — zgłoś też, jeśli któraś z nich jest w tym zdaniu poprawna albo kontekst nie wymusza czasu ' + T.name + '.', label: full };
    }
    if (it.type === 'error') {
      const gi = +it.id.split(':')[1].split('-')[0];
      return { key: 'g:' + gi, kind: 'g', gi, full, word: it.g.correct, pl: '', task: 'Znajdź błąd w zdaniu (błędna wersja: „' + errSentence(it) + '”)', extra: 'Poprawna forma w zdaniu: „' + it.g.correct + '”.', label: full };
    }
    if (it.fromText) {
      const rest = it.id.slice(it.id.indexOf(':') + 1), j = rest.lastIndexOf(':');
      return { key: 'tx:' + rest, kind: 'tx', textId: rest.slice(0, j), n: +rest.slice(j + 1), full, word: '', pl: it.pl || '', task: 'Zdanie z tekstu „' + it.fromText + '”', label: full };
    }
    if (it.w && WORDS.byId[it.w.id]) {
      const w = WORDS.byId[it.w.id];
      return { key: 'w:' + w.id, kind: 'w', wid: w.id, full: w.s.replace('_', w.answers[0]), word: w.answers[0], pl: w.pl, task: 'Zdanie do ćwiczenia słowa „' + w.answers[0] + '” (' + w.pl + ')', label: w.answers[0] + ' — ' + w.s.replace('_', w.answers[0]) };
    }
    return null;
  }
  function fixFamily(f) {
    if (f.kind === 'w') return WORD_PREFIXES.map(p => p + f.wid);
    if (f.kind === 'ts') return ['tnc:', 'tnw:', 'tnt:'].map(p => p + f.key.slice(3));
    if (f.kind === 'g') return [1, 2, 3].map(k => 'err:' + f.gi + '-' + k);
    if (f.kind === 'tx') return ['tord:', 'tdic:', 'ttr:'].map(p => p + f.key.slice(3));
    return [f.key];
  }
  function clozeOf(sent, word) {
    const m = String(sent).match(new RegExp('(^|[^A-Za-z\'])(' + escapeRe(word) + ')(?![A-Za-z])', 'i'));
    if (!m) return null;
    const i = m.index + m[1].length;
    return sent.slice(0, i) + '_' + sent.slice(i + word.length);
  }
  /* poprawki danych bazowych (słowa, zdania „znajdź błąd”) — nakładane przy każdym starcie i zmianie ekranu */
  function applyFixes() {
    const fx = D().fixes || {};
    Object.keys(BASE_ORIG).forEach(k => {
      if (fx[k] && fx[k].status === 'fixed') return;
      if (k.startsWith('w:') && WORDS.byId[k.slice(2)]) WORDS.byId[k.slice(2)].s = BASE_ORIG[k];
      if (k.startsWith('g:') && GRAMMAR[+k.slice(2)]) GRAMMAR[+k.slice(2)].s = BASE_ORIG[k];
      delete BASE_ORIG[k];
    });
    Object.keys(fx).forEach(k => {
      const f = fx[k]; if (f.status !== 'fixed' || !f.cz) return;
      if (k.startsWith('w:')) { const w = WORDS.byId[k.slice(2)]; if (w && !w.custom) { if (!(k in BASE_ORIG)) BASE_ORIG[k] = w.s; w.s = f.cz; } }
      else if (k.startsWith('g:')) { const g = GRAMMAR[+k.slice(2)]; if (g) { if (!(k in BASE_ORIG)) BASE_ORIG[k] = g.s; g.s = f.cz; } }
    });
  }
  function tenseFix(it) {
    const f = (D().fixes || {})['ts:' + it.id];
    if (!f || f.status !== 'fixed' || !f.cz) return it;
    const i = f.cz.indexOf('_');
    return Object.assign({}, it, { before: f.cz.slice(0, i), after: f.cz.slice(i + 1), pl: f.pl || it.pl, fixed: true });
  }
  function suspendIds(ids, on) {
    const cc = D().cards, now = Date.now();
    ids.forEach(id => {
      const c = cc[id];
      if (on) { if (c && c.state === 'known') return; cc[id] = Object.assign({ reps: 0, lapses: 0, added: now }, c || {}, { susp: { due: c ? c.due : null, state: c ? c.state : null, had: !!c }, state: 'review', due: now + 100 * 365 * U.DAY }); }
      else if (c && c.susp) { if (!c.susp.had) delete cc[id]; else { c.due = c.susp.due; c.state = c.susp.state; delete c.susp; } }
    });
  }
  /* zapis poprawki; zwraca tekst błędu albo null */
  function saveFix(f, sent, pl, problem) {
    sent = String(sent || '').trim().replace(/\s+/g, ' ');
    if (!sent) return 'Wpisz poprawione zdanie.';
    if (sent.indexOf('_') >= 0) return 'Zdanie nie może zawierać znaku „_”.';
    let cz = null;
    if (f.word) { cz = clozeOf(sent, f.word); if (!cz) return 'Zdanie musi zawierać „' + f.word + '” dokładnie w tej formie.'; }
    const fx = D().fixes = D().fixes || {};
    const prev = fx[f.key];
    const rec = { status: 'fixed', s: sent, cz, pl: pl || '', orig: prev && prev.orig || f.full, problem: problem || '', label: f.label, kind: f.kind, at: Date.now() };
    if (prev && prev.status === 'blocked') suspendIds(fixFamily(f), false);
    if (f.kind === 'w' && WORDS.byId[f.wid].custom) { const cu = D().custom[f.wid]; rec.origCz = prev && prev.origCz || cu.s; cu.s = cz; WORDS.byId[f.wid].s = cz; }
    else if (f.kind === 'tx') { const T = (D().texts || {})[f.textId], sn = T && T.sents[f.n]; if (!sn) return 'Nie znaleziono tekstu.'; rec.origT = prev && prev.origT || sn.t; sn.t = sent; }
    else if (f.kind === 'simp') { const x = (D().simple || {})[f.k]; if (!x) return 'Nie znaleziono zdania.'; x.s = sent; if (pl) x.pl = pl; }
    fx[f.key] = rec;
    const pc = D().plCache = D().plCache || {};
    fixFamily(f).forEach(id => { delete pc[id]; delete PL_ERR[id]; });
    if (pl) fixFamily(f).filter(id => /^(tr|ttr):/.test(id) || f.kind === 'simp').forEach(id => { pc[id] = pl; });
    TS_ITEMS = null; applyFixes(); Store.save();
    return null;
  }
  function blockFix(f, problem) {
    const fx = D().fixes = D().fixes || {};
    fx[f.key] = { status: 'blocked', orig: f.full, problem: problem || '', label: f.label, kind: f.kind, at: Date.now() };
    suspendIds(fixFamily(f), true);
    Store.save();
  }
  function undoFix(key) {
    const fx = D().fixes || {}, r = fx[key]; if (!r) return;
    const fam = key.startsWith('w:') ? WORD_PREFIXES.map(p => p + key.slice(2)) : key.startsWith('ts:') ? ['tnc:', 'tnw:', 'tnt:'].map(p => p + key.slice(3)) : key.startsWith('g:') ? [1, 2, 3].map(k => 'err:' + key.slice(2) + '-' + k) : key.startsWith('tx:') ? ['tord:', 'tdic:', 'ttr:'].map(p => p + key.slice(3)) : [key];
    if (r.status === 'blocked') suspendIds(fam, false);
    else {
      if (key.startsWith('w:') && r.origCz && D().custom && D().custom[key.slice(2)]) { D().custom[key.slice(2)].s = r.origCz; if (WORDS.byId[key.slice(2)]) WORDS.byId[key.slice(2)].s = r.origCz; }
      if (key.startsWith('tx:') && r.origT) { const rest = key.slice(3), j = rest.lastIndexOf(':'), T = (D().texts || {})[rest.slice(0, j)]; if (T && T.sents[+rest.slice(j + 1)]) T.sents[+rest.slice(j + 1)].t = r.origT; }
      const pc = D().plCache || {}; fam.forEach(id => { delete pc[id]; });
    }
    delete fx[key];
    TS_ITEMS = null; applyFixes(); Store.save();
  }

  /* panel w ćwiczeniu (po odpowiedzi) */
  function reportOpen(it) {
    if (!S || S.phase !== 'feedback') return;
    if (!fixInfo(it)) { toast('Tego zdania nie da się tu poprawić.'); return; }
    S.rep = { open: true, busy: false, res: null, err: '', why: '' };
    renderReportPanel(it);
    const el = document.getElementById('report'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const q = document.getElementById('repWhy'); if (q) q.focus();
  }
  async function reportCheck(it) {
    const R = S && S.rep; if (!R || R.busy) return;
    const f = fixInfo(it), sess = S;
    const q = document.getElementById('repWhy'); R.why = q ? q.value.trim() : R.why;
    R.busy = true; R.err = ''; renderReportPanel(it);
    try {
      R.res = await AI.reviewSentence({ task: f.task, sentence: f.full, word: f.word, pl: f.pl, extra: f.extra }, R.why);
      if (R.res.fixed && f.word && !clozeOf(R.res.fixed, f.word)) R.res.noWord = true;
    } catch (e) { R.err = AI.humanError(e); }
    R.busy = false;
    if (S === sess && S.phase === 'feedback') renderReportPanel(it);
  }
  function refundCard(c) {
    const snap = S.snap && S.snap[c.id];
    if (!snap || !S.fb || (S.fb.kind !== 'bad' && S.fb.kind !== 'idk')) return false;
    if (snap.card) D().cards[c.id] = snap.card; else delete D().cards[c.id];
    if (D().mistakes && D().mistakes.length > snap.mlen) D().mistakes.length = snap.mlen;
    for (let i = S.queue.length - 1; i > S.pos; i--) if (S.queue[i].id === c.id && S.queue[i].relearn) { S.queue.splice(i, 1); break; }
    const sf = D().sentFails; if (sf && sf[c.id]) sf[c.id]--;
    return true;
  }
  function reportSave(it, block) {
    const R = S && S.rep, f = fixInfo(it), c = cur(); if (!R || !f) return;
    if (block) blockFix(f, R.res ? R.res.problem : R.why);
    else {
      const inp = document.getElementById('repFix'), plI = document.getElementById('repPl');
      const err = saveFix(f, inp ? inp.value : '', plI ? plI.value.trim() : (R.res && R.res.pl), R.res ? R.res.problem : R.why);
      if (err) { R.err = err; renderReportPanel(it); return; }
    }
    const refunded = refundCard(c);
    S.rep = null;
    /* to samo zdanie nie wraca już w tej sesji w starej wersji */
    const fam = fixFamily(f);
    for (let i = S.queue.length - 1; i > S.pos; i--) if (fam.indexOf(S.queue[i].id) >= 0 && (block || S.queue[i].relearn)) S.queue.splice(i, 1);
    S.view = null; S.viewId = null;
    Store.save();
    toast((block ? 'Zdanie wyłączone z nauki.' : 'Zapisano poprawkę — od teraz będzie poprawna wersja.') + (refunded ? ' Ta odpowiedź nie liczy się jako błąd.' : '') + ' Lista: Dziennik błędów.');
    next();
  }
  function renderReportPanel(it) {
    const el = document.getElementById('report'); if (!el) return;
    const R = S && S.rep;
    if (!R || !R.open) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    const f = fixInfo(it);
    const stop = inp => { if (inp) inp.onkeydown = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); inp.blur(); } else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (inp.id === 'repWhy') reportCheck(it); else reportSave(it, false); } else e.stopPropagation(); }; };
    let h = '<div class="row between"><b class="ex-title">' + IC.alert + ' Zdanie jest złe?</b><button class="btn small" id="repClose">Zamknij ' + K('X') + '</button></div>' +
      '<div class="small-note" lang="en">„' + esc(f.full) + '”</div>';
    if (!R.res) {
      h += '<div class="ans-row ex-ask"><input id="repWhy" class="txt" autocomplete="off" placeholder="Co Ci nie pasuje? (opcjonalnie) — np. „ważny do wczoraj” nie ma sensu" value="' + esc(R.why || '') + '"' + (R.busy ? ' disabled' : '') + '>' +
        '<button class="btn small primary" id="repGo"' + (R.busy || !AI.enabled() ? ' disabled' : '') + '>Sprawdź z AI</button></div>' +
        (R.busy ? '<div class="checking"><span class="spinner"></span>AI sprawdza samo ćwiczenie…</div>' : '') +
        (!AI.enabled() ? '<div class="small-note">Bez klucza API możesz tylko wyłączyć to zdanie.</div>' : '') +
        '<div class="row" style="justify-content:flex-end"><button class="btn small" id="repBlock">Po prostu wyłącz to zdanie</button></div>';
    } else {
      const r = R.res, cand = r.ok ? '' : (r.noWord ? '' : r.fixed);
      h += '<div class="fb ' + (r.ok ? 'ok' : 'bad') + '" role="status">' + (r.ok ? IC.check : IC.alert) + '<span><span class="ai-tag">AI</span>' + (r.ok ? '<b>Zdanie jest poprawne.</b> ' : '<b>Masz rację — zdanie jest złe.</b> ') + esc(r.problem) + '</span></div>' +
        (r.ok ? '<div class="small-note">Jeśli dalej uważasz, że jest złe, wpisz własną wersję poniżej albo wyłącz zdanie.</div>' : r.noWord ? '<div class="small-note">AI zaproponowało: „' + esc(r.fixed) + '”, ale bez ćwiczonego słowa „' + esc(f.word) + '”. Popraw je poniżej albo wyłącz zdanie.</div>' : '') +
        '<label class="small-note" for="repFix">Poprawione zdanie' + (f.word ? ' (musi zawierać „' + esc(f.word) + '”)' : '') + '</label>' +
        '<input id="repFix" class="txt" lang="en" autocomplete="off" spellcheck="false" value="' + esc(cand || (r.noWord ? r.fixed : '')) + '" placeholder="wpisz poprawną wersję">' +
        (f.kind !== 'g' ? '<label class="small-note" for="repPl">Po polsku</label><input id="repPl" class="txt" autocomplete="off" value="' + esc(r.pl || '') + '">' : '') +
        '<div class="row" style="justify-content:flex-end;gap:10px"><button class="btn small" id="repBlock">Wyłącz zdanie</button><button class="btn small primary" id="repSave">Zapisz poprawkę ' + K('Enter') + '</button></div>';
    }
    if (R.err) h += '<div class="status bad">' + esc(R.err) + '</div>';
    el.innerHTML = h;
    const on = (id, fn) => { const b = document.getElementById(id); if (b) b.onclick = fn; };
    on('repClose', () => { S.rep = null; renderReportPanel(it); });
    on('repGo', () => reportCheck(it));
    on('repBlock', () => reportSave(it, true));
    on('repSave', () => reportSave(it, false));
    stop(document.getElementById('repWhy')); stop(document.getElementById('repFix')); stop(document.getElementById('repPl'));
    const fx = document.getElementById('repFix'); if (fx && !R.focused) { R.focused = true; fx.focus(); fx.setSelectionRange(fx.value.length, fx.value.length); }
  }
  function reportToggle(it) { if (S && S.rep) { S.rep = null; renderReportPanel(it); } else reportOpen(it); }

  /* lista w Dzienniku błędów */
  function fixesHtml() {
    const fx = D().fixes || {}, ks = Object.keys(fx).sort((a, b) => fx[b].at - fx[a].at);
    if (!ks.length) return '';
    return '<section class="list-card raised"><h2 style="font-size:22px">Poprawione zdania</h2><p class="small-note" style="margin:0">Zgłoszone przyciskiem „Zdanie jest złe” (' + K('X') + ' po odpowiedzi). Poprawki zapisują się tylko u Ciebie.</p>' +
      ks.slice(0, 40).map(k => { const r = fx[k]; return '<div class="fixrow inset"><div class="fx-main">' +
        (r.status === 'blocked' ? '<span class="pill-tag bad">wyłączone</span> <s lang="en">' + esc(r.orig) + '</s>' : '<s lang="en">' + esc(r.orig) + '</s><div lang="en"><b>' + esc(r.s) + '</b></div>' + (r.pl ? '<div class="small-note">' + esc(r.pl) + '</div>' : '')) +
        (r.problem ? '<div class="small-note">' + esc(r.problem) + '</div>' : '') + '</div>' +
        '<button class="btn small" data-unfix="' + esc(k) + '">Przywróć oryginał</button></div>'; }).join('') + '</section>';
  }
  function bindFixes() {
    $$('[data-unfix]').forEach(b => b.onclick = () => { undoFix(b.dataset.unfix); renderMistakes(); toast('Przywrócono oryginalne zdanie.'); });
  }

  /* kontrola słów od AI i z Rozmowy, które jeszcze nie przeszły kontroli jakości — przy każdym starcie, tylko niesprawdzone */
  let qcOldRunning = false;
  async function qcOldAiWords() {
    if (qcOldRunning || !AI.enabled()) return;
    const cust = D().custom || {};
    const ids = Object.keys(cust).filter(id => (cust[id].ai || cust[id].fromTalk) && !cust[id].qc && !(D().fixes || {})['w:' + id]);
    if (!ids.length) return;
    qcOldRunning = true;
    let fixed = 0, blocked = 0;
    try {
      for (let i = 0; i < ids.length; i += 25) {
        const part = ids.slice(i, i + 25).filter(id => cust[id]);
        const res = await AI.checkSentences(part.map(id => ({ s: cust[id].s.replace('_', cust[id].answers[0]), word: cust[id].answers[0], pl: cust[id].pl })));
        part.forEach((id, k) => {
          const r = res[k], cu = cust[id]; if (!r || !cu) return;
          if (r.ok) { cu.qc = 1; return; }
          const f = { key: 'w:' + id, kind: 'w', wid: id, full: cu.s.replace('_', cu.answers[0]), word: cu.answers[0], label: cu.answers[0] + ' — ' + cu.s.replace('_', cu.answers[0]) };
          if (r.fixed && !saveFix(f, r.fixed, '', 'Automatyczna kontrola AI: ' + r.problem)) { fixed++; cu.qc = 1; }
          else { blockFix(f, 'Automatyczna kontrola AI: ' + r.problem); blocked++; cu.qc = 1; }
        });
        Store.save();
      }
      D().qcOldDone2 = 1; Store.save();
      if (fixed || blocked) toast('Kontrola AI przejrzała słowa dodane wcześniej przez AI: poprawiono ' + fixed + ', wyłączono ' + blocked + ' zdań. Lista w Dzienniku błędów.');
    } catch (e) { /* spróbuje przy następnym uruchomieniu */ }
    qcOldRunning = false;
  }

  /* ---------- Start ---------- */
  Store.load();
  registerCustom();
  // jednorazowo: „Umiem to” zaznaczone wcześniej obejmuje wszystkie ćwiczenia z danym słowem
  if (!D().knownFamilyV1) {
    const cc = D().cards, now = Date.now();
    Object.keys(cc).filter(id => cc[id].state === 'known').forEach(id => knownFamily(id).forEach(x => { if (!cc[x] || cc[x].state !== 'known') cc[x] = Object.assign({ reps: 0, lapses: 0, added: now }, cc[x] || {}, { state: 'known', knownAt: cc[id].knownAt || now }); }));
    D().knownFamilyV1 = 1; Store.save();
  }
  // jednorazowo: po poprawkach zdań bazowych (przegląd, październik 2026) usuń stare polskie tłumaczenia tych zdań
  if (!D().baseFixV1) {
    const pc = D().plCache || {}, NEW = ['they say there will be a lot of _ today', 'Too many open tabs can make my computer _', 'A teaching _ is required', 'Can you _ the kids from school today', 'One _ voted against the plan', 'I can _ the kids at school on my way', 'The researchers decided to _ one gene', 'We often _ the people who love us most'];
    WORDS.list.filter(w => NEW.some(t => w.s.indexOf(t) >= 0)).forEach(w => WORD_PREFIXES.forEach(p => { delete pc[p + w.id]; }));
    D().baseFixV1 = 1; Store.save();
  }
  scaleMigrate(); scaleMigrate2();
  if (!D().noTextSentV1) { // upd165: bez ćwiczeń ze zdań tekstów (ułóż/dyktando/tłumacz) — słowa z tekstów zostają
    Object.keys(D().cards).forEach(k => { if (/^(tord|tdic|ttr):/.test(k)) delete D().cards[k]; });
    D().noTextSentV1 = 1; progress(); Store.save();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) Store.save(); });
  if (D().profile.placementDone) go('home'); else go('welcome');
  syncStartup();
  try { basketMigrate(); } catch (e) { console.warn(e); }
  try { stubBackfill(); const pc = D().plCache || {}; Object.keys(pc).forEach(k => { if (/to było przyrody/.test(pc[k] || '')) pc[k] = pc[k].replace('to było przyrody', 'to była przyroda'); }); } catch (e) { }
  if (AI.enabled()) AI.test().catch(() => {}); // przy starcie: sprawdzenie AI — przełącznik zielony/czerwony
  setTimeout(qcOldAiWords, 6000);
  /* do testów i diagnozy w konsoli */
  window.__app = { go, newSession, tenseItems, tenseIdsFor, newExtraPool, itemFor, fixInfo, saveFix, undoFix, qcOldAiWords, maybeTopUp, itemLabel, newPool };
})();
/* Paski z kreseczek (upd225): każdy jednokolorowy pasek (.bar, .mi-bar, .st-rpb, .mini, .pr-bar) zamieniany na rząd zaokrąglonych kreseczek;
   zgaszone wklęsłe, zapalone w kolorze paska (gradient = kolejne kreseczki coraz ciemniejsze); przy wzroście zapalają się po kolei. */
(function () {
  const SEL = '.bar, .mi-bar, .st-rpb, .mini, .pr-bar';
  const rgb = s => (s.match(/rgba?\([^)]*\)/g) || []);
  const parse = c => { const m = c.match(/[\d.]+/g) || [0, 0, 0]; return m.slice(0, 3).map(Number); };
  function colorsOf(fill) {
    const cs = getComputedStyle(fill), im = cs.backgroundImage;
    if (im && im !== 'none') { const c = rgb(im); if (c.length >= 2) return { a: parse(c[0]), z: parse(c[c.length - 1]) }; }
    const c = parse(cs.backgroundColor); return { a: c, z: c };
  }
  const LAST = {}; // ostatnio pokazana liczba kreseczek dla danego paska — po przerysowaniu ekranu bez ponownego „ładowania” od zera
  const mix = (C, t) => 'rgb(' + C.a.map((v, j) => Math.round(v + (C.z[j] - v) * t)).join(',') + ')';
  function setup(bar) {
    if (bar.__seg) return;
    const fill = bar.querySelector(':scope > div, :scope > i, :scope > span'); if (!fill || bar.children.length !== 1) return;
    const w = bar.clientWidth; if (!w) return;
    bar.__seg = true;
    const h = bar.clientHeight || 10, segH = Math.max(7, Math.min(14, h + 4)) >= 12 ? 11 : 8, segW = segH, gap = 4; // okrągłe kropeczki (upd246)
    const n = Math.max(4, Math.floor((w + gap) / (segW + gap)));
    const C = colorsOf(fill);
    bar.classList.add('seg-on');
    const row = document.createElement('span'); row.className = 'seg-row';
    row.innerHTML = Array.from({ length: n }, () => '<i style="width:' + segW + 'px;height:' + segH + 'px"></i>').join('');
    bar.appendChild(row);
    const segs = row.children; let shown = 0, timer = 0;
    const all = [...document.querySelectorAll(SEL)], key = (fill.id || bar.className.replace(/\s*seg-on/, '') + '#' + all.indexOf(bar)) + '|' + n;
    const target = () => Math.round(n * Math.min(100, parseFloat(fill.style.width) || 0) / 100);
    const paint = k => { for (let i = 0; i < n; i++) { const on = i < k; segs[i].classList.toggle('on', on); segs[i].style.background = on ? mix(C, n > 1 ? i / (n - 1) : 0) : ''; } shown = k; LAST[key] = k; };
    const go = () => {
      const t = target(); clearTimeout(timer);
      if (t <= shown) { paint(t); return; }
      const step = () => { if (shown < t) { paint(shown + 1); timer = setTimeout(step, 60); } };
      step();
    };
    paint(Math.min(LAST[key] || 0, target())); go();
    new MutationObserver(go).observe(fill, { attributes: true, attributeFilter: ['style'] });
  }
  function scan(root) { (root || document).querySelectorAll(SEL).forEach(b => { if (!b.__seg) setup(b); }); }
  const start = () => {
    const app = document.getElementById('app'); if (!app) return;
    let q = 0;
    new MutationObserver(() => { if (q) return; q = requestAnimationFrame(() => { q = 0; scan(document); }); }).observe(document.body, { childList: true, subtree: true });
    scan(document);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
