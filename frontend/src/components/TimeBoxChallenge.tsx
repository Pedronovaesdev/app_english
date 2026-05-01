import { useEffect, useRef, useState } from "react";

type Props = {
  seconds: number;
  prompt: string;
  onExpire?: () => void;
};

export function TimeBoxChallenge({ seconds, prompt, onExpire }: Props) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          window.clearInterval(id);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-200">{prompt}</p>
        <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-xs text-ember-400">{left}s</span>
      </div>
      <button
        type="button"
        className="w-full rounded-lg border border-slate-700 py-2 text-sm hover:bg-slate-800"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? "Pausar" : "Iniciar time-box"}
      </button>
    </div>
  );
}
