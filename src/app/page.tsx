import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Disable static caching for home page to always get latest drills

interface Drill {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  created_at: string;
}

function getIconForCategory(category: string) {
  const c = category.toLowerCase();
  if (c.includes("pass")) return "⚡";
  if (c.includes("defend")) return "🛡️";
  if (c.includes("shoot") || c.includes("finish")) return "🎯";
  if (c.includes("transition")) return "🔄";
  if (c.includes("dribbl")) return "🏃";
  return "📋";
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function Home() {
  const supabase = createClient();
  const { data: recentDrills } = await supabase
    .from("drills")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const drills: Drill[] = recentDrills || [];

  return (
    <main className="min-h-screen px-5 pt-10 pb-24">
      <div className="max-w-[400px] mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-[72px] h-[86px] flex flex-col items-center justify-center">
              <div
                className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-teal-[--teal] z-0"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%, 0% 0%)",
                }}
              ></div>
              <div
                className="absolute top-0 left-0 w-full h-full bg-navy z-10"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%, 0% 0%)",
                }}
              ></div>
              <div className="relative z-20 flex flex-col items-center gap-[2px] -mt-1">
                <div className="relative w-7 h-7">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gold rounded-full"></div>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      className="absolute top-1/2 left-1/2 w-[2px] h-3 bg-gold rounded-[1px] origin-top"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-6px)`,
                      }}
                    ></div>
                  ))}
                </div>
                <div className="font-bebas text-xs text-white tracking-[0.2em] leading-none">
                  SOL SC
                </div>
                <div className="flex gap-[3px] mt-[1px]">
                  <span className="text-gold text-[6px] leading-none">★</span>
                  <span className="text-gold text-[6px] leading-none">★</span>
                  <span className="text-gold text-[6px] leading-none">★</span>
                  <span className="text-gold text-[6px] leading-none">★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-bebas text-[28px] text-white mb-1 tracking-[0.06em]">
          Good morning, Coach
        </h2>
        <p className="text-[#8A99B4] text-[13px] font-normal mb-5">
          Ready to tackle today&apos;s training challenges?
        </p>

        <Link href="/record">
          <div className="bg-gradient-to-br from-gold to-[#D4920A] rounded-2xl p-5 mb-5 cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(242,169,0,0.3)]">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)]"></div>
            <div className="text-[28px] mb-2 leading-none">🎙️</div>
            <h3 className="font-bebas text-[22px] text-[#060F1E] tracking-[0.08em] leading-none">
              RECORD PAIN POINT
            </h3>
            <p className="text-[12px] text-[#060F1E]/70 font-medium mt-1">
              Describe what your players struggle with — SolMate handles the
              rest
            </p>
          </div>
        </Link>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-navy-mid border border-white/5 rounded-[14px] py-3.5 px-3 text-center">
            <div className="font-bebas text-[28px] text-gold leading-none">
              {drills.length > 0 ? drills.length + 40 : 47}
            </div>
            <div className="text-[10px] text-gray uppercase tracking-[0.04em] mt-1 font-semibold">
              Drills Made
            </div>
          </div>
          <div className="bg-navy-mid border border-white/5 rounded-[14px] py-3.5 px-3 text-center">
            <div className="font-bebas text-[28px] text-gold leading-none">6</div>
            <div className="text-[10px] text-gray uppercase tracking-[0.04em] mt-1 font-semibold">
              Teams
            </div>
          </div>
          <div className="bg-navy-mid border border-white/5 rounded-[14px] py-3.5 px-3 text-center">
            <div className="font-bebas text-[28px] text-gold leading-none">12h</div>
            <div className="text-[10px] text-gray uppercase tracking-[0.04em] mt-1 font-semibold">
              Saved
            </div>
          </div>
        </div>

        <h3 className="font-bebas text-[18px] text-white tracking-[0.08em] mb-3">
          RECENT DRILLS
        </h3>

        {drills.length === 0 ? (
          <div className="text-center py-8 text-gray text-sm italic">
            No drills yet. Record a pain point to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {drills.map((drill) => (
              <Link key={drill.id} href={`/drill/${drill.id}`}>
                <div className="flex items-center gap-3 p-3 bg-navy-mid border border-white/5 rounded-xl hover:bg-navy-light transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gold/10 rounded-[10px] flex items-center justify-center text-lg shrink-0">
                    {getIconForCategory(drill.category)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white line-clamp-1">
                      {drill.title}
                    </div>
                    <div className="text-[11px] text-gray mt-0.5 max-w-[200px] truncate">
                      {drill.category} · {drill.duration_minutes || 0} min
                    </div>
                  </div>
                  <div className="text-[10px] text-gray font-medium">
                    {formatDate(drill.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
