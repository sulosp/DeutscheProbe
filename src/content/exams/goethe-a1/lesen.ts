import type { Teil } from "@/lib/exam-model";
import { ab, rf } from "@/content/exams/factory";

const noteA = `Hallo Ben,
die Feier ist am Samstag um 19 Uhr in der Parkstraße 5. Bitte bring ein Getränk mit. Essen ist schon da, du musst nichts zu essen mitbringen.
Lara`;

const noteB = `Liebe Kursteilnehmerinnen und Kursteilnehmer,
der Unterricht am Montag fällt aus. Die nächste Stunde ist am Mittwoch um 18 Uhr in Raum 3.
Ihre Kursleitung`;

export const a1Lesen: Teil[] = [
  {
    id: "ga1-lesen-1",
    number: 1,
    title: "Nachrichten",
    maxRaw: 5,
    suggestedMinutes: 10,
    instruction: "Lesen Sie die zwei Nachrichten und die Aufgaben 1 bis 5. Ist die Aussage richtig oder falsch?",
    stimuli: [
      { kind: "text", id: "ga1-l1-a", title: "Nachricht von Lara", body: noteA, genre: "email" },
      { kind: "text", id: "ga1-l1-b", title: "Nachricht der Kursleitung", body: noteB, genre: "email" },
    ],
    items: [
      rf("ga1-l-1", 1, "Die Feier ist am Sonntag.", "falsch", "Sie ist am Samstag um 19 Uhr."),
      rf("ga1-l-2", 2, "Ben soll etwas zu essen mitbringen.", "falsch", "Essen ist schon da. Er soll ein Getränk mitbringen."),
      rf("ga1-l-3", 3, "Die Feier ist in der Parkstraße.", "richtig", "Die Adresse ist Parkstraße 5."),
      rf("ga1-l-4", 4, "Der Unterricht am Montag findet statt.", "falsch", "Er fällt aus."),
      rf("ga1-l-5", 5, "Die nächste Stunde ist am Mittwoch um 18 Uhr.", "richtig", "Das schreibt die Kursleitung."),
    ],
  },
  {
    id: "ga1-lesen-2",
    number: 2,
    title: "Zwei Angebote",
    maxRaw: 5,
    suggestedMinutes: 8,
    instruction: "Was passt: Anzeige a oder Anzeige b? Aufgaben 6 bis 10.",
    stimuli: [
      { kind: "text", id: "ga1-ad-a", title: "a · Stadtbad", body: "Täglich 8 bis 20 Uhr geöffnet, auch im Winter. Familienticket 12 Euro. Im Haus gibt es ein Café.", genre: "ad" },
      { kind: "text", id: "ga1-ad-b", title: "b · Waldsee", body: "Nur von Mai bis September. Eintritt frei. Kein Café. Essen dürfen Sie mitbringen. Im Winter ist der See zu.", genre: "ad" },
    ],
    items: [
      ab("ga1-l-6", 6, "Sie möchten im Januar schwimmen.", "Stadtbad", "Waldsee", "a", "Der Waldsee ist im Winter zu. Das Stadtbad hat auch im Winter geöffnet."),
      ab("ga1-l-7", 7, "Sie möchten im Juli kostenlos schwimmen.", "Stadtbad", "Waldsee", "b", "Der Eintritt am Waldsee ist frei."),
      ab("ga1-l-8", 8, "Sie möchten nach dem Schwimmen einen Kaffee trinken.", "Stadtbad", "Waldsee", "a", "Nur das Stadtbad hat ein Café."),
      ab("ga1-l-9", 9, "Sie suchen ein Familienticket.", "Stadtbad", "Waldsee", "a", "Das Familienticket gibt es im Stadtbad."),
      ab("ga1-l-10", 10, "Sie möchten im August im See schwimmen.", "Stadtbad", "Waldsee", "b", "Der Waldsee ist von Mai bis September offen."),
    ],
  },
  {
    id: "ga1-lesen-3",
    number: 3,
    title: "Schilder",
    maxRaw: 5,
    suggestedMinutes: 7,
    instruction: "Lesen Sie die Schilder. Ist die Aussage richtig oder falsch? Aufgaben 11 bis 15.",
    stimuli: [
      { kind: "text", id: "ga1-sign", title: "Schilder im Haus", body: "1 Nicht rauchen.\n2 Ausgang.\n3 Heute geschlossen.\n4 Bitte leise.\n5 Reserviert.", genre: "sign" },
    ],
    items: [
      rf("ga1-l-11", 11, "Hier darf man rauchen.", "falsch", "Das Schild sagt: Nicht rauchen."),
      rf("ga1-l-12", 12, "Ausgang bedeutet: Hier kommt man hinaus.", "richtig", "Der Ausgang ist der Weg nach draußen."),
      rf("ga1-l-13", 13, "Heute geschlossen bedeutet: Heute ist geöffnet.", "falsch", "Geschlossen heißt: nicht geöffnet."),
      rf("ga1-l-14", 14, "Bitte leise bedeutet: Man soll leise sein.", "richtig", "Leise heißt ohne Lärm."),
      rf("ga1-l-15", 15, "Reserviert bedeutet: Der Tisch ist frei.", "falsch", "Reserviert heißt: der Tisch ist schon für jemanden da."),
    ],
  },
];
