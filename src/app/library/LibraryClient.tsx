"use client";

import { useState } from "react";
import Link from "next/link";
import { DRILL_CATEGORIES } from "@/lib/categories";

interface Drill {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  created_at: string;
}

export default function LibraryClient({ initialDrills }: { initialDrills: Drill[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDrills = initialDrills.filter((drill) => {
    const categoryMatch = activeCategory === "All" || drill.category === activeCategory;
    
    const term = searchQuery.toLowerCase();
    const titleMatch = drill.title.toLowerCase().includes(term);
    const catMatch = drill.category.toLowerCase().includes(term);
    const searchMatch = term === "" || titleMatch || catMatch;

    return categoryMatch && searchMatch;
  });

  return (
    <main className="min-h-screen px-5 pt-10 pb-24 bg-background">
      <div className="max-w-[400px] mx-auto">
        <h1 className="font-bebas text-4xl text-white mb-2 tracking-wide uppercase">
          Drill Library
        </h1>
        <p className="text-[#8A99B4] text-[13px] font-normal mb-6">
          Browse your academy&apos;s tactical playbook.
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gold text-sm opacity-90 drop-shadow-[0_2px_4px_rgba(242,169,0,0.5)]">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search tactical focus, drills, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B1921] border border-white/10 text-white text-[14px] rounded-[14px] py-3.5 pl-11 pr-4 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-gray/60 placeholder:font-medium shadow-inner"
          />
        </div>

        {/* Filter Scroll */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          <button
            onClick={() => setActiveCategory("All")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              activeCategory === "All"
                ? "bg-gold text-background shadow-[0_4px_12px_rgba(242,169,0,0.3)]"
                : "bg-navy-mid border border-white/5 text-gray hover:text-white"
            }`}
          >
            All Drills
          </button>
          {DRILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-gold text-background shadow-[0_4px_12px_rgba(242,169,0,0.3)]"
                  : "bg-navy-mid border border-white/5 text-gray hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Drill Grid */}
        {filteredDrills.length === 0 ? (
          <div className="text-center py-10 px-4">
            {searchQuery ? (
              <div className="text-gray text-sm font-medium leading-relaxed">
                No drills found for <span className="text-gold font-bold">&quot;{searchQuery}&quot;</span>. <br/> Try a broader tactical focus or check the US Soccer Standards.
              </div>
            ) : (
              <div className="text-gray italic text-sm">
                No drills found for this category.
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDrills.map((drill) => (
              <div
                key={drill.id}
                className="bg-navy-mid border border-white/5 rounded-[16px] p-4 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[radial-gradient(circle,rgba(242,169,0,0.06)_0%,transparent_70%)]"></div>
                
                <div>
                  <div className="inline-block px-2 py-0.5 bg-navy-light text-gold text-[9px] font-bold uppercase tracking-wider rounded-sm mb-2">
                    {drill.category}
                  </div>
                  <h3 className="font-bebas text-[22px] text-white tracking-[0.06em] leading-tight">
                    {drill.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-gray text-xs font-semibold">
                    <span>⏱️</span>
                    <span>{drill.duration_minutes || 0} MIN</span>
                  </div>

                  <Link href={`/drill/${drill.id}`}>
                    <button className="bg-gold hover:bg-[#D4920A] text-background font-bebas text-[14px] px-4 py-1.5 rounded-lg transition-colors tracking-wide">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
