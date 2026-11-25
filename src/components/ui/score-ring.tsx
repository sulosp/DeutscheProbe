export function ScoreRing({ percent, label = "Ergebnis" }: { percent: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="grid h-32 w-32 place-items-center rounded-full"
      style={{ background: `conic-gradient(var(--brand-vivid) ${safe * 3.6}deg, var(--surface-sunken) 0deg)` }}
      role="img"
      aria-label={`${label} ${safe} Prozent`}
    >
      <div className="grid h-[6.5rem] w-[6.5rem] place-items-center rounded-full bg-raised">
        <div className="text-center">
          <div className="text-h1 font-extrabold tabular-nums leading-none">{safe}%</div>
          <div className="mt-1 text-micro text-muted">{label}</div>
        </div>
      </div>
    </div>
  );
}
