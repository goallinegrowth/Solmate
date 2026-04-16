import { createClient } from "@/lib/supabase/server";
import LibraryClient from "./LibraryClient";

export const revalidate = 0; // Disable static caching for library

export default async function LibraryPage() {
  const supabase = createClient();
  const { data: drills } = await supabase
    .from("drills")
    .select("*")
    .order("created_at", { ascending: false });

  return <LibraryClient initialDrills={drills || []} />;
}
