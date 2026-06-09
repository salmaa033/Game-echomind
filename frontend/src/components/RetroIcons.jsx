import React from "react";

// === RETRO DECORATIVE SVG ICONS ===
// All used as floating background decorations throughout the page.

export const Controller = ({ className = "", color = "#EC4899" }) => (
  <svg className={className} viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round">
      <path
        d="M40 40 C20 40, 10 60, 14 90 C18 120, 40 130, 56 120 L80 100 H120 L144 120 C160 130, 182 120, 186 90 C190 60, 180 40, 160 40 H40 Z"
        fill={color}
      />
      <circle cx="55" cy="78" r="5" fill="#0A0A0A" />
      <circle cx="55" cy="78" r="2.2" fill="#fff" />
      <rect x="40" y="73" width="30" height="10" rx="2" fill="#0A0A0A" />
      <rect x="50" y="63" width="10" height="30" rx="2" fill="#0A0A0A" />
      <circle cx="140" cy="68" r="8" fill="#FFD600" />
      <circle cx="160" cy="80" r="8" fill="#84CC16" />
      <circle cx="150" cy="92" r="6" fill="#fff" />
    </g>
  </svg>
);

export const Joystick = ({ className = "", color = "#84CC16" }) => (
  <svg className={className} viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round">
      <ellipse cx="80" cy="150" rx="60" ry="20" fill="#5B21B6" />
      <rect x="72" y="60" width="16" height="90" fill="#0A0A0A" />
      <circle cx="80" cy="50" r="34" fill={color} />
      <circle cx="80" cy="50" r="18" fill="#fff" />
      <circle cx="80" cy="50" r="8" fill="#EC4899" />
    </g>
  </svg>
);

export const PixelHeart = ({ className = "", color = "#FF1493" }) => (
  <svg className={className} viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
    <g fill={color} stroke="#0A0A0A" strokeWidth="2">
      <rect x="10" y="10" width="10" height="10" />
      <rect x="20" y="10" width="10" height="10" />
      <rect x="50" y="10" width="10" height="10" />
      <rect x="60" y="10" width="10" height="10" />
      <rect x="0" y="20" width="80" height="10" />
      <rect x="10" y="30" width="60" height="10" />
      <rect x="20" y="40" width="40" height="10" />
      <rect x="30" y="50" width="20" height="10" />
    </g>
  </svg>
);

export const Star = ({ className = "", color = "#FFD600" }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon
      points="50,5 61,38 96,38 67,59 78,93 50,72 22,93 33,59 4,38 39,38"
      fill={color}
      stroke="#0A0A0A"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

export const Sparkle = ({ className = "", color = "#5B21B6" }) => (
  <svg className={className} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M30 0 L34 26 L60 30 L34 34 L30 60 L26 34 L0 30 L26 26 Z"
      fill={color}
      stroke="#0A0A0A"
      strokeWidth="3"
    />
  </svg>
);

export const PixelCloud = ({ className = "", color = "#fff" }) => (
  <svg className={className} viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
    <g fill={color} stroke="#0A0A0A" strokeWidth="3">
      <rect x="20" y="30" width="80" height="30" />
      <rect x="30" y="20" width="60" height="10" />
      <rect x="40" y="10" width="40" height="10" />
    </g>
  </svg>
);

export const CassetteTape = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round">
      <rect x="10" y="10" width="180" height="120" rx="14" fill="#06B6D4" />
      <rect x="30" y="40" width="140" height="60" rx="8" fill="#fff" />
      <circle cx="70" cy="70" r="18" fill="#0A0A0A" />
      <circle cx="70" cy="70" r="6" fill="#fff" />
      <circle cx="130" cy="70" r="18" fill="#0A0A0A" />
      <circle cx="130" cy="70" r="6" fill="#fff" />
      <rect x="30" y="108" width="140" height="14" fill="#EC4899" />
    </g>
  </svg>
);

export const Diamond = ({ className = "", color = "#EC4899" }) => (
  <svg className={className} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="40,5 75,40 40,75 5,40" fill={color} stroke="#0A0A0A" strokeWidth="5" />
    <polygon points="40,15 65,40 40,65 15,40" fill="#fff" opacity="0.4" stroke="none" />
  </svg>
);

export const Coin = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="40" cy="40" r="34" fill="#FFD600" stroke="#0A0A0A" strokeWidth="5" />
    <circle cx="40" cy="40" r="24" fill="none" stroke="#0A0A0A" strokeWidth="4" />
    <text x="40" y="52" textAnchor="middle" fontFamily="Bowlby One" fontSize="32" fill="#0A0A0A">$</text>
  </svg>
);

export const Lightning = ({ className = "", color = "#FFD600" }) => (
  <svg className={className} viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon
      points="35,0 5,55 25,55 18,100 55,40 35,40 45,0"
      fill={color}
      stroke="#0A0A0A"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

export const PixelGhost = ({ className = "", color = "#5B21B6" }) => (
  <svg className={className} viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
    <g fill={color} stroke="#0A0A0A" strokeWidth="3">
      <rect x="20" y="10" width="40" height="10" />
      <rect x="10" y="20" width="60" height="10" />
      <rect x="5" y="30" width="70" height="40" />
      <rect x="5" y="70" width="10" height="10" />
      <rect x="25" y="70" width="10" height="10" />
      <rect x="45" y="70" width="10" height="10" />
      <rect x="65" y="70" width="10" height="10" />
    </g>
    <rect x="25" y="35" width="10" height="14" fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="45" y="35" width="10" height="14" fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="28" y="40" width="4" height="6" fill="#0A0A0A" />
    <rect x="48" y="40" width="4" height="6" fill="#0A0A0A" />
  </svg>
);
