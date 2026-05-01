import { useState } from "react";
import { api } from "../api/client";

export function ArticlesPage() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const importPhrases = async () => {
    const phrases = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!phrases.length) {
      setMsg("Cola uma frase por linha (ML / Oil & Gas).");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await api.importArticlePhrases(phrases, "article_ml_oil");
      setMsg(`Criados ${res.created_ids.length} flashcards (ids: ${res.created_ids.slice(0, 8).join(", ")}…)`);
      setText("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Importador de artigos</h2>
        <p className="text-sm text-slate-400">
          Foco Machine Learning & Petróleo: cola frases desconhecidas (uma por linha). Cada linha vira cartão na
          fila SM-2 (verso vazio para preencheres depois).
        </p>
      </div>
      <textarea
        className="min-h-[220px] w-full rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-100"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Ex.:\nThe forward curve is in backwardation after the inventory shock.\nWe hedged basis risk with a crack spread overlay."}
      />
      <button
        type="button"
        disabled={busy}
        className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 disabled:opacity-50"
        onClick={() => void importPhrases()}
      >
        {busy ? "A importar…" : "Enviar para flashcards"}
      </button>
      {msg && <p className="text-sm text-slate-300">{msg}</p>}
    </div>
  );
}
