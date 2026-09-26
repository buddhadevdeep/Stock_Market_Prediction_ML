import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const ProtectedFeatureGuard = ({ children, featureName = 'This AI Feature' }) => {
  const { user, openAuthModal } = useApp();

  // If user is authenticated, render the real page
  if (user) {
    return <>{children}</>;
  }

  // If in instant demo mode (not logged in), render the interactive page with an unobtrusive demo badge
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Instant Demo Bar (Non-blocking) */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 16px',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '10px',
          fontSize: '0.82rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--warning-amber)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: '800',
            fontSize: '0.72rem'
          }}>
            🔒 DEMO MODE LOCK
          </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
            Interactive preview for <strong>{featureName}</strong>. Sign in to unlock cloud sync, alerts, and custom models.
          </span>
        </div>

        <button
          onClick={() => openAuthModal({ mode: 'login', featureName })}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
          }}
        >
          <UserCheck size={14} /> Unlock Full Access <ArrowRight size={13} />
        </button>
      </div>

      {/* Fully Functional Children Page */}
      {children}
    </div>
  );
};

export default ProtectedFeatureGuard;
