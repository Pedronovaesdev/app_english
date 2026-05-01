import type { FlashCard, StreakBundle, WeeklyToday } from "./types";

const json = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
};

export const api = {
  health: () => json<{ status: string }>("/api/health"),
  weeklyToday: () => json<WeeklyToday>("/api/weekly/today"),
  streak: () => json<StreakBundle>("/api/streak"),
  streakPing: () =>
    json<StreakBundle>("/api/streak/ping", { method: "POST", body: JSON.stringify({}) }),
  dueCards: () => json<FlashCard[]>("/api/cards/due"),
  reviewCard: (id: number, quality: number) =>
    json<FlashCard>(`/api/cards/${id}/review`, {
      method: "POST",
      body: JSON.stringify({ quality }),
    }),
  importArticlePhrases: (phrases: string[], source = "article") =>
    json<{ created_ids: number[] }>("/api/articles/import", {
      method: "POST",
      body: JSON.stringify({ phrases, source }),
    }),
  uploadCheckpoint: async (weekStart: string, blob: Blob, filename: string) => {
    const fd = new FormData();
    fd.append("week_start", weekStart);
    fd.append("file", blob, filename);
    const res = await fetch("/api/checkpoints/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ id: number; audio_relative_path: string; mission_unlocked: boolean }>;
  },
};
