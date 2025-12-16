# Environment Variables Guide

Complete reference for all environment variables used in the SmartCV application.

---

## Backend Environment Variables

### Server Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `5000` | No (default: 5001) |
| `FRONTEND_URL` | Frontend URL for CORS | `https://smartcv.ai` | Yes (production) |

### Stripe Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_live_...` or `sk_test_...` | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable API key | `pk_live_...` or `pk_test_...` | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` | Yes |

**Getting Stripe Keys:**
1. Go to https://dashboard.stripe.com
2. Navigate to Developers → API keys
3. Copy Secret key and Publishable key
4. Use `sk_test_` and `pk_test_` for testing
5. Use `sk_live_` and `pk_live_` for production

**Getting Webhook Secret:**
1. Go to Developers → Webhooks
2. Create endpoint: `https://your-backend-url/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret (starts with `whsec_`)

### OpenAI Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | Yes |
| `OPENAI_MODEL` | Model to use | `gpt-4o` | No (default: gpt-4o) |

**Getting OpenAI Key:**
1. Go to https://platform.openai.com
2. Navigate to API Keys
3. Create new secret key
4. Copy the key (starts with `sk-`)

### Email Configuration

#### Gmail Setup (Recommended)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EMAIL_SERVICE` | Email service provider | `gmail` | Yes |
| `EMAIL_USER` | Gmail address | `your_email@gmail.com` | Yes |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` | Yes |
| `EMAIL_FROM` | From email address | `your_email@gmail.com` | Yes |

**Setting up Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and your device
4. Generate password
5. Copy the 16-character password (spaces don't matter)

#### SMTP Setup (Alternative)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EMAIL_SERVICE` | Email service provider | `smtp` | Yes |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` | Yes |
| `SMTP_PORT` | SMTP server port | `587` | Yes |
| `SMTP_USER` | SMTP username | `your_email@gmail.com` | Yes |
| `SMTP_PASS` | SMTP password | `your_password` | Yes |
| `EMAIL_FROM` | From email address | `your_email@gmail.com` | Yes |

**Common SMTP Providers:**
- **Gmail**: `smtp.gmail.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`

### Service Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SERVICE_PRICE` | Price in USD | `29.99` | No (default: 29.99) |

---

## Frontend Environment Variables

### API Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `https://api.smartcv.ai` | Yes (production) |

**Note:** In development, this can be empty (uses proxy). In production, set to your backend URL.

---

## Environment File Templates

### Development (`backend/.env`)

```env
# Server Configuration
PORT=5001
FRONTEND_URL=http://localhost:3000

# Stripe Configuration (TEST KEYS)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
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

### Production (`backend/.env` or Railway/Vercel Environment Variables)

```env
# Server Configuration
PORT=5000
FRONTEND_URL=https://smartcv.ai

# Stripe Configuration (LIVE KEYS)
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

### Frontend Production (Vercel Environment Variables)

```env
VITE_API_URL=https://api.smartcv.ai
```

---

## Setting Environment Variables in Cloud Platforms

### Railway (Backend)

1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Railway will automatically redeploy

### Vercel (Frontend)

1. Go to your Vercel project
2. Go to Settings → Environment Variables
3. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url`
   - Environments: Select Production, Preview, Development
4. Redeploy your application

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use different keys for development and production**
3. **Rotate keys regularly** - Especially if exposed
4. **Use app passwords for Gmail** - Never use your regular password
5. **Restrict API keys** - Set IP restrictions if possible
6. **Monitor usage** - Check Stripe and OpenAI dashboards regularly
7. **Use environment-specific values** - Don't mix test and production keys

---

## Testing Environment Variables

### Backend Health Check

```bash
curl https://your-backend-url/api/health
```

Should return: `{"status":"ok"}`

### Check Environment Variables (Backend)

Add this temporarily to `server.js` for debugging:
```javascript
console.log('Environment check:', {
  port: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasEmailConfig: !!process.env.EMAIL_USER
})
```

### Frontend Environment Check

Add this to your Vue component:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

---

## Troubleshooting

### "Missing environment variable" errors
- Check variable name spelling (case-sensitive)
- Verify variable is set in cloud platform
- Restart/redeploy after adding variables

### CORS errors
- Verify `FRONTEND_URL` matches your actual frontend domain
- Check for trailing slashes
- Ensure protocol matches (http vs https)

### Stripe webhook errors
- Verify `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe dashboard
- Check webhook endpoint URL is correct
- Verify webhook is listening to correct events

### Email not sending
- Verify Gmail app password (not regular password)
- Check email credentials are correct
- Verify SMTP settings if using custom SMTP

---

## Quick Reference

**Backend Required Variables:**
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

**Frontend Required Variables:**
- `VITE_API_URL` (production only)

