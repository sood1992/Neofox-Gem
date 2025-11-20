
import React from 'react';
import { User, Task, TimeEntry, Project, Client } from '../types';

interface AnalyticsDashboardProps {
  users: User[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  projects?: Project[];
  clients?: Client[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ users, tasks, timeEntries, projects = [], clients = [] }) => {
  
  const totalBillableSeconds = timeEntries.filter(te => te.isBillable).reduce((acc, te) => acc + te.durationSeconds, 0);
  const totalHours = timeEntries.reduce((acc, te) => acc + te.durationSeconds, 0) / 3600;
  
  const utilizationRate = totalHours > 0 ? (totalBillableSeconds / 3600) / totalHours * 100 : 0;
  
  // INR Rate for estimates
  const avgRate = 800; 
  const projectFinancials = projects.map(p => {
      const pTasks = tasks.filter(t => t.projectId === p.id);
      const pHours = pTasks.reduce((acc, t) => acc + t.timeSpentSeconds, 0) / 3600;
      const cost = pHours * avgRate + (p.expenses || 0);
      const profit = (p.budget || 0) - cost;
      const margin = p.budget ? (profit / p.budget) * 100 : 0;
      return { project: p, profit, margin, cost };
  }).sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <h2 className="text-xl font-bold text-dark-text">Productivity & Financial Analytics</h2>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-dark-muted text-xs font-bold uppercase tracking-wider mb-2">Billable Utilization</div>
              <div className="text-3xl font-bold text-dark-text mb-1">{utilizationRate.toFixed(1)}%</div>
              <div className="w-full bg-dark-bg h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${utilizationRate}%` }}></div>
              </div>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-dark-muted text-xs font-bold uppercase tracking-wider mb-2">Total Profit (Est)</div>
              <div className="text-3xl font-bold text-success mb-1">₹{(projectFinancials.reduce((acc, p) => acc + p.profit, 0)/100000).toFixed(2)} L</div>
              <div className="text-xs text-success">+12% vs last month</div>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-dark-muted text-xs font-bold uppercase tracking-wider mb-2">Total Hours Tracked</div>
              <div className="text-3xl font-bold text-info mb-1">{totalHours.toFixed(1)}h</div>
              <div className="text-xs text-dark-muted">Across {projects.length} projects</div>
          </div>
           <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-dark-muted text-xs font-bold uppercase tracking-wider mb-2">Active Clients</div>
              <div className="text-3xl font-bold text-warning mb-1">{clients.length}</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Profitability Table */}
          <div className="bg-dark-card rounded-xl border border-dark-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-dark-border">
                  <h3 className="font-bold text-dark-text">Project Profitability</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead>
                          <tr className="text-dark-muted border-b border-dark-border">
                              <th className="p-4 font-medium">Project</th>
                              <th className="p-4 font-medium">Budget</th>
                              <th className="p-4 font-medium">Cost</th>
                              <th className="p-4 font-medium">Profit</th>
                              <th className="p-4 font-medium">Margin</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                          {projectFinancials.map((item, idx) => (
                              <tr key={idx} className="hover:bg-dark-bg/30 transition-colors">
                                  <td className="p-4 font-medium text-dark-text">{item.project.title}</td>
                                  <td className="p-4 text-dark-text">₹{item.project.budget?.toLocaleString('en-IN')}</td>
                                  <td className="p-4 text-danger">₹{item.cost.toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                                  <td className="p-4 text-success font-bold">₹{item.profit.toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.margin > 20 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                          {item.margin.toFixed(1)}%
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Team Efficiency */}
          <div className="bg-dark-card rounded-xl border border-dark-border shadow-sm p-6">
              <h3 className="font-bold text-dark-text mb-6">Team Efficiency</h3>
              <div className="space-y-6">
                  {users.slice(0, 5).map(u => {
                      const uTasks = tasks.filter(t => t.assigneeId === u.id && t.status === 'DONE');
                      const onTime = uTasks.filter(t => new Date(t.dueDate) >= new Date()).length; // Mock logic
                      const rate = uTasks.length > 0 ? (onTime / uTasks.length) * 100 : 100;
                      
                      return (
                          <div key={u.id} className="flex items-center gap-4">
                              <img src={u.avatar} className="w-10 h-10 rounded-full border border-dark-border" alt=""/>
                              <div className="flex-1">
                                  <div className="flex justify-between mb-1">
                                      <span className="font-medium text-dark-text">{u.name}</span>
                                      <span className="text-xs text-dark-muted">{rate.toFixed(0)}% On-time</span>
                                  </div>
                                  <div className="w-full bg-dark-bg h-2 rounded-full overflow-hidden">
                                      <div className="bg-info h-full rounded-full" style={{ width: `${rate}%` }}></div>
                                  </div>
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};
