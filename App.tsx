
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardHome } from './components/DashboardHome';
import { ProjectBoard } from './components/ProjectBoard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TaskDetailPane } from './components/TaskDetailPane';
import { CalendarView } from './components/CalendarView';
import { Settings } from './components/Settings';
import { MasterPerformance } from './components/MasterPerformance';
import { ShootCalendar } from './components/ShootCalendar';
import { CreateProjectModal } from './components/CreateProjectModal';
import { UserManagement } from './components/UserManagement';
import { StorageService } from './services/storageService';
import { EmailService } from './services/emailService';
import { User, Task, TaskStatus, UserRole, TimeEntry, Project, Client } from './types';

// Simple Toast Component
const NotificationToast: React.FC<{ message: string, type?: 'success' | 'info' | 'error', onClose: () => void }> = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-in-right z-50 border ${
            type === 'success' ? 'bg-dark-card border-success/30 text-success' : 
            type === 'error' ? 'bg-dark-card border-danger/30 text-danger' :
            'bg-dark-card border-primary/30 text-primary'
        }`}>
            <span className="text-lg">{type === 'success' ? '🎉' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span className="font-bold">{message}</span>
        </div>
    );
};

const MainLayout: React.FC<{ currentUser: User; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | undefined>(undefined);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  
  const [projectFilter, setProjectFilter] = useState<string>('ALL');

  const refreshData = () => {
    setTasks(StorageService.getTasks());
    setUsers(StorageService.getUsers());
    setProjects(StorageService.getProjects());
    setClients(StorageService.getClients());
    setTimeEntries(StorageService.getTimeEntries());
    setActiveTimer(StorageService.getActiveTimer(currentUser.id));
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); 
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const getVisibleData = () => {
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROJECT_MANAGER) {
        return { visibleProjects: projects, visibleTasks: tasks };
    }
    const myTaskProjectIds = new Set(
        tasks.filter(t => t.assigneeId === currentUser.id).map(t => t.projectId)
    );
    const visibleProjects = projects.filter(p => myTaskProjectIds.has(p.id) || p.managerId === currentUser.id);
    const visibleProjectIds = new Set(visibleProjects.map(p => p.id));
    const visibleTasks = tasks.filter(t => visibleProjectIds.has(t.projectId));

    return { visibleProjects, visibleTasks };
  };

  const { visibleProjects, visibleTasks } = getVisibleData();

  const handleSaveTask = (newTask: Task) => {
    StorageService.saveTask(newTask);
    EmailService.notifyTaskAssignment(newTask, newTask.assigneeId); // Email Trigger
    refreshData();
    setToast({ message: 'Task Created & Email Sent', type: 'success' });
  };

  const handleUpdateTask = (updatedTask: Task) => {
      const oldTask = tasks.find(t => t.id === updatedTask.id);
      const oldStatus = oldTask ? oldTask.status : TaskStatus.TODO;

      // Handle completedDate
      if (updatedTask.status === TaskStatus.DONE && (!oldTask || oldTask.status !== TaskStatus.DONE)) {
          updatedTask.completedDate = new Date().toISOString();
      } else if (updatedTask.status !== TaskStatus.DONE && oldTask?.status === TaskStatus.DONE) {
          updatedTask.completedDate = undefined;
      }

      StorageService.saveTask(updatedTask);
      
      // Email Trigger on significant status change
      if (oldStatus !== updatedTask.status) {
          EmailService.notifyTaskUpdate(updatedTask, oldStatus, currentUser.name);
      }

      if (oldTask && oldTask.status !== TaskStatus.DONE && updatedTask.status === TaskStatus.DONE) {
          const points = 50; 
          const result = StorageService.addPoints(currentUser.id, points);
          if (result.newLevel) {
               setToast({ message: `LEVEL UP! You reached Level ${result.newLevel}!`, type: 'success' });
          } else {
               setToast({ message: `+${result.addedPoints} XP! Task Completed`, type: 'success' });
          }
      }

      if (updatedTask.status === TaskStatus.DONE) {
          const allTasks = StorageService.getTasks();
          const blockedTasks = allTasks.filter(t => t.dependencies.includes(updatedTask.id));
          
          blockedTasks.forEach(blockedTask => {
              const allDepsMet = blockedTask.dependencies.every(depId => {
                 if (depId === updatedTask.id) return true;
                 const dep = allTasks.find(t => t.id === depId);
                 return dep && dep.status === TaskStatus.DONE;
              });

              if (allDepsMet && blockedTask.status === TaskStatus.LOCKED) {
                  const unlockedTask = { ...blockedTask, status: TaskStatus.TODO };
                  StorageService.saveTask(unlockedTask);
                  // Optionally notify the owner of the unblocked task
                  EmailService.notifyTaskAssignment(unlockedTask, unlockedTask.assigneeId);
              }
          });
      }

      refreshData();
      if (selectedTask && selectedTask.id === updatedTask.id) {
          setSelectedTask(updatedTask);
      }
  };

  const handleToggleTimer = (taskId: string) => {
      if (activeTimer && activeTimer.taskId === taskId) {
          StorageService.stopTimer(currentUser.id);
      } else {
          StorageService.startTimer(taskId, currentUser.id);
      }
      refreshData();
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return (
                <DashboardHome 
                    user={currentUser} 
                    tasks={tasks} 
                    projects={projects} 
                    onCreateTask={() => setIsCreateModalOpen(true)}
                    onViewTasks={() => {
                         setProjectFilter('ALL');
                         setActiveTab('tasks');
                    }}
                />
            );
        case 'analytics':
        case 'finance':
            if (currentUser.role === UserRole.EMPLOYEE) return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            return <AnalyticsDashboard users={users} tasks={tasks} timeEntries={timeEntries} projects={projects} clients={clients} />;
        case 'projects':
            return (
                 <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {visibleProjects.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-dark-muted bg-dark-card rounded border border-dark-border border-dashed">
                                No projects assigned yet.
                            </div>
                        )}
                        {visibleProjects.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => {
                                    setProjectFilter(p.id);
                                    setActiveTab('tasks');
                                }}
                                className="bg-dark-card rounded-xl border border-dark-border p-6 shadow-sm hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden"
                            >
                                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                     <svg className="w-24 h-24 text-dark-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                                 </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#a096f5] text-white flex items-center justify-center text-xl font-bold shadow-md">
                                        {p.title.charAt(0)}
                                    </div>
                                    <div className="flex flex-col items-end">
                                         <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-1 ${p.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-dark-bg text-dark-muted'}`}>{p.status}</span>
                                         {p.jobCode && <span className="text-[10px] font-mono text-dark-muted">{p.jobCode}</span>}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-dark-text mb-2 group-hover:text-primary relative z-10">{p.title}</h3>
                                <p className="text-dark-muted text-sm mb-6 line-clamp-2 relative z-10">{p.description}</p>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs text-dark-muted mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round((visibleTasks.filter(t => t.projectId === p.id && t.status === 'DONE').length / Math.max(visibleTasks.filter(t => t.projectId === p.id).length, 1)) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-dark-bg h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: `${(visibleTasks.filter(t => t.projectId === p.id && t.status === 'DONE').length / Math.max(visibleTasks.filter(t => t.projectId === p.id).length, 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'tasks':
            return (
                <ProjectBoard 
                    tasks={visibleTasks} 
                    users={users} 
                    projects={visibleProjects}
                    onUpdateTask={handleUpdateTask}
                    onToggleTimer={handleToggleTimer}
                    activeTimerTaskId={activeTimer?.taskId}
                    onTaskClick={setSelectedTask}
                    initialFilter={projectFilter}
                />
            );
        case 'calendar':
            return <CalendarView tasks={visibleTasks} projects={visibleProjects} />;
        case 'master-performance':
             if (currentUser.role !== UserRole.ADMIN) return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
             return <MasterPerformance users={users} tasks={tasks} timeEntries={timeEntries} />;
        case 'team':
            if (currentUser.role === UserRole.EMPLOYEE) return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            return <UserManagement users={users} currentUser={currentUser} onRefresh={refreshData} />;
        case 'settings':
            if (currentUser.role === UserRole.EMPLOYEE) return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            return <Settings />;
        case 'shoot-calendar':
             return <ShootCalendar user={currentUser} users={users} projects={visibleProjects} />;
        default:
            return <div className="text-center text-dark-muted mt-20">Select a module from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg font-sans flex text-dark-text selection:bg-primary/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
            if (tab === 'tasks') setProjectFilter('ALL');
            setActiveTab(tab);
        }} 
        role={currentUser.role} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 ml-[260px] flex flex-col relative w-full">
        <Header 
            user={currentUser} 
            activeTimer={activeTimer} 
            onStopTimer={() => {
                StorageService.stopTimer(currentUser.id);
                refreshData();
            }} 
        />
        
        <main className="flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
             <div className="mb-6 flex justify-between items-end">
                 <div>
                     <h1 className="text-2xl font-bold text-dark-text capitalize">{activeTab === 'tasks' && projectFilter !== 'ALL' ? projects.find(p => p.id === projectFilter)?.title || activeTab : activeTab.replace('-', ' ')}</h1>
                     <p className="text-sm text-dark-muted">Manage your workflow and assets</p>
                 </div>
                 <div className="flex gap-2">
                     {activeTab === 'projects' && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROJECT_MANAGER) && (
                         <button 
                            onClick={() => setIsCreateProjectModalOpen(true)}
                            className="bg-dark-bg hover:bg-dark-border border border-dark-border text-dark-text px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 font-medium text-sm"
                         >
                             + New Project
                         </button>
                     )}
                     {activeTab === 'tasks' && (
                         <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2 font-medium text-sm hover:-translate-y-0.5"
                         >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            Create Task
                         </button>
                     )}
                 </div>
             </div>
            {renderContent()}
        </main>
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveTask}
        currentUser={currentUser}
        users={users}
        projects={visibleProjects}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSave={(project) => {
            StorageService.saveProject(project);
            refreshData();
            setToast({ message: 'Project Created', type: 'success' });
        }}
        currentUser={currentUser}
      />

      {selectedTask && (
          <TaskDetailPane 
             task={selectedTask}
             users={users}
             currentUser={currentUser}
             allTasks={tasks}
             onClose={() => setSelectedTask(null)}
             onUpdate={handleUpdateTask}
          />
      )}

      {toast && (
          <NotificationToast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
          />
      )}
    </div>
  );
};

// Extracted UserCard
interface UserCardProps {
    u: User;
    onClick: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ u, onClick }) => (
    <button 
        onClick={() => onClick(u)}
        className="bg-dark-card p-6 rounded-2xl border border-dark-border hover:border-primary shadow-md hover:shadow-xl transition-all group flex flex-col items-center text-center gap-4 relative overflow-hidden h-full w-full"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 group-hover:to-primary/10 transition-colors"></div>
        <img src={u.avatar} className="w-20 h-20 rounded-full border-4 border-dark-bg shadow-lg group-hover:scale-105 transition-transform" alt={u.name} />
        <div className="relative z-10">
            <h3 className="font-bold text-dark-text text-lg group-hover:text-primary transition-colors">{u.name}</h3>
            <p className="text-xs text-dark-muted font-medium uppercase tracking-wider mt-1">{u.jobTitle || u.role.replace('_', ' ')}</p>
        </div>
    </button>
);

const LoginScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
      // Ensure seed data is loaded before rendering
      if (!localStorage.getItem('foxhole_users_v3')) {
          StorageService.init();
      }
      // Slight delay to allow local storage write if first run
      setTimeout(() => {
          setUsers(StorageService.getUsers());
          setIsInitialized(true);
      }, 100);
  }, []);

  const handleLoginAttempt = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedUser) return;

      const isAdmin = selectedUser.role === UserRole.ADMIN;
      // Allow the generated users to login easily, but respect any password that might be set in UserManagement
      const requiredPassword = isAdmin ? 'ZinX1234!@' : `${selectedUser.name.split(' ')[0]}1234`;

      if (password === requiredPassword) {
          onLogin(selectedUser);
      } else {
          setError('Invalid credentials. Please try again.');
      }
  };

  if (!isInitialized) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-primary">Loading Foxhole...</div>;

  return (
    <div className="min-h-screen bg-dark-bg p-8 relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ea5455]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-12 mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-[#a096f5] text-white font-bold text-4xl mb-6 shadow-lg shadow-primary/40">F</div>
            <h1 className="text-4xl font-bold text-dark-text mb-3">Welcome to Foxhole</h1>
            <p className="text-dark-muted text-lg">Select your profile to continue</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
             {/* Unified Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {users.map(u => <UserCard key={u.id} u={u} onClick={setSelectedUser} />)}
             </div>
        </div>
      </div>

      {/* Password Modal */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-dark-card w-full max-w-sm p-6 rounded-xl border border-dark-border shadow-2xl animate-scale-up">
                  <div className="text-center mb-6">
                      <img src={selectedUser.avatar} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary" alt="" />
                      <h3 className="text-xl font-bold text-dark-text">Hello, {selectedUser.name.split(' ')[0]} 👋</h3>
                      <p className="text-sm text-dark-muted">Enter your password to access the workspace</p>
                  </div>

                  <form onSubmit={handleLoginAttempt} className="space-y-4">
                      <div>
                          <input 
                            type="password" 
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Password" 
                            autoFocus
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                          {error && <p className="text-xs text-danger mt-2">{error}</p>}
                      </div>
                      
                      <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => { setSelectedUser(null); setPassword(''); setError(''); }}
                            className="flex-1 py-2.5 text-sm font-medium text-dark-muted hover:bg-dark-bg rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="flex-1 py-2.5 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                          >
                              Login
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          currentUser ? (
            <MainLayout currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
          ) : (
            <LoginScreen onLogin={setCurrentUser} />
          )
        } />
      </Routes>
    </Router>
  );
}
