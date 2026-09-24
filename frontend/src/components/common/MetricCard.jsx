import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import MiniSparkline from './MiniSparkline';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  pctChange, 
  subtext, 
  sparklineData,
  status = 'neutral', // 'bullish', 'bearish', 'neutral'
  loading = false 
}) => {
  const isPositive = pctChange >= 0;

  return (
    <div className={`glass-card ${status === 'bullish' ? 'bullish-card' : status === 'bearish' ? 'bearish-card' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '8px 0 4px 0', color: 'var(--text-primary)' }}>
            {value}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {pctChange !== undefined && (
              <span 
                className={isPositive ? 'text-bullish' : 'text-bearish'}
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPositive ? '+' : ''}{pctChange}%
              </span>
            )}
            
            {change !== undefined && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({isPositive ? '+' : ''}{change})
              </span>
            )}

            {subtext && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {subtext}
              </span>
            )}
          </div>
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div style={{ width: '80px', height: '40px', marginTop: '10px' }}>
            <MiniSparkline data={sparklineData} positive={isPositive} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
