import { REPEAT_CUE, type AudioScript, type ExamModule, type Stimulus } from "@/lib/exam-model";
import type { AudioManifest } from "@/lib/audio-manifest";

export type TimelineStep = {
  kind: "audio" | "pause";
  src?: string;
  seconds?: number;
  label: string;
  teilIndex: number;
  stimulusId: string | null;
  highlightItemIds: string[];
  showExample: boolean;
  playNumber?: 1 | 2;
};

function clipSrc(manifest: AudioManifest, id: string) {
  return manifest.clips[id]?.src ?? manifest.cues[id]?.src ?? "";
}

function pushStimulus(
  steps: TimelineStep[],
  manifest: AudioManifest,
  audio: AudioScript,
  teilIndex: number,
  stimulusId: string,
  itemIds: string[],
  showExample: boolean,
) {
  if (audio.readCue) {
    steps.push({
      kind: "audio",
      src: clipSrc(manifest, `${audio.id}__readcue`),
      label: "Aufgaben lesen",
      teilIndex,
      stimulusId,
      highlightItemIds: itemIds,
      showExample,
    });
  }
  if (audio.readSeconds > 0) {
    steps.push({
      kind: "pause",
      seconds: audio.readSeconds,
      label: "Zeit zum Lesen",
      teilIndex,
      stimulusId,
      highlightItemIds: itemIds,
      showExample,
    });
    steps.push({
      kind: "audio",
      src: clipSrc(manifest, "gong"),
      label: "Signal",
      teilIndex,
      stimulusId,
      highlightItemIds: itemIds,
      showExample,
    });
  }
  if (audio.situation) {
    steps.push({
      kind: "audio",
      src: clipSrc(manifest, `${audio.id}__situation`),
      label: "Situation",
      teilIndex,
      stimulusId,
      highlightItemIds: itemIds,
      showExample,
    });
  }
  const body = (playNumber: 1 | 2): TimelineStep => ({
    kind: "audio",
    src: clipSrc(manifest, audio.id),
    label: playNumber === 1 ? "Text" : "Text, noch einmal",
    teilIndex,
    stimulusId,
    highlightItemIds: itemIds,
    showExample,
    playNumber,
  });
  steps.push(body(1));
  if (audio.plays === 2) {
    if (audio.repeatCue) {
      const repeatId = audio.repeatCue !== REPEAT_CUE ? `${audio.id}__repeat` : "repeat";
      steps.push({
        kind: "audio",
        src: clipSrc(manifest, repeatId),
        label: "Ansage",
        teilIndex,
        stimulusId,
        highlightItemIds: itemIds,
        showExample,
      });
    }
    if (audio.betweenPlaysSeconds > 0) {
      steps.push({
        kind: "pause",
        seconds: audio.betweenPlaysSeconds,
        label: "Kurze Pause",
        teilIndex,
        stimulusId,
        highlightItemIds: itemIds,
        showExample,
      });
    }
    steps.push(body(2));
  }
  if (audio.answerSeconds > 0) {
    steps.push({
      kind: "pause",
      seconds: audio.answerSeconds,
      label: "Zeit zum Antworten",
      teilIndex,
      stimulusId,
      highlightItemIds: itemIds,
      showExample,
    });
  }
}

function audioStimulus(stimulus: Stimulus | undefined) {
  if (!stimulus || stimulus.kind !== "audio") return null;
  return stimulus;
}

export function buildHoerenTimeline(module: ExamModule, manifest: AudioManifest): TimelineStep[] {
  const steps: TimelineStep[] = [];
  if (module.intro.audio) {
    steps.push({
      kind: "audio",
      src: clipSrc(manifest, module.intro.audio.id),
      label: "Einführung",
      teilIndex: 0,
      stimulusId: null,
      highlightItemIds: [],
      showExample: false,
    });
  }
  module.teile.forEach((teil, teilIndex) => {
    if (teil.introAudio) {
      steps.push({
        kind: "audio",
        src: clipSrc(manifest, teil.introAudio.id),
        label: `Teil ${teil.number}`,
        teilIndex,
        stimulusId: null,
        highlightItemIds: [],
        showExample: false,
      });
    }
    const example = audioStimulus(teil.exampleStimulus);
    if (example) {
      const ids = [...(teil.exampleItems ?? []), ...(teil.example ? [teil.example] : [])].map((item) => item.id);
      pushStimulus(steps, manifest, example.audio, teilIndex, example.id, ids.length ? ids : example.itemIds, true);
    }
    for (const stimulus of teil.stimuli) {
      if (stimulus.kind !== "audio") continue;
      pushStimulus(steps, manifest, stimulus.audio, teilIndex, stimulus.id, stimulus.itemIds, false);
    }
    if (teil.endAudio) {
      steps.push({
        kind: "audio",
        src: clipSrc(manifest, teil.endAudio.id),
        label: `Ende Teil ${teil.number}`,
        teilIndex,
        stimulusId: null,
        highlightItemIds: [],
        showExample: false,
      });
    }
  });
  return steps;
}
