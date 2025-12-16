# Quick Start Deployment Guide

A condensed version of the deployment guide for experienced developers who want to get up and running quickly.

---

## Prerequisites Checklist

- [ ] GitHub repository with your code
- [ ] Stripe account (production keys ready)
- [ ] OpenAI API key
- [ ] Email account (Gmail recommended)
- [ ] Domain name (optional initially)

---

## 5-Minute Deployment

### 1. Code Changes (2 minutes)

**Frontend:** `frontend/src/api/axiosConfig.js`
```javascript
baseURL: import.meta.env.VITE_API_URL || '',
```

**Backend:** `backend/server.js`
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

### 2. Deploy Backend - Railway (2 minutes)

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select repository → Set root directory: `backend`
3. Add environment variables:
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend-url
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (get after step 4)
   OPENAI_API_KEY=sk-...
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com
   SERVICE_PRICE=29.99
   ```
4. Copy backend URL: `https://your-app.up.railway.app`

### 3. Deploy Frontend - Vercel (1 minute)

1. Go to https://vercel.com → Import Git Repository
2. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```
4. Deploy → Copy frontend URL

### 4. Configure Stripe Webhook (1 minute)

1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-backend-url.up.railway.app/api/webhook`
3. Event: `checkout.session.completed`
4. Copy webhook secret → Add to Railway env vars
5. Redeploy backend

---

## Testing

1. Visit frontend URL
2. Upload CV, enter job description
3. Complete test payment (use Stripe test card: 4242 4242 4242 4242)
4. Check email for report

---

## Adding Custom Domain (Optional)

### Frontend (Vercel)
1. Project → Settings → Domains
2. Add domain → Follow DNS instructions
3. Update Railway `FRONTEND_URL` env var

### Backend (Railway)
1. Service → Settings → Networking
2. Add custom domain (e.g., `api.yourdomain.com`)
3. Update Vercel `VITE_API_URL` env var

---

## Common Issues

**Backend not starting?**
- Check Railway logs
- Verify all env vars are set

**Frontend can't connect?**
- Verify `VITE_API_URL` is correct
- Check CORS settings

**Webhook not working?**
- Verify webhook secret matches
- Check Stripe dashboard for errors

---

## Cost Estimate

- Domain: $10-15/year
- Railway: Free → $5/month
- Vercel: Free tier
- **Total: ~$5-10/month**

---

## Next Steps

- [ ] Set up monitoring (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Configure file storage (S3/R2)
- [ ] Set up error alerts

For detailed instructions, see `DEPLOYMENT.md`

