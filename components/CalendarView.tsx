
import React, { useState } from 'react';
import { Task, Project, TaskStatus } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, projects }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCells = () => {
      const cells = [];
      // Padding
      for(let i = 0; i < firstDayOfMonth; i++) {
          cells.push(<div key={`pad-${i}`} className="bg-dark-bg/30 min-h-[100px] border-r border-b border-dark-border"></div>);
      }
      // Days
      for(let d = 1; d <= daysInMonth; d++) {
          const currentDayStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0];
          const dayTasks = tasks.filter(t => t.dueDate.startsWith(currentDayStr));

          cells.push(
              <div key={`day-${d}`} className="bg-dark-card min-h-[120px] border-r border-b border-dark-border p-2 transition-colors hover:bg-dark-bg/10">
                  <div className="text-right mb-2">
                      <span className={`text-sm font-medium ${
                          new Date().toISOString().split('T')[0] === currentDayStr 
                          ? 'bg-primary text-white w-6 h-6 inline-flex items-center justify-center rounded-full' 
                          : 'text-dark-text'
                      }`}>{d}</span>
                  </div>
                  <div className="space-y-1">
                      {dayTasks.map(t => (
                          <div key={t.id} className={`text-[10px] px-1.5 py-1 rounded truncate border-l-2 cursor-pointer hover:opacity-80 ${
                              t.status === TaskStatus.DONE ? 'bg-success/10 border-success text-success' : 
                              t.status === TaskStatus.LOCKED ? 'bg-dark-bg border-dark-muted text-dark-muted' :
                              'bg-primary/10 border-primary text-primary'
                          }`}>
                              {t.status === TaskStatus.LOCKED && '🔒 '}{t.title}
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
      return cells;
  };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border shadow-sm animate-fade-in">
        <div className="p-6 border-b border-dark-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark-text">Calendar</h2>
            <div className="flex items-center gap-4">
                <button onClick={prevMonth} className="p-2 hover:bg-dark-bg rounded text-dark-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-lg font-medium text-dark-text w-32 text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-dark-bg rounded text-dark-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-7 bg-dark-bg border-b border-dark-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-3 text-center text-xs font-bold uppercase text-dark-muted tracking-wider">
                    {d}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7">
            {renderCells()}
        </div>
    </div>
  );
};
