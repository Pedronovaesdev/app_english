import { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

type InternalPlayer = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};

const LOOP_SECONDS = 5;

export function ShadowingPage() {
  const [videoId, setVideoId] = useState("aqz-KE-bpKQ");
  const [input, setInput] = useState("aqz-KE-bpKQ");
  const [looping, setLooping] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const playerRef = useRef<InternalPlayer | null>(null);

  const tick = useCallback(() => {
    const p = playerRef.current;
    if (!p || !looping) return;
    const t = p.getCurrentTime();
    if (t >= loopEnd - 0.05) {
      p.seekTo(loopStart, true);
    }
  }, [looping, loopEnd, loopStart]);

  useEffect(() => {
    if (!looping) return;
    const id = window.setInterval(tick, 120);
    return () => window.clearInterval(id);
  }, [looping, tick]);

  const applyVideo = () => {
    setVideoId(input.trim() || videoId);
    setLooping(false);
  };

  const startFiveSecondLoop = () => {
    const p = playerRef.current;
    if (!p) return;
    const start = p.getCurrentTime();
    setLoopStart(start);
    setLoopEnd(start + LOOP_SECONDS);
    setLooping(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Shadowing (YouTube)</h2>
        <p className="text-sm text-slate-400">
          Loop de {LOOP_SECONDS}s a partir do instante atual — repete o trecho para cópia de pronúncia.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ID do vídeo (ex.: aqz-KE-bpKQ)"
        />
        <button
          type="button"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          onClick={applyVideo}
        >
          Carregar
        </button>
        <button
          type="button"
          className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400"
          onClick={startFiveSecondLoop}
        >
          Loop 5s aqui
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          onClick={() => setLooping(false)}
        >
          Parar loop
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-black">
        <YouTube
          videoId={videoId}
          opts={{ width: "100%", height: "480", playerVars: { rel: 0, modestbranding: 1 } }}
          onReady={(e: { target: InternalPlayer }) => {
            playerRef.current = e.target;
          }}
        />
      </div>

      {looping && (
        <p className="text-sm text-ember-400">
          Loop ativo: {loopStart.toFixed(1)}s → {loopEnd.toFixed(1)}s
        </p>
      )}
    </div>
  );
}
