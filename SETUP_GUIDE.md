# Neofox HR - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Claude API Key (Optional but Recommended)

#### Get Your API Key
1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

#### Add API Key to Your Project
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:
   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   ```

3. Enable real AI analysis in `config/config.ts`:
   ```typescript
   features: {
     useRealAI: true, // Change from false to true
   }
   ```

**Note:** The app works without an API key using sophisticated mock analysis. Real AI provides enhanced accuracy.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Login with Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin (Full Access) | Sarah Chen | `admin1234` |
| HR Manager | Michael Rodriguez | `user1234` |
| Recruiter | Any other user | `user1234` |

---

## 📋 Features Overview

### Core Functionality
- ✅ **AI-Powered Analysis** - 10-parameter candidate evaluation
- ✅ **Bulk Upload** - Drag-drop, LinkedIn URL, or manual entry
- ✅ **Hiring Pipeline** - Kanban-style drag-and-drop board
- ✅ **Advanced Filtering** - Search, sort, and filter candidates
- ✅ **Side-by-Side Comparison** - Compare up to 4 candidates
- ✅ **Analytics Dashboard** - Time-to-hire, cost-per-hire, source effectiveness
- ✅ **Position Management** - Create and track job openings

### AI Analysis Includes
- Technical skills matching (25% weight)
- Experience evaluation (20% weight)
- Education assessment (10% weight)
- Cultural fit indicators (15% weight)
- Communication skills (10% weight)
- Leadership potential (5% weight)
- Career progression (5% weight)
- Salary alignment (5% weight)
- Availability fit (3% weight)
- Location fit (2% weight)

---

## 🔧 Configuration Options

### Analysis Weights
Edit `config/config.ts` to customize scoring weights:
```typescript
analysis: {
  weights: {
    technicalSkills: 0.25,  // Adjust as needed
    experience: 0.20,
    // ... customize other weights
  }
}
```

### Mock vs Real AI
- **Mock AI** (default): Uses sophisticated algorithms to simulate analysis
- **Real AI**: Uses Claude API for enhanced natural language understanding

Toggle in `config/config.ts`:
```typescript
features: {
  useRealAI: false, // true = use Claude API, false = use mock
}
```

---

## 📦 Production Deployment

### Environment Variables for Production
Create a `.env.production` file:
```env
VITE_ANTHROPIC_API_KEY=your-production-api-key
VITE_APP_ENV=production
```

### Build for Production
```bash
npm run build
```

### Deploy
The `dist` folder contains your production build. Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Your own server

### Database Setup (Recommended for Production)
Currently using LocalStorage (browser-based). For production:

1. Set up PostgreSQL database
2. Replace `services/storageService.ts` with database calls
3. Add database URL to environment:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/neofox_hr
   ```

---

## 🔒 Security Best Practices

### API Key Security
- ✅ Never commit `.env` files to git (already in `.gitignore`)
- ✅ Use environment-specific keys (development vs production)
- ✅ Rotate API keys regularly
- ✅ Set up API key usage limits in Anthropic Console

### Data Privacy
- Store sensitive candidate data securely
- Implement user authentication (currently demo mode)
- Enable HTTPS in production
- Follow GDPR/privacy regulations for candidate data

---

## 🐛 Troubleshooting

### API Key Issues
**Problem:** "API key not configured" error

**Solution:**
1. Verify `.env` file exists in project root
2. Ensure key starts with `sk-ant-`
3. Restart dev server after adding `.env`
4. Check `config.features.useRealAI` is set to `true`

### Build Errors
**Problem:** TypeScript errors during build

**Solution:**
```bash
npm install
npx tsc --noEmit
```

### Data Not Persisting
**Problem:** Data lost after page refresh

**Solution:**
- Clear browser cache and localStorage
- Check browser console for storage errors
- For production, implement database storage

---

## 📊 Sample Data

The app includes seed data for testing:
- 4 HR team members
- 2 open positions (Senior Full Stack Engineer, Product Designer)
- 2 sample candidates with AI analysis

To reset data:
1. Open browser console
2. Run: `localStorage.clear()`
3. Refresh page

---

## 💡 Tips for Best Results

### Uploading Candidates
1. **Drag & Drop**: Best for PDFs and Word docs
2. **LinkedIn URL**: Fast import for public profiles
3. **Manual Entry**: Most accurate for complete data

### Using AI Analysis
- More detailed candidate profiles = better analysis
- Include skills, experience details, and education
- Red flags are automatically detected (gaps, frequent changes)

### Hiring Pipeline
- Drag candidates between stages
- Click cards to view detailed analysis
- Use filters to focus on specific positions

---

## 🆘 Support

For issues or questions:
1. Check this guide first
2. Review `README.md` for feature details
3. Check browser console for errors
4. Ensure all dependencies are installed

---

## 📝 License

Proprietary - Neofox HR Platform

---

**Version:** 1.0.0
**Last Updated:** 2025-11-26
