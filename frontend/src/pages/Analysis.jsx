import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Loading, ErrorMessage } from '../components/StatusCards';
import api from '../services/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Database, Table, Layers, Activity } from 'lucide-react';

export const Analysis = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('5y');

  const fetchExplorationData = async (targetSymbol, targetPeriod = period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getExploreData(targetSymbol, targetPeriod);
      setSymbol(targetSymbol);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load dataset exploration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorationData('TCS', '5y');
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="sop-tag">Phase 1 &amp; Phase 2 SOP</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          Problem Definition, Dataset Exploration &amp; Preprocessing
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Inspect raw data structures, summary statistics, missing value matrices, and engineered technical features.
        </p>
      </div>

      <SearchBar onSearch={(sym) => fetchExplorationData(sym, period)} initialSymbol={symbol} loading={loading} />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {loading && <Loading message={`Extracting dataset and statistics for ${symbol}...`} />}

      {!loading && data && (
        <>
          {/* Dataset Dimension Overview Cards */}
          <div className="cards-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <span>Dataset Shape</span>
                <Database size={18} color="var(--accent-blue)" />
              </div>
              <div className="card-value">{data.shape?.rows} &times; {data.shape?.columns}</div>
              <div className="card-subtext">Rows (Trading Days) &times; Features</div>
            </div>

            <div className="card">
              <div className="card-header">
                <span>Missing Values Detected</span>
                <Table size={18} color="var(--success-color)" />
              </div>
              <div className="card-value" style={{ color: 'var(--success-color)' }}>
                {Object.values(data.missing_values || {}).reduce((a, b) => a + b, 0)}
              </div>
              <div className="card-subtext">Imputed &amp; Cleaned in Pipeline</div>
            </div>

            <div className="card">
              <div className="card-header">
                <span>Historical Window</span>
                <Layers size={18} color="var(--accent-purple)" />
              </div>
              <div className="card-value">{period.toUpperCase()}</div>
              <div className="card-subtext">Daily OHLCV via Yahoo Finance</div>
            </div>
          </div>

          {/* Descriptive Statistics Table */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="chart-title">
              <span>Descriptive Statistics (Phase 1 Exploratory Data Analysis)</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Count</th>
                    <th>Mean</th>
                    <th>Std Dev</th>
                    <th>Min</th>
                    <th>25%</th>
                    <th>50% (Median)</th>
                    <th>75%</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {data.statistics?.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{s.feature}</td>
                      <td>{s.count}</td>
                      <td>{s.mean}</td>
                      <td>{s.std}</td>
                      <td>{s.min}</td>
                      <td>{s['25%']}</td>
                      <td>{s['50%']}</td>
                      <td>{s['75%']}</td>
                      <td>{s.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Returns & Volatility Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.25rem' }}>
            {/* Daily Return Chart */}
            <div className="chart-card">
              <div className="chart-title">
                <span>Daily Returns (%) - Volatility Regimes</span>
                <Activity size={18} color="var(--info-color)" />
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={data.chart_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                    <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Bar dataKey="dailyReturn" fill="#38bdf8" name="Daily Return %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 20-Day Rolling Volatility */}
            <div className="chart-card">
              <div className="chart-title">
                <span>20-Day Rolling Volatility (%)</span>
                <Activity size={18} color="var(--warning-color)" />
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={data.chart_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                    <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="volatility" stroke="#f59e0b" strokeWidth={2} dot={false} name="Volatility %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
