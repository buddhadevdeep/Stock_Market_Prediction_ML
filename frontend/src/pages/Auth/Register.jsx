import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const Register = () => {
  const { register, login } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await register(fullName, email, password);
      if (res.success) {
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(async () => {
          await login(email, password, true);
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
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

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px', position: 'relative', zIndex: 10, backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              marginBottom: '14px'
            }}
          >
            <Cpu size={32} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '0.5px' }}>
              Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
            </span>
          </div>
          <h3 style={{ fontWeight: '800', fontSize: '1.3rem' }}>Create Account</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Join the StockAI market prediction platform</p>
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
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div 
            style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.12)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--bullish-green)',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                required
                className="custom-input"
                placeholder="Arjun Trader"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Email input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                required
                className="custom-input"
                placeholder="arjun@stockai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                required
                className="custom-input"
                placeholder="Create secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                required
                className="custom-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <input 
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)', width: '16px', height: '16px' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
              I agree to the <span style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>Terms & Conditions</span>
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
              marginTop: '4px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            {loading ? 'Creating Account...' : (
              <>
                Create Free Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '700' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
