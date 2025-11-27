// HR Storage Service - Manages all HR candidate vetting data

import {
  Candidate,
  JobPosition,
  ScoringCriteria,
  CandidateNote,
  TeamRating,
  BatchUpload,
  HiringPipeline,
  CandidateStatus,
  SourceType,
  ExperienceLevel,
  CandidateFilters,
  CandidateSortOptions,
  HRDashboardStats,
  CandidateComparison,
  RedFlagType,
  StrengthType
} from '../hrTypes';

// Storage Keys
const STORAGE_KEYS = {
  POSITIONS: 'hr_positions_v1',
  CANDIDATES: 'hr_candidates_v1',
  SCORING_CRITERIA: 'hr_scoring_criteria_v1',
  PIPELINES: 'hr_pipelines_v1',
  BATCH_UPLOADS: 'hr_batch_uploads_v1',
  COMPARISONS: 'hr_comparisons_v1',
  SETTINGS: 'hr_settings_v1'
};

// Helper Functions
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ============ POSITIONS ============

export const HRStorageService = {
  // Positions
  getPositions(): JobPosition[] {
    return getStorage<JobPosition>(STORAGE_KEYS.POSITIONS);
  },

  getPositionById(id: string): JobPosition | undefined {
    return this.getPositions().find(p => p.id === id);
  },

  savePosition(position: JobPosition): JobPosition {
    const positions = this.getPositions();
    const existingIndex = positions.findIndex(p => p.id === position.id);

    if (existingIndex >= 0) {
      positions[existingIndex] = { ...position, updatedAt: new Date().toISOString() };
    } else {
      position.id = position.id || generateId();
      position.createdAt = new Date().toISOString();
      position.updatedAt = new Date().toISOString();
      positions.push(position);
    }

    setStorage(STORAGE_KEYS.POSITIONS, positions);
    return position;
  },

  deletePosition(id: string): void {
    const positions = this.getPositions().filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.POSITIONS, positions);
    // Also delete related candidates
    const candidates = this.getCandidates().filter(c => c.positionId !== id);
    setStorage(STORAGE_KEYS.CANDIDATES, candidates);
  },

  // Candidates
  getCandidates(): Candidate[] {
    return getStorage<Candidate>(STORAGE_KEYS.CANDIDATES);
  },

  getCandidatesByPosition(positionId: string): Candidate[] {
    return this.getCandidates().filter(c => c.positionId === positionId);
  },

  getCandidateById(id: string): Candidate | undefined {
    return this.getCandidates().find(c => c.id === id);
  },

  saveCandidate(candidate: Candidate): Candidate {
    const candidates = this.getCandidates();
    const existingIndex = candidates.findIndex(c => c.id === candidate.id);

    candidate.lastUpdated = new Date().toISOString();

    if (existingIndex >= 0) {
      candidates[existingIndex] = candidate;
    } else {
      candidate.id = candidate.id || generateId();
      candidate.appliedAt = candidate.appliedAt || new Date().toISOString();
      candidates.push(candidate);
    }

    setStorage(STORAGE_KEYS.CANDIDATES, candidates);
    this.updatePositionCandidateCount(candidate.positionId);
    return candidate;
  },

  saveCandidates(candidatesToSave: Candidate[]): Candidate[] {
    const candidates = this.getCandidates();
    const positionIds = new Set<string>();

    candidatesToSave.forEach(candidate => {
      candidate.id = candidate.id || generateId();
      candidate.appliedAt = candidate.appliedAt || new Date().toISOString();
      candidate.lastUpdated = new Date().toISOString();

      const existingIndex = candidates.findIndex(c => c.id === candidate.id);
      if (existingIndex >= 0) {
        candidates[existingIndex] = candidate;
      } else {
        candidates.push(candidate);
      }
      positionIds.add(candidate.positionId);
    });

    setStorage(STORAGE_KEYS.CANDIDATES, candidates);

    // Update candidate counts for affected positions
    positionIds.forEach(positionId => this.updatePositionCandidateCount(positionId));

    return candidatesToSave;
  },

  deleteCandidate(id: string): void {
    const candidate = this.getCandidateById(id);
    const candidates = this.getCandidates().filter(c => c.id !== id);
    setStorage(STORAGE_KEYS.CANDIDATES, candidates);

    if (candidate) {
      this.updatePositionCandidateCount(candidate.positionId);
    }
  },

  updateCandidateStatus(candidateId: string, status: CandidateStatus): void {
    const candidate = this.getCandidateById(candidateId);
    if (candidate) {
      candidate.status = status;
      candidate.lastUpdated = new Date().toISOString();
      this.saveCandidate(candidate);
    }
  },

  updatePositionCandidateCount(positionId: string): void {
    const position = this.getPositionById(positionId);
    if (position) {
      position.candidateCount = this.getCandidatesByPosition(positionId).length;
      this.savePosition(position);
    }
  },

  // Filter and Sort Candidates
  filterCandidates(positionId: string, filters: CandidateFilters, sort: CandidateSortOptions): Candidate[] {
    let candidates = this.getCandidatesByPosition(positionId);

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      candidates = candidates.filter(c => filters.status!.includes(c.status));
    }

    if (filters.source && filters.source.length > 0) {
      candidates = candidates.filter(c => filters.source!.includes(c.source));
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      candidates = candidates.filter(c => filters.experienceLevel!.includes(c.experienceLevel));
    }

    if (filters.minScore !== undefined) {
      candidates = candidates.filter(c => c.overallScore >= filters.minScore!);
    }

    if (filters.maxScore !== undefined) {
      candidates = candidates.filter(c => c.overallScore <= filters.maxScore!);
    }

    if (filters.skills && filters.skills.length > 0) {
      candidates = candidates.filter(c => {
        const candidateSkills = c.parsedData?.skills?.map(s => s.name.toLowerCase()) || [];
        return filters.skills!.some(skill => candidateSkills.includes(skill.toLowerCase()));
      });
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      candidates = candidates.filter(c => c.location.toLowerCase().includes(locationLower));
    }

    if (filters.salaryMin !== undefined) {
      candidates = candidates.filter(c => (c.salaryExpectation || 0) >= filters.salaryMin!);
    }

    if (filters.salaryMax !== undefined) {
      candidates = candidates.filter(c => (c.salaryExpectation || Infinity) <= filters.salaryMax!);
    }

    if (filters.hasRedFlags !== undefined) {
      candidates = candidates.filter(c => {
        const hasFlags = c.redFlags && c.redFlags.length > 0;
        return filters.hasRedFlags ? hasFlags : !hasFlags;
      });
    }

    if (filters.redFlagTypes && filters.redFlagTypes.length > 0) {
      candidates = candidates.filter(c => {
        return c.redFlags?.some(rf => filters.redFlagTypes!.includes(rf.type));
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      candidates = candidates.filter(c => {
        return filters.tags!.some(tag => c.tags.includes(tag));
      });
    }

    if (filters.appliedAfter) {
      candidates = candidates.filter(c => new Date(c.appliedAt) >= new Date(filters.appliedAfter!));
    }

    if (filters.appliedBefore) {
      candidates = candidates.filter(c => new Date(c.appliedAt) <= new Date(filters.appliedBefore!));
    }

    if (filters.aiRecommendation && filters.aiRecommendation.length > 0) {
      candidates = candidates.filter(c => c.aiRecommendation && filters.aiRecommendation!.includes(c.aiRecommendation));
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      candidates = candidates.filter(c => {
        return (
          c.firstName.toLowerCase().includes(query) ||
          c.lastName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.currentTitle.toLowerCase().includes(query) ||
          c.currentCompany?.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    candidates.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'score':
          comparison = a.overallScore - b.overallScore;
          break;
        case 'appliedAt':
          comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
          break;
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'experience':
          comparison = a.totalYearsExperience - b.totalYearsExperience;
          break;
        case 'salary':
          comparison = (a.salaryExpectation || 0) - (b.salaryExpectation || 0);
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });

    return candidates;
  },

  // Calculate Rankings
  calculateRankings(positionId: string): void {
    const candidates = this.getCandidatesByPosition(positionId)
      .filter(c => c.status !== CandidateStatus.REJECTED && c.status !== CandidateStatus.WITHDRAWN)
      .sort((a, b) => b.overallScore - a.overallScore);

    candidates.forEach((candidate, index) => {
      candidate.ranking = index + 1;
      this.saveCandidate(candidate);
    });
  },

  // Notes
  addCandidateNote(candidateId: string, note: Omit<CandidateNote, 'id' | 'candidateId' | 'createdAt' | 'reactions'>): CandidateNote {
    const candidate = this.getCandidateById(candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const newNote: CandidateNote = {
      ...note,
      id: generateId(),
      candidateId,
      createdAt: new Date().toISOString(),
      reactions: []
    };

    if (!candidate.notes) candidate.notes = [];
    candidate.notes.push(newNote);
    this.saveCandidate(candidate);
    return newNote;
  },

  updateCandidateNote(candidateId: string, noteId: string, content: string): void {
    const candidate = this.getCandidateById(candidateId);
    if (!candidate) return;

    const noteIndex = candidate.notes?.findIndex(n => n.id === noteId);
    if (noteIndex !== undefined && noteIndex >= 0 && candidate.notes) {
      candidate.notes[noteIndex].content = content;
      candidate.notes[noteIndex].updatedAt = new Date().toISOString();
      this.saveCandidate(candidate);
    }
  },

  deleteCandidateNote(candidateId: string, noteId: string): void {
    const candidate = this.getCandidateById(candidateId);
    if (!candidate) return;

    candidate.notes = candidate.notes?.filter(n => n.id !== noteId) || [];
    this.saveCandidate(candidate);
  },

  addNoteReaction(candidateId: string, noteId: string, userId: string, reaction: '👍' | '👎' | '❓' | '⚠️' | '✅'): void {
    const candidate = this.getCandidateById(candidateId);
    if (!candidate) return;

    const note = candidate.notes?.find(n => n.id === noteId);
    if (note) {
      // Remove existing reaction from same user
      note.reactions = note.reactions.filter(r => r.userId !== userId);
      note.reactions.push({ userId, reaction, createdAt: new Date().toISOString() });
      this.saveCandidate(candidate);
    }
  },

  // Team Ratings
  addTeamRating(candidateId: string, rating: Omit<TeamRating, 'id' | 'candidateId' | 'createdAt'>): TeamRating {
    const candidate = this.getCandidateById(candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const newRating: TeamRating = {
      ...rating,
      id: generateId(),
      candidateId,
      createdAt: new Date().toISOString()
    };

    if (!candidate.ratings) candidate.ratings = [];
    // Replace existing rating from same user
    candidate.ratings = candidate.ratings.filter(r => r.userId !== rating.userId);
    candidate.ratings.push(newRating);
    this.saveCandidate(candidate);
    return newRating;
  },

  // Scoring Criteria
  getScoringCriteria(positionId: string): ScoringCriteria[] {
    return getStorage<ScoringCriteria>(STORAGE_KEYS.SCORING_CRITERIA).filter(c => c.positionId === positionId);
  },

  saveScoringCriteria(criteria: ScoringCriteria): ScoringCriteria {
    const allCriteria = getStorage<ScoringCriteria>(STORAGE_KEYS.SCORING_CRITERIA);
    const existingIndex = allCriteria.findIndex(c => c.id === criteria.id);

    if (existingIndex >= 0) {
      allCriteria[existingIndex] = criteria;
    } else {
      criteria.id = criteria.id || generateId();
      criteria.createdAt = new Date().toISOString();
      allCriteria.push(criteria);
    }

    setStorage(STORAGE_KEYS.SCORING_CRITERIA, allCriteria);
    return criteria;
  },

  deleteScoringCriteria(id: string): void {
    const allCriteria = getStorage<ScoringCriteria>(STORAGE_KEYS.SCORING_CRITERIA).filter(c => c.id !== id);
    setStorage(STORAGE_KEYS.SCORING_CRITERIA, allCriteria);
  },

  // Pipeline
  getPipeline(positionId: string): HiringPipeline | undefined {
    return getStorage<HiringPipeline>(STORAGE_KEYS.PIPELINES).find(p => p.positionId === positionId);
  },

  savePipeline(pipeline: HiringPipeline): HiringPipeline {
    const pipelines = getStorage<HiringPipeline>(STORAGE_KEYS.PIPELINES);
    const existingIndex = pipelines.findIndex(p => p.positionId === pipeline.positionId);

    pipeline.updatedAt = new Date().toISOString();

    if (existingIndex >= 0) {
      pipelines[existingIndex] = pipeline;
    } else {
      pipeline.id = pipeline.id || generateId();
      pipeline.createdAt = new Date().toISOString();
      pipelines.push(pipeline);
    }

    setStorage(STORAGE_KEYS.PIPELINES, pipelines);
    return pipeline;
  },

  // Batch Uploads
  getBatchUploads(positionId?: string): BatchUpload[] {
    const uploads = getStorage<BatchUpload>(STORAGE_KEYS.BATCH_UPLOADS);
    return positionId ? uploads.filter(u => u.positionId === positionId) : uploads;
  },

  saveBatchUpload(upload: BatchUpload): BatchUpload {
    const uploads = getStorage<BatchUpload>(STORAGE_KEYS.BATCH_UPLOADS);
    const existingIndex = uploads.findIndex(u => u.id === upload.id);

    if (existingIndex >= 0) {
      uploads[existingIndex] = upload;
    } else {
      upload.id = upload.id || generateId();
      uploads.push(upload);
    }

    setStorage(STORAGE_KEYS.BATCH_UPLOADS, uploads);
    return upload;
  },

  // Comparisons
  getComparisons(positionId: string): CandidateComparison[] {
    return getStorage<CandidateComparison>(STORAGE_KEYS.COMPARISONS).filter(c => c.positionId === positionId);
  },

  saveComparison(comparison: CandidateComparison): CandidateComparison {
    const comparisons = getStorage<CandidateComparison>(STORAGE_KEYS.COMPARISONS);
    const existingIndex = comparisons.findIndex(c => c.id === comparison.id);

    if (existingIndex >= 0) {
      comparisons[existingIndex] = comparison;
    } else {
      comparison.id = comparison.id || generateId();
      comparison.createdAt = new Date().toISOString();
      comparisons.push(comparison);
    }

    setStorage(STORAGE_KEYS.COMPARISONS, comparisons);
    return comparison;
  },

  deleteComparison(id: string): void {
    const comparisons = getStorage<CandidateComparison>(STORAGE_KEYS.COMPARISONS).filter(c => c.id !== id);
    setStorage(STORAGE_KEYS.COMPARISONS, comparisons);
  },

  // Dashboard Stats
  getDashboardStats(positionId?: string): HRDashboardStats {
    const candidates = positionId ? this.getCandidatesByPosition(positionId) : this.getCandidates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats: HRDashboardStats = {
      totalCandidates: candidates.length,
      newToday: candidates.filter(c => new Date(c.appliedAt) >= today).length,
      inReview: candidates.filter(c => c.status === CandidateStatus.SCREENING).length,
      shortlisted: candidates.filter(c => c.status === CandidateStatus.SHORTLISTED).length,
      interviewed: candidates.filter(c => c.status === CandidateStatus.INTERVIEW).length,
      offers: candidates.filter(c => c.status === CandidateStatus.OFFER).length,
      hired: candidates.filter(c => c.status === CandidateStatus.HIRED).length,
      rejected: candidates.filter(c => c.status === CandidateStatus.REJECTED).length,
      avgTimeToHire: this.calculateAvgTimeToHire(candidates),
      avgScore: candidates.length > 0
        ? Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)
        : 0,
      topSources: this.calculateTopSources(candidates),
      pipelineHealth: this.calculatePipelineHealth(candidates),
      weeklyTrend: this.calculateWeeklyTrend(candidates)
    };

    return stats;
  },

  calculateAvgTimeToHire(candidates: Candidate[]): number {
    const hired = candidates.filter(c => c.status === CandidateStatus.HIRED);
    if (hired.length === 0) return 0;

    const totalDays = hired.reduce((sum, c) => {
      const appliedDate = new Date(c.appliedAt);
      const hiredDate = new Date(c.lastUpdated);
      return sum + Math.ceil((hiredDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / hired.length);
  },

  calculateTopSources(candidates: Candidate[]): { source: SourceType; count: number; avgScore: number; conversionRate: number }[] {
    const sourceMap = new Map<SourceType, { count: number; totalScore: number; hired: number }>();

    candidates.forEach(c => {
      const existing = sourceMap.get(c.source) || { count: 0, totalScore: 0, hired: 0 };
      existing.count++;
      existing.totalScore += c.overallScore;
      if (c.status === CandidateStatus.HIRED) existing.hired++;
      sourceMap.set(c.source, existing);
    });

    return Array.from(sourceMap.entries())
      .map(([source, data]) => ({
        source,
        count: data.count,
        avgScore: Math.round(data.totalScore / data.count),
        conversionRate: Math.round((data.hired / data.count) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  calculatePipelineHealth(candidates: Candidate[]): { bottlenecks: string[]; recommendations: string[]; velocityScore: number } {
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];
    let velocityScore = 75;

    const screening = candidates.filter(c => c.status === CandidateStatus.SCREENING).length;
    const total = candidates.length;

    if (total > 0 && screening / total > 0.5) {
      bottlenecks.push('High volume in screening stage');
      recommendations.push('Consider batch processing to speed up initial reviews');
      velocityScore -= 15;
    }

    const newCandidates = candidates.filter(c => c.status === CandidateStatus.NEW).length;
    if (total > 0 && newCandidates / total > 0.3) {
      bottlenecks.push('Many unreviewed applications');
      recommendations.push('Prioritize initial screening of new applicants');
      velocityScore -= 10;
    }

    return { bottlenecks, recommendations, velocityScore: Math.max(0, velocityScore) };
  },

  calculateWeeklyTrend(candidates: Candidate[]): { week: string; applications: number; hires: number; rejections: number }[] {
    const weeks: Map<string, { applications: number; hires: number; rejections: number }> = new Map();
    const now = new Date();

    // Last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekKey = weekStart.toISOString().split('T')[0];
      weeks.set(weekKey, { applications: 0, hires: 0, rejections: 0 });
    }

    candidates.forEach(c => {
      const appliedDate = new Date(c.appliedAt);
      const appliedWeek = appliedDate.toISOString().split('T')[0];

      for (const [weekKey, data] of weeks.entries()) {
        const weekDate = new Date(weekKey);
        const weekEnd = new Date(weekDate);
        weekEnd.setDate(weekDate.getDate() + 7);

        if (appliedDate >= weekDate && appliedDate < weekEnd) {
          data.applications++;
        }

        if (c.status === CandidateStatus.HIRED) {
          const hiredDate = new Date(c.lastUpdated);
          if (hiredDate >= weekDate && hiredDate < weekEnd) {
            data.hires++;
          }
        }

        if (c.status === CandidateStatus.REJECTED) {
          const rejectedDate = new Date(c.lastUpdated);
          if (rejectedDate >= weekDate && rejectedDate < weekEnd) {
            data.rejections++;
          }
        }
      }
    });

    return Array.from(weeks.entries()).map(([week, data]) => ({
      week,
      ...data
    }));
  },

  // Get all unique tags used across candidates
  getAllTags(positionId?: string): string[] {
    const candidates = positionId ? this.getCandidatesByPosition(positionId) : this.getCandidates();
    const tagSet = new Set<string>();
    candidates.forEach(c => c.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },

  // Get all unique skills from candidates
  getAllSkills(positionId?: string): string[] {
    const candidates = positionId ? this.getCandidatesByPosition(positionId) : this.getCandidates();
    const skillSet = new Set<string>();
    candidates.forEach(c => {
      c.parsedData?.skills?.forEach(s => skillSet.add(s.name));
    });
    return Array.from(skillSet).sort();
  },

  // Initialize with demo data
  initDemoData(): void {
    // Check if already initialized
    if (this.getPositions().length > 0) return;

    // Create sample position
    const position: JobPosition = {
      id: generateId(),
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using modern JavaScript frameworks.',
      location: 'San Francisco, CA / Remote',
      remotePolicy: 'HYBRID',
      salaryMin: 150000,
      salaryMax: 200000,
      currency: 'USD',
      experienceLevel: ExperienceLevel.SENIOR,
      requiredSkills: [
        { skill: 'React', level: 'ADVANCED', yearsRequired: 3, isRequired: true, weight: 20 },
        { skill: 'TypeScript', level: 'ADVANCED', yearsRequired: 2, isRequired: true, weight: 15 },
        { skill: 'JavaScript', level: 'EXPERT', yearsRequired: 5, isRequired: true, weight: 15 },
        { skill: 'CSS/Tailwind', level: 'ADVANCED', isRequired: true, weight: 10 },
        { skill: 'Git', level: 'INTERMEDIATE', isRequired: true, weight: 5 }
      ],
      preferredSkills: [
        { skill: 'Next.js', level: 'INTERMEDIATE', isRequired: false, weight: 10 },
        { skill: 'Node.js', level: 'INTERMEDIATE', isRequired: false, weight: 10 },
        { skill: 'GraphQL', level: 'BASIC', isRequired: false, weight: 8 },
        { skill: 'Testing (Jest/Cypress)', level: 'INTERMEDIATE', isRequired: false, weight: 7 }
      ],
      responsibilities: [
        'Build and maintain React-based web applications',
        'Write clean, maintainable, and well-tested code',
        'Collaborate with designers and backend engineers',
        'Participate in code reviews and technical discussions',
        'Mentor junior developers'
      ],
      qualifications: [
        '5+ years of frontend development experience',
        'Strong proficiency in React and TypeScript',
        'Experience with modern CSS frameworks',
        'Excellent problem-solving skills',
        'Strong communication skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Unlimited PTO',
        'Remote-friendly culture',
        'Learning & development budget'
      ],
      culturalValues: [
        'Innovation',
        'Collaboration',
        'Continuous Learning',
        'Work-Life Balance',
        'Transparency'
      ],
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hiringManagerId: 'user-1',
      candidateCount: 0
    };

    this.savePosition(position);

    // Create sample candidates
    const sampleCandidates: Partial<Candidate>[] = [
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@email.com',
        phone: '+1-555-0101',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/sarahchen',
        githubUrl: 'https://github.com/sarahchen',
        source: SourceType.LINKEDIN,
        currentTitle: 'Senior Software Engineer',
        currentCompany: 'Google',
        experienceLevel: ExperienceLevel.SENIOR,
        totalYearsExperience: 7,
        overallScore: 92,
        skillMatchScore: 95,
        experienceScore: 90,
        culturalFitScore: 88,
        status: CandidateStatus.SHORTLISTED,
        salaryExpectation: 180000,
        noticePeriod: '2 weeks',
        tags: ['top-candidate', 'FAANG'],
        aiRecommendation: 'STRONGLY_RECOMMEND',
        aiSummary: 'Exceptional candidate with strong technical background at top tech companies. Deep React expertise with leadership experience.',
        redFlags: [],
        strengths: [
          { id: '1', type: StrengthType.PRESTIGIOUS_COMPANIES, strength: 'EXCEPTIONAL', title: 'FAANG Experience', description: 'Worked at Google for 4 years', evidence: ['Google Senior Engineer'], detectedAt: new Date().toISOString(), addedBy: 'AI' },
          { id: '2', type: StrengthType.SKILL_MATCH, strength: 'STRONG', title: 'Perfect Tech Stack Match', description: 'Expert in React, TypeScript, and modern frontend', evidence: ['5 years React', '3 years TypeScript'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        notes: [],
        ratings: [],
        customScores: []
      },
      {
        firstName: 'Michael',
        lastName: 'Rodriguez',
        email: 'michael.r@email.com',
        phone: '+1-555-0102',
        location: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/in/mrodriguez',
        source: SourceType.REFERRAL,
        sourceDetails: 'Referred by John Smith',
        currentTitle: 'Frontend Tech Lead',
        currentCompany: 'Stripe',
        experienceLevel: ExperienceLevel.LEAD,
        totalYearsExperience: 8,
        overallScore: 88,
        skillMatchScore: 85,
        experienceScore: 92,
        culturalFitScore: 90,
        status: CandidateStatus.INTERVIEW,
        salaryExpectation: 195000,
        noticePeriod: '1 month',
        tags: ['referral', 'leadership'],
        aiRecommendation: 'RECOMMEND',
        aiSummary: 'Strong leadership background with fintech experience. Slightly different tech stack but highly adaptable.',
        redFlags: [],
        strengths: [
          { id: '3', type: StrengthType.LEADERSHIP_EXPERIENCE, strength: 'EXCEPTIONAL', title: 'Team Leadership', description: 'Led team of 8 engineers at Stripe', evidence: ['Team Lead role', '8 direct reports'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        notes: [],
        ratings: [],
        customScores: []
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@email.com',
        phone: '+1-555-0103',
        location: 'New York, NY',
        linkedinUrl: 'https://linkedin.com/in/emilytaylor',
        source: SourceType.CAREER_PAGE,
        currentTitle: 'Software Engineer',
        currentCompany: 'Startup XYZ',
        experienceLevel: ExperienceLevel.MID,
        totalYearsExperience: 4,
        overallScore: 75,
        skillMatchScore: 80,
        experienceScore: 65,
        culturalFitScore: 82,
        status: CandidateStatus.SCREENING,
        salaryExpectation: 140000,
        noticePeriod: '2 weeks',
        tags: ['startup-experience'],
        aiRecommendation: 'NEUTRAL',
        aiSummary: 'Promising candidate with good potential but lacks senior-level experience. Strong growth trajectory.',
        redFlags: [
          { id: '1', type: RedFlagType.UNDERQUALIFIED, severity: 'LOW', title: 'Experience Gap', description: 'Has 4 years experience, role requires 5+', evidence: ['4 years total experience'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        strengths: [
          { id: '4', type: StrengthType.CAREER_PROGRESSION, strength: 'STRONG', title: 'Fast Growth', description: 'Promoted twice in 4 years', evidence: ['Junior to Mid in 2 years', 'Lead small projects'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        notes: [],
        ratings: [],
        customScores: []
      },
      {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@email.com',
        phone: '+1-555-0104',
        location: 'Seattle, WA',
        linkedinUrl: 'https://linkedin.com/in/davidkim',
        githubUrl: 'https://github.com/davidkim',
        source: SourceType.JOB_BOARD,
        currentTitle: 'Senior Frontend Engineer',
        currentCompany: 'Amazon',
        experienceLevel: ExperienceLevel.SENIOR,
        totalYearsExperience: 6,
        overallScore: 84,
        skillMatchScore: 88,
        experienceScore: 80,
        culturalFitScore: 78,
        status: CandidateStatus.NEW,
        salaryExpectation: 175000,
        noticePeriod: '3 weeks',
        tags: ['FAANG', 'remote-ok'],
        aiRecommendation: 'RECOMMEND',
        aiSummary: 'Solid technical background with FAANG experience. Some concerns about cultural fit based on work style preferences.',
        redFlags: [],
        strengths: [
          { id: '5', type: StrengthType.RELEVANT_EXPERIENCE, strength: 'STRONG', title: 'E-commerce Expertise', description: 'Built large-scale consumer apps at Amazon', evidence: ['Amazon 3 years', 'Prime Video team'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        notes: [],
        ratings: [],
        customScores: []
      },
      {
        firstName: 'Jessica',
        lastName: 'Wang',
        email: 'jessica.wang@email.com',
        phone: '+1-555-0105',
        location: 'Los Angeles, CA',
        linkedinUrl: 'https://linkedin.com/in/jessicawang',
        source: SourceType.RECRUITER,
        sourceDetails: 'TechRecruit Agency',
        currentTitle: 'Principal Engineer',
        currentCompany: 'Netflix',
        experienceLevel: ExperienceLevel.LEAD,
        totalYearsExperience: 10,
        overallScore: 95,
        skillMatchScore: 92,
        experienceScore: 98,
        culturalFitScore: 94,
        status: CandidateStatus.OFFER,
        salaryExpectation: 220000,
        noticePeriod: '1 month',
        tags: ['top-candidate', 'FAANG', 'principal'],
        aiRecommendation: 'STRONGLY_RECOMMEND',
        aiSummary: 'Outstanding candidate with exceptional experience at Netflix. Overqualified but highly motivated for this role.',
        redFlags: [
          { id: '2', type: RedFlagType.OVERQUALIFIED, severity: 'LOW', title: 'Potentially Overqualified', description: 'Principal level applying for Senior role', evidence: ['Principal Engineer title', '10 years experience'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        strengths: [
          { id: '6', type: StrengthType.PROJECT_IMPACT, strength: 'EXCEPTIONAL', title: 'High Impact Work', description: 'Led Netflix TV app redesign used by 200M+ users', evidence: ['200M+ users impacted', 'Performance improved 40%'], detectedAt: new Date().toISOString(), addedBy: 'AI' },
          { id: '7', type: StrengthType.CERTIFICATIONS, strength: 'STRONG', title: 'Industry Recognition', description: 'Multiple conference speaker and open source contributor', evidence: ['ReactConf speaker', 'OSS contributor'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        notes: [],
        ratings: [],
        customScores: []
      },
      {
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.j@email.com',
        phone: '+1-555-0106',
        location: 'Chicago, IL',
        linkedinUrl: 'https://linkedin.com/in/robertjohnson',
        source: SourceType.INDEED,
        currentTitle: 'Frontend Developer',
        currentCompany: 'Various Freelance',
        experienceLevel: ExperienceLevel.MID,
        totalYearsExperience: 5,
        overallScore: 58,
        skillMatchScore: 60,
        experienceScore: 50,
        culturalFitScore: 65,
        status: CandidateStatus.REJECTED,
        salaryExpectation: 130000,
        tags: ['freelance'],
        aiRecommendation: 'NOT_RECOMMEND',
        aiSummary: 'Concerning work history with multiple short stints and gaps. Skills are somewhat dated.',
        redFlags: [
          { id: '3', type: RedFlagType.FREQUENT_JOB_CHANGES, severity: 'HIGH', title: 'Job Hopping Pattern', description: '6 jobs in 5 years with no role lasting more than 10 months', evidence: ['Avg tenure 8 months', '6 different companies'], detectedAt: new Date().toISOString(), addedBy: 'AI' },
          { id: '4', type: RedFlagType.EMPLOYMENT_GAP, severity: 'MEDIUM', title: 'Unexplained Gaps', description: '8-month gap in 2022 with no explanation', evidence: ['Gap from Mar-Nov 2022'], detectedAt: new Date().toISOString(), addedBy: 'AI' },
          { id: '5', type: RedFlagType.SKILL_MISMATCH, severity: 'MEDIUM', title: 'Outdated Tech Stack', description: 'Primary experience in jQuery and AngularJS', evidence: ['jQuery listed first', 'No React projects'], detectedAt: new Date().toISOString(), addedBy: 'AI' }
        ],
        strengths: [],
        notes: [],
        ratings: [],
        customScores: []
      }
    ];

    sampleCandidates.forEach(candidateData => {
      const candidate: Candidate = {
        id: generateId(),
        positionId: position.id,
        firstName: candidateData.firstName!,
        lastName: candidateData.lastName!,
        email: candidateData.email!,
        phone: candidateData.phone,
        location: candidateData.location!,
        linkedinUrl: candidateData.linkedinUrl,
        githubUrl: candidateData.githubUrl,
        source: candidateData.source!,
        sourceDetails: candidateData.sourceDetails,
        currentTitle: candidateData.currentTitle!,
        currentCompany: candidateData.currentCompany,
        experienceLevel: candidateData.experienceLevel!,
        totalYearsExperience: candidateData.totalYearsExperience!,
        overallScore: candidateData.overallScore!,
        skillMatchScore: candidateData.skillMatchScore!,
        experienceScore: candidateData.experienceScore!,
        culturalFitScore: candidateData.culturalFitScore!,
        status: candidateData.status!,
        stage: 1,
        salaryExpectation: candidateData.salaryExpectation,
        noticePeriod: candidateData.noticePeriod,
        tags: candidateData.tags || [],
        aiRecommendation: candidateData.aiRecommendation as any,
        aiSummary: candidateData.aiSummary,
        redFlags: candidateData.redFlags || [],
        strengths: candidateData.strengths || [],
        notes: [],
        ratings: [],
        customScores: [],
        appliedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString()
      };

      this.saveCandidate(candidate);
    });

    // Update position candidate count
    this.updatePositionCandidateCount(position.id);
  },

  // Clear all HR data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
