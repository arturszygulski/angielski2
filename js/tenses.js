/* Czasy angielskie (11.10.2026): lekcje + zdania do ćwiczeń.
   Format zdania: tekst z jedną luką [podstawa=poprawna/inna poprawna|błędna|błędna|błędna] | polskie tłumaczenie | słowo-sygnał | dlaczego ten czas
   Nowe zdania dopisuj NA KOŃCU danego czasu (numer zdania jest częścią id karty). */
window.TENSES = [
  { id: 'ps', name: 'Present Simple', pl: 'teraźniejszy prosty', lvl: 0,
    when: ['nawyki i rutyna (codziennie, zwykle, nigdy)', 'fakty i prawdy ogólne, prawa nauki', 'stałe sytuacje, rozkłady jazdy, upodobania'],
    form: [['+', 'I work · she works (he/she/it + -s)'], ['−', "I don't work · she doesn't work"], ['?', 'Do you work? · Does she work?']],
    signals: ['every day', 'usually', 'always', 'often', 'sometimes', 'never', 'on Mondays', 'once a week'],
    tip: 'Nie zapominaj o -s w 3. osobie: he works, she goes, it costs. W pytaniach i przeczeniach -s przechodzi na does/doesn\'t.',
    tl: [{ k: 'dots', xs: [12, 26, 40, 54, 68, 82, 94] }], tlNote: 'powtarza się regularnie — w przeszłości, teraz i dalej' },
  { id: 'pc', name: 'Present Continuous', pl: 'teraźniejszy ciągły', lvl: 0,
    when: ['to, co dzieje się teraz, w tej chwili', 'sytuacje tymczasowe (w tym tygodniu, ostatnio)', 'zmieniające się trendy', 'umówione plany na najbliższą przyszłość'],
    form: [['+', "I'm working · she's working · they're working"], ['−', "I'm not working · she isn't working"], ['?', 'Are you working? · Is she working?']],
    signals: ['now', 'right now', 'at the moment', 'Look!', 'Listen!', 'this week', 'these days'],
    tip: 'Czasowniki stanu (know, like, want, understand, need) zwykle NIE mają -ing: I understand, nie „I am understanding”.',
    tl: [{ k: 'bar', x1: 50, x2: 74, wave: true }], tlNote: 'trwa właśnie teraz (i przez chwilę)' },
  { id: 'past', name: 'Past Simple', pl: 'przeszły prosty', lvl: 1,
    when: ['zakończone czynności w konkretnym czasie w przeszłości', 'kolejne zdarzenia w opowiadaniu', 'okresy w przeszłości, które się skończyły'],
    form: [['+', 'I worked · I went (czasowniki nieregularne!)'], ['−', "I didn't work · I didn't go"], ['?', 'Did you work? · Did you go?']],
    signals: ['yesterday', 'last week', 'ago', 'in 2015', 'when I was a child', 'on Monday'],
    tip: 'Po did/didn\'t wraca forma podstawowa: Did you go? (nie „did you went”).',
    tl: [{ k: 'dot', x: 30 }], tlNote: 'jedno zakończone zdarzenie w przeszłości' },
  { id: 'will', name: 'Future Simple (will)', pl: 'przyszły z will', lvl: 1,
    when: ['przewidywania i opinie o przyszłości (I think…, probably)', 'decyzje podjęte w chwili mówienia', 'obietnice, propozycje pomocy'],
    form: [['+', "I'll help · she will help"], ['−', "I won't help (will not)"], ['?', 'Will you help?']],
    signals: ['I think', 'probably', 'I\'m sure', 'tomorrow', 'next year', 'in the future'],
    tip: 'Decyzja teraz → will („Odbiorę!” – I\'ll get it). Plan podjęty wcześniej → going to.',
    tl: [{ k: 'dot', x: 84, dashed: true }], tlNote: 'w przyszłości — przewidywanie albo decyzja z tej chwili' },
  { id: 'going', name: 'Be going to', pl: 'zamiar, plan', lvl: 1,
    when: ['plany i zamiary podjęte wcześniej', 'przewidywanie na podstawie tego, co widać teraz („zaraz spadnie!”)'],
    form: [['+', "I'm going to start · she's going to start"], ['−', "I'm not going to start"], ['?', 'Are you going to start?']],
    signals: ['Look at…!', 'already decided', 'next month', 'this summer', 'I\'ve bought…'],
    tip: 'Widzisz chmury → It\'s going to rain. Masz już bilety → I\'m going to fly to Rome.',
    tl: [{ k: 'arrow', x1: 62, x2: 86 }, { k: 'dot', x: 86 }], tlNote: 'plan istnieje już teraz, realizacja w przyszłości' },
  { id: 'pastc', name: 'Past Continuous', pl: 'przeszły ciągły', lvl: 2,
    when: ['czynność w toku w konkretnym momencie przeszłości', 'dłuższa czynność przerwana krótszą (when + Past Simple)', 'tło opowiadania, dwie czynności naraz (while)'],
    form: [['+', 'I was riding · they were riding'], ['−', "I wasn't riding · they weren't riding"], ['?', 'Were you riding? · Was she riding?']],
    signals: ['when', 'while', 'at 8 p.m. yesterday', 'all morning', 'at that moment'],
    tip: 'Jechałem (był w trakcie) → was riding; zdarzył się wypadek (krótko, nagle) → happened. Polski aspekt niedokonany często = Past Continuous.',
    tl: [{ k: 'bar', x1: 14, x2: 46 }, { k: 'cross', x: 36 }], tlNote: 'długa czynność w przeszłości przerwana krótkim zdarzeniem (×)' },
  { id: 'pp', name: 'Present Perfect', pl: 'teraźniejszy dokonany', lvl: 2,
    when: ['doświadczenia życiowe (ever, never) — bez podawania kiedy', 'przeszłość ze skutkiem teraz (zgubiłem klucze — nie mam ich)', 'stan trwający do teraz (since, for)', 'okres, który jeszcze trwa (today, this month)'],
    form: [['+', "I've finished · she's finished"], ['−', "I haven't finished · she hasn't finished"], ['?', 'Have you finished? · Has she finished?']],
    signals: ['ever', 'never', 'already', 'yet', 'just', 'since', 'for', 'so far', 'this month'],
    tip: 'Polacy często mówią tu czasem teraźniejszym: „Znamy się od 10 lat” = We\'ve known each other for 10 years. Z konkretną datą (yesterday, in 2020) → Past Simple.',
    tl: [{ k: 'dot', x: 28, hollow: true }, { k: 'arrow', x1: 30, x2: 61, dashed: true }], tlNote: 'coś z przeszłości (kiedy — nieważne) ma związek z teraz' },
  { id: 'ppc', name: 'Present Perfect Continuous', pl: 'teraźniejszy dokonany ciągły', lvl: 3,
    when: ['czynność trwa od pewnego czasu do teraz — liczy się, jak długo', 'widoczny skutek długiej czynności (jestem zmęczony, bo…)'],
    form: [['+', "I've been waiting · she's been waiting"], ['−', "I haven't been waiting"], ['?', 'Have you been waiting? · How long have you been…?']],
    signals: ['for an hour', 'since morning', 'How long…?', 'all day', 'lately', 'recently'],
    tip: '„Czekam od godziny” to po angielsku I\'ve been waiting for an hour — nie „I wait” ani „I\'m waiting for an hour”.',
    tl: [{ k: 'bar', x1: 24, x2: 62 }], tlNote: 'trwa od punktu w przeszłości aż do teraz' },
  { id: 'pastp', name: 'Past Perfect', pl: 'zaprzeszły', lvl: 3,
    when: ['czynność wcześniejsza od innej czynności w przeszłości', 'po by the time, already, before, after w opowiadaniu', 'mowa zależna (he said he had…)'],
    form: [['+', "I had left · she'd left"], ['−', "I hadn't left"], ['?', 'Had you left?']],
    signals: ['by the time', 'already', 'before', 'after', 'never… before', 'when we arrived'],
    tip: 'Dwie rzeczy w przeszłości: która była pierwsza? Ta dostaje had + III forma. When we arrived, the train had left = pociąg odjechał wcześniej.',
    tl: [{ k: 'dot', x: 18, label: '1' }, { k: 'dot', x: 42, label: '2' }], tlNote: '1 wydarzyło się przed 2 (oba w przeszłości)' },
  { id: 'futc', name: 'Future Continuous', pl: 'przyszły ciągły', lvl: 3,
    when: ['czynność w toku w konkretnym momencie przyszłości (jutro o tej porze)', 'uprzejme pytania o plany (Will you be using…?)'],
    form: [['+', "I'll be working"], ['−', "I won't be working"], ['?', 'Will you be working?']],
    signals: ['this time tomorrow', 'at 10 a.m. on Monday', 'when you arrive', 'all next year'],
    tip: 'Jutro o tej porze będę leżał na plaży → This time tomorrow I\'ll be lying on the beach.',
    tl: [{ k: 'bar', x1: 72, x2: 96 }, { k: 'tick', x: 84 }], tlNote: 'w danym momencie przyszłości będzie trwać' },
  { id: 'futp', name: 'Future Perfect', pl: 'przyszły dokonany', lvl: 4,
    when: ['coś będzie zakończone przed jakimś momentem w przyszłości (by Friday, by 2030)'],
    form: [['+', "I'll have finished"], ['−', "I won't have finished"], ['?', 'Will you have finished?']],
    signals: ['by Friday', 'by then', 'by the time', 'by 2030', 'in six months'],
    tip: 'Klucz to „by” = do (najpóźniej). By Friday I\'ll have finished = do piątku będzie zrobione.',
    tl: [{ k: 'dot', x: 78 }, { k: 'deadline', x: 90 }], tlNote: 'zakończone przed terminem w przyszłości (|)' }
];
/* Lekcje porównawcze: ćwiczenia mieszają zdania z obu czasów */
window.TENSE_PAIRS = [
  { id: 'ps-pc', a: 'ps', b: 'pc', name: 'Present Simple czy Continuous?', lvl: 0,
    how: ['zawsze / zwykle / regularnie → Simple', 'teraz / w tym tygodniu / tymczasowo → Continuous', 'know, like, want, understand → zwykle Simple'],
    pairs: [['I work from home on Fridays.', 'Pracuję z domu w piątki (zawsze).'], ["I'm working from home this week.", 'W tym tygodniu pracuję z domu (tymczasowo).']] },
  { id: 'past-pastc', a: 'past', b: 'pastc', name: 'Past Simple czy Continuous?', lvl: 2,
    how: ['krótkie, zakończone zdarzenie → Simple', 'tło, czynność w toku → Continuous', 'when + krótka akcja przerywa dłuższą: was doing… when … did'],
    pairs: [['I was riding my bike when the accident happened.', 'Jechałem na rowerze (w trakcie), kiedy zdarzył się wypadek (nagle).'], ['I rode my bike to work yesterday.', 'Wczoraj pojechałem rowerem do pracy (całość, zakończone).']] },
  { id: 'pp-past', a: 'pp', b: 'past', name: 'Present Perfect czy Past Simple?', lvl: 2,
    how: ['jest konkretny czas (yesterday, in 2020, ago) → Past Simple', 'nieważne kiedy, liczy się skutek/doświadczenie → Present Perfect', 'trwa do teraz (since, for) → Present Perfect'],
    pairs: [["I've lost my keys.", 'Zgubiłem klucze (i nadal ich nie mam).'], ['I lost my keys yesterday.', 'Zgubiłem klucze wczoraj (konkretny czas).']] },
  { id: 'will-going', a: 'will', b: 'going', name: 'Will czy going to?', lvl: 1,
    how: ['decyzja w tej chwili, obietnica, opinia → will', 'plan podjęty wcześniej → going to', 'przewidywanie na podstawie tego, co widać → going to'],
    pairs: [["The phone's ringing. — I'll get it!", 'Telefon dzwoni. — Odbiorę! (decyzja teraz)'], ["I'm going to buy a new phone. I've saved the money.", 'Kupię nowy telefon. Odłożyłem pieniądze (plan).']] },
  { id: 'pp-ppc', a: 'pp', b: 'ppc', name: 'Present Perfect czy Continuous?', lvl: 3,
    how: ['ile / rezultat (three books, finished) → Perfect', 'jak długo / sama czynność (for two hours) → Perfect Continuous', 'stany (know, have) → Perfect: I\'ve known him for years'],
    pairs: [["I've read three books this month.", 'Przeczytałem trzy książki (ile, rezultat).'], ["I've been reading all afternoon.", 'Czytam całe popołudnie (jak długo).']] }
];
window.TENSE_RAW = {
ps: `
She [work=works|is working|worked|work] in a bank in Wrocław — it's a permanent job.|Ona pracuje w banku we Wrocławiu — to stała praca.|permanent job|Stały stan, fakt z jej życia → Present Simple; he/she/it dostaje -s.
I usually [get=get|am getting|got|gets] up at six.|Zwykle wstaję o szóstej.|usually|Rutyna (usually) → Present Simple.
Water [boil=boils|is boiling|boiled|boil] at 100 degrees Celsius.|Woda wrze w temperaturze 100 stopni Celsjusza.||Prawda naukowa → Present Simple.
My brother [not like=doesn't like/does not like|isn't liking|don't like|didn't like] coffee.|Mój brat nie lubi kawy.||Upodobania → Present Simple; przeczenie: doesn't + forma podstawowa.
How often [you / go=do you go|are you going|did you go|go you] to the gym?|Jak często chodzisz na siłownię?|How often|Pytanie o częstotliwość → do + you + go.
The train [leave=leaves|is leaving|left|leave] at 7:15 every morning.|Pociąg odjeżdża o 7:15 każdego ranka.|every morning|Rozkład jazdy, powtarzalność → Present Simple.
We never [watch=watch|are watching|watched|watches] TV in the morning.|Nigdy nie oglądamy telewizji rano.|never|Częstotliwość (never) → Present Simple.
The sun [rise=rises|is rising|rose|rise] in the east.|Słońce wschodzi na wschodzie.||Fakt ogólny → Present Simple.
[he / speak=Does he speak|Is he speaking|Do he speak|Did he speaks] German?|Czy on mówi po niemiecku?||Umiejętność, stały stan → Does + he + speak.
My computer [use=uses|is using|used|use] a lot of energy.|Mój komputer zużywa dużo energii.||Ogólna prawda o urządzeniu → Present Simple.
They often [play=play|are playing|played|plays] chess after dinner.|Często grają w szachy po kolacji.|often|Nawyk (often) → Present Simple.
This app [cost=costs|is costing|cost|costing] five euros a month.|Ta aplikacja kosztuje pięć euro miesięcznie.|a month|Stały fakt (cena) → Present Simple.
I [not understand=don't understand/do not understand|am not understanding|doesn't understand|didn't understand] this word.|Nie rozumiem tego słowa.||Understand to czasownik stanu — bez -ing → Present Simple.
She always [check=checks|is checking|checked|check] her email first.|Ona zawsze najpierw sprawdza maila.|always|Rutyna (always) → Present Simple.
Light [travel=travels|is travelling|travelled|travel] faster than sound.|Światło porusza się szybciej niż dźwięk.||Prawo fizyki → Present Simple.
What time [the shop / open=does the shop open|is the shop opening|the shop opens|do the shop open] on Sundays?|O której otwierają sklep w niedziele?|on Sundays|Stały rozkład → does + the shop + open.
`,
pc: `
Look! It [snow=is snowing|snows|snowed|has snowed].|Patrz! Pada śnieg.|Look!|Dzieje się właśnie teraz → is + -ing.
I can't talk now, I [drive=am driving/'m driving|drive|drove|have driven].|Nie mogę teraz rozmawiać, prowadzę.|now|Czynność w tej chwili → am + -ing.
She [work=is working|works|worked|has worked] from home this week.|W tym tygodniu ona pracuje z domu.|this week|Sytuacja tymczasowa → Present Continuous.
Listen, someone [knock=is knocking|knocks|knocked|knock] at the door.|Posłuchaj, ktoś puka do drzwi.|Listen|Dzieje się teraz → Present Continuous.
We [meet=are meeting|meet|met|will meeting] the client tomorrow at ten.|Spotykamy się z klientem jutro o dziesiątej.|tomorrow at ten|Umówione spotkanie w przyszłości → Present Continuous.
Why [you / laugh=are you laughing|do you laugh|you are laughing|did you laughing]?|Dlaczego się śmiejesz?||Pytanie o to, co dzieje się teraz → are + you + -ing.
These days the climate [change=is changing|changes|changed|change] faster than expected.|Obecnie klimat zmienia się szybciej, niż się spodziewano.|These days|Proces w toku, trend → Present Continuous.
I [not watch=am not watching/'m not watching|don't watch|didn't watch|not watching] TV, so you can turn it off.|Nie oglądam telewizji, możesz ją wyłączyć.||Teraz, w tej chwili → Present Continuous.
More and more people [buy=are buying|buy|bought|buys] electric cars.|Coraz więcej ludzi kupuje samochody elektryczne.|More and more|Zmieniający się trend → Present Continuous.
At the moment, the server [update=is updating|updates|updated|update].|W tej chwili serwer się aktualizuje.|At the moment|At the moment = teraz → Present Continuous.
Be quiet, the baby [sleep=is sleeping|sleeps|slept|sleep].|Bądź cicho, dziecko śpi.|Be quiet|Dzieje się teraz → Present Continuous.
I [learn=am learning/'m learning|learn|learned|learns] English these days.|Ostatnio uczę się angielskiego.|these days|Aktualna, tymczasowa sytuacja → Present Continuous.
What [you / do=are you doing|do you do|you do|did you do] right now?|Co teraz robisz?|right now|right now → Present Continuous. (What do you do? = czym się zajmujesz zawodowo)
Prices [rise=are rising|rise|rose|rises] quickly right now, so buy it today.|Ceny teraz szybko rosną, więc kup to dziś.|right now|Trend w okresie, który trwa → Present Continuous.
He [stay=is staying|stays|stayed|stay] at a hotel until he finds a flat.|Mieszka w hotelu, dopóki nie znajdzie mieszkania.|until|Sytuacja tymczasowa → Present Continuous.
The kids [play=are playing|play|played|plays] in the garden now.|Dzieci bawią się teraz w ogrodzie.|now|now → Present Continuous.
`,
past: `
I [visit=visited|was visiting|have visited|visit] Paris last year.|Byłem w Paryżu w zeszłym roku.|last year|Zakończone zdarzenie w określonym czasie (last year) → Past Simple.
She [buy=bought|buyed|has bought|was buying] a new laptop yesterday.|Wczoraj kupiła nowego laptopa.|yesterday|Konkretny czas w przeszłości → Past Simple (buy – bought).
We [not go=didn't go/did not go|haven't gone|weren't going|don't go] out last night.|Wczoraj wieczorem nigdzie nie wychodziliśmy.|last night|Przeczenie w Past Simple: didn't + forma podstawowa.
[you / see=Did you see|Have you seen|Were you seeing|Do you saw] the match on Sunday?|Widziałeś mecz w niedzielę?|on Sunday|Pytanie o konkretny czas → Did + you + see.
Einstein [publish=published|has published|was publishing|publishes] his theory of relativity in 1905.|Einstein opublikował teorię względności w 1905 roku.|in 1905|Data w przeszłości → Past Simple.
The first iPhone [come=came|has come|comed|was coming] out in 2007.|Pierwszy iPhone wyszedł w 2007 roku.|in 2007|Data → Past Simple (come – came).
Two days ago my phone [stop=stopped|has stopped|was stopping|stops] working.|Dwa dni temu mój telefon przestał działać.|ago|ago → Past Simple.
When I was a child, I [live=lived|have lived|am living|live] in Gdańsk.|Kiedy byłem dzieckiem, mieszkałem w Gdańsku.|When I was a child|Zakończony okres w przeszłości → Past Simple.
He [lose=lost|has lost|losed|was losing] his keys last week.|Zgubił klucze w zeszłym tygodniu.|last week|Konkretny czas → Past Simple (lose – lost).
What time [you / get=did you get|have you got|were you getting|you got] home yesterday?|O której wróciłeś wczoraj do domu?|yesterday|Pytanie o czas w przeszłości → did + you + get.
The meeting on Monday [take=took|has taken|was taking|taked] two hours.|Poniedziałkowe spotkanie trwało dwie godziny.|on Monday|Zakończone wydarzenie → Past Simple (take – took).
I [send=sent|have sent|was sending|sended] you the file an hour ago.|Wysłałem ci plik godzinę temu.|ago|ago → Past Simple (send – sent).
They [build=built|have built|are building|builded] this bridge in the 1930s.|Ten most zbudowano w latach 30.|in the 1930s|Okres w przeszłości → Past Simple (build – built).
We [have=had|have had|are having|haved] a great time at the party on Saturday.|Świetnie się bawiliśmy na sobotniej imprezie.|on Saturday|Zakończone wydarzenie → Past Simple (have – had).
She [not understand=didn't understand/did not understand|doesn't understand|hasn't understood|wasn't understanding] the question at first.|Na początku nie zrozumiała pytania.|at first|Przeszłość, przeczenie → didn't + understand.
Alexander Fleming [discover=discovered|has discovered|was discovering|discover] penicillin in 1928.|Aleksander Fleming odkrył penicylinę w 1928 roku.|in 1928|Data → Past Simple.
`,
will: `
I think it [rain=will rain|is raining|rains|rained] tomorrow.|Myślę, że jutro będzie padać.|I think|Przewidywanie, opinia (I think) → will.
Don't worry, I [help=will help/'ll help|help|helped|am help] you with the boxes.|Nie martw się, pomogę ci z pudłami.|Don't worry|Spontaniczna obietnica pomocy → will.
The phone is ringing. — I [get=will get/'ll get|get|got|am get] it!|Telefon dzwoni. — Odbiorę!||Decyzja w chwili mówienia → will.
In the future, robots [do=will do|do|are doing|did] many boring jobs.|W przyszłości roboty będą wykonywać wiele nudnych prac.|In the future|Przewidywanie → will.
I promise I [not tell=won't tell/will not tell|don't tell|am not telling|didn't tell] anyone.|Obiecuję, że nikomu nie powiem.|I promise|Obietnica → won't (will not).
I'm sure you [pass=will pass|pass|are passing|passed] the exam.|Jestem pewien, że zdasz egzamin.|I'm sure|Przekonanie o przyszłości → will.
Wait, I [open=will open/'ll open|open|opened|have opened] the window for you.|Poczekaj, otworzę ci okno.|Wait|Spontaniczna oferta pomocy → will.
Perhaps we [find=will find|find|are finding|found] life on Mars one day.|Może kiedyś znajdziemy życie na Marsie.|one day|Przewidywanie (perhaps, one day) → will.
I'm tired. I think I [go=will go/'ll go|go|went|have gone] to bed.|Jestem zmęczony. Chyba pójdę spać.|I think|Decyzja podjęta teraz → will.
Do you think AI [replace=will replace|replaces|replaced|has replaced] teachers one day?|Myślisz, że AI kiedyś zastąpi nauczycieli?|Do you think|Pytanie o opinię na temat przyszłości → will.
It's late — I [call=will call/'ll call|call|called|have called] you tomorrow.|Jest późno — zadzwonię do ciebie jutro.|tomorrow|Decyzja/obietnica → will.
I don't think she [come=will come|comes|came|has come] to the party tomorrow.|Nie sądzę, żeby jutro przyszła na imprezę.|I don't think|Przewidywanie → will.
If you press this button, the machine [stop=will stop|would stop|stopped|has stopped].|Jeśli naciśniesz ten przycisk, maszyna się zatrzyma.|If|Pierwszy okres warunkowy: if + teraźniejszy, potem will.
Prices [go=will go|go|went|have gone] up again next year.|Ceny znowu pójdą w górę w przyszłym roku.|next year|Przewidywanie (next year) → will.
`,
going: `
Look at those clouds! It [rain=is going to rain|will rain|rains|rained].|Spójrz na te chmury! Będzie padać.|Look at those clouds|Przewidywanie na podstawie tego, co widać → going to.
We [buy=are going to buy|will buy|buy|bought] a new car next month — we've already chosen the model.|Kupimy nowy samochód w przyszłym miesiącu — już wybraliśmy model.|already chosen|Plan podjęty wcześniej → going to.
I [start=am going to start/'m going to start|will start|start|started] running next week. I've bought new shoes.|Od przyszłego tygodnia zacznę biegać. Kupiłem nowe buty.|I've bought|Zamiar z przygotowaniem → going to.
What [you / do=are you going to do|will you do|do you do|did you do] after you graduate?|Co zamierzasz robić po studiach?||Pytanie o plany i zamiary → going to.
She [not apply=isn't going to apply/is not going to apply|won't apply|doesn't apply|didn't apply] for that job. She's decided.|Nie zamierza aplikować na to stanowisko. Zdecydowała.|She's decided|Decyzja podjęta wcześniej → going to.
Careful! You [drop=are going to drop|will drop|drop|dropped] that glass!|Uważaj! Zaraz upuścisz tę szklankę!|Careful!|Widać, że zaraz to się stanie → going to.
They [get=are going to get|will get|get|got] married in June — they've already booked the venue.|W czerwcu biorą ślub — już zarezerwowali salę.|already booked|Plan → going to.
He's saved enough money. He [travel=is going to travel|will travel|travels|travelled] around Asia.|Odłożył wystarczająco pieniędzy. Zamierza podróżować po Azji.|He's saved|Zamiar z przygotowaniem → going to.
The company [launch=is going to launch|will launch|launches|launched] a new app this autumn — it's in the plan.|Firma wypuści nową aplikację tej jesieni — jest to w planie.|it's in the plan|Plan → going to.
The bus is full. We [not get=aren't going to get/are not going to get|won't get|don't get|didn't get] on.|Autobus jest pełny. Nie wsiądziemy.|The bus is full|Widać, że to się nie uda → going to.
I [learn=am going to learn/'m going to learn|will learn|learn|learned] to code this year. I've signed up for a course.|W tym roku nauczę się programować. Zapisałem się na kurs.|I've signed up|Plan z przygotowaniem → going to.
Turn off the oven! The cake [burn=is going to burn|will burn|burns|burned]!|Wyłącz piekarnik! Ciasto się spali!|Turn off the oven!|Widać, że zaraz się stanie → going to.
`,
pastc: `
I [ride=was riding|rode|am riding|have ridden] my bike when the accident happened.|Jechałem na rowerze, kiedy zdarzył się wypadek.|when|Dłuższa czynność w toku (was riding) przerwana krótszą (happened) → Past Continuous.
While I [cook=was cooking|cooked|am cooking|have cooked], the power went off.|Kiedy gotowałem, wyłączyli prąd.|While|while + czynność w toku → Past Continuous.
At 8 p.m. yesterday we [watch=were watching|watched|are watching|have watched] a film.|Wczoraj o 20:00 oglądaliśmy film.|At 8 p.m. yesterday|Czynność w toku w konkretnym momencie przeszłości → Past Continuous.
She [talk=was talking|talked|is talking|has talked] on the phone when the boss came in.|Rozmawiała przez telefon, kiedy wszedł szef.|when|Czynność w toku przerwana (came in) → Past Continuous.
What [you / do=were you doing|did you do|are you doing|have you done] at ten o'clock last night?|Co robiłeś wczoraj o dziesiątej wieczorem?|at ten o'clock last night|Pytanie o czynność w toku w danym momencie → were + you + -ing.
It [rain=was raining|rained|is raining|has rained] when we left the house.|Padało, kiedy wychodziliśmy z domu.|when|Tło w toku w chwili zdarzenia → Past Continuous.
The sun [shine=was shining|shone|is shining|shines] and the birds were singing.|Świeciło słońce i śpiewały ptaki.|were singing|Opis tła w opowiadaniu → Past Continuous.
I [not listen=wasn't listening/was not listening|didn't listen|am not listening|haven't listened] when the teacher explained the rule.|Nie słuchałem, kiedy nauczyciel tłumaczył zasadę.|when|Czynność (nie) w toku w chwili zdarzenia → Past Continuous.
While the engineers [test=were testing|tested|are testing|have tested] the system, it crashed.|Kiedy inżynierowie testowali system, ten się zawiesił.|While|while + czynność w toku → Past Continuous.
He [drive=was driving|drove|drives|has driven] too fast when the police stopped him.|Jechał za szybko, kiedy zatrzymała go policja.|when|Czynność w toku przerwana (stopped) → Past Continuous.
We met while we [study=were studying|studied|are studying|have studied] in Kraków.|Poznaliśmy się, kiedy studiowaliśmy w Krakowie.|while|while + dłuższy okres w toku → Past Continuous.
[it / snow=Was it snowing|Did it snow|Is it snowing|Has it snowed] when you woke up?|Czy padał śnieg, kiedy się obudziłeś?|when|Tło w toku w chwili zdarzenia → Was + it + -ing.
I [walk=was walking|walked|walk|have walked] home when I saw a fox.|Szedłem do domu, kiedy zobaczyłem lisa.|when|Czynność w toku + krótkie zdarzenie → Past Continuous.
At midnight they [still / work=were still working|still worked|are still working|have still worked] on the project.|O północy wciąż pracowali nad projektem.|At midnight|Czynność w toku w konkretnym momencie → Past Continuous.
The phone rang while she [have=was having|had|is having|has had] a shower.|Telefon zadzwonił, kiedy brała prysznic.|while|while + czynność w toku → Past Continuous.
Everyone [wait=was waiting|waited|is waiting|has waited] for the results when the screen went black.|Wszyscy czekali na wyniki, kiedy ekran zgasł.|when|Czynność w toku przerwana (went black) → Past Continuous.
`,
pp: `
I [already / finish=have already finished/'ve already finished|already finish|am already finishing|was already finishing] the report.|Już skończyłem raport.|already|Skutek teraz, bez podanego czasu (already) → Present Perfect.
Have you ever [be=been|was|be|being] to Japan?|Byłeś kiedyś w Japonii?|ever|Doświadczenie życiowe (ever) → have + been.
She [live=has lived|lives|lived|is living] here since 2015.|Mieszka tu od 2015 roku.|since|since + punkt w czasie, trwa do teraz → Present Perfect.
We [know=have known|know|knew|are knowing] each other for ten years.|Znamy się od dziesięciu lat.|for|for + okres, trwa do teraz → Present Perfect (po polsku czas teraźniejszy!).
I [never / see=have never seen/'ve never seen|never see|am never seeing|was never seeing] such a beautiful sunset.|Nigdy nie widziałem tak pięknego zachodu słońca.|never|Doświadczenie (nigdy w życiu) → Present Perfect.
[you / finish=Have you finished|Do you finish|Are you finishing|Were you finishing] your homework yet?|Skończyłeś już pracę domową?|yet|yet w pytaniach → Present Perfect.
Oh no, I [lose=have lost/'ve lost|lose|am losing|was losing] my wallet! I can't find it anywhere.|O nie, zgubiłem portfel! Nie mogę go nigdzie znaleźć.|I can't find it|Skutek widoczny teraz → Present Perfect.
They [not reply=haven't replied/have not replied|didn't reply|don't reply|aren't replying] to my email yet.|Jeszcze nie odpisali na mojego maila.|yet|yet w przeczeniach → Present Perfect.
Scientists [discover=have discovered|discover|are discovering|were discovering] a new planet — it's in today's news.|Naukowcy odkryli nową planetę — to dzisiejsza wiadomość.|today's news|Świeża wiadomość, skutek teraz → Present Perfect.
How long [you / have=have you had|do you have|are you having|you have] this phone?|Od jak dawna masz ten telefon?|How long|How long + stan trwający do teraz → Present Perfect.
I [just / send=have just sent/'ve just sent|just send|am just sending|was just sending] you the link.|Właśnie wysłałem ci link.|just|just = przed chwilą → Present Perfect.
This is the best film I [ever / see=have ever seen/'ve ever seen|ever see|am ever seeing|was ever seeing].|To najlepszy film, jaki kiedykolwiek widziałem.|ever|Stopień najwyższy + ever → Present Perfect.
The company [grow=has grown|grows|is growing|was growing] a lot since it started.|Firma bardzo urosła, odkąd zaczęła działać.|since|since + trwa do teraz → Present Perfect.
I [read=have read/'ve read|was reading|am reading|reads] three books this month.|W tym miesiącu przeczytałem trzy książki.|this month|Okres, który jeszcze trwa (this month) → Present Perfect.
She [work=has worked|works|is working|was working] for Google for five years and still loves it.|Pracuje dla Google od pięciu lat i nadal to uwielbia.|for|for + trwa do teraz (still) → Present Perfect.
My internet [stop=has stopped|stops|is stopping|was stopping] working — can you check it?|Internet przestał mi działać — możesz sprawdzić?|can you check it|Skutek teraz → Present Perfect.
`,
ppc: `
I [wait=have been waiting/'ve been waiting|am waiting|waited|wait] for you for an hour!|Czekam na ciebie od godziny!|for an hour|Trwa od pewnego czasu do teraz, liczy się długość → Present Perfect Continuous.
She's tired because she [work=has been working|is working|worked|works] all day.|Jest zmęczona, bo pracowała cały dzień.|all day|Widoczny skutek długiej czynności → Present Perfect Continuous.
How long [you / learn=have you been learning|are you learning|do you learn|did you learn] English?|Od jak dawna uczysz się angielskiego?|How long|How long + czynność trwająca do teraz → Present Perfect Continuous.
It [rain=has been raining|is raining|rains|rained] since this morning.|Pada od rana.|since|since + czynność trwająca do teraz → Present Perfect Continuous.
We [develop=have been developing|are developing|developed|develop] this app for two years.|Rozwijamy tę aplikację od dwóch lat.|for|for + czynność trwająca do teraz → Present Perfect Continuous.
Your eyes are red. [you / cry=Have you been crying|Are you crying|Do you cry|Did you cried]?|Masz czerwone oczy. Płakałeś?|Your eyes are red|Widoczny skutek czynności → Present Perfect Continuous.
I [not sleep=haven't been sleeping/have not been sleeping|am not sleeping|don't sleep|wasn't sleep] well lately.|Ostatnio źle sypiam.|lately|lately + czynność powtarzająca się do teraz → Present Perfect Continuous.
They [argue=have been arguing|are arguing|argue|argued] about it for weeks.|Kłócą się o to od tygodni.|for weeks|for + czynność trwająca do teraz → Present Perfect Continuous.
He [play=has been playing|is playing|plays|played] the guitar since he was ten.|Gra na gitarze, odkąd skończył dziesięć lat.|since|since + czynność trwająca do teraz → Present Perfect Continuous.
The servers [run=have been running|are running|run|ran] non-stop for three months.|Serwery działają bez przerwy od trzech miesięcy.|for three months|for + trwa do teraz → Present Perfect Continuous.
Sorry I'm dirty — I [fix=have been fixing/'ve been fixing|am fixing|fix|was fix] my bike.|Przepraszam, że jestem brudny — naprawiałem rower.|I'm dirty|Widoczny skutek czynności → Present Perfect Continuous.
Researchers [study=have been studying|are studying|study|studied] this virus since 2020.|Naukowcy badają ten wirus od 2020 roku.|since|since + trwa do teraz → Present Perfect Continuous.
`,
pastp: `
When I arrived, the film [already / start=had already started|already starts|has already started|was already starting].|Kiedy dotarłem, film już się zaczął.|already|Czynność wcześniejsza od innej w przeszłości → Past Perfect.
She [never / fly=had never flown|never flies|has never flown|was never flying] before her trip to Canada.|Przed wyjazdem do Kanady nigdy nie leciała samolotem.|before|Doświadczenie przed momentem w przeszłości → Past Perfect.
By the time the police came, the thief [escape=had escaped|escapes|has escaped|was escaping].|Zanim przyjechała policja, złodziej już uciekł.|By the time|by the time + wcześniejsza czynność → Past Perfect.
I didn't recognise him because he [change=had changed|changes|has changed|was changing] so much.|Nie poznałem go, bo bardzo się zmienił.|because|Zmiana nastąpiła wcześniej niż spotkanie → Past Perfect.
We [not eat=hadn't eaten/had not eaten|haven't eaten|don't eat|weren't eat] anything all day, so we were very hungry.|Nie jedliśmy nic cały dzień, więc byliśmy bardzo głodni.|so we were|Wcześniej niż „byliśmy głodni” → Past Perfect.
After she [finish=had finished/finished|has finished|was finishing|finishes] her degree, she moved to Berlin.|Kiedy skończyła studia, przeprowadziła się do Berlina.|After|Wcześniejsza z dwóch czynności → Past Perfect (po after można też Past Simple).
[you / ever / see=Had you ever seen|Have you ever seen|Do you ever see|Were you ever seeing] snow before you moved to Norway?|Czy widziałeś kiedyś śnieg, zanim przeprowadziłeś się do Norwegii?|before you moved|Doświadczenie przed momentem w przeszłości → Past Perfect.
The laptop didn't work because I [forget=had forgotten|forget|have forgotten|was forgetting] to charge it.|Laptop nie działał, bo zapomniałem go naładować.|because|Zapomniałem wcześniej → Past Perfect.
He told me he [lose=had lost/lost|has lost|loses|was losing] his job.|Powiedział mi, że stracił pracę.|He told me|Mowa zależna — czas cofa się → Past Perfect.
When we got to the station, the train [leave=had left|has left|leaves|is leaving].|Kiedy dotarliśmy na dworzec, pociąg już odjechał.|When we got|Pociąg odjechał wcześniej niż my dotarliśmy → had left.
I realised I [meet=had met|have met|meet|was meeting] her before.|Zdałem sobie sprawę, że już ją wcześniej spotkałem.|before|Spotkanie było przed uświadomieniem → Past Perfect.
The scientists [work=had worked|have worked|work|are working] on the vaccine for years before it was approved.|Naukowcy pracowali nad szczepionką latami, zanim ją zatwierdzono.|before|Wcześniejszy okres przed zdarzeniem w przeszłości → Past Perfect.
`,
futc: `
This time tomorrow I [lie=will be lying/'ll be lying|will lie|am lying|lie] on a beach in Spain.|Jutro o tej porze będę leżał na plaży w Hiszpanii.|This time tomorrow|Czynność w toku w momencie przyszłości → will be + -ing.
Don't call at eight — we [have=will be having/'ll be having|have had|had|have] dinner.|Nie dzwoń o ósmej — będziemy jeść kolację.|at eight|W tym momencie przyszłości czynność będzie trwać → Future Continuous.
At 10 a.m. on Monday, I [fly=will be flying/'ll be flying|have flown|fly|flew] to London.|W poniedziałek o 10 rano będę leciał do Londynu.|At 10 a.m. on Monday|Czynność w toku o konkretnej godzinie → Future Continuous.
[you / use=Will you be using|Are you use|Do you using|Did you use] the car tonight? I'd like to borrow it.|Będziesz dziś wieczorem korzystać z samochodu? Chciałbym go pożyczyć.|tonight|Uprzejme pytanie o plany → Will you be + -ing?
When you arrive, I [wait=will be waiting/'ll be waiting|am wait|wait|waited] for you at the gate.|Kiedy przyjedziesz, będę na ciebie czekać przy wyjściu.|When you arrive|Czynność w toku w chwili przyjazdu → Future Continuous.
Next week at this time, they [move=will be moving|will move|move|moved] into their new house.|W przyszłym tygodniu o tej porze będą się wprowadzać do nowego domu.|at this time|Czynność w toku w momencie przyszłości → Future Continuous.
The rover [explore=will be exploring|explores|explored|has explored] the surface of Mars all next year.|Łazik będzie badał powierzchnię Marsa przez cały przyszły rok.|all next year|Czynność trwająca przez okres w przyszłości → Future Continuous.
At midnight tonight, the system [update=will be updating|updates|updated|has updated] automatically.|Dziś o północy system będzie się automatycznie aktualizował.|At midnight tonight|Czynność w toku o konkretnej godzinie → Future Continuous.
`,
futp: `
By 2030, scientists [find=will have found|find|found|have found] a cure, I hope.|Mam nadzieję, że do 2030 roku naukowcy znajdą lekarstwo.|By 2030|by + termin w przyszłości → will have + III forma.
By the time you get home, I [cook=will have cooked/'ll have cooked|cook|cooked|have cooked] dinner.|Zanim wrócisz do domu, ugotuję obiad.|By the time|Zakończone przed momentem w przyszłości → Future Perfect.
I [finish=will have finished/'ll have finished|finish|finished|have finished] the report by Friday.|Skończę raport do piątku.|by Friday|by + termin → Future Perfect.
Next month we [be=will have been|are|were|have been] married for ten years.|W przyszłym miesiącu minie dziesięć lat od naszego ślubu.|for ten years|Ile czasu minie do momentu w przyszłości → Future Perfect.
[you / finish=Will you have finished|Have you finished|Did you finish|Do you finish] the project by the end of the year?|Czy skończysz projekt do końca roku?|by the end of the year|by + termin → Will you have + III forma?
By the time the train arrives, we [wait=will have waited|wait|waited|have waited] for two hours.|Zanim przyjedzie pociąg, będziemy czekać już dwie godziny.|By the time|Ile czasu minie do momentu w przyszłości → Future Perfect.
She [not leave=won't have left/will not have left|doesn't leave|didn't leave|hasn't left] by then, so you can still catch her.|Do tego czasu jeszcze nie wyjdzie, więc zdążysz ją złapać.|by then|by then + (nie) zakończone → Future Perfect.
By 2050, electric cars [replace=will have replaced|replace|replaced|have replaced] most petrol cars.|Do 2050 roku samochody elektryczne zastąpią większość aut benzynowych.|By 2050|by + termin → Future Perfect.
In six months, I [save=will have saved/'ll have saved|save|saved|have saved] enough money for a new laptop.|Za pół roku odłożę dość pieniędzy na nowego laptopa.|In six months|Zakończone przed momentem w przyszłości → Future Perfect.
`
};
