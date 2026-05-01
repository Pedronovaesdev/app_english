export type FlashCard = {
  id: number;
  front: string;
  back: string;
  audio_path: string | null;
  source: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  created_at: string;
};

export type StreakBundle = {
  streak: {
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    xp_multiplier: number;
  };
  progress: { total_xp: number; level: number };
};

export type WeeklyToday = {
  date: string;
  phase: string;
  daily_target_minutes: number;
  saturday_blocks: { key: string; label: string; duration_minutes: number }[];
};
