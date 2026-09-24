import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const { register } = useApp(); // Can use generic endpoint
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess('Reset link dispatched! Please check your inbox.');
    } catch (err) {
      setError('Failed to process request. Please try again.');
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
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Cpu size={32} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontWeight: '800', fontSize: '1.5rem' }}>
              Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
            </span>
          </div>
          <h3 style={{ fontWeight: '700', fontSize: '1.25rem' }}>Reset Password</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
            Enter your email to receive recovery parameters.
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
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

        {success && (
          <div 
            style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--bullish-green)',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                required
                className="custom-input"
                placeholder="enter email (e.g. arjun@stockai.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
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
              marginTop: '10px'
            }}
          >
            {loading ? 'Sending Request...' : 'Send Recovery Parameters'}
          </button>
        </form>

        <Link 
          to="/login" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            marginTop: '30px', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
