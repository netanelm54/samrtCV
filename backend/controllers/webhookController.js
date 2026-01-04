import paymentService from '../services/paymentService.js'

class WebhookController {
  /**
   * Handle Stripe webhook events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature']
    let event

    try {
      // Verify webhook signature
      event = paymentService.verifyWebhook(req.body, sig)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object)
        break
      case 'payment_intent.succeeded':
        console.log('PaymentIntent was successful!')
        break
      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed!')
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true })
  }

  /**
   * Handle checkout session completed event
   * @param {Object} session - Stripe checkout session object
   */
  async handleCheckoutCompleted(session) {
    console.log('Checkout session completed:', session.id)
    console.log('Payment status:', session.payment_status)
    console.log('Service option:', session.metadata?.serviceOption)
    console.log('Payment mode:', session.metadata?.paymentMode)
    
    // Here you can add logic to:
    // - Store payment record in database
    // - Send confirmation email
    // - Trigger CV processing
    // - Update order status
  }
}

export default new WebhookController()

