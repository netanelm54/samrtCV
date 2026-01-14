import paymentService from '../services/paymentService.js'

class PaymentController {
  /**
   * Create Stripe checkout session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCheckoutSession(req, res) {
    try {
      const { serviceOption, customerEmail, metadata, embedded = true } = req.body

      if (!serviceOption) {
        return res.status(400).json({ error: 'Service option is required' })
      }

      if (!customerEmail) {
        return res.status(400).json({ error: 'Customer email is required' })
      }

      const validOptions = ['analysis', 'improved', 'complete']
      if (!validOptions.includes(serviceOption)) {
        return res.status(400).json({ error: 'Invalid service option' })
      }

      // Build success and cancel URLs
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const successUrl = `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${frontendUrl}/payment-cancel`
      const returnUrl = `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`

      // Create checkout session (embedded by default)
      const session = await paymentService.createCheckoutSession({
        serviceOption,
        customerEmail,
        successUrl,
        cancelUrl,
        returnUrl,
        embedded,
        metadata: metadata || {}
      })

      console.log('Checkout session created:', {
        sessionId: session.id,
        hasClientSecret: !!session.client_secret,
        uiMode: session.ui_mode,
        embedded: embedded
      })

      res.json({
        sessionId: session.id,
        url: session.url,
        clientSecret: session.client_secret, // For embedded checkout
        paymentMode: paymentService.isTestMode() ? 'test' : 'live',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      res.status(500).json({ error: error.message || 'Failed to create checkout session' })
    }
  }

  /**
   * Verify payment session (for test mode bypass)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifySession(req, res) {
    try {
      const { sessionId } = req.body

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' })
      }

      const session = await paymentService.getCheckoutSession(sessionId)

      // In test mode, we allow bypassing payment
      // In production mode, payment must be completed
      const isTestMode = paymentService.isTestMode()
      const isPaid = session.payment_status === 'paid'

      if (!isTestMode && !isPaid) {
        return res.status(400).json({ 
          error: 'Payment not completed',
          paid: false 
        })
      }

      res.json({
        paid: isTestMode || isPaid,
        sessionId: session.id,
        paymentMode: isTestMode ? 'test' : 'live',
        metadata: session.metadata
      })
    } catch (error) {
      console.error('Error verifying session:', error)
      res.status(500).json({ error: error.message || 'Failed to verify session' })
    }
  }
}

export default new PaymentController()

