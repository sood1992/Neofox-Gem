import React, { useState, useEffect } from 'react';
import { Candidate, JobPosition, CandidateAnalysis, CandidateStatus, Note, User } from '../types';
import { StorageService } from '../services/storageService';
import { AIAnalysisService } from '../services/aiAnalysisService';
import { format } from 'date-fns';

interface CandidateDetailViewProps {
  candidate: Candidate;
  position?: JobPosition;
  onClose: () => void;
  onUpdate: (candidate: Candidate) => void;
  currentUser: User;
}

export const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({
  candidate,
  position,
  onClose,
  onUpdate,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'activity'>('overview');
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | undefined>(position);

  const positions = StorageService.getPositions();

  useEffect(() => {
    if (selectedPosition) {
      const existingAnalysis = StorageService.getAnalysis(candidate.id, selectedPosition.id);
      setAnalysis(existingAnalysis || null);
    }
  }, [candidate.id, selectedPosition]);

  const handleAnalyze = async () => {
    if (!selectedPosition) return;

    setIsAnalyzing(true);
    try {
      const result = await AIAnalysisService.analyzeCandidate(candidate, selectedPosition);
      StorageService.saveAnalysis(result);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const note: Note = {
      id: StorageService.generateId('note'),
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: noteText,
      createdAt: new Date().toISOString(),
      isPrivate: false,
      tags: []
    };

    const updatedCandidate = {
      ...candidate,
      notes: [...candidate.notes, note]
    };

    onUpdate(updatedCandidate);
    setNoteText('');
  };

  const handleStatusChange = (newStatus: CandidateStatus) => {
    onUpdate({ ...candidate, status: newStatus });
  };

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

  const ScoreBar: React.FC<{ label: string; score: number; color?: string }> = ({ label, score, color = 'primary' }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-dark-text">{label}</span>
        <span className="text-sm font-bold text-primary">{score}/100</span>
      </div>
      <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-dark-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-hover p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random&size=80`}
                alt={`${candidate.firstName} ${candidate.lastName}`}
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <p className="text-white/90 mb-2">{candidate.currentJobTitle || 'Candidate'}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {candidate.totalYearsExperience} years exp
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {candidate.experienceLevel}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-border bg-dark-bg px-6">
          <div className="flex gap-6">
            {(['overview', 'analysis', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-dark-muted hover:text-dark-text'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-bg rounded-lg p-4">
                  <h3 className="font-semibold text-dark-text mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">{candidate.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-dark-text">{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-dark-text">{candidate.location}</span>
                    </div>
                    {candidate.linkedinUrl && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-dark-muted" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">LinkedIn Profile</a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-dark-bg rounded-lg p-4">
                  <h3 className="font-semibold text-dark-text mb-4">Professional Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-dark-muted">Expected Salary:</span>
                      <span className="ml-2 text-dark-text font-medium">
                        ${candidate.expectedSalary?.toLocaleString() || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Notice Period:</span>
                      <span className="ml-2 text-dark-text font-medium">{candidate.noticePeriod || 0} days</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Willing to Relocate:</span>
                      <span className="ml-2 text-dark-text font-medium">{candidate.willingToRelocate ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Source:</span>
                      <span className="ml-2 text-dark-text font-medium">{candidate.source}</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(candidate.status)}`}>
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-dark-bg rounded-lg p-4">
                <h3 className="font-semibold text-dark-text mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-dark-bg rounded-lg p-4">
                <h3 className="font-semibold text-dark-text mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {candidate.workExperience.map((exp, index) => (
                    <div key={exp.id} className="border-l-2 border-primary pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-dark-text">{exp.position}</h4>
                          <p className="text-sm text-dark-muted">{exp.company} • {exp.location}</p>
                        </div>
                        <span className="text-xs text-dark-muted">
                          {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.current ? 'Present' : format(new Date(exp.endDate), 'MMM yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-dark-text mb-2">{exp.description}</p>
                      {exp.achievements.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-dark-muted space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-dark-bg rounded-lg p-4">
                <h3 className="font-semibold text-dark-text mb-4">Education</h3>
                <div className="space-y-4">
                  {candidate.education.map((edu) => (
                    <div key={edu.id}>
                      <h4 className="font-medium text-dark-text">{edu.degree} in {edu.field}</h4>
                      <p className="text-sm text-dark-muted mb-1">{edu.institution}</p>
                      <p className="text-xs text-dark-muted">
                        {format(new Date(edu.startDate), 'yyyy')} - {edu.current ? 'Present' : format(new Date(edu.endDate), 'yyyy')}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Position Selector */}
              <div className="bg-dark-bg rounded-lg p-4">
                <label className="block text-sm font-medium text-dark-text mb-2">Analyze for Position:</label>
                <div className="flex gap-3">
                  <select
                    value={selectedPosition?.id || ''}
                    onChange={(e) => setSelectedPosition(positions.find(p => p.id === e.target.value))}
                    className="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                  >
                    <option value="">Select a position</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedPosition || isAnalyzing}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>

              {analysis && (
                <>
                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-primary to-primary-hover rounded-lg p-6 text-white text-center">
                    <div className="text-6xl font-bold mb-2">{analysis.overallScore}</div>
                    <div className="text-xl font-medium mb-1">{analysis.overallFit}</div>
                    <div className="text-sm text-white/80">Overall Match Score</div>
                  </div>

                  {/* Recommendation */}
                  <div className={`rounded-lg p-4 border ${
                    analysis.recommendation === 'STRONG_YES' ? 'bg-green-500/10 border-green-500/20' :
                    analysis.recommendation === 'INTERVIEW' ? 'bg-blue-500/10 border-blue-500/20' :
                    analysis.recommendation === 'MAYBE' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-red-500/10 border-red-500/20'
                  }`}>
                    <h3 className="font-semibold text-dark-text mb-2">Recommendation: {analysis.recommendation.replace('_', ' ')}</h3>
                    <p className="text-dark-text text-sm">{analysis.reasoning}</p>
                  </div>

                  {/* Detailed Scores */}
                  <div className="bg-dark-bg rounded-lg p-4">
                    <h3 className="font-semibold text-dark-text mb-4">Detailed Evaluation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ScoreBar label="Technical Skills" score={analysis.scores.technicalSkills.score} />
                        <ScoreBar label="Experience" score={analysis.scores.experience.score} />
                        <ScoreBar label="Education" score={analysis.scores.education.score} />
                        <ScoreBar label="Cultural Fit" score={analysis.scores.culturalFit.score} />
                        <ScoreBar label="Communication" score={analysis.scores.communication.score} />
                      </div>
                      <div>
                        <ScoreBar label="Leadership Potential" score={analysis.scores.leadershipPotential.score} />
                        <ScoreBar label="Career Progression" score={analysis.scores.careerProgression.score} />
                        <ScoreBar label="Salary Alignment" score={analysis.scores.salaryAlignment.score} />
                        <ScoreBar label="Availability" score={analysis.scores.availability.score} />
                        <ScoreBar label="Location Fit" score={analysis.scores.locationFit.score} />
                      </div>
                    </div>
                  </div>

                  {/* Skills Gap Analysis */}
                  <div className="bg-dark-bg rounded-lg p-4">
                    <h3 className="font-semibold text-dark-text mb-4">Skills Gap Analysis</h3>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-dark-text">Overall Skills Match</span>
                        <span className="text-lg font-bold text-primary">{analysis.skillsGapAnalysis.overallSkillMatch}%</span>
                      </div>
                      <div className="w-full h-3 bg-dark-card rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${analysis.skillsGapAnalysis.overallSkillMatch}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-500 mb-2">✓ Required Skills Met ({analysis.skillsGapAnalysis.requiredSkillsMet.length})</h4>
                        <div className="space-y-2">
                          {analysis.skillsGapAnalysis.requiredSkillsMet.map(skill => (
                            <div key={skill.skill} className="text-sm">
                              <span className="font-medium text-dark-text">{skill.skill}</span>
                              <span className="text-dark-muted ml-2">({skill.proficiencyLevel})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-500 mb-2">✗ Required Skills Missing ({analysis.skillsGapAnalysis.requiredSkillsMissing.length})</h4>
                        <div className="space-y-2">
                          {analysis.skillsGapAnalysis.requiredSkillsMissing.map(skill => (
                            <div key={skill.skill} className="text-sm">
                              <span className="font-medium text-dark-text">{skill.skill}</span>
                              <span className="text-dark-muted ml-2">({skill.importance})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {analysis.redFlags.length > 0 && (
                    <div className="bg-danger/5 rounded-lg p-4 border border-danger/20">
                      <h3 className="font-semibold text-danger mb-4">Red Flags ({analysis.redFlags.length})</h3>
                      <div className="space-y-3">
                        {analysis.redFlags.map(flag => (
                          <div key={flag.id} className="border-l-4 border-danger pl-4">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-dark-text">{flag.title}</h4>
                              <span className="px-2 py-0.5 bg-danger/20 text-danger text-xs rounded">{flag.severity}</span>
                            </div>
                            <p className="text-sm text-dark-muted mb-1">{flag.description}</p>
                            <p className="text-xs text-dark-text"><strong>Impact:</strong> {flag.impact}</p>
                            <p className="text-xs text-dark-text"><strong>Recommendation:</strong> {flag.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-dark-bg rounded-lg p-4">
                      <h3 className="font-semibold text-green-500 mb-3">Strengths</h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-dark-text flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-500 mb-3">Areas of Concern</h3>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-dark-text flex items-start gap-2">
                            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggested Interview Questions */}
                  <div className="bg-dark-bg rounded-lg p-4">
                    <h3 className="font-semibold text-dark-text mb-4">Suggested Interview Questions</h3>
                    <ul className="space-y-2">
                      {analysis.suggestedInterviewQuestions.map((question, i) => (
                        <li key={i} className="text-sm text-dark-text flex items-start gap-2">
                          <span className="font-bold text-primary flex-shrink-0">{i + 1}.</span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-dark-muted">
                  <svg className="w-16 h-16 mx-auto mb-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Select a position and click Analyze to see detailed AI evaluation</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Status Update */}
              <div className="bg-dark-bg rounded-lg p-4">
                <h3 className="font-semibold text-dark-text mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(CandidateStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        candidate.status === status
                          ? getStatusColor(status)
                          : 'bg-dark-card border-dark-border text-dark-muted hover:border-primary'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-dark-bg rounded-lg p-4">
                <h3 className="font-semibold text-dark-text mb-4">Notes</h3>
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note about this candidate..."
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-dark-text text-sm focus:border-primary outline-none resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Add Note
                    </button>
                  </div>

                  <div className="space-y-3">
                    {candidate.notes.length === 0 ? (
                      <p className="text-center text-dark-muted py-4">No notes yet</p>
                    ) : (
                      candidate.notes.map(note => (
                        <div key={note.id} className="bg-dark-card rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-dark-text">{note.authorName}</span>
                            <span className="text-xs text-dark-muted">{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                          </div>
                          <p className="text-sm text-dark-text">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
