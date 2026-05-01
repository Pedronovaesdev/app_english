import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import type { FlashCard } from "../api/types";

const qualities: { label: string; q: number; cls: string }[] = [
  { label: "Again", q: 0, cls: "bg-red-900/60 hover:bg-red-800" },
  { label: "Hard", q: 3, cls: "bg-orange-900/50 hover:bg-orange-800/60" },
  { label: "Good", q: 4, cls: "bg-emerald-900/50 hover:bg-emerald-800/60" },
  { label: "Easy", q: 5, cls: "bg-sky-900/50 hover:bg-sky-800/60" },
];

export function FlashcardsPage() {
  const [due, setDue] = useState<FlashCard[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cards = await api.dueCards();
      setDue(cards);
      setShow(false);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const card = due[0];

  const onReview = async (quality: number) => {
    if (!card) return;
    try {
      await api.reviewCard(card.id, quality);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao rever");
    }
  };

  if (loading) return <p className="text-slate-400">A carregar…</p>;
  if (err) return <p className="text-red-300">{err}</p>;
  if (!card) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Sem cartões devidos</h2>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          onClick={() => void load()}
        >
          Atualizar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h2 className="text-xl font-semibold text-white">Revisão SM-2</h2>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-inner">
        <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">Frente</p>
        <p className="text-lg text-slate-100">{card.front}</p>
        {show && (
          <>
            <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-slate-500">Verso</p>
            <p className="text-lg text-slate-200">{card.back || "—"}</p>
          </>
        )}
      </div>
      {!show ? (
        <button
          type="button"
          className="w-full rounded-lg bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700"
          onClick={() => setShow(true)}
        >
          Mostrar verso
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {qualities.map((b) => (
            <button
              key={b.label}
              type="button"
              className={`rounded-lg px-2 py-3 text-sm font-semibold text-white ${b.cls}`}
              onClick={() => void onReview(b.q)}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-slate-500">
        {due.length} cartão(ões) na fila
      </p>
    </div>
  );
}
