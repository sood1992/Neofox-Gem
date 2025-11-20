
import React from 'react';
import { Task, TaskStatus, Priority, User } from '../types';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  isTimerRunning: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onToggleTimer: (taskId: string) => void;
  dependencyName?: string; // New prop to show what is blocking
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, isTimerRunning, onStatusChange, onToggleTimer, dependencyName }) => {
  
  const priorityColors = {
    [Priority.LOW]: 'bg-success/10 text-success border-success/20',
    [Priority.MEDIUM]: 'bg-info/10 text-info border-info/20',
    [Priority.HIGH]: 'bg-warning/10 text-warning border-warning/20',
    [Priority.URGENT]: 'bg-danger/10 text-danger border-danger/20',
  };

  const isLocked = task.status === TaskStatus.LOCKED;

  const completedSubtasks = task.subtasks.filter(s => s.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className={`group bg-dark-card border rounded-md p-5 transition-all duration-200 hover:shadow-lg cursor-pointer h-full flex flex-col relative ${isTimerRunning ? 'border-primary shadow-lg shadow-primary/10' : 'border-dark-border hover:border-primary/50'} ${isLocked ? 'opacity-90 bg-dark-bg/50 border-l-4 border-l-dark-muted' : ''}`}>
      
      {isLocked && (
          <div className="absolute top-2 right-2 text-dark-muted z-10" title="Locked by dependency">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wide uppercase border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {!isLocked && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleTimer(task.id);
                }}
                className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                    isTimerRunning 
                    ? 'bg-danger text-white shadow-lg shadow-danger/40' 
                    : 'bg-dark-bg text-dark-muted hover:text-primary border border-dark-border'
                }`}
                title={isTimerRunning ? "Stop Timer" : "Start Timer"}
            >
                {isTimerRunning ? (
                    <svg className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            </button>
        )}
      </div>
      
      {/* Body */}
      <div className="flex-1 mb-4">
        <h3 className={`font-semibold text-dark-text text-base mb-1 leading-tight group-hover:text-primary transition-colors ${isLocked ? 'text-dark-muted' : ''}`}>{task.title}</h3>
        <p className="text-xs text-dark-muted line-clamp-2 mb-2">{task.description}</p>
        
        {isLocked && dependencyName && (
             <div className="bg-warning/10 text-warning border border-warning/20 rounded px-2 py-1.5 text-[10px] flex items-center gap-1.5 mt-2">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="truncate">Blocked by: <strong>{dependencyName}</strong></span>
             </div>
        )}
      </div>

      {/* Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-dark-muted mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-border mt-auto">
        <div className="flex items-center -space-x-2">
           {assignee ? (
             <img src={assignee.avatar} alt={assignee.name} className="w-7 h-7 rounded-full border-2 border-dark-card" title={assignee.name} />
           ) : (
             <div className="w-7 h-7 rounded-full bg-dark-bg border-2 border-dark-card flex items-center justify-center text-[10px] text-dark-muted">?</div>
           )}
           {task.comments?.length > 0 && (
               <div className="w-7 h-7 rounded-full bg-dark-bg border-2 border-dark-card flex items-center justify-center text-[10px] text-dark-muted z-10 pl-1">
                   +1
               </div>
           )}
        </div>

        <select 
          value={task.status}
          disabled={isLocked}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className={`text-[10px] font-medium rounded px-2 py-1 border outline-none cursor-pointer transition-colors ${
              task.status === TaskStatus.DONE 
              ? 'bg-success/10 text-success border-success/20' 
              : isLocked 
                 ? 'bg-dark-bg text-dark-muted border-dark-border cursor-not-allowed' 
                 : 'bg-dark-bg text-dark-text border-dark-border hover:border-primary/50'
          }`}
        >
          {Object.values(TaskStatus).map(status => (
            <option key={status} value={status}>{status.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
