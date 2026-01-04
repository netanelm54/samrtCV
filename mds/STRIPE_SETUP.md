# Stripe Payment Integration Setup Guide

This guide explains how to set up Stripe payment integration with test and production modes.

## Overview

The application supports two payment modes:
- **Test Mode**: Shows payment page but doesn't charge real money (uses test cards)
- **Production Mode**: Real payments are processed

## Required Stripe API Keys

### For Test Mode

1. Go to [Stripe Dashboard - Test Mode](https://dashboard.stripe.com/test/apikeys)
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### For Production Mode

1. Switch to **Live Mode** in Stripe Dashboard (toggle in top right)
2. Go to [Stripe Dashboard - Live Mode](https://dashboard.stripe.com/apikeys)
3. Copy the following keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Environment Variables Setup

### Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Payment Mode: 'test' or 'production'
PAYMENT_MODE=test

# Stripe Configuration
# For test mode, use test keys (pk_test_ and sk_test_)
# For production mode, use live keys (pk_live_ and sk_live_)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Service Prices (in USD)
PRICE_ANALYSIS_ONLY=5.00
PRICE_IMPROVED_ONLY=18.00
PRICE_COMPLETE_PACKAGE=20.00
```

### Frontend Environment Variables

Create a `.env` file in `frontend/` directory:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_API_URL=http://localhost:5001
```

For production, update with live keys:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_API_URL=https://your-backend-url.com
```

## Webhook Setup

### Test Mode Webhook

1. Go to [Stripe Dashboard - Test Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   - Local: `http://localhost:5001/api/webhook`
   - Production: `https://your-backend-url.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Click **"Add endpoint"**
6. Click on the webhook to reveal the **Signing secret** (starts with `whsec_`)
7. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in your `.env`

### Production Mode Webhook

1. Switch to **Live Mode** in Stripe Dashboard
2. Go to [Stripe Dashboard - Live Webhooks](https://dashboard.stripe.com/webhooks)
3. Follow the same steps as test mode
4. Use your production backend URL

## Testing Payment Flow

### Test Mode Testing

1. Set `PAYMENT_MODE=test` in backend `.env`
2. Use test card: `4242 4242 4242 4242`
3. Use any future expiry date (e.g., `12/34`)
4. Use any 3-digit CVC (e.g., `123`)
5. Use any ZIP code (e.g., `12345`)
6. No real charge will be made

### Production Mode

1. Set `PAYMENT_MODE=production` in backend `.env`
2. Use real credit cards
3. Real charges will be processed
4. Ensure webhook is configured correctly

## Payment Flow

1. User selects service option and enters email
2. User clicks "Continue to Payment"
3. Payment modal shows (with test mode banner if in test mode)
4. User is redirected to Stripe Checkout
5. User completes payment
6. Stripe redirects to `/payment-success?session_id=xxx`
7. Backend verifies payment session
8. CV processing begins automatically
9. User receives email with results

## Test Cards

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

See [Stripe Test Cards](https://stripe.com/docs/testing#cards) for more options.

## Troubleshooting

### Payment Not Processing

1. Check that `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` match the mode (test/live)
2. Verify `PAYMENT_MODE` matches your keys
3. Check backend logs for errors
4. Verify webhook secret is correct

### Webhook Not Working

1. Ensure webhook URL is accessible (use ngrok for local testing)
2. Verify webhook secret matches Stripe dashboard
3. Check Stripe dashboard → Webhooks → Events for errors
4. Ensure endpoint uses `express.raw({ type: 'application/json' })`

### Frontend Can't Load Stripe

1. Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set
2. Check browser console for errors
3. Ensure Stripe.js is loaded: `@stripe/stripe-js` package installed

## Security Notes

- **Never commit** `.env` files with real keys
- Use test keys for development
- Rotate keys if exposed
- Use environment variables, never hardcode keys
- Enable Stripe webhook signature verification (already implemented)

## Next Steps

1. Get Stripe account: https://stripe.com
2. Copy test keys to `.env` files
3. Set up webhook endpoint
4. Test payment flow with test card
5. Switch to production keys when ready to go live

