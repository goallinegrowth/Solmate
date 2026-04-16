import { createClient } from "@/lib/supabase/server";
import TeamDashboardClient from "./TeamDashboardClient";
import { notFound } from "next/navigation";

export const revalidate = 0; // Disable static caching so assignments reflect instantly

export default async function TeamDashboard({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // 1. Fetch team details
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!team) notFound();

  // 2. Fetch practice plans and map the inner drills joining them
  const { data: plans } = await supabase
    .from("practice_plans")
    .select(`
      id,
      created_at,
      drills ( id, title, category, duration_minutes )
    `)
    .eq("team_id", params.id)
    .order("created_at", { ascending: false });

  // 3. Process HUD Data
  const practicePlans = plans || [];
  const completedSessions = practicePlans.length;
  
  interface PracticePlanNode {
    id: string;
    created_at: string;
    drills: {
      id: string;
      title: string;
      category: string;
      duration_minutes: number;
    };
  }

  // Calculate active focus by most common category
  const categoryCounts = practicePlans.reduce((acc: Record<string, number>, p: PracticePlanNode) => {
    const cat = p.drills?.category;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  
  let activeFocus = "General Training";
  let maxCount = 0;
  for (const [cat, count] of Object.entries<number>(categoryCounts as Record<string, number>)) {
    if (count > maxCount) {
      maxCount = count;
      activeFocus = cat;
    }
  }

  // Map the drills safely array tracking logic
  const mappedDrills = practicePlans.map((p: PracticePlanNode) => ({
    id: p.drills.id,
    title: p.drills.title,
    category: p.drills.category,
    duration_minutes: p.drills.duration_minutes,
    added_at: p.created_at,
  }));

  return (
    <TeamDashboardClient 
      teamName={team.name} 
      stats={{ completedSessions, activeFocus }}
      drills={mappedDrills} 
    />
  );
}
