import React from 'react';

export const AVATAR_PRESETS = [
  { id: 'bull', emoji: '🐂', name: 'Bull Trader', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { id: 'eagle', emoji: '🦅', name: 'Alpha Eagle', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket Momentum', gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
  { id: 'wolf', emoji: '🐺', name: 'Market Wolf', gradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' },
  { id: 'zap', emoji: '⚡', name: 'Cyber Pulse', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { id: 'crown', emoji: '👑', name: 'Sovereign Pro', gradient: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)' },
  { id: 'diamond', emoji: '💎', name: 'Diamond Hands', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
  { id: 'initials', emoji: null, name: 'Smart Monogram', gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)' },
];

export const AVATAR_GRADIENTS = [
  { id: 'indigo', name: 'Indigo Aura', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: '#818cf8' },
  { id: 'emerald', name: 'Emerald Bull', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '#34d399' },
  { id: 'cyan', name: 'Cyber Blue', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', border: '#38bdf8' },
  { id: 'purple', name: 'Neon Purple', gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', border: '#c084fc' },
  { id: 'amber', name: 'Sunset Amber', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: '#fbbf24' },
  { id: 'rose', name: 'Velvet Rose', gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', border: '#fb7185' },
];

export const UserAvatar = ({ user, size = 40, showBorder = true, style = {} }) => {
  const name = user?.name || 'Trader';
  const avatarConfig = user?.avatarConfig || {};
  
  // Get preset emoji or fallback to initials
  const selectedPreset = AVATAR_PRESETS.find(p => p.id === avatarConfig.presetId);
  const selectedColor = AVATAR_GRADIENTS.find(c => c.id === avatarConfig.colorId) || AVATAR_GRADIENTS[0];
  
  const emoji = selectedPreset?.emoji || null;
  
  // Compute initials (up to 2 letters)
  const getInitials = (str) => {
    if (!str) return 'TR';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const background = selectedColor.gradient;
  const borderColor = showBorder ? selectedColor.border : 'transparent';
  
  const fontSize = Math.max(12, Math.round(size * 0.42));

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: background,
        border: showBorder ? `2px solid ${borderColor}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: '800',
        fontSize: `${fontSize}px`,
        fontFamily: 'var(--font-sans)',
        boxShadow: showBorder ? `0 0 12px ${borderColor}40` : 'none',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      title={`${name}'s Avatar`}
    >
      {emoji ? (
        <span style={{ fontSize: `${Math.round(size * 0.52)}px`, lineHeight: 1 }}>{emoji}</span>
      ) : (
        <span style={{ letterSpacing: '0.5px' }}>{initials}</span>
      )}
    </div>
  );
};

export default UserAvatar;
