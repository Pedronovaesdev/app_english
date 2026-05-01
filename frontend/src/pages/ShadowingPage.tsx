import { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { api } from "../api/client";
import type { YoutubeTranscriptLine } from "../api/types";

type InternalPlayer = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};

const LOOP_SECONDS = 5;

function activeLineIndex(lines: YoutubeTranscriptLine[], t: number): number {
  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].start <= t) idx = i;
    else break;
  }
  return idx;
}

export function ShadowingPage() {
  const [videoId, setVideoId] = useState("aqz-KE-bpKQ");
  const [input, setInput] = useState("aqz-KE-bpKQ");
  const [looping, setLooping] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [transcriptLang, setTranscriptLang] = useState("en");
  const [lines, setLines] = useState<YoutubeTranscriptLine[]>([]);
  const [transcriptMeta, setTranscriptMeta] = useState<{ code: string; generated: boolean } | null>(null);
  const [transcriptErr, setTranscriptErr] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const playerRef = useRef<InternalPlayer | null>(null);
  const activeLineRef = useRef<HTMLLIElement | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    setTranscriptErr(null);
    setLines([]);
    setTranscriptMeta(null);
    setActiveIdx(0);
    setTranscriptLoading(true);
    api
      .youtubeTranscript(videoId, transcriptLang)
      .then((r) => {
        if (cancelled) return;
        setLines(r.lines);
        setTranscriptMeta({ code: r.language_code, generated: r.is_generated });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Erro ao carregar legendas";
        setTranscriptErr(msg);
      })
      .finally(() => {
        if (!cancelled) setTranscriptLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId, transcriptLang]);

  useEffect(() => {
    if (!lines.length) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime();
      setActiveIdx(activeLineIndex(lines, t));
    }, 250);
    return () => window.clearInterval(id);
  }, [lines]);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIdx]);

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
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Shadowing (YouTube)</h2>
        <p className="text-sm text-slate-400">
          Loop de {LOOP_SECONDS}s a partir do instante atual — repete o trecho para cópia de pronúncia. Legendas
          nativas (CC) ficam ligadas no vídeo; abaixo aparece a transcrição sincronizada quando o YouTube a expõe.
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

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Legenda (API):</span>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-200"
          value={transcriptLang}
          onChange={(e) => setTranscriptLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="pt">Português (se existir)</option>
        </select>
        {transcriptLoading && <span className="text-xs text-slate-500">A carregar…</span>}
        {transcriptMeta && !transcriptLoading && (
          <span className="text-xs text-slate-500">
            Idioma: {transcriptMeta.code}
            {transcriptMeta.generated ? " · gerada automaticamente" : ""}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-black">
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "480",
            playerVars: {
              rel: 0,
              modestbranding: 1,
              cc_load_policy: 1,
              cc_lang_pref: transcriptLang,
              hl: "en",
            },
          }}
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

      <div className="rounded-xl border border-slate-800 bg-slate-950/60">
        <div className="border-b border-slate-800 px-4 py-2">
          <h3 className="text-sm font-semibold text-slate-200">Legenda no projeto</h3>
          <p className="text-xs text-slate-500">
            Sincronizada com o tempo do vídeo (realça a linha atual). Se falhar, usa o botão CC no próprio player.
          </p>
        </div>
        {transcriptErr && (
          <p className="px-4 py-3 text-sm text-amber-200/90">
            {transcriptErr}
          </p>
        )}
        {!transcriptErr && lines.length === 0 && !transcriptLoading && (
          <p className="px-4 py-3 text-sm text-slate-500">Sem linhas — este vídeo pode não ter legendas públicas.</p>
        )}
        {lines.length > 0 && (
          <ol className="max-h-56 list-none space-y-1 overflow-y-auto px-2 py-3 text-sm leading-snug sm:max-h-72">
            {lines.map((line, i) => (
              <li
                key={`${line.start}-${i}`}
                ref={i === activeIdx ? activeLineRef : undefined}
                className={`rounded-md px-2 py-1.5 text-slate-200 ${
                  i === activeIdx ? "bg-ember-600/25 text-ember-50 ring-1 ring-ember-500/40" : "text-slate-300"
                }`}
              >
                <span className="mr-2 font-mono text-[10px] text-slate-500 tabular-nums">
                  {Math.floor(line.start / 60)}:{String(Math.floor(line.start % 60)).padStart(2, "0")}
                </span>
                {line.text.replace(/\n/g, " ")}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
