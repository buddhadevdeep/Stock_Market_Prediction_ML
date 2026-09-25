import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Eye,
  Menu,
  Bell,
  Activity
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { toggleMobileSidebar, notifications, alerts } = useApp();
  const location = useLocation();

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  const navTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predict', path: '/prediction', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Eye },
    { name: 'Bull/Bear', path: '/bullbear', icon: Activity },
  ];

  return (
    <nav className="mobile-app-dock" aria-label="Mobile Navigation">
      <div className="mobile-dock-container">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={`mobile-dock-item ${isActive ? 'active' : ''}`}
            >
              <div className="dock-icon-box">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.name === 'Dashboard' && unreadAlerts > 0 && (
                  <span className="dock-badge-dot" />
                )}
              </div>
              <span className="dock-label">{tab.name}</span>
            </NavLink>
          );
        })}

        {/* Menu Drawer Opener */}
        <button
          type="button"
          className="mobile-dock-item menu-trigger"
          onClick={toggleMobileSidebar}
          aria-label="Open full menu"
        >
          <div className="dock-icon-box">
            <Menu size={20} strokeWidth={2} />
            {unreadAlerts > 0 && <span className="dock-badge-dot" />}
          </div>
          <span className="dock-label">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
