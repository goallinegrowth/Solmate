// ============================================
// Fallback Animation — Generic passing loop
// ============================================
// Simple 2-dot passing loop with category name display.
// Used for the 10 categories without specific animations.

import React from "react";

interface FallbackAnimationProps {
  categoryName: string;
}

export default function FallbackAnimation({
  categoryName,
}: FallbackAnimationProps) {
  const ballPath = "M 140 150 L 260 150 L 140 150";

  return (
    <g>
      {/* ---- Dashed passing lane ---- */}
      <line
        x1="140"
        y1="150"
        x2="260"
        y2="150"
        stroke="#F2A900"
        strokeWidth="1"
        strokeDasharray="5 5"
        opacity="0.2"
      />

      {/* ---- Left player ---- */}
      <circle cx="140" cy="150" r="8" fill="#F2A900" opacity="0.8">
        <animate
          attributeName="r"
          values="8;10;8;8;8"
          keyTimes="0;0.05;0.15;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="140"
        y="153.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#0B2545"
      >
        A
      </text>

      {/* ---- Right player ---- */}
      <circle cx="260" cy="150" r="8" fill="#F2A900" opacity="0.8">
        <animate
          attributeName="r"
          values="8;8;8;10;8"
          keyTimes="0;0.45;0.5;0.55;0.65"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="260"
        y="153.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#0B2545"
      >
        B
      </text>

      {/* ---- Ball bouncing between ---- */}
      <circle r="4" fill="#FFFFFF" opacity="0.9">
        <animateMotion
          path={ballPath}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ---- Category name ---- */}
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#F2A900"
        opacity="0.6"
      >
        {categoryName}
      </text>

      {/* ---- Coming soon label ---- */}
      <text
        x="200"
        y="228"
        textAnchor="middle"
        fontSize="8"
        fill="#FFFFFF"
        opacity="0.3"
      >
        Animation coming soon
      </text>
    </g>
  );
}
