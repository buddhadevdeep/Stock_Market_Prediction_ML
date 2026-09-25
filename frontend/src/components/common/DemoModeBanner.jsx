import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Lock, LogIn, X } from 'lucide-react';

export const DemoModeBanner = () => {
  const { isDemoMode, openAuthPrompt } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode || dismissed) return null;

  return (
    <div 
      style={{
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#c7d2fe',
        zIndex: 90,
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <Zap size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <strong>Instant Demo Access:</strong> Search stocks & view predictions freely. Advanced actions (Portfolio, Alerts, Custom Models) are locked and not saved.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => openAuthPrompt('Full Access')}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Lock size={11} /> Unlock Full Access
        </button>

        <button
          onClick={() => setDismissed(true)}
          title="Dismiss banner"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
