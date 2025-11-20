
import React, { useState } from 'react';
import { User, UserRole, Department } from '../types';
import { StorageService } from '../services/storageService';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onRefresh: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [department, setDepartment] = useState<Department>(Department.VIDEO_EDITING);
  const [jobTitle, setJobTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(500);

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setDepartment(user.department);
      setJobTitle(user.jobTitle || '');
      setHourlyRate(user.hourlyRate || 500);
    } else {
      setEditingUser(null);
      setName('');
      setEmail('');
      setRole(UserRole.EMPLOYEE);
      setDepartment(Department.VIDEO_EDITING);
      setJobTitle('');
      setHourlyRate(500);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userPayload: User = {
      id: editingUser ? editingUser.id : Date.now().toString(),
      name,
      email,
      role,
      department,
      jobTitle,
      hourlyRate,
      avatar: editingUser ? editingUser.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
      skills: editingUser ? editingUser.skills : [],
      xp: editingUser ? editingUser.xp : 0,
      level: editingUser ? editingUser.level : 1,
      badges: editingUser ? editingUser.badges : []
    };

    StorageService.saveUser(userPayload);
    onRefresh();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
        StorageService.deleteUser(id);
        onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-dark-text">Team Management</h2>
            <p className="text-sm text-dark-muted">Manage employees, assign roles, and set salary costs for ROI calculation.</p>
        </div>
        <button 
            onClick={() => openModal()}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
        >
            + Add Team Member
        </button>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-dark-bg/50 text-dark-muted border-b border-dark-border text-xs uppercase tracking-wider">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Role (System)</th>
                <th className="p-4">Job Title</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-right">Hourly Cost (INR)</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-dark-bg/30 transition-colors">
                  <td className="p-4 pl-6 font-medium text-dark-text flex items-center gap-3">
                    <img src={u.avatar} className="w-8 h-8 rounded-full border border-dark-border" alt="" />
                    {u.name}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === UserRole.ADMIN ? 'bg-danger/10 text-danger' : u.role === UserRole.PROJECT_MANAGER ? 'bg-info/10 text-info' : 'bg-dark-bg text-dark-muted'}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-dark-text">{u.jobTitle || '-'}</td>
                  <td className="p-4 text-dark-muted">{u.department}</td>
                  <td className="p-4 text-right font-mono">₹{u.hourlyRate}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => openModal(u)} className="text-primary hover:underline mr-3">Edit</button>
                    {u.id !== currentUser.id && (
                        <button onClick={() => handleDelete(u.id)} className="text-danger hover:underline">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card w-full max-w-md rounded-xl shadow-2xl border border-dark-border animate-scale-up">
            <div className="p-6 border-b border-dark-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-dark-text">{editingUser ? 'Edit User' : 'Add Team Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-dark-muted hover:text-danger">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-muted mb-1">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark-muted mb-1">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">System Role</label>
                    <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none">
                        <option value={UserRole.EMPLOYEE}>Employee</option>
                        <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                        <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value as Department)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none">
                        {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
              </div>
              
              <div className="bg-info/10 p-3 rounded text-xs text-info">
                  Tip: If a Video Editor also manages projects, assign System Role as <strong>Project Manager</strong> but keep Department as <strong>Video Editing</strong>.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Job Title</label>
                    <input type="text" placeholder="e.g. Senior Editor" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-dark-muted mb-1">Hourly Cost (INR)</label>
                    <input type="number" required value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg rounded transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded shadow-lg shadow-primary/20">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
