"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface AssignTeamProps {
  drillId: string;
  teams: { id: string; name: string }[];
}

export default function AssignTeamDropdown({ drillId, teams }: AssignTeamProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleAssign = async () => {
    if (!selectedTeamId) return;
    setStatus("saving");

    // Client-side supabase instance since we are executing a rapid insert
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("practice_plans").insert({
      team_id: selectedTeamId,
      drill_id: drillId,
    });

    if (error) {
      console.error(error);
      // Suppress UI crash if duplicate constraint triggered
      if (error.code === '23505') setStatus("success"); 
      else setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <div className="flex flex-col gap-2 mt-8">
      <div className="font-bebas text-[14px] text-gray tracking-[0.08em] uppercase">
        Scouting Assignment
      </div>
      
      <div className="flex gap-2">
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="flex-1 bg-navy-mid border border-white/10 rounded-xl px-4 font-bebas text-[18px] text-white tracking-[0.06em] focus:outline-none focus:border-gold transition-colors appearance-none"
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={status === "saving" || !selectedTeamId}
          className={`flex items-center justify-center w-14 h-14 shrink-0 rounded-xl transition-all shadow-lg text-[22px] ${
            status === "success"
              ? "bg-teal text-background border-none shadow-[0_6px_20px_rgba(45,212,191,0.3)]"
              : status === "saving"
              ? "bg-gold/50 cursor-not-allowed text-background"
              : "bg-gold text-dark hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(242,169,0,0.3)]"
          }`}
        >
          {status === "success" ? "✓" : status === "saving" ? "..." : "十"}
        </button>
      </div>

      {status === "error" && (
        <div className="text-red-500 text-xs italic mt-1 font-semibold">
          Error saving to calendar. Please try again.
        </div>
      )}
      {status === "success" && (
        <div className="text-teal text-xs italic mt-1 font-semibold">
          Successfully added to team practice plan!
        </div>
      )}
    </div>
  );
}
