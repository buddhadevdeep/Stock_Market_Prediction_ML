import React from 'react';

const ConfidenceGauge = ({ value = 50, label = 'Risk Rating', statusText = 'Neutral', size = 180 }) => {
  // Ensure percentage value is strictly between 0 and 100
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  
  // Dimensions & Geometry
  const radius = size * 0.42;
  const strokeWidth = Math.max(8, size * 0.08);
  const cx = size / 2;
  const cy = size * 0.48; // Pivot center
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  // Needle angle: -90deg is 0% (Left), 0deg is 50% (Top), +90deg is 100% (Right)
  const needleAngle = -90 + (pct / 100) * 180;
  const needleLength = radius - strokeWidth - 2;

  // Dynamic Status Color
  let statusColor = 'var(--accent-purple)';
  let statusBg = 'rgba(99, 102, 241, 0.12)';
  let statusBorder = 'rgba(99, 102, 241, 0.3)';

  const lowerText = (statusText || '').toLowerCase();
  if (
    lowerText.includes('bull') || 
    lowerText.includes('optimal') || 
    lowerText.includes('institutional') || 
    lowerText.includes('excellent') || 
    lowerText.includes('high') && !lowerText.includes('risk')
  ) {
    statusColor = 'var(--bullish-green)';
    statusBg = 'rgba(16, 185, 129, 0.12)';
    statusBorder = 'rgba(16, 185, 129, 0.3)';
  } else if (
    lowerText.includes('bear') || 
    lowerText.includes('single') || 
    lowerText.includes('risk') || 
    lowerText.includes('empty') || 
    lowerText.includes('low') || 
    lowerText.includes('danger')
  ) {
    if (pct < 50) {
      statusColor = 'var(--bearish-red)';
      statusBg = 'rgba(239, 68, 68, 0.12)';
      statusBorder = 'rgba(239, 68, 68, 0.3)';
    } else {
      statusColor = 'var(--warning-yellow)';
      statusBg = 'rgba(245, 158, 11, 0.12)';
      statusBorder = 'rgba(245, 158, 11, 0.3)';
    }
  } else if (lowerText.includes('moderate') || lowerText.includes('balance') || lowerText.includes('good')) {
    statusColor = 'var(--accent-purple)';
    statusBg = 'rgba(99, 102, 241, 0.12)';
    statusBorder = 'rgba(99, 102, 241, 0.3)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', userSelect: 'none', width: '100%' }}>
      <svg 
        width={size} 
        height={cy + 24} 
        viewBox={`0 0 ${size} ${cy + 24}`}
        style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
      >
        <defs>
          <linearGradient id="gaugeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>

        {/* Gray Background Semicircle Track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="var(--bg-chip)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Colored Value Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeArcGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />

        {/* 0% & 100% Boundary Markers */}
        <text 
          x={cx - radius} 
          y={cy + 16} 
          textAnchor="middle" 
          fill="var(--text-muted)" 
          fontSize="10" 
          fontWeight="700" 
          fontFamily="var(--font-mono)"
        >
          0%
        </text>
        <text 
          x={cx + radius} 
          y={cy + 16} 
          textAnchor="middle" 
          fill="var(--text-muted)" 
          fontSize="10" 
          fontWeight="700" 
          fontFamily="var(--font-mono)"
        >
          100%
        </text>

        {/* Precision Dial Needle & Pin (Starts pointing UP, rotated by needleAngle) */}
        <g 
          transform={`translate(${cx}, ${cy}) rotate(${needleAngle})`}
          style={{ 
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: '0 0'
          }}
          filter="url(#needleGlow)"
        >
          {/* Tapered Needle Body */}
          <polygon
            points={`-2.5,0 2.5,0 0.8,-${needleLength} -0.8,-${needleLength}`}
            fill="var(--text-primary)"
          />

          {/* Needle Pin Tip Indicator */}
          <circle 
            cx="0" 
            cy={-needleLength} 
            r="3.5" 
            fill={statusColor} 
            stroke="var(--bg-card)" 
            strokeWidth="1.5" 
          />

          {/* Center Hub Outer Ring */}
          <circle 
            cx="0" 
            cy="0" 
            r="6.5" 
            fill="var(--bg-secondary)" 
            stroke="var(--text-primary)" 
            strokeWidth="2.5" 
          />

          {/* Center Hub Inner Core */}
          <circle 
            cx="0" 
            cy="0" 
            r="2.5" 
            fill={statusColor} 
          />
        </g>
      </svg>
      
      {/* Metric Labeling Section - Positioned Cleanly Below with No Overlap */}
      <div style={{ textAlign: 'center', marginTop: '4px', zIndex: 2 }}>
        <div style={{ 
          fontSize: size < 160 ? '1.55rem' : '1.85rem', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.1
        }}>
          {pct}%
        </div>

        <div style={{ 
          display: 'inline-block',
          fontSize: '0.74rem', 
          fontWeight: '800', 
          color: statusColor,
          backgroundColor: statusBg,
          border: `1px solid ${statusBorder}`,
          borderRadius: '6px',
          padding: '2px 8px',
          textTransform: 'uppercase', 
          marginTop: '6px',
          letterSpacing: '0.5px'
        }}>
          {statusText}
        </div>

        {label && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceGauge;
