import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Cpu,
  Mail,
  User,
  AlertTriangle,
  ArrowRight,
  X,
  Zap,
  TrendingUp,
  Activity,
  BarChart2,
  Columns,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const AuthRequiredModal = () => {
  const { authModal, closeAuthModal, login, register } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModal?.isOpen) return null;

  const featureName = authModal.featureName || 'Institutional ML Intelligence';
  const returnPath = authModal.returnPath || null;

  const getFeatureIcon = () => {
    const fn = featureName.toLowerCase();
    if (fn.includes('predict')) return <TrendingUp size={20} className="text-bullish" />;
    if (fn.includes('bull')) return <Activity size={20} style={{ color: 'var(--accent-purple)' }} />;
    if (fn.includes('analy')) return <BarChart2 size={20} style={{ color: 'var(--accent-cyan)' }} />;
    if (fn.includes('compare')) return <Columns size={20} style={{ color: 'var(--warning-amber)' }} />;
    return <Lock size={20} style={{ color: 'var(--warning-amber)' }} />;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password, true);
      } else {
        await register(name, email, password);
        await login(email, password, true);
      }

      closeAuthModal();
      if (returnPath) {
        navigate(returnPath);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    closeAuthModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '18px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Top Warning Ribbon */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning-amber)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--warning-amber)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Instant Demo Mode • Sign In Required
            </span>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '22px 24px 18px', overflowY: 'auto', flex: 1 }}>
          
          {/* Header Badge & Title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(245, 158, 11, 0.15))',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {getFeatureIcon()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.22rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Sign In to Unlock {featureName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: '1.45' }}>
                You are currently exploring in <strong>Instant Demo Mode</strong>. Real-time machine learning predictions, bull vs bear sentiment radars, and multi-asset comparisons require an authenticated session.
              </p>
            </div>
          </div>

          {/* Feature Highlight Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              backgroundColor: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--bullish-green)' }} />
              LSTM & XGBoost Regressors
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--bullish-green)' }} />
              Bull vs Bear Sentiment Index
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--bullish-green)' }} />
              Multi-Stock Risk Matrix
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--bullish-green)' }} />
              Live Cloud Price Alerts
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-input)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}
          >
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'login' ? 'var(--accent-purple)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'register' ? 'var(--accent-purple)' : 'transparent',
                color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Free Account
            </button>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--bearish-red)',
                fontSize: '0.8rem',
                marginBottom: '14px'
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Trader"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '11px',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In & Access Feature' : 'Create Free Account & Access'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Demo mode does not write or save data to the cloud database.
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Continue in Demo Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthRequiredModal;
