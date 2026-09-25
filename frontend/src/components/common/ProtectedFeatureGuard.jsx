import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldAlert, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProtectedFeatureGuard = ({ children, featureName = 'This AI Feature' }) => {
  const { user, openAuthModal } = useApp();
  const navigate = useNavigate();

  // If user is authenticated, render the real page
  if (user) {
    return <>{children}</>;
  }

  // If in instant demo mode (not logged in), render a locked interface overlay
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 120px)' }}>
      {/* Blurred background preview of the feature */}
      <div style={{ filter: 'blur(6px)', opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Floating Centered Lock / Sign-In Warning Card */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
          textAlign: 'center',
          zIndex: 50,
          backdropFilter: 'blur(16px)'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(99, 102, 241, 0.2))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--warning-amber)'
          }}
        >
          <Lock size={26} />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--warning-amber)',
            fontSize: '0.72rem',
            fontWeight: '800',
            marginBottom: '12px'
          }}
        >
          <ShieldAlert size={13} />
          INSTANT DEMO RESTRICTION
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Sign In to Access {featureName}
        </h3>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '22px' }}>
          This machine learning analytics module is locked in Instant Demo mode. Create a free account or sign in to run real-time predictions and models.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => openAuthModal({ mode: 'login', featureName })}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
            }}
          >
            <UserCheck size={16} /> Sign In / Create Free Account <ArrowRight size={15} />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'var(--bg-chip)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Return to Demo Dashboard
          </button>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '14px', marginBottom: 0 }}>
          Instant demo does not save data to the cloud database.
        </p>
      </div>
    </div>
  );
};

export default ProtectedFeatureGuard;
