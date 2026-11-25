import type { AudioScript, Teil } from "@/lib/exam-model";
import { dialogue, mc, narrate, rf } from "@/content/exams/factory";
import { ANDREW, AVA, BRIAN, EMMA, GIUSEPPE, INGRID, JAN, JONAS, LENI, REMY, TANJA, VIVIENNE } from "@/content/exams/voices";

const twice = { plays: 2 as const, readSeconds: 5, betweenPlaysSeconds: 3, answerSeconds: 15 };
const once = { plays: 1 as const, readSeconds: 5, betweenPlaysSeconds: 0, answerSeconds: 15, repeatCue: undefined };

function pair(
  id: string,
  left: typeof TANJA,
  right: typeof JONAS,
  lines: [string, string, string, string],
  situation: string,
  extra: Partial<AudioScript> = twice,
) {
  return dialogue(
    id,
    [left, right],
    [
      { who: left, text: lines[0] },
      { who: right, text: lines[1] },
      { who: left, text: lines[2] },
      { who: right, text: lines[3] },
    ],
    { situation, ...extra },
  );
}

export const a1HoerenIntro = narrate("ga1-h-intro", [
  "Start Deutsch 1, Modul Hören.",
  "Dieser Test hat drei Teile.",
  "Sie hören kurze Gespräche und Ansagen.",
  "Zu jedem Text gibt es eine Aufgabe.",
  "Lesen Sie zuerst die Aufgabe, hören Sie dann den Text.",
  "Kreuzen Sie die richtige Lösung an.",
  "Am Ende übertragen Sie die Lösungen auf den Antwortbogen.",
]);

export const a1Hoeren: Teil[] = [
  {
    id: "ga1-hoeren-1",
    number: 1,
    title: "Kurze Gespräche",
    maxRaw: 6,
    instruction: "Sie hören sechs kurze Gespräche, jedes zweimal. Wählen Sie a, b oder c. Das Beispiel ist gelöst.",
    introAudio: narrate("ga1-h-t1-intro", [
      "Teil 1.",
      "Sie hören nun sechs kurze Gespräche.",
      "Sie hören jedes Gespräch zweimal.",
      "Lesen Sie zuerst das Beispiel.",
      "Dazu haben Sie fünf Sekunden Zeit.",
    ]),
    endAudio: narrate("ga1-h-t1-ende", ["Ende von Teil 1."]),
    example: mc("ga1-h-bsp", 0, "Wann fährt der Zug?", [
      { id: "a", label: "um 9 Uhr" },
      { id: "b", label: "um 10 Uhr" },
      { id: "c", label: "um 11 Uhr" },
    ], "a", "Der Zug fährt um neun, nicht um zehn."),
    exampleStimulus: {
      kind: "audio",
      id: "ga1-h-bsp",
      itemIds: ["ga1-h-bsp"],
      audio: pair("ga1-h-bsp", TANJA, JONAS, [
        "Fährt unser Zug um zehn Uhr?",
        "Nein, um neun. Gleis zwei.",
        "Dann müssen wir uns beeilen.",
        "Ja, in zehn Minuten geht er.",
      ], "Sie hören ein Gespräch am Bahnhof."),
    },
    stimuli: [
      { kind: "audio", id: "ga1-h-1", itemIds: ["ga1-h-1"], audio: pair("ga1-h-1", INGRID, JAN, ["Was kostet das Stück Kuchen?", "Drei Euro fünfzig.", "Nicht vier Euro?", "Nein, drei fünfzig. Der Kaffee kostet zwei Euro."], "Sie hören ein Gespräch im Café.", { readCue: "Nummer 1." }) },
      { kind: "audio", id: "ga1-h-2", itemIds: ["ga1-h-2"], audio: pair("ga1-h-2", LENI, ANDREW, ["Ist das Zimmer ab April frei?", "Leider erst ab Mai.", "Und der Preis?", "Vierhundertfünfzig Euro im Monat, warm."], "Sie hören ein Gespräch über ein Zimmer.", { readCue: "Nummer 2." }) },
      { kind: "audio", id: "ga1-h-3", itemIds: ["ga1-h-3"], audio: pair("ga1-h-3", AVA, BRIAN, ["Treffen wir uns um acht vor dem Kino?", "Ja. Der Film beginnt aber erst Viertel nach acht.", "Hast du die Karten?", "Ja, zwei Karten, Reihe fünf."], "Sie hören ein Gespräch über einen Kinobesuch.", { readCue: "Nummer 3." }) },
      { kind: "audio", id: "ga1-h-4", itemIds: ["ga1-h-4"], audio: pair("ga1-h-4", EMMA, REMY, ["Haben Sie die blaue Jacke in Größe M?", "Größe M ist aus. Größe L hängt noch da.", "Was kostet sie?", "Vierzig Euro."], "Sie hören ein Gespräch in einem Geschäft.", { readCue: "Nummer 4." }) },
      { kind: "audio", id: "ga1-h-5", itemIds: ["ga1-h-5"], audio: pair("ga1-h-5", VIVIENNE, GIUSEPPE, ["Ist mein Termin am Mittwoch?", "Nein, am Donnerstag um zehn Uhr.", "Bei Doktor Berger?", "Ja, Zimmer zwei im ersten Stock."], "Sie hören ein Gespräch in einer Praxis.", { readCue: "Nummer 5." }) },
      { kind: "audio", id: "ga1-h-6", itemIds: ["ga1-h-6"], audio: pair("ga1-h-6", TANJA, BRIAN, ["Die Feier beginnt um sieben bei Lea.", "Soll ich einen Kuchen mitbringen?", "Nein, bitte einen Salat. Kuchen haben wir schon.", "Gut, dann bis um sieben."], "Sie hören ein Gespräch über eine Feier.", { readCue: "Nummer 6." }) },
    ],
    items: [
      mc("ga1-h-1", 1, "Was kostet der Kuchen?", [{ id: "a", label: "3,50 Euro" }, { id: "b", label: "4 Euro" }, { id: "c", label: "5 Euro" }], "a", "Der Kuchen kostet drei Euro fünfzig."),
      mc("ga1-h-2", 2, "Ab wann ist das Zimmer frei?", [{ id: "a", label: "ab April" }, { id: "b", label: "ab Mai" }, { id: "c", label: "ab Juni" }], "b", "Das Zimmer ist erst ab Mai frei."),
      mc("ga1-h-3", 3, "Wann beginnt der Film?", [{ id: "a", label: "um 8 Uhr" }, { id: "b", label: "um 8.15 Uhr" }, { id: "c", label: "um 9 Uhr" }], "b", "Der Film beginnt Viertel nach acht."),
      mc("ga1-h-4", 4, "Welche Größe gibt es noch?", [{ id: "a", label: "S" }, { id: "b", label: "M" }, { id: "c", label: "L" }], "c", "Größe M ist aus, Größe L ist noch da."),
      mc("ga1-h-5", 5, "Wann ist der Termin?", [{ id: "a", label: "am Mittwoch" }, { id: "b", label: "am Donnerstag" }, { id: "c", label: "am Freitag" }], "b", "Der Termin ist am Donnerstag um zehn."),
      mc("ga1-h-6", 6, "Was soll man mitbringen?", [{ id: "a", label: "Kuchen" }, { id: "b", label: "Salat" }, { id: "c", label: "Getränke" }], "b", "Bitte einen Salat, Kuchen ist schon da."),
    ],
  },
  {
    id: "ga1-hoeren-2",
    number: 2,
    title: "Ansagen",
    maxRaw: 4,
    instruction: "Sie hören vier Ansagen, jede einmal. Ist die Aussage richtig oder falsch?",
    introAudio: narrate("ga1-h-t2-intro", ["Teil 2.", "Sie hören nun vier Ansagen.", "Sie hören jede Ansage einmal.", "Lesen Sie zuerst das Beispiel. Dazu haben Sie fünf Sekunden Zeit."]),
    endAudio: narrate("ga1-h-t2-ende", ["Ende von Teil 2."]),
    example: rf("ga1-h-bsp-2", 0, "Der Zug nach Hamburg fällt aus.", "falsch", "Er hat Verspätung, er fällt nicht aus."),
    exampleStimulus: {
      kind: "audio",
      id: "ga1-h-bsp-2",
      itemIds: ["ga1-h-bsp-2"],
      audio: dialogue("ga1-h-bsp-2", [JAN], [{ who: JAN, text: "Der Zug nach Hamburg hat heute zwanzig Minuten Verspätung. Er fährt von Gleis eins." }], { ...once, situation: "Sie hören eine Ansage am Bahnhof." }),
    },
    stimuli: [
      { kind: "audio", id: "ga1-h-7", itemIds: ["ga1-h-7"], audio: dialogue("ga1-h-7", [TANJA], [{ who: TANJA, text: "Das Stadtbad bleibt heute geschlossen. Morgen öffnen wir wieder um acht Uhr." }], { ...once, situation: "Sie hören eine Ansage im Bad.", readCue: "Nummer 7." }) },
      { kind: "audio", id: "ga1-h-8", itemIds: ["ga1-h-8"], audio: dialogue("ga1-h-8", [JAN], [{ who: JAN, text: "Bus zwölf nach Kirchfeld fährt heute von Haltestelle B, nicht von Haltestelle A." }], { ...once, situation: "Sie hören eine Ansage an der Haltestelle.", readCue: "Nummer 8." }) },
      { kind: "audio", id: "ga1-h-9", itemIds: ["ga1-h-9"], audio: dialogue("ga1-h-9", [INGRID], [{ who: INGRID, text: "Das Museum ist sonntags von zehn bis fünf Uhr geöffnet. Der Eintritt ist an diesem Tag frei." }], { ...once, situation: "Sie hören eine Ansage im Radio.", readCue: "Nummer 9." }) },
      { kind: "audio", id: "ga1-h-10", itemIds: ["ga1-h-10"], audio: dialogue("ga1-h-10", [LENI], [{ who: LENI, text: "Achtung, liebe Kunden. Heute schließen wir schon um achtzehn Uhr, nicht um zwanzig Uhr." }], { ...once, situation: "Sie hören eine Ansage im Geschäft.", readCue: "Nummer 10." }) },
    ],
    items: [
      rf("ga1-h-7", 7, "Das Stadtbad ist heute geöffnet.", "falsch", "Es bleibt heute geschlossen und öffnet morgen um acht."),
      rf("ga1-h-8", 8, "Der Bus fährt von Haltestelle A.", "falsch", "Er fährt von Haltestelle B, nicht von A."),
      rf("ga1-h-9", 9, "Der Eintritt ins Museum ist sonntags frei.", "richtig", "Sonntags ist der Eintritt frei."),
      rf("ga1-h-10", 10, "Der Laden hat heute bis 20 Uhr geöffnet.", "falsch", "Heute schließt er um achtzehn Uhr."),
    ],
  },
  {
    id: "ga1-hoeren-3",
    number: 3,
    title: "Nachrichten",
    maxRaw: 5,
    instruction: "Sie hören fünf Nachrichten auf dem Anrufbeantworter, jede zweimal. Wählen Sie a, b oder c.",
    introAudio: narrate("ga1-h-t3-intro", ["Teil 3.", "Sie hören nun fünf kurze Nachrichten.", "Sie hören jede Nachricht zweimal."]),
    endAudio: narrate("ga1-h-t3-ende", ["Ende des Tests Hören.", "Schreiben Sie jetzt Ihre Lösungen 1 bis 15 auf den Antwortbogen."]),
    stimuli: [
      { kind: "audio", id: "ga1-h-11", itemIds: ["ga1-h-11"], audio: dialogue("ga1-h-11", [JONAS], [{ who: JONAS, text: "Hallo, hier ist das Fundbüro. Ihr Schlüssel liegt bei uns. Das Büro hat heute bis sechzehn Uhr geöffnet." }], { ...twice, situation: "Sie hören eine Nachricht auf dem Anrufbeantworter.", readCue: "Nummer 11." }) },
      { kind: "audio", id: "ga1-h-12", itemIds: ["ga1-h-12"], audio: dialogue("ga1-h-12", [ANDREW], [{ who: ANDREW, text: "Der Deutschkurs ist heute nicht in Raum vier, sondern in Raum zwölf. Die Zeit bleibt achtzehn Uhr." }], { ...twice, situation: "Sie hören eine Nachricht von der Kursleitung.", readCue: "Nummer 12." }) },
      { kind: "audio", id: "ga1-h-13", itemIds: ["ga1-h-13"], audio: dialogue("ga1-h-13", [BRIAN], [{ who: BRIAN, text: "Hallo, das Picknick findet statt, wenn es nicht regnet. Treffpunkt ist um elf Uhr am Parktor." }], { ...twice, situation: "Sie hören eine Nachricht von einem Freund.", readCue: "Nummer 13." }) },
      { kind: "audio", id: "ga1-h-14", itemIds: ["ga1-h-14"], audio: dialogue("ga1-h-14", [EMMA], [{ who: EMMA, text: "Guten Tag, die Bibliothek ruft an. Das Buch, das Sie bestellt haben, liegt ab morgen für Sie bereit." }], { ...twice, situation: "Sie hören eine Nachricht von der Bibliothek.", readCue: "Nummer 14." }) },
      { kind: "audio", id: "ga1-h-15", itemIds: ["ga1-h-15"], audio: dialogue("ga1-h-15", [REMY], [{ who: REMY, text: "Deine Fahrkarte ist für Samstag, nicht für Sonntag. Der Zug fährt um sieben Uhr zwölf." }], { ...twice, situation: "Sie hören eine Nachricht zur Fahrkarte.", readCue: "Nummer 15." }) },
    ],
    items: [
      mc("ga1-h-11", 11, "Bis wann hat das Fundbüro heute geöffnet?", [{ id: "a", label: "bis 16 Uhr" }, { id: "b", label: "bis 18 Uhr" }, { id: "c", label: "bis 20 Uhr" }], "a", "Das Büro hat bis sechzehn Uhr geöffnet."),
      mc("ga1-h-12", 12, "In welchem Raum ist der Kurs?", [{ id: "a", label: "Raum 4" }, { id: "b", label: "Raum 12" }, { id: "c", label: "Raum 20" }], "b", "Der Kurs ist in Raum zwölf."),
      mc("ga1-h-13", 13, "Wann ist der Treffpunkt?", [{ id: "a", label: "um 10 Uhr" }, { id: "b", label: "um 11 Uhr" }, { id: "c", label: "um 12 Uhr" }], "b", "Treffpunkt ist um elf Uhr am Parktor."),
      mc("ga1-h-14", 14, "Wo liegt das Buch bereit?", [{ id: "a", label: "in der Bibliothek" }, { id: "b", label: "in der Buchhandlung" }, { id: "c", label: "in der Schule" }], "a", "Die Bibliothek ruft an."),
      mc("ga1-h-15", 15, "Für welchen Tag ist die Fahrkarte?", [{ id: "a", label: "Freitag" }, { id: "b", label: "Samstag" }, { id: "c", label: "Sonntag" }], "b", "Die Karte ist für Samstag, nicht für Sonntag."),
    ],
  },
];
