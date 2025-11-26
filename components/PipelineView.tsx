import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStatus, JobPosition } from '../types';
import { StorageService } from '../services/storageService';

interface PipelineViewProps {
  candidates: Candidate[];
  positions: JobPosition[];
  onCandidateClick: (candidate: Candidate) => void;
  onCandidateUpdate: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  candidates,
  positions,
  onCandidateClick,
  onCandidateUpdate
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

  const stages = [
    { status: CandidateStatus.NEW, label: 'New Applications', color: '#3b82f6', icon: '📥' },
    { status: CandidateStatus.SCREENING, label: 'Screening', color: '#eab308', icon: '🔍' },
    { status: CandidateStatus.UNDER_REVIEW, label: 'Under Review', color: '#a855f7', icon: '📋' },
    { status: CandidateStatus.SHORTLISTED, label: 'Shortlisted', color: '#22c55e', icon: '⭐' },
    { status: CandidateStatus.INTERVIEWING, label: 'Interviewing', color: '#6366f1', icon: '💬' },
    { status: CandidateStatus.OFFER, label: 'Offer Extended', color: '#10b981', icon: '🎉' },
    { status: CandidateStatus.HIRED, label: 'Hired', color: '#059669', icon: '✅' },
  ];

  const filteredCandidates = useMemo(() => {
    if (selectedPosition === 'ALL') return candidates;
    const position = positions.find(p => p.id === selectedPosition);
    if (!position) return candidates;
    return candidates.filter(c => c.appliedPosition === position.title);
  }, [candidates, selectedPosition, positions]);

  const getCandidatesByStatus = (status: CandidateStatus) => {
    return filteredCandidates.filter(c => c.status === status);
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: CandidateStatus) => {
    e.preventDefault();
    if (!draggedCandidate) return;

    if (draggedCandidate.status !== newStatus) {
      const updatedCandidate = {
        ...draggedCandidate,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      StorageService.updateCandidate(draggedCandidate.id, updatedCandidate);
      onCandidateUpdate();
    }

    setDraggedCandidate(null);
  };

  const analyses = StorageService.getAnalyses();

  const getAnalysis = (candidateId: string) => {
    return analyses.find(a => a.candidateId === candidateId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-text mb-2">Hiring Pipeline</h1>
            <p className="text-dark-muted">Drag and drop candidates between stages</p>
          </div>

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
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map(stage => {
            const count = getCandidatesByStatus(stage.status).length;
            return (
              <div
                key={stage.status}
                className="bg-dark-card rounded-lg border border-dark-border p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{stage.icon}</span>
                  <span className="text-2xl font-bold text-dark-text">{count}</span>
                </div>
                <p className="text-xs text-dark-muted truncate">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-4 min-w-full h-full pb-4">
          {stages.map(stage => {
            const stageCandidates = getCandidatesByStatus(stage.status);
            const isDraggingOver = draggedCandidate?.status !== stage.status;

            return (
              <div
                key={stage.status}
                className="flex-shrink-0 w-80 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.status)}
              >
                {/* Column Header */}
                <div
                  className="mb-3 rounded-lg p-3"
                  style={{ backgroundColor: `${stage.color}15`, borderLeft: `4px solid ${stage.color}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stage.icon}</span>
                      <h3 className="font-semibold text-dark-text">{stage.label}</h3>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: stage.color, color: 'white' }}
                    >
                      {stageCandidates.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div
                  className={`flex-1 space-y-3 overflow-y-auto pr-2 rounded-lg transition-colors ${
                    isDraggingOver && draggedCandidate ? 'bg-dark-bg/50 border-2 border-dashed border-primary' : ''
                  }`}
                  style={{ minHeight: '400px' }}
                >
                  {stageCandidates.map(candidate => {
                    const analysis = getAnalysis(candidate.id);
                    return (
                      <div
                        key={candidate.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate)}
                        onClick={() => onCandidateClick(candidate)}
                        className={`bg-dark-card rounded-lg border border-dark-border p-4 cursor-move hover:shadow-lg transition-shadow ${
                          draggedCandidate?.id === candidate.id ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Candidate Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-dark-text text-sm mb-1">
                              {candidate.firstName} {candidate.lastName}
                            </h4>
                            <p className="text-xs text-dark-muted truncate">
                              {candidate.appliedPosition}
                            </p>
                          </div>
                          {analysis && (
                            <div className="ml-2 flex flex-col items-end">
                              <span className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
                                {analysis.overallScore}
                              </span>
                              <span className="text-xs text-dark-muted uppercase">
                                {analysis.overallFit}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-xs text-dark-muted">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{candidate.email}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-dark-muted">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{candidate.yearsOfExperience} years experience</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-dark-muted">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Applied {new Date(candidate.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-2 py-0.5 text-dark-muted text-xs">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Red Flags Alert */}
                        {analysis && analysis.redFlags.length > 0 && (
                          <div className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 px-2 py-1.5 rounded">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="font-medium">{analysis.redFlags.length} red flag{analysis.redFlags.length > 1 ? 's' : ''}</span>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-border">
                          <button className="flex-1 text-xs font-medium text-dark-muted hover:text-primary transition-colors flex items-center justify-center gap-1 py-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button className="flex-1 text-xs font-medium text-dark-muted hover:text-primary transition-colors flex items-center justify-center gap-1 py-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {stageCandidates.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-dark-muted text-sm">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No candidates</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejected & On Hold (Collapsed at bottom) */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { status: CandidateStatus.REJECTED, label: 'Rejected', icon: '❌', color: '#ef4444' },
          { status: CandidateStatus.ON_HOLD, label: 'On Hold', icon: '⏸️', color: '#6b7280' }
        ].map(stage => {
          const stageCandidates = getCandidatesByStatus(stage.status);
          return (
            <details key={stage.status} className="bg-dark-card rounded-lg border border-dark-border">
              <summary className="p-4 cursor-pointer hover:bg-dark-bg/50 transition-colors rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{stage.icon}</span>
                  <span className="font-semibold text-dark-text">{stage.label}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                  >
                    {stageCandidates.length}
                  </span>
                </div>
                <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stageCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    onClick={() => onCandidateClick(candidate)}
                    className="bg-dark-bg rounded-lg p-3 border border-dark-border cursor-pointer hover:border-primary transition-colors"
                  >
                    <h4 className="font-semibold text-dark-text text-sm mb-1">
                      {candidate.firstName} {candidate.lastName}
                    </h4>
                    <p className="text-xs text-dark-muted truncate">{candidate.appliedPosition}</p>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
};
