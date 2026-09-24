import React from 'react';

const MiniSparkline = ({ data, positive = true }) => {
  if (!data || data.length < 2) return null;

  const width = 80;
  const height = 40;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Map points to SVG coordinates
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = positive ? 'var(--bullish-green)' : 'var(--bearish-red)';
  const glowColor = positive ? 'var(--bullish-green-glow)' : 'var(--bearish-red-glow)';

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={strokeColor} floodOpacity="0.4" />
        </filter>
      </defs>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        filter="url(#glow)"
      />
    </svg>
  );
};

export default MiniSparkline;
