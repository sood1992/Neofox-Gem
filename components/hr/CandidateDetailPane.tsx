import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Link2,
  AlertTriangle, Award, Star, MessageSquare, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronRight, ExternalLink, FileText, Sparkles,
  Target, TrendingUp, TrendingDown, Zap, BookOpen, Users,
  CheckCircle, XCircle, HelpCircle, RefreshCw, Download, Share2,
  Linkedin, Github, Globe, GraduationCap, Building, DollarSign
} from 'lucide-react';
import {
  Candidate, JobPosition, CandidateStatus, CandidateNote, TeamRating,
  RedFlag, Strength, InterviewQuestion
} from '../../hrTypes';
import { HRStorageService } from '../../services/hrStorageService';
import { CandidateAnalysisService } from '../../services/candidateAnalysisService';

interface CandidateDetailPaneProps {
  candidate: Candidate;
  position: JobPosition;
  currentUser: { id: string; name: string; avatar: string };
  onClose: () => void;
  onUpdate: (candidate: Candidate) => void;
}

type TabType = 'overview' | 'analysis' | 'experience' | 'skills' | 'notes' | 'interview';

export const CandidateDetailPane: React.FC<CandidateDetailPaneProps> = ({
  candidate,
  position,
  currentUser,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'GENERAL' | 'FEEDBACK' | 'CONCERN' | 'POSITIVE'>('GENERAL');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary', 'scores']));
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);

  useEffect(() => {
    if (candidate.analysis?.interviewQuestions) {
      setInterviewQuestions(candidate.analysis.interviewQuestions);
    }
  }, [candidate]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await CandidateAnalysisService.analyzeCandidate(candidate, position);
      if (analysis) {
        const updated = {
          ...candidate,
          analysis,
          overallScore: analysis.overallFitScore,
          skillMatchScore: analysis.skillsAnalysis?.skillStrengthScore || candidate.skillMatchScore,
          experienceScore: analysis.fitBreakdown?.experienceFit || candidate.experienceScore,
          culturalFitScore: analysis.fitBreakdown?.culturalFit || candidate.culturalFitScore,
          aiSummary: analysis.narrativeSummary,
          aiRecommendation: getRecommendation(analysis.overallFitScore),
          lastUpdated: new Date().toISOString()
        };
        onUpdate(updated);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const generateQuestions = async () => {
    setIsAnalyzing(true);
    try {
      const questions = await CandidateAnalysisService.generateInterviewQuestions(candidate, position);
      setInterviewQuestions(questions);
    } catch (error) {
      console.error('Question generation failed:', error);
    }
    setIsAnalyzing(false);
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: Omit<CandidateNote, 'id' | 'candidateId' | 'createdAt' | 'reactions'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newNote,
      type: noteType,
      isPrivate: false,
      mentions: []
    };

    HRStorageService.addCandidateNote(candidate.id, note);
    const updated = HRStorageService.getCandidateById(candidate.id);
    if (updated) onUpdate(updated);
    setNewNote('');
  };

  const updateStatus = (status: CandidateStatus) => {
    onUpdate({ ...candidate, status, lastUpdated: new Date().toISOString() });
  };

  const getRecommendation = (score: number): 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'NEUTRAL' | 'NOT_RECOMMEND' | 'STRONGLY_NOT_RECOMMEND' => {
    if (score >= 85) return 'STRONGLY_RECOMMEND';
    if (score >= 70) return 'RECOMMEND';
    if (score >= 50) return 'NEUTRAL';
    if (score >= 30) return 'NOT_RECOMMEND';
    return 'STRONGLY_NOT_RECOMMEND';
  };

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

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Target className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-[700px] bg-dark-card border-l border-dark-border shadow-2xl z-40 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-dark-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-text">
                {candidate.firstName} {candidate.lastName}
              </h2>
              <p className="text-dark-muted">{candidate.currentTitle}</p>
              {candidate.currentCompany && (
                <p className="text-sm text-dark-muted flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {candidate.currentCompany}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center gap-4 text-sm text-dark-muted flex-wrap">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {candidate.email}
          </span>
          {candidate.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {candidate.phone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {candidate.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {candidate.totalYearsExperience} years
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2 mt-3">
          {candidate.linkedinUrl && (
            <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-[#0077B5]/10 text-[#0077B5] rounded-lg hover:bg-[#0077B5]/20 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {candidate.githubUrl && (
            <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-dark-bg text-dark-text rounded-lg hover:bg-dark-border transition-all">
              <Github className="w-4 h-4" />
            </a>
          )}
          {candidate.portfolioUrl && (
            <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-dark-bg text-dark-muted rounded-lg hover:bg-dark-border transition-all">
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-dark-muted">Status:</span>
          <select
            value={candidate.status}
            onChange={(e) => updateStatus(e.target.value as CandidateStatus)}
            className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm text-dark-text focus:border-primary outline-none"
          >
            {Object.values(CandidateStatus).map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-2 border-b border-dark-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === tab.id
              ? 'bg-primary text-white'
              : 'text-dark-muted hover:text-dark-text hover:bg-dark-bg'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Scores Overview */}
            <CollapsibleSection
              title="Scores"
              icon={<Target className="w-5 h-5" />}
              isExpanded={expandedSections.has('scores')}
              onToggle={() => toggleSection('scores')}
            >
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard
                  label="Overall Score"
                  score={candidate.overallScore}
                  size="large"
                />
                <div className="space-y-3">
                  <ScoreBar label="Skills Match" score={candidate.skillMatchScore} />
                  <ScoreBar label="Experience" score={candidate.experienceScore} />
                  <ScoreBar label="Cultural Fit" score={candidate.culturalFitScore} />
                </div>
              </div>
            </CollapsibleSection>

            {/* AI Summary */}
            {candidate.aiSummary && (
              <CollapsibleSection
                title="AI Summary"
                icon={<Sparkles className="w-5 h-5 text-purple-500" />}
                isExpanded={expandedSections.has('summary')}
                onToggle={() => toggleSection('summary')}
              >
                <p className="text-dark-text leading-relaxed">{candidate.aiSummary}</p>

                {candidate.analysis?.whyGoodFit && candidate.analysis.whyGoodFit.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-green-500 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Why Good Fit
                    </h4>
                    <ul className="space-y-1">
                      {candidate.analysis.whyGoodFit.map((reason, i) => (
                        <li key={i} className="text-sm text-dark-muted flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {candidate.analysis?.whyNotGoodFit && candidate.analysis.whyNotGoodFit.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Concerns
                    </h4>
                    <ul className="space-y-1">
                      {candidate.analysis.whyNotGoodFit.map((concern, i) => (
                        <li key={i} className="text-sm text-dark-muted flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CollapsibleSection>
            )}

            {/* Red Flags */}
            {candidate.redFlags && candidate.redFlags.length > 0 && (
              <CollapsibleSection
                title={`Red Flags (${candidate.redFlags.length})`}
                icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
                isExpanded={expandedSections.has('redflags')}
                onToggle={() => toggleSection('redflags')}
              >
                <div className="space-y-3">
                  {candidate.redFlags.map(flag => (
                    <RedFlagCard key={flag.id} flag={flag} />
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Strengths */}
            {candidate.strengths && candidate.strengths.length > 0 && (
              <CollapsibleSection
                title={`Strengths (${candidate.strengths.length})`}
                icon={<Award className="w-5 h-5 text-green-500" />}
                isExpanded={expandedSections.has('strengths')}
                onToggle={() => toggleSection('strengths')}
              >
                <div className="space-y-3">
                  {candidate.strengths.map(strength => (
                    <StrengthCard key={strength.id} strength={strength} />
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Salary Expectations */}
            {(candidate.salaryExpectation || candidate.analysis?.salaryAnalysis) && (
              <CollapsibleSection
                title="Compensation"
                icon={<DollarSign className="w-5 h-5 text-green-500" />}
                isExpanded={expandedSections.has('salary')}
                onToggle={() => toggleSection('salary')}
              >
                <div className="space-y-3">
                  {candidate.salaryExpectation && (
                    <div className="flex items-center justify-between">
                      <span className="text-dark-muted">Candidate Expectation</span>
                      <span className="text-dark-text font-semibold">
                        ${candidate.salaryExpectation.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-dark-muted">Position Budget</span>
                    <span className="text-dark-text">
                      ${position.salaryMin.toLocaleString()} - ${position.salaryMax.toLocaleString()}
                    </span>
                  </div>
                  {candidate.analysis?.salaryAnalysis && (
                    <div className={`p-3 rounded-lg ${candidate.analysis.salaryAnalysis.alignment === 'WITHIN' ? 'bg-green-500/10 text-green-500' :
                      candidate.analysis.salaryAnalysis.alignment === 'ABOVE' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                      <p className="text-sm">{candidate.analysis.salaryAnalysis.recommendation}</p>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {candidate.analysis ? (
              <>
                {/* Fit Breakdown */}
                <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                  <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Fit Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(candidate.analysis.fitBreakdown || {}).map(([key, value]) => (
                      <ScoreBar
                        key={key}
                        label={key.replace(/([A-Z])/g, ' $1').replace('Fit', '').trim()}
                        score={value as number}
                      />
                    ))}
                  </div>
                </div>

                {/* Career Trajectory */}
                {candidate.analysis.careerTrajectory && (
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Career Trajectory
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-dark-muted">Pattern:</span>
                        <span className={`ml-2 font-medium ${candidate.analysis.careerTrajectory.pattern === 'ASCENDING' ? 'text-green-500' :
                          candidate.analysis.careerTrajectory.pattern === 'STABLE' ? 'text-blue-500' :
                            'text-yellow-500'
                          }`}>
                          {candidate.analysis.careerTrajectory.pattern}
                        </span>
                      </div>
                      <div>
                        <span className="text-dark-muted">Stability:</span>
                        <span className="ml-2 text-dark-text">{candidate.analysis.careerTrajectory.stability}</span>
                      </div>
                      <div>
                        <span className="text-dark-muted">Avg Tenure:</span>
                        <span className="ml-2 text-dark-text">{candidate.analysis.careerTrajectory.avgTenure} years</span>
                      </div>
                      <div>
                        <span className="text-dark-muted">Job Changes:</span>
                        <span className="ml-2 text-dark-text">{candidate.analysis.careerTrajectory.jobChanges}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-dark-muted">
                      {candidate.analysis.careerTrajectory.prediction}
                    </p>
                  </div>
                )}

                {/* Requirement Match Matrix */}
                {candidate.analysis.requirementMatchMatrix && candidate.analysis.requirementMatchMatrix.length > 0 && (
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Requirement Match
                    </h3>
                    <div className="space-y-2">
                      {candidate.analysis.requirementMatchMatrix.map((req, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                          <div className="flex items-center gap-2">
                            {req.matched ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-dark-text text-sm">{req.requirement}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${req.type === 'REQUIRED' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'
                              }`}>
                              {req.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-dark-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${req.matchLevel >= 70 ? 'bg-green-500' : req.matchLevel >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${req.matchLevel}%` }}
                              />
                            </div>
                            <span className="text-xs text-dark-muted w-8">{req.matchLevel}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-dark-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-text mb-2">No Analysis Available</h3>
                <p className="text-dark-muted mb-4">Run AI analysis to get detailed insights</p>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            {candidate.parsedData?.workExperience && candidate.parsedData.workExperience.length > 0 ? (
              <div className="space-y-4">
                {candidate.parsedData.workExperience.map((exp, i) => (
                  <div key={exp.id || i} className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-dark-text">{exp.title}</h4>
                        <p className="text-dark-muted flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-sm text-dark-muted">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-sm text-dark-muted">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.achievements.map((achievement, j) => (
                          <li key={j} className="text-sm text-dark-text flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-dark-muted">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No work experience data available</p>
              </div>
            )}

            {/* Education */}
            {candidate.parsedData?.education && candidate.parsedData.education.length > 0 && (
              <div>
                <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {candidate.parsedData.education.map((edu, i) => (
                    <div key={edu.id || i} className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                      <h4 className="font-semibold text-dark-text">{edu.degree} in {edu.field}</h4>
                      <p className="text-dark-muted">{edu.institution}</p>
                      <p className="text-sm text-dark-muted">
                        {edu.startDate} - {edu.endDate}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skills from Analysis */}
            {candidate.analysis?.skillsAnalysis && (
              <>
                {/* Matched Skills */}
                {candidate.analysis.skillsAnalysis.matchedSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Matched Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.analysis.skillsAnalysis.matchedSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm flex items-center gap-1"
                        >
                          {skill.skill}
                          <span className="text-xs opacity-70">({skill.matchPercentage}%)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {candidate.analysis.skillsAnalysis.missingSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.analysis.skillsAnalysis.missingSkills.map((skill, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${skill.required ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}
                        >
                          {skill.skill}
                          <span className="text-xs opacity-70">({skill.importance})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Skills */}
                {candidate.analysis.skillsAnalysis.additionalSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Additional Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.analysis.skillsAnalysis.additionalSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Raw Skills from Resume */}
            {candidate.parsedData?.skills && candidate.parsedData.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  All Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.parsedData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-dark-bg border border-dark-border text-dark-text rounded-lg text-sm"
                    >
                      {skill.name}
                      {skill.proficiencyLevel && (
                        <span className="text-xs text-dark-muted ml-1">({skill.proficiencyLevel})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-dark-text flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Interview Questions
              </h3>
              <button
                onClick={generateQuestions}
                disabled={isAnalyzing}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm flex items-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Questions
              </button>
            </div>

            {interviewQuestions.length > 0 ? (
              <div className="space-y-4">
                {interviewQuestions.map((q, i) => (
                  <div key={i} className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-dark-text font-medium">{q.question}</p>
                        <p className="text-sm text-dark-muted mt-2">{q.purpose}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${q.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' :
                          q.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}>
                          {q.priority}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          {q.category}
                        </span>
                      </div>
                    </div>
                    {q.relatedTo && (
                      <p className="text-xs text-dark-muted mt-2">
                        Related to: {q.relatedTo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-dark-muted">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No interview questions generated yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Add Note */}
            <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-3">
                <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm text-dark-text font-medium">{currentUser.name}</span>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this candidate..."
                rows={3}
                className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:border-primary outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as typeof noteType)}
                  className="bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-sm text-dark-text"
                >
                  <option value="GENERAL">General</option>
                  <option value="FEEDBACK">Feedback</option>
                  <option value="CONCERN">Concern</option>
                  <option value="POSITIVE">Positive</option>
                </select>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg text-sm transition-all"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Notes List */}
            {candidate.notes && candidate.notes.length > 0 ? (
              <div className="space-y-3">
                {candidate.notes.map(note => (
                  <div key={note.id} className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <div className="flex items-start gap-3">
                      <img src={note.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-dark-text text-sm">{note.userName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${note.type === 'CONCERN' ? 'bg-red-500/10 text-red-500' :
                            note.type === 'POSITIVE' ? 'bg-green-500/10 text-green-500' :
                              note.type === 'FEEDBACK' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-gray-500/10 text-gray-500'
                            }`}>
                            {note.type}
                          </span>
                          <span className="text-xs text-dark-muted">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-dark-text text-sm mt-2">{note.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notes yet. Be the first to add one!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isExpanded, onToggle, children }) => (
  <div className="bg-dark-bg rounded-xl border border-dark-border overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-4 flex items-center justify-between hover:bg-dark-card transition-colors"
    >
      <span className="font-semibold text-dark-text flex items-center gap-2">
        {icon}
        {title}
      </span>
      {isExpanded ? <ChevronDown className="w-5 h-5 text-dark-muted" /> : <ChevronRight className="w-5 h-5 text-dark-muted" />}
    </button>
    {isExpanded && <div className="p-4 pt-0">{children}</div>}
  </div>
);

const ScoreCard: React.FC<{ label: string; score: number; size?: 'normal' | 'large' }> = ({ label, score, size = 'normal' }) => {
  const getColor = (s: number) => s >= 80 ? 'text-green-500' : s >= 60 ? 'text-yellow-500' : s >= 40 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="bg-dark-card rounded-xl p-4 border border-dark-border text-center">
      <div className={`font-bold ${getColor(score)} ${size === 'large' ? 'text-4xl' : 'text-2xl'}`}>
        {score}
      </div>
      <div className="text-sm text-dark-muted mt-1">{label}</div>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getColor = (s: number) => s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-yellow-500' : s >= 40 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-dark-muted w-24">{label}</span>
      <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
        <div className={`h-full ${getColor(score)} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-medium text-dark-text w-10">{score}%</span>
    </div>
  );
};

const RedFlagCard: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  const severityColors = {
    CRITICAL: 'bg-red-500/10 border-red-500/30 text-red-500',
    HIGH: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
    MEDIUM: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
    LOW: 'bg-gray-500/10 border-gray-500/30 text-gray-500'
  };

  return (
    <div className={`p-3 rounded-lg border ${severityColors[flag.severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium text-sm">{flag.title}</span>
        </div>
        <span className="text-xs uppercase font-medium">{flag.severity}</span>
      </div>
      <p className="text-sm mt-2 opacity-80">{flag.description}</p>
    </div>
  );
};

const StrengthCard: React.FC<{ strength: Strength }> = ({ strength }) => {
  const strengthColors = {
    EXCEPTIONAL: 'bg-green-500/10 border-green-500/30 text-green-500',
    STRONG: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    MODERATE: 'bg-blue-500/10 border-blue-500/30 text-blue-500'
  };

  return (
    <div className={`p-3 rounded-lg border ${strengthColors[strength.strength]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="font-medium text-sm">{strength.title}</span>
        </div>
        <span className="text-xs uppercase font-medium">{strength.strength}</span>
      </div>
      <p className="text-sm mt-2 opacity-80">{strength.description}</p>
    </div>
  );
};
