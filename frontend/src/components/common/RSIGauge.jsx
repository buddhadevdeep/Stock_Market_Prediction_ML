import React from 'react';

const RSIGauge = ({ value = 54.2, period = 14 }) => {
  const parsed = parseFloat(value);
  const rsiVal = isNaN(parsed) ? 54.2 : parsed;
  
  let zone = 'Neutral';
  let zoneColor = 'var(--text-secondary)';
  if (rsiVal >= 70) {
    zone = 'Overbought';
    zoneColor = 'var(--bearish-red)';
  } else if (rsiVal <= 30) {
    zone = 'Oversold';
    zoneColor = 'var(--bullish-green)';
  }

  // Calculate percentage offset for pointer safely between 0 and 100
  const pointerPercent = Math.max(0, Math.min(100, rsiVal));

  return (
    <div className="glass-card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            RSI ({period}) Momentum
          </span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0 0', fontFamily: 'var(--font-mono)' }}>
            {rsiVal.toFixed(2)}
          </h4>
        </div>
        <div 
          style={{ 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            fontWeight: '700',
            backgroundColor: zone === 'Neutral' ? 'rgba(255,255,255,0.05)' : zone === 'Overbought' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: zoneColor,
            border: `1px solid ${zone === 'Neutral' ? 'var(--border-color)' : zoneColor}`
          }}
        >
          {zone.toUpperCase()}
        </div>
      </div>

      {/* RSI Track */}
      <div style={{ position: 'relative', height: '10px', margin: '22px 0 10px 0' }}>
        {/* Track Segments */}
        <div style={{ display: 'flex', height: '100%', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'var(--bg-chip)' }}>
          <div style={{ flex: 3, backgroundColor: 'rgba(16, 185, 129, 0.3)', borderRight: '1px solid var(--border-color)' }} title="Oversold Zone (<30)"></div>
          <div style={{ flex: 4, backgroundColor: 'var(--bg-chip)', borderRight: '1px solid var(--border-color)' }} title="Neutral Zone (30-70)"></div>
          <div style={{ flex: 3, backgroundColor: 'rgba(244, 63, 94, 0.3)' }} title="Overbought Zone (>70)"></div>
        </div>

        {/* Zone Markers text */}
        <div style={{ position: 'absolute', left: '30%', height: '14px', top: '-2px', borderLeft: '1.5px dashed var(--text-muted)' }}></div>
        <div style={{ position: 'absolute', left: '70%', height: '14px', top: '-2px', borderLeft: '1.5px dashed var(--text-muted)' }}></div>

        {/* Current Value Indicator Pointer */}
        <div 
          style={{
            position: 'absolute',
            left: `${pointerPercent}%`,
            top: '-7px',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
            transition: 'left 0.5s ease-out'
          }}
        >
          <div 
            style={{
              width: '4px',
              height: '24px',
              backgroundColor: 'var(--text-primary)',
              borderRadius: '2px',
              boxShadow: '0 0 6px rgba(99, 102, 241, 0.6)'
            }}
          ></div>
        </div>
      </div>

      {/* Axis markings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
        <span>0</span>
        <span style={{ marginRight: '8%' }}>30 (Oversold)</span>
        <span style={{ marginLeft: '8%' }}>70 (Overbought)</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default RSIGauge;

