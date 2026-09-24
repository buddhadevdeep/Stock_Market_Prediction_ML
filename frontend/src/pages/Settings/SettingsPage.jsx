import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Bell, Shield, Key, Eye, User, Sparkles, Check, Palette } from 'lucide-react';
import { UserAvatar, AVATAR_PRESETS, AVATAR_GRADIENTS } from '../../components/common/UserAvatar';

const SettingsPage = () => {
  const { theme, toggleTheme, user, updateUserProfile } = useApp();

  // Profile forms
  const [name, setName] = useState(user?.name || 'Arjun Trader');
  const [email, setEmail] = useState(user?.email || 'arjun@stockai.com');
  const [selectedPreset, setSelectedPreset] = useState(user?.avatarConfig?.presetId || 'bull');
  const [selectedColor, setSelectedColor] = useState(user?.avatarConfig?.colorId || 'indigo');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password forms
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  // Notification toggles
  const [notifs, setNotifs] = useState({
    price: true,
    prediction: true,
    news: true,
    portfolio: false
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      avatarConfig: {
        presetId: selectedPreset,
        colorId: selectedColor
      }
    });
    setProfileSuccess('Profile avatar and credentials updated!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    setSecSuccess('Password updated successfully (Simulated)');
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setSecSuccess(''), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Settings / Profile</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Configure user account details, notification channels and display parameters.</p>
      </div>

      {/* Main Grid: Forms */}
      <div className="responsive-split-2-1">
        
        {/* Profile & Avatar Customizer Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} style={{ color: 'var(--accent-purple)' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Trader Profile & Avatar</h4>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--bullish-green)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              PRO PLAN
            </span>
          </div>

          {profileSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--bullish-green)', color: 'var(--bullish-green)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600' }}>
              ✓ {profileSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Avatar Preview Header */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', background: 'var(--bg-chip)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
              <UserAvatar 
                user={{
                  name: name || 'Trader',
                  avatarConfig: { presetId: selectedPreset, colorId: selectedColor }
                }} 
                size={68}
                showBorder={true}
              />
              <div style={{ flex: 1, minWidth: '160px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>ACTIVE AVATAR</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: '700' }}>• LIVE PREVIEW</span>
                </div>
                <h4 style={{ fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 4px', fontSize: '1.05rem' }}>
                  {AVATAR_PRESETS.find(p => p.id === selectedPreset)?.name || 'Custom Avatar'}
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Aura: <strong>{AVATAR_GRADIENTS.find(c => c.id === selectedColor)?.name || 'Indigo Aura'}</strong>
                </p>
              </div>
            </div>

            {/* Avatar Preset Badges Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
                Select Trading Persona / Avatar Badge
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      style={{
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-chip)',
                        border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>
                        {preset.emoji || '🔤'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: '700', color: isSelected ? 'var(--accent-purple)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gradient / Aura Color Palette Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Palette size={14} style={{ color: 'var(--accent-cyan)' }} />
                Select Avatar Gradient & Aura
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {AVATAR_GRADIENTS.map((grad) => {
                  const isSelected = selectedColor === grad.id;
                  return (
                    <button
                      type="button"
                      key={grad.id}
                      onClick={() => setSelectedColor(grad.id)}
                      style={{
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-chip)',
                        border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          background: grad.gradient, 
                          border: `1.5px solid ${grad.border}`,
                          flexShrink: 0
                        }} 
                      />
                      <span style={{ fontSize: '0.74rem', fontWeight: '600', color: isSelected ? 'var(--accent-purple)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {grad.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Details Inputs */}
            <div className="responsive-grid-2" style={{ gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Display Name</label>
                <input 
                  type="text" 
                  required
                  className="custom-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  className="custom-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
              <button type="submit" className="btn-primary-custom" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                Save Profile & Avatar
              </button>
            </div>
          </form>
        </div>

        {/* Notifications & Themes Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Theme Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Appearance</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Dark / Light Theme</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toggle between dark and clean light modes</div>
              </div>
              <button 
                onClick={toggleTheme}
                className="btn-outline-custom"
                style={{ fontSize: '0.8rem', padding: '6px 16px', textTransform: 'uppercase' }}
              >
                {theme} Mode
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={18} style={{ color: 'var(--warning-yellow)' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Notification Settings</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'price', label: 'Price Alerts (SMS & Push)' },
                { id: 'prediction', label: 'AI Prediction updates (Daily)' },
                { id: 'news', label: 'NLP News Sentiment spikes' },
                { id: 'portfolio', label: 'Weekly Portfolio Health report' }
              ].map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id={n.id} 
                    checked={notifs[n.id]} 
                    onChange={() => setNotifs(prev => ({ ...prev, [n.id]: !prev[n.id] }))}
                    style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                  />
                  <label htmlFor={n.id} style={{ fontSize: '0.825rem', cursor: 'pointer', color: 'var(--text-primary)' }}>{n.label}</label>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Security row change password */}
      <div className="responsive-split-2-1">
        
        {/* Change password form */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={18} style={{ color: 'var(--bearish-red)' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Security / Password</h4>
          </div>
          {secSuccess && <div style={{ color: 'var(--bullish-green)', fontSize: '0.8rem' }}>{secSuccess}</div>}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Password</label>
              <input 
                type="password" 
                required
                className="custom-input" 
                value={currentPass} 
                onChange={(e) => setCurrentPass(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>New Password</label>
              <input 
                type="password" 
                required
                className="custom-input" 
                value={newPass} 
                onChange={(e) => setNewPass(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn-outline-custom" style={{ padding: '10px 20px', width: 'fit-content' }}>
              Change Password
            </button>
          </form>
        </div>

        {/* 2FA UI block */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} style={{ color: 'var(--bullish-green)' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Two-Factor Authentication</h4>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Add an extra layer of security to your trading terminal by routing confirmation tokens through authentication apps.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>App Authenticator (TOTP)</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <strong>Disabled</strong></div>
            </div>
            <button className="btn-primary-custom" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              Enable 2FA
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
