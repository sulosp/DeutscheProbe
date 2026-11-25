import type { Teil } from "@/lib/exam-model";
import { mc } from "@/content/exams/factory";

const posts = [
  ["a", "Mara", "Ich fahre seit einem Jahr nur noch mit dem Rad zur Arbeit. Das dauert 25 Minuten. Im Winter nehme ich manchmal den Bus, aber nie das Auto. Ein Auto habe ich verkauft."],
  ["b", "Jonas", "Ich habe noch ein Auto, weil meine Eltern auf dem Land wohnen. In der Stadt fahre ich Bahn. Das Rad ist mir zu gefährlich. Homeoffice mache ich zwei Tage."],
  ["c", "Selin", "Ich arbeite nur im Büro, fünf Tage. Zur Arbeit laufe ich zehn Minuten. Weder Rad noch Auto. Abends koche ich für die Nachbarn, einmal im Monat."],
  ["d", "Herr Kruse", "Ich bin im Ruhestand und fahre gern lange Radtouren, aber nicht zur Arbeit. Ein Auto behalte ich für den Einkauf. Bahn fahre ich selten."],
];

const article = `Die Stadtbücherei Nordhafen leiht seit diesem Jahr auch Werkzeug aus. Wer einen Ausweis hat, kann eine Bohrmaschine sieben Tage behalten. Bücher bleiben drei Wochen. Einen Pfand gibt es nicht. Wer Gebühren offen hat, bekommt nichts.

Am Samstag zeigt eine Mitarbeiterin, wie man ein Regal aufhängt. Der Kurs ist kostenlos und nur für Menschen mit Ausweis. Er findet im Keller statt, nicht im Lesesaal. Die Leiter ist das zweitbeliebteste Gerät, nach der Bohrmaschine.`;

const gaps = `Viele Menschen arbeiten heute einen Teil der Woche zu Hause. [1] In einem Betrieb in Kirchfeld bleiben die Büros dienstags und donnerstags leer. [2] Die Werkstatt arbeitet weiter an fünf Tagen, weil die Maschinen vor Ort stehen. [3] Nach einem Jahr gab es weniger Krankmeldungen. [4] Zwei Gruppen sagen aber, die langen Tage seien schwer. [5] Das Büro bleibt bei vier Tagen. [6] Neue Stellen werden mit dem gleichen Lohn ausgeschrieben.`;

const sentences = [
  ["a", "Dort gilt seit einem Jahr die Vier-Tage-Woche."],
  ["b", "Der Lohn ist dabei gleich geblieben."],
  ["c", "Sie darf selbst zwischen vier und fünf Tagen wählen."],
  ["d", "Trotzdem wollen manche lieber im Büro sein."],
  ["e", "Der Kurs kostet extra zwanzig Euro."],
  ["f", "Die Leitung behält das Modell."],
  ["g", "Am Wochenende ist die Kantine zu."],
  ["h", "Deshalb sucht die Firma weiter Personal."],
];

const headings = [
  ["a", "Mehr Grün in der Stadt"],
  ["b", "Teurer Wohnraum"],
  ["c", "Bessere Busse"],
  ["d", "Lärm in der Nacht"],
  ["e", "Schulen am Nachmittag"],
  ["f", "Zu wenig Sportplätze"],
  ["g", "Digitale Behördengänge"],
];

const rules = `§1 Die Ruhezeit im Wohnheim beginnt um 22 Uhr.
§2 Gäste über Nacht müssen einen Tag vorher gemeldet werden.
§3 Fahrräder stehen nur im Fahrradraum.
§4 Ein verlorener Schlüssel kostet 30 Euro.`;

const toc = [
  ["a", "Ruhezeit"],
  ["b", "Gäste"],
  ["c", "Fahrräder"],
  ["d", "Schlüssel"],
  ["e", "Haustiere"],
  ["f", "Musikunterricht"],
  ["g", "Parkplätze"],
];

export const b2Lesen: Teil[] = [
  {
    id: "gb2-lesen-1",
    number: 1,
    title: "Forum",
    maxRaw: 9,
    suggestedMinutes: 18,
    allowReuse: true,
    instruction: "Wer sagt das? Die Personen a bis d können mehrfach passen. Aufgaben 1 bis 9.",
    options: [
      { id: "a", label: "a Mara" },
      { id: "b", label: "b Jonas" },
      { id: "c", label: "c Selin" },
      { id: "d", label: "d Herr Kruse" },
    ],
    stimuli: posts.map(([id, name, body]) => ({ kind: "text" as const, id: `gb2-post-${id}`, title: `${id} · ${name}`, body, genre: "forum" as const })),
    items: [
      ["1", "Fährt mit dem Rad zur Arbeit.", "a"],
      ["2", "Hat das Auto verkauft.", "a"],
      ["3", "Besucht die Eltern mit dem Auto.", "b"],
      ["4", "Findet das Rad zu gefährlich.", "b"],
      ["5", "Arbeitet zwei Tage zu Hause.", "b"],
      ["6", "Geht zu Fuß zur Arbeit.", "c"],
      ["7", "Kocht manchmal für die Nachbarn.", "c"],
      ["8", "Ist im Ruhestand.", "d"],
      ["9", "Behält ein Auto für den Einkauf.", "d"],
    ].map(([number, prompt, correct]) => ({
      id: `gb2-l-${number}`,
      number: Number(number),
      type: "match" as const,
      prompt,
      correct,
      points: 1,
      explanation: `Das steht im Beitrag ${correct}.`,
    })),
  },
  {
    id: "gb2-lesen-2",
    number: 2,
    title: "Lückentext",
    maxRaw: 6,
    suggestedMinutes: 12,
    instruction: "Welche Sätze passen in die Lücken 10 bis 15? Zwei Sätze passen nicht. Jeder Satz nur einmal.",
    options: sentences.map(([id, label]) => ({ id, label: `${id} ${label}` })),
    stimuli: [
      { kind: "text", id: "gb2-gap", title: "Vier Tage im Büro", body: gaps, genre: "article" },
    ],
    items: [
      ["10", "Lücke 1", "a"],
      ["11", "Lücke 2", "b"],
      ["12", "Lücke 3", "d"],
      ["13", "Lücke 4", "f"],
      ["14", "Lücke 5", "c"],
      ["15", "Lücke 6", "h"],
    ].map(([number, prompt, correct]) => ({
      id: `gb2-l-${number}`,
      number: Number(number),
      type: "gapBank" as const,
      prompt,
      correct,
      points: 1,
      explanation: `Satz ${correct} schließt hier an. Die Sätze e und g passen nicht.`,
    })),
  },
  {
    id: "gb2-lesen-3",
    number: 3,
    title: "Bericht",
    maxRaw: 6,
    suggestedMinutes: 12,
    instruction: "Lesen Sie den Bericht. Aufgaben 16 bis 21.",
    stimuli: [{ kind: "text", id: "gb2-article", title: "Bücher und Bohrmaschinen", body: article, genre: "article" }],
    items: [
      mc("gb2-l-16", 16, "Was kann man seit diesem Jahr ausleihen?", [{ id: "a", label: "nur Bücher" }, { id: "b", label: "auch Werkzeug" }, { id: "c", label: "Waschmaschinen" }], "b", "Die Bücherei leiht auch Werkzeug aus."),
      mc("gb2-l-17", 17, "Wie lange bleibt eine Bohrmaschine zu Hause?", [{ id: "a", label: "sieben Tage" }, { id: "b", label: "drei Wochen" }, { id: "c", label: "einen Monat" }], "a", "Werkzeug sieben Tage, Bücher drei Wochen."),
      mc("gb2-l-18", 18, "Was gilt ohne Ausweis?", [{ id: "a", label: "man zahlt Pfand" }, { id: "b", label: "man bekommt nichts" }, { id: "c", label: "man darf nur Bücher leihen" }], "b", "Ohne Ausweis und bei offenen Gebühren gibt es nichts. Einen Pfand gibt es nicht."),
      mc("gb2-l-19", 19, "Wer offene Gebühren hat, …", [{ id: "a", label: "zahlt nur für Werkzeug" }, { id: "b", label: "bekommt nichts ausgeliehen" }, { id: "c", label: "darf den Kurs besuchen" }], "b", "Wer Gebühren offen hat, bekommt nichts."),
      mc("gb2-l-20", 20, "Der Samstagskurs …", [{ id: "a", label: "kostet extra" }, { id: "b", label: "ist im Lesesaal" }, { id: "c", label: "ist kostenlos im Keller" }], "c", "Kostenlos, im Keller, nur mit Ausweis."),
      mc("gb2-l-21", 21, "Was wird am häufigsten ausgeliehen?", [{ id: "a", label: "die Leiter" }, { id: "b", label: "die Bohrmaschine" }, { id: "c", label: "das Regal" }], "b", "Die Leiter ist das zweitbeliebteste Gerät, nach der Bohrmaschine."),
    ],
  },
  {
    id: "gb2-lesen-4",
    number: 4,
    title: "Meinungen",
    maxRaw: 6,
    suggestedMinutes: 12,
    instruction: "Welche Überschrift passt zu welcher Meinung? Eine Überschrift bleibt übrig. Das Beispiel benutzt a. Aufgaben 22 bis 27.",
    options: headings.map(([id, label]) => ({ id, label: `${id} ${label}` })),
    stimuli: [
      { kind: "text", id: "gb2-op-b", title: "b", body: "Eine Zweizimmerwohnung kostet hier fast so viel wie früher ein Haus.", genre: "comment" },
      { kind: "text", id: "gb2-op-c", title: "c", body: "Nach 20 Uhr fährt in unser Dorf kein Bus mehr. Deshalb brauchen viele ein Auto.", genre: "comment" },
      { kind: "text", id: "gb2-op-d", title: "d", body: "Die Bars an der Ecke sind bis zwei Uhr laut. Ich schlafe mit geschlossenen Fenstern.", genre: "comment" },
      { kind: "text", id: "gb2-op-e", title: "e", body: "Die Kinder sind bis 16 Uhr in der Schule. Danach ist niemand für die Hausaufgaben da.", genre: "comment" },
      { kind: "text", id: "gb2-op-f", title: "f", body: "Der Verein hat 200 Kinder auf der Liste und nur einen Platz.", genre: "comment" },
      { kind: "text", id: "gb2-op-g", title: "g", body: "Den Ausweis kann ich nur online verlängern. Am Schalter geht es nicht mehr.", genre: "comment" },
    ],
    example: { id: "gb2-l-bsp4", number: 0, type: "match", prompt: "Die Stadt sollte mehr Bäume auf die Plätze stellen.", correct: "a", points: 0, explanation: "Das passt zu Mehr Grün in der Stadt." },
    items: [
      ["22", "Eine Zweizimmerwohnung kostet fast so viel wie früher ein Haus.", "b"],
      ["23", "Nach 20 Uhr fährt kein Bus mehr.", "c"],
      ["24", "Die Bars sind bis zwei Uhr laut.", "d"],
      ["25", "Die Kinder sind bis 16 Uhr in der Schule.", "e"],
      ["26", "Der Verein hat zu wenig Platz für 200 Kinder.", "f"],
      ["27", "Den Ausweis kann man nur online verlängern.", "g"],
    ].map(([number, prompt, correct]) => ({
      id: `gb2-l-${number}`,
      number: Number(number),
      type: "match" as const,
      prompt,
      correct,
      points: 1,
      explanation: `Die Überschrift ${correct} trifft diese Meinung. Überschrift a ist das Beispiel.`,
    })),
  },
  {
    id: "gb2-lesen-5",
    number: 5,
    title: "Hausordnung",
    maxRaw: 3,
    suggestedMinutes: 6,
    instruction: "Welche Überschrift passt zu welchem Paragraphen? Vier Überschriften bleiben übrig. Aufgaben 28 bis 30.",
    options: toc.map(([id, label]) => ({ id, label: `${id} ${label}` })),
    stimuli: [{ kind: "text", id: "gb2-rules", title: "Wohnheim", body: rules, genre: "rules" }],
    items: [
      { id: "gb2-l-28", number: 28, type: "match" as const, prompt: "§1 Die Ruhezeit beginnt um 22 Uhr.", correct: "a", points: 1, explanation: "Das ist die Ruhezeit." },
      { id: "gb2-l-29", number: 29, type: "match" as const, prompt: "§2 Gäste über Nacht müssen gemeldet werden.", correct: "b", points: 1, explanation: "Das betrifft Gäste." },
      { id: "gb2-l-30", number: 30, type: "match" as const, prompt: "§4 Ein verlorener Schlüssel kostet 30 Euro.", correct: "d", points: 1, explanation: "Das betrifft den Schlüssel. §3 über Fahrräder ist keine Aufgabe." },
    ],
  },
];
