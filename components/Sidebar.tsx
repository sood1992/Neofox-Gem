
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout }) => {
  
  const renderMenuItem = (id: string, label: string, iconPath: string) => {
      const isActive = activeTab === id;
      return (
        <button
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
      <div className="h-[80px] flex items-center px-6 gap-3 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#a096f5] rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-primary/40">
          F
        </div>
        <span className="font-sans text-xl font-bold tracking-tight text-dark-text">
          Fox<span className="text-primary">hole</span>
        </span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-6">
        
        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Dashboards</div>
            {renderMenuItem('dashboard', 'Overview', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6')}
            {(role === UserRole.ADMIN || role === UserRole.PROJECT_MANAGER) && (
                <>
                    {renderMenuItem('finance', 'Financials', 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z')}
                    {renderMenuItem('analytics', 'Productivity', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z')}
                </>
            )}
        </div>

        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Apps & Pages</div>
            {renderMenuItem('projects', 'Projects', 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z')}
            {renderMenuItem('tasks', 'Kanban Board', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01')}
            {renderMenuItem('calendar', 'Calendar', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z')}
            {renderMenuItem('shoot-calendar', 'Shoot Calendar', 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z')}
            {renderMenuItem('assets', 'Asset Library', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z')}
        </div>

        {(role === UserRole.ADMIN || role === UserRole.PROJECT_MANAGER) && 
        <div>
            <div className="px-4 mb-2 text-xs font-bold text-dark-muted uppercase tracking-wider">Management</div>
            {renderMenuItem('team', 'Team', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z')}
            {role === UserRole.ADMIN && renderMenuItem('master-performance', 'Master Performance', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}
            {renderMenuItem('clients', 'Clients', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z')}
            {role === UserRole.ADMIN && renderMenuItem('settings', 'Settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')}
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
