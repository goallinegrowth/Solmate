// ============================================
// Small-Sided Games — 4v4 diamond pattern
// ============================================
// 4 gold dots (team A) + 4 white dots (team B)
// arranged in diamond formations. All dots drift
// in small orbits. Ball circulates between gold team.

import React from "react";

export default function SmallSidedGames() {
  // Team A (gold) - diamond formation
  const teamA = [
    { cx: 160, cy: 100, num: "7", orbit: "M 0 0 C 5 -8, 10 -5, 8 3 C 6 10, -4 8, -6 2 C -8 -4, -5 -8, 0 0" },
    { cx: 240, cy: 100, num: "11", orbit: "M 0 0 C -5 -6, -10 -3, -8 5 C -6 12, 4 10, 6 2 C 8 -4, 5 -6, 0 0" },
    { cx: 200, cy: 160, num: "9", orbit: "M 0 0 C 8 -5, 10 3, 5 8 C 0 13, -8 8, -6 0 C -3 -8, 3 -8, 0 0" },
    { cx: 200, cy: 70, num: "10", orbit: "M 0 0 C -6 -5, -3 -10, 5 -8 C 12 -6, 10 4, 2 6 C -4 8, -6 5, 0 0" },
  ];

  // Team B (white/light) - diamond formation, offset
  const teamB = [
    { cx: 170, cy: 130, num: "3", orbit: "M 0 0 C -4 -6, -8 -3, -6 4 C -4 10, 4 8, 5 2 C 6 -4, 4 -6, 0 0" },
    { cx: 230, cy: 130, num: "4", orbit: "M 0 0 C 4 6, 8 3, 6 -4 C 4 -10, -4 -8, -5 -2 C -6 4, -4 6, 0 0" },
    { cx: 200, cy: 200, num: "6", orbit: "M 0 0 C 6 5, 3 10, -5 8 C -12 6, -10 -4, -2 -6 C 4 -8, 6 -5, 0 0" },
    { cx: 200, cy: 60, num: "1", orbit: "M 0 0 C 5 5, 8 -2, 4 -7 C 0 -12, -6 -6, -5 0 C -4 6, -2 8, 0 0" },
  ];

  // Ball circulation path through team A
  const ballPath = `M ${teamA[3].cx} ${teamA[3].cy} 
    L ${teamA[0].cx} ${teamA[0].cy} 
    L ${teamA[2].cx} ${teamA[2].cy} 
    L ${teamA[1].cx} ${teamA[1].cy} 
    Z`;

  return (
    <g>
      {/* ---- Playing area boundary ---- */}
      <rect
        x="130"
        y="45"
        width="140"
        height="175"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.15"
        rx="2"
      />

      {/* ---- Team A (gold dots) ---- */}
      {teamA.map((p, i) => (
        <g key={`a-${i}`}>
          <circle r="7" fill="#F2A900" opacity="0.85">
            <animateMotion
              path={p.orbit}
              dur={`${5 + i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values={`${p.cx}`}
              dur="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="cy"
              values={`${p.cy}`}
              dur="0.1s"
              fill="freeze"
            />
          </circle>
          <text
            fontSize="6"
            fontWeight="bold"
            fill="#0B2545"
            textAnchor="middle"
            dy="2"
          >
            {p.num}
            <animateMotion
              path={p.orbit}
              dur={`${5 + i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              values={`${p.cx}`}
              dur="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="y"
              values={`${p.cy}`}
              dur="0.1s"
              fill="freeze"
            />
          </text>
        </g>
      ))}

      {/* ---- Team B (white dots) ---- */}
      {teamB.map((p, i) => (
        <g key={`b-${i}`}>
          <circle r="7" fill="#FFFFFF" opacity="0.5">
            <animateMotion
              path={p.orbit}
              dur={`${5.5 + i * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values={`${p.cx}`}
              dur="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="cy"
              values={`${p.cy}`}
              dur="0.1s"
              fill="freeze"
            />
          </circle>
          <text
            fontSize="6"
            fontWeight="bold"
            fill="#333"
            textAnchor="middle"
            dy="2"
          >
            {p.num}
            <animateMotion
              path={p.orbit}
              dur={`${5.5 + i * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              values={`${p.cx}`}
              dur="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="y"
              values={`${p.cy}`}
              dur="0.1s"
              fill="freeze"
            />
          </text>
        </g>
      ))}

      {/* ---- Ball circulating between gold team ---- */}
      <circle r="3.5" fill="#FFFFFF" opacity="0.9">
        <animateMotion
          path={ballPath}
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="3" fill="#FFFFFF" opacity="0.25">
        <animateMotion
          path={ballPath}
          dur="6s"
          begin="0.15s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ---- 4v4 label ---- */}
      <text
        x="200"
        y="240"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#FFFFFF"
        opacity="0.25"
        letterSpacing="2"
      >
        4 v 4
      </text>
    </g>
  );
}
