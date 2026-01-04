import express from 'express'
import paymentController from '../controllers/paymentController.js'
import webhookController from '../controllers/webhookController.js'

const router = express.Router()

// Webhook endpoint must use raw body for signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookController.handleWebhook.bind(webhookController)
)

// Create checkout session
router.post('/create-checkout-session', paymentController.createCheckoutSession.bind(paymentController))

// Verify payment session
router.post('/verify-session', paymentController.verifySession.bind(paymentController))

export default router

