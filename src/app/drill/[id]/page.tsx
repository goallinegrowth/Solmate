import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DrillDiagram from "@/components/DrillDiagram";
import AssignTeamDropdown from "./AssignTeamDropdown";
import type { DrillCategory } from "@/lib/categories";

interface DrillStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  duration_minutes: number;
}

export default async function DrillDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Fetch drill and its steps
  const { data: drill } = await supabase
    .from("drills")
    .select("*, drill_steps(*)")
    .eq("id", params.id)
    .single();

  // Fetch available teams for assignment dropdown
  const { data: teams } = await supabase
    .from("teams")
    .select("id, name")
    .order("name");

  if (!drill) {
    notFound();
  }

  const steps: DrillStep[] = (drill.drill_steps || []).sort(
    (a: DrillStep, b: DrillStep) => a.step_number - b.step_number
  );

  return (
    <main className="min-h-screen px-5 pt-10 pb-24 max-w-[500px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/">
          <button className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-[10px] transition-colors">
            ←
          </button>
        </Link>
        <div className="font-bebas text-[22px] tracking-[0.06em] mt-1">
          DRILL PLAN
        </div>
      </div>

      <h1 className="font-bebas text-[26px] text-white tracking-[0.08em] mb-2 leading-none uppercase">
        {drill.title}
      </h1>

      <div className="flex gap-2 flex-wrap mb-5">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gold/10 text-gold shadow-sm border border-gold/20">
          U14 Boys {/* Hardcoded team string since we don't join team data yet */}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gold/10 text-gold shadow-sm border border-gold/20">
          {drill.duration_minutes || 0} Min
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gold/10 text-gold shadow-sm border border-gold/20">
          {drill.category}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-teal/15 text-teal shadow-sm border border-teal/20">
          ✨ Auto-Generated
        </span>
      </div>

      {/* Field Diagram Component */}
      <div className="w-full mb-5">
        <DrillDiagram
          category={drill.category as DrillCategory}
          width={400}
          height={240}
          className="w-full h-auto !rounded-[14px]"
        />
      </div>

      <h2 className="font-bebas text-[18px] text-white tracking-[0.08em] mb-3 mt-6">
        DRILL STEPS
      </h2>

      <div className="flex flex-col">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex gap-3 py-3.5 border-b border-white/5 last:border-0"
          >
            <div className="w-7 h-7 bg-gold text-dark rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
              {step.step_number}
            </div>
            <div>
              <div className="text-[14px] font-bold text-white mb-1">
                {step.title}
              </div>
              <div className="text-[12px] text-gray leading-[1.5]">
                {step.description}
                {step.duration_minutes ? (
                  <span className="ml-1 text-gold/80 italic">
                    ({step.duration_minutes} min)
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="text-gray text-sm italic py-4">
            No steps listed for this drill.
          </div>
        )}
      </div>

      <AssignTeamDropdown drillId={drill.id} teams={teams || []} />
    </main>
  );
}
