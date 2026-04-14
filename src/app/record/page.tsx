import { createClient } from "@/lib/supabase/server";
import RecordClient from "./RecordClient";

export const revalidate = 0;

export default async function RecordPage() {
  const supabase = createClient();

  // Ensure a dummy coach exists
  let { data: coach } = await supabase.from("coaches").select("id").limit(1).single();

  if (!coach) {
    const { data: newCoach } = await supabase
      .from("coaches")
      .insert({ name: "Dummy Coach", email: "dummy@solmate.com", club: "Sol SC" })
      .select("id")
      .single();
    coach = newCoach;
  }

  // Ensure dummy teams exist
  let { data: teams } = await supabase
    .from("teams")
    .select("id, name, age_group")
    .eq("coach_id", coach!.id);

  if (!teams || teams.length === 0) {
    const dummyTeams = [
      { name: "Boys Elite", age_group: "U14", league: "FPL", coach_id: coach!.id },
      { name: "Girls Premier", age_group: "U12", league: "CFSA", coach_id: coach!.id },
      { name: "Boys Academy", age_group: "U16", league: "FPL", coach_id: coach!.id },
    ];
    await supabase.from("teams").insert(dummyTeams);

    const { data: fetchTeams } = await supabase
      .from("teams")
      .select("id, name, age_group")
      .eq("coach_id", coach!.id);
    teams = fetchTeams;
  }

  return <RecordClient coachId={coach!.id} teams={teams || []} />;
}
