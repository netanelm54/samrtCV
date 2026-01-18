import Stripe from 'stripe'

class PaymentService {
  constructor() {
    this._stripe = null
    this.paymentMode = process.env.PAYMENT_MODE || 'test'
  }

  /**
   * Get Stripe client instance (lazy initialization)
   * @returns {Stripe} Stripe client
   */
  get stripe() {
    if (!this._stripe) {
      const secretKey = process.env.STRIPE_SECRET_KEY
      if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
      }
      this._stripe = new Stripe(secretKey)
    }
    return this._stripe
  }

  /**
   * Get price for a service option
   * @param {string} serviceOption - 'analysis', 'improved', or 'complete'
   * @returns {number} Price in USD
   */
  getPrice(serviceOption) {
    const prices = {
      analysis: parseFloat(process.env.PRICE_ANALYSIS_ONLY || '3.90'),
      improved: parseFloat(process.env.PRICE_IMPROVED_ONLY || '6.90'),
      complete: parseFloat(process.env.PRICE_COMPLETE_PACKAGE || '9.90')
    }
    return prices[serviceOption] || 0
  }

  /**
   * Create a Stripe checkout session
   * @param {Object} params - Checkout session parameters
   * @param {string} params.serviceOption - Service option ('analysis', 'improved', 'complete')
   * @param {string} params.customerEmail - Customer email
   * @param {string} params.successUrl - Success redirect URL
   * @param {string} params.cancelUrl - Cancel redirect URL
   * @param {string} params.returnUrl - Return URL for embedded checkout
   * @param {boolean} params.embedded - Whether to create embedded checkout
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} Stripe checkout session
   */
  async createCheckoutSession({ serviceOption, customerEmail, successUrl, cancelUrl, returnUrl, embedded = false, metadata = {} }) {
    const price = this.getPrice(serviceOption)
    const priceInCents = Math.round(price * 100)

    // In test mode, we can create a session but it won't charge
    // In production mode, it will charge normally
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: this.getServiceName(serviceOption),
              description: this.getServiceDescription(serviceOption)
            },
            unit_amount: priceInCents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        serviceOption,
        paymentMode: this.paymentMode,
        ...metadata
      }
    }

    // For embedded checkout, use return_url instead of success_url/cancel_url
    if (embedded) {
      sessionParams.ui_mode = 'embedded'
      sessionParams.return_url = returnUrl || successUrl
    } else {
      sessionParams.success_url = successUrl
      sessionParams.cancel_url = cancelUrl
    }

    // In test mode, add test mode indicator
    if (this.paymentMode === 'test') {
      sessionParams.payment_method_options = {
        card: {
          request_three_d_secure: 'automatic'
        }
      }
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams)
    return session
  }

  /**
   * Verify webhook signature
   * @param {string} payload - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Stripe event object
   */
  verifyWebhook(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`)
    }
  }

  /**
   * Check if payment mode is test
   * @returns {boolean}
   */
  isTestMode() {
    return this.paymentMode === 'test'
  }

  /**
   * Get service name for display
   * @param {string} serviceOption
   * @returns {string}
   */
  getServiceName(serviceOption) {
    const names = {
      analysis: 'CV Analysis Report',
      improved: 'Improved CV Templates',
      complete: 'Complete CV Package'
    }
    return names[serviceOption] || 'CV Service'
  }

  /**
   * Get service description
   * @param {string} serviceOption
   * @returns {string}
   */
  getServiceDescription(serviceOption) {
    const descriptions = {
      analysis: 'Detailed CV analysis report with match score and recommendations',
      improved: '2 professionally improved CV templates ready to send',
      complete: 'Full analysis report + 2 improved CV templates'
    }
    return descriptions[serviceOption] || 'CV analysis and improvement service'
  }

  /**
   * Retrieve checkout session
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise<Object>} Stripe checkout session
   */
  async getCheckoutSession(sessionId) {
    return await this.stripe.checkout.sessions.retrieve(sessionId)
  }
}

export default new PaymentService()

