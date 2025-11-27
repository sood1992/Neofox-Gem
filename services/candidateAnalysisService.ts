// Candidate Analysis Service - AI-powered resume parsing and analysis

import { GoogleGenAI, Type } from "@google/genai";
import {
  Candidate,
  JobPosition,
  ParsedResumeData,
  CandidateAnalysis,
  WorkExperience,
  Education,
  ExtractedSkill,
  SkillMatch,
  MissingSkill,
  RedFlagAnalysis,
  StrengthAnalysis,
  GapAnalysis,
  InterviewQuestion,
  RedFlagType,
  StrengthType,
  ExperienceLevel,
  FitBreakdown,
  RequirementMatch
} from '../hrTypes';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to generate unique IDs
const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const CandidateAnalysisService = {
  /**
   * Parse resume text and extract structured data
   */
  parseResume: async (resumeText: string): Promise<ParsedResumeData | null> => {
    if (!process.env.API_KEY) {
      console.warn('API key not configured, using mock parser');
      return CandidateAnalysisService.mockParseResume(resumeText);
    }

    try {
      const prompt = `You are an expert resume parser. Analyze the following resume and extract all relevant information into a structured format.

RESUME TEXT:
${resumeText}

Extract and return a JSON object with this structure:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "location": "City, State/Country",
  "linkedin": "LinkedIn URL if present",
  "github": "GitHub URL if present",
  "portfolio": "Portfolio URL if present",
  "summary": "Professional summary or objective",
  "workExperience": [
    {
      "company": "Company name",
      "title": "Job title",
      "location": "City, State",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or null if current",
      "isCurrent": boolean,
      "description": "Role description",
      "achievements": ["Achievement 1", "Achievement 2"],
      "skills": ["Skill used in this role"]
    }
  ],
  "education": [
    {
      "institution": "School name",
      "degree": "Degree type (BS, MS, etc)",
      "field": "Field of study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": number or null,
      "honors": ["Honor 1"]
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "TECHNICAL|SOFT|TOOL|LANGUAGE|FRAMEWORK|OTHER",
      "proficiencyLevel": "BASIC|INTERMEDIATE|ADVANCED|EXPERT",
      "yearsOfExperience": number or null
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "issueDate": "YYYY-MM",
      "expirationDate": "YYYY-MM or null"
    }
  ],
  "languages": [
    {
      "language": "Language name",
      "proficiency": "BASIC|CONVERSATIONAL|PROFESSIONAL|FLUENT|NATIVE"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "technologies": ["Tech 1", "Tech 2"],
      "url": "Project URL if available"
    }
  ],
  "awards": ["Award 1", "Award 2"]
}

Be thorough and extract ALL information. If something is not present, use null or empty array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) return null;

      const parsed = JSON.parse(jsonStr);

      // Add IDs and format dates
      const result: ParsedResumeData = {
        extractedAt: new Date().toISOString(),
        confidence: 0.85,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        location: parsed.location,
        linkedin: parsed.linkedin,
        github: parsed.github,
        portfolio: parsed.portfolio,
        summary: parsed.summary,
        workExperience: (parsed.workExperience || []).map((exp: any) => ({
          id: generateId(),
          company: exp.company,
          title: exp.title,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent || !exp.endDate,
          description: exp.description,
          achievements: exp.achievements || [],
          skills: exp.skills || [],
          employmentType: 'FULL_TIME'
        })),
        education: (parsed.education || []).map((edu: any) => ({
          id: generateId(),
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          startDate: edu.startDate,
          endDate: edu.endDate,
          gpa: edu.gpa,
          honors: edu.honors || []
        })),
        skills: parsed.skills || [],
        certifications: parsed.certifications || [],
        languages: parsed.languages || [],
        projects: parsed.projects || [],
        awards: parsed.awards || []
      };

      return result;
    } catch (error) {
      console.error("Resume parsing error:", error);
      return CandidateAnalysisService.mockParseResume(resumeText);
    }
  },

  /**
   * Mock resume parser for when API is not available
   */
  mockParseResume: (resumeText: string): ParsedResumeData => {
    // Extract basic info using regex patterns
    const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = resumeText.match(/linkedin\.com\/in\/[\w-]+/);
    const githubMatch = resumeText.match(/github\.com\/[\w-]+/);

    // Common tech skills to look for
    const techSkills = ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CSS', 'HTML', 'Tailwind', 'Next.js', 'GraphQL', 'REST API'];

    const foundSkills: ExtractedSkill[] = techSkills
      .filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()))
      .map(skill => ({
        name: skill,
        category: 'TECHNICAL' as const,
        proficiencyLevel: 'INTERMEDIATE' as const
      }));

    return {
      extractedAt: new Date().toISOString(),
      confidence: 0.6,
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
      linkedin: linkedinMatch?.[0] ? `https://${linkedinMatch[0]}` : undefined,
      github: githubMatch?.[0] ? `https://${githubMatch[0]}` : undefined,
      workExperience: [],
      education: [],
      skills: foundSkills,
      certifications: [],
      languages: [],
      projects: []
    };
  },

  /**
   * Analyze candidate against job position requirements
   */
  analyzeCandidate: async (candidate: Candidate, position: JobPosition): Promise<CandidateAnalysis | null> => {
    if (!process.env.API_KEY) {
      console.warn('API key not configured, using basic analysis');
      return CandidateAnalysisService.basicAnalysis(candidate, position);
    }

    try {
      const candidateProfile = JSON.stringify({
        name: `${candidate.firstName} ${candidate.lastName}`,
        currentRole: candidate.currentTitle,
        company: candidate.currentCompany,
        experience: candidate.totalYearsExperience,
        location: candidate.location,
        salaryExpectation: candidate.salaryExpectation,
        parsedData: candidate.parsedData
      }, null, 2);

      const jobRequirements = JSON.stringify({
        title: position.title,
        department: position.department,
        description: position.description,
        requiredSkills: position.requiredSkills,
        preferredSkills: position.preferredSkills,
        experienceLevel: position.experienceLevel,
        responsibilities: position.responsibilities,
        qualifications: position.qualifications,
        salaryRange: { min: position.salaryMin, max: position.salaryMax },
        culturalValues: position.culturalValues,
        remotePolicy: position.remotePolicy,
        location: position.location
      }, null, 2);

      const prompt = `You are an expert HR analyst and talent acquisition specialist. Perform a comprehensive analysis of this candidate for the given job position.

CANDIDATE PROFILE:
${candidateProfile}

JOB REQUIREMENTS:
${jobRequirements}

Provide a detailed analysis in JSON format with these sections:

{
  "overallFitScore": 0-100,
  "fitBreakdown": {
    "technicalFit": 0-100,
    "experienceFit": 0-100,
    "culturalFit": 0-100,
    "salaryFit": 0-100,
    "availabilityFit": 0-100,
    "locationFit": 0-100
  },
  "skillsAnalysis": {
    "matchedSkills": [
      {"skill": "name", "candidateLevel": "level", "requiredLevel": "level", "matchPercentage": 0-100, "evidence": ["evidence"]}
    ],
    "missingSkills": [
      {"skill": "name", "required": boolean, "importance": "CRITICAL|HIGH|MEDIUM|LOW", "canBeLearned": boolean, "learningTimeEstimate": "timeframe"}
    ],
    "additionalSkills": ["skills not in requirements but valuable"],
    "skillGapScore": 0-100,
    "skillStrengthScore": 0-100,
    "recommendations": ["recommendations"]
  },
  "experienceAnalysis": {
    "totalYears": number,
    "relevantYears": number,
    "seniorityLevel": "INTERN|ENTRY|JUNIOR|MID|SENIOR|LEAD|MANAGER|DIRECTOR|VP|C_LEVEL",
    "expectedLevel": "same enum",
    "levelMatch": "UNDER|MATCH|OVER",
    "industryExperience": [{"industry": "name", "years": number, "relevance": "HIGH|MEDIUM|LOW"}],
    "roleProgression": {
      "hasProgression": boolean,
      "progressionRate": "SLOW|AVERAGE|FAST",
      "promotions": number,
      "careerPath": "description"
    },
    "notableCompanies": ["company names"],
    "projectHighlights": [{"project": "name", "impact": "description", "relevance": 0-100, "skills": ["skills"]}]
  },
  "culturalFitAnalysis": {
    "overallScore": 0-100,
    "indicators": [{"indicator": "name", "evidence": "evidence", "score": 0-100, "source": "source"}],
    "workStyleMatch": {
      "remote": 0-100,
      "collaborative": 0-100,
      "autonomous": 0-100,
      "structured": 0-100,
      "fastPaced": 0-100
    },
    "valuesAlignment": [{"value": "value", "alignment": 0-100, "evidence": "evidence"}],
    "teamFitPrediction": "prediction text",
    "potentialChallenges": ["challenge"]
  },
  "gapAnalysis": [
    {"startDate": "YYYY-MM", "endDate": "YYYY-MM", "durationMonths": number, "severity": "LOW|MEDIUM|HIGH", "isExplained": boolean, "potentialReasons": ["reason"]}
  ],
  "redFlagAnalysis": [
    {"type": "EMPLOYMENT_GAP|FREQUENT_JOB_CHANGES|SKILL_MISMATCH|EXPERIENCE_INFLATION|INCONSISTENT_DATES|NO_PROGRESSION|VAGUE_DESCRIPTIONS|MISSING_EDUCATION|SALARY_MISMATCH|OVERQUALIFIED|UNDERQUALIFIED", "severity": "LOW|MEDIUM|HIGH|CRITICAL", "description": "description", "evidence": ["evidence"], "recommendation": "recommendation", "canBeAddressed": boolean}
  ],
  "strengthAnalysis": [
    {"type": "RELEVANT_EXPERIENCE|SKILL_MATCH|CAREER_PROGRESSION|PRESTIGIOUS_COMPANIES|STRONG_EDUCATION|CERTIFICATIONS|LEADERSHIP_EXPERIENCE|PROJECT_IMPACT|CULTURAL_FIT|SALARY_ALIGNMENT|LOCATION_MATCH|AVAILABILITY", "strength": "MODERATE|STRONG|EXCEPTIONAL", "description": "description", "evidence": ["evidence"], "relevanceToRole": 0-100}
  ],
  "salaryAnalysis": {
    "expectedSalary": number or null,
    "marketRate": {"min": number, "mid": number, "max": number},
    "budgetRange": {"min": number, "max": number},
    "alignment": "BELOW|WITHIN|ABOVE|FAR_ABOVE",
    "recommendation": "recommendation"
  },
  "careerTrajectory": {
    "pattern": "ASCENDING|STABLE|MIXED|DESCENDING",
    "avgTenure": number,
    "longestTenure": number,
    "shortestTenure": number,
    "jobChanges": number,
    "industryChanges": number,
    "roleChanges": number,
    "prediction": "prediction",
    "stability": "LOW|MEDIUM|HIGH"
  },
  "interviewQuestions": [
    {"question": "question", "purpose": "purpose", "category": "TECHNICAL|BEHAVIORAL|SITUATIONAL|CULTURAL|CLARIFICATION", "priority": "HIGH|MEDIUM|LOW", "relatedTo": "what this relates to"}
  ],
  "requirementMatchMatrix": [
    {"requirement": "requirement text", "type": "REQUIRED|PREFERRED", "matched": boolean, "matchLevel": 0-100, "evidence": ["evidence"], "notes": "notes"}
  ],
  "narrativeSummary": "A 2-3 paragraph executive summary of the candidate",
  "whyGoodFit": ["reason 1", "reason 2", "reason 3"],
  "whyNotGoodFit": ["concern 1", "concern 2"],
  "riskLevel": "LOW|MEDIUM|HIGH",
  "riskFactors": ["risk 1", "risk 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Be thorough, objective, and provide actionable insights. Consider both explicit information and implicit signals.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) return null;

      const analysis = JSON.parse(jsonStr);

      return {
        analyzedAt: new Date().toISOString(),
        version: '1.0',
        overallFitScore: analysis.overallFitScore,
        fitBreakdown: analysis.fitBreakdown,
        skillsAnalysis: analysis.skillsAnalysis,
        experienceAnalysis: analysis.experienceAnalysis,
        culturalFitAnalysis: analysis.culturalFitAnalysis,
        gapAnalysis: analysis.gapAnalysis || [],
        redFlagAnalysis: analysis.redFlagAnalysis || [],
        strengthAnalysis: analysis.strengthAnalysis || [],
        salaryAnalysis: analysis.salaryAnalysis,
        careerTrajectory: analysis.careerTrajectory,
        interviewQuestions: analysis.interviewQuestions || [],
        requirementMatchMatrix: analysis.requirementMatchMatrix || [],
        narrativeSummary: analysis.narrativeSummary,
        whyGoodFit: analysis.whyGoodFit || [],
        whyNotGoodFit: analysis.whyNotGoodFit || [],
        riskLevel: analysis.riskLevel,
        riskFactors: analysis.riskFactors || [],
        recommendations: analysis.recommendations || []
      } as CandidateAnalysis;

    } catch (error) {
      console.error("Analysis error:", error);
      return CandidateAnalysisService.basicAnalysis(candidate, position);
    }
  },

  /**
   * Basic analysis without AI
   */
  basicAnalysis: (candidate: Candidate, position: JobPosition): CandidateAnalysis => {
    // Calculate skill match
    const candidateSkills = new Set(
      candidate.parsedData?.skills?.map(s => s.name.toLowerCase()) || []
    );

    const requiredSkills = position.requiredSkills || [];
    const matchedSkills: SkillMatch[] = [];
    const missingSkills: MissingSkill[] = [];

    requiredSkills.forEach(req => {
      const skillLower = req.skill.toLowerCase();
      if (candidateSkills.has(skillLower)) {
        matchedSkills.push({
          skill: req.skill,
          required: req.isRequired,
          candidateLevel: 'INTERMEDIATE',
          requiredLevel: req.level,
          matchPercentage: 75,
          evidence: ['Found in resume']
        });
      } else {
        missingSkills.push({
          skill: req.skill,
          required: req.isRequired,
          importance: req.isRequired ? 'HIGH' : 'MEDIUM',
          canBeLearned: true,
          learningTimeEstimate: '1-3 months'
        });
      }
    });

    const skillMatchScore = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 50;

    // Experience analysis
    const experienceMatch = candidate.totalYearsExperience >= 5 ? 'MATCH' : 'UNDER';

    // Salary analysis
    const salaryAlignment = !candidate.salaryExpectation ? 'WITHIN' :
      candidate.salaryExpectation > position.salaryMax ? 'ABOVE' :
        candidate.salaryExpectation < position.salaryMin ? 'BELOW' : 'WITHIN';

    // Calculate overall score
    const overallScore = Math.round(
      (skillMatchScore * 0.4) +
      (candidate.experienceScore * 0.3) +
      (candidate.culturalFitScore * 0.3)
    );

    return {
      analyzedAt: new Date().toISOString(),
      version: '1.0-basic',
      overallFitScore: overallScore,
      fitBreakdown: {
        technicalFit: skillMatchScore,
        experienceFit: candidate.experienceScore,
        culturalFit: candidate.culturalFitScore,
        salaryFit: salaryAlignment === 'WITHIN' ? 90 : salaryAlignment === 'ABOVE' ? 50 : 70,
        availabilityFit: 80,
        locationFit: 75
      },
      skillsAnalysis: {
        matchedSkills,
        missingSkills,
        additionalSkills: [],
        skillGapScore: 100 - skillMatchScore,
        skillStrengthScore: skillMatchScore,
        recommendations: missingSkills.length > 0
          ? ['Consider training programs for missing skills']
          : ['Strong skill match with role requirements']
      },
      experienceAnalysis: {
        totalYears: candidate.totalYearsExperience,
        relevantYears: Math.floor(candidate.totalYearsExperience * 0.8),
        seniorityLevel: candidate.experienceLevel,
        expectedLevel: position.experienceLevel,
        levelMatch: experienceMatch as 'UNDER' | 'MATCH' | 'OVER',
        industryExperience: [],
        roleProgression: {
          hasProgression: true,
          progressionRate: 'AVERAGE',
          promotions: 2,
          lateralMoves: 1,
          careerPath: 'Standard progression'
        },
        notableCompanies: candidate.currentCompany ? [candidate.currentCompany] : [],
        projectHighlights: []
      },
      culturalFitAnalysis: {
        overallScore: candidate.culturalFitScore,
        indicators: [],
        workStyleMatch: {
          remote: 75,
          collaborative: 80,
          autonomous: 70,
          structured: 65,
          fastPaced: 75
        },
        valuesAlignment: position.culturalValues?.map(v => ({
          value: v,
          alignment: 70,
          evidence: 'Inferred from profile'
        })) || [],
        teamFitPrediction: 'Likely to integrate well with team',
        potentialChallenges: []
      },
      gapAnalysis: [],
      redFlagAnalysis: candidate.redFlags?.map(rf => ({
        type: rf.type,
        severity: rf.severity,
        description: rf.description,
        evidence: rf.evidence,
        recommendation: 'Discuss during interview',
        canBeAddressed: true
      })) || [],
      strengthAnalysis: candidate.strengths?.map(s => ({
        type: s.type,
        strength: s.strength,
        description: s.description,
        evidence: s.evidence,
        relevanceToRole: 80
      })) || [],
      salaryAnalysis: {
        expectedSalary: candidate.salaryExpectation,
        marketRate: {
          min: position.salaryMin * 0.9,
          mid: (position.salaryMin + position.salaryMax) / 2,
          max: position.salaryMax * 1.1
        },
        budgetRange: {
          min: position.salaryMin,
          max: position.salaryMax
        },
        alignment: salaryAlignment as 'BELOW' | 'WITHIN' | 'ABOVE' | 'FAR_ABOVE',
        recommendation: salaryAlignment === 'WITHIN'
          ? 'Salary expectations align with budget'
          : 'May require negotiation'
      },
      careerTrajectory: {
        pattern: 'ASCENDING',
        avgTenure: 2.5,
        longestTenure: 4,
        shortestTenure: 1,
        jobChanges: 3,
        industryChanges: 1,
        roleChanges: 2,
        prediction: 'Steady career growth expected',
        stability: 'MEDIUM'
      },
      interviewQuestions: [
        {
          question: 'Tell me about a challenging project you worked on recently.',
          purpose: 'Assess problem-solving and technical depth',
          category: 'BEHAVIORAL',
          priority: 'HIGH'
        },
        {
          question: 'How do you stay updated with new technologies?',
          purpose: 'Evaluate continuous learning mindset',
          category: 'BEHAVIORAL',
          priority: 'MEDIUM'
        }
      ],
      requirementMatchMatrix: requiredSkills.map(req => ({
        requirement: req.skill,
        type: req.isRequired ? 'REQUIRED' as const : 'PREFERRED' as const,
        matched: candidateSkills.has(req.skill.toLowerCase()),
        matchLevel: candidateSkills.has(req.skill.toLowerCase()) ? 80 : 0,
        evidence: candidateSkills.has(req.skill.toLowerCase()) ? ['Found in resume'] : [],
        notes: ''
      })),
      narrativeSummary: `${candidate.firstName} ${candidate.lastName} is a ${candidate.experienceLevel.toLowerCase()} professional with ${candidate.totalYearsExperience} years of experience. Currently working as ${candidate.currentTitle}${candidate.currentCompany ? ` at ${candidate.currentCompany}` : ''}, they bring a solid foundation of skills relevant to the ${position.title} role.`,
      whyGoodFit: [
        matchedSkills.length > 0 ? `Matches ${matchedSkills.length} required skills` : '',
        candidate.totalYearsExperience >= 5 ? 'Adequate years of experience' : '',
        candidate.strengths && candidate.strengths.length > 0 ? 'Has notable strengths' : ''
      ].filter(Boolean),
      whyNotGoodFit: [
        missingSkills.length > 0 ? `Missing ${missingSkills.length} required skills` : '',
        salaryAlignment === 'ABOVE' ? 'Salary expectations above budget' : ''
      ].filter(Boolean),
      riskLevel: candidate.redFlags && candidate.redFlags.length > 2 ? 'HIGH' :
        candidate.redFlags && candidate.redFlags.length > 0 ? 'MEDIUM' : 'LOW',
      riskFactors: candidate.redFlags?.map(rf => rf.title) || [],
      recommendations: [
        'Proceed with initial screening call',
        'Verify technical skills through assessment'
      ]
    };
  },

  /**
   * Compare multiple candidates
   */
  compareCandidates: async (candidates: Candidate[], position: JobPosition): Promise<string> => {
    if (!process.env.API_KEY) {
      return CandidateAnalysisService.basicComparison(candidates);
    }

    try {
      const candidatesSummary = candidates.map(c => ({
        name: `${c.firstName} ${c.lastName}`,
        score: c.overallScore,
        experience: c.totalYearsExperience,
        currentRole: c.currentTitle,
        company: c.currentCompany,
        strengths: c.strengths?.map(s => s.title) || [],
        redFlags: c.redFlags?.map(r => r.title) || [],
        skills: c.parsedData?.skills?.map(s => s.name) || [],
        salary: c.salaryExpectation
      }));

      const prompt = `Compare these candidates for the ${position.title} role and provide a detailed comparison summary:

CANDIDATES:
${JSON.stringify(candidatesSummary, null, 2)}

JOB REQUIREMENTS:
- Experience Level: ${position.experienceLevel}
- Required Skills: ${position.requiredSkills?.map(s => s.skill).join(', ')}
- Salary Range: ${position.salaryMin}-${position.salaryMax} ${position.currency}

Provide a comparison that:
1. Ranks the candidates from best to worst fit
2. Highlights key differentiators
3. Notes trade-offs between candidates
4. Provides a clear recommendation

Format as a professional summary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text || CandidateAnalysisService.basicComparison(candidates);
    } catch (error) {
      console.error("Comparison error:", error);
      return CandidateAnalysisService.basicComparison(candidates);
    }
  },

  basicComparison: (candidates: Candidate[]): string => {
    const sorted = [...candidates].sort((a, b) => b.overallScore - a.overallScore);

    let summary = 'Candidate Comparison Summary\n\n';
    summary += 'Ranking (by overall score):\n';

    sorted.forEach((c, index) => {
      summary += `${index + 1}. ${c.firstName} ${c.lastName} - Score: ${c.overallScore}/100\n`;
      summary += `   Experience: ${c.totalYearsExperience} years | ${c.currentTitle}\n`;
      if (c.strengths && c.strengths.length > 0) {
        summary += `   Strengths: ${c.strengths.slice(0, 2).map(s => s.title).join(', ')}\n`;
      }
      if (c.redFlags && c.redFlags.length > 0) {
        summary += `   Concerns: ${c.redFlags.slice(0, 2).map(r => r.title).join(', ')}\n`;
      }
      summary += '\n';
    });

    return summary;
  },

  /**
   * Generate interview questions tailored to candidate
   */
  generateInterviewQuestions: async (candidate: Candidate, position: JobPosition, count: number = 10): Promise<InterviewQuestion[]> => {
    if (!process.env.API_KEY) {
      return CandidateAnalysisService.defaultInterviewQuestions(candidate);
    }

    try {
      const prompt = `Generate ${count} targeted interview questions for this candidate applying for ${position.title}.

CANDIDATE:
- Name: ${candidate.firstName} ${candidate.lastName}
- Current Role: ${candidate.currentTitle} at ${candidate.currentCompany}
- Experience: ${candidate.totalYearsExperience} years
- Red Flags: ${candidate.redFlags?.map(r => r.title).join(', ') || 'None identified'}
- Key Skills: ${candidate.parsedData?.skills?.slice(0, 10).map(s => s.name).join(', ') || 'Not parsed'}

ROLE REQUIREMENTS:
- Required Skills: ${position.requiredSkills?.map(s => s.skill).join(', ')}
- Responsibilities: ${position.responsibilities?.slice(0, 3).join('; ')}

Generate questions that:
1. Address any red flags or concerns
2. Verify claimed skills and experience
3. Assess cultural fit
4. Evaluate problem-solving abilities
5. Uncover motivation and career goals

Return as JSON array:
[
  {
    "question": "The interview question",
    "purpose": "Why this question matters",
    "category": "TECHNICAL|BEHAVIORAL|SITUATIONAL|CULTURAL|CLARIFICATION",
    "priority": "HIGH|MEDIUM|LOW",
    "relatedTo": "What gap, red flag, or skill this addresses"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) return CandidateAnalysisService.defaultInterviewQuestions(candidate);

      return JSON.parse(jsonStr) as InterviewQuestion[];
    } catch (error) {
      console.error("Question generation error:", error);
      return CandidateAnalysisService.defaultInterviewQuestions(candidate);
    }
  },

  defaultInterviewQuestions: (candidate: Candidate): InterviewQuestion[] => {
    const questions: InterviewQuestion[] = [
      {
        question: 'Walk me through your experience with the technologies listed on your resume.',
        purpose: 'Verify technical skills and depth of experience',
        category: 'TECHNICAL',
        priority: 'HIGH'
      },
      {
        question: 'Describe a challenging project you led and how you handled obstacles.',
        purpose: 'Assess leadership and problem-solving',
        category: 'BEHAVIORAL',
        priority: 'HIGH'
      },
      {
        question: 'How do you approach learning new technologies or frameworks?',
        purpose: 'Evaluate growth mindset and adaptability',
        category: 'BEHAVIORAL',
        priority: 'MEDIUM'
      },
      {
        question: 'Tell me about a time you disagreed with a colleague. How did you handle it?',
        purpose: 'Assess interpersonal skills and conflict resolution',
        category: 'SITUATIONAL',
        priority: 'MEDIUM'
      },
      {
        question: 'What interests you about this role and our company?',
        purpose: 'Gauge motivation and cultural alignment',
        category: 'CULTURAL',
        priority: 'HIGH'
      }
    ];

    // Add questions for red flags
    if (candidate.redFlags && candidate.redFlags.length > 0) {
      candidate.redFlags.forEach(rf => {
        if (rf.type === RedFlagType.EMPLOYMENT_GAP) {
          questions.push({
            question: 'I noticed a gap in your employment history. Could you walk me through that period?',
            purpose: 'Understand employment gap',
            category: 'CLARIFICATION',
            priority: 'HIGH',
            relatedTo: rf.title
          });
        }
        if (rf.type === RedFlagType.FREQUENT_JOB_CHANGES) {
          questions.push({
            question: 'What factors are you looking for in your next role to ensure a longer tenure?',
            purpose: 'Assess commitment and expectations',
            category: 'CLARIFICATION',
            priority: 'HIGH',
            relatedTo: rf.title
          });
        }
      });
    }

    return questions;
  },

  /**
   * Generate executive summary for a candidate
   */
  generateExecutiveSummary: async (candidate: Candidate, position: JobPosition): Promise<string> => {
    if (!process.env.API_KEY) {
      return `${candidate.firstName} ${candidate.lastName} is a ${candidate.experienceLevel.toLowerCase()} ${candidate.currentTitle} with ${candidate.totalYearsExperience} years of experience. They scored ${candidate.overallScore}/100 overall, with ${candidate.skillMatchScore}/100 in skill match. ${candidate.aiRecommendation ? `AI recommendation: ${candidate.aiRecommendation.replace('_', ' ').toLowerCase()}.` : ''}`;
    }

    try {
      const prompt = `Write a concise 2-paragraph executive summary for this candidate applying for ${position.title}:

CANDIDATE:
${JSON.stringify({
          name: `${candidate.firstName} ${candidate.lastName}`,
          currentRole: candidate.currentTitle,
          company: candidate.currentCompany,
          experience: candidate.totalYearsExperience,
          scores: {
            overall: candidate.overallScore,
            skills: candidate.skillMatchScore,
            experience: candidate.experienceScore,
            cultural: candidate.culturalFitScore
          },
          strengths: candidate.strengths?.map(s => s.title) || [],
          concerns: candidate.redFlags?.map(r => r.title) || []
        }, null, 2)}

The summary should:
1. Start with overall recommendation (hire/maybe/pass)
2. Highlight key qualifications and fit
3. Note any concerns
4. Be professional and actionable`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text || '';
    } catch (error) {
      console.error("Summary generation error:", error);
      return '';
    }
  }
};
