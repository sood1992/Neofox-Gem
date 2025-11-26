import React, { useState, useMemo } from 'react';
import { Candidate, JobPosition, CandidateAnalysis, CandidateStatus } from '../types';
import { StorageService } from '../services/storageService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsDashboardProps {
  candidates: Candidate[];
  positions: JobPosition[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ candidates, positions }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');

  const analyses = StorageService.getAnalyses();

  // Filter data by time range
  const getFilteredCandidates = () => {
    if (timeRange === 'all') return candidates;

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = subDays(new Date(), days);

    return candidates.filter(c => new Date(c.createdAt) >= cutoffDate);
  };

  const filteredCandidates = getFilteredCandidates();

  // Time to Hire Metrics
  const timeToHireData = useMemo(() => {
    const hiredCandidates = filteredCandidates.filter(c => c.status === CandidateStatus.HIRED);

    return hiredCandidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      days: differenceInDays(new Date(), new Date(c.createdAt)),
      position: c.appliedPosition
    }));
  }, [filteredCandidates]);

  const avgTimeToHire = timeToHireData.length > 0
    ? Math.round(timeToHireData.reduce((sum, c) => sum + c.days, 0) / timeToHireData.length)
    : 0;

  // Source Effectiveness
  const sourceData = useMemo(() => {
    const sourceMap = new Map<string, { total: number; hired: number }>();

    filteredCandidates.forEach(c => {
      const source = c.source || 'Direct Application';
      if (!sourceMap.has(source)) {
        sourceMap.set(source, { total: 0, hired: 0 });
      }
      const data = sourceMap.get(source)!;
      data.total++;
      if (c.status === CandidateStatus.HIRED) {
        data.hired++;
      }
    });

    return Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      total: data.total,
      hired: data.hired,
      conversionRate: data.total > 0 ? Math.round((data.hired / data.total) * 100) : 0
    }));
  }, [filteredCandidates]);

  // Pipeline Conversion Funnel
  const pipelineData = useMemo(() => {
    const stages = [
      { name: 'Applied', status: CandidateStatus.NEW, count: 0 },
      { name: 'Screening', status: CandidateStatus.SCREENING, count: 0 },
      { name: 'Under Review', status: CandidateStatus.UNDER_REVIEW, count: 0 },
      { name: 'Shortlisted', status: CandidateStatus.SHORTLISTED, count: 0 },
      { name: 'Interviewing', status: CandidateStatus.INTERVIEWING, count: 0 },
      { name: 'Offer', status: CandidateStatus.OFFER, count: 0 },
      { name: 'Hired', status: CandidateStatus.HIRED, count: 0 }
    ];

    filteredCandidates.forEach(c => {
      const stage = stages.find(s => s.status === c.status);
      if (stage) stage.count++;
    });

    return stages;
  }, [filteredCandidates]);

  // Quality Score Trends (by week)
  const qualityTrendData = useMemo(() => {
    const weeklyScores = new Map<string, { total: number; count: number }>();

    analyses.forEach(a => {
      const candidate = candidates.find(c => c.id === a.candidateId);
      if (candidate) {
        const weekStart = format(startOfMonth(new Date(a.analyzedAt)), 'MMM dd');
        if (!weeklyScores.has(weekStart)) {
          weeklyScores.set(weekStart, { total: 0, count: 0 });
        }
        const data = weeklyScores.get(weekStart)!;
        data.total += a.overallScore;
        data.count++;
      }
    });

    return Array.from(weeklyScores.entries()).map(([week, data]) => ({
      week,
      avgScore: Math.round(data.total / data.count)
    }));
  }, [analyses, candidates]);

  // Diversity Statistics
  const diversityData = useMemo(() => {
    // Note: In production, this would use actual demographic data
    // For demo purposes, using placeholder data
    return [
      { name: 'Male', value: 45, color: '#6366f1' },
      { name: 'Female', value: 42, color: '#ec4899' },
      { name: 'Non-Binary', value: 3, color: '#8b5cf6' },
      { name: 'Prefer not to say', value: 10, color: '#94a3b8' }
    ];
  }, []);

  // Position Performance
  const positionPerformanceData = useMemo(() => {
    const positionMap = new Map<string, {
      applied: number;
      shortlisted: number;
      hired: number;
      avgScore: number;
      scoreCount: number;
    }>();

    filteredCandidates.forEach(c => {
      const pos = c.appliedPosition || 'Not Specified';
      if (!positionMap.has(pos)) {
        positionMap.set(pos, { applied: 0, shortlisted: 0, hired: 0, avgScore: 0, scoreCount: 0 });
      }
      const data = positionMap.get(pos)!;
      data.applied++;
      if (c.status === CandidateStatus.SHORTLISTED || c.status === CandidateStatus.INTERVIEWING ||
          c.status === CandidateStatus.OFFER || c.status === CandidateStatus.HIRED) {
        data.shortlisted++;
      }
      if (c.status === CandidateStatus.HIRED) {
        data.hired++;
      }

      // Add score data
      const analysis = analyses.find(a => a.candidateId === c.id);
      if (analysis) {
        data.avgScore += analysis.overallScore;
        data.scoreCount++;
      }
    });

    return Array.from(positionMap.entries()).map(([position, data]) => ({
      position: position.length > 20 ? position.substring(0, 20) + '...' : position,
      applied: data.applied,
      shortlisted: data.shortlisted,
      hired: data.hired,
      conversionRate: data.applied > 0 ? Math.round((data.hired / data.applied) * 100) : 0,
      avgScore: data.scoreCount > 0 ? Math.round(data.avgScore / data.scoreCount) : 0
    }));
  }, [filteredCandidates, analyses]);

  // Cost per Hire (placeholder - in production would use actual cost data)
  const costPerHire = 3250;
  const totalRecruitmentCost = filteredCandidates.filter(c => c.status === CandidateStatus.HIRED).length * costPerHire;

  // Status Distribution
  const statusDistribution = useMemo(() => {
    const statusMap = new Map<CandidateStatus, number>();

    filteredCandidates.forEach(c => {
      statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1);
    });

    const colors: Record<CandidateStatus, string> = {
      [CandidateStatus.NEW]: '#3b82f6',
      [CandidateStatus.SCREENING]: '#eab308',
      [CandidateStatus.UNDER_REVIEW]: '#a855f7',
      [CandidateStatus.SHORTLISTED]: '#22c55e',
      [CandidateStatus.INTERVIEWING]: '#6366f1',
      [CandidateStatus.OFFER]: '#10b981',
      [CandidateStatus.HIRED]: '#059669',
      [CandidateStatus.REJECTED]: '#ef4444',
      [CandidateStatus.ON_HOLD]: '#6b7280'
    };

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: status.replace('_', ' '),
      value: count,
      color: colors[status]
    }));
  }, [filteredCandidates]);

  // Experience Level Distribution
  const experienceDistribution = useMemo(() => {
    const expMap = new Map<string, number>();

    filteredCandidates.forEach(c => {
      const level = c.experienceLevel || 'Not Specified';
      expMap.set(level, (expMap.get(level) || 0) + 1);
    });

    return Array.from(expMap.entries()).map(([level, count]) => ({
      level,
      count
    }));
  }, [filteredCandidates]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filters */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-text mb-2">Recruitment Analytics</h1>
            <p className="text-dark-muted">Comprehensive insights into your hiring process</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-dark-bg border border-dark-border text-dark-text rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>

            {/* Position Filter */}
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="bg-dark-bg border border-dark-border text-dark-text rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="ALL">All Positions</option>
              {positions.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            {/* Export Button */}
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-500">-12% vs prev period</span>
          </div>
          <h3 className="text-3xl font-bold text-dark-text mb-1">{avgTimeToHire} days</h3>
          <p className="text-sm text-dark-muted">Avg Time to Hire</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-dark-muted">per hire</span>
          </div>
          <h3 className="text-3xl font-bold text-dark-text mb-1">${costPerHire.toLocaleString()}</h3>
          <p className="text-sm text-dark-muted">Cost per Hire</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-500">+8%</span>
          </div>
          <h3 className="text-3xl font-bold text-dark-text mb-1">
            {filteredCandidates.length > 0
              ? Math.round((filteredCandidates.filter(c => c.status === CandidateStatus.HIRED).length / filteredCandidates.length) * 100)
              : 0}%
          </h3>
          <p className="text-sm text-dark-muted">Conversion Rate</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-500">+5 pts</span>
          </div>
          <h3 className="text-3xl font-bold text-dark-text mb-1">
            {analyses.length > 0
              ? Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length)
              : 0}
          </h3>
          <p className="text-sm text-dark-muted">Avg Quality Score</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Conversion Funnel */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Recruitment Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Effectiveness */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Source Effectiveness</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="source" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="total" fill="#6366f1" name="Total Applicants" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hired" fill="#10b981" name="Hired" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Position Performance */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Position Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positionPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="position" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="applied" fill="#3b82f6" name="Applied" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortlisted" fill="#8b5cf6" name="Shortlisted" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hired" fill="#10b981" name="Hired" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Score Trends */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Quality Score Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={qualityTrendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Area type="monotone" dataKey="avgScore" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Candidate Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Diversity Statistics */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-6">Diversity Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diversityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {diversityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-dark-muted mt-4 text-center">
            Note: Demo data. Production will use actual demographic information.
          </p>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Sources */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-4">Top Performing Sources</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-dark-text">Source</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-dark-text">Applied</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-dark-text">Hired</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-dark-text">Rate</th>
                </tr>
              </thead>
              <tbody>
                {sourceData
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .slice(0, 5)
                  .map((source, idx) => (
                    <tr key={idx} className="border-b border-dark-border/50">
                      <td className="py-3 px-2 text-sm text-dark-text">{source.source}</td>
                      <td className="py-3 px-2 text-sm text-dark-muted text-center">{source.total}</td>
                      <td className="py-3 px-2 text-sm text-success text-center font-medium">{source.hired}</td>
                      <td className="py-3 px-2 text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          source.conversionRate >= 20 ? 'bg-green-500/10 text-green-500' :
                          source.conversionRate >= 10 ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {source.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Experience Level Breakdown */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-dark-text mb-4">Experience Level Distribution</h2>
          <div className="space-y-4">
            {experienceDistribution.map((exp, idx) => {
              const percentage = (exp.count / filteredCandidates.length) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-text font-medium">{exp.level}</span>
                    <span className="text-sm text-dark-muted">{exp.count} candidates ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-dark-text mb-2">Key Insights & Recommendations</h3>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Your average time-to-hire of <strong className="text-dark-text">{avgTimeToHire} days</strong> is
                  {avgTimeToHire < 30 ? ' excellent compared to industry average of 36 days.' : ' higher than the industry average. Consider streamlining your interview process.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  {sourceData.length > 0 && (
                    <>
                      <strong className="text-dark-text">{sourceData[0].source}</strong> is your best performing source with a {sourceData[0].conversionRate}% conversion rate. Focus more recruitment efforts here.
                    </>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Your candidate quality score averaging <strong className="text-dark-text">
                    {analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length) : 0}
                  </strong> indicates {analyses.length > 0 && analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length >= 75 ? 'strong' : 'room for improvement in'} candidate sourcing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Consider implementing skills assessments earlier in the funnel to improve conversion rates at the shortlisting stage.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
