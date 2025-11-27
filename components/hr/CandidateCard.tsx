import React from 'react';
import {
  Star, AlertTriangle, MapPin, Briefcase, Clock, ExternalLink,
  CheckCircle, ChevronRight, GitCompare, MoreHorizontal,
  Linkedin, Github, Globe, Award, TrendingUp, TrendingDown
} from 'lucide-react';
import { Candidate, CandidateStatus, RedFlagType, StrengthType } from '../../hrTypes';

interface CandidateCardProps {
  candidate: Candidate;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
  onToggleComparison: () => void;
  onStatusChange: (status: CandidateStatus) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  viewMode,
  isSelected,
  onSelect,
  onToggleComparison,
  onStatusChange
}) => {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: CandidateStatus) => {
    const statusConfig = {
      [CandidateStatus.NEW]: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'New' },
      [CandidateStatus.SCREENING]: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Screening' },
      [CandidateStatus.SHORTLISTED]: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Shortlisted' },
      [CandidateStatus.INTERVIEW]: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', label: 'Interview' },
      [CandidateStatus.OFFER]: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Offer' },
      [CandidateStatus.HIRED]: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: 'Hired' },
      [CandidateStatus.REJECTED]: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Rejected' },
      [CandidateStatus.WITHDRAWN]: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Withdrawn' },
    };
    return statusConfig[status] || statusConfig[CandidateStatus.NEW];
  };

  const getRecommendationBadge = () => {
    if (!candidate.aiRecommendation) return null;

    const config = {
      'STRONGLY_RECOMMEND': { bg: 'bg-green-500/20', text: 'text-green-500', icon: TrendingUp, label: 'Strong Fit' },
      'RECOMMEND': { bg: 'bg-green-500/10', text: 'text-green-400', icon: TrendingUp, label: 'Good Fit' },
      'NEUTRAL': { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: null, label: 'Neutral' },
      'NOT_RECOMMEND': { bg: 'bg-red-500/10', text: 'text-red-400', icon: TrendingDown, label: 'Poor Fit' },
      'STRONGLY_NOT_RECOMMEND': { bg: 'bg-red-500/20', text: 'text-red-500', icon: TrendingDown, label: 'Not Fit' },
    };

    const rec = config[candidate.aiRecommendation];
    const Icon = rec.icon;

    return (
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rec.bg} ${rec.text}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {rec.label}
      </div>
    );
  };

  const statusBadge = getStatusBadge(candidate.status);
  const hasRedFlags = candidate.redFlags && candidate.redFlags.length > 0;
  const criticalFlags = candidate.redFlags?.filter(rf => rf.severity === 'CRITICAL' || rf.severity === 'HIGH') || [];

  if (viewMode === 'list') {
    return (
      <div
        className={`bg-dark-card rounded-xl border transition-all cursor-pointer group ${isSelected
          ? 'border-primary shadow-lg shadow-primary/10'
          : 'border-dark-border hover:border-primary/50'
          }`}
      >
        <div className="flex items-center p-4 gap-4">
          {/* Comparison Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComparison(); }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected
              ? 'bg-primary border-primary'
              : 'border-dark-border hover:border-primary'
              }`}
          >
            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
          </button>

          {/* Avatar */}
          <div
            onClick={onSelect}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-semibold flex-shrink-0"
          >
            {candidate.firstName[0]}{candidate.lastName[0]}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0" onClick={onSelect}>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-dark-text group-hover:text-primary transition-colors truncate">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
              {getRecommendationBadge()}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-dark-muted">
              <span className="flex items-center gap-1 truncate">
                <Briefcase className="w-3.5 h-3.5" />
                {candidate.currentTitle}
                {candidate.currentCompany && ` at ${candidate.currentCompany}`}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {candidate.location}
              </span>
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-6" onClick={onSelect}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                {candidate.overallScore}
              </div>
              <div className="text-xs text-dark-muted">Overall</div>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-dark-muted w-14">Skills</span>
                <div className="w-20 h-1.5 bg-dark-border rounded-full overflow-hidden">
                  <div className={`h-full ${getScoreBg(candidate.skillMatchScore)} rounded-full`}
                    style={{ width: `${candidate.skillMatchScore}%` }} />
                </div>
                <span className={`w-8 ${getScoreColor(candidate.skillMatchScore)}`}>{candidate.skillMatchScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-dark-muted w-14">Exp</span>
                <div className="w-20 h-1.5 bg-dark-border rounded-full overflow-hidden">
                  <div className={`h-full ${getScoreBg(candidate.experienceScore)} rounded-full`}
                    style={{ width: `${candidate.experienceScore}%` }} />
                </div>
                <span className={`w-8 ${getScoreColor(candidate.experienceScore)}`}>{candidate.experienceScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-dark-muted w-14">Culture</span>
                <div className="w-20 h-1.5 bg-dark-border rounded-full overflow-hidden">
                  <div className={`h-full ${getScoreBg(candidate.culturalFitScore)} rounded-full`}
                    style={{ width: `${candidate.culturalFitScore}%` }} />
                </div>
                <span className={`w-8 ${getScoreColor(candidate.culturalFitScore)}`}>{candidate.culturalFitScore}%</span>
              </div>
            </div>
          </div>

          {/* Flags & Actions */}
          <div className="flex items-center gap-2">
            {hasRedFlags && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className={`w-4 h-4 ${criticalFlags.length > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                <span className={`text-xs font-medium ${criticalFlags.length > 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {candidate.redFlags!.length}
                </span>
              </div>
            )}

            {candidate.strengths && candidate.strengths.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-lg">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">
                  {candidate.strengths.length}
                </span>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5]" />
                </a>
              )}
              {candidate.githubUrl && (
                <a
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4 text-dark-text" />
                </a>
              )}
            </div>

            <ChevronRight className="w-5 h-5 text-dark-muted" />
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={`bg-dark-card rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${isSelected
        ? 'border-primary shadow-lg shadow-primary/10'
        : 'border-dark-border hover:border-primary/50'
        }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3" onClick={onSelect}>
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </div>
              {candidate.ranking && candidate.ranking <= 3 && (
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${candidate.ranking === 1 ? 'bg-yellow-500 text-yellow-900' :
                  candidate.ranking === 2 ? 'bg-gray-300 text-gray-700' :
                    'bg-orange-400 text-orange-900'
                  }`}>
                  #{candidate.ranking}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-dark-text group-hover:text-primary transition-colors">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <p className="text-sm text-dark-muted truncate max-w-[150px]">
                {candidate.currentTitle}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleComparison(); }}
            className={`p-1.5 rounded-lg border-2 transition-all ${isSelected
              ? 'bg-primary border-primary'
              : 'border-dark-border hover:border-primary bg-dark-bg'
              }`}
            title="Add to comparison"
          >
            <GitCompare className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-dark-muted'}`} />
          </button>
        </div>

        {/* Score Ring */}
        <div className="flex items-center justify-center my-4" onClick={onSelect}>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-dark-border"
              />
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${candidate.overallScore * 2.51} 251`}
                strokeLinecap="round"
                className={getScoreColor(candidate.overallScore)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                {candidate.overallScore}
              </span>
              <span className="text-xs text-dark-muted">Score</span>
            </div>
          </div>
        </div>

        {/* Sub Scores */}
        <div className="space-y-2 mb-4" onClick={onSelect}>
          {[
            { label: 'Skills', value: candidate.skillMatchScore },
            { label: 'Experience', value: candidate.experienceScore },
            { label: 'Culture Fit', value: candidate.culturalFitScore }
          ].map(score => (
            <div key={score.label} className="flex items-center gap-2">
              <span className="text-xs text-dark-muted w-16">{score.label}</span>
              <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreBg(score.value)} rounded-full transition-all`}
                  style={{ width: `${score.value}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-8 ${getScoreColor(score.value)}`}>
                {score.value}%
              </span>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4 text-sm" onClick={onSelect}>
          {candidate.currentCompany && (
            <div className="flex items-center gap-2 text-dark-muted">
              <Briefcase className="w-4 h-4" />
              <span className="truncate">{candidate.currentCompany}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-dark-muted">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-muted">
            <Clock className="w-4 h-4" />
            <span>{candidate.totalYearsExperience} years exp</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4" onClick={onSelect}>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
          {getRecommendationBadge()}

          {hasRedFlags && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${criticalFlags.length > 0 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
              }`}>
              <AlertTriangle className="w-3 h-3" />
              {candidate.redFlags!.length} flag{candidate.redFlags!.length !== 1 ? 's' : ''}
            </span>
          )}

          {candidate.strengths && candidate.strengths.length > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 flex items-center gap-1">
              <Star className="w-3 h-3" />
              {candidate.strengths.length}
            </span>
          )}
        </div>

        {/* Tags */}
        {candidate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4" onClick={onSelect}>
            {candidate.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-dark-bg text-dark-muted text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {candidate.tags.length > 3 && (
              <span className="px-2 py-0.5 text-dark-muted text-xs">
                +{candidate.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-border">
          <div className="flex items-center gap-2">
            {candidate.linkedinUrl && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
              </a>
            )}
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-dark-text" />
              </a>
            )}
            {candidate.portfolioUrl && (
              <a
                href={candidate.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors"
                title="Portfolio"
              >
                <Globe className="w-4 h-4 text-dark-muted" />
              </a>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
