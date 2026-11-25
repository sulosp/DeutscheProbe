import type { Item, MockExam, Teil } from "@/lib/exam-model";
import { BRIAN, INGRID, JAN, JONAS, LENI, NARRATOR, TANJA } from "@/content/exams/voices";
import { dialogue, mc, narrate, rf } from "@/content/exams/factory";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";

const word = (n: number, prompt: string, correct: string, points: number, explanation: string, type: Item["type"] = "match"): Item => ({
  id: `tb2-l-${n}`,
  number: n,
  type,
  prompt,
  correct,
  points,
  explanation,
});

const headlines = ["a Forschung ohne Tiere", "b Wohnen auf dem Land", "c Bahn statt Flug", "d Schulen im Wandel", "e Festival abgesagt", "f Löhne in der Pflege", "g Bibliothek rund um die Uhr", "h Streit um Windräder", "i Neue Klinik", "j Verein sucht Trainer"].map((line) => ({ id: line[0], label: line }));

const lesen1: Teil = {
  id: "tb2-lesen-1",
  number: 1,
  title: "Globalverstehen",
  maxRaw: 25,
  instruction: "Welche Überschrift passt? Aufgaben 1 bis 5.",
  options: headlines,
  stimuli: [
    ["Eine Forschungsgruppe arbeitet nur mit Zellkulturen, nicht mit Tieren.", "a"],
    ["Immer mehr Menschen ziehen aus der teuren Stadt in Dörfer mit Bahnanschluss.", "b"],
    ["Die Nachtzüge nach Wien sind ausgebucht. Flüge auf dieser Strecke gehen zurück.", "c"],
    ["Eine Schule ersetzt Noten in den ersten Jahren durch Gespräche.", "d"],
    ["Das Open-Air wurde abgesagt, die Karten werden zurückgezahlt.", "e"],
  ].map(([body], index) => ({ kind: "text" as const, id: `tb2-t-${index + 1}`, title: `Text ${index + 1}`, body, genre: "article" as const })),
  items: ["a", "b", "c", "d", "e"].map((correct, index) => word(index + 1, `Text ${index + 1}`, correct, 5, `Überschrift ${correct}.`)),
};

const lesen2: Teil = {
  id: "tb2-lesen-2",
  number: 2,
  title: "Detailverstehen",
  maxRaw: 25,
  instruction: "Zwei kurze Artikel. Aufgaben 6 bis 10.",
  stimuli: [
    { kind: "text", id: "tb2-a", title: "Nachtzüge", body: "Die neue Linie fährt dreimal pro Woche, nicht täglich. Ein Bett kostet ab 80 Euro. Das Essen ist nicht im Preis. Kinder unter 6 fahren frei. Die Fahrt dauert neun Stunden.", genre: "article" },
    { kind: "text", id: "tb2-b", title: "Windräder", body: "Der Gemeinderat hat den Bau von vier Anlagen abgelehnt, nicht genehmigt. Grund ist der Lärm in der Nacht. Tagsüber wäre eine Mehrheit möglich gewesen. Eine kleinere Anlage am Hafen bleibt im Gespräch.", genre: "article" },
  ],
  items: [
    mc("tb2-l-6", 6, "Wie oft fährt der Nachtzug?", [{ id: "a", label: "täglich" }, { id: "b", label: "dreimal pro Woche" }, { id: "c", label: "einmal im Monat" }], "b", "Dreimal pro Woche."),
    mc("tb2-l-7", 7, "Was kostet ein Bett mindestens?", [{ id: "a", label: "60 Euro" }, { id: "b", label: "80 Euro" }, { id: "c", label: "120 Euro" }], "b", "Ab 80 Euro."),
    mc("tb2-l-8", 8, "Ist das Essen im Preis?", [{ id: "a", label: "ja" }, { id: "b", label: "nein" }, { id: "c", label: "nur für Kinder" }], "b", "Das Essen ist nicht im Preis."),
    mc("tb2-l-9", 9, "Was hat der Rat entschieden?", [{ id: "a", label: "vier Anlagen abgelehnt" }, { id: "b", label: "vier Anlagen genehmigt" }, { id: "c", label: "noch nichts" }], "a", "Abgelehnt wegen Lärm in der Nacht."),
    mc("tb2-l-10", 10, "Was bleibt möglich?", [{ id: "a", label: "eine kleinere Anlage am Hafen" }, { id: "b", label: "zehn Anlagen im Wald" }, { id: "c", label: "gar nichts" }], "a", "Die kleinere Anlage am Hafen bleibt im Gespräch."),
  ].map((item) => ({ ...item, points: 5 })),
};

const ads = "abcdefghijkl".split("").map((id, index) => ({
  id,
  label: `${id} ${["Debatte im Rathaus", "Stipendium", "Fahrradcodierung", "Elternabend", "Blutspende", "Stadtarchiv", "Chorprobe", "Energieberatung", "Flohmarkt", "Sprachmittlung", "Seniorentreff", "Kletterhalle"][index]}`,
}));

const lesen3: Teil = {
  id: "tb2-lesen-3",
  number: 3,
  title: "Selektives Verstehen",
  maxRaw: 25,
  allowNone: true,
  noneLabel: "x – kein Text",
  instruction: "Welche Information passt? Aufgaben 11 bis 20.",
  options: ads,
  stimuli: ads.map((ad) => ({ kind: "text" as const, id: `tb2-ad-${ad.id}`, title: ad.label, body: ad.label, genre: "ad" as const })),
  items: [
    ["11", "an einer politischen Diskussion teilnehmen", "a"],
    ["12", "Geld für ein Studium finden", "b"],
    ["13", "das Fahrrad kennzeichnen lassen", "c"],
    ["14", "mit Lehrkräften über die Klasse sprechen", "d"],
    ["15", "Blut spenden", "e"],
    ["16", "alte Akten der Stadt lesen", "f"],
    ["17", "im Chor singen", "g"],
    ["18", "den Stromverbrauch senken", "h"],
    ["19", "gebrauchte Dinge verkaufen", "i"],
    ["20", "einen Segelkurs buchen", "0"],
  ].map(([n, prompt, correct]) => word(Number(n), prompt, correct, 2.5, "Die Zuordnung folgt der Anzeige.")),
};

const grammarItems: Item[] = [
  ["21", "obwohl"], ["22", "dennoch"], ["23", "damit"], ["24", "dessen"], ["25", "worauf"],
  ["26", "indem"], ["27", "sofern"], ["28", "anstatt"], ["29", "weder"], ["30", "je"],
].map(([number, word], index) => {
  const options = [
    { id: "a", label: word },
    { id: "b", label: ["weil", "trotzdem", "dass", "deren", "wohin", "während", "falls", "ohne", "entweder", "desto"][index] },
    { id: "c", label: ["wenn", "jedoch", "ob", "dem", "wobei", "bevor", "bis", "statt", "sowohl", "umso"][index] },
  ];
  return {
    id: `tb2-g-${number}`,
    number: Number(number),
    type: "gapMc" as const,
    prompt: `Lücke ${number}`,
    options,
    correct: "a",
    points: 1.5,
    explanation: `In diesem Satz steht „${word}“.`,
  };
});

const bank = "hingegen,folglich,zudem,insofern,vielmehr,keineswegs,mithin,immerhin,jedenfalls,ohnehin,gleichwohl,insbesondere,gewissermaßen,nichtsdestotrotz,demzufolge"
  .split(",")
  .map((entry, index) => ({ id: String.fromCharCode(97 + index), label: `${String.fromCharCode(97 + index)} ${entry}` }));

const sb: Teil[] = [
  {
    id: "tb2-sb-1",
    number: 1,
    title: "Grammatik",
    maxRaw: 15,
    instruction: "Wählen Sie die passende Form. Aufgaben 21 bis 30.",
    stimuli: [{ kind: "text", id: "tb2-g", title: "Kommentar", body: "Der Vorschlag ist umstritten, [21] viele ihn unterstützen. [22] bleibt der Rat vorsichtig, [23] niemand übergangen wird. Das Gutachten, [24] Ergebnis noch fehlt, wird [25] man sich beziehen wird, erst nächste Woche vorgelegt. Man spart Energie, [26] man die Heizung senkt, [27] das Haus gedämmt ist. [28] zu klagen, sucht die Initiative das Gespräch. [29] die Stadt [30] länger wartet, desto teurer wird der Umbau.", genre: "article" }],
    items: grammarItems,
  },
  {
    id: "tb2-sb-2",
    number: 2,
    title: "Lexik",
    maxRaw: 15,
    instruction: "Wortbank, Aufgaben 31 bis 40. Nicht alle Wörter passen.",
    options: bank,
    stimuli: [{ kind: "text", id: "tb2-lex", title: "Kommentar", body: "Die einen wollen bauen, [31] die anderen wollen warten. [32] steigen die Kosten. [33] fehlt ein Gutachten. [34] ist Eile geboten. [35] hilft ein Aufschub nicht. [36] ist der Plan nicht vom Tisch. [37] lohnt sich die Dämmung. [38] betrifft das die Mieten. [39] bleibt ein Kompromiss möglich. [40] muss der Rat in diesem Monat entscheiden.", genre: "article" }],
    items: ["a", "b", "c", "e", "f", "h", "i", "l", "n", "o"].map((correct, index) => ({
      id: `tb2-x-${31 + index}`,
      number: 31 + index,
      type: "gapBank" as const,
      prompt: `Lücke ${31 + index}`,
      correct,
      points: 1.5,
      explanation: "Ein Wort aus der Bank passt. Fünf Wörter bleiben übrig.",
    })),
  },
];

const once = { plays: 1 as const, readSeconds: 8, betweenPlaysSeconds: 0, answerSeconds: 8 };

const hoeren: Teil[] = [
  {
    id: "tb2-hoeren-1",
    number: 1,
    title: "Nachrichten",
    maxRaw: 25,
    instruction: "Eine Nachrichtensendung, nur einmal. Aufgaben 41 bis 45.",
    introAudio: narrate("tb2-h-t1-intro", ["Teil 1.", "Sie hören Nachrichten.", "Sie hören die Texte nur einmal."]),
    stimuli: [
      ["41", JAN, "Politik aus der Region. Der Stadtrat vertagt die Entscheidung über die Windräder auf den Juni."],
      ["42", LENI, "Bahn. Die Nachtzüge nach Wien sind für August bereits ausgebucht."],
      ["43", INGRID, "Kultur. Das Open-Air findet statt, nur das Rahmenprogramm entfällt."],
      ["44", JONAS, "Arbeit. Die Pflegekräfte erhalten ab Juli drei Prozent mehr Lohn, nicht fünf."],
      ["45", TANJA, "Bildung. Die Bibliothek testet einen Zugang rund um die Uhr, vorerst nur für Studierende."],
    ].map(([n, who, text]) => ({
      kind: "audio" as const,
      id: `tb2-h-${n}`,
      itemIds: [`tb2-h-${n}`],
      audio: dialogue(`tb2-h-${n}`, [who as typeof JAN], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof JAN, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...once, situation: "Sie hören die Nachrichten im Radio.", scene: "radio", readCue: `Meldung ${n}.` }),
    })),
    items: [
      rf("tb2-h-41", 41, "Der Rat hat die Windräder schon genehmigt.", "falsch", "Die Entscheidung ist auf Juni vertagt."),
      rf("tb2-h-42", 42, "Die Nachtzüge im August sind ausgebucht.", "richtig", "Für August bereits ausgebucht."),
      rf("tb2-h-43", 43, "Das Open-Air wurde ganz abgesagt.", "falsch", "Es findet statt, nur das Rahmenprogramm entfällt."),
      rf("tb2-h-44", 44, "Der Lohn steigt um fünf Prozent.", "falsch", "Um drei Prozent, nicht um fünf."),
      rf("tb2-h-45", 45, "Alle können die Bibliothek nachts nutzen.", "falsch", "Vorerst nur Studierende."),
    ].map((item) => ({ ...item, points: 5 })),
  },
  {
    id: "tb2-hoeren-2",
    number: 2,
    title: "Interview",
    maxRaw: 25,
    instruction: "Ein Interview, nur einmal. Aufgaben 46 bis 55.",
    introAudio: narrate("tb2-h-t2-intro", ["Teil 2.", "Sie hören ein Interview.", "Sie hören es nur einmal."]),
    endAudio: narrate("tb2-h-t2-ende", ["Ende von Teil 2."]),
    stimuli: [{
      kind: "audio",
      id: "tb2-h-t2",
      itemIds: Array.from({ length: 10 }, (_, i) => `tb2-h-${46 + i}`),
      audio: dialogue("tb2-h-t2", [BRIAN, INGRID], [
        { who: BRIAN, text: "Sie leiten das Stadtarchiv. Seit wann ist das eigentlich digital?" },
        { who: INGRID, text: "Seit drei Jahren, nicht seit zehn. Etwa die Hälfte der Akten ist online." },
        { who: BRIAN, text: "Und kostet die Nutzung etwas?" },
        { who: INGRID, text: "Für Privatleute nichts. Firmen zahlen eine Gebühr." },
        { who: BRIAN, text: "Darf man alles fotografieren?" },
        { who: INGRID, text: "Nein. Personenakten erst nach achtzig Jahren, nicht nach dreißig." },
        { who: BRIAN, text: "Wie viele Leute arbeiten bei Ihnen?" },
        { who: INGRID, text: "Zwölf, davon vier in Teilzeit. Wir suchen noch eine Fachkraft." },
        { who: BRIAN, text: "Und samstags, ist da geöffnet?" },
        { who: INGRID, text: "Nur der erste Samstag im Monat, von zehn bis eins." },
      ], { ...once, readSeconds: 20, answerSeconds: 12, situation: "Sie hören ein Interview im Kulturmagazin.", scene: "radio" }),
    }],
    items: [
      ["46", "Das Archiv ist seit zehn Jahren digital.", "falsch"],
      ["47", "Etwa die Hälfte der Akten ist online.", "richtig"],
      ["48", "Privatleute zahlen eine Gebühr.", "falsch"],
      ["49", "Firmen zahlen nichts.", "falsch"],
      ["50", "Personenakten sind nach 30 Jahren frei.", "falsch"],
      ["51", "Es arbeiten zwölf Leute dort.", "richtig"],
      ["52", "Vier davon sind in Teilzeit.", "richtig"],
      ["53", "Es wird keine Fachkraft gesucht.", "falsch"],
      ["54", "Jeden Samstag ist geöffnet.", "falsch"],
      ["55", "Der erste Samstag ist von zehn bis eins geöffnet.", "richtig"],
    ].map(([n, prompt, correct]) => ({ ...rf(`tb2-h-${n}`, Number(n), prompt, correct as "richtig" | "falsch", "So steht es im Interview."), points: 2.5 })),
  },
  {
    id: "tb2-hoeren-3",
    number: 3,
    title: "Kurze Texte",
    maxRaw: 25,
    instruction: "Fünf kurze Texte, jeder einmal. Aufgaben 56 bis 60.",
    introAudio: narrate("tb2-h-t3-intro", ["Teil 3.", "Sie hören fünf kurze Texte.", "Sie hören jeden Text nur einmal."]),
    endAudio: narrate("tb2-h-t3-ende", ["Ende des Hörverstehens."]),
    stimuli: [
      ["56", JAN, "Achtung im Bürgerhaus. Die Blutspende ist am Donnerstag hier, nicht im Krankenhaus.", "lecture"],
      ["57", LENI, "Hinweis vom Chor. Die Probe ist dienstags um neunzehn Uhr dreißig, nicht um achtzehn Uhr.", "phone"],
      ["58", INGRID, "Achtung in der Kletterhalle. Wegen eines Defekts bleiben wir bis Montag geschlossen.", "shop"],
      ["59", JONAS, "Hinweis der Hochschule. Das Stipendium muss bis zum fünfzehnten März beantragt werden, nicht bis Ende April.", "lecture"],
      ["60", TANJA, "Hallo, hier ist die Energieberatung. Die Beratung ist kostenlos, aber nur nach Anmeldung.", "phone"],
    ].map(([n, who, text, scene]) => ({
      kind: "audio" as const,
      id: `tb2-h-${n}`,
      itemIds: [`tb2-h-${n}`],
      audio: dialogue(`tb2-h-${n}`, [who as typeof JAN], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof JAN, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...once, situation: "Sie hören eine Ansage.", scene: scene as "lecture", readCue: `Nummer ${n}.` }),
    })),
    items: [
      rf("tb2-h-56", 56, "Die Blutspende ist im Krankenhaus.", "falsch", "Im Bürgerhaus."),
      rf("tb2-h-57", 57, "Der Chor probt um 19.30 Uhr.", "richtig", "Dienstags um 19 Uhr 30."),
      rf("tb2-h-58", 58, "Die Kletterhalle ist bis Montag geschlossen.", "richtig", "Wegen eines Defekts."),
      rf("tb2-h-59", 59, "Der Antrag ist bis Ende April möglich.", "falsch", "Bis zum 15. März."),
      rf("tb2-h-60", 60, "Die Beratung ist ohne Anmeldung möglich.", "falsch", "Kostenlos, aber nur nach Anmeldung."),
    ].map((item) => ({ ...item, points: 5 })),
  },
];

const letter = (id: string, title: string, situation: string): Teil => ({
  id,
  number: id.endsWith("a") ? 1 : 2,
  title,
  maxRaw: 45,
  alternativeGroup: "brief",
  instruction: "Wählen Sie Aufgabe A oder B. Mindestens 150 Wörter. Behandeln Sie drei der vier Punkte. Betreff, Anrede und Schluss nicht vergessen.",
  stimuli: [],
  items: [],
  writing: {
    id,
    register: "halbformell",
    targetWords: 160,
    minWords: 150,
    maxWords: 220,
    requiredBullets: 3,
    situation,
    bullets: ["Bitten Sie um etwas.", "Erklären Sie den Hintergrund.", "Machen Sie einen Vorschlag.", "Nennen Sie einen Termin."],
    signals: [["bitte", "möchte", "moechte"], ["weil", "denn", "grund"], ["vorschlag", "könnte", "koennte"], ["termin", "datum", "uhr", "mai", "juni"]],
    rubric: [
      { id: "erfuellung", label: "Aufgabenerfüllung", max: 15 },
      { id: "kohaerenz", label: "Kohärenz", max: 10 },
      { id: "wortschatz", label: "Wortschatz", max: 10 },
      { id: "strukturen", label: "Strukturen", max: 10 },
    ],
  },
});

const sprechen: Teil[] = [
  { n: 1, title: "Erfahrungen", text: "Sprechen Sie über eine Erfahrung mit einem Verein oder einer Initiative." },
  { n: 2, title: "Diskussion", text: "Diskutieren Sie: Sollen Städte das Autofahren in der Innenstadt stärker beschränken?" },
  { n: 3, title: "Planen", text: "Planen Sie gemeinsam eine Informationsveranstaltung." },
].map((spec) => ({
  id: `tb2-sprechen-${spec.n}`,
  number: spec.n,
  title: spec.title,
  maxRaw: 25,
  instruction: spec.text,
  stimuli: [] as Teil["stimuli"],
  items: [] as Teil["items"],
  speaking: {
    id: `tb2-sprechen-${spec.n}`,
    minutes: 5,
    situation: spec.text,
    prompts: [spec.text],
    checklist: ["Position oder Erfahrung", "auf die Partnerin reagiert"],
    rubric: [
      { id: "erfuellung", label: "Aufgabenerfüllung", max: 15 },
      { id: "interaktion", label: "Interaktion", max: 10 },
    ],
    examinerAudio: narrate(`tb2-s-t${spec.n}`, [`Teil ${spec.n}. ${spec.text}`]),
  },
}));

export const telcB2Mock: MockExam = {
  id: "telc-b2-mock-1",
  trackId: "telc-b2",
  provider: "telc",
  level: "B2",
  title: "telc Deutsch B2 · Übungssatz 1",
  isFree: true,
  label: "Beispieldaten",
  scoring: {
    kind: "telc-300",
    weights: { lesen: 75, sprachbausteine: 30, hoeren: 75, schreiben: 45, sprechen: 75 },
    passWritten: 135,
    passOral: 45,
    grades: [[270, "sehr gut"], [240, "gut"], [210, "befriedigend"], [180, "ausreichend"]],
  },
  breaks: [],
  modules: [
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 90, intro: { text: "Leseverstehen und Sprachbausteine, zusammen 90 Minuten." }, teile: [lesen1, lesen2, lesen3] },
    { id: "sprachbausteine", skill: "sprachbausteine", title: "Sprachbausteine", minutes: 90, sharedClockWith: "lesen", intro: { text: "Sprachbausteine im gleichen 90-Minuten-Block." }, teile: sb },
    { id: "hoeren", skill: "hoeren", title: "Hören", minutes: 20, intro: { text: "Hören dauert etwa 20 Minuten. Jeder Text nur einmal.", audio: narrate("tb2-h-intro", ["Modul Hören.", "Sie hören alle Texte nur einmal.", "Am Ende jeder Pause hören Sie dieses Signal."]) }, teile: hoeren },
    {
      id: "schreiben",
      skill: "schreiben",
      title: "Schreiben",
      minutes: 30,
      intro: { text: "Wählen Sie Aufgabe A oder B. Mindestens 150 Wörter, 30 Minuten." },
      teile: [
        letter("tb2-schreiben-a", "Aufgabe A · Verein", "Schreiben Sie an einen Verein. Sie möchten ein Fest mitgestalten."),
        letter("tb2-schreiben-b", "Aufgabe B · Verwaltung", "Schreiben Sie an die Stadtverwaltung. Sie möchten einen Raum für eine Ausstellung."),
      ],
    },
    { id: "sprechen", skill: "sprechen", title: "Sprechen", minutes: 15, prepMinutes: 20, intro: { text: "Mündliche Prüfung, etwa 15 Minuten, 20 Minuten Vorbereitung." }, teile: sprechen },
  ],
};

const problems = [...assertVoices(telcB2Mock, NARRATOR), ...assertTeilCounts(telcB2Mock, [
  { skill: "lesen", counts: [5, 5, 10] },
  { skill: "sprachbausteine", counts: [10, 10] },
  { skill: "hoeren", counts: [5, 10, 5], plays: [1, 1, 1], voices: [1, 2, 1] },
  { skill: "schreiben", counts: [0, 0] },
])];
if (problems.length) throw new Error(problems.join("\n"));
