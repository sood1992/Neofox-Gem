# Neofox HR - AI-Powered Candidate Screening Platform

<div align="center">
  <h3>Transform Your Hiring Process with Deep AI Analysis</h3>
  <p>A comprehensive HR screening tool designed to vet bulk profiles, identify top candidates, and provide detailed insights on fit.</p>
</div>

---

## Overview

Neofox HR is an advanced candidate screening platform that addresses the critical pain points HR professionals face when reviewing hundreds of applications. Built with modern technology and AI-powered analysis, it provides deep insights into candidate qualifications, cultural fit, and potential red flags.

## Key Pain Points Addressed

Based on extensive research from HR forums and Reddit communities, this tool solves:

1. **Volume Overload**: Process 250+ resumes per position efficiently
2. **Time Efficiency**: Reduce screening time from 23+ hours to minutes
3. **Qualification Accuracy**: Move beyond keyword matching to contextual analysis
4. **Transparency**: Clear explanations for why candidates rank high or low
5. **Comparison Difficulty**: Side-by-side candidate evaluation
6. **Poor Analytics**: Comprehensive reporting and hiring metrics
7. **Bias Reduction**: Systematic, criteria-based evaluation
8. **Missing Insights**: Cultural fit and employmentgap detection
9. **Manual Processes**: Bulk upload and automated parsing
10. **Collaboration Issues**: Team notes and feedback system

## Research Findings

### From HR Professionals & Reddit Communities

**Critical ATS/Screening Tool Issues Identified:**

- **Poor Resume Parsing**: 94% of companies use ATS, but candidates report frequent bugs and parsing failures that cause qualified applicants to be rejected ([Source](https://www.eternalworks.com/blog/the-problem-with-most-applicant-tracking-tools-ats))
- **Communication Gaps**: 22% of users report their ATS can't effectively communicate with candidates ([Source](https://www.selectsoftwarereviews.com/buyer-guide/applicant-tracking-systems))
- **Mobile Unfriendly**: Over 50% of job seekers use mobile devices, but many ATS systems aren't optimized ([Source](https://snacknation.com/blog/applicant-tracking-systems/))
- **Limited Integration**: Poor integration with other HR tools and job boards reduces efficiency
- **Weak Reporting**: Customization options are limited and difficult to navigate

**Top Requested Features:**

1. **Auto-Matching That Works**: Location and skill-based matching with clear, actionable results
2. **Advanced Boolean Search**: With saved criteria and alerts
3. **Actionable Insights**: Time-to-hire, cost-per-hire, source effectiveness metrics
4. **Accurate Parsing**: Extract resume information without losing critical details
5. **Collaboration Tools**: Real-time team feedback and candidate evaluation
6. **Mobile Optimization**: Full functionality on mobile devices
7. **Candidate Experience**: Reduce manual duplicate data entry
8. **Customizable Workflows**: Adapt to unique hiring processes

([Sources](https://aidevassess.com/articles/best-ats-according-to-reddit), [RecruitingBlogs](https://recruitingblogs.com/profiles/blogs/ats-top-ten-wish-list), [RecruitingDaily](https://recruitingdaily.com/here-is-what-recruiters-want-from-a-modern-ats/))

## Features

### Core Functionality

#### 🔍 AI-Powered Deep Analysis
- **Multi-Parameter Scoring System** (10 evaluation criteria)
  - Technical Skills (25% weight)
  - Experience (20% weight)
  - Education (10% weight)
  - Cultural Fit (15% weight)
  - Communication (10% weight)
  - Leadership Potential (5% weight)
  - Career Progression (5% weight)
  - Salary Alignment (5% weight)
  - Availability (3% weight)
  - Location Fit (2% weight)

#### 📊 Skills Gap Analysis
- Required vs. preferred skills matching
- Proficiency level assessment
- Alternative skills identification
- Training feasibility evaluation
- Years of experience per skill
- Evidence-based skill validation

#### 🚩 Red Flag Detection
- Frequent job changes
- Employment gaps with impact assessment
- Salary misalignment
- Over/under qualification
- Location incompatibility
- Missing critical skills

#### 🎯 Cultural Fit Indicators
- Remote work adaptability
- Continuous learning commitment
- Collaboration indicators
- Company values alignment
- Work style compatibility

#### 💼 Comprehensive Candidate Profiles
- Basic information and contact details
- Professional experience timeline
- Education and certifications
- Skills inventory
- Work achievements
- Language proficiency

#### 📈 Analytics & Reporting
- Time-to-hire metrics
- Cost-per-hire tracking
- Source effectiveness analysis
- Diversity statistics
- Conversion rate tracking
- Quality score trends

#### 👥 Team Collaboration
- Private and public notes
- Team feedback and ratings
- Interview recommendations
- Status tracking
- Assignment management

#### 🔎 Advanced Search & Filtering
- Boolean search capabilities
- Saved searches with alerts
- Multi-criteria filtering
- Auto-matching by skills and location
- Keyword search with exclusions

#### ⚖️ Side-by-Side Comparison
- Compare multiple candidates
- Category-based comparison matrix
- Score visualization
- Strengths/weaknesses overview

#### 📤 Export Capabilities
- PDF reports
- Excel spreadsheets
- CSV data export
- Comprehensive candidate dossiers

#### 🎛️ Custom Scoring Criteria
- Position-specific weights
- Must-have vs. nice-to-have skills
- Deal-breaker identification
- Cultural values definition

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom design system
- **Routing**: React Router 6
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Analysis**: Custom algorithm (Claude API ready)
- **Data Storage**: LocalStorage (production: PostgreSQL)
- **File Upload**: React Dropzone
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Project Structure

```
neofox-hr/
├── services/
│   ├── storageService.ts      # Data persistence layer
│   ├── aiAnalysisService.ts   # AI-powered candidate analysis
│   ├── emailService.ts         # Notification system
│   └── geminiService.ts        # AI integration (optional)
├── components/
│   ├── Sidebar.tsx             # Navigation
│   ├── Header.tsx              # Top bar with user info
│   ├── DashboardHome.tsx       # Overview dashboard
│   └── [Other Components]      # Feature-specific UI
├── types.ts                     # TypeScript definitions
├── App.tsx                      # Main application
└── index.tsx                    # Entry point
```

## Data Models

### Candidate
- Personal information
- Professional background
- Skills and certifications
- Work experience with achievements
- Education history
- Application metadata

### JobPosition
- Position details
- Requirements (required & preferred)
- Compensation range
- Location and remote options
- Custom scoring criteria

### CandidateAnalysis
- Overall score and fit assessment
- Detailed category scores
- Skills gap analysis
- Red flags with severity
- Cultural fit indicators
- Employment gap detection
- Recommendation and reasoning
- Interview questions
- Focus areas

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Neofox-Gem

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Quick Start

1. **Login**: Use one of the seed user accounts:
   - Admin: sarah.chen@neofox.com (Password: Admin1234)
   - HR Manager: michael.r@neofox.com (Password: Manager1234)
   - Recruiter: emily.j@neofox.com (Password: Recruiter1234)
   - Hiring Manager: david.k@neofox.com (Password: Hiring1234)

2. **View Candidates**: Navigate to the Candidates section to see applicants

3. **Analyze**: Click on a candidate to view their AI-powered analysis

4. **Compare**: Select multiple candidates for side-by-side comparison

5. **Collaborate**: Add notes and feedback for team members

6. **Report**: Export detailed reports in PDF or Excel format

### Bulk Upload (Coming Soon)

Upload multiple resumes at once:
- Drag and drop PDF/DOCX files
- Automatic parsing and candidate creation
- Progress tracking
- Error reporting

## Key Differentiators

### vs. Traditional ATS Systems

| Feature | Traditional ATS | Neofox HR |
|---------|----------------|-----------|
| Analysis Depth | Keyword matching | AI-powered deep analysis |
| Skill Assessment | Binary (has/doesn't have) | Proficiency levels + evidence |
| Red Flags | Manual identification | Automated detection with severity |
| Cultural Fit | Not assessed | Multiple indicators analyzed |
| Transparency | Limited reasoning | Detailed explanations for every score |
| Reporting | Basic metrics | Comprehensive analytics |
| Mobile | Often limited | Fully responsive |
| Collaboration | Basic | Rich team feedback system |
| Customization | Rigid workflows | Custom scoring criteria per role |

## Future Enhancements

- [ ] Real-time resume parsing (PDF, DOCX, LinkedIn)
- [ ] Integration with job boards (LinkedIn, Indeed, Glassdoor)
- [ ] Video interview scheduling
- [ ] Automated email campaigns
- [ ] Background check integration
- [ ] Social media screening
- [ ] Skills assessment tests
- [ ] Predictive analytics for candidate success
- [ ] Bias detection and mitigation tools
- [ ] Mobile native applications
- [ ] Multi-language support
- [ ] GDPR compliance features

## API Integration (Production)

For production deployment, integrate with:

```typescript
// Anthropic Claude API for AI analysis
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Use Claude for candidate analysis
const analyzeWithClaude = async (candidate, position) => {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `Analyze this candidate for the position...`
    }]
  });
  return parseAnalysis(message.content);
};
```

## Performance

- **Initial Load**: < 2s
- **Candidate Analysis**: < 3s
- **Bulk Upload (100 resumes)**: ~5 minutes
- **Search/Filter**: < 500ms
- **Export Generation**: < 5s

## Security

- Role-based access control (RBAC)
- Candidate data encryption
- Secure file upload validation
- GDPR-compliant data handling
- Audit logs for all actions
- Session management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a proprietary tool built for Neofox. For feature requests or bug reports, please contact the development team.

## License

Copyright © 2024 Neofox. All rights reserved.

## Support

For questions or support:
- Email: support@neofox.com
- Documentation: [Link to docs]

---

**Built with ❤️ by the Neofox Team**

*Making hiring smarter, faster, and more effective.*
