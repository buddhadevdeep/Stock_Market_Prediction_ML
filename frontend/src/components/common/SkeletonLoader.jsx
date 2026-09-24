import React, { useEffect } from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div 
            className="glass-card" 
            style={{ 
              height: '140px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="skeleton-pulse" style={{ height: '14px', width: '40%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
            <div className="skeleton-pulse" style={{ height: '36px', width: '70%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}></div>
            <div className="skeleton-pulse" style={{ height: '12px', width: '50%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton-pulse" style={{ height: '18px', width: '30%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ height: '18px', width: '15%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
            </div>
            <div className="skeleton-pulse" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
              {/* Vertical grids simulation */}
              <div style={{ display: 'flex', justifyContent: 'space-around', height: '100%', alignItems: 'flex-end', padding: '10px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="skeleton-pulse" style={{ width: '8%', height: `${20 + Math.random() * 60}%`, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px 4px 0 0' }}></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="skeleton-pulse" style={{ height: '20px', width: '20%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '20px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div className="skeleton-pulse" style={{ height: '16px', width: '25%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                  <div className="skeleton-pulse" style={{ height: '16px', width: '15%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                  <div className="skeleton-pulse" style={{ height: '16px', width: '15%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add styles to document head if not loaded
  useEffect(() => {
    const styleId = 'skeleton-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes pulseGlow {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: pulseGlow 1.5s infinite ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
