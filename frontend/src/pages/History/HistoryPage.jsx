import React, { useState, useEffect } from 'react';
import { predictionApi } from '../../api/predictionApi';
import MetricCard from '../../components/common/MetricCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, Database, TrendingUp, History } from 'lucide-react';

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const hist = await predictionApi.getPredictionHistory();
        setHistoryList(hist);
        
        const perf = await predictionApi.getPerformanceMetrics();
        setPerformance(perf);

        // Map hist elements to charting format: show latest predictions
        const mapped = hist.map(item => ({
          name: `${item.date} (${item.symbol})`,
          Predicted: item.predictedHigh,
          Actual: item.actualHigh
        })).reverse();
        setChartData(mapped);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistoryData();
  }, []);

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Prediction History Console</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Review backtesting results, historical error metrics, and actual vs predicted scores.</p>
      </div>

      {/* Model Integrity KPI Summary Cards */}
      {performance && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <MetricCard title="Overall Accuracy" value={`${performance.correctDirectionPct}%`} subtext="Direction Match" />
          <MetricCard title="Model R² Coeff" value={`${performance.r2}`} subtext="Correlation rating" />
          <MetricCard title="MAE Error" value={`₹${performance.mae}`} subtext="Avg Absolute Deviation" />
          <MetricCard title="RMSE Vol" value={`₹${performance.rmse}`} subtext="Outlier weighting" />
        </div>
      )}

      {/* Actual vs Predicted Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Actual vs Predicted Session High (Recent Predictions)
        </h4>
        
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" stroke="var(--chart-axis)" fontSize={9} tick={{ fill: 'var(--chart-axis)' }} />
              <YAxis stroke="var(--chart-axis)" fontSize={10} tick={{ fill: 'var(--chart-axis)' }} domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-dropdown)' }} labelStyle={{ color: 'var(--text-muted)', fontWeight: '700' }} />
              <Legend iconType="circle" wrapperStyle={{ color: 'var(--text-primary)', fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="Predicted" stroke="var(--accent-purple)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Actual" stroke="var(--bullish-green)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Log Table */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Historical Performance Logs</h4>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock</th>
                <th>Predicted High</th>
                <th>Actual High</th>
                <th>Absolute Error</th>
                <th>Direction</th>
                <th>Accuracy Rating</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, idx) => (
                <tr key={idx}>
                  <td className="mono-font">{item.date}</td>
                  <td style={{ fontWeight: '700' }}>{item.symbol}</td>
                  <td className="mono-font">₹{item.predictedHigh.toLocaleString()}</td>
                  <td className="mono-font">₹{item.actualHigh.toLocaleString()}</td>
                  <td className="mono-font text-bearish" style={{ fontWeight: '600' }}>₹{item.error.toFixed(2)}</td>
                  <td>
                    <span className={item.direction === 'Bullish' ? 'badge-bullish' : item.direction === 'Bearish' ? 'badge-bearish' : 'badge-neutral'}>
                      {item.direction}
                    </span>
                  </td>
                  <td className="mono-font text-bullish" style={{ fontWeight: '700' }}>{item.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default HistoryPage;
