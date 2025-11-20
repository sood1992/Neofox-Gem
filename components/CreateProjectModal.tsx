
import React, { useState } from 'react';
import { Project, User, UserRole } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  currentUser: User;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [title, setTitle] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
        id: Date.now().toString(),
        clientId: 'c1', // Default for now
        title,
        jobCode: jobCode.toUpperCase(),
        description,
        managerId: currentUser.id,
        deadline: deadline || new Date(Date.now() + 86400000 * 30).toISOString(),
        status: 'ACTIVE',
        budget,
        expenses: 0,
        tags: []
    };
    onSave(newProject);
    onClose();
    setTitle('');
    setJobCode('');
    setDescription('');
    setBudget(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-card w-full max-w-lg rounded-xl shadow-2xl border border-dark-border animate-scale-up">
            <div className="p-6 border-b border-dark-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-dark-text">Create New Project</h3>
                <button onClick={onClose} className="text-dark-muted hover:text-danger">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Project Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" placeholder="e.g. Nike Summer Campaign" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Job Code (Mandatory)</label>
                    <input type="text" required value={jobCode} onChange={e => setJobCode(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none font-mono uppercase" placeholder="e.g. NIKE-SUM-2025" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none h-24 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-dark-muted mb-1">Budget (INR)</label>
                        <input type="number" required value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-dark-muted mb-1">Deadline</label>
                        <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg rounded transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded shadow-lg shadow-primary/20">Create Project</button>
                </div>
            </form>
        </div>
    </div>
  );
};
