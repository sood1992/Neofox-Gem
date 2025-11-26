import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, searchQuery, onSearchChange }) => {
  const [notifications] = useState([
    { id: 1, message: '3 new candidates added', unread: true },
    { id: 2, message: 'Analysis complete for Alex Thompson', unread: true },
    { id: 3, message: 'Interview scheduled for tomorrow', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-[70px] bg-dark-card/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 sticky top-0 z-30 ml-[260px] my-4 mx-6 rounded-xl border border-dark-border/50 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-muted group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input
             type="text"
             placeholder="Search candidates, positions, or skills..."
             value={searchQuery}
             onChange={(e) => onSearchChange(e.target.value)}
             className="bg-dark-bg border border-transparent hover:border-dark-border focus:border-primary rounded-md text-dark-text placeholder-dark-muted focus:ring-0 w-full pl-10 py-2 text-sm transition-all outline-none"
           />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
            title="Quick Add Candidate"
          >
            + Add Candidate
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform group">
            <svg className="w-6 h-6 text-dark-text group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-[10px] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-dark-text">{user.name}</div>
            <div className="text-[11px] text-dark-muted uppercase tracking-wider">
              {user.role.replace('_', ' ')}
            </div>
          </div>
          <div className="relative cursor-pointer">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-dark-card shadow-sm hover:border-primary transition-colors"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-dark-card rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
