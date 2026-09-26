import React from 'react';

const ConfidenceGauge = ({ value = 50, label = 'Confidence', statusText = 'Neutral', size = 180 }) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const cx = size / 2;
  const cy = size / 2 + 15;
  const circumference = Math.PI * radius; // Semi-circle length

  // Percentage mapped to 0 to 180 degrees
  const pct = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const rotationAngle = -180 + (pct / 100) * 180;

  // Colors based on status
  let color = 'var(--accent-purple)';
  let glow = 'var(--accent-purple-glow)';
  
  if (statusText.toLowerCase().includes('bull') || statusText.toLowerCase().includes('greed') || statusText.toLowerCase().includes('high')) {
    color = 'var(--bullish-green)';
    glow = 'var(--bullish-green-glow)';
  } else if (statusText.toLowerCase().includes('bear') || statusText.toLowerCase().includes('fear') || statusText.toLowerCase().includes('low')) {
    color = 'var(--bearish-red)';
    glow = 'var(--bearish-red-glow)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size / 2 + 35} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--bearish-red)" />
            <stop offset="50%" stopColor="var(--warning-yellow)" />
            <stop offset="100%" stopColor="var(--bullish-green)" />
          </linearGradient>
          <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={color} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Gray Background Arch */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground Colored Arch */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transition="stroke-dashoffset 0.8s ease-in-out"
        />

        {/* Dial Needle */}
        <g transform={`translate(${cx}, ${cy}) rotate(${rotationAngle})`}>
          <line
            x1="0"
            y1="0"
            x2={-(radius - strokeWidth)}
            y2="0"
            stroke="var(--text-primary)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="6" fill="var(--text-primary)" stroke="var(--bg-secondary)" strokeWidth="2" />
        </g>
      </svg>
      
      <div style={{ textAlign: 'center', marginTop: '-15px', zIndex: 10 }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          {value}%
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: color, textTransform: 'uppercase', marginTop: '2px' }}>
          {statusText}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
