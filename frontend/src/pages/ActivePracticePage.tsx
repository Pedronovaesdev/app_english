import { useRef, useState } from "react";
import { api } from "../api/client";

const DIALOGUES = [
  { speaker: "A", line: "We're seeing strong drawdowns across the book — how do you want to hedge?" },
  { speaker: "B", line: "Shift duration into the belly and keep gamma flat until OPEC prints." },
  { speaker: "A", line: "Copy that. I'll leg into the strangle and update you after the rig count." },
];

/** Segunda-feira da semana corrente (data local). */
function weekStartISO(d = new Date()) {
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  n.setDate(n.getDate() + diffToMonday);
  return n.toISOString().slice(0, 10);
}

export function ActivePracticePage() {
  const [recording, setRecording] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Active Practice</h2>
        <p className="text-sm text-slate-400">
          Diálogos de contexto profissional · grava a tua resposta e guarda localmente ou envia para o check-point.
        </p>
      </div>

      <ul className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        {DIALOGUES.map((d, i) => (
          <li key={i} className="text-sm leading-relaxed text-slate-200">
            <span className="font-semibold text-ember-400">{d.speaker}:</span> {d.line}
          </li>
        ))}
      </ul>

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
    </div>
  );
}
