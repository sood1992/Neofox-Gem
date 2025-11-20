
import React, { useState } from 'react';
import { Task, Comment, User, TaskStatus, Priority, Asset, TimeEntry } from '../types';
import { StorageService } from '../services/storageService';

interface TaskDetailPaneProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  users: User[];
  currentUser: User;
  allTasks: Task[];
}

type Tab = 'OVERVIEW' | 'SUBTASKS' | 'COMMENTS' | 'TIME' | 'ASSETS';

export const TaskDetailPane: React.FC<TaskDetailPaneProps> = ({ task, onClose, onUpdate, users, currentUser, allTasks }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [newComment, setNewComment] = useState('');
  
  // Helper
  const getAssignee = (id: string) => users.find(u => u.id === id);
  const timeEntries = StorageService.getTimeEntries().filter(te => te.taskId === task.id);

  // Dependency Helpers
  const projectTasks = allTasks.filter(t => t.projectId === task.projectId && t.id !== task.id);
  const currentDependencies = projectTasks.filter(t => task.dependencies.includes(t.id));
  const availableDependencies = projectTasks.filter(t => !task.dependencies.includes(t.id) && t.status !== TaskStatus.DONE);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: newComment,
        createdAt: new Date().toISOString(),
        type: 'GENERAL'
    };
    onUpdate({
        ...task,
        comments: [...(task.comments || []), comment]
    });
    setNewComment('');
  };

  const handleStatusTransition = (action: 'SUBMIT' | 'APPROVE' | 'REJECT') => {
      let newStatus = task.status;
      if (action === 'SUBMIT') newStatus = TaskStatus.REVIEW;
      if (action === 'APPROVE') newStatus = TaskStatus.DONE;
      if (action === 'REJECT') newStatus = TaskStatus.CHANGES_REQUESTED;
      
      onUpdate({ ...task, status: newStatus });
  };

  const addDependency = (dependencyId: string) => {
      if (!dependencyId) return;
      const updatedDeps = [...task.dependencies, dependencyId];
      // Automatically lock the task if it has active dependencies
      onUpdate({ 
          ...task, 
          dependencies: updatedDeps,
          status: TaskStatus.LOCKED 
      });
  };

  const removeDependency = (dependencyId: string) => {
      const updatedDeps = task.dependencies.filter(id => id !== dependencyId);
      // If no dependencies left and it was locked, unlock it
      const shouldUnlock = updatedDeps.length === 0 && task.status === TaskStatus.LOCKED;
      onUpdate({ 
          ...task, 
          dependencies: updatedDeps,
          status: shouldUnlock ? TaskStatus.TODO : task.status
      });
  };

  const renderTabContent = () => {
      switch(activeTab) {
          case 'OVERVIEW':
              return (
                  <div className="space-y-6">
                       <div>
                            <label className="text-xs text-dark-muted block mb-2 uppercase font-bold">Description</label>
                            <div className="text-sm text-dark-text bg-dark-bg p-4 rounded-lg border border-dark-border leading-relaxed">
                                {task.description}
                            </div>
                        </div>

                        {/* Dependencies Section */}
                        <div className="bg-dark-bg/30 p-4 rounded-lg border border-dark-border">
                            <h4 className="text-xs font-bold text-dark-muted uppercase mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                Dependencies
                            </h4>
                            
                            {currentDependencies.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {currentDependencies.map(dep => (
                                        <div key={dep.id} className="flex items-center justify-between bg-dark-card p-2 rounded border border-dark-border">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={`w-2 h-2 rounded-full ${dep.status === TaskStatus.DONE ? 'bg-success' : 'bg-warning'}`}></div>
                                                <span className={`text-sm truncate ${dep.status === TaskStatus.DONE ? 'text-dark-muted line-through' : 'text-dark-text'}`}>
                                                    {dep.title}
                                                </span>
                                            </div>
                                            <button onClick={() => removeDependency(dep.id)} className="text-dark-muted hover:text-danger p-1">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <select 
                                    className="flex-1 bg-dark-bg border border-dark-border text-dark-text text-sm rounded px-2 py-1.5 outline-none focus:border-primary"
                                    onChange={(e) => addDependency(e.target.value)}
                                    value=""
                                >
                                    <option value="" disabled>+ Add blocking task</option>
                                    {availableDependencies.map(t => (
                                        <option key={t.id} value={t.id}>{t.title}</option>
                                    ))}
                                </select>
                            </div>
                            {task.status === TaskStatus.LOCKED && (
                                <p className="text-[10px] text-warning mt-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    This task is locked until dependencies are done.
                                </p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-dark-bg p-3 rounded border border-dark-border">
                                <label className="text-xs text-dark-muted block mb-1">Estimated Time</label>
                                <span className="text-sm font-mono font-medium text-dark-text">{(task.estimatedSeconds / 3600).toFixed(1)}h</span>
                            </div>
                            <div className="bg-dark-bg p-3 rounded border border-dark-border">
                                <label className="text-xs text-dark-muted block mb-1">Actual Time</label>
                                <span className={`text-sm font-mono font-medium ${task.timeSpentSeconds > task.estimatedSeconds ? 'text-danger' : 'text-success'}`}>
                                    {(task.timeSpentSeconds / 3600).toFixed(1)}h
                                </span>
                            </div>
                        </div>

                        {/* Approval Flow Controls */}
                        <div className="border-t border-dark-border pt-4">
                            <h4 className="text-xs font-bold text-dark-muted uppercase mb-3">Workflow Actions</h4>
                            <div className="flex gap-3">
                                {task.status === TaskStatus.IN_PROGRESS && (
                                    <button onClick={() => handleStatusTransition('SUBMIT')} className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded-md text-sm font-medium shadow-sm">
                                        Submit for Review
                                    </button>
                                )}
                                {task.status === TaskStatus.REVIEW && currentUser.role !== 'EMPLOYEE' && (
                                    <>
                                        <button onClick={() => handleStatusTransition('APPROVE')} className="flex-1 bg-success hover:bg-green-600 text-white py-2 rounded-md text-sm font-medium shadow-sm">
                                            Approve
                                        </button>
                                        <button onClick={() => handleStatusTransition('REJECT')} className="flex-1 bg-danger hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium shadow-sm">
                                            Request Changes
                                        </button>
                                    </>
                                )}
                                {task.status === TaskStatus.TODO && (
                                    <button onClick={() => onUpdate({...task, status: TaskStatus.IN_PROGRESS})} className="flex-1 bg-dark-bg hover:bg-dark-border border border-dark-border text-dark-text py-2 rounded-md text-sm font-medium">
                                        Start Working
                                    </button>
                                )}
                                {task.status === TaskStatus.LOCKED && (
                                     <div className="w-full bg-dark-bg text-dark-muted py-2 rounded-md text-sm text-center border border-dark-border italic flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        Task is Locked
                                     </div>
                                )}
                            </div>
                        </div>
                  </div>
              );
          case 'TIME':
              return (
                  <div className="space-y-4">
                      {timeEntries.length === 0 ? (
                          <p className="text-sm text-dark-muted text-center py-8">No time logged yet.</p>
                      ) : (
                          timeEntries.map(te => (
                              <div key={te.id} className="flex justify-between items-center p-3 bg-dark-bg rounded border border-dark-border">
                                  <div>
                                      <div className="text-xs text-dark-muted">{new Date(te.startTime).toLocaleDateString()}</div>
                                      <div className="text-sm text-dark-text font-medium">{te.description || 'Work Session'}</div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-sm font-mono font-bold text-primary">{(te.durationSeconds / 3600).toFixed(2)}h</div>
                                      <div className="text-[10px] text-dark-muted">{new Date(te.startTime).toLocaleTimeString()} - {te.endTime ? new Date(te.endTime).toLocaleTimeString() : 'Now'}</div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              );
          case 'COMMENTS':
              return (
                <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2">
                        {task.comments && task.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={getAssignee(comment.userId)?.avatar} className="w-8 h-8 rounded-full mt-1" alt="" />
                                <div className="bg-dark-bg p-3 rounded-r-xl rounded-bl-xl flex-1 border border-dark-border">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs font-bold text-primary">{getAssignee(comment.userId)?.name}</span>
                                        <span className="text-[10px] text-dark-muted">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-sm text-dark-text">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                        <input 
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a message..." 
                            className="flex-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button onClick={handleAddComment} className="bg-primary hover:bg-primary-hover text-white p-2 rounded shadow-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
              );
          case 'ASSETS':
              return (
                  <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-dark-border rounded-lg flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors cursor-pointer group text-center bg-dark-bg/30">
                          <svg className="w-8 h-8 text-dark-muted group-hover:text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          <span className="text-xs text-dark-muted group-hover:text-dark-text">Click to upload files</span>
                      </div>
                      {/* Mock Assets */}
                      {[1,2].map(i => (
                          <div key={i} className="bg-dark-bg rounded-lg p-3 border border-dark-border group relative shadow-sm">
                              <div className="aspect-video bg-black/10 rounded mb-2 flex items-center justify-center overflow-hidden">
                                  <svg className="w-8 h-8 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <div className="text-xs font-medium text-dark-text truncate">Draft_V{i}.mp4</div>
                              <div className="text-[10px] text-dark-muted">Uploaded by Davide</div>
                              <button className="absolute top-2 right-2 text-dark-text opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded p-1 shadow">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              </button>
                          </div>
                      ))}
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-xl bg-dark-card h-full shadow-2xl border-l border-dark-border flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="p-6 border-b border-dark-border">
                <div className="flex justify-between items-start mb-4">
                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        task.priority === Priority.HIGH || task.priority === Priority.URGENT ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'
                    }`}>
                        {task.priority}
                    </span>
                    <button onClick={onClose} className="text-dark-muted hover:text-dark-text transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <h2 className="text-xl font-bold text-dark-text leading-tight mb-2">{task.title}</h2>
                <div className="flex items-center gap-3 text-sm text-dark-muted">
                     <div className="flex items-center gap-2">
                        <img src={getAssignee(task.assigneeId)?.avatar} className="w-5 h-5 rounded-full border border-dark-border" alt="" />
                        <span>{getAssignee(task.assigneeId)?.name}</span>
                     </div>
                     <span>•</span>
                     <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="px-6 border-b border-dark-border flex gap-6">
                {['OVERVIEW', 'SUBTASKS', 'TIME', 'ASSETS', 'COMMENTS'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                            activeTab === tab 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-dark-muted hover:text-dark-text'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-dark-card">
                {renderTabContent()}
            </div>
        </div>
    </div>
  );
};
