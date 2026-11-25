import { REPEAT_CUE, RF_OPTIONS, type AudioScript, type Item, type Speaker, type Teil } from "@/lib/exam-model";
import {
  BAHNHOF,
  CEM,
  HELBIG,
  LEA,
  MARTIN,
  MODERATOR,
  NARRATOR,
  OKONKWO,
  POOL,
  PRAXIS,
  RADIO,
  SCHULE,
  VOGT,
} from "@/content/exams/goethe-b1/speakers";

function narrate(id: string, lines: string[]): AudioScript {
  return {
    id,
    plays: 1,
    readSeconds: 0,
    betweenPlaysSeconds: 0,
    answerSeconds: 0,
    speakers: [NARRATOR],
    lines: lines.map((text) => ({ speaker: NARRATOR.id, text })),
  };
}

function spoken(id: string, speaker: Speaker, lines: string[], extra: Partial<AudioScript> = {}): AudioScript {
  return {
    id,
    plays: 2,
    readSeconds: 10,
    betweenPlaysSeconds: 5,
    answerSeconds: 8,
    repeatCue: REPEAT_CUE,
    speakers: [speaker],
    lines: lines.map((text) => ({ speaker: speaker.id, text })),
    ...extra,
  };
}

function rf(number: number, prompt: string, correct: "richtig" | "falsch", explanation: string): Item {
  return { id: `gb1-h-${number}`, number, type: "rf", prompt, options: RF_OPTIONS, correct, points: 1, explanation };
}

function mc(number: number, prompt: string, options: { id: string; label: string }[], correct: string, explanation: string): Item {
  return { id: `gb1-h-${number}`, number, type: "mc3", prompt, options, correct, points: 1, explanation };
}

const moduleIntro = narrate("gb1-h-intro", [
  "Zertifikat B1, Modul Hören.",
  "Das Modul hat vier Teile.",
  "Sie hören mehrere Texte und lösen Aufgaben dazu.",
  "Vor den Aufgaben haben Sie Zeit, die Aufgaben zu lesen.",
  "Am Ende dieser Zeit hören Sie ein Signal.",
  "Übertragen Sie Ihre Lösungen danach auf den Antwortbogen.",
  "Dafür haben Sie am Ende des Hörverstehens fünf Minuten Zeit.",
]);

const who = [
  { id: "mod", label: "Moderator, Herr Kranz" },
  { id: "g1", label: "Frau Okonkwo" },
  { id: "g2", label: "Herr Vogt" },
];

function whoItem(number: number, prompt: string, correct: "mod" | "g1" | "g2", explanation: string): Item {
  return { id: `gb1-h-${number}`, number, type: "mc3", prompt, options: who, correct, points: 1, explanation };
}

export const hoerenIntro = moduleIntro;

export const hoerenTeile: Teil[] = [
  {
    id: "gb1-hoeren-1",
    number: 1,
    title: "Kurze Texte",
    maxRaw: 10,
    instruction:
      "Sie hören fünf kurze Texte, jeden zweimal. Zu jedem Text gibt es eine Richtig-oder-falsch-Aufgabe und eine Aufgabe mit a, b oder c. Das Beispiel ist schon gelöst.",
    introAudio: narrate("gb1-h-t1-intro", [
      "Teil 1.",
      "Sie hören nun fünf kurze Texte.",
      "Sie hören jeden Text zweimal.",
      "Zu jedem Text lösen Sie zwei Aufgaben.",
      "Wählen Sie bei jeder Aufgabe die richtige Lösung.",
      "Lesen Sie zuerst das Beispiel.",
      "Dazu haben Sie zehn Sekunden Zeit.",
    ]),
    endAudio: narrate("gb1-h-t1-ende", ["Ende von Hören, Teil 1."]),
    example: { ...rf(0, "Das Schwimmbad bleibt eine ganze Woche geschlossen.", "falsch", "Es ist nur heute geschlossen und öffnet morgen wieder um acht Uhr."), id: "gb1-h-bsp-1" },
    exampleStimulus: {
      kind: "audio",
      id: "gb1-h-bsp",
      itemIds: ["gb1-h-bsp-1"],
      audio: spoken(
        "gb1-h-bsp",
        POOL,
        [
          "Achtung, eine Durchsage vom Stadtbad Kirchfeld.",
          "Das Schwimmbad bleibt heute geschlossen, weil die Heizung ausgefallen ist.",
          "Morgen früh um acht Uhr öffnen wir wieder wie gewohnt.",
        ],
        { situation: "Sie hören eine Durchsage im Schwimmbad.", readSeconds: 10 },
      ),
    },
    stimuli: [
      {
        kind: "audio",
        id: "gb1-h-t1-1",
        itemIds: ["gb1-h-1", "gb1-h-2"],
        audio: spoken(
          "gb1-h-t1-1",
          PRAXIS,
          [
            "Hallo, hier ist die Praxis Doktor Sommer.",
            "Sie haben am Donnerstag um fünfzehn Uhr einen Termin.",
            "Leider ist die Ärztin an dem Tag krank.",
            "Wir können Ihnen Freitag um elf Uhr oder Montag um neun Uhr anbieten.",
            "Bitte rufen Sie uns bis morgen Mittag zurück.",
            "Die Nummer ist null vier fünf eins, sieben sieben acht zwei null.",
          ],
          { situation: "Sie hören eine Nachricht auf dem Anrufbeantworter.", readCue: "Lesen Sie nun die Aufgaben 1 und 2. Dazu haben Sie zehn Sekunden Zeit." },
        ),
      },
      {
        kind: "audio",
        id: "gb1-h-t1-2",
        itemIds: ["gb1-h-3", "gb1-h-4"],
        audio: spoken(
          "gb1-h-t1-2",
          BAHNHOF,
          [
            "Sehr geehrte Fahrgäste.",
            "Der Regionalzug nach Bremen, planmäßige Abfahrt vierzehn Uhr zwölf, fährt heute von Gleis sechs, nicht von Gleis drei.",
            "Der Zug hat etwa zehn Minuten Verspätung.",
            "Wagen vier ist für Familien mit Kindern reserviert.",
          ],
          { situation: "Sie sind am Bahnhof und hören eine Ansage.", readCue: "Lesen Sie nun die Aufgaben 3 und 4. Dazu haben Sie zehn Sekunden Zeit." },
        ),
      },
      {
        kind: "audio",
        id: "gb1-h-t1-3",
        itemIds: ["gb1-h-5", "gb1-h-6"],
        audio: spoken(
          "gb1-h-t1-3",
          RADIO,
          [
            "Heute Abend öffnet das Stadtmuseum Kirchfeld seine Türen bis zweiundzwanzig Uhr.",
            "Der Eintritt ist an diesem Abend frei.",
            "Um neunzehn Uhr gibt es eine Führung zur Ausstellung über alte Handwerksberufe.",
            "Treffpunkt ist das Foyer.",
            "Die Führung dauert eine Stunde.",
          ],
          { situation: "Sie hören einen Hinweis im Radio.", readCue: "Lesen Sie nun die Aufgaben 5 und 6. Dazu haben Sie zehn Sekunden Zeit." },
        ),
      },
      {
        kind: "audio",
        id: "gb1-h-t1-4",
        itemIds: ["gb1-h-7", "gb1-h-8"],
        audio: spoken(
          "gb1-h-t1-4",
          CEM,
          [
            "Hi Nora, hier ist Cem.",
            "Ich schaffe es heute nicht zum Abendessen, weil mein Zug ausfällt.",
            "Können wir den Termin auf Samstag verschieben?",
            "Ich koche dann.",
            "Schreib mir bitte kurz, ob neunzehn Uhr bei dir passt.",
            "Danke!",
          ],
          { situation: "Sie hören eine Nachricht auf der Mailbox.", readCue: "Lesen Sie nun die Aufgaben 7 und 8. Dazu haben Sie zehn Sekunden Zeit." },
        ),
      },
      {
        kind: "audio",
        id: "gb1-h-t1-5",
        itemIds: ["gb1-h-9", "gb1-h-10"],
        audio: spoken(
          "gb1-h-t1-5",
          SCHULE,
          [
            "Liebe Eltern, der Wandertag der Klasse sechs b am Freitag findet statt.",
            "Die Kinder sollen feste Schuhe und eine Trinkflasche mitbringen.",
            "Das Mittagessen bekommen sie von der Schule.",
            "Treffpunkt ist um acht Uhr fünfzehn im Schulhof, nicht im Klassenzimmer.",
            "Bei starkem Regen verschieben wir den Tag auf den nächsten Mittwoch.",
          ],
          { situation: "Sie hören eine Ansage der Schule.", readCue: "Lesen Sie nun die Aufgaben 9 und 10. Dazu haben Sie zehn Sekunden Zeit." },
        ),
      },
    ],
    items: [
      rf(1, "Der Termin am Donnerstag findet statt.", "falsch", "Die Ärztin ist krank. Der Donnerstagstermin fällt aus."),
      mc(2, "Bis wann soll man zurückrufen?", [
        { id: "a", label: "heute Abend" },
        { id: "b", label: "morgen Mittag" },
        { id: "c", label: "nächste Woche" },
      ], "b", "Die Praxis bittet um einen Rückruf bis morgen Mittag."),
      rf(3, "Der Zug nach Bremen fährt von Gleis drei.", "falsch", "Er fährt heute von Gleis sechs, nicht von Gleis drei."),
      mc(4, "Welche Information stimmt?", [
        { id: "a", label: "Der Zug ist pünktlich." },
        { id: "b", label: "Der Zug hat etwa zehn Minuten Verspätung." },
        { id: "c", label: "Der Zug fällt aus." },
      ], "b", "Die Ansage nennt etwa zehn Minuten Verspätung."),
      rf(5, "Der Eintritt ins Museum ist heute Abend frei.", "richtig", "Das Radio sagt, der Eintritt sei an diesem Abend frei."),
      mc(6, "Was gilt für die Führung?", [
        { id: "a", label: "Sie beginnt um neunzehn Uhr im Foyer." },
        { id: "b", label: "Sie dauert den ganzen Abend." },
        { id: "c", label: "Sie kostet zehn Euro extra." },
      ], "a", "Treffpunkt ist um neunzehn Uhr das Foyer. Die Führung dauert eine Stunde."),
      rf(7, "Cem kommt heute zum Abendessen.", "falsch", "Er schafft es heute nicht, weil sein Zug ausfällt."),
      mc(8, "Was schlägt Cem vor?", [
        { id: "a", label: "Nora soll ins Restaurant kommen." },
        { id: "b", label: "Sie treffen sich am Samstag, und Cem kocht." },
        { id: "c", label: "Sie sagen das Essen ganz ab." },
      ], "b", "Er möchte auf Samstag verschieben und dann kochen."),
      rf(9, "Die Kinder müssen ihr Mittagessen selbst mitbringen.", "falsch", "Das Mittagessen bekommen sie von der Schule."),
      mc(10, "Wo treffen sich die Kinder?", [
        { id: "a", label: "im Klassenzimmer" },
        { id: "b", label: "im Schulhof" },
        { id: "c", label: "am Bahnhof" },
      ], "b", "Treffpunkt ist um acht Uhr fünfzehn im Schulhof, nicht im Klassenzimmer."),
    ],
  },
  {
    id: "gb1-hoeren-2",
    number: 2,
    title: "Vortrag",
    maxRaw: 5,
    instruction: "Sie hören einen Vortrag einmal. Wählen Sie bei den Aufgaben 11 bis 15 die richtige Lösung a, b oder c. Das Beispiel ist schon gelöst.",
    introAudio: narrate("gb1-h-t2-intro", [
      "Teil 2.",
      "Sie hören einen Vortrag.",
      "Sie hören den Text einmal.",
      "Dazu lösen Sie fünf Aufgaben.",
      "Lesen Sie jetzt die Aufgaben 11 bis 15.",
      "Dazu haben Sie sechzig Sekunden Zeit.",
    ]),
    endAudio: narrate("gb1-h-t2-ende", ["Ende von Hören, Teil 2."]),
    example: {
      ...mc(0, "Wer spricht?", [
        { id: "a", label: "eine Teilnehmerin" },
        { id: "b", label: "die Kursleiterin" },
        { id: "c", label: "eine Besucherin der Ausstellung" },
      ], "b", "Frau Helbig stellt sich als Leiterin des Töpferkurses vor."),
      id: "gb1-h-bsp-2",
    },
    stimuli: [
      {
        kind: "audio",
        id: "gb1-h-t2",
        itemIds: ["gb1-h-11", "gb1-h-12", "gb1-h-13", "gb1-h-14", "gb1-h-15"],
        audio: spoken(
          "gb1-h-t2",
          HELBIG,
          [
            "Guten Abend, ich bin Helbig und leite den Töpferkurs an der Volkshochschule Kirchfeld.",
            "Schön, dass Sie da sind. Ich sage zuerst, wie der Kurs abläuft.",
            "Wir treffen uns an acht Dienstagabenden.",
            "Der erste Abend ist der siebte April, immer von halb sieben bis neun.",
            "Nicht im Kunstraum im ersten Stock.",
            "Wir arbeiten in der Werkstatt im Keller.",
            "Der Eingang ist vom Hof aus, neben den Fahrradständern.",
            "Ton und Werkzeug bekommen Sie von uns.",
            "Bitte bringen Sie nur ein altes Hemd mit, weil es schmutzig wird.",
            "Der Kurs kostet sechsundneunzig Euro, das Material ist darin enthalten.",
            "Wenn Sie einen Abend verpassen, gibt es kein Geld zurück.",
            "Sie können den Stoff aber in der offenen Werkstatt nachholen, immer am ersten Samstag im Monat, von zehn bis zwölf.",
            "Am Ende stellen wir die Stücke eine Woche lang im Foyer aus.",
            "Freundinnen und Freunde dürfen kommen, der Eintritt ist frei.",
            "Kinder können wir in der Werkstatt nicht betreuen.",
            "Der Kurs ist nur für Erwachsene.",
            "Fragen beantworte ich nach der Pause.",
          ],
          {
            plays: 1,
            readSeconds: 60,
            betweenPlaysSeconds: 0,
            answerSeconds: 10,
            repeatCue: undefined,
            situation: "Sie hören die Begrüßung zu einem Abendkurs.",
          },
        ),
      },
    ],
    items: [
      mc(11, "Wann beginnt der Kurs?", [
        { id: "a", label: "am siebten April" },
        { id: "b", label: "am ersten Samstag" },
        { id: "c", label: "kommenden Montag" },
      ], "a", "Der erste Abend ist der siebte April."),
      mc(12, "Wo findet der Kurs statt?", [
        { id: "a", label: "im Kunstraum im ersten Stock" },
        { id: "b", label: "in der Kellerwerkstatt, Eingang vom Hof" },
        { id: "c", label: "im Foyer" },
      ], "b", "Sie arbeiten im Keller. Der Eingang ist vom Hof aus."),
      mc(13, "Was sollen die Teilnehmer mitbringen?", [
        { id: "a", label: "Ton" },
        { id: "b", label: "ein altes Hemd" },
        { id: "c", label: "eigenes Werkzeug" },
      ], "b", "Ton und Werkzeug gibt es vor Ort. Mitbringen soll man ein altes Hemd."),
      mc(14, "Was gilt, wenn man einen Abend verpasst?", [
        { id: "a", label: "Man bekommt Geld zurück." },
        { id: "b", label: "Es gibt kein Geld zurück, aber die offene Werkstatt am ersten Samstag." },
        { id: "c", label: "Man muss den ganzen Kurs wiederholen." },
      ], "b", "Kein Geld zurück. Nachholen kann man den Stoff am ersten Samstag im Monat."),
      mc(15, "Was stimmt über die Ausstellung?", [
        { id: "a", label: "Freunde brauchen eine Eintrittskarte." },
        { id: "b", label: "Nur die Teilnehmer dürfen kommen." },
        { id: "c", label: "Freunde dürfen kommen, der Eintritt ist frei." },
      ], "c", "Freundinnen und Freunde dürfen kommen, der Eintritt ist frei."),
    ],
  },
  {
    id: "gb1-hoeren-3",
    number: 3,
    title: "Gespräch",
    maxRaw: 7,
    instruction: "Sie hören ein Gespräch einmal. Sind die Aufgaben 16 bis 22 richtig oder falsch? Das Beispiel ist schon gelöst.",
    introAudio: narrate("gb1-h-t3-intro", [
      "Teil 3.",
      "Sie hören ein Gespräch.",
      "Sie hören das Gespräch einmal.",
      "Dazu lösen Sie sieben Aufgaben.",
      "Lesen Sie jetzt die Aufgaben 16 bis 22.",
      "Dazu haben Sie sechzig Sekunden Zeit.",
    ]),
    endAudio: narrate("gb1-h-t3-ende", ["Ende von Hören, Teil 3."]),
    example: { ...rf(0, "Lea und Martin sprechen über einen Ausflug an die Küste.", "richtig", "Sie planen ein Wochenende an die Küste."), id: "gb1-h-bsp-3" },
    stimuli: [
      {
        kind: "audio",
        id: "gb1-h-t3",
        itemIds: ["gb1-h-16", "gb1-h-17", "gb1-h-18", "gb1-h-19", "gb1-h-20", "gb1-h-21", "gb1-h-22"],
        audio: {
          id: "gb1-h-t3",
          plays: 1,
          readSeconds: 60,
          betweenPlaysSeconds: 0,
          answerSeconds: 10,
          situation: "Sie sitzen in der Straßenbahn und hören, wie sich Lea und Martin unterhalten.",
          speakers: [LEA, MARTIN],
          lines: [
            { speaker: LEA.id, text: "Martin, wegen des Wochenendes an der Küste. Das Hostel ist voll." },
            { speaker: LEA.id, text: "Ich habe zwei Zimmer in einer kleinen Pension genommen." },
            { speaker: MARTIN.id, text: "Ich dachte, das Hostel sei schon gebucht." },
            { speaker: LEA.id, text: "War es nicht. In der Pension ist das Frühstück dabei." },
            { speaker: LEA.id, text: "Vom Bahnhof sind es etwa fünfzehn Minuten zu Fuß." },
            { speaker: MARTIN.id, text: "Sollen wir mit dem Auto fahren? Ich habe noch einen Parkausweis." },
            { speaker: LEA.id, text: "Lieber mit dem Zug. In der Stadt gibt es kaum günstige Parkplätze." },
            { speaker: LEA.id, text: "Unser Zug geht am Samstag um neun Uhr zwölf. Zurück sind wir am Sonntagabend." },
            { speaker: MARTIN.id, text: "Kann mein Bruder mitkommen? Er hat frei." },
            { speaker: LEA.id, text: "Das zweite Zimmer hat nur ein Bett. Ich möchte die Buchung heute nicht mehr ändern." },
            { speaker: LEA.id, text: "Dein Bruder kann ein anderes Mal mitfahren." },
            { speaker: MARTIN.id, text: "Schade, aber einverstanden. Ich bringe die Kamera mit." },
            { speaker: LEA.id, text: "Und ich die Regenjacken. Der Wetterbericht sagt, es wird nass." },
          ],
        },
      },
    ],
    items: [
      rf(16, "Das Hostel ist schon gebucht.", "falsch", "Lea sagt, das Hostel sei voll und nicht gebucht. Sie hat eine Pension genommen."),
      rf(17, "Das Frühstück ist im Preis der Pension enthalten.", "richtig", "Lea sagt: In der Pension ist das Frühstück dabei."),
      rf(18, "Die Pension liegt direkt am Bahnhof.", "falsch", "Vom Bahnhof sind es etwa fünfzehn Minuten zu Fuß."),
      rf(19, "Lea und Martin fahren mit dem Auto.", "falsch", "Lea möchte mit dem Zug fahren, weil Parkplätze teuer sind."),
      rf(20, "Sie fahren am Samstagmorgen los.", "richtig", "Der Zug geht am Samstag um neun Uhr zwölf."),
      rf(21, "Martins Bruder fährt mit.", "falsch", "Lea ändert die Buchung nicht. Der Bruder kann ein anderes Mal mitfahren."),
      rf(22, "Das Wetter soll trocken sein.", "falsch", "Der Wetterbericht sagt, es wird nass. Lea bringt Regenjacken mit."),
    ],
  },
  {
    id: "gb1-hoeren-4",
    number: 4,
    title: "Diskussion",
    maxRaw: 8,
    instruction: "Sie hören eine Diskussion im Radio zweimal. Wer sagt das? Wählen Sie bei den Aufgaben 23 bis 30: Moderator, Frau Okonkwo oder Herr Vogt. Das Beispiel ist schon gelöst.",
    options: who,
    introAudio: narrate("gb1-h-t4-intro", [
      "Teil 4.",
      "Sie hören eine Diskussion im Radio.",
      "Sie hören die Diskussion zweimal.",
      "Dazu lösen Sie acht Aufgaben.",
      "Wer sagt das?",
      "Lesen Sie jetzt die Aufgaben 23 bis 30.",
      "Dazu haben Sie sechzig Sekunden Zeit.",
    ]),
    endAudio: narrate("gb1-h-t4-ende", [
      "Ende von Hören, Teil 4.",
      "Sie haben nun fünf Minuten Zeit, Ihre Ergebnisse auf den Antwortbogen zu übertragen.",
    ]),
    example: { ...whoItem(0, "Beide Gäste waren letzte Woche in der alten Halle.", "mod", "Das sagt der Moderator zur Begrüßung."), id: "gb1-h-bsp-4" },
    stimuli: [
      {
        kind: "audio",
        id: "gb1-h-t4",
        itemIds: ["gb1-h-23", "gb1-h-24", "gb1-h-25", "gb1-h-26", "gb1-h-27", "gb1-h-28", "gb1-h-29", "gb1-h-30"],
        audio: {
          id: "gb1-h-t4",
          plays: 2,
          readSeconds: 60,
          betweenPlaysSeconds: 5,
          answerSeconds: 10,
          repeatCue: REPEAT_CUE,
          situation: "Sie hören eine Diskussion im Stadtradio. Der Moderator ist Herr Kranz. Zu Gast sind Frau Okonkwo und Herr Vogt.",
          speakers: [MODERATOR, OKONKWO, VOGT],
          lines: [
            { speaker: MODERATOR.id, text: "Guten Tag, hier ist Stadtradio Kirchfeld. Ich bin Martin Kranz." },
            { speaker: MODERATOR.id, text: "Heute geht es um die Schwimmhalle. Soll die Stadt eine neue Halle bauen oder die alte sanieren?" },
            { speaker: MODERATOR.id, text: "Bei mir sind die Architektin Frau Okonkwo und Herr Vogt vom Schwimmverein." },
            { speaker: MODERATOR.id, text: "Beide waren letzte Woche in der alten Halle." },
            { speaker: MODERATOR.id, text: "Der Stadtrat entscheidet am Donnerstag." },
            { speaker: MODERATOR.id, text: "Wenn Sie eine Frage haben, schicken Sie sie bis Mittwochmittag an unser Studio." },
            { speaker: OKONKWO.id, text: "Ich bin für einen Neubau." },
            { speaker: OKONKWO.id, text: "Die alte Halle verbraucht sehr viel Energie, die Fenster sind undicht." },
            { speaker: OKONKWO.id, text: "Eine Sanierung würde zwei Jahre dauern, und die Vereine hätten in der Zeit keinen Ort." },
            { speaker: OKONKWO.id, text: "Auf der Wiese bei der Schule könnte eine neue Halle in achtzehn Monaten öffnen." },
            { speaker: OKONKWO.id, text: "Die Buslinie zwölf hält dort schon." },
            { speaker: VOGT.id, text: "Ich möchte die alte Halle sanieren." },
            { speaker: VOGT.id, text: "Sie liegt in der Innenstadt. Ältere Menschen erreichen sie zu Fuß." },
            { speaker: VOGT.id, text: "Ein Neubau kostet deutlich mehr." },
            { speaker: VOGT.id, text: "Unser Verein hat zweihundert Kinder auf der Warteliste." },
            { speaker: VOGT.id, text: "Achtzehn Monate warte ich ungern." },
            { speaker: VOGT.id, text: "Bei einer Sanierung können wir im Sommer den See nutzen und an zwei Abenden das Becken der Schule." },
            { speaker: VOGT.id, text: "Eine Halle weit draußen ist für Familien ohne Auto schlecht." },
            { speaker: MODERATOR.id, text: "Frau Okonkwo, zwei Jahre ohne Halle klingt lange. Herr Vogt, ist der See wirklich eine Lösung für den Winter?" },
            { speaker: OKONKWO.id, text: "Gerade deshalb der Neubau an der Schule, und nicht eine lange Sanierung." },
            { speaker: VOGT.id, text: "Im Winter nutzen wir, wie gesagt, das Schulbecken an zwei Abenden. Das reicht für die Kurse nicht für alle, aber besser als gar nichts." },
          ],
        },
      },
    ],
    items: [
      whoItem(23, "Die Entscheidung fällt am Donnerstag im Stadtrat.", "mod", "Herr Kranz sagt, der Stadtrat entscheide am Donnerstag."),
      whoItem(24, "Die alte Halle verbraucht sehr viel Energie.", "g1", "Das sagt Frau Okonkwo als Argument für einen Neubau."),
      whoItem(25, "Ältere Menschen erreichen die alte Halle zu Fuß.", "g2", "Herr Vogt nennt die Lage in der Innenstadt."),
      whoItem(26, "Eine neue Halle könnte in achtzehn Monaten öffnen.", "g1", "Frau Okonkwo nennt achtzehn Monate für den Neubau an der Schule."),
      whoItem(27, "Der Verein hat zweihundert Kinder auf der Warteliste.", "g2", "Diese Zahl nennt Herr Vogt."),
      whoItem(28, "Zuhörer können bis Mittwochmittag Fragen schicken.", "mod", "Herr Kranz bittet um Fragen bis Mittwochmittag."),
      whoItem(29, "Die Buslinie zwölf hält schon an der Wiese bei der Schule.", "g1", "Frau Okonkwo sagt, die Buslinie zwölf halte dort schon."),
      whoItem(30, "Im Sommer kann der Verein den See nutzen.", "g2", "Herr Vogt sagt das über die Zeit der Sanierung."),
    ],
  },
];
