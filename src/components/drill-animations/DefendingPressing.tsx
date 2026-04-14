// ============================================
// Defending & Pressing — Two defenders collapse on attacker
// ============================================
// 1 gray attacker dot in the center.
// 2 gold defender dots start wide and press inward.
// Attacker shrinks under pressure.

import React from "react";

export default function DefendingPressing() {
  return (
    <g>
      {/* ---- Pressing zone indicator ---- */}
      <ellipse cx="200" cy="140" rx="80" ry="50" fill="#F2A900" opacity="0">
        <animate
          attributeName="opacity"
          values="0;0.08;0;0"
          keyTimes="0;0.5;0.8;1"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          values="80;30;80"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="50;20;50"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* ---- Pressing arrows (left) ---- */}
      <path
        d="M 130 140 L 175 140"
        fill="none"
        stroke="#F2A900"
        strokeWidth="1.5"
        opacity="0"
        markerEnd="url(#arrowHead)"
      >
        <animate
          attributeName="opacity"
          values="0;0.4;0;0"
          keyTimes="0;0.4;0.7;1"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* ---- Pressing arrows (right) ---- */}
      <path
        d="M 270 140 L 225 140"
        fill="none"
        stroke="#F2A900"
        strokeWidth="1.5"
        opacity="0"
        markerEnd="url(#arrowHead)"
      >
        <animate
          attributeName="opacity"
          values="0;0.4;0;0"
          keyTimes="0;0.4;0.7;1"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* ---- Arrow marker definition ---- */}
      <defs>
        <marker
          id="arrowHead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#F2A900" opacity="0.5" />
        </marker>
      </defs>

      {/* ---- Attacker (gray dot) ---- */}
      <g>
        <circle cx="200" cy="140" r="8" fill="#9CA3AF" opacity="0.8">
          <animate
            attributeName="r"
            values="8;8;6;6;8"
            keyTimes="0;0.4;0.65;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.8;0.5;0.5;0.8"
            keyTimes="0;0.4;0.65;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="200"
          y="143.5"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill="#FFF"
          opacity="0.8"
        >
          10
        </text>
        {/* Ball at attacker's feet */}
        <circle cx="207" cy="146" r="3" fill="#FFFFFF" opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.7;0.7;0.3;0.3;0.7"
            keyTimes="0;0.4;0.65;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* ---- Left defender (gold) ---- */}
      <g>
        <circle cy="140" r="8" fill="#F2A900" opacity="0.9">
          <animate
            attributeName="cx"
            values="120;120;180;180;120"
            keyTimes="0;0.1;0.6;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          y="143.5"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill="#0B2545"
        >
          4
          <animate
            attributeName="x"
            values="120;120;180;180;120"
            keyTimes="0;0.1;0.6;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </text>
      </g>

      {/* ---- Right defender (gold) ---- */}
      <g>
        <circle cy="140" r="8" fill="#F2A900" opacity="0.9">
          <animate
            attributeName="cx"
            values="280;280;220;220;280"
            keyTimes="0;0.1;0.6;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          y="143.5"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill="#0B2545"
        >
          5
          <animate
            attributeName="x"
            values="280;280;220;220;280"
            keyTimes="0;0.1;0.6;0.8;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </text>
      </g>

      {/* ---- "PRESS" label ---- */}
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="#F2A900"
        opacity="0"
        letterSpacing="3"
      >
        PRESS
        <animate
          attributeName="opacity"
          values="0;0;0.6;0;0"
          keyTimes="0;0.5;0.65;0.8;1"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </text>
    </g>
  );
}
