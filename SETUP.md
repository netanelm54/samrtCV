# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for the root project, frontend, and backend.

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp backend/env.example backend/.env
```

2. Edit `backend/.env` and add your credentials:

#### Stripe Setup
1. Go to https://stripe.com and create an account
2. Get your API keys from the Dashboard → Developers → API keys
3. Add them to `.env`:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)

#### OpenAI Setup
1. Go to https://platform.openai.com and create an account
2. Create an API key from API Keys section
3. Add to `.env`:
   - `OPENAI_API_KEY` (starts with `sk-`)

#### Email Setup (Gmail Recommended)

**Option 1: Gmail**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Add to `.env`:
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your_email@gmail.com`
   - `EMAIL_PASS=your_app_password`
   - `EMAIL_FROM=your_email@gmail.com`

**Option 2: SMTP**
- Configure your SMTP server details in `.env`

### 3. Set Up Stripe Webhook (Development)

For local development, use Stripe CLI:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:5000/api/webhook
```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env`:
   - `STRIPE_WEBHOOK_SECRET=whsec_...`

### 4. Configure Service Price

Edit `SERVICE_PRICE` in `backend/.env`:
```
SERVICE_PRICE=29.99
```

### 5. Run the Application

Start both frontend and backend:
```bash
npm run dev
```

Or run separately:
- Frontend: `npm run dev:frontend` (runs on http://localhost:3000)
- Backend: `npm run dev:backend` (runs on http://localhost:5000)

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Upload a CV (PDF or DOCX)
3. Paste a job description
4. Enter your email
5. Click "Get Analysis"
6. Complete the payment in Stripe Checkout (use test card: 4242 4242 4242 4242)
7. Check your email for the analysis report

## Production Deployment

### Stripe Webhook (Production)

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret to your production `.env`

### Environment Variables Checklist

- [ ] `STRIPE_SECRET_KEY` (use live key for production)
- [ ] `STRIPE_PUBLISHABLE_KEY` (use live key for production)
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `OPENAI_API_KEY`
- [ ] `EMAIL_SERVICE`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`
- [ ] `EMAIL_FROM`
- [ ] `SERVICE_PRICE`
- [ ] `FRONTEND_URL` (your production frontend URL)
- [ ] `PORT` (default: 5000)

## Troubleshooting

### PDF Generation Issues
- Ensure Puppeteer dependencies are installed (Chrome/Chromium)
- On Linux servers, you may need: `apt-get install -y chromium-browser`

### Email Not Sending
- Check email credentials are correct
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder

### Stripe Webhook Not Working
- Verify webhook secret is correct
- Check webhook endpoint is accessible
- Review Stripe Dashboard → Webhooks for error logs

### File Upload Issues
- Check file size is under 10MB
- Verify file is PDF or DOCX format
- Check `backend/uploads` directory has write permissions

