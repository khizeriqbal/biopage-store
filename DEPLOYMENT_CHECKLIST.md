# Bio Page Store - Deployment Checklist

## Pre-Deployment ✅

- [x] Application built and tested locally
- [x] Database schema created and migrated
- [x] All API routes functional
- [x] Admin panel fully implemented
- [x] JV partner page complete
- [x] Sales funnel pages complete
- [x] Authentication working (NextAuth v5)
- [x] Code committed to Git (master branch)
- [x] .env file properly gitignored

## GitHub Setup (TODO)

- [ ] Create GitHub account if you don't have one (https://github.com)
- [ ] Create new repository named "biopage-store"
- [ ] Copy the Git URL (HTTPS or SSH)
- [ ] Run: `git remote add origin [YOUR_GITHUB_URL]`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify code appears on GitHub

## Vercel Setup (TODO)

- [ ] Create Vercel account (https://vercel.com)
- [ ] Go to https://vercel.com/new
- [ ] Connect your GitHub account
- [ ] Import the biopage-store repository
- [ ] Click "Create Project"

## Environment Variables in Vercel (TODO)

### Database Credentials
- [ ] Copy DATABASE_URL from your .env (Supabase pooling connection)
- [ ] Copy DIRECT_URL from your .env (Supabase direct connection)
- [ ] Add both to Vercel "Environment Variables"

### Authentication
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Set NEXTAUTH_URL to your Vercel URL or custom domain
- [ ] Add both to Vercel

### API Keys (Copy from your current .env)
- [ ] WHOP_API_KEY
- [ ] WHOP_STORE_ID
- [ ] RESEND_API_KEY
- [ ] GEMINI_API_KEY

### Public Keys
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_ADMIN_IDS (can be updated later)

## Deployment (TODO)

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Verify deployment successful (green checkmark)
- [ ] Copy deployment URL

## Post-Deployment Testing (TODO)

- [ ] Visit deployed URL and verify homepage loads
- [ ] Test login page `/login`
- [ ] Create test account with valid email
- [ ] Verify email received from Resend
- [ ] Login with test account
- [ ] Access dashboard at `/dashboard`
- [ ] Test admin panel at `/admin` (if logged in as admin)
- [ ] Visit JV page at `/jv`
- [ ] Test JV signup form
- [ ] Visit sales page at `/sales`
- [ ] Test Whop payment integration
- [ ] Verify affiliate tracking works

## Custom Domain Setup (TODO)

- [ ] Register domain (e.g., biopage.store)
- [ ] Get domain nameservers or DNS records
- [ ] In Vercel project settings → Domains
- [ ] Add custom domain
- [ ] Configure DNS records per Vercel instructions
- [ ] Update NEXTAUTH_URL to custom domain
- [ ] Re-deploy in Vercel
- [ ] Verify custom domain works

## Production Optimization (TODO)

- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure error reporting
- [ ] Set up alerts for deployment failures
- [ ] Enable auto-deployments from GitHub
- [ ] Set up CI/CD checks (optional)
- [ ] Review security settings
- [ ] Set up custom 404/500 error pages (if desired)

## Database Maintenance (TODO)

- [ ] Backup Supabase database regularly
- [ ] Monitor database usage/performance
- [ ] Set up automated backups in Supabase
- [ ] Review slow queries

## Email & Communication (TODO)

- [ ] Test email delivery from Resend
- [ ] Configure email templates
- [ ] Set up welcome email sequence
- [ ] Test affiliate notification emails
- [ ] Verify admin notification emails

## Analytics & Monitoring (TODO)

- [ ] Verify analytics tracking working
- [ ] Monitor affiliate tracking accuracy
- [ ] Check conversion metrics
- [ ] Review Whop payment integration analytics
- [ ] Monitor email delivery rates

## Final Verification

- [ ] All pages load without errors
- [ ] All forms submit correctly
- [ ] All API calls successful
- [ ] Payment processing works
- [ ] Email delivery working
- [ ] Custom domain functional
- [ ] Admin panel accessible
- [ ] Affiliate system operational

---

## Quick Start Commands

```bash
# 1. Add GitHub remote and push
cd "D:\bio page final\biopage-store"
git remote add origin https://github.com/YOUR_USERNAME/biopage-store.git
git branch -M main
git push -u origin main

# 2. Generate NEXTAUTH_SECRET (if on Linux/Mac with openssl)
openssl rand -base64 32

# 3. After Vercel deployment, run migrations:
npx prisma migrate deploy
```

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **NextAuth Docs**: https://authjs.dev

---

**Estimated Time**: 2-3 hours for complete setup
**Difficulty**: Intermediate (mostly configuration)
**Support**: Check deployment logs in Vercel dashboard for detailed error messages

