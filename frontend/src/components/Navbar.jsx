import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, BarChart2, Cpu, History, PlayCircle } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="nav-brand">
          <TrendingUp size={24} color="#3b82f6" />
          <span>StockML Predictor</span>
          <span className="nav-brand-badge">College Project</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <TrendingUp size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={16} />
            <span>Phase 1 & 2: Exploration</span>
          </NavLink>
          <NavLink to="/evaluation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cpu size={16} />
            <span>Phase 4 & 5: Models</span>
          </NavLink>
          <NavLink to="/training" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <PlayCircle size={16} />
            <span>Phase 3 & 5: Train</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <History size={16} />
            <span>History</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
