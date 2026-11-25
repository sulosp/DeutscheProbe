function voices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("de"));
}

function pickVoice(role: "examiner" | "partner") {
  const list = voices();
  if (list.length === 0) return null;
  if (role === "examiner") return list[0] ?? null;
  return list[1] ?? list[0] ?? null;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Speaks German aloud. Resolves when the line has been spoken. Does not return the text. */
export function speakGerman(text: string, role: "examiner" | "partner"): Promise<void> {
  const estimate = Math.min(9000, 1400 + text.length * 28);
  if (typeof window === "undefined" || !window.speechSynthesis) return wait(estimate);

  return new Promise((resolve) => {
    let settled = false;
    const started = Date.now();
    const finish = () => {
      if (settled) return;
      settled = true;
      const elapsed = Date.now() - started;
      if (elapsed < estimate) {
        window.setTimeout(resolve, estimate - elapsed);
        return;
      }
      resolve();
    };
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE";
    utter.voice = pickVoice(role);
    utter.pitch = role === "examiner" ? 0.82 : 1.18;
    utter.rate = role === "examiner" ? 0.92 : 1.02;
    utter.onend = finish;
    utter.onerror = finish;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    window.setTimeout(finish, estimate + 4000);
  });
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
