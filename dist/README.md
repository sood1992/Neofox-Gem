# Production Build - Neofox HR Platform

⚠️ **This build does NOT include an API key** (for security on public GitHub)

## 🚀 Two Deployment Options:

### Option 1: Deploy with Demo Mode (No API Key Needed)

**Perfect for showcasing the platform without AI features:**

1. Download this `dist/` folder from GitHub
2. Upload all contents to cPanel `public_html/`:
   - `index.html`
   - `assets/` folder  
   - `.htaccess`
3. Visit your domain and login
4. Click **"Try Demo"** button (bottom-right)
5. Explore all features with sample data!

### Option 2: Deploy with Full AI Features (Requires Rebuild)

**To enable real AI-powered candidate analysis:**

```bash
# 1. Clone repository
git clone https://github.com/sood1992/Neofox-Gem.git
cd Neofox-Gem

# 2. Install dependencies  
npm install

# 3. Create .env.production with YOUR API key
cat > .env.production << 'ENV'
VITE_ANTHROPIC_API_KEY=your-actual-api-key-here
VITE_USE_REAL_AI=true
ENV

# 4. Build with API key embedded
npm run build -- --mode production

# 5. Upload NEW dist/ folder to cPanel (replaces this one)
```

## 📋 Login Credentials:

- **Admin**: `admin1234`
- **Others**: `user1234`

## ✨ Platform Features:

- AI-Powered Candidate Analysis* (requires API key)
- 10 Advanced HR Screening Tools
- Bulk Upload & Processing
- Analytics Dashboard
- Pipeline Management
- Candidate Comparison
- **Demo Mode** (works without API key!)

*Without API key, AI features use mock data. Demo mode provides realistic sample data for all features.

## 🔧 Need Help?

See main repository README for full documentation.
