import { useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import { DIALOGUE_BLOCKS } from "../data/activePracticeDialogues";

/** Segunda-feira da semana corrente (data local). */
function weekStartISO(d = new Date()) {
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  n.setDate(n.getDate() + diffToMonday);
  return n.toISOString().slice(0, 10);
}

export function ActivePracticePage() {
  const [blockId, setBlockId] = useState(DIALOGUE_BLOCKS[0]?.id ?? "travel");
  const [recording, setRecording] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const block = useMemo(() => DIALOGUE_BLOCKS.find((b) => b.id === blockId) ?? DIALOGUE_BLOCKS[0], [blockId]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (ev) => {
      if (ev.data.size) chunksRef.current.push(ev.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      setSaved(url);
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecording(true);
    setUploadMsg(null);
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const upload = async () => {
    if (!saved) return;
    setUploadMsg(null);
    const res = await fetch(saved);
    const blob = await res.blob();
    try {
      const out = await api.uploadCheckpoint(weekStartISO(), blob, "checkpoint.webm");
      setUploadMsg(`Enviado: id ${out.id} · ${out.audio_relative_path}`);
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : "Falha no upload");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Active Practice</h2>
        <p className="text-sm text-slate-400">
          Escolhe um bloco temático, lê o diálogo em voz alta ou improvisa a tua linha, grava e envia para o check-point
          semanal.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Cenários inspirados em materiais públicos de ESL (viagem, hotel, restaurante/café, trabalho, saúde, lojas) e
          em vocabulário técnico de ML, arquitetura de software e energia — formulados para prática B1–B2.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Blocos de conversa</p>
        <div className="flex flex-wrap gap-2">
          {DIALOGUE_BLOCKS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBlockId(b.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                b.id === blockId
                  ? "border-ember-500 bg-ember-500/20 text-ember-200"
                  : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {block && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="text-lg font-semibold text-white">{block.title}</h3>
          <p className="mb-4 text-sm text-slate-400">{block.subtitle}</p>
          <ul className="space-y-3">
            {block.lines.map((d, i) => (
              <li key={i} className="text-sm leading-relaxed text-slate-200">
                <span className="font-semibold text-ember-400">{d.speaker}:</span> {d.line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <h3 className="text-sm font-semibold text-slate-200">Gravação</h3>
        <div className="flex flex-wrap gap-2">
          {!recording ? (
            <button
              type="button"
              className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400"
              onClick={() => void start()}
            >
              Gravar resposta
            </button>
          ) : (
            <button
              type="button"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              onClick={stop}
            >
              Parar
            </button>
          )}
          {saved && (
            <>
              <a
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                href={saved}
                download="checkpoint-local.webm"
              >
                Descarregar local
              </a>
              <button
                type="button"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => void upload()}
              >
                Enviar check-point (API)
              </button>
            </>
          )}
        </div>
        {uploadMsg && <p className="text-sm text-emerald-400">{uploadMsg}</p>}
        {saved && <audio className="w-full" controls src={saved} />}
      </section>
    </div>
  );
}
