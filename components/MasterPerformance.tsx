
import React from 'react';
import { User, Task, TimeEntry, UserRole, TaskStatus } from '../types';

interface MasterPerformanceProps {
  users: User[];
  tasks: Task[];
  timeEntries: TimeEntry[];
}

interface EmployeePerformance {
  user: User;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  hoursLogged: number;
  avgTimePerTask: number;
  costToCompany: number;
  estimatedValueGenerated: number; // Billable Hours * Rate * 3 (Agency Markup)
  roi: number;
  onTimeRate: number;
  verdict: {
    status: 'PROMOTE' | 'RAISE' | 'RETAIN' | 'MONITOR' | 'REVIEW';
    color: string;
    message: string;
  };
}

export const MasterPerformance: React.FC<MasterPerformanceProps> = ({ users, tasks, timeEntries }) => {
  
  const calculatePerformance = (user: User): EmployeePerformance => {
      const userTasks = tasks.filter(t => t.assigneeId === user.id);
      const completedTasks = userTasks.filter(t => t.status === TaskStatus.DONE);
      
      const userEntries = timeEntries.filter(te => te.userId === user.id);
      const totalSeconds = userEntries.reduce((acc, te) => acc + te.durationSeconds, 0);
      const hoursLogged = totalSeconds / 3600;
      
      // Avg Time Calculation with bottleneck logic
      const avgTimePerTask = completedTasks.length > 0 
          ? hoursLogged / completedTasks.length 
          : 0;
      
      const billableSeconds = userEntries.filter(te => te.isBillable).reduce((acc, te) => acc + te.durationSeconds, 0);
      const billableHours = billableSeconds / 3600;

      // Financials (INR)
      // Use hourlyRate from user profile (Cost to Company)
      const hourlyCost = user.hourlyRate || 500; 
      const costToCompany = hoursLogged * hourlyCost;
      
      // Agency Model: Revenue is typically 3x the talent cost for billable work
      const AGENCY_MARKUP = 3.0;
      const estimatedValueGenerated = billableHours * hourlyCost * AGENCY_MARKUP;
      
      const roi = costToCompany > 0 ? (estimatedValueGenerated / costToCompany) : 0;

      // Reliability
      const onTimeTasks = completedTasks.filter(t => new Date(t.completedDate || new Date().toISOString()) <= new Date(t.dueDate)).length;
      const onTimeRate = completedTasks.length > 0 ? (onTimeTasks / completedTasks.length) * 100 : 100;
      const completionRate = userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0;

      // Logic for Verdict
      let verdict = { status: 'RETAIN', color: 'bg-info/10 text-info', message: 'Meeting expectations' } as any;

      if (roi > 4 && onTimeRate > 90) {
          verdict = { status: 'PROMOTE', color: 'bg-primary/10 text-primary', message: 'Exceptional Value & Reliability' };
      } else if (roi > 2.5 && onTimeRate > 85) {
          verdict = { status: 'RAISE', color: 'bg-success/10 text-success', message: 'Justifies higher salary' };
      } else if (roi < 1.5 && hoursLogged > 20) {
           verdict = { status: 'REVIEW', color: 'bg-danger/10 text-danger', message: 'Cost exceeds value' };
      } else if (completionRate < 50 && userTasks.length > 5) {
           verdict = { status: 'MONITOR', color: 'bg-warning/10 text-warning', message: 'Low completion rate' };
      }

      return {
          user,
          tasksAssigned: userTasks.length,
          tasksCompleted: completedTasks.length,
          completionRate,
          hoursLogged,
          avgTimePerTask,
          costToCompany,
          estimatedValueGenerated,
          roi,
          onTimeRate,
          verdict
      };
  };

  const employees = users
    // Filter out strict Admins. PMs are included because they often do billable work.
    .filter(u => u.role !== UserRole.ADMIN) 
    .map(u => calculatePerformance(u))
    .sort((a, b) => b.roi - a.roi); // Sort by highest ROI

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-dark-card rounded-xl border border-dark-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-lg font-bold text-dark-text">Workforce ROI Analysis</h2>
                <p className="text-sm text-dark-muted">
                    Analysis based on <strong>3.0x Agency Markup</strong> on billable hours vs. Employee Hourly Rate (INR).
                </p>
            </div>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded">ROI {'>'} 2.5x = Good</span>
                <span className="px-3 py-1 bg-danger/10 text-danger text-xs font-bold rounded">ROI {'<'} 1.5x = Risk</span>
            </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="text-xs font-bold text-dark-muted uppercase tracking-wider border-b border-dark-border">
                          <th className="p-4 pl-6">Employee</th>
                          <th className="p-4">Productivity</th>
                          <th className="p-4 text-center">Avg Time/Task</th>
                          <th className="p-4 text-right">Cost (Est.)</th>
                          <th className="p-4 text-right">Value Generated</th>
                          <th className="p-4 text-center">ROI Multiplier</th>
                          <th className="p-4 text-center">Admin Verdict</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border text-sm">
                      {employees.map((emp) => (
                          <tr key={emp.user.id} className="hover:bg-dark-bg/30 transition-colors group">
                              <td className="p-4 pl-6">
                                  <div className="flex items-center gap-3">
                                      <img src={emp.user.avatar} className="w-10 h-10 rounded-full border border-dark-border" alt="" />
                                      <div>
                                          <div className="font-bold text-dark-text">{emp.user.name}</div>
                                          <div className="text-xs text-dark-muted">{emp.user.jobTitle || emp.user.role.replace('_', ' ')}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-4">
                                  <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                          <span className="text-dark-muted">Completion</span>
                                          <span className="font-bold text-dark-text">{emp.completionRate.toFixed(0)}%</span>
                                      </div>
                                      <div className="w-24 bg-dark-bg h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-primary h-full" style={{ width: `${emp.completionRate}%` }}></div>
                                      </div>
                                      <div className="text-xs text-dark-muted mt-1">
                                          {emp.tasksCompleted} / {emp.tasksAssigned} Tasks
                                      </div>
                                  </div>
                              </td>
                              <td className="p-4 text-center">
                                  <div className="flex flex-col items-center">
                                      <span className={`font-mono font-medium ${emp.avgTimePerTask > 15 ? 'text-danger' : 'text-dark-text'}`}>
                                          {emp.avgTimePerTask.toFixed(1)}h
                                      </span>
                                      {emp.avgTimePerTask > 15 && <span className="text-[10px] text-danger uppercase font-bold">Bottleneck</span>}
                                  </div>
                              </td>
                              <td className="p-4 text-right font-mono text-dark-muted">
                                  ₹{emp.costToCompany.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                              <td className="p-4 text-right font-mono text-success font-medium">
                                  ₹{emp.estimatedValueGenerated.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                              <td className="p-4 text-center">
                                  <div className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${emp.roi >= 3 ? 'bg-success/10 text-success' : emp.roi < 1.5 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                                      {emp.roi.toFixed(2)}x
                                  </div>
                              </td>
                              <td className="p-4 text-center">
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-transparent group-hover:border-dark-border transition-colors ${emp.verdict.color}`}>
                                      {emp.verdict.status}
                                  </div>
                                  <div className="text-[10px] text-dark-muted mt-1">{emp.verdict.message}</div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
