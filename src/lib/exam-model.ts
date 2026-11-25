import type { Level, Skill } from "@/lib/types";

export type Provider = "goethe" | "telc";

export type ItemType =
  | "rf"
  | "jn"
  | "mc3"
  | "ab"
  | "match"
  | "gapMc"
  | "gapBank"
  | "fill"
  | "writing"
  | "speaking";

export type Choice = { id: string; label: string; image?: string };

export type SpeakerRole = "narrator" | "announcer" | "character" | "moderator" | "guest";

export type Speaker = {
  id: string;
  name: string;
  role: SpeakerRole;
  gender: "f" | "m";
  voice: string;
  rate?: string;
  pitch?: string;
};

export type ScriptLine = {
  speaker: string;
  text: string;
  pauseAfterMs?: number;
};

export type AudioScript = {
  id: string;
  plays: 1 | 2;
  readSeconds: number;
  betweenPlaysSeconds: number;
  answerSeconds: number;
  situation?: string;
  readCue?: string;
  repeatCue?: string;
  /** Acoustic setting for the listening text: station, shop, phone, radio, cafe, street, lecture, quiet. */
  scene?: "station" | "shop" | "phone" | "radio" | "cafe" | "street" | "lecture" | "quiet";
  speakers: Speaker[];
  lines: ScriptLine[];
};

export type Stimulus =
  | {
      kind: "text";
      id: string;
      title?: string;
      body: string;
      genre: "email" | "blog" | "ad" | "sign" | "article" | "forum" | "rules" | "comment";
    }
  | { kind: "image"; id: string; src: string; alt: string }
  | { kind: "audio"; id: string; audio: AudioScript; itemIds: string[] };

export type RubricCriterion = {
  id: string;
  label: string;
  max: number;
};

export type Item = {
  id: string;
  number: number;
  type: ItemType;
  prompt: string;
  options?: Choice[];
  correct: string | string[];
  points: number;
  explanation: string;
  stimulusId?: string;
};

export type WritingTask = {
  id: string;
  situation: string;
  bullets: string[];
  /** Keywords per bullet. A bullet counts when any keyword appears in the text. */
  signals: string[][];
  /** How many bullets must appear for full credit. Defaults to all of them. */
  requiredBullets?: number;
  minWords: number;
  maxWords: number;
  targetWords: number;
  register: string;
  rubric: RubricCriterion[];
  quote?: string;
};

export type SpeakingTask = {
  id: string;
  situation: string;
  prompts: string[];
  topics?: { id: string; title: string; prompts: string[] }[];
  partnerLines?: { name: string; text: string }[];
  examinerAudio?: AudioScript;
  followupAudio?: Record<string, AudioScript>;
  checklist: string[];
  minutes: number;
  rubric: RubricCriterion[];
};

export type Teil = {
  id: string;
  number: number;
  title: string;
  instruction: string;
  suggestedMinutes?: number;
  example?: Item;
  exampleItems?: Item[];
  exampleStimulus?: Stimulus;
  stimuli: Stimulus[];
  items: Item[];
  /** Shared choices for match / who-says items. */
  options?: Choice[];
  allowNone?: boolean;
  noneLabel?: string;
  /** Match and word-bank items may use the same option more than once. */
  allowReuse?: boolean;
  maxRaw: number;
  introAudio?: AudioScript;
  endAudio?: AudioScript;
  /** If set, only the stronger Teil in the group counts (telc B2, choose A or B). */
  alternativeGroup?: string;
  writing?: WritingTask;
  speaking?: SpeakingTask;
};

export type ExamModule = {
  id: string;
  skill: Skill;
  title: string;
  minutes: number;
  sharedClockWith?: string;
  prepMinutes?: number;
  intro: { text: string; audio?: AudioScript };
  transferMinutes?: number;
  teile: Teil[];
  moduleRubric?: RubricCriterion[];
};

export type ScoringRule =
  | {
      kind: "goethe-modular";
      perModuleMax: 100;
      pass: 60;
      convert: { lesen: "x100/30"; hoeren: "x100/30" };
    }
  | { kind: "goethe-a2"; perModuleMax: 25; scale: 1.25; passTotal: 60; passWritten: 45; passOral: 15 }
  | { kind: "goethe-a1"; written: 75; oral: 25; passTotal: 60 }
  | { kind: "telc-60"; max: 60; pass: 36; grades: [number, string][] }
  | {
      kind: "telc-300";
      weights: { lesen: number; sprachbausteine: number; hoeren: number; schreiben: number; sprechen: number };
      passWritten: number;
      passOral: number;
      grades: [number, string][];
    };

export type ExamBreak = {
  afterModuleId: string;
  minutes: number;
  kind: "pause" | "oralPrep";
};

export type MockExam = {
  id: string;
  trackId: string;
  provider: Provider;
  level: Level;
  title: string;
  isFree: boolean;
  label: "Beispieldaten";
  modules: ExamModule[];
  breaks: ExamBreak[];
  scoring: ScoringRule;
  /** Optional telc answer-sheet step before the first module. */
  formalities?: { minutes: number };
};

export const REPEAT_CUE = "Sie hören jetzt den Text noch einmal.";

export const RF_OPTIONS: Choice[] = [
  { id: "richtig", label: "Richtig" },
  { id: "falsch", label: "Falsch" },
];

export const JN_OPTIONS: Choice[] = [
  { id: "ja", label: "Ja" },
  { id: "nein", label: "Nein" },
];

export function itemOptions(item: Item, teil?: Teil): Choice[] {
  if (item.options?.length) return item.options;
  if (item.type === "rf") return RF_OPTIONS;
  if (item.type === "jn") return JN_OPTIONS;
  const shared = teil?.options ? [...teil.options] : [];
  if (teil?.allowNone) shared.push({ id: "0", label: teil.noneLabel ?? "0 – keine passende Anzeige" });
  return shared;
}

export function answerMatches(correct: string | string[], given: string | undefined) {
  if (!given) return false;
  const accepted = Array.isArray(correct) ? correct : [correct];
  const norm = (value: string) => value.trim().toLocaleLowerCase("de");
  return accepted.some((entry) => norm(entry) === norm(given));
}

export function voiceClash(speakers: Pick<Speaker, "id" | "voice">[]): string | null {
  const owner = new Map<string, string>();
  for (const speaker of speakers) {
    const previous = owner.get(speaker.voice);
    if (previous && previous !== speaker.id) {
      return `${previous} und ${speaker.id} nutzen dieselbe Stimme ${speaker.voice}`;
    }
    owner.set(speaker.voice, speaker.id);
  }
  return null;
}

export type AudioClip = {
  id: string;
  speakers: Speaker[];
  lines: ScriptLine[];
  scene?: AudioScript["scene"];
};

export function inferScene(situation?: string): NonNullable<AudioScript["scene"]> {
  const text = (situation ?? "").toLowerCase();
  if (/bahnhof|gleis|haltestelle|flughafen|steig|bahnsteig/.test(text)) return "station";
  if (/anruf|mailbox|telefon|praxis|nachricht auf/.test(text)) return "phone";
  if (/radio|interview|diskussion|nachrichten/.test(text)) return "radio";
  if (/café|cafe|kneipe|straßenbahn|strassenbahn|tram/.test(text)) return "cafe";
  if (/straße|strasse|park|unterhalten|feier/.test(text)) return "street";
  if (/vortrag|kurs|saal|workshop|begrüßung/.test(text)) return "lecture";
  if (/geschäft|geschaeft|kaufhaus|kunden|supermarkt|laden|bad /.test(text)) return "shop";
  if (/gespräch|gespraech/.test(text)) return "cafe";
  return "quiet";
}

export function clipsForScript(script: AudioScript, narrator: Speaker): AudioClip[] {
  const clips: AudioClip[] = [];
  if (script.readCue) {
    clips.push({
      id: `${script.id}__readcue`,
      speakers: [narrator],
      lines: [{ speaker: narrator.id, text: script.readCue }],
    });
  }
  if (script.situation) {
    clips.push({
      id: `${script.id}__situation`,
      speakers: [narrator],
      lines: [{ speaker: narrator.id, text: script.situation }],
    });
  }
  clips.push({
    id: script.id,
    speakers: script.speakers,
    lines: script.lines,
    scene: script.scene ?? inferScene(script.situation),
  });
  return clips;
}

export function clipVoiceError(clip: AudioClip): string | null {
  const used = new Set(clip.lines.map((line) => line.speaker));
  const speakers = clip.speakers.filter((speaker) => used.has(speaker.id));
  const missing = [...used].filter((id) => !clip.speakers.some((speaker) => speaker.id === id));
  if (missing.length) return `Clip ${clip.id}: unbekannte Sprecher ${missing.join(", ")}`;
  const clash = voiceClash(speakers);
  return clash ? `Clip ${clip.id}: ${clash}` : null;
}

export function scriptsInModule(module: ExamModule): AudioScript[] {
  const scripts: AudioScript[] = [];
  if (module.intro.audio) scripts.push(module.intro.audio);
  for (const teil of module.teile) {
    if (teil.introAudio) scripts.push(teil.introAudio);
    if (teil.endAudio) scripts.push(teil.endAudio);
    if (teil.exampleStimulus?.kind === "audio") scripts.push(teil.exampleStimulus.audio);
    if (teil.speaking?.examinerAudio) scripts.push(teil.speaking.examinerAudio);
    if (teil.speaking?.followupAudio) scripts.push(...Object.values(teil.speaking.followupAudio));
    for (const stimulus of teil.stimuli) {
      if (stimulus.kind === "audio") scripts.push(stimulus.audio);
    }
  }
  return scripts;
}

export function teilSpeakers(teil: Teil, narrator: Speaker): Speaker[] {
  const scripts: AudioScript[] = [];
  if (teil.introAudio) scripts.push(teil.introAudio);
  if (teil.endAudio) scripts.push(teil.endAudio);
  if (teil.exampleStimulus?.kind === "audio") scripts.push(teil.exampleStimulus.audio);
  if (teil.speaking?.examinerAudio) scripts.push(teil.speaking.examinerAudio);
  if (teil.speaking?.followupAudio) scripts.push(...Object.values(teil.speaking.followupAudio));
  for (const stimulus of teil.stimuli) {
    if (stimulus.kind === "audio") scripts.push(stimulus.audio);
  }
  const speakers = new Map<string, Speaker>();
  for (const script of scripts) {
    const narratorUsed = Boolean(script.readCue || script.situation || script.lines.some((line) => line.speaker === narrator.id));
    if (narratorUsed) speakers.set(narrator.id, narrator);
    for (const speaker of script.speakers) speakers.set(speaker.id, speaker);
  }
  return [...speakers.values()];
}
