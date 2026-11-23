"use client";

import { useEffect, useState } from "react";

export function useCountdown(endsAt: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!endsAt) return null;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}
