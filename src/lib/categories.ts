// ============================================
// SolMate — 15 Tactical Drill Categories
// ============================================

export const DRILL_CATEGORIES = [
  "Passing & Receiving",
  "Dribbling & Ball Control",
  "Shooting & Finishing",
  "Defending & Pressing",
  "Goalkeeping",
  "Set Pieces",
  "Positional Play",
  "Transition: Attack to Defense",
  "Transition: Defense to Attack",
  "Small-Sided Games",
  "Fitness & Conditioning",
  "Warm-Up & Cool-Down",
  "Heading & Aerial Duels",
  "Crossing & Wide Play",
  "Team Shape & Formation",
] as const;

export type DrillCategory = (typeof DRILL_CATEGORIES)[number];
