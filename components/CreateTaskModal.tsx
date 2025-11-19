import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, User, Department } from '../types';
import { GeminiService } from '../services/geminiService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  currentUser: User;
  users: User[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSave, currentUser, users }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);

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
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: TaskStatus.TODO,
      priority,
      assigneeId,
      reporterId: currentUser.id,
      department: assignee ? assignee.department : Department.MANAGEMENT,
      dueDate: dueDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      subtasks: generatedSubtasks.map((st, i) => ({ id: `st-${i}`, title: st, isCompleted: false })),
      tags: []
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neofox-800 border border-slate-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-display font-bold text-white">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title & Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-neofox-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-neofox-500 outline-none"
                placeholder="e.g. Edit Social Reel"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Assign To</label>
              <select 
                required
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full bg-neofox-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-neofox-500 outline-none"
              >
                <option value="">Select Team Member</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description with AI */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-xs font-medium text-slate-400">Description</label>
              <button 
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isAiLoading || !description}
                className="text-[10px] text-neofox-500 hover:text-neofox-accent transition-colors flex items-center gap-1"
              >
                {isAiLoading ? 'Magic working...' : '✨ Enhance with AI'}
              </button>
            </div>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neofox-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-neofox-500 outline-none h-24"
              placeholder="Brief details about the task..."
            />
          </div>

          {/* AI Subtasks */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 border-dashed">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-white">Subtasks</h4>
              <button 
                type="button"
                onClick={handleGenerateSubtasks}
                disabled={!title || !assigneeId || isAiLoading}
                className="text-xs bg-neofox-500/20 text-neofox-500 px-3 py-1 rounded-full hover:bg-neofox-500/30 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? 'Generating...' : '⚡ Generate Breakdown'}
              </button>
            </div>
            
            {generatedSubtasks.length > 0 ? (
              <ul className="space-y-2">
                {generatedSubtasks.map((st, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked readOnly className="accent-neofox-500" />
                    <input 
                      type="text" 
                      value={st} 
                      onChange={(e) => {
                        const newSt = [...generatedSubtasks];
                        newSt[idx] = e.target.value;
                        setGeneratedSubtasks(newSt);
                      }}
                      className="bg-transparent border-none w-full focus:outline-none text-slate-300"
                    />
                    <button type="button" onClick={() => setGeneratedSubtasks(generatedSubtasks.filter((_, i) => i !== idx))} className="text-slate-600 hover:text-red-400">×</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-2">Assign a user and enter a title to generate a checklist.</p>
            )}
            <button 
              type="button" 
              onClick={() => setGeneratedSubtasks([...generatedSubtasks, "New Subtask"])}
              className="text-xs text-slate-400 mt-2 hover:text-white"
            >
              + Add Manually
            </button>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-neofox-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-neofox-500 outline-none"
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
              <input 
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-neofox-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-neofox-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-neofox-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-neofox-500/25">
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};