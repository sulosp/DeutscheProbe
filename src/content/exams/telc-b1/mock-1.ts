import type { Item, MockExam, Teil } from "@/lib/exam-model";
import { INGRID, JAN, JONAS, LENI, NARRATOR, TANJA } from "@/content/exams/voices";
import { dialogue, mc, narrate, rf } from "@/content/exams/factory";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";

function pts(id: string, number: number, prompt: string, correct: string, points: number, explanation: string, type: Item["type"] = "match"): Item {
  return { id, number, type, prompt, correct, points, explanation };
}

const headlines = ["a Neue Bibliothek am Hafen", "b Streit um die Marktstraße", "c Mehr Züge am Abend", "d Schule ohne Hausaufgaben", "e Festival im Park", "f Teure Mieten", "g Reparatur-Café wächst", "h Klinik sucht Pflegekräfte", "i Regenrekord im Mai", "j Verein gewinnt Pokal"].map((line) => ({ id: line[0], label: line }));

const texts = [
  ["1", "Am Hafen öffnet im Herbst ein Lesesaal mit Café. Die alten Räume am Markt werden geschlossen."],
  ["2", "Die Miete für zwei Zimmer ist in fünf Jahren um fast die Hälfte gestiegen. Viele ziehen an den Rand."],
  ["3", "Nach 21 Uhr fuhr bisher kein Zug. Ab Juni gibt es zwei zusätzliche Verbindungen."],
  ["4", "Das Repair-Café hat jetzt jeden Samstag geöffnet, nicht nur den ersten. Lampen und Räder, keine Waschmaschinen."],
  ["5", "Der Fußballverein der Stadt hat das Finale 2:1 gewonnen. Das nächste Spiel ist auswärts."],
];

const article = `Die Stadt will die Marktstraße samstags von 10 bis 18 Uhr für Autos sperren. Ein Wochenmarkt soll auf die Fahrbahn. Die Busse fahren weiter, die Lieferwagen nicht zwischen 11 und 16 Uhr. Der Rat entscheidet am Donnerstag. Wer eine Meinung hat, kann bis Mittwoch an die Stadt schreiben. Ein ähnlicher Versuch im letzten Jahr wurde nach zwei Monaten beendet, weil die Geschäfte weniger Umsatz hatten. Diesmal bleiben die Parkhäuser am Ring geöffnet, und die Stadtbahn hält direkt an der Straße.`;

const ads = "abcdefghijkl".split("").map((id, index) => ({
  id,
  label: `${id} ${["Sprachcafé", "Fahrradwerkstatt", "Nachhilfe", "Kochkurs", "Mitfahrzentrale", "Yogakurs", "Hundesitter", "Computerkurs", "Möbelbörse", "Schwimmkurs", "Stadtführung", "Kinderflohmarkt"][index]}`,
}));

const lesen: Teil[] = [
  {
    id: "tb1-lesen-1",
    number: 1,
    title: "Globalverstehen",
    maxRaw: 25,
    instruction: "Welche Überschrift passt zu welchem Text? Aufgaben 1 bis 5. Fünf Überschriften bleiben übrig.",
    options: headlines,
    stimuli: texts.map(([n, body]) => ({ kind: "text" as const, id: `tb1-t-${n}`, title: `Text ${n}`, body, genre: "article" as const })),
    items: [
      pts("tb1-l-1", 1, "Text 1", "a", 5, "Lesesaal am Hafen."),
      pts("tb1-l-2", 2, "Text 2", "f", 5, "Mieten sind gestiegen."),
      pts("tb1-l-3", 3, "Text 3", "c", 5, "Mehr Züge am Abend."),
      pts("tb1-l-4", 4, "Text 4", "g", 5, "Das Repair-Café hat öfter geöffnet."),
      pts("tb1-l-5", 5, "Text 5", "j", 5, "Der Verein hat das Finale gewonnen."),
    ],
  },
  {
    id: "tb1-lesen-2",
    number: 2,
    title: "Detailverstehen",
    maxRaw: 25,
    instruction: "Lesen Sie den Artikel. Aufgaben 6 bis 10.",
    stimuli: [{ kind: "text", id: "tb1-art", title: "Samstag ohne Autos?", body: article, genre: "article" }],
    items: [
      mc("tb1-l-6", 6, "Wann soll die Straße frei von Autos sein?", [{ id: "a", label: "samstags 10 bis 18 Uhr" }, { id: "b", label: "täglich" }, { id: "c", label: "nur sonntags" }], "a", "Samstags von 10 bis 18 Uhr."),
      mc("tb1-l-7", 7, "Was fährt weiter?", [{ id: "a", label: "die Lieferwagen den ganzen Tag" }, { id: "b", label: "die Busse" }, { id: "c", label: "nichts" }], "b", "Die Busse fahren weiter."),
      mc("tb1-l-8", 8, "Wann entscheidet der Rat?", [{ id: "a", label: "am Mittwoch" }, { id: "b", label: "am Donnerstag" }, { id: "c", label: "im letzten Jahr" }], "b", "Am Donnerstag."),
      mc("tb1-l-9", 9, "Warum endete der Versuch im letzten Jahr?", [{ id: "a", label: "wegen weniger Umsatz" }, { id: "b", label: "wegen des Wetters" }, { id: "c", label: "wegen der Bahn" }], "a", "Die Geschäfte hatten weniger Umsatz."),
      mc("tb1-l-10", 10, "Was bleibt diesmal geöffnet?", [{ id: "a", label: "die Parkhäuser am Ring" }, { id: "b", label: "die Lieferzufahrt von 11 bis 16 Uhr" }, { id: "c", label: "nur der Markt" }], "a", "Die Parkhäuser am Ring bleiben geöffnet."),
    ].map((item) => ({ ...item, points: 5 })),
  },
  {
    id: "tb1-lesen-3",
    number: 3,
    title: "Selektives Verstehen",
    maxRaw: 25,
    allowNone: true,
    noneLabel: "x – keine Anzeige",
    instruction: "Welche Anzeige passt? Aufgaben 11 bis 20. Manchmal keine.",
    options: ads,
    stimuli: ads.map((ad) => ({ kind: "text" as const, id: `tb1-ad-${ad.id}`, title: ad.label, body: ad.label, genre: "ad" as const })),
    items: [
      ["11", "abends Deutsch sprechen", "a"],
      ["12", "Fahrrad reparieren lassen", "b"],
      ["13", "Mathe für die 9. Klasse", "c"],
      ["14", "kochen lernen", "d"],
      ["15", "nach Hamburg mitfahren", "e"],
      ["16", "Yoga am Morgen", "f"],
      ["17", "jemanden für den Hund am Wochenende", "g"],
      ["18", "Computer für Senioren", "h"],
      ["19", "schwimmen lernen", "j"],
      ["20", "Klavierunterricht morgen früh", "0"],
    ].map(([number, prompt, correct]) => pts(`tb1-l-${number}`, Number(number), prompt, correct, 2.5, `Anzeige ${correct === "0" ? "keine" : correct}.`)),
  },
];

const grammar = "Liebe Frau Berg, ich schreibe Ihnen, [21] ich am Freitag nicht kommen kann. Ich bin [22] krank. Könnten Sie den Termin [23] nächste Woche legen? Ich wäre Ihnen [24] dankbar. Mit freundlichen Grüßen.";
const gaps: Item[] = [
  ["21", "weil", "dass", "ob", "weil"],
  ["22", "seit", "seit", "während", "für"],
  ["23", "auf", "auf", "in", "zu"],
  ["24", "sehr", "sehr", "viel", "ganz"],
  ["25", "habe", "bin", "habe", "werde"],
  ["26", "dem", "dem", "den", "der"],
  ["27", "zu", "zu", "um", "für"],
  ["28", "wenn", "wenn", "als", "dass"],
  ["29", "mir", "mir", "mich", "mein"],
  ["30", "worden", "worden", "geworden", "werden"],
].map(([number, correct, a, b, c], index) =>
  mc(`tb1-g-${number}`, Number(number), index < 4 ? `Lücke ${number} im ersten Brief` : `Lücke ${number} im zweiten Brief`, [
    { id: "a", label: a },
    { id: "b", label: b },
    { id: "c", label: c },
  ], correct === a ? "a" : correct === b ? "b" : "c", `Hier passt „${correct}“.`),
).map((item) => ({ ...item, points: 1.5, type: "gapMc" as const }));

const bank = "abgesehen,deshalb,trotzdem,obwohl,außerdem,zuerst,danach,jedoch,bereits,kaum,häufig,selten,plötzlich,inzwischen,dennoch".split(",").map((word, index) => ({
  id: String.fromCharCode(97 + index),
  label: `${String.fromCharCode(97 + index)} ${word}`,
}));

const lex: Teil = {
  id: "tb1-sb-2",
  number: 2,
  title: "Lexik",
  maxRaw: 15,
  instruction: "Welche Wörter passen in die Lücken 31 bis 40? Jedes Wort nur einmal. Fünf Wörter bleiben übrig.",
  options: bank,
  stimuli: [{ kind: "text", id: "tb1-lex", title: "Brief", body: "Ich komme [31] seit drei Jahren in diese Stadt. [32] gefällt es mir hier. [33] vermisse ich das Meer. [34] habe ich Freunde gefunden. [35] war alles neu. [36] kenne ich die Wege. [37] regnet es, ich gehe trotzdem raus. [38] fahre ich ans Wochenende weg. [39] bin ich müde, aber zufrieden. [40] weiß ich, dass ich bleiben will.", genre: "email" }],
  items: [
    ["31", "a"], ["32", "b"], ["33", "c"], ["34", "e"], ["35", "f"], ["36", "i"], ["37", "d"], ["38", "g"], ["39", "j"], ["40", "o"],
  ].map(([number, correct]) => ({ id: `tb1-x-${number}`, number: Number(number), type: "gapBank" as const, prompt: `Lücke ${number}`, correct, points: 1.5, explanation: "Das Wort passt in den Satz. Nicht jedes Wort aus der Liste wird gebraucht." })),
};

const sb: Teil[] = [
  {
    id: "tb1-sb-1",
    number: 1,
    title: "Grammatik",
    maxRaw: 15,
    instruction: "Wählen Sie für die Lücken 21 bis 30 die richtige Form.",
    stimuli: [{ kind: "text", id: "tb1-gram", title: "Zwei kurze Briefe", body: `${grammar}\n\nZweiter Brief: Ich [25] Ihnen schon geschrieben. In [26] Kurs fehlt noch Material. Ich möchte [27] kommen, [28] ich gesund bin. Bitte schicken Sie [29] die Unterlagen. Das Formular ist schon ausgefüllt [30].`, genre: "email" }],
    items: gaps,
  },
  lex,
];

const hoeren: Teil[] = [
  {
    id: "tb1-hoeren-1",
    number: 1,
    title: "Kurze Meldungen",
    maxRaw: 25,
    instruction: "Fünf kurze Texte, jeder einmal. Richtig oder falsch. Aufgaben 41 bis 45.",
    introAudio: narrate("tb1-h-t1-intro", ["Teil 1.", "Sie hören nun fünf kurze Texte.", "Sie hören diese Texte nur einmal."]),
    endAudio: narrate("tb1-h-t1-ende", ["Ende von Teil 1."]),
    stimuli: [
      ["41", TANJA, "Hinweis der Stadtbibliothek. Am Freitag bleibt sie geschlossen. Am Samstag öffnet sie um zehn.", "radio"],
      ["42", JONAS, "Achtung an der Haltestelle. Der Nachtbus fährt ab heute auch sonntags, nicht nur freitags.", "station"],
      ["43", LENI, "Hinweis vom Stadtmuseum. Der Eintritt ist diesen Monat frei. Die Führung kostet fünf Euro.", "radio"],
      ["44", JAN, "Achtung, eine Durchsage der Schule. Der Unterricht fällt morgen aus. Der Ausflug ist auf Donnerstag verschoben.", "lecture"],
      ["45", INGRID, "Achtung im Stadtpark. Grillen ist ab sofort erlaubt, aber nur auf den markierten Plätzen.", "street"],
    ].map(([n, who, text, scene]) => ({
      kind: "audio" as const,
      id: `tb1-h-${n}`,
      itemIds: [`tb1-h-${n}`],
      audio: dialogue(`tb1-h-${n}`, [who as typeof TANJA], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof TANJA, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { plays: 1, readSeconds: 8, betweenPlaysSeconds: 0, answerSeconds: 8, situation: "Sie hören eine kurze Meldung.", scene: scene as "radio", readCue: `Nummer ${n}.` }),
    })),
    items: [
      rf("tb1-h-41", 41, "Die Bibliothek hat am Freitag geöffnet.", "falsch", "Sie bleibt am Freitag geschlossen."),
      rf("tb1-h-42", 42, "Der Nachtbus fährt jetzt auch sonntags.", "richtig", "Ab heute auch sonntags."),
      rf("tb1-h-43", 43, "Die Führung ist kostenlos.", "falsch", "Der Eintritt ist frei, die Führung kostet fünf Euro."),
      rf("tb1-h-44", 44, "Der Ausflug ist auf Donnerstag verschoben.", "richtig", "Das sagt die Meldung."),
      rf("tb1-h-45", 45, "Grillen ist im ganzen Park verboten.", "falsch", "Es ist auf den markierten Plätzen erlaubt."),
    ].map((item) => ({ ...item, points: 5 })),
  },
  {
    id: "tb1-hoeren-2",
    number: 2,
    title: "Gespräch",
    maxRaw: 25,
    instruction: "Sie hören ein Gespräch zweimal. Aufgaben 46 bis 55, richtig oder falsch.",
    introAudio: narrate("tb1-h-t2-intro", ["Teil 2.", "Sie hören nun ein Gespräch.", "Sie hören das Gespräch zweimal."]),
    endAudio: narrate("tb1-h-t2-ende", ["Ende von Teil 2."]),
    stimuli: [
      {
        kind: "audio",
        id: "tb1-h-t2",
        itemIds: Array.from({ length: 10 }, (_, i) => `tb1-h-${46 + i}`),
        audio: dialogue("tb1-h-t2", [TANJA, JONAS], [
          { who: TANJA, text: "Also, wir suchen eine Wohnung mit Balkon, nicht im Erdgeschoss." },
          { who: JONAS, text: "Die in der Bergstraße hat einen Balkon und ist im zweiten Stock. Die ist ab Mai frei, nicht ab April." },
          { who: TANJA, text: "Und was kostet die?" },
          { who: JONAS, text: "Achthundert Euro kalt. Heizung extra. Haustiere sind nicht erlaubt." },
          { who: TANJA, text: "Ist die Küche möbliert?" },
          { who: JONAS, text: "Die Küche ja, die anderen Zimmer nicht." },
          { who: TANJA, text: "Gibt's einen Aufzug?" },
          { who: JONAS, text: "Nein. Dafür einen Kellerraum." },
          { who: TANJA, text: "Können wir sie am Samstag ansehen? Sonntag kann ich nicht." },
          { who: JONAS, text: "Samstag um elf passt. Die Vermieterin heißt Frau Holm." },
        ], { plays: 2, readSeconds: 20, betweenPlaysSeconds: 4, answerSeconds: 15, repeatCue: "Sie hören jetzt den Text noch einmal.", situation: "Sie hören ein Telefongespräch mit einem Wohnungsamt.", scene: "phone" }),
      },
    ],
    items: [
      ["46", "Die Wohnung soll im Erdgeschoss sein.", "falsch"],
      ["47", "Sie soll einen Balkon haben.", "richtig"],
      ["48", "Die Wohnung in der Bergstraße ist ab April frei.", "falsch"],
      ["49", "Sie kostet 800 Euro kalt.", "richtig"],
      ["50", "Die Heizung ist im Preis enthalten.", "falsch"],
      ["51", "Haustiere sind erlaubt.", "falsch"],
      ["52", "Die Küche ist möbliert.", "richtig"],
      ["53", "Es gibt einen Aufzug.", "falsch"],
      ["54", "Der Besichtigungstermin ist am Samstag.", "richtig"],
      ["55", "Die Vermieterin heißt Frau Holm.", "richtig"],
    ].map(([number, prompt, correct]) => ({ ...rf(`tb1-h-${number}`, Number(number), prompt, correct as "richtig" | "falsch", "Das steht so im Gespräch."), points: 2.5 })),
  },
  {
    id: "tb1-hoeren-3",
    number: 3,
    title: "Durchsagen",
    maxRaw: 25,
    instruction: "Fünf kurze Texte, jeder zweimal. Aufgaben 56 bis 60.",
    introAudio: narrate("tb1-h-t3-intro", ["Teil 3.", "Sie hören fünf kurze Texte.", "Sie hören jeden Text zweimal."]),
    endAudio: narrate("tb1-h-t3-ende", ["Ende des Hörverstehens."]),
    stimuli: [
      ["56", JAN, "Achtung am Hauptbahnhof. Der Zug nach Bremen fährt heute von Gleis sechs, nicht von Gleis zwei.", "station"],
      ["57", LENI, "Hallo, hier ist der Versand. Ihre Bestellung ist ab morgen in der Filiale Nord abholbereit, nicht in der Filiale Süd.", "phone"],
      ["58", INGRID, "Hinweis der Volkshochschule. Der Kurs heute Abend fällt aus. Er wird auf Dienstag verschoben.", "lecture"],
      ["59", JONAS, "Hallo, hier ist das Fundbüro. Bei uns liegt ein roter Regenschirm, kein blauer.", "phone"],
      ["60", TANJA, "Guten Tag, hier ist die Arztpraxis. Am Freitag haben wir nur bis dreizehn Uhr geöffnet.", "phone"],
    ].map(([n, who, text, scene]) => ({
      kind: "audio" as const,
      id: `tb1-h-${n}`,
      itemIds: [`tb1-h-${n}`],
      audio: dialogue(`tb1-h-${n}`, [who as typeof TANJA], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof TANJA, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { plays: 2, readSeconds: 8, betweenPlaysSeconds: 3, answerSeconds: 8, situation: "Sie hören eine kurze Ansage.", scene: scene as "station", readCue: `Nummer ${n}.` }),
    })),
    items: [
      rf("tb1-h-56", 56, "Der Zug fährt von Gleis 2.", "falsch", "Von Gleis 6."),
      rf("tb1-h-57", 57, "Die Bestellung liegt in der Filiale Süd.", "falsch", "In der Filiale Nord."),
      rf("tb1-h-58", 58, "Der Kurs wird auf Dienstag verschoben.", "richtig", "Heute fällt er aus."),
      rf("tb1-h-59", 59, "Im Fundbüro liegt ein roter Schirm.", "richtig", "Ein roter, kein blauer."),
      rf("tb1-h-60", 60, "Die Praxis hat am Freitag bis 13 Uhr geöffnet.", "richtig", "Nur bis 13 Uhr."),
    ].map((item) => ({ ...item, points: 5 })),
  },
];

const schreiben: Teil[] = [
  {
    id: "tb1-schreiben-1",
    number: 1,
    title: "E-Mail",
    maxRaw: 45,
    instruction: "Antworten Sie auf die E-Mail. Gehen Sie auf alle vier Leitpunkte ein. Etwa 100 bis 150 Wörter.",
    stimuli: [{ kind: "text", id: "tb1-mail", title: "E-Mail von Samir", body: "Hallo, ich organisiere am Samstag ein Picknick im Park. Kannst du kommen? Was sollen wir essen? Hast du eine Idee für schlechtes Wetter? Viele Grüße Samir", genre: "email" }],
    items: [],
    writing: {
      id: "tb1-schreiben-1",
      register: "informell",
      targetWords: 120,
      minWords: 80,
      maxWords: 170,
      situation: "Antworten Sie Samir.",
      bullets: ["Sagen Sie, ob Sie kommen können.", "Machen Sie einen Vorschlag zum Essen.", "Reagieren Sie auf schlechtes Wetter.", "Stellen Sie eine Frage."],
      signals: [["kommen", "samstag", "leider"], ["salat", "brot", "essen", "kuchen"], ["regen", "café", "cafe", "halle"], ["?", "wann", "wo", "wer"]],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 15 },
        { id: "kohaerenz", label: "Kohärenz", max: 10 },
        { id: "wortschatz", label: "Wortschatz", max: 10 },
        { id: "strukturen", label: "Strukturen", max: 10 },
      ],
    },
  },
];

const sprechen: Teil[] = [
  { n: 1, title: "Kennenlernen", max: 15, e: 8, i: 7, minutes: 3, text: "Lernen Sie sich kennen." },
  { n: 2, title: "Thema", max: 30, e: 16, i: 14, minutes: 6, text: "Berichten Sie über einen kurzen Text zum Thema Wohnen und reagieren Sie." },
  { n: 3, title: "Planen", max: 30, e: 16, i: 14, minutes: 6, text: "Planen Sie gemeinsam ein Wochenende." },
].map((spec) => ({
  id: `tb1-sprechen-${spec.n}`,
  number: spec.n,
  title: spec.title,
  maxRaw: spec.max,
  instruction: spec.text,
  stimuli: [] as Teil["stimuli"],
  items: [] as Teil["items"],
  speaking: {
    id: `tb1-sprechen-${spec.n}`,
    minutes: spec.minutes,
    situation: spec.text,
    prompts: [spec.text],
    checklist: ["begonnen", "auf die Partnerin eingegangen"],
    rubric: [
      { id: "erfuellung", label: "Aufgabenerfüllung", max: spec.e },
      { id: "interaktion", label: "Interaktion", max: spec.i },
    ],
    examinerAudio: narrate(`tb1-s-t${spec.n}`, [`Teil ${spec.n}. ${spec.text}`]),
  },
}));

export const telcB1Mock: MockExam = {
  id: "telc-b1-mock-1",
  trackId: "telc-b1",
  provider: "telc",
  level: "B1",
  title: "telc Deutsch B1 · Übungssatz 1",
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
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 90, intro: { text: "Leseverstehen und Sprachbausteine haben zusammen 90 Minuten. Sie wählen die Reihenfolge." }, teile: lesen },
    { id: "sprachbausteine", skill: "sprachbausteine", title: "Sprachbausteine", minutes: 90, sharedClockWith: "lesen", intro: { text: "Sprachbausteine gehören zum 90-Minuten-Block." }, teile: sb },
    { id: "hoeren", skill: "hoeren", title: "Hören", minutes: 30, intro: { text: "Hören dauert etwa 30 Minuten.", audio: narrate("tb1-h-intro", ["Modul Hören.", "Sie hören kurze Texte und ein Gespräch.", "Am Ende jeder Pause hören Sie dieses Signal."]) }, teile: hoeren },
    { id: "schreiben", skill: "schreiben", title: "Schreiben", minutes: 30, intro: { text: "Schriftlicher Ausdruck, 30 Minuten, eine E-Mail mit vier Leitpunkten." }, teile: schreiben },
    { id: "sprechen", skill: "sprechen", title: "Sprechen", minutes: 15, prepMinutes: 20, intro: { text: "Mündliche Prüfung, etwa 15 Minuten, 20 Minuten Vorbereitung." }, teile: sprechen },
  ],
};

const problems = [...assertVoices(telcB1Mock, NARRATOR), ...assertTeilCounts(telcB1Mock, [
  { skill: "lesen", counts: [5, 5, 10] },
  { skill: "sprachbausteine", counts: [10, 10] },
  { skill: "hoeren", counts: [5, 10, 5], plays: [1, 2, 2], voices: [1, 2, 1] },
])];
if (problems.length) throw new Error(problems.join("\n"));
