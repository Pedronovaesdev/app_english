import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { StreakBundle, WeeklyToday } from "../api/types";
import { FocusTimer } from "../components/FocusTimer";
import { TimeBoxChallenge } from "../components/TimeBoxChallenge";
import { XPBar } from "../components/XPBar";

export function DashboardPage() {
  const [weekly, setWeekly] = useState<WeeklyToday | null>(null);
  const [bundle, setBundle] = useState<StreakBundle | null>(null);
  const [focusMode, setFocusMode] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [w, s] = await Promise.all([api.weeklyToday(), api.streakPing()]);
        if (!cancelled) {
          setWeekly(w);
          setBundle(s);
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Erro ao carregar API");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const target = weekly?.daily_target_minutes ?? 15;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Foco diário</h2>
          <p className="text-sm text-slate-400">
            Ciclo semanal alinhado ao método · hoje:{" "}
            <span className="text-slate-200">{weekly?.phase ?? "…"}</span>
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            className="accent-ember-500"
            checked={focusMode}
            onChange={(e) => setFocusMode(e.target.checked)}
          />
          Modo foco (menos ruído visual)
        </label>
      </header>

      {err && <p className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-200">{err}</p>}

      {bundle && (
        <XPBar
          totalXp={bundle.progress.total_xp}
          level={bundle.progress.level}
          multiplier={bundle.streak.xp_multiplier}
        />
      )}

      <FocusTimer targetMinutes={target} focusMode={focusMode} />

      {!focusMode && (
        <div className="grid gap-4 md:grid-cols-2">
          <TimeBoxChallenge seconds={45} prompt="Traduza uma frase mentalmente em voz alta (time-box)." />
          <TimeBoxChallenge seconds={30} prompt="Pronuncie o som-alvo 5x antes do bip final." />
        </div>
      )}

      {!focusMode && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-400">
          <p className="mb-2 font-medium text-slate-300">Atalhos</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <Link className="text-ember-400 hover:underline" to="/cards">
                Revisar flashcards
              </Link>
            </li>
            <li>
              <Link className="text-ember-400 hover:underline" to="/saturday">
                Aula de ouro (sábado)
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
