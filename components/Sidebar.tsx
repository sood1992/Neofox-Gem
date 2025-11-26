import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout }) => {

  const renderMenuItem = (id: string, label: string, iconPath: string, roles: UserRole[] = []) => {
      if (roles.length > 0 && !roles.includes(role)) return null;

      const isActive = activeTab === id;
      return (
        <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group mb-1 ${
            isActive
                ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/30'
                : 'text-dark-text hover:bg-dark-border/50'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-white' : 'text-dark-muted group-hover:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
            <span className="font-medium text-sm tracking-wide">{label}</span>
        </button>
      );
  };

  return (
    <aside className="w-[260px] bg-dark-card border-r border-dark-border flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 overflow-y-auto custom-scrollbar shadow-sm">
      {/* Logo Area */}
      <div className="h-[80px] flex items-center px-6 gap-3 mb-2 border-b border-dark-border">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#a096f5] rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/40">
          N
        </div>
        <div>
          <h1 className="font-sans text-lg font-bold tracking-tight text-dark-text">
            Neofox <span className="text-primary">HR</span>
          </h1>
          <p className="text-[10px] text-dark-muted font-medium">Talent Intelligence</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-6 py-4">

        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Overview</div>
            {renderMenuItem('dashboard', 'Dashboard', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6')}
            {renderMenuItem('analytics', 'Analytics', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', [UserRole.ADMIN, UserRole.HR_MANAGER])}
        </div>

        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Recruitment</div>
            {renderMenuItem('candidates', 'All Candidates', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z')}
            {renderMenuItem('positions', 'Open Positions', 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HIRING_MANAGER])}
            {renderMenuItem('pipeline', 'Hiring Pipeline', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2')}
        </div>

        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Tools</div>
            {renderMenuItem('upload', 'Add Candidates', 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.RECRUITER])}
            {renderMenuItem('compare', 'Compare Candidates', 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4')}
            {renderMenuItem('bulk-analyze', 'Bulk Analysis', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.RECRUITER])}
        </div>

        {(role === UserRole.ADMIN || role === UserRole.HR_MANAGER) &&
        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Settings</div>
            {renderMenuItem('team', 'Team Members', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z')}
            {role === UserRole.ADMIN && renderMenuItem('settings', 'System Settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')}
        </div>
        }

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border bg-dark-card">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-danger hover:bg-danger/10 rounded-md transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};
