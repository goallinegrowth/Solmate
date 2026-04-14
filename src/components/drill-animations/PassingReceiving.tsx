// ============================================
// Passing & Receiving — Triangle passing pattern
// ============================================
// 3 gold player dots in a triangle formation.
// A white ball orbits continuously between them.
// Each player pulses when the ball arrives.

import React from "react";

export default function PassingReceiving() {
  // Triangle vertices (positioned in center-field area)
  const players = [
    { cx: 140, cy: 180 }, // bottom-left
    { cx: 260, cy: 180 }, // bottom-right
    { cx: 200, cy: 100 }, // top-center
  ];

  // Ball path: triangle loop
  const ballPath = `M ${players[0].cx} ${players[0].cy} 
                    L ${players[1].cx} ${players[1].cy} 
                    L ${players[2].cx} ${players[2].cy} 
                    Z`;

  return (
    <g>
      {/* ---- Dashed passing lanes ---- */}
      <polygon
        points={players.map((p) => `${p.cx},${p.cy}`).join(" ")}
        fill="none"
        stroke="#F2A900"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.3"
      />

      {/* ---- Player dots ---- */}
      {players.map((p, i) => (
        <g key={i}>
          {/* Glow ring */}
          <circle cx={p.cx} cy={p.cy} r="12" fill="#F2A900" opacity="0.1">
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur="3s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Player body */}
          <circle cx={p.cx} cy={p.cy} r="8" fill="#F2A900" opacity="0.9">
            <animate
              attributeName="r"
              values="8;10;8"
              dur="3s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Jersey number */}
          <text
            x={p.cx}
            y={p.cy + 3.5}
            textAnchor="middle"
            fontSize="8"
            fontWeight="bold"
            fill="#0B2545"
          >
            {i + 1}
          </text>
        </g>
      ))}

      {/* ---- Ball moving along triangle ---- */}
      <circle r="4" fill="#FFFFFF" opacity="0.95">
        <animateMotion
          path={ballPath}
          dur="3s"
          repeatCount="indefinite"
          rotate="auto"
        />
      </circle>

      {/* ---- Ball trail (shadow) ---- */}
      <circle r="4" fill="#FFFFFF" opacity="0.3">
        <animateMotion
          path={ballPath}
          dur="3s"
          begin="0.1s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}
