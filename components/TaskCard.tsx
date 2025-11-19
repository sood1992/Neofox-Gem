import React from 'react';
import { Task, TaskStatus, TaskPriority, User } from '../types';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, onStatusChange, onEdit }) => {
  
  const priorityColors = {
    [TaskPriority.LOW]: 'bg-slate-700 text-slate-300',
    [TaskPriority.MEDIUM]: 'bg-blue-900 text-blue-200',
    [TaskPriority.HIGH]: 'bg-orange-900 text-orange-200',
    [TaskPriority.URGENT]: 'bg-red-900 text-red-200',
  };

  const completedSubtasks = task.subtasks.filter(s => s.isCompleted).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div className="bg-neofox-800 border border-slate-700 rounded-xl p-4 hover:border-neofox-500 transition-all shadow-lg group">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded font-medium tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button onClick={() => onEdit(task)} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
        </button>
      </div>
      
      <h3 className="font-display font-semibold text-white mb-1 truncate" title={task.title}>{task.title}</h3>
      <p className="text-xs text-slate-400 mb-4 line-clamp-2 h-8">{task.description}</p>
      
      {totalSubtasks > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div 
              className="bg-neofox-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700">
        <div className="flex items-center gap-2">
          {assignee ? (
             <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full border border-slate-600" title={assignee.name} />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">?</div>
          )}
          <span className="text-[10px] text-slate-400">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
        </div>

        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="bg-slate-900 text-[10px] text-white border border-slate-700 rounded px-2 py-1 focus:border-neofox-500 outline-none"
        >
          {Object.values(TaskStatus).map(status => (
            <option key={status} value={status}>{status.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  );
};