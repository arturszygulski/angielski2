/* Rdzeń: zapis danych, algorytm powtórek (FSRS), AI, mowa, narzędzia. */

/* ---------- Narzędzia ---------- */
window.U = (function () {
  const DAY = 86400000;
  const z = n => String(n).padStart(2, '0');
  function dayKey(d) { d = d ? new Date(d) : new Date(); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  function startOfDay(t) { const d = new Date(t == null ? Date.now() : t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function addDays(t, n) { const d = new Date(t); d.setDate(d.getDate() + n); return d.getTime(); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"„”]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  /* Odległość edycyjna: brak / nadmiar / zamiana litery oraz przestawienie dwóch sąsiednich liter = 1 błąd. */
  function editMatrix(a, b) {
    const m = a.length, n = b.length, d = [];
    for (let i = 0; i <= m; i++) { d[i] = new Array(n + 1).fill(0); d[i][0] = i; }
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d;
  }
  function lev(a, b) { if (a === b) return 0; return editMatrix(a, b)[a.length][b.length]; }
  /* Które litery się różnią — do podświetlenia literówki. */
  function align(a, b) {
    const d = editMatrix(a, b);
    const aM = new Array(a.length).fill(false), bM = new Array(b.length).fill(false);
    let i = a.length, j = b.length;
    while (i > 0 || j > 0) {
      if (i > 1 && j > 1 && a[i - 1] !== b[j - 1] && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && d[i][j] === d[i - 2][j - 2] + 1) {
        aM[i - 1] = aM[i - 2] = bM[j - 1] = bM[j - 2] = true; i -= 2; j -= 2; continue;
      }
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        if (a[i - 1] !== b[j - 1]) { aM[i - 1] = true; bM[j - 1] = true; }
        i--; j--; continue;
      }
      if (i > 0 && d[i][j] === d[i - 1][j] + 1) { aM[i - 1] = true; i--; continue; }
      bM[j - 1] = true; j--;
    }
    return { aM, bM };
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return z(Math.floor(sec / 60)) + ':' + z(sec % 60); }
  return { DAY, dayKey, startOfDay, addDays, esc, norm, lev, align, shuffle, mmss };
})();

/* ---------- Zapis danych (localStorage) ---------- */
window.Store = (function () {
  const KEY = 'angielski-codziennie.v1';
  function defaults() {
    return {
      version: 1,
      profile: { name: '', levels: null, placementDone: false, createdAt: Date.now() },
      settings: {
        apiKey: '', model: 'claude-haiku-5-5', modelSmart: 'claude-sonnet-5-5', newPerDay: 8, newExtraPerDay: 6, blockMin: 5, goalMin: 15, voiceURI: '', speakAfter: true, slowSec: 20, maxReviewsPerDay: 150,
        sounds: true, volume: 50, rate: 0.95, syncFolder: '', ygAccent: 'us', playMin: 10, playQ: 25, raceSec: 60,
        games: { race: true, order: true, error: true, dictation: true, speak: true, translate: true, particle: true, tenses: true }
      },
      cards: {}, days: {}, xp: 0, bestCombo: 0, raceBest: 0, lastBackup: 0, lastSync: 0, progressAt: 0,
      custom: {}, mistakes: [], badges: {}, boss: {}, typesPlayed: {}, mistakeTips: null, texts: {}, topUpDay: '',
      plCache: {}, levelHist: [], audio: [], lastReportWeek: '',
      tenseOpen: {}, tenseHist: {}, tenseExtra: {}, convos: [], talkAutoSend: true, explains: {},
      sentLvl: 0, sentHist: [], sentLvlHist: [], sentFails: {}, simple: {}, simpleN: 0
    };
  }
  function merge(def, obj) {
    for (const k in def) {
      if (obj[k] === undefined) obj[k] = def[k];
      else if (def[k] && typeof def[k] === 'object' && !Array.isArray(def[k]) && k !== 'cards' && k !== 'days' && obj[k] && typeof obj[k] === 'object') merge(def[k], obj[k]);
    }
    return obj;
  }
  let data = defaults();
  let ok = true;
  function load() {
    try { const raw = localStorage.getItem(KEY); data = raw ? merge(defaults(), JSON.parse(raw)) : defaults(); }
    catch (e) { ok = false; data = defaults(); }
    return data;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); ok = true; } catch (e) { ok = false; console.error(e); }
    return ok;
  }
  function replace(obj) {
    if (!obj || typeof obj !== 'object' || !obj.cards || !obj.settings) throw new Error('To nie jest plik kopii tego programu.');
    data = merge(defaults(), obj); save();
  }
  function reset() { data = defaults(); save(); }
  function today() {
    const k = U.dayKey();
    if (!data.days[k]) data.days[k] = { sec: 0, xp: 0, newCount: 0, newExtra: 0, reviews: 0, correct: 0, total: 0, quick: false };
    if (data.days[k].newExtra == null) data.days[k].newExtra = 0;
    return data.days[k];
  }
  return { load, save, replace, reset, today, get data() { return data; }, get ok() { return ok; } };
})();

/* ---------- Algorytm powtórek FSRS-4.5 ----------
   Oceny: 1 = źle, 2 = trudno / niepewnie, 3 = dobrze. */
window.FSRS = (function () {
  const w = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const DECAY = -0.5, FACTOR = 19 / 81, RETENTION = 0.9, DAY = U.DAY;
  const clampD = d => Math.min(10, Math.max(1, d));
  const initD = g => clampD(w[4] - (g - 3) * w[5]);
  const initS = g => Math.max(0.1, w[g - 1]);
  const retrievability = (t, s) => Math.pow(1 + FACTOR * t / s, DECAY);
  const nextD = (d, g) => clampD(w[7] * initD(3) + (1 - w[7]) * (d - w[6] * (g - 3)));
  const recallS = (d, s, r, g) => s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1) * (g === 2 ? w[15] : 1));
  const forgetS = (d, s, r) => Math.min(s, w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r)));
  const interval = s => Math.min(3650, Math.max(1, Math.round(s / FACTOR * (Math.pow(RETENTION, 1 / DECAY) - 1))));

  /* opts.cap — maksymalny odstęp w dniach (np. 2 dla „nie jestem pewien”) */
  function review(card, g, opts) {
    opts = opts || {};
    const now = Date.now();
    const c = Object.assign({ reps: 0, lapses: 0 }, card || {});
    if (!c.reps || !c.s) { c.d = initD(g); c.s = initS(g); }
    else {
      const elapsed = Math.max(0, (now - (c.last || now)) / DAY);
      const r = retrievability(elapsed, c.s);
      if (g === 1) { c.s = forgetS(c.d, c.s, r); c.lapses++; }
      else c.s = recallS(c.d, c.s, r, g);
      c.d = nextD(c.d, g);
    }
    c.reps++; c.last = now; c.state = 'review';
    let days = g === 1 ? 1 : interval(c.s);
    if (opts.cap) days = Math.min(days, opts.cap);
    if (days > 3) days = Math.max(1, Math.round(days * (0.95 + Math.random() * 0.1)));
    const due = new Date(U.startOfDay(now)); due.setDate(due.getDate() + days);
    c.due = due.getTime();
    c.ivl = days;
    return c;
  }
  return { review };
})();

/* ---------- AI (Claude API) ---------- */
window.AI = (function () {
  const URL = 'https://api.anthropic.com/v1/messages';
  /* komentarze dla Artura: zwracaj się bezpośrednio (ty, napisałeś), nie „uczeń napisał” */
  const VOICE = '\n\nWAŻNE: wszystkie teksty po polsku, które zobaczy użytkownik (wyjaśnienia, komentarze, oceny, podpowiedzi), pisz, zwracając się do niego bezpośrednio na „ty”, w rodzaju męskim — np. „napisałeś”, „użyłeś”, „dobrze ci poszło” — nigdy „uczeń napisał” ani „użytkownik”. W danych nazywam go Artur, ale w tekstach dla niego NIE pisz o nim w trzeciej osobie (żadnego „Artur napisał”, „odpowiedź ucznia”, „jego odpowiedź”) — zawsze „ty”: „twoja odpowiedź”, „napisałeś”.';
  const sys = t => String(t || '') + VOICE;
  class AIError extends Error { constructor(status, msg) { super(msg || ''); this.status = status; } }
  function enabled() { return !!(Store.data.settings.apiKey || '').trim(); }
  /* dwa modele: szybki (Haiku) do częstych sprawdzeń, mądrzejszy (Sonnet) do wyjaśnień i rzadkich, ważnych zadań */
  let curSmart = false;
  function pickModel() {
    const s = Store.data.settings;
    if (curSmart) { const m = (s.modelSmart == null ? 'claude-sonnet-5-5' : s.modelSmart).trim(); if (m) return m; }
    return (s.model || 'claude-haiku-5-5').trim();
  }
  /* gdy model do wyjaśnień odmówi (400/404 — np. zła nazwa albo brak dostępu), zapytanie idzie jeszcze raz na szybkim modelu */
  let smartErr = '';
  const fastModel = () => (Store.data.settings.model || 'claude-haiku-5-5').trim();
  async function aiFetch(url, opts) {
    let body; try { body = JSON.parse(opts.body); } catch (e) { return fetch(url, opts); }
    const res = await fetch(url, opts);
    if (res.ok || !(res.status === 400 || res.status === 404) || body.model === fastModel()) return res;
    let msg = ''; try { const j = await res.clone().json(); msg = (j.error && j.error.message) || ''; } catch (e) { }
    smartErr = body.model + ' → ' + res.status + (msg ? ': ' + msg : '');
    console.warn('Model do wyjaśnień nie zadziałał, używam szybkiego:', smartErr);
    return fetch(url, Object.assign({}, opts, { body: JSON.stringify(Object.assign(body, { model: fastModel() })) }));
  }
  /* model wybierany synchronicznie przy starcie zapytania — flaga od razu wraca, więc równoległe szybkie sprawdzenia zostają na Haiku */
  const smart = fn => function () { curSmart = true; try { return fn.apply(this, arguments); } finally { curSmart = false; } };

  async function call(system, user, maxTokens, timeoutMs) {
    const s = Store.data.settings;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs || 15000);
    try {
      const res = await aiFetch(URL, {
        method: 'POST', signal: ctrl.signal,
        headers: {
          'content-type': 'application/json',
          'x-api-key': s.apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({ model: pickModel(), max_tokens: maxTokens || 300, system: sys(system), messages: [{ role: 'user', content: user }] })
      });
      if (!res.ok) {
        let msg = '';
        try { const j = await res.json(); msg = (j.error && j.error.message) || ''; } catch (e) { }
        throw new AIError(res.status, msg);
      }
      const j = await res.json();
      return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    } finally { clearTimeout(timer); }
  }

  /* Odpowiedź w ustalonym kształcie (narzędzie z schematem JSON) — API zwraca gotowy obiekt, bez ryzyka zepsutego JSON-a */
  async function callJSON(system, user, maxTokens, timeoutMs, schema) {
    const s = Store.data.settings;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs || 15000);
    try {
      const res = await aiFetch(URL, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': s.apiKey.trim(), 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: pickModel(), max_tokens: maxTokens || 600, system: sys(system),
          tools: [{ name: 'odpowiedz', description: 'Zwróć wynik w tym formacie.', input_schema: schema }],
          tool_choice: { type: 'tool', name: 'odpowiedz' },
          messages: [{ role: 'user', content: user }]
        })
      });
      if (!res.ok) {
        let msg = '';
        try { const j = await res.json(); msg = (j.error && j.error.message) || ''; } catch (e) { }
        throw new AIError(res.status, msg);
      }
      const j = await res.json();
      const tu = (j.content || []).find(b => b.type === 'tool_use');
      if (tu && tu.input && typeof tu.input === 'object') return tu.input;
      if (j.stop_reason === 'max_tokens') throw new Error('odpowiedź AI była za długa i została ucięta — spróbuj jeszcze raz.');
      return parseJSON((j.content || []).filter(b => b.type === 'text').map(b => b.text).join(''));
    } finally { clearTimeout(timer); }
  }
  const STR = { type: 'string' };

  function humanError(e) {
    if (!e) return 'Nieznany błąd AI.';
    if (e.name === 'AbortError') return 'AI nie odpowiedziało na czas.';
    if (e.status === 401) return 'Nieprawidłowy klucz API — sprawdź go w ustawieniach.';
    if (e.status === 400 && /credit|balance/i.test(e.message)) return 'Brak środków na koncie API — doładuj je w Claude Console.';
    if (e.status === 404 || (e.status === 400 && /model/i.test(e.message))) return 'Model odrzucił zapytanie — sprawdź nazwę modelu w ustawieniach.' + (e.message ? ' (' + e.message + ')' : '');
    if (e.status === 429) return 'Za dużo zapytań naraz — spróbuj za chwilę.';
    if (e.status >= 500) return 'Serwer AI jest chwilowo przeciążony.';
    if (e instanceof TypeError) return 'Brak połączenia z internetem — AI pominięte.';
    return 'Błąd AI' + (e.status ? ' (' + e.status + ')' : '') + (e.message ? ': ' + e.message : '');
  }

  function parseJSON(text) {
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI zwróciło nieczytelną odpowiedź.');
    try { return JSON.parse(m[0]); }
    catch (e) {
      try { return JSON.parse(m[0].replace(/,\s*([}\]])/g, '$1').replace(/[“”]/g, '"')); }
      catch (e2) { throw new Error('AI zwróciło nieczytelną odpowiedź.'); }
    }
  }

  async function checkAnswer(item, answer) {
    const system = 'Jesteś cierpliwym nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Ćwiczenie: Artur wpisuje brakujące angielskie słowo lub wyrażenie w zdaniu.\n' +
      'Podpowiedź po polsku: "' + item.pl + '"\n' +
      'Zdanie: "' + item.s.replace('_', '_____') + '"\n' +
      'Oczekiwana odpowiedź: "' + item.answers[0] + '"\n' +
      'Odpowiedź Artura: "' + answer + '"\n\n' +
      'Oceń, czy odpowiedź Artura jest gramatycznie poprawna i naturalna w tym zdaniu ORAZ zgodna ze znaczeniem podpowiedzi (bliski synonim jest w porządku; literówka, która tworzy inne słowo, nie). ' +
      'Napisz po polsku 1–2 krótkie zdania: jeśli źle — dlaczego i czym różni się od oczekiwanej odpowiedzi; jeśli dobrze — krótko potwierdź.\n' +
      'Zwróć dokładnie: {"acceptable": true albo false, "explanation": "..."}';
    const j = await callJSON(system, user, 500, 20000, { type: 'object', required: ['acceptable', 'explanation'], properties: { acceptable: { type: 'boolean' }, explanation: STR } });
    return { acceptable: !!j.acceptable, explanation: String(j.explanation || '') };
  }

  async function checkTypo(item, answer) {
    const system = 'Jesteś nauczycielem angielskiego dla Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Artur miał wpisać "' + item.answers[0] + '" (' + item.pl + '), a wpisał "' + answer + '".\n' +
      'Czy "' + answer + '" to istniejące angielskie słowo lub wyrażenie o INNYM znaczeniu (czyli pomyłka słowa), a nie zwykła literówka?\n' +
      'Zwróć dokładnie: {"realWord": true albo false, "explanation": "jeśli realWord: po polsku jedno krótkie zdanie, co znaczy \\"' + answer + '\\" i czym różni się od oczekiwanego słowa; inaczej pusty tekst"}';
    const j = await callJSON(system, user, 400, 20000, { type: 'object', required: ['realWord', 'explanation'], properties: { realWord: { type: 'boolean' }, explanation: STR } });
    return { realWord: !!j.realWord, explanation: String(j.explanation || '') };
  }

  /* Ocena całego zdania (Ułóż zdanie, Znajdź błąd) */
  async function checkSentence(task, expected, answer) {
    const system = 'Jesteś cierpliwym nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Zadanie Artura: ' + task + '\n' +
      'Wzorcowa odpowiedź: "' + expected + '"\n' +
      'Odpowiedź Artura: "' + answer + '"\n\n' +
      'Oceń, czy odpowiedź Artura jest poprawnym, naturalnym angielskim zdaniem o tym samym sensie (inna poprawna kolejność lub forma jest w porządku). ' +
      'Napisz po polsku 1–2 krótkie zdania: jeśli źle — co dokładnie jest nie tak; jeśli dobrze — krótko potwierdź.\n' +
      'Zwróć dokładnie: {"acceptable": true albo false, "explanation": "..."}';
    const j = await callJSON(system, user, 500, 20000, { type: 'object', required: ['acceptable', 'explanation'], properties: { acceptable: { type: 'boolean' }, explanation: STR } });
    return { acceptable: !!j.acceptable, explanation: String(j.explanation || '') };
  }

  /* Własne słówka: znaczenie i przykładowe zdanie dla listy słów */
  async function makeExamples(items, levelName) {
    const system = 'Jesteś nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const list = items.map((x, i) => (i + 1) + '. ' + x.word + (x.pl ? ' (znaczenie: ' + x.pl + ')' : '')).join('\n');
    const user =
      'Dla każdego angielskiego słowa lub wyrażenia z listy podaj krótkie polskie znaczenie (jeśli podano znaczenie, zachowaj je) ' +
      'oraz jedno naturalne, codzienne zdanie po angielsku na poziomie ' + levelName + ', które zawiera DOKŁADNIE tę formę słowa, bez odmiany. ' +
      'Zdanie ma mieć 6–14 słów, a słowo ma wystąpić w nim tylko raz. Zdanie musi mieć sens logiczny (bez sprzeczności, określenia czasu zgodne z czasem gramatycznym, wiarygodna sytuacja).\n\n' + list + '\n\n' +
      'Zwróć dokładnie: {"items": [{"word": "...", "pl": "...", "sentence": "..."}]} w tej samej kolejności.';
    const j = await callJSON(system, user, Math.min(5000, 400 + items.length * 130), 60000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['word', 'pl', 'sentence'], properties: { word: STR, pl: STR, sentence: STR } } } } });
    return Array.isArray(j.items) ? j.items : [];
  }

  /* Dziennik błędów: krótka analiza wzorców */
  async function analyzeMistakes(groups) {
    const system = 'Jesteś życzliwym, konkretnym nauczycielem angielskiego dla dorosłego Polaka. Piszesz po polsku.';
    const list = groups.map(g => '- ' + g.cat + ' (' + g.n + ' razy)' + (g.ex.length ? ': ' + g.ex.join('; ') : '')).join('\n');
    const user = 'Oto najczęstsze błędy Artura z ostatnich 30 dni:\n' + list + '\n\n' +
      'Napisz 3–5 krótkich, praktycznych wskazówek (każda w osobnej linii, zaczynając od "• "). ' +
      'Dla każdego wzorca wyjaśnij krótko zasadę lub sposób na zapamiętanie i podaj jeden przykład po angielsku. Bez wstępu i podsumowania.';
    return (await call(system, user, 700)).trim();
  }

  /* Moje teksty: znaczenie słowa/zwrotu w kontekście */
  async function explainPhrase(phrase, sentence, context) {
    const system = 'Jesteś nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Artur czyta angielski tekst i zaznaczył: "' + phrase + '"\n' +
      'Zdanie: "' + sentence + '"\n' + (context ? 'Kontekst (sąsiednie zdania): "' + context + '"\n' : '') + '\n' +
      'Wyjaśnij po polsku, co ten fragment znaczy W TYM KONKRETNYM ZDANIU. ' +
      'Zwróć: {"pl": "krótkie polskie tłumaczenie fragmentu w tym znaczeniu (1–5 słów)", "base": "forma podstawowa po angielsku (np. bezokolicznik)", ' +
      '"explanation": "1–3 krótkie zdania po polsku: znaczenie tutaj, ewentualnie inne częste znaczenia lub niuans", "example": "jedno inne krótkie zdanie po angielsku z tym słowem w tym samym znaczeniu"}';
    const j = await callJSON(system, user, 600, 25000, { type: 'object', required: ['pl', 'base', 'explanation', 'example'], properties: { pl: STR, base: STR, explanation: STR, example: STR } });
    return { pl: String(j.pl || ''), base: String(j.base || ''), explanation: String(j.explanation || ''), example: String(j.example || '') };
  }
  async function translateSentence(sentence, context) {
    const system = 'Jesteś tłumaczem angielsko-polskim. Tłumaczysz naturalnie, bez komentarzy.';
    const user = (context ? 'Kontekst: "' + context + '"\n\n' : '') + 'Przetłumacz na naturalny polski to zdanie:\n"' + sentence + '"\nPodaj tylko tłumaczenie.';
    return (await call(system, user, 400)).trim().replace(/^"|"$/g, '');
  }
  async function askAboutText(question, phrase, sentence, context, history) {
    const system = 'Jesteś cierpliwym nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz po polsku, krótko i konkretnie (do 5 zdań), z angielskimi przykładami tam, gdzie pomagają.';
    const msgs = [];
    (history || []).slice(-6).forEach(h => { msgs.push({ role: 'user', content: h.q }); msgs.push({ role: 'assistant', content: h.a }); });
    msgs.push({ role: 'user', content: 'Zdanie z tekstu: "' + sentence + '"' + (phrase ? '\nZaznaczony fragment: "' + phrase + '"' : '') + (context ? '\nKontekst: "' + context + '"' : '') + '\n\nPytanie: ' + question });
    const s = Store.data.settings;
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await aiFetch(URL, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': s.apiKey.trim(), 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: pickModel(), max_tokens: 600, system: sys(system), messages: msgs })
      });
      if (!res.ok) { let msg = ''; try { const j = await res.json(); msg = (j.error && j.error.message) || ''; } catch (e) { } throw new AIError(res.status, msg); }
      const j = await res.json();
      return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    } finally { clearTimeout(timer); }
  }
  /* transkrypcja bez kropek i przecinków → dodaj interpunkcję, nie zmieniając słów */
  async function punctuate(chunk) {
    const system = 'Dodajesz interpunkcję i wielkie litery do angielskiej transkrypcji. Nie zmieniasz, nie dodajesz i nie usuwasz słów. Zwracasz wyłącznie poprawiony tekst.';
    return (await call(system, chunk, Math.min(4000, Math.round(chunk.length / 2.5) + 200), 60000)).trim();
  }
  /* automatyczne dobieranie nowych słów na poziomie Artura */
  async function newWords(levelName, avoid, n) {
    const system = 'Jesteś nauczycielem angielskiego dla dorosłego Polaka. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Podaj ' + n + ' przydatnych, często używanych angielskich słów lub krótkich wyrażeń na poziomie ' + levelName + ', których NIE MA na liście poniżej. ' +
      'Artur lubi technikę i naukę — niech mniej więcej jedna trzecia słów będzie z tych dziedzin, reszta z codziennego życia i pracy. ' +
      'Do każdego: krótkie polskie znaczenie i jedno naturalne zdanie po angielsku (6–14 słów), które zawiera DOKŁADNIE to słowo w podanej formie, tylko raz. Zdanie musi mieć sens logiczny (bez sprzeczności, określenia czasu zgodne z czasem gramatycznym, wiarygodna sytuacja).\n\n' +
      'Lista do pominięcia: ' + avoid.join(', ') + '\n\n' +
      'Zwróć dokładnie: {"items": [{"word": "...", "pl": "...", "sentence": "..."}]}';
    const j = await callJSON(system, user, Math.min(5000, 400 + n * 120), 90000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['word', 'pl', 'sentence'], properties: { word: STR, pl: STR, sentence: STR } } } } });
    return Array.isArray(j.items) ? j.items : [];
  }

  /* „Rozszerz temat”: krótkie omówienie + ćwiczenia poboczne + scenka do rozmowy */
  async function topicPack(c, levelName, focus) {
    const system = 'Jesteś nauczycielem angielskiego dla Artura — dorosłego Polaka (lubi technikę i naukę). Piszesz zwięźle i konkretnie. Odpowiadasz wyłącznie przez narzędzie.';
    const user = 'Artur chce rozszerzyć temat po tym ćwiczeniu:\n' + mistakeContextPub(c) + '\nPoziom Artura: ' + levelName + '\n\n' +
      (focus ? focus + ' Jeśli to pasuje, omów temat na przykładzie zdania z ćwiczenia. Przygotuj:\n' : 'Wybierz JEDEN najważniejszy temat z tego ćwiczenia (słowo/zwrot albo konstrukcję gramatyczną — zwłaszcza to, co sprawiło trudność) i przygotuj:\n') +
      '- title: krótka nazwa tematu (np. „expect” albo „Past Continuous: was doing”);\n' +
      '- about: 2–3 zdania po polsku, o co chodzi i kiedy tego używać;\n' +
      '- contrast: 1–2 zdania po polsku, czym to się różni od rzeczy podobnych, z którymi Polak może pomylić (pusty tekst, jeśli nie dotyczy);\n' +
      '- examples: 5 naturalnych zdań po angielsku (codzienność, praca, technika) z polskim tłumaczeniem;\n' +
      '- pitfalls: 2–3 typowe pułapki Polaków, krótko po polsku, z mini-przykładem;\n' +
      '- items: DOKŁADNIE 8 ćwiczeń na poziomie Artura: 3× kind "cloze", 2× "translate", 2× "order", 1× "dictation". Każde: en — pełne, poprawne, naturalne zdanie po angielsku (6–14 słów, z sensem logicznym, określenia czasu zgodne z czasem gramatycznym); answer — słowo lub zwrot z tematu, który występuje w en DOKŁADNIE w tej formie; answer_pl — polskie znaczenie tego słowa/zwrotu; pl — polskie tłumaczenie całego zdania;\n' +
      '- talk_role: po angielsku, krótki opis postaci i sytuacji do rozmowy, w której Artur będzie naturalnie musiał użyć tematu (postać zadaje pytania, które go do tego skłaniają);\n' +
      '- talk_goal: po polsku, cel Artura w tej rozmowie (np. „Użyj kilka razy expect, opowiadając o…”).';
    const IT = { type: 'object', required: ['kind', 'en', 'answer', 'answer_pl', 'pl'], properties: { kind: { type: 'string', enum: ['cloze', 'translate', 'order', 'dictation'] }, en: STR, answer: STR, answer_pl: STR, pl: STR } };
    const j = await callJSON(system, user, 3000, 90000, { type: 'object', required: ['title', 'about', 'contrast', 'examples', 'pitfalls', 'items', 'talk_role', 'talk_goal'], properties: {
      title: STR, about: STR, contrast: STR, examples: { type: 'array', items: { type: 'object', required: ['en', 'pl'], properties: { en: STR, pl: STR } } },
      pitfalls: { type: 'array', items: STR }, items: { type: 'array', items: IT }, talk_role: STR, talk_goal: STR } });
    return {
      title: String(j.title || '').trim() || 'Temat', about: String(j.about || ''), contrast: String(j.contrast || ''),
      examples: (j.examples || []).filter(x => x && x.en).slice(0, 6).map(x => ({ en: String(x.en), pl: String(x.pl || '') })),
      pitfalls: (j.pitfalls || []).map(String).filter(Boolean).slice(0, 4),
      items: (j.items || []).filter(x => x && x.en && x.answer).map(x => ({ kind: x.kind, en: String(x.en).trim(), answer: String(x.answer).trim(), answer_pl: String(x.answer_pl || ''), pl: String(x.pl || '') })),
      talkRole: String(j.talk_role || ''), talkGoal: String(j.talk_goal || '')
    };
  }

  /* Krok po kroku: AI pisze krótkie „dlaczego teraz” do kroków planu i proponuje temat audycji */
  async function guidePlan(steps, ctx) {
    const system = 'Jesteś trenerem angielskiego Artura — dorosłego Polaka, który lubi technikę i naukę. Odpowiadasz wyłącznie jednym obiektem JSON.';
    const user = 'Program ułożył Arturowi plan nauki na dziś:\n' + steps.map((x, i) => (i + 1) + '. ' + x.title + ' — ' + x.why).join('\n') +
      '\n\nDane o Arturze:\n' + ctx + '\n\n' +
      'Zadania:\n1) Do KAŻDEGO kroku (w tej samej kolejności, dokładnie ' + steps.length + ' pozycji) napisz jedno krótkie zdanie po polsku (najwyżej 14 słów), w 2. osobie, dlaczego warto to zrobić właśnie teraz — konkretnie, na podstawie danych (jaki błąd wraca, co słabnie, czego dawno nie było). Bez pustych pochwał i bez wykrzykników.\n' +
      '2) Zaproponuj temat krótkiej audycji do słuchania: jedno konkretne zdanie po polsku (np. „jak działa ładowanie indukcyjne telefonu”), ciekawe dla Artura, w którym naturalnie mogą się pojawić ćwiczone słowa lub konstrukcje; oraz krótką nazwę tematu (2–4 słowa).\n' +
      'Zwróć: {"why": ["...", ...], "topic": "...", "topicName": "..."}';
    const j = await callJSON(system, user, 900, 30000, { type: 'object', required: ['why', 'topic', 'topicName'], properties: { why: { type: 'array', items: STR }, topic: STR, topicName: STR } });
    return { why: Array.isArray(j.why) ? j.why : [], topic: j.topic || '', topicName: j.topicName || '' };
  }

  /* Przetłumacz: polskie wersje angielskich zdań (paczką) */
  async function translateBatch(sentences) {
    const system = 'Jesteś tłumaczem angielsko-polskim. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user = 'Przetłumacz każde zdanie na naturalny, potoczny polski (tak, jak powiedziałby to Polak). Zachowaj sens i czas gramatyczny, bez dopisków.\n\n' +
      sentences.map((x, i) => (i + 1) + '. ' + x).join('\n') +
      '\n\nZwróć dokładnie: {"items": ["tłumaczenie 1", "tłumaczenie 2", ...]} — tyle samo pozycji, w tej samej kolejności.';
    const j = await callJSON(system, user, Math.min(4000, 300 + sentences.length * 80), 60000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: STR } } });
    return Array.isArray(j.items) ? j.items.map(x => String(x || '').trim()) : [];
  }
  async function judgeTranslation(pl, reference, answer, focus, spoken) {
    const system = 'Jesteś życzliwym nauczycielem angielskiego dla dorosłego Polaka. Liczy się to, czy Anglik zrozumie Artura. Odpowiadasz wyłącznie jednym obiektem JSON, bez żadnego innego tekstu.';
    const user =
      'Artur tłumaczył z polskiego na angielski.\nPolskie zdanie: "' + pl + '"\nPrzykładowe tłumaczenie: "' + reference + '"\nOdpowiedź Artura: "' + answer + '"\n\n' +
      'Oceń odpowiedź Artura (inne poprawne sformułowania są w porządku, drobne literówki nie przeszkadzają):\n' +
      '- "natural" — poprawne i naturalne, ten sam sens;\n- "understandable" — Anglik zrozumie bez problemu, ale są błędy albo brzmi nienaturalnie;\n- "wrong" — inny sens albo trudno zrozumieć.\n' +
      (focus ? 'WAŻNE: ' + focus + '\n' : '') +
      'ZASADY:\n- Całkowicie ignoruj wielkie/małe litery i interpunkcję (przecinki, kropki) — nie oceniaj ich i NIE wspominaj o nich.\n' +
      '- Porównuj dokładnie słowa, które Artur napisał. Nie pisz, że czegoś brakuje, jeśli to jest w jego odpowiedzi; nie przypisuj mu słów z przykładowego tłumaczenia. Jego sformułowanie (np. „When” zamiast „After”) jest w porządku, jeśli pasuje do sensu.\n' +
      '- W explanation wymień tylko rzeczywiste różnice, np. brakujące „the” albo zbędne słowo, cytując je.\n' +
      (spoken ? '- Artur PODYKTOWAŁ odpowiedź do mikrofonu — rozpoznawanie mowy mogło dodać, zgubić albo przekręcić krótkie słowo (np. „on”, „the”, „a”). Jeśli różnica wygląda na błąd rozpoznania, zaznacz to delikatnie („możliwe, że mikrofon usłyszał…”).\n' : '') +
      'Zwróć dokładnie: {"verdict": "natural" | "understandable" | "wrong", "better": "poprawiona, naturalna wersja zdania Artura (jak najbliżej jego słów)", "explanation": "1–2 krótkie zdania po polsku: co poprawić albo potwierdzenie"}';
    const j = await callJSON(system, user, 500, 25000, { type: 'object', required: ['verdict', 'better', 'explanation'], properties: { verdict: { type: 'string', enum: ['natural', 'understandable', 'wrong'] }, better: STR, explanation: STR } });
    const v = ['natural', 'understandable', 'wrong'].includes(j.verdict) ? j.verdict : 'wrong';
    return { verdict: v, better: String(j.better || ''), explanation: String(j.explanation || '') };
  }
  /* Audycja: krótki tekst do słuchania + 4 pytania */
  /* Szczegółowe wyjaśnienie błędu + krótka dyskusja */
  function mistakeContextPub(c) { return mistakeContext(c); }
  function mistakeContext(c) {
    return 'Ćwiczenie: ' + c.task + '\n' + (c.pl ? 'Podpowiedź / znaczenie po polsku: ' + c.pl + '\n' : '') +
      (c.sentence ? 'Poprawne zdanie: "' + c.sentence + '"\n' : '') + 'Oczekiwana odpowiedź: "' + c.correct + '"\n' +
      (c.options && c.options.length ? 'Opcje do wyboru: ' + c.options.map(o => '"' + o + '"').join(', ') + '\n' : '') +
      'Odpowiedź Artura: ' + (c.answer ? '"' + c.answer + '"' : c.ok ? '(poprawna)' : '(nie wiedział)') + '\n' +
      (c.ok ? 'Artur odpowiedział DOBRZE, ale chce lepiej zrozumieć (np. wahał się między opcjami). Nie traktuj tego jak błędu.\n' : '') +
      (c.note ? 'Krótki komentarz, który już dostał: ' + c.note + '\n' : '');
  }
  async function explainMistake(c, levelName) {
    const system = 'Jesteś cierpliwym, konkretnym nauczycielem angielskiego dla dorosłego Polaka (poziom ' + levelName + '). Tłumaczysz jasno, po polsku, bez lania wody. Artur lubi technikę i naukę.';
    const user = mistakeContext(c) + '\nWyjaśnij Arturowi dokładniej. Pola:\n' +
      'why — 2–4 zdania po polsku: dlaczego poprawna odpowiedź jest taka, jaka zasada albo znaczenie za tym stoi, i czym różni się wersja Artura (jeśli też jest poprawna lub prawie — powiedz to wprost). Jeśli Artur odpowiedział dobrze, a były opcje do wyboru — wyjaśnij krótko, dlaczego każda z pozostałych opcji tu nie pasuje (zwłaszcza ta najbardziej podobna);\n' +
      'examples — 2 inne naturalne zdania po angielsku z tym samym słowem lub konstrukcją, w innym kontekście (np. technika, praca, codzienność), z tłumaczeniem: {en, pl};\n' +
      'simpler — 1–2 prostsze albo alternatywne sposoby powiedzenia tego samego sensu, przydatne w rozmowie, gdy zapomni się trudniejszej formy: {en, pl};\n' +
      'watch — jedno zdanie po polsku: typowa pułapka Polaków przy tym błędzie (pusty tekst, jeśli nie ma);\n' +
      'key_ok — najpierw sprawdź samo ćwiczenie: true, jeśli zdanie z klucza jest poprawne, naturalne i ma sens; false tylko wtedy, gdy jest błędne, nienaturalne albo bez sensu (np. sprzeczne określenia czasu);\n' +
      'key_problem — tylko gdy key_ok = false: po polsku w 1 zdaniu, co jest źle w ćwiczeniu, i poprawna wersja; gdy key_ok = true — pusty tekst. Gdy key_ok = false, w why nie broń błędnego klucza. ' +
      'Jeśli odpowiedź Artura też jest poprawna i naturalna w tym zdaniu, powiedz to wprost w why.';
    const j = await callJSON(system, user, 1200, 30000, { type: 'object', required: ['why', 'examples', 'simpler', 'watch', 'key_ok', 'key_problem'], properties: {
      why: STR, watch: STR, key_ok: { type: 'boolean' }, key_problem: STR,
      examples: { type: 'array', items: { type: 'object', required: ['en', 'pl'], properties: { en: STR, pl: STR } } },
      simpler: { type: 'array', items: { type: 'object', required: ['en', 'pl'], properties: { en: STR, pl: STR } } } } });
    return { why: String(j.why || ''), examples: (j.examples || []).slice(0, 3), simpler: (j.simpler || []).slice(0, 2), watch: String(j.watch || ''), keyProblem: j.key_ok === false ? String(j.key_problem || '').trim() : '' };
  }
  async function discussMistake(c, levelName, data, chat, question) {
    const s = Store.data.settings;
    const system = 'Jesteś cierpliwym nauczycielem angielskiego dla dorosłego Polaka (poziom ' + levelName + '). Rozmawiacie krótko o jego błędzie z ćwiczenia. ' +
      'Odpowiadaj po polsku, konkretnie (zwykle 2–5 zdań), z krótkimi przykładami po angielsku, gdy pomagają. Jeśli Artur proponuje własną wersję zdania — oceń ją uczciwie: czy jest poprawna, naturalna, w jakiej sytuacji pasuje. ' +
      'Jeśli Artur ma rację, przyznaj to. Pamiętaj, że samo ćwiczenie (zdanie albo klucz odpowiedzi) mogło zostać źle napisane — jeśli tak jest, powiedz to od razu wprost, podaj poprawną wersję i dodaj, że może je poprawić przyciskiem „Zdanie jest złe” (klawisz X).\n\nKontekst:\n' + mistakeContext(c) + (data && data.why ? 'Wyjaśnienie, które już dostał: ' + data.why + '\n' : '');
    const msgs = [];
    (chat || []).slice(-8).forEach(m => { msgs.push({ role: 'user', content: m.q }); msgs.push({ role: 'assistant', content: m.a }); });
    msgs.push({ role: 'user', content: question });
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await aiFetch(URL, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': s.apiKey.trim(), 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: pickModel(), max_tokens: 700, system: sys(system), messages: msgs })
      });
      if (!res.ok) { let msg = ''; try { const j = await res.json(); msg = (j.error && j.error.message) || ''; } catch (e) { } throw new AIError(res.status, msg); }
      const j = await res.json();
      return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    } finally { clearTimeout(timer); }
  }

  /* Uprość zdanie, które nie wychodzi */
  async function simplifySentence(sentence, keep, levelName, keepNote) {
    const system = 'Jesteś nauczycielem angielskiego dla dorosłego Polaka. Upraszczasz zdania tak, żeby Artur mógł przećwiczyć ten sam element w łatwiejszej wersji.';
    const user = 'Zdanie, które Arturowi (poziom ' + levelName + ') kilka razy nie wyszło: "' + sentence + '"\n' +
      (keep ? 'Koniecznie zachowaj: "' + keep + '"' + (keepNote ? ' (' + keepNote + ')' : '') + '.\n' : '') +
      'Napisz wyraźnie prostszą wersję: krótsza (najlepiej 5–9 słów), prostsze słowa, jedno zdanie bez zdań podrzędnych, ten sam sens lub podobna sytuacja. ' +
      'Pola: sentence — prostsze zdanie po angielsku; pl — jego tłumaczenie na polski; note — krótko po polsku, co uprościłeś.';
    const j = await callJSON(system, user, 400, 20000, { type: 'object', required: ['sentence', 'pl', 'note'], properties: { sentence: STR, pl: STR, note: STR } });
    return { sentence: String(j.sentence || '').trim(), pl: String(j.pl || '').trim(), note: String(j.note || '').trim() };
  }

  /* Rozmowa z AI */
  const TALK_LEVEL = {
    A1: 'Mów bardzo prosto: zdania 4–8 słów, tylko najczęstsze słowa, czas teraźniejszy, jedno pytanie naraz. Mów powoli i jasno.',
    A2: 'Mów prosto: krótkie zdania (do 12 słów), codzienne słowa, proste czasy przeszłe i przyszłe, bez idiomów.',
    B1: 'Mów naturalnie, ale przystępnie: zdania do ok. 15 słów, typowe zwroty, nieliczne phrasal verbs.',
    B2: 'Mów naturalnie jak native speaker w codziennej rozmowie: phrasal verbs, kolokacje, normalne tempo.',
    C1: 'Mów w pełni naturalnie: idiomy, niuanse, szybkie tempo, swobodny rejestr.'
  };
  function talkTranscript(history) { return history.map(m => (m.role === 'ai' ? 'TY (postać): ' : 'ARTUR: ') + m.text).join('\n'); }
  async function talkTurn(scene, levelName, history) {
    const system = 'Prowadzisz ćwiczenie rozmowy po angielsku z dorosłym Polakiem uczącym się języka. Grasz postać ze scenki i zawsze odpowiadasz po angielsku, w roli. ' +
      (TALK_LEVEL[levelName] || TALK_LEVEL.B1) + ' Odpowiadaj krótko: 1–3 zdania, zwykle kończ pytaniem albo czymś, na co Artur może odpowiedzieć. ' +
      'Nie poprawiaj błędów Artura i nie oceniaj go — reaguj jak prawdziwy rozmówca. Jeśli nie rozumiesz, o co chodzi, dopytaj naturalnie. ' +
      'Jeśli Artur wtrąci polskie słowo, podaj naturalnie angielski odpowiednik (np. „Oh, you mean a warranty?”) i rozmawiaj dalej.';
    const user = 'Scenka: ' + scene.role + '\nCel Artura w tej scence: ' + scene.goal + '\n\n' +
      (history.length ? 'Dotychczasowa rozmowa:\n' + talkTranscript(history) + '\n\nNapisz następną wypowiedź postaci.' : 'Rozpocznij rozmowę jako postać (pierwsza wypowiedź).') +
      '\nPola: reply — wypowiedź postaci po angielsku; understood — czy ostatnia wypowiedź Artura była zrozumiała (true, gdy Artur jeszcze nic nie powiedział); goal_done — czy Artur osiągnął już cel scenki.';
    const j = await callJSON(system, user, 400, 25000, { type: 'object', required: ['reply', 'understood', 'goal_done'], properties: { reply: STR, understood: { type: 'boolean' }, goal_done: { type: 'boolean' } } });
    return { reply: String(j.reply || '').trim(), understood: j.understood !== false, goalDone: !!j.goal_done };
  }
  async function talkHint(scene, levelName, history) {
    const system = 'Pomagasz Polakowi w ćwiczeniu rozmowy po angielsku.';
    const user = 'Scenka: ' + scene.role + '\nCel Artura: ' + scene.goal + '\nPoziom Artura: ' + levelName + '\n\nRozmowa:\n' + talkTranscript(history) +
      '\n\nZaproponuj 3 krótkie, różne odpowiedzi, które Artur może teraz powiedzieć (na jego poziomie, naturalne, przybliżające do celu). Pola: suggestions — lista {en: zdanie po angielsku, pl: tłumaczenie}.';
    const j = await callJSON(system, user, 500, 25000, { type: 'object', required: ['suggestions'], properties: { suggestions: { type: 'array', items: { type: 'object', required: ['en', 'pl'], properties: { en: STR, pl: STR } } } } });
    return (j.suggestions || []).slice(0, 3).map(x => ({ en: String(x.en || ''), pl: String(x.pl || '') })).filter(x => x.en);
  }
  async function talkSummary(scene, levelName, history) {
    const system = 'Jesteś życzliwym, konkretnym nauczycielem angielskiego dla dorosłego Polaka. Oceniasz przede wszystkim, czy Artur dał się zrozumieć i osiągnął cel, a nie perfekcję.';
    const user = 'Scenka: ' + scene.role + '\nCel Artura: ' + scene.goal + '\nPoziom Artura: ' + levelName + '\n\nRozmowa:\n' + talkTranscript(history) + '\n\n' +
      'Przygotuj podsumowanie po polsku. Pola: score — zrozumiałość Artura 0–100; goal_done — czy osiągnął cel; summary — 2–3 zdania po polsku: co poszło dobrze, nad czym pracować; ' +
      'corrections — 3–5 najważniejszych poprawek: {you: dokładnie to, co Artur powiedział, better: naturalna poprawna wersja, why: krótko po polsku}; pomiń drobiazgi, jeśli nie ma błędów — pusta lista; ' +
      'phrases — 3–6 przydatnych zwrotów z tej rozmowy albo do takiej sytuacji, warte nauki: {phrase: zwrot po angielsku, pl: znaczenie, sentence: krótkie zdanie po angielsku zawierające DOKŁADNIE ten zwrot}.';
    const j = await callJSON(system, user, 1500, 45000, { type: 'object', required: ['score', 'goal_done', 'summary', 'corrections', 'phrases'], properties: {
      score: { type: 'integer' }, goal_done: { type: 'boolean' }, summary: STR,
      corrections: { type: 'array', items: { type: 'object', required: ['you', 'better', 'why'], properties: { you: STR, better: STR, why: STR } } },
      phrases: { type: 'array', items: { type: 'object', required: ['phrase', 'pl', 'sentence'], properties: { phrase: STR, pl: STR, sentence: STR } } } } });
    return { score: Math.max(0, Math.min(100, parseInt(j.score, 10) || 0)), goalDone: !!j.goal_done, summary: String(j.summary || ''), corrections: (j.corrections || []).slice(0, 5), phrases: (j.phrases || []).slice(0, 6) };
  }

  /* Czasy: nowe zdania do ćwiczeń danego czasu */
  async function makeTenseItems(tenseName, levelName, n, avoid) {
    const system = 'Jesteś nauczycielem angielskiego dla dorosłego Polaka. Tworzysz ćwiczenia na czasy gramatyczne.';
    const user = 'Napisz ' + n + ' nowych, naturalnych zdań po angielsku (6–14 słów) ćwiczących czas ' + tenseName + ', słownictwo na poziomie ' + levelName + '. ' +
      'Mniej więcej jedna trzecia zdań o technice lub nauce, reszta z życia codziennego i pracy. Każde zdanie ma jednoznacznie wymagać tego czasu — dodaj słowo-sygnał albo kontekst. Zdanie musi mieć sens logiczny (bez sprzeczności, określenia czasu zgodne z czasem gramatycznym, wiarygodna sytuacja). Błędne formy (wrong) nie mogą być w tym zdaniu również poprawne.\n' +
      'W każdym zdaniu jedna luka na formę czasownika. Podaj: before (tekst przed luką), after (tekst po luce), base (czasownik w formie podstawowej, z podmiotem gdy luka obejmuje pytanie, np. "you / go"), ' +
      'answer (poprawna forma w luce), wrong (3 błędne formy tego samego czasownika w innych czasach, każda inna), pl (polskie tłumaczenie całego zdania), signal (słowo-sygnał z zdania albo pusty tekst), why (krótko po polsku: dlaczego ten czas).' +
      (avoid && avoid.length ? '\nNie powtarzaj zdań: ' + avoid.slice(0, 40).join(' | ') : '');
    const j = await callJSON(system, user, 3500, 90000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['before', 'after', 'base', 'answer', 'wrong', 'pl', 'why'], properties: { before: STR, after: STR, base: STR, answer: STR, wrong: { type: 'array', items: STR }, pl: STR, signal: STR, why: STR } } } } });
    return (Array.isArray(j.items) ? j.items : []).filter(x => x && x.answer && Array.isArray(x.wrong) && x.wrong.length >= 3 && x.base && x.pl && new Set([x.answer].concat(x.wrong.slice(0, 3))).size === 4);
  }

  /* Zmyłki do „wybierz z 4”: formy tego samego słowa + słowa o podobnym znaczeniu, ale tylko jedno pasuje */
  async function makeDistractors(items) {
    const system = 'Jesteś autorem testów z angielskiego dla dorosłego Polaka. Tworzysz trudne, ale uczciwe zmyłki do zadań wielokrotnego wyboru. Odpowiadasz wyłącznie przez narzędzie.';
    const user = 'Dla każdego zadania podaj dokładnie 3 błędne opcje do zdania z luką. Poprawna odpowiedź jest podana razem z polskim znaczeniem.\n' +
      'Zasady: 1–2 opcje to inne formy tego samego słowa (np. worried → worry, worrying, worries), które w tym zdaniu są gramatycznie złe; ' +
      '1–2 opcje to słowa o podobnym znaczeniu, łatwe do pomylenia albo podobnie wyglądające (np. nervous, upset), które gramatycznie pasują, ale NIE znaczą tego, co polskie znaczenie. ' +
      'Żadna zmyłka nie może być poprawną odpowiedzią w tym zdaniu przy tym polskim znaczeniu. Zmyłki mają mieć podobną długość (dla wyrażeń — tyle samo słów). Bez powtórzeń i bez poprawnej odpowiedzi.\n\n' +
      items.map((x, i) => (i + 1) + '. Zdanie: "' + x.sentence + '" · poprawna: "' + x.word + '" · znaczenie: ' + x.pl).join('\n') +
      '\n\nPola: items — lista w tej samej kolejności: {n: numer, wrong: [3 zmyłki]}.';
    const j = await callJSON(system, user, Math.min(3000, 200 + items.length * 90), 45000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['n', 'wrong'], properties: { n: { type: 'integer' }, wrong: { type: 'array', items: STR } } } } } });
    const out = items.map(() => null);
    (j.items || []).forEach((r, k) => { const i = r.n >= 1 && r.n <= items.length ? r.n - 1 : k; if (i < items.length && !out[i] && Array.isArray(r.wrong)) out[i] = r.wrong.map(x => String(x || '').trim()).filter(Boolean); });
    return out;
  }

  /* Kontrola jakości: drugie, niezależne sprawdzenie zdań wygenerowanych przez AI, zanim trafią do nauki */
  const QC_RULES = 'Sprawdź każde zdanie jak bardzo dokładny native speaker i korektor. Zdanie jest OK tylko, gdy jednocześnie:\n' +
    '1) jest w 100% poprawne gramatycznie;\n2) brzmi naturalnie — tak powiedziałby native speaker;\n' +
    '3) ma sens logiczny: brak sprzeczności, określenia czasu pasują do czasu gramatycznego (np. „is valid until yesterday” — źle), fakty i sytuacja są wiarygodne;\n' +
    '4) wymagane słowo/wyrażenie jest użyte w podanym znaczeniu.\nBądź surowy — w razie wątpliwości oznacz jako błędne.';
  async function checkSentences(list) {
    const system = 'Jesteś surowym korektorem angielskich zdań do ćwiczeń dla uczących się. Odpowiadasz wyłącznie przez narzędzie.';
    const user = QC_RULES + '\n\nZdania:\n' + list.map((x, i) => (i + 1) + '. "' + x.s + '"' + (x.word ? ' — wymagane: "' + x.word + '"' : '') + (x.pl ? ' (znaczenie: ' + x.pl + ')' : '') + (x.note ? ' — ' + x.note : '')).join('\n') +
      '\n\nDla każdego zdania (w tej samej kolejności): n — numer; ok — true/false; problem — gdy błędne, krótko po polsku, co jest źle; fixed — gdy błędne: poprawiona, naturalna wersja, która zawiera wymagane słowo DOKŁADNIE w tej formie (pusty tekst, gdy ok).';
    const j = await callJSON(system, user, Math.min(6000, 300 + list.length * 110), 90000, { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['n', 'ok', 'problem', 'fixed'], properties: { n: { type: 'integer' }, ok: { type: 'boolean' }, problem: STR, fixed: STR } } } } });
    const out = list.map(() => null);
    (j.items || []).forEach((r, k) => { const i = (r.n >= 1 && r.n <= list.length) ? r.n - 1 : k; if (i < list.length && !out[i]) out[i] = { ok: r.ok === true, problem: String(r.problem || ''), fixed: String(r.fixed || '').trim() }; });
    return out;
  }
  /* Zgłoszenie „Zdanie jest złe”: AI sprawdza jedno ćwiczenie i proponuje poprawkę */
  async function reviewSentence(c, why) {
    const system = 'Jesteś surowym, uczciwym korektorem angielskich ćwiczeń dla dorosłego Polaka. Sprawdzasz samo ćwiczenie (zdanie i klucz odpowiedzi), a nie odpowiedź Artura.';
    const user = QC_RULES + '\n\nĆwiczenie: ' + c.task + '\nZdanie w ćwiczeniu (z poprawną odpowiedzią wg klucza): "' + c.sentence + '"\n' +
      (c.word ? 'Ćwiczony element (musi zostać, dokładnie w tej formie): "' + c.word + '"\n' : '') + (c.pl ? 'Polskie znaczenie / tłumaczenie: ' + c.pl + '\n' : '') + (c.extra ? c.extra + '\n' : '') +
      (why ? 'Artur zgłasza: „' + why + '”\n' : 'Artur zgłasza, że zdanie wydaje mu się złe.\n') +
      '\nPola: ok — true, jeśli ćwiczenie jest w pełni poprawne i sensowne; problem — po polsku, 1–3 zdania: co jest źle albo dlaczego jest dobrze; ' +
      'fixed — gdy złe: poprawione, naturalne zdanie po angielsku, które zawiera ćwiczony element dokładnie w tej formie (pusty tekst, gdy ok); fixed_pl — polskie tłumaczenie poprawionego zdania (pusty, gdy ok).';
    const j = await callJSON(system, user, 700, 30000, { type: 'object', required: ['ok', 'problem', 'fixed', 'fixed_pl'], properties: { ok: { type: 'boolean' }, problem: STR, fixed: STR, fixed_pl: STR } });
    return { ok: j.ok === true, problem: String(j.problem || ''), fixed: String(j.fixed || '').trim(), pl: String(j.fixed_pl || '').trim() };
  }

  /* Audycja: krótki tekst do słuchania + 4 pytania — twarde zasady dla każdego poziomu */
  const LISTEN_SPEC = {
    A1: { words: '70–90', maxAvg: 9, text: 'Bardzo krótkie zdania (5–8 słów), jedna myśl w zdaniu. Tylko ok. 500 najczęstszych słów angielskich (I, you, have, like, go, big, small, day…). Tylko czas Present Simple (ewentualnie "there is/are", "can"). Żadnych idiomów, phrasal verbs ani słów fachowych — trudne pojęcie zastąp prostym opisem. Powtarzaj ważne słowa.',
      q: 'Pytania o proste fakty powiedziane wprost w tekście (kto, co, gdzie, ile). Błędne odpowiedzi wyraźnie różne od poprawnej.' },
    A2: { words: '100–120', maxAvg: 13, text: 'Krótkie zdania (8–12 słów). Codzienne słownictwo (ok. 1500 najczęstszych słów). Czasy: Present Simple, Past Simple, "going to"/"will". Proste spójniki: and, but, because, so, then. Bez idiomów; słowa fachowe tylko z prostym wyjaśnieniem.',
      q: 'Pytania o fakty powiedziane wprost w tekście. Błędne odpowiedzi pojawiają się w temacie, ale łatwo je odrzucić.' },
    B1: { words: '140–160', maxAvg: 17, text: 'Zdania średniej długości (do ok. 15 słów), czasem złożone. Szersze słownictwo codzienne i trochę tematycznego. Present Perfect, Past Continuous, pierwszy okres warunkowy, proste zdania względne (which, who). Kilka częstych phrasal verbs.',
      q: 'Pytania o szczegóły i główną myśl; jedno pytanie wymaga połączenia dwóch informacji. Błędne odpowiedzi wiarygodne.' },
    B2: { words: '170–190', maxAvg: 22, text: 'Zdania złożone, różnorodne. Słownictwo tematyczne i fachowe, kolokacje, phrasal verbs. Strona bierna, drugi i trzeci okres warunkowy, mowa zależna, konstrukcje typu "not only… but also". Naturalny styl dobrego podcastu popularnonaukowego.',
      q: 'Pytania o szczegóły, przyczyny i skutki oraz jedno o wniosek (czego można się domyślić). Błędne odpowiedzi bardzo wiarygodne, używają słów z tekstu.' },
    C1: { words: '190–220', maxAvg: 30, text: 'Długie, wielokrotnie złożone zdania, bogate i precyzyjne słownictwo, idiomy i wyrażenia potoczne, niuanse, ironia lub dystans autora, inwersja, konstrukcje imiesłowowe. Tempo i rejestr jak w prawdziwym podcaście dla native speakerów.',
      q: 'Pytania o wnioskowanie, intencję i postawę autora, znaczenie wyrażenia w kontekście. Błędne odpowiedzi subtelnie różne od poprawnej, parafrazowane.' }
  };
  function avgSentenceWords(text) {
    const ss = String(text).split(/(?<=[.!?…])\s+/).map(x => x.trim()).filter(x => x.split(/\s+/).length >= 2);
    if (!ss.length) return 0;
    return ss.reduce((a, x) => a + x.split(/\s+/).length, 0) / ss.length;
  }
  async function makeListening(levelName, topic, avoid, polishQuestions) {
    const sp = LISTEN_SPEC[levelName] || LISTEN_SPEC.B1;
    const system = 'Jesteś autorem materiałów do nauki angielskiego dla dorosłego Polaka. Ściśle trzymasz się poziomu CEFR — tekst na A1 ma być naprawdę prosty, a na C1 naprawdę trudny.';
    const prompt = extra =>
      'Napisz krótką audycję do słuchania (jak fragment podcastu albo radia) na poziomie ' + levelName + ' (CEFR), temat: ' + topic + '.\n' +
      'Długość: ' + sp.words + ' słów. Zasady językowe dla ' + levelName + ': ' + sp.text + '\n' +
      'Treść: ciekawe, konkretne fakty, naturalny język mówiony.' + (avoid && avoid.length ? ' Nie powtarzaj tematów: ' + avoid.join('; ') + '.' : '') + '\n' +
      'Pytania: 4 pytania sprawdzające rozumienie ze słuchu, każde z 4 odpowiedziami, dokładnie jedna poprawna. ' + sp.q + ' ' +
      'Pytania i odpowiedzi ' + (polishQuestions ? 'po polsku' : 'po angielsku') + '. ' +
      'Dla każdego pytania podaj "quote" — dokładny, dosłowny fragment tekstu (3–12 słów), w którym jest odpowiedź.\n' +
      'Pola: title — krótki tytuł po angielsku, title_pl — tytuł po polsku, text — tekst audycji, questions — 4 pytania (q, options: 4 odpowiedzi, answer: indeks poprawnej 0–3, quote).' + (extra || '');
    const schema = {
      type: 'object', required: ['title', 'text', 'questions'],
      properties: {
        title: STR, title_pl: STR, text: STR,
        questions: { type: 'array', items: { type: 'object', required: ['q', 'options', 'answer', 'quote'], properties: { q: STR, options: { type: 'array', items: STR }, answer: { type: 'integer', description: 'indeks poprawnej odpowiedzi 0–3' }, quote: STR } } }
      }
    };
    let j = await callJSON(system, prompt(), 2500, 60000, schema);
    const avg = avgSentenceWords(j.text || '');
    if (j.text && avg > sp.maxAvg) {
      // za trudne jak na poziom — jedna poprawka
      try {
        const j2 = await callJSON(system, prompt('\n\nUWAGA: poprzednia wersja była za trudna — średnio ' + Math.round(avg) + ' słów w zdaniu, a dla ' + levelName + ' ma być najwyżej ' + sp.maxAvg + '. Napisz nową, wyraźnie prostszą wersję: krótsze zdania, prostsze słowa.'), 2500, 60000, schema);
        if (j2.text && avgSentenceWords(j2.text) < avg) j = j2;
      } catch (e) { /* zostaje pierwsza wersja */ }
    }
    const qs = (Array.isArray(j.questions) ? j.questions : []).map(q => Object.assign({}, q, { answer: parseInt(q && q.answer, 10) })).filter(q => q && q.q && Array.isArray(q.options) && q.options.length === 4 && q.answer >= 0 && q.answer <= 3);
    if (!j.text || qs.length < 3) throw new Error('AI przygotowało niepełną audycję — spróbuj jeszcze raz.');
    return { title: String(j.title || topic), titlePl: String(j.title_pl || ''), text: String(j.text).trim(), avgWords: Math.round(avgSentenceWords(j.text) * 10) / 10, questions: qs.slice(0, 4).map(q => ({ q: String(q.q), options: q.options.map(String), answer: +q.answer, quote: String(q.quote || '') })) };
  }

  async function test() { await call('Odpowiadasz jednym słowem.', 'Napisz: OK', 10); return true; }

  return { enabled, guidePlan: smart(guidePlan), topicPack: smart(topicPack), checkAnswer, checkTypo, checkSentence, makeExamples, analyzeMistakes, explainPhrase: smart(explainPhrase), translateSentence, askAboutText: smart(askAboutText), punctuate, newWords, translateBatch, judgeTranslation: smart(judgeTranslation), makeListening, makeTenseItems, makeDistractors, checkSentences, reviewSentence: smart(reviewSentence), talkTurn, talkHint, talkSummary: smart(talkSummary), explainMistake: smart(explainMistake), discussMistake: smart(discussMistake), simplifySentence, test, testSmart: async () => { smartErr = ''; await smart(test)(); if (smartErr) throw new AIError(400, smartErr); return true; }, smartErr: () => smartErr, humanError };
})();

/* ---------- Mowa (syntezator przeglądarki) ---------- */
window.Speech = (function () {
  let voices = [];
  const listeners = [];
  const supported = 'speechSynthesis' in window;
  function load() {
    if (!supported) return;
    voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang))
      .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
    listeners.forEach(f => f());
  }
  /* naturalne głosy online (Edge) i głosy Google na górze listy */
  function score(v) { return (/Natural/i.test(v.name) ? 3 : 0) + (/Online|Google/i.test(v.name) ? 2 : 0) + (/en-US|en-GB/i.test(v.lang) ? 1 : 0); }
  if (supported) { load(); speechSynthesis.onvoiceschanged = load; }
  function voice() {
    const uri = Store.data.settings.voiceURI;
    return voices.find(v => v.voiceURI === uri)
      || voices.find(v => /en-US/i.test(v.lang) && /Google|Natural|Online/i.test(v.name))
      || voices.find(v => /en-US/i.test(v.lang))
      || voices[0];
  }
  function speak(parts, rate) {
    if (!supported) return;
    speechSynthesis.cancel();
    const v = voice();
    (Array.isArray(parts) ? parts : [parts]).forEach(p => {
      if (!p || !p.trim()) return;
      const u = new SpeechSynthesisUtterance(p);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.rate = rate || Store.data.settings.rate || 0.95;
      speechSynthesis.speak(u);
    });
  }
  /* jedno zdanie z informacją o końcu — do czytania tekstu na głos */
  function speakOne(text, rate, onend) {
    if (!supported) { if (onend) setTimeout(onend, 0); return; }
    speechSynthesis.cancel();
    const v = voice();
    const u = new SpeechSynthesisUtterance(text);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
    u.rate = rate || Store.data.settings.rate || 0.95;
    let done = false;
    const fin = () => { if (!done) { done = true; if (onend) onend(); } };
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
    return () => { done = true; speechSynthesis.cancel(); };
  }
  return { speak, speakOne, supported, onChange: f => listeners.push(f), get voices() { return voices; } };
})();

/* ---------- Delikatne dźwięki (syntezowane, bez plików) ---------- */
window.Sound = (function () {
  let ctx = null;
  const st = () => Store.data.settings;
  function on() { return st().sounds !== false && (st().volume == null ? 50 : st().volume) > 0; }
  function getCtx() {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(c, freq, start, dur, type, gain) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    const t = c.currentTime + start;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // [częstotliwość Hz, start s, długość s]
  const P = {
    ok:    [[659.25, 0, .22], [987.77, .09, .32]],
    combo: [[659.25, 0, .18], [830.61, .08, .18], [987.77, .16, .4]],
    uns:   [[587.33, 0, .26], [698.46, .11, .3]],
    bad:   [[349.23, 0, .26], [293.66, .13, .36]],
    idk:   [[440, 0, .4]],
    block: [[523.25, 0, .7], [659.25, .06, .7], [783.99, .12, .9]]
  };
  function play(name) {
    if (!on()) return;
    const c = getCtx(); if (!c) return;
    const base = 0.11 * (st().volume == null ? 50 : st().volume) / 100;
    const soft = name === 'bad' || name === 'idk';
    (P[name] || []).forEach(([f, s, d]) => {
      tone(c, f, s, d, soft ? 'sine' : 'triangle', soft ? base * 0.8 : base);
      tone(c, f * 2, s, d * 0.6, 'sine', base * 0.12);
    });
  }
  return { play, on };
})();


/* ---------- Rozpoznawanie mowy (Chrome / Edge) ---------- */
window.Recog = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let active = null;
  function supported() { return !!SR; }
  /* słucha do końca wypowiedzi: tryb ciągły, koniec dopiero po ciszy (domyślnie 2,5 s po ostatnim słowie)
     albo po ponownym kliknięciu; krótkie przerwy na zastanowienie nie ucinają nagrania */
  function listen(h) {
    if (!SR) { h.onError('unsupported'); return; }
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = true; r.maxAlternatives = 3; r.continuous = true;
    const SILENCE = h.silenceMs || 2500, FIRST = h.firstMs || 8000;
    let segs = [], lastAlts = [], done = false, timer = 0, heard = false;
    const arm = ms => { clearTimeout(timer); timer = setTimeout(() => { try { r.stop(); } catch (e) { } }, ms); };
    r.onresult = e => {
      let interim = '';
      segs = []; lastAlts = [];
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) { segs.push(res[0].transcript.trim()); lastAlts = Array.from(res).map(a => a.transcript.trim()); }
        else interim += res[0].transcript;
      }
      heard = true;
      const full = (segs.join(' ') + ' ' + interim).trim();
      if (full && h.onInterim) h.onInterim(full);
      arm(SILENCE);
    };
    r.onerror = e => { if (e.error === 'no-speech' && heard) return; if (done) return; done = true; clearTimeout(timer); h.onError(e.error); };
    r.onend = () => {
      active = null; clearTimeout(timer);
      if (done) return;
      done = true;
      if (!segs.length) { h.onError('no-speech'); return; }
      /* warianty: całe zdanie z najlepszych dopasowań + wersje z innymi dopasowaniami ostatniego fragmentu */
      const head = segs.slice(0, -1).join(' '), alts = [segs.join(' ')];
      lastAlts.slice(1).forEach(a => alts.push((head + ' ' + a).trim()));
      h.onResult(alts.filter((x, k) => x && alts.indexOf(x) === k));
    };
    try { r.start(); active = r; arm(FIRST); } catch (e) { done = true; h.onError('start'); }
  }
  function stop() { if (active) { try { active.stop(); } catch (e) { } } }
  return { supported, listen, stop };
})();

/* ---------- Automatyczna kopia w folderze (np. Dysk Google na komputerze) ---------- */
window.Sync = (function () {
  const supported = typeof window.showDirectoryPicker === 'function';
  const FILE = 'angielski-postepy.json';
  function idb() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('angielski-codziennie', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function kv(mode, key, val) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction('kv', mode === 'get' ? 'readonly' : 'readwrite');
      const st = tx.objectStore('kv');
      const rq = mode === 'get' ? st.get(key) : mode === 'set' ? st.put(val, key) : st.delete(key);
      tx.oncomplete = () => res(rq.result);
      tx.onerror = () => rej(tx.error);
    });
  }
  async function handle() { if (!supported) return null; try { return (await kv('get', 'dir')) || null; } catch (e) { return null; } }
  async function choose() {
    const h = await window.showDirectoryPicker({ id: 'angielski-kopia', mode: 'readwrite' });
    await kv('set', 'dir', h);
    Store.data.settings.syncFolder = h.name || 'wybrany folder'; Store.save();
    return h;
  }
  async function forget() { try { await kv('del', 'dir'); } catch (e) { } Store.data.settings.syncFolder = ''; Store.save(); }
  async function perm(h, ask) {
    const o = { mode: 'readwrite' };
    let p = await h.queryPermission(o);
    if (p !== 'granted' && ask) p = await h.requestPermission(o);
    return p;
  }
  async function writeFile(dir, name, text) {
    const fh = await dir.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(text); await w.close();
  }
  function payload() {
    const c = JSON.parse(JSON.stringify(Store.data));
    c.settings.apiKey = '';
    c.savedAt = new Date().toISOString();
    return JSON.stringify(c);
  }
  async function write(h) {
    const text = payload();
    await writeFile(h, FILE, text);
    const dir = await h.getDirectoryHandle('kopie', { create: true });
    await writeFile(dir, 'angielski-' + U.dayKey() + '.json', text);
    const names = [];
    for await (const [n, e] of dir.entries()) if (e.kind === 'file' && /^angielski-\d{4}-\d\d-\d\d\.json$/.test(n)) names.push(n);
    names.sort();
    for (const n of names.slice(0, Math.max(0, names.length - 14))) { try { await dir.removeEntry(n); } catch (e) { } }
    Store.data.lastSync = Date.now(); Store.save();
  }
  async function read(h) {
    try { const f = await (await h.getFileHandle(FILE)).getFile(); return JSON.parse(await f.text()); }
    catch (e) { if (e && e.name === 'NotFoundError') return null; throw e; }
  }
  return { supported, handle, choose, forget, perm, write, read };
})();
