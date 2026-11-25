import type { Teil } from "@/lib/exam-model";
import { mc } from "@/content/exams/factory";

const article = `Im Stadtteil Nord gibt es seit März einen Repair-Treff. Jeden ersten Samstag im Monat helfen Freiwillige bei kleinen Reparaturen: Lampe, Hose, Fahrrad. Der Treff ist im Bürgerhaus, Raum 2, von zehn bis dreizehn Uhr. Man muss nichts bezahlen, aber bitte das kaputte Teil und, wenn möglich, ein passendes Werkzeug mitbringen. Große Geräte wie Waschmaschinen nehmen die Helfer nicht an. Eine Anmeldung ist nicht nötig.`;

const board = `Erdgeschoss: Information und Kasse.
Erster Stock: Kleider und Schuhe.
Zweiter Stock: Café und Spiele für Kinder.
Dritter Stock: Möbel. Der Aufzug fährt bis zum dritten Stock.
Die Toiletten sind im Erdgeschoss neben der Kasse.`;

const mail = `Hallo Sara,
danke für die Einladung am Freitag. Ich kann erst um neunzehn Uhr kommen, weil ich bis achtzehn Uhr arbeite. Ich bringe einen Salat mit, aber keinen Kuchen. Kann ich bei dir übernachten? Mein Zug am Samstag fährt erst um elf.
Liebe Grüße
Mira`;

const ads = [
  ["a", "Sprachcafé, dienstags 19 Uhr, kostenlos"],
  ["b", "Fahrradwerkstatt, ohne Termin, mittwochs bis freitags"],
  ["c", "Gitarrenunterricht, 20 Euro pro Stunde, ab 10 Jahren"],
  ["d", "Mitfahrgelegenheit nach Hamburg, freitags, 15 Euro"],
  ["e", "Kochkurs für Anfänger, vier Abende, 60 Euro"],
  ["f", "Hundeschule am Wochenende, Anmeldung per E-Mail"],
];

export const a2Lesen: Teil[] = [
  {
    id: "ga2-lesen-1",
    number: 1,
    title: "Zeitung",
    maxRaw: 5,
    suggestedMinutes: 8,
    instruction: "Lesen Sie den Text. Wählen Sie bei den Aufgaben 1 bis 5 die richtige Lösung.",
    stimuli: [{ kind: "text", id: "ga2-l1", title: "Reparieren statt wegwerfen", body: article, genre: "article" }],
    items: [
      mc("ga2-l-1", 1, "Wie oft ist der Repair-Treff?", [{ id: "a", label: "jeden Samstag" }, { id: "b", label: "jeden ersten Samstag im Monat" }, { id: "c", label: "jeden Tag" }], "b", "Jeden ersten Samstag im Monat."),
      mc("ga2-l-2", 2, "Wo ist der Treff?", [{ id: "a", label: "im Bürgerhaus, Raum 2" }, { id: "b", label: "im Rathaus" }, { id: "c", label: "in der Bibliothek" }], "a", "Im Bürgerhaus, Raum 2."),
      mc("ga2-l-3", 3, "Was kostet die Hilfe?", [{ id: "a", label: "zehn Euro" }, { id: "b", label: "nichts" }, { id: "c", label: "nur das Werkzeug" }], "b", "Man muss nichts bezahlen."),
      mc("ga2-l-4", 4, "Was bringen die Leute mit?", [{ id: "a", label: "das kaputte Teil" }, { id: "b", label: "eine Waschmaschine" }, { id: "c", label: "etwas zu essen" }], "a", "Das kaputte Teil, wenn möglich mit Werkzeug."),
      mc("ga2-l-5", 5, "Braucht man eine Anmeldung?", [{ id: "a", label: "ja, per E-Mail" }, { id: "b", label: "ja, am Vortag" }, { id: "c", label: "nein" }], "c", "Eine Anmeldung ist nicht nötig."),
    ],
  },
  {
    id: "ga2-lesen-2",
    number: 2,
    title: "Im Kaufhaus",
    maxRaw: 5,
    suggestedMinutes: 7,
    instruction: "Lesen Sie den Plan. Aufgaben 6 bis 10.",
    stimuli: [{ kind: "text", id: "ga2-l2", title: "Kaufhaus Linden", body: board, genre: "sign" }],
    items: [
      mc("ga2-l-6", 6, "Wo kaufen Sie eine Jacke?", [{ id: "a", label: "im Erdgeschoss" }, { id: "b", label: "im ersten Stock" }, { id: "c", label: "im dritten Stock" }], "b", "Kleider sind im ersten Stock."),
      mc("ga2-l-7", 7, "Wo ist das Café?", [{ id: "a", label: "im ersten Stock" }, { id: "b", label: "im zweiten Stock" }, { id: "c", label: "im dritten Stock" }], "b", "Café und Spiele sind im zweiten Stock."),
      mc("ga2-l-8", 8, "Wo sind die Toiletten?", [{ id: "a", label: "neben der Kasse" }, { id: "b", label: "im zweiten Stock" }, { id: "c", label: "im Aufzug" }], "a", "Im Erdgeschoss neben der Kasse."),
      mc("ga2-l-9", 9, "Wohin fährt der Aufzug?", [{ id: "a", label: "nur bis zum ersten Stock" }, { id: "b", label: "bis zum dritten Stock" }, { id: "c", label: "er fährt nicht" }], "b", "Der Aufzug fährt bis zum dritten Stock."),
      mc("ga2-l-10", 10, "Wo finden Sie ein Sofa?", [{ id: "a", label: "bei den Schuhen" }, { id: "b", label: "im Café" }, { id: "c", label: "im dritten Stock" }], "c", "Möbel sind im dritten Stock."),
    ],
  },
  {
    id: "ga2-lesen-3",
    number: 3,
    title: "E-Mail",
    maxRaw: 5,
    suggestedMinutes: 7,
    instruction: "Lesen Sie die E-Mail. Aufgaben 11 bis 15.",
    stimuli: [{ kind: "text", id: "ga2-l3", title: "E-Mail von Mira", body: mail, genre: "email" }],
    items: [
      mc("ga2-l-11", 11, "Wann kann Mira kommen?", [{ id: "a", label: "um 18 Uhr" }, { id: "b", label: "um 19 Uhr" }, { id: "c", label: "um 20 Uhr" }], "b", "Sie kann erst um neunzehn Uhr kommen."),
      mc("ga2-l-12", 12, "Warum kommt sie später?", [{ id: "a", label: "Sie arbeitet bis 18 Uhr." }, { id: "b", label: "Der Zug hat Verspätung." }, { id: "c", label: "Sie findet die Wohnung nicht." }], "a", "Sie arbeitet bis achtzehn Uhr."),
      mc("ga2-l-13", 13, "Was bringt Mira mit?", [{ id: "a", label: "einen Kuchen" }, { id: "b", label: "einen Salat" }, { id: "c", label: "nichts" }], "b", "Einen Salat, keinen Kuchen."),
      mc("ga2-l-14", 14, "Was möchte Mira?", [{ id: "a", label: "bei Sara übernachten" }, { id: "b", label: "früher gehen" }, { id: "c", label: "den Termin absagen" }], "a", "Sie fragt, ob sie übernachten kann."),
      mc("ga2-l-15", 15, "Wann fährt Miras Zug am Samstag?", [{ id: "a", label: "um 9 Uhr" }, { id: "b", label: "um 10 Uhr" }, { id: "c", label: "um 11 Uhr" }], "c", "Der Zug fährt um elf."),
    ],
  },
  {
    id: "ga2-lesen-4",
    number: 4,
    title: "Anzeigen",
    maxRaw: 5,
    suggestedMinutes: 8,
    allowNone: true,
    noneLabel: "x – keine passende Anzeige",
    instruction: "Welche Anzeige passt? Aufgaben 16 bis 20. Manchmal passt keine. Das Beispiel ist gelöst und belegt keine der Aufgaben.",
    options: ads.map(([id, label]) => ({ id, label: `${id} · ${label}` })),
    stimuli: ads.map(([id, body]) => ({ kind: "text" as const, id: `ga2-ad-${id}`, title: `${id}`, body, genre: "ad" as const })),
    example: { id: "ga2-l-bsp", number: 0, type: "match", prompt: "Sie möchten abends kostenlos Deutsch sprechen.", correct: "a", points: 0, explanation: "Das Sprachcafé ist dienstags abends und kostenlos." },
    items: [
      { id: "ga2-l-16", number: 16, type: "match" as const, prompt: "Ihr Fahrrad ist kaputt und Sie haben keinen Termin.", correct: "b", points: 1, explanation: "Die Werkstatt arbeitet ohne Termin." },
      { id: "ga2-l-17", number: 17, type: "match" as const, prompt: "Ihr Kind ist 12 und möchte Gitarre lernen.", correct: "c", points: 1, explanation: "Gitarrenunterricht ab 10 Jahren." },
      { id: "ga2-l-18", number: 18, type: "match" as const, prompt: "Sie wollen freitags nach Hamburg mitfahren.", correct: "d", points: 1, explanation: "Die Mitfahrgelegenheit fährt freitags." },
      { id: "ga2-l-19", number: 19, type: "match" as const, prompt: "Sie möchten abends kochen lernen und sind Anfänger.", correct: "e", points: 1, explanation: "Der Kochkurs ist für Anfänger und dauert vier Abende." },
      { id: "ga2-l-20", number: 20, type: "match" as const, prompt: "Sie suchen einen Klavierlehrer für morgen früh.", correct: "0", points: 1, explanation: "Keine Anzeige bietet Klavierunterricht am Morgen." },
    ],
  },
];
