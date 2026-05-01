import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { WeeklyToday } from "../api/types";

export function SaturdayPage() {
  const [weekly, setWeekly] = useState<WeeklyToday | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void api
      .weeklyToday()
      .then(setWeekly)
      .catch((e) => setErr(e instanceof Error ? e.message : "Erro"));
  }, []);

  if (err) return <p className="text-red-300">{err}</p>;
  if (!weekly) return <p className="text-slate-400">A carregar…</p>;

  const isSat = weekly.phase === "saturday_gold";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Missões de sábado</h2>
        <p className="text-sm text-slate-400">Aula de ouro · 60 minutos em blocos.</p>
      </div>

      {!isSat && (
        <p className="rounded-lg border border-amber-900/40 bg-amber-950/30 p-4 text-sm text-amber-100">
          Hoje não é sábado no ciclo local. A UI completa de missão aparece no sábado; podes mesmo assim rever a
          estrutura abaixo.
        </p>
      )}

      <ol className="space-y-3">
        {weekly.saturday_blocks.length === 0 &&
          ["Warm-up (10)", "Active Practice (20)", "Games (20)", "Mission (10)"].map((label) => (
            <li
              key={label}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
            >
              <span className="font-medium text-slate-200">{label}</span>
              <span className="text-xs text-slate-500">min</span>
            </li>
          ))}
        {weekly.saturday_blocks.map((b) => (
          <li
            key={b.key}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-100">{b.label}</p>
              <p className="text-xs text-slate-500">{b.key}</p>
            </div>
            <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-sm text-ember-400">
              {b.duration_minutes} min
            </span>
          </li>
        ))}
      </ol>

      <p className="text-xs text-slate-500">
        Check-point de áudio em <span className="text-slate-300">Active Practice</span> desbloqueia missão no
        backend.
      </p>
    </div>
  );
}
