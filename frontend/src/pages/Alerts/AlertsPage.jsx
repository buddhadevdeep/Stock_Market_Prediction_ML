import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Play, Pause, Trash2, PlusCircle, AlertTriangle, Zap, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

const POPULAR_ALERT_STOCKS = [
  'TCS', 'INFY', 'RELIANCE', 'SBIN', 'HDFCBANK', 'ICICIBANK',
  'TATAPOWER', 'CUPID', 'HAL', 'TITAN', 'TATASTEEL', 'WIPRO'
];

const AlertsPage = () => {
  const { alerts, createAlert, toggleAlert, deleteAlert, triggerTestAlert, setCurrentSymbol } = useApp();

  // Create form states
  const [stock, setStock] = useState('TCS');
  const [customStock, setCustomStock] = useState('');
  const [metric, setMetric] = useState('Price');
  const [operator, setOperator] = useState('above');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeSymbol = customStock.trim() ? customStock.trim().toUpperCase() : stock;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!value) {
      setError('Threshold value or condition is required');
      return;
    }
    
    let condition = `${metric} ${operator} `;
    if (metric === 'Price') {
      condition += `₹${value}`;
    } else if (metric === 'Confidence') {
      condition += `${value}%`;
    } else {
      condition += value;
    }

    try {
      await createAlert(activeSymbol, condition);
      setValue('');
      setCustomStock('');
      setSuccessMsg(`Alert successfully configured for ${activeSymbol}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create alert rule');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          padding: '20px 24px',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Bell size={22} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Automated Alert Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                Real-time price boundary triggers, ML confidence thresholds, and supervised trading signal alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Live Test Trigger Button */}
        <button
          onClick={() => triggerTestAlert(activeSymbol || 'CUPID')}
          className="btn-primary-custom"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.8rem', 
            padding: '9px 16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: 'var(--warning-yellow)'
          }}
          title="Fire an instant notification alert to test the system"
        >
          <Zap size={15} /> Test Fire Live Notification
        </button>
      </div>

      {/* Main Grid: Create Alert & Active Alerts */}
      <div className="responsive-split-2-1" style={{ alignItems: 'start' }}>
        
        {/* Create Alert Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <PlusCircle size={17} style={{ color: 'var(--accent-purple)' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
              Configure Alert Trigger
            </h4>
          </div>

          {error && <div style={{ color: 'var(--bearish-red)', fontSize: '0.8rem', padding: '8px 12px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>{error}</div>}
          {successMsg && <div style={{ color: 'var(--bullish-green)', fontSize: '0.8rem', padding: '8px 12px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '6px' }}>{successMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Quick Stock Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Stock Ticker</label>
              <select className="custom-input" value={stock} onChange={(e) => { setStock(e.target.value); setCustomStock(''); }}>
                {POPULAR_ALERT_STOCKS.map(sym => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
            </div>

            {/* Custom Ticker Override */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or Custom Stock Ticker</label>
              <input 
                type="text" 
                className="custom-input" 
                placeholder="e.g. CUPID, HAL, BEL" 
                value={customStock}
                onChange={(e) => setCustomStock(e.target.value.toUpperCase())}
              />
            </div>

            {/* Metric */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Metric Type</label>
              <select className="custom-input" value={metric} onChange={(e) => setMetric(e.target.value)}>
                <option value="Price">Stock Price Target (₹)</option>
                <option value="Confidence">ML Prediction Confidence (%)</option>
                <option value="Signal">Supervised Trading Signal</option>
              </select>
            </div>

            {/* Operator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Trigger Operator</label>
              <select className="custom-input" value={operator} onChange={(e) => setOperator(e.target.value)}>
                <option value="crosses above">Crosses Above (&gt;=)</option>
                <option value="drops below">Drops Below (&lt;=)</option>
                <option value="equals">Equals (==)</option>
              </select>
            </div>

            {/* Threshold Value */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Target Threshold Value</label>
              <input 
                type="text" 
                required
                className="custom-input" 
                placeholder={metric === 'Price' ? 'e.g. 275' : metric === 'Confidence' ? 'e.g. 70' : 'e.g. BUY'} 
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary-custom"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '6px' }}
            >
              <PlusCircle size={18} /> Activate Alert Rule
            </button>
          </form>
        </div>

        {/* Active Alerts List Table */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
              Active Alert Monitor ({alerts.length})
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-evaluated on live ticks</span>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No active alert rules configured.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Use the form on the left to set custom price or ML signal alerts.</p>
              </div>
            ) : (
              <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr key={alert.id}>
                      <td style={{ fontWeight: '700' }}>
                        <span 
                          onClick={() => setCurrentSymbol(alert.stock)} 
                          style={{ cursor: 'pointer', color: 'var(--accent-purple)', textDecoration: 'underline' }}
                          title="Click to view live stock"
                        >
                          {alert.stock}
                        </span>
                      </td>
                      <td className="mono-font" style={{ color: 'var(--accent-cyan)' }}>{alert.condition}</td>
                      <td>
                        <span 
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: alert.status === 'Active' 
                              ? 'rgba(16, 185, 129, 0.12)' 
                              : alert.status === 'Triggered'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(255,255,255,0.05)',
                            color: alert.status === 'Active' 
                              ? 'var(--bullish-green)' 
                              : alert.status === 'Triggered'
                              ? 'var(--warning-yellow)'
                              : 'var(--text-secondary)',
                            border: `1px solid ${
                              alert.status === 'Active' 
                                ? 'rgba(16, 185, 129, 0.3)' 
                                : alert.status === 'Triggered'
                                ? 'rgba(245, 158, 11, 0.4)'
                                : 'var(--border-color)'
                            }`
                          }}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{alert.created}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: alert.status === 'Active' ? 'var(--warning-yellow)' : 'var(--bullish-green)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title={alert.status === 'Active' ? 'Pause Alert' : 'Resume Alert'}
                          >
                            {alert.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--bearish-red)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete Alert"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AlertsPage;

