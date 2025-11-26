// ============================================
// HR CANDIDATE SCREENING TOOL - TYPE DEFINITIONS
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  RECRUITER = 'RECRUITER',
  HIRING_MANAGER = 'HIRING_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD'
}

export enum CandidateStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD'
}

export enum ExperienceLevel {
  INTERN = 'INTERN',
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  PRINCIPAL = 'PRINCIPAL',
  EXECUTIVE = 'EXECUTIVE'
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP'
}

export enum Department {
  ENGINEERING = 'Engineering',
  PRODUCT = 'Product',
  DESIGN = 'Design',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  OPERATIONS = 'Operations',
  HR = 'Human Resources',
  FINANCE = 'Finance',
  CUSTOMER_SUCCESS = 'Customer Success',
  DATA = 'Data & Analytics',
  OTHER = 'Other'
}

export enum RedFlagSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: Department;
  password?: string;
  createdAt: string;
}

// ============================================
// JOB POSITIONS
// ============================================

export interface JobPosition {
  id: string;
  title: string;
  department: Department;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  location: string;
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openings: number;
  hiringManagerId: string;
  createdAt: string;
  deadline?: string;
  status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'FILLED';
  customScoringCriteria?: ScoringCriteria;
}

// ============================================
// CANDIDATE DATA
// ============================================

export interface Candidate {
  id: string;
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;

  // Professional Info
  currentJobTitle?: string;
  currentCompany?: string;
  totalYearsExperience: number;
  experienceLevel: ExperienceLevel;
  expectedSalary?: number;
  noticePeriod?: number; // in days
  willingToRelocate: boolean;

  // Application Details
  appliedPositions: string[]; // JobPosition IDs
  resumeUrl?: string;
  coverLetter?: string;
  source: 'DIRECT' | 'REFERRAL' | 'LINKEDIN' | 'JOB_BOARD' | 'RECRUITER' | 'OTHER';
  referredBy?: string;

  // Resume Parsed Data
  summary?: string;
  skills: string[];
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  languages: Language[];

  // Status & Tracking
  status: CandidateStatus;
  addedBy: string; // User ID
  assignedTo?: string; // Recruiter/HR Manager ID
  createdAt: string;
  updatedAt: string;

  // AI Analysis Results
  aiAnalysis?: CandidateAnalysis;

  // Metadata
  tags: string[];
  notes: Note[];
  attachments: Attachment[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: number;
  achievements?: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  name: string;
  proficiency: 'BASIC' | 'CONVERSATIONAL' | 'PROFESSIONAL' | 'NATIVE';
}

// ============================================
// AI ANALYSIS & SCORING
// ============================================

export interface CandidateAnalysis {
  candidateId: string;
  positionId: string;
  analyzedAt: string;

  // Overall Score (0-100)
  overallScore: number;
  overallFit: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' | 'OUTSTANDING';

  // Detailed Scores
  scores: {
    technicalSkills: ScoreDetail;
    experience: ScoreDetail;
    education: ScoreDetail;
    culturalFit: ScoreDetail;
    communication: ScoreDetail;
    leadershipPotential: ScoreDetail;
    careerProgression: ScoreDetail;
    salaryAlignment: ScoreDetail;
    availability: ScoreDetail;
    locationFit: ScoreDetail;
  };

  // Skills Analysis
  skillsGapAnalysis: SkillsGapAnalysis;

  // Red Flags
  redFlags: RedFlag[];

  // Strengths & Weaknesses
  strengths: string[];
  weaknesses: string[];

  // Cultural Fit
  culturalFitIndicators: CulturalFitIndicator[];

  // Employment Gaps
  employmentGaps: EmploymentGap[];

  // Recommendations
  recommendation: 'REJECT' | 'MAYBE' | 'INTERVIEW' | 'STRONG_YES';
  reasoning: string;
  detailedAnalysis: string;

  // Interview Suggestions
  suggestedInterviewQuestions: string[];
  focusAreas: string[];
}

export interface ScoreDetail {
  score: number; // 0-100
  weight: number; // 0-1 (for weighted average)
  reasoning: string;
  evidence: string[];
}

export interface SkillsGapAnalysis {
  requiredSkillsMet: SkillMatch[];
  requiredSkillsMissing: SkillGap[];
  preferredSkillsMet: SkillMatch[];
  preferredSkillsMissing: SkillGap[];
  additionalSkills: string[]; // Skills candidate has that weren't required
  overallSkillMatch: number; // 0-100
}

export interface SkillMatch {
  skill: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
  evidence: string[];
}

export interface SkillGap {
  skill: string;
  importance: 'MUST_HAVE' | 'NICE_TO_HAVE';
  canBeTrainedQuickly: boolean;
  alternativeSkills: string[]; // Skills candidate has that are similar
}

export interface RedFlag {
  id: string;
  type: 'EMPLOYMENT_GAP' | 'FREQUENT_JOB_CHANGES' | 'SKILL_MISMATCH' |
        'SALARY_MISMATCH' | 'LOCATION_ISSUE' | 'OVERQUALIFIED' |
        'UNDERQUALIFIED' | 'INCONSISTENCY' | 'INCOMPLETE_INFO' | 'OTHER';
  severity: RedFlagSeverity;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
}

export interface CulturalFitIndicator {
  trait: string;
  alignment: 'STRONG' | 'MODERATE' | 'WEAK' | 'UNKNOWN';
  evidence: string[];
  reasoning: string;
}

export interface EmploymentGap {
  startDate: string;
  endDate: string;
  durationMonths: number;
  explanation?: string;
  impact: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
}

// ============================================
// CUSTOM SCORING CRITERIA
// ============================================

export interface ScoringCriteria {
  id: string;
  positionId: string;
  weights: {
    technicalSkills: number;
    experience: number;
    education: number;
    culturalFit: number;
    communication: number;
    leadershipPotential: number;
    careerProgression: number;
    salaryAlignment: number;
    availability: number;
    locationFit: number;
  };
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  dealBreakers: string[];
  culturalValues: string[];
}

// ============================================
// COLLABORATION & FEEDBACK
// ============================================

export interface Note {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  tags: string[];
}

export interface TeamFeedback {
  id: string;
  candidateId: string;
  positionId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1-5
  feedback: string;
  strengths: string[];
  concerns: string[];
  recommendation: 'REJECT' | 'MAYBE' | 'INTERVIEW' | 'HIRE';
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'RESUME' | 'COVER_LETTER' | 'PORTFOLIO' | 'CERTIFICATE' | 'OTHER';
  uploadedAt: string;
  uploadedBy: string;
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

export interface HiringMetrics {
  // Time-based metrics
  averageTimeToHire: number; // days
  averageTimeToScreen: number; // days
  averageTimeToInterview: number; // days

  // Volume metrics
  totalApplications: number;
  screeningRate: number; // percentage
  interviewRate: number; // percentage
  offerRate: number; // percentage
  acceptanceRate: number; // percentage

  // Cost metrics
  costPerHire: number;
  costPerInterview: number;

  // Quality metrics
  averageCandidateScore: number;
  sourceEffectiveness: SourceMetric[];
  topPerformingSources: string[];

  // Diversity metrics
  diversityStats: {
    genderDistribution: Record<string, number>;
    locationDistribution: Record<string, number>;
    experienceLevelDistribution: Record<string, number>;
  };
}

export interface SourceMetric {
  source: string;
  applications: number;
  hires: number;
  conversionRate: number;
  averageQualityScore: number;
}

// ============================================
// COMPARISON & EXPORT
// ============================================

export interface CandidateComparison {
  candidates: Candidate[];
  position: JobPosition;
  analyses: CandidateAnalysis[];
  comparisonMatrix: ComparisonRow[];
}

export interface ComparisonRow {
  category: string;
  candidates: Record<string, any>; // candidateId -> value
}

// ============================================
// SAVED SEARCHES & FILTERS
// ============================================

export interface SavedSearch {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  filters: CandidateFilters;
  isShared: boolean;
  alertsEnabled: boolean;
}

export interface CandidateFilters {
  positions?: string[];
  status?: CandidateStatus[];
  experienceLevel?: ExperienceLevel[];
  minYearsExperience?: number;
  maxYearsExperience?: number;
  skills?: string[];
  location?: string[];
  minScore?: number;
  maxScore?: number;
  sources?: string[];
  dateAddedFrom?: string;
  dateAddedTo?: string;
  keywords?: string;
  excludeKeywords?: string;
}

// ============================================
// BULK OPERATIONS
// ============================================

export interface BulkUploadJob {
  id: string;
  uploadedBy: string;
  uploadedAt: string;
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  failureCount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  results: BulkUploadResult[];
}

export interface BulkUploadResult {
  fileName: string;
  status: 'SUCCESS' | 'FAILED';
  candidateId?: string;
  error?: string;
}

// ============================================
// NOTIFICATIONS & ALERTS
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'NEW_CANDIDATE' | 'STATUS_CHANGE' | 'TEAM_FEEDBACK' | 'MATCH_ALERT' | 'REMINDER';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// ============================================
// ADVANCED FEATURES - TOP PERFORMER CLONING
// ============================================

export interface TopPerformerProfile {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  performanceScore: number; // 0-100
  tenure: number; // months
  promotions: number;
  skills: string[];
  education: Education;
  careerPath: CareerStep[];
  personality: {
    workStyle: string[];
    communication: string;
    leadership: string;
    collaboration: string;
  };
  achievements: string[];
  projectSuccess: number; // 0-100
  culturalAlignment: number; // 0-100
  addedBy: string;
  addedAt: string;
}

export interface CareerStep {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  duration: number; // months
  achievements: string[];
}

export interface TopPerformerMatch {
  candidateId: string;
  topPerformerId: string;
  overallSimilarity: number; // 0-100
  matchDetails: {
    skillMatch: number;
    careerPathSimilarity: number;
    educationMatch: number;
    personalityMatch: number;
    experienceAlignment: number;
  };
  strengths: string[];
  gaps: string[];
  recommendation: string;
  confidence: number; // 0-100
}

// ============================================
// CAREER MOMENTUM MAPPING
// ============================================

export interface CareerMomentum {
  candidateId: string;
  trajectory: 'ACCELERATING' | 'STEADY' | 'PLATEAUED' | 'DECLINING' | 'TRANSITIONING';
  velocityScore: number; // 0-100, rate of career advancement
  analysis: {
    promotionRate: number; // promotions per year
    skillAcquisitionRate: number; // new skills per year
    responsibilityGrowth: string; // description
    companyProgression: string; // startup to enterprise, etc.
    salaryGrowth: number; // percentage over time
  };
  timelineEvents: CareerTimelineEvent[];
  projectedPath: string; // AI prediction of next 2-3 years
  momentumFactors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  riskFactors: string[];
  opportunities: string[];
}

export interface CareerTimelineEvent {
  date: string;
  type: 'PROMOTION' | 'JOB_CHANGE' | 'SKILL_ACQUIRED' | 'CERTIFICATION' | 'PROJECT' | 'ACHIEVEMENT';
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ============================================
// REVERSE ROLE MATCHING
// ============================================

export interface ReverseMatching {
  candidateId: string;
  analyzedAt: string;
  bestFitRoles: RoleMatchResult[];
  surprisingMatches: RoleMatchResult[]; // positions they'd excel at but might not apply for
  skillGapAnalysis: {
    roleId: string;
    roleName: string;
    requiredSkills: string[];
    candidateSkills: string[];
    missingSkills: string[];
    trainableIn: string; // e.g., "2-3 months"
  }[];
  recommendations: string[];
}

export interface RoleMatchResult {
  positionId: string;
  positionTitle: string;
  department: string;
  fitScore: number; // 0-100
  reasoning: string;
  strengths: string[];
  developmentAreas: string[];
  timeToProductivity: string; // e.g., "1-2 months"
  confidenceLevel: number; // 0-100
}

// ============================================
// FLIGHT RISK & COUNTER-OFFER PREDICTION
// ============================================

export interface FlightRiskAssessment {
  candidateId: string;
  flightRiskScore: number; // 0-100, higher = more likely to leave current job
  counterOfferProbability: number; // 0-100
  riskFactors: {
    careerStagnation: boolean;
    belowMarketCompensation: boolean;
    longTenure: boolean;
    recentPromotionMissed: boolean;
    industryTrends: boolean;
    skillsInDemand: boolean;
  };
  indicators: {
    jobSearchSignals: string[]; // resume updated recently, active on LinkedIn, etc.
    satisfactionSignals: string[];
    ambitionSignals: string[];
  };
  counterOfferLikelihood: {
    currentEmployerValue: number; // how much they value the employee
    replaceabilityScore: number; // how hard to replace
    estimatedCounterOfferRange: {
      min: number;
      max: number;
      currency: string;
    };
  };
  mitigationStrategies: string[];
  bestApproachTiming: string;
}

// ============================================
// TAILORED INTERVIEW QUESTIONS
// ============================================

export interface TailoredInterviewQuestion {
  id: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'SITUATIONAL' | 'CULTURE_FIT' | 'LEADERSHIP' | 'PROBLEM_SOLVING';
  question: string;
  reasoning: string; // Why this question for this candidate
  lookingFor: string[]; // Key points in ideal answer
  redFlags: string[]; // Warning signs in answer
  followUpQuestions: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  priority: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
  linkedToSkill?: string;
  linkedToExperience?: string;
}

export interface InterviewQuestionSet {
  candidateId: string;
  positionId: string;
  generatedAt: string;
  questions: TailoredInterviewQuestion[];
  structure: {
    openingQuestions: string[];
    coreQuestions: string[];
    closingQuestions: string[];
  };
  focusAreas: string[];
  estimatedDuration: number; // minutes
}

// ============================================
// HIDDEN GEM DETECTION
// ============================================

export interface HiddenGemAnalysis {
  candidateId: string;
  isHiddenGem: boolean;
  gemScore: number; // 0-100
  hiddenStrengths: {
    transferableSkills: TransferableSkill[];
    nonTraditionalBackground: string[];
    uniquePerspectives: string[];
    undervaluedExperience: string[];
  };
  whyOverlooked: string[];
  realPotential: string;
  developmentPath: string;
  riskMitigation: string[];
  testimonialValue: string; // diversity, unique background story
}

export interface TransferableSkill {
  skill: string;
  fromContext: string; // where they learned it
  applicableTo: string; // how it applies to target role
  strength: number; // 0-100
  examples: string[];
}

// ============================================
// TEAM CHEMISTRY PREDICTION
// ============================================

export interface TeamChemistryPrediction {
  candidateId: string;
  targetTeamId?: string;
  overallChemistryScore: number; // 0-100
  workingStyleCompatibility: {
    candidateStyle: string[];
    teamAverageStyle: string[];
    compatibility: number; // 0-100
    potentialConflicts: string[];
    synergies: string[];
  };
  communicationFit: {
    candidatePreference: string;
    teamNorm: string;
    alignment: number; // 0-100
  };
  diversityImpact: {
    bringsNewPerspective: boolean;
    skillDiversity: number; // 0-100
    backgroundDiversity: number; // 0-100
    thoughtDiversity: number; // 0-100
  };
  potentialMentors: string[]; // team member IDs
  potentialMentees: string[]; // team member IDs
  integrationTimeline: string;
  recommendations: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  workStyle: string[];
  skills: string[];
  personality: string;
  tenure: number; // months
}

export interface TeamComposition {
  teamId: string;
  teamName: string;
  department: string;
  members: TeamMember[];
  currentDynamics: string;
  needsAnalysis: string[];
}

// ============================================
// REFERENCE CHECK QUESTIONS
// ============================================

export interface ReferenceCheckQuestion {
  id: string;
  category: 'PERFORMANCE' | 'WORK_ETHIC' | 'TEAMWORK' | 'LEADERSHIP' | 'GROWTH' | 'RED_FLAGS';
  question: string;
  targetedAt: string; // specific claim or experience from resume
  reasoning: string;
  idealAnswer: string;
  concerningAnswers: string[];
  followUpIf: {
    condition: string;
    question: string;
  };
  priority: 'CRITICAL' | 'IMPORTANT' | 'OPTIONAL';
}

export interface ReferenceCheckGuide {
  candidateId: string;
  generatedAt: string;
  questions: ReferenceCheckQuestion[];
  focusAreas: string[];
  verificationPoints: {
    claim: string;
    source: string; // resume, interview, etc.
    howToVerify: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  redFlagsToWatch: string[];
}

// ============================================
// OFFER ACCEPTANCE PROBABILITY
// ============================================

export interface OfferAcceptancePrediction {
  candidateId: string;
  positionId: string;
  acceptanceProbability: number; // 0-100
  factors: {
    compensationAlignment: {
      offered: number;
      expected: number;
      marketRate: number;
      satisfaction: number; // 0-100
    };
    careerGrowth: {
      alignsWithGoals: boolean;
      growthPotential: number; // 0-100
      learningOpportunities: string[];
    };
    locationFit: {
      commute: string;
      relocationRequired: boolean;
      locationPreference: number; // 0-100
    };
    companyFit: {
      cultureAlignment: number; // 0-100
      brandAppeal: number; // 0-100
      missionAlignment: number; // 0-100
    };
    competingOffers: {
      likely: boolean;
      estimatedCount: number;
      betterPositioned: boolean;
    };
  };
  negotiationLikelihood: number; // 0-100
  counterOfferRisk: number; // 0-100
  decisionTimeline: string;
  optimizationSuggestions: {
    strengthenOffer: string[];
    addressConcerns: string[];
    emphasize: string[];
  };
  closingStrategy: string;
}

// ============================================
// TALENT POOL CATEGORIZATION
// ============================================

export interface TalentPoolCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  criteria: {
    minScore?: number;
    maxScore?: number;
    skills?: string[];
    experience?: string[];
    tags?: string[];
    customRules?: string;
  };
  action: {
    followUpTimeline: string;
    nurturingStrategy: string;
    reassessmentInterval: number; // days
    autoNotifications: boolean;
  };
}

export interface CandidatePoolAssignment {
  candidateId: string;
  categories: {
    categoryId: string;
    categoryName: string;
    assignedAt: string;
    confidence: number; // 0-100
    reason: string;
  }[];
  tags: string[];
  nextReviewDate: string;
  developmentPlan?: string;
  notes: string;
}

// ============================================
// COMBINED ADVANCED ANALYSIS
// ============================================

export interface AdvancedCandidateAnalysis {
  candidateId: string;
  analyzedAt: string;

  // All advanced features combined
  topPerformerMatch?: TopPerformerMatch;
  careerMomentum?: CareerMomentum;
  reverseMatching?: ReverseMatching;
  flightRisk?: FlightRiskAssessment;
  interviewQuestions?: InterviewQuestionSet;
  hiddenGemAnalysis?: HiddenGemAnalysis;
  teamChemistry?: TeamChemistryPrediction;
  referenceCheckGuide?: ReferenceCheckGuide;
  offerAcceptance?: OfferAcceptancePrediction;
  poolAssignment?: CandidatePoolAssignment;

  // Overall insights
  overallRecommendation: string;
  hiringConfidence: number; // 0-100
  uniqueValue: string;
  risks: string[];
  opportunities: string[];
  nextSteps: string[];
}
