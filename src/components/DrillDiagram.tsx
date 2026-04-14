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

export default function DrillDiagram({
  category,
  className = "",
  width = 400,
  height = 300,
}: DrillDiagramProps) {
  return (
    <div
      className={`inline-block rounded-xl border border-white/10 overflow-hidden shadow-lg shadow-black/20 ${className}`}
    >
      <SoccerField width={width} height={height}>
        {getAnimation(category)}
      </SoccerField>
    </div>
  );
}
