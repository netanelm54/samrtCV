# SmartCV Cloud Deployment Guide

## Recommended Cloud Platform: Vercel + Railway

### Why This Combination?
- **Vercel**: Best-in-class frontend hosting with automatic SSL, CDN, and zero-config deployment
- **Railway**: Simple Node.js backend hosting with automatic deployments and environment management
- **Cost**: Free tiers available, then ~$5-20/month total
- **Setup Time**: ~30 minutes

---

## Domain Recommendations

### Domain Registrars (Best Options)
1. **Namecheap** (~$10-15/year) - Best balance of price and features
2. **Cloudflare Registrar** (~$8-10/year) - Cheapest, includes privacy
3. **Google Domains** (~$12/year) - Simple and reliable

### Domain Name Suggestions
- `smartcv.ai`
- `smartcv.app`
- `getsmartcv.com`
- `cvanalyzer.ai`
- `mysmartcv.com`

---

## Step-by-Step Deployment Guide

### Prerequisites
- [ ] GitHub account
- [ ] Stripe account (with production keys)
- [ ] OpenAI API key
- [ ] Email account (Gmail or SMTP)
- [ ] Domain name (optional for start, can add later)

---

## STEP 1: Prepare Your Code

### 1.1 Update Frontend API Configuration

**File: `frontend/src/api/axiosConfig.js`**
```javascript
import axios from 'axios'

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || '',
	timeout: 300000, // 5 minutes for file uploads
	headers: {
		'Content-Type': 'multipart/form-data'
	}
})

// ... rest of the file remains the same
```

### 1.2 Update Backend CORS Configuration

**File: `backend/server.js`**
Add this after line 13:
```javascript
import cors from 'cors'
// ... existing imports

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
// ... rest of the file
```

### 1.3 Create Production Environment Template

**File: `backend/env.production.example`**
```
# Server Configuration
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Stripe Configuration (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Service Price (in USD)
SERVICE_PRICE=29.99
```

---

## STEP 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### 2.2 Deploy Backend
1. Select "Deploy from GitHub repo"
2. Choose your `smartCV` repository
3. Railway will auto-detect Node.js
4. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Watch Paths**: `backend/**`

### 2.3 Set Environment Variables
In Railway dashboard → Your Service → Variables tab, add:

```
PORT=5000
FRONTEND_URL=https://yourdomain.com (or http://localhost:3000 for testing)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (will get this after webhook setup)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
SERVICE_PRICE=29.99
```

### 2.4 Get Your Backend URL
1. Railway will provide a URL like: `https://your-app-name.up.railway.app`
2. Copy this URL - you'll need it for frontend and Stripe webhook

### 2.5 Test Backend
Visit: `https://your-backend-url.up.railway.app/api/health`
Should return: `{"status":"ok"}`

---

## STEP 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

### 3.2 Configure Project
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables
In Vercel dashboard → Your Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.up.railway.app
```

**Important**: Make sure to add this for:
- Production
- Preview
- Development (optional)

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a URL like: `https://your-app.vercel.app`

### 3.5 Test Frontend
1. Visit your Vercel URL
2. Check browser console for any API errors
3. Test the full flow

---

## STEP 4: Configure Stripe Webhook

### 4.1 Get Webhook Endpoint URL
Your webhook URL will be:
```
https://your-backend-url.up.railway.app/api/webhook
```

### 4.2 Configure in Stripe Dashboard
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-backend-url.up.railway.app/api/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
5. Click "Add endpoint"

### 4.3 Get Webhook Secret
1. Click on your newly created webhook
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### 4.4 Add to Railway Environment Variables
1. Go back to Railway
2. Add/Update: `STRIPE_WEBHOOK_SECRET=whsec_your_secret_here`
3. Railway will automatically redeploy

### 4.5 Test Webhook
1. Make a test purchase
2. Check Railway logs for webhook events
3. Verify email is sent

---

## STEP 5: Set Up Custom Domain

### 5.1 Buy Domain
1. Choose registrar (Namecheap recommended)
2. Search for available domain
3. Purchase domain

### 5.2 Configure Frontend Domain (Vercel)
1. Go to Vercel → Your Project → Settings → Domains
2. Add your domain: `smartcv.ai` (or your domain)
3. Vercel will show DNS records needed:
   - Type: `A` or `CNAME`
   - Value: Vercel's IP or CNAME

### 5.3 Configure DNS Records
1. Go to your domain registrar's DNS settings
2. Add the records Vercel provided:
   - For root domain: Add `A` record pointing to Vercel's IP
   - For www: Add `CNAME` record pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (5 minutes to 48 hours)

### 5.4 Configure Backend Subdomain (Optional but Recommended)
1. In Railway → Service → Settings → Networking
2. Add custom domain: `api.smartcv.ai`
3. Railway will provide DNS records
4. Add `CNAME` record in your DNS:
   - Name: `api`
   - Value: Railway's CNAME target

### 5.5 Update Environment Variables
1. **Railway**: Update `FRONTEND_URL` to `https://smartcv.ai`
2. **Vercel**: Update `VITE_API_URL` to `https://api.smartcv.ai` (if using subdomain)
3. Redeploy both services

---

## STEP 6: File Storage (Production Consideration)

Railway's file system is ephemeral. For production, consider:

### Option 1: Railway Volumes (Simplest)
1. Railway → Service → Volumes
2. Create volume: `uploads`
3. Mount path: `/app/uploads`
4. Update code to use mounted volume

### Option 2: AWS S3 (Recommended for Scale)
1. Create S3 bucket
2. Install AWS SDK: `npm install @aws-sdk/client-s3`
3. Update file upload logic to use S3
4. Set AWS credentials in Railway env vars

### Option 3: Cloudflare R2 (Cheapest)
1. Create R2 bucket
2. Similar to S3 setup
3. No egress fees

---

## STEP 7: Final Configuration Checklist

### Backend (Railway)
- [ ] All environment variables set
- [ ] Backend URL accessible
- [ ] Health check endpoint working
- [ ] CORS configured correctly
- [ ] File uploads working (or S3 configured)

### Frontend (Vercel)
- [ ] Environment variables set
- [ ] Frontend URL accessible
- [ ] API calls working
- [ ] Stripe checkout working
- [ ] Custom domain configured

### Stripe
- [ ] Production keys configured
- [ ] Webhook endpoint configured
- [ ] Webhook secret in environment variables
- [ ] Test payment successful
- [ ] Webhook events received

### Domain & DNS
- [ ] Domain purchased
- [ ] DNS records configured
- [ ] SSL certificates active (automatic)
- [ ] Both frontend and backend accessible via custom domains

### Testing
- [ ] Upload CV file
- [ ] Enter job description
- [ ] Complete payment flow
- [ ] Receive email with report
- [ ] Check all links work
- [ ] Test on mobile devices

---

## Post-Deployment Monitoring

### 1. Set Up Error Tracking
Consider adding Sentry:
```bash
npm install @sentry/node @sentry/vue
```

### 2. Monitor Logs
- **Railway**: Built-in logs dashboard
- **Vercel**: Built-in analytics and logs
- Set up alerts for errors

### 3. Performance Monitoring
- Vercel Analytics (built-in)
- Consider Google Analytics
- Monitor API response times

### 4. Backup Strategy
- Code: GitHub (already done)
- Environment variables: Export from Railway/Vercel
- Database: If you add one later, set up automated backups

---

## Troubleshooting

### Backend Not Starting
- Check Railway logs
- Verify all environment variables are set
- Check Node.js version compatibility
- Verify `package.json` scripts

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration
- Verify backend URL is accessible
- Check browser console for errors

### Stripe Webhook Not Working
- Verify webhook URL is correct
- Check webhook secret matches
- View webhook events in Stripe dashboard
- Check Railway logs for webhook errors

### File Uploads Failing
- Check file size limits
- Verify uploads directory exists
- Check Railway volume mount (if using)
- Consider switching to S3/R2

### Email Not Sending
- Verify email credentials
- Check Gmail app password (if using Gmail)
- Check Railway logs for email errors
- Consider switching to SendGrid/Mailgun

---

## Cost Breakdown

### Monthly Costs (Estimated)
- **Domain**: $1-2/month ($10-15/year)
- **Railway**: Free tier → $5/month (after usage)
- **Vercel**: Free tier → $20/month (Pro plan, optional)
- **Total**: ~$6-27/month

### Free Tier Limits
- **Railway**: $5 credit/month, ~500 hours runtime
- **Vercel**: 100GB bandwidth, unlimited requests
- **Stripe**: 2.9% + $0.30 per transaction

---

## Security Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] Production keys used (not test keys)
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] CORS configured correctly
- [ ] File upload validation in place
- [ ] Rate limiting considered (add if needed)
- [ ] Environment variables secured
- [ ] Webhook signature verification working

---

## Next Steps After Deployment

1. **Set up monitoring**: Add error tracking (Sentry)
2. **Add analytics**: Google Analytics or Plausible
3. **Optimize performance**: Image optimization, caching
4. **Add database**: If you need to store user data
5. **Set up CI/CD**: Already done with Railway/Vercel
6. **Add backup strategy**: For user data
7. **Scale resources**: As traffic grows

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Vue.js Docs**: https://vuejs.org
- **Express Docs**: https://expressjs.com

---

## Quick Reference URLs

After deployment, save these:
- **Frontend URL**: `https://your-app.vercel.app` or `https://yourdomain.com`
- **Backend URL**: `https://your-app.up.railway.app` or `https://api.yourdomain.com`
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com

---

**Last Updated**: [Current Date]
**Deployment Method**: Vercel + Railway
**Estimated Setup Time**: 30-60 minutes

