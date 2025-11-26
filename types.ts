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
