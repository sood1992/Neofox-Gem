import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-neofox-800 border-b border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neofox-500 to-neofox-accent rounded-lg flex items-center justify-center font-bold text-white">
          N
        </div>
        <span className="font-display text-xl font-bold tracking-tight">Neofox<span className="text-neofox-500">Nexus</span></span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{user.role.replace('_', ' ')}</div>
        </div>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-9 h-9 rounded-full border-2 border-slate-600"
        />
        <button 
          onClick={onLogout}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};