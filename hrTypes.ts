// HR Candidate Vetting System Types

// ============ ENUMS ============

export enum CandidateStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum SourceType {
  RESUME_UPLOAD = 'RESUME_UPLOAD',
  LINKEDIN = 'LINKEDIN',
  INDEED = 'INDEED',
  GLASSDOOR = 'GLASSDOOR',
  REFERRAL = 'REFERRAL',
  CAREER_PAGE = 'CAREER_PAGE',
  JOB_BOARD = 'JOB_BOARD',
  RECRUITER = 'RECRUITER',
  OTHER = 'OTHER'
}

export enum RedFlagType {
  EMPLOYMENT_GAP = 'EMPLOYMENT_GAP',
  FREQUENT_JOB_CHANGES = 'FREQUENT_JOB_CHANGES',
  SKILL_MISMATCH = 'SKILL_MISMATCH',
  EXPERIENCE_INFLATION = 'EXPERIENCE_INFLATION',
  INCONSISTENT_DATES = 'INCONSISTENT_DATES',
  NO_PROGRESSION = 'NO_PROGRESSION',
  VAGUE_DESCRIPTIONS = 'VAGUE_DESCRIPTIONS',
  MISSING_EDUCATION = 'MISSING_EDUCATION',
  SALARY_MISMATCH = 'SALARY_MISMATCH',
  NEGATIVE_REFERENCES = 'NEGATIVE_REFERENCES',
  INCOMPLETE_PROFILE = 'INCOMPLETE_PROFILE',
  OVERQUALIFIED = 'OVERQUALIFIED',
  UNDERQUALIFIED = 'UNDERQUALIFIED'
}

export enum StrengthType {
  RELEVANT_EXPERIENCE = 'RELEVANT_EXPERIENCE',
  SKILL_MATCH = 'SKILL_MATCH',
  CAREER_PROGRESSION = 'CAREER_PROGRESSION',
  PRESTIGIOUS_COMPANIES = 'PRESTIGIOUS_COMPANIES',
  STRONG_EDUCATION = 'STRONG_EDUCATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
  LEADERSHIP_EXPERIENCE = 'LEADERSHIP_EXPERIENCE',
  PROJECT_IMPACT = 'PROJECT_IMPACT',
  CULTURAL_FIT = 'CULTURAL_FIT',
  SALARY_ALIGNMENT = 'SALARY_ALIGNMENT',
  LOCATION_MATCH = 'LOCATION_MATCH',
  AVAILABILITY = 'AVAILABILITY'
}

export enum ExperienceLevel {
  INTERN = 'INTERN',
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  VP = 'VP',
  C_LEVEL = 'C_LEVEL'
}

// ============ CORE INTERFACES ============

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  location: string;
  remotePolicy: 'ONSITE' | 'HYBRID' | 'REMOTE';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceLevel: ExperienceLevel;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  culturalValues: string[];
  status: 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED' | 'FILLED';
  createdAt: string;
  updatedAt: string;
  hiringManagerId: string;
  recruiterId?: string;
  targetHireDate?: string;
  candidateCount?: number;
}

export interface SkillRequirement {
  skill: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsRequired?: number;
  isRequired: boolean;
  weight: number; // 0-100 for scoring
}

export interface Candidate {
  id: string;
  positionId: string;

  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  photoUrl?: string;

  // Source Information
  source: SourceType;
  sourceDetails?: string;
  referredBy?: string;

  // Professional Information
  currentTitle: string;
  currentCompany?: string;
  experienceLevel: ExperienceLevel;
  totalYearsExperience: number;

  // Parsed Resume Data
  resumeUrl?: string;
  resumeText?: string;
  parsedData?: ParsedResumeData;

  // Analysis Results
  analysis?: CandidateAnalysis;

  // Scoring
  overallScore: number; // 0-100
  skillMatchScore: number;
  experienceScore: number;
  culturalFitScore: number;
  customScores: CustomScore[];

  // Status & Tracking
  status: CandidateStatus;
  stage: number; // Pipeline stage
  ranking?: number;

  // Red Flags & Strengths
  redFlags: RedFlag[];
  strengths: Strength[];

  // Team Collaboration
  notes: CandidateNote[];
  ratings: TeamRating[];
  tags: string[];

  // Salary & Expectations
  salaryExpectation?: number;
  noticePeriod?: string;
  willingToRelocate?: boolean;
  visaRequired?: boolean;

  // Timestamps
  appliedAt: string;
  lastUpdated: string;
  lastContactedAt?: string;

  // AI Insights
  aiSummary?: string;
  aiRecommendation?: 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'NEUTRAL' | 'NOT_RECOMMEND' | 'STRONGLY_NOT_RECOMMEND';
  aiConfidence?: number;
}

export interface ParsedResumeData {
  extractedAt: string;
  confidence: number;

  // Contact Info
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;

  // Summary
  summary?: string;
  objective?: string;

  // Experience
  workExperience: WorkExperience[];

  // Education
  education: Education[];

  // Skills
  skills: ExtractedSkill[];

  // Certifications
  certifications: Certification[];

  // Languages
  languages: LanguageSkill[];

  // Projects
  projects: Project[];

  // Publications & Patents
  publications?: string[];
  patents?: string[];

  // Awards & Achievements
  awards?: string[];

  // Volunteer Work
  volunteerWork?: VolunteerExperience[];
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string; // null means current
  isCurrent: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  honors?: string[];
  relevantCoursework?: string[];
}

export interface ExtractedSkill {
  name: string;
  category: 'TECHNICAL' | 'SOFT' | 'TOOL' | 'LANGUAGE' | 'FRAMEWORK' | 'OTHER';
  proficiencyLevel?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience?: number;
  lastUsed?: string;
  endorsements?: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageSkill {
  language: string;
  proficiency: 'BASIC' | 'CONVERSATIONAL' | 'PROFESSIONAL' | 'FLUENT' | 'NATIVE';
}

export interface Project {
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface VolunteerExperience {
  organization: string;
  role: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

// ============ ANALYSIS INTERFACES ============

export interface CandidateAnalysis {
  analyzedAt: string;
  version: string;

  // Fit Analysis
  overallFitScore: number;
  fitBreakdown: FitBreakdown;

  // Skills Analysis
  skillsAnalysis: SkillsAnalysis;

  // Experience Analysis
  experienceAnalysis: ExperienceAnalysis;

  // Cultural Fit
  culturalFitAnalysis: CulturalFitAnalysis;

  // Employment Gaps
  gapAnalysis: GapAnalysis[];

  // Red Flags
  redFlagAnalysis: RedFlagAnalysis[];

  // Strengths
  strengthAnalysis: StrengthAnalysis[];

  // Salary Analysis
  salaryAnalysis: SalaryAnalysis;

  // Career Trajectory
  careerTrajectory: CareerTrajectoryAnalysis;

  // Recommendations
  recommendations: string[];

  // Key Talking Points for Interview
  interviewQuestions: InterviewQuestion[];

  // Comparison with Role Requirements
  requirementMatchMatrix: RequirementMatch[];

  // AI Narrative
  narrativeSummary: string;
  whyGoodFit: string[];
  whyNotGoodFit: string[];

  // Risk Assessment
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];
}

export interface FitBreakdown {
  technicalFit: number;
  experienceFit: number;
  culturalFit: number;
  salaryFit: number;
  availabilityFit: number;
  locationFit: number;
}

export interface SkillsAnalysis {
  matchedSkills: SkillMatch[];
  missingSkills: MissingSkill[];
  additionalSkills: string[];
  skillGapScore: number; // 0-100, higher = more gaps
  skillStrengthScore: number; // 0-100, higher = better match
  recommendations: string[];
}

export interface SkillMatch {
  skill: string;
  required: boolean;
  candidateLevel: string;
  requiredLevel: string;
  matchPercentage: number;
  evidence: string[];
}

export interface MissingSkill {
  skill: string;
  required: boolean;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  canBeLearned: boolean;
  learningTimeEstimate?: string;
  alternatives?: string[];
}

export interface ExperienceAnalysis {
  totalYears: number;
  relevantYears: number;
  seniorityLevel: ExperienceLevel;
  expectedLevel: ExperienceLevel;
  levelMatch: 'UNDER' | 'MATCH' | 'OVER';
  industryExperience: IndustryExperience[];
  roleProgression: RoleProgression;
  notableCompanies: string[];
  projectHighlights: ProjectHighlight[];
}

export interface IndustryExperience {
  industry: string;
  years: number;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RoleProgression {
  hasProgression: boolean;
  progressionRate: 'SLOW' | 'AVERAGE' | 'FAST';
  promotions: number;
  lateralMoves: number;
  careerPath: string;
}

export interface ProjectHighlight {
  project: string;
  impact: string;
  relevance: number;
  skills: string[];
}

export interface CulturalFitAnalysis {
  overallScore: number;
  indicators: CulturalIndicator[];
  workStyleMatch: WorkStyleMatch;
  valuesAlignment: ValueAlignment[];
  teamFitPrediction: string;
  potentialChallenges: string[];
}

export interface CulturalIndicator {
  indicator: string;
  evidence: string;
  score: number;
  source: string;
}

export interface WorkStyleMatch {
  remote: number;
  collaborative: number;
  autonomous: number;
  structured: number;
  fastPaced: number;
}

export interface ValueAlignment {
  value: string;
  alignment: number;
  evidence?: string;
}

export interface GapAnalysis {
  startDate: string;
  endDate: string;
  durationMonths: number;
  explanation?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  isExplained: boolean;
  potentialReasons: string[];
}

export interface RedFlagAnalysis {
  type: RedFlagType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  evidence: string[];
  recommendation: string;
  canBeAddressed: boolean;
}

export interface StrengthAnalysis {
  type: StrengthType;
  strength: 'MODERATE' | 'STRONG' | 'EXCEPTIONAL';
  description: string;
  evidence: string[];
  relevanceToRole: number;
}

export interface SalaryAnalysis {
  expectedSalary?: number;
  marketRate: {
    min: number;
    mid: number;
    max: number;
  };
  budgetRange: {
    min: number;
    max: number;
  };
  alignment: 'BELOW' | 'WITHIN' | 'ABOVE' | 'FAR_ABOVE';
  negotiationRoom?: string;
  recommendation: string;
}

export interface CareerTrajectoryAnalysis {
  pattern: 'ASCENDING' | 'STABLE' | 'MIXED' | 'DESCENDING';
  avgTenure: number;
  longestTenure: number;
  shortestTenure: number;
  jobChanges: number;
  industryChanges: number;
  roleChanges: number;
  prediction: string;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface InterviewQuestion {
  question: string;
  purpose: string;
  expectedAnswer?: string;
  redFlagAnswers?: string[];
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'SITUATIONAL' | 'CULTURAL' | 'CLARIFICATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  relatedTo?: string; // e.g., specific skill or red flag
}

export interface RequirementMatch {
  requirement: string;
  type: 'REQUIRED' | 'PREFERRED';
  matched: boolean;
  matchLevel: number; // 0-100
  evidence: string[];
  notes?: string;
}

// ============ RED FLAGS & STRENGTHS ============

export interface RedFlag {
  id: string;
  type: RedFlagType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  evidence: string[];
  detectedAt: string;
  resolvedAt?: string;
  resolution?: string;
  addedBy: 'AI' | string; // 'AI' or user ID
}

export interface Strength {
  id: string;
  type: StrengthType;
  strength: 'MODERATE' | 'STRONG' | 'EXCEPTIONAL';
  title: string;
  description: string;
  evidence: string[];
  detectedAt: string;
  addedBy: 'AI' | string;
}

// ============ TEAM COLLABORATION ============

export interface CandidateNote {
  id: string;
  candidateId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'GENERAL' | 'INTERVIEW' | 'FEEDBACK' | 'CONCERN' | 'POSITIVE';
  isPrivate: boolean;
  mentions: string[]; // User IDs
  createdAt: string;
  updatedAt?: string;
  reactions: NoteReaction[];
}

export interface NoteReaction {
  userId: string;
  reaction: '👍' | '👎' | '❓' | '⚠️' | '✅';
  createdAt: string;
}

export interface TeamRating {
  id: string;
  candidateId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  overallRating: number; // 1-5
  criteriaRatings: CriteriaRating[];
  recommendation: 'HIRE' | 'MAYBE' | 'NO_HIRE';
  comments?: string;
  createdAt: string;
}

export interface CriteriaRating {
  criteriaId: string;
  criteriaName: string;
  rating: number; // 1-5
  weight: number;
}

// ============ CUSTOM SCORING ============

export interface ScoringCriteria {
  id: string;
  positionId: string;
  name: string;
  description: string;
  weight: number; // 0-100, total should be 100
  type: 'SKILL' | 'EXPERIENCE' | 'EDUCATION' | 'CULTURAL' | 'CUSTOM';
  autoScore: boolean;
  scoringRubric?: ScoringRubric;
  createdBy: string;
  createdAt: string;
}

export interface ScoringRubric {
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
  examples?: string[];
}

export interface CustomScore {
  criteriaId: string;
  criteriaName: string;
  score: number;
  maxScore: number;
  weight: number;
  scoredBy: 'AI' | string;
  scoredAt: string;
  notes?: string;
}

// ============ REPORTING ============

export interface CandidateReport {
  id: string;
  candidateId: string;
  positionId: string;
  generatedAt: string;
  generatedBy: string;

  // Report Sections
  executiveSummary: string;
  candidateOverview: CandidateOverview;
  skillsAssessment: SkillsAssessmentReport;
  experienceReview: ExperienceReviewReport;
  culturalFitAssessment: CulturalFitReport;
  redFlagsSection: RedFlagsSectionReport;
  strengthsSection: StrengthsSectionReport;
  salaryAnalysisSection: SalaryAnalysisReport;
  teamFeedback: TeamFeedbackReport;
  recommendation: RecommendationReport;

  // Comparison Data (if applicable)
  competitiveAnalysis?: CompetitiveAnalysisReport;

  format: 'PDF' | 'HTML' | 'MARKDOWN';
}

export interface CandidateOverview {
  name: string;
  currentRole: string;
  experience: string;
  location: string;
  source: string;
  appliedDate: string;
  overallScore: number;
  ranking?: number;
  totalCandidates?: number;
}

export interface SkillsAssessmentReport {
  matchPercentage: number;
  matchedSkills: string[];
  missingCriticalSkills: string[];
  additionalSkills: string[];
  gapAnalysis: string;
  recommendation: string;
}

export interface ExperienceReviewReport {
  totalYears: number;
  relevantYears: number;
  keyRoles: string[];
  notableAchievements: string[];
  careerProgression: string;
  industryBackground: string;
}

export interface CulturalFitReport {
  score: number;
  strengths: string[];
  concerns: string[];
  workStyleFit: string;
  valuesAlignment: string;
}

export interface RedFlagsSectionReport {
  totalFlags: number;
  criticalFlags: RedFlagSummary[];
  moderateFlags: RedFlagSummary[];
  minorFlags: RedFlagSummary[];
  overallRisk: string;
}

export interface RedFlagSummary {
  title: string;
  description: string;
  severity: string;
  recommendation: string;
}

export interface StrengthsSectionReport {
  totalStrengths: number;
  exceptionalStrengths: string[];
  strongStrengths: string[];
  moderateStrengths: string[];
  topDifferentiators: string[];
}

export interface SalaryAnalysisReport {
  candidateExpectation: string;
  marketRate: string;
  budgetAlignment: string;
  negotiationRecommendation: string;
}

export interface TeamFeedbackReport {
  totalReviewers: number;
  averageRating: number;
  recommendations: {
    hire: number;
    maybe: number;
    noHire: number;
  };
  keyFeedback: string[];
}

export interface RecommendationReport {
  decision: 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'NEUTRAL' | 'NOT_RECOMMEND' | 'STRONGLY_NOT_RECOMMEND';
  confidence: number;
  summary: string;
  nextSteps: string[];
  interviewFocus: string[];
}

export interface CompetitiveAnalysisReport {
  candidateName: string;
  candidateScore: number;
  comparedWith: ComparisonCandidate[];
  strengths: string[];
  weaknesses: string[];
  uniqueQualities: string[];
  recommendation: string;
}

export interface ComparisonCandidate {
  id: string;
  name: string;
  score: number;
  keyDifferences: string[];
}

// ============ COMPARISON VIEW ============

export interface CandidateComparison {
  id: string;
  positionId: string;
  candidateIds: string[];
  createdBy: string;
  createdAt: string;
  name?: string;

  // Comparison Data
  comparisonMatrix: ComparisonMatrix;

  // Summary
  summary: string;
  winner?: string;
  runnerUp?: string;
}

export interface ComparisonMatrix {
  criteria: ComparisonCriteria[];
  candidates: ComparisonCandidateData[];
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number;
  type: 'SCORE' | 'TEXT' | 'BOOLEAN' | 'LIST';
}

export interface ComparisonCandidateData {
  candidateId: string;
  candidateName: string;
  values: ComparisonValue[];
  overallScore: number;
  rank: number;
}

export interface ComparisonValue {
  criteriaId: string;
  value: number | string | boolean | string[];
  displayValue: string;
  color?: 'green' | 'yellow' | 'red' | 'neutral';
}

// ============ BATCH PROCESSING ============

export interface BatchUpload {
  id: string;
  positionId: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';

  totalFiles: number;
  processedFiles: number;
  successfulFiles: number;
  failedFiles: number;

  files: BatchFile[];
  errors: BatchError[];

  processingStartedAt?: string;
  processingCompletedAt?: string;
}

export interface BatchFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  candidateId?: string;
  error?: string;
  processedAt?: string;
}

export interface BatchError {
  fileId: string;
  fileName: string;
  error: string;
  timestamp: string;
}

// ============ SOCIAL MEDIA INSIGHTS ============

export interface SocialMediaInsights {
  candidateId: string;
  fetchedAt: string;

  linkedin?: LinkedInInsights;
  github?: GitHubInsights;
  twitter?: TwitterInsights;

  overallProfessionalPresence: number; // 0-100
  recommendations: string[];
  redFlags: string[];
}

export interface LinkedInInsights {
  profileUrl: string;
  connections: number;
  recommendations: number;
  endorsements: EndorsementSummary[];
  activityLevel: 'INACTIVE' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  contentQuality?: string;
  networkStrength: number;
  keyConnections?: string[];
}

export interface EndorsementSummary {
  skill: string;
  count: number;
}

export interface GitHubInsights {
  profileUrl: string;
  publicRepos: number;
  totalContributions: number;
  topLanguages: LanguageStat[];
  contributionPattern: string;
  codeQuality?: string;
  collaborationLevel: number;
  notableProjects?: string[];
}

export interface LanguageStat {
  language: string;
  percentage: number;
}

export interface TwitterInsights {
  handle: string;
  followers: number;
  following: number;
  tweetFrequency: string;
  professionalContent: number; // Percentage
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED';
  keyTopics: string[];
}

// ============ FILTERS & SORTING ============

export interface CandidateFilters {
  status?: CandidateStatus[];
  source?: SourceType[];
  experienceLevel?: ExperienceLevel[];
  minScore?: number;
  maxScore?: number;
  skills?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  hasRedFlags?: boolean;
  redFlagTypes?: RedFlagType[];
  tags?: string[];
  appliedAfter?: string;
  appliedBefore?: string;
  aiRecommendation?: string[];
  searchQuery?: string;
}

export interface CandidateSortOptions {
  field: 'score' | 'appliedAt' | 'name' | 'experience' | 'salary' | 'lastUpdated';
  direction: 'asc' | 'desc';
}

// ============ EXPORT ============

export interface ExportOptions {
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  candidates: string[]; // Candidate IDs, empty for all
  includeAnalysis: boolean;
  includeNotes: boolean;
  includeScores: boolean;
  includeRedFlags: boolean;
  includeComparison: boolean;
  columns?: string[]; // Specific columns for CSV/XLSX
  template?: 'SUMMARY' | 'DETAILED' | 'COMPARISON' | 'CUSTOM';
}

// ============ PIPELINE & WORKFLOW ============

export interface HiringPipeline {
  id: string;
  positionId: string;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  autoAdvanceCriteria?: AutoAdvanceCriteria;
  requiredActions?: string[];
  candidateCount?: number;
}

export interface AutoAdvanceCriteria {
  minScore?: number;
  requiredTags?: string[];
  noRedFlags?: boolean;
  teamApproval?: boolean;
}

// ============ ANALYTICS & DASHBOARD ============

export interface HRDashboardStats {
  totalCandidates: number;
  newToday: number;
  inReview: number;
  shortlisted: number;
  interviewed: number;
  offers: number;
  hired: number;
  rejected: number;

  avgTimeToHire: number; // days
  avgScore: number;
  topSources: SourceStat[];
  pipelineHealth: PipelineHealth;

  weeklyTrend: WeeklyTrend[];
}

export interface SourceStat {
  source: SourceType;
  count: number;
  avgScore: number;
  conversionRate: number;
}

export interface PipelineHealth {
  bottlenecks: string[];
  recommendations: string[];
  velocityScore: number;
}

export interface WeeklyTrend {
  week: string;
  applications: number;
  hires: number;
  rejections: number;
}
