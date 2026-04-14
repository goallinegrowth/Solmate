// ============================================
// SoccerField — Reusable SVG half-pitch
// ============================================
// Renders a half-field with white line markings.
// Animation components render their elements as children
// inside this SVG viewBox.

import React from "react";

interface SoccerFieldProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}

export default function SoccerField({
  children,
  width = 400,
  height = 300,
}: SoccerFieldProps) {
  const lineColor = "#FFFFFF";
  const lineOpacity = 0.35;
  const lineWidth = 1.5;

  return (
    <svg
      viewBox="0 0 400 300"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg overflow-hidden"
      style={{ background: "#1A4D2E" }}
    >
      {/* ---- Field outline ---- */}
      <rect
        x="10"
        y="10"
        width="380"
        height="280"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
        rx="1"
      />

      {/* ---- Halfway line ---- */}
      <line
        x1="10"
        y1="150"
        x2="390"
        y2="150"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Center circle ---- */}
      <circle
        cx="200"
        cy="150"
        r="40"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Center spot ---- */}
      <circle
        cx="200"
        cy="150"
        r="2.5"
        fill={lineColor}
        opacity={lineOpacity}
      />

      {/* ---- Penalty area (top) ---- */}
      <rect
        x="115"
        y="10"
        width="170"
        height="65"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Goal area (top) ---- */}
      <rect
        x="155"
        y="10"
        width="90"
        height="30"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Goal (top) ---- */}
      <rect
        x="175"
        y="2"
        width="50"
        height="8"
        fill="none"
        stroke={lineColor}
        strokeWidth={2}
        opacity={0.7}
        rx="1"
      />

      {/* ---- Penalty spot (top) ---- */}
      <circle
        cx="200"
        cy="55"
        r="2"
        fill={lineColor}
        opacity={lineOpacity}
      />

      {/* ---- Penalty arc (top) ---- */}
      <path
        d="M 155 75 A 35 35 0 0 0 245 75"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Corner arcs (top) ---- */}
      <path
        d="M 10 18 A 8 8 0 0 0 18 10"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />
      <path
        d="M 382 10 A 8 8 0 0 0 390 18"
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        opacity={lineOpacity}
      />

      {/* ---- Subtle field stripes ---- */}
      {[50, 90, 130, 170, 210, 250].map((y) => (
        <rect
          key={y}
          x="10"
          y={y}
          width="380"
          height="20"
          fill="#FFFFFF"
          opacity={0.02}
        />
      ))}

      {/* ---- Animation content rendered here ---- */}
      {children}
    </svg>
  );
}
