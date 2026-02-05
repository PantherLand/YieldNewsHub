import React from 'react';

// Custom Logo SVG - Cyberpunk Yield Butterfly
export function LogoIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Main cyberpunk gradient */}
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        {/* Pink accent gradient */}
        <linearGradient id="pinkGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        {/* Cyan wing */}
        <linearGradient id="cyanWing" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        {/* Neon green chart */}
        <linearGradient id="neonChart" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FF88" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Strong glow */}
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#cyberGrad)" />

      {/* Inner dark circle */}
      <circle cx="24" cy="24" r="20" fill="#0D0A1A" opacity="0.6" />

      {/* Left wing */}
      <path
        d="M24 24 C18 17, 6 15, 5 24 C4 33, 16 35, 24 24"
        fill="url(#pinkGrad)"
        opacity="0.9"
        filter="url(#glow)"
      />

      {/* Right wing */}
      <path
        d="M24 24 C30 17, 42 15, 43 24 C44 33, 32 35, 24 24"
        fill="url(#cyanWing)"
        opacity="0.9"
        filter="url(#glow)"
      />

      {/* Body */}
      <ellipse cx="24" cy="24" rx="2" ry="7" fill="#F8FAFC" opacity="0.95" />

      {/* Yield chart line */}
      <path
        d="M10 34 L15 30 L21 32 L27 25 L33 21 L38 13"
        stroke="url(#neonChart)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#strongGlow)"
      />

      {/* Chart end point */}
      <circle cx="38" cy="13" r="3" fill="#00FF88" filter="url(#glow)" />
      <circle cx="38" cy="13" r="1.5" fill="#F8FAFC" />

      {/* Outer ring */}
      <circle cx="24" cy="24" r="22.5" stroke="url(#cyberGrad)" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

export default LogoIcon;
