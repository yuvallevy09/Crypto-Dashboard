# Crypto Dashboard Deployment Guide

This guide will help you deploy your crypto dashboard to Vercel (frontend) and Railway (backend + database).

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Railway Account**: Sign up at [railway.app](https://railway.app)
4. **Git CLI**: For local development and deployment

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your crypto-dashboard repository
5. Choose the `backend` directory as the source

### 1.2 Set Up PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for the database to be created
4. Copy the database connection string (it will look like: `postgresql://postgres:password@host:port/database`)

### 1.3 Configure Environment Variables

In your Railway project, go to the "Variables" tab and add the following environment variables:

```bash
# Database (Railway will auto-set this)
DATABASE_URL="your-railway-postgres-connection-string"

# JWT (Generate a secure secret)
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5001
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-domain.vercel.app"

# External APIs (use your existing keys)
COINGECKO_API_URL="https://api.coingecko.com/api/v3"
COINGECKO_API_KEY="CG-HshaF1Bard891ivgJCwPa5KM"
CRYPTOPANIC_API_KEY="fb5d0b84f8da406759d94d999d77226e6263ff18"
OPENROUTER_API_KEY="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"

# Reddit API
REDDIT_CLIENT_ID="WyZ2jSBmR5KxcAvLg2Jzeg"
REDDIT_CLIENT_SECRET="bq16KzyCNRzwGsfMI4ZT_iSoU_gwSw"
REDDIT_USER_AGENT="web:crypto-dashboard:v1.0.0 (by /u/Frosty-Ground8595)"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
```

### 1.4 Deploy Backend

1. Railway will automatically detect the Node.js project and start building
2. The build process will:
   - Install dependencies
   - Run `npm run build` to compile TypeScript
   - Start the server with `npm start`
3. Wait for deployment to complete
4. Copy your Railway app URL (e.g., `https://your-app-name.railway.app`)

### 1.5 Set Up Database Schema

1. In Railway, go to your backend service
2. Click on "Deployments" → "Latest"
3. Click "View Logs"
4. You should see the database connection and any Prisma migrations

If you need to run migrations manually:
1. Go to your backend service in Railway
2. Click "Variables" → "Connect to Database"
3. Use the provided connection details to run: `npx prisma db push`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`

### 2.2 Configure Environment Variables

In your Vercel project settings, add:

```bash
NEXT_PUBLIC_API_URL="https://your-railway-app-url.railway.app"
```

### 2.3 Deploy Frontend

1. Click "Deploy"
2. Vercel will build and deploy your Next.js application
3. Wait for deployment to complete
4. Copy your Vercel app URL (e.g., `https://your-app-name.vercel.app`)

## Step 3: Update CORS Configuration

1. Go back to your Railway backend project
2. Update the `CORS_ORIGIN` variable with your Vercel frontend URL:
   ```bash
   CORS_ORIGIN="https://your-app-name.vercel.app"
   ```
3. Redeploy the backend service

## Step 4: Test Your Deployment

1. Visit your Vercel frontend URL
2. Test the following features:
   - User registration/login
   - Onboarding flow
   - Dashboard content loading
   - API calls to external services

## Step 5: Set Up Custom Domains (Optional)

### Vercel Custom Domain
1. In your Vercel project, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

### Railway Custom Domain
1. In your Railway project, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your CORS_ORIGIN accordingly

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check if DATABASE_URL is correctly set in Railway
   - Ensure PostgreSQL service is running
   - Verify Prisma schema is compatible

2. **CORS Errors**
   - Verify CORS_ORIGIN matches your frontend URL exactly
   - Check that credentials are properly configured

3. **Build Failures**
   - Check Railway/Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

4. **API Key Issues**
   - Ensure all API keys are valid and have proper permissions
   - Check rate limits on external APIs

### Monitoring

1. **Railway**: Use the built-in logging and monitoring
2. **Vercel**: Check Analytics and Function logs
3. **Database**: Monitor PostgreSQL performance in Railway

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **API Keys**: Rotate keys regularly and use environment variables
3. **CORS**: Only allow necessary origins
4. **Rate Limiting**: Configure appropriate limits for your use case
5. **HTTPS**: Both Vercel and Railway provide HTTPS by default

## Cost Optimization

1. **Railway**: Monitor usage and set spending limits
2. **Vercel**: Free tier includes generous limits
3. **Database**: Start with Railway's free PostgreSQL tier

## Next Steps

1. Set up monitoring and alerting
2. Configure CI/CD pipelines
3. Set up staging environments
4. Implement backup strategies
5. Add performance monitoring

Your crypto dashboard should now be live and accessible to users worldwide! 🚀
