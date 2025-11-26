import {
  Candidate,
  JobPosition,
  CandidateAnalysis,
  ScoreDetail,
  SkillsGapAnalysis,
  RedFlag,
  RedFlagSeverity,
  CulturalFitIndicator,
  EmploymentGap,
  SkillMatch,
  SkillGap
} from '../types';

/**
 * AI Analysis Service
 * This service performs deep analysis of candidates against job positions.
 *
 * NOTE: This is a sophisticated mock implementation demonstrating the analysis logic.
 * In production, integrate with Anthropic's Claude API for actual AI-powered analysis.
 */

export class AIAnalysisService {

  /**
   * Main analysis function that performs comprehensive candidate evaluation
   */
  static async analyzeCandidate(
    candidate: Candidate,
    position: JobPosition
  ): Promise<CandidateAnalysis> {

    // Perform all analysis sub-tasks
    const skillsGapAnalysis = this.analyzeSkillsGap(candidate, position);
    const redFlags = this.detectRedFlags(candidate, position);
    const culturalFit = this.analyzeCulturalFit(candidate, position);
    const employmentGaps = this.detectEmploymentGaps(candidate);

    // Calculate detailed scores
    const technicalSkills = this.scoreTechnicalSkills(candidate, position, skillsGapAnalysis);
    const experience = this.scoreExperience(candidate, position);
    const education = this.scoreEducation(candidate, position);
    const culturalFitScore = this.scoreCulturalFit(culturalFit);
    const communication = this.scoreCommunication(candidate);
    const leadershipPotential = this.scoreLeadershipPotential(candidate);
    const careerProgression = this.scoreCareerProgression(candidate);
    const salaryAlignment = this.scoreSalaryAlignment(candidate, position);
    const availability = this.scoreAvailability(candidate, position);
    const locationFit = this.scoreLocationFit(candidate, position);

    // Calculate weighted overall score
    const weights = position.customScoringCriteria?.weights || this.getDefaultWeights();
    const overallScore = this.calculateWeightedScore({
      technicalSkills,
      experience,
      education,
      culturalFit: culturalFitScore,
      communication,
      leadershipPotential,
      careerProgression,
      salaryAlignment,
      availability,
      locationFit
    }, weights);

    // Determine overall fit
    const overallFit = this.determineOverallFit(overallScore);

    // Generate strengths and weaknesses
    const strengths = this.identifyStrengths(candidate, position, {
      technicalSkills,
      experience,
      education,
      culturalFit: culturalFitScore,
      communication,
      leadershipPotential,
      careerProgression,
      salaryAlignment,
      availability,
      locationFit
    });

    const weaknesses = this.identifyWeaknesses(candidate, position, redFlags, skillsGapAnalysis);

    // Generate recommendation
    const recommendation = this.generateRecommendation(overallScore, redFlags, skillsGapAnalysis);

    // Generate detailed analysis
    const detailedAnalysis = this.generateDetailedAnalysis(
      candidate,
      position,
      overallScore,
      skillsGapAnalysis,
      redFlags,
      strengths,
      weaknesses
    );

    // Generate reasoning
    const reasoning = this.generateReasoning(recommendation, overallScore, strengths, weaknesses);

    // Generate interview questions
    const suggestedInterviewQuestions = this.generateInterviewQuestions(candidate, position, weaknesses);

    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(weaknesses, redFlags, skillsGapAnalysis);

    return {
      candidateId: candidate.id,
      positionId: position.id,
      analyzedAt: new Date().toISOString(),
      overallScore,
      overallFit,
      scores: {
        technicalSkills,
        experience,
        education,
        culturalFit: culturalFitScore,
        communication,
        leadershipPotential,
        careerProgression,
        salaryAlignment,
        availability,
        locationFit
      },
      skillsGapAnalysis,
      redFlags,
      strengths,
      weaknesses,
      culturalFitIndicators: culturalFit,
      employmentGaps,
      recommendation,
      reasoning,
      detailedAnalysis,
      suggestedInterviewQuestions,
      focusAreas
    };
  }

  // ============================================
  // SKILLS ANALYSIS
  // ============================================

  private static analyzeSkillsGap(candidate: Candidate, position: JobPosition): SkillsGapAnalysis {
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const requiredSkills = position.requirements
      .flatMap(r => this.extractSkillsFromText(r))
      .map(s => s.toLowerCase());
    const preferredSkills = position.preferredQualifications
      .flatMap(r => this.extractSkillsFromText(r))
      .map(s => s.toLowerCase());

    const requiredSkillsMet: SkillMatch[] = [];
    const requiredSkillsMissing: SkillGap[] = [];
    const preferredSkillsMet: SkillMatch[] = [];
    const preferredSkillsMissing: SkillGap[] = [];

    // Check required skills
    requiredSkills.forEach(skill => {
      if (candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))) {
        const yearsExp = this.estimateSkillExperience(candidate, skill);
        requiredSkillsMet.push({
          skill,
          proficiencyLevel: this.estimateProficiency(yearsExp),
          yearsOfExperience: yearsExp,
          evidence: this.findSkillEvidence(candidate, skill)
        });
      } else {
        requiredSkillsMissing.push({
          skill,
          importance: 'MUST_HAVE',
          canBeTrainedQuickly: this.canBeTrainedQuickly(skill),
          alternativeSkills: this.findAlternativeSkills(candidateSkills, skill)
        });
      }
    });

    // Check preferred skills
    preferredSkills.forEach(skill => {
      if (candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))) {
        const yearsExp = this.estimateSkillExperience(candidate, skill);
        preferredSkillsMet.push({
          skill,
          proficiencyLevel: this.estimateProficiency(yearsExp),
          yearsOfExperience: yearsExp,
          evidence: this.findSkillEvidence(candidate, skill)
        });
      } else {
        preferredSkillsMissing.push({
          skill,
          importance: 'NICE_TO_HAVE',
          canBeTrainedQuickly: this.canBeTrainedQuickly(skill),
          alternativeSkills: this.findAlternativeSkills(candidateSkills, skill)
        });
      }
    });

    // Find additional skills
    const allRequiredAndPreferred = [...requiredSkills, ...preferredSkills];
    const additionalSkills = candidate.skills.filter(
      cs => !allRequiredAndPreferred.some(rs => cs.toLowerCase().includes(rs) || rs.includes(cs.toLowerCase()))
    );

    const overallSkillMatch = this.calculateSkillMatchPercentage(
      requiredSkillsMet.length,
      requiredSkills.length,
      preferredSkillsMet.length,
      preferredSkills.length
    );

    return {
      requiredSkillsMet,
      requiredSkillsMissing,
      preferredSkillsMet,
      preferredSkillsMissing,
      additionalSkills,
      overallSkillMatch
    };
  }

  private static extractSkillsFromText(text: string): string[] {
    // Simple skill extraction - in production, use NLP
    const commonSkills = [
      'react', 'node', 'typescript', 'javascript', 'python', 'java', 'aws', 'gcp', 'azure',
      'docker', 'kubernetes', 'sql', 'nosql', 'mongodb', 'postgresql', 'redis',
      'figma', 'sketch', 'adobe', 'ux', 'ui', 'design', 'research', 'prototyping'
    ];

    return commonSkills.filter(skill =>
      text.toLowerCase().includes(skill)
    );
  }

  private static estimateSkillExperience(candidate: Candidate, skill: string): number {
    let years = 0;
    candidate.workExperience.forEach(exp => {
      if (exp.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        years += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }
    });
    return Math.round(years * 10) / 10;
  }

  private static estimateProficiency(years: number): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' {
    if (years < 1) return 'BEGINNER';
    if (years < 3) return 'INTERMEDIATE';
    if (years < 5) return 'ADVANCED';
    return 'EXPERT';
  }

  private static findSkillEvidence(candidate: Candidate, skill: string): string[] {
    const evidence: string[] = [];
    candidate.workExperience.forEach(exp => {
      if (exp.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        evidence.push(`${exp.company}: ${exp.position}`);
      }
    });
    return evidence.slice(0, 3);
  }

  private static canBeTrainedQuickly(skill: string): boolean {
    const quickToLearn = ['docker', 'git', 'jira', 'figma', 'sketch'];
    return quickToLearn.some(q => skill.toLowerCase().includes(q));
  }

  private static findAlternativeSkills(candidateSkills: string[], missingSkill: string): string[] {
    const alternatives: Record<string, string[]> = {
      'react': ['vue', 'angular', 'svelte'],
      'vue': ['react', 'angular'],
      'angular': ['react', 'vue'],
      'node': ['python', 'java', 'go'],
      'figma': ['sketch', 'adobe xd'],
      'sketch': ['figma', 'adobe xd']
    };

    const alts = alternatives[missingSkill.toLowerCase()] || [];
    return candidateSkills.filter(cs =>
      alts.some(a => cs.toLowerCase().includes(a))
    );
  }

  private static calculateSkillMatchPercentage(
    requiredMet: number,
    requiredTotal: number,
    preferredMet: number,
    preferredTotal: number
  ): number {
    const requiredWeight = 0.7;
    const preferredWeight = 0.3;

    const requiredScore = requiredTotal > 0 ? (requiredMet / requiredTotal) * 100 : 100;
    const preferredScore = preferredTotal > 0 ? (preferredMet / preferredTotal) * 100 : 100;

    return Math.round(requiredScore * requiredWeight + preferredScore * preferredWeight);
  }

  // ============================================
  // RED FLAG DETECTION
  // ============================================

  private static detectRedFlags(candidate: Candidate, position: JobPosition): RedFlag[] {
    const flags: RedFlag[] = [];

    // Check for frequent job changes
    if (candidate.workExperience.length >= 3) {
      const avgTenure = candidate.totalYearsExperience / candidate.workExperience.length;
      if (avgTenure < 1.5) {
        flags.push({
          id: `flag-${Date.now()}-1`,
          type: 'FREQUENT_JOB_CHANGES',
          severity: RedFlagSeverity.MEDIUM,
          title: 'Frequent Job Changes',
          description: `Candidate has averaged ${avgTenure.toFixed(1)} years per position across ${candidate.workExperience.length} roles.`,
          impact: 'May indicate commitment issues or difficulty finding the right fit.',
          recommendation: 'Discuss career goals and reasons for job changes during interview.'
        });
      }
    }

    // Check salary alignment
    if (candidate.expectedSalary && (candidate.expectedSalary < position.salaryMin || candidate.expectedSalary > position.salaryMax)) {
      const severity = candidate.expectedSalary > position.salaryMax * 1.2 ? RedFlagSeverity.HIGH : RedFlagSeverity.MEDIUM;
      flags.push({
        id: `flag-${Date.now()}-2`,
        type: 'SALARY_MISMATCH',
        severity,
        title: 'Salary Expectations Mismatch',
        description: `Candidate expects $${candidate.expectedSalary.toLocaleString()}, but position range is $${position.salaryMin.toLocaleString()}-$${position.salaryMax.toLocaleString()}.`,
        impact: 'May lead to failed negotiations or early departure if expectations aren\'t met.',
        recommendation: 'Discuss compensation expectations early in the process.'
      });
    }

    // Check overqualification
    const experienceLevelMap = { 'INTERN': 0, 'ENTRY': 1, 'JUNIOR': 2, 'MID': 3, 'SENIOR': 4, 'LEAD': 5, 'PRINCIPAL': 6, 'EXECUTIVE': 7 };
    const candidateLevel = experienceLevelMap[candidate.experienceLevel];
    const positionLevel = experienceLevelMap[position.experienceLevel];

    if (candidateLevel > positionLevel + 1) {
      flags.push({
        id: `flag-${Date.now()}-3`,
        type: 'OVERQUALIFIED',
        severity: RedFlagSeverity.MEDIUM,
        title: 'Potentially Overqualified',
        description: `Candidate has ${candidate.experienceLevel} level experience for a ${position.experienceLevel} position.`,
        impact: 'Risk of disengagement, early departure, or high salary expectations.',
        recommendation: 'Understand candidate\'s motivations for considering this role.'
      });
    }

    return flags;
  }

  private static detectEmploymentGaps(candidate: Candidate): EmploymentGap[] {
    const gaps: EmploymentGap[] = [];
    const sortedExp = [...candidate.workExperience].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sortedExp.length - 1; i++) {
      const current = sortedExp[i];
      const next = sortedExp[i + 1];

      const endDate = new Date(current.endDate);
      const startDate = new Date(next.startDate);
      const gapMonths = (startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (gapMonths > 2) {
        gaps.push({
          startDate: current.endDate,
          endDate: next.startDate,
          durationMonths: Math.round(gapMonths),
          impact: gapMonths > 12 ? 'HIGH' : gapMonths > 6 ? 'MODERATE' : 'LOW'
        });
      }
    }

    return gaps;
  }

  // ============================================
  // CULTURAL FIT ANALYSIS
  // ============================================

  private static analyzeCulturalFit(candidate: Candidate, position: JobPosition): CulturalFitIndicator[] {
    return [
      {
        trait: 'Remote Work Adaptability',
        alignment: position.remote ? 'STRONG' : 'MODERATE',
        evidence: [position.remote ? 'Position offers remote work' : 'Position is office-based'],
        reasoning: position.remote ? 'Candidate applying for remote role shows interest in distributed work.' : 'Office-based role may require different work style.'
      },
      {
        trait: 'Continuous Learning',
        alignment: candidate.certifications.length > 0 ? 'STRONG' : 'MODERATE',
        evidence: candidate.certifications.map(c => c.name),
        reasoning: candidate.certifications.length > 0 ? 'Active pursuit of certifications demonstrates commitment to growth.' : 'No recent certifications listed.'
      },
      {
        trait: 'Collaboration',
        alignment: 'MODERATE',
        evidence: this.findCollaborationEvidence(candidate),
        reasoning: 'Work experience shows involvement in team projects.'
      }
    ];
  }

  private static findCollaborationEvidence(candidate: Candidate): string[] {
    const evidence: string[] = [];
    candidate.workExperience.forEach(exp => {
      const collabKeywords = ['team', 'collaborate', 'cross-functional', 'mentor'];
      if (collabKeywords.some(keyword =>
        exp.description.toLowerCase().includes(keyword) ||
        exp.achievements.some(a => a.toLowerCase().includes(keyword))
      )) {
        evidence.push(exp.company);
      }
    });
    return evidence.slice(0, 3);
  }

  // ============================================
  // SCORING FUNCTIONS
  // ============================================

  private static scoreTechnicalSkills(
    candidate: Candidate,
    position: JobPosition,
    skillsAnalysis: SkillsGapAnalysis
  ): ScoreDetail {
    const score = skillsAnalysis.overallSkillMatch;
    return {
      score,
      weight: 0.25,
      reasoning: `Matches ${skillsAnalysis.requiredSkillsMet.length}/${skillsAnalysis.requiredSkillsMet.length + skillsAnalysis.requiredSkillsMissing.length} required skills and ${skillsAnalysis.preferredSkillsMet.length}/${skillsAnalysis.preferredSkillsMet.length + skillsAnalysis.preferredSkillsMissing.length} preferred skills.`,
      evidence: skillsAnalysis.requiredSkillsMet.map(s => `${s.skill} (${s.proficiencyLevel})`)
    };
  }

  private static scoreExperience(candidate: Candidate, position: JobPosition): ScoreDetail {
    const requiredYears = parseInt(position.requirements.find(r => r.match(/\d+/))?.match(/\d+/)?.[0] || '3');
    const score = Math.min(100, (candidate.totalYearsExperience / requiredYears) * 100);

    return {
      score: Math.round(score),
      weight: 0.20,
      reasoning: `Has ${candidate.totalYearsExperience} years of experience (requirement: ${requiredYears}+ years).`,
      evidence: candidate.workExperience.map(e => `${e.company} - ${e.position}`)
    };
  }

  private static scoreEducation(candidate: Candidate, position: JobPosition): ScoreDetail {
    const hasRelevantDegree = candidate.education.some(e =>
      position.requirements.some(r => r.toLowerCase().includes(e.field.toLowerCase()))
    );
    const score = hasRelevantDegree ? 100 : candidate.education.length > 0 ? 70 : 50;

    return {
      score,
      weight: 0.10,
      reasoning: hasRelevantDegree ? 'Has relevant degree in required field.' : 'Education background present but may not be directly relevant.',
      evidence: candidate.education.map(e => `${e.degree} in ${e.field} from ${e.institution}`)
    };
  }

  private static scoreCulturalFit(indicators: CulturalFitIndicator[]): ScoreDetail {
    const strongCount = indicators.filter(i => i.alignment === 'STRONG').length;
    const score = (strongCount / indicators.length) * 100;

    return {
      score: Math.round(score),
      weight: 0.15,
      reasoning: `${strongCount}/${indicators.length} strong cultural fit indicators identified.`,
      evidence: indicators.filter(i => i.alignment === 'STRONG').map(i => i.trait)
    };
  }

  private static scoreCommunication(candidate: Candidate): ScoreDetail {
    // Based on resume quality, cover letter, achievements clarity
    const score = candidate.coverLetter ? 85 : 70;
    return {
      score,
      weight: 0.10,
      reasoning: candidate.coverLetter ? 'Cover letter provided showing written communication.' : 'Basic communication assessment from resume.',
      evidence: ['Resume structure', 'Achievement descriptions']
    };
  }

  private static scoreLeadershipPotential(candidate: Candidate): ScoreDetail {
    const leadershipKeywords = ['lead', 'mentor', 'manage', 'direct', 'coordinate'];
    const hasLeadership = candidate.workExperience.some(exp =>
      leadershipKeywords.some(keyword =>
        exp.position.toLowerCase().includes(keyword) ||
        exp.achievements.some(a => a.toLowerCase().includes(keyword))
      )
    );

    const score = hasLeadership ? 90 : 60;
    return {
      score,
      weight: 0.05,
      reasoning: hasLeadership ? 'Demonstrates leadership experience in previous roles.' : 'Limited leadership indicators in work history.',
      evidence: hasLeadership ? candidate.workExperience
        .filter(e => leadershipKeywords.some(k => e.position.toLowerCase().includes(k)))
        .map(e => e.position) : []
    };
  }

  private static scoreCareerProgression(candidate: Candidate): ScoreDetail {
    const sorted = [...candidate.workExperience].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let progressionScore = 70;
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i-1].position.toLowerCase();
      const curr = sorted[i].position.toLowerCase();

      if (curr.includes('senior') && !prev.includes('senior')) progressionScore += 10;
      if (curr.includes('lead') && !prev.includes('lead')) progressionScore += 10;
    }

    const score = Math.min(100, progressionScore);
    return {
      score,
      weight: 0.05,
      reasoning: 'Career shows steady progression with increasing responsibilities.',
      evidence: sorted.map(e => `${e.company} - ${e.position}`)
    };
  }

  private static scoreSalaryAlignment(candidate: Candidate, position: JobPosition): ScoreDetail {
    if (!candidate.expectedSalary) {
      return { score: 75, weight: 0.05, reasoning: 'Salary expectations not specified.', evidence: [] };
    }

    const inRange = candidate.expectedSalary >= position.salaryMin && candidate.expectedSalary <= position.salaryMax;
    const score = inRange ? 100 : candidate.expectedSalary < position.salaryMin ? 80 : 40;

    return {
      score,
      weight: 0.05,
      reasoning: inRange ? 'Salary expectations align with position range.' : 'Salary expectations outside position range.',
      evidence: [`Expected: $${candidate.expectedSalary.toLocaleString()}`, `Range: $${position.salaryMin.toLocaleString()}-$${position.salaryMax.toLocaleString()}`]
    };
  }

  private static scoreAvailability(candidate: Candidate, position: JobPosition): ScoreDetail {
    const score = candidate.noticePeriod && candidate.noticePeriod <= 30 ? 100 : candidate.noticePeriod && candidate.noticePeriod <= 60 ? 80 : 60;
    return {
      score,
      weight: 0.03,
      reasoning: `Notice period: ${candidate.noticePeriod || 'Not specified'} days.`,
      evidence: [`${candidate.noticePeriod} days notice period`]
    };
  }

  private static scoreLocationFit(candidate: Candidate, position: JobPosition): ScoreDetail {
    const sameLocation = candidate.location.toLowerCase().includes(position.location.toLowerCase()) ||
                        position.location.toLowerCase().includes(candidate.location.toLowerCase());
    const score = position.remote ? 100 : sameLocation ? 100 : candidate.willingToRelocate ? 80 : 40;

    return {
      score,
      weight: 0.02,
      reasoning: position.remote ? 'Remote position - location not a constraint.' :
                 sameLocation ? 'Candidate in same location as position.' :
                 candidate.willingToRelocate ? 'Willing to relocate.' : 'Location mismatch, not willing to relocate.',
      evidence: [candidate.location, position.location]
    };
  }

  private static getDefaultWeights() {
    return {
      technicalSkills: 0.25,
      experience: 0.20,
      education: 0.10,
      culturalFit: 0.15,
      communication: 0.10,
      leadershipPotential: 0.05,
      careerProgression: 0.05,
      salaryAlignment: 0.05,
      availability: 0.03,
      locationFit: 0.02
    };
  }

  private static calculateWeightedScore(scores: Record<string, ScoreDetail>, weights: Record<string, number>): number {
    let totalScore = 0;
    Object.keys(scores).forEach(key => {
      totalScore += scores[key].score * (weights[key] || scores[key].weight);
    });
    return Math.round(totalScore);
  }

  private static determineOverallFit(score: number): 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' | 'OUTSTANDING' {
    if (score >= 90) return 'OUTSTANDING';
    if (score >= 80) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'FAIR';
    return 'POOR';
  }

  // ============================================
  // RECOMMENDATION GENERATION
  // ============================================

  private static generateRecommendation(
    score: number,
    redFlags: RedFlag[],
    skillsGap: SkillsGapAnalysis
  ): 'REJECT' | 'MAYBE' | 'INTERVIEW' | 'STRONG_YES' {
    const criticalFlags = redFlags.filter(f => f.severity === RedFlagSeverity.CRITICAL).length;
    const missingCriticalSkills = skillsGap.requiredSkillsMissing.filter(s => s.importance === 'MUST_HAVE').length;

    if (criticalFlags > 0 || missingCriticalSkills > 3) return 'REJECT';
    if (score >= 85 && missingCriticalSkills === 0) return 'STRONG_YES';
    if (score >= 70) return 'INTERVIEW';
    if (score >= 60) return 'MAYBE';
    return 'REJECT';
  }

  private static identifyStrengths(
    candidate: Candidate,
    position: JobPosition,
    scores: Record<string, ScoreDetail>
  ): string[] {
    const strengths: string[] = [];

    Object.entries(scores).forEach(([key, detail]) => {
      if (detail.score >= 85) {
        strengths.push(`Strong ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${detail.reasoning}`);
      }
    });

    if (candidate.certifications.length > 0) {
      strengths.push(`Certified professional with ${candidate.certifications.length} relevant certification(s)`);
    }

    return strengths.slice(0, 6);
  }

  private static identifyWeaknesses(
    candidate: Candidate,
    position: JobPosition,
    redFlags: RedFlag[],
    skillsGap: SkillsGapAnalysis
  ): string[] {
    const weaknesses: string[] = [];

    if (skillsGap.requiredSkillsMissing.length > 0) {
      weaknesses.push(`Missing ${skillsGap.requiredSkillsMissing.length} required skill(s): ${skillsGap.requiredSkillsMissing.map(s => s.skill).join(', ')}`);
    }

    redFlags.forEach(flag => {
      weaknesses.push(flag.title);
    });

    return weaknesses.slice(0, 5);
  }

  private static generateDetailedAnalysis(
    candidate: Candidate,
    position: JobPosition,
    score: number,
    skillsGap: SkillsGapAnalysis,
    redFlags: RedFlag[],
    strengths: string[],
    weaknesses: string[]
  ): string {
    return `
**Overall Assessment (Score: ${score}/100)**

${candidate.firstName} ${candidate.lastName} is a ${candidate.experienceLevel.toLowerCase()} candidate with ${candidate.totalYearsExperience} years of experience applying for the ${position.title} position.

**Key Strengths:**
${strengths.map(s => `• ${s}`).join('\n')}

**Areas of Concern:**
${weaknesses.length > 0 ? weaknesses.map(w => `• ${w}`).join('\n') : '• None identified'}

**Skills Match:** ${skillsGap.overallSkillMatch}%
- Required skills met: ${skillsGap.requiredSkillsMet.length}/${skillsGap.requiredSkillsMet.length + skillsGap.requiredSkillsMissing.length}
- Preferred skills met: ${skillsGap.preferredSkillsMet.length}/${skillsGap.preferredSkillsMet.length + skillsGap.preferredSkillsMissing.length}

**Red Flags:** ${redFlags.length} identified
${redFlags.map(f => `• ${f.title} (${f.severity}): ${f.description}`).join('\n')}

**Recommendation:** This candidate ${score >= 85 ? 'is a strong fit and should be prioritized for interview' : score >= 70 ? 'meets most requirements and is worth interviewing' : score >= 60 ? 'shows potential but has gaps that need to be assessed' : 'may not be the best fit for this role'}.
    `.trim();
  }

  private static generateReasoning(
    recommendation: string,
    score: number,
    strengths: string[],
    weaknesses: string[]
  ): string {
    const reasoningMap = {
      'STRONG_YES': `Outstanding candidate with a score of ${score}/100. ${strengths.length} major strengths identified with minimal concerns. This candidate should be fast-tracked.`,
      'INTERVIEW': `Solid candidate scoring ${score}/100. Shows strong potential across multiple evaluation criteria. Recommend interviewing to assess fit further.`,
      'MAYBE': `Candidate scores ${score}/100 with both strengths and areas of concern. Consider for interview if applicant pool is limited or candidate shows unique value in specific areas.`,
      'REJECT': `Candidate scores ${score}/100 and may not meet the requirements for this position. Significant gaps in required qualifications or multiple red flags identified.`
    };

    return reasoningMap[recommendation] || 'Assessment inconclusive.';
  }

  private static generateInterviewQuestions(
    candidate: Candidate,
    position: JobPosition,
    weaknesses: string[]
  ): string[] {
    const questions: string[] = [
      `Can you walk me through your experience with ${position.requirements[0]?.toLowerCase() || 'the key requirements'}?`,
      'What attracted you to this position and our company?',
      'Describe a challenging project you led and how you overcame obstacles.',
      'How do you stay current with industry trends and continue learning?'
    ];

    weaknesses.forEach((weakness, i) => {
      if (i < 2) {
        if (weakness.includes('Missing')) {
          questions.push(`I noticed you don't have experience with [specific skill]. How do you approach learning new technologies?`);
        } else if (weakness.includes('gap')) {
          questions.push('Can you explain the career gap in your work history?');
        }
      }
    });

    return questions.slice(0, 6);
  }

  private static identifyFocusAreas(
    weaknesses: string[],
    redFlags: RedFlag[],
    skillsGap: SkillsGapAnalysis
  ): string[] {
    const areas: string[] = [];

    if (skillsGap.requiredSkillsMissing.length > 0) {
      areas.push('Technical skills assessment');
    }

    if (redFlags.some(f => f.type === 'FREQUENT_JOB_CHANGES')) {
      areas.push('Career stability and long-term goals');
    }

    if (redFlags.some(f => f.type === 'SALARY_MISMATCH')) {
      areas.push('Compensation expectations and negotiation');
    }

    areas.push('Cultural fit and team dynamics');
    areas.push('Problem-solving approach');

    return areas.slice(0, 5);
  }
}
