import type { MockExam, Teil } from "@/lib/exam-model";
import { ANDREW, AVA, BRIAN, EMMA, INGRID, JAN, JONAS, LENI, NARRATOR, REMY, TANJA } from "@/content/exams/voices";
import { dialogue, fill, mc, narrate, rf } from "@/content/exams/factory";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";

const twice = { plays: 2 as const, readSeconds: 10, betweenPlaysSeconds: 3, answerSeconds: 12 };
const once = { plays: 1 as const, readSeconds: 10, betweenPlaysSeconds: 0, answerSeconds: 12 };

const hoeren: Teil[] = [
  {
    id: "ta2-hoeren-1",
    number: 1,
    title: "Telefonnotizen",
    maxRaw: 5,
    instruction: "Sie hören fünf Telefonnachrichten, jede zweimal. Ergänzen Sie ein Wort oder eine Zahl.",
    introAudio: narrate("ta2-h-t1-intro", ["Teil 1.", "Sie hören fünf kurze Nachrichten.", "Sie hören jede Nachricht zweimal.", "Schreiben Sie das fehlende Wort oder die Zahl."]),
    endAudio: narrate("ta2-h-t1-ende", ["Ende von Teil 1."]),
    stimuli: [
      ["1", TANJA, "Guten Tag, hier ist die Zahnarztpraxis. Ihr Termin ist am Donnerstag um zehn Uhr."],
      ["2", JONAS, "Hallo, hier ist der Fahrkartenschalter. Ihre Karte liegt am Schalter drei bereit."],
      ["3", INGRID, "Hallo, kurze Info zum Meeting. Es ist in Raum zwölf, nicht in Raum zwei."],
      ["4", JAN, "Bitte rufen Sie uns zurück. Die Nummer ist vier fünf eins, drei zwei null."],
      ["5", LENI, "Hallo, hier ist die Volkshochschule. Der Kurs kostet achtzig Euro, Material inklusive."],
    ].map(([n, who, text]) => ({
      kind: "audio" as const,
      id: `ta2-h-${n}`,
      itemIds: [`ta2-h-${n}`],
      audio: dialogue(`ta2-h-${n}`, [who as typeof TANJA], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof TANJA, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...twice, situation: "Sie hören eine Nachricht auf der Mailbox.", scene: "phone", readCue: `Nummer ${n}.` }),
    })),
    items: [
      fill("ta2-h-1", 1, "Tag des Termins", ["Donnerstag"], "Der Termin ist am Donnerstag."),
      fill("ta2-h-2", 2, "Schalter", ["3", "drei"], "Schalter drei."),
      fill("ta2-h-3", 3, "Raum", ["12", "zwölf", "zwoelf"], "Raum zwölf."),
      fill("ta2-h-4", 4, "Die letzten drei Ziffern", ["320", "drei zwei null"], "Die Nummer endet auf drei zwei null."),
      fill("ta2-h-5", 5, "Preis in Euro", ["80", "achtzig"], "Achtzig Euro."),
    ],
  },
  {
    id: "ta2-hoeren-2",
    number: 2,
    title: "Radio",
    maxRaw: 5,
    instruction: "Sie hören fünf Radiomeldungen, jede einmal. Wählen Sie a, b oder c.",
    introAudio: narrate("ta2-h-t2-intro", ["Teil 2.", "Sie hören fünf Informationen im Radio.", "Sie hören jede Information nur einmal."]),
    endAudio: narrate("ta2-h-t2-ende", ["Ende von Teil 2."]),
    stimuli: [
      ["6", ANDREW, "Und nun das Wetter. Morgen wird es sonnig und warm, etwa 24 Grad. Heute regnet es noch."],
      ["7", BRIAN, "Verkehr. Die Autobahn 7 ist zwischen Kirchfeld und dem See gesperrt. Bitte nehmen Sie die Landstraße."],
      ["8", EMMA, "Sport. Im Stadion spielt heute die Heimatmannschaft. Anstoß ist um achtzehn Uhr, nicht um sechzehn."],
      ["9", REMY, "Fähre nach Holm. Die Abendfahrten fallen aus. Die letzte Fahrt ist um fünfzehn Uhr."],
      ["10", AVA, "Hinweis für die Innenstadt. Morgen ist Markt. Die Straßenbahn Linie 2 fährt nicht."],
    ].map(([n, who, text]) => ({
      kind: "audio" as const,
      id: `ta2-h-${n}`,
      itemIds: [`ta2-h-${n}`],
      audio: dialogue(`ta2-h-${n}`, [who as typeof TANJA], (text as string).split(". ").filter(Boolean).map((sentence) => ({ who: who as typeof TANJA, text: sentence.endsWith(".") ? sentence : `${sentence}.` })), { ...once, situation: "Sie hören eine Meldung im Radio.", scene: "radio", readCue: `Nummer ${n}.` }),
    })),
    items: [
      mc("ta2-h-6", 6, "Wie wird das Wetter morgen?", [{ id: "a", label: "Regen" }, { id: "b", label: "sonnig, etwa 24 Grad" }, { id: "c", label: "Schnee" }], "b", "Morgen sonnig und warm."),
      mc("ta2-h-7", 7, "Welche Straße soll man nehmen?", [{ id: "a", label: "die Autobahn" }, { id: "b", label: "die Landstraße" }, { id: "c", label: "den Feldweg" }], "b", "Die Autobahn ist gesperrt."),
      mc("ta2-h-8", 8, "Wann ist Anstoß?", [{ id: "a", label: "um 16 Uhr" }, { id: "b", label: "um 18 Uhr" }, { id: "c", label: "um 20 Uhr" }], "b", "Um achtzehn Uhr."),
      mc("ta2-h-9", 9, "Wann fährt die letzte Fähre?", [{ id: "a", label: "um 15 Uhr" }, { id: "b", label: "am Abend" }, { id: "c", label: "um Mitternacht" }], "a", "Die letzte Fahrt ist um fünfzehn Uhr."),
      mc("ta2-h-10", 10, "Was fährt morgen nicht?", [{ id: "a", label: "der Bus 4" }, { id: "b", label: "die Straßenbahn Linie 2" }, { id: "c", label: "der Zug" }], "b", "Linie 2 fährt nicht."),
    ],
  },
  {
    id: "ta2-hoeren-3",
    number: 3,
    title: "Gespräch",
    maxRaw: 5,
    instruction: "Sie hören ein Gespräch zweimal. Wohin geht welche Person? Aufgaben 11 bis 15.",
    options: [
      { id: "a", label: "a Bibliothek" },
      { id: "b", label: "b Schwimmbad" },
      { id: "c", label: "c Markt" },
      { id: "d", label: "d Bahnhof" },
      { id: "e", label: "e Apotheke" },
      { id: "f", label: "f Schule" },
    ],
    introAudio: narrate("ta2-h-t3-intro", ["Teil 3.", "Sie hören ein Gespräch.", "Sie hören das Gespräch zweimal."]),
    endAudio: narrate("ta2-h-t3-ende", ["Ende des Hörtests."]),
    stimuli: [
      {
        kind: "audio",
        id: "ta2-h-t3",
        itemIds: ["ta2-h-11", "ta2-h-12", "ta2-h-13", "ta2-h-14", "ta2-h-15"],
        audio: dialogue("ta2-h-t3", [TANJA, JONAS], [
          { who: TANJA, text: "Also, ich geh' zuerst in die Apotheke, dann auf den Markt." },
          { who: JONAS, text: "Ich bring' das Buch in die Bibliothek zurück." },
          { who: TANJA, text: "Unsere Tochter ist in der Schule bis eins." },
          { who: JONAS, text: "Danach hol' ich sie ab, und wir gehen ins Schwimmbad, nicht zum Bahnhof." },
          { who: TANJA, text: "Gut. Den Zug nehmen wir erst morgen." },
        ], { ...twice, situation: "Sie hören zwei Eltern in der Küche. Sie planen den Vormittag.", scene: "quiet" }),
      },
    ],
    items: [
      { id: "ta2-h-11", number: 11, type: "match" as const, prompt: "Die Frau zuerst", correct: "e", points: 1, explanation: "Zuerst in die Apotheke." },
      { id: "ta2-h-12", number: 12, type: "match" as const, prompt: "Die Frau danach", correct: "c", points: 1, explanation: "Dann auf den Markt." },
      { id: "ta2-h-13", number: 13, type: "match" as const, prompt: "Der Mann mit dem Buch", correct: "a", points: 1, explanation: "Er bringt das Buch in die Bibliothek." },
      { id: "ta2-h-14", number: 14, type: "match" as const, prompt: "Die Tochter bis 13 Uhr", correct: "f", points: 1, explanation: "Sie ist in der Schule." },
      { id: "ta2-h-15", number: 15, type: "match" as const, prompt: "Vater und Tochter danach", correct: "b", points: 1, explanation: "Sie gehen ins Schwimmbad." },
    ],
  },
];

const floor = `Erdgeschoss: Anmeldung und Kasse.
Erster Stock: Kursräume A bis D.
Zweiter Stock: Computerkabinett und Prüfungssaal.
Dritter Stock: Café. Aufzug bis zum zweiten Stock, das Café nur über die Treppe.
Toiletten im Erdgeschoss.`;

const paper = `Das Stadtfest beginnt am Freitag um 16 Uhr und endet am Sonntagabend. Der Eintritt ist frei. Essen gibt es auf dem Marktplatz, nicht im Park. Bei Regen findet das Konzert in der Halle statt, nicht draußen. Kinder unter 12 zahlen für das Karussell nichts.`;

const ads = ["a Sprachcafé dienstags", "b Fahrradverleih am See", "c Nachhilfe Mathe", "d Kochabend freitags", "e Hundesitter am Wochenende", "f Möbelmarkt sonntags", "g Yoga im Park sonntags 9 Uhr", "h Computerkurs montags"].map((line) => {
  const id = line[0];
  return { id, label: line };
});

const lesen: Teil[] = [
  {
    id: "ta2-lesen-1",
    number: 1,
    title: "Im Haus",
    maxRaw: 5,
    instruction: "Wohin gehen Sie? Aufgaben 1 bis 5. Manchmal ein anderes Stockwerk.",
    stimuli: [{ kind: "text", id: "ta2-floor", title: "Sprachenschule Holm", body: floor, genre: "sign" }],
    items: [
      mc("ta2-l-1", 1, "Sie möchten sich anmelden.", [{ id: "a", label: "Erdgeschoss" }, { id: "b", label: "erster Stock" }, { id: "c", label: "anderes Stockwerk" }], "a", "Anmeldung im Erdgeschoss."),
      mc("ta2-l-2", 2, "Sie suchen Kursraum B.", [{ id: "a", label: "Erdgeschoss" }, { id: "b", label: "erster Stock" }, { id: "c", label: "zweiter Stock" }], "b", "Kursräume im ersten Stock."),
      mc("ta2-l-3", 3, "Sie haben eine Prüfung.", [{ id: "a", label: "erster Stock" }, { id: "b", label: "zweiter Stock" }, { id: "c", label: "dritter Stock" }], "b", "Prüfungssaal im zweiten Stock."),
      mc("ta2-l-4", 4, "Sie möchten ins Café.", [{ id: "a", label: "mit dem Aufzug" }, { id: "b", label: "über die Treppe in den dritten Stock" }, { id: "c", label: "im Erdgeschoss" }], "b", "Der Aufzug endet im zweiten Stock."),
      mc("ta2-l-5", 5, "Sie suchen die Toilette.", [{ id: "a", label: "Erdgeschoss" }, { id: "b", label: "zweiter Stock" }, { id: "c", label: "dritter Stock" }], "a", "Toiletten im Erdgeschoss."),
    ],
  },
  {
    id: "ta2-lesen-2",
    number: 2,
    title: "Stadtfest",
    maxRaw: 5,
    instruction: "Richtig (+) oder falsch (−)? Aufgaben 6 bis 10.",
    stimuli: [{ kind: "text", id: "ta2-paper", title: "Stadtfest", body: paper, genre: "article" }],
    items: [
      rf("ta2-l-6", 6, "Das Fest beginnt am Samstag.", "falsch", "Es beginnt am Freitag um 16 Uhr."),
      rf("ta2-l-7", 7, "Der Eintritt ist frei.", "richtig", "Das steht im Text."),
      rf("ta2-l-8", 8, "Essen gibt es im Park.", "falsch", "Auf dem Marktplatz, nicht im Park."),
      rf("ta2-l-9", 9, "Bei Regen ist das Konzert in der Halle.", "richtig", "Nicht draußen."),
      rf("ta2-l-10", 10, "Kinder unter 12 zahlen für das Karussell.", "falsch", "Sie zahlen nichts."),
    ],
  },
  {
    id: "ta2-lesen-3",
    number: 3,
    title: "Anzeigen",
    maxRaw: 5,
    allowNone: true,
    noneLabel: "x – keine Anzeige",
    instruction: "Welche Anzeige passt? Aufgaben 11 bis 15. Einmal gibt es keine.",
    options: ads,
    stimuli: ads.map((ad) => ({ kind: "text" as const, id: `ta2-ad-${ad.id}`, title: ad.label, body: ad.label, genre: "ad" as const })),
    items: [
      { id: "ta2-l-11", number: 11, type: "match" as const, prompt: "Sie möchten abends Deutsch üben.", correct: "a", points: 1, explanation: "Sprachcafé dienstags." },
      { id: "ta2-l-12", number: 12, type: "match" as const, prompt: "Sie brauchen am See ein Fahrrad.", correct: "b", points: 1, explanation: "Fahrradverleih am See." },
      { id: "ta2-l-13", number: 13, type: "match" as const, prompt: "Ihr Kind braucht Hilfe in Mathematik.", correct: "c", points: 1, explanation: "Nachhilfe Mathe." },
      { id: "ta2-l-14", number: 14, type: "match" as const, prompt: "Sie möchten freitags kochen.", correct: "d", points: 1, explanation: "Kochabend freitags." },
      { id: "ta2-l-15", number: 15, type: "match" as const, prompt: "Sie suchen einen Klavierlehrer.", correct: "0", points: 1, explanation: "Keine Anzeige bietet Klavier an." },
    ],
  },
];

const schreiben: Teil[] = [
  {
    id: "ta2-schreiben-1",
    number: 1,
    title: "Formular",
    maxRaw: 5,
    instruction: "Eine Bekannte möchte einen Computerkurs. Füllen Sie das Formular aus.",
    stimuli: [{ kind: "text", id: "ta2-who", title: "Lea", body: "Ich bin Lea Kurz, 34 Jahre alt, aus Portugal. Ich wohne in der Mühlenstraße 2. Ich möchte den Kurs am Montagmorgen.", genre: "email" }],
    items: [
      fill("ta2-w-1", 1, "Name", ["Lea Kurz"], "Lea Kurz."),
      fill("ta2-w-2", 2, "Alter", ["34"], "34 Jahre."),
      fill("ta2-w-3", 3, "Land", ["Portugal"], "Aus Portugal."),
      fill("ta2-w-4", 4, "Straße", ["Mühlenstraße 2", "Muehlenstrasse 2", "Mühlenstraße"], "Mühlenstraße 2."),
      fill("ta2-w-5", 5, "Kurszeit", ["Montagmorgen", "Montag morgen", "montagmorgen"], "Montagmorgen."),
    ],
  },
  {
    id: "ta2-schreiben-2",
    number: 2,
    title: "Nachricht",
    maxRaw: 10,
    instruction: "Schreiben Sie eine Nachricht, etwa 40 Wörter. Wählen Sie 3 von 4 Punkten. Anrede und Gruß nicht vergessen.",
    stimuli: [],
    items: [],
    writing: {
      id: "ta2-schreiben-2",
      register: "halbformell",
      targetWords: 40,
      minWords: 30,
      maxWords: 60,
      requiredBullets: 3,
      situation: "Schreiben Sie an die Kursleitung. Wählen Sie drei der vier Punkte.",
      bullets: ["Sie können am Montag nicht kommen.", "Nennen Sie den Grund.", "Fragen Sie nach einem anderen Tag.", "Fragen Sie nach den Hausaufgaben."],
      signals: [["montag", "nicht"], ["krank", "arbeit", "arzt"], ["anderen tag", "dienstag", "nachhol", "wechseln"], ["hausaufgabe", "übung", "uebung"]],
      rubric: [
        { id: "erfuellung", label: "Inhalt", max: 9 },
        { id: "textsorte", label: "Anrede und Gruß", max: 1 },
      ],
    },
  },
];

const sprechen: Teil[] = [
  { n: 1, title: "Sich vorstellen", max: 5, e: 3, i: 2, text: "Stellen Sie sich vor." },
  { n: 2, title: "Alltag", max: 5, e: 3, i: 2, text: "Fragen Sie und antworten Sie zum Thema Freizeit." },
  { n: 3, title: "Termin finden", max: 5, e: 3, i: 2, text: "Finden Sie einen gemeinsamen Termin." },
].map((spec) => ({
  id: `ta2-sprechen-${spec.n}`,
  number: spec.n,
  title: spec.title,
  maxRaw: spec.max,
  instruction: spec.text,
  stimuli: [] as Teil["stimuli"],
  items: [] as Teil["items"],
  speaking: {
    id: `ta2-sprechen-${spec.n}`,
    minutes: 4,
    situation: spec.text,
    prompts: [spec.text],
    checklist: ["Aufgabe begonnen", "auf die Partnerin reagiert"],
    rubric: [
      { id: "erfuellung", label: "Aufgabenerfüllung", max: spec.e },
      { id: "interaktion", label: "Interaktion", max: spec.i },
    ],
    examinerAudio: narrate(`ta2-s-t${spec.n}`, [`Teil ${spec.n}. ${spec.text}`]),
  },
}));

export const telcA2Mock: MockExam = {
  id: "telc-a2-mock-1",
  trackId: "telc-a2",
  provider: "telc",
  level: "A2",
  title: "telc Deutsch A2 · Übungssatz 1",
  isFree: true,
  label: "Beispieldaten",
  formalities: { minutes: 10 },
  scoring: { kind: "telc-60", max: 60, pass: 36, grades: [[54, "sehr gut"], [48, "gut"], [42, "befriedigend"], [36, "ausreichend"]] },
  breaks: [],
  modules: [
    { id: "hoeren", skill: "hoeren", title: "Hören", minutes: 20, intro: { text: "Hören hat drei Teile, etwa 20 Minuten.", audio: narrate("ta2-h-intro", ["Modul Hören.", "Sie hören Nachrichten, Radio und ein Gespräch."]) }, teile: hoeren },
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 50, intro: { text: "Lesen und Schreiben haben zusammen 50 Minuten. Sie wählen die Reihenfolge." }, teile: lesen },
    { id: "schreiben", skill: "schreiben", title: "Schreiben", minutes: 50, sharedClockWith: "lesen", intro: { text: "Schreiben gehört zum Block mit dem Lesen." }, teile: schreiben },
    { id: "sprechen", skill: "sprechen", title: "Sprechen", minutes: 15, intro: { text: "Sprechen dauert etwa 15 Minuten zu zweit." }, teile: sprechen },
  ],
};

const problems = [...assertVoices(telcA2Mock, NARRATOR), ...assertTeilCounts(telcA2Mock, [
  { skill: "hoeren", counts: [5, 5, 5], plays: [2, 1, 2], voices: [1, 1, 2] },
  { skill: "lesen", counts: [5, 5, 5] },
  { skill: "schreiben", counts: [5, 0] },
])];
if (problems.length) throw new Error(problems.join("\n"));
