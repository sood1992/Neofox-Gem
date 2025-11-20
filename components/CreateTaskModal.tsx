
import React, { useState } from 'react';
import { Task, Priority, TaskStatus, User, Department, Project } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  currentUser: User;
  users: User[];
  projects: Project[]; 
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSave, currentUser, users, projects }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number>(0); 
  const [dependencyId, setDependencyId] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);

  const tasks = StorageService.getTasks();
  
  const potentialDependencies = tasks.filter(t => t.projectId === projectId && t.status !== TaskStatus.DONE);

  if (!isOpen) return null;

  const handleGenerateSubtasks = async () => {
    const assignee = users.find(u => u.id === assigneeId);
    if (!title || !assignee) return;

    setIsAiLoading(true);
    try {
      const subtasks = await GeminiService.suggestSubtasks(title, assignee.department);
      setGeneratedSubtasks(subtasks);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!description) return;
    setIsAiLoading(true);
    try {
      const enhanced = await GeminiService.enhanceDescription(description);
      setDescription(enhanced);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === assigneeId);
    const finalProjectId = projectId || projects[0]?.id || 'p1';
    
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: finalProjectId,
      title,
      description,
      status: dependencyId ? TaskStatus.LOCKED : TaskStatus.TODO,
      priority,
      assigneeId,
      reporterId: currentUser.id,
      department: assignee ? assignee.department : Department.MANAGEMENT,
      dueDate: dueDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      subtasks: generatedSubtasks.map((st, i) => ({ id: `st-${i}`, title: st, isCompleted: false })),
      tags: [],
      timeSpentSeconds: 0,
      estimatedSeconds: estimatedHours * 3600, // Convert to seconds
      dependencies: dependencyId ? [dependencyId] : [],
      comments: [],
      assets: []
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
        <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-bg/30">
          <h2 className="text-xl font-bold text-dark-text">New Task</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-danger transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Project Selection */}
          <div>
              <label className="block text-xs font-semibold text-dark-text mb-1.5">Project</label>
              <select 
                required
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none transition-colors"
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-dark-text mb-1.5">Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none transition-colors placeholder-dark-muted"
                placeholder="e.g. Homepage Redesign"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-text mb-1.5">Assignee</label>
              <select 
                required
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none transition-colors"
              >
                <option value="">Select Member</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-xs font-semibold text-dark-text">Description</label>
              <button 
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isAiLoading || !description}
                className="text-[10px] text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {isAiLoading ? 'Thinking...' : '✨ Improve with AI'}
              </button>
            </div>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none h-24 resize-none placeholder-dark-muted"
              placeholder="Task details..."
            />
          </div>

          {/* Dependencies */}
          {projectId && (
              <div>
                  <label className="block text-xs font-semibold text-dark-text mb-1.5">Blocked By (Dependency)</label>
                  <div className="relative">
                      <select 
                        value={dependencyId}
                        onChange={e => setDependencyId(e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none appearance-none"
                      >
                        <option value="">No Dependency</option>
                        {potentialDependencies.map(t => (
                          <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-2.5 pointer-events-none text-dark-muted">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                  </div>
                  <p className="text-[10px] text-dark-muted mt-1">
                      {dependencyId ? 'This task will be LOCKED until the dependency is completed.' : 'Select a task that must be finished before this one starts.'}
                  </p>
              </div>
          )}

          <div className="bg-dark-bg/50 p-4 rounded border border-dark-border border-dashed">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-dark-text">Checklist</h4>
              <button 
                type="button"
                onClick={handleGenerateSubtasks}
                disabled={!title || !assigneeId || isAiLoading}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? 'Generating...' : 'Auto-Generate'}
              </button>
            </div>
            
            <div className="space-y-2">
                {generatedSubtasks.map((st, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-dark-muted rounded"></div>
                    <input 
                      type="text" 
                      value={st} 
                      onChange={(e) => {
                        const newSt = [...generatedSubtasks];
                        newSt[idx] = e.target.value;
                        setGeneratedSubtasks(newSt);
                      }}
                      className="bg-transparent border-none w-full focus:outline-none text-sm text-dark-text placeholder-dark-muted"
                    />
                    <button type="button" onClick={() => setGeneratedSubtasks(generatedSubtasks.filter((_, i) => i !== idx))} className="text-dark-muted hover:text-danger">×</button>
                  </div>
                ))}
                 <button 
                    type="button" 
                    onClick={() => setGeneratedSubtasks([...generatedSubtasks, "New Item"])}
                    className="text-xs text-dark-muted hover:text-primary mt-2 block"
                 >
                    + Add Item
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-dark-text mb-1.5">Est. Hours</label>
                <input 
                  type="number"
                  min="0"
                  step="0.5"
                  value={estimatedHours}
                  onChange={e => setEstimatedHours(parseFloat(e.target.value))}
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none"
                  placeholder="e.g. 4.5"
                />
             </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-dark-text mb-1.5">Priority</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none"
              >
                {Object.values(Priority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-dark-text mb-1.5">Deadline (Date & Time)</label>
              <input 
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg rounded transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
