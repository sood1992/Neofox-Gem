import {
  User,
  Candidate,
  JobPosition,
  CandidateAnalysis,
  UserRole,
  CandidateStatus,
  ExperienceLevel,
  Department,
  EmploymentType,
  TopPerformerProfile,
} from '../types';

/**
 * Demo Data Service
 * Generates realistic dummy data for demonstration purposes
 * Completely separate from real user data
 */
export class DemoDataService {

  // ============================================
  // DEMO USERS
  // ============================================

  static getDemoUsers(): User[] {
    return [
      {
        id: 'demo-user-1',
        name: 'Sarah Anderson',
        email: 'sarah@neofox-demo.com',
        role: UserRole.ADMIN,
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Anderson&background=6366f1&color=fff',
        department: Department.HR,
        joinedAt: '2023-01-15',
      },
      {
        id: 'demo-user-2',
        name: 'Michael Chen',
        email: 'michael@neofox-demo.com',
        role: UserRole.HR_MANAGER,
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff',
        department: Department.HR,
        joinedAt: '2023-03-20',
      },
      {
        id: 'demo-user-3',
        name: 'Emily Rodriguez',
        email: 'emily@neofox-demo.com',
        role: UserRole.RECRUITER,
        avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
        department: Department.HR,
        joinedAt: '2023-06-10',
      },
      {
        id: 'demo-user-4',
        name: 'David Kim',
        email: 'david@neofox-demo.com',
        role: UserRole.HIRING_MANAGER,
        avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=10b981&color=fff',
        department: Department.ENGINEERING,
        joinedAt: '2022-11-05',
      },
    ];
  }

  // ============================================
  // DEMO JOB POSITIONS
  // ============================================

  static getDemoPositions(): JobPosition[] {
    return [
      {
        id: 'demo-pos-1',
        title: 'Senior Full Stack Engineer',
        department: Department.ENGINEERING,
        description: 'We are seeking an experienced Full Stack Engineer to join our growing engineering team.',
        responsibilities: [
          'Design and develop scalable web applications',
          'Collaborate with product team on feature development',
          'Mentor junior developers',
          'Participate in code reviews and architectural decisions',
        ],
        requirements: [
          '5+ years of full-stack development experience',
          'Strong proficiency in React, Node.js, and TypeScript',
          'Experience with cloud platforms (AWS/GCP/Azure)',
          'Excellent problem-solving skills',
        ],
        preferredQualifications: [
          'Experience with microservices architecture',
          'Knowledge of DevOps practices',
          'Open source contributions',
        ],
        experienceLevel: ExperienceLevel.SENIOR,
        employmentType: EmploymentType.FULL_TIME,
        location: 'San Francisco, CA',
        remote: true,
        salaryMin: 140000,
        salaryMax: 180000,
        currency: 'USD',
        openings: 2,
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        hiringManagerId: 'demo-user-4',
        createdAt: '2024-01-10',
        deadline: '2024-12-31',
        status: 'OPEN',
      },
      {
        id: 'demo-pos-2',
        title: 'Product Designer',
        department: Department.DESIGN,
        description: 'Join our design team to create beautiful and intuitive user experiences.',
        responsibilities: [
          'Design user interfaces for web and mobile applications',
          'Create wireframes, prototypes, and design systems',
          'Collaborate with engineering and product teams',
          'Conduct user research and usability testing',
        ],
        requirements: [
          '3+ years of product design experience',
          'Proficiency in Figma and design tools',
          'Strong portfolio demonstrating UX/UI work',
          'Understanding of front-end development',
        ],
        preferredQualifications: [
          'Experience with design systems',
          'Motion design skills',
          'B2B SaaS experience',
        ],
        experienceLevel: ExperienceLevel.MID,
        employmentType: EmploymentType.FULL_TIME,
        location: 'New York, NY',
        remote: true,
        salaryMin: 100000,
        salaryMax: 130000,
        currency: 'USD',
        openings: 1,
        requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
        hiringManagerId: 'demo-user-4',
        createdAt: '2024-01-15',
        deadline: '2024-12-31',
        status: 'OPEN',
      },
      {
        id: 'demo-pos-3',
        title: 'DevOps Engineer',
        department: Department.ENGINEERING,
        description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.',
        responsibilities: [
          'Manage AWS infrastructure and deployments',
          'Build and maintain CI/CD pipelines',
          'Monitor system performance and reliability',
          'Implement security best practices',
        ],
        requirements: [
          '4+ years of DevOps experience',
          'Strong knowledge of AWS services',
          'Experience with Kubernetes and Docker',
          'Infrastructure as Code (Terraform/CloudFormation)',
        ],
        preferredQualifications: [
          'Certification in AWS',
          'Experience with monitoring tools (DataDog, New Relic)',
          'Python/Go scripting skills',
        ],
        experienceLevel: ExperienceLevel.SENIOR,
        employmentType: EmploymentType.FULL_TIME,
        location: 'Remote',
        remote: true,
        salaryMin: 130000,
        salaryMax: 170000,
        currency: 'USD',
        openings: 1,
        requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
        hiringManagerId: 'demo-user-4',
        createdAt: '2024-01-20',
        status: 'OPEN',
      },
    ];
  }

  // ============================================
  // DEMO CANDIDATES
  // ============================================

  static getDemoCandidates(): Candidate[] {
    return [
      {
        id: 'demo-cand-1',
        firstName: 'Alex',
        lastName: 'Thompson',
        name: 'Alex Thompson',
        email: 'alex.thompson@email-demo.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/alexthompson-demo',
        portfolioUrl: 'https://alexthompson-demo.dev',
        githubUrl: 'https://github.com/alexthompson-demo',
        currentJobTitle: 'Senior Software Engineer',
        currentCompany: 'TechCorp Inc',
        totalYearsExperience: 7,
        experienceLevel: ExperienceLevel.SENIOR,
        expectedSalary: 160000,
        noticePeriod: 30,
        willingToRelocate: true,
        appliedPositions: ['demo-pos-1'],
        resumeUrl: '/demo/resumes/alex-thompson.pdf',
        coverLetter: 'I am excited to apply for the Senior Full Stack Engineer position...',
        source: 'LINKEDIN',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'GraphQL', 'Docker', 'Kubernetes'],
        certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
        experience: [
          {
            company: 'TechCorp Inc',
            position: 'Senior Software Engineer',
            startDate: '2021-03-01',
            endDate: undefined,
            duration: '45',
            responsibilities: [
              'Led development of microservices architecture serving 1M+ users',
              'Mentored team of 5 junior engineers',
              'Reduced API response time by 60% through optimization',
            ],
            achievements: [
              'Architected and launched 3 major product features',
              'Improved deployment frequency from weekly to daily',
            ],
          },
          {
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            startDate: '2018-06-01',
            endDate: '2021-02-28',
            duration: '33',
            responsibilities: [
              'Built and maintained React/Node.js applications',
              'Implemented CI/CD pipelines',
              'Collaborated with design team on UX improvements',
            ],
            achievements: [
              'Reduced page load time by 40%',
              'Implemented real-time features using WebSockets',
            ],
          },
        ],
        education: [
          {
            institution: 'Stanford University',
            degree: 'BS',
            field: 'Computer Science',
            graduationYear: 2017,
            gpa: 3.8,
          },
        ],
        status: CandidateStatus.SHORTLISTED,
        tags: ['High-Potential', 'Strong-Technical'],
        notes: [],
        createdAt: '2024-01-25',
        updatedAt: '2024-01-28',
        uploadedBy: 'demo-user-3',
      },
      {
        id: 'demo-cand-2',
        firstName: 'Priya',
        lastName: 'Patel',
        name: 'Priya Patel',
        email: 'priya.patel@email-demo.com',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        linkedinUrl: 'https://linkedin.com/in/priyapatel-demo',
        portfolioUrl: 'https://priyapatel-demo.design',
        currentJobTitle: 'Product Designer',
        currentCompany: 'DesignHub',
        totalYearsExperience: 5,
        experienceLevel: ExperienceLevel.MID,
        expectedSalary: 115000,
        noticePeriod: 14,
        willingToRelocate: false,
        appliedPositions: ['demo-pos-2'],
        resumeUrl: '/demo/resumes/priya-patel.pdf',
        source: 'REFERRAL',
        skills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Sketch'],
        certifications: ['Google UX Design Certificate'],
        experience: [
          {
            company: 'DesignHub',
            position: 'Product Designer',
            startDate: '2020-09-01',
            duration: '40',
            responsibilities: [
              'Designed user interfaces for SaaS products',
              'Conducted user research and usability testing',
              'Built and maintained design system',
            ],
            achievements: [
              'Increased user engagement by 35% through redesign',
              'Created design system used across 15+ products',
            ],
          },
          {
            company: 'Creative Agency',
            position: 'UX Designer',
            startDate: '2019-01-01',
            endDate: '2020-08-31',
            duration: '20',
            responsibilities: [
              'Created wireframes and prototypes for client projects',
              'Collaborated with developers on implementation',
            ],
            achievements: [
              'Delivered 20+ successful client projects',
            ],
          },
        ],
        education: [
          {
            institution: 'Parsons School of Design',
            degree: 'BFA',
            field: 'Communication Design',
            graduationYear: 2018,
            gpa: 3.9,
          },
        ],
        status: CandidateStatus.INTERVIEWING,
        tags: ['Creative', 'User-Focused'],
        notes: [],
        createdAt: '2024-01-26',
        updatedAt: '2024-01-29',
        uploadedBy: 'demo-user-3',
      },
      {
        id: 'demo-cand-3',
        firstName: 'Marcus',
        lastName: 'Johnson',
        name: 'Marcus Johnson',
        email: 'marcus.johnson@email-demo.com',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/in/marcusjohnson-demo',
        githubUrl: 'https://github.com/marcusjohnson-demo',
        currentJobTitle: 'DevOps Engineer',
        currentCompany: 'CloudSystems',
        totalYearsExperience: 6,
        experienceLevel: ExperienceLevel.SENIOR,
        expectedSalary: 150000,
        noticePeriod: 30,
        willingToRelocate: true,
        appliedPositions: ['demo-pos-3'],
        resumeUrl: '/demo/resumes/marcus-johnson.pdf',
        source: 'JOB_BOARD',
        skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Jenkins', 'Ansible'],
        certifications: ['AWS Solutions Architect Professional', 'Kubernetes CKA'],
        experience: [
          {
            company: 'CloudSystems',
            position: 'Senior DevOps Engineer',
            startDate: '2021-01-01',
            duration: '48',
            responsibilities: [
              'Managed AWS infrastructure for enterprise clients',
              'Built CI/CD pipelines using Jenkins and GitHub Actions',
              'Implemented infrastructure as code using Terraform',
            ],
            achievements: [
              'Reduced deployment time by 70%',
              'Achieved 99.99% uptime SLA',
              'Cut cloud costs by 40% through optimization',
            ],
          },
          {
            company: 'StartupCloud',
            position: 'DevOps Engineer',
            startDate: '2018-06-01',
            endDate: '2020-12-31',
            duration: '30',
            responsibilities: [
              'Set up Kubernetes clusters',
              'Automated deployment processes',
            ],
            achievements: [
              'Migrated infrastructure to cloud',
            ],
          },
        ],
        education: [
          {
            institution: 'University of Texas',
            degree: 'BS',
            field: 'Computer Engineering',
            graduationYear: 2017,
            gpa: 3.7,
          },
        ],
        status: CandidateStatus.OFFER,
        tags: ['Infrastructure-Expert', 'AWS-Certified'],
        notes: [],
        createdAt: '2024-01-24',
        updatedAt: '2024-01-30',
        uploadedBy: 'demo-user-3',
      },
      {
        id: 'demo-cand-4',
        firstName: 'Lisa',
        lastName: 'Wong',
        name: 'Lisa Wong',
        email: 'lisa.wong@email-demo.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA',
        linkedinUrl: 'https://linkedin.com/in/lisawong-demo',
        githubUrl: 'https://github.com/lisawong-demo',
        currentJobTitle: 'Software Engineer',
        currentCompany: 'DataTech Solutions',
        totalYearsExperience: 4,
        experienceLevel: ExperienceLevel.MID,
        expectedSalary: 135000,
        noticePeriod: 14,
        willingToRelocate: true,
        appliedPositions: ['demo-pos-1'],
        source: 'DIRECT',
        skills: ['React', 'Python', 'Django', 'PostgreSQL', 'AWS', 'Redis'],
        certifications: ['AWS Developer Associate'],
        experience: [
          {
            company: 'DataTech Solutions',
            position: 'Software Engineer',
            startDate: '2020-08-01',
            duration: '42',
            responsibilities: [
              'Developed data visualization dashboards',
              'Built RESTful APIs using Django',
              'Optimized database queries',
            ],
            achievements: [
              'Improved query performance by 50%',
              'Launched analytics platform used by 500+ customers',
            ],
          },
        ],
        education: [
          {
            institution: 'University of Washington',
            degree: 'BS',
            field: 'Computer Science',
            graduationYear: 2020,
            gpa: 3.9,
          },
        ],
        status: CandidateStatus.NEW,
        tags: ['Quick-Learner'],
        notes: [],
        createdAt: '2024-01-30',
        updatedAt: '2024-01-30',
        uploadedBy: 'demo-user-3',
      },
      {
        id: 'demo-cand-5',
        firstName: 'James',
        lastName: 'Miller',
        name: 'James Miller',
        email: 'james.miller@email-demo.com',
        phone: '+1 (555) 567-8901',
        location: 'Boston, MA',
        linkedinUrl: 'https://linkedin.com/in/jamesmiller-demo',
        currentJobTitle: 'Junior Developer',
        currentCompany: 'WebSolutions',
        totalYearsExperience: 2,
        experienceLevel: ExperienceLevel.JUNIOR,
        expectedSalary: 85000,
        noticePeriod: 14,
        willingToRelocate: true,
        appliedPositions: ['demo-pos-1'],
        source: 'JOB_BOARD',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
        certifications: [],
        experience: [
          {
            company: 'WebSolutions',
            position: 'Junior Developer',
            startDate: '2022-06-01',
            duration: '20',
            responsibilities: [
              'Built responsive web interfaces',
              'Fixed bugs and implemented features',
            ],
            achievements: [
              'Completed bootcamp graduation project',
            ],
          },
        ],
        education: [
          {
            institution: 'General Assembly',
            degree: 'Certificate',
            field: 'Software Engineering Bootcamp',
            graduationYear: 2022,
          },
        ],
        status: CandidateStatus.REJECTED,
        tags: ['Entry-Level'],
        notes: [],
        createdAt: '2024-01-22',
        updatedAt: '2024-01-27',
        uploadedBy: 'demo-user-3',
      },
    ];
  }

  // ============================================
  // DEMO ANALYSES
  // ============================================

  static getDemoAnalyses(): CandidateAnalysis[] {
    return [
      {
        id: 'demo-analysis-1',
        candidateId: 'demo-cand-1',
        positionId: 'demo-pos-1',
        analyzedAt: '2024-01-28',
        analyzedBy: 'demo-user-2',
        overallScore: 89,
        overallFit: 'EXCELLENT',
        scores: {
          technicalSkills: 92,
          experience: 88,
          education: 85,
          culturalFit: 87,
          communication: 90,
          leadership: 86,
          careerProgression: 91,
          salaryAlignment: 95,
          availability: 88,
          locationFit: 100,
        },
        strengths: [
          'Excellent technical skills matching all requirements',
          'Strong leadership and mentoring experience',
          'Proven track record of delivering scalable solutions',
          'Great cultural fit based on work style analysis',
        ],
        weaknesses: [
          'Salary expectation at upper range',
          'Notice period of 30 days may delay start date',
        ],
        recommendations: [
          'Fast-track to final interview',
          'Prepare competitive offer package',
          'Highlight growth opportunities and technical challenges',
        ],
        detailedAnalysis: 'Alex is an exceptional candidate with 7 years of full-stack experience...',
        redFlags: [],
        nextSteps: [
          'Schedule technical interview',
          'Conduct reference checks',
          'Prepare offer letter',
        ],
      },
      {
        id: 'demo-analysis-2',
        candidateId: 'demo-cand-2',
        positionId: 'demo-pos-2',
        analyzedAt: '2024-01-29',
        analyzedBy: 'demo-user-2',
        overallScore: 85,
        overallFit: 'EXCELLENT',
        scores: {
          technicalSkills: 88,
          experience: 82,
          education: 90,
          culturalFit: 85,
          communication: 87,
          leadership: 80,
          careerProgression: 83,
          salaryAlignment: 92,
          availability: 95,
          locationFit: 100,
        },
        strengths: [
          'Strong design portfolio with proven results',
          'Experience with design systems',
          'User research expertise',
          'Excellent cultural fit',
        ],
        weaknesses: [
          'Limited B2B SaaS experience',
        ],
        recommendations: [
          'Proceed to design challenge',
          'Showcase our design process and tools',
          'Move quickly - strong candidate',
        ],
        detailedAnalysis: 'Priya demonstrates exceptional design skills...',
        redFlags: [],
        nextSteps: [
          'Send design challenge',
          'Schedule portfolio review',
        ],
      },
      {
        id: 'demo-analysis-3',
        candidateId: 'demo-cand-3',
        positionId: 'demo-pos-3',
        analyzedAt: '2024-01-30',
        analyzedBy: 'demo-user-2',
        overallScore: 91,
        overallFit: 'EXCELLENT',
        scores: {
          technicalSkills: 94,
          experience: 90,
          education: 85,
          culturalFit: 89,
          communication: 88,
          leadership: 91,
          careerProgression: 92,
          salaryAlignment: 93,
          availability: 90,
          locationFit: 95,
        },
        strengths: [
          'AWS and Kubernetes expert with certifications',
          'Proven cost optimization achievements',
          'Strong infrastructure automation experience',
          'Excellent track record of reliability',
        ],
        weaknesses: [],
        recommendations: [
          'Make offer immediately',
          'Highlight technical challenges and scale',
          'Competitive compensation given expertise',
        ],
        detailedAnalysis: 'Marcus is a top-tier DevOps engineer...',
        redFlags: [],
        nextSteps: [
          'Extend offer',
          'Highlight growth opportunities',
        ],
      },
    ];
  }

  // ============================================
  // DEMO TOP PERFORMERS
  // ============================================

  static getDemoTopPerformers(): TopPerformerProfile[] {
    return [
      {
        id: 'demo-top-1',
        employeeId: 'emp-001',
        name: 'Rachel Green',
        role: 'Staff Engineer',
        department: 'Engineering',
        performanceScore: 95,
        tenure: 48,
        promotions: 3,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Design', 'Kubernetes'],
        education: {
          institution: 'MIT',
          degree: 'MS',
          field: 'Computer Science',
          graduationYear: 2016,
        },
        careerPath: [
          {
            company: 'Current Company',
            position: 'Staff Engineer',
            startDate: '2022-01-01',
            duration: 24,
            achievements: ['Led architecture of core platform', 'Mentored 10+ engineers'],
          },
          {
            company: 'Current Company',
            position: 'Senior Engineer',
            startDate: '2020-01-01',
            endDate: '2021-12-31',
            duration: 24,
            achievements: ['Built microservices architecture'],
          },
        ],
        personality: {
          workStyle: ['Collaborative', 'Detail-oriented', 'Innovative'],
          communication: 'Excellent',
          leadership: 'Mentoring',
          collaboration: 'Highly collaborative',
        },
        achievements: [
          'Reduced infrastructure costs by $2M annually',
          'Led migration to microservices',
          'Published 3 technical blog posts',
        ],
        projectSuccess: 96,
        culturalAlignment: 98,
        addedBy: 'demo-user-1',
        addedAt: '2024-01-15',
      },
    ];
  }

  // ============================================
  // HELPER METHOD
  // ============================================

  /**
   * Check if demo mode is enabled
   */
  static isDemoMode(): boolean {
    return localStorage.getItem('neofox_demo_mode') === 'true';
  }

  /**
   * Enable demo mode
   */
  static enableDemoMode(): void {
    localStorage.setItem('neofox_demo_mode', 'true');
  }

  /**
   * Disable demo mode
   */
  static disableDemoMode(): void {
    localStorage.removeItem('neofox_demo_mode');
  }
}
