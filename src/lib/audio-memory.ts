const blobs = new Map<string, Blob>();

export function audioKey(scope: string, taskId: string) {
  return `${scope}:${taskId}`;
}

export function saveAudio(key: string, blob: Blob) {
  blobs.set(key, blob);
}

export function getAudio(key: string) {
  return blobs.get(key) ?? null;
}
