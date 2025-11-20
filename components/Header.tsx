
import React, { useState, useEffect } from 'react';
import { User, TimeEntry, Task } from '../types';
import { StorageService } from '../services/storageService';

interface HeaderProps {
  user: User;
  activeTimer?: TimeEntry;
  onStopTimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activeTimer, onStopTimer }) => {
  const [elapsed, setElapsed] = useState(0);
  const [taskName, setTaskName] = useState('');
  const [isPomodoro, setIsPomodoro] = useState(false); // Toggle state

  useEffect(() => {
    if (!activeTimer) {
        setElapsed(0);
        setTaskName('');
        return;
    }
    // Fetch task details for the timer
    const tasks = StorageService.getTasks();
    const t = tasks.find(task => task.id === activeTimer.taskId);
    if (t) setTaskName(t.title);

    const interval = setInterval(() => {
        const start = new Date(activeTimer.startTime).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 1000);
        setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (sec: number) => {
      if (isPomodoro) {
          // Pomodoro Countdown (25 mins - elapsed)
          const POMODORO_SECONDS = 25 * 60;
          const remaining = Math.max(0, POMODORO_SECONDS - sec);
          const m = Math.floor(remaining / 60).toString().padStart(2, '0');
          const s = (remaining % 60).toString().padStart(2, '0');
          return `${m}:${s}`;
      } else {
          // Standard Stopwatch
          const h = Math.floor(sec / 3600).toString().padStart(2, '0');
          const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
          const s = (sec % 60).toString().padStart(2, '0');
          return `${h}:${m}:${s}`;
      }
  };

  return (
    <header className="h-[70px] bg-dark-card/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 sticky top-0 z-30 ml-[260px] my-4 mx-6 rounded-xl border border-dark-border/50 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-muted group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <input 
             type="text" 
             placeholder="Search projects, tasks, or assets..." 
             className="bg-dark-bg border border-transparent hover:border-dark-border focus:border-primary rounded-md text-dark-text placeholder-dark-muted focus:ring-0 w-full pl-10 py-2 text-sm transition-all outline-none"
           />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Pomodoro Toggle */}
        <div className="flex items-center gap-2 bg-dark-bg p-1 rounded-lg border border-dark-border">
            <button 
                onClick={() => setIsPomodoro(false)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${!isPomodoro ? 'bg-white text-primary shadow-sm' : 'text-dark-muted hover:text-dark-text'}`}
            >
                Timer
            </button>
            <button 
                onClick={() => setIsPomodoro(true)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${isPomodoro ? 'bg-danger/10 text-danger shadow-sm border border-danger/20' : 'text-dark-muted hover:text-dark-text'}`}
            >
                Focus (25m)
            </button>
        </div>

        {/* Timer Display Area */}
        <div className={`flex items-center gap-3 border rounded-lg px-4 py-1.5 transition-colors ${activeTimer ? (isPomodoro ? 'bg-danger/5 border-danger/30 shadow-[0_0_15px_rgba(234,84,85,0.2)] animate-pulse' : 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(115,103,240,0.2)] animate-pulse') : 'bg-dark-bg border-dark-border opacity-60'}`}>
            {activeTimer ? (
                <>
                    <div className="flex flex-col items-start">
                        <span className={`text-[10px] uppercase font-bold tracking-wider max-w-[100px] truncate ${isPomodoro ? 'text-danger' : 'text-primary/80'}`}>{taskName}</span>
                        <span className={`text-sm font-mono font-bold ${isPomodoro ? 'text-danger' : 'text-primary'}`}>{formatTime(elapsed)}</span>
                    </div>
                    <button 
                        onClick={onStopTimer}
                        className={`w-6 h-6 rounded text-white flex items-center justify-center transition-colors shadow-md ${isPomodoro ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'}`}
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-start px-2">
                     <span className="text-[10px] uppercase font-bold tracking-wider text-dark-muted">
                         {isPomodoro ? 'Focus Mode' : 'Ready'}
                     </span>
                     <span className="text-sm font-mono font-medium text-dark-muted">
                         {isPomodoro ? '25:00' : '00:00:00'}
                     </span>
                </div>
            )}
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-dark-text hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-[10px] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">3</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-dark-text">{user.name}</div>
            <div className="text-[11px] text-dark-muted uppercase tracking-wider">{user.jobTitle || user.role.replace('_', ' ')}</div>
          </div>
          <div className="relative cursor-pointer">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-dark-card shadow-sm hover:border-primary transition-colors" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-dark-card rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
