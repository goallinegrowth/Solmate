// ============================================
// Dribbling & Ball Control — Slalom through cones
// ============================================
// A gold player dot weaves through a line of orange cones
// in a sinusoidal path.

import React from "react";

export default function DribblingBallControl() {
  // Cone positions (vertical line, evenly spaced)
  const cones = [
    { x: 200, y: 80 },
    { x: 200, y: 120 },
    { x: 200, y: 160 },
    { x: 200, y: 200 },
    { x: 200, y: 240 },
  ];

  // Sinusoidal weave path through cones
  const weave = `M 200 270 
    C 200 260, 160 250, 160 240 
    C 160 230, 240 220, 240 200 
    C 240 180, 160 170, 160 160 
    C 160 150, 240 140, 240 120 
    C 240 100, 160 90, 160 80 
    C 160 70, 200 60, 200 50`;

  return (
    <g>
      {/* ---- Dashed guide path ---- */}
      <path
        d={weave}
        fill="none"
        stroke="#F2A900"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.15"
      />

      {/* ---- Cones ---- */}
      {cones.map((cone, i) => (
        <g key={i}>
          {/* Cone shadow */}
          <ellipse
            cx={cone.x}
            cy={cone.y + 6}
            rx="7"
            ry="2"
            fill="#000"
            opacity="0.2"
          />
          {/* Cone body (triangle) */}
          <polygon
            points={`${cone.x},${cone.y - 8} ${cone.x - 6},${cone.y + 5} ${cone.x + 6},${cone.y + 5}`}
            fill="#FF6B35"
            opacity="0.85"
          />
          {/* Cone stripe */}
          <line
            x1={cone.x - 3}
            y1={cone.y}
            x2={cone.x + 3}
            y2={cone.y}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </g>
      ))}

      {/* ---- Player dot (weaving) ---- */}
      <g>
        <circle r="7" fill="#F2A900" opacity="0.9">
          <animateMotion
            path={weave}
            dur="4s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
        {/* Player number */}
        <text
          fontSize="7"
          fontWeight="bold"
          fill="#0B2545"
          textAnchor="middle"
          dy="2.5"
        >
          7
          <animateMotion
            path={weave}
            dur="4s"
            repeatCount="indefinite"
          />
        </text>
      </g>

      {/* ---- Trail effect ---- */}
      <circle r="6" fill="#F2A900" opacity="0.15">
        <animateMotion
          path={weave}
          dur="4s"
          begin="0.15s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="5" fill="#F2A900" opacity="0.08">
        <animateMotion
          path={weave}
          dur="4s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}
