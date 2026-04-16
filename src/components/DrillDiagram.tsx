// ============================================
// DrillDiagram — Main component
// ============================================
// Renders a soccer field with category-specific
// tactical animations using native SVG.

import React from "react";
import type { DrillCategory } from "@/lib/categories";
import SoccerField from "./drill-animations/SoccerField";
import PassingReceiving from "./drill-animations/PassingReceiving";
import DribblingBallControl from "./drill-animations/DribblingBallControl";
import ShootingFinishing from "./drill-animations/ShootingFinishing";
import DefendingPressing from "./drill-animations/DefendingPressing";
import SmallSidedGames from "./drill-animations/SmallSidedGames";
import FallbackAnimation from "./drill-animations/FallbackAnimation";

interface DrillDiagramProps {
  category: DrillCategory;
  className?: string;
  width?: number;
  height?: number;
}

function getAnimation(category: DrillCategory) {
  switch (category) {
    case "Passing & Receiving":
      return <PassingReceiving />;
    case "Dribbling & Ball Control":
      return <DribblingBallControl />;
    case "Shooting & Finishing":
      return <ShootingFinishing />;
    case "Defending & Pressing":
      return <DefendingPressing />;
    case "Small-Sided Games":
      return <SmallSidedGames />;
    default:
      return <FallbackAnimation categoryName={category} />;
  }
}

function getTacticalTip(category: DrillCategory) {
  switch (category) {
    case "Passing & Receiving":
      return "Lock the ankle and follow through to your target.";
    case "Shooting & Finishing":
      return "Head down, strike through the center of the ball.";
    case "Small-Sided Games":
      return "Keep the ball moving. Look for triangles.";
    case "Dribbling & Ball Control":
      return "Keep the ball close. Head up to read defenders.";
    case "Defending & Pressing":
      return "Don't dive in! Force the attacker wide.";
    default:
      return "Stay focused and execute with intensity.";
  }
}

export default function DrillDiagram({
  category,
  className = "",
  width = 400,
  height = 300,
}: DrillDiagramProps) {
  const tip = getTacticalTip(category);

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg shadow-black/20">
        <SoccerField width={width} height={height}>
          {getAnimation(category)}
        </SoccerField>
      </div>

      {/* Tactical Tip Overlay */}
      <div className="mt-3 bg-navy-mid border-l-4 border-gold rounded-r-md px-3 py-2 flex items-start gap-2 shadow-md">
        <div className="text-[14px] mt-0.5">🧠</div>
        <div>
          <div className="uppercase text-[9px] font-bold text-gray tracking-widest mb-0.5">
            Pro Tip
          </div>
          <div className="text-white text-[11px] font-medium leading-snug">
            {tip}
          </div>
        </div>
      </div>
    </div>
  );
}
