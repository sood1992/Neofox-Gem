import React, { useState, useMemo } from 'react';
import { Candidate, JobPosition, CandidateStatus } from '../types';
import { StorageService } from '../services/storageService';

interface ComparisonToolProps {
  candidates: Candidate[];
  positions: JobPosition[];
  onClose: () => void;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ candidates, positions, onClose }) => {
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [comparisonView, setComparisonView] = useState<'table' | 'chart'>('table');

  const analyses = StorageService.getAnalyses();

  const toggleCandidateSelection = (candidateId: string) => {
    if (selectedCandidateIds.includes(candidateId)) {
      setSelectedCandidateIds(selectedCandidateIds.filter(id => id !== candidateId));
    } else if (selectedCandidateIds.length < 4) {
      setSelectedCandidateIds([...selectedCandidateIds, candidateId]);
    }
  };

  const selectedCandidates = useMemo(() => {
    return selectedCandidateIds.map(id => candidates.find(c => c.id === id)).filter(Boolean) as Candidate[];
  }, [selectedCandidateIds, candidates]);

  const selectedAnalyses = useMemo(() => {
    return selectedCandidateIds.map(id => analyses.find(a => a.candidateId === id));
  }, [selectedCandidateIds, analyses]);

  const comparisonCategories = [
    { key: 'technicalSkills', label: 'Technical Skills', color: '#6366f1' },
    { key: 'experience', label: 'Experience', color: '#8b5cf6' },
    { key: 'education', label: 'Education', color: '#ec4899' },
    { key: 'culturalFit', label: 'Cultural Fit', color: '#10b981' },
    { key: 'communication', label: 'Communication', color: '#f59e0b' },
    { key: 'leadership', label: 'Leadership', color: '#06b6d4' },
    { key: 'careerProgression', label: 'Career Growth', color: '#84cc16' },
    { key: 'salaryAlignment', label: 'Salary Fit', color: '#f97316' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportComparison = () => {
    const csvContent = [
      ['Metric', ...selectedCandidates.map(c => `${c.firstName} ${c.lastName}`)],
      ['Overall Score', ...selectedAnalyses.map(a => a?.overallScore || 'N/A')],
      ...comparisonCategories.map(cat => [
        cat.label,
        ...selectedAnalyses.map(a => a?.scores[cat.key as keyof typeof a.scores]?.score || 'N/A')
      ]),
      ['Years of Experience', ...selectedCandidates.map(c => c.yearsOfExperience)],
      ['Status', ...selectedCandidates.map(c => c.status)],
      ['Applied Position', ...selectedCandidates.map(c => c.appliedPosition)],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl border border-dark-border shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">Compare Candidates</h2>
              <p className="text-sm text-dark-muted">Select up to 4 candidates for side-by-side comparison</p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Candidate Selection */}
          {selectedCandidateIds.length < 4 && (
            <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-dark-text mb-3">Available Candidates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {candidates
                  .filter(c => !selectedCandidateIds.includes(c.id))
                  .map(candidate => {
                    const analysis = analyses.find(a => a.candidateId === candidate.id);
                    return (
                      <button
                        key={candidate.id}
                        onClick={() => toggleCandidateSelection(candidate.id)}
                        className="bg-dark-card hover:bg-dark-bg/50 border border-dark-border rounded-lg p-3 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-dark-text text-sm">
                            {candidate.firstName} {candidate.lastName}
                          </span>
                          {analysis && (
                            <span className={`text-xs font-bold ${getScoreColor(analysis.overallScore)}`}>
                              {analysis.overallScore}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-dark-muted truncate">{candidate.appliedPosition}</p>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Selected Candidates */}
          {selectedCandidates.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-dark-text">
                  Comparing {selectedCandidates.length} Candidate{selectedCandidates.length > 1 ? 's' : ''}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setComparisonView('table')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      comparisonView === 'table'
                        ? 'bg-primary text-white'
                        : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setComparisonView('chart')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      comparisonView === 'chart'
                        ? 'bg-primary text-white'
                        : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                    }`}
                  >
                    Chart View
                  </button>
                  <button
                    onClick={exportComparison}
                    className="px-3 py-1.5 bg-dark-bg hover:bg-dark-border text-dark-text rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {comparisonView === 'table' ? (
                <div className="bg-dark-bg rounded-xl border border-dark-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-border">
                          <th className="text-left p-4 bg-dark-card/50 text-dark-text font-semibold sticky left-0 z-10">
                            Metric
                          </th>
                          {selectedCandidates.map((candidate, idx) => (
                            <th key={candidate.id} className="p-4 bg-dark-card/50 min-w-[200px]">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-semibold text-dark-text text-sm">
                                    {candidate.firstName} {candidate.lastName}
                                  </span>
                                  <button
                                    onClick={() => toggleCandidateSelection(candidate.id)}
                                    className="text-dark-muted hover:text-red-500 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <span className="text-xs text-dark-muted">{candidate.appliedPosition}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {/* Overall Score */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Overall Score
                          </td>
                          {selectedAnalyses.map((analysis, idx) => (
                            <td key={idx} className="p-4 text-center">
                              {analysis ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                    {analysis.overallScore}
                                  </span>
                                  <span className="text-xs font-medium text-dark-muted uppercase">
                                    {analysis.overallFit}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-dark-muted">Not Analyzed</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Category Scores */}
                        {comparisonCategories.map((category) => (
                          <tr key={category.key}>
                            <td className="p-4 text-dark-text bg-dark-card/30 sticky left-0">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                                {category.label}
                              </div>
                            </td>
                            {selectedAnalyses.map((analysis, idx) => {
                              const score = analysis?.scores[category.key as keyof typeof analysis.scores]?.score;
                              return (
                                <td key={idx} className="p-4">
                                  {score !== undefined ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                                      </div>
                                      <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                                        <div
                                          className={`h-full ${getScoreBgColor(score)}`}
                                          style={{ width: `${score}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-dark-muted text-sm">N/A</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}

                        {/* Experience */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Years of Experience
                          </td>
                          {selectedCandidates.map((candidate, idx) => (
                            <td key={idx} className="p-4 text-center text-dark-text font-medium">
                              {candidate.yearsOfExperience} years
                            </td>
                          ))}
                        </tr>

                        {/* Status */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Current Status
                          </td>
                          {selectedCandidates.map((candidate, idx) => (
                            <td key={idx} className="p-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                candidate.status === CandidateStatus.HIRED ? 'bg-green-500/10 text-green-500' :
                                candidate.status === CandidateStatus.SHORTLISTED ? 'bg-blue-500/10 text-blue-500' :
                                candidate.status === CandidateStatus.REJECTED ? 'bg-red-500/10 text-red-500' :
                                'bg-gray-500/10 text-gray-500'
                              }`}>
                                {candidate.status.replace('_', ' ')}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* Skills */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Key Skills
                          </td>
                          {selectedCandidates.map((candidate, idx) => (
                            <td key={idx} className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 5).map((skill, skillIdx) => (
                                  <span
                                    key={skillIdx}
                                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {candidate.skills.length > 5 && (
                                  <span className="px-2 py-0.5 text-dark-muted text-xs">
                                    +{candidate.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Red Flags */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Red Flags
                          </td>
                          {selectedAnalyses.map((analysis, idx) => (
                            <td key={idx} className="p-4">
                              {analysis && analysis.redFlags.length > 0 ? (
                                <div className="space-y-1">
                                  {analysis.redFlags.slice(0, 3).map((flag, flagIdx) => (
                                    <div key={flagIdx} className="flex items-start gap-2">
                                      <span className={`text-xs font-medium ${
                                        flag.severity === 'CRITICAL' ? 'text-red-500' :
                                        flag.severity === 'HIGH' ? 'text-orange-500' :
                                        'text-yellow-500'
                                      }`}>
                                        •
                                      </span>
                                      <span className="text-xs text-dark-muted">{flag.title}</span>
                                    </div>
                                  ))}
                                  {analysis.redFlags.length > 3 && (
                                    <span className="text-xs text-dark-muted">+{analysis.redFlags.length - 3} more</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-green-500 font-medium">None detected</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Strengths */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Top Strengths
                          </td>
                          {selectedAnalyses.map((analysis, idx) => (
                            <td key={idx} className="p-4">
                              {analysis ? (
                                <ul className="space-y-1">
                                  {analysis.strengths.slice(0, 3).map((strength, sIdx) => (
                                    <li key={sIdx} className="text-xs text-dark-muted flex items-start gap-2">
                                      <span className="text-green-500">✓</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-dark-muted text-sm">N/A</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Weaknesses */}
                        <tr>
                          <td className="p-4 font-semibold text-dark-text bg-dark-card/30 sticky left-0">
                            Areas for Development
                          </td>
                          {selectedAnalyses.map((analysis, idx) => (
                            <td key={idx} className="p-4">
                              {analysis ? (
                                <ul className="space-y-1">
                                  {analysis.weaknesses.slice(0, 3).map((weakness, wIdx) => (
                                    <li key={wIdx} className="text-xs text-dark-muted flex items-start gap-2">
                                      <span className="text-yellow-500">⚠</span>
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-dark-muted text-sm">N/A</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Chart View
                <div className="space-y-6">
                  {/* Overall Score Comparison */}
                  <div className="bg-dark-bg rounded-xl border border-dark-border p-6">
                    <h3 className="text-lg font-bold text-dark-text mb-6">Overall Score Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {selectedCandidates.map((candidate, idx) => {
                        const analysis = selectedAnalyses[idx];
                        return (
                          <div key={candidate.id} className="bg-dark-card rounded-lg p-4 border border-dark-border">
                            <div className="text-center mb-4">
                              <h4 className="font-semibold text-dark-text mb-1">
                                {candidate.firstName} {candidate.lastName}
                              </h4>
                              <p className="text-xs text-dark-muted">{candidate.appliedPosition}</p>
                            </div>
                            {analysis ? (
                              <div className="relative">
                                <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="8"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke={
                                      analysis.overallScore >= 80 ? '#10b981' :
                                      analysis.overallScore >= 60 ? '#6366f1' :
                                      analysis.overallScore >= 40 ? '#f59e0b' : '#ef4444'
                                    }
                                    strokeWidth="8"
                                    strokeDasharray={`${(analysis.overallScore / 100) * 251.2} 251.2`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                  />
                                  <text x="50" y="50" textAnchor="middle" dy="7" className="text-2xl font-bold" fill="#f3f4f6">
                                    {analysis.overallScore}
                                  </text>
                                </svg>
                                <p className="text-center text-xs font-medium text-dark-muted mt-2 uppercase">
                                  {analysis.overallFit}
                                </p>
                              </div>
                            ) : (
                              <p className="text-center text-dark-muted">Not Analyzed</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-dark-bg rounded-xl border border-dark-border p-6">
                    <h3 className="text-lg font-bold text-dark-text mb-6">Category Breakdown</h3>
                    <div className="space-y-6">
                      {comparisonCategories.map((category) => (
                        <div key={category.key}>
                          <h4 className="text-sm font-semibold text-dark-text mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            {category.label}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {selectedCandidates.map((candidate, idx) => {
                              const analysis = selectedAnalyses[idx];
                              const score = analysis?.scores[category.key as keyof typeof analysis.scores]?.score;
                              return (
                                <div key={candidate.id} className="bg-dark-card rounded-lg p-3 border border-dark-border">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-dark-muted truncate">
                                      {candidate.firstName} {candidate.lastName}
                                    </span>
                                    {score !== undefined && (
                                      <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                                        {score}
                                      </span>
                                    )}
                                  </div>
                                  {score !== undefined ? (
                                    <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                                      <div
                                        className="h-full transition-all"
                                        style={{
                                          width: `${score}%`,
                                          backgroundColor: category.color
                                        }}
                                      ></div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-dark-muted">N/A</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedCandidates.length === 0 && (
            <div className="bg-dark-bg rounded-xl border-2 border-dashed border-dark-border p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-semibold text-dark-text mb-2">No Candidates Selected</h3>
              <p className="text-sm text-dark-muted">Select at least 2 candidates from the list above to start comparing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
