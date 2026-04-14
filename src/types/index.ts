// ============================================
// SolMate — Shared Type Definitions
// ============================================

export interface Coach {
  id: string;
  name: string;
  email: string;
  club: string;
  created_at: string;
}

export interface Team {
  id: string;
  coach_id: string;
  name: string;
  age_group: string;
  league: string | null;
  created_at: string;
}

export interface PainPoint {
  id: string;
  team_id: string;
  description: string;
  status: "active" | "resolved";
  created_at: string;
}

export interface Drill {
  id: string;
  team_id: string;
  coach_id: string;
  title: string;
  category: string | null;
  duration_minutes: number | null;
  voice_transcript: string | null;
  drill_plan: Record<string, unknown> | null;
  created_at: string;
}

export interface DrillStep {
  id: string;
  drill_id: string;
  step_number: number;
  title: string;
  description: string | null;
  duration_minutes: number | null;
}
