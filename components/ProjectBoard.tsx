
import React, { useState } from 'react';
import { Task, TaskStatus, User, Project } from '../types';
import { TaskCard } from './TaskCard';

interface ProjectBoardProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
  onUpdateTask: (task: Task) => void;
  onToggleTimer: (taskId: string) => void;
  activeTimerTaskId?: string;
  onTaskClick: (task: Task) => void;
  initialFilter?: string;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ tasks, users, projects, onUpdateTask, onToggleTimer, activeTimerTaskId, onTaskClick, initialFilter = 'ALL' }) => {
  const [filterProject, setFilterProject] = useState<string>(initialFilter);

  const filteredTasks = filterProject === 'ALL' ? tasks : tasks.filter(t => t.projectId === filterProject);

  const columns = [
      { id: TaskStatus.TODO, title: 'To Do', color: 'bg-dark-muted' },
      { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-primary' },
      { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-warning' },
      { id: TaskStatus.DONE, title: 'Done', color: 'bg-success' }
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-dark-text">Kanban Board</h2>
                <select 
                    value={filterProject} 
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="bg-dark-card border border-dark-border text-dark-text text-sm rounded px-3 py-1.5 focus:border-primary outline-none shadow-sm"
                >
                    <option value="ALL">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-[1000px] h-full">
                {columns.map(col => {
                    const colTasks = filteredTasks.filter(t => t.status === col.id);
                    // Also include LOCKED tasks in TODO for visibility (or logic)
                    const displayTasks = col.id === TaskStatus.TODO 
                        ? [...colTasks, ...filteredTasks.filter(t => t.status === TaskStatus.LOCKED)]
                        : colTasks;

                    return (
                        <div key={col.id} className="flex-1 flex flex-col bg-dark-bg/50 rounded-xl border border-dark-border/50 min-w-[280px]">
                            <div className="p-4 border-b border-dark-border/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                                    <h3 className="font-bold text-sm text-dark-text">{col.title}</h3>
                                </div>
                                <span className="text-xs bg-dark-card px-2 py-0.5 rounded text-dark-muted border border-dark-border shadow-sm">{displayTasks.length}</span>
                            </div>
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                {displayTasks.map(task => {
                                    // Find blocking task name if applicable
                                    let blockerName = undefined;
                                    if (task.status === TaskStatus.LOCKED && task.dependencies.length > 0) {
                                        const blocker = tasks.find(t => t.id === task.dependencies[0]);
                                        if (blocker) blockerName = blocker.title;
                                    }

                                    return (
                                        <div key={task.id} onClick={() => onTaskClick(task)}>
                                            <TaskCard 
                                                task={task}
                                                assignee={users.find(u => u.id === task.assigneeId)}
                                                isTimerRunning={activeTimerTaskId === task.id}
                                                onStatusChange={(id, status) => {
                                                    const t = tasks.find(x => x.id === id);
                                                    if(t) onUpdateTask({...t, status});
                                                }}
                                                onToggleTimer={onToggleTimer}
                                                dependencyName={blockerName}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
