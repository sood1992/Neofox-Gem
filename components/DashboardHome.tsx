import React from 'react';
import { User, Candidate, JobPosition, CandidateStatus } from '../types';
import { StorageService } from '../services/storageService';

interface DashboardHomeProps {
  candidates: Candidate[];
  positions: JobPosition[];
  user: User;
  onViewCandidates: () => void;
  onAddCandidate: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ candidates, positions, user, onViewCandidates, onAddCandidate }) => {

  // Calculate metrics
  const totalCandidates = candidates.length;
  const newCandidates = candidates.filter(c => c.status === CandidateStatus.NEW).length;
  const shortlisted = candidates.filter(c => c.status === CandidateStatus.SHORTLISTED).length;
  const interviewing = candidates.filter(c => c.status === CandidateStatus.INTERVIEWING).length;
  const hired = candidates.filter(c => c.status === CandidateStatus.HIRED).length;

  const openPositions = positions.filter(p => p.status === 'OPEN').length;
  const analyses = StorageService.getAnalyses();
  const analyzedCandidates = analyses.length;

  // Recent candidates (last 5)
  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Top candidates by score
  const topCandidates = analyses
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5)
    .map(analysis => ({
      ...candidates.find(c => c.id === analysis.candidateId)!,
      score: analysis.overallScore,
      fit: analysis.overallFit
    }));

  const getStatusColor = (status: CandidateStatus) => {
    const colors: Record<CandidateStatus, string> = {
      [CandidateStatus.NEW]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      [CandidateStatus.SCREENING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      [CandidateStatus.UNDER_REVIEW]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      [CandidateStatus.SHORTLISTED]: 'bg-green-500/10 text-green-500 border-green-500/20',
      [CandidateStatus.INTERVIEWING]: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      [CandidateStatus.OFFER]: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      [CandidateStatus.HIRED]: 'bg-success/10 text-success border-success/20',
      [CandidateStatus.REJECTED]: 'bg-danger/10 text-danger border-danger/20',
      [CandidateStatus.ON_HOLD]: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    return colors[status] || '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-white/90 mb-4">
          You have <strong>{newCandidates} new candidates</strong> to review and <strong>{openPositions} open positions</strong> to fill.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onViewCandidates}
            className="bg-white text-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-md"
          >
            View All Candidates
          </button>
          <button
            onClick={onAddCandidate}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
          >
            + Add Candidates
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-dark-muted">vs last month</span>
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-1">{totalCandidates}</h3>
          <p className="text-sm text-dark-muted">Total Candidates</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-500">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-1">{shortlisted}</h3>
          <p className="text-sm text-dark-muted">Shortlisted</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-dark-muted">this week</span>
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-1">{interviewing}</h3>
          <p className="text-sm text-dark-muted">In Interview</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-medium text-success">+3 this month</span>
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-1">{hired}</h3>
          <p className="text-sm text-dark-muted">Hired</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-dark-text">Recent Candidates</h2>
            <button
              onClick={onViewCandidates}
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentCandidates.length === 0 ? (
              <p className="text-center text-dark-muted py-8">No candidates yet. Add some to get started!</p>
            ) : (
              recentCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-bg transition-colors cursor-pointer"
                  onClick={onViewCandidates}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`}
                    alt={`${candidate.firstName} ${candidate.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-text truncate">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-dark-muted truncate">
                      {candidate.currentJobTitle || 'No title'} • {candidate.totalYearsExperience}y exp
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(candidate.status)}`}>
                    {candidate.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Candidates by Score */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-dark-text">Top Rated Candidates</h2>
            <button
              onClick={onViewCandidates}
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {topCandidates.length === 0 ? (
              <p className="text-center text-dark-muted py-8">No analyzed candidates yet. Upload resumes to start!</p>
            ) : (
              topCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-bg transition-colors cursor-pointer"
                  onClick={onViewCandidates}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    #{index + 1}
                  </div>
                  <img
                    src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`}
                    alt={`${candidate.firstName} ${candidate.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-text truncate">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-xs text-dark-muted truncate">
                      {candidate.currentJobTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{candidate.score}</div>
                    <div className="text-[10px] text-dark-muted uppercase">{candidate.fit}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-sm">
        <h2 className="text-lg font-bold text-dark-text mb-6">Hiring Pipeline</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: CandidateStatus.NEW, count: newCandidates, label: 'New', color: 'blue' },
            { status: CandidateStatus.SCREENING, count: candidates.filter(c => c.status === CandidateStatus.SCREENING).length, label: 'Screening', color: 'yellow' },
            { status: CandidateStatus.SHORTLISTED, count: shortlisted, label: 'Shortlisted', color: 'green' },
            { status: CandidateStatus.INTERVIEWING, count: interviewing, label: 'Interviewing', color: 'indigo' },
            { status: CandidateStatus.OFFER, count: candidates.filter(c => c.status === CandidateStatus.OFFER).length, label: 'Offer', color: 'emerald' },
          ].map((stage) => (
            <div
              key={stage.status}
              className="text-center p-4 rounded-lg bg-dark-bg hover:bg-dark-border/30 transition-colors cursor-pointer"
              onClick={onViewCandidates}
            >
              <div className={`text-3xl font-bold text-${stage.color}-500 mb-1`}>{stage.count}</div>
              <div className="text-sm text-dark-muted">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
