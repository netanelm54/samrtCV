import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import * as paymentApi from '../api/paymentApi.js'

/**
 * Payment state management composable
 * Contains payment state, computed properties, and payment actions
 */
export function usePaymentState(setError, clearError) {
	// Payment State
	const isProcessingPayment = ref(false)
	const paymentSessionId = ref(null)
	const paymentMode = ref('test') // 'test' or 'live'
	const stripeInstance = ref(null)

	// Initialize Stripe
	const initializeStripe = async (publishableKey) => {
		if (!publishableKey) {
			throw new Error('Stripe publishable key is required')
		}

		if (!stripeInstance.value) {
			stripeInstance.value = await loadStripe(publishableKey)
		}

		return stripeInstance.value
	}

	// Payment Actions
	const createPaymentSession = async (serviceOption, customerEmail, metadata = {}, embedded = true) => {
		if (isProcessingPayment.value) {
			return null
		}

		isProcessingPayment.value = true
		if (clearError) clearError()

		try {
			const sessionData = await paymentApi.createCheckoutSession(
				serviceOption,
				customerEmail,
				metadata,
				embedded
			)

			paymentSessionId.value = sessionData.sessionId
			paymentMode.value = sessionData.paymentMode || 'test'

			return sessionData
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to create payment session'
			if (setError) setError(errorMessage)
			throw err
		} finally {
			isProcessingPayment.value = false
		}
	}

	const redirectToCheckout = async (publishableKey, sessionId) => {
		try {
			const stripe = await initializeStripe(publishableKey)
			if (!stripe) {
				throw new Error('Failed to initialize Stripe')
			}

			const { error } = await stripe.redirectToCheckout({
				sessionId
			})

			if (error) {
				throw new Error(error.message)
			}
		} catch (err) {
			const errorMessage = err.message || 'Failed to redirect to checkout'
			if (setError) setError(errorMessage)
			throw err
		}
	}

	const verifyPayment = async (sessionId) => {
		if (!sessionId) {
			throw new Error('Session ID is required')
		}

		try {
			const result = await paymentApi.verifySession(sessionId)
			return result
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to verify payment'
			if (setError) setError(errorMessage)
			throw err
		}
	}

	const resetPayment = () => {
		isProcessingPayment.value = false
		paymentSessionId.value = null
		paymentMode.value = 'test'
	}

	return {
		// State
		isProcessingPayment,
		paymentSessionId,
		paymentMode,

		// Actions
		createPaymentSession,
		redirectToCheckout,
		verifyPayment,
		resetPayment,
		initializeStripe
	}
}

