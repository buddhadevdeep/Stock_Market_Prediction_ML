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
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '10px',
          fontSize: '0.82rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
            <strong>Instant Demo Mode:</strong> Viewing live AI models and predictions for <strong>{featureName}</strong>.
          </span>
        </div>

        <button
          onClick={() => openAuthModal({ mode: 'login', featureName })}
          style={{
            background: 'var(--accent-purple)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <UserCheck size={14} /> Sign In to Save History <ArrowRight size={13} />
        </button>
      </div>

      {/* Fully Functional Children Page */}
      {children}
    </div>
  );
};

export default ProtectedFeatureGuard;
