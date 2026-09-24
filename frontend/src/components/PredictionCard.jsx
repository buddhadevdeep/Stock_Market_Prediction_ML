import React from 'react';
import { Target, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export const PredictionCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card" style={{ borderTop: '3px solid #3b82f6' }}>
      <div className="card-header">
        <span>Tomorrow's Expected Band</span>
        <Target size={18} color="#3b82f6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} color="var(--success-color)" /> Predicted High
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--success-color)', fontFamily: 'var(--font-mono)' }}>
            ₹{data.predictedHigh?.toFixed(2)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingDown size={14} color="var(--danger-color)" /> Predicted Low
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--danger-color)', fontFamily: 'var(--font-mono)' }}>
            ₹{data.predictedLow?.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Layers size={14} /> Expected Range:
        </span>
        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
          ₹{data.predictedRange?.toFixed(2)}
        </strong>
      </div>
    </div>
  );
};
