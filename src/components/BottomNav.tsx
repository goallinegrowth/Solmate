"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-gradient-to-t from-background via-background/90 to-transparent flex items-center justify-around px-2 pb-3 z-50">
      <Link href="/">
        <button
          className={`flex flex-col items-center gap-1 font-semibold text-[10px] px-3 py-1.5 transition-colors ${
            pathname === "/" ? "text-gold" : "text-gray hover:text-gold"
          }`}
        >
          <span
            className={`text-xl transition-transform ${
              pathname === "/" ? "scale-110" : ""
            }`}
          >
            🏠
          </span>
          <span>Home</span>
        </button>
      </Link>

      <Link href="/record">
        <button
          className={`relative flex flex-col items-center gap-1 font-semibold text-[10px] px-3 py-1.5 transition-colors ${
            pathname === "/record" ? "text-gold" : "text-gray hover:text-gold"
          }`}
        >
          <span className="w-[42px] h-[42px] bg-gold rounded-full flex items-center justify-center text-lg text-background -mt-[18px] shadow-[0_4px_20px_rgba(242,169,0,0.3)]">
            🎙️
          </span>
          <span>Record</span>
        </button>
      </Link>

      <Link href="/library">
        <button
          className={`flex flex-col items-center gap-1 font-semibold text-[10px] px-3 py-1.5 transition-colors ${
            pathname === "/library" ? "text-gold" : "text-gray hover:text-gold"
          }`}
        >
          <span
            className={`text-xl transition-transform ${
              pathname === "/library" ? "scale-110" : ""
            }`}
          >
            📋
          </span>
          <span>Library</span>
        </button>
      </Link>

      <Link href="/teams">
        <button
          className={`flex flex-col items-center gap-1 font-semibold text-[10px] px-3 py-1.5 transition-colors ${
            pathname === "/teams" ? "text-gold" : "text-gray hover:text-gold"
          }`}
        >
          <span
            className={`text-xl transition-transform ${
              pathname === "/teams" ? "scale-110" : ""
            }`}
          >
            👥
          </span>
          <span>Teams</span>
        </button>
      </Link>
    </div>
  );
}
