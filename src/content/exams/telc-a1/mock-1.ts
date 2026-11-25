import type { MockExam, Teil } from "@/lib/exam-model";
import { NARRATOR, ANDREW, AVA, BRIAN, EMMA, GIUSEPPE, INGRID, JAN, JONAS, LENI, REMY, TANJA, VIVIENNE } from "@/content/exams/voices";
import { ab, dialogue, fill, mc, narrate, rf } from "@/content/exams/factory";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";

const twice = { plays: 2 as const, readSeconds: 5, betweenPlaysSeconds: 3, answerSeconds: 15 };
const once = { plays: 1 as const, readSeconds: 5, betweenPlaysSeconds: 0, answerSeconds: 15 };

const hoeren: Teil[] = [
  {
    id: "ta1-hoeren-1",
    number: 1,
    title: "Kurze Gespräche",
    maxRaw: 6,
    instruction: "Sie hören sechs kurze Gespräche, jedes zweimal. Wählen Sie a, b oder c.",
    introAudio: narrate("ta1-h-t1-intro", ["Teil 1.", "Sie hören nun sechs kurze Gespräche.", "Sie hören jedes Gespräch zweimal."]),
    endAudio: narrate("ta1-h-t1-ende", ["Ende von Teil 1."]),
    stimuli: [
      ["1", TANJA, JONAS, "Ein Brot, bitte.", "Das große kostet zwei Euro, das kleine eins fünfzig.", "Ich nehme das große.", "Gut, zwei Euro."],
      ["2", INGRID, JAN, "Welcher Bus fährt zum Zoo?", "Die Linie acht, nicht die Linie drei.", "Von hier?", "Ja, von Steig B."],
      ["3", LENI, ANDREW, "Kommt du um sechs zur Feier?", "Ich schaffe es erst um halb sieben.", "Die Feier beginnt um sechs.", "Ich komme trotzdem."],
      ["4", AVA, BRIAN, "Haben Sie die Apotheke noch offen?", "Bis achtzehn Uhr, nicht bis zwanzig.", "Und morgen?", "Ab acht Uhr."],
      ["5", EMMA, REMY, "Wo ist der Spielplatz?", "Hinter der Schule, links.", "Nicht am Markt?", "Nein, hinter der Schule."],
      ["6", VIVIENNE, GIUSEPPE, "Ist der Deutschkurs am Dienstag?", "Nein, am Donnerstag um siebzehn Uhr.", "In Raum eins?", "In Raum fünf."],
    ].map(([n, a, b, ...lines]) => ({
      kind: "audio" as const,
      id: `ta1-h-${n}`,
      itemIds: [`ta1-h-${n}`],
      audio: dialogue(`ta1-h-${n}`, [a as typeof TANJA, b as typeof TANJA], [
        { who: a as typeof TANJA, text: lines[0] as string },
        { who: b as typeof TANJA, text: lines[1] as string },
        { who: a as typeof TANJA, text: lines[2] as string },
        { who: b as typeof TANJA, text: lines[3] as string },
      ], {
        ...twice,
        situation: ["Sie hören ein Gespräch beim Bäcker.", "Sie hören ein Gespräch an der Bushaltestelle.", "Sie hören ein Gespräch auf der Straße.", "Sie hören ein Gespräch in der Apotheke.", "Sie hören ein Gespräch auf der Straße.", "Sie hören ein Gespräch in der Sprachschule."][Number(n) - 1],
        scene: (["shop", "station", "street", "shop", "street", "quiet"] as const)[Number(n) - 1],
        readCue: `Nummer ${n}.`,
      }),
    })),
    items: [
      mc("ta1-h-1", 1, "Was kostet das große Brot?", [{ id: "a", label: "1,50 Euro" }, { id: "b", label: "2 Euro" }, { id: "c", label: "3 Euro" }], "b", "Das große Brot kostet zwei Euro."),
      mc("ta1-h-2", 2, "Welche Linie fährt zum Zoo?", [{ id: "a", label: "Linie 3" }, { id: "b", label: "Linie 8" }, { id: "c", label: "Linie 12" }], "b", "Linie acht, nicht Linie drei."),
      mc("ta1-h-3", 3, "Wann kommt die Person zur Feier?", [{ id: "a", label: "um 6 Uhr" }, { id: "b", label: "um 6.30 Uhr" }, { id: "c", label: "um 7.30 Uhr" }], "b", "Erst um halb sieben."),
      mc("ta1-h-4", 4, "Bis wann hat die Apotheke heute geöffnet?", [{ id: "a", label: "bis 18 Uhr" }, { id: "b", label: "bis 20 Uhr" }, { id: "c", label: "bis 22 Uhr" }], "a", "Bis achtzehn Uhr."),
      mc("ta1-h-5", 5, "Wo ist der Spielplatz?", [{ id: "a", label: "am Markt" }, { id: "b", label: "hinter der Schule" }, { id: "c", label: "am Bahnhof" }], "b", "Hinter der Schule, links."),
      mc("ta1-h-6", 6, "Wann ist der Deutschkurs?", [{ id: "a", label: "dienstags" }, { id: "b", label: "donnerstags um 17 Uhr" }, { id: "c", label: "freitags" }], "b", "Am Donnerstag um siebzehn Uhr, Raum fünf."),
    ],
  },
  {
    id: "ta1-hoeren-2",
    number: 2,
    title: "Ansagen",
    maxRaw: 4,
    instruction: "Sie hören vier Ansagen, jede einmal. Richtig oder falsch?",
    introAudio: narrate("ta1-h-t2-intro", ["Teil 2.", "Sie hören vier Ansagen.", "Sie hören jede Ansage nur einmal."]),
    endAudio: narrate("ta1-h-t2-ende", ["Ende von Teil 2."]),
    stimuli: [
      ["7", JAN, "Achtung auf dem Rathausplatz. Der Markt fällt heute aus. Er findet morgen statt.", "station"],
      ["8", LENI, "Achtung im Stadtpark. Grillen ist verboten. Picknick ohne Feuer ist erlaubt.", "street"],
      ["9", INGRID, "Hinweis der Stadtbücherei. Heute haben wir bis sechzehn Uhr geöffnet, nicht bis achtzehn Uhr.", "shop"],
      ["10", ANDREW, "Achtung am Hauptbahnhof. Zug neun nach Lübeck fährt von Gleis vier. Er ist pünktlich.", "station"],
    ].map(([n, who, text, scene]) => ({
      kind: "audio" as const,
      id: `ta1-h-${n}`,
      itemIds: [`ta1-h-${n}`],
      audio: dialogue(`ta1-h-${n}`, [who as typeof JAN], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof JAN, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...once, situation: "Sie hören eine Durchsage.", scene: scene as "station", readCue: `Nummer ${n}.` }),
    })),
    items: [
      rf("ta1-h-7", 7, "Der Markt findet heute statt.", "falsch", "Er fällt heute aus und ist morgen."),
      rf("ta1-h-8", 8, "Im Park darf man grillen.", "falsch", "Grillen ist verboten."),
      rf("ta1-h-9", 9, "Die Bücherei hat heute bis 18 Uhr geöffnet.", "falsch", "Nur bis sechzehn Uhr."),
      rf("ta1-h-10", 10, "Der Zug nach Lübeck ist pünktlich.", "richtig", "Er ist pünktlich und fährt von Gleis vier."),
    ],
  },
  {
    id: "ta1-hoeren-3",
    number: 3,
    title: "Nachrichten",
    maxRaw: 5,
    instruction: "Sie hören fünf Nachrichten, jede zweimal.",
    introAudio: narrate("ta1-h-t3-intro", ["Teil 3.", "Sie hören fünf kurze Nachrichten.", "Sie hören jede Nachricht zweimal."]),
    endAudio: narrate("ta1-h-t3-ende", ["Ende des Hörtests.", "Übertragen Sie die Lösungen 1 bis 15."]),
    stimuli: [
      ["11", BRIAN, "Hallo, hier ist das Kino am Markt. Ihr Film beginnt um zwanzig Uhr fünfzehn, Saal zwei."],
      ["12", EMMA, "Hallo, hier ist die Fahrradwerkstatt. Ihr Rad ist fertig. Abholung bis Freitag um fünfzehn Uhr."],
      ["13", REMY, "Hallo, hier ist die Schule. Der Ausflug der Klasse ist am Mittwoch, nicht am Dienstag. Treffpunkt sieben Uhr vierzig im Schulhof."],
      ["14", AVA, "Hallo, hier ist der Supermarkt an der Ecke. Heute gibt es Brot im Angebot, ein Euro statt zwei."],
      ["15", GIUSEPPE, "Guten Tag, hier ist die Buchhandlung. Ihre Bestellung liegt ab morgen bereit. Wir schließen um achtzehn Uhr."],
    ].map(([n, who, text]) => ({
      kind: "audio" as const,
      id: `ta1-h-${n}`,
      itemIds: [`ta1-h-${n}`],
      audio: dialogue(`ta1-h-${n}`, [who as typeof JAN], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof JAN, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...twice, situation: "Sie hören eine Nachricht auf der Mailbox.", scene: "phone", readCue: `Nummer ${n}.` }),
    })),
    items: [
      mc("ta1-h-11", 11, "Wann beginnt der Film?", [{ id: "a", label: "um 20.00 Uhr" }, { id: "b", label: "um 20.15 Uhr" }, { id: "c", label: "um 21.15 Uhr" }], "b", "Um zwanzig Uhr fünfzehn, Saal zwei."),
      mc("ta1-h-12", 12, "Bis wann kann man das Rad abholen?", [{ id: "a", label: "bis Freitag 15 Uhr" }, { id: "b", label: "bis Samstag" }, { id: "c", label: "nur heute" }], "a", "Bis Freitag um fünfzehn Uhr."),
      mc("ta1-h-13", 13, "Wann ist der Ausflug?", [{ id: "a", label: "am Dienstag" }, { id: "b", label: "am Mittwoch" }, { id: "c", label: "am Donnerstag" }], "b", "Am Mittwoch, nicht am Dienstag."),
      mc("ta1-h-14", 14, "Was kostet das Brot heute?", [{ id: "a", label: "ein Euro" }, { id: "b", label: "zwei Euro" }, { id: "c", label: "drei Euro" }], "a", "Heute ein Euro statt zwei."),
      mc("ta1-h-15", 15, "Wo liegt die Bestellung?", [{ id: "a", label: "in der Buchhandlung" }, { id: "b", label: "in der Bibliothek" }, { id: "c", label: "im Kino" }], "a", "Im Buchladen, ab morgen."),
    ],
  },
];

const lesen: Teil[] = [
  {
    id: "ta1-lesen-1",
    number: 1,
    title: "Zwei Zettel",
    maxRaw: 5,
    instruction: "Lesen Sie die Zettel. Richtig oder falsch? Aufgaben 1 bis 5.",
    stimuli: [
      { kind: "text", id: "ta1-n1", title: "Zettel an der Tür", body: "Tom, ich bin beim Bäcker. Die Milch steht im Kühlschrank. Bitte den Hund nicht füttern, er hat schon gefressen. Bin um 15 Uhr zurück. Mia", genre: "email" },
      { kind: "text", id: "ta1-n2", title: "Nachricht vom Sportverein", body: "Das Training am Freitag fällt aus. Nächster Termin: Sonntag um 9 Uhr auf dem Platz hinter der Schule.", genre: "email" },
    ],
    items: [
      rf("ta1-l-1", 1, "Mia ist zu Hause.", "falsch", "Sie ist beim Bäcker."),
      rf("ta1-l-2", 2, "Tom soll den Hund füttern.", "falsch", "Der Hund hat schon gefressen."),
      rf("ta1-l-3", 3, "Mia kommt um 15 Uhr zurück.", "richtig", "Das steht auf dem Zettel."),
      rf("ta1-l-4", 4, "Das Training am Freitag findet statt.", "falsch", "Es fällt aus."),
      rf("ta1-l-5", 5, "Der nächste Termin ist am Sonntag um 9 Uhr.", "richtig", "Sonntag um 9 Uhr hinter der Schule."),
    ],
  },
  {
    id: "ta1-lesen-2",
    number: 2,
    title: "Zwei Cafés",
    maxRaw: 5,
    instruction: "Anzeige a oder Anzeige b? Aufgaben 6 bis 10.",
    stimuli: [
      { kind: "text", id: "ta1-a", title: "a · Café Mond", body: "Täglich 8–18 Uhr. Kuchen ja, warmes Essen nein. WLAN frei. Hunde nicht erlaubt.", genre: "ad" },
      { kind: "text", id: "ta1-b", title: "b · Café Fluss", body: "Dienstag bis Sonntag 11–21 Uhr. Warmes Essen und Kuchen. Kein WLAN. Hunde willkommen. Montag geschlossen.", genre: "ad" },
    ],
    items: [
      ab("ta1-l-6", 6, "Sie möchten montags um 9 Uhr Kaffee trinken.", "Café Mond", "Café Fluss", "a", "Café Fluss hat montags zu. Café Mond öffnet um 8."),
      ab("ta1-l-7", 7, "Sie möchten abends warm essen.", "Café Mond", "Café Fluss", "b", "Nur Café Fluss hat warmes Essen und ist abends offen."),
      ab("ta1-l-8", 8, "Sie brauchen WLAN.", "Café Mond", "Café Fluss", "a", "WLAN gibt es im Café Mond."),
      ab("ta1-l-9", 9, "Sie möchten den Hund mitnehmen.", "Café Mond", "Café Fluss", "b", "Im Café Fluss sind Hunde willkommen."),
      ab("ta1-l-10", 10, "Sie möchten sonntags um 12 Uhr Kuchen essen.", "Café Mond", "Café Fluss", "b", "Sonntag um 12 hat Café Mond schon zu, Café Fluss nicht."),
    ],
  },
  {
    id: "ta1-lesen-3",
    number: 3,
    title: "Schilder",
    maxRaw: 5,
    instruction: "Ist die Aussage richtig oder falsch? Aufgaben 11 bis 15.",
    stimuli: [{ kind: "text", id: "ta1-signs", title: "Schilder", body: "Eingang nur vorn.\nFrisch gestrichen.\nHöchstgeschwindigkeit 30.\nKein Zutritt für Kinder unter 6.\nKasse links.", genre: "sign" }],
    items: [
      rf("ta1-l-11", 11, "Man darf auch hinten hineingehen.", "falsch", "Eingang nur vorn."),
      rf("ta1-l-12", 12, "Die Farbe ist noch neu.", "richtig", "Frisch gestrichen."),
      rf("ta1-l-13", 13, "Man darf hier 50 fahren.", "falsch", "Höchstens 30."),
      rf("ta1-l-14", 14, "Ein Kind von 5 Jahren darf nicht hinein.", "richtig", "Kein Zutritt unter 6."),
      rf("ta1-l-15", 15, "Die Kasse ist rechts.", "falsch", "Die Kasse ist links."),
    ],
  },
];

const schreiben: Teil[] = [
  {
    id: "ta1-schreiben-1",
    number: 1,
    title: "Formular",
    maxRaw: 5,
    instruction: "Ein Freund möchte Mitglied im Sportverein werden. Füllen Sie das Formular aus.",
    stimuli: [{ kind: "text", id: "ta1-form", title: "Paul", body: "Ich heiße Paul Sommer. Ich bin 19 Jahre alt und komme aus Spanien. Ich wohne in der Bergstraße 8. Ich spiele Fußball.", genre: "email" }],
    items: [
      fill("ta1-w-1", 1, "Name", ["Paul Sommer"], "Er heißt Paul Sommer."),
      fill("ta1-w-2", 2, "Alter", ["19"], "Er ist 19."),
      fill("ta1-w-3", 3, "Land", ["Spanien"], "Er kommt aus Spanien."),
      fill("ta1-w-4", 4, "Adresse", ["Bergstraße 8", "Bergstrasse 8"], "Er wohnt in der Bergstraße 8."),
      fill("ta1-w-5", 5, "Sport", ["Fußball", "Fussball"], "Er spielt Fußball."),
    ],
  },
  {
    id: "ta1-schreiben-2",
    number: 2,
    title: "Karte",
    maxRaw: 10,
    instruction: "Schreiben Sie eine Karte, etwa 30 Wörter.",
    stimuli: [],
    items: [],
    writing: {
      id: "ta1-schreiben-2",
      register: "informell",
      targetWords: 30,
      minWords: 20,
      maxWords: 45,
      situation: "Sie schreiben einer Freundin, dass Sie am Sonntag Geburtstag feiern.",
      bullets: ["Wann ist die Feier?", "Wo ist die Feier?", "Was soll sie mitbringen?"],
      signals: [["sonntag", "uhr"], ["garten", "wohnung", "café", "cafe", "park"], ["blumen", "salat", "kuchen", "mitbring"]],
      rubric: [
        { id: "erfuellung", label: "Inhalt", max: 9 },
        { id: "textsorte", label: "Textsorte", max: 1 },
      ],
    },
  },
];

const sprechen: Teil[] = [1, 2, 3].map((number) => {
  const specs = [
    { title: "Sich vorstellen", max: 3, minutes: 3, prompts: ["Name", "Land", "Wohnort", "Hobby"], check: ["Name", "Land oder Wohnort", "Hobby"], e: 2, i: 1, audio: "Stellen Sie sich vor." },
    { title: "Einkaufen", max: 6, minutes: 4, prompts: ["Was kaufen Sie?", "Wo?", "Wie viel?"], check: ["Frage gestellt", "Antwort gegeben"], e: 4, i: 2, audio: "Sprechen Sie über Einkaufen." },
    { title: "Um Hilfe bitten", max: 6, minutes: 4, prompts: ["Bitten Sie um den Weg zum Bahnhof.", "Reagieren Sie auf eine Bitte."], check: ["Bitte formuliert", "reagiert"], e: 4, i: 2, audio: "Formulieren Sie eine Bitte." },
  ][number - 1];
  return {
    id: `ta1-sprechen-${number}`,
    number,
    title: specs.title,
    maxRaw: specs.max,
    instruction: specs.audio,
    stimuli: [],
    items: [],
    speaking: {
      id: `ta1-sprechen-${number}`,
      minutes: specs.minutes,
      situation: specs.audio,
      prompts: specs.prompts,
      checklist: specs.check,
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: specs.e },
        { id: "interaktion", label: "Interaktion", max: specs.i },
      ],
      examinerAudio: narrate(`ta1-s-t${number}`, [`Teil ${number}. ${specs.audio}`]),
    },
  } satisfies Teil;
});

export const telcA1Mock: MockExam = {
  id: "telc-a1-mock-1",
  trackId: "telc-a1",
  provider: "telc",
  level: "A1",
  title: "telc Deutsch A1 · Übungssatz 1",
  isFree: true,
  label: "Beispieldaten",
  formalities: { minutes: 5 },
  scoring: { kind: "telc-60", max: 60, pass: 36, grades: [[54, "sehr gut"], [48, "gut"], [42, "befriedigend"], [36, "ausreichend"]] },
  breaks: [],
  modules: [
    { id: "hoeren", skill: "hoeren", title: "Hören", minutes: 20, intro: { text: "Hören hat drei Teile, etwa 20 Minuten.", audio: narrate("ta1-h-intro", ["Modul Hören.", "Sie hören kurze Gespräche und Ansagen.", "Am Ende jeder Pause hören Sie dieses Signal.", "Am Ende schreiben Sie die Lösungen auf den Antwortbogen."]) }, teile: hoeren },
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 25, intro: { text: "Lesen hat drei Teile, 25 Minuten." }, teile: lesen },
    { id: "schreiben", skill: "schreiben", title: "Schreiben", minutes: 20, intro: { text: "Schreiben dauert 20 Minuten." }, teile: schreiben },
    { id: "sprechen", skill: "sprechen", title: "Sprechen", minutes: 15, intro: { text: "Sprechen dauert etwa 15 Minuten in der Gruppe." }, teile: sprechen },
  ],
};

const problems = [...assertVoices(telcA1Mock, NARRATOR), ...assertTeilCounts(telcA1Mock, [
  { skill: "hoeren", counts: [6, 4, 5], plays: [2, 1, 2], voices: [2, 1, 1] },
  { skill: "lesen", counts: [5, 5, 5] },
  { skill: "schreiben", counts: [5, 0] },
])];
if (problems.length) throw new Error(problems.join("\n"));
