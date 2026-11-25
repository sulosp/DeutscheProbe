import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mocks } from "../../src/content/exams/index";
import { NARRATOR } from "../../src/content/exams/voices";
import { REPEAT_CUE, clipVoiceError, clipsForScript, scriptsInModule, teilSpeakers, voiceClash, type AudioClip } from "../../src/lib/exam-model";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function gapMs(seed: string, sameSpeaker: boolean) {
  let hash = 0;
  for (const char of seed) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  if (sameSpeaker) return 150 + (hash % 101);
  const gap = 320 + (hash % 261);
  if (hash % 8 === 0) return Math.min(700, gap + 80);
  return gap;
}

function linesOf(clip: AudioClip) {
  return clip.lines.map((line, index) => {
    const speaker = clip.speakers.find((entry) => entry.id === line.speaker);
    if (!speaker) throw new Error(`${clip.id}: Sprecher ${line.speaker} fehlt`);
    const next = clip.lines[index + 1];
    const pauseAfterMs =
      line.pauseAfterMs ?? (next ? gapMs(`${clip.id}:${index}:${line.text}`, next.speaker === line.speaker) : 0);
    return {
      speaker: speaker.id,
      voice: speaker.voice,
      rate: line.rate ?? speaker.rate ?? "+0%",
      pitch: speaker.pitch ?? "+0Hz",
      text: line.text,
      pauseAfterMs,
    };
  });
}

const groups = mocks.map((exam) => {
  const clips: AudioClip[] = [];
  const seen = new Set<string>();
  const add = (clip: AudioClip) => {
    const error = clipVoiceError(clip);
    if (error) throw new Error(`${exam.id}: ${error}`);
    if (seen.has(clip.id)) return;
    seen.add(clip.id);
    clips.push(clip);
  };
  for (const part of exam.modules) {
    for (const script of scriptsInModule(part)) {
      for (const clip of clipsForScript(script, NARRATOR)) add(clip);
      if (script.repeatCue && script.repeatCue !== REPEAT_CUE) {
        add({ id: `${script.id}__repeat`, speakers: [NARRATOR], lines: [{ speaker: NARRATOR.id, text: script.repeatCue }] });
      }
    }
    for (const teil of part.teile) {
      const clash = voiceClash(teilSpeakers(teil, NARRATOR));
      if (clash) throw new Error(`${exam.id} ${part.skill} Teil ${teil.number}: ${clash}`);
    }
  }
  return {
    folder: exam.trackId,
    clips: clips.map((clip) => ({ id: clip.id, scene: clip.scene ?? "quiet", lines: linesOf(clip) })),
    teile: exam.modules.flatMap((part) =>
      part.teile.map((teil) => ({
        id: `${exam.id}-${part.skill}-${teil.number}`,
        voices: teilSpeakers(teil, NARRATOR).map((speaker) => ({ id: speaker.id, voice: speaker.voice })),
      })),
    ),
  };
});

const payload = {
  narrator: NARRATOR,
  repeat: REPEAT_CUE,
  headphone: "Kopfhörer-Prüfung. Sie hören diese Stimme und danach ein Signal. Wenn beides klar ist, kann die Prüfung starten.",
  groups,
};
const out = resolve(root, "scripts/tts/audio-scripts.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(payload, null, 2));
const count = groups.reduce((sum, group) => sum + group.clips.length, 0);
console.log(`exported ${count} clips in ${groups.length} exams`);
