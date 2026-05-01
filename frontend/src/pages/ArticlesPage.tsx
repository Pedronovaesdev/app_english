import { useState } from "react";
import { api } from "../api/client";

type Row = { id: string; word: string; context: string };

const newRow = (): Row => ({
  id: crypto.randomUUID(),
  word: "",
  context: "",
});

export function ArticlesPage() {
  const [rows, setRows] = useState<Row[]>(() => [newRow()]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const setRow = (id: string, patch: Partial<Pick<Row, "word" | "context">>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const removeRow = (id: string) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  };

  const importItems = async () => {
    const items = rows
      .map((r) => ({ word: r.word.trim(), context: r.context.trim() }))
      .filter((r) => r.word.length > 0);
    if (!items.length) {
      setMsg("Preenche pelo menos a palavra ou expressão numa linha.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await api.importArticleItems(items, "article_ml_oil");
      setMsg(
        `Criados ${res.created_ids.length} flashcards (frente = termo, verso = frase). Ids: ${res.created_ids.slice(0, 8).join(", ")}${res.created_ids.length > 8 ? "…" : ""}`,
      );
      setRows([newRow()]);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Importador de artigos</h2>
        <p className="text-sm text-slate-400">
          Machine Learning e Oil &amp; Gas: para cada linha, indica a <strong className="text-slate-200">palavra ou
          expressão</strong> a fixar e a <strong className="text-slate-200">frase ou verso</strong> do artigo onde
          aparece. O termo vai para a <em>frente</em> do flashcard e o contexto para o <em>verso</em> (revisão SM-2 na
          página Flashcards).
        </p>
      </div>

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 shadow-inner space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Cartão {idx + 1}
              </span>
              {rows.length > 1 && (
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-red-300"
                  onClick={() => removeRow(row.id)}
                >
                  Remover linha
                </button>
              )}
            </div>
            <label className="block space-y-1">
              <span className="text-xs text-slate-400">Palavra ou expressão (frente)</span>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                value={row.word}
                onChange={(e) => setRow(row.id, { word: e.target.value })}
                placeholder="Ex.: backwardation"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-400">Frase, verso ou contexto (verso)</span>
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                value={row.context}
                onChange={(e) => setRow(row.id, { context: e.target.value })}
                placeholder="Ex.: The forward curve is in backwardation after the inventory shock."
              />
            </label>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          onClick={addRow}
        >
          Adicionar outro cartão
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 disabled:opacity-50"
          onClick={() => void importItems()}
        >
          {busy ? "A importar…" : "Enviar para flashcards"}
        </button>
      </div>
      {msg && <p className="text-sm text-slate-300">{msg}</p>}
    </div>
  );
}
