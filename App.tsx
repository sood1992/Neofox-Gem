import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardHome } from './components/DashboardHome';
import { CandidatesList } from './components/CandidatesList';
import { CandidateDetailView } from './components/CandidateDetailView';
import { BulkUpload } from './components/BulkUpload';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ComparisonTool } from './components/ComparisonTool';
import { PositionsManagement } from './components/PositionsManagement';
import { PipelineView } from './components/PipelineView';
import { StorageService } from './services/storageService';
import { User, Candidate, JobPosition, UserRole } from './types';

// Notification Toast Component
const NotificationToast: React.FC<{ message: string, type?: 'success' | 'info' | 'error', onClose: () => void }> = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  const refreshData = () => {
    setCandidates(StorageService.getCandidates());
    setPositions(StorageService.getPositions());
    setUsers(StorageService.getUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return (
                <DashboardHome
                    candidates={candidates}
                    positions={positions}
                    user={currentUser}
                    onViewCandidates={() => setActiveTab('candidates')}
                    onAddCandidate={() => setActiveTab('upload')}
                />
            );
        case 'candidates':
            return (
                <CandidatesList
                    candidates={candidates}
                    positions={positions}
                    onCandidateClick={setSelectedCandidate}
                    onCandidateUpdate={refreshData}
                />
            );
        case 'positions':
            return (
                <PositionsManagement
                    positions={positions}
                    onPositionUpdate={refreshData}
                />
            );
        case 'pipeline':
            return (
                <PipelineView
                    candidates={candidates}
                    positions={positions}
                    onCandidateClick={setSelectedCandidate}
                    onCandidateUpdate={refreshData}
                />
            );
        case 'upload':
            return (
                <BulkUpload
                    currentUser={currentUser}
                    positions={positions}
                    onUploadComplete={() => {
                        refreshData();
                        setToast({ message: 'Candidates uploaded successfully!', type: 'success' });
                    }}
                />
            );
        case 'compare':
            setShowComparison(true);
            setActiveTab('candidates');
            return null;
        case 'analytics':
            if (currentUser.role === UserRole.EMPLOYEE) {
                return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            }
            return (
                <AnalyticsDashboard
                    candidates={candidates}
                    positions={positions}
                />
            );
        case 'bulk-analyze':
            if (currentUser.role === UserRole.EMPLOYEE) {
                return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            }
            // Redirect to candidates page for bulk analysis
            setActiveTab('candidates');
            return null;
        case 'team':
            if (currentUser.role === UserRole.EMPLOYEE) {
                return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            }
            return (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-text mb-2">Team Members</h1>
                        <p className="text-dark-muted">Manage HR team members and their permissions</p>
                    </div>
                    <div className="bg-dark-card rounded-xl border border-dark-border p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-dark-text mb-2">Team Management</h3>
                        <p className="text-sm text-dark-muted mb-4">
                            Manage your HR team members, roles, and permissions
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            {users.map(user => (
                                <div key={user.id} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                                    <img src={user.avatar} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary" alt={user.name} />
                                    <h4 className="font-semibold text-dark-text text-center">{user.name}</h4>
                                    <p className="text-xs text-dark-muted text-center mt-1">{user.role.replace('_', ' ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case 'settings':
            if (currentUser.role !== UserRole.ADMIN) {
                return <div className="p-8 text-center text-dark-muted">Access Restricted</div>;
            }
            return (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-text mb-2">System Settings</h1>
                        <p className="text-dark-muted">Configure system preferences and integrations</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                            <h3 className="text-lg font-bold text-dark-text mb-4">AI Analysis Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-text mb-2">Analysis Weights</label>
                                    <p className="text-xs text-dark-muted mb-2">Configure scoring weights for candidate evaluation</p>
                                    <div className="space-y-2 text-sm text-dark-muted">
                                        <div className="flex justify-between"><span>Technical Skills:</span><span>25%</span></div>
                                        <div className="flex justify-between"><span>Experience:</span><span>20%</span></div>
                                        <div className="flex justify-between"><span>Education:</span><span>10%</span></div>
                                        <div className="flex justify-between"><span>Cultural Fit:</span><span>15%</span></div>
                                        <div className="flex justify-between"><span>Other Parameters:</span><span>30%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                            <h3 className="text-lg font-bold text-dark-text mb-4">Email Notifications</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                    <span className="text-sm text-dark-text">Notify on new applications</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                    <span className="text-sm text-dark-text">Daily summary reports</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4" />
                                    <span className="text-sm text-dark-text">Weekly analytics digest</span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                            <h3 className="text-lg font-bold text-dark-text mb-4">Integrations</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <span className="text-blue-500 font-bold">Li</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-dark-text">LinkedIn</p>
                                            <p className="text-xs text-dark-muted">Import profiles</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-500 font-medium">Connected</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <span className="text-purple-500 font-bold">Sl</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-dark-text">Slack</p>
                                            <p className="text-xs text-dark-muted">Team notifications</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-primary font-medium hover:underline">Connect</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                            <h3 className="text-lg font-bold text-dark-text mb-4">Data & Privacy</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-dark-text mb-2">Storage</p>
                                    <p className="text-xs text-dark-muted">Using LocalStorage (Demo Mode)</p>
                                    <p className="text-xs text-warning mt-1">⚠️ For production, configure PostgreSQL database</p>
                                </div>
                                <button className="w-full bg-danger/10 hover:bg-danger/20 text-danger px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="text-center text-dark-muted mt-20">Select a module from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg font-sans flex text-dark-text selection:bg-primary/30">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={currentUser.role}
        onLogout={onLogout}
      />

      <div className="flex-1 ml-[260px] flex flex-col relative w-full">
        <Header
            user={currentUser}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
        />

        <main className="flex-1 px-8 pb-8 pt-4 overflow-y-auto custom-scrollbar">
            {renderContent()}
        </main>
      </div>

      {/* Candidate Detail View Modal */}
      {selectedCandidate && (
          <CandidateDetailView
             candidate={selectedCandidate}
             positions={positions}
             currentUser={currentUser}
             onClose={() => setSelectedCandidate(null)}
             onUpdate={(updatedCandidate) => {
                 StorageService.updateCandidate(updatedCandidate.id, updatedCandidate);
                 refreshData();
                 setSelectedCandidate(updatedCandidate);
                 setToast({ message: 'Candidate updated successfully', type: 'success' });
             }}
          />
      )}

      {/* Comparison Tool Modal */}
      {showComparison && (
          <ComparisonTool
              candidates={candidates}
              positions={positions}
              onClose={() => setShowComparison(false)}
          />
      )}

      {/* Toast Notifications */}
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

// User Card Component
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
      if (!localStorage.getItem('neofox_users_v1')) {
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
      // Simple password for demo: admin users use 'admin1234', others use 'user1234'
      const requiredPassword = isAdmin ? 'admin1234' : 'user1234';

      if (password === requiredPassword) {
          onLogin(selectedUser);
      } else {
          setError('Invalid credentials. Please try again.');
      }
  };

  if (!isInitialized) {
      return (
          <div className="min-h-screen bg-dark-bg flex items-center justify-center text-primary">
              <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-[#a096f5] text-white font-bold text-4xl mb-4 shadow-lg shadow-primary/40">
                      N
                  </div>
                  <p className="text-lg">Loading Neofox HR...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-8 relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ea5455]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-12 mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-[#a096f5] text-white font-bold text-4xl mb-6 shadow-lg shadow-primary/40">
                N
            </div>
            <h1 className="text-4xl font-bold text-dark-text mb-3">Welcome to Neofox HR</h1>
            <p className="text-dark-muted text-lg">AI-Powered Candidate Screening Platform</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {users.map(u => <UserCard key={u.id} u={u} onClick={setSelectedUser} />)}
             </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center text-sm text-dark-muted max-w-2xl mx-auto">
            <p className="font-medium text-dark-text mb-2">Demo Credentials</p>
            <p>Admin: <span className="font-mono bg-dark-bg px-2 py-0.5 rounded">admin1234</span> | Others: <span className="font-mono bg-dark-bg px-2 py-0.5 rounded">user1234</span></p>
        </div>
      </div>

      {/* Password Modal */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-dark-card w-full max-w-sm p-6 rounded-xl border border-dark-border shadow-2xl animate-scale-up">
                  <div className="text-center mb-6">
                      <img src={selectedUser.avatar} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary" alt="" />
                      <h3 className="text-xl font-bold text-dark-text">Hello, {selectedUser.name.split(' ')[0]} 👋</h3>
                      <p className="text-sm text-dark-muted">Enter your password to access the HR platform</p>
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
