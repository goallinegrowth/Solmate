import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function TeamsIndexPage() {
  const supabase = createClient();
  
  // Fetch default Sol SC Coach (Fallback simulation logic)
  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("club", "Sol SC")
    .limit(1)
    .single();

  if (!coach) {
    redirect("/");
  }

  // Find their first active team
  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("coach_id", coach.id)
    .limit(1)
    .single();

  if (team) {
    redirect(`/teams/${team.id}`);
  }

  redirect("/");
}
