# AI Career Matcher - Smart CV

An AI-powered web application that analyzes CVs/Resumes against job descriptions and provides detailed improvement recommendations.

## Features

- 📄 Upload CV/Resume (PDF or DOCX format)
- 📝 Input job description
- 💳 Secure payment via Stripe
- 🤖 AI-powered analysis using OpenAI GPT-4o
- 📊 Detailed PDF report with:
  - Match score (0-100)
  - Missing keywords
  - Critical gaps
  - Actionable fixes
  - Interview preparation questions
- 📧 Automated email delivery of the report

## Tech Stack

### Frontend
- Vue 3
- Vite
- Stripe.js
- Axios

### Backend
- Node.js
- Express
- Stripe API
- OpenAI API
- PDF generation (pdf-lib)
- Email (Nodemailer)
- File processing (pdf-parse, mammoth)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Stripe account
- OpenAI API key
- Email account (Gmail or SMTP)

### Installation

1. Clone the repository and install dependencies:

```bash
npm run install:all
```

2. Configure environment variables:

Copy `backend/env.example` to `backend/.env` and fill in your credentials:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your:
- Stripe API keys (from Stripe Dashboard)
- OpenAI API key
- Email credentials
- Service price

### Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to Stripe CLI:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:5000/api/webhook
```

4. Copy the webhook signing secret and add it to `backend/.env` as `STRIPE_WEBHOOK_SECRET`

For production, configure the webhook endpoint in your Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhook`
- Events: `checkout.session.completed`

### Running the Application

Development mode (runs both frontend and backend):

```bash
npm run dev
```

Or run separately:

```bash
# Frontend (port 3000)
npm run dev:frontend

# Backend (port 5000)
npm run dev:backend
```

### Building for Production

```bash
npm run build
```

The frontend build will be in `frontend/dist/`

## Configuration

### Changing the Service Price

Edit the `SERVICE_PRICE` variable in `backend/.env`:

```
SERVICE_PRICE=29.99
```

The price is in USD. The Stripe checkout will automatically convert this to cents.

### Email Configuration

#### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASS`

#### SMTP Setup

Set `EMAIL_SERVICE=smtp` and configure:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Project Structure

```
smartCV/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LandingPage.vue
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook` - Stripe webhook handler

## Workflow

1. User uploads CV, enters job description and email
2. Frontend creates Stripe checkout session via backend API
3. User completes payment on Stripe Checkout
4. Stripe sends webhook to backend
5. Backend processes:
   - Extracts text from CV
   - Analyzes with OpenAI
   - Generates PDF report
   - Sends email with PDF attachment
6. User receives email with analysis report

## Accessibility (A11Y)

**All code changes MUST follow accessibility guidelines.**

This project follows WCAG 2.1 Level AA standards. Before submitting any code:

1. **Review the Accessibility Rules**: See `frontend/src/rules/A11Y_RULES.md`
2. **Test with keyboard navigation**: Ensure all features work without a mouse
3. **Test with screen readers**: Use NVDA (Windows) or VoiceOver (Mac)
4. **Check color contrast**: Use WebAIM Contrast Checker
5. **Verify focus indicators**: All interactive elements must have visible focus

### Quick Checklist

- [ ] Semantic HTML used where possible
- [ ] ARIA attributes added for custom widgets
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Images have alt text
- [ ] Dynamic content has live regions

See `frontend/src/rules/A11Y_RULES.md` for complete guidelines.

## Security Notes

- Never commit `.env` files
- Use environment variables for all sensitive data
- Validate file uploads (type and size)
- Use HTTPS in production
- Implement rate limiting for production
- Store session data in Redis/database for production

## License

ISC

