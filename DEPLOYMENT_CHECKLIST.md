# Deployment Checklist

## Pre-Deployment ✅
- [ ] Code is committed to GitHub repository
- [ ] All tests pass locally
- [ ] Environment variables are documented
- [ ] Build process works locally

## Railway Backend Deployment ✅
- [ ] Create Railway account
- [ ] Create new project from GitHub repo
- [ ] Select `backend` directory as source
- [ ] Add PostgreSQL database service
- [ ] Configure environment variables:
  - [ ] DATABASE_URL (auto-set by Railway)
  - [ ] JWT_SECRET (generate secure key)
  - [ ] JWT_EXPIRES_IN="7d"
  - [ ] PORT=5001
  - [ ] NODE_ENV=production
  - [ ] CORS_ORIGIN (will update after frontend deployment)
  - [ ] All API keys (CoinGecko, CryptoPanic, OpenRouter, Reddit)
  - [ ] Rate limiting settings
  - [ ] Logging level
- [ ] Deploy and verify build success
- [ ] Copy Railway app URL
- [ ] Test health endpoint: `https://your-app.railway.app/health`

## Vercel Frontend Deployment ✅
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure project settings:
  - [ ] Framework: Next.js
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
  - [ ] Install Command: `npm ci`
- [ ] Set environment variable:
  - [ ] NEXT_PUBLIC_API_URL="https://your-railway-app.railway.app"
- [ ] Deploy and verify build success
- [ ] Copy Vercel app URL

## Post-Deployment Configuration ✅
- [ ] Update CORS_ORIGIN in Railway with Vercel URL
- [ ] Redeploy Railway backend
- [ ] Test full application flow:
  - [ ] User registration
  - [ ] User login
  - [ ] Onboarding flow
  - [ ] Dashboard loading
  - [ ] External API calls
  - [ ] Feedback system

## Monitoring & Maintenance ✅
- [ ] Set up Railway monitoring
- [ ] Set up Vercel analytics
- [ ] Monitor database performance
- [ ] Set up error tracking (optional)
- [ ] Configure backup strategy

## Security Review ✅
- [ ] All sensitive data in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] API keys secured

## Performance Optimization ✅
- [ ] Enable Vercel caching
- [ ] Optimize database queries
- [ ] Monitor API response times
- [ ] Set up CDN if needed

## Documentation ✅
- [ ] Update README with deployment URLs
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Document API endpoints

---

## Quick Commands

### Local Testing
```bash
# Run deployment preparation script
./scripts/deploy.sh

# Test build locally
npm run build

# Test type checking
npm run type-check
```

### Git Commands
```bash
# Commit deployment changes
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Railway Commands (if using CLI)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy to Railway
railway up
```

### Vercel Commands (if using CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

---

## URLs to Save
- **Backend URL**: `https://your-app-name.railway.app`
- **Frontend URL**: `https://your-app-name.vercel.app`
- **Database URL**: (from Railway dashboard)
- **Health Check**: `https://your-app-name.railway.app/health`

---

## Support Resources
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
