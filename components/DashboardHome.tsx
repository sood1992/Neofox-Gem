
import React from 'react';
import { User, Task, Project, UserRole, TaskStatus } from '../types';
import { StorageService } from '../services/storageService';

interface DashboardHomeProps {
  user: User;
  tasks: Task[];
  projects: Project[];
  onCreateTask?: () => void;
  onViewTasks?: () => void; // Added prop
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ user, tasks, projects, onCreateTask, onViewTasks }) => {
  
  const isCreative = user.role === UserRole.EMPLOYEE;
  const isAdmin = user.role === UserRole.ADMIN;
  const badges = StorageService.getBadges();

  // Metrics
  const myTasks = tasks.filter(t => t.assigneeId === user.id);
  const pendingTasks = myTasks.filter(t => t.status !== TaskStatus.DONE);
  const completedTasksCount = myTasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalRevenue = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalExpenses = projects.reduce((acc, p) => acc + (p.expenses || 0), 0);
  
  // Creative View
  if (isCreative) {
      const currentLevel = user.level || 1;
      const currentXP = user.xp || 0;
      const nextLevelXP = currentLevel * 500;
      const xpProgress = (currentXP % 500) / 500 * 100;
      const myBadges = badges.filter(b => user.badges?.includes(b.id));

      return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Welcome Banner */}
                <div className="md:col-span-2 bg-dark-card rounded-xl shadow-sm p-8 relative overflow-hidden border border-dark-border">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-primary mb-2">Welcome back, {user.name.split(' ')[0]}! 🚀</h2>
                        <p className="text-dark-muted text-sm mb-6 max-w-md">You have <strong>{pendingTasks.length} tasks</strong> pending today. Your efficiency score is up 12% this week!</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={onViewTasks}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
                            >
                                View My Tasks
                            </button>
                            <button 
                                onClick={onCreateTask}
                                className="bg-dark-bg hover:bg-dark-border text-dark-text px-6 py-2.5 rounded-lg text-sm font-medium transition-all border border-dark-border"
                            >
                                + Create Task
                            </button>
                        </div>
                    </div>
                    {/* Decorative shapes */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>

                {/* My Level (Gamification) */}
                <div className="bg-dark-card rounded-xl shadow-sm p-6 border border-dark-border flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl">🏆</span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-dark-muted font-medium text-sm uppercase tracking-wider">My Level</h3>
                            <span className="bg-warning/10 text-warning px-2 py-1 rounded text-xs font-bold">Lvl {currentLevel}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold text-dark-text">{currentXP}</span>
                            <span className="text-xs text-dark-muted">/ {nextLevelXP} XP</span>
                        </div>
                        <div className="w-full bg-dark-bg h-2 rounded-full mt-3 overflow-hidden border border-dark-border/50">
                            <div className="bg-gradient-to-r from-warning to-orange-500 h-full rounded-full" style={{ width: `${xpProgress}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-dark-border">
                        <p className="text-[10px] text-dark-muted uppercase font-bold mb-2">Recent Badges</p>
                        <div className="flex gap-2">
                            {myBadges.length > 0 ? myBadges.slice(0, 3).map(b => (
                                <div key={b.id} className="w-8 h-8 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center text-lg" title={b.name}>
                                    {b.icon}
                                </div>
                            )) : <span className="text-xs text-dark-muted italic">No badges yet</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Tasks List */}
            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden shadow-sm">
                <div className="p-6 border-b border-dark-border flex justify-between items-center">
                    <h3 className="font-bold text-lg text-dark-text">Review Queue</h3>
                </div>
                <div className="divide-y divide-dark-border">
                    {pendingTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="p-4 flex items-center justify-between hover:bg-dark-bg/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-danger' : 'bg-warning'}`}></div>
                                <div>
                                    <h4 className="text-sm font-semibold text-dark-text">{task.title}</h4>
                                    <span className="text-xs text-dark-muted">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <span className="text-xs px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-dark-muted font-medium">
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && <div className="p-8 text-center text-dark-muted">No pending tasks. Great job!</div>}
                </div>
            </div>
        </div>
      );
  }

  // Admin/Manager View
  const users = StorageService.getUsers();
  const leaderboard = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={`₹${(totalRevenue/100000).toFixed(1)} L`} trend="+18%" trendUp={true} icon="dollar" />
        <StatsCard title="Expenses" value={`₹${(totalExpenses/1000).toFixed(1)} K`} trend="-5%" trendUp={true} icon="chart" />
        <StatsCard title="Active Projects" value={projects.filter(p => p.status === 'ACTIVE').length.toString()} trend="+2" trendUp={true} icon="briefcase" />
        <StatsCard title="Pending Tasks" value={tasks.filter(t => t.status !== 'DONE').length.toString()} trend="-12%" trendUp={false} icon="list" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Leaderboard (New Feature) */}
         <div className="bg-dark-card rounded-xl border border-dark-border p-6 shadow-sm">
             <h3 className="font-bold text-dark-text mb-6 flex items-center gap-2">
                 <span>🏆</span> Team Leaderboard
             </h3>
             <div className="space-y-4">
                 {leaderboard.map((u, idx) => (
                     <div key={u.id} className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-dark-bg text-dark-muted'}`}>
                             {idx + 1}
                         </div>
                         <img src={u.avatar} className="w-8 h-8 rounded-full border border-dark-border" alt=""/>
                         <div className="flex-1">
                             <div className="text-sm font-medium text-dark-text truncate">{u.name}</div>
                             <div className="text-[10px] text-dark-muted">Level {u.level || 1}</div>
                         </div>
                         <div className="text-sm font-bold text-primary">{u.xp || 0} XP</div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Project Health */}
         <div className="lg:col-span-2 bg-dark-card rounded-xl border border-dark-border p-6 shadow-sm">
             <h3 className="font-bold text-dark-text mb-6">Project Status</h3>
             <div className="space-y-6">
                 {projects.slice(0, 4).map(p => {
                     const pTasks = tasks.filter(t => t.projectId === p.id);
                     const pDone = pTasks.filter(t => t.status === 'DONE').length;
                     const progress = pTasks.length > 0 ? (pDone / pTasks.length) * 100 : 0;
                     return (
                         <div key={p.id}>
                             <div className="flex justify-between mb-2">
                                 <span className="text-sm font-medium text-dark-text truncate max-w-[150px]">{p.title}</span>
                                 <span className="text-xs text-dark-muted">{Math.round(progress)}%</span>
                             </div>
                             <div className="w-full bg-dark-bg h-2 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                             </div>
                         </div>
                     );
                 })}
             </div>
         </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, trend, trendUp, icon }: any) => (
    <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-sm hover:border-primary/30 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-dark-muted text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-dark-text mt-1 group-hover:text-primary transition-colors">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${trendUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                <span className="text-xs font-bold">{trend}</span>
            </div>
        </div>
    </div>
);
