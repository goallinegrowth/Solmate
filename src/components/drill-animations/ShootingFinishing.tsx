// ============================================
// Shooting & Finishing — Run into box + shot on goal
// ============================================
// Phase 1: Player runs from midfield into the penalty box.
// Phase 2: Ball fires toward the goal at high speed.
// Phase 3: Flash at goal, reset.

import React from "react";

export default function ShootingFinishing() {
  // Player run path: midfield → edge of box
  const runPath = "M 140 220 C 160 200, 170 160, 185 105";

  // Ball shot path: edge of box → goal
  const shotPath = "M 185 105 L 200 12";

  return (
    <g>
      {/* ---- Run path guide ---- */}
      <path
        d={runPath}
        fill="none"
        stroke="#F2A900"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.15"
      />

      {/* ---- Shot path guide ---- */}
      <path
        d={shotPath}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.15"
      />

      {/* ---- Defender (static, to give context) ---- */}
      <circle cx="220" cy="120" r="7" fill="#9CA3AF" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.5;0.3;0.5"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="220"
        y="123.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#FFF"
        opacity="0.5"
      >
        4
      </text>

      {/* ---- Goalkeeper ---- */}
      <circle cx="200" cy="18" r="6" fill="#9CA3AF" opacity="0.6">
        <animate
          attributeName="cx"
          values="195;205;195"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="200"
        y="21"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#FFF"
        opacity="0.6"
      >
        1
        <animate
          attributeName="x"
          values="195;205;195"
          dur="2s"
          repeatCount="indefinite"
        />
      </text>

      {/* ---- Player (running) ---- */}
      <g>
        <circle r="8" fill="#F2A900" opacity="0.9">
          <animateMotion path={runPath} dur="3.5s" repeatCount="indefinite" />
          <animate
            attributeName="r"
            values="8;8;8;6;6"
            keyTimes="0;0.6;0.65;0.7;1"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          fontSize="7"
          fontWeight="bold"
          fill="#0B2545"
          textAnchor="middle"
          dy="2.5"
        >
          9
          <animateMotion path={runPath} dur="3.5s" repeatCount="indefinite" />
        </text>
      </g>

      {/* ---- Ball (shot — delayed start, fast) ---- */}
      <circle r="4" fill="#FFFFFF">
        <animateMotion
          path={shotPath}
          dur="3.5s"
          keyPoints="0;0;0;0.05;1;1"
          keyTimes="0;0.55;0.6;0.62;0.78;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0;1;1;0.8;0"
          keyTimes="0;0.55;0.6;0.78;0.85;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ---- Ball trail (fast shot) ---- */}
      <circle r="3" fill="#FFFFFF" opacity="0">
        <animateMotion
          path={shotPath}
          dur="3.5s"
          keyPoints="0;0;0;0;1;1"
          keyTimes="0;0.55;0.6;0.65;0.82;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0;0.4;0.2;0;0"
          keyTimes="0;0.6;0.65;0.78;0.85;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ---- Goal flash effect ---- */}
      <circle cx="200" cy="10" r="0" fill="#F2A900" opacity="0">
        <animate
          attributeName="r"
          values="0;0;0;20;0"
          keyTimes="0;0.75;0.78;0.88;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0;0.5;0"
          keyTimes="0;0.78;0.85;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ---- "GOAL!" text flash ---- */}
      <text
        x="200"
        y="55"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#F2A900"
        opacity="0"
      >
        GOAL!
        <animate
          attributeName="opacity"
          values="0;0;1;0"
          keyTimes="0;0.8;0.88;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </text>
    </g>
  );
}
