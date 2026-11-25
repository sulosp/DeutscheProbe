export type AudioRef = { src: string; durationSec: number };

export type AudioManifest = {
  cues: Record<string, AudioRef>;
  clips: Record<string, AudioRef>;
};
