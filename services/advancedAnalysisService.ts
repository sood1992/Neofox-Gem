import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/config';
import {
  Candidate,
  JobPosition,
  TopPerformerProfile,
  TopPerformerMatch,
  CareerMomentum,
  CareerTimelineEvent,
  ReverseMatching,
  RoleMatchResult,
  FlightRiskAssessment,
  InterviewQuestionSet,
  TailoredInterviewQuestion,
  HiddenGemAnalysis,
  TransferableSkill,
  TeamChemistryPrediction,
  TeamComposition,
  ReferenceCheckGuide,
  ReferenceCheckQuestion,
  OfferAcceptancePrediction,
  CandidatePoolAssignment,
  TalentPoolCategory,
  AdvancedCandidateAnalysis,
} from '../types';

/**
 * Advanced Analysis Service
 * Powers all 10 advanced HR screening features with AI-driven insights
 */
export class AdvancedAnalysisService {
  private static anthropic: Anthropic | null = null;

  private static getClient(): Anthropic | null {
    if (!config.features.useRealAI || !config.anthropic.apiKey) {
      return null;
    }
    if (!this.anthropic) {
      this.anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });
    }
    return this.anthropic;
  }

  // ============================================
  // 1. CLONE TOP PERFORMERS ENGINE
  // ============================================

  static async analyzeTopPerformerMatch(
    candidate: Candidate,
    topPerformer: TopPerformerProfile
  ): Promise<TopPerformerMatch> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `Analyze the similarity between this candidate and a top performer in our company.

TOP PERFORMER PROFILE:
Name: ${topPerformer.name}
Role: ${topPerformer.role}
Performance Score: ${topPerformer.performanceScore}/100
Skills: ${topPerformer.skills.join(', ')}
Career Path: ${JSON.stringify(topPerformer.careerPath)}
Achievements: ${topPerformer.achievements.join('; ')}

CANDIDATE PROFILE:
Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience.map(exp => `${exp.position} at ${exp.company} (${exp.duration})`).join('; ')}
Education: ${candidate.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join('; ')}

Provide a detailed similarity analysis with scores (0-100) for:
1. Skill match
2. Career path similarity
3. Education match
4. Personality match (if available)
5. Experience alignment

Also identify specific strengths where the candidate matches the top performer, gaps where they differ, and provide a hiring recommendation.

Return JSON format with: skillMatch, careerPathSimilarity, educationMatch, personalityMatch, experienceAlignment, strengths (array), gaps (array), recommendation (string), confidence (0-100)`;

        const message = await client.messages.create({
          model: config.anthropic.model,
          max_tokens: config.anthropic.maxTokens,
          messages: [{ role: 'user', content: prompt }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
          const analysis = JSON.parse(content.text);
          const overallSimilarity = Math.round(
            (analysis.skillMatch +
              analysis.careerPathSimilarity +
              analysis.educationMatch +
              analysis.personalityMatch +
              analysis.experienceAlignment) /
              5
          );

          return {
            candidateId: candidate.id,
            topPerformerId: topPerformer.id,
            overallSimilarity,
            matchDetails: {
              skillMatch: analysis.skillMatch,
              careerPathSimilarity: analysis.careerPathSimilarity,
              educationMatch: analysis.educationMatch,
              personalityMatch: analysis.personalityMatch,
              experienceAlignment: analysis.experienceAlignment,
            },
            strengths: analysis.strengths,
            gaps: analysis.gaps,
            recommendation: analysis.recommendation,
            confidence: analysis.confidence,
          };
        }
      } catch (error) {
        console.error('Top performer match analysis failed:', error);
      }
    }

    // Fallback mock analysis
    return this.mockTopPerformerMatch(candidate, topPerformer);
  }

  private static mockTopPerformerMatch(
    candidate: Candidate,
    topPerformer: TopPerformerProfile
  ): TopPerformerMatch {
    const skillOverlap = candidate.skills.filter(s =>
      topPerformer.skills.some(ts => ts.toLowerCase().includes(s.toLowerCase()))
    ).length;
    const skillMatch = Math.min((skillOverlap / topPerformer.skills.length) * 100, 100);

    return {
      candidateId: candidate.id,
      topPerformerId: topPerformer.id,
      overallSimilarity: Math.round((skillMatch + 70 + 65 + 60 + 72) / 5),
      matchDetails: {
        skillMatch: Math.round(skillMatch),
        careerPathSimilarity: 70,
        educationMatch: 65,
        personalityMatch: 60,
        experienceAlignment: 72,
      },
      strengths: [
        `Strong technical alignment in ${candidate.skills.slice(0, 3).join(', ')}`,
        'Similar career progression pattern',
        'Comparable educational background',
      ],
      gaps: [
        'Less experience with enterprise-scale projects',
        'Could strengthen leadership experience',
      ],
      recommendation: `This candidate shows ${Math.round(skillMatch)}% skill alignment with our top performer. Strong potential for similar success.`,
      confidence: 78,
    };
  }

  // ============================================
  // 2. CAREER MOMENTUM MAPPING
  // ============================================

  static async analyzeCareerMomentum(candidate: Candidate): Promise<CareerMomentum> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `Analyze the career momentum and trajectory of this candidate.

CANDIDATE EXPERIENCE:
${candidate.experience.map(exp => `
  ${exp.position} at ${exp.company}
  Duration: ${exp.duration}
  Responsibilities: ${exp.responsibilities.join('; ')}
  Achievements: ${exp.achievements.join('; ')}
`).join('\n')}

SKILLS: ${candidate.skills.join(', ')}
CERTIFICATIONS: ${candidate.certifications.join(', ')}

Analyze:
1. Career trajectory (ACCELERATING, STEADY, PLATEAUED, DECLINING, TRANSITIONING)
2. Velocity score (0-100): rate of career advancement
3. Promotion rate, skill acquisition rate, responsibility growth
4. Company progression (startup to enterprise, etc.)
5. Projected path for next 2-3 years
6. Positive/negative momentum factors
7. Risk factors and opportunities

Return JSON with: trajectory, velocityScore, promotionRate, skillAcquisitionRate, responsibilityGrowth, companyProgression, salaryGrowth, projectedPath, positiveFactors (array), negativeFactors (array), neutralFactors (array), riskFactors (array), opportunities (array)`;

        const message = await client.messages.create({
          model: config.anthropic.model,
          max_tokens: config.anthropic.maxTokens,
          messages: [{ role: 'user', content: prompt }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
          const analysis = JSON.parse(content.text);

          return {
            candidateId: candidate.id,
            trajectory: analysis.trajectory,
            velocityScore: analysis.velocityScore,
            analysis: {
              promotionRate: analysis.promotionRate,
              skillAcquisitionRate: analysis.skillAcquisitionRate,
              responsibilityGrowth: analysis.responsibilityGrowth,
              companyProgression: analysis.companyProgression,
              salaryGrowth: analysis.salaryGrowth,
            },
            timelineEvents: this.extractTimelineEvents(candidate),
            projectedPath: analysis.projectedPath,
            momentumFactors: {
              positive: analysis.positiveFactors,
              negative: analysis.negativeFactors,
              neutral: analysis.neutralFactors,
            },
            riskFactors: analysis.riskFactors,
            opportunities: analysis.opportunities,
          };
        }
      } catch (error) {
        console.error('Career momentum analysis failed:', error);
      }
    }

    // Fallback mock analysis
    return this.mockCareerMomentum(candidate);
  }

  private static extractTimelineEvents(candidate: Candidate): CareerTimelineEvent[] {
    const events: CareerTimelineEvent[] = [];

    // Extract job changes
    candidate.experience.forEach((exp, index) => {
      events.push({
        date: exp.startDate || `${new Date().getFullYear() - index * 2}-01-01`,
        type: 'JOB_CHANGE',
        description: `Started as ${exp.position} at ${exp.company}`,
        impact: index === 0 ? 'HIGH' : 'MEDIUM',
      });

      // Extract achievements as events
      exp.achievements.slice(0, 1).forEach(achievement => {
        events.push({
          date: exp.startDate || `${new Date().getFullYear() - index * 2}-06-01`,
          type: 'ACHIEVEMENT',
          description: achievement,
          impact: 'MEDIUM',
        });
      });
    });

    // Extract certifications
    candidate.certifications.forEach((cert, index) => {
      events.push({
        date: `${new Date().getFullYear() - index}-01-01`,
        type: 'CERTIFICATION',
        description: cert,
        impact: 'MEDIUM',
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private static mockCareerMomentum(candidate: Candidate): CareerMomentum {
    const yearsOfExperience = candidate.experience.length * 2.5;
    const promotions = Math.floor(yearsOfExperience / 2);
    const velocityScore = Math.min(70 + candidate.certifications.length * 5, 95);

    return {
      candidateId: candidate.id,
      trajectory: velocityScore > 80 ? 'ACCELERATING' : velocityScore > 60 ? 'STEADY' : 'PLATEAUED',
      velocityScore,
      analysis: {
        promotionRate: promotions / yearsOfExperience,
        skillAcquisitionRate: candidate.skills.length / yearsOfExperience,
        responsibilityGrowth: 'Progressive increase in team size and project scope',
        companyProgression: 'Mid-size to enterprise companies',
        salaryGrowth: 12.5,
      },
      timelineEvents: this.extractTimelineEvents(candidate),
      projectedPath: `Likely to progress to senior ${candidate.experience[0]?.position || 'role'} within 18-24 months with current trajectory`,
      momentumFactors: {
        positive: [
          'Consistent skill acquisition',
          'Regular certifications',
          'Increasing responsibility',
        ],
        negative: [
          'Potential job hopping if tenure is short',
        ],
        neutral: [
          'Industry-standard progression rate',
        ],
      },
      riskFactors: ['May be approached by competitors', 'Seeking next career level'],
      opportunities: ['Leadership roles', 'Technical architecture positions'],
    };
  }

  // ============================================
  // 3. REVERSE ROLE MATCHING
  // ============================================

  static async analyzeReverseMatching(
    candidate: Candidate,
    allPositions: JobPosition[]
  ): Promise<ReverseMatching> {
    const roleMatches: RoleMatchResult[] = [];

    for (const position of allPositions) {
      const fitScore = this.calculateRoleFitScore(candidate, position);
      const match: RoleMatchResult = {
        positionId: position.id,
        positionTitle: position.title,
        department: position.department,
        fitScore,
        reasoning: this.generateFitReasoning(candidate, position, fitScore),
        strengths: this.identifyRoleStrengths(candidate, position),
        developmentAreas: this.identifyDevelopmentAreas(candidate, position),
        timeToProductivity: fitScore > 80 ? '2-4 weeks' : fitScore > 60 ? '1-2 months' : '2-3 months',
        confidenceLevel: Math.min(fitScore + 10, 95),
      };
      roleMatches.push(match);
    }

    // Sort by fit score
    roleMatches.sort((a, b) => b.fitScore - a.fitScore);

    const bestFitRoles = roleMatches.slice(0, 5);
    const surprisingMatches = roleMatches.filter(
      m => m.fitScore > 70 && !this.isObviousMatch(candidate, allPositions.find(p => p.id === m.positionId)!)
    ).slice(0, 3);

    return {
      candidateId: candidate.id,
      analyzedAt: new Date().toISOString(),
      bestFitRoles,
      surprisingMatches,
      skillGapAnalysis: this.analyzeSkillGaps(candidate, bestFitRoles.slice(0, 3), allPositions),
      recommendations: this.generateReverseMatchRecommendations(bestFitRoles, surprisingMatches),
    };
  }

  private static calculateRoleFitScore(candidate: Candidate, position: JobPosition): number {
    let score = 0;

    // Skills match (40%)
    const skillsMatch = candidate.skills.filter(s =>
      position.requiredSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase()))
    ).length;
    score += (skillsMatch / position.requiredSkills.length) * 40;

    // Experience level match (30%)
    const experienceYears = candidate.experience.reduce((sum, exp) => sum + parseInt(exp.duration), 0);
    if (experienceYears >= position.experienceRequired) {
      score += 30;
    } else {
      score += (experienceYears / position.experienceRequired) * 30;
    }

    // Education match (15%)
    const hasRequiredEducation = candidate.education.some(edu =>
      position.educationRequired.some(req => req.toLowerCase().includes(edu.degree.toLowerCase()))
    );
    score += hasRequiredEducation ? 15 : 5;

    // Location match (10%)
    score += candidate.location.toLowerCase() === position.location.toLowerCase() ? 10 : 5;

    // Salary alignment (5%)
    if (candidate.expectedSalary >= position.salaryRange.min && candidate.expectedSalary <= position.salaryRange.max) {
      score += 5;
    }

    return Math.min(Math.round(score), 100);
  }

  private static generateFitReasoning(candidate: Candidate, position: JobPosition, fitScore: number): string {
    if (fitScore > 80) {
      return `Excellent fit with strong alignment in skills, experience, and qualifications`;
    } else if (fitScore > 60) {
      return `Good fit with most requirements met, minor gaps can be addressed`;
    } else {
      return `Moderate fit, requires development in key areas`;
    }
  }

  private static identifyRoleStrengths(candidate: Candidate, position: JobPosition): string[] {
    const strengths: string[] = [];

    const matchingSkills = candidate.skills.filter(s =>
      position.requiredSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase()))
    );

    if (matchingSkills.length > 0) {
      strengths.push(`Strong technical skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }

    if (candidate.certifications.length > 0) {
      strengths.push(`Relevant certifications: ${candidate.certifications.slice(0, 2).join(', ')}`);
    }

    return strengths;
  }

  private static identifyDevelopmentAreas(candidate: Candidate, position: JobPosition): string[] {
    const missingSkills = position.requiredSkills.filter(rs =>
      !candidate.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()))
    );

    return missingSkills.slice(0, 3).map(skill => `Develop proficiency in ${skill}`);
  }

  private static isObviousMatch(candidate: Candidate, position: JobPosition): boolean {
    // A match is "obvious" if the candidate's most recent role is very similar
    const recentRole = candidate.experience[0]?.position.toLowerCase() || '';
    const positionTitle = position.title.toLowerCase();
    return recentRole.includes(positionTitle) || positionTitle.includes(recentRole);
  }

  private static analyzeSkillGaps(candidate: Candidate, topRoles: RoleMatchResult[], allPositions: JobPosition[]) {
    return topRoles.map(role => {
      const position = allPositions.find(p => p.id === role.positionId)!;
      const missingSkills = position.requiredSkills.filter(rs =>
        !candidate.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()))
      );

      return {
        roleId: role.positionId,
        roleName: role.positionTitle,
        requiredSkills: position.requiredSkills,
        candidateSkills: candidate.skills,
        missingSkills,
        trainableIn: missingSkills.length <= 2 ? '1-2 months' : '3-4 months',
      };
    });
  }

  private static generateReverseMatchRecommendations(
    bestFit: RoleMatchResult[],
    surprising: RoleMatchResult[]
  ): string[] {
    const recommendations: string[] = [];

    if (bestFit.length > 0) {
      recommendations.push(`Primary recommendation: ${bestFit[0].positionTitle} (${bestFit[0].fitScore}% match)`);
    }

    if (surprising.length > 0) {
      recommendations.push(
        `Consider unexpected fit: ${surprising[0].positionTitle} - candidate may bring unique value`
      );
    }

    return recommendations;
  }

  // ============================================
  // 4. FLIGHT RISK & COUNTER-OFFER PREDICTION
  // ============================================

  static analyzeFlightRisk(candidate: Candidate, position: JobPosition): FlightRiskAssessment {
    const currentTenure = candidate.experience[0] ? parseInt(candidate.experience[0].duration) : 0;
    const jobHopFrequency = candidate.experience.length > 1 ?
      candidate.experience.reduce((sum, exp) => sum + parseInt(exp.duration), 0) / candidate.experience.length : 24;

    // Calculate flight risk score
    let flightRiskScore = 0;

    if (currentTenure > 48) flightRiskScore += 30; // Long tenure increases risk
    if (jobHopFrequency < 18) flightRiskScore += 25; // Frequent job changes
    if (candidate.expectedSalary > position.salaryRange.max * 0.9) flightRiskScore += 20; // Near salary ceiling
    if (candidate.skills.length > 15) flightRiskScore += 15; // High-demand skills

    const riskFactors = {
      careerStagnation: currentTenure > 60,
      belowMarketCompensation: candidate.expectedSalary < position.salaryRange.min,
      longTenure: currentTenure > 48,
      recentPromotionMissed: false, // Can't determine from data
      industryTrends: true,
      skillsInDemand: candidate.skills.length > 10,
    };

    const counterOfferProbability = Math.min(flightRiskScore + 10, 85);

    return {
      candidateId: candidate.id,
      flightRiskScore: Math.round(flightRiskScore),
      counterOfferProbability,
      riskFactors,
      indicators: {
        jobSearchSignals: ['Resume recently updated', 'Active on professional networks'],
        satisfactionSignals: currentTenure > 36 ? ['Stable employment history'] : [],
        ambitionSignals: candidate.certifications.length > 0 ? ['Continuous learning', 'Professional development'] : [],
      },
      counterOfferLikelihood: {
        currentEmployerValue: 75,
        replaceabilityScore: candidate.skills.length > 15 ? 85 : 60,
        estimatedCounterOfferRange: {
          min: Math.round(candidate.expectedSalary * 1.1),
          max: Math.round(candidate.expectedSalary * 1.25),
          currency: position.salaryRange.currency,
        },
      },
      mitigationStrategies: [
        'Move quickly through hiring process',
        'Emphasize growth opportunities beyond compensation',
        'Highlight unique projects and learning opportunities',
        'Build strong relationship during interview process',
      ],
      bestApproachTiming: flightRiskScore > 60 ? 'Immediate - high urgency' : 'Within 2 weeks',
    };
  }

  // ============================================
  // 5. TAILORED INTERVIEW QUESTIONS
  // ============================================

  static async generateInterviewQuestions(
    candidate: Candidate,
    position: JobPosition
  ): Promise<InterviewQuestionSet> {
    const questions: TailoredInterviewQuestion[] = [];

    // Technical questions based on required skills
    position.requiredSkills.slice(0, 4).forEach((skill, index) => {
      const hasSkill = candidate.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()));

      questions.push({
        id: `tech-${index}`,
        category: 'TECHNICAL',
        question: `Can you walk me through a recent project where you used ${skill}? What challenges did you face and how did you overcome them?`,
        reasoning: hasSkill
          ? `Verify depth of ${skill} expertise claimed on resume`
          : `Assess ability to learn ${skill} quickly`,
        lookingFor: [
          'Specific technical details',
          'Problem-solving approach',
          'Learning and adaptation',
        ],
        redFlags: [
          'Vague or generic answers',
          'Unable to discuss technical details',
          'Blaming others for challenges',
        ],
        followUpQuestions: [
          'What would you do differently if you could redo that project?',
          `How do you stay current with ${skill} best practices?`,
        ],
        difficulty: hasSkill ? 'MEDIUM' : 'HARD',
        priority: 'CRITICAL',
        linkedToSkill: skill,
      });
    });

    // Behavioral questions based on experience
    questions.push({
      id: 'behavioral-1',
      category: 'BEHAVIORAL',
      question: `You mentioned working at ${candidate.experience[0]?.company}. Tell me about a time when you had to deal with a difficult team member or conflict.`,
      reasoning: 'Assess conflict resolution and teamwork skills',
      lookingFor: [
        'Emotional intelligence',
        'Communication skills',
        'Conflict resolution approach',
      ],
      redFlags: [
        'Blaming others entirely',
        'Avoiding responsibility',
        'Lack of self-awareness',
      ],
      followUpQuestions: [
        'What did you learn from that experience?',
        'How has that shaped your approach to teamwork?',
      ],
      difficulty: 'MEDIUM',
      priority: 'IMPORTANT',
      linkedToExperience: candidate.experience[0]?.company,
    });

    // Culture fit questions
    questions.push({
      id: 'culture-1',
      category: 'CULTURE_FIT',
      question: 'What type of work environment helps you do your best work?',
      reasoning: 'Assess cultural alignment with our company',
      lookingFor: [
        'Self-awareness',
        'Alignment with company culture',
        'Realistic expectations',
      ],
      redFlags: [
        'Rigid requirements',
        'Misalignment with company culture',
        'Lack of flexibility',
      ],
      followUpQuestions: [
        'What aspects of your current/previous workplace did you find most challenging?',
      ],
      difficulty: 'EASY',
      priority: 'IMPORTANT',
    });

    // Leadership questions if relevant
    if (candidate.experience.some(exp => exp.position.toLowerCase().includes('lead') || exp.position.toLowerCase().includes('senior'))) {
      questions.push({
        id: 'leadership-1',
        category: 'LEADERSHIP',
        question: 'Tell me about a time when you had to mentor or guide a junior team member. What was your approach?',
        reasoning: 'Assess leadership and mentorship capabilities',
        lookingFor: [
          'Coaching mindset',
          'Patience and communication',
          'Results-oriented approach',
        ],
        redFlags: [
          'Micromanagement tendencies',
          'Impatience with learning curves',
          'Taking credit for others\' work',
        ],
        followUpQuestions: [
          'How do you balance your own work with mentoring responsibilities?',
        ],
        difficulty: 'MEDIUM',
        priority: 'IMPORTANT',
      });
    }

    return {
      candidateId: candidate.id,
      positionId: position.id,
      generatedAt: new Date().toISOString(),
      questions,
      structure: {
        openingQuestions: [
          'Tell me about yourself and what drew you to this position.',
          'What do you know about our company?',
        ],
        coreQuestions: questions.map(q => q.question),
        closingQuestions: [
          'What questions do you have for us?',
          'What are your salary expectations?',
          'When would you be available to start?',
        ],
      },
      focusAreas: Array.from(new Set(questions.map(q => q.category))),
      estimatedDuration: 45 + questions.length * 5,
    };
  }

  // ============================================
  // 6. HIDDEN GEM DETECTION
  // ============================================

  static analyzeHiddenGem(candidate: Candidate, position: JobPosition): HiddenGemAnalysis {
    const transferableSkills: TransferableSkill[] = [];
    const nonTraditionalBackground: string[] = [];
    const uniquePerspectives: string[] = [];
    const undervaluedExperience: string[] = [];

    // Look for non-traditional backgrounds
    const hasNonTraditionalEducation = !candidate.education.some(edu =>
      ['Computer Science', 'Engineering', 'Business'].some(field =>
        edu.field.includes(field)
      )
    );

    if (hasNonTraditionalEducation) {
      nonTraditionalBackground.push('Non-traditional educational background');
      uniquePerspectives.push('Brings diverse perspective from different academic discipline');
    }

    // Identify transferable skills from diverse experience
    candidate.experience.forEach(exp => {
      if (!exp.position.toLowerCase().includes(position.title.toLowerCase())) {
        const skills = exp.responsibilities.slice(0, 2);
        skills.forEach(responsibility => {
          transferableSkills.push({
            skill: 'Problem Solving',
            fromContext: `${exp.position} at ${exp.company}`,
            applicableTo: position.title,
            strength: 75,
            examples: [responsibility],
          });
        });
      }
    });

    // Check for undervalued experience
    if (candidate.experience.some(exp => exp.company.toLowerCase().includes('startup'))) {
      undervaluedExperience.push('Startup experience - versatility and adaptability');
    }

    if (candidate.certifications.length > 3) {
      undervaluedExperience.push('Self-driven learning and continuous improvement');
    }

    const gemScore = Math.min(
      (transferableSkills.length * 15) +
      (nonTraditionalBackground.length * 20) +
      (uniquePerspectives.length * 20) +
      (undervaluedExperience.length * 15),
      100
    );

    const isHiddenGem = gemScore > 60;

    return {
      candidateId: candidate.id,
      isHiddenGem,
      gemScore,
      hiddenStrengths: {
        transferableSkills,
        nonTraditionalBackground,
        uniquePerspectives,
        undervaluedExperience,
      },
      whyOverlooked: [
        'Non-traditional career path',
        'Skills not explicitly listed in conventional format',
        'Experience in different industry',
      ],
      realPotential: isHiddenGem
        ? 'High potential candidate who brings diverse perspective and transferable skills'
        : 'Standard candidate profile',
      developmentPath: 'Focus on bridging industry-specific knowledge gaps while leveraging unique background',
      riskMitigation: [
        'Provide structured onboarding',
        'Pair with mentor from traditional background',
        'Set clear 30-60-90 day goals',
      ],
      testimonialValue: isHiddenGem ? 'Strong diversity story and unique hiring success case' : 'Standard hire',
    };
  }

  // ============================================
  // 7. TEAM CHEMISTRY PREDICTION
  // ============================================

  static analyzeTeamChemistry(
    candidate: Candidate,
    teamComposition?: TeamComposition
  ): TeamChemistryPrediction {
    // Extract candidate working style from experience
    const candidateStyle = this.inferWorkingStyle(candidate);

    if (!teamComposition) {
      // Return basic analysis without team data
      return {
        candidateId: candidate.id,
        overallChemistryScore: 70,
        workingStyleCompatibility: {
          candidateStyle,
          teamAverageStyle: [],
          compatibility: 70,
          potentialConflicts: [],
          synergies: ['To be determined after team assignment'],
        },
        communicationFit: {
          candidatePreference: 'Collaborative',
          teamNorm: 'Unknown',
          alignment: 70,
        },
        diversityImpact: {
          bringsNewPerspective: true,
          skillDiversity: 75,
          backgroundDiversity: 70,
          thoughtDiversity: 75,
        },
        potentialMentors: [],
        potentialMentees: [],
        integrationTimeline: '4-6 weeks',
        recommendations: [
          'Schedule team introduction meeting',
          'Assign onboarding buddy',
          'Regular check-ins during first month',
        ],
      };
    }

    // Analyze compatibility with team
    const teamStyles = teamComposition.members.map(m => m.workStyle).flat();
    const styleOverlap = candidateStyle.filter(style =>
      teamStyles.some(ts => ts.toLowerCase().includes(style.toLowerCase()))
    ).length;
    const compatibility = Math.min((styleOverlap / candidateStyle.length) * 100, 100);

    const overallChemistryScore = Math.round(
      compatibility * 0.4 + // Working style compatibility
      75 * 0.3 + // Communication fit
      80 * 0.3   // Diversity impact
    );

    return {
      candidateId: candidate.id,
      targetTeamId: teamComposition.teamId,
      overallChemistryScore,
      workingStyleCompatibility: {
        candidateStyle,
        teamAverageStyle: Array.from(new Set(teamStyles)),
        compatibility: Math.round(compatibility),
        potentialConflicts: compatibility < 60 ? ['May need adjustment period', 'Different work pace'] : [],
        synergies: ['Brings complementary skills', 'Fresh perspective'],
      },
      communicationFit: {
        candidatePreference: 'Collaborative and transparent',
        teamNorm: 'Agile and iterative',
        alignment: 75,
      },
      diversityImpact: {
        bringsNewPerspective: true,
        skillDiversity: this.calculateSkillDiversity(candidate, teamComposition),
        backgroundDiversity: 80,
        thoughtDiversity: 75,
      },
      potentialMentors: teamComposition.members
        .filter(m => m.tenure > 24)
        .map(m => m.id)
        .slice(0, 2),
      potentialMentees: teamComposition.members
        .filter(m => m.tenure < 12)
        .map(m => m.id)
        .slice(0, 2),
      integrationTimeline: overallChemistryScore > 75 ? '2-4 weeks' : '4-8 weeks',
      recommendations: [
        'Introduce to team leads first',
        'Participate in team-building activities',
        overallChemistryScore < 70 ? 'Monitor integration closely' : 'Standard onboarding process',
      ],
    };
  }

  private static inferWorkingStyle(candidate: Candidate): string[] {
    const styles: string[] = ['Collaborative', 'Detail-oriented'];

    if (candidate.experience.some(exp => exp.position.toLowerCase().includes('lead') || exp.position.toLowerCase().includes('senior'))) {
      styles.push('Leadership-oriented');
    }

    if (candidate.certifications.length > 2) {
      styles.push('Continuous learner');
    }

    if (candidate.skills.length > 15) {
      styles.push('Versatile', 'Adaptable');
    }

    return styles;
  }

  private static calculateSkillDiversity(candidate: Candidate, team: TeamComposition): number {
    const teamSkills = team.members.map(m => m.skills).flat();
    const uniqueSkills = candidate.skills.filter(s =>
      !teamSkills.some(ts => ts.toLowerCase() === s.toLowerCase())
    );
    return Math.min((uniqueSkills.length / candidate.skills.length) * 100, 100);
  }

  // ============================================
  // 8. REFERENCE CHECK QUESTION GENERATOR
  // ============================================

  static generateReferenceCheckGuide(
    candidate: Candidate,
    position: JobPosition
  ): ReferenceCheckGuide {
    const questions: ReferenceCheckQuestion[] = [];

    // Performance verification
    candidate.experience.slice(0, 2).forEach((exp, index) => {
      questions.push({
        id: `perf-${index}`,
        category: 'PERFORMANCE',
        question: `${candidate.name} listed several achievements during their time at ${exp.company}. Can you speak to their overall performance and key contributions?`,
        targetedAt: `Achievements at ${exp.company}`,
        reasoning: 'Verify claimed achievements and performance level',
        idealAnswer: 'Specific examples confirming achievements with measurable impact',
        concerningAnswers: [
          'Vague or generic responses',
          'Unable to recall specific contributions',
          'Contradicts resume claims',
        ],
        followUpIf: {
          condition: 'If hesitant or vague',
          question: 'Can you provide a specific example of a project they led or contributed to?',
        },
        priority: 'CRITICAL',
      });
    });

    // Work ethic and reliability
    questions.push({
      id: 'work-ethic-1',
      category: 'WORK_ETHIC',
      question: 'How would you describe their work ethic and reliability? Were there any attendance or deadline issues?',
      targetedAt: 'General work ethic',
      reasoning: 'Assess reliability and professionalism',
      idealAnswer: 'Consistently reliable, met deadlines, strong work ethic',
      concerningAnswers: [
        'Frequent absences',
        'Missed deadlines regularly',
        'Needed constant supervision',
      ],
      followUpIf: {
        condition: 'If mentions any issues',
        question: 'Can you elaborate on those situations? How did they handle them?',
      },
      priority: 'CRITICAL',
    });

    // Teamwork assessment
    questions.push({
      id: 'teamwork-1',
      category: 'TEAMWORK',
      question: 'How did they work with their team members and cross-functional partners? Any challenges?',
      targetedAt: 'Team collaboration',
      reasoning: 'Assess collaboration and interpersonal skills',
      idealAnswer: 'Excellent collaborator, helpful, good communicator',
      concerningAnswers: [
        'Difficult to work with',
        'Conflicts with team members',
        'Poor communication',
      ],
      followUpIf: {
        condition: 'If mentions challenges',
        question: 'How did they handle those challenges? Did you see improvement?',
      },
      priority: 'IMPORTANT',
    });

    // Growth and development
    questions.push({
      id: 'growth-1',
      category: 'GROWTH',
      question: 'How did they respond to feedback and coaching? Did you see growth during their tenure?',
      targetedAt: 'Learning and development',
      reasoning: 'Assess coachability and growth mindset',
      idealAnswer: 'Receptive to feedback, showed continuous improvement',
      concerningAnswers: [
        'Defensive about feedback',
        'No visible growth',
        'Resistant to change',
      ],
      followUpIf: {
        condition: 'If growth mentioned',
        question: 'What specific areas did they improve in?',
      },
      priority: 'IMPORTANT',
    });

    // Red flags check
    questions.push({
      id: 'red-flags-1',
      category: 'RED_FLAGS',
      question: 'Is there anything that would make you hesitate to recommend them for this position? Any areas of concern?',
      targetedAt: 'Overall concerns',
      reasoning: 'Identify any potential red flags',
      idealAnswer: 'No significant concerns, would rehire',
      concerningAnswers: [
        'Would not rehire',
        'Significant concerns raised',
        'Hesitation to recommend',
      ],
      followUpIf: {
        condition: 'If concerns raised',
        question: 'Can you provide more details about those concerns?',
      },
      priority: 'CRITICAL',
    });

    // Verify specific skills
    const topSkills = position.requiredSkills.slice(0, 2);
    topSkills.forEach((skill, index) => {
      questions.push({
        id: `skill-verify-${index}`,
        category: 'PERFORMANCE',
        question: `How would you rate their proficiency in ${skill}? Can you provide an example of how they used this skill?`,
        targetedAt: `${skill} proficiency`,
        reasoning: `Verify claimed expertise in ${skill}`,
        idealAnswer: `Strong proficiency with concrete examples`,
        concerningAnswers: [
          'Limited experience',
          'Cannot provide examples',
          'Overstated on resume',
        ],
        followUpIf: {
          condition: 'If proficiency questioned',
          question: 'Did they seek help or training in this area?',
        },
        priority: 'IMPORTANT',
      });
    });

    return {
      candidateId: candidate.id,
      generatedAt: new Date().toISOString(),
      questions,
      focusAreas: ['Performance', 'Reliability', 'Teamwork', 'Growth', 'Red Flags'],
      verificationPoints: [
        {
          claim: `${candidate.experience[0]?.duration || 'X years'} at ${candidate.experience[0]?.company || 'previous company'}`,
          source: 'Resume',
          howToVerify: 'Ask about employment dates and role responsibilities',
          priority: 'HIGH',
        },
        {
          claim: 'Technical skills: ' + candidate.skills.slice(0, 5).join(', '),
          source: 'Resume',
          howToVerify: 'Request specific project examples using these skills',
          priority: 'HIGH',
        },
        {
          claim: 'Achievements listed in resume',
          source: 'Resume',
          howToVerify: 'Ask for confirmation and additional context',
          priority: 'MEDIUM',
        },
      ],
      redFlagsToWatch: [
        'Hesitation when asked about rehiring',
        'Vague answers about specific achievements',
        'Mentions of interpersonal conflicts',
        'Contradiction with resume claims',
        'Unwillingness to provide details',
      ],
    };
  }

  // ============================================
  // 9. OFFER ACCEPTANCE PROBABILITY
  // ============================================

  static predictOfferAcceptance(
    candidate: Candidate,
    position: JobPosition,
    offeredSalary: number
  ): OfferAcceptancePrediction {
    const marketRate = (position.salaryRange.min + position.salaryRange.max) / 2;
    const salaryDiff = offeredSalary - candidate.expectedSalary;
    const salaryVsMarket = offeredSalary - marketRate;

    // Compensation alignment score
    const compensationSatisfaction = Math.min(
      ((salaryDiff + candidate.expectedSalary) / candidate.expectedSalary) * 50 + 50,
      100
    );

    // Career growth alignment
    const careerGrowthPotential = 75; // Default assumption
    const alignsWithGoals = true; // Assuming they applied

    // Location fit
    const locationMatch = candidate.location.toLowerCase() === position.location.toLowerCase();
    const locationPreference = locationMatch ? 90 : 50;

    // Calculate overall probability
    const acceptanceProbability = Math.round(
      compensationSatisfaction * 0.35 +
      careerGrowthPotential * 0.25 +
      locationPreference * 0.15 +
      75 * 0.15 + // Company fit
      (candidate.status === 'INTERVIEWING' ? 70 : 50) * 0.10 // Competing offers impact
    );

    // Counter-offer risk
    const currentTenure = candidate.experience[0] ? parseInt(candidate.experience[0].duration) : 0;
    const counterOfferRisk = Math.min(currentTenure > 24 ? 70 : 40, 85);

    // Negotiation likelihood
    const negotiationLikelihood = salaryDiff < 0 ? 85 : salaryDiff < candidate.expectedSalary * 0.1 ? 60 : 30;

    return {
      candidateId: candidate.id,
      positionId: position.id,
      acceptanceProbability,
      factors: {
        compensationAlignment: {
          offered: offeredSalary,
          expected: candidate.expectedSalary,
          marketRate,
          satisfaction: Math.round(compensationSatisfaction),
        },
        careerGrowth: {
          alignsWithGoals,
          growthPotential: careerGrowthPotential,
          learningOpportunities: [
            'New technologies and methodologies',
            'Leadership development',
            'Cross-functional collaboration',
          ],
        },
        locationFit: {
          commute: locationMatch ? 'Local' : 'Requires relocation',
          relocationRequired: !locationMatch,
          locationPreference: Math.round(locationPreference),
        },
        companyFit: {
          cultureAlignment: 75,
          brandAppeal: 70,
          missionAlignment: 80,
        },
        competingOffers: {
          likely: candidate.status === 'INTERVIEWING',
          estimatedCount: candidate.status === 'INTERVIEWING' ? 2 : 0,
          betterPositioned: offeredSalary >= marketRate,
        },
      },
      negotiationLikelihood,
      counterOfferRisk,
      decisionTimeline: acceptanceProbability > 75 ? '3-5 days' : '1-2 weeks',
      optimizationSuggestions: {
        strengthenOffer: salaryDiff < 0 ? [
          `Increase salary offer (currently ${Math.abs(salaryDiff)} below expectation)`,
          'Highlight additional benefits and perks',
          'Emphasize signing bonus or equity options',
        ] : [
          'Emphasize total compensation package',
          'Highlight growth opportunities',
        ],
        addressConcerns: !locationMatch ? [
          'Discuss relocation support',
          'Offer remote work flexibility',
        ] : [
          'Address any concerns raised during interview',
        ],
        emphasize: [
          'Career growth trajectory',
          'Learning and development opportunities',
          'Company culture and team dynamics',
          'Work-life balance',
        ],
      },
      closingStrategy: acceptanceProbability > 75
        ? 'Move quickly with strong offer - candidate is likely to accept'
        : negotiationLikelihood > 70
        ? 'Expect negotiation - leave room for counter-offer discussion'
        : 'Build relationship and emphasize non-monetary benefits',
    };
  }

  // ============================================
  // 10. TALENT POOL AUTO-CATEGORIZATION
  // ============================================

  static categorizeCandidateForPool(
    candidate: Candidate,
    position: JobPosition,
    categories: TalentPoolCategory[]
  ): CandidatePoolAssignment {
    const assignments: CandidatePoolAssignment['categories'] = [];
    const tags: string[] = [];

    // Default categories if none provided
    if (categories.length === 0) {
      categories = this.getDefaultCategories();
    }

    // Score candidate
    const candidateScore = candidate.analysis?.overallScore || 70;

    // Categorize based on criteria
    categories.forEach(category => {
      let matches = false;
      let confidence = 0;
      let reason = '';

      // Check score range
      if (category.criteria.minScore !== undefined && category.criteria.maxScore !== undefined) {
        if (candidateScore >= category.criteria.minScore && candidateScore <= category.criteria.maxScore) {
          matches = true;
          confidence = 80;
          reason = `Score ${candidateScore} matches category range`;
        }
      }

      // Check skills
      if (category.criteria.skills && category.criteria.skills.length > 0) {
        const skillMatches = candidate.skills.filter(s =>
          category.criteria.skills?.some(cs => s.toLowerCase().includes(cs.toLowerCase()))
        ).length;
        if (skillMatches > 0) {
          matches = true;
          confidence = Math.max(confidence, (skillMatches / category.criteria.skills.length) * 100);
          reason = `Matches ${skillMatches} required skills`;
        }
      }

      // Check experience
      if (category.criteria.experience && category.criteria.experience.length > 0) {
        const expMatches = candidate.experience.some(exp =>
          category.criteria.experience?.some(ce =>
            exp.position.toLowerCase().includes(ce.toLowerCase())
          )
        );
        if (expMatches) {
          matches = true;
          confidence = Math.max(confidence, 75);
          reason = 'Relevant experience match';
        }
      }

      if (matches) {
        assignments.push({
          categoryId: category.id,
          categoryName: category.name,
          assignedAt: new Date().toISOString(),
          confidence: Math.round(confidence),
          reason,
        });
      }
    });

    // Generate tags
    if (candidateScore > 85) tags.push('High-Potential');
    if (candidateScore < 60) tags.push('Needs-Development');
    if (candidate.certifications.length > 3) tags.push('Certified-Professional');
    if (candidate.skills.length > 15) tags.push('Versatile');
    if (candidate.experience.length > 5) tags.push('Experienced');

    // Determine next review date based on category
    const daysUntilReview = assignments.length > 0
      ? assignments[0].confidence > 80 ? 30 : 60
      : 90;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);

    // Generate development plan
    const developmentPlan = this.generateDevelopmentPlan(candidate, position, candidateScore);

    return {
      candidateId: candidate.id,
      categories: assignments,
      tags,
      nextReviewDate: nextReviewDate.toISOString(),
      developmentPlan,
      notes: `Automatically categorized based on profile analysis. Score: ${candidateScore}/100`,
    };
  }

  private static getDefaultCategories(): TalentPoolCategory[] {
    return [
      {
        id: 'hot-leads',
        name: 'Hot Leads',
        description: 'High-scoring candidates ready for immediate consideration',
        color: '#ef4444',
        criteria: { minScore: 85 },
        action: {
          followUpTimeline: 'Within 24 hours',
          nurturingStrategy: 'Fast-track interview process',
          reassessmentInterval: 7,
          autoNotifications: true,
        },
      },
      {
        id: 'qualified',
        name: 'Qualified Pipeline',
        description: 'Strong candidates for current or future roles',
        color: '#3b82f6',
        criteria: { minScore: 70, maxScore: 84 },
        action: {
          followUpTimeline: 'Within 1 week',
          nurturingStrategy: 'Regular check-ins and updates',
          reassessmentInterval: 30,
          autoNotifications: true,
        },
      },
      {
        id: 'potential',
        name: 'High Potential',
        description: 'Candidates with growth potential, may need development',
        color: '#10b981',
        criteria: { minScore: 60, maxScore: 69 },
        action: {
          followUpTimeline: 'Within 2 weeks',
          nurturingStrategy: 'Nurture with content and opportunities',
          reassessmentInterval: 60,
          autoNotifications: false,
        },
      },
      {
        id: 'long-term',
        name: 'Long-term Prospects',
        description: 'Keep warm for future opportunities',
        color: '#8b5cf6',
        criteria: { minScore: 50, maxScore: 59 },
        action: {
          followUpTimeline: 'Within 1 month',
          nurturingStrategy: 'Quarterly newsletter and updates',
          reassessmentInterval: 90,
          autoNotifications: false,
        },
      },
    ];
  }

  private static generateDevelopmentPlan(
    candidate: Candidate,
    position: JobPosition,
    score: number
  ): string {
    if (score > 85) {
      return 'Continue current trajectory. Focus on leadership development.';
    } else if (score > 70) {
      const missingSkills = position.requiredSkills.filter(rs =>
        !candidate.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()))
      );
      return missingSkills.length > 0
        ? `Develop skills in: ${missingSkills.slice(0, 3).join(', ')}`
        : 'Strengthen experience in target domain';
    } else {
      return 'Focus on core skill development and gaining relevant experience';
    }
  }

  // ============================================
  // COMBINED ADVANCED ANALYSIS
  // ============================================

  static async performFullAdvancedAnalysis(
    candidate: Candidate,
    position: JobPosition,
    allPositions: JobPosition[],
    topPerformers: TopPerformerProfile[] = [],
    teamComposition?: TeamComposition,
    offeredSalary?: number
  ): Promise<AdvancedCandidateAnalysis> {
    const results: AdvancedCandidateAnalysis = {
      candidateId: candidate.id,
      analyzedAt: new Date().toISOString(),
      overallRecommendation: '',
      hiringConfidence: 0,
      uniqueValue: '',
      risks: [],
      opportunities: [],
      nextSteps: [],
    };

    // Run all analyses
    try {
      // 1. Top performer matching
      if (topPerformers.length > 0) {
        results.topPerformerMatch = await this.analyzeTopPerformerMatch(
          candidate,
          topPerformers[0]
        );
      }

      // 2. Career momentum
      results.careerMomentum = await this.analyzeCareerMomentum(candidate);

      // 3. Reverse matching
      results.reverseMatching = await this.analyzeReverseMatching(candidate, allPositions);

      // 4. Flight risk
      results.flightRisk = this.analyzeFlightRisk(candidate, position);

      // 5. Interview questions
      results.interviewQuestions = await this.generateInterviewQuestions(candidate, position);

      // 6. Hidden gem analysis
      results.hiddenGemAnalysis = this.analyzeHiddenGem(candidate, position);

      // 7. Team chemistry
      results.teamChemistry = this.analyzeTeamChemistry(candidate, teamComposition);

      // 8. Reference check guide
      results.referenceCheckGuide = this.generateReferenceCheckGuide(candidate, position);

      // 9. Offer acceptance (if salary provided)
      if (offeredSalary) {
        results.offerAcceptance = this.predictOfferAcceptance(candidate, position, offeredSalary);
      }

      // 10. Pool assignment
      results.poolAssignment = this.categorizeCandidateForPool(candidate, position, []);

      // Generate overall insights
      results.hiringConfidence = Math.round(
        ((results.topPerformerMatch?.overallSimilarity || 70) +
          (results.careerMomentum?.velocityScore || 70) +
          (results.reverseMatching?.bestFitRoles[0]?.fitScore || 70) +
          (results.teamChemistry?.overallChemistryScore || 70) +
          (results.hiddenGemAnalysis?.gemScore || 60)) /
          5
      );

      results.overallRecommendation = this.generateOverallRecommendation(results);
      results.uniqueValue = this.identifyUniqueValue(results);
      results.risks = this.identifyRisks(results);
      results.opportunities = this.identifyOpportunities(results);
      results.nextSteps = this.generateNextSteps(results);
    } catch (error) {
      console.error('Advanced analysis failed:', error);
    }

    return results;
  }

  private static generateOverallRecommendation(analysis: AdvancedCandidateAnalysis): string {
    if (analysis.hiringConfidence > 85) {
      return 'STRONG HIRE - Proceed with offer immediately';
    } else if (analysis.hiringConfidence > 70) {
      return 'RECOMMENDED - Move forward with final interviews';
    } else if (analysis.hiringConfidence > 60) {
      return 'POTENTIAL - Consider for pipeline, may need development';
    } else {
      return 'PASS - Does not meet current hiring criteria';
    }
  }

  private static identifyUniqueValue(analysis: AdvancedCandidateAnalysis): string {
    const values: string[] = [];

    if (analysis.hiddenGemAnalysis?.isHiddenGem) {
      values.push('Hidden gem with unique perspective');
    }

    if (analysis.topPerformerMatch && analysis.topPerformerMatch.overallSimilarity > 80) {
      values.push('Strong similarity to top performers');
    }

    if (analysis.careerMomentum?.trajectory === 'ACCELERATING') {
      values.push('Accelerating career momentum');
    }

    return values.join('; ') || 'Standard candidate profile';
  }

  private static identifyRisks(analysis: AdvancedCandidateAnalysis): string[] {
    const risks: string[] = [];

    if (analysis.flightRisk && analysis.flightRisk.flightRiskScore > 70) {
      risks.push(`High flight risk (${analysis.flightRisk.flightRiskScore}%)`);
    }

    if (analysis.flightRisk && analysis.flightRisk.counterOfferProbability > 70) {
      risks.push('High counter-offer probability');
    }

    if (analysis.offerAcceptance && analysis.offerAcceptance.acceptanceProbability < 60) {
      risks.push('Low offer acceptance probability');
    }

    if (analysis.teamChemistry && analysis.teamChemistry.overallChemistryScore < 60) {
      risks.push('Potential team chemistry challenges');
    }

    return risks;
  }

  private static identifyOpportunities(analysis: AdvancedCandidateAnalysis): string[] {
    const opportunities: string[] = [];

    if (analysis.reverseMatching && analysis.reverseMatching.surprisingMatches.length > 0) {
      opportunities.push(
        `Consider for ${analysis.reverseMatching.surprisingMatches[0].positionTitle}`
      );
    }

    if (analysis.careerMomentum && analysis.careerMomentum.trajectory === 'ACCELERATING') {
      opportunities.push('Fast-track for leadership development');
    }

    if (analysis.hiddenGemAnalysis?.isHiddenGem) {
      opportunities.push('Diversity hire with unique background story');
    }

    return opportunities;
  }

  private static generateNextSteps(analysis: AdvancedCandidateAnalysis): string[] {
    const steps: string[] = [];

    if (analysis.hiringConfidence > 75) {
      steps.push('Schedule final interview with hiring manager');
      steps.push('Conduct reference checks using generated guide');
      steps.push('Prepare competitive offer package');
    } else if (analysis.hiringConfidence > 60) {
      steps.push('Continue interview process');
      steps.push('Assess skill gaps and development potential');
      steps.push('Consider for talent pipeline');
    } else {
      steps.push('Thank candidate for their time');
      steps.push('Keep in talent pool for future opportunities');
    }

    if (analysis.flightRisk && analysis.flightRisk.flightRiskScore > 70) {
      steps.push('Move quickly to minimize counter-offer risk');
    }

    return steps;
  }
}
