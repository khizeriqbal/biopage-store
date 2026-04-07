# Bio Page Store - Vercel Deployment Guide

Your application is built and committed to Git. Follow these steps to deploy to Vercel.

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository with name: `biopage-store`
3. Do NOT initialize with README (we already have code)
4. Click "Create repository"
5. You'll see instructions - copy your HTTPS or SSH URL

## Step 2: Push Code to GitHub

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username, then run:

```bash
cd "D:\bio page final\biopage-store"

# If using HTTPS:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/biopage-store.git
git branch -M main
git push -u origin main

# OR if using SSH:
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/biopage-store.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub repo URL and click "Continue"
4. Authorize Vercel to access your GitHub
5. Select the repository and click "Import"
6. You'll see the "Create Project" page with Next.js detected

## Step 4: Configure Environment Variables in Vercel

**CRITICAL**: Before deploying, add all environment variables.

In the Vercel project settings, add these variables in the "Environment Variables" section:

### Database
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&sslmode=require
DIRECT_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&sslmode=require
```
(Copy from your `.env` file - use the pooling connection for DATABASE_URL)

### Authentication
```
NEXTAUTH_SECRET=[Generate from: openssl rand -base64 32]
NEXTAUTH_URL=https://yourdomain.com
```
(Replace yourdomain.com with your actual domain or vercel app URL)

### Payment Processing (Whop)
```
WHOP_API_KEY=[your whop api key]
WHOP_STORE_ID=[your whop store id]
```

### Email (Resend)
```
RESEND_API_KEY=[your resend api key]
```

### AI (Google Gemini)
```
GEMINI_API_KEY=[your google gemini api key]
```

### Admin Configuration
```
NEXT_PUBLIC_ADMIN_IDS=[will be set after first login]
```

### Supabase (Public Keys)
```
NEXT_PUBLIC_SUPABASE_URL=[from supabase project settings]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from supabase project settings]
```

## Step 5: Complete the Vercel Deployment

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://biopage-store.vercel.app`

## Step 6: Database Setup in Production

After first deployment:

1. SSH into your deployed app or use Vercel CLI:
```bash
npm i -g vercel
vercel env pull  # This pulls env vars locally
npx prisma migrate deploy  # This runs migrations on production
```

OR via Vercel dashboard:
1. Go to your project settings
2. Click "Deployments"
3. Use the "..." menu to access deployment logs
4. Run migrations from there if needed

## Step 7: Test Production Deployment

1. Visit your Vercel URL
2. Test sign up at `/login`
3. Create a test user and verify email works
4. Test admin panel at `/admin`
5. Test JV page at `/jv`
6. Test sales funnel at `/sales`, `/oto1`, etc.

## Step 8: Configure Custom Domain

1. In Vercel project settings → "Domains"
2. Add your domain (e.g., biopage.store)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` in Vercel env vars to your custom domain

## Step 9: Monitor and Debug

- **Real-time logs**: Vercel dashboard → Deployments → select deployment → "Logs"
- **Build errors**: Check the deployment log if build fails
- **Runtime errors**: Check the "Function Logs" in the Deployments section
- **Database issues**: Check Supabase dashboard for connection issues

## Troubleshooting

### Build Fails with "Missing DATABASE_URL"
- Verify all env vars are set in Vercel project settings
- Don't use `.env` files in production - use Vercel's Environment Variables UI

### "PrismaClientValidationError" after deploy
- Run: `npx prisma migrate deploy`
- Check that DIRECT_URL is set correctly

### Emails not sending
- Verify RESEND_API_KEY is set
- Check Resend dashboard for failed sends

### Whop integration not working
- Verify WHOP_API_KEY and WHOP_STORE_ID are correct
- Test in Whop dashboard

## After Deployment

- [ ] Test all payment flows with Whop in production
- [ ] Configure email templates in Resend
- [ ] Test affiliate tracking with test users
- [ ] Verify custom domain DNS
- [ ] Set up monitoring/alerts
- [ ] Configure Vercel CI/CD for auto-deploys on GitHub push

---

**Total deployment time**: ~30 minutes
**Next.js version**: 14.2.20
**Node version required**: 18.17+
**Database**: PostgreSQL via Supabase

Need help? Check deployment logs in Vercel dashboard.
