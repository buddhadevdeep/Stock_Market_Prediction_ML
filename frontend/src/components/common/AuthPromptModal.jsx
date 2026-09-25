import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Lock, X, Mail, User, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const AuthPromptModal = () => {
  const { 
    showAuthPromptModal, 
    closeAuthPrompt, 
    authPromptFeature, 
    login, 
    register, 
    isDemoMode 
  } = useApp();
  
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthPromptModal) return null;

  const handleSubmit = async (e) => {
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
      closeAuthPrompt();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthPrompt();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          animation: 'fadeInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close X */}
        <button
          onClick={closeAuthPrompt}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px'
          }}
        >
          <X size={20} />
        </button>

        {/* Lock Icon & Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.15))',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          }}>
            <Lock size={22} style={{ color: 'var(--accent-purple)' }} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {authPromptFeature ? `Unlock ${authPromptFeature}` : 'Sign In to Unlock Full Access'}
          </h3>
          
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            You are exploring in <strong>Instant Demo Mode</strong>. Sign in or register for a free account to save your portfolio, manage alerts, and store custom settings.
          </p>
        </div>

        {/* Feature Benefits List */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '10px', 
          padding: '12px 14px', 
          marginBottom: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <CheckCircle size={14} style={{ color: 'var(--bullish-green)', flexShrink: 0 }} />
            <span>Permanent Portfolio tracking & transactions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <CheckCircle size={14} style={{ color: 'var(--bullish-green)', flexShrink: 0 }} />
            <span>Live Price Alerts with push notifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <CheckCircle size={14} style={{ color: 'var(--bullish-green)', flexShrink: 0 }} />
            <span>Custom ML model evaluations & parameters</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: mode === 'login' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem'
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
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: mode === 'register' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Create Free Account
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.12)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '8px', 
            padding: '8px 12px', 
            color: 'var(--bearish-red)', 
            fontSize: '0.78rem', 
            marginBottom: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  required
                  placeholder="Arjun Trader"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input"
                  style={{ paddingLeft: '34px' }}
                />
                <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
                style={{ paddingLeft: '34px' }}
              />
              <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
                style={{ paddingLeft: '34px' }}
              />
              <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn-primary-custom"
            style={{ width: '100%', padding: '10px', marginTop: '6px', fontSize: '0.88rem' }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Save Data' : 'Create Free Account'}
          </button>
        </form>

        {/* Continue in Demo Mode Dismiss */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <button
            type="button"
            onClick={closeAuthPrompt}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Continue exploring in Demo Mode (data won't save)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
