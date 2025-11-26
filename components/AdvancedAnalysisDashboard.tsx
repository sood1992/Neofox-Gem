import React, { useState, useEffect } from 'react';
import {
  Candidate,
  JobPosition,
  AdvancedCandidateAnalysis,
  TopPerformerProfile,
  TeamComposition,
} from '../types';
import { AdvancedAnalysisService } from '../services/advancedAnalysisService';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Users,
  Award,
  FileText,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface AdvancedAnalysisDashboardProps {
  candidate: Candidate;
  position: JobPosition;
  allPositions: JobPosition[];
  topPerformers?: TopPerformerProfile[];
  teamComposition?: TeamComposition;
  offeredSalary?: number;
}

export const AdvancedAnalysisDashboard: React.FC<AdvancedAnalysisDashboardProps> = ({
  candidate,
  position,
  allPositions,
  topPerformers = [],
  teamComposition,
  offeredSalary,
}) => {
  const [analysis, setAnalysis] = useState<AdvancedCandidateAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  useEffect(() => {
    performAnalysis();
  }, [candidate.id]);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await AdvancedAnalysisService.performFullAdvancedAnalysis(
        candidate,
        position,
        allPositions,
        topPerformers,
        teamComposition,
        offeredSalary
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to perform advanced analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getConfidenceColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (score: number): string => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <span className="text-dark-muted">Performing advanced analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 text-dark-muted">
        Failed to perform analysis. Please try again.
      </div>
    );
  }

  const SectionHeader = ({ title, icon: Icon, isExpanded, onToggle }: any) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-dark-bg/50 border border-dark-border rounded-lg hover:bg-dark-bg/70 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-dark-text">{title}</h3>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-dark-muted" />
      ) : (
        <ChevronDown className="w-5 h-5 text-dark-muted" />
      )}
    </button>
  );

  const ScoreBadge = ({ score, label }: { score: number; label?: string }) => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getConfidenceBg(score)}`}>
      <span className={`font-semibold ${getConfidenceColor(score)}`}>{score}%</span>
      {label && <span className="ml-2 text-xs text-dark-muted">{label}</span>}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Summary Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">Advanced Analysis Report</h2>
            <p className="text-dark-muted">Comprehensive AI-driven candidate evaluation</p>
          </div>
          <ScoreBadge score={analysis.hiringConfidence} label="Confidence" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
            <div className="text-xs text-dark-muted mb-1">Recommendation</div>
            <div className="font-semibold text-dark-text">{analysis.overallRecommendation}</div>
          </div>
          <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
            <div className="text-xs text-dark-muted mb-1">Unique Value</div>
            <div className="font-semibold text-dark-text">{analysis.uniqueValue}</div>
          </div>
          <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
            <div className="text-xs text-dark-muted mb-1">Analyzed</div>
            <div className="font-semibold text-dark-text">
              {new Date(analysis.analyzedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.opportunities.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-green-400">Opportunities</span>
              </div>
              <ul className="space-y-1">
                {analysis.opportunities.map((opp, idx) => (
                  <li key={idx} className="text-sm text-dark-text">• {opp}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.risks.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-red-400">Risks</span>
              </div>
              <ul className="space-y-1">
                {analysis.risks.map((risk, idx) => (
                  <li key={idx} className="text-sm text-dark-text">• {risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Top Performer Match */}
      {analysis.topPerformerMatch && (
        <div className="space-y-2">
          <SectionHeader
            title="Top Performer Similarity"
            icon={Award}
            isExpanded={expandedSections.has('topPerformer')}
            onToggle={() => toggleSection('topPerformer')}
          />
          {expandedSections.has('topPerformer') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-dark-text mb-1">Overall Similarity</h4>
                  <p className="text-sm text-dark-muted">{analysis.topPerformerMatch.recommendation}</p>
                </div>
                <ScoreBadge score={analysis.topPerformerMatch.overallSimilarity} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(analysis.topPerformerMatch.matchDetails).map(([key, value]) => (
                  <div key={key} className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border">
                    <div className="text-xs text-dark-muted mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className={`text-lg font-bold ${getConfidenceColor(value)}`}>{value}%</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-dark-text mb-2">Strengths</h5>
                  <ul className="space-y-1">
                    {analysis.topPerformerMatch.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-dark-text flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-dark-text mb-2">Gaps</h5>
                  <ul className="space-y-1">
                    {analysis.topPerformerMatch.gaps.map((gap, idx) => (
                      <li key={idx} className="text-sm text-dark-text flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Career Momentum */}
      {analysis.careerMomentum && (
        <div className="space-y-2">
          <SectionHeader
            title="Career Momentum & Trajectory"
            icon={TrendingUp}
            isExpanded={expandedSections.has('momentum')}
            onToggle={() => toggleSection('momentum')}
          />
          {expandedSections.has('momentum') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-1">Trajectory</div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`w-5 h-5 ${
                      analysis.careerMomentum.trajectory === 'ACCELERATING' ? 'text-green-400' :
                      analysis.careerMomentum.trajectory === 'STEADY' ? 'text-blue-400' :
                      'text-yellow-400'
                    }`} />
                    <span className="font-semibold text-dark-text">{analysis.careerMomentum.trajectory}</span>
                  </div>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-1">Velocity Score</div>
                  <ScoreBadge score={analysis.careerMomentum.velocityScore} />
                </div>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                <h5 className="font-semibold text-dark-text mb-2">Projected Path</h5>
                <p className="text-sm text-dark-muted">{analysis.careerMomentum.projectedPath}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-green-400 mb-2 text-sm">Positive Factors</h5>
                  <ul className="space-y-1">
                    {analysis.careerMomentum.momentumFactors.positive.map((factor, idx) => (
                      <li key={idx} className="text-xs text-dark-text">+ {factor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-red-400 mb-2 text-sm">Negative Factors</h5>
                  <ul className="space-y-1">
                    {analysis.careerMomentum.momentumFactors.negative.map((factor, idx) => (
                      <li key={idx} className="text-xs text-dark-text">- {factor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-dark-muted mb-2 text-sm">Opportunities</h5>
                  <ul className="space-y-1">
                    {analysis.careerMomentum.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-xs text-dark-text">• {opp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reverse Matching */}
      {analysis.reverseMatching && (
        <div className="space-y-2">
          <SectionHeader
            title="Role Fit Analysis"
            icon={Target}
            isExpanded={expandedSections.has('reverseMatch')}
            onToggle={() => toggleSection('reverseMatch')}
          />
          {expandedSections.has('reverseMatch') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div>
                <h5 className="font-semibold text-dark-text mb-3">Best Fit Roles</h5>
                <div className="space-y-2">
                  {analysis.reverseMatching.bestFitRoles.slice(0, 3).map((role, idx) => (
                    <div key={idx} className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-dark-text">{role.positionTitle}</span>
                          <span className="text-sm text-dark-muted ml-2">• {role.department}</span>
                        </div>
                        <ScoreBadge score={role.fitScore} />
                      </div>
                      <p className="text-sm text-dark-muted mb-2">{role.reasoning}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-dark-muted">Time to productivity: <strong className="text-dark-text">{role.timeToProductivity}</strong></span>
                        <span className="text-dark-muted">Confidence: <strong className={getConfidenceColor(role.confidenceLevel)}>{role.confidenceLevel}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.reverseMatching.surprisingMatches.length > 0 && (
                <div>
                  <h5 className="font-semibold text-dark-text mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    Surprising Matches
                  </h5>
                  <div className="space-y-2">
                    {analysis.reverseMatching.surprisingMatches.map((role, idx) => (
                      <div key={idx} className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-dark-text">{role.positionTitle}</span>
                          <ScoreBadge score={role.fitScore} />
                        </div>
                        <p className="text-sm text-dark-muted mt-1">{role.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Flight Risk */}
      {analysis.flightRisk && (
        <div className="space-y-2">
          <SectionHeader
            title="Flight Risk & Counter-Offer Assessment"
            icon={AlertTriangle}
            isExpanded={expandedSections.has('flightRisk')}
            onToggle={() => toggleSection('flightRisk')}
          />
          {expandedSections.has('flightRisk') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-2">Flight Risk Score</div>
                  <ScoreBadge score={analysis.flightRisk.flightRiskScore} />
                  <p className="text-xs text-dark-muted mt-2">Likelihood of leaving current job</p>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-2">Counter-Offer Probability</div>
                  <ScoreBadge score={analysis.flightRisk.counterOfferProbability} />
                  <p className="text-xs text-dark-muted mt-2">
                    Est. range: {analysis.flightRisk.counterOfferLikelihood.estimatedCounterOfferRange.currency}{' '}
                    {analysis.flightRisk.counterOfferLikelihood.estimatedCounterOfferRange.min.toLocaleString()} - {' '}
                    {analysis.flightRisk.counterOfferLikelihood.estimatedCounterOfferRange.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-dark-text mb-3">Mitigation Strategies</h5>
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <ul className="space-y-2">
                    {analysis.flightRisk.mitigationStrategies.map((strategy, idx) => (
                      <li key={idx} className="text-sm text-dark-text flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-dark-border">
                    <span className="text-sm font-semibold text-primary">
                      Best timing: {analysis.flightRisk.bestApproachTiming}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interview Questions */}
      {analysis.interviewQuestions && (
        <div className="space-y-2">
          <SectionHeader
            title="Tailored Interview Questions"
            icon={FileText}
            isExpanded={expandedSections.has('interview')}
            onToggle={() => toggleSection('interview')}
          />
          {expandedSections.has('interview') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-dark-text">{analysis.interviewQuestions.questions.length} Questions</h5>
                  <p className="text-sm text-dark-muted">Est. duration: {analysis.interviewQuestions.estimatedDuration} minutes</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.interviewQuestions.focusAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {area.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {analysis.interviewQuestions.questions.slice(0, 5).map((q, idx) => (
                  <div key={q.id} className={`rounded-lg p-4 border ${
                    q.priority === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                    q.priority === 'IMPORTANT' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-dark-bg/50 border-dark-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-dark-text">
                            {q.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-dark-muted">{q.difficulty}</span>
                        </div>
                        <p className="text-sm font-semibold text-dark-text">{q.question}</p>
                      </div>
                    </div>
                    <p className="text-xs text-dark-muted mb-2"><em>Why ask: {q.reasoning}</em></p>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-primary hover:underline">Show ideal answer & red flags</summary>
                      <div className="mt-2 space-y-1">
                        <div>
                          <strong className="text-green-400">Looking for:</strong>
                          <ul className="ml-4 mt-1">
                            {q.lookingFor.map((item, i) => (
                              <li key={i} className="text-dark-text">• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-red-400">Red flags:</strong>
                          <ul className="ml-4 mt-1">
                            {q.redFlags.map((item, i) => (
                              <li key={i} className="text-dark-text">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Team Chemistry */}
      {analysis.teamChemistry && (
        <div className="space-y-2">
          <SectionHeader
            title="Team Chemistry Prediction"
            icon={Users}
            isExpanded={expandedSections.has('teamChem')}
            onToggle={() => toggleSection('teamChem')}
          />
          {expandedSections.has('teamChem') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-dark-text">Overall Chemistry Score</h5>
                <ScoreBadge score={analysis.teamChemistry.overallChemistryScore} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <h6 className="font-semibold text-dark-text mb-2">Working Style Compatibility</h6>
                  <ScoreBadge score={analysis.teamChemistry.workingStyleCompatibility.compatibility} />
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="text-xs text-dark-muted">Candidate Style</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.teamChemistry.workingStyleCompatibility.candidateStyle.map((style, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <h6 className="font-semibold text-dark-text mb-2">Diversity Impact</h6>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dark-muted">Skill Diversity</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(analysis.teamChemistry.diversityImpact.skillDiversity)}`}>
                        {analysis.teamChemistry.diversityImpact.skillDiversity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dark-muted">Background Diversity</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(analysis.teamChemistry.diversityImpact.backgroundDiversity)}`}>
                        {analysis.teamChemistry.diversityImpact.backgroundDiversity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dark-muted">Thought Diversity</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(analysis.teamChemistry.diversityImpact.thoughtDiversity)}`}>
                        {analysis.teamChemistry.diversityImpact.thoughtDiversity}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                <h6 className="font-semibold text-dark-text mb-2">Integration Timeline</h6>
                <p className="text-dark-muted">{analysis.teamChemistry.integrationTimeline}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offer Acceptance */}
      {analysis.offerAcceptance && (
        <div className="space-y-2">
          <SectionHeader
            title="Offer Acceptance Prediction"
            icon={DollarSign}
            isExpanded={expandedSections.has('offerAcceptance')}
            onToggle={() => toggleSection('offerAcceptance')}
          />
          {expandedSections.has('offerAcceptance') && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-2">Acceptance Probability</div>
                  <ScoreBadge score={analysis.offerAcceptance.acceptanceProbability} />
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-2">Negotiation Likelihood</div>
                  <ScoreBadge score={analysis.offerAcceptance.negotiationLikelihood} />
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                  <div className="text-xs text-dark-muted mb-2">Decision Timeline</div>
                  <div className="font-semibold text-dark-text">{analysis.offerAcceptance.decisionTimeline}</div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h6 className="font-semibold text-primary mb-2">Closing Strategy</h6>
                <p className="text-sm text-dark-text">{analysis.offerAcceptance.closingStrategy}</p>
              </div>

              <div className="space-y-3">
                {analysis.offerAcceptance.optimizationSuggestions.strengthenOffer.length > 0 && (
                  <div>
                    <h6 className="font-semibold text-dark-text mb-2 text-sm">Strengthen Offer</h6>
                    <ul className="space-y-1">
                      {analysis.offerAcceptance.optimizationSuggestions.strengthenOffer.map((item, idx) => (
                        <li key={idx} className="text-sm text-dark-muted flex items-start">
                          <Star className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.offerAcceptance.optimizationSuggestions.emphasize.length > 0 && (
                  <div>
                    <h6 className="font-semibold text-dark-text mb-2 text-sm">Emphasize</h6>
                    <div className="flex flex-wrap gap-2">
                      {analysis.offerAcceptance.optimizationSuggestions.emphasize.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-dark-bg border border-dark-border text-dark-text text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <h5 className="font-semibold text-dark-text mb-4 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
          Recommended Next Steps
        </h5>
        <div className="space-y-2">
          {analysis.nextSteps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3 bg-dark-bg/50 rounded-lg border border-dark-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                {idx + 1}
              </div>
              <span className="text-dark-text">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
