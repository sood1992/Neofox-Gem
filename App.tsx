import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { StorageService } from './services/storageService';
import { User, Task, TaskStatus, UserRole } from './types';

const Dashboard: React.FC<{ currentUser: User; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    setTasks(StorageService.getTasks());
    setUsers(StorageService.getUsers());
  }, []);

  const handleSaveTask = (newTask: Task) => {
    StorageService.saveTask(newTask);
    setTasks(StorageService.getTasks());
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status };
      StorageService.saveTask(updatedTask);
      setTasks(StorageService.getTasks());
    }
  };

  // Permission check for creating tasks (PM and Admin only)
  const canCreateTask = [UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(currentUser.role);

  // Filter tasks based on role and status
  const filteredTasks = tasks.filter(t => {
    const statusMatch = filterStatus === 'ALL' || t.status === filterStatus;
    // Employees only see their tasks, PM/Admin see all
    const roleMatch = currentUser.role === UserRole.EMPLOYEE 
      ? t.assigneeId === currentUser.id 
      : true;
    return statusMatch && roleMatch;
  });

  return (
    <div className="min-h-screen bg-neofox-900 pb-20">
      <Navbar user={currentUser} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {currentUser.role === UserRole.EMPLOYEE ? 'My Assignments' : 'Team Overview'}
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {currentUser.name.split(' ')[0]}. You have {tasks.filter(t => t.assigneeId === currentUser.id && t.status !== TaskStatus.DONE).length} active tasks.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-neofox-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-neofox-500"
            >
              <option value="ALL">All Status</option>
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.REVIEW}>Review</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>
            
            {canCreateTask && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 md:flex-none bg-neofox-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-neofox-500/20 flex items-center justify-center gap-2"
              >
                <span>+</span> New Task
              </button>
            )}
          </div>
        </div>

        {/* Kanban-lite Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                assignee={users.find(u => u.id === task.assigneeId)}
                onStatusChange={handleStatusChange}
                onEdit={(t) => console.log("Edit feature pending", t)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              <p className="text-lg">No tasks found.</p>
              <p className="text-sm">Time to create some magic!</p>
            </div>
          )}
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        currentUser={currentUser}
        users={users}
      />
    </div>
  );
};

const LoginScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const users = StorageService.getUsers();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neofox-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neofox-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neofox-accent/10 rounded-full blur-[120px]"></div>

      <div className="bg-neofox-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Neofox<span className="text-neofox-500">Nexus</span></h1>
          <p className="text-slate-400 text-sm">Select a profile to simulate login</p>
        </div>

        <div className="space-y-3">
          {users.map(u => (
            <button 
              key={u.id}
              onClick={() => onLogin(u)}
              className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-700 hover:border-neofox-500 hover:bg-slate-700/50 transition-all group text-left"
            >
              <img src={u.avatar} className="w-10 h-10 rounded-full" alt={u.name} />
              <div>
                <div className="font-medium text-white group-hover:text-neofox-500 transition-colors">{u.name}</div>
                <div className="text-xs text-slate-400">{u.role} • {u.department}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500">
            Note: This demo uses LocalStorage. Data persists in your browser only.<br/>
            Host on cPanel by uploading the built /dist folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    StorageService.init();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          currentUser ? (
            <Dashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
          ) : (
            <LoginScreen onLogin={setCurrentUser} />
          )
        } />
      </Routes>
    </Router>
  );
}