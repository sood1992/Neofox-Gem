import React, { useState, useEffect } from 'react';
import {
  X, GitCompare, Trophy, TrendingUp, TrendingDown, Minus,
  CheckCircle, XCircle, AlertTriangle, Award, Star,
  Sparkles, Download, Share2
} from 'lucide-react';
import { Candidate, JobPosition } from '../../hrTypes';
import { CandidateAnalysisService } from '../../services/candidateAnalysisService';

interface CandidateComparisonProps {
  candidates: Candidate[];
  position: JobPosition;
  onClose: () => void;
}

type ComparisonMetric = {
  key: string;
  label: string;
  getValue: (c: Candidate) => number | string;
  type: 'score' | 'text' | 'boolean' | 'list';
  higherIsBetter?: boolean;
};

export const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  candidates,
  position,
  onClose
}) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const metrics: ComparisonMetric[] = [
    { key: 'overallScore', label: 'Overall Score', getValue: c => c.overallScore, type: 'score', higherIsBetter: true },
    { key: 'skillMatchScore', label: 'Skills Match', getValue: c => c.skillMatchScore, type: 'score', higherIsBetter: true },
    { key: 'experienceScore', label: 'Experience', getValue: c => c.experienceScore, type: 'score', higherIsBetter: true },
    { key: 'culturalFitScore', label: 'Cultural Fit', getValue: c => c.culturalFitScore, type: 'score', higherIsBetter: true },
    { key: 'experience', label: 'Years of Experience', getValue: c => c.totalYearsExperience, type: 'score', higherIsBetter: true },
    { key: 'salary', label: 'Salary Expectation', getValue: c => c.salaryExpectation ? `$${c.salaryExpectation.toLocaleString()}` : 'Not specified', type: 'text' },
    { key: 'level', label: 'Experience Level', getValue: c => c.experienceLevel, type: 'text' },
    { key: 'location', label: 'Location', getValue: c => c.location, type: 'text' },
    { key: 'redFlags', label: 'Red Flags', getValue: c => c.redFlags?.length || 0, type: 'score', higherIsBetter: false },
    { key: 'strengths', label: 'Strengths', getValue: c => c.strengths?.length || 0, type: 'score', higherIsBetter: true },
    { key: 'source', label: 'Source', getValue: c => c.source.replace('_', ' '), type: 'text' },
    { key: 'recommendation', label: 'AI Recommendation', getValue: c => c.aiRecommendation?.replace(/_/g, ' ') || 'N/A', type: 'text' },
  ];

  const getBestValue = (metric: ComparisonMetric): number | string | null => {
    if (metric.type !== 'score') return null;

    const values = candidates.map(c => {
      const val = metric.getValue(c);
      return typeof val === 'number' ? val : 0;
    });

    if (metric.higherIsBetter) {
      return Math.max(...values);
    } else {
      return Math.min(...values);
    }
  };

  const getCellClass = (metric: ComparisonMetric, value: number | string): string => {
    if (metric.type !== 'score') return '';

    const best = getBestValue(metric);
    if (typeof value === 'number' && value === best) {
      return metric.higherIsBetter ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500';
    }
    return '';
  };

  const generateComparison = async () => {
    setIsGenerating(true);
    try {
      const summary = await CandidateAnalysisService.compareCandidates(candidates, position);
      setAiSummary(summary);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (candidates.length >= 2) {
      generateComparison();
    }
  }, [candidates]);

  // Rank candidates by overall score
  const rankedCandidates = [...candidates].sort((a, b) => b.overallScore - a.overallScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-6xl rounded-2xl border border-dark-border shadow-2xl animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" />
                Candidate Comparison
              </h2>
              <p className="text-sm text-dark-muted mt-1">
                Comparing {candidates.length} candidates for {position.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateComparison}
                disabled={isGenerating}
                className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'AI Comparison'}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
              >
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {/* Ranking Podium */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {rankedCandidates.slice(0, 3).map((candidate, index) => {
              const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd
              const heights = ['h-24', 'h-32', 'h-20'];
              const colors = [
                'from-gray-400 to-gray-500',
                'from-yellow-400 to-yellow-500',
                'from-orange-400 to-orange-500'
              ];
              const pos = positions[index];
              if (pos >= rankedCandidates.length) return null;

              const c = rankedCandidates[pos];
              return (
                <div key={c.id} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[pos]} flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2`}>
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <p className="text-sm font-medium text-dark-text text-center mb-1">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className={`text-lg font-bold ${getScoreColor(c.overallScore)}`}>
                    {c.overallScore}
                  </p>
                  <div className={`${heights[pos]} w-24 bg-gradient-to-t ${colors[pos]} rounded-t-lg flex items-end justify-center pb-2`}>
                    <Trophy className={`w-6 h-6 text-white ${pos === 1 ? 'w-8 h-8' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Summary */}
          {aiSummary && (
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20 mb-6">
              <h3 className="font-semibold text-dark-text flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Analysis
              </h3>
              <p className="text-dark-text whitespace-pre-line text-sm leading-relaxed">
                {aiSummary}
              </p>
            </div>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-dark-bg border-b border-dark-border text-sm font-medium text-dark-muted w-48">
                    Metric
                  </th>
                  {candidates.map(candidate => (
                    <th
                      key={candidate.id}
                      className="p-3 bg-dark-bg border-b border-dark-border text-center min-w-[180px]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-semibold text-sm">
                          {candidate.firstName[0]}{candidate.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-dark-text">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map(metric => (
                  <tr key={metric.key} className="hover:bg-dark-bg/50">
                    <td className="p-3 border-b border-dark-border text-sm text-dark-muted">
                      {metric.label}
                    </td>
                    {candidates.map(candidate => {
                      const value = metric.getValue(candidate);
                      const cellClass = getCellClass(metric, value);

                      return (
                        <td
                          key={candidate.id}
                          className={`p-3 border-b border-dark-border text-center ${cellClass}`}
                        >
                          {metric.type === 'score' && typeof value === 'number' ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className={`font-semibold ${metric.key.includes('Score') ? getScoreColor(value) : 'text-dark-text'}`}>
                                {value}
                                {metric.key.includes('Score') && '%'}
                              </span>
                              {value === getBestValue(metric) && (
                                <Star className={`w-4 h-4 ${metric.higherIsBetter ? 'text-green-500' : 'text-red-500'}`} />
                              )}
                            </div>
                          ) : (
                            <span className="text-dark-text text-sm">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Red Flags Details */}
                <tr className="bg-red-500/5">
                  <td className="p-3 border-b border-dark-border text-sm text-red-500 font-medium">
                    Red Flags (Details)
                  </td>
                  {candidates.map(candidate => (
                    <td key={candidate.id} className="p-3 border-b border-dark-border">
                      {candidate.redFlags && candidate.redFlags.length > 0 ? (
                        <div className="space-y-1">
                          {candidate.redFlags.map(flag => (
                            <div key={flag.id} className="flex items-center gap-1 text-xs">
                              <AlertTriangle className={`w-3 h-3 ${flag.severity === 'CRITICAL' || flag.severity === 'HIGH'
                                  ? 'text-red-500' : 'text-yellow-500'
                                }`} />
                              <span className="text-dark-muted">{flag.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-500 text-xs flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" /> None
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Strengths Details */}
                <tr className="bg-green-500/5">
                  <td className="p-3 border-b border-dark-border text-sm text-green-500 font-medium">
                    Strengths (Details)
                  </td>
                  {candidates.map(candidate => (
                    <td key={candidate.id} className="p-3 border-b border-dark-border">
                      {candidate.strengths && candidate.strengths.length > 0 ? (
                        <div className="space-y-1">
                          {candidate.strengths.slice(0, 3).map(strength => (
                            <div key={strength.id} className="flex items-center gap-1 text-xs">
                              <Award className="w-3 h-3 text-green-500" />
                              <span className="text-dark-muted">{strength.title}</span>
                            </div>
                          ))}
                          {candidate.strengths.length > 3 && (
                            <span className="text-xs text-dark-muted">
                              +{candidate.strengths.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs flex items-center justify-center gap-1">
                          <Minus className="w-3 h-3" /> None identified
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Comparison Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {candidates.map(candidate => {
              const rank = rankedCandidates.findIndex(c => c.id === candidate.id) + 1;

              return (
                <div
                  key={candidate.id}
                  className={`bg-dark-bg rounded-xl p-4 border ${rank === 1 ? 'border-yellow-500/50' : 'border-dark-border'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-bold">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark-text flex items-center gap-2">
                        {candidate.firstName} {candidate.lastName}
                        {rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </h4>
                      <p className="text-sm text-dark-muted">{candidate.currentTitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Rank</span>
                      <span className={`font-bold ${rank === 1 ? 'text-yellow-500' : 'text-dark-text'}`}>
                        #{rank} of {candidates.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Overall Score</span>
                      <span className={`font-bold ${getScoreColor(candidate.overallScore)}`}>
                        {candidate.overallScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Recommendation</span>
                      <span className={`font-medium ${candidate.aiRecommendation?.includes('RECOMMEND') && !candidate.aiRecommendation?.includes('NOT')
                          ? 'text-green-500'
                          : candidate.aiRecommendation?.includes('NOT')
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                        {candidate.aiRecommendation?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {candidate.aiSummary && (
                    <p className="text-xs text-dark-muted mt-3 line-clamp-3">
                      {candidate.aiSummary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border bg-dark-bg/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-muted hover:text-dark-text transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
