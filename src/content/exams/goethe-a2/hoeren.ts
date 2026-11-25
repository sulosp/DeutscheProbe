import type { Teil } from "@/lib/exam-model";
import { dialogue, mc, narrate, rf } from "@/content/exams/factory";
import { ANDREW, AVA, BRIAN, EMMA, INGRID, JAN, JONAS, LENI, REMY, TANJA } from "@/content/exams/voices";

const two = { plays: 2 as const, readSeconds: 15, betweenPlaysSeconds: 4, answerSeconds: 15 };
const one = { plays: 1 as const, readSeconds: 15, betweenPlaysSeconds: 0, answerSeconds: 15 };

export const a2HoerenIntro = narrate("ga2-h-intro", [
  "Zertifikat A2, Modul Hören.",
  "Sie hören mehrere Texte und lösen Aufgaben dazu.",
  "Vor den Aufgaben haben Sie Zeit zum Lesen.",
  "Am Ende jeder Pause hören Sie dieses Signal.",
]);

export const a2Hoeren: Teil[] = [
  {
    id: "ga2-hoeren-1",
    number: 1,
    title: "Kurze Texte",
    maxRaw: 5,
    instruction: "Sie hören fünf kurze Texte, jeden zweimal. Wählen Sie a, b oder c.",
    introAudio: narrate("ga2-h-t1-intro", ["Teil 1.", "Sie hören fünf kurze Texte.", "Sie hören jeden Text zweimal.", "Lesen Sie zuerst das Beispiel. Dazu haben Sie fünfzehn Sekunden Zeit."]),
    endAudio: narrate("ga2-h-t1-ende", ["Ende von Teil 1."]),
    example: mc("ga2-h-bsp", 0, "Wohin fährt der Bus?", [{ id: "a", label: "zum See" }, { id: "b", label: "zum Markt" }, { id: "c", label: "zum Bahnhof" }], "c", "Der Bus fährt zum Bahnhof."),
    exampleStimulus: { kind: "audio", id: "ga2-h-bsp", itemIds: ["ga2-h-bsp"], audio: dialogue("ga2-h-bsp", [JAN], [
      { who: JAN, text: "Achtung an der Haltestelle Markt." },
      { who: JAN, text: "Bus fünf zum Bahnhof fährt in drei Minuten von Steig zwei." },
    ], { ...one, plays: 2, betweenPlaysSeconds: 4, situation: "Sie hören eine Durchsage an der Bushaltestelle.", scene: "station" }) },
    stimuli: [
      { kind: "audio" as const, id: "ga2-h-1", itemIds: ["ga2-h-1"], audio: dialogue("ga2-h-1", [TANJA], [
        { who: TANJA, text: "Achtung, eine Durchsage der Stadtbibliothek." },
        { who: TANJA, text: "Heute bleibt die Bibliothek zu." },
        { who: TANJA, text: "Morgen hat sie ab neun Uhr wieder geöffnet." },
      ], { ...two, situation: "Sie hören eine Durchsage in der Stadtbibliothek.", scene: "shop", readCue: "Nummer 1." }) },
      { kind: "audio" as const, id: "ga2-h-2", itemIds: ["ga2-h-2"], audio: dialogue("ga2-h-2", [JONAS], [
        { who: JONAS, text: "Hallo, hier ist Cem." },
        { who: JONAS, text: "Das Essen ist nicht um sieben, sondern um acht." },
        { who: JONAS, text: "Ich koche Reis." },
      ], { ...two, situation: "Sie hören eine Mailbox-Nachricht von Cem.", scene: "phone", readCue: "Nummer 2." }) },
      { kind: "audio" as const, id: "ga2-h-3", itemIds: ["ga2-h-3"], audio: dialogue("ga2-h-3", [INGRID], [
        { who: INGRID, text: "Verkehrsmeldung für die Innenstadt." },
        { who: INGRID, text: "Auf der Bergstraße gibt es einen Unfall." },
        { who: INGRID, text: "Bitte fahren Sie über die Ringstraße." },
      ], { ...two, situation: "Sie hören eine Verkehrsmeldung im Radio.", scene: "radio", readCue: "Nummer 3." }) },
      { kind: "audio" as const, id: "ga2-h-4", itemIds: ["ga2-h-4"], audio: dialogue("ga2-h-4", [JAN], [
        { who: JAN, text: "Hinweis der Volkshochschule." },
        { who: JAN, text: "Der Kurs Fotografie beginnt am dritten Mai, nicht am dritten April." },
        { who: JAN, text: "Immer dienstags." },
      ], { ...two, situation: "Sie hören eine Ansage der Volkshochschule.", scene: "lecture", readCue: "Nummer 4." }) },
      { kind: "audio" as const, id: "ga2-h-5", itemIds: ["ga2-h-5"], audio: dialogue("ga2-h-5", [LENI], [
        { who: LENI, text: "Hallo, hier ist das Fundbüro." },
        { who: LENI, text: "Bei uns liegt eine blaue Tasche." },
        { who: LENI, text: "Sie können sie bis Freitag abholen." },
      ], { ...two, situation: "Sie hören eine Mailbox-Nachricht vom Fundbüro.", scene: "phone", readCue: "Nummer 5." }) },
    ],
    items: [
      mc("ga2-h-1", 1, "Wann hat die Bibliothek geöffnet?", [{ id: "a", label: "heute" }, { id: "b", label: "morgen ab 9 Uhr" }, { id: "c", label: "nur sonntags" }], "b", "Heute bleibt sie zu, morgen ab neun."),
      mc("ga2-h-2", 2, "Wann ist das Essen?", [{ id: "a", label: "um 7 Uhr" }, { id: "b", label: "um 8 Uhr" }, { id: "c", label: "um 9 Uhr" }], "b", "Cem sagt: nicht um sieben, sondern um acht."),
      mc("ga2-h-3", 3, "Wie soll man fahren?", [{ id: "a", label: "über die Bergstraße" }, { id: "b", label: "über die Ringstraße" }, { id: "c", label: "mit dem Zug" }], "b", "Wegen eines Unfalls über die Ringstraße."),
      mc("ga2-h-4", 4, "Wann beginnt der Fotokurs?", [{ id: "a", label: "am 3. April" }, { id: "b", label: "am 3. Mai" }, { id: "c", label: "am 3. Juni" }], "b", "Er beginnt am dritten Mai."),
      mc("ga2-h-5", 5, "Was liegt im Fundbüro?", [{ id: "a", label: "eine blaue Tasche" }, { id: "b", label: "ein rotes Fahrrad" }, { id: "c", label: "ein Schlüssel" }], "a", "Eine blaue Tasche, Abholung bis Freitag."),
    ],
  },
  {
    id: "ga2-hoeren-2",
    number: 2,
    title: "Woche planen",
    maxRaw: 5,
    instruction: "Sie hören ein Gespräch einmal. Was passt zu welchem Tag? Jeder Buchstabe nur einmal. Das Beispiel benutzt Bild a.",
    options: [
      { id: "a", label: "a · Schwimmbad" },
      { id: "b", label: "b · Kino" },
      { id: "c", label: "c · Markt" },
      { id: "d", label: "d · Zahnarzt" },
      { id: "e", label: "e · Fußball" },
      { id: "f", label: "f · Bibliothek" },
      { id: "g", label: "g · Zugfahrt" },
      { id: "h", label: "h · Kochen mit Freunden" },
      { id: "i", label: "i · Park" },
    ],
    introAudio: narrate("ga2-h-t2-intro", ["Teil 2.", "Sie hören ein Gespräch.", "Sie hören das Gespräch einmal.", "Lesen Sie jetzt die Aufgaben. Dazu haben Sie fünfzehn Sekunden Zeit."]),
    endAudio: narrate("ga2-h-t2-ende", ["Ende von Teil 2."]),
    example: { id: "ga2-h-bsp-2", number: 0, type: "match", prompt: "Montag", correct: "a", points: 0, explanation: "Am Montag gehen sie schwimmen." },
    stimuli: [
      {
        kind: "audio",
        id: "ga2-h-t2",
        itemIds: ["ga2-h-6", "ga2-h-7", "ga2-h-8", "ga2-h-9", "ga2-h-10"],
        audio: dialogue("ga2-h-t2", [TANJA, JONAS], [
          { who: TANJA, text: "Also, Montag gehen wir schwimmen. Das ist schon klar." },
          { who: JONAS, text: "Dienstag hab' ich um zehn den Zahnarzt." },
          { who: TANJA, text: "Mittwoch koche ich mit Freunden." },
          { who: JONAS, text: "Und Donnerstag fahre ich mit dem Zug zu meinen Eltern." },
          { who: TANJA, text: "Freitag spielen wir Fußball im Park? Nein, warte: Fußball auf dem Sportplatz." },
          { who: JONAS, text: "Samstag dann ins Kino. Sonntag bleiben wir zu Hause." },
        ], { ...one, situation: "Sie hören zwei Freunde in einem Café. Sie planen die Woche.", scene: "cafe" }),
      },
    ],
    items: [
      { id: "ga2-h-6", number: 6, type: "match" as const, prompt: "Dienstag", correct: "d", points: 1, explanation: "Dienstag ist der Zahnarzt." },
      { id: "ga2-h-7", number: 7, type: "match" as const, prompt: "Mittwoch", correct: "h", points: 1, explanation: "Mittwoch kocht sie mit Freunden." },
      { id: "ga2-h-8", number: 8, type: "match" as const, prompt: "Donnerstag", correct: "g", points: 1, explanation: "Donnerstag ist die Zugfahrt." },
      { id: "ga2-h-9", number: 9, type: "match" as const, prompt: "Freitag", correct: "e", points: 1, explanation: "Freitag ist Fußball." },
      { id: "ga2-h-10", number: 10, type: "match" as const, prompt: "Samstag", correct: "b", points: 1, explanation: "Samstag ist Kino." },
    ],
  },
  {
    id: "ga2-hoeren-3",
    number: 3,
    title: "Kurze Dialoge",
    maxRaw: 5,
    instruction: "Sie hören fünf kurze Gespräche, jedes einmal. Wählen Sie a, b oder c.",
    introAudio: narrate("ga2-h-t3-intro", ["Teil 3.", "Sie hören fünf kurze Gespräche.", "Sie hören jedes Gespräch einmal."]),
    endAudio: narrate("ga2-h-t3-ende", ["Ende von Teil 3."]),
    stimuli: [
      { kind: "audio" as const, id: "ga2-h-11", itemIds: ["ga2-h-11"], audio: dialogue("ga2-h-11", [TANJA, JONAS], [
        { who: TANJA, text: "Entschuldigung, wo ist der Ausgang?" },
        { who: JONAS, text: "Links, neben der Treppe. Nicht rechts." },
      ], { ...one, readCue: "Nummer 11.", situation: "Sie hören ein Gespräch in der Bahnhofshalle.", scene: "station" }) },
      { kind: "audio" as const, id: "ga2-h-12", itemIds: ["ga2-h-12"], audio: dialogue("ga2-h-12", [INGRID, JAN], [
        { who: INGRID, text: "Ist der Tisch am Fenster noch frei?" },
        { who: JAN, text: "Nein, der ist belegt. Nehmen Sie den Tisch an der Tür." },
      ], { ...one, readCue: "Nummer 12.", situation: "Sie hören ein Gespräch im Café Linde.", scene: "cafe" }) },
      { kind: "audio" as const, id: "ga2-h-13", itemIds: ["ga2-h-13"], audio: dialogue("ga2-h-13", [LENI, ANDREW], [
        { who: LENI, text: "Was kostet die Fahrkarte nach Bremen?" },
        { who: ANDREW, text: "Einfach zwölf Euro, hin und zurück zwanzig." },
      ], { ...one, readCue: "Nummer 13.", situation: "Sie hören ein Gespräch am Fahrkartenschalter.", scene: "station" }) },
      { kind: "audio" as const, id: "ga2-h-14", itemIds: ["ga2-h-14"], audio: dialogue("ga2-h-14", [AVA, BRIAN], [
        { who: AVA, text: "Kann ich die Jacke noch umtauschen?" },
        { who: BRIAN, text: "Ja, aber nur mit dem Bon, und nur bis sieben Tage nach dem Kauf." },
      ], { ...one, readCue: "Nummer 14.", situation: "Sie hören ein Gespräch an der Kasse im Kaufhaus.", scene: "shop" }) },
      { kind: "audio" as const, id: "ga2-h-15", itemIds: ["ga2-h-15"], audio: dialogue("ga2-h-15", [EMMA, REMY], [
        { who: EMMA, text: "Wann kommt der Arzt?" },
        { who: REMY, text: "Nicht sofort. Er ist in einer Stunde da." },
      ], { ...one, readCue: "Nummer 15.", situation: "Sie hören ein Gespräch am Empfang einer Arztpraxis.", scene: "quiet" }) },
    ],
    items: [
      mc("ga2-h-11", 11, "Wo ist der Ausgang?", [{ id: "a", label: "links neben der Treppe" }, { id: "b", label: "rechts" }, { id: "c", label: "im Keller" }], "a", "Links, neben der Treppe."),
      mc("ga2-h-12", 12, "Welcher Tisch ist frei?", [{ id: "a", label: "am Fenster" }, { id: "b", label: "an der Tür" }, { id: "c", label: "auf der Terrasse" }], "b", "Der Tisch an der Tür."),
      mc("ga2-h-13", 13, "Was kostet die Karte hin und zurück?", [{ id: "a", label: "12 Euro" }, { id: "b", label: "20 Euro" }, { id: "c", label: "30 Euro" }], "b", "Hin und zurück zwanzig Euro."),
      mc("ga2-h-14", 14, "Was braucht man zum Umtauschen?", [{ id: "a", label: "den Bon" }, { id: "b", label: "einen Ausweis" }, { id: "c", label: "ein Foto" }], "a", "Nur mit dem Bon."),
      mc("ga2-h-15", 15, "Wann kommt der Arzt?", [{ id: "a", label: "sofort" }, { id: "b", label: "in einer Stunde" }, { id: "c", label: "morgen" }], "b", "Er ist in einer Stunde da."),
    ],
  },
  {
    id: "ga2-hoeren-4",
    number: 4,
    title: "Interview",
    maxRaw: 5,
    instruction: "Sie hören ein Radiointerview zweimal. Sind die Aufgaben 16 bis 20 richtig oder falsch?",
    introAudio: narrate("ga2-h-t4-intro", ["Teil 4.", "Sie hören ein Interview.", "Sie hören das Interview zweimal.", "Lesen Sie jetzt die Aufgaben. Dazu haben Sie fünfzehn Sekunden Zeit."]),
    endAudio: narrate("ga2-h-t4-ende", ["Ende von Hören.", "Übertragen Sie jetzt Ihre Lösungen."]),
    stimuli: [
      {
        kind: "audio",
        id: "ga2-h-t4",
        itemIds: ["ga2-h-16", "ga2-h-17", "ga2-h-18", "ga2-h-19", "ga2-h-20"],
        audio: dialogue("ga2-h-t4", [JAN, LENI], [
          { who: JAN, text: "Sie backen Brot in einer kleinen Bäckerei in der Altstadt. Seit wann machen Sie das?" },
          { who: LENI, text: "Seit drei Jahren. Vorher hab' ich in einem Büro gearbeitet." },
          { who: JAN, text: "Arbeiten Sie allein?" },
          { who: LENI, text: "Nein. Meine Schwester hilft am Wochenende. Unter der Woche bin ich allein." },
          { who: JAN, text: "Und sonntags, ist der Laden da auch offen?" },
          { who: LENI, text: "Nein, sonntags haben wir zu. Samstags bis zwölf Uhr." },
          { who: JAN, text: "Was verkauft sich am besten?" },
          { who: LENI, text: "Das Vollkornbrot. Nicht die süßen Teilchen." },
        ], { ...two, situation: "Sie hören ein Interview im Morgenmagazin von Radio Kirchfeld.", scene: "radio" }),
      },
    ],
    items: [
      rf("ga2-h-16", 16, "Die Bäckerin arbeitet seit drei Jahren in der Bäckerei.", "richtig", "Sie sagt: seit drei Jahren."),
      rf("ga2-h-17", 17, "Vorher hat sie auch schon Brot gebacken.", "falsch", "Vorher hat sie in einem Büro gearbeitet."),
      rf("ga2-h-18", 18, "Die Schwester hilft jeden Tag.", "falsch", "Sie hilft am Wochenende. Unter der Woche ist die Bäckerin allein."),
      rf("ga2-h-19", 19, "Der Laden ist sonntags geschlossen.", "richtig", "Sonntags haben sie zu."),
      rf("ga2-h-20", 20, "Süße Teilchen verkaufen sich am besten.", "falsch", "Am besten verkauft sich das Vollkornbrot."),
    ],
  },
];
