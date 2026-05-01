type Props = {
  totalXp: number;
  level: number;
  multiplier: number;
};

export function XPBar({ totalXp, level, multiplier }: Props) {
  const into = totalXp % 500;
  const pct = Math.min(100, (into / 500) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Nível {level} · {totalXp} XP
        </span>
        <span className="text-ember-400">×{multiplier.toFixed(2)} fogo</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-ember-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
