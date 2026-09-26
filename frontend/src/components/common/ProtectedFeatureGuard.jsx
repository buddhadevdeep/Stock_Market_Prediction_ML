import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  ArrowRight, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const ProtectedFeatureGuard = ({ children, featureName = 'This AI Feature' }) => {
  const { user, openAuthModal } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Automatically trigger the Auth Modal when an unauthenticated user enters this protected route
  useEffect(() => {
    if (!user) {
      openAuthModal({
        mode: 'login',
        featureName,
        returnPath: location.pathname
      });
    }
  }, [user, featureName, location.pathname, openAuthModal]);

  // If user is authenticated, render the real page
  if (user) {
    return <>{children}</>;
  }

  // If in demo mode (not logged in), block the route and display a locked terminal screen
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--navbar-height) - 120px)',
        padding: '24px 16px',
        width: '100%',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(245, 158, 11, 0.08)',
          overflow: 'hidden',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Warning Strip */}
        <div 
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Lock size={15} style={{ color: 'var(--warning-amber)' }} />
          <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--warning-amber)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            Instant Demo • Authentication Required
          </span>
        </div>

        {/* Card Body */}
        <div style={{ padding: '32px 28px 24px' }}>
          
          {/* Animated Glowing Lock Icon */}
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              color: 'var(--warning-amber)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Lock size={30} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {featureName} is Locked
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 22px 0' }}>
            This institutional AI engine is locked in <strong>Instant Demo Mode</strong>. Sign in or create a free account to unlock real-time neural forecasts, sentiment radars, and multi-stock comparisons.
          </p>

          {/* Included Features List */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '24px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--bullish-green)' }} />
              LSTM & XGBoost Forecasts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--bullish-green)' }} />
              Bull vs Bear Radar
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--bullish-green)' }} />
              Multi-Stock Risk Matrix
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--bullish-green)' }} />
              14+ Technical Indicators
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => openAuthModal({ mode: 'login', featureName, returnPath: location.pathname })}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={17} /> Sign In / Create Free Account <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={15} /> Return to Dashboard
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProtectedFeatureGuard;
