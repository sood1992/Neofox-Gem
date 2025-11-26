import {
  User,
  UserRole,
  Candidate,
  JobPosition,
  CandidateAnalysis,
  SavedSearch,
  TeamFeedback,
  Note,
  BulkUploadJob,
  Department,
  ExperienceLevel,
  EmploymentType,
  CandidateStatus
} from '../types';

const STORAGE_VERSION = 'v1';
const KEYS = {
  USERS: `hr_users_${STORAGE_VERSION}`,
  CANDIDATES: `hr_candidates_${STORAGE_VERSION}`,
  POSITIONS: `hr_positions_${STORAGE_VERSION}`,
  ANALYSES: `hr_analyses_${STORAGE_VERSION}`,
  SAVED_SEARCHES: `hr_saved_searches_${STORAGE_VERSION}`,
  TEAM_FEEDBACK: `hr_team_feedback_${STORAGE_VERSION}`,
  BULK_JOBS: `hr_bulk_jobs_${STORAGE_VERSION}`,
};

export class StorageService {
  // ============================================
  // INITIALIZATION WITH SEED DATA
  // ============================================

  static init() {
    if (localStorage.getItem(KEYS.USERS)) return;

    // Seed Users
    const seedUsers: User[] = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@neofox.com',
        role: UserRole.ADMIN,
        avatar: 'https://i.pravatar.cc/150?img=1',
        department: Department.HR,
        password: 'Admin1234',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-2',
        name: 'Michael Rodriguez',
        email: 'michael.r@neofox.com',
        role: UserRole.HR_MANAGER,
        avatar: 'https://i.pravatar.cc/150?img=12',
        department: Department.HR,
        password: 'Manager1234',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-3',
        name: 'Emily Johnson',
        email: 'emily.j@neofox.com',
        role: UserRole.RECRUITER,
        avatar: 'https://i.pravatar.cc/150?img=5',
        department: Department.HR,
        password: 'Recruiter1234',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-4',
        name: 'David Kim',
        email: 'david.k@neofox.com',
        role: UserRole.HIRING_MANAGER,
        avatar: 'https://i.pravatar.cc/150?img=14',
        department: Department.ENGINEERING,
        password: 'Hiring1234',
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed Job Positions
    const seedPositions: JobPosition[] = [
      {
        id: 'pos-1',
        title: 'Senior Full Stack Engineer',
        department: Department.ENGINEERING,
        description: 'We are looking for an experienced full-stack engineer to join our growing team.',
        responsibilities: [
          'Design and develop scalable web applications',
          'Collaborate with cross-functional teams',
          'Mentor junior developers',
          'Participate in code reviews and architecture decisions',
        ],
        requirements: [
          '5+ years of professional software development experience',
          'Strong proficiency in React, Node.js, and TypeScript',
          'Experience with cloud platforms (AWS/GCP/Azure)',
          'Excellent problem-solving and communication skills',
        ],
        preferredQualifications: [
          'Experience with microservices architecture',
          'Knowledge of DevOps practices and CI/CD',
          'Open source contributions',
          'Experience leading technical projects',
        ],
        experienceLevel: ExperienceLevel.SENIOR,
        employmentType: EmploymentType.FULL_TIME,
        location: 'San Francisco, CA',
        remote: true,
        salaryMin: 150000,
        salaryMax: 200000,
        currency: 'USD',
        openings: 2,
        hiringManagerId: 'user-4',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'OPEN',
      },
      {
        id: 'pos-2',
        title: 'Product Designer',
        department: Department.DESIGN,
        description: 'Join our design team to create beautiful and intuitive user experiences.',
        responsibilities: [
          'Create wireframes, prototypes, and high-fidelity designs',
          'Conduct user research and usability testing',
          'Collaborate with product and engineering teams',
          'Maintain and evolve design system',
        ],
        requirements: [
          '3+ years of product design experience',
          'Strong portfolio demonstrating UX/UI skills',
          'Proficiency in Figma and design tools',
          'Understanding of user-centered design principles',
        ],
        preferredQualifications: [
          'Experience with motion design and prototyping',
          'Knowledge of front-end development (HTML/CSS)',
          'Experience with design systems',
        ],
        experienceLevel: ExperienceLevel.MID,
        employmentType: EmploymentType.FULL_TIME,
        location: 'New York, NY',
        remote: true,
        salaryMin: 110000,
        salaryMax: 140000,
        currency: 'USD',
        openings: 1,
        hiringManagerId: 'user-4',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'OPEN',
      },
    ];

    // Seed Sample Candidates
    const seedCandidates: Candidate[] = [
      {
        id: 'cand-1',
        firstName: 'Alex',
        lastName: 'Thompson',
        email: 'alex.thompson@email.com',
        phone: '+1-555-0101',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/alexthompson',
        githubUrl: 'https://github.com/alexthompson',
        currentJobTitle: 'Senior Software Engineer',
        currentCompany: 'TechCorp Inc.',
        totalYearsExperience: 7,
        experienceLevel: ExperienceLevel.SENIOR,
        expectedSalary: 175000,
        noticePeriod: 30,
        willingToRelocate: false,
        appliedPositions: ['pos-1'],
        source: 'LINKEDIN',
        summary: 'Experienced full-stack engineer with a passion for building scalable web applications. Strong background in React, Node.js, and cloud technologies.',
        skills: [
          'React',
          'TypeScript',
          'Node.js',
          'AWS',
          'PostgreSQL',
          'Docker',
          'Kubernetes',
          'GraphQL',
          'Redux',
          'Jest',
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2012-09',
            endDate: '2016-06',
            current: false,
            gpa: 3.8,
            achievements: ['Dean\'s List', 'Graduated with Honors'],
          },
        ],
        workExperience: [
          {
            id: 'work-1',
            company: 'TechCorp Inc.',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            endDate: 'Present',
            current: true,
            description: 'Lead development of customer-facing web applications',
            achievements: [
              'Led migration to microservices architecture, reducing deployment time by 60%',
              'Mentored 5 junior developers',
              'Implemented CI/CD pipeline using GitHub Actions',
            ],
            skills: ['React', 'Node.js', 'AWS', 'Docker', 'TypeScript'],
          },
          {
            id: 'work-2',
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: '2016-07',
            endDate: '2019-12',
            current: false,
            description: 'Developed and maintained multiple web applications',
            achievements: [
              'Built real-time chat feature serving 100K+ users',
              'Optimized database queries reducing load time by 40%',
            ],
            skills: ['React', 'Node.js', 'MongoDB', 'Redis'],
          },
        ],
        certifications: [
          {
            id: 'cert-1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2021-03',
            credentialId: 'AWS-SA-2021-12345',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'NATIVE' },
          { name: 'Spanish', proficiency: 'CONVERSATIONAL' },
        ],
        status: CandidateStatus.NEW,
        addedBy: 'user-3',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['strong-technical', 'aws', 'full-stack'],
        notes: [],
        attachments: [],
      },
      {
        id: 'cand-2',
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@email.com',
        phone: '+1-555-0102',
        location: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/in/priyapatel',
        portfolioUrl: 'https://priyapatel.design',
        currentJobTitle: 'Product Designer',
        currentCompany: 'Design Studio',
        totalYearsExperience: 4,
        experienceLevel: ExperienceLevel.MID,
        expectedSalary: 125000,
        noticePeriod: 14,
        willingToRelocate: true,
        appliedPositions: ['pos-2'],
        source: 'JOB_BOARD',
        summary: 'Creative product designer focused on creating delightful user experiences. Strong background in UX research and design systems.',
        skills: [
          'Figma',
          'Adobe XD',
          'Sketch',
          'User Research',
          'Prototyping',
          'Design Systems',
          'HTML/CSS',
          'Usability Testing',
        ],
        education: [
          {
            id: 'edu-2',
            institution: 'Rhode Island School of Design',
            degree: 'Bachelor of Fine Arts',
            field: 'Graphic Design',
            startDate: '2015-09',
            endDate: '2019-05',
            current: false,
            gpa: 3.9,
          },
        ],
        workExperience: [
          {
            id: 'work-3',
            company: 'Design Studio',
            position: 'Product Designer',
            location: 'Austin, TX',
            startDate: '2021-03',
            endDate: 'Present',
            current: true,
            description: 'Design user interfaces for B2B SaaS products',
            achievements: [
              'Redesigned onboarding flow, increasing user activation by 35%',
              'Created and maintained component library in Figma',
              'Conducted 50+ user interviews and usability tests',
            ],
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          },
          {
            id: 'work-4',
            company: 'Creative Agency',
            position: 'Junior Designer',
            location: 'Austin, TX',
            startDate: '2019-06',
            endDate: '2021-02',
            current: false,
            description: 'Worked on various client projects',
            achievements: [
              'Designed websites for 20+ clients',
              'Won agency design award for best mobile app design',
            ],
            skills: ['Adobe XD', 'Sketch', 'HTML/CSS'],
          },
        ],
        certifications: [],
        languages: [
          { name: 'English', proficiency: 'PROFESSIONAL' },
          { name: 'Hindi', proficiency: 'NATIVE' },
        ],
        status: CandidateStatus.NEW,
        addedBy: 'user-3',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['design', 'ux-research', 'figma'],
        notes: [],
        attachments: [],
      },
    ];

    localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
    localStorage.setItem(KEYS.POSITIONS, JSON.stringify(seedPositions));
    localStorage.setItem(KEYS.CANDIDATES, JSON.stringify(seedCandidates));
    localStorage.setItem(KEYS.ANALYSES, JSON.stringify([]));
    localStorage.setItem(KEYS.SAVED_SEARCHES, JSON.stringify([]));
    localStorage.setItem(KEYS.TEAM_FEEDBACK, JSON.stringify([]));
    localStorage.setItem(KEYS.BULK_JOBS, JSON.stringify([]));
  }

  // ============================================
  // USER OPERATIONS
  // ============================================

  static getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  static getUser(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  // ============================================
  // CANDIDATE OPERATIONS
  // ============================================

  static getCandidates(): Candidate[] {
    const data = localStorage.getItem(KEYS.CANDIDATES);
    return data ? JSON.parse(data) : [];
  }

  static getCandidate(id: string): Candidate | undefined {
    return this.getCandidates().find((c) => c.id === id);
  }

  static saveCandidate(candidate: Candidate): void {
    const candidates = this.getCandidates();
    const index = candidates.findIndex((c) => c.id === candidate.id);

    candidate.updatedAt = new Date().toISOString();

    if (index >= 0) {
      candidates[index] = candidate;
    } else {
      candidates.push(candidate);
    }
    localStorage.setItem(KEYS.CANDIDATES, JSON.stringify(candidates));
  }

  static deleteCandidate(id: string): void {
    const candidates = this.getCandidates().filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CANDIDATES, JSON.stringify(candidates));
  }

  static addNoteToCandidate(candidateId: string, note: Note): void {
    const candidate = this.getCandidate(candidateId);
    if (candidate) {
      candidate.notes.push(note);
      this.saveCandidate(candidate);
    }
  }

  // ============================================
  // JOB POSITION OPERATIONS
  // ============================================

  static getPositions(): JobPosition[] {
    const data = localStorage.getItem(KEYS.POSITIONS);
    return data ? JSON.parse(data) : [];
  }

  static getPosition(id: string): JobPosition | undefined {
    return this.getPositions().find((p) => p.id === id);
  }

  static savePosition(position: JobPosition): void {
    const positions = this.getPositions();
    const index = positions.findIndex((p) => p.id === position.id);
    if (index >= 0) {
      positions[index] = position;
    } else {
      positions.push(position);
    }
    localStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions));
  }

  static deletePosition(id: string): void {
    const positions = this.getPositions().filter((p) => p.id !== id);
    localStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions));
  }

  static createPosition(position: JobPosition): void {
    this.savePosition(position);
  }

  static updatePosition(id: string, position: JobPosition): void {
    this.savePosition(position);
  }

  // ============================================
  // CANDIDATE UPDATE/CREATE OPERATIONS
  // ============================================

  static updateCandidate(id: string, candidate: Candidate): void {
    this.saveCandidate(candidate);
  }

  static createCandidate(candidate: Candidate): void {
    this.saveCandidate(candidate);
  }

  // ============================================
  // CANDIDATE ANALYSIS OPERATIONS
  // ============================================

  static getAnalyses(): CandidateAnalysis[] {
    const data = localStorage.getItem(KEYS.ANALYSES);
    return data ? JSON.parse(data) : [];
  }

  static getAnalysis(candidateId: string, positionId: string): CandidateAnalysis | undefined {
    return this.getAnalyses().find(
      (a) => a.candidateId === candidateId && a.positionId === positionId
    );
  }

  static saveAnalysis(analysis: CandidateAnalysis): void {
    const analyses = this.getAnalyses();
    const index = analyses.findIndex(
      (a) => a.candidateId === analysis.candidateId && a.positionId === analysis.positionId
    );
    if (index >= 0) {
      analyses[index] = analysis;
    } else {
      analyses.push(analysis);
    }
    localStorage.setItem(KEYS.ANALYSES, JSON.stringify(analyses));
  }

  // ============================================
  // SAVED SEARCH OPERATIONS
  // ============================================

  static getSavedSearches(): SavedSearch[] {
    const data = localStorage.getItem(KEYS.SAVED_SEARCHES);
    return data ? JSON.parse(data) : [];
  }

  static saveSavedSearch(search: SavedSearch): void {
    const searches = this.getSavedSearches();
    const index = searches.findIndex((s) => s.id === search.id);
    if (index >= 0) {
      searches[index] = search;
    } else {
      searches.push(search);
    }
    localStorage.setItem(KEYS.SAVED_SEARCHES, JSON.stringify(searches));
  }

  static deleteSavedSearch(id: string): void {
    const searches = this.getSavedSearches().filter((s) => s.id !== id);
    localStorage.setItem(KEYS.SAVED_SEARCHES, JSON.stringify(searches));
  }

  // ============================================
  // TEAM FEEDBACK OPERATIONS
  // ============================================

  static getTeamFeedback(): TeamFeedback[] {
    const data = localStorage.getItem(KEYS.TEAM_FEEDBACK);
    return data ? JSON.parse(data) : [];
  }

  static saveTeamFeedback(feedback: TeamFeedback): void {
    const feedbacks = this.getTeamFeedback();
    feedbacks.push(feedback);
    localStorage.setItem(KEYS.TEAM_FEEDBACK, JSON.stringify(feedbacks));
  }

  static getFeedbackForCandidate(candidateId: string): TeamFeedback[] {
    return this.getTeamFeedback().filter((f) => f.candidateId === candidateId);
  }

  // ============================================
  // BULK UPLOAD OPERATIONS
  // ============================================

  static getBulkJobs(): BulkUploadJob[] {
    const data = localStorage.getItem(KEYS.BULK_JOBS);
    return data ? JSON.parse(data) : [];
  }

  static saveBulkJob(job: BulkUploadJob): void {
    const jobs = this.getBulkJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    localStorage.setItem(KEYS.BULK_JOBS, JSON.stringify(jobs));
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  static generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static clearAllData(): void {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
