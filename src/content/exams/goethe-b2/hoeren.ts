import { REPEAT_CUE, type Teil } from "@/lib/exam-model";
import { dialogue, mc, narrate, rf } from "@/content/exams/factory";
import { ANDREW, AVA, BRIAN, EMMA, INGRID, JAN, JONAS, LENI, REMY, TANJA } from "@/content/exams/voices";

const once = { plays: 1 as const, readSeconds: 15, betweenPlaysSeconds: 0, answerSeconds: 10 };
const twice = { plays: 2 as const, readSeconds: 60, betweenPlaysSeconds: 5, answerSeconds: 10, repeatCue: REPEAT_CUE };

export const b2HoerenIntro = narrate("gb2-h-intro", [
  "Zertifikat B2, Modul Hören.",
  "Sie hören mehrere Texte und lösen Aufgaben dazu.",
  "Vor den Aufgaben haben Sie Zeit zum Lesen.",
  "Am Ende übertragen Sie die Lösungen. Dafür haben Sie fünf Minuten.",
]);

const who = [
  { id: "mod", label: "Moderator" },
  { id: "g1", label: "Frau Abel" },
  { id: "g2", label: "Herr Novak" },
];

export const b2Hoeren: Teil[] = [
  {
    id: "gb2-hoeren-1",
    number: 1,
    title: "Alltag",
    maxRaw: 10,
    instruction: "Sie hören fünf kurze Gespräche, jedes einmal. Zu jedem Gespräch gibt es eine Richtig-Falsch-Aufgabe und eine Aufgabe a, b oder c.",
    introAudio: narrate("gb2-h-t1-intro", ["Teil 1.", "Sie hören fünf kurze Gespräche.", "Sie hören jedes Gespräch einmal.", "Lesen Sie zuerst das Beispiel. Dazu haben Sie fünfzehn Sekunden Zeit."]),
    endAudio: narrate("gb2-h-t1-ende", ["Ende von Teil 1."]),
    example: rf("gb2-h-bsp", 0, "Der Zug fällt aus.", "falsch", "Er hat nur Verspätung."),
    exampleStimulus: {
      kind: "audio",
      id: "gb2-h-bsp",
      itemIds: ["gb2-h-bsp"],
      audio: dialogue("gb2-h-bsp", [TANJA, JONAS], [{ who: TANJA, text: "Fällt der Zug aus?" }, { who: JONAS, text: "Nein, er hat zehn Minuten Verspätung." }], { ...once, situation: "Sie hören ein kurzes Gespräch." }),
    },
    stimuli: [
      { kind: "audio" as const, id: "gb2-h-a", itemIds: ["gb2-h-1", "gb2-h-2"], audio: dialogue("gb2-h-a", [INGRID, JAN], [{ who: INGRID, text: "Ist das Museum heute Abend frei?" }, { who: JAN, text: "Ja, der Eintritt ist frei. Die Führung um neunzehn Uhr kostet aber acht Euro." }], { ...once, readCue: "Nummer 1.", situation: "Sie hören ein Gespräch." }) },
      { kind: "audio" as const, id: "gb2-h-b", itemIds: ["gb2-h-3", "gb2-h-4"], audio: dialogue("gb2-h-b", [LENI, ANDREW], [{ who: LENI, text: "Kann ich den Kurs noch diese Woche beginnen?" }, { who: ANDREW, text: "Nein, der nächste Start ist am Montag in zwei Wochen. Diese Woche ist voll." }], { ...once, readCue: "Nummer 2.", situation: "Sie hören ein Gespräch." }) },
      { kind: "audio" as const, id: "gb2-h-c", itemIds: ["gb2-h-5", "gb2-h-6"], audio: dialogue("gb2-h-c", [AVA, BRIAN], [{ who: AVA, text: "Bringst du das Vegetarische mit?" }, { who: BRIAN, text: "Ja, einen Auflauf. Fleisch macht Lea. Getränke kauft Cem." }], { ...once, readCue: "Nummer 3.", situation: "Sie hören ein Gespräch." }) },
      { kind: "audio" as const, id: "gb2-h-d", itemIds: ["gb2-h-7", "gb2-h-8"], audio: dialogue("gb2-h-d", [EMMA, REMY], [{ who: EMMA, text: "Ist die Wohnung möbliert?" }, { who: REMY, text: "Die Küche ja, die Schlafzimmer nicht. Der Balkon gehört dazu." }], { ...once, readCue: "Nummer 4.", situation: "Sie hören ein Gespräch." }) },
      { kind: "audio" as const, id: "gb2-h-e", itemIds: ["gb2-h-9", "gb2-h-10"], audio: dialogue("gb2-h-e", [TANJA, ANDREW], [{ who: TANJA, text: "Schafft ihr den Bericht bis Freitag?" }, { who: ANDREW, text: "Bis Donnerstagabend, nicht erst Freitag. Am Freitag sind wir beim Kunden." }], { ...once, readCue: "Nummer 5.", situation: "Sie hören ein Gespräch." }) },
    ],
    items: [
      rf("gb2-h-1", 1, "Der Eintritt ins Museum ist heute Abend frei.", "richtig", "Der Eintritt ist frei."),
      mc("gb2-h-2", 2, "Was kostet die Führung?", [{ id: "a", label: "nichts" }, { id: "b", label: "acht Euro" }, { id: "c", label: "achtzehn Euro" }], "b", "Die Führung kostet acht Euro."),
      rf("gb2-h-3", 3, "Man kann den Kurs noch diese Woche beginnen.", "falsch", "Diese Woche ist voll."),
      mc("gb2-h-4", 4, "Wann ist der nächste Start?", [{ id: "a", label: "morgen" }, { id: "b", label: "Montag in zwei Wochen" }, { id: "c", label: "in zwei Monaten" }], "b", "Montag in zwei Wochen."),
      rf("gb2-h-5", 5, "Brian bringt ein Fleischgericht mit.", "falsch", "Er bringt einen Auflauf ohne Fleisch. Fleisch macht Lea."),
      mc("gb2-h-6", 6, "Wer kauft die Getränke?", [{ id: "a", label: "Brian" }, { id: "b", label: "Lea" }, { id: "c", label: "Cem" }], "c", "Getränke kauft Cem."),
      rf("gb2-h-7", 7, "Die Schlafzimmer sind möbliert.", "falsch", "Nur die Küche ist möbliert."),
      mc("gb2-h-8", 8, "Was gehört zur Wohnung?", [{ id: "a", label: "ein Garten" }, { id: "b", label: "ein Balkon" }, { id: "c", label: "eine Garage" }], "b", "Der Balkon gehört dazu."),
      rf("gb2-h-9", 9, "Der Bericht ist erst am Freitag fertig.", "falsch", "Er ist bis Donnerstagabend fertig."),
      mc("gb2-h-10", 10, "Was ist am Freitag?", [{ id: "a", label: "ein Termin beim Kunden" }, { id: "b", label: "ein freier Tag" }, { id: "c", label: "eine Schulung" }], "a", "Am Freitag sind sie beim Kunden."),
    ],
  },
  {
    id: "gb2-hoeren-2",
    number: 2,
    title: "Interview",
    maxRaw: 6,
    instruction: "Sie hören ein Interview zweimal. Aufgaben 11 bis 16.",
    introAudio: narrate("gb2-h-t2-intro", ["Teil 2.", "Sie hören ein Interview.", "Sie hören das Interview zweimal.", "Lesen Sie jetzt die Aufgaben. Dazu haben Sie sechzig Sekunden Zeit."]),
    endAudio: narrate("gb2-h-t2-ende", ["Ende von Teil 2."]),
    stimuli: [
      {
        kind: "audio",
        id: "gb2-h-t2",
        itemIds: ["gb2-h-11", "gb2-h-12", "gb2-h-13", "gb2-h-14", "gb2-h-15", "gb2-h-16"],
        audio: dialogue("gb2-h-t2", [JAN, LENI], [
          { who: JAN, text: "Frau Feld, Sie leiten ein Repair-Café. Seit wann?" },
          { who: LENI, text: "Seit zwei Jahren, jeden ersten Samstag. Nicht jeden Samstag." },
          { who: JAN, text: "Was reparieren Sie nicht?" },
          { who: LENI, text: "Keine Waschmaschinen und keine Handys mit Wasserschaden. Lampen und Hosen ja." },
          { who: JAN, text: "Kostet es etwas?" },
          { who: LENI, text: "Die Hilfe ist kostenlos. Ersatzteile zahlt man selbst." },
          { who: JAN, text: "Braucht man einen Termin?" },
          { who: LENI, text: "Nein. Wer um zehn kommt, wartet selten länger als eine halbe Stunde." },
        ], { ...twice, situation: "Sie hören ein Radiointerview." }),
      },
    ],
    items: [
      mc("gb2-h-11", 11, "Wie oft öffnet das Repair-Café?", [{ id: "a", label: "jeden Samstag" }, { id: "b", label: "jeden ersten Samstag" }, { id: "c", label: "jeden Tag" }], "b", "Jeden ersten Samstag, seit zwei Jahren."),
      mc("gb2-h-12", 12, "Seit wann gibt es das Café?", [{ id: "a", label: "seit zwei Monaten" }, { id: "b", label: "seit zwei Jahren" }, { id: "c", label: "seit zehn Jahren" }], "b", "Seit zwei Jahren."),
      mc("gb2-h-13", 13, "Was wird nicht repariert?", [{ id: "a", label: "Lampen" }, { id: "b", label: "Hosen" }, { id: "c", label: "Waschmaschinen" }], "c", "Keine Waschmaschinen und keine nassen Handys."),
      mc("gb2-h-14", 14, "Was kostet die Hilfe?", [{ id: "a", label: "nichts" }, { id: "b", label: "fünf Euro" }, { id: "c", label: "den vollen Preis" }], "a", "Die Hilfe ist kostenlos."),
      mc("gb2-h-15", 15, "Was zahlt man selbst?", [{ id: "a", label: "den Raum" }, { id: "b", label: "die Ersatzteile" }, { id: "c", label: "den Kaffee" }], "b", "Ersatzteile zahlt man selbst."),
      mc("gb2-h-16", 16, "Braucht man einen Termin?", [{ id: "a", label: "ja, eine Woche vorher" }, { id: "b", label: "nein" }, { id: "c", label: "nur für Handys" }], "b", "Nein. Um zehn wartet man selten länger als eine halbe Stunde."),
    ],
  },
  {
    id: "gb2-hoeren-3",
    number: 3,
    title: "Diskussion",
    maxRaw: 6,
    instruction: "Sie hören eine Diskussion einmal. Wer sagt das? Aufgaben 17 bis 22.",
    options: who,
    introAudio: narrate("gb2-h-t3-intro", ["Teil 3.", "Sie hören eine Diskussion.", "Sie hören die Diskussion einmal.", "Lesen Sie jetzt die Aufgaben. Dazu haben Sie sechzig Sekunden Zeit."]),
    endAudio: narrate("gb2-h-t3-ende", ["Ende von Teil 3."]),
    stimuli: [
      {
        kind: "audio",
        id: "gb2-h-t3",
        itemIds: ["gb2-h-17", "gb2-h-18", "gb2-h-19", "gb2-h-20", "gb2-h-21", "gb2-h-22"],
        audio: dialogue("gb2-h-t3", [BRIAN, INGRID, JONAS], [
          { who: BRIAN, text: "Willkommen. Heute: Soll die Stadt die Innenstadt am Samstag für Autos sperren? Der Rat entscheidet am Donnerstag." },
          { who: INGRID, text: "Ich bin dafür. Mit dem Kinderwagen ist die Straße jetzt gefährlich. Die Busse sollen aber weiterfahren." },
          { who: JONAS, text: "Ich habe ein Geschäft dort. Meine Kunden kommen mit dem Auto. Wenn sie nicht parken können, kaufen sie woanders." },
          { who: BRIAN, text: "Fragen an das Studio bitte bis Mittwochmittag." },
          { who: INGRID, text: "Ein Wochenmarkt wäre ein Gewinn für die Cafés." },
          { who: JONAS, text: "Lieferwagen brauchen dann zwanzig Minuten länger. Das geht so nicht." },
        ], { ...once, readSeconds: 60, situation: "Sie hören eine Diskussion. Moderator, Frau Abel und Herr Novak." }),
      },
    ],
    items: [
      { id: "gb2-h-17", number: 17, type: "mc3" as const, prompt: "Der Rat entscheidet am Donnerstag.", options: who, correct: "mod", points: 1, explanation: "Das sagt der Moderator." },
      { id: "gb2-h-18", number: 18, type: "mc3" as const, prompt: "Mit dem Kinderwagen ist die Straße gefährlich.", options: who, correct: "g1", points: 1, explanation: "Das sagt Frau Abel." },
      { id: "gb2-h-19", number: 19, type: "mc3" as const, prompt: "Die Kunden kommen mit dem Auto.", options: who, correct: "g2", points: 1, explanation: "Das sagt Herr Novak." },
      { id: "gb2-h-20", number: 20, type: "mc3" as const, prompt: "Fragen bitte bis Mittwochmittag.", options: who, correct: "mod", points: 1, explanation: "Das sagt der Moderator." },
      { id: "gb2-h-21", number: 21, type: "mc3" as const, prompt: "Ein Wochenmarkt wäre gut für die Cafés.", options: who, correct: "g1", points: 1, explanation: "Das sagt Frau Abel." },
      { id: "gb2-h-22", number: 22, type: "mc3" as const, prompt: "Lieferwagen brauchen zwanzig Minuten länger.", options: who, correct: "g2", points: 1, explanation: "Das sagt Herr Novak." },
    ],
  },
  {
    id: "gb2-hoeren-4",
    number: 4,
    title: "Vortrag",
    maxRaw: 8,
    instruction: "Sie hören einen Vortrag zweimal. Aufgaben 23 bis 30.",
    introAudio: narrate("gb2-h-t4-intro", ["Teil 4.", "Sie hören einen Vortrag.", "Sie hören den Vortrag zweimal.", "Lesen Sie jetzt die Aufgaben. Dazu haben Sie sechzig Sekunden Zeit."]),
    endAudio: narrate("gb2-h-t4-ende", ["Ende von Hören, Teil 4.", "Sie haben nun fünf Minuten Zeit, Ihre Lösungen auf den Antwortbogen zu übertragen."]),
    stimuli: [
      {
        kind: "audio",
        id: "gb2-h-t4",
        itemIds: ["gb2-h-23", "gb2-h-24", "gb2-h-25", "gb2-h-26", "gb2-h-27", "gb2-h-28", "gb2-h-29", "gb2-h-30"],
        audio: dialogue("gb2-h-t4", [LENI], [
          { who: LENI, text: "Guten Abend. Ich spreche über Schlaf und Schichtarbeit." },
          { who: LENI, text: "Wer nachts arbeitet, schläft im Schnitt eine Stunde weniger als Menschen mit Tagschicht." },
          { who: LENI, text: "Kaffee nach achtzehn Uhr verschiebt den Schlaf bei vielen um eine halbe Stunde." },
          { who: LENI, text: "Ein kurzer Mittagsschlaf von zwanzig Minuten hilft. Länger als vierzig Minuten macht oft müder." },
          { who: LENI, text: "Das Handy sollte nicht im Bett liegen. Blaues Licht hält wach." },
          { who: LENI, text: "In unserer Studie mit zweihundert Pflegekräften war die Nachtschicht die schwerste, nicht die Frühschicht." },
          { who: LENI, text: "Wer die Schicht alle zwei Wochen wechselt, kommt schlechter zurecht als bei einem festen Rhythmus." },
          { who: LENI, text: "Fragen beantworte ich nach der Pause. Das Handout liegt am Ausgang." },
        ], { ...twice, situation: "Sie hören einen Vortrag." }),
      },
    ],
    items: [
      mc("gb2-h-23", 23, "Worüber spricht die Referentin?", [{ id: "a", label: "Schlaf und Schichtarbeit" }, { id: "b", label: "Ernährung im Krankenhaus" }, { id: "c", label: "ein neues Medikament" }], "a", "Schlaf und Schichtarbeit."),
      mc("gb2-h-24", 24, "Wie viel weniger schlafen Nachtarbeiter im Schnitt?", [{ id: "a", label: "eine halbe Stunde" }, { id: "b", label: "eine Stunde" }, { id: "c", label: "zwei Stunden" }], "b", "Eine Stunde weniger."),
      mc("gb2-h-25", 25, "Was macht Kaffee nach achtzehn Uhr?", [{ id: "a", label: "er hilft sofort beim Einschlafen" }, { id: "b", label: "er kann den Schlaf um eine halbe Stunde verschieben" }, { id: "c", label: "er hat keine Wirkung" }], "b", "Er verschiebt den Schlaf bei vielen um eine halbe Stunde."),
      mc("gb2-h-26", 26, "Wie lang soll ein Mittagsschlaf sein?", [{ id: "a", label: "etwa 20 Minuten" }, { id: "b", label: "40 bis 60 Minuten" }, { id: "c", label: "zwei Stunden" }], "a", "Zwanzig Minuten helfen. Länger als vierzig macht oft müder."),
      mc("gb2-h-27", 27, "Wo soll das Handy nicht liegen?", [{ id: "a", label: "in der Küche" }, { id: "b", label: "im Bett" }, { id: "c", label: "im Büro" }], "b", "Nicht im Bett, wegen des blauen Lichts."),
      mc("gb2-h-28", 28, "Wie viele Pflegekräfte waren in der Studie?", [{ id: "a", label: "20" }, { id: "b", label: "200" }, { id: "c", label: "2000" }], "b", "Zweihundert Pflegekräfte."),
      mc("gb2-h-29", 29, "Welche Schicht war am schwersten?", [{ id: "a", label: "die Frühschicht" }, { id: "b", label: "die Nachtschicht" }, { id: "c", label: "die Spätschicht" }], "b", "Die Nachtschicht, nicht die Frühschicht."),
      mc("gb2-h-30", 30, "Was ist besser für den Rhythmus?", [{ id: "a", label: "alle zwei Wochen wechseln" }, { id: "b", label: "ein fester Rhythmus" }, { id: "c", label: "jede Nacht eine andere Zeit" }], "b", "Ein fester Rhythmus ist besser als ein Wechsel alle zwei Wochen."),
    ],
  },
];
