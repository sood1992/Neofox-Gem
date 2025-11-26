import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStatus, ExperienceLevel, JobPosition } from '../types';
import { StorageService } from '../services/storageService';

interface CandidatesListProps {
  candidates: Candidate[];
  positions: JobPosition[];
  onCandidateClick: (candidate: Candidate) => void;
  onCandidateUpdate: () => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({
  candidates,
  positions,
  onCandidateClick,
  onCandidateUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'ALL'>('ALL');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | 'ALL'>('ALL');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'experience' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const analyses = StorageService.getAnalyses();

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch =
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (candidate.currentJobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter;
      const matchesExperience = experienceFilter === 'ALL' || candidate.experienceLevel === experienceFilter;
      const matchesPosition = positionFilter === 'ALL' || candidate.appliedPositions.includes(positionFilter);

      return matchesSearch && matchesStatus && matchesExperience && matchesPosition;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'experience':
          comparison = b.totalYearsExperience - a.totalYearsExperience;
          break;
        case 'score':
          const scoreA = analyses.find(an => an.candidateId === a.id)?.overallScore || 0;
          const scoreB = analyses.find(an => an.candidateId === b.id)?.overallScore || 0;
          comparison = scoreB - scoreA;
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [candidates, searchQuery, statusFilter, experienceFilter, positionFilter, sortBy, sortOrder, analyses]);

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
    return colors[status];
  };

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedCandidates(filteredAndSortedCandidates.map(c => c.id));
  };

  const deselectAll = () => {
    setSelectedCandidates([]);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions Bar */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, skills, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              {Object.values(CandidateStatus).map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value as any)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary outline-none cursor-pointer"
            >
              <option value="ALL">All Experience</option>
              {Object.values(ExperienceLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary outline-none cursor-pointer"
            >
              <option value="ALL">All Positions</option>
              {positions.map(pos => (
                <option key={pos.id} value={pos.id}>{pos.title}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary outline-none cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="score">Sort by Score</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text hover:bg-dark-border transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <div className="flex border border-dark-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-dark-bg text-dark-text hover:bg-dark-border'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-dark-bg text-dark-text hover:bg-dark-border'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCandidates.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-sm text-dark-text">
              {selectedCandidates.length} candidate(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                Bulk Analyze
              </button>
              <button className="px-3 py-1.5 text-xs bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors">
                Move to Shortlist
              </button>
              <button className="px-3 py-1.5 text-xs bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors">
                Reject
              </button>
              <button onClick={deselectAll} className="px-3 py-1.5 text-xs bg-dark-bg text-dark-muted rounded-lg hover:bg-dark-border transition-colors">
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-muted">
          Showing <strong className="text-dark-text">{filteredAndSortedCandidates.length}</strong> of <strong className="text-dark-text">{candidates.length}</strong> candidates
        </p>
        {filteredAndSortedCandidates.length > 0 && selectedCandidates.length === 0 && (
          <button onClick={selectAll} className="text-xs text-primary hover:text-primary-hover font-medium">
            Select All
          </button>
        )}
      </div>

      {/* Candidates List/Grid */}
      {filteredAndSortedCandidates.length === 0 ? (
        <div className="bg-dark-card rounded-xl p-12 text-center border border-dashed border-dark-border">
          <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-dark-text mb-2">No candidates found</h3>
          <p className="text-dark-muted">Try adjusting your filters or add new candidates</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredAndSortedCandidates.map(candidate => {
            const analysis = analyses.find(a => a.candidateId === candidate.id);
            const isSelected = selectedCandidates.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                className={`bg-dark-card rounded-xl p-4 border transition-all hover:shadow-md cursor-pointer ${
                  isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-dark-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectCandidate(candidate.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded border-dark-border text-primary focus:ring-primary cursor-pointer"
                  />

                  {/* Avatar */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`}
                    alt={`${candidate.firstName} ${candidate.lastName}`}
                    className="w-14 h-14 rounded-full"
                    onClick={() => onCandidateClick(candidate)}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0" onClick={() => onCandidateClick(candidate)}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-dark-text">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      {analysis && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/10 text-primary">
                          Score: {analysis.overallScore}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-muted truncate">
                      {candidate.currentJobTitle || 'No title'} • {candidate.totalYearsExperience} years exp • {candidate.location}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {candidate.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-xs bg-dark-bg text-dark-text rounded">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="px-2 py-0.5 text-xs bg-dark-bg text-dark-muted rounded">
                          +{candidate.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(candidate.status)}`}>
                      {candidate.status.replace('_', ' ')}
                    </span>
                    {!analysis && positions.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCandidateClick(candidate);
                        }}
                        className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedCandidates.map(candidate => {
            const analysis = analyses.find(a => a.candidateId === candidate.id);
            const isSelected = selectedCandidates.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                className={`bg-dark-card rounded-xl p-6 border transition-all hover:shadow-md cursor-pointer ${
                  isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-dark-border'
                }`}
                onClick={() => onCandidateClick(candidate)}
              >
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectCandidate(candidate.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded border-dark-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(candidate.status)}`}>
                    {candidate.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`}
                    alt={`${candidate.firstName} ${candidate.lastName}`}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-dark-text mb-1">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-sm text-dark-muted">
                    {candidate.currentJobTitle || 'No title'}
                  </p>
                </div>

                {analysis && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg text-center border border-primary/20">
                    <div className="text-2xl font-bold text-primary mb-1">{analysis.overallScore}</div>
                    <div className="text-xs text-dark-muted uppercase">{analysis.overallFit}</div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-dark-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{candidate.totalYearsExperience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-dark-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{candidate.location}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {candidate.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-dark-bg text-dark-text rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
