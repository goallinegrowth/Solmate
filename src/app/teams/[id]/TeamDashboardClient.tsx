"use client";

import { useState } from "react";
import DrillDiagram from "@/components/DrillDiagram";
import type { DrillCategory } from "@/lib/categories";

interface TeamDrill {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  added_at: string;
}

interface TeamDashboardProps {
  teamName: string;
  stats: {
    completedSessions: number;
    activeFocus: string;
  };
  drills: TeamDrill[];
}

export default function TeamDashboardClient({ teamName, stats, drills }: TeamDashboardProps) {
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);

  const toggleDrill = (id: string) => {
    setActiveDrillId(activeDrillId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <main className="min-h-screen pb-24 bg-background">
      {/* Hero Header Area */}
      <div className="relative pt-16 pb-8 px-5 bg-gradient-to-b from-[#D4920A] to-navy overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-background to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-[400px] mx-auto">
          <div className="inline-block px-3 py-1 bg-navy/50 backdrop-blur-md rounded-md text-gold font-bold text-[10px] uppercase tracking-widest border border-white/10 mb-2 shadow-lg">
            High Performance Dashboard
          </div>
          <h1 className="font-bebas text-[42px] text-white leading-none tracking-wide drop-shadow-xl uppercase mb-1">
            {teamName}
          </h1>
          <p className="text-white/80 text-[13px] font-medium tracking-wide">
            Sol SC Academy Core Structure
          </p>
        </div>
      </div>

      <div className="px-5 -mt-3 relative z-30 max-w-[400px] mx-auto">
        {/* HUD Vitals Overlay */}
        <div className="bg-navy-mid border-t-2 border-t-gold border-x border-b border-white/10 rounded-2xl p-4 shadow-xl mb-8 flex divide-x divide-white/10">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-1">
              Sessions
            </div>
            <div className="font-bebas text-[28px] text-white leading-none">
              {stats.completedSessions}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <div className="text-[10px] text-teal uppercase tracking-widest font-semibold mb-1">
              Active Focus
            </div>
            <div className="font-bebas text-[18px] text-white leading-tight text-center line-clamp-1">
              {stats.activeFocus}
            </div>
          </div>
        </div>

        <h2 className="font-bebas text-[22px] text-white tracking-[0.06em] mb-4 uppercase">
          Upcoming Practices
        </h2>

        {/* Timeline View */}
        <div className="relative pl-3">
          {/* Vertical Timeline Track */}
          <div className="absolute top-2 bottom-0 left-[18px] w-px bg-white/10 z-0"></div>

          {drills.length === 0 ? (
            <div className="text-gray text-sm italic py-4 pl-8">
              No sessions locked into the calendar yet!
            </div>
          ) : (
            <div className="flex flex-col gap-6 relative z-10">
              {drills.map((drill) => {
                const isActive = activeDrillId === drill.id;
                
                return (
                  <div key={drill.id} className="flex gap-4 relative">
                    {/* Timeline Node Point */}
                    <div className="mt-1.5 w-3 h-3 rounded-full bg-gold shrink-0 relative z-20 shadow-[0_0_8px_rgba(242,169,0,0.6)]">
                      <div className="absolute inset-[-4px] rounded-full border border-gold/30"></div>
                    </div>

                    <div className="flex-1">
                      {/* Interactive Drill Card header */}
                      <div 
                        onClick={() => toggleDrill(drill.id)}
                        className={`bg-navy-mid border transition-colors cursor-pointer rounded-xl p-3 shadow-lg ${
                          isActive ? "border-gold/50 bg-navy-light" : "border-white/5 hover:border-gold/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-gold text-[10px] font-bold uppercase tracking-wider mb-0.5">
                              {formatDate(drill.added_at)}
                            </div>
                            <h3 className="font-bebas text-[18px] text-white tracking-wide leading-tight line-clamp-2">
                              {drill.title}
                            </h3>
                          </div>
                          <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-background/50 text-white/50 text-xs">
                            {isActive ? "▼" : "▶"}
                          </div>
                        </div>

                        {/* Interactive Dropdown containing DrillDiagram natively inserted */}
                        {isActive && (
                          <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
                            <div className="w-full mb-3 flex items-center justify-between">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-teal/15 text-teal border border-teal/20">
                                {drill.category}
                              </span>
                              <span className="text-[11px] font-semibold text-gray">
                                ⏱️ {drill.duration_minutes || 0} Min
                              </span>
                            </div>
                            
                            <DrillDiagram 
                              category={drill.category as DrillCategory} 
                              width={320}
                              height={190}
                              className="w-full h-auto !rounded-lg"
                            />
                            
                            <div className="mt-3 font-bebas text-[14px] text-gray tracking-widest text-center">
                              ANIMATION LOADED
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
