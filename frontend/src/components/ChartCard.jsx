import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const ChartCard = ({ chartData = [], symbol = 'Stock' }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-card">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No chart data available.
        </div>
      </div>
    );
  }

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontWeight: '700', color: '#f3f4f6', marginBottom: '0.4rem' }}>{label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, margin: '2px 0' }}>
              {entry.name}: ₹{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-title">
        <span>{symbol} Price & Technical Moving Averages (Last 120 Sessions)</span>
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickFormatter={(str) => str.slice(5)} />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />

            <Line
              type="monotone"
              dataKey="close"
              name="Close Price"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sma5"
              name="SMA 5"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sma20"
              name="SMA 20"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sma50"
              name="SMA 50"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Sub-Chart */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Daily Volume
        </div>
        <div style={{ width: '100%', height: 120 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} hide />
              <YAxis
                stroke="#6b7280"
                fontSize={10}
                tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
              />
              <Tooltip />
              <Bar dataKey="volume" name="Volume" fill="#475569" radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
