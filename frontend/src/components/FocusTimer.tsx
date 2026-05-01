import { useEffect, useMemo, useState } from "react";

type Props = {
  targetMinutes: number;
  focusMode: boolean;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function FocusTimer({ targetMinutes, focusMode }: Props) {
  const totalSec = useMemo(() => Math.max(1, targetMinutes) * 60, [targetMinutes]);
  const [left, setLeft] = useState(totalSec);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setLeft(totalSec);
    setRunning(false);
  }, [totalSec]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  return (
    <div
      className={`rounded-2xl border p-6 ${
        focusMode ? "border-ember-500/40 bg-ink-900 shadow-lg shadow-ember-500/10" : "border-slate-800 bg-slate-900/40"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs uppercase tracking-widest text-slate-500">Sessão guiada</p>
        <div className="font-mono text-6xl font-semibold tabular-nums text-white">
          {pad(mm)}:{pad(ss)}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pausar" : "Começar"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            onClick={() => {
              setRunning(false);
              setLeft(totalSec);
            }}
          >
            Reiniciar
          </button>
        </div>
        {left === 0 && <p className="text-sm text-emerald-400">Tempo da sessão concluído.</p>}
      </div>
    </div>
  );
}
