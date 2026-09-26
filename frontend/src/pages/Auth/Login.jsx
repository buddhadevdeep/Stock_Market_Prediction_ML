import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, Mail, Lock, AlertCircle, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('arjun@stockai.com');
    setPassword('demo123');
    setLoading(true);
    try {
      await login('arjun@stockai.com', 'demo123', true);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient background glow */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(120px)', top: '15%', left: '20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(100px)', bottom: '15%', right: '20%', pointerEvents: 'none' }} />

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px', position: 'relative', zIndex: 10, backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        {/* Brand header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Cpu size={32} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '0.5px' }}>
              Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
            </span>
          </div>
          <h3 style={{ fontWeight: '800', fontSize: '1.35rem', color: 'var(--text-primary)' }}>Welcome Back</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Sign in to access AI prediction terminal</p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.12)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--bearish-red)',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                required
                className="custom-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '44px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                required
                className="custom-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '44px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)', width: '16px', height: '16px' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
              Remember this device
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-primary-custom"
            disabled={loading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              padding: '12px',
              marginTop: '6px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            {loading ? 'Authenticating...' : (
              <>
                Login to Terminal <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick 1-Click Demo Login */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: 'var(--accent-purple)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={15} /> Instant Demo Sign-In (1-Click)
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '700' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
